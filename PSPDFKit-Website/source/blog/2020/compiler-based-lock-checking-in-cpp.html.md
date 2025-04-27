---
title: "Compiler-Based Lock Checking in C++"
description: "A short introduction to compiler-based lock checking in C++ with Clang using Thread Safety Analysis"
preview_image: /images/blog/2020/compiler-based-lock-checking-in-cpp/article-header.png
section: blog
author:
  - Markus Woschank
date: 2020-02-04 8:00 UTC
tags: Development, C++
published: true
secret: false
---

In multi-threaded applications, access to shared resources needs to be coordinated to prevent race conditions that could lead to undesired behavior. This is often achieved by using mutual exclusion devices like mutexes — also known as locks — which can prevent concurrent access to a resource. But getting locking right in complex applications is not an easy task, and care must be taken to avoid introducing hard-to-debug bugs.

This post provides a short introduction to Thread Safety Analysis, a Clang code analyzer that can catch concurrency bugs early on and helps you when dealing with locks by, for example, making sure that every code path accessing a resource will hold the appropriate mutex.

READMORE

Concurrency is an important aspect of software engineering, and there are various reasons for using it. For example, you might want your main thread to be responsive in order to deliver a great user experience while doing busy work in the background. Or you may want to utilize your phone’s multi-core processor and distribute work on different processors to have a page rendered faster.

While there are many means of utilizing multiple cores, such as [OpenMP][open-mp] or [Cilk][], as soon as threads are involved, there is usually no way around dealing with [locks][].

## Concurrency Is Hard

It’s hard to recognize race conditions because they are caused by interactions with other threads and not easily seen when examining local code. To make matters worse, they are difficult to reproduce, especially in a debugger, and they often don’t appear in unit tests. In fact, there is even a [game][deadlock-empire] that deals with concurrency challenges.

Google [shared][google-thread-safety-slides] a real-world example of a concurrency bug that took several man-weeks to track down:

```cpp
void bug(Key* K) {
 CacheMutex.lock();
 ScopedLookup lookupVal(K);
 doSomethingComplicated(lookupVal.getValue());
 CacheMutex.unlock();
 // OOPS!
};
```

While the standard `lock-do-unlock` pattern is used in this example, the destructor of `ScopedLookup` accesses a resource _after_ the mutex is unlocked. That’s not easy to catch.

## Thread Safety Annotations

[Thread Safety Analysis][google-thread-safety-paper] checks your annotated code at compile time to catch concurrency bugs early, and it is available for [Clang][clang-thread-safety-analysis].

To make it work, your code needs to be [annotated][clang-thread-safety-analysis-mutex], as this will mark your mutex classes or other concurrency constructs so the analyzer can do its job. Usually, you will end up with something like this:

```cpp
class CAPABILITY("mutex") Mutex {
public:
  void Lock() ACQUIRE();
  void Unlock() RELEASE();

  // ...
};

class SCOPED_CAPABILITY ScopedLock {
private:
  Mutex* mutex;

public:
  ScopedLock(Mutex *mutex) ACQUIRE(mutex)
  : mutex(mutex) { mutex->Lock(); }

  ~ScopedLock() RELEASE(mutex)
  { mutex->Unlock(); }

  // ...
};
```

There are a variety of annotations [available][clang-thread-safety-analysis-reference], like one for returning a lock and another for enforcing lock order.

The only thing left to do is to annotate the resources that need the mutex to be locked, and the compilation using the `-Wthread-safety` parameter will yield the appropriate warnings:

```cpp
class BankAccount {
private:
  Mutex mu;
  int   balance GUARDED_BY(mu);

  void depositImpl(int amount) {
    balance += amount;       // WARNING! Cannot write `balance` without locking `mu`.
  }

  void withdrawImpl(int amount) REQUIRES(mu) {
    balance -= amount;       // OK. Caller must have locked `mu`.
  }

public:
  void withdraw(int amount) {
    mu.Lock();
    withdrawImpl(amount);    // OK. We've locked `mu`.
  }                          // WARNING! Failed to unlock `mu`.

  void transferFrom(BankAccount& b, int amount) {
    mu.Lock();
    b.withdrawImpl(amount);  // WARNING! Calling `withdrawImpl()` requires locking `b.mu`.
    depositImpl(amount);     // OK. `depositImpl()` has no requirements.
    mu.Unlock();
  }
};
```

## Limitations

All this said, there are [limitations][clang-thread-safety-analysis-limitations] to what the analyzer can do. For example, because the analysis is done at compile time, conditional locking will generate false positives:

```cpp
void foo() {
  bool b = needsToLock();
  if (b) mu.Lock();
  ...  // Warning! Mutex `mu` is not held on every path through here.
  if (b) mu.Unlock();
}
```

## Conclusion

While it will not catch all bugs, Thread Safety Analysis can be a great tool to improve your code and catch concurrency errors early on. Combined with other tools and thoughtful best practices, it helps us take advantage of today’s multi-core devices.

[locks]: https://pspdfkit.com/blog/2019/making-a-class-thread-safe/
[google-thread-safety-slides]: https://llvm.org/devmtg/2011-11/Hutchins_ThreadSafety.pdf
[google-thread-safety-paper]: https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/42958.pdf
[clang-thread-safety-analysis]: https://clang.llvm.org/docs/ThreadSafetyAnalysis.html
[clang-thread-safety-analysis-mutex]: https://clang.llvm.org/docs/ThreadSafetyAnalysis.html#mutexheader
[clang-thread-safety-analysis-reference]: https://clang.llvm.org/docs/ThreadSafetyAnalysis.html#reference-guide
[clang-thread-safety-analysis-limitations]: https://clang.llvm.org/docs/ThreadSafetyAnalysis.html#known-limitations
[deadlock-empire]: https://deadlockempire.github.io/
[open-mp]: https://www.openmp.org/
[cilk]: https://www.cilkplus.org/
