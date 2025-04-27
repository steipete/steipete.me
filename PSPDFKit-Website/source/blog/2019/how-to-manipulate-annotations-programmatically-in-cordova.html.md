---
title: "How to Manipulate Annotations Programmatically in Cordova"
description: "A tutorial about how to manipulate annotations programmatically in Cordova using Instant JSON and XFDF."
preview_image: /images/blog/2019/how-to-manipulate-annotations-programmatically-in-cordova/article-header.png
section: blog
author:
  - Rad Azzouz
author_url:
  - https://twitter.com/radazzouz
date: 2019-07-22 8:00 UTC
tags: Cordova, Development, How-To
published: true
secret: false
---

We provide various wrappers for our SDK, and Cordova is no exception. We are continuously improving our wrapper, so we are glad to announce that we’ve just updated our [Cordova plugin][pspdfkit-cordova] to include support for programmatic annotations. You can now add, remove, and query annotations using our [Instant JSON format][instant-json-format] or import and export annotations using an [XFDF][xfdf-support] file.
READMORE

In this article, we’ll discuss how to programmatically manipulate annotations in your JavaScript code in your Cordova app.

So let’s get started!

## Instant JSON

Instant JSON is our approach to bringing annotations into a modern format. Instant JSON stores PDF changes like annotations in a cross-platform compatible and external JSON format. This means that a PDF document will only need to be transferred once and all changes will be added as an overlay to the existing PDF. This approach significantly reduces the bandwidth since you only need to transfer this JSON instead of the full PDF.

### Adding Annotations

This is how you can add a single annotation to your document using the [Instant JSON Annotation API][]:

```js
const annotationJSON = {
  bbox: [89.0, 98.0, 143.0, 207.0],
  isDrawnNaturally: false,
  lineWidth: 5,
  lines: {
    intensities: [[0.5, 0.5, 0.5], [0.5, 0.5, 0.5]],
    points: [
      [[92.0, 101.0], [92.0, 202.0], [138.0, 303.0]],
      [[184.0, 101.0], [184.0, 202.0], [230.0, 303.0]]
    ]
  },
  opacity: 1,
  pageIndex: 0,
  name: "A167811E-6D10-4546-A147-B7AD775FE8AC",
  strokeColor: "#AA47BE",
  type: "pspdfkit/ink",
  v: 1
};

PSPDFKit.addAnnotation(annotationJSON, function(success, error) {
  if (success) {
    // The annotation has been successfully added.
  }
});
```

### Removing an Annotation

And this is how you can remove an annotation:

```js
const annotationJSON = ...// Instant JSON annotation payload.
PSPDFKit.removeAnnotation(annotationJSON, function(success, error) {
	if (success) {
		// The annotation has been successfully removed.
	}
});
```

### Querying Annotations

You can get all annotations on a page of a specific type, like so:

```js
PSPDFKit.getAnnotation(0, "pspdfkit/ink", function(success, error) {
  if (success) {
    // Get all ink annotations on the first page.
    const inkAnnotations = success;
  }
});
```

If you want to get all annotations on the page, you can pass `null` as the annotation type parameter:

```js
PSPDFKit.getAnnotations(0, null, function(success, error) {
  if (success) {
    // Get all annotations on the first page.
    const annotations = success;
  }
});
```

To get all unsaved annotations on all pages, you can call `getAllUnsavedAnnotations`, as seen below:

```js
PSPDFKit.getAllUnsavedAnnotations(function(success, error) {
  if (success) {
    // Get all unsaved annotations in the document.
    const allUnsavedAnnotations = success;
  }
});
```

As a result, you will get an [Instant JSON Document API][] payload.

### Applying the Document Instant JSON Payload

You can apply document changes using the [Instant JSON Document API][], like so:

```js
const documentJSON = {
  annotations: [
    {
      v: 1,
      createdAt: "2018-07-30T15:34:48Z",
      bbox: [89.0, 98.0, 143.0, 207.0],
      type: "pspdfkit/ink",
      lines: {
        points: [
          [[92.0, 101.0], [92.0, 202.0], [138.0, 303.0]],
          [[184.0, 101.0], [184.0, 202.0], [230.0, 303.0]]
        ],
        intensities: [[0.5, 0.5, 0.5], [0.5, 0.5, 0.5]]
      },
      isDrawnNaturally: false,
      strokeColor: "#AA47BE",
      name: "A167811E-6D10-4546-A147-B7AD775FE8AC",
      updatedAt: "2018-07-30T15:34:48Z",
      pageIndex: 0,
      opacity: 1,
      lineWidth: 5,
      blendMode: "normal",
      id: "01CKNX7TVEGWMJDPTS9BN3RH9M"
    },
    {
      v: 1,
      createdAt: "2018-07-30T15:29:54Z",
      creatorName: "John Appleseed",
      lines: {
        points: [
          [
            [243.0, 510.0],
            [244.0, 510.0],
            [258.0, 506.0],
            [295.0, 496.0],
            [349.0, 489.0],
            [365.0, 489.0],
            [393.0, 489.0],
            [406.0, 489.0],
            [411.0, 496.0],
            [411.0, 526.0],
            [389.0, 578.0],
            [375.0, 602.0],
            [364.0, 618.0],
            [354.0, 631.0],
            [349.0, 639.0],
            [351.0, 645.0],
            [392.0, 661.0],
            [477.0, 672.0],
            [557.0, 673.0],
            [591.0, 673.0],
            [616.0, 669.0],
            [635.0, 665.0],
            [642.0, 661.0],
            [642.0, 657.0],
            [638.0, 654.0],
            [632.0, 652.0],
            [625.0, 652.0]
          ]
        ],
        intensities: [
          [
            1,
            1,
            0.78,
            0.43,
            0.19,
            0.77,
            0.58,
            0.82,
            0.86,
            0.56,
            0.16,
            0.59,
            0.72,
            0.75,
            0.86,
            0.9,
            0.38,
            0,
            0,
            0.5,
            0.62,
            0.71,
            0.88,
            0.95,
            0.93,
            0.9,
            0.9
          ]
        ]
      },
      isDrawnNaturally: true,
      strokeColor: "#1E59FF",
      updatedAt: "2018-07-30T15:29:54Z",
      pageIndex: 0,
      name: "1F291E11-0696-436B-A8E5-0386371E07B7",
      opacity: 1,
      note: "",
      lineWidth: 4,
      blendMode: "normal",
      type: "pspdfkit/ink",
      bbox: [243.0, 486.0, 397.0, 188.0],
      id: "01CKNX7TVF7ESF8Z4FR5Q4APEJ"
    }
  ],
  format: "https://pspdfkit.com/instant-json/v1"
};

PSPDFKit.applyInstantJSON(documentJSON, function(success, error) {
  if (success) {
    // The Instant JSON has been successfully applied.
  }
});
```

This function also allows you to apply multiple annotations at once.

## XFDF

XFDF is an XML-like standard from Adobe [XFDF][iso xfdf reference] for encoding annotations and forms. It is compatible with Adobe Acrobat and PSPDFKit. For more details, please take a look at our [XFDF Support documentation][xfdf-support guide].

In the latest version of our [Cordova plugin][pspdfkit-cordova], we’ve added the ability to import and export annotations from XFDF files.

### Importing from an XFDF File

You can import annotations from an existing XFDF file like this:

```js
PSPDFKit.importXFDF("path/to/your/XFDFFile.xfdf", function(success, error) {
  if (success) {
    // The annotations have been successfully imported.
  }
});
```

### Exporting to an XFDF File

This is how you can export annotations from your document to an XFDF file:

```js
PSPDFKit.exportXFDF("path/to/your/XFDFFile.xfdf", function(success, error) {
  if (success) {
    // The annotations have been successfully exported.
  }
});
```

## Conclusion

We’re very excited about the new API additions! If you come across any missing APIs that you think would be useful to have, feel free to [contact us][support] or open an [issue][issues] on the Cordova plugins repositories. You are also very welcome to submit pull requests to help improve our plugins, as they are open source.

[pspdfkit-cordova]: https://github.com/PSPDFKit/PSPDFKit-Cordova
[xfdf-support]: /guides/android/current/importing-exporting/xfdf-support/
[instant-json-format]: /guides/server/current/server-api/json-format/
[instant json annotation api]: /guides/ios/current/importing-exporting/instant-json/#instant-annotation-json-api
[instant json document api]: /guides/ios/current/importing-exporting/instant-json/#instant-document-json-api
[iso xfdf reference]: https://www.iso.org/obp/ui/#iso:std:iso:19444:-1:ed-1:v1:en
[xfdf-support guide]: /guides/ios/current/importing-exporting/xfdf-support/
[support]: /support/request
[issues]: https://github.com/PSPDFKit/PSPDFKit-Cordova/issues
