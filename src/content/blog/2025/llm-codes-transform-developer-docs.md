---
title: "llm.codes: Make Apple Docs AI-Readable"
description: "Built this when Claude couldn't read Apple's docs. Now it converts 69+ documentation sites to clean llms.txt. Free, instant, no BS."
pubDatetime: 2025-06-14T13:22:16+00:00
heroImage: /assets/img/2025/llm-codes-transform-developer-docs/hero.png
heroImageAlt: "llm.codes interface showing documentation conversion tool"
tags: ["tools", "ai", "development", "documentation", "llms"]
draft: false
---

**TL;DR**: <a href="https://llm.codes" target="_blank">llm.codes</a> converts JavaScript-heavy Apple docs (and 69+ other sites) into a clean llms.txt that AI agents can actually read.

> **Quick Start**: Try it now with Apple's Foundation Models docs: <a href="https://llm.codes?https://developer.apple.com/documentation/foundationmodels" target="_blank">llm.codes</a>

Even the smartest models can't fetch fresh docs - especially when the docs are hidden behind JavaScript. While working on <a href="https://vibemeter.ai/" target="_blank">Vibe Meter</a>, Claude tried to convince me that [it wasn't possible to make a proper toolbar in SwiftUI](https://x.com/steipete/status/1933819029224931619) and went down to AppKit. Even when I asked it to google for a solution, nothing changed.

## The Real Problem: JavaScript-Heavy Documentation

The core issue? <a href="https://developer.apple.com/documentation/swiftui/" target="_blank">Apple's documentation heavily uses JavaScript</a>, and Claude Code (or most AI agents to date) simply cannot parse that. It will fail and see nothing. So if you're working with a component where documentation only exists on JavaScript-rendered pages, you're completely stuck.

## Enter llm.codes

That's when I built the docs converter. <a href="https://llm.codes" target="_blank">llm.codes</a> allows you to point to documentation and fetch everything as clean Markdown. While it's optimized for Apple documentation, it supports a wide range of developer documentation sites. Here's what you get:

- **Your AI can finally see Apple docs** - No blind spots from JavaScript pages
- **70% smaller files** - More context space for your actual code
- **Works with 69+ sites** - AWS, Tailwind, PyTorch, PostgreSQL, and more

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

Remember my toolbar problem? [Here's what happened](https://x.com/steipete/status/1933819029224931619): I dragged the generated SwiftUI markdown from [my agent-rules repository](https://github.com/steipete/agent-rules/blob/main/docs/swiftui.md) into the terminal, and suddenly Claude wrote exactly the code I wanted.

The key insight: When you work on a component, just ask Claude to read the docs. It will load everything it needs into its context and produce vastly better code.

For people who think [@Context7](https://x.com/Context7AI) is the answer: if you use the context7 mcp for SwiftUI, you get [sample code from 2019](https://context7.com/ivanvorobei/swiftui), which will produce horribly outdated code. You need current documentation, not ancient examples.

## Beyond Just llm.codes

I used this trick before in my post about [migrating 700 tests to Swift Testing](https://steipete.me/posts/2025/migrating-700-tests-to-swift-testing). With llm.codes, you get significantly smaller markdown files, which preserves more token context space for your agent.

I also maintain a [collection of pre-converted Markdown documentation files](https://github.com/steipete/agent-rules/tree/main/docs) in my agent-rules repository, that go beyond just documentation.

The converter itself? Completely vibe-coded with Claude and <a href="https://github.com/amantus-ai/llm-codes" target="_blank">open source</a>. I chose the stack (Next.js, Tailwind, Vercel) but didn't write a single line of TypeScript-and it worked beautifully on the first try.

## Try It Out

<a href="https://llm.codes?https://developer.apple.com/documentation/foundationmodels" target="_blank" style="display: inline-block; padding: 8px 18px; background-color: transparent; color: #374151; text-decoration: none; border: 1px solid #d1d5db; border-radius: 4px; font-weight: 500; font-size: 15px; transition: all 0.15s ease;">Convert a page →</a>

**No sign-up needed**.

AI agents are the future of coding. Until docs catch up, llm.codes is your bridge to that future.