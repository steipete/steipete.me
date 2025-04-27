---
title: "PSPDFKit 4.4 for Android"
description: "Today we're releasing PSPDFKit 4.4 for Android!"
preview_image: /images/blog/2018/pspdfkit-android-4-4/pspdfkit-android-4-4-header.png
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/flashmasterdash
date: 2018-03-09 11:00 UTC
tags: Android, Products, Features
published: true
---

Today we’re shipping PSPDFKit 4.4 for Android — a mixed feature and optimization release. This release features an **annotation overlay mode**, **programmatic form creation**, and **support for external signature providers**. READMORE This blog post is just a preview of the biggest changes in 4.4. For a full list of changes, head over to our [changelog for PSPDFKit 4.4 for Android](https://pspdfkit.com/changelog/android/#4.4.0).

## Annotation Overlay Mode

With PSPDFKit 4.4, we’re introducing a new way of displaying annotations on the screen. Prior to this release, annotations were always rendered to the page bitmap together with the rest of the page content. While this is highly memory efficient, it comes at the cost of responsiveness when selecting annotations. The new annotation overlay mode allows you to selectively keep annotations inside Android’s view hierarchy, making selecting and updating annotations practically instantaneous.

![Annotation Overlay Mode](/images/blog/2018/pspdfkit-android-4-4/annotation-overlay.png)

A new simple API gives your app full control over which annotations should be pulled into overlay mode and which annotations should be rendered together with the page:

[==

```kotlin
// Pull all supported annotations into the overlay mode.
fragment.setOverlaidAnnotationTypes(EnumSet.allOf(AnnotationType::class.java))

// You can also select specific annotations that should be in overlay mode.
fragment.setOverlaidAnnotations(listOf(inkAnnotation))
```

```java
// Pull all supported annotations into the overlay mode.
fragment.setOverlaidAnnotationTypes(EnumSet.allOf(AnnotationType.class));

// You can also select specific annotations that should be in overlay mode.
fragment.setOverlaidAnnotations(Collections.singletonList(inkAnnotation));
```

==]

For more information about the overlay mode, have a look at our new [Annotation Overlay Mode guide](https://pspdfkit.com/guides/android/current/annotations/annotation-overlay-mode).

## Form Creation

PSPDFKit 4.4 comes with a powerful form builder API that enables you to programmatically create PDF AcroForms in your app. With only a few lines of code, you can create interactive forms inside your app.

![Form Creation](/images/blog/2018/pspdfkit-android-4-4/form-creation.png)

Form creation works for all supported form element types, namely: text input fields, checkboxes, radio buttons, push buttons, lists and combo lists, and signature form elements. We took special care to make the API simple to use — all the heavy lifting happens behind a convenient builder pattern. Here’s an example:

[==

```kotlin
// Each form element can be configured using a builder.
val textConfig = TextFormConfiguration.Builder(0, boundingBox)
    .setText(preFilledName)
    .build()

// Adding the form element to the page will automatically
// create a form field.
val textFormField = document.formProvider
    .addFormElementToPage("full-name", textConfig)

// The same builder pattern can be used for creating groups,
// for example, radio buttons.
val radioConfig1 = RadioButtonFormConfiguration.Builder(0, boundingBox1)
    .select()
    .build()
val radioConfig2 = RadioButtonFormConfiguration.Builder(0, boundingBox2)
    .build()

// Create a radio button form field by passing over all
// form element configurations.
val radioFormField = document.formProvider
    .addFormElementsToPage("sign-up", listOf(radioConfig1, radioConfig2))
```

```java
// Each form element can be configured using a builder.
final TextFormConfiguration textConfig
    = new TextFormConfiguration.Builder(0, boundingBox)
        .setText(preFilledName)
        .build();

// Adding the form element to the page will automatically
// create a form field.
final FormField textFormField = getDocument()
    .getFormProvider()
    .addFormElementToPage("full-name", textConfig);

// The same builder pattern can be used for creating groups,
// for example, radio buttons.
final RadioButtonFormConfiguration radioConfig1
    = new RadioButtonFormConfiguration.Builder(0, boundingBox1)
        .select()
        .build();
final RadioButtonFormConfiguration radioConfig2
    = new RadioButtonFormConfiguration.Builder(0, boundingBox2)
        .build();

// Create a radio button form field by passing over all
// form element configurations.
final FormField radioFormField = getDocument()
    .getFormProvider()
    .addFormElementsToPage(
        "sign-up",
        Arrays.asList(radioConfig1, radioConfig2)
    );
```

==]

## External Signature Providers

With PSPDFKit 4.4 for Android, it is now possible to use virtually any external signature provider — such as HSMs (hardware security modules), third-party signing services, and many of the available Java security libraries — for signing PDF documents. Moreover, we introduced support for interactive signing flows — for example, if your app requires a user password before signing a document:

[==

```kotlin
// Create custom signers that can use external signature providers.
val customSigner = CustomSigner("John Appleseed", externalSigningService)

// Use them just like PSPDFKit's default signers.
SignatureManager.addSigner("john_appleseed", customSigner)
```

```java
// Create custom signers that can use external signature providers.
final CustomSigner customSigner
    = new CustomSigner("John Appleseed", externalSigningService);

// Use them just like PSPDFKit's default signers.
SignatureManager.addSigner("john_appleseed", customSigner);
```

==]

Have a look at our updated [Digital Signatures guide](https://pspdfkit.com/guides/android/current/features/digital-signatures/) for an in-depth explanation of the new APIs, or check out our `CustomSignatureProviderExample` inside the Catalog for a jump start.

## And More...

* We added [`TextSearch`] options to limit searches to a specific range of pages. Check out our [Text Search guide](https://pspdfkit.com/guides/android/current/features/text-search/) for the details.

* We made our [`PdfProcessor`] more reliable by disallowing it from using the processed input file as the output destination (which could cause data corruption).

* We tightened our annotation APIs by performing runtime checks for argument values on `@NonNull` parameters. Methods on [`Annotation`] will now throw if `null` is passed to such parameters.

We hope you like the changes we brought with PSPDFKit 4.4 for Android — rest assured there is more great stuff lined up for the upcoming releases. To see a comprehensive list of changes in this release, check out the [PSPDFKit 4.4 for Android changelog](https://pspdfkit.com/changelog/android/#4.4.0).

<!-- References -->

[`Annotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/Annotation.html
[`TextSearch`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/search/TextSearch.html
[`PdfProcessor`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/processor/PdfProcessor.html
