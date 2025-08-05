---
title: "Making AppleScript Work in macOS CLI Tools: The Undocumented Parts"
pubDatetime: 2025-07-03T14:00:00.000+01:00
description: "How to make AppleScript work in macOS CLI tools without permission dialogs blaming Terminal. A deep dive into Info.plist embedding, TCC, and undocumented APIs born from building Terminator MCP."
heroImage: /assets/img/2025/applescript-cli-macos-complete-guide/header.png
tags:
  - macOS
  - Development
  - AppleScript
  - CLI
  - Swift
  - Security
  - MCP
  - AI
  - Cursor
---

*Or: How I Learned to Stop Fighting TCC and Embrace the Info.plist*

**TL;DR:** If you're building a macOS CLI that uses AppleScript, you need to embed an Info.plist into your binary, sign it with proper entitlements, and optionally use the undocumented `responsibility_spawnattrs_setdisclaim` API to avoid permission dialogs that blames the hosting app.

This all started with Cursor being annoying. You know how it goes - you're in the zone, AI is looping through its tasks, and then bam! The inline terminal opens something blocking (file watcher, dev server, ...) and the whole loop stops. I have to manually click around to get things moving again.

My solution? Build an MCP that controls an external terminal. That way, even when commands block, Cursor's loop keeps running. I called it [Terminator](https://github.com/steipete/Terminator) - 'cause who doesn't love a good terminal/Terminator pun?

## The Evolution of a Hack

My first attempt was [pure AppleScript](https://github.com/steipete/Terminator/blob/main/scripts/terminator.scpt) - simple, direct terminal automation. It worked! Well, sort of... The script needed window focus to function, which meant it would constantly steal focus while Cursor was running.

The focus-stealing got so bad that at one point, the AI started writing its own AppleScript to detect which app was in the foreground. When it discovered Chrome was blocking its terminal access, it simply... killed all my Chrome windows. That was [the first time I apologized to an AI agent](https://steipete.me/posts/2025/when-ai-meets-madness-peters-16-hour-days#the-gemini-chrome-massacre). Clearly, I needed a better solution.

That's when I fell down the rabbit hole. Getting AppleScript to work in a CLI tool turned out to be a maze of undocumented APIs, security permissions, and macOS quirks that nobody warns you about.

Sure, I could have used Apple's [`osascript`](https://developer.apple.com/documentation/uniformtypeidentifiers/uttype-swift.struct/osascript) command and called it a day. But where's the fun in that? Plus, AppKit's AppleScript API gives you much better error handling - if you can get it working.

## Plot Twist: Enter Claude Code

Here's the thing - I never actually finished Terminator. Why? Because [Claude Code](https://docs.anthropic.com/en/docs/claude-code) came along and made it obsolete. As a massive Claude Code fanboy (seriously, [check](https://steipete.me/posts/2025/claude-code-is-my-computer/) [out](https://steipete.me/posts/2025/commanding-your-claude-code-army/) [my](https://steipete.me/posts/command-your-claude-code-army-reloaded/) [posts](https://steipete.me/posts/2025/vibe-meter-2-claude-code-usage-calculation/)), I ditched Cursor. Claude Code doesn't have these inline terminal blocking issues.

I'm writing this here since future you or me will stumble into the same issue eventually, and hopefully you can just drag this URL into Claude Code and it'll fix everything up. Let Terminator lurk unfinished in my GitHub.

## The Problem: Terminal Gets All the Blame

Here's what happens when you naively use `NSAppleScript` in a CLI tool:

```swift
let script = NSAppleScript(source: "tell application \"Finder\" to activate")
script?.executeAndReturnError(nil)  // Spoiler: This won't work as expected
```

You'll either get:
1. Silent failure (no error, no result, no nothing)
2. A permission dialog that says "Terminal wants to control Finder/Cursor" (not your cli)
3. Error -1750 (errOSASystemError) with zero helpful context

The root cause? macOS's security model requires proper app identification through bundle IDs, code signing, and entitlements. Without these, your CLI tool is just an anonymous process hiding behind Terminal.

## The Solution: Give Your CLI an Identity

### Step 1: The Magic Info.plist

First revelation: CLI tools can have Info.plist files! Here's the minimal version that makes everything work:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>com.yourcompany.yourcli</string>
    <key>CFBundleName</key>
    <string>YourCLI</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>NSAppleEventsUsageDescription</key>
    <string>YourCLI needs to send AppleEvents to control other applications for automation.</string>
</dict>
</plist>
```

That `NSAppleEventsUsageDescription` is crucial - it's what users see in the permission dialog. Make it clear and specific.

### Step 2: Embedding the Info.plist (The Secret Sauce)

Here's where it gets interesting. You need to embed this Info.plist into your binary's `__TEXT/__info_plist` section. For Swift Package Manager:

```swift
// Package.swift
.executableTarget(
    name: "yourcli",
    dependencies: [/* ... */],
    linkerSettings: [
        .unsafeFlags([
            "-Xlinker", "-sectcreate",
            "-Xlinker", "__TEXT",
            "-Xlinker", "__info_plist",
            "-Xlinker", "Sources/Resources/Info.plist"
        ])
    ]
)
```

This creates a special section in your binary that macOS reads to identify your app. You can verify it worked:

```bash
otool -s __TEXT __info_plist yourcli | xxd -r -p | plutil -p -
```

### Step 3: Entitlements for the Paranoid OS

Create an entitlements file - yes, CLI tools can have these too:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.automation.apple-events</key>
    <true/>
</dict>
</plist>
```

### Step 4: Code Signing (The Final Boss)

Here's my battle-tested signing script that handles both development and production:

```bash
#!/bin/bash
set -e

BINARY_PATH=".build/release/yourcli"

# Check for Developer ID certificate
if security find-identity -p codesigning -v | grep -q "Developer ID Application"; then
    # Production signing
    SIGNING_IDENTITY=$(security find-identity -p codesigning -v | \
        grep "Developer ID Application" | head -1 | awk '{print $2}')
    
    codesign --force \
        --sign "$SIGNING_IDENTITY" \
        --options runtime \
        --entitlements "yourcli.entitlements" \
        --identifier "com.yourcompany.yourcli" \
        --timestamp \
        "$BINARY_PATH"
else
    # Ad-hoc signing for development
    codesign --force \
        --sign - \
        --entitlements "yourcli.entitlements" \
        --identifier "com.yourcompany.yourcli" \
        "$BINARY_PATH"
fi
```

## The Advanced Stuff: Escaping Cursor's Shadow

Remember how permission dialogs blame the hosting app (e.g. Cursor when you build an MCP) instead of your app? There's an undocumented API to fix that: `responsibility_spawnattrs_setdisclaim`. I discovered this gem from [Qt's excellent blog post about the responsible process problem](https://www.qt.io/blog/the-curious-case-of-the-responsible-process).

```swift
// Bridge the private API
@_silgen_name("responsibility_spawnattrs_setdisclaim")
func responsibility_spawnattrs_setdisclaim(
    _ attr: UnsafeMutablePointer<posix_spawnattr_t?>,
    _ disclaim: Int32
) -> Int32

// Use it to launch a subprocess that owns its permissions
func launchWithOwnPermissions(path: String, arguments: [String]) throws {
    var attr: posix_spawnattr_t?
    posix_spawnattr_init(&attr)
    defer { posix_spawnattr_destroy(&attr) }
    
    // The magic happens here
    responsibility_spawnattrs_setdisclaim(&attr, 1)
    
    var pid: pid_t = 0
    let argv = ([path] + arguments).map { strdup($0) }
    defer { argv.forEach { free($0) } }
    
    let status = posix_spawn(&pid, path, nil, &attr, argv + [nil], environ)
    guard status == 0 else {
        throw POSIXError(POSIXError.Code(rawValue: status) ?? .ENODEV)
    }
}
```

This makes your CLI tool responsible for its own permissions, not its parent process. The permission dialog will now correctly show "Your CLI wants to control..."


## Testing Your Implementation

Reset permissions to test the flow:
```bash
tccutil reset AppleEvents com.yourcompany.yourcli
```

Check your work:
```bash
# Verify Info.plist embedding
otool -s __TEXT __info_plist yourcli

# Check entitlements
codesign -d --entitlements - yourcli

# Verify signature
codesign -dv yourcli
```

## The Bottom Line

Making AppleScript work in CLI tools requires:
1. An embedded Info.plist for identity
2. Proper entitlements for permissions
3. Correct code signing
4. Optional: `responsibility_spawnattrs_setdisclaim` for cleaner permission dialogs

Building native is hard mode. Every day you learn a new insanity.
May your permission dialogs always show the right app name.