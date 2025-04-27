---
title: "PSPDFKit 6 for Android"
description: PSPDFKit 6 for Android improves on performance and accessibility, auto-expands free text annotations, adds annotation z-index ordering and a new all-in-one fragment, and more.
preview_image: /images/blog/2019/pspdfkit-android-6/android-6-header.png
preview_video: /images/blog/2019/pspdfkit-android-6/android-6-header.mp4
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/Flashmasterdash
date: 2019-9-20 07:00 UTC
tags: Android, Development, Products
published: true
---

Today we’re releasing PSPDFKit 6 for Android, our major SDK update for 2019. Version 6 brings improved performance, better accessibility, auto-expanding free text annotations, annotation z-index ordering, a new all-in-one fragment, and more. As with every major update, we also took some time to improve our APIs and clean up deprecations. This blog post outlines the biggest improvements in this release. For a full list of changes, head over to our [changelog for PSPDFKit 6 for Android][changelog].READMORE

## Document Viewing Performance

![Performance Improvements Illustration](/images/blog/2019/pspdfkit-android-6/performance.png)

With version 6 of PSPDFKit for Android, we continued working on performance — an important topic for all of our 2019 releases. Here’s a summary of the performance improvements that went into PSPDFKit for Android during 2019:

- [Multithreaded rendering][], which achieves greatly improved render times by distributing render work across different cores of a CPU.
- [Smaller native binaries][], resulting in overall better performance and reduced memory and disk space requirement.
- [Startup time improvements][performance improvements], lazy loading of most of our UI components, better view recycling, and much more.

PSPDFKit 6 for Android continues on that front by tweaking performance in multiple areas: Almost all major UI components inside `PdfActivity` are now lazy loaded. This results in shorter initialization times and jank-free startup of the PDF activity inside all apps. Our internal page-recycling logic has been fine-tuned to reduce pauses from garbage collection while browsing documents, resulting in a fast and lag-free PDF reading experience.

In addition, our team is already evaluating additional ways to focus on improving performance during the remainder of 2019.

## Accessibility Improvements

![Accessibility Improvements Illustration](/images/blog/2019/pspdfkit-android-6/accessibility.png)

With PSPDFKit 6 for Android, our team kicked off another important project, which has a goal of improving accessibility of our framework even more. We focused on making tab-based navigation better throughout our entire user interface, ensuring that keyboard-based navigation between visible UI elements is intuitive and simple. Furthermore, the accessibility improvements that went into this release directly impact usability with accessibility services like Google TalkBack.

## Auto-Expanding Free Text Annotation

In this release, we improved upon our existing free text annotation tool by adding auto-sizing capabilities for use while creating and editing free text annotations.

<video src="/images/blog/2019/pspdfkit-android-6/automated-free-text-resizing.mp4"
  poster="/images/blog/2019/pspdfkit-android-6/automated-free-text-resizing.png"
  width="100%"
  data-controller="video"
  data-video-autoplay="true"
  controls
  playsinline
  loop
  muted>
</video>

By default, free text annotations will now automatically resize to fit their contents. For use cases where this behavior is not desired, it is possible to override the default sizing strategy using the new [`setHorizontalResizingEnabled()`][horizontal resizing] and [`setVerticalResizingEnabled()`][vertical resizing] methods on [`FreeTextAnnotationConfiguration.Builder`][freetextannotationconfiguration.builder].

## Annotation Z-Index Ordering

We added the ability for users to change the order in which annotations are stacked on the page. So, for example, if an ink stroke is behind a stamp annotation, the user can change the order so that the ink stroke will be on top of the stamp. This functionality is available from the edit mode in the annotation list.

<video src="/images/blog/2019/pspdfkit-android-6/z-index-annotation-list.mp4"
  poster="/images/blog/2019/pspdfkit-android-6/z-index-annotation-list.png"
  width="100%"
  data-controller="video"
  data-video-autoplay="true"
  controls
  playsinline
  loop
  muted>
</video>

When there are multiple annotations on a page, the annotation inspector now includes buttons to move an annotation forward, backward, to the front, or to the back.

<video src="/images/blog/2019/pspdfkit-android-6/z-index-inspector.mp4"
  poster="/images/blog/2019/pspdfkit-android-6/z-index-inspector.png"
  width="100%"
  data-controller="video"
  data-video-autoplay="true"
  controls
  playsinline
  loop
  muted>
</video>

The order can be set programmatically using the new [`AnnotationProvider`][] methods [`addAnnotationToPage(Annotation, int)`][add annotation to page] and [`moveAnnotation(Annotation, int)`][move annotation]. Changing the order in the UI can be disabled using the new [`isAnnotationListReorderingEnabled`][annotation list reordering] property on [`PdfActivityConfiguration.Builder`][].

## PdfUiFragment

With PSPDFKit 6 for Android, we’re rolling out our new [`PdfUiFragment`][], which blends the capabilities of our existing `PdfActivity` and `PdfFragment`. The new [`PdfUiFragment`][] can be added to any `AppCompatActivity` and delivers the same UI implemented by the default `PdfActivity` (including all views, like the toolbars, thumbnail bar, and annotation list). This greatly simplifies implementing PSPDFKit for cases where a fragment has to be used, since it is no longer necessary to manually add all supportive view components to the hosting activity.

The fragment can be added to an existing activity just like any other fragment:

```kotlin
// Create the `PdfUiFragment` using its builder API.
pdfUiFragment = PdfUiFragmentBuilder.fromUri(context, uri)
    .configuration(config)
    .build()

// Add it to the activity like any other fragment.
supportFragmentManager
  .beginTransaction()
  .add(R.id.fragmentContainer, pdfUiFragment, "pdfUiFragment")
  .commit()
```

To learn more about [`PdfUiFragment`][], have a look at our new `PdfUiFragmentExampleActivity`, which demonstrates how to add the fragment to your app.

## And More

- PSPDFKit Instant was merged into the PSPDFKit AAR. There’s now only a single universal AAR file for PSPDFKit and Instant. If you are using PSPDFKit Instant in your app, check out our [migration guide][], which explains how to update to the newest version.
- The internal framework sources and build scripts have been reworked for dexing and optimizations through D8 and R8.
- PSPDFKit 6 for Android was built using the latest version of the Android Gradle Plugin 3.5.0, and all example project sources are using this stable version too.

As always, this is just a sneak peek of the enhancements we added to this release. To see a complete list of changes, check out the [PSPDFKit 6 for Android changelog][changelog].

[migration guide]: /guides/android/current/migration-guides/pspdfkit-6-migration-guide/
[changelog]: /changelog/android/#6.0.0
[multithreaded rendering]: /blog/2019/pspdfkit-android-5-2/#multithreaded-rendering
[smaller native binaries]: /blog/2019/pspdfkit-android-5-2/#smaller-native-binaries
[performance improvements]: /blog/2019/pspdfkit-android-5-3/#performance-improvements
[horizontal resizing]: /api/android/reference/com/pspdfkit/annotations/configuration/AnnotationTextResizingConfiguration.Builder.html#setHorizontalResizingEnabled(boolean)
[vertical resizing]: /api/android/reference/com/pspdfkit/annotations/configuration/AnnotationTextResizingConfiguration.Builder.html#setVerticalResizingEnabled(boolean)
[freetextannotationconfiguration.builder]: /api/android/reference/com/pspdfkit/annotations/configuration/FreeTextAnnotationConfiguration.Builder.html
[add annotation to page]: /api/android/reference/com/pspdfkit/annotations/AnnotationProvider.html#addAnnotationToPage(com.pspdfkit.annotations.Annotation,%20int)
[move annotation]: /api/android/reference/com/pspdfkit/annotations/AnnotationProvider.html#moveAnnotation(int,%20int,%20int)
[annotation list reordering]: /api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.html#isAnnotationListReorderingEnabled()
[`annotationprovider`]: /api/android/reference/com/pspdfkit/annotations/AnnotationProvider.html
[`pdfactivityconfiguration.builder`]: /api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html
[`pdfuifragment`]: /api/android/reference/com/pspdfkit/ui/PdfUiFragment.html
