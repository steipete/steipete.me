---
title: "Poltergeist: The Ghost That Keeps Your Builds Fresh"
pubDatetime: 2025-08-03T16:00:00.000+02:00
description: "How I built a universal file watcher that automatically rebuilds any project - TypeScript, Rust, Swift, or anything else - whenever you save a file"
heroImage: /assets/img/2025/poltergeist-continuous-swift-compilation/header.png
heroImageAlt: "Terminal showing Poltergeist rebuilding a Swift CLI with ghost emoji"
tags:
  - Development
  - Build Tools
  - TypeScript
  - npm
  - Open Source
  - AI Agents
  - Claude-Code
  - Automation
---

**TL;DR**: What started as a simple Swift build watcher became a universal file automation system. [Poltergeist](https://github.com/steipete/poltergeist) automatically rebuilds any project in the background whenever you save a file - no more waiting for builds or running stale code.

## The Story

I was building [Peekaboo](https://peekaboo.dev/), a macOS automation tool written in Swift. Working with Claude Code was fantastic, but there was one constant friction: build times. Every change meant waiting for Swift Package Manager to compile the CLI tool and Xcode to build the Mac app. The feedback loop was killing productivity.

Worse, AI agents would sometimes forget to rebuild before testing, leading to debugging sessions on code that was already fixed. Or they'd rebuild unnecessarily, burning through time and context windows.

So I wrote a quick bash script to watch Swift files and auto-rebuild in the background. Problem solved - for Swift.

But then I realized this would be incredibly useful for any kind of project. I already had both the CLI and Mac app building automatically, and I figured out this could work for so many other use cases.

That's when I decided to make this more of a thing - a universal developer experience solution.

## The Universal Solution

I rewrote the entire system in TypeScript with one goal: make it work for any project, any language, any build system. [Poltergeist](https://github.com/steipete/poltergeist) became a universal file watcher that haunts your projects.

Here's what makes it different:

**Target Flexibility**: Instead of hardcoded CLI and Mac app builders, Poltergeist supports unlimited targets. Executables, libraries, frameworks, test suites, Docker images, custom scripts - anything with a build command.

**Intelligence**: The system uses focus detection and priority scoring to build what you're working on first. If you're editing the frontend, it builds the frontend first. The build queue manages dependencies and parallelization automatically.

**Background Operation**: Everything happens invisibly. Save a file, and by the time you're ready to test, the fresh binary is waiting. For Mac apps, it even quits and relaunches automatically.

## Quick Start

**Requirements**: [Node.js 20.0.0+](https://nodejs.org) and [Watchman](https://facebook.github.io/watchman/docs/install.html)

```bash
# Install globally
npm install -g @steipete/poltergeist

# Or run directly
npx @steipete/poltergeist haunt

# Create poltergeist.config.json
{
  "version": "1.0",
  "projectType": "swift", 
  "targets": [
    {
      "name": "my-cli",
      "type": "executable",
      "enabled": true,
      "buildCommand": "swift build -c release",
      "outputPath": "./.build/release/MyTool",
      "watchPaths": ["Sources/**/*.swift", "Package.swift"]
    }
  ]
}

# Start watching
poltergeist haunt

# Run your tool (always fresh!)
pgrun my-cli --help
```

That's it. Edit Swift files, and Poltergeist rebuilds automatically. Use `pgrun` to run fresh binaries.

## Never Run Stale Code

The real magic is in the details. What happens when you try to run your CLI while it's rebuilding? Or when a build fails?

Poltergeist includes `pgrun` - a smart wrapper that handles these edge cases. Instead of running `./my-tool` directly, you run:

```bash
pgrun my-tool [arguments]
```

The wrapper automatically:
- Checks if the binary is newer than your source files
- Waits for any ongoing builds to complete with a progress spinner
- Detects build failures and shows clear error messages
- Only executes fresh binaries when builds succeed

When builds fail, you get helpful output:

```bash
❌ Last build failed
🔧 Run `poltergeist logs` for details or use --force to run anyway
```

For Mac apps, this happens automatically - the app quits, rebuilds, and relaunches. For CLI tools, `pgrun` ensures you never accidentally test stale code.

## Beyond Swift

The system now works with any project. Here are some real examples:

<details>
<summary><strong>Rust Project Example</strong></summary>

```json
{
  "targets": [
    {
      "name": "my-cli",
      "type": "executable", 
      "buildCommand": "cargo build --release",
      "outputPath": "./target/release/my-cli",
      "watchPaths": ["src/**/*.rs", "Cargo.toml"]
    }
  ]
}
```

</details>

<details>
<summary><strong>Multiple Targets Example</strong></summary>

```json
{
  "targets": [
    {
      "name": "frontend",
      "type": "executable",
      "buildCommand": "npm run build",
      "watchPaths": ["frontend/src/**/*"]
    },
    {
      "name": "backend", 
      "type": "executable",
      "buildCommand": "cargo build --release",
      "watchPaths": ["backend/src/**/*.rs"]
    },
    {
      "name": "tests",
      "type": "test",
      "testCommand": "npm test",
      "watchPaths": ["**/*.test.js"]
    }
  ]
}
```

</details>

The intelligence comes from focus detection and priority scoring - Poltergeist analyzes your file change patterns and prioritizes active targets. Edit the frontend, and the frontend builds first. Edit the Mac app, and the Mac app builds first. The build queue manages parallel execution and deduplication automatically. Native macOS notifications with customizable sounds let you know when each rebuild finishes.

## The Impact

What started as a Swift build watcher became something much bigger. The development feedback loop went from "save, wait, build, test" to just "save, test." AI agents stop forgetting to rebuild. Humans stop context-switching to build management.

The system is built on Facebook's Watchman for rock-solid file watching, with TypeScript for maintainability and npm for easy distribution. It works on macOS, Linux, and Windows, with 70+ optimized exclusion patterns that avoid watching irrelevant files like `node_modules`, `DerivedData`, and `target/` directories.

Key features include intelligent build prioritization, configurable parallelization, performance profiles (conservative/balanced/aggressive), cross-platform state management, and automatic project type detection for Swift, Node.js, Rust, Python, and mixed projects.

Most importantly, it's invisible when it works and helpful when it doesn't.

Check out [Poltergeist on GitHub](https://github.com/steipete/poltergeist) for full documentation and examples. The ghost is friendly to all languages and build systems.