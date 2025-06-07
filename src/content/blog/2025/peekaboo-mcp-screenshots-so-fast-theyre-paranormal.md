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

## MCP Design Philosophy: Less is More

The most important rule when building MCPs: **Keep the number of tools small**. Most IDEs and agents struggle once they encounter more than 40 different tools. My approach is to make every tool very powerful but keep the total count minimal to avoid cluttering the context.

![Cursor showing 40+ tools can become overwhelming](/assets/img/2025/peekaboo-mcp-screenshots-so-fast-theyre-paranormal/cursor-40-tools.png)

Peekaboo follows this philosophy with just **three tools**:

- **`image`** - Capture screenshots (screens, windows, specific apps)
- **`analyze`** - Ask AI questions about captured images  
- **`list`** - Enumerate available screens and windows

Each tool is designed to be powerful and flexible rather than having dozens of specialized variants.

## Lenient Tool Calling: Embrace Agent Imperfection

Another crucial principle: **tool calling should be lenient**. Agents are not perfect and sometimes make mistakes. For example, when an agent calls `list` for running applications but includes an empty array for `include_window_details`:

```
"Invalid arguments: 'include_window_details' only allowed for 'application_windows'."
```

Technically, this is correct - window details are only valid for application windows. But the array is empty, and we can infer the agent's intent. The better approach is to be lenient and simply do what the agent most likely asked for.

Agents are smart - if they get something back that they didn't explicitly ask for, they'll adapt. If we're overly strict and return errors, they'll have to call the tool again, which ultimately slows down the loop. My belief (and I'm sure this is controversial) is that MCPs should be very lenient in parsing arguments. Agents are not infallible, so why should our tools be unforgiving?

## From AppleScript to Swift

I had an early version of Peekaboo that was simply based on [AppleScript](https://github.com/steipete/Peekaboo/blob/main/peekaboo.scpt), but the problem with AppleScript is that it's slow and quickly became almost unmaintainable. The tooling is bad, it's just really old, and it's slow. This Peekaboo is actually my complete rewrite of the original AppleScript version.

The legacy AppleScript version is still available in the repository for reference, but the performance and maintainability improvements of the Swift rewrite make it clear why the migration was necessary.

## The Game-Changer: Visual Question Answering

The best feature of Peekaboo is that agents can ask questions about screenshots. Imagine you're working on an app - it spins up but there's no UI, just a blank window. If you mess up an Electron window (I would never do that), the agent could ask: "Hey, do you see this text in this window?" 

👁️‍🗨️ "I SEE DEAD PIXELS!" - Your AI Assistant, Probably

Let AI roast your CSS crimes with visual evidence!

We support either OpenAI or Ollama, so you can use a remote model or a local model that looks at the image and answers the question. This is incredibly beneficial because it saves context space. Peekaboo can return images directly as base64 (fast but fills up context quickly), but being able to ask questions is much more efficient and helps keep the model context lean.

## Local vs Cloud: The Vision Model Showdown

For local image inference with Ollama, I've tested several models to find the best performers. While the landscape is rapidly evolving, none of the current local options match OpenAI's GPT-4o vision capabilities yet. However, local models offer privacy, cost control, and offline operation - valuable trade-offs depending on your use case.

The most capable local vision models currently available through Ollama include options like LLaVA and its variants, but expect to make compromises on accuracy and detail recognition compared to cloud-based solutions. The field is moving fast though, so this gap continues to narrow.

## Architecture: TypeScript + Swift

Why the mix of TypeScript and Swift? Because TypeScript has the best MCP support, and the tooling around it is great - npm and npx are proven and easy ways to install it. Yes, there's Muse for Swift, but this combines the best of both worlds. It would be fairly straightforward to add multi-platform support with binaries for Windows and Linux, but so far I only work with macOS. Other contributors are welcome to send pull requests for increased platform support!

## Technical Highlights

The Peekaboo project has several fascinating technical aspects that make it a compelling example of modern AI-enabled developer tooling:

**🏗️ Hybrid Architecture Marvel**
- Swift CLI + Node.js MCP server + AI vision models working together
- Universal binary (ARM64/x86_64) with aggressive size optimization using lipo and strip
- Bridges native macOS APIs with modern AI workflows

**📸 Advanced Screenshot Technology**
- Uses ScreenCaptureKit (macOS 14+) with automatic shadow/frame exclusion
- Smart window targeting with fuzzy app matching
- Multiple capture modes (screens, windows, specific apps)

**🤖 AI Provider Abstraction**
- Auto-fallback system across multiple AI providers (Ollama, OpenAI)
- Local LLaVA models + cloud GPT-4o vision in one unified interface
- Environment-driven provider configuration

**🔐 Permission Management Excellence**
- Proactive Screen Recording + Accessibility permission checking
- Graceful degradation with clear error codes and user guidance
- Different permission models for different capture scenarios

**🌉 Clever Protocol Bridge**
- Node.js server translates between MCP JSON-RPC and Swift CLI JSON
- Maintains type safety with Zod schemas
- Stateless CLI design for crash resilience and clean resource management

**🛠️ Production-Ready Polish**
- Structured JSON logging with multi-layer debug capabilities
- Comprehensive testing (unit, integration, E2E with mock AI providers)
- Smart temporary file management and Base64 encoding strategies

The most clever aspect is how it makes AI assistants "see" your screen through a chain of: macOS APIs → Swift CLI → Node.js bridge → MCP protocol → AI models, all while handling permissions, errors, and multiple AI providers seamlessly.

This represents a sophisticated example of building AI-enabled developer tools that respect system boundaries while providing powerful capabilities.

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

[![Add to Cursor](https://cursor.directory/icon.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=peekaboo&config=ewogICJwZWVrYWJvbyI6IHsKICAgICJjb21tYW5kIjogIm5weCIsCiAgICAiYXJncyI6IFsKICAgICAgIi15IiwKICAgICAgIkBzdGVpcGV0ZS9wZWVrYWJvby1tY3AiCiAgICBdLAogICAgImVudiI6IHsKICAgICAgIlBFRUtBQk9PX0FJX1BST1ZJREVSUyI6ICJvbGxhbWEvbGxhdmE6bGF0ZXN0IgogICAgfQogIH0KfQ==)

**One-click install for Cursor** - Sets up Peekaboo with Ollama's LLaVA model as the default AI provider.

### Manual Installation

From [npm](https://www.npmjs.com/package/@steipete/peekaboo-mcp):
```bash
npm install -g @steipete/peekaboo-mcp
```

Or use directly with npx:
```bash
npx @steipete/peekaboo-mcp
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