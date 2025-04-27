---
title: "Redact Personal Information from a PDF in .NET"
description: "We have a lot of sensitive information in documents, and here's how can we get rid of it for good!"
preview_image: /images/blog/2020/redact-personal-information-from-a-pdf-in-dotnet/article-header.png
section: blog
author:
  - Nick Winder
author_url:
  - http://www.nickwinder.com
date: 2020-02-25 8:00 UTC
tags: PDF, .NET, How-To
published: true
secret: false
---

With the world moving toward a paperless society, more and more personal information is being stored in digital formats. Digital formats are great for enhancing searchability, storage, and simple distribution, but there are also drawbacks to having all this information in one place. For example, what if you have personal information you’d like to remove before sending a document to a client, company, or retailer? Well that’s where redaction comes in. And today we’re going see how we can permanently redact sensitive information from PDFs using .NET.

## What Is Redaction?

Redaction is the process of removing content from a document, obscuring the content from view, and getting rid of any digital references to the data.

When working with PSPDFKit, redaction is accomplished in the following steps:

1. Mark areas for redaction — Add redaction annotations as described in the [PDF specification][pdf-spec]. Visually, the staged redactions will be marked on the document with a box outlined in red.
2. Remove the content — In this step, the page content within the region of the redaction annotations is irreversibly removed.

## How Can We Redact in .NET?

With the release of PSPDFKit Libraries 1.1, we added a new [`RedactionProcessor`][redaction-processor] API in both .NET and Java. This API has the ability to handle a variety of redaction use cases — from removing simple strings, to getting rid of complex data with preset search algorithms.

### Redacting Common Data

In our first use case, we want to remove some personal information, and to do this, PSPDFKit for .NET offers handy presets for identifying common data like phone numbers, credit card numbers, dates, and zip codes. You don’t have to know any technical details about the data formats; you just call the preset:

```csharp
RedactionProcessor.Create()
    .AddRedactionTemplates(new[] {new RedactionPreset {Preset = RedactionPreset.Type.EmailAddress}})
    .Redact(document);
```

The code above will identify all email addresses in the document in question and irreversibly remove them.

### Redacting a Specific String

But what if we want to search for a specific name?

```csharp
RedactionProcessor.Create()
    .AddRedactionTemplates(new[] {new RedactionRegEx {Pattern = "John Smith"}})
    .Redact(document);
```

In the example above, the API will search for the pattern `John Smith` and identify all instances of it for removal. It should be noted that this string is a regular expression pattern, so we could make this search much more intelligent by accounting for various permutations of the name `John Smith`:

```
(?:(?:[Jj]ohn) (?:[Ss]mith))|(?:[Jj]ohn)|(?:[Ss]mith)
```

The regular expression would allow for only `John`, only `Smith`, or `John Smith`, and it would also be case insensitive for the first letter of the first and last name.

Every OS uses a different regular expression implementation. However, they are all using an [ICU][icu-regex] implementation, which is based on the implementation of regular expressions in Perl.

### Only Mark Areas for Redaction

A very common use case is to review the marked areas before committing redactions. This could be done programmatically or via human interaction.

Stopping the `RedactionProcessor` API before the redaction stage is simple. All you need to do is call [`IdentifyAndAddRedactionAnnotations`][] rather than [`Redact`][]:

```csharp
RedactionProcessor.Create()
    .AddRedactionTemplates(new[] {new RedactionPreset() {Preset = RedactionPreset.Type.SocialSecurityNumber}})
    .IdentifyAndAddRedactionAnnotations(document);
```

It would now be possible to perform any extra operations on the document before proceeding to save with the redactions either marked for redaction or applied:

```csharp
// Save and only mark annotations for redaction.
document.Save(new DocumentSaveOptions());
```

Or:

```csharp
// Save and redact the marked content.
document.Save(new DocumentSaveOptions
{
    applyRedactionAnnotations = true
});
```

## Redact Multiple Pieces of Data

It’s likely that if you’re redacting one piece of information, you want to redact multiple pieces of information. So bringing together all that we learnt above, we can build a “redaction shape” to remove _all_ pieces of sensitive information:

```csharp
var isInternationalDocument = false; // Drives logic behind redacting international phone numbers.
var redactionShape = new List<RedactionTemplate>
{
    new RedactionPreset {Preset = RedactionPreset.Type.EmailAddress},
    new RedactionPreset {Preset = RedactionPreset.Type.UsZipCode},
    new RedactionPreset {Preset = RedactionPreset.Type.NorthAmericanPhoneNumber},
    new RedactionPreset {Preset = RedactionPreset.Type.SocialSecurityNumber},
    new RedactionRegEx {Pattern = "(?:(?:[Jj]ohn) (?:[Ss]mith))|(?:[Jj]ohn)|(?:[Ss]mith)"}
};

var processor = RedactionProcessor.Create().AddRedactionTemplates(redactionShape);

if (isInternationalDocument)
{
    processor.AddRedactionTemplates(new[]
        {new RedactionPreset {Preset = RedactionPreset.Type.InternationalPhoneNumber}});
}

processor.Redact(document);
```

In the example above, we build up the redaction shape by including searches for multiple pieces of sensitive information, and we even add an extra redaction search based on whether or not we’re looking at an international document. When [`Redact`][] is called, multiple searches will take place and result in the redaction of all types of sensitive information.

![Document with multiple items of data redacted using redaction shape](/images/blog/2020/redact-personal-information-from-a-pdf-in-dotnet/redactedDocument.jpg)

If there are any custom types of information in the document, it’s possible to build your own search term with the [`RedactionRegEx`][] template. This information could include account numbers, addresses, company names, etc.

## Conclusion

In this blog post, we outlined the new [`RedactionProcessor`][redaction-processor] API released in PSPDFKit 1.1 for .NET. We redacted some simple information and then built up a larger template of redactions to search for. With this new API, it’s possible to adapt the code further and redact batches of documents or construct a redaction template from some external data source, like a database. The API is easy yet flexible, in order to suit the needs of many different use cases. Why not try it today?

[pdf-spec]: https://www.iso.org/standard/63534.html
[redaction-processor]: https://pspdfkit.com/guides/dotnet/current/features/redaction/
[`identifyandaddredactionannotations`]: /api/dotnet/PSPDFKit/PSPDFKit.Redaction.RedactionProcessor.html#PSPDFKit_Redaction_RedactionProcessor_IdentifyAndAddRedactionAnnotations_PSPDFKit_Document_
[`redact`]: /api/dotnet/PSPDFKit/PSPDFKit.Redaction.RedactionProcessor.html#PSPDFKit_Redaction_RedactionProcessor_Redact_PSPDFKit_Document_
[`redactionregex`]: /api/dotnet/PSPDFKit/PSPDFKit.Redaction.Description.RedactionRegEx.html
[icu-regex]: http://userguide.icu-project.org/strings/regexp
