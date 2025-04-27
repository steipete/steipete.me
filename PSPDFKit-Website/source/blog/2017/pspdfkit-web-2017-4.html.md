---
title: "PSPDFKit for Web 2017.4"
description: PSPDFKit for Web 2017.4 is out, now with mobile annotations, a toolbar API and a document pan mode!
section: blog
author:
  - Giuseppe Gurgone
  - Nicolas Dular
  - Philipp Spiess
author_url:
  - https://twitter.com/giuseppegurgone
  - https://twitter.com/NicolasDular
  - https://twitter.com/PhilippSpiess
date: 2017-05-16 12:00 UTC
tags: Web, Products
published: true
---

We’re thrilled to announce a new major update of our Web SDK. PSPDFKit for Web 2017.4 brings support for interacting with annotations on mobile devices, a new toolbar API that allows rearranging the default items as well as adding custom buttons, and the pan mode (hand tool) for a better page viewing experience. A list of all the included fixes and performance improvements can be found in our [changelog][].

READMORE

## Mobile Annotations

An often requested feature for PSPDFKit for Web was annotation editing and creation on mobile devices. From version 2017.4 onwards, creating and editing annotations is fully supported on mobile devices. This includes all our currently supported annotation types — ink, highlight, squiggle, underline, strike-through, text, and link — and will, likewise, include any future annotation types.

<video src="/images/blog/2017/pspdfkit-web-2017-4/mobile-annotations.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

To ensure the best experience, we added special event listener for touch events wherever we interact with annotations. Creating markup annotations was especially cumbersome, since iOS and Android display a tooltip by default when selecting text. To circumvent this problem, mobile devices will show an annotation toolbar whenever text is selected, allowing the user to add a highlight, squiggle, underline, or strike-through annotation to the selected text.

Be aware that the action of creating or editing annotations on mobile devices, like drawing a new ink annotation, might stop the propagation of touch events to your application (just like it would for mouse events when using a desktop browser).

## Toolbar API

With PSPDFKit for Web 2017.4, we are making the main PDF editor toolbar customizable by giving you control over the default toolbar items, including the ability to add new, custom items.

<figure>
  <video src="/images/blog/2017/pspdfkit-web-2017-4/customizable-toolbar.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>
  <figcaption>The cat icon was created by Erika Jasso from the Noun Project</figcaption>
</figure>

Below is an example of how easy is to revert the order of the toolbar items and insert a new custom button like we did in the video above.

[==

```es
// retrieve the default toolbar items
const toolbarItems = PSPDFKit.defaultToolbarItems;
// reverse the order of the items
toolbarItems.reverse();
// insert a custom button
toolbarItems.push({
  type: 'custom',
  id: 'cat',
  icon: 'https://example.com/icons/cat.svg',
  mediaQueries: ['(min-width: 480px)'],
  onPress: () => alert('meow'),
})

PSPDFKit.load({
  // ...
  toolbarItems
});
```

```js
// retrieve the default toolbar items
var toolbarItems = PSPDFKit.defaultToolbarItems;
// reverse the order of the items
toolbarItems.reverse();
// insert a custom button
toolbarItems.push({
  type: 'custom',
  id: 'cat',
  icon: 'https://example.com/icons/cat.svg',
  mediaQueries: ['(min-width: 480px)'],
  onPress: function () {
    alert('meow');
  }
});

PSPDFKit.load({
  // ...
  toolbarItems: toolbarItems
});
```

==]

For a complete overview, please refer to our [API documentation][].

## Pan Mode

For a lot of scenarios, navigating by scrolling only is not very efficient or precise. This is particularly the case for large format documents that need to be looked at while zoomed in (like a construction plan or a map). To improve navigation for such documents, we now offer the pan mode.

This mode is selectable using the hand icon in the toolbar and will, when activated, show a hand icon when you move the mouse over the content. You can now click and drag the mouse to scroll around the document.

<video src="/images/blog/2017/pspdfkit-web-2017-4/pan-tool.mp4" width="100%" loop muted  playsinline data-controller="video" data-video-autoplay="true"></video>

All of this is possible while still being able to select and update annotations. Only the text annotation selection is disabled.

If you want to enable the pan via our API, check out the new [`ViewState#interactionMode`][] option:

[==

```es
instance.setViewState(viewState => (
  viewState.set('interactionMode', PSPDFKit.InteractionMode.PAN)
))
```

```js
instance.setViewState(function(viewState) {
  return viewState.set('interactionMode', PSPDFKit.InteractionMode.PAN)
})
```

==]

## Additional Notes

If you’re updating from a version prior 2017.3, please have a look at the [2017.3 Migration guide][]. The deprecated API was removed in this version.

[changelog]: /changelog/web/
[2017.3 Migration guide]: /guides/web/current/migration-guides/2017-3-migration-guide/
[`ViewState#interactionMode`]: /api/web/PSPDFKit.ViewState.html#interactionMode
[API documentation]: /api/web/PSPDFKit.Instance.html#setToolbarItems
