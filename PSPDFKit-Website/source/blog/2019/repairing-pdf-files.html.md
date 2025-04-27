---
title: Repairing PDF Files
description: "A blog post about some repairs PDF viewers make when processing documents."
preview_image: /images/blog/2019/repairing-pdf-files/article-header.png
section: blog
author:
  - Erik Verbruggen
author_url:
  - https://twitter.com/ErikVerbruggen
date: 2019-07-29 7:00 UTC
tags: PDF
published: true
secret: false
---

In a [previous blog post][ismypdffilevalid], we explained when PDF files are valid. However, it is not uncommon to encounter a situation where a PDF can successfully be opened but still have other problems that occur when it’s being processed.

The very first section of the PDF specification, [Scope][], explicitly states that conformance validation is not specified:

> This standard does not specify the following:
>
> - specific processes for converting paper or electronic documents to the PDF format;
> - specific technical design, user interface or implementation or operational details of rendering;
> - specific physical methods of storing these documents such as media and storage conditions;
> - **methods for validating the conformance of PDF files or readers;**
> - ...

As the specification does not provide a way to validate a PDF, one consequence is that some developers will do the validation by checking if Adobe Acrobat Reader can read and show the file “correctly.” The reasoning is that Adobe Acrobat Reader is made by Adobe, which also created the PDF, so if Adobe displays it with no problem, it must be a valid PDF! The problem is that the goal of PDF readers is to process or display PDFs as best as possible, which they will do even if a PDF has a few minor problems.

Or to rephrase: PDF readers will be as lenient as possible and attempt to repair any issues they might encounter. So, let’s look at two common problems that can generally be repaired.

## Invalid Cross References (Xref Tables)

In a PDF file, all resources are stored as so-called “objects.” Images, forms, and pages are objects. When an object is referenced, the reader has to find it in the PDF file. Scanning the entire file for the object would be very time-consuming, so to mitigate that, PDF files contain cross-reference tables (Xref tables), which specify (among other things) the _exact_ byte position in the file where the object is defined. The [PDF Syntax 101][pdfsyntax101] post on our blog shows how this looks.

One issue that commonly occurs is that PDF editors will remove an object from a file and then forget to update indices for subsequent objects. Although this might sound catastrophic, this problem is easily detected, and it speaks to the resilience of the file format. As detailed in the aforementioned article, all objects start with their object number, followed by a version number and the text “obj” ([see here for an example][example]).

Now, if an object is referenced, the PDF reader will go through the table and find the exact byte position of the object in the file. If they do not match up, or if a reference ends up in the middle of another object, then it is clear that something went wrong.

Repairing this will typically involve reading the entire file from start to end in order to find the correct offsets for all objects. This probably makes it the most expensive repair operation.

## Form Repairing

When looking at form support, one very important part of the PDF file is the AcroForm dictionary. It contains all the information necessary to let the user interact successfully with forms.

Another common problem found in PDFs is that the `AcroForm.Fields` array isn’t populated correctly. According to the PDF standard, all form fields must be included in the `AcroForm.Fields` array. In addition to this, form widgets must also be included on the relevant pages. However, some PDF creator software only handles the widgets. This is an easy mistake to make: According to the PDF specification, the form field and the form widget can occupy the same object, which makes dealing with them rather difficult.

Some of the benefits of the `AcroForm.Fields` array include:

- Being able to list all form fields and widgets without going through an entire document. This is important when you’re dealing with large documents.
- Being able to create groups of form widgets. This enables you to, for example, have form widgets that have the same text on separate pages, or have a group of buttons where only one can be selected exclusively (also known as radio buttons).
- Creating hierarchies of form fields, which helps structuring the output of the form and also has performance benefits.

We at PSPDFKit have spent a lot of time refining our repair algorithm so we can support as many documents as possible. This happens transparently when you open a document.

## Conclusion

For PDF readers, it’s often not enough to simply show the contents of a PDF file. There are many cases where effort is put into retrieving missing information.

When a document is saved or exported with PSPDFKit, any repairs made to the document also get saved. That way, other readers don’t have to do the operations that are often time-consuming.

[ismypdffilevalid]: https://pspdfkit.com/blog/2019/is-my-pdf-valid/
[scope]: https://www.adobe.com/content/dam/acom/en/devnet/pdf/pdfs/PDF32000_2008.pdf
[pdfsyntax101]: https://pspdfkit.com/blog/2018/pdf-syntax-101/
[example]: https://pspdfkit.com/blog/2018/pdf-syntax-101/#file-structure
