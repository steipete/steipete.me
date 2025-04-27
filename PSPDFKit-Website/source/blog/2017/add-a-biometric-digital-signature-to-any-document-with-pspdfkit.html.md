---
title: "Add a Biometric Digital Signature to Any Document with PSPDFKit"
description: Electronic signatures have come a long way in the past couple decades in both adoption and adding additional security to a signature on an electronic document.
preview_image: /images/blog/2017/add-a-biometric-digital-signature-to-any-document-with-pspdfkit/header.png
section: blog
author:
  - Jonathan Rhyne
author_url:
  - https://twitter.com/jdrhyne
date: 2017-10-17 12:00 UTC
tags: Features, Security
published: true
---

Electronic signatures have come a long way in the past couple decades in both adoption and adding additional security to a signature on an electronic document. Most jurisdictions across the world now accept some form of electronic signatures on most documents. While there are many ways to fulfill the various requirements for a electronic signature to be given the legal effect of a wet ink signature, **the most common implementation is a certified Digital Signature on a PDF.**

READMORE

## What are Digital Signatures

![PDF Digital Ink Signature](/images/blog/2017/add-a-biometric-digital-signature-to-any-document-with-pspdfkit/john.png)
	
[Digital Signatures use asymmetric cryptography](/guides/ios/current/features/digital-signatures/) to authenticate that the signature was created by a known person, that the known person cannot repudiate or deny creating the signature, and that the integrity of the signature is intact. Traditionally, to implement a Digital Signature on a PDF, required a PDF Form with a specific form element for the Digital Signature to be added.  

With [version 7.0 of PSPDFKit for iOS](/blog/2017/pspdfkit-ios-7-0/), we updated our Digital Signatures component with two major additions to traditional implementations: (a) we now allow the capturing of biometric data to further verify and ensure the validity of digitally signed ink annotation signatures; (b) we now enable customers to add a certificate to any ink annotation signature on any document whether it has a signature form element or not. Read more about why these two changes are important and how we implement them in PSPDFKit.

## How a Wet Ink Signature is Verified

![PDF Digital Signature](/images/blog/2017/add-a-biometric-digital-signature-to-any-document-with-pspdfkit/header.png)

To understand why the ability to capture biometric data is such an amazing improvement to digitally signed ink annotation signatures, it helps to know how wet ink signatures are verified to ensure they are not forgeries. The most common way of verifying a wet ink signature is not a forgery is to employ the services of a qualified document examiner and have them testify in court. The most common forgery method of a wet ink signature occurs by tracing or copying a person’s signature either through transmitted light, carbon intermediate or using pressure to ident the image.   

With the use of magnification and typically a black light, a document examiner typically looks at the following when examining a signature:  

* Speed and pressure of the signature. Typically, when a person signs their name the speed and pressure vary naturally throughout. However, when a signature is traced the speed and pressure are normally constant due to the forger carefully and slowly trying to copy the original signature.

* Pen lifts or hesitation marks that occur when the pen stops at an unnatural point in the signature.

* Tremor lines due to the signature being drawn slowly. Under magnification, these show up as the pen going in different directions where a fluid line should be.

* Thick starts and stops to where the forger presses down for longer to start tracing or lifting the pen to end tracing.
 
* A person cannot perfectly duplicate their signature so if two signatures are a perfect match this would be red flag. 

## PSPDFKit’s Digital Signatures

[![PSPDFKit for iOS creating a Digital Signature](/images/blog/2017/add-a-biometric-digital-signature-to-any-document-with-pspdfkit/signature-ios.png)](/blog/2017/pspdfkit-ios-7-0/)

Now with the updated Digital Signatures component released in [version 7 of PSPDFKit for iOS](/blog/2017/pspdfkit-ios-7-0/), our customers can capture with incredible precision the same biometric data that is used by qualified document examiners to verify a wet ink signature and encrypt it in a certified digitally signed ink annotation signature to guarantee the authenticity & integrity of the data. We enable customers to **automatically capture the pressure sensitivity, time and speed of signing, touch radius, and input method** when creating an ink signature that a certificate is added to.   

Further, with the update, we have removed arguably the main complexity and ultimate blocker to users adopting Digital Signatures. A customer can now sign documents with existing signature form elements as well as documents that do not contain signature form elements. This is a massive step forward since the majority of documents users want to sign are not already setup as a PDF Form with a specific signature form element but are rather just image PDFs generated through scanning the paper document. 

To learn more about our API around Digital Signatures and how to implement our updated Digital Signatures component into your app, check out our [guide article.](/guides/ios/current/features/digital-signatures/)

With both of these updates, customers can now implement a simpler more secure method for their customers to add legally binding electronic signatures to their apps. 

[![PSPDFKit for Android creating a Digital Signature](/images/blog/2017/add-a-biometric-digital-signature-to-any-document-with-pspdfkit/signature-android.png)](/blog/2017/pspdfkit-android-4-0/)

## Legal Considerations

The legal validity of electronic signatures varies from jurisdiction to jurisdiction. In almost every jurisdiction, there are specific contracts or legal instruments that are not legally binding if they are signed with an electronic signature. However, for the many contracts and documents that require a signature, the majority of jurisdictions in the world have passed laws that give a legal framework to determine whether an electronic signature will be legally binding or not.

It's always best to collaborate with a local counsel to determine what the law and exact requirements are for an electronic signature to be legally binding in a particular jurisdiction. Stay tuned to our blog for an upcoming post that will dive deeper into some of the larger jurisdictions that have given electronic signatures the same legal effect as wet ink signatures.

If you are interested in licensing our updated Digital Signatures component on iOS or Android, [please reach out.](/sales/)
