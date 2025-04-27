---
title: "Converting an Attributed String to a PDF"
description: "How to convert a string with formatting to a PDF."
preview_image: /images/blog/2019/converting-attributed-string-to-pdf/article-header.png
section: blog
author:
  - Stefan Kieleithner
author_url:
  - https://twitter.com/steviki
date: 2019-01-08 8:00 UTC
tags: iOS, Development
published: true
secret: false
---

Attributed strings are a powerful way to stylize textual content, as they contain the string alongside the visual representation of said text. As such, they are great candidates for converting into graphical outputs, like an image or a PDF.READMORE

In this article, I’ll cover how an attributed string can be converted to a PDF on iOS. There are multiple ways a PDF can be generated from [`NSAttributedString`][] via system APIs, with various ways to handle the conversion. I’ll provide an overview of two of these methods, but ultimately, you should choose the option that best fits your needs.

Let’s assume we create an [`NSAttributedString`][] to work with and that we want to convert it to a PDF, like what’s shown [in this Gist][attributed string gist].

## Using a Graphics Context

One solution for converting an attributed string to a PDF would be to use a PDF graphics context via [`UIGraphicsPDFRenderer`][]. This method is mostly suitable for short strings that should only be converted into a single-page PDF. However, this solution is advanced, since it is possible to literally draw anything on the PDF in the graphics context and it also requires more specific handling. It isn’t straightforward to create multiple pages from a long string, so you will need to manually handle splitting up the string into multiple parts for each page.

This is how an attributed string can be converted into a single-page PDF that has the size of a DIN A4 page:

[==

```swift
let documentURL = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent("Converted.pdf")
let dinA4PaperRect = CGRect(origin: .zero, size: CGSize(width: 595, height: 842))
let graphicsRenderer = UIGraphicsPDFRenderer(bounds: dinA4PaperRect)
try? graphicsRenderer.writePDF(to: documentURL) { context in
    context.beginPage()
    let pageMargin: CGFloat = 60
    let drawRect = dinA4PaperRect.inset(by: UIEdgeInsets(top: pageMargin, left: pageMargin, bottom: pageMargin, right: pageMargin))
    attributedString.draw(in: drawRect)
}

// Use the generated PDF stored at `documentURL`.
```

```objc
NSURL *documentURL = [NSURL fileURLWithPath:[NSTemporaryDirectory() stringByAppendingPathComponent:@"Converted.pdf"]];
CGRect dinA4PaperRect = (CGRect){.size = CGSizeMake(595.f, 842.f)};
UIGraphicsPDFRenderer *graphicsRenderer = [[UIGraphicsPDFRenderer alloc] initWithBounds:dinA4PaperRect];
[graphicsRenderer writePDFToURL:documentURL withActions:^(UIGraphicsPDFRendererContext *context) {
    [context beginPage];
    CGFloat pageMargin = 60.f;
    CGRect drawRect = UIEdgeInsetsInsetRect(dinA4PaperRect, UIEdgeInsetsMake(pageMargin, pageMargin, pageMargin, pageMargin));
    [attributedString drawInRect:drawRect];
} error:nil];

// Use the generated PDF stored at `documentURL`.
```

==]

This results in a single-page PDF being created, as shown below.

![Graphics Context created PDF document](/images/blog/2019/converting-attributed-string-to-pdf/graphics-context-created-document.png)

Any text that flows off the first page is, by default, cut off and not rendered. In such cases, it is necessary to manually handle content fitting on the page and take care of adding new pages as needed.

## Using a Print Formatter

The easiest way to handle conversion is using a print formatter. If you want something flexible and customizable that also provides high-quality output and support for automatic page wrapping of strings, this is the way to go. [`UIPrintPageRenderer`][] can be used to create a PDF from a print formatter like [`UISimpleTextPrintFormatter`][].

[`UISimpleTextPrintFormatter`][] takes an attributed string and handles drawing it into one page or wrapping it into multiple pages automatically. You also have the ability to customize various properties — like content insets — on the print formatter.

To utilize this, we can create a subclass of [`UIPrintPageRenderer`][] that provides `paperRect` and `printableRect` — along with a custom method to generate the PDF — from the print formatter to a URL on disk:

[==

```swift
class PDFDINA4PrintRenderer: UIPrintPageRenderer {

    let pageSize = CGSize(width: 595, height: 842)

    override var paperRect: CGRect {
        return CGRect(origin: .zero, size: pageSize)
    }

    override var printableRect: CGRect {
        let pageMargin: CGFloat = 60
        let margins = UIEdgeInsets(top: pageMargin, left: pageMargin, bottom: pageMargin, right: pageMargin)
        return paperRect.inset(by: margins)
    }

    func renderPDF(to url: URL) throws {
        prepare(forDrawingPages: NSMakeRange(0, numberOfPages))

        let graphicsRenderer = UIGraphicsPDFRenderer(bounds: paperRect)
        try graphicsRenderer.writePDF(to: url) { context in
            for pageIndex in 0..<numberOfPages {
                context.beginPage()
                drawPage(at: pageIndex, in: context.pdfContextBounds)
            }
        }
    }
}
```

```objc
@interface PSPDFDINA4PrintRenderer: UIPrintPageRenderer
- (BOOL)renderPDFToURL:(NSURL *)url error:(NSError *__autoreleasing *)error;
@end

@implementation PSPDFDINA4PrintRenderer

- (CGSize)pageSize {
    return CGSizeMake(595.f, 842.f);
}

- (CGRect)paperRect {
    return (CGRect){.size = self.pageSize};
}

- (CGRect)printableRect {
    CGFloat pageMargin = 60.f;
    UIEdgeInsets margins = UIEdgeInsetsMake(pageMargin, pageMargin, pageMargin, pageMargin);
    return UIEdgeInsetsInsetRect(self.paperRect, margins);
}

- (BOOL)renderPDFToURL:(NSURL *)url error:(NSError *__autoreleasing *)error {
    [self prepareForDrawingPages:NSMakeRange(0, self.numberOfPages)];

    UIGraphicsPDFRenderer *graphicsRenderer = [[UIGraphicsPDFRenderer alloc] initWithBounds:self.paperRect];
    return [graphicsRenderer writePDFToURL:url withActions:^(UIGraphicsPDFRendererContext *context) {
        for (NSInteger pageIndex = 0; pageIndex < self.numberOfPages; pageIndex++) {
            [context beginPage];
            [self drawPageAtIndex:pageIndex inRect:context.pdfContextBounds];
        }
    } error:error];
}

@end
```

==]

Now we can use our custom print renderer and provide it with a print formatter. The print formatter handles splitting up the string into multiple pages in case it doesn’t fit on one page:

[==

```swift
let pdfRenderer = PDFDINA4PrintRenderer()
let printFormatter = UISimpleTextPrintFormatter(attributedText: attributedString)
pdfRenderer.addPrintFormatter(printFormatter, startingAtPageAt: 0)

let documentURL = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent("Converted from Attributed String.pdf")

try pdfRenderer.renderPDF(to: documentURL)

// Use the generated PDF stored at `documentURL`.
```

```objc
PSPDFDINA4PrintRenderer *pdfRenderer = [PSPDFDINA4PrintRenderer new];
UISimpleTextPrintFormatter *printFormatter = [[UISimpleTextPrintFormatter alloc] initWithAttributedText:attributedString];
[pdfRenderer addPrintFormatter:printFormatter startingAtPageAtIndex:0];

NSURL *documentURL = [NSURL fileURLWithPath:[NSTemporaryDirectory() stringByAppendingPathComponent:@"Converted from Attributed String.pdf"]];
NSError *error;
if ([pdfRenderer renderPDFToURL:documentURL error:&error]) {
    // Use the generated PDF stored at `documentURL`.
}
```

==]

Converting a long, attributed string with a few different attributes will generate a PDF with multiple pages that looks like the one below.

![Print Renderer Created PDF Document](/images/blog/2019/converting-attributed-string-to-pdf/print-renderer-created-document.png)

You can even add multiple print formatters to a single print renderer to append differently formatted strings. For example, you can render an attributed string on the first few pages and append pages containing a converted HTML string afterward.

## Work with the Generated PDF

Now that we’ve explored different ways of how an attributed string can be converted into a PDF, you might want to continue working with the document. Depending on your use case, you might want to display, modify, or mark up the PDF. All of this can be done with PSPDFKit. Head over to our [guides][ios guides] to get an overview of how PDFs can be utilized in your app.

[`nsattributedstring`]: https://developer.apple.com/documentation/foundation/nsattributedstring
[`uisimpletextprintformatter`]: https://developer.apple.com/documentation/uikit/uisimpletextprintformatter
[`uiprintformatter`]: https://developer.apple.com/documentation/uikit/uiprintformatter
[`uigraphicspdfrenderer`]: https://developer.apple.com/documentation/uikit/uigraphicspdfrenderer
[`uiprintpagerenderer`]: https://developer.apple.com/documentation/uikit/uiprintpagerenderer
[ios guides]: https://pspdfkit.com/guides/ios/current/
[attributed string gist]: https://gist.github.com/steviki/b578fbe5151c49bfe2e56ff232156c43
