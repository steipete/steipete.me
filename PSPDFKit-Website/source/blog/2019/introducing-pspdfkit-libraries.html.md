---
title: "Introducing PSPDFKit Libraries"
description: "The power and stability of PSPDFKit in .NET and Java."
preview_image: /images/blog/2019/introducing-pspdfkit-libraries/article-header.png
section: blog
author:
  - Nick Winder
author_url:
  - http://www.nickwinder.com
date: 2019-10-31 8:00 UTC
tags: Libraries, Java, .NET, Development, Products
cta: libraries
published: true
secret: false
---

At PSPDFKit, we’ve always been focused on providing our customers with a professional and advanced UI and user experience — from our mobile [iOS][ios-framework] and [Android][android-framework] frameworks, to our ever-growing [web solutions][web-framework]. In addition, we take great care in providing an amazing developer experience for our customers, and now we’re making another big push in that area.

Today we’re happy to launch PSPDFKit Libraries, a new product based on the same battle-tested code that runs all our existing products, and one that carries over our experience in API design to bring familiarity to users of our other SDKs.

Together with our customers, we’ve identified a few key use cases (which we’ll outline in this post) for the first release and are eager to expand the scope of PSPDFKit Libraries even further. [Reach out to us][sales] and let us know how we can expand PSPDFKit Libraries to cover your use case!

## Compatibility

PSPDFKit Libraries offers native bindings for both Java/Kotlin and .NET.

### Java and Kotlin

To ensure compatibility, we will be supporting all current Java versions (8, 11, 12, 13). Additionally, upon release, the PSPDFKit Java Library will operate on Windows (32/64 bit), macOS (64 bit), and Linux (64 bit). PSPDFKit Libraries also supports [Kotlin][], thanks to the interoperability of the language.

### .NET

To ensure compatibility with a variety of .NET implementations, the PSPDFKit .NET Library is built using [.NET Standard][dotnet-standard] 2.0, which supports:

- [.NET Core][dotnet-core] 2.0
- [.NET Framework][dotnet-framework] 4.6.1
- [Mono][] 5.4

Again, the supported platforms are Windows (32/64 bit), macOS (64 bit), and Linux (64 bit).

## Features

PSPDFKit Libraries is designed to drop straight into your project, and simple API calls are accessible in your native language. You can click on the following features to find out more.

- Annotations ([Java][annotations-java]/[.NET][annotations-dotnet])
- Instant JSON ([Java][instant-json-java]/[.NET][instant-json-dotnet])
- XFDF ([Java][xfdf-support-java]/[.NET][xfdf-support-dotnet])
- Page Rendering ([Java][render-pages-java]/[.NET][render-pages-dotnet])
- [Redaction][redaction]
- Document Editing ([Java][document-editor-java]/[.NET][document-editor-dotnet])

## Use Cases

As part of our initial design, we identified a few key use cases for PSPDFKit Libraries, as requested by our partners. These include batch processing, optimized server-client communication, and document manipulation. Below are some examples to give you an idea of how you can get started with PSPDFKit Libraries.

### Adding a Cover Page

When collating document information, whether for business or individual purposes, you often want to merge documents together and file them as a single document with an informational front page or a company-branded cover.

With PSPDFKit Libraries, document manipulation is simple. The Document Editor API ([Java][document-editor-java]/[.NET][document-editor-dotnet]) makes it possible to merge multiple documents into one, as well as add, move, remove, and rotate single or multiple pages to suit your needs:

[==

```java
// Open a document to append a cover page to and create a Document Editor from it.
File file = new File("Assets/default.pdf");
PdfDocument document = new PdfDocument(new FileDataProvider(file));
DocumentEditor documentEditor = document.createDocumentEditor();

// Prepend the document with the cover page.
File coverPage = new File("Assets/coverPage.pdf");
documentEditor.importDocument(0, DocumentEditor.IndexPosition.BeforeIndex, new FileDataProvider(coverPage));

// Save the document to an output file.
File outputFile = File.createTempFile("documentWithCoverPage", ".pdf");
documentEditor.saveDocument(new FileDataProvider(outputFile));
```

```csharp
// Open a document to append a cover page to and create a Document Editor from it.
var document = new Document(new FileDataProvider("Assets/default.pdf"));
var documentEditor = document.CreateDocumentEditor();

// Prepend the document with the cover page.
documentEditor.ImportDocument(0, DocumentEditor.IndexPosition.BeforeIndex,
    new FileDataProvider("Assets/coverPage.pdf"));

// Save the document to an output file.
const string filename = "documentWithCoverPage.pdf";
File.Create(filename).Close(); // Create the file and close it to ensure it is not used by this process.
documentEditor.SaveDocument(new FileDataProvider(filename));
```

==]

### Thumbnail Rendering

If you’re providing documents on a website or an internal infrastructure, it’s often helpful to show a preview before your user opens a document.

With PSPDFKit Libraries, you can rely upon our high-fidelity rendering engine to show any page (render pages in [Java][render-pages-java]/[.NET][render-pages-dotnet]) of the document at any desired size:

[==

```java
// Open the document you want to render.
File file = new File("Assets/default.pdf");
PdfDocument document = new PdfDocument(new FileDataProvider(file));

for (int i = 0; i < document.getPageCount(); i++) {
    // Render a thumbnail for each page.
    PdfPage page = document.getPage(i);
    BufferedImage bufferedImage = page.renderPage(120, 170);

    // Write the render out to a PNG.
    File outputFile = File.createTempFile("page" + i, ".pdf");
    ImageIO.write(bufferedImage, "png", outputFile);
}
```

```csharp
// Open the document you want to render.
var document = new Document(new FileDataProvider("Assets/default.pdf"));

for (uint i = 0; i < document.GetPageCount(); i++) {
    // Render a thumbnail for each page.
    var page = document.GetPage(i);
    var bitmap = page.RenderPage(120, 170);

    // Write the render out to a PNG.
    bitmap.Save("page" + i + ".pdf", ImageFormat.Png);
}
```

==]

### Applying Annotations

When working with large PDFs, high network loads passing documents back and forth can become problematic. To mitigate this, PSPDFKit Libraries offers Instant Document JSON ([Java][instant-json-java]/[.NET][instant-json-dotnet]) or XFDF ([Java][xfdf-support-java]/[.NET][xfdf-support-dotnet]), thereby allowing for a subset of information to be exchanged.

With Instant Document JSON ([Java][instant-json-java]/[.NET][instant-json-dotnet]), only the changes to the document are exported, which means you don’t have to transmit the entire PDF. The exported data can then be sent to another location to replicate the document with the changes.

An example use case of Instant Document JSON in action is a document review system where the documents may be hundreds of megabytes in size. The client reviewer can make annotations on the document remotely and then send _only_ the Instant Document JSON changes to a server to be applied, thus minimizing large amounts of network traffic:

[==

```java
// Open the document to apply the Instant Document JSON to.
File documentFile = new File("Assets/default.pdf");
PdfDocument document = new PdfDocument(new FileDataProvider(documentFile));

// Open the Instant document JSON and apply to the document.
File instantFile = new File("Assets/instant.json");
document.importDocumentJson(new FileDataProvider(instantFile));
```

```csharp
// Open the document to apply the Instant Document JSON to.
var document = new Document(new FileDataProvider("Assets/default.pdf"));

// Open the Instant document JSON and apply to the document.
document.ImportDocumentJson(new FileDataProvider("Assets/instant.json"));
```

==]

### Applying Redactions to Multiple Documents

When sharing documents with third parties, it’s critical to ensure no sensitive personal, business, or legal information is included. This means you need a reliable way of completely redacting text, images, and annotations from a page, leaving no trace of them in the final PDF.

With PSPDFKit Libraries, it’s possible to iterate over documents — for example, a customer-filled form that includes private information like a social security number — and apply a redaction annotation to the same location on each document before saving and sending them all out to an external source. This even works with scanned documents, where the document is an image included in the PDF!

[==

```java
// Define the redaction annotation to use.
JSONObject redactionAnnotation = new JSONObject();
redactionAnnotation.put("bbox", new float[]{337.77972412109375f, 121.1519775390625f, 166.67999267578125f, 45.39599609375f});
redactionAnnotation.put("creatorName", "User");
redactionAnnotation.put("fillColor", "#000000");
redactionAnnotation.put("opacity", 1);
redactionAnnotation.put("pageIndex", 0);
redactionAnnotation.put("type", "pspdfkit/markup/redaction");
redactionAnnotation.put("v", 1);

// Open each file and apply the same redaction annotation. Upon saving, apply the redactions.
for (File fileToRedact : filesToRedact) {
    PdfDocument document = new PdfDocument(new FileDataProvider(fileToRedact));
    document.getAnnotationProvider().addAnnotationJson(redactionAnnotation);
    document.save(new DocumentSaveOptions.Builder().applyRedactionAnnotations(true).build());
}
```

```csharp
// Define the redaction annotation to use.
var redactionAnnotation = new JObject
{
    {
        "bbox",
        new JArray {337.77972412109375f, 121.1519775390625f, 166.67999267578125f, 45.39599609375f}
    },
    {"creatorName", "User"},
    {"fillColor", "#000000"},
    {"opacity", 1},
    {"pageIndex", 0},
    {"type", "pspdfkit/markup/redaction"},
    {"v", 1}
};

// Open each file and apply the same redaction annotation. Upon saving, apply the redactions.
foreach (var fileToRedact in filesToRedact)
{
    var document = new Document(new FileDataProvider(fileToRedact));
    document.GetAnnotationProvider().AddAnnotationJson(redactionAnnotation);
    document.Save(new DocumentSaveOptions
    {
        applyRedactionAnnotations = true
    });
}
```

==]

It’s also possible to design how the redactions would look on one of our powerful UI frameworks ([iOS][ios-framework]/[Android][android-framework]), export this redaction information, and apply the redactions on a server with PSPDFKit Libraries. To create the redaction information, Instant Document JSON ([Java][instant-json-java]/[.NET][instant-json-dotnet]) is used. It can then be imported into the document on the server, and the redactions can be applied:

[==

```java
// Open the document.
File file = new File("Assets/default.pdf");
PdfDocument document = new PdfDocument(new FileDataProvider(file));

// Open and import the redaction annotations from the Instant Document JSON.
File redactionJsonFile = new File("Assets/redaction.json");
document.importDocumentJson(new FileDataProvider(redactionJsonFile));

// Save the document with the redaction annotations applied.
document.save(new DocumentSaveOptions.Builder().applyRedactionAnnotations(true).build());
```

```csharp
// Open the document.
var document = new Document(new FileDataProvider(tempPath));

// Open and import the redaction annotations from the Instant Document JSON.
document.ImportDocumentJson(new FileDataProvider("Assets/redaction.json"));

// Save the document with the redaction annotations applied.
document.Save(new DocumentSaveOptions
{
    applyRedactionAnnotations = true,
});
```

==]

### Flattening Annotations

If a client signs your document with an ink annotation and you’d like to redistribute this document without the possibility of anyone else editing the signature, you can flatten annotations. By doing this, the ink annotation will be embedded in the PDF page and will no longer be editable.

It’s easy to flatten a document with PSPDFKit Libraries. Just add the flatten flag to the save API ([Java][save-api-java]/[.NET][save-api-dotnet]) and you’re done:

[==

```java
// Open the document.
File file = new File("default.pdf");
PdfDocument document = new PdfDocument(new FileDataProvider(file));

// Save and flatten the annotations in the document.
document.save(new DocumentSaveOptions.Builder().flattenAnnotations(true).build());
```

```csharp
// Open the document.
var document = new Document(new FileDataProvider("default.pdf"));

// Save and flatten the annotations in the document.
document.Save(new DocumentSaveOptions
{
    flattenAnnotations = true
});
```

==]

## Conclusion

We’re excited for this new chapter for PSPDFKit and to expand our reach to a wider audience.

Now, over to you.

- What projects would you like to use PSPDFKit Libraries for?
- What languages would you like to see supported?
- What features do you want to see next?

[Get in touch][sales] and tell us about your use case, and we’ll see how the product can grow to suit your needs.

[ios-framework]: /pdf-sdk/ios/
[web-framework]: /pdf-sdk/web/
[android-framework]: /pdf-sdk/web/
[instant-json-java]: /guides/java/current/importing-exporting/instant-json
[xfdf-support-java]: /guides/java/current/importing-exporting/xfdf-support
[annotations-java]: /guides/java/current/annotations/introduction-to-annotations
[render-pages-java]: /guides/java/current/features/render-pdf-pages
[document-editor-java]: /guides/java/current/features/document-editor
[instant-json-dotnet]: /guides/dotnet/current/importing-exporting/instant-json
[xfdf-support-dotnet]: /guides/dotnet/current/importing-exporting/xfdf-support
[annotations-dotnet]: /guides/dotnet/current/annotations/introduction-to-annotations
[render-pages-dotnet]: /guides/dotnet/current/features/render-pdf-pages
[document-editor-dotnet]: /guides/dotnet/current/features/document-editor
[save-api-java]: /api/java/reference/com/pspdfkit/api/PdfDocument.html#save(com.pspdfkit.api.DocumentSaveOptions)
[save-api-dotnet]: /api/dotnet/PSPDFKit/PSPDFKit.Document.html#PSPDFKit_Document_Save_PSPDFKit_DocumentSaveOptions_
[redaction]: /pdf-sdk/redaction/
[trial]: /try/
[support]: /support/request/
[sales]: /sales/
[dotnet-5]: https://devblogs.microsoft.com/dotnet/introducing-net-5/
[dotnet-core]: https://dotnet.microsoft.com
[dotnet-framework]: https://dotnet.microsoft.com/download/dotnet-framework
[dotnet-standard]: https://docs.microsoft.com/en-us/dotnet/standard/net-standard
[mono]: https://www.mono-project.com/
[kotlin]: https://kotlinlang.org/
