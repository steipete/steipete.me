---
title: "Incremental and Full Save in PDFs"
description: "This article goes into what's involved when incrementally or fully saving a PDF, and why it matters."
preview_image: /images/blog/2019/incremental-and-full-save-in-pdfs/article-header.png
section: blog
author:
  - Patrik Weiskircher
author_url:
  - https://twitter.com/pweisk
date: 2019-02-25 8:00 UTC
tags: Development, PDF
published: true
secret: false
---

There are different ways of saving a PDF, but it isn’t always clear which one to choose or what the pros and cons are. In this post, I will focus on two particular kinds and try to explain the difference in a little more detail so you can make an informed decision on when to use what.

## PDF Internals

Describing the differences between saving methods will be easier with just a tiny bit of prior knowledge of how a PDF is structured. In short, each PDF is basically just a big object tree, with a root node at the top, which goes down from there. Objects can be referenced by an object number:

```
% Each PDF starts with a %PDF-X.Y header to identify itself as a PDF.
%PDF-1.7

[...]

% Lots of objects can be listed in a PDF. The first number (12 here) is
% the object number.
12 0 obj
% `<<>>` denotes a dictionary. `[]` is for an array. `X 0 R` references another
% object.
<< /Type /Page /Contents 4 0 R /Annots [ 5 0 R ] ... >>
endobj

[...]

% After all the objects are listed, a cross-reference table (xref) is listed. This is
% used by the PDF reader to look up where an object in the PDF file is
% located so it can quickly be read without having to go through
% the whole file.
xref
0 26
0000000000 65535 f
0000006459 00000 n

[...]

% At the end, we can find a trailer, which defines both where the root object is
% and where the beginning of the cross-reference table is. This
% enables the PDF reader to quickly read any object.
trailer
<< /Root 2 0 R ... >>
startxref
6100
%%EOF
```

While the above is quite a lot of information, having this overview will help you in understanding the differences in saving methods.

## Incremental Saving

Incremental saving is a pretty neat feature of the PDF format. With this, we only have to write objects that actually changed into the PDF file, which makes saving quick. The disadvantage is that the file keeps growing indefinitely and basically contains a history of changes.

Imagine the PDF from [above](#pdf-internals). If we add an annotation, all we have to do is append the changed objects:

```
% The original PDF file starts here.
[...]
6100
%%EOF

% We can simply add (and overwrite) previous objects.
% For example, we add a reference to a new annotation (17 0 R) to the
% object 12.
12 0 obj
<< /Type /Page /Contents 4 0 R /Annots [ 5 0 R 17 0 R ]>>
endobj

% Now we add the annotation object itself.
17 0 obj
<< /Type /Annot ... >>
endobj

% We add a new cross-reference table showing where the new objects
% are located.
xref
2 1
0000007385 00000 n

[...]

% We add another trailer.
trailer
% /Prev points to the previous cross-reference table.
<< /Root 2 0 R /Prev 6100 ... >>
startxref
6400
%%EOF
```

After appending this tiny bit of information, we successfully added a new annotation without having to rewrite the entire document. This approach is especially handy when you’re working with a big file that has several hundred megabytes of content. Another advantage is that incremental saving doesn’t invalidate [digital signatures][]; the new content isn’t signed, but the previous content stays signed.

It is pretty easy to turn back time in a PDF document that’s saved incrementally: Simply remove the new part. But this can be problematic in cases where you don’t want anyone to be able to see how the document looked before. This is where the second method of saving a document that I’ll discuss comes in: a full save.

As a quick aside, our [Redaction][] feature makes sure that no history is left in the PDF when something is deleted.

## Full Save

A full save rewrites the entire PDF document. It takes all the objects still in use and writes them into the file. As an example, if you delete a stamp annotation with a big image inside, the image will no longer be in the PDF file and the file size will go down. A whole new cross-reference table will be written.

This is a great option if a PDF file changes dramatically all the time, particularly if you use a lot of stamp annotations.

## Conclusion

Incremental saving is great most of the time, but sometimes it can be useful to do a full save of a document. If you deal with lots of images or if you want to make sure nobody can see the steps it took to get to the current PDF, use full saving. PSPDFKit supports both methods. To see how to switch between them, take a look at our platform-specific guides on the topic: [iOS][save-ios], [Android][save-android], and [Windows][save-windows].

[save-ios]: https://pspdfkit.com/guides/ios/current/faq/growing-pdf-file-size/#rewrite-document-when-saving
[save-android]: https://pspdfkit.com/guides/android/current/faq/growing-pdf-file-size/#rewrite-document-when-saving
[save-windows]: https://pspdfkit.com/guides/windows/current/features/opening-and-saving-pdfs/#incremental-saving
[redaction]: https://pspdfkit.com/pdf-sdk/ios/redaction/
[digital signatures]: https://pspdfkit.com/blog/2018/digital-signatures/
