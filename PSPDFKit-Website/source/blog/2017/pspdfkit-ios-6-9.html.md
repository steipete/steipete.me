---
title: "PSPDFKit 6.9 for iOS"
description: Introducing PSPDFKit 6.9 for iOS. Text Markup Behavior. Catalog Refresh. Signature Improvements. UI Tweaks.
preview_image: /images/blog/2017/pspdfkit-ios-6-9/text-markup.png
section: blog
author:
  - Matej Bukovinski
  - Stefan Kieleithner
author_url:
  - https://twitter.com/bukovinski
  - https://twitter.com/steviki
date: 2017-07-20 18:00 UTC
tags: iOS, Products
published: true
---

Introducing PSPDFKit 6.9 for iOS! This version features a new text markup behavior, a refreshed Catalog example project, various improvements to signatures and some UI tweaks. You can, as always, read up on all the details in the [changelog](/changelog/ios/#6.9.0).

READMORE

## Enhanced Text Markup

In this release, we significantly improved the text selection behavior while marking up text. Previously, the text markup tool provided a rectangular selection area that you could place around the text that should be marked up. This behavior sometimes made it hard to select just a specific part of a larger text block. Now you are presented with the same interface we use during regular text selection, which allows you to easily markup text in multiple lines. You are even presented with a text loupe during selection to improve accuracy. This is now used for all our markup annotations — highlights, strikeouts, squiggles, and underlines.

<video src="/images/blog/2017/pspdfkit-ios-6-9/text-markup.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Catalog Refresh

The PSPDFKit Catalog example project received some content updates as well as a slight visual refresh. We added a lot of new Swift examples that are now living next to the existing Objective-C examples. To help you distinguish between the similarly named Swift and Objective-C examples, we extended the catalog UI to show the example language with a symbol right in the example selection UI. This way if you are playing around with the example code then you'll always know which example to select. There is also a new switch on the top, allowing you to filter the examples by language type.

<video src="/images/blog/2017/pspdfkit-ios-6-9/catalog-refresh.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Signature Improvements

This version changes the flattening behavior for signature annotations. Historically, we never flattened signature annotations because doing so might mistakenly confuse someone that the signature annotation still applies in the flattened document, while actually just being a graphic element in the flattened PDF. However, the previous behavior caused confusion with some of our customers and ultimately did not match what Adobe Acrobat does. In PSPDFKit 6.9 for iOS, signature annotations are now flattened alongside other annotations by default.

If you would like to change this behavior back, take a look at the new [`modifyFormsOfType:change:`][] on [`PSPDFProcessorConfiguration`][] API. This allows you to modify (flatten, embed, or remove) form elements on a document by type, without changing other annotations. This is also explained in more detail in the [guide article about document processing](https://pspdfkit.com/guides/ios/current/features/document-processing/#form-flattening).

We also improved many other details around our Digital Signatures component, following [the big revamp in the last release](https://pspdfkit.com/blog/2017/pspdfkit-ios-6-8/). More types of certificates are supported, certificate validation has been improved, and the Adobe root CA is now included by default when using [`PSPDFSignatureManager`][], so documents can more easily be verified the same way as on desktop readers. We are still not done yet, and there is even more to come in future releases. Stay tuned!

## UI Tweaks

This version also comes with a variety of smaller UI changes and tweaks. Most notably, free text callout annotations now behave much better when dragging the arrow head around.

<video src="/images/blog/2017/pspdfkit-ios-6-9/callout.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Another change worth pointing out was made on the  [`PSPDFBookmarkViewController`][]. When adding a new bookmark while showing the [`PSPDFBookmarkViewController`][], the list will now automatically scroll to and highlight the inserted bookmark.

<video src="/images/blog/2017/pspdfkit-ios-6-9/bookmarks.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Details

Like always, this release also includes various other smaller improvements and bug-fixes.

Touch handling while drawing ink and shape annotations, as well as when erasing, has been rewritten in this release. We are now using using a custom gesture recognizer instead of touch handling directly. This allows for a more streamlined drawing interaction and improves recognition of other gestures. While doing this we also tweaked our line thickness algorithm a bit to produce better results when using the Apple Pencil.

We also improved support for (custom) fixed size annotations. These are annotations that stay the same size independent of the page zoom scale, like note and sound annotations do by default. Please have a look at the `FloatingStampsExample.swift` in the Catalog or [head over to our guides](https://pspdfkit.com/guides/ios/current/annotations/fixed-size-annotations/), to learn more about this feature.

[`modifyFormsOfType:change:`]: https://pspdfkit.com/api/ios/Classes/PSPDFProcessorConfiguration.html#/c:objc(cs)PSPDFProcessorConfiguration(im)modifyFormsOfType:change:
[`PSPDFProcessorConfiguration`]: https://pspdfkit.com/api/ios/Classes/PSPDFProcessorConfiguration.html#/c:objc(cs)PSPDFProcessorConfiguration
[`PSPDFSignatureManager`]: https://pspdfkit.com/api/ios/Classes/PSPDFSignatureManager.html
[`PSPDFBookmarkViewController`]: https://pspdfkit.com/api/ios/Classes/PSPDFBookmarkViewController.html
