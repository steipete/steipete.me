---
title: How Can I Hide or Customize the Action Sheet When Long Pressing on a Link?
section: knowledge-base
---

By default PSPDFKit shows an action sheet (menu) when long pressing on a link.

This action sheet shows different options depending on whether the link is a web URL, an internal page link, or has some other PDF action. For web URLs, the action sheet allows the user to add the link to Safari Reading List or share it using the share sheet (`UIActivityViewController`).

You can prevent PSPDFKit from showing this action sheet. You could then show your own action sheet or other UI.

1. [Register a subclass of PSPDFPageView](/guides/ios/current/getting-started/overriding-classes/)
1. Override  [showLinkPreviewActionSheetForAnnotation:fromRect:animated:](/api/ios/Classes/PSPDFPageView.html#/c:objc(cs)PSPDFPageView(im)showLinkPreviewActionSheetForAnnotation:fromRect:animated:)
1. Check whether you want to show the action sheet. Call `super` if you do. If you don’t, don’t call `super` and return `NO`/`false`.
