---
title: "Introduction to C++ for Swift Developers"
description: "An introduction to the C++ language for Swift developers, with an overview of reasons to use C++ and a look at differences and similarities between the languages."
preview_image: /images/blog/2019/intro-c++-swift-developers/article-header.png
section: blog
author:
  - Daniel Martín
author_url:
  - https://twitter.com/dmartincy
date: 2019-11-26 8:00 UTC
tags: Development, C++, Swift
published: true
secret: false
---

Swift is one of the languages of choice for doing iOS development. It’s a general-purpose compiled programming language built with the open source LLVM compiler, and it has been part of Apple’s developer tools since 2014. This article will discuss another language, C++, mostly from the perspective of an existing Swift developer; explain the situations in which you may want to use it; and offer a comparison between both languages and a suggested path to learn C++ effectively.

## What C++ Is and Why You May Want to Learn It

C++ is a general-purpose programming language created in 1985 by Bjarne Stroustrup as an extension to the C programming language. Initially focused on offering object-oriented capabilities with a syntax similar to the C language, C++ has evolved to include support for other programming paradigms, such as generic or functional programming. C++ is used today in a lot of systems, such as embedded systems, graphic engines, compilers, and server-side applications.

If you are already familiar with Swift, maybe you are reading this article because you are tempted to learn C++ for any of the following purposes:

- To share code between iOS and Android.
- For performance reasons, such as if you plan to develop a program or part of a program where performance is critical.
- To learn “low-level” things like memory addressing, pointer manipulation, and concepts that are not commonly exposed in modern languages like Swift.
- To contribute to existing C++ projects, like the Swift compiler.

In the following section, I’ll address each of the above points.

### Sharing Code between iOS and Android Using C++

Here at PSPDFKit, [we use C++ to share code between iOS and Android][cross-platform-blog]. C++ interoperates well with Objective-C and Java, but not so well with Swift, so if you decide to use C++ for the purpose of sharing code and you plan to develop your app in Swift, you should consider the added complexity of having an Objective-C layer that will merely be used to interoperate with Swift. In general, before you decide to use C++ for sharing code, it’s a good idea to think about things carefully. Typical questions you should ask yourself include:

- Can you afford the added complexity of having Objective-C or C bindings in your app?
- Do you know the C++ library ecosystem well enough to choose, for example, a good general-purpose database management or network connectivity library? Note that third-party dependencies are part of your codebase and you’ll need to maintain them.
- How would you hire people who are both experienced with C++ and familiar with mobile development? Or how would you hire people with expertise in mobile development and with some C++ familiarity? Does your company provide ways to learn C++ on the job?
- Can you afford the extra cost and time required to deal with the unsafe nature of C++? You will need special tooling support and some expertise to debug issues like crashes due to things like [dangling pointers][dangling-pointer], memory leaks, [undefined behavior][undefined-behavior], etc. People familiar with languages such as Swift or Kotlin may be rusty when they need to debug these kinds of problems, especially when they happen in a complex codebase where interactions are not so clear.

### Using C++ for Performance Reasons

C++ has traditionally been considered a programming language that offers very good performance. It’s difficult to compare the performance of C++ and Swift in absolute terms, as performance depends on the application you are writing and how you are writing it. But Swift code, in general, is expected to be a bit slower than the same C++ code.

Even though C++ has the lead in performance, recent developments in Swift have closed the performance gap. For example, the [Ownership Manifesto][ownership-manifesto] intends to reduce the amount of data copies performed in a regular Swift application execution and improve the predictability of memory usage of Swift applications. You can even [use Swift on a GNU/Linux server][server-side-swift].

### Learning C++ Just to Learn “Low-Level” Computer Science Concepts

In my opinion, C++ is not the best language for teaching programming. Despite the desires of its creator, modern C++ requires that a student focuses too much time on things that are not critical for understanding programming — things like dealing with a verbose language syntax, the preprocessor’s include mechanism (modules are coming in C++20), or memory management considerations. The verbosity of C++ sticks out even from the simplest of examples. Consider a “Hello, World!” program written in modern C++:

```cpp
#include <iostream>

int main() {
  std::cout << "Hello World!" << std::endl;
  return 0;
}
```

Here’s the same version written in Swift:

```swift
print("Hello, World!")
```

If you want to learn low-level computer science concepts like pointers, memory representation, or CPU architecture, C++ exposes them to the programmer by default. C is an even better language in that regard, because the recent trend in modern C++ development is to stay away from low-level computer science concepts that can cause software instability and security vulnerabilities if they are not used and understood correctly. There are interesting mathematics and computer science concepts in the C++ standard template library (STL); these include red-black trees, hashing implementations, and generic abstractions (I recommend the book _Elements of Programming_ by Alexander Stepanov and Paul McJones, if you want to learn more). The same or similar ideas are present in the [Swift standard library][swift-standard-library], which is also open source. Using Swift abstracts away concepts like C++ iterators, and the generics used in the Swift standard library are much more powerful than the C++ template system (which will be augmented in C++20 by a more powerful feature called [C++ concepts][c++-concepts]).

To summarize, learning modern C++ to learn low-level topics may not be the best idea, as modern C++ codebases don’t expose these topics anymore, and a language like Swift can also expose them in a more controlled way by [explicitly asking for them][swift-unsafe]. While I agree that, in recent software engineering, we are losing contact with important computer science topics and that might have an impact on how we do software engineering in the future (see Jonathan Blow’s talk, “[Preventing the Collapse of Civilization][preventing-collapse-civilization],” for context), I’m not sure that C++ is the best vehicle to teach those skills. The fact that C++ is typically associated with some computer science topics may be just the result of C++ being the first system programming language that achieved widespread usage.

### Learning C++ to Contribute to the Swift Compiler

The Swift compiler is written mostly in C++, and this won’t change in the near future. You can extend the standard library using Swift, but if you want to contribute a new language feature or some optimization, you’ll need to write C++. Learning C++ for the purpose of contributing features to Swift is a good reason, and the result is you’ll feel good when you finally land a patch. If you are interested in the process of contributing to the Swift programming language, [we have more information on our blog][contributing-to-swift].

## Comparing C++ and Swift

Now that we’ve introduced the motivation for learning C++ and covered why the decision is, in most cases, not straightforward, let’s compare both languages using two of the many aspects we could consider: language features and tooling.

### Language Features

Swift seems like it was developed by frustrated C++ developers, and it shows even in its early versions. Most of the problematic things in C++ were already solved in Swift 1.0. Here’s a small list of those nuances:

- The initialization of variables is enforced at compile time in Swift. In C++, for example, an integral variable that is allocated on the stack has no default initial value. An uninitialized variable is a cause of problems in a program. Even when C++ default initializes a variable to zero, Swift goes further and requires an explicit initial value; zero-initialization is not enough.
- Problematic implicit type conversions are not allowed in Swift. For example, implicitly converting an integral type to another type where loss of precision may happen is not allowed. Implicit narrowing type conversions are a source of bugs in C++.
- Removing elements from a Swift `Dictionary` invalidates their indices. That’s not the case in C++’s `std::unordered_map`. Dangling pointers are a source of crashes and security vulnerabilities in C++ codebases.
- The order of initialization of global structures is undefined in C++. This is a source of bugs in C++ codebases. Meanwhile, Swift follows the natural dependency order of global structures.

General programming constructs like functions, classes, statements, and control flow are more or less the same in Swift and C++. However, the Swift versions usually have simpler and less verbose syntax. Swift offers several programming constructs that are not achievable or are cumbersome to achieve in C++, such as [powerful enum types][swift-enum-types], [protocol extensions][swift-protocol-extensions], [ML-style type inference][swift-type-inference], and [pattern matching][swift-pattern-matching].

### Tooling

Tooling has a positive impact on how you use a programming language. We all expect to have certain features — such as code completion, code browsing, and integrated debugging — when we develop software. Xcode, which is the IDE you would typically use with Swift, is also compatible with C++, and the typical IDE features, like code completion or debugging, work well in both languages. Debugging STL containers like `std::vector` or `std::map` in C++ with LLDB is not a very user-friendly process for someone with a Swift background, as the information that the debugger shows is sometimes not formatted in the easiest-to-understand way. Note that you can create your own [LLDB extensions][blog-lldb-extensions] to improve how C++ types are formatted.

Regarding compiler error messages, the extensive use of templates in C++ code and the C++ standard library makes C++ error compiler messages verbose and sometimes difficult to understand. In Swift, generic code may occasionally produce extremely verbose error messages like the following, but it’s not a common situation as it is in C++.

![Swift showing a compilation error](/images/blog/2019/intro-c++-swift-developers/SwiftErrorMessage.jpg)

Improving compiler error messages in Swift is an ongoing effort, so we can expect future versions of Swift to have better ones.

## A Suggested C++ Learning Path for a Swift Developer

Once you’ve decided to learn C++, what resources could you use? To learn the basics, apart from Internet tutorials, I recommend the book _A Tour of C++_ by Bjarne Stroustrup. The last edition at the point of writing this article is about C++17, which is modern C++ (I do not recommend learning a version of C++ prior to C++11). If you already know Swift, reading and understanding that book shouldn’t take you much time. Once you have basic knowledge of the language, you can learn how to use C++ effectively. For that, I recommend the _Effective C++_ book series by Scott Meyers. You can complement that book with the [C++ Core Guidelines][c++-core-guidelines], a resource that is available online for free.

C++ is a huge and complex language, so do not feel pressure to learn everything about it. Most C++ companies restrict C++ to a subset of the language that they feel is “safer” or “easier to master.” That, in turn, has created dialects of C++, and that may surprise you coming from Swift, as Swift is a language whose designers want to protect it from evolving into different dialects.

## Conclusion

This article has given you an overview about why you may want to learn C++ if you already know Swift, and it has compared different aspects of both languages. Neither language is a clear “winner,” so this article has tried to give a neutral overview of the C++ language. I don’t consider C++ the best vehicle to teach programming or even learn low-level computer science concepts, but it has its place in a lot of existing open source and industry projects, including the notable Swift compiler, so it may still be considered an attractive language you want to learn to contribute certain features to the programming language you use every day.

[cross-platform-blog]: https://pspdfkit.com/blog/2016/a-pragmatic-approach-to-cross-platform/
[dangling-pointer]: https://en.wikipedia.org/wiki/Dangling_pointer
[undefined-behavior]: https://en.wikipedia.org/wiki/Undefined_behavior
[ownership-manifesto]: https://github.com/apple/swift/blob/master/docs/OwnershipManifesto.md
[server-side-swift]: https://swift.org/server/
[preventing-collapse-civilization]: https://www.youtube.com/watch?v=pW-SOdj4Kkk
[contributing-to-swift]: https://pspdfkit.com/blog/2018/tips-for-contributing-to-the-swift-language/
[swift-enum-types]: https://docs.swift.org/swift-book/LanguageGuide/Enumerations.html
[swift-protocol-extensions]: https://docs.swift.org/swift-book/LanguageGuide/Protocols.html
[swift-type-inference]: https://github.com/apple/swift/blob/master/docs/TypeChecker.rst
[swift-pattern-matching]: https://docs.swift.org/swift-book/ReferenceManual/Patterns.html
[blog-lldb-extensions]: https://pspdfkit.com/blog/2018/how-to-extend-lldb-to-provide-a-better-debugging-experience/
[c++-core-guidelines]: https://github.com/isocpp/CppCoreGuidelines
[swift-standard-library]: https://github.com/apple/swift/tree/master/stdlib
[c++-concepts]: https://en.wikipedia.org/wiki/Concepts_(C%2B%2B)
[swift-unsafe]: https://developer.apple.com/documentation/swift/unsafepointer
