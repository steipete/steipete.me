---
title: "PSPDFKit 2.8 for Android"
description: Today we're releasing PSPDFKit 2.8 for Android!
section: blog

author:
  - Jernej Virag
  - David Schreiber‑Ranner
author_url:
  - https://twitter.com/jernejv
  - https://twitter.com/Flashmasterdash
date: 2016-12-01 12:00 UTC
tags: Android, Products
published: true
---

You probably were not expecting it, but today we are proudly shipping PSPDFKit 2.8 for Android: New shape annotation types, a point editing mode, flexible toolbars, a powerful document key-value store, and more!
READMORE

## Annotations, all the way!

We're keeping pace with our previous releases and adding yet another set of great annotation tools: `SquareAnnotation`, `CircleAnnotation`, `PolygonAnnotation`, and `PolylineAnnotation` bring Android in shape! (<em>pun intended</em>) As always, annotations are accessible through the annotation toolbar, adjustable via the annotation inspector, and usable in code. Further, you can tweak the existing editing defaults using the `ShapeAnnotationDefaultsProvider` and `LineAnnotationDefaultsProvider` classes.

![Shape annotation drawing](/images/blog/2016/pspdfkit-android-2-8/shape-drawing.gif)

## New point editing mode

PSPDFKit 2.8 introduces a new <em>point editing mode</em>, which you can use to drag individual points of an annotation. Point editing complements the existing dragging and scaling gestures and is available for lines, poly-lines, and polygon shape annotations.

![Point editing](/images/blog/2016/pspdfkit-android-2-8/point-editing.gif)

## Document key-value store

If you have ever needed to attach arbitrary data to a PDF document, you now can with the new `DocumentDataStore`. It provides a simple key-value API for storing and retrieving data related to a specific `PSPDFDocument` or document UID. Backed by an SQLite database, it delivers great performance and stability. To keep the disk memory size low and to simplify maintenance, the `DocumentDataStore` provides methods for pruning by timestamp and document count.

[==

```kotlin
val data: DocumentData = DocumentDataStore.getInstance().getDataForDocument(document)

// Supported types are string, integer, float, string list, integer list, and float list.
data.apply {
  putString("next_reviewer", "John Appleseed")
  putInt("seeds_per_apple", 28)
  putFloat("document_quality", 2.8f)
}

val reviewers: List<String> = data.getStringList("previous_reviewers")
```

```java
final DocumentData data = DocumentDataStore.getInstance().getDataForDocument(document);

// Supported types are string, integer, float, string list, integer list, and float list.
data.putString("next_reviewer", "John Appleseed");
data.putInt("seeds_per_apple", 28);
data.putFloat("document_quality", 2.8f);

final List<String> reviewers = data.getStringList("previous_reviewers");
```

==]

Also, based on the document store: The `PSPDFFragment` will now remember the page index of the last page viewed by a user and will restore that page when re-opening the document at a later point. This is activated by default but can be deactivated using `PSPDFConfiguration.Builder#restoreLastViewedPage`. You can try this feature out in our catalog app, which now provides a new setting to enable restoration of the last page.

## Flexible toolbars

The steady growth of available tools requires better structured toolbars. PSPDFKit 2.8 for Android improves the existing `ContextualToolbar`, which can now dynamically regroup actions based on configurable rules and the available screen space. The `MenuItemGroupingRule` interface enables developers to define custom grouping rules that match their requirements.

![Point editing](/images/blog/2016/pspdfkit-android-2-8/toolbar-resizing.gif)

## Rendering performance

We know: [#perfmatters](https://www.youtube.com/watch?v=5MzayZXtSiQ)! Here are a couple of performance improvements in this release:

* Faster opening of large documents (up to 10x faster)
* Increased decoding speeds of embedded JPEG images
* Quicker removal of annotations
* Optimized handling of multiple documents in low-memory situations
* Still, we also believe that #enumsmatter 😜

This blog post gives just a glimpse of all the things we packed into this release. If you're interested in all the details, see [the full list of changes in PSPDFKit 2.8 for Android](/changelog/android/#2.8.0)

[`pspdffragment`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PSPDFFragment.html
[`pspdfactivity`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PSPDFActivity.html
