---
title: "PSPDFKit 2.7 for Android"
description: Another month, another version of PSPDFKit for Android. Say hello to 2.7!
preview_image: /images/blog/2016/pspdfkit-android-2-7/v2_7-android-header.png
section: blog

author:
  - Jernej Virag
  - David Schreiber‑Ranner
author_url:
  - https://twitter.com/jernejv
  - https://twitter.com/Flashmasterdash
date: 2016-11-07 12:00 UTC
tags: Android, Features, Products
published: true
---

Another month, another version of PSPDFKit for Android - say hello to 2.7: new annotation types, improved reading and editing UI, and better customizability! This blog post outlines the biggest changes at a glance.READMORE

If you want to test version 2.7 right now, download our [PDF Viewer for Android Beta](https://pdfviewer.io) on Google Play, which already features the latest updates.

## Signature annotations

PSPDFKit for Android now supports adding signatures to the document. There are two provided modes. The "My signature" mode is intended for app owners who want their signatures saved and available for later use. The "Customer signature" mode intended for customers and other participants – it provides one-time signing and doesn't save the signature.

![Signature annotation](/images/blog/2016/pspdfkit-android-2-7/signature-annotation.gif)

## Line annotations

As a result of our ongoing effort to bring you shape annotations, we now fully support [`LineAnnotation`] type both via API and the user interface. To create lines, select the line annotation type from the toolbar and draw a line on the PDF document similar to drawing ink annotations. Don't forget that we also support various line styles and line ends in the annotation inspector.

![Line annotation](/images/blog/2016/pspdfkit-android-2-7/line.gif)

Creating a [`LineAnnotation`] from code works just like with any other annotation type. The [`LineAnnotation`] has a constructor that accepts two points that define the line.

[==

```kotlin
val page = 0
val lineAnnotation = LineAnnotation(page, PointF(100f, 100f), PointF(200f, 200f))
document.annotationProvider.addAnnotationToPage(lineAnnotation)
```

```java
final int page = 0;
final LineAnnotation lineAnnotation = new LineAnnotation(page, new PointF(100f, 100f), new PointF(200f, 200f));
document.getAnnotationProvider().addAnnotationToPage(lineAnnotation);
```

==]

## More stamps (camera)

In this release, we have further extended [the existing image and stamp annotation support](../pspdfkit-android-2-6) with the ability to create image stamps from images captured with the device camera. We added a ready-to-use action to the annotation creation bar. Selecting the camera tool and tapping the document will open the camera app, allowing users to shoot a picture.

Regarding the API, we introduced the [`ImagePickerFragment`], a host for handling lifecycle and callbacks for calling the camera and retrieving the reuslts. The newly added [`BitmapUtils`] helps to decode those results into a bitmap before adding them as annotations. For an example of how to use this API, see the `DocumentProcessingExample` in our catalog app.

![Stamp image from camera](/images/blog/2016/pspdfkit-android-2-7/image-from-camera.gif)

## Non-tinted password drawables

When opening encrypted PDF documents, PSPDFKit for Android will show a password input dialog with a tinted drawable. This version adds the possibility to turn off tinting, allowing usage of pre-colored drawables. By default, tinting is enabled and can be disabled by setting [`PasswordViewThemeConfiguration.Builder#iconTintingEnabled`] to `false`.

[==

```kotlin
val passwordViewConfig = PasswordViewThemeConfiguration.Builder(context)
    .setIconResourceId(R.drawable.my_colored_password_drawable)
    .iconTintingEnabled(false)
    .build()

val configuration = PSPDFActivityConfiguration.Builder(context, YOUR_LICENSE)
    .passwordViewThemeConfiguration(passwordViewThemeConfiguration)
    .build()
```

```java
PasswordViewThemeConfiguration passwordViewConfig = new PasswordViewThemeConfiguration.Builder(context)
    .setIconResourceId(R.drawable.my_colored_password_drawable)
    .iconTintingEnabled(false)
    .build();

PSPDFActivityConfiguration configuration = new PSPDFActivityConfiguration.Builder(context, YOUR_LICENSE)
    .passwordViewThemeConfiguration(passwordViewThemeConfiguration)
    .build();
```

==]

## Close button in property inspector

We noticed that closing the annotation property inspector was not always as intuitive as we would have liked it to be. That's why this version introduces an omnipresent close button in the annotation inspector header. Tapping the button will immediately dismiss the inspector.

![Annotation inspector close button](/images/blog/2016/pspdfkit-android-2-7/close.gif)

## Scrollbars in documents

The [`PSPDFFragment`] now shows default Android scrollbars indicating the current scroll position inside the document, and the total scrollable range. Scrollbars are enabled by default, as it's the expected behavior of most Android users. Scrollbars are fully customizable. You can apply all existing [`View` attributes](https://developer.android.com/reference/android/view/View.html#lattrs) to change the orientation of scrollbars, their color, size, etc.

![Document scrollbars](/images/blog/2016/pspdfkit-android-2-7/scrollbars.gif)

Furthermore, we added the [`DocumentScrollListener`] interface for accessing raw scrollbar values on the fragment. You can use this to implement your custom scroll indicator views, or even navigation widgets. If you're not sure about the use case: Check out the `VerticalScrollBarExample` inside the catalog app, which shows how to use the new [`VerticalScrollBar`] for quick document navigation.

## Updated build target - API 25

We bumped our build targets to Android API 25 (Nougat 7.1) and also upgraded the support libraries to `25.0.0`. This allows us to fully support multi-window mode, document centric task handling, and also dynamic app shortcuts (as featured by our [PDF Viewer for Android](https://pdfviewer.io)). Furthermore, RxJava was updated to `1.2.2`, which contained a couple of performance enhancements.

![Support for Android Nougat 7.1 multi-window mode](/images/blog/2016/pspdfkit-android-2-7/multi-window.gif)

## Fixes, fixes, fixes

While introducing a lot of new features, we did not neglect existing framework components and APIs. This version also fixes issues around file downloads, annotation highlighting, rendering, input handling, and some more. For a full list of improvements and changes, have a look at our [full list of changes in PSPDFKit 2.7 for Android](/changelog/android/#2.7.0) or try out our app, [PDF Viewer for Android](https://pdfviewer.io).

[`lineannotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/LineAnnotation.html
[`imagepickerfragment`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/image/BaseImagePickerFragment.html
[`bitmaputils`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/image/BitmapUtils.html
[`passwordviewthemeconfiguration.builder#icontintingenabled`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfPasswordView.html#isIconTintingEnabled()
[`documentscrolllistener`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/listeners/scrolling/DocumentScrollListener.html
[`verticalscrollbar`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/scrollbar/VerticalScrollBar.html
[`stampannotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/StampAnnotation.html
[`stamptype`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/StampAnnotation.StampType.html
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
[`pspdfprocessor`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/processor/PSPDFProcessor.html
[`bitmap`]: https://developer.android.com/reference/android/graphics/Bitmap.html
[`pspdfactivity`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PSPDFActivity.html
[`pspdffragment#enterannotationcreationmode(annotationcreationmode)`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PSPDFFragment.html#enterAnnotationCreationMode(com.pspdfkit.ui.special_mode.controller.AnnotationCreationMode)
[`annotationcreationmode`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/special_mode/controller/AnnotationCreationMode.html
[`documentsource`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/DocumentSource.html
[`pspdfkit`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/PSPDFKit.html
[`contextualtoolbarmenuitem#setsubmenuitems`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/toolbar/ContextualToolbarMenuItem.html#setSubMenuItems(java.util.List<com.pspdfkit.ui.toolbar.ContextualToolbarMenuItem>)
