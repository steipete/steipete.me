---
title: "Electronic Signatures in a PDF"
description: "Understand the differences between ink electronic signatures and certificate-based digital signatures when designing your screen flow, function, and backend."
preview_image: /images/blog/2019/electronic-signatures-on-pdf/article-header.png
section: blog
author:
  - Sam Fleder
  - Richard Malloy
author_url:
  - https://twitter.com/fleders
  - https://twitter.com/richmalloy12
date: 2019-07-11 8:00 UTC
tags: Products, Security, PDF
published: true
secret: false
---

PDF documents are the accepted standard for legally binding documents in a digital format. PDFs are used to record major real estate deals, hire new employees, submit tax filings, and confirm payment for orders. For an app user to make a purchase, verify their identification, or confirm a receipt, developers are faced with a decision: Which type of electronic signature is needed?

**ℹ️ Note:** This article is not legal advice. If you have legal questions about electronic signatures, you should contact an attorney in your jurisdiction.

## Why and When Is a Signature Needed?

Many countries have laws about [what types of contracts require a signature][statute of frauds]. These can include land sales, long-term agreements, or purchases of goods above a certain cost. More broadly, a person’s signature is often used in a transaction to provide a sense of formality and confidence that the person signing “meant to do what they did,” and to create a reliable record of the transaction.

For centuries, pen (or quill!) and ink signatures were the accepted standard for confirming written agreements. At the beginning of the 21st century, many countries passed laws expressly recognizing the use of electronic records and electronic signatures to form legally binding, reliable contracts ([eIDAS][] in the EU; UETA and [ESIGN][] in the US; [PIPEDA][] in Canada; [IT Act][] in India). [Article 3 of eIDAS][] defines an electronic signature as “data in electronic form which is attached to or logically associated with other data in electronic form and which is used by the signatory to sign.”

Software developers have come up with many different ways to confirm and verify a user’s intended action: button clicks, check boxes, freehand signatures or initials, and unique embedded digital certificates, just to name a few. The [PSPDFKit framework][] provides developers with their choice of the two most popular signature options: “ink” electronic signatures, and certificate-based digital signatures.

## Option 1: Ink Electronic Signatures

Ink signatures involve the user creating a freehand ink annotation using their fingertip, stylus, or mouse. Our [Annotations][] component enables this functionality in PDFs by accepting the drawing as an ink annotation, which can be associated within PDF [AcroForm fields][]. Signature annotations can be stored for repeated use. Upon export, the signature annotations can be flattened into the PDF (this removes the editable layer, but the annotations remain visible).

Ink signatures are widely used in modern software solutions. Users can sign forms and contracts, initial document margins to confirm the content, and establish a record that an action was taken as intended. At PSPDFKit, we provide a user-friendly ink signature solution for PDFs across multiple platforms, as shown below.

### iOS

<video src="/images/blog/2019/electronic-signatures-on-pdf/iOS-ink-signature.mp4"
 poster="/images/blog/2019/electronic-signatures-on-pdf/iOS-ink-signature.png"
 width="100%"
 data-controller="video"
 data-video-autoplay="true"
 controls
 playsinline
 loop
 muted>
</video>

### Web

<video src="/images/blog/2019/electronic-signatures-on-pdf/Web-ink-signature.mp4"
 poster="/images/blog/2019/electronic-signatures-on-pdf/Web-ink-signature.png"
 width="100%"
 data-controller="video"
 data-video-autoplay="true"
 controls
 playsinline
 loop
 muted>
</video>

Many countries have adopted laws that make ink electronic signatures on digital documents legally equivalent to traditional pen-and-ink signatures on physical paper. For example, the ESIGN Act in the US provides that an eSignature is valid as long as:

1. The party consents to using an electronic record;
2. The party intends to sign the record;
3. The party’s signature is attached to or associated with the record; and
4. The record is retained and can be produced if requested.

Even if you do not plan to distribute your app in the US, these elements can be a helpful guideline when including ink signature functionality in your product. Our PSPDFKit framework makes it easy to [create, manipulate, store][], and [permanently apply][] ink signature annotations in a PDF.

## Option 2: Digital Signatures

A digital signature is an algorithm and encryption scheme that establishes the authenticity of a digital document. Essentially, a digital signature acts as a fingerprint that is unique to each user. It verifies the signer’s identity, ensures the signer cannot deny having signed the record, and confirms that the record was not altered in transit. Digital signature usage is increasing in popularity across many different software categories, and although it was originally utilized only in formal, complex legal contracts and banking transactions, the ease of use and decreasing cost barriers to digital signatures are resulting in a much wider utilization of this more secure option.

The [PDF specification][] provides for creation and verification of cryptographically-secure digital signatures through public key infrastructure (PKI), which provides a secure and reliable system of managing and exchanging digital certificates. This system uses a hashing algorithm to generate two long numerical keys: one public and one private. The signing party’s private key is used to create and encrypt a digital signature hash when the PDF is signed, and the hash matches the signed PDF. Often, the digital signature is marked with additional metadata, such as the date and time of signature, the IP address, the speed of signing, and biometric data like method of input, pressure sensitivity, and touch radius.

To ensure that both the document and the keys are valid and secure, third-party organizations called [certificate authorities (CAs)][] issue digital certificates and ensure key security. CAs are vetted and approved by government regulators and/or are accepted within certain industries. The issued certificate includes the public key for a digital signature and confirms that the key belongs to the signing party. CAs issue time-limited certificates. Both the signing party and the receiving/verifying party must use the same CA for a given PDF.

Within your app, a digital signature can be applied to a PDF by means of a registered user inputting an ink signature and password and uploading a certificate. PSPDFKit’s digital signature functionality is easy and intuitive for users — below is an example in iOS.

### iOS

<video src="/images/blog/2019/electronic-signatures-on-pdf/iOS-digital-signature.mp4"
 poster="/images/blog/2019/electronic-signatures-on-pdf/iOS-digital-signature.png"
 width="100%"
 data-controller="video"
 data-video-autoplay="true"
 controls
 playsinline
 loop
 muted>
</video>

PSPDFKit supports the PDF 1.7/2.0 digital signature specification; RSA and ECDSA signing algorithms; and MD4, MD5, and SHA-2 (SHA-224, SHA-256, SHA-384, SHA-512, SHA-512-256) hashing algorithms.

Our frameworks make it easy to add plug-and-play digital signature functionality into your app. [Click here][digital signatures blog] for a detailed walkthrough of how to integrate PSPDFKit’s Digital Signatures feature.

## Option 3: Signatures in Blood on Musty Parchment

As an alternative to ink and digital signatures, this solution was predominantly used by highway thieves and pirates in the 18th century. It is highly disfavored in the modern era, and it is not supported by PSPDFKit frameworks. 😉

## Conclusion

There are many reasons to require a user’s signature within your app. It is critical to understand the distinctions between ink electronic signatures and certificate-based digital signatures when designing your screen flow, function, and backend.

For hand-drawn signatures and initialing, ink signatures are the right choice, and they are easily implemented with our [Annotations][] feature. When unique, encrypted signature verification is required, use our [Digital Signatures][] feature to ensure compliance and reliability.

Check out our detailed [developer guides][] for more information. You can [try out all of our frameworks free for 60 days][trial] to see what works best for your app. When you’re ready to move forward, [contact our Sales team for licensing and pricing information][sales]. And if you run into any issues, our [developers][support] are always available to answer questions and provide technical support!

[statute of frauds]: https://en.wikipedia.org/wiki/Statute_of_frauds
[eidas]: https://www.eid.as/home/
[esign]: https://www.law.cornell.edu/uscode/text/15/chapter-96
[pipeda]: https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/
[it act]: https://www.wipo.int/edocs/lexdocs/laws/en/in/in024en.pdf
[article 3 of eidas]: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32014R0910&from=EN#d1e791-73-1
[pspdfkit framework]: https://pspdfkit.com/pdf-sdk/
[annotations]: https://pspdfkit.com/pdf-sdk/ios/annotations/
[acroform fields]: https://pspdfkit.com/pdf-sdk/ios/forms/
[create, manipulate, store]: https://pspdfkit.com/guides/web/current/features/signatures/
[permanently apply]: https://pspdfkit.com/guides/ios/current/features/document-processing/
[pdf specification]: https://www.adobe.com/content/dam/acom/en/devnet/pdf/pdfs/PDF32000_2008.pdf
[certificate authorities (cas)]: https://en.wikipedia.org/wiki/Certificate_authority
[digital signatures blog]: https://pspdfkit.com/blog/2018/digital-signatures/
[digital signatures]: https://pspdfkit.com/pdf-sdk/ios/digital-signatures/
[developer guides]: https://pspdfkit.com/developers/
[trial]: https://pspdfkit.com/try/
[sales]: https://pspdfkit.com/sales/
[support]: https://support.pspdfkit.com/hc/en-us/requests/new
