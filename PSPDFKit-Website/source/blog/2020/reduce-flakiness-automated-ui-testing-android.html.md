---
title: "How to Reduce Flakiness in Automated UI Testing on Android"
description: "This blog post discusses tips and best practices on how to reduce flakiness in automated UI testing on Android."
preview_image: /images/blog/2020/reduce-flakiness-automated-ui-testing-android/article-header.png
section: blog
author:
  - Reinhard Hafenscher
date: 2020-01-24 8:00 UTC
tags: Development, Android, How-To
published: true
secret: true
---

When building an Android application, it is crucial to have a solid set of tests that ensure everything is working as expected and no regressions are introduced when adding new features. READMORE There are plenty of resources available that explain general testing best practices, but today we want to look at some strategies to reduce flakiness in [Espresso][]-based Android UI tests. Naturally, these points could apply to other test frameworks too.

So, without further ado, let’s get started with our first tip.

## Disable Animations in Tests

As mentioned in the [Espresso guides][], the first thing you should do to reduce the flakiness of Espresso tests is disable animations. The official docs only tell you to manually disable the animations on your development device, but you can actually automate this. The simplest way is to set the [`animationsDisabled`][] property in your `build.gradle`:

```
android {
    ...
    testOptions {
        animationsDisabled = true
    }
```

[According to the docs][]:

> “Disables animations during instrumented tests you run from the cammand \[sic\] line... This property does not affect tests that you run using Android Studio.”

Luckily, the fact that disabling the animations doesn’t work when running tests from Android Studio isn’t an issue, since you can easily disable animations on your device locally — while on CI, you would most likely run the tests from the command line anyway.

With the animations now disabled, we are free to start building our tests, which is where our next tip comes in handy.

## Wait between Actions

Another thing that often causes flakiness is continuing the test execution before the previous action is done. Espresso provides the [idling resources][] API, which is the framework’s preferred way of handling this kind of situation. The problem with idling resources is that the recommended approach to using them is adding code to keep track of them in your production code. This goes against the common testing best practice of not putting testing code inside your application code.

For this reason, we use a simple `waitForCondition` method in our tests. This method just checks a condition in a loop, and if it doesn’t become `true` within a certain amount of time, it throws an exception. If you’re interested in what that looks like, here it is:

```kotlin
/**
 * Waits for the given `condition` to return `true`.
 * If the timeout elapses before the condition returns `true`, this method throws an exception.
 * @param reason    Reason printed when waiting for condition timeouts.
 * @param condition Condition to wait for.
 * @param timeout   Timeout in ms.
 */
fun waitForCondition(reason: String, condition: Callable<Boolean>, @IntRange(from = 0) timeout: Long) {
    val end = System.currentTimeMillis() + timeout

    try {
        while (!condition.call()) {
            if (System.currentTimeMillis() > end) {
                throw AssertionError(reason)
            }

            Thread.sleep(16)
        }
    } catch (e: Exception) {
        throw Exceptions.propagate(e)
    }
}
```

While this approach isn’t recommended by Espresso, it allows you to keep your application code free of any code that only exists to facilitate testing.

In certain cases, it’s also helpful to wait for views to appear, so we developed a custom `waitForView` [`ViewAction`][]. This allows us to use any view matcher provided by Espresso as our wait condition. It’s also attached here in case you’re interested:

```kotlin
fun waitForView(viewMatcher: Matcher<View>, timeout: Long = 10000, waitForDisplayed: Boolean = true): ViewAction {
    return object : ViewAction {
        override fun getConstraints(): Matcher<View> {
            return Matchers.any(View::class.java)
        }

        override fun getDescription(): String {
            val matcherDescription = StringDescription()
            viewMatcher.describeTo(matcherDescription)
            return "wait for a specific view <$matcherDescription> to be ${if (waitForDisplayed) "displayed" else "not displayed during $timeout millis."}"
        }

        override fun perform(uiController: UiController, view: View) {
            uiController.loopMainThreadUntilIdle()
            val startTime = System.currentTimeMillis()
            val endTime = startTime + timeout
            val visibleMatcher = isDisplayed()

            do {
                val viewVisible = TreeIterables.breadthFirstViewTraversal(view)
                    .any { viewMatcher.matches(it) && visibleMatcher.matches(it) }

                if (viewVisible == waitForDisplayed) return
                uiController.loopMainThreadForAtLeast(50)
            } while (System.currentTimeMillis() < endTime)

            // Timeout happens.
            throw PerformException.Builder()
                .withActionDescription(this.description)
                .withViewDescription(HumanReadables.describe(view))
                .withCause(TimeoutException())
                .build()
        }
    }
}
```

Using the above, you can wait for views to appear in your code like this:

```kotlin
onView(isRoot()).perform(waitForView(withText("My awesome view")))
```

This is useful if one of your view actions will trigger a new view to appear and you want to ensure it is displayed as part of your test.

Now that we can write tests that wait for something to happen based on some input, let’s make sure our button presses actually work how they are supposed to.

## Use the Retry Feature of Espresso

One of the biggest shortcomings of Espresso is the way touches are injected. There is a great comment explaining this inside the [`GeneralClickAction`][]:

```
// Native event injection is quite a tricky process. A tap is actually 2
// seperate motion events which need to get injected into the system. Injection
// makes an RPC call from our app under test to the Android system server, the
// system server decides which window layer to deliver the event to, the system
// server makes an RPC to that window layer, that window layer delivers the event
// to the correct UI element, activity, or window object. Now we need to repeat
// that 2x. for a simple down and up. Oh and the down event triggers timers to
// detect whether or not the event is a long vs. short press. The timers are
// removed the moment the up event is received (NOTE: the possibility of eventTime
// being in the future is totally ignored by most motion event processors).
//
// Phew.
//
// The net result of this is sometimes we'll want to do a regular tap, and for
// whatever reason the up event (last half) of the tap is delivered after long
// press timeout (depending on system load) and the long press behaviour is
// displayed (EG: show a context menu). There is no way to avoid or handle this more
// gracefully. Also the longpress behavour is app/widget specific. So if you have
// a seperate long press behaviour from your short press, you can pass in a
// 'RollBack' ViewAction which when executed will undo the effects of long press.
```

The gist of this is that, due to the nature of touch injection, there is always a chance that a touch that was meant to be a simple tap is interpreted as a long press. For this reason, the default `click` action takes a rollback action that will be executed when Espresso detects that a long press was injected accidentally.

```kotlin
onView(withText("My Button")).perform(click(pressBack()))
```

Take this tiny example above. If Espresso detects that a long press was injected, it will hit the back button. This is useful if our sample button were to open a dialog when long pressed but trigger some other action when just tapped. By providing a rollback action, we enable Espresso to handle this failure scenario gracefully and reduce potential causes for flakiness in our tests.

Now that we took care of all these things we should be safe from flakiness, right? Sadly, chances are that your tests are still flaky, albeit much less so, which brings us to our next tip.

## Automatically Retry Flaky Tests

Should all else fail and you still encounter flakiness, a quick and easy fix (though one that is not that clean) is to introduce automatic retries for flaky tests. This involves marking tests you want automatically retried with the [`FlakyTest`][] annotation and updating your test runner to automatically retry those tests.

The idea behind this is that UI tests on Android are inherently flaky. So even if they are programmed perfectly, a certain degree of flakiness will always remain. To prevent this from causing our tests to report failures, we automatically retry tests for a certain amount of time, only marking them as failures if they never pass. An explanation of how to do this would need to be an entirely separate blog post that goes into detail of all the changes required to make it work, so we’ll skip it for now.

So on to the final tip I’ll share today.

## Avoid UI Tests if Possible

Often, having to build UI tests is a sign of less-than-ideal code design. As such, the only way to verify certain behavior is with large UI tests. If you can structure your code in a way that enables you to verify most of your behavior using unit tests, you’ll reduce the amount of UI tests that are required, and in turn reduce the flakiness that comes with them.

There are many ways you can achieve this. As an example, one of them would be to use a common design pattern like MVP. This way, you could test your model and presenter using regular old unit tests, while your view tests would also be simpler since you’d only have to focus on the UI behavior and not on any additional business logic, leading to better tests all around.

## Conclusion

While [Espresso][]-based UI tests always come with some inherent flakiness, by following the tips outlined in this post, they can be reduced quite a bit, leading to a much more stable testing experience.

[espresso]: https://developer.android.com/training/testing/espresso
[espresso guides]: https://developer.android.com/training/testing/espresso/setup#set-up-environment
[according to the docs]: https://google.github.io/android-gradle-dsl/current/com.android.build.gradle.internal.dsl.TestOptions.html#com.android.build.gradle.internal.dsl.TestOptions:animationsDisabled
[idling resources]: https://developer.android.com/training/testing/espresso/idling-resource
[`viewaction`]: https://developer.android.com/reference/androidx/test/espresso/ViewAction
[`flakytest`]: https://developer.android.com/reference/androidx/test/filters/FlakyTest
[`animationsdisabled`]: https://google.github.io/android-gradle-dsl/current/com.android.build.gradle.internal.dsl.TestOptions.html#com.android.build.gradle.internal.dsl.TestOptions:animationsDisabled
[`generalclickaction`]: https://android.googlesource.com/platform/frameworks/testing/+/android-support-test/espresso/core/src/main/java/android/support/test/espresso/action/GeneralClickAction.java#75
