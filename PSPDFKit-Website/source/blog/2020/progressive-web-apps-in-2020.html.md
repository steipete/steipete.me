---
title: "The State of Progressive Web Apps in 2020"
description: "Examining new developments in the PWA landscape that affect mobile and desktop browsers."
preview_image: /images/blog/2020/progressive-web-apps-in-2020/article-header.png
section: blog
author:
  - Marco Scannadinari
author_url:
  - https://github.com/marcoms
date: 2020-01-28 8:00 UTC
tags: Web, Development, PWA
published: true
secret: false
---

“Web apps” is a term that seems to have sprung into popular use in recent years. Of course, there have always been web _applications_, which emerged with the introduction of [Java applets][] (1995) and [DHTML][] (1997). However, the increase of mobile phone usage around the world has made web _apps_ more and more relevant to both users and developers. Despite this, the gap between native apps and web apps has always seemed vast. This was historically due to factors such as the lack of offline capabilities and access to native hardware features.

Fortunately, the capabilities of Progressive Web Apps (PWAs) have rendered many of these roadblocks obsolete, as we saw in [another blog post][pwa blog post]. As is often the case with newer features on the web platform, all that remained was for browser vendors to support these new features. I’m happy to report that as we enter into the new year, progress has been promising on several fronts, and this blog post will consider some highlights and what they mean for you as a developer.

## Mobile

### iOS

The release of iOS 13 brought about a number of improvements to PWAs on iOS.

- The availability of Dark Mode was revealed with great fanfare. Fortunately, this provision was made available to PWAs through the standard `prefers-color-scheme` CSS [media query][], making it easy to implement a dark-themed variant of an app. While `prefers-color-scheme` also applies to regular websites, in the context of installed PWAs, this feature means that your app can have a much more native feel, as it responds to the system’s current light/dark theme:

```css
body {
  background-color: white;
  color: black;
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: #333;
    color: white;
  }
}
```

![Toggling light and dark modes on Safari](/images/blog/2020/progressive-web-apps-in-2020/light-dark-mode.gif)

> The same technique can be used on regular websites as well. Check out the [CodePen example][].

- Apple Pay support was enabled for installed PWAs and web views, allowing you to provide a smooth and integrated payment experience to your users, which is something they will be used to from using other native apps.

- Those who tested their PWA applications after adding them to their home screen previously found that the iOS 12 app switcher rendered white screens for their apps, making the app feel unpolished and difficult to spot between the many other apps running on the user’s device. Fortunately, this is no longer the case on iOS 13.

Unfortunately, adding PWAs to the iOS home screen is a feature only available with Safari. It remains to be seen whether this will eventually be opened up to other browsers.

### Android

On Android, the majority of popular mobile browsers — including Chrome, Firefox, and Opera — support installing PWAs on the home screen. Service workers are also supported, allowing devices to receive push notifications even when an app is not running.

![Adding the PSPDFKit PWA to the home screen on mobile Chrome](/images/blog/2020/progressive-web-apps-in-2020/chrome-install-mobile.png)

## Desktop

### Chrome

Chrome is often depicted as the one browser at the forefront of PWA support, and Google has continued to make this one of Chrome’s focuses. Back in 2018, Chrome 70 enabled support for installing PWAs on Windows. Then, in 2019, support for Linux was added in Chrome 72 and for macOS in Chrome 73.

Chrome 76 added a dedicated install button for PWAs to the URL bar, making the installation process much more discoverable and less invasive for many users.

![Dedicated install button on Chrome](/images/blog/2020/progressive-web-apps-in-2020/chrome-install-desktop.png)

With Chrome being the most popular browser worldwide, having support for all three major desktop operating systems makes installable PWAs viable options for application distribution. Apps that do not require all the native APIs from Electron are good candidates for this, since they can forgo the added bundle size and runtime memory cost.

### Firefox

Unfortunately, installing PWAs is not yet supported on desktop Firefox. However, this is certainly something to keep an eye out for during the year (see this [Bugzilla thread][]).

Nonetheless, service workers can still be registered to cache your website to run offline and deliver push notifications even when a tab is closed.

### Windows 10/Edge

Historically, Windows hasn’t been the favored platform of many web developers. However, Microsoft turned a new leaf with the release of Edge alongside Windows 10. This release both promised and delivered much better support for newer web standards. Now in 2020, the state of things is very bright: PWAs can not only be installed from the Edge browser itself, but they can also be distributed on the Windows Store. In addition, service workers have been supported since 2017.

Of course, it is common knowledge that the (currently in beta) Chromium version of Microsoft Edge will soon replace the existing EdgeHTML version in the first quarter of 2020. While many may have concerns about the decline in competing browser engines, it is undeniable that PWAs will benefit from this move, since Edge will then have the same robust support for PWAs that Chrome has.

To be included in the Microsoft store, PWAs can be either automatically crawled via Bing or manually submitted. You can read more on the [official Microsoft PWA guide][].

## Wrapping Up

2020 looks to be a great year for Progressive Web Apps. Thanks to the improvements listed in the above sections, companies and developers that invest time in adding PWA functionality to their apps (service workers, offline support, the ability to add to the home screen, etc.) can be confident that their investments will pay off.

PSPDFKit has always seen the massive potential in Progressive Web Apps, and it’s great to see them get better year by year. Those interested in our take on a PWA using PSPDFKit to load documents, including offline and install-to-home-screen support, can view our [GitHub project][] or the [hosted version][].

[java applets]: https://en.wikipedia.org/wiki/Java_applet
[dhtml]: https://en.wikipedia.org/wiki/Dynamic_HTML
[pwa blog post]: https://pspdfkit.com/blog/2018/pwa-progressive-web-applications/
[media query]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
[codepen example]: https://codepen.io/marcoms/pen/zYxdrmE
[bugzilla thread]: https://bugzilla.mozilla.org/show_bug.cgi?id=1407202
[official microsoft pwa guide]: https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps/microsoft-store
[github project]: https://github.com/PSPDFKit/pspdfkit-web-example-pwa
[hosted version]: https://pspdfkit.com/pwa
