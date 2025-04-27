---
title: "Hiding Your Action and Share Extensions In Your Own Apps"
section: blog

author: Aditya Krishnadevan
author_url: https://twitter.com/caughtinflux
date: 2016-12-07 12:00 UTC
tags: iOS, Development
published: true
---

Developers received a much higher level of integration in iOS 8 thanks to [app extensions](https://developer.apple.com/app-extensions/). Among these, Share and Action extensions are quite popular, since they are displayed wherever a `UIActivityViewController` is used, in any app.

For [PDF Viewer](https://pdfviewer.io), we created an [Action extension](https://developer.apple.com/library/content/documentation/General/Conceptual/ExtensibilityPG/Action.html) to import different types of media like websites, images, and, of course, PDFs into the app.

[![PDF Viewer](/images/blog/2016/hiding-action-share-extensions-in-your-own-apps/ViewerActionExtension.gif)](https://pdfviewer.io)

## NSExtensionActivationRule

In PDF Viewer, we use a `UIActivityViewController` to share PDFs. This means that our Action extension shows up in the list of actions as well! So a user would see an "Import to PDF Viewer" button _inside_ PDF Viewer. There isn't an easily available API to prevent this from happening. However, the extension's `Info.plist` does have `NSExtensionActivationRule` inside `NSExtensionAttributes`. In the default Xcode template, this key is set to `TRUEPREDICATE`.

In a more real-world scenario, it might look something like this:

```xml
<key>NSExtensionAttributes</key>
<dict>
    <key>NSExtensionActivationRule</key>
    <dict>
        <key>NSExtensionActivationSupportsImageWithMaxCount</key>
        <integer>1</integer>
        <key>NSExtensionActivationSupportsWebURLWithMaxCount</key>
        <integer>1</integer>
    </dict>
</dict>
```

iOS also allows this key to be set to a `<string>`, which is fed into `NSPredicate`. This is what we have for PDF Viewer:

```xml
<key>NSExtensionAttributes</key>
<dict>
    <key>NSExtensionActivationRule</key>
    <string>
    SUBQUERY (
        extensionItems,
        $extensionItem,
            SUBQUERY (
                $extensionItem.attachments,
                $attachment,
                ANY $attachment.registeredTypeIdentifiers UTI-CONFORMS-TO "com.adobe.pdf" OR
                ANY $attachment.registeredTypeIdentifiers UTI-CONFORMS-TO "public.file-url" OR
                ANY $attachment.registeredTypeIdentifiers UTI-CONFORMS-TO "public.url" OR
                ANY $attachment.registeredTypeIdentifiers UTI-CONFORMS-TO "public.jpeg" OR
                ANY $attachment.registeredTypeIdentifiers UTI-CONFORMS-TO "public.png"
            ).@count == $extensionItem.attachments.@count
    ).@count == 1
    </string>
</dict>
```

The Predicate Programming Guide's [Format String Syntax](https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/Predicates/Articles/pSyntax.html) page tells us about the `NOT, !` logical NOT operators. This can be leveraged as follows:

```xml
<key>NSExtensionAttributes</key>
<dict>
    <key>NSExtensionActivationRule</key>
    <string>
    SUBQUERY (
        extensionItems,
        $extensionItem,
            SUBQUERY (
                $extensionItem.attachments,
                $attachment,
                (ANY $attachment.registeredTypeIdentifiers UTI-CONFORMS-TO "com.adobe.pdf" OR
                ANY $attachment.registeredTypeIdentifiers UTI-CONFORMS-TO "public.file-url" OR
                ANY $attachment.registeredTypeIdentifiers UTI-CONFORMS-TO "public.url" OR
                ANY $attachment.registeredTypeIdentifiers UTI-CONFORMS-TO "public.jpeg" OR
                ANY $attachment.registeredTypeIdentifiers UTI-CONFORMS-TO "public.png")
                AND NOT (ANY $attachment.registeredTypeIdentifiers UTI-CONFORMS-TO "your.unique.uti.here")
            ).@count == $extensionItem.attachments.@count
    ).@count == 1
    </string>
</dict>
```

The important bit is `AND NOT (ANY $attachment.registeredTypeIdentifiers UTI-CONFORMS-TO "your.unique.uti.here")`. This ensures that if the `UIActivityViewController` is created with any items matching `your.unique.uti.here`, your extension will not be displayed in the list of options.

## Custom Activity Item Source

Next we need to add an item with a UTI matching `your.unique.uti.here` to the items passed into the `UIActivityViewController`.
For this, we pass in an instance of a class that implements [`UIActivityItemSource`](https://developer.apple.com/reference/uikit/uiactivityitemsource) as follows:

```swift
class ActionExtensionBlockerItem: NSObject, UIActivityItemSource {
    func activityViewController(_ activityViewController: UIActivityViewController, dataTypeIdentifierForActivityType activityType: UIActivityType?) -> String {
        return "com.your.unique.uti.here";
    }
    func activityViewController(_ activityViewController: UIActivityViewController, itemForActivityType activityType: UIActivityType) -> Any? {
        // Returning an NSObject here is safest, because otherwise it is possible for the activity item to actually be shared!
        return NSObject()
    }
    func activityViewController(_ activityViewController: UIActivityViewController, subjectForActivityType activityType: UIActivityType?) -> String {
        return ""
    }
    func activityViewController(_ activityViewController: UIActivityViewController, thumbnailImageForActivityType activityType: UIActivityType?, suggestedSize size: CGSize) -> UIImage? {
        return nil
    }
    func activityViewControllerPlaceholderItem(_ activityViewController: UIActivityViewController) -> Any {
        return ""
    }
}


let activityViewController = UIActivityViewController(activityItems: [/* Items to be shared, */ ActionExtensionBlockerItem()], applicationActivities: nil)

```

The only thing to be really careful about is getting the predicate syntax right, since that fails silently and will effectively prevent the extension from showing up in any app!

## Update With New Findings
The condition `.@count == $extensionItem.attachments.@count` means that we only activate when the number of shared items is equal the number of items we can process, or in other words, we only show up if each of the items that the host app shares can be processed by our extension. This is a totally valid setup and extensions can decide on their own if they share as many of the inputs as possible, or if they want to adopt an all or nothing approach.

However, if another extension uses the same all or nothing approach, it would not show up inside our app, as it will never be able to share our blocker type identifier, so it will not show up in the list.

Due to this we decided to remove this clause from our `NSExtensionActivationRule`, and hope that Apple fixes it "the right way".

