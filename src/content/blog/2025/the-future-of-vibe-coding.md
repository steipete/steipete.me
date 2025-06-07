---
title: "The Future of Vibe Coding: Building with AI, Live and Unfiltered"
pubDatetime: 2025-06-01T16:00:00.000+01:00
description: "I demonstrate 'vibe coding' - a new approach to software development with AI, building two apps from scratch in a 3-hour live workshop."
tags:
  - AI
  - Development
  - Cursor
  - Claude
  - Swift
  - Electron
  - Workshop
---

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1088443203?h=37824a9349&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="The future of vibe-coding - Workshop Peter Steinberger - 2025_05_28 08_57 CEST"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

A friend asked me to show off my current workflow, so I did an impromptu workshop for him and his developers. This is a snapshot of how I approach vibe coding these days. Don't expect a professional workshop - I did this as a favor and for the fun of it. I let Gemini extract the key points into a blog post, if you don't want to watch all of the 3-hour video.

All the code generated during this workshop is available on [GitHub](https://github.com/steipete/VibeMeter).

## Transcript

Alright, let's talk about how software development is changing, right now. For nearly 15 years, I was deep in the PDF world with PSPDFKit (now they rebranded as Nutrient). After selling the company, I took a much-needed breather. I was properly burned out. But a couple of months ago, that itch, that [spark](/posts/2025/finding-my-spark-again/), came back. And what pulled me in? AI.

It's a completely different landscape now. Everything I'm about to share is what I've crammed into my brain over the last two, very intense, months. I'm still discovering new things daily, but what's already possible is, frankly, incredibly cool. So, I decided to do a live workshop: go from a raw idea to a (hopefully) working product in a few hours, unscripted, just pure "vibe coding."

### The Idea: "Vibe Meter" – Keeping an Eye on AI Costs

If you're like me, you're probably diving deep into AI tools. I'm using Cursor (the AI-first IDE) and Anthropic's Claude Code (their command-line AI) pretty heavily. These things aren't free. My Cursor bill was already nudging $900 for the month, and there's that $1000 cap before you need to talk enterprise. It got me thinking: wouldn't it be great to have a little something in the menu bar to see that spend in real-time?

And thus, "Vibe Meter" was born. I even briefly considered calling it "Aufpasser" (German for a kind of minder or little policeman – seemed fitting!). The plan was ambitious for a short workshop:
*   A macOS menu bar app (because native is nice).
*   An Electron app (for that cross-platform reach, because why not?).
*   Display current monthly Cursor spend.
*   Show more details on click, like who's logged in.
*   Configurable warning limits – say, a "vibe code limit" at $200, and another at the $1000 mark, with actual user notifications.
*   A proper settings dialog for these limits.
*   Since Cursor doesn't have a public API for this, we'd need to figure out a login mechanism, likely by capturing cookies like their own web app does.
*   Currency conversion (dollars, Euros, maybe even Philippine Pesos for the team!).
*   The usuals: launch at startup, quit option, logout.

Yeah, a bit much for a live demo, but go big or go home, right?

### Phase 1: The Blueprint – Forging Specs with Google's AI Studio & Gemini

Even in this new AI-driven world, a solid specification is still your bedrock. The difference? The process of creating it can be far more dynamic and, dare I say, fun. For this, I turned to Google's AI Studio, powered by their Gemini model.

**Why AI Studio for Specification? It's About the Output and the Process.**
Gemini is seriously impressive. I find it's incredibly good at generating lengthy, structured text without the aggressive summarization or "shortcut-taking" I've seen from other models when you ask for, say, full technical documentation. The playground for Gemini seems to have almost unlimited processing power for this kind of task – it doesn't feel like it's constantly trying to save on tokens when you need detail. Plus, the cost is quite reasonable – something like **four cents per million tokens** for the input, which is great for feeding it lots of context.

**My Spec Refinement Loop – AI Critiquing AI:**
This is a pattern I've found incredibly powerful:

1.  **Voice-First Brain Dump:** I'm lazy with typing. I use an app called "Flow" (or Whisper Flow – just hit the `Fn` key on my Mac, and it transcribes) to dictate my initial thoughts, feature ideas, and user stories directly into a new Gemini chat in AI Studio. It's fast and captures ideas fluidly.
2.  **Gemini's First Draft:** Gemini takes this verbal stream-of-consciousness and churns out a pretty decent first-pass structured specification document.
3.  **The "Peer Review" by Another AI:** This is the fun part. I copy that entire generated spec and paste it into a *brand new, separate* Gemini chat. My prompt to this second instance is something like: *"You are an AI tasked with implementing this spec in one go. Before you start, what questions do you have? What's unclear? What's missing for you to build this successfully?"*
4.  **Addressing the AI's Questions:** The second AI *always* comes back with brilliant questions. It points out ambiguities, edge cases I hadn't considered, and missing information. It's like having an infinitely patient, detail-oriented peer reviewer.
5.  **Refining the Master Spec:** I take these questions, think through the answers, and then feed those answers and clarifications back into the *original* AI Studio chat – the one that holds the "master" context of our evolving spec.
6.  **Iteration is Key:** We went back and forth. For Vibe Meter, this helped us realize we needed to be very specific about how we'd get the Cursor `teamId` and the exact cookie name (which turned out to be `workos_cursor_session`). This led to a bit of live "API archeology" using browser dev tools – inspecting Cursor's own web app's network requests during login, when viewing usage, etc. We found the `/me` endpoint for user details and the `getMonthlyInvoice` call (a POST request, interestingly) which contained the team ID and costs (in cents).
7.  **Nailing Down Technicals:** We also layered in technical constraints: Swift 6 for the Mac app (because why not use the latest?), latest macOS only, Swift Test for unit tests, a strict "menu bar only, no Dock icon" policy, and for the Electron version, a clear directive to use TypeScript and React.

This process of letting an AI help refine the input for *another* AI (or even itself in a later stage) is a cornerstone of "vibe coding." The better your spec, the less friction you'll have when it's time to generate actual code. Gemini's massive 1 million token context window is a godsend here; you can really build up a rich, detailed understanding within the chat.

### Phase 2: Unleashing the Coders – Cursor IDE, Parallel Builds, and My Bag of AI Tricks

With a spec that felt reasonably robust (for a live demo!), it was time to fire up Cursor, my AI-first IDE of choice, and actually generate some code.

**Going Parallel – Mac & Electron Simultaneously:**
I'd already set up a GitHub repo for "Vibe Meter" and, within it, two distinct folders: `VibeMeter-Mac` and `VibeMeter-Electron`. The plan was to build both in parallel, so I opened two separate Cursor IDE windows, one pointed at each sub-project.

1.  **For the Mac App (SwiftUI):**
    *   In the Cursor window for `VibeMeter-Mac`, I started a new chat.
    *   Pasted our full, refined specification.
    *   Selected the Gemini model within Cursor (it's one of several you can choose).
    *   The prompt was straightforward: *"You are an AI tasked with building a Mac app based on this software specification. Generate the project and all necessary files."*
2.  **For the Electron App (TypeScript/React):**
    *   In the `VibeMeter-Electron` Cursor window, I did the same but with a crucial addition to the prompt: *"We also want to build a version of this using Electron. Any technical choices in the spec that were Swift-only should be replaced with good cross-platform alternatives. Use TypeScript and React for the implementation."*

And then, the magic (and sometimes the madness) begins. You hit "go," and the AIs start chugging away, planning steps, creating files, and writing code.

**Dealing with the "Continue Monkey" – And My Solution, [CodeLooper](https://codelooper.app):**
One of the current papercuts in these AI-driven IDEs is the generation loop. They'll work for a bit, then pause, often requiring a manual click on a "Continue" button. This can be due to internal limits (Cursor sometimes has a 25-turn limit before pausing), connection hiccups, or the AI just needing a moment to plan its next multi-step move.

This constant need to babysit the "Continue" button is why I'm building a side-project called "[CodeLooper](https://codelooper.app)." It's a Mac menu bar app that uses a combination of screen capture, accessibility APIs, and even JavaScript injection (since Cursor itself is an Electron app) to detect when a generation loop has paused and, if it deems it safe, automatically click "Continue" for me. It's still a work in progress, but the goal is to achieve longer, truly unattended generation sessions. For this workshop, though, I was the designated "Continue Monkey."

**MCPs – My Custom Toolkit for Supercharging Cursor:**
Cursor allows you to define "MCPs" (which I think of as "More Capable Prompts" or "More Capable Tools"). These are essentially custom functions or external tools the AI agent within Cursor can choose to call. I've been building out a suite of these to give the AI more leverage:

*   🧠 **[Claude Code](https://github.com/steipete/claude-code-mcp)**: This is a big one. It allows the Gemini agent in Cursor to delegate specific tasks to Anthropic's Claude Code running in my terminal (often in "YOLO mode," where I pre-authorize it to bypass permission prompts for shell commands – live dangerously, right?). This is fantastic for playing to each AI's strengths. If Cursor gets stuck or I want Claude's deeper reasoning on a complex refactor, I can have Gemini call out. It's also cost-effective if you're on Claude's flat-rate subscription. A buddy for your IDE that your agent can ask if he's stuck. Can do coding tasks and offer "a pair of fresh eyes" that often un-stucks the loop.
*   👻 **[Peekaboo](https://github.com/steipete/Peekaboo)**: Enables your IDE to make screenshots and ask questions about images. For example: *"Is this settings screen blank? Does the button look enabled?"* This is a step towards visual self-correction.
*   🐱 **[Conduit](https://github.com/steipete/conduit-mcp)**: Advanced file manipulation for faster refactoring. Provides more robust and reliable file system operations (creating directories, moving files, bulk reading/writing) than what the AI might try with basic terminal commands.
*   🤖 **[Terminator](https://github.com/steipete/Terminator)**: Manages a Terminal outside of the loop, so processes that might get stuck don't break the loop. Crucial for web development. If the AI needs to run a dev server (`npm run dev`), this MCP runs it in a properly detached, non-blocking external shell. This prevents the main AI generation loop from getting stuck waiting for a server process that never exits on its own.
*   🎯 **[Automator](https://github.com/steipete/macos-automator-mcp)**: AppleScript for your IDE.

These MCPs are about extending the AI's reach and making it more autonomous in a practical development workflow.

**Choosing Your Fighter – AI Models in Cursor:**
Cursor offers a selection of underlying LLMs, and I switch between them based on the task:

*   **Gemini 2.5 Pro (May 6 Update):** This is my workhorse for most code generation within Cursor. It strikes a great balance of intelligence, speed, and cost.
*   **o3:** This is what I call my "Dark Knight." It's incredibly smart, uncannily good at reasoning through complex problems, but it's *significantly* more expensive. I reserve o3 for when I'm truly stumped on a gnarly bug. You feed it the problem, and it often goes silent for a bit, "planning its next moves," reading more of your codebase, and then, like that brilliant but slightly arrogant senior dev, it'll often just present the solution with minimal fuss. It almost *always* cracks the problem.
*   **Claude Opus:** Also very capable. I find it sometimes a bit more prone to "vision quests" – deviating from the original task if it hits a snag, or getting stuck in its own reasoning loops (like repeatedly trying to downgrade a library if it encounters an issue with a newer version). But for certain types of refactoring or generation, it's excellent.

During the initial generation, the Mac app (SwiftUI) ran into some turbulence. Swift 6 has tightened up its concurrency rules considerably (Sendability, `@MainActor` isolation), and there's simply less Swift 6 example code out in the wild for the models to have trained on. This meant more iteration was needed. The Electron app, on the other hand, initially started life as JavaScript because, in my haste, I forgot to explicitly re-state TypeScript in the main project generation prompt (the spec mentioned it, but the top-level instruction to the AI didn't). A good lesson: be explicit, even if it feels redundant. I later instructed it to convert the whole thing to TypeScript.

### Phase 3: The Intricate Dance of Debugging, Refinement, and Iteration

This is where "vibe coding" truly comes alive. The AI isn't a magic wand that spits out perfect, production-ready code on the first try. Far from it. The initial output will have bugs, missing pieces, UI that needs a loving touch (or a complete overhaul), and architectural decisions you might want to revisit. The beauty is how *fast* you can iterate with AI as your partner.

**Navigating the Unscripted Path – Workshop Highlights:**

*   **Taming Xcode's Beast (The `.pbxproj` file):** Xcode project files are notoriously complex. Rather than having the AI in Cursor wrestle with directly manipulating that XML monstrosity, I took a different route for the Swift app. I opened a separate terminal window and used my `claude-code-mcp` to have Claude Code set up the project using **Tuist**. Tuist is a fantastic open-source tool that generates Xcode projects from a much simpler Swift-based manifest file and a conventional folder structure. I even pointed Claude to another project of mine that already uses Tuist, essentially saying, "Use this as a template." This is a great example of using the right tool (and AI) for the right job.
*   **Icons, Because Aesthetics Matter (Eventually):** While the AI was churning, I popped over to an image generation model (like DALL-E, accessible through ChatGPT or other interfaces) and prompted it for app icon ideas: *"Vibe Meter, cost control app, macOS, cool, modern."* Then, more specifically for the menu bar: *"Monochrome, tintable, simple lines, Mac OS menu bar icon for a cost tracking app."* Got some decent starting points.
*   **Live Debugging – The Swift App's Journey:**
    *   **The Main Actor Crash:** Sure enough, the app crashed on first launch. The culprit? A `UNUserNotificationCenter` delegate callback was firing on a background thread, but trying to update UI or state that was (correctly) marked as `@MainActor` isolated. Classic Swift concurrency. I switched the active model in that Cursor chat to o3 (the Dark Knight!), fed it the crash log and a brief explanation, and o3, true to form, pinpointed the issue and applied the fix: judicious use of `nonisolated` on the delegate conformance and wrapping the UI-touching callback code in a `Task { @MainActor in ... }` block. Problem solved in minutes.
    *   **Menu Bar Shenanigans:** Initially, the menu bar displayed the text "Login Required" when not logged in, instead of our nice (placeholder) icon. A quick clarification to the AI sorted that.
    *   **The Off-By-One API Bug:** The API call to fetch the cost data was consistently returning an empty dataset or an error. This was a head-scratcher. By adding some logging and then carefully inspecting the JSON payload from Cursor's *actual* web interface (using browser dev tools), we spotted it: our app was correctly getting the current month (e.g., May as `5`), but the Cursor API expected months to be *zero-indexed* (so May should be `4`). A classic off-by-one! I took screenshots of my logging output and the browser's network inspector, pasted them into the chat, and explained the discrepancy. The AI got it immediately and adjusted the date calculation.
    *   **UI Polish:** The initial settings screen was… functional. A prompt like, *"Make this settings screen look more like a native, clean macOS settings panel, using standard SwiftUI controls,"* led to a much-improved version.
*   **Live Debugging – The Electron App's Adventure:**
    *   **Test Setup:** Playwright tests were part of the spec, and the AI set them up, but they needed some initial nudging to run correctly.
    *   **Styling Woes:** The Electron settings screen was unstyled for a bit. *"It looks like the CSS for the settings dialog isn't loading correctly. Please investigate and fix."*
    *   **Login Logic:** Getting the web view in Electron to correctly capture the session cookie after a successful login and then trigger the necessary API calls required a few rounds of refinement.
*   **My General AI Debugging & Refinement Workflow:**
    *   **Screenshots are Your Best Friend:** Seriously, a picture (or a screenshot of a crash log/weird UI) is worth a thousand words to these multimodal AIs. They can often "see" the problem.
    *   **Focused, Iterative Prompts:** Instead of massive, multi-point requests, I tend to give short, focused instructions: *"Fix this crash."* *"Change the button color to blue."* *"Refactor this function to be more readable."*
    *   **Delegate Complex Refactors to Claude Code (CLI):** For bigger tasks like adding linters (we integrated SwiftLint for Swift and ESLint/Prettier for the Electron app) or that big "JavaScript to TypeScript" conversion for the Electron app, I often switch to a terminal and let Claude Code handle it. It excels at these broader, codebase-wide transformations and tends to run for longer stretches without needing intervention.
    *   **Embrace AI Self-Correction:** Often, the AI will generate code *and* tests for that code. If the tests fail, and the AI understands the failure in relation to the spec it was given, it can often figure out the bug in its own generated code and fix it. This self-correction loop is powerful.

Throughout this three-hour whirlwind, I was an orchestrator, a prompter, a quality checker, and a debugger-by-proxy. I wrote **zero** lines of functional code myself. All the Swift, TypeScript, HTML, CSS, JSON configs – everything came from the AI, guided by my prompts and the initial spec.

### The Outcome: Two (Mostly) Functional Apps and a Whole Lot of Vibe

So, after about three hours of intense, unscripted, AI-driven development, where did we land?

*   **Vibe Meter (Mac - SwiftUI):**
    *   It launched! The menu bar icon appeared (though we wrestled a bit to get the custom PNG to show consistently; sometimes it defaulted to text).
    *   Clicking it revealed my current (mocked, then actual) Cursor spending (e.g., "$895.72") and my company name ("Amatøs Måchinå" – a little inside joke).
    *   The login flow worked: it presented a web view for Cursor's login page, successfully captured the session cookie upon successful login, and securely stored it in the macOS keychain.
    *   It then correctly used that cookie to hit Cursor's internal `/me` endpoint (to get my user details) and the `getMonthlyInvoice` endpoint.
    *   On refresh? A delightful "VIBE SYNCED ✨" message in the menu. That was pure AI flair, and I loved it.
    *   The settings screen was functional and looked decent after a few rounds of UI prompting: currency selection (PHP, EUR, USD all present!), spending limits, and a refresh interval.
    *   And yes, it correctly registered itself to launch at login.
*   **Vibe Meter (Electron - TypeScript/React):**
    *   This one was a bit further behind but definitely taking shape. It launched, and the basic React structure was there.
    *   Login was partially implemented, and the cookie capture was on its way.
    *   The settings screen existed but needed more UI love (some CSS wasn't loading correctly when I last left it).
    *   It would need a bit more focused prompting to reach feature parity with the Mac app, but the foundation was solidly laid.

In total, the AIs probably generated something in the ballpark of 5,000 lines of Swift and around 2,000 lines of TypeScript, JavaScript (before conversion), HTML, and CSS, not to mention all the configuration files, test setups, and package manifests.

### Key Takeaways & My Developing "Vibe Coding" Philosophy

This workshop wasn't just about the Vibe Meter app itself; it was about demonstrating a *way* of working, a new "vibe" for software development. Here are my big takeaways, which are constantly evolving:

1.  **AI as a Force Multiplier, Not a Replacement:** Let's be clear: this isn't about AI taking our jobs. It's about giving us superpowers. The ability to explore ideas, build prototypes, and even flesh out significant features at 10x, 20x, or even greater speed is transformative. You become an architect, a guide, a refiner.
2.  **Code Becomes Cheaper, Iteration Becomes Faster:** This is a profound mental shift. In the past, if I spent days crafting a feature, I'd be heavily invested in that code. Ripping it out or taking a completely different approach felt costly. Now? If an AI generates a component in 20 minutes and it's not quite right, or I have a better idea, I can tell it to refactor it, or just scrap it and try again with a new prompt. The cost of experimentation plummets. This frees you to explore more avenues.
3.  **Focus Your Energy on the Hard Problems:** You can delegate a huge amount of boilerplate, initial scaffolding, CRUD operations, or even well-defined, common features to the AI. This frees up your precious cognitive cycles to focus on the truly novel, complex, and differentiating aspects of your product – the parts that require deep human insight and creativity.
4.  **Accelerated Learning in Unfamiliar Territory:** This is huge for me personally. I'm primarily a native developer. But with AI, I've been able to dive into web technologies like TypeScript, React, and Tailwind CSS much faster than I ever could have traditionally. The AI can explain concepts, generate example code, show best practices, and help debug my newbie mistakes. It's like having an infinitely patient tutor.
5.  **The AI is Your "Brilliant but Quirky" Teammate:** Think of the current generation of AI tools as incredibly knowledgeable, super-fast junior-to-mid-level developers who sometimes act like autistic savants. They can produce amazing work, have access to a vast corpus of knowledge, but they can also misunderstand requirements, hallucinate APIs that don't exist, get stuck on seemingly simple things, or rigidly adhere to an incorrect assumption. Your job is to learn their strengths, weaknesses, and how to "manage" them effectively through clear prompting and iterative feedback.
6.  **Prompt Engineering is the New Core Skill:** The quality of your interaction with the AI directly dictates the quality of the output. This isn't just about typing a question; it's about crafting clear, unambiguous specifications, providing good examples, giving constructive feedback, knowing when to break down a problem into smaller steps for the AI, and understanding how to guide its reasoning process.
7.  **Horses for Courses – Choosing Your AI Tools Wisely:**
    *   **Google AI Studio (with Gemini):** My go-to for initial, comprehensive spec generation and refinement. That massive context window and less restrictive output format are invaluable for laying a strong foundation.
    *   **Cursor IDE:** Fantastic for the main development loop – iterative code generation, interactive debugging, and the ability to quickly switch between different AI models (like Gemini for speed/cost, and o3 for those really tough nuts to crack) within the context of your actual project files.
    *   **Claude Code (Anthropic's CLI tool):** A powerhouse for large-scale, codebase-wide refactoring (like adding linters, converting languages, or enforcing style guides). It tends to be very thorough and can run for extended periods on a single, complex task.
8.  **The Power of Context Cannot Be Overstated:** LLMs are all about their context window. The more relevant information you can feed them – detailed specs, existing code snippets, error messages, screenshots, links to relevant documentation or GitHub repositories – the better their output will be. This is why Gemini 1.5 Pro's 1 million token window (and even larger ones on the horizon) are such game-changers.
9.  **Don't Be Afraid to Explore the Obscure:** Even if you're working with a less common language or a niche problem, don't assume AI can't help. I showed a quick example of using a `Repo-to-Text` converter tool to dump an entire Zig language GitHub repository into a flat text file, which I then uploaded to AI Studio. Gemini was then able to explain the project's purpose, its architecture, and even answer specific questions about the Zig code, all in pirate speak for a bit of fun!
10. **Rethinking Cost vs. Value:** Yes, these AI tools have a cost. As I mentioned, I'm spending around $1100 a month right now between Cursor, direct API access, and Claude subscriptions. But you *have* to weigh that against the value of your time and the sheer increase in output. If these tools allow me to build 10x or 20x more, or explore ideas that would have been too time-consuming before, the ROI is a no-brainer. Your time is valuable; AI helps you leverage it far more effectively.

### The Future is Now – Go Vibe with It!

This is not some far-off future; this is what's possible *today*. The tools are evolving at a dizzying pace. The way we conceive, design, and build software is undergoing a fundamental shift.

My advice? Don't wait. Dive in. Pick a small side project, something fun. Start experimenting with these tools. Learn how to prompt, how to iterate, how to "vibe" with your AI coding partner. See for yourself how it can transform your workflow, your learning, and your creative output.

As for Vibe Meter? I'm definitely going to take the Mac app, polish it up (with more AI help, of course!), and integrate its core cost-tracking logic into my "[CodeLooper](https://codelooper.app)" project. The cycle of AI-assisted creation continues.

Thanks for joining me on this live-coding adventure. Now, go build something cool!