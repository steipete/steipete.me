---
title: "PWA — Progressive Web Applications"
description: "PSPDFKit for Web and Progressive Web Applications: an open source example and guide."
preview_image: /images/blog/2018/pwa/article-header.png
section: blog
author:
  - Giuseppe Gurgone
author_url:
  - https://twitter.com/giuseppegurgone
date: 2018-09-25 10:00 UTC
tags: Web, Development, Performance, Offline
published: true
secret: false
---

In the past few years, the Web platform has been adopted to build richer web applications for a number of targets, including mobile and desktop. As a response to this trend, browser vendors have been working to come up with a set of guidelines and APIs that let users turn their applications into Progressive Web Apps that behave more like native ones.

The term Progressive Web Apps (PWAs) was coined by Alex Russell (Google) and Frances Berriman, and usually it is used to describe applications that, building on the Web platform foundation, use advanced browser APIs to enhance an application’s behavior and provide more native-like experiences.

Google describes PWAs as:

- Reliable — They load instantly even in uncertain network conditions or when offline.
- Fast — They respond quickly to user interactions with no janky scrolling.
- Engaging — They feel like a natural application on the device, and they have an immersive user experience.

To help teams working on PWAs, Google compiled [a comprehensive checklist][] listing all the requirements for going from a Baseline PWA to an Exemplary PWA.

Checking if a web application meets the standard of PWAs is very easy. Lighthouse from Google ships with an ad-hoc _Progressive Web App_ audit that can be run via Chrome Developer Tools. It is located in the _Audits_ panel of Chrome Developers Tools. Needless to say, we highly recommend you check it out and audit your web application!

<img src="/images/blog/2018/pwa/lighthouse.png" alt="Audit panel in Chrome Developers Tools" />

Progressive Web Applications are a great choice for many companies due to their easy-to-port and multi-platform nature.

We have seen an increasing interest in PWAs from our customers, and in the last year, both a number of unofficial “app stores” (like [Appscope][]) and better tooling have come to life.

## PSPDFKit for Web and PWAs

PSPDFKit for Web is a single-page application that is capable of rendering and modifying PDF documents with a server component, or thanks to WebAssembly, even in the browser.

It already comes with a number of optimizations around performance and engagement that make it feel snappy and as close to a mobile application as possible.

However, since our application is an SDK that runs on the host (customer) webpage or application, it doesn’t come with built-in offline support (service workers) and storage mechanisms... <u>yet</u>. Any non-sophisticated attempt to register a service worker would likely break our customers’ app registrations.

While in the future we might add built-in offline capabilities, right now it’s already very easy to integrate PSPDFKit for Web so that it behaves like a PWA. In fact, most of the time, precaching all of the PSPDFKit for Web assets with a service worker and providing in-browser storage for PDF documents using IndexedDB is enough to get a Baseline PWA experience.

Although some of our customers have already integrated PSPDFKit for Web in their PWAs, we thought it would be valuable to provide an example and a guide to successfully building a Baseline PWA.

### A Progressive Web Application Example and Guide

That said, today we are open sourcing an example PWA that integrates PSPDFKit for Web.

You can try it out [here][pwa example] and check out its source code on [GitHub][pwa source code].

We also wrote [a companion guide][] to walk you through the making of a simple Baseline PWA.

Please check both out and don’t hesitate to provide any feedback! This can be done via a [GitHub issue][] or through our [support contact form][].

[a comprehensive checklist]: https://developers.google.com/web/progressive-web-apps/checklist
[appscope]: https://appsco.pe
[pwa example]: https://pspdfkit.com/pwa
[pwa source code]: https://github.com/PSPDFKit/pspdfkit-web-example-pwa
[a companion guide]: /guides/web/current/pspdfkit-for-web/create-offline-progressive-web-applications
[GitHub issue]: https://github.com/PSPDFKit/pspdfkit-web-example-pwa/issues/new
[support contact form]: https://support.pspdfkit.com/hc/en-us/requests/new
