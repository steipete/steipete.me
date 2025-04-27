---
title: "Annotate PDFs with Images via PDFKit"
description: "We show you how to annotate a PDF with an image via PDFKit."
preview_image: /images/blog/2019/image-annotation-via-pdfkit/article-header.png
section: blog
author:
  - Nishant Desai
author_url:
  - https://twitter.com/nish_desai
date: 2019-03-11 8:00 UTC
tags: iOS, Development, Swift
published: true
secret: false
---

Apple’s [PDFKit][] supports many basic annotations. Unfortunately, it doesn’t support image annotations out of the box, but it does support [`Stamp Annotation`][]s. So in this blog post, I’ll show you how to use [`Stamp Annotation`][]s to make image annotations.

If you are new to PDFKit, then you can read our post on [Creating a PDF in Swift][], which demonstrates how to create a PDF using PDFKit. This post assumes that you know the basics of creating a PDF in PDFKit. You can download the sample project with code [here][sample-project-link].

## Creating Image Annotations

Let’s begin by creating a subclass of `PDFAnnotation` for an image annotation. We add a property called `image`, of the `UIImage` type, to our subclass. We also have to override [`PDFAnnotation.draw(with:in:)`][] to enable the drawing of our image with an annotation:

[===

```swift
class PDFImageAnnotation: PDFAnnotation {

    var image: UIImage?

    convenience init(_ image: UIImage?, bounds: CGRect, properties: [AnyHashable : Any]?) {
        self.init(bounds: bounds, forType: PDFAnnotationSubtype.stamp, withProperties: properties)
        self.image = image
    }

    override func draw(with box: PDFDisplayBox, in context: CGContext) {
        super.draw(with: box, in: context)

        // Drawing the image within the annotation's bounds.
        guard let cgImage = image?.cgImage else { return }
        context.draw(cgImage, in: bounds)
    }
}
```

===]

In our above subclass, we are using the stamp annotation type since it is the type closest to an image annotation. We don’t want our subclass to allow creation of other annotation subtypes, so we’ve made the default initializer private.

The new image annotation can be used in the same way as the other default annotations. All we need to do is create a new object of `PDFImageAnnotation` with the desired `image` and `bounds` and add it to the page:

[===

```swift
let image = UIImage(named: "myImage")
let imageAnnotation = PDFImageAnnotation(image, bounds: CGRect(x: 200, y: 200, width: 200, height: 200), properties: nil)
page.addAnnotation(imageAnnotation)
```

===]

## Conclusion

That’s it! This is a basic way to add image annotations to a PDF using PDFKit. However, a user might sometimes require more features, such as resizing the image after adding it to the PDF, or something as simple as moving the image around. In such a case, [PSPDFKit][] is a good choice, because it already has an [array of features][] built in. Below is an example of an image annotation with PDFKit versus with PSPDFKit.

![Image Annotation Comparison](/images/blog/2019/image-annotation-via-pdfkit/comparison.png)

PSPDFKit’s features support not only image annotations, but also sound, video, and link annotations. With our deeply integrated systemwide support for PDF documents, working with PDF documents is convenient and easy.

[sample-project-link]: ../../../downloads/pdf-generation-using-pdfkit-sample.zip
[`stamp annotation`]: https://developer.apple.com/documentation/pdfkit/pdfannotationsubtype/2876109-stamp
[creating a pdf in swift]: https://pspdfkit.com/blog/2019/creating-pdf-in-swift/
[`pdfannotation.draw(with:in:)`]: https://developer.apple.com/documentation/pdfkit/pdfannotation/2715891-draw
[pdfkit]: https://developer.apple.com/documentation/pdfkit
[pspdfkit]: https://pspdfkit.com/pdf-sdk/ios/
[array of features]: https://pspdfkit.com/guides/ios/current/features/detailed-list/
