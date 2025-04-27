---
title: "PSPDFKit 4.0 for Android"
description: Today we're releasing PSPDFKit 4.0 for Android!
preview_image: /images/blog/2017/pspdfkit-android-4-0/pspdfkit-android-4-header.png
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/flashmasterdash
date: 2017-10-12 12:00 UTC
tags: Android, Features, Products
published: true
---

Say hello to PSPDFKit 4.0 for Android! Our newest release of PSPDFKit for Android is fully compatible with Android Oreo and adds Digital Signatures, an Ink Eraser, Data Checkpointing, and a refresh look and feel. With version 4, we modernized our API and made it simpler to use. After carefully studying the Android OS distribution, we raised [the minimum required version to Android 4.4 (API Level 19)](/guides/android/current/announcements/version-support/). Please refer to our detailed [Android 4.0 Migration Guide](/guides/android/current/migration-guides/pspdfkit-4-migration-guide/) for upgrading.

READMORE

## Digital Signatures

The Digital Signatures component has landed and is now available on PSPDFKit for Android, allowing you to digitally sign and verify PDF documents with field-tested cryptographic software.

With a completely new package of classes, designed specifically for Digital Signatures on Android, you can sign any PDF with just a couple lines of code. Further, our powerful signature verification API gives you all the information you require to ensure that a PDF document is safe to use.

Since we understand that Digital Signatures is a complex topic, we put a lot of thought into building our user interface so that signing documents for your users is an easy and delightful experience.

Check out our [Digital Signatures online guide](/guides/android/current/features/digital-signatures) that describes in detail how to use our signing and verification APIs.

<video src="/images/blog/2017/pspdfkit-android-4-0/digital-signature-android.mp4"  width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true" ></video>

## Ink Eraser

Easy to draw – easy to erase. With our latest annotation tool, the Ink Eraser, it is as simple to recover from a drawing mistake as it was to make it.

We rewrote large parts of our ink annotation renderer to enable fast and intuitive use of the eraser, while also increasing the overall ink drawing performance. Located directly inside the annotation toolbar, it’s just a tap away.

And if you would like to integrate the eraser into your own UI, we provide [just the APIs you need](/guides/android/current/annotations/custom-annotation-editing-controls/).

<video src="/images/blog/2017/pspdfkit-android-4-0/ink-eraser-android.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Checkpointing

Up until now, PSPDFKit used the Android component lifecycle methods alone to control when to load and save your document. While this mechanism works in all standard situations, it leaves open the chance to lose data during unexpected app terminations or device shutdowns.

With PSPDFKit 4.0 for Android, we are introducing Document Checkpointing as an ancillary system to alleviate the negative effects of interrupted app lifecycles. With Checkpointing activated, changes to your document are persisted in the background and automatically restored whenever data-loss occurs.

Since common saving techniques either increase the PDF file with every change or take a lot of time and energy to rewrite the entire PDF, we wrote our checkpointing system to write data into a secure storage, which is decoupled from the PDF. This allows for short checkpointing intervals, while keeping the original PDF in a clean state.

You can read more about all the details in our [Document Checkpointing guide][].

## New Icon Language

We love great design! That’s why we’re rolling out a new icon language to all our products across Android, iOS, and the Web. PSPDFKit 4.0 for Android ships with icons that blend Google’s material design languge with our own – in perfect harmony. We hope you enjoy the new icons as much as we do!

<img title="New Icon Language" src="/images/blog/2017/pspdfkit-android-4-0/annotation-toolbar.png">

## Framework Modernization

It’s been more than two and a half years since we released version 1.0 of PSPDFKit for Android and it still feels like it was yesterday. With the [many great new features and changes](https://pspdfkit.com/changelog/android/) since day one, we saw the need for modernizing some of our framework internals and public APIs so that PSPDFKit is prepared for years to come.

We took a look at other renowned frameworks, studied the prevailing conventions on Android, Java, and Kotlin, and eventually settled on an easy to understand and easy to use style for all our existing and new APIs. To ensure a smooth transition to our new APIs, we prepared an [extensive migration guide to PSPDFKit 4.0](https://pspdfkit.com/guides/android/current/migration-guides/pspdfkit-40-migration-guide/).

## Many More Changes

PSPDFKit 4.0 for Android is our next big milestone and we’re happy to share it today.

While this blog post outlines the major changes, there are many more improvements, changes, and fixes in this release. Check out the [PSPDFKit for Android changelog](https://pspdfkit.com/changelog/android/#4.0.0) for the full story.

<!-- References -->

[Document Checkpointing guide]: https://pspdfkit.com/guides/android/current/features/document-checkpointing/
