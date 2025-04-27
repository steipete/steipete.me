---
title: PSPDFKit 4.1 for iOS
pubDate: 2014-11-05T12:00:00.000Z
description: >-
  Version 4.1 features many detail improvements and we've updated everything to
  work well with the new iOS 8.1. Here are some of the highlights:
tags:
  - pspdfkit
source: pspdfkit.com
AIDescription: true
---


Version 4.1 features many detail improvements and we've updated everything to work well with the new iOS 8.1. Here are some of the highlights:

## Natural Drawing

You'll love this new default. Your drawings will look much more realistic, and are still fully backwards compatible to 3rd-party apps.

![Natural Drawing](/assets/img/pspdfkit/2014/pspdfkit-4-1/natural-drawing.gif)

## Text Selection Tweaks

We now snap to full words by default. This can be disabled with the `textSelectionShouldSnapToWords` however we believe it's a great new default and enhances the user experience.

![Text Selection](/assets/img/pspdfkit/2014/pspdfkit-4-1/text-selection.gif)

## Localization Pluralization

There are more languages than english, and [PSPDFKit already supports 21 different ones](/guides/ios/current/features/localization/). Starting with 4.1 we also have rules for advanced pluralization. Did you know that some languages have different plural words depending on 1, 2, 3 or multiple objects? We now correctly output that, which is especially nice when using search. (We use Apple's [stringsdict file format](https://developer.apple.com/library/ios/documentation/MacOSX/Conceptual/BPInternational/StringsdictFileFormat/StringsdictFileFormat.html) to define language plural rules.)

## API refinements

We're working on reducing our singleton-use - this release already moves many objects to the new `PSPDFKit` object. We'll continue to work on this in future releases. The gallery is now configurable via `PSPDFGalleryConfiguration` in `PSPDFConfiguration`, and the `PSPDFSignatureStore` is now a protocol which can be easily customized. We've also reviewed all headers to ensure everything can be called from a C++ context (this is option, we just make it easier if you use it). We've also adopted `UIAlertController` and wrote a new wrapper so things also work on iOS 7. Oh, and we made that one [open source](https://github.com/steipete/PSTAlertController), so you can use it in your app logic as well!

## Details, Details, Details

The inline search manager now automatically focuses the first search result. We also added a slight delay to make the search flow better and more visually pleasing. The gallery is now smarter and can resolve absolute paths on the device as well. Yosemite added a few new elements for annotation editing in Preview, and we improved our code so that the new "bended arrows" are displayed correctly. We've added a new `PSPDFNetworkActivityIndicatorManager` so that little spinning control now correctly updates while your gallery videos load. There are also many bug fixes and workarounds, especially for some UIKit issues Apple introduced in iOS 8.
