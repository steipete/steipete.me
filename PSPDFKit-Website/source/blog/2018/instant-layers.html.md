---
title: "Instant Layers — Multiple Users Annotate One Document"
description: "Simplify managing multiple versions of a document with this one weird trick."
preview_image: /images/blog/2018/instant-layers/instant-layers.png
preview_video: /images/blog/2018/instant-layers/instant-layers.mp4
section: blog
author:
  - Peter Steinberger
author_url:
  - https://twitter.com/steipete
date: 2018-05-31 13:10 UTC
tags: Instant, Android, iOS, Products
published: true
cla: instant
---

Instant is an on-premises server that shares documents and annotations between multiple users and devices, and it was initially [launched in July of 2017](/blog/2017/pspdfkit-instant/). Since then, we’ve been constantly improving our real-time collaboration engine and are thrilled to announce support for Instant layers, a feature for efficiently and conveniently managing multiple versions of a document.

READMORE

Instant layers was first introduced in [PSPDFKit Server 2017.9](/blog/2017/pspdfkit-web-2017-9/). With the release of [PSPDFKit 7.6 for iOS](/blog/2018/pspdfkit-ios-7-6/), [PSPDFKit 4.6 for Android](/blog/2018/pspdfkit-android-4-6/), and [PSPDFKit Server 2018.3](/blog/2018/pspdfkit-web-2018-3/), we have brought Instant layers to all major platforms.

## What Is Instant Layers?

An Instant layer is a container for annotations on a specific PDF document. For everyone with write access to this container, the layer provides an editing context for the annotations it contains. People who only have read access to a layer may still download and view the document with all the annotations in the container. They will, however, not be able to make any changes to those annotations.

Instant layers is particularly useful for implementing review workflows where several parties are invited to provide feedback on a document independent of one another. While this was possible before, it required creating an individual copy of a document in PSPDFKit Server for each party who should have access. Apart from being tedious, this came with some technical downsides:

- Cloned documents are independent of each other. Unless you used a special convention when generating document identifiers, there was nothing that grouped clones together.
- If someone needed to access several clones of a document, each clone would take up additional storage space on their devices. And because PDF files can be quite large, this easily added up.

In its current form, Instant layers solves both of these problems:

- A layer is tied to a specific document using the document identifier — this provides a natural grouping.
- Because all layers with the same document identifier can share the same PDF file, adding a layer is cheap in terms of storage and bandwidth — on the clients as well as on the server.

## Taking Advantage of Instant Layers

![](/images/blog/2018/instant-layers/instant-layers.png)

Every document has at least one layer: the default layer. If you’re running PSPDFKit Server 2017.9 or newer, you are already using the default layer. And our [PSPDFKit for Web demo](https://web-preview.pspdfkit.com/) uses layers to minimize storage requirements on our server.

To grant access to a non-default layer, your JSON Web Tokens (JWTs) need to include the name of that layer under the [`layer` claim](/guides/server/current/pspdfkit-server/client-authentication/). We have added new APIs to the Instant client objects on iOS and Android, which gives you a document descriptor matching the information encoded in the JWT. Because we want to extend this functionality further without having to break public APIs, all previous APIs to obtain a document descriptor have been deprecated and will be removed in a future version.

## Outlook

![](/images/blog/2018/instant-layers/instant-layers-merged.png)

Currently, Instant allows viewing and editing a single layer at a time via the document class that you know and love. A future update will introduce capabilities to display and toggle the visibility of more than one layer at a time. This will allow fine-grained access control for advanced collaboration workflows.

When collaborating on a document, each user will be able to decide which of their annotations should be shared with their peers and which ones should be kept private, depending only on which layer contains the annotation. They will still be able to seamlessly see and edit all of these annotations without having to switch between documents, but they can choose to see just their own or just the shared ones by toggling visibility of the corresponding layer(s). Whenever necessary, each user will be able to share some annotations with _some_ of their peers by moving those annotations to a new layer that is only accessible to these specific people. At any point, they will be able to share or “unshare” an annotation by moving it from their private layer to a shared one or vice versa.

## Adopting Instant

Instant is available for iOS, macOS, Android, and Web. It’s the fastest option for keeping data in sync when your users work with multiple devices and platforms, and it’s perfectly integrated into PSPDFKit. Instant coordinates everything via an on-premises server that can conveniently be set up via Docker, which supports all major platforms. See our [Server guide](/guides/server/current/pspdfkit-server/example-projects/) for information on how to get started.
