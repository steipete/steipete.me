---
title: Making a Resource Thread-Safe with Locks
description: "We discuss how to ensure thread safety and synchronization via locking."
preview_image: /images/blog/2019/making-a-class-thread-safe/article-header.png
section: blog
author:
  - Oscar Swanros
author_url:
  - https://twitter.com/Swanros
date: 2019-07-16 8:00 UTC
tags: iOS, Development, Swift
published: true
secret: false
---

Nowadays, applications are expected to be able to adapt to a variety of environments. In many cases, the environment the application is being executed within offers support for concurrent operations.

Concurrency, if used correctly, can vastly improve the quality of the experience of users of an application. For instance, thanks to a system’s ability to run concurrent operations, you’re able to enjoy using your favorite application without the UI stuttering every time something needs to be processed — while one thread is busy processing or downloading data, another one is responsible for handling user interactions.

However, although concurrency can be useful, it is not a silver bullet, as it introduces complexities and risks that need to be taken into consideration, both when building and testing an application. One such risk is the case where one thread might be reading data from a resource _while_ another thread is writing to it.

## The Problem

![Multiple threads accessing a shared resource](/images/blog/2019/making-a-class-thread-safe/shared-resource.png)

You could say that resource integrity is at risk when there’s no way to protect the order in which concurrent operations can access a resource. In the graphic above, multiple threads of the same program are trying to write information to the resource at the same time.

If one thread tries to read the resource while other thread is writing to it, the data that the first thread gets back will potentially be incorrect, compromised, or simply invalid.

We have tools at our disposal to prevent situations like this from happening, and in this post, I’d like to talk about the approach we use extensively within PSPDFKit: thread synchronization via locking.

### Implementing Locks

A lock prevents other threads from accessing a shared resource while some work, such as a data writing operation, is being performed by the thread that acquired the lock.

Locking requires all the involved parties to _know_ that the resource in question is protected by a lock, so that everyone can acquire the lock (block other threads from accessing it) when starting work, and release it (let other threads access the resource) when done.

The clearest example that comes to mind about a great use for locking is the bank analogy. You can go to any ATM to withdraw cash from your account, or you can go to a branch of your bank and talk to a person at the counter to get the money. That does not mean that your account only lives within the ATM itself or within the bank building itself: Both the ATM and the cashier have _access_ to a shared resource that they can interact with — your account.

Now imagine you clone yourself and decide to go to an ATM _and_ a cashier at the same time to withdraw money from your account. How would you protect against simultaneous withdrawals? Locking access to an account while an operation is being performed is a high-level solution banks implement to make sure that you don’t withdraw more money than you have.

In code, it would look something like this:

```swift
class BankAccount {
	let accountLock = NSLock()
	var balance: Double = 0

	func deposit(amount: Double) {
		accountLock.lock()

		balance += amount

		accountLock.unlock()
	}

	func withdraw(amount: Double) throws -> Double {
		accountLock.lock()

		guard balance >= amount else {
			throw AccountError.notEnoughFunds
		}

		balance -= amount
		accountLock.unlock()

		return balance
	}
}
```

As you can see, the deposit and withdrawal operations both require a lock to be acquired before the operation takes place. This means that whichever function gets dispatched second will have to wait until the first one completes (unlocks the lock) to perform the work needed.

The code sample above shows a common pattern that’s used when locking is the technique employed to protect shared resources. Notice that the class `BankAccount` is really only a wrapper of the actual resource that we want to interact with: `balance`. `BankAccount` then follows the [monitor pattern][] to ensure that access to the actual resource is safe.

Following this pattern, if we wanted to add a third method that checked the balance of the account, we’d need to also make sure _that_ method acquires a lock before reading the value and releases it when finished:

```swift
	// ...

	func getBalance() -> Double {
		accountLock.lock()
		let currentBalance = balance;
		accountLock.unlock()

		return currentBalance
	}
```

Notice how only the critical path (retrieving the current balance) is locked. This is to make the use of locks as efficient as possible by not blocking other waiting threads when they don’t need to be waiting.

## Locking in the Real World

At PSPDFKit, we use locking extensively. We also employ other thread safety strategies, such as access queues and memory ordering, to ensure that PDF files keep their integrity and are presented as they’re supposed to be across all the platforms we support.

Since most PDF documents are represented as files on disk (most of the time, but that’s beyond the scope of this post), we have to ensure that file access is coordinated so that, say, if an annotation’s frame is modified by a background thread, our rendering engine does not create an incorrect representation of such an annotation where half of it is in the correct place, and the other half of it is flying around somewhere else in the document.

In its simplest form, locking provides a guarantee that a shared resource won’t be accessed by multiple threads at the same time. However, this power does not come for free, as acquiring and releasing the locks does add slight runtime overhead.

Additionally, using locking efficiently requires a full understanding of the entire system — if some component of the system forgets to acquire a lock when needed, it could lead to crashes, or, in the worst-case scenario, data corruption.

One of the main challenges of using locks to achieve thread synchronization is that of avoiding deadlocks. Deadlock is a situation in which a thread (A) acquires a lock, presumably to protect a resource, thereby preventing another thread (B) from interacting with the resource, while at the same time, B blocks A from continuing execution — they’re waiting on each other, and no progress can be made.

## Conclusion

Locking is one of those things that is difficult to explain in a general way, because the nuances of each system drive the most intrinsic details of the locking implementation. However, if you’re interested in practicing your deadlock-spotting abilities, take a look at [The Deadlock Empire][] — an epic, open source adventure, in which your objective is to modify the provided code samples to make them deadlock.

With enough practice, you’ll start identifying the patterns that lead to scenarios in which locking wouldn’t be the right call, and in which perhaps another thread synchronization technique could be useful... but that’s material for another blog post.

[monitor pattern]: https://en.wikipedia.org/wiki/Monitor_(synchronization)
[the deadlock empire]: https://deadlockempire.github.io
