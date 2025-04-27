---
title: "Open a PDF in an Android App"
description: "This article presents existing free or open source libraries for opening PDF files in Android apps."
preview_image: /images/blog/2019/open-pdf-android/article-header.png
section: blog
author:
  - Tomas Surin
author_url:
  - https://twitter.com/tomassurin
date: 2019-06-24 8:00 UTC
tags: Android, Development, PDF
published: true
secret: false
---

PDF documents are the de facto standard for archiving, transferring, and presenting documents online. Android developers frequently need to display PDF documents within their applications, so in this article, we’ll look at free and open source libraries for displaying PDFs. We’ll also present PSPDFKit as a commercial alternative. READMORE

## Android SDK

The Android SDK has had basic support for PDF files since API level 21 (Android 5.0). This API resides in a package, [`android.graphics.pdf`][], and it supports basic low-level operations, such as creating PDF files and rendering pages to bitmaps. The Android SDK does not provide a UI for interacting with PDF documents, so you’ll need to write your own UI to handle user interaction if you wish to use it as a basis for a PDF viewer in your app.

The main API entry point is [`PdfRenderer`][], which provides an easy way to render single pages into bitmaps:

```kotlin
// Create the page renderer for the PDF document.
val fileDescriptor = ParcelFileDescriptor.open(documentFile, ParcelFileDescriptor.MODE_READ_ONLY)
val pdfRenderer = PdfRenderer(fileDescriptor)

// Open the page.
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

You can now set these rendered bitmaps into an `ImageView` or build your own UI that handles multi-page documents, scrolling, and zooming.

Now we are going to introduce libraries that support basic, ready-to-use UIs for displaying documents.

## MuPDF

One of the most widely known PDF libraries is [MuPDF][]. It is available either as a [commercial][artiflex.com] solution or under an open source ([AGPL][]) license.

MuPDF provides a small and fast viewer with a basic UI. Embedding it in your app is simple:

```build.gradle
repositories {
    jcenter()
    maven { url ’http://maven.ghostscript.com' }
    ...
}

dependencies {
	compile 'com.artifex.mupdf:viewer:1.12.+'
	...
}
```

You can now open the MuPDF viewer activity by launching an intent with a document URI:

```kotlin
import com.artifex.mupdf.viewer.DocumentActivity;

...

val intent = Intent(this, DocumentActivity::class.java)
intent.action = Intent.ACTION_VIEW
intent.data = Uri.fromFile(documentFile)
startActivity(intent)
```

<video src="/images/blog/2019/open-pdf-android/mu-pdf.mp4" width="50%" loop muted playsinline data-controller="video" data-video-autoplay="true" style="margin-left:auto;margin-right:auto;"></video>

Using `DocumentActivity` is enough for most basic use cases. MuPDF ships with its entire source code, so you can build any required functionality on top of it.

**ℹ️ Note:** MuPDF also supports other document formats on top of PDF, such as XPS, CBZ, EPUB, and FictionBook 2.

## Android PdfViewer

[Android PdfViewer][] is a library for displaying PDF documents. It has basic support for page layouts, zooming, and touch gestures. It is available under the Apache License, Version 2.0 and, as such, is free to use, even in commercial apps.

Integration is simple. Start with adding a library dependency to your `build.gradle` file:

```build.gradle
compile 'com.github.barteksc:android-pdf-viewer:3.1.0-beta.1'
```

Then add the main `PDFView` to the layout where you wish to view the PDFs:

```pdf_view_layout.xml
...
<com.github.barteksc.pdfviewer.PDFView
    android:id="@+id/pdfView"
    android:layout_width="match_parent"
    android:layout_height="match_parent"/>
...
```

Now you can load the document in your activity:

```PdfViewActivity.kt
...
val pdfView = findViewById<PdfView>(R.id.pdfView)
pdfView.fromUri(documentUri).load()
...
```

<video src="/images/blog/2019/open-pdf-android/android-pdf-viewer.mp4" width="50%" loop muted playsinline data-controller="video" data-video-autoplay="true" style="margin-left:auto;margin-right:auto;"></video>

## PSPDFKit for Android

The above solutions are free or open source libraries with viewer capabilities. However, the PDF spec is [fairly complex][pdf complexities] and it defines many more features on top of the basic document viewing capabilities. We at PSPDFKit offer a comprehensive PDF solution for Android and other platforms, along with first-class support included with every plan. PSPDFKit comes with a fully featured document viewer with a modern customizable user interface and a range of additional features such as:

- Annotation editing
- Interactive forms with JavaScript support
- Digital signatures
- Indexed search
- Document editing (both programmatically and through the UI)
- Redaction
- And much more

If you are interested in our solution, click [here][pspdfkit for android] to learn more and get a trial of PSPDFKit for Android.

<video src="/images/blog/2019/open-pdf-android/pspdfkit-viewer.mp4" width="50%" loop muted playsinline data-controller="video" data-video-autoplay="true" style="margin-left:auto;margin-right:auto;"></video>

## Conclusion

In this post, we’ve outlined some of the available PDF viewer libraries for Android. Whether you choose any of the presented free or open source libraries or you want the fully featured commercial solution found in PSPDFKit, integrating PDF capabilities into your apps is relatively easy.

[`android.graphics.pdf`]: https://developer.android.com/reference/android/graphics/pdf/package-summary
[`pdfrenderer`]: https://developer.android.com/reference/android/graphics/pdf/PdfRenderer.html
[android pdfviewer]: https://github.com/barteksc/AndroidPdfViewer
[pdfium]: https://android.googlesource.com/platform/external/pdfium/
[mupdf]: https://mupdf.com/
[artiflex.com]: https://artifex.com/
[agpl]: https://www.gnu.org/licenses/agpl-3.0.html
[pdf complexities]: https://pspdfkit.com/guides/android/current/troubleshooting/complexities-of-rendering-pdfs/
[pspdfkit for android]: https://pspdfkit.com/pdf-sdk/android/
