---
title: "PSPDFKit 8 for iOS"
description: Introducing PSPDFKit 8 for iOS. Featuring new redaction and comparison components, an overhauled sharing UI, and full iOS 12 and Xcode 10 support.
preview_image: /images/blog/2018/pspdfkit-ios-8-0/ios-8-0-header.png
preview_video: /images/blog/2018/pspdfkit-ios-8-0/ios-8-0-header.mp4
section: blog
author:
  - Matej Bukovinski
author_url:
  - https://twitter.com/bukovinski
date: 2018-10-17 08:00 UTC
tags: iOS, Development, Products
published: true
---

Today we’re introducing PSPDFKit 8 for iOS, our new major SDK version. Version 8 features new [Redaction][redaction landing page] and [Comparison][comparison landing page] components, an overhauled sharing flow, normalized page transforms, and many other smaller improvements and fixes. PSPDFKit 8 is built with Xcode 10 and fully supports the newly released iOS 12. It also retains support for iOS 10 and 11. To make it easier to quickly transition to the new version, we also wrote a [migration guide][] that covers all major API and behavioral changes in this version.

READMORE

## Redaction

The highlight feature of this release is our added support for PDF text redaction. This was heavily requested, and we’re happy to finally be able to provide it to our customers in the form of a new PSPDFKit component. The component will allow you to securely and irrecoverably remove sensitive text content from your PDF. Redaction in PDF is a two-step process that involves first marking up the content you want to remove with redaction annotations and then processing the PDF in a way that permanently removes the marked-up text. PSPDFKit makes this process easy by offering a prebuilt UI for both of these steps as well as a model-level API for both creating and committing redaction annotations. Please check out the [Redaction guide article][redaction guide] to learn more about the component, how to customize it, and how to integrate it into your project.

Redaction is a new PSPDFKit component. Please [contact our sales team][support contact] if you are interested in adding it to your license.

<video src="/images/blog/2018/pspdfkit-ios-8-0/redaction.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Comparison

The second component we’re introducing in this version is Comparison, which is tailor-made for construction plans and other vector-based documents and maps. The component works on single-page PDFs and unlocks additional `PSPDFProcessor` APIs that allow you to recolor and merge PDF pages with different blend modes. This is perfect for showcasing changes to PDF pages that mostly involve the addition or removal of graphic elements. Our Catalog example project contains a new dedicated example, `ComparisonExample.swift`, which shows how you can use the new processor API to quickly build a PDF comparison view.

Comparison is a new PSPDFKit component. Please [contact our sales team][support contact] if you are interested in adding it to your license.

<video src="/images/blog/2018/pspdfkit-ios-8-0/comparison.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Magic Ink

With the new Magic Ink tool, you can make freehand drawings just like with the regular ink tool, but it also recognizes and cleans up common shapes like arrows and circles. We’re really excited about how this tool makes annotating documents more convenient, because you don’t need to switch tools as often. It’s a great complement to our existing first-class support for Apple Pencil. Please check out the [Magic Ink guide article][magic ink guide] to learn more about this new feature.

<video src="/images/blog/2018/pspdfkit-ios-8-0/magic-ink.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Sharing Flow

The share action, which is meant to send a document to another person or app, received a major overhaul in PSPDFKit 8 for iOS with the goal of unifying and simplifying the sharing flow. Until now, invoking the share action in PSPDFKit directly presented the share sheet. We then intercepted certain share actions and injected our export options UI to perform document customizations. This had two major downsides: It required a lot of custom code, since PSPDFKit had to take over completing the share actions, and even more importantly, it was something we could only do for certain system-provided actions. As a consequence of this, we could not provide export options for any third-party share extensions. In PSPDFKit 8 for iOS, we now show a new, refined, export UI first, before showing the share sheet. With this change, the export options can be applied in all cases, regardless of what the final share destination is. The change also allowed us to remove our sharing coordination and simplify our API. Please check out the [migration guide][] for more details.

![Sharing Flow](/images/blog/2018/pspdfkit-ios-8-0/sharing.png)

## Normalized Page Transforms

The page coordinate system of a PDF can be offset due to a crop box or rotated due to the page being rotated. This makes sense in the PDF because it means rotating a page is just setting a value; you don’t need to change the content stream or any of the annotations on the page. However, this can also be confusing to work with. To date, PSPDFKit for iOS has exposed this detail via its API, while the newer PSPDFKit for Android and Web SDKs expose a normalized coordinate system where the origin of the coordinate system is always in a consistent corner of the onscreen page. With version 8, PSPDFKit for iOS now also adopts this normalization. If your integration had to explicitly deal with the page coordinate system, you might have to adjust your code for this change, but good news: In most cases, it will just mean you have to delete some code. Please consult the [migration guide][] for more details.

## Instant Images

With this new version, our iOS [Instant framework][instant] gained the ability to manage large assets. This enabled us to add support for image annotations to Instant. Image data is uploaded and downloaded in the background, separately from other annotation properties that are part of the regular Instant JSON. Be sure to also update to the latest version of PSPDFKit Server to take advantage of this new functionality.

## iOS 12

This year’s iOS update focused mostly on refinements and performance improvements. On the API side, not much changed for developers. This meant we could adopt iOS 12 relatively quickly during the beta phase, and we already fixed the majority of regressions that occurred with 7.7.x patch releases. Despite this, we recommend you upgrade to version 8 as soon as you can, as it’s the first binary version that is built with the production version of Xcode 10.

## More Details

In addition to the changes covered above, we also made several improvements to Instant JSON and signing via `PSPDFSigner`. We also focused on improving support for dynamic type and accessibility throughout the framework. The settings UI received a slight visual refresh, a new spread fitting option, and customizations for image documents. We also added a set of new examples to PSPDFKit Catalog.

PSPDFKit 8 for iOS drops all API calls that have been deprecated thus far in order to clean up our headers and implementation files. If you are still using any legacy API, you can refer to the [migration guide][] for appropriate migration strategies.

To see a complete list of changes, check out the [PSPDFKit 8 for iOS changelog][ios 8 changelog].

[ios 8 changelog]: /changelog/ios/#8.0.0
[migration guide]: /guides/ios/current/migration-guides/pspdfkit-80-migration-guide/
[magic ink guide]: /guides/ios/current/annotations/magic-ink/
[redaction guide]: /guides/ios/current/features/redaction/
[support contact]: /support/request/
[instant]: /instant/
[redaction landing page]: /pdf-sdk/redaction/
[comparison landing page]: /pdf-sdk/comparison/
