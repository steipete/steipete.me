---
title: "PSPDFKit 2.4 for Android"
section: blog

author:
  - Jernej Virag
  - David Schreiber‑Ranner
  - Ivan Skoric
author_url:
  - https://twitter.com/jernejv
  - https://twitter.com/Flashmasterdash
  - https://twitter.com/skoric_
date: 2016-06-08 12:00 UTC
tags: Android, Features, New Release, Products
published: true
---

We're proud to release [PSPDFKit 2.4 for Android](/changelog/android/#2.4.0), just under a month after the last release which included our new [Document Editor component](/blog/2016/the-document-editor/). This release is one of our largest so far and has many great improvements.
READMORE

## Toolbars

We've refurbished our toolbars which are now completely custom views, with new animations and features. Also, every toolbar is provided as an out-of-the-box view which means that it can be customized and bent to your will. One of the most notable changes are sub-menus and the ability to drag toolbars to the sides of the screen (by default only enabled for the annotation creation toolbar).

![New toolbar](/images/blog/2016/pspdfkit-android-2-4/new_toolbar.gif)

## Managing Special Modes

We've added a rather large API for controlling annotation creation, annotation editing, text selection and document editing modes. This means that you can implement a custom UI for interaction with these modes and get full control over them. For example, you can jump straight into drawing an ink annotation, defining the color and thickness that you want and get feedback on the process.

By combining this feature with the new toolbars, you can have toolbars within your custom activity that uses [`PSPDFFragment`][]. The new `AnnotationToolbarFragmentExample` inside the catalog app shows how to do this.

![Toolbar in fragment](/images/blog/2016/pspdfkit-android-2-4/toolbar_in_fragment.gif)

## Printing

Android 4.4 (API level 19) and higher provide services for printing documents from all applications. This allows developers to print content via [Google Cloud Print](https://www.google.com/cloudprint/learn/) or using third-party print services provided by printer manufacturers.

The new [`DocumentPrintManager`][] API now allows printing opened documents using these system services. For convenience we also added the ability to process documents before printing using our battle-tested [`PSPDFProcessor`][].

In terms of UI we added a new [`DocumentPrintDialog`][] so your users can easily customize how the document will get processed before printing.

Our job here at PSPDFKit is making your lives as developers easier. Because of this we integrated the whole print functionality into [`PSPDFActivity`][] making it ready to use with virtually no effort. This is enabled by default on all supported platforms. There's a new [`printingEnabled`][] property in [`PSPDFActivityConfiguration`][] to customize this.

![Printing support](/images/blog/2016/pspdfkit-android-2-4/printing.gif)

## Accessibility and Now-On-Tap

PSPDFKit 2.4 is more accessible: it extracts textual page content and passes it to Android's Accessibility Framework and Google Now. This means that TalkBack will now work perfectly with PSPDFKit and, with improved keyboard support, users with varied abilities will be able to read PDF documents. This update also greatly improves Google Now-On-Tap compatibility, so your users can quickly lookup information about topics in the displayed document.

![Google Now-On-Tap support](/images/blog/2016/pspdfkit-android-2-4/now-on-tap.gif)

## Screen Reader Example

Also in the context of accessibility we added the `ScreenReaderExample` to our catalog app. The PSPDFKit catalog app is the first stop for many of our customers to find runnable code examples and as such for us a very important means of documentation. Furthermore, the catalog app is a show-reel of available features and of what is possible with PSPDFKit.

The screen reader example uses our [drawable API](/guides/android/current/features/drawable-api/) to highlight text that is read from a PDF document via text-to-speech. While the implemented example is pretty simple (it reads and highlights any given English PDF document sentence by sentence) it shows the ease of creating screen reader apps and serves as a possible starting point for more complex apps.

If you're interested in the details of how the `ScreenReaderExample` was created and how it works, [follow us on Twitter](https://twitter.com/PSPDFKit) as we will release a separate blog post about the screen reader soon.

![Screen reader example](/images/blog/2016/pspdfkit-android-2-4/screenreader.gif)

## Thumbnail Grid

PSPDFKit 2.4 adds new features to the previously refurbished [`PSPDFThumbnailGrid`][]. The grid will now highlight the currently active page and will update this highlight whenever the active page is changed. Furthermore, when opening the grid it will automatically scroll to the active page, which is especially useful when viewing large PDF documents with many pages.

On the API side we simplified the [`PSPDFThumbnailGrid`][] class which now implements the [`DocumentListener`][] interface to listen for document changes. If you are using the [`PSPDFThumbnailGrid`][] in your custom activity, you can register it on the fragment by calling `fragment.registerDocumentListener(thumbnailGrid)`. Speaking of custom code, we introduced two new styles `pspdf__itemLabelTextStyle` and `pspdf__itemLabelBackground` which can be used to customize the look and feel of the thumbnail grid in your app.

![Highlights in PSPDFThumbnailGrid](/images/blog/2016/pspdfkit-android-2-4/highlighted-grid.jpg)

## Document Processing and Creation

With 2.3 we introduced our [Document Editor](https://pspdfkit.com/guides/android/current/features/document-editor/) – but there is still more to come. With 2.4 we have many additions to the [`PSPDFProcessor`][] class. Using the new public constructor [`PSPDFProcessorTask(NewPage)`][] you can quickly create a document from scratch, adding one or more pages based on a set of predefined page templates.

We added the ability to resize existing pages using the [`PSPDFProcessorTask#resizePage`][] method. Calling this method will resize the whole page (i.e. the media box) while proportionally scaling the content and all annotations to fit the new page size.

And yet there is more: We improved the processor's performance, made async processing cancellable, added the [`OutputStream`][] as additional processor output, et cetera, et cetera.

## Restoring the Viewport

Rotating the device no longer zooms out — PSPDFKit now remembers its last viewport and tries to restore it as closely as possible. This is extremely useful on smaller devices where you almost always need to zoom in to read a page.

![Highlights in PSPDFThumbnailGrid](/images/blog/2016/pspdfkit-android-2-4/viewstate-restoration.gif)

## Library Hardening

In our ongoing effort to secure against malicious PDF documents we added another level of security. This time hardening was done around well known [bugs inside Android's Stagefright media subsystem](https://en.wikipedia.org/wiki/Stagefright_(bug)). In addition to the already used `pspdfkit://` prefix which has to be added to video URIs to enable local and remote video playback we now by default deactivate video playback altogether making this an opt-in feature. If your app does not require video support inside PDF documents it can no longer be tampered with using primed PDF documents. To enable video playback for your PDF documents it's as simple as calling [`builder.videoPlaybackEnabled(true)`][] on the [`PSPDFConfiguration.Builder`][].

Furthermore we've reviewed low-level memory and string handling functions in our native code and replaced them with modern secure variants where applicable. In addition, test coverage was expanded.

## Dependencies

PSPDFKit 2.4 uses the latest version RxJava 1.1.5 and RxAndroid 1.2.0. With this version we intentionally stayed at the more stable support libraries v23.2.1 since version 23.3.0 introduced issues around fragment transactions that could cause issues for some users. We're constantly keeping track of any new support library changes and releases and will update to the next stable version once all critical bugs have been fixed.

## Details

The catalog app now comes with a brand-new `Guide-v2.pdf` as the default PDF document.  Besides the fresh look it describes the up-to-date way of integrating PSPDFKit into your Android app and also gives examples of how to do that with Kotlin.

We further tweaked our scrolling and gesture detection logic to deliver an even better experience. Scrolling now even works while a pinch-to-zoom gesture is active which gives the interaction a more natural feel. We are investing a lot of time to get the small details like this one just right.

We increased visibility of the `PSPDFDrawableProvider#notifyDrawablesChanged` methods, which are now `public` and can thus be called from other classes (e.g. their enclosing classes). Also the adapter's `#getDrawablesForPage` and `#getDrawablesForPageAsync` methods now use the upper-bounded wildcard `? extends PSPDFDrawable` for their return values, which makes it easier to write clean implementations without triggering IDE warnings.

If you'd like to explore all the improvements we made in this release, have a look at our [full list of changes in PSPDFKit 2.4 for Android](https://pspdfkit.com/changelog/android/#2.4.0).

[`PSPDFFragment`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfFragment.html
[`DocumentPrintManager`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/printing/DocumentPrintManager.html
[`PSPDFProcessor`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/processor/PdfProcessor.html
[`DocumentPrintDialog`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/dialog/DocumentPrintDialog.html
[`PSPDFActivity`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html
[`printingEnabled`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html#enablePrinting()
[`PSPDFActivityConfiguration`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.html
[`PSPDFThumbnailGrid`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfThumbnailGrid.html
[`DocumentListener`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/listeners/DocumentListener.html
[`PSPDFProcessorTask(NewPage)`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/processor/PdfProcessorTask.html#newPage(com.pspdfkit.document.processor.NewPage)
[`PSPDFProcessorTask#resizePage`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/processor/PdfProcessorTask.html#resizePage(int,%20com.pspdfkit.utils.Size)
[`OutputStream`]: https://developer.android.com/reference/java/io/OutputStream.html
[`builder.videoPlaybackEnabled(true)`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/PdfConfiguration.Builder.html#videoPlaybackEnabled(boolean)
[`PSPDFConfiguration.Builder`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/PdfConfiguration.Builder.html
