---
title: "PSPDFKit 9 for iOS"
description: PSPDFKit 9 for iOS introduces Mac Catalyst support, as well as many great new iOS 13 features such as native Dark Mode and multi-window support.
preview_image: /images/blog/2019/pspdfkit-ios-9/header.png
preview_video: /images/blog/2019/pspdfkit-ios-9/header.mp4
section: blog
author:
  - Matej Bukovinski
author_url:
  - https://twitter.com/bukovinski
date: 2019-09-19 08:00 UTC
tags: iOS, Development, Products
published: true
---

Today we’re releasing PSPDFKit 9 for iOS, our major SDK update for 2019. Version 9 brings our complete user interface to the Mac for apps using Apple’s Project Catalyst. It also introduces many great new iOS 13 features, including systemwide dark mode, multi-window support in our tabbed UI, Swift UI examples, and many other smaller tweaks. At the same time, PSPDFKit 9 retains compatibility with iOS 11 and 12. The release was compiled with Xcode 11, which enabled us to integrate our [Swift wrappers][] directly into the main binary distribution. As with every major update, we also took some time to improve our APIs and clean up deprecations. The release comes with a [migration guide][] that covers all the changes.

READMORE

## Mac Catalyst

We were thrilled to see Apple announce iPad Apps for Mac during last year’s WWDC. We [immediately started experimenting][marzipan blog post] with what was called Project Marzipan at the time, and we kept at it throughout the past year. Project Marzipan became public this year as Mac Catalyst, and we’re excited to be able to offer initial support for this exciting new platform with PSPDFKit 9 through our new `xcframework` distribution.

To learn more about PSPDFKit for Mac Catalyst, check out the separate [announcement blog post][mac catalyst blog post] and be sure to download [PDF Viewer for Mac][pdf viewer] to see the framework in action once it becomes available in the Mac App Store later next month.

To ensure compatibility with Mac Catalyst, we are now distributing `PSPDFKit` and `PSPDFKitUI` in the new `xcframework` format. Updating from the previous frameworks is a simple process and is covered in detail in our [migration guide][].

![PDF Viewer for Mac Catalyst](/images/blog/2019/pspdfkit-ios-9/pdf_viewer_mac.jpg)

## Dark Mode

PSPDFKit for iOS has long supported a built-in special [dark interface style][appearance mode guide] via a custom solution based on `UIAppearance`. This, together with a custom [inverted page rendering mode][color-correct night mode], made reading documents easy on the eyes in dark environments, such as in an airplane cockpit at night. While our dark interface covered the basics, it was by no means complete, as some screens still appeared in their normal light style.

iOS 13 introduces a new dark interface setting that is applied throughout the system. PSPDFKit 9 fully adopts Dark Mode in our user interface, even on views that did not previously support the dark interface style. This enhanced Dark Mode support replaces our previous solution on both iOS 13 and Mac Catalyst. The user interface will now honor the system interface style automatically, while the page rendering style can still be switched separately — either programmatically, or through the built-in settings UI.

Dark Mode is propagated throughout iOS applications with a special trait collection property: [`userInterfaceStyle`][userinterfacestyle]. PSPDFKit inherits this from its host application and honors its setting, ensuring a unified look is maintained.

<video src="/images/blog/2019/pspdfkit-ios-9/dark_mode.mp4"
 poster="/images/blog/2019/pspdfkit-ios-9/dark_mode.png"
 width="100%"
 data-controller="video"
 data-video-autoplay="true"
 controls
 playsinline
 loop
 muted>
</video>

## Multiple Windows

With iOS 13, Apple is taking a big leap forward in making the iPad an even more powerful productivity device. One of the biggest steps in this direction is that of the new multitasking features provided via support for multiple application windows. PSPDFKit 9 makes it easy to adopt multi-window support in your app through our tabbed view controller. The controller now uses system drag-and-drop gestures, which can be used to drag tabs out into new windows with minimal additional code on the host application side. You can see this in action by checking out `TabbedBarExample.swift` in `PSPDFCatalog`, as well as in the upcoming version of [PDF Viewer for iOS][pdf viewer].

<video src="/images/blog/2019/pspdfkit-ios-9/multi-window.mp4"
 poster="/images/blog/2019/pspdfkit-ios-9/multi-window.png"
 width="100%"
 data-controller="video"
 data-video-autoplay="true"
 controls
 playsinline
 loop
 muted>
</video>

## SwiftUI

![SwiftUI](/images/blog/2019/pspdfkit-ios-9/swiftui.png)

The biggest surprise in this year’s developer tools update was certainly the introduction of SwiftUI — an entirely new system UI framework. If you decided to be on the bleeding edge and adopted SwiftUI in your application, then good news: PSPDFKit can still be easily be integrated in your application. PSPDFKit 9 comes with a new SwiftUI Catalog example, `SwiftUIExample.swift`, which shows how this can be achieved. For more information, you can check out our [How to Show a PDF in SwiftUI][swiftui blog post] blog post.

## PSPDFKitSwift

![PSPDFKitSwift](/images/blog/2019/pspdfkit-ios-9/pspdfkitswift.png)

The binary distribution for PSPDFKit 9 was built as an `xcframework` with Xcode 11 and the Swift 5.1 compiler. The [ABI and module stability][] offered by the new Swift compiler version enabled us to integrate our Swift wrappers directly into the shipping binary instead of having to offer them separately through the [PSPDFKitSwift repository][swift wrappers]. With this change, we are deprecating PSPDFKitSwift as a standalone product, as we can now offer you great custom-tailored Swift APIs out of the box.

If you previously integrated [PSPDFKitSwift][swift wrappers] into your project, you can transition by upgrading PSPDFKit and simply deleting the PSPDFKitSwift integration. For more information, please check out the [migration guide][].

<div class="alert alert-warning">
<p><b>ℹ️ Note:</b> Since PSPDFKit now includes Swift code, be sure to enable <code>ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES</code> in your project if you don’t already use any Swift code in your application and are deploying to iOS 12.1 or earlier.</p>
</div>

## More Details

In addition to the changes covered above, this release also includes a large set of other smaller improvements and bug fixes. One of the more interesting ones is the new support for transparent PNG images in image and stamp annotations. On the model level, we upgraded all our main model classes that offer `NSCoding` to also support `NSSecureCoding`. Secure coding is now also used by default inside PSPDFKit for all newly created archives. In addition, the user interface received some tweaks. We refreshed the annotation toolbar design and adopted new contextual menus on iOS 13 to better show grouped annotation tools. We also updated the annotation toolbar and document editor icons so that they can be more easily distinguished from one another.

To see a complete list of changes, check out the [PSPDFKit 9 for iOS changelog][ios 9 changelog].

[ios 9 changelog]: /changelog/ios/#9.0.0
[migration guide]: /guides/ios/current/migration-guides/pspdfkit-9-migration-guide/
[swift wrappers]: https://github.com/PSPDFKit/PSPDFKitSwift
[abi and module stability]: https://swift.org/blog/abi-stability-and-more/
[marzipan blog post]: https://pspdfkit.com/blog/2018/porting-ios-apps-to-mac-marzipan-iosmac-uikit-appkit/
[mac catalyst blog post]: https://pspdfkit.com/blog/2019/pspdfkit-for-mac-catalyst/
[pdf viewer]: https://pdfviewer.io/
[swiftui blog post]: https://pspdfkit.com/blog/2019/how-to-show-a-pdf-in-swiftui/
[appearance mode guide]: https://pspdfkit.com/guides/ios/current/customizing-the-interface/appearance-mode-manager/
[color-correct night mode]: https://pspdfkit.com/blog/2018/color-correct-night-mode/
[userinterfacestyle]: https://developer.apple.com/documentation/uikit/uitraitcollection/1651063-userinterfacestyle
