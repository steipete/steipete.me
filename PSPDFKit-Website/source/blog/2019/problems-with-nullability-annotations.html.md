---
title: "Problems with Nullability Annotations"
description: "A look at some issues with Android's nullability annotations and how to fix them."
preview_image: /images/blog/2019/problems-with-nullability-annotations/article-header.png
section: blog
author:
  - David Schreiber-Ranner
date: 2019-06-12 8:00 UTC
tags: Android, Development, Java
published: true
secret: false
---

Android’s nullability annotations are a powerful tool for augmenting Java’s incomplete type system. However, there are various pitfalls of nullability annotations that developers should be aware of. In this article, we’ll take a look at some of these programming issues and present some best practices to help avoid them.READMORE

Make sure to read the first part of this mini blog post series about nullability in Java and Android: [Handling Nullability in Your Code][].

## Linter Warnings, Not Errors

The Android linter will always only generate warnings. While this helps in finding nullability issues early on during development, it is important to understand that this is no ultimate remedy for `NullPointerExceptions`, since the Java compiler will still compile unsafe code without issuing any errors, and there are no additional `null` checks performed at runtime either.

Take this simplified code of a listener collection as an example:

```java
public class OnClickListenerCollection {
    private final List<OnClickListener> listeners = new ArrayList<>();

    public void addListener(@NonNull final OnClickListener listener) {
        listeners.add(listener);
    }

    public void notifyViewClicked(@NonNull final View view) {
        listeners.forEach((it) -> it.onClick(view));
    }
}
```

Below is the warning Android Studio will output when passing `null` to the `addListener()` method.

![Android Studio null warning](/images/blog/2019/problems-with-nullability-annotations/lint-warning.jpg)

In the above example, passing `null` to `addListener()` won’t fail immediately. The class trusts the caller to comply with the `@NonNull` contract without performing any nullability checks at runtime. By passing `null`, a caller brings the collection into an illegal state, which causes a deferred error once `notifyViewClicked()` is called.

> The absence of compiler errors for incorrect `null` handling poses quality issues that grow proportionally with the complexity of software.

To guard against such misuse, consider validating input parameters as soon as possible. While this practice is important for growing any software in a healthy way, it is indispensable when writing the public API of a library (see our blog post [Tips for Designing an Android Library][] for more things to watch out for as a library developer).

## Declaration-Site Warnings vs. Call-Site Warnings

In order to avoid deferred errors from consuming invalid argument values, a method should always validate any input parameters immediately after receiving them. For `null` checks, this can be done either by _dereferencing variables_ (i.e. accessing methods or properties on them), or by _performing explicit `null` checks_.

The following screenshot shows the original listener code with an added check that prevents `null` values from being passed into the collection.

![Warning for checking @NonNull parameters](/images/blog/2019/problems-with-nullability-annotations/checking-nonnull-parameter.png)

Android Studio will show a warning because a parameter that is marked as `@NonNull` is checked for `null` values. This, in turn, brings up another issue about nullability annotations: Nullability annotations pose the same contract for callers and receivers. A caller is warned when passing `null` as an argument to a `@NonNull` parameter (which is fine), and the method itself is warned when checking the `@NonNull` parameter for `null` values (which is a valid operation for enforcing non-nullability). With Android’s nullability annotations, it is sadly not possible to declare a parameter as “unsafe non-`null`.”

### Working around Declaration-Site Warnings

A common pattern we see is to explicitly ignore declaration-site warnings so that they don’t show up in static analysis reports. This is a good first step, but it’s also a verbose one:

```java
public void addListener(@NonNull final View.OnClickListener listener) {
    //noinspection ConstantConditions
    if (listener == null) {
        throw new NullPointerException("listener may not be null");
    }
    listeners.add(listener);
}
```

A cleaner and more scalable approach is the use of special precondition helpers that are shipped with most libraries. Using such helpers is less verbose, and doing so also reliably silences nullability check warnings. On Android API 19+, you can use static methods on `java.utils.Objects` to do the job:

```java
public void addListener(@NonNull final View.OnClickListener listener) {
    listeners.add(
        Objects.requireNonNull(listener, "listener may not be null")
    );
}
```

## @NonNull != @NonNull

A large number of different nullability annotations exist. In order to stay independent of the platform and ecosystem, libraries tend to ship their own set of nullability annotations. Many of them are called `@NonNull`, and some are called `@NotNull`, but even more obscure names can be found. Chances are that your project has multiple different nullability annotation classes on the compile classpath.

![Different nullability annotations](/images/blog/2019/problems-with-nullability-annotations/different-non-null-annotations3.png)

Since it’s the responsibility of a tool to evaluate and use nullability information, you need to see if your toolchain supports different kinds of annotations at the same time.

Luckily, Android Studio allows you to configure the IDE inspections to support different kinds of annotations, as shown below.

![Android Studio annotations configuration](/images/blog/2019/problems-with-nullability-annotations/android-studio-nullable-annotations.png)

## Summary

Nullability annotations are an important tool for building robust and maintainable software. In this blog post, we showed some of the problems developers encounter when working with these kinds of annotations. Since there is still a lot more to talk about regarding nullability on Java and Android, feel free to ping us (or [me directly][david twitter]) to give feedback and share ideas for future articles.

Keep coding!

[handling nullability in your code]: https://pspdfkit.com/blog/2019/handling-nullability-in-your-code
[tips for designing an android library]: https://pspdfkit.com/blog/2018/tips-for-designing-an-android-library/
[david twitter]: https://twitter.com/Flashmasterdash
