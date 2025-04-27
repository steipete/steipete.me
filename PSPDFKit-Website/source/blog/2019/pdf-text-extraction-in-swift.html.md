---
title: "PDF Text Extraction in Swift"
description: "We demonstrate how to extract text from a PDF using Swift via PDFKit."
preview_image: /images/blog/2019/pdf-text-extraction-in-swift/article-header.png
section: blog
author:
  - Nishant Desai
author_url:
  - https://twitter.com/nish_desai
date: 2019-05-20 8:00 UTC
tags: iOS, Development, Swift
published: true
secret: false
---

PDF is arguably the [most important file format][], and it is extensively used everywhere. For example, your credit card bills and phone bills are usually sent to you in PDF format, and restaurants will post their menus online this way. Tickets for movies or concerts come as PDF attachments, while students may read books or receive class material in the form of PDFs. Businesses use PDFs to share important information and contracts, and PDF has even become the de facto standard for resumes.

All these documents have one thing in common, and that is that they contain a lot of information in the form of text. Naturally, having the ability to extract text comes in handy, especially in cases where you’d want to copy and paste information or excerpts into another app, share it via messages, etc.

## Extraction

[PDFKit][] offers a very convenient way to extract the entire text from a page. You simply need a [`PDFPage`][] object for a particular page you want to extract text from. It has two properties you can use to do this: The [`string`][] property just gives back plain text, while the [`attributedString`][] property gives back a string with all its attributes ([`NSAttributedString`][]).

`PDFPage` allows you to retrieve information about individual characters as well. If you want to find a character at a given point on the page, you would do something like this:

```swift
// `page` is a `PDFPage` object, and it is returning all the text it contains in the form of a `String` object.
let pageText = page.string

// `point` is the point (`CGPoint`) on the page you wish to find a character at.
let charIndex = page.characterIndex(at: point)

let characterBounds = page.characterBounds(at: charIndex)
```

The above API can be used when you know about the character indexes, but it’s not very useful when you want to deal with a range of characters. But when the API used above is combined with another API of PDFKit called [`PDFSelection`][], it becomes easier to manage a selection of a range of characters.

There are a few different ways to work with `PDFSelection`. It encapsulates the result of the selection based on the coordinates provided. It can encapsulate the selection for a word, an entire line of text, or just the text at specified coordinates. You can also use `NSRange` to extract text using `PDFPage` and `PDFSelection`. This can come in handy when you’d prefer not to deal with coordinates:

```swift
let selectionPoint = CGPoint(x: 100, y: 100)

// Returns the selection for only the word the character is a part of.
let wordSelection = page.selectionForWord(at: selectionPoint)

// Returns the `PDFSelection` for the entire line based on the point in the coordinate space provided.
let lineSelection = page.selectionForLine(at: selectionPoint)

let anotherSelectionPoint = CGPoint(x: 180, y: 240)

// Will create a selection using only the characters occurring between the points given.
let precisionSelection = page.selection(from: selectionPoint, to: anotherSelectionPoint)

// Creates a selection based on the range for the characters provided.
let rangeSelection = page.selection(for: NSRange(location: 3, length: 42))
```

If you’re not using [PDFKit][], you can instead use [`CGPDFScanner`][] along with other Core Graphics APIs to parse a document. This requires in-depth knowledge about the [structure of PDF documents][pdf specifications]. Extracting text (and other information) using Core Graphics is beyond the scope of this post, but Apple’s documentation on [PDF document parsing][document parsing of pdf] is a good starting point.

## Conclusion

There are two system APIs, PDFKit and Core Graphics, that can be used to extract text from a PDF. As seen above, PDFKit has convenient APIs for working with text that are much easier and far less error-prone than using [`CGPDFScanner`][], as with PDFKit, one is not required to have intricate knowledge of the structure of PDF documents. However, as mentioned above, you have to take care of the coordinate system conversion yourself.

[PSPDFKit for iOS][] handles all of this automatically when extracting text, while also giving you the flexibility to [transform coordinates as required][coordinate space conversions]. Additionally, PSPDFKit has an [Indexed Full-Text Search][] component, which can be used to perform extremely quick searches across a large set of documents without you having to deal with text extraction, index and database management, or input sanitization.

[most important file format]: https://motherboard.vice.com/en_us/article/pam43n/why-the-pdf-is-secretly-the-worlds-most-important-file-format
[`pdfpage`]: https://developer.apple.com/documentation/pdfkit/pdfpage
[pdfkit]: https://developer.apple.com/documentation/pdfkit
[`string`]: https://developer.apple.com/documentation/pdfkit/pdfpage/1503949-string
[`attributedstring`]: https://developer.apple.com/documentation/pdfkit/pdfpage/1503883-attributedstring
[`nsattributedstring`]: https://developer.apple.com/documentation/foundation/nsattributedstring
[`pdfselection`]: https://developer.apple.com/documentation/pdfkit/pdfselection
[`cgpdfscanner`]: https://developer.apple.com/documentation/coregraphics/cgpdfscanner
[pdf specifications]: https://www.adobe.com/content/dam/acom/en/devnet/pdf/pdfs/PDF32000_2008.pdf
[document parsing of pdf]: https://developer.apple.com/library/archive/documentation/GraphicsImaging/Conceptual/drawingwithquartz2d/dq_pdf_scan/dq_pdf_scan.html
[pspdfkit for ios]: https://pspdfkit.com/pdf-sdk/ios/
[coordinate space conversions]: https://pspdfkit.com/guides/ios/current/faq/coordinate-spaces/
[indexed full-text search]: https://pspdfkit.com/guides/ios/current/features/indexed-full-text-search/
[pspdfcatalog example]: https://pspdfkit.com/guides/ios/current/getting-started/example-projects/
