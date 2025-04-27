---
title: Crazy Fast Builds Using distcc
description: How to dramatically shorten your build times with distcc
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2017-01-05 12:00 UTC
tags: Xcode, Android, NDK, Objective-C, C++, Development, Tools
published: true
---

At PSPDFKit we continue to grow our product range, working hard to add new and improve existing features, all while handling the countless special cases that the world of PDF contains. As a natural consequence of this, we have a large ever-growing code base. More code means longer build times and nobody likes longer build times. Here, we will describe to you how you can use the excellent tool `distcc` to distribute your build over many machines and cut your build times down to a fraction of their previous durations.


Serial Compilation             |  Parallel Compilation
:-------------------------:|:-------------------------:
![Serial](/images/blog/2017/a-problem-shared/compile-serial.gif) | ![Parallel](/images/blog/2017/a-problem-shared/compile-parallel.gif)


## Preparation

First, let me draw your attention to [_ccache_](https://ccache.samba.org). We have had a lot of success using `ccache`, which we wrote about before [_here_](https://pspdfkit.com/blog/2015/ccache-for-fun-and-profit/). I highly recommend you read that blog post first as this post is written with the assumption you have `ccache` set up as described in that blog post. It's absolutely possible to use `distcc` without `ccache` if you really need to but we wouldn't recommend it.

## distcc

[_distcc_](https://github.com/distcc/distcc) is a tool, in fact a set of tools, that enable you to distribute the compilation of C, C++, Objective-C and Objective-C++ files amongst a pool of servers (including your workstation) across a network. The only really hard requirement for build servers in a pool is that they *must* have the same version of the compiler installed as the one you are using on your primary machine. They do not need direct access to the source code you are building or even the system headers. Think of them as dumb appliances that get provided with all the input they need and their result is either a successfully compiled unit or an error.

It's worth pointing out that in order to benefit from distributing your build these build servers don't have to be particularly fast machines and don't need the fastest network connections. Of course if they do then all the better! Your primary machine can continue to compile as fast as it can while waiting for others to slowly compile something else. It's all happening in parallel so you always gain as long as you have enough files to be compiled. If your project contains only a few dozen files then this setup is probably not for you. Linking, on the other hand, must happen locally so that time is going to be the lower-bound on any build time. [_Hello, Ahmdal's law!_](https://en.wikipedia.org/wiki/Amdahl's_law)

In addition, you may come across mentions of something called `pump mode` but for now this can be ignored. Briefly explained, `pump mode` is an extra facility of `distcc` that can distribute the pre-processing of the compilation units to the build servers. Without `pump mode`, the pre-processing needs to be done on the main build machine prior to distribution. Remember, the build servers don't need file level access to headers or the source code. But a typical machine these days can keep 10 or 20 build servers busy with pre-processed compilation units. So unless you intend to set up a build farm with at least that many servers it is of no benefit to you.

## Xcode

Prior to Xcode 4.3, support for `distcc` was [built in](http://blog.mundue.net/2010/12/distributed-builds/). For reasons unknown Apple decided to remove support for distributed builds. Some efforts have been undertaken to [fill that gap](https://github.com/marksatt/DistCode). However, since Xcode 8 introduced code signing, plugins are effectively forbidden, although there are [workarounds](http://stackoverflow.com/a/38814459). Despite all this it is possible to set up distributed builds without relying on plugins or meddling with Xcode.

Currently `distcc` has a few small issues when it comes to working with the Xcode build of `clang`. Because `distcc` is a front-end for the compiler, `clang` and `clang++`, it must take all the arguments you would pass to `clang` and handle them appropriately, e.g. re-writing paths, etc. As of the current version of `distcc`, it's missing support for several options that are unique to Xcode's build of `clang`. Fortunately, it's not too difficult to patch  `distcc` and build it yourself. We have provided a copy of the patched [source here](https://github.com/PSPDFKit-labs/distcc).

Here is one way to set it all up.

1. Install the latest version using `brew install distcc`. (Use [homebrew](https://brew.sh/) and make sure autotools and automake are installed.)

2. Build the patched version by cloning the repo and following these build steps.

```bash
./autogen.sh
./configure --without-libiberty --disable-Werror
make
```

There's also [a similar fork](https://github.com/zqxiaojin/distccForXCode) for reference - quite a few people worked on that problem.

3. Replace the binaries installed by `brew` in `/usr/local/Cellar/distcc/` with the ones you just built.

To ensure everything is working fine, only use your workstation as a build server at first. This eliminates possible network issues from hiding any other problems. Once you know that `distcc` is working locally you can set up other build servers.

Ensure `distcc` and the other binaries it comes with (`distccd` and `distccmon-text`) are in your path. Run `distcc` once and it will initialize configuration files at `~/.distcc/`. The next step is to create a file `~/.distcc/hosts` within which we need to specify the addresses of the build servers. For now, just this workstation will be in the build server pool so your file should have this one line in it.

```bash
127.0.0.1
```

I prefer the address `127.0.0.1` instead of `localhost`. If you use `localhost` you may encounter issues with IPv6, unless of course you are using IPv6 exclusively.

In a terminal window, we now want to start a `distcc` daemon with the following command:

```bash
distccd --no-detach --daemon --allow 192.168.0.0/16 --allow 127.0.0.1 --log-stderr --verbose
```

The switches have the following purposes:

* `--no-detach` Do not detach from the shell you started it in. This enables you to end the daemon with `ctrl-c` etc. Alternatively, use `killall -9 distccd` to kill all daemons.
* `--daemon` Listen on a socket.
* `--allow` What address range should `distccd` accept connections from. The example above allows all connections from addresses starting with `192.168.`
  The second one also allows connections from the specific address `127.0.0.1` which we want too.
* `--log-stderr` Output a log to the console.
* `--verbose` Use this initially to debug issues until you are satisfied it is working.

Before you start `distccd`, you should check the tools you expect are in your path with `which clang` and `which as`, for example.

Now that we have a `distcc` daemon up and running, lets test it.

In a temporary directory on another terminal, create a simple c or c++ file with a _Hello World_ main in it. Now compile it but place the command `distcc` in front of `clang`:

```bash
export DISTCC_FALLBACK=0
distcc clang++ -c main.cpp
```

This should produce an executable binary and in addition in the console for the daemon you should see a lot of output. If it doesn't work you should get helpful output from `distcc` where you tried to compile and also from the daemon's output. Any code errors and warnings are reported as usual where you invoked `distcc`. Note that we set `DISTCC_FALLBACK` to `0` in order to prevent falling back to local compilation. I.e. we enforce distributed compilation and if it doesn't work it should not continue.

Now that we know we have a working setup, we need to extend our little scripts we added for `ccache` as described in the blog post [_here_](https://pspdfkit.com/blog/2015/ccache-for-fun-and-profit/) to call `distcc`. I prefer to only call `distcc` if the hosts file exists. If it doesn't then it should fall back to local compilation but I find it useful to be able to enable and disable by simple renaming my `~/.distcc/hosts` files. `ccache` checks a special environment variable `CCACHE_PREFIX` and if it is set then it places whatever it is set to in front of the call to the compiler. Add the following to the script before the call to `ccache`:

```bash
# Does the hosts file exist and is distcc in the path?
if test -f ~/.distcc/hosts && type -p distcc >/dev/null 2>&1
then
    # Tell ccache to prefix calls to the compiler with 'distcc'
    export CCACHE_PREFIX="distcc"
fi
```

Should you decide not to use `ccache`, you just need to prefix the call to `clang` with `distcc`.

Now we should be ready to build from Xcode via `distcc`!
While you are setting this all up for the first time, don't forget to clear your cache with `ccache -C` or else you'll simply be building from your cache, bypassing `distcc` entirely. That's obviously desirable later but for now we want to know if everything is working nicely together.

Now that you know you have `distcc` integrated into your build, it's time to set up some servers to speed things up!

On your other machines, install `distcc` as described above, not forgetting to replace the binaries with the patched ones you built yourself.

Note down their IP addresses or address names and add them to the `~/.distcc/hosts` file on your workstation.

Here is an example file:

```
alice-mbp.local
bob-mbp.local
macmini-office.local
127.0.0.1
```

With this configuration we have 4 build servers including this workstation. However, we still need to do one more thing to get Xcode to generate enough work for all the machines.

By default, Xcode will try and compile enough files in parallel to keep only your workstation reasonable busy. It has no idea we have this much power available now. We need to tell Xcode how many parallel compile jobs it can start.

Exit Xcode and set the following default.

```bash
defaults write com.apple.dt.Xcode IDEBuildOperationMaxNumberOfConcurrentCompileTasks 24
```

Next time you start Xcode it will take this value. It only reads it on startup so each time you change it you need to restart Xcode.
I set it to 24 here, 6 per build server. You will need to experiment with your setup to find the optimal setting.
A word of warning, *don't* forget to unset it when you aren't using `distcc` or your machine will grind to a halt.
In addition, remember the Xcode version (in fact the clang version) on all servers *must* be the same or you will get undefined behaviour.

Now, sit back, hit Build and feel the power!

If you wish to monitor where the build jobs are being handled, you can use the following in a terminal:

```bash
distccmon-text
```

Combined with the `watch` utility (`brew install watch`) you can have a nice little monitor running in a terminal window.

```bash
watch distccmon-text
```

## Android NDK

Setting up `distcc` for NDK builds is somewhat more complicated. It's not necessary to build a patched version of `distcc`, the official release works just fine. However, due to the NDK having different tool chains for each [ABI](https://developer.android.com/ndk/guides/abis.html) we are effectively working with multiple versions of the compiler and as previously mentioned this leads to undefined behaviour in the worst case and build errors in the best case if they get mixed during compilation. Perhaps one day the NDK will come with a completely unified tool chain that can target all ABIs but this is not the case right now. So the problem we have is: how do we get `distcc` to use the correct compiler for each ABI?

Our solution for this problem is to run a separate instance of the daemon `distccd` for each ABI we are targeting. E.g. if you are targeting `arm64-v8a`, `armv7-a` and `x86` you would start 3 separate instances of `distcc` on each build server. Instance 1 of `distccd` in an environment where it has only the `arm64-v8a` tool chain in its path, listening on a specific port reserved for that ABI. Instance 2 in an environment where it has the `armv7-a` tool chain in it's path, and again its own port. And, logically, instance 3 in an environment where it has the `x86` tool chain in its path and yet again its own port.

In order to keep things easy to manage, I found it useful to generate a standalone NDK tool chain for each of the ABIs we target. The NDK comes with a handy script to do this for us.

We need to generate one tool chain for each ABI:

```bash
./build/tools/make_standalone_toolchain.py --arch arm64 --api 22 --install-dir ~/arm64-toolchain
./build/tools/make_standalone_toolchain.py --arch arm --api 22 --install-dir ~/arm-toolchain
./build/tools/make_standalone_toolchain.py --arch x86 --api 22 --install-dir ~/x86-toolchain
```

Next, we want to start a `distccd` daemon for each ABI, perhaps in a separate terminal window each at first. This helps you to diagnose any issues with `--verbose` should you need to.

You first need to bring the correct compiler and tools into your `PATH` before starting the daemon.
For example, at this location `~/arm-toolchain/arm-linux-androideabi/bin` do the following:

```bash
export PATH=~/arm-toolchain/bin:~/arm-toolchain/arm-linux-androideabi/bin:$PATH
distccd --no-detach --daemon --allow 192.168.0.0/16 --allow 127.0.0.1 --log-stderr -p [port number]
```

The switches have the following purposes:

* `--no-detach` Do not detach from the shell you started it in. This enables you to end the daemon with `ctrl-c` etc.
* `--daemon` Listen on a socket.
* `--allow` What address range should `distccd` accept connections from. The example above allows all connections from addresses starting with `192.168.`
  The second one also allows connections from the specific address `127.0.0.1` which we want too.
* `--log-stderr` Output a log to the console.
* `--verbose` Use this initially to debug issues until you are satisfied it is working.

Before you start `distccd`, you should check the tools you expect are in your path with `which clang` and `which as`, for example.

The **crucial** part here is the last argument specifying a different port for each daemon. The default port is `3632` so I used ports after that in order to prevent accidentally offering up a daemon for non NDK builds. I used `3633` for `armv7-a`, `3634` for `x86` and `3635` for `arm64-v8a`.

Now we have a daemon running for each ABI, listening on its own port, we need to be able to direct our builds to distribute to the correct instance.

By default, `distcc` tries to read the list of build servers from a file located at `~/.distcc/hosts`. What we can do is set an environment variable instructing `distcc` to look in a different directory for the `hosts` file. This variable is named `DISTCC_DIR`.

For example, we could have three files, each containing the address and port number of a `distccd` instance:

`/Users/james/distccconf/Arm7/hosts` containing `192.168.1.123:3633`
`/Users/james/distccconf/Arm64/hosts` containing `192.168.1.123:3635`
`/Users/james/distccconf/x86/hosts` containing `192.168.1.123:3634`

Note in this example that they are all on the same machine listening on different port numbers. As you set up extra build servers you would simply add the address and port of each instance to each of these files.

Your build environment will differ from ours but the basic changes should look something like the following.

We use a custom Gradle task that runs `cmake` and `ninja`. In our Gradle task before launching the compiler, we set two environment variables. The path to the specific `distcc` hosts directory for the current ABI, and since we use `ccache` we need to tell it to prefix calls to the compiler with `distcc`.

```groovy
environment "DISTCC_DIR", "/Users/james/distccconf/" + currentABI
environment "CCACHE_PREFIX", "/usr/local/bin/distcc"
```

**Important**: We do **not** set these when calling `CMake`. Only when starting `make` or `ninja` to perform the compilation. `CMake` will choke when trying to test compiler features et cetera if you try and distribute that.

That should be enough to get your build up and running on a single machine. Once you have success there, add new build servers and don't forget to ensure they are all have the same version of the NDK.

Because `distcc` will almost silently fall-back to local compilation when things aren't set up correctly, you might not notice you have issues with your setup. Therefore, I suggest you also set `DISTCC_FALLBACK` to `0` which will stop the build if it fails to distribute build tasks. At least until you are confident in your setup. This will help you diagnose issues much earlier. The man page for `distcc` has good documentation for several other environment variables that can assist you, such as `DISTCC_LOG`.

Since this is a relatively complex build environment, I strongly recommend setting things up slowly, step by step, and testing each part so you know that it works.

Happy building!
