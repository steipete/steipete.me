---
title: "PSPDFKit 2.5 for Windows"
description: PSPDFKit for the Universal Windows Platform
preview_image: /images/blog/2019/pspdfkit-windows-2-5/header.png
preview_video: /images/blog/2019/pspdfkit-windows-2-5/features.mp4
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2019-11-22 12:00 UTC
tags: Windows, Products, Development
published: true
---

Today we’re shipping PSPDFKit 2.5 for Windows. This release features new API for restricting the editable annotation types, the ability to dynamically decide editability for individual annotations, additions to the `TextParser` for word extraction, and more.

READMORE

## Annotation Editability By Type

![editability-type](/images/blog/2019/pspdfkit-windows-2-5/editability-type.png)

When loading a document you can now easily restrict the set of annotations that can be created, edited, moved, and deleted.

Here is an example demonstrating how to limit editing to [`Note`][note] and [`Ink`][ink] annotation types:

```csharp
await pdfView.Controller.ShowDocumentWithViewStateAsync(document, new ViewState
{
    EditableAnnotationTypes = new HashSet<AnnotationType>
    {
        AnnotationType.Note,
        AnnotationType.Ink,
    }
});
```

## Fine Grained Annotation Editability Control

![editability-control](/images/blog/2019/pspdfkit-windows-2-5/editability-control.png)

Sometimes you need finer grained control or very specific rules to determine whether or not an existing annotation should be editable.

With the [`Controller`][controller]'s [`IsEditableAnnotation`][is-editable-annotation] event handler you can easily add your own custom logic to do this.

The following example code is taken from the [`Catalog`][catalog] which you can find in the SDK:

```csharp
public void Initialize(PdfView pdfView)
{
    pdfView.InitializationCompletedHandler += PDFView_InitializationCompletedHandler;
}

private async void PDFView_InitializationCompletedHandler(PdfView sender, PSPDFKit.Pdf.Document args)
{
    // Wire up a handler to be called whenever the UI needs to know if the annotation is editable or not.
    sender.Controller.IsEditableAnnotation += Controller_IsEditableAnnotation;
}

private void Controller_IsEditableAnnotation(Controller sender, AnnotationPermissionQuery args)
{
    // The second combo option: "Only Page 2 Annotations"
    if (EditabilityRule == 1)
    {
        // Decide if this annotation should be editable or not.
        args.Editable = args.Annotation.PageIndex == 1;
    }
}
```

## Words From TextParser

![text-parser-words](/images/blog/2019/pspdfkit-windows-2-5/text-parser-words.png)

The [`TextParser`][text-parser] can now convert a list of [`Glyph`][glyph]s retrieved from a page to a list of [`Word`][word]s which contains the word's bounding box, range of glyphs, and string content.

[See the guide][text-guide] for more details and example code.

## Final Notes

This release also includes a number of bug fixes and some minor improvements. For a complete list of changes, see the [changelog][changelog].

[catalog]: /api/windows/Catalog/Catalog.html
[changelog]: /changelog/windows/#2.5.0
[controller]: /api/windows/PSPDFKit/PSPDFKit.UI.Controller.html
[glyph]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Glyph.html
[ink]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Annotation.Ink.html
[is-editable-annotation]: /api/windows/PSPDFKit/PSPDFKit.UI.Controller.html#PSPDFKit_UI_Controller_IsEditableAnnotation
[note]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Annotation.Note.html
[text-guide]: /guides/windows/current/features/text-extraction/#words
[text-parser]: /api/windows/PSPDFKit/PSPDFKit.Pdf.TextParser.html
[word]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Word.html
