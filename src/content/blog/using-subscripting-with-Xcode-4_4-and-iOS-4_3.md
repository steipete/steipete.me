---
title: ''
pubDate: '2012-07-11 15:03'
description: >-
  Now that Xcode 4.4 has fially eached Golde Maste ad [you ca submit
  apps](https://devfoums.apple.com/message/694250694250), hee's a tick to use
  [subsciptig](h...
tags:
  - iOS
  - Objective-C
  - Xcode
source: petersteinberger.com
---

Now that Xcode 4.4 has finally reached Golden Master and [you can submit apps](https://devforums.apple.com/message/694250#694250), here's a trick to use [subscripting](http://clang.llvm.org/docs/ObjectiveCLiterals.html) *right now*. Yes, Apple will introduce this feature in a future version of OS X and iOS, but why wait? Here's the snippet from [PSPDFKit, my iOS PDF framework](http://pspdfkit.com), to make it work:

<script src="https://gist.github.com/3090279.js"> </script>

It's a bit crude, and Xcode won't show any warnings if you're doing subscripting on *any* object now, but you know what you're doing, right? Furthermore this is only *temporary*, to make it compile with Xcode 4.4. In Xcode 4.5, this snippet won't do anything and isn't needed anymore, since the new SDK already has those methods defined on the classes you care about. Just make sure this is in your global header file (e.g. precompiled headers).

Note that unlike literals, which are really just *syntactical sugar* and already work great in Xcode 4.4+ (LLVM 4.0+), subscripting actually calls into new methods. So how does this "magically defining headers" actually work?

Thanks to [Mike Ash](http://www.mikeash.com/pyblog/friday-qa-2012-06-22-objective-c-literals.html) and [Cédric Luthi](http://twitter.com/0xced), here's the answer:

> The subscripting compatibility shim is actually part of ARCLite. The __ARCLite__ load function takes care of dynamically adding the four subscript methods with class_addMethod. The implementations of these methods simply call the equivalent non-subscript methods.

<script src="https://gist.github.com/3090318.js"> </script>

If you, for [*any* reason](http://www.learn-cocos2d.com/2012/06/mythbusting-8-reasons-arc/), are not on ARC yet, you really want to force the compiler to link with libarclite using the ```-fobjc-arc``` linker flag. This works all the way back to iOS 4.3.

Also check out the new Xcode Refactoring Assistant to convert your codebase to Modern Objective-C. It's awesome.

Want to know more tips and tricks about iOS? [Follow @steipete on Twitter](http://twitter.com/steipete).
