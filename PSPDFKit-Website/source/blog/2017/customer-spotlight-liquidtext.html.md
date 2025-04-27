---
title: "Customer Spotlight: High-Performance PDF Rendering for LiquidText"
description: A Case Study with LiquidText.
preview_image: /images/blog/2017/customer-spotlight-liquidtext/preview.png
section: blog
author:
  - Jonathan Rhyne
author_url:
  - https://twitter.com/jdrhyne
date: 2017-12-1 12:00 UTC
tags: Customers, Company, iOS
published: true
---

[LiquidText](http://liquidtext.net/) is a unique content analysis platform for iPad. It helps professionals and students gather information, visualize and connect it, and distill it down to what matters.

LiquidText’s accolades are many, including:

* Apple’s Most Innovative iPad App of 2015
* Apple App Store Editors’ Choice
* Apple’s Best iPad App of September 2015
* Time Magazine’s 10 Best Apps for iPad Pro

In addition to the awards above, LiquidText has been reviewed positively in publications such as TechCrunch, MacStories, Mashable, MacSparky, Macworld, The Next Web, and The Brooks Review.

READMORE

[![LiquidText App Store Editor's Choice](/images/blog/2017/customer-spotlight-liquidtext/preview.png)](http://liquidtext.net/)

## The Beginning

The idea for [LiquidText](http://liquidtext.net/) came about when creator [Craig Tashman](https://twitter.com/CraigTashman) was doing a Ph.D. in computer science at Georgia Tech. His doctoral work revolved around attempting to discover a better way to read paper-like documents on the computer. The four-year research project — which took place through studies, interviews, observations, and prototyping — created a content consumption platform built around human cognitive needs, as opposed to merely imitating paper in a digital format.

The final LiquidText prototype, built on Microsoft Windows, emerged as a radically better way to read, organize, connect, and understand content.

![Craig Tashman](/images/blog/2017/customer-spotlight-liquidtext/craig.jpg)

## The Problem

When LiquidText decided to build a consumer product for the iPad, the team realized it needed a PDF renderer, as one of LiquidText’s key formats is PDF. More specifically, it needed a way to parse and render PDFs at breathtakingly high speed, while also rendering those PDFs with all of the unique distortions, transforms, and overlays it created for the prototype. The catch was that this renderer needed to be general in nature in order to be successfully integrated into the team’s algorithms and capable of tackling situations the algorithm couldn’t account for on its own. This set the bar high, as the framework had to perform exceptionally fast and remain incredibly stable.

## The Solution

<iframe width="700" height="394" src="https://www.youtube-nocookie.com/embed/sfPEi5BSyHU?rel=0&amp;controls=0" frameborder="0" allowfullscreen></iframe>

The engineering-heavy LiquidText team explored several solutions, including repurposing an open source PDF renderer, licensing the code from an existing PDF reader, and developing its own PDF rendering layer from scratch.

But eventually, the team landed upon PSPDFKit for several reasons:

Generality — PSPDFKit was designed by a team that understands how to build an API. With LiquidText, the team needed to not only build algorithms around PSPDFKit, but also significantly alter its logic, add elements to it, and remove elements from it. The LiquidText team was extremely impressed that there was a safe, official way to inject its own modules into the heart of PSPDFKit to change its behavior at the most basic level. The team was similarly delighted to see that PSPDFKit is so modular that changing the core code did not break it or hurt performance.

<blockquote>
  <p class="mb-2">
    “Had we instead repurposed a PDF reader, we could well have spent weeks just building the right abstraction layers.”
  </p>
  <footer class="blockquote-footer">
    Craig Tashman, founder of LiquidText
  </footer>
</blockquote>

Speed — For the interactions to work, they needed to be in real time. Through a well-thought-out mix of caching and multithreading, PSPDFKit delivered that speed. And when LiquidText pushed the framework past the limits of the hardware, it degraded gracefully using progressive rendering so that the user was almost never seeing a blank page.

Stability — With a complex, algorithm-heavy app and a small team, LiquidText had no time to worry about debugging other people’s APIs. With PSPDFKit, they haven’t had to.

> “Even at the limits of performance, and with huge documents, PSPDFKit is stable, consistent, and reliable. Since launch, we have continued to be happy with our choice of PSPDFKit,” Tashman said. “In the end, it’s done what we hoped: let us abstract PDF rendering and focus on building LiquidText.”

[![LiquidText App Store Editor's Choice](/images/blog/2017/customer-spotlight-liquidtext/liquidtext-awards.jpg)](http://liquidtext.net/)
