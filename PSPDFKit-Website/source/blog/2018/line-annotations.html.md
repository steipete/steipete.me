---
title: "Line Annotations in PDF"
description: "Line annotations are one of the most frequently used annotation types, and they are ideal for things like drawing attention to important areas of your document, diagramming the process flow, and decoration."
preview_image: /images/blog/2018/line-annotations/line-annotations-header.png
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2018-05-23 12:00 UTC
tags: Android, iOS, Web, PDF, Annotations, Lines, Arrows, Development
published: true
---

Line annotations are one of the most frequently used annotation types, and they are ideal for things like drawing attention to important areas of your document, diagramming the process flow, and decoration. However, their ease of use belies their versatility and underlying complexity. 

A range of styles can be applied to a line and its ends, and our API makes this simple to express in code. Below are some screenshots from our [PDF Viewer for Android](https://pdfviewer.io/) illustrating many of the style choices you have when creating a line annotation. In this blog post, we’ll demonstrate how you can create a line annotation and modify the default colors, line style, and end styles.

![Line Styles](/images/blog/2018/line-annotations/pdfviewer-line-styles.png)
![Line End Styles](/images/blog/2018/line-annotations/pdfviewer-line-end-styles.png)

## Creating a Line Annotation

A line annotation is made up of a line (surprise!) and two optional “end caps” or “end styles.” Here’s how you might create a line annotation in code and add it to a page:

```java
LineAnnotation lineAnnotation = new LineAnnotation(pageIndex, start, end);
document.getAnnotationProvider().addAnnotationToPage(lineAnnotation);
```

This results in something complicated, like the following being written into the PDF:

```
6 0 obj
<</AP<</N 7 0 R >>/BS<</S/S/Type/Border/W 10>>
/Border[ 0 0 10]/C[ 0.12941179 0.58823524 0.9529412]
/CA 1
/CreationDate(D:20180112125433Z)
/DA(/Helvetica_0 0 Tf )
/DS(font-family:"Helvetica"; )
/F 4/FontName(Helvetica)
/IC[]
/L[ 76.447872 93.961384 223.91424 38.084944]
/LE[/None/None]
/Rect[ 69.376808 31.013878 230.98532 101.03246]
/Resources<</Font<</Helvetica_0 8 0 R >>>>
/Subtype/Line
/T(james)
/Type/Annot>>
endobj
```

Thankfully, with our frameworks, you won’t need to understand any of that, because our API generates everything for you!

### How to Customize Your Line Annotation

The default line is solid, but you can also specify a dashed line:

```java
List<Integer> dashStyle = Arrays.asList(3, 2);
lineAnnotation.setDashArray(dashStyle);
```

The PDF specification provides some examples of line dash patterns, shown below.

![Line Dash Patterns](/images/blog/2018/line-annotations/line-dash-patterns.png)

The thickness of the line can be specified like this:

```java
lineAnnotation.setLineWidth(10.0);
```

And the color can be changed too:

```java
lineAnnotation.setColor(getColor());
```

### Start and End Style and Color

The ends of the lines can have what the PDF specification refers to as caps (as mentioned earlier). These are various shapes that may or may not extend beyond the ends of the line’s coordinates, and they can be useful for creating everything from arrows to fancy bullet point markers to technical diagrams.

![Line Ending Styles From PDF Specification](/images/blog/2018/line-annotations/line-ending-styles.png)

Here’s how simple it is to set the end styles:

```java
lineAnnotation.setLineEnds(LineEndType.CIRCLE, LineEndType.OPEN_ARROW);
```

For line end shapes with an interior space, a fill color can be specified. For example, you could have a green line with circular line ends filled with red:

```java
lineAnnotation.setColor(getGreenColor());
lineAnnotation.setLineEnds(LineEndType.CIRCLE, LineEndType.CIRCLE);
lineAnnotation.setFillColor(getRedColor());
```

## Conclusion

As you can see, line annotations are versatile, which allows you to configure them in countless ways. What’s more is the PSPDFKit APIs make them easy to work with in your code. Check out our excellent guide articles on annotations for more details.

* [PDF framework for Android](https://pspdfkit.com/guides/android/current/annotations/introduction-to-annotations/)
* [PDF SDK for iOS](https://pspdfkit.com/guides/ios/current/annotations/introduction-to-annotations/)
* [PDF Library for Web](https://pspdfkit.com/guides/web/current/annotations/introduction-to-annotations/)
