---
title: "Using Kotlin to Make the PSPDFKit API Even Better"
description: "Kotlin provides the ability to extend any class with new functionality, and we can use this to expand the PSPDFKit API."
preview_image: /images/blog/2018/using-kotlin-to-make-the-pspdfkit-api-even-better/article-header.png
section: blog
author:
  - Reinhard Hafenscher
date: 2018-03-12 12:00 UTC
tags: Android, Development, Kotlin
published: true
---

Here at PSPDFKit, we take great care that our APIs are easy to use, while still providing the necessary flexibility and extendibility for you to achieve what you want. But even with all the care taken, there are still areas that could be better. So what if I told you there was a way for you to improve upon our APIs yourself?

## Kotlin Extension Functions

Kotlin provides the ability to extend any class with new functionality via what’s known as extension functions. You can think of them as a fancy way to define *static* utility methods.

Take this static utility method in Java as an example:

```java
// Defining our utility function.
public static int getSummedCount(Groups groups) {
	return groups.getCountA() + groups.getCountB() + groups.getCountC();
}

// Calling our utility function.
int count = getSummedCount(groups);
```

In Kotlin, it would become the following extension function:

```kotlin
// Defining our extension function.
fun Groups.getSummedCount() = countA + countB + countC

// Calling our extension function.
val count = groups.getSummedCount()
```

As you can see, we can call our extension function just like we would any other method on the object. We aren’t going to go into all the details about extension functions here, but for more information you can check out the [official documentation].

### Example

To illustrate this idea, let’s look at one general example of how an extension function can improve your code.

Let’s say you want to show a `Toast` in your activity. Normally, it would look like the following:

```kotlin
fun showMessage() {
	Toast.makeText(this, R.string.message, Toast.LENGTH_SHORT).show()
}
```

Using an extension function, you can make this much cleaner, like so:

```kotlin
// Define our extension function.
fun Context.toast(resId: Int, duration: Int = Toast.LENGTH_SHORT) 
	= Toast.makeText(this, resId, duration).show()
```

Later, inside your `Activity`, you can call it like this:

```kotlin
fun showMessage() {
	// Use our newly created extension function.
	toast(R.string.message)
}
```

As shown above, using an extension function greatly simplified the code. We made the duration an optional parameter, since we use the same duration for most cases. We also moved the call to `show()` inside our extension function, so you no longer need to wonder why your `Toast` [was never displayed].

## How To Improve the PSPDFKit API 

While developing [PDF Viewer], we came up with a few extension functions that make using PSPDFKit even simpler. These range from basic (making properties easier to access) to complicated (turning a long-running synchronous task into something async). Let’s look at some examples right now.

### Examples

In many places, we had to modify an existing `PdfActivityConfiguration`, so we came up with this simple extension function to help out:

```kotlin
fun PdfActivityConfiguration.buildUpon(): PdfActivityConfiguration.Builder 
	= PdfActivityConfiguration.Builder(this)
```

This allows us to fluently modify the existing configuration in a `PdfActivity`:

```kotlin
val newConfiguration = configuration.buildUpon()
            .disableFormEditing()
            .build()
```

Another operation we often have to perform is resizing objects to fit within a certain format while retaining their width and height ratio:

```kotlin
fun Size.fitInside(targetWidth: Float?, targetHeight: Float?): Size =
    when {
        width == 0f || height == 0f -> Size(0f, 0f)
        targetWidth == null && targetHeight == null -> this
        else -> {
            val maxWidth = targetWidth ?: Float.MAX_VALUE
            val maxHeight = targetHeight ?: Float.MAX_VALUE
            val ratio = Math.min(maxWidth / width, maxHeight / height)
            Size(width * ratio, height * ratio)
        }
    }
```

We use this when rendering the previews for PDF files:

```kotlin
// Get the needed size for our preview image.
val targetSize = document
	.getPageSize(0)
	.fitInside(width.toFloat(), height.toFloat())
```

## Wrapping Things Up

Kotlin’s extension functions are incredibly powerful and can help make your code much more concise and clear. However, keep in mind that not everything should be an extension function, and there are still situations where a regular utility method makes more sense. 

You can find all the extension functions I talked about (and more) included in PSPDFKit for Android, beginning with version 4.3.1. — you can check them out in the [Catalog App] that we provide with the [60-day trial] of PSPDFKit for Android.

[official documentation]: https://kotlinlang.org/docs/reference/extensions.html
[was never displayed]: https://stackoverflow.com/a/7803287/2055996
[PDF Viewer]: https://play.google.com/store/apps/details?id=com.pspdfkit.viewer
[Catalog App]: https://pspdfkit.com/guides/android/current/getting-started/example-projects/
[60-day trial]: https://pspdfkit.com/try/