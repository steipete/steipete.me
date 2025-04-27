---
title: "PSPDFKit 9.2 for iOS"
description: "Introducing PSPDFKit 9.2 for iOS — with updated UI text and additional Dark Mode and Mac Catalyst enhancements."
preview_image: /images/blog/2020/pspdfkit-ios-9-2/article-header.png
preview_video: /images/blog/2020/pspdfkit-ios-9-2/article-header.mp4
section: blog
author:
  - Matej Bukovinski
author_url:
  - https://twitter.com/bukovinski
date: 2020-01-22 09:00 UTC
tags: iOS, Development, Products
published: true
---

With the release of PSPDFKit 9.2 for iOS, we’re continuing our efforts to improve stability and add polish throughout our SDK. Today’s release updates some key user interface text to be more natural and consistent, adds additional customizations for Dark Mode, and extends Mac Catalyst support even further. As always, the release also includes a large set of other smaller enhancements and fixes, which you can find listed in our [changelog][ios 9.2 changelog].

READMORE

## Annotation Tool Naming

[PSPDFKit 9 for iOS][pspdfkit 9 for ios blog post] introduced a brand new design for annotation groups on the toolbar. Now, in addition to showing icons, this also shows labels for the individual annotation creation tools, making it much easier to find the annotation type you would like to work with. The change also made it obvious that our automatic annotation type and variant naming appeared a bit artificial and lacked consistency. We audited and copy edited this text, along with the text in some other places throughout the framework, and came up with a clearer and more consistent naming scheme.

Naturally, those changes have led to a few string keys changing in our localization files. If you’re relying on string keys for any customizations, you should check out our [migration guide][] for details.

| Previous Menu UI                                                                       | New Menu UI                                                                      |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| ![Previous Menu UI](/images/blog/2020/pspdfkit-ios-9-2/strings_before_highlighted.png) | ![New Menu UI](/images/blog/2020/pspdfkit-ios-9-2/strings_after_highlighted.png) |

## Dark Mode

In this release, we’re extending support for Dark Mode to the notes and comments view. The note interface is dynamically tinted based on the user-selected note color. As those colors can often appear a bit too bright in dark environments, we’re now automatically switching to an alternative color palette for notes in Dark Mode.

| Previous Note UI in Dark Mode                                                                        | New Note UI in Dark Mode                                                                       |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| ![Previous Note UI in Dark Mode - Yellow](/images/blog/2020/pspdfkit-ios-9-2/note_yellow_before.png) | ![New Note UI in Dark Mode - Yellow](/images/blog/2020/pspdfkit-ios-9-2/note_yellow_after.png) |
| ![Previous Note UI in Dark Mode - Red](/images/blog/2020/pspdfkit-ios-9-2/note_blue_before.png)      | ![New Note UI in Dark Mode - Red](/images/blog/2020/pspdfkit-ios-9-2/note_blue_after.png)      |

We’ve also looked into improving contrast and readability for dynamically tinted content — such as the document outline and the annotation list — when used on dark backgrounds. The outline text and the annotation symbols are tinted based on color data from the PDF document. Those colors can often make the content difficult to distinguish when a dark background is used. To solve this problem, we now employ a new algorithm that ensures there’s always enough contrast between the background and foreground content.

| Outline in Light Mode                                                          | Previous Outline in in Dark Mode                                                                | New Outline in in Dark Mode                                                               |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![Outline in Light Mode](/images/blog/2020/pspdfkit-ios-9-2/outline_light.png) | ![Previous Outline in in Dark Mode](/images/blog/2020/pspdfkit-ios-9-2/outline_dark_before.png) | ![New Outline in in Dark Mode](/images/blog/2020/pspdfkit-ios-9-2/outline_dark_after.png) |

## Mac Catalyst

Providing first-class Mac Catalyst support has been [a key priority][catalyst blog post] for us ever since the new platform was first announced. In this release, we’re continuing our efforts by further improving our hardware keyboard support: PSPDFKit now correctly handles Page Up / Page Down keys and also offers support for the Select All action. We also significantly improved update performance on the annotation list, which is often permanently displayed in a sidebar on Mac applications.

## Third-Party Styluses

Since the introduction of Apple Pencil, we noticed interest in our third-party stylus support gradually, but steadily, dissipating. We feel that Apple Pencil is mainstream enough that we can now focus our efforts on providing a first-class experience for it. That’s why, with PSPDFKit 9.2 for iOS, we’re removing support for third-party stylus SDKs. Doing so has enabled us to reduce complexity in our API, as well as streamline the pencil selection UI for Apple Pencil.

Please take a look at the [PSPDFKit 9.2 for iOS migration guide][migration guide] for more details on the removed APIs.

## More Details

This release also contains a large amount of smaller enhancements and fixes. One notable change is that PSPDFKit no longer requires the `NSPhotoLibraryUsageDescription` permission in your app’s `Info.plist` file, as we could improve the logic around the image picker to no longer rely on it. If you were adding this key just for PSPDFKit, you can now remove it. We also identified and fixed several issues with drawing annotations, particularly with both ink annotations and callout annotations in inverted page-rendering mode. The team also focused on performance and made some tweaks that will result in less file-size growth in PDFs when incremental saving is used.

To see a complete list of changes, check out the [PSPDFKit 9.2 for iOS changelog][ios 9.2 changelog].

[ios 9.2 changelog]: /changelog/ios/#9.2.0
[pspdfkit 9 for ios blog post]: https://pspdfkit.com/blog/2019/pspdfkit-ios-9/
[migration guide]: https://pspdfkit.com/guides/ios/current/migration-guides/pspdfkit-92-migration-guide/
[catalyst blog post]: https://pspdfkit.com/blog/2019/pspdfkit-for-mac-catalyst/
