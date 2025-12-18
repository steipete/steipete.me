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
1. Switch to [alt mode](https://ratatui.rs/concepts/backends/alternate-screen/#:~:text=The%20alternate%20screen%20is%20a,content%20of%20the%20main%20screen.) and take complete control over the terminal viewport.
2. Carefully re-render changed parts while leaving the scrollback unchanged.

Neither option is great, and each comes with tradeoffs. [Mario Zechner explains these really well](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/#toc_6) in his write-up on building pi-coding-agent, so I won't repeat the details here. I've spent time with option 2 myself, having ported [pi-tui](https://github.com/badlogic/pi-mono/tree/main/packages/tui) to Swift as [TauTUI](https://github.com/steipete/TauTUI) (Codex did most of the auto-translation).

For a coding agent that mostly emits text with limited interactivity, I believe carefully re-rendering only changed parts — while remaining a good terminal citizen — is the better approach.

Anthropic seems to agree. Ink, the React-based terminal renderer they originally used, didn't support incremental rendering and would redraw large chunks of text, causing flickers. [This has since been fixed upstream](https://github.com/vadimdemedes/ink/pull/781), but Anthropic wanted more control and [built their own renderer from scratch](https://github.com/anthropics/claude-code/issues/769#issuecomment-3667315590), while keeping React as the component model.

> This is kind of like if a website were to do their own text rendering, highlighting, mouse movement, context menu, etc. — it would not feel like your browser. (...) We value this native experience a lot. We may explore alternate screen mode in the future, but our bar is quite high.
> — [Thariq](https://x.com/trq212/status/2001552877698056370), Anthropic

## The Landscape

The landscape seems to shift towards alt mode: Amp, OpenCode, and Gemini all switched, however with Gemini backlash was too large so they reverted their new TUI already.

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

Compare to OpenAI's Codex, which stays in the primary screen buffer and lets me interact with text just like I expect:

![codex real demo](/assets/img/2025/signature-flicker/codex-real.gif)

However, Codex has bugs in their renderer, so [they are actively working on replacing it with an alt-mode TUI](https://github.com/openai/codex/blob/main/codex-rs/tui2/docs/tui_viewport_and_history.md).

### OpenCode

![opencode text demo](/assets/img/2025/signature-flicker/opencode-text.gif)

- Auto-scroll near the viewport border makes small screens painful
- No scrollbar; search doesn’t work the way you expect
- Right click → paste into the input box doesn’t work

## Verdict

Claude Code and [pi](https://shittycodingagent.ai/) prove you can kill flicker without giving up the terminal's muscle memory.

Alt mode can be great for dashboards, but for coding agents I want the terminal’s built-ins to stay *native*:
- Select text like it’s a terminal
- Scrollback like it’s a terminal
- Search like it’s a terminal

It’s 2025. We can have smooth rendering *and* keep the terminal’s superpowers.

[^1]: Yes, I made the same weird look when I first learned about this, but it's kinda beautiful. React's concepts are flexible enough that it doesn't require a browser as a frontend — and Ink is such an alternative render backend.
