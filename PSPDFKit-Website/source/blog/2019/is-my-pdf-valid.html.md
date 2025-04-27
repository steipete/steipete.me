---
title: Is My Document a Valid PDF?
description: "This article looks at multiple factors used to determine the validity of a PDF."
preview_image: /images/blog/2019/is-my-pdf-valid/article-header.png
section: blog
author:
  - Oscar Swanros
author_url:
  - https://twitter.com/Swanros
date: 2019-07-01 8:00 UTC
tags: iOS, Swift, Objective-C, PDF, Development
published: true
secret: false
---

PDF documents are a reliable way to represent and preserve information with high fidelity. And here on our blog, we’ve talked at length about some of the most [complicated parts of the PDF spec][complex spec] that PSPDFKit allows you to take advantage of. In this entry, I thought I’d go back to basics and outline one of the first things we do when loading your document to display it on your users’ devices: check if the file in question is even a PDF document we can parse.

## What Is a PDF?

We can answer this question from two points of view: a technical one, and a conceptual one. From the technical perspective, a PDF is a file format with a [special syntax][] that can be read from and written to using a special kind of software. Conceptually, a PDF is a digital representation of _some_ kind of data that’s important enough that we’d like its fidelity to be preserved when we move it from one container to another.

I believe it’s important to draw this distinction, because when asking if a PDF is valid, we need to also ask _which_ perspective we’re interested in. After all, there’s nothing preventing us from having valid PDF syntax written in a faulty file. And in such a case, the logical part of the PDF is valid, while the file itself is not.

## How Can a PDF Become Invalid?

Even in a really “simple” PDF, if the right measures are not taken when writing to it, the result can be a broken file from which data cannot be recovered.

Here are some of the more common ways in which a PDF can be deemed invalid:

- **No Pages** — A PDF is not valid if it does not contain information about pages that should be displayed.
- **Encryption** — A PDF is considered invalid if it is encrypted, but it becomes valid when decrypted.
- **Missing Header** — The PDF spec states that any file with the `.pdf` extension must include a file header that defines the version of the specification that the file adheres to. Most PDF readers will not consider a file to be a valid PDF if this information is not available in the first 1,024 bytes of the file (see section _7.5.2 File Header_ in the spec).

The important thing to note is that the official PDF specification does not provide explicit checks for software to know how a PDF can be determined to be invalid. In the first section, Scope, it states:

> This standard does not specify the following:
>
> - specific processes for converting paper or electronic documents to the PDF format;
> - specific technical design, user interface or implementation or operational details of rendering;
> - specific physical methods of storing these documents such as media and storage conditions;
> - methods for validating the conformance of PDF files or readers;
> - required computer hardware and/or operating system.

This leaves a gaping hole for PDF software vendors, and it requires that they use their best judgement to determine in which instances a PDF file can be considered invalid. In our case, within the context of PSPDFKit, we also deem a PDF invalid if it is encrypted, due to the fact that you effectively can’t interact with it until is unlocked.

Things can get even more complicated if we take other file format standards related to PDF into consideration. One such example of this is [PDF/A][], which is another ISO standard that’s specialized in the archiving and long-term preservation of electronic documents.

PDF/A comprises a set of really specific ways in which data needs to be laid out to accomplish its goal. Because of that, a whole new level of complexity is added in order for us to be able to determine whether or not a PDF/A is valid. As a result, there are even specialized tools, such as the [Isartor Test Suite][] and [veraPDF][], that are tasked with developing tests that can be used as a starting point for creating validation software for this specific format.

## Using PSPDFKit to Validate Documents

At PSPDFKit, we take a rather pragmatic approach to checking if we can work with a file as a PDF or not. Internally, PSPDFKit performs a series of checks to determine if a PDF is valid:

1. **Is this even a PDF?** — We look for the `%PDF-` directive in the file header. If this is missing, we abort any subsequent operations, as we can’t rely on the file to contain PDF syntax.
2. **Is the file large enough to be a valid PDF?** — We check the total file size to see if it is larger than the size of the header (`%PDF`) and the end-of-file marker (`%%EOF`) added together. If this test fails, the file is automatically deemed invalid.
3. **Do we have an end-of-file marker at all?** — We’ll try to load the last 1,024 bytes of the file to look for an `%%EOF` marker. Not having an `%%EOF` marker makes the file an invalid PDF.
4. **Does the file contain more PDF syntax after `%%EOF`?** — If this is the case, then we’re dealing with a malformed file, and trying to perform any other operations with it would be a waste of resources, so we say this case is also grounds to deem a PDF invalid.

From an end user perspective, it’s really easy to see if a PDF is valid or not: if it is, you’ll see it displayed onscreen. If it’s not, you’ll see a message like the one below.

<center><img src="/images/blog/2019/is-my-pdf-valid/invalid-example.png" width="60%"></center>

If you’d like to do a manual check on a document before even attempting to present it, you can do so as follows:

[==

```swift
let url = // Document URL
let document = PSPDFDocument(url: url)

// Check if the document is valid before continuing.
guard document.isValid else {
	// Perform appropriate cleanup actions.
	return
}
```

```objc
NSURL *url = // Document URL
PSPDFDocument *document = [[PSPDFDocument alloc]] initWithURL:url];

// Check if the document is valid before continuing.
if (!document.isValid) {
	// Perform appropriate cleanup actions.
	return;
}
```

==]

Calling `PSPDFDocument.isValid` will lazily load the document. If the document is valid and we were able to parse it correctly, then the document’s pages will be available to us.

## Conclusion

As we saw in this post, there are multiple aspects to consider when determining whether or not a PDF is valid. Given the broad field of applications the PDF format has, it can be very difficult to come to an agreement of what exactly constitutes a “valid” PDF.

At PSPDFKit, we interpret the PDF specification as closely as we can to make sure we can deliver the reliability that our customers expect from us. Nevertheless, as with many aspects of dealing with PDF technologies, this is an ongoing effort and we’ll always be looking to improve the ways in which we can provide the best experience possible.

[special syntax]: https://pspdfkit.com/blog/2018/pdf-syntax-101/
[complex spec]: http://wwwimages.adobe.com/www.adobe.com/content/dam/acom/en/devnet/pdf/pdfs/PDF32000_2008.pdf
[pdf/a]: https://www.pdfa.org/pdfa-faq/
[isartor test suite]: https://www.pdfa.org/resource/isartor-test-suite/
[verapdf]: https://verapdf.org
