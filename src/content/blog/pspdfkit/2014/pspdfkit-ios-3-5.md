---
title: "PSPDFKit 3.5 for iOS"
pubDate: 2014-02-12T09:02:00.000Z
description: "PSPDFKit 3.5 features some exciting changes that make it more delightful to use. We also worked on quite a few under-the-hood tweaks, modularizing internals and preparing it for further exciting improvements. With 3.5, it's now a lot easier to write a custom annotation toolbar, as we've introduced a new state manager (PSPDFAnnotationStateManager) that helps with annotation creation. This is the base for some great new features that will land in 3.6."
tags:
  - pspdfkit
source: pspdfkit.com
---

::ai[PSPDFKit 3.5 features some exciting changes that make it more delightful to use. We also worked on quite a few under-the-hood tweaks, modularizing internals and preparing it for further exciting improvements. With 3.5, it's now a lot easier to write a custom annotation toolbar, as we've introduced a new state manager (PSPDFAnnotationStateManager) that helps with annotation creation. This is the base for some great new features that will land in 3.6.]

PSPDFKit 3.5 features some exciting changes that make it more delightful to use. We also worked on quite a few under-the-hood tweaks, modularizing internals and preparing it for further exciting improvements. With 3.5, it's now *a lot* easier to write a custom annotation toolbar, as we've introduced a new state manager (PSPDFAnnotationStateManager) that helps with annotation creation. This is the base for some great new features that will land in 3.6.

## Smarter Resizing
Resizing annotations will now also update the content proportionally. Font Size will be scaled for free text annotations, and line width for inks. This saves a lot of taps for resizing.
![Smarter resizing](/images/blog/2014/pspdfkit-3-5/freetext-sizing.gif)

## Hardware Keyboard Support
When you iPad or iPhone is connected to an external keyboard, keys like arrow up/down/left/right, tab, space, enter, escape, backspace are properly recognized and can be used for annotations and form elements. Escape will clear the selection, backspace delete the selected element(s), space toggles check boxes and tab or the arrow keys allow navigating between form elements, and cmd+/cmd- will increase/decrease the text size. These new key commands only work under iOS 7.

## Sticky Inspector
A small but very useful change made it to the inspector. If active, a tap to a different annotation will instantly open the inspector at the new position, instead of showing the default annotation menu. That way, multiple objects can be selected with less taps, saving you some time.
![Sticky inspector](/images/blog/2014/pspdfkit-3-5/sticky-inspector.gif)

## Rendering Speed
While rendering speed is already great, we found a way to increase the perceived rendering time even further. If you double-tap into a text section, we instantly start rendering; so at the time the animation is done, the text usually is already sharp. Previously, this only started the rendering process after the animation finished. This is a speed improvement of 0.3 seconds, but it's incredible how much the perceived difference is.

## Embedded PDF Files
The PDF container format can store [arbitrary files](http://blogs.adobe.com/insidepdf/2010/11/pdf-file-attachments.html]). We already had support for file annotations, but there is also a way to store files document-global. This is now supported as well - if an embedded file is detected, a new tab in the Outline/Bookmark/Annotation controller will be displayed, and these embedded files then can be previewed with QuickLook or opened in other applications.
![Embedded files](/images/blog/2014/pspdfkit-3-5/embedded-files.png)

## Forms
Forms got a lot of love in this release. They now show perfect touch feedback and highlight instantly. Check boxes no longer dismiss the keyboard if it was visible before, so using the next/previous buttons became a lot more convenient. We did some internal tweaks so even pages with 500 form elements will display and update quickly. We added support for mutually exclusive check box groups, and there's even initial support for form validation:
![Form validation](/images/blog/2014/pspdfkit-3-5/form-validation.gif)

## Details
Embedded YouTube videos now support parameters (e.g. custom start time), Bookmarks now use the [PDF page label](https://github.com/PSPDFKit/PSPDFKit-Demo/wiki/For-books,-we-have-pages-that-need-to-be-labeled-with-roman-numbering-(i,-ii,-iii,-iv,-...).-How-can-I-customize-the-page-number%3F) if one exists, the gallery now shows the already cached part of videos in the progress bar. We also tweaked the page indicator, which now uses blur instead of basic transparency:

![Details](/images/blog/2014/pspdfkit-3-5/details.gif)

## Bug Fixes
Of course we also fixed a bunch of bugs. Text extraction works for a few more edge cases and we can now write annotations/forms into even more document types, including some variations that are not standard compliant. And of course, PSPDFKit 3.5 will run great with the upcoming iOS 7.1.
