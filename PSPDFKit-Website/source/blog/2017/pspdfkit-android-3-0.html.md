---
title: "PSPDFKit 3.0 for Android"
description: Today we're releasing PSPDFKit 3.0 for Android!
preview_image: /images/blog/2017/pspdfkit-android-3-0/v3_0-hero.png
section: blog
author:
  - Tomáš Šurín
  - Jernej Virag
  - Ivan Škorić
author_url:
  - https://twitter.com/tomassurin
  - https://twitter.com/jernejv
  - https://twitter.com/skoric_
date: 2017-04-13 12:00 UTC
tags: Android, Features, Products
published: true
---

Today we are happy to announce the release of PSPDFKit 3.0 for Android, finally 😃 bringing support for PDF Forms to our Android framework! Version 3.0 is a huge update, coming with a large set of performance and dependency updates for an even smoother user experience while making sure the library is future-proof.

## Forms

Forms are an integral part of the PDF workflow. After offering form support on iOS since 2013, we took everything we learned about PDF Forms and reimagined our Forms components with a more robust, cross platform foundation. The new Forms architecture already shipped on iOS with [PSPDFKit 6.5 for iOS](http://pspdfkit.com/blog/2017/pspdfkit-ios-6-5/) and will soon be available for [PSPDFKit for Web](https://pspdfkit.com/web/). By using a common foundation across platforms, we can ensure a more robust codebase and fixes propagating across platforms much quicker than before.

For you, this means that you can easily add support for PDF Forms and features like push buttons, checkboxes, radio buttons, combo boxes, list boxes and text fields to your app. Our extensive set of UI controls for all supported form elements will help you to provide an excellent user experience without having to deal with the messy details of PDF Forms.

![Form filling](/images/blog/2017/pspdfkit-android-3-0/form-filling.gif)

And if you still want to: All of our form components and UI elements are backed by our [powerful forms API](https://pspdfkit.com/guides/android/current/forms/form-filling/), which gives you the ultimate control to build your own features around forms.

### Easy Form Filling

The new [`FormEditingBar`] is here to make form filling as easy as possible. It is displayed at the bottom of the screen or on top of the active soft keyboard when editing forms. It features buttons for navigating form elements in the tab order which is calculated for you according to contents of your PDF.

We've also added extensive support for keyboard navigation – like tabbing between form fields, toggling form value with the space key, etc. It is even possible to fill out forms solely by using hardware keyboard — without touching the screen at all.

## New PDF Actions

We are introducing support for additional PDF actions. Specifically, we’ve added support for [`HideAction`],  used for toggling annotation visibility flags, as well as [`SubmitFormAction`] and [`ResetFormAction`]. Our default [`ActionResolver`] has been revamped with an ability to execute chained actions.

![Hide action](/images/blog/2017/pspdfkit-android-3-0/hide-action.gif)

## Dynamic Configuration Changes

Many of our users have been asking for the ability to change our framework configuration at runtime. The main use case is switching themes (night mode) or changing page scrolling parameters. Previously, you needed to manually restart [`PdfActivity`] with a new configuration to implement this.

![Night mode](/images/blog/2017/pspdfkit-android-3-0/night-mode.gif)

To apply a new configuration, simply call [`PdfActivity#setConfiguration`], which will restart the [`PdfActivity`] and restore its state for you. Our configuration builders can now be initialized from an existing configuration for you to change existing properties easily.

For more information, see `DynamicConfigurationExample` for an example of how to replace configuration in a [`PdfActivity`] at the runtime. When you are using custom activity with a [`PdfFragment`], see `CustomFragmentDynamicConfigurationExample` for an example of replacing configuration in that case.

## Simplified Framework Initialization

We’ve streamlined the process of initializing PSPDFKit. The framework will now initialize automatically if you add the license key to your `AndroidManifest.xml` via a `<meta-data>` tag:

```AndroidManifest.xml
<application>

    <meta-data
        android:name="pspdfkit_license_key"
        android:value="@string/PSPDFKIT_LICENSE_KEY"/>

    ...
</application>
```

As a consequence we’ve now dropped the license as a required parameter from [`PdfActivityConfiguration`] and [`PdfConfiguration`].

Using the `<meta-data>` tag is the new recommended approach, but if you require to do initialization manually, check out our [PSPDFKit 3.0 migration guide](https://pspdfkit.com/guides/android/current/migration-guides/pspdfkit-30-migration-guide/) which describes how to do that.

## Finger on the Pulse

PSPDFKit is a living framework, with many customers depending on its longevity. Hence, we used the 3.0 release to rework large parts of PSPDFKit in order to keep up that promise. You can read about all the details in our [3.0 migration guide](https://pspdfkit.com/guides/android/current/migration-guides/pspdfkit-30-migration-guide/) – here's an overview of the biggest changes.

- We improved naming of classes (`PSPDF` prefix be gone!) and switched capitalization to be more in line with other Android and Java APIs. For example, `PSPDFActivity` is now called `PdfActivity` and `PSPDFDocument` is now `PdfDocument`.
- We moved our static `openDocument` methods from the `PSPDFKit` class directly onto the [`PdfDocument`].
- [RxJava](https://github.com/ReactiveX/RxJava) was updated to version 2. This greatly improves performance, stability, and type safety of PSPDFKit.
- And many more minor improvements to our API.

## Small Improvements

With such a big release, it's only natural that we also fixed/improved many minor things. To name a few:

- Free-text annotations now use autocorrection.
- Bitmap in stamp annotation can now be re-setted via [`StampAnnotation#setBitmap`].
- We lowered memory usage and improved stability in low memory situations.
- We fixed few small issues full-text search issues in [`PdfLibrary`] concerning FTS5 SQLite search engine.
- We fixed many corner cases in view state restoration.

This blog post covers just a small fraction of all the things we packed into this release. If you're interested in all the details, see [the full list of changes in PSPDFKit 3.0 for Android](/changelog/android/#3.0).


[`PdfFragment`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfFragment.html
[`PdfActivity`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html

[`FormField`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/forms/FormField.html
[`FormElement`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/forms/FormElement.html
[`FormProvider`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/forms/FormProvider.html
[`PdfDocument#getFormProvider`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/PdfDocument.html#getFormProvider()

[`setSelectedFormElement`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfFragment.html#setSelectedFormElement(com.pspdfkit.forms.FormElement)
[`getSelectedFormElement`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfFragment.html#getSelectedFormElement()
[`exitCurrentlyActiveMode`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfFragment.html#exitCurrentlyActiveMode()
[`FormManager`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/special_mode/manager/FormManager.html
[`FormEditingBar`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/forms/FormEditingBar.html

[`ActionResolver`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/actions/ActionResolver.html
[`HideAction`]: https://staging.pspdfkit.com/api/android/reference/com/pspdfkit/annotations/actions/HideAction.html
[`SubmitFormAction`]: https://staging.pspdfkit.com/api/android/reference/com/pspdfkit/annotations/actions/SubmitFormAction.html
[`ResetFormAction`]: https://staging.pspdfkit.com/api/android/reference/com/pspdfkit/annotations/actions/ResetFormAction.html

[`PdfActivity#setConfiguration`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html#setConfiguration(com.pspdfkit.configuration.activity.PdfActivityConfiguration)

[`PSPDFKit#initialize`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/PSPDFKit.html#initialize(android.content.Context,%20java.lang.String)
[`PdfActivityConfiguration`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.html
[`PdfConfiguration`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/PdfConfiguration.html

[`PSPDFKit`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/PSPDFKit.html
[`PdfDocument`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/PdfDocument.html
[`DocumentSource`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/DocumentSource.html

[`getColor`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/Annotation.html#getColor()
[`setColor`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/Annotation.html#setColor(int)
[`getFillColor`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/Annotation.html#getFillColor()
[`setFillColor`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/Annotation.html#setFillColor(int)

[`StampAnnotation#setBitmap`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/StampAnnotation.html#setBitmap(android.graphics.Bitmap)
[`PdfLibrary`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/library/PdfLibrary.html
