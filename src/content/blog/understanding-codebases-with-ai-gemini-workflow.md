---
title: "AI-Powered Codebase Understanding"
description: "A quick tip on how I use repo2txt and Google AI Studio to understand new codebases. Gemini's 1M token context window is perfect for asking questions about code."
pubDatetime: 2025-06-25T12:30:00+02:00
tags: ["ai", "productivity", "coding", "gemini", "development"]
---

**TL;DR**: Convert GitHub repos to markdown with [repo2txt](https://repo2txt.simplebasedomain.com/), drag into [Google AI Studio](https://aistudio.google.com/prompts/new_chat), and ask questions. Gemini's massive context window makes it amazing for code comprehension.

## The Problem

Whenever I want to understand a new codebase, the absolute best way I found is using agents. Here's my workflow:

**Step 1**: Go to [repo2txt](https://repo2txt.simplebasedomain.com/) and paste in a GitHub repository URL. It gives you the full tree of the project. Select all the source code files that interest you. For the best result, skip tests, add documentation and sources. Definitely skip images, they'd be pulled in as base64 and might freeze your browser.

**Step 2**: Go to [Google AI Studio](https://aistudio.google.com/prompts/new_chat), drag in the markdown file, and start asking questions like:
- "What's notable about this project?"
- "How did they solve **thing you are curious about**?"

## Why This Works

Gemini is amazing at coding. It has a 1 Mio token context window, and Google's AI Studio is a great work environment and unlike OpenAI's website, the system prompt is not heavily tiered for short outputs. You can easily create 500 line markdown files it - I use it not only for understanding code but also for creating [Software Design Documents](https://steipete.com/posts/2025/the-future-of-vibe-coding).

You can even drag in multiple repositories, websites, whole books (!) or any other material you're trying to understand quickly.

## Alternative: DeepWiki

An honorable mention: [DeepWiki](https://deepwiki.com/) is surprisingly great at understanding a codebase and includes a free agent. For example, here's [VibeTunnel on DeepWiki](https://deepwiki.com/amantus-ai/vibetunnel).

The downside: you can't mix and match multiple repositories like with the repo2txt workflow.

Honorable mentions also to [Gitingest](https://gitingest.com/) and [Repomix](https://repomix.com/). They have the better design, but aren't as efficient in choosing exactly the files you want. You get better results if you keep Gemini's context focussed.

## That's It!

There's a lot of people on Twitter that ask me about my workflows, so whenever I have an idea of something that's really useful I'll make a new blog post and share it with the world!

---

_What's your workflow for understanding new codebases? Let me know on [Twitter @steipete](https://twitter.com/steipete)!_