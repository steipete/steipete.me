---
title: "Researching ResearchKit"
pubDatetime: 2015-04-14T21:46:00.000Z
description: "Analyze Apple's first major open-source project ResearchKit to discover interesting implementation details and practical iOS development solutions."
tags:
  - iOS-Development
  - ResearchKit
  - Open-Source
  - Code-Review
  - Swift
  - Objective-C
  - Accessibility
  - Dynamic-Type
  - NSSecureCoding
source: petersteinberger.com
AIDescription: true
---

Apple's first [GitHub-released open source project](https://github.com/ResearchKit/ResearchKit/) is a big thing. There's much to learn here - I've spent some time reading through the source, here are my observations.

### firstResponder

In UIKit, unlike AppKit on the Mac, there's currently no public way to detect the first responder. There are several clever and less clever workarounds ([like iterating over all views](https://gist.github.com/steipete/8737196)) or [using a weak variable and UIApplication's sendAction:](http://stackoverflow.com/questions/5029267/is-there-any-way-of-asking-an-ios-view-which-of-its-children-has-first-responder/14135456#14135456). Of course Apple hit this issue in ResearchKit as well and [their solution also uses sendAction:](https://github.com/ResearchKit/ResearchKit/blob/master/ResearchKit/Common/UIApplication+ResearchKit.m#L37). If you feel like there should be an official `firstResponder` method [much like there is in AppKit](https://developer.apple.com/library/mac/documentation/Cocoa/Reference/ApplicationKit/Classes/NSWindow_Class/#//apple_ref/occ/instm/NSWindow/firstResponder), please help and file a radar or dupe mine ([rdar://20549460](http://openradar.appspot.com/20549460)). (If you wonder, of course this method exists [as private API](https://github.com/nst/iOS-Runtime-Headers/blob/e578efc846bd46a2d24a4fdd033cdc582323ccec/Frameworks/UIKit.framework/UIResponder.h#L82))

### Dynamic cast

Apple uses a nifty macro to ensure the class is of the expected type:<br>
[`#define ORKDynamicCast(x, c) ((c *) ([x isKindOfClass:[c class]] ? x : nil))`](https://github.com/ResearchKit/ResearchKit/blob/9c75263ac5d96ae88bbc6a73c56d43952882affa/ResearchKit/Common/ORKDefines_Private.h#L40)

It's a [language feature in Swift](https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/TypeCasting.html) and C++ has a whole variety of cast operators [built into the language](http://stackoverflow.com/questions/28002/regular-cast-vs-static-cast-vs-dynamic-cast). I'd love to see actual language support in Objective-C as well.

### Dynamic Type

Apple added [Dynamic Type in iOS 7](https://developer.apple.com/library/ios/documentation/StringsTextFonts/Conceptual/TextAndWebiPhoneOS/CustomTextProcessing/CustomTextProcessing.html#//apple_ref/doc/uid/TP40009542-CH4-SW65) to give the user more control about how large text in apps should be. We're now [less than two months away from iOS 9](https://developer.apple.com/wwdc/) yet many apps still ignore this, and almost no app properly reacts to changing this setting at runtime. The system sends a `UIContentSizeCategoryDidChangeNotification`, however there's no easy way to re-build the UI with a different font. Apple's way of solving this is subclassing common view classes like `UILabel` with their [`ORKLabel`](https://github.com/ResearchKit/ResearchKit/blob/9c75263ac5d96ae88bbc6a73c56d43952882affa/ResearchKit/Common/ORKLabel.m#L70-74), which fetches the new font and then invalidates its intrinsic content size to trigger a new Auto Layout pass. Similar patters are in `ORKAnswerTextField/View`, `ORKTableViewCell` and `ORKTextButton`. This pattern however makes it hard to set custom font sizes. One could extend these classes to accept a font text style like `UIFontTextStyleHeadline` to make this more flexible. Apple instead uses subclasses like [`ORKTapCountLabel`](https://github.com/ResearchKit/ResearchKit/blob/9c75263ac5d96ae88bbc6a73c56d43952882affa/ResearchKit/Common/ORKTapCountLabel.m#L36) to customize the font size.

### Radar Workarounds

In Apple's initial release, there are two radars referenced. `19528969` to work around an Auto Layout issue and `19792197` to work around an issue with tinting animated images. Of course there are no detailed entries on [OpenRadar](http://openradar.appspot.com/19792197) but it's easy to read and at least the workarounds are marked as such. It will be interesting if these radars are a priority on being fixed...

### Interface Builder

All views are created in code. Apple uses a Storyboard for the example catalog, but that's it. Apple uses the standard pattern of [overriding `viewDidLoad`](https://github.com/ResearchKit/ResearchKit/blob/9c75263ac5d96ae88bbc6a73c56d43952882affa/ResearchKit/Consent/ORKConsentReviewController.m#L68-108) to build UI in combination with Auto Layout and the visual format language, whenever possible.

### Creating PDF from HTML

This was particularly interesting, since my main job is working on [PSPDFKit - a PDF framework for iOS and Android.](https://pspdfkit.com). In there we have code that allows converting HTML to PDF via (ab)using `UIWebView` and the printing subsystem. This is marked as experimental as we were under the impression that it's not intended usage and more likely works by accident. However Apple's now using [the exact same technique (ORKHTMLPDFWriter) in ResearchKit](https://github.com/ResearchKit/ResearchKit/blob/9c75263ac5d96ae88bbc6a73c56d43952882affa/ResearchKit/Common/ORKHTMLPDFWriter.m), so this seems to be an acceptable way of converting HTML documents.

### Nullability

It's really great to see that every class is fully annotated with `NS_ASSUME_NONNULL_BEGIN/END`. This makes usage much nicer, especially with Swift, but also is great documentation in general. Time to annotate your classes as well!

### Swift

Since we're at Swift... ResearchKit is 100% Objective-C. And I'm sure this was started when Swift was already post 1.0 so time is not the reason. Then again, the example catalog is completely Swift. Objective-C is a great choice for frameworks as you can decide selectively which methods should be public and which ones private - with Swift, this is currently not yet possible.<br>
Update: Access control actually is in Swift since 1.0, so this isn't the reason they went with Objective-C. Maybe because of the still immature tooling? (and SourceKit crashes)

### Internal/Private

There's no clear pattern when Apple uses `_Internal` and when `_Private` for private class extensions, however it's great to see that they do try to keep the API small and only expose the necessary parts.

### Web Views

Large text like the consent review language is displayed by view controllers that embed web views. This is all based on `UIWebView` - so far no `WKWebView` is being used here. For regular text, that's perfectly ok and probably even preferred since it's a lot simpler to use and doesn't spin up a separate process. On the other hand, Apple consistently uses `UIAlertController` - there are no references to the legacy `UIAlertView`/`UIActionSheet` APIs anymore.

### NSSecureCoding

It's great to see Apple adopting secure coding everywhere. They're using [a set of macros](https://github.com/ResearchKit/ResearchKit/blob/9c75263ac5d96ae88bbc6a73c56d43952882affa/ResearchKit/Common/ORKHelpers.h#L57-88) to make the code less repetitive but overall there's nothing special about it.

### Accessibility

There's a bunch of interesting details on how Apple approaches accessibility support here. Notable is the [`ORKAccessibilityStringForVariables` macro](https://github.com/ResearchKit/ResearchKit/blob/9c75263ac5d96ae88bbc6a73c56d43952882affa/ResearchKit/Accessibility/ORKAccessibilityFunctions.m#L69-88) which allows string concatenation, ignoring empty or nil strings. [(sample usage)](https://github.com/ResearchKit/ResearchKit/blob/9c75263ac5d96ae88bbc6a73c56d43952882affa/ResearchKit/ActiveTasks/ORKAudioContentView.m#L378)

### Version Checks

ResearchKit contains a few checks for iOS 8.2. Why? Because HealthKit really didn't work before that release. However instead of checking for the foundation version (fast) or using the new `isOperatingSystemAtLeastVersion` method on `NSProcessInfo`, they're converting the version to float and then compare - the worst way of version checking. [I went ahead and wrote a pull request to fix that.](https://github.com/ResearchKit/ResearchKit/pull/13) We'll see if that gets merged :)

### Tests!

Yes, [there are unit tests](https://github.com/ResearchKit/ResearchKit/blob/9c75263ac5d96ae88bbc6a73c56d43952882affa/ResearchKitTests/ORKRecorderTests.m). They don't use a Host Application, so they're all purely model-tests. I'd love to see view/integration tests as well, but it's a start.

### Tinted Animations

<img src="/images/posts/researchkit-animations.gif"><br>
If you're wondering how Apple pulled of these nifty animations and were expecting some advanced path animation code, I have to disappoint - [it's just a set of videos.](https://github.com/ResearchKit/ResearchKit/tree/9c75263ac5d96ae88bbc6a73c56d43952882affa/ResearchKit/Animations/phone%403x) However, there's a lot more to it. They are coordinated by [`ORKVisualConsentTransitionAnimator`](https://github.com/ResearchKit/ResearchKit/blob/9c75263ac5d96ae88bbc6a73c56d43952882affa/ResearchKit/Consent/ORKVisualConsentTransitionAnimator.m) which is powered by [`ORKEAGLMoviePlayerView`](https://github.com/ResearchKit/ResearchKit/blob/9c75263ac5d96ae88bbc6a73c56d43952882affa/ResearchKit/Consent/ORKEAGLMoviePlayerView.h) - complete with [custom](https://github.com/ResearchKit/ResearchKit/blob/9c75263ac5d96ae88bbc6a73c56d43952882affa/ResearchKit/Consent/MovieTintShader.fsh) [shaders](https://github.com/ResearchKit/ResearchKit/blob/9c75263ac5d96ae88bbc6a73c56d43952882affa/ResearchKit/Consent/MovieTintShader.vsh). This is a lot of code to tint a video on the fly!

### Final Notes

Overall, ResearchKit is very well done. You could critizise some naming inconsistencies, indentation or spacing, but the overall structure is good, and I'm very excited how much better it'll get once Apple starts merging [the onslaught of Pull Requests.](https://github.com/ResearchKit/ResearchKit/pulls). Writing a framework is certainly a challenge - many shortcuts one can do with writing Apps don't apply. [Follow me on Twitter for even more updates.](https://twitter.com/steipete) Oh, and if you would love to work on frameworks full-time, [we're hiring.](https://pspdfkit.com/jobs)
