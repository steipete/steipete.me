---
title: "llm.codes - Transform Developer Docs to Clean Markdown"
description: "Introducing llm.codes, a tool that converts Apple developer documentation and other technical docs into clean, LLM-friendly Markdown format for better AI integration."
pubDatetime: 2025-06-14T13:22:16+00:00
tags: ["tools", "ai", "development", "documentation"]
draft: false
---

Here's a story about why I built [llm.codes](https://llm.codes).

I was stuck on a problem where Claude told me there was no way to build a proper toolbar in AppKit that behaves as the system wants - where users can filter between icon or text display. Even after I asked it to google for solutions, it couldn't find the answer. The AI agent had world knowledge about Swift and SwiftUI, but was really bad at Swift Testing and anything Apple announced at WWDC 2024 - it simply had no clue.

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

Remember my AppKit toolbar problem? Here's how llm.codes solved it:

1. I went to [llm.codes](https://llm.codes)
2. Pasted the NSToolbar documentation URL
3. Downloaded the clean Markdown
4. Stored it in `docs/nstoolbar.md`
5. Asked Claude: "Using the documentation in `docs/nstoolbar.md`, show me how to create a toolbar with icon/text display options"

Suddenly, Claude had access to all the modern NSToolbar APIs, including the display mode configurations that weren't in its training data. Problem solved.

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

## Try It Out

Head over to [llm.codes](https://llm.codes) and transform your first documentation page. It's free to use and doesn't require any sign-up.

Whether you're building iOS apps, working with Swift packages, or just want cleaner documentation for your AI workflows, llm.codes makes it simple to bridge the gap between human-readable docs and AI-consumable content.

---

*Built with ❤️ for developers who love working with AI*