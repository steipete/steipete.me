---
title: "Add a Watermark to a PDF on the Web"
description: "How to add a watermark to a PDF on the web."
preview_image: /images/blog/2019/add-watermark-pdf-web/article-header.png
section: blog
author:
  - Giuseppe Gurgone
author_url:
  - https://twitter.com/giuseppegurgone
date: 2019-06-11 8:00 UTC
tags: Web, Development, JavaScript
published: true
secret: false
---

Say you want to add a watermark to your PDF document, maybe before printing it out, and you don’t want to modify pages by hand.

Well, we’ve got you covered. In this blog post, you’ll learn how to add a watermark to every page of a PDF document (or a subset of it) automatically and directly from the browser with [PSPDFKit for Web][].

In our example, we’re adding text that reads Confidential on top of each page of the document. You can see the final result below.

<iframe src="https://codesandbox.io/embed/lpvx39r8lm?autoresize=1&fontsize=14&hidenavigation=1&view=preview" title="Add watermark to PDF" style="width:100%; height:700px; margin-bottom: 3em; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

This method allows you to display and print documents with watermarks. Please note, however, that watermarks are not persisted in the actual PDF file.

You can try the example with your own PDF document [here][codesandbox].

Just follow [the link][codesandbox], upload your document in the `assets` folder that you can find on the left, and then edit the `filename` variable and the `addWatermark` function in `index.js`.

## How It Works

To render and add a watermark to a document, we will use [PSPDFKit for Web][] — a feature-rich PDF viewer and SDK for the web.

By leveraging the `RenderPageCallback` API, we are able to draw content on every page’s `canvas`:

```es
function addWatermark(ctx, pageIndex, pageSize) {
  // Add a Confidential watermark on the page.
  ctx.translate(pageSize.width / 2 - 325, pageSize.height / 2 + 250);
  ctx.rotate(-0.25 * Math.PI);

  ctx.font = "90px Arial";
  ctx.fillStyle = "rgba(76, 130, 212,.2)";
  ctx.fillText("CONFIDENTIAL", 100, 50);
}
```

You can read more about this API in [our guides][].

`ctx` is the canvas 2D context, and it allows you to use any of the [CanvasRenderingContext2D][] methods.

Although we are not using it in this example, we also get the current `pageIndex`, which we could use to, for example, skip a page.

## Running the Example on Your Computer

To run [PSPDFKit for Web][] locally, you need an installation key and a license key.

If you don’t have these already, you can request them on [our website][]. Make sure you tick the Web checkbox, and then open the confirmation email, which contains the link that will give you access to your trial license.

Simply follow the [PSPDFKit for Web][] link and choose Standalone > Download Client to get your npm key (`NPM_KEY`), and then choose Standalone > Integrate Client to get your license key (`LICENSE_KEY`) for use with the SDK.

Now that you have an npm key, you can install PSPDFKit with npm:

```shell
npm i https://customers.pspdfkit.com/npm/TRIAL-your-npm-key-goes-here/latest.tar.gz
```

Or, you can download it using the following URL:

```
https://customers.pspdfkit.com/npm/TRIAL-your-npm-key-goes-here/latest.tar.gz
```

Once you’ve obtained the package, you can copy [the source code of our example][codesandbox] and the `dist` folder from the PSPDFKit package to a local folder on your computer.

Now change `index.html` to point to the local version of PSPDFKit:

```diff
<!-- index.html -->
<body>
  <div id="app"></div>

-  <script src="https://web-preview-server.pspdfkit.com/pspdfkit.js"></script>
+  <script src="./dist/pspdfkit.js"></script>
  <script src="./index.js"></script>
</body>
```

Make sure you add your license key to `index.js` as well:

```diff
// index.js
PSPDFKit.load({
  pdf: filename,
  renderPageCallback: addWatermark,
  printMode: PSPDFKit.PrintMode.DOM,
  container: "#app",
+  licenseKey: "YOUR LICENSE GOES HERE"
});
```

Now you’re all set! Just serve the project folder with a local webserver — for example, `python -m SimpleHTTPServer 8080` — or use [`serve`][].

## Conclusion

Adding a watermark to a PDF for the purpose of printing or displaying is very straightforward with [PSPDFKit for Web][].

The Standalone, WebAssembly-based version of [PSPDFKit for Web][] includes this functionality and doesn’t require any complex backend infrastructure to operate.

With powerful and easy-to-use APIs like `RenderPageCallback`, [PSPDFKit for Web][] can be the right solution if you need to integrate or work with PDFs in your applications.

For more examples, please visit our [live Catalog application][].

[our website]: https://pspdfkit.com/try/
[our guides]: https://pspdfkit.com/guides/web/current/features/watermarks/
[pspdfkit for web]: https://pspdfkit.com/pdf-sdk/web/
[live catalog application]: https://web-examples.pspdfkit.com
[codesandbox]: https://codesandbox.io/s/lpvx39r8lm
[canvasrenderingcontext2d]: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#Reference
[`serve`]: https://npmjs.org/package/serve
