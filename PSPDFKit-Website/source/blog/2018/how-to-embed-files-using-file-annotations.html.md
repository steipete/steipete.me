---
title: "How to Embed Files Using File Annotations"
description: "We're taking a look at how to embed files using file annotations."
preview_image: /images/blog/2018/how-to-embed-files-using-file-annotations/article-header.png
section: blog
author:
  - Rad Azzouz
author_url:
  - https://twitter.com/radazzouz
date: 2018-06-11 12:00 UTC
tags: iOS, Android, macOS, Features, Products
published: true
---

With [PSPDFKit 4.6 for Android](/blog/2018/pspdfkit-android-4-6/), [PSPDFKit 7.6 for iOS](/blog/2018/pspdfkit-ios-7-6/), and [PSPDFKit 2.6 for macOS](https://pspdfkit.com/changelog/macos/#2.6.0), we added the ability to create embedded files using file annotations.

You can embed any file type. You can even embed a PDF, which embeds another PDF, which, in turn, embeds a PDF, and so on.

READMORE

<video src="/images/blog/2018/how-to-embed-files-using-file-annotations/nested-embedded-pdfs.mp4" width="50%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Embedding files can be a handy feature for various business cases. For example, you can embed an Excel document in your monthly report (a PDF document). Your recipients can then preview and open a copy in another application such as Microsoft Excel; they can even make changes to the Excel document and send it back to you.

In this article, we’ll discuss how to preview and open embedded files and how to programmatically embed an Excel document into a PDF using file annotations. Let’s get started!

## Preview and Open Embedded Files

You can preview file attachments directly in PSPDFKit.

<video src="/images/blog/2018/how-to-embed-files-using-file-annotations/preview-embedded-file.mp4" width="50%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

You can then open a copy in third-party applications or, on iOS, open it in Apple’s Files app using the share action.

<video src="/images/blog/2018/how-to-embed-files-using-file-annotations/add-to-files-app.mp4" width="50%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Programmatically Create a File Annotation with an Embedded File

You can create a file annotation with an embedded file using the URL of any file. Here’s how this looks in code:

### Android

```kotlin
// Open PdfDocument.
val document = PdfDocument.openDocument(context, uri)

// Create an embedded file source serving file data from assets.
val embeddedFileSource = EmbeddedFileSource(
    AssetDataProvider("Monthly Budget"),
    "Monthly Budget.xlsx",
    "Monthly Budget"
)

// Create a file annotation instance.
val fileAnnotation = FileAnnotation(
    // Page index 0.
    0,
    // Page rectangle (in PDF coordinates).
    RectF(500f, 250f, 532f, 218f),
    // Use the created embedded file source.
    embeddedFileSource
)
fileAnnotation.iconName = FileAnnotation.GRAPH
fileAnnotation.color = Color.BLUE

// Add the newly created file annotation to the document.
document.annotationProvider.addAnnotationToPage(fileAnnotation)
```

### iOS

```swift
// Create PSPDFDocument.
let document = PSPDFDocument(url: documentURL)

// Create the URL of the appearance stream that uses a PDF file.
let samplesURL = Bundle.main.resourceURL!.appendingPathComponent("Samples")
let embeddedFileURL = samplesURL.appendingPathComponent("Monthly Budget.xlsx")

// Create a new file annotation and set its properties.
let fileAnnotation = PSPDFFileAnnotation()
fileAnnotation.pageIndex = 0
fileAnnotation.iconName = .graph
fileAnnotation.color = .blue
fileAnnotation.boundingBox = CGRect(x: 500, y: 250, width: 32, height: 32)

// Create an embedded file and add it to the file annotation.
let embeddedFile = PSPDFEmbeddedFile(fileURL: embeddedFileURL, fileDescription: "Monthly Budget")
fileAnnotation.embeddedFile = embeddedFile

// Add the newly created annotation to the document.
document.add([fileAnnotation])
```

To learn more about how to programmatically create file annotations with embedded files, check out `FileAnnotationCreationExample` on Android and `AddFileAnnotationProgrammaticallyExample`on iOS inside the [Catalog apps](/guides/ios/current/getting-started/example-projects/), or review the in-depth guide articles [on iOS](/guides/ios/current/features/embedded-files/) and [Android](/guides/android/current/features/embedded-files/).

## Create a File Annotation with an Embedded File from the UI

In addition to the above, you can also create a file annotation from a UI element. We’ve added the `AddFileAnnotationWithEmbeddedFile` example in the [Catalog app](/guides/ios/current/getting-started/example-projects/) to illustrate how to do it using a custom menu. We also plan on building the ability to create file annotations from the UI (annotation toolbar, menu item, etc.) into our SDKs in a future update. Stay tuned!
