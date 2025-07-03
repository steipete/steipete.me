---
title: "Making AppleScript Work in macOS CLI Tools: The Undocumented Parts"
pubDatetime: 2025-07-03T14:00:00.000+01:00
description: "The complete guide to making AppleScript work in command-line tools - from Info.plist embedding to handling TCC permissions and the mysterious responsibility_spawnattrs_setdisclaim API."
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

![Making AppleScript Work in macOS CLI Tools](/assets/img/2025/applescript-cli-macos-complete-guide/header.png)

*Or: How I Learned to Stop Fighting TCC and Embrace the Info.plist*

This all started with Cursor being annoying. You know how it goes - you're in the zone, AI is cranking out code, and then bam! The inline terminal opens something blocking (file watcher, dev server, whatever) and the whole loop grinds to a halt. I'd have to manually click around to get things moving again. Productivity killer.

My solution? Build an MCP (Model Context Protocol) server that could control an external terminal. That way, even when commands block, Cursor's loop keeps running. I called it [Terminator](https://github.com/steipete/Terminator) - because who doesn't love a good terminal/Terminator pun?

## The Evolution of a Hack

My first attempt was [pure AppleScript](https://github.com/steipete/Terminator/blob/main/scripts/terminator.scpt) - simple, direct terminal automation. It worked! Well, sort of. The script needed window focus to function, which meant it would constantly steal focus while Cursor was running. Try coding on multiple screens while your terminal keeps jumping to the foreground. Not fun.

The focus-stealing got so bad that at one point, the AI started writing its own AppleScript to detect which app was in the foreground. When it discovered Chrome was blocking its terminal access, it simply... killed all my Chrome windows. That was [the first time I apologized to an AI agent](https://steipete.me/posts/2025/when-ai-meets-madness-peters-16-hour-days#the-gemini-chrome-massacre). Clearly, I needed a better solution.

"No problem," I thought, "I'll be clever and convert this to an MCP server." That's when I fell down the rabbit hole. Getting AppleScript to work in a CLI tool turned out to be a maze of undocumented APIs, security permissions, and macOS quirks that nobody warns you about.

Sure, I could have used Apple's [`osascript`](https://developer.apple.com/documentation/uniformtypeidentifiers/uttype-swift.struct/osascript) command and called it a day. But where's the fun in that? Plus, native AppleScript gives you much finer control - if you can get it working.

After way too many hours debugging why my CLI tool couldn't send Apple Events, I finally cracked the code. Here's everything I learned, so you don't have to suffer like I did.

## The Problem: Terminal Gets All the Blame

Here's what happens when you naively use `NSAppleScript` in a CLI tool:

```swift
let script = NSAppleScript(source: "tell application \"Finder\" to activate")
script?.executeAndReturnError(nil)  // Spoiler: This won't work as expected
```

You'll either get:
1. Silent failure (no error, no result, no nothing)
2. A permission dialog that says "Terminal wants to control Finder" (not your app!)
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
    
    <!-- Often needed for dynamic code loading -->
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    
    <!-- For scripting additions -->
    <key>com.apple.security.scripting-targets</key>
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

## The Advanced Stuff: Escaping Terminal's Shadow

Remember how permission dialogs blame Terminal instead of your app? There's an undocumented API to fix that: `responsibility_spawnattrs_setdisclaim`. I discovered this gem from [Qt's excellent blog post about the responsible process problem](https://www.qt.io/blog/the-curious-case-of-the-responsible-process).

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

This makes your CLI tool responsible for its own permissions, not its parent process. The permission dialog will now correctly show "YourCLI wants to control..."

## Real-World Example: A Notification CLI

Here's a complete example that ties everything together:

```swift
// main.swift
import Foundation
import AppKit

func showNotification(_ message: String, title: String) throws {
    let script = """
    display notification "\(message)" with title "\(title)"
    """
    
    let appleScript = NSAppleScript(source: script)
    var error: NSDictionary?
    
    guard appleScript?.executeAndReturnError(&error) != nil else {
        if let error = error {
            throw NSError(
                domain: "AppleScriptError",
                code: error["NSAppleScriptErrorNumber"] as? Int ?? -1,
                userInfo: error as? [String: Any]
            )
        }
        throw NSError(domain: "AppleScriptError", code: -1, userInfo: nil)
    }
}

// Usage
do {
    try showNotification("Hello from CLI!", title: "NotifyCLI")
    print("✅ Notification sent!")
} catch {
    print("❌ Failed: \(error)")
    exit(1)
}
```

Build it with the embedded Info.plist, sign it with entitlements, and voilà - a CLI tool that properly identifies itself to macOS.

## Common Gotchas and Solutions

### Error -1750 (errOSASystemError)
Usually means missing entitlements. Double-check your `com.apple.security.automation.apple-events`.

### "Terminal wants to control..."
Your Info.plist isn't embedded correctly. Verify with `otool`.

### Permission granted but still fails
Some Apple apps need additional entitlements like `com.apple.security.temporary-exception.apple-events`.

### Works in development, fails in production
Check your code signing. Developer ID certificates have different requirements than ad-hoc signing.

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
3. Correct code signing (without `--deep`!)
4. Optional: `responsibility_spawnattrs_setdisclaim` for cleaner permission dialogs

It's a lot of hoops to jump through, but the result is a professional CLI tool that integrates seamlessly with macOS security. Your users get clear permission dialogs with your app's name, and you get AppleScript that actually works.

Just remember: that `responsibility_spawnattrs_setdisclaim` API is undocumented and could vanish in any macOS update. But until Apple gives us a proper API, it's the best we've got.

Happy scripting! And may your permission dialogs always show the right app name.