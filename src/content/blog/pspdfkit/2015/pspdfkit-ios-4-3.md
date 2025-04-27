---
title: PSPDFKit 4.3 for iOS
pubDate: 2015-03-06T12:00:00.000Z
description: >-
  In PSPDFKit 4.3 we focussed on stability and detail improvements touching all
  parts of the framework. It's a highly recommended update. READMORE
tags:
  - pspdfkit
source: pspdfkit.com
AIDescription: true
---


In PSPDFKit 4.3 we focussed on stability and detail improvements touching all parts of the framework. It's a highly recommended update.
READMORE

## Persistent Back/Forward Buttons

The `PSPDFViewController` now maintains a global list of back/forward items which allows a more efficient navigation in PDFs. This can be configured in `PSPDFConfiguration` and supports all common action types, such as pages, URLs and even jumps to other documents. Much like in a browser, a long-press will open a menu to choose from the complete history.

![ Persistent Back/Forward Buttons](/assets/img/pspdfkit/2015/pspdfkit-4-3/back-button.gif)


## Nullability and Swift

With Xcode 6.3, Apple is adding a new feature to allow annotating objects for nullability. This is great for documentation, but is especially useful if you use PSPDFKit from Swift, as it will reduce the number of forced unwrapped optionals. We've started the process of annotating our large set of headers with a variant of nullability that will work in Xcode 6.3b2 and will simply be ignored in Xcode 6.1. This is an ongoing process and we'll increase the list of annotated headers with future releases. Since Xcode 6.3 ships with Swift 1.2, we also added a new example that has been updated to work with the changes in Swift.

## Gallery

The gallery now fetches thumbnails from the PDF if available and is more flexible on where the coverImage can be loaded from via external paths. Via `allowPlayingMultipleInstances` it can be configured to allow playing multiple video files at once, and the play button can now be configured via UIAppearance. We also fixed other minor annoyances such as automatically disabling the fullscreen view when the video is playing on an external screen.

## Document display &amp; rendering

We identified and worked around a few issues with Apple's PDF renderer. Documents that are defect could throw an exception, we now handle such cases gracefully. Stamps are always uppercase in Adobe Acrobat, however we now relaxed this rule a bit to give you more flexibility. Page rotation now tries harder to keep the current view port and zoom level instead of just returning to zoomLevel 1.0 if you use continuous scrolling. We also increased our test coverage and found a few rare cases where the text parser would fail to extract all glyphs - these cases are now working correctly.
