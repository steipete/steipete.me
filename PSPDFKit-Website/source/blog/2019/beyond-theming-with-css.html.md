---
title: "Beyond Theming with CSS"
description: "In this blog post, we’ll look at some simple solutions we use at PSPDFKit to make our modals more inclusive and accessible."
preview_image: /images/blog/2019/beyond-theming-with-css/article-header.png
section: blog
author:
  - Giuseppe Gurgone
author_url:
  - https://twitter.com/giuseppegurgone
date: 2019-05-28 7:00 UTC
tags: Web, Development, CSS
published: true
secret: false
---

At PSPDFKit, we’ve built a JavaScript-based, framework-agnostic [PDF SDK for Web][] that comes with a minimal but opinionated user interface built with React.js

As our customers integrate the viewer directly on their websites and apps, it’s important that we provide some customizability options to allow them to better align our application’s look and feel to their brands. However, theming and customization is a common challenge for most authors of UI libraries.

In this blog post, we’ll talk about how we enable theming via CSS and go beyond that by allowing our customers to take control of the rendering of some parts of our UI with a feature that we call _custom renderers_.

## Theming with CSS

Our library provides a perfectly functional and polished user interface that, most of the time, requires minimal to zero customization. We use CSS Modules to author styles in regular CSS files and get them scoped automatically at build time. Although [CSS Modules are not perfect][giuseppe tweet], when used carefully while styling a small UI, they are a good tool for creating a single bundle of scoped CSS for an entire application that can be cached long term.

For us, the ability to scope styles is crucial, as otherwise, implementation details would be exposed to the public and available for customization and misuse. Scoped styles also avoid global style collisions and boost our confidence when building UIs.

![Screenshot showing the public CSS classes on the elements](/images/blog/2019/beyond-theming-with-css/public-css-classes.png "Public and private CSS classes can be seen in the dev tools.")

We enable theming and customization via a public CSS class-based API that allows specific targeted overrides. Normally, we provide these classes for certain crucial parts of the UI and discourage customers from relying on implementation details, i.e. using element selectors.

To provide a more immediate way to tweak UI themes, modern browsers can also use CSS Custom Properties and [public Custom Properties maps][] in a similar way.

Doing things up this way allows us to distribute precompiled CSS so that our customers don’t need to install and set up extra dependencies or tools when consuming PSPDFKit.

## Going Beyond Themes and Tweaks

Building an efficient, highly customizable, and flexible UI for theoretically infinite use cases is a difficult task.

A public CSS classes-based API allows for simple customization and covers the majority of our customers’ needs. However, sometimes developers buy into a library mainly for the functionalities it provides and expect finer control over the look and feel of the resulting application.

Unfortunately, with an opinionated HTML structure, special kinds of customizations are just not possible with CSS.

To work around this issue in React.js, developers have started building functional components that, using the so-called [“render props”][] pattern, delegate the UI rendering part to the developer.

While ideal, this solution doesn’t immediately work for us, as React.js is just an implementation detail and our library is framework agnostic, i.e. our customers work with a _vanilla_ JavaScript API.

We can, however, replicate this pattern to provide a vanilla JavaScript public-facing API that resembles the render props one.

### Introducing Custom Renderers

![Renderers](/images/blog/2019/beyond-theming-with-css/renderers.png)

At PSPDFKit, we created an API to allow customers to override or decorate specific parts of the UI when rendering.

We call these _custom renderers_, and they are a way for customers to hook into our application-rendering mechanism.

These renderers are functions that take properties as input and return a DOM node reference. When a renderer returns `null`, we instead render the default UI for that slot.

Our customers can register custom renderers when initializing PSPDFKit:

[==

```es
PSPDFKit.load({
  customRenderers: {
    Annotation: ({ annotation }) => {
      if (annotation instanceof PSPDFKit.Annotations.NoteAnnotation) {
        return {
          node: document.createTextNode(`📝 ${annotation.text}`),
          append: false // Replace the entire note annotation UI.
        };
      } else {
        return null; // Render the default UI.
      }
    }
  }
});
```

```js
PSPDFKit.load({
  customRenderers: {
    Annotation: function(properties) {
      var annotation = properties.annotation;
      if (annotation instanceof PSPDFKit.Annotations.NoteAnnotation) {
        return {
          node: document.createTextNode("📝 " + annotation.text),
          append: false // Replace the entire note annotation UI.
        };
      } else {
        return null; // Render the default UI.
      }
    }
  }
});
```

==]

As this is an experimental feature, for now we are only exposing a few purely presentational and logicless parts of our UI.

To preserve default functionality, we are thinking of relying on event delegation, and to make sure mandatory DOM attributes (e.g. accessibility-related ones) are used, we are considering turning the `properties` object that is passed to renderers into a [JavaScript Proxy][] that we can inspect after rendering to assert that some properties have indeed been accessed.

Finally, we are brainstorming around the idea of introducing a special `pspdfkit-content` custom element that would allow customers to customize more than just the “leaves” of our application tree. Such a feature would, for example, allow users to customize a modal dialog but let PSPDFKit take care of rendering its default content.

## Conclusion

Building customizable user interfaces is challenging, and there probably isn’t a bulletproof solution out there that works for every use case. Most of the time, theming and tweaking the UI with CSS gets the job done, and this is possibly the preferred way for most customers and users.

However, branding and custom design needs can require a higher degree of control and customization. In the React.js world, this is easily done with render props. In a framework-agnostic environment, we tried to replicate this model as a way to provide hooks into our UI-rendering mechanism for our customers.

Please let us know your thoughts on this approach, as we hope to learn a thing or two from our beloved web community!

[pdf sdk for web]: https://pspdfkit.com/pdf-sdk/web/
[giuseppe tweet]: https://twitter.com/giuseppegurgone/status/1084921816030896135
[public custom properties maps]: https://github.com/giuseppeg/suitcss-toolkit/tree/example-app/examples/app#themes
[“render props”]: https://reactjs.org/docs/render-props.html
[javascript proxy]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
