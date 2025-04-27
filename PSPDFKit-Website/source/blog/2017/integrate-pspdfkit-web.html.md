---
title: "How to Add PDF Support to Your Web App in No Time"
description: "A step-by-step tutorial on how to display and annotate PDF files inside your web app using the PSPDFKit JavaScript library."
preview_image: /images/blog/2017/integrate-pspdfkit-web/cover.png
section: blog
author:
  - Martin Schurrer
author_url:
  - https://twitter.com/MSch
date: 2017-11-01 12:00 UTC
tags: Web, Development
cta: email_course
published: true
---

PDF files are ubiquitous in many business processes today: From contracts and order forms to schematics and blueprints, PDF has become one of the common interchange formats that gets everyone on the same page.

And while more and more business software is being written with web technologies, PDF files are not as tightly integrated with web apps as they could be, often resulting in less efficient workflows for end users.

In fact, the [PDF format](https://en.wikipedia.org/wiki/Portable_Document_Format) (originally developed by Adobe, and now an open standard) was _designed_ to be integrated into other systems, supporting a wide range of features that make it perfect for modeling all types of business processes.

[**PSPDFKit for Web**](https://pspdfkit.com/pdf-sdk/web/) aims to bring this power to the web. It’s a drop-in JavaScript library that enables viewing and annotating PDF files in the browser without any plugins. It works on both mobile and desktop, and it supports all modern browsers, including IE 11.

---

## Getting Started with PSPDFKit for Web

This tutorial will show you how to add **PSPDFKit for Web** to a React application to display a fully interactive PDF in the browser. Here’s what we’re going to build:

![](/images/blog/2017/integrate-pspdfkit-web/demo.png)

---

#### Prerequisites

To follow along, you’ll need these things:

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [A PDF file](https://github.com/PSPDFKit/pspdfkit-web-example-react/raw/master/public/example.pdf)

A more advanced version of the code for this tutorial is available on GitHub:<br> [https://github.com/PSPDFKit/pspdfkit-web-example-react](https://github.com/PSPDFKit/pspdfkit-web-example-react)

---

#### Get a Trial License

**PSPDFKit for Web** is a commercial product, so you’ll need to visit [pspdfkit.com/try](https://pspdfkit.com/try/) for a trial license and the **npm package url** and **license key** you’ll need later.

---

#### Create a React App

Now that we have our license details, we’ll use [`create-react-app`](https://github.com/facebookincubator/create-react-app) to scaffold out a simple React application:

[==
```yarn
yarn global add create-react-app
create-react-app pspdfkit-react-example
cd pspdfkit-react-example
```

```npm
npm install -g create-react-app
create-react-app pspdfkit-react-example
cd pspdfkit-react-example
```
==]

Now let’s add **PSPDFKit for Web** as a dependency. Note that you’ll need to replace `<your-npm-package-url>` with the **npm package url** you obtained earlier:

[==
```yarn
yarn add <your-npm-package-url>
```

```npm
npm install --save <your-npm-package-url>
```
==]

While we’re setting things up, let’s also save the PDF we’ll be using into the `/public` folder:

```shell
curl https://raw.githubusercontent.com/PSPDFKit/pspdfkit-web-example-react/master/public/example.pdf > public/example.pdf
```

As we’re using the [WebAssembly](https://pspdfkit.com/blog/2017/webassembly-a-new-hope/) build of **PSPDFKit for Web**, the final setup step is to copy over some files from the npm module that the browser will need:

```shell
cp -R ./node_modules/pspdfkit/dist/pspdfkit-lib ./public
```

---

#### Add a Component

Now let’s add a `PSPDFKitComponent` that imports `pspdfkit` as a dependency:

```src/PSPDFKitComponent.js
import React, { Component } from 'react';
import PSPDFKit from 'pspdfkit';

class PSPDFKitComponent extends Component {
  render() {
    return (
      <div ref="container" />
    );
  }
}

export default PSPDFKitComponent;
```

---

#### Load a PDF

To load **PSPDFKit for Web** into our `PSPDFKitComponent`, we use `PSPDFKit#load` when our component has mounted. Note that you’ll need to replace `<your-license-key>` with the **license key** you obtained earlier:

```src/PSPDFKitComponent.js
import React, { Component } from 'react';
import PSPDFKit from 'pspdfkit';

// This tells PSPDFKit for Web where our WebAssembly files are located:
const baseUrl = `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`;

class PSPDFKitComponent extends Component {
  componentDidMount() {
    PSPDFKit.load({
      pdf: this.props.pdfUrl,
      container: this.refs.container,
      licenseKey: '<your-license-key>',
      baseUrl: baseUrl
    })
      .then(instance => {
        console.log("Successfully mounted PSPDFKit", instance);
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  render() {
    return (
      <div ref="container" style={{width: '100%', height: '100%', position: 'absolute'}} />
    );
  }
}

export default PSPDFKitComponent;
```

---

#### Render Our Component

Now all that’s left is to render our `PSPDFKitComponent` in `App.js`, loading the PDF we downloaded earlier:

```src/App.js
import React, { Component } from 'react';
import PSPDFKitComponent from './PSPDFKitComponent';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App" style={{width: '100%', height: '100%', position: 'absolute'}}>
        <PSPDFKitComponent pdfUrl={'/example.pdf'} />
      </div>
    );
  }
}

export default App;
```

Start the app (if you didn’t already) and view it in the browser:

[==
```yarn
yarn start
```

```npm
npm start
```
==]

You should now see your PDF rendered into the `#container` element. Try using the toolbar to navigate, annotate, and search the document.

---

## Conclusion

I hope this tutorial has demonstrated how easy it is to add PDF support to your web app, and that it gives you ideas on how more business problems could be solved using PDF and the web platform. Learn more about [PSPDFKit for Web](https://pspdfkit.com/pdf-sdk/web/), see the [finished source code](https://github.com/PSPDFKit/pspdfkit-web-example-react) for this tutorial, or check out our other example projects for [Node.js](https://github.com/pspdfkit/pspdfkit-server-example-nodejs) and [Rails](https://github.com/pspdfkit/pspdfkit-server-example-rails).
