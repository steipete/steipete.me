---
title: "Keyboard Handling on Android"
section: blog

author: Tomáš Šurín
author_url: https://twitter.com/tomassurin
date: 2016-05-05 12:00 UTC
tags: Android, Development
published: true
---

Working with a soft keyboard on Android can be confusing. While implementing free-text annotation editing into the PSPDFKit for Android framework, we felt this way many times. Here's some of the lessons we learned along the way.
READMORE

## Responding to keyboard visibility

The default behavior when the Android soft keyboard appears on the screen is to just draw its contents over the existing application UI. While such behavior is acceptable for the majority of use cases, there are instances where important parts of the UI get overlaid by the keyboard, as shown here below:

<img src="/images/blog/2016/keyboard-handling-on-android/soft-input-mode-unspecified.gif" width="300" alt="Problematic keyboard" />

Android has [built in support][] for resizing your application layout when the soft keyboard is being shown that prevents the app's contents from being covered up. To use the support, you just need to set
[`android:windowSoftInputMode="adjustResize"`][] attribute in your manifest's `<activity>` element. When you prefer a Java approach or need to change the soft input mode dynamically you can also use:

```java
activity.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
```

We are using a custom view for displaying PDF documents that need resizing. Finding the correct view size was easy - all views get notified about a size change via the [`onSizeChanged(int, int, int, int)`][`onSizeChanged`] method. After carefully implementing the resize logic, we were able to react to keyboard resizing our view.

## Fullscreen mode

Using `adjustResize` works great. However, it has its limitations when your application is in fullscreen mode. Let's take a look at what the official documentation entry for [`SOFT_INPUT_ADJUST_RESIZE`][] says:

>If the window's layout parameter flags include FLAG_FULLSCREEN, this value for softInputMode will be ignored; the window will not resize, but will stay fullscreen.

After researching this issue more closely, we found out that this statement is true in the sense that it does not resize application contents automatically. Despite this, views are still getting notified about the keyboard being shown or hidden when in fullscreen mode by providing window insets to views via the [`fitSystemWindows(Rect)`][`fitSystemWindows`] method.

By calling [`setFitsSystemWindows(true)`][] on a view that needs to be resized, you can enable default implementation of the [`fitSystemWindows`][] method. Doing so will automatically consume changing insets for all window decorations (system bar, action bar, navigation bar) as well as the soft keyboard. When you need more control or just don't want to consume insets (other views in hierarchy might want to use them) you can override the default behavior in your custom views.

Note that [`fitSystemWindows`][] has been deprecated in API 20 and superseded with [`onApplyWindowInsets(WindowInsets)`][`onApplyWindowInsets`].

## Detecting keyboard visibility

Next, we needed to scroll to edited free-text annotations when the keyboard was being shown. Unfortunately, Android has no ready to use API for listening to the soft keyboard's visibility or even testing if the soft keyboard is visible.

The standard workaround for detecting keyboard visibility takes advantage of the `adjustResize` mode and uses [`OnGlobalLayoutListener`][] on the top level content view. We can assume that the keyboard was shown or hidden whenever the view height changes over a specified threshold. As we learned already this won't work in fullscreen mode because views are not resized then.

But nothing was lost. We already knew that [`fitSystemWindows`][] notifies us about correct insets. In the worst case, we could always create a dummy custom view and use it to detect keyboard visibility. After diving into the documentation and framework source code, we discovered a better solution. The method [`getWindowVisibleDisplayFrame(Rect)`][`getWindowVisibleDisplayFrame`] can be used to retrieve a view's visible rectangle.

After this discovery, we could create a keyboard visibility listener that is simple to use and works even in fullscreen mode:

```java
// Threshold for minimal keyboard height.
final int MIN_KEYBOARD_HEIGHT_PX = 150;

// Top-level window decor view.
final View decorView = activity.getWindow().getDecorView();

// Register global layout listener.
decorView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
    private final Rect windowVisibleDisplayFrame = new Rect();
    private int lastVisibleDecorViewHeight;

    @Override
    public void onGlobalLayout() {
        // Retrieve visible rectangle inside window.
        decorView.getWindowVisibleDisplayFrame(windowVisibleDisplayFrame);
        final int visibleDecorViewHeight = windowVisibleDisplayFrame.height();

        // Decide whether keyboard is visible from changing decor view height.
        if (lastVisibleDecorViewHeight != 0) {
            if (lastVisibleDecorViewHeight > visibleDecorViewHeight + MIN_KEYBOARD_HEIGHT_PX) {
                // Calculate current keyboard height (this includes also navigation bar height when in fullscreen mode).
                int currentKeyboardHeight = decorView.getHeight() - windowVisibleDisplayFrame.bottom;
                // Notify listener about keyboard being shown.
                listener.onKeyboardShown(currentKeyboardHeight);
            } else if (lastVisibleDecorViewHeight + MIN_KEYBOARD_HEIGHT_PX < visibleDecorViewHeight) {
                // Notify listener about keyboard being hidden.
                listener.onKeyboardHidden();
            }
        }
        // Save current decor view height for the next call.
        lastVisibleDecorViewHeight = visibleDecorViewHeight;
    }
});
```

In addition to being notified about the keyboard being shown or hidden, we also benefited from knowing the keyboard height. We ended up using the calculated keyboard height as the bottom margin for our custom PDF document view in fullscreen mode. Going this route has the nice benefit of changing the view size and calling [`onSizeChanged`][] like in the non-fullscreen mode scenario. Also, we no longer have to deal with [`fitSystemWindows`] in our custom views anymore.

## Conclusion

Our free-text annotation editor now reacts correctly to the soft keyboard. When a user starts typing, it scrolls into view leading to a much better experience:

<img src="/images/blog/2016/keyboard-handling-on-android/soft-input-mode-adjust-resize.gif" width="300" alt="Resizing layout when keyboard is being shown" />

<!-- References -->

[built in support]: http://developer.android.com/training/keyboard-input/visibility.html#Respond

[`android:windowSoftInputMode="adjustResize"`]: http://developer.android.com/guide/topics/manifest/activity-element.html#wsoft

[`onSizeChanged`]: http://developer.android.com/reference/android/view/View.html#onSizeChanged(int,%20int,%20int,%20int)

[`SOFT_INPUT_ADJUST_RESIZE`]: http://developer.android.com/reference/android/view/WindowManager.LayoutParams.html#SOFT_INPUT_ADJUST_RESIZE

[`fitSystemWindows`]: http://developer.android.com/reference/android/view/View.html#fitSystemWindows(android.graphics.Rect)

[`setFitsSystemWindows(true)`]: http://developer.android.com/reference/android/view/View.html#setFitsSystemWindows(boolean)

[`onApplyWindowInsets`]: http://developer.android.com/reference/android/view/View.html#onApplyWindowInsets(android.view.WindowInsets)

[`OnGlobalLayoutListener`]: http://developer.android.com/reference/android/view/ViewTreeObserver.OnGlobalLayoutListener.html

[`getWindowVisibleDisplayFrame`]: http://developer.android.com/reference/android/view/View.html#getWindowVisibleDisplayFrame(android.graphics.Rect)
