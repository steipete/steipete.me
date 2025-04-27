---
title: "PSPDFKit 5.1 for Android"
description: "Introducing PSPDFKit 5.1 for Android — featuring a new free-form redaction tool, AndroidX support, and many more improvements."
preview_image: /images/blog/2018/pspdfkit-android-5-1/android-5-1-header.png
preview_video: /images/blog/2018/pspdfkit-android-5-1/android-5-1-header.mp4
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/Flashmasterdash
date: 2018-12-13 12:00 UTC
tags: Android, Development, Products
published: true
---

Today we’re launching PSPDFKit 5.1 for Android, our first large update to the fifth generation of PSPDFKit for Android. This release features a new [free-form redaction tool][redaction landing page], a fully AndroidX-compatible codebase, and many improvements to existing features and APIs.READMORE
 This blog post outlines the biggest improvements in this release. For a full list of changes, head over to our [changelog for PSPDFKit 5.1 for Android][changelog].

## Free-Form Redaction

In version 5, we introduced the all-new [Redaction][redaction landing page] component, which enables secure and irreversible removal of text from PDF documents. With 5.1, we’re extending this tool’s functionality with support for content other than text — this includes images, paths/vector drawings, annotations, and form fields. Images and paths on a document page that are beneath a redaction annotation will only be redacted in the area that intersects with the redaction annotation, leaving the non-intersecting part of the content intact. Annotations and form fields will be completely removed if they intersect with a redaction annotation at any point.

To achieve this, we expanded the redaction annotation creation tool to be able to create rectangular shapes anywhere on the page. These mark-up behaviors are combined into the single, already existing, redaction annotation tool. Depending on where you start the selection gesture, the tool automatically decides if a rectangular area or text should be marked for redaction since it contains all functionality in a single tool.

<video src="/images/blog/2018/pspdfkit-android-5-1/free-form-redaction.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## AndroidX

After ensuring [full Jetifier compatibility][pspdfkit 5 blog post] with PSPDFKit 5 for Android, we took the next step and migrated our entire framework codebase to the newer AndroidX libraries. This is a response to a popular customer demand, as most of our users already switched to AndroidX too. In order to make sure your app is fully prepared for the AndroidX upgrade, you can find the suggested migration steps in our [PSPDFKit 5.1 for Android migration guide][migration guide].

## Empty PdfActivity

With PSPDFKit 5.1 for Android, we’re adding support for launching empty `PdfActivity` instances. Where previously it was only possible to launch a `PdfActivity` when loading a document right away, our new APIs allow launching of empty activities for loading documents in a second step. This feature is especially useful when handling multiple documents inside a single activity — for example, [when using document tabs][document tabs].

Launching `PdfActivity` empty is as simple as using the new [`emptyActivity()`][emptyactivity] intent factory:

[==

```kotlin
// Creates an intent for launching PdfActivity without a document.
val intent = PdfActivityIntentBuilder.emptyActivity(context).build()
```

```java
// Creates an intent for launching PdfActivity without a document.
Intent intent = PdfActivityIntentBuilder.emptyActivity(context).build();
```

==]

## And More

* With PSPDFKit 5.1, we’re also updating [PSPDFKit Instant][instant] and adding support for image annotations, which can now be synchronized in real time between Android, iOS, and Web.
* By popular demand, we added additional options to our `SignaturePickerFragment`. Using the new `SignaturePickerFragment.Options`, it is now possible to change saving strategies for new signatures, tweak the UI, and swap out entire signature stores for multi-user apps.

As always, this is just a sneak peek of the enhancements we added to this release. To see a complete list of changes, check out the [PSPDFKit 5.1 for Android changelog][changelog].

[changelog]: /changelog/android/#5.1.0
[migration guide]: /guides/android/current/migration-guides/pspdfkit-5-1-migration-guide
[redaction guide]: /guides/android/current/features/redaction
[support contact]: /support/request/
[instant]: /instant/
[redaction landing page]: /pdf-sdk/redaction/#android
[comparison landing page]: /pdf-sdk/comparison/#android
[androidx]: https://developer.android.com/jetpack/androidx/
[pspdfkit 5 blog post]: /blog/2018/pspdfkit-android-5#android-9-support
[document tabs]: /blog/2018/pspdfkit-android-4-8#tabs
[multimedia annotations]: /guides/android/current/annotations/multimedia-annotations
[emptyactivity]: /api/android/reference/com/pspdfkit/ui/PdfActivityIntentBuilder.html#emptyActivity(android.content.Context)
