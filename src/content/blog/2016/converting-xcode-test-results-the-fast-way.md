---
title: "Converting Xcode Test Runs to JUnit, the Fast Way"
pubDatetime: 2016-08-11T10:00:00.000Z
description: "A fast method for converting Xcode test results to JUnit format for better CI integration and test reporting."
tags:
  - iOS
  - Development
  - Testing
source: pspdfkit.com
AIDescription: true
---

Testing is very important at PSPDFKit. We're building an SDK. When you give your API to other developers, there are many more things that can go wrong. For a long time, we've been using either a combination of xcodebuild with [xcpretty](https://github.com/supermarin/xcpretty) or [Facebook's xctool](https://github.com/facebook/xctool). No tool is perfect though. [xctool](https://github.com/facebook/xctool) is an alternative to xcodebuild but uses much of it under the hood and often breaks when Xcode is updated. At some point Facebook deprecated it, and currently it doesn't work with Xcode 8 anymore. [xcpretty](https://github.com/supermarin/xcpretty) is really good. It parses the very verbose output of xcodebuild and prints it into something sane that a human can read. A big shout-out to [Marin Usalj](https://twitter.com/_supermarin), who maintains the project.

There are a few inherent problems with parsing an undocumented log output with regular expressions. Things might get lost if no regex matches, or [parsing becomes extremely slow](https://github.com/supermarin/xcpretty/issues/155) if you log too much. All of this, and much more, has happened to us. It is not really xcpretty's fault — it tries hard. It's more an inherent problem and changing output between Xcode versions doesn't help either. (Oh, you think xcodebuild can't be any more verbose? [Did you know about the undocumented log level 5?](https://twitter.com/SmileyKeith/status/759679956876132352) Have fun!)

I was discussing this with ["Mr. Fastlane" Felix](https://twitter.com/KrauseFx) on his last visit to Vienna over a [(fake)](https://twitter.com/neonacho/status/753835632015740928) [Club Mate](https://twitter.com/steipete/status/753662170848690176).

![Lobbying hard to get @KrauseFx to rewrite xcpretty inside fastlane. How much Club Mate will I need?](/assets/img/2016/converting-xcode-test-results-the-fast-way/clubmate.jpg)

We were talking about potentially rewriting xcpretty. However, after some more <s>drinking</s> talking, we figured that Xcode Server is a thing and that there must be a way how xcodebuild could pass the test results to it. JSON maybe? Of course not, but there is a plist! [We were not the first to discover this](http://michele.io/test-logs-in-xcode), just the first who had the idea of writing a converter that takes the plist output and converts it into JUnit format.

Why JUnit? Because that's what Jenkins eats for breakfast. So naturally, [trainer was born](https://github.com/KrauseFx/trainer). PSPDFKit is a huge project (PDF is hard, and [turing-complete](https://stackoverflow.com/questions/9219807/using-javascript-inside-a-pdf)) and we have a few thousand tests across about 10 sub-projects. So it turned out to be a good test case to get trainer up and running. Since Xcode didn't close its log pipe (we reported this here as [rdar://27447948](https://openradar.appspot.com/27447948) and it has sinced been fixed in beta 4) and [our sad attempts on working around this issue](https://github.com/PSPDFKit-labs/xcpretty/commit/2bf07d3da865fda0ef20024b856c771179d35e58) were not very successful, trainer was our best way to get Jenkins <s>green</s> blue again.

Before it was even publicly announced, Twitter had already adopted it and saw a [10x performance increase](https://github.com/KrauseFx/trainer/blob/f2afb8b3e0d870d6fb3f88b4ce46b87438522f62/README.md) in JUnit report generation.

It also made our CI much, much less flaky, since random weird log messages no longer confuse the test converter. You can even run this _in combination_ with xcpretty and get the best of both worlds. A flawed, but great version a human can read and a separate converter that translates test results from a (so far) stable-looking plist format.

So far trainer seems to be the only converter, though there are other tools that try to solve this differently, such as the recently open-sourced [fbxctest](https://github.com/facebook/FBSimulatorControl/commit/51856763f73889f676cf2224348400824e6ae9cf) by Facebook.

[trainer](https://github.com/KrauseFx/trainer) is currently provided as standalone tool, with a built-in [fastlane](https://fastlane.tools) plugin, so it's easy to get started if you're already using [fastlane](https://fastlane.tools). It focuses on one thing, generating a JUnit file that is supported by all major Continuous Integration systems like Jenkins, Circle and Travis. Combining this with [danger](http://danger.systems) and the [danger-junit plugin](https://github.com/orta/danger-junit) by [@orta](https://twitter.com/orta), you can show the exact test failures right in your pull request. This solves the common phenomenon of "PR and Run", which happens on many major open source projects. Typically, a developer submits a pull request on GitHub (often a simple one), which causes a test failure. By the time the test failures are shown on GitHub, the author has already closed the page. After a "PR and Run" occurs, the maintainer then has to manually ping the author to fix the tests. By using [danger](http://danger.systems), the failed tests will automatically be posted as a comment on the PR, triggering an email notification to be sent to the author. ([See example PR](https://github.com/Themoji/ios/pull/26))

![Danger Output](/assets/img/2016/converting-xcode-test-results-the-fast-way/danger-output.png)

A big thanks to [Felix](https://krausefx.com/blog/trainer-the-simplest-way-to-generate-a-junit-report-of-your-ios-tests) for building [trainer](https://github.com/KrauseFx/trainer)! We hope to see this under the [fastlane umbrella](https://fastlane.tools/) soon.

![SO BUILD. WOW.](/assets/img/2016/converting-xcode-test-results-the-fast-way/build-success-meme.jpg)
