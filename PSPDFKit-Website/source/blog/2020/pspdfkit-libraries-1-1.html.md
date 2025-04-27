---
title: "PSPDFKit Libraries 1.1 for Java and .NET"
description: "The power and stability of PSPDFKit in Java and .NET."
preview_image: /images/blog/2020/pspdfkit-libraries-1-1/article-header.png
section: blog
author:
  - Nick Winder
author_url:
  - http://www.nickwinder.com
date: 2020-02-04 14:00 UTC
tags: Libraries, Java, .NET, Development, Products
cta: libraries
published: true
secret: false
---

Today we’re shipping PSPDFKit Libraries 1.1. We decided that redaction is particularly important for our users, so we’ve expanded the functionality for Java and .NET to include an all-new `RedactionProcessor` API. You’ll also find some small additions and slight tweaks to the APIs, designed to make development even easier.

READMORE

## Redaction Processor

In PSPDFKit Libraries 1.0, it was already possible to add redaction annotations and redact the contents of a document. But in 1.1, we decided to make this process a whole lot easier. With the addition of the `RedactionProcessor` API, it’s possible to use regular expressions to redact content in a document or use one of our presets to redact common use cases. This means you will no longer have to manually search for the location of the data you would like to redact!

Here’s a sneak peek at the power of this new API:

[==

```java
// Redact all email addresses from the document.
RedactionProcessor.create()
    .addRedactionTemplates(new RedactionPreset.Builder(RedactionPreset.Type.EMAIL_ADDRESS).build())
    .redact(document);
```

```csharp
// Redact all email addresses from the document.
RedactionProcessor.Create()
    .AddRedactionTemplates(new List<RedactionTemplate>
        {new RedactionPreset {Preset = RedactionPreset.Type.EmailAddress}})
    .Redact(document);
```

==]

Find out more in the redaction guides for [Java][redaction-guide-java] and [.NET][redaction-guide-dotnet].

## API Additions

A common use case is to open a document from a location and save it to another location. Because of this, we added `SaveAs` ([`saveAs` in Java][save-as-java]/[`SaveAs` in .NET][save-as-dotnet]) functionality. Now it doesn’t matter where your document is opened from; you can apply all the changes you’d like and not touch the original location:

[==

```java
document.saveAs(new FileDataProvider(destinationFile), new DocumentSaveOptions.Builder().build());

```

```csharp
document.SaveAs(new FileDataProvider(destinationFilePath), new DocumentSaveOptions());
```

==]

The API works the same way as the original `Save` method, with the addition of a destination to write to. No changes will be made to the original source location throughout the entire process.

### API Change for Opening Documents in Java

Previously, to open a document, you would have had to instantiate a [`PdfDocument`][java-pdfdocument]. But now we’ve made some changes so that you can call a static [`open`][] method in the [`PdfDocument`][java-pdfdocument] class. This will allow for more flexibility in the future and less noise in the API documentation. For migration instructions, please see the [Java 1.1 migration guide][java-1-1-migration-guide].

## Final Notes

This release also includes a number of bug fixes and some minor improvements. For a complete list of changes, see the [Java][java-changelog] and [.NET][dotnet-changelog] changelogs.

[dotnet-changelog]: /changelog/dotnet/#1.1.0
[java-changelog]: /changelog/java/#1.1.0
[java-1-1-migration-guide]: /guides/java/current/migration-guides/pspdfkit-1-1-migration-guide/
[redaction-guide-dotnet]: /guides/dotnet/current/features/redaction/
[redaction-guide-java]: /guides/java/current/features/redaction/
[save-as-dotnet]: /api/dotnet/PSPDFKit/PSPDFKit.Document.html#PSPDFKit_Document_SaveAs_PSPDFKit_Providers_IWritableDataProvider_PSPDFKit_DocumentSaveOptions_
[save-as-java]: /api/java/reference/com/pspdfkit/api/PdfDocument.html#saveAs(com.pspdfkit.api.providers.WritableDataProvider,%20com.pspdfkit.api.DocumentSaveOptions)
[java-pdfdocument]: /api/java/reference/com/pspdfkit/api/PdfDocument.html
[`open`]: /api/java/reference/com/pspdfkit/api/PdfDocument.html#open(com.pspdfkit.api.providers.DataProvider)
