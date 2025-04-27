---
title: "Android Debug Bridge Tricks and Tips"
description: "An introduction to Android Debug Bridge (adb) and an overview of some tricks."
preview_image: /images/blog/2019/android-debug-bridge-tips-and-tricks/article-header.png
section: blog
author:
  - Tomas Surin
author_url:
  - https://twitter.com/tomassurin
date: 2019-02-19 7:00 UTC
tags: Android, Development, Tools, ADB
published: true
secret: false
---

[Android Debug Bridge (adb)][adb] is an indispensable tool in any Android developer’s toolbelt because it allows you to communicate with any Android device. This communication exists in the form of app installation, file transfer, access to debugging information such as logcat, and access to a Unix shell that supports variety of commands that can be run on the device. This article presents the basics of adb as well as a few advanced tricks.

## What Is ADB?

adb is an application that consists of three components:

- A client that sends commands to the connected Android device. This is the shell command `adb` that runs on your dev machine.
- A daemon (adbd) that runs as a background process on a device and handles execution of received commands.
- A server that handles communication between the client and the daemon. The server runs as a background process on your dev machine and is started the first time you use the `adb` command.

These components communicate via TCP/IP protocol. When you invoke the `adb` command, the client first checks to see if the adb server is already running. If not, the server is started. After starting, the server sets up connections to adbd daemons on all connected devices. Once the connection is started, you can use adb commands to control these devices.

### Installation

adb is included in the Android SDK Platform-Tools package, which you can download with the [SDK Manager][]. You can find it in `android_sdk_directory/platform-tools/` after installation.

**💡 Tip:** If you don’t need/want the entire Android SDK ,you can also use the standalone [SDK Platform Tools][] package to install adb.

### Enable ADB Debugging on an Android Device

adb can only be used with devices that have enabled USB debugging in the device’s Developer options.

The Developer options are hidden by default. You’ll need to go to About phone in Settings and tap on Build number seven times until the toast with the text “You are now a developer” is displayed. Developer options will be displayed in the System section of the Settings screen.

**ℹ️ Note:** Some devices use a custom Settings app and Developer options might be located in a different location or named differently.

Now, after connecting to your device, a system dialog with the computer’s RSA key fingerprint will pop up. Accepting this dialog enables the execution of adb commands on this device. This is a security measure to make sure that adb commands from an unknown computer cannot be executed unless explicitly allowed on the device.

### Verifying the ADB Connection

You can verify that your device is connected to the adb server by invoking the `device` command, which lists all connected devices:

```shell
$ adb devices
List of devices attached
913a5739	device
```

If your device is not listed, try reconnecting the device and restarting the adb server via the following:

```shell
# Kill the server first.
$ adb kill-server
# The server will start again when running adb commands.
$ adb devices
```

**💡 Tip:** The `kill-server` command is generally useful for stopping the adb server when encountering issues such as when adb is not responding to a command or when it can’t connect to the device.

## File Transfer

Transferring files to and from an Android device can be problematic for newcomers. The simplest solution is to transfer files using the Media Transfer Protocol (MTP). However, this approach is cumbersome, because every time you reconnect your device, you need to enable MTP to transfer files.

![USB mode settings](/images/blog/2019/android-debug-bridge-tips-and-tricks/usb-transfer-files.png#img-width-50")

If you are like me and prefer the command line, adb provides a much more flexible solution for transferring files to and from your Android device. Just use the `pull` command to copy files and directories from the device and the `push` command to copy files and directories to the device:

```shell
# Copies file or directory with its sub-directories to the device.
$ adb push local_path device_path

# Copies file or directory with its sub-directories from the device.
$ adb pull device_path local_path
```

## Shell Commands Execution

adb supports the `shell` command that allows for the execution of Unix shell commands on the device.

You can enter a remote shell on a device via the following:

```shell
$ adb shell
```

**💡 Tip:** You can exit the remote shell by typing Ctrl + D or by typing `exit`.

You can also execute single shell commands via the following:

```shell
$ adb shell command_to_execute
```

Android devices support most basic Unix shell commands such as `ls`, `cat`, `cd`, and `rm`. There are also a few commands for interacting with Android services. The most useful ones are:

- `am` — provides access to ActivityManager. This allows you to start activities, stop processes, broadcast intents, and more.
- `pm` — provides access to application packages on the device. This allows you to list all installed packages, manage installed packages, work with application permissions, and more.

**💡 Tip:** You can run these commands without any parameters to print their usage, i.e. `adb shell am` and `adb shell pm`.

## Applications Management

adb can install and uninstall applications:

```shell
# Install APK files.
$ adb install path_to_apk_file

# Uninstall application by its package name.
$ adb uninstall application_package
```

If an application is already installed on the device, you can copy its APK file by combining the result of a `shell pm path` command with the `pull` command. For example, to download PSPDFKit’s own [PDF Viewer][] app, run:

```shell
$ adb shell pm path 'com.pspdfkit.viewer'
package:/data/app/com.pspdfkit.viewer/base.apk

$ adb pull /data/app/com.pspdfkit.viewer/base.apk viewer.apk
/data/app/com.pspdfkit.viewer/base.apk: 1 file pulled. 24.7 MB/s (43280655 bytes in 1.671s)
```

This can be combined into a simple one-liner:

```shell
$ adb pull `adb shell pm path 'com.pspdfkit.viewer' | cut -d ':' -f 2` viewer.apk
/data/app/com.pspdfkit.viewer/base.apk: 1 file pulled. 24.7 MB/s (43280655 bytes in 1.671s)
```

## Logcat

Android Studio provides the [Logcat window][android studio logcat], which supports the display of a device’s logcat. However, this is not usable when batch processing — for example, when archiving logs for failed builds on your CI.

Android devices ship with the `logcat` command available through `adb shell logcat` or via its alias `adb logcat`. Logcat dumps system and application log messages and prints them to the screen. Read more in [logcat’s documentation][logcat].

I would like to quickly mention one additional tool that works around the limitations of the default `logcat` command — namely its inability to filter output by application package (`logcat` only supports filtering based on process IDs). [PID Cat][] provides simple filtering for an application package together with enhanced formatting and coloring for the logcat messages:

```shell
$ pidcat com.pspdfkit.viewer
```

![PIDCat output](/images/blog/2019/android-debug-bridge-tips-and-tricks/pid-cat-output.png)

## Capturing Screenshots and Videos

Android devices usually ship with `screencap` and `screenrecord` shell utilities for taking screenshots and recording screen activity, respectively.

### Capturing Screenshots

Use the `screencap` shell command to capture device screenshots:

```shell
# Capture the screenshot to a local file.
$ adb shell screencap /sdcard/screenshot.png
# Copy the screenshot file from the device.
$ adb pull /sdcard/screenshot.png
```

Alternatively, you can use the `-p` parameter to output PNG data directly to the standard output:

```shell
$ adb shell screencap -p > screenshot.png
```

### Recording Videos

Use the `screenrecord` shell command to record screen activity:

```shell
# Capture the video to a local file.
$ adb shell screenrecord /sdcard/recording.mp4
# Stop the recording by pressing Command + C.
# Copy the recording file from the device.
$ adb pull /sdcard/recording.mp4
```

**💡 Tip:** Use the `screenrecord --help` command to see a list of available options, including options for controlling recording resolution and bit rate.

## Connecting to Multiple Devices

adb can connect to multiple devices at the same time. You must specify the target device when issuing adb commands when multiple devices are connected.

To do this, you’ll need to know the serial number of the target device. You can get the serial by using the `devices` command:

```shell
$ adb devices
List of devices attached
042531501315900588da	device
913a5739	device
```

Then use the `-s` option to specify the serial number of the target device:

```shell
$ adb -s 913a5739 install app.apk
```

If only a single emulator or a single hardware device is connected, use `-e` to target the emulator or `-d` to target the hardware device.

## Port Forwarding

You can use the `forward` command to forward requests on a host port to a different port on the device. This is usable if you want to connect to a server running on the device from your computer:

```shell
$ adb forward tcp:local_port tcp:device_port
```

The `reverse` command can be used to set up port forwarding in an opposite direction, i.e. to forward requests on the device port to a different host port. This is usable if you want to connect to a server running on your computer from the device:

```shell
$ adb reverse tcp:device_port tcp:local_port
```

For example, we are developing an Android client for our backend. We already have a local backend instance running on our computer on port 5000. We can connect the device to the same network and connect using our computer’s IP address, but a simpler solution is to set up port forwarding on the device:

```shell
$ adb reverse tcp:5000 tcp:5000
```

We can now connect to our backed running on the local computer via `localhost:5000`.

## Connecting to a Device via Wi-Fi

So far, we’ve only assumed that adb connects to a device over USB, but you can also configure adb to work over Wi-Fi. The setup consists of multiple steps, outlined below.

1. Connect your device and your computer to the same Wi-Fi network.

2. Connect the device to your computer via a USB cable.

3. Find the IP address of your device. For example, you can execute the `ifconfig` command on the device:

```shell
$ adb shell ifconfig wlan0
wlan0     Link encap:UNSPEC    Driver icnss
          inet addr:192.168.1.49  Bcast:192.168.1.255  Mask:255.255.255.0
          ...
```

4. Make the target device’s adb daemon listen for TCP/IP connections on port 5555 (the default port used by `adb connect` below):

```shell
$ adb tcpip 5555
```

5. Disconnect the USB cable from the device.

6. Connect to the device using its IP address:

```shell
$ adb connect 192.168.1.49
```

7. Verify that the connection works:

```shell
$ adb devices
List of devices attached
192.168.1.49:5555	device
```

You can now use adb commands remotely. Having a wireless adb connection is nice for decreasing your dependence on wires. The underlying TCP/IP transport is also super useful for building more advanced use cases. For example, you can tunnel adb connections on your CI server to your remote computer.

## Conclusion

This blog post covered various topics related to adb usage, and I hope that the tips and tricks explained in this article will make you more productive and happy Android developer.

[pdf viewer]: https://play.google.com/store/apps/details?id=com.pspdfkit.viewer
[sdk manager]: https://developer.android.com/studio/intro/update#sdk-manager
[adb]: https://developer.android.com/studio/command-line/adb
[sdk platform tools]: https://developer.android.com/studio/releases/platform-tools
[logcat]: https://developer.android.com/studio/command-line/logcat
[android studio logcat]: https://developer.android.com/studio/debug/am-logcat
[pid cat]: https://github.com/JakeWharton/pidcat
