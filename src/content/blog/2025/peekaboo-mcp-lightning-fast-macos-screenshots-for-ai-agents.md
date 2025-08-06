---
title: "Peekaboo MCP – lightning-fast macOS screenshots for AI agents"
pubDatetime: 2025-06-07T12:00:00.000+01:00
description: "Turn your blind AI into a visual debugger with instant screenshot capture and analysis"
heroImage: /assets/img/2025/peekaboo-mcp-lightning-fast-macos-screenshots-for-ai-agents/banner.png
tags:
  - MCP
  - Claude
  - Swift
  - macOS
  - Screenshots
  - Developer Tools
---

**TL;DR**: Peekaboo is a macOS-only MCP server that enables AI agents to capture screenshots of applications, or the entire system, with optional visual question answering through local or remote AI models.

> Without screenshots, agents debug blind—Peekaboo gives them eyes.

## What Peekaboo Can Do

Peekaboo provides three main tools that give AI agents visual capabilities:

- **`image`** - Capture screenshots of screens or specific applications
- **`analyze`** - Ask AI questions about captured images using vision models
- **`list`** - Enumerate available screens and windows for targeted captures

Each tool is designed to be powerful and flexible. The most powerful feature is visual question answering - agents can ask questions about screenshots like "What do you see in this window?" or "Is the submit button visible?" and get accurate answers. This saves context space since asking specific questions is much more efficient than returning raw image data.

Peekaboo supports both cloud and local vision models, letting you choose between accuracy and privacy.

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

Another crucial principle: **tool calling should be lenient**. Agents make mistakes with parameters, so rather than returning errors, Peekaboo tries to understand their intent. Being overly strict just forces unnecessary retry loops - MCPs should be forgiving since agents aren't infallible.

### Fuzzy Window Matching

Peekaboo implements fuzzy window matching because agents don't always know exact window titles. If an agent asks for "Chrome" but the window is titled "Google Chrome - Peekaboo MCP", we still match it. Partial matches work, case doesn't matter, and common variations are understood.

For more insights on building robust MCP tools, check out my guide: [MCP Best Practices](/posts/2025/mcp-best-practices).

## Local vs Cloud Vision Models

Peekaboo supports both local and cloud vision models. While cloud models like GPT-4o offer superior accuracy, local models provide privacy, cost control, and offline operation.

For local inference, I recommend LLaVA as the default for its balance of accuracy and performance. For resource-constrained systems, Qwen2-VL provides excellent results with lower requirements.

<details>
<summary>Model specifications and requirements</summary>

**[LLaVA](https://ollama.com/library/llava) (Large Language and Vision Assistant)**
- `llava:7b` - ~4.5GB download, ~8GB RAM required
- `llava:13b` - ~8GB download, ~16GB RAM required  
- `llava:34b` - ~20GB download, ~40GB RAM required
- Best overall quality for vision tasks

**[Qwen2-VL](https://ollama.com/library/qwen2-vl)**
- `qwen2-vl:7b` - ~4GB download, ~6GB RAM required
- Excellent performance with lower resource requirements
- Ideal for less powerful machines

**Installation:**
```bash
# Install your chosen model
ollama pull llava:latest        # or llava:7b, llava:13b, etc.
ollama pull qwen2-vl:7b        # for resource-constrained systems
```

</details>

## My MCP Ecosystem

Peekaboo is part of a growing collection of MCP servers I'm building:

- **[claude-code-mcp](https://github.com/steipete/claude-code-mcp)** - Integrates Claude Code into Cursor for task offloading
- **[macos-automator-mcp](https://github.com/steipete/macos-automator-mcp)** - Run AppleScript and JXA on macOS  
- **[Terminator](https://github.com/steipete/Terminator)** - External terminal so agents don't get stuck on long-running commands

Each serves a specific purpose in building autonomous AI workflows.

## Technical Architecture

Peekaboo combines TypeScript and Swift for the best of both worlds. TypeScript provides excellent [MCP support](https://github.com/modelcontextprotocol/typescript-sdk) and easy distribution via npm, while Swift enables direct access to Apple's [ScreenCaptureKit](https://developer.apple.com/documentation/screencapturekit) for capturing windows without focus changes.

My initial [AppleScript prototype](https://github.com/steipete/Peekaboo/blob/main/peekaboo.scpt) had a fatal flaw: it required focus changes to capture windows. The Swift rewrite uses ScreenCaptureKit to access the window manager directly - no focus changes, no user disruption.

The system uses a Swift CLI that communicates with a Node.js MCP server, supporting both local models and cloud providers with automatic fallback. Built with Swift 6 and the new Swift Testing framework ([now that I have experience with it!](/posts/migrating-700-tests-to-swift-testing)), Peekaboo delivers fast, non-intrusive screenshot capture with intelligent window matching.

For detailed testing instructions using the MCP Inspector, see the [Peekaboo README](https://github.com/steipete/Peekaboo#testing--debugging).

## The Vision: Autonomous Agent Debugging

Peekaboo is like one puzzle piece in a larger set of MCPs I'm building to help agents stay in the loop. The goal is simple: if an agent can answer questions by itself, you don't have to intervene and it can simply continue and debug itself. This is the holy grail for building applications with CI - you want to do everything so the agent can loop and work until what you want is done.

When your build fails, when your UI doesn't look right, when something breaks - instead of stopping and asking you "what do you see?", the agent can take a screenshot, analyze it, and continue fixing the problem autonomously. That's the power of giving agents their eyes.

👻 [Peekaboo MCP](https://www.peekaboo.dev/) is available now - ⭐ [the repo](https://github.com/steipete/Peekaboo) if this saves you a debug session!