---
title: "PSPDFKit 5.2 for Android"
description: "Introducing PSPDFKit 5.2 for Android — featuring multithreaded rendering, new signature APIs, a smaller library size, and many more improvements."
preview_image: /images/blog/2019/pspdfkit-android-5-2/android-5-2-header.png
preview_video: /images/blog/2019/pspdfkit-android-5-2/android-5-2-header.mp4
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/Flashmasterdash
date: 2019-02-06 14:00 UTC
tags: Android, Development, Products
published: true
---

Today we’re launching PSPDFKit 5.2 for Android, our next milestone in making PSPDFKit the most versatile and powerful PDF library for Android. In this release, we improved rendering performance and added new signature APIs while also reducing the overall size of our library.READMORE
This blog post outlines the biggest improvements in this release. For a full list of changes, head over to our [changelog for PSPDFKit 5.2 for Android][changelog].

## Multithreaded Rendering

Excellent performance is always an important factor for users of an app, and that’s why our team went to great lengths to improve our rendering performance even more. With PSPDFKit 5.2 for Android, we are introducing a new system of how we distribute the overall load of rendering documents across multiple CPU cores.

While it was always possible to render pages of a document in the background, our updated renderer now utilizes the available CPU cores of a device much better, which allows for simultaneous rendering of multiple pages (or even different parts of a single page), resulting in faster rendering times.

![Multithreaded Rendering](/images/blog/2019/pspdfkit-android-5-2/multithreaded-rendering.png)

We’ve been running our new renderer for a couple of weeks in our [PDF Viewer Pro][pdfviewer] apps that are available on Google Play and the Apple App Store, and we are very happy with the results we’re seeing and the feedback we’ve received from our users.

The new multithreaded renderer is enabled by default and can be disabled in memory-constrained scenarios using the new [`setMultithreadedRenderingEnabled(boolean)`][multithreading option] configuration option.

## Improved Signature APIs

With PSPDFKit 5.2 for Android, we’re launching two major improvements to our existing APIs for creating and managing ink signatures and digital signatures.

### Custom Signature Storage

Our new [`SignatureStorage`][signature storage] API allows developers to implement custom signature storage in no time. Whether you want to use independent signature storage for each user or a storage implementation that’s different than the default SQLite-backed storage, you can now set your custom signature storage using the new [`setSignatureStorage(SignatureStorage)`][signature storage setter] method on [`PdfFragment`][fragment]:

```kotlin
// Create a custom instance of an SQLite signature storage.
val storage = DatabaseSignatureStorage.withName("custom-storage")
// Set your signature storage to the fragment.
pdfFragment.setSignatureStorage(storage)
```

We’ve updated our [Digital Signatures guide][digital signatures guide] with a new section about how to use [custom signature storage][custom signature storage guide] in your app.

### Signature Appearance Options

The second big addition to our existing signature APIs is that of options that define the visual appearance of a digital signature. Starting with 5.2, you can now add `Location` and `Reason` metadata properties to digital signatures using `SignatureMetadata`. Moreover, using the new `SignatureAppearance`, you can customize how the digital signature will look after signing. To set the `SignatureAppearance`, use [`PdfConfiguration#signatureAppearance()`][], and to set the `SignatureMetadata`, use the [`setSignatureMetadata()`][] method on [`PdfFragment`][fragment]. You can also use the signature appearance and metadata directly with the [`SignatureSignerDialog`][] by providing them via [`SignatureSignerDialog#Options`][].

## Smaller Native Binaries

![Smaller Native Binaries](/images/blog/2019/pspdfkit-android-5-2/smaller-binary.png)

This is a big one! (Sorry for the bad pun.) As we ourselves are mobile developers, we know the constraints the mobile device space puts on app developers, one of which is app size.

With PSPDFKit 5.2 for Android, our team made major efforts to trim down the overall size of our library. We rewrote large parts of our C++ code base, migrated to a new linker, and experimented with better compression of our native binaries. The result is a 10 percent smaller `.aar` file, which has a direct positive effect on your app’s size too. This size reduction is just the beginning, as we’re exploring additional ways of making our library even smaller.

Moreover, by using [Android app bundles][app bundles], we’ve been able to reduce the final `.apk` file size of [PDF Viewer Pro for Android][pdfviewer] by more than 40 percent compared to previous non-bundled versions. If reducing your app’s size is important for you too, have a look at our [Framework Size guide article][framework size], in which we describe techniques for smaller APKs.

## And More

- With PSPDFKit 5.2, we’re increasing flexibility of the primary [`PdfActivity`][] toolbar by introducing two-step menu generation. We added a new method, [`onGenerateMenuItemIds(List<Integer>)`][menu item generation], which you can override in your activity to add, remove, or reorder menu items in the primary toolbar.

- It is now possible to copy [`Annotation`][] instances using the new [`Annotation#getCopy()`][] method.

- We updated Kotlin to the latest available version, 1.3.20.

As always, this is just a sneak peek of the enhancements we added to this release. To see a complete list of changes, check out the [PSPDFKit 5.2 for Android changelog][changelog].

[pdfviewer]: https://pdfviewer.io
[changelog]: /changelog/android/#5.2.0
[migration guide]: /guides/android/current/migration-guides/pspdfkit-5-2-migration-guide
[multithreading option]: /api/android/reference/com/pspdfkit/configuration/PdfConfiguration.Builder.html#setMultithreadedRenderingEnabled(boolean)
[custom signature storage guide]: /guides/android/current/features/digital-signatures#custom-signature-storage
[digital signatures guide]: /guides/android/current/features/digital-signatures
[signature storage]: /api/android/reference/com/pspdfkit/signatures/storage/SignatureStorage.html
[app bundles]: /guides/android/current/faq/framework-size#android-app-bundles
[framework size]: /guides/android/current/faq/framework-size
[menu item generation]: /api/android/reference/com/pspdfkit/ui/PdfActivity.html#onGenerateMenuItemIds(java.util.List<java.lang.Integer>)
[`annotation#getcopy()`]: /api/android/reference/com/pspdfkit/annotations/Annotation.html#getCopy(int)
[`annotation`]: /api/android/reference/com/pspdfkit/annotations/Annotation.html
[`pdfactivity`]: /api/android/reference/com/pspdfkit/ui/PdfActivity.html
[signature storage setter]: /api/android/reference/com/pspdfkit/ui/PdfFragment.html#setSignatureStorage(com.pspdfkit.signatures.storage.SignatureStorage)
[fragment]: /api/android/reference/com/pspdfkit/ui/PdfFragment.html
[`pdfconfiguration#signatureappearance()`]: /api/android/reference/com/pspdfkit/configuration/PdfConfiguration.Builder.html#signatureAppearance(com.pspdfkit.signatures.SignatureAppearance)
[`setsignaturemetadata()`]: /api/android/reference/com/pspdfkit/ui/PdfFragment.html#setSignatureMetadata(com.pspdfkit.signatures.SignatureMetadata)
[`signaturesignerdialog`]: /api/android/reference/com/pspdfkit/ui/signatures/SignatureSignerDialog.html
[`signaturesignerdialog#options`]: /api/android/reference/com/pspdfkit/ui/signatures/SignatureSignerDialog.Options.html
