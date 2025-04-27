---
title: "PSPDFKit for Web 2019.4"
description: "Announcing PSPDFKit for Web 2019.4 — including the new Document Editor component, a complete visual overhaul, support for the Welsh language, and new Catalog examples."
preview_image: /images/blog/2019/pspdfkit-web-2019-4/article-header.png
preview_video: /images/blog/2019/pspdfkit-web-2019-4/features.mp4
section: blog
author:
  - Luna Graysen
author_url:
  - https://twitter.com/lunalovesbirds
date: 2019-07-31 9:00 UTC
tags: Web, Products
cta: web
published: true
---

We are pleased to announce PSPDFKit for Web 2019.4! This release introduces our new Document Editor component, a complete visual overhaul, support for the Welsh language, and new examples. Please refer to our [Server][server changelog] and [Web][web changelog] changelogs for a complete list of features and bug fixes.

## Document Editor

<video src="/images/blog/2019/pspdfkit-web-2019-4/document-editor.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

With this release, we are introducing a powerful new component for PSPDFKit for Web — the Document Editor. This feature enables users to add and remove pages, reorder pages, merge PDFs, and split PDFs — along with even more features. The Document Editor is available on both Standalone and Server-backed installations. If you’re interested in trying out this new component, please either [download a trial][pspdfkit trial] or contact our [Sales team][].

## Complete Visual Overhaul

<video src="/images/blog/2019/pspdfkit-web-2019-4/dark-theme.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

We have revamped our visual language with new icons, new default styling, and a built-in dark mode. By default, this makes PSPDFKit for Web look more modern for our users while still giving them the power to customize as needed.

Please ensure you check out the [migration guide][] for more information. We also have some additional features planned for further on down the road; these include the tweaking of all control types and the unification of font sizes and margins/paddings.

## Welsh Language Support

![A screenshot of the Document Editor UI with controls translated to Welsh](/images/blog/2019/pspdfkit-web-2019-4/cy.png)

We are continuously looking for new ways to extend functionality and accessibility for users around the world. So in this release, we’ve added support for the Welsh (cy) language.

## WASM Cache Improvements

We added content hashing to more artifacts, including the WASM files, which allows you to enable advanced long-term caching on your web server if you use Standalone. If you use Server-backed PSPDFKit, these changes are enabled out of the box. We’ve also made changes to fully support [code caching for WebAssembly][], which is coming to Chrome soon.

## Examples: Document Editor and Dark Mode

![A screenshot of the two new icons for the new Catalog examples](/images/blog/2019/pspdfkit-web-2019-4/examples.png)

The [Document Editor Catalog example][] demonstrates key features released in this version. For example, for dark mode, we added a new Catalog example that demonstrates a full UI switch to a [dark color scheme](https://web-examples.pspdfkit.com/dark-mode).

Along with all the new features, this release also includes numerous bug fixes and minor improvements. For a complete list of changes, see the [PSPDFKit for Web 2019.4][web changelog] and [PSPDFKit 2019.4 Server][server changelog] changelogs.

[server changelog]: /changelog/server/#2019.4
[web changelog]: /changelog/web/#2019.4
[pspdfkit trial]: https://pspdfkit.com/try/
[sales team]: https://pspdfkit.com/sales/
[migration guide]: https://pspdfkit.com/guides/web/current/migration-guides/2019-4-migration-guide/
[code caching for webassembly]: https://v8.dev/blog/wasm-code-caching
[document editor catalog example]: https://web-examples.pspdfkit.com/document-editor
[dark color scheme]: https://web-examples.pspdfkit.com/dark-mode
