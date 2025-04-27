---
title: "PSPDFKit 8.1 for iOS"
description: Introducing PSPDFKit 8.1 for iOS — featuring free-form redaction, file conflict detection, and Apple Pencil gestures.
preview_image: /images/blog/2018/pspdfkit-ios-8-1/ios-8-1-header.png
preview_video: /images/blog/2018/pspdfkit-ios-8-1/ios-8-1-header.mp4
section: blog
author:
  - Matej Bukovinski
author_url:
  - https://twitter.com/bukovinski
date: 2018-12-06 08:00 UTC
tags: iOS, Development, Products
published: true
---

Today we’re excited to introduce PSPDFKit 8.1 for iOS. This release includes various new features, improvements, and some smaller fixes.

READMORE

With this release, we’re extending our Redaction component, which was introduced in [PSPDFKit 8 for iOS][ios 8 blog post], with support for additional PDF elements besides text. To make working with remote content more convenient and secure, we added a new file conflict detection mechanism. This alerts your users if a currently open document was modified in the background, and it offers conflict resolution options. This release also improves upon our existing Apple Pencil support by adopting new Apple Pencil gestures. For all changes, check out the [changelog][ios 8.1 changelog].

## Free-Form Redaction

In version 8, we introduced the all-new [Redaction][redaction landing page] component, which enables secure and irreversible removal of text from PDF documents. With 8.1, we’re extending this tool’s functionality with support for content other than text — this includes images, paths/vector drawings, annotations, and form fields. Images and paths on a document page that are beneath a redaction annotation will only be redacted in the area that intersects with the redaction annotation, leaving the non-intersecting part of the content intact. Annotations and form fields will be completely removed if they intersect with a redaction annotation at any point.

To achieve this, we expanded the redaction annotation creation tool to be able to create rectangular shapes anywhere on the page. These mark-up behaviors are combined into the single, already existing, redaction annotation tool. Depending on where you start the selection gesture, the tool automatically decides if a rectangular area or text should be marked for redaction since it contains all functionality in a single tool.

<video src="/images/blog/2018/pspdfkit-ios-8-1/free-form-redaction.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## File Conflict Detection and Resolution

PSPDFKit for iOS has been adopting iOS file presentation APIs to monitor for out-of-application file modifications and react to those changes for a while already. To date, when the framework detected a file change, it automatically reloaded the file, and when the file was removed, it was automatically closed. While this behavior works in most cases, it also has the drawback of potentially losing any unsaved local data — like new or updated annotations — when reloading. To avoid this scenario, PSPDFKit now creates a lightweight, APFS-powered copy of the document before displaying it. This copy is not accessible to other applications and processes and thus cannot be modified. This enables us to alert users once a change to their opened document occurs and allow them to pick which version of the file — the modified version on disk, or the copy currently being edited in PSPDFKit — to keep.

| | |
| - | - |
| ![Conflict Resolution](/images/blog/2018/pspdfkit-ios-8-1/conflict-resolution-1.png) | ![Deleted File](/images/blog/2018/pspdfkit-ios-8-1/conflict-resolution-2.png) |

## Apple Pencil Interactions

PSPDFKit for iOS already added support for the new iPad Pro models in a recent patch update. With this release, we’re following up by also adopting the new double-tap interactions for the updated Apple Pencil. It’s now possible to perform a double-tap on the Apple Pencil and let PSPDFKit handle the action. All the default Apple Pencil actions are supported out of the box and will be handled appropriately. PSPDFKit honors the user-selectable Apple Pencil action in the Settings app. This makes it possible to switch between the previously used and the current annotation tool, switch between the current annotation tool and the eraser, or show the annotation inspector. As a result, annotating documents with the Apple Pencil is now easier than ever before.

## Stamp Annotation Improvements

We overhauled our support for stamp annotations by improving compatibility with third-party readers and unifying stamp handling across all our supported platforms. The distinction between standard stamps and custom text stamps when using them programmatically has been clarified and streamlined. Additionally, this fixed some glaring issues, like stamps getting blank in third-party editors when being resized.

If you previously used a [`PSPDFStampAnnotation`][]’s `subject`, consider whether you want a standard or custom text stamp. For standard stamps, set the new [`stampType`][] property instead. This property should usually be set to a value that is one of the options defined by the new [`PSPDFStampType`][] enum. PSPDFKit will provide the localized title for standard stamps automatically based on the stamp type that is used. When using custom text stamps, you can set the [`title`][], which has replaced the `localizedSubject` property. Set the [`title`][] instead of [`stampType`][] for custom text stamps where you provide a title that has already been localized or user-generated. To add text at the bottom of a stamp, use the new [`subtitle`][] property, which has replaced `subtext`.

## Additional Details

This release also contains further customization settings for the document info controllers, an option to share multiple pages as images (as well as other sharing-related improvements), Magic Ink support in Instant, improved screen mirroring features, and much more. We’ve also been continuing our effort from previous patch releases to improve framework stability and included several new fixes. To see a complete list of changes, check out the [PSPDFKit 8.1 for iOS changelog][ios 8.1 changelog].

[ios 8 blog post]: /blog/2018/pspdfkit-ios-8-0
[ios 8.1 changelog]: /changelog/ios/#8.1.0
[redaction guide]: /guides/ios/current/features/redaction/
[redaction landing page]: /pdf-sdk/redaction/
[`PSPDFStampAnnotation`]: https://pspdfkit.com/api/ios/Classes/PSPDFStampAnnotation.html
[`stampType`]: https://pspdfkit.com/api/ios/Classes/PSPDFStampAnnotation.html#/c:objc(cs)PSPDFStampAnnotation(py)stampType
[`PSPDFStampType`]: https://pspdfkit.com/api/ios/Other%20Type%20Definitions.html#/c:PSPDFStampAnnotation.h@T@PSPDFStampType
[`subtitle`]: https://pspdfkit.com/api/ios/Classes/PSPDFStampAnnotation.html#/c:objc(cs)PSPDFStampAnnotation(py)subtitle
[`title`]: https://pspdfkit.com/api/ios/Classes/PSPDFStampAnnotation.html#/c:objc(cs)PSPDFStampAnnotation(py)title
