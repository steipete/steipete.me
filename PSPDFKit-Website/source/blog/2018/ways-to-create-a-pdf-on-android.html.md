---
title: "Ways to Create a PDF on Android"
description: "We look at the different ways of creating a PDF on Android."
preview_image: /images/blog/2018/ways-to-create-a-pdf-on-android/article-header.png
section: blog
date: 2018-06-13 12:00 UTC
tags: Android, Development
published: true
cta: android
---

You can use PSPDFKit for viewing and editing already existing PDF documents, but have you wondered how to create a PDF on Android?

READMORE

In this blog post, we’ll first look at how users can create PDFs in other apps. Then we’ll see how your app can use the [`PdfProcessor`][] class from PSPDFKit to generate blank PDFs and customize their content.

## Export a PDF from an App That Supports It

Many apps allow you to export a PDF. For example, both Google Docs and Microsoft Word can do this.

![Screenshots of PDF export flow in Google Docs](/images/blog/2018/ways-to-create-a-pdf-on-android/docs.png)

## Use the Print Feature

The Android print feature allows you to save any printable content as a PDF.

To create a PDF from the print preview, just select Save as PDF as the target printer.

![Screenshots of webpage, share dialog, and print preview](/images/blog/2018/ways-to-create-a-pdf-on-android/print-1.png)
![Screenshots of generated PDF](/images/blog/2018/ways-to-create-a-pdf-on-android/print-2.png)

Having taken a look at the options a user has to create PDFs, let’s look at some ways you can programmatically create PDFs in your apps.

## Create a Blank PDF

With PSPDFKit, it’s easy to create a PDF with empty pages. The page can have a patterned background or even an image background. An example of this can be found in [PDF Viewer] by tapping the + button in the document browser.

![Screenshot of the new document screen in PDF Viewer](/images/blog/2018/ways-to-create-a-pdf-on-android/viewer.png)

Here’s how to create a PDF while programmatically specifying the page size and appearance:

```kotlin
val targetFile: File

val newPage = NewPage.emptyPage(Size(595f, 842f))
    .backgroundColor(Color.LTGRAY)
    .build()

val pdfProcessorTask = PdfProcessorTask(newPage)

try {
    val processor = PdfProcessor.processDocument(pdfProcessorTask, targetFile)
} catch (ex: Exception) {
    // Could not create PDF file.
}
```

To let the user choose the page size and appearance using the same user interface as PDF Viewer, use [`NewPageDialog`][]:

```kotlin
NewPageDialog.show(supportFragmentManager,null, object : NewPageDialog.Callback {
    override fun onDialogConfirmed(newPage: NewPage) {
        // Use PdfProcessor like above.
    }

    override fun onDialogCancelled() {
        // User didn't select a template.
    }
})
```

## Create a PDF by Drawing onto a Canvas

For maximum flexibility, you can also write your own drawing code to generate PDFs. When doing this, you need to take care to correctly handle line and page breaks.

Here’s a simple example that draws a line right across the document:

```kotlin
val targetFile: File

val pageSize = Size(595f, 842f)

val newPage = NewPage.emptyPage(pageSize)
    .backgroundColor(Color.LTGRAY)
    .build()

val pdfProcessorTask = PdfProcessorTask(newPage)
pdfProcessorTask.addCanvasDrawingToPage(PageCanvas(pageSize) { canvas ->
    val paint = Paint()
    // Will draw a line from one corner of the page to the other.
    canvas.drawLine(0f, 0f, pageSize.width, pageSize.height, paint)
}, 0)

try {
    val processor = PdfProcessor.processDocument(pdfProcessorTask, targetFile)
} catch (ex: Exception) {
    // Could not create PDF file.
}
```

![Screenshot of the resulting PDF](/images/blog/2018/ways-to-create-a-pdf-on-android/custom-pdf.png)

If you already have some code that draws onto a canvas, you can reuse that drawing code (with some [noted exceptions]).

## Conclusion

In this post, we’ve seen both ways users can create PDFs in existing apps and how you can add PDF creation as a feature in your own app.

[`PdfProcessor`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/processor/PdfProcessor.html
[PDF Viewer]: https://pdfviewer.io
[`NewPageDialog`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/editor/page/NewPageDialog.html
[noted exceptions]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/processor/NewPage.OnDrawCanvasCallback.html
