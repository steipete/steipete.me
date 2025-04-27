---
title: "What Are Appearance Streams?"
description: "An explanation of what appearance streams actually are, along with their gotchas."
preview_image: /images/blog/2018/what-are-appearance-streams/article-header.png
section: blog
author:
  - Patrik Weiskircher
author_url:
  - https://twitter.com/pweisk
date: 2018-05-02 12:00 UTC
tags: Development, PDF internals
published: true
---

If you’ve worked a lot with customizing annotations, you’ve probably heard of appearance streams. They are an optional part of the specification, but if you want to ensure that everyone viewing a PDF sees exactly the same annotation, there’s no way around them.

Our [What Are Annotations?][] blog post covered this topic a little bit, but the importance of appearance streams warrants its own article, so this post will provide you with a high-level overview of what they are and what they are used for.

## Annotations and Appearance Streams

An annotation dictionary contains properties that loosely define how an annotation should look. However, it doesn’t describe the appearance of annotations in enough detail to provide us with a pixel-perfect representation. Because one of the goals of the PDF format is to represent a document precisely, independent of software, another solution had to be found.

Appearance streams, or AP streams for short, describe exactly how to render an annotation. They use the same render commands as page rendering and are contained in an annotation.

Here is a short example of how an AP stream for a simple rectangle might look:

```
1 0 0 RG     # Sets the stroking color to red.
0 1 0 rg     # Sets the fill color to green.
2 w          # Sets the line width to 2.
137.431 652.265 76.33 67.292 re # Appends a rectangle to the path.
B            # Fills and strokes the path.
```

Most AP streams are included in the annotation dictionary in the `AP` dictionary under the `N` key, which denotes the annotation’s normal appearance. Not often used, but still in the specification, are the `R` (rollover) and the `D` (down) appearances. One caveat: radio buttons and checkboxes have another level in the hierarchy for specifying separate streams for checked and unchecked appearances.

That said, there are still a few things that can’t easily or efficiently be represented, like images. For this, we have to look at XObjects.

## XObjects

An XObject is a self-contained description of rendering commands, and it can render another XObject using the `Do` operator. To make this even more confusing, the AP stream is an XObject.

So how does this all help us? An XObject can both contain resources like images and be shared across the document.

### Resources

An XObject can contain resources like images or fonts. These can be saved efficiently in a binary format and can also be compressed, which reduces the file size and allows the PDF software to efficiently cache them.

### Shareablility

Imagine you want to have a company logo on each page of a PDF document. Instead of having to include the image in every page, you can simply create one XObject with the proper commands to render the image, add a reference to it, and call `/Logo Do` from your render stream. Then it will appear on every page automatically.

## PSPDFKit and AP Streams

PSPDFKit supports fully customizing the appearance stream of annotations. To learn more about this, please see the [Appearance Streams for iOS][] or [Appearance Streams for Android][] guide article.

## Conclusion

This article served as an introduction to what appearance streams are and what their purpose is in a PDF file. While PSPDFKit mostly handles appearance streams transparently, we also offer a powerful API to customize them fully when needed. Go here to download a [free trial][] and see this firsthand.
  
[What Are Annotations?]: https://pspdfkit.com/blog/2018/what-are-annotations/#appearance-streams
[Appearance Streams for iOS]: https://pspdfkit.com/guides/ios/current/annotations/appearance-streams/
[Appearance Streams for Android]: https://pspdfkit.com/guides/android/current/annotations/appearance-streams/
[free trial]: https://pspdfkit.com/try/