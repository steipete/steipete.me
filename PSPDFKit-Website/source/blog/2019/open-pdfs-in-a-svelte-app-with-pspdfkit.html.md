---
title: "Open PDFs in a Svelte App with PSPDFKit"
description: "Integrate PSPDFKit for Web from scratch in a Svelte application using Parcel."
preview_image: /images/blog/2019/open-pdfs-in-a-svelte-app-with-pspdfkit/article-header.png
section: blog
author:
  - Guillermo Peralta
author_url:
  - https://twitter.com/voluntadpear
date: 2019-12-09 8:00 UTC
tags: Web, Development, JavaScript
published: true
secret: false
---

[Svelte][] is a web framework that, unlike React and Vue, doesn’t make use of a [virtual DOM][]. Instead, Svelte compiles components to vanilla JS with no runtime dependencies. Svelte is growing in popularity due to its reactivity-based model and interesting design choices, and as we are going to see in this blog post, it comes with some really interesting features that are unique to it.

[Parcel][] is a zero configuration web applications bundler, and it’s similar to tools like Rollup and [webpack][webpack blog post]. However, it varies in that it comes with a sensible set of default configurations that greatly minimize the need to tweak the values to get our applications ready for production.

[PSPDFKit for Web][] is a PDF viewer and annotation SDK that can be integrated with any JavaScript framework. It has support for all modern mobile and desktop browsers and comes with advanced features that allow users to view, edit, annotate, and perform many operations on PDF documents.

In this article, we will set up a [Svelte][] web application step by step using Parcel. We’ll then integrate PSPDFKit for Web into it. If you would like to take a look at the final result, this example is available in the [public PSPDFKit repository][example repo].

Just like in our [Vue.js example][vue blog post], our app will consist of both a file picker and a UI for viewing and annotating PDF documents. Below is an example showing how it will appear.

![Screenshot of the final result of the example of integrating PSPDFKit for Web in a Svelte app](/images/blog/2019/open-pdfs-in-a-svelte-app-with-pspdfkit/final-result.png)

## Setup

In a blank folder, let’s initialize a new project. For this, we can use either Yarn or npm (which is included with Node.js):

[==

```yarn
yarn init
```

```npm
npm init
```

==]

Follow the instructions indicated by the CLI and complete the details of the app. You can accept the default values (or even run the previous command, adding the `-y` flag) or go ahead and specify your own preferred options.

Once the previous step is finished, a `package.json` file should have been created. Then we’ll proceed to add Svelte, Parcel, and the Svelte plugin for Parcel to our project:

[==

```yarn
yarn add -D svelte parcel-bundler parcel-plugin-svelte
```

```npm
npm i -D svelte parcel-bundler parcel-plugin-svelte
```

==]

In our `package.json` file, we can add our scripts and an initial [Browserslist][] specification (which is needed by [parcel-plugin-svelte][browserslist issue]):

```json
"scripts": {
  "start": "parcel src/index.html",
  "build": "parcel build --no-source-maps src/index.html"
},
"browserslist": [
  "last 2 chrome versions"
],
```

We can now go ahead and install PSPDFKit for Web. For this example, we will rely on a [standalone deployment][] of PSPDFKit for Web, which we will integrate as a feature-rich client-side library. First we’ll need a free [PSPDFKit for Web demo license][demo license] that we’ll use in a future step. Then we can install the module:

[==

```yarn
yarn add pspdfkit
```

```npm
npm i pspdfkit
```

==]

After installing PSPDFKit for Web, we need to copy all its required files to serve them from within the same folder as our application. For this, we can use `parcel-plugin-static-files-copy`:

[==

```yarn
yarn add -D parcel-plugin-static-files-copy
```

```npm
npm i -D parcel-plugin-static-files-copy
```

==]

Next we update our `package.json` to copy over the `./node_modules/pspdfkit/dist/pspdfkit-lib` directory to our output directory:

```json
"staticFiles": {
  "staticPath": [
    "static",
    {
      "staticPath": "node_modules/pspdfkit/dist/pspdfkit-lib",
      "staticOutDir": "pspdfkit-lib"
    }
  ]
},
```

That’s it! Additionally, we specified the `static` directory where we will host our initial PDF file. Now we can start writing our Svelte app!

## Our First Svelte Component

We will start by creating a `src` folder that will contain all of our Svelte components, our JavaScript entry point, and our `index.html` page for our application (the latter of which will load our JavaScript code from a `script` tag).

Our `index.html` will look like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf8" />
    <meta name="viewport" content="width=device-width" />
    <title>PSPDFKit for Web example - Svelte</title>
  </head>

  <body>
    <script src="./index.js"></script>
  </body>
</html>
```

Let’s create our first Svelte component to wrap PSPDFKit for Web. Add a new file named `PSPDFKit.svelte` with this content:

```svelte
<!-- PSPDFKit.svelte -->

<div class="container" />
```

It just renders a `div`, but don’t worry; this is where our PSPDFKit for Web instance will be mounted. Let’s now focus on the main component of our application. So, create an `App.svelte` file in the same directory:

```svelte
<!-- App.svelte -->

<script>
  import PSPDFKit from './PSPDFKit.svelte'
</script>

<PSPDFKit />
```

Now, let’s add an `.env` file that will contain our environment variables. For this example, we will just add a `PSPDFKIT_LICENSE_KEY` variable:

```
PSPDFKIT_LICENSE_KEY=YOUR_LICENSE_KEY_GOES_HERE
```

Parcel will automatically find references to `process.env.PSPDFKIT_LICENSE_KEY` and replace them at build time with the value you provide.

The last file we will need is the `index.js` file we are referencing from `index.html`. Parcel will use this file as the main entry point for our module dependencies resolution. There, we tell Svelte to mount the root `App` component in the `body` element of our page:

```js
// index.js

import App from "./App.svelte";

const app = new App({
  target: document.body
});

export default app;
```

Let’s make our `PSPDFKit.svelte` component receive some props, outlined below, to determine certain aspects that we need to load PDF documents:

- The PDF document to open
- The base URL from where the library will be loaded (only if necessary)
- Our license key to use PSPDFKit

```svelte
<!-- PSPDFKit.svelte -->

<script>
  export let pdf;
  export let licenseKey;

  let instance;
</script>

<div class="container" />
```

Now we should go back to our main component and add the values we want for our `PSPDFKit` instance and pass them as props:

```svelte
<!-- App.svelte -->

<script>
  import PSPDFKit from "./PSPDFKit.svelte";

  const LICENSE_KEY = process.env.PSPDFKIT_LICENSE_KEY;
  let pdf = "example.pdf";
</script>

<PSPDFKit pdf={pdf} licenseKey={LICENSE_KEY} />
```

Now, on our `PSPDFKit.svelte` component, we are going to make use of a convenient feature of Svelte called [actions][svelte actions]. Actions allow us to define a function that will be called when an element is created and that can return an object with a callback to run after the element is unmounted:

```svelte
<!-- PSPDFKit.svelte -->

<script>
  import PSPDFKit from "pspdfkit";

  export let pdf;
  export let licenseKey;

  // Variable that the parent can bind to for error message handling.
  export let errorMsg = "";

  let instance;

  function handlePDF(element) {
    load(element);
    return {
      destroy() {
        unload(element);
      }
    };
  }

  async function load(container) {
    try {
      instance = await PSPDFKit.load({
        container,
        pdf,
        licenseKey
      });
      errorMsg = "";
    } catch (error) {
      unload(container);
      errorMsg = error.message;
    }
  }

  function unload(container) {
    if (instance) {
      PSPDFKit.unload(instance);
      instance = null;
    } else {
      PSPDFKit.unload(container);
    }
  }
</script>

<div use:handlePDF class="container" />
```

See the `use:handlePDF` directive on our template? That’s how we set up a Svelte action. On `App.svelte`, we hardcoded `example.pdf` as its initial value. If we add `example.pdf` into the `static` folder, PSPDFKit for Web will use that on the initial render.

Notice that we added an `errorMsg` prop during the last step. We can go back to our main component and bind to the `errorMsg` prop:

```svelte
<!-- App.svelte -->

<script>
  import PSPDFKit from "./PSPDFKit.svelte";

  const LICENSE_KEY = process.env.PSPDFKIT_LICENSE_KEY;
  let pdf = "example.pdf";
  let errorMsg = "";
</script>

<span class="error">{errorMsg}</span>
<PSPDFKit pdf={pdf} licenseKey={LICENSE_KEY} bind:errorMsg={errorMsg} />
```

Now we are able to reactively track error messages directly from our parent component.

Before rendering our PDF file with PSPDFKit for Web, we need to set a height for the element that we are using to mount it. Let’s do it and also adjust the `body` to allow our PDF viewer to fit our browser viewport.

On `PSPDFKit.svelte`, we can go ahead and add a `<style>` block before our `.container` div:

```svelte
<!-- PSPDFKit.svelte -->

<style>
  .container {
    height: 100%;
  }
</style>
```

Additionally, we can remove the default margins and make sure the height of our `body` element covers the height of the viewport entirely by adding a piece of CSS to the `App.svelte` component:

```svelte
<!-- App.svelte -->

<style>
  :global(body) {
    height: 100vh;
    margin: 0;
  }
</style>
```

Note that since Svelte styles are scoped to the component by default, we need to use the `:global` modifier to access the `body` of our page.

Great! We have everything set up to start rendering and annotating PDF documents. If you run `yarn start` or `npm start` and go to the URL that the terminal indicates, you should be able to see the PSPDFKit for Web interface 🎉.

Now we can add many interesting features to our application, as PSPDFKit for Web comes with a convenient [API][] to customize and extend it.

## Upload Your Own PDF Documents

For our example, it would be cool to allow users to upload their own PDF documents and render them instantly. Here is how we can add support for that:

```svelte
<!-- App.svelte -->

<script>
  import PSPDFKit from "./PSPDFKit.svelte";

  const LICENSE_KEY = process.env.PSPDFKIT_LICENSE_KEY;
  let pdf = "example.pdf";
  let errorMsg = "";

  function openPDF(e) {
    pdf = window.URL.createObjectURL(e.target.files[0]);
  }
</script>

<style>
:global(body) {
  height: 100vh;
  margin: 0;
}
</style>

<form>
  <input type="file" on:change={openPDF} accept="application/pdf">
</form>
<span class="error">{errorMsg}</span>
<PSPDFKit pdf={pdf} licenseKey={LICENSE_KEY} bind:errorMsg={errorMsg} />
```

Notice that the reactivity allows us to simply mutate the `pdf` variable with the new file URL, and all the components that depend on its value will update accordingly.

In addition to allowing us to run functions when an element is created, Svelte actions can have parameters that will be provided for us on our function (after the DOM element itself). Furthermore, we can add an `update` method to the returned object that will be called whenever those parameters change:

```svelte
<!-- PSPDFKit.svelte -->

<script>
  import PSPDFKit from "pspdfkit";

  export let pdf;
  export let licenseKey;

  // Variable that the parent can bind to for error message handling.
  export let errorMsg = "";

  let instance;

  function handlePDF(element, pdf) {
    load(element, pdf);
    return {
      update(pdf) {
        unload(element);
        load(element, pdf);
      },
      destroy() {
        unload(element);
      }
    };
  }

  async function load(container, pdf) {
    try {
      instance = await PSPDFKit.load({
        container,
        pdf,
        licenseKey,
        theme: PSPDFKit.Theme.DARK
      });
      errorMsg = "";
    } catch (error) {
      unload(container);
      errorMsg = error.message;
    }
  }

  function unload(container) {
    if (instance) {
      PSPDFKit.unload(instance);
      instance = null;
    } else {
      PSPDFKit.unload(container);
    }
  }
</script>

<style>
  .container {
    height: 100%;
  }
</style>

<div use:handlePDF={pdf} class="container" />
```

If you save these changes and reload the page, you should be able to open different PDF files!

## Conclusion

Getting a Svelte application up and running is straightforward using Parcel, and PSPDFKit for Web can be integrated in a Svelte component in little time. You can install and try the final result using the example in [our public repository][example repo]. If you are trying to integrate PSPDFKit for Web into a Svelte application, feel free to [contact us if you need additional support][support]!

[complex file format]: https://www.adobe.com/devnet/pdf/pdf_reference.html
[pspdfkit for web]: https://pspdfkit.com/pdf-sdk/web/
[wasm blog post]: https://pspdfkit.com/blog/2018/a-real-world-webassembly-benchmark/
[svelte]: https://svelte.dev
[parcel]: https://parceljs.org
[webpack blog post]: https://pspdfkit.com/blog/2018/using-webpack-with-middleman/
[vue blog post]: https://pspdfkit.com/blog/2018/open-and-annotate-pdfs-from-your-vuejs-app/
[virtual dom]: https://reactjs.org/docs/faq-internals.html#what-is-the-virtual-dom
[browserslist]: https://github.com/browserslist/browserslist
[demo license]: https://pspdfkit.com/try/
[standalone deployment]: https://pspdfkit.com/guides/web/current/standalone/overview/
[api]: https://pspdfkit.com/api/web
[support]: https://support.pspdfkit.com/hc/en-us/requests/new
[svelte actions]: https://svelte.dev/docs#use_action
[example repo]: https://github.com/PSPDFKit/pspdfkit-web-example-svelte
[browserslist issue]: https://github.com/DeMoorJasper/parcel-plugin-svelte/issues/44
