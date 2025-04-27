---
title: "PSPDFKit 4.3 for Android"
description: "Today we're releasing PSPDFKit 4.3 for Android!"
preview_image: /images/blog/2018/pspdfkit-android-4-3/pspdfkit-android-4-3-header.png
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/flashmasterdash
date: 2018-01-24 8:00 UTC
tags: Android, Products, Features
published: true
---

Today we’re releasing PSPDFKit 4.3 for Android — our first 2018 update to PSPDFKit for Android. This release features **undo and redo** of edits, **copy and paste** of annotations, **annotation note icons**, an **improved Ink Eraser**, and much more. READMORE This blog post is just a preview of all the great things that went into the release. For a full list of changes, head over to our [changelog for PSPDFKit 4.3 for Android](https://pspdfkit.com/changelog/android/#4.3.0).

## Undo and Redo

We have been heavily invested in building our next big feature for PSPDFKit, and today we’re releasing full **undo and redo** support for annotation edits. Our powerful undo and redo system records all annotation changes performed by your users, and it allows them to navigate backward and forward through the edit history.

Under the hood, we carefully designed a generic undo framework that is capable of recording changes on virtually any kind of data. Currently, only annotation changes are managed via undo and redo, but future releases will provide support for undoing changes on things like bookmarks, document editor pages, and more. Moreover, with one of our next releases, we plan to expose public APIs to our undo framework, giving developers full control over undo and redo.

<video src="/images/blog/2018/pspdfkit-android-4-3/undo-redo.mp4" width="100%" playsinline loop muted data-controller="video" data-video-autoplay="true"></video>

## Annotation Copy and Paste

With **annotation copy and paste**, we enhanced the general annotation editing experience of PSPDFKit 4.3 for Android. You can now copy any annotation into a smart clipboard and paste it to any page of your document (or to a different document). This even works with standard keyboard shortcuts, which is especially useful on Chromebooks.

Another practical feature of copy and paste is the extraction of text from annotations into the system clipboard and vice versa. For example, when pasting text from any app into a document, PSPDFKit will conveniently create a free-text annotation out of it.

<video src="/images/blog/2018/pspdfkit-android-4-3/copy-paste.mp4" width="100%" playsinline loop muted data-controller="video" data-video-autoplay="true"></video>

## Annotation Note Hints

With the introduction of annotation notes in [PSPDFKit 3.3 for Android](https://pspdfkit.com/blog/2017/pspdfkit-android-3-3/), we added a way of inserting additional content _into_ visible annotations. With this release, we enhance the user experience of annotation notes with **Note Hints**. The new [`AnnotationNoteHinter`](https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/note/AnnotationNoteHinter.html) drawable provider can render note icons next to any annotation carrying a note. The hinter is configured to work out of the box in our [`PdfActivity`] on our public API and can also be used with our [`PdfFragment`]. Check out the [Customize Annotation Rendering guide](https://pspdfkit.com/guides/android/current/annotations/customize-annotation-rendering/) for information on how to configure the hinter.

<video src="/images/blog/2018/pspdfkit-android-4-3/note-hints.mp4" width="100%" playsinline loop muted data-controller="video" data-video-autoplay="true"></video>

## Improved Eraser

The existing **Ink Eraser** was improved and can now erase across multiple ink annotations with a single stroke. We optimized performance of the eraser to make the experience as natural as possible. The eraser works hand in hand with our new undo and redo, giving your users all the tools required for professional editing.

<video src="/images/blog/2018/pspdfkit-android-4-3/eraser.mp4" width="100%" playsinline loop muted data-controller="video" data-video-autoplay="true"></video>

## Better Render Quality

PSPDFKit 4.3 for Android now ships with a smart algorithm for selecting the render quality of pages in a [`PdfFragment`]. Previously, the quality of pages scheduled for being displayed was set to a fixed value, but our new low-res render strategy will select the optimum bitmap resolution for renderings based on the device specs. This ensures best performance and quality on any smartphone, tablet, or Chromebook. To find out more about this feature and how to configure it, check out our [Low-Resolution Render API guide](https://pspdfkit.com/guides/android/current/features/low-res-render-api/).

## Many More Changes

* In our push to further improve our code base, we introduced Kotlin 1.2.20 and added a new `KotlinExample` to the Catalog. If you are interested in Kotlin, check out our [PSPDFKit for Android Documentation](https://pspdfkit.com/guides/android/current/), which contains guides that provide a Kotlin code example next to every Java example.

* We added a simple but nonetheless powerful Catalog example of [PSPDFKit Instant](https://pspdfkit.com/instant). The `InstantExample` shows how to initialize and use Instant, and it works with our existing [PSPDFKit Instant for Web demo](https://pspdfkit.com/instant/demo).

* We made several improvements to our Digital Signatures user interfaces and APIs. The `SignatureSignerDialog` can now sign documents without saving them first, which allows your users to sign documents from read-only sources. We also added a new convenience method, [`SignatureFormElement#getOverlappingInkSignature()`](https://pspdfkit.com/api/android/reference/com/pspdfkit/forms/SignatureFormElement.html#getOverlappingInkSignature()), which is for retrieving any ink annotation sitting on top of a signature form field.

We believe that PSPDFKit 4.3 for Android is a fantastic way to start 2018 — and there are many more great things planned for the rest of the year. To see a comprehensive list of changes in this release, check out the [PSPDFKit 4.3 for Android changelog](https://pspdfkit.com/changelog/android/#4.3.0).

<!-- References -->

[`PdfFragment`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfFragment.html
[`PdfActivity`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html
