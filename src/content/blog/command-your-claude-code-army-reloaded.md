---
title: 'Command your Claude Code Army, Reloaded'
description: 'Enhance your Claude Code workflow with VibeTunnel terminal title management for better multi-session tracking'
pubDatetime: 2025-07-03T16:30:00+01:00
tags: ["ai", "claude", "productivity", "vibetunnel", "terminal"]
---

Managing multiple Claude Code sessions just got a whole lot easier. With [VibeTunnel](https://github.com/amantus-ai/vibetunnel)'s new terminal title management feature, you can now see at a glance what each Claude instance is working on across your projects.

![VibeTunnel showing multiple Claude sessions with descriptive titles](/assets/img/2025/command-your-claude-code-army-reloaded/vibetunnel.png)

The screenshot above shows the power of this feature: each Claude session displays exactly what it's working on - from "Searching for OpenAI Swift dependencies" to "Testing AI analysis functionality" to "Implementing Git repository monitoring". No more guessing which terminal is doing what!

## VibeTunnel Terminal Title Management

When working in VibeTunnel sessions, actively use the `vt title` command to communicate your current actions and progress:

### Usage
```bash
vt title "Current action - project context"
```

### Guidelines
- **Update frequently**: Set the title whenever you start a new task, change focus, or make significant progress
- **Be descriptive**: Use the title to explain what you're currently doing (e.g., "Analyzing test failures", "Refactoring auth module", "Writing documentation")
- **Include context**: Add PR numbers, file names, or feature names when relevant
- **Think of it as a status indicator**: The title helps users understand what you're working on at a glance
- If `vt` command fails (only works inside VibeTunnel), simply ignore the error and continue

### Examples
```bash
# When starting a task
vt title "Setting up Git app integration"

# When debugging
vt title "Debugging CI failures - playwright tests"

# When working on a PR
vt title "Implementing unique session names - github.com/amantus-ai/vibetunnel/pull/456"

# When analyzing code
vt title "Analyzing session-manager.ts for race conditions"

# When writing tests
vt title "Adding tests for GitAppLauncher"
```

### When to Update
- At the start of each new task or subtask
- When switching between different files or modules
- When changing from coding to testing/debugging
- When waiting for long-running operations (builds, tests)
- Whenever the user might wonder "what is Claude doing right now?"

This helps users track your progress across multiple VibeTunnel sessions and understand your current focus.

## Implementation

To enable this feature in your Claude Code setup, add the configuration to your global Claude rules. Check out the [full gist](https://gist.github.com/steipete/c297c84e1684c330b3325825d835da03) for the complete implementation.

By keeping your terminal titles updated, you can effectively manage your "Claude Code Army" - running multiple AI assistants in parallel across different projects while maintaining clear visibility into what each one is doing.