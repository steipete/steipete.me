---
title: "PSPDFKit 2.2 for Windows"
description: PSPDFKit for the Universal Windows Platform
preview_image: /images/blog/2019/pspdfkit-windows-2-2/header.png
preview_video: /images/blog/2019/pspdfkit-windows-2-2/release.mp4
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2019-06-27 07:00 UTC
tags: Windows, Products, Development
published: true
---

Today we’re shipping PSPDFKit 2.2 for Windows. This release features multithreaded rendering, faster search, general performance improvements, new API, and more!

READMORE

## Multithreaded Rendering

App performance has always been important to both us and our customers, and with this release, our team went to great lengths to further improve our render performance. With PSPDFKit 2.2 for Windows, we are introducing a new system for distributing the overall load of document rendering across multiple CPU cores.

![multithreaded-rendering](/images/blog/2019/pspdfkit-windows-2-2/multithreaded-rendering.png)

While it was always possible to render pages of a document in the background, our updated renderer will now utilize the available CPU cores of a device much better. This allows for simultaneous rendering of multiple pages or parts of a single page. These changes are especially noticeable when scrolling through pages quickly and when zooming. The new system also further reduces blockage of the UI thread, thereby improving overall UI responsiveness in various parts of the framework.

## Faster Search

![faster-search](/images/blog/2019/pspdfkit-windows-2-2/faster-search.png)

We have made our search faster by streaming results page by page as they come in instead of computing the full list and only then displaying it. Responsiveness with medium and large documents is therefore improved, as search results will come in almost immediately when a user searches for a term.

## Improved Performance

![improved-performance](/images/blog/2019/pspdfkit-windows-2-2/improved-performance.png)

With this release the SDK is built with the latest version of Microsoft's compiler and we've tuned the compiler options to produce the fastest possible code that provides an even better experience for your users.

## Scroll Mode

We added methods for getting and setting the current [`ScrollMode`][scroll-mode]:

```csharp
var currentScrollMode = await pdfView.Controller.GetScrollModeAsync();

await pdfView.Controller.SetScrollModeAsync(ScrollMode.PerSpread);
```

## ViewState

You can now set the entire [`ViewState`][view-state] properties with a single function call:

```csharp
await pdfView.Controller.SetViewStateAsync(new ViewState
  {
      CurrentPageIndex = 3,
      LayoutMode = LayoutMode.Double,
      ZoomMode = ZoomMode.FitToViewPort,
      ScrollMode = ScrollMode.PerSpread
  });
```

Along with the `JSON` methods in the [`ViewState`][view-state] class you can use the function for restoring the view state properties from a stored state.

## Final Notes

This release also includes a number of bug fixes and some minor improvements. For a complete list of changes, see the [changelog][changelog].

[catalog]: /api/windows/Catalog/Catalog.html
[view-state]: /api/windows/PSPDFKit/PSPDFKit.UI.Controller.html#PSPDFKit_UI_Controller_SetViewStateAsync_PSPDFKit_UI_ViewState_
[scroll-mode]: /api/windows/PSPDFKit/PSPDFKit.UI.ScrollMode.html
[changelog]: /changelog/windows/#2.2.0
[pspdfkit-windows-sdk]: /pdf-sdk/windows/
