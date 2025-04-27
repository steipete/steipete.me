---
title: "PSPDFKit 5.2 for iOS"
pubDate: 2016-02-17T12:00:00.000Z
description: "!Selection Knobs"
tags:
  - pspdfkit
source: pspdfkit.com
---

::ai[!Selection Knobs]

## Improved Theming
Text and annotation selection now use `tintColor`, enabling easier theming by inheriting color from superviews. Selection color can be customized individually by setting `tintColor` on `PSPDFTextSelectionView`, `PSPDFSelectionView` and `PSPDFResizableView`.
READMORE

## Annotation User Experience Improvements
The annotation selection knobs work better now, especially backgrounds that would clash with the tintColor, and the object selection was also slightly tweaked—it now prioritizes objects that are not yet saved.

![Selection Knobs](/images/blog/2016/pspdfkit-5-2/selection-knobs.gif)

We also improved the shape guides (when drawing ovals and rectangles) and their snapping behaviour during resizing operations. Combined, these make for a much nicer user experience.

![Selection Knobs](/images/blog/2016/pspdfkit-5-2/shape-guides.gif)

## Color Presets
Color presets can now be reset to the default value through a long press of the preset button.

![Reset Color Preset](/images/blog/2016/pspdfkit-5-2/reset-preset.gif)

## App-Extension Ready
The SDK now only requires app-extension-safe API and automatically detects if in extension mode.

## Logging
The PSPDFKit singleton now offers a hook to register your own logging handler - see the logHandler property. We also changed the logging levels; ExtraVerbose to just Verbose, and Verbose to Debug.

## Page Layout and HUD Handling
We improved page layout and HUD handling in various configuration modes and fixed a number of subtle issues that were found in some less common combinations. This is something that customers with less common view hierarchy configurations will appreciate.

## Binary Size
PSPDFKit now has a smaller binary size, see [this article](https://pspdfkit.com/guides/ios/current/faq/framework-size/) on the framework size, and its bitcode section, for more details.

## More Under-The-Hood Changes
Our team also improved the rendering engine, which now requires less memory, and made improvements to the change notifications and saving functionality. We’ve made various performance and reliability improvements to the PDF processor, including a more efficient blank page detection. JSON export has been greatly improved.

