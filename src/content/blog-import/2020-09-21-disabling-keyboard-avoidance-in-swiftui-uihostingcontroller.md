---
layout: post
title: "Disabling Keyboard Avoidance in SwiftUI's UIHostingController"
date: 2020-09-21 22:00:00 +0200
tags: iOS development
image: /assets/img/2020/uihostingcontroller-keyboard/header.png
description: "UIHostingController has logic to avoid the keyboard, which is often unwanted. We explore a hack to disable this feature."
---

<style type="text/css">
div.post-content > img:first-child { display:none; }
</style>

While SwiftUI is still being [cooked hot](/posts/state-of-swiftui/), it’s already really useful and can replace many parts of your app. And with `UIHostingController`, it can easily be mixed with existing UIKit code. With iOS 14, the SwiftUI team at Apple added keyboard avoidance logic to the hosting controller, which can result in pretty ugly scrolling behavior.

## When Keyboard Avoidance Is Unwanted

When the keyboard is visible and `UIHostingController` doesn’t own the full screen, views try to move away from the keyboard. This has been [a frustrating bug for many](https://developer.apple.com/forums/thread/658432), and it’s especially bad if you [embed `UIHostingController` as table view cells](https://noahgilmore.com/blog/swiftui-self-sizing-cells/) or collection view cells.[^4]

{% twitter https://twitter.com/thesamcoe/status/1306350596715282434?s=20 %}

While it seems that there are some [weird workarounds if you use iOS 14.2](https://twitter.com/zntfdr/status/1306913858263552001?s=21), this seems unreliable, and folks still need a solution for iOS 14.0.

## Fixing Strategies

While I’ve not been directly affected by this issue, I was curious and tried to fix it a while back. My first attempt was adding `.ignoresSafeArea(.keyboard)` to the SwiftUI view, but this doesn’t seem to change anything.

When the official ways don’t work, there’s always the runtime, so I’ve been [inspecting the view controller’s methods](https://twitter.com/steipete/status/1306153060700426240?s=21) and looking for something to poke at. As the class is written in Swift, there’s very little that’s exposed to the Objective-C runtime — only methods that are overridden from `UIViewController` or exposed with `@objc` will show up here. I could potentially use a Swift mirror to see the remaining functions, but changing them is difficult. There was nothing interesting, so I reported a r̶a̶d̶a̶r̶ Feedback[^2] and that was it.

A few days later, I was reading [Samuel Défago’s brilliant blog post about how he wrapped `UICollectionView` for Swift](https://defagos.github.io/swiftui_collection_intro/). In part 3, he presents a fix to an issue with `safeAreaInsets` in `UIHostingController`. This is done by [modifying the *view* class](https://defagos.github.io/swiftui_collection_part3/). It motivated me to take a closer look at the view — maybe Apple was hiding the keyboard avoidance logic there?

```
po SwiftUI._UIHostingView<KeyboardSwiftUIBug.ContentView>.self.perform("_shortMethodDescription")

▿ Optional<Unmanaged<AnyObject>>
  ▿ some : Unmanaged<AnyObject>
    - _value : <_TtGC7SwiftUI14_UIHostingViewV18KeyboardSwiftUIBug11ContentView_: 0x7fff87103a28>:
in _TtGC7SwiftUI14_UIHostingViewV18KeyboardSwiftUIBug11ContentView_:
	Properties:
		@property (nonatomic, readonly) struct UIEdgeInsets safeAreaInsets;
		@property (nonatomic, retain) UIColor* backgroundColor;
		@property (nonatomic, readonly) unsigned long _axesForDerivingIntrinsicContentSizeFromLayoutSize;
		@property (nonatomic, readonly) BOOL _layoutHeightDependsOnWidth;
	Instance Methods:
		- (void) dealloc; (0x7fff566e9320)
		- (id) initWithCoder:(id)arg1; (0x7fff566e91e0)
		- (id) backgroundColor; (0x7fff566eaab0)
		- (void) setBackgroundColor:(id)arg1; (0x7fff566eab30)
		- (id) initWithFrame:(struct CGRect)arg1; (0x7fff566ec710)
		- (void) layoutSubviews; (0x7fff566ea040)
		- (void) traitCollectionDidChange:(id)arg1; (0x7fff566ea630)
		- (struct CGSize) sizeThatFits:(struct CGSize)arg1; (0x7fff566eadb0)
		- (struct UIEdgeInsets) safeAreaInsets; (0x7fff566ea790)
		- (void) didUpdateFocusInContext:(id)arg1 withAnimationCoordinator:(id)arg2; (0x7fff566ec230)
		- (id) preferredFocusEnvironments; (0x7fff566ec150)
		- (void) safeAreaInsetsDidChange; (0x7fff566ea6c0)
		- (void) didMoveToSuperview; (0x7fff566e9df0)
		- (void) _geometryChanged:(void*)arg1 forAncestor:(id)arg2; (0x7fff566e9ef0)
		- (id) _childFocusRegionsInRect:(struct CGRect)arg1 inCoordinateSpace:(id)arg2; (0x7fff566ec080)
		- (struct ?) _baselineOffsetsAtSize:(struct CGSize)arg1; (0x7fff566eacd0)
		- (unsigned long) _axesForDerivingIntrinsicContentSizeFromLayoutSize; (0x7fff566eabd0)
		- (void) contentSizeCategoryDidChange; (0x7fff566ea5c0)
		- (void) keyboardWillShowWithNotification:(id)arg1; (0x7fff566ec4f0)
		- (void) keyboardWillHideWithNotification:(id)arg1; (0x7fff566ec5a0)
		- (void) externalEnvironmentDidChange; (0x7fff566edd40)
		- (id) makeViewDebugData; (0x7fff566ec5f0)
		- (void) _geometryChanges:(id)arg1 forAncestor:(id)arg2; (0x7fff566e9e20)
(UIView ...)
```

`UIHostingView` looks very interesting indeed.[^3] Based on the design, it seems that at some point, Apple considered giving us both the hosting controller and the hosting view, but then opted for just the controller — it wouldn’t make sense to pack all that logic into the view if the controller was always planned.

Looking at the output, I see there are quite a few Swift methods that have been exposed to the Objective-C runtime. `keyboardWillShowWithNotification:` and `keyboardWillHideWithNotification:` look exactly like candidates to tweak. We’re really lucky here that the SwiftUI engineers didn’t use the block-based `NSNotification` API[^1], but instead used the target/selector approach — which not only needs `@objc` annotations to work, but also opens the door for our shenanigans.

## Subclassing at Runtime

We want to replace the implementation of `keyboardWillShowWithNotification:` with an empty one. The classic solution here would be [swizzling](https://pspdfkit.com/blog/2019/swizzling-in-swift/), but that would modify *all* instances of `UIHostingController`, and we don’t know if the view class is used somewhere else. It might work, but it seems risky.

A better strategy is to modify only instances we control, and we can do that via dynamic subclassing. It’s my favorite way to modify behavior on a per-object basis. In fact, I wrote an entire Swift library called [InterposeKit](https://interposekit.com/) to make this easy:

```swift
import SwiftUI
import InterposeKit

extension UIHostingController {
convenience public init(rootView: Content, ignoresKeyboard: Bool) {
    self.init(rootView: rootView)

    if ignoreKeyboard {
        _ = try? self.view.hook(NSSelectorFromString("keyboardWillShowWithNotification:")) { (
            store: TypedHook<@convention(c) (AnyObject, Selector, AnyObject) -> Void,
                             @convention(block) (AnyObject, AnyObject) -> Void>) in { _, _ in }
        }
    }
}
}
```

Dynamic subclassing isn’t very tricky, but the challenge is to write it in a way where it fails gracefully if the private API we modify is changed. InterposeKit adds a lot of error handling next to a convenient API so that you make fewer mistakes and have a more stable app. It’ll throw an error if the selection no longer exists or has a different type than the one you expect.

We can achieve something similar using built-in methods:

```swift
extension UIHostingController {
convenience public init(rootView: Content, ignoresKeyboard: Bool) {
    self.init(rootView: rootView)

    if ignoresKeyboard {
        guard let viewClass = object_getClass(view) else { return }

        let viewSubclassName = String(cString: class_getName(viewClass)).appending("_IgnoresKeyboard")
        if let viewSubclass = NSClassFromString(viewSubclassName) {
            object_setClass(view, viewSubclass)
        }
        else {
            guard let viewClassNameUtf8 = (viewSubclassName as NSString).utf8String else { return }
            guard let viewSubclass = objc_allocateClassPair(viewClass, viewClassNameUtf8, 0) else { return }

            if let method = class_getInstanceMethod(viewClass, NSSelectorFromString("keyboardWillShowWithNotification:")) {
                let keyboardWillShow: @convention(block) (AnyObject, AnyObject) -> Void = { _, _ in }
                class_addMethod(viewSubclass, NSSelectorFromString("keyboardWillShowWithNotification:"),
                                imp_implementationWithBlock(keyboardWillShow), method_getTypeEncoding(method))
            }
            objc_registerClassPair(viewSubclass)
            object_setClass(view, viewSubclass)
        }
    }
}
}
```

See [my gist](https://gist.github.com/steipete/da72299613dcc91e8d729e48b4bb582c#file-uihostingcontroller-keyboard-swift) for a version that also removes `safeAreaInsets`. Who would’ve thought that runtime trickery is still useful in SwiftUI times?

If this is useful to you, ping [@steipete on Twitter](https://twitter.com/steipete)!

[^1]: The block-based notification API nowadays is inconvenient, as it doesn’t automatically deregister observers — using the target/action one is simpler, as these observers have automatically deregistered since iOS 9.

[^2]: If you want to try this for yourself, [I’ve prepared an example here](https://twitter.com/steipete/status/1306925835010609152?s=21).

[^3]: The `makeViewDebugData` method also looks pretty interesting...

[^4]: Apple Folks: FB8698723 — Provide API in UIHostingController to disable keyboard avoidance for SwiftUI views.
