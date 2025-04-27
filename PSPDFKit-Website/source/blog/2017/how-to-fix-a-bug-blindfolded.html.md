---
title: "How to Fix a Bug, Blindfolded."
description: This is a story about fixing a bug, even when all the tools go kaput.
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/flashmasterdash
date: 2017-02-16 12:00 UTC
tags: Android, Development
published: true
---

This is a story about a crash, caused by a bug inside the Android hardware accelerated view drawing. And a story about a team of developers fixing the bug under the most unpleasant circumstances.READMORE This story is based on true events that recently happened in the PSPDFKit library. Package names have been changed for confidentiality.

In December 2016, a customer approached us with a crash report. The issue he stated was: when opening PDF documents inside our thumbnail grid – a scrollable list of page thumbnails in the PDF – the app would crash when the device was held in landscape mode. This was the first report of this kind. We also weren't able to reproduce the crash in our test setup, so we asked the customer for additional information, specifically for the crash details (i.e. stack traces of exceptions, Logcat samples, etc.).

Unfortunately, and this is where the story gets interesting, the customer was not able to provide us with additional crash information. It wasn't because he was not able to extract such information, but rather because there was no viable information available. No stack traces of unhandled exceptions, no native crash dumps, nothing! Logcat held its silence. A total mystery. Yet, our customer sent us a Logcat sample and directed our focus to a single line which was written right before the process was killed.

> 01-20 15:48:52.182 com.example.app E/OpenGLRenderer: resultIndex is -1, the polygon must be invalid!

What exactly is that supposed to mean? Even an internet search did not help us any further.

## A Rocky Road

The first step in trying to find out whether an issue is specific to a certain PDF document, or a general issue, is to ask the customer if the problem is reproducible with different documents. It turned out that the issue was specific to a certain set of documents. We asked the customer to send us several of his documents so we could proceed with our own investigations.

The PDF documents we received did not have any striking properties. They were pretty ordinary PDFs with texts and images. Apps running PSPDFKit process thousands of such documents every day. We performed extensive tests with _a lot_ of different Android devices from many different manufacturers (LG, Huawei, Amazon, Xiaomi, Medion, Samsung, you name it!) in the hope to reproduce the issue.

After a long and dragging investigation, finally, in between the XXX devices of our testing lab, we found a device capable of reproducing the issue. That's it! Mystery solved! Every developer knows, once a bug is reproducible, it is as good as solved. Sure, tell that to the bug we encountered...

## How to Debug a Crash on Android

PSPDFKit is a large system, containing a gazillion lines of code (Note: exaggeration makes this story about debugging code even more interesting) spanning Java as well as C++. Yet, no matter the size of the system, the procedure to debug a crash is usually the same:

* Try to locate the issue's cause by making assumptions about its location. Since the crash happened only in our thumbnail grid, we limited our search to the `PSPDFThumbnailGrid` class and its collaborators.
* Look out for any code anomalies, that is, code parts that seem flawed or erroneous.
* Verify your assumptions about the issue by using the given tools. There is a step debugger on Android, which helps a lot to find a crash interactively, and also validate runtime parameters.
* Confirm your assumption and find a proper fix for the issue, or debunk them and move on to another assumption.

We attached our debugger and added a breakpoint at a location where we were confident that was before the crashing code, and carefully stepped into the code. Soon it turned out that the crash, which was reproducible in 100% of the cases, was gone as soon as we were tracking it using a step debugger. Sadly, we can't tell our customers to simply run the app with a step debugger, since this is not a solution. And if it was, this would be an easy job.

Nevertheless, we are old school. We don't need a step debugger. We can find bugs with a pen and a paper, and some dark, hot coffee!

Following the analysis approach, we created a lot of hypotheses on where the issue sits. We enriched our code base with additional logger statements and selectively deactivated parts of the code to further limit down sources of the error: Inside the grid's recycler view, the adapter, view holder creation, binding, measuring, laying out, PDF page rendering, ... After making a dozens of assumptions, all were disproved by successfully executing suspected code parts. We had no option but to trace our steps back.

## It Was Not That Hard

Here's what we knew so far:

* The crash would only happen on specific devices. (We had one of those.)
* It was only happening in landscape orientation.
* It was not happening when attached to a debugger. (What a Heisenbug!)
* It was not sitting inside our own code, which was executed properly on all branches.

After taking a power nap, which, by the way, every good developer should do occasionally, we found the culprit inside the animation code of our thumbnail grid recycler. The crash was gone once deactivating the "reveal animation" of pages in our recycler. (This code is inside the `RecyclerView`'s constructor. It does not crash directly, as it merely prepares the animation, which is executed upon making the views visible.)

```java
// Views in this recycler are initially revealed using diagonally delayed scale animation.
final ScaleAnimation animation = new ScaleAnimation(
    0.0f, 1.0f, // scale X
    0.0f, 1.0f, // scale Y
    ScaleAnimation.RELATIVE_TO_SELF, 0.5f,
    ScaleAnimation.RELATIVE_TO_SELF, 0.5f
);
animation.setInterpolator(new LinearOutSlowInInterpolator());
animation.setDuration(225);

setLayoutAnimation(new GridLayoutAnimationController(animation, 0.3f, 0.3f));
```

After commenting out these lines, there wasn't a crash anymore, but there was also no animation. Go ahead and make your guesses about what was causing the issue.

## Small Changes Make the World Go Round

Our focus was immediately drawn to the initial scale value of the animation, which was `0.0f`. Our assumption was:

* A scale of zero definitely represents an edge case, as this is not a proper fraction.
* Inside the render code, a view with scale equals zero must be explicitly handled.
* If there was a bug (maybe some race condition, or some edge-edge-case) inside the render code, our initial scale value could be the trigger.

On the other hand, animating a view from scale `0.0f` to `1.0f` is also a common practice (you can find gazillions of examples on Stack Overflow). Anyhow, we changed the initial value from `0.0f` to `0.01f` – and the crash was gone. This was by no means a fix for the crash, but definitely a proper triage.

## TIL

* Next time, we have to take our power-naps way earlier.
* From this point, we'll move on with increased alertness: Animated view scales with an initial value of `0.0f` might cause issues in specific situations.
* It's possible that you can find and fix a bug without any information or proper tools.

Keep coding!

By the way, if you are interested in the scale animations that caused the crash, head over to the Play Store and check out our [PDF Viewer for Android](https://play.google.com/store/apps/details?id=com.pspdfkit.viewer)!
