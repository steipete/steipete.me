---
title: "Filtering Tests in Android"
description: "A look at the android.support.test.filters library and what it provides you with."
preview_image: /images/blog/2020/filtering-tests-in-android/article-header.png
section: blog
author:
  - Ivan Skoric
author_url:
  - https://twitter.com/skoric_
date: 2020-01-08 3:00 UTC
tags: Android, Development, Gradle
published: true
secret: false
---

In Java, “[an annotation is a form of syntactic metadata that can be added to Java source code][java annotation definition],” which means that annotations are also heavily used in Android. And one interesting place where the power of annotations can be used is in Android tests.

READMORE

This article will cover some of the annotations available in the [Android test filters support library][], as well as share some examples of how you can create and use your own annotations to benefit your testing needs.

## Android Test Filters Support Library

At the time of writing, the [Android test filters support library][] contains seven different annotations that you can add to your tests to filter the methods you are testing. This allows you to create your own specific test suites. Using information from the [Android documentation][test filters documentation], let’s first analyze the provided annotations and how they can be used.

- [`@FlakyTest`][] is used to mark a test as being flaky (unstable). It allows you to specify a bug ID number and a description of the problem (why the test is flaky).
- [`@LargeTest`][] is used to assign a large test size qualifier to a test. This annotation can be used at a method level or a class level. Large tests are those that test the overall functionality of an application’s components. Basically every test that executes for longer than one second should be considered a large test.
- [`@MediumTest`][] is used to assign a medium test size qualifier to a test. These tests should be focused on testing a very limited set of components, and they usually last less than one second. Any blocking operations — such as network access — should be avoided, and mocks should be used instead. Resource access to the file system through well-defined interfaces like databases, `ContentProvider`s, or `Context` is permitted.
- [`@SmallTest`][] is used to assign a small test size qualifier to a test. These tests are expected to run in less than 200&nbsp;ms. This annotation should be used exclusively with unit tests. These tests should not: have any resource access, interact with the hardware, make binder calls, or instantiate Android instrumentation. They should focus on units of code to verify specific logical conditions.
- [`@RequiresDevice`][] is used to indicate the tests should not be run on the emulator, but rather on a real device.
- [`@SdkSupress`][] indicates that a specific test or class requires a minimum or maximum API level to execute, and that tests that are suppressed for the particular SDK level will not be executed.
- [`@Supress`][] is used to mark test methods or classes that shouldn’t be executed. If using JUnit 4, you can use its equivalent, the [`@Ignore`][] annotation, instead.

## Using Filters When Running Tests

In order to use the test filters, you have to set up the test execution through [Android Debug Bridge (adb)][]. To run the test manually through [adb][], build your project and install the test `.apk` files on the device you’re about to test on. You can achieve this via Gradle:

```sh
./gradlew installDebugAndroidTest
```

Now that the tests are installed, you can run tests using the adb. To run all instrumentation tests:

```sh
adb shell am instrument -w -r com.pspdfkit.testlab.test/androidx.test.runner.AndroidJUnitRunner
```

As you can see, we need to specify our test package and the default Android JUnit runner.

To specify additional options, we can use the `-e` flag. The `am instrument` tool passes testing options to `AndroidJUnitRunner` or `InstrumentationTestRunner` in the form of key-value pairs, using the `-e` flag, with the following syntax:

```sh
-e <key> <value>
```

Let’s go through some of the keys and see how we can utilize them.

### package

Use `package` to run tests only for the specified package:

```sh
adb shell am instrument -w -r -e package 'com.pspdfkit.testlab' com.pspdfkit.testlab.test/androidx.test.runner.AndroidJUnitRunner
```

### class

Use `class` to run tests only for a particular class:

```sh
adb shell am instrument -w -r -e class 'com.pspdfkit.testlab.ExampleInstrumentedTest' com.pspdfkit.testlab.test/androidx.test.runner.AndroidJUnitRunner
```

You can even run a particular test method:

```sh
adb shell am instrument -w -r -e class 'com.pspdfkit.testlab.ExampleInstrumentedTest#useAppContext' com.pspdfkit.testlab.test/androidx.test.runner.AndroidJUnitRunner
```

Run tests on all but a particular class:

```sh
adb shell am instrument -w -r -e notClass 'com.pspdfkit.testlab.ExampleInstrumentedTest' com.pspdfkit.testlab.test/androidx.test.runner.AndroidJUnitRunner
```

### size

Following the previously mentioned annotations, there are commands for executing particular test methods marked with the test annotations. For the sizes `@LargeTest`, `@MediumTest`, and `@SmallTest`, we have corresponding `size` values: `large`, `medium`, and `small`, respectively. So for example, say we execute the following:

```sh
adb shell am instrument -w -r -e size large com.pspdfkit.testlab.test/androidx.test.runner.AndroidJUnitRunner
```

This will run all test methods marked with `@LargeTest`.

### annotation

With `annotation`, we can even create our own test annotation:

```java
package com.pspdfkit.testlab;

public @interface MyCustomTest {
}
```

And if we mark some of our test methods with that annotation, we can run those tests via the following:

```sh
adb shell am instrument -w -r -e annotation 'com.pspdfkit.testlab.test.MyCustomTest' com.pspdfkit.testlab.test/androidx.test.runner.AndroidJUnitRunner
```

Or we can run all the tests that don’t contain that annotation:

```sh
adb shell am instrument -w -r -e notAnnotation 'com.pspdfkit.testlab.test.MyCustomTest' com.pspdfkit.testlab.test/androidx.test.runner.AndroidJUnitRunner
```

## Conclusion

The information covered above is just an example of the API that you can use to manipulate test execution on Android, and you can use this as a base when writing more complex setups. You can also use Gradle to create tasks that will execute particular commands, which will make it so you don’t need to, for example, type all these long commands.

You’ll find examples of typical command usage in [the developer guides for `AndroidJUnitRunner`][], which you can then use as quick references when running your tests.

Additionally, there are a lot of possibilities when it comes to [manipulating Java/JVM test executions inside the Gradle itself][].

[java annotation definition]: https://en.wikipedia.org/wiki/Java_annotation
[android test filters support library]: https://developer.android.com/reference/androidx/test/filters/package-summary
[test filters documentation]: https://developer.android.com/reference/androidx/test/filters/package-summary
[`@flakytest`]: https://developer.android.com/reference/androidx/test/filters/FlakyTest.html
[`@largetest`]: https://developer.android.com/reference/androidx/test/filters/LargeTest.html
[`@mediumtest`]: https://developer.android.com/reference/androidx/test/filters/MediumTest.html
[`@smalltest`]: https://developer.android.com/reference/androidx/test/filters/SmallTest.html
[`@requiresdevice`]: https://developer.android.com/reference/androidx/test/filters/RequiresDevice.html
[`@sdksupress`]: https://developer.android.com/reference/androidx/test/filters/SdkSuppress.html
[`@supress`]: https://developer.android.com/reference/androidx/test/filters/Suppress.html
[`@ignore`]: http://junit.sourceforge.net/javadoc/org/junit/Ignore.html
[android debug bridge (adb)]: https://pspdfkit.com/blog/2019/android-debug-bridge-tips-and-tricks/
[adb]: https://developer.android.com/studio/command-line/adb
[the developer guides for `androidjunitrunner`]: https://developer.android.com/reference/androidx/test/runner/AndroidJUnitRunner#typical-usage
[manipulating java/jvm test executions inside the gradle itself]: https://docs.gradle.org/current/userguide/java_testing.html
