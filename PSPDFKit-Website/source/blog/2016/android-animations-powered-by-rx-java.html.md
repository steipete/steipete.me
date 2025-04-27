---
title: "Android animations powered by RxJava"
description: The purpose of this post is to show you how to combine RxJava features with animations on Android to create a great user interface without a lot of nested code.
preview_image: /images/blog/2016/android-animations-powered-by-rx-java/ss1.png
section: blog

author: Ivan Skoric
author_url: https://twitter.com/skoric_
date: 2016-10-05 12:00 UTC
tags: Android, Development, RxJava, Kotlin
published: true
---

Animating objects in Android is seemingly easy, especially using [`ViewPropertyAnimator`][1] which provides out-of-the-box solutions and easy-to-construct view property animations. Add [RxJava][2] to the mix and you have a very powerful tool for chaining animations with other animations, random actions, etc.
READMORE

_Note before we start: The purpose of this post is to show you how to combine RxJava features with animations on Android to create a great user interface without a lot of nested code. The basic knowledge of RxJava is necessary for a complete understanding of the process, but even without it you should be able to grasp the power and flexibility of RxJava constructs and understand how they can be used effectively._

Want to see how we use this in our app? Check out [PDF Viewer][11].

## The basics of animating view properties

Throughout the article, we'll be using [`ViewPropertyAnimatorCompat`][3] retrieved by calling [`ViewCompat.animate(targetView)`][4]. This is a class that enables automatic and optimized animation of select properties on View objects. It has a very convenient syntax and provides a great flexibility for view animations.

Let's see how we could animate a simple view by using it. We'll shrink down the button (by scaling it to 0) and then remove it from the parent once the animation is done.

```kotlin
ViewCompat.animate(someButton)
	.scaleX(0f)                         // Scale to 0 horizontally
	.scaleY(0f)                         // Scale to 0 vertically
	.setDuration(300)                   // Duration of the animation in milliseconds.
	.withEndAction { removeView(view) } // Called when the animation ends successfully.
```

That's pretty convenient and simple, but in more complicated scenarios things can get really messy, especially with nesting callbacks in [`withEndAction{}`][5] calls (also, you can use [`setListener()`][6] and provide callbacks for each animation scenario such as starting and canceling the animation).

## Adding RxJava into the mix

With RxJava, we turn this listener nesting into events that we send to observers. So for each view that is animated we can, for example, call `onNext(view)` and let it be handled downstream.

One option is to create simple custom operators that will handle various animations for us. For example, let's create one for translating views by specified amounts of pixels horizontally and vertically.

The next example will rarely be needed in practice, but it will demonstrate the power of RxJava animations. Let's say we want to have two rectangles, as seen in the picture below, with a group of circles inside the left one at the beginning. Once the "Animate" button is pressed, we want these circles to move from the left rectangle into the rectangle on the right. If the button is pressed again, the animation should be reversed. The circles should move sequentially in equal time intervals.

![Screenshot of two rectangles, red circle, and animate button](/images/blog/2016/android-animations-powered-by-rx-java/ss1.png)

Let's create an operator that will receive a view, perform an animation on it, and pass it to the subscriber's `onNext()` method. In this case, the RxJava stream will wait until the animation is done before the view is passed further downstream. You can also
implement the operator so that the view is passed right away with activated animation.

```TranslateViewOperator.kt
import android.support.v4.view.ViewCompat
import android.view.View
import android.view.animation.Interpolator
import rx.Observable
import rx.Subscriber
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicInteger

class TranslateViewOperator(private val translationX: Float,
                            private val translationY: Float,
                            private val duration: Long,
                            private val interpolator: Interpolator) : Observable.Operator<View, View> {

    // Counts the number of animations in progress.
    // Used for properly propagating onComplete() call to the subscriber.
    private val numberOfRunningAnimations = AtomicInteger(0)

    // Indicates whether this operator received the onComplete() call or not.
    private val isOnCompleteCalled = AtomicBoolean(false)

    override fun call(subscriber: Subscriber<in View>) = object : Subscriber<View>() {
        override fun onError(e: Throwable?) {
            // In case of onError(), just pass it down to the subscriber.
            if (!subscriber.isUnsubscribed) {
                subscriber.onError(e)
            }
        }

        override fun onNext(view: View) {
            // Don't start animation if the subscriber has unsubscribed.
            if (subscriber.isUnsubscribed) return

            // Run the animation.
            numberOfRunningAnimations.incrementAndGet()
            ViewCompat.animate(view)
                .translationX(translationX)
                .translationY(translationY)
                .setDuration(duration)
                .setInterpolator(interpolator)
                .withEndAction {
                    numberOfRunningAnimations.decrementAndGet()

                    // Once the animation is done, check if the subscriber is still subscribed
                    // and pass the animated view to onNext().
                    if (!subscriber.isUnsubscribed) {
                        subscriber.onNext(view)

                        // If we received the onComplete() event sometime while the animation was running,
                        // wait until all animations are done and then call onComplete() on the subscriber.
                        if (numberOfRunningAnimations.get() == 0 && isOnCompleteCalled.get()) {
                            subscriber.onCompleted()
                        }
                    }
                }
        }

        override fun onCompleted() {
            isOnCompleteCalled.set(true)

            // Call onComplete() immediately if all animations are finished.
            if (!subscriber.isUnsubscribed && numberOfRunningAnimations.get() == 0) {
                subscriber.onCompleted()
            }
        }
    }
}
```

Now in our [`ViewGroup`][7] that is holding these circles(`CircleView`) and rectangles(`RectangleView`) we can easily create methods for translating views (we're using Kotlin extension methods for simplicity):

```AnimationViewGroup.kt
fun Observable<View>.translateView(translationX: Float,
                                   translationY: Float,
                                   duration: Long,
                                   interpolator: Interpolator): Observable<View> =
            lift<View> (TranslateViewOperator(translationX, translationY, duration, interpolator))
```

We'll keep the circles in a list and the rectangles as separate variables. Keep in mind that this is just for example purposes.

```AnimationViewGroup.kt
fun init() {
    rectangleLeft = RectangleView(context, Color.BLACK)
    rectangleRight = RectangleView(context, Color.BLACK)

    addView(rectangleLeft)
    addView(rectangleRight)

    // Add 10 circles.
    for (i in 0..9) {
        val cv = CircleView(context, Color.RED);
        circleViews.add(cv)
        addView(cv)
    }
}

// onLayout() and other code omitted..
```

Let's create a method that will start the animation. We can get circle views in intervals by zipping the `Observable` emitting them with a timer `Observable`.

```AnimationViewGroup.kt
// Subscription to circle views movement animations.
private var animationSubscription: Subscription? = null

override fun startAnimation() {
    // First, unsubscribe from previous animations.
    animationSubscription?.unsubscribe()

    // Timer observable that will emit every half second.
    val timerObservable = Observable.interval(0, 500, TimeUnit.MILLISECONDS)

    // Observable that will emit circle views from the list.
    val viewsObservable = Observable.from(circleViews)
            // As each circle view is emitted, stop animations on it.
            .doOnNext { v -> ViewCompat.animate(v).cancel() }
            // Just take those circles that are not already in the right rectangle.
            .filter { v -> v.translationX < rectangleRight.left }

    // First, zip the timer and circle views observables, so that we get one circle view every half a second.
    animationSubscription = Observable.zip(viewsObservable, timerObservable) { view, time -> view }
            // As each view comes in, translate it so that it ends up inside the right rectangle.
            .translateView(rectangleRight.left.toFloat(), rectangleRight.top.toFloat(), ANIMATION_DURATION_MS, DecelerateInterpolator())
            .subscribe()
}
```

Now let's equally implement the `reverseAnimation()` method:

```AnimationViewGroup.kt
override fun reverseAnimation() {
    // First, unsubscribe from previous animations.
    animationSubscription?.unsubscribe()

    // Timer observable that will emit every half second.
    val timerObservable = Observable.interval(0, 500, TimeUnit.MILLISECONDS)

    // Observable that will emit circle views from the list but in reverse order,
    // so that the last one that was animated is now a first one to be animated.
    val viewsObservable = Observable.from(circleViews.asReversed())
            // As each circle view is emitted, stop animations on it.
            .doOnNext { v -> ViewCompat.animate(v).cancel() }
            // Just take those circles that are not already in the left rectangle.
            .filter { v -> v.translationX > rectangleLeft.left }

    // First, zip the timer and circle views observables, so that we get one circle view every half a second.
    animationSubscription = Observable.zip(viewsObservable, timerObservable) { view, time -> view }
            // As each view comes in, translate it so that it ends up inside the left rectangle.
            .translateView(rectangleLeft.left.toFloat(), rectangleLeft.top.toFloat(), ANIMATION_DURATION_MS, AccelerateInterpolator())
            .subscribe()
}
```

The outcome is the desired behavior.

![Gif showing animated circles and reversed animation](/images/blog/2016/android-animations-powered-by-rx-java/gif1.gif)

The possible extensions for this are limitless. For example, by removing the timer you can move all of the views basically at the same time. You can also process each of the views down the stream as the animation is done.

Now, this is cool but it was not a trivial thing to implement. Also, creating custom operators is not always a good thing and can lead to frustration and problems such as [improper backpressure handling][8].

In practice, most of the time we need a slightly different way of handling animations. It's usually something like this: do this, then do this, and finally do this.

## Meet `Completable`

[`Completable`][9] was introduced in [RxJava 1.1.1][10]. So what is `Completable`?

From [RxJava wiki][2]:

> We can think of a Completable object as a stripped version of Observable where only the terminal events, onError and onCompleted are ever emitted; they may look like an Observable.empty() typified in a concrete class but unlike empty(), Completable is an active class. Completable mandates side effects when subscribed to and it is its main purpose indeed.

We can use [`Completable`][9] in a way to perform an animation, then once the animation is complete call `onComplete()`. At that point, another animation or some arbitrary action can be performed.

So now instead of operators, we'll be using a stripped version of [`Observable`][16] so that we don't stream views as they're done with animation, but rather just notify the observers that the requested animation is finished.

Let's create another, more practical example. Say that we have a toolbar filled with icons that we want to provide a `setMenuItems()` method to do the following: collapse current items in the toolbar to the far left side; scale them down until they're gone; remove them from the parent view; add new items scaled down to 0 to the parent view; scale them up; and finally, expand them into the toolbar.

We'll use [`FloatingActionButton`][12]s also known as FABs for our toolbar, just to avoid custom view code here. For that purpose, the `com.android.support:design:24.2.1` library is imported.

We'll create [`Completable`][9]s from [`Completable.OnSubscribe`][13] implementations. These implementations are gonna be a bit more custom made for our specific situation. First, let's create one that will receive a list of FABs that either need to be collapsed or expanded, either vertically or horizontally. The assumption is that all of the FABs are of the same size.

```ExpandViewsOnSubscribe.kt
import android.support.design.widget.FloatingActionButton
import android.support.v4.view.ViewCompat
import android.view.animation.Interpolator
import rx.Completable
import rx.CompletableSubscriber
import java.util.concurrent.atomic.AtomicInteger

class ExpandViewsOnSubscribe(private val views: List<FloatingActionButton>,
                             private val animationType: AnimationType,
                             private val duration: Long,
                             private val interpolator: Interpolator,
                             private val paddingPx: Int): Completable.OnSubscribe {

    enum class AnimationType {
        EXPAND_HORIZONTALLY, COLLAPSE_HORIZONTALLY,
        EXPAND_VERTICALLY, COLLAPSE_VERTICALLY
    }

    lateinit private var numberOfAnimationsToRun: AtomicInteger

    override fun call(subscriber: CompletableSubscriber) {
        if (views.isEmpty()) {
            subscriber.onCompleted()
            return
        }

        // We need to run as much as animations as there are views.
        numberOfAnimationsToRun = AtomicInteger(views.size)

        // Assert all FABs are the same size, we could count each item size if we're making
        // an implementation that possibly expects different-sized items.
        val fabWidth = views[0].width
        val fabHeight = views[0].height

        val horizontalExpansion = animationType == AnimationType.EXPAND_HORIZONTALLY
        val verticalExpansion = animationType == AnimationType.EXPAND_VERTICALLY

        // Only if expanding horizontally, we'll move x-translate each of the FABs by index * width.
        val xTranslationFactor = if (horizontalExpansion) fabWidth else 0

        // Only if expanding vertically, we'll move y-translate each of the FABs by index * height.
        val yTranslationFactor = if (verticalExpansion) fabHeight else 0

        // Same with padding.
        val paddingX = if (horizontalExpansion) paddingPx else 0
        val paddingY = if (verticalExpansion) paddingPx else 0

        for (i in views.indices) {
            ViewCompat.animate(views[i])
            .translationX(i * (xTranslationFactor.toFloat() + paddingX))
            .translationY(i * (yTranslationFactor.toFloat() + paddingY))
            .setDuration(duration)
            .setInterpolator(interpolator)
            .withEndAction {
                // Once all animations are done, call onCompleted().
                if (numberOfAnimationsToRun.decrementAndGet() == 0) {
                    subscriber.onCompleted()
                }
            }
        }
    }
}
```

And now we can create methods that will return [`Completable`][9]s from this [`Completable.OnSubscribe`][13] implementation:

```AnimationViewGroup.kt
private val INTERPOLATOR = AccelerateDecelerateInterpolator()
private val DURATION_MS = 300L
private val PADDING_PX = 32

// Holds current menu items.
private var currentItems = mutableListOf<FloatingActionButton>()

fun expandMenuItemsHorizontally(items: MutableList<FloatingActionButton>): Completable =
        Completable.create(ExpandViewsOnSubscribe(items, EXPAND_HORIZONTALLY, 300L, AccelerateDecelerateInterpolator(), 32))

fun collapseMenuItemsHorizontally(items: MutableList<FloatingActionButton>): Completable =
        Completable.create(ExpandViewsOnSubscribe(items, COLLAPSE_HORIZONTALLY, 300L, AccelerateDecelerateInterpolator(), 32))
```

If we add some dummy items to the beginning of the view, we can test what we have so far:

```AnimationViewGroup.kt
override fun startAnimation() {
    expandMenuItemsHorizontally(currentItems).subscribe()
}

override fun reverseAnimation() {
    collapseMenuItemsHorizontally(currentItems).subscribe()
}
```

In this example, we'll add them to the start of the [`ViewGroup`][7] and see how expanding and collapsing work:

![Gif showing the expanding and collapsing of arrow icons](/images/blog/2016/android-animations-powered-by-rx-java/gif2.gif)

## Chaining animations

Using the same pattern, let's implement [`Completable.OnSubscribe`][13] classes that perform scaling and rotation. We'll do it in the same manner as with expand/collapse one, just use different animations. This code is omitted for simplicity.

Finally, these are control methods we've prepared:

```AnimationViewGroup.kt
fun expandMenuItemsHorizontally(items: MutableList<FloatingActionButton>): Completable =
        Completable.create(ExpandViewsOnSubscribe(items, EXPAND_HORIZONTALLY, 300L, AccelerateDecelerateInterpolator(), 32))

fun collapseMenuItemsHorizontally(items: MutableList<FloatingActionButton>): Completable =
        Completable.create(ExpandViewsOnSubscribe(items, COLLAPSE_HORIZONTALLY, 300L, AccelerateDecelerateInterpolator(), 32))

fun rotateMenuItemsBy90(items: MutableList<FloatingActionButton>): Completable =
        Completable.create(RotateViewsOnSubscribe(items, ROTATE_TO_90, 300L, DecelerateInterpolator()))

fun rotateMenuItemsToOriginalPosition(items: MutableList<FloatingActionButton>): Completable =
        Completable.create(RotateViewsOnSubscribe(items, ROTATE_TO_0, 300L, DecelerateInterpolator()))

fun scaleDownMenuItems(items: MutableList<FloatingActionButton>): Completable =
        Completable.create(ScaleViewsOnSubscribe(items, SCALE_DOWN, 400L, DecelerateInterpolator()))

fun scaleUpMenuItems(items: MutableList<FloatingActionButton>): Completable =
        Completable.create(ScaleViewsOnSubscribe(items, SCALE_UP, 400L, DecelerateInterpolator()))

fun removeMenuItems(items: MutableList<FloatingActionButton>): Completable = Completable.fromAction {
    for (item in items) {
        removeView(item)
    }
}

fun addItemsScaledDownAndRotated(items: MutableList<FloatingActionButton>): Completable = Completable.fromAction {
    this.currentItems = items
    for (item in items) {
        item.scaleX = 0f
        item.scaleY = 0f
        item.rotation = 90f
        addView(item)
    }
}
```

And now we can implement a verbose `setMenuItems()` call:

```AnimationViewGroup.kt
fun setMenuItems(newItems: MutableList<FloatingActionButton>) {
    collapseMenuItemsHorizontally(currentItems)
            .andThen(rotateMenuItemsBy90(currentItems))
            .andThen(scaleDownMenuItems(currentItems))
            .andThen(removeMenuItems(currentItems))
            .andThen(addItemsScaledDownAndRotated(newItems))
            .andThen(scaleUpMenuItems(newItems))
            .andThen(rotateMenuItemsToOriginalPosition(newItems))
            .andThen(expandMenuItemsHorizontally(newItems))
            .subscribe()
}
```

This is the outcome when setting new items:

![Gif showing chaining animations](/images/blog/2016/android-animations-powered-by-rx-java/gif3.gif)

## Limitations

Now keep in mind that we can't use [`mergeWith()`][14] here to execute animations together because they're called on the same views. This means that the listeners being set will override each other and thus merge will never complete because it waits for both `Completable`s to finish. If you're calling it on different views then it can be used normally and the created `Completable` will wait for both animations to complete before calling `onComplete()`.

A workaround for this problem is to implement an `OnSubscribe` that would allow us to perform multiple animations on a view for our specific need. For example, `RotateAndScaleViewOnSubscribe` would be implemented following the same pattern we've shown.

## How we use it in the framework

With our new toolbar, introduced in [PSPDFKit 2.6 for Android][15], came the need for chained animations since submenus were added. Here's an example:

![Gif showing how we used chained animations in our toolbar](/images/blog/2016/android-animations-powered-by-rx-java/gif4.gif)

This implementation allowed us to have clean and flexible control logic, the same as we've described in this article:

```kotlin
subMenuToClose.hideMenuItems(true)
    .andThen(closeSubmenu(subMenuToClose))
    .andThen(openSubmenu(subMenuToOpen))
    .andThen(subMenuToOpen.showMenuItems(true))
    .subscribe()
```

Here's how it looks in slow motion:

![Gif showing the chained animation in slow motion](/images/blog/2016/android-animations-powered-by-rx-java/andThen_c.gif)

Since items and submenus are different views, we can make a construct that would hide menu items and close the submenu at the same time:

```kotlin
subMenuToClose.hideMenuItems(true).mergeWith(closeSubmenu(subMenuToClose))
              .andThen(openSubmenu(subMenuToOpen).mergeWith(subMenuToOpen.showMenuItems(true)))
              .subscribe()
```

![Gif showing simultaneous hiding of menu items and closing of the submenu](/images/blog/2016/android-animations-powered-by-rx-java/mix_c.gif)

Or one that would do it all together:

```kotlin
subMenuToClose.hideMenuItems(true)
    .mergeWith(closeSubmenu(subMenuToClose))
    .mergeWith(openSubmenu(subMenuToOpen))
    .mergeWith(subMenuToOpen.showMenuItems(true))
	.subscribe()
```

![Gif showing simultaneous closing of a submenu and opening of a new submenu](/images/blog/2016/android-animations-powered-by-rx-java/mergeWith_c.gif)

## Conclusion

Consider this post a brief discussion on the many possibilities when combining RxJava with animations on Android. What can be done is basically limitless, but demands a bit of creativity sometimes and may cause some headache in the process.

[1]: https://developer.android.com/reference/android/view/ViewPropertyAnimator.html
[2]: https://github.com/ReactiveX/RxJava/wiki
[3]: https://developer.android.com/reference/android/support/v4/view/ViewPropertyAnimatorCompat.html
[4]: https://developer.android.com/reference/android/support/v4/view/ViewCompat.html#animate(android.view.View)
[5]: https://developer.android.com/reference/android/support/v4/view/ViewPropertyAnimatorCompat.html#withEndAction(java.lang.Runnable)
[6]: https://developer.android.com/reference/android/support/v4/view/ViewPropertyAnimatorCompat.html#setListener(android.support.v4.view.ViewPropertyAnimatorListener)
[7]: https://developer.android.com/reference/android/view/ViewGroup.html
[8]: https://github.com/ReactiveX/RxJava/wiki/Backpressure
[9]: http://reactivex.io/RxJava/javadoc/rx/Completable.html
[10]: https://github.com/ReactiveX/RxJava/releases/tag/v1.1.1
[11]: http://pdfviewer.io
[12]: https://developer.android.com/reference/android/support/design/widget/FloatingActionButton.html
[13]: http://reactivex.io/RxJava/javadoc/rx/Completable.OnSubscribe.html
[14]: http://reactivex.io/RxJava/javadoc/rx/Completable.html#mergeWith(rx.Completable)
[15]: https://pspdfkit.com/blog/2016/pspdfkit-android-2-6/
[16]: http://reactivex.io/RxJava/javadoc/rx/Observable.html
