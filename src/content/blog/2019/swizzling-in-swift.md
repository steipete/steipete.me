---
title: Swizzling in Swift
pubDatetime: 2019-06-26T08:00:00.000Z
description: "A deep dive into safe method swizzling techniques in Swift, covering common pitfalls and the correct way to implement dynamic super calls."
tags:
  - iOS
  - Development
  - Swift
source: pspdfkit.com
AIDescription: true
---

Swizzling (other languages call this “monkey patching”) is the process of replacing a certain functionality or adding custom code before the original code is called. For example, you could swizzle `UIViewController.viewDidAppear` to be informed whenever a view controller is displayed. This affects all uses of `UIViewController` within your process/app, including controllers owned by third-party frameworks or Apple frameworks. This is also what Google does in its Firebase Analytics SDK.

## What Is Swizzling?

Objective-C has supported swizzling since its inception, and with the modern runtime, the process has been greatly simplified. (See [JRSwizzle][] for information on how this used to be done.) It’s now 2019, and swizzling is still something that should be part of every developer’s toolbox, even if they’re only writing Swift. However, most people don’t know the subtle mistakes you can make when swizzling is done the wrong way.

**Heads up: Swizzling requires dynamic dispatch via @objc.** This works for every Objective-C-based class and for Swift functions that are declared `@objc`. Swizzling “pure Swift” functions is possible as well, but it’s [extremely difficult][] and outside of the scope of this article. With Apple slowly introducing Swift-only frameworks such as SwiftUI, we might explore such techniques in a future article.

## The Typical Way to Swizzle

Most swizzling code and tutorials I’ve seen in the wild work in the same way: by adding a second method to a class and then exchanging them (e.g. [NSHipster][] or [JRSwizzle][]).

Here’s a simple example that replaces `UIView.layoutSubviews` and adds some logging after the original call:

```swift
extension UIView {
    static let classInit: Void = {
       guard let originalMethod = class_getInstanceMethod(UIView.self, #selector(layoutSubviews),
             let swizzledMethod = class_getInstanceMethod(UIView.self, #selector(swizzled_layoutSubviews))
       else { return }
       method_exchangeImplementations(originalMethod, swizzledMethod)
    }()

    @objc func swizzled_layoutSubviews() {
        swizzled_layoutSubviews()
        print("Custom logging after each layoutSubviews call.")
    }
}
// Make sure to call `UIView.classInit` somewhere early, e.g. in the app delegate.
```

This code is not very generic, and it makes certain assumptions (for example, that `UIView.layoutSubviews` exists). It works, though things quickly get complicated if there’s more code in the system swizzling methods. If you use an analytics SDK, chances are extremely high that this is the case.

## An Unexpected Crash

One of our SDK customers notified us on support that they see unusual high crash rates inside our SDK. This was alarming and confusing, since we monitor crash rates closely via our [free PDF Viewer app][pdf viewer], and we hadn’t noticed any unusual increase.

There were multiple issues we first had to resolve so that the crash reports were usable:

1. Using bitcode can lead to faulty/invalid dSYMs on Apple servers. Our current recommendation is to disable bitcode if you encounter this issue. This seems to be more common for larger binaries, such as our SDK.

2. Crashlytics is unable to export crashes in the Apple `.crash` format, so symbolication tools do not work. While stack traces [can be manually symbolicated][], this is an extremely time-consuming task, and it’s much easier to upload the required dSYM files to Crashlytics as part of the release process.

Once we had readable stack traces, we could see where things failed:

```
Fatal Exception: NSInvalidArgumentException
0  CoreFoundation                 0x1f6554ec4 __exceptionPreprocess
1  libobjc.A.dylib                0x1f5725a40 objc_exception_throw
2  CoreFoundation                 0x1f646dc24 -[NSOrderedSet initWithSet:copyItems:]
3  UIKitCore                      0x223864558 (Missing)
4  PSPDFKitUI                     0x10434df24 __45+[PSPDFMenuItem installMenuHandlerForObject:]_block_invoke_4 (PSPDFMenuItem.m:95)
5  CoreFoundation                 0x1f655a4d8 ___forwarding___
6  CoreFoundation                 0x1f655c48c _CF_forwarding_prep_0
7  UIKitCore                      0x223cd8f84 (Missing)
8  PSPDFKitUI                     0x1044fa45c -[PSPDFPageView setupViews] (PSPDFPageView.mm:350)
9  PSPDFKitUI                     0x1044f94ec -[PSPDFPageView initWithFrame:] (PSPDFPageView.mm:226)
```

This is great, because we were able to narrow the issue down to `PSPDFMenuItem`. Apple’s `UIMenuItem` is a rather interesting class that uses the responder chain to call selectors. This can be inconvenient for people trying to add custom menu items to our SDK, so we provide a block-based alternative that’s easier to create, without requiring developers to have a deep understanding of the responder chain or having to use subclasses. This class is also open source (called [`PSMenuItem`][]), and the code has basically remained unchanged since 2012. It would have been surprising if this really was the cause of the crash, yet it failed inside the block.

## Understanding the Crash

The logic in `PSPDFMenuItem` swizzles `forwardInvocation:` on `PSPDFPageView` with a custom `pspdf_forwardInvocation:` to handle the menu item block execution. It uses a simple logic to do this:

```objc
void PSPDFReplaceMethod(Class c, SEL origSEL, SEL newSEL, IMP impl) {
    Method origMethod = class_getInstanceMethod(c, origSEL);
    class_addMethod(c, newSEL, impl, method_getTypeEncoding(origMethod));
    Method newMethod = class_getInstanceMethod(c, newSEL);
    if (class_addMethod(c, origSEL, method_getImplementation(newMethod), method_getTypeEncoding(newMethod))) {
        class_replaceMethod(c, newSEL, method_getImplementation(origMethod), method_getTypeEncoding(origMethod));
    } else {
        method_exchangeImplementations(origMethod, newMethod);
    }
}

// swizzle forwardInvocation:
SEL forwardInvocationSEL = @selector(pspdf_forwardInvocation:);
IMP forwardInvocationIMP = imp_implementationWithBlock(PSPDFBlockImplCast(^(id _self, NSInvocation *invocation) {
    if (PSPDFIsMenuItemSelector([invocation selector])) {
        for (PSMenuItem *menuItem in [UIMenuController sharedMenuController].menuItems) {
            if ([menuItem isKindOfClass:[PSMenuItem class]] && sel_isEqual([invocation selector], menuItem.customSelector)) {
                [menuItem performBlock]; break; // find corresponding MenuItem and forward
            }
        }
    } else {
        ((void (*)(id, SEL, NSInvocation *))objc_msgSend)(_self, forwardInvocationSEL, invocation);
    }
}));
PSPDFReplaceMethod(objectClass, @selector(forwardInvocation:), forwardInvocationSEL, forwardInvocationIMP);
```

Let’s go through the process step by step, since this is a bit difficult to follow. There’s no default implementation of `forwardInvocation:` on `PSPDFPageView`, so this is our default state:

```
- `NSObject.forwardInvocation:`
|
- `UIView`
|
- `PSPDFPageView`
```

1. The `class_addMethod` call adds the new method (`pspdf_forwardInvocation:`), and since it doesn’t yet exist, this succeeds and returns `true`.

2. Then we call `class_replaceMethod` with the original method (`forwardInvocation:`). Since `PSPDFPageView` doesn’t implement that one either (only `NSObject` has the default implementation), it is added as well. [`class_replaceMethod`][] either acts as `class_addMethod` if the method isn’t there yet (this is what happens here!), or, alternatively, it acts as `method_setImplementation` if the method already exists.

After the swizzling:

```
- `NSObject.forwardInvocation:`
|
- `UIView`
|
- `PSPDFPageView.forwardInvocation:` (with the IMP pointing to `NSObject.forwardInvocation:`)
- `PSPDFPageView.pspdf_forwardInvocation:` (with our custom code — our code then calls `PSPDFPageView.forwardInvocation:`)
```

Our swizzling succeeded and the new functionality works as expected (so far, so good)!

Now, some time later, an analytics SDK joins the party and is interested in adding logging to a call on `UIView.layoutSubviews`. It uses [Aspects][], an open source library that helps with swizzling. Aspects enables you to install hooks before calling a method, instead of after. It uses a trick where the IMP of a method is replaced with `_objc_msgForward`. Any callers to the method will start the Objective-C message forwarding logic, which ultimately calls `forwardInvocation:`. There, Aspects can intercept the call and call the original implementation:

```
- `NSObject.forwardInvocation:`
|
- `UIView.forwardInvocation:` (analytics SDK logic, processes logic or calls `doesNotRecognizeSelector:`)
|
- `PSPDFPageView.forwardInvocation:` (with our custom code — our code then calls `PSPDFPageView.forwardInvocation:`)
- `PSPDFPageView.pspdf_forwardInvocation:` (with the IMP pointing to `NSObject.forwardInvocation:`)
```

Do you already see the problem? Our previous swizzling is blissfully ignorant of what the analytics SDK is doing, and it doesn’t follow the expected super chain. The new `UIView.forwardInvocation:` is not called, and since hooked methods invoke `forwardInvocation:`, starting at the topmost implementation, we get passed from `PSPDFPageView.pspdf_forwardInvocation:` to `PSPDFPageView.forwardInvocation:`, which really is `NSObject.forwardInvocation:`. There, the default action for methods that are not known is raising an exception — the very `NSInvalidArgumentException` we’re seeing here.

## The Correct Way to Swizzle: Dynamic Super Calls

Instead of manually looking up the parent implementation, we need to do this at runtime, because who knows what else gets swizzled during the app runtime? What we need is to create an empty method that simply calls super. This can be done at runtime with the `objc_super` struct and using `objc_msgSendSuper2`. This method isn’t part of the public headers, but it is part of the Objective-C runtime and is considered safe to be used:

```objc
// https://opensource.apple.com/source/objc4/objc4-493.9/runtime/objc-abi.h
// `objc_msgSendSuper2()` takes the current search class, not its superclass.
OBJC_EXPORT id objc_msgSendSuper2(struct objc_super *super, SEL op, ...);
class_addMethod(clazz, selector, imp_implementationWithBlock(^(__unsafe_unretained id self, va_list argp) {
        struct objc_super super = {
            .receiver = self,
            .super_class = class_getSuperclass(clazz)
        };

        // Cast the call to `objc_msgSendSuper` appropriately.
        return ((id(*)(struct objc_super *, SEL, va_list))objc_msgSendSuper2)(&super, selector, argp);
    }), types);
```

If we use a real super call, our hierarchy now looks a bit different:

```
- `NSObject.forwardInvocation:`
|
- `UIView.forwardInvocation:` (Analytics SDK logic, processes logic or calls `doesNotRecognizeSelector:`)
|
- `PSPDFPageView.forwardInvocation:` (with our custom code — our code then calls `PSPDFPageView.forwardInvocation:`)
- `PSPDFPageView.pspdf_forwardInvocation:` (with the IMP calling `[super forwardInvocation:]`)
```

This is enough to fix the crash. The call hierarchy isn’t violated and the invocation is correctly processed in the added `UIView.forwardInvocation:`.

## Swizzling and the Command Pointer

We can do even better here. After all, “If you want to Swizzle, the best outcome is to leave no trace.” The current code is still messy, as we’re violating some basic Objective-C rules now. Consider the case where `PSPDFPageView` would already have an implementation of `forwardInvocation:`. Our swizzling would modify the existing code, so suddenly our `forwardInvocation:` call would be called with a `_cmd` command pointer that points to `pspdf_forwardInvocation:`.

This doesn’t make a difference in many cases, but it can throw off both analytics SDKs and other code that uses clever tricks to move messages around. A great example is touch forwarding in UIKit. If you swizzle `touchesMoved:withEvent:`, you’ll create a crash. Roughly, Apple’s internal code looks like this:

```objc
- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
    forwardTouchMethod(self, _cmd, touches, event);
}
```

You can learn more here on one of my older blog post entries: [A Story About Swizzling “the Right Way™” and Touch Forwarding][].

## Swizzling, a Better Way

Instead of adding new methods and exchanging implementations, we can modify the implementation directly, leaving no trace that anyone swizzled at all!

```objc
static _Nullable IMP pspdf_swizzleSelector(Class clazz, SEL selector, IMP newImplementation) {
    // If the method does not exist for this class, do nothing.
    const Method method = class_getInstanceMethod(clazz, selector);
    if (!method) {
        PSPDFLogError(@"%@ doesn't exist in %@.", NSStringFromSelector(selector), NSStringFromClass(clazz));
        // Cannot swizzle methods that are not implemented by the class or one of its parents.
        return NULL;
    }

    // Make sure the class implements the method. If this is not the case, inject an implementation, only calling 'super'.
    const char *types = method_getTypeEncoding(method);
    class_addMethod(clazz, selector, imp_implementationWithBlock(^(__unsafe_unretained id self, va_list argp) {
        struct objc_super super = {self, clazz};
        return ((id(*)(struct objc_super *, SEL, va_list))objc_msgSendSuper2)(&super, selector, argp);
    }), types);

    // Swizzling.
    return class_replaceMethod(clazz, selector, newImplementation, types);
}
```

**ℹ️ Note:** This misses handling of large struct returns, so the actual code is more complex. Read [Yet another article about method swizzling by Samuel Défago][method swizzling] to understand the tricky details.

Here, we’re calling [`class_addMethod`][] to inject the super code. If the class already contains a method, `class_addMethod` will not do anything. Then, `class_replaceMethod` calls `method_setImplementation:` internally and replaces the current IMP with our new implementation.

When we use `pspdf_swizzleSelector`, we just need to ensure that the previous implementation is called:

```objc
__block IMP originalIMP = pspdf_swizzleSelector(clazz, selector, imp_implementationWithBlock(^(id _self, BOOL animated) {
    ((void (*)(id, SEL))originalIMP)(_self, selector);

    NSLog(@"Custom code called after the original implementation.");
}));
```

## Conclusion

As long as we continue to work with UIKit and AppKit, there will always be situations where swizzling is useful. That said, swizzling is hard, and it’s easy to get wrong, so I hope that this post helps you write safer code with fewer side effects.

## Learn More

- [Yet another article about method swizzling][method swizzling]) (Samuel Défago, 2014)
- [The Right Way to Swizzle in Objective-C][] (New Relic)

[jrswizzle]: https://github.com/rentzsch/jrswizzle/blob/semver-1.x/JRSwizzle.m
[extremely difficult]: https://www.lombax.it/?p=321
[nshipster]: https://nshipster.com/swift-objc-runtime/#method-swizzling
[pdf viewer]: https://pdfviewer.io
[can be manually symbolicated]: /guides/ios/current/troubleshooting/advanced-symbolication/
[`psmenuitem`]: https://github.com/steipete/PSMenuItem/blob/master/PSMenuItem.m
[`class_replacemethod`]: https://developer.apple.com/documentation/objectivec/1418677-class_replacemethod?language=swift
[aspects]: https://github.com/steipete/Aspects
[a story about swizzling “the right way™” and touch forwarding]: http://petersteinberger.com/blog/2014/a-story-about-swizzling-the-right-way-and-touch-forwarding/
[method swizzling]: http://defagos.github.io/yet_another_article_about_method_swizzling/
[`class_addmethod`]: https://developer.apple.com/documentation/objectivec/1418901-class_addmethod?language=swift
[the right way to swizzle in objective-c]: https://blog.newrelic.com/engineering/right-way-to-swizzle/
