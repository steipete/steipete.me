---
title: "Make Android Animations Reactive with VanGogh"
description: Android view animations powered by RxJava 2.
preview_image: /images/blog/2017/reactive-animations-on-android-with-van-gogh/van-gogh-cover.png
section: blog
author:
  - Ivan Skoric
author_url:
  - https://twitter.com/skoric_
date: 2017-11-10 12:00 UTC
tags: Android, Development, RxJava, Library, Products, OpenSource
published: true
---

Today we’re proud to present the first release of a [small yet powerful library named VanGogh](https://github.com/PSPDFKit-labs/VanGogh). VanGogh is a lightweight library that takes Android view animation logic and binds it with [RxJava2](https://github.com/ReactiveX/RxJava), providing simple yet powerful APIs for manipulating animation workflows.

READMORE

![](/images/blog/2017/reactive-animations-on-android-with-van-gogh/van-gogh-logo-light.png)

In addition to various premade commonly used animations such as fading, rotating, and moving, VanGogh also provides a generic RxJava 2 wrapper for [`ViewPropertyAnimator`](https://developer.android.com/reference/android/view/ViewPropertyAnimator.html).

This enables you to create your own `AnimationCompletable` that will execute the specified animation once the `AnimationCompletable` is subscribed to.

Wrapping animations into a `Completable` allows you to use it in combination with RxJava operators and base reactive objects to get more control over the animation flow.

![](/images/blog/2017/reactive-animations-on-android-with-van-gogh/van-gogh-cover.png)

## API

### Defining Custom Animations

Creating custom animations is relatively straightforward. To do so, you need to use the `AnimationBuilder` class to build an `AnimationCompletable` object. The syntax is the same as that of Android’s [`ViewPropertyAnimator`](https://developer.android.com/reference/android/view/ViewPropertyAnimator.html):

[==

```kotlin
fun spin360(View view): AnimationCompletable {
  return AnimationBuilder.forView(view)
      .rotation(360)
      .duration(500L)
      .interpolator(AccelerateDecelerateInterpolator())
      .buildCompletable() // Converts it into a Completable.
}
```

```java
public static AnimationCompletable spin360(view: View) {
  return AnimationBuilder.forView(view)
      .rotation(360)
      .duration(500L)
      .interpolator(new AccelerateDecelerateInterpolator())
      .buildCompletable(); // Converts it into a Completable.
}
```

==]

To run the specified animation, you simply need to subscribe to it with `spin360(view).subscribe()`. Additionally, you can specify actions to perform when the animation is ready, started, canceled, or finished. The running animation is canceled if its completable is disposed.

For more details on base classes and how they interact with each other, please check the [Base Classes section in the VanGogh documentation](https://github.com/PSPDFKit-labs/VanGogh/wiki/Base-Classes).

### Animations Provided by the Library

One of the main powers of the VanGogh library is that it provides predefined animations that are commonly used, so you can just grab them instead of defining your own (more will be added in upcoming versions).

For example, if you import the `FadeAnimations` class, you can use fade animation methods on your views straight away:

[==

```kotlin
// Fades in view1.
fadeIn(view1).subscribe()

// Fades out view2 in 300ms with LinearInterpolator.
fadeOut(view2, 300L, LinearInterpolator()).subscribe()

// Fades in view3 quickly (300ms).
fadeInQuick(view3).subscribe()
```

```java
// Fades in view1.
fadeIn(view1).subscribe();

// Fades out view2 in 300ms with LinearInterpolator.
fadeOut(view2, 300L, new LinearInterpolator()).subscribe();

// Fades in view3 quickly (300ms).
fadeInQuick(view3).subscribe();
```

==]

You’ll find more details on this in the [Predefined Animations section in the VanGogh documentation](https://github.com/PSPDFKit-labs/VanGogh/wiki/Predefined-Animations).

### VanGogh in Action

Here’s a small showcase with code samples to give you an overview of the possibilities and the API itself:

[==

```kotlin
scale(fab, 1f)
   .andThen(together(fadeIn(tv1), fadeIn(tv2)))
   .andThen(fadeIn(progressBar))
   .subscribe()
```

```java
scale(fab, 1f)
    .andThen(together(fadeIn(tv1), fadeIn(tv2)))
    .andThen(fadeIn(progressBar))
    .subscribe();
```

==]

![](/images/blog/2017/reactive-animations-on-android-with-van-gogh/anim1.gif)

[==

```kotlin
scale(fab, 1f)
    .andThen(together(rotate(fab, 360f), fadeIn(tv1), fadeIn(tv2)))
    .andThen(fadeIn(progressBar))
    .subscribe()
```

```java
scale(fab, 1f)
    .andThen(together(rotate(fab, 360f), fadeIn(tv1), fadeIn(tv2)))
    .andThen(fadeIn(progressBar))
    .subscribe();
```

==]

![](/images/blog/2017/reactive-animations-on-android-with-van-gogh/anim2.gif)

[==

```kotlin
together(
    scale(fab, 1f),
    fadeIn(tv1, 500L),
    fadeIn(tv2),
    scale(progressBar, 1f, 1f))
  .subscribe()
```

```java
together(
    scale(fab, 1f),
    fadeIn(tv1, 500L),
    fadeIn(tv2),
    scale(progressBar, 1f, 1f))
  .subscribe();
```

==]

![](/images/blog/2017/reactive-animations-on-android-with-van-gogh/anim3.gif)

## Conclusion

The above API is just a small example of what’s possible with VanGogh. In order to get a full grasp of the library and its capabilities, please visit the [VanGogh documentation page](https://github.com/PSPDFKit-labs/VanGogh/wiki).

This is just the initial version (0.1.0) that provides a couple of the most common animations out of the box, and more will be added as the library is updated. Feel free to create issues if you have any questions, proposals, feature requests, etc.

Additionally, contributions are welcome, but please create a proposal issue first so that you don’t do the work to create a PR that will be rejected in the end.

Happy coding!
