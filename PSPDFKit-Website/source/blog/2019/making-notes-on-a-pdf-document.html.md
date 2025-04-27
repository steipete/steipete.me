---
title: Making Notes on a PDF Document
description: This post highlights the tools and features within a PDF that help with marking and making notes in a document.
preview_image: /images/blog/2019/making-notes-on-a-pdf-document/article-header.png
section: blog
author:
  - Nick Winder
author_url:
  - http://www.nickwinder.com
date: 2019-02-05 8:00 UTC
tags: Productivity
published: true
secret: false
---

The digital format has quickly taken over its paper sibling in many areas of life and work. In some of these areas, we need to be able to create high-quality notes that can both provide a rich user experience and be reproducible across different platforms and applications.

One great example of where the above functionality is relevant today is in lecture halls where the lecture notes are distributed in a digital format. It’d be nice to be able to make notes, draw, and highlight on a document to add more context for when reading back over the material. Another example is if a colleague at work has sent over a legal document that needs reviewing for validity and corrections. In such a case, it would be convenient to take notes directly on the document in order to provide as much context as possible and ensure there is no confusion.

This article will explore the features of PDFs that help in making notes and highlighting specific points in a document — features that attempt to bridge the gap between the two formats, and in some cases, far exceed the benefits of working on paper. This is especially true in cases where it’s necessary to mark corrections, ask questions, and add additional information to a piece of work.

## Shapes and Lines

When making notes on paper, we often draw lines and arrows to make a reference to something. It’s also not uncommon to circle a word or section of a block of text with a polygon. These all have analogous concepts in the PDF specification in the form of drawing annotations. Drawing annotations can be used to create a drawing environment that can mimic the paper world. In fact, we can even do better than on paper, as PDF annotations allow us to accurately draw perfect circles and squares.

![Shape Annotations Example](/images/blog/2019/making-notes-on-a-pdf-document/shapeAnnotations.png)

The PDF specification also allows for a type of free-form line drawing with the use of ink annotations. This means we can scribble to our hearts’ content, or even write freehand text if used in conjunction with a tablet and stylus. This option provides a very natural experience that’s similar to writing on paper, and it comes in handy when making notes on the fly or when short, minimal notes are required.

![Ink Annotations Example](/images/blog/2019/making-notes-on-a-pdf-document/inkAnnotations.png)

## Text Markup

When marking or commenting on a piece of work, we are normally referencing the text that is written on the document. On paper, we often underline a block of text we are referring to, or if we are getting really fancy, we can use highlighters to draw attention to specific areas. Again, the PDF specification has these concepts built in. As such, we can create highlight annotations with different appearances to denote different meanings. We can even underline, strikeout, and squiggly underline the text, and this combined with a flexible appearance allows us to provide even more context to the points being made.

![Text Markup Example](/images/blog/2019/making-notes-on-a-pdf-document/textMarkup.png)

## Short- and Long-Form Notes

One major upside of the digital format is that we can use a digital text format to make notes, which means the notes are legible and searchable. There’s also the added advantage that we are not limited to the space on the paper. We can create hidden notes that hold a ream of text that is displayed with a small simple icon. With these comments, we can make multiple points, have conversations, and hold large amounts of information, all while not creating a huge mess on the page.

### Long-Form Notes

Long-form notes are best served with a text annotation, which can be displayed with a variety of icons or a pop-up related to a `Text Markup`. A user can type a well-formed — and in some cases, long — explanation relating to the point being made. These notes come to the rescue when there is not enough space on the paper or when the alternative is a small cryptic message that nobody understands.

![Icon Note Example](/images/blog/2019/making-notes-on-a-pdf-document/iconNote.png)

<div class="row">
  <div class="col-md-6" style="margin-bottom:1em;">
    <img src="/images/blog/2019/making-notes-on-a-pdf-document/noteTextViewIos.png" alt="iOS note view example" width="100%">
  </div>
  <div class="col-md-6" style="margin-bottom:1em;">
    <img src="/images/blog/2019/making-notes-on-a-pdf-document/noteTextViewAndroid.png" alt="Android note view example" width="100%">
  </div>
</div>

### Short-Form Notes

If a short message is required, there is support for a free text annotation. This means we can write directly on top of the page with digital text, which can be useful when we have a short comment or want to draw attention to a specific area with a little bit of context.

![Free Text Example](/images/blog/2019/making-notes-on-a-pdf-document/freetextAnnotation.png)

## Conclusion

The PDF format is by far the [most popular digital document format][pdf stats], and the features described in this article touch on some of the reasons why. The flexibility of being able to add, remove, and edit the markup at a later date has great advantages. Pair this with the knowledge that these annotations can be displayed across many different platforms in a reliable form, and PDF boosts itself to the front of the queue of digital formats for reviewing a document.

All the features discussed in this article — and many more advanced features — are available on both [iOS][ios pdfviewer] and [Android][android pdfviewer] with [PDF Viewer][pdf viewer], which makes PDF an even better choice for annotating documents on the go. For an in-depth look at how to use PDF Viewer to review documents, please read the blog post [Using PDF Viewer to Review Documents][].

If you are a developer looking to implement these features into your own application, PSPDFKit offers an enterprise-ready PDF solution for many platforms, along with industry-leading first-class support included with every plan. Click [here][pspdfkit] to learn more and start your trial of PSPDFKit.

[pdf stats]: http://duff-johnson.com/2014/02/17/the-8-most-popular-document-formats-on-the-web/
[ios pdfviewer]: https://itunes.apple.com/app/pdf-viewer-read-review-annotate/id1120099014
[android pdfviewer]: https://play.google.com/store/apps/details?id=com.pspdfkit.viewer
[pdf viewer]: https://pdfviewer.io/
[using pdf viewer to review documents]: https://pspdfkit.com/blog/2018/using-pdf-viewer-to-review-documents/
[pspdfkit]: https://pspdfkit.com/
