---
title: "PSPDFKit for Web 2019.2"
description: "Announcing PSPDFKit for Web 2019.2 — including accessibility improvements, custom annotation data, new Server APIs, a preloadWorker API, and more."
preview_image: /images/blog/2019/pspdfkit-web-2019-2/article-header.png
preview_video: /images/blog/2019/pspdfkit-web-2019-2/features.mp4
section: blog
author:
  - Luna Graysen
author_url:
  - https://twitter.com/lunalovesbirds
date: 2019-04-18 12:00 UTC
tags: Web, Products
cta: web
published: true
---

We’re pleased to announce PSPDFKit for Web 2019.2! This release introduces accessibility improvements, new Server APIs for creating Instant Layers from Instant JSON, and a new API to preload the WebAssembly or asm.js worker. Please refer to our [Server][server changelog] and [Web][web changelog] changelogs for a complete list of features and bug fixes.

## Accessibility Improvements

<video src="/images/blog/2019/pspdfkit-web-2019-2/keyboard.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

With this release, we’re introducing the first of many accessibility improvements, as it is important to us that Web be accessible and provide equal access and opportunity to everyone, including those with disabilities. You can now select annotations using the keyboard by pressing the tab key. With <kbd>Tab</kbd> and <kbd>Shift</kbd> + <kbd>Tab</kbd>, it’s easy to navigate backward and forward between annotations, and annotations can be selected by pressing <kbd>Enter</kbd>. You can try out keyboard navigation for annotations by playing around with our [public examples][public examples catalog].

## Custom Annotation Data

The [`customData` field][customdata post] can be used to [store arbitrary JSON on annotations][custom annotation data] for any reason you see fit. For example, you can store metadata in the newly added `customData` field and filter annotations based on that metadata directly using [Instant JSON][]. This is persisted even in your PDF and in XFDF.

## Flipbook Example (Page Curl Effect)

<video src="/images/blog/2019/pspdfkit-web-2019-2/flip.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

With Flipbook, we added a new Catalog example that demonstrates a magazine-like page curl effect that works great on desktop and mobile devices. We focused fully on the viewing experience here and did not add annotation editing support, as this is not a common use case for magazines. [You can try it out here][flipbook]!

## preloadWorker() API

![Preload the PSPDFKit WebAssembly Module to speed up initialization time](/images/blog/2019/pspdfkit-web-2019-2/preloadworker.png)

We added a `preloadWorker()` API for Standalone that allows you to start a WebAssembly or asm.js initialization before you load your first document. This API can be used in a variety of ways, but one example is with single-page applications: They could use this API to start downloading the required artefacts for the viewer before the first PDF is displayed. This will ensure everything is loaded when a PDF is shown and will drastically reduce the time it takes to display the contents.

## Improved Performance for Large Documents

We now limit the number of pages rendered offscreen, in order to drastically reduce the number of DOM nodes. This significantly improves performance when using the continuous page view.

## New Server APIs

![New Server APIs](/images/blog/2019/pspdfkit-web-2019-2/server-apis.png)

We added new APIs to [create Instant Layers from Instant JSON][create instant layers] for the same document. There are many use cases for this, but one example is that these APIs can be used to create different “views” consisting of a subset of annotations for different users.

## Examples of Print Modes, Custom PDF Search, and an Annotation’s Rendered Content

We worked on new example integrations [in our Catalog][public examples catalog]. The print modes example demonstrates printing normally, as HTML, or as an exported PDF document. The example about customizing the PDF search feature shows you how to limit what can be found when searching through a PDF. Lastly, the example about customizing an annotation’s rendered content demonstrates how to associate custom HTML content with rendered annotations in the DOM.

![Custom Renderer for a Note Annotation](/images/blog/2019/pspdfkit-web-2019-2/renderers.png)

Along with all the new features, this release also includes numerous bug fixes and minor improvements. For a complete list of changes, see the [PSPDFKit for Web 2019.2][web changelog] and [PSPDFKit Server 2019.2][server changelog] changelogs.

[create instant layers]: https://pspdfkit.com/guides/server/current/server-api/instant-layers#creating-a-layer
[public examples catalog]: https://web-examples.pspdfkit.com
[custom annotation data]: https://pspdfkit.com/blog/2019/custom-annotation-data/
[instant json]: https://pspdfkit.com/guides/web/current/importing-exporting/instant-json/
[flipbook]: https://web-examples.pspdfkit.com/flipbook
[server changelog]: /changelog/server/#2019.2
[web changelog]: /changelog/web/#2019.2
[customdata post]: https://pspdfkit.com/blog/2019/custom-annotation-data/
