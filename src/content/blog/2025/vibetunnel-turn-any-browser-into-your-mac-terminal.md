---
title: "VibeTunnel: Turn Any Browser into Your Mac's Terminal"
pubDatetime: 2025-06-16T12:00:00.000+01:00
description: "How we built VibeTunnel in a marathon coding session - a browser-based terminal that uses named pipes, XtermJS, and Claude Code to give you shell access from anywhere."
tags:
  - Terminal
  - Web Development
  - Rust
  - Claude Code
  - Open Source
  - Hackathon
---

![VibeTunnel: Browser-Based Terminal Access](/assets/img/2025/vibetunnel/hero.jpg)

What happens when three developers lock themselves in a room from 11am to 2pm with Claude Code and too much caffeine? You get [VibeTunnel](https://github.com/steipete/vibetunnel) - a browser-based terminal that actually works. No SSH client needed, no port forwarding, just pure terminal access through your browser.

## The Birth of VibeTunnel

It started with Armin's prototype that piped stdin/stdout to files and used asciinema for playback. Within hours, we had transformed it into a full bidirectional terminal emulator. Here's how we built it in one intense session.

## The Architecture That Emerged

The whole system is beautifully simple:

**The Rust Core**: Armin built a binary that spawns and controls processes on the system. It uses named pipes for stdin and regular files for stdout, observing outputs and feeding inputs back to the process.

**The Node.js Bridge**: I wrote a server at 11:11am (yes, we noted the time) that provides a simple API. When the frontend calls an endpoint, it executes Armin's binary with the session ID and forwards the commands.

**The Frontend**: Using Google's Lit framework (a thin wrapper around web components), we built a UI that streams output events via Server-Sent Events (SSE) and sends keystrokes back through the API.

## The Technical Journey

### From Asciinema to XtermJS

Our first challenge came after midnight when we needed a proper scrollback buffer. The initial asciinema approach had no history - you couldn't scroll back to see previous output. I spent two hours investigating whether to write my own ANSI sequence renderer (spoiler: bad idea) before Armin suggested XtermJS.

"That was pretty fucking complete," as we noted. XtermJS handles all the ANSI escape sequences, cursor positioning, screen clearing - everything a real terminal needs. It outputs a buffer with characters, foreground colors, and background colors that renders directly to the DOM.

The only issue? Unicode rendering for things like box-drawing characters. When you start Claude Code, you get that nice orange border - it currently falls back to ASCII replacements. "It just looks a little janky, but it's readable."

### The Streaming Challenge

We use Server-Sent Events (SSE) for streaming terminal output, but hit the browser's limit of six concurrent connections. Each terminal session needs its own stream, which means you can only have six terminals open at once.

The solution? Multiplexing. Instead of one connection per terminal, we need a single stream that carries data for all terminals. It's on the roadmap.

### Claude Code: The Secret Weapon

"We wouldn't even have attempted this without Claude Code," we agreed. What would have been a week-long project compressed into hours. But Claude has its quirks:

- It struggles with asynchronous flows
- The initial async code was "the worst code you could write"
- Required significant manual rewriting and simplification

But for bootstrapping and integrating unknown technologies? Unbeatable. "You just say, hey, what's different in the Node reference implementation? Fix it. Make it like this."

## Three Servers, One Purpose

In true hackathon fashion, we ended up with three server implementations:

1. **Node.js** - The reference implementation
2. **Rust** - For those who want performance
3. **Hummingbird (Swift)** - Because Armin spent most of his time "cursing out Xcode"

We're keeping all three for educational purposes. It's the same backend API implemented in three different environments - perfect for learning.

## The Technology Stack

The final stack that emerged from our coding marathon:

- **Rust Binary** - Controls process spawning, named pipes, and I/O forwarding
- **XtermJS** - Full terminal emulation with ANSI support in the browser
- **Lit Framework** - Google's lightweight web components (no build step!)
- **Server-Sent Events** - For streaming terminal output
- **Node.js/Rust/Swift** - Pick your server flavor

## Getting Started

Once we clean up the input handling (it's "better now" but not perfect), installation will be:

```bash
# Clone and run
git clone https://github.com/steipete/vibetunnel
cd vibetunnel
npm install
npm start
```

Choose your backend:
- `--server=node` for the reference implementation
- `--server=rust` for performance
- `--server=swift` for the Hummingbird version

## What's Next

Beyond fixing the current input quirks:

- **Multiplexed connections** - Break the 6-terminal limit
- **Proper Unicode rendering** - Make those box-drawing characters beautiful
- **Native apps** - "There's open space for a native iOS app"
- **Better XtermJS integration** - "I'm pretty sure Xterm could be controlled in a better way"

We're making it open source because we know others will help. Maybe someone will even port Ghosty's terminal emulator. "That'd be fun."

## The Real MVP: Teamwork and Claude

This project happened because:
- Armin cranked out the Rust binary in 2-3 hours (while cursing Swift)
- I rebuilt everything multiple times with Claude's help
- We all pushed through from 11am to 2pm (or "10:10 to 2" if you ask me)

"The individual components aren't really complex. It's just fitting them together and making them work together."

## Conclusion

VibeTunnel is what happens when developers scratch their own itch with modern tools. It's not perfect - Unicode rendering is janky, input has quirks, and we need multiplexing. But it works, and it's something "a lot of people will use."

As we wrapped up: "I will probably use it quite a bit... then it means you'll be annoyed by bugs and fix them."

"Don't count on it. Well, you just have to tell Claude to fix it."

Try VibeTunnel today. Your terminal is waiting in your browser.