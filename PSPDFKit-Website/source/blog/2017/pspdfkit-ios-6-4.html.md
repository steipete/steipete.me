---
title: "PSPDFKit 6.4 for iOS"
description: Introducing PSPDFKit 6.4 for iOS. RTL Support. Image Editor. FTS 5. Swift Enhancements.
section: blog
author:
  - Matej Bukovinski
  - Stefan Kieleithner
author_url:
  - https://twitter.com/bukovinski
  - https://twitter.com/steviki
date: 2017-01-31 18:00 UTC
tags: iOS, Development, Products
published: true
---

Introducing PSPDFKit 6.4 for iOS. This release includes support for Right-to-Left languages such as Arabic, a custom image editor, the ability to use FTS 5, Swift interoperability enhancements and many other improvements. Take a look at our [changelog](/changelog/ios/#6.4.0) to read up on all the changes, improvements and fixes in this release.

READMORE

## Right-to-Left User Interface
In this release we added support for right-to-left languages by making PSPDFKit's user interface ready to be fully mirrored. On top of the language support, localizations for Arabic were also added. These improvements made our code more future-proof and robust.

![Arabic](/images/blog/2017/pspdfkit-ios-6-4/arabic.png)

## Image Editor

We’ve decided to ship our own image editor! Now you can zoom, crop and rotate your images to get the perfect image annotation. In addition, you can also use this new image editor function when creating a new page to get the perfect image that you desired.

Before the update, we used the editing capability of `UIImagePickerController` for inserting image annotations. There were no editing function for images when creating new pages at all. We made the improvement because we noticed that the default editor was limited and not flexible enough, as it restricted image cropping only to a square without any image rotation capability.

![Image Editor](/images/blog/2017/pspdfkit-ios-6-4/image-editor.gif)

## Search Annotations

It's now easier than ever to find the annotations you are looking for. Type your search directly in the annotation view controller, and you've got it! You no longer need to look through the entire document for just a single annotation.

![Search Annotations](/images/blog/2017/pspdfkit-ios-6-4/search-annotations.gif)

## Upgrades to Indexed Full Text Search

By [using `PSPDFLibrary`][], you were able to get fast and efficient full text search via a simple API. With this release, we reworked PSPDFLibrary internals. This means better speed (up to 10x) and lower memory usage. There's no need for you to hesitate even when throwing large document libraries at it. We've also upgraded to [SQLite's FTS 5][] from FTS4.

With FTS 5, we got a lot more improvements, like:

- Lower memory usage: Due to its incremental nature, extraction of data in FTS 5 has a lower peak memory allocation than FTS 4.
- Faster search: With smart heuristics, the new engine can now determine if it is possible to extract results without inspecting the entire database.
- Faster insertions: Enqueuing documents to [`PSPDFLibrary`][] is now much quicker in cases where additional operations need to be performed on the FTS tables.
- Fewer bugs: SQLite's FTS4 had a few issues with false positive results that have been resolved with FTS 5.

<blockquote style="font-size: 15px; border-left: none; background: #f6f6f6; font-style: italic;">
    <p>Since we've migrated to FTS5, all your documents will need to be reindexed.</p>
</blockquote>

## Swift Enhancements

In this release we improved several parts of our API for better Swift support. We adjusted the initializers for `PSPDFDocument` for a more streamlined experience in Swift. Additionally we made the `PSPDFMetadata*` keys nicer to use.

## More Improvements

We always care about details, so you'll find various improvements all over the place in this release. For example, our cache now checks the battery and doesn't do expensive operations when battery is low or the device is in low power mode. Scrolling pages that include a lot of annotations is now smoother than ever, and we've tweaked the highlight icon:

<img alt="New Highlight Icon" src="/images/blog/2017/pspdfkit-ios-6-4/new-highlight-icon.png" width=380 />

## What's Next

We've already started working on PSPDFKit 6.5 for iOS with a big focus on [Forms](/pdf-sdk/ios/forms/). We've rewritten our parser from scratch to be faster, more correct and so it can be used across our iOS, Android and Web SDKs. There's more, but we can't spoil everything yet! 😇

[using `PSPDFLibrary`]: https://pspdfkit.com/guides/ios/current/features/indexed-full-text-search/
[`PSPDFLibrary`]: https://pspdfkit.com/api/ios/Classes/PSPDFLibrary.html
[SQLite's FTS 5]: https://sqlite.org/fts5.html
