---
title: "UI testing on iOS, without busy waiting"
pubDatetime: 2016-09-29T15:00:00.000Z
description: "Comprehensive guide to effective UI testing on iOS using KIF framework without busy waiting and performance optimization techniques."
tags:
  - iOS
  - Development
source: pspdfkit.com
AIDescription: true
---

At PSPDFKit, we've been using [KIF ("Keep It Functional")](https://github.com/kif-framework/KIF) since 2014 to test UI components. [We wrote about our process in April 2016](/blog/2016/running-ui-tests-with-ludicrous-speed/), and it's time to revisit. KIF is a good and proven solution. It mostly synthesizes `UITouch` objects or related events and the app processes it just as if the user would tap. KIF is compiled into your app and can run in tandem with other XCTests. You can mix `XCTAssert*` calls and UI instructions.

## KIF

The big problem is that KIF for us was very flaky. If the system was under high load, tests failed because the timeout wasn't enough. The solution usually was increasing the timeouts, until we reached a point where UI tests alone were running over 30 minutes. Without compile times.

![](/assets/img/2016/ui-testing-revisited/no-more.gif)

That's where we said "no more" and [spent a lot of time on fixing the problem](/blog/2016/running-ui-tests-with-ludicrous-speed/). Our solution for "ludicrous speed" was a combination of increasing layer speed and busy waiting. Simply checking the condition every X milliseconds until it's either true or the timeout hits. This made our tests both faster and more stable. It's a pragmatic solution.

KIF was originally written by Square [and is still pretty well maintained](https://github.com/kif-framework/KIF/commits/master). There are some helpers for Swift available, however the matchers are inconsistent both in scope and naming and some macros are named very general, such as `system` [which causes issues](https://github.com/kif-framework/KIF/pull/835). It's not a big deal and we have an internal fork that renamed that, but you'll certainly feel that it's an older project with a good bit of technical debt. There've been talks for fixing up much of that in a KIF 4 and it's not impossible to improve.

## History

Apple released tools for UI automation all the way back in iOS 4. It was called `UIAutomation` and integrated into... wait for it... Instruments, and you had to use JavaScript to write tests. It all sounded pretty amazing despite the rumors that it was written [by an intern](https://twitter.com/frankus/status/781506911153770497). However, it was really flaky and almost no one actually succeeded in building reliable tests on top of it - and the few who did had to build [additional tooling](https://github.com/paypal/illuminator) around it. `UIAutomation` was deprecated in Xcode 7 and finally completely removed in Xcode 8, without a clear path to migrate. Moving tests to XCUI was not trivial, but given that [almost nobody](https://github.com/appium/appium/issues/5225) used `UIAutomation`, Apple did not bother to write a migrator. Facebook is a notable large exception which used UIAutomation as their WebDriver.

## XCUI

With Xcode 7 Apple gave us API to app UI, that can be used from Objective-C and Swift. No more JavaScript. It's also for iOS and macOS, where `UIAutomation` was iOS specific. XCUI is quite awesome and even can [automatically record tests](https://www.bignerdranch.com/blog/ui-testing-in-xcode-7-part-1-ui-testing-gotchas/) for you.

Tests in XCUI run in a separate process. This is good in a way that you're testing closer to what you ship to your users and bad in the way that it makes it [very hard to mock data](http://stackoverflow.com/a/33310781/83160) or test model assumptions - which really is how we build almost all of our tests. And if you use workarounds that allow data mocking, you risk polluting your app with test data.

XCUI also [didn't solve the synchronization problem](http://masilotti.com/ui-testing-xcode-7/) and the documentation recommends using [`func expectation(for predicate: NSPredicate, evaluatedWith object: Any, handler: XCPredicateExpectationHandler? = nil) -> XCTestExpectation`](https://developer.apple.com/reference/xctest/xctestcase/1500569-expectationforpredicate).

> The expectation periodically evaluates the predicate and also may use notifications or other events to optimistically re-evaluate.

This is similar to our [`PSPDFWaitForConditionWithTimeout`](/blog/2016/running-ui-tests-with-ludicrous-speed/) helper that we use in KIF.

## What else is out there?

We're not talking about [Appium](http://appium.io/) which currently has [some troubles](https://twitter.com/hymole/status/781507060890476545), because their WebDriver used UIAutomator which has been removed in Xcode 8, so they can't run tests with Xcode 8 yet, but replacements are [in the](https://github.com/calabash/run_loop/pull/482) [works](https://discuss.appium.io/t/ios9-uiautomation-what-is-appium-approach-to-uiautomation-deprecation-by-apple/7319/6)).

Other noticable mentions are [Subliminal](https://github.com/inkling/Subliminal) (discontinued) or [Frank](https://github.com/TestingWithFrank/Frank) (abandoned). There's also [Calabash](http://calaba.sh/) which is backed by Xamarin and open-source. Tests are written with Ruby and it uses a WebDriver (UIAutomator, now custom).

## EarlGrey

[EarlGrey](https://github.com/google/EarlGrey) has been open sourced by Google in February 2016 and you might think it's quite a young project. However, of you look at the [Initial Commit with over 20 KLOC](https://github.com/google/EarlGrey/commit/fd7c83c30973e1978a5976334e12163ab8ebbfe6) you quickly see that this is not the case. Google has been using EarlGrey internally for years before they made the effort to clean it up and open source it. It's largely inspired by [Android's Espresso](https://google.github.io/android-testing-support-library/docs/espresso/), and that's a good thing. We're using Espresso heavily to test our Android SDK, and it's one of the shining parts of the Android ecosystem. Espresso has [some great features](https://google.github.io/android-testing-support-library/docs/espresso/advanced/) such as CSS selector matchers that eventually will [trickle down](https://github.com/google/EarlGrey/issues/211) to EarlGrey.

It's somewhat similar to KIF, however it's not timeout based but uses extensive synchronization, with means that you dont need explicit waits or sleeps. It's matchers are much more extensive and consistent and it has better visibility checkers to only interact with elements that really are on the screen - catching bugs that the user might experience.

[Enabling Clang's Address Sanitizer](/blog/2016/test-with-asan/) is a known issue in EarlGrey. If you try it, you will get a crash like this one:
![](/assets/img/2016/ui-testing-revisited/earl-grey-asan.png)

However, this [is being worked on](https://github.com/google/EarlGrey/pull/201) and it's quite the read!

Both KIF and EarlGrey extensively use private API to inject touches, which can break on major iOS updates, as it did with iOS 8. One scary looking example is `IOHIDEventCreateDigitizerFingerEvent`, however [even WebKit uses that in it's test runner](https://github.com/WebKit/webkit/blob/8f7def85ecf771e4eb8c569ab7931ef96ad393ad/Tools/WebKitTestRunner/ios/HIDEventGenerator.mm#L233), so chances are high that this will keep working.

## Demo Time

But don't trust us - see for yourself! We have an open source project that compares KIF, XCUI and EarlGrey using a demo of PSPDFKit.

[iOS-UI-Testing-Comparison](https://github.com/PSPDFKit-labs/iOS-UI-Testing-Comparison)

## Further reading

- [WWDC 2015: UI Testing in Xcode](https://developer.apple.com/videos/play/wwdc2015/406/)
- [Three Ways UI Testing Just Made Test-Driven Development Even Better](http://masilotti.com/ui-testing-tdd/)
