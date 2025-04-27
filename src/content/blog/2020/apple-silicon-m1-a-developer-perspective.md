---
title: 'Apple Silicon M1: A Developer''s Perspective'
pubDate: 2020-11-28T13:00:00.000Z
description: 'I put the new M1 MacBook Air through its paces as a serious development machine. From benchmarking Xcode build times to testing various developer tools, I explore how well Apple''s transition to custom silicon works for real-world development workflows. While most apps run brilliantly via Rosetta 2 and native performance is stunning, I uncover both surprising benefits and important limitations developers should understand before making the switch. This early assessment reveals why M1 Macs represent a fundamental shift in the developer experience.'
heroImage: /assets/img/2020/m1/m1.jpg
tags:
  - iOS
  - macOS
  - Objective-C
  - SwiftUI
  - Debugging
  - Performance
  - Xcode
  - AppKit
  - Catalyst
---

The excitement around Apple's new M1 chip is everywhere. I bought a MacBook Air 16 GB M1 to see how viable it is as a main development machine — here's an early report after using it in production for a few days.

[![](/assets/img/2020/m1/m1.jpg)](https://unsplash.com/photos/vJqGI6-diO8)

Let me first start with the things everybody already talks about: Yes, this machine is blazingly fast. Safari is the snappiest it's ever been; the fans never turn on (there are none in the Air); the battery lasts for a very long time; and most apps just work, even though the architecture is completely different. The exceptions to "it just works" are anything that uses virtualization (because the hypervisor framework is limited), kernel extensions, or low-level tools.

What can we learn about the M1 chip that directly impacts performance? At the center is a completely custom design, with 16 billion transistors, built using a 5-nanometer process. The CPU cores are split: four are optimized for performance, and four are optimized for efficiency. Apple calls this arrangement a [unified memory architecture](https://en.m.wikipedia.org/wiki/Unified_Memory_Architecture), where the components have access to the same data without having to copy memory between different pools. There's also a built-in neural engine, which is becoming increasingly important for machine learning applications and some built-in features.

Apple doesn't share as many technical details as we'd like, especially around the GPU. However, I found a great source on Medium, [Arun Maini](https://medium.com/swlh/apples-m1-secret-coprocessor-6599492fc1e1), who took a closer look at the hardware:

> *"The firestorm cores within the M1 chip are the biggest, most powerful CPU cores ever made... The individual cores can go toe-to-toe with any x86 CPU in single-threaded performance (and I mean any, including both Intel's and AMD's recent 5950x). That's impressive enough and makes it the new fastest CPU core ever made. But the reason why Apple's SOC can beat most of Intel's high-end desktop parts in **multi-**core tasks is because of its incredible energy efficiency."*

When we talk about performance efficiency (the amount of power needed for a certain result), the M1 chip is a completely different world. The improved battery life is fantastic, but the far more interesting factor is that, since the chip draws less power, it also has more performance reserves, which Apple can use to drive boost frequencies that exceed the base frequency rate. The boost frequency is a factor of silicon lottery, cooling, and power.

If you're a mobile app developer, don't forget to check the battery usage monitor in Instruments. You'll see a nice breakdown of CPU, GPU, display power usage, and more. This feature has been around [since iOS 9](https://9to5mac.com/2015/09/15/ios-9-feature-spotlight-new-battery-usage-data-in-settings-including-battery-hogs-battery-stats/).

## Initial Setup After the Holidays

I ordered the MacBook Air 16 GB minutes after the presentation. It shipped from China and arrived after Thanksgiving. I set it up on Black Friday, so I definitely couldn't count on important issues being fixed over the weekend. As I already have a Mac mini (Intel) configured as a build server, I was interested only in using the M1 machine for compilation, running the main apps, and testing on Intel via CI.

I had to recreate my local environment. One extremely positive M1-related surprise is how fast it extracts large archives. For example, our toolchain bundle is a 2 GB download that expands into hundreds of thousands of small files, totaling more than 8 GB. This usually takes four to five minutes on my i9 Hackintosh, and much longer on my 13-inch 2019 MacBook Pro. On the MacBook Air, this took only one minute. This is an excellent example of how important memory bandwidth is:

![](/assets/img/2020/m1/memory.png)

While the M1 CPU has a theoretical maximum of 68 GB/s of memory bandwidth, Intel's i9 10900K is technically capable of 46 GB/s but scores far behind on benchmarks, for both memory read and copy. It seems like single-core performance is not enough if the memory connection is too restrictive. This makes me wonder if future chips for the 16-inch MacBook Pro might have even higher memory bandwidth, or if this is a limitation of how fast you can transfer to LPDDR4 memory today.

Note that Apple also uses clever caching and compression; [macOS 10.13+ uses the Compression Framework to cache the disk using a compressed in-memory cache](https://arstechnica.com/gadgets/2016/06/a-tour-of-macos-sierra-apples-macos-10-12-brings-siri-to-the-desktop/3/), and while there haven't been announcements to improve that for Big Sur, I wouldn't rule out changes.

## Installation of the Developer Toolchain

Since macOS 11 has been out for a while, most of the required tools already ran on Big Sur. Let's go through my most common development tools.

### Xcode

Xcode is one of the largest macOS applications, with hundreds of tools. Version 12.2 is the first one that's "Apple Silicon ready," and it's a universal binary.

One of the first things I did was run a quick performance test using [XcodeBenchmark](https://github.com/devMEremenko/XcodeBenchmark). This is a synthetic test simulating a large Xcode project, with mixed Swift and Objective-C code. The repository already has a list of Macs and results. I ran various other tests, and while they don't translate 1:1, they're close enough of a real-world scenario. The numbers tell the story:

* MacBook Air M1: 128s
* MacBook Pro 13-inch, 4 TB ports, 2020, i5: 221s
* MacBook Pro 16-inch, 2019, i9 9980HK: 139s
* Mac mini M1: 122s
* Mac Pro, Xeon W 10-core, 2019: 133s
* Hackintosh, i9 10900K 10-core, 2020: 103s

Only a 10-core high-end desktop CPU with unlimited power draw and tweaked frequencies beats the M1 MacBook Air, and not by a lot. When you compare laptops to laptops, there's just no comparison.

Xcode has far more to offer than just compilation. Here's a short list of observations about various Xcode features:

* The iOS simulator runs natively on the M1, and also supports x86_64 apps, which means it's running some form of Rosetta 2 on the iOS simulator. 
* The Mac Catalyst simulator runs both natively and under Intel mode, depending on the app.
* Interface Builder works, and while parts of it are slow as usual, I didn't experience any M1-specific slowdowns.
* Other tools, like Instruments, work — but with the constraint that, just like on earlier iOS devices, you can't profile an Intel process with an ARM device. So this works only for ARM-native apps.
* LLDB is complicated. Running an Intel process requires the Intel LLDB; running an ARM process requires the ARM LLDB. Xcode handles this automatically, but if you try this from the console, you need to run the correct architecture first (more on that later).
* The iOS, iPadOS, tvOS, and watchOS simulators all work.

Overall, Xcode is a pleasant experience on the M1, and it just works. There are some edge cases where you need to understand what's happening behind the scenes, as there are additional layers now. For example, if you're debugging a macOS app in Rosetta and have a native helper tool, they can't communicate because they're running in different CPU architectures. We have to rebuild our PSPDFKit for macOS tools as universal binary to resolve this.