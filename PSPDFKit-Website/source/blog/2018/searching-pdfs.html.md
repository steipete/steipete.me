---
title: "Searching PDFs"
description: Searching PDFS and how we help you handle edge cases and avoid common pitfalls.
preview_image: /images/blog/2018/searching-pdfs/article-header.png
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2018-04-03 10:00 UTC
tags: Development, PDF, Android, iOS, Viewer
published: true
---

Searching a PDF for text is something we all need to do with some regularity. It is often one of the first and most obvious features an application provides to a user, and users expect it to be fast and smart and require as little effort as possible. Naturally, our SDKs help you deliver on those expectations. Below you can see some searching in our very own [PDF Viewer](https://pdfviewer.io).

<video src="/images/blog/2018/searching-pdfs/searching.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

This blog post will describe some of the special cases our SDK takes care of for you, including diacritic insensitivity, line breaking, and searching large documents.

## Smart Searching

Our search API can match results containing [diacritics](https://en.wikipedia.org/wiki/Diacritic), even if the search terms do not and vice versa. For example, searching for the word “naive,” one would expect to find a sentence such as “It is well for the heart to be naïve and for the mind not to be.” The “i” in the search term doesn’t contain the [diaeresis](<https://en.wikipedia.org/wiki/Diaeresis_(diacritic)>), but in the text searched, it does. Likewise, searching for “naïve” also finds the same text, along with any occurrences of “naive.”

Words wrapped on column or page boundaries present another case where one would expect to find text, even though it might be split across lines due to dashes or hyphens.

Take the following text from [Riker Ipsum](http://ben174.github.io/rikeripsum/) as an example:

```
Damage report! Your shields were fail-
ing, sir. The unexpected is our norma-
l routine. Maybe we better talk out h-
ere; the observation lounge has turne-
d into a swamp.
```

The words “failing,” “normal,” “here,” and “turned” should be found without us having to search for “fail-ing,” “norma-l,” “h-ere,” and “turne-d.”

In addition to finding the matching text in a document, it is often useful to present the match in context to the user. A snippet of text surrounding the matched term can convey useful information to the user and is provided with each search result. Presenting the search results for the phrase “the house” may benefit from some text preceding and following the matched search term. For example, “and all through the house not a creature was stirring” gives the user additional information, which helps them understand the context of their result without necessarily having to move to the page containing it. The size of the snippet can be controlled via the API too.

Searching large documents efficiently and without blocking the application is something users expect in well-written modern applications. The results can be streamed to the UI, thereby allowing the user to refine or change their search at any time. With our asynchronous search API, you can also cancel the search operation at any time.

<video src="/images/blog/2018/searching-pdfs/long-search.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Of course, you may wish to have exact search results. Search options make it possible to specify that diacritics must be precisely matched, case is not ignored, search results are limited to a maximum number, certain pages and the search order are prioritized, and the resulting snippet should be a particular size.

## Further Reading

For in-depth examples of how to achieve all the results detailed above, take a look at our API guides for text searching on [Android](https://pspdfkit.com/guides/android/current/features/text-search) and [iOS](https://pspdfkit.com/guides/ios/current/features/text-search).
