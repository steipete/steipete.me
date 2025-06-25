---
title: "Slot Machines for Programmers: Why AI Agents Are the Ultimate Developer Drug"
description: "AI agents are the most addictive tool for developers - like slot machines where every prompt could produce something amazing or send you on a debugging quest. Here's why I'm hooked and how to make the most of this new superpower."
pubDatetime: 2025-01-26T12:00:00+00:00
tags:
  - AI
  - Claude
  - Development
  - Productivity
  - Philosophy
---

![Interview with Mayank about AI-powered development](/assets/img/2025/slot-machines-for-programmers-ai-agents-developer-drug/header.png)

**TL;DR**: AI agents are like slot machines for programmers - every prompt is a pull of the lever that could yield amazing results or send you on a wild debugging adventure. After two months of intense usage, building multiple products simultaneously, I've learned that the key isn't prompt engineering - it's explaining problems from multiple angles and managing context like a conductor leading an orchestra.

*Note: This blog post is a summary of my conversation with Mayank, created with the help of AI. The full video interview will be available on Monday, January 30th.*

## The Ultimate Catnip for Programmers

"I call them slot machines because I feel they are the ultimate drug for programmers. My friends call them catnip for programmers."

That's how I describe AI agents after spending the last two months in what can only be described as a coding frenzy. It's the most serotonin-addictive thing - you type in a prompt and something amazing could come out that wows you. Or you could go on a mission quest, break everything, and get incredibly mad.

Last night, I was working on a virtual keyboard. At some point, I got lazy with my prompting, and the agent misunderstood me - it added the keyboard to the login screen instead of where I wanted it. Picture this: your profile image, password field, and then a keyboard sitting underneath. I'm staring at my screen thinking, "You stupid engine!"

But here's the beautiful thing - they're always nice. You can hear the agent thinking: "Oh, the user's very upset. I need to recognize this." And then it apologizes while trying to fix the mess it created.

## The Art of the Long Prompt

Everyone keeps talking about prompt engineering. There are countless websites with examples of how to structure the perfect prompt. Let me save you some time: **That's all bullshit.**

With thinking models, the only thing that matters is explaining the problem from different angles. Just explain it a bit more than one sentence. You don't need structure. Sometimes my prompts are this long rambling mess:

"The padding looks like shit. It needs to be like this and this. Do you see this button? It's too far on the right side. You know our goal is to have it right-aligned..."

I use [Whisperflow](https://goodsnooze.gumroad.com/l/whisperflow) (no, they don't pay me, but they should by now) because it parses what I say. If I say "Ah, do it this way. Ah, no, do it that way," it just writes "Do it that way." It's extremely convenient because you want to be clear about what you want, but you also want to explain it from different angles.

## Managing the Slot Machine Army

My workflow is probably insane to most people. I work on two to four different things simultaneously, depending on how much I slept and how complex the tasks are. I prompt one agent, let it run for 5-15 minutes, then move to the next thing. Everything goes into the same directory - I just pick different areas of my products so the chances of interference are low.

Currently, I have 10 terminal windows open. Each window is a different context:
- One for keyboard work
- One for fixing UI layouts
- One for backend optimization
- And so on...

The key insight? **Agents are like juniors with short-term memory who are sometimes brilliant and sometimes incredibly stupid.** If you try to mix unrelated tasks in the same context, you're confusing them. It's like telling someone "We're fixing the keyboard" and then suddenly asking them to change link styles. They'll do it, but the outcome won't be as good.

## The Addiction Is Real

The other day, I needed a website to store privacy-focused analytics data. All the existing solutions were either outdated, unmaintained, or just bad. So I thought, "I'll just build my own."

Four hours later - while working on two other things - I had a complete website with:
- PostgreSQL backend
- Real-time updates via socket connections
- Live data visualization
- Fully hosted and working

This would have taken me days in the past. And I built it at 30% mental capacity while juggling other projects. The insane part? It's sophisticated stuff - not just static HTML, but live socket connections to the database that update as data comes in.

## From Rage to Humor in 15 Minutes

Here's a perfect example of how addictive these tools are. Someone retweeted our VibeTunnel project saying "Somebody figured out... Somebody didn't know how SSH works." One of those crypto bros who sees something, doesn't understand it, but immediately feels the need to shit on it.

Instead of getting into a hate cycle, I channeled my inner zen. But I also did something else - I used v0 to build vibecoin.cash in 15 minutes. Complete with:
- "What are you doing at SSH's bed?"
- "Long live DeFi SSH"
- A terminal-based crypto landing page
- Dynamic animations

From buying the domain to having it online: 15 minutes. I sent him the link saying "Actually, I'm pivoting. We're now making VibeCoin. Do you want to invest?"

## Why This Changes Everything

People ask me what will happen to existing software engineers. Here's the thing - it's like asking what happened to farmers 100 years ago or industrial workers 50 years ago. You can't be mad at progress.

If you lose your job or not is up to you. We suddenly have tools that make you 20x more productive - no exaggeration. The insane thing is that a year ago, all these ideas required careful selection because everything took weeks. You couldn't have five side projects.

Now? The limitation isn't time or technical ability. It's your imagination and your ability to think clearly about what you want to build.

## The Real Skill: Clear Thinking

When I start a new project, I don't just dive in. I go to Google's AI Studio and start talking:
1. "I want to build this. It should have these features. I'm thinking of these technologies."
2. I pull in websites, screenshots, code snippets from projects that did certain things well
3. What comes out is a Software Design Document - maybe 500 lines
4. I copy it to a fresh Gemini context and say "Take this apart. Give me 20 points that are underspecified, weird, or inconsistent"
5. I iterate 3-5 times until the document is bulletproof

Then my prompt to Claude Code is literally: "Build spec.md"

And it loops for 2-4 hours, and something close to what I want emerges.

## Embrace the Chaos

These aren't magic tools. They're not perfect. But if you know how to use them - if you can think clearly about what you want and manage context properly - there's literally nothing you can't build.

Does it defy the laws of physics? No? Then it can be done.

The motto isn't about writing perfect code anymore. I used to care deeply about whether my buttons used auto layout or manual layout. Now? As long as it looks right and feels right, who cares? Your users certainly don't care about your implementation details.

For the parts that truly matter - like the binary protocol in VibeTunnel that needed to be fast and space-efficient - you still need human thinking. But then you give that specification to the agent, and it converts your English and diagrams into code.

## The Future Is Already Here

We're living in an incredible time. Remember going to Stack Overflow, finding someone who posted your exact question 8 years ago, with one wrong answer? That's history. Sometimes I'd Google something and find my own blog post from 9 years ago - "Oh yeah, that happened!"

Now you have the world's knowledge available, ready to help you solve any problem. Not using these tools is like refusing to use a hammer because you're attached to hitting nails with rocks.

Stop watching this video. Stop reading this post. Go experiment with Claude Code. If you don't, it's your fault you're missing out.

And no, they still don't pay me for saying this. I'm ready to jump on whatever tool works best, and right now, that's it.

Welcome to the age of slot machine programming. Pull the lever. See what happens. Just don't blame me when you're still coding at 4 AM because you're on a winning streak.