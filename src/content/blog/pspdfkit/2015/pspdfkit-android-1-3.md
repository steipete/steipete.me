---
title: PSPDFKit 1.3 for Android
pubDate: 2015-08-19T12:00:00.000Z
description: >-
  With version 1.3 for Android, we continue to iterate, while also preparing for
  the big v2 update that will include annotation editing later in September.
  READMORE
tags:
  - pspdfkit
source: pspdfkit.com
AIDescription: true
---


With version 1.3 for Android, we continue to iterate, while also preparing for the big v2 update that will include annotation editing later in September.
READMORE

## Improved Scrolling

Scrolling logic has been completely revamped internally, featuring a greatly improved UI and paving the way for future customizability. The most noticeable difference is the improved continuous scroll mode - pages are now aligned side by side and handled as a whole, meaning you can scroll pages while they are zoomed or see multiple pages at once.

![Improved scrolling](/assets/img/pspdfkit/2015/pspdfkit-android-1-3/new_scroll.gif)

## More Fluid Text Selection

Text selection is now much more fluid – the user can pan and zoom the page while selecting text.

![More Fluid Text Selection](/assets/img/pspdfkit/2015/pspdfkit-android-1-3/fluid_text_selection.gif)

## Content Providers

PSPDFKit can now open content provider URIs directly without copying files to the internal cache. `isOpenableUri` will now return `true` for all URIs that can be opened. We also added a new section in our catalog example to demonstrate that. There's also a new `AssetDataProvider` to allow opening of PDF documents from APK assets directly.

## Improved Error Handling

We've fixed many edge cases related to devices, PDF rendering and invalid files. Overall stability has been improved, and we properly indicate if a PDF file cannot be parsed. We also added several useful log messages for common developer issues so you’ll be able to integrate the SDK faster.

## Annotations

We've added initial support for the most commonly used annotation types: `FreeTextAnnotation`, `UnderlineAnnotation`, `SquigglyAnnotation`, `StrikeoutAnnotation`, `HighlightAnnotation` and `InkAnnotation`. These are still readonly while we're working hard on building an editing interface for v2.

## The Little Things

We added localizations for Finnish and Greek and we've made things more flexible overall. It's now possible to use `PSPDFKitThumbnailBar` inside a custom activity as well. [Check out the changelog for all the gory details.](/changelog/android/)
