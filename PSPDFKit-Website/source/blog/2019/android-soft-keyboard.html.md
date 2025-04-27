---
title: "The Soft Keyboard on Android"
description: "Tips for working with the soft keyboard on Android."
preview_image: /images/blog/2019/android-soft-keyboard/article-header.png
section: blog
author:
  - Anastasiia Zhuravleva
date: 2019-07-02 7:00 UTC
tags: Android, Development
published: true
secret: false
---

The soft keyboard (also called the onscreen keyboard) is the main input method on Android devices, and almost every Android developer needs to work with this component at some point. At first glance, it may seem like a trivial task, since the only operations you usually want are for showing and hiding the keyboard — actions that can happen automatically through the available Android APIs. But there’s a bit more to the soft keyboard than meets the eye, so let’s take a look at offered APIs and try to understand what are they used for.

## windowSoftInputMode in Android Manifest

The `windowSoftInputMode` attribute is set on the activity — usually through the Android manifest — and it specifies the way the onscreen keyboard behaves when an activity comes into a user’s focus. We suggest first checking out the available customization options to see if they will be enough for a particular use case before writing any custom keyboard handling logic.

Using this attribute, it’s possible to influence two aspects:

- The visibility of the soft keyboard when the activity receives the focus (`stateUnspecified`, `stateHidden`, `stateAlwaysVisible`, etc.).
- The changes made to the activity’s main window to accommodate the keyboard view. The options here are resizing, which will make the activity layout small in order to free space for the keyboard, or panning the activity’s contents to make the current focus view visible and keep the part of the window under the soft keyboard (`adjustUnspecified`, `adjustResize`, and `adjustPan`).

Take a look at the [official documentation for `windowSoftInputMode`][] for more information.

All that said, if `windowSoftInputMode` customization options aren’t sufficient for your use case, here is how to manually control the visibility of the soft keyboard.

## How to Hide the Soft Keyboard

Because hiding the keyboard is more complex than showing it, and because it’s required more often, let’s start with it.

The required way for an application to hide the soft keyboard is by using `InputMethodManager#hideSoftInputFromWindow`. However, to access this functionality, it’s necessary to provide a context and a window token. Getting the context is usually trivial, but you may be wondering what the window token is and what it’s used for.

A window token is a special token used by the window manager to uniquely identify a window in the system. It is important for security reasons; it makes it impossible to draw on top of the windows of other applications, thereby preventing potential malicious intent.

So, even though our intention is to hide the keyboard, we still must provide a window token that matches the window currently accepting input. Otherwise, `InputMethodManager` will reject the request. This security mechanism prevents one application from force-closing the keyboard opened by another application.

Now that we know more about the window token, the next question is how we get it. Unfortunately, there is no one way to request the window token on all devices and APIs, but we’ll present a few that should work in most cases.

Here is how to hide the soft keyboard:

[==

```kotlin
fun hideKeyboard(view: View) {
   // Retrieving the token if the view is hosted by the fragment.
   var windowToken: IBinder? = view.windowToken

   // Retrieving the token if the view is hosted by the activity.
   if (windowToken == null) {
       if (view.context is Activity) {
           val activity = view.context as Activity
           if (activity.window != null && activity.window.decorView != null) {
               windowToken = activity.window.decorView.windowToken
           }
       }
   }

   // Hide if shown before.
   val inputMethodManager = view
        .context
        .getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
   inputMethodManager.hideSoftInputFromWindow(windowToken, 0)
}
```

```java
void hideKeyboard(final @NonNull View view) {
   // Retrieving the token if the view is hosted by the fragment.
   IBinder windowToken = view.getWindowToken();

   // Retrieving the token if the view is hosted by the activity.
   if (windowToken == null) {
       if (view.getContext() instanceof Activity) {
           final Activity activity = (Activity) view.getContext();
           if (activity.getWindow() != null && activity.getWindow().getDecorView() != null) {
               windowToken = activity.getWindow().getDecorView().getWindowToken();
           }
       }
   }

   // Hide if shown before.
   InputMethodManager inputMethodManager = (InputMethodManager) view
        .getContext()
        .getSystemService(Context.INPUT_METHOD_SERVICE);
   inputMethodManager.hideSoftInputFromWindow(windowToken, 0);
}
```

==]

## How to Show the Soft Keyboard

Let’s take a look at a simple API for showing the soft keyboard. To do this, there is no longer a need to provide a window token. However, there is a small tweak required in order to make sure that the keyboard is correctly shown in landscape mode:

[==

```kotlin
fun showKeyboard(view: View) {
   // When we want the keyboard to be displayed on phones in landscape mode, we need
   // to specify the `SHOW_FORCED` flag to correctly show the fullscreen keyboard.
   val isLandscape = view
       .context
       .resources
       .configuration
       .orientation == Configuration.ORIENTATION_LANDSCAPE

   val flags = if (isLandscape) SHOW_FORCED else SHOW_IMPLICIT

   val inputMethodManager = view
       .context
       .getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
   inputMethodManager.showSoftInput(view, flags)
}
```

```java
void showKeyboard(final @NonNull View view) {
   // When we want the keyboard to be displayed on phones in landscape mode, we need
   // to specify the `SHOW_FORCED` flag to correctly show the fullscreen keyboard.
   final boolean isLandscape = view
       .getContext()
       .getResources()
       .getConfiguration()
       .orientation == Configuration.ORIENTATION_LANDSCAPE;

   int flags = isLandscape ? SHOW_FORCED : SHOW_IMPLICIT;

   InputMethodManager inputMethodManager = (InputMethodManager) view
       .getContext()
       .getSystemService(Context.INPUT_METHOD_SERVICE);
   inputMethodManager.showSoftInput(view, flags);
}
```

==]

In this code snippet, we used the [`SHOW_FORCED`][] flag for landscape mode instead of the usual [`SHOW_IMPLICIT`][] flag in order to make sure the keyboard will be correctly displayed. The documentation for the `SHOW_IMPLICIT` flag states that this request is indeed implicit and the system might not favor the request in some circumstances, with landscape mode appearing to be one of such cases.

## Conclusion

In this blog post, we discussed what the soft keyboard is and the reason why it’s more complicated to hide than it is to show. Hopefully this has given you a better overview of the soft keyboard and some helpful tips for working with it.

[official documentation for `windowsoftinputmode`]: https://developer.android.com/guide/topics/manifest/activity-element.html#wsoft
[`show_forced`]: https://developer.android.com/reference/android/view/inputmethod/InputMethodManager.html#SHOW_FORCED
[`show_implicit`]: https://developer.android.com/reference/android/view/inputmethod/InputMethodManager.html#SHOW_IMPLICIT
