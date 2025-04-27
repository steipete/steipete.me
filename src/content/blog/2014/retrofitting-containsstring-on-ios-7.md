---
title: "Retrofitting containsString: on iOS 7"
pubDate: 2014-07-17T23:40:00.000Z
description: "Learn how to elegantly backport iOS 8's convenient NSString containsString: method to iOS 7 with minimal code and maximum compatibility. I present a clean implementation that uses the Objective-C runtime to conditionally add this method only on iOS 7 devices, ensuring it won't conflict with Apple's native implementation on newer systems. This technique demonstrates how to safely extend foundation classes with future APIs while maintaining forward compatibility, using function attributes to optimize compilation when targeting newer iOS versions."
tags:
  - iOS-Development
  - Objective-C
  - Runtime
  - NSString
  - Categories
  - Backward-Compatibility
  - Foundation
source: petersteinberger.com
AIDescription: true
---

[Daniel Eggert](https://twitter.com/danielboedewadt) asked me on Twitter what's the best way to retrofit the new `containsString:` method on `NSString` for iOS 7. Apple quietly added this method to Foundation in iOS 8 - it's a small but great addition and reduces common code ala `[path rangeOfString:@"User"].location != NSNotFound` to the more convenient and readable `[path containsString:@"User"]`. 

Of course you *could* always add that via a category, and in this case everything would probably work as expected, but we really want a *minimal invasive solution* that only patches the runtime on iOS 7 (or below) and doesn't do anything on iOS 8 or any future version where this is implemented.

<script src="https://gist.github.com/steipete/e27db036126f9261092e.js"></script>

This code is designed in a way where it won't even be compiled if you raise the minimum deployment target to iOS 8. Using `__attribute__((constructor))` is generally considered bad, but here it's a minimal invasive addition for a legacy OS and we also want this to be called very early, so it's the right choice.