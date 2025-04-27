---
title: "PSPDFKit 8.5 for iOS"
description: Introducing PSPDFKit 8.5 for iOS — with user interface options to change the stacking order of annotations and the page binding of documents.
preview_image: /images/blog/2019/pspdfkit-ios-8-5/header.png
preview_video: /images/blog/2019/pspdfkit-ios-8-5/header.mp4
section: blog
author:
  - Douglas Hill
author_url:
  - https://twitter.com/qdoug
date: 2019-07-31 16:00 UTC
tags: iOS, Development, Products
published: true
---

We are happy to announce that PSPDFKit 8.5 for iOS is out today. In this release, we added advanced user interface options for changing the stacking order of annotations and the page binding of documents. We also simplified the process of trying PSPDFKit and then using it in production by unifying the demo and full downloads.

READMORE

## Annotation Stacking Order

We’ve added the ability for users to change the order in which annotations are stacked on the page. So, for example, if an ink stroke is behind a stamp annotation, the user can change the order so that the ink stroke will be on top of the stamp. This functionality is available from the edit mode in the annotation list.

<video src="/images/blog/2019/pspdfkit-ios-8-5/zindex_list.mp4" 
 poster="/images/blog/2019/pspdfkit-ios-8-5/zindex_list.png" 
 width="100%" 
 data-controller="video"
 data-video-autoplay="true"
 controls 
 playsinline 
 loop 
 muted>
</video>

When there are multiple annotations on a page, the annotation inspector now includes buttons to move an annotation forward, backward, to the front, or to the back.

<video src="/images/blog/2019/pspdfkit-ios-8-5/zindex_inspector.mp4" 
 poster="/images/blog/2019/pspdfkit-ios-8-5/zindex_inspector.png" 
 width="100%" 
 data-controller="video"
 data-video-autoplay="true"
 controls 
 playsinline 
 loop 
 muted>
</video>

The order can be set programmatically using the new [`PSPDFAnnotationManager`][] methods [`insertAnnotation:atZIndex:options:error:`][] and [`updateAnnotationsOnPageAtIndex:error:withUpdateBlock:`][]. Changing the order in the UI can be disabled using [`PSPDFConfiguration`][]’s new [`allowAnnotationZIndexMoves`][] property.

## Page Binding

PDF documents support a metaphorical page binding, which is used when pages are laid out horizontally. Many languages use a left-to-right script, which calls for a page binding on the left edge. However, binding on the right edge is preferable for right-to-left scripts such Arabic and Hebrew and several East Asian scripts. The page binding is used with horizontal scrolling and in the thumbnails view. It has no effect when using vertical scrolling unless double-page mode is also enabled.

The page binding ought to be specified by the author when a PDF is created. However, sometimes this is not done, in which case most PDF readers will default to a left-edge binding.

We added an option in the document info editor that allows users to correct the page binding, and these changes will be saved into the PDF.

<video src="/images/blog/2019/pspdfkit-ios-8-5/page_binding.mp4" 
 poster="/images/blog/2019/pspdfkit-ios-8-5/page_binding.jpg" 
 width="100%" 
 data-controller="video"
 data-video-autoplay="true"
 controls 
 playsinline 
 loop 
 muted>
</video>

Note that this is independent of the device’s language setting. A user might have their device set to English and be reading an Arabic book. In this case, most of the user interface will be shown from left to right, and only the PDF pages will be ordered from right to left.

If you want to change the page binding programmatically, you can use the [`pageBinding`][] property on [`PSPDFDocument`][].

## Simplified Integration

We’re always looking for ways to improve the customer experience with PSPDFKit. Previously, after downloading a trial of our framework and then deciding to go ahead and use our product, users would have had to download a separate version of PSPDFKit for use in production. We’ve simplified this so that a single download can be used both when on trial and in production, making the process of getting up and running with us faster and simpler.

We’ve added an optional JSON Podspec for development environments that require one. Learn more about [using a JSON Podspec here][use-json-podspec guide].

## And More

We believe that, in general, the best user experience for opening links on iOS is to switch to the full Safari browser rather than using an in-app browser with [`SFSafariViewController`][]. This matches how [`UITextView`][] handles links, and it offers a lot more flexibility to the user. Therefore, we’ve changed the default action for opening links from the Safari view controller to the Safari app. If you like, you can change this back by setting the [`linkAction`][] of [`PSPDFConfiguration`][] to [`PSPDFLinkActionInlineBrowser`][].

We’ve simplified the color palette in the annotation inspector. PSPDFKit used to show four pages with a vast selection of color variations, and we’ve cut that down to just one page showing 18 carefully picked options. Our full color wheel is still available by default for fine tuning, and the old [rainbow][], [modern][], [vintage][], and [monochrome][] color palettes are available using the [`PSPDFColorPalette`][] API.

[Image annotations][] and [vector stamps][] can now be rotated, just like standard stamp annotations and free text annotations.

PSPDFKit now supports rendering emojis in PDF forms. Express yourself! 💙

![Screenshot of PDF Viewer showing the new color palette in the middle, with rotated images and emojis to the side.](/images/blog/2019/pspdfkit-ios-8-5/colors_rotation_emoji.png)

Finally, we’ve improved the clipboard integration in the [Document Editor][]. Now, after you cut or copy pages from the Document Editor, you can paste just those pages as a new PDF document in other applications. The reverse works too: You can copy a PDF from another application and paste in the Document Editor to insert all the pages.

You can read about everything in PSPDFKit 8.5 for iOS in our [changelog][].

We’re hard at work getting PSPDFKit ready for iOS 13. We’re also very excited about bringing our full feature set — including the user interface — to the Mac, using Apple’s Project Catalyst. We’ll have more details about this later on.

[changelog]: https://pspdfkit.com/changelog/ios/#8.5.0
[`pspdfdocument`]: https://pspdfkit.com/api/ios/Classes/PSPDFDocument.html
[`pagebinding`]: https://pspdfkit.com/api/ios/Classes/PSPDFDocument.html#/c:objc(cs)PSPDFDocument(py)pageBinding
[image annotations]: https://pspdfkit.com/guides/ios/current/annotations/appearance-streams/#stamp-annotation-with-a-bitmap-image
[use-json-podspec guide]: /guides/ios/current/getting-started/using-cocoapods/#use-json-podspec
[vector stamps]: https://pspdfkit.com/blog/2017/vector-stamps/
[`linkaction`]: https://pspdfkit.com/api/ios/Classes/PSPDFConfiguration.html#/c:objc(cs)PSPDFConfiguration(py)linkAction
[`pspdfconfiguration`]: https://pspdfkit.com/api/ios/Classes/PSPDFConfiguration.html
[`pspdflinkactioninlinebrowser`]: https://pspdfkit.com/api/ios/Enums/PSPDFLinkAction.html#/c:@E@PSPDFLinkAction@PSPDFLinkActionInlineBrowser
[document editor]: https://pspdfkit.com/guides/ios/current/features/document-editor-ui/
[`sfsafariviewcontroller`]: https://developer.apple.com/documentation/safariservices/sfsafariviewcontroller
[`uitextview`]: https://developer.apple.com/documentation/uikit/uitextview
[`pspdfcolorpalette`]: https://pspdfkit.com/api/ios/Classes/PSPDFColorPalette.html
[rainbow]: https://pspdfkit.com/api/ios/Classes/PSPDFColorPalette.html#/c:objc(cs)PSPDFColorPalette(cm)rainbowColorPalette
[modern]: https://pspdfkit.com/api/ios/Classes/PSPDFColorPalette.html#/c:objc(cs)PSPDFColorPalette(cm)modernColorPalette
[vintage]: https://pspdfkit.com/api/ios/Classes/PSPDFColorPalette.html#/c:objc(cs)PSPDFColorPalette(cm)vintageColorPalette
[monochrome]: https://pspdfkit.com/api/ios/Classes/PSPDFColorPalette.html#/c:objc(cs)PSPDFColorPalette(cm)monochromeColorPalette
[`allowannotationzindexmoves`]: https://pspdfkit.com/api/ios/Classes/PSPDFConfiguration.html#/c:objc(cs)PSPDFConfiguration(py)allowAnnotationZIndexMoves
[`pspdfannotationmanager`]: https://pspdfkit.com/api/ios/Classes/PSPDFAnnotationManager.html
[`insertannotation:atzindex:options:error:`]: https://pspdfkit.com/api/ios/Classes/PSPDFAnnotationManager.html#/c:objc(cs)PSPDFAnnotationManager(im)insertAnnotation:atZIndex:options:error:
[`updateannotationsonpageatindex:error:withupdateblock:`]: https://pspdfkit.com/api/ios/Classes/PSPDFAnnotationManager.html#/c:objc(cs)PSPDFAnnotationManager(im)updateAnnotationsOnPageAtIndex:error:withUpdateBlock:
