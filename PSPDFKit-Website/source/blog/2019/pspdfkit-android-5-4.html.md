---
title: "PSPDFKit 5.4 for Android"
description: "Introducing PSPDFKit 5.4 for Android — featuring sound annotations, cloudy borders, a new color picker, a magnifier widget, and much more."
preview_image: /images/blog/2019/pspdfkit-android-5-4/android-5-4-header.png
preview_video: /images/blog/2019/pspdfkit-android-5-4/android-5-4-header.mp4
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/Flashmasterdash
date: 2019-05-23 12:00 UTC
tags: Android, Development, Products
published: true
---

Today we’re launching PSPDFKit 5.4 for Android! This release comes packed with many new features, including support for sound annotation recording and playback, a page magnifier widget, annotation tool variants, a greatly enhanced color picker, cloudy annotation borders, a redesigned bookmarks list, and more. READMORE This blog post outlines the biggest improvements in this release. For a full list of changes, head over to our [changelog for PSPDFKit 5.4 for Android][changelog].

## Sound Annotations

With sound annotations, it’s possible to add audio files directly to a document so that they’re stored inside the PDF file. PSPDFKit 5.4 for Android supports playback for sound annotations and recording of new annotations using a device’s microphone. We added a convenient [`SoundAnnotation`][] class that makes programmatic access to sound annotations easy and comfortable.

![Sound Annotations](/images/blog/2019/pspdfkit-android-5-4/sound-annotations.png)

The recording of sound annotations is enabled by default, but you can disable this by removing [`AnnotationTool.SOUND`][annotationtool sound] from [`enabledAnnotationTools()`][enabledannotationtools] inside your [`PdfConfiguration`][pdfconfiguration].

## Magnifier Widget

Similar to the recently introduced Android magnifier widget in Android 9.0 Pie, PSPDFKit 5.4 for Android comes with its own handy magnifier widget that magnifies the area covered by a finger while selecting text on a page. This new widget is accompanied by improvements to our internal text selection algorithms, making text selection in PSPDFKit 5.4 for Android even more accurate and fun to use.

![Magnifier widget](/images/blog/2019/pspdfkit-android-5-4/magnifier.png)

The new magnifier widget works out of the box on all supported devices running API 19 and newer. On Android 9.0 Pie and newer, PSPDFKit will automatically fall over to the platform magnifier widget, to provide the best possible experience on all devices.

## Annotation Tool Variants

With annotation tool variants, we’re adding another feature for building more intuitive UIs for various use cases. Annotation tool variants allow developers to define multiple instances of an annotation tool with different configurations. Out of the box, PSPDFKit 5.4 for Android comes with predefined variants for an ink pen and an ink highlighter (both based on the ink annotation tool), as well as a line tool and a new arrow variant.

<video src="/images/blog/2019/pspdfkit-android-5-4/annotation-tool-variants.mp4"
  poster="/images/blog/2019/pspdfkit-android-5-4/annotation-tool-variants.png"
  width="100%"
  data-controller="video"
  data-video-autoplay="true"
  controls
  playsinline
  loop
  muted>
</video>

Adding and using annotation tool variants is straightforward thanks to our new public APIs:

```kotlin
// PSPDFKit ships with several default variants, like the ink highlighter.
val highlighter = AnnotationToolVariant.fromPreset(Preset.HIGHLIGHTER)
fragment.enterAnnotationCreationMode(AnnotationTool.INK, highlighter)

// You can simply add new variants using custom configurations and names.
val redArrow = AnnotationToolVariant.fromName("red_arrow")
fragment.annotationConfiguration
    .put(
        AnnotationTool.LINE,
        redArrow,
        LineAnnotationConfiguration.builder(context)
            .setDefaultLineEnds(Pair.create(NONE, CLOSED_ARROW))
            .setDefaultColor(Color.RED)
            .build()
    )
fragment.enterAnnotationCreationMode(AnnotationTool.LINE, redArrow)
```

Check out our new `CustomAnnotationCreationToolbarExample` inside the Catalog for a full tour of the new APIs.

## New Color Picker

PSPDFKit 5.4 for Android comes with a new color picker that supports a larger palette of predefined colors, recently used colors, a dynamic list of color variants based on the currently selected color, and custom colors from HEX values, HSL values, and RGB values.

<video src="/images/blog/2019/pspdfkit-android-5-4/color-picker.mp4"
  poster="/images/blog/2019/pspdfkit-android-5-4/color-picker-poster.png"
  width="100%"
  data-controller="video"
  data-video-autoplay="true"
  controls
  playsinline
  loop
  muted>
</video>

The color picker is used by default for all color annotation properties, but it can be replaced by the old simple palette using the annotation configuration:

```kotlin
// This will configure to use the old color picker palette view for ink annotations.
fragment.annotationConfiguration.put(
    AnnotationTool.INK,
    AnnotationToolVariant.fromPreset(AnnotationToolVariant.Preset.PEN),
    InkAnnotationConfiguration.builder(this)
        // This defaults to `true`. By setting it to `false`
        // the old palette view will be used.
        .setCustomColorPickerEnabled(false)
        .build()
)
```

## Cloudy Borders

With cloudy borders, PSPDFKit 5.4 for Android delivers a new annotation border style that is especially useful for annotating large construction plans or schematic drawings. Whereas border styles using straight lines often go unnoticed on PDF documents with complex drawings, cloudy borders are easy to make out and read.

<video src="/images/blog/2019/pspdfkit-android-5-4/cloudy-border.mp4"
  poster="/images/blog/2019/pspdfkit-android-5-4/cloudy-border-poster.png"
  width="100%"
  data-controller="video"
  data-video-autoplay="true"
  controls
  playsinline
  loop
  muted>
</video>

Cloudy borders can be used for square, circle, and polygon annotations, and they can also be created programmatically:

```kotlin
val pageRect = RectF(100f, 900f, 320f, 850f)
val squareAnnotation = SquareAnnotation(pageIndex, pageRect).apply {
    color = Color.RED
    // There's a new border effect property on annotations that can be
    // used to enable cloudy borders on line-based annotations.
    borderEffect = BorderEffect.CLOUDY

    // The border effect intensity defines the diameter of the cloudy border arcs.
    borderEffectIntensity = 3f
}
addAnnotationToDocument(squareAnnotation)
```

## Redesigned Bookmarks List

For PSPDFKit 5.4 for Android, we redesigned the existing bookmarks list and gave it a fresh material design look and feel. We focused on improving the usability by adding cover renderings and extracted text snippets to each bookmark item, thereby making them easier to recognize and the bookmark list easier to scan.

![Bookmarks List](/images/blog/2019/pspdfkit-android-5-4/bookmarks-list.png)

## And More

- We upgraded our builds to Android Studio/Android Gradle Plugin 3.4.1 and Gradle 5.4.1. This change also trickles down to our examples, which use the same versions.

- We improved performance of page scrolling, page view recycling, our tiled renderer, and scroll interpolators. The result is snappier and smoother document scroll behavior while you’re browsing documents.

- We introduced a much leaner API for configuring annotation defaults on top of the `AnnotationDefaultsProvider`. Check out our new [Annotation Configuration guide][annotation configuration guide] to learn more about this API.

As always, this is just a sneak peek of the enhancements we added to this release. To see a complete list of changes, check out the [PSPDFKit 5.4 for Android changelog][changelog].

[pdfviewer]: https://pdfviewer.io
[changelog]: /changelog/android/#5.4.0
[migration guide]: /guides/android/current/migration-guides/pspdfkit-5-4-migration-guide
[`soundannotation`]: /api/android/reference/com/pspdfkit/annotations/SoundAnnotation.html
[annotationtool sound]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/special_mode/controller/AnnotationTool.html#SOUND
[enabledannotationtools]: /api/android/reference/com/pspdfkit/configuration/PdfConfiguration.Builder.html#enabledAnnotationTools(java.util.List<com.pspdfkit.ui.special_mode.controller.AnnotationTool>)
[pdfconfiguration]: /api/android/reference/com/pspdfkit/configuration/PdfConfiguration.Builder.html
[annotation configuration guide]: /guides/android/current/annotations/annotation-configuration
