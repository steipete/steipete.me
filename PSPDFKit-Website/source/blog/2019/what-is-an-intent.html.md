---
title: "What Is an Intent?"
description: "An overview of intents, their uses, and pitfalls to consider."
preview_image: /images/blog/2019/what-is-an-intent/article-header.png
section: blog
author:
  - Reinhard Hafenscher
date: 2019-08-27 8:00 UTC
tags: Android, Development
published: true
secret: false
---

Today we’ll take a look at one of the core components of all Android applications: intents. READMORE In this blog post, we’ll discuss what intents are, where they are used, and what pitfalls to consider. So let’s get started.

## What Is an Intent?

You can think of an intent as a set of data describing an action a user wants to perform. Examples of intents include opening a gallery app, editing a document, picking a file or directory, adding a new calendar event, etc. Now let’s look at all the things contained in an intent.

### Action

Every intent can include an `action` that generally describes which action you want to perform. Examples include `ACTION_VIEW` to display a piece of data using the most appropriate applications, `ACTION_DIAL` to open the dialer with a phone number prefilled, and many more.

### Data and Type

Next up, you can add `data` to your intent in the form of a `Uri`. This `Uri` should point to the data you want to perform the action on. For example, in the case of `ACTION_DIAL`, the `data` could be a phone number like `tel:012345`. If you want to open a PDF document, it could be a file URI pointing to the document.

Furthermore, you can specify the `type` to narrow down the scope of your intent. In most cases, Android will automatically determine the MIME type of your data based on the `Uri` you specified for the `data` in your intent. In cases where automated inference is not possible, you can manually specify the `type` in addition to the `data`.

> **ℹ️ Pro Tip:** [`Intent#setData()`][] will reset any `type` that was set, and [`Intent#setType()`][] will remove any `data` that was set. If you want to set both `data` and `type`, you have to use [`Intent#setDataAndType()`][] instead.

### Component

There is also the `component`, which can be specified when you want to pass an intent to a specific class instead of letting the system automatically determine the best way to handle it. You can either set a [`ComponentName`][] if you want to specify an `Activity` or `Service` that isn’t part of your application, or you just set the `Class` if it is part of your application. If a `component` is specified, this intent is considered an **explicit intent**, meaning it will always resolve to the specific `component` that was set. On the other hand, if no `component` was set, it is considered an **implicit intent**, meaning that the system will try to find the most appropriate `Activity` or `Service` to handle it. In cases where there are multiple activities that could handle an intent, the system will show a dialog allowing the user to choose which one to use.

### Extras

Finally, there are the `extras`, which are where you can add any other information that doesn’t fit into either the `action`, `data`, or `type`. The `extras` are just a [`Bundle`][], and as such, you can store arbitrary primitive data or `Parcelable` and `Serializable` objects in them. Keep in mind that you should never use the `extras` bundle to pass around big amounts of data, as doing so will cause a [`TransactionTooLargeException`][] to be thrown.

## Where Are Intents Used?

Now that we know the basics of what is contained in an intent, let’s look at where intents are used, starting with the most common use case: opening activities in your own application. To open an `Activity` in your own application, you’ll use the [`Intent(Context packageContext, Class<?> cls)`][] constructor most of the time. This creates an **explicit intent**, meaning that this intent will only ever start the class specified in the constructor. Once you’ve created your intent, you will use [`Context#startActivity()`][] to start your `Activity`.

Another common use case for intents is to share data with other applications that are installed on a phone. To get an intent to share data, you can use [`ShareCompat.IntentBuilder`][], which will prepare an intent for you. The intent you acquire from calling [`createChooserIntent()`][] will be an **implicit intent**, meaning that no `component` was specified and any supported `Application` on the device might be used.

You can even use intents to get data into your `Application` using [`Activity#startActivityForResult()`][], which allows the started `Activity` to return a result to the starting `Activity`’s [`onActivityResult`][]. This is used, for example, when you want to allow users to take a picture in your application but don’t want to provide your own camera integration. Google provides a great guide on how to do this, which you can find [here][camera guide].

Finally, among other things, intents are used both to start services and for broadcasts sent by the system and other applications.

## Common Pitfalls

To wrap up this blog post, let’s look at some common issues you might encounter when using intents.

### Be Careful with Implicit Intents

Android’s system of using intents to communicate across applications is great because it allows you to integrate features provided by all kinds of different applications into yours. However, there is one problem with this: Not every user has the same set of applications installed.

If you are using an **implicit intent** to start an `Activity`, you should always ensure there is an `Activity` to handle the intent on the device. Otherwise, you will receive an [`ActivityNotFoundException`][]. To prevent this, you should use the [`Intent#resolveActivity()`][] method. This will tell you if there is an `Activity` to handle your intent.

### Don’t Overload Your Extras

As discussed before, you can put arbitrary `extras` into your intent, but you should be careful what and how much you put in there. As mentioned earlier, the system will throw a [`TransactionTooLargeException`][] if you try to put too much data into an intent. To work around this, there are plenty of tools you can use.

If you are just trying to pass large data from one `Activity` to another in your application, you could, for example, store the data in your [application’s file directory][] and put just the path in the intent. On the other hand, if you are trying to pass large amounts of data to an external application, you should consider using a [`ContentProvider`][], which will allow you to use the URIs it provides and pass them to any application you want.

## Conclusion

In this blog post, we took a look at what an intent contains. We also looked at common use cases that require the use of an intent. Finally, we highlighted common pitfalls one might encounter when using intents. We hope that this helped you gain a deeper understanding of what intents are and where to use them.

[`intent#setdataandtype()`]: https://developer.android.com/reference/android/content/Intent.html#setDataAndType(android.net.Uri,%20java.lang.String)
[`intent#setdata()`]: https://developer.android.com/reference/android/content/Intent.html#setData(android.net.Uri)
[`intent#settype()`]: https://developer.android.com/reference/android/content/Intent.html#setType(java.lang.String)
[`transactiontoolargeexception`]: https://developer.android.com/reference/android/os/TransactionTooLargeException?hl=en
[`componentname`]: https://developer.android.com/reference/android/content/ComponentName.html
[`intent(context packagecontext, class<?> cls)`]: https://developer.android.com/reference/android/content/Intent.html#Intent(android.content.Context,%20java.lang.Class%3C?%3E)
[`context#startactivity()`]: https://developer.android.com/reference/android/content/Context.html#startActivity(android.content.Intent)
[`context#startservice()`]: https://developer.android.com/reference/android/content/Context.html#startService(android.content.Intent)
[`sharecompat.intentbuilder`]: https://developer.android.com/reference/androidx/core/app/ShareCompat.IntentBuilder.html?hl=en
[`createchooserintent()`]: https://developer.android.com/reference/androidx/core/app/ShareCompat.IntentBuilder.html?hl=en#createChooserIntent()
[`activity#startactivityforresult()`]: https://developer.android.com/reference/android/app/Activity.html#startActivityForResult(android.content.Intent,%20int)
[`onactivityresult`]: https://developer.android.com/reference/android/app/Activity.html#onActivityResult(int,%20int,%20android.content.Intent)
[camera guide]: https://developer.android.com/training/camera/photobasics
[`activitynotfoundexception`]: https://developer.android.com/reference/android/content/ActivityNotFoundException?hl=en
[`intent#resolveactivity()`]: https://developer.android.com/reference/android/content/Intent.html#resolveActivity(android.content.pm.PackageManager)
[`contentprovider`]: https://developer.android.com/reference/kotlin/android/content/ContentProvider?hl=en
[application’s file directory]: https://developer.android.com/reference/android/content/Context.html?hl=en#getFilesDir()
[`bundle`]: https://developer.android.com/reference/android/os/Bundle
