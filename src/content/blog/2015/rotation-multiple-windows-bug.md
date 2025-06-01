---
title: "The curious case of rotation with multiple windows on iOS 8"
pubDatetime: 2015-01-25T21:25:00.000Z
description: "Diagnose and solve an iOS 8 regression where unwanted rotation occurs in apps using multiple windows despite explicit configuration."
tags:
  - iOS-Development
  - UIKit
  - Rotation
  - Bug-Fixes
  - Reverse-Engineering
  - iOS-8
  - UIWindow
  - PSPDFKit
source: petersteinberger.com
AIDescription: true
---

I've had a lot of fun today hunting down a particular regression in iOS 8 that caused rotation when the interface was configured to not autorotate. This is particular fun since this was reported by a [PSPDFKit](https://pspdfkit.com/) customer and since they're paying for our product, they also expect a solution. So giving them a "It's an UIKit regression" answer isn't good enough. Prepared with IDA and decompiled versions of UIKit iOS 7.1 (where everything works) and UIKit iOS 8.1 (where things are broken) I've spend the better part of a day diffing and understanding the root cause.

Here's [my gist with (slightly unordered) thoughts](https://gist.github.com/steipete/8df39fea0d39680a7a6b) as I went deeper and deeper into the rabbit hole. If you're curious about UIKit, you'll find this very interesting to read.

In PSPDFKit we create a few custom windows for various features, like the global progress HUD or the custom text loupe (Dupe [rdar://17265615](http://openradar.appspot.com/17265615) if you feel like this should be an official API). There's no easy workaround to not use windows for this features (or rather, this would be a usability regression), so in the end, I've came up with a not-extremely terrible workaround that works on iOS 8 and doesn't do any damage on iOS 7:

<script src="https://gist.github.com/steipete/d928debb92e86de89eb2.js"></script>

This solution "hides" the `rootViewController` to basically disable any automatic rotation while the window is hidden, which perfectly solves our issue. I have to admit that I quite enjoy digging through closed source code and trying to understand the pieces bit by bit.

[Want to work with me? We're looking for smart developers over at PSPDFKit.](https://pspdfkit.com/jobs/) Ping me if you're interested!
