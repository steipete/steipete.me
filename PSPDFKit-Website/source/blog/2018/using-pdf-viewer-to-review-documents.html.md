---
title: "Using PDF Viewer to Review Documents"
description: "Did you know that PDF Viewer offers everything you need for reviewing documents? In this article, you'll learn how you can use PSPDFKit's markup tools to make editing suggestions to the author of an article."
section: blog
preview_image: /images/blog/2018/using-pdf-viewer-to-review-documents/article-header.png
author:
  - Daniel Demiss
date: 2018-11-26 8:00 UTC
tags: Products
published: true
secret: false
---

Did you know that PDF Viewer offers everything you need for reviewing documents? In this article, you’ll learn how you can use PSPDFKit’s markup tools to make editing suggestions to the author of an article.

## The Problem

One of the key features of PDF is that it offers the authors of a document control over what readers may do with it. This is often used for review workflows. For example, when you write a document that matters — be it a novel, a contract, a product brochure, a Ph.D. thesis, or a research paper — you naturally want feedback from other people.

While you likely trust the input of those people you’ve shared your document with, you typically do not want them to change everything about the document. Additionally, if you need feedback from more than just one person, you certainly don’t want to send them your Word, InDesign, or LaTex files; not only would incorporating their feedback become terribly complicated, but they may not even see the same document to begin with — for example, maybe they use an older version of the software, maybe they don’t have all the fonts they need, etc.

Instead, it tends to be more useful to generate a PDF from the file and send that for review.

## The Tools

You may be wondering the best way to review a PDF. The good news is that PSPDFKit provides everything you need for this to work well. Not only do we support highlight, underline, and strike-through annotations for marking up text in PSPDFKit for iOS, Android, Web, and Windows — along with in our [free PDF Viewer app][] — but we also support attaching notes to these so-called markup annotations on iOS and Android.

So, without further ado, let’s have a look at how to use them.

### Basic Markup

If you have an iOS or an Android device, go get our free PDF Viewer from the [App Store][] or [Google Play][] if you don’t have it already. There are also a number of other great apps out there that use our framework, so you may already have an app that supports everything we describe here. However, because PSPDFKit is very customizable, it’s possible that if you’re using a different app, the tools you need could be in different places or use other icons. As a result, please be aware that this post specifically covers how to review a PDF in our apps.

Once you have opened a document in PDF Viewer, the simplest way to make editing suggestions is by selecting the text you want to comment on. From the menu that appears on top of or below the selection, pick the highlighting icon. If you’re on a device with a narrow screen, the menu will change and reveal two different buttons, Styling and Comments. Tap the Comments button to add your remarks about the passage you’ve just highlighted and then dismiss the dialog. You’ll notice that a little speech bubble now appears next to your highlight. This indicates there are comments on the annotation.

<video src="/images/blog/2018/using-pdf-viewer-to-review-documents/highlight-and-comment.m4v" width="100%" playsinline muted data-controller="video" data-video-autoplay="true" alt="Screen Capture: Select, Highlight, Add Note"></video>

If you want to adjust the color of the highlight, you can do so by tapping the Styling button in the menu and selecting one of the preset colors.  

**Tip:** You can use the preset colors to color code the kind of remarks you want to make — for example, you can use red for “delete this,” yellow for “change this,” and blue to say “this is great.” In this way, you really only need just one tool for the job, and you can focus entirely on the content. This is especially useful if you’re reviewing a draft on your phone.

You can go back and change your comments at any point in time. In fact, you can browse through all of them if you tap on the library icon and select the annotations tab. Tapping once will jump to the appropriate page and highlight an annotation.

### Working with the Tools Palette

However, you can get more sophisticated than that. Instead of color coding something that should be deleted, why not use a strike-through? This way, you don’t even have to tell the author what the colors mean, as a strike-through will immediately be understandable.

And if you really just mean to remark about a typo or missing/incorrect punctuation, why not use a squiggly underline on the text in question? For this, you have to select the appropriate markup tool. And while these tools are readily available from the selection menu on an iPad, you will not see them on your phone due to the limited amount of space.

So, if it isn’t already visible, tap anywhere on the page to bring up the UI. Then tap the annotations icon to show the available tools.

**Tip:** The annotation toolbar can also be dragged to the left or right edge of the screen.

<video src="/images/blog/2018/using-pdf-viewer-to-review-documents/move-annotation-toolbar.m4v" width="100%" playsinline muted data-controller="video" data-video-autoplay="true" alt="Screen capture: tap annotations icon, drag annotation toolbar to left edge"></video>

Because there are too many of these tools to fit the screen, some of them are grouped by kind. This is the case for all the markup tools, as you can see by the small triangle at the bottom right of the icon. If you tap and hold on such an icon, a popover appears and reveals all the other tools in the group.

Once you’ve selected the tool you want, the popover will collapse again, and the tool’s icon will be used for the group in question. As long as the tool is active, dragging over a body of text will now create a new markup annotation instead of selecting the text.

<video src="/images/blog/2018/using-pdf-viewer-to-review-documents/switch-to-strike-through.m4v" width="100%" playsinline muted data-controller="video" data-video-autoplay="true" alt="Screen capture: switch from highlight to strike-through tool, and strike a word"></video>

As with highlight annotations, strike-throughs, underlines, and squiggly lines support notes. So if you need to convey additional information, PDF Viewer has you covered.

Once you’re done reviewing, all that’s left for you to do is send the PDF with your annotations back to the author. Tap the share icon in the navigation bar and select your mail program to compose a new email to the author. Because we save notes on annotations according to the PDF standard, the author does not even have to use PDF Viewer to view them. Adobe Reader, for example, will display them just fine.

![Screen Grab: Commented highlight in Adobe Acrobat Reader](/images/blog/2018/using-pdf-viewer-to-review-documents/annotated-highlight-in-reader.png)

# Conclusion

In this article, we’ve shown you how to create highlight, strike-through, and underline annotations with our free PDF Viewer app. We have also demonstrated how to attach notes to these annotations so that you can provide detailed feedback in a way that is easily accessible to the author. Lastly, we’ve shared how you can move the annotation toolbar for quicker access.

To add a little personal anecdote in closing:  You may have noticed that (and wondered why) the screen captures in this article are all in German. This is because what you are getting a peek at is an earlier version of a chapter from my significant other’s dissertation.

What I am describing here is how the two of us used PDF Viewer to proofread and review a complex, professional document that ended up at a total of roughly 400 pages. More than 90 percent of the reading and annotating on my end happened on an iPhone 6s while I was on public transit, waiting for my lunch at a restaurant, sitting in the grass on a levee by the harbor... you get the idea.

It’s hard to overstate how valuable being able to do this on my own terms, whenever I had some downtime, was — regardless of if I had my iPad or Mac with me. For her, it meant receiving feedback as soon as possible — often within a day or less. For me, it meant being able to support her without my work here at PSPDFKit having to suffer and while still having time for a social life. But even without the constraint of “needs to be feasible at any time and place,” this workflow was much better than giving me (and the other reviewers) access to the source document(s).

Not being able to screw up the original content — _no matter what you do_ — is an invaluable feature of PDF. So is not having to second guess whether any weird formatting or misalignment that catches your eye is an actual mistake or a layout glitch caused by a version incompatibility. Regardless of if you are an academic writer looking for feedback on a paper from their peers, or a person reviewing the contract for their new job or apartment, the next time you seek or need to provide feedback on an important document, consider using [PDF Viewer][free pdf viewer app].


[free pdf viewer app]: https://pdfviewer.io/
[app store]: https://pdfviewer.io/store-ios
[google play]: https://pdfviewer.io/store-android
