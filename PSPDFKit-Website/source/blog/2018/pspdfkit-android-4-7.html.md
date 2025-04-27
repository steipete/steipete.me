---
title: "PSPDFKit 4.7 for Android"
description: "Introducing PSPDFKit 4.7 for Android — featuring JavaScript support, a document info view, free text callouts, and more."
preview_image: /images/blog/2018/pspdfkit-android-4-7/pspdfkit-android-4-7-header.png
preview_video: /images/blog/2018/pspdfkit-android-4-7/android-4-7.mp4
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/flashmasterdash
date: 2018-07-09 12:00 UTC
tags: Android, Products, Features
published: true
---

Today we’re proud to announce the immediate availability of PSPDFKit 4.7 for Android. In this release, we’re rolling out JavaScript support, a document info view, free text callouts, and more.READMORE For a full list of changes, head over to our [changelog for PSPDFKit 4.7 for Android][PSPDFKit 4.7 for Android changelog].

READMORE

## JavaScript Support

One great trait of the PDF format is its versatility by extensibility. With PSPDFKit 4.7 for Android, we’re building on that extensibility by rolling out full support for JavaScript in PDFs. Adding JavaScript to PDFs opens up new possibilities like dynamic content, computed form properties, and even small applications inside documents.

With our new APIs, adding JavaScript is as simple as creating a [`JavaScriptAction`][] instance. JavaScript actions can be evaluated directly by passing them to the [`executeAction()`][] method of your [`PdfFragment`][]. You can also attach them to interactive parts of a PDF like annotations, form fields, or outline elements, deferring their evaluation to when a user interacts with these elements.

Here’s a small example of how to flip a page and show an alert to the user:

[==

```kotlin
// Create executable JavaScript using an action.
val pageFlipAction = JavaScriptAction("""
    doc.pageNum = doc.pageNum + 1;
    app.alert('Moved to page with index ' + doc.pageNum + '!');
""")

// To evaluate the JavaScript, simply trigger execution of the action.
pdfFragment.executeAction(pageFlipAction)
```

```java
// Create executable JavaScript using an action.
final JavaScriptAction pageFlipAction = new JavaScriptAction(
    "doc.pageNum = doc.pageNum + 1;\n" +
    "app.alert('Moved to page with index ' + doc.pageNum + '!');"
);

// To evaluate the JavaScript, simply trigger execution of the action.
getPdfFragment().executeAction(pageFlipAction);
```

==]

To get you started quickly, we prepared a guide on how to use our [JavaScript APIs][].

## Document Info View

PDF documents are made up of many attributes that might need to be inspected or edited: the document title, authors, keywords, creation and modification dates, permissions, and much more. With PSPDFKit 4.7 for Android, we’re introducing [`PdfDocumentInfoView`][], a UI component for displaying and modifying many of the items that make up PDF metadata.

<video src="/images/blog/2018/pspdfkit-android-4-7/document-info.mp4" playsinline loop muted data-controller="video" data-video-autoplay="true" width="100%"></video>

Document info is directly integrated into the [`PdfActivity`][] app bar and is just a tap away. If you don’t want to display document info in your app, you can disable it using [`activityConfiguration.disableDocumentInfoView()`][]. [`PdfDocumentInfoView`][] is a normal view and can also be integrated into you custom activity or UI:

[==

```kotlin
// Create the view using its constructor.
val infoView = PdfDocumentInfoView(context).apply {
    // All you need to do is set the document on the view.
    document = pdfFragment.document
}
// Add the view to your layout.
container.addView(infoView)
```

```java
// Create the view using its constructor.
final PdfDocumentInfoView infoView = new PdfDocumentInfoView(context);
// All you need to do is set the document on the view.
infoView.setDocument(getPdfFragment().getDocument());
// Add the view to your layout.
container.addView(infoView);
```

==]

## Free Text Callouts

With PSPDFKit 4.7 for Android, we’re improving on free text annotations by adding support for free text intents and callouts. A callout can be created like any other [`FreeTextAnnotation`][], and by then setting the [`FREE_TEXT_CALLOUT`][] intent and specifying a list of points defining the callout line:

[==

```kotlin
val freeTextAnnotation = FreeTextAnnotation(pageIndex, pageRect, contents)
  .apply {
      textInsets = EdgeInsets(0f, 150f, 0f, 0f)
      intent = FreeTextAnnotationIntent.FREE_TEXT_CALLOUT
      callOutPoints = listOf(
          PointF(255f, 195f),
          PointF(325f, 150f),
          PointF(400f, 150f)
      )
  }
```

```java
final FreeTextAnnotation freeTextAnnotation = new FreeTextAnnotation(pageIndex, pageRect, contents);
freeTextAnnotation.setTextInsets(new EdgeInsets(0, 150f, 0, 0));
freeTextAnnotation.setIntent(FreeTextAnnotation.FreeTextAnnotationIntent.FREE_TEXT_CALLOUT);

List<PointF> points = new ArrayList<>(3);
points.add(new PointF(255f, 195f));
points.add(new PointF(325f, 150f));
points.add(new PointF(400f, 150f));
freeTextAnnotation.setCallOutPoints(points);
```

==]

In the user interface, PSPDFKit 4.7 for Android supports full callout editing, including point editing, configuration of colors, and line end caps. Moreover, we replaced the measurement algorithms that were used when creating new free text annotations. This now allows annotations to automatically grow while entering text. As a result, their content won’t overflow if it’s too long; instead, it’s always fully visible.

## And More!

* We added support for setting, retrieving, and evaluating additional actions on widget annotations and form fields via [`WidgetAnnotation#getAdditionalActions()`][].
* We improved image document performance and added support for printing of image documents.

We hope you like the changes in PSPDFKit 4.7 for Android — we’re already working on our next great release, so stay tuned! To see a comprehensive list of changes in this release, check out the [PSPDFKit 4.7 for Android changelog][].

[`PdfDocumentInfoView`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/documentinfo/PdfDocumentInfoView.html
[`FreeTextAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/FreeTextAnnotation.html
[`FREE_TEXT_CALLOUT`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/FreeTextAnnotation.FreeTextAnnotationIntent.html
[`WidgetAnnotation#getAdditionalActions()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/WidgetAnnotation.html#getAdditionalActions()
[`PdfFragment`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfFragment.html
[`JavaScriptAction`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/actions/JavaScriptAction.html
[`executeAction()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfFragment.html#executeAction(com.pspdfkit.annotations.actions.Action)
[JavaScript APIs]: https://pspdfkit.com/guides/android/current/features/javascript/
[`activityConfiguration.disableDocumentInfoView()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html#disableDocumentInfoView()
[PSPDFKit 4.7 for Android changelog]: https://pspdfkit.com/changelog/android/#4.7.0
[`PdfActivity`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html
