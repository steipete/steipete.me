---
title: "Inserting an Image into a PDF with Swift"
description: "We provide a step-by-step explanation of how to insert an image into a PDF using Swift."
preview_image: /images/blog/2019/insert-image-into-pdf-with-swift/article-header.png
section: blog
author:
  - Nishant Desai
author_url:
  - https://twitter.com/nish_desai
date: 2019-07-10 7:00 UTC
tags: iOS, Development, Swift
published: true
secret: false
---

The PDF format allows you to draw and render any type of content you want. You can take an existing image and insert it into a PDF in the [form of an annotation][], or you can make it a part of the PDF content by drawing it. As an example, you might need to add an image to a PDF as part of its original content as opposed to later adding it as an annotation. There are a couple ways to draw an image in a PDF using the available frameworks on iOS. One is by using Core Graphics, and the other is by using [PDFKit][].

## Using Core Graphics

Before the introduction of PDFKit, Core Graphics was the only way to create and modify PDFs on iOS. All the drawing had to be done by accessing the context of the page. One particular detail we should keep in mind is that the origin for the coordinate system of a PDF starts at the bottom left corner. Hence, we will have to manipulate the context in order to match it to the UIKit coordinate system. Drawing an image on a PDF is very similar to drawing it in the context of a view: Only the underlying `CGImage` object of the image you want to draw is required, and this can easily be accessed by the [`cgImage` property][] on a `UIImage` object.

While there are no straightforward ways to directly draw on top of an existing PDF without losing its content, we will be working around this by loading the original PDF document into memory using [`CGPDFDocument`][]. We will then create a new blank PDF document at the same location (making sure it’s writable), iterate over the pages of the original document, and draw their original content using [`CGPDFPage`][], followed by the drawing of the image we intend to insert into the PDF:

```swift
let documentURL = ...

// Create a `CGPDFDocument` object for accessing the PDF pages.
// We need these pages in order to draw the original/existing content, because `UIGraphicsBeginPDFContextToFile` creates a file with a clean slate.
// We will have the original file contents in memory as long as the `CGPDFDocument` object is around, even after we have started rewriting the file at the path.
guard let originalDocument = CGPDFDocument(documentURL as CFURL) else {
    print("Unable to create read document.")
    return
}

// Create a new PDF at the same path to draw the contents into.
UIGraphicsBeginPDFContextToFile(documentURL.path, CGRect.zero, nil)

let image = UIImage(named: "my_image_name")!

guard let pdfContext = UIGraphicsGetCurrentContext() else {
    print("Unable to access PDF Context.")
    return
}

let pageSize = UIGraphicsGetPDFContextBounds().size

for pageIndex in 0..<originalDocument.numberOfPages {

    // Mark the beginning of the page.
    pdfContext.beginPDFPage(nil)

    // Pages are numbered starting from 1.
    // Access the `CGPDFPage` object with the original contents.
    guard let currentPage = originalDocument.page(at: pageIndex + 1) else {
        return
    }

    // Draw the existing page contents.
    pdfContext.drawPDFPage(currentPage)

    // Save the context state to restore after we are done drawing the image.
    pdfContext.saveGState()

    // Change the PDF context to match the UIKit coordinate system.
    pdfContext.translateBy(x: 0, y: pageSize.height)
    pdfContext.scaleBy(x: 1, y: -1)


    // Location of the image to be drawn in UIKit coordinates.
    let imagePosition = CGRect(x: 0, y: 0, width: 50, height: 50)
    image.draw(in: imagePosition)

    // Restoring the context back to its original state.
    pdfContext.restoreGState()

    // Mark the end of the current page.
    pdfContext.endPDFPage()
}

// End the PDF context, essentially closing the PDF document context.
UIGraphicsEndPDFContext()
```

That’s all well and good, but there’s one major caveat: This approach does not automatically copy all the existing annotations from the original document to the new one. This is one of the biggest drawbacks of using Core Graphics. As such, we don’t recommend using this approach unless you are creating a brand-new document or you are certain the original document doesn’t have any annotations, as it will lead to a loss of data.

## Using PDFKit

When it comes to using PDFKit, the drawing process is similar to that of Core Graphics, but with a few extra steps for adding the annotations back after drawing on a new page. First, let’s see how we can draw an image on a page using PDFKit:

```swift
let documentURL = ... // URL to your PDF document.

// Create a `PDFDocument` object using the URL.
let pdfDocument = PDFDocument(url: url)!

// `page` is of type `PDFPage`.
let page = pdfDocument.page(at: 0)!

 // Extract the crop box of the PDF. We need this to create an appropriate graphics context.
let bounds = page.bounds(for: .cropBox)

// Create a `UIGraphicsImageRenderer` to use for drawing an image.
let renderer = UIGraphicsImageRenderer(bounds: bounds, format: UIGraphicsImageRendererFormat.default())

// This method returns an image and takes a block in which you can perform any kind of drawing.
let image = renderer.image { (context) in
    // We transform the CTM to match the PDF's coordinate system, but only long enough to draw the page.
    context.cgContext.saveGState()

    context.cgContext.translateBy(x: 0, y: bounds.height)
    context.cgContext.concatenate(CGAffineTransform.init(scaleX: 1, y: -1))
    page.draw(with: .mediaBox, to: context.cgContext)

    context.cgContext.restoreGState()

    let myImage = ... // A `UIImage` object of the image you want to draw.

    let imageRect = ... // `CGRect` for the image.

    // Draw your image onto the context.
    myImage.draw(in: imageRect)
}

// Create a new `PDFPage` with the image that was generated above.
let newPage = PDFPage(image: image)!

// Add the existing annotations from the existing page to the new page we created.
for annotation in page.annotations {
    newPage.addAnnotation(annotation)
}

// Insert the newly created page at the position of the original page.
pdfDocument.insert(newPage, at: 0)

// Remove the original page.
pdfDocument.removePage(at: 1)

// Save the document changes.
pdfDocument.write(toFile: filePath)
```

Unfortunately, this comes with the disadvantage that the contents of the page are added as an image, which means that if the page contained text, that text will no longer be extractable or selectable. The user will also not be able to highlight the text using a highlight annotation.

## Using PSPDFKit for iOS

So now we turn to PSPDFKit for iOS. Lucky for us, the [PSPDFKit SDK for iOS][pspdfkit for ios] has a special class, [`PSPDFProcessor`][], which can be used to draw not only images, but all kinds of content. It does this using a simple block called [`PSPDFRenderBlock`][], which draws without losing any annotations or converting the text to an image:

```swift
let documentURL = ... // URL to your PDF document.

// Create a `PSPDFDocument`.
let document = PSPDFDocument(url: documentURL)

// Create default configuration.
let configuration = PSPDFProcessorConfiguration(document: document)!

let renderDrawBlock: PSPDFRenderDrawBlock = { context, page, cropBox, _, _ in
    // Perform your image drawing here.
}

// Ask the configuration to draw your rendering on all pages.
configuration.draw(onAllCurrentPages: renderDrawBlock)

// Create a `PSPDFProcessor` that uses the above configuration.
let processor = PSPDFProcessor(configuration: configuration, securityOptions: nil)

let destinationURL = ... // URL to store the document with custom drawing.

// Use the processor to create a new document.
try! processor.write(toFileURL: destinationURL)
```

## Conclusion

In this post, we went over the two basic iOS methods of adding an image to a PDF document. Both of these approaches, Core Graphics and PDFKit, have unique downsides and, as a result, do not offer a full solution. This can be a possible dealbreaker for quite a few users. However, [PSPDFKit for iOS][] provides a simple yet elegant solution to adding an image to a PDF document without any of the above-mentioned downsides, so if you have more complex use cases, consider using [PSPDFKit][] to help you accomplish them.

[form of an annotation]: https://pspdfkit.com/blog/2019/image-annotation-via-pdfkit/
[pdfkit]: https://developer.apple.com/documentation/pdfkit
[`cgpdfdocument`]: https://developer.apple.com/documentation/coregraphics/cgpdfdocument
[`cgpdfpage`]: https://developer.apple.com/documentation/coregraphics/cgpdfdocument/cgpdfpage
[pspdfkit for ios]: https://pspdfkit.com/pdf-sdk/ios/
[pspdfkit]: https://pspdfkit.com/try/
[`cgimage` property]: https://developer.apple.com/documentation/uikit/uiimage/1624147-cgimage
[`pspdfprocessor`]: https://pspdfkit.com/api/ios/Classes/PSPDFProcessor.html
[`pspdfrenderblock`]: https://pspdfkit.com/api/ios/Other%20Type%20Definitions.html#/c:PSPDFRenderOption.h@T@PSPDFRenderDrawBlock
