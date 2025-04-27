---
title: PSPDFKit 5.0 for iOS
pubDate: 2015-09-28T12:00:00.000Z
description: >-
  PSPDFKit 5 for iOS - the next major version of our PDF SDK - is around the
  corner, and we're happy to give you a preview of what you can expect from this
  version.
tags:
  - pspdfkit
source: pspdfkit.com
AIDescription: true
---


PSPDFKit 5 for iOS - the next major version of our PDF SDK - is around the corner, and we're happy to give you a preview of what you can expect from this version.

Update: [PSPDFKit 5 has finally been released! Head over to the release notes for all details.](https://pspdfkit.com/changelog/ios/#5.0.0)
READMORE

## Adaptivity and Multitasking

iOS 9 introduced new multitasking modes on iPad. This means the user interface can change on the fly and must be ready to adapt: a popover can morph into a full screen view and back during its lifetime. We took our entire controller presentation and re-built everything with the new iOS 8 APIs to be ready for this change. As we have a large library of UI components, this was a massive undertaking. We see this as an investment for the future, since a modern API is less likely to break in future versions than the old calls. We couldn’t be happier to finally drop `UIPopoverController` and its many friends. Unfortunately, as with any new API, there are quite a few bugs and issues in Apple’s new presentation system. We’ve reported more than ten Radars on this issue alone during the iOS 9 beta. None of the Radars have been fixed yet so we’ve been working overtime on workarounds for these UIKit issues to make sure everything works great. As a user, this means a more consistent presentation and popovers that will not disappear on rotation. As a developer, it’s now easier to interact with the presentation system and PSPDFKit is fully ready to handle iPad Slide Over and Split View.

![Adaptivity and Multitasking](/assets/img/pspdfkit/2015/pspdfkit-5-0/adaptivity-multitasking.gif)

## Adaptive Toolbars

A big chunk of the adaptivity work was dedicated to the annotation toolbar. The toolbar could already adapt its content based on the device type and automatically collapse overflowing items, if screen real-estate is tight. In version 5 we brought that support to a whole new level. The annotation toolbar API has been refactored, so it can now be configured with a set of `PSPDFAnnotationToolbarConfiguration` objects, each defining a custom toolbar layout. The toolbar then automatically calculates which configuration to pick based on the available space. All you have to do is pick the toolbar items and groups that best suit your needs. And since we already pre-bundled the toolbar with some great defaults, you don't even have to do that! This not only improves the toolbar with iPad multitasking, but also ensures we leverage the extra space that becomes available when rotating an iPhone to landscape or moving the toolbar to the vertical position.

![Adaptive Toolbars](/assets/img/pspdfkit/2015/pspdfkit-5-0/adaptive-toolbars.gif)

Similar changes have been made internally in `PSPDFFreeTextAccessoryView`. In addition to making sure that the accessory view is fully adaptive, we also re-configured it so it now shows the handy in-place popover pickers whenever there is enough space, which makes quick changes even more convenient.

![Accessory View](/assets/img/pspdfkit/2015/pspdfkit-5-0/accessory-view.png)

Although navigation bar items are typically outside the reach of PSPDFKit, we also chose to improve on UIKit’s shortcomings in this regard and make it easy for you to adapt to size-changes on the navigation bar. Take a look at the `PSCKioskPDFViewController` example to see exactly how you can pull that off.

## Tabs

PSPDFKit has had tabs for quickly switching between documents since version 1.10 was released in May 2012. Phew, that was a long time ago! However, we’ve never really been happy with this feature and always felt like we could do so much better. After receiving quite a few requests to improve things here, we finally decided it was time. With version 5, we re-wrote the whole system from scratch based on `UICollectionView`. Tabs are now faster, look much better and also animate. Drag-and-drop reordering, automatic shrinking and an overview list make it easy to handle lots of documents at once. We took a hard look at Safari for iOS and took the parts we liked best about it and expanded those with our own ideas. If you are displaying multiple documents at the same time, give our tab controller another try — it’s really great! We even went so far as to work on the color logic, so tabs adapt to your color scheme and are always readable.

![Tabs](/assets/img/pspdfkit/2015/pspdfkit-5-0/tabs.gif)

## Encryption

We replaced `CGPDFDataProvider` with our own, new `PSPDFDataProvider` and added logic that allows writing back into encrypted documents. This was definitely a shortcoming in earlier versions. Now it’s possible to show an encrypted document, decrypt it on-the-fly with only the parts that are absolutely required. You can also save new annotation data into the encrypted file, allowing you to keep your critical business data protected.

## Unified Undo and Redo

We’re proud to have supported document-wide undo and redo since PSPDFKit 2.4. Though there have been numerous improvements to this under-the-hood since 2.4, with version 5 we’ve made our biggest improvement yet. Before version 5, single ink strokes could be undone while drawing but as soon as the object was committed and saved, you could only undo the entire object. This has always been a source of frustration for us and we knew we could do better. It was definitely a challenge but we re-engineered undo to allow steps into objects while maintaining exceptional performance and memory usage. The result is now a unified and complete undo experience, just like you have come to expect from major desktop applications like Photoshop or Word.

![Unified Undo and Redo](/assets/img/pspdfkit/2015/pspdfkit-5-0/unified-undo-redo.gif)

## iOS 9

We went the long route and replaced as much of our API with modern counterparts as possible. We now offer a modern and sleek experience for customers and developers alike. `UIAlertController` and `UISearchController` are used everywhere, replacing the older deprecated API for further view controller unification. We also retired `PSPDFWebViewController` on iOS 9 in favor of the new native Safari view controller, which offers an even better in-app browsing experience. We avoid device specific checks internally, which makes PSPDFKit ready for the next generation devices, such as the iPad Pro. Oh, least we not forget, we added support for Bitcode.

## Indexed Full-Text Search

Indexed search finally learned to deal with CJK characters (Chinese, Japanese, and Korean languages) and offers better search results when searching for results inside words. We've also redesigned how text is extracted and saved, resulting in general faster processing while requiring less processing power.

## Details, Details, Details

As you’ve come to expect from us, we never forget even the smallest details. Version 5 is no different: we’ve tweaked many details throughout the whole framework. We improved color use, made the menus more intuitive, improved class names (for example, `PSPDFScrobbleBar` has been renamed to `PSPDFScrubberBar` to better express its purpose) and also worked on general performance. The query for the annotation user name now has better timing and `PSPDFAnnotationStateManager` allows you to plug in a custom delegate. We also added generics and nullability everywhere, substantially improving the API documentation in general, but especially for Swift.

## A New Foundation

We’ve been working with Apple’s Core Graphics PDF renderer since 2011, and it has served us pretty well. However, as we expanded to Android, we came to the realization that we had to develop our own renderer. As many of you know, Android has only shipped with a native renderer since 4.4, and their renderer is far too limited for the robust features we offer. So we sat down and worked hard to develop our own renderer. With version 5, we are finally ready to ship it on both Android and iOS. This has really been a great move since we now control the full stack (except UIKit) and can now offer even better support. There have always been cases where a particular malformed PDF could crash Safari and every app using iOS native rendering. Apple fixed some of our reported bugs, but it was usually a slow process and often introduced new bugs and issues. We spent much of our time tracking down regressions and reporting things to Apple. Due to the way their Radars work and the fact that their updates only go into new OS versions made for a quite frustrating experience. With our own renderer technology, we’re in full control and can quickly react to issues instead of redirecting people to Apple’s Radar. We understand that for Apple, PDF is just a small feature with limited resources focused on it, where for us PDF is our core business and we have over 20 engineers working full-time on it.

## What’s Next

The new foundation allows us to work on new features that we have wanted to ship for a long time but couldn’t because of the restriction when working with Apple’s parser. Look out for features such as controlling visibility of individual layers or rendering linearized PDFs on-the-fly as they download, to name a few.
