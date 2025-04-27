---
title: "Color-Correct Night Mode"
description: A blog post showing how we go the extra mile to create good-looking color in night mode.
preview_image: /images/blog/2018/color-correct-night-mode/article-header.png
section: blog
author:
  - Stefan Kieleithner
author_url:
  - https://twitter.com/steviki
date: 2018-11-27 8:00 UTC
tags: iOS, Development
published: true
secret: false
---

Pilots use PDFs in the cockpit — be it for browsing guides, reading manuals, or checking the flight plan. Since their flying environment is dark during the night, having a night mode for PDFs is a highly important feature to make it easier to read and see.READMORE A dark UI can naively be achieved by inverting the colors of a document page; however, in practice that doesn’t lead to good results. To improve on this, we went the extra mile and worked on a color-correct night mode, which I’ll talk about in this post.

In PSPDFKit for iOS, when setting [`PSPDFAppearanceModeNight`][] through our API or tapping the Night button in the settings UI, a color-correct night mode is applied to document pages. In addition to this inverting the colors, there is some extra transformation involved, and there are separate steps taken for changing the rendered document page to night mode and for converting colors (`UIColor` values) from normal to night mode.

## Document Rendering

The most obvious aspect of the night appearance mode is that the rendering of document pages is changed from the default rendering to the color-correct rendering. This is done by post-processing the rendered document page image. Below you’ll see the default rendering.

![Default Rendering](/images/blog/2018/color-correct-night-mode/default-rendering.png)

Inverting colors is an easy way to achieve night mode, as this will result in, for example, a white page background becoming black. However, since this will also change colors of text and images, some parts of the document might look odd when inverted. Below you’ll see that the text and graph colors are no longer reminiscent of their original colors.

![Inverted Rendering](/images/blog/2018/color-correct-night-mode/inverted-rendering.png)

To address this, we added another step to achieve color-correct night mode, which means that the colors in night mode are hues similar to the colors in the default rendering, as shown below.

![Color-Correct Inverted Rendering](/images/blog/2018/color-correct-night-mode/color-correct-inverted-rendering.png)

## Raw Colors

There are various parts in the UI where we are using a raw `UIColor`. One example of this is the color of annotations during drawing when the annotations are not yet rendered on the page. In color-correct night mode, these colors are adjusted, similar to how changes are applied for document rendering, and this results in the same color-correct night mode color for all shown content.

In addition to document page rendering, we also have to adapt `UIColor`. This is because the rendering of existing annotations on the document page and the rendering of annotations while they are being created use different code paths, and both paths require the same color transformation applied in slightly different ways.

## Experience Night Mode Yourself

To see how the color-correct night mode looks in action with your own documents, the easiest way is to try it in our [free PDF Viewer][pdf viewer] app.

<img alt="Settings Controller" width="80%" src="/images/blog/2018/color-correct-night-mode/settings-controller.png">

[`pspdfappearancemodenight`]: https://pspdfkit.com/api/ios/Enums/PSPDFAppearanceMode.html#/c:@E@PSPDFAppearanceMode@PSPDFAppearanceModeNight
[pdf viewer]: https://pdfviewer.io/
