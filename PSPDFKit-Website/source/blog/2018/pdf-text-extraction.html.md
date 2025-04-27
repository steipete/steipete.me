---
title: "Extracting Text from a PDF"
description: "The difficulties of extracting text from a PDF and how PSPDFKit can help."
preview_image: /images/blog/2018/pdf-text-extraction/article-header.png
section: blog
author:
  - Patrik Weiskircher
author_url:
  - https://twitter.com/pweisk
date: 2018-01-02 12:00 UTC
tags: Development, PDF internals
published: true
secret: false
---

Extracting text from a PDF file is a common and often necessary task, but you might have noticed it isn’t always quite as straightforward as it should be. That said, we want to take a short look into how text is represented in a PDF and how PSPDFKit can help with the text extraction process.

## The Issues with Text Extraction

PDF files were not meant for text extraction. Rather, their purpose is to present documents the same way regardless of where or with which app you’re looking at them.

However, even if PDFs weren’t designed to have text extracted, it’s often very useful to be able to do so!

## Text Representation in a PDF

A PDF file does not simply contain text as you’d be used to in a text file. What it does contain are commands on how to render the given text on the screen without whitespace characters or newlines. But let’s dive a little bit deeper into some PDF internals to further our understanding of this.

### Content Streams

Each page in a PDF has one or more content streams that tell the PDF viewer application how to render a page. A very simple one might look like this:

```
193.95 581.633 Td
(Hello) Tj
30.68 0 Td
(World!) Tj
```

These content streams can be represented differently while accomplishing the same goal, like this:

```
193.95 581.633 Td
<00290046004d004d00500001003800500053004d0045> Tj
```

`Td` instructs the PDF viewer where to draw the next string. `Tj` specifies which string to draw.

## Extracting Text from a Content Stream

The only way to extract text from a PDF is by looking at the rendering commands and having a good heuristic try at making sense of it. In the above example, we know that we are supposed to render `Hello`, reposition the text cursor, and then output `World!`.

You might have noticed there is no whitespace in the first example above. Because the content stream only instructs the rendering engine what to draw on the screen, and because a whitespace is blank, we have to infer the spaces and newlines ourselves most of the time.

Doing this reliably across all the different PDF documents out there is difficult, and it’s not uncommon to encounter problems where tweaking the heuristic breaks one document but fixes another.

## Extracting Text in PSPDFKit

PSPDFKit offers APIs to retrieve text from a document. All of our platforms use the same underlying heuristic to determine the layout of the text on the page and how to extract blocks out of it.

### iOS

On iOS, you can use [`PSPDFTextParser`][] to retrieve the text, text blocks, words, or glyphs from a page:

```swift
guard let textParser = documentProvider.textParserForPage(at: 0) else {
    // Handle failure
    abort()
}
print("Text of page 0: \(textParser.text)")

for textBlock in textParser.textBlocks {
    print("TextBlock at \(textBlock.frame): \(textBlock.content)")
}
```

### Android

On Android, there is no dedicated text parser class; instead, you can simply retrieve your page text using [`PdfDocument`][]:

```kotlin
val pageText = document.getPageText(0)
print("Text of page 0: $pageText")

for (textRect in document.getPageTextRects(0, 0, pageText.length)) {
    val blockText = document.getPageText(0, textRect)
    print("TextBlock at $textRect: $blockText")
}
```

### Web

PSPDFKit for Web can extract the text from a page using [`textLinesForPageIndex`][], but there is not yet an API for extracting text blocks:

[==

```es
const textLines = await instance.textLinesForPageIndex(0);
textLines.forEach(textLine => console.log(textLine.contents));
```

```js
instance.textLinesForPageIndex(0).then(function(textLines) {
  textLines.forEach(function(textLine) {
    console.log(textLine.contents);
  });
});
```

==]

## Conclusion

As you can see, extracting text from a PDF file is not as simple as it sounds. However, we are continuously optimizing our algorithms to deliver the best results we can so that you can worry less about things like extracting text and focus more on the tasks you need to accomplish.


[`PDF file`]: https://en.wikipedia.org/wiki/Portable_Document_Format
[`PSPDFTextParser`]: https://pspdfkit.com/api/ios/Classes/PSPDFTextParser.html
[`PdfDocument`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/PdfDocument.html
[`textLinesForPageIndex`]: https://pspdfkit.com/api/web/PSPDFKit.Instance.html#textLinesForPageIndex
