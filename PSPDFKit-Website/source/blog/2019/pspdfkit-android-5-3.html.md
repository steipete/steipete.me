---
title: "PSPDFKit 5.3 for Android"
description: "Introducing PSPDFKit 5.3 for Android — featuring improved ink annotation tools, custom annotation data support, performance improvements, and much more."
preview_image: /images/blog/2019/pspdfkit-android-5-3/android-5-3-header.png
preview_video: /images/blog/2019/pspdfkit-android-5-3/android-5-3-header.mp4
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/Flashmasterdash
date: 2019-03-26 8:00 UTC
tags: Android, Development, Products
published: true
---

Today we’re launching PSPDFKit 5.3 for Android! In this release, we focused on performance, improved usability for our ink annotation tools, and support for custom data in annotations. READMORE
This blog post outlines the biggest improvements in this release. For a full list of changes, head over to our [changelog for PSPDFKit 5.3 for Android][changelog].

## Ink Tool Improvements

Ink annotations and the tools for creating them have been part of PSPDFKit for Android for a long time. Since first introducing ink annotation creation with PSPDFKit 2 for Android in 2015, we have added many useful features that help when working with ink annotations. These include the annotation inspector, alpha support, the ink eraser, and ink signatures — to name just a few.

With this version, we’re improving on ink annotations yet again by introducing two major features: Magic Ink, and an automated annotation aggregation strategy.

### Magic Ink

![Magic Ink](/images/blog/2019/pspdfkit-android-5-3/magic-ink.png)

With Magic Ink, annotating your documents in a clean way becomes easier than ever before. Magic Ink is a second ink pen that sits inside the annotation toolbar, and it can detect and transform shapes that you draw onto a document.

Magic Ink uses a probability-driven shape detection algorithm that recognizes circle, square, line, and arrow annotations, and it is powered by a pretrained template model that comes prepackaged with PSPDFKit. If you want to learn more about Magic Ink and how you can configure it in your project, check out our [Magic Ink guides][magic ink].

<video src="/images/blog/2019/pspdfkit-android-5-3/magic-ink.mp4"
  poster="/images/blog/2019/pspdfkit-android-5-3/magic-ink-poster.png"
  width="100%"
  data-controller="video"
  data-video-autoplay="true"
  controls
  playsinline
  loop
  muted>
</video>

### Automated Annotation Aggregation Strategy

More often than not, professionals across various industries end up reviewing, annotating, and marking up entire pages of a document in a single run. This means that all ink strokes drawn onto a single page while not changing the ink color or line thickness are merged together into a single ink annotation. While this does not matter while annotating or erasing, it makes subsequent editing work more difficult.

The new automated annotation aggregation strategy plays into editors’ hands by making this process easier and more effective than ever. It uses a heuristic based on timing and distance to determine whether ink strokes belong together in a single ink annotation or should be split into separate annotations. Now users can make multiple annotations on a page and the algorithm will be able to tell them apart.

<video src="/images/blog/2019/pspdfkit-android-5-3/smart-splitting.mp4"
  poster="/images/blog/2019/pspdfkit-android-5-3/smart-splitting-poster.png"
  width="100%"
  data-controller="video"
  data-video-autoplay="true"
  controls
  playsinline
  loop
  muted>
</video>

Automated splitting of ink annotations is the new default behavior in PSPDFKit 5.3 for Android. You can learn more about this feature and how to configure it for your project in our [Annotation Aggregation Strategy guide][annotation aggregation guide].

## Performance Improvements

![Performance Improvements](/images/blog/2019/pspdfkit-android-5-3/android-5.3-performance.png)

As our SDK is available on millions of end user devices, performance is an important factor for both us and our customers. That’s why, with PSPDFKit 5.3 for Android, we focused on improving performance in all areas of the framework.

Our team performed extensive analysis of our entire codebase (including our example projects) and focused on speeding up app startup duration, document loading times, UI performance, render speeds, and more. The majority of enhancements that went into this release have a direct impact on the performance of all apps integrating and using PSPDFKit for Android. In the future, we will continue with our efforts to make PSPDFKit even more performant.

## Custom Annotation Data

[![Custom Annotation Data](/images/blog/2019/pspdfkit-android-5-3/custom-annotation-data.png)][custom data]

The PDF specification defines the standard set of annotation properties that PDF software should be able to handle. Moreover, it defines the underlying data structures that describe those properties inside the PDF file itself. Up until now, when developers wanted to access these data structures for their own use cases that went beyond what standard PDF features would allow, it was complicated and time-consuming.

Starting with PSPDFKit 5.3, we’re enabling developers to implement their custom use cases on top of annotations by using a convenient API for storing arbitrary data inside annotations. With the new [`setCustomData()`][`annotation#setcustomdata()`] and [`getCustomData()`][`annotation#getcustomdata()`] methods on [`Annotation`][], you can write and retrieve [`JSONObject`][] instances on all annotations of your document:

```kotlin
// You can use arbitrarily structured JSON as your custom data.
val restaurantInfo = JSONObject()
    .put("name", "Grill House")
    .put("locations", JSONArray(listOf("Vienna", "Paris", "New York")))
    .put("rating", 5)
    .put("verified", true)

// Simply set your custom data on any annotation.
annotation.customData = restaurantInfo
```

PSPDFKit will take over serialization of your data and write it into the document upon saving. You can learn more about this feature in our [custom annotation data guide][custom data].

## And More

- With PSPDFKit 5.3, we enhanced our ink annotation hit detection by implementing proximity-based hit detection on lines (in contrast to the previous bounding box-based hit detection), which allows for more intuitive selection of overlapping ink annotations.

- We added a `coverMode` option that can be used in [multimedia annotation URLs][multimedia annotations] to define how video annotations should be displayed on a page before they begin their playback.

As always, this is just a sneak peek of the enhancements we added to this release. To see a complete list of changes, check out the [PSPDFKit 5.3 for Android changelog][changelog].

[pdfviewer]: https://pdfviewer.io
[changelog]: /changelog/android/#5.3.0
[migration guide]: /guides/android/current/migration-guides/pspdfkit-5-3-migration-guide
[magic ink]: /guides/android/current/annotations/magic-ink
[annotation aggregation guide]: /guides/android/5.3/annotations/annotation-defaults#ink-aggregation-strategy
[custom data]: /guides/android/current/annotations/custom-data-in-annotations/
[multimedia annotations]: /guides/android/current/annotations/multimedia-annotations/#available-video-playback-options
[`annotation`]: /api/android/reference/com/pspdfkit/annotations/Annotation.html
[`annotation#setcustomdata()`]: /api/android/reference/com/pspdfkit/annotations/Annotation.html#setCustomData(org.json.JSONObject)
[`annotation#getcustomdata()`]: /api/android/reference/com/pspdfkit/annotations/Annotation.html#getCustomData()
[`jsonobject`]: https://developer.android.com/reference/org/json/JSONObject
