---
title: "How to Use iOS Data Protection"
description: "How apps can use iOS Data Protection to secure their files."
preview_image: /images/blog/2017/how-to-use-ios-data-protection/iphone-with-padlock.png
section: blog
author:
  - Douglas Hill
author_url:
  - https://twitter.com/qdoug
date: 2017-10-24 12:00 UTC
tags: Instant, iOS, Development
published: true
---

Modern iOS devices support *data protection*, which secures user data using built-in encryption hardware. Here, we’ll look at how apps can use this to protect their files, collecting details from a few sources, combined with my own observations.

READMORE

Every file stored on an iOS device has one of the four data protection types, which determine when the file can be read from and written to. These protection types can be set either with an entitlement or programmatically. You should aim to protect users’ data as much as possible, so from best to worst these types are:

- [`NSFileProtectionComplete`]: The file is only accessible while the device is unlocked. When the device is locked your app will receive a [`UIApplicationProtectedDataWillBecomeUnavailable`] notification, and will lose access to protected files 10 seconds later. Use this if possible, but not if you need to access the file while running in the background.
- [`NSFileProtectionCompleteUnlessOpen`]: While the device is locked, files can still be created and already open files can be accessed. Use this for completing a task in the background that requires you to save new data or update a database.
- [`NSFileProtectionCompleteUntilFirstUserAuthentication`]: The file can be accessed any time after the user enters their passcode once after the device has booted, even when the device is locked. Use this if you need to read the file while running in the background.
- [`NSFileProtectionNone`]: The file can always be accessed. The system needs to use this in some places but your app probably doesn’t.

If you try to access a file when it is protected, the operation will fail with either `NSFileReadNoPermissionError` (code 257) or `NSFileWriteNoPermissionError` (code 513).

You can read more about each protection type in Apple’s [iOS Security White Paper].

Note that data protection does not work with the Simulator. FileVault encryption used on Macs works very differently. Even setting a protection type then reading it back won’t work. You’ll always read `NSURLFileProtectionCompleteUntilFirstUserAuthentication ` — at least on my Mac. Always test data protection on a real device.

## Setting a Default Protection Level

![iPhone with padlock](/images/blog/2017/how-to-use-ios-data-protection/iphone-with-padlock.png)

### `CompleteUntilFirstUserAuthentication`

You don’t need to do anything because [this has been the default since iOS 7][forums default].

### `Complete`

The default protection level for files created in your app or extension’s container is determined by the `com.apple.developer.default-data-protection` entitlement, which is shown as ‘Data Protection’ in Xcode. You need to set this for the app and all extensions. There are two caveats to bear in mind:

- This entitlement needs to be set before the app is installed, as Quinn "The Eskimo!" says on the [Apple developer forums][forums container creation]:

    > The default data protection set in your entitlements (and hence from your App ID via your provisioning profile) is only applied when your app container is created.

    In my investigation, changing the entitlement for an already installed app sometimes resulted in the new level being used for new files and sometimes didn’t. It definitely won’t apply to existing files, so unless you’re making a brand new app, you’ll need to set protection types programmatically, which is described later.

- Since the entitlement only applies to your app or extension’s container, you need to set the protection level for a shared container programmatically.

With the caveats out of the way, setting the entitlement is easy. In your Xcode project settings, go to the Capabilities tab for your app or extension and turn on Data Protection. That’s it.

This will add a data protection entitlement to your app’s entitlements file (creating it if it does not exist) with the entitlement’s value set to `NSFileProtectionComplete`. It will also enable data protection on your App ID in the Certificates, Identifiers & Profiles section of the Apple developer website.

Updating the Capabilities is described briefly in the [Enabling Data Protection] section of Apple’s App Distribution Guide.

### `CompleteUnlessOpen`

You need to follow the steps for `NSFileProtectionComplete` — described above along with the caveats — then change the protection level in both the entitlements file and on your App ID in the Certificates, Identifiers & Profiles section of the Apple developer website. These two values must be manually kept in sync otherwise you’ll see an error when building about invalid entitlements.

The place to navigate to on the website is: Identifiers > App IDs > (the app ID) > Edit > Data Protection > Sharing and Permissions. This can be set to one of the three protection levels (but not `NSFileProtectionNone`).

The key expected in the entitlements file is `NSFileProtectionCompleteUnlessOpen`.

I found even with automatic provisioning, Xcode did not update the provisioning profile for the changes made on the website. You can force Xcode to download the profile again by deleting it from `~/Library/MobileDevice/Provisioning Profiles/`, identifying the right one using Craig Hockenberry’s [Provisioning QuickLook plug-in].

### `None`

You can’t make this the default because there is no option for this in the Certificates, Identifiers & Profiles section of the Apple developer website. You wouldn’t want that anyway.

## Setting a Protection Level Programmatically

If your app is already installed on users’ devices without the entitlement set and you want something other than `NSFileProtectionCompleteUntilFirstUserAuthentication`, you’ll need to set the protection type programmatically, both to protect new files and upgrade existing ones. Note that you don’t need to set the entitlement to use these APIs.

### Setting a Protection Level for a Particular File

Looking at single files first, there are several APIs that accept a protection type as an option.

If you’re writing a new file from `Data`/`NSData`, use

```swift
try data.write(to: fileURL, options: .completeFileProtection)
```

For an existing file you can use either `NSFileManager`/`FileManager` or `NSURL`:

```swift
try FileManager.default.setAttributes([.protectionKey: FileProtectionType.complete], ofItemAtPath: fileURL.path)
// or
// cast as NSURL because the fileProtection property of URLResourceValues is read-only
try (fileURL as NSURL).setResourceValue(URLFileProtection.complete, forKey: .fileProtectionKey)
```

With Core Data you can pass the protection type when adding the persistent store:

```swift
try persistentStoreCoordinator.addPersistentStore(ofType: NSSQLiteStoreType, configurationName: nil, at: storeURL, options: [NSPersistentStoreFileProtectionKey: FileProtectionType.complete])
```

You can read a bit more in the [Protecting Data Using On-Disk Encryption] section of Apple’s App Programming Guide for iOS.

### Setting a Protection Level for New Files in a Directory

Quinn "The Eskimo!", also posted this useful information on the [Apple developer forums][forums inheritance]:

> By default the data protection value is inherited from the parent directory when you create an item. For example, if you have a directory set to `NSFileProtectionComplete`, any items created within that directory will, by default, be set to `NSFileProtectionComplete`. The entitlement controls the data protection value for the root directory of your container, which is then inherited by anything created within that container. However, if you explicitly set the value for a directory then subsequent items created within that directory will get the new value by default.

Therefore you can use the `FileManager`/`NSFileManager` or `NSURL` API as above with a directory URL instead of a file URL, or pass the protection attribute when creating the directory:

```swift
try FileManager.default.createDirectory(at: directoryURL, withIntermediateDirectories: true, attributes: [.protectionKey: FileProtectionType.complete])
```

You can then create files in the directory as normal.

### Changing the Protection Level for All Existing Files in a Directory

When you set the protection level of a directory, the protection level of existing files in that directory does not change. You’ll need to set the protection level for every file in the directory. This can be done with `FileManager.DirectoryEnumerator`/`NSDirectoryEnumerator`:

```swift
guard let directoryEnumerator = FileManager.default.enumerator(at: directoryURL, includingPropertiesForKeys: [], options: [], errorHandler: { url, error -> Bool in
    print(error)
    return true
}) else {
    print("Could not create directory enumerator at \(directoryURL.path)")
    return
}

// NSEnumerator is not generic in Swift so we have to deal with Any.
for urlAsAny in directoryEnumerator {
    do {
        try (urlAsAny as! NSURL).setResourceValue(URLFileProtection.complete, forKey: .fileProtectionKey)
    } catch {
        print(error)
    }
}
```

## Using Data Protection with Instant

It’s easy to keep your documents protected with [PSPDFKit Instant]. If you set a default data protection level, Instant will use this and there’s nothing more to do. If you want a different level for documents and annotations stored by Instant, use the `dataDirectory` class property on `PSPDFInstantClient` to access the path where Instant stores data, then use the techniques described above. Read more in our [Instant Data Protection guide].

[Let me know if you think I’ve missed something.](https://twitter.com/qdoug)



[`NSFileProtectionNone`]: https://developer.apple.com/documentation/foundation/nsfileprotectionnone

[`NSFileProtectionComplete`]: https://developer.apple.com/documentation/foundation/nsfileprotectioncomplete

[`NSFileProtectionCompleteUnlessOpen`]: https://developer.apple.com/documentation/foundation/nsfileprotectioncompleteunlessopen

[`NSFileProtectionCompleteUntilFirstUserAuthentication`]: https://developer.apple.com/documentation/foundation/nsfileprotectioncompleteuntilfirstuserauthentication

[`UIApplicationProtectedDataWillBecomeUnavailable`]: https://developer.apple.com/documentation/foundation/nsnotification.name/1623058-uiapplicationprotecteddatawillbe

[iOS Security White Paper]: https://www.apple.com/business/docs/iOS_Security_Guide.pdf

[Protecting Data Using On-Disk Encryption]: https://developer.apple.com/library/content/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/StrategiesforImplementingYourApp/StrategiesforImplementingYourApp.html#//apple_ref/doc/uid/TP40007072-CH5-SW21

[Provisioning QuickLook plug-in]: https://github.com/chockenberry/Provisioning

[Enabling Data Protection]: https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/AddingCapabilities/AddingCapabilities.html#//apple_ref/doc/uid/TP40012582-CH26-SW30

[forums inheritance]: https://forums.developer.apple.com/thread/24483

[forums container creation]: https://forums.developer.apple.com/message/55933

[forums default]: https://forums.developer.apple.com/message/140151

[PSPDFKit Instant]: https://pspdfkit.com/instant/

[Instant Data Protection guide]: https://pspdfkit.com/guides/ios/current/pspdfkit-instant/data-protection/
