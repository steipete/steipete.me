---
title: PSPDFKit 3.4 for iOS
pubDate: 2014-01-15T09:39:00.000Z
description: >-
  Version 3.4 isn't yet released, but here's a preview of some small and big
  details that we improved in this version.
tags:
  - pspdfkit
source: pspdfkit.com
AIDescription: true
---


Version 3.4 isn't yet released, but here's a preview of some small and big details that we improved in this version.

## Annotation Toolbar Selection
We've increased the contrast for items that are selected - this makes the current selected tool much more visible, and also matches the style changes that Apple does in the upcoming iOS 7.1. As a bonus feature, the selection color of the `PSPDFAnnotationToolbar` is now configurable, so you can even make it yellow, if you dare so :)

Old:
![Old annotation toolbar, white](/assets/img/pspdfkit/2014/pspdfkit-3-4/annotationbar-old1.png)
![Old annotation toolbar, blue](/assets/img/pspdfkit/2014/pspdfkit-3-4/annotationbar-old2.png)

New:
![New annotation toolbar, white](/assets/img/pspdfkit/2014/pspdfkit-3-4/annotationbar-new1.png)
![New annotation toolbar, blue](/assets/img/pspdfkit/2014/pspdfkit-3-4/annotationbar-new2.png)

## Goodbye, `PSPDFVideoAnnotationView`
The new multimedia gallery is taking over more and more features, now replacing the default video annotation view. We've added all remaining features like cover view, seek to a specific time, autoplay, enable/disable controls to make this happen. This is a great thing, since PSPDFKit finally allows you to play multiple videos and/or audio at the same time. The total number of concurrent video streams is hardware dependent and is usually 4.
![Updated gallery](/assets/img/pspdfkit/2014/pspdfkit-3-4/gallery.gif)

## Merge your Inks!
This is a small and relatively hidden feature, but can be really useful. Use the multi-select tool to select multiple ink annotations, and a new menu item "Merge" appears, allowing you to create one object out of all selected ones.
![Merge links](/assets/img/pspdfkit/2014/pspdfkit-3-4/merge-links.gif)

## Animations
This is just a start, but changing annotations now animates. Page changes fade in, and note annotations correctly move around and fade in and out. This is most noticeable if you use the undo feature, but for apps that have custom annotation providers and where the model objects might change externally, this is quite a nice improvement.
![Animations](/assets/img/pspdfkit/2014/pspdfkit-3-4/animations.gif)

## Embrace `UIActivityViewController`
With 3.4, we've greatly improved the `activityBarButtonItem` and the activity controller. This replaces the older, sheet-based `additionalBarButtonItem` and fits a lot better into iOS 7. As a bonus, we've also added **AirDrop support** so sharing the current document is a lot easier.

The new activity controller:
![Activity controller](/assets/img/pspdfkit/2014/pspdfkit-3-4/activity-controller.png)

The old action sheet:
![Action sheet (old)](/assets/img/pspdfkit/2014/pspdfkit-3-4/action-sheet.png)

## Printing
We've removed the old printing sheet and are now using the same that's already used in the email and open in feature - with the benefit of a more unified UI and you can now also print annotation summaries. Those are now also better formatted as rich text - both in the email and when printing.

## New Popovers
We're using a custom popover to show the brightness control on iPhone, and also for the settings menu, since `UIPopoverController` is not allowed on the iPhone. This looked ok-ish on iOS 6, but until now hasn't been updated for iOS 7. We finally took the time to work on this, updated both the iOS 7 variant and perfected iOS 6 - and it looks great! This is just a small detail and they're not used a lot, but we believe that it's work it to put effort into it.
![The brightness popover](/assets/img/pspdfkit/2014/pspdfkit-3-4/popover-brightness.png)
![The settings popover](/assets/img/pspdfkit/2014/pspdfkit-3-4/popover-settings.png)

## Smarter Highlighting
The annotation toolbar now tries to unify and merge existing text highlights, and will no longer create a highlight with the same color if at that position another highlight already exists. This is a huge step usability-wise and a nice touch.
![Smarter highlighting](/assets/img/pspdfkit/2014/pspdfkit-3-4/smarter-highlighting.gif)

## The Small Things
We've fixed some form issues and a few bugs and regressions. Text extraction/glyph calculation now works better for certain document types, especially for CJK documents. We've also fixed YouTube, it now pauses correctly when the pages goes into background. Like always we also tweaked many other small UI details, for example the previews in the popover menu are now round on iOS 7 to better match the system style.

iOS 7:
![New iOS 7 styled popovers](/assets/img/pspdfkit/2014/pspdfkit-3-4/popover-ios7.png)

iOS 6:
![Old, iOS 6 popovers](/assets/img/pspdfkit/2014/pspdfkit-3-4/popover-ios6.png)
