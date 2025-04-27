---
title: "PSPDFKit for Web 2017.7"
description: "Announcing PSPDFKit for Web 2017.7, Supporting Horizontal Scaling, Externally Managed Documents, and an Improved Printing System"
preview_image: /images/blog/2017/pspdfkit-web-2017-7/multiple-server-support.png
section: blog
author:
  - Philipp Spiess
  - Giuseppe Gurgone
  - Maximilian Störchle
  - Silvio Doblhofer
author_url:
  - https://twitter.com/PhilippSpiess
  - https://twitter.com/giuseppegurgone
  - https://twitter.com/max_hoyd
  - https://twitter.com/sido378
date: 2017-10-25 12:00 UTC
tags: Web, Products
cta: web
---

We are proud to announce the release of PSPDFKit for Web 2017.7. This release includes a variety of new Server features, including support for horizontal scaling and adding externally managed documents. On the front end, we introduce an improved printing system, greatly reduced loading times for subsequent Standalone initializations, and more. Please refer to our [Server][Server Changelog] and [Web changelogs][Web Changelog] for a complete list of features and bug fixes.

As always, we’ve prepared a comprehensive guide to make it easy for you to upgrade. Check out our [2017.7 Migration Guide](https://pspdfkit.com/guides/web/current/migration-guides/2017-7-migration-guide/).

## Horizontal Scaling Support

<video src="/images/blog/2017/pspdfkit-web-2017-7/multiple-server-support.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

From the beginning, we’ve built PSPDFKit Server with performance in mind, and today, one node can already serve real-time updates to tens of thousands of connected clients. But we wanted to go one step further and ensure our customers have the possibility to scale their PSPDFKit Server infrastructure according to their needs. That’s why we’ve added horizontal scaling with our newest version of PSPDFKit Server. Whenever you connect a new PSPDFKit Server node to your database, it will automatically receive and broadcast all changes made to your documents. All you need is a load balancer to distribute traffic along your nodes and ensure your clients get all the performance they need. Your clients will always stay up to date, no matter which node they are connected to.

Have a look at our [guides][horizontal-scaling guide] to find out how to use this feature.

## Storing Assets in Your Database

We previously required you to specify one of two asset storages: S3, or local Docker volumes. While both options are great, we realized it creates additional friction when setting up the system to work correctly. You also already have a component in your PSPDFKit Server setup that can handle large amounts of data just fine: The Postgres Database. With this release, we’re adding a new asset storage option that can utilize the full power of Postgres to persist all assets. Because it’s so easy to use, we decided to make this the default for new installations.

At the same time, we are deprecating the old local asset storage backend. Please check our [guides][storageMigration guide] for information on how to migrate your PSPDFKit Server.

## Add Externally Managed Documents to the Server

To offer an even more flexible solution for working with PDFs, we added an [API endpoint][addurl guide] as well as a dashboard option to add documents from external URLs to PSPDFKit Server. When a document is added like this, the server fetches the PDF from the URL instead of persistently storing it in an asset storage.

This makes it possible to add documents from other services, which expose PDFs with public URLs. All that is needed from the service is a URL that the document can be fetched from.

The above solution allows you to integrate PSPDFKit for Web into your system, even when you already have a document storage solution.

<img src="/images/blog/2017/pspdfkit-web-2017-7/external-url.png" alt="Add Externally Managed Documents To The Server" />

The benefits of this feature are that not only do you gain flexibility with how and where you want to store your documents, but also that you are still able to use all the features from PSPDFKit Server.

For details on how to use the endpoint, take a look at our [guides][addurl guide].

## Simpler Configuration

Our server dashboard will now show you warnings when you use insecure defaults or deprecated values in your server configuration — for instance, if you forget to change your `SECRET_KEY_BASE` from `secret-key-base`. However, from version `2017.8` on, using an insecure or deprecated configuration will lead to your server aborting the startup.

Please check the guides on [migration][storageMigration guide] and [configuration][configuration guide] for details on how to correctly set up your PSPDFKit Server.

## Improved Printing

In order to print documents, PSPDFKit for Web generates the final and most up-to-date PDF file on the server, or in the case of Standalone deployments, in a web worker. Once the document is created, the client tries to use native options to directly send that PDF to the printer.

We call this method `PrintMode.EXPORT_PDF`, and it is a great solution for highly efficient print tasks and quality documents using the vector format of the PDF.

However, since this process exports the PDF, it is possible for your users to access the raw PDF and sensitive information which might be part of it.

This is why we’re going to start offering a new print mode: Today we are **introducing an alternative printing method that we call `PrintMode.DOM`**. It is capable of printing without exposing the raw PDF by rendering pages in advance and sending the rasterized results to the printer. This will completely avoid the PDF step in between: Your users will no longer have access to the source PDF.

<video src="/images/blog/2017/pspdfkit-web-2017-7/print-dom.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Learn how to configure PSPDFKit for Web to use `DOM` or `EXPORT_PDF` mode by reading our [printing guide].

### New Print API

Since PSPDFKit for Web 2016.3, we have been supporting printing of PDF documents to both file and paper via the `print` toolbar button and the `cmd/ctrl-p` shortcut. With PSPDFKit for Web 2017.7, we are adding an API to programmatically [start][print] and [abort][abortPrint] printing jobs as well:

[==

```es
instance.print()
instance.abortPrint()
```

```js
instance.print()
instance.abortPrint()
```

==]

For details and extensive documentation, refer to the [API docs][print] and our [printing guide].

## Fast Standalone Instance Creation

We are very proud of our **[WebAssembly-based Standalone solution][]** since it enables the rendering of PDFs directly in the browser without the need of a server component.

**Our customers love the responsiveness and capabilities of such a technology**. However, due to the time required by the browser to load, compile, and instantiate the WebAssembly/ASM.js module that powers it, opening new documents in PSPDFKit for Web Standalone might take a few seconds because the loading routine has to be repeated every time a new PDF document is loaded.

Modern browsers optimize WebAssembly after the download, which results in the additional initialization time. There’s ongoing work by browser vendors to cache these results, and we’re working hard to use the new optimizations and APIs provided by browser vendors in our product.

In order to provide an outstanding experience to our customers and their users, today **we are shipping a performance optimization** which, after the first loading, will make the creation of subsequent instances of PSPDFKit for Web incredibly fast — almost immediate.

<video src="/images/blog/2017/pspdfkit-web-2017-7/wasm-speed.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

**Documents can now be opened instantly**, as opposed to in the previous versions where the average load time was 8s.

## Updated Icons

Following the trend from our [iOS](https://pspdfkit.com/blog/2017/pspdfkit-ios-7-0/) and [Android](https://pspdfkit.com/blog/2017/pspdfkit-android-4-0/) frameworks, we also have great news for all like-minded design lovers: We took the time to redo most of our icons to build a better, more coherent icon set, which ended up fitting gorgeously into our PDF viewer for Web. We hope that you like them as much as we do.

<img src="/images/blog/2017/pspdfkit-web-2017-7/icons.png" alt="We updated most of our icons" />

## Unload API

Up until this point, instances of PSPDFKit for Web could have been destroyed using the [`Instance#destroy`][] API. But because of this method being available on instances, it was basically impossible to tear down an instance while it was loading.

Thanks to the new `PSPDFKit.unload` API, instances can now be programmatically and safely destroyed at any time — even while PSPDFKit for Web is loading — using the CSS selector, DOM element, or the instance as an identifier:

[==

```es
PSPDFKit.load({ container: '#root' /* … */});

PSPDFKit.unload('#root');
// You can also pass in a reference to the (container) DOM node.
PSPDFKit.unload(document.querySelector('#root'));
// Or the PSPDFKit instance
PSPDFKit.unload(instance);
```

```js
PSPDFKit.load({ container: '#root' /* … */});

PSPDFKit.unload('#root');
// You can also pass in a reference to the (container) DOM node.
PSPDFKit.unload(document.querySelector('#root'));
// Or the PSPDFKit instance
PSPDFKit.unload(instance);
```

==]

Please refer to our [API docs][unload api] for further details.

[WebAssembly-based Standalone solution]: /blog/2017/webassembly-a-new-hope
[Server Changelog]: /changelog/server/#2017.7
[Web Changelog]: /changelog/web/#2017.7
[`Instance#destroy`]: /api/web/PSPDFKit.Instance.html#destroy
[unload api]: /api/web/PSPDFKit.html#.unload
[print]: /api/web/PSPDFKit.Instance.html#print
[abortPrint]: /api/web/PSPDFKit.Instance.html#.abortPrint
[printing guide]: /guides/web/current/features/printing/
[addurl guide]: /guides/server/current/api/documents/#adding-a-document-from-a-url
[horizontal-scaling guide]: /guides/server/current/deployment/horizontal-scaling
[storageMigration guide]: /guides/server/current/migration-guides/2017-7-migration-guide/#migration-instructions
[configuration guide]: /guides/server/current/configuration/overview/
