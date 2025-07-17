---
title: "VibeTunnel's first AI-anniversary"
description: "It's been one month since we released the first version of VibeTunnel, and since in the AI world time is so much faster, let's call it VibeTunnel's first anniversary!"
pubDatetime: 2025-07-16T20:00:00+01:00
heroImage: "/assets/img/2025/vibetunnel-first-anniversary/header.png"
tags: ["vibetunnel", "ai", "terminal", "tools"]
unlisted: false
---

It's been one month since we [released the first version of VibeTunnel](/posts/2025/vibetunnel-turn-any-browser-into-your-mac-terminal/) - let's call it VibeTunnel's first anniversary! 

VibeTunnel is an app that turns your web browser into a terminal for your Mac (or Linux), perfect for running agents like claude code or gemini from anywhere. Because these slot machines aren't addictive enough already!

> **TL;DR** – 2.8k commits, 147k LOC, Mac/Linux/npm releases, 1.0 coming late July. Agents + humans = 🚀

## Growth & Velocity

Let's start with some hard data. VibeTunnel has grown from **4,012 lines of code** in b1 to **147,226 lines** in b11 – that's a 37x increase in just one month! Through **2,842 commits** from 32 contributors, we've built something that might convince non-believers that large projects can indeed be built with agents.

| Release | Date | Total LOC | Tests | Mac | Web |
|---------|------|-----------|-------|-----|-----|
| beta.1 | Jun 17 | 4,012 | 0 | 0 | 4,012 |
| beta.3 | Jun 23 | 49,133 | 8,324 | 14,266 | 18,082 |
| beta.6 | Jul 3 | 106,263 | 27,890 | 20,305 | 61,554 |
| beta.10 | Jul 15 | 144,021 | 36,079 | 34,462 | 83,009 |
| beta.11 | Jul 16 | 147,226 | 37,430 | 34,959 | 83,894 |

The pace has been intense: **436 commits** in the explosive growth phase (beta.2 to beta.3) where we added Mac and iOS apps, averaging **126 commits per release**. Test coverage improved dramatically, and we even went full circle through Rust, Go, to Node as server backends, with plans to [bring Rust back](https://github.com/amantus-ai/vibetunnel/pull/297). And aren't languages really just implementation details, when you have agents?

## Memorable Milestones

### Terminal Title Management (b6)

My personal fav feature landed in b6: the `vt title` command. As a maniac who runs multiple Claudes in parallel, I needed a way to track what each agent is up to. [This feature](/posts/command-your-claude-code-army-reloaded/) lets you dynamically update session names from within the terminal, and then vt updates the title of your terminal window.

### The Node-pty Fork (b9)

We had to [fork Microsoft's node-pty](https://github.com/amantus-ai/vibetunnel/pull/304). Using VibeTunnel randomly caused crashes in VS Code - which should be completely unrelated. After some gnarly debugging, I found a thread-safety issue and some totally unnecessary socket code. Forked it and things are better now, eliminating the random crashes that were frustrating early adopters. Eventually though that code will be burned and replaced with Rust.

### Repository Discovery (b10)

Once the core features were stable, I could focus more on the Mac side. The new [session picker automatically scans your project folder](https://github.com/amantus-ai/vibetunnel/pull/274) and shows your git repos. Small feature, but so convenient - saving developers 10-20 seconds per session start!

## Key Lessons

### Agents Need Railguards

In the beginning we've been vibing this project pretty hard and just pushed to main, full chaos mode. It worked quite well, but as the project grew, structure is needed. We started adding tests once we felt the pain of things breaking all the time, and there's still work to do to increase test coverage. Tests are even more important with agents, since you can't trust them. They'll eventually break stuff and prompt that everything's great and ready to ship.

### Agents Need Thinking

I approach almost every new feature with a prompt that includes an issue, plenty of brabble from me in how I think that feature should be tackled, and then I add "ultrathink, make a plan first and give me at least 3 options". Then either I pick one of the options or add more info to further refine the plan, before agents do anything. This is much more effective than just letting them run loose without a plan - as they'll usually pick the simplest one, with the most technical debt.

### Pathfinder Principle

I prefer opportunistic refactoring - fixing related issues while you're in the code anyway. [Consider this PR](https://github.com/amantus-ai/vibetunnel/pull/345): I could have merged the bandaid fix, but then opted to not only fix the root issue, but completely overhaul how messages are sent in the unix socket.

### Community Building Is Hard

Key lesson: Even "good first issues" can hide complexity. [This PR](https://github.com/amantus-ai/vibetunnel/pull/298) fixed keyboard capture on macOS, but broke it elsewhere. The real fix took days of research across all platforms. Now we have ["good first issues"](https://github.com/amantus-ai/vibetunnel/issues?q=sort%3Aupdated-desc%20is%3Aissue%20is%3Aopen%20label%3A%22good%20first%20issue%22) that are actually good first issues, and a [Discord](https://discord.gg/3Ub3EUwrcR) to coordinate the vibing.

### It's Not Just Code

Agents help with code, but product management, support, and documentation still need human touch - people want to read my voice, not just my intent.

## Thank You!

VibeTunnel wouldn't be where it is today without our amazing contributors:

**Core Team**: [Mario Zechner](https://github.com/badlogic) (291 commits) and [Armin Ronacher](https://github.com/mitsuhiko) (132 commits) who helped build the foundation and shaped the architecture.

**Major Contributors**: [Manuel Maly](https://github.com/manuelmaly) (72), [Helmut Januschka](https://github.com/hjanuschka) (55), and [Jeff Hurray](https://github.com/jhurray) (36) for their significant contributions.

**Community Heroes**: Billy Irwin, Igor Tarasenko, David, Thomas Ricouard, Piotr, hewigovens, Clay Warren, Chris Reynolds, Madhava Jay, Michi Hoffmann, Raghav Sethi, Tao Xu, Devesh Shetty, Jan Remeš, Luis Nell, Luke, Marek Šuppa, Sandeep Aggarwal, Zhiqiang Zhou, and noppe - every contribution matters!

**Our Robot Overlords**: Claude, Cursor, and Devin - in all honesty tho, it's 98% Claude 🤖.

Whether you fixed a typo, squashed a bug, or built entire features - thank you for vibing with us! 🚀

## Looking Forward

We just shipped beta 11 and a standalone npm with Linux support and the bug list is slowing down. 1.0 ships end of July, followed by the iOS app and some wild ideas in the pipeline: Agent Mode, Apple Watch app, voice mode. The future of terminal access is bright!

Oh, and one more thing - we're creating a VibeTunnel organization! As the project grows beyond its scrappy startup phase, we'll be moving the repository to its own org. This will help us better manage the ecosystem of tools, plugins, and integrations that are starting to emerge around VibeTunnel.

Since agents can't eat cake, I made them a different present: VibeTunnel is now on [vt.sh](https://vt.sh)! If you haven't tried it yet, now's the perfect time - [download the Mac app](https://github.com/amantus-ai/vibetunnel/releases) and post a picture on Twitter of the weirdest place you're vibin'!
