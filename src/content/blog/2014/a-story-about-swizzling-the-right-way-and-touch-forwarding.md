---
title: 'A Story About Swizzling "the Right Way™" and Touch Forwarding'
pubDatetime: 2014-07-04T12:17:00.000Z
description: "Learn why traditional method swizzling breaks UIKit's touch forwarding and discover a better approach that preserves _cmd integrity."
tags:
  - iOS-Development
  - Objective-C
  - Runtime
  - Method-Swizzling
  - Touch-Handling
  - Aspects
  - Debugging
  - Reverse-Engineering
source: petersteinberger.com
AIDescription: true
---

Some people think of me as the guy that does [crazy things to ObjC and swizzles everything](https://www.youtube.com/watch?v=psPNxC3G_hc). Not true. In [PSPDFKit](http://pspdfkit.com/) I'm actually quite conservative, but I do enjoy spending time with the runtime working on things such as [Aspects - a library for aspect oriented programming](https://github.com/steipete/Aspects).

After my initial excitement, things have stalled a bit. I shipped Aspects in our PDF framework, and people started complaining that it _sometimes_ freezes the app, basically [looping deep within the runtime, when the New Relic SDK was also linked](https://github.com/steipete/Aspects/issues/21).

Of course I tried to fix this. Contacting New Relic didn't bring any results at first, even after two paying customers started to report the same issue. After periodically bugging them for over a month I finally got a non-canned response, pointing me to [a blog entry about method swizzling](http://blog.newrelic.com/2014/04/16/right-way-to-swizzle/).

This basically says that using `method_exchangeImplementations` is really bad, and that pretty much _everybody_ does swizzling wrong. And they indeed have a point. Regular swizzling messes not only with your brain but also with assumptions that the runtime makes. Suddenly `_cmd` no longer is what it is supposed to be, and while in most cases it does not matter, there are a few cases where it does very much.

### How most people swizzle (including me)

This is the swizzling helper that I've used during the last few years:

```objective-c
BOOL PSPDFReplaceMethodWithBlock(Class c, SEL origSEL, SEL newSEL, id block) {
    PSPDFAssert(c && origSEL && newSEL && block);
    if ([c respondsToSelector:newSEL]) return YES; // Selector already implemented, skip

    Method origMethod = class_getInstanceMethod(c, origSEL);

    // Add the new method.
    IMP impl = imp_implementationWithBlock(block);
    if (!class_addMethod(c, newSEL, impl, method_getTypeEncoding(origMethod))) {
        PSPDFLogError(@"Failed to add method: %@ on %@", NSStringFromSelector(newSEL), c);
        return NO;
    }else {
        Method newMethod = class_getInstanceMethod(c, newSEL);

        // If original doesn't implement the method we want to swizzle, create it.
        if (class_addMethod(c, origSEL, method_getImplementation(newMethod), method_getTypeEncoding(origMethod))) {
            class_replaceMethod(c, newSEL, method_getImplementation(origMethod), method_getTypeEncoding(newMethod));
        }else {
            method_exchangeImplementations(origMethod, newMethod);
        }
    }
    return YES;
}
```

This is a very common approach, with a small twist that it takes a block and uses `imp_implementationWithBlock` to create an IMP trampoline out of it. Usage is as follows:

```objective-c
SEL touchesMovedSEL = NSSelectorFromString(@"pspdf_wacomTouchesMoved:withEvent:");
PSPDFWacomSwizzleMethodWithBlock(viewClass, @selector(touchesMoved:withEvent:), touchesMovedSEL, ^(UIView *_self, NSSet *touches, UIEvent *event) {
    [WacomManager.getManager.currentlyTrackedTouches moveTouches:touches knownTouches:[event touchesForView:_self] view:_self];
    ((void ( *)(id, SEL, NSSet *, UIEvent *))objc_msgSend)(_self, touchesMovedSEL, touches, event); // call the original method
});
```

(Yes, Wacom's framework for stylus support is horrible. There are way better ways to hook into touch handling, such as subclassing `UIApplication`'s `sendEvent:`.)

Note the cast to `objc_msgSend`. While this (by luck) worked without casting in the earlier days, this will probably crash your arm64 build if you don't cast this correctly, because the variable argument casting specifications changed. Add [`#define OBJC_OLD_DISPATCH_PROTOTYPES 0`](https://twitter.com/gparker/status/236582488355520512) to your files to make sure this is detected at compile time, or even better, use Xcode 6 and enable error checking on this:
<img src="/images/posts/swizzling-strict-msgSend.png">

### The Crash

This works as expected in most cases, but has the issue that the original implementation will be called with a different `_cmd` than it expects. This can be a problem when `_cmd` is actually used, such as in the touch forwarding logic. I learned this the hard way after swizzling `touchesMoved:withEvent:` to inject additional logic. The app crashed with the popular `doesNotRecognizeSelector:` exception.

```text
* thread #1: tid = 0x695bfa, 0x0000000104cee973 libobjc.A.dylib`objc_exception_throw, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x0000000104cee973 libobjc.A.dylib`objc_exception_throw
    frame #1: 0x000000010507e65d CoreFoundation`-[NSObject(NSObject) doesNotRecognizeSelector:] + 205
    frame #2: 0x0000000104fded8d CoreFoundation`___forwarding___ + 973
    frame #3: 0x0000000104fde938 CoreFoundation`__forwarding_prep_0___ + 120
    frame #4: 0x0000000103080ae1 UIKit`forwardTouchMethod + 247
  * frame #5: 0x00000001000f071e PSPDFCatalog`__56-[PSPDFWacomStylusDriver prepareViewForTouchMonitoring:]_block_invoke_2(.block_descriptor=0x0000000115e1d010, _self=0x000000010e94a2a0, touches=0x000000010fefbd40, event=0x000000010e61fd50) + 382 at PSPDFWacomStylusDriver.m:122
    frame #6: 0x0000000102f85bbc UIKit`-[UIWindow _sendTouchesForEvent:] + 372
    frame #7: 0x0000000102f866e4 UIKit`-[UIWindow sendEvent:] + 925
    frame #8: 0x0000000102f5e29a UIKit`-[UIApplication sendEvent:] + 211
    frame #9: 0x0000000102f4baed UIKit`_UIApplicationHandleEventQueue + 9579
    frame #10: 0x0000000104f7cd21 CoreFoundation`__CFRUNLOOP_IS_CALLING_OUT_TO_A_SOURCE0_PERFORM_FUNCTION__ + 17
    ...
    frame #15: 0x0000000102f4de33 UIKit`UIApplicationMain + 1010
```

Somehow UIKit wants to call `pspdf_wacomTouchesMoved:withEvent:` on a class that I definitely did not swizzle, and so of course the runtime throws an exception. But how did we end up here? Investigating the stack trace, UIKit's `forwardTouchMethod` looks interesting. Let's see what this actually does.

### Touch forwarding in UIKit

The base class for `UIView` is `UIResponder`, and it implements all basic touch handling:
(Note: I don't have access to the UIKit sources, so this might not be 100% accurate. The snippets are based on disassembling UIKit and manually converting this back to C.)

```objective-c
- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    forwardTouchMethod(self, _cmd, touches, event);
}
```

Here it gets interesting. `_cmd` is used directly in this C function that (at least the name suggests) then forwards our touches up the responder chain. But let's keep digging, just to make sure. For curiosity's sake, I translated the whole function, including legacy behavior. (I don't remember any announcement where Apple changed this in iOS 5. Is this somewhere documented? [Hit me up on Twitter if you know more.](http://twitter.com/steipete))

```objective-c
static void forwardTouchMethod(id self, SEL _cmd, NSSet *touches, UIEvent *event) {
	// The responder chain is used to figure out where to send the next touch
    UIResponder *nextResponder = [self nextResponder];
    if (nextResponder && nextResponder != self) {

    	// Not all touches are forwarded - so we filter here.
        NSMutableSet *filteredTouches = [NSMutableSet set];
        [touches enumerateObjectsUsingBlock:^(UITouch *touch, BOOL *stop) {

        	// Checks every touch for forwarding requirements.
            if ([touch _wantsForwardingFromResponder:self toNextResponder:nextResponder withEvent:event]) {
                [filteredTouches addObject:touch];
            }else {
            	// This is interesting legacy behavior. Before iOS 5, all touches are forwarded (and this is logged)
                if (!_UIApplicationLinkedOnOrAfter(12)) {
                    [filteredTouches addObject:touch];

                    // Log old behavior
                    static BOOL didLog = 0;
                    if (!didLog) {
                        NSLog(@"Pre-iOS 5.0 touch delivery method forwarding relied upon. Forwarding -%@ to %@.", NSStringFromSelector(_cmd), nextResponder);
                    }
                }
            }
        }];

        // here we basically call [nextResponder touchesBegan:filteredTouches event:event];
        [nextResponder performSelector:_cmd withObject:filteredTouches withObject:event];
    }
}
```

At this point I was a few hours in, digging through Apple's touch forwarding code. You can use Hopper to read through `_wantsForwardingFromResponder:toNextResponder:withEvent:`. Most of the code seems to track forwarding phases, checks for `exclusiveTouch`, different windows and there's even a dedicated [`_UITouchForwardingRecipient`](https://github.com/nst/iOS-Runtime-Headers/blob/master/Frameworks/UIKit.framework/_UITouchForwardingRecipient.h) class involved. There's quite a lot more logic in [UITouch](https://github.com/nst/iOS-Runtime-Headers/blob/master/Frameworks/UIKit.framework/UITouch.h#L81) than I would have expected.

Forwarding using `_cmd` is not restricted to touch handling at all - on the Mac it's used for `mouse[Entered|Exited|Moved]:` as well.

### A different approach on swizzling

Our naive use of `method_exchangeImplementations()` broke the `_cmd` assumption and resulted in a crash. How can we fix this? New Relic suggested using the direct method override. Let's try that:

```objective-c
__block IMP originalIMP = PSPDFReplaceMethodWithBlock(viewClass, @selector(touchesMoved:withEvent:), ^(UIView *_self, NSSet *touches, UIEvent *event) {
    [WacomManager.getManager.currentlyTrackedTouches moveTouches:touches knownTouches:[event touchesForView:_self] view:_self];
     ((void ( *)(id, SEL, NSSet *, UIEvent *))originalIMP)(_self, @selector(touchesMoved:withEvent:), touches, event);
});

static IMP PSPDFReplaceMethodWithBlock(Class c, SEL origSEL, id block) {
    NSCParameterAssert(block);

    // get original method
    Method origMethod = class_getInstanceMethod(c, origSEL);
    NSCParameterAssert(origMethod);

    // convert block to IMP trampoline and replace method implementation
    IMP newIMP = imp_implementationWithBlock(block);

    // Try adding the method if not yet in the current class
    if (!class_addMethod(c, origSEL, newIMP, method_getTypeEncoding(origMethod))) {
        return method_setImplementation(origMethod, newIMP);
    }else {
        return method_getImplementation(origMethod);
    }
}
```

This solves our problem. We preserve the correct selector (there's no `pspdf_wacomTouchesMoved:withEvent:` method anymore) and thus UIKit's touch forwarding works as expected. The method replacing logic is also simpler.

However, there are downsides to this approach as well. We are now modifying the `touchesBegan:withEvent:` method of our custom `UIView` subclass. There is no default implementation yet, so we get the IMP from UIResponder and then manually call this. Imagine if at some later point, somebody else would swizzle `touchesBegan:withEvent:` on `UIView` directly using the same technique. Assuming `UIView` has no custom touch handling code, they would get the IMP from UIResponder and add a new method to `UIView`. But then our method gets called, which already captured the IMP of `UIResponder` and completely ignores the fact that we modified `UIView` as well.

### Epilogue

There are solutions to this problem, but they are extremely complex, such as [CydiaSubstrate's MSHookMessageEx](https://github.com/r-plus/substrate/blob/master/ObjectiveC.cpp#L68), but since this requires a kernel patch (and thus a jailbreak), it's not something you would use in an App Store app.

If you read trough the whole article and are wondering why I'm not simply subclassing the touch handlers, you are right. This is the usual approach. However we recently added [stylus support for a variety of vendors](https://github.com/PSPDFKit/PSPDFKit-Demo/wiki/Stylus-Support), and this is built via external driver classes, so that we don't have to "pollute" the framwork with the different approaches. Wacom is the only vendor that requires direct touch forwarding, and every vendor has it's own way to manage touches and views. Integrating all these into a single class would result in a very hard-to-maintain class, and licensing issues would also prevent us from shipping the framework binaries directly. Furthermore, only some companies use the stylus code, so we designed this to be modular. (e.g. Dropbox just uses PSPDFKit as a Viewer, and thus doesn't need that part.)

Further Reading:

- [Mike Ash: Method Replacement for Fun and Profit (also read the comments!)](http://www.mikeash.com/pyblog/friday-qa-2010-01-29-method-replacement-for-fun-and-profit.html).
- [Documentation for MSHookMessageEx](http://www.cydiasubstrate.com/api/c/MSHookMessageEx/)
- [New Relic's "The Right Way to Swizzle in Objective-C"](http://blog.newrelic.com/2014/04/16/right-way-to-swizzle/)
- [UIKit Headers](https://github.com/nst/iOS-Runtime-Headers/tree/master/Frameworks/UIKit.framework)
- [Hopper Disassembler](http://www.hopperapp.com/)
- [i386 Addressing Modes and Assembler Instructions](https://developer.apple.com/library/mac/documentation/DeveloperTools/Reference/Assembler/060-i386_Addressing_Modes_and_Assembler_Instructions/i386_intructions.html#//apple_ref/doc/uid/TP30000825-TPXREF101)
- [IA-32 Function Calling Conventions](https://developer.apple.com/library/mac/documentation/DeveloperTools/Conceptual/LowLevelABI/130-IA-32_Function_Calling_Conventions/IA32.html#//apple_ref/doc/uid/TP40002492-SW4)
