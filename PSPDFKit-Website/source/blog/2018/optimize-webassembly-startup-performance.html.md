---
title: "Optimizing WebAssembly Startup Time"
description: "Four simple yet effective solutions we currently employ in PSPDFKit for Web to reduce WebAssembly startup time."
preview_image: /images/blog/2018/optimize-webassembly-startup-performance/article-header.png
section: blog
author:
  - Giuseppe Gurgone
author_url:
  - https://twitter.com/giuseppegurgone
date: 2018-02-27 12:00 UTC
tags: Web, Development, WebAssembly
published: true
---

WebAssembly is the future, [and at PSPDFKit, we truly believe in it](/blog/2017/webassembly-a-new-hope/). So much so that [in 2017](https://pspdfkit.com/blog/2017/pspdfkit-web-2017-5/) we launched a serverless version of our PDF viewer and framework that is completely based on WASM.

Thanks to this technology, we are able to ship our C++ rendering engine and PDF processor to browsers and give our customers the opportunity to deliver [a standalone solution](https://pspdfkit.com/guides/web/current/) that doesn’t require a complex backend infrastructure, in addition to the existing server-based product.

Since that 2017 release, our efforts have been focused on reducing WebAssembly startup time, because it is the very first aspect that impacts our end users who opt for standalone deployment.

**Don’t miss the first part of our series: [WebAssembly: A New Hope](/blog/2017/webassembly-a-new-hope/)**

## Bottlenecks

Depending on the size of the WebAssembly module, the process of [creating an instance of it](https://hacks.mozilla.org/2017/07/creating-a-webassembly-module-instance-with-javascript/) can often take several seconds — usually in the order of tens.

More specifically, the initialization process consists of three steps — **download**, **compile**, and **instantiation** — that individually affect the overall load time.

<div id="bench" style="font-size: 0.8em">
  <button class="btn btn-md btn-brand">⏱ Test loading time in your browser</button>
</div>
<script type="text/javascript" src="/images/blog/2018/optimize-webassembly-startup-performance/bench.js"></script>

## Optimizations

However, with relatively little work, it is possible to get significant speed improvement.

To demonstrate this, we will provide an overview of four simple but effective solutions we currently employ in PSPDFKit for Web to speed up each individual step, including:

* [asset caching](#download)
* [compilation, and how to cache compiled .wasm modules](#compiling-and-caching)
* [classic instantiation](#instantiation) and [streaming instantiation](#streaming-instantiation-combining-download-and-instantiation)
* [caching initialized instances](#object-pooling-caching-instances)

### Download

Since .wasm modules are regular files, it is important to make sure they are cached by the browser. This is a very common — and basic if you will — practice when serving assets over the network. In doing so, repeated requests to the same resource can be served from the local resources cache immediately rather than being transferred over the network.

In order for this to work, each server response needs to include the correct Cache-Control HTTP header for the transferred resource, which tells the browser how long the resource should be cached. In [an excellent blog post](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching), Ilya Grigorik from Google does a great job at explaining how HTTP caching works. I highly recommend you read it in case you are not familiar with the topic.

Determining whether or not assets are being served from the browser cache is fairly simple. After opening the developer tools, select the “Network” panel and refresh the page. Cached assets will have response status code 304.

<img src="/images/blog/2018/optimize-webassembly-startup-performance/network.png" alt="Developer Tools Network tab showing cached requests" style="width:448px; max-width:100%" />

Please make sure the cache is _not_ disabled when the developer tools are open. Otherwise, resources will never be served from the local cache.

Once our cache is properly configured, we might want to make sure that our server compresses each resource to reduce its size before transmitting it over the network. This is commonly referred as `gzipping`, and it is supported by all modern browsers. In fact, browsers automatically negotiate GZIP compression for all HTTP requests.

Finally, with service workers, it is possible to serve .wasm modules offline and immediately. The Google Developers site has [a worthwhile article on the topic](https://developers.google.com/web/ilt/pwa/introduction-to-service-worker), which you should definitely check out.

### Compiling and Caching

Once the WebAssembly binary is downloaded, we need to compile it to a [`WebAssembly.Module`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module) before we can create instances of it.

This can be done using the `WebAssembly.compile()` function, which takes a typed array or `ArrayBuffer` containing the binary code of the .wasm module we want to compile, and returns a `Promise` that resolves to a `WebAssembly.Module` object representing the compiled module:

[==

```es
const response = await fetch("module.wasm");
const buffer = await response.arrayBuffer();
const module = await WebAssembly.compile(buffer);

doSomethingWith(module);
```

```js
fetch("module.wasm")
  .then(function(response) {
    return response.arrayBuffer();
  })
  .then(function(buffer) {
    WebAssembly.compile(buffer);
  })
  .then(function(module) {
    doSomethingWith(module);
  });
```

==]

`WebAssembly.instantiate()` can also compile our WebAssembly binary code and then create an instance immediately. We will look into this in the next section.

Regardless of which method we use to compile our .wasm module, this step represents the major bottleneck when using WebAssembly, and it might be very time consuming. In our case, it averages 4s on a modern machine with 16&nbsp;GB of memory.

The good news is that modern browsers ship with [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), an API for client-side storage, which we can use to cache compiled WebAssembly modules.

As of January 2018, Firefox and Chrome (Canary, under feature flag. See: `chrome://flags`) support [WebAssembly-structured cloning](https://github.com/WebAssembly/design/blob/master/JS.md#structured-clone-of-a-webassemblymodule), which allows for storing the compiled `WebAssembly.Module` in IndexedDB. In MSEdge, IndexedDB seems to only be working on the main thread (not in web workers).

Although IndexedDB is a transactional database system like an SQL-based RDBMS, it allows you to store and retrieve objects that are indexed with a `key`.

In our case, the `key` will be the version of our .wasm module, and the `value` will be the compiled module itself. Whenever we change the module version, we can ignore the cached value and recompile.

In a real application, another option is to use a checksum of the .wasm file instead of a module version.

It is also important to delete outdated versions of the module from the database. For simplicity’s sake, we suggest deleting every record from the database before caching a new version of the module.

Keep in mind that for security reasons, browsers don’t allow local files to access IndexedDB databases. As such, our application needs to run on a web server.

During the rest of this post, we will use a `getCache` helper that uses IndexedDB under the hood. You can take a look at [its implementation on GitHub](https://gist.github.com/giuseppeg/467de34fd14af7275d70966a66a86926). Please keep in mind that `getCache` is a simpified and non-production-ready abstraction.

Once we have a simple interface to IndexedDB, caching our compiled module is straightforward.

Using our helper and the `MODULE_VERSION`, we look up the cache to see if we have a compiled module. If not, we fetch the actual .wasm module, compile it, and `put` it in the cache before returning it. Finally, we can call `WebAssembly.instantiate` with the `compiledModule`:

[==

```es
const MODULE_VERSION = 1;
const cache = await getCache("WASMCache");
let compiledModule = await cache.get(MODULE_VERSION);

if (!compiledModule) {
  /**
  * 1. Fetch the module
  * 2. Compile it
  * 3. Put it in the cache
  * 4. Return the compiled module
  */
  const response = await fetch("module.wasm");
  const buffer = await response.arrayBuffer();
  compiledModule = await WebAssembly.compile(buffer);

  cache.put(MODULE_VERSION, compiledModule);
}

// Once we have the compiled module, we can instantiate it.
const module = await WebAssembly.instantiate(compiledModule, imports);
```

```js
var MODULE_VERSION = 1;
var cache;

getCache("WASMCache")
  .then(function(_cache) {
    cache = _cache;
    return cache.get(MODULE_VERSION);
  })
  .then(function(compiledModule) {
    // Return the cached compiled module.
    if (compiledModule) {
      return compiledModule;
    }

    /**
     * 1. Fetch the module
     * 2. Compile it
     * 3. Put it in the cache
     * 4. Return the compiled module
     */
    return (fetch("module.wasm")
        .then(function(response) {
          return response.arrayBuffer();
        })
        // Compile the module
        .then(function(buffer) {
          return WebAssembly.compile(buffer);
        })
        .then(function(compiledModule) {
          cache.put(MODULE_VERSION, compiledModule);
          return compiledModule;
        }) );
  })
  // Once we have the compiled module, we can instantiate it.
  .then(function(compiledModule) {
    return WebAssembly.instantiate(compiledModule, imports);
  });
```

==]

Let’s have a look at some numbers.

**With** IndexedDB caching:

```
Start https://web-preview-server.pspdfkit.com/pspdfkit.wasm download.
Cached .wasm module found. Reading from cache took 115ms.
Instantiation complete, took 117ms.
Native initialization complete, took 239ms.
```

**Without** IndexedDB caching:

```
Start https://web-preview-server.pspdfkit.com/pspdfkit.wasm download.
Download and instantiation complete, took 950ms.
Native initialization complete, took 1,251ms.
```

When reading from cache, initialization is 5 times faster!

### Instantiation

Instantiation is the process of creating an instance of a `WebAssembly.Module`.

When this step is separate from compilation, it might be worth measuring its impact on the overall loading time before doing any (micro)optimization. In many cases in fact, instantiation is fast enough.

But as we mentioned above, `WebAssembly.instantiate()` can also `compile` .wasm modules. The method takes the WebAssembly binary code in the form of a typed array or `ArrayBuffer` and performs both compilation and instantiation in one step.

In this case, we can adapt our caching snippet to work with `WebAssembly.instantiate()`:

[==

```es
const MODULE_VERSION = 1;
const cache = await getCache("WASMCache");
let compiledModule = await cache.get(MODULE_VERSION);

// [new] Create an instance of a `WebAssembly.Module`
if (compiledModule) {
  return WebAssembly.instantiate(compiledModule, imports);
}

/**
 * 1. Fetch the module
 * 2. [new] Compile it and create an instance
 * 3. Put the compiled `WebAssembly.Module` in the cache
 * 4. Return the compiled module
 */
const response = await fetch("module.wasm");
const buffer = await response.arrayBuffer();
// [new] Compile and instantiate the module
const result = await WebAssembly.instantiate(buffer, imports);

// Cache the compiled module
cache.put(MODULE_VERSION, result.module);

// Return an instance of it
return result.instance;
```

```js
var MODULE_VERSION = 1;
var cache;

getCache("WASMCache")
  .then(function(_cache) {
    cache = _cache;
    return cache.get(MODULE_VERSION);
  })
  .then(function(compiledModule) {
    // [new] Create an instance of a `WebAssembly.Module`
    if (compiledModule) {
      return WebAssembly.instantiate(compiledModule, imports);
    }

    /*
     * 1. Fetch the module
     * 2. [new] Compile it and create an instance
     * 3. Put the compiled `WebAssembly.Module` in the cache
     * 4. Return the instance
     */
    return (fetch("module.wasm")
        .then(function(response) {
          return response.arrayBuffer();
        })
        // [new] Compile and instantiate the module
        .then(function(buffer) {
          return WebAssembly.instantiate(buffer, imports);
        })
        .then(function(result) {
          // Cache the compiled module
          cache.put(MODULE_VERSION, result.module);
          // Return an instance of it
          return result.instance;
        }) );
  });
```

==]

### Streaming Instantiation: Combining Download and Instantiation

The ultimate optimization nowadays is streaming instantiation, which allows WebAssembly to compile as the payload is downloaded.

This improvement has a significant impact on the initial compile time, and it allows applications to hide the cost of compiling behind download costs.

As of February 2018, only Firefox and Chrome support `WebAssembly.instantiateStreaming`, with [Chrome shipping support on web workers](https://chromium.googlesource.com/chromium/src/+/7566f0f5a88820cc89bd1c7e911a13575b99810b) soon.

At PSPDFKit, we use streaming compilation and fall back to traditional compilation when it is not supported.

When the compiled module is not cached, we create a `fetch` promise to download the file, and if `WebAssembly.instantiateStreaming` is supported, we invoke it with the promise and the module `imports`. When streaming instantiation is not supported, we use the `fetch` promise regularly and then instantiate the module separately:

[==

```es
const MODULE_VERSION = 1;
const cache = await getCache("WASMCache");
let compiledModule = await cache.get(MODULE_VERSION);

// [new] Create an instance of a `WebAssembly.Module`
if (compiledModule) {
  return WebAssembly.instantiate(compiledModule, imports);
}

// [new]

const fetchPromise = fetch("module.wasm");

let instantiatePromise;

// Detect support for WebAssembly.instantiateStreaming
const isInstantiateStreamingSupported =
  typeof WebAssembly.instantiateStreaming == "function";

if (isInstantiateStreamingSupported) {
  // Streaming supported
  instantiatePromise = WebAssembly.instantiateStreaming(
    fetchPromise,
    imports
  );
} else {
  // No streaming supported — old method
  instantiatePromise = fetchPromise
    .then(response => response.arrayBuffer())
    .then(buffer => WebAssembly.instantiate(buffer, imports));
}

const result = await instantiatePromise;

// Cache the compiled module
cache.put(MODULE_VERSION, result.module);
// Return an instance of it
return result.instance;
```

```js
var MODULE_VERSION = 1;
var cache;

getCache("WASMCache")
  .then(function(_cache) {
    cache = _cache;
    return cache.get(MODULE_VERSION);
  })
  .then(function(compiledModule) {
    if (compiledModule) {
      return WebAssembly.instantiate(compiledModule, imports);
    }

    // [new]

    const fetchPromise = fetch("module.wasm");
    let instantiatePromise;

    // Detect support for WebAssembly.instantiateStreaming
    const isInstantiateStreamingSupported =
      typeof WebAssembly.instantiateStreaming == "function";

    if (isInstantiateStreamingSupported) {
      // Streaming supported
      instantiatePromise = WebAssembly.instantiateStreaming(
        fetchPromise,
        imports
      );
    } else {
      // No streaming supported — old method
      instantiatePromise = fetchPromise
        .then(function(response) {
          return response.arrayBuffer();
        })
        .then(function(buffer) {
          return WebAssembly.instantiate(buffer, imports);
        });
    }

    return instantiatePromise.then(function(result) {
      // Cache the compiled module
      cache.put(MODULE_VERSION, result.module);
      // Return an instance of it
      return result.instance;
    });
  });
```

==]

As a side note, with streaming instantiation, now .wasm files must be served with the correct `Content-Type` header, which is `application/wasm`. When the server is not configured to do so, you might get `Unhandled promise rejection TypeError: Response has unsupported MIME type`.

[Mozilla recommends using `instantiateStreaming`](https://github.com/webpack/webpack/issues/6433) where possible because WebKit’s JSC engine has some performance issues with `compileStreaming`.

We pulled out some numbers to compare the initialization time of PSPDFKit for Web with and without streaming. On average, streaming initialization is 1.8 times faster in Firefox.

**With** streaming instantiation:

```
Start https://web-preview-server.pspdfkit.com/pspdfkit.wasm download.
Download and instantiation complete, took 955ms.
Native initialization complete, took 1,144ms.
```

**Without** streaming instantiation:

```
Start https://web-preview-server.pspdfkit.com/pspdfkit.wasm download.
Download complete, took 667ms.
Compilation and instantiation complete, took 1,119ms.
Native initialization complete, took 2,013ms.
```

### Object Pooling — Caching Instances

In the single-page application era, it might be common to create and destroy `WebAssembly.Module` instances multiple times during the lifecycle of an application.

This process can add some overhead, especially when compiled modules are not cached permanently using IndexedDB. In the worst case, an application will start the entire initialization process (download, compile, instantiate) from scratch every time it needs to use the .wasm module.

When this occurs, an [object pool](https://en.wikipedia.org/wiki/Object_pool_pattern) can be a decent solution to speed up the subsequent creation of instances. In fact, after the initial download, compilation, and instantiation, the warmed up `WebAssembly.Module` instances can be kept in memory and reused at any time.

The object pool simply holds a fixed number of instances in memory and returns one when we ask for it. If none are available, then it creates a new instance and returns it.

When we no longer need an instance, we can `put` it back in the pool, which will either `recycle` it (do some cleanup) and keep it alive, or `destroy` it i.e. defer the object to garbage collection for cleanup when the pool is full.

Each instance must implement a simple `Recyclable` interface that defines a `recycle` and `destroy` method:

```es
interface Recyclable {
  destroy(): void;
  recycle(): void;
}
```

An object pool can be used at any level in an application to keep things in memory and ready to use. For example, it could be employed to cache the entire web worker in which we run our WebAssembly code, or it could just cache an instance of a WebAssembly module.

At PSPDFKit, we use object pooling to cache our WebAssembly backend, which runs in a web worker. This allows for [fast instance creation](https://pspdfkit.com/blog/2017/pspdfkit-web-2017-7/#fast-standalone-instance-creation) when opening new PDFs.

<video src="/images/blog/2017/pspdfkit-web-2017-7/wasm-speed.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Conclusion

Although WebAssembly is a fairly new and cutting-edge technology, it has already been employed in production applications like [PSPDFKit for Web](/web).

Getting startup time of our application down to 200 – 300ms (best case) is already achievable since most of the following optimizations are already possible:

* Making sure the .wasm file is properly cached
* Using streaming instantiation
* Caching compiled WebAssembly modules in IndexedDB
* Using object pooling to cache warmed-up instances

In fact, with [our most recent release](https://pspdfkit.com/blog/2018/pspdfkit-web-2018-1/#bonus-faster-webassembly-initialization), we implemented IndexedDB caching and streaming instantiation in PSPDFKit for Web and our customers are already benefitting from these improvements.

During the past year, Mozilla has invested a lot into making WebAssembly awesome and fast, and we believe other vendors will follow along. We are looking forward to it!

As a final note to our customers, we also offer the possibility of using asm.js. While some of the optimizations above cannot be implemented when using asm.js, the startup time is usually faster than (unoptimized) .wasm.

**Don’t miss the first part of our series: [WebAssembly: A New Hope](/blog/2017/webassembly-a-new-hope/)**

---

👋 I hope you enjoyed reading! We are actively looking for frontend engineers to join our web team and work on PSPDFKit for Web and awesome technology like WebAssembly. If interested, please check our [careers page](https://pspdfkit.com/careers/senior-frontend-web-engineer/).
