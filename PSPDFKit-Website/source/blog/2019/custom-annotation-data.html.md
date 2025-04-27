---
title: "Custom Data for PDF Annotations"
description: "Custom annotation data is a simple way to add user-defined attributes to PDF annotations."
preview_image: /images/blog/2019/custom-annotation-data/article-header.png
section: blog
author:
  - Peter Steinberger
author_url:
  - https://twitter.com/steipete
date: 2019-04-18 14:00 UTC
tags: Development, Products
published: true
---

Our PSPDFKit SDKs make it easy to create annotations, both programmatically and via a convenient user interface. Annotations can be stored in a PDF, but many of our partners have existing setups and prefer to store user annotations in their own databases. We fully support this and offer XFDF and Instant JSON for exporting data in a standardized format.

Up until now, we recommended that users use the UUID assigned to a new annotation as a key and store custom data in their own database, keyed by this UUID. This works, but it’s tedious, as a separate database entry needs to be maintained whenever an annotation is created or deleted. In turn, this can lead to issues when the synchronization isn’t always correct.

With our new custom annotation data feature, we offer a space to store annotation user data _directly in the annotation object_, and we’ll ensure things are properly serialized and stored — be it in the PDF, XFDF, Instant JSON, or even the native platform serialization, like `NSCoder` on iOS. As a developer, you can use the `customData` property and store in it any data that is allowed in a JSON.

<div class="alert alert-warning">

[Learn more about the new annotation metadata field in our guides][custom data guide].

</div>

## Industry Example

Currently, we’re working with a popular provider of document-signing solutions. This company is rewriting its web document editor and using our Web SDK for the new release. Marking the places where a document should be signed happens via creating form fields, which are just another subtype of annotations.

As multiple users could be signing a single document, the UI displays a dropdown where the person to sign should be selected. This `userId` field is stored as custom annotation data. Once all signature elements are placed, an Instant JSON file that contains all fields, the necessary annotation data, and custom additions (such as the aforementioned `userId`) is generated. This simplifies the setup, as there’s no code needed to wrap or extend the JSON created by PSPDFKit — leading to an ultimately faster and less buggy signing experience.

To illustrate this, here’s a simple code example of how `customData` can be used:

```js
const updatedAnnotation = annotation.set("customData", {
  userId: getCurrentUserId()
});

instance.updateAnnotation(updatedAnnotation);
```

## Version Overview

Custom annotation data is enabled for the following releases and higher:

- [PSPDFKit 8.3 for iOS][]
- [PSPDFKit 5.3 for Android][]
- [PSPDFKit 2019.2 for Web][]
- [PSPDFKit 3.3 for macOS][]
- [PSPDFKit 2.0 for Windows][]

## Conclusion

With the new custom annotation data feature, it’s easier than ever to store additional annotation data, making integration both faster and simpler.

[custom data guide]: /guides/android/current/annotations/custom-data-in-annotations/
[pspdfkit 8.3 for ios]: /changelog/ios/#8.3.0
[pspdfkit 5.3 for android]: /changelog/android/#5.3.0
[pspdfkit 2019.2 for web]: /changelog/web/#2019.2
[pspdfkit 3.3 for macos]: /changelog/macos/#3.3.0
[pspdfkit 2.0 for windows]: /blog/2019/pspdfkit-windows-2-0/
