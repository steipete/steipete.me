---
title: "Merge PDFs in Swift"
description: "How to merge multiple PDF files in Swift."
preview_image: /images/blog/2019/merge-pdfs-in-swift/article-header.png
section: blog
author:
  - Stefan Kieleithner
author_url:
  - https://twitter.com/steviki
date: 2019-06-03 8:00 UTC
tags: iOS, Development, Swift
published: true
secret: false
---

There are various scenarios where you might require content that is spread across multiple pages or documents to be in a single PDF file. In such a case, you might want to combine all of your documents into a single new document by merging PDFs. This is a feature that most PDF editors, like [PDF Viewer][], Adobe Acrobat, and Apple’s Preview support.

In this post, we’ll cover how you can build this feature yourself by looking at two of the potential approaches of merging PDFs together on iOS using Swift.

## Using Core Graphics

The first approach uses the built-in Core Graphics and UIKit APIs. PDFs can be merged via [`UIGraphicsPDFRenderer`][]. URLs of the source documents to be merged are provided via `sourceURLs`. We iterate over all the URLs of the source documents, create a `CGPDFDocument` for each one, and draw all the pages into the new PDF in the same order they are in the source PDFs:

```swift
let graphicsRenderer = UIGraphicsPDFRenderer(bounds: .zero)
try graphicsRenderer.writePDF(to: outputURL) { context in
    let pdfContext = context.cgContext
    for pdfUrl in sourceURLs {
        guard let pdfRef = CGPDFDocument(pdfUrl as CFURL) else {
            continue
        }

        for pageIndex in 1 ... pdfRef.numberOfPages {
            if let page = pdfRef.page(at: pageIndex) {
                var mediaBox = page.getBoxRect(.mediaBox)
                pdfContext.beginPage(mediaBox: &mediaBox)
                pdfContext.drawPDFPage(page)
                pdfContext.endPage()
            }
        }
    }
}
```

However, this approach has a few downsides. For one, it loses all existing annotations in the documents, which could be considered the largest dealbreaker. This means any drawings or highlights that were added to the individual documents before merging them won’t be in the final document. And since it draws page by page from the different documents into the new document and doesn’t append each document as a whole to the final document, all document-based information like bookmarks, the outline, the metadata, and page labels get lost as well. Finally, you would need to manually adjust the rotation for rotated pages.

So if you have a simple and straightforward use case, this could work for you. But if you are dealing with PDFs that are highly customized and edited to include a lot of extra information, this approach might not fit your needs.

## Using PSPDFKit

Another option would be to use PSPDFKit’s [Document Editor][document editor guide] component. With this approach, you can merge entire PDF files directly into a new document without having to draw every single page of each PDF separately. In this way, metadata, bookmarks, and other document-based information will be preserved in the new document. PSPDFKit also automatically handles merging rotated pages without the user having to manually adjust anything. And most importantly, annotations will be persisted in the merged document as well:

```swift
guard let firstURL = sourceURLs.first else { return }
try FileManager.default.copyItem(at: firstURL, to: outputURL)
let outputDocument = PSPDFDocument(url: outputURL)
guard let documentEditor = PSPDFDocumentEditor(document: outputDocument) else {
    return
}

let dispatchSemaphore = DispatchSemaphore(value: 0)
// We start not from the first document, but the second document, since we use the first one as a starting point for the output document to merge the following documents into.
for url in sourceURLs[1...] {
    documentEditor.importPages(to: documentEditor.pageCount, from: PSPDFDocument(url: url), withCompletionBlock: { _, error in
        documentEditor.save { document, error in
            dispatchSemaphore.signal()
        }
    }, queue: .global(qos: .userInitiated))
    dispatchSemaphore.wait()
}
```

Notice the use of dispatch semaphores in the snippet above. These are needed because the Document Editor API for importing pages is asynchronous. We use dispatch semaphores to wait for pages from one document being imported into the final document to finish before we can import the pages from the next source document in the queue.

## Memory Considerations

Merging documents is usually a memory-intensive task, since it requires loading parts of a document or even an entire document into memory. Therefore, it’s essential to be aware of this and handle memory accordingly. For example, you could add restrictions, like allowing the merging of PDFs only for documents up to a specific number of pages, or not allowing merging of more than a handful of PDFs at once.

## Conclusion

In this post, we covered two of the potential methods of combining multiple PDFs into a single file using Swift. Now you should have a basic overview of what’s involved in building a feature for merging PDFs. If you want to see the solution that uses PSPDFKit in action, head over to [PDF Viewer][] and download it for free.

[pdf viewer]: https://pdfviewer.io/
[`uigraphicspdfrenderer`]: https://developer.apple.com/documentation/uikit/uigraphicspdfrenderer
[document editor guide]: https://pspdfkit.com/guides/ios/current/features/document-editor/
