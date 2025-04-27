---
title: "Using ViewModels to Retain State on Android"
description: "How to use Android's ViewModel class to retain complex objects across configuration changes."
preview_image: /images/blog/2019/using-viewmodels-to-retain-state-on-android/article-header.png
section: blog
author:
  - Ivan Skoric
author_url:
  - https://twitter.com/skoric_
date: 2019-03-19 8:00 UTC
tags: Android, Development, ViewModel, MVVM, Architecture Components, Jetpack
published: true
secret: false
---

[`ViewModel`][] is a class that’s part of the [Android Architecture Components][] and contained in the [lifecycle][] library (see [here][add lifecycle components] on how to add Lifecycle components to your project). The main purpose of [`ViewModel`][] objects is to serve data to the Android UI components (such as activities and fragments) and to separate the data processing logic from the UI. One aspect of [`ViewModel`][] objects that we’ll focus on in this article is the fact that they’re aware of the UI components lifecycle, which means they can survive configuration changes.

## Limitations of Default State Restoration

State restoration has always been one of the most annoying aspects of Android development. By default, activities and fragments have an `onSaveInstanceState()` method that the system uses to provide a `Bundle` to which you can write primitive data and parcelable (or serializable) objects. That same `Bundle` is then provided once the UI component is being recreated, and that’s when you usually read all the data from the `Bundle` and update the UI.

This is all well and good as long as you’re managing simple data, such as strings or primitive values. But problems start to occur once you need to restore something more complex — something more memory demanding, such as bitmaps, or maybe some asynchronous process that’s currently running.

What you would usually do is either use loaders or store objects to some static classes. But loaders have been deprecated in favor of ViewModels, as the [loaders documentation][] nicely explains:

> Loaders have been deprecated as of Android P (API 28). The recommended option for dealing with loading data while handling the activity and fragment lifecycles is to use a combination of `ViewModels` and `LiveData`. ViewModels survive configuration changes like Loaders but with less boilerplate. LiveData provides a lifecycle-aware way of loading data that you can reuse in multiple ViewModels...ViewModels and LiveData are also available in situations where you do not have access to the `LoaderManager`, such as in a `Service`. Using the two in tandem provides an easy way to access the data your app needs without having to deal with the UI lifecycle.

Using these new components is also backward compatible, with a minimum supported API level of 14 by default ([see here for more information][version support and package names]).

## Retaining Objects by Using ViewModels

Let’s take a look at how ViewModels work and how we can use them to hold objects so that UI components can retain them when recreated.

### Getting a ViewModel Instance

In order to get an instance of [`ViewModel`][], first you need to get the [`ViewModelProvider`][] object for your particular UI component. You do this via one of the static methods, [`ViewModelProviders.of()`][], which takes your UI component as an argument and returns its respective [`ViewModelProvider`][]. After that, calling `get(YourViewModel::class.java)` on your [`ViewModelProvider`][] will give you the requested [`ViewModel`][] instance. The [`ViewModelProvider`][] is bound to that UI component, which means it reacts to its lifecycle changes accordingly.

**ℹ️ Note:** Providers for different UI components will create different [`ViewModel`][] instances, even if they use the same [`ViewModel`][] class.

A sample initialization would look like this:

```kotlin
class MyFragment : Fragment() {
    private lateinit var viewModel: MyViewModel
    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(MyViewModel::class.java)
    }
}
```

Here we’ve created a [`ViewModel`][] tied to `MyFragment`. This means that this [`ViewModel`][] is aware of the lifecycle of `MyFragment` and it will be retrieved with the previous state only if it’s provided for that fragment. `MyViewModel` can also be provided for some other fragment or activity, but in such a case, the new instance would be created for each of the components.

### Showcasing a Simple State Restoration

To understand how the state is restored when using a [`ViewModel`][], let’s create a simple, barebones example:

```kotlin
class MyViewModel : ViewModel() {

    // Stored cached bitmap.
    private var cachedBitmap: Bitmap? = null

    // Retrieves the image.
    fun getImage(): Bitmap {
        // If the image is not already cached, download it and cache it.
        if (cachedBitmap == null) {
            cachedBitmap = downloadImage()
        }

        return cachedBitmap
    }

    // Downloads image from the web.
    private fun downloadImage() : Bitmap {
        ...
    }

}
```

In this example, `MyViewModel` has the `getImage()` method the UI components can use to get an image from the web. `MyViewModel` will also cache the image when downloaded so it doesn’t have to be downloaded more than once.

**ℹ️ Note:** The above example serves the purpose of demonstrating that the `ViewModel` is restored when the configuration changes. The image downloading should be offloaded from the main thread, `LiveData` should be used, etc. We will improve this example when we introduce `LiveData` in the next section.

Now in `MyFragment`, let’s create a layout that has an `ImageView` that simply shows the downloaded image once the fragment is loaded:

```kotlin
class MainFragment : Fragment() {
    private lateinit var viewModel: MainViewModel
    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(MainViewModel::class.java)
        imageView.setImageBitmap(viewModel.getImage())
    }

}
```

The first time `getImage()` is called, the image will be downloaded. When the configuration changes — for example, if the screen orientation changes — the image will be loaded into the `ImageView` from cache, since the [`ViewModel`][] object is retained.

### Restoring State with LiveData

What is [`LiveData`][]? Here’s the definition from the [LiveData Overview][] section in the Android guides:

> [`LiveData`][] is an observable data holder class. Unlike a regular observable, [`LiveData`][] is lifecycle-aware, meaning it respects the lifecycle of other app components, such as activities, fragments, or services. This awareness ensures LiveData only updates app component observers that are in an active lifecycle state.

[`LiveData`][] is the proper way UI components should receive input from the ViewModels. [`LiveData`][], being an observable data holder class, is provided to the UI components by its [`ViewModel`][], and the UI component can subscribe to it and listen for the streamed results.

Let’s update our initial example where we retrieve the image to be displayed in the `ImageView`, this time using [`LiveData`][]. This is the outline of our `ViewModel` now:

```kotlin
class MyViewModel : ViewModel() {
    val imageLiveData = MutableLiveData<Bitmap>()
    fun getImage() {
        // ...
    }
}
```

This time, the `getImage()` method doesn’t return anything, and it will just be called from the UI component to start retrieving the image. Once the image is retrieved, either by being downloaded or pulled from the cache, it will be pushed to the `imageLiveData` object and delivered to all of its subscribers. Notice that `ViewModel` doesn’t care who is subscribed; it just emits the result.

The `MyFragment` implementation will now look like this:

```kotlin
class MyFragment : Fragment() {
    private lateinit var viewModel: MainViewModel
    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(MainViewModel::class.java)

        // We observe the bitmap emitted from `imageLiveData` and
        // display it in the `ImageView`.
        viewModel.imageLiveData.observe(this, Observer {
            imageView.setImageBitmap(it)
        })

        // Once the fragment is created, notify `ViewModel` to
        // retrieve the image. We could make an implementation
        // so that this is called when some button is clicked,
        // but we're keeping it simple to
        // get straight to the point.
        viewModel.getImage()
    }
}
```

A `ViewModel` needs to call [`setValue()`][] (or [`postValue()`][] if not on main thread) on the `LiveData` object to push the given value to all of the observers. Here’s the sample implementation for our case:

```kotlin
class MyViewModel : ViewModel() {
    // Some image downloader class.
    val imageDownloader = ImageDownloader()
    val imageLiveData = MutableLiveData<Bitmap>()

    fun getImage() {
        // If we don't have a value already pushed to the live data
        // and the download is not in progress, start a new one.
        if (imageLiveData.value == null && !imageDownloader.isDownloading) {
            // This is just some sample API that uses RxJava, but
            // it can be implemented in whichever way you like.
            imageDownloader.fromUrl(someUrl)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe {
                        // Push the value to the live data once retrieved.
                        bitmap -> imageLiveData.value = bitmap
                }
        } else if (imageLiveData.value != null) {
            // If we already have a value in our `LiveData` object,
            // just push it again so it's delivered to subscribers.
            val oldValue = imageLiveData.value
            imageLiveData.value = oldValue
        }
    }
}
```

That’s it. If there happens to be a configuration change while the image is being downloaded, the download process will continue being executed, since `MyViewModel` is not destroyed.

Once the UI is recreated and `getImage()` is called, `MyViewModel` will check if there was already a value pushed to the `imageLiveData` object. If so, it will push it again so that subscribers can consume it. If not, it will check if the download process has already started. If it hasn’t, it starts the new one. If it has, the running operation will post the result to the `imageLiveData` once it’s done.

If you happen to hold some RxJava `Disposable` or a handle to the download process itself, you can override `ViewModel`’s [`onCleared()`][] method and perform the clearance there. That method is called when the UI component related to it is destroyed and the resources can be safely cleared.

## Conclusion

Easier state restoration is just a consequence of the `ViewModel` implementation. ViewModels should serve a much wider purpose in your app than just restoring state. They should separate the business logic from the UI and deliver data to the UI using the observer pattern.

Being aware of the lifecycle of UI components and having a very nice syntax is a powerful tool when it comes to retaining objects and processes related to a particular UI component. This is also helpful when you need to dispose of them, clean up the memory resources, or prevent some state restoration bugs.

For more information on and examples of how to use the new architecture components, please see the [Android Architecture Components][] guides.

Thanks for reading!

[`viewmodel`]: https://developer.android.com/reference/android/arch/lifecycle/ViewModel
[`viewmodelprovider`]: https://developer.android.com/reference/android/arch/lifecycle/ViewModelProvider
[`viewmodelproviders.of()`]: https://developer.android.com/reference/android/arch/lifecycle/ViewModelProviders
[android architecture components]: https://developer.android.com/topic/libraries/architecture/
[add lifecycle components]: https://developer.android.com/topic/libraries/architecture/adding-components#lifecycle
[loaders documentation]: https://developer.android.com/guide/components/loaders
[version support and package names]: https://developer.android.com/topic/libraries/support-library/#api-versions
[livedata overview]: https://developer.android.com/topic/libraries/architecture/livedata
[`livedata`]: https://developer.android.com/reference/android/arch/lifecycle/LiveData
[lifecycle]: https://developer.android.com/topic/libraries/architecture/lifecycle
[`oncleared()`]: https://developer.android.com/reference/android/arch/lifecycle/ViewModel#oncleared
[`setvalue()`]: https://developer.android.com/reference/android/arch/lifecycle/LiveData#setvalue
[`postvalue()`]: https://developer.android.com/reference/android/arch/lifecycle/LiveData#postvalue
