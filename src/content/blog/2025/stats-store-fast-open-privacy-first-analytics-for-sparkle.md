---
title: "stats.store: Fast, Open, Privacy-First Analytics for Sparkle"
description: "Introducing stats.store - a modern, privacy-focused analytics platform designed specifically for Sparkle-based macOS apps. Track downloads, updates, and user behavior without compromising privacy."
pubDatetime: 2025-06-18T10:00:00.000+01:00
heroImage: /assets/img/2025/stats-store/hero.png
heroImageAlt: "stats.store analytics dashboard showing Sparkle update statistics"
tags:
  - macOS
  - Sparkle
  - Analytics
  - Privacy
  - Swift
draft: false
---

Last night I got curious about how many people are actually using [VibeTunnel](https://vibetunnel.com). But I'm also philosophically against deep app analytics. Everything I make is open source and free, and integrating an analytics SDK just didn't feel right.

Sparkle, however, has a very basic [system profiling](https://sparkle-project.org/documentation/system-profiling/) feature that gives us just the macOS version and a count of people who opened the app at some point during the week. That's enough to keep us motivated while being privacy-preserving - no IP addresses, no usage tracking, no intrusive details.

The problem? When I checked the Sparkle project website, all the backend implementations I found were ancient and mostly deprecated. [Sparkler](https://github.com/mackuba/sparkler) hasn't been updated in years, [JDSparkle](https://github.com/balthisar/JDSparkle) is built on an older version of CakePHP, and most other solutions listed are simple PHP scripts from a decade ago. It seems most developers have moved to more intrusive analytics solutions. 

What do you do in that case? You build it yourself.

Right at the motto: "How hard can it be?" 

I used Google's AI Studio and wrote down a simple specification with the features I wanted. You can find the spec on [GitHub as spec.md](https://github.com/steipete/stats-store/blob/main/spec.md) if you want to follow my workflow. Once I had the spec, I fed it into [v0](https://v0.dev) from Vercel because they have a very opinionated way of building software. They use Tailwind, shadcn/ui, Next.js, and Supabase - a stack I'm already familiar with and generally just nice to work with.

I let it cook, and it took about five or six iterations of me typing "continue" into v0 to have something workable. As you'll see, v0 is really good for frontend work, but as soon as things get more complex, the cracks start to appear. It made mistakes and had difficulties fixing them, so eventually I just synced the project to GitHub and continued with Claude Code - my go-to agent. Claude fixed everything up, added tests, dark mode, improved the design, changed the API flow, and more.

The whole project took me around six hours on the side while I was also working on the next release of VibeTunnel. And yes, I have to admit it also took about an hour to pick a good domain - but I really like stats.store.

Today, I'm excited to introduce [stats.store](https://stats.store) - a privacy-first analytics platform designed specifically for Sparkle-based macOS applications.

## Why Another Analytics Service?

Most analytics platforms are built for web or mobile apps. They're heavy, invasive, and often overkill for desktop applications. I wanted something that:

- **Respects user privacy** - No tracking cookies, no personal data collection
- **Works seamlessly with Sparkle** - Drop-in integration with minimal code changes
- **Provides actionable insights** - Not just vanity metrics, but data that helps improve your app
- **Is blazingly fast** - Built with modern infrastructure that scales

## Privacy by Design

stats.store follows a strict privacy-first approach:

- **No personal data collection** - We never collect IP addresses, device IDs, or any personally identifiable information
- **Anonymous aggregation** - All data is aggregated and anonymized before storage
- **GDPR compliant** - Built from the ground up to respect user privacy rights
- **Open source client** - The Sparkle integration is fully open source for transparency

## Key Features

### Real-Time Update Tracking
See how users interact with your updates in real-time. Track:
- Download rates for each version
- Update adoption curves
- Skip rates and reasons
- System requirements impact

### Crash-Free Rate Monitoring
Monitor your app's stability across versions:
- Track crash-free sessions
- Identify problematic releases quickly
- Compare stability across macOS versions
- Get alerts for regression issues

### User Environment Insights
Understand your user base better:
- macOS version distribution
- Hardware capabilities (anonymized)
- Update channel preferences
- Geographic distribution (country-level only)

### Smart Alerts
Get notified when things matter:
- Unusual crash spike detection
- Slow update adoption warnings
- Server-side issues with update delivery
- Custom threshold alerts

## Simple Integration

Adding stats.store to your Sparkle-based app takes just a few lines of code:

```swift
import StatsStore
import Sparkle

// Initialize stats.store with your app ID
StatsStore.configure(appId: "your-app-id")

// That's it! stats.store automatically integrates with Sparkle
let updater = SPUStandardUpdaterController(
    startingUpdater: true,
    updaterDelegate: nil,
    userDriverDelegate: nil
)
```

The SDK automatically tracks:
- Update checks and downloads
- Installation success/failure
- User choices (install now, later, skip)
- Crash-free sessions
- Basic system info (macOS version, architecture)

## Built for Performance

stats.store is built on modern infrastructure:

- **Edge computing** - Data is processed close to your users for minimal latency
- **Real-time processing** - See updates as they happen, not hours later
- **Efficient data format** - Minimal bandwidth usage for your users
- **Global CDN** - Fast dashboard access from anywhere

## Free for Open Source

Here's the thing: if you're building open source Mac apps, stats.store is completely free. I'll take over the hosting costs, which really aren't significant with Vercel and Supabase. 

I don't want this to be a complete self-service product because the risk of people adding garbage is too high. If you have an open source Mac app and want your statistics to be public, text or email me, and I'll add an entry to the backend. And by backend, I mean I'll just go into Supabase and edit the table - because we're scrappy and I don't need an actual backend when Supabase has a perfectly amazing editor.

If we get a few people to do this, we should have a really nice overview of how fast people update their macOS versions and which machines are common, which I think is interesting data for the entire Mac developer community.


## Open Source Foundation

The project is fully open source, MIT-licensed, and available on [GitHub](https://github.com/steipete/stats-store). You can:
- Audit the code to ensure privacy compliance
- Contribute improvements
- Build custom integrations
- Self-host the client-side components

## What's Next

I'm actively working on:
- **Windows support** - For WinSparkle and Squirrel.Windows
- **Custom events** - Track app-specific metrics
- **A/B testing** - Test update strategies
- **Public dashboards** - Share your app's stats publicly
- **API access** - Build custom integrations

## Try It Today

Visit [stats.store](https://stats.store) to create your free account and start getting insights into how users interact with your Sparkle updates. The platform is in early access, and I'd love your feedback on what features would be most valuable for your apps.

Building desktop apps is hard enough - understanding how users interact with updates shouldn't be. stats.store makes it simple to get the insights you need while respecting the privacy your users deserve.

## Technical Deep Dive

For those interested in the technical implementation, stats.store uses:

- **Next.js** - Modern React framework with server-side rendering
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Tailwind CSS + shadcn/ui** - For a clean, responsive design
- **Vercel** - Edge deployment for global performance
- **TypeScript** - Type-safe from database to frontend

The entire stack was chosen for rapid development and low operational overhead. Building with AI tools like v0 and Claude Code meant I could focus on the product rather than boilerplate.

*Have questions or feedback? Reach out on [Twitter](https://twitter.com/steipete) or [email](mailto:steipete@gmail.com). I'd love to hear about your experience with Sparkle and what analytics would help you build better apps.*