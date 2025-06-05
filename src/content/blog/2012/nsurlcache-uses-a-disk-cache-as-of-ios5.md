---
title: "NSURLCache Uses A Disk Cache As Of iOS 5"
pubDatetime: 2012-04-10T19:37:00.000Z
description: "Discover how NSURLCache in iOS 5 now automatically implements disk caching to a SQLite database based on Cache-Control headers."
tags:
  - iOS
  - networking
  - performance
source: petersteinberger.com
AIDescription: true
---

While writing [AFDownloadRequestOperation](https://github.com/steipete/AFDownloadRequestOperation), a new subclass for [AFNetworking](https://github.com/AFNetworking/AFNetworking), I discovered that the behavior of NSURLCache changed between iOS 4.x and iOS 5.x.

Before iOS 5, NSURLCache just saved requests _to memory_, even if [the documentation said otherwise](https://developer.apple.com/library/ios/#documentation/Cocoa/Reference/Foundation/Classes/NSURLCache_Class/Reference/Reference.html) -- the diskCapacity property was silently ignored. This led to some open-source subclasses of NSURLCache, which retrofit disk caching. Most popular is [SDURLCache](https://github.com/rs/SDURLCache) and [my enhanced, faster fork of it](https://github.com/steipete/SDURLCache). Even Apple has an example online that shows how to [create a simple URLCache](https://developer.apple.com/library/ios/#samplecode/URLCache/Introduction/Intro.html).

As of iOS 5, NSURLCache automatically saves responses _to disk_. I haven't found anything in the release notes that confirms the change, but I tried it both with iOS 4.3/5.0/5.1 on the simulator and the device, and with every 5.x version, a disk cache file is created and populated. This is great, as many developers probably aren't aware of this and the system just does the right thing on its own -- and it's fast:

{% img /assets/cache_db.png [477] [116] [Cache.db] %}

If the [Cache-Control headers](http://condor.depaul.edu/dmumaugh/readings/handouts/SE435/HTTP/node24.html) indicate that this request can be cached, iOS automatically saves it to a local SQLite cache file in AppDirectory/Caches/(bundleid)/Cache.db. For example, `public, max-age=31536000` marks that the request cache will be valid for a year, as max-age is listed in seconds.

The SQLite scheme for the cache looks identical to the one used in OS X:

{% gist 2356581 %}

So, why should you care? Well, the Cache.db caches **any file** that has a correct Cache-Control header set. Thus, if you download a PDF document, it might end up in your disk cache as well, taking up twice the memory.

The [default NSURLCache](https://developer.apple.com/library/ios/#documentation/Cocoa/Reference/Foundation/Classes/NSURLCache_Class/Reference/Reference.html) will be used, with a disk limit of 20MB. You can easily test this with GDB/LLDB:

```objc
p (int)[[NSURLCache sharedURLCache] diskCapacity]
```

The `memoryCapacity` defaults to 40MB, although the cache will clear itself in low-memory situations.

So for downloads that you manually save to disk, you might want to override the [NSURLConnection delegate connection:willCacheResponse:](https://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/URLLoadingSystem/Concepts/URLOverview.html#//apple_ref/doc/uid/20001834-155585-BCIBICDJ) and return nil:

{% gist 2356842 %}

When creating NSURLRequest using [requestWithURL:cachePolicy:timeoutInterval:](https://developer.apple.com/library/mac/#documentation/Cocoa/Reference/Foundation/Classes/NSURLRequest_Class/Reference/Reference.html), you can define the cachePolicy, but this only allows you to choose if and how the cache will be _read_.

Available options are: only use the cache value (`NSURLRequestReturnCacheDataDontLoad`); try the cache and load if different (`NSURLRequestReturnCacheDataElseLoad`); or ignore the cache entirely (`NSURLRequestReloadIgnoringLocalCacheData`).

The default option, if not set explicitly, is `NSURLRequestUseProtocolCachePolicy`, which most of the time is equivalent to `NSURLRequestReturnCacheDataElseLoad`. This uses the cache if the object hasn't changed. There are a few other options in the enum, but those are unimplemented.

**Note**: There doesn't seem a way to _force_ caching of certain requests; connection:willCacheResponse: is only called if the response contains a Cache-Control header, according to [Apple's documentation](https://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/URLLoadingSystem/Tasks/UsingNSURLConnection.html#//apple_ref/doc/uid/20001836-169425):
{% blockquote %}
The delegate receives connection:willCacheResponse: messages only for protocols that support caching.
{% endblockquote %}

Lastly, Apple suggests that caching can also be fine-tuned with subclassing NSURLProtocol, which indeed allows some interesting use cases, like [providing a cache for UIWebView](http://robnapier.net/blog/offline-uiwebview-nsurlprotocol-588) or [decrypting files on the fly](http://aptogo.co.uk/2010/07/protecting-resources/).

If you're not yet using [AFNetworking](https://github.com/AFNetworking/AFNetworking), you really should. It's a big step forward compared to classical NSURLConnection handling, even if Apple recently added a few [new fancy shorthands](https://developer.apple.com/library/mac/#documentation/Cocoa/Reference/Foundation/Classes/nsurlconnection_Class/Reference/Reference.html) in iOS 5. In AFNetworking, your network operations are indeed subclasses of NSOperation, which allows much better control over what's currently running, and [AFHTTPClient](http://afnetworking.org/Documentation/Classes/AFHTTPClient.html) is the perfect base class to implement any API.
