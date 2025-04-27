---
title: "PSPDFKit 1.2 for Windows"
description: "Introducing PSPDFKit 1.2 for Windows — featuring indexed full-text search, a new API for page sizes and an improved catalog."
preview_image: /images/blog/2018/pspdfkit-windows-1-2/windows-1-2-header.png
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2018-05-03 12:00 UTC
tags: Windows, Products, Features
published: true
---

Today we’re shipping PSPDFKit 1.2 for Windows. The highlight of this release is the addition of the Indexed Full-Text Search feature. It also contains various other optimizations and improvements, including the ability to retrieve page sizes. READMORE This blog post is just a preview of the biggest changes in PSPDFKit 1.2 for Windows. Please refer to our [PSPDFKit 1.2 for Windows changelog][] for a complete list.

## Indexed Full-Text Search

This release adds powerful PDF indexing capabilities via the [`PSPDFKit.Search.Library`][] class. You can easily create a searchable index of all your PDF documents and then query that index within seconds. Our custom indexer can even search Chinese, Japanese, and Korean text.

Indexed Full-Text Search is an optional feature. For licensing details, please [contact our sales team](mailto:sales@pspdfkit.com). You can also learn more about this in our [corresponding guide article][].

<video src="/images/blog/2018/pspdfkit-windows-1-2/indexed-full-text-search.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Page Sizes

For retrieving the size of a page, we now provide the method [`PSPDFKit.Document.GetPageSize`][].

For a complete list of changes for this release, read our [PSPDFKit 1.2 for Windows changelog][].

The PSPDFKit for Windows UI is powered by PSPDFKit for Web. See here for more details about [PSPDFKit for Web 2018.2][].

[`PSPDFKit.Search.Library`]: https://pspdfkit.com/api/windows/PSPDFKit/PSPDFKit.Search.Library.html
[corresponding guide article]: https://pspdfkit.com/guides/windows/current/features/indexed-full-text-search/
[contact our sales team]: sales@pspdfkit.com
[PSPDFKit 1.2 for Windows changelog]: https://pspdfkit.com/changelog/windows/#1.2.0
[PSPDFKit for Web 2018.2]: https://pspdfkit.com/blog/2018/pspdfkit-web-2018-2/
[`PSPDFKit.Document.GetPageSize`]: https://pspdfkit.com/api/windows/PSPDFKit/PSPDFKit.Pdf.Document.html
