---
title: "RxJava Is Async yet Blocking"
description: An explanation of why RxJava is both asynchronous and blocking.
preview_image: /images/blog/2018/rxjava-is-async-but-blocking/article-header.png
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/flashmasterdash
date: 2018-04-30 12:00 UTC
tags: Android, Development, Kotlin, RxJava
published: true
---

Usually, asynchronous code is non-blocking: You call a method that returns immediately, allowing your code to continue its execution. Once the result of your call is available, it is returned via a callback.

RxJava is asynchronous, too. And it is blocking as well — at least by default.READMORE

### What You Will Learn

There are two main things you will learn in this article:

* Leaving out all `observeOn()` and `subscribeOn()` operators in your RxJava code makes your observables single-threaded.
* Calling `subscribe()` on a single-threaded observable will block until the entire observable chain has been executed.

This article walks through two similar examples to explain this RxJava behavior in more detail.

## Your Usual RxJava Code

Let’s have a look at the typical RxJava code you would write for Android:

```kotlin
log("Before")
Completable
  .fromAction {
    log("fromAction(...)")
  }
  .subscribeOn(AndroidSchedulers.mainThread())
  .observeOn(AndroidSchedulers.mainThread())
  .subscribe {
    log("onComplete(...)")
  }
log("After")
```

The resulting output is as follows:

```
Before (Thread: background-thread)
After (Thread: background-thread)
fromAction(...) (Thread: main-thread)
onComplete(...) (Thread: main-thread)
```

### Explaining the Example

There are two observations you can read from the log statements:

1. The “outer” code is executed before the “inner” code.
2. The “outer” code is executed on a background thread, whereas the “inner” code is executed on the main thread.

> This example is executed on the background thread, but it could be executed on any other thread (including the main thread) instead. Doing so would not change the example’s behavior.

Since `After` is logged before the inner statements, we can conclude that none of the outer calls (`fromAction()`, `subscribeOn()`, `observeOn()`, and `subscribe()`) are blocking. This is the expected (and desired) behavior, and is one of the important feature of RxJava: It helps developers with multi-threading — for example, by simplifying the pushing of longer-running operations to a background thread.

The following illustration shows the execution order of the various code lines on their threads. You can see that the call to `subscribe()` on line eight tells RxJava to schedule the execution of `Action` on the main thread.

![Multi-threaded-example](/images/blog/2018/rxjava-is-async-but-blocking/multi-threaded.png)


## Now We Make It Blocking

In order to show that RxJava is actually blocking by default, let’s remove all irrelevant parts and create a simple example. Here’s the same example code, but without the `subscribeOn()` and `observeOn()` calls:

```kotlin
log("Before")
Completable
  .fromAction {
    log("fromAction(...)")
  }
  // subscribeOn() was here
  // observeOn() was here
  .subscribe {
    log("onComplete(...)")
  }
log("After")
```

When running this code, it behaves significantly differently than the original snippet. Here is the generated output:

```
Before (Thread: background-thread)
fromAction(...) (Thread: background-thread)
onComplete(...) (Thread: background-thread)
After (Thread: background-thread)
```

### Explaining the Difference

Let’s look at the output and observe what changed:

1. The “outer” code is executed up until the call to `subscribe()`, which blocks until the “inner” code has finished execution.
2. Both the “inner” and “outer” code are executed on the same thread of execution.

Before drawing a conclusion, let’s again illustrate the current execution order. This time, there is only a single thread involved in the entire execution.

![Single-threaded-example](/images/blog/2018/rxjava-is-async-but-blocking/single-threaded.png)

## Conclusion

In this article, we had a look at the execution order of asynchronous RxJava code (similar to RxSwift and RxKotlin), both with and without `subscribeOn()` and `observeOn()` operators applied. The observed differences in behavior lead to the following conclusions:

* You can use RxJava single-threadedly too (actually, this is the default behavior of RxJava).
* You can use RxJava purely for its functional programming toolset if you like (although there are better solutions for this available).
* Having knowledge about the order of execution of code blocks in your code can be important for time-sensitive or order-sensitive code blocks.
