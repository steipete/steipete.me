---
title: "Inserting an Image into a PDF on Android"
description: "We provide a step-by-step explanation of how to insert an image into a PDF on Android."
preview_image: /images/blog/2020/insert-image-into-pdf-on-android/article-header.png
section: blog
author:
  - Reinhard Hafenscher
date: 2020-02-18 8:00 UTC
tags: Android, Development, Kotlin
published: true
secret: false
---

The PDF file format is extremely versatile, and it allows you to include many different kinds of content in your documents. Today we’ll take a look at how to embed images into existing documents. READMORE When using PSPDFKit for Android, there are two ways to add images to a document. Let’s start by looking at the simplest way: adding them as annotations.

## Adding Images Using Annotations

Using an annotation to include an image in a PDF is a straightforward operation. Simply create a [`StampAnnotation`][] with your image set and add it to the document:

```kotlin
// First you need to load your bitmap.
val image = BitmapFactory.decodeStream(assets.open("images/android.png"))

// Then you can create a `StampAnnotation` based on it.
val imageStamp = StampAnnotation(
    0,
    // Use the image size to calculate the correct bounding box.
    RectF(60f, 400f, (60 + image.width / 4).toFloat(), (400 - image.height / 4).toFloat()),
    image
)

// Finally add it to the document.
document.annotationProvider.addAnnotationToPage(imageStamp)
```

In the above example, the image comes from the application assets, but the [`BitmapFactory`][] supports decoding bitmaps from other sources as well, including files, Android resources, and streams.

If you want to make the annotation a permanent part of the document, you can use [`PdfProcessor#fromDocument`][] to create a [`PdfProcessorTask`][]. This is an operation that will be executed on the document. Among other things, it allows you to change annotations via the [`changeAnnotations`][] method. We will use this method to flatten the image into the document (make it non-editable):

```kotlin
// Create the `PdfProcessorTask` based on the current document.
val task = PdfProcessorTask.fromDocument(document)

// Tell the processor to flatten our singular image stamp. This keeps all other annotations editable.
task.changeAnnotations(listOf(imageStamp), PdfProcessorTask.AnnotationProcessingMode.FLATTEN)

// Finally, write it to a new document.
PdfProcessor.processDocument(task, File("/sdcard/processed.pdf"))
```

If you now open the produced file, you will see that it includes our image, but it can no longer be moved or otherwise be edited. This is because we flattened it into the document using `PdfProcessorTask.AnnotationProcessingMode.FLATTEN`.

Next, let’s look at how to use [`PdfProcessor`][] directly to embed an image without having to create an annotation first.

## Adding Images Using PdfProcessor

The [`PdfProcessor`][] provides an API that allows you to attach a [`PageCanvas`][] to existing pages, which then lets you to draw your content on top of them. We can use this to permanently add an image on top of the page:

```kotlin
// Create the `PdfProcessorTask` based on the current document.
val task = PdfProcessorTask.fromDocument(document)

// Then load the bitmap.
val image = BitmapFactory.decodeStream(assets.open("images/android.png"))

// The page size is necessary for generating the `PageCanvas` to draw on.
val pageSize = document.getPageSize(0)

// Now obtain a canvas to draw the bitmap on.
task.addCanvasDrawingToPage(PageCanvas(pageSize, NewPage.OnDrawCanvasCallback {
    // Draw the image onto the canvas.
    it.drawBitmap(image, 60f, 60f, null)
}), 0)

// Finally, write it to a new document.
PdfProcessor.processDocument(task, File("/sdcard/processed.pdf"))
```

We still load the bitmap like before, but now instead of creating a [`StampAnnotation`][], we simply draw it on the [`Canvas`][] we obtained from the [`PageCanvas`][]. You can also draw anything else you desire in this callback, including text and shapes, and they will be included in the final PDF.

## Conclusion

And there you have it: two great ways to include images using PSPDFKit for Android. No matter what your use case is, if it involves PDFs, PSPDFKit is the right choice, as it provides simple APIs for manipulating and annotating documents.

[`stampannotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/StampAnnotation.html
[`bitmapfactory`]: https://developer.android.com/reference/android/graphics/BitmapFactory
[`pdfprocessor`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/processor/PdfProcessor.html
[`changeannotations`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/processor/PdfProcessorTask.html#changeAnnotations(java.util.List%3Ccom.pspdfkit.annotations.Annotation%3E,%20com.pspdfkit.document.processor.PdfProcessorTask.AnnotationProcessingMode)
[`pagecanvas`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/processor/PageCanvas.html
[`canvas`]: https://developer.android.com/reference/android/graphics/Canvas
[`pdfprocessor#fromdocument`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/processor/PdfProcessorTask.html#fromDocument(com.pspdfkit.document.PdfDocument)
[`pdfprocessortask`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/processor/PdfProcessorTask.html
