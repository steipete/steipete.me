---
title: "PSPDFKit 2.3 for Windows"
description: PSPDFKit for the Universal Windows Platform
preview_image: /images/blog/2019/pspdfkit-windows-2-3/header.png
preview_video: /images/blog/2019/pspdfkit-windows-2-3/release.mp4
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2019-08-21 12:00 UTC
tags: Windows, Products, Development
published: true
---

Today we’re shipping PSPDFKit 2.3 for Windows. This release features our new Document Editor UI, revamped icons and styling, new model only methods for `Pdf.Document`, the ability to add, update or remove document passwords, rendering on background threads, Welsh language support, and much more!

READMORE

## Document Editor UI

![document-editor-2](/images/blog/2019/pspdfkit-windows-2-3/document-editor-2.png)

In PSPDFKit for Windows 1.12 we introduced a powerful new component — the model only Document Editor. In this release we introduce the visual Document Editor.

![document-editor](/images/blog/2019/pspdfkit-windows-2-3/document-editor.png)

This feature enables users to add and remove pages, reorder pages, merge PDFs, and split PDFs directly within the UI — along with even more features. If you’re interested in trying out this new component, please either [download a trial][pspdfkit trial] or contact our [Sales team][].

## Model Only Support

![model-only](/images/blog/2019/pspdfkit-windows-2-3/model-only.png)

Until this release `Pdf.Document` objects loaded outside a `PdfView` only supported calls to non-mutating methods. Now you can call all methods including mutating methods and save your results.

In this example we open a document, add an annotation, and export the modified document to a new temporary file.

```csharp
// Open a pdf from a StorageFile
var source = DocumentSource.CreateFromStorageFile(storageFile);
var doc = await Document.OpenDocumentAsync(source);

// Add a Text annotation to the first page
var textAnnotation = new Text
{
    Contents = "A new text annotation",
    BoundingBox = new Rect(10, 10, 300, 300),
    PageIndex = 0
};
await doc.CreateAnnotationAsync(textAnnotation);

// Create a temp file for writing to
var localFolder = ApplicationData.Current.TemporaryFolder;
var newFile = await localFolder.CreateFileAsync(Guid.NewGuid().ToString());

// Export to the temp file with options
var options = new DocumentExportOptions
{
    Flattened = false,
    Incremental = true,
};
await documentToSave.ExportAsync(newFile, options);

// Close the original document
await doc.CloseDocumentAsync();
```

## Setting and Removing Passwords

![password](/images/blog/2019/pspdfkit-windows-2-3/password.png)

In this release we've added the ability to the Document Editor component to add, update and remove the user and owner passwords of a PDF.

You can read more about [user and owner passwords here][passwords].

If you’re interested in trying out the Document Editor component, please either [download a trial][pspdfkit trial] or contact our [Sales team][].

## Additional New Features

Also included in this release are the following new features and improvements:

- Welsh language support.
- Support for rendering pages and tiles on a background thread and not just the UI thread.
- Ability to set the [zoom level][zoom-level] of the [`PdfView`][pdf-view].
- A [`ViewState`][view-state] change event for the [`Controller`][controller].
- Ability to open a document with a [`ViewState`][view-state].
- A `Modified` property for the [`Document`][document].
- Ability to get the text for a region via the [`TextParser`][text-parser].
- Ability to get an [`OutlineElement`][outline-element] by page index.

## Final Notes

This release also includes a number of bug fixes and some minor improvements. For a complete list of changes, see the [changelog][changelog].

[catalog]: /api/windows/Catalog/Catalog.html
[view-state]: /api/windows/PSPDFKit/PSPDFKit.UI.Controller.html#PSPDFKit_UI_Controller_SetViewStateAsync_PSPDFKit_UI_ViewState_
[scroll-mode]: /api/windows/PSPDFKit/PSPDFKit.UI.ScrollMode.html
[changelog]: /changelog/windows/#2.3.0
[pspdfkit-windows-sdk]: /pdf-sdk/windows/
[pspdfkit trial]: https://pspdfkit.com/try/
[sales team]: https://pspdfkit.com/sales/
[passwords]: https://pspdfkit.com/blog/2018/protecting-pdf-documents/
[zoom-level]: https://pspdfkit.com/api/windows/PSPDFKit/PSPDFKit.UI.ZoomMode.html
[pdf-view]: /api/windows/PSPDFKit/PSPDFKit.UI.PdfView.html
[controller]: /api/windows/PSPDFKit/PSPDFKit.UI.Controller.html
[document]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Document.html
[text-parser]: /api/windows/PSPDFKit/PSPDFKit.Pdf.TextParser.html
[outline-element]: /api/windows/PSPDFKit/PSPDFKit.Pdf.OutlineElement.html
