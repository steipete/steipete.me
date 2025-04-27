---
layout: post
title: "Kernel Panics and Surprise boot-args"
date: 2020-05-20 10:00:00 +0200
tags: personal
image: https://pbs.twimg.com/media/EUBGuLIXgAEAQ5n?format=jpg&name=4096x4096
---

On March 24, 2020, my 16-inch MacBook Pro greeted me with a kernel panic. I ignored it the first time, but it started to become an everyday thing. There I was, having enjoyed a short moment of a bug-free setup, and it was interrupted yet again.

If you just came here, read the backstory: [The LG UltraFine 5K, kernel_task, and Me](/posts/the-lgultrafine5k-kerneltask-and-me/).

{% twitter https://twitter.com/steipete/status/1243854244115091456 %}

Was it just me? [No](https://twitter.com/jernejv/status/1243854771905273857?s=20), [it](https://twitter.com/SergejBerisaj/status/1243857963724558337?s=20) [seems](https://twitter.com/AlexManzer/status/1244606008955146240?s=20) [this](https://twitter.com/lostincode/status/1243900563902717953?s=20) [issue](https://twitter.com/collinluke/status/1251668176296910849?s=20) [is](https://twitter.com/pagetable/status/1244599318151155712?s=20) [fairly](https://twitter.com/BarrosMyles/status/1244021525562474497?s=20) [widespread](https://twitter.com/slaven/status/1244532699139731456?s=20). ([Even on the MacBook Air 2018](https://twitter.com/AVMatiushkin/status/1249671960713482240?s=20).) Great. (Honestly, just [search for AppleIntelFramebuffer on Twitter](https://twitter.com/search?q=AppleIntelFramebuffer&src=typed_query); this crash is everywhere!) Forced reboots are annoying, and I wanted to help, so I wrote a r̶a̶d̶a̶r̶ Feedback Assistant entry: FB7642937.

>Regression: MacBook Pro 16-inch panics almost every night in AppleIntelFramebuffer::setPowerState. This started with macOS 10.15.4

Some reports indicate that this happened earlier, with 10.15.3, but for me it started with 10.15.4. The panic backtrace is surprisingly readable and indicates a timeout in Intel’s graphic driver (AppleIntelFramebuffer):

```
panic(cpu 2 caller 0xffffff8014016487): "AppleIntelFramebuffer::setPowerState(0xffffff835c3b6000 : 0xffffff7f975f5d88, 1 -> 0) timed out after 45938 ms"@/AppleInternal/BuildRoot/Library/Caches/com.apple.xbs/Sources/xnu/xnu-6153.101.6/iokit/Kernel/IOServicePM.cpp:5296
Backtrace (CPU 2), Frame : Return Address
0xffffff83be6abb40 : 0xffffff80139215cd 
0xffffff83be6abb90 : 0xffffff8013a5a3c5 
(...)

BSD process name corresponding to current thread: kernel_task
Boot args: rootless=0 kext-dev-mode=1 agc=2 smc=0x2 watchdog=0 nvme=0x9 legacy_hda_tools_support=1 sandcastle=0 amfi_hsp_disable=1 chunklist-security-epoch=0 -chunklist-no-rev2-dev
```

## Fun boot-args

I posted about this on Twitter to learn more, but while nobody could tell me what was up, a friend noticed that I have “[fun boot-args](https://twitter.com/NSBiscuit/status/1243294676985294849?s=20).” WTH? 

I didn’t set any of these, but previously, I’d had to send my 16-inch MacBook in for repairs, as it had corrupted memory, resulting in [extremely](https://twitter.com/steipete/status/1230925689098002433) [weird bugs](https://twitter.com/jckarter/status/1230253181495459841) and [frequent kernel panics](https://twitter.com/gparker/status/1231155681991909376). Apple replaced most of the machine, so it came with a fresh install of macOS... and some interesting boot-args that they forgot to clear. (If you’re curious what these args do, some are [documented here](https://superuser.com/questions/255176/is-there-a-list-of-available-boot-args-for-darwin-os-x), and there are some more if you look toward the Hackintosh scene.)

## Are These Dangerous?

Having my main computer run with unknown boot-args did worry me. What did they do? I went on a googling spree to find out what all of these do.

[`rootless=0`](https://www.cryptomonkeys.com/2015/07/osx-rootless-boot-args/) — “Rootless (a security mechanism making its debut in El Capitan 10.11) restricts access to certain files, even as an administrative user, such as is provided by ‘sudo’. ”

[`kext-dev-mode=1`](https://apple.stackexchange.com/questions/311065/what-does-setting-boot-args-kext-dev-mode-do-to-set-the-serial-port) — This “is intended for development scenarios where you want to test unsigned kernel extensions. Thus allowing these to be loaded without testing if they are indeed signed.” This has been [replaced by SIP after 10.10](https://twitter.com/pmjordan/status/1264298856495435778?s=20).

[`agc=2`](https://gist.github.com/blackgate/17ac402e35d2f7e0f1c9708db3dc7a44) — This seems related to automatic graphic switching between Intel and AMD Radeon GPU drivers. The setting `2` seems to prevent the AMD chip from powering down. Information around this is shaky.

`smc=0x2` — SMC is short for [system management controller](https://support.apple.com/en-us/HT201295), which is what’s responsible for the battery, fans, sensors, and thermal management. While I found some reports with this flag, I couldn’t figure out what it does.

[`watchdog=0`](http://www.hari.xyz/2019/01/setting-up-os-x-for-kernel-debugging.html) — This “disables macOS watchdog from firing when returning from the kernel debugger.”

[`nvme=0x9`](https://pikeralpha.wordpress.com/2016/06/15/nvme-boot-argument/) — This controls the Non-Volatile Memory Express controller, and it might disable the ‘Apple SSD’ check. I couldn’t find info on 0x9.

[`legacy_hda_tools_support=1`](https://github.com/acidanthera/AppleALC/blob/master/AppleALC/kern_alc.cpp) — This unlocks “custom audio engines by disabling Apple private entitlement verification.”

`sandcastle=0` — This is definitely not [Project Sandcastle, which enables Android to run on iPhones](https://arstechnica.com/gadgets/2020/03/project-sandcastle-brings-android-to-the-iphone/). “Sandcastle” is a codename for something Sandbox-related; some birdies told me it could be related to [DataVaults](https://eclecticlight.co/2018/10/25/no-entry-%E2%9B%94%EF%B8%8F-access-controls-in-mojave/) - secured folders to which only Apple’s software has even read access, via specific entitlements. It could also be [related to SIP](https://twitter.com/stroughtonsmith/status/1264299624585715717?s=20).

[`chunklist-security-epoch=0 -chunklist-no-rev2-dev`](https://gist.github.com/devzer01/e24dc78150d574ade3382eaddaf1827a) — I link these together because they sound related, and they often show up in combination in random kernel panic reports. Apparently they have to do with EFI signatures.

Having a long list of- undocumented boot-args that seem to weaken security running on my machine for weeks is definitely worrying, and it’s not what you’d expect from a repair at an Apple Store.

Clearing bootargs only works in Recovery Mode (⌘-R at boot time), unless SIP is disabled:

```
sudo nvram boot-args=""
```

## Conclusion

Clearing the boot-args didn’t resolve the AppleIntelFramebuffer panics. So to fix this, I was left wondering, will Apple reply to my report? Read more in [How to macOS Core Dump](/posts/how-to-macos-core-dump/).
