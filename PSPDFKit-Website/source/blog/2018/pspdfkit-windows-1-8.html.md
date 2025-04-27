---
title: "PSPDFKit 1.8 for Windows"
description: PSPDFKit for the Universal Windows Platform
preview_image: /images/blog/2018/pspdfkit-windows-1-8/header.png
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2018-11-29 12:00 UTC
tags: Windows, Products, Development
published: true
---

Today we’re shipping PSPDFKit 1.8 for Windows. This release features the addition of predefined and custom stamp annotations, a bookmarks sidebar, improved CSS, and more.

READMORE Please refer to our [PSPDFKit 1.8 for Windows changelog][changelog] for a complete list of changes in this release.

## Stamp Annotations

![stamp annotations](/images/blog/2018/pspdfkit-windows-1-8/stamps.png)

With our new stamp annotations, you can place stamps on a PDF with predefined stamps like Approved or Accepted. We also allow you to create custom stamp annotations with our stamp annotation builder UI.

<video src="/images/blog/2018/pspdfkit-windows-1-8/stamp.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Add a stamp with your own text!

<video src="/images/blog/2018/pspdfkit-windows-1-8/custom-stamp.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Read [the guide][stamp guide] for information on how to add stamps programmatically.

## Bookmarks Sidebar

![bookmarks sidebar](/images/blog/2018/pspdfkit-windows-1-8/bookmarks.png)

When you want to remember a certain page in your document, the easiest way to do this is to add a bookmark. You can easily create a bookmark in your PDF via either the UI or our API.

<video src="/images/blog/2018/pspdfkit-windows-1-8/bookmarks.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Read [the guide][bookmark guide] for information on how to work with bookmarks programmatically.

## And Finally

We improved the CSS, making it easier to customize the UI with your own color scheme. To learn more, check out [the corresponding guide][] and the [Custom CSS example][catalog css] in the Catalog app supplied with the SDK.

[guides]: /guides/windows/current/
[stamp guide]: /guides/windows/current/annotations/stamps/
[bookmark guide]: /guides/windows/current/features/bookmarks/
[windows website]: /windows
[changelog]: /changelog/windows/#1.8.0
[catalog css]: /api/windows/Catalog/Catalog.Views.CustomCssPage.html
[the corresponding guide]: /guides/web/current/customizing-the-interface/css-customization/
