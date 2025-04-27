---
title: "PSPDFKit for Web 2017.2"
description: Introducing PSPDFKit for Web 2017.2.
section: blog
author:
  - Alexei Sholik
  - Nicolas Dular
author_url:
  - https://twitter.com/true_droid
  - https://twitter.com/NicolasDular
date: 2017-02-17 12:00 UTC
tags: Web, Products
published: true
---

We are pleased to introduce PSPDFKit for Web 2017.2, our latest release which adds an HTTP API for
working with annotations in your documents.

READMORE

## HTTP API For PDF Annotations

Previously, it was only possible to create and update annotations via the web UI. With this
release we're introducing a backend API that allows operations such as creating new annotations,
and updating or deleting existing ones.

To get a taste of the new functionality, let’s have a look at how a new note annotation can first
be created and then have its text changed using the new HTTP API. Assuming we have a document
with the ID `abc`, we'll send the following HTTP request to the server:

```
POST /api/documents/abc/annotations
Authorization: Token token="<secret token>"
Content-Type: application/json
Content-Length: 198

{
  "bbox": [146.89599609375, 383.48397827148438, 24, 24],
  "opacity": 1,
  "pageIndex": 1,
  "text": "This is a yellow note annotation",
  "type": "pspdfkit/note",
  "v": 1
}
```

The server will return the status `200 OK` with a JSON containing the created annotation’s ID:

```json
{"data": {"annotation_id": <annotation_id>}}
```

Now, in order to update the annotation, we `PUT` new content to
`/api/documents/abc/annotations/<annotation_id>` (notice that we’ve updated the `text` in the JSON
below):

```
PUT /api/documents/abc/annotations/<annotation_id>
Authorization: Token token="<secret token>"
Content-Type: application/json
Content-Length: 178

{
  "bbox": [146.89599609375, 383.48397827148438, 24, 24],
  "opacity": 1,
  "pageIndex": 1,
  "text": "Updated text",
  "type": "pspdfkit/note",
  "v": 1
}
```

The server will return the status `200 OK`, indicating that the operation has succeeded.

You can find detailed information about the new endpoints in our guide page on [Managing
Documents](https://pspdfkit.com/guides/web/2017.2/backend-integration/managing-documents/#fetching-document-annotations).

## Migrating to String Document IDs

This release also addresses an inconsistency where some components expected a numeric document ID
while others expected a string. From now on the server always returns document IDs as strings. It
will still accept numeric IDs and log a deprecation warning to the console. Starting with the next
release, numeric document IDs will be treated as errors.

## Improving the User Experience

One of the biggest user experience improvements in this release is the ability to change annotation tool
settings—like color or opacity values—before starting the annotation process. Previously, these values could
only be adjusted after the annotation has already been created.

<a href="/web">
  <img src="/images/blog/2017/pspdfkit-web-2017-2/creating-annotations.gif" alt="Creating annotations" />
</a>

It is now also possible to zoom in, out and back to page-fit via
keyboard shortcuts (using `CMD +`, `CMD -`, and `CMD 0` on a Mac and `CTRL +`, `CTRL -`, and `CTRL 0` on a PC, respectively). We also added the shortcut `CMD G` on macOS which pops up the search form that got introduced
in [2017.1](https://pspdfkit.com/blog/2017/pspdfkit-web-2017-1/).

## Documentation & Troubleshooting

We've greatly improved documentation. If you have any issues please read the [Troubleshooting](/guides/web/2017.2/pspdfkit-for-web/troubleshooting/) guide and use the new `pspdfkit:debug` debug mode when [contacting us on support](/support/request).

The new [Backup and Recovery](/guides/web/2017.2/deployment/backup-and-recovery/) section explains our recommended approach to backing up data. PSPDFKit Server uses PostgreSQL as data store, while binary assets including PDFs are stored in a Docker volume. We recommend that you take backups of both on a regular basis.

## Other Improvements

We strive to continuously improve every aspect of the product, be it performance, customer
experience, or documentation quality. Each release includes at least a few such improvements in
addition to the bigger features that get highlighted in our announcements. Take a look at the latest
[changelog](https://pspdfkit.com/changelog/web/#2017.2) to find out more.
