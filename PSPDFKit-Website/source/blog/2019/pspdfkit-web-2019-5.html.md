---
title: "PSPDFKit for Web 2019.5"
preview_image: /images/blog/2019/pspdfkit-web-2019-5/article-header.png
description: "Announcing PSPDFKit for Web 2019.5! This release introduces our new Form Designer component and supports embedded JavaScript in PDF files on Standalone."
preview_video: /images/blog/2019/pspdfkit-web-2019-5/features.mp4
section: blog
author:
  - Luna Graysen
  - Philipp Spiess
author_url:
  - https://twitter.com/lunalovesbirds
  - https://twitter.com/PhilippSpiess
date: 2019-09-09 10:00 UTC
tags: Web, Products
cta: web
published: true
---

We are pleased to announce PSPDFKit for Web 2019.5! This release introduces our new Form Designer component, supports embedded JavaScript in PDF files on Standalone, and is distributed via Docker Hub and npm. Please refer to our [Server][server changelog] and [Web][web changelog] changelogs for a complete list of features and bug fixes.

## Form Designer

We are excited to introduce Form Designer, a new component for PSPDFKit for Web. With Form Designer, you can now build workflows in which your end users can create and edit PDF form elements. In fact, one of our customers already successfully implemented a new signing workflow using Form Designer. Their use case involves one user (the “sender”) preparing a document for signing by adding signature fields and sending it out to one or many “signer(s).”

<video src="/images/blog/2019/pspdfkit-web-2019-5/form-designer.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

The Form Designer component enables an extensive set of APIs for creating and editing various PDF widget types — including text fields, check boxes, and signatures — and is available for both Standalone and Server-backed deployments.

You can build your own customized UI using our API, and we also have sample code available as a private preview. Please email us at [early-access@pspdfkit.com][] if you are interested in developing on top of our Form Designer component. We’d love to hear about your use case and talk about how you can best leverage Form Designer for it.

## JavaScript for Standalone Deployments

Some interactive PDF forms use embedded JavaScript to add custom validation rules, calculations, or other interactive functionality. We’re excited to bring support for these JavaScript features to PSPDFKit for Web Standalone.

<video src="/images/blog/2019/pspdfkit-web-2019-5/javascript.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

We are using a custom, sandboxed JavaScript VM and do not run the embedded JavaScript in the browser directly. Nevertheless, JavaScript embedded in a PDF — much like macros in Microsoft Word files — can lead to behavior that’s surprising and unexpected for users. This is why we decided to let customers choose to opt into executing JavaScript in PDF files. Learn more in the [new JavaScript guide article][javascript guide] about how to enable support. Support for Server-backed deployments is coming in the future, so if you are interested in this, please email us at [early-access@pspdfkit.com][].

## Docker Hub and npm

![](/images/blog/2019/pspdfkit-web-2019-5/dockerhub_npm.png)

To make it easier to integrate PSPDFKit for Web into your existing infrastructure, we’re thrilled to announce that we now publish PSPDFKit on [Docker Hub][] and [npm][]. Existing distribution channels are not affected by this change and will still be supported.

Along with all the new features, this release also includes numerous bug fixes and minor improvements. For a complete list of changes, see the [PSPDFKit for Web 2019.5][web changelog] and [PSPDFKit 2019.5 Server][server changelog] changelogs.

[server changelog]: /changelog/server/#2019.5
[web changelog]: /changelog/web/#2019.5
[early-access@pspdfkit.com]: mailto:early-access@pspdfkit.com
[sales team]: https://pspdfkit.com/sales/
[javascript guide]: https://pspdfkit.com/guides/web/current/features/javascript/
[docker hub]: https://hub.docker.com/r/pspdfkit/pspdfkit
[npm]: https://www.npmjs.com/package/pspdfkit
