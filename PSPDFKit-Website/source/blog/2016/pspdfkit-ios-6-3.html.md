---
title: "PSPDFKit 6.3 for iOS"
description: Introducing PSPDFKit 6.3 for iOS. PSPDF Instant Compatibility. More Languages. UI Improvements.
section: blog

author:
  - Peter Steinberger
  - Matej Bukovinski
author_url:
  - https://twitter.com/steipete
  - https://twitter.com/bukovinski
date: 2016-12-21 18:00 UTC
tags: iOS, Development, Products
published: true
---

Introducing PSPDFKit 6.3 for iOS. This release includes [PSPDF Instant compatibility](/instant), new languages and various UI improvements. Read up on our [changelog](/changelog/ios/#6.3.0) to get more information on all the changes, improvements and fixes in this release.

READMORE

## PSPDF Instant Compatibility

With PSPDFKit 6.3, we are now fully compatible with [PSPDF Instant](/instant). Instant is our latest product, currently in beta, that enables seamless collaboration for PSPDFKit-powered apps. With PSPDFKit and Instant together, you can now sync annotations and documents in real-time between all connected devices.

## More Languages

Internationalization is very important to us. It's why we are always improving our support for new languages and making sure everything looks great, no matter what locale you choose. With this update, we added two additional languages, Norwegian and Slovak, offering now a total of 29 languages. Next on our list, will be looking at adding Arabic with Right-to-Left support.

## Author Dialog Overhaul

The author dialog has been completely overhauled, going from a simple alert to a fully custom designed view controller, so your new users won't be scared of adding new annotations.

![Author Dialog](/images/blog/2016/pspdfkit-6-3/author-dialog.gif)

## Toolbar Drag Handle

We redesigned the  annotation/document editor toolbar drag handle, as the previous design led some users into thinking it could be a hamburger menu as well as improved the tap-handling, so that you get visual feedback as soon as you start tapping the handle.

![Drag Handle](/images/blog/2016/pspdfkit-6-3/drag-handle.gif)

## Settings View Controller

We improved the [`PSPDFSettingsViewController`][] making it easier to tell what exactly you are changing. Using the settings view controller, users can edit how the document is displayed.

![Settings View Controller](/images/blog/2016/pspdfkit-6-3/settings-view-controller.gif)

## Close All Tabs

PSPDFKit 6.3 adds another nice little detail - When you long press on any close button in the [`PSPDFTabbedViewController`][], you will be presented with a dialog asking to close all currently opened tabs, saving you a few taps.

![Close All Tabs](/images/blog/2016/pspdfkit-6-3/close-all-tabs.gif)

[`PSPDFSettingsViewController`]: https://pspdfkit.com/api/ios/Classes/PSPDFSettingsViewController.html
[`PSPDFTabbedViewController`]: https://pspdfkit.com/api/ios/Classes/PSPDFTabbedViewController.html

## Details & Library

As with every release, we've also worked on [many other details](/changelog/ios/#6.3.0), especially interesting in this release is a new manual mode for [`PSPDFLibrary`](/guides/ios/current/features/indexed-full-text-search/) that allows faster updates for large data sets when the changes are known beforehand - see `PSPDFLibraryFileSystemDataSource` for details.
