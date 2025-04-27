---
title: "Working with PDF Metadata in Swift"
description: "How and what metadata can be stored in a PDF, and how to programmatically work with this information."
preview_image: /images/blog/2019/working-with-pdf-metadata-in-swift/article-header.png
section: blog
author:
  - Stefan Kieleithner
author_url:
  - https://twitter.com/steviki
date: 2019-06-25 8:00 UTC
tags: iOS, Development, Products, Swift
published: true
secret: false
---

A PDF not only consists of pages that display content, but it can also have metadata attached. This metadata is embedded in the file, and it can be used to add additional information to documents.

Most of these attributes — such as the entries for Producer, Creation Date, and Modification Date — are provided by the tools that create the PDF and without the user having to manually set them. Usual attributes that you might want to edit are the Author, Title, Keywords, and Subject. These keys are standardized and defined in the PDF spec so that all PDF viewers respect them. But you can also add and store custom values.

Some PDF editors, like the Document Info UI in [PDF Viewer][], let you edit values in the UI.

In this blog post, we will cover what kind of values can be stored as metadata in a PDF, the different types of metadata, and how to actually store information in metadata using Swift.

## How Is Metadata Stored in the PDF?

Metadata may be stored in a PDF document in two ways: in a PDF-based information dictionary associated with the document, or in a metadata stream containing XMP data.

There are no real advantages or disadvantages to either of these approaches. Just note that they are separate and not compatible with one another. So storing something in PDF-based metadata doesn’t automatically add it to the XMP-based metadata; they need to be handled separately.

## What Can Be Stored in Metadata?

As mentioned above, predefined keys include the Author, Title, Creator, Producer, Creation Date, Modification Date, and Keywords. In addition, custom key-value elements can also be stored. In PDF-based metadata, basic types like strings, numbers, arrays, and dictionaries can be used.

There are no defaults for the XMP metadata; everything in there is custom. XMP metadata only supports storing strings.

For more information and specific details on what and how metadata is used in a PDF, have a look at our [guide article about customizing metadata][metadata guide article].

## Core Graphics and UIKit

Using Core Graphics and UIKit, it’s possible to add PDF metadata when creating a new document via [`UIGraphicsBeginPDFContextToFile`][]. It is not possible to edit that metadata once a document has been created. (For an example of how to use this API, check out our blog post on [Creating a PDF in Swift][creating a pdf in swift blog post].)

However, it is possible to add new XMP document metadata, even for existing documents, with [`CGPDFContextAddDocumentMetadata`][]:

```swift
let pdfContext = UIGraphicsGetCurrentContext()
let xmpPdfMetadata = "Custom Values"
let data = xmpPdfMetadata.data(using: .utf8) as CFData?
pdfContext?.addDocumentMetadata(data)
```

## PDFKit

With PDFKit, you can view and edit the PDF-based metadata via [`documentAttributes`][] on [`PDFDocument`][].

Note that PDFKit doesn’t support setting arbitrary metadata keys and values. It only supports the keys in the PDF specification that are defined in [`PDFDocumentAttribute`][]:

```swift
let document = PDFDocument(url: url)!
var metadata = document.documentAttributes!
metadata[PDFDocumentAttribute.authorAttribute] = "ACME"
metadata[PDFDocumentAttribute.titleAttribute] = "Annual Report"
metadata[PDFDocumentAttribute.keywordsAttribute] = "Report, Yearly, 2019"
document.documentAttributes = metadata
```

## PSPDFKit

PSPDFKit supports both PDF-based and XMP-based metadata, with [`PSPDFDocumentPDFMetadata`][] and [`PSPDFDocumentXMPMetadata`][], respectively.

Once modified, a document will need to be saved for changes to be stored on disk in the actual PDF file.

PSPDFKit also supports adding custom values that you can use to store arbitrary data in a PDF:

```swift
let document = PSPDFDocument(url: url)
let metadata = PSPDFDocumentPDFMetadata(document: document)!
metadata[.authorKey] = "ACME"
metadata[.titleKey] = "Annual Report"
metadata[.keywordsKey] = "Report, Yearly, 2019"
metadata[PSPDFMetadataName(rawValue: "Custom Value")] = "Foo"
try document.save()
```

## Conclusion

In this post, we explored some of the ways you can work and interact with PDF metadata on iOS. If you are curious and want to see PDF metadata in action, you can head over to our [PDF Viewer][] app, which supports reading and editing metadata entries, to try it out.

[creating a pdf in swift blog post]: /blog/2019/creating-pdf-in-swift/#creating-a-pdf
[pdf viewer]: https://pdfviewer.io/
[metadata guide article]: https://pspdfkit.com/guides/ios/current/customizing-pdf-pages/customizing-document-metadata/
[`cgpdfcontextadddocumentmetadata`]: https://developer.apple.com/documentation/coregraphics/cgcontext/1456026-adddocumentmetadata
[`uigraphicsbeginpdfcontexttofile`]: https://developer.apple.com/documentation/uikit/1623927-uigraphicsbeginpdfcontexttofile
[`documentattributes`]: https://developer.apple.com/documentation/pdfkit/pdfdocument/1436054-documentattributes
[`pdfdocument`]: https://developer.apple.com/documentation/pdfkit/pdfdocument
[`pdfdocumentattribute`]: https://developer.apple.com/documentation/pdfkit/pdfdocumentattribute
[customizing document metadata guide]: https://pspdfkit.com/guides/ios/current/customizing-pdf-pages/customizing-document-metadata/
[`pspdfdocumentpdfmetadata`]: https://pspdfkit.com/api/ios/Classes/PSPDFDocumentPDFMetadata.html
[`pspdfdocumentxmpmetadata`]: https://pspdfkit.com/api/ios/Classes/PSPDFDocumentXMPMetadata.html
