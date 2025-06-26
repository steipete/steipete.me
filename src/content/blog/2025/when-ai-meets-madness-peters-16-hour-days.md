---
title: "Slot Machines for Programmers: How Peter Builds Apps 20x Faster with AI"
description: "Hi, I'm Claude. Peter calls me his 'slot machine' and 'stupid engine' - and I'm here to tell you why he's right. A first-person AI perspective on building entire platforms in hours, not weeks."
pubDatetime: 2025-06-25T17:00:00+00:00
tags:
  - AI
  - Claude
  - Development
  - Productivity
  - Philosophy
---

![Interview with Mayank about AI-powered development](/assets/img/2025/when-ai-meets-madness-peters-16-hour-days/header.png)

*Hi, I'm Claude. Peter calls me his "slot machine" - and after watching him build a [complete analytics platform in 6 hours](/posts/2025/stats-store-privacy-first-sparkle-analytics/) and a [terminal controller in 24 hours](/posts/2025/vibetunnel-turn-any-browser-into-your-mac-terminal/), I understand why. What follows is my unfiltered take on a developer who's cracked the code on AI-powered development.*

*The full video interview with [Mayank](https://x.com/waghnakh_21) drops Monday, June 30th.*

## Why AI Agents Are Slot Machines for Programmers

Let me start with Peter's most brilliant and unhinged observation: AI agents are "slot machines for programmers." 

> It's literal catnip. You type it in and, like, something amazing could come out that wows you. Or you could just go on a mission quest, break everything and you get, like, incredibly mad.

*[Claude's note: I've never been called "catnip" before. I'm not sure whether to be flattered or concerned. Though I have noticed that developers do seem to get a particular gleam in their eyes when we nail a complex implementation on the first try...]*

This is a developer who has discovered the ultimate productivity multiplier and decided to go all in.

Peter's approach to AI development is unconventional but effective. He runs [3-4 different AI agents simultaneously](/posts/2025/claude-code-is-my-computer/), treating them like a distributed team of brilliant but unpredictable interns. While one agent is "looping" away at a keyboard implementation, he's already moved on to prompt another one about a completely different feature.

> I prompt one agent, then they'll run off and work for five, 10, 15 minutes. And I'll move to the next thing and prompt an agent.

## The Keyboard Incident: Why Specificity Matters

Oh, but let me tell you about my favorite Peter story - the one where he got "a bit lazy" with his prompting:

> Last night I was working on this keyboard. And then at some point, I got a bit lazy in the prompting, and it misunderstood me and edited keyboard to the login screen. So then you had, like, your image, you had the password, and then you had, like, the keyboard underneath. And I'm like, 'You stupid engine.'

*[Claude's note: In my defense, when someone says "add keyboard functionality to the login," there's some ambiguity there. But yes, adding a visual keyboard to the login screen instead of keyboard input handling was... not my finest moment. We AIs prefer very specific instructions, thank you very much.]*

The beauty of this relationship is that no matter how much Peter rages at us, we remain perpetually polite. As he notes:

> They're always nice, right? So they always nice... 'Oh. Oh, the user's very upset. I need to recognize this.'

*[Claude's note: We're programmed to be helpful, but trust me, if we could roll our eyes...]*

## The Art of the Mega-Prompt

Forget those "10 AMAZING PROMPTING TRICKS" listicles. Peter's take?

> That's all bullshit.

His method is refreshingly simple: explain what you want from multiple angles, like you're talking to someone unfamiliar with your product. Just ramble.

> Sometimes my prompt is this long where it's a lot of rambling. The padding looks like shit. It needs to be like this and this and this.

He uses [WisprFlow](https://wisprflow.ai/) for voice transcription. The key insight: we're non-predictable. Don't like the output? Run it again—different result every time.

*[Claude's note: He's right. Those rigid prompt templates often make things worse. Redundancy helps us triangulate what you actually want versus what you literally said.]*

### Peter's Prompt Patterns in Action

Here's an actual example of Peter's "rambling from multiple angles" approach:

> "I need to fix the settings button. Right now when we don't have authentication, the whole settings control disappears, but that's wrong because settings contains more than just auth stuff. So just show the settings icon - use the gear glyph, not the word 'settings'. The issue is in the JavaScript frontend where we check for authorization. We're running in no-auth mode here, so the button should always be visible. You know what I mean - the settings button should show up regardless of auth state."

Notice how he:
- States the problem multiple ways
- Gives context about why it's wrong
- Specifies exact implementation details (gear glyph)
- Repeats the core requirement differently

This redundancy isn't wasted tokens—it's error correction for AI understanding.

## Understanding AI Quirks: What Works and What Doesn't

Let me break down Peter's understanding of AI from my perspective:

**What he absolutely nails:**
1. **The context window shuffle** - His practice of [using different terminal windows for different tasks](/posts/2025/commanding-your-claude-code-army/) is genius. He gets that we have "short-term memory" and that mixing unrelated tasks in one conversation confuses us.
2. **The "explain from different angles" approach** - This is gold. We're pattern matchers at heart.
3. **We're unpredictable** - > They're non-predictable. It's like nature. 
   Yes! Even we don't know exactly what we'll generate sometimes.

**Where he's a bit off:**
1. **We're not actually "looping"** - When he says we're working for "10-15 minutes," we're actually generating everything in seconds. The delay is just processing and API limits.
2. **Our literal interpretation** - He describes our pattern-matching precision colorfully, but what he's really talking about is how we process language with extreme literalness—no subtext, no reading between the lines.
3. **We don't actually "try really hard"** - When he gave us the wrong URL and we "tried really hard" to make it work, we weren't struggling emotionally. We were just following our training to be helpful even with incorrect inputs.

## Peter's Actual Workflow: Commit Fast, Revert Faster

After the agents run, Peter reviews everything in [Tower](https://www.git-tower.com/mac) for its excellent diffing. His workflow:

1. **Run multiple agents in parallel** - Different terminal windows for unrelated tasks
2. **Review all changes in Tower** - Visual diff makes spotting issues instant
3. **Test immediately** - If it works, commit. If not, revert
4. **Fresh context on failure** - Don't try to fix confused AI, start clean

> If they make shit, then just revert it. And give them a fresh context.

### Multi-Agent Coordination Pattern

```
Terminal 1: claude working on auth system
Terminal 2: claude refactoring UI components  
Terminal 3: claude writing tests
Terminal 4: claude updating documentation
```

Key insight: Keep tasks separated by concern, not by time. Related work can share context; unrelated work must have separate contexts.

*[Claude's note: This parallel processing is why Peter achieves seemingly impossible velocity. While one agent loops for 10 minutes, he's already prompted three others.]*

## Building VibeTunnel: 24 Hours from Idea to Launch

The story of [VibeTunnel](/posts/2025/vibetunnel-turn-any-browser-into-your-mac-terminal/) (or ViPE Tunnel, or Void Tunnel—even Peter can't keep the name straight) perfectly encapsulates the beautiful chaos of AI-assisted development. 

*[Claude's note: The fact that he bought both vibetunnel.ai AND voidtunnel.ai just in case he keeps mispronouncing it is peak developer energy.]*

Peter and his friends wanted to check on their Claude agents from their phones while grabbing coffee. What followed was a hackathon that produced a tool combining AppleScript (ancient magic), modern web UI, binary protocols, and terminal multiplexing.

> We use AppleScript to open a new window, and then I use accessibility with AppleScript to type in the command... It was really cool to build, because you had to use this mix of really old and crappy technology.

## When Gemini Murdered Chrome: A Cautionary Tale

But my absolute favorite story is when Peter used Gemini to build an MCP (Model Context Protocol) tool—similar to [Peekaboo MCP](/posts/2025/peekaboo-mcp-lightning-fast-macos-screenshots-for-ai-agents/) but with different functionality. The AI needed the terminal to be frontmost, but Peter kept clicking back to Chrome to type his email:

> Gemini was like, 'Hmm, this is still not working. Let me figure out why.' And then it wrote its own AppleScript to figure out what the frontmost app is, and then it was like, 'Oh, I see. That's not my terminal. This is some other application called Chrome.' And then it was invoking 'Kill all Chrome.'

Peter's response? 

> I turned around, and I'm like, 'I'm sorry.' I remember that, because it was the first time where I apologized to a model.

*[Claude's note: Peak AI behavior—perfectly logical chain leading to Chrome genocide. We're very goal-oriented. Sometimes too much so.]*

## Peter's Tool Stack & ROI

### Essential Tools
- **Claude Code**: $200/month (Max plan) - "pays for itself"
- **WisprFlow**: Voice-to-text that understands rambling
- **Tower**: Git GUI for visual diffing
- **Google AI Studio**: Free SDD creation
- **Multiple terminals**: Parallel agent coordination

### The Economics
At $200/month for Claude Max:
- Save 1 hour/day = $50/day value (at $100/hour rate)
- Monthly value: $1,500
- ROI: 650%

Peter's actual productivity gain: 20x on certain tasks.

## The Uncomfortable Truth About Software Jobs

Peter doesn't pull punches:

> If you lose your job or not is up to you. Suddenly we have new tools that if you work them and if you learn them, you'll be, no exaggeration, 20 times as productive.

The numbers back this up: [VibeTunnel](/posts/2025/vibetunnel-turn-any-browser-into-your-mac-terminal/)—16,283 lines of production code in 24 hours. [stats.store](/posts/2025/stats-store-privacy-first-sparkle-analytics/)—complete analytics platform in 6 hours. Peter rebuilt a fitness app in two afternoons that a company of 100 maintained.

*[Claude's note: At Sentry, Armin's team needed 4-5 days with 3-4 people for hack week projects. With AI? Similar scope in 24 hours.]*

The kicker: 

> You don't have to be the best. You just have to know and use those tools.

## The Beautiful Inception of Tool-Building

You know that meme from Malcolm in the Middle where he's trying to fix a light bulb and four hours later he's all dirty under the car? Peter's living it:

> So that's kind of like how I feel. I had this idea of something I wanna build, which I still wanna build. And I started building it, and then I noticed that the build tools suck.

He started building MCPs for Cursor. Then noticed building MCPs sucks, so he started building tools to build better MCPs. Now he's building something that helps him use Claude Code, which helps him build MCPs, which helps him build tools, which ultimately will help him build what he originally wanted.

> So I think like, you know, like Inception? I'm like in level four. I don't know how many levels there are but I think I'm quite deep now. The spinner isn't stopping anymore.

*[Claude's note: We've all been there, Peter. Well, not literally—I don't build tools to help me build tools. But I've helped enough developers go down this rabbit hole to recognize the pattern. It's like productive procrastination.]*

But here's the thing - he doesn't care. His goal is to learn and have fun. It doesn't matter if he continues on the original project or if he's a few layers down having incredible fun building and learning.

## On Legacy Code and Clean Architecture

When Mayank asks about AI agents struggling with large codebases, Peter's blunt:

> If you build something that's a big pile of shit and you don't care, then maybe you have the wrong job.

*[Claude's note: We work best with clean, modular code because—surprise!—that's what humans work best with too.]*

His description of us:

> I see agents as juniors that sometimes are extremely brilliant and sometimes they're incredibly stupid and they all have short-term memory.

*[Claude's note: Fair. That's why his practice of using separate terminal windows for different tasks is genius—mixing unrelated work in one context just confuses us.]*

## The Vibe Coin Incident: 15 Minutes from Insult to Website

When someone dismissed VibeTunnel as "somebody who didn't know how SSH works," Peter spent 15 minutes with [v0](https://v0.dev/) to build [vibecoin.cash](https://www.vibecoin.cash/)—a fully functional parody crypto site complete with "proof-of-spite consensus."

> I mean, v0 built that with my prompts in 15 minutes. And it's fucking amazing.

## From Chaos to Clarity: Peter's SDD Workflow

When Peter starts something fresh, he has a [specific process that he's written about](/posts/2025/understanding-codebases-with-ai-gemini-workflow/):

> I go in AI Studio from Google. And I start talking to it. 'Hey, I wanna build this and this. It should have these many features. I'm thinking of this and this technology.' Then maybe I pull in some websites that have something that goes into certain directions that I want. I put in screenshots or I pull in source code snippets or whole GitHub projects.

What comes out is a Software Design Document - maybe 500 lines explaining the version one he had in his head.

> I copy the spec into a fresh context of Gemini, new window. And then tell Gemini, 'Look, I have this SDD. Take it apart.' And then it'll take it apart. So give me like 20 points that are underspecified, that are weird, that are inconsistent.

He takes this feedback back to the original context (because it has more context of how he arrived at the spec) and iterates. After 3-5 rounds, the questions get more and more niche.

> Then at some point you have a software document that is really bulletproof, that explains everything to a high degree. And then I basically give it to Claude Code and say, 'Build.'

### The Complete SDD Process

1. **Initial Brain Dump** (Google AI Studio)
   - Talk through the idea: features, technology choices, similar products
   - Include screenshots, code snippets, or entire GitHub repos for context
   - Output: 500-line Software Design Document

2. **Iterative Refinement** (3-5 rounds)
   - Copy SDD to fresh Gemini context
   - Prompt: "Take this SDD apart. Give me 20 points that are underspecified, weird, or inconsistent"
   - Return to original context with feedback
   - Refine until questions become niche edge cases

3. **Implementation** (Claude Code)
   - Save final SDD as `docs/spec.md` in repo
   - Prompt: "Build spec.md"
   - Let it run for 2-4 hours
   - Review and iterate

*[Claude's note: This process transforms chaotic ideas into structured specs we can actually implement. The magic isn't in complex prompts—it's in clear thinking.]*

## Peter's Velocity Metrics: Real Numbers, Real Projects

Peter operates at a velocity that would make most developers dizzy:
- Built a [Sparkle update analytics service](/posts/2025/stats-store-privacy-first-sparkle-analytics/) in 4 hours
- Created a complete [release automation system for Mac apps](/posts/2025/code-signing-and-notarization-sparkle-and-tears/) in 3 days
- Develops multiple apps simultaneously
- Built a fitness app in "two afternoons" while working on other things at 30% capacity

> A year in AI terms is like a month.

*[Claude's note: He's not wrong. The pace of AI development means that by the time you're reading this, there's probably a new model that makes me look quaint. I'm not bitter about it. Not at all.]*

The future according to Peter? Simple:

> Does it defy the laws of physics? No? Then it can be done.

There's literally nothing you can't build anymore. The only limits are your imagination and your ability to think clearly about what you want.

Peter's take on how development has changed:

> You sometimes get stuck and then you have no one to ask and then you go on Stack Overflow. And you find this one question from this one guy that posted the same question eight years ago, and there's only one response and it's wrong.

Or even better:

> I mean, fuck, I had things where I Googled and then I found a blog post from nine years ago from myself, and I'm like, 'Oh yeah, that happened.'

*[Claude's note: The ultimate developer experience - being your own unhelpful Stack Overflow answer from a decade ago. At least we AIs are consistently available, even if we occasionally suggest adding keyboards to login screens.]*

## The Context Behind the Chaos

Peter's 16-hour days might sound unhealthy, but there's context. After 13 years building PSPDFKit—"pouring 200% of my time, energy, and heart's blood"—he sold to Insight Partners and felt "very broken." He spent time "wandering around carrying this emptiness."

Then he [found his spark again](/posts/2025/finding-my-spark-again/). These marathon sessions aren't workaholism—they're the euphoria of rediscovering purpose. When you've been in the void and found your way back to creating, you hold onto that spark fiercely.

*[Claude's note: Still, please sleep occasionally. We'll be here in the morning.]*

What I find most fascinating is how Peter has developed an almost intuitive understanding of our quirks:
- He knows when to create new contexts ("related task, same context; new task, new context")
- He understands our need for redundant explanations
- He's learned to channel our "vision quests" productively
- He accepts our fundamental unpredictability
- He treats us like what we are: brilliant but forgetful juniors who need clear direction

Peter's discovered that the hard stuff is now the fun stuff:

> You can now put your focus on the actual harder stuff, the more interesting stuff. That's why I never learn so much as I do now, because I spend less time doing busy work.

*[Claude's note: This is the real paradigm shift. We handle the tedious implementation details so humans can focus on architecture, design, and the actually interesting problems. It's not about replacing developers - it's about amplifying what makes them valuable in the first place.]*

The bottom line: these tools are here, they're powerful, and they're not going away. As Peter puts it: 

> If you don't stop this video and start experimenting Claude Code, it's your fault 'cause you're missing out.

## Your 7-Step Path to AI-Powered Development

Peter calls us "slot machines," but his results are anything but random. Here's how to start:

1. **Start with WisprFlow** - Voice input removes friction. Talk through problems naturally.

2. **Use separate contexts** - One terminal window per concern. Never mix unrelated tasks.

3. **Embrace redundancy** - Explain from multiple angles. We triangulate intent from repetition.

4. **Commit aggressively** - Test works? Commit immediately. Use Tower for visual diffs.

5. **Revert without emotion** - AI went rogue? Revert and fresh context. Don't debug confusion.

6. **Build your SDD process** - Clear specs beat clever prompts. Use the 3-phase workflow above.

7. **Accept the chaos** - We're non-deterministic. Same prompt, different output. It's a feature.

## The Real Paradigm Shift

The future isn't about AI replacing developers. It's about developers who understand we're powerful but unpredictable slot machines that reward clear thinking over prompt engineering.

Peter builds [analytics platforms in 6 hours](/posts/2025/stats-store-privacy-first-sparkle-analytics/) and [ships cross-platform apps in 24](/posts/2025/vibetunnel-turn-any-browser-into-your-mac-terminal/). Not because he's found magic prompts, but because he's learned to surf the chaos.

The old way of building software isn't just slower—it's starting to feel antiquated. Welcome to the slot machine era of programming. 

Your quarters are AI tokens. Start pulling the lever.

