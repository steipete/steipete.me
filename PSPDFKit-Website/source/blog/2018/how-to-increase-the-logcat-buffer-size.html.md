---
title: "How to Increase the Logcat Buffer Size"
description: "Don't lose your logs. Increase your logcat buffer!"
preview_image: /images/blog/2018/how-to-increase-the-logcat-buffer-size/article-header.png
section: blog
author:
  - Nick Winder
author_url:
  - http://www.nickwinder.com
date: 2018-12-11 8:00 UTC
tags: Android, Development
published: true
secret: false
---

[Logcat][logcat] is the one tool every Android engineer uses. But have you ever been in a situation where the log files have been truncated and you have lost precious logging information? Here at PSPDFKit, we encountered this issue recently when browsing through a logcat dump to find an issue with our automated tests on continuous integration.

Logcat works like a [circular (ring) buffer][circular buffer]: Once all the space is used up, old data is removed as new data is added. On the emulators we were using, the default buffer size was 64 KB, which meant that our logs were being truncated pretty early on.

One option of dealing with this was to monitor the log remotely and save the logs on a host machine, but this would have been time-consuming and slightly cumbersome to set up. As such, a simpler solution was used: To mitigate truncation of the log files, we increased the maximum log buffer size.

To find out the current buffer size, we can send a simple command via adb:

```
adb logcat -g                                                                      
```

Doing so will return something similar to the following:

```
main: ring buffer is 256Kb (200Kb consumed), max entry is 5120b, max payload is 4076b
system: ring buffer is 256Kb (33Kb consumed), max entry is 5120b, max payload is 4076b
crash: ring buffer is 256Kb (0b consumed), max entry is 5120b, max payload is 4076b
```

This shows the three main log buffers that are commonly used with logcat. To list all of the [logcat buffers][], you can append the `-b all` option.

## Increasing Buffer Sizes

### Via adb

[Android Debug Bridge][adb] (adb) is a developer’s portal into the Android device, and using it, we can change the size of the buffer and capture more log data:

```
adb logcat -G 1M
```

The `-G` option will increase the buffer size to the given value. In this case, it will increase to 1 MB. You can use `M` or `K` to indicate megabytes and kilobytes, and you can set values between 64 KB and 16 MB. Once this is done, you can view the buffer sizes again to see the changed state:

```
main: ring buffer is 1Mb (242Kb consumed), max entry is 5120b, max payload is 4068b
system: ring buffer is 1Mb (133Kb consumed), max entry is 5120b, max payload is 4068b
crash: ring buffer is 1Mb (0b consumed), max entry is 5120b, max payload is 4068b
```

What if you don’t want to change every buffer? You can use the `-b` option again and only target the buffer you want to change. See [logcat buffers][] for more targets:

```
adb logcat -b main -G 16M
```

The above will result in the following:

```
main: ring buffer is 16Mb (243Kb consumed), max entry is 5120b, max payload is 4068b
system: ring buffer is 1Mb (134Kb consumed), max entry is 5120b, max payload is 4068b
crash: ring buffer is 1Mb (0b consumed), max entry is 5120b, max payload is 4068b
```

Something to be aware of when using this method is that the settings will not be persisted over reboots, so you will have to send this command on connection to ensure the buffers are set at the sizes you expect.

### Via the UI

As of Android 5.0, there’s also way to change the buffer size via [Developer options][developer options] on the device. First enable Developer options in Settings. Then navigate to the newly visible Developer options entry, scroll down, and click on `logger buffer size`. This will display options ranging from `off` to `16Mb`. I have found that when switching to `off`, logcat will still hold and report a buffer size of `64Kb`. A major advantage of using Developer options is that the selection will be persisted over reboots, but the disadvantage is that you cannot set each buffer individually.

![logger buffer size display options](/images/blog/2018/how-to-increase-the-logcat-buffer-size/logger-buffer-size.png)

## Conclusion

If you ever find that your log files are being truncated while developing and you need a fast way to maintain larger log files, changing the logcat buffer size is the answer. It’ll take a couple of seconds to change, and most devices today have more than enough space to support larger log file sizes. Whether to change the setting via adb or the UI is dependent upon your own use case and whether you want the settings to persist or not.

[logcat]: https://developer.android.com/studio/command-line/logcat
[circular buffer]: https://en.wikipedia.org/wiki/Circular_buffer
[logcat buffers]: https://developer.android.com/studio/command-line/logcat#alternativeBuffers
[adb]: https://developer.android.com/studio/command-line/adb
[developer options]: https://developer.android.com/studio/debug/dev-options
