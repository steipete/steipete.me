---
title: Investigating Thread Safety of UIImage
pubDatetime: 2016-06-30T12:00:00.000Z
description: "Deep dive into UIImage thread safety issues and how to properly handle images in concurrent environments."
tags:
  - iOS
  - Development
source: pspdfkit.com
AIDescription: true
---

`UIImage` is one of the most important classes in UIKit. When compared to browsers, image handling on iOS is still quite tricky. Loading even a medium-sized image on the main thread will likely take longer than 16.6 milliseconds. Naturally, people identify this as an issue and move [image](https://bpoplauschi.wordpress.com/2014/03/21/ios-image-caching-sdwebimage-vs-fastimage/) [creation](https://www.objc.io/issues/5-ios7/iOS7-hidden-gems-and-workarounds/) to [background](https://github.com/AFNetworking/AFNetworking/blob/09658b352a496875c91cc33dd52c3f47b9369945/AFNetworking/AFURLResponseSerialization.m#L442-518) [threads](https://stackoverflow.com/questions/10149165/uiimage-decompression-causing-scrolling-lag).

Generally, the code is based on the assumption that `-[UIImage imageWithData:]` and `-[UIImage imageWithCGImage:]` are thread safe. But are they? Since February 2015, there's been [an issue on the AFNetworking repository](https://github.com/AFNetworking/AFNetworking/issues/2572#issue) that involves crashes around these functions. Since we do a lot with probabilistic image pre-caching and decompression in PSPDFKit, we ran into the issue as well. The crashes are quite rare and eventually somebody proposed a workaround so they never were a major issue.

## Let's Not Simply Trust Rumors

There were rumors that this issue was going to be fixed in iOS 10. So after the WWDC dust settled, I became curious if this was indeed the case and began the investigation. Is it even safe to _create_ an image on any thread? According to [Apple's Documentation](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIImage_Class/index.html), the answer is no or at the very least, it’s not guaranteed.

> Because image objects are immutable, you cannot change their properties after creation. Most image properties are set automatically using metadata in the accompanying image file or image data. The immutable nature of image objects also means that they are safe to use from any thread.

(note the word _use_ here - not create, although this is a bit vague)

In racking my brain, I did recall reading something about this in the iOS 4 release notes but when I went to find them, I discovered Apple's documentation only goes back as far as iOS 5. Enter wayback machine to the rescue and you find [the iOS 4 release notes](https://web.archive.org/web/20100812204946/http://developer.apple.com/iphone/library/releasenotes/General/WhatsNewIniPhoneOS/Articles/iPhoneOS4.html).

In iOS 4, these were the UIKit Framework Enhancements made:

> Drawing to a graphics context in UIKit is now thread-safe. Specifically: The routines used to access and manipulate the graphics context can now correctly handle contexts residing on different threads; String and image drawing is now thread-safe.; Using color and font objects in multiple threads is now safe to do.

Again, this statement only talks about drawing - not creating.

So, back to the original issue - how does several threads accessing the static builder cause a crash?

If we take a closer look at the crash stack trace we notice that it occurs during the deallocation of `UITraitCollection` with `pointer being freed was not allocated` printed out in the console. This indicates that the problem might be a race that causes a fresh `UITraitCollection` object to be over-released.

![Crash](/assets/img/2016/investigating-thread-safety-of-UIImage/crash.png)

This bug must be fairly new. At some point, `imageWithData:` and `imageWithCGImage:` were meant to be thread safe, since the underlying CoreGraphics calls are all thread safe. But then, retina came, and deadlines, the code got more complex, suddenly images had a scale and an implicit trait environment (so they can swap out when the environment changes), and someone needed to create a `UITraitCollection` object.

So, I set a breakpoint on who creates this object:

```
(lldb) bt
* thread #2: tid = 0xcbd57, 0x0000000102264afe UIKit`-[UITraitCollection _initWithBuiltinTraitStorage:clientDefinedTraits:], queue = 'com.apple.root.default-qos', stop reason = breakpoint 2.1
  * frame #0: 0x0000000102264afe UIKit`-[UITraitCollection _initWithBuiltinTraitStorage:clientDefinedTraits:]
    frame #1: 0x0000000102267342 UIKit`+[UITraitCollection traitCollectionWithDisplayScale:] + 78
    frame #2: 0x00000001017433c3 UIKit`-[UIImage(UIImagePrivate) _initWithData:preserveScale:cache:] + 211
    frame #3: 0x000000010173e4e9 UIKit`+[UIImage imageWithData:] + 69
    frame #4: 0x00000001006e60f5 UIImageWithDataMultithreaded`__29-[ViewController viewDidLoad]_block_invoke((null)=0x00007fff5f517a28, idx=11) + 69 at ViewController.m:25
```

This object is definitely created on a background thread, which is wasteful. Why is this not cached? I also added [my main thread guard](https://gist.github.com/steipete/5664345) that checks mostly for view access and that one did not trigger, so there are no views involved.

On iOS 10 it doesn't seem to crash anymore - but it certainly did in iOS 9.3 - see my [testcase](http://cl.ly/3f250F3X3m2Y). Let's enable zombie objects to see what's up here. It’s funny - the code here is so racy that the system sometimes even races on creating zombie classes:

```objc
ThreadSanitizer debugger support is active.
objc[47357]: Class _NSZombie_UIImage is implemented in both ?? and ??. One of the two will be used. Which one is undefined.
objc[47357]: Class _NSZombie_UIImage is implemented in both ?? and ??. One of the two will be used. Which one is undefined.
```

(This is no big deal, since it's just for debugging, but definitely interesting)

As soon as we enable the thread sanitizer and/or zombies, it does not crash anymore. Disabling that and playing with it some more showed something interesting in the stack trace:

![Backtrace](/assets/img/2016/investigating-thread-safety-of-UIImage/bt.png)

`UITraitCollectionCacheForBuiltinStorage`. The fun thing here is that this method lazily initializes a dictionary, using `dispatch_once` to make it thread safe, but then calls `void CFDictionarySetValue ( CFMutableDictionaryRef theDict, const void *key, const void *value );` without any locking protecting it. Here `value` is the new trait collection that is created and then set. Now, we race in the dictionary setter and an object gets over-released and we crash in `object_dispose`.

In iOS 9.3, `traitCollectionWithDisplayScale:` simply calls through to `traitCollectionWithDisplayScale`.

## How do things look in iOS 10?

The cache is gone - so things are more wasteful - BUT we no longer race since it seems the `UITraitCollection` objects do not share common data or access the main thread.

We can assume that the issue here has indeed be fixed. Apple clearly does not delete a cache for fun, especially not when there's so much to do around UIKit. However since we were all a bit lazy here, there is no radar filed where I could cross-check it and Apple's documentation seems inherently vague here.

A clear stand on `UIImage` creation thread safety would be great. I do believe that it's highly beneficial to keep this thread safe and it seems it is the case. However, we're a bit in the dark here and if it were to suddenly regress again, I'd love to know if this is, at least, a bug.

I filed [rdar://problem/26954460](https://openradar.appspot.com/26954460) to enhance the documentation.

Additionally, [we released a small open-source project with a workaround](https://github.com/PSPDFKit-labs/PSTModernizer) that patches UIKit at the correct place to fix the locking application-wide. [The current fix for AFNetworking](https://github.com/AFNetworking/AFNetworking/blob/3e8addb6537df7ae535df402680a4be93ae7a6a6/AFNetworking/AFURLResponseSerialization.m#L522-L533) does not apply globally, since it only adds additional locking for the internal AFNetworking calls. As soon as somebody else invokes `imageWithData:` on a background thread we're again facing a race condition. I'm not sure if it's the best idea and admittedly the crash is probably quite rare. However, depending on the scale of your app, it might still save thousands of crashers each day.

If you enjoy going deep on problems, then PSPDFKit is the place for you to be. [We're hiring!](/careers/)
