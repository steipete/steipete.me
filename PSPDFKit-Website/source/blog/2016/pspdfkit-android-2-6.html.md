---
title: "PSPDFKit 2.6 for Android"
description: PSPDFKit continues its saga on Android with the 2.6 release and a host of new features and improvements! Check out this post to learn about the updated features.
preview_image: /images/blog/2016/pspdfkit-android-2-6/v2_6-android-header.jpg
section: blog

author:
  - Jernej Virag
  - David Schreiber‑Ranner
author_url:
  - https://twitter.com/jernejv
  - https://twitter.com/Flashmasterdash
date: 2016-10-03 12:00 UTC
tags: Android, Features, Products
published: true
---

PSPDFKit continues its saga on Android with [the 2.6 release of PSPDFKit for Android](/changelog/android/#2.6.0) and a host of new features and improvements! In this post, we outline the most mentionable features of the release.READMORE If you want to try all the new features right away, [download our free PDF Viewer app](https://pdfviewer.io).

## Stamp and image annotations

Two of the most demanded annotation types found its way to Android: The [`StampAnnotation`] and its cousin the _image annotation_. Both are now fully supported via API and user interface. To create them, select the annotation type from the toolbar and tap on the PDF document. This will bring up the stamp picker or an image chooser (depending on the selected annotation tool).

![Stamp annotation](/images/blog/2016/pspdfkit-android-2-6/stamp-annotation.gif)

Creating a [`StampAnnotation`] from code works just like with any other annotation type. The [`StampAnnotation`] has constructors that can take a predefined [`StampType`], or even a [`Bitmap`] object that was loaded from an image file.

```java
final Bitmap bitmap = BitmapFactory.decodeStream(context.getAssets().open("custom_image.jpg"));
final StampAnnotation stampAnnotation = StampAnnotation(0, new RectF(210f, 520.0f, 410.0f, 330.0f), bitmap);
document.getAnnotationProvider().addAnnotationToPage(stampAnnotation);
```

## Material design sharing menu

The new [`ActionMenu`] is a bottom sheet dialog as [described by the material design guidelines](https://material.io/develop/android/components/bottom-sheet-behavior/). Based on that class, the [`SharingMenu`] shows apps that are able to share the current PDF document (usually messaging apps, email clients, etc.). The specialized [`DefaultSharingMenu`] adds two more fixed actions for printing or opening the PDF document in another app. The new menu classes are available via the public API, and also used by the [`PSPDFActivity`] when tapping the share action. If you're interested in customizing the sharing menu, the `CustomSharingMenuExample` inside the catalog app is a good starter for you.

![Stamp annotation](/images/blog/2016/pspdfkit-android-2-6/sharing-menu.gif)

## Tiled rendering

PSPDFKit 2.6 for Android ships with a new page renderer, used to display pages on the [`PSPDFFragment`]. The renderer utilizes image tiling, which greatly improves rendering times while also reducing memory requirements and churn rates. An on-screen page is split up into several bitmaps, each of the same size. This allows a very effective bitmap reuse, better pooling, and paves the way for future higher-level rendering features like partial rendering of damaged regions. The new renderer also eliminates blurred text while zooming, which haunted previous versions of PSPDFKit for Android. We are very happy about the progress we made so far and will continue improving this central component of our framework in the upcoming versions.

## Better organized toolbars with submenus

We spend a lot of time improving the usability of our [existing toolbars API](https://pspdfkit.com/blog/2016/pspdfkit-android-2-4/) and added contextual submenus. Any action that offers a second-level menu can show a small submenu indicator next to its icon. Long-pressing the action will reveal the submenu next to the main toolbar. This results in a much simpler to understand and thus better toolbar flow than we had in previous versions.

![Submenus via long-press gesture](/images/blog/2016/pspdfkit-android-2-6/submenus.gif)

Since the new submenus use the existing [`ContextualToolbarMenuItem#setSubMenuItems`] method, there are no code changes required if you are using this feature in code.

## Document downloads made easy

PSPDFKit for Android 2.6 adds a convenient download job API that allows you to retrieve PDF files that are not available on the local file system. For example, you can use the API for downloading PDF documents from a third-party content provider, or use it to extract a file from the assets of your app. You can also define custom download sources by implementing the [`DownloadSource`] interface.

To initiate a download you first build a [`DownloadRequest`] and pass it to [`DownloadJob#startDownload(DownloadRequest)`] method. The returned [`DownloadJob`] provides methods for observing the progress or canceling it. Also, it stores as a single object for retaining the download across configuration changes. Our new [document download API guide](https://pspdfkit.com/guides/android/current/miscellaneous/document-downloads/) shows how to do this.

```java
final DownloadRequest request = new DownloadRequest.Builder(context)
    .uri("content://com.example.app/documents/example.pdf")
    .outputFolder(context.getDir("documents", Context.MODE_PRIVATE))
    .overwriteExisting(false)
    .build();

final DownloadJob job = DownloadJob.startDownload(request);

job.setProgressListener(new DownloadJob.ProgressListenerAdapter() {
    @Override public void onProgress(@NonNull Progress progress) {
        updateProgressUi(progress);
    }

    @Override public void onComplete(@NonNull File output) {
        useDownloadedFile(output);
    }
});
```

Check out the catalog app: We have updated the omnipresent `ExtractAssetTask`, which now also uses this new download API for extracting demo assets.

## Analytics for PSPDFKit

For all of you that strive to get the most out of your user data, we added a small but powerful analytics API. By adding an [`AnalyticsClient`] instance using [`PSPDFKit#addAnalyticsClient`] you can receive several otherwise hard to extract user-triggered events. Among those events are:

* Actions on annotations (selection, creation, editing, and deleting).
* Navigation events (page changes, bookmarks, links, etc.).
* Bookmark usage (adding, editing, sorting, ...).
* And many more!

For a complete list of available events have a look at the [`Analytics.Event`] class.

<blockquote style="font-size: 15px; border-left: none; background: #f6f6f6; font-style: italic;">
    <p>By default the analytics API is deactivated and does not collect any data by itself. Also, it does not send any data out of the app: this is responsibility of your app when using this API. In general, PSPDFKit never collects your user's information. More information can be found in <a href="https://pspdfkit.com/guides/android/current/faq/sdk-security/">our SDK security guide</a>.</p>
</blockquote>

## Document cache invalidations

We've seen demand for better cache handling so we added methods to invalidate render caches for a single document or page. In addition to the already existing [`PSPDFKit#clearCaches`] method, you can now call [`PSPDFKit#invalidateDocumentCache`] or [`PSPDFKit#invalidatePageCache`] passing in the affected document instance and page index. Use this method whenever your application modifies the PDF document externally and you want to let PSPDFKit re-render the modified content.

```java
final PSPDFDocument changedDocument = ...;
PSPDFKit.invalidateDocumentCache(context, changedDocument, true);
```

## Many more improvements

* If your app relied on triggering the annotation creation mode manually, we updated the API for you: It is now possible to choose different creation modes that use the same annotation type. To do so, we introduced the [`AnnotationCreationMode`] and a method [`PSPDFFragment#enterAnnotationCreationMode(AnnotationCreationMode)`]. The old method, taking an `AnnotationType` still exists in this version, but was deprecated and will be removed in a future update.

```java
getPSPDFFragment().enterAnnotationCreationMode(AnnotationCreationMode.IMAGE);
```

* The new [`DocumentSource`] is a unified object for describing the source of a document. It can be constructed from either a `Uri` or a `DocumentProvider`. We added methods to the [`PSPDFKit`] class for opening documents using the [`DocumentSource`].

* Examples say more than 1000 words, so we updated our guides and added several new examples to the catalog app. The `CustomSharingMenuExample` shows how to add custom share actions to the sharing menu of a [`PSPDFActivity`]. The `DocumentProcessorExample` has been extended, now showcasing how to rotate pages and how to add pages using the [`PSPDFProcessor`]. And the `DocumentDownloadExample` describes how to use our new downloader API.

If you'd like to explore all the improvements we made in this release, have a look at our [full list of changes in PSPDFKit 2.6 for Android](/changelog/android/#2.6.0) or try out our [PDF Viewer App for Android - currently in beta and free](/viewer/).

[`stampannotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/StampAnnotation.html
[`stamptype`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/stamps/StampType.html
[`sharingmenu`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/actionmenu/SharingMenu.html
[`actionmenu`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/actionmenu/ActionMenu.html
[`defaultsharingmenu`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/actionmenu/DefaultSharingMenu.html
[`pspdffragment`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfFragment.html
[`downloadsource`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/download/source/DownloadSource.html
[`downloadjob`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/download/DownloadJob.html
[`downloadrequest`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/download/DownloadRequest.html
[`downloadjob#startdownload(downloadrequest)`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/download/DownloadJob.html#startDownload(com.pspdfkit.document.download.DownloadRequest)
[`pspdfkit#clearcaches`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/PSPDFKit.html#clearCaches(android.content.Context,%20boolean)
[`pspdfkit#invalidatedocumentcache`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/PSPDFKit.html#invalidateDocumentCache(android.content.Context,%20com.pspdfkit.document.PSPDFDocument,%20boolean)
[`pspdfkit#invalidatepagecache`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/PSPDFKit.html#invalidatePageCache(android.content.Context,%20com.pspdfkit.document.PSPDFDocument,%20int,%20boolean)
[`analyticsclient`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/analytics/AnalyticsClient.html
[`pspdfkit#addanalyticsclient`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/PSPDFKit.html#addAnalyticsClient(com.pspdfkit.analytics.AnalyticsClient)
[`analytics.event`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/analytics/Analytics.Event.html
[`pspdfprocessor`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/processor/PdfProcessor.html
[`bitmap`]: https://developer.android.com/reference/android/graphics/Bitmap.html
[`pspdfactivity`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html
[`pspdffragment#enterannotationcreationmode(annotationcreationmode)`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfFragment.html#enterAnnotationCreationMode(com.pspdfkit.ui.special_mode.controller.AnnotationTool)
[`annotationcreationmode`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/special_mode/controller/AnnotationTool.html
[`documentsource`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/DocumentSource.html
[`pspdfkit`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/PSPDFKit.html
[`contextualtoolbarmenuitem#setsubmenuitems`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/toolbar/ContextualToolbarMenuItem.html#setSubMenuItems(java.util.List<com.pspdfkit.ui.toolbar.ContextualToolbarMenuItem>)
