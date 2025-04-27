---
title: "How to Generate a PDF with JavaScript"
description: "Generate PDFs in JavaScript using html2pdf and Puppeteer."
section: blog
preview_image: /images/blog/2019/html-to-pdf-in-javascript/article-header.png
author:
  - Nicolas Dular
author_url:
  - https://twitter.com/nicolasdular
date: 2019-03-18 8:00 UTC
tags: Development, html2pdf, Puppeteer, How To
published: true
secret: false
---

A very common use case today is that of giving your users the ability to download data from your website as a PDF. For example, invoices, concert tickets, and flight tickets tend to be available as PDF downloads. In this post, we’ll take a look at two solutions for easily converting HTML to PDF: html2pdf and Puppeteer.

## html2pdf

The [html2pdf][] library allows you to embed it in your website and make parts of your site downloadable as PDFs, but today, we’ll focus on making a PDF in our application downloadable. For our example, I’m using the [Simple HTML invoice template][], and I statically typed in the invoice we’ll use. However, you can easily generate the HTML for your own invoice in your backend if you prefer.

I downloaded the bundled html2pdf JavaScript library directly and imported it in our site. You can download it from the [GitHub repository][html2pdf repo], or if you already have a bundler in your site, you can install it via `npm` or `yarn`.

To begin, we first define a `generatePDF()` function that will get the element we’ve rendered the invoice in and then call `html2pdf` with that element to download it directly on our users’ client. Then we will call this function in a download button:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>HTML to PDF Eample</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="html2pdf.bundle.min.js"></script>

    <script>
      function generatePDF() {
        // Choose the element that our invoice is rendered in.
        const element = document.getElementById("invoice");
        // Choose the element and save the PDF for our user.
        html2pdf()
          .from(element)
          .save();
      }
    </script>
  </head>
  <body>
    <button onclick="generatePDF()">Download as PDF</button>
    <div id="invoice">
      <h1>Our Invoice</h1>
    </div>
  </body>
</html>
```

In the example above, we only rendered the Our Invoice header, but the end result is shown below.

![Invoice preview](/images/blog/2019/html-to-pdf-in-javascript/invoice-preview.png)

### Advantages and Disadvantages

The biggest advantage of html2pdf is that it’s really easy to generate a PDF from your HTML on your client, which means you don’t need a server at all. However, the disadvantage of this approach is that html2pdf just takes a screenshot of your site and generates a PDF out of it, which means the text will look blurry when you zoom in or if you’re using a Retina display.

You can configure html2pdf to use PNGs instead of JPEGs, but this causes the size of the PDF to increase dramatically: For the same resolution where the JPEG version is just 280 KB, the PNG version is 28 MB.

To counter this, I’d recommend choosing a larger resolution to make your PDF look sharper. To do this, change the `generatePDF` function and add the parameters for the scale to it:

```js
function generatePDF() {
  // Choose the element that our invoice is rendered in.
  const element = document.getElementById("invoice");
  // Choose the element and save the PDF for our user.
  html2pdf()
    .set({ html2canvas: { scale: 4 } })
    .from(element)
    .save();
}
```

## Puppeteer

[Puppeteer][] is a Node library that gives you an API to control a headless Chrome or Chromium instance. This allows you to do most things that you’re also able to do manually in the browser, and one of those things is generating a PDF from your website. The difference between Puppeteer and html2pdf is that you need to run Puppeteer on your server and serve the PDF to your users.

For the Puppeteer example, let’s build a small Node.js server and serve our user a PDF that gets downloaded.

Let’s begin by creating a new Node project:

[==

```yarn
yarn init
```

```npm
npm init
```

==]

After initializing the Node project, we should have a `package.json` in our directory. Now it’s time to add
Puppeteer as a dependency to our project:

[==

```yarn
yarn add puppeteer
```

```npm
npm add puppeteer
```

==]

Your `package.json` should look similar to this:

```json
// package.json
{
  "name": "puppeteer-pdf-example",
  "version": "1.0.0",
  "description": "Example of how to generate a PDF with Puppeteer",
  "main": "index.js",
  "license": "MIT",
  "private": false,
  "dependencies": {
    "puppeteer": "^1.10.0"
  }
}
```

For our example, we’ll assume you have your page with the invoice running on `localhost:8000`.

We’ll now create an `index.js` file where we will require Puppeteer, launch a new browser session, go to our invoice page, and save the PDF file:

```js
// index.js

// Require Puppeteer.
const puppeteer = require("puppeteer");

async function generatePDF() {
  // Launch a new browser session.
  const browser = await puppeteer.launch();
  // Open a new Page.
  const page = await browser.newPage();

  // Go to our invoice page that we serve on `localhost:8000`.
  await page.goto("http://localhost:8000");
  // Store the PDF in a file named `invoice.pdf`.
  await page.pdf({ path: "invoice.pdf", format: "A4" });

  await browser.close();
}
```

When we now run the script via `node index.js`, we’ll see a nicely generated PDF with the name `invoice.pdf` in our directory.

However, what we actually want is to serve our users a PDF when they click a download button. For this, we’ll use the `http` module from Node and respond with the invoice PDF when a user goes to our page on `localhost:3000`.

First, we need to require `http` in our script. We’ll start a small server and set the headers to `application/pdf` to tell the browser that we will respond with a PDF. Instead of writing to a file when creating the PDF, we will directly serve the buffer that’s returned from `page.pdf`. To make this possible, we just have to remove the `path` option:

```js
// index.js
const puppeteer = require("puppeteer");
const http = require("http");

// Create an instance of the HTTP server to handle the request.
http
  .createServer(async (req, res) => {
    // Set the content type so the browser knows how to handle the response.
    res.writeHead(200, { "Content-Type": "application/pdf" });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("http://localhost:8000");
    // By removing the `path` option, we will receive a `Buffer` from `page.pdf`.
    const buffer = await page.pdf({ format: "A4" });

    await browser.close();

    // We can directly serve this buffer to the browser.
    res.end(buffer);
  })
  .listen(3000);
```

However, sometimes we won’t want to serve a page from our web server and we’ll instead want to use the HTML we generated on our server directly. This can easily be done with Puppeteer’s `setContent` function, which takes the HTML that needs to get rendered on the site as an argument:

```js
// index.js
const puppeteer = require("puppeteer");
const http = require("http");

http.createServer(async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(`
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>HTML to PDF Example</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <div id="invoice">
    <h1>Our Invoice</h1>
  </div>
</body>
</html>
`)
  const buffer = await page.pdf({ format: "A4" });
  await browser.close();

    res.end(buffer);
}
```

### Advantages and Disadvantages

The biggest advantage of Puppeteer is that it creates an actual PDF file with text content instead of just using
an image. You’ll be able to select and copy the text from the PDF, and you don’t need to worry about resolution since it will be always sharp. Additionally, the file size is significantly lower; compared to the html2pdf example, Puppeteer’s resulting PDF is about four times smaller.

The main disadvantage of using Puppeteer is that you’ll need to run a server instead of generating the PDF on the client.

## Conclusion

If you need something quickly and don’t want to build anything on your server to create PDF files, you’re good to go with html2pdf. However, considering the increased file size and resulting image creation, I’d recommend you build a component on your server with Puppeteer so that you can serve nice PDFs. In turn, your users will appreciate the small file size and sharp resolution.

[html2pdf]: https://github.com/eKoopmans/html2pdf/blob/master/dist/html2pdf.bundle.min.js
[simple html invoice template]: https://github.com/sparksuite/simple-html-invoice-template/blob/master/invoice.html
[html2pdf repo]: https://github.com/eKoopmans/html2pdf
[puppeteer]: https://github.com/GoogleChrome/puppeteer
