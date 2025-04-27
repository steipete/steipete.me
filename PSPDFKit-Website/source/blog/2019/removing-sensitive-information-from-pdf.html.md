---
title: "Removing Sensitive Information from a PDF"
description: "This article explains different forms of redaction and discusses different methods used to redact a PDF document."
preview_image: /images/blog/2019/removing-sensitive-information-from-pdf/article-header.png
section: blog
author:
  - Daniel Martín
author_url:
  - https://twitter.com/dmartincy
date: 2019-08-06 8:00 UTC
tags: PDF, Product, Redaction
published: true
secret: false
---

PDF documents are used all around the world to share all kinds of information. In some cases, though, it’s necessary to remove sensitive information from a PDF before sharing it. This information includes things such as credit card numbers, names, and addresses. However, the best way to do this is not always clear: PDFs cannot be edited like a Word document, and you are often not sure if the information will be completely removed or some people could still recover it. If you have concerns about how to effectively redact sensitive information in a PDF, this article will help you decide which method you should use.

## Redaction: The Process of Eliminating Information from a PDF

The process of removing information from a PDF is called redaction. A PDF can contain lots of different information, so it’s necessary to differentiate between different kinds of redaction:

- Textual redaction — this means removing text from a PDF. The space occupied by the removed text is typically replaced by a black box.
- Image redaction — this means removing graphics from a PDF (logotypes, embedded photographs, drawings, and the like). Again, the space occupied by the images or parts of images that were removed is replaced by black boxes.
- Metadata redaction — this means removing information such as who created the PDF, what software was used, etc.

It’s important to note that simply adding a black rectangle on top of the content you want to redact is not enough. This process works perfectly fine when you are redacting images, but it doesn’t when you’re redacting PDFs, because PDFs often contain several layers of information: For example, the information you redact could be recovered if you were to select text and then copy and paste it, or if you used a tool that extracts text from a PDF file.

All that said, a black rectangle placed on top of sensitive content is not a good way to redact a document. In fact, [there has been][facebookredactions] a lot of [press coverage][nytimesredactions] about cases where PDF documents were not correctly redacted, resulting in people being able to access information that should have been removed.

### Printing, Redacting with a Marker Pen, and Then Scanning: Is It as Easy as It Sounds?

There’s another popular redaction method that involves printing a document, applying the redactions physically, and then scanning it — and it’s similar to how we would redact a physical document on paper. We start by printing the document off. Then we use a pen or marker to black out sensitive information. Finally, we rescan the document. The redaction itself is effective, because the information is not recoverable, but the process and the results can be problematic.

First of all, due to all the steps involved, this way of redacting is not very efficient. For example, legal documents are regularly hundreds or even thousands of pages long, and redacting them by hand would require a lot of time and effort. Additionally, this process is very prone to error: You might mark the wrong word or sentence, in which case you’ll need to print the same page again and repeat the redaction. In general, redacting by hand is a time-consuming process that scales poorly if the document is very big. It can also waste a lot of paper if you don’t actually need a physical copy of the redacted document.

There can be issues with the digital file as well; when you scan a printed document, you are typically creating an image of the document, which means:

- The size of a file that contains an image is typically larger than the size of a file that contains text.
- You probably need a high-quality image to read the text comfortably, so the image size may need to be even larger.
- Once a text becomes an image, you typically lose important qualities of the text, such as the ability for computers to read it out loud. This is an important accessibility feature that you can lose if you scan a PDF. Some disabled people depend on this feature to understand what’s in a PDF.

Even if you use Optical Character Recognition (OCR) software that can extract text from an image, the result is not always as good as if the textual structure had remained in the document — especially with languages other than English.

#### The Mueller Report: An Example of a Redacted Document That Was Scanned

[According to Wikipedia][muellerreport], The Mueller Report, officially “Report on the Investigation into Russian Interference in the 2016 Presidential Election,” is an official report that details Special Counsel Robert Mueller’s investigation of Russian efforts to interfere in the 2016 United States presidential election. According to [some analysis][pdfareport], this report may have been redacted electronically, not manually, but the final document may have been printed and then scanned. As you can read in the [PDFA.org][pdfareport] analysis report, the scanned result has several shortcomings regarding legibility of text, accessibility, searchability, reflowing of text, etc.

While the information you want to redact might not be a matter of national security, it’s likely you still want to avoid mistakes like the above, which is where redacting a PDF document electronically comes in.

### Redacting a Document Electronically

The approach we recommend at PSPDFKit is to always use [electronic redaction][]. Electronic redaction modifies the internal structure of a PDF so that the sensitive information is gone, but the rest of the internal structure remains the same. This means that accessibility software can still access and interact with the text that was not redacted, text flows correctly on different screen sizes, and the final size of the document is not changed.

But you can redact more than text with PSPDFKit. If you ever need to remove photographs or parts of photographs, you can do that as well, and the result will always be a PDF that retains most of its structure — except for the redacted content, which will be removed. This offers many advantages from a technical point of view, but it’s also a scalable process: You can automate the redaction of documents with hundreds of pages very easily.

Redacting the text of a document electronically has another advantage: Text can be selected by regular expressions. This means that, instead of saying “redact the number 123-456-789 in this document,” you can say “redact every piece of text that looks like a telephone number.” There is a simple example of how to do this in the [PSPDFKit iOS Catalog][] (`SearchAndRedactTextExample.swift`).

## Conclusion

This post has summarized the ways you can remove sensitive information from a PDF document. The most intuitive one — which is printing, marking by hand, and then scanning again — has many disadvantages compared to a fully digital process. PSPDFKit supports the [electronic redaction of text and images][redaction], and it supports workflows where the number of pages or documents is big, or the exact text you want to remove is not known beforehand. If your business requires the ability to remove sensitive information from a PDF, consider using a specialized tool like PSPDFKit.

[muellerreport]: https://en.wikipedia.org/wiki/Mueller_Report
[facebookredactions]: https://arstechnica.com/tech-policy/2018/11/facebook-pondered-for-a-time-selling-access-to-user-data/
[nytimesredactions]: https://www.techdirt.com/articles/20140128/08542126021/new-york-times-suffers-redaction-failure-exposes-name-nsa-agent-targeted-network-uploaded-pdf.shtml
[pdfareport]: https://www.pdfa.org/a-technical-and-cultural-assessment-of-the-mueller-report-pdf/
[electronic redaction]: https://pspdfkit.com/guides/ios/current/features/redaction/
[redaction]: https://pspdfkit.com/pdf-sdk/redaction/
[pspdfkit ios catalog]: https://pspdfkit.com/guides/ios/current/getting-started/example-projects/
