---
title: "Poltergeist: The Ghost That Keeps Your Builds Fresh"
pubDatetime: 2025-08-05T16:00:00.000+02:00
description: "How I built a universal file watcher with automatic initialization that rebuilds any project - Swift, CMake, Rust, Node.js, or anything else - with zero configuration"
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
  - CMake
  - Swift
---

**TL;DR**: What started as a simple Swift build watcher became a zero-config universal build automation system. [Poltergeist](https://github.com/steipete/poltergeist) automatically detects your project type, configures itself, and rebuilds everything in the background whenever you save a file - no more waiting for builds or running stale code.

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

## Zero-Configuration Setup

**Requirements**: [Node.js 20.0.0+](https://nodejs.org) and [Watchman](https://facebook.github.io/watchman/docs/install.html)

The magic of modern Poltergeist is that it **auto-configures itself**:

```bash
# Install globally
npm install -g @steipete/poltergeist

# Auto-detect and configure your project
poltergeist init

# That's it! Start watching
poltergeist haunt

# Run your tool (always fresh!)
polter my-cli --help
```

**What just happened?**

1. `poltergeist init` **analyzed your project**:
   - Detected project type (Swift, CMake, Node.js, Rust, Python, mixed)
   - Found all build targets automatically
   - Generated optimal watch patterns
   - Created a complete `poltergeist.config.json`

2. For **CMake projects**, it even parses `CMakeLists.txt` to find executables and libraries
3. For **Swift projects**, it discovers Xcode projects and Package.swift configurations
4. **Smart defaults** mean no manual configuration - `enabled: true`, optimal timings, performance profiles

**Example auto-generated config for a CMake project:**

```json
{
  "version": "1.0",
  "projectType": "cmake",
  "targets": [
    {
      "name": "spine-c-debug", 
      "type": "cmake-executable",
      "targetName": "spine-c",
      "buildType": "Debug",
      "watchPaths": [
        "**/CMakeLists.txt",
        "src/**/*.{c,cpp,h}",
        "cmake/**/*.cmake"
      ]
    }
  ]
}
```

Edit any source file, and Poltergeist rebuilds automatically with smart reconfiguration when CMakeLists.txt changes.

## Never Run Stale Code Again

The real magic is in the details. What happens when you try to run your CLI while it's rebuilding? Or when a build fails?

Poltergeist includes `polter` - a smart execution wrapper that handles these edge cases. Instead of running `./my-tool` directly, you run:

```bash
polter my-tool [arguments]
```

The wrapper automatically:
- **Discovers your project**: Finds the poltergeist configuration from any directory
- **Checks build freshness**: Verifies the binary is newer than your source files  
- **Waits intelligently**: Shows live progress for ongoing builds with time elapsed
- **Fails fast**: Detects build failures and shows clear error messages
- **Guarantees freshness**: Only executes when builds succeed

**Real-time feedback during builds:**

```bash
🔨 Waiting for build to complete... (8s elapsed)
✅ Build completed successfully! Executing fresh binary...
```

**When builds fail:**

```bash
❌ Build failed! Cannot execute stale binary.
🔧 Run `poltergeist logs` for details or use --force to run anyway
```

**Graceful fallback when Poltergeist isn't running:**

```bash
⚠️  POLTERGEIST NOT RUNNING - EXECUTING POTENTIALLY STALE BINARY
   The binary may be outdated. For fresh builds, start Poltergeist:
   poltergeist haunt

✅ Running binary: my-app (potentially stale)
```

For Mac apps, this happens automatically - the app quits, rebuilds, and relaunches. For CLI tools, `polter` ensures you never accidentally test stale code while providing helpful fallbacks.

## Universal Language Support

Poltergeist now supports **any project type** with intelligent auto-detection:

### Supported Project Types
- **Swift**: Package.swift and Xcode projects with automatic scheme detection
- **CMake**: Parses `CMakeLists.txt` to find executables, libraries, and custom targets
- **Node.js**: Package.json detection with TypeScript/JavaScript build workflows  
- **Rust**: Cargo.toml projects with debug/release target generation
- **Python**: pyproject.toml and requirements.txt with test integration
- **Mixed**: Multi-language projects with combined optimization patterns

### Multi-Project Architecture

Here's where it gets really powerful: **each project runs independently**. You can have 10 different projects running Poltergeist simultaneously:

```bash
# Terminal 1 - Swift project
cd ~/projects/my-swift-app
poltergeist haunt

# Terminal 2 - CMake C++ project  
cd ~/projects/spine-c
poltergeist haunt

# Terminal 3 - From anywhere, see all projects
poltergeist status
```

Each project gets its own background process, but `poltergeist status` shows everything through a shared state system in `/tmp/poltergeist/`. One project crashing never affects others.

### Intelligent Build System

The build system analyzes your behavior:
- **Focus Detection**: Editing frontend files prioritizes frontend builds
- **Smart Queuing**: Parallel builds with dependency-aware scheduling  
- **Pattern Learning**: Builds what you're actively working on first
- **Resource Management**: Configurable parallelization prevents system overload

### Advanced Features You Don't Think About

- **Atomic State Management**: Lock-free file operations prevent corruption
- **Heartbeat Monitoring**: Automatic cleanup of stale processes
- **Cross-Platform State**: Works identically on macOS, Linux, Windows
- **Performance Profiles**: Conservative/balanced/aggressive optimization modes
- **Smart Exclusions**: 70+ patterns avoid watching irrelevant files
- **Structured Logging**: Machine-readable JSON logs for integration

See the [GitHub repository](https://github.com/steipete/poltergeist) for advanced configuration and integration examples.

## The Real Impact

What started as a Swift build watcher became a **fundamental shift in development workflow**. The feedback loop went from "save, wait, build, test" to just "save, test." But the deeper impact is more subtle:

### For Developers
- **Mental load reduction**: No more "did I rebuild?" anxiety
- **Context preservation**: Never lose flow state to build management
- **Confidence**: Always running the latest code, never chasing phantom bugs
- **Multi-project workflow**: Jump between projects without build coordination overhead

### For AI Agents (like Claude Code)
- **Reliability**: Never forget to rebuild before testing changes
- **Efficiency**: No wasted cycles rebuilding unnecessarily  
- **Debugging accuracy**: Always testing the actual current code
- **Workflow consistency**: Same commands work across any project type

### Architecture That Scales

The system is built on **battle-tested foundations**:

- **Facebook's Watchman**: Rock-solid file watching that powers Facebook, WhatsApp, and countless other large-scale systems
- **TypeScript**: Type-safe, maintainable codebase with excellent tooling
- **Distributed Design**: Each project isolated, shared state through atomic file operations
- **npm Distribution**: Easy installation and updates across all platforms

**Technical highlights:**
- **Lock-free state management**: Multiple processes coordinate without deadlocks
- **Atomic file operations**: State corruption is impossible
- **Smart resource usage**: Avoids watching 70+ irrelevant patterns (`node_modules`, `DerivedData`, etc.)
- **Graceful degradation**: Works even when Watchman isn't available
- **Zero-config experience**: Automatic detection and setup for any project

### Beyond Build Automation

Poltergeist represents a philosophy: **development tools should fade into the background**. When they work, you don't think about them. When they fail, they guide you toward solutions.

The most telling metric isn't features or performance - it's that after a few days, you completely forget it's running. Until you work on a project without it, and suddenly everything feels slow and manual again.

Check out [Poltergeist on GitHub](https://github.com/steipete/poltergeist) for complete documentation. The ghost is friendly to all languages, build systems, and developers who value their flow state.