---
title: "PSPDFKit for Web 2019.3"
description: "Announcing PSPDFKit for Web 2019.3 — including intelligent ink annotation splitting, a new eraser tool, faster search, new Catalog examples, and more."
preview_image: /images/blog/2019/pspdfkit-web-2019-3/article-header.png
preview_video: /images/blog/2019/pspdfkit-web-2019-3/features.mp4
section: blog
author:
  - Luna Graysen
author_url:
  - https://twitter.com/lunalovesbirds
date: 2019-05-29 10:00 UTC
tags: Web, Products
cta: web
published: true
---

We are pleased to announce PSPDFKit for Web 2019.3! This release introduces intelligent ink annotation splitting, a new eraser tool, faster search, support for page navigation using labels, and new Catalog examples. Please refer to our [Server][server changelog] and [Web][web changelog] changelogs for a complete list of features and bug fixes.

## Intelligent Ink Annotation Splitting

<video src="/images/blog/2019/pspdfkit-web-2019-3/split-annotations.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

While working with ink annotations, you might often end up adding numerous strokes to entire pages of a document in a single run. If these strokes have the same color and thickness, they will all be included in a single ink annotation, even if they belong to different contexts. As a result, subsequent editing work can become more difficult.

To address this, we have added a new smart annotation splitting algorithm that will make this process easier and more effective than ever. Using a heuristic based on elapsed time and point distance, this new splitting strategy determines whether new ink strokes should belong to the current annotation or be split into a new, separate annotation. This way, you can continuously add ink strokes and let the algorithm automatically split them based upon their context.

## Eraser Tool

<video src="/images/blog/2019/pspdfkit-web-2019-3/eraser.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

With this release, we are also introducing a new eraser tool that allows you to remove ink annotation points using the pointer, so the erase operation is as easy as drawing.

Erasing is performed simultaneously in all the annotations below the pointer, and the changes in the annotations are saved as soon as the pointer is released.

## Streaming Search Results for Faster Search

![Streaming Search](/images/blog/2019/pspdfkit-web-2019-3/streaming-search.png)

We have made our search faster by streaming results page by page as they come in instead of computing the full list and only then displaying it. Responsiveness with medium and large documents is therefore improved, as search results will come in almost immediately when a user searches for a term. Both Server-based deployment and Standalone benefit from this enhancement, but it’s especially noticeable with WebAssembly deployment on older browsers such as Internet Explorer 11.

## Page Navigation with Labels

![Page Labels](/images/blog/2019/pspdfkit-web-2019-3/page-labels.png)

Each page in a PDF document can have a human-readable label associated with it. These kinds of labels, added by the document author, can result in a friendlier navigation experience by making content more easily identifiable.

Furthermore, page labels are also often used to assign a number to pages which otherwise would be identified by their page index. For example, the first few pages of a document could include a table of contents, introduction, etc., and the author may want the actual page number count to start from the sixth page of the document (e.g. pages i, ii, iii, iv, v, followed by 1, 2, 3).

PSPDFKit for Web now joins PSPDFKit for iOS and Android, as well as other PDF solutions, in supporting page labels instead of numbers: In the above example, the page with the label 2 would actually be page 7.

If the current page includes a label, it’s shown along with the actual page number in parentheses. When no label is available, only the page number is displayed.

Users can also enter a page label in the pagination widget of the main toolbar to jump to it directly.

## Examples: Obscure Annotations

We are continuously looking for new ways to extend functionality so that it opens new possibilities beyond what the standard PDF toolset provides. In line with this, one of our most recent additions has been the Custom Renderers API, which allows you to enhance or completely replace the default appearance of annotations.

This feature is showcased in [a new Catalog example][] that makes use of the Custom Renderers API to add two special custom annotations:

- An Obscure Annotation, which is basically a black rectangle that obscures the content behind it and may be used to, for example, hide specific parts of the content from the user.
- A Peek Hole Annotation, which obscures everything but the content behind it and could be helpful when you want to focus the user attention on specific parts of the page.

<video src="/images/blog/2019/pspdfkit-web-2019-3/obscure-peek.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

As shown by this example, you can easily provide enhanced capabilities to your PDF annotations. Keep in mind that this is custom behavior, and these kinds of annotations do not exist in the PDF specification. Therefore, such annotation customization is not included in the document when it’s exported and will not be displayed in any other viewer — only PSPDFKit for Web users can benefit from customization.

Along with all the new features, this release also includes numerous bug fixes and minor improvements. For a complete list of changes, see the [PSPDFKit for Web 2019.3][web changelog] and [PSPDFKit 2019.3 Server][server changelog] changelogs.

[server changelog]: /changelog/server/#2019.3
[web changelog]: /changelog/web/#2019.3
[a new catalog example]: https://web-examples.pspdfkit.com/obscure-annotations
