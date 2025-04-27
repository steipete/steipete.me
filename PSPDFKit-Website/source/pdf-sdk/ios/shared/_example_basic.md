[==

```swift
import PSPDFKit
import PSPDFKitUI

// Create the PSPDFDocument.
// This is the container for your PDF file. It can also manage multiple files.
let documentURL = Bundle.main.url(forResource: "Document", withExtension: "pdf")!
let document = PSPDFDocument(url: documentURL)

// Create the PDF view controller. This will present and manage the PSPDFKit UI.
let pdfController = PSPDFViewController(document: document)

// Present the PDF view controller within a UINavigationController to enable the toolbar.
present(UINavigationController(rootViewController: pdfController), animated: true)
```

```objc
@import PSPDFKit;
@import PSPDFKitUI;

// Create the PSPDFDocument.
// This is the container for your PDF file. It can also manage multiple files.
NSURL *documentURL = [NSBundle.mainBundle URLForResource:@"Document" withExtension:@"pdf"];
PSPDFDocument *document = [[PSPDFDocument alloc] initWithURL:documentURL];

// Create the PDF view controller. This will present and manage the PSPDFKit UI.
PSPDFViewController *pdfController = [[PSPDFViewController alloc] initWithDocument:document];

// Present the PDF view controller within a UINavigationController to enable the toolbar.
UINavigationController *navController = [[UINavigationController alloc] initWithRootViewController:pdfController];
[self presentViewController:navController animated:YES completion:nil];
```

==]
