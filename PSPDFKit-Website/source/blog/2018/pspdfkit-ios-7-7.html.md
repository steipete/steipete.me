---
title: "PSPDFKit 7.7 for iOS"
description: Introducing PSPDFKit 7.7 for iOS — featuring a new document info screen, Document Editor enhancements, improved thumbnail filtering, image document export, and preliminary iOS 12 and Xcode 10 support.
preview_image: /images/blog/2018/pspdfkit-ios-7-7/ios-7-7-header.png
preview_video: /images/blog/2018/pspdfkit-ios-7-7/ios-7-7-header.mp4
section: blog
author:
  - Matej Bukovinski
author_url:
  - https://twitter.com/bukovinski
date: 2018-07-19 11:00 UTC
tags: iOS, Development, Products
published: true
secret: false
---

We’re excited to introduce our latest update for PSPDFKit for iOS — version 7.7. With this release, we’re adding an all-new document info view, which shows essential information and security options for PDFs. The release features Document Editor improvements, including support for systemwide drag and drop, improved thumbnail filtering, new additions to the image document export flow, and much more. PSPDFKit 7.7 for iOS also provides preliminary support for iOS 12 and Xcode 10, fixing some compatibility issues and ensuring your builds will be warning free.

## Document Info

With PSPDFKit 7.7, we are introducing a brand-new document info view, conveniently showing all the essential document metadata, as well as security and permission options for the currently open document. The UI also comes with the ability to edit some of these values. The metadata includes values like the document title, creation and last modified date, page dimensions, file size, document passwords, permission options, and more. This is powered by the new [`PSPDFDocumentInfoViewController`] class, which has been made part of our standard `outlineButtonItem` UI. We also improved our support for document passwords, including compatibility with third-party readers.

<video src="/images/blog/2018/pspdfkit-ios-7-7/document-info.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Document Editor Enhancements

The Document Editor received several improvements in this release, the most noticeable one being proper systemwide drag-and-drop support. This adds the ability to drag and drop PDF documents, pages, and images into the Document Editor and insert the dragged content into an existing document. At the same time, pages can also be dragged out of the Document Editor as PDFs or images, depending upon which file format the drop destination supports. This makes merging documents a lot easier and more natural.

The release includes other related improvements, like the ability to insert multiple pages at the same time, improved undo grouping, support for cutting pages, and progress indication on the API level during import.

<video src="/images/blog/2018/pspdfkit-ios-7-7/document-editor-dnd.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Improved Thumbnail Filtering

Showing thumbnails requires document parsing, which, depending on the size and complexity of a given document, might take a while. Switching to thumbnails, especially when filtering pages by annotations, has thus far been a blocking operation that could temporarily lock up the application UI when thumbnails were processed for a complex document. We improved upon this in 7.7 by making the thumbnails API on [`PSPDFThumbnailViewController`] asynchronous and deprecating the old synchronous API. This means that filtering now works completely in the background. The thumbnail user inference was also updated accordingly. It now shows a nice progress UI until the thumbnails are ready for display, and it processes thumbnails for very large documents in batches.

![Thumbnail Filtering](/images/blog/2018/pspdfkit-ios-7-7/thumbnail-filtering.jpeg)

## Image Document Export Flow

Up until this point, image documents were exported the same way as regular PDF documents, which wasn’t always what users expected. To improve the export flow, there are now custom-tailored options for exporting image documents. This enables you to export the image with annotation metadata, thereby enabling subsequent editing of inserted annotations; export the image with annotations flattened into the image, which reduces the image file size; or export the image document as a PDF with either embedded or flattened annotations.

![Image Document Export](/images/blog/2018/pspdfkit-ios-7-7/image-document-export.jpeg)

## Web Link Options

When selecting web links with a long press, you’ll now see a fresh UI with additional link actions matching the UI iOS provides for links in some system applications. These actions include adding web links to Safari Reading List, copying, and link sharing.

![Link Options](/images/blog/2018/pspdfkit-ios-7-7/link-options.jpeg)

## Details

As always, we also worked a lot on smaller details and improvements. We added support for setting specific annotation styles for different variant types, like highlighter and arrow annotations, which are variants of the ink and line annotation types, respectively. Additionally, we revamped the API on [`PSPDFPageView`] related to creating and inserting annotations. This is a first step toward a larger refactor and cleanup, with the goal of making the page view more lightweight. To see a complete list of changes, check out the [PSPDFKit 7.7 for iOS changelog][iOS 7.7 Changelog].

[iOS 7.7 Changelog]: /changelog/ios/#7.7.0
[`PSPDFDocumentInfoViewController`]: https://pspdfkit.com/api/ios/Classes/PSPDFDocumentInfoViewController.html
[`PSPDFThumbnailViewController`]: https://pspdfkit.com/api/ios/Classes/PSPDFThumbnailViewController.html
[`PSPDFPageView`]: https://pspdfkit.com/api/ios/Classes/PSPDFPageView.html
