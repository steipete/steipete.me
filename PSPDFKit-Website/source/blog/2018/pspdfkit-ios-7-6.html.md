---
title: "PSPDFKit 7.6 for iOS"
description: Introducing PSPDFKit 7.6 for iOS — featuring non-destructive image documents, page templates, and stamp UI improvements.
preview_image: /images/blog/2018/pspdfkit-ios-7-6/ios-7-6-header.png
preview_video: /images/blog/2018/pspdfkit-ios-7-6/ios-7-6-header.mp4
section: blog
author:
  - Matej Bukovinski
author_url:
  - https://twitter.com/bukovinski
date: 2018-05-31 12:05 UTC
tags: Development, iOS, Products
published: true
secret: false

---

Just in time for Apple’s WWDC, we’re introducing the biggest update of PSPDFKit 7 for iOS thus far. Version 7.6 features an innovative new component, [Image Documents](/blog/2018/image-documents/), which enables non-destructive image annotations — just like with PDF. This release also allows custom page templates and features various UI improvements for stamps and saved annotations. A new blend mode option makes highlighted text easier to read, embedded files can now be added, and we have a brand-new document-merging UI. We’ve collected a really long list of improvements, so you can read up on all the details in the [changelog](/changelog/ios/#7.6.0).  

READMORE

## Image Documents

Annotating images was first introduced in [PSPDFKit 7.3 for iOS]. The new helpers made it really easy to import images into PSPDFKit, annotate those images, and save the resulting annotated state back into the source image files. However, this workflow had one major downside: as soon as the annotations were saved into the image, they were persisted and could no longer be modified. The image was irrevocably altered.

With PSPDFKit 7.6 for iOS, we’re expanding beyond image annotations that permanently alter the image with a new component, Image Documents, which allows non-destructive image editing. Just like before, you can share a PNG or JPG with your annotations, and when you open it inside PSPDFKit, these annotations can be edited or deleted, all the while preserving the original image. The challenge here was to find a way to store this metadata in the images directly while preserving compatibility with other image viewers. [Learn how you can annotate PNG and JPG just like PDF with Image Documents](/blog/2018/image-documents/).

<a href="/blog/2018/image-documents/">
<video src="/images/blog/2018/pspdfkit-ios-7-6/ios-image-documents.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>
</a>

## Instant Layers

<a href="/blog/2018/instant-layers/">
<video src="/images/blog/2018/instant-layers/instant-layers.mp4" width="100%" playsinline loop muted data-controller="video" data-video-autoplay="true"></video></a>

[Instant](/instant) is an on-premises server that shares documents and annotations between multiple users and devices. This release adds support for Instant Layer, a container for annotations on a specific PDF document. Every user can have one or multiple layers to share annotations. This is particularly useful for implementing review workflows where several parties are invited to provide feedback on a document, independent of one another. [Learn how to take advantage of Instant Layers.](/blog/2018/instant-layers/)

## Page Templates

The PSPDFKit Document Editor has always supported a set of pattern-based PDF page templates that can be used when creating new pages. In PSPDFKit 7.6 for iOS, we’re taking this feature to a whole new level. We now allow you to provide your own custom page templates that can either be a repeating pattern or full PDF pages.

In order to achieve this, we deprecated the use of strings as pattern identifiers and added a new class, [`PSPDFPageTemplate`], to hold all template data. When using a custom template, you can make it available from the template picker by instantiating a [`PSPDFNewPageViewController`] with an appropriate editor configuration.

To learn more about this feature, check out our new Add New Page from Custom Template example in the Catalog app. We’ve also put together a [migration guide][PSPDFKit 7.6 Migration Guide] that outlines all relevant API changes.

<video src="/images/blog/2018/pspdfkit-ios-7-6/templates.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Blend Mode

[Blend modes](https://en.wikipedia.org/wiki/Blend_modes) define how two layers are blended into each other. In PSPDFKit for iOS, the default blend mode simply overlays colors. So for example, when using the yellow ink highlighter, black text becomes a yellowish brown.

In the new version, the freehand highlighter tool now uses multiply as the blend mode, just like highlight annotations do. This greatly improves text legibility — black text stays black. Under the hood, the new `blendMode` API is supported for almost all annotation types, giving you programmatic access to a wide variety of different blend modes. For ink annotations, the blend mode is also exposed directly on our annotation inspector user interface.

<video src="/images/blog/2018/pspdfkit-ios-7-6/ios-blend-modes.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Stamp Annotations

Many of you might not have even been aware that PSPDFKit ships with a saved annotations UI, which can be used to store frequently used custom annotations and apply them across documents. The feature, which previously hid in plain sight inside the stamp annotation UI, is now accessible via a separate annotation toolbar item, which makes it much easier to discover and access.

The stamp annotation picker user interface itself also got many small improvements. Those include an improved stamp list layout, a more obvious custom stamp button and many other small improvements and fixes. The improvements also extend to stamp rendering itself. Most notably, stamps now keep their aspect ratio even during resizing.

![Stamp Annotations](/images/blog/2018/pspdfkit-ios-7-6/stamp-annotations.png)

## Document Merging UI

The Document Editor is now more powerful than ever, with a new built-in user interface for merging two documents together. This user interface is disabled by default, but it can easily be enabled by flipping the `allowExternalFileSource` property on a custom `PSPDFDocumentEditorConfiguration`, which can now be customized via the base `PSPDFConfiguration` object. Once configured, the Document Editor will show a new "Select Source Document" option to the new page dialog, which in turn presents the default iOS document picker when selected.

Please note that on iOS 10, your application will require iCloud entitlements to be set in order to use this option.

<video src="/images/blog/2018/pspdfkit-ios-7-6/document-merging.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Embedded Files

For years, PSPDFKit for iOS has included support for reading file annotations. With this release, we added the ability to create embedded files via a new initializer on `PSPDFEmbeddedFile`. This enables you to associate your own files with new or existing file annotations. See `AddFileAnnotationProgrammaticallyExample` in PSPDFCatalog to see this in action. Learn more in our blog post: [How to Embed Files Using File Annotations](/blog/2018/how-to-embed-files-using-file-annotations/)

## JavaScript Support

We’ve completely redesigned our JavaScript handling for form validation and document actions. This will improve compatibility with the vast majority of documents out there and also allow us to share the underlying engine with our other platforms like Android, Web, and Windows. Take a look at a [list of supported features](/guides/ios/current/features/javascript/) in our guides and please report any documents that don’t yet work.

## Details

Along with the changes already mentioned, we also made many other smaller additions, improvements, and fixes. This release includes several under the hood fixes that make text extraction and selection more robust and accurate. Performance is even better, as we now cancel rendering on pages that have been scrolled over too fast. To see a complete list of changes, check out the [PSPDFKit 7.6 for iOS changelog][iOS 7.6 Changelog].

[iOS 7.6 Changelog]: /changelog/ios/#7.6.0
[PSPDFKit 7.3 for iOS]: /blog/2018/pspdfkit-ios-7-3/
[Annotate Images Guide]: /guides/ios/current/annotations/annotate-images
[PSPDFKit 7.6 Migration Guide]: /guides/ios/current/migration-guides/pspdfkit-76-migration-guide
[`PSPDFPageTemplate`]: /api/ios/Classes/PSPDFPageTemplate.html
[`PSPDFNewPageViewController`]: /api/ios/Classes/PSPDFNewPageViewController.html
