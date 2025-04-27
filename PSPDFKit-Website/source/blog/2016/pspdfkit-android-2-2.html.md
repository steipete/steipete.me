---
title: "PSPDFKit 2.2 for Android"
section: blog

author: Peter Steinberger
author_url: https://twitter.com/steipete
date: 2016-02-18 6:00 UTC
tags: Android, Features, New Release, Products
published: true
---

Our newest release of PSPDFKit 2.2 for Android comes with many improvements on annotation editing, search and the public API.
READMORE
We've gone ahead and outlined a few of the new features for both you and your users can enjoy. As always, you can find find the list of all changes in our [changelog for version 2.2](https://pspdfkit.com/changelog/android/#2.2.0).

## Multi-Page Editing
When in continuous scrolling mode, you can now create and edit annotations on all visible pages and fluently switch between editing tools, creating a very natural experience.

![Annotation editing across multiple pages](/images/blog/2016/pspdfkit-android-2-2/multi-page-editing.gif)

## Free Text Annotation Modes

The free text annotation now differentiates between *editing mode* and *writing mode*. Selecting the annotation will start the editing mode, which allows dragging and resizing of the annotation. Tapping the annotation a second time will enter a fully fledged writing mode, allowing text selection, copy & pasting, and many more features that Android users would expect from text inputs.

![New free text annotation writing mode](/images/blog/2016/pspdfkit-android-2-2/free-text-modes.gif)

Here are some more annotation editing highlights:

* You can now open the note annotation editor by simply double-tapping a previously selected note annotation.
* Automatically hides the soft keyboard once the free text annotation is deselected.
* If annotation editing is disabled, touching an existing text markup annotations won’t bring up the editing toolbar anymore – just as your users would expect.

## Better search integration

We’ve looked into improving how to enter and exit search. With the new improvements, you can now start a search from the selected text – useful if you want to search for further occurrences of the selected text. Also the inline search now has a Material design back arrow, which makes dismissing search even simpler.

![Search from selection / Close inline search](/images/blog/2016/pspdfkit-android-2-2/search-from-selection.gif)

## New Password Screen

The password screen that is shown when opening password protected documents has received a fresh design - goodbye mediocrity!

![New password screen](/images/blog/2016/pspdfkit-android-2-2/new-password-screen.gif)

## More Document Loading Options

We’re adding [`PSPDFKit#openDocumentFromSource`](https://pspdfkit.com/api/android/reference/com/pspdfkit/PSPDFKit.html#openDocumentFromSource(android.content.Context, com.pspdfkit.document.providers.DataProvider)) which allows you to synchronously load a [`PSPDFDocument`](https://pspdfkit.com/api/android/reference/com/pspdfkit/document/PSPDFDocument.html) – which is especially useful in Xamarin projects where asynchronous calls are not possible.

```java
final DataProvider source = new AssetDataProvider("files/marketing-material.pdf");
final PSPDFDocument document = PSPDFKit.openDocumentFromSource(source, configuration);
```

## Details, Details, Details

The real fun when using PSPDFKit comes from the many details and improvements that are added with every new version – with version 2.2 being no exception:

* The page number indicator (on the bottom of the viewer) will now fade in together with the system UI which makes finding the current page number a breeze.
  ![Page number indicator fades in with UI](/images/blog/2016/pspdfkit-android-2-2/page-number-indicator.gif)
* The quality of rendered pages while zooming has vastly improved.
* We have improved coordination of the outline view, the search view, and the annotation editing mode, which are now mutually exclusive.
* Since using an API in your IDE should be fun as well version 2.2 reintroduces named method parameters on all public API methods.
* The `PSPDFFragment` now supports nesting inside other fragments.
* This release fixed the curious case of premultiplied alpha in Android which you can read about [in a separate blogpost](https://pspdfkit.com/blog/2016/a-curious-case-of-android-alpha/) and which is also featured in this week’s issue of [Android Weekly](http://androidweekly.net/issues/issue-192)

If you'd like to explore all the improvements we made in this release, have a look at our [full list of changes in PSPDFKit 2.2 for Android](https://pspdfkit.com/changelog/android/#2.2.0).
