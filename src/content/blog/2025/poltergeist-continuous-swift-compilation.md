---
title: "Poltergeist: The Ghost That Keeps Your Builds Fresh"
pubDatetime: 2025-08-02T16:00:00.000+02:00
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

**TL;DR**: Tired of manually rebuilding your project every time you make a change? Meet [Poltergeist](https://github.com/steipete/poltergeist) - a universal file watcher that automatically rebuilds any project in the background. Now available as an npm package and fully open source!

> **🚨 Breaking Changes Alert**: Poltergeist has been completely rewritten with a new universal target system. If you're using an older version, you'll need to migrate your configuration - but the new system is much more powerful! See the [migration guide](https://github.com/steipete/poltergeist/blob/main/MIGRATION.md) for details.

I've been building [Peekaboo](https://peekaboo.dev/), a Swift project for macOS automation. Working with Claude Code has been great, but compilation times were killing the flow - whether I was working on the CLI tool or the Mac app. That's when I realized this wasn't just a Swift problem - it's a universal developer experience issue.

## The Problem: Build Times Are Agent Killers

When you're working with AI agents, the feedback loop is everything. Agents thrive on quick iterations - make a change, test it, adjust, repeat. But compile times were destroying this flow - whether it's Swift, TypeScript, Rust, or any compiled language.

Even worse, agents would sometimes forget to rebuild before testing, leading to confusing situations where we'd debug "issues" that were already fixed in the code but not in the binary. Or they'd rebuild unnecessarily, wasting precious time and context.

I needed something that would:
1. Automatically detect when source files change
2. Rebuild in the background without interrupting my workflow
3. Handle build failures gracefully
4. Work seamlessly with AI agents

## Enter Poltergeist 👻

Poltergeist is a universal file watcher that haunts your project, automatically rebuilding your code whenever source files change. It's built on Facebook's [Watchman](https://facebook.github.io/watchman/) - a file watching service that's battle-tested at scale. Now completely rewritten in TypeScript and available as an [npm package](https://www.npmjs.com/package/@steipete/poltergeist)!

What makes Poltergeist special is its **intelligent universal system** that goes far beyond simple file watching:

**Universal Target Support**:
- **Any CLI tool** - TypeScript, Rust, Go, Swift, Python, you name it
- **Desktop apps** - macOS, iOS apps with auto-relaunch
- **Libraries & Frameworks** - Static/dynamic libs, Apple frameworks
- **Test suites** - Unit tests, integration tests with coverage
- **Docker containers** - Multi-stage builds and development images
- **Custom builds** - Plugin system for any build process

**Intelligent Features**:
- **Smart Priority Engine** - Automatically builds what you're working on first
- **Focus Detection** - Learns your development patterns over time  
- **Performance Optimization** - 70+ exclusion patterns, configurable profiles
- **Build Queue Management** - Parallel builds with intelligent deduplication
- **Cross-platform** - Works on macOS, Linux, and Windows

Here's how it looks in action:

```bash
# Install globally
$ npm install -g @steipete/poltergeist

# Initialize in any project
$ poltergeist init

# Start watching all enabled targets
$ poltergeist haunt
👻 Poltergeist Status
Target: my-cli
  Status: running
  Process: 12345 (host: MacBook-Pro.local)
  Build Status: ✅ Building...

# When you save a file...
🔨 [my-cli] Building with: cargo build --release
✅ [my-cli] Build complete in 12.3s

# Or for multiple targets
🔨 [web-app] Building with: npm run build
✅ [web-app] Build complete in 2.1s
🔨 [unit-tests] Running with: npm test
✅ [unit-tests] Tests passed in 1.8s

# Watch specific targets only
$ poltergeist haunt --target my-cli
```

The beauty is that it runs completely in the background. You edit files, Poltergeist rebuilds. By the time you're ready to test, the fresh binary is waiting for you. For Mac apps, it even **automatically quits and relaunches** the app after a successful build - perfect for rapid UI iteration!

## The Smart Wrapper: Never Run Stale Code Again

But automatic rebuilding is only half the solution. What happens when you try to run the CLI while it's being rebuilt? Or worse, what if the build failed?

That's where the smart wrapper script comes in:

```
# Instead of: ./peekaboo
# You run: ./scripts/peekaboo-wait.sh

# The wrapper:
# 1. Checks if the binary is fresh
# 2. Waits for any ongoing builds
# 3. Detects build failures and tells you exactly what to do
```

For Mac apps, Poltergeist handles the entire lifecycle automatically - no wrapper needed!

When a build fails, instead of cryptic errors or stale binaries, you get:

```
❌ POLTERGEIST BUILD FAILED

Error: Cannot find 'someMethod' in scope

🔧 TO FIX: Run 'npm run build:swift' to see and fix the compilation errors.
```

## Complete Evolution: Universal Target System

Poltergeist has evolved far beyond its original bash script roots. What started as a simple Swift build watcher is now a **universal build automation system** that supports any language, framework, or build process.

**Major Evolution**:
- **Universal Target System**: No longer limited to CLI + Mac app - now supports unlimited targets of any type
- **Intelligent Build Prioritization**: Automatically detects what you're working on and builds it first
- **Smart Performance Optimization**: Configurable profiles from conservative to aggressive
- **Advanced State Management**: Lock-free, atomic operations with cross-tool compatibility
- **Breaking Changes**: Complete rewrite with no backward compatibility - but worth the upgrade!

Key improvements:
- **An npm package**: `npm install -g @steipete/poltergeist`
- **Configuration-driven**: Modern JSON schema with validation
- **Language agnostic**: Works with any build system or framework
- **Cross-platform**: macOS, Linux, Windows support
- **Open source**: [github.com/steipete/poltergeist](https://github.com/steipete/poltergeist)

<details>
<summary>View modern target configurations for different languages</summary>

The new **universal target system** supports unlimited targets of any type. Here are some examples:

### TypeScript/Node.js Project

```json
{
  "version": "1.0",
  "projectType": "node",
  "targets": [
    {
      "name": "web-app",
      "type": "executable",
      "enabled": true,
      "buildCommand": "npm run build",
      "outputPath": "./dist/index.js",
      "watchPaths": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "package.json",
        "tsconfig.json"
      ],
      "settlingDelay": 500
    }
  ]
}
```

### Rust Project

```json
{
  "version": "1.0",
  "projectType": "rust",
  "targets": [
    {
      "name": "my-cli",
      "type": "executable",
      "enabled": true,
      "buildCommand": "cargo build --release",
      "outputPath": "./target/release/my-cli",
      "watchPaths": [
        "src/**/*.rs",
        "Cargo.toml",
        "Cargo.lock"
      ],
      "settlingDelay": 1000
    },
    {
      "name": "tests",
      "type": "test",
      "enabled": true,
      "testCommand": "cargo test",
      "watchPaths": [
        "src/**/*.rs",
        "tests/**/*.rs"
      ]
    }
  ]
}
```

### Swift Project with Multiple Targets

```json
{
  "version": "1.0",
  "projectType": "swift",
  "targets": [
    {
      "name": "my-cli",
      "type": "executable",
      "enabled": true,
      "buildCommand": "swift build -c release",
      "outputPath": "./.build/release/my-tool",
      "watchPaths": [
        "Sources/**/*.swift",
        "Package.swift"
      ]
    },
    {
      "name": "my-mac-app",
      "type": "app-bundle",
      "platform": "macos",
      "enabled": true,
      "buildCommand": "xcodebuild -workspace MyApp.xcworkspace -scheme MyApp build",
      "bundleId": "com.example.myapp",
      "autoRelaunch": true,
      "watchPaths": [
        "MyApp/**/*.swift",
        "MyApp/**/*.storyboard"
      ]
    },
    {
      "name": "unit-tests",
      "type": "test",
      "enabled": true,
      "testCommand": "swift test",
      "watchPaths": [
        "Sources/**/*.swift",
        "Tests/**/*.swift"
      ]
    }
  ],
  "buildScheduling": {
    "parallelization": 2,
    "prioritization": {
      "enabled": true,
      "focusDetectionWindow": 300000
    }
  }
}
```

### Docker Development Environment

```json
{
  "version": "1.0",
  "projectType": "mixed",
  "targets": [
    {
      "name": "api-server",
      "type": "docker",
      "enabled": true,
      "imageName": "myapp/api",
      "dockerfile": "./Dockerfile.dev",
      "buildCommand": "docker build -f Dockerfile.dev -t myapp/api:dev .",
      "watchPaths": [
        "src/**/*.js",
        "package.json",
        "Dockerfile.dev"
      ]
    },
    {
      "name": "frontend",
      "type": "executable",
      "enabled": true,
      "buildCommand": "npm run build",
      "outputPath": "./dist",
      "watchPaths": [
        "frontend/src/**/*",
        "frontend/package.json"
      ]
    }
  ]
}
```

</details>

## Modern TypeScript Architecture

The complete rewrite features a sophisticated TypeScript architecture with these key components:

**Core Architecture**:
- **Universal Target System**: Pluggable builders for executable, app-bundle, library, framework, test, docker, and custom targets
- **Intelligent Build Queue**: Priority scoring engine that learns your development patterns
- **Smart State Management**: Lock-free atomic operations with cross-tool compatibility  
- **Advanced File Watching**: Facebook Watchman integration with 70+ smart exclusion patterns
- **Performance Optimization**: Configurable profiles from conservative to aggressive

**Target Type Examples**:
- **executable**: CLI tools, binaries, web apps
- **app-bundle**: macOS, iOS, tvOS, watchOS applications with auto-relaunch
- **library**: Static and dynamic libraries
- **framework**: Apple frameworks and general frameworks
- **test**: Test suites with coverage tracking
- **docker**: Container images with multi-stage builds
- **custom**: Extensible plugin system for any build process

**Key Features**:
- **Focus Detection**: Automatically prioritizes targets you're actively working on
- **Smart Parallelization**: Configurable concurrent builds (1-10 targets)
- **Performance Profiles**: Balanced approach that adapts to project size
- **Cross-Platform**: Works on macOS, Linux, and Windows
- **Native Notifications**: macOS alerts with custom sounds for build status

**Configuration Migration**: 
If you have an existing Poltergeist setup, you'll need to migrate to the new target format. The old `cli` and `macApp` sections are no longer supported - everything now uses the flexible `targets` array system.

## Build Failure Recovery

The trickiest part was handling build failures gracefully. The solution ensures agents never get stuck:

1. **Exit Code 42**: When the wrapper detects a build failure, it exits with code 42
2. **Clear Instructions**: The error message tells agents exactly what to do
3. **Exponential Backoff**: Poltergeist backs off after repeated failures (1min → 2min → 5min)
4. **Recovery Signal**: After fixing errors, agents can signal Poltergeist to reset the backoff

With Poltergeist running, the development experience is transformed - save a file and the binary is ready. The wrapper ensures you're always running fresh code, and build failures are detected and communicated clearly.

The best part? It's completely transparent. Whether you're a human developer or an AI agent, you just use the wrapper script and everything works. Agents can focus on writing code, not managing builds.

## Try It Yourself

Want to add Poltergeist to your project? It's now easier than ever:

```bash
# Install globally
npm install -g @steipete/poltergeist

# In your project directory
poltergeist init

# Edit poltergeist.config.json to match your project

# Start watching
poltergeist haunt
```

Check out the [GitHub repository](https://github.com/steipete/poltergeist) for more examples and documentation. The ghost is very friendly to all languages and build systems!

## What's Next?

Poltergeist has evolved into a sophisticated build automation system, but there's always more to explore:

**Recently Added**:
- ✅ **Universal Target System** - Support for unlimited targets of any type
- ✅ **Intelligent Build Prioritization** - Focus detection and smart scheduling
- ✅ **Advanced State Management** - Lock-free atomic operations
- ✅ **Performance Optimization** - Smart exclusions and configurable profiles
- ✅ **Cross-Platform Support** - macOS, Linux, Windows compatibility

**Future Ideas**:
- **Build Analytics** - Detailed performance metrics and optimization insights
- **Cloud Build Integration** - Remote build execution for heavy tasks
- **Team Synchronization** - Shared build state across development teams
- **AI-Powered Optimization** - Machine learning for build pattern optimization
- **IDE Integrations** - Native plugins for VS Code, IntelliJ, Xcode

The project is MIT licensed and contributions are always welcome! Whether you want to add new target types, improve the priority engine, or optimize performance, there's plenty of room for collaboration.

Happy haunting! 👻

_Check out [Poltergeist on GitHub](https://github.com/steipete/poltergeist) or install it from [npm](https://www.npmjs.com/package/@steipete/poltergeist)._

<style>
  details {
    margin: 1.5em 0;
    padding: 1em;
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 8px;
  }
  
  details summary {
    cursor: pointer;
    font-weight: 600;
    color: var(--color-accent);
    margin-bottom: 1em;
  }
  
  details summary:hover {
    text-decoration: underline;
  }
  
  details[open] summary {
    margin-bottom: 1.5em;
  }
  
  details pre {
    overflow-x: auto;
  }
</style>