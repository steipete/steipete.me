---
title: "Running Native Code in Electron and the Case for WebAssembly"
description: "We're exploring solutions to run native code in Electron and how WebAssembly can help us with this."
preview_image: /images/blog/2018/running-native-code-in-electron-and-the-case-for-webassembly/header.png
section: blog
author:
  - Philipp Spiess
author_url:
  - https://twitter.com/PhilippSpiess
date: 2018-09-26 10:00 UTC
tags: Electron, Development, How-To
cta: electron
published: true
secret: false
---

Electron is a powerful open source framework that allows development of cross-platform desktop GUI applications with JavaScript, HTML, and CSS. In the past few years, it has been adapted by major companies in the tech industry including GitHub, Facebook, Microsoft, and Slack.

Although Electron comes with access to the entire npm ecosystem, sometimes your application requires the use of native code, either to have direct access to the APIs of your operating system, or to be able to run tasks that require a lot of computing power.

For [PSPDFKit for Electron][], we evaluated multiple approaches to bringing our high-performance PDF engine to this platform. This article provides a brief overview of the available options.

The source code for the following examples is [available on GitHub][github source code].

## Native Modules in Electron

Electron has first-class support for native Node.js modules (also called native addons). These modules are special npm packages that can contain C/C++ code and will compile to the target architecture upon installation.

To compile the code, we make use of [`node-gyp`][], a cross-platform command-line tool for compiling native modules using the gyp project.

Using native modules is straightforward, as we’ll see in the example below. We can simply `require` the native extension inside our JavaScript code and communicate via the interface we set up.

## Example: Native Increment

To demonstrate the usage of native modules, we’ll write a simple package that adds one to the number passed in as an argument.

Such a function would look like the following when written in plain JavaScript:

[===

```es
function increment(number) {
  return number + 1;
}
```

```js
function increment(number) {
  return number + 1;
}
```

===]

To write this function in C++, we’ll be using the `nan` library. This is a library maintained by the Node.js team to abstract native APIs to achieve a high level of portability in case the underlying JavaScript VM changes.

In addition to `nan`, we’ll also be using `bindings`, which is another Node module that makes it easier to bind native modules to JavaScript.

To get started, we first need to add both dependencies to our brand new npm package:

[===

```yarn
yarn init
yarn add nan bindings
```

```npm
npm init
npm install nan bindings
```

===]

Now we can start writing our C++ code. Since JavaScript supports flexible function parity, we’ll have to make sure that the function is called with at least one argument. Additionally, since there isn’t static type checking, we’ll also need to dynamically check that the argument we received is indeed a JavaScript number, and only then can we cast it to the native equivalent, `double`:

```cpp
#include <nan.h>

void Increment(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  // Validate the number of arguments.
  if (info.Length() < 1) {
    Nan::ThrowTypeError("Arity mismatch");
    return;
  }

  // Validate the type of the first argument.
  if (!info[0]->IsNumber()) {
    Nan::ThrowTypeError("Argument must be a number");
    return;
  }

  // Get the number value of the first argument. A JavaScript `number` will be a `double` in C++.
  double arg = info[0]->NumberValue();

  // Allocate a new local variable of type "number" in the JavaScript VM for our return value.
  v8::Local<v8::Number> num = Nan::New(arg + 1);

  // Set the return value.
  info.GetReturnValue().Set(num);
}

void Init(v8::Local<v8::Object> exports) {
  // Bind the `Increment` function as the `increment` export.
  exports->Set(Nan::New("increment").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(Increment)->GetFunction());
}

NODE_MODULE(addon, Init)
```

The `Init` function in the code above is used to define an API with the name `increment` and bind it to the C++ function `Increment`. The previously included `bindings` package can use this information to provide an easy-to-use JavaScript API.

Since our module should feel like a regular npm module, we’ll need to export the bindings properly. To do this, we create an `index.js` file with the following contents:

[===

```es
module.exports = require("bindings")("addon");
```

```js
module.exports = require("bindings")("addon");
```

===]

To test our increment module, we’ll add a small JavaScript test as well. This test will include the module via the regular Node.js `require` import. We’ll simply place this in a file called `test.js`:

[===

```es
const assert = require("assert");
const { increment } = require("./");

console.log(increment(1336));
```

```js
var assert = require("assert");
var increment = require("./").increment;

console.log(increment(1336));
```

===]

Running this test with Node.js won’t work, as we haven’t yet compiled our module. To do this, we first have to create a configuration file (`binding.gyp`) for the gyp environment:

```json
{
  "targets": [
    {
      "target_name": "addon",
      "sources": ["addon.cpp"],
      "include_dirs": ["<!(node -e \"require('nan')\")"]
    }
  ]
}
```

We can now compile the addon using [`node-gyp`][]:

[===

```yarn
yarn global add node-gyp
node-gyp configure
node-gyp build
```

```npm
npm install -g node-gyp
node-gyp configure
node-gyp build
```

===]

With that, we’re all set to run the native module directly via Node.js:

```
$ node test.js
1337
```

## Using Our Native Module in Electron

Thus far, the example we have outlined can be used like any other Node.js package. To make sure this module can be used by Electron, all we need to do is compile it against the proper headers of Node.js. This is required because the Node.js version used by Electron can vary quite a bit from the Node.js version you have installed locally.

We’ll now add our native module to Electron. To do this, we start by checking out the official [electron-quick-start][] application.

Before we can simply `require` our native module in Electron, we must first compile it properly. Electron provides [excellent documentation][electron native node modules] for this topic on its GitHub page. For the purpose of this example, we’ll use the “Manually building for Electron” option.

At the time of writing, the latest stable version of Electron is `3.0.0`. We’ll need to pass this as the `—target` to properly compile our native module. In the directory of our native module, we now run the following code:

```bash
HOME=~/.electron-gyp node-gyp rebuild \
  --target=3.0.0 \
  --arch=x64 \
  --dist-url=https://atom.io/download/electron
```

This will download the required headers from the Electron website and will make a build that runs perfectly in our Electron application. To explain the arguments, [I will cite the Electron documentation][electron documentation]:

> The `HOME=~/.electron-gyp` changes where to find development headers. The `—target=1.2.3` is version of Electron. The `—dist-url=…` specifies where to download the headers. The `—arch=x64` says the module is built for 64bit system.

All that’s left to do is `require` our module like we did in the test file before. This time, we’ll do so inside the `renderer` process:

[===

```es
const { increment } = require("../native-increment");

document.querySelector("#result").innerHTML = increment(1336);
```

```js
var increment = require("../native-increment").increment;

document.querySelector("#result").innerHTML = increment(1336);
```

===]

Voilà! We’ve successfully run our own native module in Electron.

<center>
<img src="/images/blog/2018/running-native-code-in-electron-and-the-case-for-webassembly/app.png" width="512" alt="Electron App that can be used to count numbers upwards with a count implementation written in C++ and run natively.">
</center>

## The Case for WebAssembly

It’s super simple to port native modules for using them inside your Electron app, but compiling to native also has some downsides:

* Although there are several packages that increase the portability of your C++ code for use within Electron, this code will never be as portable as plain JavaScript. If you, for example, use a low-level OS API to achieve specific optimizations, there is a very high probability that this API is not present on other platforms.
* Native code always needs to be compiled to the platform it is used to run on. For your Electron app, this means you’ll have to put in additional effort to always compile to all target platforms. If you’re running into this problem, we suggest you have a look at the fantastic [`prebuild`][] project.
* Native extensions have full access to the OS API. This could put your app under increased security risk.

Thankfully, there exists an alternative to using native extensions in Electron with none of the drawbacks outlined above: WebAssembly — a portable, binary instruction format supported by all major browsers. If you’ve never heard of WebAssembly, I highly recommend checking out [our introductory blog post][].

WebAssembly can be used as a compilation target for most native programming languages (C, C++, or even Rust) and allows you to run high-performance code in a browser. Since Electron 3.0.0 comes with Chrome 66, we can rely on its WebAssembly engine to run high computational work with maximum performance, even in your Electron app.

The biggest drawback of WebAssembly versus the native extensions approach is that it takes longer to start a WebAssembly module. This is mainly because the WebAssembly intermediate format must be compiled to the target architecture before it can run natively. But improvements in this area are underway, and we’re certain that the startup time will vastly improve over the course of the next few months. For a quick glimpse of the current stage, consider reading up on [Optimizing WebAssembly Startup Time][].

## PSPDFKit for Electron

When working on [PSPDFKit for Electron][], we evaluated both the native extension and the WebAssembly approach. Since our PDF engine does not require low-level OS APIs (as such, it can also be used on the web with [PSPDFKit for Web][]), we needed to make sure we made the proper decision for our customers. To do so, we evaluated both approaches and compared the results.

While, as outlined above, the startup speed of a native extension was superior to that of WebAssembly, the runtime speed was very similar and enough to render PDF documents, even on cheaper hardware.

As our WebAssembly bet for our Web product turned out to be a great success, we’ve decided to go with WebAssembly for our Electron SDK as well. We strongly believe that the startup speed will be faster in the future, and we’re already seeing great improvements all over the place.

[pspdfkit for electron]: https://pspdfkit.com/blog/2018/pspdfkit-web-2018-2/
[github source code]: https://github.com/PSPDFKit-labs/native-module-electron
[`node-gyp`]: https://gyp.gsrc.io/
[electron-quick-start]: https://github.com/electron/electron-quick-start
[electron native node modules]: https://github.com/electron/electron/blob/master/docs/tutorial/using-native-node-modules.md
[electron documentation]: https://github.com/electron/electron/blob/master/docs/tutorial/using-native-node-modules.md#manually-building-for-electron
[`prebuild`]: https://github.com/prebuild/prebuild
[our introductory blog post]: https://pspdfkit.com/blog/2017/webassembly-a-new-hope/
[optimizing webassembly startup time]: https://pspdfkit.com/blog/2018/optimize-webassembly-startup-performance/
[pspdfkit for electron]: https://pspdfkit.com/electron
[pspdfkit for web]: https://pspdfkit.com/web
