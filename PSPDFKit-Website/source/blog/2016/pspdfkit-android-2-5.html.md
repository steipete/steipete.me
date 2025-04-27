---
title: "PSPDFKit 2.5 for Android"
description: The PSPDFKit Android team has been working hard to bring you the newest release 2.5 of PSPDFKit for Android! Check out this post to learn about the updated features.
preview_image: /images/blog/2016/pspdfkit-android-2-5/bookmarks.gif
section: blog

author:
  - Jernej Virag
  - David Schreiber‑Ranner
author_url:
  - https://twitter.com/jernejv
  - https://twitter.com/Flashmasterdash
date: 2016-08-16 12:00 UTC
tags: Android, Features, Products
published: true
---

The PSPDFKit Android team has been working hard to bring you the [newest release 2.5 of PSPDFKit for Android](/changelog/android/#2.5.0). Check out this post to learn more about the biggest features contained in the release.READMORE

## Bookmark Support

One of the big features in 2.5 is the complete support for bookmarks in PDFs including adding and editing them. We built a new UI and API for adding, renaming, reordering and deleting. [Bookmarks are stored inside the PDF document and are compatible with other apps that support PDF bookmarks like Apple's Preview.](/blog/2016/just-a-simple-bookmark/)

![](/images/blog/2016/pspdfkit-android-2-5/bookmarks.gif)

On the API side, bookmarks are represented by [`Bookmark`] objects. To retrieve and edit bookmarks use the [`BookmarkProvider`] which can be obtained by calling [`document.getBookmarkProvider()`][`pspdfdocument#getbookmarkprovider`].

## Property Inspector

We added a completely overhauled annotation inspector for changing annotation properties (colors, sizes, etc.). This new inspector replaces the old properties dialogue and paves the way for adding further annotation properties.

![](/images/blog/2016/pspdfkit-android-2-5/inspector.gif)

## Custom Launch Intents

The new [`PSPDFActivity.IntentBuilder`] allows manual creation of `Intent` instances for launching the [`PSPDFActivity`]. For example, you can use this to launch a custom [`PSPDFActivity`] with non-default flags, or to start a custom activity for result. The builder will ensure that the intent bundle will contain all the extras required by the [`PSPDFActivity`].

```java
final Intent intent = PSPDFActivity.IntentBuilder.fromUri(context, documentUri, configuration)
    .activity(CustomActionsActivity.class)
    .build();

activity.startActivityForResult(intent, REQUEST_CODE);
```

## Text Search Improvements

The search API received a couple of improvements as well. We added [`SearchConfiguration`] which can either be set using [`PSPDFActivityConfiguration.Builder#searchConfiguration`] or directly on the [`PSPDFSearchViewInline`] and [`PSPDFSearchViewModular`] by using [`#setSearchConfiguration`][`pspdfsearchview#setsearchconfiguration`]. Moreover, we added support for [`#priorityPages`][`pspdfsearchoptions#prioritypages`] which will be searched before other pages (allowing you to make your custom search UI as responsive as possible).

## Annotation Resizing Guides

Similar to the visual guides already available on iOS, we added indicators that help to proportionally resize annotations. Guides are enabled by default but can be disabled using [`AnnotationEditingConfiguration.Builder#setGuideLinesEnabled`]. The [`AnnotationEditingConfiguration.Builder`] also received several new properties to tweak snap-in thresholds of guides as well as their appearance.

![](/images/blog/2016/pspdfkit-android-2-5/resize-guides.gif)

## Improved Toolbar Layout API

The [`ToolbarCoordinatorLayout`] that was added in 2.4 received a new [`ToolbarCoordinatorLayout.LayoutParams`] class for positioning toolbars. You can now use [`#position`][`toolbarcoordinatorlayout.layoutparams#position`] to programmatically set the position of a contextual toolbar and define the set of valid positions using [`#allowedPositions`][`toolbarcoordinatorlayout.layoutparams#allowedpositions`]

```java
final AnnotationCreationToolbar annotationCreationToolbar = new AnnotationCreationToolbar(this);
annotationCreationToolbar.setLayoutParams(new ToolbarCoordinatorLayout.LayoutParams(Position.LEFT, EnumSet.allOf(Position.class)));
toolbarCoordinatorLayout.displayContextualToolbar(annotationCreationToolbar, false);
```

We also added a new theming attribute `dragTargetColor` to the `pspdf__toolbarCoordinatorLayoutStyle` to change the color of your toolbar drag targets according to your theme.

## Many Tweaks, Enhancements and Fixes

PSPDFKit 2.5 for Android also includes a number of smaller enhancements and fixes. We added a library `AndroidManifest.xml` that contributes recommended settings to your app (like the `android:largeHeap="true"` flag) and automatically declares content providers for document sharing, printing and multimedia support. We greatly improved performance around pooling, JPEG200 decoding and annotation adding on documents opened using a `ContentResolver`.

If you'd like to explore all the improvements we made in this release, have a look at our [full list of changes in PSPDFKit 2.5 for Android](/changelog/android/#2.5.0) or try out our [PDF Viewer App for Android - currently in beta and free](/viewer/).

[`searchconfiguration`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/search/SearchConfiguration.html
[`pspdfactivityconfiguration.builder#searchconfiguration`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html#searchConfiguration(com.pspdfkit.configuration.search.SearchConfiguration)
[`pspdfsearchviewinline`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/search/PdfSearchViewInline.html
[`pspdfsearchviewmodular`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/search/PdfSearchViewModular.html
[`pspdfsearchview#setsearchconfiguration`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/search/PdfSearchView.html#setSearchConfiguration(com.pspdfkit.configuration.search.SearchConfiguration)
[`pspdfsearchoptions#prioritypages`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/search/SearchOptions.html#priorityPages
[`bookmark`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/bookmarks/Bookmark.html
[`bookmarkprovider`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/bookmarks/BookmarkProvider.html
[`pspdfdocument#getbookmarkprovider`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/PdfDocument.html#getBookmarkProvider()
[`pspdfactivity.intentbuilder`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivityIntentBuilder.html
[`pspdfactivity`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html
[`annotationeditingconfiguration.builder`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html
[`annotationeditingconfiguration.builder#setguidelinesenabled`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html#setSelectedAnnotationResizeGuidesEnabled(boolean)
[`toolbarcoordinatorlayout`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/toolbar/ToolbarCoordinatorLayout.html
[`toolbarcoordinatorlayout.layoutparams`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/toolbar/ToolbarCoordinatorLayout.LayoutParams.html
[`toolbarcoordinatorlayout.layoutparams#position`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/toolbar/ToolbarCoordinatorLayout.LayoutParams.html#position
[`toolbarcoordinatorlayout.layoutparams#allowedpositions`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/toolbar/ToolbarCoordinatorLayout.LayoutParams.html#allowedPositions
