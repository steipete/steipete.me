---
title: "The All New PSPDFKit-Cordova Plugin"
description: "PSPDFKit-Cordova is our new and unified plugin for Android and iOS."
preview_image: /images/blog/2019/pspdfkit-cordova/article-header.png
section: blog
author:
  - Rad Azzouz
author_url:
  - https://twitter.com/radazzouz
date: 2019-10-21 8:00 UTC
tags: Cordova, Development, Products
published: true
secret: false
---

Today we are happy to announce [PSPDFKit-Cordova][pspdfkit-cordova repo], our new plugin for Cordova and Ionic, in which we merged, unified, and improved our old plugins for [Android][cordova-android repo] and [iOS][cordova-ios repo].

READMORE

[Apache Cordova][] is an open source platform for building native apps using HTML5, CSS, and JavaScript. It allows you to target multiple platforms, such as Android and iOS, with a single codebase.

The new [PSPDFKit-Cordova][pspdfkit-cordova repo] plugin allows us to offer a better app development experience, a unified cross-platform JavaScript API, compatibility with our latest [iOS][pspdfkit-ios-9 post] and [Android][pspdfkit-android-6 post] SDKs, and so much more.

## The Unified JavaScript API

Having a single plugin for both Android and iOS makes it easier to maintain a consistent API on both platforms. When we merged our old plugins into [PSPDFKit-Cordova][pspdfkit-cordova repo], we made sure that the new API is implemented on both Android and iOS, in order to improve the experience of writing cross-platform code.

In the table below, you can see the unified `present` function:

| Old Android API                                       | Old iOS API                                             | Unified API                                          |
| ----------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------- |
| `PSPDFKit.showDocument(uri, options, success, fail);` | `PSPDFKitPlugin.present(path, success, fail, options)`; | `PSPDFKit.present(path, options, success, failure)`; |

For more details, take a look at our [API reference][pspdfkit.js].

## Compatibility and Improvements

We’ve updated our new plugin to take full advantage of the latest improvements in Cordova, Ionic, and the host operating systems. Below, we list some notable changes and improvements:

- Our new plugin is fully compatible with Cordova 9.0.0 and later.
- Full compatibility with [PSPDFKit 6 for Android][pspdfkit-android-6 post], offering improved performance, better accessibility, and more.
- Full compatibility with [PSPDFKit 9 for iOS][pspdfkit-ios-9 post] with iOS 13 enhancements, including Dark Mode.
- CocoaPods is used by default on iOS projects.
- Easier than ever [installation and integration steps][].

## Migration Made Easy

If you were previously using one of our Cordova plugins, we made the migration to the new one very easy. Please take a look at our [migration guides][migration-guides] for more information about how to migrate to our new plugin.

## Conclusion

You can find the new Cordova plugin on [GitHub][pspdfkit-cordova repo], where you can also find the [documentation][], [API reference][pspdfkit.js], and everything else you need to [get started][getting started guides].

Our plugin is open source, so you can customize and extend it to suit your project’s requirements. If you’re looking to extend native APIs or contribute, we recommend that you take a look at our [How to Expose Native iOS APIs to Cordova][] post. We look forward to pull requests that extend and improve the plugin.

[apache cordova]: https://cordova.apache.org/
[pspdfkit-cordova repo]: https://github.com/PSPDFKit/PSPDFKit-Cordova
[cordova-android repo]: https://github.com/PSPDFKit/Cordova-Android
[cordova-ios repo]: https://github.com/PSPDFKit/Cordova-iOS
[pspdfkit-android-6 post]: /blog/2019/pspdfkit-android-6/
[pspdfkit-ios-9 post]: /blog/2019/pspdfkit-ios-9/
[pspdfkit.js]: https://github.com/PSPDFKit/PSPDFKit-Cordova/blob/master/www/PSPDFKit.js
[installation and integration steps]: https://github.com/PSPDFKit/PSPDFKit-Cordova/#installation-and-integration-steps
[documentation]: https://github.com/PSPDFKit/PSPDFKit-Cordova#documentation
[getting started guides]: https://github.com/PSPDFKit/PSPDFKit-Cordova#getting-started
[migration-guides]: https://github.com/PSPDFKit/PSPDFKit-Cordova/#migration-guides
[how to expose native ios apis to cordova]: /blog/2019/how-to-expose-ios-api-to-cordova/
[cordova plugin pull request]: https://github.com/PSPDFKit/PSPDFKit-Cordova/pulls
