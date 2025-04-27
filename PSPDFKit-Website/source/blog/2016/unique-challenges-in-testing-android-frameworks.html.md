---
title: "Unique challenges in testing android frameworks"
description: Who you hire can have a dramatic effect on your team’s culture, company’s productivity and, overall, is the most influential factor in determining the success or failure of a company. Over the past six years at PSPDFKit, we’ve slowly learned what’s important, what works, and what doesn’t work, at least for us.
preview_image:
section: blog

author:
- David Schreiber-Ranner
author_url:
- https://twitter.com/Flashmasterdash
date: 2016-09-27 12:00 UTC
tags: Android, Development, Testing
published: false
---

At PSPDFKit we are producing powerful software to enable developers create PDF driven apps. Our Android and Core teams have been working together for now nearly two years, have released 39 versions of PSPDFKit for Android, each adding many different new features. Right now, we are 8 developers working on the mixed Android/C++ stack of PSPDFKit for Android. In order to keep a high quality standard while keeping our developers productive we have written an extensive suite of instrumentation tests and unit tests.

In this blog post I will tell you about our findings when writing that test suite. How does it work to test a framework? And what are the differences from testing an app? Let's have a look!

## Instrumentation tests vs. Unit tests

There are two different types of tests supported by Android: Local unit tests and instrumentation tests. Local unit tests are executed directly on the JVM of the development machine (i.e. you Linux, Mac, or Windows machine) and do not have the Android framework and Android OS at disposal. Instrumentation tests are deployed onto an Android device or emulator (alongside your app) applying all steps of the Android build chain (`javac`, `dx`, `aapt` and similar). The Android framework provides an instrumentation API to these tests, allowing them to observe and control the lifecycle of Android components, for example the lifecycle of your activity, to test their behavior in various scenarios.

### Structure of test code

Usually, test code resides next to the application code of your Android application module. Unit test code is located in the `test` source set and instrumentation test code is located inside the  `androidTest` source set. Note that this setup is the same, no matter if you are developing an app or a library.

```
my-project/
├── app/
|   ├── main/
|   ├── test/          <-- unit tests
|   └── androidTest/   <-- instrumentation tests
|
├── library/
|   ├── main/
|   ├── test/          <-- unit tests
|   └── androidTest/   <-- instrumentation tests
|
...
```

The following section will look at how instrumentation tests are installed and executed so that they can control the tested app.

### Deploying instrumentation tests

Let's first look at how test execution for a normal app works. Given that your tests run in debug mode, the instrumentation tests are compiled into an `app-debug-androidTest-unaligned.apk` and the app itself is bundled into the `app-debug.apk`. Both `apk` files are uploaded to the test device and installed.

```
$ adb push app-debug.apk /data/local/tmp/com.pspdfkit.viewer.debug
$ adb shell pm install -r "/data/local/tmp/com.pspdfkit.viewer.debug"
Success

$ adb push app-debug-androidTest-unaligned.apk /data/local/tmp/com.pspdfkit.viewer.test
$ adb shell pm install -r "/data/local/tmp/com.pspdfkit.viewer.test"
Success
```

After installation the test app can be launched in an instrumented process.

```
$ adb shell am instrument -w -r -e debug false com.pspdfkit.viewer.test/com.pspdfkit.viewer.test.ViewerTestRunner
```

Here's what happens inside the Android system:

1. The Android operating system will start a separate process for your test app.
2. It will then launch your production app inside the same process – this is basis of instrumented testing. If the app is already running inside a different process, that process is killed.
3. The instrumentation test runner is injected into your production app. In the example above, the Android system will create an instance of `ViewerTestRunner` (which indirectly inherits from [`Instrumentation`](https://developer.android.com/reference/android/app/Instrumentation.html)) and will inject it into the application. This is in contrast to a normal execution of your app, where the operating system would inject an instance of the standard `Instrumentation` class.
4. It will then start the JUnit test suite of your instrumentation test app, collecting the results.

## Android library tests

When developing a library you can't run it in production mode. When assembling a library is not packaged into an apk file. Hence, it can't be uploaded to a device for execution.

### Having a sample app

Usually, when developing a library, you will develop it inside a `sample` app. This app will showcase usage of you library but also be the initial integration test of your code. It will serve as a "vessel" for your library, and allow its installation and execution on an Android device.

```
my-project/
├── library/
|   ├── main/
|   ├── test/   	   
|   └── androidTest/   
|
├── sample/
|   ├── main/
|   ├── test/          
|   └── androidTest/   
|
...
```

# Recipes for library testing


## Have a separate test app

Usually when executing instrumentation tests you will put those tests into your `library/` gradle module.

```
my-project/
├── library/
|   ├── main/
|   ├── test/   	   
|   └── androidTest/   
...
```

## Dogfooding

> Dogfooding, or "eating your own dog food", is the technique of using your own product.

As a library developer you won't receive first-hand feedback from end customers (real feedback, crashes, analytics data) but you rather depend on the feedback of your customers (those implementing your library). It's not always possible to get the full picture, all of the information, and exact data. Sometimes customer crash reports are incomplete, requiring to communicate back and forth several times. Sometimes information is not completely true, it's like playing the telephone game.

You are suffering from second-hand feedback. Dogfooding can improve this situation in many ways.

### Use your end product

Write about issues with build tools, release builds, obfuscation, CI, ...

### Have a sample app

Alongside your library code, develop a sample application that showcases your API and maybe even builds some specific use-case.

### Keep contact with users
* Give support
* React to issues.
* Collect crashes
* Collect analytics.

### Have a real app
* This will turn your second-hand feedback loop into a first-hand feedback loop.
