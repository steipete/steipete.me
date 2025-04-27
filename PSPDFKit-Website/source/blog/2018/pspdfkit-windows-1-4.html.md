---
title: "ARMing PSPDFKit for Windows"
description: PSPDFKit for the Universal Windows Platform (UWP) supports ARM.
preview_image: /images/blog/2018/pspdfkit-windows-1-4/windows-1-4-header.png
preview_video: /images/blog/2018/pspdfkit-windows-1-4/windows-1-4-release.mp4
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2018-06-21 16:00 UTC
tags: Windows, Products, Development
published: true
---

Today we are excited to announce support for ARM in PSPDFKit for Windows!

After releasing the SDK in February of this year and coming out with three additional feature releases since then, we now support Windows 10 on ARM. This brings awesome, fast PDF-editing features to your native apps on every architecture within minutes.

In this release, you’ll also find example code in the Catalog app demonstrating how to use custom CSS to style the UI in the `PdfView`. Additionally, you can read the [guide article on customizing PSPDFKit for Web][customizing pspdfkit] to learn about what elements can be styled. A second new example shows how you can have multiple `PdfView`s on a single XAML page.

A list of all the changes in this release is available in the [changelog][changelog].

READMORE

[![PSPDFKit 1.4 for Windows](/images/blog/2018/pspdfkit-windows-1-4/windows-1-4-header.png)][windows website]

## A Quick Look Back

It’s only been five months since we launched PSPDFKit for Windows with a feature-rich SDK right out the door. We haven’t rested, but instead continued to add features, improve the API design, respond to users’ needs, and increase performance.

We launched with the following capabilities (and more):

- Viewing documents using a variety of presentation modes, such as double-page rendering.
- Annotating documents easily with highlighting, freehand drawing, and notes.
- Editing annotations — moving, scaling, or changing the color as you like.
- Handling mouse and touch events — ready for the Microsoft Surface Tablet.
- Searching quickly with intuitive keyboard shortcuts for power users.
- Reading, updating, and submitting PDF forms. Forms can be filled out programmatically, submitted to a server, or saved back to the file as form data or flattened, non-editable text.
- React Native support — adding PDF support to your React Native Windows UWP app.

Since then, we’ve added:

- Full-Text Search — indexing and searching folders of PDFs with lightning speed.
- Additional page events and page text and information extraction.
- Ink Signatures — adding ink signatures with ease and storing them for later use.
- A customizable toolbar — a toolbar that contains only what you need.
- More comprehensive action support.
- Further Instant JSON enhancements.
- Rendering performance increases.
- An API refactor improving usability.
- ARM support — running your app everywhere Windows 10 runs.

You can read more about all of the features on the [Windows SDK product page](/pdf-sdk/windows/).

## Looking Forward

We have a lot in store for the coming releases as we work to make our new UWP PDF SDK even better. Instant annotation sync capabilities, image annotations, and localization are all on our roadmap for 2018. We’re not resting!

[Visit the Windows SDK page][windows website] or head over [to the documentation](/guides/windows/current/getting-started/integrating-pspdfkit/) to learn more.

[windows website]: /windows
[changelog]: /changelog/windows/#1.4.0
[customizing pspdfkit]: /guides/web/current/customizing-the-interface/css-customization/
