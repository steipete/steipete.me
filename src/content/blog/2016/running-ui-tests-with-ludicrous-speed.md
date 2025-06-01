---
title: Running UI Tests on iOS With Ludicrous Speed
pubDatetime: 2016-04-27T12:00:00.000Z
description: "Techniques for dramatically speeding up UI test execution in Xcode using parallelization and optimization strategies."
tags:
  - iOS
  - Development
source: pspdfkit.com
AIDescription: true
---

You might think the UI for [a PDF viewer/editor](/features/) would be trivial, however it’s anything but. At PSPDFKit we have a ton of simple and complex views and view controllers, running either modally or embedded, with several knobs and switches to configures things. We’d be in major trouble if we relied solely on manual testing. (<a href="#ludicrous-speed">tl;dr: Just show me the video!</a>)

## A Primer on Testing

Everyone knows that an important ingredient to a successful product is a good testing strategy. At PSPDFKit we use three different types of tests to test our PDF SDK and our apps:

### Unit tests

Everything that's a model, a parser or otherwise code that takes data and transforms it into a different kind of data is great for unit tests. We use [`XCTestCase`](http://nshipster.com/xctestcase/) and some custom helpers. There are quite a few other interesting testing frameworks out there like [Specta/Expecta](https://github.com/specta/specta), however we love that tests can be executed right from Xcode's code view - this is not possible with `NSInvocation` based tests as they only show up in the sidebar once they have been run at least once. Unit tests are usually very unproblematic. They run fast, they are easy to write and they rarely change between iOS versions. Usually they only cover a small and specific part of your application - there can still be major issues, even if all your unit tests are green.

### Snapshot tests

We use Facebook's [FBSnapshotTestCase](https://github.com/facebook/ios-snapshot-test-case) library with a few custom tweaks. Snapshot tests are great for pull requests to give you an overview over how things looked/look now, and they're great to find tiny changes or big regressions. They are somewhat problematic though when you support a lot of devices or work with images/video, as Apple often changes details around the decompression between iOS releases, which means creating custom images not only for every device, but also for every major iOS version, and sometimes even for minor ones.

### UI tests.

These are _the real integration tests_ - they allow you to test your application like your users would. They cover the most with the least code, but are also - usually - fragile and the slowest to run. UI tests are not something that is easy in Apple-Land. (Android has it's own issues which we'll blog about very soon as part of this testing series.) We’ve been using a fork of [KIF](https://github.com/PSPDFKit-labs/KIF) since 2014, and while there's a lot of hackery going on, it has served us well. You can automate test flows, it’s open source and very hack-able but it has been a cause of frustration as well since we have had countless times where UI tests were flaky. Only now, two years later, we finally have things in a state that is reliable and fast, and I’m here to share what we’ve learned so that you don't have to suffer through yet another red build.

![Ludicrous Speed](/assets/img/2016/running-ui-tests-with-ludicrous-speed/spaceballs-ludicrous-speed.gif)

## What about Apple's UI Testing framework?

I still remember the excitement when Apple introduced [their new UI testing framework with Xcode 7](https://developer.apple.com/videos/play/wwdc2015/406/) last year at WWDC. Especially the recording feature that basically writes test cases as you interact with your app caused a lot of applause.

`XCUI` indeed seems very promising, but it’s also a 1.0 and my experience with Apple frameworks over the years has been that it’s always a good idea to wait out the first iteration, until the [most](https://openradar.appspot.com/23116258) [glaring](https://openradar.appspot.com/23115791) issues are fixed. It’s also not compatible with iOS 8, and [in PSPDFKit we support n-1](/guides/ios/current/announcements/version-support/) so we’ll be dropping iOS 8 once Apple announces iOS 10.

It's definitely in the realm of possibilities that we'll eventually move to `XCUI` if we manage to apply the same performance improvements to it. I’m certainly looking forward to discussing this with the Xcode and UIKit engineers at WWDC 2016.

## Accessibility

If you're a good iOS citizen, [you've already built your app in a way that makes it accessible and usable by visually impaired users](https://developer.apple.com/accessibility/ios/). Both KIF and XCUI are built on top of accessibility, so a great benefit of UI testing will be that your app will automatically be more user friendly to people who need additional support. We care a lot about accessibility at PSPDFKit, up to making individual lines in a PDF readable, so we never had to do much extra work to make UI testing possible, however you'll always find bugs once you really start using it.

## A typical KIF test

Let's jump right in and look at a typical KIF test. This is not a tutorial - [there are other websites that can explain the basics](https://www.raywenderlich.com/61419/ios-ui-testing-with-kif) - yet the code is fairly self-explanatory so even if you do not have previous experience with KIF, you'll understand most of it.

```swift
    // SFSafariViewController as of iOS 9.3 doesn't support displaying local file URLs
    // and instead throws an early exception when you try to init it with such a URL.
    func testLocalLinkOpensLegacyWebViewController() {
        let document = PSPDFTestAssetGenerator.createTemporaryDocument("Test document")

        // Add dummy link annotation
        let fileLinkAnnotation = PSPDFLinkAnnotation(URL: NSURL(fileURLWithPath: "testpath"))
        fileLinkAnnotation.boundingBox = CGRectMake(100, 100, 200, 200)

        let webLinkAnnotation = PSPDFLinkAnnotation(URL: NSURL(string: "https://google.com")!)
        webLinkAnnotation.boundingBox = CGRectMake(300, 300, 200, 200)

        document.addAnnotations([fileLinkAnnotation, webLinkAnnotation])

        let pdfController = PSPDFViewController(document: document, configuration: PSPDFConfiguration(builder: {
            $0.linkAction = .InlineBrowser // default anyway but make explicit for the test
        }))

        testWithViewController(pdfController) {
            pdfController.tapOnAnnotation(fileLinkAnnotation)

            // Verify that our web view controller is visible
            waitForCondition(pdfController.isControllerClassVisible(PSPDFWebViewController.self))

            pdfController.dismissViewControllerAnimated(false, completion: nil)

            if #available(iOS 9, *) {
                pdfController.tapOnAnnotation(webLinkAnnotation)
                waitForCondition(pdfController.isControllerClassVisible(SFSafariViewController.self))
                pdfController.dismissViewControllerAnimated(false, completion: nil)
            }
        }
    }
```

For the purpose of this blog post I’ve simplified some code snippets, but they’re mostly what we use internally.

This is one of our tests that checks for a special code path around `SFSafariViewController` when we open local URLs. We mostly use Swift for tests these days because things are just shorter and more readable. For our SDK we use a mix of Objective-C and C++. No Swift, as there are [no binary compatibility guarantees](https://developer.apple.com/swift/blog/?id=2) yet and [we also use a lot of Objective-C++ to share code with Android and Web](/blog/2016/a-pragmatic-approach-to-cross-platform/).

One of the main causes for flakiness is combining UI events and model checks. UI events (like `tapOnAnnotation`) are dispatched on the main runloop. Depending on timing it might take some time for changes to be reflected in the model state. Consider our `tapOnAnnotation` helper that in the end emits a tap on the page. The page however has a lot of view handling logic as well and there’s a double tap gesture recognizer that first needs to fail - since this could be a potential double tap. If we just go along and check if the annotation is selected right at the next step, this will fail.

```swift
public extension PSPDFViewController {
    // Navigates to the page of the annotation and taps it.
    public func tapOnAnnotation(annotation: PSPDFAnnotation) {
        let pageView = pdfController.pageViewForPage(annotation.absolutePage)!
        let viewRect = pageView.convertPDFRectToViewRect(annotation.boundingBox)
        pageView.tapAtPoint(CGPointCenteredInRect(viewRect))
    }
}
```

In the past, we usually added a `tester.waitForTimeInterval(0.3)` after the call, to ensure that the touch was processed, before moving on to checking the conditions. This works great. Locally. Usually. Not so much on Jenkins or Travis, where you likely have slower machines which might be really busy compiling Android at the same time. Suddenly touch processing takes longer, the 0.3 second delay is no longer enough and the test fails. You’re annoyed and submit a quick fix, changing the timeout by half a second, then a second, and the test almost always works, except in some rare cases where even one second isn’t enough. As these changes creep in over time, your UI tests become slow and slower.

We reached a point where running our UI tests took _15 minutes_ — without compile times. This was unacceptably slow and the real effect on the project was that people avoided writing new UI tests.

## Ludicrous Speed!

Now, let’s take another look at the snippet above. You notice there’s no `waitForTimeInterval` code in there - instead we have a `waitForCondition`. This is not part of KIF, so what does it do?

```swift
extension XCTestCase {
    @nonobjc func waitForCondition(@autoclosure(escaping) condition: Void -> Bool, negateCondition: Bool = false) {
        XCTAssertTrue(PSPDFWaitForConditionWithTimeout(PSPDFDefaultWaitTimeout, negateCondition ? { !condition() } : { condition() }))
    }
}
```

The complex part is implemented in ObjC:

```objc
BOOL PSPDFWaitForConditionWithTimeout(NSTimeInterval timeout, PSPDFTestCondition condition) {
    // Based on a blog post from http://bou.io/CTTRunLoopRunUntil.html
    __block Boolean fulfilled = NO;
    const auto beforeWaiting = ^(CFRunLoopObserverRef observer, CFRunLoopActivity activity) {
        // The run loop should be stopped after the condition is fulfilled (CFRunLoopStop below)
        NSCParameterAssert(!fulfilled);
        // Check the condition
        fulfilled = condition();
        // Condition fulfilled: stop RunLoop now
        if (fulfilled) CFRunLoopStop(CFRunLoopGetCurrent());
    };

    // We add a timer dispatch source here to make sure that we wake up at least every 0.x seconds
    // in case we're waiting for a condition that does not necessarily wake up the run loop.
    const dispatch_source_t timer = dispatch_source_create(DISPATCH_SOURCE_TYPE_TIMER, 0, 0, PSPDF_DEPRECATED_NOWARN(dispatch_get_current_queue()));
    dispatch_source_set_timer(timer, DISPATCH_TIME_NOW, (uint64_t)(0.05 * NSEC_PER_SEC), (uint64_t)(0.05 * NSEC_PER_SEC));
    dispatch_source_set_event_handler(timer, ^{
        // NOOP
    });
    dispatch_resume(timer);

    CFRunLoopObserverRef observer = CFRunLoopObserverCreateWithHandler(NULL, kCFRunLoopBeforeWaiting, true, 0, beforeWaiting);
    CFRunLoopAddObserver(CFRunLoopGetCurrent(), observer, kCFRunLoopDefaultMode);
    CFRunLoopRunInMode(kCFRunLoopDefaultMode, timeout, false);
    CFRunLoopRemoveObserver(CFRunLoopGetCurrent(), observer, kCFRunLoopDefaultMode);
    CFRelease(observer);

    dispatch_source_cancel(timer);

    // If we haven't fulfilled the condition yet, test one more time before returning. This avoids
    // that we fail the test just because we somehow failed to properly poll the condition, e.g. if
    // the run loop didn't wake up.
    if (!fulfilled) {
        fulfilled = condition();
    }

    return fulfilled;
}
```

We rely on busy waiting via creating a custom runloop - the condition is checked every x milliseconds and only once it returns `true`, the control flow continues. This might seem crude, but it's a much, much better solution than adding random timeouts and allows us to run tests at an insane speed while also getting reliable results, even under heavy load. It's somwhat similar to `XCTestCase`'s asynchronous testing extension `waitForExpectationsWithTimeout:handler:`, just faster and more flexible.

Now, the final puzzle is to simply increase the speed of Core Animation itself. And the best part: This is not even private API!

<a name="ludicrous-speed"></a>

```objc
UIApplication.sharedApplication.keyWindow.layer.speed = 100;
```

## Just show me how it looks

Alright, alright — here you go. We still need to find a way to simulate long presses without actually having to tap down longer than 0.3 seconds. The other delay is the iOS keyboard, which still loads incredibly slowly. (This was recorded on an iPad Pro - the real thing, not a Simulator.)

<div class="embed-responsive embed-responsive-4by3">
<iframe class="embed-responsive-item" src="https://player.vimeo.com/video/163299733" allowfullscreen></iframe>
</div>

[We’ve submitted a series of small patches to KIF](https://github.com/kif-framework/KIF/pull/840) which enables it to take the layer speed into account in the few places where timeouts were hardcoded. There are a few other [pull](https://github.com/kif-framework/KIF/pull/838) [requests](https://github.com/kif-framework/KIF/pull/839) and we’ll continue to contribute back our tweaks. Of course you can start right away [with our fork](https://github.com/PSPDFKit-labs/KIF) until the various patches have been merged.

Now, this is not the only way UI tests can be accelerated. Some people on Twitter pointed out a very interesting [engineering post from the LinkedIn team](https://engineering.linkedin.com/blog/2016/01/ui-automation--keep-it-functional--and-stable-) that used a notification-based approach to speed up tests, which is absolutely worth a read. It does require changes to your regular code for update notifications, and their fork is also not public yet. I did ping someone about it but never got an ETA so I wouldn’t get your hopes up as the post is from back in January

## Update: Why not just disable animations altogether?

Some people asked on Twitter why we're not simply disabling animations. Wouldn't that be much simpler and even faster? The answer is yes, absolutely. But it would also make the tests more artificial. You don't disable animations for your users. Often code behaves differently when there are animations and completion blocks are called async instead of directly. There's a whole class of bugs that are related to animations and we wanted to test these as well. Calling `[UIView setAnimationsEnabled:NO]` would change this - speeding up animations seemed like a much better tradeoff to have a more realistic simulation of app interactions.

## PSPDFKit on Testing

This is just the first article in a series where we explain our approach to testing on iOS, Android and even [Web](/web/). The next article will explain some specific tips and tricks when dealing with `UIScrollView` and UI tests, as it has its own animator that uses `CADisplayLink` under the hood instead of Core Animation. Be sure to follow [@PSPDFKit](https://twitter.com/PSPDFKit) on Twitter or subscribe to the newsletter below to follow the series.
