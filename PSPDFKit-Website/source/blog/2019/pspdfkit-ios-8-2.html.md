---
title: "PSPDFKit 8.2 for iOS"
description: Introducing PSPDFKit 8.2 for iOS — featuring an extended and redesigned bookmark UI, updated half modals, and significant performance improvements.
preview_image: /images/blog/2019/pspdfkit-ios-8-2/ios-8-2-header.png
preview_video: /images/blog/2019/pspdfkit-ios-8-2/ios-8-2-header.mp4
section: blog
author:
  - Matej Bukovinski
author_url:
  - https://twitter.com/bukovinski
date: 2019-02-07 08:00 UTC
tags: iOS, Development, Products
published: true
---

Today we’re shipping PSPDFKit 8.2 for iOS. This release includes a new extended bookmark management UI, an updated half modal presentation controller, and some significant performance improvements for multithreaded rendering.

READMORE

## Bookmark UI

PSPDFKit for Web recently gained [support for bookmarks][web-bookmarks], and as a result, we got inspired to take a closer look at the existing bookmark functionality in the iOS framework. After some brainstorming sessions, we managed to come up with a few additions and a fresh new design, both of which improve the usability of the bookmark UI and provide more insight into what the individual bookmarks actually represent.

The redesigned bookmark UI shows a page thumbnail and some contextual text content for every page bookmark. This makes it much easier to identify the target page on the bookmark list. Additionally, the bookmarks now always show their target pages, even if a custom bookmark name is used. If the bookmark represents the currently visible page, then this is marked with a special indicator.

| Old Bookmark UI                                                               | New Bookmark UI                                                          |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| ![Previous Bookmark UI](/images/blog/2019/pspdfkit-ios-8-2/bookmarks-old.png) | ![New Bookmark UI](/images/blog/2019/pspdfkit-ios-8-2/bookmarks-new.png) |

## Half Modal

In compact width size classes, PSPDFKit for iOS uses a special presentation style for the annotation inspector and some other UI elements. This presentation, which we call half modal, enables convenient interaction with various inspectors while keeping the main UI visible as context. This is especially useful if the inspector changes affect the page content, as is the case with the annotation inspector.

This key user interface element has remained unchanged for quite some time now. But we realized there was plenty of space for improvement, so we decided to make this a priority for the next few releases. In version 8.2, we’re starting the push by streamlining user interaction. As a result, it feels more natural to scroll the half modal content and to dismiss the UI completely when we’re done using it. All it takes is a flick. This is just the first step, so stay tuned for more half modal enhancements in the near future.

<video src="/images/blog/2019/pspdfkit-ios-8-2/half-modal.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true" width="60%"></video>

## Multithreaded Rendering

App performance has always been important to both us and our customers, and with this release, our team went to great lengths to improve our renderer performance even more. With PSPDFKit 8.2 for iOS, we are introducing a new system for distributing the overall load of document rendering across multiple CPU cores.

While it was always possible to render pages of a document in the background, our updated renderer will now utilize the available CPU cores of a device much better. This allows for simultaneous rendering of multiple pages or parts of a single page. These changes are especially noticeable when scrolling through pages quickly and when zooming using our built-in UI. The new system also further reduces blockage of the main thread, thereby improving overall UI responsiveness in various parts of the framework.

![Multithreaded Rendering](/images/blog/2019/pspdfkit-ios-8-2/multithreaded-rendering.png)

We’ve been running our new renderer for a couple of weeks in our [PDF Viewer Pro][pdfviewer] apps, which are available on Google Play and the Apple App Store, and we are very happy with the results we’ve seen and the user feedback we’ve received.

## Additional Details

Along with the highlighted features mentioned above, this release includes a long list of other additions, improvements, and fixes. Some changes worth highlighting here are the new support for rotating pages for documents that contain custom annotation providers such as XFDF; improved support for automatic font sizing and the do-not-scroll flag on form fields; and markup annotation improvements, including better alignment with the underlying text. We also added various customization hooks to make it easier to tailor PSPDFKit to your needs; fixed several potential problems with the document password UI; and focused on performance in some other key parts of the framework, such as text preloading and text parsing. For all the details, please check out the [changelog][ios 8.2 changelog].

## End of Life: Support for iOS 10

**PSPDFKit 8.2 for iOS is the last minor version to support iOS 10.** PSPDFKit 8.3 for iOS will raise the deployment target to iOS 11, allowing us to concentrate our development and support efforts.

[pdfviewer]: https://pdfviewer.io
[web-bookmarks]: /blog/2018/pspdfkit-web-2018-6/#bookmarks
[ios 8.2 changelog]: /changelog/ios/#8.2.0
