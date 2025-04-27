---
title: "PSPDFKit 8.3 for iOS"
description: Introducing PSPDFKit 8.3 for iOS — featuring stamp annotation rotation, a new link annotation editing UI, extended support for keyboard shortcuts, and much more.
preview_image: /images/blog/2019/pspdfkit-ios-8-3/ios-8-3-header.png
preview_video: /images/blog/2019/pspdfkit-ios-8-3/ios-8-3-header.mp4
section: blog
author:
  - Matej Bukovinski
author_url:
  - https://twitter.com/bukovinski
date: 2019-04-23 11:00 UTC
tags: iOS, Development, Products
published: true
---

We’re excited to announce PSPDFKit 8.3 for iOS. This release is packed with new features and enhancements, including support for annotation rotation, a redesigned link creation and editing UI, and vastly improved support for keyboard shortcuts. PSPDFKit 8.3 for iOS also adds support for the system document picker on our save view and a new API for storing custom data on annotations.

READMORE

## Annotation Rotation

Adding support for annotation rotation was a long-running internal effort for the iOS team — one that required quite a bit of prior groundwork for our annotation model and coordinate system handling, and reaching back all the way to the release of [PSPDFKit 8 for iOS][normalized page transforms]. With PSPDFKit 8.3 for iOS, we’re finally making our implementation public, beginning with exposing rotation functionality for stamp annotations. This support is available both at the model level, via conformance to the [`PSPDFRotatable`][] protocol, and on the UI level, via a new rotation handle on [`PSPDFResizableView`][]. Our stamp rotation handling is compatible with Adobe Acrobat, and it also offers rotation to arbitrary angles and not just multiples of 90 degrees.

<video src="/images/blog/2019/pspdfkit-ios-8-3/stamp-rotation.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true" width="80%"></video>

In the future, we plan on adding support for rotating additional annotation types — starting with free text annotations — in order to achieve feature parity with [Android][android annotation rotation].

## Link Annotation Editing UI

PSPDFKit for iOS has long supported all main link annotation types defined in the PDF specification. The framework has also always come bundled with a convenient simple link annotation editing UI that could be used to add or edit links on other pages in a document or on webpages. However, this UI was disabled by default, as it was a bit rough around the edges and lacked the polish for which our UI is known. With PSPDFKit 8.3, we completely rewrote the link annotation creation UI, extended it with a new link annotation tool on the annotation toolbar, and enabled all its functionality by default.

<video src="/images/blog/2019/pspdfkit-ios-8-3/link-creation-editing.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true" width="80%"></video>

If you’d like to keep the previous behavior wherein link annotations are read-only, you can do so by removing link annotations from [`editableAnnotationTypes`][] in [`PSPDFConfiguration`][].

## Keyboard Shortcuts

With PSPDFKit 8.3 for iOS, we’re taking our support for keyboard shortcuts to a whole new level. In addition to being able to navigate between pages and invoke some simple commands like searching and selecting all text, you can now also invoke actions for built-in bar button items, navigate through table views, manage tabs, and much more.

Please check out the updated [Keyboard Shortcuts guide article][keyboard shortcuts guide] to learn about all the new keyboard shortcuts, or simply press and hold Command to get the system cheat sheet directly inside different locations in the framework UI.

## System Document Picker

iOS 11 introduced a great new component for opening and saving files via the [`UIDocumentPickerViewController`][] class. With this release, we’ve integrated the system picker UI into the Document Editor’s saving workflow. This is achieved through a new special directory type, [`PSPDFDirectory.documentPickerDirectory`][], which is now added to the [`saveDirectories`][] list by default. With it, your users will be able to save edited documents to any location supported by the iOS document picker, including many cloud storage providers.

<video src="/images/blog/2019/pspdfkit-ios-8-3/system-document-picker.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true" width="80%"></video>

## Custom Annotation Data

PSPDFKit for iOS now provides a new public API on [`PSPDFAnnotation`][], which can be used to save [custom annotation data][] with any annotation type. This API allows you to directly store data that is relevant to your specific use case with a PDF annotation. That data will be serialized into a JSON-based format and written out together with annotations when saving. This functionality is supported when writing through all our main annotation provider options — PDF, XFDF, and Instant JSON. The [custom annotation data][] is a proprietary extension of the PDF specification, which is available on all PSPDFKit platforms.

## Additional Details

As always, along with the highlighted features mentioned above, this release also includes a long list of other additions, improvements, and fixes. One example is the signature creation UI, which received several improvements in order to make it better adopt to device rotation and application resizing. We also improved JavaScript and Document Editor performance, increased the number of undoable actions, and added a new flag to enable adding multiple bookmarks to a single page. For all the details, please check out the [changelog][ios 8.3 changelog].

## End of Life: Support for iOS 10

PSPDFKit 8.3 for iOS raises the deployment target to iOS 11 and requires Xcode 10.2 to build examples, which were converted to Swift 5. Removing support for iOS 10 will allow us to concentrate our development and support efforts on preparation for the upcoming iOS 13, which we expect to be announced at this year’s WWDC. We would encourage you to mimic this change on your projects, so that you’ll be able to keep taking advantage of the latest PSPDFKit releases. To learn more about our version support policy, check out [this guide article][version support].

[ios 8.3 changelog]: /changelog/ios/#8.3.0
[android annotation rotation]: https://pspdfkit.com/blog/2018/pspdfkit-android-4-6/#annotation-rotation
[normalized page transforms]: https://pspdfkit.com/blog/2018/pspdfkit-ios-8-0/#normalized-page-transforms
[`pspdfresizableview`]: https://pspdfkit.com/api/ios/Classes/PSPDFResizableView.html
[`pspdfrotatable`]: https://pspdfkit.com/api/ios/Protocols/PSPDFRotatable.html
[`editableannotationtypes`]: https://pspdfkit.com/api/ios/Classes/PSPDFConfiguration.html#/c:objc(cs)PSPDFConfiguration(py)editableAnnotationTypes
[`pspdfconfiguration`]: https://pspdfkit.com/api/ios/Classes/PSPDFConfiguration.html
[keyboard shortcuts guide]: https://pspdfkit.com/guides/ios/current/features/keyboard-shortcuts/
[`uidocumentpickerviewcontroller`]: https://developer.apple.com/documentation/uikit/uidocumentpickerviewcontroller
[`pspdfdirectory`]: https://pspdfkit.com/api/ios/Classes/PSPDFDirectory.html
[`pspdfdirectory.documentpickerdirectory`]: https://pspdfkit.com/api/ios/Classes/PSPDFDirectory.html#/c:objc(cs)PSPDFDirectory(cm)documentPickerDirectory
[`savedirectories`]: https://pspdfkit.com/api/ios/Classes/PSPDFDocumentEditorConfiguration.html#/c:objc(cs)PSPDFDocumentEditorConfiguration(py)saveDirectories
[`pspdfannotation`]: https://pspdfkit.com/api/ios/Classes/PSPDFAnnotation.html
[custom annotation data]: https://pspdfkit.com/blog/2019/custom-annotation-data/
[version support]: https://pspdfkit.com/guides/ios/current/announcements/version-support/
