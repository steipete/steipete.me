---
title: "PSPDFKit for Web 2017.6"
description: Announcing PSPDFKit for Web 2017.6, introducing Double Page mode, Note Annotations and improved rendering performances
preview_image: /images/blog/2017/pspdfkit-web-2017-6/header.png
section: blog
author:
  - Philipp Spiess
  - Giuseppe Gurgone
author_url:
  - https://twitter.com/PhilippSpiess
  - https://twitter.com/giuseppegurgone
date: 2017-09-18 12:00 UTC
tags: Web, Products
---

We are continuously developing PSPDFKit for Web and are excited to announce the release of our seventh update this year, adding note annotations as well as a new, more customizable and significantly faster view system.

As always, please refer to our [2017.6 Migration Guide](https://pspdfkit.com/guides/web/current/migration-guides/2017-6-migration-guide/) for a list of deprecations and new best practices. A list of all changes can be found in our [changelog][].

## Note Annotations

Many people rely on sticky notes as one of the most powerful productivity tools to leave useful information for their coworkers or themselves and capture ideas.

In this release we are introducing Note Annotations on PSPDFKit for Web as well as cross&#8209;platform support alongside real-time collaboration via [PSPDFKit Instant](https://pspdfkit.com/instant).

Note annotations are drop&#8209;in markers which are represented by a configurable icon and color.

Upon creation or when selected, a speech&#8209;bubble&#8209;like widget pops up with the editable text content of the note. To offer a better experience on small screens, we made Note Annotations responsive and show them in full screen mode like our native SDKs.

<figure style="padding-bottom: 1em">
  <video src="/images/blog/2017/pspdfkit-web-2017-6/note-annotations.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>
</figure>

Like any other annotation type, Note Annotations can be created via [API][Note Annotation API] and exported via [Instant JSON].

## Introducing Layout Configuration

Another major new feature is a complete overhaul of the view system which allowed us to introduce  double-page layouts as well as scroll modes.

Pages can be laid out one at a time or side-by-side in a double-page layout. For books and magazines that have a cover page, we also support keeping the cover page in single-page layout, while laying out the following pages side-by-side in double-page layout. We call these groups of single- or double-pages spreads.

You can now also control the transition between them: Continuous scrolling mode, the default, lays out each spread vertically and lets the user scroll through them - exactly like a webpage. With per-spread scrolling we always render a single spread only, allowing the user to perform discrete jumps between spreads - ideal for presentations.

<figure style="padding-bottom: 1em">
  <video src="/images/blog/2017/pspdfkit-web-2017-6/layouts.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>
</figure>

These new options replace the previous [`ViewState#viewMode`][] option and allow for improved control of the viewing experience. We fully support changing the [`ViewState`][] at any time.

## Improved rendering

Developer and user experience are the top priorities for us. Responsiveness is key to a great user experience. With web technologies this can not be taken for granted – it requires dedication and fine tuning to make a web product highly performant.

In PSPDFKit for Web 2017.6 we reworked our rendering model to improve perceived performance and consequently provide a better user experience.

While fetching a page, instead of a blank image, we now show a loading indicator and immediately render a version of the page at lower resolution. In the meantime, loading of high resolution tiles for the portion of the page in the viewport kicks-in.

When the application is idling we pre-render a buffer of pages preceding and following the current one. This makes scrolling through the document feel more responsive.

Below is a video of the new rendering model (on the left) compared to the previous one (on the right):

<figure style="padding-bottom: 1em">
  <video src="/images/blog/2017/pspdfkit-web-2017-6/rendering.mp4" width="100%" loop muted  playsinline data-controller="video" data-video-autoplay="true"></video>
</figure>

Eagerly rendering pages outside of the viewport is the first of many performance improvements we have planned. Stay tuned ⚡️

[changelog]: /changelog/web/#2017.6
[Note Annotation API]: /api/web/PSPDFKit.Annotations.NoteAnnotation.html
[Instant JSON]: /guides/web/current/importing-exporting/instant-json/
[`ViewState#viewMode`]: https://pspdfkit.com/api/web/PSPDFKit.ViewState.html#viewMode
[`ViewState#spreadSpacing`]: https://pspdfkit.com/api/web/PSPDFKit.ViewState.html#spreadSpacing
[`ViewState`]: https://pspdfkit.com/api/web/PSPDFKit.ViewState.html
[`ViewState#scrollMode`]: https://pspdfkit.com/api/web/PSPDFKit.ViewState.html#scrollMode
[`ScrollMode.PER_SPREAD`]: https://pspdfkit.com/api/web/PSPDFKit.html#.ScrollMode
[`ScrollMode.CONTINUOUS`]: https://pspdfkit.com/api/web/PSPDFKit.html#.ScrollMode
[`ViewState#layoutMode`]: https://pspdfkit.com/api/web/PSPDFKit.ViewState.html#layoutMode
[`LayoutMode.SINGLE`]: https://pspdfkit.com/api/web/PSPDFKit.html#.LayoutMode
[`LayoutMode.DOUBLE`]: https://pspdfkit.com/api/web/PSPDFKit.html#.LayoutMode
[`LayoutMode.AUTO`]: https://pspdfkit.com/api/web/PSPDFKit.html#.LayoutMode
[`ViewState#pageSpacing`]: https://pspdfkit.com/api/web/PSPDFKit.ViewState.html#pageSpacing
[`ViewState#keepFirstSpreadAsSinglePage`]: https://pspdfkit.com/api/web/PSPDFKit.ViewState.html#keepFirstSpreadAsSinglePage
[`ZoomMode.PAGE_FIT`]: https://pspdfkit.com/api/web/PSPDFKit.html#.ZoomMode
[`ZoomMode.FIT_TO_VIEWPORT`]: https://pspdfkit.com/api/web/PSPDFKit.html#.ZoomMode
[`ZoomMode.PAGE_WIDTH`]: https://pspdfkit.com/api/web/PSPDFKit.html#.ZoomMode
[`ZoomMode.FIT_TO_WIDTH`]: https://pspdfkit.com/api/web/PSPDFKit.html#.ZoomMode
