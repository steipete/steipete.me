---
title: "Drawing on PDFs Using Ink Annotations"
description: "We show how to draw on a PDF using an ink annotation in PDFKit."
preview_image: /images/blog/2019/ink-annotation-in-pdfkit/article-header.png
section: blog
author:
  - Akshat Patel
author_url:
  - https://twitter.com/_akshatpatel
date: 2019-06-18 8:00 UTC
tags: iOS, Development, Swift
published: true
secret: false
---

Being able to draw on a PDF to annotate and mark things is a very common feature that users expect to have in any application that deals with PDF files. For iOS users, Apple’s [PDFKit][] provides tools to implement this functionality. This blog post will lead you through a simple implementation of an [ink annotation][ink-annotation] that allows users to draw on a PDF file using a pan gesture.

This post assumes you know the basics of creating a PDF in PDFKit. However, if you are new to PDFKit, you should first read our post on [Creating a PDF in Swift Using PDFKit][creating-a-pdf-in-swift].

## Creating Ink Annotations

Let’s begin by setting up our project with the boilerplate code required for this example. We will generate a PDF file and show it in our `viewDidAppear:` method exactly like it’s described in our [Creating a PDF in Swift Using PDFKit][creating-a-pdf-in-swift] post. We will also require a [`UIPanGestureRecognizer`][uipangesturerecognizer], whose purpose is to generate a [`UIBezierPath`][uibezierpath] from the user’s touches, and add it to the ink annotation. Finally, we will add a `UIButton` called `annotateButton` that will let the user start and end annotating. Tapping on `annotateButton` once will disable the scroll interaction of `pdfView` (the [`PDFView`][pdfview] that was set up in the initial code to show the PDF document) and it will instead set up a gesture recognizer that processes the user’s touches. Tapping on it again will remove our pan gesture recognizer and reenable the default interaction in `pdfView`.

Now that we have the initial boilerplate code ready, let’s start with `annotateButton`’s tapped method:

```swift
func annotateButtonTapped(_ sender: Any) {
    if (isAnnotating) {
        // User is done annotating, so we reset the button title and enable user interaction for `pdfView`.
        annotateButton.setTitle("Annotate", for: .normal)
        pdfView.isUserInteractionEnabled = true
        view.removeGestureRecognizer(panGestureRecognizer)
    } else {
    	 /**
           User wants to start annotating, so we update the button title and disable the `pdfView`'s default user interaction.
           The `panGestureRecognizer` will take care of handling touches and drawing the annotation.
           We also create a new `inkAnnotation`, which will contain the Bézier path(s) corresponding to the user's touches.
         */

         // Can't add an ink annotation if the page does not exist.
         guard let page = pdfView.document?.page(at: 0) else { return }

         annotateButton.setTitle("Done", for: .normal)
         pdfView.isUserInteractionEnabled = false
         view.addGestureRecognizer(panGestureRecognizer)

	     // Create a new annotation and add it to the page.
         let inkAnnotation = PDFAnnotation(bounds: page.bounds(for: .mediaBox), forType: PDFAnnotationSubtype.ink, withProperties: nil)
         inkAnnotation.color = UIColor.red
         page.addAnnotation(inkAnnotation)
    }

    // Boolean flag that keeps track of whether or not we are currently annotating.
    isAnnotating = !isAnnotating
}
```

In the method above, we create a new `PDFAnnotation` with the type [`PDFAnnotationSubtype.ink`][pdfannotationsubtype-ink] when the user taps on the annotate button. We also need to disable `pdfView`’s user interaction and add our pan gesture recognizer, which will track the user’s touches.

The next step is to handle the pan gesture. Here’s how we do it:

```swift
func panned(_ pan: UIPanGestureRecognizer) {
    guard let documentView = pdfView.documentView else { return }
    guard let page = pdfView.document?.page(at: 0) else { return }

    /**
       Fetching the last `inkAnnotation` like this from the PDF document's page
       might not be the best idea in production code, but it works out for us
       in this simple example because we know that the last annotation is
       always going to be the one that was created in `annotateButtonTapped:`.
      */
    guard let inkAnnotation = page.annotations.last else { return }

    // Transforming the touch coordinates to the document's coordinates.
    var location = pan.location(in: pdfView.documentView)

    // Flipping the y axis because the UIKit coordinate system starts from the top left, while the PDF's coordinate system starts from the bottom left.
    location.y = documentView.bounds.height - location.y

    switch (pan.state) {
        case .began:
            // Create a new Bézier path when the user starts a new pan and add it to the `inkAnnotation`.
            inkAnnotation.add(UIBezierPath(ovalIn: CGRect(x: location.x, y: location.y, width: 0, height: 0)))
            break
        case .changed:
            /**
             Update the `inkAnnotation`'s `bezierPath` when we keep on getting new points.
             We have to create a copy of the `bezierPath` and replace it, because just updating the `bezierPath` does not redraw the annotation.
             */
            guard let oldBezierPath = inkAnnotation.paths?.last else { return }
            guard let newBezierPath = oldBezierPath.copy() as? UIBezierPath else { return }
            newBezierPath.addLine(to: location)
            inkAnnotation.add(newBezierPath)
            inkAnnotation.remove(oldBezierPath)
            break
        default:
            break
    }
}
```

We create a new `UIBezierPath` when the gesture begins and keep on adding lines to the Bézier path as we keep on receiving touches. Before using the touch points that we get from the gesture, we need to transform them to the document’s coordinate system. We also need to flip the y axis, because `UIKit`’s coordinate system starts from the top left corner, while the PDF’s coordinate system starts from the bottom left corner. To force the ink annotation to be redrawn when we add points to the Bézier path, we have to add a new Bézier path and remove the old one.

## Conclusion

That’s it! This example demonstrated a very simple way to annotate a PDF using ink annotations in PDFKit. More advanced use cases for ink annotations might require a number of features such as resizing or moving an annotation, or changing an annotation’s attributes, including color, line thickness, etc. For these cases, [PSPDFKit][pspdfkit] provides a [rich set of features][array-of-features] that make integrating PDFs into your custom application a breeze.

[ink-annotation]: https://developer.apple.com/documentation/pdfkit/pdfannotationsubtype/2876076-ink
[creating-a-pdf-in-swift]: https://pspdfkit.com/blog/2019/creating-pdf-in-swift/
[pdfkit]: https://developer.apple.com/documentation/pdfkit
[pspdfkit]: https://pspdfkit.com/pdf-sdk/ios/
[array-of-features]: https://pspdfkit.com/guides/ios/current/features/detailed-list/
[pdfannotationsubtype-ink]: https://developer.apple.com/documentation/pdfkit/pdfannotationsubtype/2876076-ink
[uibezierpath]: https://developer.apple.com/documentation/uikit/uibezierpath
[uipangesturerecognizer]: https://developer.apple.com/documentation/uikit/uipangesturerecognizer
[pdfview]: https://developer.apple.com/documentation/pdfkit/pdfview
