---
title: "How We Improved Keyboard Navigation Accessibility in Our Android SDK"
description: "A look at the steps we took to start improving the accessibility of our Android SDK."
preview_image: /images/blog/2019/how-we-improved-the-accessibility-of-the-android-sdk/article-header.png
section: blog
author:
  - Reinhard Hafenscher
date: 2019-11-13 8:00 UTC
tags: Android, Development
published: true
secret: false
---

We recently released [PSPDFKit for Android 6][], and one big part of this release was to make our UI more accessible to users. The first step toward accessibility, which is the one we tackled in this release, was to make keyboard navigation work smoothly and effortlessly. READMORE In this blog post, I’ll provide some insight into what we did with PSPDFKit and what the Android framework provides to make this job easier.

## What We Started With

When starting out, we took a look at our main UI, the [`PdfActivity`][], and checked to see if there were any glaring issues in regard to accessibility. It quickly became clear that our activity was practically unusable with just a keyboard.

![Wrong focus](/images/blog/2019/how-we-improved-the-accessibility-of-the-android-sdk/wrong-focus.png "An item is focused behind the currently visible toolbar.")

As you can see above, as highlighted by the green rectangle, we had many UI elements that were focusable but not visible to the user, along with ones that shouldn’t have been focusable at all. We also had the issue that focus jumped unexpectedly between unrelated UI elements, or it couldn’t even be changed. The reason for this is that while Android provides a robust system for keyboard navigation due to its heritage, this system falls apart as soon as your UI reaches a certain level of complexity. We wanted to improve this, both for users who need keyboards to use their devices, and for Chromebook users who would benefit from being able to do more with their keyboards.

## Tools We Used to Identify Issues

The first step we took was looking into how keyboard navigation was already behaving. To do that, we simply used the Android Emulator, since you can use your keyboard to control it. We also used [TalkBack][], which is part of the Android Accessibility Suite. TalkBack not only serves as a screen reader that helps you verify that all accessibility labels are configured correctly, but it also provides its own focus highlighting, which allows you to see where your focus moves, even if the UI element is hidden. You can see this in the above screenshot; the green rectangle is rendered by TalkBack.

Once we identified what we wanted to improve using the emulator and TalkBack, we went on to the actual implementation.

## The Android Focus Framework

Since, historically, Android has been running on phones with keyboards, trackballs, and other hardware input methods, the system comes with the tools needed to make UIs usable using just those. All the standard UI components that are provided by the system support keyboard navigation out of the box, but issues start to arise when you’re developing your own custom layouts or if your layouts become sufficiently complicated.

If you start looking for documentation on how to provide keyboard navigation, there really is only [this][keyboard guide], which sadly is very sparse. It took some experimentation and looking through the Android sources, but we eventually figured out how to provide custom focusing behavior in our UI without having to reimplement everything.

### The Focus Finder

Let’s talk about the component Android uses to determine what to focus next, the [`FocusFinder`][]. It has a really simple API, shown below:

```kotlin
val newFocus = FocusFinder.getInstance()
    .findNextFocus(container, focusedView, View.FOCUS_FORWARD)
```

Internally, it uses the location of the views onscreen to determine where to move the focus. In this way, using the arrow keys to focus works in any arbitrary layout. What becomes problematic is if you layer multiple views on top of each other, with each one being partially visible. Since the [`FocusFinder`][] doesn’t understand this, it’ll happily focus on hidden or only partially visible views. In order to make it work as well as possible, there are two takeaways we found while working on this.

> **Takeaway 1:** When animating views, always make sure that if they end up not visible for whatever reason (translation, alpha, scale) to set their visibility to `INVISIBLE` or `GONE` so they aren’t accidentally focused. This also pertains to views that start out hidden; make sure to not just set their alpha to `0` but to actually mark them as `INVISIBLE`.

> **Takeaway 2:** When you have overlapping views, disable focusing for views that are partially or completely hidden behind others. If the view that is being overlapped itself is focusable, simply use `View#setFocusable(false)`. If it is a container with multiple focusable views inside it, you can use `ViewGroup#setDescendantFocusability(ViewGroup.FOCUS_BLOCK_DESCENDANTS)` to make none of the views focusable in a single call.

## Providing Custom Focus Handling

Sadly, the [`FocusFinder`][] wasn’t enough for us, as we needed more control. We actually needed to implement some custom behavior to determine how to move the focus across the UI, and to do this, we had to override [`ViewGroup#focusSearch()`][]. The documentation of this method is a bit sparse, but basically, whenever a key event remains unhandled and is relevant for focusing — for example, when using the arrow keys or the tab key — Android will go from the currently focused view, up into the view hierarchy, and call `focusSearch`. The default implementation in `ViewGroup` just goes up until it reaches the view root and then uses the [`FocusFinder`][].

Since we wanted to do better than that, we have our own root view in the [`PdfActivity`][]. Here we make sure that hitting tab moves through the UI elements in a predictable manner. Overall, implementing `focusSearch` is pretty straightforward. Below is the custom implementation we have in our thumbnail bar since it is a completely custom layout:

```kotlin
override fun focusSearch(focused: View, direction: Int): View {
    if (!shouldFindFocus(focused, direction)) {
        // Let the parent find a view to focus.
        return super.focusSearch(focused, direction)
    }

    // We first check if we have a focusable image view anywhere.
    val foundFocus = FocusFinder.getInstance().findNextFocus(this, focused, direction)
    // Return any focusable child we find or let the parent handle it.
    return foundFocus ?: super.focusSearch(focused, direction)
}

/**
 * Checks if, based on the currently focused view and the direction, we should search for a view
 * inside this view.
 */
private fun shouldFindFocus(focused: View, direction: Int): Boolean {
    if (direction == View.FOCUS_BACKWARD && focused.getTag(com.pspdfkit.R.id.pspdf__tag_key_page_index) == 0) {
        // If we focus back and are on the first child, don't keep focus inside this view.
        return false
    } else if (direction == View.FOCUS_FORWARD && focused.getTag(com.pspdfkit.R.id.pspdf__tag_key_page_index) == document!!.getPageCount() - 1) {
        // If we are on the last child and focus forward, also don't keep the focus.
        return false
    }

    // Otherwise, we are good to focus that view.
    return true
}
```

The above code is used so that if an item in our thumbnail bar is focused, hitting tab will focus the next view inside the thumbnail bar instead of some random item onscreen. It also makes sure that once we reach the boundaries, other parts of the UI can be focused. Once we have determined that we want to handle this focus event by calling `shouldFindFocus`, we use the [`FocusFinder`][] to find the child view that should be focused next. Then we simply return the view that should be focused; though we could also return `null`, in which case, the focus would remain unchanged.

## Final Thoughts

Being aware of the experience of your keyboard users while you are developing your apps can save you a lot of work later on. By following a few simple steps, you can make the framework’s job of determining what to focus easier and more predictable. And if you need even more control, overriding `focusSearch` gives you full control over where the focus moves. Using these tools, you should be able to make your app fully controllable using the keyboard.

[pspdfkit for android 6]: https://pspdfkit.com/blog/2019/pspdfkit-android-6/
[`pdfactivity`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html
[talkback]: https://play.google.com/store/apps/details?id=com.google.android.marvin.talkback&hl=de
[keyboard guide]: https://developer.android.com/training/keyboard-input/navigation
[`focusfinder`]: https://developer.android.com/reference/android/view/FocusFinder?hl=en
[`viewgroup#focussearch()`]: https://developer.android.com/reference/android/view/ViewGroup.html?hl=en#focusSearch(android.view.View,%20int)
