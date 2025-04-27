---
title: "Kotlin-Ready Online Guides"
description: Our Guides received a large update – now with Kotlin usage examples.
preview_image: /images/blog/2016/kotlin-ready-guides.png
section: blog

author: David Schreiber-Ranner
author_url: https://twitter.com/Flashmasterdash
date: 2016-04-15 12:00 UTC
tags: Android, Development, Documentation
published: true
---

Our Android guides for PSPDFKit received a large update – now with Kotlin usage examples.READMORE [Kotlin](https://kotlinlang.org/) is a statically-typed programming language, and is currently booming for Android development.

Our [guides](https://pspdfkit.com/guides/android/current/) now sport articles about all relevant parts of PSPDFKit, both for iOS and Android – giving [detailed code examples in the selected language.](/guides/android/current/features/text-search/)

![Java & Kotlin code switching](/images/blog/2016/kotlin-code-switcher.gif)

Syntax highlighting is done via [Rouge](https://github.com/jneen/rouge), a ruby based syntax highlighter which we were already using for highlighting all of our Java, Objective-C, and Swift code examples. Since the Kotlin lexer is still a work-in-progress (it's an [open PR at the Rouge repo](https://github.com/jneen/rouge/pull/354)) we went ahead and forked Rouge to our [PSPDFKit-Labs](https://github.com/PSPDFKit-labs) GitHub organization and added some tweaks _(Update: [the changes from our fork were merged](https://github.com/jneen/rouge/pull/476))_. Special thanks to Matt Ellis for creating the original pull request.

If you're an Android developer using Kotlin and PSPDFKit, please let us know – we would be happy if you would [send us your feedback and further ideas](/support/request).
