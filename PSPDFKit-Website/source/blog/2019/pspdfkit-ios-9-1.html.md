---
title: "PSPDFKit 9.1 for iOS"
description: "Introducing PSPDFKit 9.1 for iOS — featuring improved Image Documents, better Mac Catalyst support, and extended appearance customization options."
preview_image: /images/blog/2019/pspdfkit-ios-9-1/article-header.png
preview_video: /images/blog/2019/pspdfkit-ios-9-1/article-header.mp4
section: blog
author:
  - Matej Bukovinski
author_url:
  - https://twitter.com/bukovinski
date: 2019-12-05 14:35 UTC
tags: iOS, Development, Products
published: true
---

After our big version 9 update, we decided to switch gears and spend a few weeks focusing on stability, polish, and smaller enhancements throughout our SDK. Today’s release of PSPDFKit 9.1 for iOS — along with the 9.0.x patch releases leading up to it — is the direct result of this effort. In this blog post, I want to highlight some of the main groups of improvements we made in 9.1 and the patch releases. These include some additions to our Image Documents component, enhancements to our Mac Catalyst product, and better UI appearance customization options.

READMORE

## Image Documents

<img src="/images/blog/2019/pspdfkit-ios-9-1/image-documents.png" srcset="/images/blog/2019/pspdfkit-ios-9-1/image-documents@2x.png 2x" alt="Image Documents Header" >

Image Documents, [first introduced in PSPDFKit 7.6 for iOS][image documents into post], is a PSPDFKit [component][image documents landing page] that extends PSPDFKit’s PDF viewing and editing abilities to JPEG and PNG images. While image documents could generally be handled as normal PSPDFKit PDF documents when loaded, they didn’t have the same flexibility when it came to initialization and data storage. And while PDF documents could be initialized with arbitrary data providers, such as in-memory data blobs, image documents needed to be backed by files on disk. With 9.1, we lifted this restriction and added new APIs to allow initialization with arbitrary data providers. This will enable advanced use cases, such as custom data encryption schemes and database-backed documents, for our customers.

Another limitation of image documents was related to transparent images: Transparency in PNG images was lost after annotating with PSPDFKit. We’re happy to announce that this limitation no longer exists with PSPDFKit 9.1 for iOS.

## Mac Catalyst

<img src="/images/blog/2019/pspdfkit-ios-9-1/mac-catalyst.png" srcset="/images/blog/2019/pspdfkit-ios-9-1/mac-catalyst@2x.png 2x" alt="Mac Catalyst Header" >

Mac Catalyst is the newest addition to our SDK offering for Apple platforms, and it was [introduced][catalyst blog post] just over a month ago alongside [PSPDFKit 9 for iOS][pspdfkit 9 for ios blog post]. Our goal with Mac Catalyst is to bring our existing iOS UI as close as possible to the native AppKit look and feel, without having to sacrifice the convenience of using a single API for iOS and macOS. With this update, we made several enhancements that bring us closer to this goal.

One of the main changes we made was removing our AppKit support bundle to minimize the chance of bundle identifier conflicts and other inconveniences during app distribution. Our AppKit customizations are now performed transparently at runtime, without the need to load a separate bundle. We also focused on the UI and made several tweaks to ensure it fits in nicely among other Mac apps.

One such addition is that of properly respecting the selected system accent and the selection colors. To make navigation easier, we improved our support for keyboard shortcuts. Examples of this are the spacebar key, which will now more consistently and precisely scroll the document viewport, and a new feature for quickly jumping to a PDF page using the ⌘ ⌥ G shortcut. We also fixed several smaller issues — most importantly, some rendering issues during window resizing and some issues with document sharing.

## Appearance Customization

<img src="/images/blog/2019/pspdfkit-ios-9-1/appearance-customization.png" srcset="/images/blog/2019/pspdfkit-ios-9-1/appearance-customization@2x.png 2x" alt="Appearance Customization Header" >

iOS 13 brought with it several new options for UI customization, including the new [system materials][], new [appearance APIs][] for system navigation bars and toolbars, and some [Dark Mode][]-specific customization options. The PSPDFKit for iOS UI was designed with the goal of supporting the most common customization options — such as the tint color, bar colors, and materials — out of the box, without requiring dedicated UI styling code.

With this update, this automatic behavior in PSPDFKit extends to the aforementioned iOS 13-specific styling additions. This can be seen in the annotation toolbar and scrubber bar, as well as the inspector UI, which now correctly reflects bar colors on iOS 13. We also added new APIs to our own classes to match the new system options and allow manual overrides of the default styling. These include the `standardAppearance` and `compactAppearance` properties now found on classes such as [`PSPDFToolbar`][] and [`PSPDFScrubberBar`][].

## More Details

As always, this release also includes many more miscellaneous enhancements and fixes. For starters, we managed to shave off a few tedious steps from the [manual framework integration][manual integration guide] option by leveraging the new `.xcfilelist` feature in Xcode when integrating debugging symbols. We also took some time to audit our Catalog app, making sure examples are well organized and easier to find, both in Xcode and in the file system.

On the UI side, the security part of the document info view was separated out into a new item in the main segmented control, making navigating to it more convenient. We also tweaked the touch handling code on our scrubber bar. This is now based on gesture recognizers, which ensures there are fewer gesture conflicts with built-in system gestures. Finally, our inspector also gained a great new ability: It can now change properties on multiple selected annotations if they are of the same type.

To see a complete list of changes, check out the [PSPDFKit 9.1 for iOS changelog][ios 9.1 changelog].

[ios 9.1 changelog]: /changelog/ios/#9.1.0
[image documents into post]: /blog/2018/image-documents/
[image documents landing page]: https://pspdfkit.com/pdf-sdk/ios/image-documents/
[catalyst blog post]: https://pspdfkit.com/blog/2019/pspdfkit-for-mac-catalyst/
[pspdfkit 9 for ios blog post]: https://pspdfkit.com/blog/2019/pspdfkit-ios-9/
[system materials]: https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/materials/
[appearance apis]: https://developer.apple.com/documentation/uikit/uinavigationbar/3198028-standardappearance
[dark mode]: https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/dark-mode/
[`pspdftoolbar`]: https://pspdfkit.com/api/ios/Classes/PSPDFToolbar.html
[`pspdfscrubberbar`]: https://pspdfkit.com/api/ios/Classes/PSPDFScrubberBar.html
[manual integration guide]: https://pspdfkit.com/guides/ios/current/getting-started/integrating-pspdfkit/
