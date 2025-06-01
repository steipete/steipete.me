---
title: Swifty Objective-C
pubDatetime: 2016-05-26T12:10:00.000Z
description: "Modern Objective-C language features that make it more Swift-like, including nullability annotations, generics, and new syntax improvements."
tags:
  - iOS
  - Development
source: pspdfkit.com
AIDescription: true
---

Objective-C originates from the early 1980s, and while the language has evolved a lot over the years, it's still no match for really modern languages like Swift. With Swift 3.0 on the horizon, it's smart to write new apps in Swift. However at PSPDFKit, we are still firmly in the Objective-C world. We build and distribute a binary framework to render and edit PDF documents. Getting all the PDF details right is a complex problem. In addition to core PDF functionality, we also offer a lot of UI classes to help with typical use cases. This results in a code base that is around 600k lines — a mix of [shared C++ code][cross-platform] and Objective-C++ for UI and wrapped models. Our headers are entirely modern Objective-C [annotated with generics and nullability](/blog/2015/pspdfkit-ios-5-0/) to ensure everything works great with Swift. Even though we are currently still stuck in the Objective-C world, it is not all that grim! With some ingenuity one can leverage many of the benefits of Swift even in a code base like ours. Here we'll list some of the approaches we use to bring the old and new world closer together.

**Don't miss our follow-up article: [Even Swiftier Objective-C](/blog/2017/even-swiftier-objective-c/)!**

## Why not simply use Swift?

Okay — let's talk about the elephant in the room. Swift is an amazing language and there are many reasons why you should use it. There are also many situations and requirements that make Objective-C the smarter choice. It really depends on the application, the use case you are addressing, your team and the scope and nature of the project. It's great that Apple gives us a choice here.

- Swift is evolving incredibly fast. Apple's open process is nothing short of amazing, especially considering the tight-lipped nature of the company. And while calling the initial release of Swift a 1.0 was quite bold, it quickly grew into a language that is fast, safe and allows you to write beautiful code. It's also a fast-moving target and there are still many, partly scary, bugs and issues that early adopters run into. For a smaller project or your typical app Swift might work well. Large projects might be put off by the compile time or optimization issues or just don't have the resources to stop development and spend weeks to update the codebase to Swift 3 (which can be quite a [disruptive][swift-3-migrate] [task][khan-swift-migration]).

- [Swift in its current form is in many ways more like C++ in that it is quite static][dynamic-swift-2]. There is no dynamic message sending and the runtime allows fewer changes than Objective-C. In the past this has led to both huge problems (such as optimization issues or monkey-patching code that should not be touched) but also to very elegant solutions (like the dynamic property resolution of Core Data objects via `NSManagedObject`, `NSUndoManager`, `UIAppearance` and many other features that you love in Apple's frameworks). [It _is_ a difficult topic, and even people from Apple's UIKit team are wary of the dangers.](https://twitter.com/smileyborg/status/735247732877582337)

- Using Swift without [binary compatibility][swift-abi] would mean that we have to offload technical details to our customers and restrict them in their choice of Xcode to a point where they might not be able to update to Xcode 7.3.1 if our SDK is still compiled with 7.3.0. Each minor compiler version change can produce code that is not compatible with other versions. This is additional technical complexity that we do not want to burden our customers with. We know that we are an edge case. For most projects this doesn't matter as much. We also fully believe that delaying the stable Swift ABI is a good thing. It's inconvenient in the short-term, but [will result in a better language in the long-term][ABI-apology-greg-parker]. Our customers also care about a small binary size and might not like 6 MB additional payload per architecture for Swift. As we always support the latest two iOS versions, this means that we probably can't use Swift for at least another two years.

We use Swift more and more when writing tests and example code and really like it. At the same time we're worried about the Xcode 8 transition and the additional complexity this burdens on our team. While the ABI is still in flux we can't use Swift in our main SDK. Instead we decided to use Objective-C++ to complement pure Objective-C where appropriate.

Many people are afraid of this step as it sounds like a very complicated thing to do: Adding C++ in your code, a language that can be very complex — hard to learn and even harder to master — makes it seem like a lot of time and effort. But it really isn't. Instead of thinking about Objective-C++ as Objective-C with C++, rather think about Objective-C++ as a small language addition to Objective-C. In our Objective-C classes, we only use a very tiny amount of C++ to benefit from the convenience, safety, and performance features of C++. In contrast to full blown C++ implementations, learning a small subset for use in a mainly Objective-C codebase is very easy, even for developers without any prior C++ experience.

## Getting started with Objective-C++

Let's have a look at the steps needed to use Objective-C++ in your project, assuming you already have a project written in Objective-C.

1. Rename the file you want to use Objective-C++ in from `<MyClass>.m` to `<MyClass>.mm`
2. There is no Step 2.

It's really that simple. Objective-C is highly interoperable with C++. You don't need to setup anything or alter your build settings at all. Granted, not all C code is valid C++ code. You might need to add a few additional casts, but you'll mostly be fine. Xcode 7 does [not yet](http://lists.llvm.org/pipermail/cfe-commits/Week-of-Mon-20140929/115672.html) support modules in Objective-C++, so you’ll have to use the older `#import` syntax instead of `@import`.

Now that we see that it is actually very easy to support Objective-C++ in your applications, let's have a look at what we can do with it. Here are our favorite features.

### auto

Consider this code:

```objc
NSArray *files = [NSFileManager.defaultManager contentsOfDirectoryAtURL:samplesURL includingPropertiesForKeys:nil options:0 error:NULL];
PSPDFDocument *document = [[PSPDFDocument alloc] initWithBaseURL:samplesURL files:files];
```

This was an actual bug in one of our tests where `files` contained `NSURL` objects when the document expects a list of file names as strings. This ended up in the test passing because the document filtered out the files and nobody noticed the log messages for a while. If we had used the new [generics feature of Objective-C][objc-generics] that Apple added because of Swift 2, the compiler would have caught this:

![Xcode Error Message](/assets/img/2016/swifty-objective-c/array-error.png)

When using generics it gets quite annoying to type the type specifier:

```objc
NSDictionary<NSNumber*, NSArray<PSPDFAnnotation*>*> *allAnnotationsDict = [document allAnnotationsOfType:PSPDFAnnotationTypeAll];
```

Now that's quite a mouthful! We can simplify this while maintaining the correct template parameters with C++:

```objc
auto allAnnotationsDict = [document allAnnotationsOfType:PSPDFAnnotationTypeAll];
```

Much better — and it's still obvious what `allAnnotationsDict` is. `auto` will transform at compile time to the above — it doesn't require any runtime features. Joe Groff from the Swift compiler team mentioned that [top-of-tree clang now supports `__auto_type` for type inference in plain C and ObjC](https://twitter.com/jckarter/status/735887898717741060) - so eventually you can use this without even paying the C++ compile time overhead.

### Inline blocks

Consider this inline block that processes an annotation for saving. It requires three parameters, which makes the declaration almost unbearably long. You would usually change this into a helper function — but that can't capture variables and might make things even more complex.

```objc
void (^processAnnotation)(PSPDFAnnotation *annotation, BOOL addToIndex, NSUInteger objectID) =
      ^(PSPDFAnnotation *annotation, BOOL addToIndex, NSUInteger objectID) {
	// code
};
```

Another problem with this declaration is, that it's very redundant. Every parameter type is written twice. Developers usually don't like redundancy, so let's clean that up.

`auto` again to the rescue!

```objc
auto processAnnotation = ^(PSPDFAnnotation *annotation, BOOL addToIndex, NSUInteger objectID) {
	// code
};
```

### let

One benefit of Swift is that `let` is the most used and convenient way to declare variables, so their result is automatically `const`. Meanwhile `const` also exists in C — it's just very ugly:

```objc
NSString *const password = @"test123";
```

With `auto`, this can be rewritten to be more readable:

```objc
const auto password = @"test123";
```

You could even go more crazy and use a macro:

```objc
#define let auto const

let password = @"test123";
```

### vector

In Swift, you can put any data type into an array:

```
let anglePoints = [CGPoint(x: 0, y: 0), CGPoint(x: 32, y: 32), CGPoint(x: 32, y: 0)]
```

In Objective-C `NSArray` can only contain objects. This is both more complicated and — because of boxing — slower for primitive types. Of course you can always make a C array, however this makes it much harder to do common operations like adding and removing elements or saving the array somewhere else, likely requiring manual memory management and calling `malloc()`. With Objective-C++ we can simply use [`std::vector`][vector]:

```
auto points = std::vector<CGPoint>{{0, 0}, {.x=32, .y=32}, {32, 0}};
```

Both explicit `struct` field naming or the shorter implicit version `{0, 0}` work — no need to write the `(CGPoint)` cast as `vector<CGPoint>` already knows which data types to expect. As a bonus, C++ containers can be `const` which automatically makes them immutable.

### vector <-> NSArray

You sometimes find situations where you need to convert a `vector` to an `NSArray` or vice versa. This is quite easy, but it's even nicer if you use a helper for that.

```objc
template <typename T>
static inline NSArray *PSPDFArrayWithVector(const std::vector<T> &vector,
                                            id(^block)(const T &value)) {
    NSMutableArray *result = [NSMutableArray arrayWithCapacity:vector.size()];
    for (const T &value : vector) {
        [result addObject:block(value)];
    }

    return result;
}

template <typename T>
static inline std::vector<T> PSPDFVectorWithElements(id<NSFastEnumeration> array,
                                                     T(^block)(id value)) {
    std::vector<T> result;
    for (id value in array) {
        result.push_back(block(value));
    }

    return result;
}
```

### Operator overloading

Did you ever need to calculate a `CGRect`, `CGSize`, or any other geometric type from Core Graphics? They are all `struct`s, which have many benefits but are annoying when it comes to calculations as you — again — have to write redundant code:

```objc
const CGSize zoomSize = CGSizeMake(self.bounds.size.width/zoomScale, self.bounds.size.height/zoomScale);
```

In Swift it's quite easy to define an operator that makes this simpler. But we can do that in Objective-C++ as well!

```objc
CGSize operator/(const CGSize &lhs, CGFloat f) {
    return (CGSize){lhs.width / f, lhs.height / f};
}

const CGSize zoomSize = self.bounds.size / zoomScale;
```

### Locks

Locks are needed when building thread safe APIs. In plain Objective-C you would do something like this:

```objc
@interface PSPDFDocumentParser () {
    NSLock *_parserLock;
}
@end

@implementation PSPDFDocumentParser

- (instancetype)initWithDocumentProvider:(PSPDFDocumentProvider *)documentProvider {
    if ((self = [super init])) {
        _parserLock = [NSLock new];
    }
    return self;
}

- (void)parse {
    [_parserLock lock];
    // Do stuff that needs locking
    [_parserLock unlock];
}

@end
```

This is a lot of code for something that just describes a condition under which your code should execute. With Objective-C++ we can make this much simpler:

```objc
@interface PSPDFDocumentParser () {
    std::mutex _parserLock;
}
@end

@implementation PSPDFDocumentParser
- (void)parse {
    std::lock_guard<std::mutex> parserGuard(_parserLock);
    // Do stuff that needs locking
}
@end
```

The C++ lock is automatically released when it goes out of scope. The [RAII][raii] pattern is everywhere in C++ and it's really great and deterministic. This allows us to do work that requires locking inline with a return statement as the lock is only unlocked after the return.

If we only need to lock a small part of a method, we can simply create a smaller scope to do so:

```objc
- (void)parse {
    // Do stuff without locking
    {
        std::lock_guard<std::mutex> parserGuard(_parserLock);
        // Do stuff that needs locking
    }
    // Do stuff without locking
}
```

And if you need a recursive lock instead, you can use `std::recursive_mutex` instead of `std::mutex`.

Alternative: There’s a simple pure Objective-C solution by making a method that takes a block parameter that gets executed while that lock is locked. For example, see `[NSManagedObjectContext performBlock:]`.

### Templates

Sometimes templates are quite useful to avoid repetitive code. Consider a helper that compares primitives like `CGFloat` or `NSInteger`. You can always box them and call `compare:`, however this can be quite costly. The better way is to use a templated function:

```objc
template <typename T>
inline NSComparisonResult PSPDFCompare(const T value1, const T value2) {
    if (value1 < value2) return (NSComparisonResult)NSOrderedAscending;
    else if (value1 > value2) return (NSComparisonResult)NSOrderedDescending;
    else return (NSComparisonResult)NSOrderedSame;
}
```

Another very useful helper is a conditional cast, that checks if the class is of the correct type.

```objc
template<typename T>
static inline T *PSPDFDynamicCast(__unsafe_unretained id obj) {
    if ([obj isKindOfClass:[T class]]) {
        return obj;
    }
    return nil;
}

// Usage:
auto objectOrNil = PSPDFDynamicCast<PSPDFNavigationController>(self.navigationController);
```

### Variable declaration in if

A typical pattern in Swift is to declare a variable right in the if-else block:

```swift
if let nav = controller.navigationController {
    nav.pushViewController(myViewController, animated: true)
} else {
    //show an alert or something else
}
```

With the additions of Objective-C++, we can do something very similar:

```objc
if (const auto nav = controller.navigationController) {
    //...
}
```

### STL algorithms

There are [many useful algorithms in the standard template library](http://www.cplusplus.com/reference/algorithm/). Instead of a code snippet, [watch the C++ Seasoning talk from Sean Parent](https://channel9.msdn.com/Events/GoingNative/2013/Cpp-Seasoning) - it will blow your mind.

### Gotchas and downsides

You probably knew this was coming: What are the downsides of all these easy tweaks? We don't want to lie to you, there are a couple of them, but we think the benefits outweigh the issues by far.

#### Compile times

When changing the file extension from `.m` to `.mm`, clang will start evaluating your file from a C++ point of view and C++ is a bit more strict in terms of automatic casting. So you will sometimes get a couple of warnings, especially from macros like `MAX()` in your code. You can resolve these issues through explicit casts or by using the equivalent C++ function — in this case `std::max()`. If this is a problem — or if Objective-C maybe is a bit too lax on types from time to time — you'll have to make a decision on how to proceed.

Compiling `.mm` files will take a bit longer than standard `.m` files, however in our experience it's worth the slight compile time penalty. If you are working on a large codebase the extra time can pile up, however it is possible to offset much of that time by using some additional [compilation caching](/blog/2015/ccache-for-fun-and-profit/). Heavy use of templates [or libraries that use templates](http://eigen.tuxfamily.org/) will have a larger impact though.

#### Tooling

Another risk is that not many people are using Objective-C++ extensively, so it's more likely to run into compiler bugs or edge cases. We've only had one issue so far where the Clang Analyzer crashed, but we managed to get such an issue some time earlier in pure Objective-C code as well.

#### Avoid C++ in your headers

Or — if you add it, put it either in separate `.hpp` headers or behind `#if __cplusplus` — otherwise you'll quickly have to convert your entire project to `.mm` and make the headers inaccessible to Swift.

#### Accidental copies

C++ loves copying things. Consider this code:

```objc
@property (nonatomic) std::vector<int> values;

// later on
self.values.emplace_back(5);
```

This code has no effect. The property will return a _copy_ of the vector which you mutate, and which will be destructed right after the call. There are many ways to fix this — using a shared pointer is one solution:

```objc
@property (nonatomic) std::shared_ptr<std::vector<int>> values;

// later on
self.values.get().emplace_back(5);
```

C++11 added `unique_ptr`, `shared_ptr` and `weak_ptr` to the language — in many ways they are similar to ARC, just faster and deterministic, as there's no autorelease pool that might hold onto things. Shared pointers are great and really, calling `new` or `delete` in most cases is bad design and can be replaced by [smart pointers][smart-pointers].

## Objective-C features

We make use of a number of Objective-C features that not everybody may know about and we have a number of helper functions available that make code more readable, especially when dealing with collections.

### NS_NOESCAPE

In Swift, there's a `@noescape` declaration that allows the compiler to optimize code inside blocks. While there's no `NS_NOESCAPE` yet, we can help ourselves:

```objc
// Equivalent to Swift's @noescape
#define PSPDF_NOESCAPE __attribute__((noescape))
```

Of course we submitted [rdar://25737301](http://openradar.appspot.com/25737301) for that, and there's also a [Swift proposal](https://github.com/apple/swift-evolution/blob/master/proposals/0012-add-noescape-to-public-library-api.md) to add this to the Objective-C side of the language — so this is likely something that we'll see soon.

### Dot syntax

This is a controversial topic. We use dot syntax for any method that does not have side effects — even if it is not declared as a property:

```objc
// Typical
[UIApplication sharedApplication].keyWindow

// Shorter
UIApplication.sharedApplication.keyWindow
```

Apple converted many methods that should have been properties, but which simply predate properties, to properties in the iOS 7 SDK. There's no functional difference, just that this now plays better with auto completion. The downside here is that Xcode does not autocomplete method calls with dot syntax yet.

### map, filter, flatMap

The bread and butter data structures like `NSArray` and `NSSet` really miss higher order functions. While there are _some_ useful methods, they really are perversely long and not convenient to use.

Consider this code that collects selected annotations from page views:

```objc
- (NSArray<PSPDFAnnotation *> *)selectedAnnotations {
    NSMutableArray<PSPDFAnnotation *> *selectedAnnotations = [NSMutableArray array];
    for (PSPDFPageView *visiblePageView in self.visiblePageViews) {
        if (visiblePageView.selectedAnnotations.count > 0) {
            [selectedAnnotations addObjectsFromArray:visiblePageView.selectedAnnotations];
        }
    }
    return [selectedAnnotations copy];
}
```

Let's see how the same code looks with using our `flatMap` helper:

```objc
- (NSArray<PSPDFAnnotation *> *)selectedAnnotations {
    return [self.visiblePageViews pspdf_flatMap:^NSArray<PSPDFAnnotation *> *(PSPDFPageView *pageView) {
        return pageView.selectedAnnotations;
    }];
}
```

The whole helper is very straightforward. There are variants out there that return a block, which allows better chaining. We opted for a more Objective-C-like API that does not crash when the array is `nil`:

```objc
- (NSArray *(^)(NSArray * _Nullable (^)(__kindof id obj)))pspdf_flatMapBlock {
    return ^(NSArray *(^block)(id obj)) {
        NSMutableArray *result = [NSMutableArray new];
        for (id obj in self) {
            NSArray * _Nullable array = block(obj);
            [result pspdf_addObjectsFromArray:array];
        }
        return [result copy];
    };
}

- (NSArray *)pspdf_flatMap:(PSPDF_NOESCAPE NSArray * _Nullable (^)(__kindof id obj))block {
    return self.pspdf_flatMapBlock(block);
}
```

We have similar methods available for things like filter or map, together with a bunch of other helpers like `-[NSArray pspdf_mutatedArrayUsingBlock:]` to encapsulate a lot of boiler plate code that everybody has written hundreds of times. While our helpers are currently not open source, there are quite a few open source projects that can help. [BlocksKit has quite a nice implementation of the above.][blockskit]

## Conclusion

We use the methods mentioned in this post on a daily basis inside [PSPDFKit](https://pspdfkit.com/) and are convinced that it makes our code not only more readable but also increases the safety of the codebase. Many of the aforementioned approaches also speed up development time, as we no longer have to write the same boiler plate code over and over again — something all too common when working with Objective-C development. There are many other apps and frameworks that use Objective-C++. [Realm Cocoa](https://github.com/realm/realm-cocoa/tree/master/Realm), [Paper by FiftyThree](https://www.fiftythree.com/), [RxPromise](https://github.com/couchdeveloper/RXPromise), [Dropbox Djinni](https://github.com/dropbox/djinni), [Facebook's ComponentKit](https://github.com/facebook/componentkit) and [Pop](https://github.com/facebook/pop) — even many frameworks from Apple such as Core Graphics, [WebKit/WKWebView](https://github.com/WebKit/webkit/blob/master/Source/WebKit2/UIProcess/API/Cocoa/WKWebView.mm) or [the Objective-C runtime itself](https://github.com/opensource-apple/objc4/tree/master/runtime).

Thanks to some fantastic folks on Twitter that helped reviewing and improving this article, including [@cmchem](https://twitter.com/cmchem), [@NachoSoto](https://twitter.com/NachoSoto), [@ppaulojr](https://twitter.com/ppaulojr), [@anlumo1](https://twitter.com/anlumo1), [@petersibley](https://twitter.com/petersibley) and [@neilkimmett](https://twitter.com/neilkimmett).

Made it till the end? Enjoy working on hard problems? [We are a remote company and hiring.](/careers)

_Update_: We’ve published a second article, “[Even Swiftier Objective-C](/blog/2017/even-swiftier-objective-c/)”, that builds on the information presented herein, and includes information presented at the 2017 WWDC.

## Further reading

- [Smart Pointers][smart-pointers]
- [Apple's (sadly deleted, but archived) documentation on Objective-C++](https://web.archive.org/web/20101203170217/http://developer.apple.com/library/mac/#/web/20101204020949/http://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/ObjectiveC/Articles/ocCPlusPlus.html) (Apple is using ObjC++ extensively in various system frameworks like Core Graphics and many parts of Xcode are written in it, so unlike the documentation, [it won't go away.](https://programmers.stackexchange.com/questions/80166/is-objective-c-being-phased-out))
- [Resource Acquisition Is Initialization][raii]
- [Talk by @steipete: [Objective] C++: What Could Possibly Go Wrong?](https://realm.io/news/altconf-peter-steinberger-objective-c++-what-could-possibly-go-wrong/)
- [ComponentKit: Why C++](http://componentkit.org/docs/why-cpp.html)
- [Effective Modern C++ (book)](https://www.amazon.com/Effective-Modern-Specific-Ways-Improve/dp/1491903996)

[cross-platform]: /blog/2016/a-pragmatic-approach-to-cross-platform/
[smart-pointers]: https://mbevin.wordpress.com/2012/11/18/smart-pointers "Smart Pointers Explained"
[raii]: https://en.wikipedia.org/wiki/Resource_Acquisition_Is_Initialization "Resource Acquisition Is Initialization"
[objc-generics]: http://drekka.ghost.io/objective-c-generics/ "Objective-C Generics"
[blockskit]: https://github.com/zwaldowski/BlocksKit/blob/master/BlocksKit/Core/NSArray%2BBlocksKit.h "BlocksKit"
[swift-3-migrate]: http://ericasadun.com/2016/05/18/if-i-had-my-druthers-swift-2-2-swift-3-0-abis-etc/ "If I had my druthers: Swift 2.2, Swift 3.0, ABIs, etc"
[swift-abi]: http://thread.gmane.org/gmane.comp.lang.swift.evolution/17276 "Winding down the Swift 3 release"
[khan-swift-migration]: https://twitter.com/andy_matuschak/status/648671170695335936 "Report from the field: porting our 30k of Swift to Swift 2 took the eminent @NachoSoto a solid week; and we still have some bugs. Yikes. :/"
[ABI-apology-greg-parker]: http://ericasadun.com/2016/05/17/more-about-the-swift-abi-postponement-the-laws-of-abi-changes/ "The laws of ABI changes"
[dynamic-swift-2]: http://mjtsai.com/blog/2016/05/21/dynamic-swift-2/ "Dynamic Swift"
[vector]: http://www.cplusplus.com/reference/vector/vector/ "C++ std::vector Reference"
