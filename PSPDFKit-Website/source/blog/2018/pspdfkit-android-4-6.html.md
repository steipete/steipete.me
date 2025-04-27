---
title: "PSPDFKit 4.6 for Android"
description: "Introducing PSPDFKit 4.6 for Android — featuring annotation & page rotation, non-destructive image documents, system clipboard images, file annotations, custom page content and more."
preview_image: /images/blog/2018/pspdfkit-android-4-6/pspdfkit-android-4-6-header.png
preview_video: /images/blog/2018/pspdfkit-android-4-6/android-4-6.mp4
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/flashmasterdash
date: 2018-05-31 7:00 UTC
tags: Android, Products, Features
published: true
---

Today we’re proud to announce the immediate availability of PSPDFKit 4.6 for Android. In this release, we’re shipping **freeform annotation rotation**, **page rotation**, **image documents**, **file annotations**, **system clipboard support for images**, and so much more.READMORE This blog post only scratches the surface of what is inside 4.6. For a full list of changes, head over to our [changelog for PSPDFKit 4.6 for Android](/changelog/android/#4.6.0).

READMORE

## Non-Destructive Image Documents

With the new Image Documents component, we’re expanding our supported file formats from just PDF to include PNG and JPG as image formats.

[![Non-Destructive Image Documents](/images/blog/2018/pspdfkit-android-4-6/image-documents.png)](/blog/2018/image-documents/)

Non-destructive image documents allow you to load image files into your PSPDFKit-powered application as if they were PDF documents. We made sure that all the existing features, such as annotations and document processing — but also not-so-obvious features, such as text search — seamlessly work inside image documents too.

Loading image documents into your app only requires a couple of lines:

```kotlin
// You can use any PdfActivityConfiguration you like, but this helper
// will conveniently provide the recommended defaults.
val imageConfig = ImageDocumentLoader
        .getDefaultImageDocumentActivityConfiguration(image.build())

// Show the image document with just a single line of code.
PdfActivity.showImage(context, Uri.fromFile(imageFile), imageConfig)
```

🌟 And the best part: We developed a format to embed all the metadata that is necessary to retain editing capabilities directly inside the image file, making image documents first-class citizens for annotating and sharing, just like PDF documents are. This means that any PSPDFKit-powered app will be able to read and understand image documents, while third-party software will simply fall back to the normal image representation.

[Learn how you can annotate PNG and JPG just like PDF with Image Documents](/blog/2018/image-documents/).

## Instant Layers

<a href="/blog/2018/instant-layers/">
<video src="/images/blog/2018/instant-layers/instant-layers.mp4" width="100%" playsinline loop muted data-controller="video" data-video-autoplay="true"></video></a>

[Instant](/instant) is an on-premises server that shares documents and annotations between multiple users and devices. This release adds support for Instant Layer, a container for annotations on a specific PDF document. Every user can have one or multiple layers to share annotations. This is particularly useful for implementing review workflows where several parties are invited to provide feedback on a document, independent of one another. [Learn how to take advantage of Instant Layers.](/blog/2018/instant-layers/)

## Annotation Rotation

We’ve been always dedicated to bringing delightful and easy-to-use tools to your users. With our newest annotation editing tool, freeform annotation rotation, we’re continuing this quest.

![Annotation Rotation](/images/blog/2018/pspdfkit-android-4-6/annotation-rotation.png)

This release introduces a new annotation rotation handle for stamp annotations and free text annotations, allowing your users to freely rotate selected annotations. If you want to change the rotation of annotations programmatically, you can simply use the existing `setRotation()` property, which will update the annotation’s appearance.

<video src="/images/blog/2018/pspdfkit-android-4-6/annotation-rotation.mp4" playsinline loop muted data-controller="video" data-video-autoplay="true" width="50%" height="50%"></video>

## Page Rotation

If you’ve ever worked with scanned or photographed PDF documents, you probably know the bitter taste that wrongly oriented pages leave. In this release, we’re remedying this issue by allowing users to rotate pages directly inside the UI with just the tap of a button.

![Page Rotation](/images/blog/2018/pspdfkit-android-4-6/page-rotation.png)

Page rotation is temporary, meaning the rotation won’t be saved back to the PDF, making this a perfect feature for PDF viewers and readers. The rotation is per document and can be controlled programmatically using `PdfDocument#setRotationOffset()`.

<video src="/images/blog/2018/pspdfkit-android-4-6/page-rotation.mp4" playsinline loop muted data-controller="video" data-video-autoplay="true" width="50%" height="50%"></video>

## System Clipboard Images

We improved our [existing system clipboard integration](/blog/2018/pspdfkit-android-4-3/#annotation-copy-and-paste) to now allow copying and pasting of images from other applications into documents and vice versa. This feature uses the powerful Android clipboard framework, which allows sharing of random data using the system clipboard.

<video src="/images/blog/2018/pspdfkit-android-4-6/image-pasting.mp4" playsinline loop muted data-controller="video" data-video-autoplay="true" width="50%" height="50%"></video>

## File Annotations

With PSPDFKit 4.6 for Android, it is now possible to attach arbitrary files directly to PDF documents. Onscreen, file annotations are represented by note-like icons that give quick access to the file’s title and an optional description.

![File Annotations](/images/blog/2018/pspdfkit-android-4-6/file-annotations.png)

Out of the box, PSPDFKit 4.6 for Android supports attaching, removing, and exporting embedded files. Exporting is accessible via the annotation editing toolbar of a selected file annotation, which allows users to open embedded documents within third-party apps or to save them to the filesystem. Check out our new [File Annotations guide article](/guides/android/current/annotations/file-annotations) to learn more.

## Custom Page Content

We noticed the need for creating PDF pages with custom backgrounds and content and extended our APIs on multiple fronts.

![Custom page content](/images/blog/2018/pspdfkit-android-4-6/custom-page.png)

* We added `Canvas`-based page creation. This powerful API allows you to issue PDF drawing commands using a `Canvas` object, just like with any other canvas. This new API can be used for automated creation of PDF reports or for converting other vector graphics into PDFs.

* We added support for custom page patterns. While we have already supported page patterns for quite some time, you can now create your own `PagePattern` from a PDF document and use it when creating new pages using `NewPage.patternPage()`.

* We made page templates inside the Document Editor customizable. You can now create `PageTemplate` objects and pass them to the `NewPageDialog`. We updated our [Document Editing article](/guides/android/current/features/document-editor/) to guide you through the necessary steps.

## And Much More!

* We added `PdfActivity#setSharingOptionsProvider`, which can be used to provide default sharing options in order to skip the default sharing options dialog.
* We optimized our consumer ProGuard file, resulting in better optimization of PSPDFKit when running release builds of your app.

We hope you like the changes in PSPDFKit 4.6 for Android — we’re already working on our next great release, so stay tuned! To see a comprehensive list of changes in this release, check out the [PSPDFKit 4.6 for Android changelog](/changelog/android/#4.6.0).
