---
title: "Deploy a WebAssembly-Based PDF Viewer to the Cloud with One Command"
description: "In this blog post, we show how easy it is to deploy our standalone, WebAssembly-powered version of PSPDFKit for Web to ZEIT’s now.sh, a cloud provider."
preview_image: /images/blog/2018/deploy-webassembly-pdf-viewer-to-zeit-now-sh/article-header.png
section: blog
author:
  - Giuseppe Gurgone
author_url:
  - https://twitter.com/giuseppegurgone
date: 2018-03-14 12:00 UTC
tags: Web, Development, Web Assembly, Infrastructure
published: true
---

At PSPDFKit, we love to explore new technologies and invest in them as soon as we see how they could bring tangible benefits to our product, our customers, and us as developers.

This is why, in early 2017, we started to work on a serverless, WebAssembly-based version of our PDF web framework and viewer. Only a few months later, we were able to ship a production-ready version of it, which made PSPDFKit for Web one of the first commercially available web products to utilize this new technology. We wrote about [our journey into adopting this technology](https://pspdfkit.com/blog/2017/webassembly-a-new-hope) in case you are curious about the specifics.

In this article, we will show you how easy it is to deploy our WebAssembly-powered version of PSPDFKit for Web to the cloud.

For the sake of simplicity, we will deploy to ZEIT’s now.sh — a cloud service provider that allows deployment from the command line with just one command: `now`.

As is standard in all of the best cooking shows on television, I have an already prepared ~~cake~~ [deployment link](https://example-now-sh-ljvijsojro.now.sh/) for you. Feel free to try it out before we proceed with the technical step-by-step guide.

## Prerequisites

Before you start, make sure you have Node.js and npm installed.

### PSPDFKit for Web and License Key

Simply [request a demo key](https://pspdfkit.com/try), after which you will receive an email with a link to our site. Please click on it and then go to the [Install with npm instructions page](https://pspdfkit.com/guides/web/current/standalone/adding-to-your-project/#install-with-npm), which is where you will find your npm installation link. You will also find your license key at [this URL](https://pspdfkit.com/guides/web/current/standalone/integration/#example-application).

If you are already a customer, go to the [customer portal](https://customers.pspdfkit.com) and retrieve your npm installation link. You will also find your product license key here, which you will need to run the application.

In both cases, the npm installation link has the following format (where `UNIQUE_CUSTOMER_NPM_KEY` changes for each customer):

```
https://customers.pspdfkit.com/npm/TRIAL-UNIQUE_CUSTOMER_NPM_KEY/latest.tar.gz
```

### now.sh Account

To deploy with `now`, you will need a ZEIT account. You can create one for free on the [ZEIT website](https://zeit.co/login).

Once you have an account, make sure you open your terminal and install the `now` CLI with `npm i -g now`.

## Creating a Simple Application with PSPDFKit for Web

Create a folder for your project and initialize it:

```shell
mkdir ~/pspdfkit-app
cd ~/pspdfkit-app
npm init --yes
```

Install PSPDFKit for Web using your `npm` link:

[==
```yarn
yarn add https://customers.pspdfkit.com/npm/TRIAL-UNIQUE_CUSTOMER_NPM_KEY/latest.tar.gz
```

```npm
npm install https://customers.pspdfkit.com/npm/TRIAL-UNIQUE_CUSTOMER_NPM_KEY/latest.tar.gz
```
==]

Copy an `example.pdf` file into the same folder and create a new `index.html` file with the following content:

```html
<!doctype html>
<meta charset="utf-8">
<title>PSPDFKit for Web</title>

<style>
  body { margin: 0 }
  html, body, #root { height: 100% }
  #root { width: 100% }
</style>

<div id="root"></div>

<script src="./node_modules/pspdfkit/dist/pspdfkit.js"></script>
<script>
  PSPDFKit.load({
    container: '#root',
    licenseKey: 'YOUR PRODUCT LICENSE KEY GOES HERE',
    pdf: './example.pdf'
  });
</script>
```

Please make sure you replace `YOUR PRODUCT LICENSE KEY GOES HERE` with your actual license key.

Finally, to run the application, you will need to install a simple web server:

[==
```yarn
yarn add serve
```

```npm
npm install serve
```
==]

Then add a `start` script to the `package.json` file:

```json
"scripts": {
  "start": "serve"
}
```

Try to execute `npm start` locally to check out the application.

That’s it! This is really all you need to get a full-fledged PDF reader.

## Deploying to now

Let’s deploy our application to the cloud!

Open up your terminal and type `cd` into your project folder. For example:

```shell
cd ~/pspdfkit-app
```

Make sure you are logged in to ZEIT:

```shell
now login
```

From within the same folder, type `now` to start a deployment:

```shell
now
```

<video src="/images/blog/2018/deploy-webassembly-pdf-viewer-to-zeit-now-sh/pspdfkit-now.mp4"  width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>


Once the deployment is done, `now` will copy the URL to the clipboard.

Are you ready for this? Let’s open the link in a web browser and see it in action!

Cool, right!?

## Conclusion

In this blog post, you saw how it took us just a few minutes to set up a minimal PDF viewer application that runs on a web browser, without the need for any server component! And all of this thanks to WebAssembly and PSPDFKit for Web.

In addition to being an excellent PDF Viewer, PSPDFKit for Web comes with a [rich API](https://pspdfkit.com/api/web/) to customize appearance, behavior, and content. The product is fully responsive and provides all features on desktop as well as tablet or mobile views. All modules can be used independently from your current backend and frontend languages, and we provide [example projects](https://pspdfkit.com/guides/web/current/pspdfkit-for-web/example-projects/) for you to try out.
