---
title: "Open PDFs in an Angular App with PSPDFKit"
description: "How to add a PDF viewer to your Angular app by embedding PSPDFKit for Web."
preview_image: /images/blog/2019/open-pdf-angular/article-header.png
section: blog
author:
  - Giuseppe Gurgone
author_url:
  - https://twitter.com/giuseppegurgone
date: 2019-02-18 7:00 UTC
tags: Web, Development, JavaScript, Angular
published: true
secret: false
---

Thanks to its amazing tooling, great community, and ease of use, Angular is one of the most popular web frameworks to date. So in this blog post, we’ll show how to open a PDF in an Angular application in minutes.

## Prerequisites

We’ll assume you’re already familiar with Angular CLI and that you have successfully created a new application with it.

To run PSPDFKit for Web, you also need an installation (npm) and a license key.

If you don’t have these already, you can request them on [our website][]. Make sure you tick the Web checkbox, and then open the confirmation email, which contains the link that will give you access to your trial license.

Simply follow the PSPDFKit for Web link and choose Standalone > Download Client to get your npm key (`NPM_KEY`), and then choose Standalone > Integrate Client to get your license key (`LICENSE_KEY`) for use with the SDK.

Finally, you need to add the PDF you want to open to the `src/assets` folder of your Angular project.

## Installation

Using the npm key, install PSPDFKit for Web as an npm package:

```npm
npm install --save https://customers.pspdfkit.com/npm/TRIAL-your-npm-key-goes-here/latest.tar.gz
```

Once the package is installed, you need to integrate it with Angular by adding the following lines to the `assets` section of your `angular.json` file:

```diff
  "assets": [
    "src/favicon.ico",
    "src/assets",
+    {
+      "glob": "**/*",
+      "input": "./node_modules/pspdfkit/dist/pspdfkit-lib/",
+      "output": "./assets/pspdfkit-lib/"
+    }
  ]
}
```

This can be found under the `projects > yourProjectName > architect > build > options > assets` section of the configuration file.

## Opening the PDF

Now that PSPDFKit is installed, you need to add the following HTML to your app component:

```html
<!-- src/app/app.component.html -->
<style>
  #app {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
</style>
<div id="app"></div>
```

The app container doesn’t need to be in `position: fixed`. However, it always needs to have a `width` and `height` set.

Finally, you can initialize PSPDFKit:

```es
/* src/app/app.component.ts */
import { Component } from '@angular/core';
import PSPDFKit from 'pspdfkit';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'angularpdf';

  ngAfterViewInit() {

    PSPDFKit.load({
      baseUrl: location.protocol + "//" + location.host + "/assets/",
      pdf: '/assets/example.pdf',
      container: '#app',
      licenseKey: YOUR_LICENSE_KEY_GOES_HERE,
    }).then(function (instance) {
      console.log('PSPDFKit for Web loaded!')

      // For the sake of this demo, store the PSPDFKit for Web instance
      // on the global object so that you can open the dev tools and
      // play with the PSPDFKit API.
      (window as any).instance = instance;
    });

  }
}
```

In the snippet above, `PSPDFKit.load` is called with a configuration object where you define:

- `baseUrl`, which is where your assets are available (this is set in `angular.json`).
- `pdf`, which is the relative URL for your example PDF file.
- `container`, which is where you mount PSPDFKit.
- `licenseKey`, which is where you should replace `YOUR_LICENSE_KEY_GOES_HERE` with your trial license key (`LICENSE_KEY`).

Note that `PSPDFKit.load` is called in the `ngAfterViewInit` lifecycle method, i.e. after your `div#app` is rendered, so that PSPDFKit can be initialized inside of it.

Once loaded, expose the PSPDFKit for Web instance on the global object so that you can open the dev tools and play with [our API][].

## Opening a Local PDF

PSPDFKit for Web can also open local PDF files. In this case, the `pdf` configuration option should be an [`ArrayBuffer`][] of your file.

To open a file, you need to create [a file picker][] and, when selecting a file, convert it to `ArrayBuffer` using the FileReader API (see an [example here][example]).

Once you have the PDF in the `ArrayBuffer` format, you can call `PSPDFKit.load` with it.

## Conclusion

Thanks to its toolset, Angular makes it easy to build web applications. Hopefully you found the process of integrating PSPDFKit for Web just as easy.

[our website]: https://pspdfkit.com/try/
[our api]: https://pspdfkit.com/api/web/
[`arraybuffer`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
[a file picker]: https://github.com/PSPDFKit/pspdfkit-web-example-webpack/blob/ea15cb3bb20aadab428eb51edc20db402a6fd968/src/lib/file-picker.js
[example]: https://github.com/PSPDFKit/pspdfkit-web-example-webpack/blob/ea15cb3bb20aadab428eb51edc20db402a6fd968/src/lib/utils.js#L12-L19
