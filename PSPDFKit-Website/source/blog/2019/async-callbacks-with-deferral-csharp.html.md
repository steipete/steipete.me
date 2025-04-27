---
title: "How to Await an Async Event Handler Delegate in UWP"
description: "Asynchronous programming is hard, and the WinRT interface poses further issues. Learn how to implement a deferral to wait on a user action before completing additional work."
preview_image: /images/blog/2019/async-callbacks-with-deferral-csharp/article-header.png
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2019-08-05 7:00 UTC
tags: Windows, Development, UWP
cta: windows
published: true
secret: false
---

It’s often been said that asynchronous programming is like a virus. Once you add those `async` and `await` keywords to your methods, they spread all over any code that touches them, regardless of what you want. But sometimes you really want to make a call asynchronous and `await` it and it’s not entirely obvious how to do this. One such instance in UWP is when you have a callback on a WinRT interface where you can’t use `Task` and `TypedEventHandler` doesn’t work with `await`. This post will explain a simple pattern to allow you to make this work.

## The Basic Problem

Let’s say I have an `EventHandler` like this, where I expect the client code might want to examine the widget’s internal state before it clears:

```csharp
public sealed class Widget
{
    public TypedEventHandler<Widget, object> OnClearingState { get; set; }
    public IAsyncOperation<string> GetWidgetStateAsync() { ... }
}
```

Internally, the widget will invoke any registered delegates before it clears the state:

```csharp
void async InternalStateClearingEventAsync()
{
    OnClearingState?.Invoke(this, null);
    // You cannot `await` a call to `Invoke`, so there is no guarantee client handlers are finished at this point.
    await DoClearStateAsync();
}
```

You might expect to write something like this, but as mentioned in the comments, the state could be cleared already:

```csharp
var myWidget = new Widget();

myWidget.OnClearingState += async (sender, args) =>
{
    // We should log the state of our widget before it shuts down.
    await Logger.LogAsync("Logging state of the widget before it's cleared.");
    // Problem here. Internally, `DoClearState` will probably already have been called.
    await Logger.LogAsync(await sender.GetWidgetStateAsync());
};
```

## Deferral to the Rescue

What we need to do is, after invoking the handler, somehow wait until the invoked code is complete.

Conveniently, we can use the [`Deferral`][deferral] class. This stores a [`DeferralCompletedHandler`][deferralcompletedhandler], and in combination with a [`TaskCompletionSource`][taskcompletionsource], we can await a signal from the client code that it has completed before proceeding.

First, let’s change our handler to take a `Deferral` that we will pass to the client code:

```csharp
public TypedEventHandler<Widget, Deferral> OnClearingState { get; set; }
```

Next we can update our invocation of the handler to create a `TaskCompletionSource` and pass a lambda to the `Deferral` constructor that will be called when the client code calls `Deferral.Complete()`. Note that `Deferral` must be disposed:

```csharp
void async InternalStateClearingEventAsync()
{
    // Create a task completion source that we can await.
    var tcs = new TaskCompletionSource<bool>();
    // Pass a lambda into the `Deferral` constructor that sets a result on the task completion source.
    using (var deferral = new Deferral(() => tcs.SetResult(true)))
    {
        // Pass the `Deferral` to the client code.
        OnClearingState?.Invoke(this, deferral);

        // Wait for the client to signal completion of the `Deferral` by awaiting the task completion source.
        await tcs.Task;

        // The client code has signaled completion so it's safe to clear the state now.
        await DoClearStateAsync();
    }
}
```

Finally, we need to change the client code to signal completion:

```csharp
myWidget.OnClearingState += async (sender, deferral) =>
{
    try
    {
        // We should log the state of our widget before it shuts down.
        await Logger.LogAsync("Logging state of the widget before it's cleared.");
        // We can be sure the internal method is still waiting for the completion signal.
        await Logger.LogAsync(await sender.GetWidgetStateAsync());
    }
    finally
    {
        // Inform the widget it can proceed with clearing the state.
        deferral.Complete();
    }
};
```

For the client code, while we only need to add a single extra call to `Deferral.Complete()`, it is **critical** that we do so or the `await` in `InternalStateClearingEventAsync` will never complete. Using `try` and `finally` like this ensures that completion is signaled if an exception occurs before the call.

## Conclusion

What initially seems like a tricky problem to deal with is handily solved with the simple `Deferral` class, with the only disadvantage being that your code now relies on the callback handler signaling completion in order to continue.

[getting started]: https://pspdfkit.com/pdf-sdk/windows/
[deferral]: https://docs.microsoft.com/en-us/uwp/api/windows.foundation.deferral
[deferralcompletedhandler]: https://docs.microsoft.com/en-us/uwp/api/windows.foundation.deferralcompletedhandler
[taskcompletionsource]: https://docs.microsoft.com/en-us/dotnet/api/system.threading.tasks.taskcompletionsource-1?view=dotnet-uwp-10.0
