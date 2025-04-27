You can target devices with API 16 and newer by setting the `minSdkVersion` inside your app's `build.gradle`. Since PSPDFKit is developed and tested including the latest Android versions, set your `compileSdkVersion` and `targetSdkVersion` to those versions as well.

Creating [image annotations (stamps)](#) requires the [`NSCameraUsageDescription`](#) and/or [`NSPhotoLibraryUsageDescription`](#) keys. Saving images requires [`NSPhotoLibraryUsageDescription`](#).

If you use `WKWebView` (e.g. via [`PSPDFWebViewController`](#)) you might want to set `NSAllowsArbitraryLoadsInWebContent` to `YES` to allow http links to be loaded and https pages that do not yet comply to Apple's [App Transport Security](#) rules.
