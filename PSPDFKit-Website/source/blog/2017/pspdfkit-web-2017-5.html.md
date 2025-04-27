---
title: "PSPDFKit for Web 2017.5"
description: Announcing PSPDFKit for Web 2017.5, introducing standalone deployment and a richer JavaScript API
preview_image: /images/blog/2017/pspdfkit-web-2017-5/pspdfkit-for-web-2017_5.png
section: blog
author:
  - Giuseppe Gurgone
  - Philipp Spiess
author_url:
  - https://twitter.com/giuseppegurgone
  - https://twitter.com/PhilippSpiess
date: 2017-07-17 12:00 UTC
tags: Web, Products
published: true
---

With the release of PSPDFKit for Web 2017.5, we are introducing an all new standalone mode. Previously, PSPDFKit for Web only supported server-backed deployments. As of today, you now have the option of deploying PSPDFKit for Web without a server, using state-of-the-art WebAssembly to render PDF documents directly in the browser. Also in this release, we made significant improvements to our JavaScript API to work with annotations. A list of all the included fixes and performance improvements can be found in our [changelog][].

READMORE

## Introducing Standalone Deployment

Previously, the only way to deploy PSPDFKit for Web was to set up our dedicated server component. Deploying PSPDFKit for Web with the server has benefits, such as the option to enable streaming of PDF pages efficiently since the server can decide which parts of a document need to be delivered to the user instead of downloading the entire document. The server component also handles annotations management, so that you do not have to worry about it and comes with our [fully featured HTTP API][].

In some cases, however, deploying and maintaining a dedicated server component is not feasible. To ensure all our customers may still enjoy the benefits of the PSPDFKit for Web experience no matter the chosen deployment method, we’re proud to announce our newest feature: standalone deployment using state-of-the-art WebAssembly technology.

With this deployment option, the rendering workload is offloaded to the clients. Use this option to render PDF documents before uploading to a server or when it’s not possible to maintain a dedicated server component.

<img src="/images/blog/2017/pspdfkit-web-2017-5/pspdfkit-loves-wasm.png" alt="PSPDFKit loves WebAssembly" />

With client side rendering we no longer enforce the setup of a server component when deploying PSPDFKit for Web. Instead, the standalone deployment option comes with a couple of additional artifacts - [WebAssembly][] and [asm.js][] files that are used to render the PDF document within a web worker in your browser.

At PSPDFKit, we strongly believe in the future of WebAssembly, which is why we are proud to publish one of the first commercially available web products that utilize this new technology. WebAssembly is a new technology that is supported [by all major browsers](https://lists.w3.org/Archives/Public/public-webassembly/2017Feb/0002.html) and allows developers to compile native code (e.g. C, C++) and run it in a web browser. For older web browsers, we gracefully fall back to [asm.js][]. If you’re interested in WebAssembly and in how we employ it, subscribe to our blog for more information coming in the following weeks. In the mean time, you can try it out [here](https://web-preview.pspdfkit.com/standalone/1).


For PSPDFKit for Web, this means that our product now ships with additional artifacts including: `pspdfkit.wasm` and `pspdfkit.asm.js`. Those files contain a native library that the PSPDFKit for Web client can download and use to render PDF documents. This way, creating a new viewer instance no longer requires our server component but the framework can fetch the PDF file directly (using an Ajax request) or initialize a new instance provided a document as `ArrayBuffer`.

[==

```es
PSPDFKit.load({
  pdf: "https://example.com/path/to/document.pdf",
}).then(instance => {
  console.log(instance);
});
```

```js
PSPDFKit.load({
  pdf: "https://example.com/path/to/document.pdf",
}).then(function (instance) {
  console.log(instance);
});
```

==]

Standalone rendering is available on all active PSPDFKit for Web purchases and can be downloaded starting today from our [Customer Portal](https://customers.pspdfkit.com).

## Instant JSON

The release of the standalone deployment option also marks the release of Instant JSON to store PDF changes such as annotations into a separate JSON file. This means that a PDF document will only need to be transferred once and all changes (e.g., annotations) are added as an overlay to the existing PDF. This approach significantly reduces the bandwidth since you only need to transfer this JSON instead of the complete PDF.

Integrating Instant JSON into your existing backend is simple. Since this is where you want to store revisions of a PDF document, you now store very small JSON documents which contain only the PDF metadata (annotations, etc.) rather than saving multiple copies of the entire PDF file. This format currently includes updated, deleted or added annotations and will soon be expanded with other features like bookmarks.

Instant JSON is fully compatible with [PSPDFKit Instant](https://pspdfkit.com/instant) allowing your existing standalone deployment to easily be upgraded to an Instant installation.

For more information, please check out [the guide article explaining Instant JSON](https://pspdfkit.com/guides/web/current/importing-exporting/instant-json/).

## Richer JavaScript API

<img src="/images/blog/2017/pspdfkit-web-2017-5/improved-docs.png" alt="PSPDFKit for Web 2017.5 exposes a lot more in the API documentation" style="max-width: 600px" />

Another large improvement in this major release of our PDF library is the new and extensive JavaScript API. It is now possible not only to create, update, read, or delete annotations with using a JavaScript API, but also to control when annotation changes are persisted to the server (or in memory, if you’re using the standalone mode).

The following code shows an example of how to programmatically add an [`InkAnnotation`](https://pspdfkit.com/api/web/PSPDFKit.Annotations.InkAnnotation.html) to the first page of your PDF document:

[==

```es
const { List, Rect } = PSPDFKit.Immutable
const { DrawingPoint } = PSPDFKit.Geometry
const { InkAnnotation } = PSPDFKit.Annotations

PSPDFKit.load(configuration).then(async (instance) => {
  var annotation = new InkAnnotation({
    pageIndex: 0,
    boundingBox: new Rect({ width: 100, height: 100 }),
    lines: List([
      List([
        new DrawingPoint({ x: 0,   y: 0  }),
        new DrawingPoint({ x: 100, y: 100}),
      ])
    ])
  });

  const createdAnnotation = await instance.createAnnotation(annotation);
  // ...
});
```

```js
PSPDFKit.load(configuration).then(function(instance) {
  var annotation = new PSPDFKit.Annotations.TextAnnotation({
    pageIndex: 0,
    boundingBox: new PSPDFKit.Geometry.Rect({ width: 100, height: 100 }),
    lines: PSPDFKit.Immutable.List([
      PSPDFKit.Immutable.List([
        new PSPDFKit.Geometry.DrawingPoint({ x: 0,   y: 0  }),
        new PSPDFKit.Geometry.DrawingPoint({ x: 100, y: 100}),
      ])
    ])
  });

  instance.createAnnotation(annotation).then(function(createdAnnotation) {
    // ...
  });
});
```

==]

With the introduction of this API, we also published our internal annotation classes and geometry library. Documentation can be found [in our guides](https://pspdfkit.com/guides/web/current/annotations/introduction-to-annotations/) or our [API documentation](https://pspdfkit.com/api/web/).

## Bundle PSPDFKit for Web in Your Code Using the New Npm Installation

PSPDFKit for Web is now available as an npm package and distributed as universal module (UMD) to all our customers.

The package is securely hosted on our servers and can be downloaded from our [customer portal](https://customers.pspdfkit.com/).
Command line installation via `npm` or `yarn` is also possible.

Once the package is installed, you can refer to it as `pspdfkit` and require it in your main application:

[==

```es
// src/index.js
import PSPDFKit from "pspdfkit";

PSPDFKit.load(...);
```

```js
// src/index.js
var PSPDFKit = require("pspdfkit");

PSPDFKit.load(...);
```

==]

Please refer to [our guide](https://pspdfkit.com/guides/web/current/standalone/adding-to-your-project/) for detailed installation instructions.


## Support for S3-Compatible Object Storage

On the server-side, this release adds support for [configuring different asset storage backends](https://pspdfkit.com/guides/server/current/configuration/asset-storage/). PSPDFKit Server previously only supported storing PDFs and attachments (images, etc) on a local Docker volume.

With 2017.5 you can now use any [Amazon S3](https://aws.amazon.com/s3/) compatible object storage provider, like [Google Cloud Storage](https://cloud.google.com/storage/docs/interoperability) or [Minio](https://www.minio.io), making it easier to integrate PSPDFKit for Web with your existing infrastructure.

[changelog]: /changelog/web/
[fully featured HTTP API]: https://pspdfkit.com/guides/server/current/api/overview/
[asm.js]: http://asmjs.org/faq.html
[WebAssembly]: http://webassembly.org/
