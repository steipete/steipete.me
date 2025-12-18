---
title: "The Signature Flicker"
pubDatetime: 2025-12-18T01:00:00+01:00
description: "Why terminal UIs still flicker—and why alt-mode TUIs keep breaking selection/search, with examples from Claude Code, Codex, and Gemini."
tags: ["ai", "terminal", "tui", "claude-code", "codex", "gemini", "development", "tools"]
---

tl;dr: Hell froze over. Anthropic fixed Claude Code's [signature flicker](https://www.reddit.com/r/ClaudeAI/comments/1lxs53r/what_is_this_madness/) in their latest update (2.0.72)

It's unfair to point to Anthropic since they are not alone: other TUIs such as Cursor, or really anything based on [Ink](https://github.com/vadimdemedes/ink) have the same issue. It's also not an easy problem at all. Claude Code uses React under the hood. Yes, I made the same weird look when I first learned about this, but it's kinda beautiful. React's concepts are flexible enough that it doesn't require a browser as frontend - and Ink is such an alternative render backend.

## The Issue

The main problem of Ink ~~is~~ was that it didn't support incremental rendering. [This has since been fixed](https://github.com/vadimdemedes/ink/pull/781), however Anthropic wanted more control and [built their own renderer](https://github.com/anthropics/claude-code/issues/769#issuecomment-3667315590), while keeping React.

There are two ways how to solve this:
1. Switch to alt mode and take complete control over the terminal viewport.
2. Wrestle with the terminal and build an differential render engine.

Neither option is great, and there's different tradeoffs. I'll argue that Anthropic [made the right choice](https://x.com/trq212/status/2001439030613864735) for a coding agent - which really is a long stream of text with some bits of interactivity.

> this is kind of like if a website were to do their own text rendering, highlighting, mouse movement, context menu, etc. - it would not feel like your browser - [@trq212](https://x.com/trq212/status/2001552877698056370)

I've spent quite a bit with option 2 since I wrote a port of [pi-tui](https://github.com/badlogic/pi-mono/tree/main/packages/tui) to [Swift "TauTUI"](https://github.com/steipete/TauTUI), and while codex mostly auto-translated the code, I was curious how this actually works. [Mario is explaining the tradeoffs for these modes really well](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/#toc_6), so I'm not gonna repeat this here.

## The Landscape

The landscape seems to shift towards alt mode: amp, opencode, and gemini all moved to alt mode, however with gemini backslash was too large so they reverted their new TUI already. 

Opencode did some great engineering and built [opentui](https://github.com/sst/opentui) based on zig, which renders SolidJS or React. It's not without downsides, e.g. [it doesn't work in the standard macOS Terminal](https://github.com/sst/opencode/issues/4043#issuecomment-3519627447) for anything below macOS 26 or [GNOME's Terminal](https://github.com/sst/opencode/issues/4320). Amp used Ink and shared Claude's flickering but [eventually wrote their own, switching to alt mode in September](https://ampcode.com/news/look-ma-no-flicker).

## The Problem

So what's my big gripe with alt mode? It breaks features such as text selection, [native scrolling](https://x.com/mitchellh/status/1978934533170041118) or [search](https://x.com/mitchellh/status/1993728538344906978). Ofc this can be implemented in the tui, but it won't feel *right*.

![amp find demo](/assets/img/2025/signature-flicker/amp-find.gif) See how find fails to find text unless it's on-screen and how I fail to open a context menu for text selection. The scrollbar is custom but works well enugh.

Google felt this recently when they switched to their new TUI. In there, [you had to press CTRL-S to enter selection mode to copy text](https://github.com/google-gemini/gemini-cli/discussions/13067). This caused enough outrage that they quickly rolled back the code and are re-desinging their TUI. Currently it's

![gemini text selection demo](/assets/img/2025/signature-flicker/gemini-textselect.gif)

Compare to OpenAI's codex, which uses retained mode and I can interact with text just like I expect:
![codex real demo](/assets/img/2025/signature-flicker/codex-real.gif)

However, codex has bugs in their renderer, so [they are actively working on replacing it with an alt-mode TUI](https://github.com/openai/codex/blob/main/codex-rs/tui2/docs/tui_viewport_and_history.md).

## Verdict

So here we are, It's 2025 and I'm writing a blog post, hoping that it's not too late for OpenAI to reverse their decision.
