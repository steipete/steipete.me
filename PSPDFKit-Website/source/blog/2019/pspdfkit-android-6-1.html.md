---
title: "PSPDFKit 6.1 for Android"
description: Introducing PSPDFKit 6.1 for Android — with improvements to accessibility, availability of PDF page overlay views, support for custom document outlines, and more.
preview_image: /images/blog/2019/pspdfkit-android-6-1/android-6-1-header.png
preview_video: /images/blog/2019/pspdfkit-android-6-1/android-6-1-header.mp4
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/Flashmasterdash
date: 2019-12-17 07:00 UTC
tags: Android, Development, Products
published: true
---

Today we’re releasing PSPDFKit 6.1 for Android, which features improvements to accessibility, availability of PDF page overlay views, support for custom document outlines, and more.READMORE In this blog post, we only scratch the surface of what we ship with 6.1, so for a full list of changes, please refer to our [PSPDFKit 6.1 for Android changelog][changelog].

## Improved TalkBack Support

With PSPDFKit 6 for Android, we improved accessibility in all parts of our framework. We ensured that navigating our UI using a keyboard is easy and intuitive, and we focused on enhanced interoperability between our framework and accessibility services like Google’s TalkBack.

![TalkBack Improvements Illustration](/images/blog/2019/pspdfkit-android-6-1/talkback-gestures.png)

With today’s 6.1 release, we’re deepening our integration into accessibility services even more by adding support for TalkBack page navigation gestures. By using the new two-directional swipe, a gesture which is familiar to all TalkBack users, it is now possible to go to the next page (swipe right, then swipe left) or to the previous page (swipe left, then swipe right) in a document. This works independently of the currently focused view, giving the highest possible amount of flexibility in navigating the UI and document.

## Page Overlay Views

PSPDFKit aims to enable the implementation of a diverse set of use cases. With custom page overlay views, we hope to address the needs of many of our customers who want to build rich interactive solutions based on PDF technology.

A page overlay view is a regular Android [`View`][android view] that is placed on a PDF page using [PDF coordinates][coordinates guide]. Internally, PSPDFKit for Android is also using page overlay views for adding annotations, editing controls, the floating toolbar, and several other features. Our new public overlay views API exposes this framework and allows customers to add their own views to PDF pages:

```kotlin
// Any regular Android view can be added to a PDF page too.
val view = MyCustomInfoView(context)

// You can add views at any time by creating a custom overlay view provider.
val overlayProvider = object : OverlayViewProvider() {
    override fun getViewsForPage(context: Context,
                                 document: PdfDocument,
                                 pageIndex: Int): List<View> {
        val pagePosition = RectF(0f, 100f, 100f, 0f)
        val sizingMode = SizingMode.LAYOUT
        view.layoutParams = OverlayLayoutParams(pagePosition, sizingMode)
        return listOf(view)
    }
}

// Adding the overlay provider will automatically make views visible.
pdfFragment.addOverlayProvider(overlayProvider)
```

For more information on page overlay views, please refer to our [page overlay views guide][].

## Custom Document Outlines

PDF documents are the primary source of data when using PSPDFKit. However, in some scenarios, additional data sources may be necessary, and PSPDFKit should adapt to these requirements. As such, with PSPDFKit 6.1 for Android, we’re introducing a new method, [`setDocumentOutlineProvider()`][setdocumentoutlineprovider], which allows developers to display outlines from custom sources inside [`PdfOutlineView`][pdfoutlineview]:

```kotlin
// Using the new builder API, we can conveniently create custom outlines.
pspdfKitViews.outlineView?.setDocumentOutlineProvider {
    Single.fromCallable {
        listOf(
            OutlineElement.Builder("With Children")
                .setChildren(listOf(
                    OutlineElement.Builder("Children 1").build(),
                    OutlineElement.Builder("Children 2").build(),
                    OutlineElement.Builder("Children 3").build()))
                .setExpanded(true)
                .build(),
            OutlineElement.Builder("Uri Action")
                .setAction(UriAction("https://pspdfkit.com"))
                .build()
        )
    }
}
```

For additional information, please refer to our API documentation on the [`DocumentOutlineProvider`][documentoutlineprovider] and the [`OutlineElement.Builder`][outlinelementbuilder].

## And More

- We improved our Simple Example app that ships with our library. It now provides extensive documentation on how to set up your app with PSPDFKit, in order to get you started even faster.
- We added an [`@Experimental`][experimental] annotation to mark new and incubating APIs that are likely to change in future versions of PSPDFKit. We also added a lint check that will warn you when using experimental or [private APIs][private apis] in your app.
- We added the [`requirePdfFragment()`][requirepdffragment] method to [`PdfActivity`][pdfactivity]. This method is marked as `@NonNull` and performs an internal check to see if there is a [`PdfFragment`][pdffragment] instance attached to the activity before returning it. This allows for cleaner use of [`PdfFragment`][pdffragment] within Kotlin code.

As always, this is just a sneak peek of the enhancements we added to this release. To see a complete list of changes, check out the [PSPDFKit 6.1 for Android changelog][changelog].

[migration guide]: /guides/android/current/migration-guides/pspdfkit-6-1-migration-guide/
[changelog]: /changelog/android/#6.1.0
[android view]: https://developer.android.com/reference/android/view/View
[coordinates guide]: /guides/android/current/faq/coordinate-spaces/
[page overlay views guide]: /guides/android/current/features/overlay-views
[pdfoutlineview]: /api/android/reference/com/pspdfkit/ui/PdfOutlineView.html
[setdocumentoutlineprovider]: /api/android/reference/com/pspdfkit/ui/PdfOutlineView.html#setDocumentOutlineProvider(com.pspdfkit.ui.PdfOutlineView.DocumentOutlineProvider)
[documentoutlineprovider]: /api/android/reference/com/pspdfkit/ui/PdfOutlineView.DocumentOutlineProvider.html
[outlinelementbuilder]: /api/android/reference/com/pspdfkit/document/OutlineElement.Builder.html
[requirepdffragment]: /api/android/reference/com/pspdfkit/ui/PdfUi.html#requirePdfFragment()
[pdfactivity]: /api/android/reference/com/pspdfkit/ui/PdfActivity.html
[pdffragment]: /api/android/reference/com/pspdfkit/ui/PdfFragment.html
[experimental]: /api/android/reference/com/pspdfkit/Experimental.html
[private apis]: /guides/android/current/announcements/unsupported-internal-symbols