---
title: "The Bittersweet iOS Document Browser"
description: "A quick look at both the benefits and downsides of using the iOS system document browser in your applications."
preview_image: /images/blog/2019/the-bittersweet-ios-document-browser/article-header.png
section: blog
author:
  - Matej Bukovinski
author_url:
  - https://twitter.com/bukovinski
date: 2019-04-24 8:00 UTC
tags: iOS, Development
published: true
secret: false
---

It’s been about a year and half since iOS 11 was released into the wild, and with it, the long-awaited system document browser. [PDF Viewer][] was one of the first applications that truly went all in with this new component, and we did this by fully replacing our custom solution with it on devices that were upgraded to iOS 11. This move certainly got us a lot of attention and praise from power users, but it also caused a lot of frustration for others who were unlucky enough to stumble upon the bugs and limitations of this new component. From a developer’s point of view, it was a mixed bag as well. On one hand, it allowed us to stop developing our custom document browser, thereby saving ourselves a lot of valuable development time in the process. On the other hand, it forced us to make do with a system we did not own and couldn’t even “hack” around when there were problems.

PDF Viewer will drop support for iOS 10 shortly, which will get rid of the final remains of our custom document browser, so we thought it might be a good time to take a closer look at how its system replacement is doing and go over the good, the bad, and the ugly.

READMORE

## Adopting the File Picker

Apple’s decision to abstract the file system away from end users was certainly a controversial one. It was a long-standing thorn in the flesh for both power users, who had [trouble managing their files effectively][macstories document management], and developers, who had to implement complex custom document browsers inside their apps instead of focusing on the core experience. We were in exactly that position with PDF Viewer; we were forced to put significant effort into writing a document management system with support for third-party cloud providers. Luckily, the file system situation gradually began to improve, and with iOS 11, we finally got a proper system document browser we could use inside our application. We immediately jumped on the bandwagon and made PDF Viewer one of the first applications that supported the new component, hoping it would eventually remove the significant timesink on the development front while simultaneously improving the user experience.

The [`UIDocumentBrowserViewController`][] integration was fairly straightforward for our use case, but it was complicated by the fact that we still had to support earlier versions of iOS at that point — and, in fact, until very recently. So instead of reducing the amount of file management code in our app, it actually substantially increased it, as we had to both keep the original solution and implement dedicated code paths for the file browser.

The modifications weren’t limited to just handling document presentation, but also included functionality like state restoration, importing documents via extensions, new document creation, URL scheme handling, and so on. We had to make a few compromises here and there, as we no longer had the ability to programmatically navigate the file system API, but in general, we managed to get all our key functionality working inside the new UI.

The new implementation also affected our UI tests and automated screenshot generation. Recording touches on the first view in our application was no longer an option due to the out of process nature of `UIDocumentBrowserViewController`. Instead, we had to manually script actions and rely on environmental variables to trigger them while running tests and screenshot generation.

## Customization Options

`UIDocumentBrowserViewController` is designed to be presented as a fullscreen view controller. Normally, this is the very first view users encounter in a document-based application. It’s therefore crucial for this component to be well designed and customizable enough to fit into most applications. The team responsible for the Files app and the document browser made some good choices and came up with a design that should fit well into most applications that try to stay true to the stock iOS design. The component is also customizable enough to provide a few hooks for integrating custom UI elements, such as the addition of navigation bar buttons or the extension of the list file actions with custom options.

Fortunately, PDF Viewer mostly fits the description of a stock iOS app, so the document viewer design didn’t look too out of place in our application. There was, however, a significant compromise we had to settle on right at the start in order to make the component truly fit into our design. Previous versions of PDF Viewer used a custom blue tint color for the background of our navigation bar and toolbars. This is a style that is not possible on the document browser. It supports three main styles: light (read: gray), white, and dark. Those styles predefine elements such as the navigation bar tint and directory backgrounds. If you want a custom-tinted navigation bar, you’re simply out of luck. Instead of fighting the system, which is a fight we could not have won, we decided to change the appearance of our entire application and used the “gray” style throughout PDF Viewer. This also limited us to choosing exactly those three color schemes when we decided to add theming options later on. Every other design would show inconsistencies between the main application UI and the document browser, which is something we didn’t want in PDF Viewer.

| Old Document Browser                                                                                   | New Document Browser                                                                                   |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| ![Old Document Browser](/images/blog/2019/the-bittersweet-ios-document-browser/OldDocumentBrowser.png) | ![New Document Browser](/images/blog/2019/the-bittersweet-ios-document-browser/NewDocumentBrowser.PNG) |

As we dug deeper and wanted to extend the document browser with new functionality or incorporate user feedback, we eventually stumbled upon more limitations that we could not work around. Here are just a few of the recent enhancement radars our team has filed for the document browser:

- `UIDocumentBrowserViewController` sidebar should show a link to the app container — [rdar://41250610][]
- `UIDocumentBrowserViewController` should allow integration of custom controllers into its tab UI — [rdar://41250983][]
- `UIDocumentBrowserViewController` should provide a way to show a custom UI before showing the share sheet — [rdar://41251386][]
- `UIDocumentBrowserViewController` should show the default WebDAV provider visible in iWork applications — [rdar://41251699][]
- `UIDocumentBrowserViewController` should allow to override even known UTIs such as com.adobe.pdf — [rdar://41307902][]
- `UIDocumentBrowserViewController` and files app show local files, but not app containers — [rdar://41308284][]
- `UIDocumentBrowserViewController.customActions` can’t be filtered on a per-file basis — [rdar://45710119][]
- `UIDocumentBrowserViewController` + passcode support for Enterprise Box Accounts — [rdar://43146217][]
- Allow using a custom view for `UIDocumentBrowserAction` — [rdar://42897668][]
- Show additional navigation bar items on the initial `UIDocumentBrowserViewController` Browse screen — [rdar://42857158][]
- Add `UIDocumentBrowserAction` API to be disabled in the Recently Deleted location — [rdar://42856531][]
- Add an option to require multiple items for `UIDocumentBrowserAction` — [rdar://42856290][]
- Allow clearing recent documents via UI or API [rdar://40676074][]

You can also find some additional radars by simply searching [on Open Radar][uidocumentbrowserviewcontroller on open radar]. A significant number of these have been filed by our team. After it was first released, the document browser also suffered from various UI glitches and behavioral bugs, but Apple has been pretty responsive on this front, as most of those have already been sorted out by now.

## File Provider Extensions

Support for third-party File Provider extensions is arguably the document browser’s single biggest highlight feature. Our custom document management system officially only supported local storage and iCloud, although we also laid basic groundwork for supporting other big cloud storage providers. And even at that stage, it was already becoming a nightmare to maintain. There was no way we could have realistically supported all the storage providers our users have been requesting from us. But with File Provider extensions, this is now no longer an issue. Cloud storage providers simply integrate with the document browser through a system of extensions. All users need to do is install the appropriate cloud storage provider apps. Once configured, users get access to their documents in one place, with a consistent UI, no matter where those documents are actually stored.

While this system is great in concept, it also leads to one of the biggest problems we have been facing with the document browser. Since file management is now handled through a bunch of vastly different third-party implementations, the user’s experience will significantly depend upon the quality of the selected File Provider extension. If it’s implemented well, then the user will have a good experience when working with documents. If it’s not, the experience might be plagued by all sorts of significant problems, including UI glitches, non-opening files, non-intentional file duplication, save failures, and even total data loss in extreme cases. The [PDF Viewer FAQ][viewer faq] has an entire article dedicated to [common document browser issues][document browser issues], many of which are directly related to problems with specific File Provider extensions.

In most cases, when issues arise with file management, people will directly blame the host app. They will either complain on support, or — even more likely — simply give a bad rating on the App Store and remove the application. Usually there’s nothing we, the app developers, can do about this. The extensions run as processes separate from the app and are simply not accessible to us in any way. Needless to say, this is a big source of frustration on our side.

<iframe style="border: none;" src="https://appfollow.io/app/57503/review/48488829?s=p3&embed=1" width="600" height="723" frameborder="0" scrolling="no" allowfullscreen></iframe>

Files available via File Provider extensions are a shared resource; they might be accessed by several applications, syncing processes, and other extensions all at the same time. It’s therefore crucial both for applications using the document browser to support [file coordination][] to ensure files are being accessed in a safe manner, and for [file presentation][] to pick up and process external file changes. This system only works if both applications and file providers play by the system’s rules. That’s unfortunately frequently not the case. We’ve observed some significant differences — mostly when it comes to correctly providing file presentation updates — between different file provider implementations. Some do this really well (iCloud), and some are lacking sufficiently (most others). This makes it hard for applications to correctly reflect sync updates and reliably [resolve conflicts][conflict resolution].

We hope both cloud storage providers and Apple itself become a bit stricter when it comes to testing and quality assurance of File Provider extensions. Incomplete implementations and slipped bugs have a significant effect on a large and evergrowing set of applications, and this potentially means a significant risk to the integrity of our users’ data.

## Conclusion

With all the downsides presented above, I wouldn’t be surprised if you got the impression that we’re not happy with the decision to switch, or that we would not recommend that others attempt the same. However, this is not true. While the document browser is a far from perfect component, it’s still the best option for file management on iOS. We learned the hard way that providing your own file management component can be a big distraction from the key functionality of your app. And even if you accept that and put a lot of effort into your custom solution, there is no way to cover all possible file sources your users would like to see integrated. The file browser solves this, and that alone is worth putting up with all its little quirks and limitations for. Hopefully with time, these things will be sorted out and we’ll be left with something we can fully rely on. With that, more and more applications will adopt the component and we firmly believe that, in time, it will become an essential part of any document-based application.

[pdf viewer]: https://pdfviewer.io
[macstories document management]: https://www.macstories.net/stories/beyond-the-silo-how-apple-plans-to-reinvent-document-management-with-ios-8/
[`uidocumentbrowserviewcontroller`]: https://developer.apple.com/documentation/uikit/uidocumentbrowserviewcontroller
[viewer faq]: https://faq.pdfviewer.io/pdf-viewer-for-ios
[document browser issues]: https://faq.pdfviewer.io/pdf-viewer-for-ios/troubleshooting-and-feedback/known-issues-with-the-document-browser-on-ios-11
[conflict resolution]: https://pspdfkit.com/guides/ios/current/features/conflict-resolution/
[uidocumentbrowserviewcontroller on open radar]: https://openradar.appspot.com/search?query=UIDocumentBrowserViewController
[file coordination]: https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileCoordinators/FileCoordinators.html#//apple_ref/doc/uid/TP40010672-CH11-SW3
[file presentation]: https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileCoordinators/FileCoordinators.html#//apple_ref/doc/uid/TP40010672-CH11-SW4
[rdar://41250610]: https://openradar.appspot.com/41250610
[rdar://41250983]: https://openradar.appspot.com/41250983
[rdar://41251386]: https://openradar.appspot.com/41251386
[rdar://41251699]: https://openradar.appspot.com/41251699
[rdar://41307902]: https://openradar.appspot.com/41307902
[rdar://41308284]: https://openradar.appspot.com/41308284
[rdar://45710119]: https://openradar.appspot.com/45710119
[rdar://43146217]: https://openradar.appspot.com/43146217
[rdar://42897668]: https://openradar.appspot.com/42897668
[rdar://42857158]: https://openradar.appspot.com/42857158
[rdar://42856531]: https://openradar.appspot.com/42856531
[rdar://42856290]: https://openradar.appspot.com/42856290
[rdar://40676074]: https://openradar.appspot.com/40676074
