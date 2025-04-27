---
title: "PSPDFKit 7.3 for iOS"
description: Introducing PSPDFKit 7.3 for iOS. Featuring image document support, text selection enhancements, and Digital Signature improvements.
preview_image: /images/blog/2018/pspdfkit-ios-7-3/ios-7-3-header.png
section: blog
author:
  - Matej Bukovinski
author_url:
  - https://twitter.com/bukovinski
date: 2018-01-12 09:00 UTC
tags: iOS, Development, Products
published: true
---

Today we’re introducing PSPDFKit 7.3 for iOS! This release features a new image document class, which enables you to annotate images directly using PSPDFKit. The release also makes various improvements to our text selection behavior, Instant support, and Digital Signatures. READMORE Check out our [changelog][iOS 7.3 Changelog] for a list of all the features, improvements, and changes in detail.

## Annotate Images

While it was always possible to annotate images in PSPDFKit, it previously required quite a bit of extra code. You had to convert the image to PDF, be sure to update the annotation tools and UI to show only relevant options, and extract the image data back when a save occurred. With PSPDFKit 7.3 for iOS, we are introducing a new class, [`PSPDFImageDocument`], which makes this process much simpler. All you need to do is pass your image to [`PSPDFImageDocument`], and we handle the rest. We even simplified the PDF controller configuration by providing a prebuilt configuration that adjusts the UI so that only options most relevant to image editing are displayed. Take a look at the new `AnnotateImagesExample` to learn more about how to use this feature.

![Image Document](/images/blog/2018/pspdfkit-ios-7-3/image-document.png)

## Text Selection

With PSPDFKit 7.3 for iOS, text selection learned some new tricks, making it even easier to select exactly the text you want. More specifically, you now have the ability to change the direction of text selection in a single fluid motion. Previously, it only was possible to select in the direction you started the selection gesture, and it required an additional gesture to change the selected text on the opposite end.

This behavior not only affects text selection, but also all of the text markup annotations (highlight, underline, squiggly, strikeout), enabling a more accurate annotation creation process.

<video src="/images/blog/2018/pspdfkit-ios-7-3/text-selection.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Instant

In this release, we also made a lot of progress on the development of our Instant client. Most notably, you can now use the new `documentState` property, defined on the  [`PSPDFInstantDocumentDescriptor`] class, to query for the current document sync state and subscribe to a new set of notifications to react to sync state changes. Related notifications are also posted for relevant state transitions, providing significantly better feedback about a document’s sync cycle. This makes it a breeze to check if a document is currently syncing or if it has already finished. And with the addition of the [`stopSyncing:`] API, we added support for manually canceling an ongoing sync cycle.

Please head over to our [Understanding the Document State guide][Instant Document State] to learn more about this.

We would also like to remind you that we added a dedicated Instant example to the Catalog project in the last patch release. This demonstrates how to use Instant to load documents and utilize real-time annotation synchronization.

## Digital Signatures

The Digital Signature component received a lot of attention in the form of new functionality, improving the user experience, and making it more robust in general.

There is a new [`signatureIntegrityStatus`] property on [`PSPDFSignatureStatus`], which shows if the document has been modified in a way that has broken a digital signature. PEM-encoded certificates in PKCS #7 files are now supported out of the box. We fixed an issue where read-only signed digital signatures may not be tappable. We improved the accuracy of the information about the digital signature validation process by demoting some non-critical errors to warnings. Detection of digital signatures in third-party PDF readers is better. And finally, we ensured our signing process works better with some certificate authorities that are missing fields.

Have a look at our [Digital Signature guide article][Digital Signature Guide Article] to learn more about the above. Additionally, if you haven’t checked it out yet, in PSPDFKit 7 we added support for [storing biometric data in digital signatures][Biometric Signatures Guide Article Section] in order to make them even more secure.

## API, Tweaks, and Details

Along with the changes already mentioned, a lot of smaller details were addressed, added, and fixed.

The Document Editor works even better when used in a tabbed bar controller. We now correctly detect the currently focused page, which is used to restore the page after a device rotation. Various new Catalog examples — including going to a specific outline programmatically, customizing page labels, monitoring for touch events, and showing multiple documents in a `UIPageViewController` — were added. The saving behavior has been improved when the app gets backgrounded. Language detection for text to speech has been enhanced.

To see a complete list of changes, check out the [PSPDFKit 7.3 for iOS changelog][iOS 7.3 Changelog].

[iOS 7.3 Changelog]: /changelog/ios/#7.3.0
[`PSPDFImageDocument`]: /api/ios/Classes/PSPDFImageDocument.html
[Instant Document State]: /guides/ios/current/pspdfkit-instant/instant-document-state
[`PSPDFInstantDocumentDescriptor`]: /api/ios/Protocols/PSPDFInstantDocumentDescriptor.html
[`stopSyncing:`]: /api/ios/Protocols/PSPDFInstantDocumentDescriptor.html#/c:objc(pl)PSPDFInstantDocumentDescriptor(im)stopSyncing:
[`signatureIntegrityStatus`]: /api/ios/Classes/PSPDFSignatureStatus.html#/c:objc(cs)PSPDFSignatureStatus(py)signatureIntegrityStatus
[`PSPDFSignatureStatus`]: /api/ios/Classes/PSPDFSignatureStatus.html
[`PSPDFInstantDocumentState`]: /api/ios/Enums/PSPDFInstantDocumentState.html
[Digital Signature Guide Article]: /guides/ios/current/features/digital-signatures/
[Biometric Signatures Guide Article Section]: /guides/ios/current/features/digital-signatures/#biometric-signatures
