---
title: "Peekaboo 2.0 – Free the CLI from its MCP shackles"
pubDatetime: 2025-07-03T01:00:00.000+01:00
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

[![Peekaboo 2.0 – Free the CLI from its MCP shackles](/assets/img/2025/peekaboo-2-freeing-the-cli-from-its-mcp-shackles/banner.png)](https://peekaboo.dev/)

A few weeks ago I [built Peekaboo](https://steipete.me/posts/2025/peekaboo-mcp-lightning-fast-macos-screenshots-for-ai-agents), lightning-fast macOS screenshots for AI agents. The twist? Not only is it really fast at screenshots, it can also use a separate agent to answer queries - saving precious context space for your main agent.

Lately there's a mind shift in the community to realize that **most MCPs are actually better if they're just CLIs**. Agents have an easier time calling CLIs, they can be loaded on-demand without cluttering the context, and they are composable. With that, I release Peekaboo 2.0, which has been freed from its MCP shackles and is now also available as CLI. 

## How It Works

The magic behind Peekaboo 2.0 is its clean separation of concerns. From day one, I built it as a Swift CLI with a thin TypeScript wrapper for MCP support. This architecture means the CLI version isn't a port or afterthought – it's the core engine. I simply moved the AI processing features from TypeScript into the Swift CLI, giving you the same powerful functionality without the MCP overhead.

Here's what this means for you: instead of loading 40+ MCP tools into your agent's context (eating up valuable tokens), agents can now discover and use Peekaboo on-demand:

```bash
$ peekaboo --help
Capture screenshots and analyze them with AI

$ peekaboo capture --app "Safari"
✓ Screenshot saved to: ~/Desktop/safari-2025-07-03.png

$ peekaboo analyze "What's on this webpage?" --image ~/Desktop/safari-2025-07-03.png
✓ The webpage shows the Peekaboo documentation with installation instructions...
```

But here's where it gets even better – you can combine capture and analyze in a single command:

```bash
$ peekaboo force --app "Safari" --analyze "Summarize this webpage"
✓ Screenshot captured from Safari
✓ Analysis: The webpage displays a blog post about Peekaboo 2.0, announcing 
  its evolution from an MCP-only tool to a CLI-first architecture. Key points
  include easier agent integration, on-demand loading, and the benefits of 
  CLIs over complex protocols for both humans and AI agents...
```

## Installation Options

Peekaboo 2.0 can be installed via Homebrew:

```bash
brew tap steipete/tap
brew install peekaboo
```

Or you can just download it from [GitHub](https://github.com/steipete/peekaboo). Of course, you can still [use the MCP server](https://github.com/steipete/Peekaboo); nothing changed there.

## Why CLI > MCP

Agents are really, really good at calling CLIs (actually much better than calling MCPs), so you don't have to clutter up your context and you can use all the features that Peekaboo has on demand, no installation required. Just add a note in your project's CLAUDE.md or agent instructions file that "peekaboo is available for screenshots", or simply mention peekaboo whenever your current context requires visual debugging.

As Armin Ronacher perfectly articulates in ["Code Is All You Need"](https://lucumr.pocoo.org/2025/7/3/tools/), CLIs offer composability, reliability, and verifiability that complex tool interfaces can't match. CLIs work for both humans and AI agents – we can run, debug, and understand them. Once a CLI command works, it can be executed hundreds of times without requiring additional inference or context. This mechanical predictability makes CLIs the universal interface that bridges human and AI interaction.

## The Power of Simplicity

This shift in thinking – from complex MCP servers to simple CLIs – represents a broader understanding of how AI agents work best. They excel at understanding command-line interfaces, parsing help text, and constructing appropriate commands. By embracing this natural affinity, we can build tools that are both more powerful and easier to use.

## Get Started Today

Peekaboo 2.0 represents a fundamental shift in how we think about AI tooling. By choosing CLIs over complex protocols, we get tools that are faster, more reliable, and work for everyone – human or AI.

Ready to give your agents eyes? [Get Peekaboo 2.0](https://peekaboo.dev/) and join the CLI revolution. Your agents (and your context window) will thank you.