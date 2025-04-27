---
title: "PSPDFKit and Swift"
description: "Will PSPDFKit for iOS move to Swift? In this post, we weigh the pros and cons."
preview_image: /images/blog/2019/swift-and-pspdfkit/article-header.png
section: blog
author:
  - Peter Steinberger
author_url:
  - https://twitter.com/steipete
date: 2019-03-13 12:00 UTC
tags: iOS, Development
published: true
secret: false
---

PSPDFKit for iOS is a large project written in C, C++, and — of course — Objective-C(++). The public API is clean, modern Objective-C with all the enhancements Apple has brought to the language in recent years, including generics, nullability, Swift method name annotations, and enum macros.

## Will PSPDFKit for iOS Move to Swift?

This is the million-dollar question we get asked on Twitter from time to time. With everyone embracing Swift, why is PSPDFKit for iOS still written in Objective-C? Now that Swift 5, with its stable ABI, is nearing public release in Xcode 10.2, can’t we finally adopt Swift and be happy?

<div class="alert alert-warning">

Learn more: [Binary Frameworks in Swift][]

</div>

To answer that question, let’s first consider the typical benefit claims of a Swift-only codebase:

- There’s less code to write, as Swift is more expressive.
- There are more efficient `struct` data structures when compared to classic Objective-C classes.
- There are fewer bugs due to stronger nullability enforcement, generics, and type checking.
- There is the potential for cross-platform code reuse (model API, but not UIKit).

However, we must also consider the downsides:

- Either you stop supporting Objective-C clients, or you greatly restrict Swift’s capabilities by declaring classes as `@objc` exportable and omitting Swift concepts that are not compatible with Objective-C.
- Swift classes, even when annotated with `@objc`, cannot be subclassed in Objective-C.
- Swift increases the binary size for clients not using iOS 12.2, which is still in beta.
- Swift has no header concepts, and [the Clang module format is not yet stable][swift abi stability]. Binary frameworks need to be consumed with the same Xcode version they are compiled with in order to not cause issues.
- There wouldn’t be any compatibility for hybrid technologies such as Xamarin, Cordova, Appcelerator, Flutter, or React Native (though the latter has some support for Swift already).
- Swift can call directly to C, but not to C++.
- Various performance tricks, such as custom `NSArray` subclasses that convert objects on the fly, can’t be written in Swift.
- Code that heavily mixes Objective-C and Swift is difficult to maintain and limits most of Swift’s useful features.

Given the above constraints, PSPDFKit will likely never fully move to Swift. First and foremost, we still have many clients with applications built in Objective-C. There’s rarely a good reason to do a rewrite of battle-tested code, and we cannot force our partners to rewrite their applications just to be able to use the newest version of PSPDFKit. Secondly, moving to Swift would heavily limit our subclassing system — currently, developers can register almost any exposed class and offer a subclass that PSPDFKit will initialize internally in place of our default base class. But seeing as Swift classes can no longer be subclassed in Objective-C, these capabilities would be greatly restricted if we switched to Swift.

This limits us to using Swift internally — which is the worst kind of Swift usage.

## PSPDFKitSwift

<div class="alert alert-warning">

Learn more: [First-Class Swift API for Objective-C Frameworks][]

</div>

All that said, there’s still value in a clean, Swift-specific API, and we’re addressing this with our [PSPDFKitSwift project][], which offers Swift wrappers for our most commonly used classes (in addition to offering a greatly simplified API). Documentation-wise, this is a challenge, as we now basically have three sets of APIs:

- Objective-C API
- Regular Swift API
- Refined Swift API via PSPDFKitSwift

We hope we can ship these refined calls as part of the SDK, in order to simplify usage and setup. But until Clang offers module stability, this isn’t something we’re ready to do, as it would create a strict enforcement between the Xcode version we compile our SDK with and the Xcode versions our partners use to compile their apps.

We also hope future compiler versions offer even more support for improved Objective-C-to-Swift interoperability. We would love to use more powerful renaming capabilities, but unfortunately, we had to remove our [API Notes][]-based customizations due to them causing all sorts of problems with build reliability.

## Swift and Stable API

<div class="alert alert-warning">

Learn more: [Writing and Maintaining Good Code Documentation][]

</div>

Offering a stable API was a challenge, especially in the early years of Swift, when the Objective-C-to-Swift mappings changed with almost every release. And with our massive API, adding nullability and generics took many releases across many months to get right. Changing nullability is, at most, a warning in Objective-C, but it’s a breaking error in Swift, which added to some of the frustrations our customers experienced.

With Swift 4 and 5, most of these issues are solved, and the language is no longer moving as fast as it once did. As a result, it’s much easier to update without too many API changes. We’re still tweaking APIs, and we do try to adopt every mapping tweak there is. We’ve also introduced custom types and better enumerations in addition to gradually renamed methods that didn’t map well to Swift.

This work isn’t done yet. For example, with Swift 5, which will ship in Xcode 10.2, Apple made enumeration checks stricter, but it also gave us `NS_CLOSED_ENUM` so that we can define Objective-C enumerations that are closed, meaning they no longer require a default case. We hope to see even more examples of such Objective-C annotations in the future.

## Conclusion

Our iOS team loves Swift💙 and we use it wherever we can: [in our tests][], in [PDF Viewer][], and in our [extensive example catalog][]. We’re even [contributing features to the Swift compiler][] to make it better! But when it comes down to it, Swift isn’t the right choice for our SDK, and we’ll keep using Objective-C++ for the foreseeable future.

[binary frameworks in swift]: /blog/2018/binary-frameworks-swift/
[swift abi stability]: https://swift.org/blog/abi-stability-and-more/
[first-class swift api for objective-c frameworks]: /blog/2018/first-class-swift-api-for-objective-c-frameworks/
[api notes]: https://pspdfkit.com/blog/2018/first-class-swift-api-for-objective-c-frameworks/#api-notes
[pspdfkitswift project]: https://github.com/PSPDFKit/PSPDFKitSwift
[writing and maintaining good code documentation]: /blog/2019/writing-and-maintaining-good-code-documentation/
[in our tests]: /blog/2016/running-ui-tests-with-ludicrous-speed/
[pdf viewer]: https://pdfviewer.io/
[extensive example catalog]: /guides/ios/current/getting-started/example-projects/#pspdfcatalog
[contributing features to the swift compiler]: https://github.com/apple/swift/pull/17960
