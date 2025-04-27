---
title: "Open and Annotate PDFs from Your Vue.js App"
description: "How to add a PDF viewer to your Vue.js app by embedding PSPDFKit for Web."
preview_image: /images/blog/2018/open-and-annotate-pdfs-from-your-vuejs-app/article-header.png
section: blog
author:
  - Miguel Calderón
author_url:
  - https://twitter.com/miguelca
date: 2018-10-22 8:00 UTC
tags: Web, Development, JavaScript
published: true
secret: false
---

Nowadays, PDF documents are the preferred format for many things, including sharing information with formatting and enhanced data visualization. Therefore, it’s not surprising that the ability to open and annotate PDF documents has become an increasingly demanded feature for any web application as soon as it grows in size and complexity.

However, adding such a feature to a web application usually means incrementing the number of “moving parts” of a codebase by orders of magnitude: PDF is a [complex file format][], which may deem the task overwhelming for any development team.

We can simplify this task significantly by making use of [PSPDFKit for Web][], a PDF SDK that can be used with (and without) any JavaScript framework, including [Vue.js][]. It supports all modern mobile and desktop browsers (Chrome, Firefox, Safari, Edge, and IE11) and multiple languages, and it makes good use of the latest technologies available — like [WebAssembly][wasm blog post] — to make the experience as performant as possible.

PSPDFKit for Web comes in two flavors: server and standalone. This means you can set it up as a shared collaboration tool that’s integrated with your server backend, or as a client-side library with all the features you may need for your PDF document handling.

In order to allow developers to easily embed PSPDFKit for Web in their applications, several integration examples are available. In this article, we’ll walk through the integration example for Vue.js that we can clone from the [public PSPDFKit repository][example app]. We’ll build a small app in a single HTML file that will fetch all the assets needed to load and run PSPDFKit for Web in a Vue.js app.

The final result will look like the image below in your browser. It will consist of a simple UI that allows you to open, view, and annotate PDF documents from within your Vue.js app.

![Integration with Vue.js example](/images/blog/2018/open-and-annotate-pdfs-from-your-vuejs-app/final-screenshot.png)

In order to get the example running, you’ll need the following tools:

- [Node.js][] >= 8
- [Yarn][] (optional: you can use npm instead, which is included with Node.js)
- PSPDFKit for Web license key and npm key (get them [here][trial])

We’ll start by adding the Vue.js library to a basic HTML skeleton, which can be placed in `/src/index.html`. We’ll use a CDN version of Vue.js so we don’t even need to download it:

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>My app</title>
<!-- Vue library loaded here. -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>
<body>
</body>
</html>
```

In the `body` of the page, we add a Vue.js template that will be used by our app container:

```html
<body>
<!-- Template for the main app component. -->
<div id="app"></div>
</body>
</html>
```

Now we tell Vue.js to create the root component in the root element of our template:

```js
new Vue({
  el: "#app",
  name: "pspdfkit-web-example-vue"
});
```

But how do we load and run PSPDFKit for Web? Let’s copy the [npm key we got from PSPDFKit for Web][adding to your project], open a terminal in the root folder of our project, and run the following lines:

[==

```yarn
yarn init
```

```npm
npm init
```

==]

We’ll be prompted for information about our app, including the name of the app, the version, and the description. We can just accept the default values, which should work fine for this example. Once we're done setting our app parameters, we can run the following command:

[==

```yarn
yarn add https://customers.pspdfkit.com/npm/YOUR_NPM_KEY_GOES_HERE/latest.tar.gz
```

```npm
npm install https://customers.pspdfkit.com/npm/YOUR_NPM_KEY_GOES_HERE/latest.tar.gz
```

==]

We have now installed PSPDFKit for Web locally. But we can’t access the `./node_modules` folder from our `./src/index.html` file, so we are going to copy the `pspdfkit` folder from its current location — `./node_modules/pspdfkit/dist/pspdfkit-lib`n — to `./src/pspdfkit-lib`.

Then we’ll copy the `pspdfkit.js` file from its location — `./node_modules/pspdfkit/dist/pspdfkit.js` — to `./src/pspdfkit.js`.

That’s all we need to start playing with PSPDFKit for Web. Our [example app][] includes utility scripts, so we don’t have to manually copy these files, which also helps us avoid possible mistakes.

Let’s go back to `./src/index.html`. We can now load the PSPDFKit for Web module:

```html
<head>
<meta charset="UTF-8">
<title>My app</title>
<!-- Vue library loaded here. -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<!-- PSPDFKit for Web library loaded here. -->
<script type="text/javascript" src="pspdfkit.js"></script>
</head>
```

Then we create our child component, which will load the library. Let’s add it to the main component as a child component:

[==

```es
const pspdfkit = Vue.component("pspdfkit", {
  template: '<div class="container"></div>',
  name: "pspdfkit"
});
new Vue({
  components: { pspdfkit },
  el: "#app",
  name: "pspdfkit-web-example-vue"
});
```

```js
var pspdfkit = Vue.component("pspdfkit", {
  template: '<div class="container"></div>',
  name: "pspdfkit"
});
new Vue({
  components: { pspdfkit: pspdfkit },
  el: "#app",
  name: "pspdfkit-web-example-vue"
});
```

==]

We also add our child component to the main template:

```html
<body>
<!-- Template for the main app component. -->
<div id="app">
  <div class="App-viewer">
    <pspdfkit></pspdfkit>
  </div>
</div>
```

We’re almost there! PSPDFKit for Web now needs some information before launching, namely:

- A PDF document to load.
- The base URL from where the library will be loaded — in our case, it’s the same as `index.html`, which is `/`.
- The license key from PSPDFKit.

We add the info to our main component’s `data` block:

[==

```es
new Vue({
  components: { pspdfkit },
  el: "#app",
  name: "pspdfkit-web-example-vue",
  data: () => ({
    pdf: "example.pdf",
    LICENSE_KEY,
    baseUrl: "",
    errorMsg: ""
  });
});
```

```js
new Vue({
  components: { pspdfkit: pspdfkit },
  el: "#app",
  name: "pspdfkit-web-example-vue",
  data: function() {
    return {
      pdf: "example.pdf",
      LICENSE_KEY: LICENSE_KEY,
      baseUrl: "",
      errorMsg: ""
    };
  }
});
```

==]

You’ll notice we’ve also added an `errorMsg` field. By means of that field, we’ll be able to show any error message coming from the PSPDFKit for Web library that will make us aware of any possible issues.

Back at our `pspdfkit` component, we need to add the corresponding ‘props,’ which will be passed to the library’s document loader:

[==

```es
const LICENSE_KEY = "YOUR_LICENSE_KEY_GOES_HERE";

const pspdfkit = Vue.component("pspdfkit", {
  template: '<div class="container"></div>',
  name: "pspdfkit",
  props: ["pdfUrl", "licenseKey", "baseUrl"],
  _instance: null,
  mounted() {
    this.load();
  },
  methods: {
    load() {
      PSPDFKit.load({
        pdf: this.pdfUrl,
        container: ".container",
        licenseKey: this.licenseKey,
        baseUrl: this.baseUrl
      })
        .then(instance => {
          this._instance = instance;
          this.$parent.errorMsg = "";
        })
        .catch(err => {
          PSPDFKit.unload(".container");
          this.$parent.errorMsg = err.message;
        });
    },
    unload() {
      if (this._instance) {
        PSPDFKit.unload(this._instance);
        this._instance = null;
      } else {
        PSPDFKit.unload(".container");
      }
    }
  }
});
```

```js
var LICENSE_KEY = "YOUR_LICENSE_KEY_GOES_HERE";

var pspdfkit = Vue.component("pspdfkit", {
  template: '<div class="container"></div>',
  name: "pspdfkit",
  props: ["pdfUrl", "licenseKey", "baseUrl"],
  _instance: null,
  mounted: function() {
    this.load();
  },
  methods: {
    load: function() {
      var that = this;
      PSPDFKit.load({
        pdf: this.pdfUrl,
        container: ".container",
        licenseKey: this.licenseKey,
        baseUrl: this.baseUrl
      })
        .then(function(instance) {
          that._instance = instance;
          that.$parent.errorMsg = "";
        })
        .catch(function(err) {
          PSPDFKit.unload(".container");
          that.$parent.errorMsg = err.message;
        });
    },
    unload: function() {
      if (this._instance) {
        PSPDFKit.unload(this._instance);
        this._instance = null;
      } else {
        PSPDFKit.unload(".container");
      }
    }
  }
});
```

==]

Now we only need to add our PDF file to the `/src` folder and try it out! But we need to serve our static files. We can either configure and use Apache / NGINX / our favorite local server pointing `http://localhost` to our `/src` folder, or we can use PSPDFKit’s own static server, which will handle the mime types for `application/wasm` that are needed by PSPDFKit for Web.

Creating such a static server is simpler than it seems, but it goes beyond the aim of this article. Let’s just keep in mind that we already have a node server ready to run in our [example app][], and it supports all the necessary features for our example.

When we finally launch our server and access `/index.html` through localhost, we’re disappointed: no PSPDFKit for Web, no PDF file, no fun. What happened?

We forgot to add [our license key from PSPDFKit][integration]!

[==

```es
const LICENSE_KEY = "YOUR_LICENSE_KEY_GOES_HERE";
```

```js
var LICENSE_KEY = "YOUR_LICENSE_KEY_GOES_HERE";
```

==]

But we haven’t set a height for our component either, so the library doesn’t have a container to run in. Let’s add some CSS to solve this:

```html
<style>
body {
  height: 100vh;
}

#app,
.App-viewer,
.container {
  height: 100%;
}
</style>
</head>
```

Now we reload the page and… Hooray! PSPDFKit for Web shows its interface and opens our PDF file, which can be read, annotated, or printed directly from our browser!

We can also make this example app a little more interesting. Let’s add a button to open local PDF files so we that can open any PDF and not only the one we initially hardcoded and copied to our `./src` folder:

```html
<body>
<!-- Template for the main app component. -->
<div id="app">
  <div>
    <input type="file" id="selectPDF" v-on:change="openPDF" accept="application/pdf" />
    <span class="error">{{errorMsg}}</span>
  </div>
  <div class="App-viewer">
    <pspdfkit :pdf-url="pdf" :license-key="LICENSE_KEY" :base-url="baseUrl"></pspdfkit>
  </div>
</div>
```

We’ll add some handlers to the component to deal with more than one initial file:

[==

```es
const pspdfkit = Vue.component("pspdfkit", {
  template: '<div class="container"></div>',
  name: "pspdfkit",
  props: ["pdfUrl", "licenseKey", "baseUrl"],
  _instance: null,
  mounted() {
    this.load();
  },
  methods: {
    load() {
      PSPDFKit.load({
        pdf: this.pdfUrl,
        container: ".container",
        licenseKey: this.licenseKey,
        baseUrl: this.baseUrl
      })
        .then(instance => {
          this._instance = instance;
          this.$parent.errorMsg = "";
        })
        .catch(err => {
          PSPDFKit.unload(".container");
          this.$parent.errorMsg = err.message;
        });
    },
    unload() {
      if (this._instance) {
        PSPDFKit.unload(this._instance);
        this._instance = null;
      } else {
        PSPDFKit.unload(".container");
      }
    }
  },
  watch: {
    pdfUrl() {
      this.unload();
      this.load();
    }
  },
  beforeDestroy() {
    this.unload();
  }
});
```

```js
var pspdfkit = Vue.component("pspdfkit", {
  template: '<div class="container"></div>',
  name: "pspdfkit",
  props: ["pdfUrl", "licenseKey", "baseUrl"],
  _instance: null,
  mounted: function() {
    this.load();
  },
  methods: {
    load: function() {
      var that = this;
      PSPDFKit.load({
        pdf: this.pdfUrl,
        container: ".container",
        licenseKey: this.licenseKey,
        baseUrl: this.baseUrl
      })
        .then(function(instance) {
          that._instance = instance;
          that.$parent.errorMsg = "";
        })
        .catch(function(err) {
          PSPDFKit.unload(".container");
          that.$parent.errorMsg = err.message;
        });
    },
    unload: function() {
      if (this._instance) {
        PSPDFKit.unload(this._instance);
        this._instance = null;
      } else {
        PSPDFKit.unload(".container");
      }
    }
  },
  watch: {
    pdfUrl: function() {
      this.unload();
      this.load();
    }
  },
  beforeDestroy: function() {
    this.unload();
  }
});
```

==]

We also need to add an event handler to our main component for our button. This handler will create an object URL to pass to the `pspdfkit` component:

[==

```es
new Vue({
  components: { pspdfkit },
  el: "#app",
  name: "pspdfkit-web-example-vue",
  data() {
    return {
      pdf: "example.pdf",
      LICENSE_KEY,
      baseUrl: "",
      errorMsg: ""
    };
  },
  methods: {
    openPDF(e) {
      this.pdf = window.URL.createObjectURL(e.target.files[0]);
    }
  }
});
```

```js
new Vue({
  components: { pspdfkit: pspdfkit },
  el: "#app",
  name: "pspdfkit-web-example-vue",
  data: function() {
    return {
      pdf: "example.pdf",
      LICENSE_KEY: LICENSE_KEY,
      baseUrl: "",
      errorMsg: ""
    };
  },
  methods: {
    openPDF: function(e) {
      this.pdf = window.URL.createObjectURL(e.target.files[0]);
    }
  }
});
```

==]

Reload and… that looks better! We can now open other PDF files after loading the default one just by using the button we added.

### Conclusion

As you can see, getting PSPDFKit for Web running in Vue.js doesn’t take long at all. You can install and play with the [Vue.js example from our public repo][example app], and [ping us if you need any help with your setup][support]!

[complex file format]: https://www.adobe.com/devnet/pdf/pdf_reference.html
[pspdfkit for web]: https://pspdfkit.com/pdf-sdk/web/
[vue.js]: https://vuejs.org/
[wasm blog post]: https://pspdfkit.com/blog/2018/a-real-world-webassembly-benchmark/
[node.js]: https://nodejs.org
[yarn]: https://yarnpkg.com/
[trial]: https://pspdfkit.com/try/
[adding to your project]: https://pspdfkit.com/guides/web/current/standalone/adding-to-your-project/
[example app]: https://github.com/PSPDFKit/pspdfkit-web-example-vue
[integration]: https://pspdfkit.com/guides/web/current/standalone/integration/
[support]: https://support.pspdfkit.com/hc/en-us/requests/new
