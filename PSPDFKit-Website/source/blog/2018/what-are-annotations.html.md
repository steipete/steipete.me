---
title: "What Are Annotations?"
description: "Annotations allow users to add custom content on PDF pages."
preview_image: /images/blog/2018/what-are-annotations/article-header.png
section: blog
author:
  - Tomáš Šurín
author_url:
  - https://twitter.com/tomassurin
date: 2018-01-08 10:00 UTC
tags: Development, PDF, Annotations
published: true
---

This post will discuss what PDF annotations are, exploring which types of annotations are defined by the PDF specification. It will also look into how annotations are represented inside a PDF document. Finally, it will outline how PSPDFKit maps this representation to an easy-to-use annotation model.

READMORE

## What Are PDF Annotations?

Content displayed as a PDF page is not suitable for easy editing, but the PDF specification defines a comprehensive set of objects that can be added to PDF pages without changing the page content. These objects are called annotations, and their purpose ranges from marking up page content to implementing interactive features such as forms.

PDF viewers usually allow the creation and editing of various annotation types, e.g. text highlights, notes, lines, or shapes. Regardless of the annotation types that can be created, PDF viewers conforming to the PDF specification should also support rendering for all annotation types.

## Annotation Types

The PDF specification defines two categories for annotations:

* Markup annotations that are primarily used to mark up the content of a PDF document.
* Non-markup annotations that are used for other purposes. These include interactive forms or multimedia.

### Text Markup

The simplest types of markup annotations are text markup annotations for marking up page text. These include text highlight, underline, or strike out annotations.

![Text Markup Annotations](/images/blog/2018/what-are-annotations/highlight-annotations.png)

### Drawing Annotations

Different annotations can be used for drawing on top of a PDF page. These include:

* Square and circle annotations for drawing squares/rectangles and circles/ellipses.
* Line annotations for drawing lines.
* Polygon and polyline annotations for drawing polygonal lines.
* Ink annotations for completely freeform drawing connecting a list of points into Bézier curves.

All of these support the usual drawing properties such as color, line thickness, fill color (for filled shapes), or line styles (e.g. dotted, dashed).

![Drawing Annotations](/images/blog/2018/what-are-annotations/drawing-annotations.png)

### Stamp Annotations

Stamp annotations can be used when simple shapes drawn with drawing annotations are not sufficient — for example, when you want to draw a complex raster or vector image.

![Stamp Annotations](/images/blog/2018/what-are-annotations/stamp-annotations.png)

### Text Annotations

Two annotation types can be used to add notes to the page:

* Text annotations for adding sticky notes.
* Free-text annotations for adding a floating text box.

![Text Annotations](/images/blog/2018/what-are-annotations/text-annotations.png)

### Multimedia Annotations

Annotations can also be used to add multimedia content to the page. This includes sound annotations, movie annotations, and even 3D content.

### Widget Annotations

Widget annotations are used to implement interactive forms. These include buttons, checkboxes, combo boxes, and more.

## The PDF Annotation Model

A PDF document is a collection of data objects organized into a tree structure. The document tree is formed from dictionaries of key-value pairs that can contain other dictionaries as values. An example of another PDF object is a content stream that contains lists of drawing operations or binary image data.

The top-level dictionary in a PDF document contains a list of pages in the document. Each page is represented by its own dictionary that contains separate entries for page content and for annotations associated with the page. Similarly, annotations are also represented by their own dictionaries. Each annotation dictionary contains at least two keys:

* `Rect` specifies the rectangle (in page coordinates) where the annotation is going to be positioned on the page.
* `Subtype` specifies one of the supported annotation types.

The annotation type specifies which additional keys can be present in the annotation dictionary and which keys are required.

Below is an example of a page dictionary:

```
46 0 obj
<<
    /Type       /Page                       % Specifies that this dictionary defines a page.
    /Annots     [207 0 R, 208 0 R, 209 0 R] % Contains a list of references to annotation objects on this page.
    /Contents   501 0 R                     % Reference to page content stream.
    /MediaBox   [0, 0, 595, 842]            % Page dimensions.
    % Other page properties
>>
```

Here is an example of a single annotation dictionary:

```
207 0 obj <<
    /Type       /Annot                               % Specifies that this dictionary defines an annotation.
    /Subtype    /Highlight                           % Specifies annotation type.
    /Rect       [52.9556, 728.343, 191.196, 743.218] % Annotation bounding box in page coordinates.
    /C          [1.0, 1.0, 0.0]                      % Annotation color.
>>
```
You can find all the details about how annotations are stored inside PDF documents in section 8.4 of [Adobe’s PDF specification](http://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/pdf_reference_1-7.pdf).

### Appearance Streams

Annotations may contain properties that describe their appearance — such as annotation color or shape. However, these do not guarantee that the annotation will be displayed the same in different PDF viewers. To solve this problem, each annotation can define an appearance stream that should be used for rendering the annotation. An appearance stream is a set of drawing commands that tells a PDF viewer precisely how to render an annotation (independent of the visual properties defined in the annotation’s dictionary). [The PSPDFKit SDK allows you to parse and create appearance streams.](/guides/ios/current/annotations/appearance-streams/)

## PSPDFKit Annotation Model

The PDF annotation model [is quite complex](/guides/ios/current/annotations/introduction-to-annotations/). The PSPDFKit SDK provides [a facade that exposes annotation dictionaries as regular objects](/guides/ios/current/annotations/the-annotation-object-model/) of your programming language of choice. It hides implementation details and complex interactions between various annotation properties. This makes it very easy for our customers to work with annotations without any prior knowledge of the PDF file format.
