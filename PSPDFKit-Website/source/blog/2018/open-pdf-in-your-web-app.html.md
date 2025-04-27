---
title: "Open a PDF in Your Web App"
description: "We discuss a simple approach to loading PDF files in an HTML app without using JavaScript."
preview_image: /images/blog/2018/open-pdf-in-your-web-app/article-header.png
section: blog
author:
  - Philipp Spiess
author_url:
  - https://twitter.com/PhilippSpiess
date: 2018-02-12 12:00 UTC
tags: Web, Development, How-To
cta: web
published: true
---

PDF documents are used all across the internet. Be it an invoice from an online shop or a sales agreement, PDF is everywhere. One of the main arguments for using PDF as opposed to word processor files is the fact that the PDF file format is rendered exactly the same no matter the device. This trait is useful especially on the web, where getting something to look the same on different browsers is not always easy.

In this article, we’ll look at a simple approach for including PDF support in your web application. This option works regardless of the programming language you’re using — no matter if you’re an ASP.NET, JavaScript, PHP, C++, Java, Python, or Ruby specialist.

## Embed PDF in HTML with `<object>`

Given the immense popularity of PDF, it’s no wonder that all common browsers (Google Chrome, Firefox, Internet Explorer, Edge, and Safari) include some sort of built-in PDF support. This makes it possible to embed PDFs into HTML pages without using JavaScript. Let’s explore the most common method to do so.

The HTML `<object>` element can use native browser PDF viewing and even allows you to provide a fallback if PDF is not supported. It doesn’t require JavaScript and is a common tool when working on an HTML5 application:

```html
<object
  data="https://example.com/test.pdf#page=2"
  type="application/pdf"
  width="100%"
  height="100%">
  <p>Your browser does not support PDFs.
    <a href="https://example.com/test.pdf">Download the PDF</a>.</p>
</object>
```

Since `<object>` is not available in every browser, this method is often combined with the `<iframe>` HTML element to reach the most users. To do this, the fallback area of the `<object>` is used to host an `<iframe>`. Similar to the `<object>` element, the content of an `<iframe>` — in our case, this would be the `<p>` tag with its content — is only shown when the browser does not support PDFs via the `<iframe>` element:

```html
<object
  data="https://example.com/test.pdf#page=2"
  type="application/pdf"
  width="100%"
  height="100%">
  <iframe
    src="https://example.com/test.pdf#page=2"
    width="100%"
    height="100%"
    style="border: none;">
    <p>Your browser does not support PDFs.
      <a href="https://example.com/test.pdf">Download the PDF</a>.</p>
  </iframe>
</object>
```

### Live Example

If you’re curious how the above PDF will be rendered in your browser, check out the following example integration:

<object
  data="https://web-preview.pspdfkit.com/showcases/8.pdf#page=2"
  type="application/pdf"
  width="100%"
  height="400">
  <iframe
    src="https://web-preview.pspdfkit.com/showcases/8.pdf#page=2"
    width="100%"
    height="400"
    style="border: none;">
    <p>Your browser does not support PDFs.
      <a href="https://web-preview.pspdfkit.com/showcases/8.pdf">Download the PDF</a>.</p>
  </iframe>
</object>

These simple HTML elements work in most desktop browsers and can be used to add PDF support to your web app without relying on JavaScript.

### Problems with This Approach

This approach of displaying PDF documents is fast and requires no programming. There are, however, certain downsides:

- A browser could use whichever PDF reader is installed on a system, and there is no API that would allow you to customize the reader’s look and feel. In other words, the UI used when loading a PDF via an `<object>` is completely outside of your control.

- It is not guaranteed that every browser will implement a PDF view via `<object>` or `<iframe>`. For example, certain versions of Internet Explorer will require your users to install Adobe Reader to support rendering a PDF via `<object>`, whereas other browsers might not support it at all.

- There’s only a very limited set of API methods. In fact, if you look closely at the `data` and `src` properties in the above examples, you can see we’ve appended `#page=2` to the URLs. This allows you to control the page that is shown. If you’re looking for a complete reference of parameters, check out the [“Parameters for Opening PDF Files” specification] published by Adobe in 2007. Unfortunately, supporting those parameters is not required and thus there is no guarantee that this flag really works (as an example, while writing this we noticed that Safari 11 does not seem to honor any of those properties).

## Conclusion

With the `<object>` or `<iframe>` HTML5 elements, it is possible to show a PDF in your web app with ease. This is supported in most browsers and requires no JavaScript at all, making it a perfect approach for adding PDF support if no advanced features are necessary.

For use cases that require support for every browser, customization, or some of the more advanced PDF features like annotation, PDF forms, and more, we recommend you look into more feature-complete products like [PSPDFKit for Web](/web).

[“Parameters for Opening PDF Files” specification]: http://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf
