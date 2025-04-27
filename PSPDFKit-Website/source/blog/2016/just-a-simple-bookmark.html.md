---
title: "Just a simple bookmark"
description: When books became digital, bookmarks became more complicated. Instead of stuffing a piece of paper in a book, you now had to store a digital marker, which is not always as simple as it looks.
preview_image: /images/blog/2016/just-a-simple-bookmark/analog-bookmark.jpg
section: blog

author: Jernej Virag
author_url: https://twitter.com/jernejv
date: 2016-08-25 12:00 UTC
tags: Development
published: true
---

Since the inception of longform text, readers found that they needed to somehow mark their progress and interesting passages as they read. Marking your position in a book or returning to interesting text was rather simple - you took a piece of wood or paper and placed in the book. Done! Page marked.

When books became digital, the issue wasn't as simple anymore. Instead of stuffing a piece of paper in a book, you now had to store a digital marker, which is not always as simple as it looks.

## Bookmarks and PDF

PDF is a venerable 23-year-old format, which has consistently grown in features over time. It supports everything from simple text to 3D animations and interactive forms. However, after scanning through all [750 pages of the specification document](/guides/ios/current/troubleshooting/complexities-of-rendering-pdfs/), it doesn't reveal anything about any kind of bookmark support.

Looking at other PDF reader software confirms that there's no standard way of storing bookmarks inside (or next to) PDF documents. Several, more prominent, readers don't support bookmarking at all. The only exception to the rule is Apple Preview on OS X, which stores bookmarks inside the PDF file in a non-documented format. Thus, we had to find another way.

## Doing it right

Up until now, PSPDFKit for iOS stored bookmarks in a separate plist file. This meant that bookmarks were stored only on a single device and, due to chosen format, weren't really portable to other platforms. We decided to overhaul our bookmark support with the following objectives:

* Store bookmarks in the PDF file itself so users can share or copy the file without losing data.
* The bookmark format should be portable across platforms - Android, iOS and [PSPDFKit for Web](/web).
* Bookmarks should be sharable in real time with multiple users using [PSPDF Instant](/instant).
* Bookmarks should show up in other third party readers that support them.
* The PDF structure shouldn't be affected by the format - readers that don't support bookmarks should display the PDF file properly and not damage it.

Looking at these goals, we understood that we'd have to add bookmarks to the PDF file stream (just like Annotations are added), but the question remained about the format itself. If we wanted to keep portability, we had to choose a format that's easy to read and doesn't interfere with other readers.

The possible solution to this problem appeared when we were investigating support for other readers. It turns out that Apple Preview uses Adobe's [XMP standard](https://en.wikipedia.org/wiki/Extensible_Metadata_Platform) to store its bookmarks. XMP is an XML based format built to allow the adding of metadata to common document, image, audio and video files without interfering with the data itself. It allows storing of metadata like image size, title, author, notes or ... bookmarks!

Example of an entry in PDF:

```xml
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="XMP Core 5.4.0">
   <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <rdf:Description rdf:about=""
            xmlns:apple-preview="http://ns.apple.com/Preview/1.0/">
         <apple-preview:Bookmarks>
            <rdf:Seq>
               <rdf:li rdf:parseType="Resource">
                  <apple-preview:PageIndex>2</apple-preview:PageIndex>
                  <apple-preview:UUID>DBFF2808-23E6-4CC9-A4ED-ECB898E11AB5</apple-preview:UUID>
               </rdf:li>
               <rdf:li rdf:parseType="Resource">
                  <apple-preview:PageIndex>0</apple-preview:PageIndex>
                  <apple-preview:UUID>77D52063-ED35-4C35-ADCC-E0A01CF71668</apple-preview:UUID>
               </rdf:li>
            </rdf:Seq>
         </apple-preview:Bookmarks>
      </rdf:Description>
   </rdf:RDF>
</x:xmpmeta>
```

The downside is fairly obvious from the example - it's a pretty verbose XML-based format that uses namespaces. That would mean adding a full XML parser, but most of the tiny ones don't support namespaces. Ignoring the namespaces would mean that we could ruin existing data.

## New bookmarks in PSPDFKit

In the end, we decided to go with XMP metadata format stored in the "Metadata" dictionary of a PDF file. Even though it's verbose, it would let us fulfill all the goals listed in previous section and enable us to generate bookmarks compatible with Apple Preview as well.

First, we had to choose a proper XML library to use. In order to avoid duplicate work, we implemented the bookmarks provider in C++ and that meant looking for a C or C++ XML library. After taking a look at several tiny C++ XML libraries - TinyXML, TinyXML2, RapidXML - they all came up short. None of the libraries supported namespaces. We ended up taking Adobe's XMP SDK library, extracting the XMPCore component (which is the only one we really needed) and running it through several passes of the [Clang Static Analyzer](http://clang-analyzer.llvm.org/) to [harden the code](/guides/ios/current/faq/sdk-security/). A minor Android-specific patch later, we had a fully XMP compliant library ready to go!

Lastly, came the question of the dataformat itself. While Apple Preview stores only page index for a bookmark, PSPDFKit allows users and developers to define a name and an arbitrary PDF action for a bookmark. This means that PSPDFKit bookmarks can point to other documents, internet URLs or even pages in another embedded document. To keep compatibility, we store the bookmarks twice. If a bookmark points to a page (the most common case) we store it in Apple Preview format and in PSPDFKit's format. If it doesn't point to a page, we only store it in PSPDFKit format, since Preview can't read those.

Opening a PDF file with PSPDFKit bookmarks will now show this XMP data in the "Metadata" dictionary:

```xml
<?xml version="1.0"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="XMP Core 5.5.0">
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
	<rdf:Description xmlns:xmp="http://ns.adobe.com/xap/1.0/"
	                 xmlns:xmpMM="http://ns.adobe.com/xap/1.0/mm/"
	                 xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#"
	                 xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" xmlns:dc="http://purl.org/dc/elements/1.1/"
	                 xmlns:pdf="http://ns.adobe.com/pdf/1.3/"
	                 xmlns:apple-preview="http://ns.apple.com/Preview/1.0/"
	                 xmlns:pspdf="http://pspdfkit.com/pdf/xmp/1.0/"
	                 rdf:about=""
	                 xmp:CreateDate="2016-05-30T12:27:59+02:00" xmp:MetadataDate="2016-06-06T14:35:51+02:00"
	                 xmp:ModifyDate="2016-06-06T14:35:51+02:00"
	                 xmp:CreatorTool="Adobe InDesign CC 2015 (Macintosh)"
	                 xmpMM:InstanceID="uuid:6033b90a-93e7-9343-80bb-11e7cb78273e"
	                 xmpMM:OriginalDocumentID="xmp.did:88dee535-8c8b-4870-a671-e819ab5bebb8"
	                 xmpMM:DocumentID="xmp.id:c46bce4d-d2fd-4ec2-8b7a-c1afd5d631d6"
	                 xmpMM:RenditionClass="proof:pdf"
	                 dc:format="application/pdf"
	                 pdf:Producer="Adobe PDF Library 15.0"
	                 pdf:Trapped="False"
	                 pspdf:Bookmarks="[{&quot;action&quot;: {&quot;actionType&quot;: &quot;Goto&quot;, &quot;pageIndex&quot;: 2}, &quot;name&quot;: &quot;Introduction&quot;, &quot;uuid&quot;: &quot;d6118c78-dae8-4a4f-b8d3-20a4eb44bbb5&quot;}, {&quot;action&quot;: {&quot;actionType&quot;: &quot;Goto&quot;, &quot;pageIndex&quot;: 5}, &quot;uuid&quot;: &quot;a178fba6-7abb-4723-82f8-bb79ceb3065a&quot;}]">

	    <xmpMM:DerivedFrom stRef:instanceID="xmp.iid:6623e54b-07a4-4bf0-a0f3-cd290e9390bc" stRef:documentID="xmp.did:c6f10840-42dc-4f12-ad7e-e50df739ffbe" stRef:originalDocumentID="xmp.did:88dee535-8c8b-4870-a671-e819ab5bebb8" stRef:renditionClass="default"/>
	    <xmpMM:History>
	        <rdf:Seq>
	            <rdf:li stEvt:action="converted" stEvt:parameters="from application/x-indesign to application/pdf" stEvt:softwareAgent="Adobe InDesign CC 2015 (Macintosh)" stEvt:changed="/" stEvt:when="2016-05-30T12:27:59+02:00"/>
	        </rdf:Seq>
	    </xmpMM:History>
	    <apple-preview:Bookmarks>
	        <rdf:Seq>
	            <rdf:li apple-preview:PageIndex="2" apple-preview:UUID="d6118c78-dae8-4a4f-b8d3-20a4eb44bbb5"/>
	            <rdf:li apple-preview:PageIndex="5" apple-preview:UUID="a178fba6-7abb-4723-82f8-bb79ceb3065a"/>
	        </rdf:Seq>
	    </apple-preview:Bookmarks>
	</rdf:Description>
</rdf:RDF>
</x:xmpmeta>
```

Note that the XMP serializer stores our `pspdf:Bookmarks` in a compact form directly in the parent item. We also don't break it up into XML elements, but use a JSON payload. This may look non-ideal, but it allows us to use a common serialization path in C++ for [PSPDFKit for Web](/web) and other platform code. It's also smaller than using XML for this kind of data storage.

Opening this file in Android will show the bookmarks in the bookmark view:

![Bookmarks on Android](/images/blog/2016/just-a-simple-bookmark/android-bookmarks.jpg)

and opening the file in Preview will show the same:

![Bookmarks in Preview](/images/blog/2016/just-a-simple-bookmark/preview-bookmarks.jpg)

Right now, the format should be compatible with [PSPDFKit 2.5 for Android](/blog/2016/pspdfkit-android-2-5/), [PSPDFKit 6 for iOS](/blog/2016/pspdfkit-ios-6-0/), Apple Preview, and [PSPDFKit for Web](/web).

## Conclusion

Implementing bookmarks in a portable manner has proven to be a harder task than expected, mostly due to the fact that PDF format does not lend itself to supporting anything like that. Unfortunately, most PDF readers don't store bookmarks in files at all, which means that there's no way for us to create bookmarks visible in those readers. The only one found until now was Apple Preview and we made sure that the experience for users is as seamless as possible.
