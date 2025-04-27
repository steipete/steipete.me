---
title: "Create PDFs with React"
description: "We explore react-pdf, a custom React renderer that can generate PDFs in the browser, on the server, and on mobile devices."
preview_image: /images/blog/2019/create-pdfs-with-react/article-header.png
section: blog
author:
  - Philipp Spiess
author_url:
  - https://twitter.com/PhilippSpiess
date: 2019-03-26 8:00 UTC
tags: Web, Development, How-To, React Native, React,
cta: web
published: true
secret: false
---

Most modern apps need ways to generate PDF files from data. Regardless of what you’re trying to create — invoices, sales contracts, or certificates — you’ll often end up in need of a method for programmatically assembling PDF documents.

In this article, we’ll examine a popular React-based solution that can be used to generate PDFs by using a declarative API: [`react-pdf`][] by [Diego Muracciole][]. This library makes it easy to create PDFs by using typical React-style components.

## Getting Started

`React-pdf` works in the browser, on the server, or on mobile devices, just like your existing React (or React Native) application does. To keep things simple for this article, we’ll use [CodeSandbox][] to run a simple React application directly in the browser.

**ℹ️ Note:** By default, `react-pdf` comes with a simple PDF viewer that uses an [`<iframe>` to render the document][open pdf in your web app] in the browser. However, the CodeSandbox examples use [PSPDFKit for Web][] to view the PDFs.

To get started with `react-pdf`, we first need to add it as a dependency to our JavaScript application:

[==

```yarn
yarn add @react-pdf/renderer
```

```npm
npm install --save @react-pdf/renderer
```

==]

To create a PDF, we have to use the basic components exposed by `react-pdf`, which are used as primitives (like DOM elements in React DOM and `<View>` in React Native). These can be composed into [custom components][] as well. The following components are the most important ones:

- [`<Document>`][] is the root of a PDF file.
- [`<Page>`][] describes an individual page. It must have a dimension (we’re using A4 in this example).
- [`<View>`][] is a general-purpose container used for styling and formatting. You can use [`StyleSheet.create()`][] similar to how this API is used in React Native to style your views with the full power of Flexbox for laying out PDFs.
- [`<Text>`][] is used to display text.

Now let’s create our first PDF. We start with a simple two-column layout using Flexbox. To do this, we use a page view and set its `flexDirection` to `row` so that items are aligned in a row. Then we insert a section view with `flexGrow: 1` to tell the layout engine that the items should expand to the biggest possible width. If we have two items, they will now be evenly distributed:

```jsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row"
  },
  section: {
    flexGrow: 1
  }
});

const MyDocument = (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Hello World!</Text>
      </View>
      <View style={styles.section}>
        <Text>We're inside a PDF!</Text>
      </View>
    </Page>
  </Document>
);
```

That’s already enough to create the PDF! To render it, you can use the [`<PDFViewer>`][] React DOM component that ships with `react-pdf`. It uses an [`<iframe>` to render the document][open pdf in your web app] in the browser:

```jsx
ReactDOM.render(
  <PDFViewer>{MyDocument}</PDFViewer>,
  document.getElementById("root")
);
```

You can also refer to our [PSPDFKit for Web in React][] example and use a more advanced PDF viewer, like we did in the CodeSandbox example.

[![Edit Create PDFs with React — Getting Started](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/2ww45q3omy)

## Rendering Process

Before a PDF is generated, `react-pdf` goes through several steps to lay out the pages and encode them as a valid PDF. The official website features a wonderful graphic (shown below) that explains the [rendering pipeline][].

![Internal structures creation — PDF document creation & metadata — Fetching assets — Wrapping pages — Rendering — Finish document](/images/blog/2019/create-pdfs-with-react/pipeline.png)

The most interesting aspect of this pipeline is that some of the work — the creation of internal structures and PDF documents — can already be started before all assets (fonts, images) are loaded via the network. This will speed up the rendering process.

Now let’s try some more powerful features. More specifically, let’s add images and links to our PDF document.

## Adding Images and Links to Spice Up Your Content

In addition to the components we used before, we’re now taking a look at two more:

- [`<Image>`][], which is used to place images inside the PDF file.
- [`<Link>`][], which is used to create hyperlink annotations.

For this example, we want to create a two-row layout, where the first row will show the PSPDFKit logo centered, and the second row will show a small paragraph of text, followed by a link to our website.

We start by changing the `flexDirection` of the page view to `column` instead of `row` and create a new `centerImage` view that uses `alignItems: "center"` to center the logo. After that, we use an `<Image>` element to load a PNG image directly into the PDF:

```jsx
const styles = StyleSheet.create({
  page: {
    flexDirection: "column"
  },
  image: {
    width: "50%",
    padding: 10
  },
  centerImage: {
    alignItems: "center",
    flexGrow: 1
  }
});

const MyDocument = (
  <Document>
    <Page style={styles.page} size="A4">
      <View style={styles.centerImage}>
        <Image style={styles.image} src="/pspdfkit-logo.png" />
      </View>
    </Page>
  </Document>
);
```

The `flexGrow` property on the `centerImage` view will make sure the image view uses all the available height and pushes the text elements that we’re adding next to the bottom. To add links, we use the `<Link>` element inside text elements. This looks similar to an HTML anchor tag, but it will create proper [link annotations][] inside the PDF:

```jsx
const styles = StyleSheet.create({
  text: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    color: "#212121"
  }
});

const MyDocument = (
  <Document>
    <Page style={styles.page} size="A4">
      <Text style={styles.text}>Some text...</Text>
      <Text style={styles.text}>Some more text...</Text>
      <Text style={styles.text}>
        Learn more at <Link src="https://pspdfkit.com/">pspdfkit.com</Link>
      </Text>
    </Page>
  </Document>
);
```

You can see that adding links and images to a PDF is as simple as adding links and images to your React application. Feel free to play around with the setup using the CodeSandbox link below!

[![Edit Create PDFs with React — Images and Links](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/jn8jk33r55)

## Conclusion

As we’ve seen, [`react-pdf`][] is a powerful tool for generating PDF files with React, no matter the platform you’re on. Our examples work out of the box in a web browser, but they can also easily be ported to a Node.js server or a mobile phone using React Native. Generating PDFs has never been easier.

`React-pdf` uses an [`<iframe>`][open pdf in your web app] to show the PDF using the browser’s default PDF viewer. If your use case requires consistent cross-browser behavior and more advanced PDF features like annotations, markups, different view settings, and individual customization, we recommend reading our other React-themed blog posts: [Open a PDF in React on the Web][] and [How to Add PDF Support to Your Web App in No Time][].

[`react-pdf`]: https://react-pdf.org/
[diego muracciole]: https://github.com/diegomura
[codesandbox]: https://codesandbox.io
[open pdf in your web app]: /blog/2018/open-pdf-in-your-web-app/
[pspdfkit for web]: https://pspdfkit.com/web
[custom components]: https://reactjs.org/docs/components-and-props.html
[`<document>`]: https://react-pdf.org/components#document
[`<page>`]: https://react-pdf.org/components#page
[`<view>`]: https://react-pdf.org/components#view
[`stylesheet.create()`]: https://react-pdf.org/styling
[`<text>`]: https://react-pdf.org/components#text
[`<pdfviewer>`]: https://react-pdf.org/components#pdfviewer
[pspdfkit for web in react]: https://github.com/PSPDFKit/pspdfkit-web-example-react
[rendering pipeline]: https://react-pdf.org/rendering-process
[`pdfkit`]: https://github.com/foliojs/pdfkit
[`<image>`]: https://react-pdf.org/components#image
[`<link>`]: https://react-pdf.org/components#link
[link annotations]: https://pspdfkit.com/guides/web/current/annotations/link-annotations/
[open a pdf in react on the web]: /blog/2018/open-pdf-in-react/
[how to add pdf support to your web app in no time]: /blog/2017/integrate-pspdfkit-web/
