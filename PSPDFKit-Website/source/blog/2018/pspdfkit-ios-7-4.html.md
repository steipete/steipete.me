---
title: "PSPDFKit 7.4 for iOS"
description: Introducing PSPDFKit 7.4 for iOS — featuring a new document features helper, text selection enhancements, and improved Swift interoperability.
preview_image: /images/blog/2018/pspdfkit-ios-7-4/ios-7-4-header.png
section: blog
author:
  - Matej Bukovinski
author_url:
  - https://twitter.com/bukovinski
date: 2018-03-02 12:00 UTC
tags: Development, iOS, Products
published: true
---

Today we’re releasing PSPDFKit 7.4 for iOS! This version introduces a new document features class, which combines multiple sources that affect document functionality in one central place. The release also makes various improvements to our text selection behavior and improves our support for Swift projects by both adding additional interoperability features to the SDK and introducing a new open source [Swift wrapper][PSPDFKitSwift]. READMORE Check out our [changelog][iOS 7.4 Changelog] for a list of all the features, improvements, and changes in detail.

## Document Features

PSPDFKit offers a large set of actions that can be performed on loaded PDF documents. These include features such as text selection, annotation editing, and printing. However, not all of them are always applicable or possible for a given document. The set of possible actions can, for instance, be affected by PDF permission flags, the file system write status, device capabilities, the PSPDFKit license, MDM software, etc. It can quickly become very difficult to determine whether or not certain document functionality should be presented to users. This is a problem both for us internally and for our customers.

To solve this issue, we’re introducing a new class, [`PSPDFDocumentFeatures`], which will represent a single source of truth for querying available document functionality via the new [`PSPDFDocument.features`] property. At the same time, we are also providing you with two new protocols — [`PSPDFDocumentFeaturesObserver`] and [`PSPDFDocumentFeaturesSource`] — which you can implement to either be notified of changes to document features or to customize the behavior, respectively.

PSPDFKit 7.4 for iOS provides the base infrastructure for document features and exposes a few basic feature checks. We plan on adding many more features as part of the next few releases.

## Text Selection

In PSPDFKit 7.4 for iOS, we are continuing our push toward a better and more accurate selection experience. We started in [PSPDFKit 7.3 for iOS] with various improvements to our selection view, which made text selection interactions more natural. In this version, we focused on accuracy and block detection. The text selection view will now better represent the selected text range and work much more reliably in cases where there are multiple page columns on the same page. These are changes you will definitely notice and appreciate. At the same time, we also improved the behavior of vertical and arbitrarily rotated text. This is something we’ll be focusing on even more in the future.

![Old selection](/images/blog/2018/pspdfkit-ios-7-4/selection-before.jpg)
_Previously, text selection only roughly matched the selected content._

![New selection](/images/blog/2018/pspdfkit-ios-7-4/selection-after.jpg)
_Now, text selection is much more accurate._

## Swift Interoperability

At PSPDFKit, we’re big fans of Swift and are really looking forward to the day we can start incorporating Swift into our iOS SDK. Unfortunately, this is still [a good while away][ABI]. Even so, we’re determined to provide the best possible experience for developers looking to incorporate PSPDFKit into their Swift products, by offering first-class Swift interoperability. PSPDFKit 7.4 for iOS improves on this front by adding new typedefs to express certain argument types (eg. `PSPDFPageIndex`), and by augmenting our API with `NS_TYPED_EXTENSIBLE_ENUM` / `NS_SWIFT_NAME` declarations in a few more places.

Despite already providing great Swift support, we decided to go the extra mile and make it even better. As part of PSPDFKit 7.4 for iOS, we are also introducing a new open source project that wraps the most commonly used PSPDFKit APIs, making them even more natural to use from Swift. We named the project PSPDFKitSwift. The wrapper is a drop-in addition to PSPDFKit that requires no separate configuration. It exposes a new module, [`PSPDFKitSwift`][PSPDFKitSwift], which you can import into your Swift projects to gain custom-tailored Swift APIs for PSPDFKit. Please check out the project [README][PSPDFKitSwift] file for more information on how to get started, and be sure to read our [Swift interoperability][Swifty PSPDFKit] blog post if you are curious about the technical aspects of the wrapper.

## Details

In this version, we focused a lot on performance. We identified a few places that could block the main thread for a non-trivial amount of time and implemented improvements that ensure interactions are smoother. One case where this is especially noticeable is when interacting with free text annotations. We also implemented various improvements to our file coordination support, making it both faster and more reliable when working with certain third-party file providers. We focused on UI details, fixing several glitches and improving the UX when inserting digital signatures. Finally, our example catalog gained some attention as well; we extended it with several new examples that were requested by our customers.

To see a complete list of changes, check out the [PSPDFKit 7.4 for iOS changelog][iOS 7.4 Changelog].

[iOS 7.4 Changelog]: /changelog/ios/#7.4.0
[ABI]: /blog/2018/binary-frameworks-swift/
[Swifty PSPDFKit]: /blog/2018/first-class-swift-api-for-objective-c-frameworks/
[PSPDFKitSwift]: https://github.com/PSPDFKit/PSPDFKitSwift
[`PSPDFDocumentFeatures`]: /api/ios/Classes/PSPDFDocumentFeatures.html
[`PSPDFDocumentFeaturesObserver`]: /api/ios/Protocols/PSPDFDocumentFeaturesObserver.html
[`PSPDFDocumentFeaturesSource`]: /api/ios/Protocols/PSPDFDocumentFeaturesSource.html
[PSPDFKit 7.3 for iOS]: /blog/2018/pspdfkit-ios-7-3/
[`PSPDFDocument.features`]: /api/ios/Classes/PSPDFDocument.html#/c:objc(cs)PSPDFDocument(py)features
