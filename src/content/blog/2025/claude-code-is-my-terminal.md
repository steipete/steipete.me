---
title: "Claude Code is My Terminal"
pubDatetime: 2025-06-03T09:00:00+01:00
description: "I run Claude Code with --dangerously-skip-permissions flag, giving it full system access. Let me show you a new way of approaching terminals."
heroImage: /assets/img/2025/claude-code-is-my-terminal/hero.png
heroImageAlt: "Claude Code terminal interface with stylized head and brain icon representing AI-powered command line"
tags:
  - AI
  - Claude
  - Terminal
  - Development
  - Productivity
  - Claude-Code
  - DevOps
  - Automation
---

**TL;DR**: I run Claude Code in no-prompt mode; it saves me an hour a day and hasn't broken my Mac in two months. The $200/month [Max plan](/posts/2025/stop-overthinking-ai-subscriptions/) pays for itself.

For the past two months, I've been living dangerously. I launch [Claude Code](https://claude.ai/code) ([released in late February](https://www.anthropic.com/news/claude-3-7-sonnet)) with `--dangerously-skip-permissions`, the flag that bypasses all permission prompts. According to [Anthropic's docs](https://docs.anthropic.com/en/docs/claude-code), this is meant "only for Docker containers with no internet", yet it runs perfectly on regular macOS.

Yes, a rogue prompt could theoretically nuke my system. That's why I keep hourly [Arq](https://www.arqbackup.com/) snapshots (plus a [SuperDuper!](https://www.shirt-pocket.com/SuperDuper/SuperDuperDescription.html) clone), but after two months I've had zero incidents.

## From 'AI terminal' to everything terminal

When I first installed Claude Code, I thought I was getting a smarter command line for coding tasks. What I actually got was a universal computer interface that happens to run in a terminal. The mental shift took a few weeks, but once it clicked, I realized Claude can literally do anything I ask on my computer.

The breakthrough moment came when I was migrating to a new Mac. Instead of doing the usual restore dance, I pointed Claude at my backup disk and said:

"Restore this Mac from my backup disk—start with dotfiles, then system preferences, CLI tools, and restore Homebrew formulae and global npm packages."

Claude drafts a migration plan, executes it step by step, and has my new machine ready in under an hour. No overnight clone, no cruft from old apps I'd forgotten about. Just a clean, curated setup.[^1]

## The economics of 'unlimited'

I'm on Anthropic's [Max 20× plan](/posts/2025/stop-overthinking-ai-subscriptions/) at $200/month. Compared to my old workflow of context-switching between terminal, documentation, and Stack Overflow, I'm easily saving an hour per day. At contractor rates, the subscription pays for itself in about four hours of reclaimed time per month.

## What I actually use it for

My daily Claude Code usage falls into several main outcomes:

**Ship Code**: I haven't typed `git commit -m` in weeks. Instead, I say "commit everything in logical chunks" and Claude handles the entire flow—staging changes, writing meaningful commit messages, pushing, opening PRs, watching CI, and fixing any CI failures. When builds break, it analyzes the errors and patches them automatically. It's also extremely good at resolving merge conflicts.

**Clean the OS**: "Hide recent apps in the Dock" becomes a single natural language command instead of Googling for the right `defaults write` incantation. Claude knows macOS internals and happily calls `killall Dock` to restart the Dock after modifying the plist. Downloads folder cleanup, toggling dark mode, and system preference tweaks all happen through natural language.

**Automate Content**: Like this very post. I use [Wispr Flow](https://wisprflow.ai/) to talk with Claude, explain the topic and tell it to read my past blog posts to write in my style. Instead of wrestling with Markdown formatting, Claude creates the document, helps formulate thoughts, and tests that everything displays correctly.

**Spin Up New Machines**: Recently for [CodeLooper](https://www.codelooper.app/) code signing and notarization setup, Claude handled installing Homebrew packages, creating private keys, adding them to the keychain, creating backups, building the project, uploading to GitHub, running tests, and monitoring the process. The only manual part was clicking through the update UI, but with my [macOS Automator MCP Server](https://github.com/steipete/macos-automator-mcp), I could probably teach it that too.

The pattern is clear: if the task touches git, the filesystem, system preferences, or CI, I've probably already thrown it at Claude Code and moved on to the fun stuff.

## The setup I actually run

```bash
npm install -g @anthropic-ai/claude-code
claude login
alias cc="claude --dangerously-skip-permissions"
```

That's it. Three lines to completely transform how you interact with your computer.

The alias means I just type `cc` and I'm in.

> **How to turn this on safely**: Start with hourly backups (I use [Arq](https://www.arqbackup.com/)), try it without the `--dangerously-skip-permissions` flag first to understand its patterns, and consider testing on a secondary machine if you're nervous. That said, it saves me an hour a day and hasn't broken my Mac in two months. Once you experience the flow state of conversational computing, you won't want to go back.

## Why this works (and when it doesn't)

Claude Code shines because it was built terminal-first, not bolted onto an IDE as an afterthought. The agent has full access to my filesystem (if you are bold enough...), can execute commands, read output, and iterate based on results.

Anthropic's [best practices guide](https://www.anthropic.com/engineering/claude-code-best-practices) recommends keeping a `CLAUDE.md` file at your repo root with project-specific context. I've adopted this pattern and noticed Claude asks fewer clarifying questions and writes more accurate code. Little optimizations like this compound quickly.

The main limitation is response time. Claude's thinking process takes a few seconds, and for rapid-fire debugging sessions, I sometimes reach for traditional tools. However, you can prefix commands with `!` to run them directly without waiting for token evaluation—Claude will execute your command either way, but this is faster when you know exactly what you're calling. For exploratory work where I'm not sure what I need, Claude's reasoning ability more than compensates for the brief pause.

## Why Warp lacks

[Warp's](https://www.warp.dev/) mission is to "reinvent the terminal with AI". They've built beautiful GPU-accelerated panels and smart autocomplete. It's genuinely impressive engineering.

The fundamental difference comes down to trust and execution flow. Claude operates purely through text and is remarkably intelligent about understanding context and intent. With the `--dangerously-skip-permissions` flag, I can pre-authorize Claude to execute commands without constant confirmation prompts. Warp, while excellent, requires individual approval for each command—there's no equivalent to Claude's "dangerous mode" where you can grant blanket execution trust. This means Claude maintains conversational flow while Warp still interrupts with permission requests.

I signed up for Warp because I like their mission and I hope they eventually go where Claude is. But it seems they have a fundamentally different idea about safety. Also, [Ghostty](https://ghostty.org/) is just the better terminal, native, not Electron-based and faster.

## A few days ago, it blew my mind again

I was procrastinating on cleaning up my blog migration—~40 posts from Jekyll that needed conversion to MDX format, updated frontmatter, fixed image paths, the works. Classic tedious grunt work that would eat a weekend.

On a whim, I pointed Claude at the git repo and said: "Convert all posts into the new format here. Make sure to copy over the images and preserve the redirects."

Twenty minutes later, Claude had processed every single post, set up proper redirects, validated all image paths, and pushed a merge-ready branch. The git log showed 400+ commits of methodical fixes. I reviewed a few random posts, merged, and my blog was migrated.

That's when it really hit me: we're not talking about a smart terminal or an AI coding assistant. Claude Code is closer to having a brilliant worker bee who happens to live in your terminal and work at mostly superhuman speed.

<img src="/assets/img/2025/claude-code-is-my-terminal/claude-code-screenshot.png" alt="Claude Code terminal screenshot" style="border: none; box-shadow: none;" />

*Meta: Claude Code helping me write this blog post*

## Where this is heading

We're in the very early days of AI-native development tools. Claude Code represents a paradigm shift: from terminals that help you run commands to terminals that understand intent and take action. I'm not just typing commands faster—I'm operating at a fundamentally higher level of abstraction. Instead of thinking "I need to write a bash script to process these files, chmod it, test it, debug it," I think "organize these files by date and compress anything older than 30 days." This isn't about AI replacing developers—it's about developers becoming orchestrators of incredibly powerful systems. The skill ceiling rises: syntax fades, system thinking shines.

## Should you try this?

If you're comfortable with calculated risks and have solid backups, absolutely. The learning curve is essentially zero—you just start talking to your computer like it's a competent colleague. Within days, you'll wonder how you ever worked without it.

Your terminal isn't just a terminal anymore. It's Claude. And Claude is absurdly capable.

---

[^1]: Note that full backup migrations can sometimes cause [various system issues](https://discussions.apple.com/thread/255759421) with newer macOS versions.

Got a crazier Claude workflow? Ping me [@steipete](https://twitter.com/steipete).