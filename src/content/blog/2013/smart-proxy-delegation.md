---
title: "Smart Proxy Delegation"
pubDatetime: 2013-07-30T18:28:00.000Z
description: "Eliminate delegate boilerplate code in Objective-C using NSProxy to automatically handle respondsToSelector checks and method forwarding."
tags:
  - iOS-Development
  - Objective-C
  - Design-Patterns
  - Delegates
  - NSProxy
  - Message-Forwarding
  - PSPDFKit
source: petersteinberger.com
AIDescription: true
---

When calling optional delegates, the regular pattern is to check using respondsToSelector:, then actually call the method. This is straightforward and easy to understand:

```objective-c
    id<PSPDFResizableViewDelegate> delegate = self.delegate;
    if ([delegate respondsToSelector:@selector(resizableViewDidBeginEditing:)]) {
        [delegate resizableViewDidBeginEditing:self];
    }
```

Now, this used to be three lines and now it's four lines, because `delegate` is usually weak, and once you enable the relatively new Clang warning, `-Warc-repeated-use-of-weak`, you will get a warning when accessing self.delegate more than once. All in all, that's a lot of boilerplate for a simple selector call.

In the past, [I've used an approach similar to what Apple does](https://gist.github.com/steipete/2871154) with parsing the delegate when it's being set and caching the `respondsToSelector:` calls. But that's even more boilerplate, cumbersome to update once you change a delegate, and really not worth it unless you call your delegates 100x per second.

What we really want is something like this:

```objective-c
    [self.delegateProxy resizableViewDidBeginEditing:self];
```

We can use NSProxy to simply forward the method if it's implemented. This used to be expensive, but with Leopard Apple came [Fast Message Forwarding](http://www.mikeash.com/pyblog/friday-qa-2009-03-27-objective-c-message-forwarding.html). This "can be an order of magnitude faster than regular forwarding" and doesn't require building an NSInvocation-object.

Our custom NSProxy is really quite simple and just a few lines of code. The important part is here:

```objective-c
- (BOOL)respondsToSelector:(SEL)selector {
    return [self.delegate respondsToSelector:selector];
}
- (id)forwardingTargetForSelector:(SEL)selector {
    id delegate = self.delegate;
    return [delegate respondsToSelector:selector] ? delegate : self;
}
- (NSMethodSignature *)methodSignatureForSelector:(SEL)sel {
    return [self.delegate methodSignatureForSelector:sel];
}
- (void)forwardInvocation:(NSInvocation *)invocation {
    // ignore
}
```

One sad detail is that if the method is not implemented in the delegate, message forwarding will use the slow path with `methodSignatureForSelector:` and `forwardInvocation:`, because `forwardingTargetForSelector:` interprets both 'nil' and 'self' as 'continue with message forwarding.'

## Implementing The Delegate Proxy

We want to make sure that implementing this in our classes is simple. Here's the pattern I use in [PSPDFKit](http://pspdfkit.com):

```objective-c
@interface PSPDFResizableView ()
@property (nonatomic, strong) id <PSPDFResizableViewDelegate> delegateProxy;
@end

PSPDF_DELEGATE_PROXY(id <PSPDFResizableViewDelegate>)

- (void)handleRecognizerStateBegan:(UIGestureRecognizer *)recognizer {
    [self.delegateProxy resizableViewDidBeginEditing:self];
}
```

You'll notice a few things. First, we _lie_ about the actual type of `delegateProxy`. It's a class of type `PSTDelegateProxy`, but we declare it as the delegate type so that we don't have to cast it every time we use it, and so that we also get compiler-checked warnings when there are typos in the selector. Notice that the proxy needs to be strongly retained.

Second, we're using a macro to simplify things. This macro expands into following:

```objective-c
- (void)setDelegate:(id <PSTDelegate>)delegate {
	self.delegateProxy = delegate ? (id <PSTDelegate>)[[PSPDFDelegateProxy alloc] initWithDelegate:delegate] : nil;
}
- (id <PSTDelegate>)delegate {
	return ((PSPDFDelegateProxy *)self.delegateProxy).delegate;
}
```

We keep the weak reference of the delegate directly in the PSPDFDelegateProxy; no need to save it twice. This macro only works if you name your delegate `delegate`, but that should be the common case, and you could expand the macro to cover different cases. We do keep a strong reference of our proxy-object around, but this won't hurt. Other solutions work with weak-saving NSProxy, but that's not needed and also [buggy on iOS 5](http://stackoverflow.com/questions/13800136/nsproxy-weak-reference-bug-under-arc-on-ios-5).

## Handling Defaults

Now we've already covered most of the cases. But there's one pattern that we still need to take care of, which is optional methods that change a default return value if implemented:

```objective-c
_acceptedStartPoint = YES;
id<PSPDFSelectionViewDelegate> delegate = self.delegate;
if ([delegate respondsToSelector:@selector(selectionView:shouldStartSelectionAtPoint:)]) {
    _acceptedStartPoint = [delegate selectionView:self shouldStartSelectionAtPoint:location];
}
```

If the proxy can't find a delegate, it will return `nil (id), NO (BOOL), 0 (int), or 0.f (float)`. Sometimes we want a different default. But again, we can perfectly solve this with some more NSProxy trickery:

```objective-c
    _acceptedStartPoint = [[(id)self.delegateProxy YESDefault] selectionView:self shouldStartSelectionAtPoint:location];
```

And here's the relevant code for the subclass that is being returned after calling `YESDefault`:

```objective-c

- (void)forwardInvocation:(NSInvocation *)invocation {
    // If method is a BOOL, return YES.
    if (strncmp(invocation.methodSignature.methodReturnType, @encode(BOOL), 1) == 0) {
        BOOL retValue = YES;
        [invocation setReturnValue:&retValue];
    }
}
```

We have to to go down to NSInvocation, which is a bit slower, but again, you won't notice, except your delegate is called many times per second, which is quite unusual.

[All code (including test cases) is on GitHub.](https://github.com/steipete/PSTDelegateProxy)

I've already implemented this almost everywhere in my [iOS PDF Framework](http://pspdfkit.com) and was able to delete _a lot_ of boilerplate code. I'm [@steipete](http://twitter.com/steipete) on Twitter. Looking forward to your feedback.
