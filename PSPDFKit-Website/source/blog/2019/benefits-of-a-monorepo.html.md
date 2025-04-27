---
title: "The Many Benefits of Using a Monorepo"
description: "A monorepo? Isn't that just a weird Facebook and Google thing? Why is PSPDFKit using a monorepo?"
preview_image: /images/blog/2019/benefits-of-a-monorepo/article-header.png
section: blog
author:
  - Peter Steinberger
author_url:
  - https://twitter.com/steipete
date: 2019-05-01 8:00 UTC
tags: iOS, Development
published: true
secret: false
---

Just like [Facebook][facebook monorepo] and [Google][google monorepo], we use [a single repository][] for almost all our products. These include our SDKs for iOS, Android, Windows, and macOS; PDF Viewer for iOS; and some internal tools, such as our PSPDFInspector that’s used to easily explore what’s in a PDF. In fact, with the exception of PSPDFKit for Web and PDF Viewer for Android, all our products live in the monorepo.

This wasn’t always the case. But over time, we came to the conclusion that monorepos have many benefits, and in spite of existing drawbacks, overall, they are absolutely worth it.

## Humble Beginnings

Between 2011 and 2013, PSPDFKit was only available for iOS. Eventually, we could no longer ignore Android, and we started working on PSPDFKit for Android in a separate repository. Android required not only a completely new UI, but also Core libraries for parsing and rendering PDF documents. On iOS, we were using Apple’s Core Graphics PDF rendering engine and a lot of custom code that dealt with parsing and writing annotations back into the PDF. This code was all Objective-C and not portable to Android, so it made sense to start fresh with two new repositories: `PSPDFKit-Android` and `Core`.

As we developed both components side by side, many changes to Core required changes to Android’s JNI wrapper, so it wasn’t unusual to open two pull requests for a feature, with the requirement that both should be merged at the same time. Of course, you could choose to only merge the Core PR and leave Android’s PR open, but our goal was that master/master would always be compatible, which led to the additional benefit of reducing potential conflicts that come with having too many branches. It didn’t take long for us to realize that merging the `Core` repository into `PSPDFKit-Android` would be highly beneficial for our workflow. In doing so, we knew we could still separate them later if we ended up using `Core` for other platforms.

## Android Shipped, Core Grew Up

After Android shipped, we quickly saw the benefits of controlling the entire stack. Apple’s CGPDF is a solid PDF renderer, but our customers always managed to find PDFs that would render incorrectly, be extremely slow, or even worse, crash somewhere deep in Apple code. And while we were able to quickly fix these problems on Android, the only action possible on iOS was writing a radar (something at which we have become quite the experts).

<div class="alert alert-warning">
	
Learn more: [Writing Good Bug Reports][]

</div>

## iOS Got a New Engine

In 2014, we started a huge project: using Core for iOS. We had three choices:

1. Include `PSPDFKit-Android` as a submodule on iOS and reuse `Core` there.
2. Extract `Core` out of `PSPDFKit-Android` and again deal with fragmented pull requests.
3. Merge iOS and Android (!) into a new master repository.

This was something we discussed a lot, but in the end, the majority of us decided it’d be easier if we simply moved to one big repository. We set out on a quest to (quite literally) rewrite history and merged `PSPDFKit-Android` into `PSPDFKit-iOS`, using separate subfolders for platforms. As a result, the new repository had the following four folders:

- iOS
- android
- core
- documentation

## PDF Viewer for iOS and Android

When we started PDF Viewer for iOS and Android, we didn’t think they fit into the monorepo. After all, they simply consume the (usually stable) version of our SDKs, so there’s no need for PRs that span multiple repositories. Or so we thought... Over the years, we’ve used our apps more and more as test vessels for new features and enhancements before we introduce new behavior and APIs to our business partners. Dogfooding our own APIs also helped us make better interfaces — with the downside that suddenly PDF Viewer was using work-in-progress APIs, and updating master regularly broke it.

More and more people on our team began using PDF Viewer as their main app to build and improve the PSPDFKit SDK, and integrating it via source code was just so much easier than building binaries. We again ended up with lots of combined pull requests and submodule bumping, until we decided to finally migrate PDF Viewer for iOS to the monorepo.

This process was quite complex, since we care a lot about the history, but we also wanted to migrate some larger binary artefacts to Git LFS (Large File Storage) to avoid making the already quite large monorepo even larger. Writing an automatic migration script took about two weeks, and we finally pulled the trigger and also migrated all GitHub Issues over.

We’re planning the same for PDF Viewer for Android this month, with the added benefit that this will greatly simplify our Gradle build scripts.

## Web and Server: A Special Case

PSPDFKit for Web (`PSPDFKit-Web`) started in 2016 as a pure JavaScript library. It renders documents via PSPDFKit Server, which is an Elixir application interacting with a Unix daemon that wraps Core APIs. We added the `cli` project to the monorepo, but at the time, we didn’t see a reason to add web or server to the monorepo. After all, they are very separate entities.

A year later, we began exploring WebAssembly, and PSPDFKit for Web Standalone emerged out of that. It compiles Core directly to WebAssembly and calls it as a JavaScript module. As a result of this change, suddenly there was a much closer relationship between Core and Web, and sometimes Core updates even broke Web features. We’re already feeling the pain of dealing with separate repositories, and as we’re using Core more and more in PSPDFKit for Web, we’re at a point where migrating Web (and eventually, Server) into the monorepo will simplify our work.

## Downsides

All that said, there are some downsides to monorepos. Doing a pull will basically always result in changes, so recompiles are more common. Tooling like hooks, which would push progress into Slack, are basically unusable, as there’s not yet an effective way to separate traffic to platforms and different channels. (There is, however, [a rather active issue for GitHub’s Slack integration][github’s slack integration] where people ask for exactly that.)

The repository also grew to many gigabytes over the years, and while we now use Git’s LFS system to mitigate the growth, rewriting old history doesn’t seem worth it. This makes CI test runs slightly longer, as they first need to do a fresh checkout. (Yes, this can be cached, but the process is still not as fast as it would be in a small repository.)

However, not having to deal with `git submodules` is a blessing, and nobody on our team wants to go back to how things were before the Grand Merge (TM).

Finally, because each pull request now triggers all the supported platforms, we’ve suddenly greatly increased load times on our CI servers. We were able to fix this by writing custom Jenkins scripts that look at the changed files and then intelligently trigger only the platforms affected by such a change.

<div class="alert alert-warning">

Learn more: [Selective Pull Request Testing with Jenkins][]

</div>

## Conclusion

Overall, we’re extremely happy with our monorepo and plan to move even more projects to it. Along with simplifying the workflows, it brings our various platform teams closer together and encourages them to “dig deeper” and fix issues across all platforms instead of delegating things to other teams.

[facebook monorepo]: https://medium.com/@maoberlehner/monorepos-in-the-wild-33c6eb246cb9
[google monorepo]: https://cacm.acm.org/magazines/2016/7/204032-why-google-stores-billions-of-lines-of-code-in-a-single-repository/fulltext
[a single repository]: https://medium.com/@Jakeherringbone/you-too-can-love-the-monorepo-d95d1d6fcebe
[writing good bug reports]: /blog/2016/writing-good-bug-reports/
[github’s slack integration]: https://github.com/integrations/slack/issues/384
[selective pull request testing with jenkins]: /blog/2016/selective-pull-request-testing/
