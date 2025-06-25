---
title: "My AI-Powered Codebase Understanding Workflow"
description: "How I use Google's AI Studio and repo2txt to quickly understand new codebases. A practical workflow that leverages Gemini's massive context window for code comprehension."
pubDatetime: 2025-06-25T12:30:00+02:00
tags: ["ai", "productivity", "coding", "gemini", "development"]
---

**TL;DR**: Convert any GitHub repository to markdown using [repo2txt](https://repo2txt.simplebasedomain.com/), then drag it into [Google AI Studio](https://aistudio.google.com/prompts/new_chat) to ask questions about the codebase. Gemini's 1M token context window makes it exceptional for understanding code structure and implementation details.

## The Problem with Understanding New Codebases

Whenever I dive into a new project, whether it's for evaluation, integration, or inspiration, I need to quickly understand how things work. Reading through files one by one is time-consuming, and documentation often doesn't answer the specific questions I have.

That's where AI comes in—but not just any AI workflow. I've found a specific combination that works incredibly well.

## My Two-Step Workflow

### Step 1: Convert Repository to Markdown

The first tool in my arsenal is [repo2txt](https://repo2txt.simplebasedomain.com/). This simple web tool converts any GitHub repository into a single markdown file.

Here's how I use it:

1. Paste the GitHub repository URL
2. Wait for it to generate the file tree
3. Select all the source code files that interest me (skip images, they'll just slow down your browser)
4. Download the markdown file

The beauty of this approach is that you get the full context of the project in a format that's perfect for AI consumption.

### Step 2: Analyze with Google AI Studio

Next, I head over to [Google AI Studio](https://aistudio.google.com/prompts/new_chat) and create a new chat. This is where the magic happens:

1. Drag the markdown file directly into the chat
2. Start asking questions

The questions I typically ask:
- "What's interesting about this project?"
- "How did they solve [specific problem]?"
- "What patterns are they using for [feature]?"
- "Show me how they implement [functionality]"

## Why Gemini Excels at This

Gemini has become my go-to for code analysis because:

- **Massive context window**: 1,000,000 tokens means you can analyze entire codebases
- **Excellent at code comprehension**: It understands code structure and can trace through implementations
- **Great for exploration**: Unlike documentation-focused tools, it helps you discover what you don't know to ask

One important note: While Gemini is amazing at understanding and explaining code, it's not the best for generating tests. Think of it as your documentation and exploration companion.

## Real-World Applications

This workflow has helped me in several scenarios:

### Understanding Implementation Details

When I need to understand how a library implements a specific feature, I can quickly get answers like:
- The exact flow of data through the system
- How edge cases are handled
- What design patterns are employed

### Building Specifications

By analyzing multiple similar projects, I can:
- Extract common patterns
- Understand different approaches to the same problem
- Create better specifications for my own implementations

### Quick Project Evaluation

When evaluating whether to use a library or framework:
- Assess code quality and structure
- Understand the complexity of integration
- Identify potential issues or limitations

## Pro Tips

1. **Token awareness**: AI Studio shows you the approximate token size. Modern models have plenty of capacity, but be mindful when including large files.

2. **Multiple repositories**: You can drag in multiple converted repositories to compare implementations or understand how different projects solve similar problems.

3. **Supplement with research**: Drag in additional documentation, blog posts, or research papers alongside the code for even better context.

4. **Focus on source code**: When selecting files in repo2txt, focus on source code rather than assets. Images and binary files will just consume tokens without adding value.

## Why This Works So Well

The combination of repo2txt's clean markdown output and Gemini's code comprehension capabilities creates a powerful analysis environment. You're not just searching for keywords—you're having a conversation about the code with an AI that has the entire codebase in context.

This approach has fundamentally changed how I approach new codebases. Instead of spending hours jumping between files and trying to piece together the mental model, I can get oriented in minutes and dive deep into the specific areas that matter to me.

## Alternative: DeepWiki

An honorable mention goes to [DeepWiki](https://deepwiki.com/), which offers a different approach. It's surprisingly great at understanding a codebase and even integrates a free agent for deeper analysis.

For example, here's [VibeTunnel analyzed on DeepWiki](https://deepwiki.com/amantus-ai/vibetunnel) - my latest project for turning any browser into a macOS terminal.

The main trade-off: While DeepWiki excels at single repository analysis with its integrated agent, you can't mix and match multiple repositories like you can with the repo2txt + Gemini workflow. Choose based on your needs:

- **DeepWiki**: Best for deep diving into a single repository with agent assistance
- **repo2txt + Gemini**: Best for comparing multiple codebases or when you need maximum flexibility

## Try It Yourself

Next time you need to understand a new codebase:

1. Head to [repo2txt.simplebasedomain.com](https://repo2txt.simplebasedomain.com/)
2. Convert the repository to markdown
3. Open [Google AI Studio](https://aistudio.google.com/prompts/new_chat)
4. Drag in the file and start exploring

Or give [DeepWiki](https://deepwiki.com/) a try for single-repository deep dives.

You'll be surprised how quickly you can understand complex codebases with these approaches.

---

_What's your workflow for understanding new codebases? Have you tried using AI tools for code comprehension? Let me know on [Twitter @steipete](https://twitter.com/steipete)!_