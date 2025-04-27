---
title: "PSPDFKit 3.1 for Android"
description: Today we're releasing PSPDFKit 3.1 for Android!
section: blog
author:
  - Simone Arpe
author_url:
  - https://twitter.com/simonarpe
date: 2017-05-11 12:00 UTC
tags: Android, Features, Products
published: true
---

Today we are proudly announcing the release of PSPDFKit 3.1 for Android, including the new scrollable thumbnail bar. Check out our [full list of changes in PSPDFKit 3.1 for Android], to see all the details.

READMORE

## Scrollable Thumbnail Bar Mode

One of the most requested features, working with both single and double page mode, is finally landing on Android!

![scrollable thumbnail bar mode](/images/blog/2017/pspdfkit-android-3-1/scrollable-thumbnail-bar.gif)

Scrollable thumbnail bar mode can be enabled via [`setThumbnailBarMode(ThumbnailBarMode)`] in the [`PdfActivityConfiguration.Builder`] class. Stroke width and color for the selected page can be customized, take a look into [`PdfThumbnailBarController`] to discover all the options.

## Support for editing PDF metadata

Metadata fields like author, creator, title, and others are now editable. Even supplementary data stored inside the [`XMP`], like the bookmarks set by Apple’s Preview app, can now be retrieved and edited. This functionality is especially useful for storing additional document information that shouldn’t be visible to other apps.

[==

```kotlin
val documentMetadata = document.getMetadata()
documentMetadata.set(DocumentMetadata.PDF_METADATA_AUTHOR, PdfValue("Jane Smith"))
documentMetadata.set(DocumentMetadata.PDF_METADATA_TITLE, PdfValue("Report for year 2017"))
// Custom PDF dictionary metadata entry
documentMetadata.set("Department", PdfValue("Accounting"))
// Set key in XMP which is easily readable by standard libraries for handling metadata in many files.
documentMetadata.setInXmp("Intranet-ID", "8473223345", "http://mycompany.example.com/intranet/xmp/1.0/", "mycompany")
document.saveIfModified()
```

```java
DocumentMetadata documentMetadata = document.getMetadata();
documentMetadata.set(DocumentMetadata.PDF_METADATA_AUTHOR, new PdfValue("Jane Smith"));
documentMetadata.set(DocumentMetadata.PDF_METADATA_TITLE, new PdfValue("Report for year 2017"));
// Custom PDF dictionary metadata entry
documentMetadata.set("Department", new PdfValue("Accounting"));
// Set key in XMP which is easily readable by standard libraries for handling metadata in many files.
documentMetadata.setInXmp("Intranet-ID", "8473223345", "http://mycompany.example.com/intranet/xmp/1.0/", "mycompany");
document.saveIfModified();
```

==]

## Polish and API improvements

We finished polishing the few APIs remaining after our 3.0 release:

- All theming configuration is now done via style XML files or with setters on the views themselves. This is now fully consistent with how styling is done on the Android platform. As a result, the complex theme configuration classes are now gone from configuration.
- We added the ability to pass only file paths to the [full text PDF library], fixing the issues with devices running out of memory when indexing documents.
- We added a new example showing how AES encrypted documents can be loaded without storing them into a temporary unecrypted file or loading them into memory completely. [Take a look at the AES encryption example].



<!-- References -->

[`PdfActivityConfiguration.Builder`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html
[`setThumbnailBarMode(ThumbnailBarMode)`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html#setThumbnailBarMode(com.pspdfkit.configuration.activity.ThumbnailBarMode)
[`PdfThumbnailBarController`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/thumbnail/PdfThumbnailBarController.html
[`XMP`]: https://en.wikipedia.org/wiki/Extensible_Metadata_Platform
[full list of changes in PSPDFKit 3.1 for Android]: https://pspdfkit.com/changelog/android/#3.1
[Take a look at the AES encryption example]: https://pspdfkit.com/guides/android/current/getting-started/example-projects/
[full text PDF library]: https://pspdfkit.com/guides/android/current/features/indexed-full-text-search/
