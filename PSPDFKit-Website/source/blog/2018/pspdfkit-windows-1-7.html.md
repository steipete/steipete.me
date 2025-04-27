---
title: "PSPDFKit 1.7 for Windows"
description: PSPDFKit for the Universal Windows Platform
preview_image: /images/blog/2018/pspdfkit-windows-1-7/header.png
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2018-10-23 14:00 UTC
tags: Windows, Products, Development
published: true
---

Today we’re shipping PSPDFKit 1.7 for Windows. This release features the addition of incremental and automatic saving of PDFs, an API for controlling sidebars, and customizable logging.

READMORE Please refer to our [PSPDFKit 1.7 for Windows changelog][changelog] for a complete list of changes in this release.

## Incremental and Automatic Saving

![](/images/blog/2018/pspdfkit-windows-1-7/incremental-saving.png)

Most of the time, changes to a PDF are relatively small in comparison to the size of the document itself. When saving these changes to a file, PDF supports the ability to append only the changes to the document to the end of the file in something called a trailer. When saving to large files, this can provide a significant performance improvement when compared to rewriting the entire document. However, even though it’s a slower process, rewriting the entire document leads to a smaller document being saved.

PSPDFKit now defaults to incremental saving, but you can explicitly choose to either save incrementally or rewrite the entire document. Read more about this in our [Opening and Saving PDFs guide][opening and saving].

Additionally, you can now activate an automatic saving mode for a `PdfView`. By default, you must explicitly save a document in order to persist changes before loading a new document into the `PdfView` or unloading the control. Now you can choose to have current changes automatically saved and also specify whether the file should be saved incrementally or rewritten. We provide example code in our [Automatically Saving Changes guide][auto-saving].

You may also need to be informed when saving to a file was successful or if a problem occurred. For this, you can subscribe to the `OnFileExported` and `OnFileExportFailed` event handlers of `PdfView`. See the [guide][auto-saving] for more details.

## Sidebar API

![](/images/blog/2018/pspdfkit-windows-1-7/sidebar-api.png)

In PSPDFKit 1.6 for Windows, we introduced two new sidebar modes — one to show the table of contents (document outlines) of a PDF, and one that lists all annotations. We also added an API to control the sidebars programmatically, and now we have a new [guide][sidebar guide] explaining how you can do that.

## Customizable Logging

![](/images/blog/2018/pspdfkit-windows-1-7/customizable-logging.png)

PSPDFKit logs certain events, warnings, and errors. The logging level can be [set programmatically][custom logging], and you can now also provide your own logging handler to forward log events to another system.

[guides]: /guides/windows/current/
[windows website]: /windows
[changelog]: /changelog/windows/#1.7.0
[opening and saving]: /guides/windows/current/features/opening-and-saving-pdfs/
[auto-saving]: /guides/windows/current/features/automatically-saving-changes/
[sidebar guide]: /guides/windows/current/customizing-the-interface/the-view-state/?search=sidebar#controlling-the-sidebar-mode
[custom logging]: /api/windows/PSPDFKitFoundation/PSPDFKitFoundation.Log.Logger.html
