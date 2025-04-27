---
title: "Protecting PDF Documents"
description: "Password-based security for PDF documents."
preview_image: '/images/blog/2018/protecting-pdf-documents/article-header.png'
section: blog
author:
  - Marcin Krzyżanowski
  - Daniel Martín
author_url:
  - https://twitter.com/krzyzanowskim
  - https://twitter.com/dmartincy
date: 2018-08-22 12:00 UTC
tags: Digital Signature, Development
published: true
---

Since the beginning of writing history, people have tried to protect content, ensure its authenticity, and keep it intact. [The earliest known use of obscuring written content](https://en.wikipedia.org/wiki/History_of_cryptography#Classical_cryptography) is found in non-standard hieroglyphs, circa 1900 BCE. Later, ancient Romans began using the [Caesar cipher](https://en.wikipedia.org/wiki/Caesar_cipher) to hide information from outsiders. From today’s perspective, the methods people used may come across as childish, but they worked with what they had. Finally, [in the 19th century](https://en.wikipedia.org/wiki/History_of_cryptography#Cryptography_from_1800_to_World_War_II), humans developed the science that allows us to replace simple substitution-based ciphers with complex, math-based encryption.

PDF is a widely adopted document format, having replaced plain sheets of paper with a digital version of paper. Now in the digital era, especially with document formats like PDF, protecting information is both easy and secure. All PDF protection relies on encryption using a password, a digital certificate, or a server-based rights management solution. PDF documents can be encrypted to protect their content from unauthorized access, and encryption applies to the content in the document’s file. The entire file isn’t necessarily encrypted, but all the sensitive values — like text, form values, and images — are.

## Password Security

Password-based encryption is the most commonly used and most widely supported method for securing PDF documents. The way it works is that anyone who knows the password can open a file. The most robust encryption method is based on 256-bit AES cipher.

There are two ways we can protect a document with a password:

- We can apply a user password, which is needed to open a file in the first place.
- We can restrict operations on a file with an owner password. If we set a user password and an owner password, they cannot be the same.

The distinction between a user password and an owner password defines the scope of protection.

The user password is the password used to open the document (that’s why sometimes it’s called the open password). Opening an encrypted document means calculating the encryption key out of the password and using it to decrypt the contents of the document. Once the document is opened with the password, it’s unlocked.

Then there’s the owner password, which is the password used to define permissions. Once a document has the owner password set, the document owner can set the document permissions. The permissions integrity is not secured by cryptographic methods, but instead relies on PDF viewers and editors honoring the settings and requiring the entry of the user password before allowing any modifications. Most PDF software will honor this “code of conduct”; however, there are no guarantees (for more details, see the Document Permissions section below).

On the low (PDF specification) level, both passwords are required for the encrypted document. Either password may be used to decrypt the content (to be more specific, the key derived from the password is used).

It’s worth mentioning that, from a security point of view, PDF password protection can easily be removed from a document without any damage to the document. Since providing the user password already decrypts a document, thereby giving the reader access to the document’s contents, a non-conforming reader could override the owner password without knowing the previous owner password. This makes the document permissions security illusory.

It’s up to the implementation to interpret both values and present the appropriate UI. For example, if the interface says that only a user password is set for a document, it could mean that both the user and owner passwords are set to the same value. It’s also the reason why Adobe Acrobat won’t let you set the same value as both passwords.

The [PSPDFKit for iOS](https://pspdfkit.com/pdf-sdk/ios/) framework is the best way to handle PDF documents, including protecting documents, and the [API](https://pspdfkit.com/guides/ios/current/security/secured-documents/) to set the password is straightforward.

Build security options, and then save the document with new security options:

```swift
do {
    let documentSecurityOptions = try PSPDFDocumentSecurityOptions(ownerPassword: password, userPassword: password, keyLength: PSPDFDocumentSecurityOptionsKeyLengthAutomatic)
    try document.save(options: [.security(documentSecurityOptions)])
} catch {
    print("Can't save file.")
}
```

To read the encrypted document, you first have to unlock it with a password:

```swift
document.unlock(withPassword: "test123")
```

The above depends upon which password was used to unlock the document, and the document permissions will indicate either the full access (owner password), or document-specified access (user password).

At any time, a document may be locked again with the following:

```swift
document.lock()
```

The [PSPDFKit for iOS](https://pspdfkit.com/api/ios/) framework also has a [prebuilt user interface](https://pspdfkit.com/api/ios/Classes/PSPDFDocumentSecurityViewController.html) for managing passwords and permissions.

![](/images/blog/2018/protecting-pdf-documents/document-info-view-controller.png)

### Document Permissions

Document permissions specify permitted operations that a PDF reader can perform on a document. As mentioned in the previous section, these permissions are protected by the owner (permissions) password. Before we continue, let’s explain which permissions are available according to the PDF standard:


| Permission                      | Description                                                                           |
|---------------------------------|---------------------------------------------------------------------------------------|
| Print                           | Allows the user to print the document with low quality (as an image).                 |
| Modification                    | Allows the user to modify the document (for example, to add new text content).        |
| Extract content                 | Allows the user to extract content from the document (copying it to another application). |
| Add annotations and form fields | Allows the user to add annotations or form fields.                                    |
| Fill form elements              | Allows the user to fill form fields.                                                  |
| Extract text and graphics       | Allows the user to extract text and graphics to support accessibility.                |
| Assemble the document           | Allows the user to insert, delete, or rotate pages and to create bookmarks.           |
| Print with high quality         | Allows the user to print the document in the highest quality possible.              |

Setting permissions in a document using PSPDFKit is also very simple:

```swift
do {
    // First, load the original document (in this case, from a URL).
    let documentURL = URL(string: "MyPDF.pdf")
    let originalDocument = PSPDFDocument(url: documentURL)

    // Wrap the document in a `PSPDFProcessorConfiguration` object that can be processed by `PSPDFProcessor`.
    let processorConfiguration = PSPDFProcessorConfiguration(document: originalDocument)

    // Configure the document security with the desired owner password. Only printing the document will be allowed.
    let ownerPassword = "1234"
    let documentSecurityOptions = try PSPDFDocumentSecurityOptions(ownerPassword: ownerPassword, userPassword: nil, keyLength: PSPDFDocumentSecurityOptionsKeyLengthAutomatic, permissions: [.printing])

    // Let the `PSPDFProcessor` generate a new PDF with the desired permissions.
    let processor = PSPDFProcessor(configuration: processorConfiguration!, securityOptions: documentSecurityOptions)
    let destinationURL = URL(string: "MyProtectedPDF.pdf")
    try processor.write(toFileURL: destinationURL)
} catch {
    print("Error processing the document.")
}
```

An important thing to note is that the PDF specification itself does not expose any measures that would require all PDF viewers to follow the restrictions that a PDF document’s permissions impose. The specification only documents what the available permissions are and how they are stored inside the PDF file. PDF viewers themselves are responsible for honoring these access permissions and restricting the set of operations that can be performed on a document accordingly. As users, we cannot fully rely on all PDF viewers correctly honoring these restrictions.

## Signatures

A digital signature may be used to verify the integrity or to certify the authenticity of a document’s contents. The signature may be purely mathematical, such as a public/private key-encrypted document digest, or it may be a biometric form of identification, such as a handwritten signature, fingerprint, or retinal scan.

Digital signatures in PDF support the addition of a digital signature to a document or the verification of the validity of a signature added to a document. PSPDFKit supports these via the `PSPDFSigner` and `PSPDFSignatureValidator` classes, respectively. You can either sign a document that already has a signature form element or create a new signature form element and sign a document. When you sign a document that has a signature form element, PSPDFKit automatically embeds the encrypted hash of the entire document, with the exception of the signature itself. By hashing the entire document, we make sure the signature covers the entire document and that any change in it is detected.

When PSPDFKit validates a digital signature, it performs two operations:

- First, it checks that the hash of the document and the hash that was embedded in the encrypted signature match. If they match, this means that a malicious user has not modified the document.
- Next, it checks that the certificate embedded in the digital signature is valid and hasn’t expired. If that’s the case, it means the document was authored by the person who claims to have authored it.

We combine both checks with a single API call that returns a result object, like in the following code sample:

```swift
// First, get a reference to the signature form element in the document.
let signatureFormElement = signedDocument.annotationsForPage(at: 0, type: .widget)?.first! { annotation -> Bool in
    return annotation is PSPDFSignatureFormElement
}
// Now create an instance of the PDF signature validator.
let validator = PSPDFSignatureValidator(formElement: signatureFormElement)
// Load trusted certificates from some certificate data already on the device.
let certificates = PSPDFX509.certificates(fromPKCS7Data: certificateData)
// Finally, verify the signature status against the list of trusted certificates.
let signatureStatus = validator.verifySignaturewithTrustedCertificates(certificates)
```

There are different error severity levels represented by the `signatureStatus` variable, including critical issues like the document being modified after it was signed, and important ones like a certificate that’s embedded in the signature expiring:

![](/images/blog/2018/protecting-pdf-documents/InvalidSignature.png)

## Conclusion

You can protect a PDF document in many different ways. Two of the most common ones are adding passwords and signing a document with a digital signature. When you set a password, you can choose if the password will be required to open the document or if the password will be used to prevent some operations (for example, printing). Digital signatures are a different security measure for PDFs, and they employ cryptography to prevent unauthorized changes to a document and to verify its authenticity. We support both security measures in PSPDFKit and abstract their complexity from you, so you can be sure that you can protect confidential or contractual information when you need to.
