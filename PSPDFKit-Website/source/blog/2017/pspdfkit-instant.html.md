---
title: "Synchronizing Documents with PSPDFKit Instant"
preview_image: /images/blog/2017/pspdfkit-instant/instant-hero.png
section: blog
author:
  - Martin Schürrer
author_url:
  - https://twitter.com/msch
date: 2017-07-25 15:00 UTC
tags: Instant, New Release, Products
published: true
---

Nowadays people work from multiple devices expecting their data to be available everywhere. Teams need to be able to collaborate no matter where their members are located and what devices they are using.  App developers need to provide their users with a unified experience to collaborate across all platforms. Designing such a system is challenging: Users expect it to be fast, reliable and secure. It should “just work”.

READMORE

**See also our follow-up: [Instant Layers — Multiple Users Annotate One Document](/blog/2018/instant-layers/)**

## Introducing PSPDFKit Instant

To help you tackle these challenges, we are launching our real-time document synchronization solution, [PSPDFKit Instant](/instant). Instant lets your users seamlessly share and annotate PDF documents across all devices and platforms they use. It integrates with PSPDFKit on Android, iOS and Web and is designed to be self-hosted, so you retain complete control over your data and infrastructure.

<img title="Instant" width="100%" src="/images/blog/2017/pspdfkit-instant/instant-hero.png">

Our goal with Instant was to deliver a phenomenal user experience for collaboration and document management while creating a simple product for you to use and integrate. Over the years, we’ve helped many of our customers build solutions specific to their needs. While each of their needs were unique, they all shared common requirements. We learned from all the existing projects we saw and designed a fast, reliable sync engine. We are confident Instant will help meet your needs as well.

## Key Features

Let's take a look at PSPDFKit Instant's key features:

- **Self-Hosted**: You keep complete control over your data because Instant runs 100% on your own infrastructure.
- **Secure Authentication**: Clients authenticate using industry-standard [JWT tokens](/guides/server/current/pspdfkit-server/client-authentication/) ensuring they only have access to documents they are authorized for.
- **Real-Time Collaboration**: PDF documents and annotations sync instantly across PSPDFKit-powered apps on Android and iOS devices as well as web browsers.
- **Incremental Synchronization**: By only synchronizing changes instead of the whole document, we make sure even large PDF files with many annotations are supported.
- **Easy Integration**: PSPDFKit Server provides a straight-forward [JSON-based API](/guides/server/current/api/overview/) for your backend.
- **Flexible Deployment**: We deliver a [Docker container](/guides/server/current/deployment/getting-started/), which can be deployed to AWS, Azure, Google Cloud or your in-house server infrastructure.

Instant consists of two parts: the PSPDFKit Server backend that synchronizes documents and annotations as well as manages authentication; and the mobile and web frameworks that integrate into your app.

The frameworks for iOS, Android, and Web connect your app to PSPDFKit Server, which is delivered in a Docker container for easy and flexible integration with your existing infrastructure. Your backend uses the server's JSON-based API to manage documents and annotations.

Enabling Instant is a simple matter of adding the framework to your PSPDFKit-powered app and connecting it to the PSPDFKit Server backend. Instant will sync documents and annotations between devices. Read more about how Instant works in detail [in our guides](/guides/ios/current/pspdfkit-instant/overview/).

<video src="/images/blog/2017/pspdfkit-instant/instant.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

You can try Instant yourself right now: Make sure you have the latest version of our PDF Viewer app installed on your [Android](https://pdfviewer.io/store-android) or [iOS](https://pdfviewer.io/store-ios) device and then visit the [Instant demo page](/instant/demo/) in your desktop browser.

Wondering whether Instant is for you? [Let us know](mailto:support@pspdfkit.com) about your project requirements and we'll explore how we can help you.
