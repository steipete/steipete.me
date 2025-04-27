---
title: "PSPDFKit 2.9 for Android"
description: Today we're releasing PSPDFKit 2.9 for Android!
section: blog
author:
  - Tomáš Šurín
  - Aditya Krishnadevan
author_url:
  - https://twitter.com/tomassurin
  - https://twitter.com/caughtinflux
date: 2017-01-24 14:00 UTC
tags: Android, Features, Products
published: true
---

Today we are bringing you the first big update of PSPDFKit for Android in 2017 - version 2.9, including dual-page scrolling mode, custom localizations support, improved theming, better API and more.

READMORE

## Dual-Page Scrolling Mode

One of the most requested features in the last year was dual-page scrolling mode. And it's finally here with all of its glory!

![Dual-page mode](/images/blog/2017/pspdfkit-android-2-9/dual-page-mode.gif)

Dual-page scrolling mode is enabled by default on all devices that are wide enough to support it (i.e. tablets in landscape). Therefore, to start using it, you don't need to change your configuration. We also made many aspects of the new scrolling mode customizable so that you can build a UI that fits your needs. Take a look into [`PSPDFActivityConfiguration.Builder`] and discover all the new options, like [`layoutMode`], [`firstPageAlwaysSingle`] and [`showGapBetweenPages`], for yourself.

## Localizations

We are shipping [localizations for more than 20 languages](/guides/android/current/features/localization/). In this release, we've added all the necessary machinery to enable you to add or override existing localizations during application runtime. You can even add support for brand new languages.

For this to work, you need to implement your own [`LocalizationListener`] or override its default implementation [`DefaultLocalizationListener`] and set it via [`PSPDFKit#setLocalizationListener`].

## Dialog Styling

We've also expanded our already extensive set of theme-able attributes with more attributes for styling modal dialogs that are used across the framework. This means that our dialogs won't default to light theme anymore and can be tweaked to your liking. Another added benefit is that we've revisited all our dialog implementations and streamlined their design.

<img alt="Dialog styling" src="/images/blog/2017/pspdfkit-android-2-9/dark-themed-sharing-dialog.png" width=450 />

See the new [guide article](https://pspdfkit.com/guides/android/current/customizing-the-interface/modal-dialogs-styling/) for a list of new theme attributes. For comprehensive usage example, take a look into `dark_theme.xml` in our Catalog app.

## Document Title Overlay

We now show the document title in an overlay by default, because we noticed that the document title was truncated in the action bar on smaller screens for some documents. To customize this behavior, you can use [`hideDocumentTitleOverlay`] in [`PSPDFActivityConfiguration.Builder`] to always display the document title in the action bar.

<img alt="Document title overlay" src="/images/blog/2017/pspdfkit-android-2-9/document-title-overlay.png" width=450 />

## Collapsible Outline

The document outline now supports collapsible elements. This gives you a better overview when using documents with many outline elements.

![Collapsible outline](/images/blog/2017/pspdfkit-android-2-9/collapsible-outline.gif)

## API Polishing

Our long term goal when designing our API is to make it simple to use and be attentive to your needs. Since the last version, we've improved on various API, which were not that easy to use or were lacking in other aspects.

- It is now possible to selectively enable certain annotation tools. To specify which annotation tools are enabled we've added the method [`enabledAnnotationTools`] to [`AnnotationEditingConfiguration.Builder`]. See [the annotation editing configuration guide article](https://pspdfkit.com/guides/android/current/annotations/configuring-annotation-editing/#control-which-annotation-tools-are-enabled) for more details on how this interacts with existing configurable lists of editable annotation types.
- For those of you who are concerned about security, we've added an ability to disable text copying. All you need to do is implement the [`ApplicationPolicy`] interface or extend its default implementation [`DefaultApplicationPolicy`] and provide it when initializing PSPDFKit via [`PSPDFKit#initialize`]. We plan to support additional application policies in future versions.
- Custom stamps can now be created using a brand new builder style API. For more information take a look at [our guide article on configuring stamp annotations](https://pspdfkit.com/guides/android/current/annotations/stamp-annotations-configuration/).
- The signature annotation flow has been refactored and encapsulated to [`SignaturePickerFragment`]. This makes it possible to use our built-in signature dialog from any custom UI. For a comprehensive usage example refer to `CustomInkSignatureExample` in our Catalog app.
- If you'd like to customize the sharing and printing options dialogs, we added an ability to use your own implementation instead. If you are interested, take a look at [`setDocumentSharingDialogFactory`] and [`setDocumentPrintDialogFactory`] in [`PSPDFActivity`].
- The new method [`addAnnotationToPage`] in [`PSPDFFragment`] simplifies the process of adding new annotations to the page.

## Upgrades to Indexed Full Text Search

By [using `PSPDFLibrary`][], you were able to get fast and efficient full text search via a simple API. With this release, we reworked PSPDFLibrary internals. This means better speed (up to 10x) and lower memory usage. Because of this, you shouldn't hesitate even when throwing large document libraries at it. We also now use [SQLite's FTS 5], upgraded from FTS4.

With FTS 5, we get a lot of improvements, like:

- Lower memory usage: Due to its incremental nature, extraction of data in FTS 5 has a lower peak memory allocation than FTS 4.
- Faster search: With smart heuristics, the new engine can now determine if it is possible to extract results without inspecting the entire database.
- Faster insertions: Enqueuing documents to [`PSPDFLibrary`] is now much quicker in cases where additional operations need to be performed on the FTS tables.
- Fewer bugs: SQLite's FTS4 had a few issues with false positive results that have been resolved with FTS 5.

<blockquote style="font-size: 15px; border-left: none; background: #f6f6f6; font-style: italic;">
    <p>Since we've migrated to FTS5, all your documents will need to be reindexed.</p>
</blockquote>

## More Improvements

- We fixed a security issue where [`DocumentSharingProvider`] could expose other application files than those being shared. More information on this can be found in an [announcement](https://pspdfkit.com/guides/android/current/announcements/path-traversal-vulnerability/) we posted.
- Threading is hard. We fixed a race condition in our initialization code inside [`PSPDFKit#initialize`].
- Repeatedly highlighting the same sentence would not create overlapping highlights anymore.
- Document editor now retains non-saved editing state after rotation.

We also fixed a huge amount of other issues and introduced multiple minor enhancements in this release. If you're interested in all the details, see
[the full list of changes in PSPDFKit 2.9 for Android](/changelog/android/#2.9.0).

<!-- References -->

<!-- Dual page mode -->
[`PSPDFActivityConfiguration.Builder`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html
[`layoutMode`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html#layoutMode(com.pspdfkit.configuration.page.PageLayoutMode)
[`firstPageAlwaysSingle`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html#firstPageAlwaysSingle(boolean)
[`showGapBetweenPages`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html#showGapBetweenPages(boolean)

<!-- Localizations -->
[`LocalizationListener`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/listeners/LocalizationListener.html
[`DefaultLocalizationListener`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/listeners/DefaultLocalizationListener.html
[`PSPDFKit#setLocalizationListener`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/PSPDFKit.html#setLocalizationListener(com.pspdfkit.listeners.LocalizationListener)

<!-- Annotation editing configuration. -->
[`AnnotationEditingConfiguration.Builder`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/PdfConfiguration.Builder.html
[`#editableAnnotationTypes`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/PdfConfiguration.Builder.html#editableAnnotationTypes(java.util.List%3Ccom.pspdfkit.annotations.AnnotationType%3E)
[`enabledAnnotationTools`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/PdfConfiguration.Builder.html#enabledAnnotationTools(java.util.List%3Ccom.pspdfkit.ui.special_mode.controller.AnnotationTool%3E)
[`AnnotationTool`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/special_mode/controller/AnnotationTool.html

<!-- Application policy -->
[`ApplicationPolicy`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/policy/ApplicationPolicy.html
[`DefaultApplicationPolicy`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/policy/DefaultApplicationPolicy.html
[`PSPDFKit#initialize`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/PSPDFKit.html#initialize(android.content.Context,%20java.lang.String,%20com.pspdfkit.configuration.policy.ApplicationPolicy)

<!-- Signature picker -->
[`SignaturePickerFragment`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/signatures/SignaturePickerFragment.html

<!-- Custom sharing dialog -->
[`PSPDFActivity`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html
[`setDocumentSharingDialogFactory`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html#setDocumentSharingDialogFactory(com.pspdfkit.ui.dialog.DocumentSharingDialogFactory)
[`setDocumentPrintDialogFactory`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html#setDocumentPrintDialogFactory(com.pspdfkit.ui.dialog.DocumentPrintDialogFactory)

<!-- Add annotation to page -->
[`PSPDFFragment`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfFragment.html
[`addAnnotationToPage`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfFragment.html#addAnnotationToPage(com.pspdfkit.annotations.Annotation,%20boolean,%20java.lang.Runnable)

<!-- UI details -->
[`hideDocumentTitleOverlay`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html#hideDocumentTitleOverlay()

<!-- Document Library Improvements -->
[using `PSPDFLibrary`]: https://pspdfkit.com/guides/android/current/features/indexed-full-text-search/
[`PSPDFLibrary`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/library/PdfLibrary.html
[SQLite's FTS 5]: https://sqlite.org/fts5.html

<!-- Miscs -->
[`DocumentSharingProvider`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/sharing/DocumentSharingProvider.html
