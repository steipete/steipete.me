---
title: "stats.store: Building a Privacy-First Sparkle Analytics Backend in 6 Hours"
description: "How curiosity about VibeTunnel users led me to build stats.store - a free, open source analytics backend for Sparkle using AI tools, all while cooking dinner."
pubDatetime: 2025-06-18T10:00:00.000+01:00
heroImage: /assets/img/2025/stats-store/hero.png
heroImageAlt: "stats.store analytics dashboard showing Sparkle update statistics"
tags:
  - macOS
  - Sparkle
  - Analytics
  - Privacy
  - AI
draft: false
---

Last night I got curious about how many people are actually using [VibeTunnel](https://vibetunnel.com). But I'm also philosophically against deep app analytics. Everything I make is open source and free, and integrating an analytics SDK just didn't feel right.

Sparkle has this neat little [system profiling](https://sparkle-project.org/documentation/system-profiling/) feature that's perfect for people like me - it just tells you the macOS version and how many people opened your app this week. No IP addresses, no creepy tracking, just enough to stay motivated.

The problem? When I checked for backend implementations, everything was ancient. [Sparkler](https://github.com/mackuba/sparkler)? Years old. [JDSparkle](https://github.com/balthisar/JDSparkle)? Running on outdated CakePHP. Most others were PHP scripts from a decade ago.

So naturally, I thought: "How hard can it be?"

## Building stats.store with AI

I fired up Google's AI Studio and wrote a simple spec (you can see it on [GitHub](https://github.com/steipete/stats-store/blob/main/spec.md)). Then I fed it into [v0](https://v0.dev) - they use Next.js, Supabase, Tailwind, and shadcn/ui, a stack I already know and love.

After about five or six rounds of typing "continue" into v0, I had something workable. But v0 is great for frontend, less so when things get complex. It started making mistakes it couldn't fix. So I synced to GitHub and let Claude Code take over. Claude added tests, dark mode, improved the design, fixed the API flow - the works.

Total time? Six hours. All while working on the next VibeTunnel release. Plus an hour picking the perfect domain (I really like stats.store).

## What is stats.store?

It's exactly what I needed: a modern, privacy-first analytics backend for Sparkle. You get:

- Basic update statistics (who's updating, who's not)
- macOS version distribution
- Zero personal data collection
- Real-time updates
- A clean dashboard

The whole thing is [open source and MIT-licensed](https://github.com/steipete/stats-store).

## Free for Open Source

Here's the deal: if you're building open source Mac apps, it's completely free. I'll cover the hosting (Vercel and Supabase make this pretty cheap anyway).

Want in? Just email me. I'll add your app to the backend - and by backend, I mean I'll literally go into Supabase and edit the table. We're keeping it scrappy.

If enough people join, we'll have a nice community dataset showing how fast Mac users update their OS and what hardware they're running. Could be interesting!

## The Tech Stack

For the curious:
- **Next.js** for the web app
- **Supabase** for the database
- **Tailwind CSS + shadcn/ui** for styling
- **TypeScript** everywhere
- **Vercel** for hosting

Building with AI meant I spent time on the product, not boilerplate. The future is wild.

## Try It

Check out [stats.store](https://stats.store). If you have a Sparkle-based Mac app and want simple, privacy-respecting analytics, let me know. Together we can build something useful for the Mac developer community.

*Questions? Hit me up on [Twitter](https://twitter.com/steipete) or [email](mailto:steipete@gmail.com).*