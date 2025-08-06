---
title: "Peekaboo 2.0 – Free the CLI from its MCP shackles"
pubDatetime: 2025-07-03T02:00:00.000+01:00
description: "Peekaboo 2.0 ditches the MCP-only approach for a CLI-first architecture, because CLIs are the universal interface that both humans and AI agents can actually use effectively"
heroImage: /assets/img/2025/peekaboo-2-freeing-the-cli-from-its-mcp-shackles/banner.png
tags:
  - MCP
  - CLI
  - Swift
  - macOS
  - Screenshots
  - Developer Tools
  - AI Agents
---

A few weeks ago I [built Peekaboo](https://steipete.me/posts/2025/peekaboo-mcp-lightning-fast-macos-screenshots-for-ai-agents), lightning-fast macOS screenshots for AI agents. The twist? Not only is it really fast at screenshots, it can also use a separate agent to answer queries - saving precious context space for your main agent. Plus, in contrast to the macOS `screencapture`, it doesn't need user action or steals app focus.

Lately there's a mind shift in the community to realize that **most MCPs are actually better if they're just CLIs**. Agents have an easier time calling CLIs, they can be loaded on-demand without cluttering the context, and they are composable. With that, I release Peekaboo 2.0, which has been freed from its MCP shackles and is now also available as CLI. 

## How It Works

The magic behind Peekaboo 2.0 is its clean separation of concerns. From day one, I built it as a Swift CLI with a thin TypeScript wrapper for MCP support. This architecture means the CLI version isn't a port or afterthought – it's the core engine. I had to do some refactoring, move the AI processing features from TypeScript into the Swift CLI, and now you get the same powerful functionality without the MCP overhead.

Here's what this means for you: instead of installing an MCP into Claude/Cursor, cluttering up the context for every session, agents can now discover and use Peekaboo on-demand:

```bash
$ peekaboo --help
Capture screenshots and analyze them with AI

$ peekaboo image --app "Safari"
✓ Screenshot saved to: ~/Desktop/safari-2025-07-03.png

$ peekaboo analyze ~/Desktop/safari-2025-07-03.png "What's on this webpage?"
✓ The webpage shows the Peekaboo documentation with installation instructions...
```

## Installation Options

Peekaboo 2.0 can be installed via Homebrew:

```bash
brew tap steipete/tap
brew install peekaboo
```

Or you can just download it from [GitHub](https://github.com/steipete/peekaboo). Of course, you can still use the MCP server; nothing changed there.

## Configuring OpenAI for AI Analysis

While Peekaboo can capture screenshots without any configuration, the real magic happens when you enable AI analysis. Without an OpenAI API key, you're missing out on the powerful GPT-4 Vision integration that can understand and describe what's on your screen.

Here's how to set it up:

```bash
# Option 1: Export in your shell profile (~/.zshrc or ~/.bash_profile)
export OPENAI_API_KEY="sk-..."

# Option 2: Use Peekaboo's configuration file
peekaboo config init
peekaboo config edit

# Add this to the config:
{
  "aiProviders": {
    "providers": "openai/gpt-4o,ollama/llava:latest",
    "openaiApiKey": "${OPENAI_API_KEY}"  // Or paste your key directly
  }
}
```

Once configured, Peekaboo transforms from a simple screenshot tool into a visual AI assistant:

```bash
# Debug UI issues
peekaboo image --app "MyApp" --analyze "Do you see three buttons here?"

# Understand complex interfaces
peekaboo image --mode screen --analyze "What errors are shown in the console?"

# But here's where it gets even better – combine capture and analyze:
peekaboo image --app "Safari" --analyze "Summarize this webpage"
# ✓ Screenshot captured from Safari
# ✓ Analysis: The webpage displays a blog post about Peekaboo 2.0, announcing 
#   its evolution from an MCP-only tool to a CLI-first architecture...
```

## Why CLI > MCP

Agents are really, really good at calling CLIs (actually much better than calling MCPs), so you don't have to clutter up your context and you can use all the features that Peekaboo has on demand, no installation required. Just add a note in your project's CLAUDE.md or agent instructions file that "peekaboo is available for screenshots", or simply mention peekaboo whenever your current context requires visual debugging.

As Armin Ronacher perfectly articulates in ["Code Is All You Need"](https://lucumr.pocoo.org/2025/7/3/tools/), CLIs offer composability, reliability, and verifiability that complex tool interfaces can't match. CLIs work for both humans and AI agents – we can run, debug, and understand them. Once a CLI command works, it can be executed hundreds of times without requiring additional inference or context. This mechanical predictability makes CLIs the universal, composable interface that bridges human and AI interaction.

I'm not saying all MCPs are useless - for example [Microsoft's Playwright MCP](https://github.com/microsoft/playwright-mcp) for browser automation is great. However, they also built an [MCP for GitHub](https://github.com/microsoft/mcp), which is simply a lesser version of the existing [`gh` cli](https://cli.github.com/) which does the same thing. If this got you thinking, watch Manuel Odendahl's excellent [“MCPs are Boring” talk](https://www.youtube.com/watch?v=J3oJqan2Gv8) from AI Engineer.

## Get Started Today

Peekaboo 2.0 represents a fundamental shift in how we think about AI tooling. By choosing CLIs over complex protocols, we get tools that are faster, more reliable, and work for everyone – human or AI.

Ready to give your agents eyes? [Get Peekaboo 2.0](https://peekaboo.dev/) and join the CLI revolution. Your agents (and your context window) will thank you.