---
title: "PSPDFKit 1.3 for Windows"
description: "Introducing PSPDFKit 1.3 for Windows — featuring customizable toolbars, ink signatures and various other improvements and API additions."
preview_image: /images/blog/2018/pspdfkit-windows-1-3/windows-1-3-header.png
preview_video: /images/blog/2018/pspdfkit-windows-1-3/windows-release-1-3.mp4
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2018-05-30 20:00 UTC
tags: Windows, Products, Features
published: true
secret: false
---

Today we’re shipping PSPDFKit 1.3 for Windows. The highlights of this release are the addition of the customizable toolbar and ink signatures features, major optimizations for file and memory handling, and utility methods for [Instant JSON][] coordinate conversion. READMORE This blog post is just a preview of the biggest changes in PSPDFKit 1.3 for Windows. Please refer to our [PSPDFKit 1.3 for Windows changelog][] for a complete list.

## Customizable Toolbar

![Customizable Toolbar](/images/blog/2018/pspdfkit-windows-1-3/windows-custom-toolbar.png)

PSPDFKit for Windows comes with a customizable main toolbar that by default includes a number of predefined items. Thanks to a minimalistic and simple API, it’s possible to remove, rearrange, and add custom items and events on the toolbar. Learn more about this in our [corresponding guide article][].

## Ink Signatures

People are often required to sign digital documents like PDFs, so today we’re introducing ink annotation signature support for Windows.

![Ink Signatures](/images/blog/2018/pspdfkit-windows-1-3/windows-ink-signatures.png)

Signatures can be created with our responsive-, touch-, and mouse-friendly UI and can even be stored for reuse.

## Optimizations and Utilities

We overhauled our file handling and memory usage when loading documents. This further reduces the memory footprint for larger documents and shortens load times.

For converting between [Instant JSON][] and PDF coordinates, we now provide the methods [InstantToPdfCoords][] and [PdfToInstantCoords][].

For a complete list of changes for this release, read our [PSPDFKit 1.3 for Windows changelog][]. The PSPDFKit for Windows UI is powered by PSPDFKit for Web. You can read more details about [PSPDFKit for Web 2018.3 here][].

[pspdfkit 1.3 for windows changelog]: https://pspdfkit.com/changelog/windows/#1.3.0
[pspdfkit for web 2018.3 here]: https://pspdfkit.com/blog/2018/pspdfkit-web-2018-3/
[instant json]: https://pspdfkit.com/blog/2017/instant-json/
[instanttopdfcoords]: https://pspdfkit.com/api/windows/PSPDFKit/PSPDFKit.Pdf.html
[pdftoinstantcoords]: https://pspdfkit.com/api/windows/PSPDFKit/PSPDFKit.Pdf.html
[corresponding guide article]: https://pspdfkit.com/guides/windows/current/features/customizing-the-toolbar/
