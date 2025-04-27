---
title: "What Are Configuration Changes?"
description: "An overview of configuration changes on Android."
preview_image: /images/blog/2019/android-configchanges/article-header.png
section: blog
author:
  - Reinhard Hafenscher
date: 2019-03-05 8:00 UTC
tags: Android, Development
published: true
secret: false
---

Configuration changes can sometimes be hard to understand. This blog post aims to shed some light on them and help you understand them better. READMORE One of the most common causes of your app experiencing a configuration change is the user rotating their device. So let’s start by looking at what rotating the device does to your app. Then we’ll continue with an overview of how to handle configuration changes, along with a discussion of their advantages and disadvantages.

## How Rotation on Android Works

The way Android handles orientation changes is by destroying and recreating your `Activity`. This means that your `Activity` will go through all the lifecycle events associated with being closed. Then it will be restarted and go through its lifecycle events again.

![Lifecycle](/images/blog/2019/android-configchanges/lifecycle.png)

Since your `Activity` will be recreated, this means any data not persisted will be gone after rotation. This is, of course, far from ideal, so let’s look at one of the simplest solutions for this, which is disabling the behavior entirely.

## Handling Configuration Changes

Android provides a way for your application to opt out of being restarted when the orientation changes by defining [`android:configChanges`][] for your `Activity` in the manifest. This tells the system that you will be handling the specified configuration changes yourself instead of relying on the system to handle them for you. You can very granularly specify what kind of changes you want to handle, with the most common ones being `orientation` and `screenSize`. This will let you handle the user rotating their device, and instead of destroying the `Activity` and going through the associated lifecycle events, the system will just call [`onConfigurationChanged()`][] with the new configuration and keep your `Activity` alive.

![Configuration Lifecycle](/images/blog/2019/android-configchanges/config-lifecycle.png)

## Advantages of Handling Configuration Changes

One clear advantage of using [`android:configChanges`][], and probably the reason it is used most often, is because it saves you from having to write code to persist your `Activity` state. Since the `Activity` isn’t recreated, any data associated with it survives an orientation change. Another advantage is that, especially on slower devices, the experience when rotating the device is far smoother when [`android:configChanges`][] is used. Now, if all this sounds too good to be true, you’re right, because there are disadvantages as well.

## Disadvantages of Handling Configuration Changes

The biggest disadvantage of using [`android:configChanges`][] is that even when manually handling the configuration changes, you still have to implement `onSaveInstanceState()` so your app doesn’t lose its state when going into the background. This means that specifying [`android:configChanges`][] doesn’t actually save you any work, since after correctly implementing `onSaveInstanceState()`, rotation will also automatically work. In addition, now the automatic resource switching that Android provides no longer works. So if your app requires different resources based on screen size or orientation, it is now on you to update your views in the `onConfigurationChanged()` method in order to match the new configuration. This can unnecessarily bloat your `Activity` with code for something Android would have handled for you automatically:

```java
// Activity.java

@Override
public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    // This is called after the device was rotated.
    if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
        // Do something landscape specific.
    } else {
        // Do something portrait specific.
    }
}
```

Furthermore, some parts of your application might rely on lifecycle events being triggered when the orientation changes, and as such, don’t work correctly when using [`android:configChanges`][]. This means that in most cases, using [`android:configChanges`][] won’t net you any worthwhile benefits, all while causing additional work.

## Conclusion

While just specifying [`android:configChanges`][] in the manifest and forgetting about it can be tempting to quickly get orientation changes to work, it is by no means the correct solution to handle screen rotation. In the end, there is no way of getting around [correctly implementing `onSaveInstanceState()`][], since even if you are fine with the drawbacks of [`android:configChanges`][], you’ll still need `onSaveInstanceState()` to correctly work when your app is put into the background.

[`android:configchanges`]: https://developer.android.com/guide/topics/manifest/activity-element#config
[`onconfigurationchanged()`]: https://developer.android.com/reference/android/app/Activity.html#onConfigurationChanged(android.content.res.Configuration)
[correctly implementing `onsaveinstancestate()`]: https://pspdfkit.com/blog/2019/saving-the-activity-state/
