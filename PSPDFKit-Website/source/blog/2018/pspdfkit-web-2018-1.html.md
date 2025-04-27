---
title: "PSPDFKit for Web 2018.1"
description: "Announcing PSPDFKit for Web 2018.1, with a new thumbnail sidebar, page rotation, and XFDF support."
preview_image: /images/blog/2018/pspdfkit-web-2018-1/article-header.png
preview_video: /images/blog/2018/pspdfkit-web-2018-1/features.mp4
section: blog
author:
  - Philipp Spiess
author_url:
  - https://twitter.com/PhilippSpiess
date: 2018-02-08 10:00 UTC
tags: Web, Products
cta: web
published: true
---

It’s time for our first major PSPDFKit for Web release this year. We again worked on the most requested features and are proud to announce support for a fully responsive thumbnail sidebar, the ability to rotate pages to inspect your documents from every angle, and support to import and export annotations and form field values using XFDF. Please refer to our [Server][Server Changelog] and [Web changelogs][Web Changelog] for a complete list of features and bug fixes.

## Thumbnail Sidebar

The new thumbnail sidebar can be used to get a quick overview of all pages in a PDF. It can be shown and hidden at any time, and it works on both desktop and mobile. The column can be resized to show a multi-column view of the pages.

<video src="/images/blog/2018/pspdfkit-web-2018-1/toolbar_desktop.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

For an even bigger picture of your document, the thumbnail sidebar can also be expanded into a full gallery view. This can be done by double clicking the drag icon. Whenever the sidebar is in gallery mode, clicking on a page will close the sidebar and show the page that was clicked on. On mobile devices with limited horizontal screen space, the sidebar will automatically function as a gallery.

<video src="/images/blog/2018/pspdfkit-web-2018-1/toolbar_gallery.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

The thumbnail view is just one of many planned sidebar integrations. We're already working on bringing more features to the sidebar, with a table of contents and bookmark view coming soon.

## Page Rotation

With today’s release, it is now possible to rotate pages to enhance the current view. This is a very useful feature for many situations, especially when working with large construction plans or the like. If you've enabled the [layout configuration](https://pspdfkit.com/blog/2017/pspdfkit-web-2017-6/#introducing-layout-configuration) toolbar item, your users will already have access to the new rotation functionality.

<video src="/images/blog/2018/pspdfkit-web-2018-1/rotation.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

This view setting can also be controlled via the [`ViewState`][] API using the new [`pagesRotation`] property or the newly added helper methods:

[==

```es
instance.setViewState(viewState => viewState.rotateRight());
```

```js
instance.setViewState(function (viewState) {
  return viewState.rotateRight();
});
```

==]

The page rotation feature comes with support for the `NoRotate` flag, a special flag in the PDF spec that prevents annotations from being rotated. This is currently only enabled for note annotations and will be exposed for other annotation types later.

## XFDF Support

[XFDF][] is a file format developed by Adobe to serialize annotations and form data. It is often used to avoid creating new PDFs whenever there are changes to annotations or form data.

With this release, both our standalone and our server-backed solutions have support for importing and exporting annotations and form field values via XFDF.

For more advanced use cases, we recommend you also check out [Instant JSON][], our solution for storing annotations, form data, and more as a diff to a source PDF document.

We've compiled a handy list of importing and exporting options in the [PSPDFKit for Web][Instant JSON] and [PSPDFKit Server][Instant JSON Server] guides.

## Instant JSON on the Server

In addition to the newly added XFDF support for our standalone and server-backed solutions, the latest release makes it even easier to migrate your existing standalone deployment to [PSPDFKit Instant][]. It does this by adding support for importing new PDF documents with [Instant JSON][] to PSPDFKit Server. This will ensure the server is up to date on all annotation and form field value changes without doing any additional work.

To learn more, check out the new [Instant JSON][Instant JSON Server] section in the Server guides.

## Bonus: Faster WebAssembly Initialization ⏱

[WebAssembly][] is used in the core of our [standalone][] renderer and enables super quick PDF rendering directly in the browser. Today, we’re bringing two major performance updates to supported platforms, thereby improving loading times on supported browsers: [IndexedDB caching][] and [streaming instantiation][]. Both of these techniques are very new and not available in every browser yet, so we have state-of-the-art feature tests in place.

If you want to see what’s possible in the future for WebAssembly, we invite you check out PSPDFKit for Web in the latest version of Firefox, which already implements these optimizations.

For the tech-savvy: We’re also working on a blog post that documents our journey to blazing fast WebAssembly loading. Stay tuned.

For a complete list of changes, check out the [PSPDFKit for Web 2018.1][Web Changelog] and [PSPDFKit for Server 2018.1][Server Changelog] changelogs.

[Server Changelog]: /changelog/server/#2018.1
[Web Changelog]: /changelog/web/#2018.1
[`ViewState`]: /guides/web/current/customizing-the-interface/viewstate/
[`pagesRotation`]: /api/web/PSPDFKit.ViewState.html#scrollMode
[PSPDFKit Instant]: /instant
[Instant JSON]: /guides/web/current/importing-exporting/instant-json/
[WebAssembly]: /blog/2017/webassembly-a-new-hope/
[standalone]: /blog/2017/pspdfkit-web-2017-5/#introducing-standalone-deployment
[XFDF]: https://en.wikipedia.org/wiki/Portable_Document_Format#XML_Forms_Data_Format_(XFDF)
[streaming instantiation]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming
[IndexedDB caching]: https://developer.mozilla.org/en-US/docs/WebAssembly/Caching_modules
[Instant JSON Server]: https://pspdfkit.com/guides/server/current/importing-exporting/instant-json/
