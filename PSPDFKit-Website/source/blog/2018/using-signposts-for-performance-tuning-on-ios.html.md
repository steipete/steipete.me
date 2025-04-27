---
title: "Using Signposts for Performance Tuning on iOS"
description: "A look at the different ways that we measure and try to improve performance at PSPDFKit."
preview_image: /images/blog/2018/using-signposts-for-performance-tuning-on-ios/article-header.png
section: blog
author:
 - Aditya Krishnadevan
author_url:
 - https://twitter.com/caughtinflux
date: 2018-11-21 8:00 UTC
tags: iOS, Development
published: true
secret: false
---

PSPDFKit’s most important feature is fast PDF rendering. This post looks into how we measure performance when developing the framework and how we try to remove bottlenecks. We had an established way of doing this in the past (using the Time Profiler), but the new iOS 12 API [Signposts][signposts wwdc link] provided us with a new way of performance tuning.

READMORE

## Signposts

With iOS 12, Apple introduced [`os_signpost`][os_signpost docs]. Instead of focusing on efficient logging, like [`os_log`][os_log docs] does, the sole purpose of [`os_signposts`][os_signpost docs] is to collect performance data for visualization. It allows you to place markers that show up in instrumentation to better discern where a bottleneck could be. In particular, there are two ways to use `os_signpost`s: They can be used to mark periods of time (`intervals`) or single points in time (`events`). These signposts can span processes or be limited to a single process or even a single thread. Signpost Intervals are particularly useful for measuring a specific block of code that is causing a slowdown.

### The Problem

At PSPDFKit, we have an increasingly complex architecture. With a lot of APIs offering different methods of customization, we always try to fail early using asserts if a method receives data that is unexpected. Let’s look at a concrete example below.

[`PSPDFTextSelectionView`][text selection view docs] handles the selection of text on a particular page of a PDF. It has an API to [specify the glyphs][selectedGlyphs] to be selected. The number of glyphs selected could vary from the tens to the thousands, depending on the PDF. Additionally, this method can be called several times a second, as it is used as a part of responding to touches from the user:

[===

```objc
- (void)setSelectedGlyphs:(nullable NSArray<PSPDFGlyph *> *)selectedGlyphs {
    PSPDFAssertEnumerable(selectedGlyphs, PSPDFGlyph);
    if (PSPDFEqualObjects(selectedGlyphs, _selectedGlyphs)) {
        return;
    }
    NSString *text = PSPDFStringFromGlyphs(selectedGlyphs);
    // Process glyphs and convert to blocks for creating the selection UI.
}
```

===]

`PSPDFAssertEnumerable` goes through the passed-in [`NSFastEnumeration`][NSFastEnumeration] conformant object and ensures that all its elements are of the same expected class. This allows us to fail early when a user of our framework mistakenly passes in something we do not expect, as opposed to crashing later on due to an unrecognized selector exception. This sort of check is only required in Objective-C, as the collection classes make no guarantees about the types of their elements, in spite of [lightweight generics][lightweight generics].

### Measuring Intervals

After testing, we found that the text selection was not as performant as we’d like it to be. There seemed to be an almost unnoticeable lag when selecting small portions of text, but the lag would grow along with the amount of text we selected.

Typically, the next step after finding a performance problem is to measure the slowdown and determine where it occurs. For this, I usually start up the Time Profiler. But now we can use Signposts to mark specific intervals in our code and then look at them in Instruments.

In the text selection view, all the block detection work is performed by `-setSelectedGlyphs:`, and since this method was recently refactored, I wanted to see if we were hitting any unforeseen bottlenecks. Converting a bunch of frames on the screen into discernible text blocks is not a quick operation, so the speedup, if any, was not going to come from the block detection, which was already pretty well optimized.

To find the bottlenecks, we used the Signpost Intervals API and measured how long certain method calls took. For the purposes of this post, we are only interested in optimizing the preamble of this method. Note that if your deployment target is less than iOS 12.0, you will need to enclose the `os_signpost` calls in an `if (@available (iOS 12.0, *) {}` block (`if #available(iOS 12.0, *) {}` in Swift):

[===

```objc
- (void)setSelectedGlyphs:(nullable NSArray<PSPDFGlyph *> *)selectedGlyphs {
    // _textSelectionLog is previously set up using `os_log_create`.
    os_signpost_id_t ident = os_signpost_id_generate(_textSelectionLog);

    // Begin an os_signpost_interval to measure AssertEnumerable.
    os_signpost_interval_begin(_textSelectionLog, ident, "AssertEnumerable", "%{public}lu", (unsigned long)selectedGlyphs.count);
    PSPDFAssertEnumerable(selectedGlyphs, PSPDFGlyph);
    // End the interval.
    os_signpost_interval_end(_textSelectionLog, ident, "AssertEnumerable", "%{public}lu", (unsigned long)selectedGlyphs.count);

    if (PSPDFEqualObjects(selectedGlyphs, _selectedGlyphs)) {
        return;
    }

    os_signpost_interval_begin(_textSelectionLog, ident, "StringFromGlyphs");
    NSString *text = PSPDFStringFromGlyphs(selectedGlyphs);
    os_signpost_interval_end(_textSelectionLog, ident, "StringFromGlyphs");
    // Process glyphs and convert to blocks for creating the selection UI.
}
```

```swift
let log = OSLog(subsystem: "com.pspdfkit.pspdfkit", category: "Text Selection")

var selectedGlyphs: [PSPDFGlyph] = [] {
    didSet {
        if selectedGlyphs == oldValue {
            return
        }

        let ident = OSSignpostID(log: log)

        // String interpolation cannot be used here, as the format parameter is a StaticString.

        os_signpost(.begin, log: log, name: "StringFromGlyphs", signpostID: ident, "%{public}ld", selectedGlyphs.count)
        let text = PSPDFStringFromGlyphs(glyphs: selectedGlyphs)
        os_signpost(.end, log: log, name: "StringFromGlyphs", signpostID: ident, "%{public}ld", selectedGlyphs.count)

        // Process glyphs and convert to blocks for creating the selection UI.
    }
}

```

===]

We needed to use the special `%{public}<format specifier>` format string to ensure that the log actually displayed the information required to force the logging system to display dynamic strings. From Apple’s [documentation on `os_log`][os_log docs]:

> The unified logging system considers dynamic strings and complex dynamic objects to be private, and does not collect them automatically. To ensure the privacy of users, it is recommended that log messages consist strictly of static strings and numbers. In situations where it is necessary to capture a dynamic string, you may explicitly declare the string public using the keyword public. For example, %{public}s.

The `os_signpost_id_t` passed in to the `os_signpost_interval` allows Instruments to distinguish between multiple overlapping intervals with the same log and interval names. While not strictly necessary in the above instance, it is always a good idea to use this in case the implementation changes in the future.

#### Viewing Signposts in Instruments

To view Signposts data in Instruments, we first needed to start a Profile run from Xcode. Then, on the instrument selection page, we selected Blank Instrument. Next, in the top right of the window, we clicked the `+` button and selected the `os_signpost` instrument.

![Adding the signpost instrument](/images/blog/2018/using-signposts-for-performance-tuning-on-ios/signpost_instrument_add.png)


#### Results

![Signpost Results](/images/blog/2018/using-signposts-for-performance-tuning-on-ios/signpost_results.png)

In the results (under TextSelection), it’s fairly obvious how heavy these calls were. While the average time spent executing is only 108µs for `PSPDFAssertEnumerable`, and 787.58µs for `PSPDFStringFromGlyphs`, this time balloons when the number of selected glyphs is large: With 3,500 glyphs selected, `AssertEnumerable` can take up to 3.5ms! On a 120fps screen, where you only have about 6ms to finish your work on the main thread before causing stutters, this is an especially inordinate amount of time. Since this method is called a lot from [`PSPDFTextSelectionView`][text selection view docs]’s touch handling code, there is no need for us to iterate through the entire array every time it’s called internally. We therefore added a variant of `setSelectedGlyphs:` without the `PSPDFAssertEnumerable` check.

This method accepts an `NSArray<PSPDFFGlyph *>` and appends the characters in each glyph to form a string. The first obvious method to speed this up is to use `+[NSMutableString stringWithCapacity:]` to avoid repeated allocations. While this did speed things up, the root of the problem still lingered: We had an `O(n)` method where `n` could get pretty large. This is in line with our findings from testing, where the lag would get longer the more text you selected.

To fix this properly, we’d like to remove the need to call `PSPDFStringFromGlyphs` completely. On reviewing the code, we found that it was not necessary for us to compute the selected text as a string at that point in time. While we’d need to make some API changes, the performance gain from removing this call would make it worth it.

## Conclusion

While our example above was rather simplistic and only really measured single method/function calls, Signposts can be used for much more. Since Signpost Intervals can be used across threads, it becomes easier to measure the performance of multi-threaded workloads. While not a replacement for the Time Profiler, if you’re already aware of the general area you’d like to measure, the `os_signposts` instrument allows for a less noisy environment in which to get performance data. At PSPDFKit, we’re very pleased with the [`os_signpost`][os_signpost docs] API, and we are confident it’s a great addition to every developer’s toolkit.

[signposts wwdc link]: https://developer.apple.com/videos/play/wwdc2018/405/
[os_signpost docs]: https://developer.apple.com/documentation/os/3019241-os_signpost
[os_log docs]: https://developer.apple.com/documentation/os/logging?language=objc
[text selection view docs]: https://pspdfkit.com/api/ios/Classes/PSPDFTextSelectionView.html
[lightweight generics]: https://useyourloaf.com/blog/using-objective-c-lightweight-generics/
[selectedglyphs]: https://pspdfkit.com/api/ios/Classes/PSPDFTextSelectionView.html#/c:objc(cs)PSPDFTextSelectionView(py)selectedGlyphs
[nsfastenumeration]: https://developer.apple.com/documentation/foundation/nsfastenumeration
