---
title: "Ways to Create a PDF on iOS"
description: "We look at the different ways of creating a PDF on iOS."
preview_image: /images/blog/2018/ways-to-create-a-pdf-on-ios/article-header.png
section: blog
date: 2018-02-26 12:00 UTC
tags: Development, iOS
published: true
cta: ios
---

PSPDFKit can be used for viewing, searching, and editing existing PDF documents, and typically these documents come from somewhere else — but how can you create a PDF on iOS? 

READMORE

This post will answer the above question. First we’ll look at how users can make PDFs in other apps. Then we’ll see how your app can use the [`PSPDFProcessor`][] class from PSPDFKit to generate blank PDFs or convert existing content. Finally, we’ll see how to create PDFs from scratch.

## Export a PDF from a Document Creation App

Almost all document creation apps can export to PDF. For example, both Microsoft Word and Apple’s Pages can do this.

![Screen shots of PDF export flow in Pages](/images/blog/2018/ways-to-create-a-pdf-on-ios/pages.png)

## Create a PDF from a Webpage

You can create a PDF from a webpage in Safari by tapping the share button and then scrolling through the lower row of icons until you find the “Create PDF” icon.

![Screen shots of creating a PDF from a webpage in Safari](/images/blog/2018/ways-to-create-a-pdf-on-ios/webpage-1.png)
![Screen shots of generated PDF](/images/blog/2018/ways-to-create-a-pdf-on-ios/webpage-2.png)

This creates a PDF with a single page, so it will be extremely tall if the webpage is long.

Creating a PDF this way requires user action. Further down, we’ll look at how your app can create a PDF from a webpage programmatically using PSPDFKit.

## Open a PDF from the iOS Print Preview

You can make a PDF from anything that can be printed. For webpages, this often produces better PDFs than the technique above because the document will be broken up into sensibly sized pages.

To create a PDF from the iOS print preview, use two fingers to “zoom in” on the displayed preview.

![Screen shots of webpage then share sheet then print preview](/images/blog/2018/ways-to-create-a-pdf-on-ios/print-1.png)
![Screen shots of generated PDF](/images/blog/2018/ways-to-create-a-pdf-on-ios/print-2.png)

## Create a PDF with Empty Pages Using PSPDFKit

When using PSPDFKit, it’s easy to create a PDF with empty pages, thereby providing a blank canvas on which to add annotations. The page can have a patterned background or even an image background. This can be done in PDF Viewer by tapping the + button in the document browser.

![Screen shot new document screen in PDF Viewer](/images/blog/2018/ways-to-create-a-pdf-on-ios/viewer.png)

Here’s how to make the PDF while programmatically specifying the page size and appearance:

```swift
import PSPDFKit

let outputFileURL: URL = ...

let newPageConfiguration = PSPDFNewPageConfiguration(tiledPattern: PSPDFNewPagePatternLines5mm) { builder in
    builder.pageSize = CGSize(width: 595, height: 842)
    builder.backgroundColor = UIColor(hue: 0.7, saturation: 0.05, brightness: 1, alpha: 1)
}

let processorConfiguration = PSPDFProcessorConfiguration()
processorConfiguration.addNewPage(at: 0, configuration: newPageConfiguration)

do {
    try PSPDFProcessor.generatePDF(from: processorConfiguration, securityOptions: nil, outputFileURL: outputFileURL, progressBlock: nil)
} catch {
    print("Could not create PDF file: \(error)")
}
```

To let the user choose the page size and appearance using the same user interface as PDF Viewer, use [`PSPDFNewPageViewController`][]:

```swift
import PSPDFKitUI

let newPageViewController = PSPDFNewPageViewController(documentEditorConfiguration: PSPDFDocumentEditorConfiguration())
newPageViewController.delegate = self
```

```swift
func newPageController(_ controller: PSPDFNewPageViewController, didFinishSelecting configuration: PSPDFNewPageConfiguration?) {
    guard let newPageConfiguration = configuration else {
        return
    }

    // Use PSPDFProcessor as above, except we already have a
    // newPageConfiguration so don’t need to programmatically create one.
}
```

## Create a PDF from HTML Using PSPDFKit

PSPDFKit can [make a PDF from an HTML string][from-html]:

```swift
let outputFileURL: URL = ...

let htmlString = "This is a <b>test</b> in <span style='color:red'>color.</span>"

PSPDFProcessor.generatePDF(fromHTMLString: htmlString, outputFileURL: outputFileURL, options: nil) { error in
    if let error = error {
        print("Could not create PDF file: \(error)")
    }
}
```

Note that this only handles simple formatting and not complex layout or images. For those, see below. 

## Create a PDF from a Webpage Using PSPDFKit

PSPDFKit can [load a complete webpage and turn it into a PDF][from-url]:

```swift
let inputURL = URL(string: "https://pspdfkit.com/blog/2017/customer-spotlight-liquidtext/")!
let outputFileURL: URL = ...

PSPDFProcessor.generatePDF(from: inputURL, outputFileURL: outputFileURL, options: nil) { url, error in
    if let error = error {
        print("Could not create PDF file: \(error)")
    }
}
```

This is an experimental feature. We recommend doing that on a dedicated server instead, as servers have more resources and a better browser stack, which yields more accurate results.

Here’s the document generated from the webpage in PDF Viewer.

![Screen shot of a PDF generated from a webpage](/images/blog/2018/ways-to-create-a-pdf-on-ios/generated-1.png)

## Create a PDF by Drawing into a Graphics Context

For maximum flexibility, you can write your own UIKit or Core Graphics drawing code to generate PDFs. You need to take care to correctly handle line and page breaks.

This is easiest with the [`UIGraphicsPDFRenderer`][] class introduced in iOS 10. The documentation is very detailed and has easy-to-understand examples.

Here’s a simple example of using `UIGraphicsPDFRenderer`:

```swift
import UIKit

let outputFileURL: URL = ...

let pdfRenderer = UIGraphicsPDFRenderer(bounds: CGRect(x: 0, y: 0, width: 595, height: 842))

do {
    try pdfRenderer.writePDF(to: outputFileURL) { context in
        context.beginPage()

        let attributes: [NSAttributedString.Key: Any] = [
            .font : UIFont.systemFont(ofSize: 36, weight: .semibold)
        ]

        let text = "This PDF was made using\na tutorial from PSPDFKit."

        (text as NSString).draw(at: CGPoint(x: 20, y: 20), withAttributes: attributes)
    }
} catch {
    print("Could not create PDF file: \(error)")
}
```

If you already have a view that draws into a graphics context using Core Graphics or UIKit drawing calls, you can reuse that drawing code.

## Conclusion

In this post, we’ve seen several ways users can create PDFs in existing apps and how you can add PDF creation as a feature in your own app. With PSPDFKit and deeply integrated, system-wide support for the PDF format, iOS is truly a first-class platform for creating and working with PDF documents.

[`PSPDFProcessor`]: https://pspdfkit.com/api/ios/Classes/PSPDFProcessor.html
[`PSPDFNewPageViewController`]: https://pspdfkit.com/api/ios/Classes/PSPDFNewPageViewController.html

[from-html]: https://pspdfkit.com/api/ios/Classes/PSPDFProcessor.html#/c:objc(cs)PSPDFProcessor(cm)generatePDFFromHTMLString:outputFileURL:options:completionBlock:

[from-url]: https://pspdfkit.com/api/ios/Classes/PSPDFProcessor.html#/c:objc(cs)PSPDFProcessor(cm)generatePDFFromURL:outputFileURL:options:completionBlock:

[`UIGraphicsPDFRenderer`]: https://developer.apple.com/documentation/uikit/uigraphicspdfrenderer
