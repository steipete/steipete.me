---
title: "How I Got Started with Flutter"
description: "A short review of Flutter from a mobile developer’s standpoint."
preview_image: /images/blog/2018/starting-with-flutter/article-header.png
section: blog
author:
  - Simone Arpe
author_url:
  - https://twitter.com/simonarpe
date: 2018-07-31 12:00 UTC
tags: Development, Flutter, Android, iOS, Tips
published: true
---

I recently watched a [talk from Adrian Holovaty at dotJS 2017][].
Even for the non-JavaScript developers like me, this talk is super interesting, and it offers up some ideas worth spending a minute or two on, including:

* The difference between a library and a framework  
* Paralysis by analysis  
* The paradox of choice  
* Native apps vs. web apps, and when to use them

And right at the end is my favorite line:
> "Do resist the urge to just feel stressed to learn every single thing."

This resonated with me, and I agree that if you want to check out new things, you should do it for your own pleasure and not just because “the cool kids” are switching to the _xyz_ framework.

If you check Holovaty’s product, [Soundslice][], you’ll see it’s very JavaScript heavy. What’s more is it isn’t using any of the latest frameworks around; rather, it makes use of [VanillaJS][].

Overall, I agree with Holovaty’s point of view about changing frameworks for reasons other than doing what’s cool. Even so, when I heard about something called Flutter that was attracting a lot of hype, I wanted to know more.

## What Is Flutter?

The eyes of the mobile community are all on [Flutter][] now, and the slogan on the company website sounds pretty promising:
> "Google’s mobile UI framework for crafting high-quality native interfaces on iOS and Android in record time."

That’s a strong statement, but one worth investigating.

I didn’t know much about Flutter other than the fact that it’s from Google, it’s cross platform, and it’s clearly a [React Native][] competitor.

So, to start my own journey of learning Flutter, I came up with a list of tasks to try out. My aim was to make sure they weren’t too deep so as to become a niche experiment, but also not so shallow that they didn’t contain a real use case for us. They consisted of:

* Installation and setup  
* Updates  
* Documentation  
* Community  
* Hot reloading  
* A real-world scenario: the PSPDFKit Flutter wrapper

## Installation and Setup: Fast and Painless

Installation was simple to understand and easy to do. Flutter is open source and hosted on [GitHub][], so to get started, you have to simply clone the repository and set some environmental variables and you are good to go. Developing Flutter apps can be done with various IDEs, like Android Studio or the command line.

Another way to install Flutter is using the [Flutter plugins][] available for Android Studio, IntelliJ, or VS Code, which will fire up the wizard and guide you through the installation process.

Among the binaries provided, there is `flutter doctor`, a very handy program that checks your system configuration for you and provides step-by-step actions to take in case of problems.

![Flutter doctor](/images/blog/2018/starting-with-flutter/flutter-doctor.png)

The verbose mode of flutter doctor is even more helpful; it prints out extensive information about the nature of an issue and how to fix it. To run the verbose mode, all you have to do is type `flutter doctor -d`.

## Updates: One Simple Step

To update Flutter to the latest version, all you have to do is run `flutter upgrade`. Even though I had a three-month-old version of Flutter running, the upgrade managed to complete the task without any errors. I admit I was pretty scared at the beginning, due to React Native updates, which are famously complicated. If you don’t know what I’m talking about/how React Native upgrades work and feel brave enough to dig in, [this is a good starting point][].

## Documentation: The Beauty of Clarity

Yes, documentation is where Flutter really shines. It’s astonishingly well-written, concise, and up to date.

![Flutter documentation](/images/blog/2018/starting-with-flutter/documentation.png)

The three main sections — Get Started, Widgets Catalog, and API Docs — are organized to give the user a gist of how Flutter is structured. The definition of a widget in Flutter varies a bit from the traditionally understood meaning, as widgets are the central class hierarchy in the Flutter framework. A widget is an immutable description of part of a user interface, and widgets can be inflated into elements, which manage the underlying render tree. Almost everything is a widget in Flutter, including alignment, padding, layout, and even the app itself. There are loads of widgets available, they work out of the box, and they can be modified to meet the users’ needs.

I really appreciated the documentation structure. Interesting to note is you won’t find two different sections (e.g. one for Android and one for iOS like I’ve found in React Native’s [documentation][]). This contributes to the idea that the two platforms are well integrated and not just bundled together under the same name.

## Community: All the Awesomeness from Dart

The community behind Flutter is partly inherited from [Dart][], the language Flutter is based on. The numbers are still relatively small, as it has _only_ 1,600 questions tagged on [Stack Overflow][]. However, the ecosystem is well organized and the [package repository][] has implemented some clever mechanisms to ensure that the packages that are actively maintained stand out from the rest.

![Dart packages](/images/blog/2018/starting-with-flutter/dart-packages.png)

Check out the [presentation][] from DartConf 2018, as it offers lots of insight on Dart and why the package repository is community driven.

## Hot Reload: Yes, It Works for Real

Hot reload on Flutter is a pleasant experience, and this is where Dart plays a key role: Dart is both compiled and interpreted.  

When developing, changes will be applied in real time using hot reload, and Dart is interpreted. When shipping production code, Dart is compiled, so it will be faster and optimized. On top of that, Dart is compiled directly to ARM architecture, which means no Java bytecode, and if you are an Android developer like me, you’re going to like that there is no method count limit. 😍

Hot reload proved to be really stable, and even in case of crashes, it managed to recover the state and reload the app without recompiling.

## Real-World Scenario: Running PSPDFKit in Flutter

On a recent Experimental Friday, I decided to put what I’d learned to the test and prepared for a long excruciating hacking session. Currently, the [PSPDFKit React Native wrapper][] is alive and kicking, but it was not built in a day. Instead, it required a lot of time and dedication, as React Native does not offer direct support for integrating third-party libraries with low-level integration.

Meanwhile, Flutter was designed to provide full integration with the native host.

![Project type plugin](/images/blog/2018/starting-with-flutter/project-plugin.png)
![Native host](/images/blog/2018/starting-with-flutter/native-host.png)

Because a PSPDFKit wrapper needs to implement a package that calls into platform-specific APIs, the [Flutter plugin][] serves this use case perfectly. As expected, based on my experience working with Flutter thus far, the documentation was rich in details and guided me along with every step. The Flutter wizard provided by IntelliJ even has the `Plugin` option in the project type, meaning that everything will be preconfigured and ready for the actual implementation to start. So, in a couple of hours, the [first working prototype came to life][].

<video src="/images/blog/2018/starting-with-flutter/flutter-pspdfkit.mp4" class="no-mejs" width="50%" style="display: block; margin:1em auto 2em auto !important;" autoplay playsinline  loop muted></video>

## Conclusion

The future is bright for Flutter, and it may worth investing in it especially because of [Fuchsia][], a mysterious new operating system backed by Google and mainly written in Dart.  

Additionally, Flutter offers a nice API and loads of great features like the hot reload. Even if the size has not yet been optimized, it is relatively small: To date, it’s 8 MB. The Flutter team did a great job on the upgrading process, and it runs smoothly every time; even after a long period, it proved to be rock solid, and running `flutter upgrade` did the job with no problems. While it’s still too early to make any definitive claims about Flutter, I enjoyed working with it and will keep my eye on it to see what happens next.

[talk from adrian holovaty at dotjs 2017]: https://www.youtube.com/watch?v=VvOsegaN9Wk
[soundslice]: https://www.soundslice.com
[vanillajs]: http://vanilla-js.com/
[flutter]: https://flutter.io
[react native]: https://pspdfkit.com/blog/2016/react-native-module/
[github]: https://github.com/flutter/flutter
[flutter plugins]: https://flutter.io/get-started/editor/#androidstudio
[this is a good starting point]: https://facebook.github.io/react-native/docs/upgrading.html
[documentation]: https://facebook.github.io/react-native/
[dart]: https://www.dartlang.org
[stack overflow]: https://stackoverflow.com/questions/tagged/flutter
[package repository]: https://pub.dartlang.org/
[presentation]: https://www.youtube.com/watch?v=iflV0D0d1zQ
[pspdfkit react native wrapper]: https://github.com/PSPDFKit/react-native
[flutter plugin]: https://flutter.io/developing-packages/#plugin
[first working prototype came to life]: https://github.com/PSPDFKit/pspdfkit-flutter
[fuchsia]: https://github.com/fuchsia-mirror
