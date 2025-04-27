---
title: "Implement a Simple PDF Viewer with PDF.js"
description: "An example of how to implement a minimal PDF viewer with Mozilla's PDF.js"
preview_image: /images/blog/2019/implement-pdf-viewer-pdf-js/article-banner.png
section: blog
author:
  - Giuseppe Gurgone
author_url:
  - https://twitter.com/giuseppegurgone
date: 2019-01-29 8:00 UTC
tags: Web, Development, How-To
published: true
secret: false
---

When looking for free and open source PDF processing libraries for the Web, [PDF.js][] is usually a good option if you are willing to implement a user interface on your own or use its demo one.

In an [earlier post][render pdfs with pdf.js], we showed how to render a PDF page in the browser with PDF.js and how to integrate their sample UI. In this blog post, we will see how to build a simple custom PDF viewer to display PDF documents on a page. The source code is available on [codesandbox.io][codesandbox], and what’s shown below is the final result.

<iframe src="https://codesandbox.io/embed/pmy914l2kq?autoresize=1&&view=preview" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Our simple viewer can load PDF documents from a URL and has buttons to go to the next page or the previous page.

The example also shows a Page Mode feature that allows us to display multiple pages at once. Although we won’t discuss it in this article, its implementation is available in the [codesandbox.io example][codesandbox].

At PSPDFKit, we build a rich, advanced web viewer. Feel free to check out our [demo][] in case you are looking for a professional viewer with a solid API.

## Initial Setup

Before we dive into the viewer implementation, we’re going to lay down a minimal HTML skeleton for our application:

```html
<!DOCTYPE html>
<link rel="stylesheet" href="./styles.css" />

<div id="app">
  <div id="toolbar">
    <div id="pager">
      <button data-pager="prev">prev</button>
      <button data-pager="next">next</button>
    </div>
    <div id="page-mode">
      <label>Page Mode <input type="number" value="1" min="1"/></label>
    </div>
  </div>
  <div id="viewport" role="main"></div>
</div>

<script src="https://unpkg.com/pdfjs-dist@latest/build/pdf.min.js"></script>
<script src="./index.js"></script>
<script>
  window.onload = () => {
    initPDFViewer("assets/example.pdf");
  };
</script>
```

We are using the CDN-hosted version of PDF.js from unpkg, but this file could also be downloaded and hosted locally.

## Loading Documents

The `initPDFViewer` function above accepts the URL of a PDF file. Since PDF.js will fetch the document making an Ajax request, our viewer needs to run on a web server. Otherwise, the browser will block the request for security reasons.

Inside `initPDFViewer`, we get the document, save a reference to its instance and the count of the pages, and render the first page:

[==

```es
let currentPageIndex = 0;
let pdfInstance = null;
let totalPagesCount = 0;

window.initPDFViewer = function(pdfURL) {
  pdfjsLib.getDocument(pdfURL).then(pdf => {
    pdfInstance = pdf;
    totalPagesCount = pdf.numPages;
    initPager();
    render();
  });
};
```

```js
var currentPageIndex = 0;
var pdfInstance = null;
var totalPagesCount = 0;

window.initPDFViewer = function(pdfURL) {
  pdfjsLib.getDocument(pdfURL).then(function(pdf) {
    pdfInstance = pdf;
    totalPagesCount = pdf.numPages;
    initPager();
    render();
  });
};
```

==]

## Rendering

Every time we call `render`, our viewer renders the page at `currentPageIndex` as follows:

[==

```es
const viewport = document.querySelector("#viewport");

function render() {
  pdfInstance.getPage(currentPageIndex + 1).then(page => {
    viewport.innerHTML = `<div><canvas></canvas></div>`;
    renderPage(page);
  });
}
```

```js
var viewport = document.querySelector('#viewport')

function render() {
  pdfInstance.getPage(currentPageIndex + 1)
    .then(function(page) => {
      viewport.innerHTML = `<div><canvas></canvas></div>`
      renderPage(page)
    })
}
```

==]

`getPage` retrieves the `page` proxy object that allows us to work with a document page. We increment `currentPageIndex`, since `getPage` expects the page number instead of the page index.

Finally, we can render the given page:

[==

```es
function renderPage(page) {
  let pdfViewport = page.getViewport(1);

  const container = viewport.children[0];

  // Render at the page size scale.
  pdfViewport = page.getViewport(container.offsetWidth / pdfViewport.width);
  const canvas = container.children[0];
  const context = canvas.getContext("2d");
  canvas.height = pdfViewport.height;
  canvas.width = pdfViewport.width;

  page.render({
    canvasContext: context,
    viewport: pdfViewport
  });
}
```

```js
function renderPage(page) {
  var pdfViewport = page.getViewport(1);

  var container = viewport.children[0];

  // Render at the page size scale.
  pdfViewport = page.getViewport(container.offsetWidth / pdfViewport.width);
  var canvas = container.children[0];
  var context = canvas.getContext("2d");
  canvas.height = pdfViewport.height;
  canvas.width = pdfViewport.width;

  page.render({
    canvasContext: context,
    viewport: pdfViewport
  });
}
```

==]

`page.render` returns a [`RenderTask`][rendertask], which can be used to either determine when a page has finished rendering or abort the rendering process. In a real-world application, `RenderTask`s can be useful for avoiding unnecessary work when quickly changing pages or zooming.

## Changing Pages

To change pages, we create two buttons to increment or decrement the `currentPageIndex` on click. We then call into `render` again to render the page at the new `currentPageIndex`:

[==

```es
function onPagerButtonsClick(event) {
  const action = event.target.getAttribute("data-pager");
  if (action === "prev") {
    if (currentPageIndex === 0) {
      return;
    }
    currentPageIndex -= pageMode;
    if (currentPageIndex < 0) {
      currentPageIndex = 0;
    }
    render();
  }
  if (action === "next") {
    if (currentPageIndex === totalPagesCount - 1) {
      return;
    }
    currentPageIndex += pageMode;
    if (currentPageIndex > totalPagesCount - 1) {
      currentPageIndex = totalPagesCount - 1;
    }
    render();
  }
}
```

```js
function onPagerButtonsClick(event) {
  var action = event.target.getAttribute("data-pager");
  if (action === "prev") {
    if (currentPageIndex === 0) {
      return;
    }
    currentPageIndex -= pageMode;
    if (currentPageIndex < 0) {
      currentPageIndex = 0;
    }
    render();
  }
  if (action === "next") {
    if (currentPageIndex === totalPagesCount - 1) {
      return;
    }
    currentPageIndex += pageMode;
    if (currentPageIndex > totalPagesCount - 1) {
      currentPageIndex = totalPagesCount - 1;
    }
    render();
  }
}
```

==]

In the snippet above, we assume that the increment/decrement `pageMode` is `1`. In the [codesandbox.io example][codesandbox] you can see how, with the help of a cursor (`cursorIndex`), we handle navigation when `pageMode` is greater than `1`.

## Conclusion

Implementing a feature-rich PDF viewer is not a trivial and quick task, but as we have seen in this article, with relatively little work, we can not only build an application that can render a PDF document with one or multiple pages at the same time, but we can also add controls to change the page. Please check out [the final result on codesandbox][codesandbox]!

PDF.js is a good free option if you are willing to invest time into implementing a UI for it. The project comes with some [examples][pdf.js examples] and [API docs][pdf.js api] — though they are currently incomplete.

At PSPDFKit, we offer a commercial, full-blown, and completely customizable PDF viewer that is easy to integrate and comes with well-documented APIs to handle the advanced use cases. Check out our [demo][] to see it in action.

[pdf.js]: https://mozilla.github.io/pdf.js/
[render pdfs with pdf.js]: /blog/2018/render-pdfs-in-the-browser-with-pdf-js/
[pspdfkit for web]: https://pspdfkit.com/web
[codesandbox]: https://codesandbox.io/s/pmy914l2kq
[demo]: https://web-preview.pspdfkit.com
[rendertask]: https://mozilla.github.io/pdf.js/api/draft/RenderTask.html
[pdf.js api]: https://mozilla.github.io/pdf.js/api/
[pdf.js examples]: https://mozilla.github.io/pdf.js/examples/
