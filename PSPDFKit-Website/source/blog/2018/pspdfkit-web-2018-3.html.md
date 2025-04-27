---
title: "PSPDFKit for Web 2018.3"
description: "Announcing PSPDFKit for Web 2018.3, which introduces ink signatures, password-protected PDF unlocking, and combined touchscreen and mouse support."
preview_image: /images/blog/2018/pspdfkit-web-2018-3/article-header.png
preview_video: /images/blog/2018/pspdfkit-web-2018-3/features.mp4
section: blog
author:
  - Giuseppe Gurgone
author_url:
  - https://twitter.com/giuseppegurgone
date: 2018-05-31 09:00 UTC
tags: Web, Products
cta: web
published: true
---

We are pleased to announce PSPDFKit for Web 2018.3, which introduces ink signatures, password-protected PDF unlocking, and combined touchscreen and mouse support.

Please refer to our [Server][server changelog] and [Web changelogs][web changelog] for a complete list of features and bug fixes.

## Ink Signatures

Last year we introduced support for filling out PDF forms. This feature enabled the development of powerful new applications that can have a real impact on the productivity of many of our customers’ employees and clients.

Additionally, people are often required to sign digital documents like PDFs, so today we are taking things one step further with the introduction of ink annotation signature support for Web.

Signatures can be created with our responsive-, touch-, and mouse-friendly UI and can even be stored for reuse.

<video src="/images/blog/2018/pspdfkit-web-2018-3/signatures.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Password-Protected PDFs

PDF is one of the world’s most important file formats, and it is used every day to share a diverse range of documents. And sometimes, PDF files contain sensitive information.

For this reason, PDF documents can be encrypted with a password and effectively secured against unauthorized users trying to access the document.

Up until this point, PSPDFKit for Web only supported non-encrypted documents. However, many of our customers integrate PSPDFKit for Web in applications where privacy and security are really important and there is a need for documents to be password protected.

Since we take security very seriously, we worked hard over the past few weeks to add support for the processing of encrypted documents in PSPDFKit for Web, a feature that we’re happy to introduce today.

Thanks to our simple API, the password for the PDF document can be set via the initial `Configuration#password` option:

[==

```es
PSPDFKit.load({
  password: "secr3t",
  // ...,
});
```

```js
PSPDFKit.load({
  password: "secr3t"
  // ...
});
```

==]

When set, PSPDFKit for Web will try to unlock a PDF with the provided password when loading it. PDFs that do not require a password will continue to work as normal.

When the password is incorrect or not set in the `Configuration` object, then PSPDFKit for Web displays a dialog prompting the user to input the password to unlock the document.

<video src="/images/blog/2018/pspdfkit-web-2018-3/password.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Password protection also works when using PSPDFKit Server and its APIs to manage your documents. Passwords supplied via `PSPDFKit.load` or entered by the user will automatically be sent to the Server on authentication. Alternatively, you can also add the `password` claim to your JWT:

[==

```es
jwt.sign(
  {
    document_id: document_id,
    password: "secr3t"
    // ...
  },
  fs.readFileSync("./jwt.pem"),
  {
    algorithm: "RS256",
    expiresIn: 10 * 365 * 24 * 60 * 60 // 10yrs
  }
);
```

```js
jwt.sign(
  {
    document_id: document_id,
    password: "secr3t"
    // ...
  },
  fs.readFileSync("./jwt.pem"),
  {
    algorithm: "RS256",
    expiresIn: 10 * 365 * 24 * 60 * 60 // 10yrs
  }
);
```

==]

To access password-protected PDFs via upstream API calls, add the `pspdfkit-pdf-password` header. You can read more about Server-side password-protected PDF support in our [guides](/guides/server/current/pspdfkit-server/password-protected-pdfs).

## Combined Touchscreen and Mouse Support

![](/images/blog/2018/pspdfkit-web-2018-3/mousetouch.png)

Today we are also rolling out a smaller yet useful feature that enables support for devices that have both touch and mouse capabilities.

With PSPDFKit for Web 2018.3, it is now possible to seamlessly switch between touchscreen and mouse. This has been one of the most requested features from our Microsoft Surface customers.

PSPDFKit for Web automatically detects and handles the right device at any given point in time to provide the expected experience immediately.

## Conclusion

Today’s major release includes three features our customers have asked for the most: ink signatures, support for password-protected PDFs, and combined touchscreen and mouse support.

To complement the features, we have released comprehensive guides about [ink signatures](/guides/web/current/features/signatures/) and how to configure PSPDFKit Server to handle password-protected documents.

This release also includes a number of bug fixes and minor improvements. For a complete list of changes, see the [PSPDFKit for Web 2018.3][web changelog] and [PSPDFKit for Server 2018.3][server changelog] changelogs.

[server changelog]: /changelog/server/#2018.3
[web changelog]: /changelog/web/#2018.3
[unlock endpoint]: /guides/server/current/api/documents/#unlock-a-document
