---
title: "Image Documents — Annotate PNG and JPG Just like PDF"
description: "With the new Image Document component, image files can be displayed and annotated with PSPDFKit, just like PDF files."
preview_image: /images/blog/2018/image-documents/header.png
preview_video: /images/blog/2018/image-documents/image-documents.mp4
section: blog
author:
  - Peter Steinberger
author_url:
  - https://twitter.com/steipete
date: 2018-05-31 13:00 UTC
tags: Products, iOS, Android
cta: ios
published: true
---

With the new Image Documents component, we’re expanding our supported file formats from just PDF to include PNG and JPG. This feature is fully supported in [PSPDFKit 7.6 for iOS][iOS changelog], [PSPDFKit 2.6 for macOS][macOS changelog], and [PSPDFKit 4.6 for Android][Android changelog] — our other platforms (Web, Windows) will follow.

READMORE

## Non-Destructive Image Annotations

Annotating images is not hard. Many of our customers have logic that converts images to PDF and then simply displays those converted files with PSPDFKit to make notes and highlights. The challenge is making it non-destructive. With our new component, you can load a regular JPG or PNG file, add annotations, and save everything into the image. We use the image itself as a container format to store the metadata required to keep annotations editable.

The resulting file itself is fully compatible with other viewers, and when you open it in any app that uses PSPDFKit’s new Image Documents component, the annotations are again editable. And since the metadata increases the image file size, we offer full control over whether it should be included or whether the file should be saved as a regular image, the latter of which no longer allows further edits to the annotations added.

We also use a highly optimized format to translate between the image and PDF, so even high-resolution images are supported.

## Simplify Your App Logic

Many our customers use the PSPDFKit SDK as the primary way of displaying documents. With the new Image Documents component, the same logic can now also be used to display and annotate images. This improves usability, as the end user has a familiar interface, and it reduces development time because there’s less code to write — PSPDFKit now handles even more for you.

We will keep expanding on supported image formats and are also exploring how we can bring Office support to our SDK.

## Open File Format

We built Image Documents on the open [ISO 16684-1:2012](https://www.iso.org/standard/57421.html) extensible metadata platform ([XMP][]) specification. With XMP, the image itself becomes the container for the metadata. We include a copy of the image to allow non-destructive editing and a PDF to store the annotations inside the image.

While we support more efficient data formats, such as our [Instant JSON][] format for storing annotations, we decided it’s also important to keep things simple in the hopes that other vendors will also support this file format extension. You find the full documentation about the [image document file format][] in our guides.

On the platforms, we added new subclasses (`PSPDFImageDocument` for iOS/macOS, and `ImageDocument` for Android) to allow fine-grained control over the image conversion, storage, and rendering. You can read more about these details in our [Image Documents guides for iOS][iOS guide] [and Android][Android guide].

[iOS changelog]: /changelog/ios/#7.6.0
[macOS changelog]: /changelog/macos/#2.6.0
[Android changelog]: /changelog/android/#4.6.0
[iOS guide]: /guides/ios/current/annotations/annotate-images/
[Android guide]: /guides/android/current/annotations/annotate-images/
[XMP]: https://www.adobe.com/products/xmp.html
[XMP ISO 16684-1:2012]: https://www.iso.org/standard/57421.html
[Instant JSON]: /guides/ios/current/importing-exporting/instant-json/
[image document file format]: /guides/ios/current/features/image-document-standard/
