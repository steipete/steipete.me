---
title: "The Signature Flicker"
pubDatetime: 2025-12-18T01:00:00+01:00
description: "Hell froze over. Anthropic fixed Claude Code's signature flicker in their latest update (2.0.72)"
tags: ["ai", "terminal", "tui", "claude-code", "codex", "gemini", "development", "tools"]
---

**tl;dr: Hell froze over. Anthropic fixed Claude Code's signature flicker in their latest update (2.0.72)**

If there's one thing everybody noticed about Claude Code (apart from it revolutionizing how we build software), [it's the flickering](https://www.reddit.com/r/ClaudeAI/comments/1lxs53r/what_is_this_madness/). It's unfair to point to Anthropic since they are not alone: other TUIs such as Cursor, or really anything based on [Ink](https://github.com/vadimdemedes/ink) have the same issue. It's also not an easy problem at all. Claude Code uses React under the hood.[^1]

## The Issue

Terminals haven't really been designed for interactivity. It's possible to use [ANSI escape codes](https://en.wikipedia.org/wiki/ANSI_escape_code) to reposition the cursor and write over existing text, but that easily leads to flickering if not done well.

There are two ways to solve this:
1. Switch to alt mode and take complete control over the terminal viewport.
2. Carefully re-render changed parts while leaving the scrollback unchanged.

Neither option is great, and there are different tradeoffs. I've spent quite a bit with option 2 since I wrote a port of [pi-tui](https://github.com/badlogic/pi-mono/tree/main/packages/tui) to [Swift "TauTUI"](https://github.com/steipete/TauTUI), and while Codex mostly auto-translated the code, I was curious how this actually works. [Mario is explaining the tradeoffs for these modes really well](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/#toc_6), so I'm not gonna repeat this here.

Ink, the dependency Anthropic used for the longest time didn't support incremental rendering and was re-rendering loads of text, which caused flickers. [This has since been fixed](https://github.com/vadimdemedes/ink/pull/781), however Anthropic wanted more control and [built their own renderer](https://github.com/anthropics/claude-code/issues/769#issuecomment-3667315590), while keeping React.

> this is kind of like if a website were to do their own text rendering, highlighting, mouse movement, context menu, etc. - it would not feel like your browser - [@trq212, Claude Code Dev](https://x.com/trq212/status/2001552877698056370)

I'll argue that Anthropic [made the right choice](https://x.com/trq212/status/2001439030613864735) for a coding agent - which really is a long stream of text with some bits of interactivity.

## The Landscape

The landscape seems to shift towards alt mode: Amp, OpenCode, and Gemini all moved to alt mode, however with Gemini backslash was too large so they reverted their new TUI already.

OpenCode did some great engineering and built [opentui](https://github.com/sst/opentui) in Zig, which renders SolidJS or React. It's not without downsides, e.g. [it doesn't work in the standard macOS Terminal](https://github.com/sst/opencode/issues/4043#issuecomment-3519627447) for anything below macOS 26 or [GNOME's Terminal](https://github.com/sst/opencode/issues/4320). Amp used Ink and shared Claude's flickering but [eventually wrote their own, switching to alt mode in September](https://ampcode.com/news/look-ma-no-flicker).

## The Problem

So what's my big gripe with alt mode? It breaks features such as text selection, [native scrolling](https://x.com/mitchellh/status/1978934533170041118) or [search](https://x.com/mitchellh/status/1993728538344906978). Of course this can be implemented in the TUI, but it won't feel *right*.

### Amp

![amp find demo](/assets/img/2025/signature-flicker/amp-find.gif)

- `find` fails unless the text is currently on-screen
- No native-feeling selection/context menu flow
- Custom scrollbar; workable but not quite the terminal

### Gemini

Google felt this recently when they switched to their new TUI. In there, [you had to press CTRL-S to enter selection mode to copy text](https://github.com/google-gemini/gemini-cli/discussions/13067). This caused enough outrage that they quickly rolled back the code and are redesigning their TUI.

![gemini text selection demo](/assets/img/2025/signature-flicker/gemini-textselect.gif)

### Codex

Compare to OpenAI's Codex, which uses retained mode and lets me interact with text just like I expect:

![codex real demo](/assets/img/2025/signature-flicker/codex-real.gif)

However, Codex has bugs in their renderer, so [they are actively working on replacing it with an alt-mode TUI](https://github.com/openai/codex/blob/main/codex-rs/tui2/docs/tui_viewport_and_history.md).

### OpenCode

![opencode text demo](/assets/img/2025/signature-flicker/opencode-text.gif)

- Auto-scroll near the viewport border makes small screens painful
- No scrollbar; search doesn’t work the way you expect
- Right click → paste into the input box doesn’t work

## Verdict

Claude Code proves you can kill flicker without giving up the terminal’s muscle memory.

Alt mode can be great for dashboards, but for coding agents I want the terminal’s built-ins to stay *native*:
- Select text like it’s a terminal
- Scrollback like it’s a terminal
- Search like it’s a terminal

It’s 2025. We can have smooth rendering *and* keep the terminal’s superpowers.

[^1]: Yes, I made the same weird look when I first learned about this, but it's kinda beautiful. React's concepts are flexible enough that it doesn't require a browser as a frontend — and Ink is such an alternative render backend.
