---
title: "My AI-Powered Codebase Understanding Workflow"
description: "A quick tip on how I use repo2txt and Google AI Studio to understand new codebases. Gemini's 1M token context window is perfect for asking questions about code."
pubDatetime: 2025-06-25T12:30:00+02:00
tags: ["ai", "productivity", "coding", "gemini", "development"]
---

**TL;DR**: Convert GitHub repos to markdown with [repo2txt](https://repo2txt.simplebasedomain.com/), drag into [Google AI Studio](https://aistudio.google.com/prompts/new_chat), and ask questions. Gemini's massive context window makes it amazing for code comprehension.

## The Problem

Whenever I want to understand a new codebase, the absolute best way I found is using AI—but with a specific workflow that actually works:

**Step 1**: Go to [repo2txt](https://repo2txt.simplebasedomain.com/) and paste in a GitHub repository URL. It gives you the full tree of the project. Select all the source code files that interest you (skip images—they'll just slow down your browser).

**Step 2**: Head to [Google AI Studio](https://aistudio.google.com/prompts/new_chat), drag in the markdown file, and start asking questions like:
- "What's interesting about this project?"
- "How did they solve this and this?"

## Why This Works

Gemini is amazing at coding. It has a 1 Mio token context window, and Google's AI Studio is a great work environment and unlike OpenAI's website, the system prompt is not heavily tiered for short outputs. You can easily create 500 line markdown files it - I use it not only for understanding code but also for creating [Software Design Documents](https://steipete.com/posts/software-design-documents/).

You can even drag in multiple repositories or additional research to build your own software or write specifications based on what you learn.

## Alternative: DeepWiki

An honorable mention: [DeepWiki](https://deepwiki.com/) is surprisingly great at understanding a codebase and includes a free agent. For example, here's [VibeTunnel on DeepWiki](https://deepwiki.com/amantus-ai/vibetunnel).

The downside: you can't mix and match multiple repositories like with the repo2txt workflow.

## That's It!

There's a lot of people on Twitter that ask me about my workflows, so whenever I have an idea of something that's really useful I'll make a new blog post and share it with the world!

---

_What's your workflow for understanding new codebases? Let me know on [Twitter @steipete](https://twitter.com/steipete)!_