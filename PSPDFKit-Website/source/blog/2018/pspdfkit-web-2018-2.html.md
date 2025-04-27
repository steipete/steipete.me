---
title: "PSPDFKit for Web 2018.2"
description: "Announcing PSPDFKit for Web 2018.2, with support for Electron, improved APIs, localization for 27 languages, and much more."
preview_image: /images/blog/2018/pspdfkit-web-2018-2/article-header.png
preview_video: /images/blog/2018/pspdfkit-web-2018-2/features.mp4
section: blog
author:
  - Philipp Spiess
author_url:
  - https://twitter.com/PhilippSpiess
date: 2018-03-28 12:00 UTC
tags: Web, Products
cta: web
published: true
---

We’re excited to announce the next major PSPDFKit for Web release. This time, we’ve worked on PSPDFKit for Electron, which brings first-class support to the Electron platform to create cross-platform applications. Additionally, we’re adding full localization support, with translations for 27 languages. To improve customization, we’ve also greatly improved our API surface. Please refer to our [Server][Server Changelog] and [Web changelogs][Web Changelog] for a complete list of features and bug fixes.

## Announcing PSPDFKit for Electron

[![](/images/blog/2018/pspdfkit-web-2018-2/electron.png)](/electron)

In just a short amount of time, [Electron] has become the de facto standard for building cross-platform desktop apps. It works by employing the power of modern web technologies and an incredible simple toolchain, and it is used by [top companies][Electron Apps] around the globe, including GitHub, Facebook, Microsoft, and Slack.

By enabling first-class Electron support, the PSPDFKit for Web experience is now available on all desktop platforms. We made sure that integrating PSPDFKit into your Electron application is as easy as adding any other npm package, and we’re making use of our [WebAssembly][] build to power our PDF engine.

If you’re developing an Electron application, be sure to check out our [example application][Electron Example] and [download a trial][] today!

## Приве́т! สวัสดี! Salut! ¡Hola!

We at PSPDFKit are always [focused on improving our internationalization efforts][Localization at PSPDFKit], not only because we have employees in more than 20 different countries, but also because we want to allow your business to scale around the globe.

<video src="/images/blog/2018/pspdfkit-web-2018-2/i18n.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

This is why we’re especially excited to launch localization support for PSPDFKit for Web today. Just like we did with our Android framework, we’re starting out with [27 languages][localization API], and we will be adding to this over time.

The best part: There’s no additional work for you. As soon as you upgrade to PSPDFKit for Web 2018.2, your users will immediately see all text and accessibility strings in their languages, since we will use the default locale defined in the browser. In addition to automatic locale detecting, you can also control the language at runtime via the new [localization API][], in order to make sure the language of PSPDFKit for Web always matches that of your application.

## Improved API

One of the main features of all our SDK products is the high degree of customizability. Since we’re constantly improving our product, we’re proud to show you some new APIs we’ve created that allow you to control even more aspects of your PDF documents.

### Custom Overlay Items

The biggest change is the introduction of a new [custom overlay API][]. This will allow you to place HTML elements directly in a PDF page. By default, we even take care of zooming and rotation — everything will simply work.

Check out the following snippet that will place an emoji on the first page:

[==

```es
import { CustomOverlayItem, Geometry } from "pspdfkit";

const node = document.createElement("div");
node.textContent = "👩‍🔬";

node.addEventListener("click", () => { alert("hello there"); });

const customOverlayItem = new CustomOverlayItem({
  id: "scientist",
  node,
  pageIndex: 0,
  position: new Geometry.Point({ x: 100, y: 100 }),
})

instance.setCustomOverlayItem(customOverlayItem);
```

```js
var node = document.createElement("div");
node.textContent = "👩‍🔬";

node.addEventListener("click", function () { alert("hello there"); });

var customOverlayItem = new PSPDFKit.CustomOverlayItem({
  id: "scientist",
  node,
  pageIndex: 0,
  position: new PSPDFKit.Geometry.Point({ x: 100, y: 100 }),
})

instance.setCustomOverlayItem(customOverlayItem);
```

==]

<video src="/images/blog/2018/pspdfkit-web-2018-2/coi.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

### Search, Text Selection, and More

In addition to the custom overlay item API, we have reworked the API for many other parts as well:

- The new search API will let you programmatically search text in a PDF, and it also allows fine-grained access to the search user interface. This enables you to integrate PSPDFKit for Web seamlessly with your custom search backend.
- To access the currently selected text, you can now use the new text selection API. Together with new callbacks, this can be used to access the exact selection state at any time.
- New events were added to handle clicks on pages and text lines.
- We’ve updated our [API docs](https://pspdfkit.com/guides/web/current/features/text-selection/) to include the above, plus many more changes. For a complete list, please refer to the [changelog][Web Changelog].

## Server-Based Pre-Rendering

To improve the performance of our [Server-based][] setup, we’re adding a new API to pre-render pages. This API will intelligently render parts of a PDF in advance to significantly speed up subsequent initialization of PSPDFKit for Web (since these requests can read from the cache).

The default cache strategy will use an in-memory approach. This works great for most setups, but if you’re running a [distributed setup][], things get more complicated. To solve this issue, we’ve built an optional Redis cache layer as well. All hosts in your setup can connect to a shared Redis cache and can thus share the pre-rendered images. We recommend this solution for everyone who maintains a distributed setup.

We’ve put together a guide article that goes into more detail, which you can [check out here][caching guide].

For a complete list of changes, see the [PSPDFKit for Web 2018.2][Web Changelog] and [PSPDFKit for Server 2018.2][Server Changelog] changelogs.

[Localization at PSPDFKit]: https://pspdfkit.com/blog/2018/localization-at-pspdfkit/
[Server Changelog]: /changelog/server/#2018.2
[Web Changelog]: /changelog/web/#2018.2
[WebAssembly]: /blog/2017/webassembly-a-new-hope/
[Electron]: https://electronjs.org/
[Electron Apps]: https://electronjs.org/apps
[download a trial]: https://pspdfkit.com/try/
[Electron Example]: https://pspdfkit.com/guides/web/current/pspdfkit-for-electron/example-project/
[localization API]: https://pspdfkit.com/guides/web/current/features/localization/
[custom overlay API]: https://pspdfkit.com/guides/web/current/customizing-the-interface/creating-custom-overlay-items/
[Server-based]: https://pspdfkit.com/guides/web/current/server-backed/overview/
[distributed setup]: https://pspdfkit.com/guides/server/current/deployment/horizontal-scaling/
[caching guide]: https://pspdfkit.com/guides/server/current/pspdfkit-server/cache/
