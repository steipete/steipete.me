---
title: "Pimping recursiveDescription"
pubDatetime: 2012-07-01T15:49:00.000Z
description: "Enhance UIView's recursiveDescription to clearly show view controller hierarchies and containment relationships for easier debugging."
tags:
  - iOS-Development
  - Debugging
  - UIKit
  - WWDC
  - Objective-C
source: petersteinberger.com
AIDescription: true
---

While working on [PSPDFKit](http://pspdfkit.com), more and more I embrace viewController containment to better distribute responsibilities between different view controllers.
One thing that always annoyed me about that is that `po [[UIWindow keyWindow] recursiveDescription]` is less and less useful if you just see a big bunch of UIViews.
I asked some engineers at WWDC if there's something like recursiveDescription just for UIViewControllers, but they didn't have a answer to that, so I finally wrote my own.

Regular output of `po [[UIWindow keyWindow] recursiveDescription]`:

<script src="https://gist.github.com/3028506.js"> </script>

Pimped output:

<script src="https://gist.github.com/3028503.js"> </script>

The solution is surprisingly simple. Add the following code somewhere to your project and you're done.
As a bonus, this also _lists attached childViewControllers_ if you run iOS 5 or above, and it will show you if a childViewController has a greater frame than its parentViewController (this is usually an easy-to-miss bug).

Note the usage of `__attribute__((constructor))`. This will call the method at a very early stage on app loading (thus we need an explicit @autorelease pool):

<script src="https://gist.github.com/3028524.js"> </script>

This works with or without ARC, iOS 4.3 and above. (`imp_implementationWithBlock` requires iOS 4.3, unless you want to perform some [dark magic](https://github.com/landonf/plblockimp).)

For those if you that are curious, I use a private API call (`_viewDelegate`), but that's obfuscated (it would pass an AppStore review) and you really only should compile that function in debug mode anyway.
