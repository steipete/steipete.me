---
title: Hacking Block Support Into UIMenuItem
pubDate: '2012-07-17 16:22'
description: 'tl;dr: UIMenuItem! Blocks! While developing a new version of PSPDFKit, I started using UIMenuController more and more.'
tags:
  - iOS
  - macOS
  - Objective-C
  - UIKit
  - SwiftUI
  - Debugging
  - Xcode
source: petersteinberger.com
---

tl;dr: UIMenuItem! Blocks! [Get the code on GitHub.](https://github.com/steipete/PSMenuItem)

While developing a new version of [PSPDFKit](http://pspdfkit.com), I started using UIMenuController more and more. The first thing you'll notice is that it's different from your typical target/action pattern, in that the target is missing:

``` objective-c
    [UIMenuItem alloc] initWithTitle:@"Title" action:@selector(menuItemAction:)];
```

This is actually pretty genius, in part. iOS checks if the @selector can be invoked calling ```canPerformAction:withSender:```, which is part of UIResponder. If the object returns NO, the system walks up the UIResponder chain until it finds an object that returns YES or ```nextResponder``` returns nil.

A typical responder chain looks like this: UIView -> UIViewController -> UINavigationController -> UIApplication -> AppDelegate.

Now this is great in theory. For example, if you implement`copy:` on your viewController, the firstResponder can be any subview and it still works. In practice, however, I found this more limiting and annoying. And [I'm not the only one](https://twitter.com/hatfinch/statuses/224925043556225024).

Especially if your menus get more complex, your code is littered with selectors. So let's write a block-based subclass. Enter PSMenuItem:

``` objective-c
    PSMenuItem *actionItem = [[PSMenuItem alloc] initWithTitle:@"Action 1" block:^{
        NSLog(@"Hello, from a block!");
    }];
```

My *naive* approach was to just use one common selector internally and execute the block that is saved in the PSMenuItem subclass. The only problem: `(id)sender` of the action gets called with the UIMenuController. This is **wrong** on so many levels, especially since UIMenuController is a singleton anyway. There's no easy way to know what UIMenuItem has been pressed.
But since I was already committed to writing the subclass, that couldn't stop me. We just create a unique selector for each UIMenuItem, and catch execution at a lower level.

### Enter Cocoa's Message Forwarding

If the runtime can't find a selector on the current class, message forwarding is started. (That's the tech that allows classes like NSUndoManager or NSProxy.)

1. **Lazy method resolution:** `resolveInstanceMethod:` is called. If this returns YES, message sending is restarted, as the system assumes that the method has been added at runtime. We could theoretically use this and add a method that calls the block at runtime. But this would pollute the object with many new methods -- not what we want.

2. **Fast forwarding path:**  `-(id)forwardingTargetForSelector:(SEL)sel` has been added in Leopard as a faster approach to the NSInvocation-based message forwarding. We could use this to react to our custom selector, but we would have to return an object that implements our selector (or does not throw an exception with undefined methods.) Possible candidate, but there's something better.

3. **Normal forwarding path:** This is the "classic" message forwarding that has existed since the old days. And actually, two methods are called here: `methodSignatureForSelector:`, followed by `forwardInvocation:`. (The method signature is needed to build the NSInvocation.) PSMenuItem hooks into both of those methods. But let's go step by step through PSMenuItem's `+ (void)installMenuHandlerForObject:(id)object`:

``` objective-c
+ (void)installMenuHandlerForObject:(id)object {
    @autoreleasepool {
        @synchronized(self) {
            // object can be both a class or an instance of a class.
            Class objectClass = class_isMetaClass(object_getClass(object)) ? object : [object class];
```

Note the @synchronized; swizzling is not threadsafe. Also, we add an @autoreleasepool here, as this could be executed from +load or +initialize at a very early time when there's no default NSAutoreleasePool in place yet.

`class_isMetaClass` checks if `object_getClass` returns a class or a metaclass. This is needed because "object" can both be an instance of a class or a class object itself, and you can't just invoke an isKindOfClass on a Class object. If you're wondering what a metaclass is, it's basically a class that defines methods available on the class. [CocoaWithLove has a great article on that.](http://cocoawithlove.com/2010/01/what-is-meta-class-in-objective-c.html)

``` objective-c
            // check if menu handler has been already installed.
            SEL canPerformActionSEL = NSSelectorFromString(@"pspdf_canPerformAction:withSender:");
            if (!class_getInstanceMethod(objectClass, canPerformActionSEL)) {

                // add canBecomeFirstResponder if it is not returning YES. (or if we don't know)
                if (object == objectClass || ![object canBecomeFirstResponder]) {
                    SEL canBecomeFRSEL = NSSelectorFromString(@"pspdf_canBecomeFirstResponder");
                    IMP canBecomeFRIMP = imp_implementationWithBlock(PSPDFBlockImplCast(^(id _self) {
                        return YES;
                    }));
                    PSPDFReplaceMethod(objectClass, @selector(canBecomeFirstResponder), canBecomeFRSEL, canBecomeFRIMP);
                }
```

Here we test if the class has already been swizzled by us with using `class_getInstanceMethod`. Again, because object might be a Class already, we can't just use `respondsToSelector:`. Next, we test if we should add a handler to `canBecomeFirstResponder`. This is needed to make the UIMenuController display in the first place.

Note the `imp_implementationWithBlock`. This is a new method in iOS 4.3 upward, but has a much nicer syntax and is more compact than classic C functions. There's another small annoyance: `PSPDFBlockImplCast`. The syntax of `imp_implementationWithBlock` was slightly changed in yet-to-be released versions of Xcode. Older versions still need the `(__bridge void *)` cast; newer versions will complain and only work without.

`PSPDFReplaceMethod` is a helper that first adds the new method via our pspdf_ selector name, then swizzles the original implementation with our custom implementation:

``` objective-c
                // swizzle canPerformAction:withSender: for our custom selectors.
                // Queried before the UIMenuController is shown.
                IMP canPerformActionIMP = imp_implementationWithBlock(PSPDFBlockImplCast(^(id _self, SEL action, id sender) {
                    return PSIsMenuItemSelector(action) ? YES : ((BOOL (*)(id, SEL, SEL, id))objc_msgSend)(_self, canPerformActionSEL, action, sender);
                }));
                PSPDFReplaceMethod(objectClass, @selector(canPerformAction:withSender:), canPerformActionSEL, canPerformActionIMP);
```

Next up, we swizzle `canPerformAction:withSender:`. This is called before the UIMenuController is displayed. If we detect our custom selector (`PSIsMenuItemSelector`), we return YES, else we call the original implementation. Note the tricky casting on `objc_msgSend`. (We could also build an NSInvocation, but that would be much slower and needs much more code).

`PSIsMenuItemSelector` is just shorthand for `return [NSStringFromSelector(selector) hasPrefix:kMenuItemTrailer];`:

``` objective-c
                // swizzle methodSignatureForSelector:.
                SEL methodSignatureSEL = NSSelectorFromString(@"pspdf_methodSignatureForSelector:");
                IMP methodSignatureIMP = imp_implementationWithBlock(PSPDFBlockImplCast(^(id _self, SEL selector) {
                    if (PSIsMenuItemSelector(selector)) {
                        return [NSMethodSignature signatureWithObjCTypes:"v@:@"]; // fake it.
                    }else {
                        return (NSMethodSignature *)objc_msgSend(_self, methodSignatureSEL, selector);
                    }
                }));
                PSPDFReplaceMethod(objectClass, @selector(methodSignatureForSelector:), methodSignatureSEL, methodSignatureIMP);
```

Next, we arrive at the method that's called during message forwarding, when the user selects a UIMenuItem. We again check for the selector and return a faked `NSMethodSignature`. If we wouldn't return a signature here, we'd get a *selector not implemented* exception. `"v@:@"` is the selector encoding for `-(void)action:(id)sender`. v is the return type (void), the first @ is self, the : is the selector (_cmd), the @ finally is id sender. [You can learn more on Apple Developer about objc type encodings.](http://developer.apple.com/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Articles/ocrtTypeEncodings.html)

``` objective-c
                // swizzle forwardInvocation:
                SEL forwardInvocationSEL = NSSelectorFromString(@"pspdf_forwardInvocation:");
                IMP forwardInvocationIMP = imp_implementationWithBlock(PSPDFBlockImplCast(^(id _self, NSInvocation *invocation) {
                    if (PSIsMenuItemSelector([invocation selector])) {
                        for (PSMenuItem *menuItem in [UIMenuController sharedMenuController].menuItems) {
                            if ([menuItem isKindOfClass:[PSMenuItem class]] && sel_isEqual([invocation selector], menuItem.customSelector)) {
                                [menuItem performBlock]; break; // find corresponding MenuItem and forward
                            }
                        }
                    }else {
                        objc_msgSend(_self, forwardInvocationSEL, invocation);
                    }
                }));
                PSPDFReplaceMethod(objectClass, @selector(forwardInvocation:), forwardInvocationSEL, forwardInvocationIMP);
            }
        }
    }
}
```

Finally, the last piece. After `methodSignatureForSelector` returns a valid NSMethodSignature, the system builds an NSInvocation object that we can handle (or not). Here we load the selector, loop through all menuItems in the UIMenuController, and finally call the block on the PSMenuItem, if found. Note that we could also extract UIMenuController from the NSInvocation itself, but since it's a singleton, there's no need for that.

One simple piece remains. We build up the custom selector in our `initWithTitle:block:`

``` objective-c
    // Create a unique, still debuggable selector unique per PSMenuItem.
    NSString *strippedTitle = [[[title componentsSeparatedByCharactersInSet:[[NSCharacterSet letterCharacterSet] invertedSet]] componentsJoinedByString:@""] lowercaseString];
    CFUUIDRef uuid = CFUUIDCreate(kCFAllocatorDefault);
    NSString *uuidString = CFBridgingRelease(CFUUIDCreateString(kCFAllocatorDefault, uuid));
    CFRelease(uuid);
    SEL customSelector = NSSelectorFromString([NSString stringWithFormat:@"%@_%@_%@:", kMenuItemTrailer, strippedTitle, uuidString]);
```

I've even used a UUID to allow menu items with the same title; they otherwise would generate the same selector and would potentially call the wrong block.

Also, thanks to Mike Ash for his great [Friday Q&A about Objective-C Message Forwarding.](http://www.mikeash.com/pyblog/friday-qa-2009-03-27-objective-c-message-forwarding.html)
