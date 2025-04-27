---
title: "Kotlin Coroutines"
description: "A look at Kotlin coroutines and how they compare to other solutions for concurrency."
preview_image: /images/blog/2019/kotlin-coroutines/article-header.png
section: blog
author:
  - Reinhard Hafenscher
date: 2019-04-30 8:00 UTC
tags: Android, Kotlin, Development
published: true
secret: false
---

Introduced as an experimental feature with Kotlin 1.2 and as part of the stable API starting with Kotlin 1.3, [coroutines][] provide another way to perform work asynchronously. READMORE In this blog post, we’ll take a look at how to use coroutines in an Android application and examine how they compare to Android’s [`AsyncTask`][] and [RxJava][].

## Coroutines

Let’s start out by taking a look at how coroutines work. To quote the [official documentation][definition]:

> Coroutines are light-weight threads.

What this means for you is that you can essentially have unlimited coroutines running at any time without encountering problems like excessive memory usage. To get started with coroutines in your app, you have to use at least version 1.3 of Kotlin and add the following dependencies to your app:

```gradle
implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.1.1'
implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.1.1'
```

Once you’ve done that, you’re ready to use coroutines in your app. So let’s look at a simple example, in which we’ll load some data from the web and display it in our UI. But to get things started, we need to enable our `Activity` to run coroutines. Every coroutine needs a context in which it is executed, so let’s create an `Activity` that implements [`CoroutineScope`][]:

```kotlin
class CoroutineActivity : Activity(), CoroutineScope {
    // This is responsible for managing the lifecycle of all coroutines
    // started in the `Activity`.
    lateinit var job: Job

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // We create the job in `onCreate`, and afterward, we can use coroutines
        // in the `Activity`.
        job = Job()
    }

    // This tells our coroutines about the context to use.
    override val coroutineContext: CoroutineContext
        // Make sure to use `Dispatchers.Main` so the Android UI thread
        // is used by default.
        get() = Dispatchers.Main + job

    override fun onDestroy() {
        super.onDestroy()
        // This will cancel all currently running coroutines.
        job.cancel()
    }
}
```

The above code ties the execution of coroutines in the `Activity` to its lifecycle, so you don’t have to worry about coroutines touching the UI after the `Activity` is already destroyed. Nor do you have to worry about them accidentally leaking it. Now, having done that, let’s take a look at our function to load the data:

```kotlin
// The suspend keyword tells the compiler that this is a suspending
// function. Suspending functions can call other suspending functions,
// but to call them you have to be inside a coroutine or another
// suspending function.
suspend fun loadTheData(): String {
    // Since the request is quick, just add some delay.
    Thread.sleep(1000)

    // Here we load a simple string from the web service.
    val url = URL("https://whatthecommit.com/index.txt")
    val connection = url.openConnection()
    return connection.getInputStream()
        .bufferedReader(Charset.forName("UTF-8")).readLine()
}
```

Now we have our first _suspending function_. The `suspend` keyword tells the compiler to ensure that this function is only used from within a coroutine or another suspending function; it doesn’t affect the behavior at all on its own. To demonstrate that, let’s try running our new function:

```kotlin
override fun onCreate() {
    ...
    // Launch starts a new coroutine using the `CoroutineContext` we created
    // earlier. This means it will run on the UI thread and be canceled
    // when our `Activity` is destroyed.
    launch {
        val text = loadTheData()
        textView.text = text
    }
}
```

If you start your `Activity` now, you might notice that it will wait until `onCreate` is done before the sleep and the network operation take place. This is because our `loadTheData` method is still executed on the UI thread. So let’s try replacing `Thread.sleep()` with its coroutine equivalent, [`delay()`][]:

```kotlin
suspend fun loadTheData(): String {
    // Since the request is quick, just add some delay.
    delay(1000)

    // Here we load a simple string from the web service.
    val url = URL("https://whatthecommit.com/index.txt")
    val connection = url.openConnection()
    return connection.getInputStream()
        .bufferedReader(Charset.forName("UTF-8")).readLine()
}
```

If you run your `Activity` now, everything will appear to work correctly. This is because, while `delay()` is still run on the main thread, it doesn’t halt its execution, but instead suspends the execution of the coroutine until the time specified in `delay` has passed. You can confirm this by telling `StrictMode` to kill your application when it detects network traffic on the main thread:

```kotlin
StrictMode.setThreadPolicy(
    StrictMode.ThreadPolicy.Builder()
        .detectAll()
        .penaltyLog()
        .penaltyDeathOnNetwork()
        .build()
    )
```

If you run your application now, it should crash once the delay has passed. So how do we tell our code to actually run on a background thread? The answer is to use [`withContext`][]. This allows you to change the context in which your coroutine is running while still staying in the same tree of coroutines:

```kotlin
// We use `withContext` here to switch execution of the next block to the IO
// dispatcher. Once this returns, we'll be back on whichever dispatcher
// called this method.
suspend fun loadTheData(): String = withContext(Dispatchers.IO) {
    // Since the request is quick, just add some delay.
    delay(1000)

    // Here we load a simple string from the web service.
    val url = URL("https://whatthecommit.com/index.txt")
    val connection = url.openConnection()
    return@withContext connection.getInputStream()
        .bufferedReader(Charset.forName("UTF-8")).readLine()
}
```

And with that, we have a working coroutine that, without blocking the main thread, loads some data from the network and displays it in your UI. One of the benefits coroutines have is that writing non-blocking code becomes the same as writing blocking code, since the suspending functions themselves take care to not block the current thread. This is just a really tiny snippet of what coroutines can do; to see all they have to offer, you can check out the [official documentation][]. Next let’s take a look at how this would look with an `AsyncTask`.

## AsyncTask

[`AsyncTask`][] has been part of Android since its inception, and as such, is the oldest construct for performing work concurrently (that we’re looking at today). To use it, you have to create your own class extending from `AsyncTask`; there are just a couple of methods for you to override. Let’s take a look:

```kotlin
// We pass in a lambda since our `AsyncTask` shouldn't leak the context.
class DataTask(val setText: (String) -> Unit) : AsyncTask<Unit, Unit, String>() {
    override fun doInBackground(vararg parameter: Unit): String {
        // Since the request is quick, just add some delay.
        Thread.sleep(1000)

        // Here we load a simple string from the web service.
        val url = URL("https://whatthecommit.com/index.txt")
        val connection = url.openConnection()
        return connection.getInputStream()
            .bufferedReader(Charset.forName("UTF-8")).readLine()
    }

    override fun onPostExecute(result: String) {
        // Tell our `Activity` about the result.
        setText(result)
    }
}
```

Something that is already apparent is that we need to put a lot of care into not leaking the `Context`. This wasn’t an issue with coroutines since the `CoroutineContext` is attached to the `Activity` lifecycle. Now let’s look at how to actually call the `DataTask`:

```kotlin
// AsyncTaskActivity.kt

// We store the reference so we can stop the task in `onDestroy`.
var task: DataTask? = null

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.coroutines)
    textView = findViewById(R.id.textView)

    // We need to store a weak reference. Otherwise, the context will be
    // captured in the lambda.
    val weakTextView = WeakReference(textView)
    task = DataTask {text ->
        weakTextView.get()?.let {
            it.text = text
        }
    }.apply {
        // Immediately start executing the task.
        execute()
    }
}

override fun onDestroy() {
    super.onDestroy()
    // Cancel the execution of the task.
    task?.cancel(true)
}
```

As you can see, we need to take special care with our `TextView` so that we don’t actually capture the `Context` in the `AsyncTask` and cause a memory leak. Another thing to consider is that if we have multiple async tasks, we need to manually cancel all of them in `onDestroy`. With coroutines, this is automatically taken care of since they all run in the same `CoroutineContext`.

Now as a final step, let’s take a look at the RxJava answer to this problem.

## RxJava

[RxJava][] is a very popular framework for reactive programming in Java. The main advantage this has over coroutines is the multitude of built-in operators to transform and filter the data produced. Kotlin coroutines provide no special operators out of the box, although using the as-of-yet experimental [Channels][] API, you can do almost anything RxJava can do. Let’s see how that would look:

```kotlin
// RxJavaActivity.kt

var disposable: Disposable? = null

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.coroutines)
    textView = findViewById(R.id.textView)

    // We need to store the `Disposable` so we can stop executing
    // in `onDestroy`.
    disposable = Single.fromCallable {
        // Here we load a simple string from the web service.
        val url = URL("https://whatthecommit.com/index.txt")
        val connection = url.openConnection()
        return@fromCallable connection.getInputStream()
            .bufferedReader(Charset.forName("UTF-8")).readLine()
    }
        // Delay so it isn't executed immediately.
        // This replaces the `Thread.sleep` of the other examples.
        .delaySubscription(1000, TimeUnit.MILLISECONDS)
        // We subscribe on an IO scheduler so we don't block the
        // main thread.
        .subscribeOn(Schedulers.io())
        // But we observe on the main thread so we can update the UI.
        .observeOn(AndroidSchedulers.mainThread())
        .subscribe { text, _ ->
            textView.text = text
        }
}

override fun onDestroy() {
    super.onDestroy()

    // Dispose of our `Single` loading the text.
    disposable?.dispose()
}
```

This is a pretty straightforward use of RxJava. Now the only thing we have to take care of is disposing of the subscription once the `Activity` is destroyed. Compared to our coroutine implementation, there is less boilerplate to be concerned with (setting up the `CoroutineContext`), and this will also work in Java, whereas coroutines are Kotlin only.

## Conclusion

We took a deeper look into how coroutines work and how to use them, and we spent time comparing them to `AsyncTask` and RxJava. The right choice of tool is very much dependent on the task that needs to be solved; as such, there is no reason not to use coroutines and RxJava side by side. Meanwhile, `AsyncTask` really shouldn’t be used anymore when there are so many more advanced and less error-prone mechanisms for concurrent programming available.

[coroutines]: https://kotlinlang.org/docs/reference/coroutines/coroutines-guide.html
[`asynctask`]: https://developer.android.com/reference/android/os/AsyncTask
[rxjava]: https://github.com/ReactiveX/RxJava
[definition]: https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/basics.md
[`coroutinescope`]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[`delay()`]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html
[`withcontext`]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html
[official documentation]: https://kotlinlang.org/docs/reference/coroutines/basics.html
[channels]: https://kotlinlang.org/docs/reference/coroutines/channels.html
