---
title: "Introducing PDF Inspector"
description: "PDF Inspector is a powerful diagnostic tool for reading and analyzing PDF files."
preview_image: /images/blog/2020/pdf-inspector/article-header.png
section: blog
author:
  - Peter Steinberger
author_url:
  - https://twitter.com/steipete
date: 2020-02-06 12:00 UTC
tags: Products
published: true
---

Over the years, we’ve had our fair share of weird PDF documents with surprising bugs — ones that require you to dig deep into a file to understand what’s wrong. In the past, investigating these issues was a tedious process since there weren’t any great tools available to do the work for us.

This eventually led to the inception of PDF Inspector, a native Mac app that’s built for exactly this use case. Today, we’re releasing this diagnostic tool [publicly on the Mac App Store][pdf inspector mac app store].

## PDF Syntax 101

A PDF consists of objects that can have varying types (see [PDF Syntax 101][]). So you can simply open a PDF in your favorite text editor and read it, however, editing the file will likely corrupt the document, as PDFs are really binary documents.

[Content streams][] define how a page, an annotation, or a form is rendered. They are usually compressed and nested within thousands of other objects. For efficient browsing, it makes sense to present the objects in a tree. This is exactly how we built PDF Inspector.

## Features

PDF Inspector is a powerful diagnostic tool for reading and analyzing PDF files. It displays a PDF’s objects as a tree and allows you to view, edit, delete, and update arbitrary PDF objects. These are the main features:

- Explore PDF documents as object trees
- Use a quick access sidebar for pages
- Quick-jump to the PDF object ID
- Render content streams (pages, annotations) as images
- Add and remove PDF objects — like [Number, String, Name, Boolean, Reference, Dictionary, and Stream][] — on the fly
- Read and edit content streams in text or hex format
- Transparently decompress [content streams][]
- Supports [password-protected documents][]
- Supports both [incremental saving and full document rewrites][]

We built PDF Inspector to debug and understand PDF documents and to improve the PSPDFKit SDK. It’s an advanced diagnostic tool that can help you understand why a file is corrupted or even fix issues in files. Because it’s built on the strong foundation of [PSPDFKit for macOS][], it should be able to open any PDF you throw at it.

To demonstrate how PDF Inspector works, let’s explore a couple use cases.

## Use Case: Check the Appearance Stream of an Annotation

Whenever there’s an issue with an annotation, it’s useful to inspect the key/value pairs defined in the object and subobjects. Simply select the page the annotation is on, choose the `Annots` array, and cycle through the annotations until you find the object you’re interested in. (See also: [What Are Annotations?])

In the following example, we’re inspecting a free text annotation with a predefined [appearance stream][].

![PDF Inspector rendering an appearance stream](/images/blog/2020/pdf-inspector/appearance-stream.png)

PDF Inspector makes it easy to modify any key/value pair and even edit or remove appearance streams. Once a document is edited, PDF Inspector supports both [incremental and full save][] — with the latter you can ensure that deleted objects are actually deleted. (See also: [What’s Hiding in Your PDF?][])

The [PDF specification][] explains what each key is for. See 12.5.2 Annotation Dictionaries, Page 382.

## Use Case: See Validation Rules of a PDF Form

[PDF Forms][] can be highly complex and even include JavaScript. And with some creativity, you can create [surprising things][] in a PDF! When a form doesn’t quite work, it might contain specific validation rules or even JavaScript. PDF Inspector makes it easy to look at the individual form objects and see which validation rules are active.

![PDF Inspector displaying a form object](/images/blog/2020/pdf-inspector/form-validation.png)

Above we have two rules in the `AA` (additional actions) dictionary, one being `F`, “a JavaScript action that shall be performed before the field is formatted to display its value.” The other is `K`, “a JavaScript action that shall be performed when the user modifies a character in a text field or combo box or modifies the selection in a scrollable list box. This action may check the added text for validity and reject or modify it.” (The definitions are from the [PDF specification][], Table 196 – Entries in a form field’s additional-actions dictionary, Page 416).

Both use `AFDate` to format the input to m/d/yy. There’s no other document-level JavaScript set.

## Conclusion

PDF Inspector is now [available on the Mac App Store][pdf inspector mac app store]. If you’re having issues or have feature requests, hit us up on [support][].

[pdf inspector mac app store]: https://apps.apple.com/app/pdf-inspector/id1497698069?ls=1&mt=12
[support]: /support/request/
[appearance stream]: /blog/2018/what-are-appearance-streams/
[content streams]: /blog/2018/what-are-appearance-streams/
[pdf syntax 101]: /blog/2018/pdf-syntax-101/
[number, string, name, boolean, reference, dictionary, and stream]: /blog/2018/pdf-syntax-101/
[pdf forms]: /blog/2018/forms-in-pdf/
[what’s hiding in your pdf?]: /blog/2018/whats-hiding-in-your-pdf/
[incremental and full save]: /blog/2019/incremental-and-full-save-in-pdfs/
[incremental saving and full document rewrites]: /blog/2019/incremental-and-full-save-in-pdfs/
[what are annotations?]: /blog/2018/what-are-annotations/
[password-protected documents]: /blog/2018/protecting-pdf-documents/
[pspdfkit for macos]: /blog/2017/pspdfkit-for-macos/
[surprising things]: /blog/2018/how-to-program-a-calculator-pdf/
[pdf specification]: https://www.adobe.com/content/dam/acom/en/devnet/pdf/pdfs/PDF32000_2008.pdf
