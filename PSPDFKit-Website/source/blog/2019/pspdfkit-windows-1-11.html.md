---
title: "PSPDFKit 1.11 for Windows"
description: PSPDFKit for the Universal Windows Platform
preview_image: /images/blog/2019/pspdfkit-windows-1-11/header.png
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2019-03-14 12:00 UTC
tags: Windows, Products, Development
published: true
---

Today we’re shipping PSPDFKit 1.11 for Windows. This release features new APIs for retrieving [form field information][form-field], the [document outline][outline], the [document title][title], and [page crop][crop] and [rotation][rotation].

We've also added the ability to [highlight search results][highlight] in the [`PdfView`][pdfview] programmatically. This is useful if you are implementing your own search UI outside the `PdfView`.

With this release you can also now place the [sidebar on the left or right side][sidebar] of the `PdfView`.

In addition, we've significantly improved rendering performance for large documents.

READMORE Please refer to our [PSPDFKit 1.11 for Windows changelog][changelog] for a complete list of changes in this release.

## Performance

We are continually improving performance with every release but with this release we have greatly improved smoothness of scrolling and rendering speed with large and image heavy documents.

## Catalog App

As with every release we provide the source code to our example Catalog app that demonstrates many of the features of the SDK. We now also provide a prebuilt, ready to install Appx bundle so you can install the Catalog app and try it out without any compilation. Please consult the `README` found in the SDK zip file for further details.

The Visual Studio project for the Catalog app now directly references the PSPDFKit for Windows NuGet package supplied in the SDK so it compiles without needing to first install a specific version of the VSIX.

![catalog-app](/images/blog/2019/pspdfkit-windows-1-11/catalog.jpg)

Each section of the Catalog app now contains a link to the relevant guide article on our website for further explanation of the features. You can find the link near the top right corner of the app.

## Final Notes

Along with all the new features, this release also includes a number of bug fixes and some minor improvements. For a complete list of changes, see the [changelog][].

[changelog]: /changelog/windows/#1.11.0
[pdfview]: /api/windows/PSPDFKit/PSPDFKit.UI.PdfView.html
[sidebar]: /api/windows/PSPDFKit/PSPDFKit.UI.PdfView.html#PSPDFKit_UI_PdfView_SidebarPlacement
[form-field]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Document.html#PSPDFKit_Pdf_Document_GetFormFieldsAsync
[outline]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Document.html#PSPDFKit_Pdf_Document_GetDocumentOutline
[title]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Document.html#PSPDFKit_Pdf_Document_GetTitleAsync
[crop]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Document.html#PSPDFKit_Pdf_Document_GetPageBoxAsync_System_Int32_PSPDFKitFoundation_Pdf_BoxType_
[rotation]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Document.html#PSPDFKit_Pdf_Document_GetPageRotationAsync_System_Int32_
[highlight]: /api/windows/PSPDFKit/PSPDFKit.UI.Controller.html#PSPDFKit_UI_Controller_HighlightResultsAsync_System_Collections_Generic_IEnumerable_PSPDFKitFoundation_Search_IResult__
