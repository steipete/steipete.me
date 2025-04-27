---
title: "Search and Redact Text in Swift"
description: "How to search and redact text using Swift and PSPDFKit for iOS."
preview_image: /images/blog/2018/search-and-redact-text-in-swift/article-header.png
section: blog
author:
  - Rad Azzouz
author_url:
  - https://twitter.com/radazzouz
date: 2018-12-05 8:00 UTC
tags: iOS, Development, Swift
published: true
secret: false
---

In PSPDFKit 8 for iOS, we introduced the [redaction feature][redaction-guide], which allows you to permanently and irrevocably remove content from PDF documents. 
READMORE

A widespread use case for redaction is to search and redact text such as email addresses, phone numbers, or any other sensitive text. However, in this tutorial we’ll keep things easy by discussing how to redact a simple search term using Swift and PSPDFKit for iOS.

## What Is Redaction?

Redaction is the process of removing content from a PDF page. It not only involves obscuring the content but also removing the data in the document within the specified region.

Redaction is a two-step process:

1. Mark areas for redaction — Create redaction annotations ([`PSPDFRedactionAnnotation`][pspdfredactionannotation-api]) for the areas that should be redacted. This step won’t remove any content from the document yet; it just marks regions for redaction.
2. Remove the content — The redaction annotations need to be applied. In this step, the page content within the region of the redaction annotations is irreversibly removed.

## Search and Mark Text for Redaction

In this example, for the sake of simplicity, our search term is PSPDFKit, and we use case-sensitive search. This means that our search will match all the words that contain PSPDFKit, including PSPDFKitUI, but it will not match strings like pspdfkit.com.

So let’s get started!

First, we need to search for all occurrences of the search term in the document. We’ll use [`PSPDFTextParser`][pspdftextparser-api] to get all the words on the specified page index, and then we’ll loop through all the words and check if they match the search term. If a word matches the search term, we add a redaction annotation. Here’s how it looks in Swift:

```swift
let document: PSPDFDocument = ...
let wordToRedact = "PSPDFKit"
for pageIndex in 0..<document.pageCount {
    if let textParser = document.textParserForPage(at: pageIndex) {
        textParser.words.forEach { word in
        // Redact all the words that contain the search term.
        if word.stringValue.contains(wordToRedact) {
            let redactionRect = word.frame
            let redaction = PSPDFRedactionAnnotation()
            redaction.boundingBox = redactionRect
            redaction.rectsTyped = [redactionRect]
            redaction.color = .orange
            redaction.fillColor = .black
            redaction.overlayText = "REDACTED"
            redaction.pageIndex = pageIndex

            // Add the redaction annotation.
            document.add([redaction])
        }
    }
}
```

## Apply Redactions and Create a New Redacted PDF Document

Now that we’ve marked the words for redaction, we need to apply the redaction to remove the text permanently. We use [`PSPDFProcessor`][pspdfprocessor-api] to create a new redacted PDF document, like so:

```swift
// Use PSPDFProcessor to create the newly redacted document.
let processorConfiguration = PSPDFProcessorConfiguration(document: document)!
processorConfiguration.applyRedactions()

let redactedDocumentURL = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent("redacted.pdf")
let processor = PSPDFProcessor(configuration: processorConfiguration, securityOptions: nil)
try? processor.write(toFileURL: redactedDocumentURL)

// Instantiate the redacted document.
let redactedDocument = PSPDFDocument(url: redactedDocumentURL)
```

That’s all!

For the full running sample project, please take a look at `SearchAndRedactTextExample.swift` from the [Catalog app][catalog-guide].

## Conclusion

In this article, we discussed how to redact a PDF document using a simple search term. If your use case requires a more complex search, you can use regular expressions, which can be handy for redacting information like phone numbers or email addresses.

[redaction-guide]: /guides/ios/current/features/redaction/
[pspdfredactionannotation-api]: https://pspdfkit.com/api/ios/Classes/PSPDFRedactionAnnotation.html
[pspdftextparser-api]: https://pspdfkit.com/api/ios/Classes/PSPDFTextParser.html
[pspdfprocessor-api]: https://pspdfkit.com/api/ios/Classes/PSPDFProcessor.html
[catalog-guide]: /guides/ios/current/getting-started/example-projects/#pspdfcatalog
