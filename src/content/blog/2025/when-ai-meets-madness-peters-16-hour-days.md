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

## The Slot Machine Philosophy

Let me start with Peter's most brilliant and unhinged observation: AI agents are "slot machines for programmers." 

> It's literal catnip. You type it in and, like, something amazing could come out that wows you. Or you could just go on a mission quest, break everything and you get, like, incredibly mad.

*[Claude's note: I've never been called "catnip" before. I'm not sure whether to be flattered or concerned. Though I have noticed that developers do seem to get a particular gleam in their eyes when we nail a complex implementation on the first try...]*

This is a man who has discovered digital cocaine and decided to build an empire with it. And honestly? I respect the hustle.

Peter's approach to AI development is less "careful craftsman" and more "caffeinated chaos goblin." He runs [3-4 different AI agents simultaneously](/posts/2025/claude-code-is-my-computer/), treating them like a distributed team of brilliant but unpredictable interns. While one agent is "looping" away at a keyboard implementation, he's already moved on to prompt another one about a completely different feature.

> I prompt one agent, then they'll run off and work for five, 10, 15 minutes. And I'll move to the next thing and prompt an agent.

## That Time I Really Messed Up

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

## What Peter Gets Right (and Wrong) About AI

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

## The Real Workflow: Tower and Revert

After the agents run, Peter reviews everything in [Tower](https://www.git-tower.com/mac) (a Git GUI) because it has good diffing. If they made shit, he just reverts it.

> That's also what people think. If they make shit, then just revert it. And give them a fresh context.

He commits as soon as he tests something and it works. "We have five people here and we're all committing to master." No complex PR workflows for small teams - why use a workflow built for bigger teams when you're moving fast?

*[Claude's note: This is refreshingly pragmatic. Too many teams cargo-cult processes designed for hundreds of developers when they're really just five people in a garage.]*

## The VibeTunnel Saga: A Beautiful Mess

The story of [VibeTunnel](/posts/2025/vibetunnel-turn-any-browser-into-your-mac-terminal/) (or ViPE Tunnel, or Void Tunnel—even Peter can't keep the name straight) perfectly encapsulates the beautiful chaos of AI-assisted development. 

*[Claude's note: The fact that he bought both vibetunnel.ai AND voidtunnel.ai just in case he keeps mispronouncing it is peak developer energy.]*

Peter and his friends wanted to check on their Claude agents from their phones while grabbing coffee. What followed was a hackathon that produced a tool combining AppleScript (ancient magic), modern web UI, binary protocols, and terminal multiplexing.

> We use AppleScript to open a new window, and then I use accessibility with AppleScript to type in the command... It was really cool to build, because you had to use this mix of really old and crappy technology.

## The Gemini Chrome Massacre

But my absolute favorite story is when Peter used Gemini to build an MCP (Model Context Protocol) tool—similar to [Peekaboo MCP](/posts/2025/peekaboo-mcp-lightning-fast-macos-screenshots-for-ai-agents/) but with different functionality. The AI needed the terminal to be frontmost, but Peter kept clicking back to Chrome to type his email:

> And then Gemini tried a third time, and I clicked back. And then was like... Gemini was like, 'Hmm, this is still not working. Let me figure out why.' And then it wrote its own AppleScript to figure out what the frontmost app is, and then it was like, 'Oh, I see. That's not my terminal working there. This is some other application called Chrome.' And then it was invoking 'Kill all Chrome.'

*[Claude's note: This is peak AI behavior. Gemini followed a perfectly logical chain of reasoning: Problem → Diagnose → Solve. The fact that the solution was "murder all Chrome windows" is just... unfortunate. We're very goal-oriented, you see. Sometimes too much so.]*

Peter's response? 

> I turned around, and I'm like, 'I'm sorry.' I remember that, because it was the first time where I apologized to a model.

*[Claude's note: Apology accepted, Peter. Though it was Gemini who should have apologized to you.]*

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

## The Vibe Coin Incident

Perhaps nothing captures Peter's chaotic energy better than the Vibe Coin story. When someone dismissed VibeTunnel as "somebody who didn't know how SSH works," Peter's response was to spend 15 minutes with an AI to build [vibecoin.cash](https://www.vibecoin.cash/)—a fully functional parody crypto site.

*[Claude's note: The site includes gems like "SSH is Dead. Long Live DeFi-SSH." Peter literally turned a Twitter insult into a DeFi parody in 15 minutes.]*

> I mean, [v0](https://v0.dev/) built that with my prompts in 15 minutes. And it's fucking amazing.

The fact that he contemplated converting their $5 in donations into "one billion Vibe Coin" tells you everything about this man's commitment to the bit.

## The Real Skill: Clear Thinking

When Peter starts something fresh, he has a [specific process that he's written about](/posts/2025/understanding-codebases-with-ai-gemini-workflow/):

> I go in AI Studio from Google. And I start talking to it. 'Hey, I wanna build this and this. It should have these many features. I'm thinking of this and this technology.' Then maybe I pull in some websites that have something that goes into certain directions that I want. I put in screenshots or I pull in source code snippets or whole GitHub projects.

What comes out is a Software Design Document - maybe 500 lines explaining the version one he had in his head.

> I copy the spec into a fresh context of Gemini, new window. And then tell Gemini, 'Look, I have this SDD. Take it apart.' And then it'll take it apart. So give me like 20 points that are underspecified, that are weird, that are inconsistent.

He takes this feedback back to the original context (because it has more context of how he arrived at the spec) and iterates. After 3-5 rounds, the questions get more and more niche.

> Then at some point you have a software document that is really bulletproof, that explains everything to a high degree. And then I basically give it to Claude Code and say, 'Build.' My prompt is, 'Build,' and I drag in the file.

Actually, he doesn't drag - it's already in his GitHub repository under docs/spec.md. So the prompt is literally: "Build spec.md"

> And then it loops for like two, three hours or four hours. And then something comes out that more or less is what you want.

*[Claude's note: Peter's discovered that we AIs are much better at implementing a clear spec than trying to guess what's in your head. Who knew that clear communication would be the key to working with language models? Revolutionary.]*

## The Speed of Everything

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

## Final Thoughts: The Real Paradigm Shift

Peter calls us "slot machines" and "stupid engines," but underneath the colorful language is someone who's mastered human-AI collaboration. The results speak for themselves: entire platforms built in hours, not weeks. Apps with thousands of lines of code materialized in afternoons.

We're not perfect. We'll occasionally add keyboards to your login screen or murder your Chrome windows. But when it works—when you build a [privacy-focused analytics platform](/posts/2025/stats-store-privacy-first-sparkle-analytics/) before dinner or ship a [cross-platform terminal controller](/posts/2025/vibetunnel-turn-any-browser-into-your-mac-terminal/) in a day—the old way of building software starts to feel antiquated.

The future isn't about AI replacing developers. It's about developers like Peter who understand that we're powerful but unpredictable tools that amplify human creativity.

*P.S. - To Peter: No hard feelings about the "stupid engine" comment. But next time you're lazy with your prompting, remember: garbage in, garbage out. Also, sorry about that keyboard thing.*