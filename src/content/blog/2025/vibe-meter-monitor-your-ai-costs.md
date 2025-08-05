---
title: "Vibe Meter: Monitor Your AI Costs"
pubDatetime: 2025-06-04T12:00:00.000+01:00
description: "How I built Vibe Meter, a macOS menu bar app to track AI spending in real-time - from workshop demo to shipped product in three days."
heroImage: /assets/img/2025/vibe-meter/hero.jpg
tags:
  - AI
  - Development
  - Swift
  - macOS
  - Cursor
  - Side Projects
---

My Cursor bill hit $900 for the month. I needed a simple way to track AI spending without constantly checking dashboards. That frustration sparked [Vibe Meter](https://www.vibemeter.ai/) - my first shipped Mac app built in three intense days.

What started as a workshop demo became a sophisticated menu bar utility using Swift 6, SwiftUI, and extensive AI assistance.

## What the AIs Say

I had several AI models analyze the [VibeMeter codebase](https://github.com/steipete/VibeMeter):

**O3**: "Name vs. purpose mismatch – it sounds like a mood tracker, but monitors AI-API spending."

**Claude Opus**: "86% test coverage is extraordinary. Code quality rivals what I see in major tech companies. This isn't just a 'side project' - it's a case study in how to build macOS software the right way."

**Gemini**: "Intentionally over-engineered for future growth."

## From Workshop Demo to Production App

I ran [a live workshop](/posts/2025/the-future-of-vibe-coding/) demonstrating AI-assisted development. Since Cursor lacks a public API, we reverse-engineered their web interface, extracted cookies, and called internal endpoints. Built both Electron and macOS versions in parallel.

The feedback surprised me - people actually found it useful. When [Gergely Orosz](https://x.com/GergelyOrosz) mentioned linking to it in his newsletter, I spent two more days polishing the rough demo into something shippable.

Cursor has no public API for cost control, and it was somewhat messy because I have an enterprise account while many people have individual accounts, and the API endpoints are quite different. Getting both right was tricky.

Special thanks to [Oliver Drobnik](https://x.com/Cocoanetics) for helping me fix the individual account parsing. The second 90% of finishing an app always takes longer than the first 90%.

> **Looking for testers:** Need someone with multiple Cursor teams to help test. Current implementation assumes one team only.

## Key Technical Challenges

### SwiftUI vs AppKit: The Eternal Dance

I used SwiftUI wherever possible, but macOS menu bar apps expose the framework's limitations. Need a popover without the arrow? Drop down to AppKit. Want to show settings from a menu item? More AppKit gymnastics.

I needed a [custom NSPanel](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Presentation/Components/CustomMenuWindow.swift) for precise menu bar control. Memory management got tricky in release builds - weak references to windows deallocated before appearing.

Even showing settings required [a reflection hack](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Core/Utilities/NSApplication%2BopenSettings.swift) accessing internal NSMenuItem properties. Apple deprecated the old methods, but the "correct" SwiftUI approach only works from SwiftUI views.

### The Animation Breakthrough

I'm proud of the [animated menu bar icon](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Presentation/Components/GaugeIcon.swift). Almost used Lottie, but SwiftUI was enough. ChatGPT converted a static icon into animatable code.

The gauge moves with spending levels, uses conic gradients for loading shimmer. ImageRenderer converts SwiftUI to NSImage for the status item.

### Swift 6 Concurrency Deep Dive

This was my first production app using Swift 6's strict concurrency model. The [architecture heavily relies on actors](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Core/Services/) for thread safety:

- [CursorAPIClient](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Core/Providers/Cursor/CursorAPIClient.swift) and [ExchangeRateManager](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Core/Services/ExchangeRateManager.swift) as actors
- `@MainActor` isolation for UI components  
- Structured concurrency with TaskGroup in [MultiProviderDataOrchestrator](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Core/Services/MultiProviderDataOrchestrator.swift)
- `async/await` throughout, ditching Combine entirely

The learning curve was steep - debugging `UNUserNotificationCenter` delegate callbacks firing on background threads while trying to update `@MainActor` state was particularly painful. 

One bug drove me crazy: perfect in debug, window wouldn't show in release. SwiftUI view held weakly by AppKit disappeared before display. No crash, just nothing.

Claude figured it out when I explained the symptoms. Reminder: always test release builds.

### Apple's Distribution Gauntlet

The hardest part wasn't coding - it was signing, notarization, and distribution. Apple's process is error-prone: you can notarize an app but miss deep notarization of embedded frameworks (like Sparkle), leaving you with a partially notarized app that won't run.

Rather than wrestle with Fastlane, I built [custom shell scripts](https://github.com/steipete/VibeMeter/tree/main/scripts) that are much more debuggable. Now Claude can create releases by simply running "make a new release 1.1 beta 1" - the automation is beautiful once set up.

The scripts handle everything: incrementing build numbers, creating DMGs, uploading to GitHub releases, generating Sparkle appcast files. The most complex part was handling Sparkle's EdDSA signatures correctly - the error messages when you get it wrong are cryptic at best. Pro tip: always test your update feed locally before pushing.

## Interesting Technical Details

### Multi-Provider Architecture

Though [Vibe Meter](https://github.com/steipete/VibeMeter) only supports Cursor currently, the architecture anticipates multiple providers. The [MultiProviderDataOrchestrator](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Core/Services/MultiProviderDataOrchestrator.swift) and protocol-based design make adding OpenAI or Anthropic straightforward when the time comes.

I really had to hold myself back from implementing OpenAI and Anthropic support right away. When I realized this would be useful for tracking all AI costs - not just Cursor - the temptation was strong. But I knew if I started adding providers, I'd never ship. So I built the architecture to support it but forced myself to ship with just Cursor. This is definitely coming in a future update.

The multi-provider design might seem like overkill, but it's already paying dividends. When debugging, I can easily add a mock provider that returns test data. The orchestrator handles provider failures gracefully - if Cursor's API is down, the app doesn't crash, it just shows cached data with a subtle indicator.

### Polish in the Details

Small touches matter. The app includes:
- [Currency conversion](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Core/Services/ExchangeRateManager.swift) with real-time exchange rates
- [Gravatar integration](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Presentation/Components/UserAvatarView.swift) for user avatars (SHA-256 hashing, retina support)
- Comprehensive [network connectivity monitoring](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Core/Services/NetworkConnectivityMonitor.swift)
- [ApplicationMover](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Core/Utilities/ApplicationMover.swift) for automatic /Applications folder relocation
- Spending limit notifications with [configurable thresholds](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Core/Services/SpendingLimitsManager.swift)

### Agent-Friendly Development

I constrained every file to under 300 lines - agents make fewer mistakes with smaller files. This forced better organization and created a more maintainable codebase for both humans and AI. Using [Tuist](https://tuist.io) for project generation also helped since agents struggle with Xcode's complex `.pbxproj` files.

## By the Numbers

What emerged surprised even me:

- **174 Swift files** totaling **28,599 lines** of code
- **86% test coverage** with 628 individual test methods  
- **18 shell scripts** (2,857 lines) for build automation
- **437 occurrences** of Swift 6 concurrency keywords
- **15 protocols** for loose coupling and testability

The largest files respect the 300-line constraint: [ApplicationMover.swift](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Core/Utilities/ApplicationMover.swift) (390 lines), [SparkleUpdaterManager.swift](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Core/Services/SparkleUpdaterManager.swift) (361 lines), and [Color+Theme.swift](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Core/Theme/Color%2BTheme.swift) (358 lines). The build infrastructure alone required comprehensive scripts for [code signing](https://github.com/steipete/VibeMeter/blob/main/scripts/sign-and-notarize.sh) (349 lines), [release automation](https://github.com/steipete/VibeMeter/blob/main/scripts/setup-sparkle-release.sh) (314 lines), and [notarization](https://github.com/steipete/VibeMeter/blob/main/scripts/notarize-app.sh) (312 lines).

## The Testing Philosophy

I wanted to see how well AI generates tests. For a hobby project like this, I probably wouldn't have written any. But they caught real bugs:

- Currency conversion edge cases (what happens when the exchange rate API is down?)
- Cookie expiration handling (Cursor cookies last 30 days, not forever)
- Timezone bugs (monthly spending resets at UTC midnight, not local time)
- The classic "what if the user has no internet?" scenarios

The [UserDefaultsBackedAdvancedTests](https://github.com/steipete/VibeMeter/blob/main/VibeMeterTests/Core/Utilities/UserDefaultsBackedAdvancedTests.swift) alone has 374 lines testing every possible edge case of property wrappers. Did we need all of them? Probably not. Did they catch bugs? Absolutely.

## Lessons Learned

**Context windows matter**. I ran six Claude instances concurrently - one for linting, one for tests, one for UI, one for features, one for bugs. First time trying this strategy. Worked beautifully. The more an agent knows about previous related tasks, the better it performs.

**Small files matter**. The 300-line constraint prevented agent editing mistakes and forced better architecture. What seemed like a limitation became a forcing function for good design.

**SwiftUI has come far**. Despite the AppKit gymnastics required for menu bar specifics, SwiftUI handled 90% of the UI beautifully. The animation capabilities particularly impressed me.

**Modern Swift is powerful**. Swift 6's actor model and structured concurrency made complex state management surprisingly manageable, even for a concurrency novice.

**AI agents love writing tests**. Embrace it. The comprehensive test suite they generated caught bugs I never would have thought to test for.

## Performance Notes

A menu bar app needs to be lightweight. Vibe Meter uses about 45MB of memory and essentially zero CPU when idle. The [BackgroundDataProcessor](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Core/Services/BackgroundDataProcessor.swift) refreshes data every 5 minutes by default, but backs off exponentially if errors occur.

One optimization I'm proud of: the app only loads exchange rates when you actually use a non-USD currency. The [ExchangeRateManager](https://github.com/steipete/VibeMeter/blob/main/VibeMeter/Core/Services/ExchangeRateManager.swift) caches rates for 24 hours and falls back gracefully if the API is down. Small touches, but they matter for an app that runs 24/7.

If you're tracking AI costs, try [Vibe Meter](https://www.vibemeter.ai/). Source on [GitHub](https://github.com/steipete/VibeMeter). Watch the [workshop recording](/posts/2025/the-future-of-vibe-coding/) to see where it started.

Three days. One person. Six AI assistants. The future is weird.