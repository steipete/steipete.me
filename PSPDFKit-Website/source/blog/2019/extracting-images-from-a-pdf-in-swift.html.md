---
title: "Extracting Images from a PDF in Swift"
description: "How to extract images from a PDF with Swift."
preview_image: /images/blog/2019/extracting-images-from-a-pdf-in-swift/article-header.png
section: blog
author:
  - Stefan Kieleithner
author_url:
  - https://twitter.com/steviki
date: 2019-03-25 8:00 UTC
tags: iOS, Development, Swift
published: true
secret: false
---

Sometimes when dealing with a PDF, you might find an image embedded on a page that you would like to have extracted as an image file for storing or editing. In this post, we will go over potential approaches to extracting an embedded image from a document page using Swift.

Note that extracting images is different than rendering a PDF page as an image. An embedded image is only a single part of a PDF page, which means it needs to be queried and extracted from the internal PDF structure.

Also be aware that not all content from a PDF that looks like an image can be extracted via the below methods. While many things may look like images, some contents might actually be represented as vector graphics in the PDF, and as such, can’t be extracted via the following approaches.

## Using Core Graphics

The first method we’ll cover is how extracting embedded images can be done with the system-provided API, and we’ll use the PDF support of `CoreGraphics` for this. To use this API, it’s necessary to familiarize ourselves a bit with the PDF structure, since we will need to extract the images from the PDF file structure manually.

We use [`CGPDFDocument`][] to open the document and get the appropriate [`CGPDFPage`][] where the image we want to extract is placed. Then we get the `Resources` dictionary entry, which is represented by a [`CGPDFDictionary`][] object. Traversing the PDF tree further, we retrieve the `XObject` entry, which might contain multiple elements on a PDF page, including images. Then we try to get the image stream — a [`CGPDFStream`][] object — of the first image on the page, which might be represented by the `Im0` entry. Finally, we extract the image data from the stream object, which we in turn convert into a `UIImage` object. Simplified, this can be expressed as the following:

`CGPDFPage -> Resources -> XObject -> Im0`

All of this can be done with logic like this:

```swift
func getEmbeddedImage(ofPDFAt url: URL, pageIndex: Int) -> UIImage? {
    guard let document = CGPDFDocument(url as CFURL) else {
        print("Couldn't open PDF.")
        return nil
    }
    // `page(at:)` uses pages numbered starting at 1.
    let page = pageIndex + 1
    guard let pdfPage = document.page(at: page), let dictionary = pdfPage.dictionary else {
        print("Couldn't open page.")
        return nil
    }
    var res: CGPDFDictionaryRef?
    guard CGPDFDictionaryGetDictionary(dictionary, "Resources", &res), let resources = res else {
        print("Couldn't get Resources.")
        return nil
    }
    var xObj: CGPDFDictionaryRef?
    guard CGPDFDictionaryGetDictionary(resources, "XObject", &xObj), let xObject = xObj else {
        print("Couldn't load page XObject.")
        return nil
    }
    var stream: CGPDFStreamRef?
    guard CGPDFDictionaryGetStream(xObject, "Im0", &stream), let imageStream = stream else {
        print("No image on PDF page.")
        return nil
    }
    var format: CGPDFDataFormat = .raw
    guard let data = CGPDFStreamCopyData(imageStream, &format) else {
        print("Couldn't convert image stream to data.")
        return nil
    }
    let image = UIImage(data: data as Data)
    return image
}
```

This approach usually succeeds and yields a result if the page has an embedded image. However, be aware that this might not always be the case, since the `Im0` entry is not guaranteed to be used for the first image. As a result, this logic might not always return the correct image, or any image at all, as we only check for the image with the key `Im0`. In the case where the PDF page doesn’t have an image with the key `Im0`, but instead with some other key, this logic would not detect it.

To cover all possible cases, we would need to iterate over all the objects that are available in the `XObject` element, check if the `Subtype` entry is of type `Image` (since this indicates that the object is an image), and extract the image for those entries. So, to make sure to extract all available images of a PDF page, we could use this logic:

```swift
var imageKeys = [String]()
CGPDFDictionaryApplyBlock(xObject, { key, object, _ in
    var stream: CGPDFStreamRef?
    guard CGPDFObjectGetValue(object, .stream, &stream),
        let objectStream = stream,
        let streamDictionary = CGPDFStreamGetDictionary(objectStream) else { return true }
    var subtype: UnsafePointer<Int8>?
    guard CGPDFDictionaryGetName(streamDictionary, "Subtype", &subtype), let subtypeName = subtype else { return true }
    if String(cString: subtypeName) == "Image" {
        imageKeys.append(String(cString: key))
    }
    return true
}, nil)

let allPageImages = imageKeys.compactMap { imageKey -> UIImage? in
    var stream: CGPDFStreamRef?
    guard CGPDFDictionaryGetStream(xObject, imageKey, &stream), let imageStream = stream else {
        print("Couldn't get image stream.")
        return nil
    }
    var format: CGPDFDataFormat = .raw
    guard let data = CGPDFStreamCopyData(imageStream, &format) else {
        print("Couldn't convert image stream to data.")
        return nil
    }
    guard let image = UIImage(data: data as Data) else {
        print("Couldn't convert image data to image.")
        return nil
    }
    return image
}
```

Note that [`CGPDFDictionaryApplyBlock`][] is only available from iOS 12 on. For previous versions, you can instead use [`CGPDFDictionaryApplyFunction`][], which requires a bit more overhead than its newer counterpart, but works just as fine.

## Using PDFKit

While most of the above logic is not possible in PDFKit, as it doesn’t provide APIs that are low-level enough to extract images, you can at least query the [`CGPDFPage`][] instance via the [`pageRef`][] property on [`PDFPage`][], which in turn can be accessed via [`page(at:)`][] from the [`PDFDocument`][]. This will enable you to execute the logic mentioned in the section above.

## Using PSPDFKit

PSPDFKit for iOS has APIs available for extracting objects in a PDF without requiring any knowledge about the internal structure of the PDF. This includes support for extracting embedded images of a page. To retrieve the images, you first need to get the [`PSPDFTextParser`][] for the appropriate page where the image you would like to extract is located. The text parser already has a ready-to-use [`images`][] property that returns [`PSPDFImageInfo`][] values for all the available images on the page. Note that, for performance reasons, this property does not directly return all `UIImage` objects, since querying these will require additional parsing of the PDF, and in some cases, getting only the metadata for these images is already enough. But in our case, we are fine with further parsing of the PDF to extract the actual image data, so we call [`imageInRGBColorSpace()`][], which extracts the image data from the page and creates a `UIImage` representation of the data.

Extracting all the images on a single PDF page can be done like this:

```swift
func getEmbeddedImages(ofPDFAt url: URL, pageIndex: PageIndex) -> [UIImage] {
    let document = PSPDFDocument(url: url)
    guard let textParser = document.textParserForPage(at: pageIndex) else {
        print("Failed to get text parser.")
        return []
    }
    return textParser.images.compactMap { imageInfo  in
        return try? imageInfo.imageInRGBColorSpace()
    }
}
```

## Conclusion

In this post, we explored two methods of how embedded images can be obtained from a PDF document in Swift. While extracting images from a PDF is supported via `CGPDF` APIs that are already available by default on iOS, implementing the actual logic to handle the extraction is not that straightforward, and this requires quite a bit of knowledge about the underlying structure of a PDF. So if you don’t want to worry about all these technical details, PSPDFKit can help. With our APIs, retrieving embedded images from a PDF page is simply a matter of a few lines of code.

[`cgpdfdocument`]: https://developer.apple.com/documentation/coregraphics/cgpdfdocument?language=objc
[`cgpdfpage`]: https://developer.apple.com/documentation/coregraphics/cgpdfdocument/cgpdfpage
[`cgpdfdictionary`]: https://developer.apple.com/documentation/coregraphics/cgpdfdocument/cgpdfdictionary
[`cgpdfstream`]: https://developer.apple.com/documentation/coregraphics/cgpdfdocument/cgpdfstream
[`cgpdfdictionaryapplyblock`]: https://developer.apple.com/documentation/coregraphics/2962842-cgpdfdictionaryapplyblock
[`cgpdfdictionaryapplyfunction`]: https://developer.apple.com/documentation/coregraphics/1430216-cgpdfdictionaryapplyfunction
[`pspdftextparser`]: https://pspdfkit.com/api/ios/Classes/PSPDFTextParser.html
[`images`]: https://pspdfkit.com/api/ios/Classes/PSPDFTextParser.html#/c:objc(cs)PSPDFTextParser(py)images
[`pspdfimageinfo`]: https://pspdfkit.com/api/ios/Classes/PSPDFImageInfo.html
[`imageinrgbcolorspace()`]: https://pspdfkit.com/api/ios/Classes/PSPDFImageInfo.html#/c:objc(cs)PSPDFImageInfo(im)imageInRGBColorSpaceWithError:
[`pageref`]: https://developer.apple.com/documentation/pdfkit/pdfpage/1504419-pageref
[`page(at:)`]: https://developer.apple.com/documentation/pdfkit/pdfdocument/1436018-page
[`pdfdocument`]: https://developer.apple.com/documentation/pdfkit/pdfdocument
[`pdfpage`]: https://developer.apple.com/documentation/pdfkit/pdfpage
