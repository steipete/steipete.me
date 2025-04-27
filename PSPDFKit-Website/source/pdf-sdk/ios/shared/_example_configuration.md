[==

```swift
import PSPDFKit
import PSPDFKitUI

let documentURL = Bundle.main.url(forResource: "Document", withExtension: "pdf")!
let document = PSPDFDocument(url: documentURL)

// Use the configuration to set main PSPDFKit options.
let configuration = PSPDFConfiguration { (builder) in
    // Switch to continuous vertical scrolling.
    builder.pageTransition = .scrollContinuous
    builder.scrollDirection = .vertical
    // Disable the thumbnail bar.
    builder.thumbnailBarMode = .none
    // etc.
}

// Create the PDF view controller, passing the configuration object.
let pdfController = PSPDFViewController(document: document, configuration: configuration)

present(UINavigationController(rootViewController: pdfController), animated: true)
```

```objc
@import PSPDFKit;
@import PSPDFKitUI;

NSURL *documentURL = [NSBundle.mainBundle URLForResource:@"Document" withExtension:@"pdf"];
PSPDFDocument *document = [[PSPDFDocument alloc] initWithURL:documentURL];

// Use the configuration to set main PSPDFKit options.
PSPDFConfiguration *configuration = [PSPDFConfiguration configurationWithBuilder:^(PSPDFConfigurationBuilder *builder) {
    // Switch to continuous vertical scrolling.
    builder.pageTransition = PSPDFPageTransitionScrollContinuous;
    builder.scrollDirection = PSPDFScrollDirectionVertical;
    // Disable the thumbnail bar.
    builder.thumbnailBarMode = PSPDFThumbnailBarModeNone;
    // etc.
}];

// Create the PDF view controller, passing the configuration object.
PSPDFViewController *pdfController = [[PSPDFViewController alloc] initWithDocument:document configuration:configuration];

UINavigationController *navController = [[UINavigationController alloc] initWithRootViewController:pdfController];
[self presentViewController:navController animated:YES completion:nil];
```

==]
