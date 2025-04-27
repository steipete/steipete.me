---
title: "Theming PSPDFKit for Web"
description: "We look at how easy it is to theme PSPDFKit for Web to fit your web app’s style."
preview_image: /images/blog/2018/theming-pspdfkit-for-web/article-header.png
preview_video: /images/blog/2018/theming-pspdfkit-for-web/lead.mp4
section: blog
author:
- William Meleyal
author_url:
- http://meleyal.com
date: 2018-02-06 12:00 UTC
tags: Web, Development
published: true
---

Just like with our other PDF SDKs, we designed **[PSPDFKit for Web](/pdf-sdk/web/)** to look and work great out of the box, with a modern, minimal UI and sensible defaults. Of course, we also provide easy ways to customize and extend it, ensuring you can deliver a seamless experience to your end users.

In this article, we’ll show you how we did exactly that for our new [Windows app](/pdf-sdk/windows/). The UI is powered by **PSPDFKit for Web**, but we wanted to customize it to feel native and familiar on Windows. Here’s how it looks, before and after.

![PSPDFKit for Web before and after theming](/images/blog/2018/theming-pspdfkit-for-web/before-after.png)

_Note: This article presumes you have **PSPDFKit for Web** up and running. If not, you can [get a free trial here](/try/)._

First, we’ll configure **PSPDFKit for Web** to load an additional `windows.css` stylesheet when we initialize it:

```js
PSPDFKit.load({
  container: "#pspdfkit",
  pdf: "<pdf-file-path>",
  licenseKey: "YOUR_LICENSE_KEY_GOES_HERE",
  styleSheets: ["http://localhost:8000/windows.css"]
});
```

Next, we’ll use the [CSS API documentation](https://pspdfkit.com/api/web/css-Toolbar.html) to find the parts of the UI we want to theme. Here we’ll theme the toolbar and the viewport (the page background):

```css
.PSPDFKit-Toolbar {
  background: #2a579a;
}

.PSPDFKit-Viewport {
  background: #dfdfdf;
}
```

For many apps, these simple changes can be enough to make the component sit comfortably in your UI, but we’ve only scratched the surface of what’s possible — you can customize further with the [CSS API](https://pspdfkit.com/api/web/css-General.html) and provide deeper integration with the [JS API](https://pspdfkit.com/api/web/).

With growing support for [CSS variables](https://caniuse.com/#feat=css-variables), we hope to make this process even easier and offer more customization options in the future. Please do [let us know](/support/request) if you have any ideas for further improvements to the API.
