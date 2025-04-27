---
title: "PSPDFKit 6.5 for iOS"
description: Introducing PSPDFKit 6.5 for iOS. Better Apple Pencil Support. 3D Touch. Forms. UI Enhancements. Even More Improvements.
preview_image: /images/blog/2017/pspdfkit-ios-6-5/marking-marks.gif
section: blog
author:
  - Matej Bukovinski
  - Douglas Hill
  - Stefan Kieleithner
author_url:
  - https://twitter.com/bukovinski
  - https://twitter.com/qdoug
  - https://twitter.com/steviki
date: 2017-03-09 12:00 UTC
tags: iOS, Development, Products
published: true
---

Introducing PSPDFKit 6.5 for iOS! This release includes first-class Apple Pencil support, 3D Touch features, a completely rewritten and improved forms parser, UI improvements as well as various enhancements and bug fixes. Take a look at our [changelog](/changelog/ios/#6.5.0) for all the changes, improvements and fixes in this release.

READMORE

## Apple Pencil

PSPDFKit supported the Apple Pencil since version 5.1, but with this release, we're bringing Apple Pencil support to a new level. It’s now possible to annotate with Apple Pencil while scrolling and tapping in the document with a finger. This feels very natural and enables fast workflows for marking up documents.

![Writing with Apple Pencil: the pencil is for making marks](/images/blog/2017/pspdfkit-ios-6-5/marking-marks.gif)

By default, the Apple Pencil behavior is fully automatic: users simply select an annotation tool and start annotating with the Pencil, when it's available. This is backed by a flexible API that even allows setting the Pencil to always create a particular annotation type without showing any toolbar UI, such as always draw ink or always highlight text. We’ve added a new [guide article about the Apple Pencil](/guides/ios/current/annotations/apple-pencil/) to explain all this.

We've simplified the way third-party stylus SDKs can be integrated with PSPDFKit so that Apple Pencil works alongside them as an additional [`PSPDFStylusDriver`][], and tested it using the latest stylus SDKs. You can find out more in the updated [third-party stylus support guide](/guides/ios/current/features/stylus-support/).

![Stylus list: None, Apple Pencil, FiftyThree, Adonit Jot, Wacom, Pogo Connect](/images/blog/2017/pspdfkit-ios-6-5/stylus-list.png)

## 3D Touch

With more and more devices supporting 3D Touch, it makes sense that we also integrate it into PSPDFKit. You can now 3D Touch in a bunch of places and get a preview of the destination for a particular action.
Views, where 3D Touch is currently supported, include the thumbnail grid view, the annotations controller, the outline controller, the bookmarks controller and the search controller.

![3D Touch Thumbnail Grid](/images/blog/2017/pspdfkit-ios-6-5/3d-touch-thumbnail-grid.gif)

## Forms

With PSPDFKit 6.5 for iOS, we completely rewrote our forms parser from the ground up. Read all about these changes in our [new guide article, explaining the form architecture in more detail](/guides/ios/current/forms/introduction-to-forms/). We also prepared [a migration guide](/guides/ios/current/migration-guides/pspdfkit-65-migration-guide/), helping you to update any form related logic to the new architecture.

## UI Enhancements

We also squeezed a lot of smaller UI improvements into this release. One of them is improved haptic feedback support, which now also includes changing tabs in [`PSPDFTabbedViewController`][].
There are also improvements to the gallery and a new feature in [`PSPDFTabbedViewController`][], which allows you to close all but selected tab.

[`PSPDFSettingsViewController`][] also received some updates. It is now set up to show only the compatible settings for selected configurations.

![Improved Settings Controller](/images/blog/2017/pspdfkit-ios-6-5/settings-controller.gif)

## Carthage Support

PSPDFKit is now available via Carthage. In addition to our existing manual integration and CocoaPods options, you now have a great new way to quickly integrate PSPDFKit into your projects. As a PSPDFKit customer, you can find your Carthage URL in our [customer portal](https://customers.pspdfkit.com) by choosing the "Use Carthage" tab when downloading PSPDFKit. For more info, check out our new [Using Carthage](/guides/ios/current/getting-started/using-carthage/) guide.

![Carthage Link](/images/blog/2017/pspdfkit-ios-6-5/carthage.png)

## API Additions

PSPDFKit 6.5 for iOS also includes some API refinements, making the SDK nicer to use while added a few new features. You can now schedule and group multiple [`PSPDFRenderTask`][]s together to render more images at once and only get a single completion handler callback when all tasks are finished. This can be done using the new [`-[PSPDFRenderQueue scheduleTasks:]`](https://pspdfkit.com/api/ios/Classes/PSPDFRenderQueue.html#/c:objc(cs)PSPDFRenderQueue(im)scheduleTasks:) or [`-[PSPDFRenderTask groupTasks:completionHandler:]`](https://pspdfkit.com/api/ios/Classes/PSPDFRenderTask.html#/c:objc(cs)PSPDFRenderTask(cm)groupTasks:completionHandler:) API calls.

We are also improving our Swift support continuously- in this release, we made the `PSPDFAnnotationString*` keys an enum in Swift, so you can, for example, just use `.ink` instead of `PSPDFAnnotationStringInk`.

We've also slightly refined [`fitToWidthEnabled`][]. This property has been changed from type `Bool` to [`PSPDFAdaptiveConditional`](https://pspdfkit.com/api/ios/Other%20Enums.html#/c:@E@PSPDFAdaptiveConditional), which means that this can now be set to be adaptive, as well as _always enabled_ or _disabled_. When set to adaptive, document pages will adjust to the view width when the [`PSPDFViewController`][] is in a compact height size class environment.

Security is very important to us, that's why we improved the printing flow, by making the complete print behavior customizable using the new [`PSPDFPrintConfiguration`][] class. You can select different modes with `PSPDFPrintMode` to use the default printing mode, choosing from _showing the document preview_, _only show available printers_, or _set a default printer_ without any further user interaction required when selecting the print option.

Interactive Flow           |  Choose Printer Only Flow
:-------------------------:|:-------------------------:
![Interactive Flow](/images/blog/2017/pspdfkit-ios-6-5/print-interactive-flow.gif) | ![Choose Printer Only Flow](/images/blog/2017/pspdfkit-ios-6-5/print-choose-printer-flow.gif)

A related change is the introduction of a new sharing option `PSPDFDocumentSharingOptionFlattenAnnotationsForPrint` which is now used by default when printing. This option ensures that we exclude annotations that have been flagged as not printable when preparing a document for printing.

## More Improvements

We care very much about details, therefore you'll find various improvements and fixes all over the framework in this release. For instance, you can now set a cloudy line style for supported geometric annotations using the annotation inspector.

![Cloudy Line Style](/images/blog/2017/pspdfkit-ios-6-5/cloudy-border.png)

[`PSPDFStylusDriver`]: https://pspdfkit.com/api/ios/Protocols/PSPDFStylusDriver.html
[`PSPDFRenderTask`]: https://pspdfkit.com/api/ios/Classes/PSPDFRenderTask.html
[`PSPDFPrintConfiguration`]: https://pspdfkit.com/api/ios/Classes/PSPDFPrintConfiguration.html
[`fitToWidthEnabled`]: https://pspdfkit.com/api/ios/Classes/PSPDFConfiguration.html#/c:objc(cs)PSPDFConfiguration(py)fitToWidthEnabled
[`PSPDFViewController`]: https://pspdfkit.com/api/ios/Classes/PSPDFViewController.html
[`PSPDFTabbedViewController`]: https://pspdfkit.com/api/ios/Classes/PSPDFTabbedViewController.html
[`PSPDFSettingsViewController`]: https://pspdfkit.com/api/ios/Classes/PSPDFSettingsViewController.html
