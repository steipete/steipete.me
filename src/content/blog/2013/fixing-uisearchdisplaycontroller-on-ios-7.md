---
title: "Fixing UISearchDisplayController On iOS 7"
pubDatetime: 2013-10-04T19:00:00.000Z
description: "Fix the broken animation, frame positioning, and status bar issues in UISearchDisplayController on iOS 7 with this comprehensive solution."
tags:
  - iOS-Development
  - UIKit
  - Bug-Fixes
  - iOS-7
  - UISearchDisplayController
  - PSPDFKit
  - Animation
source: petersteinberger.com
AIDescription: true
---

iOS 7 is great, but it's still very much a 1.0. I've spent a lot of time working around iOS 7-specific bugs in [PSPDFKit](http://pspdfkit.com) and will share some of my work here.

This is how UISearchDisplayController looks on iOS 7:

<video width="420" height="430" controls>
  <source src="/images/posts/UISearchDisplayController_broken.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

Pretty bad, eh? This is how it should look:

<video width="428" height="540" controls>
  <source src="/images/posts/UISearchDisplayController_fixed.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

Here's the code to fix it. It doesn't use private API (although there is some view hierarchy fighting), and it's fairly clean. It uses my [UIKit legacy detector](https://gist.github.com/steipete/6526860), so this code won't do any harm on iOS 5/6:

<script src="https://gist.github.com/steipete/6829002.js"></script>

I imagine one could subclass UISearchDisplayController directly and internally forward the delegate to better package this fix, but I only need it in one place so the UIViewController was a good fit.

Note that this uses some awful things like `dispatch_async(dispatch_get_main_queue()`, but it shouldn't do any harm even if Apple fixes its controller sometime in the future.
