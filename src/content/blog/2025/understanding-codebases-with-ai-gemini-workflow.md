---
title: "My AI Workflow for Understanding Any Codebase"
description: "A quick tip on how I use repo2txt and Google AI Studio to understand new codebases. Gemini's 1M token context window is perfect for asking questions about code."
pubDatetime: 2025-06-25T12:00:00+00:00
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

Once I am happy with the output, I copy the markdown, paste it into a fresh Gemini context and ask it to take the spec apart with this specific prompt:

> Take this SDD apart. Give me 20 points that are underspecified, weird, or inconsistent.

These questions I copy back into the original Gemini context to improve the SDD. I always return to the original context because it has the full history of how we arrived at the spec—context that would be lost in the critique window. We play this back-and-forth game for 3-5 rounds. Often Master-Gemini already has the answers as it has more context from previous discussions, sometimes I have to add new thoughts or pick the edge case option.

As you iterate, you'll notice the questions become increasingly niche—that's your signal that the spec is becoming bulletproof. After these rounds, you'll have a comprehensive SDD, typically around 500 lines, that captures every detail of your vision.

## From SDD to Implementation

Once your SDD is complete, implementation becomes almost trivial:

1. Save the final spec as `docs/spec.md` in your repository
2. Open Claude Code and simply prompt: "Build spec.md"
3. Let it run for 2-4 hours
4. Review and iterate on the results

The beauty of this approach is that Claude Code doesn't need complex prompting or hand-holding—the spec contains everything it needs. The clear, detailed specification eliminates ambiguity and lets the AI focus on implementation rather than guessing your intent.

Here's [an example of the spec](https://github.com/steipete/peekaboo/blob/main/docs/spec.md) I used to build [Peekaboo - an MCP to give your agent eyes/screenshots](https://www.peekaboo.boo/). The best part about Peekaboo? It uses its own agent to prevent cluttering up your context. From spec to working product: just a few hours of letting Claude Code do its thing.

Wanna see me in action? Here's [a video where I do the whole process from idea to final app](https://steipete.com/posts/2025/the-future-of-vibe-coding). I used Cursor back then, but would use Claude Code now, as it loops much longer without interrupts. Maybe I'll use [Gemini CLI](https://blog.google/technology/developers/introducing-gemini-cli-open-source-ai-agent/) in the future. [AI moves so fast!](https://x.com/steipete/status/1937919798740214023)

## Dealing with Context Loss During Refinement

One challenge you might encounter: as you refine your spec through multiple iterations, AI tools can hit their output token limits and start dropping earlier context. This "context amnesia" means critical requirements from your initial spec might disappear in later versions—a problem my friend Bruno Virlet pointed out when using Gemini for spec refinement.

The solution? Instead of asking for one massive spec revision, break it down:

1. **Generate in logical blocks**: Request specific sections separately
   - "Generate the architecture overview"
   - "Generate the API specifications"
   - "Generate the data model requirements"
2. **Maintain a master document**: Manually concatenate outputs, ensuring nothing gets lost
3. **Create a requirements checklist**: Track key features across iterations

This block-based approach ensures you maintain control over your spec's evolution while leveraging AI's analytical capabilities without losing critical details in the process.

## The Code is the Spec

Heck, I restarted an old side project of mine by simply giving Gemini the whole unfinished SwiftUI project (500k tokens!) and told it to generate an SDD from that, but use web tech for it + rebuild in TypeScript. The code **is** the spec. (blacked out some secrets, something for a future blog post...)

![Software Design Document in Google AI Studio](/assets/img/2025/understanding-codebases-with-ai-gemini-workflow/sweetistics-sdd.png)

## Alternatives: DeepWiki, RepoMix & Co

An honorable mention: [DeepWiki](https://deepwiki.com/) is surprisingly great at understanding a codebase and includes a free agent. For example, here's [VibeTunnel on DeepWiki](https://deepwiki.com/amantus-ai/vibetunnel). [VibeTunnel is my current focus](/posts/2025/vibetunnel-turn-any-browser-into-your-mac-terminal), it turns any browser into your terminal to command your agents (like Claude Code or Gemini CLI) on the go.

The downside: you can't mix and match multiple repositories, Gemini rules for that.

Honorable mentions also to [Gitingest](https://gitingest.com/) and [Repomix](https://repomix.com/). They have better design, but aren't as efficient in choosing exactly the files you want. You get better results if you keep Gemini's context focused.


As to alternatives to Google's AI Studio, I haven't found anything that comes close. OpenAI has great models, but they struggle with generating the comprehensive 500-line markdown files that make this workflow sing. Gemini's massive context window and willingness to produce detailed documentation is unmatched for this use case.

## That's It!

There's a lot of people on Twitter and Mastodon that ask me about my workflows, so whenever I find a process that works for me, I'll make a blog post and share it with you. Wanna be the first to hear about it? Follow [@steipete](https://twitter.com/steipete) and sign up for my newsletter.

---
Now go and build something amazing, or join me & the [VibeTunnel Team](/posts/2025/vibetunnel-turn-any-browser-into-your-mac-terminal#motivation).
We'll make sure your agents won't know what hit them!
