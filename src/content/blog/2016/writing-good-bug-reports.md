---
title: Writing Good Bug Reports
pubDatetime: 2016-09-13T12:00:00.000Z
description: "Essential guide to writing effective bug reports that help developers understand, reproduce, and fix issues quickly and efficiently."
tags:
  - iOS
  - Development
source: pspdfkit.com
AIDescription: true
---

At PSPDFKit, we provide an SDK to [display and annotate PDFs](/blog/2016/pspdfkit-ios-6-0/), for other people to integrate into their apps. There is a large set of API and therefore many things can go wrong. As you can imagine, things are quite busy on support as I work every day with developers reading through their bug reports. At the same time, we also forward many bugs to the engineers at Apple, as they ship even larger frameworks with even more API (e.g. UIKit), because all software has bugs.

Over the years, this dual role has given me quite a perspective on what makes a good bug report. While this post is Apple-centric, many details can be applied to _any_ sort of bug reporting.

To quote Tanya Gupta from Apple:

> "Sometimes they say, well it’s a really obvious problem! I’m sure you have 12 copies of the bug. I am sure someone else has already filed it, should I still file a bug report? Yes, you should still file a bug report. Better have 5 copies of a bug than none at all. At Apple, if an issue is not tracked using a bug report, it essentially does not exist for us. Bug reports are like to-do items. We track everything using bug reports. Bugs, tasks, even big features that go into a particular release."

### Why you should care

While I’ve inevitably been pushed into more management over the years, I’m still an iOS developer at heart (and at night). iOS isn’t going anywhere. Our product isn’t going anywhere either. If you encounter a bug and just look the other way, that might be okay once. Do that 100 times and your code will be a minefield. People in your team will not understand why you’re doing things in such a weird way, and will tap into the same issues again and again. If you take time to analyze the issue and document it, the hack will now be maintainable and have a (manual) test case in the form of a sample. With every major iOS version, you can easily try the sample to check if the hack is still needed. It’s also documented for new people that join the team, so they don’t undo your crazy code because you had [reasons](https://github.com/PSPDFKit-labs/radar.apple.com). It also opens doors. If you care and are nice to people, you might see that they care as well and are nice to you too when you’re stuck.

So, here we go - tips on filing good radars.

### File one report per issue

Don’t try to save time by writing multiple problems into one radar/ticket. One issue should always be one ticket. This makes it much easier to track the status and to move it to people internally.

### Add the selector name to the issue title

Often Apple engineers try to search the HUGE radar database for dupes. Adding the selector to the title makes this much easier. Since all Apple frameworks are written in Objective-C (except Create ML which is still in beta as of June 2018), please use the Objective-C name.

### Make a short, runnable sample

Even if it’s trivial to reproduce. And until Swift really settles on features, _please_ write it in Objective-C. Nothing is more annoying than getting a sample that doesn’t compile without manual edits. Delete everything that’s not important like the fillers that Xcode adds. Strip it down to just the bug. I usually don’t bother writing a test case because you don’t know how their architecture looks and chances are high that they don’t re-use the test (considering license issues alone), so a regular app is fine.

At PSPDFKit, we usually mirror the samples that we attach to the radar [in a public GitHub repo](https://github.com/PSPDFKit-labs/radar.apple.com) while noting that updated samples are available under this public repository. This doesn’t work for all radars: sometimes the bug report or the sample contain confidential information. But in most cases we can keep our radars public.

Update (May 2019): With Swift 5 out, using Swift as the radar language for examples is now generally fine; changes are small enough that it should work. Not all engineers are fluent in Swift yet however, so your experience will vary.

### Make it _really_ obvious to trigger the issue

I often add a big button named "Press me to crash" or "Tap for tears." Make it obvious. An alert that explains the thing a bit more on load is also very very useful. Here’s how we explain [rdar://20020818](http://openradar.appspot.com/20020818).

![rdar://20020818](/assets/img/2016/writing-good-bug-reports/radar-sample.png)

### Add humor

Bug reports don’t need to be dry! Sometimes they are because I’m in a hurry. Sometimes they are Dr. Who themed. Or have cat pictures. Or funny texts. Or they show a message that can only be read once a bug is fixed. I’m sure the engineer appreciates a bit of creativity - just don’t obscure the bug or make the sample harder to use. Whatever you do, it shouldn’t get in the way of their work.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Made a Dr. Who themed radar about the cut off edges on UIAlertController. rdar://25572553 /cc <a href="https://twitter.com/smileyborg">@smileyborg</a> <a href="https://t.co/D9YWfdDyeC">pic.twitter.com/D9YWfdDyeC</a></p>&mdash; Peter Steinberger (@steipete) <a href="https://twitter.com/steipete/status/717627394211840000">April 6, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

But also be productive. Rants like "nothing works" doesn’t help anyone and just make it less likely that someone will work on your issue. You’re not working with a machine but with real humans here. Make good stuff, and you’ll get more responses.

### Be concise

Don’t write a novel. Try to explain the issue in concise terms and then optionally add a second block where you go into more details. What have you tried already to work around it? What assumptions do you have? Some of our radars are [quite short - yet complete](http://openradar.appspot.com/27843679).

The report title is especially important. Be clear and succinct. It should be descriptive. See it as an advertisement for your cause. There will always be too many bugs to fix. If you want your problem to be fixed, make an effort, and write up a good article. Write it so that the engineer _wants_ to open it, read it, and fix it.

Keep in mind that the engineers might not have an efficient way to contact you. If they respond to a radar, this might be screened. And because screening can take up to a few days, try to write complete information that allows any engineer to reproduce the issue without further questions.

### Propose a workaround

Radars are also documentation, and other developers might find your radar, as long as you re-post it to [Open Radar](http://openradar.appspot.com/). If you have a workaround - add it! A good example of this is [rdar://26295020 - Action sheets presented for links/numbers don’t work in presented view controllers](http://openradar.appspot.com/26295020). The problematic code was duplicated in [WKWebView, which is open source](https://github.com/WebKit/webkit/blob/master/Source/WebKit2/UIProcess/API/Cocoa/WKWebView.mm). That made it quite easy to understand and then find the least invasive way to work around.

You can use the open source [QuickRadar Mac app](http://www.quickradar.com/) to make writing bug reports faster. It even allows cross-posting to Open Radar. It currently doesn’t play along with two-factor authentication, but I’m sure eventually someone will add that as well.

### Add a symbolicated crash log if applicable

Sometimes radars get pushed back as we’re reporting a crash and even include a sample project. The separate .crash file allows Apple to better categorize the crash and match it with existing data. Of course, not every radar is a crash.

### Timing is Key

Whenever Apple releases a new major version of its OS - test early! Chances that your bug gets fixed when you report it in Seed 1 are much more likely than when the GM is just a few weeks away.

![Timing is Key](/assets/img/2016/writing-good-bug-reports/timing-is-key.png)

### Here’s an [incomplete list](http://openradar.appspot.com/search?query=PSPDFKit) of bugs the PSPDFKit team wrote this year (crossed out radars are fixed)

<style>
ul { font-size:14px; }
</style>

- [rdar://28827675 UIAppearance setter called multiple times](http://openradar.appspot.com/28827675)
- [rdar://28799659 UIPasteboard needs asynchronous calls](http://openradar.appspot.com/28799659)
- [rdar://28787338 Universal Clipboard causing apps to freeze for up to 15 seconds while it checks for data on the main thread](http://openradar.appspot.com/28787338)
- [rdar://28776130 Allow preloading custom application data for UI Tests](http://openradar.appspot.com/28776130)
- [rdar://28771678 UIPasteboard notifications don't fire for other processes](http://openradar.appspot.com/28771678)
- [rdar://28612548 ThreadSanitizer: use of an invalid mutex (e.g. uninitialized or destroyed) (CoreGraphics+0x34650f) in ripl_retain](http://openradar.appspot.com/28612548)
- [rdar://28577248 Identifier of Apple Watch should be selectable or copyable via cmd-c in the Devices window. Had to use Accessibility Inspector to copy it. O.o](http://openradar.appspot.com/28577248)
- [rdar://28281042 UIDocumentMenuViewController returns 100 on modalPresentationStyle on iOS 10. (UIActivityViewController was affected in iOS 10 beta, but is fixed as of GM)](http://openradar.appspot.com/28281042)
- [rdar://28275291 UIMenuController is leaking out blur background. Discussed at WWDC 2016. Hard to reproduce. Always sticks in the eye.](http://openradar.appspot.com/28275291)
- [rdar://28252672 Crash: Double-Free when using Core Image (deep in CoreImage /libFosl_dynamic)](http://openradar.appspot.com/28252672)
- [rdar://28252227 Incorrect App Store rejections for name clashes on methods that happen to be named like private API (especially bad for us, as we ship an SDK.)](http://openradar.appspot.com/28252227)
- [rdar://28250871 CoreGraphics PDF backend has a confusing log](http://openradar.appspot.com/28250871)
- [rdar://28250805 Document Xcode config settings to enable Clang Sanitizers](http://openradar.appspot.com/28250805)
- [rdar://28167779 UICollectionView performBatchUpdates can trigger a crash if the collection view is flagged for layout](http://openradar.appspot.com/radar?id=4926683987574784)
- [rdar://28103342 ASAN_OPTIONS no longer settable when running tests within Xcode. (Regression)](http://openradar.appspot.com/28103342)
- [rdar://28053584 Xcode/Clang: certain typedefs for Objective–C generics break KVC](http://openradar.appspot.com/28053584)
- [rdar://27968875 Documents Inbox directory cannot be removed](http://openradar.appspot.com/radar?id=6141940152139776)
- [rdar://27844864 CoreText.framework is missing for the watchOS Simulator (but is available on the device platform SDK)](http://openradar.appspot.com/27844864)
- [rdar://27844227 Xcode is unusably slow during indexing](http://openradar.appspot.com/27844227)
- [rdar://27843710 Expose AudioToolbox on watchOS](http://openradar.appspot.com/27843710)
- [rdar://27843679 Expose QuartzCore on watchOS](http://openradar.appspot.com/27843679)
- <del>rdar://27526025 Unable to ship Bitcode for arm64 because of a linker bug</del> (Not on OpenRadar because we had to send many internal files to track that one down)
- [rdar://27844971 Keychain fails on iOS 10 simulator](http://openradar.appspot.com/27844971)
- [rdar://27844889 UIDocumentPickerViewController blocks UI while importing files from iCloud](http://openradar.appspot.com/radar?id=5064986766344192)
- [rdar://27822079 Linking fails due to assertion failure (cfiStartsArray[i] != cfiStartsArray[i-1]) with incremental LTO](http://openradar.appspot.com/radar?id=6134041120079872)
- [rdar://27821239 Tests run fails because test host is installing or uninstalling](http://openradar.appspot.com/radar?id=6109159569227776)
- [rdar://27820992 Duplicate PLBuildVersion symbol](http://openradar.appspot.com/radar?id=4941483320803328)
- [rdar://27790746 UIDocumentMenuViewController double height status bar issues](http://openradar.appspot.com/radar?id=5025988412964864)
- [rdar://27750195 Xcode warns about mismatched iCloud containers with per-configuration bundle IDs](http://openradar.appspot.com/radar?id=4994185790750720)
- [rdar://27471372 UIDocumentMenuViewController Auto Layout error](http://openradar.appspot.com/radar?id=6073824336412672)
- [rdar://27448912 Can’t show activity view controller filling a form sheet](http://openradar.appspot.com/27448912)
- [rdar://27448488 Reading an alert controller’s popoverPresentationController property changes behavior](http://openradar.appspot.com/27448488)
- [rdar://27261367 Breaking changing on UIActivityViewController when checking modalPresentationStyle leads to crash](http://openradar.appspot.com/27261367)
- [rdar://27192338 Detect access to UIKit from non-main-thread as a debugging feature](http://openradar.appspot.com/27192338)
- [rdar://27124693 Improve Xcode handling of external project changes](http://openradar.appspot.com/radar?id=6138065772871680)
- [rdar://27076273 Action sheets shown on a popover-presented controller do not preserve their position after rotation](http://openradar.appspot.com/27076273)
- [rdar://26995465 Bring Night Shift to macOS](http://openradar.appspot.com/26995465)
- [rdar://26972564 Xcode project update checker does not correctly handle version numbers](http://openradar.appspot.com/26972564)
- [rdar://26954460 Clarify if creation of UIImage on background threads is safe](http://openradar.appspot.com/26954460)
- [rdar://26939107 Expose verify state](http://openradar.appspot.com/26939107)
- [rdar://26900741 Radar should send notification when duplicates change status](http://openradar.appspot.com/26900741)
- [rdar://26900542 Allow to view radars from company members](http://openradar.appspot.com/26900542)
- [rdar://26897226 NSBundle's path resolution is broken with unicode](http://openradar.appspot.com/26897226)
- [rdar://26893205 Previous versions to Xcode should be able to deploy to future iOS versions](http://openradar.appspot.com/26893205)
- [<del>rdar://26667447 Game Center on OS X 10.11.5 is a little bit broken</del>](http://openradar.appspot.com/26667447)
- [rdar://26623090 Default table view cells don't size properly](http://openradar.appspot.com/26623090)
- [<del>rdar://26516120 UIGraphicsGetImageFromCurrentImageContext is \_\_null_unspecified. Why?</del>](http://openradar.appspot.com/26516120)
- [<del>rdar://26295020 Action sheets presented for links/numbers don’t work in presented view controllers</del>](http://openradar.appspot.com/26295020)
- [rdar://26227380 UITintColorVisitor causes exponentially worsening performance when adding subviews](http://openradar.appspot.com/26227380)
- [rdar://26215866 Clang Analyzer is crashing in Xcode 7.3.1 (exit code 254, files attached)](http://openradar.appspot.com/26215866)
- [rdar://26136992 There should be API to read the text speed from UIAccessibility settings](http://openradar.appspot.com/26136992)
- [rdar://25961521 SFSafariViewController renders a blank white screen for 100–300ms upon first presentation](http://openradar.appspot.com/25961521)
- [rdar://25873723 UICollectionView crashes when invalidating non existing header](http://openradar.appspot.com/25873723)
- [rdar://25809832 left bar button items have gap to the back button](http://openradar.appspot.com/25809832)
- [<del>rdar://25737301 NS_NOESCAPE</del>](http://openradar.appspot.com/25737301)
- [rdar://25733862 New JS alerts: destroyed keyboard navigation](http://openradar.appspot.com/25733862)
- [rdar://25656808 Impove default indentation for array and dictionary literals](http://openradar.appspot.com/25656808)
- [rdar://25595715 +[NSKeyedUnarchiver unarchiveTopLevelObjectWithData:error:] undocumented](http://openradar.appspot.com/25595715)
- [rdar://25595684 XCUIElementType triggers partial availability warning inside XCTest](http://openradar.appspot.com/25595684)
- [rdar://25572553 UIAlertController doesn't lay itself out correctly if no title is set - weird edges ahead!](http://openradar.appspot.com/25572553)
- [rdar://25550676 Custom UINavigationItem is ignored if ViewController is initialized via Storyboard](http://openradar.appspot.com/25550676)
- [rdar://25337169 UI frozen after rotating due to animation completion handler not called](http://openradar.appspot.com/25337169)
- [rdar://25337955 UICollectionViewCell should be extended with a setSelected:animated: method](http://openradar.appspot.com/radar?id=6702037056094208)
- [<del>rdar://25311044 The visual debugger fails because of an assertion in UIKit's UITextView when auto layout is not used</del>](http://openradar.appspot.com/25311044)
- [rdar://25235882 UICollectionViewFlowLayout movement has incorrect sizing behavior](http://openradar.appspot.com/25235882)
- [rdar://25214965 Open Quickly showing generated interface is annoying](http://openradar.appspot.com/25214965)
- [rdar://24972653 Build fails with address sanitizer feature enabled and custom CC](http://openradar.appspot.com/24972653)
- [rdar://24298174 [UIReferenceLibraryViewController dictionaryHasDefinitionForTerm:] is unusable slow](http://openradar.appspot.com/24298174)
- [rdar://24196184 Allow better keyboard states detection](http://openradar.appspot.com/24196184)
- [<del>rdar://27447948 xcodebuild test hangs when piping it's output</del>](http://openradar.appspot.com/27447948)
- [rdar://24135531 Initial layout is caught in animation block when keyboard frame change is triggered when a view in a form sheet will appearing](http://openradar.appspot.com/24135531)

### Radar works

Filing radars is worth it, even if it seems like a black hole at the first look. Sometimes it takes a while, but critical issues often get fixed.

![Radar works](/assets/img/2016/writing-good-bug-reports/radar-works.png)

### I really need this fixed!

If you have a critical bug that you need to work around, write it up and then [submit a DTS/TSI (Technical Support Incident).](https://developer.apple.com/account/?view=support)
This means that a human will look at the issue within the next 1-2 weeks. There’s no guarantee that you’ll get a workaround, but it often helps, and it certainly brings attention to the radar. We’re only doing this in rare cases, since Apple only has a few resources on TSI and we don’t want to be annoying for non-critical radars and, by default, you only have two tickets per account. With $249 USD for a 5-Pack, they’re extremely cheap for the value you get.

### Forums

The [Apple Developer Forums](https://forums.developer.apple.com) are also worth considering. The noise ratio is very high, but there are always a few Apple employees around that might be able to help. As always, the more care you put into documenting your problem, and providing a sample project, the more likely it is that somebody can help you.

### Learn More

Watch the [Maximizing Apple Development Resources presentation from WWDC 2013](https://developer.apple.com/videos/play/wwdc2013/415/) to learn more where to find documentation and how to file a bug report.

[TN2239, iOS Debugging Magic](https://developer.apple.com/library/ios/technotes/tn2239/_index.html), [TN2124, Mac OS X Debugging Magic](https://developer.apple.com/library/mac/technotes/tn2124/_index.html) and [TN2151, Understanding and Analyzing iOS Application Crash Reports](https://developer.apple.com/library/ios/technotes/tn2151/_index.html) also contain a treasure of information that will help you to identify, understand and work around issues.
