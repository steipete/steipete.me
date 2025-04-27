---
title: "PSPDFKit for Web 2017.3"
description: PSPDFKit for Web 2017.3 with printing and greatly improved CSS customization.
section: blog
author:
  - Philipp Spiess
author_url:
  - https://twitter.com/PhilippSpiess
date: 2017-03-29 12:00 UTC
tags: Web, Products
published: true
---

Today we're releasing the third major update in 2017 for our Web SDK. This release comes with the new printing feature, significantly improved customizability, a new and extended permission system as well as several bug fixes. As always, you can find a complete list of all our changes in the updated [changelog][].

READMORE

This release also adds new deprecations that will break in the next release. Please refer to our [2017.3 Migration guide][] for an in-depth upgrade tutorial and new best practices.

## Printing

It’s now possible to print PDFs via our Javascript SDK. It works by downloading the PDF with the latest annotations on the client. To enable this feature, the `download` permission must be added to allow a client to access the raw PDF.

<a href="/web">
  <img src="/images/blog/2017/pspdfkit-web-2017-3/printing.gif" alt="Printing Preview" />
</a>

If this permission is detected, PSPDFKit for Web will automatically enable the new printing button. If you want to disable the behavior, you can set [`ViewState#allowPrinting`] to `false`.

## Improved CSS customization

With PSPDFKit for Web 2017.3, we significantly improved the CSS customizability by adding several new public class names (several classes you can overwrite). The changes include a brand new [CSS documentation][] section in our API documentation, that feature fully interactive screenshots of various parts of PSPDFKit for Web.

<a href="/api/web">
  <img src="/images/blog/2017/pspdfkit-web-2017-3/interactive_css_documentation.png" alt="Interactive CSS Documentation Preview" />
</a>

The changes we made here go hand in hand with the new stylesheets API. Since PSPDFKit for Web now runs in an isolated container, you can no longer overwrite the CSS rules with the stylesheet on your page. In order to customize the CSS, you need to prepare separate files. You must configure those in PSPDFKit for Web by specifying them in [`Configuration#styleSheets`][].

```js
PSPDFKit.load({
  // ...
  styleSheets: ["https://example.com/my-pspdfkit.css"]
})
  .then(instance => {
    console.info("PSPDFKit loaded", instance);
  })
  .catch(error => {
    console.error(error.message);
  });
```

For a closer look around the CSS customizations, we've updated our [CSS guides][CSS guide] and also included a new sample.

## Deprecating built-in user management

With this release, we're deprecating the built-in user management features of PSPDFKit Server and will remove them in the 2017.4 release.

We noticed an issue that came up repeatedly in support requests: people do not want to have to mirror their access control to PSPDFKit Server, preferring to rely on signed JWT tokens completely instead.

What this means for you: PSPDFKit for Web 2017.3 will still support the HTTP API around user_ids, but you should switch to using a JWT exclusively and use the new permissions key.

Please refer to our [2017.3 Migration guide][] for an in-depth upgrade tutorial and new best practices.

If you're having further questions about this release or anything else, always [feel free to contact us](https://pspdfkit.com/support/request).

[changelog]: /changelog/web/
[`ViewState#allowPrinting`]: /api/web/PSPDFKit.ViewState.html#allowPrinting
[CSS documentation]: /api/web/css-General.html
[`Configuration#styleSheets`]: /api/web/PSPDFKit.Configuration.html#styleSheets
[CSS guide]: /guides/web/current/customizing-the-interface/css-customization/
[2017.3 Migration guide]: /guides/web/current/migration-guides/2017-3-migration-guide/
