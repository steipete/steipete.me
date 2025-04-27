---
title: "PSPDFKit for Web 2019.1"
description: "Announcing PSPDFKit for Web 2019.1 — including support for cloudy borders, advanced annotation permission APIs, new examples, and more."
preview_image: /images/blog/2019/pspdfkit-web-2019-1/article-header.png
preview_video: /images/blog/2019/pspdfkit-web-2019-1/features.mp4
section: blog
author:
  - Philipp Spiess
author_url:
  - https://twitter.com/PhilippSpiess
date: 2019-02-07 12:00 UTC
tags: Web, Products
cta: web
published: true
---

With our first feature release of the year, PSPDFKit for Web 2019.1, we’re bringing you support for cloudy borders, advanced annotation permission APIs, new examples like watermarks and drag and drop, and more. READMORE Please refer to our [Server][server changelog] and [Web changelogs][web changelog] for a complete list of features and bug fixes.

To upgrade your application, make sure to check out our [2019.1 Migration Guide][web migration guide].

## Cloudy Borders

With this release, we’re bringing full support for cloudy borders to polygon, rectangle, and ellipse annotations. Your users can change the border style via our annotation toolbars and use our [annotation APIs][] to enable cloudy borders for supported annotation types.

<video src="/images/blog/2019/pspdfkit-web-2019-1/cloudy-borders.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

In addition, support for syncing the cloudy border status for annotations was added to [Instant][], [Instant JSON][], and [XFDF][].

## Advanced Annotation Permission APIs

<video src="/images/blog/2019/pspdfkit-web-2019-1/annotation-permission.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

We’ve added new APIs to modify write access to specific annotations, and using our new [annotation permission APIs][], it’s now possible to make some annotation types read-only or define read-only support for individual annotations.

## Drag-and-Drop and Watermark Examples

<video src="/images/blog/2019/pspdfkit-web-2019-1/drag-and-drop.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

We worked on new example integrations in our [Catalog][]. The drag-and-drop example shows how to build a custom sidebar where predefined annotation options can be added to the page via drag and drop. You can even drop images from your desktop directly into the browser. It also demonstrates the new APIs we added with this release, such as the ability to customize [sidebar placement][].

Another new example shows how to register a [page render callback][] for drawing watermarks on your PDFs.

You can see all these integrations live on our [public examples Catalog][].

Along with all the new features, this release also includes numerous bug fixes and minor improvements. For a complete list of changes, see the [PSPDFKit for Web 2019.1][web changelog] and [PSPDFKit Server 2019.1][server changelog] changelogs.

[server changelog]: /changelog/server/#2019.1
[web changelog]: /changelog/web/#2019.1
[web migration guide]: /guides/web/current/migration-guides/2019-1-migration-guide/
[annotation apis]: https://pspdfkit.com/guides/web/current/annotations/introduction-to-annotations/
[instant]: https://pspdfkit.com/instant/
[instant json]: https://pspdfkit.com/guides/web/current/importing-exporting/instant-json/
[xfdf]: https://pspdfkit.com/guides/web/current/importing-exporting/xfdf-support/
[annotation permission apis]: https://pspdfkit.com/api/web/PSPDFKit.Configuration.html#isEditableAnnotation
[catalog]: https://pspdfkit.com/blog/2018/pspdfkit-web-2018-7/#catalog-example-app
[sidebar placement]: https://pspdfkit.com/api/web/PSPDFKit.html#.SidebarPlacement
[page render callback]: https://pspdfkit.com/api/web/PSPDFKit.html#.RenderPageCallback
[public examples catalog]: https://web-examples.pspdfkit.com
