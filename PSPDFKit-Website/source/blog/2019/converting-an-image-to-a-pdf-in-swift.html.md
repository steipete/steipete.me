---
title: "Converting an Image to a PDF in Swift"
description: We provide a step-by-step explanation of how to convert an image to a PDF.
preview_image: /images/blog/2019/converting-an-image-to-a-pdf-in-swift/article-header.png
section: blog
author:
  - Stefan Kieleithner
author_url:
  - https://twitter.com/steviki
date: 2019-03-04 8:00 UTC
tags: iOS, Development, Swift
published: true
secret: false
---

Images are universal and can be used in various ways, be it to show relevant content, graphics, or cute cats. However, there might be an occasion where dealing with an image doesn’t suffice and you require a PDF instead.READMORE Use cases for handling PDFs instead of images might include submitting the file to a server that can only deal with PDFs, shrinking the file size with efficient compression algorithms, or optimizing the file for archiving. In this post, we will cover a few ways that an image can be converted to a PDF on iOS in Swift.

## Graphics Context

One of the easiest ways to create a PDF from an image is to use a graphics context, which relies on built-in system APIs. For this example, we are using a `UIImage` instance, and we will generate a PDF file that will be stored on disk with this. First, we generate a `UIGraphicsPDFRenderer` with the size of the image. Then we use the graphics renderer to write a PDF to a specified `URL` on disk. The real magic happens in its action block, where we can use drawing commands to draw the image onto a PDF page. Since we want the image to cover the entire page, we create the renderer with bounds equal to the size of the image, and we use the same bounds when drawing the image. Once the renderer is done, we can use the PDF file that was generated at `outputFileURL`:

```swift
let image: UIImage = ...
let outputFileURL: URL = ...
let imageBounds = CGRect(origin: .zero, size: image.size)
let pdfRenderer = UIGraphicsPDFRenderer(bounds: imageBounds)

do {
    try pdfRenderer.writePDF(to: outputFileURL) { context in
        context.beginPage()
        image.draw(in: imageBounds)
    }
} catch {
    print("Could not create PDF file: \(error)")
}
```

## Processor

Another powerful and versatile way to create PDFs from an image would be to use PSPDFKit for iOS. There are various ways an image can be converted into a PDF with our SDK. One of the most sensible approaches would be to use [`PSPDFProcessor`][] to generate a new PDF file consisting of a single page containing the image.

Let’s create a [`PSPDFNewPageConfiguration`][] that holds the information on how to build the page. It contains which image should be used and how it should be compressed, as well as the information on how large the page should be, which we set again to the size of the image. Afterward, we use a [`PSPDFProcessorConfiguration`][] to add the [`PSPDFNewPageConfiguration`][] instance we just created as the first page. Since we only want to create a single-page document containing our image, we are almost done, and we only need to use the [`PSPDFProcessor`][] to do the actual PDF generation and writing of the file to disk. In the end, we will have a PDF file that is created at a specified `outputFilePath`:

```swift
let image: UIImage = ...
let outputFilePath: String = ...
let pageTemplate = PSPDFPageTemplate(pageType: .emptyPage, identifier: nil)
let newPageConfiguration = PSPDFNewPageConfiguration(pageTemplate: pageTemplate) { builder in
    builder.item = PSPDFProcessorItem(image: image, jpegCompressionQuality: 0.7, builderBlock: nil)
    builder.pageSize = image.size
}

let processorConfiguration = PSPDFProcessorConfiguration()
processorConfiguration.addNewPage(at: 0, configuration: newPageConfiguration)

do {
    try PSPDFProcessor(configuration: processorConfiguration, securityOptions: nil).write(toFileURL: outputFilePath)
} catch {
    print("Could not create PDF file: \(error)")
}
```

## File Size Considerations

Generally, a PDF generated from an image has a file size that is in the same ballpark as the image file size itself. However, there are a few optimizations that can be made to the generated PDF to have a smaller file size. Some of these might come with tradeoffs, such as the image decreasing in quality.

Simply making the PDF page size smaller and rendering the image into a smaller rect won’t have any effect on the file size. The image is still rendered as a whole — just in a smaller context — which doesn’t help in decreasing the file size.

One way to make it smaller would be to render the image with a compressed quality. Depending on your needs, you might be able to justify losing some quality in exchange for getting a smaller sized file. For more ways to decrease the file size of a PDF, please see our [guide article on optimizing PDFs][optimizing pdfs].

## Image Documents

Another solution to show an image as a PDF would be to use [Image Documents][]. This differs quite a bit from the other options, since it doesn’t convert an image to a PDF file, but instead utilizes the actual image file under the hood and saves back to it. It only generates a temporary PDF file while showing the image so that PSPDFKit can annotate it. If you want to allow your users to edit and mark up an image, this solution makes a lot of sense to use and can be done so via [`PSPDFImageDocument`][]:

```swift
let imageURL: URL = // URL to a JPEG or PNG image file at a writeable location.
let imageDocument = PSPDFImageDocument(imageURL: imageURL)
let controller = PSPDFViewController(document: imageDocument, configuration: PSPDFConfiguration.image)
present(UINavigationController(rootViewController: pdfController), animated: true)
```

Using Image Documents has the advantage of allowing modification and edits via the usual PSPDFKit capabilities without having to deal with the image-to-PDF conversion. It also allows you to achieve non-destructive image editing, since all the edits can be deleted at any point to restore the original image.

For more information on Image Documents, you can head over to [our guides][annotate images guide].

## Conclusion

In this article, we went over some of the possible solutions of how an image can be converted to a PDF or used like a PDF via Image Documents. While it doesn’t cover all the possible ways of how this conversion can be achieved, it should give a basic overview of the available methods. Depending on your use case, one of the methods outlined in this post should more or less fit your needs.

[`pspdfprocessor`]: https://pspdfkit.com/api/ios/Classes/PSPDFProcessor.html
[`pspdfnewpageconfiguration`]: https://pspdfkit.com/api/ios/Classes/PSPDFNewPageConfiguration.html
[`pspdfprocessorconfiguration`]: https://pspdfkit.com/api/ios/Classes/PSPDFProcessorConfiguration.html
[optimizing pdfs]: https://pspdfkit.com/guides/ios/current/miscellaneous/optimize-pdf-documents-for-mobile-rendering/
[image documents]: https://pspdfkit.com/pdf-sdk/ios/image-documents/
[`pspdfimagedocument`]: https://pspdfkit.com/api/ios/Classes/PSPDFImageDocument.html
[annotate images guide]: https://pspdfkit.com/guides/ios/current/annotations/annotate-images/
