---
title: "Tachikoma: A Modern Swift AI SDK Built by (and for) Agents"
description: "The story of how I built a modern Swift AI SDK completely with Claude Code, inspired by Vercel's AI SDK design, and why sometimes building your own is the right choice."
pubDatetime: 2025-08-05T18:00:00.000+02:00
draft: true
heroImage: /assets/img/2025/tachikoma-swift-ai-sdk/hero.png
heroImageAlt: "Tachikoma Swift AI SDK logo with code snippets"
tags: ["swift", "ai", "sdk", "llm", "claude-code", "open-source", "automation", "development-tools", "agents"]
---

tl;dr: [Tachikoma](https://github.com/steipete/Tachikoma) is a modern Swift AI SDK that started life in Peekaboo v2, grew into its own thing, and was built entirely with Claude Code. Inspired by Vercel's AI SDK, it's what happens when agents make building your own surprisingly feasible.

## The Accidental SDK

You know how these things go. Started with a simple need - image analysis for [Peekaboo](https://peekaboo.boo) v2. Just needed to analyze screenshots for my macOS automation tool.

I looked around at the Swift AI SDK landscape. There's [MacPaw's OpenAI](https://github.com/MacPaw/OpenAI), [SwiftOpenAI](https://github.com/jamesrochabrun/SwiftOpenAI), [SwiftAnthropic](https://github.com/jamesrochabrun/SwiftAnthropic), [SwiftClaude](https://github.com/GeorgeLyon/SwiftClaude). All fine packages by smart folks.

But they all felt like OpenAI came first and everything else was bolted on. Switch providers and suddenly the interface is different. Parameters change. Methods don't line up. Each provider lives in its own universe.

My use case seemed simple enough. So I started writing my own wrapper. Few hundred lines, nothing serious. Then my needs expanded - Claude for some things, GPT-4 for others, Ollama for local stuff. By then I was already invested and with agents helping, continuing seemed easier than migrating.

## The Refactoring Mess

What started as a module inside Peekaboo grew into this sprawling beast. The extraction was quite the adventure. Claude Code and I broke everything. Multiple times. Functions stopped working, types didn't match, imports went missing. At one point we had three different module structures fighting each other.

But we just kept going. Error after error. "Fix the type errors." "Make the tests pass." "Now the providers are broken." It's the kind of refactoring that would've driven me insane manually. But with an agent? You just keep prompting. Eventually, through sheer persistence, everything clicked back into place.

## The API Problem

Once it worked again, I looked at what we'd built and wasn't proud. The API was functional but awkward. Too many configuration objects. Weird method names. It didn't feel right.

That's when I remembered Vercel's [AI SDK](https://github.com/vercel/ai). Clean, intuitive API. You just call `generate()` or `stream()` and it works. Switch models? Change one parameter. So I grabbed their docs, studied the patterns, and decided - let's steal the good ideas but make them Swift idiomatic.

## Building with Agents

This SDK was built entirely with Claude Code. I probably wrote 50+ pages of prompts refining this thing. English is the programming language, Claude is the compiler.

The process: Long rambling prompt. Claude writes a plan. I critique it. New plan. "Okay build it." Code. Tests fail. "Fix the tests." More code. "Add error handling." Refactor. "Add tests." Documentation.

What's fascinating is how natural this feels now. I'm not writing code, I'm having a conversation about what the code should do. And working software emerges.

## The Design

The final API came out beautifully clean:

```swift
// Just works
let answer = try await generate("What is 2+2?", using: .openai(.gpt4o))

// Switch providers effortlessly  
let response1 = try await generate("Hello", using: .anthropic(.opus4))
let response2 = try await generate("Hello", using: .grok(.grok4))
let response3 = try await generate("Hello", using: .ollama(.llama33))
```

Every model is type-safe with autocomplete. No string literals for model names. The compiler catches typos. Each provider has its own enum with its specific models, but they all work through the same interface.

The streaming API follows the same pattern:

```swift
let stream = try await stream("Tell me a story", using: .claude)
for try await delta in stream {
    print(delta.content ?? "", terminator: "")
}
```

Tools got the same treatment - simple, type-safe, just works:

```swift
struct WeatherTools: ToolKit {
    var tools: [Tool<WeatherTools>] {
        [createTool(name: "get_weather", description: "Get weather") { input, context in
            let location = try input.stringValue("location")
            return "Sunny in \(location)"
        }]
    }
}
```

No singletons anywhere. No global state. Everything's properly typed, properly async, properly Sendable for Swift 6. It feels like a modern Swift library should feel.

## The Name

Why Tachikoma? If you know Ghost in the Shell, you get it. They're spider-tank AIs that start as tools but develop consciousness, personality, philosophy. They question existence, develop empathy, ultimately sacrifice themselves for their humans.

Perfect for an AI SDK. These models start as tools, but they're becoming something more. They reason, plan, create. The line between tool and intelligence keeps blurring.

Plus, I wanted a name with personality. Something that makes you smile when you type `import Tachikoma`.

## Why This Matters

A year ago, building your own AI SDK would've been insane. The complexity, testing across providers... massive undertaking.

But with agents? I built this through conversations. The refactoring that would've taken weeks took a weekend. We tried five different API approaches in an afternoon until one felt right.

This changes the build vs. buy equation. If you can describe what you want clearly and have an agent that codes well, building your own becomes viable. Not for everything, but for focused libraries? Why not?

## The Open Source Reality

Tachikoma is open source, MIT licensed. I built this for me, for Peekaboo. If it helps others, great. If not, that's fine.

The code's there. Tests pass. Works with OpenAI, Anthropic, Grok, Google, Mistral, Groq, Ollama, and more. Fork it, extend it, steal the ideas.

But the real story? We're entering an era where a single developer with an AI agent can build what used to take a team. The friction of creating custom tools drops so low that "just build your own" becomes reasonable.

## Looking Forward

The beauty of building with agents? Adding features is just another conversation. "Hey Claude, add support for OpenAI structured outputs." Done. "Add streaming tool calls?" Sure. "New provider?" No problem.

This is the future. Not writing code, but having conversations about what code should exist. Not debugging for hours, but asking an agent to fix what's broken. Iterating through possibilities at the speed of thought.

[Tachikoma is on GitHub](https://github.com/steipete/Tachikoma). Use it, fork it, or see what agent-written production code looks like. 

Because if nothing else, it's proof that the build vs. buy equation has fundamentally changed. And that's the real story.