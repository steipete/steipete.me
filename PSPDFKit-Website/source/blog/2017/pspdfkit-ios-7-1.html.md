---
title: "PSPDFKit 7.1 for iOS"
description: Introducing PSPDFKit 7.1 for iOS. Featuring iPhone X compatibility, copying and pasting document pages, drawing performance improvements, and more.
preview_image: /images/blog/2017/pspdfkit-ios-7-1/ios-7-1-header.png
section: blog
author:
  - Matej Bukovinski
  - Stefan Kieleithner
author_url:
  - https://twitter.com/bukovinski
  - https://twitter.com/steviki
date: 2017-11-17 12:00 UTC
tags: iOS, Development, Products
published: true
---

Today we’re introducing PSPDFKit 7.1 for iOS! This version features full iPhone X compatibility, support for copying and pasting pages between documents via the Document Editor, improvements to the drawing performance, and more. READMORE In this post, we will provide you with a basic overview of what to expect, but as always, our [changelog][iOS 7.1 Changelog] lists all the features, improvements, and changes in detail.

## iPhone X

PSPDFKit is now fully adapted to the latest and greatest iPhone model. While most of the fixes already shipped with the previous 7.0.x updates, we did some additional polishing in 7.1. For example, we audited our user interface components and made sure all views and layouts are intact and fully functional on iPhone X. However, adding support for the iPhone X wasn’t as straightforward as we first thought it would be, so we published a [blog post on the challenges](/blog/2017/supporting-iphone-x) we faced during the process.

|   |   |
| - | - |
| [![Annotation Toolbar Before](/images/blog/2017/pspdfkit-ios-7-1/annotation-toolbar-before.png)](/blog/2017/supporting-iphone-x) | [![Annotation Toolbar After](/images/blog/2017/pspdfkit-ios-7-1/annotation-toolbar-after.png)](/blog/2017/supporting-iphone-x) |

## Copying and Pasting Pages

Our [Document Editor][Document Editor Guides] component gained a great new feature in this release: It is now bundled with dedicated UI controls for copying and pasting pages, both inside the same document and across PDF documents in your application. This feature works especially well with our tabbed view controller, which allows for easy switching between documents presented in the document editing view mode.

At the same time, we also improved our model-level [`PSPDFDocumentEditor`][] with new convenience APIs that ease the implementation of a custom copy/paste interaction if you decide to provide your own UI.

<video src="/images/blog/2017/pspdfkit-ios-7-1/copy-paste.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Drawing Performance

In this release, we drastically improved performance when drawing ink annotations, which is especially noticeable when using the Apple Pencil. We applied multiple performance optimizations to our ink annotation logic and rendering code that, when combined, lead to a very noticeable speed-up during annotation creation.

**CPU performance improvement while drawing 1,000 strokes**

![Drawing Performance Chart](/images/blog/2017/pspdfkit-ios-7-1/drawing-improvement.png)

We also introduced a new annotation create mode, [`PSPDFDrawCreateModeAutomatic`][], which is now the default for the [`drawCreateMode`][] option. This new mode intelligently splits drawings into multiple ink annotations based on the distance to existing lines and the time passed since drawing the last stroke. It not only makes the user experience more intuitive, but it also helps improve performance by creating more annotations than was the case with [`PSPDFDrawCreateModeMergeIfPossible`][].

<video src="/images/blog/2017/pspdfkit-ios-7-1/automatic-draw-create-mode.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Page Labels

This release improves how the currently displayed pages are shown to the user on the [bottom page label][PSPDFPageLabelView]. Most of these improvements apply to the continuous page transition mode, while some are beneficial in all situations and configurations. Previously, only the most visible page was shown in the page label in continuous transition mode, but now, the page label takes into account all currently visible pages on the screen, similar to what we did before in double page mode. This displays a much more accurate representation of the current state. The page label now also features a new animation when transitioning from one spread to another.

<video src="/images/blog/2017/pspdfkit-ios-7-1/page-labels.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Vector Stamps

[Vector stamp annotations][Appearance Stream Guide], which were introduced in PSPDFKit 7.0 for iOS, provide a way to use stamps that show vector data in the form of a PDF rather than an image. This enables you to provide sharper, more fine-grained, and transparent stamps. We improved vector stamps in 7.1 and added a new example to Catalog, which shows how to create stamps programmatically. Look out for an upcoming blog post explaining vector stamps in more detail.

## Instant Migration Note

**Important:** PSPDFKit 7.1 for iOS is the last release of Instant that’s compatible with PSPDFKit Server 2017.7 and earlier. The next release will require 2017.8. For further information, please refer to the [migration guide](/guides/web/current/migration-guides/2017-8-migration-guide/).

In case an old, unsupported version of PSPDFKit for iOS is used to connect to PSPDFKit Server 2017.8, an error message is now shown to the user. The message states that an update is required to access document and sync annotations. You can customize this behavior and turn off the user-facing alert by disabling [`shouldShowCriticalErrors`][].

## API, Tweaks, and Details

In addition to the above changes, we also improved other parts of the SDK: new pages added to the Document Editor will now be added to the end of the document; system edge gestures are deferred intelligently based on the state and position of the annotation toolbar; continuous scroll mode has been enhanced by automatically adjusting the content position when the user interface shows or hides; underline annotations have been improved and are now more accurately positioned; we are now using `NS_ERROR_ENUM` to mark error enums to improve the experience when using Swift; and there are new Catalog examples, showing how to switch between single and double page mode on the fly.

To see a complete list of changes, check out the [PSPDFKit 7.1 for iOS changelog][iOS 7.1 Changelog].

[iOS 7.1 Changelog]: /changelog/ios/#7.1.0
[Document Editor Guides]: /guides/ios/current/features/document-editor/
[`PSPDFDocumentEditor`]: /api/ios/Classes/PSPDFDocumentEditor.html
[`drawCreateMode`]: /api/ios/Classes/PSPDFConfiguration.html#/c:objc(cs)PSPDFConfiguration(py)drawCreateMode
[`PSPDFDrawCreateModeAutomatic`]: /api/ios/Enums/PSPDFDrawCreateMode.html#/c:@E@PSPDFDrawCreateMode@PSPDFDrawCreateModeAutomatic
[`PSPDFDrawCreateModeMergeIfPossible`]: /api/ios/Enums/PSPDFDrawCreateMode.html#/c:@E@PSPDFDrawCreateMode@PSPDFDrawCreateModeMergeIfPossible
[PSPDFPageLabelView]: /api/ios/Classes/PSPDFPageLabelView.html
[Appearance Stream Guide]: /guides/ios/current/annotations/appearance-streams/
[`shouldShowCriticalErrors`]: /api/ios/Classes/PSPDFInstantViewController.html#/c:objc(cs)PSPDFInstantViewController(py)shouldShowCriticalErrors
