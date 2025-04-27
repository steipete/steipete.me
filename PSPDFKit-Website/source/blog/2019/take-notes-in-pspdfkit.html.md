---
title: "How to Take Notes Using the PSPDFKit UI"
description: "An introduction to adding notes to your PDFs with PSPDFKit."
preview_image: /images/blog/2019/take-notes-in-pspdfkit/article-header.png
section: blog
author:
  - Christoph Mantler
date: 2019-07-24 8:00 UTC
tags: iOS, How-To
published: true
secret: false
---

In PSPDFKit, there are various ways to annotate and add notes to your PDFs. In this blog post, we’ll look at all of the options to help you determine the best note-taking fit for you.

**ℹ️ Note:** The images shown in this blog post are of the PSPDFKit for iOS UI, but taking notes in other versions of our SDK is similar.

## Note Annotation Tool

The note annotation tool is probably the easiest way to efficiently add notes to your document. A note annotation can be added anywhere on the page, and it takes up very little space, but it can contain a ton of text, which comes in handy for PDFs that are tightly spaced. To add a note annotation, you first need to tap on the annotation button (![annotation icon](/images/blog/2019/take-notes-in-pspdfkit/annotation-icon.png#img-icon)) in the main toolbar, which will then display the annotation toolbar. Then you can tap on the note tool (![note icon](/images/blog/2019/take-notes-in-pspdfkit/note-icon.png#img-icon)) and choose a destination on the page where you want to add your note.

![Adding a note to a PDF](/images/blog/2019/take-notes-in-pspdfkit/note.png)

What’s really nice is that you can even add notes to existing annotations of almost any kind. To do this, you just have to select the annotation and choose Comments in the menu bar that appears above the annotation.

![Adding comments to existing annotations](/images/blog/2019/take-notes-in-pspdfkit/note-comment.png)

## Handwritten Notes

Handwritten notes are probably the most common type of note for when you need to add a few quick words to your page. But often, if your notes contain a lot of text, you have to choose between writing them smaller, which makes them harder to read, or writing them bigger, which ends up taking up a lot of space.

Luckily, there is a way to improve this process. You can go into the document editor of the PDF by tapping the thumbnail button in the top toolbar (![thumbnail icon](/images/blog/2019/take-notes-in-pspdfkit/thumbnail-icon.png#img-icon)). Once you are in the thumbnail view, you can select the document editor (![document editor icon](/images/blog/2019/take-notes-in-pspdfkit/document-editor-icon.png#img-icon)). The document editor allows you to do things like add, rotate, and delete pages in the document. You’ll want to add a page, which can then be used for notes.

To do this, first select the page where you want to add notes. This way, the new page gets added directly after the selected page. Now you need to tap on the button to add a page (![add page icon](/images/blog/2019/take-notes-in-pspdfkit/add-page-icon.png#img-icon)). The dialog that appears will allow you to choose a page background, color, size, etc., all of which you can adjust to your desired outcome. Afterward, you just need to tap Add After Page X, and a new page for your notes will be added to your document, thereby providing you with a lot of space to scribble on!

![Adding a page for ink notes](/images/blog/2019/take-notes-in-pspdfkit/note-ink.png)

If you have a stylus, such as an Apple Pencil on iPad, then you can take advantage of handwritten notes more easily, as it allows you to add them fairly quickly and smoothly with an almost real pen and paper feel.

## Audio Recording

PSPDFKit also provides a tool to add audio recordings to your PDFs. This allows you to add a large amount of information while using minimal space on the page. To make use of this, you need to add an audio annotation to a page, select the annotation, and then press the record button to record your voice.

![Adding audio annotations](/images/blog/2019/take-notes-in-pspdfkit/note-sound.png)

## Free Text

Similar to handwritten notes, free texts are an easily visible way of adding notes to your PDF, as they appear next to the text or image they refer to (as opposed to note and ink annotations, which require extra work to access and read). They come in handy if you have a manual keyboard attached to your device, as you can swiftly write your notes this way. You can also easily adjust the font and font size to adapt this kind of note to your needs.

![Adding free text annotations](/images/blog/2019/take-notes-in-pspdfkit/note-free-text.png)

There’s also a variant of a free-text annotation called a callout annotation, which lets you point the note to the place on the page the note applies to.

![Adding a callout annotation](/images/blog/2019/take-notes-in-pspdfkit/note-callout.png)

## Conclusion

As you can see, the PSPDFKit UI provides a vast variety of different kinds of tools that will help you take notes effectively on your PDF, while keeping the PDF looking visually pleasing. What you end up using often depends on the purpose of the notes in question, but in any case, the choice is yours!

If you want to learn more about using notes in PSPDFKit, you can take a look at our other blog posts related to this topic: [Making Notes on a PDF Document][] and [Using PDF Viewer to Review Documents][].

[making notes on a pdf document]: https://pspdfkit.com/blog/2019/making-notes-on-a-pdf-document/
[using pdf viewer to review documents]: https://pspdfkit.com/blog/2018/using-pdf-viewer-to-review-documents/
