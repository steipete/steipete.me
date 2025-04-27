---
title: "External Storage Permissions on Android"
description: "An exploration of how permissions work, starting from a high level and working down to the lower lever managed by FUSE, the native Android module that interacts with the file system."
preview_image: /images/blog/2018/external-storage-permissions-on-android/article-header.png
section: blog
author:
  - Simone Arpe
author_url:
  - https://twitter.com/simonarpe
date: 2018-12-12 8:00 UTC
tags: Development, Android
published: true
secret: false
---

The permission model introduced in Android 6.0 offers a new layer of security for users. Some actions have been refined to be more secure without requesting dangerous permissions to interact with files. For instance, using the right intent action for firing up the Android SAF picker does not even require the storage permissions. But why?

In this article, we’ll delve into the Android permission model — in particular, the storage permissions. We’ll have a look at how permissions work, starting from a high level and working our way down to the lower level managed by FUSE, the native Android module that interacts with the file system.

# The Dawn of the New Permissions Era

The main purpose of the Android permission model is to provide final users with a better understanding of which resources an app is going to use. If a device is running Android 6.0 (API level 23) or higher and the app’s [`targetSdkVersion`][] is 23 or higher, the user can refuse a specific permission. But if an app is well implemented, it should work even without accessing the resource that has been prohibited. That said, an app that must work without a resource uses a different implementation flow, and it is the responsibility of professional developers to make sure the user won’t experience crashes or strange behaviors.

## The Four Protection Levels

There are [four protection levels that affect third-party apps][protection levels]: normal, signature, dangerous, and special permissions.

Using the `adb` tool, we can list all the permissions. Adding the `-d` and `-g` options, we’ll list only dangerous permissions organized by group:

```bash
adb shell pm list permissions -d -g
```

To grant or revoke a single permission for an app, use the following:

```bash
adb shell pm [grant|revoke] <package-name> <permission-name>
```

You can grant as many permissions as you like by using this command multiple times.

### ✅ Normal Permissions

Normal permissions are permissions that are not considered harmful. Examples of this include the permission to set the time zone. Normal permissions are granted at installation time, and the only precondition is declaring them in the manifest of the app.

### ⛔️ Signature Permissions

Signature permissions are generally permissions defined by one app and used by another. The system grants these app permissions at install time only if the requesting application is signed with the same certificate as the application that declared the permission.

### 💀 Dangerous Permissions

Dangerous permissions could potentially expose the user’s private information or share operations with other apps. For example, the ability to read the user’s contacts is a dangerous permission. Dangerous permissions are granted at runtime, and the user must explicitly grant the permission to the app.

### 🦄 Special Permissions

Special permissions are a small set of permissions that are particularly sensitive, so most apps should not use them. Examples of these include [`SYSTEM_ALERT_WINDOW`][] and [`WRITE_SETTINGS`][]. Special permissions must be declared in the manifest, and the app will send an intent requesting the user’s authorization by showing a detailed management screen to the user.

# Storage Permissions

Storage permissions are [dangerous](#dangerous-permissions) permissions for accessing the shared external storage. Full read and write access to any location of the volume is protected by two permissions marked as dangerous: [`READ_EXTERNAL_STORAGE`][] and [`WRITE_EXTERNAL_STORAGE`][].

When an app is granted storage permission, it can access the device storage at any time. This means it can upload personal files or even delete sensitive information from the device, so it’s better to think twice before giving storage permission to untrusted apps, as it can be harmful.

Only when the external storage is mounted and the permissions are granted will Android let you call [`Environment#getExternalStorageDirectory()`][].

Calling a method that requires storage access without the right permissions will throw the exception `java.lang.SecurityException`.

## Accessing Storage Volume without Storage Permissions

There are some special paths that can be accessed without reading and writing permissions that are particularly useful for storing app private data: [`Context#getExternalFilesDir(String)`][], [`Context#getExternalCacheDir()`][], and [`Context#getExternalMediaDirs()`][].

Another way to access a specific file without requiring dangerous permissions is by relying on the [Android Storage Access Framework (SAF) picker][].

The SAF picker does not allow an app to have full control of the storage, is much more restricted, and requires some interaction with the user to choose the right location: This can be a new file name to save or a specific document to open. There is also a special case where the SAF picker can open an entire directory using the intent action [`ACTION_OPEN_DOCUMENT_TREE`][].

The outcome of the SAF picker will be a [`Uri`][] that can be opened by a [`ContentResolver`][].

For example, if you want to open a document selected by the SAF picker, use the following code:

[==
```kotlin
val inputStream = context.contentResolver.openInputStream(documentUri)
```

```java
InputStream inputStream = context.getContentResolver().openInputStream(documentUri);
```

==]

See the SAF picker in action on our free [PDF Viewer for Android][] app.

<video src="/images/blog/2018/external-storage-permissions-on-android/saf-picker.mp4" class="no-mejs" width="50%" style="display: block; margin:1em auto 2em auto !important;" autoplay playsinline  loop muted></video>

# Security

Android manages external storage using [FUSE][], a Unix-like daemon that can be seen as a virtual file system that prevents malicious users from accessing protected code. The actual [FUSE implementation][] is written in C++ and can be executed only as root.

# Final Thoughts and Reference

Android permissions must be treated wisely, and here at PSPDFKit, we focus heavily on security and privacy. The use of dangerous and special permissions should be avoided when not strictly required, and an app should work even when a permission is not granted. There are many tutorials on the internet about the Android permission model, but because it evolves rapidly, it’s always a good idea to check if the information is up to date, as in the latest Android API, many methods have changes.

## Other Useful Resources

- [Permissions usage notes][]
- [The great Nick Butcher talking about permissions in Android Marshmallow 6.0][]
- [Permissions overview][]
- [Android runtime permissions example project][]
- [“Mother, May I?” Asking for Permissions (Android Dev Summit 2015)][]
- [Forget the Storage Permission: Alternatives for sharing and collaborating by Ian Lake][]
- [On the Edge of the Sandbox: External Storage Permissions][]
- [Open files using storage access framework][]

[`targetsdkversion`]: https://developer.android.com/guide/topics/manifest/uses-sdk-element.html#target
[protection levels]: https://developer.android.com/guide/topics/permissions/overview
[`system_alert_window`]: https://developer.android.com/reference/android/Manifest.permission.html#SYSTEM_ALERT_WINDOW
[`write_settings`]: https://developer.android.com/reference/android/Manifest.permission.html#WRITE_SETTINGS
[`read_external_storage`]: https://developer.android.com/reference/android/Manifest.permission.html#READ_EXTERNAL_STORAGE
[`write_external_storage`]: https://developer.android.com/reference/android/Manifest.permission.html#WRITE_EXTERNAL_STORAGE
[`environment#getexternalstoragedirectory()`]: https://developer.android.com/reference/android/os/Environment.html#getExternalStorageDirectory()
[`context#getexternalfilesdir(string)`]: https://developer.android.com/reference/android/content/Context#getExternalFilesDir(java.lang.String)
[`context#getexternalcachedir()`]: https://developer.android.com/reference/android/content/Context#getExternalCacheDir()
[`context#getexternalmediadirs()`]: https://developer.android.com/reference/android/content/Context#getExternalMediaDirs()
[android storage access framework (saf) picker]: https://developer.android.com/guide/topics/providers/document-provider
[`action_open_document_tree`]: https://developer.android.com/reference/android/content/Intent.html#ACTION_OPEN_DOCUMENT_TREE
[`uri`]: https://developer.android.com/reference/android/net/Uri
[`contentresolver`]: https://developer.android.com/reference/android/content/ContentResolver
[fuse]: https://en.wikipedia.org/wiki/Filesystem_in_Userspace
[fuse implementation]: https://android.googlesource.com/platform/system/core/+/android-8.1.0_r48/sdcard/
[permissions usage notes]: https://developer.android.com/training/permissions/usage-notes
[the great nick butcher talking about permissions in android marshmallow 6.0]: https://www.youtube.com/watch?v=iZqDdvhTZj0
[permissions overview]: https://developer.android.com/guide/topics/permissions/overview
[android runtime permissions example project]: https://github.com/googlesamples/android-RuntimePermissions
[“mother, may i?” asking for permissions (android dev summit 2015)]: https://www.youtube.com/watch?v=5xVh-7ywKpE
[forget the storage permission: alternatives for sharing and collaborating by ian lake]: https://www.youtube.com/watch?v=C28pvd2plBA
[on the edge of the sandbox: external storage permissions]: https://possiblemobile.com/2014/03/android-external-storage/
[open files using storage access framework]: https://developer.android.com/guide/topics/providers/document-provider
[pdf viewer for android]: https://pdfviewer.io/
