---
title: "PSPDFKit 1.12 for Windows"
description: PSPDFKit for the Universal Windows Platform
preview_image: /images/blog/2019/pspdfkit-windows-1-12/header.png
preview_video: /images/blog/2019/pspdfkit-windows-1-12/features.mp4
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2019-04-16 12:00 UTC
tags: Windows, Products, Development
published: true
---

Today we’re shipping PSPDFKit 1.12 for Windows. This release features a model only Document Editor, API for accessing glyph positions, the ability to index password protected documents, cloudy borders for annotations and more.

READMORE

## Document Editor

![document-editor](/images/blog/2019/pspdfkit-windows-1-12/document-editor.png)

This version of PSPDFKit for Windows introduces the model only [Document Editor][document-editor]. This allows various methods of editing, merging, splitting, and rearranging documents in code.

The following example code demonstrates how to delete the second page from a document:

```csharp
// Load a document as per usual. Note that it must not be loaded into a `PdfView`.
var source = DocumentSource.CreateFromStorageFile(file);
var doc = await Document.OpenDocumentAsync(source);

// Create a new editing job
var job = new PSPDFKit.Document.Editor.Job(doc);

// Remove the second page by index
await job.RemovePagesAsync(new[] { 1 });

// Produce a new document from that job in temporary storage
var newStorageFile = await Editor.NewStorageFileFromJobAsync(job);
```

And this example demonstrates how to create a new document by appending a page from one document to another.

```csharp
// Given two documents
PSPDFKit.Pdf.Document documentOne;
PSPDFKit.Pdf.Document documentTwo;

// Create a new editing job with the first document as the source
var job = new PSPDFKit.Document.Editor.Job(documentOne);

// Create a new page from the first page of the second document
var newPage = NewPage.FromPage(documentTwo, 0);

// Append it to the end of the first document
var numPages = await documentOne.GetTotalPageCountAsync();
await job.AddPageAtIndexAsync(newPage, numPages);

// Produce a new document from that job in temporary storage
var newStorageFile = await Editor.NewStorageFileFromJobAsync(job);
```

See the [Catalog example][catalog] and [Document Editor guide][document-editor] for more in depth examples and explanations.

## Text Parse / Glyph Positions

![text-parser-glyphs](/images/blog/2019/pspdfkit-windows-1-12/glyphs.png)

As part of PSPDFKit for Windows 1.12 we have extended the text extraction capabilities to include the ability to get individual character information like content, position, size and more.

```csharp
var textParser = document.GetTextParserAsync(0);
var glyphs = textParser.GetGlyphsAsync();
```

The new ability to get glyph information is now part of the new [`TextParser`][text-parser] class which can be obtained from [`Pdf.Document`][document] on a per page basis. The new [`TextParser`][text-parser] also means we have deprecated [`Document.TextForPageIndexAsync`][text-for-page-index] in favor of [`TextParser.GetTextAsync`][text-parser-get-text]. The former will be removed completely in a future version of the SDK.

## Indexing Password Protected Documents

![index-password-protected-documents](/images/blog/2019/pspdfkit-windows-1-12/index-password-protected-documents.png)

When indexing documents from a folder for [Full Text Search][full-text-search], sometimes we'll come across a password protected document. Prior to PSPDFKit for Windows 1.12 this would be ignored, but now it's possible to unlock these documents for indexing.

We achieve this by implementing an event handler which is fired every time a new password protected document is found. This way, it's possible to provide PSPDFKit for Windows the required password. The following example shows how to achieve this:

```csharp
private Library _library;

internal async void Initialize(PdfView pdfView)
{
    _library = await Library.OpenLibraryAsync("catalog");
    _library.OnPasswordRequested += Library_OnPasswordRequested;
}

private void Library_OnPasswordRequested(Library sender, PasswordRequest passwordRequest)
{
    if (passwordRequest.Uid.Contains("Password.pdf"))
    {
        passwordRequest.Password = "test123";
        break;
    }

    // It is essential to signal completion via the deferral.
    passwordRequest.Deferral.Complete();
}
```

`PasswordRequest` will always have the Uid populated with the path being indexed (note the full path will be assigned a unique id, but the filename will remain). Check against this string to determine which document is requiring a password and populate `Password` member of `PasswordRequest` in order to unlock the document. Please ensure the [`Deferral`][deferral] is completed as per the last line of `Library_OnPasswordRequested`, otherwise, the index will fail and throw an exception.

## Cloudy Borders

![cloudy-borders](/images/blog/2019/pspdfkit-windows-1-12/cloudy-borders.png)

We've added support for the [`BorderStyle`][border-style] `cloudy`. We've also added the property `CloudyBorderIntensity` to the `Ellipse`, `Rectangle` and `Polygon` shape annotations.

Cloudy borders can help visually distinguish an annotation from any underlying diagrams containing lots of horizontal and vertical lines.

## Final Notes

Along with all the new features, this release also includes a number of bug fixes and some minor improvements. For a complete list of changes, see the [changelog][].

[catalog]: /api/windows/Catalog/Catalog.html
[document-editor]: /guides/windows/current/features/document-editor/
[text-for-page-index]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Document.html#PSPDFKit_Pdf_Document_TextForPageIndexAsync_System_Int32_
[text-parser]: /api/windows/PSPDFKit/PSPDFKit.Pdf.TextParser.html
[text-parser-get-text]: /api/windows/PSPDFKit/PSPDFKit.Pdf.TextParser.html#PSPDFKit_Pdf_TextParser_GetTextAsync
[document]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Document.html
[changelog]: /changelog/windows/#1.12.0
[pdfview]: /api/windows/PSPDFKit/PSPDFKit.UI.PdfView.html
[full-text-search]: /guides/windows/current/features/indexed-full-text-search/
[deferral]: https://docs.microsoft.com/en-us/uwp/api/windows.foundation.deferral
[border-style]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Annotation.BorderStyle.html
