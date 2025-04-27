---
title: "PSPDFKit 5 for Android"
description: "Introducing PSPDFKit 5 for Android — featuring the new Redaction and Comparison components, many improvements to existing APIs, and full support for Android 9 Pie."
preview_image: /images/blog/2018/pspdfkit-android-5/android-5-header.png
preview_video: /images/blog/2018/pspdfkit-android-5/android-5-header.mp4
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/Flashmasterdash
date: 2018-11-07 12:00 UTC
tags: Android, Development, Products
published: true
---

Today we’re launching PSPDFKit 5 for Android, our newest major version of PSPDFKit. This release features new [Redaction][redaction landing page] and [Comparison][comparison landing page] components, full support for Android 9 Pie, and many improvements to existing features and APIs. This blog post outlines the biggest improvements in this release. For a full list of changes, head over to our [changelog for PSPDFKit 5 for Android][changelog].

READMORE

## Redaction

Redacting is the process of permanently removing sensitive content of a PDF in a way that is irreversible and also non-reconstructible using any kind of tools. With PSPDFKit 5 for Android, we’re launching our first wave of tools as part of our new Redaction component: text redaction, and a set of convenient new UI components and APIs to work with.

Redacting content in a PDF is a two-step process: First, you mark up the content that should be removed. At this point, all markers are pending, are non-destructive, and serve as placeholders for the final redaction. Once all content is marked up, the document is processed in a way that permanently removes redacted areas. PSPDFKit makes redacting workflows effortless by offering prebuilt UIs for redacting, reviewing redactions, and applying pending redactions. These UI components are built on top of a well-defined model-level API, which gives you the flexibility to implement virtually any redaction use case needed. Please check out the [Redaction guide article][redaction guide] to learn more about the component, how to customize it, and how to integrate it into your project.

Redaction is a new PSPDFKit component. Please [contact our sales team][support contact] if you are interested in adding it to your license.

<a href="/pdf-sdk/redaction/#android">
<video src="/images/blog/2018/pspdfkit-android-5/redaction.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>
</a>

## Comparison

The second component we’re introducing in this version is Comparison, which is tailor-made for construction plans and other vector-based documents and maps. This component works on single-page PDFs and unlocks additional `PSPDFProcessor` APIs that allow you to recolor and merge PDF pages with different blend modes. This is perfect for showcasing changes to PDF pages that mostly involve the addition or removal of graphic elements. Our Catalog app contains a new dedicated example, `DocumentComparisonExample`, which shows how you can use the new processor API to quickly build a PDF comparison view.

Comparison is a new PSPDFKit component. Please [contact our sales team][support contact] if you are interested in adding it to your license.

<a href="/pdf-sdk/comparison/#android">
<video src="/images/blog/2018/pspdfkit-android-5/comparison.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>
</a>

## Android 9 Support

For PSPDFKit 5 for Android and upcoming releases, one of our goals was to ensure compatibility with all devices running Android 4.4 KitKat up to Android 9. For that, we bumped the `targetSdkVersion` of our framework to `28` while still ensuring that we behave as expected on older devices or within apps that are targeting SDK versions earlier than `28`. PSPDFKit 5 for Android also uses the latest Android support library version, `28.0.0`, and it maintains full compatibility with the new [AndroidX libraries of the Android Jetpack][androidx] and the automated migration using Jetifier.

For all of this to work, we took time migrating our entire build chain to the latest Gradle 4.10.2 and the Android Gradle Plugin 3.2 (we’re already working on great new features for the upcoming 3.3 version too). Additionally, we updated all of our examples to these versions. We also took the chance to add support for the latest Java 8 language features, which enables our team to write code that is even more expressive and maintainable than before. We made sure to document the required steps for [enabling Java 8 in your app][java 8 update] while upgrading to PSPDFKit 5 for Android.

## API Improvements

At PSPDFKit, we know the value of intuitive APIs that prevent misuse through safe designs. As such, when developing PSPDFKit 5 for Android, we focused on improving our public APIs to be easier and safer to use. We reimplemented several of our existing APIs, like `PdfDocument`, the `FormProvider` API, and the `BookmarkProvider`, all of which are now exposed using interfaces instead of classes. This yields a cleaner API, better code completion, and higher usability and satisfaction. Please have a look at the [migration guide][] for a comprehensive list of API changes and necessary migration steps.

We also hardened our public APIs, which now consistently perform eager null checks on all public input parameters that are marked with `@NonNull`. Our updated APIs now fail early and expressively when being used the wrong way.

Furthermore, PSPDFKit 5 for Android removes all previously deprecated APIs, including the no-longer used `EventBus`. If you are still using any legacy API, you can refer to the [migration guide][] for appropriate migration strategies.

As always, this is just a glimpse of some of the enhancements we added to this release. To see a complete list of changes, check out the [PSPDFKit 5 for Android changelog][changelog].

[changelog]: /changelog/android/#5.0.0
[migration guide]: /guides/android/current/migration-guides/pspdfkit-5-migration-guide/
[redaction guide]: /guides/android/current/features/redaction/
[support contact]: /support/request/
[instant]: /instant/
[redaction landing page]: /pdf-sdk/redaction/#android
[comparison landing page]: /pdf-sdk/comparison/#android
[androidx]: https://developer.android.com/jetpack/androidx/

[java 8 update]: /guides/android/current/faq/java-8
