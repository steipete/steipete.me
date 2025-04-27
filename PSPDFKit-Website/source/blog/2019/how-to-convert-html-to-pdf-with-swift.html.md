---
title: "How to Convert HTML to PDF with Swift"
description: "A tutorial about how to convert simple HTML to PDF using Swift."
preview_image: /images/blog/2019/how-to-convert-html-to-pdf-with-swift/article-header.png
section: blog
author:
  - Rad Azzouz
author_url:
  - https://twitter.com/radazzouz
date: 2019-02-11 8:00 UTC
tags: iOS, Development, Swift
published: true
secret: false
---

A widespread use case for many businesses is to give their users the ability to download data from their website as a PDF. Examples of this include invoices, concert tickets, and flight tickets.
READMORE

PSPDFKit for iOS allows you to convert HTML into PDF using the [Document Processing feature][document processing]. In this post, we will look at how to convert simple HTML (not complex webpages) to PDF using Swift. For our example, we’ll be using [Sparksuite’s Simple HTML invoice template][simple-html-invoice-template repo] to convert the static HTML to PDF.

So let’s get started!

## Get the HTML String

First, we need to create the URL that points to the HTML file:

```swift
// Uses a local HTML file.
let htmlFileURL = Bundle.main.url(forResource: "invoice", withExtension: "html", subdirectory:"Samples")!
```

Then, we use the file URL to create a string variable that contains the entire HTML payload. In Swift, it would look like this:

```swift
let htmlString = try! String(contentsOf: htmlFileURL, encoding: .utf8)
```

> ℹ️ **Note:** If you’re looking to use a remote HTML file, you need to download it first using [`URLSession`][urlsession-apple-api]. Otherwise, you can use [`generatePDFFromURL:completionBlock:`][].

## Use the Document Processor

Now that we have the HTML payload as a string variable, we need to create a URL variable that specifies where the PDF processor should write the newly generated PDF file to disk:

```swift
// The URL where the PDF should be created.
// Note that it needs to point to a writable location.
let outputURL: URL = ...
```

Then, we need to create the options dictionary that we pass to the processor. In this case, we pass `1` for [`PSPDFProcessorNumberOfPagesKey`][pspdfprocessornumberofpageskey-api] to specify that the generated PDF should have a single page, and [`PSPDFProcessorDocumentTitleKey`][pspdfrocessordocumenttitlekey-api] for the title of the new PDF:

```swift
// Create the options for the PDF processor.
let options = [PSPDFProcessorNumberOfPagesKey: 1, PSPDFProcessorDocumentTitleKey: "Generated PDF"] as [String: Any]
```

Now, we create a new [`PSPDFProcessor`][pspdfrocessor-api] instance using the options dictionary from above:

```swift
// Create the processor instance.
let processor = PSPDFProcessor(options: options)
```

Finally, we call [`-convertHTMLString:outputFileURL:`][] on the document processor and pass the HTML string and the output URL to create the new document, like this:

```swift
// Process/convert the HTML string to PDF.
processor.convertHTMLString(htmlString, outputFileURL: outputURL) { _ in
    // Generate the PDF document.
    let document = PSPDFDocument(url: outputURL)
    let pdfController = PSPDFViewController(document: document)
    // Present the PDF view controller.
}
```

That’s all!

You can download this example as a runnable sample project. To do so, please take a look at `ConvertHTMLToPDFExample.swift` from our [Catalog app][catalog].

## Conclusion

In this article, we discussed how to generate a PDF using simple HTML and the [Document Processor][document-processing-guide] feature. There are many other ways to create PDF documents by using features like the [Document Editor][document-editor-guide], [Annotations][introduction-to-annotations-guide], and [Forms][introduction-to-forms-guide]. Please refer to our blog post that details how to [Generate On-Device PDF Reports on iOS][generate-on-device-pdf-reports-on-ios-blogpost] for more information.

[document processing]: /guides/ios/current/features/document-processing/
[simple-html-invoice-template repo]: https://github.com/sparksuite/simple-html-invoice-template
[urlsession-apple-api]: https://developer.apple.com/documentation/foundation/urlsession
[pspdfprocessornumberofpageskey-api]: https://pspdfkit.com/api/ios/Other%20Constants.html#/c:@PSPDFProcessorNumberOfPagesKey
[pspdfrocessordocumenttitlekey-api]: https://pspdfkit.com/api/ios/Other%20Constants.html#/c:@PSPDFProcessorDocumentTitleKey
[pspdfrocessor-api]: https://pspdfkit.com/api/ios/Classes/PSPDFProcessor.html
[`-converthtmlstring:outputfileurl:`]: https://pspdfkit.com/api/ios/Classes/PSPDFProcessor.html#/c:objc(cs)PSPDFProcessor(im)convertHTMLString:outputFileURL:
[`generatepdffromurl:completionblock:`]: https://pspdfkit.com/api/ios/Classes/PSPDFProcessor.html#/c:objc(cs)PSPDFProcessor(im)generatePDFFromURL:completionBlock:
[catalog]: /guides/ios/current/getting-started/example-projects/#pspdfcatalog
[document-processing-guide]: /guides/ios/current/features/document-processing/
[document-editor-guide]: /guides/ios/current/features/document-editor/#programmatic-access
[introduction-to-annotations-guide]: /guides/ios/current/annotations/introduction-to-annotations/
[introduction-to-forms-guide]: /guides/ios/current/forms/introduction-to-forms/
[generate-on-device-pdf-reports-on-ios-blogpost]: /blog/2018/generate-on-device-pdf-reports-on-ios/
