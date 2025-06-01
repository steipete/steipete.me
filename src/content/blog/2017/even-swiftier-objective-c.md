---
title: Even Swiftier Objective-C
pubDatetime: 2017-06-14T12:00:00.000Z
description: "Explores new Objective-C features and improvements introduced at WWDC 2017 that make the language more Swift-like."
tags:
  - iOS
  - Development
source: pspdfkit.com
AIDescription: true
---

Another fascinating WWDC is behind us. This year we again witnessed a whole host of newly presented features and refinements to the Swift language, now already in its fourth installment. It's great to see how the language has progressed over the last couple years. Unfortunately, since binary compatibility has been delayed further (at least there's a [Manifesto](https://github.com/apple/swift/blob/master/docs/ABIStabilityManifesto.md) now), and module stability is still even further away, we are unable to use Swift in our binary PSPDFKit SDK. However, we do use it for our tests and in [PDF Viewer](https://pdfviewer.io).

If you write a new app in 2017, you should use Swift. Though there may still be cases where you need to work with Objective-C. Perhaps you are dealing with a legacy application, or you might have other reasons why Swift cannot be used. For example, if your app heavily inter-ops with C++ (like ours does). In that case, you might have been disappointed on the relatively little attention that the other main Apple programming language received recently. But fear not, PSPDFKit is coming to the rescue. Here are some of our favorite tips on how to improve Objective-C on your own.

If you haven't read our part 1 ["Swifty Objective-C"](/blog/2016/swifty-objective-c/), we'd recommend you to check it out first, as this article builds on some of the concepts outlined there. It's also a treasure trove of awesome little things that will make your code better, safer and more compact. Oh, and speaking of better code. Save your precious time and let a computer do [code formatting](https://pspdfkit.com/blog/2017/linting-and-code-formatting-at-pspdfkit/) for you!

## var and let

In our original ["Swifty Objective-C"](/blog/2016/swifty-objective-c/) blog post we talked about the C++ `auto` keyword and how it’s great for preserving type information while also making the code more readable and easier to write. This is especially true when dealing with generics or block types. Since then, Objective-C learned the same trick via the new `__auto_type` keyword. Since nobody wants to type `__auto_type` all day long, we decided to make things nicer by defining Swift-like macros for it.

```objc
#if defined(__cplusplus)
#define let auto const
#else
#define let const __auto_type
#endif

#if defined(__cplusplus)
#define var auto
#else
#define var __auto_type
#endif
```

Those even work if you mix Objective-C and C++ code.

## foreach

Both Swift and Objective-C have a `for..in` syntax. The benefit of Swift is that the loop variable type is inferred from the collection. This wasn't possible for a long time in Objective-C as the language didn't have generics. Now, we finally have lightweight generics in Objective-C however the underlying code hasn't been fully updated. `NSFastEnumeration` has a specialization called `NSEnumerator` that has been _generic-ified_, but collection classes don't inherit from that yet.

We tried to come up with a trick to infer the object type from any collection, but not all of them have helpers like `firstObject` that can be used to infer the item type. However, this is where categories are super useful and allow us to add this ourselves! Shout-out to [Martin Kiss](https://github.com/Tricertops/Typed) who works on the amazing [PaintCode](https://www.paintcodeapp.com) for coming up with the idea and sharing it with the world.

```objc
@protocol PSPDFFastEnumeration <NSFastEnumeration>
- (id)pspdf_enumeratedType;
@end

// Usage: foreach (s, strings) { ... }
#define foreach(element, collection) for (typeof((collection).pspdf_enumeratedType) element in (collection))

@interface NSArray <ElementType> (PSPDFFastEnumeration) <PSPDFFastEnumeration>
- (ElementType)pspdf_enumeratedType;
@end

@interface NSSet <ElementType> (PSPDFFastEnumeration) <PSPDFFastEnumeration>
- (ElementType)pspdf_enumeratedType;
@end

@interface NSDictionary <KeyType, ValueType> (PSPDFFastEnumeration) <PSPDFFastEnumeration>
- (KeyType)pspdf_enumeratedType;
@end
```

This is just a snippet. [Get the full code listing from our gist.](https://gist.github.com/steipete/7e3c69b985165dc23c5ec169b857ff42)

Note: This is pure syntactic sugar - this category doesn't emit any code, yet it enables us to rewrite our for loops like this:

```objc
let annotations = [document annotationsForPageAtIndex:pageView.pageIndex type:PSPDFAnnotationTypeLink];

// old
for (PSPDFAnnotation *annotation in annotations) {
    NSLog(@"Color of %@ is %@", annotation, annotation.color);
}

// new
foreach (annotation, annotations) {
    NSLog(@"Color of %@ is %@", annotation, annotation.color);
}
```

Now, you might wonder, why is this any better? What's wrong with having the type visible? Not much, really. However, this is still preferable, as it adds compile time safety to your code. `foreach` will only work with a correctly defined generic array and it will fail if the array contains anything else that's not of type `PSPDFAnnotation`. This is incredibly useful if you have a large codebase, where a refactor might cause ripples through your codebase, leading you to forget to update one part.

How bad is it? Imagine if we change the code to this:

```objc
for (NSString *annotationName in annotations) {
    NSLog(@"Annotation name is %@", annotationName.uppercaseString);
}
```

This will crash at runtime. It doesn't even cause a compiler warning, despite generics! This is definitely something the compiler can learn, but until then using `foreach` will protect you just as well.

Update: [Joe Groff mentioned](https://twitter.com/jckarter/status/926495250893258752) that with Objective-C++ files, the C++ syntax `for (auto annotation : annotations)` also works for `NSFastEnumeration`-Objective-C collections.

## Type information for `copy`/`mutableCopy`

Objective-C eventually got `instancetype` to improve casting and type forwarding, however that never reached `copy` (or its mutable counterpart). This is an easy cause for bugs. Imagine the following snippet:

```objc
+ (NSOrderedSet<NSString *> *)propertyKeys {
    NSMutableSet<NSString *> *propertyKeys = super.propertyKeys.mutableCopy;
    let allObjects = propertyKeys.allObjects; // BOOM runtime crash
```

This code compiles without warning but will crash at runtime with a "selector not found for allObjects" type of crash. This actually happened in PSPDFKit's codebase when we did a large-scale refactor and forgot to update the copy.

There's only one copy selector, and it's not generic. It's also not a case where returning `instancetype` would be the right fix, as there's no general way to understand what a mutable counterpart of a class pair is called and if one even exists.

```objc
@interface NSObject <NSObject>
- (id)copy;
- (id)mutableCopy;
@end
```

However, we can just add that ourselves! Again, a header-only declaration that simply redefines copy on our collections. This won't magically add types to every single object, but it will solve the common case of (mutable) copying collections. The downside is that - as we redeclare a selector - id-casted objects will create a warning when `copy` is called on them. This happens because the compiler now sees multiple "choices" when there really aren't, but the compiler doesn't know that.

```objc
@interface NSArray <ElementType> (PSPDFSafeCopy)

/// Same as `copy` but retains the generic type.
- (NSArray <ElementType> *)copy;

/// Same as `mutableCopy` but retains the generic type.
- (NSMutableArray <ElementType> *)mutableCopy;

@end
```

This is just a snippet. [Get the full code listing from our gist.](https://gist.github.com/steipete/d6ba2d5a5cb939a2675ee20216fb45c8)

With that, we can rewrite our previous code example:

```objc
+ (NSOrderedSet<NSString *> *)propertyKeys {
    let propertyKeys = super.propertyKeys.mutableCopy;
    let allObjects = propertyKeys.allObjects; // COMPILE TIME ERROR
```

And suddenly we converted a runtime crash into a compile-time error. Win! As we adopted this in PSPDFKit, we found multiple places where we did wrong casts and where things worked because we only iterated over a collection. These were crashes waiting to happen. Note that this now also allows us to use `let`, which is nice and helps readability.

## defer

Swift has [`defer`](https://andybargh.com/swift-defer-statement/) to schedule blocks of work to clean up when you leave the current scope. This is great for cleanup when you can exit/throw in multiple places, and both simplifies code and helps to reduce leaks.

```objc
CGImageSourceRef imageSource = CGImageSourceCreateWithURL((CFURLRef)fileURL, NULL);
if (!imageSource) {
    // set error
    return NO;
}

CGImageRef image = CGImageSourceCreateThumbnailAtIndex(imageSource, 0, NULL);
if (!image) {
    // set error
    return NO;
}

thumbnail = [UIImage imageWithCGImage:image scale:scale orientation:UIImageOrientationUp];
CFRelease(imageSource);
CFRelease(image);
return YES;
```

Notice the leak? If creating the image fails, we leak imageSource as we exit early. Of course, that’s fixable when we special-handle the first exit condition, but that’s hard and easy to get wrong. A better solution: Use defer to declare what needs to happen when things go out of scope. This is conceptually similar to C++ RAII, and a similar solution can be achieved with custom smart pointers in that case, however `defer` is much more flexible and useful for many issues.

Better:

```objc
CGImageSourceRef imageSource = CGImageSourceCreateWithURL((CFURLRef)fileURL, NULL);
if (!imageSource) {
    // set error
    return NO;
}
pspdf_defer { CFRelease(imageSource); };

CGImageRef image = CGImageSourceCreateThumbnailAtIndex(imageSource, 0, NULL);
if (!image) {
    // set error
    return NO;
}
pspdf_defer { CFRelease(image); };

thumbnail = [UIImage imageWithCGImage:image scale:scale orientation:UIImageOrientationUp];
return YES;
```

So how does this work? We define a block and add `__attribute__((cleanup))` to it that tells the compiler to execute the function defined in that attribute. We pass along the block as a parameter and thus execute the block when the scope is exited. This attribute is a [GCC extension](https://gcc.gnu.org/onlinedocs/gcc/Common-Variable-Attributes.html) that was adopted by Clang.

```objc
// Similar to defer in Swift
#define pspdf_defer_block_name_with_prefix(prefix, suffix) prefix ## suffix
#define pspdf_defer_block_name(suffix) pspdf_defer_block_name_with_prefix(pspdf_defer_, suffix)
#define pspdf_defer __strong void(^pspdf_defer_block_name(__LINE__))(void) __attribute__((cleanup(pspdf_defer_cleanup_block), unused)) = ^
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunused-function"
static void pspdf_defer_cleanup_block(__strong void(^*block)(void)) {
    (*block)();
}
#pragma clang diagnostic pop
```

Part of the magic here is to use the current line number (`__LINE__`) as part of the local variable. This enables us to use the macro multiple times inside the same scope.

I’ve first seen this in [libextobjc](https://github.com/jspahrsummers/libextobjc) from Justin Spahr-Summers. While this is trivial to add via a macro, first-class language support would make things much better. Please dupe [rdar://32485852](http://openradar.appspot.com/32485852) if you agree.

## Checked KeyPaths

When working with Apple’s APIs, you’ll undoubtedly find a bunch of cases where you’ll need to pass string keypaths as parameters. The most common case is KVO / KVC, but also `AVFoundation` and other APIs. Those so called stringly typed APIs are inherently unsafe, as we get no compiler checks about the validity of the passed-in paths. Swift 3 introduced the `#keyPath` keyword, which makes things much safer over in Swift land and Swift 4 further builds on that with its Smart KeyPaths. Objective-C, however is still lacking in this regard. Fortunately, we can again use macros to make things a bit better.

```objc
#if DEBUG
#define PSPDF_KEYPATH(object, property) ((void)(NO && ((void)object.property, NO)), @ #property)
#else
#define PSPDF_KEYPATH(object, property) @ #property
#endif
```

And here is how you would use it:

```objc
[player addObserver:self forKeyPath:PSPDF_KEYPATH(player, rate) options:NSKeyValueObservingOptionNew context:&PSPDFMediaPlayerKVOToken];
```

The macro resolves to a simple string for production builds, so it’s just as fast as using strings directly. For debug builds you will in addition get compiler-level checks, so if the `rate` property ever changes, you’ll notice that immediately due to a compiler error.

## Boxing CGRect, CGPoint & co

A while ago, Objective-C got literals and a shorthand for boxing. This works for integers, enums and for any struct that declares the `__attribute__((objc_boxable))`, this was all built and there are even tests in Clang that test this. However, the declarations in CoreGraphics have never been updated. [rdar://32486932](http://openradar.appspot.com/32486932)

BUT. It’s easy to add this yourself, as [Rob Mayoff](https://twitter.com/rmayoff/status/869942570171772929) pointed out:

```objc
typedef struct __attribute__((objc_boxable)) CGPoint CGPoint;
typedef struct __attribute__((objc_boxable)) CGSize CGSize;
typedef struct __attribute__((objc_boxable)) CGRect CGRect;
typedef struct __attribute__((objc_boxable)) CGVector CGVector;
typedef struct __attribute__((objc_boxable)) CGAffineTransform CGAffineTransform;
typedef struct __attribute__((objc_boxable)) UIEdgeInsets UIEdgeInsets;
typedef struct __attribute__((objc_boxable)) _NSRange NSRange;
```

With that, `@()` does exactly what you expect and we can retire our `BOXED()` macro.

```objc
CGRect rect = CGRectMake(0, 0, 100, 50);
NSValue *boxedRect = @(rect);
NSLog(@"boxed: %@", boxedRect);
```
