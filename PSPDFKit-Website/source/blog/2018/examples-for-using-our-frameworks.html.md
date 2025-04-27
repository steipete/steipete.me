---
title: "Examples for Using Our Frameworks"
description: "Here at PSPDFKit, we believe doing practical work is the best way to learn things, so we decided to create a few example apps to help customers explore our framework."
preview_image: /images/blog/2018/examples-for-using-our-frameworks/article-header.png
section: blog
author:
  - Christoph Mantler
author_url:
date: 2018-10-08 8:00 UTC
tags: iOS, Android, Web, Wrappers, Development
published: true
secret: false
---

Here at PSPDFKit, we believe doing practical work is the best way to learn things, so we decided to create a few example apps to help customers explore our framework. In these apps, customers can test out various [examples][PSPDFKit iOS Guides Examples] while also looking at the code to see why the examples behave as they do. These projects can be found in the Examples folder in the .dmg / .zip file that can be downloaded from the [customer portal][Customer Portal] or in the corresponding GitHub repositories for our wrappers. But even if you’re not yet a customer, you can still try these out: A 60-day trial license can be downloaded from our [website][PSPDFKit Try], and this allows you to use all the existing examples.

## Example Projects

I’m going to go more in depth on the PSPDFKit for iOS example projects, as iOS is our oldest product, and as a result, it contains the most examples. However, we have examples for pretty much all of our products, including all our SDKs. We also provide examples for our various Xamarin, Cordova, and Electron wrappers. A list of all supported wrappers can be found in our [guides][PSPDFKit Guides Other Languages].

### PSPDFKit for iOS

A quick overview of the PSPDFKit for iOS examples can be found in our [Example Projects][PSPDFKit iOS Guides Examples] guide article. For more detail, read on.

#### PSPDFCatalog

The PSPDFCatalog example project contains the most examples, and you can find Objective-C and Swift sample code for various use cases. The examples are all placed into specific categories; some of the most important ones are listed below.

**Top Examples:** These examples are very good for people starting out with PSPDFKit, as most basic things — like displaying a PDF, showing specific items in the toolbar, or adjusting the appearance and brightness — are explained here. The Kiosk Grid example is very good for fast and easy testing of PDFs, as it shows all the documents in the Samples folder.

**Annotations:** In here you’ll find various examples of what you can do with annotations in PSPDFKit, including editing, creating, and customizing.

**Multimedia:** This section has examples pertaining to multimedia content. They show you how to integrate videos, audio, and HTML5 content/websites as part of a document page.

**Toolbar Customizations:** Here’s where to go if you’re looking to customize the toolbar and annotation toolbar of the app. It includes examples of how to add custom buttons to a toolbar, change the appearance of toolbar buttons, remove specific buttons, and change how the toolbar looks.

**Document Editing:** The examples in here show what the [PSPDFKit Document Editor feature](https://pspdfkit.com/guides/ios/current/features/document-editor/) can do. This includes creating a new page, duplicating pages, reordering and rotating pages, and exporting and deleting specific pages.

**View Controller Customization:** Some people may want to display a PDF and various views in their own way. Here is where to learn how to do things like customizing the thumbnail view, changing the configuration of a document, and modifying menus for color picking and text selection.

**Passwords/Security:** This section demonstrates how to encrypt and decrypt PDF documents. It includes examples that show how to create a password-protected PDF, how to preset a password in code for a protected PDF, and how to decrypt an AES256-encrypted PDF on the fly.

**Subclassing:** This presents various ways to subclass PSPDFKit, including changing the link border color, using a custom bookmark provider, or requesting a signature upon opening a document.

#### PSPDFSimple

The PSPDFSimple example project shows a very common use case of presenting a PDF using a [PSPDFViewController][PSPDFViewController API] subclass in a storyboard. As the name suggests, it’s a very simple project.

#### SwiftExample

The SwiftExample project is written in Swift 4 and contains various use cases of [PSPDFProcessor][PSPDFProcessor API] and [PSPDFLibrary][PSPDFLibrary API].


### PSPDFKit for Android

We also provide a lot of [examples for PSPDFKit for Android][PSPDFKit Android Guides Examples], such as the Catalog, which contains examples similar to PSPDFCatalog from PSPDFKit for iOS. There’s also the Simple App example project, which showcases the minimum amount of code required to build an app with PSPDFKit. It can be used as a great template for starting your app.

### PSPDFKit for Web

PSPDFKit for Web is one of our newest products, but it already has a lot of great examples for various cases, be it for the [standalone][PSPDFKit Web Standalone] or the [server-backed][PSPDFKit Web Server-Backed] version. For more information regarding these, you can check out the [example projects][PSPDFKit Web Guides Examples] guide article.

## Why Are Examples So Important?

The examples we provide are mainly written for our new customers, in order to ensure they have an easy way to get started using our product. However, they’re also incredibly helpful for existing users, as they can experiment with various parts of the SDK without having to first implement features into their apps to see how they work. Additionally, they are an efficient way to report bugs, as most of the time, bugs only occur with a certain configuration. As a result, customers don’t need to send us their entire project or build a sample project themselves, as a simple explanation of where they encountered a bug and which setup they used is often enough to track them down.

Things move fast at PSPDFKit, which means that new features are added all the time. Guide articles are certainly helpful, but seeing the related code in action and understanding how it works is a really great way to present new features to our users.

We get a lot of questions on support about how certain things work, but many of these questions already have an example that demonstrates and explains the exact use case. Additionally, our examples function as practical guides; they are meant to give you a general idea of how your projects will look in the end. A suggestion for those just starting with PSPDFKit is to go check out these examples first — in particular, the PSPDFCatalog — to begin exploring the endless possibilities of the framework.


[PSPDFKit iOS Guides Examples]: https://pspdfkit.com/guides/ios/current/getting-started/example-projects/
[PSPDFKit Android Guides Examples]: https://pspdfkit.com/guides/android/current/getting-started/example-projects/
[PSPDFKit Web Guides Examples]: https://pspdfkit.com/guides/web/current/pspdfkit-for-web/example-projects/
[PSPDFKit Guides Other Languages]: https://pspdfkit.com/guides/ios/current/other-languages/appcelerator-titanium/
[PSPDFKit Web Standalone]: https://pspdfkit.com/guides/web/current/standalone/overview/
[PSPDFKit Web Server-Backed]: https://pspdfkit.com/guides/web/current/server-backed/overview/
[PSPDFKit Try]: https://pspdfkit.com/try/
[Customer Portal]: https://customers.pspdfkit.com/
[PSPDFViewController API]: https://pspdfkit.com/api/ios/Classes/PSPDFViewController.html
[PSPDFProcessor API]: https://pspdfkit.com/api/ios/Classes/PSPDFProcessor.html
[PSPDFLibrary API]: https://pspdfkit.com/api/ios/Classes/PSPDFLibrary.html
