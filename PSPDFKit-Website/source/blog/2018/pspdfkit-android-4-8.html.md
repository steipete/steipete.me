---
title: "PSPDFKit 4.8 for Android"
description: "Introducing PSPDFKit 4.8 for Android — with document tabs, a pop-up toolbar, custom free text fonts, a new Document Editor API, and more."
preview_image: /images/blog/2018/pspdfkit-android-4-8/pspdfkit-android-4-8-header.png
preview_video: /images/blog/2018/pspdfkit-android-4-8/android-4-8.mp4
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/flashmasterdash
date: 2018-09-05 7:00 UTC
tags: Android, Products, Features
published: true
---

Today we’re excited to announce PSPDFKit 4.8 for Android, which features support for document tabs, a pop-up toolbar, custom free text fonts, a new Document Editor API, and much more. This blog post only scratches the surface of what is in this release. As always, you can find the full list of features in our [changelog for PSPDFKit 4.8 for Android][changelog].

READMORE

## Tabs

With tabs we’re bringing another high-demand feature to PSPDFKit for Android. It is now possible to open multiple documents inside a single activity. Doing so results in the appearance of a material design tab strip for switching between as many documents as you would like. The tab strip shows each document’s name, and it allows the dismissing of documents, as well as reordering.

<video src="/images/blog/2018/pspdfkit-android-4-8/tabs.mp4" playsinline loop muted data-controller="video" data-video-autoplay="true" width="100%"></video>

Management of documents inside a `PdfActivity` is done via the new `PdfDocumentCoordinator` that can be retrieved by calling `getDocumentCoordinator()`:

[==

```MyActivity.kt
fun addDocumentFromUri(uri: Uri) {
  // The descriptor serves as a handle to the document inside the activity.
  // The descriptor also encodes the UI state of a specific document.
  val descriptor = DocumentDescriptor.fromDocumentSource(DocumentSource(uri))

  // Add the document to the end of the tab strip.
  documentCoordinator.addDocument(descriptor)

  // Make the newly added document the actively visible one.
  documentCoordinator.setVisibleDocument(descriptor)
}
```

```MyActivity.java
void addDocumentFromUri(Uri uri) {
  // The descriptor serves as a handle to the document inside the activity.
  // The descriptor also encodes the UI state of a specific document.
  final DocumentDescriptor descriptor =
    DocumentDescriptor.fromDocumentSource(new DocumentSource(uri));

  // Add the document to the end of the tab strip.
  getDocumentCoordinator().addDocument(descriptor);

  // Make the newly added document the actively visible one.
  getDocumentCoordinator().setVisibleDocument(descriptor);
}
```

==]

To help you get started quickly with tabs, we added a new `DocumentTabsExample` to our Catalog app.

## Pop-Up Toolbar

With PSPDFKit 4.8 for Android, we’re introducing a new generic `PopupToolbar` widget that can be used to display a pop-up menu on top of a PDF document. By default, when performing text selection, the new pop-up toolbar replaces the previously used contextual toolbar. If you want to keep the original toolbar behavior, you can set `PdfActivityConfiguration.Builder#textSelectionPopupToolbarEnabled()` to `false`.

<video src="/images/blog/2018/pspdfkit-android-4-8/copy-paste.mp4" playsinline loop muted data-controller="video" data-video-autoplay="true" width="100%"></video>

## Custom Free Text Fonts

With 4.8, we’re rolling out custom fonts for free text annotations, which are usable via both the APIs and the user interface. We added a new setter, `FreeTextAnnotation#setFontName()`, which you can use to set the font of an annotation to use any of the available system fonts. To make font handling even simpler, we added the `FontManager` class, which will help with fetching the list of available `Font`s on the current device:

[==

```kotlin
val fontManager = PSPDFKit.getSystemFontManager()
val fonts = fontManager.availableFonts

// Set the name of a font to use it for the annotation.
freetextAnnotation.fontName = fonts.first().name
```

```java
final FontManager fontManager = PSPDFKit.getSystemFontManager();
final List<Font> fonts = fontManager.getAvailableFonts();

// Set the name of a font to use it for the annotation.
freetextAnnotation.setFontName(fonts.get(0).name);
```

==]

In the user interface, we added a new `FontPickerInspectorView` for the annotation inspector, which is used for selecting from the existing system fonts.

![Free fext fonts](/images/blog/2018/pspdfkit-android-4-8/freetext-fonts.gif)

## And Much More

* With Google [requiring all apps to ship 64-bit binaries starting in late 2019][64-bit], we decided to enable distribution of `x86_64` binaries within PSPDFKit for Android. Check out our [updated list of supported ABIs][supported-abis] and find out how to [minimize your APK][minimize-apk] while keeping full ABI support.
* Starting with this release, PSPDFKit will automatically draw behind “notches” and other screen cutouts on all devices running Android P or newer.
* We completely rewrote our [Document Editor][document-editor-feature] component’s public API, which now provides a fully-fledged model layer that drives our existing Document Editor UI. Check out our updated [Document Editor API guide][document-editor-guide] to learn about all the changes.

We hope you like the changes that come along with PSPDFKit 4.8 for Android — rest assured there is more great stuff lined up for upcoming releases. To see a comprehensive list of changes in this release, check out the [PSPDFKit 4.8 for Android changelog][changelog].

[changelog]: https://pspdfkit.com/changelog/android/#4.8.0
[64-bit]: https://android-developers.googleblog.com/2017/12/improving-app-security-and-performance.html
[supported-abis]: https://pspdfkit.com/guides/android/current/faq/architectures/
[minimize-apk]: https://pspdfkit.com/guides/android/current/faq/framework-size/#reducing-the-size-of-your-app
[document-editor-guide]: https://pspdfkit.com/guides/android/current/features/document-editor/
[document-editor-feature]: https://pspdfkit.com/pdf-sdk/android/document-editor/
