---
title: Binary Frameworks in Swift
pubDatetime: 2018-01-29T12:00:00.000Z
description: "Explores Swift's ABI stability and the challenges of shipping binary frameworks before Swift 5."
tags:
  - iOS
  - Development
source: pspdfkit.com
AIDescription: true
---

Apple introduced Swift in 2014, and it quickly replaced the 34-year-old Objective-C. Swift is a modern, [open source](https://developer.apple.com/swift/blog/?id=34) language that pushes safe programming patterns and adds modern features to make programming easier, more flexible, and more fun.

This article explores what ABI means and how it can be important for third-party frameworks. It was written in February 2018. Since Swift moves so fast, some details might no longer be accurate.

TL;WR: ABI stability won’t change much for you, and it’s not enough to ship binary Swift frameworks. You can watch a shortened version of this article, which was presented at [dotSwift 2018](https://www.dotswift.io/) in Paris:

{% youtube jWaO3rsNZU0 %}

## What’s ABI?

ABI stands for **Application Binary Interface**. Much like the more commonly known [API defines communication between various software components in source code](https://pspdfkit.com/api/ios/), ABI defines the communication rules for machine code. Among other things, it describes how objects are laid out in memory and how functions are called. To enable communication between binary code compiled with different compiler versions, the ABI needs to be well defined and stable. The more complex and feature-rich a language is, the more complex it is to get all details right.

ABI consists of many parts:

- Data Layout
- Type Metadata
- Mangling
- Calling Convention
- Runtime
- Standard Library

Swift is now four years old and about to release version 4.1, yet it does not offer binary compatibility. For the longest time, it did not offer source compatibility either, meaning source code had to be adjusted for every version update. This, however, changed with Swift 4. [Apple now offers compatibility modes](https://swift.org/source-compatibility/) to compile previous versions of Swift, and even maintains an open source [Swift Source Compatibility Suite](https://github.com/apple/swift-source-compat-suite). With some effort, anyone can propose their open source projects to be included and tested. Now Swift source compatibility isn’t everything — changes in how Swift headers, especially nullability between macOS and iOS SDKs, are mapped, still require adjustments. However, it’s much less work than in the past.

> Array used to be 24 bytes, and is now 8 bytes (data that used to be stored inline moved into the heap buffer it points to). If a new-style 8 byte Array was passed into code compiled assuming 24 byte Arrays, the older code would read uninitialized memory trying to get to bytes 9-24. Once the ABI is locked down, the Swift team will be unable to make any further changes like that (or at least will have to jump through a lot of hoops to guarantee compatibility).<br><small style="display:block;text-align:right;opacity:0.5;">- David Smith, Apple Foundation Frameworks</small>

## ABI and Swift, a Moving Target

ABI compatibility has been announced and deferred for multiple years.

Back in November 2015, Apple announced that [ABI stability was a goal on the Swift 3 roadmap](https://github.com/apple/swift-evolution/commit/5ce3a4275bcb359d841bbf4745ca16b66638bfcc). As the Swift 3 release finalized in May 2016, [Chris Lattner announced that ABI stability would be deferred](http://thread.gmane.org/gmane.comp.lang.swift.evolution/17276).

> That said, it is also clear at this point that some of the loftier goals that we started out with aren’t going to fit into the release – including some of the most important generics features needed in order to lock down the ABI of the standard library. As such, the generics and ABI stability goals will roll into a future release of Swift, where I expect them to be the highest priority features to get done.<br><small style="display:block;text-align:right;opacity:0.5;">- Chris Lattner, Swift Creator</small>

Greg Parker, who works on the Objective-C runtime, went into much more detail and explained [why deferring ABI is actually a good thing](https://lists.swift.org/pipermail/swift-evolution/Week-of-Mon-20160516/017875.html). In his post, he pointed out that there were some inefficiencies in the existing ABIs because there simply wasn’t enough time to address all issues. A similar analysis was made by [Ben Snider].

With the [Swift 4 kickoff](https://lists.swift.org/pipermail/swift-evolution-announce/2016-July/000235.html) in July 2016, Ted Kremenek mentioned “a goal of achieving binary stability in Swift 4.” Later on in February 2017, [this was again deferred](https://lists.swift.org/pipermail/swift-evolution/Week-of-Mon-20170213/032116.html). However, the [Swift 4 Release Process][] declared the goal of “getting the core ABI and the related fundamentals correct.”

August 2017: With Swift 5, Apple published the [ABI Stability Manifesto][] and made a stable ABI a hard goal for the newest release. Progress is well underway and can be tracked via the [ABI Dashboard][].

## When ABI Matters

ABI matters when you compile some parts of your application with one Swift version, and some parts with a newer one. This can be useful on large projects where you’d like to share prebuilt binary components to speed up compile time. [Carthage] is a popular dependency manager that supports caching binary compile units, and when using this feature, you need to ensure that everyone on the team uses the exact same version of Xcode. With Carthage, there’s no compile or runtime check for ABI compatibility. Larger Swift changes will fail at link time, and there are [quite](https://stackoverflow.com/questions/46198148/module-compiled-with-swift-3-1-cannot-be-imported-in-swift-4-0) [a lot](https://stackoverflow.com/questions/46216663/module-compiled-with-swift-4-0-cannot-be-imported-in-swift-3-1-for-framework-bin) of Stack Overflow questions on that topic. Smaller changes might just result in a crash at runtime.

Currently, every iOS and macOS app that uses Swift [has to ship the Swift runtime library](https://developer.apple.com/swift/blog/?id=2) to ensure that the app runs on different versions of the OS. With [around 5 MB](https://medium.com/@sandofsky/why-big-apps-arent-moving-to-swift-yet-f8e9a89ef661), the size is not insignificant. A stable ABI would allow Apple to ship these compatibility libraries as part of the OS, which would collectively save a lot of bits that move over the network, in addition to disk space. Technically, Apple could already include a copy of every library compiled with every version of Swift. However, this is impractical and would bloat the OS.

All that said, it sounds like we might finally get a stable ABI this autumn, allowing us to start distributing binary frameworks. But not so fast...

> ABI stability is necessary, though not sufficient, for binary frameworks. Module format stability is also required and is beyond the scope of this document.<br><small style="display:block;text-align:right;opacity:0.5;">- Michael Ilseman, ‎Compiler Engineer at Apple</small>

## Swift Module Format

A swiftmodule file contains serialized ASTs (and potentially SIL) — it’s basically the binary equivalent for header files in C/Objective-C. This isn’t something a developer usually sees or touches, with the exception of some [curious ones][]. Apple’s documentation on it is [sparse, and some sections are yet to be written.](https://github.com/apple/swift/blob/master/docs/Serialization.rst)

According to Apple’s Swift [ABI Stability Manifesto][]:

> Binary frameworks include both a Swift module file, which communicates source-level information of the framework’s API, and a shared library, which provides the compiled implementation that is loaded at runtime. Thus, there are two necessary goals for binary framework compatibility.

These two goals are ABI stability and Module format stability. In the same document, it says that:

> Module format stability stabilizes the module file, which is the compiler’s representation of the public interfaces of a framework. This includes API declarations and inlineable code. The module file is used by the compiler for necessary tasks such as type checking and code generation when compiling client code using a framework.

Module format stability still doesn’t have a target date and — according to Chris Lattner’s July 2016 message, [_Looking back on Swift 3 and ahead to Swift 4_](https://lists.swift.org/pipermail/swift-evolution/Week-of-Mon-20160725/025676.html) — it is a stretch goal for Swift 5:

> At some point we need to stabilize the “.swiftmodule” binary file format (or replace it with a different mechanism) to allow 3rd party binary frameworks. This is a very large amount of work over and above what is required for ABI stability of the standard library.

## Binary Swift Frameworks in Production

Swift binary frameworks are possible and do exist. One high-profile example is SAP: The SAP Cloud Platform SDK ships as a binary Swift framework, and [SAP acknowledges the problematic nature of this in a dedicated blog post](https://blogs.sap.com/2017/07/10/understanding-sap-cp-sdk-for-ios-versions-and-xcode-compatibility/). More specifically, it can [delay adopting new versions of Xcode](https://answers.sap.com/questions/263584/compatibility-issues-of-sap-fiori-for-ios-framewor.html). Case in point: The latest available version of the SAP Cloud Platform SDK to date is for Xcode 9.1.

If you do ship a binary Swift framework, ensure that you use the exact same Xcode version and Swift version. Relying on a Swift binary framework will block you from testing [Swift Snapshots](https://swift.org/download/), as it’s likely they contain changes to the ABI/Module representation.

## Conclusion

If you build binary frameworks, you should stay with Objective-C, and possibly add C++ to fix gaps in the language. See our [Swifty Objective-C](https://pspdfkit.com/blog/2016/swifty-objective-c/) and [Even Swiftier Objective-C](https://pspdfkit.com/blog/2017/even-swiftier-objective-c/) series for inspiration.

We learned that the impact of ABI stability is much smaller than Twitter and the blogosphere would have you think. While it will allow for more flexibility on binary blob caching and slightly reduce app sizes, the practical impact is very low. Module stability is still far out, so for the foreseeable future, building an SDK means using Objective-C.

**Update: Apple recently released [a great blog post about ABI Stability and More](https://swift.org/blog/abi-stability-and-more/) that is very worth your time.**

[Ben Snider]: http://www.bensnider.com/abi-compatibility-whoopdty-do-what-does-it-all-mean.html
[ABI Stability Manifesto]: https://github.com/apple/swift/blob/master/docs/ABIStabilityManifesto.md
[Swift 4 Release Process]: https://swift.org/blog/swift-4-0-release-process/
[Deferring ABI Stability from Swift 4]: https://lists.swift.org/pipermail/swift-evolution/Week-of-Mon-20170213/032116.html
[ABI Dashboard]: https://swift.org/abi-stability/
[Carthage]: https://github.com/Carthage/Carthage
[curious ones]: https://pewpewthespells.com/blog/swiftdoc_and_swiftmodule_file_format_(beta_1).html
