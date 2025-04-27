---
title: "PSPDFKit 5.3 for iOS and Beyond"
description: PSPDFKit 5.3 for iOS includes customizable color picker, new display settings, and other features!
section: blog

author:
  - Peter Steinberger
  - Matej Bukovinski
author_url:
  - https://twitter.com/steipete
  - https://twitter.com/bukovinski
date: 2016-06-08 15:00 UTC
tags: iOS, Features, Releases, Products
published: true
---

It's been a while since we last talked about feature improvements to our iOS SDK. The last major feature was the release of the [Document Editor](/blog/2016/the-document-editor/) component, which was part of PSPDFKit [5.3.0](/changelog/ios/#5.3.0). The Document Editor was a major undertaking and collaboration between our iOS, Android and Core teams. We haven't slowed down at all since then and just recently shipped version [5.3.8](/changelog/ios/#5.3.8).
READMORE

## Versioning

Our aim is to always have a shippable master branch for all platforms and [then ship releases every 2 weeks](/changelog/ios/). We want to be extremely responsive on [support](/support/request) and fix small issues as fast as we can write test cases for them. At the same time, we always seek to have the "big picture" in mind and plan ahead for bigger features. We've become pretty good at that pattern now.

One of our goals for upcoming releases is to improve API stability between patch releases. To facilitate this we started deferring some changes to scheduled major and minor releases and providing more deprecation warnings for modified or removed API. We still have room to improve here in the future. It's particularly hard for API that had a bug before. In most cases, we aim to provide deprecations for breaking changes, however there are a few exceptions - e.g. if the API should never have been called manually or was unsafe. Subclassing hooks are explicitly excluded from this rule. They might change with any version update, so always check these when you have an exceptionally deep integration.

## New Features

Since 5.3.0 shipped, many great new features have made it into the SDK:

### Display Settings

We shipped a brand-new [`PSPDFSettingsViewController`] that contains the most common user settings in a convenient new control, so you don't have to build one yourself. The settings controller also replaces the [`PSPDFBrightnessViewController`] and adds additional scroll direction and page transition settings.

![](/images/blog/2016/pspdfkit-5-3-beyond/settings-controller.gif)

### Customizable Color Picker

We've made the color picker [extensible and easier to customize](/guides/ios/current/customizing-the-interface/custom-color-picker/). This was something that took a while to get right and we hope we found an approach that offers a good mix between customizability and API footprint.

![](/images/blog/2016/pspdfkit-5-3-beyond/custom-color-picker.gif)

Notice the screaming colors - this is not our default color set. You can check out `CustomColorPickersExample.swift` for more details.

### Creating & Processing Documents

[`PSPDFProcessor`] learned a few new tricks, such as the ability to [scale documents](/guides/ios/current/features/document-processing/). We improved [`PSPDFProcessorConfiguration`] to work better with Swift and exposed the crop box and media box rects on `PSPDFPageInfo`. Due to popular demand, we introduced a convenient way to [create documents from scratch](/guides/ios/current/features/document-creation/). Converting images to PDF is now also easier than ever. [`PSPDFNewPageConfigurationBuilder`] has a few additional properties like [`pageMargins`] that even allows advanced options like adding whitespace around an image.

### Sharing Documents

Documents now support additional sharing activities (e.g. Facebook, Twitter and Weibo). Typically, these activities don't support PDF files, so we instead provide them with an image of the PDF cover page. If you would like to use these, please note that you need to edit [`excludedActivityTypes`] in [`PSPDFConfiguration`], as they are excluded by default. On a related note, we also extended PDF document sharing to native activities like Mail and Messages. When specifying the new [`PSPDFDocumentSharingOptionImage`] option, the sharing selector will now show an option to toggle between sharing the document as pdf or an image. We also added a new delegate - `documentSharingViewController:willShareFiles:`. It can be used to rename files and thereby have even more control over the sharing flow without having to rewrite the whole control from scratch.

![](/images/blog/2016/pspdfkit-5-3-beyond/facebook-sharing.gif)

### Form Highlights

The form highlight color can now be customized via [`PSPDFRenderInteractiveFormFillColorKey`] in the document [`renderOptions`]. We added a new `FormHighlightExample.swift` sample that shows how this can be used to build a toggle to enable/disable form highlighting in just a few lines of code.

![](/images/blog/2016/pspdfkit-5-3-beyond/form-highlight-toggle.gif)

### Details

We added a new file watcher that will warn you if a PDF that is currently displayed is written to by another part of the document. Previously, such action could have led to data loss but now we are more explicit and helpful when your application logic attempts to do something like this. We added logic that automatically stops sound annotations after a given amount of time to ensure that you never run out of memory (see [`soundAnnotationTimeLimit`]). We added various new samples such as `AspectRatioConservingResizingExample.swift` to show how certain more complex parts, like the resize controls, can be customized. Of course, we fixed many bugs and even added helpful log messages when the framework is misconfigured to save you precious time.

## What's Next

Next week Apple will put on its yearly Developer Conference and we were lucky enough to get 5 tickets from the lottery. We've already prepared a long list of questions for the engineers there. They already know us fairly well as [we're pretty meticulous at writing bug reports](/blog/2015/presentation-controllers/). You can expect PSPDFKit 5.4 for iOS to be released some time at the end of June. Our plan is to ship initial fixes for iOS 10 Beta and various other small improvements with it.

### Core Annotations

Core Annotations is a project that we started in January. The idea is that iOS and Android should have a unified data model based on our existing [cross-platform approach](/blog/2016/a-pragmatic-approach-to-cross-platform/). We already share a lot of code between our platforms, however Annotations & Forms on iOS are still special. They are very complex with many edge cases and we wanted to be conservative to ensure that we do not ever lose user data. Android, as of the 2.4 release, is already shipping with Core Annotations and we just merged the first major part on iOS - parsing is now done completely in C++ and shared with Android. Since we've started working on [other platforms](/web/) as well, this has become increasingly more important. There's still a bunch of work to be done to migrate forms and eventually have the core handle everything. We aim to complete this transition with PSPDFKit 6 for iOS in September.

### OpenSSL

The iOS version of our SDK requires OpenSSL to parse Digital Signatures. We're constantly updating this library and are [very careful and security-conscious in our approach](/guides/ios/current/faq/sdk-security/). While OpenSSL is widely used, it also has a lot of old code and not the best track record in terms of security. We currently ship with [OpenSSL 1.0.2h](https://www.openssl.org/). While none of the security fixes so far affected the parts of OpenSSL that we use, it's still a potential vector and we're actively working on replacing this with a smaller, better-tailored security library. We're deliberately going very slow and as careful as possible on this migration and hope to finish it in PSPDFKit 6 as well. Another great benefit of this process is that it will help with 3rd-party integrations like MobileIron or GOOD that ship with their own versions of OpenSSL and traditionally have had bugs when multiple library versions collide. Another major plus of the migration is that it will help us to [reduce the SDK size](/guides/ios/current/faq/framework-size).

### PSPDF Instant

It's now over 1.5 years since we started working on a solution to [seamlessly sync annotations in real time](/instant/) across different devices and platforms. Turns out, syncing is hard, and we've been [taking](/blog/2016/testing-http-apis-in-elixir/) our time to get things right. We're now at a stage where things work great and plan to release the `PSPDFInstant.framework` in Q4 of this year. PSPDFKit v6 will be fully ready and Instant-aware to make the integration seemless. We're also working on a version for Android that will be available in 2017.

### Guides & Documentation

There has been a lot of work around documenting all parts of PSPDFKit, for both iOS and Android. Our [guides website](/guides/ios/current/) is now even versioned. Sample code now additionally includes Swift ([and Kotlin on the Android side](/blog/2016/kotlin-ready-online-guides/)), and we made our [API documentation searchable](/blog/2016/adding-live-search-to-jazzy/) and added [Swift variants](/api/ios/Classes/PSPDFDocument.html#/c:objc(cs)PSPDFDocument(py)files). There's also been a lot of details to improve PSPDFCatalog and make it even easier to find the part you're looking for.

### Roadmap

There's a ton more that we have planned for the rest of this year and next year. One of the things on our horizon is to talk about some of the lessons we learned while building [PSPDFKit for Web](/web), another post could include our very first App Store app... so - stay tuned!

[`PSPDFSettingsViewController`]: https://pspdfkit.com/api/ios/Classes/PSPDFSettingsViewController.html
[`PSPDFBrightnessViewController`]: https://pspdfkit.com/api/ios/Classes/PSPDFBrightnessViewController.html
[`PSPDFProcessor`]: https://pspdfkit.com/api/ios/Classes/PSPDFProcessor.html
[`PSPDFProcessorConfiguration`]: https://pspdfkit.com/api/ios/Classes/PSPDFProcessorConfiguration.html
[`PSPDFNewPageConfigurationBuilder`]: https://pspdfkit.com/api/ios/Classes/PSPDFNewPageConfigurationBuilder.html
[`pageMargins`]: https://pspdfkit.com/api/ios/Classes/PSPDFNewPageConfigurationBuilder.html#/c:objc(cs)PSPDFNewPageConfigurationBuilder(py)pageMargins
[`PSPDFDocumentSharingOptionImage`]: https://pspdfkit.com/api/ios/Other%20Enums.html#/c:@E@PSPDFDocumentSharingOptions
[`PSPDFRenderInteractiveFormFillColorKey`]: https://pspdfkit.com/api/ios/Other%20Constants.html#/c:@PSPDFRenderInteractiveFormFillColorKey
[`renderOptions`]: https://pspdfkit.com/api/ios/Classes/PSPDFDocument.html#/c:objc(cs)PSPDFDocument(py)renderOptions
[`soundAnnotationTimeLimit`]: https://pspdfkit.com/api/ios/Classes/PSPDFConfiguration.html#/c:objc(cs)PSPDFConfiguration(py)soundAnnotationTimeLimit
[`excludedActivityTypes`]: https://pspdfkit.com/api/ios/Classes/PSPDFConfiguration.html#/c:objc(cs)PSPDFConfiguration(py)excludedActivityTypes
[`PSPDFConfiguration`]: https://pspdfkit.com/api/ios/Classes/PSPDFConfiguration.html
