---
title: PSPDFKit 3.7 for iOS
pubDate: 2014-07-22T20:14:00.000Z
description: >-
  PSPDFKit 3.7 is another great milestone and adds a few long-requested features
  and improvements:
tags:
  - pspdfkit
source: pspdfkit.com
AIDescription: true
---


PSPDFKit 3.7 is another great milestone and adds a few long-requested features and improvements:


## Multiple Drawing Styles
A common pattern is having a thin, solid pen and a thicker, semi-transparent highlighting pen. With 3.7, the annotation toolbar now allows a configurable amount of predefined drawing styles. Now the user can switch between two different drawing pens in a fast and easy way without having to make any adjustments! Of course this is fully configurable.

![Multiple drawing styles](/assets/img/pspdfkit/2014/pspdfkit-3-7/multiple-drawing-styles.gif)

## Stylus Support
We are very proud to now offer stylus support for the following stylus types: Adonit Jot, Wagcom, Pogo Connect and HEX3 JaJA.

The framework is designed in a way where new drivers can be added easily. The automatic palm rejection also makes drawing much more convenient as you can rest your palm on the iPad without any accidental drawings.

![Stylus support](/assets/img/pspdfkit/2014/pspdfkit-3-7/stylus-support.gif)

## Language Detection
The language detection feature is a great improvement of the Text-To-Speech feature we introduced in 3.6. Just select some text and press "Speak" - the speech synthesizer now automatically detects the language of the selected text!

![Language detection](/assets/img/pspdfkit/2014/pspdfkit-3-7/language-detection.gif)

## Security
Security has always been a top priority for us. With 3.7, we've improved and hardened many edge cases around the code base to pass [Veracode](http://www.veracode.com) analysis. This is also a requirement for GOOD support. We now also sell an additional adapter that moves all file management calls over to the GOOD file system.

If you save annotations via XFDF, the new `PSPDFAESCryptoOutputStream` and `PSPDFAESCryptoInputStream` classes will transparently encrypt/decrypt the content for secure storage.

## Gallery
No release without new great features for our multimedia gallery. It learned different cover modes, including a transparent one. Multimedia links can now also be activated via button and the gallery can be displayed as popover or modally. For more information check out the [documentation in our Wiki](https://github.com/PSPDFKit/PSPDFKit-Demo/wiki/adding-a-gallery-to-your-document)
![Gallery](/assets/img/pspdfkit/2014/pspdfkit-3-7/gallery.gif)

## Forms
AcroForm support got countless improvements, especially JavaScript parsing, mail actions, direct AcroForm dictionaries, named show/hide actions for forms, improved support for unusual parent/child relationships and better validation support. Furthermore, `PSPDFFreeTextAccessoryView` and `PSPDFFormInputAccessoryView` can now be subclassed.

![Forms](/assets/img/pspdfkit/2014/pspdfkit-3-7/forms.gif)

## Localization
PSPDFKit also learned a few new languages: Dutch, Turkish, Indonesian, Malaysian, Polish, Ukrainian, Thai and Chinese Traditional.

This means, PSPDFKit is now available in 21(!) already built-in languages: English, Chinese, Chinese Traditional, Korean, Japanese, French, Spanish, Swedish, Russian, Italian, Danish, German, Portuguese, Brazilian Portuguese, Dutch, Turkish, Indonesian, Malaysian, Polish, Ukrainian and Thai.

## The little things
There are also loads of little enhancements like: Complex ink annotations are now rendered much faster. The Undo-feature will scroll to the page that is being changed. Support for GoToE embedded actions allows linking to PDFs that are saved inside the PDF. PDF metadata are now converted automatically and also include portfolio data. Also the compatibility with 3rd-party frameworks like Spark Inspector and New Relic is much improved.

These are just some of the highlights. See the full list of changes at [pspdfkit.com/changelog.html](http://pspdfkit.com/changelog.html).
