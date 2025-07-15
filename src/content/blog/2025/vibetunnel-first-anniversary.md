---
title: "VibeTunnel's first AI-anniversary"
description: "It's been one month since we released the first version of VibeTunnel, and since in the AI world time is so much faster, let's call it VibeTunnel's first anniversary!"
pubDatetime: 2025-07-15T10:00:00+01:00
heroImage: "/assets/img/2025/vibetunnel-first-anniversary/header.png"
tags: ["vibetunnel", "ai", "terminal", "tools"]
draft: true
---

It's been one month since we [released the first version of VibeTunnel](/posts/2025/vibetunnel-turn-any-browser-into-your-mac-terminal/), and since AI time runs so much faster, let's call it VibeTunnel's first anniversary! 

For those just joining in: VibeTunnel is an app that turns your web browser into a terminal for your Mac (or Linux), perfect for running agents like claude code or gemini from anywhere. Because these slot machines aren't additive enough already!

Now, let's review what happened in a ~~year~~ month.

## The Numbers

Let's start with some hard data. VibeTunnel has grown from **4,012 lines of code** in b1 to **144,021 lines** in b10 – that's a 36x increase in just one month! Does that count now as a big project, will it convince some non-believers that large projects can't be built with agents?

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

The iOS app is still a work-in-progress, and test coverage certainly could be higher, but dare I say, we definitely improved code quality over time.

We also went through Rust, go, to Node as server backends, but are planning to [replace parts with Rust again](https://github.com/amantus-ai/vibetunnel/pull/297), to decrease memory overhead. Gotta go full circle! And aren't languages really just implementation details, when you have agents?

## Development Velocity

The pace has been intense:
- **1,264 commits** across 10 beta releases (beta.1 to beta.10)
- **436 commits** in the explosive growth phase (beta.2 to beta.3) where we added Mac and (totally vibed) iOS apps
- **275 commits** in just two days (beta.1 to beta.2)
- An average of **126 commits per release**
- **2,842 total commits** from 32 contributors (including AI agents!) as of today

I wonder if there are other open source projects out there that operate in such velocity. This certainly wouldn't have been possible without agentic engineering - especially considering that from beta 3 on it was mostly just me, as Armin and Mario moved on to other projects plus a few smaller external contributions.

## Memorable Milestones

### Terminal Title Management (b6)

My personal fav feature landed in b6: the `vt title` command. As a maniac who runs multiple Claudes in parallel, I needed a way to track what each agent is up to. [This feature](/posts/command-your-claude-code-army-reloaded/) lets you dynamically update session names from within the terminal, and then vt updates the title of your terminal window. That was some gnarly ascii stream parsing, find the right spot to inject custom commands, and also make it fast...

### The Node-pty Fork (b9)

We had to fork Microsoft's node-pty. Using VibeTunnel randomly caused crashes in VS Code - which should be completely unrelated. After some gnarly debugging, I found a thread-safety issue and some totally unnecessary socket code. Forked it and things are better now, eliminating the random crashes that were frustrating early adopters. Eventually though that code will be burned and replaced with Rust.

### Repository Discovery (b10)

The later betas had the core features stabilized, so I could focus more on the Mac side. The new session picker automatically scans your project folder and shows your git repos. Small feature, but so convenient - saving developers 10-20 seconds per session start! Making this work was more work than you'd think, since this can be updated on the Mac side and updates are sent live from Mac -> Unix Socket -> Server -> WebSocket -> Frontend. Or from frontend back to Mac - gotta do it right!

## Key Learnings

### Agents Need Railguards

In the beginning we've been vibing this project pretty hard and just pushed to main, full chaos mode. It worked quite well, but as the project grew, structure is needed. We started adding tests once we felt the pain of things breaking all the time, and there's still work to do to increase test coverage. Tests are even more important with agents, since you can't trust them. They'll eventually break stuff and prompt that everything's great and ready to ship.

### Agents Need Thinking

I approach almost every new feature with a prompt that includes an issue, plenty of brabble from me in how I think that feature should be tackled, and then I add "ultrathink, make a plan first and give me at least 3 options". Then either I pick one of the options or add more info to further refine the plan, before agents do anything. This is much more effective than just letting them run loose without a plan - as they'll usually pick the simplest one, with the most technical debt.

### Pathfinder Principle

Since it's mostly me, I don't care so much about each PR only touching the parts that are needed. Often I add refactors to PRs for things that are related, and clean the code up as I fix bugs or build features. If you move this work into separate issues, it'll never get done. So I opt for slightly messier PRs that improve and fix the codebase gradually over perfect granular commits. Agents are really good in refactoring, but it won't happen automatically. [Consider this PR](https://github.com/amantus-ai/vibetunnel/pull/345): I could have merged the bandaid fix, but then opted to not only fix the root issue, but completely overhaul how messages are sent in the unix socket.

### Community Building Is Hard

This is my first open source project where I'm trying to bring more people on. After all it's a project from developers, for developers, and it has plenty interesting challenges - so it should be easy, right? Wrong. Most contributors won't know the codebase well, so usually there's work needed once a PR lands. [Consider this PR](https://github.com/amantus-ai/vibetunnel/pull/298), which fixed keyboard capture on macOS - but only on macOS. It took me a few days to research what keyboard shortcuts are critical per OS and then come up with a much better solution.

I've made a section on GitHub for [*good first issues*](https://github.com/amantus-ai/vibetunnel/issues?q=sort%3Aupdated-desc%20is%3Aissue%20is%3Aopen%20label%3A%22good%20first%20issue%22) and this was one of them, so that's on me, as I didn't understand the real complexity until digging in more. It's a learning process, and [I've created a Discord](https://discord.gg/3Ub3EUwrcR) now to coordinate the vibing.

### It's Not Just Code

Agents help a lot in writing code, but there's still everything else: Product management, reviewing bug reports, [replying to social media](https://x.com/VibeTunnel), [documentation](https://github.com/amantus-ai/vibetunnel/blob/main/README.md), [managing CI](https://github.com/amantus-ai/vibetunnel/actions), writing blog posts (yes we should have a project blog...), manually testing releases, [planning new features](https://github.com/amantus-ai/vibetunnel/issues?q=sort%3Aupdated-desc%20is%3Aissue%20is%3Aopen%20type%3AFeature), where they can't help that much. Sure, they can assist with writing blog posts, but after some experimentation I went back to writing most by hand, people wanna read my voice, not just my intent.

## Thank You!

VibeTunnel wouldn't be where it is today without our amazing contributors. Special thanks to:

**Core Team**: [Mario Zechner](https://github.com/badlogic) (291 commits) and [Armin Ronacher](https://github.com/mitsuhiko) (132 commits) who helped build the foundation and shaped the architecture.

**Major Contributors**: [Manuel Maly](https://github.com/manuelmaly) (72), [Helmut Januschka](https://github.com/hjanuschka) (55), [Jeff Hurray](https://github.com/jhurray) (36), and [David Collado](https://github.com/collado-dev) (14) for their significant features and improvements.

**Community Heroes**: Billy Irwin, Igor Tarasenko, David, Thomas Ricouard, Piotr, hewigovens, Clay Warren, Chris Reynolds, Madhava Jay, Michi Hoffmann, Raghav Sethi, Tao Xu, Devesh Shetty, Jan Remeš, Luis Nell, Luke, Marek Šuppa, Sandeep Aggarwal, Zhiqiang Zhou, and noppe - every contribution matters!

**Our Robot Overlords**: Cursor Agent, blacksmith-sh[bot], and devin-ai-integration[bot] - yes, we used AI agents to build a tool for AI agents. It's agents all the way down! 🤖

Together, we've built something special with **2,842 commits** from 32 contributors. Whether you fixed a typo, squashed a bug, or built entire features - thank you for vibing with us! 🚀

## Looking Forward

We just shipped a standalone npm with Linux support and the bug list is slowing down, the plan is to ship the 1.0 by the end of July. There's still the iOS app and a few crazier ideas (Agent Mode, Apple Watch app, voice mode) for the future - my plan is to keep working on vibetunnel as long as I use it and it's fun, and helping others learn & contribute.

Since agents can't eat cake, I made them a different present: VibeTunnel is now on [vt.sh](https://vt.sh)! If you haven't tried it yet, now's the perfect time - [download the Mac app](https://github.com/amantus-ai/vibetunnel/releases) and post a picture on Twitter of the weirdest place you're vibin'!