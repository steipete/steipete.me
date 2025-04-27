---
title: "Inspecting APK Files"
description: "This article discusses the basics of Android reverse engineering using the Apktool, smali, and Java decompilers."
preview_image: /images/blog/2019/inspecting-apk-files/article-header.png
section: blog
author:
  - Tomas Surin
author_url:
  - https://twitter.com/tomassurin
date: 2019-01-09 8:00 UTC
tags: Android, Development
published: true
secret: false
---

This article presents the basics of Android reverse engineering. One of the most useful applications of these techniques is reverse engineering your own apps to assess how hard it would be to misuse your private code (for example, getting around your license checks). Another useful application is learning how a certain app solves some interesting technical issue or works around platform or vendor bugs.

Note that the information in this article is not intended for piracy or other illegal uses. Its main purpose is showing how to inspect existing Android apps for educational purposes only.

## What Are APK Files?

Android applications are distributed as APK files. APK files are basically [ZIP][] files similar to the [JAR][] files used to package Java libraries. An APK file contains app code in the [DEX][] file format, native libraries, resources, assets, etc. It must be digitally signed with a certificate to allow installation on an Android device.

### APK Package Contents

An APK file is a compressed package that contains the following files and directories:

- `assets` — directory with application assets.
- `res` — directory with all resources that are not compiled into `resources.arsc`. These are all resources except the files in `res/values`. All XML resources are converted to [binary XML][], and all `.png` files are optimized (crunched) to save space and improve runtime performance when inflating these files.
- `lib` — directory with compiled native libraries used by your app. Contains multiple directories — one for each supported CPU architecture ([ABI][]).
- `META-INF` — directory with APK metadata, such as its signature.
- `AndroidManifest.xml` — application manifest in the [binary XML][] file format. This contains application metadata — for example, its name, version, permissions, etc.
- `classes.dex` — file with app code in the [Dex][] file format. There can be additional .dex files (named `classes2.dex`, etc.) when the application uses [multidex][].
- `resources.arsc` — file with precompiled resources, such as strings, colors, or styles.

### APK Build Process

The Android app’s build process is fairly complex. Let’s dive into it for a bit so you can get a high-level understanding of how the APK is produced.

1. The process starts with the application’s source code in Java/Kotlin, along with its dependencies. First, this source code is compiled to Java bytecode using Java/Kotlin compilers. Note that the application’s dependencies are already compiled and require no additional processing in this step. These include both Android dependencies shipped as [AAR][] files and Java-only dependencies in the form of [JAR][] files.

2. Java bytecode produced in the previous step together with all the dependencies is then converted into [Dex][] files containing [Dalvik bytecode][] that can run on Android devices. This produces the `classes.dex` file (or multiple `classes*.dex` files if [multidex][] is enabled).

3. Application resources are compiled with the [Android Asset Packaging Tool][aapt2]. This tool processes all resources into a binary format optimized for Android use. Its output is an APK file with all resources except code — i.e. the `assets` and `res` directories, the `resources.arsc` file with precompiled resources, and the application’s manifest.

4. The compiled application code with all the `classes.dex` files produced in step 2 and the native libraries are packaged into the APK file.

5. The APK file is then optimized with [zipalign][]. This step ensures that all uncompressed data in the APK file is aligned to a four-byte boundary to improve runtime performance when accessing large binary data such as images.

6. Finally, the APK file is digitally signed so it can be verified and installed on any Android device.

The final APK file can be used for testing (debug builds) or released into the wild, either through a distribution platform such as Google Play, or as a standalone APK package that can be sideloaded by users.

## APK Inspection

Now you have some basic understanding of the APK file format and we can get started analyzing these files.

> **Note:** The APK of PSPDFKit’s [PDF Viewer][] with the package name `com.pspdfkit.viewer` is going to be used in all examples below.

Before we can start inspecting APK files, we first need to access them. This is straightforward when working with your own apps, as you should already have access to their APKs. Third-party apps can be pulled from any device they are installed on:

```sh
adb pull `adb shell pm path 'com.pspdfkit.viewer' | cut -d ':' -f 2` pdf-viewer.apk
```

### Unzip

As stated before, an APK is basically a zip file. So we can just use any unzip tool or file browser with support for zip files to look into an APK’s contents. This, however, has a very limited use case:

- We can extract resources and assets that are not processed or are just optimized during the build process. This includes `assets`, raw resources (in `res/raw`), and `.png` drawables (that are optimized but still in the PNG format).
- We are not able to get much information from `.dex` files, as these are binary files.
- Reading binary resources ([binary XML][] and `resources.arsc`) or a binary `AndroidManifest.xml` isn’t possible.

### Android Studio APK Analyzer

The simplest way of decoding the content of an APK is by using Android Studio, which includes an [APK Analyzer][] tool that provides a comprehensive set of tools for analyzing APK files with a matching UI. The APK Analyzer can be invoked by:

- Dragging and dropping the APK into the Android Studio window.
- Selecting the APK via the Build > Analyze APK menu item.

#### File Browser

The APK Analyzer provides the files browser with file sizes and their relative percentage of the entire APK size. This feature is useful in identifying the biggest parts of your app when optimizing its size.

#### Binary Resources Decoder

Binary-encoded resources and `AndroidManifest.xml` are decoded by the APK Analyzer. Having access to the decoded `AndroidManifest.xml` is especially useful for verifying results of the manifest merger that is used when building multi-module applications.

![APKAnalyzer-Manifest](/images/blog/2019/inspecting-apk-files/APKAnalyzer-Manifest.png)

We also get access to decompiled resources that are part of the precompiled resources file (i.e. `resources.arsc`).

![APKAnalyzer-Resources](/images/blog/2019/inspecting-apk-files/APKAnalyzer-Resources.png)

#### Dex Decoder

The APK Analyzer provides nice support for decoding Dex files.

The most useful feature here is the Referenced Methods column that shows counts for all method references. This information comes in handy when analyzing the number of references in apps in order to stay below the 64K methods limit.

![APKAnalyzer-MethodsCount](/images/blog/2019/inspecting-apk-files/APKAnalyzer-MethodsCount.png)

We can navigate through the entire code and search for usage of classes and methods by right-clicking on the class or method names and selecting the Find Usages option. We can also decompile classes and methods into smali bytecode by selecting the Show Bytecode option in the same context menu.

What is [smali][] bytecode, you ask? Well, it’s a disassembler syntax for [Dalvik bytecode][]. Its syntax is out of the scope of this article, but we’ll explain how to decompile APKs to more readable Java code further down.

### Apktool

[Apktool][] is a comprehensive solution for disassembling Android apps that have more features than the APK Analyzer. It allows for extracting and decoding all files in the APK with a single command:

```shell
apktool d pdf-viewer.apk
```

This produces a directory with decoded resources and a decoded manifest, along with disassembled smali bytecode. The biggest benefit of using Apktool is the ability to edit this disassembled data and build it back into a working APK file. Again, this is outside the scope of this article.

## Extracting Java Code

We’ve already seen how to inspect APKs and disassemble Dex files into smali bytecode. There are a few tools that can decompile application code into reasonably clean Java code.

We will use these two tools:

- [dex2jar][] is the suite of tools for working with Android `.dex` and Java `.class` files.
- [Java Decompiler][] (JD-GUI) is a utility that displays Java source code for `.class` or `.jar` files with Java bytecode.

The first step is to convert [Dalvik bytecode][] from our APK into the JAR file with Java bytecode. We’ll use the handy `d2j-dex2jar` from the dex2jar suite:

```shell
d2j-dex2jar -f pdf-viewer.apk
```

This produces the `pdf-viewer.jar` file that can be opened directly in the JD-GUI.

![JD-GUI](/images/blog/2019/inspecting-apk-files/jd-gui.png)

JD-GUI supports basic code navigation — for example, navigating to underlined symbols, searching for symbols by name, and resolving type hierarchy. However, if you miss your favorite editor, you can extract all sources via File > Save All Sources and open them in your editor of choice.

## ProGuard

As you can see in the screenshots above, most of the symbols in decompiled code are named with one- or two-letter names. This is the result of obfuscating PDF Viewer’s code with [ProGuard][]. This improves speed and makes it slightly more difficult for a potential attacker to navigate through our internal business logic.

Please note that I used the wording “slightly more difficult” in the previous sentence. That’s because ProGuard is hardly enough to warrant security of your application’s private code. Anyone with enough time can understand your code even when using ProGuard. You should never include any business-critical information in your applications, as this can potentially be misused by someone with enough time and knowledge.

Some apps are also using commercial obfuscation solutions, such as [DexGuard][], which make it almost impossible to reverse engineer them. DexGuard performs additional obfuscation steps on top of ProGuard, including runtime encryption of all classes and strings assets. Use these solutions if you want to make your apps safe (in practical terms) from the reverse engineering techniques described in this article.

## Conclusion

I hope that the techniques and tools introduced in this article gave you some valuable insight into how easy it is to take most Android apps apart. I also hope that the tools described in this article will become indispensable additions to your Android development toolbelt, allowing you to improve the quality of your apps by providing insight into your production APKs.

[zip]: https://en.wikipedia.org/wiki/Zip_(file_format)
[jar]: https://en.wikipedia.org/wiki/JAR_(file_format)
[dex]: https://source.android.com/devices/tech/dalvik/dex-format.html
[dalvik bytecode]: https://source.android.com/devices/tech/dalvik/dalvik-bytecode.html
[multidex]: https://developer.android.com/studio/build/multidex
[binary xml]: https://en.wikipedia.org/wiki/Binary_XML
[aar]: https://developer.android.com/studio/projects/android-library#aar-contents
[aapt2]: https://developer.android.com/studio/command-line/aapt2
[zipalign]: https://developer.android.com/studio/command-line/zipalign
[apk analyzer]: https://developer.android.com/studio/build/apk-analyzer
[smali]: https://github.com/JesusFreke/smali
[apktool]: https://ibotpeaches.github.io/Apktool/
[dex2jar]: https://github.com/pxb1988/dex2jar
[java decompiler]: http://jd.benow.ca/
[proguard]: https://www.guardsquare.com/en/products/proguard#manual/usage.html
[dexguard]: https://www.guardsquare.com/en/products/dexguard
[abi]: https://pspdfkit.com/guides/android/current/faq/architectures/
[pdf viewer]: https://pdfviewer.io/#android
