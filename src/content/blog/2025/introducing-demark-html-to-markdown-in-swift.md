---
title: "Introducing Demark: HTML in. MD out. Blink-fast."
description: "How I vibe coded my first Swift package using existing JavaScript libraries and AI assistance to solve HTML to Markdown conversion in Swift."
pubDatetime: 2025-06-01T19:45:00+01:00
heroImage: /assets/img/2025/demark/banner.png
tags: ["swift", "open-source", "development", "ai", "personal"]
---

I recently found myself needing a component that converts messy, potentially malformed HTML to clean Markdown in Swift. After searching around, I couldn't find anything that really fit my needs, so I decided to write my own. The result is [Demark](https://github.com/steipete/Demark) – my first Swift package that's now available on the [Swift Package Index](https://swiftpackageindex.com/steipete/Demark).

## The Problem

HTML to Markdown conversion sounds straightforward, but it's surprisingly complex when you need to handle:
- Malformed or messy HTML
- JavaScript-rendered content
- Complex nested structures
- Various HTML edge cases

I needed something reliable that could handle real-world HTML, not just clean, well-formed markup.

## The Solution: Standing on the Shoulders of Giants

Instead of writing a full-blown HTML parser from scratch, I took a different approach. Why reinvent the wheel when there are already excellent JavaScript libraries that solve this problem really well?

Demark leverages two proven JavaScript libraries:
- **[Turndown.js](https://github.com/mixmark-io/turndown)** for the most accurate conversions
- **[html-to-md](https://github.com/stonehank/html-to-md)** for faster, lightweight processing

The magic happens by running these libraries inside a WKWebView, giving me access to a full browser environment with proper DOM parsing capabilities.

## Two Conversion Engines

Demark offers flexibility with two different engines:

**[Turndown.js](https://github.com/mixmark-io/turndown) (Default)** - When you need accuracy:
- Full DOM-based parsing
- Handles complex HTML and JavaScript-rendered content
- Comprehensive configuration options
- ~100ms for first conversion (then much faster)

**[html-to-md](https://github.com/stonehank/html-to-md)** - When you need speed:
- Lightweight JavaScript-based conversion
- Much faster performance (~5-10ms per conversion)
- Perfect for batch processing simple HTML

## Vibe Coding with AI

Here's the thing – I probably would never have released this without AI assistance. But with AI, the whole process became so much easier. What would have taken me days of tedious work – setting up the package structure, writing documentation, handling edge cases, making it Swift Package Index ready – took me just a few hours.

AI helped me:
- Structure the Swift package properly
- Write comprehensive documentation
- Handle all the WebKit integration details
- Create a clean, modern Swift API with async/await
- Set up proper error handling

## Simple to Use

Despite the complexity under the hood, Demark is dead simple to use. The Swift package that turns down HTML and turns up Markdown – it's a markup markdown!

```swift
import Demark

@MainActor 
func convertHTML() async throws {
    let demark = Demark()
    let html = "<h1>Hello World</h1><p>This is <strong>bold</strong> text.</p>"
    let markdown = try await demark.convertToMarkdown(html)
    print(markdown)
    // Output: # Hello World
    //
    // This is **bold** text.
}
```

## My First Swift Package

Demark works across all Apple platforms: iOS, macOS, watchOS, tvOS, and visionOS.

I'm quite happy about this milestone. After years of iOS development, publishing my first Swift package feels like a natural next step in my open source journey. The fact that it's now in the [Swift Package Index](https://swiftpackageindex.com/steipete/Demark) makes it easily discoverable and installable for other developers.

The experience taught me that sometimes the best solution isn't writing everything from scratch – it's about cleverly combining existing, battle-tested solutions in a new way.

## Try It Out

If you need HTML to Markdown conversion in your Swift projects, give [Demark](https://github.com/steipete/Demark) a try. You can add it to your project via Swift Package Manager:

```swift
dependencies: [
    .package(url: "https://github.com/steipete/Demark.git", from: "1.0.0")
]
```

The repository includes an example app with a dual-pane interface where you can test conversions in real-time. Perfect for seeing exactly how your HTML will be transformed.

Here's to many more Swift packages! 🚀