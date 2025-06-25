---
title: "My AI Workflow for Understanding Any Codebase"
description: "A quick tip on how I use repo2txt and Google AI Studio to understand new codebases. Gemini's 1M token context window is perfect for asking questions about code."
pubDatetime: 2025-06-25T12:30:00+02:00
heroImage: "/assets/img/2025/understanding-codebases-with-ai-gemini-workflow/header.png"
heroImageAlt: "Google AI Studio with repo2txt markdown loaded for code analysis"
tags: ["ai", "productivity", "coding", "gemini", "development"]
---

**TL;DR**: Convert GitHub repos to markdown with [repo2txt](https://repo2txt.simplebasedomain.com/), drag into [Google AI Studio](https://aistudio.google.com/prompts/new_chat), and ask questions. Gemini's massive context window makes it amazing for code comprehension.

## The Problem

Whenever I want to understand a new codebase, the absolute best way I found is using agents. Here's my workflow:

**Step 1**: Go to [repo2txt](https://repo2txt.simplebasedomain.com/) and paste in a GitHub repository URL. It gives you the full tree of the project. Select all the source code files that interest you. For the best result, skip tests, add documentation and sources. *Definitely skip images*, they'd be pulled in as base64 and will freeze your browser's JS engine and clutter up the context.

**Step 2**: Go to [Google AI Studio](https://aistudio.google.com/prompts/new_chat), drag in the markdown file, and start asking questions like:
- "What's notable about this project?"
- "How did they solve **this thing you are curious about**?"

But this workflow isn't just for understanding existing code, it's become my secret weapon for creating new projects too.

## From Idea to SDD

Whenever I start a new project, I'll paste all my ideas into AI Studio. These days I mostly dictate via [Wispr Flow](https://wisprflow.ai/) - Gemini is incredibly good to understand and convert my ideas into a Software Design Document. During my research I'll often find other oss projects that solve similar things, so I drag in the compiled markdown and ask Gemini things like 

> Which edge cases are implemented here that I didn't think of?

## The Two-Context Technique

Once I am happy with the output, I copy the markdown, paste it into a fresh Gemini context and ask it to take the spec apart. These questions I copy back into the original Gemini context to improve the SDD. We play that back-and-forth game a few times. Often Master-Gemini already has the answers as it has more context from previous discussions, sometimes I have to add new thoughts or pick the edge case option.

After a few rounds, you get a bullet-proof multi-hundred line spec.md that you can give Claude Code or another agent to build in a loop - just let it work a few hours till it's done.

Here's [an example of the spec](https://github.com/steipete/peekaboo/blob/main/docs/spec.md) I used to build [Peekaboo - an MCP to give your agent eyes/screenshots](https://www.peekaboo.boo/). The best part about Peekaboo? It uses it's own agent to prevent cluttering up your context.

Wanna see me in action? Here's [a video where I do the whole process from idea to final app](https://steipete.com/posts/2025/the-future-of-vibe-coding). I used Cursor back then, but would use Claude Code now, as it loops much longer without interrupts. Maybe I'll use [Gemini CLI](https://blog.google/technology/developers/introducing-gemini-cli-open-source-ai-agent/) in the future. [AI moves so fast!](https://x.com/steipete/status/1937919798740214023)

## The Code is the Spec

Heck, I restarted an old side project of mine by simply giving Gemini the whole unfinished SwiftUI project (500k tokens!) and told it to generate an SDD from that, but use web tech for it + rebuild in TypeScript. The code **is** the spec. (blacked out some secrets, something for a future blog post...)

![Software Design Document in Google AI Studio](/assets/img/2025/understanding-codebases-with-ai-gemini-workflow/sweetistics-sdd.png)

## Alternatives: DeepWiki, RepoMix & Co

An honorable mention: [DeepWiki](https://deepwiki.com/) is surprisingly great at understanding a codebase and includes a free agent. For example, here's [VibeTunnel on DeepWiki](https://deepwiki.com/amantus-ai/vibetunnel). [VibeTunnel is my current focus](/posts/2025/vibetunnel-turn-any-browser-into-your-mac-terminal), it turns any browser into your terminal to command your agents (like Claude Code or Gemini CLI) on the go.

The downside: you can't mix and match multiple repositories, Gemini rules for that.

Honorable mentions also to [Gitingest](https://gitingest.com/) and [Repomix](https://repomix.com/). They have the better design, but aren't as efficient in choosing exactly the files you want. You get better results if you keep Gemini's context focussed.

As to alternatives to Google's AI Studio, I haven't found anything that comes close. OpenAI has great models, but they really don't want to write 500-line markdown files.

## That's It!

There's a lot of people on Twitter and Mastodon that ask me about my workflows, so whenever I find a process that works for me, I'll make a blog post and share it with you. Wanna be the first to hear about it? Follow [@steipete](https://twitter.com/steipete) and sign up for my newsletter.

---
Now go and build something amazing, or join me & the [VibeTunnel Team](/posts/2025/vibetunnel-turn-any-browser-into-your-mac-terminal#motivation).
We'll make sure your agents won't know what hit them!
