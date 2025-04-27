---
title: "Supporting Hybrid Technologies"
description: "We support all major hybrid technologies, including Cordova, Electron, Flutter, Ionic, React Native, Titanium, and Xamarin."
preview_image: /images/blog/2018/supporting-hybrid-technologies/article-header.png
section: blog
author:
  - Rad Azzouz
author_url:
  - https://twitter.com/radazzouz
date: 2018-12-04 8:00 UTC
tags: Development, Android, iOS, macOS, Web, Cordova, Electron, Flutter, Ionic, React Native, Titanium, Xamarin
published: true
secret: false
---

At PSPDFKit, we support and provide sample projects for all major hybrid technologies, including [Cordova][], [Electron][], [Flutter][], [Ionic][], [React Native][], [Titanium][appcelerator titanium], and [Xamarin][microsoft xamarin].

READMORE

Hybrid technologies allow you to develop cross-platform applications faster. They also enable web developers to create native mobile apps.

In this article, we’ll provide an overview of every hybrid technology that we support, and we’ll discuss the various aspects that you and your team should consider when evaluating the adoption of a hybrid technology for your project.

So let’s get started!

## Overview

Most hybrid wrappers allow you to use JavaScript, HTML, and CSS while encapsulating platform-specific details. For example, Cordova, Electron, Ionic, React Native, and Appcelerator Titanium enable you to develop mobile apps with HTML, CSS, and JavaScript, while Xamarin allows you to create apps using C# as a programming language.

Take a look at the table below which shows the programming language and the supported platform for each wrapper:

<div class="table-responsive">

  | Wrapper | Programming Language | Supported Platforms | PSPDFKit Platform |
  | ----------- | --------------------------------- | --------------------------- | --------------------------- |
  | [Appcelerator Titanium][]  | JavaScript, HTML, and CSS | Android and iOS | PSPDFKit for iOS |
  | [Cordova][]  | JavaScript, HTML, and CSS | Android, iOS, macOS, and Windows | PSPDFKit for Android and iOS |
  | [Electron][]   | JavaScript, HTML, and CSS | Linux, macOS, and Windows | PSPDFKit for Web |
  | [Flutter][]   | Dart | Android and iOS | PSPDFKit for Android and iOS |
  | [Ionic][]  | JavaScript, HTML, and CSS | Android and iOS | PSPDFKit for Android and iOS |
  | [Microsoft Xamarin][]  | C# | Android, iOS, macOS, and Windows | PSPDFKit for Android, iOS, macOS, and Windows |
  | [React Native][]  | JavaScript, HTML, and CSS | Android, iOS, and Windows | PSPDFKit for Android, iOS, and Windows |

</div>

### Not All Hybrid Technologies Are Made Exclusively for Mobile Development

Most of our hybrid wrappers are centered around mobile app development. However, there are a few hybrid technologies, like Electron and Xamarin, that allow you to develop desktop (macOS and Windows) apps using [PSPDFKit for Web][] and [PSPDFKit for macOS][], respectively.

## So Which Hybrid Technology Should I Use?

The choice of which hybrid technology is right for your project is a decision that you and your team will ultimately have to make. Committing to a specific hybrid technology can be a tough decision to make. In this section, we’ll discuss the questions you should ask when evaluating a hybrid solution.

### Who’s Backing It?

It’s important to note that some big companies back some hybrid technologies. For example, Xamarin is backed by Microsoft, Facebook is behind React Native, and Flutter is supported by Google.

### How Active Is the Community?

Most hybrid technologies are open source, which is great, because you have a clear view of the known issues and pull requests, and you can also contribute. We recommend that you look at the open source repositories for each technology and see how active the community is at fixing bugs and adopting new features.

We also suggest looking at the Stack Overflow topics and the official documentation for each technology.

### How Easy Is It to Customize and Extend Native APIs?

In our native SDKs, we expose a lot of APIs so that they can be fully customized. However, we cannot offer all of our native APIs in our hybrid wrappers for reasons like the native design patterns being very specific to the platform and different from the wrapper. So we generally expose a subset of the native APIs, which allows you to develop a fully functional app for most use cases. For advanced use cases, we recommend that you extend our wrappers.

There are two ways of extending our wrappers:

1. Pull Request Contributions — If the requirement is generic and would benefit other users, then we recommend [contributing][contributing guide] with a pull request.
2. Forking — If the requirement is unique — for example, you need to add a custom stamp button that uploads the document to your backend — then we recommend forking the repository and making the change in your fork. For more details, please take a look at how we did it for our React Native wrapper in [customize-the-toolbar-in-native-code][].

### Other Factors to Consider

With each new update of our native SDKs, we test our wrappers to make sure that the newly changed APIs don’t impact our wrappers. It’s essential that you use the most recent versions of both our wrappers and SDKs to ensure a consistent development environment.

Our Xamarin wrappers use all of the native APIs, and it involves a considerable amount of effort to update the wrappers to match the SDK release. This process can take a few days and sometimes a week, depending on the extent of the update.

We noticed that React Native is the wrapper that has gained a lot of traction lately, and we recently extended its API and wrote blog posts like [How to Extend React Native APIs][how to extend react native api blog post] and [Advanced Techniques for React Native UI Components][advanced techniques for react native ui components blog post].

## Conclusion

We hope this article will help you when deciding which hybrid solution to adopt in your next project. We recommend that you explore our open source repositories and our [documentation][ios guides]. We always welcome pull request contributions from the community.

[cordova]: /guides/ios/current/other-languages/apache-cordova-phonegap/
[appcelerator titanium]: /guides/ios/current/other-languages/appcelerator-titanium/
[ionic]: /guides/ios/current/other-languages/ionic/
[microsoft xamarin]: /guides/ios/current/other-languages/xamarin/
[electron]: /guides/web/current/other-languages/electron/
[flutter]: https://github.com/PSPDFKit/pspdfkit-flutter
[react native]: /guides/ios/current/other-languages/react-native/
[pspdfkit for macos]: https://pspdfkit.com/pdf-sdk/macos/
[pspdfkit for web]: https://pspdfkit.com/pdf-sdk/web/
[contributing guide]: /guides/ios/current/miscellaneous/contributing/
[how to extend react native api blog post]: /blog/2018/how-to-extend-react-native-api
[advanced techniques for react native ui components blog post]: /blog/2018/advanced-techniques-for-react-native-ui-components/
[ios guides]: /guides/ios/current/
[customize-the-toolbar-in-native-code]: https://github.com/PSPDFKit/react-native/tree/customize-the-toolbar-in-native-code
