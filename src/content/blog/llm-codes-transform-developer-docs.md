---
title: "llm.codes - Transform Developer Docs to Clean Markdown"
description: "Introducing llm.codes, a tool that converts Apple developer documentation and other technical docs into clean, LLM-friendly Markdown format for better AI integration."
pubDatetime: 2025-06-14T13:22:16+00:00
heroImage: /assets/img/2025/llm-codes-transform-developer-docs/hero.png
heroImageAlt: "llm.codes interface showing documentation conversion tool"
tags: ["tools", "ai", "development", "documentation"]
draft: false
---

Apple docs are invisible to LLMs.

**The fix:** Paste URL → Get Markdown → Feed to AI.

<a href="https://llm.codes" target="_blank">llm.codes</a>

> **Quick Start**: Try it now with Apple's Foundation Models docs: <a href="https://llm.codes?https://developer.apple.com/documentation/foundationmodels" target="_blank">llm.codes</a>

AI agents like [Claude Code](/posts/2025/claude-code-is-my-computer) are powerful but limited by their training dates. Less common APIs? They know even less. While building <a href="https://vibemeter.ai/" target="_blank">Vibe Meter</a>, Claude told me [I couldn't make a proper SwiftUI toolbar](https://x.com/steipete/status/1933819029224931619).

## The Real Problem

The core issue? <a href="https://developer.apple.com/documentation/swiftui/" target="_blank">Apple's docs use JavaScript</a>. AI agents can't parse that. They see nothing.

If your docs only exist on JavaScript pages, you're stuck.

## Enter llm.codes

So I built <a href="https://llm.codes" target="_blank">llm.codes</a>. Point it at any docs page. Get clean Markdown back.

It's optimized for Apple docs but supports many sites. Here's what it does:

- **Save 30% tokens** per API call  
- **Get current APIs**, not 2019 examples
- **Works offline** - store docs in your project

<details>
<summary><strong>Supported Documentation Sites</strong></summary>

**AI/ML**: Hugging Face • LangChain • NumPy • pandas • PyTorch • scikit-learn • TensorFlow

**Build Tools**: Cargo • Maven • npm • pip • Vite • webpack

**Cloud**: AWS • Azure • DigitalOcean • Google Cloud • Heroku • Netlify • Vercel

**CSS**: Bootstrap • Bulma • Chakra UI • Material-UI • Tailwind CSS

**Databases**: Cassandra • Couchbase • Elasticsearch • MongoDB • MySQL • PostgreSQL • Redis

**DevOps**: Ansible • Docker • GitHub • GitLab • Kubernetes • Terraform

**Mobile**: Android • Apple Developer • Flutter • React Native • Swift Package Index

**Languages**: Go • Java • JavaScript (MDN) • Kotlin • PHP • Python • Ruby • Rust • Swift • TypeScript

**Testing**: Cypress • Jest • Mocha • Playwright • pytest

**Web**: Angular • Django • Express.js • Flask • Laravel • Next.js • Nuxt • React • Svelte • Vue.js

**Plus**: Any GitHub Pages site (*.github.io)

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

As AI agents become more prevalent in our development workflows, tools like llm.codes will become essential bridges between existing documentation and AI capabilities. Until documentation providers offer LLM-friendly formats natively, we'll keep building these bridges ourselves.