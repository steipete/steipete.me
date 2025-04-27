---
title: "PSPDFKit 4.0 for iOS"
section: blog

author: Peter Steinberger
author_url: https://twitter.com/steipete
date: 2014-09-23 12:00 UTC
tags: iOS, Features, New Release, Products
published: true
---

Version 4.0 is a major new release. We've created [a convenient migration guide](/guides/ios/current/migration-guides/pspdfkit-40-migration-guide/) to make upgrading as simple as possible.

## iOS 8 &amp; Xcode 6

The biggest news is that PSPDFKit is now fully compatible with iOS 8 and requires Xcode 6 with SDK 8. There have been a lot of changes, updating everything was a lot of effort. We still support iOS 7 but dropped iOS 6 and updated many places in the code to use more modern API calls, to better future-proof the product. Following Apple's new defaults, we removed the slice for armv7s and ship the binary with all platforms Apple supports (armv7, arm64, i386 and x86_64).

## iPhone 6 Plus

We've added @3x resources for all assets to provide a crisp and clear look on the new iPhone 6 Plus which has an even higher pixel density.

## API Modernization

Several properties that were no longer in line with iOS 7 have been removed: `tintColor`, `shouldTintPopovers` and `minLeft/RightToolbarWidth`. Use `UIAppearance` to customize colors and tint throughout PSPDFKit instead. An important change is that we no longer support the legacy `UIViewControllerBasedStatusBarAppearance` setting. Use view controller based status bar appearance instead. We've also switched to `NSURLSession` internally, which enables SPDY support for faster asset fetching (if your server supports that).

## PSPDFConfiguration

Part of the API cleaning was the introduction of a new immutable configuration object that unifies most of the possible settings in PSPPDFKit. This makes customizing a lot simpler, plus `PSPDFConfiguration` itself can be stored so different configurations can be applied easily. See our PSPDFCatalog for many samples how to use it. The pattern we use here is called the "builder pattern" and you'll find that in modern Apple API such as `WKWebView` as well.

## Rendering Improvements

Previously, there were some limitations for unusual document formats, specifically a limitation for super long/wide PDFs. This has been removed. PSPDFKit now correctly renders documents no matter how long they are - we tested documents up to 5000px long/500px wide. There are many other tweaks as well, including lazy evaluation of embedded videos so they don't block the page display.

## Thumbnail Grouping

The thumbnail bar now automatically groups pages if the `thumbnailGrouping` setting is enabled - this is great for magazines and content that is optimized for two-page-display.

## Colored Outlines

Outline elements defined in the PDF can contain font and color information. We now correctly parse and display such informations to ensure your document is displayed just as it would be in Acrobat.

## Indexed Full-Text-Search Preview

`PSPDFLibrary` now allows you to preview text based on the FTS index.

## Annotations

Annotation hit testing now works on paths directly, which allows better selection in cases where multiple annotations are overlaid. Chances it simply does "the right thing" are a lot higher now. There's also a new dialog which asks for the default username so we correctly can write this when storing data in the PDF. We try hard to pick a useful default, but you can of course customize or disable this.

## Clouds &amp; Callouts

We support cloud annotation borders. There's no UI to create them yet, but documents which are configured to render clouds will correctly display in PSPDFKit as well. Callouts are a special subtype of free text annotations, and we support them now as well.

## Digital Signatures

The API around digital signatures has been completely updated, the new architecture allows connecting external PKI hardware for the signing process.

## Details, Details, Details

Many UI widgets have been updated to support the new iOS 8 keyboards with non-standard heights. Sharing content via iMessage is now built-in. Embedded videos are now autostarted if this is configured in the PDF (we support the ActivationContext settings now for RichMedia objects). And there are a ton of performance improvements and of course many bug fixes.
