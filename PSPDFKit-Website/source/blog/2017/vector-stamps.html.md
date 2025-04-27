---
title: "Use Vector Stamps Instead of Blurry Shapes"
description: "Tips and tricks for using vector-based stamp annotations."
preview_image: /images/blog/2017/vector-stamps/preview.png
section: blog
author:
  - Rad Azzouz
  - Tomáš Šurín
author_url:
  - https://twitter.com/radazzouz
  - https://twitter.com/tomassurin
date: 2017-11-27 12:00 UTC
tags: iOS, Android, Features, Products
published: true
---

Stamp annotations are the digital equivalent of rubber stamps in the office. Since **stamps can contain both images and text/graphics**, they are essentially a PDF inside your PDF, which is called an appearance stream. PSPDFKit has always included support for [a large set of default stamps](/guides/ios/current/annotations/stamp-annotations-configuration/), in addition to including support for image-based stamps and stamps with customized text.

With [PSPDFKit 4.1 for Android](/blog/2017/pspdfkit-android-4-1/) and [PSPDFKit 7.1 for iOS](/blog/2017/pspdfkit-ios-7-1/), we’re now unlocking the full power of stamp annotations with our brand-new API for [appearance streams](/guides/ios/current/annotations/appearance-streams/). This allows you to define custom stamps — such as shapes, logos, or markers — in vector format.

![Vector Stamps](/images/blog/2017/vector-stamps/preview.png)

READMORE

## A Flexible API

Vector stamps have been a long-requested feature by many of our partners. A vector stamp palette populated with custom shapes allows users to place high-quality markers that are specific to their use cases without increasing the file size the way bitmap stamps would.

Unlike image stamp annotations, vector stamp annotations allow transparency and high-resolution zoom.

|   |   |
| - | - |
| ![Bitmap Stamp](/images/blog/2017/vector-stamps/bitmap-stamp.png) | ![Vector Stamp](/images/blog/2017/vector-stamps/vector-stamp.png)
 |


The API has been designed in a generic way and is not limited to stamp annotations. Custom appearance streams can be added to ink, free text, and other compatible annotation types.

## Create a Vector Stamp Programmatically

You can create a vector stamp annotation by using the appearance stream generator with the URL of a PDF file. You can use any document, and PSPDFKit will automatically use the first page as annotation content. The SDK also provides basic generators that allow you to create such PDFs.

<video src="/images/blog/2017/pspdfkit-android-4-1/vector-stamps.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Here’s how this looks in code:

### Android

[==

```kotlin
// Create a new stamp annotation using the appearance stream generator
val stampAnnotation = StampAnnotation(pageIndex, RectF(300f, 500f, 500f, 300f), "Stamp with custom AP stream")

// Create the appearance stream generator from the URL of a PDF file
val logoUri = Uri.fromFile("path/to/your/logo.pdf")
stampAnnotation.appearanceStreamGenerator = ContentResolverAppearanceStreamGenerator(logoUri)

// Add the newly created annotation to the document
document.getAnnotationProvider().addAnnotationToPage(stampAnnotation)
```
```java
// Create a new stamp annotation using the appearance stream generator
StampAnnotation stampAnnotation = new StampAnnotation(pageIndex, new RectF(300f, 500f, 500f, 300f), "Stamp with custom AP stream");

// Create the appearance stream generator from the URL of a PDF file
Uri logoUri = Uri.fromFile("path/to/your/logo.pdf");
stampAnnotation.setAppearanceStreamGenerator(new ContentResolverAppearanceStreamGenerator(logoUri);

// Add the newly created annotation to the document
document.getAnnotationProvider().addAnnotationToPage(stampAnnotation);
```

==]

### iOS

[==

```swift
// Create PSPDFDocument
let document = PSPDFDocument(url: documentURL)

// Create the URL of the appearance stream that uses a PDF file
let samplesURL = Bundle.main.resourceURL?.appendingPathComponent("Samples")
let logoURL = samplesURL?.appendingPathComponent("PSPDFKit Logo.pdf")

// Create a new stamp annotation using the appearance stream generator
let vectorStampAnnotation = PSPDFStampAnnotation()

// Set the appearance stream
vectorStampAnnotation.appearanceStreamGenerator = PSPDFFileAppearanceStreamGenerator(fileURL: logoURL)

// Set the bounding box
vectorStampAnnotation.boundingBox = CGRect(x: 180, y: 150, width: 444, height: 500)

// Add the newly created annotation to the document
document.add([vectorStampAnnotation])
```

```objc
// Create PSPDFDocument
PSPDFDocument *document = [[PSPDFDocument alloc] initWithURL:documentURL];

// Create the URL of the appearance stream that uses a PDF file
NSURL *samplesURL = [NSBundle.mainBundle.resourceURL URLByAppendingPathComponent:@"Samples"];
NSURL *logoURL = [samplesURL URLByAppendingPathComponent:@"PSPDFKit Logo.pdf"];

// Create a new stamp annotation using the appearance stream generator
PSPDFStampAnnotation *vectorStampAnnotation = [[PSPDFStampAnnotation alloc] init];

// Set the appearance stream
vectorStampAnnotation.appearanceStreamGenerator = [[PSPDFFileAppearanceStreamGenerator alloc] initWithFileURL:logoURL];
vectorStampAnnotation.boundingBox = CGRectMake(180.f, 150.f, 444.f, 500.f);

// Set the bounding box
CGRect boundingBox = { .origin.x = 180.f, .origin.y = 150.f, .size.height = 444.f, .size.width = 500.f };
vectorStampAnnotation.boundingBox = boundingBox;

// Add the newly created annotation to the document
[docment addAnnotations:@[imageStampAnnotation] options:nil];
```

==]

To learn more about how to programmatically create vector stamp annotations, check out our [Appearance Streams guide article][].

## Add Vector Stamps in the Stamp Picker

You can also add vector stamps in the stamp picker alongside the default stamps, or even replace PSPDFKit’s default set of annotations.

To learn more about customizing the stamp picker, including code samples, check out the “Custom Stamp Annotations” example in our PSPDFCatalog project, along with our [Stamp Annotations Configuration guide article][].

Note: Customizing the stamp picker on Android requires [PSPDFKit 4.2 for Android](/changelog/android/#4.2.0) or higher.

[Appearance Streams guide article]: https://pspdfkit.com/guides/android/current/annotations/appearance-streams/
[Stamp Annotations Configuration guide article]: https://pspdfkit.com/guides/ios/current/annotations/stamp-annotations-configuration/
