---
title: "Making your application accessible to everyone"
description: A short guide on how to make your app more accessible for people who use assistive technologies.
section: blog
author:
  - Jernej Virag
author_url:
  - https://twitter.com/jernejv
date: 2017-05-27 12:00 UTC
tags: Android, Development
published: true
secret: true
---

Previous weeks' Global Accessibility Awareness Day is a great reminder for everyone that mobile devices are also an integral tool in lives of people with different disabilities. It's also a great reminder for all of us to check and see if our applications are built with accessibility in mind.

So let's take a look on how to make sure your Android application can be used with accessibility tools.

## Accessibility tools on Android

Android provides several assistances out of the box, the most important being:

* **Text size settings**: Users can increase text size in all applications to make it more readable to them.
* **Text to speech**: Several tools provide speech for text written in the apps. That may be via the application itself or the global "Select to Speak" utility added in Android 7.0.
* **TalkBack**: Talkback is a tool that allows users to use the smartphone without actually seeing the screen. It provides control and navigation of the UI and spoken feedback for selected and used items. This is the tool that blind and visually impared users will use to interact with their smartphone.

<img src="/images/blog/2017/accessibility-tools-on-android/tools.png" alt="Accessibility settings on Android 7.1.0 Nougat" width="50%">

Accessibility information also feeds Google Assistant screen scanning so properly implementing accessibility also significantly improves experience for users using Google Assistant.

The easiest way to test your app for accessibility is to enable Talkback on your phone and try to use the application fully by voice and gestures.

## Making your app accessible to everyone

For the tools mentioned in previous paragraphs to work correctly, we do need to help them understand how the app UI is actually structured and properly handle any special user preferences. Making most applications accessible is rather simple and doesn't require a huge time investment.

There are however a few things we need to be careful about:

### 1. Use `sp` as a unit for text sizes

[Scale independent pixels](https://developer.android.com/training/multiscreen/screendensities.html) (`sp`) is a unit that's very similar to `dp` but with an added bonus - it scales together with the user's font size setting as well. By default it's the same as it's corresponding `dp` size, but as soon as user changes the font size or selected `Large text size` (depending on Android version) the font will scale accordingly.

Some apps deliberately disable this scaling - which is extremely user hostile, since older users or users with visual impairments have no way of actually reading the text in application.

For comparison let's take a look at [PDF Viewer](https://pdfviewer.io) with standard and increased font sizes:

<img src="/images/blog/2017/accessibility-tools-on-android/text-size.png" alt="Text size comparison" />

### 2. Avoid using only color to separate elements

Color blindness is a very common disability which often causes users to not differentiate between red and green color - two colors commonly used as cues for cofirmation and cancelation. We need to be careful to provide text and/or icon besides the color to make sure people with color blindness will be able to differentiate between the options.

This is easy to test by using [`Simluate Color Space`](https://developer.android.com/studio/debug/dev-options.html#hardware) developer option - choosing `Deuteranomaly`, `Protanomaly` or `Tritanomaly` will simulate different color blindness issues and will help you quickly check your app for issues.

<img src="/images/blog/2017/accessibility-tools-on-android/color.png" alt="Text size comparison" />

<div style="text-align: center;">Color comparison between standard colors and deuteranomaly (type of red-green color blindness).</div>

### 3. Make sure audio notifications are accompanied by real notifications or text

Notifications should always create the system `Notification` or provide textual feedback as well (e.g. snackbar or a toast). Without a visual cue, users who are deaf or hard of hearing (or simply have phone muted) will not be able to notice the change.

### 4. Set content descriptions on UI elements

Text-to-speech tools and Talkback will speak out the content description of the UI element for the user. The descriptions should be short but informative enough for the user to navigate around the app without seeing the screen.

If a view can be interacted with, the content description should be actionable. Talkback will prepend it with the component type and speak the description out loud. For example an `ImageButton` with a magnifying glass icon would have content description `Search` making Talkback speak `Button Search` when focused.  This makes sure users know that the view can be interacted with and what kind of interaction is expected. For icons and other picture elements just the action name is usually enough - e.g. "Like". Keep descriptions short since listening to long ones can be tedious, especially if there's a lot of components on screen.

`EditText` views are a bit of a special case - in those you should provide `android:hint` instead of `android:contentDescription` to describe what's expected of the user.

The content description can be set in XML via `android:contentDescription` attribute or in code with `setContentDescription()` method. Remember to update it as the view contents updates - e.g. for a notification bell icon you should go from "4 new notifications" to "Notifications" as the read count gets cleared.

```xml
<ImageButton
    android:id="@+id/pspdf__forms_navigation_button_previous"
    android:layout_width="48dp"
    android:layout_height="48dp"
    android:padding="6dp"
    android:contentDescription="@string/pspdf__search_btn_previous"
    android:scaleType="fitCenter"
    android:src="@drawable/pspdf__ic_chevron_left"
    android:background="?selectableItemBackgroundBorderless" />
```


If a view doesn't contain anything useful for the user (it's there for cosmetics or spacing) it should have `android:isImportantForAccessibility` property set to `no`. This is an API 16 property, so for older platforms you'll have to set `android:contentDescription` to `@null`.

```xml
<!-- Example consmetical ImageView from PSPDFKit -->
<ImageView
    android:id="@+id/pspdf__thumbnail_grid_item_highlight_bg"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:isImportantForAccessibility="no"
    android:contentDescription="@null"
    android:src="@drawable/pspdf__rounded_rect_translucent"
    android:visibility="gone" />
```

### 5. Group elements so they're part of a single announcement

By default Talkback will announce each `View` separately which isn't the best when the displayed content is complex. Typical example would be a complex table row - instead of forcing user to select each view, the views can be grouped together by setting `android:focusable="true"` on the container and then setting `android:contentDescription` to a sentence explaining the contents of all grouped views.

Example of a group in Google maps:

<img src="/images/blog/2017/accessibility-tools-on-android/grouped.png" alt="Grouped elements in Google maps" width="50%" />

The content description for the containing layout is "Stone Bridge Park, wheelchair accessible, leaves at 18:34" which shortly cummarizes contents of the row and views inside.

### 6. Set proper traversal order

When using your application, Talkback will try to find a good order of traversal for your UI elements. In most cases it works perfectly well, but for complex layouts the default ordering can be strange and unintuitive. To make the app pleasant to use use `android:accessibilityTraversalAfter` XML tags (API 22+ only unfortunately).

<video src="/images/blog/2017/accessibility-tools-on-android/order.mp4" width="50%" style="display: block; margin:1em auto 2em auto !important;" playsinline loop muted  data-controller="video" data-video-autoplay="true"></video>

<div style="text-align: center;">Example of Talkback selection box traversal order.</div>

### 7. Announce UI changes

If there's a UI change (e.g. new notification came, a view content was loaded an updated) call `View#announceForAccessibility()` method with a meaningful description of the event. This will cause Talkback to speak the passed string and notify the user of the UI change.

[==

```kotlin
// Example from PSPDFKit
override fun onPageChanged(pageIndex: Int) {
    ...

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
        views.fragment.view.announceForAccessibility(activity.getString(R.string.pspdf__page_with_number, pageIndex + 1)))
    }
}
```

```java
// Example from PSPDFKit

@Override
public void onPageChanged(@IntRange(from = 0) int pageIndex) {
    ...

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
        views.getFragment().getView().announceForAccessibility(activity.getString(R.string.pspdf__page_with_number, pageIndex + 1));
    }
}
```

==]

## Accessibility in custom views

While all built-in widgets have accessibility properly setup, the platform can't really know what your custom rendered views actually show. This means that making custom views accessible takes a bit more work.

For most custom views the following is enough to make the experience good:

### 1. Handle D-Pad center click events

Android framework will send `KEYCODE_DPAD_CENTER` key events for when user actually properly taps on a view. The custom view should interpret that the same as `KEYCODE_ENTER` and `onClick()`. For most views it makes sense to forward it to `performClick()` call.

### 2. Set proper content description

Content description should contain a meaningful explanation of the views contents - it'll be read out loud and needs to convey everything with text. If your view has text contents, just set that content as content description. If your view is visible only, set the content description to a meaningful explanation of the icon or drawing.

Don't forget to update it as the content updates.

[==

```kotlin
// Example from PSPDFKit thumbnail bar
fun onBindViewHolder(holder: ThumbnailViewHolder, pageIndex: Int) {
    ...

    holder.thumbnail.imageDrawable = placeHolder;
    holder.thumbnail.contentDescription = context.resources.getString(R.string.pspdf__page_with_number, pageIndex + 1)
    holder.renderThumbnail = renderThumbnail(holder.thumbnail, pageIndex, true)
}
```

```java
// Example from PSPDFKit thumbnail bar
public void onBindViewHolder(ThumbnailViewHolder holder, int pageIndex) {
    ...

    holder.thumbnail.setImageDrawable(placeHolder);
    holder.thumbnail.setContentDescription(context.getResources().getString(R.string.pspdf__page_with_number, pageIndex + 1));
    holder.renderThumbnail = renderThumbnail(holder.thumbnail, pageIndex, true);
}
```

==]

### 3. Provide virtual view hiearchy for complex views

Simple text description sometimes isn't enough for custom views. If the custom view is very complex (a drawn calendar widget, rendered document or web page) the contents needs to be broken down into smaller pieces that have to be selectable by accessibility tools individually. For documents that would mean being able to select each paragraph or a photo, for calendar widgets each day, etc. In that case the framework will expect you to return an `AccessibilityNodeProvider` from `getAccessibilityNodeProvider()` method. That node provider should then return an `AccessibilityNodeInfo` for each meaningful piece of custom view content.

`AccessibilityNodeInfo` should be retrieved with its static `obtain()` call and then populated with relevant information - most important being `setBoundsInParent()` / `setBoundsInScreen()`, `setText()`, `setContentDescription`. Child nodes for complex hiearchy can be added with `addChild()`.

The documentation on this functionality is rather sparse, Google I/O 2013 talk is a good starting point though.

## Testing your app

There are several ways you can test your app, neatly outlined in [Testing Your App's Accessibility
](https://developer.android.com/training/accessibility/testing.html) developer guide article:

* [Accessibility Scanner](https://play.google.com/store/apps/details?id=com.google.android.apps.accessibility.auditor) will scan your app and show surface-level issues with content descriptions and contrasts.
* [Espresso Accessiblity Checks](https://developer.android.com/training/accessibility/testing.html#automated) will warn you about missed attributes when running tests as well.

## More

There are several more resources to learn about accessibility. Take a look at [Making Apps More Accessible](https://developer.android.com/guide/topics/ui/accessibility/apps.html), [Accessibility Developer Checklist](https://developer.android.com/guide/topics/ui/accessibility/checklist.html) articles on Android Developer pages.

There are also several excellent Google I/O talks on how to improve your apps accessibility:

* [Pragmatic Accessibility: A How-To Guide for Teams (Google I/O '17)](https://www.youtube.com/watch?v=A5XzoDT37iM) for a great explanation on how to approach accessibility as a team. It's web centric, but guidelines on focusing, content description and UX are very relevant to Android as well.
* [What's New in Android Accessibility (Google I/O '17)](https://www.youtube.com/watch?v=h5rRNXzy1xo) for description of all new tools and apis arriving in Android O.
* [Google I/O 2013 - Enabling Blind and Low-Vision Accessibility On Android](https://www.youtube.com/watch?v=ld7kZRpMGb8) for better explanation on how to implement accessibility in custom views.

Making your app accessible will help more people be a part of the modern mobile revolution, improve integration with voice tools like Google Assistant and even help you get featured. It's well worth the investment.
