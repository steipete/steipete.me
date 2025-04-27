---
title: "PSPDFKit for Web 2020.1"
preview_image: /images/blog/2020/pspdfkit-web-2020-1/article-header.png
description: "Support for Digital Signatures and the new Instant Comments component in PSPDFKit for Web 2020.1."
preview_video: /images/blog/2020/pspdfkit-web-2020-1/features.mp4
section: blog
author:
  - Ritesh Kumar
  - Guillermo Peralta
author_url:
  - https://twitter.com/ritz078
  - https://twitter.com/voluntadpear
date: 2020-02-03 8:00 UTC
tags: Web, Products
cta: web
published: true
---

We are pleased to announce our first release of PSPDFKit for Web in 2020! In PSPDFKit for Web 2020.1, we added two new major features: support for digital signatures in PDF files, and the ability for multiple users to collaboratively comment in real time. These components — Digital Signatures and Instant Comments — can be used both on their own or in concert, allowing for complex interactions in the form of easy-to-use and intuitive workflows.

For example, a user can upload the draft of a contract to share with colleagues. With Instant Comments, they can collaborate in real time, obtaining feedback without any question as to which version of the document is the most recent. Once the necessary changes are made and the final version of the contract is signed using the Digital Signatures component, users can verify the signatures are valid and the document hasn’t been tampered with or altered in any way. But that’s just one example of what’s possible!

## Digital Signatures for PDF Files

Our Digital Signatures component offers a UI to show the validation status of digitally signed documents. Our API gives you complete information about the digital signatures on the document and any issue they might present. You can bring your own set of certificates and private keys to be used for validation and signing PDFs.

<video src="/images/blog/2020/pspdfkit-web-2020-1/digital-signatures.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

_In the above example, we first create an ink signature and then press Finish Signing to digitally sign the document._

[Digital signatures][digital signatures post] are used to assert and verify the authenticity of PDF files. [They are reliable cryptographic proof][wikipedia definition] that a document has been created by a known sender (authentication) and has not been altered since signing (integrity).

Digitally signed documents can be validated with any standards-compliant PDF viewer — from Adobe Acrobat, to our SDKs for Web, iOS, Windows, and Android.

The full range of digital signature options is available for both Standalone and Server-backed deployments. Visit [our related guide][digital signatures guide] to learn more.

## Instant Comments

Instant Comments extends our collaboration functionality to allow you to build workflows where multiple users can discuss specific sections in a document and receive updates in real time, all thanks to our Instant engine. For more information about Instant Comments, please see the [Introduction to Instant Comments][instant comments guide] guide.

<video src="/images/blog/2020/pspdfkit-web-2020-1/instant-comments.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

In addition to the web UI, Instant Comments is also available programmatically through our Server APIs. You can read more about this in the [Instant Comments][comments server api] guide.

## And More

This release also includes numerous bug fixes and minor improvements. For a complete list of changes, see the [PSPDFKit for Web 2020.1][web changelog] and [PSPDFKit Server 2020.1][server changelog] changelogs, as well as the migration guides for [PSPDFKit for Web 2020.1][web migration] and [PSPDFKit Server 2020.1][server migration].

Please email us at [hello@pspdfkit.com][] if you are interested in developing using Digital Signatures and/or Instant Comments. We’d love to hear about your use case and discuss how to best implement it.

[server changelog]: /changelog/server/#2020.1
[web changelog]: /changelog/web/#2020.1
[hello@pspdfkit.com]: mailto:hello@pspdfkit.com
[javascript guide]: https://pspdfkit.com/guides/web/current/features/javascript/
[web migration]: https://pspdfkit.com/guides/web/current/migration-guides/2020-1-migration-guide/
[server migration]: https://pspdfkit.com/guides/server/current/migration-guides/2020-1-migration-guide/
[instant comments guide]: https://pspdfkit.com/guides/web/current/comments/introduction-to-instant-comments/
[digital signatures guide]: https://pspdfkit.com/guides/web/current/digital-signatures/digital-signatures-on-web/
[comments server api]: https://pspdfkit.com/guides/server/current/server-api/comments/
[digital signatures post]: https://pspdfkit.com/blog/2019/electronic-signatures-on-pdf/
[wikipedia definition]: https://en.m.wikipedia.org/wiki/Digital_signature
