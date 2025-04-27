---
title: "Sharing Annotations with Instant&nbsp;JSON"
description: Instant JSON is a low-tech way to share annotations between documents
preview_image: /images/blog/2017/instant-json/instant-json.png
preview_video: /images/blog/2017/instant-json/instant-json-video.mp4
section: blog
author:
  - Peter Steinberger
author_url:
  - https://twitter.com/steipete
date: 2017-11-23 12:00 UTC
tags: Instant, New Release, Products
published: true
---

With today’s releases, we’re introducing a new, open JSON format that is supported on all platforms. Instant JSON is our approach to bringing annotations into [a sane format](/guides/server/current/importing-exporting/instant-json/) while ensuring full compatibility with the PDF format. It is [fully documented](/guides/server/current/importing-exporting/instant-json/#the-format) and backward compatible.

READMORE

### PSPDFKit Instant or Instant JSON?

[Instant](/instant) is our real-time, multi-user sync solution. It works across [all our platforms](/pdf-sdk/) and is the perfect technology if you’re building an app where protecting against data loss, having your data in sync, and/or allowing multiple users to work on the same document is important (i.e. an app for collaborating during board meetings).

We’ve engineered Instant to work reliably, even when you’re on a slow or flaky network connection. Additionally, network usage is highly optimized and documents can still be edited even [when a user is offline](/guides/ios/current/pspdfkit-instant/offline-support/). If you add images or stamps, they are treated as separate assets and fetched separately, so that someone adding large images doesn’t block the sync process.

Instant uses [PSPDFKit Server](/guides/server/current/pspdfkit-server/overview/) for coordination and storage. It’s designed for easy deployment either on-premises or to any of the major cloud providers.

[We are continually improving the Instant SDK](/blog/2017/instant-fall-update/), and new features are added with almost every release. Advanced features, such as detailed audit logging, document encryption, and presence (i.e. the ability to see if somebody else is also looking at the document) are already planned for 2018.

### Instant JSON

Not every use case requires Instant’s reliability, file management, multi-user syncing/merging, or audit logging. As such, we built Instant JSON for cases where there’s no central server, or where annotations do not need to be shared between different users. Instant JSON collects any and all changes to a PDF (including annotation additions, edits, and deletions) and can apply this changeset to a PDF stored on a different device without suffering any data loss.

Instant JSON needs to be applied before the document is presented, as it’s not designed to allow real-time updates.

PDF changes such as annotations are stored by Instant JSON in a separate JSON file. This means that a PDF document will only need to be transferred once and all changes will be added as an overlay to the existing PDF. This approach significantly reduces bandwidth, since you only need to transfer the JSON file instead of the complete PDF.

Instant JSON comes with a [detailed specification](/guides/server/current/importing-exporting/instant-json/), including [Flow type declarations.](/guides/server/current/importing-exporting/instant-json/#the-format)

### Availability

Instant JSON is available with the following releases:

* [PSPDFKit 7.2 for iOS](/changelog/ios/#7.2.0)
* [PSPDFKit 4.2 for Android](/changelog/android/#4.2.0)
* [PSPDFKit 2.2 for macOS](/changelog/macos/#2.2.0)
* [PSPDFKit for Web 2017.8](/changelog/web/#2017.8)

Note: Older versions of PSPDFKit for Web use an older version of this JSON format. Make sure you update all products and reference our [Web 2017.8 Migration Guide.](/guides/web/current/migration-guides/2017-8-migration-guide/)
