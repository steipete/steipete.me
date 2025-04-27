---
title: "Debugging Rotation Issues"
section: blog

author: Michael Ochs
author_url: https://twitter.com/_mochs
date: 2016-04-07 11:00 UTC
tags: iOS, Development
published: true
---

Last week as we prepared to ship our new [Document Editor](/blog/2016/the-document-editor/), we discovered a blocker: sometimes the app froze after rotating the device. The user interface stopped responding and rotation was not possible.
READMORE

![How it looked](/images/blog/2016/debugging-rotation-issues.gif)

First I checked in the debugger if we were running in to a deadlock but everything looked good. There were threads doing some calculations on the open document but the main thread was idle. So if the main thread is doing nothing, what could cause this problem? I set a breakpoint on `-[UIApplication sendEvent:]` to check if touch events were being delivered to the application. The breakpoint was hit immediately when I touched the screen.

If the main thread is free of work and the event chain is working properly, what could cause the issue? I started digging into the event handling a bit more and checked `-[UIApplication isIgnoringInteractionEvents]` which returned `YES`.

So we had a perfectly responsive main thread, an app that ignores all events it receives, and rotation was not working. It was starting to be a fun day. At this point, I suspected the event handling and rotation may be two separate problems, although the odds were good that both were a result of the same method as they always surfaced together.

As the event handling issue looked easier to debug I wanted to track down this first. I checked our source code to see where we called `-[UIApplication beginIgnoringInteractionEvents]` because I thought this might be a good starting point. My plan was to look for issues that could cause this and `-[UIApplication endIgnoringInteractionEvents]` to be out of balance. However this investigation came to a rather fast stop as I discovered that we don’t have a single call to `beginIgnoringInteractionEvents` in our whole source code.

However setting a breakpoint on `-[UIApplication beginIgnoringInteractionEvents]` revealed that this was also called during rotation. Therefore I was interested in a hook for the start and the end of the rotation to see if these are both executed correctly. Inside `viewWillTransitionToSize:withTransitionCoordinator:` we have a call to `animateAlongsideTransition:completion:` so I set a breakpoint in the animation block and the completion block. With that I discovered that whenever the rotation broke, the completion block was not executed.

## Digging Deeper

In cases where the rotation works and does not break the app, the completion handler is called from `-[_UIViewControllerTransitionContext completeTransition:]` which is called from `-[_UIWindowRotationAnimationController animateTransition:]_block_invoke_2204` — so let’s see what that does. `-[_UIWindowRotationAnimationController animateTransition:]` is a pretty lengthy method, but the interesting part is this:

```objc
[UIView animateWithDuration:duration delay:delay options:options animations:^{ /* animation /* } completion:^{
    [transitionContext completeTransition:didComplete];
}];
```

So basically it creates a regular `UIView` animation and notifies the transition context on completion. The `completeTransition:` method itself does nothing special besides notifying a couple of objects that the transition completed. Setting a breakpoint on `__58-[_UIWindowRotationAnimationController animateTransition:]_block_invoke_2204` which is the symbol for the block as you can see in the stack trace (yes, you can do that) revealed the real problem: usually this completion block gets called once for every window that is currently on screen. However every time the rotation broke, it was not called for our main window. Therefore the window and the view controllers where not able to do any cleanup, which also was the cause for `-[UIApplication endIgnoringInteractionEvents]` not being called after the rotation finished. I was now certain that the fact that the completion handler was not being called was the main reason for everything to break. Now the search began for what caused this.

## A Good Guess

At this point I could probably have wasted hours and hours more to find what is really going on here. However I noticed that the rotation always broke when we rotated from portrait to landscape. In landscape orientation, the collection view that we are showing has three more visible cells than in portrait orientation. That put me on the path of looking into the cells. I took the brute force approach and put a breakpoint in every single method in the cell subclass to see which methods were called during rotation. I then looked whether any of these methods were doing anything relating to animations. What I found was this:

```objc
- (void)setSelected:(BOOL)selected {
    super.selected = selected;
    // Since we don't have access to the private _setSelected:animated: method, we don't really
    // know if animation was requested during UICollectionView selectItemAtIndexPath:animated:scrollPosition:
    // unless we figure out that we're currently in an animation block. A good heuristic is this:
    BOOL animated = ![[NSNull null] isEqual:[self actionForLayer:self.layer forKey:@"position"]];
    [self.selectionView setSelected:selected animated:animated];
}
```

This does look a bit hacky. We used this approach to figure out if we are in an animation because `UICollectionViewCell` does not have a `setSelected:animated:` like `UITableViewCell`. [rdar://25337955](http://openradar.appspot.com/25337955)

Removing that line immediately fixed the issue. Rotation worked again and the UI was as responsive as ever.

## Reproducing the Issue

Playing around some more revealed that all it takes is something like this to break an animation’s completion handler:

```objc
[UIView animateWithDuration:1.0 animations:^{
    // animate some stuff
    [self.view actionForLayer:self.view.layer forKey:@"position"];
} completion:^(BOOL finished) {
    // this is never called
}];
```

Even though our approach here was a rare edge case, this is something that can easily hit you when you are dealing with layer animations in your custom view components. Calling a public method on a layer delegate shouldn’t cause problems. [rdar://25337014](http://openradar.appspot.com/25337014)

This debugging session was a good example of how something very small can cause a huge problem in your application and take hours to diagnose.
