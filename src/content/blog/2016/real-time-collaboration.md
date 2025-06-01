---
title: "Real-time collaboration, Apple, and you"
pubDatetime: 2016-09-08T12:00:00.000Z
description: "Analysis of Apple's real-time collaboration features announced in 2016 and their implications for developers."
tags:
  - Products
source: pspdfkit.com
AIDescription: true
---

Yesterday at the [Apple Event](http://www.apple.com/apple-events/september-2016/), next to iPhone 7 and Apple Watch Series 2, Apple announced something interesting: real-time collaboration for iWork across Mac, iPad, iPhone and the web.

So far there’s no beta available, but Apple demonstrated how it’d work by editing a set of Keynote slides on stage. Users will be able to add text, images, and animations to their documents in real time on all platforms that Apple supports.

![iWork Real-time collaboration](/assets/img/2016/real-time-collaboration/iwork-real-time-collaboration.png)

[Image by The Verge](http://www.theverge.com/2016/9/7/12836660/apple-real-time-collaboration-iwork)

## History

One of the first apps that made collaborative editing easy on the Mac was [SubEthaEdit](https://en.wikipedia.org/wiki/SubEthaEdit) back in 2003. It used Bonjour to broadcast messages in the local network, but later added collaborative editing over the Internet. However, it was Google that made real-time collaboration mainstream with [Google Docs](http://docs.google.com), which originally was named Writely - an [experiment](http://www.theverge.com/2013/7/3/4484000/sam-schillace-interview-google-docs-creator-box) with the (back then) new Ajax technology and the "content editable" function in browsers.

Microsoft first added real-time editing in 2013, but [only for its Office Web Apps](http://www.theverge.com/2013/11/7/5075192/office-web-apps-real-time-editing-features). Only much later did Microsoft ship [a variant of it in Office 2016](http://www.theverge.com/2015/5/4/8547433/microsoft-office-2016-real-time-co-authoring-features); however, it currently only works in Word. Other apps are planned in the future. There are even third-party products such as [the Dropbox badge](http://venturebeat.com/2014/12/11/dropbox-launches-microsoft-office-collaboration-features-for-word-excel-and-powerpoint-on-windows-and-mac/) (Codename “Project Harmony”) that have tried to ease the problem of conflicting files caused when multiple people edit at the same time.

It’s nothing new for Apple, either. Apple first added support for collaborative editing [in iWork for iCloud in 2013](http://appleinsider.com/articles/13/11/14/apple-adds-realtime-collaboration-document-organization-to-iwork-for-icloud-beta). It was quite limited and [only worked across the web](https://discussions.apple.com/thread/5510524?tstart=0), leaving out Mac and iOS, as platforms, completely.

Looking at the history, one might wonder why it took so long to move from web to apps. One word: offline-support. While it’s a reasonable assumption to require a working internet connection for web apps, this breaks down for native apps. Try disabling your Wi-Fi while editing a Google Doc - it won’t allow you to type anymore. This allows for a much simpler client-server sync model, where changes can be sent to a server immediately, without complex offline storage or a conflict resolution model.

## Technology

Offline-first, real-time collaborative sync is hard. There are only a few vendors out there that support all of the above. [Apache CouchDB](http://couchdb.apache.org/) is an open source, document-oriented NoSQL database. It also offers frameworks for [iOS](https://github.com/couchbase/couchbase-lite-ios) and [Android](https://github.com/couchbase/couchbase-lite-android).

[Google’s Firebase](https://firebase.google.com/docs/database/) is a real-time database with great support for mobile. However, it’s impossible to host a Firebase instance on-premise to protect your data, and [you can’t encrypt the data on the server either](https://groups.google.com/forum/#!searchin/firebase-talk/encrypt/firebase-talk/Xj9Ejv6_HjE/vbUlQ993o60J) - Google has full access to your data. It also [lacks support for binary assets](https://groups.google.com/forum/#!searchin/firebase-talk/encrypt/firebase-talk/AAc-Lg66riQ/vvaVhFFxHQAJ).

Apple offers [CloudKit](https://developer.apple.com/icloud/); however, there’s no guaranteed propagation time and it usually takes a few minutes until records update. Initially, it was limited to the iOS/macOS platforms, but Apple added [CloudKit JS](https://developer.apple.com/reference/cloudkitjs) in 2015 to extend support to the web, and theoretically to other platforms like Android, [if you build an SDK yourself](https://github.com/jaumecornado/DroidNubeKit). However, you still can’t fully encrypt data, it doesn’t support on-premise and your users also need an iCloud account for authentication.

Facebook purchased Parse and eventually shut it down. Parse wasn’t real-time, but it’s now open-source and can be installed on-premise. Facebook has no need for it, so its future is unclear and, therefore, many people are migrating to other services.

## PSPDF Instant

PSPDFKit is a great product to display and annotate documents. Of course, you also want to share this markup. Many apps simply save and upload the whole PDF, which can be hundreds of megabytes each - quite the opposite of easy, real-time collaboration.

A slightly better solution is to iterate over annotations and transmit JSON or XFDF. While this is faster, it can be a problem if your annotations include binary assets like images or sounds. It also doesn’t handle conflict resolution.

Looking at the existing solutions, we found that there is no product that solves this problem well while also allowing you to own your data. If you care about your users' data, you’re left with building this from scratch, which is not feasible for most teams - the same way you do not want to write your own PDF renderer.

We understand SDKs at PSPDFKit, so our goal was to solve this problem in a generic way - completely untangled from PDF - and then use this framework to build [PSPDF Instant](https://pspdfkit.com/instant).

## Putting It All Together

PSPDFKit launched an SDK for iOS in 2011. Three years later, [we added Android](https://pspdfkit.com/blog/2016/pspdfkit-android-2-5/), and now we’re about to launch on our third platform [PSPDFKit for Web](https://pspdfkit.com/web/). The browser works a bit differently from native apps and it would be quite weird to ask the user to manually save a PDF. We needed a system that would automatically transmit annotations back to the files, and conveniently, we had built just that with PSPDF Instant.

What does this mean? Although two separate products, PSPDFKit for Web automatically uses PSPDF Instant in the background. Your annotations are synchronized in real-time with the PSPDFKit Server, where they are stored in a database and can be written back into a PDF anytime.

We wanted to achieve the same outstanding experience for PSPDFKit for Web as we have for iOS and Android. Although it’s still in beta, we’ve worked hard to get native text selection and optimize performance so that it could easily connect to PSPDF Instant for real-time collaboration. Want to try the beta version? [Contact us](https://pspdfkit.com/sales) to get an invite.

Alternatively, check out our [PSPDFKit for Web Showcase](https://web-preview.pspdfkit.com/), pick a document and share its URL with a friend. Fair warning, everyone who has access to the same URL will be participating in the same collaboration session, so be mindful when choosing people to share a document with.

The possibilities appear to be endless with PSPDF Instant. We currently have our first app, PDF Viewer, in beta, and we’re already brainstorming ways we can incorporate PSPDF Instant into future versions of the app. Want to be part of our PDF Viewer beta team? [Let us know](https://pdfviewer.io).

_Update:_ Apple's Real-Time iWork extensions are still in beta and it seems they will need some more work to iron out the issues. Let's hope [our extensive use of tests](/blog/2016/e2e-testing/) will make the experience better for PSPDF Instant.

<blockquote class="twitter-tweet" data-lang="de"><p lang="en" dir="ltr">I take back what I said. Someday, Apple will get iWork collaboration right. For now, back to Google Docs. (Yes, I&#39;m sure &quot;it works for you&quot;) <a href="https://t.co/l3NeJ7CG8t">pic.twitter.com/l3NeJ7CG8t</a></p>&mdash; Federico Viticci (@viticci) <a href="https://twitter.com/viticci/status/777997187393421313">19. September 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
