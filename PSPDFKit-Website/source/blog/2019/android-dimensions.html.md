---
title: "Understanding Android Dimensions"
description: "A post about existing Android dimensions, their purpose, and common conversion rules."
preview_image: /images/blog/2019/android-dimensions/article-header.png
section: blog
author:
  - Anastasiia Zhuravleva
date: 2019-05-27 8:00 UTC
tags: Development, Android
published: true
secret: false
---

For many beginners, all the different dimensions used on Android devices might seem vague and hard to understand. So in this blog post, I’ll try to shed some light on the various measurements used, talk about their relationship to each other and real-world measurement systems, and take a look at conversion rules.

## How to Convert Between `dp` and Pixels

Before we get started, let’s first deal with the frequently asked question of how to convert density-independent pixels, or `dp`, to pixels and back:

[==

```kotlin
fun convertDpToPixels(context: Context, dp: Int) =
    (dp * context.resources.displayMetrics.density).toInt()

fun convertPixelsToDp(context: Context, pixels: Int) =
    (pixels / context.resources.displayMetrics.density).toInt()
```

```java
float convertDpToPixels(Context context, int dp) {
    return (int) (dp * context.getResources().getDisplayMetrics().density);
}

float convertPixelsToDp(Context context, int pixels) {
    return (int) (pixels / context.getResources().getDisplayMetrics().density);
}
```

==]

The code above uses integer values, which offer enough precision for most scenarios. If you require even more precise measures, here is the version that uses floats:

[==

```kotlin
fun convertDpToPixels(context: Context, dp: Float) =
    dp * context.resources.displayMetrics.density

fun convertPixelsToDp(context: Context, pixels: Float) =
    pixels / context.resources.displayMetrics.density
```

```java
float convertDpToPixels(Context context, float dp) {
    return dp * context.getResources().getDisplayMetrics().density;
}

float convertPixelsToDp(Context context, float pixels) {
    return pixels / context.getResources().getDisplayMetrics().density;
}
```

==]

## Why Not TypedValue#applyDimension?

So, what about the code snippet that uses `TypedValue#applyDimension` and is often mentioned as a proper way to convert between `dp` and pixels?

Here is the snippet in question:

[==

```kotlin
val pixels = TypedValue.applyDimension(
    TypedValue.COMPLEX_UNIT_DIP,
    dp,
    context.resources.displayMetrics
)
```

```java
float pixels = TypedValue.applyDimension(
    TypedValue.COMPLEX_UNIT_DIP,
    dp,
    context.getResources().getDisplayMetrics()
);
```

==]

To answer the question, let’s take a look what `TypedValue#applyDimension` has under the hood. The following snippet is taken from `TypedValue.java`:

```java
/**
 * Converts an unpacked complex data value holding a dimension to its final floating
 * point value. The two parameters <var>unit</var> and <var>value</var>
 * are as in {@link #TYPE_DIMENSION}.
 *
 * @param unit The unit to convert from.
 * @param value The value to apply the unit to.
 * @param metrics Current display metrics to use in the conversion --
 *                supplies display density and scaling information.
 *
 * @return The complex floating point value multiplied by the appropriate
 * metrics depending on its unit.
 */
public static float applyDimension(int unit, float value, DisplayMetrics metrics) {
    switch (unit) {
        case COMPLEX_UNIT_PX:
            return value;
        // That is what we were passing when converting DP to pixels.
        case COMPLEX_UNIT_DIP:
            // Just multiplying the value on screen density.
            return value * metrics.density;
        case COMPLEX_UNIT_SP:
            return value * metrics.scaledDensity;
        case COMPLEX_UNIT_PT:
            return value * metrics.xdpi * (1.0f/72);
        case COMPLEX_UNIT_IN:
            return value * metrics.xdpi;
        case COMPLEX_UNIT_MM:
            return value * metrics.xdpi * (1.0f/25.4f);
    }
    return 0;
}
```

As you can see from the code above, the operation performed by `applyDimension` is exactly the same as what was suggested for converting `dp` to pixels in the first section of this blog post. In the end, which version you choose comes down to a matter of taste. You can decide if you want to use either `TypedValue#applyDimension()` or the more obvious formula, which uses multiplying to get pixels from `dp` and dividing to reverse the conversion.

## More about Metrics

Now let’s take a look at each `case` statement from `applyDimension`, along with examining what they’re used for.

### px or Raw Pixels

The first one, `COMPLEX_UNIT_PX`, is easy. Notice how it just returns the original value and performs no additional modifications to it. As a result, it sheds light on what exactly is being returned by `applyDimension` in each specified case: physical pixels on the device screen.

### dp or Density-Independent Pixels

Density-independent pixels are an abstract measurement unit based on the physical density of the screen, which varies depending upon the Android device in question. The main goal of introducing this unit is to provide consistency in the size of UI elements (layouts, views, buttons, etc.) across different devices.

To put it simply, it makes sure that any view will take over the same portion of a screen space, no matter the number of pixels. Additionally, the higher the pixel density, the more pixels will be used to represent one `dp`.

However, starting with Android 7, a different use was introduced for screen density. This allows the user to adjust the density and make UI components appear larger or smaller. It is generally located at Settings > Accessibility > Display size (this could vary depending upon the device and Android version). Here are examples for the default, minimum, and maximum settings:

![Display size setting](/images/blog/2019/android-dimensions/display_size.png)

### sp or Scale-Independent Pixels

`sp` is similar to `dp` in the sense that it reserves a certain number of pixels to represent itself. The difference is that it is also scaled by the user’s font size preference for a text. So basically, `sp` is the same as `dp`, except it’s used for text instead of images. Here are setting examples of font size preference variants:

![Font size setting](/images/blog/2019/android-dimensions/font_size.png)

### in, pt, and mm

`in`, `pt`, and `mm` (in `COMPLEX_UNIT_IN/PT/MM`) represent the number of pixels per inch, point (1/72 of an inch), and millimeters, respectively. But in practice, they shouldn’t be used for any precise calculations related to the real physical world, because there are some devices out there that report inaccurate `xdpi` values to the Android system. This results in incorrect conversions to inches, points, and millimeters.

If you still would like to use these metrics in your project, you can stick with `getRealMetrics` from `WindowManager`, which was introduced in API 17. It takes into account window decor views and physical device rotation when performing conversion, and it provides slightly more accurate results when compared with older metrics:

[==

```kotlin
val moreAccurateMetrics = DisplayMetrics()
activity.windowManager
        .defaultDisplay
        .getRealMetrics(moreAccurateMetrics)
```

```java
DisplayMetrics moreAccurateMetrics = new DisplayMetrics();
activity.getWindowManager()
        .getDefaultDisplay()
        .getRealMetrics(moreAccurateMetrics);
```

==]

So, there you have it: a somewhat in-depth explanation of Android dimension measurements.
