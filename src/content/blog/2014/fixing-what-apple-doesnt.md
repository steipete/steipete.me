---
title: "Fixing What Apple Doesn't"
pubDatetime: 2014-01-04T15:09:00.000Z
description: "Fix the misaligned label in iOS 7's printer controller by swizzling UIPrinterSearchingView's layoutSubviews method."
tags:
  - iOS-Development
  - UIKit
  - Runtime
  - Method-Swizzling
  - iOS-7
  - Bug-Fixes
  - Reveal
source: petersteinberger.com
AIDescription: true
---

It's one of those days where Apple's sloppiness on iOS 7 is driving me nuts. Don't get me wrong; I have a lot of respect in pulling off something as big as iOS 7 in such a short amount of time. It's just that I see what's coming in iOS 7.1 and so many annoyances of iOS 7 still aren't fixed.

<blockquote class="twitter-tweet" lang="en"><p>Can’t stand Apple’s missing attention to detail in iOS 7. I’m just going to hack and patch this myself. <a href="http://t.co/Nnd176rPlz">pic.twitter.com/Nnd176rPlz</a></p>&mdash; Peter Steinberger (@steipete) <a href="https://twitter.com/steipete/statuses/419462996617097216">January 4, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

No, I'm not talking about the offset arrow, [the background](https://twitter.com/steipete/status/419463332190781440) -- I already made peace with that. But the offset label just looks like crap. (rdar://15748568) And since it's still there in iOS 7.1b2, let's fix that.

First off, we need to figure out how the class is called. We already know that it's inside the printer controller. A small peak with Reveal is quite helpful:

<img src="/images/posts/UIPrinterSearchingView.png">

So `UIPrinterSearchingView` is the culprit. Some more inspection shows that it's fullscreen and the internal centering code is probably just broken or was somehow hardcoded. Let's swizzle `layoutSubviews` and fix that. [When looking up the class via the iOS-Runtime-Headers, it seems quite simple](https://github.com/nst/iOS-Runtime-Headers/blob/d4cb1012a73d8126ab51fa951d4b4150e4c2d115/Frameworks/UIKit.framework/UIPrinterSearchingView.h), so our surgical procedure should work out fine:

<script src="https://gist.github.com/steipete/8255790.js"></script>

Let's run this again:

<blockquote class="twitter-tweet" lang="en"><p>Ah, much better. <a href="http://t.co/8yqoa6lrXU">pic.twitter.com/8yqoa6lrXU</a></p>&mdash; Peter Steinberger (@steipete) <a href="https://twitter.com/steipete/statuses/419469468562366464">January 4, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Done! Now obviously this is a bit risky -- things could look weird if Apple greatly changes this class in iOS 8, so we should test the betas and keep an eye on this. But the code's written defensively enough that it should not crash. I'm using some internal helpers from [PSPDFKit](http://pspdfkit.com) that should be obvious to rewrite -- comment on the gist if you need more info.

Best thing: The code just won't change anything if Apple ever decides to properly fix this.
