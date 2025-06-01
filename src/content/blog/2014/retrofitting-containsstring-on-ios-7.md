---
title: "Retrofitting containsString: on iOS 7"
pubDatetime: 2014-07-17T23:40:00.000Z
description: "Backport iOS 8's convenient NSString containsString: method to iOS 7 using runtime patching that won't conflict with Apple's implementation."
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

Of course you _could_ always add that via a category, and in this case everything would probably work as expected, but we really want a _minimal invasive solution_ that only patches the runtime on iOS 7 (or below) and doesn't do anything on iOS 8 or any future version where this is implemented.

<script src="https://gist.github.com/steipete/e27db036126f9261092e.js"></script>

This code is designed in a way where it won't even be compiled if you raise the minimum deployment target to iOS 8. Using `__attribute__((constructor))` is generally considered bad, but here it's a minimal invasive addition for a legacy OS and we also want this to be called very early, so it's the right choice.
