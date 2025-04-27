---
title: "PSPDFKit 8.4 for iOS"
description: Introducing PSPDFKit 8.4 for iOS — featuring a new floating page scrubber bar, a refreshed look for the annotation inspector, rotation for text annotations, and an eraser thickness slider.
preview_image: /images/blog/2019/pspdfkit-ios-8-4/header.png
preview_video: /images/blog/2019/pspdfkit-ios-8-4/header.mp4
section: blog
author:
  - Douglas Hill
author_url:
  - https://twitter.com/qdoug
date: 2019-05-30 17:00 UTC
tags: iOS, Development, Products
published: true
---

Today we’re pleased to share that PSPDFKit 8.4 for iOS is out. This release features a new floating page scrubber bar, a refreshed look for the annotation inspector, rotation for text annotations, and an eraser thickness slider.

READMORE

## Floating Scrubber Bar

Modern iOS devices, from iPhone X to all iPads with iOS 12, use the bottom edge of the screen to return to the home screen or switch to previously used apps. However, we noticed there is sometimes some confusion between this interaction and touches intended for our scrubber bar at the bottom of the screen, which is used for quickly moving between pages in a document. This could result in the page being changed unintentionally.

We made plans to address this issue, and in doing so, we realized it was also a great opportunity to update the appearance of the scrubber bar. As a result, we added an optional floating scrubber bar which avoids the very bottom of the screen in order to prevent touch handling conflicts.

![](/images/blog/2019/pspdfkit-ios-8-4/floating-scrubber.png)

The floating scrubber bar looks especially nice on devices showing the home indicator because it removes the plain toolbar background that was previously filling the space below the home indicator and to the sides of the page thumbnails. In this way, the PDF content can extend directly to the bottom edge of the screen, resulting in a more immersive user experience.

The new floating scrubber bar is enabled by default. If you would prefer to keep the old style, you can switch back using the [`thumbnailBarMode`][] property on `PSPDFConfiguration`.

Another refinement we made is to hide the scrubber bar when the document the user is viewing only has one page. If you want to show the bar in such a case to, for example, make extra buttons visible to your users, you can use the new `hideThumbnailBarForSinglePageDocuments` property as part of `PSPDFConfiguration`.

## Refreshed Annotation Inspector

In [PSPDFKit 8.2 for iOS][], we modernized the interaction of the annotation inspector on iPhone. Today we’ve followed up on that by refreshing the inspector’s appearance. It fits in with sliding panels in other apps, which are very common on iOS these days. The elements in the panel are shown clearly as cards.

<div id="image-table">
    <table>
        <tr>
            <td>
                <img src="/images/blog/2019/pspdfkit-ios-8-4/inspector-text.png" width="80%">
            </td>
            <td>
                <img src="/images/blog/2019/pspdfkit-ios-8-4/inspector-ink.png" width="80%"">
            </td>
        </tr>
    </table>
</div>

We put in the extra effort to ensure the border of the panel can be customized using the [`UINavigationBar` appearance proxy][bar-styling], just like other bars in PSPDFKit. This means there may be no work needed to make the bar pick up on your app’s custom color scheme. If no `barTintColor` is set, then the border will use a light blur effect to fit in with modern iOS design.

## Text Annotation Rotation

[PSPDFKit 8.3 for iOS][] added the ability to rotate stamp annotations. Now we’ve expanded rotation support to include text annotations. Text rotation has been possible in [PSPDFKit for Android][] since version 4.6, so we’re pleased to offer feature parity.

<video src="/images/blog/2019/pspdfkit-ios-8-4/annotation-rotation.mp4" width="98%" playsinline loop muted data-video-autoplay="true"></video>

To enable this, you don’t need to do anything. The [`rotation`][] property already existed on `PSPDFFreeTextAnnotation`, and it was limited to multiples of 90 degrees. However, now it may be set to any number of degrees. [`PSPDFResizableView`][] will automatically show the rotation knob for these additional supported annotation types. You can disable rotation with the resizable view’s [`allowRotating`][] property.

## More Improvements

PSPDFKit supports redaction to securely and irrecoverably remove sensitive content from PDF documents. Previously, when a user chose to apply redactions to a document, the document with these changes replaced the original file. Now the user has the choice to either redact the currently open document or save the redacted document as a new file. The location for the new file can be chosen using the standard [`UIDocumentPickerViewController`][].

For a long time, PSPDFKit’s ink eraser tool has had a nearly fixed size that varied slightly based on various properties of the touch input. This can be imprecise or too coarse depending on the situation, and so to improve the tool, we’ve added a new thickness slider for setting the eraser size. It’s accessible from the inspector in the annotation toolbar.

![](/images/blog/2019/pspdfkit-ios-8-4/eraser-inspector.png)

We’ve added an API that makes it possible to use any image as a watermark when applying a [digital signature][]. The PSPDFKit logo is used by default, but it can be replaced with any graphic set as the [`signatureWatermark`][] property on `PSPDFSignatureAppearance`.

Additionally, all `enum`s are now marked with `NS_CLOSED_ENUM` in order to improve usage with Swift. This removes the requirement for handling possible unknown future cases that has been in place since Xcode 10.2, since this is only a concern for binary compatibility in system frameworks.

Finally, APIs declared in Objective-C categories across `PSPDFKitUI.framework` have been audited. Various methods have been removed because they were not implemented or called by PSPDFKit.

For all the details pertaining to PSPDFKit 8.4 for iOS, please check out our [changelog][ios 8.4 changelog].

[`thumbnailbarmode`]: /api/ios/Classes/PSPDFConfiguration.html#/c:objc(cs)PSPDFConfiguration(py)thumbnailBarMode
[pspdfkit 8.2 for ios]: https://pspdfkit.com/blog/2019/pspdfkit-ios-8-2/
[bar-styling]: /guides/ios/current/customizing-the-interface/appearance-styling/#uinavigationbar-and-uitoolbar-styling
[pspdfkit 8.3 for ios]: https://pspdfkit.com/blog/2019/pspdfkit-ios-8-3/
[pspdfkit for android]: /pdf-sdk/android/
[`rotation`]: /api/ios/Classes/PSPDFFreeTextAnnotation.html#/c:objc(cs)PSPDFFreeTextAnnotation(py)rotation
[`pspdfresizableview`]: /api/ios/Classes/PSPDFResizableView.html
[`allowrotating`]: /api/ios/Classes/PSPDFResizableView.html#/c:objc(cs)PSPDFResizableView(py)allowRotating
[`uidocumentpickerviewcontroller`]: https://developer.apple.com/documentation/uikit/uidocumentpickerviewcontroller
[digital signature]: /pdf-sdk/ios/digital-signatures/
[`signaturewatermark`]: /api/ios/Classes/PSPDFSignatureAppearance.html#/c:objc(cs)PSPDFSignatureAppearance(py)signatureWatermark
[ios 8.4 changelog]: /changelog/ios/#8.4.0
