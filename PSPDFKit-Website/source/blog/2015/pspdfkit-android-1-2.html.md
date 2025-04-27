---
title: "PSPDFKit 1.2 for Android"
section: blog

author: Peter Steinberger
author_url: https://twitter.com/steipete
date: 2015-06-03 12:00 UTC
tags: Android, Features, New Release, Products
published: true
---

The 1.2 release for Android is our biggest release yet. Our team has done an amazing job and it's time for us to show you some of the highlights in this version.
READMORE

## Theming Support

Google's [Material Design](http://www.google.at/design/spec/style/color.html) is all about being bold and colorful. With our new theming support, supporting different themes is easier than ever. Next to theming, we also added a night mode for the PDF renderer itself so you can implement the perfect dark theme. This is also part of our new sample catalog.

![Night Mode](/images/blog/2015/pspdfkit-android-1-2/nightmode.gif)

## Text Selection

Text selection makes working with a document feel more natural and is useful for quick dictionary lookups or copying text onto the clipboard. Every developer with experience in working with PDF files knows the difficulties of building fast (and natural) text selection. We are no different and it took us quite a while to get this right. As a nice side effect, figuring out text selection also improved text search speed, since both features extract and handle text.

![Text Selection](/images/blog/2015/pspdfkit-android-1-2/text-selection.gif)

## Inline Search

Staying on the topic of search; prior to 1.2, we used a modal search view. Although this works well, it isn't the best choice for all form factors. Going forward, especially for phones and smaller tablets, inline search will feel much more natural. You can now choose both, and by default we make a smart predictive decision on where to use what depending on the device type.

![Inline Search](/images/blog/2015/pspdfkit-android-1-2/inline-search.gif)

## Improved Scrolling

On iOS, Apple's `UIScrollView` has logic that detects if a scroll is mostly vertical or horizontal, and locks the other direction. Usually, this is not even noticeable but improves readability, especially when reading a multi-column document and are zoomed in. Since such a feature is not a built-in on Android, we had to write it ourselves from scratch, resulting in a better overall scrolling experience. In fact, since Android's scroll view is quite bad as well, we re-built it from scratch as well. We found such path to be the only way to deliver a 60 fps, smooth scrolling experience. Due to such decision, we can now deliver that exact experience, even on older hardware.

![Scroll Direction Lock](/images/blog/2015/pspdfkit-android-1-2/scroll-direction-lock.gif)

## Multimedia Gallery

On iOS, we have a very powerful multimedia gallery that can show images, videos, audio and web pages. We're not quite there yet at feature parity on Android, but with the 1.2 release, we took a big step in that direction. Our new gallery can now show remote or local videos and additionally supports YouTube.

![Gallery](/images/blog/2015/pspdfkit-android-1-2/gallery.gif)

## Further Roadmap

We're moving at light-speed towards delivering the best PDF viewer framework for Android and are already working on supporting the creation and editing of annotations. We know that's a feature many people love on iOS and we want to deliver the same quality on Android. Expect more news on this later this year.
