---
title: "PSPDFKit for Web 2017.1"
description: PSPDFKit for Web 2017.1, now with search.
section: blog
author:
  - Philipp Spiess
author_url:
  - https://twitter.com/PhilippSpiess
date: 2017-01-25 12:00 UTC
tags: Web, Products
published: true
---

Introducing PSPDFKit for Web 2017.1, the first release of this year. This release adds a strongly requested feature and we're thrilled to show it to you: We've added search.

READMORE

## Search

Search has been by far our most requested feature. One of the core features of PSPDFKit for Web is our support for streaming documents. This allows you to open very large documents within a few seconds by avoiding the need to download the whole PDF file.

One of the challenges that comes with this approach is that we cannot rely on the client's data to produce correct search results - we might only have the first few pages of text from a large document. This is why the native browser search fails: It simply does not know what the text on the following pages is.

To fix this, we've developed a custom search solution, with lots of little details to make it feel exactly like the native browser search you're familiar with.

<a href="/web">
  <img src="/images/blog/2017/pspdfkit-web-2017-1/desktop.gif" alt="Desktop Search Preview" />
</a>

Search mode can be entered by either clicking on the search icon in the toolbar or by pressing the established shortcuts: `ctrl+f` or `cmd+f`. The search field will pop up instantly and allows you to search like you are used to on a regular website. When you enter a search term, we seamlessly stream the query to the PSPDFKit Server to calculate the results. This also means that you get the same accuracy as on our iOS and Android framework.

As mentioned earlier, we invested a great deal of effort to keep the experience consistent between your native browser search and the new PSPDFKit for Web search. This makes it possible to repeatedly press the enter key when you're in the search field to cycle between the matches. You can use the `esc` key to close the current search and can use the shortcuts to always focus the field.

One aspect of the new PSPDFKit for Web search that surpasses native search is our mobile support. To access the in-page search on mobile browsers, the user first has to find the option, which is usually hidden away behind a menu. Since searching a PDF is one of the core features that you need to be productive, it was one of our top priorities to make it accessible even on small screens, with a responsive interface that works great on mobile.

<a href="/web">
  <img src="/images/blog/2017/pspdfkit-web-2017-1/mobile.png" alt="Mobile Search Preview" width="320" />
</a>

## Custom Dropdown

When editing a text annotation and selecting a new font, it was hard to know how the font you choose will actually look like.
We knew that a custom dropdown with a preview of the font would solve this issue, but it was also very important to maintain a great user experience. So we've created a custom dropdown with all the affordances of a regular select input, but with a much more helpful interface.

<a href="/web">
  <img src="/images/blog/2017/pspdfkit-web-2017-1/dropdown.png" alt="Custom Dropdown" width="560" />
</a>

If you're having further questions about this release or anything else, feel free to always reach us at web@pspdfkit.com.
