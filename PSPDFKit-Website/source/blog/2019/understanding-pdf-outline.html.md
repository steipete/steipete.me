---
title: "Understanding the Difference between Bookmarks and the Outline in a PDF"
description: "Bookmarks vs. outline elements: Not everything is what it seems."
preview_image: /images/blog/2019/understanding-pdf-outline/article-header.png
section: blog
author:
  - Oscar Swanros
author_url:
  - https://twitter.com/Swanros
date: 2019-05-06 8:00 UTC
tags: PDF
published: true
secret: false
---

Think of your favorite book in its physical format. Most books have a section that _outlines_ the contents of the book with section titles and the pages where they can be found. Being able to quickly glance at a document’s contents can really help with the experience of consuming content — especially when dealing with lengthy pieces of work.

In the same way, the PDF spec defines support for document outlines that let users navigate documents with ease and in a speedy manner, allowing them to jump from one section of a document to another one immediately.

One of the main characteristics of the document outline (also referred to as a table of contents) is that its structure resembles a tree of items. That is, an outline item can have subitems. This allows for the outline to be able to present a rather detailed view of the contents of the entire document in a really convenient way.

## Outlines and Bookmarks

Outlines and bookmarks often confuse those who are not familiar with how PDFs work, as they’re pretty similar in both definition and how they function. However, they do have subtle differences that can end up frustrating someone if they’re not taken into consideration.

### Is a Bookmark an Outline Element?

**Fact #1: The PDF spec conflates outline elements and bookmarks. It states the following.**

> The outline consists of a tree-structured hierarchy of outline items (sometimes called bookmarks), which serve as a visual table of contents to display the document’s structure to the user.

As a matter of fact, Adobe’s software treats outline elements and bookmarks the same, which can be even more confusing. When you open a PDF in Acrobat and click on the bookmark icon, what it shows you is actually the outline of the PDF. When you add a bookmark to the document using Acrobat, what it really is doing is modifying the document’s outline to include the user-defined item.

**Fact #2: The PDF spec contains no official way to support bookmarks, which means every PDF software vendor gets to decide how they implement bookmark support.**

You can test this if you have a copy of Acrobat. Open a PDF in Acrobat, open the Bookmarks (Outline) panel, and add a new bookmark in the current page you’re on. Save the PDF and then open the updated document in a third-party PDF reader (in this blog post I’ll be using `Preview.app` for the Mac, but your results shouldn’t vary too much if you’re using a different PDF viewer) Click on the View Menu icon and select Bookmarks from the dropdown menu. You’ll be presented with an empty list.

But if you select Table of Contents from that menu, you’ll see the “bookmark” you created in Acrobat listed there.

| “Bookmark” on Acrobat                                                                                               | `Preview.app` Bookmarks                                                                                                                | `Preview.app` Table of Contents                                                                                               |
| ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| <img src="/images/blog/2019/understanding-pdf-outline/acrobat_bookmark.png" alt="The Bookmarks panel on Acrobat."/> | <img src="/images/blog/2019/understanding-pdf-outline/preview_bookmark.png" alt="Preview.app trying to display Acrobat’s bookmarks."/> | <img src="/images/blog/2019/understanding-pdf-outline/preview_contents.png" alt="Preview.app showing the document outline."/> |

You can also test it the other way around. Open the PDF first in `Preview.app` and press ⌘ + D to add a bookmark on the current page. Save the PDF and open it with Acrobat. The bookmark you added is nowhere to be found.

### Philosophical Differences

So what’s all this about? Why can’t PDF software vendors agree on a way to handle bookmarks in PDFs across the industry? Well, the answer is that everyone has their own idea of what a bookmark is.

Let’s go back to the example at the beginning of this post, where you were thinking of your favorite book in a physical format. When you read a really interesting passage in that book, you might be inclined to highlight that page for future reference. You bookmark it.

Would you say that highlight should be part of the book’s table of contents?

For some people, it should. For others, it would be difficult to argue that everyone reading the same book in the future would be interested in the same passage that you highlighted.

What’s for sure, though, is that there’s no _right_ answer. As books, PDF documents are used in a wide range of industries and applications, all with different objectives. There’s no one-size-fits-all approach for how references to a page should be saved, so the interpretation is up for grabs for any vendor that wants to include some sort of bookmarking support in its software — if at all.

PSPDFKit views the outline as part of the document: It provides a hierarchical structure to it, along with a way for users to navigate its different sections in a nimble manner. Bookmarks, on the other hand, are seen as information that’s laid on top of the document. They help the user, and they’re heavily context-dependent, without hierarchical order.

Unfortunately, this means that the bookmarking experience is certainly going to vary for the end user when they carry the same document across platforms and different vendor software (i.e. Acrobat on the Mac, but PDF Viewer on their iPad).

PSPDFKit tries to be a good citizen, so [we’ve gone to greath lengths][] to make sure that bookmarks created with `Preview.app` are available for our users, by storing them inside the PDF file in a format that can be shared across platforms.

Bookmarks created with Acrobat, on the other hand, are _really_ outline elements, which we support. They won’t, however, be available as bookmarks on PSPDFKit.

## Navigating a Document with PSPDFKit

PSPDFKit can display document outlines via [`PSPDFOutlineViewController`][]. This view is interactive, and it lets the user navigate the outline of a document.

![Example of PSPDFOutlineViewController displaying a document outline](/images/blog/2019/understanding-pdf-outline/outline_view_controller.png#img-width-50;img-no-shadow)

Most outline items define a simple [GoTo action][] that jumps to the appropriate page index when selected. The PDF spec also defines a way to specify the location of the window on the page and the zoom level to be applied when the user is taken to the page associated with the outline item. The latter can be achieved via PDF Destinations, which are currently not supported by PSPDFKit.

PSPDFKit offers a way to programmatically access the outline of a document with the [`PSPDFOutlineParser`][] and [`PSPDFOutlineElement`][] classes. An instance of `PSPDFOutlineParser` is automatically created for you when you query the document’s outline via [`-[PSPDFDocument outline]`][`pspdfdocument outline`].

For instance, consider the following document outline:

- QuickStart Guide
- Introduction
- Getting Started
- Integration - Swift 4 - Objective-C - More
- ...

Get a reference to the Objective-C item and execute its GoTo action:

[==

```swift
let mainOutline = document.outline
if let objcElement = mainOutline?.children?[3].children?[1] {
  pdfController.execute(objcElement.action, targetRect: .zero, pageIndex: pdfController.pageIndex, animated: true, actionContainer: nil)
}
```

```objc
PSPDFOutlineElement *mainOutline = document.outline;
PSPDFOutlineElement *objcElement = mainOutline.children[3].children[1];

[pdfController executePDFAction:objcElement.action targetRect:CGRectZero pageIndex:pdfController.pageIndex animated:YES actionContainer:nil];
```

==]

The example above programmatically retrieves an outline element and executes its associated PDF action, mimicking what [`PSPDFOutlineViewController`][] does when the user interacts with it. Currently, PSPDFKit offers read-only support for the document outline.

You can read more about [how PSPDFKit supports bookmarks on our blog][].

## Conclusion

When it comes to navigating a document, there’s no one-size-fits-all solution. Some people may prefer the hierarchical structure that an outline provides. Others will mainly prefer interacting with one-off page markers that they can arrange how they please and store where they want.

However, it all comes down to offering a good experience for the final user. The approach we take at PSPDFKit strikes a nice balance that offers compatibility with one of the most popular applications on the planet, by supporting `Preview.app` bookmarks, but still respects the PDF specification by allowing the user to interact with “bookmarks” created with Acrobat.

[`pspdfoutlineviewcontroller`]: https://pspdfkit.com/api/ios/Classes/PSPDFSearchableTableViewController.html
[goto action]: https://pspdfkit.com/guides/ios/current/annotations/pdf-actions/
[`pspdfoutlineelement`]: https://pspdfkit.com/api/ios/Classes/PSPDFOutlineElement.html#/c:objc(cs)PSPDFOutlineElement(py)action
[`pspdfdocument outline`]: https://pspdfkit.com/api/ios/Classes/PSPDFDocument.html#/c:objc(cs)PSPDFDocument(py)outline
[`pspdfoutlineparser`]: https://pspdfkit.com/api/ios/Classes/PSPDFOutlineParser.html
[how pspdfkit supports bookmarks on our blog]: https://pspdfkit.com/blog/2016/just-a-simple-bookmark/
[we’ve gone to great lengths]: https://pspdfkit.com/blog/2016/just-a-simple-bookmark/
