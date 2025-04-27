---
title: "PSPDFKit 7.0 for iOS"
description: Introducing PSPDFKit 7.0 for iOS. iOS 11 support. Drag and Drop. New View Hierarchy. Biometric Signatures. Checkpoints.
preview_image: /images/blog/2017/pspdfkit-ios-7-0/v7-launch-hero.png
section: blog
author:
  - Matej Bukovinski
author_url:
  - https://twitter.com/bukovinski
date: 2017-10-04 12:00 UTC
tags: iOS, Development, Products
published: true
---

It's that time of the year again! Apple just released iOS 11 and we're following up with our major release, PSPDFKit 7.0 for iOS. Version 7 is fully optimized for Xcode 9 and iOS 11 adding SDK-wide support for Drag and Drop. We have modernized the document viewer to support even more combinations and greatly improved the signature experience. With the new checkpointing feature, we automatically create savepoints to further minimize the chances of data loss. In addition, the API has been tweaked some more for Swift, so be sure to study the [7.0 Migration Guide][Migration Guide]. Our [changelog](/changelog/ios/#7.0.0) lists all the changes in detail.

READMORE

## PSPDFKit and PSPDFKitUI

PSPDFKit now follows Apple's best practices and is split into a model framework (`PSPDFKit.framework`) and a UI framework (`PSPDFKitUI.framework`). The split improves flexibility in the case you want to ship a completely custom UI but build it on top of the stable PSPDFKit foundation. This change will require a few updates on your side, so be sure to check out the [migration guide][Migration Guide] and the updated [integration guide](/guides/ios/current/getting-started/integrating-pspdfkit/).

<img title="Frameworks" src="/images/blog/2017/pspdfkit-ios-7-0/frameworks.png">

## iOS 11 and Xcode 9

PSPDFKit 7 for iOS fully supports iOS 11 and now requires Xcode 9 for development. While we already made sure that even version 6.9 had no major issues on iOS 11, we still strongly encourage you to update to Version 7 to make sure your integrations are future proof, especially considering the changes you will be facing with the upcoming iPhone X.

To make the switch to version 7 an easier decision for you, we decided to break our usual [n-1 iOS version support strategy](/guides/ios/current/announcements/version-support/) and continue fully supporting iOS 9 until the end of 2017.

## Drag and Drop

The main new feature for any productivity application on iOS 11 is definitely going to be drag and drop. In version 7, we integrated system drag and drop APIs into our document viewer to allow you to drag out selected images and text. Pages have also become a drop target for text, images, and even other PDFs. Dropped items are converted into the most appropriate annotation types, either free text or stamp. This is just a first step, and we have many more ideas on how to add even more drag and drop features in future updates. Stay tuned.

<video src="/images/blog/2017/pspdfkit-ios-7-0/drag-and-drop.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## UI Refresh

PSPDFKit 7 for iOS offers a refreshed icon set, which better matches icons available on our other platforms, while still staying true to the signature iOS style. The new icons are now also all vector based, leveraging the improved support for asset catalogs.

<img title="UI Refresh" src="/images/blog/2017/pspdfkit-ios-7-0/ui-refresh.png">

## Biometric Signatures

While Digital Signatures have been supported for many years, many customers prefer to use a classical ink signature, as it feels more natural. However, ink signatures are easy to fake. Only with a cryptographically secure signature on most contracts can you be sure it will hold up in court. In version 7, we revamped our ink-signing workflow and made digital signatures an integral part of it, by allowing you to associate a digital signature with your existing or new ink signatures. All you need to do to support this new feature is provide the appropriate certificates to our signature store and we will handle the rest.

If you choose to add a certificate to your signature, you'll be automatically able to cryptographically sign the document as soon as the signature is inserted. While you could previously only digitally sign documents that had a pre-existing signature form element, we've removed this limitation. Automatically creating signature form elements on your behalf now allows you to digitally sign any document. Placed digital signatures will also have a new appearance, which you can fully customize.

Additionally, the new Digital Signatures will capture biometric data such as input device, speed, pressure sensitivity, and touch radius. This additional data can be used as additional evidence to verify a signature and is also cryptographically secured.

You can read more about all the details in our [Digital Signatures guide](/guides/ios/current/features/digital-signatures/).

<video src="/images/blog/2017/pspdfkit-ios-7-0/biometric-signatures.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Checkpointing

As developers, we are all striving to create perfect, crash-free applications. Unfortunately, it's practically impossible to achieve this, making all applications susceptible to crashes and data loss. Even if the application implementation itself is spotless, it won't be immune to bugs in third-party frameworks or system-level issues.

As a crash can happen at any given time, it's important to always keep user-generated content persisted. This is tricky for PDF documents, as saving usually increases the overall file size of the document, due to the incremental nature of the format. This is the reason PSPDFKit by default only saves during key events in the view controller and application lifecycle.

To reduce the risk of data loss during long PDF editing sessions, we now support the creation of automatically or manually triggered checkpoints. These checkpoints preserve the currently unsaved changes in a separate location outside of the PDF and allow that information to be restored the next time the document is opened. We have written a new [guide article](/guides/ios/current/features/document-checkpointing/) explaining everything about this great new feature.

## New View Hierarchy

In this version, we completely rewrote the key part of our Core Viewer component — the document viewer. This was by far the biggest and longest-running project for this release. The document viewer now builds on the power and flexibility of `UICollectionView` for many of its features and uses concepts such as layout objects to allow easier customization of all our page transition modes. The refactor also streamlines our view hierarchy, so the SDK no longer requires completely different handling for every page transition mode.

This brings many benefits to everyone using our [`PSPDFViewController`] for document viewing from improved double page support, improved rotation animations, better handling of scroll insets, easier customization options, to performance and memory usage improvements. This was a big internal refactor that also changed some of our public APIs, so be sure to check both our [migration guide][Migration Guide] for the essential changes and our new [view hierarchy guide](/guides/ios/current/customizing-the-interface/the-document-view-hierarchy/) for all the details.

<img title="View Hierarchy" src="/images/blog/2017/pspdfkit-ios-7-0/view-hierarchy.svg">

## Sound Annotation Player

Version 7 comes with a great new UI for sound annotations. This switches from our in-place sound annotation player, displayed directly on the annotation, to a new player, contained in a bar at the bottom of the page. If your application has a strong focus on sound annotations, then the player will work much better for your users, as it makes the sound annotation controls much more visible and accessible. If you would prefer to still use the in-place player instead, you can do so by adjusting the newly added `soundAnnotationPlayerStyle` configuration option.

<img title="Sound Annotation Player" src="/images/blog/2017/pspdfkit-ios-7-0/sound-annotation-player.png">

## Security

Security requirements evolve. PSPDFKit can write into password-protected documents and can even protect existing documents with a password using our Document Editor component. With version 7, we now make the encryption algorithm explicit and offer the more secure AES next to RC4. See `PSPDFDocumentSecurityOptions` for the details.

## Form Creation

Filling forms has long been supported in PSPDFKit. With version 7, we added programmatic support for creating, editing, and removing form fields from a document. This is necessary for when a PDF document needs to be digitally signed but doesn't contain a digital signature field or when you have an existing form but need to not only fill it programmatically but also add/remove fields based on requirements. We do not offer a full-blown UI for form editing, as we believe this is a task for desktop browsers. However, we plan to add this to our Web SDK in the future. [See our guide article to learn more about what's now possible.](/guides/ios/current/forms/form-creation/)

## API Refinements

Every major release is an important opportunity for us to do necessary bigger updates to our API in order to make it more consistent, easier to use, and above all, correct and up to date. Of course, this may mean that you need to perform some updates to your PSPDFKit integration. To make it easy, we made sure to note all breaking API changes in our [changelog](/changelog/ios/#7.0.0) and/or [migration guide][Migration Guide]. You'll notice renamed and restricted protocols and classes, updated delegate calls, and renamed class methods and properties.

This version also drops all API calls that have been deprecated so far in order to clean up our headers and implementation files. If you are still using any legacy API, you can refer to the [migration guide][Migration Guide] for appropriate migration strategies.

## Simpler Instant Integration

Apps using [PSPDFKit Instant](/instant/) previously needed to wait until a document was downloaded before creating a `PSPDFDocument` to set on a `PSPDFInstantViewController`. In version 7, the document can be set up at any time, so it’s much easier to create a smooth user experience with less code. PSPDFKit will show a progress bar while the document downloads and then the document will appear for users to start collaborating on, while Instant syncs the annotations in real time.

## All the Rest

PSPDFKit 7 for iOS is a huge update, with too many features and improvements to possibly cover in this blog post. Some of the important ones, in addition to those above, include various improvements and fixes to our data provider and file coordination implementation, new save options for [`PSPDFDocument`], various memory improvements, night mode tweaks, and optimizations for performance in various parts of the framework. Be sure to take a close look at our [changelog](/changelog/ios/#7.0.0) for the full list.

[`PSPDFDocument`]: /api/ios/Classes/PSPDFDocument.html
[`PSPDFViewController`]: /api/ios/Classes/PSPDFViewController.html
[Migration Guide]: /guides/ios/current/migration-guides/pspdfkit-70-migration-guide/
