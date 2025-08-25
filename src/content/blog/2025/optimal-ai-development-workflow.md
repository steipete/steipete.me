---
title: "The Optimal AI Development Workflow: Lessons from the Trenches"
description: "After extensive experimentation with AI coding tools, here's the battle-tested setup that actually works: Ghostty, Claude Code, strategic planning, and why less is often more"
pubDatetime: 2025-08-25T10:00:00+01:00
tags: ["ai", "claude", "development", "claude-code", "workflow", "productivity", "tools", "best-practices"]
---

After months of experimentation with every AI coding tool under the sun, I've finally settled on a workflow that actually delivers. Here's what works, what doesn't, and the hard-earned lessons from building production systems with AI assistance.

## The Core Setup: Stability Over Features

I've gone fully back to Ghostty for my main setup, with VS Code on the side for code lookups and Cursor/GPT-5 for reviews. VS Code's terminal proved too unstable—frequent freezes when pasting large amounts of text pushed me back to the reliability of Ghostty. Nothing beats a terminal that just works.

The tool landscape is evolving rapidly, but stability trumps features every time. Gemini can be brilliant, but its edit tools are too messy for production work. GPT-5 excels at reviewing plans but isn't the best agent—it's more literal in how you need to prompt it, requiring precision and specificity that slows down the flow.

## Working on Main: Controversial but Effective

Yes, all of these tools work directly on main. I tried the whole worktree setup—it just slows me down. If you pick areas of work carefully, you can work on multiple areas without much cross-pollination. The key is discipline and understanding your codebase's blast radius.

Claude often makes a mess, but it's equally great at refactoring and cleaning up. The important thing is to do both—create and clean—to avoid accumulating too much technical debt. It's a continuous cycle of generation and refinement.

## The Power of Planning and Context

Using plan mode and iterating is key. Smaller tasks I execute immediately, bigger ones I write in a file and let GPT-5 review. Having the initial topic in the statusbar plus session ID has been super helpful for switching accounts or restarting sessions when needed.

When I'm not refactoring, I usually run 1-2 agents. For cleanup, tests, and UI work, about 4 agents seems to be the sweet spot. It all depends on the blast radius of the work you're doing.

## The Human Element: What AI Can't Do

The hardest part remains distributed system design, picking the right dependencies and platforms, and designing forward-thinking database schemas. These architectural decisions require human judgment and experience that AI can't yet replicate.

I've been building an incredible amount of custom infrastructure—admin pages, CLIs to help both me and the agents—and that work has sped me up tremendously. I would never have invested this time with traditional development approaches, but the leverage it provides with AI assistance is game-changing.

## Testing: Context is Everything

Bigger changes always get tests. Automated test generation usually isn't great, but the model almost always finds issues when you ask it to write tests **in the same context**. Context is precious—don't waste it. Having the model write tests while it still has the implementation fresh in its context catches bugs that would slip through otherwise.

## Less is More: The MCP Lesson

I've even removed my last MCP server. Claude would sometimes spin up Playwright unasked when it could simply read the code—which is faster and pollutes the context less. The lesson: constraints often lead to better outcomes.

## Tool Selection: CLI-First

Pick services that have CLIs: Vercel, psql, gh, Axiom. Agents can use them effectively. One line in `CLAUDE.md` is enough: "logs: axiom or vercel cli" or "Database: psql + one example how to load env correctly so the loop is faster."

This approach has enabled me to get an insane amount done. Other CLIs and models still don't come close. Codex can't search effectively (asking "google best practices" is usually better than context). Cursor/GPT-5 takes forever and doesn't share its thinking, making it hard to steer.

## The Future: Why Background Agents Won't Work (Yet)

I still don't see how this could be moved to background agents. I steer the models constantly as I notice them drifting off—that's much harder if they run in the background. The human-in-the-loop aspect isn't a bug; it's a feature.

## The Reality Check

The new rate limits coming August 28 will definitely impact productivity. But there's no perfect alternative for now, so I'll just pay up. The value delivered still far exceeds the cost.

## Key Takeaways

1. **Stability over features**: Choose tools that work reliably over those with cutting-edge features
2. **Embrace the mess**: AI will create messes, but it's also great at cleaning them up
3. **Context is king**: Keep related work in the same context for better results
4. **Build infrastructure**: Invest in tooling that helps both you and the AI
5. **Human judgment matters**: Architecture and system design still require human expertise
6. **CLI-first services**: Choose platforms with robust command-line interfaces
7. **Active steering**: Stay engaged—background automation isn't ready yet

The perfect AI development workflow doesn't exist, but this setup has proven remarkably effective for shipping real products. The key is finding the right balance between AI assistance and human judgment, and being willing to adapt as the tools evolve.

*What's your AI development workflow? What tools have you found essential or overrated? Share your experiences—we're all figuring this out together.*