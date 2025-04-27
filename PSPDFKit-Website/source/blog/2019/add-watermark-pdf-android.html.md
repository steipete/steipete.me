---
title: "Add a Watermark to a PDF on Android"
description: "How to add a watermark to a PDF on Android."
preview_image: /images/blog/2019/add-watermark-pdf-android/article-header.png
section: blog
author:
  - Reinhard Hafenscher
date: 2019-09-17 8:00 UTC
tags: Android, Development, PDF, How-To
published: true
secret: false
---

Adding watermarks to PDFs is a pretty common task, and luckily, PSPDFKit comes with the tools needed to handle this easily. READMORE In today’s blog post, we’ll take a look at how to watermark your PDF while presenting it to the user, as well as how to make watermarks a permanent part of your document.

## Creating a Temporary Watermark

To create a temporary watermark, you need to do three things:

1. Create your [`PdfDrawable`][], which is responsible for actually rendering the watermark.
2. Create a [`PdfDrawableProvider`][], which will tell PSPDFKit on which page which [`PdfDrawable`][] should be displayed.
3. Register your [`PdfDrawableProvider`][] with all the components you want the watermark to appear in.

Let’s start by creating the [`PdfDrawable`][]. For this example, we’ll simply draw some text on each page:

```kotlin
/**
 * An implementation of `PdfDrawable`, which overlays the page
 * with a semi-transparent text tilted by 45 degrees.
 */
class WatermarkDrawable(private val text: String, startingPoint: Point) : PdfDrawable() {

    private val textPaint = Paint()
    private val pageCoordinates = RectF()
    private val screenCoordinates = RectF()

    init {
        textPaint.color = Color.RED
        textPaint.style = Paint.Style.FILL
        textPaint.alpha = 50
        textPaint.textSize = 100f
        calculatePageCoordinates(text, startingPoint)
    }

    private fun calculatePageCoordinates(text: String, point: Point) {
        val textBounds = Rect()
        textPaint.getTextBounds(text, 0, text.length, textBounds)
        // We calculate the size of the text once and then transform it
        // so it scrolls with the PDF.
        pageCoordinates.set(
            point.x.toFloat(), (point.y + textBounds.height()).toFloat(),
            (point.x + textBounds.width()).toFloat(), point.y.toFloat()
        )
    }

    private fun updateScreenCoordinates() {
        // We transform our page coordinates to screen coordinates so our
        // watermark scrolls and zooms with the page.
        pdfToPageTransformation.mapRect(screenCoordinates, pageCoordinates)

        // Rounding out ensures no clipping of content.
        val bounds = bounds
        screenCoordinates.roundOut(bounds)
        setBounds(bounds)
    }

    /**
     * All the drawing is performed here. Keep this method fast to maintain 60 FPS.
     */
    override fun draw(canvas: Canvas) {
        val bounds = bounds
        canvas.save()
        // Rotate text by 45 degrees.
        canvas.rotate(-45f, bounds.left.toFloat(), bounds.bottom.toFloat())

        // Recalculate text size to match new bounds.
        setTextSizeForWidth(textPaint, bounds.width().toFloat(), text)

        canvas.drawText(text, bounds.left.toFloat(), bounds.bottom.toFloat(), textPaint)
        canvas.restore()
    }

    private fun setTextSizeForWidth(paint: Paint,
                                    desiredWidth: Float,
                                    text: String) {

        // Pick a reasonably large value for the text.
        val textSize = 60f

        // Get the bounds of the text using `textSize`.
        paint.textSize = textSize
        val bounds = Rect()
        paint.getTextBounds(text, 0, text.length, bounds)

        // Calculate the desired size as a proportion of `textSize`.
        val desiredTextSize = textSize * desiredWidth / bounds.width()

        // Set the paint for that size.
        paint.textSize = desiredTextSize
    }

    /**
     * PSPDFKit calls this method every time the page is moved or resized onscreen.
     * It will provide a fresh transformation for calculating screen coordinates from
     * PDF coordinates.
     */
    override fun updatePDFToViewTransformation(matrix: Matrix) {
        super.updatePDFToViewTransformation(matrix)
        updateScreenCoordinates()
    }

    @UiThread
    override fun setAlpha(alpha: Int) {
        textPaint.alpha = alpha
        // Drawable invalidation is only allowed from a UI thread.
        invalidateSelf()
    }

    @UiThread
    override fun setColorFilter(colorFilter: ColorFilter?) {
        textPaint.colorFilter = colorFilter
        // Drawable invalidation is only allowed from a UI thread.
        invalidateSelf()
    }

    override fun getOpacity(): Int {
        return PixelFormat.TRANSLUCENT
    }
}
```

Once we’ve created the [`PdfDrawable`][], we can move on and create our [`PdfDrawableProvider`][]. We’ll again keep it simple and put the watermark on every page:

```kotlin
// Create your drawable provider here.
val drawableProvider: PdfDrawableProvider = object : PdfDrawableProvider() {
    override fun getDrawablesForPage(context: Context, document: PdfDocument, pageIndex: Int): MutableList<out PdfDrawable> {
        // You can simply return a list of all PDF drawables you want to display.
        return mutableListOf<PdfDrawable>(WatermarkDrawable("Property of Me", Point(250, 250)))
    }
}
```

Finally, once you’ve got everything ready, you can register your [`PdfDrawableProvider`][] with all the components you want your watermark to be displayed on top of:

```kotlin
// Finally add it to all components.
pdfFragment?.addDrawableProvider(drawableProvider)

pspdfKitViews.thumbnailBarView?.addDrawableProvider(drawableProvider)

pspdfKitViews.thumbnailGridView?.addDrawableProvider(drawableProvider)

pspdfKitViews.outlineView?.addDrawableProvider(drawableProvider)
```

Keep in mind that while we add it to all page-displaying components in this code snippet, if you want to, for example, just have a watermark on the actual page but not the thumbnail grid, you would simply not add your [`PdfDrawableProvider`][] to the thumbnail grid.

## Creating a Permanent Watermark

If you need to add a permanent watermark to your document, you have to use the [`PdfProcessor`][]. In combination with the [`PageCanvas`][], it will allow you to draw any watermark you desire on your document:

```kotlin
// Define where to save your watermarked document.
val outputFile = File(filesDir, "watermarked.pdf")

// Create a new task based on the current document.
val document = this.document ?: return
val task = PdfProcessorTask.fromDocument(document)

// Set up the paint used to draw the watermark.
val textPaint = TextPaint()
textPaint.textSize = 30f
textPaint.color = Color.argb(128, 255, 0, 0)
textPaint.textAlign = Paint.Align.CENTER

// Now, for every page in the document, create a `PageCanvas`.
for (i in 0 until document.pageCount) {
    val page = i
    val pageSize = document.getPageSize(i)
    val pageCanvas = PageCanvas(pageSize) { canvas ->
        // And draw the text on that canvas.
        val text = String.format(Locale.getDefault(), "Generated for %s. Page %d", "Me", (page + 1))
        canvas.drawText(text, pageSize.width / 2, pageSize.height - 100, textPaint)
    }
    task.addCanvasDrawingToPage(pageCanvas, i)
}

// Finally, start the document processor to receive your new file with a permanent watermark.
PdfProcessor.processDocumentAsync(task, outputFile)
    // Drop update events to avoid back pressure on slow devices.
    .onBackpressureDrop()
    .subscribeOn(Schedulers.io())
    .observeOn(AndroidSchedulers.mainThread())
    .subscribe({
        // Handle progress updates.
    }, {
        // Handle errors.
    }, {
        // Open the new document.
        documentCoordinator.addDocument(DocumentDescriptor.fromUri(Uri.fromFile(outputFile)))
    })
```

This will draw a simple “Generated for Me. Page x” text on every page of the document and then save it to the chosen output file. Using the canvas, you have full flexibility when creating your watermark.

## Conclusion

In this post, we took a look at how to display a temporary watermark and embed it directly into a document. Using the techniques shown here, you will not only be able to add watermarks to your document, but you can also add any other content you might desire on top of your documents.

[`pdfdrawableprovider`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/drawable/PdfDrawableProvider.html
[`pdfdrawable`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/drawable/PdfDrawable.html
[`pdfprocessor`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/processor/PdfProcessor.html
[`pagecanvas`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/processor/PageCanvas.html
