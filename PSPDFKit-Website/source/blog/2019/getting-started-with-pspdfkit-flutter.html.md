---
title: "Getting Started with PSPDFKit Flutter"
description: "How to get started with PSPDFKit Flutter."
preview_image: /images/blog/2019/getting-started-with-pspdfkit-flutter/article-header.png
section: blog
author:
  - Rad Azzouz
author_url:
  - https://twitter.com/radazzouz
date: 2019-04-02 8:00 UTC
tags: iOS, Android, Development, Flutter
published: true
secret: false
---

At PSPDFKit, we support [all major hybrid technologies][supporting hybrid technologies blog post], including [Flutter][flutter.io], and [PSPDFKit Flutter][pspdfkit flutter repo] is the newest addition to our growing wrappers family.
READMORE

## What Is Flutter?

Flutter is a relatively new hybrid technology (compared to Cordova, Xamarin, and React Native, which are all at least a few years old) and it’s made by Google. According to Google, “Flutter allows you to build beautiful native apps on iOS and Android from a single codebase.”

Flutter uses Google’s own programming language, Dart, which is somewhat similar to JavaScript and has built-in support for type safety. Flutter has some great features — like hot reload, which allows you to quickly reload an app and view changes without having to restart the app — and it comes with a modern reactive framework and lots of widgets.

When we first looked into [using Flutter][how i got started with flutter blog post], we enjoyed the development experience, and our experimenting resulted in the PSPDFKit Flutter wrapper. In this post, I’ll talk about how to get started with [PSPDFKit Flutter][pspdfkit flutter repo]. I’ll also discuss how easy and fast it is to get our sample project running on both Android and iOS.

There are four simple steps, which you’ll find below.

<video src="/images/blog/2019/getting-started-with-pspdfkit-flutter/open-pdf-document-and-highlight-ios.mp4" poster="/images/blog/2019/getting-started-with-pspdfkit-flutter/open-pdf-document-and-highlight-ios.mp4" width="50%" data-controller="video" data-video-autoplay="true" controls playsinline loop muted></video>

### Step 1: Install the Flutter SDK and the IDEs

Before we get started, we need to make sure that the [Flutter SDK][install flutter], [Android Studio][], and [Xcode][] are all installed.

> **ℹ️ Note:** If you’re following this tutorial on a single platform, it’s not necessary to install the other platform’s IDE. For example, if you want to run the sample project on Android, it’s unnecessary to install Xcode.

### Step 2: Clone the PSPDFKit Flutter Repository

You need to download or clone the [open source repository][pspdfkit flutter repo] for PSPDFKit Flutter:

```bash
git clone git@github.com:PSPDFKit/pspdfkit-flutter.git
```

### Step 3: Download and Set Up PSPDFKit

Then, you need to [download][trial] and set up PSPDFKit for Android and iOS.

#### Setting Up PSPDFKit for Android

For Android, you need to create a local property file in `pspdfkit-flutter/example/android/local.properties` and specify the following properties:

```local.properties
sdk.dir=/path/to/your/Android/sdk
flutter.sdk=/path/to/your/flutter/sdk
pspdfkit.password=YOUR_PASSWORD_GOES_HERE
flutter.buildMode=debug
```

#### Setting Up PSPDFKit for iOS

For iOS, replace `YOUR_COCOAPODS_KEY_GOES_HERE` with your CocoaPods key in `pspdfkit-flutter/example/iOS/Podfile`, like so:

```ruby
 ...
 target 'Runner' do
   pod 'PSPDFKit', podspec:'https://customers.pspdfkit.com/cocoapods/YOUR_COCOAPODS_KEY_GOES_HERE/pspdfkit/latest.podspec'
 ...
```

> **ℹ️ Important:** If you’re an existing customer, you can find the password, CocoaPods key, and license keys in your [customer portal][]. Otherwise, if you don’t already have PSPDFKit, [sign up for our 60-day trial][trial] and you will receive an email with the instructions to get started.

Now, `cd` into the `pspdfkit-flutter/example` directory, and run `flutter emulators --launch <EMULATOR_ID>` to launch the desired emulator, like so:

```bash
cd pspdfkit-flutter/example
flutter emulators --launch <EMULATOR_ID>
```

> **💡 Tip:** Optionally, you can repeat this step to launch multiple emulators.

### Step 4: Build and Run

The app is ready to start! Run `flutter run -d all` to deploy the PSPDFKit Flutter example on all your connected devices:

```bash
flutter run -d all
```

|                                                               Android                                                                |                                                       iOS                                                       |
| :----------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------: |
| ![opened-pdf-document-android](/images/blog/2019/getting-started-with-pspdfkit-flutter/opened-pdf-document-android.png#img-width-75) | ![opened-pdf-document-ios](/images/blog/2019/getting-started-with-pspdfkit-flutter/opened-pdf-document-ios.png) |

## Conclusion

Flutter allows you to run our example from a single codebase on both Android and iOS. In our example app, the logic is in `main.dart`, and it contains very little platform-specific code.

Our wrapper, [PSPDFKit Flutter][pspdfkit flutter repo], is open source, and we encourage and welcome [pull request contributions][pspdfkit flutter repo pull requests] from the community.

Let us know what you think!

[how i got started with flutter blog post]: /blog/2018/starting-with-flutter/
[flutter.io]: https://flutter.io/
[pspdfkit flutter repo]: https://github.com/PSPDFKit/pspdfkit-flutter
[supporting hybrid technologies blog post]: /blog/2018/supporting-hybrid-technologies/
[install flutter]: https://flutter.io/docs/get-started/install
[android studio]: https://developer.android.com/studio/
[xcode]: https://developer.apple.com/xcode/
[customer portal]: https://customers.pspdfkit.com/
[trial]: https://pspdfkit.com/try/
[pspdfkit flutter repo pull requests]: https://github.com/PSPDFKit/pspdfkit-flutter/pulls
