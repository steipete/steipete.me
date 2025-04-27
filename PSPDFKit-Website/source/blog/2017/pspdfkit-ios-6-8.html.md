---
title: "PSPDFKit 6.8 for iOS"
description: Introducing PSPDFKit 6.8 for iOS. Revamped Digital Signatures. Watermark Filtering. iOS 11. And More.
preview_image: /images/blog/2017/pspdfkit-ios-6-8/watermark-detection.png
section: blog
author:
  - Matej Bukovinski
  - Stefan Kieleithner
author_url:
  - https://twitter.com/bukovinski
  - https://twitter.com/steviki
date: 2017-06-22 14:00 UTC
tags: iOS, Products
published: true
---

Version 6.8 of PSPDFKit for iOS features a completely revamped Digital Signature implementation, watermark filtering, some iOS 11 fixes and various smaller improvements and fixes. You can, as always, read up on all the details in the [changelog](/changelog/ios/#6.8.0).

READMORE

## Digital Signatures

We are excited to tell you that with PSPDFKit 6.8 for iOS we rewrote the core of our Digital Signature implementation for improved detection, validation and better error reporting. As a result, we also managed to completely drop our dependency on OpenSSL, reducing the size of our binary in the process.

The changes will also enable additional improvements and new features related to Digital Signatures in future releases, as we now own the full stack. Other than fixing an issue or two, the rewrite should not have an effect on your implementation, as there were no related API changes in this release.

## Watermark Filtering

Many of our customers were asking about how to detect watermarks and filter them from text selection and page text extraction. We are thrilled to announce that you no longer have to worry about this. Watermarks are now detected and filtered from text selection and extraction by default. If, for any reason, you would like to keep the previous behavior, you can still do that by simply disabling [`PSPDFDocument.isWatermarkFilterEnabled`][].

<video src="/images/blog/2017/pspdfkit-ios-6-8/watermark-detection.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## iOS 11

iOS 11 has just been announced two weeks ago and we’re already busy testing it and fixing all the new issues that are popping up with the first seeds. This version 6.8 of PSPDFKit for iOS already includes a few fixes for better forward compatibility. It’s still too early in the iOS beta phase to guarantee that everything will work flawlessly, but we’re hard at work to make sure everything is smooth — just keep the SDK up to date.

## Details

Like always, this release includes more polish and minor improvements.

Starting with version 6.8, the disclosure button in [`PSPDFOutlineViewController`][], used to expand and collapse elements, can be conveniently tinted via `UIAppearance`.

[==

```swift
let disclosureButton = UIButton.appearance(whenContainedInInstancesOf: [PSPDFOutlineCell.self])
disclosureButton.tintColor = .red
```

```objc
UIButton *disclosureButton = [UIButton appearanceWhenContainedInInstancesOfClasses:@[PSPDFOutlineCell.class]];
disclosureButton.tintColor = UIColor.redColor;
```

==]

We also also improved support for our style manager color presets. The annotation style view controller can now show color presets even without other color selection options, making it easy for you to limit color selection to just a few predefined colors. In addition we also extended the style manager API to make it easier for you to customize the shown presets. To learn more about color preset customization check out `PresetCustomizationExample.swift` in our example catalogue.

<img title="Color Presets UI" width="70%" src="/images/blog/2017/pspdfkit-ios-6-8/color-presets.png">

The privacy access denied UI now displays the app name and provides a link to the application’s Privacy Settings located in the Settings app.

<img title="Privacy Access Denied UI" width="70%" src="/images/blog/2017/pspdfkit-ios-6-8/privacy-access-denied-ui.png">

## Previous Releases

We also introduced a few new features worth mentioning in previous patch releases.

[`PSPDFLibrary`][] is now capable of indexing individual annotations in a document, in addition to page content. This is enabled by default and can be disabled via [`PSPDFLibrary.shouldIndexAnnotations`][], if needed.

It’s now possible to mirror a document on an external screen, rendered in native resolution, syncing the view state, appearance mode and video playback. This can be enabled by setting `PSPDFKit.sharedInstance.screenController.pdfControllerToMirror = pdfController`. You can check out [`PSPDFScreenController`][] for some more details and customization options.

<img title="Screen Mirroring" width="100%" src="/images/blog/2017/pspdfkit-ios-6-8/screen-mirroring.png">

This is just a small overview of the improvements and fixes we did in this version. Check out the [PSPDFKit for iOS changelog](https://pspdfkit.com/changelog/ios/#6.8.0) for the full story.

## PSPDFKit 1.1 for macOS

As of June 26th, we've also released PSPDFKit 1.1 for macOS, bringing it up-to
date with the iOS version at the model-layer level. This includes improvements
to Digital Signatures, Watermark Filtering, bug fixes, and more. See
[changelog](https://pspdfkit.com/changelog/macos/) for a detailed breakdown of
all changes.

[`PSPDFDocument.isWatermarkFilterEnabled`]: /api/ios/Classes/PSPDFDocument.html#/c:objc(cs)PSPDFDocument(py)watermarkFilterEnabled
[`PSPDFOutlineViewController`]: /api/ios/Classes/PSPDFOutlineViewController.html
[`PSPDFScreenController`]: /api/ios/Classes/PSPDFScreenController.html
[`PSPDFLibrary`]: /api/ios/Classes/PSPDFLibrary.html
[`PSPDFLibrary.shouldIndexAnnotations`]: /api/ios/Classes/PSPDFLibrary.html#/c:objc(cs)PSPDFLibrary(py)shouldIndexAnnotations
