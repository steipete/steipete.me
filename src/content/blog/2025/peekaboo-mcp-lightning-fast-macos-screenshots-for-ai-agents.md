---
title: "Peekaboo MCP – lightning-fast macOS screenshots for AI agents"
pubDatetime: 2025-06-07T12:00:00.000+01:00
description: "Turn your blind AI into a visual debugger with instant screenshot capture and analysis"
tags:
  - MCP
  - Claude
  - Swift
  - macOS
  - Screenshots
  - Developer Tools
---

![Peekaboo MCP – lightning-fast macOS screenshots for AI agents](/assets/img/2025/peekaboo-mcp-lightning-fast-macos-screenshots-for-ai-agents/banner.png)

**TL;DR**: Peekaboo is a macOS-only MCP server that enables AI agents to capture screenshots of applications, windows, or the entire system, with optional visual question answering through local or remote AI models.

Today I'm releasing the first stable version of Peekaboo, a ghostly macOS utility that haunts your screen, capturing spectral snapshots for AI agents. Think of Peekaboo as supernatural contact lenses for your coding assistant.

### The Problem with Blind Agents

Without visual capabilities, AI agents are fundamentally limited when debugging UI issues or understanding what's happening on screen. Peekaboo solves this limitation by giving AI agents vision capabilities.

<div class="cursor-install-button">
  <a href="cursor://anysphere.cursor-deeplink/mcp/install?name=peekaboo&config=ewogICJjb21tYW5kIjogIm5weCIsCiAgImFyZ3MiOiBbCiAgICAiLXkiLAogICAgIkBzdGVpcGV0ZS9wZWVrYWJvby1tY3AiCiAgXSwKICAiZW52IjogewogICAgIlBFRUtBQk9PX0FJX1BST1ZJREVSUyI6ICJvbGxhbWEvbGxhdmE6bGF0ZXN0IgogIH0KfQ==">
    <img class="dark-theme-img" src="https://cursor.com/deeplink/mcp-install-dark.png" alt="Install Peekaboo in Cursor IDE" />
    <img class="light-theme-img" src="https://cursor.com/deeplink/mcp-install-light.png" alt="Install Peekaboo in Cursor IDE" />
  </a>
</div>

<style>
.prose .cursor-install-button {
  margin: 0.5rem 0 !important;
}
.cursor-install-button a {
  display: inline-block;
  border: none !important;
  box-shadow: none !important;
}
.prose .cursor-install-button img {
  border: none !important;
  box-shadow: none !important;
  max-width: 200px;
  height: auto;
  margin: 0 !important;
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

<img src="/assets/img/2025/peekaboo-mcp-lightning-fast-macos-screenshots-for-ai-agents/cursor-40-tools.png" alt="Cursor showing 40+ tools can become overwhelming" style="max-width: 70%; height: auto;" />

### Lenient Tool Calling

Another crucial principle: **tool calling should be lenient**. Agents are not perfect and sometimes make mistakes with parameters or argument combinations. Rather than returning errors for minor inconsistencies, Peekaboo tries to understand the agent's intent and do what they most likely meant.

Agents are smart - if they get something back that they didn't explicitly ask for, they'll adapt. Being overly strict just forces unnecessary retry loops. My belief (and this might be controversial) is that MCPs should be forgiving with arguments. Agents are not infallible, so why should our tools be unforgiving?

### Fuzzy Window Matching

Peekaboo implements fuzzy window matching because agents don't always know exact window titles. If an agent asks for "Chrome" but the actual window is titled "Google Chrome - Peekaboo MCP", we still match it. This flexibility is crucial when agents are trying to debug UI issues or capture specific application states.

The same principle applies to app names - partial matches work, case doesn't matter, and common variations are understood. This makes Peekaboo more robust in real-world scenarios where window titles change dynamically or apps have slightly different names than expected.

## From AppleScript to Swift

My initial [AppleScript prototype](https://github.com/steipete/Peekaboo/blob/main/peekaboo.scpt) had a fatal flaw: it required focus changes. To capture a window, I had to bring it to the foreground, screenshot the entire screen, then crop out just the application. Imagine typing and suddenly your focus jumps to another window because the AI needs a screenshot - incredibly disruptive.

The Swift rewrite uses ScreenCaptureKit to access the window manager directly and capture any window without focus changes. The user never knows a screenshot was taken - exactly how it should be.

## Local vs Cloud: The Vision Model Showdown

For local image inference with Ollama, I've tested several models to find the best performers. While the landscape is rapidly evolving, none of the current local options match OpenAI's GPT-4o vision capabilities yet. However, local models offer privacy, cost control, and offline operation - valuable trade-offs depending on your use case.

### Recommended Local Models

After extensive testing, here are the best local vision models for Peekaboo:

**[LLaVA](https://ollama.com/library/llava) (Large Language and Vision Assistant)**
- **Default recommendation**: Best overall quality for vision tasks
- Available sizes: 7b (8GB RAM), 13b (16GB RAM), 34b (40GB RAM)

**[Qwen2-VL](https://ollama.com/library/qwen2-vl)**
- **Best for resource-constrained systems**: Excellent performance with lower requirements
- `qwen2-vl:7b`: ~4GB download, ~6GB RAM
- Ideal for less beefy machines while maintaining good accuracy

I chose LLaVA as the default because it offers the best balance of accuracy and capability for screenshot analysis. The model excels at understanding UI elements, reading text in images, and answering questions about visual content. While larger variants (13b, 34b) provide better results, even the 7b model handles most screenshot analysis tasks admirably.

## Technical Architecture

Peekaboo combines TypeScript and Swift for the best of both worlds. TypeScript provides excellent [MCP support](https://github.com/modelcontextprotocol/typescript-sdk) and easy distribution via npm, while Swift enables direct access to Apple's [ScreenCaptureKit](https://developer.apple.com/documentation/screencapturekit) for capturing windows without focus changes.

The system uses a [Swift CLI](https://github.com/steipete/Peekaboo/tree/main/peekaboo-cli/Sources/peekaboo) that communicates with a [Node.js MCP server](https://github.com/steipete/Peekaboo/tree/main/src), supporting both local models (via Ollama) and cloud providers (OpenAI) with automatic fallback. Built with Swift 6 and the new Swift Testing framework, Peekaboo delivers fast, non-intrusive screenshot capture with intelligent window matching. You can read about my experience modernizing the test suite in [Migrating 700+ Tests to Swift Testing](/posts/migrating-700-tests-to-swift-testing).

For detailed testing instructions using the MCP Inspector, see the [Peekaboo README](https://github.com/steipete/Peekaboo#testing--debugging).

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

<details>
<summary>Setting up Ollama for local AI models</summary>

To use local AI models, you'll need [Ollama](https://ollama.ai) installed:

```bash
# Install Ollama (macOS)
brew install ollama

# Pull the LLaVA model (recommended for vision tasks)
ollama pull llava:latest
```

LLaVA is currently one of the most capable local vision models available through Ollama for screenshot analysis.

</details>

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

For more insights on building robust MCP tools, check out my guide: [MCP Best Practices](/posts/mcp-best-practices).

Peekaboo MCP is available now - giving your AI agents the gift of sight, one screenshot at a time.