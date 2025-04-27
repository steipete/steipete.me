---
title: "PSPDFKit 5.1 for iOS"
pubDate: 2015-12-22T12:00:00.000Z
description: "With PSPDFKit 5.1, we focused on improving the overall drawing experience, easier integration, better iOS 9 adaptivity, improving the night mode as well as tweaking many details in the annotation editing/creation experience. READMORE"
tags:
  - pspdfkit
source: pspdfkit.com
---

::ai[With PSPDFKit 5.1, we focused on improving the overall drawing experience, easier integration, better iOS 9 adaptivity, improving the night mode as well as tweaking many details in the annotation editing/creation experience. READMORE]

With PSPDFKit 5.1, we focused on improving the overall drawing experience, easier integration, better iOS 9 adaptivity, improving the night mode as well as tweaking many details in the annotation editing/creation experience.
READMORE

## Improved iOS 9 Support

With 5.1, we now require Xcode 7.2. One of the big improvements made in this release was streamlining the integration process. Check out our our new integration guide to see the latest. There's a section in the guide that explains the steps you need to take if you're already on 5.0. The main benefit here is that we now provide a dSYM file that allows crash stack trace symbolification on both your Mac and Apple's servers. (The dSYM file is only available for license holders, see `PSPDFKit.framework.dSYM`).

We also improved keyboard adaptivity in 5.1. The new split screen mode, introduced in iOS 9, could show the keyboard in situations where our framework didn't expect it to appear. With the adaptivity improvements made, this now works just as expected.


![Keyboard Adapivity](/assets/img/pspdfkit/2015/pspdfkit-5-1/keyboard-adaptivity.gif)

## Pressure Sensitivity

Version 5.1 adds pressure sensitivity to drawing and erasing. Natural lines can use pressure data from the Apple Pencil, 3D touch displays and some of the other supported styluses. We also tweaked the eraser so that it now uses the finger surface area or the Apple Pencil altitude angle.

These changes required updating some of the data structures in the framework. If you have custom code that interacts with `PSPDFInkAnnotation`, it’s possible you will need to update some calls - [see more details in the changelog](https://pspdfkit.com/changelog/ios/#5.1.0).

## Night Mode

PSPDFKit now comes with a few built in appearance modes, that include an extended night mode. The modes can be set and customized via `PSPDFAppearanceModeManager`. `PSPDFBrightnessViewController`. With this update, we extended the previous night mode with some additional UI controls.

![Night Mode](/assets/img/pspdfkit/2015/pspdfkit-5-1/night-mode.gif)

![Sepia Mode](/assets/img/pspdfkit/2015/pspdfkit-5-1/sepia.gif)

## New Arrow Tool

Arrows have always been a popular tool when annotating documents and we have supported their use since version 3. However in the PDF spec, arrows are just a configuration type of line annotations. They were always a line by default and therefore it required a few more taps to add the arrow head. With this release, we've added a special shortcut tool to create arrows. The tool makes them more visible, easier, and faster to use. As with any new feature we introduce, you are in full control.  You can disable this feature or remove lines all together, so there's just the new arrow tool to use.

![Arrow](/assets/img/pspdfkit/2015/pspdfkit-5-1/arrow-tool.gif)

## Font Picker Sorting

We've slightly tweaked our font picker to show the most commonly used fonts at the very top. You still can see the full list, and even download fonts, including Comic Sans, if you really want to.

![Font Picker](/assets/img/pspdfkit/2015/pspdfkit-5-1/font-picker.png)

## A more intelligent Undo/Redo button

When there's not enough space in the annotation toolbar, the undo/redo buttons now by default collapse into a new unified button that allows both actions via a long press.

![Undo/Redo](/assets/img/pspdfkit/2015/pspdfkit-5-1/compacted-undo-redo-button-with-more-action.gif)

## Rotating Pages

Manually rotating pages from the UI is now much easier - we added a new example in PSPDFCatalog (see `PSCRotatePageExample.m`) that explains the necessary steps.

![Page Rotation](/assets/img/pspdfkit/2015/pspdfkit-5-1/rotation-example.gif)

This is just the first step - future versions will feature a full page editor, so there's no custom code needed at all. We hope you all enjoy the release. Stay tuned and thank you for your continued support!
