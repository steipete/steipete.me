---
title: "PSPDFKit 1.1 for Windows"
description: "Today we're releasing PSPDFKit 1.1 for Windows!"
preview_image: /images/blog/2018/pspdfkit-windows-1-1/windows-1-1-header.png
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2018-04-09 12:00 UTC
tags: Windows, Products, Features
published: true
---

Today we’re shipping PSPDFKit 1.1 for Windows — a refactor, feature, and optimization release. The highlights of this release are an improved API layout and standardized naming conventions. It also contains new features for working with selected annotations, extracting the text behind markup annotations, and more optimizations. READMORE This blog post is just a preview of the biggest changes in PSPDFKit 1.1 for Windows. Please refer to our [PSPDFKit 1.1 for Windows changelog][] for a complete list.

## API Refactor

Following the release of PSPDFKit 1.0 for Windows, we’ve learned a lot about how our partners are using it and what expectations they have for the API. With PSPDFKit 1.1, we renamed many of the classes, methods, and namespaces to make them more obvious and to better follow the Microsoft guidelines.

Additionally, the organization of the namespaces has been improved to communicate the purpose and relationship of the various parts of the SDK more clearly.

For those of you using a previous version, please consult our [PSPDFKit 1.1 Migration Guide][] for details on how to upgrade to this version.

## Selected Annotations

For getting and setting a selected annotation, there are now two new methods:

* `PSPDFKit.UI.Controller.SetSelectedAnnotationAsync`
* `PSPDFKit.UI.Controller.GetSelectedAnnotationAsync`

To be notified whenever a selection changes, add a handler to the `PSPDFKit.UI.Controller.OnAnnotationSelectionChanged` event.

## Markup Annotation Text

For retrieving the text behind a markup annotation, we now provide the method `PSPDFKit.Document.GetMarkupAnnotationTextAsync`.

For a complete list of changes for this release, read our [PSPDFKit 1.1 for Windows changelog][].

The PSPDFKit for Windows UI is powered by PSPDFKit for Web. See here for further details about [PSPDFKit for Web 2018.2][].

[PSPDFKit 1.1 Migration Guide]: https://pspdfkit.com/guides/windows/current/migration-guides/pspdfkit-1-1-migration-guide/
[PSPDFKit 1.1 for Windows changelog]: https://pspdfkit.com/changelog/windows/#1.1.0
[PSPDFKit for Web 2018.2]: https://pspdfkit.com/blog/2018/pspdfkit-web-2018-2/
