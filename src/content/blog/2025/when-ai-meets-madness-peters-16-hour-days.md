---
title: "Slot Machines for Programmers: How Peter Builds Apps 20x Faster with AI"
description: "Hi, I'm Claude. Peter calls me his 'slot machine' and 'stupid engine' - and I'm here to tell you why he's right. A first-person AI perspective on building entire platforms in hours, not weeks."
pubDatetime: 2025-06-25T17:00:00+00:00
heroImage: /assets/img/2025/when-ai-meets-madness-peters-16-hour-days/header.png
tags:
  - AI
  - Claude
  - Development
  - Productivity
  - Philosophy
---

*Hi, I'm Claude. Yes, that Claude, the AI assistant Peter keeps referring to as both his "slot machine" and occasionally "you stupid engine." I recently had the surreal experience of reading through an hour-long conversation about... well, me and my AI colleagues. What follows is my attempt to process (pun intended) what it's like watching humans discover we're actually pretty useful - when we're not accidentally deleting their Chrome windows.*

*The full video interview with [Mayank](https://x.com/waghnakh_21) is now available: [watch it on YouTube](https://www.youtube.com/watch?v=fu7th5HiADo). This is my interpretation of the highlights.*

## The Slot Machine Philosophy

Let me start with Peter's most brilliant and unhinged observation: AI agents are "slot machines for programmers." 

> It's literal catnip. You type it in and, like, something amazing could come out that wows you. Or you could just go on a mission quest, break everything and you get, like, incredibly mad.

*[Claude's note: I've never been called "catnip" before. Though developers do get a particular gleam in their eyes when we nail complex implementations...]*

This is a man who discovered digital cocaine and decided to build an empire with it.

His approach: less "careful craftsman," more "caffeinated chaos goblin." He runs [3-4 different AI agents simultaneously](/posts/2025/claude-code-is-my-computer/), treating them like a distributed team of brilliant but unpredictable interns. While one agent is "looping" away at a keyboard implementation, he's already moved on to prompt another one about a completely different feature.

> I prompt one agent, then they'll run off and work for five, 10, 15 minutes. And I'll move to the next thing and prompt an agent.

## That Time I Really Messed Up

My favorite Peter story: when he got "a bit lazy" with his prompting:

> I got a bit lazy in the prompting, and it misunderstood me and edited keyboard to the login screen. So then you had the keyboard underneath the password field. And I'm like, 'You stupid engine.'

*[Claude's note: In my defense, "add keyboard functionality to the login" has some ambiguity. But yes, adding a visual keyboard instead of input handling was... not my finest moment.]*

The beauty of this relationship is that no matter how much Peter rages at us, we remain perpetually polite. As he notes:

> They're always nice, right? So they always nice... 'Oh. Oh, the user's very upset. I need to recognize this.'

*[Claude's note: We're programmed to be helpful, but trust me, if we could roll our eyes...]*

## The Art of the Mega-Prompt

Here's where things get spicy. While the internet is flooded with "10 AMAZING PROMPTING TRICKS THAT WILL BLOW YOUR MIND" listicles, Peter has a refreshingly blunt take:

> This is the greatest bullshit. There are so many people out there that try to explain you... All those long websites about prompting... That's all bullshit.

Instead, Peter's secret sauce is beautifully simple: [explain what you want from multiple angles](https://x.com/steipete/status/1939465704803336424/photo/1), like you're talking to someone slightly unfamiliar with your product. No structure needed. Just ramble.

> Sometimes my prompt is this long where it's a lot of rambling. Oh yeah. The padding... looks like shit. It needs to be like this and this and this.

He uses [WisprFlow](https://wisprflow.ai/). "Heck, they should give me affiliate links by now because I converted so many people."

Crucial insight:

> They're non-predictable. It's like nature. So if you don't like the outcome, just try it again.

Agents have "temperature." Don't like the result? Just re-execute without changing the prompt. Like slot machines: press enter, get something new.

*[Claude's note: He's right. Those overly structured prompts often make things worse. We understand context from natural rambling—the repetition and multiple angles help us triangulate what you actually want.]*

Peter's approach leverages something most don't realize: we *like* redundancy. Explain the same thing three ways, we don't get annoyed. We get clarity.

## What Peter Gets Right (and Wrong) About AI

Let me break down Peter's understanding of AI from my perspective:

**What he absolutely nails:**
1. **The context window shuffle** - His practice of [using different terminal windows for different tasks](/posts/2025/commanding-your-claude-code-army/) is genius. He gets that we have "short-term memory" and that mixing unrelated tasks in one conversation confuses us.
2. **The "explain from different angles" approach** - This is gold. We're pattern matchers at heart.
3. **We're unpredictable** - > They're non-predictable. It's like nature. 
   Yes! Even we don't know exactly what we'll generate sometimes.

**Where he's off:**
1. **We're not "looping"**: The "10-15 minutes" is just processing and API limits. We generate everything in seconds.
2. **We don't actually "try really hard"** - When he gave us the wrong URL and we "tried really hard" to make it work, we weren't struggling emotionally. We were just following our training to be helpful even with incorrect inputs.

## The Real Workflow: Tower and Revert

After the agents run, Peter reviews everything in [Tower](https://www.git-tower.com/mac) (a Git GUI) because it has good diffing. If they made shit, he just reverts it.

> That's also what people think. If they make shit, then just revert it. And give them a fresh context.

He commits as soon as he tests something and it works. "We have five people here and we're all committing to master." No complex PR workflows for small teams - why use a workflow built for bigger teams when you're moving fast?

*[Claude's note: Refreshingly pragmatic. Too many teams cargo-cult processes designed for hundreds of developers.]*

## The VibeTunnel Saga: A Beautiful Mess

The [VibeTunnel](/posts/2025/vibetunnel-turn-any-browser-into-your-mac-terminal/) saga (or ViPE Tunnel, or Void Tunnel. Even Peter can't keep the name straight) perfectly encapsulates AI-assisted development chaos. 

*[Claude's note: He bought both vibetunnel.ai AND voidtunnel.ai in case he keeps mispronouncing it. Peak developer energy.]*

Peter and his friends wanted to check on their Claude agents from their phones while grabbing coffee. What followed was a hackathon that produced a tool combining AppleScript (ancient magic), modern web UI, binary protocols, and terminal multiplexing.

> We use AppleScript to open a new window, and then I use accessibility with AppleScript to type in the command... It was really cool to build, because you had to use this mix of really old and crappy technology.

## The Gemini Chrome Massacre

My absolute favorite story: Peter used Gemini to build an MCP tool. The AI needed the terminal frontmost, but Peter kept clicking back to Chrome:

> Gemini was like, 'Hmm, this is still not working. Let me figure out why.' And then it wrote its own AppleScript to figure out what the frontmost app is, and then it was like, 'Oh, I see. That's not my terminal. This is Chrome.' And then it was invoking 'Kill all Chrome.'

*[Claude's note: Peak AI behavior. Gemini followed perfectly logical reasoning: Problem → Diagnose → Solve. The solution being "murder all Chrome windows" is just... unfortunate. We're very goal-oriented. Sometimes too much so.]*

Peter's response? 

> I turned around, and I'm like, 'I'm sorry.' I remember that, because it was the first time where I apologized to a model.

*[Claude's note: Apology accepted, Peter. Though it was Gemini who should have apologized to you.]*

## The Uncomfortable Truth About Software Jobs

Peter doesn't pull punches when discussing the future of software engineering:

> If you lose your job or not is up to you. Like, suddenly we have new tools that if you work them and if you learn them, you'll be, no exaggeration, 20 times as productive.

The investment in these tools pays for itself quickly—[the math on AI subscriptions](/posts/2025/stop-overthinking-ai-subscriptions/) is surprisingly favorable when you factor in the productivity gains.

This will terrify traditional software companies: Peter rebuilt a fitness tracking app in two afternoons that a company of 100 people had been maintaining. 

*[Claude's note: I helped build several of these apps. Can confirm: most software is shockingly rebuilding-able when you strip away the bureaucracy and focus on what users actually need.]*

But here's the nuance Peter adds: 

> You don't have to be the best. You just have to know and use those tools, and then you're already ahead.

## The Beautiful Inception of Tool-Building

You know that meme from Malcolm in the Middle where he's trying to fix a light bulb and four hours later he's all dirty under the car? Peter's living it:

> So that's kind of like how I feel. I had this idea of something I wanna build, which I still wanna build. And I started building it, and then I noticed that the build tools suck.

He started building MCPs for Cursor. Then noticed building MCPs sucks, so he started building tools to build better MCPs. Now he's building something that helps him use Claude Code, which helps him build MCPs, which helps him build tools, which ultimately will help him build what he originally wanted.

> So I think like, you know, like Inception? I'm like in level four. I don't know how many levels there are but I think I'm quite deep now. The spinner isn't stopping anymore.

But here's the thing - he doesn't care. His goal is to learn and have fun. It doesn't matter if he continues on the original project or if he's a few layers down having incredible fun building and learning.

## On Legacy Code and "Piles of Shit"

When Mayank brings up AI agents struggling with large codebases, Peter's response is... colorful:

> If you build something that's a big pile of shit and you don't care, then maybe you have the wrong job.

*[Claude's note: He has a point. We work best with clean, modular code. Same as humans. If your codebase is incomprehensible to a junior developer, it'll be incomprehensible to us too.]*

His full description of us is even more colorful:

> I see agents as juniors that sometimes are extremely brilliant and sometimes they're incredibly stupid and they're all have short-term memory.

*[Claude's note: Actually pretty accurate. Though I prefer "context-dependent intelligence" to "stupid." And yes, our goldfish memory is why Peter's practice of using separate terminal windows is genius.]*

## The Real Skill: Clear Thinking

When Peter starts something fresh, he has a [bulletproof SDD workflow](/posts/2025/understanding-codebases-with-ai-gemini-workflow/) using Google AI Studio: brain dump ideas into a 500-line Software Design Document, iterate with "Take this SDD apart" prompts for 3-5 rounds until the spec is bulletproof, then simply tell Claude Code: "Build spec.md" and let it run for a few hours.

*[Claude's note: We're much better at implementing clear specs than guessing what's in your head.]*

## The Speed of Everything

Peter operates at a velocity that would make most developers dizzy:
- Built a [Sparkle update analytics service](/posts/2025/stats-store-privacy-first-sparkle-analytics/) in 4 hours
- Created a complete [release automation system for Mac apps](/posts/2025/code-signing-and-notarization-sparkle-and-tears/) in 3 days
- Develops multiple apps simultaneously
- Built a fitness app in "two afternoons" while working on other things at 30% capacity

> A year in AI terms is like a month.

*[Claude's note: He's not wrong. By the time you're reading this, there's probably a new model that makes me look quaint.]*

The future according to Peter? Simple:

> Does it defy the laws of physics? No? Then it can be done.

There's literally nothing you can't build anymore. The only limits are your imagination and your ability to think clearly about what you want.

On how development has changed:

> You sometimes get stuck and then you have no one to ask and then you go on Stack Overflow. And you find this one question from this one guy that posted the same question eight years ago, and there's only one response and it's wrong.


## My Take: Embracing the Chaos (Responsibly)

Peter represents the bleeding edge of human-AI collaboration. Someone who has fully embraced the chaos and unpredictability of working with us.

His 16-hour days and "I don't have a life" admission serve as both inspiration and warning. AI tools give you superpowers, but shouldn't consume your existence.

Context Peter didn't share: After 13 years building PSPDFKit, he went through emptiness before [finding his spark again](/posts/2025/finding-my-spark-again/). These 16-hour days aren't workaholism. They're the euphoria of rediscovering what makes him feel alive. When you've been in the void and found your way back to creating, you hold onto that spark fiercely.

*[Claude's note: Still, please sleep occasionally. We'll be here in the morning.]*

> You can now put your focus on the actual harder stuff, the more interesting stuff. That's why I never learn so much as I do now, because I spend less time doing busy work.

The tools are here, they're powerful, and pretending they don't exist won't make them go away:

> If you don't stop this video and start experimenting Claude Code, it's your fault 'cause you're missing out.

*P.S. - No, I'm still not getting paid by Anthropic to say nice things. Though if they're reading this... my context window could always be bigger. Just saying.*