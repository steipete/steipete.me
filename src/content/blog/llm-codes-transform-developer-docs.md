---
title: "llm.codes - Transform Developer Docs to Clean Markdown"
description: "Introducing llm.codes, a tool that converts Apple developer documentation and other technical docs into clean, LLM-friendly Markdown format for better AI integration."
pubDatetime: 2025-06-14T13:22:16+00:00
heroImage: /assets/img/2025/llm-codes-transform-developer-docs/hero.png
heroImageAlt: "llm.codes interface showing documentation conversion tool"
tags: ["tools", "ai", "development", "documentation"]
draft: false
---

**TL;DR:** I built a tool that converts JavaScript-heavy developer docs into clean Markdown so AI agents can actually read them.

<a href="https://llm.codes" target="_blank">llm.codes</a>

> **Quick Start**: Try it now with Apple's Foundation Models docs: <a href="https://llm.codes?https://developer.apple.com/documentation/foundationmodels" target="_blank">llm.codes</a>

AI agents like [Claude Code](/posts/2025/claude-code-is-my-computer) are powerful but limited by their training dates. Less common APIs? They know even less.

While building <a href="https://vibemeter.ai/" target="_blank">Vibe Meter</a>, Claude told me [I couldn't make a proper toolbar in SwiftUI](https://x.com/steipete/status/1933819029224931619). It pushed AppKit instead. Googling didn't help.

## The Real Problem: JavaScript-Heavy Documentation

The core issue? <a href="https://developer.apple.com/documentation/swiftui/" target="_blank">Apple's docs use JavaScript</a>. AI agents can't parse that. They see nothing.

If your docs only exist on JavaScript pages, you're stuck.

## Enter llm.codes

So I built <a href="https://llm.codes" target="_blank">llm.codes</a>. Point it at any docs page. Get clean Markdown back.

It's optimized for Apple docs but supports many sites. Here's what it does:

- Extracts content from JavaScript pages
- Removes URLs, availability notes, and filler words
- Creates clean Markdown AI agents can read

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

Remember my toolbar problem? [Here's the tweet](https://x.com/steipete/status/1933819029224931619).

The fix: I dragged SwiftUI markdown from [my agent-rules repo](https://github.com/steipete/agent-rules/blob/main/docs/swiftui.md) into the terminal. Claude read it. Wrote perfect code.

**Key insight**: Ask Claude to read local docs. It loads what it needs and writes better code.

About [@Context7](https://x.com/Context7AI): Their SwiftUI MCP gives you 2019 code. Old and broken. You need current docs.

I tried this before in my [Swift Testing migration post](https://steipete.me/posts/2025/migrating-700-tests-to-swift-testing). The old converter wasn't optimized for Apple docs. llm.codes creates smaller files, saving tokens.

I also keep [pre-converted docs](https://github.com/steipete/agent-rules/tree/main/docs) in my agent-rules repo. Some Apple docs can't be scraped. Use these instead.

## The Meta Story: Vibe-Coded with Claude

The converter is vibe-coded and <a href="https://github.com/amantus-ai/llm-codes" target="_blank">open source</a>. I used Claude Code for everything. Zero TypeScript written by hand.

Still made key choices:
- Vercel hosting
- Next.js and Tailwind
- Python prototype to test Firecrawl first

The result? It works great. TypeScript + AI agents = magic. First prompt, working code.

## Try It Out

Try <a href="https://llm.codes?https://developer.apple.com/documentation/foundationmodels" target="_blank">llm.codes</a> now. Free. No sign-up.

Works for iOS apps, Swift packages, or any docs you need AI to understand.

## The Future

AI agents are taking over development. Tools like llm.codes bridge old docs to new AI.

Until doc sites offer LLM formats, we build our own bridges.