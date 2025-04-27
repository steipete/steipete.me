---
title: "Embracing the Limits of UIActivityViewController"
description: "We talk about our experience in implementing the new sharing flow."
preview_image: /images/blog/2019/embracing-the-limits-of-uiactivityviewcontroller/article-header.png
section: blog
author:
  - Oscar Swanros
author_url:
  - https://twitter.com/Swanros
date: 2019-03-20 8:00 UTC
tags: iOS, Objective-C, Refactoring
published: true
secret: false
---

With [PSPDFKit 8 for iOS][], we introduced a new way to share documents to other applications and system services. The New Sharing Flow, as we call it internally, offers a more cohesive way to share documents from PSPDFKit 8-powered apps, such as PDF Viewer 3.1 for iOS, which shipped with this update.

Although the changes to the sharing flow’s UI could seem small, the actual refactoring and process was everything but. So in this article, I want to take the opportunity to tell you a bit about how we managed to completely revamp the way our SDK shares documents, what we tried, what didn’t work, and what we learned along the way.

Buckle up!

## About Sharing

Sharing is one of those features that’s expected to be present in most applications these days. In fact, it would actually be strange for a modern application to let a user interact with any kind of content and not let them share it in some way or form.

Interestingly enough, the PDF format (or _Portable_ Document Format) exists for this very purpose: It was originally conceived as a solution for the challenges of reproducing information that could vary from one system to another.

So when the kickoff meeting for the PSPDFKit 8 for iOS development happened, we decided we should revisit how sharing a document worked in the SDK and see if we could actually do something to improve it.

It turned out we indeed had room for improvement. More specifically, we decided that how documents are shared out of PSPDFKit-powered applications needed to be revisited. But first, we needed to think about what we were trying to accomplish.

We began by asking ourselves: What would a user care about when sharing PDFs? One of the hallmark features of PSPDFKit is our amazingly fast, fluid annotation engine that lets you add and edit documents with a lot of different annotation types — so we knew annotations had to play a large part when sharing.

On top of that, it was not too long ago that we [introduced Image Documents][], so it only felt natural that any document could be exported as an image as well.

## The Motivation

Up until we decided we needed to rethink the way we enable users to share documents, our stack offered the possibility to share a document in a way that felt natural, and although it worked just fine in the majority of situations, the edge cases where it didn’t were really important to us, because they resulted in an inconsistent experience for the end user.

![](/images/blog/2019/embracing-the-limits-of-uiactivityviewcontroller/share_demo_7.gif#img-width-75)

In the above video, notice how after the Share button is tapped, the share sheet is immediately displayed to let the user pick where they want to send the document. But only in a handful of these cases were we able to present the user with some options to customize _how_ we should process the document before actually doing so. These were limited to functionalities already provided by the system: printing, sharing to email, and sharing to messages, to name a few.

This means we couldn’t offer customization options for every item in the share sheet, which resulted in a less than optimal experience: Sharing a document to `Mail.app` would let the user decide whether or not they wanted to embed or flatten the annotations into the shared document, but sharing to WhatsApp or Messenger wouldn’t.

If we wanted to customize the options that were presented to the user when sharing to `Mail.app`, we could hook into the flow via the `PSPDFMailCoordinator` class. `PSPDFMessagesCoordinator`, `PSPDFPrintCoordinator`, and `PSPDFExportCoordinator` were also available. So, if we wanted, for instance, to customize the name of the files being shared to `Mail.app`, we’d implement this inside `PSPDFMailCoordinator`, but to do so for `Messages.app`, we’d need to reimplement the exact same behavior on `PSPDFMessagesCoordinator`.

You can see how this quickly gets out of hand: This approach would require us to provide a coordinator class to hook into the sharing flow for each application available on the App Store.

Ultimately, we decided this strategy for sharing documents could be improved upon, so we started to think about how we could do so. And the first step was identifying the tools within our reach.

## The Tools

`UIActivityViewController` was introduced in iOS 6 as a way to unify the sharing experience between all apps in the iOS ecosystem. Before this, every application had to invent and roll out its own way of sharing content, which resulted in a less than ideal experience, since every application had their own idea of how content should be shared.

As a way to let developers interact with the default sharing flow across iOS, Apple provides us with the following:

- `UIActivity` is an abstract class that’s meant to be subclassed to represent an action that can be executed on the item that’s being shared. The concrete implementations of this class represent _something_ that can take input and execute an action with it.

- `UIActivityItemSource` is a protocol that defines an interface used by the activity view controller to request the information related to the item that’s being shared from an object of any type.

- `UIActivityItemProvider` acts as a vessel through which data can be delivered to the activity view controller, even if the data is not available at the moment the activity view controller is displayed.

After recognizing what we could use and having a basic understanding of how the entire process is brought together by all the aforementioned classes and protocols, we came up with the first idea that would help us achieve our goal.

### The First Game Plan

`UIActivityItemSource` caught our attention pretty early on, as it has a rather simple interface. However, it also contains a list of requirements that proved tough for us to compromise on. Its documentation states the following:

> Because the methods of this protocol are executed on your app’s main thread, you should avoid using this protocol in cases where the data objects might take a significant amount of time to create. When creating large data objects, consider using a `UIActivityItemProvider` object instead.

This is immediately a red flag for us, since PDFs can be quite complex and there’s no guarantee as to the amount of time the processing of one will take — we regularly test our SDKs with huge PDF files (hundreds of megabytes and tens of thousands of pages), so we know that things can take a really long time.

We did a brief experiment to see how using `UIActivityItemSource` would behave, and although we could certainly add a bunch of checks to make sure the experience was as smooth as possible, the fact that the file generation would need to happen on the main thread was enough for us to look for another way.

So we adjusted, and we decided to try using `UIActivityItemProvider` instead. Since it’s modeled after `NSOperation`, which is a thought model we’re already familiar with, we figured it was worth the shot, and we came up with the first game plan:

1.  We’d show the option-configuration UI and let the user choose how they wanted to share the PDF.
2.  We’d create a dummy item, using `UIActivityItemProvider`, that would represent the PDF with the selected options, and we’d pass that to a generic `UIActivityViewController`.
3.  We’d then override the `item` property on the item provider to, in that moment, generate the PDF asynchronously, since an item provider is just a subclass of `NSOperation`.

So we started building the idea, and the first task was to come up with an object we could use as a placeholder so that the `UIActivityViewController` could present the appropriate options without having actual content, since the actual PDF processing would be done as the last step of the process.

What could we use as a placeholder? The [documentation for the placeholder parameter on `UIActivityItemProvider`][] states the following:

> **`placeholderItem`**: An object that can stand in for the actual object you plan to create. The contents of the object may be empty but the class of the object must match the class of the object you plan to provide later.

So, we could probably just use an empty `PSPDFDocument` instance, right? `PSPDFDocument` is itself a `UIActivityItemSource`-compliant class, so it should have worked. But we tried, and as it turns out, it didn’t work.

When digging into the documentation for `-[UIActivityItemSource activityViewControllerPlaceholderItem]`, we found the following information:

> This method returns an object that can be used as a placeholder for the real data. Placeholder objects do not have to contain any real data but should be configured as closely as possible to the actual data object you intend to provide. In general the actual value should match in type but it is possible to return a different type of data for activityViewController:itemForActivityType:. It should be one that the activity can handle otherwise you may get an activity with empty content. For example, the placeholder could be a `UIImage` object but the actual value could be an `NSData` object with PDF information.

But the actual _header documentation_ for that same method states:

> // called to determine data type. only the class of the return type is consulted. it should match what `-itemForActivityType:` returns

It turns out that `UIActivityItemProvider` and `UIActivityItemSource` are not meant to be used together. We actually filed a radar ([rdar://43312116][]) for this because we thought it ought to work, and this is the response we got:

> `UIActivityItemSource` and `UIActivityItemProvider` are intended to be used as the actual activity items that the `UIActivityViewController` is initialized with, to serve as "promises" that are later fulfilled when the user actually chooses an activity to perform.
>
> Placeholder items are solely a mechanism to communicate to the system the basic type(s) of data you are capable of sharing, because the actual data or activity items may be expensive to generate, or may depend on the user selected activity. It does not make sense to have either a `UIActivityItemSource` or `UIActivityItemProvider` return a placeholder object that itself is a `UIActivityItemSource` or `UIActivityItemProvider`, as the placeholder is needed immediately (prior to the selection of any activity item) to determine which activities to display, and so a "promise" placeholder object would serve no purpose. Use the `-activityViewControllerPlaceholderItem:` delegate method of `UIActivityItemSource` if you wish to customize the exact placeholder item returned at the moment it is requested.

### Back to the Drawing Board

After this, we went back to the drawing board, and we decided to redesign our original approach so that instead of processing the document after the sharing destination was selected, we’d do so beforehand and then just pass the generated files to the destination itself.

Once we started thinking about this approach, we realized it was much better and offered more flexibility than our original idea, which would have required us to, most certainly, delve into private API territory and deal with unforeseen limitations.

After we came to this realization, a lot of the actual work involved was that of removing old code paths and cleaning up. Fortunately, PSPDFKit’s code is really well organized, and the dependencies are well isolated, so going forward wasn’t really a tough process so much as a meticulous one.

## Conclusion

Starting with PSPDFKit 8 for iOS, when sharing a document, we first offer a list of available options the user can configure, and then we process the document. And until we have a final file we can share without complications, we hand the result over to `UIActivityViewController`, just as we would with any other data.

![](/images/blog/2019/embracing-the-limits-of-uiactivityviewcontroller/share_demo_8.gif#img-width-75")

We could’ve gone the route of rolling our own sharing solution, as many large applications still do (YouTube, for instance, has its own _share sheet_ implementation), as it would’ve given us complete control over the sharing experience. However, this mean our customers would have had to use this custom UI that could be at odds with their app’s flow. And as an SDK provider, we try to be as transparent as possible and use the platform’s conventions as much as possible.

In a previous blog post, [Refactoring Large Codebases: Tips and Tricks][], I talked about how I approach large refactorings such as this one. And the experience of implementing the new sharing flow is what inspired me to write my refactoring post, so if you want more insight on the process, feel free to read that post next, if you haven’t already.

[pspdfkit 8 for ios]: https://pspdfkit.com/blog/2018/pspdfkit-ios-8-0/
[introduced image documents]: https://pspdfkit.com/blog/2018/image-documents/
[documentation for the placeholder parameter on `uiactivityitemprovider`]: https://developer.apple.com/documentation/uikit/uiactivityitemprovider/1620463-initwithplaceholderitem?language=objc
[rdar://43312116]: http://www.openradar.me/43312116
[refactoring large codebases: tips and tricks]: https://pspdfkit.com/blog/2018/refactoring-large-codebases-tips/
