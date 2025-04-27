---
title: "What PDF Digital Signatures Are and Why They Are Important"
description: "Why protecting PDF documents with a digital signature is important and how PSPDFKit signs and validates a document."
preview_image: /images/blog/2018/digital-signatures/article-header.png
section: blog
author:
  - Daniel Martín
author_url:
  - https://twitter.com/dmartincy
date: 2018-01-22 12:00 UTC
tags: Products, Development, Security, PDF
published: true
---

PDF documents are used to share all kinds of information, including that of a confidential nature or with a legal value, like a contract. In order to ensure that a document has not been modified by someone other than its author, and to verify that the author is who we expect and not somebody else, digital signatures are necessary.

## Overview

A digital signature in a PDF is the equivalent of an ink signature on a paper document, but it’s much more secure. This piece of information is placed inside a document, and it lets PSPDFKit and other PDF readers check two important things:

- That the document has not been modified by an unknown person.
- That the person who claims to have authored the document is really the person who created it.

## How the Integrity of a PDF Document Is Checked

Imagine that somebody intercepts a PDF document with some important contractual agreement and tries to modify it to show different terms. Digital signatures in PDF documents use the concept of hashing to prevent such a scenario. A hash is a mathematical function that converts an arbitrary block of data into a fixed-size string. The result of this hash function is always identical provided that the block of data has not been modified.

![Creating a document hash.](/images/blog/2018/digital-signatures/hash-creation.png)

When you sign a PDF document, this hash function is applied to almost all of the document’s contents and then stored inside it. However, this does not completely solve the problem of document integrity. What if a malicious person guesses the hash function that was used, modifies the PDF document, and then stores the new hash in it? To solve this second problem, we need asymmetric encryption.

## Asymmetric Encryption

If you want to send a message to another person and you don’t want it to fall into the wrong hands, you could use an algorithm to encrypt it and tell the other person to use the same algorithm to decrypt it. But this requires that both parties are able to securely and secretly communicate the encryption key they are going to use beforehand.

Alternatively, you can use asymmetric encryption, which means that the sender and the receiver use different keys. The sender encrypts the message using a key that is meant to be private (the “private key”) and shares the other key (the “public key”) with the receiver.

Then, two things need to occur. First, the receiver must be able to decrypt the message using that public key. Second, nobody should have access to the private key except the sender. If these things are true, then both parties can be sure that the message was created by the sender and not somebody else.

![Signing the document, using the document’s hash encrypted with the private key.](/images/blog/2018/digital-signatures/document-signing.png)

To be efficient without compromising security, PSPDFKit does not encrypt the entire PDF document; rather, only a hash of it is encrypted. When the person you send a signed document to receives it, they can decrypt the encrypted hash and compute a hash of the same parts of the document they’ve received.

![Validating a signature by comparing the document’s hash to the hash decrypted with the public key.](/images/blog/2018/digital-signatures/signature-validation.png)

If both hashes match, then the document has not been modified and was created by you. This whole process is automatically supported by PSPDFKit, so you don't need to perform these steps manually.


## How to Validate a Digitally Signed Document with PSPDFKit

Validating a signed PDF with PSPDFKit using a set of trusted certificates is easy. Create an instance of a [`PSPDFSignatureValidator`](/api/ios/Classes/PSPDFSignatureValidator.html) and initialize it with the [`PSPDFSignatureFormElement`](/api/ios/Classes/PSPDFSignatureFormElement.html) you want to validate. Then call the `verifySignatureWithTrustedCertificates()` method, like this:

```swift
let signatureFormElement = unsignedDocument.annotationsForPage(at: 0, type: .widget)?.first { annotation -> Bool in
    return annotation is PSPDFSignatureFormElement
}
let validator = PSPDFSignatureValidator(formElement: signatureFormElement)
let certificates = PSPDFX509.certificates(fromPKCS7Data: certificateData)
let signatureStatus = validator.verifySignaturewithTrustedCertificates(certificates)
```

The variable `signatureStatus` will contain information about the digital signature, such as whether or not it’s valid, or its creation date.

## How to Sign a Document with PSPDFKit

Signing a PDF document is also easy.

First, you need to create an instance of a PKCS#12 keystore ([`PSPDFPKCS12`](/api/ios/Classes/PSPDFPKCS12.html)) that contains your private key and certificate. After that, initialize an instance of a [`PSPDFPKCS12Signer`](/api/ios/Classes/PSPDFPKCS12Signer.html) with that keystore. Optionally, you can set a reason for the signature:

```swift
let keystore = PSPDFPKCS12(data: p12data)
let signer = PSPDFPKCS12Signer(displayName: "Your name", pkcs12: keystore)
signer.reason = "Contract agreement"
```

Register this signer with the global `PSPDFSignatureManager` and sign the document:

```swift
let signatureManager = PSPDFKit.sharedInstance.signatureManager
signatureManager.register(signer)

var signedDocument: PSPDFDocument?
signer.sign(signatureFormElement, usingPassword: password,
    writeTo: path, appearance: appearance, biometricProperties: biometricProperties) { ...
        signedDocument = document
    })
```

You can embed the `signedDocument` inside a `PSPDFViewController` to display it however you like.

For more information about the digital signing process and the customization we support (including biometric signatures), please take a look at our [Digital Signatures guides](/guides/ios/current//features/digital-signatures/).
