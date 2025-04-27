---
title: "PSPDFKit 6 for iOS"
pubDate: 2016-09-23T12:00:00.000Z
description: "Today we're releasing <a href=\"/try\">PSPDFKit 6 for iOS</a>. It's fully optimized for Xcode 8 and iOS 10, comes with improved API for Swift 3, faster rendering, various fixes, and a visual refresh. These updates make it our best release so far. As usual, our versioning scheme supports the current and previous iOS versions. We fully support iOS 9, while also focusing on many new features that iOS 10 offers."
tags:
  - pspdfkit
source: pspdfkit.com
---

::ai[Today we're releasing <a href="/try">PSPDFKit 6 for iOS</a>. It's fully optimized for Xcode 8 and iOS 10, comes with improved API for Swift 3, faster rendering, various fixes, and a visual refresh. These updates make it our best release so far. As usual, our versioning scheme supports the current and previous iOS versions. We fully support iOS 9, while also focusing on many new features that iOS 10 offers.]

Today we're releasing <a href="/try">PSPDFKit 6 for iOS</a>. It's fully optimized for Xcode 8 and iOS 10, comes with improved API for Swift 3, faster rendering, various fixes, and a visual refresh. [These updates make it our best release so far](/changelog/ios/#6.0.0). As usual, our [versioning scheme](/guides/ios/current/announcements/version-support/) supports the current and previous iOS versions. We fully support iOS 9, while also focusing on many new features that iOS 10 offers.

If you're eager to update, head over to our [migration guide](/guides/ios/current/migration-guides/pspdfkit-60-migration-guide), which will take you through the necessary changes.

### Annotations and encryption

It's been a long time coming and with this release you can finally write into encrypted PDF documents (as long as you have the password, of course!). To make this possible, we had to completely re-engineer our parser and annotation writing logic. We're now using [a new core that is shared](/blog/2016/a-pragmatic-approach-to-cross-platform/) with our [Android](/features) and [Web SDK](/web/)s. This is great on so many levels. We applied everything we learned over the years and designed a much better component. Since it's all written in C++, parsing and writing is much faster than previous generations.

### Better bookmarks

Up until now, bookmarks were saved in a separate file that was stored on the device. While this worked great, they were not part of the document when people sent it via email or shared it with friends. We went the extra mile here and fixed this issue [in a way that is even compatible with Apple Preview](/blog/2016/just-a-simple-bookmark/). You don't have to do anything to see this change - bookmarks work like before, they're now just part of the document. There's also a better way to bookmark pages with a new configurable bookmark indicator button that can optionally be displayed over a page.

![Bookmarks](/images/blog/2016/pspdfkit-6-0/bookmark.png)

### iOS 10

The first iOS 10 only feature we're adopting is the new `UIFeedbackGenerator`. You can now get haptic feedback using the improved Taptic Engine inside the iPhone 7 and 7 Plus. We fully expect this awesome piece of technology will make its way into iPads eventually and our code will be ready for it. We've been conservative on adding feedback and have tried to follow Apple's lead here. You will feel feedback when using text selection, when changing pages using the scrubber bar and for a few other events.

### Keyboard shortcuts

External iPad keyboards are getting increasingly more popular, especially after the release of Apple's own Smart Keyboard. We've followed Apple's lead by improving our support for keyboard shortcuts. You can now easily flick through pages, select text, toggle the annotation toolbar, and activate search directly using only the keyboard. Our keyboard support has also improved under the hood, making it more reliable and prepared for future extensibility.

![Keyboard Shortcuts](/images/blog/2016/pspdfkit-6-0/keyboard.gif)

### API modernization and Swift 3

With Swift now at version 3, we took a hard look at our Objective-C API and identified spots that did not feel natural to use in Swift and refactored them. Apple added many features to allow APIs to map better to Swift while also being fully compatible with Objective-C. This release really shines because of those feature additions. We've also unified all variants of page to `pageIndex` to make it clear that it's a zero-based index.

### Render pipeline

The rendering and caching API received a significant overhaul. The rendering flow is now much more streamlined, predictable and efficient. If you are doing any sort of direct rendering then be sure to take a look at the new [`PSPDFRenderRequest`](/api/ios/Classes/PSPDFRenderRequest.html), [`PSPDFRenderTask`](/api/ios/Classes/PSPDFRenderTask.html) and [`PSPDFRenderQueue`](/api/ios/Classes/PSPDFRenderQueue.html). These will be your new best friends. We prepared a new [Rendering and Caching guide](/guides/ios/current/getting-started/rendering-pdf-pages#rendering-and-caching), which should serve as a great introduction to those just getting started with rendering or need to better understand what changed.

### Less magic

We've removed the `PSPDFPlugin` infrastructure since it did not interact well with Swift. We opted for a slightly more verbose, faster and compile-time checked, scheme to register extensions like our stylus drivers.

### Improved UI and interactions

We spent quite some time polishing little UI and UX details in this version. One of the areas we focused on were our navigation buttons. We unified the appearance of our selectable button items, improved the annotation button handling when annotation editing is disabled and fixed some issues with the implicit close button for modal presentations. We even managed to work around some annoying navigation bar animation glitches, making our bar buttons animate much better than even some stock applications.

On the UX side we improved our smart zoom gesture. Zooming out should now work much more predictably than in previous versions. We also made it much easier to drag the annotation toolbar around, without triggering other gestures.

In this version, [`PSPDFSettingsViewController`](/api/ios/Classes/PSPDFSettingsViewController.html) gained the ability to switch between different page modes, allowing your users to, for example, always view pages in the two page up mode (especially useful for those huge iPad Pros!).

![Page Mode](/images/blog/2016/pspdfkit-6-0/pageMode.gif)

### Tiny cuts

While building our new [PDF Viewer](/viewer/) apps, we identified a lot of smaller issues in our SDK. Some of these issues you might have never noticed and others might have always bugged you. We've improved our API and many defaults. For example, calling `reloadData` now maintains the current document position, which is what you'd expect and in line with `UITableView` and `UICollectionView`. We also improved performance and stability of our PDF render core. A big thanks to all the beta testers who allowed us to identify the rare edge cases and pushed us to make even documents with 50,000 pages load fast. Last but not least, the eraser now has a configurable line width. It was about time for that. [Check out our changelog for the full list.](/changelog/ios/#6.0.0)

[Can't get enough? We have a wallpaper to download.](/images/blog/2016/pspdfkit-6-0/PSPDFKit_6_for_iOS_Wallpaper.png)
