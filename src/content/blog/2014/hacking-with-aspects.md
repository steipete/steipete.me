---
title: "Hacking with Aspects"
pubDatetime: 2014-05-06T00:45:00.000Z
description: "Explore how Apple detects popover presentation in UIImagePickerController and learn to bypass the restriction using my Aspects library."
tags:
  - iOS-Development
  - Aspects
  - AOP
  - Runtime
  - Reverse-Engineering
  - UIImagePickerController
  - Open-Source
  - Hopper
source: petersteinberger.com
AIDescription: true
---

I've recently spent a few days extracting and polishing the AOP code from [PSPDFKit](http://pspdfkit.com), and the result of this is called [Aspects - a delightful, simple library for aspect oriented programming.](https://github.com/steipete/Aspects)

Now Aspects is a great new tool in your toolkit. It allows to call code before, instead or after the original implementation, and there's no need to manually call super, cast `objc_msgSend` or any of that other stuff you ~~have to~~ should do on swizzling. Use it with reason, it has a few great use cases, some are well-explaind on the GitHub page.

It's also great for hacking and debugging. While testing the example on an iPad that still runs iOS 6, I found this exception:
`// *** Terminating app due to uncaught exception 'NSInvalidArgumentException', reason: 'On iPad, UIImagePickerController must be presented via UIPopoverController'`

![](http://f.cl.ly/items/0V1B2r1K0Z2Q2k0u1o1J/Screen%20Shot%202014-05-06%20at%2000.02.00%20.png)

Right, Apple fixed that in iOS 7. But I was more curious how this is actually implemented. It's actually quite tricky to detect if you are inside a popover or not, and sometimes this quite important to know. Has Apple some "secret sauce" they're using here? I opened Hopper to find out.

<script src="https://gist.github.com/steipete/bb5c8831d522bc7ef3c5.js"></script>

That's roughly their code, converted back from assembly. Interesting that there's a `_UIImagePickerControllerAllowAnySuperview` to disable this check. You have to wonder where they are using that... The check is otherwise quote straightforward. The interesting part is here: `[_UIPopoverView popoverViewContainingView:self.view]`.

Let's look up that as well...

<script src="https://gist.github.com/steipete/a7eb1154de6d46eea654.js"></script>

Ha. **There's no secret sauce here.** Apple is simply iterating the view hierarchy to find the `_UIPopoverView`. Fair enough, it's a simple solution. Sadly there's no `_UIPopoverView` for us mere mortals, it's a private class.

Now, let's test if this disassembly is actually correct! First, we'll disable Apple's check:

<script src="https://gist.github.com/steipete/f69bf90e34a659351f6e.js"></script>

That's all - this makes the controller work perfectly where it threw an exception before. The popover restriction ~~was a pure~~ could be a political one, or there are edge cases we don't know.

## Putting it all together

Now, we want to implant our own check using Aspects. `PLLibraryView` is again private, so we'll use a runtime class lookup to hook it globally. I also commented out the property check since this would disable our own checking code.

<script src="https://gist.github.com/steipete/149586113c32e91b0c3c.js"></script>

That's it!

This code isn't of much use, but it's interesting how Apple checks these things internally, and that their popover detection really is just subview querying. And while `_UIPopoverView` is private, we could easily make this check working without flagging private API by testing for parts of the class name...
