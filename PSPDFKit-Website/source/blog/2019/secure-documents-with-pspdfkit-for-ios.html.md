---
title: "Secure Documents with PSPDFKit for iOS"
description: "How to secure documents using PSPDFKit for iOS."
preview_image: /images/blog/2019/secure-documents-with-pspdfkit-for-ios/article-header.png
section: blog
author:
  - Rad Azzouz
author_url:
  - https://twitter.com/radazzouz
date: 2019-05-22 8:00 UTC
tags: iOS, Development, Security, PDF
published: true
secret: false
---

PSPDFKit for iOS allows you to work with secured and encrypted documents. In addition to having [default PDF password encryption][pdf password encryption guide], PSPDFKit also allows you to work with both [large encrypted files][dealing with large encrypted files guide] and an [encrypted library][encryption in pspdflibrary guide], [database][sqlite database encryption guide], and cache.
READMORE

In this article, we’ll discuss the various strategies to secure PDFs in your app.

So let’s get started!

## PDF Password Encryption

You can open and create PDF documents using [default PDF password encryption][pdf password encryption guide]. Below, we’ll see how to accomplish these tasks in just a few lines of code.

### Open a Password-Protected Document

If you open a PDF document that is password-protected, PSPDFKit will show a password prompt to unlock the document.

![locked-document](/images/blog/2019/secure-documents-with-pspdfkit-for-ios/locked-document.png#img-no-shadow;img-width-50)

You can also programmatically unlock the document before presenting it by using [`-[PSPDFDocument unlockWithPassword:]`][pspdfdocument unlockwithpassword api], like so:

[==

```swift
let document = ...

// Programmatically unlock the document.
document.unlock(withPassword: "test123")

// Use the unlocked document in a `PSPDFViewController`.
let pdfController = PSPDFViewController(document: document)

```

```objc
PSPDFDocument *document = ...

// Programmatically unlock the document.
[document unlockWithPassword:@"test123"];

// Use the unlocked document in a `PSPDFViewController`.
PSPDFViewController *controller = [[PSPDFViewController alloc] initWithDocument:document];
```

==]

See our _Password preset_ and _Password not preset_ examples from our [Catalog][pspdfcatalog] app for more information.

### Create a Password-Protected Document

PSPDFKit also allows you to create password-protected documents using an [owner and user password][owner and user passwords guide] via the [Document Processing][document processing guide] API, like so:

[==

```swift
let userPassword = "test123"
let ownerPassword = "test456"
let lockedDocumentURL = // URL to store the newly created document to.
let originalDocument = // `PSPDFDocument` that should be locked.

// By default, a newly initialized `PSPDFProcessorConfiguration` results in an exported document that is the same as the input.
let processorConfiguration = PSPDFProcessorConfiguration(document: originalDocument)

// Set the proper password and key length in `PSPDFDocumentSecurityOptions`.
let documentSecurityOptions = try PSPDFDocumentSecurityOptions(ownerPassword: ownerPassword, userPassword: userPassword, keyLength: PSPDFDocumentSecurityOptionsKeyLengthAutomatic)

DispatchQueue.global(qos: .default).async {
    let processor = PSPDFProcessor(configuration: processorConfiguration!, securityOptions: documentSecurityOptions)
    processor.delegate = self
    try? processor.write(toFileURL: tempURL)
    DispatchQueue.main.async {
        // Show the newly created locked PDF.
        let lockedDocument = PSPDFDocument(url: lockedDocumentURL)
        let pdfController = PSPDFViewController(document: lockedDocument)
    }
}
```

```objc
NSString *userPassword = @"test123";
NSString *ownerPassword = @"test456";
NSURL *lockedDocumentURL = // URL to store the newly created document to.
PSPDFDocument *originalDocument = // `PSPDFDocument` that should be locked.

// By default, a newly initialized `PSPDFProcessorConfiguration` results in an exported document that is the same as the input.
PSPDFProcessorConfiguration *processorConfiguration = [[PSPDFProcessorConfiguration alloc] initWithDocument:originalDocument];

// Set the proper password and key length in `PSPDFDocumentSecurityOptions`.
PSPDFDocumentSecurityOptions *documentSecurityOptions = [[PSPDFDocumentSecurityOptions alloc] initWithOwnerPassword:ownerPassword userPassword:userPassword keyLength:PSPDFDocumentSecurityOptionsKeyLengthAutomatic error:NULL];
dispatch_async(dispatch_get_global_queue(0, DISPATCH_QUEUE_PRIORITY_DEFAULT), ^{
    PSPDFProcessor *processor = [[PSPDFProcessor alloc] initWithConfiguration:processorConfiguration securityOptions:documentSecurityOptions];
    [processor writeToFileURL:lockedDocumentURL error:NULL];

    dispatch_async(dispatch_get_main_queue(), ^{
        // Show the newly created locked PDF.
        PSPDFDocument *lockedDocument = [[PSPDFDocument alloc] initWithURL:lockedDocumentURL];
        PSPDFViewController *pdfController = [[PSPDFViewController alloc] initWithDocument:lockedDocument];
    });
});
```

==]

Take a look at the _Create password protected PDF_ example from our [Catalog][pspdfcatalog] sample project for more details.

## In-Memory Decryption Using PSPDFAESCryptoDataProvider

You can add an additional layer of security with support for state-of-the-art, fast, in-memory [AES-256][wikipedia article aes256] decryption using the [`PSPDFAESCryptoDataProvider`][] class.

You can encrypt an entire file with a password and a salt and by using 10,000 [PBKDF][wikipedia article pbkdf] iterations. This will ensure that the file is well protected against brute-force attacks.

We also provide the AES Crypt app for Mac, which encrypts your PDF documents. Unlike with `NSData`-based solutions, the PDF is never _fully_ decrypted, and the app even works with very large (> 500&nbsp;MB) documents. The file also will never be written out unencrypted to disk, and the cache is automatically disabled for encrypted content.

The implementation would look like this:

[==

```swift
// Note: For shipping apps, you need to protect this string better,
// in order to make it more difficult for a hacker to simply disassemble and receive
// the key from the binary. Or, add an internet service that fetches the key from
// an SSL-API. But then there’s still the slight risk of memory dumping
// with an attached GDB. Or screenshots. Security is never 100 percent perfect,
// but using AES makes it way harder to get the PDF. You can even
// combine AES and a PDF password.
let passphrase = "afghadöghdgdhfgöhapvuenröaoeruhföaeiruaerub"
let salt = "ducrXn9WaRdpaBfMjDTJVjUf3FApA6gtim0e61LeSGWV9sTxB0r26mPs59Lbcexn"

// Generate the crypto data provider.
guard let encryptedPDF = Bundle.main.resourceURL?.appendingPathComponent("encrypted.pdf.aes"),
    let cryptoDataProvider = PSPDFAESCryptoDataProvider(url: encryptedPDF, passphraseProvider: { passphrase }, salt: salt, rounds: PSPDFDefaultPBKDFNumberOfRounds) else {
        return
}

// Create the `PSPDFDocument`.
let document = PSPDFDocument(dataProviders: [cryptoDataProvider])
document.uid = encryptedPDF.lastPathComponent // Manually set a UID for encrypted documents.

// `PSPDFAESCryptoDataProvider` automatically disables `useDiskCache` to restrict using the disk cache for encrypted documents.
// If you use a custom crypto solution, don’t forget to disable `useDiskCache` on your custom data provider or on the document,
// in order to avoid leaking out encrypted data as cached images.
// document.useDiskCache = false

// Show the controller.
let pdfController = PSPDFViewController(document: document)
navigationController.pushViewController(pdfController, animated: true)
```

```objc
// Note: For shipping apps, you need to protect this string better,
// in order to make it more difficult for a hacker to simply disassemble and receive
// the key from the binary. Or, add an internet service that fetches the key from
// an SSL-API. But then there’s still the slight risk of memory dumping
// with an attached GDB. Or screenshots. Security is never 100 percent perfect,
// but using AES makes it way harder to get the PDF. You can even
// combine AES and a PDF password.
NSString *passphrase = @"afghadöghdgdhfgöhapvuenröaoeruhföaeiruaerub";
NSString *salt = @"ducrXn9WaRdpaBfMjDTJVjUf3FApA6gtim0e61LeSGWV9sTxB0r26mPs59Lbcexn";

// Generate the crypto data provider.
NSURL *encryptedPDF = [[[NSBundle mainBundle] resourceURL] URLByAppendingPathComponent:@"encrypted.pdf.aes"];
PSPDFAESCryptoDataProvider *cryptoDataProvider = [[PSPDFAESCryptoDataProvider alloc] initWithURL:encryptedPDF passphraseProvider:^{ return passphrase; } salt:salt rounds:PSPDFDefaultPBKDFNumberOfRounds];

// Create the `PSPDFDocument`.
PSPDFDocument *document = [[PSPDFDocument alloc] initWithDataProviders:@[cryptoDataProvider]];
document.UID = encryptedPDF.lastPathComponent; // Manually set a UID for encrypted documents.

// `PSPDFAESCryptoDataProvider` automatically disables `useDiskCache` to restrict using the disk cache for encrypted documents.
// If you use a custom crypto solution, don’t forget to disable `useDiskCache` on your custom data provider or on the document,
// in order to avoid leaking out encrypted data as cached images.
// document.useDiskCache = NO;

// Show the controller.
PSPDFViewController *pdfController = [[PSPDFViewController alloc] initWithDocument:document];
[self.navigationController pushViewController:pdfController animated:YES];
```

==]

Please take a look at our _PSPDFAESCryptoDataProvider_ and _XFDF Annotation Provider, Encrypted_ examples from [PSPDFCatalog][] for more details.

## PSPDFLibrary and SQLite Database Encryption

SQLite databases created by PSPDFKit are not encrypted by default. However, they are still protected by [iOS data protection][how to use ios data protection blog] just like all other application data is.

In case you need to add an additional level of security, there are a few third-party SQLite extensions that enable database encryption that you can integrate into your codebase. [`PSPDFDatabaseEncryptionProvider`][pspdfdatabaseencryptionprovider api] acts as a bridge between this third-party code and [`PSPDFLibrary`][pspdflibrary api].

In our [documentation][encryption in pspdflibrary guide], we use [SQLCipher][] as an example, but the implementation should be very similar, if not identical, for other providers. To integrate SQLCipher, follow the instructions for either the [commercial edition][] or the [community edition][]. Once SQLCipher is correctly set up, you have to add an implementation of the [`PSPDFDatabaseEncryptionProvider`][pspdfdatabaseencryptionprovider api] protocol.

For more details and sample code, please follow the detailed instructions outlined in our [Encryption in `PSPDFLibrary`][encryption in pspdflibrary guide] and [SQLite Database Encryption][sqlite database encryption guide] articles.

## Disk Cache Encryption

PSPDFKit renders PDF pages as images and caches them in memory and on disk. Read more about [Rendering and Caching][rendering and caching guide] in the related guide article.

There are a few strategies you can adopt to ensure that all sensitive data is secured. These include:

- [Configuring iOS data protection for the disk cache][ios data protection for the disk cache guide]
- [Disabling the disk cache per document][disabling the disk cache per document guide]
- [Disabling the disk cache globally][disabling the disk cache globally guide]

In addition to these approaches, you can use an encrypted disk cache:

[==

```swift
let cache = PSPDFKit.sharedInstance.cache

// Clear existing cache.
cache.clear()

// Optional: Set a new cache directory.
cache.diskCache.cacheDirectory = "PSPDFKit_encrypted"

// In a real use case, you should protect the password better and not hardcode it like in this example.
let password: String = "unsafe-testpassword"

// Set up cache encryption handlers.
// Encrypting the images will cause a 5 to 10 percent slowdown, but nothing substantial.
var encryptedData: Data!
cache.diskCache.encryptionHelper = {(_ request: PSPDFRenderRequest, _ data: Data) -> Data in
    do {
        encryptedData = try RNEncryptor.encryptData(data, with: kRNCryptorAES256Settings, password: password)
    } catch {
        print("Failed to encrypt: \(error.localizedDescription)")
    }
    return encryptedData
}

cache.diskCache.decryptionHelper = {(_ request: PSPDFRenderRequest, _ encryptedData: Data) -> Data in
    var decryptedData: Data!
    do {
        decryptedData = try RNDecryptor.decryptData(encryptedData, withPassword: password)
    } catch {
        print("Failed to decrypt: \(error.localizedDescription)")
    }
    return decryptedData
}

// Open a sample document.
let document: PSPDFDocument = ...
let pdfController = PSPDFViewController(document: document)
```

```objc
PSPDFCache *cache = PSPDFKit.sharedInstance.cache;

// Clear existing cache.
[cache clearCache];

// Optional: Set a new cache directory.
cache.diskCache.cacheDirectory = @"PSPDFKit_encrypted";

// In a real use case, you should protect the password better and not hardcode it like in this example.
NSString *password = @"unsafe-testpassword";

// Set up cache encryption handlers.
// Encrypting the images will cause a 5 to 10 percent slowdown, but nothing substantial.
[cache.diskCache setEncryptionHelper:^NSData *_Nullable(PSPDFRenderRequest *request, NSData *data) {
    NSError *error;
    NSData *encryptedData = [RNEncryptor encryptData:data withSettings:kRNCryptorAES256Settings password:password error:&error];
    if (!encryptedData) {
        NSLog(@"Failed to encrypt: %@", error.localizedDescription);
    }
    return encryptedData;
}];
[cache.diskCache setDecryptionHelper:^NSData *_Nullable(PSPDFRenderRequest *request, NSData *encryptedData) {
    NSError *error;
    NSData *decryptedData = [RNDecryptor decryptData:encryptedData withPassword:password error:&error];
    if (!decryptedData) {
        NSLog(@"Failed to decrypt: %@", error.localizedDescription);
    }
    return decryptedData;
}];

// Open a sample document.
PSPDFDocument *document = ...
PSPDFViewController *pdfController = [[PSPDFViewController alloc] initWithDocument:document];
```

==]

For a working example, please take a look at our _Enable PSPDFCache encryption_ examples from [PSPDFCatalog][].

## Encrypt and Decrypt Files on the Server

We also offer a standalone command-line tool written in Go. It works on Windows, Mac, and Linux/Unix, and it can be found in the distribution `.dmg` under `Extras/cryptor-cli`. This tool allows you to encrypt or decrypt files on a server using a password and a salt. It can be very useful for encrypting and decrypting documents on your app’s server backend.

Please refer to our [Encrypt or Decrypt Files on the Server][encrypt or decrypt files on server guide] article for the build and usage instructions.

## Conclusion

In this article, we provided you with an overview of how to secure your document’s data by using encrypted and secured PDF documents and encrypting the library, database, and cache.

If your project has strict security requirements, please consult our guides about [SDK Security][sdk security guide] and [Security-Related Considerations][security related considerations guide]. We also recommend that you consider disabling features like [text and image extraction][text extraction guide], [drag and drop in external apps][control drag targets guide], and [Document Sharing][document sharing guide], to name a few.

[pdf password encryption guide]: /guides/ios/current/security/introduction-to-encryption/#pdf-password-encryption
[dealing with large encrypted files guide]: /guides/ios/current/security/dealing-with-large-encrypted-files/
[encryption in pspdflibrary guide]: /guides/ios/current/security/encryption-in-pspdflibrary/
[owner and user passwords guide]: /guides/ios/current/security/introduction-to-encryption/#owner-and-user-passwords
[document processing guide]: https://pspdfkit.com/guides/ios/current/features/document-processing/
[sqlite database encryption guide]: /guides/ios/current/security/sqlite-database-encryption/
[pspdflibrary api]: https://pspdfkit.com/api/ios/Classes/PSPDFLibrary.html
[pspdfdatabaseencryptionprovider api]: https://pspdfkit.com/api/ios/Protocols/PSPDFDatabaseEncryptionProvider.html
[how to use ios data protection blog]: /blog/2017/how-to-use-ios-data-protection/
[sqlcipher]: https://www.zetetic.net/sqlcipher/
[commercial edition]: https://www.zetetic.net/sqlcipher/sqlcipher-binaries-ios-and-osx/
[community edition]: https://www.zetetic.net/sqlcipher/ios-tutorial/
[encrypt or decrypt files on server guide]: /guides/ios/current/security/encrypt-or-decrypt-files-on-the-server/
[pspdfdocument unlockwithpassword api]: https://pspdfkit.com/api/ios/Classes/PSPDFDocument.html#/c:objc(cs)PSPDFDocument(im)unlockWithPassword:
[wikipedia article aes256]: http://en.wikipedia.org/wiki/AES256
[`pspdfaescryptodataprovider`]: https://pspdfkit.com/api/Classes/PSPDFAESCryptoDataProvider.html
[wikipedia article pbkdf]: http://en.wikipedia.org/wiki/PBKDF2
[rendering and caching guide]: /guides/ios/current/getting-started/rendering-pdf-pages/#rendering-and-caching
[ios data protection for the disk cache guide]: /guides/ios/current/getting-started/rendering-pdf-pages/#ios-data-protection-for-the-disk-cache
[disabling the disk cache per document guide]: /guides/ios/current/getting-started/rendering-pdf-pages/#disabling-the-disk-cache-per-document
[disabling the disk cache globally guide]: /guides/ios/current/getting-started/rendering-pdf-pages/#disabling-the-disk-cache-globally
[pspdfcatalog]: /guides/ios/current/getting-started/example-projects/#pspdfcatalog
[sdk security guide]: /guides/ios/current/faq/sdk-security/
[security related considerations guide]: /guides/ios/current/faq/sdk-security/#security-related-considerations
[text extraction guide]: /guides/ios/current/features/text-extraction/
[control drag targets guide]: /guides/ios/current/features/drag-and-drop/#control-drag-targets
[document sharing guide]: /guides/ios/current/miscellaneous/document-sharing/
