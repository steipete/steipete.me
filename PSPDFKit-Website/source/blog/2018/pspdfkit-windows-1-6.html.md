---
title: "PSPDFKit 1.6 for Windows"
description: PSPDFKit for the Universal Windows Platform
preview_image: /images/blog/2018/pspdfkit-windows-1-6/header.png
preview_video: /images/blog/2018/pspdfkit-windows-1-6/features.mp4
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2018-09-06 14:00 UTC
tags: Windows, Products, Development
published: true
---

Today we’re shipping PSPDFKit 1.6 for Windows. This release features the addition of image annotations to place arbitrary images on a PDF page, two new sidebar modes — one to show the table of contents (document outlines) of a PDF and one that lists all annotations, a new option to create annotation variants with the ink highlighter and arrow tools enabled by default, and a lot more!. Additionally, we’re adding full localization support, with translations for 23 languages.

READMORE This blog post is just a preview of the biggest changes in PSPDFKit 1.6 for Windows. Please refer to our [PSPDFKit 1.6 for Windows changelog][changelog] for a complete list.

READMORE

## Image Annotations

<video src="/images/blog/2018/pspdfkit-windows-1-6/images.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

With image annotations, we’re adding another powerful annotation tool to PSPDFKit for Windows. With a few clicks, you can now easily add JPEG, PNG, and PDF images to a PDF.

## Table of Contents and Annotation Sidebar

<video src="/images/blog/2018/pspdfkit-windows-1-6/sidebar.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

In addition to the thumbnail view, the sidebar was updated to add support for showing both the table of contents (PDF document outline) and an annotation list.

## Annotation Variants: Ink Highlighter and Arrow Tools

<video src="/images/blog/2018/pspdfkit-windows-1-6/inkarrow.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Similar to what we did with our other platforms, we’re adding support for annotation variants. Variants are custom toolbar buttons that can be used to create annotations with different presets. The most common use cases are the ink highlighter and arrow tools, and we’re thrilled to include these in the new version of PSPDFKit for Windows.

In addition to variants, we’re also adding new client APIs to allow the [customization of annotation presets][presets]. With this API, we’ve also changed the default behavior to persist the last known annotation properties for every individual annotation tool. We’ve also added an API to allow you to save those changes and restore the same changes between sessions.

## Vertical Text Annotation Alignment

<video src="/images/blog/2018/pspdfkit-windows-1-6/aligntext.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Sometimes text needs to be laid out vertically as well. To support this, we’re adding the option to vertically align text annotations.

## Приве́т! สวัสดี! Salut! ¡Hola!

We at PSPDFKit are always [focused on improving our internationalization efforts][localization at pspdfkit], not only because we have employees in more than 20 different countries, but also because we want to allow your business to scale around the globe.

![Localization](/images/blog/2018/pspdfkit-windows-1-6/localization.png)

Users will immediately see all text and accessibility strings in their languages, since we use the default locale for the system.

## And Finally

We've added [several new guides][guides] and further improved documentation.

In addition to all these new features, this release also includes several fixes and minor enhancements and upgrades to [PSPDFKit for Windows 1.6][changelog].

[guides]: /guides/windows/current/
[windows website]: /windows
[changelog]: /changelog/windows/#1.6.0
[localization at pspdfkit]: https://pspdfkit.com/blog/2018/localization-at-pspdfkit/
[presets]: /guides/windows/current/customizing-the-interface/customizing-the-toolbar/#annotation-presets
