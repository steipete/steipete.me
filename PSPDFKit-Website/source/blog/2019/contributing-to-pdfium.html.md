---
title: "Contributing to Google's PDFium"
description: "A little inside look at which PDF engine we use and why."
preview_image: /images/blog/2019/contributing-to-pdfium/article-header.png
section: blog
author:
  - Peter Steinberger
  - Patrik Weiskircher
author_url:
  - https://twitter.com/steipete
  - https://twitter.com/pweisk
date: 2019-05-08 8:00 UTC
tags: Company, Development, PDFium
published: true
secret: false
---

The goal of our PSPDFKit SDKs is to parse and render every PDF out there. The format is quite complex, it has been around for a long time (since 1993!), it has gone through many revisions, and it’s always stayed backward compatible (e.g. [you can make a PDF that is also a ZIP file][truepolyglot]). This all means that parsing and rendering PDFs is a rather difficult challenge, and making a good decision about which low-level PDF engine to use is very important. That said, we want to share how we came to this decision ourselves, so let’s dive into a little bit of history of PDF rendering engines at PSPDFKit.

## Everything Started with Apple

When we started in 2010, PSPDFKit was exclusively available for [iOS][pspdfkit ios]. Already there was a lot to do, so other platforms weren’t something we thought about yet. This made the choice of which PDF engine to use simple: iOS already had [a pretty good PDF renderer][apple pdf renderer] as part of Core Graphics.

However, we quickly ran into issues. Customers sent PDFs that simply crashed deep inside Apple’s stack, including when they were opened in Apple’s mobile Safari browser or other system apps. While we were quick to write good [bug reports][] (e.g. [rdar://18501998][] and [rdar://19073954][]), bugs were solved very slowly — with some of them taking years and always requiring an update to iOS itself. And sometimes Apple fixed a bug but introduced two new ones or produced different rendering results depending upon the iOS version.

Seeing Apple’s slow update cycle, we decided that we needed to own the complete render stack and started to write a new parser/renderer in pure C. Unfortunately, in 2013, other languages that are now interesting (Rust, Swift, ...) weren’t quite up to the task, seeing as performance is critical for rendering PDF documents.

## Going Multiplatform

We started working on [PSPDFKit for Android][pspdfkit android] in early 2014, and we used a combination of C and C++ for the native backend, with Java for the model layer and UI. Writing a PDF renderer in Java would have been too slow, especially given the large amount of cheap, underpowered Android devices that are in use.

We made decent progress on our rendering engine, but we also estimated that it would take a few more years until we covered all edge cases, undocumented behavior, and instances where the specification and Adobe Acrobat differ.

Then, in May 2014, Google released [PDFium][], the PDF rendering engine in Google Chrome, as open source. It’s battle-tested and written in C++. After a detailed evaluation, we stopped working on our own rendering engine and adopted PDFium for all our products.

## Adopting Google’s PDFium

When we first looked at PDFium, it appeared to be really rough. There was barely any documentation, and there weren’t many source files. Everything was clumped together in massive files, and the simple act of deciphering how to use it was difficult. But we tried our best and discovered that while it looked rough on the outside, it actually worked really, really well. We also noticed that Google wasn’t just dropping the code and not maintaining it. The company continued working on it, smoothing out the rough edges, and fixing bugs and security vulnerabilities.

And one of the best bits? It’s written in C++. While C++ is not the favorite language of many people, it means one important thing for us: It compiles everywhere. We could use this engine on iOS and Android and have a common base.

Using an existing engine that’s been in production for years is great for security. Google Chrome is a large target, and both external security researchers and Google’s own Project Zero team put a lot of time into making sure PDFium is secure.

We’ve made many modifications to PDFium over the years. From bug fixes to performance improvements, we’ve done it all. We mark every location where we change a line to make merging from upstream easier, and these thousands of changes we’ve made have improved and tailored PDFium to our needs. We’ve also fixed many bugs and improved render fidelity to the point where our fork of PDFium is faster and renders PDF documents more correctly.

## We Can Fix Our Own Bugs

When we were using Apple’s Core Graphics renderer, there often were times when all we could do was report a bug we encountered, since Apple’s renderer is closed source. With PDFium, we have the ability to fix obscure bugs, which still come up from time to time, in PDFs ourselves. The PDF spec is vague enough and so old that we still see surprising combinations, but we can now work quickly with our partners to ensure compatibility.

## Contributing Back

We also recently started contributing some of our bug fixes back to PDFium. This was a difficult decision to make, as the quality of our PDF engine and our extensive test case database is a competitive advantage for us. But in the end, we felt it’s more important to give back than to keep these things to ourselves. This will be an ongoing process and will take some time, but ultimately it will benefit millions of Google Chrome and Android users as well. PSPDFKit’s competitive advantage is a great user interface, easy integration, an extremely customizable product, and fast, uncomplicated support.

On that note, our [first change][pdfium layer fix] has already landed on master! It deals directly with how, in certain situations, PDFium chose the wrong layer configuration when looking at a PDF, which meant the content wasn’t visible.

Another tricky problem was one where opacity wasn’t considered when painting a pattern, which meant some PDFs ended up with big, black spots that should have been transparent. This one should [go in][pdfium pattern fix] soon as well.

While contributing these changes, we also noticed that the documentation on how to actually contribute back was a little lacking, so we are trying to make this [clearer][pdfium documentation fix] for future patches. We’re inviting other companies working with PDFium to help as well — everyone will benefit if we work together.

## Summary: Good for the Customer, Good for Us!

The decision to focus on PDFium as our engine has been a win-win. It is good for the customer, as we were able to quickly deliver a robust PDF experience across platforms, and it is good for us, as we can focus on what the customers want: the best user experience of any PDF framework out there.

[truepolyglot]: https://truepolyglot.hackade.org/
[pspdfkit ios]: https://pspdfkit.com/pdf-sdk/ios/
[apple pdf renderer]: https://developer.apple.com/library/archive/documentation/GraphicsImaging/Conceptual/drawingwithquartz2d/dq_pdf/dq_pdf.html
[bug reports]: /blog/2016/writing-good-bug-reports/
[rdar://18501998]: http://openradar.appspot.com/18501998
[rdar://19073954]: http://openradar.appspot.com/19073954
[pspdfkit android]: https://pspdfkit.com/pdf-sdk/android/
[pdfium]: https://pdfium.googlesource.com/pdfium/
[pdfium layer fix]: https://pdfium.googlesource.com/pdfium/+/021c4f87963557ccd357b256882487fae46c2671
[pdfium pattern fix]: https://pdfium-review.googlesource.com/c/pdfium/+/53831
[pdfium documentation fix]: https://pdfium-review.googlesource.com/c/pdfium/+/53470
