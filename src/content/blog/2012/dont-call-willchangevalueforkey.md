---
title: "Don't Call willChangeValueForKey Unless It's Really Needed"
pubDatetime: 2012-04-05T15:27:00.000Z
description: "Learn why willChangeValueForKey and didChangeValueForKey are unnecessary when using setter methods for KVO in Objective-C."
tags:
  - iOS-Development
  - Objective-C
  - KVO
  - Memory-Management
  - Best-Practices
source: petersteinberger.com
AIDescription: true
---

You're using KVO, right? So you most likely have already written code like this:

{% gist 2314685 %}

Carefully encapsulate your calls within a call to willChangeValueForKey/didChangeValueForKey to "enable" KVO.
Well, turns out, you just did [shit work](http://files.sharenator.com/shit_Engineer_explains_why_lightsabers_WOULDNT_work-s600x477-89574-580.jpg). There's no reason to do the will/did dance, as long as you are using a _setter method_ to change the ivar. It doesn't need to be backed by an ivar or declared as a property. KVO was written long before there was anything like @property in Objective-C.

In fact, I have been writing iOS apps for about four years and didn't know this. A [lot](https://github.com/mattt/TTTAttributedLabel/blob/d09777b2875381d660d1a183c0cb41b7f1068a32/TTTAttributedLabel.m#L226) [of](https://github.com/quamen/noise/blob/2021a1e9348ee9bb9c17b42f32f498d569b22d5e/Message.m#L20) [open](https://github.com/artifacts/microcosm/blob/a5adb56469aad80897f3496d71b150b6f3cbbcd7/TextureAtlas.m#L63)-[source](https://github.com/blommegard/HSPlayer/blob/6f4bb5215dd1f30a71d3fcdba46e3a7bcf3a84d1/HSPlayer/HSPlayerView.m#L278) [code](https://github.com/abrahamvegh/AVWebViewController/blob/f24720b414106ecb7bcd4a0ad5f7c6e34a1f2c8f/AVWebViewController.m#L64) also gets this wrong. Apple has some good KVO documentation, where it explains the concept of [automatic change notifications](http://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/KeyValueObserving/Articles/KVOCompliance.html#//apple_ref/doc/uid/20002178-BAJEAIEE).

There is a reason why you want to manually add willChangeValueForKey: most likely [changing a variable also affects other variables](https://github.com/BigZaphod/Chameleon/blob/d8a6d6c680abe4609ddad7b24f154f0166e486fa/UIKit/Classes/UIView.m#L224). The most popular example is NSOperation:

{% gist 2314833 %}

First, it wonders why the heck NSOperation calls these methods, and second, it calls will/did on isExecuting, isFinished, and isReady. Not on isConcurrent.

So let's try to figure out why. isConcurrent is defined like this:

{% gist 2324812 %}

It's a simple accessor, thus can't be overridden, and Apple has no reason to know when this changes; it's returning a constant value, after all. But why the will/did on the other accessor methods?

Have a look at the implementation of the isReady method:

{% gist 2324831 %}

Notice how this is also only a getter, but rather than returning an ivar, it checks all kinds of things. This is why, when any of the things being checked is changed, KVO must be manually called.

So these will/did calls in each of the setters lets NSOperationQueue and other observers know that isReady has been updated, and they need to re-evaluate isReady's value. This is a nice approach to prevent implementing setters for every value that isReady checks.

What Apple is doing here is combining keys for KVO on a higher level to reduce API clutter in the exposed class. Now we understand why it's so complicated. However, for the average "MyClass", this is usually overkill. Simple POCO objects (excuse me, switching from .NET-land ;) don't need this.

If you own the whole accessor and thus control the setter as well, just implement that one and let KVO do the magic.

{% gist 2324840 %}

There's also a second valid reason for using will/did, as [Matt Gallagher explains here:](http://cocoawithlove.com/2008/12/ordereddictionary-subclassing-cocoa.html)

> When you subclass an existing Cocoa class, its accessor methods may not automatically invoke KVO notifications even if they are not declared @dynamic. This is because existing accessor methods may directly access instance variables. (...) the solution is to add an appropriate set of -willChangeValueForKey: and -didChangeValueForKey: around the accessor method invocation.

There was a similar discussion on [Cocoabuilder](http://www.cocoabuilder.com/archive/cocoa/203855-why-kvo-did-will-change-methods-in-nsoperation.html). Have fun learning!

For the StackOverflow junkies: Here's [a similar discussion from SO](http://stackoverflow.com/questions/4346810/when-to-use-kvo-willchangevalueforkey-didchangevalueforkey). My favorite is Josh Caswell's answer, which neatly answers the original question: What is the purpose of will/didChangeValueForKey: When do I call these directly?

> When you need to provide a KVO implementation in the absence of a property or accessor; when a change in one property affects another; when a single change affects many keys; when a change to a collection object happens without using the KVO methods.

Just a tidbit from the memory management side: Manual KVO will retain both old and new values (if you supply them), if the affected type is an object.

**Update**: There's also [Automatic Key-Value Observing for (Cocoa)](https://github.com/github/akvo), a drop-in for manual KVO, but I haven't tried it.

**Update 2013**: New tools make working with KVO much easier. Personal favorites: [ReactiveCocoa](https://github.com/ReactiveCocoa/ReactiveCocoa) and [THObserversAndBinders](https://github.com/th-in-gs/THObserversAndBinders).

**Update 2014**: Also check out [KVOController](https://github.com/facebook/KVOController), a simpler wrapper from Facebook.
