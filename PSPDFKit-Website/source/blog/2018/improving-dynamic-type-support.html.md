---
title: "Improving Dynamic Type Support"
description: "How to improve Dynamic Type support in your app and bring it to the next level."
preview_image: /images/blog/2018/improving-dynamic-type-support/article-header.png
section: blog
author:
  - Stefan Kieleithner
author_url:
  - https://twitter.com/steviki
date: 2018-10-17 9:00 UTC
tags: iOS, Development
published: true
secret: false
cta: viewer
---

Embracing Dynamic Type has an actual impact in the real world. As opposed to simply being yet another feature that should be adopted just for the sake of supporting it, Dynamic Type helps make your app more accessible to a variety of users.

READMORE

In general, Dynamic Type is used on iOS for determining and changing text size, and the text size is driven by a user-defined setting. Honoring this setting will not only improve your app’s user experience and enable people who would otherwise not be able to to use your app, but it also encourages you to write code for more dynamic interfaces. Supporting Dynamic Type will improve your app’s ability to adapt to changes in a dynamic environment; examples of this include handling localized or user-generated text of varying lengths.

Dynamic Type works great if you use the built-in and recommended API provided by UIKit, but there are additional options for advancing your app to the next level. In this article, I’ll cover both the basics of Dynamic Type and some more advanced use cases. I’ll first begin with how to support Dynamic Type, followed by user adoption numbers and accessibility concerns. Then I’ll talk about available text styles, as well as custom fonts and styles. Finally, I’ll cover the history of Dynamic Type, give some tips on how to debug text-related code, and provide an overview of when to use Dynamic Type.

We are always striving to improve accessibility and Dynamic Type support in our products. That’s also why quite a few improvements made it into our recent [PSPDFKit 8 for iOS release][PSPDFKit 8 for iOS blog post].

### Supporting Dynamic Type

To take advantage of Dynamic Type, you have multiple options. The easiest solution is to use a font provided by [`preferredFontForTextStyle:`][] on a text element like `UILabel`:

[==
```swift
let headlineLabel = UILabel()
headlineLabel.font = UIFont.preferredFont(forTextStyle: .headline)
```

```objc
UILabel *headlineLabel = [[UILabel alloc] init];
headlineLabel.font = [UIFont preferredFontForTextStyle:UIFontTextStyleHeadline];
```
==]

Additionally, in most cases, you want your text to automatically resize when the user changes the Dynamic Type setting, even if your view component containing the text is already onscreen. This can be done by enabling [`adjustsFontForContentSizeCategory`].

<video src="/images/blog/2018/improving-dynamic-type-support/variable-text-styles.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

There are more APIs related to Dynamic Type, including [`scaledFontForFont:`][], [`preferredFontDescriptorWithTextStyle:`][], and the currently active text size setting, [`preferredContentSizeCategory`][].

Most of the time, it’s also necessary to set the `numberOfLines` property on `UILabel` to 0, in order to make sure the text is not clipped to a single line, since some content might require multiple lines when the text size increases.

### User Adoption

Why are you actually supposed to adopt Dynamic Type? First, it enables your users to have more control over how an app’s content is presented to them. Additionally, this feature is used widely in the real world. For example, approximately 27 percent of the users of [PDF Viewer][] set a non-default text size.

![Adoption Graph](/images/blog/2018/improving-dynamic-type-support/adoption-graph.png)

#### Accessibility

Supporting larger text size settings also makes your app more accessible for users needing larger typefaces. This can increase your app’s user base to include people who would normally not be able to use it. Not only that, but users who want smaller text to fit more content on the screen are not left out either.

### Text Styles

[`UIFontTextStyle`][] is used to define a variety of different styles for text. There are 11 predefined font text styles that can be used for displaying text:

- `body`
- `callout`
- `caption1`
- `caption2`
- `footnote`
- `headline`
- `subheadline`
- `title1`
- `title2`
- `title3`
- `largeTitle`

`largeTitle` was a new addition in iOS 11, although it seems a bit neglected. Text is not automatically resized once the user changes the font size setting, even when [`adjustsFontForContentSizeCategory`][] is turned on. This seems to be a bug, as it uses the correct font size at the time the font is created (via [`preferredFontForTextStyle:`][]), but doesn’t update anymore as long as the font isn’t recreated. Feel free to dupe [our Radar][large title radar].

### Custom Fonts and Styles

As of iOS 11, you can support Dynamic Type while using a custom font. This means you’re no longer limited to using the system font in order to take advantage of all the features. While this requires a little bit of extra work, you can still create beautiful interfaces. With the [`UIFontMetrics`][] API, you can define any available text style the same way you would when using preferred fonts with the system style:

[==
```swift
let fontMetrics = UIFontMetrics(forTextStyle: .headline)
let noteworthy = UIFont(name: "Noteworthy", size: 15)
let scaledNoteworthy = fontMetrics.scaledFont(for: noteworthy)
```

```objc
UIFontMetrics *fontMetrics = [UIFontMetrics metricsForTextStyle:UIFontTextStyleHeadline];
UIFont *noteworthy = [UIFont fontWithName:@"Noteworthy" size:15.f];
UIFont *scaledNoteworthy = [fontMetrics scaledFontForFont:noteworthy];
```
==]

This API can be used not only for creating a Dynamic Type-supported custom font, but also for system fonts that should use a custom, non-default style. For example, it’s possible to make a font bold and still have it adapt to the text size setting:

[==
```swift
let scaledBoldFont = UIFontMetrics.default.scaledFont(for: UIFont.boldSystemFont(ofSize: 14))
```

```objc
UIFont *scaledBoldFont = [UIFontMetrics.defaultMetrics scaledFontForFont:[UIFont boldSystemFontOfSize:14.f]]
```
==]

And the great part: Using [`adjustsFontForContentSizeCategory`][] still works just the same as using [`preferredFontForTextStyle:`][] does. In fact, only the fonts provided from those two APIs (including all of their variants) provide the ability to set [`adjustsFontForContentSizeCategory`][]. You won’t be able to use it with any other font and will need to handle the automatic sizing logic yourself. That’s also why it’s recommended to use these APIs if somehow possible.

### History

Dynamic Type was introduced in iOS 7, and it has been continuously refined in the years since. But now you are able to let UIKit handle automatic resizing when the user changes the text size setting by enabling [`adjustsFontForContentSizeCategory`][]. Prior to iOS 10, if you wanted to get live updating of any currently displayed text, you had to do this manually by listening for [`UIContentSizeCategoryDidChangeNotification`][] and updating to the new font.

Using custom fonts or system fonts with styles other than the predefined text styles was also a bit tedious before, since you had to manually adjust the font size for the current [`preferredContentSizeCategory`][]. We resorted to using [`UIFontDescriptor`][] and some manual calculations to make this work. So to get the same `scaledBoldFont` we created in the above section, we used this code:

[==
```swift
let multiplierForPreferredContentSize = UIFontDescriptor.preferredFontDescriptor(withTextStyle: .body).pointSize / 17
let scaledBoldFont = UIFont.boldSystemFont(ofSize: 14 * multiplierForPreferredContentSize)
```

```objc
CGFloat *multiplierForPreferredContentSize = [UIFontDescriptor preferredFontDescriptorWithTextStyle:UIFontTextStyleBody].pointSize / 17.f;
UIFont *scaledBoldFont = [UIFont boldSystemFontOfSize:14.f * multiplierForPreferredContentSize];
```
==]

Note that 17 is used as the magic number, since this is the size of the `body` style at the default size category, [according to Apple’s Human Interface Guidelines][hig typography].

Thankfully, those days are over, and we can now rely on a great built-in system API that handles all of this for us.

### Debugging

On devices running iOS 11 or later, you can change the text size setting on iOS in Settings > Display & Brightness > Text Size. Note that this slider does not include the larger accessibility sizes by default. To enable those, head to Settings > General > Accessibility > Larger Text and enable Larger Accessibility Sizes. Now you are able to set the font size even larger.

Debugging and testing Dynamic Type support in your app can be a time-consuming process. The usual process would involve opening the component you want to examine in your app, opening Settings and changing the font size, and switching back to your app again. But it turns out there are much more simple and straightforward ways to change the Dynamic Type setting. First of all, there is a built-in Control Center action for customizing the text size, and this proves a quick and easy option to change Dynamic Type on the fly and verify if your components update correctly.

<video src="/images/blog/2018/improving-dynamic-type-support/text-size-control-center.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Next up, the Accessibility Inspector is a very handy developer tool to test if your labels, text views, and text fields are honoring Dynamic Type. It very easy to verify that your fonts are correctly resizing, as the font size setting changes live in your app. You can not only change accessibility settings for the Simulator, but also for any connected iOS device.

![Accessibility Inspector](/images/blog/2018/improving-dynamic-type-support/accessibility-inspector.png)

And in addition to quickly changing the Dynamic Type setting, you can also run an audit of your app, which shows you exactly which parts could use some accessibility-related improvements.

![Accessibility Inspector Audit](/images/blog/2018/improving-dynamic-type-support/accessibility-inspector-audit.png)

### When to Use Dynamic Type

While honoring Dynamic Type is generally recommended, there are certainly parts in the UI where a fixed font size should be used. Some interfaces may show static text — which is not localized and should always be displayed the same way — in a constrained layout. In such a case, Dynamic Type should be disabled, since showing the text at a larger size might cause clipped text, UI glitches, or text that is beyond the bounds of the envisioned layout. This needs to be decided on a case-by-case basis for each separate UI component.

As a general rule of thumb, scrolling content should always use adaptive text sizes, while text that is shown in bars or decorative views might not always look good with text sizes that are larger or smaller than the default size.

### Update (19 Oct 2018)

This article was heavily discussed on Twitter. Some people were curious about the large percentage of non-default Dynamic Type. We reran the query today and the results are similar, with 50 percent more data points now. Additionally, we compared the differences in text size settings between countries:

![Adoption Graph Countries](/images/blog/2018/improving-dynamic-type-support/adoption-graph-country.png)

Please share your own queries; we would love to compare notes.

### Further Resources

I hope this blog post has shed some light on Dynamic Type. For more information, you can find a [section about typography][hig typography] in the Human Interface Guidelines. This is really worth a read, as it dives deeper into the topic of fonts, typefaces, and text in general.

[`UIFontTextStyle`]: https://developer.apple.com/documentation/uikit/uifonttextstyle
[`UIFontMetrics`]: https://developer.apple.com/documentation/uikit/uifontmetrics
[`preferredContentSizeCategory`]: https://developer.apple.com/documentation/uikit/uiapplication/1623048-preferredcontentsizecategory
[`UIContentSizeCategoryDidChangeNotification`]: https://developer.apple.com/documentation/uikit/uicontentsizecategory/1622948-didchangenotification
[`adjustsFontForContentSizeCategory`]: https://developer.apple.com/documentation/uikit/uicontentsizecategoryadjusting/1771731-adjustsfontforcontentsizecategor
[`UIFontDescriptor`]: https://developer.apple.com/documentation/uikit/uifontdescriptor
[`preferredFontForTextStyle:`]: https://developer.apple.com/documentation/uikit/uifont/1619030-preferredfont
[`preferredFontDescriptorWithTextStyle:`]: https://developer.apple.com/documentation/uikit/uifontdescriptor/1616705-preferredfontdescriptor
[hig typography]: https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/typography/
[`scaledFontForFont:`]: https://developer.apple.com/documentation/uikit/uifontmetrics/2877385-scaledfont
[large title radar]: https://openradar.appspot.com/43682426
[PDF Viewer]: https://pdfviewer.io#ios
[PSPDFKit 8 for iOS blog post]: /blog/2018/pspdfkit-ios-8-0
