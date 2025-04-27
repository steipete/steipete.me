---
title: "PSPDFKit 3.6 for iOS"
pubDate: 2014-03-30T17:11:00.000Z
description: "We're really proud to present our 3.6 release just a month after the 3.5 milestone. Next to it being fully compatible and tested with iOS 7.1 & Xcode 5.1, it has some amazing new features:"
tags:
  - pspdfkit
source: pspdfkit.com
---

::ai[We're really proud to present our 3.6 release just a month after the 3.5 milestone. Next to it being fully compatible and tested with iOS 7.1 & Xcode 5.1, it has some amazing new features:]

We're really proud to present our 3.6 release just a month after the 3.5 milestone. Next to it being fully compatible and tested with iOS 7.1 & Xcode 5.1, it has some amazing new features:

## All new flexible annotation toolbar
We've completely rewritten the annotation toolbar to be more fluid and flexible. The new toolbar can be dragged to be both horizontal and vertical, and will automatically consolidate buttons if you ever add too many. (Devs, we're keeping the previous UIToolbar-based one around for some more time, so it's easier for people to upgrade. See `PSPDFAnnotationToolbarType` in the `PSPDFAnnotationBarButtonItem`.)
![Our flexible annotation toolbar](/images/blog/2014/pspdfkit-3-6/flexible-annotation-toolbar.gif)

## Create Digital Signatures
We've supported verifying digital signatures for quite some time now, and with the 3.6 release these signatures can now also be created. This is a PSPDFKit Complete feature and it's really useful if you also use PDF AcroForms. These signatures of course are fully compatible with Acrobat, and are also legally binding in most countries.
![Create digital signatures](/images/blog/2014/pspdfkit-3-6/create-digital-signatures.gif)

## Text-To-Speech
Great support for accessibility has long been a high priority for us, and blind users could already use the interface and read the PDF. In this version, we've taken this great accessibility feature and made it available to everyone. Just select some text and press "Speak" to get the spoken version. (Devs, see `PSPDFSpeechSynthesizer` for details. This is an iOS 7 only feature)
![Text-to-speech](/images/blog/2014/pspdfkit-3-6/text-to-speech.gif)

## Search includes Annotations
Search now also checks the text that's saved in your notes and other annotation objects like free text. That's great to get the full picture and extremely useful for forms. And instead of making things slower, we've spend some days tweaking the text extraction logic and managed to make our search _even faster_. We've also improved search accuracy and now dismiss search results on a second tap.
![Search annotations](/images/blog/2014/pspdfkit-3-6/search-annotations.gif)

## Note annotations are in the thumbnails
This might sound trivial, but was actually really tricky to get right. Next to getting the rendering right, PDF pages can have different sizes, and we had to find a size that is smaller than the default style, but still makes the icon visible in a smaller thumbnail (and thumbnails have a configurable size as well...)
We've also worked on notes in general. Now, when you zoom,they stay the same size. No more huge pixelated note icons on high zoom levels.
![Note annotations on thumbnails](/images/blog/2014/pspdfkit-3-6/note-annotations-on-thumbnails.gif)

## Gallery Looping
As always, our powerful gallery component learned a few tricks as well. It can now do content looping (fully configurable via JSON), the support for YouTube embedding is much improved, including custom quality settings, and the background now optionally is live-blurred instead of the default black.
![Gallery looping](/images/blog/2014/pspdfkit-3-6/gallery-looping.jpg)

## JavaScript
PDF not only contains CSS and XML, but also sometimes JavaScript. Some actually have **lots** of it. We're working on our bridge and 3.6 already features some of these improvements, with alerts and print buttons working, and the most common forms of form validation. It's a huge spec and a lot of work, so you can be sure to expect more news about this in future updates.
![JavaScript](/images/blog/2014/pspdfkit-3-6/javascript.gif)

## The little things
Everything's a bit more snappy, as we've spent a lot of time rewriting the hot spots and are doing more work lazily. Annotation saving is faster and writes more compact data, and now always preserves the correct z-index for annotations. Mail links with multiple email targets are now parsed correctly. XFDF has gained some tricks, and many internal components can now be customized via `UIAppearance`. Oh, and we added Swedish to our list of pre-supplied languages, which bumps the total number of supported languages to 13.

And these are just some of the highlights. See the full list of changes at [pspdfkit.com/changelog.html](http://pspdfkit.com/changelog.html).

This release wouldn't have been possible without the amazing team, a huge thanks to Denys, Erik, Vic, Matthias, Matej, Samo, Karin, Martin, Derek and Max. Want to work for us? Drop a mail to careers@pspdfkit.com.
