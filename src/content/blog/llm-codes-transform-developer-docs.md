---
title: "llm.codes - Transform Developer Docs to Clean Markdown"
description: "Introducing llm.codes, a tool that converts Apple developer documentation and other technical docs into clean, LLM-friendly Markdown format for better AI integration."
pubDatetime: 2025-06-14T13:22:16+00:00
heroImage: /assets/img/2025/llm-codes-transform-developer-docs/hero.png
heroImageAlt: "llm.codes interface showing documentation conversion tool"
tags: ["tools", "ai", "development", "documentation"]
draft: false
---

**TL;DR:** <a href="https://llm.codes" target="_blank">llm.codes</a> converts JavaScript-heavy developer documentation (like Apple's) into clean Markdown files that AI agents can actually read and understand.

AI agents such as [Claude Code](/posts/2025/claude-code-is-my-computer) are incredibly powerful, but they're limited by their training cutoff dates. And even then, if you work with an API that's not so common, the world knowledge will be limited.

I faced a typical problem with missing documentation. While working on <a href="https://vibemeter.ai/" target="_blank">Vibe Meter</a>, [Claude tried to convince me that it wasn't possible to make a proper toolbar in SwiftUI and went down to AppKit.](https://x.com/steipete/status/1933819029224931619) Even when I asked it to google for a solution, nothing changed.

## The Real Problem: JavaScript-Heavy Documentation

The core issue? Apple's documentation heavily uses JavaScript, and Claude Code (or most AI agents to date) simply cannot parse that. It will fail and see nothing. So if you're working with a component where documentation only exists on JavaScript-rendered pages, you're completely stuck.

## Enter llm.codes

That's when I built the Apple docs converter. <a href="https://llm.codes" target="_blank">llm.codes</a> allows you to point to any Apple documentation and fetch everything as clean Markdown. I built it to specifically solve the JavaScript problem - it:

- Extracts all content from JavaScript-heavy pages
- Removes unnecessary URLs, availability annotations, and keywords that just waste tokens
- Produces clean Markdown that AI agents can actually read and understand

The service also supports:
- **swiftpackageindex.com** - Swift Package Index documentation
- **GitHub Pages** - Documentation hosted on GitHub Pages

llm.codes uses <a href="https://www.firecrawl.dev/referral?rid=9CG538BE" target="_blank">Firecrawl</a> under the hood, and I pay for the credits to keep this service free for everyone.

## Real-World Example

Remember my toolbar problem? Here's [exactly what happened](https://x.com/steipete/status/1933819029224931619):

The solution was simple: I dragged the generated SwiftUI markdown from [my agent-rules repository](https://github.com/steipete/agent-rules/blob/main/docs/swiftui.md) into the terminal, and voilà! Suddenly I could convince Claude, and it wrote exactly the code I wanted.

The key insight: When you work on a component, just ask Claude to read the docs <file name>. It will load everything it needs into its context and produce vastly better code.

For people who think [@Context7](https://x.com/Context7AI) is the answer: if you use the context7 mcp for SwiftUI, you get sample code from 2019, which will produce horribly outdated code. You need current documentation, not ancient examples.

I used this trick before in my post about [migrating 700 tests to Swift Testing](https://steipete.me/posts/2025/migrating-700-tests-to-swift-testing), however the website I used to convert the docs wasn't optimized for Apple's pages. With llm.codes, you get significantly smaller markdown files, which preserves more token context space for your agent.

I also maintain a [collection of pre-converted Markdown documentation files](https://github.com/steipete/agent-rules/tree/main/docs) in my agent-rules repository. Not everything can be fetched from Apple's docs, so feel free to use these files as well - they're ready to drop into your projects.

## The Meta Story: Vibe-Coded with Claude

In good tradition, the converter is completely vibe-coded and <a href="https://github.com/amantus-ai/llm-codes" target="_blank">open source</a>. I used Claude Code for everything and didn't write a single line of TypeScript myself. This doesn't mean you don't have to know the tools you work with - I made the decision to host it on Vercel, to use Next.js and Tailwind, and before building this I had a Python script to test if this was a valid approach with Firecrawl.

But in general, I was surprised how well it works. You really feel the difference: while Swift works well, using agents for TypeScript is just wonderful and usually works on the first try, on the first prompt.

## Try It Out

Head over to <a href="https://llm.codes?https://developer.apple.com/documentation/foundationmodels" target="_blank">llm.codes</a> and transform your first documentation page. It's free to use and doesn't require any sign-up.

Whether you're building iOS apps, working with Swift packages, or just want cleaner documentation for your AI workflows, llm.codes makes it simple to bridge the gap between human-readable docs and AI-consumable content.