---
title: "Secure Media Playback on Android"
description: Picking smart defaults with security in mind when playing videos on Android.
preview_image: /images/blog/2017/secure-media-playback-on-android/blogpost-cover.png
section: blog
author:
  - Ivan Skoric
author_url:
  - https://twitter.com/skoric_
date: 2017-08-02 12:00 UTC
tags: Android, Development, Security
published: true
---

Did you know that PDF can contain videos? While the format was first created in 1993, it has evolved and didn’t take long to adopt multimedia content. PSPDFKit’s SDKs strive to support the complete PDF features set. Videos are often part of manuals and educational material, so it’s important to show them in PDFs. Our iOS SDK has supported embedded videos for years, and with [PSPDFKit 3.2 for Android][], the support now extends to our Android SDK as well.

READMORE

<video src="/images/blog/2017/secure-media-playback-on-android/video-annotation-sample-video.mp4"  width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

[Download a sample file with a RichMedia video here.](https://cl.ly/3I3v1E1m2K1f) ([Try with our free PDF Viewer apps](https://pdfviewer.io/))

When reading binary data embedded into a PDF document (to stream it to the user), there’s a chance that the data comes from an unverified source. This means you have to consider the security implications and possible problems that could result from reading malignant data.  

## Stagefright Bug

On July 27th, 2015, a security company called Zimperium publicly announced a bug named _Stagefright_, found inside the Android mediaserver’s `libStageFright` library that is part of the Android operating system.

<img alt="A regular breakpoint" src="/images/blog/2017/secure-media-playback-on-android/stagefright-bug-logo.png">

Stagefright’s description on [Wikipedia][] reads:

> Stagefright is the group of software bugs that affect versions 2.2 ("Froyo") and newer of the Android operating system, allowing an attacker to perform arbitrary operations on the victim’s device through remote code execution and privilege escalation. Security researchers demonstrate the bugs with a proof of concept that sends specially crafted MMS messages to the victim device and in most cases requires no end-user actions upon message reception to succeed - the user doesn’t have to do anything to ‘accept’ the bug – it happens in the background. The phone number is the only target information.

This bug was rated critical, as it allows remote code execution within the context of mediaserver service. The mediaserver, unlike third-party apps, has access to video and audio streams, and has special privileges not accessible otherwise.

The bug was fixed in [Security Patch Level of February 1, 2016][] on Android 6.0 and newer (API 23+). You can find details about the exploit in the [Hardening the media stack][] post on the Android Developers Blog.

## Picking Smart Defaults

In PSPDFKit for Android, there’s an option inside the configuration to select whether to enable video playback in a document or not. Taking the issues mentioned above into account, we’ve decided to enable video playback inside the PDF documents by default for devices that have the aforementioned security patch. Previously, video playback was disabled by default for all devices.

Added in Android API level 23, the [`Build.VERSION.SECURITY_PATCH`][] system property holds the release date of the current security patch installed on the device. The value is a string using a `YYYY-MM-DD` time format.

Using this, we can internally check whether to enable video playback by default inside our framework:

[==

```kotlin
fun isDeviceStagefrightPatched(): Boolean {
    return Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && isSecurityPatchNewerThan("2016-02-01")
}

fun isSecurityPatchNewerThan(date: String): Boolean {
    val patchDateFormat = SimpleDateFormat("yyyy-MM-dd")

    val patchDate = GregorianCalendar()
    patchDate.time = patchDateFormat.parse(Build.VERSION.SECURITY_PATCH) // obfuscated try-catch here

    val minPatchDate = GregorianCalendar()
    minPatchDate.time = patchDateFormat.parse(date) // obfuscated try-catch here

    return patchDate.after(minPatchDate) || patchDate.equals(minPatchDate)
}
```

```java
public static boolean isDeviceStagefrightPatched() {
    return Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && isSecurityPatchNewerThan("2016-02-01");
}

public static boolean isSecurityPatchNewerThan(String date) {
    SimpleDateFormat patchDateFormat = new SimpleDateFormat("yyyy-MM-dd");

    GregorianCalendar patchDate = new GregorianCalendar();
    patchDate.setTime(patchDateFormat.parse(Build.VERSION.SECURITY_PATCH)); // obfuscated try-catch here

    GregorianCalendar minPatchDate = new GregorianCalendar();
    minPatchDate.setTime(patchDateFormat.parse(date)); // obfuscated try-catch here

    return patchDate.after(minPatchDate) || patchDate.equals(minPatchDate);
}
```

==]

The above was implemented in [PSPDFKit 3.3 for Android][]. Users can still enable video playback for all devices, which makes sense if all of the documents being used are coming from a verified source.

To learn more about video annotations, samples and how to create them, check our [guide article][].

[PSPDFKit 3.2 for Android]: https://pspdfkit.com/blog/2017/pspdfkit-android-3-2/
[PSPDFKit 3.3 for Android]: https://pspdfkit.com/blog/2017/pspdfkit-android-3-3/
[Wikipedia]: https://en.wikipedia.org/wiki/Stagefright_(bug)
[Security Patch Level of February 1, 2016]: https://source.android.com/security/bulletin/2016-02-01
[Hardening the media stack]: https://android-developers.googleblog.com/2016/05/hardening-media-stack.html
[`Build.VERSION.SECURITY_PATCH`]: https://developer.android.com/reference/android/os/Build.VERSION.html#SECURITY_PATCH
[guide article]: https://pspdfkit.com/guides/android/current/annotations/video-annotations/
