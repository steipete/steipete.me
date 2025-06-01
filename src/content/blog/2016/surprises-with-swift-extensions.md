---
title: Surprises with Swift Extensions
pubDatetime: 2016-03-24T12:00:00.000Z
description: "Common pitfalls and surprising behaviors when creating Swift extensions on Objective-C classes, with solutions for proper method naming."
tags:
  - iOS
  - Development
source: pspdfkit.com
AIDescription: true
---

tl;dr: Swift extensions on Objective-C classes still need to be prefixed. You can use `@objc(prefix_name)` to keep the name pretty in Swift and expose a prefixed version for the ObjC runtime.
PSPDFKit is a commerical framework that allows you to embed a PDF viewer/editor into your app. Today, we received a report for a very weird crash with a stack trace that contained only UIKit symbols, but was clearly triggered by a specific action in PSPDFKit (Toggling the note annotation view controller quickly).

We wrote back and forth via our support desk and the developer was very cooperative. However, he couldn't manage to create an isolated example of this and we were unable to reproduce this on our end as well. That's fine. This happens sometimes. Might be a very weird configuration that he didn't replicate in the sample that triggers the bug, so in the end we requested and got the whole app to debug.

With that we were able to instantly reproduce the crash:

```objc
2016-03-24 22:27:18.793 TheApp[45769:6521650] *** Terminating app due to uncaught exception 'NSInvalidArgumentException', reason: '*** -[__NSArrayM insertObject:atIndex:]: object cannot be nil'
*** First throw call stack:
(
	0   CoreFoundation                      0x0000000108d95e65 __exceptionPreprocess + 165
	1   libobjc.A.dylib                     0x0000000109f68deb objc_exception_throw + 48
	2   CoreFoundation                      0x0000000108c5c8c5 -[__NSArrayM insertObject:atIndex:] + 901
	3   UIKit                               0x0000000104b8c300 -[UIViewController _addChildViewController:performHierarchyCheck:notifyWillMove:] + 541
	4   UIKit                               0x000000010534b0bf -[UIInputWindowController changeToInputViewSet:] + 473
	5   UIKit                               0x0000000105344080 -[UIInputWindowController moveFromPlacement:toPlacement:starting:completion:] + 369
	6   UIKit                               0x000000010534bf0c -[UIInputWindowController setInputViewSet:] + 983
	7   UIKit                               0x0000000105343d08 -[UIInputWindowController performOperations:withAnimationStyle:] + 50
	8   UIKit                               0x000000010504bb15 -[UIPeripheralHost(UIKitInternal) setInputViews:animationStyle:] + 1179
	9   UIKit                               0x000000011a68cb89 -[UIPeripheralHostAccessibility setInputViews:animationStyle:] + 39
	10  UIKit                               0x0000000104c0251d -[UIResponder(UIResponderInputViewAdditions) reloadInputViews] + 81
	11  UIKit                               0x0000000104bff546 -[UIResponder becomeFirstResponder] + 617
	12  UIKit                               0x0000000104a96c59 -[UIView(Hierarchy) becomeFirstResponder] + 138
	13  UIKit                               0x0000000105396788 -[UITextView becomeFirstResponder] + 75
	14  UIKit                               0x0000000104a96c95 -[UIView(Hierarchy) deferredBecomeFirstResponder] + 49
	15  UIKit                               0x0000000104a96d36 -[UIView(Hierarchy) _promoteSelfOrDescendantToFirstResponderIfNecessary] + 133
	16  UIKit                               0x0000000104a9709f __45-[UIView(Hierarchy) _postMovedFromSuperview:]_block_invoke + 208
	17  UIKit                               0x0000000104a96f69 -[UIView(Hierarchy) _postMovedFromSuperview:] + 544
	18  UIKit                               0x0000000104aa4d8f -[UIView(Internal) _addSubview:positioned:relativeTo:] + 1967
	19  UIKit                               0x0000000104e68d81 -[UINavigationTransitionView transition:fromView:toView:] + 672
	20  UIKit                               0x0000000104bcdcf5 -[UINavigationController _startTransition:fromViewController:toViewController:] + 3291
	21  UIKit                               0x0000000104bce2f1 -[UINavigationController _startDeferredTransitionIfNeeded:] + 890
	22  UIKit                               0x0000000104bcf3af -[UINavigationController __viewWillLayoutSubviews] + 57
	23  UIKit                               0x0000000104d75ff7 -[UILayoutContainerView layoutSubviews] + 248
	24  UIKit                               0x000000011a68f158 -[UILayoutContainerViewAccessibility layoutSubviews] + 43
	25  UIKit                               0x0000000104aa84a3 -[UIView(CALayerDelegate) layoutSublayersOfLayer:] + 703
	26  QuartzCore                          0x000000010427359a -[CALayer layoutSublayers] + 146
	27  QuartzCore                          0x0000000104267e70 _ZN2CA5Layer16layout_if_neededEPNS_11TransactionE + 366
	28  QuartzCore                          0x0000000104267cee _ZN2CA5Layer28layout_and_display_if_neededEPNS_11TransactionE + 24
	29  QuartzCore                          0x000000010425c475 _ZN2CA7Context18commit_transactionEPNS_11TransactionE + 277
	30  QuartzCore                          0x0000000104289c0a _ZN2CA11Transaction6commitEv + 486
	31  UIKit                               0x0000000104a1cb47 _afterCACommitHandler + 174
	32  CoreFoundation                      0x0000000108cc1367 __CFRUNLOOP_IS_CALLING_OUT_TO_AN_OBSERVER_CALLBACK_FUNCTION__ + 23
	33  CoreFoundation                      0x0000000108cc12d7 __CFRunLoopDoObservers + 391
	34  CoreFoundation                      0x0000000108cb6f2b __CFRunLoopRun + 1147
	35  CoreFoundation                      0x0000000108cb6828 CFRunLoopRunSpecific + 488
	36  GraphicsServices                    0x000000010b366ad2 GSEventRunModal + 161
	37  UIKit                               0x00000001049f1610 UIApplicationMain + 171
	38  TheApp                              0x0000000101e206e2 main + 114
	39  libdyld.dylib                       0x000000010aa7192d start + 1
)
libc++abi.dylib: terminating with uncaught exception of type NSException
```

_Notice how this is all UIKit, but triggered by an action in our framework._ So we started digging and reading lots and lots of UIKit disassembly to understand what's happening under the hood. Everything seemed reasonable. Next step was to try and create a sample, so we could report a radar. Has to be UIKit's fault - right? :)

Since previous attempts to build a sample app failed, I started the other way around, with moving all relevant code into the app delegate and slowly trimming down on classes, without touching any of the 3rd-party dependencies. A very slow and cumbersome process. Of course I scanned all the files for categories but apart from a few harmless looking extensions the app was all Swift - some very neat MVVM and reactive programming in there. Interestingly enough, things stopped crashing once I did that. Ha - so it really had to be something in the app that was causing the crash. I looked through all the files but everything looked innocent. Then I took a closer look at `UIViewController+Containment.swift`, and added a breakpoint there...

![](/assets/img/2016/surprises-with-swift-extensions/swift-extensions.png)

That was it. These seemingly innocent extensions were overriding private API. Apple's private API detection is not super sophisticated and wasn't triggered when the app was uploaded to the App Store. It's also not a public symbol so there were no warnings, not even a log message. Unprefixed categories are always dangerous, especially on classes that you do not own, like `UIViewController`. In PSPDFKit, we use categories for shared code, but prefix any method with `pspdf_` to be absolutely sure we do not hit any name clashes. It's certainly not pretty, and prefixes in Swift look even more alien, yet as you can see in this bug hunt, they are definitely necessary.

The following case was especially evil because this category _almost_ did the same thing as UIKit's internal private method of the same name. I shared my findings on Twitter and got a few interesting comments. Swift itself already fixes this problem, however only for pure Swift classes. Since Swift 2.2 landed the new symbolic selector references, [Joe Groff remarked that it's thinkable that future versions default to a more agressive name mangling.](https://twitter.com/jckarter/status/713114049911742464)
