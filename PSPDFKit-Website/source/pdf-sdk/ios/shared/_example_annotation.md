[==

```swift
import PSPDFKit

let documentURL = // PDF URL from a writable location...
let document = PSPDFDocument(url: documentURL)

// Load a graphic resource from another PDF document.
let logoURL = Bundle.main.url(forResource: "Logo", withExtension: "pdf")!

// Create a custom stamp annotation on the first page.
let stampAnnotation = PSPDFStampAnnotation()
stampAnnotation.appearanceStreamGenerator = PSPDFFileAppearanceStreamGenerator(fileURL: logoURL)
stampAnnotation.boundingBox = CGRect(x: 180.0, y: 150.0, width: 444.0, height: 500.0)
document.add([stampAnnotation])

// This is a blocking save.
document.save()
```

```objc
@import PSPDFKit;

NSURL *documentURL = // PDF URL from a writable location...
PSPDFDocument *document = [[PSPDFDocument alloc] initWithURL:documentURL];

// Load a graphic resource from another PDF document.
NSURL *logoURL = [NSBundle.mainBundle URLForResource:@"Logo" withExtension:@"pdf"];

// Create a custom stamp annotation on the first page.
PSPDFStampAnnotation *stampAnnotation = [[PSPDFStampAnnotation alloc] init];
stampAnnotation.appearanceStreamGenerator = [[PSPDFFileAppearanceStreamGenerator alloc] initWithFileURL:logoURL];
stampAnnotation.boundingBox = CGRectMake(180.f, 150.f, 444.f, 500.f);
[document addAnnotations:@[stampAnnotation] options:nil];

// This is a blocking save.
[document save];
```

==]
