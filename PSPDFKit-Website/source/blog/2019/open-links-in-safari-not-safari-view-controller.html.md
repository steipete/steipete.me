---
title: "Open Links in Safari, Not Safari View Controller"
description: "Why we changed our default for opening web links from SFSafariViewController to the Safari app."
preview_image: /images/blog/2019/open-links-in-safari-not-safari-view-controller/article-header.png
section: blog
author:
  - Douglas Hill
author_url:
  - https://twitter.com/qdoug
date: 2019-12-11 8:00 UTC
tags: iOS, Development
published: true
secret: false
---

Earlier this year in [PSPDFKit 8.5 for iOS][8.5] and [PDF Viewer 3.6 for iOS][3.6], we changed the default setting for opening web links in PDFs from opening an in-app browser to opening Safari. In-app browsers are commonly used in third-party iOS apps, so this change might seem like it’s going against the grain. But in this post, I’ll discuss why we made this change and why this was the right time to do so.

## Some Background

Years ago, iOS app makers found that after opening a web link in Safari, it was hard for the user to get back to their app. This could leave the user feeling frustrated, and it could also be a disadvantage for the app maker if engagement was a key metric. The solution to this was to create an in-app web browser so that the user never left the app and could get back to where they were with just a tap.

Initially, these in-app browsers used the [`UIWebView`][] API to load and render the web content. In iOS 8, Apple created the [`WKWebView`][] API to improve performance, security, and reliability by moving the web content management to a separate process managed by the system. This tended to be a better option for in-app web views. PSPDFKit supported both of these in its in-app web view, [`PSPDFWebViewController`][]. We finally removed support for `UIWebView` in PSPDFKit 9 for iOS, which was good timing, because Apple has started sending warnings when apps referencing `UIWebView` are uploaded to App Store Connect.

Presumably after seeing the inconsistent user experience due to each third-party app designing and implementing its own in-app browser, Apple added the [`SFSafariViewController`][] API in iOS 9. This system-provided view goes beyond `WKWebView` by providing a full user interface for an in-app browser. However, despite this apparent endorsement, Apple never used `SFSafariViewController` in its own apps as an in-app browser. In fact, the Apple [recommendation in the iOS Human Interface Guidelines][hig] is very clear:

> **Avoid using a web view to build a web browser.** Using a web view to let people briefly access a website without leaving the context of your app is fine, but Safari is the primary way people browse the web on iOS. Attempting to replicate the functionality of Safari in your app is unnecessary and discouraged.

There isn’t a lot of explanation there as to the why, so let’s think of some reasons Apple may be recommending this.

## It’s Easy to Go Back on Modern iOS

iPhone X and later and all iPads on iOS 12 now have fluid multitasking gestures, which means a swipe along the bottom of the screen will take you back to the app you were in before tapping on a link. For older devices and OS versions, there is still the back button shown on the far-left side of the status bar after opening a link.

## Getting the Full Safari Experience

`SFSafariViewController` provides the core web browsing functionality from Safari but misses many of the details of the full app. Originally, `SFSafariViewController` shared cookies with the main app, but this changed in iOS 11. This means if a user opens a website that requires signing in, they will have to do this from scratch even if they have already signed in using the Safari app. Or, more likely, they’ll tap the button in `SFSafariViewController` to switch over to Safari, which is what your app was trying to avoid in the first place.

Other benefits of the full Safari app are iCloud tabs and Handoff.

## Much More Flexibility

`SFSafariViewController` presents web content modally over the app displaying it, so it covers up the app. This means if the user wants to switch back and forth between the app and a webpage, they have to keep reopening the webpage. By opening links in Safari instead, the user can keep both the app and the webpage open and switch between them without any loss of state. The app and Safari could even be side by side in Split View on iPad. Additionally, with the latest OS, Safari supports opening multiple windows. There are so many possibilities.

What’s more is Safari supports state restoration, so the user can leave the webpage open in Safari for a long time. Even if they come back another day, it will still be there.

Meanwhile, with `SFSafariViewController`, the app ends up looking like Safari, which makes it harder to distinguish from Safari in the app switcher at a glance.

## Links Don’t Necessarily End Up in Safari

I’ve been referring to opening links in Safari, but this isn’t the complete picture. What the app actually does is simply tell the system to open the link. Usually this results in opening Safari, but not always.

For example, if a native app can handle the link as a [universal link][], it will automatically open the app instead. There is a workaround for this with `SFSafariViewController`, where you can [preflight universal links][preflight], but by letting the system handle the entire link-opening procedure, everything is taken care of for you.

Additionally, when PSPDFKit or PDF Viewer run on the Mac using Mac Catalyst, links will open in the users’ preferred default browser, which is not necessarily Safari, and our code doesn’t need to know anything about which browser ends up being opened. On the subject of the Mac, a modal in-app browser would feel very out of place there, and in fact, trying to show an `SFSafariViewController` will open the default browser instead.

## Which Should You Choose?

In this post, we looked at the many advantages of opening links in Safari instead of using an in-app browser. The main disadvantage of opening links in Safari is the user has to manually close pages in Safari, so in the case where the user just wants to look at a webpage once and then is finished with it, they have to take an additional action to discard the page. iOS 13 has something of a solution to this with the option to automatically close tabs in Safari after a certain amount of time.

We’re not forcing opening links in Safari on our customers or users. PSPDFKit provides APIs to open `SFSafariViewController` or `PSPDFWebViewController` (using `WKWebView`), and in PDF Viewer, links can be set from the advanced settings screen to open using `SFSafariViewController`. Additionally, if the PDF specifies that a link should be opened in a certain way, we’ll respect that. However, we think opening links in Safari is the best user experience because it gives the user the full Safari feature set and more multitasking flexibility, so we chose this as our default.

[8.5]: /blog/2019/pspdfkit-ios-8-5/
[3.6]: https://pdfviewer.io/blog/2019/pdf-viewer-3-6-for-ios/
[hig]: https://developer.apple.com/design/human-interface-guidelines/ios/views/web-views/
[universal link]: https://developer.apple.com/ios/universal-links/
[preflight]: https://recoursive.com/2019/02/22/preflight_universal_links/
[`sfsafariviewcontroller`]: https://developer.apple.com/documentation/safariservices/sfsafariviewcontroller
[`uiwebview`]: https://developer.apple.com/documentation/uikit/uiwebview
[`wkwebview`]: https://developer.apple.com/documentation/webkit/wkwebview
[`pspdfwebviewcontroller`]: /api/ios/Classes/PSPDFWebViewController.html
