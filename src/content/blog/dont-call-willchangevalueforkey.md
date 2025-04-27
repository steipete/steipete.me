---
title: "Don\'t Call willChangeValueForKey Unless It\'s Really Needed"
pubDate: "2012-04-05 15:27"
description: "You\'re using KVO, right? So you most likely have already written code like this:"
tags: []
---

You're using KVO, right? So you most likely have already written code like this:

{% gist 2314685 %}

Carefully encapsulate your calls within a call to willChangeValueForKey/didChangeValueForKey to "enable" KVO.
Well, turns out, you just did [shit work](http://files.sharenator.com/shit_Engineer_explains_why_lightsabers_WOULDNT_work-s600x477-89574-580.jpg). There's no reason to do the will/did dance, as long as you are using a *setter method* to change the ivar. It doesn't need to be backed by an ivar or declared as a property. KVO was written long before there was anything like @property in Objective-C.

In fact, I have been writing iOS apps for about four years and didn't know this. A [lot](https://github.com/mattt/TTTAttributedLabel/blob/d09777b2875381d660d1a183c0cb41b7f1068a32/TTTAttributedLabel.m#L226) [of](https://github.com/quamen/noise/blob/2021a1e9348ee9bb9c17b42f32f498d569b22d5e/Message.m#L20) [open](https://github.com/artifacts/microcosm/blob/a5adb56469aad80897f3496d71b150b6f3cbbcd7/TextureAtlas.m#L63)-[source](https://github.com/blommegard/HSPlayer/blob/6f4bb5215dd1f30a71d3fcdba46e3a7bcf3a84d1/HSPlayer/HSPlayerView.m#L278) [code](https://github.com/abrahamvegh/AVWebViewController/blob/f24720b414106ecb7bcd4a0ad5f7c6e34a1f2c8f/AVWebViewController.m#L64) also gets this wrong. Apple has some good KVO documentation, where it explains the concept of [automatic change notifications](http://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/KeyValueObserving/Articles/KVOCompliance.html#//apple_ref/doc/uid/20002178-BAJEAIEE).

There is a reason why you want to manually add willChangeValueForKey: most likely [changing a variable also affects other variables](https://github.com/BigZaphod/Chameleon/blob/d8a6d6c680abe4609ddad7b24f154f0166e486fa/UIKit/Classes/UIView.m#L224). The most popular example is NSOperation:

{% gist 2314833 %}

Sometimes you might also want to optimize how often you're sending KVO notifications with overriding [automaticallyNotifiesObserversForKey:](http://developer.apple.com/library/mac/documentation/Cocoa/Reference/Foundation/Protocols/NSKeyValueObserving_Protocol/Reference/Reference.html#//apple_ref/occ/clm/NSObject/automaticallyNotifiesObserversForKey:) to disable automatic change notifications for certain properties.

In [this example](https://github.com/keremk/CViPhoneLibrary/blob/a845c169916c0dea05680773b10e85f8020ae700/CVLibrary/CVImage.m#L27), there might be expensive KVO observations when the image changes, so we want to make damn sure that KVO is only fired if the image actually is a different one than the image that is already set:

{% gist 2314760 %}

If you currently have such obsolete calls, they're not doing any harm. Incrementally called, willChangeValueForKey doesn't emit more notifications. Still, time to delete some code!

**Update:** Don't forget that there are more ways that'll save you manual calls to will/did, like using the little-known addition [keyPathsForValuesAffecting(PropertyName)](https://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/KeyValueObserving/Articles/KVODependentKeys.html#//apple_ref/doc/uid/20002179-BAJEAIEE), which utilizes some runtime magic to make KVO smarter. Here's a real-life example of how I used that on AFNetworking, so people can register a KVO notification on "isNetworkActivityIndicatorVisible" and it'll get sent every time activityCount is changed. (You'll also see that I do some [atomic updating](http://www.mikeash.com/pyblog/friday-qa-2011-03-04-a-tour-of-osatomic.html) that requires manual KVO.)

{% gist 2322095 %}