---
title: "PSPDFKit 💖 React Native"
section: blog
preview_image: /images/blog/2018/react-native-ui-component-for-ios/article-header.png
author: Julian Grosshauser
author_url: https://twitter.com/jgrosshauser
date: 2016-09-29 12:00 UTC
tags: React Native, Development
published: true
---

[React Native](https://facebook.github.io/react-native) enables you to build native mobile apps using a consistent developer experience based on JavaScript and [React](https://facebook.github.io/react). It’s built by Facebook and already used by [thousands of apps](https://facebook.github.io/react-native/showcase.html) in production. Motivated by the momentum and popularity of React Native, we had to give its users an easy way to use PSPDFKit in their projects.
READMORE

**See also: [React Native UI Component for iOS](/blog/2018/react-native-ui-component-for-ios/), [for Android](/blog/2018/react-native-ui-component-for-android/) and [Windows UWP](/blog/2018/introducing-pspdfkit-windows/#react-native-for-windows-support).**

That’s why [we just open sourced our React Native module on GitHub](https://github.com/PSPDFKit/react-native). Now, it's easy to present a full-featured PDF viewer in your React Native app. After you follow the installation steps from our [README](https://github.com/PSPDFKit/react-native/blob/master/README.md), you can present a PDF document like this:

```js
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  NativeModules,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

var PSPDFKit = NativeModules.PSPDFKit;

PSPDFKit.setLicenseKey('INSERT_YOUR_LICENSE_KEY_HERE');

class ReactNativeApp extends Component {
  _onPressButton() {
    PSPDFKit.present('document.pdf', {})
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this._onPressButton}>
          <Text style={styles.text}>Tap to Open Document</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

AppRegistry.registerComponent('ReactNativeApp', () => ReactNativeApp);
```

All the heavy lifting is done by the `PSPDFKit.present` method.

![PDF Presentation](/images/blog/2016/react-native-module/presentation.gif)

## Configuration

It’s easy to configure your PDF viewer. Simply pass a configuration dictionary into the `PSPDFKit.present` method:

```js
PSPDFKit.present('document.pdf', {
  thumbnailBarMode: 'scrollable',
  pageTransition: 'scrollContinuous',
  scrollDirection: 'vertical'
})
```

Now the viewer uses continous vertical scrolling and a scrollable thumbnail bar:

![Configuration](/images/blog/2016/react-native-module/configuration.gif)

The configuration dictionary is a mirror of the [PSPDFConfiguration](https://pspdfkit.com/api/ios/Classes/PSPDFConfiguration.html) class.

## Android

With React Native it’s possible to write an iOS and Android app using the same code. To make this possible our module supports both iOS and Android. Follow our [getting started guide for Android](https://github.com/PSPDFKit/react-native#android) to run your app on an Android device.

## Summary

You can find the PSPDFKit React Native module on [GitHub](https://github.com/PSPDFKit/react-native). It’s open source, so you can customize it however you like. We’re looking forward to pull requests that extend and improve the module.
