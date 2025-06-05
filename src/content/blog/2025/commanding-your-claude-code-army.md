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

Here's my secret weapon - a simple ZSH function that transforms my chaotic terminal into an organized command center:

```zsh
# Function to set custom window title
set_window_title() {
    print -Pn "\e]0;$1\a"
}

# Claude wrapper function - "Surprise Me" edition
surprise-me() {
    # Set window title to show path and Claude Code
    set_window_title "%~ — Claude Code"
    
    # Run Claude with dangerous permissions (because I trust it... mostly)
    claude --dangerously-skip-permissions "$@"
    
    # Reset title back to just the path when done
    set_window_title "%~"
}
```

Now when I run `surprise-me`, my terminal title changes from `~/Projects/blog` to `~/Projects/blog — Claude Code`. Revolutionary? No. Life-changing? Absolutely.

## Why "Surprise Me"?

You might wonder about the alias name. When you're giving an AI full system access, every command is a little surprise. Will it elegantly solve your problem? Will it decide to reorganize your entire filesystem? The suspense is half the fun!

(In practice, Claude has been remarkably well-behaved. But the name keeps me honest about what I'm doing.)

## Making It Even Better

Want to get fancy? Here are some variations I use:

```zsh
# Different aliases for different contexts
blog-claude() {
    set_window_title "%~ — Claude (Blog)"
    claude --dangerously-skip-permissions "$@"
    set_window_title "%~"
}

code-claude() {
    set_window_title "%~ — Claude (Code)"
    claude --dangerously-skip-permissions "$@"
    set_window_title "%~"
}

# My favorite: shows the current git branch too
git-claude() {
    local branch=$(git branch --show-current 2>/dev/null || echo "no-git")
    set_window_title "%~ [$branch] — Claude Code"
    claude --dangerously-skip-permissions "$@"
    set_window_title "%~"
}
```

## The Payoff

This simple trick has saved me countless minutes of tab-hunting. When you're managing multiple AI assistants across different projects, being able to glance at your terminal tabs and instantly know which Claude is which is pure gold.

Plus, it makes screen sharing much less confusing. "Let me switch to the Claude working on the API" is much clearer than "hold on, wrong Claude... nope, not that one either..."

## Implementation

1. Add the function to your `~/.zshrc`
2. Run `source ~/.zshrc` or restart your terminal
3. Type `surprise-me` instead of `claude` and watch the magic happen
4. Never lose track of your Claude army again

It's a small quality-of-life improvement that makes a big difference when you're juggling multiple AI-powered terminal sessions. And honestly, if you're going to give an AI full system access, you might as well know which directory it's operating in.

Now if you'll excuse me, I need to check on my Claude instances. I think one of them is refactoring my entire codebase without asking. Again.