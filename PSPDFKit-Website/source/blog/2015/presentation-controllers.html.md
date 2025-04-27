---
title: "Presentation Controllers and Adaptive Presentations"
section: blog

author: Douglas Hill
author_url: https://twitter.com/qdoug
date: 2015-11-25 18:00 UTC
tags: iOS, Development
published: true
---

iOS 8 introduced the [`UIPresentationController`][PC] class to manage and customize view controller presentations in a reusable manner. This came with adaptive presentations: adjusting the way a view controller is presented when its containing environment changes, such as on device rotation or when entering and leaving multitasking on iPad.
READMORE

In PSPDFKit 5 for iOS we stopped supporting iOS 7, so were able to make use of these features. However we found a few limitations in the current API. **Update:** We’re pleased to see many of the bugs mentioned here have been fixed in iOS 10. The larger conceptual problems remain.

PSPDFKit is written in Objective-C so all the code samples in this article are too, although our problems are with UIKit and are equally applicable when using Swift. You can read more about the problems discussed here and find sample projects by following the Radar links.

## Presentation controllers

An instance of [`UIPresentationController`][PC] is responsible for positioning a presented view controller’s view and displaying any chrome associated with the presentation, such as shadows and dimming views. Popovers, alerts, action sheets and search make use of presentation controllers. For an introduction see [WWDC 2014 Session 214: View Controller Advancements in iOS 8][WWDC 1] and [WWDC 2014 Session 228: A Look Inside Presentation Controllers][WWDC 2].

The biggest win for us was having popovers as view controller presentations, which are easier to manage and more customizable than `UIPopoverController`. We were able to delete a lot of popover management code that is now shared for all view controller presentations.

A view controller’s `modalPresentationStyle` roughly maps to the type of presentation controller subclass that will manage its presentation; for most styles this is a private UIKit class.

Something to be aware of is that a view controller’s `presentationController` (or `popoverPresentationController`) is lazily loaded when reading this property or presenting the view controller. [The documentation](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIViewController_Class/index.html#//apple_ref/occ/instp/UIViewController/presentationController) states:

> If you have not yet presented the current view controller, accessing this property creates a presentation controller based on the current value in the `modalPresentationStyle` property. Always set the value of that property before accessing any presentation controllers.

When using `UIModalPresentationCustom`, also make sure the `transitioningDelegate` is set before reading the presentation controller. Reading `presentationController` only immediately before presenting seems to work best, otherwise there can be unexpected side effects. [rdar://19096083](http://openradar.appspot.com/19096083)

## Creating custom presentation controllers

The most exciting part of presentation controllers is creating your own, and it’s easy.

1. Create a subclass of [`UIPresentationController`][PC].
1. Override `frameOfPresentedViewInContainerView` and update the frame when the container size changes.
1. Set the `modalPresentationStyle` of the view controller to `UIModalPresentationCustom`.
1. Set the `transitioningDelegate` of the view controller to be presented to something, and make that object implement `presentationControllerForPresentedViewController:presentingViewController:sourceViewController:`, returning an instance of your presentation controller subclass.

The presenting view controller may look something like this, although we actually use a separate presentation manager as the `transitioningDelegate`.

```objc
- (void)showDetail {
    UIViewController *detail = [[DetailViewController alloc] init];
    detail.modalPresentationStyle = UIModalPresentationCustom;
    detail.transitioningDelegate = self;

    [self presentViewController:detail animated:YES completion:nil];
}

#pragma mark - UIViewControllerTransitioningDelegate

- (UIPresentationController *)presentationControllerForPresentedViewController:(UIViewController *)presented presentingViewController:(UIViewController *)presenting sourceViewController:(UIViewController *)source {
    return [[CustomPresentationController alloc] initWithPresentedViewController:presented presentingViewController:presenting];
}
```

There are a couple of things to watch out for here.

You must initialize the presentation controller with  `initWithPresentedViewController:presentingViewController:`. The class reference mentions that this is the designated initializer although it isn’t marked with `NS_DESIGNATED_INITIALIZER`. [rdar://22269465](http://openradar.appspot.com/22269465) **Update:** This is fixed in iOS 10.

Since the presentation controller can be loaded before the presentation begins, the source and presenting view controllers might not be known when the delegate method is called. In this case, we found `source` is the same as the presented view controller.

We also found `presenting` is always `nil`. The documentation states it can be `nil`, but it isn’t marked as nullable in either the delegate method or the initializer so be careful, especially if using Swift. [rdar://22394059](http://openradar.appspot.com/22394059) **Update:** This is fixed in iOS 10.

## PSPDFKit’s annotation inspector

PSPDFKit provides a PDF annotation inspector, similar to the inspector in Pages, Numbers and Keynote. It slides up from the bottom of the screen in compact widths, and appears as a popover in regular widths.

![screen shots of annotation inspector in regular and compact widths](/images/blog/2015/presentation-controllers/inspector.jpg)

We call the slide up style a *half modal* presentation: it isn’t fully modal as tapping some things in the presenting view is possible. This used to be implemented using view controller containment, which was quite complex to manage. We migrated it to using a custom presentation controller, and similar to popovers found we had more control with less code.

## Presentation controllers are forced to change the status bar view controller

When a view controller is presented, it may or may not become the view controller that specifies the status bar visibility and style. For example, when a view controller is presented full screen it should take control of the status bar, but when a popover appears the status bar should not change. This seems to be determined from the return value of the private method `_shouldChangeStatusBarViewController`. [`UIPresentationController`][PC]’s implementation of this just returns `YES`. Therefore presentation controller subclasses are forced to change the status bar view controller, which is not appropriate for our half modal style as the presented view only occupies the lower portion of the screen. The result happens to looks fine if both the presenting and presented view controllers specify the same status bar appearance, but this isn’t acceptable to us because we don’t know what view controllers our customers will want to present using the half modal style. [rdar://22565293](http://openradar.appspot.com/22565293)

PSPDFKit works around this problem, but we could not find an elegant solution.

**Update:** This changed in iOS 10, so view controllers presented with custom presentation controllers don’t change the status bar unless the view controller’s `modalPresentationCapturesStatusBarAppearance` property is set to `YES`. This is an improvement although this seems more the presentation controller’s responsibility than the view controller’s.

## Presentations are modal

View controller presentations are *modal*: a view does not receive touch events while it is presenting. [`UIPopoverPresentationController`][PPC] can be made non-modal by specifying [`passthroughViews`][passthrough]. We found UIKit implements this by adding a `UITransitionView` that covers the presenting view. We wanted passthrough views for our half modal presentation, and we did this using a simple view subclass that forwards touch events.

```objc
@implementation PSPDFTouchForwardingView

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event {
    UIView *hitView = [super hitTest:point withEvent:event];

    if (hitView != self) return hitView;

    for (UIView *passthroughView in self.passthroughViews) {
        UIView *passthroughHitView = [passthroughView hitTest:[self convertPoint:point toView:passthroughView] withEvent:event];
            if (passthroughHitView) return passthroughHitView;
    }

    return self;
}

@end
```

A touch forwarding view is added behind all other presented views:

```objc
- (void)presentationTransitionWillBegin {
    [super presentationTransitionWillBegin];

    self.touchForwardingView.passthroughViews = @[self.presentingViewController.view];
    [self.containerView insertSubview:self.touchForwardingView atIndex:0];
}
```

## Transitions can’t run simultaneously

One consequence of being non-modal is that it is possible to tap the navigation back button while the inspector is presented, and after doing this the inspector remains visible. This makes sense because it was presented on the navigation controller, but isn’t the effect we want. We tried dismissing the inspector when a navigation back action occurs, but found the dismissal transition is delayed: the source view slides to the right, then after that finishes the half modal slides down. It turns out UIKit doesn’t support doing two view controller transitions at the same time: they are queued up and run sequentially. [rdar://22565398](http://openradar.appspot.com/22565398)

Our workaround is to make our view controller grab the half modal presentation controller’s `presentedView` and move it offscreen with a standard `UIView` animation (synchronized with the back transition’s transition coordinator), then dismiss the view controller without animation when the back transition completes.

```objc
- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];

    if (self.isMovingFromParentViewController && self.transitionCoordinator && [self.presentedViewController.presentationController isKindOfClass:PSPDFHalfModalPresentationController.class]) {
        PSPDFHalfModalPresentationController *halfModalPresentationController = (PSPDFHalfModalPresentationController *)self.presentedViewController.presentationController;
        [self.transitionCoordinator animateAlongsideTransitionInView:halfModalPresentationController.containerView animation:^(id<UIViewControllerTransitionCoordinatorContext> context) {
            [halfModalPresentationController moveOffscreen];
        } completion:^(id<UIViewControllerTransitionCoordinatorContext> context) {
            if ([context isCancelled] == NO) {
                [self dismissViewControllerAnimated:NO completion:NULL];
            }
        }];
    }
}
```

Making this the view controller’s responsibility is inelegant, but it works really well.

![video of half modal dismissal coordinated with navigation controller back transition](/images/blog/2015/presentation-controllers/coordinated-dismissal.gif)

## Adaptive presentations are limited

UIKit allows the style of a presented view controller to change when the traits of the presenting environment change. A presentation controller does this by overriding [`adaptivePresentationStyleForTraitCollection:`][PC APS], or its `delegate`  can implement [`adaptivePresentationStyleForPresentationController:traitCollection:`][delegate APS].

[As documented][delegate APS], the value retuned from these methods must be `UIModalPresentationFullScreen`, `UIModalPresentationOverFullScreen`, `UIModalPresentationFormSheet`, or `UIModalPresentationNone`.

And that’s it. Adapting to other presentation styles is not possible. Adapting in response to size (rather than size class) changes is not possible. Changing the presentation style at arbitrary, application-defined times is not possible. [rdar://22394182](http://openradar.appspot.com/22394182)

Adaptive presentations are especially limited on iOS versions prior to 8.3 where alternative methods omitting the trait collection are used; it was assumed that adaptivity would only be used in compact widths. We had a lot of trouble making adaptive presentations work on these versions, and we look forward to the day when we can drop support for these versions and remove our horrible hacks. Note that on iOS 8.3 and later [`UIPresentationController`][PC]’s `adaptivePresentationStyle` is never called. [rdar://22394107](http://openradar.appspot.com/22394107)

For adaptivity and in general, it is sometimes desirable to react to some combination of trait and size changes. However, this is difficult because [`viewWillTransitionToSize:withTransitionCoordinator:`][size transition] and [`willTransitionToTraitCollection:withTransitionCoordinator:`][trait transition] are separate methods. [rdar://23263181](http://openradar.appspot.com/23263181)

As a framework, PSPDFKit must be very flexible, and one specific problem we had was that when a presentation controller’s delegate implements [`adaptivePresentationStyleForPresentationController:traitCollection:`][delegate APS], there is no simple value that can be returned that results in the presentation controller acting as if the delegate does not implement this method. Our solution is to override `respondsToSelector:` and hide our implementation when we don’t want to interfere with adaptive presentation. It is lovely that Objective-C lets us do this, but we hope [`UIPresentationController`][PC] never caches the results of that query. [rdar://23260682](http://openradar.appspot.com/23260682)

## Status bar view controller is wrong

We also found the view controller specifying the status bar appearance does not update when a presentation adapts: if a popover or sheet is presented, then adapts to full screen, the status bar keeps using the style of the presenting view controller. View controllers have a private `_presentedStatusBarViewController` property, but this is not updated when a presentation adapts.

![screen shots showing the status bar using the wrong style when adapting a presentation from sheet to full screen on iPhone 6 Plus](/images/blog/2015/presentation-controllers/sheet-to-full-screen.png)

The reverse is also true: if a view controller is presented full screen then adapts to a popover or sheet, the status bar keeps using the style of the presented view controller. [rdar://22564923](http://openradar.appspot.com/22564923) **Update:** This is fixed in iOS 10.

![screen shots showing the status bar using the wrong style when adapting a presentation from full screen to sheet on iPhone 6 Plus](/images/blog/2015/presentation-controllers/full-screen-to-sheet.png)

PSPDFKit works around this problem, but it’s not pretty.

Another status bar problem not specific to adaptivity is that if a popover presents a full screen view controller, the status bar style is still controlled by the view controller that is presenting the popover. This is easy to see in Safari: in private browsing mode, tap the share button and then the edit providers button. [rdar://22575294](http://openradar.appspot.com/22575294) **Update:** This is fixed in iOS 10.

## A new architecture for arbitrary adaptivity

Initially, we thought switching between our half modal presentation style and a popover seemed like the perfect opportunity for an adaptive presentation. However, as discussed above, adapting to `UIModalPresentationPopover` or `UIModalPresentationCustom` is not possible. We also found our presentation controller subclass was accumulating too many responsibilities: it was concerned with how to present its view controller, and also when it should adapt, and what to.

In fact, UIKit object graph looks a bit odd. One presentation controller makes another one. This feels wrong: conceptually there is no ‘true’ presentation style. For example, UIKit says popovers adapt to the full screen style, but can’t we think of the full screen style adapting to a popover? [rdar://22394246](http://openradar.appspot.com/22394246)

The control or creation graph looks a bit like this:

![linear graph going from view controller to transitioning delegate to presentation controller 1 to presentation controller 2](/images/blog/2015/presentation-controllers/existing-graph.png)

`UIModalPresentationStyle` is used to mean two things: a desired style and an actual style that is used. When setting `UIModalPresentationPopover` as a view controller’s `modalPresentationStyle` a more appropriate name would be `UIModalPresentationFullScreenInCompactWidthsAndPopoverInRegularWidths`, and then the actual style used is either `UIModalPresentationFullScreen` or `UIModalPresentationPopover`. This is to say: `UIModalPresentationStyle` is confusing, and we hope as the API evolves it emphasizes presentation controller objects rather than the style enumeration.

We looked for a different approach, and the architecture we settled on separates adaptivity from particular presentations. Adaptivity is handled by the same object that acts as the view controller’s `transitioningDelegate`.

We needed more control over the popover style so created another custom presentation controller: a subclass of [`UIPopoverPresentationController`][PPC].

Our presentation controllers all have an `adaptivePresentationDelegate`, which is the transitioning delegate. They notify this object when their trait collection changes. The transitioning delegate dismisses the view controller when it should change presentation style, then immediately presents it again, deciding which presentation controller to use at the time of the presentation.

![graph going from view controller to transitioning delegate splitting to the two presentation controllers](/images/blog/2015/presentation-controllers/proposed-graph.png)

Our presentation controllers override `willTransitionToTraitCollection:withTransitionCoordinator:` to notify their `adaptivePresentationDelegate` before the transition begins. There was one final hurdle: we noticed this method was sometimes not called, or was called with unexpected size classes. Investigation revealed that the future trait collection passed to this method contains the traits of the presented view controller, not the presenting environment. These may be different due to the presentation controller’s `overrideTraitCollection`. This property is used by `UIPopoverPresentationController` to make the contents of a popover be considered to be in a compact width, even if the presenting environment has a regular width. It turns out that presentation controllers do not know their future presenting traits, although they do know their future container size. Our workaround is to override `overrideTraitCollection` in our [`UIPopoverPresentationController`][PPC] subclass and return `nil`, which has the undesirable effect of stopping the presented view controller from modifying its content for the compact width in the popover. [rdar://23273355](http://openradar.appspot.com/23273355)

With this architecture, we can easily make view controller presentations adapt at any time, between any number of arbitrary presentation controllers.

Comments or suggestions? [Let me know on Twitter](https://twitter.com/qdoug) how you’re handling adaptive presentations.




[PC]: https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIPresentationController_class/index.html

[PC APS]: https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIPresentationController_class/index.html#//apple_ref/occ/instm/UIPresentationController/adaptivePresentationStyleForTraitCollection:

[delegate APS]: https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIAdaptivePresentationControllerDelegate_protocol/index.html#//apple_ref/occ/intfm/UIAdaptivePresentationControllerDelegate/adaptivePresentationStyleForPresentationController:traitCollection:

[size transition]: https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIContentContainer_Ref/index.html#//apple_ref/occ/intfm/UIContentContainer/viewWillTransitionToSize:withTransitionCoordinator:

[trait transition]: https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIContentContainer_Ref/index.html#//apple_ref/occ/intfm/UIContentContainer/willTransitionToTraitCollection:withTransitionCoordinator:

[PPC]: https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIPopoverPresentationController_class/index.html

[passthrough]: https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIPopoverPresentationController_class/index.html#//apple_ref/occ/instp/UIPopoverPresentationController/passthroughViews

[WWDC 1]: https://developer.apple.com/videos/wwdc/2014/?id=214

[WWDC 2]: https://developer.apple.com/videos/wwdc/2014/?id=228
