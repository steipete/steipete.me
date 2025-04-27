---
title: "Getting Started with PSPDFKit for iOS"
description: A Tutorial for Getting Started with PSPDFKit for iOS.
preview_image: /images/blog/2017/getting-started-with-pspdfkit-ios/preview.png
section: blog
author:
  - Rad Azzouz
author_url:
  - https://twitter.com/radazzouz
date: 2017-12-18 12:00 UTC
tags: iOS, Development
published: true
---

PSPDFKit for iOS is a framework dealing with everything related to PDF. It’s a large library which exposes a lot of API so that many aspects can be customized. The API can be intimidating at first, so in this article, we will walk you through the basics, covering how to download PSPDFKit for iOS and use the bundled sample projects. We will also integrate PSPDFKit and present a [`PSPDFViewController`] in an existing app.

READMORE

## Download PSPDFKit

The first step to getting started with PSPDFKit is to download the `dmg` file, which contains the framework and a few Xcode projects for the sample apps. If you don’t already have PSPDFKit, sign up [to download our 60-day trial][Download Trial]. Afterward, you will receive an email with the download link.

## Launch the Sample App in Xcode

Now that you’ve downloaded PSPDFKit on your Mac, open the `.dmg` file and navigate to the `Examples` directory.

<img alt="Examples Folder" src="/images/blog/2017/getting-started-with-pspdfkit-ios/examples-folder.png" width="70%">

Make sure you have the latest stable version of Xcode installed on your Mac and open the `PSPDFCatalog` project.

<img alt="Open PSPDFCatalog in Xcode" src="/images/blog/2017/getting-started-with-pspdfkit-ios/open-in-xcode.png">

Launch the project in Simulator to see PSPDFKit in action. The `PSPDFCatalog` project comes with a lot of examples, and a good starting point is the “PSPDFViewController Playground” example, which illustrates how to open a PDF document in a [`PSPDFViewController`].

<img alt="Playground in the Simulator" src="/images/blog/2017/getting-started-with-pspdfkit-ios/playground-example-in-simulator.png" width="50%">

We encourage you to explore the catalog app and its examples. You can use the search bar in the catalog app or search the Xcode project for use cases which may fit your app’s needs.

<img alt="Search the Catalog" src="/images/blog/2017/getting-started-with-pspdfkit-ios/pspdfcatalog-in-simulator.png" width="50%">

## Integrate PSPDFKit in Your Own App

Now that we’ve covered the basics, we will proceed to integrate the framework into an existing app using CocoaPods. There are several ways to integrate PSPDFKit; see our [“Integrating PSPDFKit”] guide article for all the integration methods.

### CocoaPods Setup

In this tutorial, we will be using [CocoaPods][Using CocoaPods] because it is the simplest and most popular way to add dependencies to a project. We are assuming that your project is already using CocoaPods and that it already has a `Podfile`. Please modify it as such and run `pod install`:

```ruby
use_frameworks!

target :YourTargetName do
    # Other Pods
    pod ’PSPDFKit', podspec: 'https://customers.pspdfkit.com/cocoapods/YOUR_COCOAPODS_KEY_GOES_HERE/latest.podspec'
end
```

You can find your demo CocoaPods key prefilled on our [“Try the PSPDFKit Demo”] article.

If you already have a license, please enter it in your application delegate’s `willFinishLaunchingWithOptions`. See our [“Adding the License Key”] guide for the step-by-step instructions. Otherwise, if you are using the trial version, you can skip this step for now.

## Present the PSPDFViewController

Your project is now using PSPDFKit via CocoaPods. You need to add the imports for `PSPDFKit` and `PSPDFKitUI` and present a `PSPDFViewController` from within your app:

[==

```swift
import PSPDFKit
import PSPDFKitUI

...

// Create the PSPDFDocument.
let documentURL = ...
let document = PSPDFDocument(url: writableURL)

// Create the PDF view controller.
let pdfController = PSPDFViewController(document: document, configuration: configuration)

// Present the PDF view controller within a UINavigationController to enable the toolbar.
present(UINavigationController(rootViewController: pdfController), animated: true)
```

```objc
@import PSPDFKit;
@import PSPDFKitUI;

...

// Create the PSPDFDocument.
// This is the container for your PDF file. It can also manage multiple files.
NSURL *documentURL = ...
PSPDFDocument *document = [[PSPDFDocument alloc] initWithURL:documentURL];

// Create the PDF view controller.
PSPDFViewController *pdfController = [[PSPDFViewController alloc] initWithDocument:document];

// Present the PDF view controller within a UINavigationController to enable the toolbar.
UINavigationController *navController = [[UINavigationController alloc] initWithRootViewController:pdfController];
[self presentViewController:navController animated:YES completion:NULL];
```

==]

## What Next?

PSPDFKit for iOS has a vast API that allows you to fully customize things like the [appearance][Appearance Styling], the [annotation toolbar][Customize the Annotation Toolbar], and so much more. As a next step, we recommend that you consult the [API] and our [documentation guides][PSPDFKit for iOS Documentation]. Feel free to [reach out][Support Request] if you have any questions or concerns. We’re here to help!

[Download Trial]: https://pspdfkit.com/try/
[`PSPDFViewController`]: https://pspdfkit.com/api/ios/Classes/PSPDFViewController.html
[Using CocoaPods]: https://pspdfkit.com/guides/ios/current/getting-started/using-cocoapods/
[“Integrating PSPDFKit”]: https://pspdfkit.com/guides/ios/current/getting-started/integrating-pspdfkit/
[“Try the PSPDFKit Demo”]: https://pspdfkit.com/guides/ios/current/getting-started/try-the-demo/#integrate-the-pspdfkit-framework
[“Adding the License Key”]: https://pspdfkit.com/guides/ios/current/getting-started/adding-the-license-key/
[Appearance Styling]: https://pspdfkit.com/guides/ios/current/customizing-the-interface/appearance-styling/
[Customize the Annotation Toolbar]: https://pspdfkit.com/guides/ios/current/customizing-the-interface/customize-the-annotation-toolbar/
[API]: https://pspdfkit.com/api/ios/
[PSPDFKit for iOS Documentation]: https://pspdfkit.com/guides/ios/current/
[Support Request]: https://support.pspdfkit.com/hc/en-us/requests/new
