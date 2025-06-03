---
title: "Claude Code is My Terminal"
pubDatetime: 2025-06-03T09:00:00+01:00
description: "I run Claude Code with --dangerously-skip-permissions flag, giving it full system access. After two months, here's why it's replaced iTerm as my daily driver."
tags:
  - AI
  - Claude
  - Terminal
  - Development
  - Productivity
  - Claude-Code
---

For the past two months, I've been living dangerously. I launch Claude Code with `--dangerously-skip-permissions`—the flag that bypasses all permission prompts. According to [Anthropic's docs](https://docs.anthropic.com/en/docs/claude-code), this is meant "only for Docker containers with no internet", yet it runs perfectly on bare-metal macOS.

Yes, a rogue prompt could theoretically nuke my system. That's why I keep hourly [Arq](https://www.arqbackup.com/) snapshots humming in the background. But after 60+ days of full root access, I've had exactly zero incidents. The productivity gains? Absolutely worth the calculated risk.

## From "AI Terminal" to Everything Terminal

When I first installed Claude Code, I thought I was getting a smarter command line for coding tasks. What I actually got was a universal computer interface that happens to run in a terminal. The mental shift took a few days, but once it clicked, I realized Claude can literally do anything I ask on my computer.

The breakthrough moment came when I was migrating to a new Mac. Instead of doing the usual Time Machine restore dance, I pointed Claude at my backup disk and said:

"Restore this Mac from my Time Machine disk—start with dotfiles, then system preferences, CLI tools, and copy only the apps I actually used last month."

Claude drafted a migration plan, executed it step by step, and had my new machine ready in under an hour. No overnight clone, no cruft from old apps I'd forgotten about. Just a clean, curated setup.

## What I Actually Use It For

My daily Claude Code usage has evolved far beyond typical terminal tasks. Here's what a normal day looks like:

**Git on autopilot**: I haven't typed `git add -p` in weeks. Instead, I say "ship today's invoice fixes" and Claude handles the entire flow—staging changes, writing meaningful commit messages, pushing, opening PRs, watching CI, and patching any lint failures. If tests fail, it reads the output and fixes the issues before repushing.

**System administration**: "Hide recent apps in the Dock" becomes a single natural language command instead of Googling for the right `defaults write` incantation. Claude knows macOS internals better than I ever will.

**Desktop hygiene**: My Downloads folder used to be a graveyard of DMGs and random PDFs. Now I periodically ask Claude to "tidy Downloads—archive PDFs by month, delete DMGs older than a week, move screenshots to Screenshots folder." It handles the filesystem operations and my desktop stays civilized.

**Deep system tweaks**: Last week I asked it to modify how my Mac handles external displays. Claude dove into display configuration plists, adjusted HIDPI settings, and even created a launch daemon to apply my preferences on boot. Changes that would have taken me hours of research happened in minutes.

## The Economics of "Unlimited"

I'm on Anthropic's [Max 20× plan](https://support.anthropic.com/en/articles/11174108-about-the-development-partner-program) at $200/month. That gives me roughly 900 messages per 5-hour window—essentially unlimited for single-developer use. The sessions refresh on a rolling basis, so I kick off a small task around 16:55 and get a fresh quota block just in time for evening work.

Compared to my old workflow of context-switching between terminal, documentation, and Stack Overflow, I'm easily saving an hour per day. At contractor rates, the subscription pays for itself in about four hours of reclaimed time per month.

## Why This Works (And When It Doesn't)

Claude Code shines because it was built terminal-first, not bolted onto an IDE as an afterthought. The agent has full access to my filesystem, can execute commands, read output, and iterate based on results. When combined with the massive context window, it can hold entire codebases in memory while reasoning about changes.

Anthropic's [best practices guide](https://www.anthropic.com/engineering/claude-code-best-practices) recommends keeping a `CLAUDE.md` file at your repo root with project-specific context. I've adopted this pattern and noticed Claude asks fewer clarifying questions and writes more accurate code. Little optimizations like this compound quickly.

The main limitation? Network latency. When Claude needs to process large amounts of output or reason through complex problems, there's a noticeable pause. For time-sensitive debugging sessions, I still reach for traditional tools. But for everything else—especially exploratory work where I'm not sure exactly what I need—Claude's reasoning ability more than compensates for the occasional wait.

## Warp vs Claude Code: Why I Switched

[Warp's](https://www.warp.dev/) mission is to "reinvent the terminal with AI". They've built beautiful GPU-accelerated panels, smart autocomplete, and collaborative features. It's genuinely impressive engineering.

But Claude Code made their entire value proposition obsolete overnight. Why settle for AI suggestions in a sidebar when the AI can just... do the work? I kept Warp installed for exactly two use cases: long flights (offline mode) and massive CSV previews (GPU acceleration). Haven't launched it in three weeks.

## The Setup I Actually Run

```bash
brew install claude-code
claude-code login                                    # browser OIDC auth
claude-code config set auto_accept true              # skip prompts
alias cc="claude-code --dangerously-skip-permissions"
```

That's it. Four lines to completely transform how you interact with your computer.

I also wrote a small LaunchAgent that starts Claude Code in the background at login, so it's always ready. The alias means I just type `cc` and I'm in.

## A Few Days Ago, It Blew My Mind Again

I was procrastinating on cleaning up my blog migration—142 posts from Jekyll that needed conversion to MDX format, updated frontmatter, fixed image paths, the works. Classic tedious grunt work that would eat a weekend.

On a whim, I pointed Claude at the git repo and said: "Convert every post to the new Markdown-MDX hybrid, regenerate all metadata, fix broken image references, preserve redirects, and ship me a clean PR."

Three hours later, while I was in meetings, Claude had processed every single post, set up proper redirects, validated all image paths, and pushed a merge-ready branch. The git log showed 400+ commits of methodical fixes. I reviewed a few random posts, merged, and my blog was migrated.

That's when it really hit me: we're not talking about a smart terminal or an AI coding assistant. Claude Code is closer to having a brilliant, tireless junior developer who happens to live in your terminal and work at superhuman speed.

## The Trust Factor

Giving an AI root access to your system requires a fundamental shift in how you think about trust and safety. My approach:

1. **Hourly backups are non-negotiable**. Arq to both local and cloud storage.
2. **Start with a test machine** if you're nervous. I ran Claude on a spare Mac mini for two weeks before trusting it with my main development machine.
3. **Watch what it does initially**. Claude shows you commands before executing them (unless you enable auto-accept). Spend a few days understanding its patterns.
4. **Set boundaries in CLAUDE.md**. I explicitly tell Claude which directories to never modify and which system settings are off-limits.

After two months, my trust is earned. Claude has saved me countless hours without a single destructive mistake. The productivity gains are so significant that going back to a traditional terminal feels like coding with one hand tied behind my back.

## Where This is Heading

We're in the very early days of AI-native development tools. Claude Code represents a paradigm shift: from terminals that help you run commands to terminals that understand intent and take action. The implications are staggering.

I'm not just typing commands faster—I'm operating at a fundamentally higher level of abstraction. Instead of thinking "I need to write a bash script to process these files, chmod it, test it, debug it," I think "organize these files by date and compress anything older than 30 days." The implementation details become Claude's problem.

This isn't about AI replacing developers. It's about developers becoming orchestrators of incredibly powerful systems. The skill ceiling hasn't lowered—it's risen dramatically. The developers who thrive will be those who learn to think in terms of systems and outcomes rather than syntax and implementation.

## Should You Try This?

If you're comfortable with calculated risks and have solid backups, absolutely. The learning curve is essentially zero—you just start talking to your computer like it's a competent colleague. Within days, you'll wonder how you ever worked without it.

Start small. Don't immediately hand over root access. Use the standard permission mode, get comfortable with Claude's capabilities, then gradually expand what you're willing to delegate. But once you experience the flow state of conversational computing, you won't want to go back.

Your terminal isn't just a terminal anymore. It's Claude. And Claude is absurdly capable.

---

*What's your Claude Code workflow? Find me on Twitter [@steipete](https://twitter.com/steipete) with your favorite automation wins.*