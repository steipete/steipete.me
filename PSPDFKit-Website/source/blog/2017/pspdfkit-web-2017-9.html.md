---
title: "PSPDFKit for Web 2017.9"
description: "Announcing PSPDFKit for Web 2017.9, Interactive Forms, Instant Layers, a Responsive Toolbar, and Headless Mode"
preview_image: /images/blog/2017/pspdfkit-web-2017-9/forms.png
section: blog
author:
  - Philipp Spiess
author_url:
  - https://twitter.com/PhilippSpiess
date: 2017-12-14 12:00 UTC
tags: Web, Products
cta: web
published: true
---

Today we’re excited to bring PSPDFKit for Web a step closer to feature parity with our other SDK platforms. With the release of PSPDFKit for Web 2017.9, we now support displaying, filling, and submitting PDF forms. We’re also excited to release Instant layers for PSPDFKit Server, which make it easier to project advanced access control systems onto PSPDFKit Instant. Please refer to our [Server][Server Changelog] and [Web changelogs][Web Changelog] for a complete list of features and bug fixes.

To update your application, make sure to check out our [2017.9 Migration Guide](https://pspdfkit.com/guides/web/current/migration-guides/2017-9-migration-guide/).

## Interactive Forms

<video src="/images/blog/2017/pspdfkit-web-2017-9/forms.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

Filling out forms is integral to many PDF workflows, in addition to being one of PSPDFKit for Web’s most requested features. After adding forms to PSPDFKit for iOS in 2013 and PSPDFKit for Android [earlier this year][PSPDFKit 3.0 for Android], we’re proud to announce support in PSPDFKit for Web as well, making it possible to view, fill out, and submit AcroForm PDFs with ease.

The most common PDF form elements — checkboxes, radio buttons, push buttons, list boxes, combo boxes, and text fields — are fully supported, and work with both desktop and mobile layouts.

Because we use the power of the HTML, assistive browser technologies like tab navigation or automatic form filling work out of the box. For mobile devices, this means users will have access to advanced form navigation, such as the previous and next field buttons.

We’ve compiled all the necessary information about interactive forms in our [form guides][].

<video src="/images/blog/2017/pspdfkit-web-2017-9/form-filling.mp4" width="400" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

### Forms Support in PSPDFKit Instant

[PSPDFKit Instant][] adds collaboration features to your PSPDFKit-powered app. When uploading a PDF with form elements to Instant, all filled-in values are synchronized through the PSPDFKit Instant server. This allows for collaborative form filling across multiple devices or even different users. You can use this to enable your users to do much more with PDF documents; whether it’s through helping others fill out a gigantic tax report, reviewing order forms together, or staying up to date on procedure checklists and progress, form support for PSPDFKit Instant opens up a broad new set of possibilities.

<video src="/images/blog/2017/pspdfkit-web-2017-9/form-instant.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

### New PDF Actions

To fully support forms, we also added support for two new PDF Actions: [`ResetFormAction`][] and [`SubmitFormAction`][]. Form submission is a crucial part of many workflows and is thus supported from the get-go. You can find more information about the form submission process in our [Form Submission][] guide.

<video src="/images/blog/2017/pspdfkit-web-2017-9/form-reset.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Instant Layers

We’re also excited to add support for Instant layers. Instant layers let you map your document permissions approach to [PSPDFKit Instant][]-backed documents. Each annotation or form value is stored in a named layer, meaning that you can allow granular access: You can make annotations accessible by every collaborator, by certain groups, or even only by single users.

Layers enable faster access to your PDF documents when shared with a larger group of users because they are only written to the database once an annotation is modified or a form is filled out.

## Responsive Toolbar

With each release of PSPDFKit, we add the most requested features. Because space on the toolbar is limited, we’re adding a new special type of toolbar item: the responsive group. A responsive group combines multiple toolbar items into one button when a specific condition is matched (for example, the screen’s width is underneath a certain threshold). You can learn how to create custom responsive groups in our [Configure the Toolbar][] guide.

The new “Annotate” toolbar item now makes use of this technique. It will hide all annotation tools on small screens in favor of just one button, and when it is pressed, the different annotation tools are displayed.

<video src="/images/blog/2017/pspdfkit-web-2017-9/annotate-toolbar.mp4" width="484" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## No UI? No Problem!

The new [`headless`] configuration option allows you to use PSPDFKit for Web without loading a user interface. This can be helpful if all you want to do is extract metadata from a PDF file or edit a document programmatically.

For a complete list of changes, check out the [PSPDFKit for Web 2017.9][Web Changelog] and [PSPDFKit for Server 2017.9][Server Changelog] changelogs.

[Server Changelog]: /changelog/server/#2017.9
[Web Changelog]: /changelog/web/#2017.9
[PSPDFKit 3.0 for Android]: /blog/2017/pspdfkit-android-3-0/
[form guides]: /guides/web/current/forms/introduction-to-forms/
[`ResetFormAction`]: /api/web/PSPDFKit.Actions.ResetFormAction.html
[`SubmitFormAction`]: /api/web/PSPDFKit.Actions.SubmitFormAction.html
[Form Submission]: /guides/web/current/forms/form-submission/
[PSPDFKit Instant]: /instant
[Configure the Toolbar]: /guides/web/current/customizing-the-interface/customizing-the-toolbar/
[`headless`]: /api/web/PSPDFKit.Configuration.html#headless
