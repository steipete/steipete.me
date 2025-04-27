---
title: "Our Journey from Genymotion to the Android Emulator"
description: "How we migrated our Genymotion-based CI to an AVD."
preview_image: /images/blog/2019/our-journey-from-genymotion-to-the-android-emulator/article-header.png
section: blog
author:
  - David Schreiber-Ranner
  - Reinhard Hafenscher
date: 2019-12-10 8:00 UTC
tags: Android, Development
published: true
secret: false
---

Earlier this year, we switched our complete CI infrastructure from using Genymotion to using the Android Emulator. This had been a long time coming, and there were many reasons for us to switch, which we will discuss in detail in this blog post. Let’s start out by looking into why we chose to use Genymotion to start with.

## Initially, It Worked for Us

Having a solid and well-tested framework is one of our main priorities, and as such, having the CI infrastructure to ensure that every merge gets tested is very important. Sadly, the Android emulator used to be quite slow, because it was actually emulating an ARM CPU. It was also notoriously unstable, which made it unsuitable for CI use.

Luckily for us, [Genymotion][] solved our problem with these issues by providing an x86-based virtual device that was fast and stable. Since Genymotion runs the Android OS inside a VirtualBox VM and is capable of running Android at high speeds, even on less performant developer machines, it was the go-to choice for most Android developers when it arrived on the scene. Naturally, we also adopted Genymotion here at PSPDFKit, using it both for fast local development and for running our CI.

However, there were also downsides to using Genymotion (high license costs, maintenance effort, complicated setup, etc.), which, over the years, caused us to look into alternative solutions.

## Why the Emulator

In recent years, Google took notice of the lack of performance and stability of its developer tools and the Android Emulator. With [Project Marble][], Google also invested time and effort in improving the speed and stability of its virtual devices, bringing them up to speed with (or even beyond) Genymotion when used for local development and CI purposes. This made us reconsider using it.

Moreover, there were additional reasons that ultimately motivated us to move away from Genymotion:

- Since the emulator ships as part of the Android SDK, it is much simpler to acquire and set up than Genymotion is (the latter also requires developers to sign up and purchase a license before being able to download and use the virtual device). This ease of setup is especially useful for other teams (like our QA team or other platform teams) that are less fond of Android development processes.
- The simplicity of setting up the Android Emulator also ousted Genymotion from being used by our Android developers locally during development. Having the Android Emulator locally but Genymotion on CI made it more difficult for us to reproduce test issues that only happened on CI machines. This cost time and got on our nerves.
- Cost-effective scaling was another concern. With only a hand full of Genymotion instances running in our CI, we felt the need for additional CI power but didn’t want our yearly costs to explode. Also, since the licensing system of Genymotion turned out to be cumbersome, the necessary work to keep the Genymotion machines up and running turned out to be substantial.
- Something that prevented us from scaling our Genymotion instances was that Genymotion requires a full desktop environment to be running, since there is no way to run it in headless mode. This meant that we required expensive macOS machines to run our CI infrastructure.
- This year’s advances in platform-independent emulator deployment using Docker images added extra fuel to the simmering idea of migrating to the Android Emulator (more on Docker-based emulation a bit further down in this post).

After repeatedly evaluating the stability and performance of the Android Emulator between 2017 and now, our team finally decided this year that the current state of the emulator and the benefits of switching to it would outweigh the necessary migration work — so we made the switch.

## Migrating from Genymotion to AVDs

Migrating our CI infrastructure and tests to [Android Virtual Devices (AVDs)][] wasn’t without its own challenges. Since setting up Docker to run our tests properly posed an additional hurdle (turns out fixing tests in a headless machine inside Docker is kind of complicated), we settled on the following strategy to get the emulator running on our CI machines:

- Set up the emulator to run directly on “bare metal” Linux machines by deploying the Android SDK to those machines.
- Ensure all of our instrumented tests run inside the new emulator.
- Do the “dockerization” of our emulators as a follow-up step.

### Starting the Emulator on CI

The outline for how we run the emulator on our CI machines works as detailed below.

1. We are managing our CI using [Buildkite][] (which replaced our Jenkins CI). This allows us to run multiple CI jobs and emulator instances in parallel on a single physical machine. The first step is to define a unique name and port for the emulator instance of our current job, which enables us to run multiple emulators on one host:

```
# Calculate a unique port for this job's emulator.
# `AGENT_NUMBER` is injected by Buildkite to distinguish between multiple agents running on a single machine.
PORT=$(((AGENT_NUMBER - 1) * 2 + 5556))

# When using `adb` to communicate with the emulator, we need to refer to the particular
# emulator instance using its unique serial. This helps avoid ambiguity when running multiple
# emulators on the same host. So calculate the serial, which is derived from the port the
# emulator instance uses.
SERIAL=emulator-${PORT}
export ANDROID_SERIAL=emulator-${PORT}
```

2. Then we make sure that adb is running on our CI machine:

```
adb start-server
```

3. Next, we remove any leftovers from previous builds. This is to ensure that we start clean in case a previous build failed for whatever reason:

```
adb -s $SERIAL emu kill
avdmanager -v delete avd -n "Nexus5X-$PORT"
```

4. We always create a fresh AVD for each test run so that there is no leftover state from previous runs:

```
avdmanager -v create avd --name "Nexus5X-$PORT" --package "system-images;android-28;default;x86_64" -d "Nexus 5X" -c 2G
```

5. Finally, we start the emulator:

```
emulator -avd Nexus5X-$PORT \
    -netspeed full \
    -gpu on \
    -netdelay none \
    -port ${PORT} \
    -wipe-data \
    -partition-size 2500 \
    -gpu swiftshader_indirect \
    -no-window \
    -skip-adb-auth
```

Once the emulator is launched, we need to wait for it to fully finish booting before we can actually install and run our tests. To achieve this, we continually check the `sys.boot_completed` property until the emulator is booted or until we detect a startup issue:

```
max_retries=40
retries=0
BOOT_COMPLETED='0'
while [[ ${BOOT_COMPLETED} != *"1"*  && $retries -lt $max_retries ]]; do
    BOOT_COMPLETED=`$ANDROID_HOME/platform-tools/adb -s ${SERIAL} shell getprop sys.boot_completed | tr -d '\r'`
    ((retries++))
    sleep 5
done

if [[ $retries -ge $max_retries ]]; then
    echo "Emulator didn't start in time, failing this build."
    exit 1
fi
```

And with that, we were ready to run our tests on CI. Of course, as we’ll see in the upcoming section, using Docker will save us the hassle of doing most of this emulator management manually in the future, but before getting to that, there is one more thing we needed to do.

### Making Our Tests Run in The Emulator

For us, the work wasn’t done here. That’s because we also used this moment as an opportunity to update the Android version we run our tests on, and since we’ve had years of tests written to run on a 5.0.1 Genymotion device, we had to update all of our tests to work on our new test platform. During the migration, there were two kinds of tests that needed updating:

1. **UI tests that rely on the specific size of a device.** For example, we had tests that asserted views, and, after applying some touch gestures to them, these tests contained specific hardcoded bounds. While our new test devices emulated the same hardware (our tests use the Nexus 5X template), system UI changes between Android 5 and Android 9 made our tests fail because coordinates were still off from the expected output and they needed updating.
2. **Tests that relied on being run on a specific API version for the behavior they were checking.** Updating those tests wasn’t as easy as changing a few coordinates around as, for the most part, they required us to come up with entirely new test cases.

With this done and our tests running on our new CI infrastructure, it was time to look into what we could do to improve CI even further. Here’s what we already did:

- Our first improvement was to triple the number of available emulators on CI compared to what we ran using Genymotion, resulting in reduced CI waiting time.
- We implemented [test sharding][], a useful feature of the Android instrumentation runner, which allowed us to reduce turnaround times of our CI tests by about 60 percent, or about 30 minutes.

But there’s more to come.

## Future Outlook

In migrating from Genymotion to the emulator, we have already improved our development workflows and CI testing environment a lot. But here are some more things we have planned to help make Android development at PSPDFKit faster and more stable.

### Emulator in Docker

One of the benefits of the Android Emulator is its ability to be run inside a Docker container. Docker-based emulators provide better portability, and ultimately, much easier scalability at a low cost. During this year’s Google I/O, Google published [a set of scripts][docker-scripts] for creating Docker images that can run the emulator. These scripts are now [available on GitHub][docker-github] too, and are as simple to use as the following:

```
emu_docker create <emulator-zip> <system-image-zip>
docker build src
./run.sh
```

While running the emulator on “bare metal” Linux servers works for us right now, migrating to the Android Emulator paved the way to move our tests into Docker, which will remove additional dependencies on the Android SDK and NDK. Furthermore, using Docker would also enable us to run tests inside our own cloud-based infrastructure (like on Google Cloud, AWS, or Azure) for easier scaling.

### Android Test Orchestrator

Another improvement we want to look into in the future is enabling the [Android Test Orchestrator][]. The Orchestrator runs each test case in a separate process, ensuring that all cases run completely isolated from the rest of the test suite, thereby preventing tests from failing due to state leaking between them. Furthermore, using the Orchestrator also stabilizes test suite execution by keeping a single faulty test case from killing the entire test process, which would prevent the rest of the test suite from being executed properly. At the time of writing this post, we have already started looking into enabling this and run into two different issues.

The first issue is that previously written parameterized tests started to fail when we ran them using the Orchestrator. We found out that the Orchestrator doesn’t support path separators ("/") inside test names because it creates a separate file for each test case it executes based on the test’s name. While it was easy to fix incompatible test names by avoiding path separators in them, it took some time to track this limitation down due to obscure test error messages and missing information in the Orchestrator documentation.

The other issue we are encountering is the test execution randomly stopping without any exception or other log pointing toward why. This is probably related to our own custom test runner, and it shouldn’t deter you from using the Orchestrator. In fact, we are already successfully using the Orchestrator to run instrumentation tests for our [PDF Viewer][] project, which has a much smaller test base than our framework does.

## Summary

In this blog post, we presented our journey of Android Virtual Device-testing at PSPDFKit. We showed that while Genymotion was a great fit for us in the past, the combination of Google’s investment in the Android Emulator and our ever-changing requirements made the emulator the better choice for us. While switching to the official Android Emulator took time and effort, the investment has already paid off, with faster CI speeds, better stability, and improved ease of use. We’re looking forward to the improvements we have planned, and we’re also excited about the future of the Android Emulator itself.

[genymotion]: https://www.genymotion.com/
[project marble]: https://medium.com/androiddevelopers/android-emulator-project-marble-improvements-1175a934941e
[android virtual devices (avds)]: https://developer.android.com/studio/run/managing-avds
[buildkite]: https://buildkite.com/
[test sharding]: https://developer.android.com/training/testing/junit-runner#sharding-tests
[docker-scripts]: https://androidstudio.googleblog.com/2019/05/emulator-ci-docker-scripts-for-linux.html
[docker-github]: https://github.com/google/android-emulator-container-scripts
[android test orchestrator]: https://developer.android.com/training/testing/junit-runner#using-android-test-orchestrator
[pdf viewer]: https://pdfviewer.io/
