---
title: "Integrating PSPDFKit with CocoaPods"
description: A complete step-by-step guide on how to install CocoaPods and integrate PSPDFKit.
preview_image: /images/blog/2018/integrating-pspdfkit-with-cocoapods/article-header.png
section: blog
author:
  - Julian Grosshauser
author_url:
  - https://twitter.com/jgrosshauser
date: 2018-10-01 8:15 UTC
tags: iOS, Development, How To
published: true
secret: false
---

[CocoaPods][CocoaPods] is a popular dependency manager for Swift and Objective-C projects, and you can use it to integrate PSPDFKit into your project. Using CocoaPods is easier than [manually adding the PSPDFKit frameworks to your project][PSPDFKit Guides Integrating PSPDFKit].

# Installing CocoaPods

CocoaPods is available as a Ruby gem you can install by running `gem install cocoapods`. Using the default Ruby available on macOS can require you to use `sudo` when installing CocoaPods: `sudo gem install cocoapods`. To avoid this, we recommend using a Ruby version manager like [`rbenv`][rbenv].

# Integrating PSPDFKit into Your Project

To begin integration, first create a `Podfile` next to your Xcode project by running `pod init`. A `Podfile` describes the dependencies of the targets of your Xcode project. The content of your `Podfile` should look like this (change `YourTargetName` to the target of your app):

```ruby
use_frameworks!

target :YourTargetName do
  pod 'PSPDFKit', podspec: 'https://customers.pspdfkit.com/cocoapods/YOUR_COCOAPODS_KEY_GOES_HERE/pspdfkit/latest.podspec'
end
```

Take a look at our [Using CocoaPods][PSPDFKit Guides Podspec URL Key] guide article to find your Podspec URL key.

Now you can run `pod install` in the directory of your `Podfile` to install all new pods. This will download PSPDFKit and integrate it into your project. It will also create a new Xcode workspace that you will have to use in place of the original Xcode project.

# Verifying the Integration

Open the newly created Xcode workspace and import both `PSPDFKit` and `PSPDFKitUI` into any of your source files:

[==
```swift
import PSPDFKit
import PSPDFKitUI
```

```objc
@import PSPDFKit;
@import PSPDFKitUI;
```
==]

Build and run your target. That’s it! PSPDFKit has been successfully integrated into your project.

# Next Steps

You can start by [presenting a PDF onscreen][PSPDFKit Guides PSPDFViewController] or checking out our [API][] and [documentation guides][]. To learn more about CocoaPods, take a look at the [official CocoaPods documentation][] and read our [CocoaPods guide article][PSPDFKit Guides Using CocoaPods]. Feel free to [reach out to us][Support] if you run into any problems or have questions. We’re happy to help!

[CocoaPods]: https://cocoapods.org/
[PSPDFKit Guides Integrating PSPDFKit]: https://pspdfkit.com/guides/ios/current/getting-started/integrating-pspdfkit
[rbenv]: https://github.com/rbenv/rbenv
[PSPDFKit Guides Podspec URL Key]: https://pspdfkit.com/guides/ios/current/getting-started/using-cocoapods/#where-do-i-find-the-podspec-url-key
[PSPDFKit Guides PSPDFViewController]: https://pspdfkit.com/guides/ios/current/getting-started/integrating-pspdfkit/#sample-code-for-code-pspdfviewcontroller-code
[API]: https://pspdfkit.com/api/ios
[documentation guides]: https://pspdfkit.com/guides/ios/current
[official CocoaPods documentation]: https://guides.cocoapods.org/using/using-cocoapods.html
[PSPDFKit Guides Using CocoaPods]: https://pspdfkit.com/guides/ios/current/getting-started/using-cocoapods
[Support]: https://support.pspdfkit.com/hc/en-us/requests/new
