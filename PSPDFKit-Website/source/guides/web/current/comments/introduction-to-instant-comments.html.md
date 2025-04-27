---
title: Introduction to Instant Comments
section: developers
theme: web
---

As of PSPDFKit for Web 2020.1, PSPDFKit provides user interface components for viewing, adding, and deleting comments in PDF documents. This feature, Instant Comments, is currently available only if you are using PSPDFKit Instant.

You can use Instant Comments to build collaborative workflows where multiple users can discuss specific sections of a document without ever leaving the viewer. They receive updates in real time thanks to our PSPDFKit Instant engine.

## Licensing

Instant Comments is a separate component in your PSPDFKit license. Without this feature included in your license, your app will not be able to view, search, or add comments. Please [contact our sales team][] to add this feature to your license or ask for a trial license if you want to try out this feature.

## Terminology

Before continuing, let’s first define some terminology as it relates to Instant Comments:

- **root annotation** — This is the annotation to which all the comments in a single thread are linked.
- **comment thread** — This is a group of comments with the same root annotation.
- **comment** — This is a single comment added by any user.

## Introduction

All comments are linked to their respective root annotations. The comments with the same root annotation are part of a single comment thread. There can be two types of root annotations:

- [`MarkupAnnotation`][] — You can start a new comment thread by selecting some text and clicking on ![comment icon][] in the markup annotation inline toolbar. In this case, the markup annotation created will act as a root annotation.

- [`CommentMarkerAnnotation`][] — A comment marker annotation is a new annotation which can be added anywhere in the PDF document and can be used to start comment threads.

## Getting Started

By default, we don’t show the comment tool (![comment icon][]) in the main toolbar. This is because we want you to think about the workflow you want for your users and then decide whether or not you want to add it in the main toolbar. For example, if you want to allow the creation of comments from the main toolbar and disable sticky notes, you can do the following:

```javascript
const toolbarItems = PSPDFKit.defaultToolbarItems
  .concat({ type: "comment" }) // Add comment tool.
  .filter(item => item.type !== "note"); // Remove note tool.

PDPDFKit.load({
  // ...
  toolbarItems
});
```

Note that you will have to add the comment tool in the main toolbar if you want to add comments using comment markers.

## Adding a Comment

Since there are two types of root annotations, there are two ways in which we can add comments using the user interface:

- From the Main Toolbar

![Comment Main Toolbar][]

This method involves the creation of `CommentMarkerAnnotation` before the creation of comments. To add a comment marker, you first need to click on the comment tool (![comment icon][]) in the main toolbar and then choose a destination on the page where you want to add your comment marker. Once you click on the destination, you will see a comment editor where you can add your first comment and start a new thread.

- Using Markup Annotations

![Comment Inline Toolbar][]

If you want to add a comment linked to a text annotation, you can do it using the markup annotation. To do this, create a new markup annotation and click on the comment tool (![comment icon][]) in the inline toolbar. Afterward, you will see a comment editor where you can add your first comment and start the new thread.

Note that, at the moment, we do not support the addition of comments or comment marker annotations using programmatic APIs. This is something that might change in future.

## Deleting a Comment

You can delete an individual comment by clicking on the delete button (![delete icon][]). If all the comments of a thread are deleted, the corresponding root annotation is automatically deleted.

**ℹ️ Note:** Comment editing is not supported in the current version.

## Disabling the Comments UI

If your license includes comments but you want to disable letting the user view and add comments, you can set [`showComments`][] to `false` in [`ViewState`][]:

```js
const initialViewState = new PSPDFKit.ViewState({
  showComments: false
});

const instance = PSPDFKit.load({
  // ... other options
  initialViewState: initialViewState
});
```

## Comment Permissions

There might be situations where you want to disable the creation or deletion of individual comments based on some condition. To do this, you can define the [`isEditableComment`][] function as a configuration option when initializing PSPDFKit. When the return value of the [`isEditableComment`][] method is `false` for a comment, the comment can no longer be deleted by the user. Similarly, [`isEditableComment`][] can be used to determine whether or not a user can reply to existing threads:

```js
PDPDFKit.load({
  // ...
  isEditableComment: comment => {
    return comment.rootId !== rootAnnotationId;
  }
});
```

In the above example, all the comments that have a root annotation with an `id` other than `rootAnnotationId` will be editable.

For every comment thread, [`isEditableComment`][] receives a temporary draft comment with `pageIndex=null`. The `rootId` of this draft comment points to the root annotation of the comment thread. If [`isEditableComment`][] returns `false`, the user won’t be able to add comments in that comment thread:

```js
PDPDFKit.load({
  // ...
  isEditableComment: comment => {
    return comment.pageIndex !== null;
  }
});
```

In the above example, a user can’t add a comment in any comment thread.

In case you want to set the permissions after a PSPDFKit instance has been created, you can use [`instance.setIsEditableComment`][]:

```js
PDPDFKit.load(options).then(instance => {
  instance.setIsEditableComment(comment => {
    return comment.rootId !== rootAnnotationId;
  });
});
```

## Customizing a Comment Block

You can customize the look of a comment block by using CSS. Please make sure you are using the public class names starting with `PSPDFKit-`, as other class names might change in the future and break your application.

For example, if you want to customize the `border-radius` of avatars, you can do that by writing the following CSS:

```css
.PSPDFKit-Comment-Avatar {
  border-radius: 6px;
}
```

You can also show avatars in comment blocks by setting a custom renderer:

```js
PSPDFKit.load({
  customRenderers: {
    CommentAvatar: (comment: Comment) => ({
      node: element,
      append: false // This should always be `false` in this case.
    })
  }
});
```

If you want to change the avatar after the instance has been created, you can use [`setCustomRenderers`][].

## Responsive UI

The UI adapts to the screen size of your browser. In the case of large screens, comment threads are displayed in a sidebar on the right-hand side of a document and are always visible, while on smaller screens, the threads are only visible after you tap on a root annotation.

[`markupannotation`]: https://pspdfkit.com/api/web/PSPDFKit.Annotations.MarkupAnnotation.html
[`commentmarkerannotation`]: https://pspdfkit.com/api/web/PSPDFKit.Annotations.CommentMarkerAnnotation.html
[contact our sales team]: https://pspdfkit.com/sales/
[`showcomments`]: https://pspdfkit.com/api/web/PSPDFKit.ViewState.html#showComments
[`viewstate`]: https://pspdfkit.com/api/web/PSPDFKit.ViewState.html
[`iseditablecomment`]: https://pspdfkit.com/api/web/PSPDFKit.Configuration.html#isEditableComment
[`instance.setiseditablecomment`]: https://pspdfkit.com/api/web/PSPDFKit.Instance.html#addEventListener
[`setcustomrenderers`]: https://pspdfkit.com/api/web/PSPDFKit.Instance.html#setCustomRenderers
[comment icon]: /images/guides/web/comments/introduction-to-instant-comments/comment-icon.png#img-icon
[comment main toolbar]: /images/guides/web/comments/introduction-to-instant-comments/comment-main-toolbar.png
[comment inline toolbar]: /images/guides/web/comments/introduction-to-instant-comments/comment-inline-toolbar.png
[delete icon]: /images/guides/web/comments/introduction-to-instant-comments/delete-icon.png#img-icon
