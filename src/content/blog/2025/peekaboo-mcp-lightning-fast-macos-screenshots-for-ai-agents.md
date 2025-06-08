o---
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

It supports both OpenAI and Ollama, allowing you to choose between cloud and local vision models. This visual Q&A capability is incredibly beneficial because it saves context space. While Peekaboo can return images directly as files or base 64 inline, asking specific questions is much more efficient and helps keep the model context lean.

## Design Philosophy

### Less is More

The most important rule when building MCPs: **Keep the number of tools small**. Most agents struggle once they encounter more than 40 different tools. My approach is to make every tool very powerful but keep the total count minimal to avoid cluttering the context.

<img src="/assets/img/2025/peekaboo-mcp-lightning-fast-macos-screenshots-for-ai-agents/cursor-40-tools.png" alt="Cursor showing 40+ tools can become overwhelming" style="max-width: 100%; height: auto;" class="responsive-cursor-tools" />

<style>
@media (min-width: 768px) {
  .responsive-cursor-tools {
    max-width: 70% !important;
  }
}
</style>

### Lenient Tool Calling

Another crucial principle: **tool calling should be lenient**. Agents are not perfect and sometimes make mistakes with parameters or argument combinations. Rather than returning errors for minor inconsistencies, Peekaboo tries to understand the agent's intent and do what they most likely meant.

Agents are smart - if they get something back that they didn't explicitly ask for, they'll adapt. Being overly strict just forces unnecessary retry loops. My belief (and this might be controversial) is that MCPs should be forgiving with arguments. Agents are not infallible, so why should our tools be unforgiving?

### Fuzzy Window Matching

Peekaboo implements fuzzy window matching because agents don't always know exact window titles. If an agent asks for "Chrome" but the actual window is titled "Google Chrome - Peekaboo MCP", we still match it. This flexibility is crucial when agents are trying to debug UI issues or capture specific application states.

The same principle applies to app names - partial matches work, case doesn't matter, and common variations are understood. This makes Peekaboo more robust in real-world scenarios where window titles change dynamically or apps have slightly different names than expected.

## Local vs Cloud Vision Models

Peekaboo supports both local (Ollama) and cloud (OpenAI) vision models. While cloud models like GPT-4o offer superior accuracy, local models provide privacy, cost control, and offline operation.

For local inference, I recommend [LLaVA](https://ollama.com/library/llava) as the default - it offers the best balance of accuracy and performance for screenshot analysis. For resource-constrained systems, [Qwen2-VL](https://ollama.com/library/qwen2-vl) provides excellent results with lower requirements.

## Technical Architecture

Peekaboo combines TypeScript and Swift for the best of both worlds. TypeScript provides excellent [MCP support](https://github.com/modelcontextprotocol/typescript-sdk) and easy distribution via npm, while Swift enables direct access to Apple's [ScreenCaptureKit](https://developer.apple.com/documentation/screencapturekit) for capturing windows without focus changes.

My initial [AppleScript prototype](https://github.com/steipete/Peekaboo/blob/main/peekaboo.scpt) had a fatal flaw: it required focus changes to capture windows. The Swift rewrite uses ScreenCaptureKit to access the window manager directly - no focus changes, no user disruption.

The system uses a [Swift CLI](https://github.com/steipete/Peekaboo/tree/main/peekaboo-cli/Sources/peekaboo) that communicates with a [Node.js MCP server](https://github.com/steipete/Peekaboo/tree/main/src), supporting both local models (via Ollama) and cloud providers (OpenAI) with automatic fallback. Built with Swift 6 and the new Swift Testing framework, Peekaboo delivers fast, non-intrusive screenshot capture with intelligent window matching. You can read about my experience modernizing the test suite in [Migrating 700+ Tests to Swift Testing](/posts/migrating-700-tests-to-swift-testing).

For detailed testing instructions using the MCP Inspector, see the [Peekaboo README](https://github.com/steipete/Peekaboo#testing--debugging).

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