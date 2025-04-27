---
title: "PSPDFKit 2.6 for Windows"
description: PSPDFKit for the Universal Windows Platform
preview_image: /images/blog/2020/pspdfkit-windows-2-6/header.png
preview_video: /images/blog/2020/pspdfkit-windows-2-6/features.mp4
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2020-02-21 10:00 UTC
tags: Windows, Products, Development
published: true
---

Today we’re shipping PSPDFKit 2.6 for Windows. In this release we've added a major new feature: support for digital signatures in PDF files.

READMORE

## Digital Signatures for PDF Files

Our Digital Signatures component offers a UI to show the validation status of digitally signed documents. Our API gives you complete information about the digital signatures on the document and any issue they might present. You can bring your own set of certificates and private keys to be used for validation and signing PDFs.

![digital-signatures](/images/blog/2020/pspdfkit-windows-2-6/digital-signatures.png)

[Digital signatures][digital signatures post] are used to assert and verify the authenticity of PDF files. [They are reliable cryptographic proof][wikipedia definition] that a document has been created by a known sender (authentication) and has not been altered since signing (integrity).

Digitally signed documents can be validated with any standards-compliant PDF viewer — from Adobe Acrobat, to our SDKs for Web, iOS, Windows, and Android.

An example workflow could be, a user opens a draft of a contract to share with colleagues, fills out form fields, adds an ink signature and then using the Digital Signatures component signs the document so that users can verify the signatures are valid and the document hasn’t been tampered with or altered in any way.

Visit [our related guide][digital signatures guide] to learn more.

## And More

This release also includes numerous bug fixes and minor improvements. For a complete list of changes, see the [PSPDFKit 2.6 for Windows changelog][changelog].

Please email us at [hello@pspdfkit.com][] if you are interested in developing using Digital Signatures. We’d love to hear about your use case and discuss how to best implement it.

[changelog]: /changelog/windows/
[hello@pspdfkit.com]: mailto:hello@pspdfkit.com
[digital signatures guide]: /guides/windows/current/digital-signatures/digital-signatures-on-windows/
[digital signatures post]: /blog/2019/electronic-signatures-on-pdf/
[wikipedia definition]: https://en.m.wikipedia.org/wiki/Digital_signature
