---
title: "How to Add Attribution to PDFs with PSPDFKit for iOS"
description: "Learn how to include attribution when sharing the contents of a PDF."
preview_image: /images/blog/2020/how-to-add-attribution-to-pdfs-with-pspdfkit-for-ios/article-header.png
section: blog
author:
  - Oscar Swanros
author_url:
  - https://twitter.com/Swanros
date: 2020-01-21 8:00 UTC
tags: iOS, Development, PDF
published: true
secret: false
---

In some scenarios, it’s useful to provide users with an easy way to share the contents of a PDF document, such as text copied from the document or a subset of the document pages. There’s also a possibility that, depending on the specific application use case, we’d like the content to be marked with where it came from (e.g. copyright notices, attribution).

There are various ways in which [PSPDFKit for iOS][] can help you add such information, and in this blog post, we’ll look at some of these available solutions.

## Text Extraction

[PSPDFKit for iOS][] can parse the text contents of a document and let the user highlight, redact, copy, or share it. The latter two of these actions are what we’ll use to add attribution to the contents of a PDF.

The selected text, available to us as a simple `NSString` instance, can be updated to add our copyright notice, and we can do so by implementing one particular [`PSPDFDocumentViewControllerDelegate`][] method:

[==

```swift
func pdfViewController(_ pdfController: PSPDFViewController, shouldShow menuItems: [PSPDFMenuItem], atSuggestedTargetRect rect: CGRect, forSelectedText selectedText: String, in textRect: CGRect, on pageView: PSPDFPageView) -> [PSPDFMenuItem] {
    // Modify the selected text to add our copyright information.
    let copyrightedText = selectedText + "\n\(copyrightNotice)"

    // Then check which actions we'd like to update this for.
    for menuItem in menuItems {
        switch menuItem.identifier! {
        // Update the Copy menu item.
        case PSPDFTextMenu.copy.rawValue:
            menuItem.actionBlock = {
                UIPasteboard.general.string = copyrightedText
            }

        // Update the Share menu item.
        case PSPDFTextMenu.share.rawValue:
            menuItem.actionBlock = {
                let activityViewController = UIActivityViewController(activityItems: [copyrightedText], applicationActivities: nil)
                pdfController.present(activityViewController, options: [PSPDFPresentationRectKey: rect], animated: true, sender: nil, completion: nil)
            }

        default: break
        }
    }

    return menuItems
}
```

```objc
- (NSArray<PSPDFMenuItem *> *)pdfViewController:(PSPDFViewController *)pdfController shouldShowMenuItems:(NSArray<PSPDFMenuItem *> *)menuItems atSuggestedTargetRect:(CGRect)rect forSelectedText:(NSString *)selectedText inRect:(CGRect)textRect onPageView:(PSPDFPageView *)pageView {

    NSString *copyrightedText = [NSString stringWithFormat:@"%@", @""];

    [menuItems enumerateObjectsUsingBlock:^(PSPDFMenuItem *menuItem, NSUInteger index, BOOL *stop) {
        if ([menuItem.identifier isEqualToString:PSPDFTextMenuCopy]) {
            menuItem.actionBlock = ^{
                UIPasteboard.generalPasteboard.string = copyrightedText;
            };

            return;
        }

        if ([menuItem.identifier isEqualToString:PSPDFTextMenuShare]) {
            menuItem.actionBlock = ^{
                UIActivityViewController *activityViewController = [[UIActivityViewController alloc] initWithActivityItems:@[copyrightedText] applicationActivities:nil];
                [pdfController presentViewController:activityViewController options:nil animated:YES sender:nil completion:nil];
            };

            return;
        }
    }];

    return menuItems;
}

```

==]

## Document Sharing

We can also hook into the sharing flow to insert our attribution in various ways — such as watermarking or appending content — depending on what we want to achieve. We’ll outline this below.

### Watermarking

A common practice is to add watermarks to the shared pages of a document whose content we want to protect. To achieve this, we can add custom drawing code to the document, and the code will only be applied when the document goes through the sharing flow:

[==

```swift
let drawBlock: PSPDFRenderDrawBlock = { context, page, cropBox, options in
	let text: NSString = "ACME Corp. 2019"
	let drawingContext = NSStringDrawingContext()
	drawingContext.minimumScaleFactor = 0.1

	context.translateBy(x: 0, y: cropBox.size.height / 2)
	context.rotate(by: -CGFloat.pi / 4)

	let attributes = [NSAttributedString.Key.font: UIFont.boldSystemFont(ofSize: 100), .foregroundColor: UIColor.red]

	text.draw(with: cropBox, options: .usesLineFragmentOrigin, attributes: attributes, context: drawingContext)
}

document?.updateRenderOptions(for: .processor) { options in
	options.drawBlock = drawBlock
}
```

```objc
const PSPDFRenderDrawBlock drawBlock = ^(CGContextRef context, NSUInteger page, CGRect cropBox, PSPDFRenderOptions *options) {
	// Careful, this code is executed on background threads. Only use thread-safe drawing methods.
	NSString *text = @"ACME Corp. 2019";
	NSStringDrawingContext *stringDrawingContext = [NSStringDrawingContext new];
	stringDrawingContext.minimumScaleFactor = 0.1;

	CGContextTranslateCTM(context, 0.0, cropBox.size.height / 2.);
	CGContextRotateCTM(context, -(CGFloat)M_PI / 4.);
	[text drawWithRect:cropBox options:NSStringDrawingUsesLineFragmentOrigin attributes:@{ NSFontAttributeName: [UIFont boldSystemFontOfSize:100], NSForegroundColorAttributeName: [UIColor.redColor colorWithAlphaComponent:0.5] } context:stringDrawingContext];
};

[document updateRenderOptionsForType:PSPDFRenderTypeProcessor withBlock:^(PSPDFRenderOptions * options) {
	options.drawBlock = drawBlock;
}];
```

==]

By setting a custom `drawBlock` to the render options for the [`PSPDFRenderTypeProcessor`][] render type, we tell PSPDFKit to only draw on the pages of the document when sharing the document, but not when rendering it on the default [`PSPDFViewController`][] instance.

### Appending Content

Another strategy we can adopt to add attribution when watermarking is not an option is to include additional information alongside the shared files themselves.

Let’s get to the code first:

[==

```swift
class CopyrightedSharingViewController: PSPDFDocumentSharingViewController {
    override func activityViewController(forSharingItems activityItems: [Any], sender: Any) -> UIActivityViewController? {
        // Copy the items that were generated when processing the document for sharing.
        var items = activityItems

        // Create our formatted message to share with the documents.
        let paragraphStyle = NSMutableParagraphStyle()
        paragraphStyle.alignment = .center

        let attributes = [NSAttributedString.Key.font: UIFont.systemFont(ofSize: 13), .foregroundColor: UIColor.red, .paragraphStyle: paragraphStyle]

        let attributedCopyrightNotice = NSAttributedString(string: "Copyright ACME Corp. 2019", attributes: attributes)
        items.append(attributedCopyrightNotice)

        // Call the superclass with the updated list of items and proceed normally.
        return super.activityViewController(forSharingItems: items, sender: sender)
    }
}
```

```objc
@interface CopyrightedSharingViewController : PSPDFDocumentSharingViewController
@end

@implementation CopyrightedSharingViewController

- (UIActivityViewController *)activityViewControllerForSharingItems:(NSArray *)activityItems sender:(id)sender {
    NSMutableArray *items = [NSMutableArray arrayWithArray:activityItems];

    NSMutableParagraphStyle *paragraphStyle = [NSMutableParagraphStyle new];
    paragraphStyle.alignment = NSTextAlignmentCenter;

    NSDictionary<NSAttributedStringKey, id> *attributes = @{NSFontAttributeName: [UIFont systemFontOfSize:13], NSForegroundColorAttributeName: UIColor.redColor, NSParagraphStyleAttributeName: paragraphStyle};

    NSAttributedString *attributedCopyrightNotice = [[NSAttributedString alloc] initWithString:@"Copyright ACME Corp. 2019" attributes:attributes];
    [items addObject:attributedCopyrightNotice];

    return [super activityViewControllerForSharingItems:items sender:sender];
}

@end

```

==]

In the example above, we override the -[`PSPDFDocumentSharingViewController activityViewControllerForSharingItems:sender:`][SubclassingHooks] method on our subclass to insert our attribution as a `UIActivityItem` that’s going to be shared with the document itself.

What’s important to note here is that not every application that we share to will respond the same way. For instance, below you can find screenshots of how sharing the items from the above code will look in `Mail.app` and `Messages.app`.

| `Mail.app`                                                                   | `Messages.app`                                                                   |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| <img src="/images/blog/2020/how-to-add-attribution-to-pdfs-with-pspdfkit-for-ios/mailappscreenshot.png" alt="Screenshot of attachment in mail app"> | <img src="/images/blog/2020/how-to-add-attribution-to-pdfs-with-pspdfkit-for-ios/messagesappscreenshot.png" alt="Screenshot of attachment in messages app"> |

As you can see, `Mail.app` happily accepts the formatted text and includes it in the email body, but `Messages.app` completely ignores it.

## Conclusion

As we saw in this blog post, there are multiple ways in which you can add attribution to the documents your users share with PSPDFKit for iOS. Depending on your use case, some may seem more appropriate than others.

However, this just scratches the surface of the customizability options that [PSPDFKit for iOS][] offers. You can take a deep dive into our documentation to learn more about [customizing document rendering][] and our [`PSPDFRenderOptions`][] class, which also offers many options for correctly marking documents shared with PSPDFKit.

[customizing document rendering]: https://pspdfkit.com/guides/ios/current/knowledge-base/customize-document-rendering/
[`pspdfrenderoptions`]: https://pspdfkit.com/api/ios/Classes/PSPDFRenderOptions.html
[SubclassingHooks]: https://pspdfkit.com/api/ios/Classes/PSPDFDocumentSharingViewController.html#/SubclassingHooks
[`PSPDFDocumentViewControllerDelegate`]: https://pspdfkit.com/api/ios/Protocols/PSPDFDocumentViewControllerDelegate.html
[PSPDFKit for iOS]: https://pspdfkit.com/pdf-sdk/ios/
[`PSPDFRenderTypeProcessor`]: https://pspdfkit.com/api/ios/Enums/PSPDFRenderType.html#/c:@E@PSPDFRenderType@PSPDFRenderTypeProcessor
[`PSPDFViewController`]: https://pspdfkit.com/api/ios/Classes/PSPDFViewController.html
