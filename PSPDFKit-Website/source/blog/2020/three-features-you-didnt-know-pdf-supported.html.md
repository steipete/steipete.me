---
title: "Three Features You Didn't Know PDF Supported"
description: "There are many features in PDF, but these are three you probably didn't know about."
preview_image: /images/blog/2020/three-features-you-didnt-know-pdf-supported/article-header.png
section: blog
author:
  - Nick Winder
author_url:
  - http://www.nickwinder.com
date: 2020-01-01 8:00 UTC
tags: PDF
published: true
secret: true
---

The PDF specification was first announced in 1992, and it’s come a long way since then. Many people think of PDFs as straightforward and simplistic, but the format supports some out-there cases, some of which you’d never think are possible. In this blog post, I want to take you through three (likely) unknown features of PDF documents that I find particularly interesting: 3D annotations, optional content, and geospatial information.

## 3D Annotations

Many of you have viewed or worked with PDFs containing text and images. Maybe you’ve even seen videos and audio clips embedded in pages. However, not many people know that the PDF specification takes this focus on media one step further, in that [embedding information for 3D objects][3d-reference] in PDFs is possible. With the right viewer, it’s even possible to interact with an object by zooming, panning, and rotating around the view as though the object is in your hands.

3D objects are useful in many different industries. In particular, fields concerned with mechanical design, electronic circuit design, and architectural design could benefit from PDFs with 3D capabilities.

Due to the features already available in PDF, it’s possible to make a 3D object genuinely interactive. You can define preset camera views of an object, such as the side, top, and front views. It’s also possible to assign [markup annotations][annotations] to a design so that engineers and users can assign notes and highlight specific areas of a plan. And with the use of the next unique feature in this post, it’s also possible to dynamically show and hide certain areas of an object to provide a focused and immersive experience.

![3D Render](/images/blog/2020/three-features-you-didnt-know-pdf-supported/3D-render-example.gif)

## Optional Content

Did you know you don’t always see everything described in a PDF file? What you see depends on what state the document is in and what you have selected. Optional content allows both the document viewer and the user to change the appearance of a document based on different input parameters.

Optional content can be a great way of ensuring that certain content on a PDF is not printed. For example, you would not want arbitrary text, like “Zoom in to view in more detail,” to display on a printed version of a PDF. In addition to hiding content, you can show content based on the zoom level selected, which is great for those small details that add context only at high or low zoom levels.

Alongside the standard use of optional content, it’s possible to define user-controllable optional content that works very much like [layers][adobe-layers] in an image editing program. You can assign an object to a layer, and the user can decide whether or not it should be visible. Layers are a great option for users looking for configurable overlays. For example, they could be used to display a group of notes over lecture notes to provide more context to a teacher giving a lesson, or to include specific instructions on a technical drawing. These layers have the potential to add an unlimited amount of information to a document.

Up to this point, the examples of optional content have been mutually exclusive, but there are ways to create relationships between them. For example, it’s possible to show content only when at a certain zoom level _and_ when a particular layer is displayed.

To add more functionality, [JavaScript][calculator-javascript] can be used to drive the view behavior, which allows a near unlimited amount of possibilities. The example below makes items viewable based on form selection in a PDF, which can be very useful in providing more context for user-fillable forms.

![Optional Content](/images/blog/2020/three-features-you-didnt-know-pdf-supported/optional-content-example.gif)

## Geospatial Information

Location information is a format that provides rich user information to describe a file in even more depth, and it has long been used in image file formats to [link photos to locations on the earth][photo-location-information].

The PDF format may not be the first place where you’d feel location data could be relevant, but when used in a particular way, it has the potential to bring documents to life. Georeferenced data is a way of relating location data to points on a page/screen. We can assign each corner of the page to a latitude and longitude, and with this information, we can find the relative location of any point on that page in relation to the latitude or longitude.

[Georeferenced][] data can be useful in situations where a PDF is displaying a map and users want to be able to measure the distance between points. Alternatively, another example is that of architectural drawings, where we can define location points to correspond to corners of a building. A user can then, for example, give precise real-world measurements to a construction team to complete a project.

[An interesting example of using georeferencing data][geospatial pdf maps] shows how to pinpoint locations within Central Park in New York City. When the locations have been set, it’s possible to use the measurement tool to map out a short walk or link the location information to services like Google Maps. In this way, it’s easy to make a document truly interactive and useful.

![Map with Measure Tool](/images/blog/2020/three-features-you-didnt-know-pdf-supported/map-with-measure-tool.png)

## Conclusion

Currently, PSPDFKit doesn’t fully support the three topics discussed in this blog post, but it’s always fun to experiment with features. When the demand for these exists, we will for sure consider these exciting additions. Either way, next time a project comes up and you want a portable way of sending a map with location information, or perhaps you’re looking for a way to display the design of your next 3D printed project, PDFs could be the answer.

[3d-reference]: https://en.wikipedia.org/wiki/PDF#Content
[annotations]: https://pspdfkit.com/pdf-sdk/ios/annotations/
[adobe-layers]: https://helpx.adobe.com/acrobat/using/pdf-layers.html
[calculator-javascript]: https://pspdfkit.com/blog/2018/how-to-program-a-calculator-pdf/
[photo-location-information]: https://www.howtogeek.com/211427/how-to-see-exactly-where-a-photo-was-taken-and-keep-your-location-private/
[georeferenced]: https://www.qgistutorials.com/en/docs/georeferencing_basics.html
[geospatial pdf maps]: https://acrobatusers.com/tutorials/x-marks-spot-geospatial-pdf-maps
