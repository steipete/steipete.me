---
title: "Commanding Your Claude Code Army"
pubDatetime: 2025-06-05T10:00:00+01:00
description: "How a simple terminal trick helps me manage multiple Claude Code instances without losing my mind (or my terminal tabs)"
heroImage: /assets/img/2025/commanding-your-claude-code-army/header.png
heroImageAlt: "Terminal window showing Claude Code with current directory in the title bar"
tags:
  - AI
  - Claude
  - Development
  - Terminal
  - Productivity
  - Claude-Code
  - DevOps
---

**TL;DR**: Running multiple Claude Code instances? Here's a ZSH trick to keep your terminal titles organized and your sanity intact.

I'll admit it - I've become a [Claude Code](https://www.anthropic.com/claude-code) power user. At any given moment, I have at least three instances running: one for writing blog posts, another fixing that "quick" bug that's now in hour three, and a third doing something I definitely forgot about. My terminal looks like a Claude Code convention.

## The Problem: Too Many Claudes, Not Enough Context

[Ghostty](https://ghostty.org/) (yes, with two T's - it's my favorite terminal) only shows the process name in the title. When you have six tabs all saying "claude", finding the right one becomes a game of terminal roulette.

This is especially painful when you're running Claude with the `--dangerously-skip-permissions` flag (yes, I live dangerously - see my post about [Claude Code being my computer](/posts/2025/claude-code-is-my-computer/)). The last thing you want is to accidentally run the wrong command in the wrong directory with full system permissions.

## The Solution: Terminal Title Magic

Here's my approach - a clean ZSH setup that keeps terminal management code separate from my main configuration. First, I add one line to my `~/.zshrc`:

```zsh
# Source Claude wrapper with dynamic terminal title
[ -f ~/.config/zsh/claude-wrapper.zsh ] && source ~/.config/zsh/claude-wrapper.zsh
```

Then I create `~/.config/zsh/claude-wrapper.zsh` with the actual implementation:

```zsh
#!/usr/bin/env zsh
# Simple, elegant terminal title management for Claude

# Set terminal title
_set_title() { 
    print -Pn "\e]2;$1\a" 
}

# Claude wrapper with custom terminal title
cly() {
    local folder=${PWD:t}  # Just the current folder name
    # Set title to show we're running Claude
    _set_title "📁 $folder — Claude"
    # Run Claude with dangerous permissions
    "$HOME/.claude/local/claude" --dangerously-skip-permissions "$@"
    # Restore normal title
    _set_title "%~"
}

# Update terminal title before each prompt (using proper ZSH hooks)
_claude_precmd() {
    _set_title "%~"
}

# Add our precmd function to the array (doesn't overwrite existing hooks)
if [[ -z ${precmd_functions[(r)_claude_precmd]} ]]; then
    precmd_functions+=(_claude_precmd)
fi
```

When I run `cly`, my terminal title changes from `~/Projects/blog` to `📁 blog — Claude`. Revolutionary? No. Life-changing? Absolutely.

> *Hot tip: Just ask Claude to read this blog post and set it up for you! (in yolo mode, of course)*

Now if you'll excuse me, I need to check on my Claude instances. I think one of them is refactoring my entire codebase without asking. Again.