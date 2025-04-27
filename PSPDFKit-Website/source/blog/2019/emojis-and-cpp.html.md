---
title: "Challenges of Using Emojis with C++"
description: "In this article, we discuss the challenges of implementing your own custom emoji support in a cross-platform way."
preview_image: /images/blog/2019/emojis-and-cpp/article-header.png
section: blog
author:
  - Patrik Weiskircher
author_url:
  - https://twitter.com/pweisk
date: 2019-09-09 8:00 UTC
tags: Development
published: true
secret: false
---

In the current world, emojis are pretty important — not just for having fun when messaging your friends, but also when you want to communicate the status of something in a clear, easily recognizable way. There is a reason why so many things in the real world are visually depicted. This is why we looked into bringing emojis into PDFs in a way that works everywhere. However, this came with quite a few challenges.

READMORE

PSPDFKit runs on many different platforms (Android, iOS, macOS, Web, Windows) and our rendering happens in our C++ core. While we could have implemented support for this in each and every individual platform, we made the decision that it is better to try to unify this in C++, especially because implementing it multiple times could lead to a lot of different bugs. While most of the PSPDFKit code is shared, there are some unique challenges to each platform. But before getting to that, we should look at one of the most elemental pieces we have to have to get this to work: rendering the emojis.

## 📝 FreeType

[FreeType][] is an open source font rendering library that we use in our C++ core to render all text. Without it, we would have had to do a lot more to get emojis to work. Luckily, it also added better support for emoji rendering in one of its most recent [versions][freetype emoji version changelog].

But with that out of the way, there was one other big stepping stone: Easily getting the glyph from the emoji font from the emoji code point.

## 📐 HarfBuzz

[HarfBuzz][harfbuzz link] is an open source text shaping library that is used by many software projects, including Chrome. Basically, you give it a font and text to render and specify which language you’re rendering and it gives you which glyphs you should render where. This means we could just give it our emoji code points and it told us exactly which glyph we had to render. We already were using HarfBuzz to properly render international text, so this was perfect for us!

With all of this done, we could actually move on to the platforms!

## 🤖 Android

Android was one of the simplest platforms to render emojis for. We simply loaded the `Noto Color Emoji` font and rendered it. This worked without a hitch!

## 🍏 iOS and macOS

iOS was more complicated. While developing this feature, we used the `Apple Color Emoji` font from macOS and everything went perfectly. FreeType rendered it correctly, the result looked good, and we thought we got it. Then we tried it on an iOS device and it simply didn’t render anything.

As it turns out, Apple uses [different compression algorithms][glyph types ios] in its emoji font that aren’t supported by FreeType — or any other open source library. We recognized that even if we add support for the compression formats that we need for our supported iOS platforms, Apple could just change it again. We didn’t want to run into any more problems, so we added quick support for CoreText to render emojis on iOS, but everything else (figuring out which emoji to render, how to position it, ...) stayed in our common core code.

## 🏠 Windows

Recent versions of Windows contain a font called `Segoe UI Emoji`, which worked great together with FreeType.

## 📈 How to Integrate into PDF

Now that we were able to render emojis, we had to integrate them into a PDF file. The PDF format does not have native support for emojis or else we could have just used that. We tested a lot of different viewer applications, but almost none of them had good support for this. The best we saw was Apple’s Preview and Adobe Acrobat on the iPhone.

So, we modeled our solution after these. When generating the [appearance stream][apstream blog link], we render the text normally and then simply insert the emojis as images. Because they are images, every viewer can show them. The text gets saved as Unicode in the annotation or form, so it can still be properly edited.

## 🙌 Summary

In the end, while it was quite a bit of work, we have great support for emojis across our products. This enables even better communication in a PDF than before — and it can even be a bit of fun.

[freetype]: https://www.freetype.org/
[freetype emoji version changelog]: https://sourceforge.net/projects/freetype/files/freetype2/2.10.0/
[harfbuzz link]: https://www.freedesktop.org/wiki/Software/HarfBuzz/
[glyph types ios]: https://twitter.com/vXBaKeRXv/status/947571117572493313
[apstream blog link]: https://pspdfkit.com/blog/2018/what-are-appearance-streams/
