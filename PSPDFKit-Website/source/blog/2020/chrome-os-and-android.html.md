---
title: "Chrome OS and Android"
description: "A look at the Google Chrome OS and Android ecosystem. "
preview_image: /images/blog/2020/chrome-os-and-android/article-header.png
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/Flashmasterdash
date: 2020-01-01 8:00 UTC
tags: Android, Chrome OS
published: true
secret: true
---

Google is heavily invested in the mobile space with their own mobile operating system, Android, running on millions of devices. And while Android is the dominant smartphone operating system in the world, unlike Apple’s iOS it never managed to become a viable solution for productivity seeking users on tablets or other devices with larger form factors.
Google's Chrome OS tries to make up grounds inside the Google software ecosystem and wants to bridge the gap between mobile devices and notebooks for productivity seeking users.

_This blog article was researched and written on a Google Pixel Slate running Chrome OS._

## What is Chrome OS?

Chrome OS is a Linux-kernel based operating system developed by Google and is based on the open source [Chromium OS][chromium os]. It uses the Google Chrome web browser as an integral part of its user interface. Chrome OS revolves around the Google cloud. It requires users to log onto devices using their Google accounts, and it deeply integrates Google services like Google Chrome, Google Drive, Google Docs, Google Play (for Android apps), and more.

Chrome OS supports running Android applications since the introduction of the Android Runtime for Chrome (ARC) in late 2014. Since then, a lot of things improved: a sandboxed file system for secure file system access by Android apps, direct access to Google Play for downloading Android apps, as well as (more recently on selected devices) direct access to Chrome OS devices using the [Android Debug Bridge (ADB)][adb].

Since 2018, Google added official support for running Linux applications on Chrome OS. This adds support for virtually any linux based application, while keeping up security of the Chromebook using a mixture of KVM and container virtualization. If you’re interested in the technical details of how Linux works on Chrome OS, you can have a look at the [Linux virtualization readme][linux virtualization] inside the Chromium OS project.

## Chrome OS position in the market

By bringing together three different powerful technology stacks (Web, Android, and Linux), there's little to miss out for productivity seeking people. This positions Chrome OS perfectly for many business in different work areas: sales, editing, presentations.,....

Use cases for Chromebooks include but are not limited to:

* Use of web applications that are built with modern web technologies like HTML, JavaScript, and also WebAssembly (like our own [PSPDFKit for Web][pspdfkit for web] that can also run standalone on a Chromebook without the need for a web server).
* Use web based office applications like GMail, Google Docs, or Microsoft Office 360.
* Educational use, like organizing, reading, and editing learning documents (e.g. PDF files). The wide variety of different available Chrome OS devices makes the operating system especially interesting for students).
* Entertainment activities like watching movies, listening to music, or playing games. The Android ecosystem offers a wide variety of content for most consumer groups.
* Software development: With support for Linux applications, Chrome OS can be used for the development of different tech stacks like Android (with [Android Studio for Chrome OS][android studio for chrome os]), Linux, or the web.

As you can see, the use cases of Chrome OS are many, and the operating system targets many different user groups. Thus, direct competition for the platform comes from Android (especially tablets), Apple iPads, as well as regular desktop notebook computers (running Linux, macOS, or Windows).

## Lineup of modern Chrome OS devices in 2019

Whether you're looking for a Chromebook to develop apps for, or you're longing for a device to perform your productive work on, there's a large variety of devices available in 2019.

Google's in-house developed Chrome OS lineup consists of two devices: The [Pixelbook](pixelbook) and well the [Pixel Slate][pixel slate]. While the Pixelbook is probably the most premium Chrome OS laptop to date (and as such a great device to work with), the Pixel Slate holds a unique position by being Google's only tablet computer of their current device lineup (there's no other Google Android tablet available right now). However, since Google [recently communicated][tablet development stop] they will no longer focus on developing tablets, apparently so that they can focus on their other products, the Pixel Slate will probably be the last of its kind made by Google.

Both the Pixelbook and the Pixel Slate offer a 2-in-1 experience, acting either as notebook computers or as a tablet. While the Pixelbook is a typical notebook, its attached keyboard can be folded to the back of the device, making it a thicker but not uncomfortable to use tablet. The Pixel Slate ships as a tablet (without hardware keyboard) but Google also provides a keyboard folio (with great tactiles), and hinged laptop covers are available for the Slate too.

Another selling point of both devices is the available Pixelbook Pen stylus (which has to be purchased separately). The pen offers fast and precise stylus input thanks to the built-in Wacom hardware, is pressure sensitive, and has tilt sensors (something that inside Google's ecosystem is only known by the Samsung S-Pen). The Pixelbook Pen is battery powered (using a tiny AAAA-battery) and can be used for both the Pixelbook and the Slate.

There's plenty of other options out there, covering most if not all user groups. To give you a glimpse of what's available, here are some other Chrome OS powered devices:

* [ASUS Chromebit CS10][asus chromebit]: A chocolate bar-sized Chrome OS stick that can turn any monitor or television into a Chrome OS powered computer.
* [ASUS Chromebox 3][asus chromebox]: A mini-computer coming in various flavors, offering plenty of options for home and commercial use.
* [Samsung Chromebook 3][samsung chromebook 3]: A decent Chrome OS experience at a great price point.

## Android on Chrome OS

When developing Android apps for Chrome OS, there's only a few rules that, when applied, will make your app Chrome OS-ready. We've summarized the most important steps of optimizing an Android app for Chrome OS.

### Handle Touch-Incapable Devices

Since not all Chromebooks out there have a touch screen, but most of them come with a keyboard as well as a trackpad, it makes sense to optimize your app for non-touch usage. Moreover, since Chrome OS is not only available for tablets or notebooks, but also for a variety of desktop computers, these will require full support for mouse and keyboard.

You can explicitly mark your app as compatible with non-touchscreen devices by specifying it inside the `AndroidManifest.xml`:

```AndroidManifest.xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          ... >
    <uses-feature android:name="android.hardware.touchscreen"
                  android:required="false" />
</manifest>
```

While it is not absolutely necessary to do this for newer Chrome OS devices, this will also ensure compatibility with older devices that are still used.

### Optimizing for User Input

There's a few user input rules that, when followed correctly, will ensure desktop-class behavior of your app on all Chrome OS devices:

* All targets should be clickable with mouse and trackpad. Also consider adding [contextual clicking handlers][] for performing right-clicks on your views.
* All scroll areas should be scrollable using a mouse wheel.
* Swipe gestures on views are hard to perform with a mouse or trackpad, so consider adding buttons that become visible upon hovering.
* Hover events should be implemented in a sensible (and not too aggressive) way. Also, consider defining [custom cursor hover icons][] based on the content that is shown and the actions that can be performed.
* Implement sensible and conventional keyboard shortcuts for actions like copy & paste, printing, searching, etc.
* Make sure your app implements an intuitive tab-key order. The Android framework provides APIs which can be used to [specify the focus order of views in your UI][view focus order]. This will also be used for tab navigation on Chrome OS.

There are many more things that developers should look for when optimizing for Chrome OS, and the best way to optimize your app is to directly use it on a Chromebook to find what works great and what needs to be improved.

### Multi-window mode

Chrome OS is much more a desktop OS than Android, in that it hosts a window manager similar to the ones on macOS, Windows, and Linux distros. In order to make your Android app feel at home in Chrome OS, you should make your activities multi-window ready as well as resizable.

#### Resizable Activities

On Chrome OS, apps will get resized fairly often. Since activities on Chrome OS live inside draggable windows, users will rearrange them as necessary, which also involves changing the activities size, for example by simply dragging the corner of it. If your app does not handle resizing of the window on its own (i.e. by specifying `android:configChanges="screenSize|..."`), make sure that your app is implemented upon these pillars:

* Make sure the entire user interface properly saves its state inside `onSaveInstanceState()`. This also benefits normal Android apps, by ensuring your app stays recoverable after being killed in the background.
* Make sure activity recreation is fast, by caching as much state in memory as possible. Typical ways to retain data across configuration changes are [retained fragments][], or [view models][].
* Activities that should not be resized, should explicitly state this inside the `AndroidManifest.xml`.

Besides these simple rules, it is worth mentioning that, in contrast to Android, the screen size is mostly never the window size. Developers should pay attention that they use the correct dimension accessors in their apps.

#### Document-centric Task Management

Consider reading an email inside your favorite mail app, and tapping a PDF attachment to view it. On Android, it is common that this opens one of the PDF apps you have installed on your device. Hitting "back" while viewing the PDF inside the second app should take you back to the email you were reading earlier. If you would instead land on the main screen of the PDF app, or even worse the home screen of your device, your current task would be interrupted.

This flow between screens and different applications is what Android calls [tasks][] and is an important component of Android's multi-tasking system. Since Chrome OS fosters multi-tasking across all apps, you should ensure that your app makes correct use of Android's tasks.

One specific feature that makes sense for tasks operating on documents is the so called document-centric task handling, where you can launch a separate task per document in your app — allowing you to have two different documents opened side-by-side. We implemented this feature in our [PDF Viewer for Android][pdf viewer], too, so feel free to try it out there.

## Web apps on Chrome OS

Since Chrome OS is backed by the Google Chrome browser, many of the apps running on the device are actual web applications. With the multitude of web technologies available, it oftentimes does no longer require a native application, to create true native experience and performance.

A great example of this are our [Windows][pspdfkit for windows] and [Electron][pspdfkit for electron] frameworks which are both build on top of our [PSPDFKit for Web][pspdfkit for web] SDK, and which parse, render, and modify PDF documents on your machine using WebAssembly.

## Chromebooks as productivity devices

This blog post only looks at the peak of the iceberg, and there's so much more about Chrome OS and apps running on Chromebooks that we wouldn't be able to fit here. While Chrome OS started as a cheap OS alternative for students and home use, it has already matured into a powerful ecosystem and is ready for productive use in many more markets.

Here at PSPDFKit, we know the importance of cross-platform support and are therefore invested in delivering our SDKs and tools for Chromebook users too. If you own a Chrome OS device and are interested in a demo of our software, feel free to [download a trial version][trial] of PSPDFKit for Android or PSPDFKit for Web, or check out our free [PDF Viewer app][pdf viewer].

[chromium os]: https://www.chromium.org/chromium-os
[adb]: https://developer.android.com/studio/command-line/adb
[linux virtualization]: https://chromium.googlesource.com/chromiumos/docs/+/master/containers_and_vms.md
[pspdfkit for web]: https://pspdfkit.com/pdf-sdk/web/
[android studio for chrome os]: https://developer.android.com/studio/install#chrome-os
[pixelbook]: https://store.google.com/product/google_pixelbook
[pixel slate]: https://store.google.com/product/pixel_slate
[tablet development stop]: https://www.theverge.com/2019/6/20/18693399/google-abandoning-tablets-pixel-slate-failure
[asus chromebit]: https://www.asus.com/us/Chrome-Devices/Chromebit-CS10/
[asus chromebox]: https://www.asus.com/us/Chrome-Devices/ASUS-Chromebox-3/
[samsung chromebook 3]: https://www.samsung.com/us/computing/chromebooks/under-12/chromebook-3-11-6---32gb-hdd--4gb-ram--xe500c13-k03us/
[contextual clicking handlers]: https://developer.android.com/reference/android/view/View.html#setOnContextClickListener(android.view.View.OnContextClickListener)
[custom cursor hover icons]: https://developer.android.com/reference/android/view/View.html#setPointerIcon(android.view.PointerIcon)
[view focus order]: https://developer.android.com/training/keyboard-input/navigation.html#Tab
[retained fragments]: https://developer.android.com/reference/kotlin/androidx/fragment/app/Fragment.html#setretaininstance
[view models]: https://developer.android.com/topic/libraries/architecture/viewmodel
[tasks]: https://developer.android.com/guide/components/activities/tasks-and-back-stack
[pdf viewer]: https://pdfviewer.io
[pspdfkit for windows]: https://pspdfkit.com/pdf-sdk/windows/
[pspdfkit for electron]: https://pspdfkit.com/pdf-sdk/electron/
[trial]: https://pspdfkit.com/try
