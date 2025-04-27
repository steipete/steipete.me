---
title: "PSPDFKit 2.4 for Windows"
description: PSPDFKit for the Universal Windows Platform
preview_image: /images/blog/2019/pspdfkit-windows-2-4/header.png
preview_video: /images/blog/2019/pspdfkit-windows-2-4/release.mp4
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2019-10-17 12:00 UTC
tags: Windows, Products, Development
published: true
---

Today we’re shipping PSPDFKit 2.4 for Windows. This release features support for touch gestures such as pinch to zoom. We also added support for embedded PDF JavaScript!

READMORE

## Pinch To Zoom

![pinch-to-zoom](/images/blog/2019/pspdfkit-windows-2-4/pinch-to-zoom.png)

On touch devices you can now use gestures such as pinching to zoom in and out of the document, when Page Transition mode is set to Jump (know as `per-spread` in code).

<video src="/images/blog/2019/pspdfkit-windows-2-4/pinch-to-zoom.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

You can also tap left and right of the page to move forward and backward through the document. This can be particularly useful on small form factor tablets. Double tapping now zooms in and out of the page in both Continuous and Jump Page Transition modes.

## JavaScript Support

![javascript-support](/images/blog/2019/pspdfkit-windows-2-4/javascript-support.png)

Some interactive PDF forms use embedded JavaScript to add custom validation rules, calculations, or other interactive functionality. We’re excited to bring support for these JavaScript features to PSPDFKit for Windows.

## Additional New Features

Also included in this release are the following new features and improvements:

- A [Catalog][catalog] example demonstrating how to implement an AES encrypted `DataProvider`.
- A new parameter to [`Ink.SetBoundingBoxAndResizeLines`][ratio] allows you fit an ink annotation, for example an ink signature, into a bounding box while maintaining the aspect ratio.
- [`BitmapPixelFormat` and `BitmapAlphaMode`][render-options] can now be specified when rendering to bitmaps.
- Experimental Hololens support

## Final Notes

This release also includes a number of bug fixes and some minor improvements. For a complete list of changes, see the [changelog][changelog].

[catalog]: /api/windows/Catalog/Catalog.html
[ratio]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Annotation.Ink.html#PSPDFKit_Pdf_Annotation_Ink_SetBoundingBoxAndResizeLines_Windows_Foundation_Rect_
[render-options]: /api/windows/PSPDFKit/PSPDFKit.RenderOptions.html
[changelog]: /changelog/windows/#2.4.0
[pspdfkit-windows-sdk]: /pdf-sdk/windows/
[pspdfkit trial]: https://pspdfkit.com/try/
[sales team]: https://pspdfkit.com/sales/
