---
title: "How To Inspect The View Hierarchy Of Third-Party Apps"
pubDatetime: 2013-12-27T18:42:00.000Z
description: "Learn how to inspect view hierarchies of third-party iOS apps using a jailbroken device and debugging tools like Reveal for design insights."
tags:
  - iOS-Development
  - Debugging
  - Jailbreak
  - UIKit
  - Reverse-Engineering
  - Reveal
  - Tutorial
source: petersteinberger.com
AIDescription: true
---

I'm generally not a big fan of jailbreaks. Mostly this is because they're used for piracy and all the hacks result in weird crashes that generally are impossible to reproduce. Still, [I was quite excited about the recent iOS 7 jailbreak](https://twitter.com/steipete/status/414759423102689281), since it enables us to attach the debugger to third-party apps and do a little bit of runtime analysis.

Why? Because it's fun, and it can inspire you to solve things differently. Studying the view hierarchy of complex apps can be rather revealing and it's interesting to see how others are solving similar problems.
This was one thing that took many iterations to get right in [PSPDFKit, our iOS PDF framework](http://pspdfkit.com).

So, how does this work? It's actually super simple.

1.  [Jailbreak your device of choice](http://evasi0n.com/). I've used an iPad 4 here. Make sure it runs iOS 7.0.x. Both arm7(s) and arm64 devices will work now. **Don't jailbreak a device that's used in production.** Otherwise you lose a lot of security features as well. I only jailbreak a clean device and install some apps to inspect.

2.  Open Cydia and install OpenSSH, nano, and Cydia Substrate (previously called MobileSubstrate).

3.  Copy the Reveal library. Find out the device IP address via Settings and execute the following in your terminal (this assumes you have installed [Reveal](http://revealapp.com/) already):<br>
    `scp -r /Applications/Reveal.app/Contents/SharedSupport/iOS-Libraries/Reveal.framework root@192.168.0.X:/System/Library/Frameworks`<br>
    `scp /Applications/Reveal.app/Contents/SharedSupport/iOS-Libraries/libReveal.dylib root@192.168.0.X:/Library/MobileSubstrate/DynamicLibraries`.<br>
    For Spark Inspector, you would use `scp "/Applications/Spark Inspector.app/Contents/Resources/Frameworks/SparkInspector.dylib" root@192.168.0.X:/Library/MobileSubstrate/DynamicLibraries`<br>
    Note: The default SSH password on iOS is 'alpine.'

4.  SSH into the device and create following text file with `nano /Library/MobileSubstrate/DynamicLibraries/libReveal.plist`:
    `{ Filter = { Bundles = ( "<App ID>" ); }; }`<br>
    Previously, this worked with wildcard IDs, but this approach has problems with the updated Cydia Substrate. So simply add the App ID of the app you want to inspect, and then restart the app.

5.  Respring with `killall SpringBoard` or simply restart the device.

Done! Start your app of choice and select it in Reveal. (This should also work similary for [SparkInspector](http://sparkinspector.com/).) Attaching via LLDB is a bit harder and I won't go into details here since this could also be used to pirate apps. Google for 'task_for_pid-allow,' 'debugserver,' and 'ldid' if you want to try this.

<blockquote class="twitter-tweet" lang="en"><p>Tweetbot. The action bar is simply part of the cell. And the "No Tweets Found" view is always below the UITableView. <a href="http://t.co/Xp6OKlvaJh">pic.twitter.com/Xp6OKlvaJh</a></p>&mdash; Peter Steinberger (@steipete) <a href="https://twitter.com/steipete/statuses/416573601937375233">December 27, 2013</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" lang="en"><p>AppStore.app is super complex. SKUISoftwareSwooshCollectionViewCell. No wonder it took so long to become native. <a href="http://t.co/hjFdImyqSP">pic.twitter.com/hjFdImyqSP</a></p>&mdash; Peter Steinberger (@steipete) <a href="https://twitter.com/steipete/statuses/416579994027298816">December 27, 2013</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" lang="en"><p>Chrome is basically a full-screen UIWebView with some controls on top. <a href="http://t.co/CFfEM7j6vT">pic.twitter.com/CFfEM7j6vT</a></p>&mdash; Peter Steinberger (@steipete) <a href="https://twitter.com/steipete/statuses/416584566024208384">December 27, 2013</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" lang="en"><p>Surprise. PS Express is all native, even the classes are well structured. "AdobeCleanBoldFontButton". <a href="http://t.co/YW1xMNPSP2">pic.twitter.com/YW1xMNPSP2</a></p>&mdash; Peter Steinberger (@steipete) <a href="https://twitter.com/steipete/statuses/416579309412036608">December 27, 2013</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" lang="en"><p>Twitter. There's still a small part of <a href="https://twitter.com/lorenb">@lorenb</a> in there. (ABCustomHitTestView, ABSubTabBar) (Also: T1 as namespace?) <a href="http://t.co/R62JAY4DDQ">pic.twitter.com/R62JAY4DDQ</a></p>&mdash; Peter Steinberger (@steipete) <a href="https://twitter.com/steipete/statuses/416574990440738816">December 27, 2013</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
