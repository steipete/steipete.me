---
title: "Introducing PDFXKit - A Drop-in Replacement for PDFKit"
section: blog
bodyclass: blog
preview_image: /images/blog/2017/pdfxkit/pdfxkit.png
author:
  - Konstantin Bender
  - Peter Steinberger
author_url:
  - https://twitter.com/konstantinbe
  - https://twitter.com/steipete
date: 2017-09-07 12:00 UTC
tags: iOS, Products
published: true
---

Today, we are open sourcing [PDFXKit](https://github.com/PSPDFKit/PDFXKit), a drop-in replacement for
[Apple's PDFKit](https://developer.apple.com/documentation/pdfkit) that uses our industry-proven [PSPDFKit](http://pspdfkit.com) SDK under the hood.

<video src="/images/blog/2017/pdfxkit/pdfxkit.mp4" width="100%" style="padding-bottom: 15px;" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

[Apple's PDFKit](https://developer.apple.com/documentation/pdfkit) provides a great starting point if you need to incorporate PDF
support into your macOS or iOS 11 app. It is a system library and as such very easy to integrate.

Our frameworks on the other hand go much further. With PSPDFKit, you get a drop-in solution with a [superior](/pdf-sdk/ios/annotations/) [feature](/pdf-sdk/ios/document-editor/) [set](/instant/), far greater customization options, and consistent high-fidelity rendering on all major platforms. This becomes even more important once you’ve added our [Instant SDK for document syncing and collaboration.](/instant/) Yet, the most important aspect for some is our fast & efficient technical support.

READMORE

## History of Apple's PDFKit

In iOS 11, Apple ported PDFKit to iOS, which has been [available on macOS since OS X 10.4 Tiger](http://appleinsider.com/articles/04/08/10/mac_os_x_tiger_to_add_opengl_enhancements_pdf_kit_sqlite). The API hasn’t changed much over the past 12 years.

In macOS 10.12 Sierra, Apple resumed work and refactored PDFKit, [breaking many existing applications in the process.](https://mjtsai.com/blog/2016/12/21/more-macos-preview-pdf-trouble/) To help companies struggling with these changes, [we released PSPDFKit for macOS](/blog/2017/pspdfkit-for-macos/) earlier this year.

Many of these issues have been addressed in the upcoming macOS High Sierra release. However, PSPDFKit has been constantly developed for the past 8 years and is actively supported by a [40-person team](/careers). We are not bound to Apple's yearly release cycles, [which allows us to deliver shorter turn-around times on issues](/changelog/ios/).

## Easy Transition with PDFXKit

If your app is already using PDFKit, migrating the full code base to PSPDFKit can be a major undertaking. This is where PDFXKit comes in. It is a drop-in replacement giving you the same API as PDFKit while using PSPDFKit under the hood - with [only a few tweaks](https://github.com/pspdfkit/pdfxkit#switch-to-pdfxkit) required.

Apple’s PDFKit is only available with iOS 11 while PDFXKit and PSPDFKit **support iOS 9 and later**. PDFXKit enables you to use your existing PDFKit integration code as-is while allowing your app to support earlier versions of iOS.

Lastly, PDFXKit gives you **full access to the underlying PSPDFKit framework** allowing you to take advantage of all of the PSPDFKit features, components, and tools if and when you need them.

PDFXKit doesn’t cover the whole PDFKit API yet and is technically in beta stage. However, it does cover the basics.
By releasing early, we are confident this will speed up development and improve the quality of the API through the power of open source.

If you are experiencing a problem with PDFKit right now, or if you are just not sure if migrating from PDFKit to PSPDFKit would be the right step for your app, just give it a try or [ping us on support](/support/request)! Our evaluation version is free and [you can download it right here.](/try/)

PDFXKit can be integrated [manually or via CocoaPods/Carthage](https://github.com/PSPDFKit/PDFXKit).
Visit the [PDFXKit GitHub page](https://github.com/PSPDFKit/PDFXKit) as well as our
[*Migrating from Apple PDFKit*](/guides/ios/current/migration-guides/migrating-from-apple-pdfkit/)
guide to learn more.
