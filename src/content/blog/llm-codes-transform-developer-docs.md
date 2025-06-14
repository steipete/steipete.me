---
title: "llm.codes - Transform Developer Docs to Clean Markdown"
description: "Introducing llm.codes, a tool that converts Apple developer documentation and other technical docs into clean, LLM-friendly Markdown format for better AI integration."
pubDatetime: 2025-06-14T13:22:16+00:00
heroImage: /assets/img/2025/llm-codes-transform-developer-docs/hero.png
heroImageAlt: "llm.codes interface showing documentation conversion tool"
tags: ["tools", "ai", "development", "documentation"]
draft: false
---

**TL;DR:** [llm.codes](https://llm.codes) converts JavaScript-heavy developer documentation (like Apple's) into clean Markdown files that AI agents can actually read and understand.

Here's a story about why I built it.

I faced a typical problem with missing documentation. [Claude tried to convince me that it wasn't possible to make a proper toolbar in SwiftUI that respects the Icon/Text settings and wanted me to go down to AppKit.](https://x.com/steipete/status/1933819029224931619) Even when I asked it to google for a solution, nothing changed. The AI agent had world knowledge about Swift and SwiftUI, but was really bad at Swift Testing and anything Apple announced at WWDC 2024 - it simply had no clue.

## The Real Problem: JavaScript-Heavy Documentation

The core issue? Apple's documentation heavily uses JavaScript, and Claude Code (or any AI agent) simply cannot parse JavaScript. It will fail and see nothing. So if you're working with a component where documentation only exists on JavaScript-rendered pages, you're completely stuck.

## Enter llm.codes

That's when I built the Apple docs converter. [llm.codes](https://llm.codes) allows you to point to any Apple documentation and fetch everything as clean Markdown. I built it to specifically solve the JavaScript problem - it:

- Extracts all content from JavaScript-heavy pages
- Removes unnecessary URLs, availability annotations, and keywords that just waste tokens
- Produces clean Markdown that AI agents can actually read and understand

The service also supports:
- **swiftpackageindex.com** - Swift Package Index documentation
- **GitHub Pages** - Documentation hosted on GitHub Pages

## How It Works

1. **Enter a URL**: Paste any supported documentation URL
2. **Configure Crawling**: Set your desired crawl depth and URL limits
3. **Get Clean Markdown**: Download the Markdown file and store it in a `docs/` directory in your project

The key insight: When you work on a component, just ask Claude to read the documentation from your local file. It will load everything it needs into its context and produce vastly better code.

## Real-World Example

Remember my toolbar problem? Here's [exactly what happened](https://x.com/steipete/status/1933819029224931619):

The solution was simple: I dragged the scraped SwiftUI markdown from [my agent-rules repository](https://github.com/steipete/agent-rules/blob/main/docs/swiftui.md) into the terminal, and voilà! Suddenly I could convince Claude, and it wrote exactly the code I wanted.

Here's the step-by-step process using llm.codes:

1. Go to [llm.codes](https://llm.codes)
2. Paste the SwiftUI documentation URL
3. Download the clean Markdown
4. Store it in your project (e.g., `docs/swiftui.md`)
5. Reference it when asking Claude: "Using the documentation in `docs/swiftui.md`, show me how to create a toolbar that respects Icon/Text display settings"

For people who think [@Context7AI](https://x.com/Context7AI) is the answer: if you tag context7, you get SwiftUI sample code from 2019, which will produce horribly outdated code. You need current documentation, not ancient examples.

I used this trick before in my post about [migrating 700 tests to Swift Testing](https://steipete.me/posts/2025/migrating-700-tests-to-swift-testing), however the website I used to convert the docs wasn't optimized for Apple's pages. With llm.codes, you get significantly smaller markdown files, which preserves more token context space for your agent.

## Why This Matters

AI agents are incredibly powerful, but they're limited by their training cutoff dates. They don't know about:
- Latest Swift Testing frameworks
- WWDC 2024 announcements
- Recent API changes
- Framework updates

By providing clean, readable documentation directly in your project, you're giving AI agents the context they desperately need to write modern, correct code.

## Technical Details

The service is built to be fast and efficient:
- Configurable crawling parameters to control scope
- Intelligent content extraction that preserves code examples and formatting
- Clean output optimized for token efficiency

llm.codes uses [Firecrawl](https://www.firecrawl.dev/referral?rid=9CG538BE) under the hood, and I pay for the credits to keep this service free for everyone.

## Try It Out

Head over to [llm.codes](https://llm.codes) and transform your first documentation page. It's free to use and doesn't require any sign-up.

Whether you're building iOS apps, working with Swift packages, or just want cleaner documentation for your AI workflows, llm.codes makes it simple to bridge the gap between human-readable docs and AI-consumable content.

---

*Built with ❤️ for developers who love working with AI*