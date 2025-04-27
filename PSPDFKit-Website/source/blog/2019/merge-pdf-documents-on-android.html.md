---
title: "Merge PDF Documents on Android"
description: "We'll take a look at two ways to merge PDF documents on Android."
preview_image: /images/blog/2019/merge-pdf-documents-on-android/article-header.png
section: blog
author:
  - Reinhard Hafenscher
date: 2019-09-10 7:00 UTC
tags: Android, Development, PDF
published: true
secret: false
---

Today we’ll learn how to merge PDF documents inside an Android application. READMORE To do this, we’ll take a look at two different ways for working with PDFs: using the support included with Android, and using [PSPDFKit][].

## The Android Way

Let’s look at the Android way first, using only classes that come standard with the platform. Starting with API 19, Android introduced [`PdfDocument`][apdfdocument], which can be used to create new PDFs by drawing to a [`Canvas`][]. By combining this with the [`PdfRenderer`][] introduced in API 21, we can merge multiple PDF documents into a single PDF. Keep in mind that this approach has several limitations. You need to be on API 21 (at least) to use [`PdfRenderer`][], and since there is no API to actually work with PDFs beyond drawing on blank pages using the [`Canvas`][], your only option to merge documents is to render all pages to bitmaps and then draw those into your output document. Still, let’s take a look at how this would work:

```kotlin
@TargetApi(Build.VERSION_CODES.LOLLIPOP)
fun mergeDocumentsUsingAndroid(outputFile: File,
                               imageScale: Float,
                               vararg inputFiles: File) {
    // We need to keep track of the current page when creating the output PDF.
    var currentOutputPage = 0

    // Create our output document to render into.
    val outputDocument = PdfDocument()

    val bitmapPaint = Paint()
    // By applying the image scale, we can render higher resolution bitmaps into
    // our output PDF. This will result in a bigger file size but higher quality.
    val scaleMatrix = Matrix().apply {
        postScale(imageScale, imageScale)
    }

    for (inputFile in inputFiles) {
        // For every one of our input files, we create a `PdfRenderer`.
        val currentDocument = PdfRenderer(ParcelFileDescriptor.open(inputFile,
            ParcelFileDescriptor.MODE_READ_ONLY))
        for (pageIndex in 0 until currentDocument.pageCount) {
            val currentPage = currentDocument.openPage(pageIndex)
            // We create the page information based on the actual page we are currently
            // working on.
            val outputPageInfo = PdfDocument.PageInfo.Builder(
                    currentPage.width,
                    currentPage.height,
                    currentOutputPage
                ).create()
            val outputPage = outputDocument.startPage(outputPageInfo)

            // We need to create a bitmap for every page, since the size could be
            // different for every page.
            val pageBitmap = Bitmap.createBitmap(
                (outputPageInfo.pageWidth * imageScale).toInt(),
                (outputPageInfo.pageHeight * imageScale).toInt(),
                Bitmap.Config.ARGB_8888)
            // Now we draw the actual page content onto the bitmap.
            currentPage.render(pageBitmap,
                null,
                scaleMatrix,
                PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
            // We draw the bitmap in the top-left corner since it will fill the entire page.
            outputPage.canvas.drawBitmap(pageBitmap,
                Rect(0, 0, pageBitmap.width, pageBitmap.height),
                outputPageInfo.contentRect,
                bitmapPaint)

            // Once you're done with a page, make sure to close everything properly.
            outputDocument.finishPage(outputPage)
            currentPage.close()

            ++currentOutputPage
        }
    }

    // Once all pages are copied, write to the output file.
    outputDocument.writeTo(FileOutputStream(outputFile))
}

// Actually perform the merge.
mergeDocumentsUsingAndroid(outputFile, 2f, inputFile1, inputFile2, inputFile3)
```

When looking at the output files produced by the above code, you might notice that they are significantly bigger than their input files. You can also no longer select any text in the documents, and zooming in on the files will make them appear pixelated. The reason for this is that, as mentioned earlier, our PDF now only consists of pictures for its pages, and all the advantages a PDF has — like vector-based drawing and selectable text — are gone. Finally, all annotations that were originally in the document are now also gone, making this solution one that is not ideal for merging documents.

Next up, let’s look at how to merge documents with [PSPDFKit][].

## The PSPDFKit Way

PSPDFKit provides a flexible [`PdfProcessor`][] that can be used for many things, like editing existing documents, creating brand-new documents, or, in our case, merging multiple documents. The process of merging multiple documents is really simple:

1. Create a new empty [`PdfProcessorTask`][].
2. Add the pages of all documents you want to merge to this task.
3. Write the output to a new file.

Let’s see how this would look in code:

```kotlin
fun mergeDocumentsUsingPspdfkit(context: Context, outputFile: File, vararg inputFiles: File) {

    // Create an empty `PdfProcessorTask` to put the pages into.
    val task = PdfProcessorTask.empty()

    // We need to keep track of the page count so we can add pages to the end.
    var totalPageCount = 0

    for (inputFile in inputFiles) {
        // Open the document to merge.
        val currentDocument = PdfDocumentLoader.openDocument(context,
            Uri.fromFile(inputFile))
        for (pageIndex in 0 until currentDocument.pageCount) {
            // We use `totalPageCount` here to add the pages to the end.
            // However, you are free to add them at any place in the document you'd like.
            task.addNewPage(NewPage.fromPage(currentDocument, pageIndex).build(),
                totalPageCount)
            ++totalPageCount
        }
    }

    // Once the task is created, process the documents into the output file.
    PdfProcessor.processDocument(task, outputFile)
}

// Actually perform the merge.
mergeDocumentsUsingPspdfkit(context, outputFile, inputFile1, inputFile2, inputFile3)
```

Not only is this simpler than using the [`PdfRenderer`][], but also, the final output will be of vastly higher quality. Since we’re not converting all the pages to simple bitmaps before putting them into the final document, all the features that make PDFs great are still here, e.g. all text will still be selectable, forms will still be fillable, and your annotations will still be there and editable. The final output size will also be much smaller since we’re not using high-resolution memory-expensive images, but rather actual PDF pages.

The [`PdfProcessor`][] has plenty of additional features, like flattening or removing annotations and rotating or removing pages in existing documents. We can’t go into all of them here, but feel free to check them out in our [Document Processing][] guide.

## Conclusion

We looked at ways to merge multiple PDFs into a single file using both the Android system way and the PSPDFKit way. While Android provides some capabilities for working with PDF documents, they are very limited. Meanwhile, PSPDFKit offers a complete set of features for both modifying and presenting PDF documents. If you want to try PSPDFKit right now, you can sign up for a free trial below.

[pspdfkit]: https://pspdfkit.com/pdf-sdk/android/
[apdfdocument]: https://developer.android.com/reference/android/graphics/pdf/PdfDocument
[`canvas`]: https://developer.android.com/reference/android/graphics/Canvas.html
[`pdfrenderer`]: https://developer.android.com/reference/android/graphics/pdf/PdfRenderer
[`pdfmergerutility`]: https://pdfbox.apache.org/docs/2.0.13/javadocs/org/apache/pdfbox/multipdf/PDFMergerUtility.html
[document processing]: https://pspdfkit.com/guides/android/current/features/document-processing/
[`pdfprocessor`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/processor/PdfProcessor.html
[`pdfprocessortask`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/processor/PdfProcessorTask.html
