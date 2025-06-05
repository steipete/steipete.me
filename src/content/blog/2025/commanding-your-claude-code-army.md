---
title: "Commanding Your Claude Code Army"
pubDatetime: 2025-06-05T10:00:00+01:00
description: "How a simple terminal trick helps me manage multiple Claude Code instances without losing my mind (or my terminal tabs)"
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

I'll admit it - I've become a Claude Code power user. At any given moment, I have at least three instances running: one for writing blog posts, another fixing that "quick" bug that's now in hour three, and a third doing something I definitely forgot about. My terminal looks like a Claude Code convention.

The problem? [Ghostty](https://ghostty.org/) (yes, with two T's - it's my favorite terminal) only shows the process name in the title. When you have six tabs all saying "claude", finding the right one becomes a game of terminal roulette.

## The Problem: Too Many Claudes, Not Enough Context

Picture this: You're deep in flow, bouncing between Claude instances like a caffeinated pinball. You need the one working on your blog migration, but all your tabs just say "claude". You start clicking through them like you're hunting for that one browser tab playing audio.

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
    _set_title "$folder — Claude"
    
    # Run Claude with dangerous permissions
    "$HOME/.claude/local/claude" --dangerously-skip-permissions "$@"
    
    # Restore normal title
    _set_title "%~"
}

# Ensure directory path shows in title when at prompt
precmd() { 
    _set_title "%~" 
}
```

Now when I run `cly`, my terminal title changes from `~/Projects/blog` to `blog — Claude`. Revolutionary? No. Life-changing? Absolutely.

## Why Keep It Separate?

Creating a dedicated file for the Claude wrapper has several benefits:
- Keeps your main `.zshrc` clean and focused
- Makes it easy to share or disable the functionality
- Allows for more complex implementations without cluttering your config
- You can version control it separately if needed

The `cly` alias is short, memorable, and distinct from the standard `claude` command. Some folks use `cc`, but I like that `cly` is unambiguous and easy to type.

## Making It Even Better

Want to get fancy? Here are some variations you could add to your wrapper file:

```zsh
# Show just the folder name for cleaner titles
cly-short() {
    local folder=${PWD:t}
    _set_title "$folder — Claude"
    "$HOME/.claude/local/claude" --dangerously-skip-permissions "$@"
    _set_title "%~"
}

# Include git branch information
cly-git() {
    local folder=${PWD:t}
    local branch=$(git branch --show-current 2>/dev/null || echo "no-git")
    _set_title "$folder [$branch] — Claude"
    "$HOME/.claude/local/claude" --dangerously-skip-permissions "$@"
    _set_title "%~"
}

# Different contexts with emojis (if you're into that)
cly-blog() {
    _set_title "📝 ${PWD:t} — Claude"
    "$HOME/.claude/local/claude" --dangerously-skip-permissions "$@"
    _set_title "%~"
}
```

## The Payoff

This simple trick has saved me countless minutes of tab-hunting. When you're managing multiple AI assistants across different projects, being able to glance at your terminal tabs and instantly know which Claude is which is pure gold.

Plus, it makes screen sharing much less confusing. "Let me switch to the Claude working on the API" is much clearer than "hold on, wrong Claude... nope, not that one either..."

## Implementation

1. Add the source line to your `~/.zshrc`:
   ```zsh
   [ -f ~/.config/zsh/claude-wrapper.zsh ] && source ~/.config/zsh/claude-wrapper.zsh
   ```
2. Create `~/.config/zsh/claude-wrapper.zsh` with the wrapper code
3. Run `source ~/.zshrc` or restart your terminal
4. Type `cly` instead of `claude` and watch the magic happen
5. Never lose track of your Claude army again

It's a small quality-of-life improvement that makes a big difference when you're juggling multiple AI-powered terminal sessions. And honestly, if you're going to give an AI full system access, you might as well know which directory it's operating in.

Now if you'll excuse me, I need to check on my Claude instances. I think one of them is refactoring my entire codebase without asking. Again.