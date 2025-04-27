---
title: "PSPDFKit for Web 2018.4"
description: "Announcing PSPDFKit for Web 2018.4, which introduces shape annotations, blend modes, and an improved annotation toolbar."
preview_image: /images/blog/2018/pspdfkit-web-2018-4/article-header.png
preview_video: /images/blog/2018/pspdfkit-web-2018-4/features.mp4
section: blog
author:
  - Nicolas Dular
author_url:
  - https://twitter.com/NicolasDular
date: 2018-07-12 12:00 UTC
tags: Web, Products
cta: web
published: true
---

Right on time for the summer, we have something exciting to share with you: PSPDFKit for Web 2018.4! This release features the addition of shape annotations, bringing us one step closer to supporting all annotation types. We also added blend mode options for markup and ink annotations, something we first introduced in [PSPDFKit 7.6 for iOS][pspdfkit ios release]. READMORE Please refer to our [Server][server changelog] and [Web changelogs][web changelog] for a complete list of features and bug fixes.

To update your application, make sure to check out our [2018.4 Migration Guide][web migration guide].

## Shape Annotations

With our new shape annotations, you can now draw lines, rectangles, polygons, circles, and polylines. Just like in our Android and iOS SDKs, you can change the dash types and even the
start and ending of a line annotation in order to draw arrows.

Synchronizing shape annotations with our iOS and Android SDKs will work out of the box, since
they are already fully supported by [Instant][instant].

<video src="/images/blog/2018/pspdfkit-web-2018-4/shape.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Blend Modes

[Blend modes][blend mode wiki] define how layers are blended into each other. One example is that of highlight annotations, where we blend a highlight with the underlying text. From now on, you can choose from a variety of blend modes for markup annotations and ink annotations. Blend modes only work [in supported browsers][blend mode supported browsers].

<video src="/images/blog/2018/pspdfkit-web-2018-4/blend-mode.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Toolbar

With the addition of more and more possibilities for changing the style of annotations, we adapted our annotation toolbar to let you choose separately between a foreground and background color instead of using predefined color sets.

<video src="/images/blog/2018/pspdfkit-web-2018-4/toolbar.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Update on WebAssembly

As you might already know, we are big supporters of WebAssembly and have been using it for [PSPDFKit for Web Standalone][web standalone] since 2017. To help push the ecosystem forward, we’re working with multiple browser vendors and recently built a real-world [WebAssembly Benchmark][wasm blog post] with surprising results.

Along with all the new features, this release also includes a number of bug fixes and minor
improvements. For a complete list of changes, see the [PSPDFKit for Web 2018.4][web changelog] and [PSPDFKit Server 2018.4][server changelog] changelogs.

[server changelog]: /changelog/server/#2018.4
[web changelog]: /changelog/web/#2018.4
[pspdfkit ios release]: https://pspdfkit.com/blog/2018/pspdfkit-ios-7-6/#blend-mode
[blend mode wiki]: https://en.wikipedia.org/wiki/Blend_modes
[web standalone]: https://pspdfkit.com/pdf-sdk/web/#deployment-standalone
[blend mode supported browsers]: https://caniuse.com/#feat=css-mixblendmode
[wasm blog post]: /blog/2018/a-real-world-webassembly-benchmark/
[instant]: /instant
[web migration guide]: /guides/web/current/migration-guides/2018-4-migration-guide/
