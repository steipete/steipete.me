---
title: "PSPDFKit 2.0 for Windows"
description: PSPDFKit for the Universal Windows Platform
preview_image: /images/blog/2019/pspdfkit-windows-2-0/header.png
preview_video: /images/blog/2019/pspdfkit-windows-2-0/features.mp4
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2019-05-21 10:00 UTC
tags: Windows, Products, Development
published: true
---

Today we’re shipping PSPDFKit 2.0 for Windows. This release features support for ARM64, [Custom Annotation Data][custom-annotation-data], Document Editor Page Rotation, Tile Rendering and more! For a complete list of changes, see the [changelog][].

READMORE

## ARM64 Support

![arm64](/images/blog/2019/pspdfkit-windows-2-0/arm64.png)

We are delighted to announce support for ARM64. From today, your apps can now take advantage of the full capabilities and performance of Windows 10 on ARM64 devices.

## Custom Annotation Data

![custom-data](/images/blog/2019/pspdfkit-windows-2-0/custom-data.png)

The [`CustomData`][custom-data] property of [`IAnnotation`][iannotation] can be used to store arbitrary JSON on annotations for any reason you see fit. For example, you can store metadata and filter annotations based on that metadata directly using LINQ or even [Instant JSON][instant-json]. This data is persisted in your PDF and in XFDF and compatible with all our SDKs. [Learn more on our dedicated blog post for this feature.][custom-annotation-data]

## Document Editor Page Rotation

![page-rotation](/images/blog/2019/pspdfkit-windows-2-0/page-rotation.png)

We have added more API to the new Model-Only Document Editor seen in the previous release. In PSPDFKit for Windows 2.0 you will now find a [`RotatePage`][rotate-page] job that can be applied in the document editor. In a few easy steps, it's possible to rotate pages in 90-degree increments.

The following code quickly demonstrates the new feature:

```csharp
// Create a job from a source document.
var job = new PSPDFKit.Document.Editor.Job(inputDocument);

// Rotate the first page of our job's document.
await job.RotatePageAsync(0, PSPDFKit.Common.Rotation.Degrees90);

// Create a DocumentSource from a new StorageFile
var newDocument = await Editor.NewStorageFileFromJobAsync(job);
var documentSource = DocumentSource.CreateFromStorageFile(newDocument);
```

## Tile Rendering

![tile-rendering](/images/blog/2019/pspdfkit-windows-2-0/tile-rendering.png)

In addition to being able to [render a whole page][render-page] to a [`WriteableBitmap`][writeable-bitmap], [selected regions, or tiles][render-tile], of a page can now be rendered. This is more performant and simpler than needing to crop an area out of a complete page rendered to bitmap. Simply specify the region to be rendered in PDF coordinates and have it rendered to any size bitmap.

## Other Changes and Enhancements

With [our move to Fall Creators Update as the minimum supported Windows version][version-support] we've enhanced the Catalog app with additional example code and updated it to remove the deprecated `HamburgerMenu` and use the `NavigationView` instead.

We've added support for `mailto:` links. Windows will now pass the action on to the configured application or service.

In order to improve API quality and consistency, and aid discovery of functionality we have now deprecated the following methods:

- `ExportFlattenedAsync`
- `ExportFlattenedToDataWriterAsync`

Use the [`ExportAsync`][export-async] and `ExportTo*` methods with the [`DocumentExportOptions`][document-export-options] object instead.

- `TextForPageIndexAsync`

Now you can retrieve the text via a [`TextParser`][text-parser] object which can be retrieved with [`GetTextParserAsync`][get-text-parser].

The interfaces `IPageResults` and `IResult` have been replaced with the classes `PageResults` and `Result`, respectively.

## A Quick Look Back

In February of last year [we launched PSPDFKit for Windows][windows-1-0] with a feature-rich SDK right out the door. We haven’t rested, but instead continued to add features, improve the API design, respond to users’ needs, and increase performance.

We launched with the following capabilities (and more):

- Viewing documents using a variety of presentation modes, such as double-page rendering.
- Annotating documents easily with highlighting, freehand drawing, and notes.
- Editing annotations — moving, scaling, or changing the color as you like.
- Handling mouse and touch events — ready for the Microsoft Surface Tablet.
- Searching quickly with intuitive keyboard shortcuts for power users.
- Reading, updating, and submitting PDF forms. Forms can be filled out programmatically, submitted to a server, or saved back to the file as form data or flattened, non-editable text.
- React Native support — adding PDF support to your React Native Windows UWP app.

Since then, here are only some of the features we’ve added:

- Full-Text Search — indexing and searching folders of PDFs with lightning speed.
- Additional page events and page text and information extraction.
- Ink Signatures — adding ink signatures with ease and storing them for later use.
- Image, Stamp and Shape Annotations — richly annotate your documents exactly how you need.
- Support for password protected PDFs
- Document Flattening
- Model-Only Document Editor - generate and manipulate new PDFs from multiple source documents.
- Localization for many languages
- Customizable Toolbar — a toolbar that contains only what you need.
- More comprehensive action support.
- Further Instant JSON enhancements.
- Rendering performance increases.
- An API refactor improving usability.
- ARM and ARM64 support — running your app everywhere Windows 10 runs.
- Incremental and Automatic Saving.
- API for Controlling the Sidebar.
- A Bookmarks Sidebar.
- XFDF Support.
- Watermarks.

You can read more about all of the features on the [Windows SDK product page][pspdfkit-windows-sdk].

## Final Notes

Along with all the new features, this release also includes a number of bug fixes and some minor improvements. For a complete list of changes, see the [changelog][].

[catalog]: /api/windows/Catalog/Catalog.html
[document-editor]: /guides/windows/current/features/document-editor/
[changelog]: /changelog/windows/#2.0.0
[custom-data]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Annotation.IAnnotation.html#PSPDFKit_Pdf_Annotation_IAnnotation_CustomData
[iannotation]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Annotation.IAnnotation.html
[rotate-page]: /api/windows/PSPDFKit/PSPDFKit.Document.Editor.Job.html#PSPDFKit_Document_Editor_Job_RotatePageAsync_System_Int32_PSPDFKit_Common_Rotation_
[writeable-bitmap]: https://docs.microsoft.com/en-us/dotnet/api/system.windows.media.imaging.writeablebitmap?view=netframework-4.8&viewFallbackFrom=dotnet-uwp-10.0
[render-page]: /api/windows/PSPDFKit/PSPDFKit.Renderer.html#PSPDFKit_Renderer_RenderPageAsync_System_Int32_PSPDFKit_Pdf_Document_PSPDFKit_RenderOptions_
[render-tile]: /api/windows/PSPDFKit/PSPDFKit.Renderer.html#PSPDFKit_Renderer_RenderTileAsync_System_Int32_Windows_Foundation_Rect_PSPDFKit_Pdf_Document_PSPDFKit_RenderOptions_
[export-async]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Document.html#PSPDFKit_Pdf_Document_ExportAsync_Windows_Storage_StorageFile_
[document-export-options]: /api/windows/PSPDFKit/PSPDFKit.Document.DocumentExportOptions.html
[text-parser]: /api/windows/PSPDFKit/PSPDFKit.Pdf.TextParser.html
[get-text-parser]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Document.html#PSPDFKit_Pdf_Document_GetTextParserAsync_System_Int32_
[pspdfkit-windows-sdk]: /pdf-sdk/windows/
[custom-annotation-data]: /blog/2019/custom-annotation-data/
[instant-json]: /guides/windows/current/importing-exporting/instant-json/
[version-support]: /guides/windows/current/announcements/version-support/
[windows-1-0]: /blog/2018/introducing-pspdfkit-windows/
