---
title: What Is Ninja Refactoring, and When Should You Consider Doing It?
description: Tips and best practices for code refactoring.
preview_image: /images/blog/2019/ninja-refactoring/article-header.png
section: blog
author:
  - Anastasiia Zhuravleva
date: 2019-02-12 8:00 UTC
tags: Development
published: true
secret: false
---

“Leave your code better than you found it.” This is the infamous [Boy Scout Rule][] of code, which states that you should strive to maintain your code step by step, making small improvements each time you find some dirty coding, and not leave it until a grand refactoring opportunity somewhere in a distant future. Keep in mind that it doesn’t mean cleaning the entire codebase, nor does it mean trashing the place more just because it wasn’t clean to start with.

But back to these small improvements, which is the topic of this blog post. From here on out, let’s refer to the process of making them as ninja refactoring (since it should be fast and efficient, just like ninjas). There’s a lot to say about ninja refactoring, but today we’re going to talk about how to get good at it.

## Small Ninja Refactoring

When you encounter code and it isn’t immediately clear what’s going on, that’s usually a sign of a possible need for a ninja refactoring. Here are a few examples of what can be resolved rather quickly:

- Magical numbers
- Long logical conditions
- Long calculational statements

Imagine you’re going through some codebase and you stumble upon the following:

```
fun prepareTea(numberOfPeople: Int, teapot: Teapot){
  if (!teapot.isInUse && teapot.isClean && teapot.volume >= numberOfPeople * 200) {
    teapot.addTea(teapot.volume / 500 * 7)
    teapot.addWaterUntilFull()
    setTimer(3)
  }
}
```

You can make correct guesses about what is happening here, but some parts are confusing and others convey too many details. For example, what does `7` stand for? Do you really care about each component of this long `if` condition, or will it be better to know what it is about as a whole?

Now let’s ninja refactor this:

```
const val WATER_PER_PERSON_ML = 200
const val WATER_PER_TEA_SPOON_ML = 500
const val TEA_IN_TEA_SPOON_GRAMM = 7
const val TEA_BREWING_TIME_MINUTES = 3

fun prepareTea(numberOfPeople: Int, teapot: Teapot){
  if (canTeapotBeUsed(numberOfPeople, teapot)) {
    teapot.addTea(measureTeaAmount(teapot))
    teapot.addWaterUntilFull()
    setTimer(TEA_BREWING_TIME_MINUTES)
    }
}

fun measureTeaAmount(teapot: Teapot) =
  (teapot.volume / WATER_PER_TEA_SPOON_ML) * TEA_IN_TEA_SPOON_GRAMM

fun canTeapotBeUsed(numberOfPeople: Int, teapot: Teapot) =
  !teapot.isInUse
    && teapot.isClean
    && teapot.volume >= numberOfPeople * WATER_PER_PERSON_ML

```

Here’s what ninja refactoring means in the above scenario:

- Naming “magical” numbers to convey meaning.
- Adding measuring units to again convey meaning — for example, that the brewing time is measured in minutes and not hours — and to keep future developers from making trivial mistakes.
- Extracting the check of whether or not the teapot can be used to a named method. This encapsulates the details of checking the teapot, which increases expressiveness and allows independent testing of this logic.
- Bringing another level of abstraction to the tea measuring process by moving all measuring details to a method. Now we know that tea is being measured somehow, but we don’t really care about the details.

After you are finished with this ninja refactoring, you can be sure you are the last person who will try and wrap their head around this mystical number `7` and the purpose of this long `if` statement. Good job you!

## Medium Ninja Refactoring

Here we will talk about huge classes, by which I mean classes that are at least 600 lines and up to a few thousand lines. We have all encountered these at least once, and there are probably a few of these monstrosities sitting somewhere in the project you are working on, with everybody dreaming about the great refactoring day when they will be fixed or gone.

The reason for a bloated class is almost always a broken [single responsibility principle][]. This rule states that a class should do one thing and do it well. So, what can you do to gradually shave the code off these huge classes and make them slightly less scary? Here are a few suggestions:

- Move out nested/inner classes. This is probably the easiest way to keep the outer class from bloating over time. A common Android example is when you have a `RecyclerView`, which requires `RecyclerView.Adapter`. This adapter usually consists of a few hundred lines. By removing it, you improve the separation of concerns by having split the general view/activity logic from the `RecyclerView` items management. And as a result, you can keep the number of lines low in case it starts getting out of order.
- Keep implementations separate from the interface/base class and from each other. This is OK if you keep an interface and two to three of its implementations that were trivial or small in one file/class. But don’t forget to keep a close watch on the number of lines in this file. For example, if you need to add the next implementation, then you should check how big the original file becomes. If it exceeds, let’s say, 600 lines, then consider making it a separate class, and don’t forget to pull the already existing implementations out as well. By doing so, you will prevent the birth of another long-scrolling class, and the developer after you will not be tempted to add additional implementations here as well.
- Extract low-level details to a separate class (back to the single responsibility principle again).

Let’s say you have an activity that looks like this:

```
/**
 * Shows a selection of sweets available for order, accepts the order, and shows the order details and recipe.
 */
class SweetsOrderActivity : Activity {
  ...
  fun requestSweetsFromServer() {
    // Lots of lines of code needed to set up a server connection and perform a request.
  }

  fun processServerSweetsResult() {
    // Lines of code to filter out outdated sweets and special event-only sweets.
  }

  fun showSweetsSelection() {
    // Lots of code to set up view visibilities and text view contents and styles, click listeners, etc.
  }

  fun acceptOrder() {
    // Code to extract information about the order from views and check that the entered data is corrected and then send it to the server.
  }

  fun showOrderConfirmation() {
    // Displays order details, builds a recipe to be displayed as well, and provides the possibility to download the recipe.
  }
  ...
}
```

This activity can easily be thousands of lines in size, so what can we refactor out quickly to make it better? Don’t forget that ninja refactoring assumes you will not spend a lot of time on it (one to two hours at most), so our goal is not to refactor the entire class, but rather to try and pick one aspect to remove from the class. The first aspect that comes to mind is to extract all server-related work into something like `SweetsNetworkApi`, which will take care of the following aspects:

- Setting up a server connection to perform a request
- Sending an order to the server
- Retrieving order results
- Providing a downloadable recipe version

Separating the networking workflow from the `Activity` is clearly a good separation of concerns example and a solid ninja refactoring, and it will significantly shorten `SweetsOrderActivity`. Even though this activity still does a lot, it at least isn’t doing the networking job anymore, and if there is a need to add more networking function, it will be done in our new `SweetsNetworkApi`.

Then, the next time you check `SweetsOrderActivity` for whatever reason, you might give it another shot and ninja refactor another logical piece out (like the filtering of the sweets assortment or proving the correctness of order details) to make it even better. If you and your team keep this up, you will eventually manage to shrink this class down and prevent it from bloating any further.

## Leaving Hooks and Hints

What if you spot a good place for a medium-sized ninja refactoring but aren’t sure if you have enough time to do it? You can still leave hints for yourself and anyone who encounters it in the future. You should write these things down in comments either for the entire class or for a specific code piece. Here is an example of what can be written down:

- Why it should be refactored. Alert the reader that you spotted the bad practice and leave a few hints on what you think is the best way to make it better.
- Why this refactoring is hard. If the code logic is, for example, too tightly coupled or was written in haste and has too many workarounds, you should describe those problems as best as you can. It will at least leave an impression that there were already some refactoring research/attempts, and this information will help future developers in starting where you left off. It can also help them get a grasp on the situation faster, allowing them to find a spot to refactor and not have to waste time checking through the code you’ve already looked at.
- Advice against refactoring. This can be used to alert whoever reads this code that the class is so complicated that it was decided to not attempt and refactor it but rather replace it with something new instead. You should mention already existing replacements and point out where and why this old class is still in use to assist with quicker and easier removal in the future.

## Use Version Control to Keep Track of the Progress

So, you decided to make a ninja refactoring and you have a feeling that it might go a bit further than just a few comments/method extractions, and you aren’t sure how big it is going to be in the end, but you still want to give it a shot? Where do you start?

Use a version control system (probably Git) and commit your not-related-to-refactoring changes. This creates a snapshot point to which you can easily roll back in case you decide to ditch the WIP refactoring or if you find a different route to solving the problem.

## Decision Making and Handling Failed Attempts

Don’t forget that what makes this refactoring a ninja refactoring is the time you spend on it. It shouldn’t take longer than an hour or two, so if you have the feeling that it is taking too long, here are your options:

- Try and get an idea of how much work is left. If you can clearly see the end of the task, go ahead and finish it. Even if it is no longer fast, it will still make the code better.
- If you don’t clearly see the end of the task and the aforementioned time limit has expired, it’s time to analyze the results. Check what you can still keep: comments, variable extractions, magic number naming, etc. All of these small improvements should still be pulled out of an unsuccessful refactoring attempt and contribute to a general codebase health. Don’t forget to write in JavaDocs and comment with what you tried and why it was hard to finish this refactoring in a short amount of time.

## Conclusion

So, here you have it: hints and tips on introducing ninja refactoring to make your code healthier, little by little. Don’t forget that the general rule of thumb on deciding if something needs ninja refactoring or not is that if you spent time on understanding what is going on some code snippet, make sure the person checking on it after you will understand it more quickly than you did.

[boy scout rule]: https://deviq.com/boy-scout-rule/
[single responsibility principle]: https://en.wikipedia.org/wiki/Single_responsibility_principle
