---
title: "Live Coding Session: Building Arena"
description: "Watch me build Arena live - a real-time collaborative coding session exploring AI-powered development workflows"
pubDatetime: 2025-09-06T12:00:00+02:00
heroImage: /assets/img/2025/live-coding-session-building-arena/hero.jpg
tags: ["live-coding", "arena", "development", "ai", "productivity"]
---

Join me for an unfiltered look at building Arena - a live coding session where you can see the real development process in action. No scripts, no perfect outcomes, just authentic problem-solving and coding as it happens.

**I built and shipped a brand‑new feature live (in \~1 hour). Here's the play‑by‑play + what I learned.**

{% youtube https://www.youtube.com/watch?v=68BS5GCRcBo %}

This AI-assisted development session captures the messy, iterative nature of real development work - the debugging, the false starts, the moments of breakthrough, and everything in between. Whether you're curious about AI-assisted development workflows or just enjoy watching code come to life, this raw footage shows what building software actually looks like.

### TL;DR

* Built **"Arena"**: pick up to four X (Twitter) users, fetch recent tweets (capped at \~1,000 total), analyze working style/interests, and compute **compatibility scores** (pairwise + team).
* Did it with **AI agents** (GPT "Codex" for repo‑aware coding), **no branches**, heavy linting/formatting, and a few glue CLIs.
* Key moves: **keep context clean**, **let the agent read the repo**, **cache long jobs**, **paste errors back in**, **write tests after** to catch drift.
* Result: working POC, with a couple of fun bugs (e.g., team score mismatch) found and fixed on‑air.

## What we built (live)

* **Feature:** *Arena* — compare 2–4 users from X

  * **Input:** user handles
  * **Pipeline:** fetch N tweets per user (shares a 1,000‑tweet budget), strip to necessary fields, run profile analysis, then **score compatibility** (per pair + whole team)
  * **UX:** user picker + "Analyze" button, results table, cached runs selectable under the search box
  * **Infra touches:** DB migration for `arena_cache`, long‑running job in the background, streaming UI, auth‑guarded page

First run produced a **pair score of 89** and a **team score of 88** (which uncovered a small logic mismatch we then corrected).

## Stack & setup (quick tour)

* **Model workflow:** GPT "Codex" for coding sessions; it eagerly **reads the codebase** and generally "does the right thing" without handheld file lists. I keep a separate Claude‑style flow for some web searching, but for repo work Codex was the star.
* **Sessions:** start *fresh* for big features, run **multiple agent windows** in parallel; switch tasks while one is thinking.
* **Branching:** work **directly on `main`** with **atomic commits**. Merge conflicts + worktrees cost speed; small, well‑scoped commits keep things safe.
* **Tooling:**

  * **Ghostty** for terminals, split panes with agents
  * **Better Stack** logging via a tiny [**`bslog`**](https://github.com/steipete/bslog) CLI
  * An **`xcel`** CLI (thin `curl` wrapper) for quick API pulls
  * Strict **Biome** rules + custom codemods to normalize output
  * **Background worker** for long jobs (analysis runs)
  * **Cache table** to avoid recompute
* **Docs ingestion:** pull only what's needed, prefer **markdown** via a crawler over raw HTML to save tokens.
* **Validation:** schema validation on inputs; fail fast and surface helpful messages.

## How the live build unfolded

1. **Prompt the plan:** "Build 'Arena' with a 4‑user picker, cap total tweets at 1,000, fetch/store text only, analyze styles/interests, compute pair + team compatibility, cache results."
2. **Scaffold:** routes, server handlers, DB migration (`arena_cache`), UI entry in the top nav, background job.
3. **Hook it up:** enable streaming, add UI state for running jobs, list cached runs under the picker.
4. **Run it:** hit a few real‑world snags:

   * Autocomplete not wiring to shared layout → **refactor to the app layout** used elsewhere.
   * **Unauthorized** API error → verify session + switch to **dev env**, then **run the migration**.
   * A **validation error** ("slot"/schema mismatch) → fix types and re‑run.
   * **Team score ≠ pair score** when only two users → unify scoring logic.
5. **Tight debug loop:** paste console/server errors **directly into the agent**; it patches fast because the whole repo context is live.
6. **Add quality net:** ask the agent to **write tests after the feature**—good at catching its own drift.

## Tactics that mattered (and you can reuse)

* **Keep the model's head in your repo.** Minimize tool noise and only inject docs when needed; markdown > HTML to conserve context.
* **Let Codex plan or "plan‑only" on demand.** It proposes next steps that are usually solid; green‑light them in sequence.
* **Cache long tasks early.** Add a table + background job queue before you polish UI; this saves you from re‑running expensive analysis.
* **Copy‑paste errors verbatim.** Don't over‑explain; just drop logs in and let the agent fix what broke.
* **Comments as spec.** Ask for clear intent comments near tricky code; they're for you and for the agent on the next session.
* **Write tests afterwards, not first.** These agents are great at back‑filling tests once the shape exists, and that's usually enough to catch regressions.
* **Work on `main`, commit surgically.** You still get speed with safety. Backups + Git are your airbags.
* **Avoid local models for this workload.** Context and stability matter more than shaving milliseconds.
* **CLIs beat MCP sprawl.** A 2‑hour CLI wrapper (logs, API pulls) pays for itself and keeps context small.
* **Small "proof" projects unblock big features.** If streaming or a protocol is hard, build a tiny in‑repo example that works, then transplant.

## Mini‑playbook (the prompts that worked)

* **Scaffold + constraints**

  * "Create an 'Arena' page with a multi‑user picker (2–4 users), 'Analyze' button, stream progress. Cap inputs to 1,000 tweets across users; keep only the tweet text. Cache results in `arena_cache` with user ids, counts, and the analysis JSON. Add nav entry between 'Tweets' and 'Chat'."
* **Background processing**

  * "Move the analysis to a background job; page shows job state, disables 'Analyze' while running, and offers a list of cached runs for quick load."
* **Validation & tests**

  * "Add strict input validation for handles and limits; write tests that cover: 2 users, 4 users, >1,000 tweet attempts (should clamp), cached‑results path, and streaming failure fallback."
* **Bug‑fix loop**

  * "Here's the exact error from the server/devtools: <paste> — fix and explain the change."

## Q\&A highlights (condensed)

* **Why Codex over Claude Code?** Codex actually **reads more of the repo** without handholding; requires fewer "look here, then there" hints. Claude still useful for search/web, but for coding Codex felt faster end‑to‑end.
* **Do you branch?** Not for features at this stage. **Main + disciplined commits** is faster and—counterintuitively—safer for rapid iteration.
* **Manual approvals for agent actions?** No. That becomes "Windows Vista prompts." Use Git + backups; review diffs; move fast.
* **Repo prompts & MCP servers?** Nice idea, but they bloat context and introduce fragility. **Lean instructions + small CLIs** work better.
* **Compaction & long sessions?** Plan features to **fit the context**. If you expect many loops (e.g., test repairs), use the flow that compacts well—or split the task.

## What broke (and how we recovered)

* **Auth guard missing** → reuse the shared layout that carries session state.
* **DB migration not applied** in dev → run it and retry immediately.
* **Schema/validation mismatch** → tighten validators and types; add tests to lock it in.
* **Streaming flakiness** → copy a minimal working streaming example from inside the repo and adapt.
* **Inconsistent scoring** for 2‑person teams → unify formula so **team score = pair score** when team size is 2.

