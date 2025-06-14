---
title: "llm.codes - Transform Developer Docs to Clean Markdown"
description: "Introducing llm.codes, a tool that converts Apple developer documentation and other technical docs into clean, LLM-friendly Markdown format for better AI integration."
pubDatetime: 2025-06-14T13:22:16+00:00
heroImage: /assets/img/2025/llm-codes-transform-developer-docs/hero.png
heroImageAlt: "llm.codes interface showing documentation conversion tool"
tags: ["tools", "ai", "development", "documentation"]
draft: false
---

**TL;DR**: <a href="https://llm.codes" target="_blank">llm.codes</a> converts JavaScript-heavy Apple docs (and 69+ other documentation sites) into clean Markdown that AI agents can actually read.

> **Quick Start**: Try it now with Apple's Foundation Models docs: <a href="https://llm.codes?https://developer.apple.com/documentation/foundationmodels" target="_blank">llm.codes</a>

AI agents such as [Claude Code](/posts/2025/claude-code-is-my-computer) are incredibly powerful, but they're limited by their training cutoff dates. And even then, if you work with an API that's not so common, the world knowledge will be limited.

I faced a typical problem with missing documentation. While working on <a href="https://vibemeter.ai/" target="_blank">Vibe Meter</a>, Claude tried to convince me that [it wasn't possible to make a proper toolbar in SwiftUI](https://x.com/steipete/status/1933819029224931619) and went down to AppKit. Even when I asked it to google for a solution, nothing changed.

## The Real Problem: JavaScript-Heavy Documentation

The core issue? <a href="https://developer.apple.com/documentation/swiftui/" target="_blank">Apple's documentation heavily uses JavaScript</a>, and Claude Code (or most AI agents to date) simply cannot parse that. It will fail and see nothing. So if you're working with a component where documentation only exists on JavaScript-rendered pages, you're completely stuck.

## Enter llm.codes

That's when I built the docs converter. <a href="https://llm.codes" target="_blank">llm.codes</a> allows you to point to documentation and fetch everything as clean Markdown. While it's optimized for Apple documentation, it supports a wide range of developer documentation sites. Here's what you get:

- **Your AI can finally see Apple docs** - No more blind spots from JavaScript-rendered pages
- **70% smaller files** - More context space for your actual code instead of wasted tokens
- **Works with 69+ documentation sites** - From AWS to Tailwind, PyTorch to PostgreSQL

<details>
<summary><strong>Supported Documentation Sites</strong></summary>

**Mobile Development**
- Apple Developer Documentation
- Android Developer Documentation
- React Native
- Flutter
- Swift Package Index

**Programming Languages**
- Python, TypeScript, JavaScript (MDN), Rust, Go, Java, Ruby, PHP, Swift, Kotlin

**Web Frameworks**
- React, Vue.js, Angular, Next.js, Nuxt, Svelte, Django, Flask, Express.js, Laravel

**Cloud Platforms**
- AWS, Google Cloud, Azure, DigitalOcean, Heroku, Vercel, Netlify

**Databases**
- PostgreSQL, MongoDB, MySQL, Redis, Elasticsearch, Couchbase, Cassandra

**DevOps & Infrastructure**
- Docker, Kubernetes, Terraform, Ansible, GitHub, GitLab

**AI/ML Libraries**
- PyTorch, TensorFlow, Hugging Face, scikit-learn, LangChain, pandas, NumPy

**CSS Frameworks**
- Tailwind CSS, Bootstrap, Material-UI, Chakra UI, Bulma

**Build Tools & Testing**
- npm, webpack, Vite, pip, Cargo, Maven, Jest, Cypress, Playwright, pytest

**And more**: Any GitHub Pages site (*.github.io)

</details>

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

As AI agents become more prevalent in our development workflows, tools like llm.codes will become essential bridges between existing documentation and AI capabilities. Until documentation providers offer LLM-friendly formats natively, we'll keep building these bridges ourselves.