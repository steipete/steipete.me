---
title: "Introducing PSPDFKit for Mac Catalyst"
description: "Port your iOS apps to macOS with PSPDFKit for Mac Catalyst."
preview_image: /images/blog/2019/pspdfkit-for-mac-catalyst/article-header.png
section: blog
author:
  - Peter Steinberger
author_url:
  - https://twitter.com/steipete
date: 2019-09-19 9:00 UTC
tags: Products
published: true
---

Two years after we launched [PSPDFKit for macOS][], we’re excited to be releasing a new framework for the Mac with PSPDFKit for Mac Catalyst. Catalyst is a new technology first introduced in macOS 10.15 Catalina. It makes it easy to port existing, complex iOS apps to the Mac with minimal cost. Unlike our existing macOS SDK, the new Catalyst SDK includes the complete iOS user interface that you know and love.

We were able to get our Catalyst SDK ready ahead of the macOS Catalina launch, thanks to some spelunking we did in macOS 10.14 Mojave, which is where Apple first mentioned this technology under the code name [Marzipan][].

## What Is Mac Catalyst?

Mac Catalyst — also known publicly as iPad Apps for Mac — is a new technology from Apple that makes it [incredibly simple to start building a native Mac app based on your current iPad app][ipad apps for mac]. Apple started working on this technology in macOS 10.14 Mojave and made it accessible to everyone with macOS 10.15 Catalina this year. Catalyst apps will run on macOS 10.15 and higher and can be released both via the Mac App Store or simply by sharing an optionally [notarized binary][]. If you need a Mac app that runs on older releases, we recommend [PSPDFKit for Electron][] or [PSPDFKit for macOS][].

![PDF Viewer for Mac Catalyst](/images/blog/2019/pspdfkit-for-mac-catalyst/pdf_viewer_mac.jpg)

## Features

We were able to port the vast majority of our iOS feature set to the Mac. We optimized many of these to better fit on the Mac, including making it easier to add document info views as a sidebar, and allowing PSPDFKit to manage the window title based on the document title.

Text selection in PDFs can be a challenge due to the graphical nature of the format. Often paragraph structure needs to be inferred from glyph positions, since this is the only information that is available. That said, we updated our text selection user interaction to better fit on the Mac. It’s immediate and precise, as you’d expect when using a mouse as an input device.

Another aspect of mouse interaction is hovering. There’s nothing like this with a touchscreen, but on the Mac, hovering provides the user with hints about which elements on the screen are interactive. So we added support for showing the text selection I-beam when hovering over text and the hand cursor when hovering over a link.

We also implemented some features that benefit both iOS 13 and Mac Catalyst, including support for multiple windows and Dark Mode. We still have quite a few ideas and are committed to further improving our Mac Catalyst SDK.

## PDF Viewer for Mac

In order to properly test our new Mac Catalyst PDF SDK, we decided to bring [PDF Viewer][] to the Mac. The app is scheduled to be available in the Mac App Store once macOS Catalina becomes available. Working on PDF Viewer helped us identify and fix many issues in the Mac Catalyst SDK, so integration should be as smooth as possible for you once you start adopting PSPDFKit for Mac Catalyst.

![PDF Viewer for Mac Catalyst Fullscreen](/images/blog/2019/pspdfkit-for-mac-catalyst/pdf_viewer_mac_2.jpg)

## Conclusion

It’s been quite a ride to get this product out in time! We would like to extend our thanks to both our customers, who helped us beta test our builds, and the many awesome folks at Apple who provided additional insight and guidance to get this SDK ready.

We are committed to continue iterating on our Mac Catalyst support in future updates, so please keep an eye on future announcements in both our release blog posts and the product changelog.

PSPDFKit for Mac Catalyst is a new product and requires a separate license. Download your [free trial][] today and contact our [support][] and [sales][] teams once you’re ready or if you need additional help.

[pspdfkit for macos]: /blog/2017/pspdfkit-for-macos/
[pspdfkit for electron]: /electron
[marzipan]: /blog/2018/porting-ios-apps-to-mac-marzipan-iosmac-uikit-appkit/
[ipad apps for mac]: https://developer.apple.com/ipad-apps-for-mac/
[pdf viewer]: https://pdfviewer.io
[notarized binary]: https://developer.apple.com/documentation/security/notarizing_your_app_before_distribution
[support]: /support/request/
[sales]: /sales/
[free trial]: /try/
