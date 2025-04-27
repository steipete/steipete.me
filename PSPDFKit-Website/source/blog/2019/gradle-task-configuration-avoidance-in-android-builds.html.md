---
title: "Gradle Task Configuration Avoidance in Android Builds"
description: "An overview of Gradle's task configuration avoidance APIs and how they are used by the Android build system."
preview_image: /images/blog/2019/gradle-task-configuration-avoidance-in-android-builds/article-header.png
section: blog
author:
  - David Schreiber-Ranner
date: 2019-05-21 8:00 UTC
tags: Android, Gradle, Development
published: true
secret: false
---

Android Studio 3.3.0 and the accompanying Gradle plugin with the same version have been around for some time now. The 3.3 release was the first of a series of updates as part of the Android tools team’s Project Marble, which focuses on the quality of build tools. One major change to the Android build system that was included in this version is the focus on performance and build speed. In this article, we’ll have a look at the new Gradle task configuration avoidance APIs and how the Android build system implements these APIs to achieve faster build times.

## Gradle’s Task Configuration Avoidance

With Gradle 4.8, a new set of [task configuration avoidance][] APIs were introduced. They allow for lazy Gradle task creation and configuration, in order to speed up builds.

The need for lazy task creation and configuration can be demonstrated by considering a normal Java source compilation task (for example, your Android project’s Java compilation task). Although the compilation task does not depend on testing tasks, static analysis tasks, or documentation generation tasks, these unrelated tasks are still created and configured when running your Gradle build, which adds to the total build time. But the newly introduced APIs allow definition of tasks in a lazy way that aims to reduce build configuration times.

### How Do Lazy APIs Work?

Let’s have a look at how task creation and configuration worked using the old, eager Gradle APIs:

```groovy
task('generateDocumentation') {
	// expensive task configuration code ...
}
```

When executing your Gradle build, an instance of Gradle’s `DefaultTask` class will be created for `generateDocumentation`, and the configuration code will be executed — independent of whether `generateDocumention` is executed inside your build or not. This can be pretty expensive, depending on the number of tasks in your build script, the number of app variants or library variants of your project, and the complexity of your task configuration blocks.

Let’s have a look at the same example, but this time using Gradle’s task configuration avoidance APIs:

```groovy
tasks.register('generateDocumentation') {
	// expensive task configuration code ...
}
```

Although the example looks pretty similar, something completely different is happening behind the scenes. Instead of creating a `DefaultTask` object right away, a call to [`TaskContainer.register()`][] will only register the task in a way so that it can be referenced by other tasks of your build script. Furthermore, the expensive configuration block of your task is not executed right away either. Creation and configuration of the task will be deferred and will only happen when the task is executed or a depending task is executed.

### Stay Lazy — Use the Task Provider

When calling [`TaskContainer.register()`][], Gradle will create a `TaskProvider` object, which serves as a lightweight reference to the yet-to-be-created task. This provider can be retrieved using lazy methods like [`TaskContainer.named()`][]. `TaskProvider` exposes a single method, `configure()`, which allows registering of configuration blocks:

```groovy
tasks.named('generateDocumentation').configure {
	// expensive task configuration code ...
}
```

When calling `named()` or `configure()`, the actual task is not yet created — these methods allow lazy retrieval and configuration of tasks. But as soon as a task is actually created during the build process, all previously registered `configure()` blocks will be called in order.

> **💡 Tip:** The new `TaskProvider` is a subclass of Gradle’s `Provider` interface, which has been used since Gradle 4.0 as a generic lazy handle for absolutely anything in your build (e.g. files or properties).

### Passing Around the Task Provider

Many existing Gradle methods have been extended to support `TaskProvider`. A good example is the `dependsOn()` method of a task, which can now also take a `TaskProvider` instance:

```groovy
// The `register()` method actually returns the created
// `TaskProvider` instance right away. Neat!
final generateDocumentation = tasks.register('generateDocumentation')

tasks.register('packageDocumentation') {
	// This now takes providers too!
	dependsOn generateDocumentation
}
```

The above example creates two lazy tasks. The task named `generateDocumentation` will only be created and configured if `packageDocumentation` is executed (and as a result, `packageDocumentation` will also be created and configured).

## Your Android Build Becomes Lazy Too

Starting with 3.3.0, the Android Gradle Plugin builds upon the task configuration avoidance APIs of Gradle. The Android build plugin now has a couple of new public methods that use newer lazy APIs, like, for example, the `getJavaCompileProvider()` method of variants in your build:

```groovy
android.libraryVariants.all { variant ->
	// The new way of lazily retrieving the Java compile task.
	final compileProvider = variant.javaCompileProvider()
}
```

This also means that older eager methods (`getJavaCompiler()` for example) have been deprecated and are subject to removal in late 2019. When using these methods inside your build scripts or plugins, you will see a warning similar to the following:

```
WARNING: API 'variant.getJavaCompiler()' is obsolete and has been replaced with 'variant.getJavaCompileProvider()'.
It will be removed at the end of 2019.
For more information, see https://d.android.com/r/tools/task-configuration-avoidance.
To determine what is calling variant.getJavaCompiler(), use -Pandroid.debug.obsoleteApi=true on the command line to display a stack trace.
Affected Modules: pspdfkit-eager-example
```

Migration to lazy APIs is fairly straightforward, and Gradle has [a great migration guide][gradle migration guide] explaining the necessary steps. However, depending upon the complexity of your build scripts, the full migration might take time, so it’s better to get started straight away.

### There’s More to Come

Usage of the task configuration avoidance APIs are just a small part of the changes that went into the Android Gradle Plugin 3.3.0. Another change, which also originates from the need for faster builds, is the new variant aware task configuration, which aims at projects with many different variants (i.e. flavors and build types). Additionally, it promises much shorter Gradle configuration times by only configuring tasks that have been marked active inside Android Studio.

So far, this feature should be considered experimental, and it does not fully support all Gradle projects. However, at PSPDFKit, we’re always looking into improving our builds, and are thus already exploring these new APIs. If you’re interested in a deep-dive blog post about variant aware configurations, feel free to [let us know on Twitter][pspdfkit twitter].

We highly recommend updating your Gradle builds to make use of the new task avoidance APIs; it definitely pays off in the long run. In the meantime, keep coding!

[task configuration avoidance]: https://docs.gradle.org/current/userguide/task_configuration_avoidance.html
[`taskcontainer.register()`]: https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/TaskContainer.html#register-java.lang.String-
[`taskcontainer.named()`]: https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/TaskCollection.html#named-java.lang.String-
[gradle migration guide]: https://docs.gradle.org/current/userguide/task_configuration_avoidance.html#sec:task_configuration_avoidance_migration_guidelines
[pspdfkit twitter]: https://twitter.com/PSPDFKit
