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

<div class="cursor-install-button">
  <a href="cursor://anysphere.cursor-deeplink/mcp/install?name=peekaboo&config=ewogICJwZWVrYWJvbyI6IHsKICAgICJjb21tYW5kIjogIm5weCIsCiAgICAiYXJncyI6IFsKICAgICAgIi15IiwKICAgICAgIkBzdGVpcGV0ZS9wZWVrYWJvby1tY3AiCiAgICBdLAogICAgImVudiI6IHsKICAgICAgIlBFRUtBQk9PX0FJX1BST1ZJREVSUyI6ICJvbGxhbWEvbGxhdmE6bGF0ZXN0IgogICAgfQogIH0KfQ==">
    <img class="dark-theme-img" src="https://cursor.com/deeplink/mcp-install-dark.png" alt="Add to Cursor" />
    <img class="light-theme-img" src="https://cursor.com/deeplink/mcp-install-light.png" alt="Add to Cursor" />
  </a>
</div>

<style>
.cursor-install-button {
  margin-bottom: 2rem;
}
.cursor-install-button a {
  display: inline-block;
  border: none !important;
  box-shadow: none !important;
}
.cursor-install-button img {
  border: none !important;
  box-shadow: none !important;
  width: 50%;
  height: auto;
}
/* Theme switching */
html[data-theme="light"] .dark-theme-img {
  display: none;
}
html[data-theme="light"] .light-theme-img {
  display: block;
}
html[data-theme="dark"] .dark-theme-img,
html:not([data-theme]) .dark-theme-img {
  display: block;
}
html[data-theme="dark"] .light-theme-img,
html:not([data-theme]) .light-theme-img {
  display: none;
}
</style>

![Peekaboo MCP: Screenshots so fast they're paranormal](/assets/img/2025/peekaboo-mcp-screenshots-so-fast-theyre-paranormal/banner.png)

**TL;DR**: Peekaboo is a macOS-only MCP server that enables AI agents to capture screenshots of applications, windows, or the entire system, with optional visual question answering through local or remote AI models.

Today I'm releasing the first stable version of Peekaboo, a ghostly macOS utility that haunts your screen, capturing spectral snapshots for AI agents. Think of Peekaboo as supernatural contact lenses for your coding assistant.

### The Problem with Blind Agents

- "The button is broken!"
- "Which button?"
- "The blue one!"
- "...I'm an AI, I can't see colors. Or buttons. Or anything really."

Peekaboo solves this fundamental limitation by giving AI agents vision capabilities.

## What Peekaboo Can Do

Peekaboo provides three main tools that give AI agents visual capabilities:

- **`image`** - Capture screenshots of screens, windows, or specific applications
- **`analyze`** - Ask AI questions about captured images using vision models
- **`list`** - Enumerate available screens and windows for targeted captures

Each tool is designed to be powerful and flexible. Want to capture all windows of an app? Done. Need to know if a button is visible? Just ask. Looking for a specific window by title? Peekaboo's got you covered.

### Visual Question Answering

The most powerful feature of Peekaboo is that agents can ask questions about screenshots. Imagine you're working on an app - it spins up but there's no UI, just a blank window. The agent can ask: "What do you see in this window?" or "Is the submit button visible?" and get accurate answers.

We support both OpenAI and Ollama, allowing you to choose between cloud and local vision models. This visual Q&A capability is incredibly beneficial because it saves context space. While Peekaboo can return images directly as base64 or files, asking specific questions is much more efficient and helps keep the model context lean.

## Design Philosophy

### Less is More

The most important rule when building MCPs: **Keep the number of tools small**. Most IDEs and agents struggle once they encounter more than 40 different tools. My approach is to make every tool very powerful but keep the total count minimal to avoid cluttering the context.

![Cursor showing 40+ tools can become overwhelming](/assets/img/2025/peekaboo-mcp-screenshots-so-fast-theyre-paranormal/cursor-40-tools.png)

### Lenient Tool Calling

Another crucial principle: **tool calling should be lenient**. Agents are not perfect and sometimes make mistakes with parameters or argument combinations. Rather than returning errors for minor inconsistencies, Peekaboo tries to understand the agent's intent and do what they most likely meant.

Agents are smart - if they get something back that they didn't explicitly ask for, they'll adapt. Being overly strict just forces unnecessary retry loops. My belief (and this might be controversial) is that MCPs should be forgiving with arguments. Agents are not infallible, so why should our tools be unforgiving?

### Fuzzy Window Matching

Peekaboo implements fuzzy window matching because agents don't always know exact window titles. If an agent asks for "Chrome" but the actual window is titled "Google Chrome - Peekaboo MCP", we still match it. This flexibility is crucial when agents are trying to debug UI issues or capture specific application states.

The same principle applies to app names - partial matches work, case doesn't matter, and common variations are understood. This makes Peekaboo more robust in real-world scenarios where window titles change dynamically or apps have slightly different names than expected.

## From AppleScript to Swift

I had an early version of Peekaboo that was simply based on [AppleScript](https://github.com/steipete/Peekaboo/blob/main/peekaboo.scpt), but AppleScript had a fatal flaw: it requires focus changes. To capture a window, I had to bring it to the foreground, screenshot the entire screen, then crop out just the application. This was incredibly disruptive - imagine typing and suddenly your focus jumps to another window because the AI needs a screenshot. Trust me, I tried it, and it's really annoying.

Beyond the user experience nightmare, AppleScript is slow and quickly became unmaintainable. The tooling is bad, it's just really old, and it's slow. This Peekaboo is my complete rewrite using Swift, which can access the window manager directly and capture any window without focus changes. The user never knows a screenshot was taken - exactly how it should be.

The legacy AppleScript version is still available in the repository for reference, but the performance and user experience improvements of the Swift rewrite make it clear why the migration was necessary.

## Local vs Cloud: The Vision Model Showdown

For local image inference with Ollama, I've tested several models to find the best performers. While the landscape is rapidly evolving, none of the current local options match OpenAI's GPT-4o vision capabilities yet. However, local models offer privacy, cost control, and offline operation - valuable trade-offs depending on your use case.

### Recommended Local Models

After extensive testing, here are the best local vision models for Peekaboo:

**[LLaVA](https://ollama.com/library/llava) (Large Language and Vision Assistant)**
- **Default recommendation**: Best overall quality for vision tasks
- Available sizes: 7b, 13b, 34b
- Resource requirements:
  - `llava:7b`: ~4.5GB download, ~8GB RAM
  - `llava:13b`: ~8GB download, ~16GB RAM  
  - `llava:34b`: ~20GB download, ~40GB RAM

**[Qwen2-VL](https://ollama.com/library/qwen2-vl)**
- **Best for resource-constrained systems**: Excellent performance with lower requirements
- `qwen2-vl:7b`: ~4GB download, ~6GB RAM
- Ideal for less beefy machines while maintaining good accuracy

I chose LLaVA as the default because it offers the best balance of accuracy and capability for screenshot analysis. The model excels at understanding UI elements, reading text in images, and answering questions about visual content. While larger variants (13b, 34b) provide better results, even the 7b model handles most screenshot analysis tasks admirably.

## Architecture: TypeScript + Swift

Why the mix of TypeScript and Swift? Because [TypeScript has the best MCP support](https://github.com/modelcontextprotocol/typescript-sdk), and the tooling around it is great - npm and npx are proven and easy ways to install it. Yes, there's Muse for Swift, but this combines the best of both worlds. It would be fairly straightforward to add multi-platform support with binaries for Windows and Linux, but so far I only work with macOS.

## Technical Highlights

Here's what makes Peekaboo technically interesting:

**🏗️ Hybrid Architecture**
- [Swift CLI](https://github.com/steipete/Peekaboo/tree/main/peekaboo-cli/Sources/peekaboo) + [Node.js MCP server](https://github.com/steipete/Peekaboo/tree/main/src) working in harmony
- [Universal binary build script](https://github.com/steipete/Peekaboo/blob/main/scripts/build-swift-universal.sh) creates optimized ARM64/x86_64 binaries

**📸 Modern Screenshot Technology**
- Uses Apple's [ScreenCaptureKit](https://developer.apple.com/documentation/screencapturekit) (macOS 14+) for efficient capture
- Automatic shadow/frame exclusion for clean screenshots
- Smart window targeting with fuzzy app matching

**🤖 AI Provider Magic**
- Auto-fallback system across multiple AI providers (Ollama → OpenAI)
- Local LLaVA models + cloud GPT-4o vision in one unified interface

The magic happens through this elegant chain: macOS ScreenCaptureKit → Swift CLI → Node.js bridge → MCP protocol → AI models. Each component does one thing well, resulting in a system that's both powerful and maintainable.

## Testing with MCP Inspector

I thoroughly tested Peekaboo manually using the [Model Context Protocol Inspector](https://modelcontextprotocol.io/docs/tools/inspector), along with various apps like Claude Desktop. The inspector is fantastic for interactive testing and development.

To test this project interactively, you can use this one-liner:

```bash
PEEKABOO_AI_PROVIDERS="ollama/llava:latest" npx @modelcontextprotocol/inspector npx -y @steipete/peekaboo-mcp
```

This sets up Peekaboo with Ollama's LLaVA model and launches the MCP Inspector for immediate testing. Perfect for exploring the visual question answering capabilities in real-time.

## Installation

```json
"peekaboo": {
  "command": "npx",
  "args": [
    "-y",
    "@steipete/peekaboo-mcp"
  ],
  "env": {
    "PEEKABOO_AI_PROVIDERS": "ollama/llava:latest"
  }
}
```

### Setting Up Ollama

To use local AI models, you'll need [Ollama](https://ollama.ai) installed:

```bash
# Install Ollama (macOS)
brew install ollama

# Pull the LLaVA model (recommended for vision tasks)
ollama pull llava:latest
```

LLaVA is currently one of the most capable local vision models available through Ollama for screenshot analysis.

**GitHub Repository**: [steipete/Peekaboo](https://github.com/steipete/Peekaboo)

## The Vision: Autonomous Agent Debugging

Peekaboo is like one puzzle piece in a larger set of MCPs I'm building to help agents stay in the loop. The goal is simple: if an agent can answer questions by itself, you don't have to intervene and it can simply continue and debug itself. This is the holy grail for building applications with CI - you want to do everything so the agent can loop and work until what you want is done.

When your build fails, when your UI doesn't look right, when something breaks - instead of stopping and asking you "what do you see?", the agent can take a screenshot, analyze it, and continue fixing the problem autonomously. That's the power of giving agents their eyes.

## My MCP Ecosystem

Peekaboo is part of a growing collection of MCP servers I'm building:

- **🧠 [claude-code-mcp](https://github.com/steipete/claude-code-mcp)** - Integrates Claude Code into Cursor and other agents, providing a buddy for offloading tasks or getting a second opinion when stuck
- **🎯 [macos-automator-mcp](https://github.com/steipete/macos-automator-mcp)** - Run AppleScript and JXA (JavaScript for Automation) on macOS
- **🤖 [Terminator](https://github.com/steipete/Terminator)** - External terminal so agents don't get stuck waiting on commands that never return

Each MCP serves a specific purpose in building autonomous, self-sufficient AI workflows.

## Swift Testing Migration

With this release, I also took the opportunity to update the Swift testing from XCTest to Swift Testing. You can read more about that experience in my recent post: [Migrating 700+ Tests to Swift Testing: A Real-World Experience](/posts/migrating-700-tests-to-swift-testing).

One puzzle in this game is Peekaboo, and I'm happy that it's finally out. For more insights on building robust MCP tools, check out my guide: [MCP Best Practices](/posts/mcp-best-practices).

Peekaboo MCP is available now - giving your AI agents the gift of sight, one screenshot at a time.