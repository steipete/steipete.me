---
title: "PSPDFKit 1.5 for Windows"
description: PSPDFKit for the Universal Windows Platform
preview_image: /images/blog/2018/pspdfkit-windows-1-5/windows-1-5-header.png
preview_video: /images/blog/2018/pspdfkit-windows-1-5/windows-1-5-release.mp4
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2018-07-17 14:00 UTC
tags: Windows, Products, Development
published: true
---

Today we’re shipping PSPDFKit 1.5 for Windows. This release features the addition of shape annotations, support for password-protected PDFs, annotation flattening, and printing without viewing. READMORE This blog post is just a preview of the biggest changes in PSPDFKit 1.5 for Windows. Please refer to our [PSPDFKit 1.5 for Windows changelog][changelog] for a complete list.

READMORE

## Shape Annotations

![](/images/blog/2018/pspdfkit-windows-1-5/shape-annotations.png)

With our new shape annotations, you can now draw lines, rectangles, polygons, circles, and polylines. Just like in our Web, Android, and iOS SDKs, you can change the [dash types][] and even the start and ending of a line annotation in order to draw arrows.

<video src="/images/blog/2018/pspdfkit-windows-1-5/shape.mp4" muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Password-Protected PDFs

![](/images/blog/2018/pspdfkit-windows-1-5/password-protected.png)

With support for password-protected PDFs, you can rely on the `PdfView` handling all UI interaction to request the password from the user. Alternatively, you can hook up your own UI or service to provide the password to open the PDF.

<video src="/images/blog/2018/pspdfkit-windows-1-5/password.mp4" muted playsinline data-controller="video" data-video-autoplay="true"></video>

When set, PSPDFKit for Windows will try to unlock a PDF with the provided password when loading it. PDFs that do not require a password will continue to work as normal.

When the password is incorrect or not set in the `DocumentSource` object, then PSPDFKit for Windows displays a dialog prompting the user to input the password to unlock the document.

![](/images/blog/2018/pspdfkit-windows-1-5/password-protected-2.png)

Alternatively, you can display your own UI or retrieve a password for another source by setting a callback. This will be invoked by the SDK whenever a password is required to open a PDF.

## Toolbar

With the addition of more and more possibilities to change the style of annotations, we adapted our annotation toolbar to let you choose separately between a foreground and background color instead of using predefined color sets.

<video src="/images/blog/2018/pspdfkit-windows-1-5/toolbar.mp4" muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Printing without Viewing

It’s now possible to print a PDF without first having to show it in the `PdfView`. This is especially handy for those occasions when you don’t want to display the PDF in order to initiate printing.

## Export Flattened PDFs

Methods have been added for exporting PDFs with annotations flattened.

## Code Examples and Guides

The Catalog app now contains more examples, including how to export a PDF and how to [suspend unloading][suspend] of the `PdfView`. Suspending unloading is useful when you need to save the current state of the PDF before unloading a page.

We’ve also improved our [getting started][] guide to help you quickly build your first app using PSPDFKit for Windows.

## And Finally

In addition to all these new features, this release also includes several fixes and minor enhancements and upgrades to [PSPDFKit for Web 2018.4][web].

[windows website]: /windows
[changelog]: /changelog/windows/#1.5.0
[dash types]: /blog/2018/line-annotations/#how-to-customize-your-line-annotation-c72550
[end caps]: /blog/2018/line-annotations/#start-and-end-style-and-color-2e458b
[getting started]: /guides/windows/current/getting-started/integrating-pspdfkit/
[suspend]: /guides/windows/current/features/suspend-unloading/
[web]: /changelog/web/
