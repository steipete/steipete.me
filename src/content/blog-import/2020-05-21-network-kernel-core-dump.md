---
layout: post
title:  "Network Kernel Core Dump"
date:   2020-05-21 12:00:00 +0200
tags: development
image: https://pbs.twimg.com/media/EUBGuLIXgAEAQ5n?format=jpg&name=4096x4096
---

A week after Apple's initial "macOS Core Dump" reply, and me sending a lot of questions their way, I got a really nice, human reply that explains the process via networking and a second Mac.

If you started here, read the backstory first: [How to macOS Core Dump](/posts/how-to-macos-core-dump/)

I am sharing this for future reference:

Any Mac will work as a coredump server; you just need a gigabyte or so of free space per coredump. The kernel dump client can only be configured to transmit on a hard-wired Ethernet port, either built-in or over Thunderbolt. There is no support for transmitting core dumps across the AirPort interface, USB Ethernet, or across third-party Ethernet interfaces. This is an issue for early MacBook Air models which have no built-in Ethernet or Thunderbolt interfaces.

On the server (non-panicking) machine run:
- `sudo mkdir /PanicDumps`
- `sudo chown root:wheel /PanicDumps`
- `sudo chmod 1777 /PanicDumps`
- `sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.kdumpd.plist`

To verify that the core dump server is active
`sudo launchctl list | grep kdump`  
This should return: `- 0 com.apple.kdumpd`

On the client (panicking) machine run the following commands
Locate the IP address of the core dump server.  
`sudo nvram boot-args="debug=0xd44 _panicd_ip=10.0.40.2 kdp_match_name=en7”`

Where `10.0.40.2` is replaced by the IP address of the server and en7 is replaced by the name of the client’s Ethernet interface. You can use this command to show all of the network interfaces on the system: `ifconfig -a`

Then reboot: `sudo reboot`

If you hang, NMI the machine by hitting the buttons Left-⌘ + Right-⌘ + Power. This will generate a coredump file on the server machine in the directory `/PanicDumps`. If you panic, the coredump file will be generated automatically on the server machine in the `/PanicDumps` directory. Compress the coredump file saved to `/PanicDumps`, and attach that to a feedback report. (Attachments have to be a zip, not a folder)