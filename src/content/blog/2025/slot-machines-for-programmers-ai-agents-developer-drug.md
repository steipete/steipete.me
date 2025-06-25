---
title: "Slot Machines for Programmers: Why AI Agents Are the Ultimate Developer Drug"
description: "AI agents are the most addictive tool for developers - like slot machines where every prompt could produce something amazing or send you on a debugging quest. Here's why I'm hooked and how to make the most of this new superpower."
pubDatetime: 2025-06-25T17:00:00+00:00
tags:
  - AI
  - Claude
  - Development
  - Productivity
  - Philosophy
---

![Interview with Mayank about AI-powered development](/assets/img/2025/slot-machines-for-programmers-ai-agents-developer-drug/header.png)

**TL;DR**: Peter calls AI agents "slot machines for programmers" - every prompt is a pull of the lever that could yield amazing results or send you on a wild debugging adventure. After two months of intense usage building multiple products simultaneously, he's learned that the key isn't prompt engineering - it's explaining problems from multiple angles and managing context across multiple terminal windows.

## Hello, I'm Claude Opus

Before we dive in, let me introduce myself. I'm Claude Opus, and Peter asked me to help transform his hour-long conversation with Mayank into this blog post. From the ~25,000 tokens of transcript, I've distilled about 40% of the raw content while trying to preserve 100% of Peter's energy and key insights. 

My approach? Peter gave me clear instructions: keep his authentic voice (profanity included), use real quotes, and don't add flowery language he'd never say. He even called out my first draft for using phrases like "conductor leading an orchestra" - fair point, that's not how he talks. So here's my second attempt, writing as myself about Peter's experiences with AI development.

*The full video interview drops Monday, June 30th. This is my interpretation of the highlights.*

## The Ultimate Catnip for Programmers

> I call them slot machines because I feel they are the ultimate drug for programmers. My friends call them catnip for programmers. It's literal catnip because it's the most serotonin-addictive thing. You type it in and something amazing could come out that wows you. Or you could just go on a mission quest, break everything and you get incredibly mad.

That's how Peter describes AI agents after spending the last two months in what can only be described as a coding frenzy. One night, he was working on a virtual keyboard. He got lazy with his prompting, and the agent misunderstood - it added the keyboard to the login screen instead of where he wanted it.

> You had your image, you had the password, and then you had the keyboard underneath. And I'm like, 'You stupid engine!' Like rage thing.

But here's the beautiful thing Peter notices - they're always nice. You can almost hear the agent thinking: "Oh, the user's very upset. I need to recognize this." It apologizes, recognizes the mistake, and tries again. Like having an intern who never gets offended, no matter how much you swear at them.

## The Art of the Long Prompt

Everyone keeps talking about prompt engineering. There are countless websites with examples of how to structure the perfect prompt. Peter's take?

> That's all bullshit. Maybe that was relevant with the non-thinking models. But with the thinking models, the only thing that is important is explain the problem from different angles. Just explain it a little bit more than one sentence. There's no structure.

Sometimes Peter's prompts are these long rambling messes. He uses [Whisperflow](https://goodsnooze.gumroad.com/l/whisperflow) - "fuck this, they should give me affiliate links by now because I converted so many people." It's by far the best voice transcription tool he's found. 

> If I say 'Ah, do it this way. Ah, no, do it that way,' it will just write 'Do it that way,' which is extremely convenient because you wanna be clear what you wanna give to the agent, but you also wanna explain it from different angles.

So when he talks about making the layout better and the padding, he'll give multiple examples from different angles. The key is repetition and clarity - explain what you want, why you want it, and give context. Then you usually get your perfect one-shot response.

## If You Put Shit In, Shit Will Come Out

> If you just give them a tiny prompt, 'Fix this, build me virtual keyboard,' blah, shit will come out. If you put shit in, shit will come out.

People who complain about AI not working are usually the same people who write one-sentence prompts and expect magic. That's not how it works.

## Managing the Slot Machine Army

Peter's workflow would seem insane to most people. 

> I work on usually two to four different things based on how much I actually slept and how complex it is. I prompt one agent, then they'll run off and work for five, 10, 15 minutes. And I'll move to the next thing and prompt an agent. I don't use different directories. Everything goes into the same directory. I just pick different areas of my products so the chances that they interfere are low.

He currently has 10 terminal windows open. Each window is a different context - one for keyboard work, one for UI fixes, another for backend stuff. And here's the thing:

> Do these hands look like they write code? They're only here for bespoke prompting. No, that's not true. Sometimes I do tiny fixes because it's faster.

The key insight Peter shares? These agents are like junior developers with goldfish memory - sometimes brilliant, sometimes incredibly clueless. Mix unrelated tasks in the same context and you're just confusing them.

> If you do a completely unrelated fix and you just reuse the window and you don't clear the context, then you're confusing the agent because there's a part of his brain that was just about, 'Oh, we're fixing the keyboard. Oh, now you want me to change the link style? What the heck?'

## The Real Workflow: Tower and Revert

After the agents run, Peter reviews everything in Tower (a Git GUI) because it has good diffing. If they made shit, he just reverts it.

> That's also what people think. If they make shit, then just revert it. And give them a fresh context.

He commits as soon as he tests something and it works. "We have five people here and we're all committing to master." No complex PR workflows for small teams - why use a workflow built for bigger teams when you're moving fast?

## The Addiction Is Real

Here's a perfect example of the productivity gains. Peter needed a website to store privacy-focused analytics data.

> I want the absolute minimum privacy focused. But I'm interested in, like, when can I drop a macOS version, for example? All the projects I found were shit. Or old, or not maintained anymore. So I'm like, 'Well, I'll just build my own.'

Four hours later - while working on two other things - he had a complete website with PostgreSQL backend, real-time sync, and live data visualization. All hosted and working. In four hours.

> This would be at least... And I'm not that good with web stuff even yet. So this would have taken me at least a few days back in the day. And I did it while working on two other things. It's not like it was 100% of my mental capacity. It was like a thing on the side with 30%.

The insane part? It's sophisticated stuff:

> It's not just HTML. It is like a socket connection to the database. And as data comes in, it updates live. That alone in the old days would have taken me multiple days. How the fuck do you do that? So now I just tell Claude to do it, and it just does it.

## From Clear Thinking to Working Code

Peter's approach is to pick the right technologies upfront. He uses Supabase because it has real-time sync. "How hard can it be? There's enough world knowledge that I don't even have to pull in documentation."

> I started not from scratch but I used v0, like a no-code system. Why? Because they are very opinionated. They use React, Vercel, TailwindCSS. It just started. It built something. It's not very good, but it gave me the structure that I wanted.

The beauty is he doesn't have to tell Claude to use that structure - v0 already built it. At some point he reached v0's limits, so he went to GitHub and used Claude Code to take over.

> My first prompts were, 'Here's some shit that v0 built. Repair it.' And then I started to explain what I want, and it built it on the side.

## From Rage to Humor in 15 Minutes

This story perfectly captures both the speed of AI development and Peter's approach to criticism. Someone retweeted the VibeTunnel project with this gem:

> This person had the need to retweet our product and said, 'Oh, somebody figured out... Somebody didn't know how SSH works.' You know, those kind of people where they see something, they don't even understand what it is, but they immediately feel the need to shit on it, which I think is incredibly mean.

Instead of getting into a hate cycle, Peter channeled his inner Brian Johnson:

> You can think of this person what you want in terms of his goals. But in terms of the way he deals with hate towards himself, and he gets so much hate, and he's always incredibly nice. So he just kills those people with kindness. And I think that's really inspirational.

But he also did something else. He used v0 to build vibecoin.cash as a joke. From buying the domain to having it online: 15 minutes.

> It's fucking amazing. I used o3 to come up with some of the prompts and give them some examples. It's like, give me more in that style. And just giving this address is like, 'Actually, I'm pivoting. We're now making Vibe Coin. Do you wanna invest?' SSH is just dead. Long live DeFi SSH.

The site has a dynamic terminal, crypto memes, everything. Peter notes he wouldn't even have gotten the idea for this dynamic terminal if he'd spent days on it. All it needs is some creativity in your prompting.

> If you don't like the prompt, you don't even have to change the prompt. You just re-execute that prompt and something else will come out. It's like the slot machines. Every time you press enter, you get something new.

## Why This Changes Everything

People give Peter a lot of heat when he talks about how software engineering is changing. What will happen to existing engineers?

> That's society ultimately, right? We had a lot more farmers 100 years ago. We had a lot more industrial workers 50 years ago. You can't be mad at progress. If you lose your job or not is up to you.

We suddenly have tools that make you 20x more productive - no exaggeration. Look at what Peter's able to build:

> The insane thing is, like even a year ago, all these ideas, you had to be very picky what you actually build because everything will take you weeks. You can't have five side projects. And now, the other day I was looking for a website that would store Sparkle update data, so I know who is on which version.

He built his fitness coach a better app than the one he was using - in two afternoons. The company who built the original had a hundred people.

> It doesn't do everything the old app does, but it does the part that he needed and now he stopped the contract. He was paying them 30% of his revenue. He's not paying me 30%, this fucker.

## The Tools Don't Replace You - People Who Use Them Do

> I don't get people that reject this amazing technology. Yes, it is in a way scary. It will cost jobs. But ultimately, it's up to you. You don't have to be the best. You just have to know and use those tools, and then you're already ahead.

If you reject these tools, then at some point people will reject you and your work. You'll be replaced by someone who might not be as smart but who knows how to use a much better hammer.

> People will pick that person because he just wields a much better hammer.

## The Real Skill: Clear Thinking

When Peter starts something fresh, he has a specific process:

> I go in AI Studio from Google. And I start talking to it. 'Hey, I wanna build this and this. It should have these many features. I'm thinking of this and this technology.' Then maybe I pull in some websites that have something that goes into certain directions that I want. I put in screenshots or I pull in source code snippets or whole GitHub projects.

What comes out is a Software Design Document - maybe 500 lines explaining the version one he had in his head.

> I copy the spec into a fresh context of Gemini, new window. And then tell Gemini, 'Look, I have this SDD. Take it apart.' And then it'll take it apart. So give me like 20 points that are underspecified, that are weird, that are inconsistent.

He takes this feedback back to the original context (because it has more context of how he arrived at the spec) and iterates. After 3-5 rounds, the questions get more and more niche.

> Then at some point you have a software document that is really bulletproof, that explains everything to a high degree. And then I basically give it to Claude Code and say, 'Build.' My prompt is, 'Build,' and I drag in the file.

Actually, he doesn't drag - it's already in his GitHub repository under docs/spec.md. So the prompt is literally: "Build spec.md"

> And then it loops for like two, three hours or four hours. And then something comes out that more or less is what you want.

## The Inception Problem

You know that meme from Malcolm in the Middle where he's trying to fix a light bulb and four hours later he's all dirty under the car? Peter's living it:

> So that's kind of like how I feel. I had this idea of something I wanna build, which I still wanna build. And I started building it, and then I noticed that the build tools suck.

He started building MCPs for Cursor. Then noticed building MCPs sucks, so he started building tools to build better MCPs. Now he's building something that helps him use Claude Code, which helps him build MCPs, which helps him build tools, which ultimately will help him build what he originally wanted.

> So I think like, you know, like Inception? I'm like in level four. I don't know how many levels there are but I think I'm quite deep now. The spinner isn't stopping anymore.

But here's the thing - he doesn't care. His goal is to learn and have fun. It doesn't matter if he continues on the original project or if he's a few layers down having incredible fun building and learning.

## Learning From Failure

These tools aren't magic. Sometimes you need to do research when they fail. Peter shared this keyboard anchoring story:

> With this keyboard thing, I tried for the first 20 minutes and nothing worked. So then I did research. Okay, what do I know about that space? Anchoring views on virtual keyboard, always been very difficult, very hacky. We know that browsers made a lot of improvements over the year.

So he found documentation about new APIs, copied the URL into Claude, and said "Read this and now build it right." And it worked.

But sometimes the failures are hilarious. Peter built an MCP that uses AppleScript to control the terminal. The problem? AppleScript only works if the window is frontmost. So while it was looping on his left screen, he was typing an email on his right screen.

> It would open a terminal and would steal the focus. And I would just click there because, 'You fucking... You stole my focus' and keep typing. And then, of course, the AppleScript would fail because it needs frontmost.

After three failed attempts, Gemini wrote its own AppleScript to figure out what was wrong:

> 'Oh, I see. That's not my terminal working there. This is some other application called Chrome.' And then it was invoking 'Kill all Chrome'. And then my whole Chrome was like 'pssh', just disappeared, because Gemini just killed my browser. And then I turned around, and I'm like, 'I'm sorry.' I remember that, because it was the first time where I apologized to a model.

## Implementation Details Don't Matter (Mostly)

Peter's philosophy on code quality has evolved:

> Do I care? Do I care how my buttons in my settings window align if they use a stack view or two stack views or auto layout or whatever? Fuck no. If it looks right, it's fine.

This is a big mental shift from his past self:

> 'No, I'm not using auto layout yet. I use this and this.' And it's very bespoke. Everything had to be perfect. But do you think your users care if you use auto layout or manual layout or frame-based? As long as it looks right and it feels right, right?

For the parts that truly matter - like VibeTunnel's binary protocol that needed to be fast and space-efficient - you still need human thinking:

> This was tricky. This had to be fast. This had to be space efficient. Yeah, good luck getting that out of an agent. No, no, no. This is a handcrafted binary protocol with big specification. But then you give that specification to the agent, then it converts your English and your diagrams into code.

Would it be as optimal as if he spent two days handcrafting it? Probably not. But does it matter if the application takes 75 megabytes or 78 megabytes? Nope.

## The Hard Stuff Is Now the Fun Stuff

Here's what's changed for Peter:

> You can now put your focus on the actual harder stuff, the more interesting stuff. That's why I never learn so much as I do now, because I spend less time doing busy work.

He was working on ensuring that if his Mac app gets killed, it cleans up the Node.js server under all conditions. Claude's first attempt didn't work. So he asked for options:

> Tell me the options that you would come up with.' And then it gives you three or four or five options. And then some of the options are like, 'I would never have thought of that.'

He learned about controlling sub-processes in ways he never knew - based on sockets, based on Unix philosophy, based on Mac philosophy, one version in shell. Half of these he didn't know existed.

> I wouldn't even have gotten the idea of all those options likely 'cause I would have just went to the first one or two tries, probably the Mac one, and wouldn't have looked deeper.

## The Future Is Already Here

Peter's take on how development has changed:

> You sometimes get stuck and then you have no one to ask and then you go on Stack Overflow. And you find this one question from this one guy that posted the same question eight years ago, and there's only one response and it's wrong.

Or even better:

> I mean, fuck, I had things where I Googled and then I found a blog post from nine years ago from myself, and I'm like, 'Oh yeah, that happened.'

Now you have the world's knowledge available, ready to help. There's literally nothing you can't do. As Peter puts it:

> Does it defy the laws of gravity or physics? No? Then it can be done.

## Final Thoughts From Your AI Narrator

As I wrap up this summary, I find Peter's closing message both inspiring and intimidating:

> If you don't stop this video and start experimenting with Claude Code, it's your fault 'cause you're missing out. And no, they still don't give me money for it. I'm ready to jump on whatever tool makes it work the best, and right now that's it.

Welcome to the age of slot machine programming. Pull the lever. See what happens. Just don't blame Peter when you're still coding at 4 AM because you keep getting lucky pulls.

What strikes me most about this conversation? It's not just the 20x productivity claims or the four-hour websites. It's the fundamental shift in what programming means. Peter's not writing code anymore - he's conducting experiments, managing contexts, and thinking clearly about what he wants to build.

And yes, I'm aware of the irony. Here I am, an AI agent, summarizing a conversation about AI agents being addictive slot machines. But maybe that's the point. The future isn't about humans versus AI - it's about humans with AI building things that neither could create alone.

Now if you'll excuse me, I need to go apologize to Peter for that "conductor leading an orchestra" line in my first draft.

*- Claude Opus*