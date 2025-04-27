---
title: "PDF Features for Writing and Sharing Scientific Research"
description: "PSPDFKit can help you carry out scientific research with features like annotation replies, digital signatures, and JavaScript."
preview_image: /images/blog/2019/pdf-features-for-writing-and-sharing-scientific-research/article-header.png
section: blog
author:
  - Daniel Martín
author_url:
  - https://twitter.com/dmartincy
date: 2019-09-02 8:00 UTC
tags: PDF, Digital Signatures, Annotation Replies, JavaScript
published: true
secret: false
---

If you are an individual researcher or part of a research institution, you probably need to communicate your discoveries in some kind of digital format. While most scientific journals have traditionally supported the Word document format, PDF is still the most widely used format for sharing scientific research. This is due to some of its most prominent features: its powerful text font and layout system, its support for embedding images and graphics, and the fact that it’s easy to export to PDF from [LaTeX][], a markup language that supports writing math notation very well.

## PDF Features That Will Help You with Your Scientific Manuscript

The PDF format is a mature format that was created in the 1990s and is supported by a [big specification][pdf spec] with lots of features. There are some features in PDF that are not very popular but that simplify writing and sharing research nonetheless. This section will describe how the annotation replies, digital signatures, and JavaScript features of PDF are supported by PSPDFKit.

### Comment on PDFs with Annotation Replies

One of the reasons scientists prefer using the Word document format instead of PDFs when doing research is that the Word format supports comments and tracking document changes. These features allow a group of researchers to collaborate on the same document and review in-progress drafts.

That said, recent versions of the PDF format now support discussions within a document through the use of a feature called annotation replies. Annotation replies is a feature of PDF 1.5 that lets users create threads of comments using regular PDF annotations. The way this feature works is that a new annotation property specifies if an annotation is a reply to another annotation. Also, as each annotation reply has an author and can have a different status, like Completed or Rejected, annotation replies are a good way to emulate a conversation within a scientific paper.

![Screenshot showing an annotation comment on a research paper](/images/blog/2019/pdf-features-for-writing-and-sharing-scientific-research/annotation-reviews-paper.png)

(Source: http://www.scielo.org.mx/pdf/spm/v53n5/a09v53n5.pdf)

PSPDFKit has supported [creating and reviewing annotation replies][] since version 7.5 on iOS and version 4.5 on Android. Here’s a sample code snippet showing how to add a comment reply with PSPDFKit for iOS:

```swift
let document = originalAnnotation.document!

let textReply = PSPDFNoteAnnotation(contents: "text of the comment")

// Replies must be on the same page as their `inReplyToAnnotation`.
textReply.pageIndex = originalAnnotation.absolutePageIndex

// `originalAnnotation` must have already been added to the document.
textReply.inReplyTo = originalAnnotation

document.add([textReply], options: nil)
```

```objc
if (originalAnnotation.document == nil) {
    return
}

PSPDFNoteAnnotation *textReply = [[PSPDFNoteAnnotation alloc] initWithContents:@"text of the comment"];

// Replies must be on the same page as their `inReplyToAnnotation`.
textReply.pageIndex = originalAnnotation.absolutePageIndex;

// `originalAnnotation` must have already been added to the document.
textReply.inReplyToAnnotation = originalAnnotation;

[originalAnnotation.document addAnnotations:@[textReply] options:nil];
```

If you want to learn more about the capabilities of the annotation replies feature in PDF, take a look at [our guides][annotation replies].

### Digitally Sign Your Paper with PSPDFKit

Once you have prepared a scientific paper for peer review, the journal you sent it to could ask you to confirm your authorship by digitally signing a PDF. A digital signature is the mechanism that certifies the integrity and authorship of a PDF, and some governments issue a certificate that you can use to sign documents and prove your identity over the internet. In the case of the Spanish government, for example, this consists of a certificate and private key pair in the Personal Information Exchange format (`.p12`). You can load this file into PSPDFKit and sign the document using your certificate and handwritten signature. There is detailed information about this process in [our guides][digital signatures]. The PSPDFKit Digital Signatures feature supports the RSA cryptographic algorithm, which is the standard required by many scientific publications.

### Add Interactivity to Your PDF with JavaScript

Even if it’s not required by a journal, it may still be a good idea to publish your research work as an additional, separate PDF with some interactivity in it, which can be added with the help of JavaScript. The field of [reproducible research][] encourages researchers to publish their results, often involving computer code, so that the rest of the research community can replicate their work.

Forms and JavaScript in a PDF can help researchers make interactive tables easily. If you take a look at the [supported JavaScript functions in PSPDFKit][javascript api], you can see that it’s easy to make use of the basic functionality of a spreadsheet program in a PDF. That said, one idea to use this feature in scientific research may be the following: Suppose that you want to show the different outcomes of your research depending on three parameters, each of which contains 10 different sample values. You could add three dropdown boxes to the PDF — `Dropdown1`, `Dropdown2`, and `Dropdown3` — each with 10 different sample values. Then, with a JavaScript script, you could add some logic that shows your research results depending on the selected parameters. For example:

```js
var firstSelectedValue = getField("Dropdown1").value;
var secondSelectedValue = getField("Dropdown2").value;
var thirdSelectedValue = getField("Dropdown3").value;
// `calculateResults` would contain some logic to compute sample results for a part of your original research.
var results = calculateResults(
  firstSelectedValue,
  secondSelectedValue,
  thirdSelectedValue
);
getField("Results").value = results;
```

Using JavaScript here is useful because showing the results of all the combinations of parameters and options at once in the PDF is not reasonable.

## Conclusion

PDF is the preferred document format for sharing scientific information around the world. Even if you produce a PDF from another source format like a Word document, it’s important to note that using a specialized PDF tool like PSPDFKit can improve your workflow because of its support for unique PDF features like annotation replies, digital signatures, and
JavaScript interactivity.

[latex]: https://www.latex-project.org
[pdf spec]: https://www.adobe.com/content/dam/acom/en/devnet/pdf/pdfs/PDF32000_2008.pdf
[creating and reviewing annotation replies]: https://pspdfkit.com/blog/2018/annotation-replies-and-reviews/
[annotation replies]: https://pspdfkit.com/guides/ios/current/annotations/replies/
[digital signatures]: https://pspdfkit.com/guides/ios/current/features/digital-signatures/
[javascript api]: https://pspdfkit.com/guides/ios/current/features/javascript/#supported-features
[reproducible research]: https://reproducibleresearch.net
