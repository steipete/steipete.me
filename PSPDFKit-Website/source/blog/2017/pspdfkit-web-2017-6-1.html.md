---
title: "PSPDFKit for Web 2017.6.1"
description: Announcing PSPDFKit for Web 2017.6.1, with full support for Internet Explorer 11 when using the standalone deployment option.
preview_image: /images/blog/2017/pspdfkit-web-2017-6-1/ie11.png
section: blog
author:
  - Philipp Spiess
author_url:
  - https://twitter.com/PhilippSpiess
date: 2017-10-02 12:00 UTC
tags: Web, Products
---

Today we release PSPDFKit for Web 2017.6.1 with full support for Internet Explorer 11 when using the [standalone deployment option][]. We invested heavily in optimizing performance, so we could meet our criteria for a great user experience. A list of all the included fixes can be found in our [changelog][].

READMORE

## Full Support for Internet Explorer 11

In July 2017, we released PSPDFKit for Web [2017.5][]. For the first time, Web included the option for standalone deployments, where rendering and processing happens completely client-side. Standalone deployment works on all modern browsers - using [WebAssembly][] with a fall-back to [asm.js][] if necessary. Until now, we did not support Internet Explorer 11 due to the performance of our asm.js core not meeting our criteria for a great user experience.

<img src="/images/blog/2017/pspdfkit-web-2017-6-1/ie11.png" alt="PSPDFKit for Web 2017.6.1 adds full support for Internet Explorer 11 when using the standalone deployment option." style="max-width: 1054px; width: 100%;" />

IE 11 was released in 2013 and is the last version of Internet Explorer that hasn’t reached [‘End Of Life’][] yet. While most businesses already migrated to Microsoft Edge, it is not available on Windows 7, which still has significant market share. Because of this, support for Internet Explorer will continue to be a requirement for many use cases.

We have invested heavily in performance optimization until we managed to achieve the great user experience we expect from our products. We're proud to release PSPDFKit for Web 2017.6.1, with full support for Internet Explorer 11, even on Windows 7.

Like with all of our releases, we also include several bug fixes and updated our [guides][]. Check out our [changelog] for a full list of changes.


[standalone deployment option]: https://pspdfkit.com/guides/web/current/standalone/overview/
[changelog]: /changelog/web/#2017.6.1
[asm.js]: http://asmjs.org/faq.html
[WebAssembly]: https://pspdfkit.com/blog/2017/webassembly-a-new-hope/
[2017.5]: https://pspdfkit.com/blog/2017/pspdfkit-web-2017-5/
[‘End Of Life’]: https://www.microsoft.com/en-us/WindowsForBusiness/End-of-IE-support
[guides]: https://pspdfkit.com/guides/web/current/pspdfkit-for-web/browser-support/
