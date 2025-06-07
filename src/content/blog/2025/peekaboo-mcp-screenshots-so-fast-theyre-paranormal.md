---
title: "Peekaboo MCP: Screenshots so fast they're paranormal"
pubDatetime: 2025-06-07T12:00:00.000+01:00
description: "Introducing Peekaboo MCP - the fastest way to take screenshots with Claude. Built with Swift and love for developer productivity."
tags:
  - MCP
  - Claude
  - Swift
  - macOS
  - Screenshots
  - Developer Tools
---

![Peekaboo MCP: Screenshots so fast they're paranormal](/assets/img/2025/peekaboo-mcp-screenshots-so-fast-theyre-paranormal/banner.png)

Today I'm releasing the first non-beta version of Peekaboo, a ghostly macOS utility that haunts your screen, capturing spectral snapshots for AI agents. Think of Peekaboo as supernatural contact lenses for your coding assistant.

You know the drill:
- "The button is broken!"
- "Which button?"
- "The blue one!"
- "...I'm an AI, I can't see colors. Or buttons. Or anything really."

Peekaboo solves this eternal struggle by giving AI agents their eyes - and it's smart about it.

## Smart Screenshot Capabilities

You can request screenshots in multiple ways:
- The whole screen or all screens
- Specific applications (with multiple images for multiple windows)
- Specific windows by title or index

Peekaboo understands your context and delivers exactly what you need.

## From AppleScript to Swift: A Performance Revolution

I had an early version of Peekaboo that was simply based on AppleScript, but the problem with AppleScript is that it's slow and quickly became almost unmaintainable. The tooling is bad, it's just really old, and it's slow. This Peekaboo is actually my complete rewrite of the original AppleScript version.

## The Game-Changer: Visual Question Answering

The best feature of Peekaboo is that agents can ask questions about screenshots. Imagine you're working on an app - it spins up but there's no UI, just a blank window. If you mess up an Electron window (I would never do that), the agent could ask: "Hey, do you see this text in this window?" 

👁️‍🗨️ "I SEE DEAD PIXELS!" - Your AI Assistant, Probably

Let AI roast your CSS crimes with visual evidence!

We support either OpenAI or Ollama, so you can use a remote model or a local model that looks at the image and answers the question. This is incredibly beneficial because it saves context space. Peekaboo can return images directly as base64 (fast but fills up context quickly), but being able to ask questions is much more efficient and helps keep the model context lean.

## Architecture: TypeScript + Swift

Why the mix of TypeScript and Swift? Because TypeScript has the best MCP support, and the tooling around it is great - npm and npx are proven and easy ways to install it. Yes, there's Muse for Swift, but this combines the best of both worlds. It would be fairly straightforward to add multi-platform support with binaries for Windows and Linux, but so far I only work with macOS. Other contributors are welcome to send pull requests for increased platform support!

## Testing with MCP Inspector

I thoroughly tested Peekaboo manually using the Model Context Protocol Inspector, along with various apps like Claude Desktop. The inspector is fantastic for interactive testing and development.

To test this project interactively, you can use this one-liner:

```bash
PEEKABOO_AI_PROVIDERS="ollama/llava:latest" npx @modelcontextprotocol/inspector npx -y @steipete/peekaboo-mcp@beta
```

This sets up Peekaboo with Ollama's LLaVA model and launches the MCP Inspector for immediate testing. Perfect for exploring the visual question answering capabilities in real-time.

## The Vision: Autonomous Agent Debugging

Peekaboo is like one puzzle piece in a larger set of MCPs I'm building to help agents stay in the loop. The goal is simple: if an agent can answer questions by itself, you don't have to intervene and it can simply continue and debug itself. This is the holy grail for building applications with CI - you want to do everything so the agent can loop and work until what you want is done.

When your build fails, when your UI doesn't look right, when something breaks - instead of stopping and asking you "what do you see?", the agent can take a screenshot, analyze it, and continue fixing the problem autonomously. That's the power of giving agents their eyes.

## Swift Testing Migration

With this release, I also took the opportunity to update the Swift testing from XCTest to Swift Testing. You can read more about that experience in my recent post: [Migrating 700+ Tests to Swift Testing: A Real-World Experience](/posts/migrating-700-tests-to-swift-testing).

One puzzle in this game is Peekaboo, and I'm happy that it's finally out. For more insights on building robust MCP tools, check out my guide: [MCP Best Practices](/posts/mcp-best-practices).

Peekaboo MCP is available now - giving your AI agents the gift of sight, one screenshot at a time.