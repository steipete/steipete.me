---
title: "Document Checkpointing"
description: Checkopoints automatically store data to protect against data loss.
section: blog
author:
  - Peter Steinberger
author_url:
  - https://twitter.com/steipete
date: 2017-10-09 12:00 UTC
tags: Development, Security
published: true
secret: true
---

Our users often spend hours to annotate and review a document, working through hundreds of pages and adding notes, highlights and markings. It's imperative that our software works stable and is reliable - losing this data would be a really bad experience.

With our new Checkpointing feature, data is automatically saved in the background, so even if an event occurs that would normally lead to data loss, we can recover and correctly restore user data.

READMORE

## Why not just save?

You might be wondering why we're not simply triggering `saveDocuemnt` calls to ensure data is not lost. While this works, saving can be an expensive operation. Documents that are protected with a user or owner password always need a complete re-write, which can be expensive, especially when the document is large. If the document is not encrypted, we also have an optimized saving logic that appends to the file - with the drawback that the document will get longer with every call to save. 

Neither option is ideal on a mobile device with constraint resources - so we engineered a 3rd option, which stores unsaved user data in a separate "checkpoint" file on disk. In case of an application crash or exit, the checkpointing logic checks for such a file and automatically restores the unsaved user state, just as it was before the crash event.

Since this requires that the file is in the same location on every startup, this feature is not enabled by default. Please study our [Document Checkpointing Documentation](/guides/ios/current/features/document-checkpointing/) to understand the requirements for this to work.

## PDF Viewer

With PDF Viewer 2.0.1 for iOS and PDF Viewer 2.0.0 for Android, Checkpointing is now enabled by default. Most users will not notice any difference, but in case of a crash we are now able to automatically restore user data.

## PSPDFKit Instant

With Instant, we offer a sync solution which automatically and continuously stores data into the cloud.

 we continuously store data into the cloud, which greatly reduces data loss, however this will not work if there's no internet connection.