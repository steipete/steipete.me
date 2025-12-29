---
title: "Shipping at Inference-Speed"
description: "Why I stopped reading code and started watching it stream by."
draft: false
pubDatetime: 2025-12-28T12:00:00+01:00
tags: ["ai", "codex", "workflow"]
---

## What Changed Since May

It's incredible how far "vibe coding" has come this year. Whereas in ~May I was amazed that *some* prompts produced code that worked out of the box, **this is now my expectation**. I can ship code now at a speed that seems unreal. I burned [a lot of tokens](https://x.com/thsottiaux/status/2004789121492156583) since then. Time for an update.

It's funny how these agents work. There's been this argument a few weeks ago that one needs to write code in order to feel bad architecture and that using agents creates a disconnection - and I **couldn't disagree more**. When you spend enough time with agents, you know exactly how long sth should take, and when codex comes back and hasn't solved it in one shot, I already get suspicious.

The amount of software I can create is now mostly **limited by inference time and hard thinking**. And let's be honest - most software does not require hard thinking. Most apps shove data from one form to another, maybe store it somewhere, and then show it to the user in some way or another. The simplest form is text, so by default, whatever I wanna build, it starts as CLI. Agents can call it directly and verify output - closing the loop.

## The Model Shift

The real unlock into [building like a factory](https://github.com/steipete/) was GPT 5. It took me a few weeks after the release to see it - and for codex to catch up on features that claude code had, and a bit to learn and understand the differences, but then I started trusting the model more and more. **These days I don't read much code anymore.** I watch the stream and sometimes look at key parts, but I gotta be honest - most code I don't read. I do know where which components are and how things are structured and how the overall system is designed, and that's usually all that's needed. 

The important decisions these days are **language/ecosystem and dependencies**. My go-to languages are TypeScript for web stuff, Go for CLIs and Swift if it needs to use macOS stuff or has UI. Go wasn't something I gave even the slightest thought even a few months ago, but eventually I played around and found that agents are really great at writing it, and its simple type system makes linting fast.

Folks building Mac or iOS stuff: You don't need Xcode much anymore. [I don't even use xcodeproj files](https://github.com/steipete/clawdis/tree/main/apps/ios). Swift's build infra is good enough for most things these days. codex knows how to run iOS apps and how to deal with the Simulator. No special stuff or MCPs needed.

## codex vs Opus

I'm writing this post here while codex crunches through a huge, multi-hour refactor and un-slops older crimes of Opus 4.0. People on Twitter often ask me what's the big difference between Opus and codex and why it even matters because the benchmarks are so close. IMO it's getting harder and harder to trust benchmarks - you need to try both to really understand. Whatever OpenAI did in post-training, codex has been trained to read LOTS of code before starting. 

Sometimes it just **silently reads files for 10, 15 minutes** before starting to write any code. On the one hand that's annoying, on the other hand that's amazing because it greatly increases the chance that it fixes the right thing. Opus on the other hand is much more eager - great for smaller edits - not so good for larger features or refactors, it often doesn't read the whole file or misses parts and then delivers inefficient outcomes or misses sth. I noticed that even tho codex sometimes takes 4x longer than Opus for comparable tasks, I'm often faster because I don't have to go back and fix the fix, sth that felt quite normal when I was still using Claude Code. 

codex also allowed me to unlearn lots of charades that were necessary with Claude Code. Instead of "**plan mode**", I simply [**start a conversation with the model**](https://x.com/steipete/status/1997412175615246603), ask a question, let it google, explore code, create a plan together, and when I'm happy with what I see, I write "build" or "write plan to docs/*.md and build this". Plan mode feels like a hack that was necessary for older generations of models that were not great at adhering to prompts, so we had to take away their edit tools. There's [a highly misunderstood tweet of mine](https://x.com/steipete/status/2001228002953158928) that's still circling around that showed me that most people don't get that [plan mode is not magic](https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/).

## Oracle

The step from GPT 5/5.1 to 5.2 was massive. I built [**oracle 🧿**](https://github.com/steipete/oracle) about a month ago - it's a CLI that allows the agent to run GPT 5 Pro and upload files + a prompt and manages sessions so answers can be retrieved later. I did this because many times when agents were stuck, I asked it to write everything into a markdown file and then did the query myself, and that felt like a repetitive waste of time - and an opportunity to close the loop. The instructions are in [my global AGENTS.MD](https://github.com/steipete/agent-scripts/blob/main/AGENTS.MD) file and the model sometimes by itself triggered oracle when it got stuck. I used this multiple times per day. It was a **massive unlock**. Pro is insanely good at doing a speedrun across ~50 websites and then thinking really hard at it and in almost every case nailed the response. Sometimes it's fast and takes 10 minutes, but I had runs that took more than an hour.

Now that GPT 5.2 is out, I have far fewer situations where I need it. I do use Pro myself sometimes for research, but the cases where I asked the model to "ask the oracle" went from multiple times per day to a few times per week. I'm not mad about this - building oracle was super fun and I learned lots about browser automation, Windows and finally took my time to look into skills, after dismissing that idea for quite some time. What it does show is how much better 5.2 got for many real-life coding tasks. It **one-shots almost anything** I throw at it.

Another massive win is the **knowledge cutoff date**. GPT 5.2 goes till end of August whereas Opus is stuck in mid-March - that's about 5 months. Which is significant when you wanna use the latest available tools. 

## A Concrete Example: VibeTunnel

To give you another example on how far models have come. One of my early intense projects was [VibeTunnel](https://vibetunnel.sh/). A terminal-multiplexer so you can code on-the-go. I poured pretty much all my time into this earlier this year, and after 2 months it was so good that I caught myself coding from my phone while out with friends... and decided that this is something I should stop, more for mental health than anything. Back then I tried to rewrite a core part of the multiplexer away from TypeScript, and the older models consistently failed me. I tried Rust, Go... god forbid, even zig. Of course I could have finished this refactor, but it would have required lots of manual work, so I never got around completing this before I put it to rest. Last week I un-dusted this and gave codex a **two sentence prompt** to [convert the whole forwarding-system to zig](https://github.com/amantus-ai/vibetunnel/compare/6a1693b482fa4ef0ac021700a9ec05489a3a108f...a81b29ee3de6a2c85fd9fa41423d968dcc000515), and it ran over 5h and multiple compactions and delivered a working conversion in one shot.

Why did I even un-dust it, you ask? My current focus is [Clawdis](https://clawdis.ai/), an AI assistant that has **full access to everything** on [all my computers](https://x.com/steipete/status/2005213014778409280/photo/1), [messages](https://imsg.to/), [emails](https://github.com/steipete/gogcli), [home automation](https://www.openhue.io/cli/openhue-cli), [cameras](https://camsnap.ai/), lights, [music](https://sonoscli.sh/), heck it can even control the [temperature of my bed](https://eightctl.sh/). Ofc it also has [its own voice](https://github.com/steipete/sag/), [a CLI to tweet](https://github.com/steipete/bird) and its own [Twitter account](https://x.com/clawdbot).

Clawd [can see and control my screen](https://www.peekaboo.boo/) and sometimes makes snarky remarks, but I also wanted to give him the ability to check on my agents, and getting a **character stream** is just far more efficient than looking at images... if this will work out, we'll see!

## My Workflow

I know... you came here to **learn how to build faster**, and I'm just writing a marketing-pitch for OpenAI. I hope Anthropic is cooking Opus 5 and the tides turn again. Competition is good! At the same time, I *love* Opus as general purpose model. My AI agent wouldn't be half as fun running on GPT 5. Opus has something [special](https://soul.md/) that makes it a delight to work with. I use it for most of my computer automation tasks and ofc it powers Clawd🦞.

I haven't changed my workflow all that much from [my last take at it in October](https://steipete.me/posts/just-talk-to-it).

- I usually work on [**multiple projects**](https://x.com/steipete/status/2005083410482733427/photo/1) at the same time. Depending on complexity that can be between 3-8. The context switching can be tiresome, I really only can do that when I'm working at home, in silence and concentrated. It's a lot of mental models to shuffle. Luckily most software is boring. Creating a CLI to [check up on your food delivery](https://ordercli.sh/) doesn't need a lot of thinking. Usually my focus is on one big project and satellite projects that chug along. When you do enough agentic engineering, you develop a feeling for what's gonna be easy and where the model likely will struggle, so often I just put in a prompt, codex will chug along for 30 minutes and I have what I need. Sometimes it takes a little fiddling or creativity, but often things are straightforward.

- I extensively use the **queueing feature** of codex - as I get a new idea, I add it to the pipeline. I see many folks experimenting with various systems of multi-agent orchestration, emails or automatic task management - so far I don't see much need for this - usually I'm the bottleneck. My approach to building software is very iterative. I build sth, play with it, see how it "feels", and then get new ideas to refine it. Rarely do I have a complete picture of what I want in my head. Sure, I have a rough idea, but often that drastically changes as I explore the problem domain. So systems that take *the complete idea* as input and then deliver output wouldn't work well for me. I need to play with it, touch it, feel it, see it, that's how I evolve it.

- I basically **never revert** or use checkpointing. If something isn't how I like it, I ask the model to change it. codex sometimes then resets a file, but often it simply reverts or modifies the edits, very rare that I have to back completely, and instead we just travel into a different direction. Building software is like walking up a mountain. You don't go straight up, you circle around it and take turns, sometimes you get off path and have to walk a bit back, and it's imperfect, but eventually you get to where you need to be.

- I simply **commit to main**. Sometimes codex decides that it's too messy and automatically creates a worktree and then merges changes back, but it's rare and I only prompt that in exceptional cases. I find the added cognitive load of having to think of different states in my projects unnecessary and prefer to evolve it linearly. Bigger tasks I keep for moments where I'm distracted - for example while writing this, I run refactors on 4 projects here that will take around 1-2h each to complete. Ofc I could do that in a worktree, but that would just cause lots of merge conflicts and suboptimal refactors. Caveat: I usually work alone, if you work in a bigger team that workflow obv won't fly.
  
- I've already mentioned my way of planning a feature. I **cross-reference projects** all the time, esp if I know that I already solved sth somewhere else, I ask codex to look in ../project-folder and that's usually enough for it to infer from context where to look. This is extremely useful to save on prompts. I can just write "look at ../vibetunnel and do the same for Sparkle changelogs", because it's already solved there and with a 99% guarantee it'll correctly copy things over and adapt to the new project. That's how I scaffold new projects as well.

- I've seen plenty of systems for folks wanting to refer to past sessions. Another thing I never need or use. I maintain docs for subsystems and features in a **docs folder** in each project, and use [a script + some instructions](https://github.com/steipete/agent-scripts/blob/main/scripts/docs-list.ts) in my global AGENTS file to force the model to read docs on certain topics. This pays off more the larger the project is, so I don't use it everywhere, but it is of great help to keep docs up-to-date and engineer a better context for my tasks.

- Apropos context. I used to be really diligent to restart a session for new tasks. **With GPT 5.2** this is no longer needed. Performance is extremely good even when the context is fuller, and often it helps with speed since the model works faster when it already has loaded plenty files. Obviously that only works well when you serialize your tasks or keep the changes so far apart that two sessions don't touch each other much. codex has no system events for "this file changed", unlike claude code, so you need to be more careful - on the flip side, codex is just FAR better at context management, I feel I get 5x more done on one codex session than with claude. This is more than just the objectively larger context size, there's other things at work. My guess is that codex internally thinks really condensed to save tokens, whereas Opus is very wordy. Sometimes the model messes up and [its internal thinking stream leaks to the user](https://x.com/steipete/status/1974108054984798729), so I've seen this quite a few times. Really, [codex has a way with words](https://x.com/steipete/status/2005243588414931368) I find strangely entertaining.

- Prompts. I used to write long, elaborate prompts with voice dictation. With codex, my **prompts gotten much shorter**, I often type again, and many times I add images, especially when iterating on UI (or text copies with CLIs). If you show the model what's wrong, just a few words are enough to make it do what you want. Yes, I'm that person that drags in a clipped image of some UI component with "fix padding" or "redesign", many times that either solves my issue or gets me reasonably far. I used to refer to markdown files, but with my docs:list script that's no longer necessary.

- Markdowns. Many times I write "**write docs to docs/*.md**" and simply let the model pick a filename. The more obvious you design the structure for what the model is trained on, the easier your work will be. After all, I don't design codebases to be easy to navigate for me, I engineer them so agents can work in it efficiently. Fighting the model is often a waste of time and tokens.

## Tooling & Infrastructure

- **What's still hard?** Picking the right dependency and framework to set on is something I invest quite some time on. Is this well-maintained? How about peer dependencies? Is it popular = will have enough world knowledge so agents have an easy time? Equally, system design. Will we communicate via web sockets? HTML? What do I put into the server and what into the client? How and which data flows where to where? Often these are things that are a bit harder to explain to a model and where research and thinking pays off.

- Since I manage lots of projects, often I let an agent simply run in my project folder and when I figure out a new pattern, I ask it to "**find all my recent go projects** and implement this change there too + update changelog". Each of my project has a raised patch version in that file and when I revisit it, some improvements are already waiting for me to test.

- Ofc I **automate everything**. There's a skill to register domains and change DNS. One to write good frontends. There's a note in my AGENTS file about my tailscale network so I can just say "go to my mac studio and update xxx".

- Apropos **multiple Macs**. I usually work on two Macs. My MacBook Pro on the big screen, and a Jump Desktop session to my Mac Studio on another screen. Some projects are cooking there, some here. Sometimes I edit different parts of the same project on each machine and sync via git. Simpler than worktrees because drifts on main are easy to reconcile. Has the added benefit that anything that needs UI or browser automation I can move to my Studio and it won't annoy me with popups. (Yes, Playwright has headless mode but there's enough situations where that won't work)

- Another benefit is that tasks **keep running** there, so whenever I travel, remote becomes my main workstation and tasks simply keep running even if I close my Mac. I did experiment with real async agents like codex or Cursor web in the past, but I miss the steerability, and ultimately the work ends up as pull request, which again adds complexity to my setup. I much prefer the simplicity of the terminal.

- I used to play with slash commands, but just never found them too useful. Skills replaced some of it, and for the rest I keep writing "**commit/push**" because it takes the same time as /commit and always works.

- In the past I often took dedicated days to **refactor and clean up** projects, I do this much more ad-hoc now. Whenever prompts start taking too long or I see sth ugly flying by in the code stream, I'll deal with it right away.

- I tried linear or other **issue trackers**, but nothing did stick. Important ideas I try right away, and everything else I'll either remember or it wasn't important. Of course I have public bug trackers for bugs for folks that use my open source code, but when I find a bug, I'll immediately prompt it - much faster than writing it down and then later having to switch context back to it.

- Whatever you build, **start with the model and a CLI first**. I had this idea of [a Chrome extension to summarize YouTube](https://x.com/steipete/status/2005320848543298009) vids in my head for a long time. Last week I started working on summarize, a CLI that converts anything to markdown and then feeds that to a model for summarization. First I got the core right, and once that worked great I built the whole extension in a day. I'm quite in love with it. Runs on local, free or paid models. Transcribes video or audio locally. Talks to a local daemon so it's super fast. [Give it a go!](https://github.com/steipete/summarize/releases/latest)

- My go-to model is **gpt-5.2-codex high**. Again, KISS. There's very little benefit to xhigh other than it being far slower, and I don't wanna spend time thinking about different modes or "ultrathink". So pretty much everything runs on high. GPT 5.2 and codex are close enough that changing models makes no sense, so I just use that.

## My Config

This is my `~/.codex/config.toml`:
```
model = "gpt-5.2-codex"
model_reasoning_effort = "high"
tool_output_token_limit = 25000
# Leave room for native compaction near the 272–273k context window.
# Formula: 273000 - (tool_output_token_limit + 15000)
# With tool_output_token_limit=25000 ⇒ 273000 - (25000 + 15000) = 233000
model_auto_compact_token_limit = 233000
[features]
ghost_commit = false
unified_exec = true
apply_patch_freeform = true
web_search_request = true
skills = true
shell_snapshot = true

[projects."/Users/steipete/Projects"]
trust_level = "trusted"
```
This allows the model to read more in one go, the defaults are a bit small and can limit what it sees. It fails silently, which is a pain and something they'll eventually fix. Also, web search is still not on by default? `unified_exec` replaced tmux and my old `runner` script, rest's neat too. And don't be scared about compaction, ever since OpenAI switched to their new /compact endpoint, this works well enough that tasks can run across many compacts and will be finished. It'll make things slower, but often acts like a review, and the model will find bugs when it looks at code again.

That's it, for now. I plan on writing more again and have quite a backlog on ideas in my head, just having **too much fun building things**. If you wanna hear more ramblings and ideas how to build in this new world, [follow me on Twitter](https://x.com/steipete).
