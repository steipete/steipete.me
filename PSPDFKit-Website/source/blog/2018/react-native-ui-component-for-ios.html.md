---
title: "React Native UI Component for iOS"
description: "Introducing a native UI component for showing PDFs in a React Native app with PSPDFKit."
preview_image: /images/blog/2018/react-native-ui-component-for-ios/article-header.png
preview_video: /images/blog/2018/react-native-ui-component-for-ios/article-video.mp4
section: blog
author:
  - Stefan Kieleithner
author_url:
  - https://twitter.com/steviki
date: 2018-03-01 12:00 UTC
tags: iOS, Development, React Native
published: true
---

At PSPDFKit, we support all major hybrid technologies — all of which allow for faster application development — including Xamarin, Appcelerator, Cordova, and of course, React Native. In particular, interest in support for React Native is steadily increasing, so we’ve dedicated more time to making our support wrapper even better. Today we are excited to announce that our PSPDFKit [React Native wrapper] now comes with a [native UI component] in addition to the already existing [native module]. ([We also offer the same for Android](/blog/2018/react-native-ui-component-for-android/).)

READMORE

PSPDFKit has supported integration via React Native for quite some time, in that our wrapper can be used as a [native module] to modally present a PDF in fullscreen.

With the new React UI component, you can now integrate PSPDFKit directly into your custom components and modify and adjust the layout of the PDF view to your liking (with flexbox), all while still being able to enjoy the features and customization options you are used to from the native module.

This approach is similar to what was explained in an earlier guest blog post by Ben Kraus [about native view controllers with React Native][PSPDFKit React Native ViewControllers Blog Post].

<video src="/images/blog/2018/react-native-ui-component-for-ios/ui-component.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

**ℹ️ Note:** We recommend using the native UI component on iOS with PSPDFKit 7.4 for iOS or later.

## Usage

You can embed a PDF view in your app by using `PSPDFKitView` in your component’s `render()` function:

```javascript

<PSPDFKitView
  document={'document.pdf'}
  configuration={{
    pageTransition: 'scrollContinuous',
    scrollDirection: 'vertical',
    pageMode: 'single',
  }}
  style={{ flex: 1 }}
/>
```

The component enables not only displaying a single PDF in fullscreen mode, but also building any custom UI around it, or even displaying multiple documents at once in a split screen. A split screen UI that shows two different documents with varying configuration options at once, side by side on the screen, can be created with the following code:

```javascript
class SplitPDF extends Component {
  render() {
    return (
      <View style={{ flex: 1, flexDirection: layoutDirection }}>
        <PSPDFKitView
          document={'PDFs/Annual Report.pdf'}
          configuration={{
            backgroundColor: processColor('lightgrey'),
            thumbnailBarMode: 'scrollable',
          }}
          showCloseButton={true}
          style={{ flex: 1 }}
        />
        <PSPDFKitView
          document={'PDFs/Business Report.pdf'}
          configuration={{
            pageTransition: 'scrollContinuous',
            scrollDirection: 'vertical',
            pageMode: 'single',
          }}
          style={{ flex: 1, color: '#9932CC' }}
        />
      </View>
    )
  }
}
 ```

<video src="/images/blog/2018/react-native-ui-component-for-ios/split-screen.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

You can find this along with more example usages in the [Catalog][React Native Catalog].

## Customization

To configure and set up the `PSPDFKitView` UI component, you can pass [`props`][React Native Props] to it. These `props` include things like configuration options and the document that should be displayed. For a complete list of supported `props`, check out the [documentation for `PSPDFKitView`][PSPDFKitView source code].

## Navigation

On iOS, every `PSPDFKitView` automatically creates a navigation controller and shows a navigation bar on the top of the view, the latter of which is used to display text and buttons to trigger common PSPDFKit actions and tools.

If you were to use an existing navigation solution that already has a native `UINavigationController` with `PSPDFKitView` presented in it, `PSPDFKitView` could take over the navigation bar of the currently presented screen if configured to do so. In such a case, `PSPDFKitView` won’t create its own navigation bar. The only thing needed for this to work is to pass `useParentNavigationBar: true` as an option in the `configuration` prop. Navigation libraries that have been tested and work with the PSPDFKit component include [`NavigatorIOS`] and [`react-native-navigation`].

Heads up: Allowing PSPDFKit to use the navigation bar doesn’t work with [`react-navigation`], as it fakes a navigation bar via custom views. Therefore, it is not possible to hook into its navigation bar. Setting `useParentNavigationBar` has no effect (apart from hiding the PSPDFKit navigation bar), and the PSPDFKit navigation bar will be shown below the faked navigation bar by default.

## Conclusion

If you come across anything missing from the UI component that you think would be useful to have, feel free to [contact us][Support] or [open an issue][RN wrapper issues] on the PSPDFKit React Native repository. You are also very welcome to submit [pull requests][RN wrapper Pull Request] to help improve our wrapper, as all of it is open source.

[React Native wrapper]: https://github.com/PSPDFKit/react-native
[native module]: https://facebook.github.io/react-native/docs/native-modules-ios.html
[native UI component]: https://facebook.github.io/react-native/docs/native-components-ios.html
[React Native Catalog]: https://github.com/PSPDFKit/react-native/tree/master/samples/Catalog
[PSPDFKit React Native Introduction Blog Post]: /blog/2016/react-native-module/
[PSPDFKit React Native ViewControllers Blog Post]: /blog/2017/native-view-controllers-and-react-native/
[React Native Props]: https://facebook.github.io/react-native/docs/props.html
[PSPDFKitView source code]: https://github.com/PSPDFKit/react-native/blob/master/index.js
[`NavigatorIOS`]: https://facebook.github.io/react-native/docs/navigatorios.html
[`react-native-navigation`]: https://github.com/wix/react-native-navigation
[`react-navigation`]: https://github.com/react-navigation/react-navigation
[`native-navigation`]: https://github.com/airbnb/native-navigation
[Support]: /support/request
[RN wrapper issues]: https://github.com/PSPDFKit/react-native/issues
[RN wrapper Pull Request]: https://github.com/PSPDFKit/react-native/pulls
