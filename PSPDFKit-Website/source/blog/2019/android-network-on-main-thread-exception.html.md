---
title: "How Do I Fix NetworkOnMainThreadException?"
description: "A post detailing what NetworkOnMainThreadException is and how to prevent it."
preview_image: /images/blog/2019/android-network-on-main-thread-exception/article-header.png
section: blog
author:
  - Reinhard Hafenscher
date: 2019-08-19 8:00 UTC
tags: Development, Android, Kotlin
published: true
secret: false
---

[`NetworkOnMainThreadException`][] was introduced with Android 3.0. In an effort by Google to ensure apps stay responsive, [`NetworkOnMainThreadException`][] is thrown when your application tries to access the network on the UI thread. READMORE In this blog post, we’ll take a look at why it is bad to do network requests on the main thread and how to properly offload this work to a background thread.

## Why You Shouldn’t Do Your Network Requests on the Main Thread

Now obviously, doing all your work on the main thread is the simplest way to handle things. In this way, you don’t have to deal with concurrency, and all your business logic is written in a straightforward, easy-to-follow way. Let’s explore how that would look and what the consequences would be. First, let’s create a small example:

```kotlin
// `onOptionsItemSelected` is called when the user taps the menu item.
override fun onOptionsItemSelected(item: MenuItem): Boolean {
    val handled = when (item.itemId) {
        R.id.custom_action -> {
            // Here we load a simple string from a web service.
            val url = URL("https://whatthecommit.com/index.txt")
            val connection = url.openConnection()
            val text = connection.getInputStream()
                .bufferedReader(Charset.forName("UTF-8")).readLine()
            // And then we display it.
            Toast.makeText(this, text, Toast.LENGTH_SHORT).show()
            true
        }
    }
}
```

Now this will actually throw `NetworkOnMainThreadException`, so for the purpose of showing why this is a bad idea, let’s disable that exception. However, keep in mind that you should never disable this in a real application:

```kotlin
// Disable the `NetworkOnMainThreadException` and make sure it is just logged.
StrictMode
    .setThreadPolicy(StrictMode.ThreadPolicy.Builder().detectAll().penaltyLog().build())
```

When we select our options item, we will see that after hitting the button, everything freezes, animations stop, and the UI won’t respond until the request is done. This happens because drawing the UI (with the exception of a few animations that run on the [RenderThread][]) and handling input happens all on one thread in Android. By doing our web requests on this thread, we block it for potentially 100s of milliseconds, causing the UI to appear stuck and the user unable to make any input. This is obviously a terrible user experience and the reason Google introduced both `NetworkOnMainThreadException` and other tools provided by [`StrictMode`][] — in order to catch similar issues with accessing the disk.

So how do we make sure our UI stays responsive and jank free? We offload our requests to a background thread of course.

## Network Requests Done the Correct Way

We already wrote a lot about how to use [Kotlin coroutines][], and our articles about how you can use a [`PdfFragment` to retain state][pdffragment state] and how to use [`ViewModel` to retain state][viewmodel state] also contain examples of offloading work to background threads. So to round off this article on why [`NetworkOnMainThreadException`][] exists, let’s look at one way to handle it correctly.

Today we’ll use [RxJava][] to offload our web request to a background thread. Let’s first replace our old code with the following:

```kotlin
Single.fromCallable {
    // Here we load a simple string from the web service.
    val url = URL("https://whatthecommit.com/index.txt")
    val connection = url.openConnection()
    return@fromCallable connection.getInputStream()
        .bufferedReader(Charset.forName("UTF-8")).readLine()
}
    .subscribeOn(Schedulers.io())
    .observeOn(AndroidSchedulers.mainThread())
    .subscribe({ text ->
        // And then we display it.
        Toast.makeText(this, text, Toast.LENGTH_SHORT).show()
    }, {
        it.printStackTrace()
    })
```

Now instead of performing our web request on the main thread, we use RxJava’s IO scheduler to perform it in the background. This way, our UI stays responsive and smooth. If you combine this with persisting the state across configuration changes like those shown [here][pdffragment state] or [here][viewmodel state], you can even continue running your requests if the user rotates their device — something that wouldn’t otherwise be possible.

## Conclusion

We took a look at what [`NetworkOnMainThreadException`][] is and what causes it, as well as the reasons why you should never perform network requests — or any long-running tasks for that matter — on the main thread. We also looked at one way to properly handle network requests on a background thread. As a final note, I want to mention that you should always be aware of what you run on your main thread, even if the system won’t stop you with `NetworkOnMainThreadException`.

[`networkonmainthreadexception`]: https://developer.android.com/reference/android/os/NetworkOnMainThreadException
[`strictmode`]: https://developer.android.com/reference/android/os/StrictMode.html
[renderthread]: https://developer.android.com/about/versions/lollipop.html#Material
[kotlin coroutines]: https://pspdfkit.com/blog/2019/kotlin-coroutines/
[pdffragment state]: https://pspdfkit.com/blog/2019/retaining-objects-using-a-fragment/
[viewmodel state]: https://pspdfkit.com/blog/2019/using-viewmodels-to-retain-state-on-android/
[rxjava]: https://github.com/ReactiveX/RxJava
