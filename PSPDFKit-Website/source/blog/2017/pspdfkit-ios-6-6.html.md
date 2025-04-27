---
title: "PSPDFKit 6.6 for iOS"
description: Introducing PSPDFKit 6.6 for iOS. Right-to-Left Documents. Annotation Drawing. Line Thickness. Various Bug-fixes.
preview_image: /images/blog/2017/pspdfkit-ios-6-6/rtl-document.png
section: blog
author:
  - Matej Bukovinski
  - Stefan Kieleithner
author_url:
  - https://twitter.com/bukovinski
  - https://twitter.com/steviki
date: 2017-04-06 14:00 UTC
tags: iOS, Development, Products
published: true
---

Another month, another version of PSPDFKit for iOS! Version 6.6 features significantly improved Right-to-Left support, enhanced annotation drawing, better fine-grained control of line thickness for annotations, and numerous bug-fixes. This release also adds full support for Xcode 8.3 and iOS 10.3. Take a look at our [changelog](/changelog/ios/#6.6.0) for all the details regarding changes, improvements and fixes in this release. We are also working hard on the development of PSPDFKit for macOS, so if you are interested in a macOS framework, please [let us know by dropping us a line](mailto:sales+macos@pspdfkit.com) with your requirements and your use case.

READMORE

## Right-to-Left Documents

With this release, we've improved Right-to-Left support even more. We added support for Right-to-Left documents, respecting the PDFs page binding for all page transition modes (See [`-[PSPDFDocument pageBinding]`](/api/ios/Classes/PSPDFDocument.html#/c:objc(cs)PSPDFDocument(py)pageBinding)). When this is set to `PSPDFPageBindingRightEdge`, the first page of a document will start on the right, and the last page will be on the far left. Additionally, we also improved text selection for documents with the right to left text, so now that you can select text no matter the written language.

![Right-to-Left Document](/images/blog/2017/pspdfkit-ios-6-6/rtl-document.gif)

## Annotation Drawing

We are always improving our annotation drawing logic. In this release, we focused on our cloudy border renderer. Cloudy borders now look way nicer and would always adapt based on the current annotation size, even during resizing. This also enabled us to show a live preview of the shape annotation border style while drawing. PSPDFKit 6.6 also improved handling for small shape annotations. We now correctly honor the minimum annotation size property even for interactively drawn shape annotations.

![Cloudy Circle](/images/blog/2017/pspdfkit-ios-6-6/cloudy-circle.gif)

## Line Thickness

We received a lot of support requests asking for the ability to draw ink annotations with a smaller line width. Now you can choose a line width down to 0.5pt for supported annotations, which makes drawing and writing on a zoomed-in document even more accurate. The line width slider now also allows a better fine-grained control when in the lower digits, so that you can precisely choose the annotation width you desire.

![Line Thickness](/images/blog/2017/pspdfkit-ios-6-6/line-thickness.gif)

## PDF Metadata

Metadata may be stored in a PDF document in two ways: In a document information dictionary associated with the document or in a metadata stream. To give you full access to all the PDF metadata, PSPDFKit now comes with two new classes, [`PSPDFDocumentPDFMetadata`](/api/ios/Classes/PSPDFDocumentPDFMetadata.html) and [`PSPDFDocumentXMPMetadata`](/api/ios/Classes/PSPDFDocumentXMPMetadata.html). If you need to retrieve or set metadata in a PDF, you can [check out our guide article](/guides/ios/current/customizing-pdf-pages/customizing-document-metadata/). Those classes have now replaced the deprecated document metadata property (`-[PSPDFDocument metadata]`).

## Form Mappings

With the new [`formFieldNameMappings`](/api/ios/Classes/PSPDFProcessorConfiguration.html#/c:objc(cs)PSPDFProcessorConfiguration(py)formFieldNameMappings) and [`formMappingNameMappings`](/api/ios/Classes/PSPDFProcessorConfiguration.html#/c:objc(cs)PSPDFProcessorConfiguration(py)formMappingNameMappings) properties on [`PSPDFProcessorConfiguration`](/api/ios/Classes/PSPDFProcessorConfiguration.html) you can change names of form fields on the fly. This allows you to use template documents with form fields and append them on an existing document with form fields directly on the device, while ensuring that each form field has a unique name when adding new form fields to the document. You can pass in a dictionary containing the source form field names and the new form field names. You can read more about this [in our guide article](/guides/ios/current/forms/introduction-to-forms/#renaming-form-field-names).

## Improvements and Bug-fixes

We care tremendously about every detail of the framework, therefore you will, as usual, find various smaller improvements and fixes throughout the framework. To improve Swift support, we converted various read-only methods to properties where appropriate. This is source compatible for Objective-C but might require small adjustments in Swift code. Our API was extended with a [`clearRegisteredSigners`](/api/ios/Classes/PSPDFSignatureManager.html#/c:objc(cs)PSPDFSignatureManager(im)clearRegisteredSigners) call on [`PSPDFSignatureManager`](/api/ios/Classes/PSPDFSignatureManager.html) to allow removing all registered signers.

[`PSPDFImagePickerController`](/api/ios/Classes/PSPDFImagePickerController.html) received some updates as well, now allowing you to control showing the image editor with [`shouldShowImageEditor`](/api/ios/Classes/PSPDFImagePickerController.html#/c:objc(cs)PSPDFImagePickerController(py)shouldShowImageEditor) and getting callbacks whenever an image has been selected and edited. Have a look [at our guide article](/guides/ios/current/miscellaneous/image-picker/) for further information.

In [PSPDFKit 6.5 for iOS](/blog/2017/pspdfkit-ios-6-5/), we rewrote most of our form handling code to allow both more edge cases and sharing the code with our [Android](/features/#android) and [Web SDK](/web). We've added many tests and further refined this code with the 6.6 release. [Please ping us](/support/request) if you have forms that aren't fully supported yet - the new infrastructure empowers us to support more corner cases outside of [the PDF specification](/guides/ios/current/troubleshooting/complexities-of-rendering-pdfs/) than ever before.
