---
title: "Annotation Replies and Reviews"
description: Introducing annotation replies and reviews in PSPDFKit 7.5 for iOS and PSPDFKit 4.5 for Android.
preview_image: /images/blog/2018/annotation-replies-and-reviews/replies-header.png
section: blog
author:
  - Douglas Hill
author_url:
  - https://twitter.com/qdoug
date: 2018-04-11 12:00 UTC
tags: Products, iOS, Android
cta: ios
published: true
---

The PDF standard allows documents to contain embedded discussions, thereby facilitating a wide range of document workflows. Today we’re delighted to bring full support for embedded discussions to mobile in [PSPDFKit 7.5 for iOS][iOS changelog], [PSPDFKit 2.5 for macOS][macOS changelog] and [PSPDFKit 4.5 for Android][Android changelog].

READMORE


## Reviewing PDF Documents

Many PDF viewers can display single notes or comments in a document, but this is a messy format for conversation. For example, if a copy editor leaves a comment on a particular paragraph, there’s no easy way for the author to respond to it in place. With multiple comments scattered across the page, it quickly becomes near impossible to piece together the flow of conversation — something which is not at all conducive to discussion and quality output.

An option for people who don’t want to deal with the above is to have an exchange take place in a different channel, such as email. However, this can quickly become convoluted and chaotic; you’ll either need to keep quoting bits of text to be clear what’s being talked about, or else you’ll need to be hyperspecific, e.g. “the third paragraph after the big diagram on page six doesn’t make sense.”

## Replies in PSPDFKit

Replies within a PDF make having a thoughtful conversation directly in the context of the document under review a straightforward process. Anyone can keep up with the flow of conversation and see exactly which detail in the document is being discussed.

PSPDFKit’s new built-in support allows for exactly this: Users can view, search, and add comments to a discussion in a document with a vibrant, modern user interface. Bringing this to mobile means everyone can have their say, regardless of where they are and what device they’re using.

The UI has been designed to perfectly blend into iOS:
<video src="/images/blog/2018/annotation-replies-and-reviews/ios-replies.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

On Android, we use a Material-design style dialog:
<video src="/images/blog/2018/annotation-replies-and-reviews/android-replies.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

And because you often don’t have time to type lengthy responses on the go, the review feature makes it easy to give feedback. Users can leave simple review states on any comment: accepted, completed, cancelled, or rejected.

<div class="row">
  <div class="col-md-6">
    <img src="/images/blog/2018/annotation-replies-and-reviews/ios_set_status_menu.png" alt="iOS Set Status Menu" width="100%">
  </div>
  <div class="col-md-6">
    <img src="/images/blog/2018/annotation-replies-and-reviews/android_set_status_menu.png" alt="Android Set Status Menu" width="100%">
  </div>
</div>

With a simple tap, you can quickly see the names of everyone who left a review.

<div class="row">
  <div class="col-md-6">
    <img src="/images/blog/2018/annotation-replies-and-reviews/ios_expanded_review_summary.png" alt="iOS Expanded Review Summary" width="100%">
  </div>
  <div class="col-md-6">
    <img src="/images/blog/2018/annotation-replies-and-reviews/android_expanded_review_summary.png" alt="Android Expanded Review Summary" width="100%">
  </div>
</div>

## Technical Details

PSPDFKit also provides a low-level API for programmatic access to the properties stored in the PDF, enabling you to build custom solutions on top of replies and reviews. PSPDFKit implements annotation replies and reviews conforming to the PDF specification and is [fully compatible with the same features in Adobe Acrobat][Comments in Adobe Acrobat].

You can read more about these details in our [Annotation Replies and Reviews guides for iOS][iOS guide] [and Android][Android guide].

To see of all the features, improvements, and changes in detail, check out our [iOS][iOS changelog] and [Android][Android changelog] changelogs.

[iOS changelog]: /changelog/ios/#7.5.0
[macOS changelog]: /changelog/macos/#2.5.0
[Android changelog]: /changelog/android/#4.5.0
[iOS guide]: /guides/ios/current/annotations/replies/
[Android guide]: /guides/android/current/annotations/replies/
[Comments in Adobe Acrobat]: https://helpx.adobe.com/acrobat/using/comments.html
