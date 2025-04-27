---
title: "Optimizing PDF File Size"
description: "When editing PDFs, they often grow in size, but that doesn't have to be the case. Here's how we optionally optimize for size."
preview_image: /images/blog/2020/optimizing-pdf-file-size/article-header.png
section: blog
author:
  - Patrik Weiskircher
author_url:
  - https://twitter.com/pweisk
date: 2020-01-01 8:00 UTC
tags: Development, PDF
published: true
secret: true
---

PDFs have a lot of tricks up their sleeves to make them quick to use and to help make the file size as small as possible. But these same tricks can also make PDFs grow big quickly. So in this article, I’m going to show you what causes this problem and how we counter it.

READMORE

## Incremental Saving

One really nice feature of PDFs is that you can [incrementally save][incremental and full save blog]. This means that instead of rewriting an entire file when you save, only the changes are appended. The benefit of this is that it makes it really quick to save!

However, this also causes the file size to grow and grow and never get smaller. This is especially noticeable if you work with a lot of images. And even if you remove an image, it still is included in the PDF; you only instruct your PDF viewer to not show it again.

## Sharing of Images and Fonts

Another nice feature of PDFs is that objects like fonts and images can be shared across pages — a feature that was specifically made in an effort to save on the size of files. This means you can have an image logo on each page and it is only included in the PDF file once.

While this is great when you add images and fonts, it can quickly become more complicated when you try to optimize the size of a PDF file. The image in the PDF doesn’t specify how often it is referenced in the PDF, which means that to properly clean it up, you have to go through the entire PDF. Which brings us to our main topic: garbage collection.

## Garbage Collection

We want to enable our customers to make their PDF files as small as possible. And as a first step toward accomplishing this, we wanted to remove all [indirect objects][indirect objects blog] from the PDF.

So right before we start saving the document, we go through the entire PDF file and collect a list of all the reachable object numbers. Then, when saving the PDF, but before we write out an indirect object, we compare its objects number with the list we collected, and if the object isn’t included, we simply don’t write it out.

We don’t enable this by default, as the process can be a little slow (depending upon the size of your file), but we have options for [iOS][ios optimize link] and [Android][android optimize link].

### An iOS Example

To demonstrate how you can enable this optimization, here is an example of how to resave with garbage collection on iOS:

[==

```swift
do {
    try document.save(options: [.strategy(.rewriteAndOptimizeFileSize), .forceSaving]);
} catch {
    print("Could not save document: \(error)")
}
```

```objc
NSDictionary* saveOptions = @{PSPDFDocumentSaveOptionForceSaving: @YES,
                              PSPDFDocumentSaveOptionStrategy: @(PSPDFDocumentSaveStrategyRewriteAndOptimizeFileSize)};
[document saveWithOptions:saveOptions error:nil];
```

==]

## Conclusion

In this post, we shared how the PDF format helps keep file size down and how we can help it out by collecting unused objects. Depending on what kind of PDFs you work on, you might care a lot about file size, in which case our optimization for PDFs can really help you out!

[incremental and full save blog]: https://pspdfkit.com/blog/2019/incremental-and-full-save-in-pdfs/
[indirect objects blog]: https://pspdfkit.com/blog/2018/pdf-syntax-101/#indirect-object-reference
[ios optimize link]: https://pspdfkit.com/api/ios/Enums/PSPDFDocumentSaveStrategy.html#/c:@E@PSPDFDocumentSaveStrategy@PSPDFDocumentSaveStrategyRewriteAndOptimizeFileSize
[android optimize link]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/DocumentSaveOptions.html#setRewriteAndOptimizeFileSize(boolean)
