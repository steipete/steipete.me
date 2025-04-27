---
title: "PSPDFKit 5.5 for Android"
description: "Introducing PSPDFKit 5.5 for Android — including a floating thumbnail bar, RTL document support, image stamp rotation, better performance, and more."
preview_image: /images/blog/2019/pspdfkit-android-5-5/android-5-5-header.png
preview_video: /images/blog/2019/pspdfkit-android-5-5/android-5-5-header.mp4
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/Flashmasterdash
date: 2019-07-26 15:00 UTC
tags: Android, Development, Products
published: true
---

Today we’re launching PSPDFKit 5.5 for Android! This release comes packed with several new features and improvements, including a floating thumbnail bar, support for RTL documents with page bindings, image stamp rotation, improved startup performance, and simpler integration steps. READMORE This blog post outlines the biggest improvements in this release. For a full list of changes, head over to our [changelog for PSPDFKit 5.5 for Android][changelog].

## Floating Thumbnail Bar

With PSPDFKit 5.5 for Android, we primed our UI for the upcoming version Q of Android. Android Q introduces a new [gestural navigation mode][q gestural navigation] that reserves the edges of a device for system navigation gestures. These new gestures conflicted with our existing thumbnail bar design, where swiping thumbnails of a document could accidentally trigger the system’s app switching gesture. So with PSPDFKit 5.5, we redesigned our thumbnail bar to be detached from the bottom edge. The new floating thumbnail bar automatically adjusts to the system’s requested safe insets, providing a seamless experience on devices with gestural navigation enabled.

<video src="/images/blog/2019/pspdfkit-android-5-5/floating-thumbnail-bar.mp4"
 poster="/images/blog/2019/pspdfkit-android-5-5/floating-thumbnail-bar.png"
 width="100%"
 data-controller="video"
 data-video-autoplay="true"
 controls
 playsinline
 loop
 muted>
</video>

We also updated our existing “sticky” thumbnail bar design, which will now also apply the required safe insets, in order to no longer conflict with gestural navigation input. To learn more about our various thumbnail bar styles and how to pick one, check out our [Customizing the Thumbnail Bar guide][thumbnail bar guide].

## Page Binding

PDF documents support a metaphorical page binding, which is used when pages are laid out horizontally. Many languages use a left-to-right script, which calls for a page binding on the left edge. However, binding on the right edge is preferable for right-to-left scripts such Arabic and Hebrew and several East Asian scripts. The page binding is used with horizontal scrolling and in the thumbnails view. It has no effect when using vertical scrolling unless double-page mode is also enabled.

PSPDFKit 5.5 for Android adds support for displaying right-to-left documents, and it introduces convenient APIs for setting and persisting page bindings on PDF files too.

We also added an option in the document info editor that allows users to correct the page binding in cases where this was not done correctly by the author of a document.

<video src="/images/blog/2019/pspdfkit-android-5-5/page-binding.mp4" 
 poster="/images/blog/2019/pspdfkit-android-5-5/page-binding.png" 
 width="100%" 
 data-controller="video"
 data-video-autoplay="true"
 controls 
 playsinline 
 loop 
 muted>
</video>

Note that page bindings are independent of the device’s language setting. A user might have their device set to English and be reading an Arabic book. In this case, most of the user interface will be shown from left to right, and only the PDF pages will be ordered from right to left.

If you want to change the page binding programmatically, you can use the [`setPageBinding()`][pdfdocument#setpagebinding()] method on [`PdfDocument`][]. For more information on existing right-to-left document support and page bindings, check out our [Page Bindings guide][page binding guide].

## Image Stamp Rotation

In addition to the existing support for rotating stamp annotations and free text annotations, PSPDFKit 5.5 for Android enables rotation for image stamp annotations.

<video src="/images/blog/2019/pspdfkit-android-5-5/image-rotation.mp4" 
 poster="/images/blog/2019/pspdfkit-android-5-5/image-rotation.png" 
 width="100%" 
 data-controller="video"
 data-video-autoplay="true"
 controls 
 playsinline 
 loop 
 muted>
</video>

In the API, the existing [`setRotation()`][setrotation()] method of [`StampAnnotation`][stampannotation] will now also work for image stamps without requiring any changes to your app’s code. In the user interface, annotation rotation is enabled by default, and it can be disabled by calling [`disableAnnotationRotation()`][disableannotationrotation()] on `PdfConfiguration.Builder`.

## Simplified Integration

We’re always looking for ways to improve the customer experience with PSPDFKit. Previously, after downloading a trial of our framework and then deciding to go ahead and use our product, users would have had to download a separate version of PSPDFKit for use in production. We’ve simplified this so that a single download can be used both when on trial and in production, making the process of getting up and running with us faster and simpler.

This eliminates the need for migrating your build configuration when upgrading from a trial to a full license of PSPDFKit:

```build.gradle
dependencies {
    // Starting with 5.5, there is only a single PSPDFKit dependency that
    // can be used with demo and full licenses.
    implementation 'com.pspdfkit:pspdfkit:5.5.0'
}
```

If you are currently evaluating PSPDFKit and want to update to PSPDFKit 5.5 for Android, please consult our [PSPDFKit 5.5 Migration Guide][migration guide] for the necessary steps.

## Improved Performance

As we did with previous versions of PSPDFKit, we dedicated a fair amount of time to working on improving our framework performance. With 5.5, we especially focused on bettering our document loading performance and overall activity startup times. We’re especially happy about following changes that are part of this release:

- We continued to make more views lazy, deferring their creation and configuration. Most views that are not visible during the startup of `PdfActivity` are now created lazily, and on background threads where possible.
- A new bitmap caching strategy with much faster access times for previously rendered bitmap images greatly reduces the time between requesting of a page rendering and receiving and displaying it. This also results in a much faster recreation of activities during configuration changes, e.g. when reorienting the device.

We are determined to improve performance even more, and the team is already working on the next batch of enhancements for our next version of PSPDFKit for Android.

## And More

- We upgraded our builds to Android Studio/Android Gradle Plugin 3.4.2 and Gradle 5.5.1. This change also trickles down to our examples, which use the same versions.

- We updated our native builds to the latest NDK, version 20, which improves performance and security. As a reminder: All versions of PSPDFKit for Android since version 4.8 (September 2018) already comply with the upcoming [64-bit binary requirements][64-bit requirements], which will be enforced by Google Play beginning on 01 August 2019.

- We further improved performance of page scrolling, which feels faster and more natural now.

As always, this is just a sneak peek of the enhancements we added to this release. To see a complete list of changes, check out the [PSPDFKit 5.5 for Android changelog][changelog].

[pdfviewer]: https://pdfviewer.io
[changelog]: /changelog/android/#5.5.0
[migration guide]: /guides/android/current/migration-guides/pspdfkit-5-5-migration-guide
[q gestural navigation]: https://developer.android.com/preview/features/gesturalnav
[thumbnail bar guide]: https://pspdfkit.com/guides/android/current/customizing-the-interface/customizing-the-thumbnail-bar
[pdfdocument#setpagebinding()]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/PdfDocument.html#setPageBinding(com.pspdfkit.document.PageBinding)
[`pdfdocument`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/PdfDocument.html
[page binding guide]: /guides/android/current/miscellaneous/page-bindings
[64-bit requirements]: https://developer.android.com/distribute/best-practices/develop/64-bit
[setrotation()]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/StampAnnotation.html#setRotation(int)
[stampannotation]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/StampAnnotation.html
[disableannotationrotation()]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/PdfConfiguration.Builder.html#disableAnnotationRotation()
