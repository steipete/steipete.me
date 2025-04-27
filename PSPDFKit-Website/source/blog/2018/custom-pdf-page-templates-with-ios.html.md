---
title: "Custom PDF Page Templates with PSPDFKit for iOS"
description: "We show how a developer can use our PSPDFPageTemplate class to create custom PDF templates with iOS"
preview_image: /images/blog/2018/custom-pdf-page-templates-with-ios/article-header.png
section: blog
author:
  - Oscar Swanros
author_url:
  - https://twitter.com/Swanros
date: 2018-09-24 10:00 UTC
tags: iOS, Development, Editor
published: true
secret: false
---

With [PSPDFKit 7.6 for iOS][], we added the ability to customize the page template options available to create new documents or add new pages to existing documents.

In this article, we’ll discuss how you can take advantage of the new [`PSPDFPageTemplate`][PSPDFPageTemplate] class to customize your document editing experience with PSPDFKit.

## Removing PSPDFKit-Provided Templates

PSPDFKit ships with a predefined list of page templates, which are ready to use:

- Blank
- Line 5mm
- Dot 5mm
- Line 7mm

When you don’t want some of these default templates to be available as options for creating or editing PDF documents, you can use [`PSPDFDocumentEditorConfiguration pageTemplates`][PSPDFDocumentEditorConfiguration]:

[==
```swift
let documentEditorConfiguration = PSPDFDocumentEditorConfiguration { builder in
    builder.pageTemplates = []
}
let configuration = PSPDFConfiguration { builder in
    builder.documentEditorConfiguration = documentEditorConfiguration
}
let controller = PSPDFViewController(document: document, configuration: configuration)
```

```objc
PSPDFDocumentEditorConfiguration *documentEditorConfiguration = [PSPDFDocumentEditorConfiguration configurationWithBuilder:^(PSPDFDocumentEditorConfigurationBuilder *builder) {
    builder.pageTemplates = @[]
}];
PSPDFConfiguration *configuration = [PSPDFConfiguration configurationWithBuilder:^(PSPDFConfigurationBuilder *builder) {
    builder.documentEditorConfiguration = documentEditorConfiguration
}];
PSPDFViewController *controller = [[PSPDFViewController alloc] initWithDocument:document configuration:configuration];
```
==]

## The `PSPDFPageTemplate` Class

As of PSPDFKit 7.6 for iOS, you can use the `PSPDFPageTemplate` class to build page templates from your own PDF documents.

`PSPDFPageTemplate` has two initializers you can use depending on what you’re trying to achieve:

- [`PSPDFPageTemplate initWithDocument:sourcePageIndex`][PSPDFPageTemplate] will instantiate a template that takes the source document’s entire page at the provided index.
- [`PSPDFPageTemplate initWithTiledPatternFromDocument:sourcePageIndex`][PSPDFPageTemplate] will instantiate a template that’s intended to be used as a tiled pattern. If you want to add a page with a repeating pattern to a document, this is the initializer you’ll use.

## Custom Tiled Templates

Many uses for page templates require the background being tiled (or patterned).

A page is considered tiled if there are one or more images repeated on the page.

![Custom Page Template Example](/images/blog/2018/custom-pdf-page-templates-with-ios/template_example_1.png)

Although the artistic properties of tiled pages are clear, aesthetics are not the only reason you may want to create tiled page templates. For instance, if you’re a musician and like to write music on the go, you may want to have a page template of a music sheet — and a music sheet is a super nice use case for tiled templates.

For a PDF to be able to work as a source for a tiled page template using the [new `PSPDFPageTemplate initWithTiledPatternFromDocument:sourcePageIndex:` API][], it has to have actual pattern path information embedded.

To accomplish this, you can use Adobe Illustrator or any other vector editing tool.

When creating your own patterns, please take the following points into consideration:

1. What’s rendered on the page is the path information embedded in the PDF — not the actual PDF.
2. If your custom pattern needs certain spacing between tiles, that information needs to be included within the pattern information as well. Currently, there’s no way to specify spacing between tiles from the PSPDFKit API.

[Click here to download a custom sample template.](/images/blog/2018/custom-pdf-page-templates-with-ios/template_sample.pdf)

After you’ve created the PDF document that will serve as a pattern source, you can use it with PSPDFKit as follows:

```swift
let url = // source document URL
let document = PSPDFDocument(url: url)
let customTemplate = PSPDFPageTemplate(tiledPatternFrom: document, sourcePageIndex: 0)

let editorConfiguration = PSPDFDocumentEditorConfiguration { (builder) in
  builder.pageTemplates.append(contentsOf: [customTemplate])
}

let newPageViewController = PSPDFNewPageViewController(documentEditorConfiguration: editorConfiguration)

present(newPageViewController, options: options, animated: true, sender: sender)
```

## Conclusion

Editing PDFs is one of the core functionalities PSPDFKit provides, and now with PSPDFKit 7.6 for iOS and the new [`PSPDFPageTemplate` API][PSPDFPageTemplate], PSPDFKit is even more powerful and gives you more control over what you can do with it.

You can refer to our [Custom Page Template guide][] to learn more about this topic.

[PSPDFKit 7.6 for iOS]: /blog/2018/pspdfkit-ios-7-6/
[PSPDFDocumentEditorConfiguration]: https://pspdfkit.com/api/ios/Classes/PSPDFDocumentEditorConfiguration.html
[new `PSPDFPageTemplate initWithTiledPatternFromDocument:sourcePageIndex:` API]: https://pspdfkit.com/api/ios/Classes/PSPDFPageTemplate.html
[PSPDFPageTemplate]: https://pspdfkit.com/api/ios/Classes/PSPDFPageTemplate.html
[Custom Page Template guide]: /guides/ios/current/miscellaneous/custom-page-templates/
