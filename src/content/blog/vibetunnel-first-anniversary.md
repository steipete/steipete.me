---
title: "VibeTunnel's first AI-anniversary"
description: "It's been one month since we released the first version of VibeTunnel, and since in the AI world time is so much faster, let's call it VibeTunnel's first anniversary. I wanted to give an update on the project and share some of the bits that I've learned."
pubDatetime: 2025-07-15T10:00:00+01:00
tags: ["vibetunnel", "ai", "terminal", "tools"]
---

It's been one month since we released the first version of VibeTunnel, and since in the AI world time is so much faster, let's call it VibeTunnel's first anniversary. I wanted to give an update on the project and share some of the bits that I've learned.

## The Numbers

Let's start with some hard data. VibeTunnel has grown from **4,012 lines of code** in beta.1 to **144,021 lines** in beta.10 – that's a 36x increase in just one month! Here's how the codebase evolved:

| Release | Date | Total LOC | Code | Tests | Mac | Web | iOS |
|---------|------|-----------|------|-------|-----|-----|-----|
| beta.1 | Jun 17 | 4,012 | 4,012 | 0 | 0 | 4,012 | 0 |
| beta.2 | Jun 19 | 11,673 | 9,562 | 2,111 | 0 | 11,673 | 0 |
| beta.3 | Jun 23 | 49,133 | 40,809 | 8,324 | 14,266 | 18,082 | 16,785 |
| beta.4 | Jun 27 | 80,247 | 61,695 | 18,552 | 14,700 | 41,432 | 24,115 |
| beta.5 | Jun 30 | 91,428 | 68,300 | 23,128 | 15,234 | 52,042 | 24,152 |
| beta.6 | Jul 3 | 106,263 | 78,373 | 27,890 | 20,305 | 61,554 | 24,404 |
| beta.7 | Jul 8 | 133,202 | 99,151 | 34,051 | 30,765 | 75,887 | 26,550 |
| beta.8 | Jul 8 | 133,239 | 99,188 | 34,051 | 30,765 | 75,924 | 26,550 |
| beta.9 | Jul 11 | 138,584 | 103,586 | 34,998 | 32,660 | 79,374 | 26,550 |
| beta.10 | Jul 15 | 144,021 | 107,942 | 36,079 | 34,462 | 83,009 | 26,550 |

What's fascinating is the test coverage – we've maintained a healthy **33% test-to-code ratio** throughout the rapid development. The web component saw the most growth (4.6x), while the Mac app doubled in size. The iOS app stabilized after beta.7, focusing on refinement rather than new features.

## Development Velocity

The pace has been intense:
- **553 commits** across 10 beta releases
- **282 commits** in the first major sprint (beta.3 to beta.4)
- An average of **55 commits per release**
- **10 contributors** with Peter Steinberger leading at 406 commits

The most active period was the initial sprint where we added fundamental features like web-based file editing, terminal recording, and the foundation for cross-platform support.

## Key Technical Milestones

### The Node-pty Fork (Beta.9)

One of the most critical decisions was forking Microsoft's node-pty. We were experiencing random crashes that also affected VS Code and other Electron apps. After deep debugging, we identified thread-safety issues and created our own fork with proper resource management. This single change dramatically improved stability.

### Unified Control Protocol (Beta.7)

We redesigned the communication between the Mac app and web frontend, creating a unified control protocol that handles screen recording permissions, terminal management, and system controls. This architectural change enabled features like deferred permission requests and better error handling.

### Repository Discovery (Beta.10)

The latest release added intelligent Git repository discovery – when creating a new session, VibeTunnel now automatically finds and suggests your recently modified projects. It's a small feature that makes a big difference in daily workflow.

## Platform Evolution

### Web-First Architecture

The web component grew the fastest because it's the heart of VibeTunnel's cross-platform strategy. Every feature starts in the web interface, then gets platform-specific enhancements. This approach let us ship iOS support in record time.

### Mobile Experience

We learned that mobile isn't just "desktop but smaller." We had to:
- Fix resize loops that made terminals unusable on phones
- Create touch-optimized keyboard layouts
- Add mobile-specific shortcuts (Alt+Delete/Left/Right)
- Solve Safari's clipboard API quirks

### Native Integration

The Mac app evolved from a simple web wrapper to a sophisticated native companion:
- AppleScript integration for terminal launching
- Bonjour discovery for local network connections
- Native file pickers with Git awareness
- System-level keyboard shortcut handling

## Lessons Learned

### 1. Tests Are Your Safety Net

With such rapid development, our test suite saved us countless times. The 36,000 lines of tests might seem excessive, but they allowed us to refactor fearlessly. When we switched to the unified control protocol, tests caught edge cases we'd never have found manually.

### 2. User Feedback Drives Priority

The keyboard shortcut system in beta.10 came directly from user frustration. People wanted Cmd+1-9 for tab switching, but we were capturing all keyboard input. The solution – intelligent priority handling with visual indicators – took several iterations but was worth it.

### 3. Performance Isn't Optional

We added compression, caching, and lazy loading throughout the stack. A remote development tool that feels sluggish is useless, no matter how many features it has. Every millisecond counts when you're typing in a terminal.

### 4. Platform Quirks Are Real

Safari's clipboard API works differently than Chrome's. iOS has unique touch event handling. Fish shell needs special expansion syntax. These aren't bugs – they're the reality of cross-platform development. Embrace them.

## What's Next?

Looking at the commit history, I see we're already working on:
- Unified project folder management
- Enhanced Swift testing with better diagnostics
- Linux authentication support
- Even better mobile experience

The community has been incredible. Special thanks to Mario Zechner, Armin Ronacher, Jeff Hurray, and everyone who contributed code, filed issues, or just shared encouragement.

## The AI Connection

Why call it an "AI-anniversary"? Because in the AI world, development cycles are compressed. What used to take months now happens in weeks. VibeTunnel itself is built for this new pace – it's a tool designed for AI-assisted development where you need rock-solid remote access to manage your AI coding sessions.

In one month, we've built what would traditionally be a year's worth of features. That's the new normal in the AI era, and VibeTunnel is here to help you keep up.

Here's to the next month – may it be just as exciting! 🚀