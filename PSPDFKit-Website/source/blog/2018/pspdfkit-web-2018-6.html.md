---
title: "PSPDFKit for Web 2018.6"
description: "Announcing PSPDFKit for Web 2018.6 — with stamp annotations, bookmarks, a smaller WASM build, and a lot more."
preview_image: /images/blog/2018/pspdfkit-web-2018-6/article-header.png
preview_video: /images/blog/2018/pspdfkit-web-2018-6/features.mp4
section: blog
author:
  - Nicolas Dular
author_url:
  - https://twitter.com/NicolasDular
date: 2018-11-13 08:00 UTC
tags: Web, Products
cta: web
published: true
---

We’re pleased to announce PSPDFKit for Web 2018.6! This release introduces stamp annotations with predefined stamps, along with a new bookmarks sidebar. It also reduces the WASM build size, plus a whole lot more. READMORE Please refer to our [Server][server changelog] and [Web changelogs][web changelog] for a complete list of features and bug fixes.

To update your application, make sure to check out our [2018.6 Migration Guide][web migration guide].

## Stamp Annotations

<video src="/images/blog/2018/pspdfkit-web-2018-6/stamps.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>


With our new stamp annotations, you can place stamps on a PDF with our predefined stamps like Approved or Accepted. We also allow you to create custom stamp annotations with our stamp annotation builder UI.

<video src="/images/blog/2018/pspdfkit-web-2018-6/custom-stamps.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

In addition to the above, the list of default stamp templates is fully customizable, so you can swap templates out for your own images (including vector files using PDFs).

Like all our annotation options, this feature is fully accessible via our client and server APIs, as well as with [PSPDFKit Instant][instant] and [Instant JSON][instant json].

## Bookmarks

<video src="/images/blog/2018/pspdfkit-web-2018-6/bookmarks.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

When you want to remember a certain page in your document, the easiest way to do this is to add a [bookmark][bookmark blog post]. With 2018.6, this is now also possible in PSPDFKit for Web. You can easily create a bookmark in your PDF via the UI and our client and server API, as well as with [PSPDFKit Instant][instant] and [Instant JSON][instant json].

With the new bookmarks sidebar, we also made efforts to improve accessibility. The bookmark sidebar can be used completely without any mouse interaction, which makes it great for screen readers and keyboard users. Having a better accessibility experience is an ongoing effort, and you’re going to see more of these improvements in the future.

## Reducing WASM Build Size

We’re constantly working on improving our Standalone version and working together with [all browser vendors][wasm blog post]. Due to our most recent work, we were able to reduce the size of the WASM bundle by 23 percent. This improves loading times and the overall experience.

Running our Standalone version is not limited to browsers. You can also use PSPDFKit for Web in your [Electron][] applications, as we recently detailed in one of our [blog posts][electron blog post].

## Watermarks and Search API

With our new [`RenderPageCallback`][] API, you’re able to draw content on top of a PDF. In turn, this content can be used to watermark your PDFs. We’ve provided you with a guide article on how to use the new API to [create watermarks][watermark guide].

We also added a server-to-server API for you to search in documents. You can read more about the API endpoint [here][search api].

Along with all the new features, this release also includes a number of bug fixes and minor improvements. For a complete list of changes, see the [PSPDFKit for Web 2018.6][web changelog] and [PSPDFKit Server 2018.6][server changelog] changelogs.

[server changelog]: /changelog/server/#2018.6
[web changelog]: /changelog/web/#2018.6
[web migration guide]: /guides/web/current/migration-guides/2018-6-migration-guide/
[instant]: /instant
[instant json]: /guides/web/current/importing-exporting/instant-json/
[bookmark blog post]: https://pspdfkit.com/blog/2016/just-a-simple-bookmark/
[wasm blog post]: /blog/2018/a-real-world-webassembly-benchmark/
[electron]: https://electronjs.org/
[electron blog post]: /blog/2018/running-native-code-in-electron-and-the-case-for-webassembly/
[`renderpagecallback`]: https://pspdfkit.com/api/web/PSPDFKit.html#.RenderPageCallback
[watermark guide]: /guides/web/current/features/watermarks
[search api]: /guides/server/current/server-api/documents/#searching-in-a-document
