---
title: "PSPDFKit 2.1 for Android"
pubDate: 2016-01-27T12:00:00.000Z
description: "The PSPDFKit Android team has been working hard to bring you the next release – PSPDFKit 2.1 for Android – with many features and improvements. READMORE"
tags:
  - pspdfkit
source: pspdfkit.com
---

::ai[The PSPDFKit Android team has been working hard to bring you the next release – PSPDFKit 2.1 for Android – with many features and improvements. READMORE]

The PSPDFKit Android team has been working hard to bring you the next release – PSPDFKit 2.1 for Android – with many features and improvements.
READMORE

## Indexed Full-Text Search

This release adds powerful PDF indexing capabilities via the `PSPDFLibrary` class. You can easily create a searchable index of all your PDF documents and then query that index within seconds. Our custom indexer can even search Chinese, Japanese, and Korean text.

Indexed Full-Text Search is an optional feature — [contact our sales team](mailto:sales@pspdfkit.com) for details. You can find more about this in [our guide on document indexing and searching](https://pspdfkit.com/guides/android/current/features/indexed-full-text-search/).

![Full-text search in catalog app](/images/blog/2016/pspdfkit-android-2-1/full_text_search_landscape.gif)

## PDF Editing

`PSPDFProcessor` is a convenient new API for performing document manipulation tasks such as splitting or merging documents, or flattening annotations. Possible use cases include:

* Extracting pages into another document. You can specify any number of pages from the original document and write them to a new document.

* Combining multiple documents into a single document. This can be achieved easily by loading a compound `PSPDFDocument` from multiple sources, then writing it back to a single file.

* Removing or flattening annotations. You can specify all annotations, only annotations of a specific type (for example, remove all highlights), or a particular set of annotations.

For more information, you can have a look at our [our Document Processing guide](https://pspdfkit.com/guides/android/current/features/document-processing/) or at the `DocumentProcessingExample` inside the catalog app (which shows page extraction, compound document merging, annotation flattening, and annotation deletion).

![processing documents](/images/blog/2016/pspdfkit-android-2-1/document-processing.png)

## Incremental Annotation Saving

Annotations can now be saved incrementally, which is much faster. Instead of rewriting the whole file, PSPDFKit now only writes out the parts of a document that have been changed. This is enabled by default.

There are a few exceptions where incremental saving is not possible, such as encrypted documents. As the encryption is applied to the file as a whole, the complete file needs to be written out before it’s encrypted.

## Annotation List

The new _annotation list_ was added to the existing `PSPDFOutlineView` allowing users to quickly navigate annotations in the document. The annotation list is configurable, allowing you to display only the annotation types you need, or even hide the list completely. Have a look at the new `enableAnnotationList`, `disableAnnotationList`, and `listedAnnotationTypes` setters on `PSPDFActivityConfiguration`.

![Annotation list](/images/blog/2016/pspdfkit-android-2-1/annotation_list.gif)

## Migration to AppCompat-v7

While PSPDFKit always had optionally support for Google’s `AppCompatActivity` by using the `PSPDFAppCompatActivity`, version 2.1 goes one step further by making the `AppCompatActivity` the default implementation of the `PSPDFActivity`. This change comes with multiple benefits:

* Better device support, since `AppCompatActivity` provides support for many of the newer Android features back to devices with Android API level 7.
* More frequent updates, since new versions of the `appcompat-v7` library are released more frequently than Android.
* Simplifies PSPDFKit, making it easier to get started — and also letting us focus on new features instead of duplicate maintenance.

If you have previously used the old `PSPDFActivity`, you might find our [AppCompat Migration Guide](https://pspdfkit.com/guides/android/current/migration-guides/pspdfkit-2-1-migration-guide/) helpful.

## Additional Improvements

A lot of work went into improvements, changes, and fixes to the API and the framework itself. Here is a short overview.

* New text selection API with the easier to use `TextSelectionListener` and the possibility to select text programmatically. For more information, see our [Text Selection Guide](https://pspdfkit.com/guides/android/current/features/text-selection/).

* Added `PSPDFActivity#getPSPDFFragment` for direct access to the `PSPDFFragment` that is embedded in the activity.

* You can now lock document scroll and zoom by calling `PSPDFFragment#setScrollingEnabled(boolean enabled)` and `PSPDFFragment#setZoomingEnabled(boolean enabled)`.

* Improved method overloads for simpler API usage. For example, `PSPDFActivity#showDocument(Context, DataProvider, PSPDFActivityConfiguration)` for loading a document from a data provider, without specifying the password parameter.

* And of course, bug fixes. Many thanks to all customers that helped us by [sending bug reports and feedback](https://pspdfkit.com/support/request).

The full list of changes can be found in the [complete changelog for version 2.1](https://pspdfkit.com/changelog/android/#2.1.0).
