---
title: "Tips for Designing an Android Library"
description: "We take a look at some of the things you should keep in mind when designing an Android library."
preview_image: /images/blog/2018/tips-for-designing-an-android-library/article-header.png
section: blog
author:
  - Ivan Skoric
author_url:
  - https://twitter.com/skoric_
date: 2018-06-18 12:00 UTC
tags: Android, Development, Library, Framework
published: true
---

Creating libraries or frameworks is a process that’s a bit different than your usual app development. At PSPDFKit, we’ve been developing a PDF framework for quite some time now, and this article will briefly touch on some of the more challenging topics we’ve encountered in the hopes that it will help you avoid some of the problems we’ve had. Despite being oriented toward Android and library development, the tips provided here might be useful to any developer on any platform.

When it comes to creating libraries, the first question that always comes to mind is whether or not you really need one. We won’t try to answer that question or deal with technical details on how to create, upload, or publish a library. What we’ll try to do is provide some insight into the things you might not be aware of at first when developing a library, compared to developing a regular app.

So, let’s dive into it.

## Documentation

[Good documentation](/guides/android/current/) is an absolute must when creating a library or any kind of code other people will use. There have been libraries that were smarter and more efficient than some of the “competition,” but they failed to attract users due to their lack of proper documentation. In fact, I still occasionally find some libraries that require me to go through the source code and figure things out on my own. Try to not be like that.

## Specialization

The library should be specialized for performing a certain set of operations. Frameworks, on the other hand, usually cover a wider area. The PSPDFKit framework, for example, enables you to deal with PDFs (browsing, editing annotations, editing the document, exporting files, signing the documents, and much more). It covers a wider spectrum of actions, but it’s still focused on PDF documents.

With libraries, this special focus is even more important. You don’t want to have a library that parses JSON files but that can also be used for dependency injection (I’m exaggerating a bit, but you get the point). Keep your library clean and make a precise statement of what its function is.

On that note, do not conform to all the feature requests your users ask for. Do so if it makes sense and is in line with what your product does, but don’t do it simply for the sake of satisfying a couple of users. If you do, you’ll end up contaminating the source code, and that’s the last thing you want.

## Clear and Concise API

Always try to make your API clear and concise. Of course, this isn’t always easy — one of the most difficult things to do in software development is to properly name methods, classes, etc. What do I mean by clear and concise? Well, first of all, a method should do the one thing it’s designed for — no more, no less. On top of that, the name should describe what it does without any ambiguity. Don’t be afraid to use a longer name if needed, and avoid shortening words (like using `annot` for `annotation`). The clarity of the message is more important than saving a bit of space. I’d rather have method named `ensureInitializedOrThrow()` than something like `checkInit()`.

## Prevent Users from Misusing the API

Your library should provide as much freedom as makes sense. Keep your internal classes, methods, and variables private. Do not expose a method and then add to the documentation: “Do not use this method — it should only be used internally!!” That’s bad design. Classes that shouldn’t be extended should be marked `final`.

You might think: “Why would someone even try to extend this or how can this be misused if I leave it public?” Trust me, people will take your library and abuse it in ways you hadn’t deemed possible. Don’t let them do it.

## Break API When Necessary

Your library’s codebase will probably [evolve over time](/guides/android/current/migration-guides/pspdfkit-4-4-migration-guide/). You might come up with better design ideas or implement something that will require a different design and refactoring. At PSPDFKit, we don’t hesitate to break our APIs, though we try to only do it in major releases. In the end, better code quality outweighs that little bit of hassle customers will go through when updating their codebase.

## Follow the Platform

If you’re developing on a particular platform, it’s always nice to conform to it and try to make your code look like a part of it. On Android, for example, we name our listeners the same as the Android framework does (with a provided context of what the listener is about). So instead of calling something a `DocumentListener`, we’ll name it an `OnDocumentLoadedListener`. Instead of having the `registerOnAnnotationCreatedListener()` method, we’ll name it `addOnAnnotationCreatedListener()`, which follows Android’s `add/remove` naming convention for registering multiple listeners. In short, use the language your users are familiar with.

## Be Careful and Thorough When Creating Custom Views

Custom views are one of the areas in Android development where you can find all kinds of ugly practices, hacks, broken stuff, etc. People will usually make custom views for their own purposes and then just decide to wrap them in a library and publish. The biggest issue with custom views is that they usually need to be flexible and customizable. This means properly implementing measuring and positioning logic of the views. To do so, the developer needs to have a good understanding of how Android measures and lays out the views.

You might make a video view that you always display in full screen in landscape in your app. And it might all look great, but someone else will put it in a 400x250&nbsp;px box somewhere in their activity, and all of a sudden, the video controls UI is completely broken since you assumed there would always be enough space for all of the icons.

Furthermore, I’ve seen custom views where some properties can only be set through XML, and others only programmatically, but in reality, you should always provide both. XML should just be a way to preconfigure view properties through mechanisms already provided by the API.

Also, don’t animate view property changes when the setter is invoked. There are various animators for that. Calling `chart.setLineThickness()`, for example, should just change line thickness and invalidate the view in a single frame without any transitions.

## Check for Illegal Arguments

Use `@NonNull` and `@Nullable` annotations on method parameters and return values wherever you can, which is always. It will improve your code stability, but it will also let users know which values are expected to be passed as arguments and which values they will get back from the method. Furthermore, you should explicitly check that the provided argument is `non-null` (if it has to be), and throw `NullPointerException`. Some libraries throw `IllegalArgumentException`, but the `NullPointerException` is more precise in this case and will convey a clearer message for the users.

From _Effective Java_, a book by Joshua Bloch (Second Edition, Item 60):

> Arguably, all erroneous method invocations boil down to an illegal argument or illegal state, but other exceptions are standardly used for certain kinds of illegal arguments and states. If a caller passes null in some parameter for which null values are prohibited, convention dictates that `NullPointerException` be thrown rather than `IllegalArgumentException`. Similarly, if a caller passes an out-of-range value in a parameter representing an index into a sequence, `IndexOutOfBoundsException` should be thrown rather than `IllegalArgumentException`.

## Conclusion

Writing libraries and frameworks is sometimes a bit harder than regular application development is, but doing so teaches many good practices and will help improve your skills in general. The more you work on it, the better you get, which leads to seeing patterns and things that can be improved.

The best advice is to try not to overthink it. Start with a simple API, iterate often, and make sure you fix bugs quickly. And keep in mind that libraries that are rarely updated are not that appealing to developers.

You can make an internal library for your project. Isolate parts that make sense to be coupled together. After that, try adapting them to be independent of your project and specific tasks you use them for. Even if it turns out bad, it’s a great learning experience and definitely a step toward becoming a better developer.

Once you write a library, I’m pretty sure you’ll see all the things in your app that can be improved as well, so in the end, it’s a win-win.

Happy coding!
