---
title: "PSPDFKit 1.4 for Android"
section: blog

author: Peter Steinberger
author_url: https://twitter.com/steipete
date: 2015-09-24 12:00 UTC
tags: Android, Features, New Release, Products
published: true
---

Just when you get used to the improvements we made in the last release, we surprise you with more on Android. With another great update just released, we’re really improving things all over the place on Android.
READMORE

For those waiting for Annotations, they’ll be here soon. We are hard at work on shipping annotations and plan to release them with version 2. We just wanted to get the latest and greatest on the viewing experience in your hands.

## New Zoom API

We added a new zooming API that allows you to programmatically set the scale of the current page and zoom directly onto parts of the page. `PSPDFFragment` adds three new methods:

* With `zoomTo(int x, int y, ...)` you can now zoom the current page, defining the desired target zoom level and focus points;
* A similar method `zoomBy(int x, int y, ...)` allows you to zoom the page by a factor (e.g. increase scale by 2);
* Using `zoomTo(RectF, ...)` you can now zoom to particular areas of a page such as annotations, a particular paragraph or section of text, and more.

![Zooming in action](/images/blog/2015/pspdfkit-android-1-4/zoom.gif)

Furthermore, we have extended `PSPDFConfiguration` by two new parameters:

* `maxZoomScale` allows you to control the maximum zoom scale. Using this parameter also gives you the ability to disable the zoom by setting it to 1;
* `startZoomScale` allows the the document to be opened to an already given pre-zoomed scale.

## Data Providers

We made the DataProvider class into an interface, making it even more flexible. We added a convenience class called `MemoryDataProvider` so byte arrays can be wrapped easily. This is only the beginning though. We plan on adding several other data providers in the near future, particularly around on-the-fly decryption for secure document storage.

## Guides

We heard many requests from you to improve documentation and have been working hard on doing so for the past couple months. With this release, we’re very excited to announce the launch of our new documentation platform. Please check it out at [pspdfkit.com/guides](https://pspdfkit.com/guides). We spent a lot of time on improving and organizing all of our existing documentation in one place. We are really happy with how the new guides turned out and hope you like them too!

## Catalog Improvements

![Document Switcher](/images/blog/2015/pspdfkit-android-1-4/document_switcher.gif)

![Split Screen Interface](/images/blog/2015/pspdfkit-android-1-4/document_split.gif)

We know the Catalog really speeds up your development, so we’ve added many new code examples. You can now find more common use cases as examples in the catalog such as `DocumentSwitcherExample`, `SplitDocumentExample`, `RandomDocumentReplacementExample`, `MemoryDataProviderExample`, and `CustomDataProviderExample`. Keep a look out for more examples as we continue to improve the framework.

## Details, Details, Details

![Search in Material Design](/images/blog/2015/pspdfkit-android-1-4/material-search.gif)

We updated the search input field to match Google’s Material design as well as all of the corresponding required dependencies to their latest versions. We also added support for page labels in the latest version, and have now made this feature optional. If you happen to have a document where this was incorrectly configured, it can now be conveniently disabled. Finally, we tweaked the scroll bounce behavior to fall more in line with the default Android experience.  As always, if you want, [You can read the full changelog here.](https://pspdfkit.com/changelog/android/#1.4.0)
