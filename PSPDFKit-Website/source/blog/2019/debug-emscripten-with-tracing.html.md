---
title: "Debug Emscripten with the Tracing API"
description: "How to debug memory usage in an Emscripten app."
preview_image: /images/blog/2019/debug-emscripten-with-tracing/article-header.png
section: blog
author:
  - Patrik Weiskircher
author_url:
  - https://twitter.com/pweisk
date: 2019-04-10 8:00 UTC
tags: Web, Development, How-To, Emscripten
published: true
secret: false
---

We at PSPDFKit use Emscripten pretty extensively to compile our Core C++ code into WASM and offer a [fully standalone PDF viewer on the Web][standalone web link]. We recently ran into some high memory usage and were wondering how we could debug this efficiently without resorting to logging and simply hoping for the best. But then we discovered that Emscripten already comes with pretty nice memory debugging support in the form of the [tracing API][]! Follow along to learn how to debug memory usage in an Emscripten app.

READMORE

## Memory Debugging

Memory debugging in a complex application is difficult if you have the proper tools, but it becomes almost impossible if you don’t have any good tools to support you. Many thousands of allocations can happen at any time, and some memory leaks can be difficult to track down. Without any tools, all you can do is try to reason about your code or add a lot of logging to your code in the hopes that you’re lucky enough that you thought of the right area of the code that could be causing problems.

Because our codebase consists of many hundreds of thousands of lines of code, we went looking for a better solution to this, and thankfully, we were successful!

## The Emscripten Trace API

This API adds instrumentation to your code and your libc. What this meant for us is we could hook into calls like `malloc` and `free` to gather information about memory allocations. In addition to low-level methods, the API also provides out-of-the-box support for complete memory profiling.

### Emscripten Trace Collector

The [Emscripten Trace Collector][] is a little Python server you can run that collects information from the tracing in the Emscripten app. I was a little wary of it at first, because the last updates to it were made four years ago, but it works surprisingly well! Simply check the repository out and follow the [README.rst][trace collector readme] to run it.

### Configuring the Emscripten App

Emscripten has [good documentation][emscripten initialization] on how to configure your app for tracing. The most important thing is to configure your app with the address of the trace collector. To do this, simply add the following code at the startup of your app:

```c
#include <emscripten/trace.h>

emscripten_trace_configure("http://127.0.0.1:5000", "MyApplication");
```

[`emscripten_trace_configure`][emscripten trace configure] instructs the tracing API to send all the collected traces to the specified URL. By default, the trace collector listens on port 5000. You can add different application names in case you have multiple apps you want to debug at the same time.

### Compiling Your App

When compiling your app, add `--tracing` to your `emcc` calls. This will include all the necessary changes, and from this point on, your app will include the tracing API. More information can be found on the [Emscripten tracing website][emscripten compiler interaction].

One little hint: If tracing doesn’t seem to work, call `emcc --clear-cache`. The libc also has to be instrumented, but Emscripten caches it and doesn’t invalidate the cache when you switch to `--tracing`.

### Running the App

When all this is done, simply run your Emscripten app like you always do. Then connect with your browser to the tracing URL you configured (in our example, [http://127.0.0.1:5000][]). This will be the interface to seeing what is happening in your app.

You will then be greeted with the first tracing output of your app.

![Initial Session Page](/images/blog/2019/debug-emscripten-with-tracing/sessions.png)

## Annotating Your Code

The first tracing output already gives you a lot of information, such as how much memory is currently allocated, how much memory was allocated at peak, and much more (shown below).

![Overview of default information](/images/blog/2019/debug-emscripten-with-tracing/summary.png)

The tracing API has lots of other neat features, though!

### Annotating Memory

Without some help, the tracing API only knows how much memory was allocated and not which part of your program is using that memory. But by [annotating your pointers][emtrace annotate], you can associate a name to the memory pointers:

```c
MyClass class;
emscripten_trace_annotate_address_type(&class, "MyClass");
```

Now the UI of the trace collector will be able to tell you how many instances of the class `MyClass` are alive, when they were allocated and deallocated, and much more.

![Table with allocations by type](/images/blog/2019/debug-emscripten-with-tracing/by-type.png)

### Contexts

You can specify [contexts][emtrace contexts] in your code. For example, we defined contexts for rendering a page. This shows how much memory was allocated during a context and how much was released:

```c
#include <emscripten/trace.h>

emscripten_trace_enter_context("Render Page");
... render page ...
emscripten_trace_exit_context();
```

![Table showing contexts and the information](/images/blog/2019/debug-emscripten-with-tracing/contexts.png)

There are quite a few more ways to annotate your code, all of which you can read up on. For example, you can [log messages][emtrace logging] or [report errors][emtrace errors].

## Conclusion

Having the proper tools to debug your code is always very important. Without these, it would have been far more difficult for us to optimize our memory, like we did in one of our [past releases][2019.1.1].

[standalone web link]: https://web-examples.pspdfkit.com/hello
[tracing api]: https://emscripten.org/docs/api_reference/trace.h.html
[emscripten trace collector]: https://github.com/waywardmonkeys/emscripten-trace-collector
[emscripten initialization]: https://emscripten.org/docs/api_reference/trace.h.html#initialization-and-teardown
[emscripten trace configure]: https://emscripten.org/docs/api_reference/trace.h.html#c.emscripten_trace_configure
[trace collector readme]: https://github.com/waywardmonkeys/emscripten-trace-collector/blob/master/README.rst
[emscripten compiler interaction]: https://emscripten.org/docs/api_reference/trace.h.html#compiler-interaction
[http://127.0.0.1:5000]: http://127.0.0.1:5000
[emtrace annotate]: https://emscripten.org/docs/api_reference/trace.h.html#annotating-allocations
[emtrace contexts]: https://emscripten.org/docs/api_reference/trace.h.html#contexts
[emtrace logging]: https://emscripten.org/docs/api_reference/trace.h.html#logging-messages
[emtrace errors]: https://emscripten.org/docs/api_reference/trace.h.html#reporting-errors
[2019.1.1]: https://pspdfkit.com/changelog/web/#2019.1.1
