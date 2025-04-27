---
title: The Role of PSPDFKit as a PDF Processor
description: "How we fit into the PDF landscape."
preview_image: /images/blog/2019/the-role-of-the-pdf-processor/article-header.png
section: blog
author:
  - Oscar Swanros
author_url:
  - https://twitter.com/Swanros
date: 2019-08-14 8:00 UTC
tags: PDF, Development
published: true
secret: false
---

When a PDF document arrives in our lives, we usually think of it as a static piece of information that just works. However, there’s actually a lot that goes into “just making it work” — after all, a PDF is a binary file that follows a specification that software vendors such as PSPDFKit and Adobe (makers of Acrobat, and the original inventors of the PDF) agree upon.

At the core of the PDF experience are PDF processors: pieces of software (or hardware) that are tasked with interpreting, rearranging, and deleting content from documents. To that end, you could consider PSPDFKit a PDF processor in its entirety, since our SDKs offer support for reading, annotating, and editing documents.

When you open a PDF in [PDF Viewer][], which is available for free on iOS and Android, PSPDFKit starts processing the document to produce some output that you can see and interact with. This type of processor is referred to as a PDF reader. The moment you add an annotation, rotate a page, or fill in a form in the document, you’ll effectively be using PSPDFKit as an interactive PDF processor.

## PSPDFKit as a PDF Reader

Perhaps unsurprisingly, reading is the most common action that someone does with a PDF, and it is often expected to be the basic functionality offered by tools that deal with PDF documents.

At PSPDFKit, we offer the PDF reader functionality as part of our most basic license, and we call that product Viewer. A [Viewer license][] lets you display PDF documents in your iOS, Android, Windows, and Web applications.

Even though displaying a PDF document’s contents could seem like a trivial task, the fact is that there are a bunch of intricacies associated with getting the correct output at the right time. Since we care greatly about providing our customers with the tools they need to accomplish their goals, we have different levels of abstraction they can use to get to the result they want faster.

For instance, here’s how you can [display a full document in PSPDFKit for iOS][]:

[==

```swift
let fileURL = Bundle.main.url(forResource: "Document", withExtension: "pdf")!
let document = PSPDFDocument(url: fileURL)

let pdfController = PSPDFViewController(document: document)

present(UINavigationController(rootViewController: pdfController), animated: true)
```

```objc
NSURL *documentURL = [NSBundle.mainBundle URLForResource:@"Document" withExtension:@"pdf"];
PSPDFDocument *document = [[PSPDFDocument alloc] initWithURL:documentURL];

PSPDFViewController *pdfController = [[PSPDFViewController alloc] initWithDocument:document];

UINavigationController *navController = [[UINavigationController alloc] initWithRootViewController:pdfController];
[self presentViewController:navController animated:YES completion:NULL];
```

==]

Sometimes only a single page is needed — this is how you [render one with PSPDFKit for Web][]:

```js
async function appendCanvas() {
  const instance = await PSPDFKit.load(myConfiguration);

  const pageWidth = instance.pageInfoForIndex(0).width;
  const pageHeight = instance.pageInfoForIndex(0).height;

  const width = 400;
  const height = Math.round((width * pageHeight) / pageWidth);

  // Renders the first page (page index 0).
  const buffer = await instance.renderPageAsArrayBuffer({ width: width }, 0);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const imageView = new Uint8Array(buffer);
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(imageView);
  ctx.putImageData(imageData, 0, 0);

  document.body.appendChild(canvas);
}
```

But perhaps there’s only a single annotation that you want rendered. In that case, here’s the code needed to [achieve this with PSPDFKit for Android][]:

[==

```kotlin
val bitmap = Bitmap.createBitmap(
    bitmapWidth,
    bitmapHeight,
    Bitmap.Config.ARGB_8888)

annotation.renderToBitmap(bitmap)
```

```java
final Bitmap bitmap = Bitmap.createBitmap(
    bitmapWidth,
    bitmapHeight,
    Bitmap.Config.ARGB_8888);

annotation.renderToBitmap(bitmap);
```

==]

Each software vendor has its own approach to making PDF rendering more reliable for each of the platforms it supports. At PSPDFKit, rendering fidelity and performance are important to us, which is why we have a shared PDF rendering engine across all of our supported platforms. This means that, when using PSPDFKit on multiple platforms for your own product, you can rest assured that the render output will be essentially the same.

This also means that if we ever fix a rendering error or improve our rendering performance, all of our supported platforms get that for free.

## PSPDFKit as an Interactive PDF Processor

The next step after reading the contents of a PDF is to modify the contents of the document, but this is not as cut and dried as just rendering its content. That’s because there are more ways to change the PDF than there are to display it.

A user might want to annotate something on a scientific paper, while another user might want to add, remove, or move pages. Redacting the contents of a document is also possible.

Due to all the possible permutations of modifications that can be applied to a document, a good interactive PDF processor should offer different levels of abstraction to allow the end user to perform exactly the task they want to achieve.

For instance, PSPDFKit for iOS offers high-level abstraction that presents a fully-fledged document editor that allows the user to interactively add, delete, rotate, and move pages ([`PSPDFDocumentEditorViewController`][]) and subsequently save those edits either into the original source document or as a new file altogether.

That’s all fine and dandy for general use, but if a customer has specific workflows that they can improve upon with a more direct approach, [`PSPDFDocumentEditor`][] would be the right tool for the job, as it offers direct access to the operations that a user might want to perform.

For instance, here’s how you could remove the first three pages from a list of documents with PSPDFKit for iOS without presenting any UI to the user:

[==

```swift
let documents = // ...

documents.forEach { document in
	autoreleasepool {
		guard let editor = PSPDFDocumentEditor(document: document) else {
			return
		}

		editor.removePages(IndexSet(0...2))
		editor.save()
	}
}
```

```objc
NSArray<PSPDFDocument *> *documents = // ...
[documents enumerateObjectsUsingBlock:^(PSPDFDocument *document, NSUInteger idx, BOOL *stop) {
	@autoreleasepool {
		PSPDFDocumentEditor *editor = [[PSPDFDocumentEditor alloc] initWithDocument:document];

		[editor removePages:[NSIndexSet indexSetWithIndexesInRange:NSMakeRange(0, 3)]];
		[editor saveWithCompletionBlock:nil];
	}
}];
```

==]

## Conclusion

PDF processors are at the very core of the reliable experience that a PDF document promises, and as we’ve seen, they can be split into two main categories: PDF readers, which are tasked with reliably rendering the contents of a PDF; and interactive PDF processors, which can modify a document’s contents, either via direct manipulation by a user or by providing APIs that allow developers to offer indirect interfaces for performing such operations.

This blog post only showed brief examples that do not cover the full extent of the role of PSPDFKit as both a PDF reader and an interactive PDF processor — outlining it all in a single blog post would be not practical. However, we do have extensive documentation available for all of our supported platforms, and it goes over the specifics of the other features — including [Annotations][], [Forms][], and [Signatures][] — that make PSPDFKit one of the most feature-complete interactive PDF processors available.

[pdf viewer]: https://pdfviewer.io
[viewer license]: https://pspdfkit.com/pdf-sdk/ios/viewer/
[display a full document in pspdfkit for ios]: https://pspdfkit.com/guides/ios/current/getting-started/try-the-demo/#display-a-pdf-document
[render one with pspdfkit for web]: https://pspdfkit.com/guides/web/current/features/rendering-pdf-pages/#rendering-a-page-on-a-canvas
[achieve this with pspdfkit for android]: https://pspdfkit.com/guides/android/current/getting-started/rendering-annotations/#synchronous-rendering
[`pspdfdocumenteditorviewcontroller`]: https://pspdfkit.com/api/ios/Classes/PSPDFDocumentEditorViewController.html
[`pspdfdocumenteditor`]: https://pspdfkit.com/api/ios/Classes/PSPDFDocumentEditor.html
[annotations]: https://pspdfkit.com/guides/ios/current/annotations/introduction-to-annotations/
[forms]: https://pspdfkit.com/guides/ios/current/forms/introduction-to-forms/
[signatures]: https://pspdfkit.com/guides/ios/current/features/digital-signatures/
