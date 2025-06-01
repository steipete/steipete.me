---
title: "Hacking Block Support Into UIMenuItem"
pubDatetime: 2012-07-17T16:22:00.000Z
description: "Implement block support for UIMenuItem by swizzling the responder chain to enable cleaner API patterns."
tags:
  - iOS-Development
  - Objective-C
  - UIKit
  - Blocks
  - Method-Swizzling
  - Responder-Chain
source: petersteinberger.com
AIDescription: true
---

tl;dr: UIMenuItem! Blocks! [Get the code on GitHub.](https://github.com/steipete/PSMenuItem)

While developing a new version of [PSPDFKit](http://pspdfkit.com), I started using UIMenuController more and more. The first thing you'll notice is that it's different from your typical target/action pattern, in that the target is missing:

```objective-c
    [UIMenuItem alloc] initWithTitle:@"Title" action:@selector(menuItemAction:)];
```

This is actually pretty genius, in part. iOS checks if the @selector can be invoked calling `canPerformAction:withSender:`, which is part of UIResponder. If the object returns NO, the system walks up the UIResponder chain until it finds an object that returns YES or `nextResponder` returns nil.

A typical responder chain looks like this: UIView -> UIViewController -> UINavigationController -> UIApplication -> AppDelegate.

This works very, very well most of the time, but there's one problem: if you need to have different items with the same title, all you can do is check the UIMenuController.menuItems to get the selected menu item. This is not very elegant. Especially now that we have [blocks](http://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/Blocks/Articles/00_Introduction.html) since iOS 4.0, I kept thinking if there's a better way to do this. I googled around, and most people solve this by subclassing `UIMenuItem` and adding some category. This works, but not for `performAction:withSender:` since that's not implemented on `UIMenuItem` but somewhere in the UIEvent family, and there's no trace of what UIMenuItem is currently invoked.

So first, let's revisit how we usually show a menu:

1. Register to be able to become first responder

```objective-c
// in the .h
@interface MyView : UIView
@end

// in the .m
- (BOOL)canBecomeFirstResponder {
    return YES;
}
```

2. Add the menu items when needed

```objective-c
- (void)showMenuAction:(id)sender {
    UIMenuItem *testItem = [[UIMenuItem alloc] initWithTitle:@"Test" action:@selector(test:)];
    UIMenuController *menuController = [UIMenuController sharedMenuController];
    [menuController setMenuItems:[NSArray arrayWithObject:testItem]];
    [menuController setTargetRect:self.bounds inView:self];
    [menuController update];
    [menuController setMenuVisible:YES animated:YES];
}
```

3. Implement `canPerformAction:withSender` to respond to actions

```objective-c
- (BOOL)canPerformAction:(SEL)action withSender:(id)sender {
    // We return YES (or call super) for the actions we actually implement
    if (action == @selector(test:)) {
        return YES;
    }
    return NO; // NO for all actions that we don't implement
}

- (void)test:(id)sender {
    NSLog(@"test");
}
```

So we've got a working menu system, but what if we'd want another menu item "Test 2" to do something completely different? Or if we'd want to encapsulate menu creation in a separate file? Usually you would either create a category on UIResponder (which works, but it's a bit ugly to add 10 methods in a category) or use `didHideMenuNotification` and query what selection was last active.

Some third-party controls solve this problem by subclassing UIMenuItem and adding an "id" property. But I'm quite sure this is against the iOS SDK Agreement, since you're not supposed to subclass UIKit controls that are not explicitly marked for subclassing. It's also a chore to manually check if your menu item is the one that is invoked.

Another idea is to use the sender ID to figure out what menu is active. However, the sender passed to `canPerformAction:withSender:` is sometimes `UIMenuController`, sometimes `UICalloutBarButtonItem`; this isn't reliable.

What we really want is a `UIMenuItem` category that adds block support. Something like this:

```objective-c
UIMenuItem *mailItem = [[UIMenuItem alloc] initWithTitle:NSLocalizedString(@"Mail", @"") block:^{
    NSLog(@"Clicked on Mail");
}];
```

I really really like blocks for their flexibility and encapsulation, and I saw this as the only solution that's "right". But, at first sight this solution isn't possible. We can't store the block in the UIMenuItem, and we can't use a simple NSDictionary for mapping, since there's simply no trace of the selected menu item when an action is triggered. If UIMenuItem would send the action to a view, we could swizzle `performAction:`, hook into it, and check what action is triggered, but the code flow is exactly the opposite: the view calls the action. Calling the action will call the target, which is "missing" with `UIMenuItem`. So the view that receives `test:` doesn't really know what `UIMenuItem` is calling it.

(I _briefly_ considered overriding `test:` to check what `UIMenuItem` is visible on each call, but this would be a multi-step approach, and I don't want to hook into the UIMenu system on a lower level from multiple sides. That feels really hacky, and I'm afraid that it might break more easily with future iOS versions.)

After playing around with a few more solutions (and rejecting them), I looked around in a few popular iOS frameworks to see how they handle this. [MGTwitterEngine](https://github.com/mattgemmell/MGTwitterEngine) uses a delegate pattern to map asynchronous operations to completion delegates. [AFNetworking](https://github.com/AFNetworking/AFNetworking) uses blocks for completion handlers. Then it hit me: what if the action is just a placeholder, and we can replace it with something else? We could [swizzle](http://cocoadev.com/wiki/MethodSwizzling) canPerformAction: and check if we get our placeholder method. If yes, replace it with some other @selector.

But, we face two problems here: first, we need to remember what @selector needs what block. And second - what @selector to use? The solution for the first is the classic Objective-C one: use a static dictionary to remember the mapping from action to block. For the second problem, we need to synthesize a method.

There is a big drawback, however: this method MUST be implemented on the application! So what to pick? Apple has a little selection of _private_ or undocumented methods, and looking at all selectors, I've found one that looked both unique and safe: `_accessibilitySetFocusToLiveRegion:`. This is part of the accessibility framework, but there's no trace of it in normal AppKit code, and implementing it doesn't break anything.

## Implementation

Now that we have the general idea, let's implement UIMenuItem+PSMenuItem to capture initialization with a block:

```objective-c
typedef void(^PSMenuItemBlock)(id sender);

@interface UIMenuItem (PSMenuItem)
// Static way, doesn't need custom view
- (id)initWithTitle:(NSString *)title block:(PSMenuItemBlock)block;
@end

@implementation UIMenuItem (PSMenuItem)

- (id)initWithTitle:(NSString *)title block:(PSMenuItemBlock)block {
    if ((self = [self initWithTitle:title action:@selector(_accessibilitySetFocusToLiveRegion:)])) {
        PSMenuItemWithBlockAction(self.action, block);
    }
    return self;
}

@end
```

That was simple. Now we need to implement the swizzling to capture `canPerformAction:withSender:` and replace it on the fly. The swizzling itself is done via a class that is automatically initialized via `dispatch_once` and in a "+load" method.

```objective-c
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wundeclared-selector"

static NSString *PSMenuItemEnabledActions = @"PSMenuItemEnabledActions";
static NSMutableDictionary *PSMenuItemActionBlocks = nil;

// action helper. the real magic is done here.
NS_INLINE void PSMenuItemWithBlockAction(SEL action, PSMenuItemBlock block) {
    NSCParameterAssert(action);
    NSCParameterAssert(block);

    // use one dictionary per action for UX safety.
    static dispatch_once_t predicate;
    dispatch_once(&predicate, ^{
        PSMenuItemActionBlocks = [[NSMutableDictionary alloc] init];
    });
    PSMenuItemActionBlocks[@(action)] = [block copy];

    // register action
    [PSMenuItem associateMenuItemAction:action];
}

@implementation PSMenuItem

// will swizzle for great glory.
+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
    });
}

// globally enable a custom SEL to be used as a menu item.
+ (void)associateMenuItemAction:(SEL)action {
    static dispatch_once_t oncePredicate;
    dispatch_once(&oncePredicate, ^{
        NSDictionary *actions = [[NSUserDefaults standardUserDefaults] objectForKey:PSMenuItemEnabledActions];
        if (actions) {
            // we have a saved dictionary, try to convert to SEL
            for (NSString *actionStr in actions) {
                SEL selector = NSSelectorFromString(actionStr);
                [self associateMenuItemAction:selector];
            }
        }
    });

    NSString *actionString = NSStringFromSelector(action);
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSMutableArray *actions = [NSMutableArray arrayWithArray:[defaults objectForKey:PSMenuItemEnabledActions]];
    if (![actions containsObject:actionString]) {
        [actions addObject:actionString];
        [defaults setObject:actions forKey:PSMenuItemEnabledActions];
        [defaults synchronize];

        // don't swizzle twice
        static NSMutableSet *swizzledClasses = nil;
        static dispatch_once_t onceToken;
        dispatch_once(&onceToken, ^{
            swizzledClasses = [[NSMutableSet alloc] init];
        });

        // now swizzle everything UIResponder for great victory
        @synchronized(self) {
            const char *className;
            Class currentClass, superClass = [UIResponder class];
            int numClasses, newNumClasses;
            Class *classes = NULL, *newClasses;

            numClasses = objc_getClassList(NULL, 0);

            if (numClasses > 0) {
                classes = (__unsafe_unretained Class *)malloc(sizeof(Class) * numClasses);
                numClasses = objc_getClassList(classes, numClasses);

                newClasses = NULL;
                newNumClasses = numClasses;

                for (int classIndex = 0; classIndex < numClasses; ++classIndex) {
                    currentClass = classes[classIndex];

                    if (!class_getSuperclass(currentClass)) {
                        continue;
                    }
                    if ((int(*)(id, SEL, SEL, id))class_getMethodImplementation(currentClass, @selector(canPerformAction:withSender:)) == (int(*)(id, SEL, SEL, id))class_getMethodImplementation(superClass, @selector(canPerformAction:withSender:))) {
                        continue;
                    }

                    className = class_getName(currentClass);
                    if (strcmp(className, "UICalloutBarButton") == 0) {
                        continue;
                    }

                    if ([currentClass isSubclassOfClass:superClass] && ![swizzledClasses containsObject:currentClass]) {
                        SEL canPerformSelector = @selector(canPerformAction:withSender:);
                        if (class_getInstanceMethod(currentClass, canPerformSelector)) {
                            IMP origIMP = class_getMethodImplementation(currentClass, canPerformSelector);
                            SEL origIMPSEL = NSSelectorFromString([@"_orig_canPerformAction_" stringByAppendingString:NSStringFromClass(currentClass)]);
                            class_addMethod(currentClass, origIMPSEL, origIMP, method_getTypeEncoding(class_getInstanceMethod(currentClass, canPerformSelector)));

                            // Add the new method and swizzle.
                            IMP myIMP = imp_implementationWithBlock(PSCanPerformActionSwizzleBlock);
                            method_setImplementation(class_getInstanceMethod(currentClass, canPerformSelector), myIMP);

                            [swizzledClasses addObject:currentClass];

                            NSString *className = NSStringFromClass(currentClass);
                            NSLog(@"class %@ has canPerformAction swizzled.", className);
                        }
                    }
                }

                free(classes);
                if (newClasses) free(newClasses);
            }
        }
    }
}

// imp_implementationWithBlock doesn't work great on __IPHONE_OS_VERSION_MIN_REQUIRED < __IPHONE_4_0, where this is commonly defined to be __IPHONE_3_0.
#if defined(__IPHONE_OS_VERSION_MIN_REQUIRED) && __IPHONE_OS_VERSION_MIN_REQUIRED < __IPHONE_4_0
#import <objc/runtime.h>
#import <objc/objc-runtime.h>
#endif

// we declare a helper to find out if custom menu actions are available. otherwise just returns YES if we're the accessibilityFocus selector
static IMP PSReplaceCanPerformActionWithTarget(SEL origSEL, IMP replaceIMP, SEL replaceSEL, Class target, BOOL aggressive) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wundeclared-selector"
    // first check if the class actually has an IMP for the selector (not every UIResponder has)
    IMP origIMP = class_getMethodImplementation(target, origSEL);
    if (!origIMP) return NULL;

    // don't swizzle twice
    NSString *replaceIMPStr = NSStringFromSelector(replaceSEL);
    if ([replaceIMPStr hasPrefix:@"_orig_"]) {
        return NULL;
    }

    @try {
        Method origMethod = class_getInstanceMethod(target, origSEL);
        Method replaceMethod = class_getInstanceMethod(target, replaceSEL);
        if(replaceMethod && origMethod) {
            if(class_addMethod(target, origSEL, method_getImplementation(replaceMethod), method_getTypeEncoding(replaceMethod))) {
                class_replaceMethod(target, replaceSEL, method_getImplementation(origMethod), method_getTypeEncoding(origMethod));
                return method_getImplementation(origMethod);
            }else {
                method_exchangeImplementations(origMethod, replaceMethod);
                return method_getImplementation(replaceMethod);
            }
        }else if(aggressive) {
            return method_setImplementation(origMethod, replaceIMP);
        }
    }
    @catch (NSException *exception) {
        NSLog(@"Failed to swizzle: %@", exception);
    }
    return NULL;
}

static BOOL PSCanPerformActionSwizzleBlock(id self, SEL _cmd, SEL action, id sender) {
    for (NSData *sel in PSMenuItemActionBlocks) {
        SEL selector = nil;
        [sel getBytes:&selector length:sizeof(selector)];
        if (selector == action) {
            return YES;
        }
    }

    // call original implementation if the selector doesn't match
    SEL origSel = NSSelectorFromString([@"_orig_canPerformAction_" stringByAppendingString:NSStringFromClass([self class])]);
    BOOL retVal = NO;

    // don't crash if the original Method doesn't exist anymore. Should never happen
    if ([self respondsToSelector:origSel]) {
        retVal = (BOOL)objc_msgSend(self, origSel, action, sender);
    }

    return retVal;
}

+ (BOOL)validateAction:(SEL)selector {
    for (NSData *sel in PSMenuItemActionBlocks) {
        SEL action = nil;
        [sel getBytes:&action length:sizeof(action)];
        if (action == selector) {
            return YES;
        }
    }
    return NO;
}

+ (PSMenuItemBlock)blockForAction:(SEL)selector {
    return PSMenuItemActionBlocks[@(selector)];
}

+ (void)performAction:(SEL)selector withSender:(id)sender {
    PSMenuItemBlock callBlock = PSMenuItemActionBlocks[@(selector)];
    if (callBlock) {
        callBlock(sender);
    }
}

+ (void)performAccessibilityActionWithSender:(id)sender {
    [self performAction:@selector(_accessibilitySetFocusToLiveRegion:) withSender:sender];
}

@end
```

Now we hook into `UIResponder` (I've decided against subclassing), and we need to override the action response. This looks funky but actually works:

```objective-c
@implementation UIResponder (PSMenuItem)

// Called instead of _accessibilitySetFocusToLiveRegion:sender.
- (void)_accessibilitySetFocusToLiveRegion:(id)sender {
    [PSMenuItem performAccessibilityActionWithSender:sender];
}

@end
```

## A Sample

The usage is extremely similar to our initial example:

```objective-c
- (void)showMenuAction:(id)sender {
    UIMenuItem *testItem = [[UIMenuItem alloc] initWithTitle:@"Test" block:^(id sender) {
        NSLog(@"test");
    }];
    UIMenuController *menuController = [UIMenuController sharedMenuController];
    [menuController setMenuItems:[NSArray arrayWithObject:testItem]];
    [menuController setTargetRect:self.bounds inView:self];
    [menuController update];
    [menuController setMenuVisible:YES animated:YES];
}

- (BOOL)canBecomeFirstResponder {
    return YES;
}

// selectively decide what menu items to display
- (BOOL)canPerformAction:(SEL)action withSender:(id)sender {
    if (action == @selector(_accessibilitySetFocusToLiveRegion:)) {
        return YES;
    }
    return NO;
}
```

That's it! Using blocks has a few disadvantages, though. If we declare the block in the view scope, we automatically capture all variables on the stack and [retain them](http://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/Blocks/Articles/bxVariables.html). That's not always a good idea. A good rule of thumb is to capture the variables you need, and use `[weakSelf self]` if you need to capture self. There's a [whole blog post](http://blog.parse.com/2012/04/12/building-for-ios-with-parse-blocks-and-categories/) on Parse's blog about using blocks with self. In a nutshell:

```objective-c
__weak id weakSelf = self;
void (^myCommonBlock)(UIMenuItem *, UIView *, CGRect) = ^(UIMenuItem *item, UIView *view, CGRect bounds) {
    __strong id strongSelf = weakSelf;
    if (strongSelf) {
        // ... do your thing
    }
};
```

## Source

The code is available on GitHub at [https://github.com/steipete/PSMenuItem](https://github.com/steipete/PSMenuItem).

## Issues & Fixes

**Update (2012/07/18)**: Apple internally calls `canPerformAction:withSender:` recursively. While searching for possible candidates for `_accessibilitySetFocusToLiveRegion:`, I started to look at calling all of the undocumented/private methods to check if any of them would look good. However, all of them are actually called by AppKit code, including the accessibility one. I somehow missed that. When an accessibility client queries a responder for elements, this is ultimately called to check what elements are available. What happens then is interesting - our `canPerformAction:withSender:` swizzled one is called again, but we don't call the original if our action is not found. This resulted in a classic infinite recursion and a EXC_BAD_ACCESS crash.

To fix this, we might need to restrict swizzling to specific classes, but that would be a lot more code, and we'd likely miss some. The much simpler solution is to use a flag. Before `PSCanPerformActionSwizzleBlock` executes, we set a thread-local variable to say that we're already checking, and in that case we always call the original. This way, all `canPerformAction:withSender:` calls work, but any recursive call will call the original.

Here's the fix:

```objective-c
static BOOL PSCanPerformActionSwizzleBlock(id self, SEL _cmd, SEL action, id sender) {
    // check if we're already verifying. (The method is called recursively).
    static NSString *PSCanPerformActionKey = @"PSCanPerformActionKey";
    if ([[NSThread currentThread].threadDictionary objectForKey:PSCanPerformActionKey]) {
        SEL origSel = NSSelectorFromString([@"_orig_canPerformAction_" stringByAppendingString:NSStringFromClass([self class])]);
        BOOL retVal = NO;

        if ([self respondsToSelector:origSel]) {
            retVal = (BOOL)objc_msgSend(self, origSel, action, sender);
        }

        return retVal;
    }

    [NSThread currentThread].threadDictionary[PSCanPerformActionKey] = @YES;
    @try {
        for (NSData *sel in PSMenuItemActionBlocks) {
            SEL selector = nil;
            [sel getBytes:&selector length:sizeof(selector)];
            if (selector == action) {
                return YES;
            }
        }

        // call original implementation if the selector doesn't match
        SEL origSel = NSSelectorFromString([@"_orig_canPerformAction_" stringByAppendingString:NSStringFromClass([self class])]);
        BOOL retVal = NO;

        // don't crash if the original Method doesn't exist anymore. Should never happen
        if ([self respondsToSelector:origSel]) {
            retVal = (BOOL)objc_msgSend(self, origSel, action, sender);
        }

        return retVal;
    }
    @finally {
        [[NSThread currentThread].threadDictionary removeObjectForKey:PSCanPerformActionKey];
    }
}
```

Using @try/@finally makes sure that we don't leak the thread-local variable.

**Update**: Just realized that there's a `__bridge_retained` leak in the imp_implementationWithBlock call, since we never call imp_removeBlock. This is a one-time leak when the class loads, so this is acceptable, especially since we simply can never know when to remove the IMP.

**Update (2012/07/18 v2)**: I uploaded a new version which is much simpler and doesn't depend on a special selector, but instead simply replaces the selector that is used. This works by intercepting the action in UIMenuItem's init function. A bit nasty, but it's much cleaner.

**Update (2014/01)**: Completely rewrote the category to just use associated objects and method swizzling. Saved the code on [GitHub](https://github.com/steipete/PSMenuItem) and created a pod for it.
