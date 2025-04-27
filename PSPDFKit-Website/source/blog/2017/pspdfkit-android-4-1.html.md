---
title: "PSPDFKit 4.1 for Android"
description: Today we're releasing PSPDFKit 4.1 for Android!
preview_image: /images/blog/2017/pspdfkit-android-4-1/pspdfkit-android-4-1-header.png
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/flashmasterdash
date: 2017-11-15 12:00 UTC
tags: Android, Features, Products
published: true
---

Today we are proudly announcing PSPDFKit 4.1 for Android, which features **biometric signature data**, **watermark rendering**, **custom annotation appearances**, **improvements to forms**, and much more.READMORE As always, this blog post is just a sneak peek of everything inside the release. For a full list of changes, head over to our [changelog for PSPDFKit 4.1 for Android](https://pspdfkit.com/changelog/android/#4.1.0).

## Biometric Signature Data

This release adds yet another feature to the Digital Signatures component we launched with [PSPDFKit 4 for Android](../pspdfkit-android-4-0/).

With biometric signature data, you can attach additional “real-world information” to a digital signature. This includes information such as whether the signature was created with a stylus, the size of the signee’s finger, and the timing and pressure information collected while writing the signature. Ultimately, this data can be used to create solutions with better security than traditional digital signatures.

![Biometric Signature Data](/images/blog/2017/pspdfkit-android-4-1/biometric-data-illustration.png)

We updated our [Digital Signatures guide](https://pspdfkit.com/guides/android/current/features/digital-signatures) to show how simple it is to create biometric data, how to collect it, and how to use it for signing.

## Watermark Rendering

For some use cases, apps need to render custom watermarks on top of a PDF. Up until now, this was not possible without you having to modify the document itself. With this release, we’re expanding our [custom drawable API](/guides/android/current/features/drawable-api/) to our render engine, providing a simple but powerful way of adding custom content on top of any PDF rendering. We also expanded the API to our existing views, which enables you to display watermarks in virtually any part of your app.

If you’re interested, check out `WatermarkExample` inside the catalog app and have a look at our [drawable API guide](/guides/android/current/features/drawable-api/), which explains all the tools required to implement watermarks in your app.

<video src="/images/blog/2017/pspdfkit-android-4-1/watermark-example-land.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Vector Stamps — Custom Annotation Appearance Streams

In this release, we’re introducing a brand-new API that allows overriding the appearance of any annotation with custom vector data. You can achieve this by providing a PDF file with the vector data you wish to apply and setting [`AppearanceStreamGenerator`](https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/appearance/AppearanceStreamGenerator.html) on the target annotations. If you want to learn how the new API works in detail, have a look at our [custom appearance streams](/guides/android/current/annotations/appearance-streams/) guide article.

We have been providing support for custom stamps with bitmap data for some time. However, due to the limitations of how PDFs store annotation data, it wasn’t possible to create custom stamps with a transparent background. But now you can use the custom annotation appearance streams API to create vector stamps.

To make your life easier, we’ve also expanded our [stamps configuration API](/guides/android/current/annotations/stamp-annotations-configuration/) with the ability to define custom stamps with custom appearances that will be displayed in the stamp picker UI. If you’re interested in seeing it in action, take a look at `CustomStampAnnotationsExample` inside the catalog app.

<video src="/images/blog/2017/pspdfkit-android-4-1/vector-stamps.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Form Improvements

Filling out forms can be a time-consuming process — but it doesn’t have to be! That’s why, with PSPDFKit 4.1, we added a convenient search inside list fields and combo boxes, thereby making finding the correct value in large forms a breeze. Furthermore, we made our tab order-detection algorithms smarter, and we increased general support for all kinds of PDF forms that can be encountered in the wild. The complete list of form improvements in 4.1 can be found in the [changelog](https://pspdfkit.com/changelog/android/#4.1.0).

<video src="/images/blog/2017/pspdfkit-android-4-1/dropdown-search.mp4" width="50%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Annotation Render Options

In case your app renders single annotations or form widgets to `Bitmap` objects, we added two new method overloads for [`Annotation#renderToBitmap()`](https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/Annotation.html#renderToBitmap(android.graphics.Bitmap,%20com.pspdfkit.configuration.rendering.AnnotationRenderConfiguration)) and [`Annotation#renderToBitmapAsync()`](https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/Annotation.html#renderToBitmapAsync(android.graphics.Bitmap,%20com.pspdfkit.configuration.rendering.AnnotationRenderConfiguration)) that allow you to define custom render options using [`AnnotationRenderConfiguration`](https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/rendering/AnnotationRenderConfiguration.html):

[==

```kotlin
val options = AnnotationRenderConfiguration.Builder()
    .toGrayscale(true)
    .invertColors(false)
    .build()

stampAnnotation.renderToBitmap(myBitmap, options)
```

```java
final AnnotationRenderConfiguration options = new AnnotationRenderConfiguration.Builder()
    .toGrayscale(true)
    .invertColors(false)
    .build();

stampAnnotation.renderToBitmap(myBitmap, options);
```

==]

For more info, check out the [`AnnotationRenderConfiguration`](https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/rendering/AnnotationRenderConfiguration.html) API reference or our new guide about [Rendering Annotations to Bitmaps](https://pspdfkit.com/guides/android/current/getting-started/rendering-annotations/).

## Many More Changes

PSPDFKit 4.1 is the next iteration of many of PSPDFKit’s great features — and our team is already working on the next big things to land. To see a comprehensive list of changes in this release, check out the [PSPDFKit 4.1 for Android changelog](https://pspdfkit.com/changelog/android/#4.1.0).

**❤️ Tip:** Since we were itching to use our own 4.1 release, we already went ahead and updated our free [PDF Viewer for Android](https://play.google.com/store/apps/details?id=com.pspdfkit.viewer), which you can grab from the Play Store and try right away.

<!-- References -->
