---
title: "Convert a PDF to an Image on Android"
description: "This article explains how to render your PDF files to images using both Android's built-in PDF libraries and PSPDFKit."
preview_image: /images/blog/2019/convert-pdf-to-image-android/article-header.png
section: blog
author:
  - Tomas Surin
author_url:
  - https://twitter.com/tomassurin
date: 2019-10-16 8:00 UTC
tags: Android, Development, PDF
published: true
secret: false
---

The most basic use case for any PDF library or framework is that of rendering PDF pages. This is useful whenever you are building a custom PDF viewer, need to preview PDF documents in your app, or just want to convert part of a PDF document to an image. This article shows how to do this using Android’s built-in PDF libraries and via PSPDFKit for Android. READMORE

## Android SDK

The Android SDK has shipped with basic PDF support since API level 21 (Android 5.0). This API resides in a package, [`android.graphics.pdf`][], and it supports low-level operations such as creating PDF files and rendering pages to bitmaps.

We’ll use the following steps to render a page into a bitmap using this API:

1. First create an instance of [`PdfRenderer`][].
2. Open the page to be rendered. The page is represented as an instance of the [`PdfRenderer.Page`][] class.
3. Create a destination [`Bitmap`][] of the required size in the [`ARGB_8888`][] format.
4. Use the [`PdfRenderer.Page#render()`][] method to render the page into the destination bitmap. You can also specify optional clipping to render only a part of the page, or a transformation matrix to transform the page content when rendering. If no transform is specified, the default transform that fits the whole page into a destination bitmap will be used.
5. Close the `PdfRenderer.Page` and `PdfRenderer` instances once you are done working with them.

```kotlin
// Create the page renderer for the PDF document.
val fileDescriptor = ParcelFileDescriptor.open(documentFile, ParcelFileDescriptor.MODE_READ_ONLY)
val pdfRenderer = PdfRenderer(fileDescriptor)

// Open the page to be rendered.
val page = pdfRenderer.openPage(pageNumber)

// Render the page to the bitmap.
val bitmap = Bitmap.createBitmap(page.width, page.height, Bitmap.Config.ARGB_8888)
page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)

// Use the rendered bitmap.
...

// Close the page when you are done with it.
page.close()

...

// Close the `PdfRenderer` when you are done with it.
pdfRenderer.close()
```

The optional clip and transformation parameters of the [`PdfRenderer.Page#render()`][] method are useful to, for example, implement tile rendering, which is where the page rendering is split into a grid of separate bitmaps. This has various benefits, ranging from faster rendering to lower memory usage when displaying zoomed rendering.

However, one caveat of the `PdfRenderer` API is that only a single page can be opened at a time. If you want concurrent rendering, you’ll need to create multiple `PdfRenderer` instances for the same document in each of your worker threads.

## PSPDFKit for Android

The [`PdfRenderer`][] API is fairly barebones. If you need additional control over page rendering — such as to include a custom drawing on the page, or to control the page color so that it’s rendered as grayscale or inverted — you need to write your own.

We at PSPDFKit offer a comprehensive PDF solution for Android and other platforms, along with first-class support included with every plan. PSPDFKit comes with a fully featured document viewer with a modern customizable user interface and a range of additional advanced features such as text extraction and search, full annotation and forms support, document editing, redaction, and much more.

The process of rendering PDFs into bitmaps in PSPDFKit is simple:

```kotlin
// Open the document.
val document = PdfDocumentLoader.openDocument(context, documentUri)

// You can provide an optional page rendering configuration.
val renderConfig = PageRenderConfiguration.Builder()
    // You can specify the page region that should be rendered here.
    // .region(0, 0, 100, 1000)
    // You can also set additional rendering parameters such as grayscale or inverted color rendering.
    // .invertColors(true)
    .build()

// Render page to bitmap.
val pageBitmap : Bitmap = document.renderPageToBitmap(context, pageIndex, width, height, renderingConfig)
```

PSPDFKit’s [`PdfDocument`][] API is thread-safe. It also includes various features that improve rendering performance, such as multithreaded rendering and a rendering cache.

We have a fully featured guide article that outlines the process of [rendering pdf pages][].

If you are interested in our solution, click [here][pspdfkit for android] to learn more and get a trial of PSPDFKit for Android.

## Processing Rendered Bitmaps

Once you have your page rendered, you can show it in an [`ImageView`][] in your UI. You can also process it further before it is displayed or shared with other services — for example, being used for printing or uploaded to your own backend. I’ll focus on the latter (processing pages) in the rest of this post.

The Android [`Canvas`][] API provides powerful capabilities for editing your rendered bitmaps. Let me showcase some basic examples of what could be done with your rendered pages.

### Inverting Bitmap Colors

Changing bitmap colors to inverted or grayscale is a common requirement of all sorts of applications, be it for accessibility use cases or just to improve the reading experience. So let’s look at an example of how to invert page colors.

First, create a target `Bitmap` of the required size and create a `Canvas` for drawing into it:

```kotlin
val targetBitmap = Bitmap.createBitmap(sourceBitmap.width, sourceBitmap.height, Bitmap.Config.ARGB_8888)
val canvas = Canvas(targetBitmap)
```

Then set the custom color filter for inverting colors on the [`Paint`][] object:

```kotlin
val paint = Paint()
val invertedColorMatrix = ColorMatrix(floatArrayOf(
    -1f, 0f, 0f, 0f, 255f,
    0f, -1f, 0f, 0f, 255f,
    0f, 0f, -1f, 0f, 255f,
    0f, 0f, 0f, 1f, 0f))
paint.colorFilter = ColorMatrixColorFilter(invertedColorMatrix)
```

Finally, draw the source bitmap onto the canvas with the custom `Paint`:

```kotlin
canvas.drawBitmap(
  // Source the bitmap to draw.
  sourceBitmap,
  // Pass `null` as a source rect to draw the entire source bitmap.
  null,
  // Scale to target the bitmap size (in this, case 1:1).
  Rect(0, 0, targetBitmap.width, targetBitmap.height),
  // Use custom paint that inverts colors.
  paint)
```

The image below shows the result.

<img alt="Inverted bitmap rendering" src="/images/blog/2019/convert-pdf-to-image-android/inverted-rendering.png" width="50%" />

As mentioned before, PSPDFKit supports inverted page rendering out of the box. This is done by setting the `invertColors` property in the page rendering configuration:

```kotlin
val renderConfig = PageRenderConfiguration.Builder()
    .invertColors(true)
    .build()
```

### Adding Watermarks

Another frequent requirement is to add watermarks or logo graphics to rendered pages:

```kotlin
// We are going to draw directly to the source bitmap.
val canvas = Canvas(sourceBitmap)

// Get the logo as a `Bitmap`.
val logo = BitmapFactory.decodeFile(logoFile)

// Draw the logo to the rendered page canvas.
canvas.drawBitmap(
    logo,
    // Use `null` as a source rect to draw the full logo.
    null,
    // Page rect where the logo should be added. We'll use the bottom-right corner in this example.
    Rect(sourceBitmap.width - logo.width, sourceBitmap.height - logo.height, sourceBitmap.width, sourceBitmap.height),
    // Use the default `Paint`.
    null
)
```

<img alt="Logo/watermark rendering" src="/images/blog/2019/convert-pdf-to-image-android/logo-rendering.png" width="50%" />

PSPDFKit ships with an easy-to-use API for adding watermarks to PDFs. Learn more about it in our [Add a Watermark to a PDF on Android][] blog post.

## Conclusion

In this post, we’ve shown how easy it is to render your PDF files to images using both Android’s built-in PDF libraries and PSPDFKit. If you wish to take this a step further and add PDF viewer functionality into your app, we’d recommend you read our [Open a PDF in an Android App][] blog post, which provides an overview of the most used Android PDF libraries (both open source and commercial).

[`android.graphics.pdf`]: https://developer.android.com/reference/android/graphics/pdf/package-summary
[`pdfrenderer`]: https://developer.android.com/reference/android/graphics/pdf/PdfRenderer.html
[`pdfrenderer.page`]: https://developer.android.com/reference/android/graphics/pdf/PdfRenderer.Page.html
[`pdfrenderer.page#render()`]: https://developer.android.com/reference/android/graphics/pdf/PdfRenderer.Page.html#render(android.graphics.Bitmap,%20android.graphics.Rect,%20android.graphics.Matrix,%20int)
[`argb_8888`]: https://developer.android.com/reference/android/graphics/Bitmap.Config.html#ARGB_8888
[`bitmap`]: https://developer.android.com/reference/android/graphics/Bitmap
[`imageview`]: https://developer.android.com/reference/android/widget/ImageView
[`canvas`]: https://developer.android.com/reference/android/graphics/Canvas
[`paint`]: https://developer.android.com/reference/android/graphics/Paint.html
[rendering pdf pages]: https://pspdfkit.com/guides/android/current/getting-started/rendering-pdf-pages/
[pdf complexities]: https://pspdfkit.com/guides/android/current/troubleshooting/complexities-of-rendering-pdfs/
[pspdfkit for android]: https://pspdfkit.com/pdf-sdk/android/
[`pdfdocument`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/PdfDocument.html
[open a pdf in an android app]: ../open-pdf-android
[add a watermark to a pdf on android]: https://pspdfkit.com/blog/2019/add-watermark-pdf-android
