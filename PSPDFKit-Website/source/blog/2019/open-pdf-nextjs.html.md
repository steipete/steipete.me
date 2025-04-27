---
title: "Open PDFs in a Next.js App with PSPDFKit"
description: "How to add a PDF viewer to your Next.js app by embedding PSPDFKit for Web."
preview_image: /images/blog/2019/open-pdf-nextjs/article-header.png
section: blog
author:
  - Ritesh Kumar
author_url:
  - https://twitter.com/ritz078
date: 2019-11-05 7:00 UTC
tags: Web, Development, JavaScript
published: true
secret: false
---

[Next.js][] is a JavaScript framework created by [ZEIT][] that lets you build server-side rendered and static web applications using React. It has many great features and advantages, which might make Next.js your first option for building your next web application.

In this blog post, we will show you how to open a PDF in your Next.js application in a matter of minutes.

READMORE

## Setting Up Next.js

We can use [`create-next-app`][create-next-app] to start a new Next.js project by running the following:

```shell
npm i -g create-next-app
create-next-app
```

It will ask for the project name and create a directory with that name. Once inside that directory, we can run `npm run dev` to start the development server, and we can load the page on `http://localhost:3000`. Now our next goal is to integrate PSPDFKit into our application.

## Integrating PSPDFKit

The first thing we will need before integrating PSPDFKit into our application is the license key. If you are not an existing customer, you can easily [obtain a free trial license key][trial]. Once we have the license key, we have to make its value accessible in the app. For this, we will pass a custom configuration to the Next.js application.

We can create a file named `license-key` at the root and then pass `PSPDFKIT_LICENSE_KEY` as an environment variable to make sure its value is available to our web app. To do this, we will have to create a new file named `next.config.js` (Next.js’ custom configuration) at the root of the project folder where `package.json` is located. The code will look like this:

```javascript
// next.config.js

const webpack = require("webpack");
const fs = require("fs");

const licenseKey = fs
  .readFileSync("./license-key")
  .toString()
  .replace(/\s/g, "");

module.exports = {
  env: {
    PSPDFKIT_LICENSE_KEY: licenseKey
  }
};
```

When we run the build after creating this file, webpack replaces all occurrences of `process.env.PSPDFKIT_LICENSE_KEY` in our app with their respective values at the build time. Now we can use the new license key to initialize PSPDFKit for Web.

In order for PSPDFKit for Web to work, we also have to copy the directory containing all the required library files (artifacts) to the `public` folder. We can use the following command to do this:

```shell
cp -R ./node_modules/pspdfkit/dist/pspdfkit-lib ./public
ls ./public # -> pspdfkit-lib
```

Alternatively, we can add the copy command as a `postinstall` hook in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "start": "next start",
    "build": "next build",
    "postinstall": "cp -R ./node_modules/pspdfkit/dist/pspdfkit-lib ./public"
  }
}
```

This means that every time we install the `pspdfkit` package from npm, the `pspdfkit-lib` directory will automatically get copied from the `node_modules` folder to the `public` folder.

By default, PSPDFKit assumes that the assets folder is present in the same folder of our application module, but in our case, we have kept it inside the `public` folder, so we will have to pass a `baseUrl` option while initializing PSPDFKit. In `pages/index.js`, we will load PSPDFKit with the required options (to view all the options, [visit our API documentation][configuration options]). Make sure you put your PDF file (in this case, `example.pdf`) in the `public` folder too. Now we are ready to initialize PSPDFKit in `pages/index.js`:

```jsx
// pages/index.js

import React, { useEffect } from "react";

export default function() {
  const containerRef = useRef(null);

  useEffect(() => {
    let instance, PSPDFKit;
    (async function() {
      PSPDFKit = await import("pspdfkit");
      instance = await PSPDFKit.load({
        container: containerRef.current,
        pdf: "/example.pdf",
        licenseKey: process.env.PSPDFKIT_LICENSE_KEY,
        baseUrl: `${window.location.protocol}//${window.location.host}/`
      });
    })();

    return () => PSPDFKit && PSPDFKit.unload(containerRef.current);
  }, []);

  return <div ref={containerRef} style={{ height: "100vh"}}/>
  );
}
```

In the snippet above, `PSPDFKit.load` is called with a configuration object where we define:

- `baseUrl`, which is where our assets are available.
- `pdf`, which is the relative URL for our example PDF file. You can also pass the [`ArrayBuffer`][] of our file.
- `container`, which is where we mount PSPDFKit.
- `licenseKey`, which is where we write your license key.

The above code uses Hooks. In case you are not familiar with Hooks, you can read about them [on the official React website][].

We asynchronously import PSPDFKit inside of a `useEffect` hook after the page has mounted. This way, we ensure that our initial bundle size is not large, thereby resulting in better perceived load time and the library loading only on the browser (since PSPDFKit is a client-side library).

## Opening a Local PDF

PSPDFKit for Web can also open local PDF files. In such a case, the `pdf` configuration option should be an `ArrayBuffer` of our file.

To open a file, we need to create a [file picker][] and, when selecting a file, convert it to `ArrayBuffer` using the FileReader API (see an [example here][filereader api]).

Once we have the PDF in the `ArrayBuffer` format, we can call `PSPDFKit.load` with it.

## Wrapping Up

Our final folder structure will look like this:

```
pspdfkit-next-js-example
├─ license-key
├─ next.config.js
├─ package.json
├─ pages
│  └─ index.js
├─ public
│  ├─ example.pdf
│  └─ pspdfkit-lib
└─ yarn.lock
```

We can now start the server by running `npm run dev`, and if everything works as expected, we will be able to see PSPDFKit running at `http://localhost:3000`.

You can find the source code of this example [on GitHub][next.js pspdfkit example source code].

## Conclusion

With just a few lines of code, we were able to utilize the full power of PSPDFKit in a Next.js application. This is a great way to get started with handling PDFs inside a Next.js application.

[PSPDFKit for Web][] can help you add advanced PDF capabilities to your app. Together with [PSPDFKit Instant][], we offer an enterprise-ready PDF solution for web browsers and other platforms, along with industry-leading first-class support included with every plan. Check out our [demo][pspdfkit for web catalog] to see PSPDFKit for Web in action.

[next.js]: https://nextjs.org
[zeit]: https://zeit.co/
[create-next-app]: https://github.com/zeit/next.js#setup
[trial]: http://pspdfkit.com/try
[licensing]: https://pspdfkit.com/guides/web/current/pspdfkit-for-web/licensing/
[configuration options]: https://pspdfkit.com/api/web/PSPDFKit.Configuration.html
[dynamic import]: https://github.com/tc39/proposal-dynamic-import
[`arraybuffer`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
[on the official react website]: https://reactjs.org/docs/hooks-intro.html
[file picker]: https://github.com/PSPDFKit/pspdfkit-web-example-webpack/blob/ea15cb3bb20aadab428eb51edc20db402a6fd968/src/lib/file-picker.js
[filereader api]: https://github.com/PSPDFKit/pspdfkit-web-example-webpack/blob/ea15cb3bb20aadab428eb51edc20db402a6fd968/src/lib/utils.js#L12-L19
[dynamic import]: https://github.com/tc39/proposal-dynamic-import
[next.js pspdfkit example source code]: https://github.com/PSPDFKit/pspdfkit-web-example-nextjs
[pspdfkit instant]: https://pspdfkit.com/instant/
[pspdfkit for web catalog]: https://web-examples.pspdfkit.com/
[pspdfkit for web]: https://pspdfkit.com/pdf-sdk/web/
