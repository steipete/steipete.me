---
title: "PSPDFKit 2.0 for macOS"
preview_image: /images/blog/2017/pspdfkit-for-macos/macos-v2-launch-hero.png
section: blog
author:
  - Peter Steinberger
  - Rad Azzouz
author_url:
  - https://twitter.com/steipete
  - https://twitter.com/radazzouz
date: 2017-10-06 12:00 UTC
tags: macOS, New Release, Products
published: true
---

We're proud to announce version 2.0 of our macOS SDK. With Apple's release of High Sierra, we've been working hard for months to bring over improvements and fixes from our shared codebase with iOS back to the Mac. The release includes many new features and an extensive API cleanup. We also refreshed all of the samples and updated them to Swift 4. Be sure to study the [Migration Guide][Migration Guide] for the full list.

READMORE

With the [separation of PSPDFKit and PSPDFKitUI](/blog/2017/pspdfkit-ios-7-0/) in PSPDFKit 7 for iOS, we were able to focus exclusively on what's available on macOS. The new `PSPDFKit.framework` is now almost at feature parity with iOS. Although currently, the Mac has no clear equivalent for `PSPDFKitUI.framework`, we're playing with a few ideas on how we can bring UI support to the Mac in the future.

## Biometric Signatures

PSPDFKit 2.0 for macOS exposes the new [`PSPDFSignatureBiometricProperties`](https://pspdfkit.com/api/macos/Classes/PSPDFSignatureBiometricProperties.html) class that allows storing biometric user data for Digital Signatures. The new [`PSPDFSignatureAppearance`](https://pspdfkit.com/api/macos/Classes/PSPDFSignatureAppearance.html) allows a more fine-grained control of how the signature appearance stream is generated. You can read all about the details in our [Digital Signatures guide article](https://pspdfkit.com/guides/ios/current/features/digital-signatures/).

## Appearance Stream API

With the new [`appearanceStreamGenerator`](https://pspdfkit.com/api/macos/Classes/PSPDFAnnotation.html#/c:objc(cs)PSPDFAnnotation(py)appearanceStreamGenerator) API on [`PSPDFAnnotation`](https://pspdfkit.com/api/macos/Classes/PSPDFAnnotation.html), we allow defining custom appearances for any PDF annotation type. To give just two examples, this API will allow custom vector-based stamps or ink annotations to have a custom appearance. The new API is extremely flexible. Imagine an appearance stream as a PDF, inside a PDF. We automatically take care of the necessary conversion for you.

## Form Creation

While programmatic form filling has been supported since version 1, creating new form elements previously was not possible. With PSPDFKit 2.0 for macOS, we added programmatic support for creating, editing, and removing form fields from a document. This is necessary for when a PDF document needs to be digitally signed but doesn't contain a digital signature field or when you have an existing form and need to not only fill it programmatically but also add/remove fields based on requirements. [See our guide article to learn more about the new capabilities.](https://pspdfkit.com/guides/ios/current/forms/form-creation/)

## Core Spotlight

With High Sierra, we were able to bring [Spotlight indexing](/guides/ios/current/features/indexed-full-text-search/#spotlight-indexing) to the Mac, as Apple added the new low-level `CoreSpotlight.framework` that was previously only available on iOS. We've enabled the same API that you already know and love from iOS so your documents can be indexed system-wide.

## PDFXKit

[PDFXKit is a drop-in replacement for Apple's PDFKit](/blog/2017/introducing-pdfxkit/) that uses our industry-proven PSPDFKit SDK under the hood. While this project currently only supports iOS, we're working on bringing the model-parts to the Mac as well.

With version 2, we extending our commitment to support the Mac. Be sure to take a look at our [changelog](/changelog/macos/#2.0.0) for the full list of changes and improvements of version 2.

[Migration Guide]: https://pspdfkit.com/guides/macos/current/migration-guides/pspdfkit-20-migration-guide/
