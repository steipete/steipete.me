---
title: "2019: Year in Review"
description: "With 2020 just around the corner, we wanted to reflect on the past year."
preview_image: /images/blog/2019/2019-in-review/article-header.png
section: blog
author:
  - Jonathan Rhyne
author_url:
  - https://twitter.com/jdrhyne
date: 2019-12-30 12:00 UTC
tags: Company
published: true
secret: false
---

With 2019 coming to a close, we wanted to take the time to look back on the year. Our mission has always been to help our customers deliver superior software through excellent products and phenomenal support. But while some companies focus on documents or productivity, our focus from the beginning has always been solely on developers, and 2019 was no different. We took meaningful strides in furthering our mission through releasing new products, continuously improving existing offerings, and most importantly ensuring we were always there if or when our customers ran into any issues or needed help.

[![Company Picture in Barcelona](/images/blog/2019/2019-in-review/team-picture-barcelona-2019.jpg)](https://www.instagram.com/p/B3sC6pCg_UF/)

In 2019, we released new products, added new components and features to existing platforms, spoke at developer conferences around the world, met up in Barcelona and Vienna, and continued contributing back to our developer communities through [code proposals][] and [bug fixes][contributing to google’s pdfium] and through [our blog][]. Have a look below!

## New Products

- [PSPDFKit for Mac Catalyst][]
- [PDF Viewer for Mac][]
- [PSPDFKit Libraries][]
- [Document Editor for Web & Windows][]
- [Form Designer for Web][]
- [Flutter Wrapper][]

## Touring the World

<img src="/images/blog/2019/2019-in-review/2019-conferences.png" usemap="#worldmap">

<map name="worldmap">

</map>

## Exciting New Customers

![Photo of new customer logos](/images/blog/2019/2019-in-review/2019-new-customers.png)

## PSPDFKit in Numbers

![Pull Requests Closed: 4270](/images/blog/2019/2019-in-review/2019-pull-requests.png)
![Changelog Entries: 1829](/images/blog/2019/2019-in-review/2019-changelog-entries.png)
[![Blog Posts: 158](/images/blog/2019/2019-in-review/2019-blog-posts.png)](/blog/2019/)
![SDK Releases: 66](/images/blog/2019/2019-in-review/2019-sdk-releases.png)
![Viewer Releases: 42](/images/blog/2019/2019-in-review/2019-pdf-viewer-releases.png)

## Retreats

[![Company Retreat in Vienna](/images/blog/2019/2019-in-review/team-building.jpg)](https://www.instagram.com/p/BuLcCSZhCy9/)

We think remote work is the future, especially for software engineer teams. Because our team is distributed throughout the world, [we find it extremely important to meet up][retreat importance] twice a year to have face time, collaborate on the future of our company, and work, but most importantly to build friendships and memories. This year, we all got together in Vienna for our winter retreat and sunny Barcelona for our summer retreat.

## Awesome New Features

<img src="/images/blog/2019/2019-in-review/2019-new-features.png" usemap="#featuremap">

<map name="featuremap">
	<area shape="rect" alt="Custom Data for PDF Annotations" title="Custom Data for PDF Annotations" coords="0,0,660,660" href="/blog/2019/custom-annotation-data/" target="" />
	<area shape="rect" alt="PSPDFKit 9 for iOS" title="PSPDFKit 9 for iOS" coords="667,0,1981,660" href="/blog/2019/pspdfkit-ios-9/#dark-mode" target="" />
	<area shape="rect" alt="The All New PSPDFKit-Cordova Plugin" title="The All New PSPDFKit-Cordova Plugin" coords="0,673,660,1328" href="/blog/2019/pspdfkit-cordova/" target="" />
	<area shape="rect" alt="JavaScript for Standalone Deployments" title="JavaScript for Standalone Deployments" coords="667,673,1328,1328" href="/blog/2019/pspdfkit-web-2019-5/#javascript-for-standalone-deployments" target="" />
	<area shape="rect" alt="Annotation Rotation" title="Annotation Rotation" coords="1338,673,1994,1328" href="/blog/2019/pspdfkit-ios-8-3/#annotation-rotation" target="" />
	<area shape="rect" alt="Docker Hub and npm" title="Docker Hub and npm" coords="0,1341,660,1994" href="/blog/2019/pspdfkit-web-2019-5/#docker-hub-and-npm" target="" />
  <area shape="rect" alt="Multithreaded Rendering" title="Multithreaded Rendering" coords="667,1341,1994,1994" href="/blog/2019/pspdfkit-android-5-2/#multithreaded-rendering" target="" />
</map>

## Inside PSPDFKit

Our must-read blog posts from the year are:

- [Contributing to Google’s PDFium][]
- [How We Work at PSPDFKit][]
- [The Many Benefits of Using a Monorepo][]
- [WebAssembly and Emscripten Chat with Alon Zakai][]
- [Writing and Maintaining Good Code Documentation][]

And yes, we played around with JavaScript again and created a [Tic-Tac-Toe game in PDF][]!

## A New Decade!

We want to thank all of our customers and partners — without whom none of this would’ve been possible — for choosing and relying on us to help them build excellent applications. It is so inspiring, year after year, to see the amazing products we are integrated in and to have the feeling of contributing to just a small part of those efforts. Thank you for giving us that opportunity and your trust.

While the second decade of the 21st century saw the birth and growth of PSPDFKit, we believe the next decade holds so much more. We have massive plans for 2020 and have already begun investing in what we believe the future will look like in five years. We know developers will have a massive say in what that future looks like, and we are eager to be there side by side helping them build it.

<script>
	/*! Image Map Resizer (imageMapResizer.min.js ) - v1.0.7 - 2018-05-01
 *  Desc: Resize HTML imageMap to scaled image.
 *  Copyright: (c) 2018 David J. Bradshaw - dave@bradshaw.net
 *  License: MIT
 */

!function(){"use strict";function a(){function a(){function a(a,d){function e(a){var d=1===(f=1-f)?"width":"height";return c[d]+Math.floor(Number(a)*b[d])}var f=0;j[d].coords=a.split(",").map(e).join(",")}var b={width:l.width/l.naturalWidth,height:l.height/l.naturalHeight},c={width:parseInt(window.getComputedStyle(l,null).getPropertyValue("padding-left"),10),height:parseInt(window.getComputedStyle(l,null).getPropertyValue("padding-top"),10)};k.forEach(a)}function b(a){return a.coords.replace(/ *, */g,",").replace(/ +/g,",")}function c(){clearTimeout(m),m=setTimeout(a,250)}function d(){l.width===l.naturalWidth&&l.height===l.naturalHeight||a()}function e(){l.addEventListener("load",a,!1),window.addEventListener("focus",a,!1),window.addEventListener("resize",c,!1),window.addEventListener("readystatechange",a,!1),document.addEventListener("fullscreenchange",a,!1)}function f(){return"function"==typeof i._resize}function g(a){return document.querySelector('img[usemap="'+a+'"]')}function h(){j=i.getElementsByTagName("area"),k=Array.prototype.map.call(j,b),l=g("#"+i.name)||g(i.name),i._resize=a}var i=this,j=null,k=null,l=null,m=null;f()?i._resize():(h(),e(),d())}function b(){function b(a){if(!a.tagName)throw new TypeError("Object is not a valid DOM element");if("MAP"!==a.tagName.toUpperCase())throw new TypeError("Expected <MAP> tag, found <"+a.tagName+">.")}function c(c){c&&(b(c),a.call(c),d.push(c))}var d;return function(a){switch(d=[],typeof a){case"undefined":case"string":Array.prototype.forEach.call(document.querySelectorAll(a||"map"),c);break;case"object":c(a);break;default:throw new TypeError("Unexpected data type ("+typeof a+").")}return d}}"function"==typeof define&&define.amd?define([],b):"object"==typeof module&&"object"==typeof module.exports?module.exports=b():window.imageMapResize=b(),"jQuery"in window&&(jQuery.fn.imageMapResize=function(){return this.filter("map").each(a).end()})}();
//# sourceMappingURL=imageMapResizer.map
imageMapResize();
</script>

[code proposals]: https://pspdfkit.com/blog/2018/tips-for-contributing-to-the-swift-language/
[our blog]: https://pspdfkit.com/blog/
[pspdfkit for mac catalyst]: /blog/2019/pspdfkit-for-mac-catalyst/
[pdf viewer for mac]: https://pdfviewer.io/blog/2019/pdf-viewer-for-mac/
[pspdfkit libraries]: /blog/2019/introducing-pspdfkit-libraries/
[document editor for web & windows]: /blog/2019/pspdfkit-web-2019-4/#document-editor
[form designer for web]: /blog/2019/pspdfkit-web-2019-5/#form-designer
[flutter wrapper]: /blog/2019/getting-started-with-pspdfkit-flutter/
[the many benefits of using a monorepo]: /blog/2019/benefits-of-a-monorepo/
[contributing to google’s pdfium]: /blog/2019/contributing-to-pdfium/
[how we work at pspdfkit]: /blog/2019/how-we-work/
[tic-tac-toe game in pdf]: /blog/2019/create-pdf-game-tic-tac-toe-javascript/
[barcelona]: https://www.instagram.com/p/B3sC6pCg_UF
[importance of retreats]: /blog/2016/the-importance-of-retreats-for-a-remote-company/
[webassembly and emscripten chat with alon zakai]: /blog/2019/webassembly-emscripten-chat-alon-zakai/
[writing and maintaining good code documentation]: /blog/2019/writing-and-maintaining-good-code-documentation/
[retreat importance]: /blog/2016/the-importance-of-retreats-for-a-remote-company/
