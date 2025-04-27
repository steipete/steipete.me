---
title: "A Real-World WebAssembly Benchmark"
description: "A WebAssembly Benchmark for browser vendors to test a real-world production application."
preview_image: /images/blog/2018/webassembly-benchmark/article-header.png
section: blog
author:
  - Giuseppe Gurgone
  - Philipp Spiess
author_url:
  - https://twitter.com/giuseppegurgone
  - https://twitter.com/PhilippSpiess
date: 2018-07-05 12:00 UTC
tags: Web, Development, WebAssembly, Performance
published: true
---

PSPDFKit’s mission is to provide the best way to view, annotate, and fill out forms in PDF documents on any platform. In late 2016, we released the [first version][] of our Web SDK, which relies on a server component to render documents. Only a [few months later][web 2017.5], we released an updated version of PSPDFKit for Web — one that doesn’t require a server component and instead uses WebAssembly (Wasm, WA) to render documents directly in the browser. This was a big achievement for us as a company, and being able to provide a browser-only solution that doesn’t require any backend infrastructure lowers the barrier to entry for our customers.

Rendering PDF documents is a complex task: The format is 25 years old and has many edge cases. It wouldn’t be feasible for us to rewrite the equivalent of [500,000 lines of C++ code][cross-platform post] to JavaScript, but technologies such as WebAssembly and asm.js allow us to use the same codebase in a browser, delivering a consistent level of high-fidelity rendering and parsing of PDF documents everywhere.

Performance of the WebAssembly code has been a focus for us since day one, and it’s amazing to see the entire industry move toward a shared goal: making WebAssembly fast. This starts with [optimizing WebAssembly startup time][], [compiler improvements][], and continuous browser upgrades.

## A Real-World WebAssembly Benchmark

As part of our goal to make WebAssembly faster, we created a WebAssembly benchmark, which offers browser vendors a real-world, open source benchmark for WebAssembly based on PSPDFKit for Web.

The benchmark is available [on GitHub][github benchmark] and works with both customer and [trial licenses][]. Browser vendors can [reach out to us][] and obtain a more permissive license key so that the benchmark can run on different machines and even on their continuous integration servers.

<div style="text-align: center; margin-bottom: 30px; margin-top: 10px;">
  <div id="bench" style="font-size: 0.8em;">
    <a class="btn btn-md btn-brand" style="white-space: initial; line-height: 1.5;" href="http://iswebassemblyfastyet.com/">⏱ Get Your PSPDFKit WebAssembly Score Now</a>
  </div>
</div>

The benchmark is a simple JavaScript application that runs in the browser. Using the [Web Performance API][], we measure the time of various standard actions on a PDF document. We group individual results into two different buckets: loading time (compilation and instantiation) and run time, because we see compile times as the biggest differentiators when looking at different browsers.

## Considerations

Before we dive right into analyzing our results, we want to share more details about our test setup. One thing we’re trying to accomplish with this benchmark is to have a score we can use to improve the performance of PSPDFKit for Web instead of creating a microbenchmark. As such, the benchmark does not call directly into WebAssembly; rather, it also tests the bridge we use to communicate with it — an important part of PSPDFKit for Web.

Additionally, we had to disable one of the major improvements to [WebAssembly startup time][]: streaming compilation. This makes it harder to compare between the WebAssembly results and our JavaScript-fallback<sup>1</sup> results, as the latter can’t use this optimization. We want a score that can easily be compared across a wide variety of browsers, and to make this possible, we had to remove the network speed noise from the equation.

Our WebAssembly payload is also rather unusual. Much of the size of our WebAssembly artifact is attributed to special cases in the PDF spec that might not be executed for every document. We want our PDF viewer to deliver the best results no matter the device. This is a factor where asm.js excels, as it only needs to compile functions when they are actually run.

## Results

<img src="/images/blog/2018/webassembly-benchmark/results-macOS.png" width="712" alt="PSPDFKit WebAssembly Score on macOS: Chrome 67.0.3396.99 (64-bit): 5408, Chrome 69.0.3481.0 canary (64-bit, new baseline compiler): 4325, Firefox 61.0 (64-bit): 1902, Safari 11.1.1 (13605.2.8): 8382" />

The results were a bit surprising at first. While WebAssembly is making great progress, when we compare WebAssembly with our JavaScript fallback for the same product and tasks, all browsers except Firefox are still slower.

<img src="/images/blog/2018/webassembly-benchmark/results-windows-new.png" width="712" alt="PSPDFKit WebAssembly Score on Windows: Chrome 68.0.3440.106 (64-bit): 6068, Chrome 70.0.3530.0 canary (64-bit, new baseline compiler): 5268, Firefox 61.0.2 (64-bit): 1742, Edge 42.17134.1.0 (Windows 10 Enterprise 1803): 11751, Edge 44.17744.1001.0 (Windows 10 Enterprise 1809 Insider): 5207" />

After collecting the first results from our benchmarks, we reached out to the individual browser vendors to discuss these results and investigate ways to further improve the numbers. At this point, we want to thank Google, Mozilla, Microsoft, and Apple — all browser vendors were exceptionally helpful along the way and provided valuable feedback to help improve our benchmark.

### Chrome

Runtime performance of WebAssembly has always been great when using Google Chrome. We were only a bit disappointed to find out that the v8 team [abandoned][] the plan to implement IndexedDB caching for WebAssembly.

However, after Google invited us to a call and shared some of the company’s upcoming plans, we’re excited about what’s in store. The biggest change in the near future will be the introduction of a [new baseline WebAssembly compiler][]. You can already try this compiler today by running the latest canary build and enabling the [`enable-webassembly-baseline`][] flag. In our internal tests, we’ve noticed significant improvements in the total startup time. We couldn’t be happier to see this compiler being enabled by default, starting with the next canary version (M69).

Additionally, the team gave us a sneak peek at the upcoming alternatives for caching the compiled WebAssembly module so that you don’t have to recompile on every browser refresh.

**Update August 2018:** Google released Liftoff, a new baseline compiler for WebAssembly in V8. The announcement [blog post][liftoff blog post] includes specific benchmarks for PSPDFKit, showing a 56%+ faster initialization time.

### Firefox

Firefox delivered the best results in our benchmark, no doubt due to the release of [tiered compilation][], along with [IndexedDB caching][].

The team was especially helpful in pointing out bottlenecks in our JavaScript implementation, and we’re already incorporating these changes into our next PSPDFKit for Web release.

They also pointed out that after a very fast initial compilation, browsers that use a baseline compiler kick off a slower, more optimizing compilation in the background which continues to execute while we run other benchmarks. For this reason, we now benchmark initialization at the end to reduce the amount of background interference.

**Update October 2018:** Starting with Firefox 63, the team at Mozilla has added several optimizations that [improve the performance of calls between JavaScript and WebAssembly][]. The PSPDFKit score for this version was not updated, as we couldn’t measure noticeable performance differences; we’re simply not calling between JavaScript and WASM often enough.

### Edge

The performance of Edge was underwhelming at first. But with recent optimizations like [inlining for WebAssembly][], Microsoft Edge proves that the company is fully committed to making WebAssembly faster in the future.

Microsoft told us that the company is currently working on making WebAssembly easier to produce, consume, and extend. In the future, Microsoft wants to bring more features — which are currently not possible in asm.js (or JavaScript) — to WebAssembly.

In addition to Edge, we made sure our JavaScript fallback also runs (just like our SDK) on Internet Explorer 11. If you want to try it out, make sure to have a coffee ready, as the performance will be quite a bit slower (in our tests, it was 6.5x slower).

**Update August 2018:** The WebAssembly team at Microsoft worked with us to include optimizations for our WebAssembly benchmark in Edge 44, which is now accessible via the Windows Insider build. This results in both an impressive 2.25x faster benchmark run over the previous version, and a PSPDFKit score that is now on par with Google Chrome’s new baseline compiler. We’ve updated our bar chart to include these numbers.

### Safari

We’ve found that Apple’s Safari’s performance is especially bad on beta versions of macOS, and we worked with Apple’s engineers to track down [a recent regression (Bug 187196)][] where trace points turned out to be the expensive factor. Apple has also been exceptionally awesome in reacting to this bug, and [the fix has already landed in master][].

## Conclusion

With this blog post, we want to say _thank you_ ❤️ to all the browser vendors for their efforts to make WebAssembly fast and successful. We also want to communicate that our door is always open and we are here to collaborate with you to make our product and the web platform better!

If you like this article, be sure to also check out our others: [WebAssembly: A New Hope][] and [Optimizing WebAssembly Startup Time][].

Regardless of whether or not you’re a browser vendor, please try out the [WebAssembly Benchmark][] and feel free to reach out in case you have any feedback. We have an official [Twitter account][], and you can also find us on our personal accounts ([@giuseppegurgone][]/[@PhilippSpiess][]).

<sup>1</sup> JavaScript fallback refers to our asm.js build with [`ALLOW_MEMORY_GROWTH=1`][]. Because of the dynamic nature of PDFs, some of them might need a lot more memory than others. Our internal tests have shown that this option works best in our use case.

[first version]: /blog/2016/pspdfkit-for-web
[web 2017.5]: /blog/2017/pspdfkit-web-2017-5/
[cross-platform post]: /blog/2016/a-pragmatic-approach-to-cross-platform/
[optimizing webassembly startup time]: /blog/2018/optimize-webassembly-startup-performance/
[compiler improvements]: https://kripken.github.io/emscripten-site/docs/compiling/WebAssembly.html
[github benchmark]: https://github.com/PSPDFKit-labs/pspdfkit-webassembly-benchmark
[trial licenses]: /try/
[reach out to us]: /support/request/
[web performance api]: https://www.w3.org/TR/performance-timeline/
[webassembly startup time]: /blog/2018/optimize-webassembly-startup-performance/
[abandoned]: https://bugs.chromium.org/p/chromium/issues/detail?id=719172
[new baseline webassembly compiler]: https://v8project.blogspot.com/2018/08/liftoff.html
[`enable-webassembly-baseline`]: chrome://flags/#enable-webassembly-baseline
[liftoff blog post]: https://v8project.blogspot.com/2018/08/liftoff.html
[tiered compilation]: https://hacks.mozilla.org/2018/01/making-webassembly-even-faster-firefoxs-new-streaming-and-tiering-compiler/
[indexeddb caching]: /blog/2018/optimize-webassembly-startup-performance/
[improve the performance of calls between javascript and webassembly]: https://hacks.mozilla.org/2018/10/calls-between-javascript-and-webassembly-are-finally-fast-%F0%9F%8E%89/
[inlining for webassembly]: https://blogs.windows.com/msedgedev/2018/06/19/improved-javascript-webassembly-performance-edgehtml-17/
[a recent regression (bug 187196)]: https://bugs.webkit.org/show_bug.cgi?id=187196
[the fix has already landed in master]: https://trac.webkit.org/changeset/233378/webkit
[webassembly: a new hope]: https://pspdfkit.com/blog/2017/webassembly-a-new-hope/
[optimizing webassembly startup time]: http://pspdfkit.com/blog/2018/optimize-webassembly-startup-performance/
[webassembly benchmark]: http://iswebassemblyfastyet.com
[twitter account]: https://twitter.com/PSPDFKit
[@giuseppegurgone]: https://twitter.com/giuseppegurgone
[@philippspiess]: https://twitter.com/PhilippSpiess
[`allow_memory_growth=1`]: https://kripken.github.io/emscripten-site/docs/optimizing/Optimizing-Code.html#memory-growth
