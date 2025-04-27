---
title: "PSPDFKit 6.2 for Android"
description: Introducing PSPDFKit 6.2 for Android — with HTML-to-PDF conversion and several improvements to code structure and documentation.
preview_image: /images/blog/2020/pspdfkit-android-6-2/android-6-2-header.png
preview_video: /images/blog/2020/pspdfkit-android-6-2/android-6-2-header.mp4
section: blog
author:
  - David Schreiber-Ranner
  - Tomáš Šurín
author_url:
  - https://twitter.com/Flashmasterdash
  - https://twitter.com/tomassurin
date: 2020-02-20 12:00 UTC
tags: Android, Development, Products
published: true
secret: false
---

Today we’re releasing PSPDFKit 6.2 for Android, which features a new HTML-to-PDF conversion API, as well as several improvements to the quality of our APIs and documentation. In this blog post, we outline the biggest changes of 6.2. For a full list of changes, please refer to our [PSPDFKit 6.2 for Android changelog][changelog].

## HTML-to-PDF Conversion

Many use cases require apps to be able to generate PDF files. Examples of this are invoices and flight tickets, which are usually generated from styled HTML templates.

This generation can be handled on a remote server, but on-device conversion is required in some applications — for example, when working with sensitive data. Because of this, we’re introducing a complete API for converting HTML pages to PDFs.

This feature includes convenient APIs for converting HTML files from HTML strings and local or even remote URIs. Since we use the full Chromium HTML engine underneath, even complex HTML documents are supported. This translates to support for all widely used HTML features such as CSS, JavaScript, embedded images, and much more.

You can read more about this feature and see code examples in our [guides][html conversion guide].

## “Getting Started” Guide Improvements

We have reconsidered our onboarding process for new and potential customers and decided to make the experience simpler, more precise, and easier all around. We adapted our guides so that the clutter is removed and there are less steps involved in getting an up-and-running PSPDFKit framework.

We moved all the articles that we believe are unnecessary for the introduction to our framework, and we gave our users only the most important information they need when setting up a project — whether they just want to see the framework in action or incorporate it in their own project.

We are constantly reiterating on this, and we want to provide better guides for other sections as well. We decided to step back a bit and think about our guides from the user’s perspective to understand all of the things we could improve and make clearer and easier to understand. Also, we believe that the guides should be intuitive to navigate. These changes are a first step in that direction, and we will keep on improving this experience in upcoming versions.

## Better API Reference

As part of our effort to improve the experience of people just getting started with PSPDFKit, we also improved our API reference. We have reworked the search field so not just classes, but also methods and constants, can be found.

<video src="/images/blog/2020/pspdfkit-android-6-2/new-api-search.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Better Performance

We continued our performance optimization work with this release, tweaking things in multiple areas:

- Our rendering scheduler has been fine-tuned to make sure that visible pages are rendered first. Additionally, annotation overlay initialization time has been optimized, which results in faster page display when browsing documents.
- We reworked how shape annotations are displayed in the annotation overlay. This makes for a much smoother jank-free zooming on pages that contain these annotations.

But that’s not all we have planned in regard to performance optimization; we will continue working in this area and we’ll keep it our priority for 2020.

## Internal Package Renaming

In an effort to improve our publicly facing APIs, we renamed our internal API package from `com.pspdfkit.framework` to `com.pspdfkit.internal`. This change follows the introduction of our [linter warning when using internal APIs][private api linter rule], which was part of PSPDFKit 6.1 for Android.

With these changes, we strive to provide a clearer separation of our public APIs from our private APIs, and ultimately a better experience for developers integrating PSPDFKit into their apps.

If you are using internal PSPDFKit APIs, we recommend switching to a [public API alternative][api docs]. If you can’t find a suitable substitute, please reach out to our [customer support team][support].

## And More

- We unified naming of our annotation tools across all our products on all platforms. See #22839 in our [changelog][] for the list of changes.
- We introduced handling for missing annotation fonts, and we now clearly state that the font is not supported in the font picker inside the annotation inspector.
- We changed our custom bottom sheet implementation used by the annotation inspector to instead use an [implementation][bottom sheets docs] from the Material Components library. We’ve also simplified inspector behavior to make it predictable. These changes make for smoother animations and are consistent with bottom sheets used by the Android system and most modern Android apps.

As always, this is just a sneak peek at the enhancements we added to this release. To see a complete list of changes, check out the [PSPDFKit 6.2 for Android changelog][changelog].

[private api linter rule]: /guides/android/current/announcements/unsupported-internal-symbols
[migration guide]: /guides/android/current/migration-guides/pspdfkit-6-2-migration-guide/
[changelog]: /changelog/android/#6.2.0
[support]: https://pspdfkit.com/support/request/
[api docs]: https://pspdfkit.com/api/android/reference/packages.html
[html conversion guide]: /guides/android/current/generating-pdfs/generating-pdf-from-html/
[bottom sheets docs]: https://material.io/develop/android/components/bottom-sheet-behavior/
