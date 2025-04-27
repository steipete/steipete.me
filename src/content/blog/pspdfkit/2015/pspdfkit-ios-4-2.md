---
title: PSPDFKit 4.2 for iOS
pubDate: 2015-02-03T12:00:00.000Z
description: >-
  PSPDFKit 4.2 is the result of more than 2 months of hard work and working with
  our customers to build the best version of PSPDFKit so far. READMORE
tags:
  - pspdfkit
source: pspdfkit.com
AIDescription: true
---


PSPDFKit 4.2 is the result of more than 2 months of hard work and working with our customers to build the best version of PSPDFKit so far.
READMORE

## Free Text Annotation Toolbar

We've spent a lot of time to improve the experience on creating free text annotations - now there's a great toolbar that offers the most used settings right away. Changing the font now just takes two taps and you don't have to exit edit mode to change the size.

![Free Text Annotation Toolbar](/assets/img/pspdfkit/2015/pspdfkit-4-2/free-text-annotation-toolbar.gif)

## Resizable Half-Modal Inspector

Our half-modal inspector that is displayed on iPhone learned some new tricks and automatically sizes itself based on the content displayed - and it's also resizable. We've also improved the way the scroll bar handles moving the content when a keyboard or the inspector is visible.

![Resizable Half-Modal Inspector](/assets/img/pspdfkit/2015/pspdfkit-4-2/half-modal-inspector.gif)

## Scrobble Bar Tweaks

Daniel, one of our new engineers, spent over two weeks just on the scrobble bar alone. The result is the same control, but improved in pretty much every way. It loads faster, thumbnails are perfectly overlaid with the current position view and if you show two pages at once, the bar will correctly reflect that. Details matter.

![Old Scrobble Bar](/assets/img/pspdfkit/2015/pspdfkit-4-2/scrobble-bar-old.png)

![New Scrobble Bar](/assets/img/pspdfkit/2015/pspdfkit-4-2/scrobble-bar-new.png)


## Modern WebKit &amp; the Gallery

When embedding web content in PDFs, we now use the modern `WKWebView` wherever possible, and the `PSPDFGallery` took over managing/displaying these views, making it even more flexible. Of course we also updated the internal browser, which will scroll with smooth 60 frames/second now on most websites. We've also worked on gallery performance, which is especially noticeable on pages that embed a lot of multimedia content - page creation/scrolling is much faster now.

## Security

We've added support for SQLCipher - it's now really easy to encrypt your whole `PSPDFLibrary`. The permission system got an overhaul and was renamed to `PSPDFApplicationPolicy` and learned many new features. Documents that are password protected automatically disable caching. OpenSSL has been updated to the latest version. We continue to invest heavily to offer a secure and tested product.

## Bar Buttons

The bar button system underwent some early spring cleaning - gone are the subclasses, we moved all settings related to sharing into `PSPDFConfiguration`. There are new helpers that allow you to easily manage the flow with the sharing controller without the requirement to have a `PSPDFViewController` visible. This might require a few small API changes on your side, but will make things a lot simpler in the future.

## Details, Details, Details

There are countless of small and little improvements that you might not notice, but your customers will. Thumbnails now fade smoothy from the page view to their small view; sound annotations automatically pause when you change the page and they are finally rendered in thumbnails as well; the form editor no longer shows the (mostly technical) form title when choosing form content; stylus drivers have been updated to work with the newest versions; the XFDF serializer can now write/read the GoToEmbedded action type and support for JavaScript in forms is now much more complete.

## CocoaPods

We're moved CocoaPods hosting to our backend. All you need to do is using the API key that you get in our [Customer Portal](https://customers.pspdfkit.com). [Learn more about CocoaPods integration here.](/guides/ios/current/getting-started/using-cocoapods/)

## A Note About iOS 8

We're huge fans of Apple's iOS platform, and it will take some time until [PSPDFKit Android](/android) reaches feature comparability. Apple changed a lot in iOS 8 and we really like the direction they are going. However, we also noticed that various features broke during that transition. During the last 4 months since PSPDFKit's 4.0 release, we've been reporting a lot of radars to help Apple build a better platform. This is eating up a lot of resources, and while [we are hiring](/careers) and our team is growing, we would have loved to spend this time on new features instead. Feel free to dupe [19592583](http://openradar.appspot.com/19592583), [19564341](http://openradar.appspot.com/19564341), [19556505](http://openradar.appspot.com/19556505), [19175472](http://openradar.appspot.com/19175472), [19096083](http://openradar.appspot.com/19096083), [19079532](http://openradar.appspot.com/19079532), [19067761](http://openradar.appspot.com/19067761), [19053416](http://openradar.appspot.com/19053416), [19045528](http://openradar.appspot.com/19045528), [18906964](http://openradar.appspot.com/18906964), [18921595](http://openradar.appspot.com/18921595), [18512973](http://openradar.appspot.com/18512973), [18501844](http://openradar.appspot.com/18501844) and [18500786](http://openradar.appspot.com/18500786) - these are by far not all radars we reported since 4.0, but these are specifically all regressions for functionality that used to work in iOS 7. They are all on OpenRadar and we published workarounds whenever possible.
