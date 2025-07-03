---
title: "Peekaboo 2.0 – Freeing the CLI from its MCP shackles"
pubDatetime: 2025-07-02T12:00:00.000+01:00
description: "Peekaboo 2.0 ditches the MCP-only approach for a CLI-first architecture, because CLIs are the universal interface that both humans and AI agents can actually use effectively"
tags:
  - MCP
  - CLI
  - Swift
  - macOS
  - Screenshots
  - Developer Tools
  - AI Agents
---

[![Peekaboo 2.0 – Freeing the CLI from its MCP shackles](/assets/img/2025/peekaboo-2-freeing-the-cli-from-its-mcp-shackles/banner.png)](https://peekaboo.dev/)

**TL;DR**: I realized most MCPs are better as CLIs because agents understand command-line interfaces better than complex tool protocols. Peekaboo 2.0 is now available as a standalone CLI that both humans and AI can use – just run `peekaboo` and it works.

A few weeks ago I [built Peekaboo](https://steipete.me/posts/2025/peekaboo-mcp-lightning-fast-macos-screenshots-for-ai-agents), lightning-fast macOS screenshots for AI agents. As you do, I built an MCP server that makes it easy for agents to not only request screenshots of the screen or individual apps but also ask questions about those screenshots, saving on context and only getting information they actually need. The actual processing would be done by a different model that is configurable.

In the last few weeks, I had a bit of a mind shift change and I realized that **most MCPs are actually better if they're just CLIs**. With that, I release Peekaboo 2.0 which has been freed from its MCP shackles and is now also available as CLI. 

## The Architecture Advantage

Luckily, when I built Peekaboo, I already foresaw that this could be an option, so the architecture already was a thin layer of TypeScript that does all the MCP wrapping that ultimately called into a modern Swift CLI that already had almost all functionality. When I built it, the part that was AI processing was done in TypeScript, so I had to move a few features into the CLI, and there you go!

## Installation Options

Peekaboo 2.0 can be installed via Homebrew:

```bash
brew install steipete/peekaboo/peekaboo
```

Or you can just download it from [GitHub](https://github.com/steipete/peekaboo). Of course, you can still use the MCP server; nothing changed there.

## Why CLI > MCP

I recommend using the CLI, and you don't even need any configuration. The agent can simply call `peekaboo`, get the help output, load it into the context once as it's needed, and then it will know how to call peekaboo. 

Agents are really, really good at calling CLIs (actually much better than calling MCPs), so you don't have to clutter up your context and you can use all the features that Peekaboo has on demand, no installation required.

As Armin Ronacher perfectly articulates in ["Code Is All You Need"](https://lucumr.pocoo.org/2025/7/3/tools/), CLIs offer composability, reliability, and verifiability that complex tool interfaces can't match. CLIs work for both humans and AI agents – we can run, debug, and understand them. Once a CLI command works, it can be executed hundreds of times without requiring additional inference or context. This mechanical predictability makes CLIs the universal interface that bridges human and AI interaction.

## The Power of Simplicity

This shift in thinking – from complex MCP servers to simple CLIs – represents a broader understanding of how AI agents work best. They excel at understanding command-line interfaces, parsing help text, and constructing appropriate commands. By embracing this natural affinity, we can build tools that are both more powerful and easier to use.

Check out [Peekaboo 2.0](https://peekaboo.dev/) and experience the freedom of CLI-first AI tooling.