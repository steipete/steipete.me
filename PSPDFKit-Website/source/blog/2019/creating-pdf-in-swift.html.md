---
title: "Creating a PDF in Swift Using PDFKit"
description: "We show you how to customize a PDF in Swift using PDFKit."
preview_image: /images/blog/2019/creating-pdf-in-swift/article-header.png
section: blog
author:
  - Nishant Desai
author_url:
  - https://twitter.com/nish_desai
date: 2019-01-15 8:00 UTC
tags: iOS, Development, Swift
published: true
secret: false
---

PDF is one of the most popular file formats in the world, and viewing PDF files is supported on almost all devices and operating systems out of the box. In the past, we talked about the different [ways to create a PDF on iOS][]. One such way is with the [PDFKit framework][pdfkit] from Apple, which has been available since iOS 11 and allows for configuring the metadata of a PDF document and customizing the PDF by adding widgets and annotations. Today, we’re going to talk about how to use the basics of PDFKit to configure and modify a PDF document.

## Creating a PDF

The metadata information for a PDF has to be set while generating the PDF context for its creation. There is a set of [auxiliary dictionary keys][metadata keys] that are part of the PDF, and these keys are used to specify the metadata for the PDF. It’s important to note that PDFKit does not allow creating a PDF, and as such, Core Graphics needs to be used:

[===

```swift
let documentsDirectory = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
let filePath = (documentsDirectory as NSString).appendingPathComponent("foo.pdf") as String

let pdfTitle = "Swift-Generated PDF"
let pdfMetadata = [
    // The name of the application creating the PDF.
    kCGPDFContextCreator: "Your iOS App",

    // The name of the PDF's author.
    kCGPDFContextAuthor: "Foo Bar",

    // The title of the PDF.
    kCGPDFContextTitle: "Lorem Ipsum",

    // Encrypts the document with the value as the owner password. Used to enable/disable different permissions.
    kCGPDFContextOwnerPassword: "myPassword123"
]

// Creates a new PDF file at the specified path.
UIGraphicsBeginPDFContextToFile(filePath, CGRect.zero, pdfMetadata)

// Creates a new page in the current PDF context.
UIGraphicsBeginPDFPage()

// Default size of the page is 612x72.
let pageSize = UIGraphicsGetPDFContextBounds().size
let font = UIFont.preferredFont(forTextStyle: .largeTitle)

// Let's draw the title of the PDF on top of the page.
let attributedPDFTitle = NSAttributedString(string: pdfTitle, attributes: [NSAttributedString.Key.font: font])
let stringSize = attributedPDFTitle.size()
let stringRect = CGRect(x: (pageSize.width / 2 - stringSize.width / 2), y: 20, width: stringSize.width, height: stringSize.height)
attributedPDFTitle.draw(in: stringRect)

// Closes the current PDF context and ends writing to the file.
UIGraphicsEndPDFContext()
```

===]

Since the annotated Core Foundation APIs are [automatically memory-managed in Swift][], we do not have to be concerned with the manual retaining and releasing of objects here. Apart from these basic keys, there are [other keys][metadata keys] which can be used to create the metadata for a PDF.

## Viewing a PDF

The traditional approach for viewing a PDF is to open it in a web view. Since we have the [PDFKit framework][pdfkit], we can leverage that to view PDF documents in our apps:

[===

```swift


// Do not forget to import the PDFKit framework.
import PDFKit

// ....
// ....

// Create and add a `PDFView` to the view hierarchy.
let pdfView = PDFView(frame: view.bounds)
pdfView.autoscales = true
view.addSubview(pdfView)

// Create a `PDFDocument` object and set it as `PDFView`'s document to load the document in that view.
let pdfDocument = PDFDocument(url: URL(fileURLWithPath: filePath))!
pdfView.document = pdfDocument
```

===]

## Modifying a PDF

PDFKit can also be used to modify the contents of a PDF, like so:

[===

```swift
// Adding an annotation.
let squareAnnotation = PDFAnnotation(bounds: CGRect(x: 200, y: 100, width: 100, height: 100), forType: PDFAnnotationSubtype.square, withProperties: nil)
squareAnnotation.color = UIColor.blue
let page = pdfDocument.page(at: 0)!
page.addAnnotation(squareAnnotation)

// Writing the changes to the file.
pdfDocument.write(toFile: self.filePath)
```

===]

One thing that needs to be considered is that the [coordinate system of a PDF][] is different than that of the views: The origin of the coordinates in a PDF is in the bottom-left corner instead of top-left corner like in the views.

PDFKit has methods on [`PDFView`][] to convert the coordinates to the PDF space, but there’s one issue with them, which is that if the bounds of the `PDFView` are bigger than that of the page size in the document, you could end up making changes outside the bounds of the drawn page and losing your content.

## Conclusion

This blog post covered how to create and modify a PDF in Swift using PDFKit. While it’s relatively easy to do, the PDFKit framework was only introduced in 2017, and it still lacks some features that certain users might require. Another downside of using PDFKit is that the framework update frequency is not too high, meaning that the introduction of newer features and fixing of existing bugs could take some time.

[PSPDFKit for iOS][], on the other hand, is a feature-rich, battle-tested framework trusted by some of the [largest companies in the world][pspdf-references]. Below is an example comparison of how a PDF appears using PDFView and PSPDFKit.

![PDFView and PSPDFKit comparison](/images/blog/2019/creating-pdf-in-swift/comparison.png)

PSPDFKit supports [customizing the appearance of the page][appearance-mode-manager], allows [generating pdf reports][], and [much more][]. It includes numerous [example projects][], which help you set up the SDK with your project. We are always improving the framework, fixing issues, and [releasing updates regularly][ios-changelog] to ensure the best possible experience for the user. If you have been using PDFKit and want to switch, we also have a [guide for migrating to PSPDFKit][].

[ways to create a pdf on ios]: https://pspdfkit.com/blog/2018/ways-to-create-a-pdf-on-ios/
[metadata keys]: https://developer.apple.com/documentation/coregraphics/cgpdfcontext/auxiliary_dictionary_keys?language=swift
[coordinate system of a pdf]: https://pspdfkit.com/guides/android/current/faq/coordinate-spaces/
[automatically memory-managed in swift]: https://developer.apple.com/documentation/swift/imported_c_and_objective-c_apis/working_with_core_foundation_types
[pdfkit]: https://developer.apple.com/documentation/pdfkit
[appearance-mode-manager]: https://pspdfkit.com/guides/ios/current/customizing-the-interface/appearance-mode-manager/
[`pdfview`]: https://developer.apple.com/documentation/pdfkit/pdfview
[pspdfkit for ios]: https://pspdfkit.com/pdf-sdk/ios/
[pspdf-references]: https://pspdfkit.com/references/
[generating pdf reports]: https://pspdfkit.com/guides/ios/current/generating-pdfs/generating-pdf-reports/
[much more]: https://pspdfkit.com/guides/ios/current/features/detailed-list/
[example projects]: https://pspdfkit.com/guides/ios/current/getting-started/example-projects/
[guide for migrating to pspdfkit]: https://pspdfkit.com/guides/ios/current/migration-guides/migrating-from-apple-pdfkit/
[ios-changelog]: https://pspdfkit.com/changelog/ios/
