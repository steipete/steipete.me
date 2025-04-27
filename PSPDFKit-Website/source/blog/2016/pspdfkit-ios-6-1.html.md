---
title: "PSPDFKit 6.1 for iOS"
description: PSPDFKit 6.1 for iOS, featuring a whole new search interface overhaul, analytics integration and much more.
preview_image: /images/blog/2016/pspdfkit-6-1/v6_1_hero.jpg
section: blog

author:
  - Peter Steinberger
  - Matej Bukovinski
author_url:
  - https://twitter.com/steipete
  - https://twitter.com/bukovinski
date: 2016-11-15 18:00 UTC
tags: iOS, Development, Products
published: true
---

We are proud to announce the immediate availability of PSPDFKit 6.1 for iOS. This release focused heavily on fixing a lot of edge cases that were discovered after releasing [PDF Viewer for iOS on the App Store](https://pdfviewer.io). In addition to that we have also greatly improved the indexed search component and made it work well with Spotlight. The document Search UI got a facelift as well. This version features new a new Analytics API which make it much easier to track events without the need for subclassing. We also improved the image cache to be even faster. Take a look at our [changelog](/changelog/ios/#6.1.0) to read up on all the details.

READMORE

This release now requires Xcode 8.1, which further helps reduce the binary size and increases performance.

## New Search Interface

We optimized and designed a whole new interface for searching inside a document. The new UI is not only nicer looking, it is also simpler and much more intuitive. We have also given you the option to group currently visible pages so their search results are highlighted in a special section at the beginning of the search result list. See the `searchVisiblePagesFirst` property for details.

![Search Interface](/images/blog/2016/pspdfkit-6-1/search_improvements.gif)

## Create Pages from Image

The [Document Editor component](/features/document-editor/ios/) allows you to add/edit/remove and rotate pages. As of PSPDFKit 6.1 for iOS, you can now also create a page from an existing image or by capturing a new image with the camera. This is great for scanning images and makes the document editor even more powerful than before. The page size is automatically adapted to the selected image size, although you can choose whatever page size you want and the image will fit right in.

![New Page from Image](/images/blog/2016/pspdfkit-6-1/new_page_image.gif)

## Analytics Integration

With PSPDFKit 6.1, we created an Analytics API that allows you to capture all common events, such as opening/closing a document, changing pages, creating annotations or performing a search. While this was possible before, the new API makes this much, much simpler and you'll continue to receive more events automatically as we add further extensions. The feature is absolutely optional. Our SDKs will not send data anywhere, unless you configure it to. See our [Security Guidelines](/guides/ios/current/faq/sdk-security/) and [the detailed documentation about Analytics Events](/guides/ios/current/features/analytics/) for details.

## Spotlight Indexing

We have extended the `PSPDFLibrary` component to automatically integrate into Spotlight for easy, system-wide search. See our [documentation on Indexed Full text search (FTS)](/guides/ios/current/features/indexed-full-text-search/) and the `spotlightIndexingType` property for details. Adding Spotlight Indexing required us to make a few API changes around the library component. Compared to the previous API, the new one will make it much easier to integrate full text search into your project and will also help reduce memory usage during indexing - [see our changelog for the API changes](/changelog/ios/#6.1.0).

## Small Fixes and Improvements

We fixed many small and rare bugs, many of which were reported by users of [PDF Viewer for iOS](https://pdfviewer.io). We've improved memory handling, state restoration, toolbar handling, signature handling, bookmark interoperability with Apple Preview, image compression settings, stamp annotation adding, keyboard handling and much much more. There've also been various tweaks to the localizations. Last but not least, we also added the option to pass custom `CIFilter`s, so you can change how a document is being rendered.
