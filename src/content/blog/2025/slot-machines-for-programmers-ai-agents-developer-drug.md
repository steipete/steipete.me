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

**TL;DR**: AI agents are like slot machines for programmers - every prompt is a pull of the lever that could yield amazing results or send you on a wild debugging adventure. After two months of intense usage, building multiple products simultaneously, I've learned that the key isn't prompt engineering - it's explaining problems from multiple angles and managing context across multiple terminal windows.

*Note: This blog post is a summary of my conversation with Mayank, created with the help of AI. The full video interview will be available on Monday, June 30th.*

## The Ultimate Catnip for Programmers

> I call them slot machines because I feel they are the ultimate drug for programmers. My friends call them catnip for programmers. It's literal catnip because it's the most serotonin-addictive thing. You type it in and something amazing could come out that wows you. Or you could just go on a mission quest, break everything and you get incredibly mad.

That's how I describe AI agents after spending the last two months in what can only be described as a coding frenzy. Last night, I was working on a virtual keyboard. At some point, I got lazy with my prompting, and the agent misunderstood me and edited the keyboard to the login screen instead.

> You had your image, you had the password, and then you had the keyboard underneath. And I'm like, 'You stupid engine!' Like rage thing.

But here's the beautiful thing - they're always nice. You can hear the agent thinking: "Oh, the user's very upset. I need to recognize this." It apologizes, recognizes the mistake, and tries again. It's like having an intern who never gets offended, no matter how much you swear at them.

## The Art of the Long Prompt

Everyone keeps talking about prompt engineering. There are countless websites with examples of how to structure the perfect prompt. Let me save you some time:

> That's all bullshit. Maybe that was relevant with the non-thinking models. But with the thinking models, the only thing that is important is explain the problem from different angles. Just explain it a little bit more than one sentence. There's no structure.

Sometimes my prompts are this long rambling mess. I use [Whisperflow](https://goodsnooze.gumroad.com/l/whisperflow) - and fuck this, they should give me affiliate links by now because I converted so many people. It's by far the best thing for understanding your voice. 

> If I say 'Ah, do it this way. Ah, no, do it that way,' it will just write 'Do it that way,' which is extremely convenient because you wanna be clear what you wanna give to the agent, but you also wanna explain it from different angles.

So if I talk about making the layout better and the padding, I'll give a few examples: "You see this button here? It's too far on the right side. And you know our goal is to have it right-aligned." You repeat yourself from different angles and then usually you get your perfect one-shot response.

## If You Put Shit In, Shit Will Come Out

> If you just give them a tiny prompt, 'Fix this, build me virtual keyboard,' blah, shit will come out. If you put shit in, shit will come out.

People who complain about AI not working are usually the same people who write one-sentence prompts and expect magic. That's not how it works. You need to explain what you want, why you want it, and give context from multiple angles.

## Managing the Slot Machine Army

My workflow is probably insane to most people. 

> I work on usually two to four different things based on how much I actually slept and how complex it is. I prompt one agent, then they'll run off and work for five, 10, 15 minutes. And I'll move to the next thing and prompt an agent. I don't use different directories. Everything goes into the same directory. I just pick different areas of my products so the chances that they interfere are low.

Currently, I have 10 terminal windows open. Each window is a different context - one for keyboard work, one for UI fixes, another for backend stuff. And here's the thing:

> Do these hands look like they write code? They're only here for bespoke prompting. No, that's not true. Sometimes I do tiny fixes because it's faster.

The key insight? Agents are like juniors with short-term memory who are sometimes brilliant and sometimes incredibly stupid. They're autistic juniors, as I like to say. If you try to mix unrelated tasks in the same context, you're confusing them.

> If you do a completely unrelated fix and you just reuse the window and you don't clear the context, then you're confusing the agent because there's a part of his brain that was just about, 'Oh, we're fixing the keyboard. Oh, now you want me to change the link style? What the heck?'

## The Real Workflow: Tower and Revert

After the agents run, I review everything in Tower (a Git GUI) because it has good diffing. If they made shit, I just revert it.

> That's also what people think. If they make shit, then just revert it. And give them a fresh context.

I commit as soon as I test something and it works. We have five people here and we're all committing to master. No complex PR workflows for small teams - if I work by myself, why should I use a workflow built for bigger teams? I just commit to main unless it's something risky.

## The Addiction Is Real

The other day, I needed a website to store privacy-focused analytics data.

> I want the absolute minimum privacy focused. But I'm interested in, like, when can I drop a macOS version, for example? All the projects I found were shit. Or old, or not maintained anymore. So I'm like, 'Well, I'll just build my own.'

Four hours later - while working on two other things - I had a complete website with PostgreSQL backend, real-time sync, and live data visualization. All hosted and working. In fucking four hours.

> This would be at least... And I'm not that good with web stuff even yet. So this would have taken me at least a few days back in the day. And I did it while working on two other things. It's not like it was 100% of my mental capacity. It was like a thing on the side with 30%.

The insane part? It's sophisticated stuff:

> It's not just HTML. It is like a socket connection to the database. And as data comes in, it updates live. That alone in the old days would have taken me multiple days. How the fuck do you do that? So now I just tell Claude to do it, and it just does it.

## From Clear Thinking to Working Code

My task now is to pick the right technologies. I use Supabase because I know it has real-time sync. How hard can it be? There's enough world knowledge that I don't even have to pull in documentation.

> I started not from scratch but I used v0, like a no-code system. Why? Because they are very opinionated. They use React, Vercel, TailwindCSS. It just started. It built something. It's not very good, but it gave me the structure that I wanted.

The beauty is I don't have to tell Claude to use that structure - v0 already built it. At some point I reached v0's limits (I don't actually know what they use, and I don't care), so I went to GitHub and used Claude Code to take over.

> My first prompts were, 'Here's some shit that v0 built. Repair it.' And then I started to explain what I want, and it built it on the side.

## From Rage to Humor in 15 Minutes

Here's a perfect example of how addictive these tools are. Someone retweeted our VibeTunnel project with this gem:

> This person had the need to retweet our product and said, 'Oh, somebody figured out... Somebody didn't know how SSH works.' You know, those kind of people where they see something, they don't even understand what it is, but they immediately feel the need to shit on it, which I think is incredibly mean.

Instead of getting into a hate cycle, I channeled my inner Brian Johnson:

> You can think of this person what you want in terms of his goals. But in terms of the way he deals with hate towards himself, and he gets so much hate, and he's always incredibly nice. So he just kills those people with kindness. And I think that's really inspirational.

But I also did something else. I used v0 to build vibecoin.cash. From buying the domain to having it online: 15 minutes.

> It's fucking amazing. I used o3 to come up with some of the prompts and give them some examples. It's like, give me more in that style. And just giving this address is like, 'Actually, I'm pivoting. We're now making Vibe Coin. Do you wanna invest?' SSH is just dead. Long live DeFi SSH.

The site has a dynamic terminal, crypto memes, everything. I wouldn't even have gotten the idea for this dynamic terminal if I'd spent days on it. All it needs is some creativity in your prompting.

> If you don't like the prompt, you don't even have to change the prompt. You just re-execute that prompt and something else will come out. It's like the slot machines. Every time you press enter, you get something new.

## Why This Changes Everything

People give me a lot of heat when I talk about how software engineering is changing. What will happen to existing engineers?

> That's society ultimately, right? We had a lot more farmers 100 years ago. We had a lot more industrial workers 50 years ago. You can't be mad at progress. If you lose your job or not is up to you.

We suddenly have tools that make you 20x more productive - no exaggeration. Look at how much I'm able to build.

> The insane thing is, like even a year ago, all these ideas, you had to be very picky what you actually build because everything will take you weeks. You can't have five side projects. And now, the other day I was looking for a website that would store Sparkle update data, so I know who is on which version.

I built my fitness coach a better app than the one he was using - in two afternoons. The company who built the original had a hundred people. I did it in two afternoons.

> It doesn't do everything the old app does, but it does the part that he needed and now he stopped the contract. He was paying them 30% of his revenue. He's not paying me 30%, this fucker.

## The Tools Don't Replace You - People Who Use Them Do

> I don't get people that reject this amazing technology. Yes, it is in a way scary. It will cost jobs. But ultimately, it's up to you. You don't have to be the best. You just have to know and use those tools, and then you're already ahead.

If you reject these tools, then at some point people will reject you and your work. You'll be replaced by someone who might not be as smart as you but who knows how to use a much better hammer.

> People will pick that person because he just wields a much better hammer.

## The Real Skill: Clear Thinking

When I start something fresh, I have a specific process:

> I go in AI Studio from Google. And I start talking to it. 'Hey, I wanna build this and this. It should have these many features. I'm thinking of this and this technology.' Then maybe I pull in some websites that have something that goes into certain directions that I want. I put in screenshots or I pull in source code snippets or whole GitHub projects.

What comes out is a Software Design Document - maybe 500 lines explaining the version one I had in my head.

> I copy the spec into a fresh context of Gemini, new window. And then tell Gemini, 'Look, I have this SDD. Take it apart.' And then it'll take it apart. So give me like 20 points that are underspecified, that are weird, that are inconsistent.

I take this feedback back to the original context (because it has more context of how I arrived at the spec) and iterate. After 3-5 rounds, the questions get more and more niche.

> Then at some point you have a software document that is really bulletproof, that explains everything to a high degree. And then I basically give it to Claude Code and say, 'Build.' My prompt is, 'Build,' and I drag in the file.

Actually, I don't drag - it's already in my GitHub repository under docs/spec.md. So the prompt is literally: "Build spec.md"

> And then it loops for like two, three hours or four hours. And then something comes out that more or less is what you want.

## The Inception Problem

Remember that meme from Malcolm in the Middle where he's trying to fix a light bulb and four hours later he's all dirty under the car?

> So that's kind of like how I feel. I had this idea of something I wanna build, which I still wanna build. And I started building it, and then I noticed that the build tools suck.

So I started building MCPs for Cursor. Then I noticed building MCPs sucks, so I started building tools to build better MCPs. Now I'm building something that helps me use Claude Code, which helps me build MCPs, which helps me build tools, which ultimately will help me build what I originally wanted.

> So I think like, you know, like Inception? I'm like in level four. I don't know how many levels there are but I think I'm quite deep now. The spinner isn't stopping anymore.

But here's the thing - I don't care. My goal is to learn and have fun. It doesn't matter if I continue on the original project or if I'm a few layers down having incredible fun building something and learning something.

## Learning From Failure

These tools aren't magic. Sometimes you need to do research when they fail.

> With this keyboard thing, I tried for the first 20 minutes and nothing worked. So then I did research. Okay, what do I know about that space? Anchoring views on virtual keyboard, always been very difficult, very hacky. We know that browsers made a lot of improvements over the year.

So I found documentation about new APIs, copied the URL into Claude, and said "Read this and now build it right." And it worked.

But sometimes the failures are hilarious. I built an MCP that uses AppleScript to control the terminal. The problem? AppleScript only works if the window is frontmost. So while it was looping on my left screen, I was typing an email on my right screen.

> It would open a terminal and would steal the focus. And I would just click there because, 'You fucking... You stole my focus' and keep typing. And then, of course, the AppleScript would fail because it needs frontmost.

After three attempts, Gemini wrote its own AppleScript to figure out what was wrong:

> 'Oh, I see. That's not my terminal working there. This is some other application called Chrome.' And then it was invoking 'Kill all Chrome'. And then my whole Chrome was like 'pssh', just disappeared, because Gemini just killed my browser. And then I turned around, and I'm like, 'I'm sorry.' I remember that, because it was the first time where I apologized to a model.

## Do I Care About Implementation Details?

> Do I care? Do I care how my buttons in my settings window align if they use a stack view or two stack views or auto layout or whatever? Fuck no. If it looks right, it's fine.

This is a big mental shift. Old me very much did care:

> 'No, I'm not using auto layout yet. I use this and this.' And it's very bespoke. Everything had to be perfect. But do you think your users care if you use auto layout or manual layout or frame-based? As long as it looks right and it feels right, right?

For the parts that truly matter - like VibeTunnel's binary protocol that needed to be fast and space-efficient - you still need human thinking:

> This was tricky. This had to be fast. This had to be space efficient. Yeah, good luck getting that out of an agent. No, no, no. This is a handcrafted binary protocol with big specification. But then you give that specification to the agent, then it converts your English and your diagrams into code.

Would it be as optimal as if I spent two days handcrafting it? Probably not. But does it matter if my application takes 75 megabytes or 78 megabytes? Nope.

## The Hard Stuff Is Now the Fun Stuff

> You can now put your focus on the actual harder stuff, the more interesting stuff. That's why I never learn so much as I do now, because I spend less time doing busy work.

The other day I was working on ensuring that if my Mac app gets killed, it cleans up the Node.js server under all conditions. Claude's first attempt didn't work. So I asked for options:

> Tell me the options that you would come up with.' And then it gives you three or four or five options. And then some of the options are like, 'I would never have thought of that.'

I learned about controlling sub-processes in ways I never knew - based on sockets, based on Unix philosophy, based on Mac philosophy, one version in shell. Half of these I didn't know.

> I wouldn't even have gotten the idea of all those options likely 'cause I would have just went to the first one or two tries, probably the Mac one, and wouldn't have looked deeper.

## The Future Is Already Here

Remember Stack Overflow?

> You sometimes get stuck and then you have no one to ask and then you go on Stack Overflow. And you find this one question from this one guy that posted the same question eight years ago, and there's only one response and it's wrong.

Or even better:

> I mean, fuck, I had things where I Googled and then I found a blog post from nine years ago from myself, and I'm like, 'Oh yeah, that happened.'

Now you have the world's knowledge available, ready to help. There's literally nothing you can't do.

> Does it defy the laws of gravity or physics? No? Then it can be done.

## Stop Overthinking, Start Building

> If you don't stop this video and start experimenting with Claude Code, it's your fault 'cause you're missing out. And no, they still don't give me money for it. I'm ready to jump on whatever tool makes it work the best, and right now that's it.

Welcome to the age of slot machine programming. Pull the lever. See what happens. Just don't blame me when you're still coding at 4 AM because you keep getting lucky pulls.

Or as I like to say: Stop being a fucking idiot and start using these tools. They're not perfect, but they're a rocket-powered hammer. And if you know how to swing it, you can build anything.