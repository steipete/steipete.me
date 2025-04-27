---
title: "How to Merge Two or More PDFs in Java (or Kotlin)"
description: "Learn how to merge PDFs in Java (or Kotlin) the simple way — with code examples, explanations, and extra features."
preview_image: /images/blog/2020/merge-two-pdfs-java/article-header.png
section: blog
author:
  - Nick Winder
author_url:
  - http://www.nickwinder.com
date: 2020-01-19 8:00 UTC
tags: PDF, Development, How-To, Java
cta: libraries
published: true
secret: true
---

Many companies hold reams of documents about customers, employees, inventory, etc. And in some cases, it can be useful to collate these documents together in order to redistribute them. But how do you do that? In today’s post, I’m going to show you how you can merge multiple documents into one using Java and Kotlin, thereby solving the redistribution problem!

## Java

[Java][what-is-java] has a long history and is used in many different environments. Today, it’s most likely known for being used with Android or on backend server work. Because it’s been around for such a long time and is still popular, we can be sure it won’t go away anytime soon.

## Kotlin

Compared to Java, [Kotlin][what-is-kotlin] is the new kid on the block. The great thing is that it works in most places Java does, so if you want the benefits of a new and interesting language but with the environment of Java, Kotlin is the way to go. If you’re looking for an expressive language with the possibility of native JavaScript and Java interoperability, it could be worth checking out the [Kotlin guides][kotlin-guides].

## Merging Example

In our hypothetical situation, we’re going to have two documents, each consisting of one page. We’re going to merge these two pages together to create a document with one page.

![Image showing two individual pages merged into one document](/images/blog/2019/merge-two-pdfs-dotnet/two-pdfs-merging.png)

[==

```java
// Get two documents and merge them together. 0 denotes the page index of where to insert the document.
DocumentEditor documentEditor = new DocumentEditor();

// Import the two documents.
File dogDocument = new File("Assets/dog.pdf");
documentEditor.importDocument(0, DocumentEditor.IndexPosition.BeforeIndex, new FileDataProvider(dogDocument));
File catDocument = new File("Assets/cat.pdf");
documentEditor.importDocument(0, DocumentEditor.IndexPosition.BeforeIndex, new FileDataProvider(catDocument));

// Write out to a new file.
File outputFile = File.createTempFile("dogCatPair", ".pdf");
documentEditor.saveDocument(new FileDataProvider(outputFile));
```

```kotlin
// Get two documents and merge them together. 0 denotes the page index of where to insert the document.
val documentEditor = DocumentEditor()

// Import the two documents.
val dogDocument = File("Assets/dog.pdf")
documentEditor.importDocument(0, DocumentEditor.IndexPosition.BeforeIndex, FileDataProvider(dogDocument))
val catDocument = File("Assets/cat.pdf")
documentEditor.importDocument(0, DocumentEditor.IndexPosition.BeforeIndex, FileDataProvider(catDocument))

// Write out to a new file.
val outputFile = File.createTempFile("dogCatPair", ".pdf")
documentEditor.saveDocument(FileDataProvider(outputFile))
```

==]

With just a few lines of code and the PSPDFKit [Document Editor][document-editor], we’ve managed to merge our documents into one.

Each document is added by calling the [`importDocument`][] method, with `0` denoting index 0 and `DocumentEditor.IndexPosition.BeforeIndex` instructing the editor to place the pages before the given index (this is necessary for the first document, as there are no other indices to reference yet). Then we instruct the Document Editor where to find the document to import. In the code example above, we take a simple file path, but it’s also possible to pass a custom data provider that extends [`DataProvider`][] to provide data from any source required, such as memory, network data, or even a cryptographic solution.

We can keep repeating these steps to merge as many documents as we desire. One factor to be aware of is the size of the PDFs in memory. Opening and appending PDFs can be a memory-intensive process, so if you are importing large documents, keep this in mind.

## Extra Operations

We’ve completed our task and merged two documents together. So now let’s look into the many features of the [Document Editor][document-editor].

With the two documents combined into one, we now have a front page that does not reflect the data it holds.

So, how about we remove that page?

[==

```java
...
File projectDocument = new File("Assets/projectPlan.pdf");
documentEditor.importDocument(0, DocumentEditor.IndexPosition.BeforeIndex, new FileDataProvider(projectDocument));
File tpsDocument = new File("Assets/tpsReport.pdf");
documentEditor.importDocument(0, DocumentEditor.IndexPosition.BeforeIndex, new FileDataProvider(tpsDocument));

// Now remove the first page.
Set<Integer> pages = new HashSet<>();
pages.add(0);
documentEditor.removePages(pages);
...
```

```kotlin
...
val projectDocument = File("Assets/projectPlan.pdf")
documentEditor.importDocument(0, DocumentEditor.IndexPosition.BeforeIndex, FileDataProvider(projectDocument))
val tpsDocument = File("Assets/tpsReport.pdf")
documentEditor.importDocument(0, DocumentEditor.IndexPosition.BeforeIndex, FileDataProvider(tpsDocument))

// Now remove the first page.
documentEditor.removePages(setOf(0))
...
```

==]

Again we’ve added the two documents, and for the final operation, we’ve instructed the [Document Editor][document-editor] to remove the first page. We can continue to stage instructions like this to our heart’s desire — including but not limited to [`addPage`][], [`removePages`][], [`rotatepages`][], and [`setPageLabel`][] — in order to create the final PDF needed.

## Conclusion

This blog post has given a quick overview of the document editing possibilities of the [PSPDFKit Java Library][pspdfkit-java-library], and there is much more to explore. Feel free to jump into the [guides][] and [API documentation][] for more examples and other important features of the SDK.

[document-editor]: /guides/java/current/features/document-editor/
[`importdocument`]: /api/java/reference/com/pspdfkit/api/DocumentEditor.html#importDocument(int,%20com.pspdfkit.api.DocumentEditor.IndexPosition,%20com.pspdfkit.api.providers.DataProvider)
[`dataprovider`]: /api/java/reference/com/pspdfkit/api/providers/DataProvider.html
[`rotatepages`]: /api/java/reference/com/pspdfkit/api/DocumentEditor.html#rotatePages(java.util.Set%3Cjava.lang.Integer%3E,%20com.pspdfkit.api.basic.Rotation)
[`rotation`]: /api/java/reference/com/pspdfkit/api/basic/Rotation.html
[`addpage`]: /api/java/reference/com/pspdfkit/api/DocumentEditor.html#addPage(int,%20com.pspdfkit.api.DocumentEditor.IndexPosition,%20int,%20int,%20com.pspdfkit.api.basic.Rotation,%20java.awt.Color,%20java.awt.Insets)
[`removepages`]: /api/java/reference/com/pspdfkit/api/DocumentEditor.html#removePages(java.util.Set%3Cjava.lang.Integer%3E)
[`setpagelabel`]: /api/java/reference/com/pspdfkit/api/DocumentEditor.html#setPageLabel(java.util.Set<java.lang.Integer>,%20java.lang.String)
[pspdfkit-java-library]: https://pspdfkit.com/pdf-library/java/
[what-is-java]: https://www.java.com/en/
[what-is-kotlin]: https://kotlinlang.org/
[api documentation]: /api/java/
[guides]: /guides/java/current/
[kotlin-guides]: https://kotlinlang.org/docs/reference/
