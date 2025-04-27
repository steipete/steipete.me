---
title: "The Struggle with Action Extensions"
description: Pitfalls when developing a Share or an Action Extension
section: blog
author:
  - Michael Ochs
author_url:
  - https://twitter.com/_mochs
date: 2017-01-24 12:00 UTC
tags: iOS, Development
published: true
---

Extensions are becoming more and more important on iOS. At PSPDFKit we believe it is important to be a good citizen and to integrate with the system wherever possible. Two weeks ago we explained some of the [gotchas when building a Today Widget](/blog/2017/today-widget/), but that is not the only system integration that [PDF Viewer](https://pdfviewer.io) has to offer. To let users easily import documents, images, and websites from other apps, we offer an Action Extension.

<img alt="Action Extension" src="/images/blog/2017/action-extension/action-extension.gif" srcset="/images/blog/2017/action-extension/action-extension@2x.gif 2x">

PDF Viewer has shipped with this extension for quite a while now. Our first implementation was very straightforward, and we experienced some issues with it. Today I want to talk about what we learned from building the extension and how we solved the issues we encountered. While we chose the Action Extension for our use case, Share Extensions are, from a technical point of view, very similar and the approach of receiving content from the host application is the same. Therefore everything I am discussing here is applicable to both Share and Action Extensions.

## The First Approach

I’ll skip the basics of implementing a Share or Action Extension - there are a lot of tutorials out there, plus the sample implementation you get from Xcode when creating a new Action Extension target illustrates the concept quite well.

To get everybody on the same page, let me quickly go over the most important part. The core of these extensions is one central loop that contains most of the work relating to retrieving items from the host app, iterating over these items and selecting the ones you are interested in. This is what this loop could look like in its simplest form:

```objc
BOOL imageFound = NO;
for (NSExtensionItem *item in self.extensionContext.inputItems) {
    // Iterate over items and look for an image
    for (NSItemProvider *itemProvider in item.attachments) {
        if ([itemProvider hasItemConformingToTypeIdentifier:(NSString *)kUTTypeImage]) {
            // This item can be represented as image, load it
            [itemProvider loadItemForTypeIdentifier:(NSString *)kUTTypeImage options:nil completionHandler:^(NSData *imageData, NSError *error) {
                // TODO: Store data in an app group to make it accessible by PDF Viewer
            }];
            imageFound = YES;
        }
    }
    if (imageFound) { break; }
}
```

While this code is a bit lengthy it looks very promising: we iterate over all the items that are shared by the host app and check if there is content in there that we can interpret. In this case, we are looking for an image.

The first questions that come to mind here are: what is an `NSExtensionItem` and what are `NSItemProvider`s? Extension items are the input the extension gets from the host app. An extension item has attachments, which are a list of `NSItemProvider`. Attachments can be seen as the user's intent. So if the user wants to share five images, you will get five item provider. Each of these item provider can then be represented in different ways. So for example an image could be represented either by a file URL pointing to the image, by the image data itself, or maybe even textually. Therefore each item provider can have one or more items. Ideally, what you usually want to do is iterate over the item provider and pick one representation per provider to process. While the Photos app hands over multiple attachments in one item provider, Safari may hand you over multiple extension items, each of which effectively describing the same resource but in different forms. So the best approach here is to pick one extension item and process all of its item providers. ([rdar://30184485](http://openradar.appspot.com/30184485))

In our example above, we try to find an item that can be represented as image. We then ask for this image and stop processing this provider's data. Once we found an image we fetch the provider's data by calling [`loadItemForTypeIdentifier:options:completionHandler:`](https://developer.apple.com/reference/foundation/nsitemprovider/1403900-loaditemfortypeidentifier?language=objc).

When loading the item data, a very peculiar API decision comes in to play that I have never seen anywhere else before and that will bite us in a bit: by specifying the `completionHandler`'s first argument as `NSData` we also gave some information to the item provider through some Objective-C runtime magic: the item provider checks the type of the first parameter and will try to convert the underlying structure to an object of this type. So in this case it will try to convert the image into an `NSData` object. If it fails to do so, the first parameter will be `nil`.

So let's get that image as `NSData` and store it in our app group so that PDF Viewer can access it on its next launch. Testing this with Safari yields exactly the result we want. The image is loaded, we store it, and the code in the main app picks it up and shows it in the list of files. So we are done with our extension right? Everything is working as expected, great job! We pat ourselves on the back, commit everything and enjoy our quick success. 😇

## From Objective-C to Swift

Sadly someone dared to try this extension on a photo in the Photos app – who would have thought? Guess what? When executing the same code that works perfectly well when tested with Safari through a share intent from Photos instead, our `completionHandler`'s first parameter is `nil`. [A post in the Apple Developer Forum](https://forums.developer.apple.com/thread/24368) suggests that this is just an issue in Swift, but I find this failing in Objective-C as well. What's going on there? Let's put our Objective-C code aside and look at the same implementation in Swift:

```swift
for item in context.inputItems as! [NSExtensionItem] {
    // Iterate over items and look for an image
    guard let attachments = item.attachments else { continue }
    for itemProvider in attachments as! [NSItemProvider] {
        if itemProvider.hasItemConformingToTypeIdentifier(String(kUTTypeImage)) {
            // This item can be represented as image, load it
            itemProvider.loadItem(forTypeIdentifier: String(kUTTypeImage), options: nil, completionHandler: { (imageData, error) in
                guard let imageData = imageData as? Data else { return }
                // TODO: Store data in an app group to make it accessible by PDF Viewer
            })
        }
    }
}
```

In Swift we can’t specify a custom type for the first parameter of the completion handler, because the type system ensures the closure type matches [the API](https://developer.apple.com/reference/foundation/nsitemprovider/completionhandler), which declares the type as `(NSSecureCoding?, Error!) -> Void`. So in Swift you need to take the object as what it actually is: a random object that conforms to `NSSecureCoding`. This is all the API promises us. You can then cast this object e.g. to `Data`. This, of course, can fail, because the object may not be of type `Data`. However, while in Objective-C this all happens somewhere in the framework and is hidden from us, in Swift we still see the actual object in the debugger. Looking at this, we'll find that the object is of type `URL` instead of type `Data`.

The problem here is that while the type of the item is `kUTTypeImage`, nobody guarantees that you will actually get the image data itself. Instead the Photos and Messages apps will provide you with a URL pointing to that very image. While my gut tells me that if it is a URL to a local file, the type should actually be `kUTTypeFileURL` instead of `kUTTypeImage`, Safari seems to be the only app that handles it this way and if that would be documented somewhere, it would indeed make sense to always get a file URL while the type identifier specifies what is actually in the file. ([rdar://29924023](http://openradar.appspot.com/29924023 "Safari.app shares images as NSData instead of file URLs"))

Another problem here is, that `loadItem(forTypeIdentifier:, options:, completionHandler:)`, is designed as asynchronous API. Once you decided to actually load an item from a provider, you usually break out of the inner loop that checks an item provider's data. So when the completion handler is called with a `nil` value, it is quite complicated to reiterate over an extension item’s providers and check for other, more suitable items.

To make this work, we changed our code to first try to cast to a URL and if that fails we cast to a data blob. We prefer a URL here because a URL is the better choice when it comes to resources as we don't need to load the whole thing into memory. In fact we first check if the extension item has a provider that has items conforming to `kUTTypeFileURL` before trying other types like image or PDF. Surprisingly, a picture from the Photos app or the Messages app does not have such a provider, even though the underlying data structure is of type URL.

If you are writing your extension in Objective-C, you can do the same thing. Even though the documentation says "[The type information for the first parameter of your completionHandler block should be set to the class of the expected type.](https://developer.apple.com/reference/foundation/nsitemprovider/1403900-loaditemfortypeidentifier)" you can set the parameter to be of type `id<NSObject, NSSecureCoding>` and you will get an object that you can then analyze with the help of `isKindOfClass:`.

## Copying the File

Now that we figured that if we receive a `URL` instead of `Data` in many cases, our life is a bit easier. We can just use `FileManager` and copy over the image from the location in the URL into our app group where our extension as well as our app can then access it. Or – can we? When I said "_We prefer a URL here [...] as we don't need to load the whole thing into memory_", that was a theoretical statement. Let’s see what happens if we actually try to copy an image into our app that was shared by a URL from the Messages.app:

```
SandboxViolation: ImageSharing(5854) deny(1) file-read-metadata /private/var/mobile/Library/SMS/Attachments/eb/11/A33F6838-EE4F-4794-AE92-7FEE492CF278/IMG_2417.PNG
```

While our extension is now working fine in Safari and Photos, somehow the file we are getting from the Messages app can not be copied. ([rdar://29918507](http://openradar.appspot.com/29918507)) After digging around a bit, I found that we can't copy the image, but interestingly what we can do is this:

```swift
let data = Data(contentsOf: fileURL)
data.write(to: targetURL, atomically: true)
```

That sounds awfully familiar to what I was trying initially. We now have a URL that we open as `Data` and write that data blob into our app group. We could minimize the needed memory footprint by opening the file as memory mapped data, but we still have a `Data` object in memory that has the potential to shoot our extension out of the sky, and memory is far more limited in an extension like this than it is in your app. As this whole approach is not only valid for images but could also happen with PDFs, in theory a user could open our extension with a PDF file that is multiple gigabytes in size. That's not the kind of content you want to see in a `Data` instance. So we are looking for a way to open a file and copy its content over to a new location, piece by piece.

It may sound silly, but I decided to move over to `InputStream` and `OutputStream` and simply use one of each to copy the file over to its new location in chunks of 1 kB.

[==

```objc
NSInputStream *input = [NSInputStream inputStreamWithURL:fileURL];
NSOutputStream *output = [NSOutputStream outputStreamWithURL:targetURL append:NO];

[input open];
[output open];

NSInteger bytesRead = 0;
uint8_t buffer[1024] = { 0 };
while ((bytesRead = [input read:buffer maxLength:1024])) {
    if (bytesRead > 0) {
        [output write:buffer maxLength:bytesRead];
    } else {
        break;
    }
}

[input close];
[output close];
```

```swift
guard let input = InputStream(url: source), let output = OutputStream(url: target, append: false) else { throw RequestError.cantCreateStream }

input.open()
output.open()

defer {
    input.close()
    output.close()
}

let chunkSize = 1024
var buffer = [UInt8](repeating:0, count:chunkSize)

var bytesRead = input.read(&buffer, maxLength: chunkSize)
while bytesRead > 0 {
    let bytesWritten = output.write(buffer, maxLength: bytesRead)
    if bytesWritten != bytesRead {
        throw output.streamError ?? RequestError.streamWriteError
    }
    bytesRead = input.read(&buffer, maxLength: chunkSize)
}
```

==]

## UIAppearance

After I covered the issues we had with the actual content, there was one more issue we discovered recently with our extension. When invoked through some apps, there seemed to be an issue with the `tintColor`.

<img alt="Wrong Tint Color" src="/images/blog/2017/action-extension/uiappearance.png" srcset="/images/blog/2017/action-extension/uiappearance@2x.png 2x">

Calling `setTintColor:` did not do anything, neither did overriding `setTintColor:`, as this was never called by the system. After some digging we found that this is not a bug but actually a feature. By default an extension completely picks up the `UIAppearance` settings from its host app. In theory that lets you build an extension that feels like it is part of the host application. This sounds great, but the problem with that is that it also is a lot of work. A host app might set its background color to black and its text color to white. This gives your extension a very different look, but as long as everything is configured through appearance proxies, this would work.

But a host app also may only set the tint color to dark blue like in the image above, but does not set anything else. Or it may not set its `tintColor` through `UIAppearance` at all, which would leave your extension with the default blue color even though the host app might have a different tint color. There are countless options and possibilities a host app could configure itself. Good luck with adapting to all the possibilities. Just to get the example above working, we would need to detect that there is a tint color defined through `UIAppearance` by the host app. We then would need to analyze that color and detect that the contrast to our blue background is very low and then alter the background color. Now imagine an app that the host also defines a different tint color for the navigation bar, but maybe not the navigation bar's `barTintColor`.

I don't think there is any way to make that work in all cases. It depends too much on what the host app does. You could argue that the host app needs to ensure it configures extensions correctly, and even though this is true in some way, it most likely will still be you who gets the angry customer support requests because your extension shows white text on a white background. Luckily there is an entry – undocumented at the time of writing – that you can add to your extension's `Info.plist` to opt out of this behavior: in the `NSExtension` dictionary you can specify the key `NSExtensionOverridesHostUIAppearance`, make it of type `Boolean` and set it to `YES`. This prevents forwarding of `UIAppearance` settings from the host app to your extension and you can design your extension's UI as if it was a stand alone application. This is only available as of iOS 10 though, so be aware that your extension might still look wrong in iOS 9.

## Conclusion

Be very careful with the provider types you request and the data structures you receive. An image might be shared as `kUTTypeFileURL` or it might be shared as `kUTTypeImage` and you will receive either a `URL` or a `Data` object. You will also find applications that give you more details and share an image as `kUTTypeJPEG` or `kUTTypePNG`, so keep this in mind too.

We even had cases where our extension was triggered with no item providers at all. So make sure you have appropriate error handling everywhere – 'what can go wrong, will go wrong' is a very good mantra when working on any kind of extension that deals with data from unknown host apps – keep that in mind at all time.

The result of this struggle is an extension that can hopefully handle all kinds of scenarios it may experience in the wild. You can check it out in [our app – it's free](https://pdfviewer.io)!

While working on this, in addition to the Radars already mentioned, I also filed the following:

- _Photos.app advertises live photo to action extensions which then can't be accessed_ ([rdar://29924331](http://openradar.appspot.com/29924331))
- _Messages.app advertises live photos to action extensions as arbitrary image (public.image) and is sharing a jpeg_ ([rdar://29924679](http://openradar.appspot.com/29924679))
