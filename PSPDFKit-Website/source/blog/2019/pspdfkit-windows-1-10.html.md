---
title: "PSPDFKit 1.10 for Windows"
description: PSPDFKit for the Universal Windows Platform
preview_image: /images/blog/2019/pspdfkit-windows-1-10/header.png
preview_video: /images/blog/2019/pspdfkit-windows-1-10/features.mp4
section: blog
author:
  - James Swift
  - Nick Winder
author_url:
  - https://twitter.com/_jamesswift
  - https://www.nickwinder.com
date: 2019-01-31 12:00 UTC
tags: Windows, Products, Development
published: true
---

Today we’re shipping PSPDFKit 1.10 for Windows. This release features new APIs for model-only document information retrieval, viewing and printing watermark support, additional toolbar customization, and more.

READMORE Please refer to our [PSPDFKit 1.10 for Windows changelog][changelog] for a complete list of changes in this release.

## New Model API

![model-only-api](/images/blog/2019/pspdfkit-windows-1-10/model-only-api.png)

Sometimes you need to retrieve information from a document but showing the document in a [`PdfView`][pdfview] isn’t desired. With this release, we’ve added the ability to open a document independently of the `PdfView` and call the non-mutating methods on the [`Document`][document] class.

For example, you may wish to find out how many pages a document contains or retrieve annotations from a specific page. Here’s a short example demonstrating how to do that:

```csharp
// In this example, we will open from a `StorageFile`.
var file = await GetMyStorageFileFromSomewhereAsync();

// Create a `DocumentSource` as per usual.
var source = DocumentSource.CreateFromStorageFile(file);

// Open the document without a `PdfView`.
var document = await Document.OpenDocumentAsync(source);

try
{
  // How many pages does this document contain?
  var numPages = await document.GetTotalPageCountAsync();

  // Get the annotations on the third page.
  var annotations = await document.GetAnnotationsAsync(2);
}
finally
{
  // Make sure to close it.
  await document.CloseDocumentAsync();
}
```

## Watermarks

![watermark](/images/blog/2019/pspdfkit-windows-1-10/watermark.png)

For some use cases, you may need to render a custom watermark on top of a PDF. Up until now, this was not possible without having to modify the document itself. With this release, we’ve added the ability to render a `SoftwareBitmap` image on top of the page. These are set independently for [viewing][pdfview] and [printing][print-helper].

<video src="/images/blog/2019/pspdfkit-windows-1-10/watermark.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Check out the printing example code in the [Catalog app][catalog-print] to see it in action.

## Toolbar Customization

![toolbar-customization](/images/blog/2019/pspdfkit-windows-1-10/toolbar-customization.png)

Dropdown grouping of the default toolbar items is useful for decluttering the toolbar. However, sometimes you may wish to ungroup one or more of those items and place them directly on the toolbar.

We added a new property, [`DropdownGroup`][dropdown-group], to the `ToolbarItem`’s [`Attributes`][toolbar-attributes]. Setting this to an empty string ungroups the item and places it directly on the toolbar.

The following code example shows how to add a new ink toolbar item to the toolbar:

```csharp
var toolbarItems = PDFView.GetToolbarItems();
toolbarItems.Add(
    new InkToolbarItem
    {
        Attributes = new Attributes
        {
            // Ensure the item is not assigned to any dropdown group.
            DropdownGroup = "",
        }
    }
);

await PDFView.SetToolbarItemsAsync(toolbarItems);
```

## Annotation Rotation Attribute

![rotated-text-annotation](/images/blog/2019/pspdfkit-windows-1-10/rotated-text-annot.png)

Getting and setting the rotation of certain annotations is now supported. So now you will find the new `Rotation` property in the [`Text`][text-annot], [`Stamp`][stamp-annot], and [`Image`][image-annot] annotation classes, where you can set the rotation in 90-degree increments.

This can be done when creating the annotation, as the following example demonstrates:

```csharp
var annotation = new Text
{
    BoundingBox = new Rect(100, 100, 200, 30),
    FontColor = Colors.Blue,
    Contents = "Changed Text annotation",
    FontSize = 12,
    Rotation = RotationType.Degrees90
};
```

## And Finally

Customers using Visual Studio 15.9 should be aware that it has a bug that may require you to modify your application’s project file until Microsoft releases a fix. Read more about it [here][msvc issues].

Along with all the new features, this release also includes a number of bug fixes and some minor improvements. For a complete list of changes, see the [changelog][].

[changelog]: /changelog/windows/#1.10.0
[pdfview]: /api/windows/PSPDFKit/PSPDFKit.UI.PdfView.html
[document]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Document.html
[print-helper]: /api/windows/PSPDFKit/PSPDFKit.PrintHelper.html
[catalog-print]: /api/windows/Catalog/Catalog.ViewModels.PrintPageViewModel.html
[toolbar-attributes]: /api/windows/PSPDFKit/PSPDFKit.UI.ToolbarComponents.Attributes.html
[dropdown-group]: /api/windows/PSPDFKit/PSPDFKit.UI.ToolbarComponents.Attributes.html#PSPDFKit_UI_ToolbarComponents_Attributes_DropdownGroup
[text-annot]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Annotation.Text.html#PSPDFKit_Pdf_Annotation_Text_Rotation
[stamp-annot]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Annotation.Stamp.html#PSPDFKit_Pdf_Annotation_Stamp_Rotation
[image-annot]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Annotation.Image.html#PSPDFKit_Pdf_Annotation_Image_Rotation
[msvc issues]: https://pspdfkit.com/guides/windows/current/announcements/msvc-issues/
