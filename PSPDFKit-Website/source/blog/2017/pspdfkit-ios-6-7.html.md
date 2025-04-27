---
title: "PSPDFKit 6.7 for iOS"
description: Introducing PSPDFKit 6.7 for iOS. Page Grabber. File Coordination. Document Progress Indication. Privacy Access Denied UI.
preview_image: /images/blog/2017/pspdfkit-ios-6-7/page-grabber.png
section: blog
author:
  - Matej Bukovinski
  - Stefan Kieleithner
author_url:
  - https://twitter.com/bukovinski
  - https://twitter.com/steviki
date: 2017-05-10 14:00 UTC
tags: iOS, Development, Products
published: true
---

Today we're excited to release PSPDFKit 6.7 for iOS! This version includes a new page grabber UI control, file coordination support, document progress indication and various UI tweaks, improvements and bug fixes. You can read up on all the details in the [changelog](/changelog/ios/#6.7.0).

READMORE

## Page Grabber

PSPDFKit 6.7 for iOS introduces our new [page grabber](/api/ios/Classes/PSPDFPageGrabber.html). This UI component allows you to quickly and conveniently scroll through all pages in a document. You can use it in addition to the [scrubber bar](/api/ios/Classes/PSPDFScrubberBar.html) with all configurations, as it supports all available [page transitions](/api/ios/Enums/PSPDFPageTransition.html), [scroll directions](/api/ios/Enums/PSPDFScrollDirection.html), and [page modes](/api/ios/Enums/PSPDFPageMode.html).

<img title="Page Grabber" width="70%" src="/images/blog/2017/pspdfkit-ios-6-7/page-grabber.gif">

The page grabber can be enabled using the following code snippet.

[==

```swift
let configuration = PSPDFConfiguration { builder in
	builder.isPageGrabberEnabled = true
}
let pdfController = PSPDFViewController(document: document, configuration: configuration)
```

```objc
PSPDFConfiguration *configuration = [PSPDFConfiguration configurationWithBuilder:^(PSPDFConfigurationBuilder *builder) {
    builder.pageGrabberEnabled = YES;
}];
PSPDFViewController *pdfController = [[PSPDFViewController alloc] initWithDocument:document configuration:configuration];
```

==]

## File Coordination

Since file access from different processes is no longer just an edge case on iOS, we decided to make all our PDF file related file system operations coordinated operations by default. This ensures that using a PDF file in an extension environment or with iCloud is now much safer than it was before. `PSPDFDocument` instances initialized with a file URL now automatically create a backing `PSPDFCoordinatedFileDataProvider`, which perform coordinated reads and writes. The coordinated data providers also observe the backing file for changes, by adopting the `NSFilePresenter` protocol, and automatically reload the UI when needed.

You can see this functionality in action by trying out the new open-in-place or iCloud support in our [PDF Viewer App](https://pdfviewer.io).

<img title="Open In Place" width="100%" src="/images/blog/2017/pspdfkit-ios-6-7/open-in-place.gif">

## Document Progress Indication

If you are downloading or generating your PDF file on demand, you no longer need to come up with your own progress UI. PSPDFKit can now handle this for you. We extended our `PSPDFDataProvider` API with support for `NSProgress` and implemented a default progress UI inside `PSPDFViewController`. If you set up a data provider with an `NSProgress` object, we'll monitor its state and automatically show our progress UI while progress is ongoing.

[==

```swift
let provider = PSPDFCoordinatedFileDataProvider(fileURL:destinationFileURL, baseURL:nil, progress: myNSProgress)
let document = PSPDFDocument(dataProvider: provider)
let controller = PSPDFViewController(document: document)
```

```objc
PSPDFCoordinatedFileDataProvider *provider = [[PSPDFCoordinatedFileDataProvider alloc] initWithFileURL:destinationFileURL baseURL:nil progress:myNSProgress];
PSPDFDocument *document = [[PSPDFDocument alloc] initWithDataProvider:provider];
PSPDFViewController *controller = [[PSPDFViewController alloc] initWithDocument: document];
```

==]

Check out `DocumentProgressExample.swift` in our example Catalog for a full example.

<img title="Document Progress Indication" width="70%" src="/images/blog/2017/pspdfkit-ios-6-7/document-progress-indication.gif">

## Privacy Access Denied UI

PSPDFKit now shows a custom view when the user, via their privacy settings, denied access to things like the camera or the photo library, providing a consistent UI across all available source types.
Previously the UI was partly provided by Apple's `UIImagePickerController`, and other source types used a custom alert view. This has now been unified, so all source types are using the same UI, while also improving the design.

<img title="Privacy Access Denied UI" width="70%" src="/images/blog/2017/pspdfkit-ios-6-7/privacy-access-denied.png">

## Various Details

Like with every release, this one is also packed with a lot of smaller improvements and fixes. [Bookmarks have been refactored](/guides/ios/current/miscellaneous/bookmarks/) and made immutable. Some API have changed, which are outlined in the [changelog](/changelog/ios/#6.7.0). We improved support for [annotation flags](/api/ios/Enums/PSPDFAnnotationFlags.html), as well as the corresponding documentation, to reflect the current state. Annotations now respect their [minimum size](/api/ios/Classes/PSPDFAnnotation.html#/c:objc(cs)PSPDFAnnotation(py)minimumSize) during creation as well as when the annotation is already added to the document and resized. The outline list scrolling behaviour received some fixes. Choice forms are now providing a better UX by making the option list searchable and scrolling automatically to the selected option.

<img title="Search Choice Forms" width="70%" src="/images/blog/2017/pspdfkit-ios-6-7/search-choice-forms.gif">
