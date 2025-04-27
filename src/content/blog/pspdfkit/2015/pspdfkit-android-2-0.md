---
title: PSPDFKit 2.0 for Android
pubDate: 2015-12-07T12:00:00.000Z
description: "We’re proud to announce the immediate availability of PSPDFKit\_2.0 for Android with support for creating and editing annotations. We know a lot of people were waiting for this release, and we took the time to ensure it’s great. Here are the highlights. READMORE"
tags:
  - pspdfkit
source: pspdfkit.com
AIDescription: true
---


We’re proud to announce the immediate availability of PSPDFKit 2.0 for Android with support for creating and editing annotations. We know a lot of people were waiting for this release, and we took the time to ensure it’s great. Here are the highlights.
READMORE

## Annotation Creation and Editing

You can create and edit, Highlight, Underline, StrikeOut, Squiggle, Ink, Note, and FreeText annotations. These are the most common types, and over the next few months we’ll add the remaining types to reach feature parity with PSPDFKit for iOS.

Our focus has been on a great experience, and things work just as you would expect it to be. Annotations can be created, moved around, resized or re-colored. The user interface has been designed with customizability in mind, and there are new configuration classes to fine-tune both features and the used theme.

Annotations are saved into the PDF document and are compatible with any compliant viewer, including PSPDFKit for iOS.

### Ink Annotations

![Adding ink annotation](/assets/img/pspdfkit/2015/pspdfkit-android-2-0/add_ink_annotation.gif)

### Note Annotations

![Adding note](/assets/img/pspdfkit/2015/pspdfkit-android-2-0/add_note.gif)

### Free Text Annotations

![Free text](/assets/img/pspdfkit/2015/pspdfkit-android-2-0/free_text.gif)

### Highlight Annotations

![Highlighting text selection](/assets/img/pspdfkit/2015/pspdfkit-android-2-0/highlight_text_selection.gif)

## Exposing Annotation Objects

Annotations can be queried via the new `AnnotationProvider` class, which you can retrieve from a document by calling `PSPDFDocument#getAnnotationProvider`. To read annotations you can use the synchronous `AnnotationProvider#getAnnotations` method or it’s asynchronous version `AnnotationProvider#getAnnotationsAsync` (which returns an RxJava `Observable`). All supported annotation types have a simple API, exposed via their matching Java classes inside the `com.pspdfkit.annotations` package. (For example, `HighlightAnnotation`, `InkAnnotation`, `FreeTextAnnotation`, `NoteAnnotation`, and so on.)

## Writing PDF Documents

Annotations can be saved back into the document. Usually this is simply a file, however we also support data providers which allow on-the-fly decryption. With version 2, we added a new `WriteableDataProvider` which allows saving into such encrypted files as well. Saving can be triggered from the document class, and we provide both synchronously and asynchronously variants.

## Evolving API and Android Compatibility

We continue to watch the Android landscape to decide what API range makes sense to support, and moved the minimum API level to 16 (Android 4.1 Jelly Bean). This allows us to enable certain security options like ASLR that were not fully supported in API level 15 or below. We've also used the major version step to remove some lesser-used API calls, most of them have been replaced with better equivalents. [See the changelog for details.](/changelog/android/#2.0.0)

## Roadmap

This is just the beginning of the 2.x series with annotation support. We have an exciting roadmap ahead but are also looking forward [to your feedback](mailto:peter+android@pspdfkit.com). Tell us what you like, dislike and where you would want us to go next.
