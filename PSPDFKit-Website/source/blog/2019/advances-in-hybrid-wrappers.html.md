---
title: "Advances in Hybrid Wrappers"
description: "We recently updated our hybrid wrappers."
preview_image: /images/blog/2019/advances-in-hybrid-wrappers/article-header.png
section: blog
author:
  - Rad Azzouz
author_url:
  - https://twitter.com/radazzouz
date: 2019-11-06 8:00 UTC
tags: Development, Cordova, Electron, Flutter, Ionic, React Native, Titanium, Xamarin
published: true
secret: false
---

At PSPDFKit, we support all [major hybrid technologies][supporting hybrid technologies blog post], and as part of our quest to continuously improve our wrappers, we’ve added new APIs, improved existing ones, and fixed several issues.
READMORE

In this article, we’ll highlight the recent advances made to our hybrid wrappers.

## React Native

Our [React Native wrapper][react-native repo] is very popular, and the community contributing to it is very active. Over the last few months, we’ve fixed many issues, made some considerable improvements, and [exposed a lot of native APIs][how to extend react native apis blog post]. Here are some notable changes from our recent releases:

- Added the `toolbarTitle` configuration property to override the iOS toolbar title.
- Added the `onDocumentLoadFailed` callback on Android and iOS.
- Added JavaScript APIs to customize the toolbar on iOS.
- Added the `getAllAnnotations()` JavaScript API to query all annotations from a document.
- Improved error handling for annotation manipulation functions on iOS.
- Improved document path resolution on Android.
- Updated the iOS integration steps to use CocoaPods by default.
- Fixed a memory leak issue in React Native for Windows with Newtonsoft.

For the full set of changes, please take a look at our [recent releases here][react-native releases].

## Cordova and Ionic

Our Cordova plugin is also very widely used. We’ve made some significant improvements and we exposed several native Android and iOS APIs to JavaScript:

- Added the ability to [manipulate annotations programmatically][how to manipulate annotations programmatically in cordova blog post].
- Added the programmatic forms API.
- Added the ability to import and export XFDF.
- Added document-processing APIs.

We also released a brand new and unified Cordova plugin for both Android and iOS. Take a look at our [announcement blog post][pspdfkit-cordova blog post] for more details.

## Flutter

Flutter is the youngest of our wrappers, and we are seeing it gain a lot of popularity among our customers and partners. Here are a few highlights of our recent improvements:

- Added the ability to manipulate annotations programmatically.
- Added the ability to manipulate forms programmatically.
- Added the ability to programmatically unlock password-protected documents.
- Added the `showDocumentTitle` configuration option to allow users to toggle the visibility of the document title.
- Added the ability to customize the toolbar buttons on iOS.
- Extended support for styling and configuration options.
- Exposed various configuration options like `showDocumentLabel`, `settingsMenuItem`, and more.

Take a look at our recently [merged pull requests][flutter repo closed pull requests] for more details.

## Electron, Appcelerator Titanium, and Xamarin

We’ve also updated our [Electron][], [Titanium][appcelerator titanium], and [Xamarin][microsoft xamarin] wrappers to make sure they are fully compatible with the latest versions of PSPDFKit, tools, and operating systems.

## Conclusion

All of our hybrid wrappers and plugins are open source and we welcome and encourage contributions from the community. If you wish to contribute or you simply want to learn more about how to extend native APIs, please take a look at the blog posts below to get started:

- [How to Expose Native iOS APIs to Cordova][how to expose native ios api to cordova blog post]
- [Advanced Techniques for React Native UI Components][advanced techniques for react native ui components blog post]
- [How to Extend React Native APIs][how to extend react native apis blog post]
- [How to Extend React Native APIs for Windows][how to extend react native apis for windows blog post]

If you come across any missing APIs from any hybrid wrapper that you think would be useful to have, feel free to [contact us][support] or to submit a pull request to help improve our wrappers.

[supporting hybrid technologies blog post]: /blog/2018/supporting-hybrid-technologies/
[how to expose native ios api to cordova blog post]: /blog/2019/how-to-expose-ios-api-to-cordova
[how to extend react native apis blog post]: /blog/2018/how-to-extend-react-native-api/
[advanced techniques for react native ui components blog post]: /blog/2018/advanced-techniques-for-react-native-ui-components/
[how to extend react native apis for windows blog post]: /blog/2019/how-to-extend-react-native-apis-for-windows/
[how to manipulate annotations programmatically in cordova blog post]: /blog/2019/how-to-manipulate-annotations-programmatically-in-cordova/
[react-native repo]: https://github.com/PSPDFKit/react-native
[react-native releases]: https://github.com/PSPDFKit/react-native/releases
[cordova-ios repo]: https://github.com/PSPDFKit/Cordova-iOS
[cordova plugin pull request]: https://github.com/PSPDFKit/PSPDFKit-Cordova/pulls
[pspdfkit-cordova blog post]: /blog/2019/pspdfkit-cordova/
[flutter repo closed pull requests]: https://github.com/PSPDFKit/pspdfkit-flutter/pulls?q=is%3Apr+is%3Aclosed
[appcelerator titanium]: /guides/ios/current/other-languages/appcelerator-titanium/
[microsoft xamarin]: /guides/ios/current/other-languages/xamarin/
[electron]: /guides/web/current/other-languages/electron/
[support]: /support/request
