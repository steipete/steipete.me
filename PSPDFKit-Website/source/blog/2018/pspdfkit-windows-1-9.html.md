---
title: "PSPDFKit 1.9 for Windows"
description: PSPDFKit for the Universal Windows Platform
preview_image: /images/blog/2018/pspdfkit-windows-1-9/header.png
preview_video: /images/blog/2018/pspdfkit-windows-1-9/features.mp4
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2018-12-20 12:00 UTC
tags: Windows, Products, Development
published: true
---

Today we’re shipping PSPDFKit 1.9 for Windows. This release features new properties for annotations, XFDF support, data providers for abstracting the source and destination of PDF data, the ability to disable copying of PDF text to the clipboard, smooth drawing, and more.

READMORE Please refer to our [PSPDFKit 1.9 for Windows changelog][changelog] for a complete list of changes in this release.

## New Annotation Properties

![new annotation properties](/images/blog/2018/pspdfkit-windows-1-9/new-annotation-properties.png)

With this release, the [`IAnnotation`][iannotation] interface gains the following new properties:

| Property                     | Description                                              |
| ---------------------------- | -------------------------------------------------------- |
| [`CreatedAt`][createdat]     | The date of the annotation creation.                     |
| [`CreatorName`][creatorname] | An arbitrary string.                                     |
| [`Name`][name]               | A property that may be used to identify the annotation.  |
| [`NoView`][noview]           | Prevents the annotation from being rendered in the view. |
| [`UpdatedAt`][updatedat]     | The date the annotation was last updated.                |

Click on the linked documentation for detailed descriptions of each property.

## XFDF Support

![xfdf support](/images/blog/2018/pspdfkit-windows-1-9/xfdf-support.png)

XFDF is an XML-like standard from Adobe for encoding annotations and forms (see this [XFDF overview][xfdf overview]). It is compatible with Adobe Acrobat and several other third-party frameworks.

PSPDFKit for Windows now supports both reading and writing XFDF. Read more in the guide [here][xfdf guide].

## Data Providers

![data providers](/images/blog/2018/pspdfkit-windows-1-9/data-providers.png)

A data provider allows you to define how to read and write data, giving you the freedom to store your data in the exact way you need it — for example, loading PDF documents from arbitrary sources like cloud hosts, device RAM, content providers, and others. This is especially helpful if you want to support your own encryption or compression scheme.

In addition to loading documents using a `StorageFile`, `Uri`, or `IBuffer`, PSPDFKit can load documents using an implementation of [`IDataProvider`][idataprovider]. [`IDataProvider`][idataprovider] defines a common interface for PSPDFKit to load from.

For write support, the interface [`IDataSink`][idatasink] is provided.

An example demonstrating how to implement these interfaces is provided in the Catalog app supplied with the SDK.

## Preventing Text Copy

![prevent text copy](/images/blog/2018/pspdfkit-windows-1-9/prevent-text-copy.png)

When copying of text is [prevented][prevent text copy], it’s still possible to select text for the purposes of annotating, but copying to the clipboard using either the shortcut or a context menu will have no effect.

## Smooth Drawing

<video src="/images/blog/2018/pspdfkit-windows-1-9/smooth.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Our previous drawing implementation simply connected the drawing points with straight lines. This worked well, but sometimes you can spot edges in the drawing, which does not look natural. Fortunately, we can get a better result by fitting curves between the points to get smooth line drawings. This will result in a much better drawing experience for your users.

[changelog]: /changelog/windows/#1.9.0
[iannotation]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Annotation.IAnnotation.html
[creatorname]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Annotation.IAnnotation.html#PSPDFKit_Pdf_Annotation_IAnnotation_CreatorName
[createdat]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Annotation.IAnnotation.html#PSPDFKit_Pdf_Annotation_IAnnotation_CreatedAt
[updatedat]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Annotation.IAnnotation.html#PSPDFKit_Pdf_Annotation_IAnnotation_UpdatedAt
[name]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Annotation.IAnnotation.html#PSPDFKit_Pdf_Annotation_IAnnotation_Name
[noview]: /api/windows/PSPDFKit/PSPDFKit.Pdf.Annotation.IAnnotation.html#PSPDFKit_Pdf_Annotation_IAnnotation_NoView
[idataprovider]: /api/windows/PSPDFKitFoundation/PSPDFKitFoundation.IDataProvider.html
[idatasink]: /api/windows/PSPDFKitFoundation/PSPDFKitFoundation.IDataSink.html
[prevent text copy]: /api/windows/PSPDFKit/PSPDFKit.UI.ViewState.html#PSPDFKit_UI_ViewState_PreventTextCopy
[xfdf overview]: https://developer.salesforce.com/page/Adobe_XFDF
[xfdf guide]: /guides/windows/current/importing-exporting/xfdf-support
