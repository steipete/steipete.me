---
title: "Strategies for Saving and Syncing Annotations Using External Files"
description: "We discuss the different strategies for saving and syncing annotations in external files on iOS."
preview_image: /images/blog/2019/saving-and-syncing-strategy-external-files/article-header.png
section: blog
author:
  - Rad Azzouz
author_url:
  - https://twitter.com/radazzouz
date: 2019-07-15 8:00 UTC
tags: iOS, Development, Swift, Annotations, Instant, JSON, XFDF
published: true
secret: false
---

In addition to saving annotations embedded into a PDF, PSPDFKit for iOS also allows you to use external files to store annotations. This can be useful if your app is syncing annotations to a server.
READMORE

By saving annotations in an external file, you’ll only have to sync the external file to your backend as opposed to having to transfer the entire PDF.

In this article, we’ll explore the various strategies you can use to save and sync annotations using external files formats like JSON or XML.

## Instant JSON

[Instant JSON][instant json guide] is our approach to bringing annotations into a modern format. It allows you to store PDF changes, such as annotations, in a separate JSON file.

What this means is that a PDF document will only need to be transferred once, and all changes will be added to the existing PDF as an overlay. This approach significantly reduces the bandwidth, since you only need to transfer the JSON file and not the entire PDF.

Instant JSON allows you to import and export individual annotations, as well as changes for an entire document, in a single API call.

So let’s take a look at how we can accomplish this.

### Instant Annotation JSON API

The [Instant Annotation JSON API][instant annotation json api] allows you to represent a [`PSPDFAnnotation`][] as a JSON payload. Here’s how you can export an annotation to a JSON file:

```swift
let annotation: PSPDFAnnotation = ...

// The annotation's Instant JSON data can be saved to an external file as `NSData`.
let instantJSONData = try? annotation.generateInstantJSON()

// You can optionally convert the data to JSON.
let jsonString = try! JSONSerialization.jsonObject(with: data, options: [])

// Write to the external file and upload to your server.
```

After syncing is complete, you can import the annotation from JSON on a different device, like so:

```swift
// Load the document.
let document: PSPDFDocument = ...
let loadedInstantJSONData = ... // The Instant JSON data that is loaded from an external file.
let documentProvider = document.documentProviders.first!

// Create an annotation from Instant JSON data.
let annotation = try! PSPDFAnnotation(fromInstantJSON: data, documentProvider: documentProvider)

// Add the newly created annotation to the document.
document.add([annotation])
```

## Instant Document JSON API

The [Instant Document JSON][instant document json api] is a serializable representation of the current changes to a document, which is the diff between the [`PSPDFDocument`][]’s saved and unsaved changes. This can be used to transfer a set of changes across devices without having to send the entire PDF, which could potentially be very large.

Here’s how to generate an Instant JSON payload for documents:

```swift
let document: PSPDFDocument = ...

// The document's Instant JSON data can be saved to an external file as `NSData`.
let data = try? document.generateInstantJSON(from: document.documentProviders.first)

// You can optionally convert the data to JSON.
let jsonString = try! JSONSerialization.jsonObject(with: data, options: [])

// Write to the external file and upload to your server.
```

This generated JSON can be saved to an external file, uploaded to a server, downloaded to a different device, and then applied to the document using [`applyInstantJSON(fromDataProvider dataProvider: _, to documentProvider: _)`][document-json-apply], like this:

```swift
let document = ...

// The document's Instant JSON data from the external file.
let data: Data = ...

// Create a data container provider.
let jsonContainer = PSPDFDataContainerProvider(data:data!)

// Apply the Instant Document JSON.
try! document.applyInstantJSON(fromDataProvider: jsonContainer, to: document.documentProviders.first)
```

For more details, please take a look at our [Instant JSON guide][] and our examples from `InstantJSON.swift` in our [Catalog app][pspdfcatalog].

Internally, we use the Instant JSON format in [PSPDFKit Instant][instant overview guide], our solution for real-time collaboration and synchronization. You can see [Instant in action here][instant demo].

## XFDF

You can also use the XFDF format to save and sync your annotations in an external XML file. XFDF is an XML-like standard from Adobe [XFDF][iso xfdf reference] for encoding annotations and forms. It is compatible with Adobe Acrobat and PSPDFKit.

PSPDFKit for iOS supports both reading and writing XFDF, and it also offers an annotation provider subclass — [`PSPDFXFDFAnnotationProvider`][] — that will load and save annotations from and to an XFDF file automatically.

### Using an XFDF Annotation Provider

The XFDF annotation provider uses [`PSPDFXFDFParser`][] and [`PSPDFXFDFWriter`][] internally and ensures the best performance.

You can use [`PSPDFXFDFAnnotationProvider`][] to set up an XFDF annotation provider for a document, which will ensure that all annotation changes will be saved into the XFDF file. This can be done like so:

```swift
// Load from an example XFDF file.
let externalAnnotationsFile = URL(fileURLWithPath: "path/to/XFDF.xfdf")

// Create `document` and set up the XFDF provider.
let document = PSPDFDocument()
document.annotationSaveMode = .externalFile
document.didCreateDocumentProviderBlock = {(_ documentProvider: PSPDFDocumentProvider) -> Void in
	let XFDFProvider = PSPDFXFDFAnnotationProvider(documentProvider: documentProvider, fileURL: externalAnnotationsFile)
	documentProvider.annotationManager.annotationProviders = [XFDFProvider]
}
```

Please take a look at both our [XFDF guide article][xfdf guide] for more information and the `PSCXFDFAnnotationProviderExample` in the [Catalog app][pspdfcatalog] for a runnable sample project.

> **💡 Tip:** PSPDFKit for iOS also allows you to use an encrypted XFDF file in your XFDF annotation provider. For sample code, please refer to `PSCEncryptedXFDFAnnotationProviderExample` from the [Catalog app][pspdfcatalog].

## Importing from an XFDF File

You can also import annotations from an XFDF file to a document using [`PSPDFXFDFParser`][], like so:

```swift
// Load from an example XFDF file.
let externalAnnotationsFile = URL(fileURLWithPath: "path/to/XFDF.xfdf")

let documentProvider = (document.documentProviders.first)!
let dataProvider = PSPDFFileDataProvider(fileURL: externalAnnotationsFile)

// Create the XFDF parser and parse all annotations.
let parser = PSPDFXFDFParser(dataProvider: dataProvider, documentProvider: documentProvider)
let annotations = try! parser.parse()

// Add the parsed annotations to the document.
document.add(annotations)
```

## Exporting to an XFDF File

You can export annotations from a document to an XFDF file using [`PSPDFXFDFWriter`][], as seen below:

```swift
// Collect all existing annotations from the document.
let annotations = document.allAnnotations(of: .all).values.flatMap { $0 }

// Write the file.
let dataSink = try! PSPDFFileDataSink(fileURL: externalAnnotationsFile)
do {
	try PSPDFXFDFWriter().write(annotations, to: dataSink, documentProvider: document.documentProviders.first!)
} catch {
	print("Failed to write XFDF file: \(error.localizedDescription))")
}
```

## Custom Annotation Provider

If you’re looking to roll your own custom annotation provider to save annotations in a different or custom format, you can implement the [`PSPDFAnnotationProvider`][] protocol to achieve customized annotation saving and loading.

This is an advanced method, and we recommend using [Instant JSON][instant json guide], [PSPDFKit Instant][instant], or [XFDF][xfdf guide] instead. However, if you have a very specific use case, take a look at the [`PSPDFContainerAnnotationProvider`][] subclass and `PSCCustomAnnotationProviderExample` from our [Catalog app][pspdfcatalog]. The [`PSPDFContainerAnnotationProvider`][] class implements several of the harder-to-get-right details of the annotation provider protocol.

## Conclusion

In this article, we provided an overview of how to load and save annotations from and to external files to avoid having to transfer an annotated PDF to all syncing devices. We recommend that you take a look at our runnable Instant JSON, Instant, and XFDF examples from our [Catalog sample app][pspdfcatalog] so that you can decide which approach satisfies your app’s requirements.

[instant annotation json api]: /guides/ios/current/importing-exporting/instant-json/#instant-annotation-json-api
[`pspdfannotation`]: https://pspdfkit.com/api/ios/Classes/PSPDFAnnotation.html
[instant document json api]: /guides/ios/current/importing-exporting/instant-json/#instant-document-json-api
[`pspdfdocument`]: https://pspdfkit.com/api/ios/Classes/PSPDFDocument.html
[document-json-apply]: https://pspdfkit.com/api/ios/Classes/PSPDFDocument.html#/c:objc(cs)PSPDFDocument(im)applyInstantJSONFromDataProvider:toDocumentProvider:lenient:error:
[instant json guide]: /guides/ios/current/importing-exporting/instant-json
[pspdfcatalog]: /guides/ios/current/getting-started/example-projects/#pspdfcatalog
[instant overview guide]: /guides/ios/current/pspdfkit-instant/overview/
[instant demo]: https://pspdfkit.com/instant/demo/
[instant]: https://pspdfkit.com/instant/
[`pspdfxfdfannotationprovider`]: https://pspdfkit.com/api/Classes/PSPDFXFDFAnnotationProvider.html
[`pspdfxfdfparser`]: https://pspdfkit.com/api/ios/Classes/PSPDFXFDFParser.html
[`pspdfxfdfwriter`]: https://pspdfkit.com/api/ios/Classes/PSPDFXFDFWriter.html
[iso xfdf reference]: https://www.iso.org/obp/ui/#iso:std:iso:19444:-1:ed-1:v1:en
[xfdf guide]: https://pspdfkit.com/guides/ios/current/importing-exporting/xfdf-support/
[`pspdfannotationprovider`]: https://pspdfkit.com/api/Protocols/PSPDFAnnotationProvider.html
[`pspdfcontainerannotationprovider`]: https://pspdfkit.com/api/Classes/PSPDFContainerAnnotationProvider.html
