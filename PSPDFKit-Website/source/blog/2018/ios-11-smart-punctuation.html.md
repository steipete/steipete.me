---
title: "Smart Punctuation on iOS 11"
description: "We explain iOS 11's Smart Punctuation and discuss how it affects string handling in your app."
preview_image: /images/blog/2018/smart-punctuation-ios/article-header.png
section: blog
author:
  - Aditya Krishnadevan
author_url:
  - https://caughtinflux.com
date: 2018-05-07 12:00 UTC
tags: iOS, Development
cta: ios
published: true
---


The early 20th century saw much of the world adopt the machine that most modern keyboard layouts are based on: the typewriter. Typewriters had quite a few mechanical constraints, such as the force one needed to apply to ensure the characters were correctly printed, their relatively immense weight, and the amount of space every new character occupied. To address the last problem, the keys for “curly” opening and closing quote characters were replaced with a single “straight” quote, freeing up space for two other characters that were deemed to be more important. Modern software doesn’t have these limitations, but many of us developers still use the ambidextrous quotes rather than their typographically correct equivalents, mostly because our keyboards don’t have explicit keys for them. In this post, we’ll take a look at how iOS 11 works around this limitation and how it affects string handling when using UIKit controls.

## Smart Punctuation

With iOS 11, Apple introduced Smart Punctuation. By default, this feature automatically converts ambidextrous straight quotes to curly quotes, in addition to converting two hyphens (--) to an em dash (—). In the case of quotes, it also replaces the straight apostrophes and quotes with [language-specific glyphs][language-specific quotes].

<video src="/images/blog/2018/smart-punctuation-ios/smart-punctuation-french.mp4" width="75%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Major text input controls in UIKit, like [`UITextField`][UITextField] and [`UITextView`][UITextView], perform these conversions as the user is inputting text. For quotes specifically, UIKit provides the [`smartQuotesType`][smart quotes property] property as a part of the [`UITextInputTraits`][UITextInputTraits] protocol to control this substitution.

## Changes to String Handling

For us developers, smart quotes can cause issues in two places: UI tests, and detecting quoted text (in search, for example). 

While simply using the [`smartQuotesType`][smart quotes property] property to disable smart quotes on all input controls might seem like a quick fix, it’s nothing more than a bandage that quickly falls off: It is easily circumvented by pasting in text that contains smart quotes.

In our [PDF Viewer] app, we enabled users to search for text across all their documents by leveraging the [Indexed Full-Text Search component of the PSPDFKit framework][PSPDFKit FTS Component iOS]. When searching, we tokenized the input text using the [Porter-Stemming technique][FTS Blog Post Customizability], in order to provide more results. Since this was at the cost of result accuracy, users could enclose their search terms in straight double-quote characters and only get results that matched the input exactly.

We added a small extension on Swift’s `String` type to check if the receiver was enclosed in quotes. This was our implementation:

```swift
extension String {
    var isEnclosedInDoubleQuotes: Bool {
        return characters.first == "\"" && characters.last == "\""
    }
}
```

This implementation was pretty naïve, as not only did it check just for the straight quotes, but it also didn’t consider the variety in quote styles across different languages. While we evaluated certain ways to fix this (as described below) we ended up not having to fix it — our app switched from a custom file browser UI to using iOS 11’s native [`UIDocumentBrowserViewController`][UIDocumentBrowserViewController], which meant we relinquished control over search, and therefore, the text field. However, had we had to fix it on our own, we would have used the following two steps: correctly detecting quoted text, and replacing smart quotes with straight quotes.

### Correctly Detecting Quoted Text

To do this, you’d need to account for the keyboard’s current language using [`UITextInputMode.primaryLanguage`][UITextInputMode.primaryLanguage], and then check for the appropriate glyphs at the start and end of the string returned from the input control. This can easily become very complex depending upon the languages you support, and it is a bit of a balancing act between how typographically accurate you wish to be and how convenient you want the user input to be.

[Frank Rausch][Frank Rausch Website] gave a [talk][UIKonf Talk Link] about building better apps with good typography. In this talk, he touched upon the differences between the types of dashes, and, of course, quotes. He also pointed us to his excellent open source library, [Typographizer][Typographizer GitHub]. Given that it is available to use under the lenient MIT license, you can look at the various [cases][Link to Quote-Specifying Code] that need to be handled to properly detect quotes. Using this information to develop a better version of the `isEnclosedInDoubleQuotes` computed property above is left as an exercise for the reader.

### Replacing Smart Quotes with Straight Quotes

In some cases, your user-input text will be more than just user facing; it can have meaning for other parts of your code. Consider, for instance, an SSH app like [Prompt](https://panic.com/prompt/). If the app uses a [`UITextField`][UITextField] for input, and if you don’t set the [`smartQuotesType`][smart quotes property] property to [`UITextSmartQuotesTypeNo`], then a command like `find . -name 'Hello World.txt'` will get turned into `find . -name ‘Hello World.txt’`, resulting in a syntax error. In some cases, this replacement may not even cause an error, but instead cause unexpected behavior, which is far worse.

A first step, if using a [`UITextInputTraits`][UITextInputTraits] conforming control, would be to set [`smartQuotesType`][smart quotes property] to [`UITextSmartQuotesTypeNo`], and set [`smartDashesType`][smart dashes property] to [`UITextSmartDashesTypeNo`]. However, as mentioned above, this doesn’t work around the issue of the user pasting in text containing these characters. This is an issue across all iOS versions, not just iOS 11.

To truly sanitize your input, you would then need to check the input string whenever it changed and replace the special characters with their straight-quote equivalents. This isn’t a solution that will always be appropriate, though; the user might intentionally input specific characters, and there’s no easy way to tell what the user means without employing heuristics, which, by definition, will not always be accurate.

In a slightly anti-climactic conclusion, it appears that the best solution is dependent upon what your app does, what the particular input in question does, and, most importantly, _what the user wants to do_.

[language-specific quotes]: https://en.wikipedia.org/wiki/Quotation_mark#Specific_language_features
[UITextField]: https://developer.apple.com/documentation/uikit/uitextfield
[UITextView]: https://developer.apple.com/documentation/uikit/uitextview
[smart quotes property]: https://developer.apple.com/documentation/uikit/uitextinputtraits/2865931-smartquotestype
[smart dashes property]:  https://developer.apple.com/documentation/uikit/uitextinputtraits/2866013-smartdashestype
[UITextInputTraits]: https://developer.apple.com/documentation/uikit/uitextinputtraits
[PDF Viewer]: https://pdfviewer.io
[PSPDFKit FTS Component iOS]: https://pspdfkit.com/pdf-sdk/ios/indexed-search/
[FTS Blog Post Customizability]: https://pspdfkit.com/blog/2018/leveraging-sqlite-full-text-search-on-ios/#customizability-of-fts
[UITextInputMode.primaryLanguage]: https://developer.apple.com/documentation/uikit/uitextinputmode
[UIDocumentBrowserViewController]: https://developer.apple.com/documentation/uikit/uidocumentbrowserviewcontroller
[Frank Rausch Website]: http://frankrausch.com
[UIKonf Talk Link]: https://www.youtube.com/watch?v=YM2Nj691PMo
[Typographizer GitHub]: https://github.com/frankrausch/Typographizer
[Link to Quote-Specifying Code]: https://github.com/frankrausch/Typographizer/blob/a585ac86644d2cc08adca88d0f6c6f952183c9b9/Sources/Typographizer.swift#L54
[`UITextSmartQuotesTypeNo`]: https://developer.apple.com/documentation/uikit/uitextsmartquotestype/uitextsmartquotestypeno
[`UITextSmartDashesTypeNo`]: https://developer.apple.com/documentation/uikit/uitextsmartdashestype/uitextsmartdashestypeno
