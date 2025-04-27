---
title: "WebAssembly: A New Hope"
description: What is WebAssembly, and what does it mean for the web?
preview_image: /images/blog/2017/webassembly-a-new-hope/blogpost-cover.png
section: blog
author:
  - Philipp Spiess
  - James Swift
author_url:
  - https://twitter.com/PhilippSpiess
  - https://twitter.com/_jamesswift
date: 2017-08-09 12:00 UTC
tags: Web, Development, WebAssembly
published: true
---

In March 2017, the [WebAssembly Community Group reached a consensus on the initial (MVP) binary format, JavaScript API, and reference interpreter](https://lists.w3.org/Archives/Public/public-webassembly/2017Feb/0002.html).READMORE This exciting new technology is already shipping in Chrome and Firefox, and it will be fully supported in macOS High Sierra and iOS 11, with Microsoft Edge support following shortly thereafter. But what is WebAssembly and what does it mean for the web?

**Don’t miss our follow-up post: [Optimizing WebAssembly Startup Time](/blog/2018/optimize-webassembly-startup-performance/)**

READMORE

## The Dream of High-Performance Computing in a Secure Browser
<center>
  <figure>
    <a href="http://llvm.org/devmtg/2013-11/slides/Zakai-Emscripten.pdf">
      <img
        src="/images/blog/2017/webassembly-a-new-hope/everything-everywhere.jpg"
        title="Everything compiles into LLVM bitcode; The web is everywhere, and runs JavaScript; Compiling LLVM bitcode to JavaScript lets us run ~ everything, everywhere"
        width="600" />
    </a>
    <figcaption>A slide from Alon Zakai’s [presentation about Emscripten][] in 2013.</figcaption>
  </figure>
</center>

In 2013, Alon Zakai from Mozilla developed a compiler called [Emscripten](https://spectrum.ieee.org/computing/software/webassembly-will-finally-let-you-run-highperformance-applications-in-your-browser), which he used to compile games written in C and C++ to a subset of JavaScript. This subset, called [asm.js][], was created by [Luke Wagner](https://twitter.com/luke_wagner) and is aimed at bringing extraordinary optimizations to the language.

By making use of the asm pragma (`"use asm";`) and nifty typing hints, asm.js allows JavaScript interpreters that support it to use low-level CPU operations instead of the more expensive JavaScript. This makes it possible to bypass a lot of the difficult-to-optimize routines, like coercion and garbage collection, in situations where we know we don’t need it. And if the interpreter does not offer this support, the code will still execute with identical results, albeit more slowly.

## A Primer to asm.js

asm.js specifies the use of type hints under the hood. For example, `a | 0` is used to hint that `a` is a 32-bit integer or `+a` is a double (64-bit floating point). The former works because the spec defines [bitwise operators](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators) to operate on a sequence of 32 bits. These expressions have no side effects and can thus be inserted wherever it is required to hint the type — either in arguments to a function call, or in the function call’s return value.

In the following example, an asm.js-optimized JavaScript interpreter might only execute a single 32-bit addition when the `add` export is called, whereas an interpreter that doesn’t support asm.js will have to execute many more instructions in order to fully follow the ECMAScript specification, because it has no advance knowledge of the types being passed to the function:

```js
function AsmModule() {
  "use asm";
  return {
    add: function(a, b) {
      a = a | 0;
      b = b | 0;
      return (a + b) | 0;
    },
  }
}
```

To avoid expensive garbage collection routines, memory management is delegated entirely to the application, much like in a typical native application where the code must allocate and deallocate memory directly from the assigned part of RAM. To implement this, a large memory buffer is allocated upfront and then used throughout the asm.js block. The asm.js code creates typed views to access slices of that buffer and use them as memory:

```js
var heap = new ArrayBuffer(0x100000); // 128kb
var pointer = 0x100;
var view = new Int32Array(heap, pointer, 0x100); // 256 bytes at offset 256
view[0] = 327;
view[1] = 1138;
```

In a block marked as `"use asm";`, all advanced JavaScript features can be deactivated until a violation occurs (for example, until a reference to an object is cleared).

Typically, asm.js code is not written by hand, but rather it is the result of compiling code from another language — usually C or C++. To create asm.js-optimized code, [Emscripten][] — an [LLVM][]-to-JavaScript compiler tool — was created. LLVM is a popular tool in many native development toolchains. It defines an intermediate representation (LLVM IR) that sets out a low-level language similar to assembly. In native development steps, this intermediate code can already be heavily optimized and easily translated to the target architecture (i.e. the CPU architecture/instruction set the code should be run on, like x86 or ARM). Emscripten reads this intermediate representation and translates it to asm.js with additional optimization steps in the middle.

<center>
  <figure>
    <img
      src="/images/blog/2017/webassembly-a-new-hope/asmjs-pipeline.png"
      title="asm.js pipeline: C/C++ will be compiled to LLVM IR via a compiler like clang. After that, Emscripten will pick up the intermediate representation and compile it to asm.js."
      width="664" />
    <figcaption>Before asm.js code is generated, LLVM intermediate representation is generated.</figcaption>
  </figure>
</center>

While asm.js makes it possible to improve the execution speed significantly and allows low-level languages with no concept of garbage collection, like C/C++, to compile to the web, it unfortunately comes with a few downsides:

1. Type hints and the JavaScript syntax can result in very large asm.js files.
2. It needs to be parsed like JavaScript, which can be expensive on lower-end devices like mobile phones.
3. Since asm.js needs to be valid JavaScript, adding new features to it is very complex and affects JavaScript as well.
4. Growing the initial heap at runtime is expensive, since `ArrayBuffer`s, which are used to store the heap, are immutable. To solve this, one must create a new, larger `ArrayBuffer` and copy the content from the first buffer into the second one. This operation results in an asm.js violation, which is why [Emscripten warns about disabled optimizations][].

## The New Kid on the Block

To solve all the above issues, the development of WebAssembly, or _wasm_ — [“a new, portable, size- and load-time-efficient format suitable for compilation to the web”][WebAssembly] — started in 2015. The first version currently being deployed to all major browsers (Chrome, Firefox, Safari, and Edge) is a replacement for asm.js and comes with all of the same features. Meanwhile, other more powerful features, such as threads, are planned for future versions. It’s important here to point out that WebAssembly is designed to complement JavaScript, not replace it, and that in a browser context, it can only access the DOM via JavaScript and not directly.

<center>
  <figure>
    <img
      src="/images/blog/2017/webassembly-a-new-hope/wasm-browser-support.png"
      title="Chrome, Firefox, Opera, and Edge* started to support WebAssembly in March 2017, and Safari is following this fall (*Edge support is guarded behind a feature flag)."
      width="621" />
    <figcaption>WebAssembly support is rolling out this year in all major browsers. PSPDFKit for Web also supports older browsers by falling back to asm.js.</figcaption>
  </figure>
</center>

WebAssembly consists of four key concepts:

1. **[`Module`]** — a compiled WebAssembly unit. Similar to an ES2015 module, a WebAssembly module declares imports and exports to the JavaScript language.
2. **[`Memory`]** — a _growable_ `ArrayBuffer`.
3. **[`Table`]** — an array to store function references. This offers another way to access JavaScript functions inside WebAssembly, since these functions cannot be stored directly in the memory and called that way. Instead, a function will be stored in a table and can be called with its index. A table can be mutated by the host environment (JavaScript).
4. **[`Instance`]** — a stateful, initialized module that’s connected to both a memory and a table object.

Additionally, WebAssembly defines a binary representation for the language code that is similar to LLVM IR and needs to be compiled to the host architecture before it can be used. Some implementations, such as Microsoft’s Chakra, use a Just-In-Time (JIT) strategy to compile to the native host architecture, and others, such as Google’s Chrome, compile the entire module upfront. To avoid compilation every time a WebAssembly module is requested, the resulting module can also be persisted on a client using [IndexedDB][]:

```js
var importObject = {
  imports: {
    imported_func: function(arg) {
      console.log(arg);
    }
  }
};

fetch("application.wasm").then(response =>
  response.arrayBuffer()
).then(bytes =>
  WebAssembly.instantiate(bytes, importObject)
).then(result =>
  result.instance.exports.exported_func()
);
```

With this design, WebAssembly solves all the issues we discussed with asm.js above:

1. The file size is a lot smaller because of the binary representation. For our product, the WebAssembly version is about half the size of the asm.js build (about one-third for a gzipped build).
2. WebAssembly improves execution time by making multiple steps in the engine’s pipeline faster. For example, parsing is greatly simplified, and the code is already in an intermediate format and just needs to be validated. [Lin Clark wrote an excellent article](https://hacks.mozilla.org/2017/02/what-makes-webassembly-fast/) about the reasons WebAssembly is fast.
3. WebAssembly can be improved with new features independent of JavaScript. A good example of this is the SIMD (Single Instruction/Multiple Data) extension to JavaScript. This CPU-powered acceleration is a key optimization in modern assembly, but the impact on the JavaScript API is so big that plans to bring it there were abandoned because of its complexity. Instead, this feature will be added to WebAssembly directly with no JavaScript API.
4. WebAssembly’s memory concept is based on the _growable_ [`Memory`] class. This makes it possible to have more dynamic memory allocation.

WebAssembly is becoming the de facto solution for bringing native code to the web. With support from all major browsers and the development of a new [LLVM backend](https://github.com/llvm-mirror/llvm/tree/master/lib/Target/WebAssembly) inside the LLVM `master` branch, we’re looking at a bright future for the web.

## WebAssembly at PSPDFKit

We recently [released PSPDFKit for Web 2017.5][], the first version of our web framework that supports standalone rendering, i.e. on the client without a daemon running on a server. To completely avoid a server component that can read the PDF, we worked hard to compile our 500,000 LOC C++ core to WebAssembly and asm.js. It’s extremely important to us that we can reuse the PDF-rendering code across all our modern platforms, because [PDF rendering is hard to get right][]. Our shared core gives us the same low-level rendering and parsing of PDF documents everywhere and allows us to fully focus on one PDF engine.

The new PSPDFKit for Web now also includes four artifacts that are available next to `pspdfkit.js` and `pspdfkit.css`:

| Filename              | Description                                                                                      |
|-----------------------|--------------------------------------------------------------------------------------------------|
| `pspdfkit.wasm`       | This file contains the WebAssembly binary code.                                                  |
| `pspdfkit.wasm.js`    | A small wrapper around the WebAssembly module to create a unified API that’s shared with asm.js. |
| `pspdfkit.asm.js`     | The asm.js build of our PDF backend.                                                             |
| `pspdfkit.asm.js.mem` | A binary file that contains initial memory values for the asm.js build.                          |

When the PDF viewer is initialized, we feature test the presence of WebAssembly, as well as some additional WebAssembly features, to decide how to initialize the native module.

<script type="text/javascript" src="https://web-preview-server.pspdfkit.com/pspdfkit.js"></script>
<script type="text/javascript" src="/images/blog/2017/webassembly-a-new-hope/custom.js"></script>
<div id="PSPDFKit-example">
  <p>
    Talking about an exciting new technology is one thing — but we want you to experience what WebAssembly made possible at PSPDFKit. The following demo of our PDF framework will use WebAssembly when it’s available and fall back to asm.js otherwise. While you were reading the article, we prepared everything. This is just an example of how easy it is to integrate PSPDFKit.
  </p>
  <center>
    <strong>PSPDFKit for Web Using <span id="PSPDFKit-example-method">asm.js Fallback</span></strong>
  </center>
  <div id="PSPDFKit-container" style="width: 100%; height: 500px; background: #efefef; margin-bottom: 2em"></div>
</div>
<div id="PSPDFKit-example-onerror" style="display: none">
  <p>
    If you’re curious how this works in your browser, check out <a href="https://web-preview.pspdfkit.com/standalone/1">our standalone preview</a>.
  </p>
</div>

To give you a comparison of the rendering performance between native, WebAssembly, and asm.js, we conducted an extensive benchmark across various devices.

<center>
  <figure>
    <img
      src="/images/blog/2017/webassembly-a-new-hope/asmjs-vs-wasm-vs-native.png"
      title="WebAssembly vs. asm.js vs. native on mobile and desktop devices."
      width="727" />
    <figcaption>A comparison of PDF-rendering performance across different devices when using native, wasm, and asm.js.</figcaption>
  </figure>
</center>

While the results are already impressive, we want to point out that WebAssembly is very new and [improving at an insane rate][]. The new LLVM backend is still experimental, and while porting PSPDFKit to WebAssembly, we discovered a lot of edge cases we could only solve with the help of browser vendors. At this point, we want to issue a special thank you to the WebAssembly teams at Mozilla and Google, and especially to Alon Zakai, for being so helpful. With their help, we were able to navigate the edge cases we encountered and build our WebAssembly-based PDF viewer, even improving the Emscripten tool chain a bit along the way.

While we’re very optimistic about the current state of WebAssembly, we know that less capable systems still struggle with expensive rendering operations. For those cases, we recommend you check out [our Server-backed product][], which already enables super-fast PDF rendering, even on lower-end devices. In the [future][], we also want Server-backed installations to make use of WebAssembly and will enable progressive streaming of client-side rendered PDF documents on demand. We believe that a combination of server- and client-side technologies will offer the best experience for displaying PDF documents on the web, and we’re working hard to make this as seamless as possible.

**Don’t miss our follow-up post: [Optimizing WebAssembly Startup Time](/blog/2018/optimize-webassembly-startup-performance/)**

Are you interested in WebAssembly and other web technologies and looking for a place to work that exercises your brain while preserving the work/life balance? [Check out our current job offers][].

[asm.js]: http://asmjs.org/faq.html
[WebAssembly]: http://webassembly.org/
[Emscripten]: https://kripken.github.io/emscripten-site
[LLVM]: https://en.wikipedia.org/wiki/LLVM
[Emscripten warns about disabled optimizations]: https://kripken.github.io/emscripten-site/docs/optimizing/Optimizing-Code.html#memory-growth
[presentation about Emscripten]: http://llvm.org/devmtg/2013-11/slides/Zakai-Emscripten.pdf
[`Module`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module
[`Memory`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory
[`Instance`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance
[`Table`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Table
[IndexedDB]: https://developer.mozilla.org/en/docs/Web/API/IndexedDB_API
[released PSPDFKit for Web 2017.5]: https://pspdfkit.com/blog/2017/pspdfkit-web-2017-5/
[PDF rendering is hard to get right]: https://pspdfkit.com/guides/ios/current/troubleshooting/complexities-of-rendering-pdfs
[future]: https://www.destroyallsoftware.com/talks/the-birth-and-death-of-javascript
[improving at an insane rate]: https://wasmdash.appspot.com
[our Server-backed product]: https://pspdfkit.com/guides/web/current/#server-backed-deployment
[Check out our current job offers]: https://pspdfkit.com/careers/
