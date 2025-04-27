---
title: "PSPDFKit 5.4 for iOS"
section: blog

author:
  - Matej Bukovinski
  - Julian Grosshauser
  - Peter Steinberger
author_url:
  - https://twitter.com/bukovinski
  - https://twitter.com/jgrosshauser
  - https://twitter.com/steipete
date: 2016-07-01 10:00 UTC
tags: iOS, Features, New Release, Products
published: true
---

After a busy WWDC week we're back with a fresh new version of PSPDFKit for iOS. This time around the biggest changes happened under the hood. We made a big step forward towards our goal of completely migrating annotation support to a shared C++ core layer. For you, this mostly means improved annotation parsing reliability and fewer bugs overall, as the new implementation is heavily unit tested and already proven in our Android SDK, which ships with core annotations since version 2.4.

## Refreshed Page Labels

After seeing some of the new design language introduced in iOS 10, we realized that our page labels and back / forward buttons started to look a bit dated. So we decided it's time to give them a fresh paint job. Bot the labels and buttons should now work much better with lighter interfaces and since the buttons now reflect the global application tint color, they should also automatically became more accessible. At the same time we improved support for `UIAppearance`, ensuring you can easily customize those components to fit perfectly with your app's design.

![](/images/blog/2016/pspdfkit-5-4/page-labels.png)

## Security

With this release the focus was on security and general bug fixes/code stability. We did a code audit and improved various usages of potentially unsafe C functions and moved more code to safer, bounds-checked C++. We also added new API that allows creating a temporary data provider via `PSPDFFileManager` to use secure temporary files, if requested. [You can read more about our security approach in this guide article.](https://pspdfkit.com/guides/ios/current/faq/sdk-security/)

## SQLCipher Support

PSPDFKit relies on SQLite for a variety of features. To enable them, we link PSPDFKit with the dynamic SQLite library that is included with iOS. For most apps that's perfectly fine and all you need to know about SQLite. However in some cases your app might need a custom version of SQLite. You might, for example, want to use SQLCipher to encrypt the database data. Previously this was near impossible to get right and could cause horrible compatibility issues. We worked hard to improve this and are happy to announce that from version 5.4 onwards, PSPDFKit automatically uses custom SQLite versions linked into your app. You can read all about this new feature in a new [guide article](https://pspdfkit.com/guides/ios/current/miscellaneous/custom-sqlite-library).

## Signed Disk Image

We're now shipping our SDK in a developer ID signed disk image. This means you can now be absolutely sure that the image you downloaded was indeed created by us. We created a new [new guide article](https://pspdfkit.com/guides/ios/current/security/signed-disk-image/) that explains how exactly you can verify the disk image signature.

## API changes

Document `renderOptions` have been deprecated in favor of a version with an associated type. Take a look at `setRenderOptions:type:` and `getRenderOptionsForType:context:` to find out how this makes passing options more convenient. Our PSPDFProcessor API has gotten quite a few improvements over the last few releases. This time around the processor API was extended with an option that allows processing into a `id<PSPDFDataSink>` object. This, together with the new `-[PSPDFFileManagr createTemporaryWritableDataProviderWithPrefix:]` method now allows you to have a secure temporary file that can be used in the processor.

## iOS 10 & Xcode 8

So far we hadn't had any major issues compiling our framework with Xcode 8. With previous Xcode versions ensuring basic compatibility was a much lengthier process. We are already experimenting with iOS 10 and have even managed to squeeze a few related bug fixes into this release.

Our policy has always been to [support and fully test our framework on the latest two major iOS versions](/guides/ios/current/announcements/version-support/). The next version of PSPDFKit - version 6, will thus drop support for iOS 8 and fully embrace the new iOS 10 feature. At the same time will do our best to ensure version 5 works well on iOS 10, so everybody that has to support iOS 8, 9 and 10 at the same time will have the choice to do so.

## Things To Come

Over the coming weeks we'll be working hard on PSPDFKit 6, which you can expect in time for iOS 10. In addition to full support for iOS 10, it'll include an even deeper core annotation integration and some great new features.

We're also not yet done with PSPDFKit 5. In the near future you can expect a few more patch releases for 5.4. with additional bug-fixes and performance enhancements.

As always you can find a detailed writeup of all changes for PSPDFKit 5.4 in our [changelog](/changelog/ios/#5.4.0).
