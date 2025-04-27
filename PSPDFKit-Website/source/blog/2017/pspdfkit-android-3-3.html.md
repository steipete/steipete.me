---
title: "PSPDFKit 3.3 for Android"
description: Today we're releasing PSPDFKit 3.3 for Android!
preview_image: /images/blog/2017/pspdfkit-android-3-3/pspdfkit-3_3-for-android.png
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/flashmasterdash
date: 2017-07-20 21:00 UTC
tags: Android, Features, Products
published: true
---

Say hello to PSPDFKit 3.3 for Android! Our newest release of PSPDFKit for Android features a new **document progress API**, **annotation note editing**, **extraction of markup text**, **secure video playback**, and more. Check out this blog post in which we outline the biggest changes of the 3.3 release or [see the changelog](https://pspdfkit.com/changelog/android/#3.3.0) for all the details.
READMORE

## Document Progress API

Before PSPDFKit 3.3 for Android, it was the responsibility of your app to maintain the download of your PDF documents (or any other provisioning) and to show a progress UI to your users. With PSPDFKit 3.3 for Android, we introduce the [`ProgressDataProvider`] interface which can be implemented by your custom [`DataProvider`] to let it inform PSPDFKit about progress updates of your PDF download, file inflation, or decryption directly inside the [`PdfFragment`] and [`PdfActivity`].

Check out the `ProgressProviderExample` in our catalog app to see how simple it is to implement progress updates in your app – or dig into our new [guide on providing `DataProvider` progress updates](https://pspdfkit.com/guides/android/current/features/data-providers#data-provider-progress).

<p class="text-center">
  <video src="/images/blog/2017/pspdfkit-android-3-3/progress.mp4" width="50%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>
</p>

## Editing Annotation Notes

PSPDFKit 3.3 for Android catches up with our iOS framework and adds the possibility to edit the note content of all annotation types that support this. Simply tap a highlight annotation, a stamp annotation, or virtually any other annotation and select the note action in the editing toolbar. We've tweaked our existing note annotation editor to give your users a familiar interface while staying tailored to this new feature.

<p class="text-center">
  <video src="/images/blog/2017/pspdfkit-android-3-3/notes.mp4" width="50%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>
</p>

## Extraction of Mark-Up Text

The API in 3.3 got a small but immensely useful new method: Extraction of text below markup annotations. Simply call [`getHighlightedText()`][`TextMarkupAnnotation#getHighlightedText`] on any [`TextMarkupAnnotation`] which will return the highlighted text, or `null` if nothing was below the annotation.

[==

```kotlin
val annotation = document.annotationProvider
    .getAnnotation(pageIndex, objectNumber) as HighlightAnnotation

val highlightedText = annotation.highlightedText
toast("You highlighted: $highlightedText")
```

```java
final HighlightAnnotation annotation = (HighlightAnnotation) document
    .getAnnotationProvider()
    .getAnnotation(pageIndex, objectNumber);

final String highlightedText = annotation.getHighlightedText();
Toast.makeText(context, "You highlighted: " + highlightedText, SHORT).show();
```

==]

## XFDF Support

XFDF is an XML-like standard from Adobe [XFDF][Salesforce XFDF Article] for encoding annotations and forms. It is compatible with Adobe Acrobat and several other 3rd-party frameworks.

PSPDFKit for Android now supports both reading and writing XFDF files. The `XfdfFormatter` class contains `parseXfdf()` and `writeXfdf()` methods you can use to perform these operations, as well as their asynchronous counterparts `parseXfdfAsync()` and `writeXfdfAsync()` (recommended so you can easily offload parsing from the UI thread).

See guides for more: [XFDF Support](https://pspdfkit.com/guides/android/current/importing-exporting/xfdf-support/)

## Secure Video Playback

Playback of embedded videos has already been available since [PSPDFKit 3.2 for Android](https://pspdfkit.com/blog/2017/pspdfkit-android-3-2/) – and videos linked with multimedia annotations [since a felt eternity](https://pspdfkit.com/changelog/android/#1.2.0). However, prior to 3.3 multimedia playback was disabled by default to prevent the [possibility of PDF-triggered exploits](https://en.wikipedia.org/wiki/Stagefright_(bug)). Starting with 3.3 we automatically enable video support on all devices that come with a secure multimedia framework, i.e. all devices with API 23+ and security patch dating Feb 1st, 2016 or newer. This gives the best out-of-the-box experience while providing the same level of security for your users.

## Other Improvements and Fixes

As always, this release also focuses on improving existing framework features. Here's a brief overview of features we worked on:

* The [`DownloadProgressFragment`]&nbsp;(which shows a progress dialog for the [`DownloadJob`]) is now customizable and can use completely custom layouts. We added the `CustomDocumentDownloadExample` which shows how customization is done.
* We fixed an issue where the annotation creation toolbar was dismissed when a configuration change happened. The toolbar will now properly stay active, together with the currently selected annotation tool.
* We improved rendering of right-to-left scripts in PDF forms. Previously Arabic texts entered were accidentally flipped once rendered on the document, now they are correctly displayed.

This blog post outlines the major changes only. Check out the [PSPDFKit for Android changelog](https://pspdfkit.com/changelog/android/#3.3.0) for the full story.

<!-- References -->

[`ProgressDataProvider`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/providers/ProgressDataProvider.html
[`DataProvider`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/providers/DataProvider.html
[`PdfFragment`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfFragment.html
[`PdfActivity`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html
[`TextMarkupAnnotation#getHighlightedText`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/TextMarkupAnnotation.html#getHighlightedText()
[`TextMarkupAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/TextMarkupAnnotation.html
[Salesforce XFDF Article]: https://developer.salesforce.com/page/Adobe_XFDF
[`DownloadProgressFragment`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/download/DownloadProgressFragment.html
