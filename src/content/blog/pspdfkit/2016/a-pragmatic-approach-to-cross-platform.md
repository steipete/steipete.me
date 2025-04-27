---
title: "A Pragmatic Approach to Cross-Platform"
pubDate: 2016-04-13T06:00:00.000Z
description: "At PSPDFKit we offer native SDKs for iOS, Android and soon also for the browser. Yet, invisible to the user, all share a large part of the codebase. This wasn’t always the case. Here’s what we learned over the last few years. READMORE"
tags:
  - pspdfkit
source: pspdfkit.com
---

::ai[At PSPDFKit we offer native SDKs for iOS, Android and soon also for the browser. Yet, invisible to the user, all share a large part of the codebase. This wasn’t always the case. Here’s what we learned over the last few years. READMORE]

At PSPDFKit we offer native SDKs for iOS, Android [and soon also for the browser](/web). Yet, invisible to the user, all share a large part of the codebase. This wasn’t always the case. Here’s what we learned over the last few years.
READMORE

## Humble Beginning

PSPDFKit started in 2010 as an iOS-only project. Back then there was just one person working on it. 6 years later, we’re 28 people, have frameworks for iOS, Android and the [Web](/web), and our core framework even runs on OS X and Windows.

In 2014 when we started working on our Android SDK, the existing codebase was a mix of Objective-C and C (for the performance critical parts), and it was highly dependent on Apple’s Core Graphics PDF renderer. We had to start fresh for Android — yet it was clear that we couldn’t afford to maintain two completely separate codebases: this would simply not scale. As a small, bootstrapped company we had to find an approach where we can re-use most of our codebase.

## Choosing The Right Strategy

Everyone knows that cross-platform is hard — furthermore many applications that are cross-platform ultimately deliver a sub-par experience on all platforms. One of the main selling points of our SDK is that it’s really native and feels at home on the platform, like something Apple or Google would put on there. Compromising on this experience was not an option.

There are various projects that try to abstract the user interface across multiple platforms for apps, such as Appcelerator Titanium, Xamarin.Forms, Apache Cordova or — very promising — Facebook’s React Native. We have some experience with all of them, as we offer wrappers that make it simpler to use and configure PSPDFKit within these products. Yet for an SDK, none of these solutions work. They are all more or less compromises and also incur overhead and additional complexity. At least the UI-part had to be native to the platform.

A perfect candidate for a shared module is the PDF renderer. We actually wanted to go further and share licensing, parsing, networking and most of our business logic. Initially, we flirted with the idea of using [Apportable](http://www.apportable.com/) to cross-compile existing code to Android, however after an initial chat it was clear that their service is more tailored to games, and many of the frameworks we use were missing from Android or incomplete. There were also obvious licensing questions and worries about betting so heavily on a company that is VC-backed. In the end they didn’t even send us their SDK to evaluate, so we quickly moved away from that idea. In retrospect, this was great, since while Apportable would have helped us to get to Android faster, we would be stuck again when porting code to Linux for PSPDFKit for the Web.

## Choosing The Right Language

With Objective-C out of the question, C or C++ where pretty much the only languages that were worth considering that could be compiled to any platform. Lua didn’t feel powerful enough for a project of our size, and Swift isn’t mature enough yet, even though work is underway to bring it to Android and make it easier to use as a server language. There are projects such as [RoboVM](https://github.com/robovm/robovm) that run Java on iOS or even scarier solutions such as [j2objc](https://github.com/google/j2objc) that cross-compile Java source code to Objective-C sources, however this adds a lot of complexity and again would be a vendor lock-in. JavaScript is something to consider as it has a powerful ecosystem and there are many interpreters available that make it almost as flexible as C++. However, parsing and rendering performance is a major factor for us and it’s still significantly slower than C++, plus one has to pay a startup tax while it’s being parsed.

C++ is a pragmatic solution and a first-class citizen on almost every platform. Furthermore, we were [intrigued by the advances of C++ in form of C++ 11, 14 and 17](https://www.youtube.com/watch?v=1oHEYk6xuvQ). Many major projects that we use every day are built in C++: [WebKit](https://github.com/WebKit/webkit), [Clang](https://github.com/llvm-mirror/clang) — even [Swift itself](https://github.com/apple/swift). There’s great support for it on iOS: Objective-C and C++ can be freely mixed, and [Google offers an NDK](http://developer.android.com/intl/zh-cn/tools/sdk/ndk/index.html) that makes it relatively simply to build native libraries for Android.

Especially for Android, there are also quite some downsides compared to pure Java or even JavaScript. Adding a native library greatly increases complexity and compile times, and also makes you think about which platforms should be supported. There’s also the problem of debugging: while Android Studio has made [some steps in that direction](http://tools.android.com/tech-docs/android-ndk-preview), there’s still no way to see a stack trace from Java down to your C++ code. You’re basically left with old-school `printf()` debugging.


## Android Inception

As a PDF library, our requirement in the beginning were mostly to parse data fast, and then bring them from C++ to Java. Think about page links, outlines, page labels, page sizes, images and so on. Java uses a bridge called [Java Native Interface (JNI)](https://de.wikipedia.org/wiki/Java_Native_Interface) to bring managed code to native code and vice versa, and everyone who wrote such code before knows that it's painful. We started using [Google’s FlatBuffers](https://google.github.io/flatbuffers/) to automatically marshal data structures in C++, pack them up, send them as one junk to Java and then unpack them there to limit our JNI surface area. This turned out to work great and is really fast. Flatbuffers includes a code generator that generates all the marshaling code from a schema. It’s also a mature and widely used project, so it was quite easy to integrate.

## Moving The iOS SDK To C++

After we’ve shipped Android 1.0, we started thinking about how we can move our iOS SDK over to use the new ‘PSPDFCore’, as it is called internally. The goal was to change as little public API as possible. However we didn’t want to expose any C++ to our customers. One of our goals is to deliver a product with an API that feels just like the system APIs. Using C++ would require knowledge that not every iOS developer has. It would also create an API that you cannot use from Swift, so that’s out of the question.

Luckily, around that time [Dropbox announced Djinni](https://github.com/dropbox/djinni). Djinni is an [IDL](https://en.wikipedia.org/wiki/Interface_description_language) that creates boilerplate code for you. You define your model and interface in this little language, and the djinni parser builds C++, Java and Objective-C++ boilerplate that translates between the languages.

Here are some examples:

```
OutlineElement = interface +c {
    const get_level(): i64;
    const get_action(): optional<Action>;
    const get_title(): string;
    const get_children(): list<OutlineElement>;
    const get_color(): optional<Color>;
    const is_bold_style(): bool;
    const is_italic_style(): bool;
}

OutlineParser = interface +c {
    const get_outline(): optional<OutlineElement>;
}
```

The `get_color()` call returns a `Color` object. In C++ we represent Color as a class. In Java we just want to use `int` since that’s a common pattern on Android and reduces the workload on the garbage collector. And for Objective-C/Swift on iOS, we’d want to use `UIColor`. By default, Djinni would create a `PDFCColor` class however, and a `Color` class on Java. But we can go one step further and create custom bridged data types as well:

```
