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

What happens when three developers lock themselves in a room from 11am to 2pm with [Claude Code](https://www.anthropic.com/claude-code) and too much caffeine? You get [VibeTunnel](https://vibetunnel.sh) - a browser-based terminal that actually works. No SSH client needed, no port forwarding, just pure terminal access through your browser.

This is the story of how Mario, Armin, and I built VibeTunnel in one marathon session.

The idea sparked from a simple frustration: accessing your development machine's terminal from anywhere shouldn't require complex SSH setups, port forwarding gymnastics, or fighting with corporate firewalls. We wanted something that just works - if you can browse the web, you should be able to access your terminal.

## The Birth of VibeTunnel

It started with Armin's prototype that piped stdin/stdout to files and used [asciinema](https://asciinema.org/) for playback. His initial approach was clever - capture terminal output to a [JSONL](https://jsonlines.org/) file that described terminal dimensions and character events, then replay it using asciinema's player. But it was one-way communication only - no input, no interactivity, just a recording.

Armin had actually built a similar library two years ago: "I used a library that I wrote two years ago... that library probably took me three or four days because I had to really figure out how pseudo terminals work." But this time was different: "I'm pretty sure you could write this whole thing up in probably under an hour at this point. And I didn't even bother using my library again... I just copy pasted the whole library in and had Claude do the modifications to it."

Within hours, we had transformed it into a full bidirectional terminal emulator. The journey from "wouldn't it be cool if..." to a working prototype showcases what's possible when you combine the right tools, the right team, and a healthy dose of determination. Here's how we built it in one intense session that stretched from morning coffee to well past midnight.

## The Architecture That Emerged

The whole system is beautifully simple, yet each component plays a crucial role in making browser-based terminal access feel native:

**The Rust Core**: Armin built a binary that spawns and controls processes on the system. The magic happens through Unix named pipes - we use a regular file for stdout (so we can tail and observe it) and a named pipe for stdin (allowing real-time input injection). His Rust binary watches the stdout file for changes and writes incoming keystrokes to the stdin pipe. It's the bridge between the web world and your actual shell processes. As Mario noted: "We use name pipes on the system. We use a file for the standard out stream and the name pipe for the standard in stream."

**The Node.js Bridge**: Mario wrote a server at 11:11am (yes, he noted the time - something about that symmetry felt auspicious) that provides a simple REST API. When the frontend calls an endpoint, it executes Armin's binary with the session ID and forwards the commands. Each API call is essentially: "Hey Rust binary, here's session 123, please write 'ls -la' to its stdin pipe." The Node server also handles session management, authentication, and serves the static frontend files.

**The Frontend**: Using Google's [Lit framework](https://lit.dev) (a thin wrapper around web components with no build step required!), we built a UI that streams output events via [Server-Sent Events (SSE)](https://en.wikipedia.org/wiki/Server-sent_events) and sends keystrokes back through the API. Lit's reactive properties and lightweight nature made it perfect for our rapid prototyping needs. Every keystroke triggers an API call, every terminal output update streams through SSE - it's surprisingly responsive for such a simple architecture.

## The Technical Journey

### From Asciinema to Xterm.js: The Midnight Pivot

Our first major challenge came after midnight when we needed a proper [scrollback buffer](https://unix.stackexchange.com/questions/145050/what-exactly-is-scrollback-and-scrollback-buffer). The initial asciinema approach had a fatal flaw - no history. You couldn't scroll back to see previous output, making it useless for any real work. Imagine running a build command and not being able to scroll up to see the errors!

Mario spent two hours going down a rabbit hole, investigating whether to write his own ANSI sequence renderer. He got surprisingly far - basic text output worked, colors were rendering, cursor movement was... sort of working. But then came the edge cases: double-width characters, complex cursor positioning, alternate screen buffers, and the hundreds of other ANSI escape sequences that real terminals support. It was becoming clear this was a month-long project, not a two-hour hack.

"I first investigated whether I can write my own ANSI sequence renderer. That kinda worked. But there were so many edge cases that I eventually searched for something else," Mario explained. Armin had been recommending [Xterm.js](https://xtermjs.org) all along: "Armin recommended Xterm.js." But Mario initially resisted, finding an issue on GitHub suggesting asciinema now supported scrollback buffering. "I went through that a bit and thought maybe I can figure that out, but there was no way to get that working. So I went back to Xterm and spent about two hours figuring out how it works and how to massage it so it works in our context as well."

"That was pretty fucking complete," Mario exclaimed when we finally integrated Xterm.js. It's a full terminal emulator that runs in the browser, handling all the ANSI escape sequences, cursor positioning, screen clearing - everything a real terminal needs. The magic is in how it works: feed it the raw output from your shell (including all those escape sequences), and it maintains an internal buffer representing exactly what should be displayed. It outputs this buffer with characters, foreground colors, and background colors that renders directly to the DOM. No canvas needed, just divs and spans with the right styling.

As Mario described it: "Xterm makes it quite easy to feed it those sequences of characters and ANSI sequences and get out a buffer that you can render directly to the DOM, not to the canvas, but to the DOM."

The only issue? Unicode rendering for things like box-drawing characters. When you start Claude Code, you get that nice orange border made of Unicode box-drawing characters - it currently falls back to ASCII replacements like '+' and '-' instead of smooth lines. "It just looks a little janky, but it's readable." It's on the list of things to fix, but honestly, after fighting with terminal emulation for hours, seeing anything render correctly felt like a victory.

### The Streaming Challenge: Six Terminals and You're Out

We chose Server-Sent Events (SSE) for streaming terminal output because it's simple, well-supported, and doesn't require WebSocket complexity. Each terminal connects to an endpoint like `/api/stream/session-123` and receives a continuous stream of output events. It worked beautifully... until we tried to open a seventh terminal.

Turns out browsers have a [hard limit of six concurrent connections](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) to the same domain. It's an HTTP/1.1 limitation that exists to prevent connection flooding. Each terminal session needs its own stream, which means you can only have six terminals open at once. We discovered this the hard way when terminal number seven just... didn't work. No errors, no warnings, just a blank screen waiting for a connection that would never come.

The solution? Multiplexing. Instead of one connection per terminal, we need a single SSE stream that carries data for all terminals. Each message would be tagged with a session ID, and the frontend would route it to the correct terminal display. It's more complex but would remove the six-terminal limitation entirely. The architecture is already sketched out: a single `/api/stream/all` endpoint that broadcasts all terminal updates, with the frontend filtering based on which terminals are actually visible. It's on the roadmap, right after we fix the input handling quirks.

### Claude Code: The Secret Weapon (With Battle Scars)

"We wouldn't even have attempted this without Claude Code," we agreed. What would have been a week-long project compressed into hours. The ability to say "integrate Xterm.js for terminal emulation" and get working code in minutes is game-changing. 

Armin put it in perspective: "20x is not an understatement in terms of how much faster we are with agents." He gave a concrete example: "This button that I added to the UI, which is install the shell command and sudo the user. It wrote shell script. It wrote an Apple script. And then it wrote another thing around it, and it took it two and a half minutes. And for me to figure out how to bring up the right sudo dialogue, which kind of workaround to use to bring this thing in would have been two hours, three hours."

He compared it to his experience at [Sentry](https://sentry.io): "We every year, we had a hack week culture. So every year, we took four days to five days of three to four people working on one project. And, honestly, three, four people working for five days not nearly as impressive in terms of how much stuff you can produce than I think even within twelve hours."

Claude excels at bootstrapping. Need to integrate a library you've never used? Claude will get you 80% there in minutes. Want to understand how Server-Sent Events work? Claude generates a working example faster than you can read the MDN docs. But Claude has its quirks, and we hit every single one:

- **Asynchronous flow blindness**: Claude struggles with complex async patterns. As Mario put it: "Claude is not really good writing asynchronous processes or asynchronous flows." The initial code for handling concurrent terminal sessions was, to quote directly, "the worst code you could write." Race conditions everywhere, promises that never resolved, event handlers that fired multiple times. It technically worked... until it didn't. Mario spent hours fixing it: "So I spent a lot of time rewriting that manually or giving it instructions to simplify the crap code, which worked out quite well."

- **Over-engineering simple things**: Ask Claude to read a file and stream its contents? You'll get a beautiful abstraction with generators, streams, and transforms. Sometimes you just need `fs.readFileSync()`.

- **Context window amnesia**: As the codebase grew, Claude would forget earlier architectural decisions. "Wait, why are we using named pipes again?" It required constant reminders and context refreshing.

The workflow that emerged was fascinating: Claude would generate the initial implementation, Mario would test it, discover the edge cases, then spend significant time refactoring. But here's the key insight - even with all the fixes needed, we were still moving 5x faster than coding from scratch. It's not about getting perfect code; it's about getting *something* that works, then iterating rapidly.

"You just say, hey, what's different in the Node reference implementation? Fix it. Make it like this." And Claude would dutifully port features between our three server implementations, maintaining API compatibility while adapting to each language's idioms.

But as Armin warned: "You need to understand what you're doing still because otherwise it just goes down a path that just doesn't actually end up what it needs to be." He shared an example: "I sent it one of the early implementations of the whole thing. Said step by step, please port this thing over. And the initial thing that it did was obviously very wrong. But it would have worked, but it wouldn't have gotten us to the end result that we needed because we need to stream some stuff up."

The lesson? This is what people often don't really get. It's not like you do one prompt and this comes out. You work with it. It is a tool. And if you are a really good engineer, it's rocket fuel for you. But if you don't know what you're doing, you still cannot build this.

## Three Servers, One Purpose: The Polyglot Experiment

In true hackathon fashion, we ended up with three server implementations. But it wasn't planned - it was born from frustration and iteration:

1. **Node.js** - The reference implementation that Mario built first. It's the most complete, with all the session management, authentication hooks, and error handling. About 400 lines of Express.js that just works. Perfect for developers who want to hack on it immediately - everyone knows Node.

2. **Swift ([Hummingbird](https://hummingbird.codes))** - This came next, as we wanted a Swift implementation. But it became a story of frustration. When I asked Armin what the hardest part was, his answer was immediate: "The hardest thing is Xcode." He elaborated on why it's so frustrating: "You're kinda used to being able to remote control a lot of stuff because a lot of it is text based. And xcodebuild sort of runs on a command line, but... the behavior of xcodebuild on a command line on our machine at least doesn't match the behavior of Xcode play button. And so it kinda shows you how inappropriate the tool is for agentic workflows."

After spending "almost half an hour to get the bare bones things over from a to b," he was done. Three hours and many profanities later, we had a working Hummingbird server. It's actually quite elegant - Swift's async/await makes the code surprisingly readable. But the development experience was painful.

3. **Rust (now the default)** - This is where things got interesting. Fed up with Xcode's limitations, Armin pivoted to Rust using Actix Web. The difference was night and day. As he put it, "the agent loop is so much better in Rust than in Xcode." The iteration speed was incredible - what took 30 minutes of fighting with Xcode took minutes in Rust. The development experience was so superior that we ended up making the Rust version our recommended default engine. It's not just about performance (though it does use about 10x less memory) - it's about developer velocity. According to Mario: "Armin actually did a super great job extending his prototype so it also can take input and forward that to the standard in of the process."

We're keeping all three implementations for educational purposes. As Mario explained: "We should keep both for educational purposes. Actually, all three for educational purposes because you have an aligned implementation of the same back end in three different environments." It's the same REST API implemented in three different environments - perfect for learning how different ecosystems handle HTTP, async I/O, and process management. But if you're just looking to use VibeTunnel? Start with the Rust version.

This unplanned polyglot approach revealed interesting patterns. The Rust version forced us to think carefully about lifetimes and session cleanup. The Swift version's strong typing caught several API inconsistencies (when we could get it to compile). The Node version's ecosystem made adding features trivial. Each implementation taught us something that improved the others, even if we didn't set out to build three versions.

## The Technology Stack: A Beautiful Frankenstein

The final stack that emerged from our coding marathon is a testament to pragmatic engineering - we used whatever worked best for each layer.

The main component that we distribute is a fully native SwiftUI app (with some sprinkles of AppKit) built with Swift 6. It packages all the bells and whistles, uses [Sparkle](https://sparkle-project.org/) for automatic updates, and ships with all the other components needed to make VibeTunnel work seamlessly. This native app ensures a smooth macOS experience while bundling the entire technology stack:

**Core Process Management**
- **Rust Binary** - The heart of the system. Controls process spawning, named pipes, and I/O forwarding. Why Rust? Because when you're dealing with system-level process management, you want something that won't segfault at 2 AM. The binary is remarkably small - about 2MB compiled - and handles all the tricky bits of PTY allocation, signal forwarding, and process lifecycle management.

Armin explained why this is actually harder than SSH: "What is a lot harder is drawing something in not the same terminal. Because what we're doing here is we're basically keeping it running the original terminal plus keeping it running in another terminal. And that is harder because, for instance, one of the terminals resizes, then you need to also update the other one. Or you wanna have a scroll back that is longer than what you would normally show."

**Terminal Emulation**
- **Xterm.js** - Full terminal emulation with ANSI support in the browser. It's the same library that powers VS Code's terminal, which gave us confidence it could handle real-world usage. The integration was surprisingly smooth once we understood its API. Pro tip: the documentation is extensive but the examples are gold.

**Frontend Framework**
- **Lit Framework** - Google's lightweight web components library. No build step required! This was crucial for our rapid iteration. Just save the file and reload. Lit's reactive properties made state management trivial, and web components meant our terminal widget was completely self-contained. You could drop it into any webpage and it would just work.

**Communication Layer**
- **Server-Sent Events** - For streaming terminal output. We chose SSE over WebSockets because it's simpler, works through proxies better, and automatic reconnection is built-in. The unidirectional nature (server to client only) perfectly matched our needs for output streaming.

**Backend Options**
- **Node.js/Rust/Swift** - Pick your flavor based on your team's expertise or deployment constraints. They all expose the same REST API, so switching between them is literally just changing a command-line flag.

## What's Next: The Roadmap We Sketched at 3 AM

Beyond fixing the current input quirks (which are "better now" but still occasionally eat a character or two), we have an ambitious roadmap:

**Multiplexed connections** - Breaking the 6-terminal limit is priority one. The plan is to implement a single SSE connection that streams all terminal sessions, with client-side routing based on session IDs. This would also enable some cool features like terminal broadcasting - imagine typing in one terminal and having it appear in multiple sessions simultaneously.

**Proper Unicode rendering** - Those box-drawing characters deserve to be beautiful. The issue isn't with Xterm.js (it supports Unicode fine) but with our font stack and CSS. We need proper font fallbacks and maybe some custom glyph rendering for the fancier Unicode blocks. "Make those box-drawing characters beautiful" became our rallying cry around 2 AM.

**Native apps** - "There's open space for a native iOS app," we noted. Imagine having your Mac's terminal on your iPad, with proper keyboard support and maybe even some gesture controls. The API is already there; someone just needs to build the native UI. We're secretly hoping someone will take the [SwiftTerm](https://github.com/migueldeicaza/SwiftTerm) library (or [libghostty](https://github.com/ghostty-org/ghostty)) and build something amazing.

**Better Xterm.js integration** - "I'm pretty sure Xterm could be controlled in a better way." We're using maybe 30% of Xterm.js's capabilities. There's support for custom renderers, GPU acceleration, link detection, and so much more. The terminal could be so much smarter about understanding what you're doing and providing contextual help.

We're making it open source because we want to use this ourselves, there's nothing great out there and we're doing it for the fun of it. The architecture is intentionally modular - swap out any component and the rest keeps working. Maybe someone will even port Ghostty's terminal emulator. "That'd be fun." Or integrate it with [tmux](https://github.com/tmux/tmux/wiki) for persistent sessions. Or add collaborative features where multiple people can share a terminal. The possibilities are endless when you have a solid foundation.

And as Armin pointed out: "Someone has to port Claude to work on a Windows terminal, and then we have to port our stuff work with Windows terminal." Because right now, "VibeTunnel is Mac only, basically, for the most part."

## The Real MVP: Teamwork, Claude, and Caffeine

![The VibeTunnel team: Peter, Armin and Mario (from left to right)](/assets/img/2025/vibetunnel/team.jpg)

This project happened because of a perfect storm of factors:

**Armin's systems wizardry** - He cranked out the Rust binary in 2-3 hours, building the critical process management layer that makes everything possible. Mario praised his work: "He was done with his little TTY forwarder within about two or three hours." But the best part was his running commentary. While implementing PTY allocation and signal handling - notoriously tricky systems programming - he was simultaneously "cursing out Xcode" as he tried to help with Swift integration. The frustration was so intense that he rage-coded an entire Swift server just to prove a point. It ended up being one of our cleanest implementations.

**Mario's frontend adventures with Claude** - Mario rebuilt the UI layer three times. The first version was a jQuery mess (don't judge, it was 11 PM). The second used vanilla JavaScript and quickly became unmaintainable. The third, using Lit, was the charm. Claude was his constant companion, generating boilerplate, explaining APIs, and occasionally leading him astray with over-engineered solutions. The key was learning when to trust Claude and when to take control.

**Peter's deep knowledge of macOS** - Peter has been in the iOS and macOS space for almost 20 years and really knows how to build great Mac apps. He could reuse a lot of his existing work to get us really far, especially with distribution, and the difficulties around notarization and updating. He also built the website, the social pages, did the design, and the overall branding to make this from a quick hack project into something that feels like an actual beautifully designed product.

I had the most fun building the website with v0 from Vercel. I almost didn't believe that it would shoot out something that is as cool as this. The website took maybe 15 minutes, and then I spent like an hour trying to get the audio player to work. So you never know where the difficult problems are.

**The power of a deadline** - We pushed through from 11am to 2pm (or "10:10 to 2" if you ask Mario - he may have started a bit early out of excitement). There's something magical about a time constraint. It forces pragmatic decisions. "Should we implement proper error handling?" becomes "Does it crash? No? Ship it!"

As Mario reflected: "The individual components aren't really complex. It's just fitting them together and making them work together." This became our mantra. Named pipes? Simple. SSE? Straightforward. Terminal emulation? Solved problem. But making them dance together in harmony? That's where the magic (and the bugs) lived.

Mario summed up the project perfectly: "We can definitely say we wouldn't even have attempted this without Claude Code... That would be a multi week project probably. Maybe not a multi week project, but definitely a week project."

When I asked Armin what cost him the most time, his answer was predictable but telling: "The most time? Xcode." But he elaborated on a broader issue: "Anything where the agents cannot loop independently." He explained how agents get stuck when trying to read from blocking pipes: "It tried to read from a pipe and the pipe was blocking. And so then the agents just get stuck there because the agent is trying to read from the socket and nothing happens."

The real lesson here is about momentum. Once we had that first character appear in the browser - just a simple 'h' from typing 'hello' - we were hooked. Each small victory fueled the next. Input working? Let's add colors. Colors working? How about cursor movement. Before we knew it, we had a full terminal emulator.

As I reflected on our team dynamics: "I don't think we could have picked a better compartmentalization of who did what. We didn't really jump on each other... There was a surprising amount of not stepping on each other. Everybody had a specific skill set that was very useful."

## Conclusion: Shipping Beats Perfect

VibeTunnel is what happens when developers scratch their own itch with modern tools. It's not perfect - Unicode rendering is janky, input occasionally drops characters, and we need multiplexing. But it works, and as we agreed at the end: "I think this was this is a really cool project and something that a lot of people will use."

The imperfections are almost charming. They're a reminder that this was built by humans, in a marathon session, fueled by the joy of creation. Every quirk has a story. That Unicode rendering issue? That's from when we were too tired to read the font documentation properly. The six-terminal limit? An acceptable trade-off that still makes the first version amazing and fun to use.

As Armin noted about the quality: "I don't think that we wrote the most amazing code with Claude. There's definitely a lot of slop in there. But I think if one were to want to make this really, really nice, you could actually use Claude to fix a ton of this stuff." 

He also marveled at the completeness: "It's not just the app that is there. Right? There's the logo. There's the website. There is the read me. There's the documentation. All of it just came out of effectively an agent."

As we wrapped up at stupid o'clock in the morning, Mario said: "I will probably use it quite a bit... then it means you'll be annoyed by bugs and fix them."

"Don't count on it. Well, you just have to tell Claude to fix it."

And that's the beauty of [open source](https://github.com/amantus-ai/vibetunnel). We built the foundation, quirks and all. Now it's the community's turn to polish it into something amazing. Someone will fix the Unicode rendering. Another person will implement multiplexing. Maybe you'll be the one to build that iOS app. As Mario noted about the possibilities: "There's the open space for native iOS app... maybe at some point Android people will also pick it up."

At the end of our marathon session, we all agreed: "This was a really fun project." And isn't that what hacking is all about?

Try [VibeTunnel](https://vibetunnel.sh) today. Your terminal is waiting in your browser. And remember - it was built in a day by three developers having fun, but it'll be improved forever by a community that shares our passion.