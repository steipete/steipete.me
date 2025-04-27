---
title: "Adopting Drag and Drop on iOS"
description: Utilizing the new Drag and Drop feature in iOS 11, and how we integrated it to enhance the user experience.
preview_image: /images/blog/2017/drag-and-drop/drag-and-drop-header.png
preview_video: /images/blog/2017/drag-and-drop/drag-drop-animation.mp4
section: blog
author:
  - Stefan Kieleithner
author_url:
  - https://twitter.com/steviki
date: 2017-12-08 10:00 UTC
tags: iOS, Development
published: true
---

One of the most popular additions to iOS 11 was the introduction of a system-wide Drag and Drop feature. While this feature already existed on the desktop, it has been brought to mobile devices as well, making it much easier to move documents and data within and between apps. READMORE As a result, productivity on iOS received a huge boost, and developers are constantly coming up with new ways of improving the user experience.

## General

Prior to iOS 11, some custom implementations of a Drag and Drop solution already existed on iOS, but they all had one flaw that only Apple could fix by introducing native support: They only worked within a single app, or only within apps from the same developer, as there was no centralized way to share information across different apps.

This changed with iOS 11, which allowed sharing data across applications, system-wide, while making adopting this feature pretty simple with a straightforward API. While all of these features are supported on iPad, the iPhone only supports Drag and Drop within a single application, and it needs some [special flags set][dragInteractionEnabled] by the developer to work.

Let’s dig deeper and explore these new APIs in detail.

## API Overview

Depending on your needs, including Drag and Drop in your app might be as simple as setting the iOS 11 SDK as a deployment target, which enables it for text fields and text views. If you need more control or want other elements to support Drag and Drop, you can move to using the newly introduced API. (But [be careful - you might not want Drag and Drop everywhere.](https://twitter.com/qdoug/status/933925887397040133))

`UITableView` and `UICollectionView`, being composite views, need special treatment for Drag and Drop to work well, and Apple introduced specific properties and methods to help with that. The [Drag and Drop with Collection and Table View](https://developer.apple.com/videos/play/wwdc2017/223/) WWDC session video posted on Apple’s Developer page is the perfect introduction to the topic.

To support Drag and Drop for custom views, you will need to add `UIDragInteraction` and `UIDropInteraction` to your views, depending on if you support dragging, dropping, or both. This will require implementing `UIDragInteractionDelegate` and `UIDropInteractionDelegate`, respectively.

The only required method for dragging is `dragInteraction: itemsForBeginningSession:`, which returns an array of items the user is dragging. The method is called when a drag action is initiated on a drag-enabled view.

Allowing dropping into your custom views can be done via `dropInteraction:performDrop:`, which is called when the user lets go of drop items.

`NSItemProvider` is used to transfer data between a drag and a drop. The related protocols enable you to share even arbitrary data. For example, you could share a model that only exists inside your applications while providing a fallback to a general model (like a string or an image), in order to make sure other apps support an item dragged from your application as well.

## Utilizing Drag and Drop

Now that we explored some of the available APIs for incorporating Drag and Drop into our applications, what can we do with it?

At PSPDFKit, [we have supported Drag and Drop since the release of iOS 11](/blog/2017/pspdfkit-ios-7-0/), and we implemented a variety of functionalities that can be accessed via Drag and Drop.
The main feature is dragging and dropping from a document page, where users are able to drag text and images, and in the future, this will extend to annotations.

Dropping is supported for text, images, and even PDF documents. These are converted to PDF annotations that are placed on the page where the items got dropped, on the fly.

In the future, it will even be possible to drag pages from one document and drop them into another document, making document management and organization across multiple PDFs a breeze.

With PSPDFKit, it’s also possible to do things like drag notes from the Notes app to a document as a text annotation, save an image from a document to the Photos app, or add new image stamp annotations to a document from pictures shot with the camera.

All of these features are customizable, where each action can be selectively enabled or disabled. It’s even possible to disable the Drag and Drop feature completely for data-sensitive and security-related documents and apps. Read more about this in our dedicated [Drag and Drop guide article][Drag and Drop Guide Article].

<a href="https://pdfviewer.io">
<video src="/images/blog/2017/drag-and-drop/drag-drop-document.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>
</a>

## What to Do Next

If you want to dive even deeper into this topic, check out the [Drag and Drop developer page][Drag and Drop Apple Developer Guide], which includes even more material — like WWDC videos, UIKit documentation, and the Human Interface Guidelines — to help you master Drag and Drop. Now go out, explore the features for yourself, and build great things!

To start with a hands-on experience, try the Drag and Drop ability in our free [PDF Viewer app][PDF Viewer iOS].

[Drag and Drop Guide Article]: /guides/ios/current//features/drag-and-drop/
[Drag and Drop Apple Developer Guide]: https://developer.apple.com/ios/drag-and-drop/
[PDF Viewer iOS]: https://pdfviewer.io/#ios
[`PSPDFDragAndDropConfiguration`]: /api/ios/Classes/PSPDFDragAndDropConfiguration.html
[dragInteractionEnabled]: https://developer.apple.com/documentation/uikit/uitableview/2909064-draginteractionenabled
