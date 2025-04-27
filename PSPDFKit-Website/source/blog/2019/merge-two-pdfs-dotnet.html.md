---
title: "How to Merge Two or More PDFs in .NET"
description: "Learn how to merge PDFs in .NET the simple way — with code examples, explanations, and extra features."
preview_image: /images/blog/2019/merge-two-pdfs-dotnet/article-header.png
section: blog
author:
  - Nick Winder
author_url:
  - http://www.nickwinder.com
date: 2019-11-19 8:00 UTC
tags: PDF, .NET, How-To
cta: libraries
published: true
secret: false
---

Have you ever come to the point where you want to merge two PDFs? Perhaps you need to attach a supporting document at the end of a form. Or maybe you need to batch append resumes with cover letters. Whatever your use case, it should be simple and automatable. So in this blog post, we’re going to show just how simple it can be to merge two or more PDFs, and then we’ll show you some extra little tricks to customize a merged document further.

## .NET

[.NET][what-is-dotnet] appears in many situations and environments, from the server to the desktop, and even on mobile. Having one solution in all these environments makes it easy for developers to switch between projects and jobs. Looking to the future with [.NET 5][dotnet-5] and the unification of the frameworks, switching jobs should be even easier.

## Merging Example

Let’s say we’ve got two documents, each consisting of one page each. We want to merge these two pages together to create a document with one page.

![Image showing two individual pages merged into one document](/images/blog/2019/merge-two-pdfs-dotnet/two-pdfs-merging.png)

```csharp
// Get two documents and merge them together. 0 denotes the page index of where to insert the document.
var documentEditor = new DocumentEditor();
documentEditor.ImportDocument(0, DocumentEditor.IndexPosition.BeforeIndex, new FileDataProvider("Assets/dog.pdf"));
documentEditor.ImportDocument(0, DocumentEditor.IndexPosition.BeforeIndex, new FileDataProvider("Assets/cat.pdf"));

// Write out to a new file.
documentEditor.SaveDocument(new FileDataProvider("dogCatPair.pdf"));
```

With just four lines of code, it’s possible to merge the two documents together and write out to the target file.

The code above shows the use of the powerful PSPDFKit [Document Editor][document-editor]. The [`importDocument`][] method indicates where to place the document, with `0` denoting index 0 and `DocumentEditor.IndexPosition.BeforeIndex` instructing the editor to place the pages before the given index (this is necessary for the first document, as there are no other indices to reference yet). The last parameter instructs the editor where to obtain the document from. In the code example above, we take a simple file path, but it’s also possible to pass a custom data provider that extends [`IDataProvider`][] to provide data from any source you require, such as memory, network data, or even a cryptographic solution.

It’s possible to stack as many of these operations together as needed. One factor to be aware of is the size of the PDFs in memory. Opening and appending PDFs can be a memory-intensive process, so if you are importing large documents, keep this in mind.

## Extra Operations

Now that we have our two documents merged, let’s have a quick overview of what else we can do with the [Document Editor][document-editor].

Let’s say we want to make flip cards now. We have a page on one side, and if we flip it on the horizontal edge, we have another page, but in the correct readable orientation. With the previous example, if we did this, the second page would be upside-down.

We can fix this.

![An image with a document flipped along the horizontal edge](/images/blog/2019/merge-two-pdfs-dotnet/document-flipped-horizontally.png)

```csharp
documentEditor.ImportDocument(0, DocumentEditor.IndexPosition.BeforeIndex, new FileDataProvider("Assets/dog.pdf"));
documentEditor.ImportDocument(0, DocumentEditor.IndexPosition.BeforeIndex, new FileDataProvider("Assets/cat.pdf"));

// Now flip the second page.
documentEditor.RotatePages(new List<int>{1}, Rotation.Degrees180);
```

We take the second page and flip it 180 degrees. Now, if we’re looking at the first page and flip it along the horizontal edge, the second page will appear in the correct orientation! We’ve made flip cards.

[`RotatePages`][] offers the opportunity to rotate multiple pages at one time in increments of 90 degrees. And to make things simple, the [`Rotation`][] enum offers positive and negative values.

From here, it’s easy to explore additional possibilities — including but not limited to [`AddPage`][], [`RemovePage`][], and [`SetPageLabel`][] — in order to create the final PDF you need.

## Conclusion

Now you should know how to achieve document merging with the [PSPDFKit .NET Library][pspdfkit-dotnet-library], and you should also have learned how extra operations can be applied to the newly created document. Feel free to explore the [guides][] and [API documentation][] for more examples and other important features of the SDK.

If you’d like to try out the PSPDFKit .NET Library for yourself, [head over to the trial page][trials] and download the SDK today.

[dotnet-5]: https://devblogs.microsoft.com/dotnet/introducing-net-5/
[document-editor]: /guides/dotnet/current/features/document-editor/
[`importdocument`]: /api/dotnet/PSPDFKit/PSPDFKit.DocumentEditor.html#PSPDFKit_DocumentEditor_importDocument_System_Int32_PSPDFKit_DocumentEditor_IndexPosition_PSPDFKit_Providers_IDataProvider_
[`idataprovider`]: /api/dotnet/PSPDFKit/PSPDFKit.Providers.IDataProvider.html
[`rotatepages`]: /api/dotnet/PSPDFKit/PSPDFKit.DocumentEditor.html#PSPDFKit_DocumentEditor_RotatePages_System_Collections_Generic_IEnumerable_System_Int32__PSPDFKitFoundation_Rotation_
[`rotation`]: /api/dotnet/PSPDFKit/PSPDFKitFoundation.Rotation.html
[`addpage`]: /api/dotnet/PSPDFKit/PSPDFKit.DocumentEditor.html#PSPDFKit_DocumentEditor_AddPage_System_Int32_PSPDFKit_DocumentEditor_IndexPosition_System_Int32_System_Int32_PSPDFKitFoundation_Rotation_System_Drawing_Color_PSPDFKit_Basic_Insets_
[`removepage`]: /api/dotnet/PSPDFKit/PSPDFKit.DocumentEditor.html#PSPDFKit_DocumentEditor_RemovePages_System_Collections_Generic_IEnumerable_System_Int32__
[`setpagelabel`]: /api/dotnet/PSPDFKit/PSPDFKit.DocumentEditor.html#PSPDFKit_DocumentEditor_SetPageLabel_System_Collections_Generic_IEnumerable_System_Int32__System_String_
[pspdfkit-dotnet-library]: https://pspdfkit.com/pdf-library/dotnet/
[trials]: https://pspdfkit.com/try/
[what-is-dotnet]: https://dotnet.microsoft.com/learn/dotnet/what-is-dotnet
[api documentation]: /api/dotnet/
[guides]: /guides/dotnet/current/
