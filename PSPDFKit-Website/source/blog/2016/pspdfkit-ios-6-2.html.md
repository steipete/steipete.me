---
title: "PSPDFKit 6.2 for iOS"
description: Announcing PSPDFKit 6.2 for iOS. Lock Annotations. Document Sharing. Customizations. Performance Improvements.
section: blog

author:
  - Peter Steinberger
  - Matej Bukovinski
author_url:
  - https://twitter.com/steipete
  - https://twitter.com/bukovinski
date: 2016-11-29 12:00 UTC
tags: iOS, Development, Products
published: true
---

Announcing PSPDFKit 6.2 for iOS. This release includes various new customization options, performance and rendering improvements, and many, many details. Take a look at our [changelog](/changelog/ios/#6.2.0) to read up on all the details.

READMORE

## Night Mode Annotations

Annotations are now color-corrected and rendered accurately when created or edited while using the night mode appearance. We're still working on that and plan to automatically tint more UI elements such as the inspector in subsequent updates.

![Night Mode Annotations](/images/blog/2016/pspdfkit-6-2/night-mode-annotations.gif)

## Document Sharing

Improved document sharing allows you to share multiple files at once. [`PSPDFDocumentSharingViewController`][] now takes an array of documents instead of just one. You can try this feature in the upcoming version 1.2 of [PDF Viewer](https://pdfviewer.io).

![Document Sharing](/images/blog/2016/pspdfkit-6-2/document-sharing.gif)

## Locked Annotations

You can now lock annotations to prevent interaction or modification from the user. This behavior can be enabled per annotation by setting the `PSPDFAnnotationFlagLocked` or the `PSPDFAnnotationFlagReadOnly` flag on the corresponding [`PSPDFAnnotation`][] instance. This is mostly interesting for documents where annotations are already locked and we'll now automatically honor these settings.

## Customization

We added new options to customize the appearance of [`PSPDFSearchViewController`][].
Additionally, you can now customize the close button on the tabbed bar view controller. It can be set to always show the close button on all tabs, or in all tabs only in regular width size classes. The default behavior has not changed.

## Rendering

Images are now decoded using custom assembly and NEON intrinsics on arm/arm64. This can speed up image decoding up to a factor of 3x. This change is done deep in our core and no changes on your side are required to benefit from the faster rendering. Just keep our SDK up to date and you're all set.

[`PSPDFAnnotation`]: https://pspdfkit.com/api/ios/Classes/PSPDFAnnotation.html
[`PSPDFDocumentSharingViewController`]: https://pspdfkit.com/api/ios/Classes/PSPDFDocumentSharingViewController.html
[`PSPDFSearchViewController`]: https://pspdfkit.com/api/ios/Classes/PSPDFSearchViewController.html
