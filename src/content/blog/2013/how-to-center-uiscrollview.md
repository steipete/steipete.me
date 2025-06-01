---
title: "How To Center Content Within UIScrollView"
pubDatetime: 2013-02-21T12:07:00.000Z
description: "Learn the best approach to center content in UIScrollView using contentInset instead of layoutSubviews or setContentOffset for better zooming behavior."
tags:
  - iOS-Development
  - UIKit
  - UIScrollView
  - Zooming
  - PSPDFKit
  - Best-Practices
source: petersteinberger.com
AIDescription: true
---

There seems to be [some](http://stackoverflow.com/questions/1496015/is-it-possible-to-center-content-in-a-uiscrollview-like-apples-photos-app/3479059) [confusion](http://stackoverflow.com/questions/1316451/center-content-of-uiscrollview-when-smaller/14188223) around the net when it comes to the best way to center a view within an UIScrollView.

And it's actually not that easy to get right. In [PSPDFKit](http://pspdfkit.com) version 1, I used the Apple-recommended way (see Apple's photo example) of [subclassing layoutSubviews](https://github.com/steipete/PSTCenteredScrollView/blob/master/PSTCenteredScrollView/PSTLayoutSubviewCenteredScrollView.m). This was "good enough" until I added [smart zoom](http://pspdfkit.com/features.html) in version 2 of my PDF framework. (That is, text blocks are detected and zoomed onto with a double tap, just like you're used to in the mobile version of Safari). I noticed that the zoomToRect method did not work properly; the final rect was offset, and it was quite obvious why, since the layoutSubview-method moved around the frame of the view that was zoomed in on. And [don't try to compensate this moving](http://stackoverflow.com/questions/7270135/uiscrollviews-zoomtorect-needs-to-be-called-twice/7291882#7291882) -- it seems relatively impossible to get right.

The next generation ([PSPDFKit](http://pspdfkit.com) 2.2 and upward) used [override setContentOffset:](https://github.com/steipete/PSTCenteredScrollView/blob/master/PSTCenteredScrollView/PSTContentOffsetCenteredScrollView.m#L13) to always center the content. This works, but has the drawback that you can't pan the view around when you're zooming out more -- it's always fixed centered. This solution also has a very nasty hidden bug, where the UIScrollView can be "locked up" and doesn't accept any touches anymore until you perform a pinch in/out. I've had Apple DTS against this and even the person helping me only came up with useless workarounds (like not using gesture recognizers... right.) It's hard to reproduce this bug here without open sourcing half of my framework, so please just trust me on that one.

I've asked around on Twitter (thanks, everyone!) and most recommendations were about overriding layoutSubviews. Some suggested stuffing the view into another view and doing the centering manually (which I tried) but this has the drawback that you can scroll into the empty space when zoomed in (or you adapt the view and get the same problem as you had in layoutSubviews).

The solution that works best by far is by [setting contentInset](https://github.com/steipete/PSTCenteredScrollView/blob/master/PSTCenteredScrollView/PSTContentInsetCenteredScrollView.m#L13). It allows you to pan around the view when zoomed out and doesn't expose the "lock" bug that overriding setContentOffset: had. It also works fine with using zoomToRect. There are a few gotchas when using edgeInsets as well -- for example, I have a mechanism that [preserves the current view state](http://pspdfkit.com/documentation/Classes/PSPDFViewState.html) (page, zoom, contentOffset) and restores that later on. If you set contentOffset to 0,0 this will decenter your image (in contrast to methods one and two). But you can trigger re-centering with following trick:

```objective-c
            // Trigger a new centering (center will change the content offset)
            scrollView.contentInset = UIEdgeInsetsZero;
            [scrollView ensureContentIsCentered];
```

I've made a [small GitHub project](https://github.com/steipete/PSTCenteredScrollView) that shows off all three centering techniques and zooms to a small rect on double tap (to show off the zoomToRect problem). Hopefully this helps someone save a few hours!
