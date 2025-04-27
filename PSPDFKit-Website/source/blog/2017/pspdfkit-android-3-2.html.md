---
title: "PSPDFKit 3.2 for Android"
description: Today we're releasing PSPDFKit 3.2 for Android! With a new night mode and scrolling settings, improved search and video annotation support.
section: blog
author:
  - Simone Arpe
  - Jernej Virag
author_url:
  - https://twitter.com/simonarpe
  - https://twitter.com/jernejv
date: 2017-06-15 12:00 UTC
tags: Android, Features, Products
published: true
---

Today we are proudly announcing the release of PSPDFKit 3.2 for Android with a popularly requested settings menu that lets users switch between available page scrolling modes, toggle day/night mode, and keep the screen awake while reading.

READMORE

## Night Mode & Settings Menu

With this release, night mode is now an official feature which can be enabled by choosing [`ThemeMode.NIGHT`](https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/theming/ThemeMode.html) as theme mode (and which will also conveniently invert the color of pages). This setting and more are now also available via a settings icon in the [`PdfActivity`](https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html) which will bring up our new settings dialog.

<p class="text-center">
  <video src="/images/blog/2017/pspdfkit-android-3-2/settings.mp4" width="50%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>
</p>

The settings menu is highly flexible. By default, the full set of options is provided, but specific items can be hidden using [`PdfActivityConfiguration.Builder#setSettingsMenuItems`](https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html#setSettingsMenuItems(java.util.EnumSet<com.pspdfkit.configuration.settings.SettingsMenuItemType>)). You can entirely hide the settings menu, too, by calling [`PdfActivityConfiguration.Builder#hideSettingsMenu`](https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html#hideSettingsMenu()).

The options shown by default are		

 - Page transition: `Jump`, `Continuous`		
 - Page layout: `Single`, `Double`, `Automatic`		
 - Scroll direction: `Horizontal`, `Vertical`		
 - Theme: `Default`, `Night`		
 - Keep screen on		

The new theme switcher will let the user choose between default and night mode. Both themes can be customized using [`PdfActivityConfiguration.Builder#theme(int)`](https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html#theme(int)) and [`PdfActivityConfiguration.Builder#themeDark(int)`](https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html#themeDark(int)). If not provided the framework will fallback to our awesome predefined themes.

## Video annotations

PSPDFKit now supports video annotations embedded inside the PDF document.

<p class="text-center">
  <video src="/images/blog/2017/pspdfkit-android-3-2/video_annot.mp4" width="50%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>
</p>

The video is embedded directly into the page and will zoom and move around with the page. PSPDFKit now also properly supports PDF links that control playback of videos on the page.

To maintain security, video annotation playback is disabled by default. [`PdfConfiguration#videoPlaybackEnabled(true)`](https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/PdfConfiguration.Builder.html#videoPlaybackEnabled(boolean)) has to be called to explicitly enable playback of videos inside PDF files. This protects app users from vulnerabilities like Stagefright when they open files from unknown sources.

## Automatic link generation

PSPDFKit can now automatically generate clickable links from URLs written inside the text (if it's not already a link, of course). This is enabled by default and can be disabled using the [`automaticallyGenerateLinks()`](https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/PdfConfiguration.Builder.html#automaticallyGenerateLinks(boolean)) setting in [`PdfConfiguration`](https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/PdfConfiguration.Builder.html).

## Watermark filtering from text selection

PSPDFKit now automatically ignores watermarks when selecting text and all the functionality that handles text (including text-to-speech and accessibility) will now skip the watermark as well.

To disable filtering, call the [`setWatermarkTextFilteringEnabled()`](https://pspdfkit.com/api/android/reference/com/pspdfkit/document/PdfDocument.html#setWatermarkTextFilteringEnabled(boolean)) method on your [`PdfDocument`](https://pspdfkit.com/api/android/reference/com/pspdfkit/document/PdfDocument.html) instance.

## Other improvements and fixes

We squashed a bug that could cause issues when saving documents from the Document Editor and which could crash the SDK on Android 4.1.

Inline search now lets users navigate results before the search is fully complete.

We also eliminated annoying pauses from TTS text reading, making the experience more pleasant for everyone preferring to listen to their document content.

This is just a small overview of the improvements and fixes we did in this version. Check out the [PSPDFKit for Android changelog](https://pspdfkit.com/changelog/android/#3.2.0) for the full story.

<!-- References -->
