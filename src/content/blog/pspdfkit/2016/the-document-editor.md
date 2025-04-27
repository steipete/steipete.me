---
title: "The Document Editor"
pubDate: 2016-03-31T12:00:00.000Z
description: "With the release of PSPDFKit 5.3 for iOS and PSPDFKit 2.3 for Android we're not only launching large updates to our SDK for both platforms, we're—for the first time—also launching a completely new component simlutaneously on both platforms. This was a collaboration amongst almost 20 people, separated into multiple teams, and we were only able to pull this off in a relatively short timeframe due to the substantial amount of code shared between the two platforms. READMORE"
tags:
  - pspdfkit
source: pspdfkit.com
---

::ai[With the release of PSPDFKit 5.3 for iOS and PSPDFKit 2.3 for Android we're not only launching large updates to our SDK for both platforms, we're—for the first time—also launching a completely new component simlutaneously on both platforms. This was a collaboration amongst almost 20 people, separated into multiple teams, and we were only able to pull this off in a relatively short timeframe due to the substantial amount of code shared between the two platforms. READMORE]

With the release of PSPDFKit 5.3 for iOS and PSPDFKit 2.3 for Android we're not only launching large updates to our SDK for both platforms, we're—for the first time—also launching a completely new component simlutaneously on both platforms. This was a collaboration amongst almost 20 people, separated into multiple teams, and we were only able to pull this off in a relatively short timeframe due to the substantial amount of code shared between the two platforms.
READMORE

## The Document Editor

<img alt="The Document Editor" src="/images/blog/2016/the-document-editor/document-editor-illu.png" style="width:600px;height:auto;margin:1em auto;">

With the Document Editor you can add, remove, reorder, clone and rotate pages and then save the document. This is great for adding blank pages to get more space for adding notes, or extracting a page that you want to send to someone via email. Previously some of that was possible using `PSPDFProcessor`, but it was relatively slow, limited in functionality and could result in some of the document metadata getting lost along the way. The new Document Editor is a complete rewrite and re-design of both the functionality and the API. It also features a nicely integrated editor on both platforms. The Document Editor is available as a separate component—if you’re interested in adding it to your PSPDFKit License, please [contact our sales team](mailto:sales@pspdfkit.com) for details.

[Check out our features page to see it in action on iOS and Android.](/features/document-editor/ios/)



## PSPDFKit 5.3 for iOS

### New Status Views

The `PSPDFViewController` now shows the status of loaded documents and correctly reports things like unreadable documents to the user. While working on that we also gave our password enter view a facelift to better match the modern iOS UI syle.

![Document States](/assets/img/pspdfkit/2016/the-document-editor/document-states.gif)

### Zooming Search Results

Tapping on a search result now conveniently zooms into the search result instead of merely showing it in the view. This was already possible in earlier versions (in fact one of the many samples in PSPDFCatalog shows how it’s done), however we liked this functionality so much that we made it the new default. There's a new `searchResultZoomScale` property in `PSPDFConfiguration` to customize this. To restore the previous behavior, simply set it to `1`.

We also replaced the `smartZoomEnabled` property with a more flexble `doubleTapAction` and made our code more robust in case you're implementing a complete custom toolbar with a custom search button.

The search popover is now cached, so re-opening it not only remembers the last search term (which it already did before) but in addition retains the search results and scrolling position—bypassing the need for a new search cycle and thus providing instant results. While this change is not a huge one, we’re sure it’s one that your users will appreciate.

Searching across multiple lines for words that are separated with a dash now works more reliably, and we're getting significantly better results than Preview or even Adobe Acrobat. We also made various improvements to the optional indexed search implemented in `PSPDFLibrary`.

![Searching](/assets/img/pspdfkit/2016/the-document-editor/pspdf-search.gif)

### Exporting Pages

We've tweaked our sharing dialog used for sending a message or an email to allow exact configuration of the export page range. While you could only choose between visible pages and the whole document before, it’s now possible to select a custom page range, too.

![Email Range Selection](/assets/img/pspdfkit/2016/the-document-editor/email-range.gif)

### Bar Button Item API

We've re-thought the API we provide to configure the navigation bar and moved this functionality into a custom subclass of `UINavigationItem`. Look up `PSPDFNavigationItem` to see how you can configure the navigation bar depending on the current view state. Since this is a frequently used API we made sure that the old calls, while deprecated, still work for this release.

### Details

We've fixed a list of smaller issues, made rendering faster and more memory efficient, updated various interfaces to a more modern API, and made the document play along when you need a custom activity source to share on Facebook or Twitter. We also added workarounds for various UIKit bugs. In case the new `SFSafariViewController` can't show content, we now automatically fall back to our own internal web browser. (e.g. when you're trying to show local content - a current limitation of Apple's new Safari view controller.)

In PDF Form pulldowns (also known as "choice elements") we now wrap things into multiple lines, instead of cutting the text off. This should improve the user experience when using Forms with extra wordy languages, like our beloved German.

You may have noticed that the Visual Debugger in Xcode 7.3 doesn't work when using PSPDFKit. We submitted [rdar://25311044](https://openradar.appspot.com/25311044) to Apple and are confident that a fix is coming in one of the next Xcode releases. Meanwhile, we work around this bug in 5.3 ourselves. As always, you'll find [the full change log]/changelog/ios/#5.3.0) on our website.

## PSPDFKit 2.3 for Android

### Permissions

With the 2.3 update, we now handle document permissions (like limitations to copy text) correctly, just like we already did on iOS. There's also new API on the document `PSPDFDocument#getPermissions` to query for permissions.

### New Page Drawable API

The new `PSPDFDrawable` allows the drawing of arbitrary content on top of rendered pages. There's also a convenient `PSPDFDrawableProvider` which can serve one or multiple drawables for a page, and which can be managed via `PSPDFFragment#registerDrawableProvider`, `PSPDFFragment#unregisterDrawableProvider`, and `PSPDFFragment#clearDrawableProviders`. The new `PSPDFSearchResultHighlighter` (which is a `PSPDFDrawableProvider`) is one good example of the capabilities of this new API, and shows rendering of objects in PDF coordinates and even drawable animations.

![PSPDFSearchResultHighlighter](/assets/img/pspdfkit/2016/the-document-editor/search-result-highlighting.gif)

### New Search API

The new text search API allows manual search within a document and the possibility to build custom search implementations. `PSPDFTextSearch` abstracts the task of searching in a document, and returns `PSPDFSearchResult` objects that can be used in `PSPDFSearchResultHighlighter` for visually highlighting one or multiple search results using the new drawable API.

We've also moved the `PSPDFSearchViewInline` and `PSPDFSearchViewModular` search views into the new package `com.pspdfkit.ui.search`, which contains all search related classes.

### More Control

The new `PSPDFFragment#scrollTo` allows scrolling to any rect on the page. With `PSPDFActivity#setHudViewMode(HudViewMode)` the HUD can be shown/hidden programmatically, and there's also a new `PSPDFKitActivityConfiguration#setHudViewMode(int)` that makes showing/hiding HUD and system bars configurable. We now also allow automatically showing of the HUD at the first and last page of the document using `HUDViewMode#HUD_VIEW_MODE_AUTOMATIC_BORDER_PAGES`.

![PSPDFSearchResultHighlighter](/assets/img/pspdfkit/2016/the-document-editor/hud-at-first-page.gif)

### Details

If text-to-speech is used but fails for some reason (e.g. no internet connection) we now properly handle and forward that error instead of ignoring it. The management for the context sensitive toolbars is much more consistent now. Since empty free text annotations don't make much sense, we automatically clean these up if you happen to add them but then decide to not enter text after all. We've also fixed a bunch of other edge cases, problems and tweaked the performance. This should be especially noticable for documents with very large and complex outlines. We've also further fine-tuned the scroll interaction of our custom scroll view to make the interaction even better. Fling gestures are now more precise. Check out [the change log](/changelog/android/#2.3.0) for a full list of changes.
