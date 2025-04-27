---
title: "PSPDFKit for Web 2018.7"
description: "Announcing PSPDFKit for Web 2018.7 — Featuring a new Catalog example app, smooth drawing, a new highlighter tool, and several new customization options."
preview_image: /images/blog/2018/pspdfkit-web-2018-7/article-header.png
preview_video: /images/blog/2018/pspdfkit-web-2018-7/features.mp4
section: blog
author:
  - Philipp Spiess
author_url:
  - https://twitter.com/PhilippSpiess
date: 2018-12-18 08:00 UTC
tags: Web, Products
cta: web
published: true
---

We’re incredibly delighted to present our latest release for the year: PSPDFKit for Web 2018.7. We’ve added a new Catalog example app, smooth drawing, a new highlighter tool, and several other new customization options like inline annotation toolbars. READMORE Please refer to our [Server][server changelog] and [Web changelogs][web changelog] for a complete list of features and bug fixes.

To upgrade your application, make sure to check out our [2018.7 Migration Guide][web migration guide].

## Catalog Example App

We’ve long been working on a new example app that acts as a gallery for examples of PSPDFKit integrations, API usage, and best practices that can easily be integrated into your application and can also replace our showcase application. The new Catalog is just that.

<a href="https://web-examples.pspdfkit.com">
<img alt="" role="presentation" src="/images/blog/2018/pspdfkit-web-2018-7/catalog.png">
</a>

The Catalog is [also available on GitHub][catalog on github] and can be started locally. When you take a look at the source code, you’ll find an `examples/` folder that contains the code that is run for every example. All of that can be integrated into your setup as well.

You can check out the new Catalog right now by [following this link](https://web-examples.pspdfkit.com). Watch out for more examples in the future.

## Smooth Drawing

<video src="/images/blog/2018/pspdfkit-web-2018-7/smoothd.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Our previous drawing implementation simply connected the drawing points with straight lines. This worked well, but sometimes you can spot edges in the drawing, which does not look natural. Fortunately, we can get a better result by fitting curves between the points to get smooth line drawings. This will result in a much better drawing experience for your users.

To further improve the drawing experience, we’ve exposed new APIs to configure the sampling rate of points: By default, we apply a radial polyline simplification to reduce the byte size of drawing at the expense of resolution. With [these new APIs](https://pspdfkit.com/api/web/PSPDFKit.html#.Options), this behavior can now be tweaked to suit your needs. You can also choose to opt out of smooth drawing.

## Highlighter Tool

<video src="/images/blog/2018/pspdfkit-web-2018-7/highlight.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Since day one, we’ve embraced native text selection for our features. To create highlight annotations, you only have to select text with your mouse or via touch to choose the appropriate annotation type.

With our newest release, we’re taking this to the next level with the introduction of a new highlighter tool. This is meant for power users who have to highlight a lot of texts quickly. Once the highlight tool mode is active, selecting text will instantly create highlight annotations — no second click is necessary.

## Annotation Tooltips

<video src="/images/blog/2018/pspdfkit-web-2018-7/tooltip.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

We’ve made it a priority to improve customizability with this release. One feature that often comes up as something to work on is the ability to disable the annotation toolbar in favor of simpler inline tooltips for annotations.

With this release, we’re adding a new API that brings the power of our text selection tooltips to arbitrary annotations. For each annotation type, you can now create tooltips with custom buttons that PSPDFKit will automatically show when an annotation is selected.

In addition to the annotation tooltips, we’re introducing many other API changes that increase the customizability of PSPDFKit. One particular example is the option to place arbitrary DOM nodes in the toolbar as well.

Along with all the new features, this release also includes a number of bug fixes and minor improvements. For a complete list of changes, see the [PSPDFKit for Web 2018.7][web changelog] and [PSPDFKit Server 2018.7][server changelog] changelogs.

[server changelog]: /changelog/server/#2018.7
[web changelog]: /changelog/web/#2018.7
[web migration guide]: /guides/web/current/migration-guides/2018-7-migration-guide/
[catalog on github]: https://github.com/PSPDFKit/pspdfkit-web-examples-catalog
