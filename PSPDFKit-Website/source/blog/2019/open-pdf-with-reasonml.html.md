---
title: "Open PDF Documents with ReasonML"
description: "How to open and work with PDF documents from your ReasonML app."
preview_image: /images/blog/2019/open-pdf-with-reasonml/article-header.png
section: blog
author:
  - Miguel Calderon
author_url:
  - https://github.com/miguelcalderon
date: 2019-05-13 8:00 UTC
tags: Web, Development, How-To, ReasonML
published: true
secret: false
---

Our team loves experimenting with new technologies, so it should come as no surprise that, for some time, we’ve been playing around with [ReasonML][], which is popularly used together with [ReasonReact][].

At this point, you can find pretty much every kind of library for ReasonML, especially given the fact that it can use any JavaScript library out there. However, implementing the libraries can be tricky if you’re not familiar with the correspondence between both languages. Moreover, if you’re building a web application, you need to handle web APIs in a “reasonable” way.

In this blog post, I will explain how we figured things out when we wanted to use [PDF.js][] in a sample ReasonML app that was not paired with any frontend framework.

PDF.js has been around for a while, it’s free, and it includes just enough features to get us going for this example. We have already written about [how to use it to render PDF files in the browser][], and we covered [how to use it to build simple interfaces][] for loading and viewing PDF documents like the one we’ll build today. So if you’re not quite familiar with it, consider reading those blog posts first.

## Initial Setup

### Tooling

For our purposes, using [BuckleScript][] (plus [webpack][] for bundling the resulting assets) is enough. If you want to integrate your modules into a larger JavaScript app, you can use the compiled `.bs.js` files.

Let’s start by installing the necessary tools:

```shell
yarn init
yarn add -D bs-platform
```

### Set Up `bsconfig.json`

For BuckleScript to recognize the APIs we’ll use, namely the [Web API][] and the [PDF.js API][], we’ll borrow the bindings available as npm packages:

```shell
yarn add pspdfjs-dist
yarn add -D bs-webapi bs-pdfjs
```

BuckleScript uses a settings file similar to `package.json`. We need to set it like this for our experiment:

```js
{
  "name": "open-pdf-with-reasonml",
  "sources": [
    "src"
  ],
  "package-specs": [{
    "module": "commonjs",
    "in-source": true
  }],
  "suffix": ".bs.js",
  "namespace": true,
  "bs-dependencies": [
    "bs-webapi",
    "bs-pdfjs"
  ],
  "refmt": 3
}
```

### Set Up `index.html`

Before we dive into the viewer implementation, we’re going to lay down a minimal HTML skeleton for our application directly in our `dist` folder. We’ll use the [CDN-hosted version of PDF.js from unpkg][], but this file could also be downloaded and hosted locally:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Open PDF with ReasonML example</title>
</head>
<body>
<div id="app">
  <canvas><canvas>
</div>
<script src="https://unpkg.com/pdfjs-dist@2.0.489/build/pdf.min.js"></script>
<script src="main.js"></script>
<script>
  initPDFViewer([’assets/default.pdf'], document.querySelector('#app'));
</script>
</body>
</html>
```

### Set Up ReasonPDFjs.re

This is the tricky part of the task: We need to call the necessary functions from the Web API and the PDF.js API for BuckleScript to be able to compile our code into common JavaScript.

So first we’ll create an `initPDFViewer` function that accepts the URL of a PDF file. Since PDF.js will fetch the PDF file making an AJAX request, our viewer needs to run on a web server. Otherwise, the browser will block the request for security reasons.

Inside `initPDFViewer`, we get the document, save a reference to its instance and the count of the pages, and render the first page:

```js
open Webapi;

let initPDFViewer = (pdfURL, container) => {
  // Get the document with the PDF.js `getDocument` method.
  let documentPromise = BsPdfjs.Global.inst |> BsPdfjs.Global.getDocument(pdfURL);
  documentPromise
  |> Js.Promise.then_(document => {
      // Get the document's first page.
       let pagePromise = document |> BsPdfjs.Document.getPage(1);
       pagePromise
       |> Js.Promise.then_(page => {
            // Get the viewport.
            let pdfViewport: BsPdfjs.Viewport.t =
              BsPdfjs.Page.getViewport(
                ~scale=
                  container##offsetWidth
                  /. BsPdfjs.Viewport.width(BsPdfjs.Page.getViewport(~scale=1., ~rotate=0., page)),
                ~rotate=0.,
                page,
              );
            // Get the canvas element from the current browser page.
            let canvas =
              switch (Dom.document |> Dom.Document.querySelector("canvas")) {
              | None =>
                print_endline("cant get canvas\n");
                failwith("fail");
              | Some(el) => el
              };
            // Get the canvas context.
            let context = CanvasRe.CanvasElement.getContext2d(canvas);
            // Set the canvas dimensions to those of the viewport.
            canvas |> Dom.Element.setAttribute("width", string_of_float(BsPdfjs.Viewport.width(pdfViewport)));
            canvas |> Dom.Element.setAttribute("height", string_of_float(BsPdfjs.Viewport.height(pdfViewport)));
            // Render the page in the canvas.
            BsPdfjs.Page.render(page, ~canvasContext=context, ~viewport=pdfViewport, ~transform=Js.Option.some([||]))
            |> ignore;
            Js.Promise.resolve(page);
          })
       |> ignore;
       Js.Promise.resolve(document);
     });
};
```

The above consists of only a few lines of code, but it can take a long time to get them to work until you determine how to make the calls the ReasonML way.

Now we will add an `index.js` file that will import the compiled `ReasonPDFjs.bs.js` file and assign the function to the global `window` object:

`src/index.js`

```js
window.initPDFViewer = require("./ReasonPDFjs.bs").initPDFViewer;
```

We cannot run this file in the browser, as `require` is not available there. But just adding webpack to our toolset will help us create a bundle our browser can run. So let’s set it up in our `package.json` file along with [serve][], which we will use to access our demo locally:

`package.json`

```js
{
  "name": "open-pdf-with-reasonml",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "build": "bsb -make-world && webpack",
    "start": "serve ./dist",
    "clean": "bsb -clean-world"
  },
  "devDependencies": {
    "webpack": "^4.29.0",
    "webpack-cli": "^3.2.1",
    "bs-pdfjs": "^0.4.0",
    "bs-platform": "^4.0.18",
    "bs-webapi": "^0.13.1"
    "serve": "^10.1.2"
  },
  "dependencies": {
    "pdfjs-dist": "^2.0.943"
  }
}
```

### Compile

Now, let’s install the missing dependencies:

```shell
yarn install
```

Then we’ll compile our ReasonML code to JavaScript and bundle up our compiled code and its dependencies. We will see a bunch of wise, well-intentioned warnings which will not prevent us from getting the result we want at this point:

```shell
yarn build
```

### Run

Now we just need to serve our content:

```shell
yarn start
```

And then we need to open `http://localhost:5000` to see our ReasonML PDF viewer in action!

## Conclusion

Over the course of this post, we have gone through the process of setting up a simple PDF viewer using ReasonML and PDF.js without any additional frontend framework. Once we got ReasonML to play with PDF.js by means of the corresponding bindings, the task wasn’t as overwhelming we thought it would be.

You can check out this example [here][reasonml example].

And if you also want to have a look at how a full-blown, feature-rich PDF viewer and annotator looks and works, don’t hesitate to go straight to our [live demo][]! If you find it might fit your needs, you can [request a trial license and try it out][]!

[reasonml]: https://reasonml.github.io/
[reasonreact]: https://github.com/reasonml/reason-react
[pspdfkit]: http://pspdfkit.com
[pdf.js]: https://mozilla.github.io/pdf.js/
[how to use it to render pdf files in the browser]: https://pspdfkit.com/blog/2018/render-pdfs-in-the-browser-with-pdf-js/
[how to use it to build simple interfaces]: https://pspdfkit.com/blog/2019/implement-pdf-viewer-pdf-js/
[bucklescript]: https://bucklescript.github.io/
[webpack]: https://webpack.js.org/
[web api]: https://github.com/reasonml-community/bs-webapi-incubator
[pdf.js api]: https://github.com/literal-io/bs-pdfjs
[cdn-hosted version of pdf.js from unpkg]: https://unpkg.com/pdfjs-dist@2.0.489/build/pdf.min.js
[serve]: https://github.com/zeit/serve
[reasonml example]: https://github.com/PSPDFkit/open-pdf-with-reasonml
[live demo]: https://web-examples.pspdfkit.com
[request a trial license and try it out]: http://pspdfkit.com/try
