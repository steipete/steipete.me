---
title: Using ccache for Fun and Profit
pubDatetime: 2015-10-06T12:00:00.000Z
description: "Complete guide to using ccache to dramatically speed up C/C++/Objective-C build times for large iOS projects and CI systems."
tags:
  - iOS
  - Development
source: pspdfkit.com
AIDescription: true
---

At PSPDFKit we work with a very large codebase: over 600k lines and growing. Of course we aim to write compact, efficient code — but the PDF specification is large, and there are many edge cases that need special treatment. Compile times became a real issue with [PSPDFKit 5 for iOS](/blog/2015/pspdfkit-ios-5-0/): the addition of a complete PDF renderer slowed down compile times a lot.
Our Android SDK had the same problem, and I learned about the ccache project a few months ago when our Android lead introduced it into our stack to fight the ever longer compile times of our C++ NDK code.

One more thing before we dive in. If you are working on large builds, once you've gone through this article and set up `ccache` you might find our article [_here_](https://pspdfkit.com/blog/2017/crazy-fast-builds-using-distcc/) on distributed builds using `distcc` of further benefit.

## What is ccache?

[ccache](https://ccache.samba.org/) is a compiler cache that transparently sits on top of the compiler and first checks its cache before falling back on actually compiling. It has a direct and a preprocessor mode and there are a few gotchas since Clang support was only really added in version 3.2, and the current version is 3.2.3. It’s a project [with a long history](https://ccache.samba.org/releasenotes.html) and it’s main focus is to be correct before being fast.

A web search for “ccache xcode” mostly yielded outdated information and after a quick try I couldn’t get it to work. As our codebase grew even more complex, test times went from almost unbearable to really unbearable — even though our Jenkins worker cluster now spans almost 10 Macs. After ranting on Twitter that administrating Jenkins is now [basically a full-time-job](https://twitter.com/steipete/status/650635755858063360), Christian Legnitto from Facebook (who used to manage Apple’s OS X releases) suggested that I should give [ccache another go](https://twitter.com/legneato/status/650726724490006528).

## Let’s get started

Installing ccache is simple: `brew install ccache` does the job (assuming [Homebrew](http://brew.sh/) is installed).

To make Xcode aware of ccache, we’ll use a small script that configures some environment variables then invokes ccache. Save this somewhere in your project and name it `ccache-clang`.

```bash
#!/bin/sh
if type -p ccache >/dev/null 2>&1; then
  export CCACHE_MAXSIZE=10G
  export CCACHE_CPP2=true
  export CCACHE_HARDLINK=true
  export CCACHE_SLOPPINESS=file_macro,time_macros,include_file_mtime,include_file_ctime,file_stat_matches
  exec ccache /usr/bin/clang "$@"
else
  exec clang "$@"
fi
```

Depending on your setup you will also need a variant named `ccache-clang++` where you replaced `clang` with `clang++` for C++.

While this looks a bit complex, it does the right thing and falls back on the regular compiler if ccache is not installed so new developers can build the project instead of being greeted with “ccache not found” errors. (`type` is a shell builtin, so the check is fast.)

Be sure to study the [configuration page](https://ccache.samba.org/manual.html#_configuration) as there are many options to try. We’re using quite aggressive caching and it’s working well. For your own project you might start out without `CCACHE_SLOPPINESS` and add that once everything is working.

The most important parameter here is `CCACHE_CPP2` — this works around a problem where Clang would process preprocessor-processed file output and potentially find many code issues that you would otherwise never see, like unneeded parentheses due to macro expansion. Using this option slows down compile times slightly, but they will still be much faster than not using ccache at all. [Peter Eisentraut did an excellent writeup about this.](http://peter.eisentraut.org/blog/2014/12/01/ccache-and-clang-part-3/)

You also need to define the `CC` variable in Xcode. At [PSPDFKit](https://pspdfkit.com) we do this in our `.xcconfig` files, which are shared across all our projects. (This is great to have a unified project configuration and something that is easily readable and diffable.) However you can set this inside your Xcode project settings instead.

`CC = "$(SRCROOT)/../Resources/ccache-clang";`

![Xcode with CC defined](/assets/img/2015/ccache-for-fun-and-profit/ccache-clang.png)

That’s all! The next full rebuild will actually be a bit slower, and you can run `ccache -s` to see if things are actually working. Initially there should be a lot cache misses, but when the cache starts to fill up subsequent compilations will run _a lot_ faster.

## Caveats

It’s not all golden: ccache comes with a few downsides. There is **no support for Clang modules** and ccache bails if it detects the `-fmodules` flag at all. You’ll need to go through your code and replace those pretty `@import UIKit;` lines with the old but compatible `#import <UIKit/UIKit.h>` — with all the downsides (such as macro overrides) that this way brings. However at PSPDFKit we use a lot of Objective-C++ and modules are mostly broken when using C++, so this didn’t affect us. After turning off modules you may need to add framework references that Xcode picked up automatically before: annoying but also done pretty quickly. You also need to stop using **precompiled headers**. These are not recommended by Apple anymore and generally considered bad style: it’s better be smart about what to import and where. It was rather easy for us to remove our few remaining uses of precompiled headers. And of course, ccache doesn’t help you at all for Swift files. While this also uses Clang, it’s quite a different fork and ccache has no idea about Swift files. Maybe this will change one day, but I wouldn’t count on it. Since Swift is still such a fast-moving target and not even binary compatible between minor releases, we can’t use it to build our SDK, so this wasn’t an issue for us either.

It’s always a good idea to check the ccache status during compile runs to see if any project emits incompatible flags. See the “unsupported compiler option” option. It took me quite a while to clean all our projects up. Setting the `CCACHE_LOGFILE` environment variable temporarily can be extremely helpful to see exactly what is wrong: ccache will tell you what flags it doesn’t like and when cache hits and misses are occuring.

```text
steipete@steipete-rmbp ~ $ ccache -s
cache directory                     /Users/steipete/.ccache
primary config                      /Users/steipete/.ccache/ccache.conf
secondary config      (readonly)    /usr/local/Cellar/ccache/3.2.3/etc/ccache.conf
cache hit (direct)                 42530
cache hit (preprocessed)           18147
cache miss                         28379
called for link                     1344
called for preprocessing             645
compile failed                         1
preprocessor error                     2
can't use precompiled header        2567
unsupported source language           12
unsupported compiler option        11564
no input file                          2
files in cache                    124223
cache size                           8.7 GB
max cache size                      15.0 GB
```

## Is it worth it?

To give you an idea, with ccache our Jenkins test workers run in an average of 8 minutes, while they needed about 14 minutes before. Compiling and packaging PSPDFKit in all its variants used to take 50 minutes on the fastest MacBook Pro money can buy, but with ccache this went down to 15 minutes. Adding ccache to our stack has been a _huge_ win and I’m amazed that I hadn’t heard about it earlier. What a great tool!

## Precompiled Header Issues

[Anton Bukov](https://twitter.com/k06a) writes to say that he resolved some issues by disabling `GCC_PRECOMPILE_PREFIX_HEADER` but keeping `GCC_PREFIX_HEADER`.
