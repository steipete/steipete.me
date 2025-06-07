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

**TL;DR**: Peekaboo is a macOS-only MCP server that enables AI agents to capture screenshots of applications, windows, or the entire system, with optional visual question answering through integrated AI models. It bridges the gap between what agents need to see and what they can access.

Today I'm releasing the first stable version of Peekaboo, a ghostly macOS utility that haunts your screen, capturing spectral snapshots for AI agents. Think of Peekaboo as supernatural contact lenses for your coding assistant.

You know the drill:
- "The button is broken!"
- "Which button?"
- "The blue one!"
- "...I'm an AI, I can't see colors. Or buttons. Or anything really."

Peekaboo solves this eternal struggle by giving AI agents their eyes - and it's smart about it.

## What Peekaboo Can Do

Peekaboo provides three main tools that give AI agents visual capabilities:

- **`image`** - Capture screenshots of screens, windows, or specific applications
- **`analyze`** - Ask AI questions about captured images using vision models
- **`list`** - Enumerate available screens and windows for targeted captures

Each tool is designed to be powerful and flexible. Want to capture all windows of an app? Done. Need to know if a button is visible? Just ask. Looking for a specific window by title? Peekaboo's got you covered.

### The Game-Changer: Visual Question Answering

The best feature of Peekaboo is that agents can ask questions about screenshots. Imagine you're working on an app - it spins up but there's no UI, just a blank window. If you mess up an Electron window (I would never do that), the agent could ask: "Hey, do you see this text in this window?" 

👁️‍🗨️ "I SEE DEAD PIXELS!" - Your AI Assistant, Probably

Let AI roast your CSS crimes with visual evidence!

We support either OpenAI or Ollama, so you can use a remote model or a local model that looks at the image and answers the question. This is incredibly beneficial because it saves context space. Peekaboo can return images directly as base64 (fast but fills up context quickly), but being able to ask questions is much more efficient and helps keep the model context lean.

## Design Philosophy

### Less is More

The most important rule when building MCPs: **Keep the number of tools small**. Most IDEs and agents struggle once they encounter more than 40 different tools. My approach is to make every tool very powerful but keep the total count minimal to avoid cluttering the context.

<!-- TODO: Add cursor-40-tools.png image here -->

### Lenient Tool Calling

Another crucial principle: **tool calling should be lenient**. Agents are not perfect and sometimes make mistakes. For example, when an agent calls `list` for running applications but includes an empty array for `include_window_details`:

```
"Invalid arguments: 'include_window_details' only allowed for 'application_windows'."
```

Technically, this is correct - window details are only valid for application windows. But the array is empty, and we can infer the agent's intent. The better approach is to be lenient and simply do what the agent most likely asked for.

Agents are smart - if they get something back that they didn't explicitly ask for, they'll adapt. If we're overly strict and return errors, they'll have to call the tool again, which ultimately slows down the loop. My belief (and I'm sure this is controversial) is that MCPs should be very lenient in parsing arguments. Agents are not infallible, so why should our tools be unforgiving?

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

The field is moving fast though, so this gap between local and cloud models continues to narrow.

## Architecture: TypeScript + Swift

Why the mix of TypeScript and Swift? Because TypeScript has the best MCP support, and the tooling around it is great - npm and npx are proven and easy ways to install it. Yes, there's Muse for Swift, but this combines the best of both worlds. It would be fairly straightforward to add multi-platform support with binaries for Windows and Linux, but so far I only work with macOS. Other contributors are welcome to send pull requests for increased platform support!

## Technical Highlights

Here's what makes Peekaboo technically interesting:

**🏗️ Hybrid Architecture**
- [Swift CLI](https://github.com/steipete/Peekaboo/tree/main/peekaboo-cli) + [Node.js MCP server](https://github.com/steipete/Peekaboo/tree/main/src) working in harmony
- [Universal binary build script](https://github.com/steipete/Peekaboo/blob/main/build-universal.sh) creates optimized ARM64/x86_64 binaries
- Bridges native macOS APIs with modern AI workflows

**📸 Modern Screenshot Technology**
- Uses Apple's [ScreenCaptureKit](https://developer.apple.com/documentation/screencapturekit) (macOS 14+) for efficient capture
- Automatic shadow/frame exclusion for clean screenshots
- Smart window targeting with fuzzy app matching

**🤖 AI Provider Magic**
- Auto-fallback system across multiple AI providers (Ollama → OpenAI)
- Local LLaVA models + cloud GPT-4o vision in one unified interface
- Zero configuration needed - just works out of the box

**🌉 Clever Protocol Bridge**
- Node.js translates between MCP JSON-RPC and Swift CLI JSON
- Stateless CLI design for crash resilience
- Type safety with Zod schemas throughout

The magic happens through this elegant chain: macOS ScreenCaptureKit → Swift CLI → Node.js bridge → MCP protocol → AI models. Each component does one thing well, resulting in a system that's both powerful and maintainable.

## Testing with MCP Inspector

I thoroughly tested Peekaboo manually using the [Model Context Protocol Inspector](https://modelcontextprotocol.io/docs/tools/inspector), along with various apps like Claude Desktop. The inspector is fantastic for interactive testing and development.

To test this project interactively, you can use this one-liner:

```bash
PEEKABOO_AI_PROVIDERS="ollama/llava:latest" npx @modelcontextprotocol/inspector npx -y @steipete/peekaboo-mcp
```

This sets up Peekaboo with Ollama's LLaVA model and launches the MCP Inspector for immediate testing. Perfect for exploring the visual question answering capabilities in real-time.

## The Vision: Autonomous Agent Debugging

Peekaboo is like one puzzle piece in a larger set of MCPs I'm building to help agents stay in the loop. The goal is simple: if an agent can answer questions by itself, you don't have to intervene and it can simply continue and debug itself. This is the holy grail for building applications with CI - you want to do everything so the agent can loop and work until what you want is done.

When your build fails, when your UI doesn't look right, when something breaks - instead of stopping and asking you "what do you see?", the agent can take a screenshot, analyze it, and continue fixing the problem autonomously. That's the power of giving agents their eyes.

## My MCP Ecosystem

Peekaboo is part of a growing collection of MCP servers I'm building:

- **[claude-code-mcp](https://github.com/steipete/claude-code-mcp)** - Bridge between Claude Code and MCP for enhanced development workflows
- **[macos-automator-mcp](https://github.com/steipete/macos-automator-mcp)** - Automate macOS tasks and workflows through MCP integration
- **[Terminator](https://github.com/steipete/Terminator)** - Terminal automation and command execution for AI agents

Each MCP serves a specific purpose in building autonomous, self-sufficient AI workflows.

## Swift Testing Migration

With this release, I also took the opportunity to update the Swift testing from XCTest to Swift Testing. You can read more about that experience in my recent post: [Migrating 700+ Tests to Swift Testing: A Real-World Experience](/posts/migrating-700-tests-to-swift-testing).

One puzzle in this game is Peekaboo, and I'm happy that it's finally out. For more insights on building robust MCP tools, check out my guide: [MCP Best Practices](/posts/mcp-best-practices).

## Installation

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.png)](cursor://anysphere.cursor-deeplink/mcp/install?name=peekaboo&config=ewogICJwZWVrYWJvbyI6IHsKICAgICJjb21tYW5kIjogIm5weCIsCiAgICAiYXJncyI6IFsKICAgICAgIi15IiwKICAgICAgIkBzdGVpcGV0ZS9wZWVrYWJvby1tY3AiCiAgICBdLAogICAgImVudiI6IHsKICAgICAgIlBFRUtBQk9PX0FJX1BST1ZJREVSUyI6ICJvbGxhbWEvbGxhdmE6bGF0ZXN0IgogICAgfQogIH0KfQ==)

**One-click install for Cursor** - Sets up Peekaboo with Ollama's LLaVA model as the default AI provider.

### Manual Installation

Add to your MCP configuration file (`~/.cursor/mcp.json` or `.cursor/mcp.json`):

```json
{
  "mcpServers": {
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
  }
}
```

Or install globally from [npm](https://www.npmjs.com/package/@steipete/peekaboo-mcp):
```bash
npm install -g @steipete/peekaboo-mcp
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

Peekaboo MCP is available now - giving your AI agents the gift of sight, one screenshot at a time.