---
title: "PSPDFKit for Web 2018.5"
description: "Announcing PSPDFKit for Web 2018.5, with image annotations, new table of contents and annotation sidebars, ink highlighter and arrow tools, and a lot more."
preview_image: /images/blog/2018/pspdfkit-web-2018-5/article-header.png
preview_video: /images/blog/2018/pspdfkit-web-2018-5/features.mp4
section: blog
author:
  - Philipp Spiess
author_url:
  - https://twitter.com/PhilippSpiess
date: 2018-09-05 08:00 UTC
tags: Web, Products
cta: web
published: true
---

We’re excited to announce the newest set of features that make up our PSPDFKit for Web 2018.5 release: image annotations to place arbitrary images on a PDF page, two new sidebar modes — one to show the table of contents (document outlines) of a PDF and one that lists all annotations, a new option to create annotation variants with the ink highlighter and arrow tools enabled by default, and a lot more! READMORE Please refer to our [Server][server changelog] and [Web changelogs][web changelog] for a complete list of features and bug fixes.

To update your application, make sure to check out our [2018.5 Migration Guide][web migration guide].

## Image Annotations

<video src="/images/blog/2018/pspdfkit-web-2018-5/images.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

With image annotations, we’re adding another powerful annotation tool to PSPDFKit for Web. With one click or tap, you can now easily add JPEG, PNG, and PDF images to a PDF.

Like all our annotation options, this feature is fully accessible via our client and server APIs, as well as with [PSPDFKit Instant][instant] and [Instant JSON][instant json]. Our iOS and Android clients will receive support for Instant images in the next version (Instant JSON is already supported).

## Table of Contents and Annotation Sidebar

<video src="/images/blog/2018/pspdfkit-web-2018-5/sidebar.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

In addition to the thumbnail view, the sidebar was updated to add support for showing both the table of contents (PDF document outline) and an annotation list.

The table of contents data can also be accessed via client and server APIs.

## Annotation Variants: Ink Highlighter and Arrow Tools

<video src="/images/blog/2018/pspdfkit-web-2018-5/variants.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Similar to what we did with our other platforms, we’re adding support for annotation variants. Variants are custom toolbar buttons that can be used to create annotations with different presets. The most common use cases are the ink highlighter and arrow tools, and we’re thrilled to include these in the new version of PSPDFKit for Web.

In addition to variants, we’re also adding new client APIs to allow the customization of annotation presets. With this API, we’ve also changed the default behavior to persist the last known annotation properties for every individual annotation tool. We’ve also added an API to allow you to save those changes and restore the same changes after a full browser refresh.

## Vertical Text Annotation Alignment

<video src="/images/blog/2018/pspdfkit-web-2018-5/vertical-align.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Sometimes text needs to be laid out vertically as well. To support this, we’re adding the option to vertically align text annotations.

## WebAssembly Performance in V8

We’re super excited to see browser vendors using our [WebAssembly Benchmark][wasm blog post] to improve their products. Just a few days ago, Google released Liftoff, a new baseline compiler for WebAssembly in V8. Check out the [release blog post](https://v8project.blogspot.com/2018/08/liftoff.html), which includes a section for PSPDFKit, showing a 56%+ faster initialization time.

<center>
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I&#39;m super excited to see our work being used as a reference for the new Chrome WebAssembly baseline compiler. Initialization time was definitely our bottleneck and it&#39;s great to see so much work being done on that front. 💪<br><br>Thanks <a href="https://twitter.com/mathias?ref_src=twsrc%5Etfw">@mathias</a> &amp; team for the amazing writeup. 🙌 <a href="https://t.co/jFgnqgCkMG">https://t.co/jFgnqgCkMG</a></p>&mdash; Philipp (@PhilippSpiess) <a href="https://twitter.com/PhilippSpiess/status/1031552193885876224?ref_src=twsrc%5Etfw">August 20, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</center>
<br>

In addition to the Google update, we also have exciting news from the WebAssembly team at Microsoft that worked with us to achieve an impressive 2.25x speedup in our WebAssembly benchmark. We’ve updated our [blog post][wasm blog post] with more details.

<img alt="Updated WebAssembly benchmark score. Edge 42: 11751, Edge 44: 5207. This shows a 2.25x speedup." src="/images/blog/2018/pspdfkit-web-2018-5/wasm-benchmark-update-edge.png" width="545">

Along with all the new features, this release also includes a number of bug fixes and minor improvements. For a complete list of changes, see the [PSPDFKit for Web 2018.5][web changelog] and [PSPDFKit Server 2018.5][server changelog] changelogs.

[server changelog]: /changelog/server/#2018.5
[web changelog]: /changelog/web/#2018.5
[wasm blog post]: /blog/2018/a-real-world-webassembly-benchmark/
[instant]: /instant
[instant json]: /guides/web/current/importing-exporting/instant-json/
[web migration guide]: /guides/web/current/migration-guides/2018-5-migration-guide/
