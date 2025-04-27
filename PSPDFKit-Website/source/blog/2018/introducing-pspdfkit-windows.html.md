---
title: "Introducing PSPDFKit for Windows"
description: Introducing PSPDFKit for the Universal Windows Platform (UWP).
preview_image: /images/blog/2018/pspdfkit-windows-1-0/windows-1-0-header.png
section: blog
author:
  - Peter Steinberger
author_url:
  - https://twitter.com/steipete
date: 2018-02-15 12:00 UTC
tags: Windows, Products, Development
published: true
---

It’s always exciting to launch a new product, and today’s is a big one for us: We’re bringing [the power of PSPDFKit to Windows][Windows Website]!

After releasing our iOS SDK in 2011 and Android SDK in 2014, expanding to Web in 2016, and adding a WebAssembly version in 2017, we’re closing the final gap on platforms with our Windows release. Add awesome, fast PDF-editing features to your native apps within minutes, compatible with Microsoft’s Surface Tablet and any PC running Windows 10.

READMORE

[![PSPDFKit 1.0 for Windows](/images/blog/2018/pspdfkit-windows-1-0/windows-1-0-header.png)][Windows Website]

## The Universal Windows Platform (UWP)

After carefully looking at the market, we decided to base the Windows version of PSPDFKit on UWP. Windows has historically used the WIN32 API, and with Windows 10, Microsoft introduced UWP as a new software architecture that allows development of universal apps that run on Windows 10, Windows 10 Mobile, Xbox One, and even HoloLens. It supports Windows app development using C++, C#, VB.NET, and XAML.

![](/images/pdf-sdk/windows/hero.png)

PSPDFKit for Windows comes fully packaged as a plugin for Visual Studio 2017 (VSIX), including support for Visual Designer. We designed it to be [really easy to integrate](/guides/windows/current/getting-started/integrating-pspdfkit/), and we even included an example catalog.

Additionally, PSPDFKit is *fully compatible with the Microsoft Store* and only uses APIs that have been approved for Store usage.

If you’re still on WIN32, Microsoft offers [Desktop Bridge](https://developer.microsoft.com/en-us/windows/bridges/desktop) to ease conversion to the future UWP model. For companies using [Electron](/guides/web/current/other-languages/electron/) as a cross-platform app platform, we’ll soon have a solution for that as well.

## Hybrid Architecture

In PSPDFKit for Windows, we deliver a fluid, adaptable UI — based on fast Edge web technology — ready to go out of the box. This makes [UI customization extremely easy](/guides/web/current/customizing-the-interface/css-customization/) — we’ve even [documented how we built the default style for the Windows SDK](/blog/2018/theming-pspdfkit-for-web/).

![](/images/pdf-sdk/windows/architecture.svg)

Rendering and parsing is handled natively via our [rock-solid cross-platform engine](/blog/2016/a-pragmatic-approach-to-cross-platform/) to guarantee optimal performance. This hybrid approach ensures that we can easily deliver the same mature PDF core library that powers our other frameworks to Windows, providing you with the newest features in a Windows-friendly package.

## Feature-Rich UWP PDF SDK

Don’t be fooled by the version number — PSPDFKit for Windows comes with a large set of features, including the ability to:

* View documents using a variety of presentation modes, such as double-page rendering.
* Annotate documents easily with highlighting, freehand drawing, and notes.
* Edit annotations — move, scale, or change the color as you like.
* Handle mouse and touch events — ready for the Microsoft Surface Tablet.
* Search quickly with intuitive keyboard shortcuts for power users.
* Read, update, and submit PDF forms. Forms can be filled out programmatically, submitted to a server, or saved back to the file as form data or flattened, non-editable text.

You can read more about all of the features on the [Windows SDK product page](/pdf-sdk/windows/).

## React Native for Windows Support

PSPDFKit for Windows comes with full support for React Native! This makes it very easy to add PDF support to your React Native Windows UWP app. See [our open source GitHub repository](https://github.com/PSPDFKit/react-native#windows-uwp) for further details.

We have a lot in store for the year as we work to make our new UWP PDF SDK even better. Instant annotation sync capabilities, image annotations, and digital signatures are all on our roadmap for 2018. We’re just getting started.

[Visit the Windows SDK page][Windows Website] or head right over [to the documentation](/guides/windows/current/getting-started/integrating-pspdfkit/) to learn more.

[Windows Website]: /windows
[Windows 1.0 Changelog]: /changelog/windows/#1.0.0
