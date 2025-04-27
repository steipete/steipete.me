---
title: PSPDFKit 4.4 for iOS
pubDate: 2015-04-29T12:00:00.000Z
description: >-
  We are happy to finally ship PSPDFKit 4.4 for iOS. This release comes as a new
  dynamic framework and includes many detailed improvements. It's over 1000
  commits more than PSPDFKit 4.3.5 for iOS. READMORE
tags:
  - pspdfkit
source: pspdfkit.com
AIDescription: true
---


We are happy to finally ship PSPDFKit 4.4 for iOS. This release comes as a new dynamic framework and includes many detailed improvements. It's over 1000 commits more than PSPDFKit 4.3.5 for iOS.
READMORE

## Dynamic Framework

Since iOS 8, Apple added support for [dynamic frameworks](https://developer.apple.com/library/mac/documentation/DeveloperTools/Conceptual/DynamicLibraries/000-Introduction/Introduction.html) - Apple's [Building Modern Frameworks](https://developer.apple.com/videos/wwdc/2014/?id=416) talk from WWDC 2014 is a great introduction. Some of the benefits of a dynamic framework are more stability, a smaller binary overhead, and faster app startup times. If you are already exclusively supporting iOS 8 then you should definitely make the switch.

## Symbol visibility and nullability annotations

We also took time to annotate our entire header set with [symbol visibility](https://developer.apple.com/library/mac/documentation/DeveloperTools/Conceptual/CppRuntimeEnv/Articles/SymbolVisibility.html) to only export what you actually require. This change also makes the binary smaller and improves link times. While working on this, we did a large audit of our exported headers and did some house cleaning in many areas. It is now much easier to find the important framework classes.

## Dashed Lines

![Color Presets](/assets/img/pspdfkit/2015/pspdfkit-4-4/linedashstyle.gif)

We have had partial support for custom line dash styles for a while, but such support was not included in the Inspector. With the 4.4 release we have added complete line dash support as well as add a nice way to select it. We also did some other all around visual improvements in the Inspector as well.

## Color Presets

![Color Presets](/assets/img/pspdfkit/2015/pspdfkit-4-4/colorpresets.gif)

While 4.3 had color presets for text, the 4.4 release now enables presets for almost all annotation types. This can be customized per type, using the `typesShowingColorPresets` property.

## Vertical Scrobble Bar

![Vertical Scrobble Bar](/assets/img/pspdfkit/2015/pspdfkit-4-4/scrobblebarvertical.gif)

It is now really easy to place the scrobble bar vertically. What previously required a good deal of custom code before, now runs out-of-the-box.

## Details

We have updated countless aspects on the framework including: making things prettier on the iPhone 6+; adding support for a few PDFs that are invalid but still work on Adobe Acrobat; made creating bookmarks programmatically simpler; improved accessibility; tweaked various animations (especially page to thumbnail); and of course squashed many bugs. Finally, we have begun development on PSPDFKit 5 for iOS, which is scheduled to be released some time in autumn.
