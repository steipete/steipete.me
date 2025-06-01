---
title: Challenges of Adopting Drag and Drop
pubDatetime: 2018-11-07T08:10:00.000Z
description: "Discusses the challenges and limitations faced when implementing drag and drop functionality for PDF editing on iOS 11."
tags:
  - iOS
  - Development
  - Objective-C
source: pspdfkit.com
AIDescription: true
---

Earlier this year, we released [PSPDFKit for iOS (7.7)][] and [PDF Viewer (3.0)][]. In both of these releases, we improved our [Document Editor][] to support [drag and drop][] for iPads on iOS 11 and above.

Although we’ve written [about drag and drop][] before, this time I want to focus a little bit on it within the context of editing PDF files: what worked and didn’t work for us, the challenges we faced, and what we’d like for the drag-and-drop API to support in the future.

## UICollectionView

Drag-and-drop interactions are available to any view that implements the `UIDragInteractionDelegate`/`UIDropInteractionDelegate` protocols. However, there are some particular cases in which our friends at Apple working on UIKit noticed an opportunity to provide specialized implementations of the drag-and-drop interactions, such as `UITextView`, `UITableView`, and `UICollectionView`.

Luckily for us, `UICollectionView` was already the backbone of our [Document Editor][], so we thought adding drag-and-drop support would be a breeze: a couple lines of code and we’d be done.

Although the drag-and-drop API is well documented, expressive, and generally great to work with, adapting it to a use case in which some of the API assumptions were not always true was a fun and challenging process.

## What Does a Drag Item Represent?

PDF is a really versatile format, in that, in addition to allowing the user to embed actual functioning programs (via [JavaScript][]) within a document, plus audio and video, a document can _also_ have multiple pages!

Ironically enough, the [JavaScript][] and media bits of the document are not the difficult part of this story.

A PDF document being able to have multiple pages posed a challenge for this feature’s implementation because the drag-and-drop API doesn’t know how to reason about a single item in a drop session representing multiple “information units” with respect to what’s being dragged.

Conforming with `UICollectionViewDragDelegate`, you can provide an array of items to include in the session that’s currently beginning and then add more via another delegate method:

```objc
- (NSArray<UIDragItem *> *)collectionView:(UICollectionView *)collectionView itemsForBeginningDragSession:(id<UIDragSession>)session atIndexPath:(NSIndexPath *)indexPath API_AVAILABLE(ios(11.0)) {
    return @[[self dragItemForDocumentPageAtIndexPath:indexPath]];
}

- (NSArray<UIDragItem *> *)collectionView:(UICollectionView *)collectionView itemsForAddingToDragSession:(id<UIDragSession>)session atIndexPath:(NSIndexPath *)indexPath point:(CGPoint)point API_AVAILABLE(ios(11.0)) {
    return @[[self dragItemForDocumentPageAtIndexPath:indexPath]];
}
```

The method in the above calls, `- dragItemForDocumentPageAtIndexPath:`, takes care of registering the appropriate file representations with the `NSItemProvider` instance that’s ultimately used to instantiate a _single_ `UIDragItem` instance that we return. Due to how the UIKit API is designed, we need to always return an array, even if it only contains one item.

Here’s how the item drop is performed on the collection view:

```objc
- (void)collectionView:(UICollectionView *)collectionView performDropWithCoordinator:(id<UICollectionViewDropCoordinator>)coordinator API_AVAILABLE(ios(11.0)) {
    foreach(item, coordinator.items) {
        let itemProvider = item.dragItem.itemProvider;
        if ([itemProvider hasItemConformingToTypeIdentifier:(NSString *)kUTTypePDF]) {
            [self handlePDFDropForDropItem:item withCoordinator:coordinator];
        } else if ([itemProvider canLoadObjectOfClass:UIImage.class]) {
            [self handleImageDropForDropItem:item withCoordinator:coordinator];
        }
    }
}
```

The `UICollectionViewDropCoordinator` object that’s passed to the delegate when a drop interaction is performed within a collection view contains information about the drop. The `.items` property is an array of `UICollectionViewDropItem` instances, each of which contains a property, `dragItem`, that points to the original item included in the session (you can see that there’s really complicated stuff going on behind the scenes).

So far, the API seems really sensible, but it breaks apart when you consider our use case, where an item in a drop session does not necessarily represent an item to be inserted in the collection view. A user can drag a single-page PDF file from Files and drop it into our Document Editor and everything behaves as expected. But remember how PDFs can contain multiple pages as well? In such a case, the one-to-one relation doesn’t work.

When solving the importing part of this issue, we opted to always delete the placeholder inserted on the collection view when performing a drop via the `UICollectionViewDropPlaceholderContext` as soon as we’re done loading the item from the `NSItemProvider`, and to instead just insert the appropriate items into the collection view manually.

**_Be advised:_** If you call `-[id<UICollectionViewDropPlaceholderContext> commitInsertionWithDataSourceUpdates:]` and the collection view ends up with more items than expected, `UICollectionView` will crash internally. When importing PDFs, always deleting the placeholder works better because then you can manually update the collection view to your liking and not be tied to what the placeholder expects the result to be.

This is not an issue when importing pictures from `Photos.app`, for example, since at that point it _does_ make sense that one drag item represents one picture. No need to worry in that case.

The fact that we can’t have a single drag item represent multiple information units when reasoning about exporting pages out of our Document Editor posed a challenge as well. Dragging a single page out should generate a single-page PDF for the application accepting the drop. But since we’re unable to tell UIKit that a single `UIDragItem` can actually represent multiple information units, dragging multiple pages out of our editor resulted in a single-page PDF being generated for each page exported, which is not ideal.

We tried to circumvent this limitation with a little bit of hackery on our side. Our idea relied on the fact that returning `UIDragItem` instances created with “empty” `NSItemProvider`s made the collection view behave as if the session was still valid (which it technically still is). Unfortunately, the drag source application has no visibility of what the drop destination application decides to do. This means we can’t really rely on this feature working, since every application our user tries to drop stuff on can behave differently, and we have no way to influence the end result once the drag session has left the host app.

For example, in the source app, if the drag delegate methods return a list of `UIDragItem`s but at least one of them was created with an “empty” `NSItemProvider` and a drop is attempted in `Files.app`, none of the valid drag items in the session will be dropped either, effectively behaving as if the drop operation was `UIDropOperationCancel`. This is a decision made by `Files.app` internally.

`Photos.app` does not behave like this. If one of the providers associated with the drag items being dropped is not able to provide information about the item being dropped, `Photos.app` will still import the “valid” items and display a message, “Some Items Not Imported.” Personally, I think this is a nice compromise (way better than canceling the drop operation altogether). It would, however, be even nicer if the source application could play a role in what the end result looks like.

We’ve filed a couple of enhancement requests with Apple for these issues ([41790438][], [43009124][]). Please feel free to duplicate these radars if you think the enhancements would be useful for you.

## Reordering Multiple Items

This section is really small because there’s not much we can do or say about this. Drag and drop just does not support `UIDropOperationMove` operations when the drop session contains multiple items.

We also filed an enhancement request for this feature ([42068699][]), and you can duplicate it if you’d find it useful too.

## Multi-Document Environment

As part of PSPDFKit for iOS, we offer the ability to display multiple documents in a tabbed environment (à la Safari) via the [`PSPDFTabbedViewController`][] class. On PDF Viewer, this is one of our marquee features.

We thought it would be pretty awesome to allow our users to start a drag from one document and drop the pages into another one of the documents opened in that multi-document environment, so we tried implementing it, and we got pretty close to shipping it.

But then we hit a wall, and after a long time debugging the issue and trying to replicate a weird crash within UIKit (`__UIDragSnappingFeedbackGenerator`), we decided to take a step back and really think about what we were doing (or at least trying to do).

As our CEO Peter Steinberger mentioned in his [guest appearance on the Swift by Sundell podcast][], we discovered that our approach to the multi-document display environment is simply not compatible with what the drag-and-drop API expects.

Rendering a PDF is a really complicated task and can take up a lot of memory. Within PSPDFKit, we do a lot of heavy lifting to make sure you can display a PDF in your application with only a couple lines of code — and much of that heavy lifting has to do with keeping our memory profile as low as possible.

One of the strategies we use to keep our memory profile low is exemplified in our implementation of `PSPDFTabbedViewController`: Internally, we don’t maintain a view hierarchy per document, but rather we reuse the entire scaffold and only refresh the contents when the document tab changes (just how you can call `reloadData` on a `UITableView`).

Switching documents for us means we need to reload the internal collection view that displays the list of pages for the active document, which does not play well if you’re in the middle of a drag session. It basically “ends the party” and is effectively undefined behavior territory, which is really frustrating for us because it otherwise works fine three or four times before crashing.

This leaves us with the following options if we want to support this feature in a reliable manner:

- Rewriting our presenting architecture to make reusing components easier without the need of a full reload
- Maintaining a collection view per document
- Writing our own `UICollectionView` replacement class that allows us to manually track the dragging session so that reloading items being presented is not an issue

We’re still debating the correct approach to take here, since this feature would be a _really_ nice addition to our already super-capable Document Editor. In the meantime, here’s a radar you can duplicate: [42180829][].

## Conclusion

Sadly, not much of UIKit changed with iOS 12, so here’s hoping that iOS 13 expands the capabilities of drag and drop, as it is a really powerful, well designed API. As you can see, we don’t really have any complaints, but rather ideas of how it could be improved to add more value to the iOS ecosystem.

At PSPDFKit, we know that a great API is always a delight to work with, so we are really happy with how adding drag-and-drop support to our Document Editor turned out, even if we had to restrict some of the features we had planned.

You can play with the Document Editor drag-and-drop support if you get [PDF Viewer Pro][], and you can [customize][] what can be done with it if you’re an SDK user (you can download a [free trial][] of our SDK to play around with it as well).

[drag and drop]: https://developer.apple.com/ios/drag-and-drop/
[pspdfkit for ios (7.7)]: /blog/2018/pspdfkit-ios-7-7/
[pdf viewer (3.0)]: /blog/2018/pdf-viewer-3-0/
[pdf viewer pro]: /blog/2018/pdf-viewer-3-0/
[about drag and drop]: /blog/2017/drag-and-drop/
[43009124]: http://www.openradar.me/43009124
[41790438]: http://www.openradar.me/41790438
[42068699]: http://www.openradar.me/42068699
[42180829]: http://www.openradar.me/42180829
[`pspdftabbedviewcontroller`]: /api/ios/Classes/PSPDFTabbedViewController.html
[guest appearance on the swift by sundell podcast]: https://www.swiftbysundell.com/podcast/e28
[customize]: /api/ios/Classes/PSPDFDocumentEditorViewController.html#/c:objc(cs)PSPDFDocumentEditorViewController(py)editorInteractiveCapabilities
[free trial]: /try
[Document Editor]: /pdf-sdk/ios/document-editor/
[JavaScript]: /guides/ios/current/features/javascript/
