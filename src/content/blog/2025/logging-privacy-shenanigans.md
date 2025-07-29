---
title: "Logging Privacy Shenanigans"
pubDatetime: 2025-07-29T16:00:00.000+02:00
description: "Apple's logs redact your debugging data as <private>. Here's what actually gets hidden, why old tricks don't work anymore, and the only reliable way to see your logs again."
heroImage: /assets/img/2025/logging-privacy-shenanigans/header.png
tags:
  - macOS
  - Logging
  - Privacy
  - Debugging
  - Swift
  - Developer Tools
---

> **TL;DR** – Apple logs hide the juicy debugging bits as `<private>`. Install a configuration profile to reveal logs during debugging, or use `.public` in code for specific values.

If you've ever tried debugging a macOS app using the unified logging system, you've probably encountered the dreaded `<private>` redaction. Your carefully crafted log messages turn into cryptic puzzles where the most important debugging information is hidden. Let me show you what's really going on and how to work around it.

## The Privacy Problem

When you log something like this in Swift:

```swift
logger.info("User \(username) connected to session \(sessionId)")
```

You expect to see:
```
User john.doe connected to session ABC-123-DEF
```

But instead you get:
```
User <private> connected to session <private>
```

Not very helpful when you're trying to debug an issue, right?

## What Actually Gets Redacted

Here's where it gets interesting. Through testing, I discovered that Apple's redaction logic is **not** as straightforward as the documentation suggests:

| What you log | Documentation says | Reality |
|--------------|-------------------|---------|
| Simple strings (`"user@example.com"`) | Redacted | **Usually redacted!** |
| File paths (`/Users/username`) | Redacted | ✓ Redacted |
| UUIDs (`ABC-123-DEF`) | Redacted | ✓ Redacted |
| Integers, booleans, floats | Public | ✓ Public |

The discrepancy comes from how Apple's logging system is implemented. The os_log function requires format strings to be compile-time constants (C string literals) for performance optimization. When you use string interpolation with dynamic values, the compiler and logging library work together to mark these as runtime data that needs privacy protection.

Static strings embedded directly in your code are treated as part of the format string and assumed to be non-sensitive, while any runtime values (variables, computed properties, function returns) are automatically redacted to prevent accidental leakage of personal information.

## Old Solutions That No Longer Work

Before we get to what works, let's quickly cover what **doesn't** work anymore:

### ❌ The `private_data:on` flag (Dead since Catalina)

```bash
# This returns "Invalid Modes 'private_data:on'" on macOS 10.15+
sudo log config --mode "private_data:on" --subsystem your.app.subsystem
```

This was completely removed in macOS Catalina (10.15) and later.

### ❌ sudo doesn't reveal private data

You might think running with sudo would show everything:

```bash
sudo log show --predicate 'subsystem == "your.app"' --info
```

Nope! The privacy redaction happens at **write time**, not read time. Once logged as `<private>`, the actual data is gone forever.

## The Configuration Profile Solution

The only reliable way to see private data is to tell macOS to capture it in the first place using a configuration profile. Here's how:

### Step 1: Create the Profile

To create a working profile, you need to customize it for your specific logging subsystems.

<details>
<summary><strong>View Configuration Profile Template</strong></summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadDisplayName</key>
            <string>ManagedClient logging</string>
            <key>PayloadEnabled</key>
            <true/>
            <key>PayloadIdentifier</key>
            <string>com.example.logging.EnablePrivateData</string>
            <key>PayloadType</key>
            <string>com.apple.system.logging</string>
            <key>PayloadUUID</key>
            <string>YOUR-UUID-HERE</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>System</key>
            <dict>
                <key>Enable-Private-Data</key>
                <true/>
            </dict>
            <key>Subsystems</key>
            <dict>
                <!-- ADD YOUR SUBSYSTEMS HERE -->
                <key>your.app.subsystem</key>
                <dict>
                    <key>DEFAULT-OPTIONS</key>
                    <dict>
                        <key>Enable-Private-Data</key>
                        <true/>
                    </dict>
                </dict>
            </dict>
        </dict>
    </array>
    <key>PayloadDescription</key>
    <string>Enable private data logging for debugging</string>
    <key>PayloadDisplayName</key>
    <string>Private Data Logging</string>
    <key>PayloadIdentifier</key>
    <string>com.example.PrivateDataLogging</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>ANOTHER-UUID-HERE</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>
```

</details>

<br>

<details>
<summary><strong>Customizing the Profile</strong></summary>

**Important**: You must replace the placeholder values:

1. **UUIDs**: Replace `YOUR-UUID-HERE` and `ANOTHER-UUID-HERE` with actual UUIDs. You can generate them with `uuidgen` command.

2. **Subsystems**: This is the critical part! The `Subsystems` dictionary needs one entry for each logging subsystem you want to unmask. The subsystem is what you specify when creating a Swift Logger:
   ```swift
   let logger = Logger(subsystem: "com.mycompany.myapp", category: "Network")
   ```
   In this example, `"com.mycompany.myapp"` is the subsystem.

3. **Multiple Subsystems**: To enable private data for multiple subsystems, add more entries:
   ```xml
   <key>Subsystems</key>
   <dict>
       <key>com.mycompany.myapp</key>
       <dict>
           <key>DEFAULT-OPTIONS</key>
           <dict>
               <key>Enable-Private-Data</key>
               <true/>
           </dict>
       </dict>
       <key>com.mycompany.myframework</key>
       <dict>
           <key>DEFAULT-OPTIONS</key>
           <dict>
               <key>Enable-Private-Data</key>
               <true/>
           </dict>
       </dict>
   </dict>
   ```

Save the customized file as `EnablePrivateLogging.mobileconfig`.

</details>

### Step 2: Install the Profile

1. Double-click the `.mobileconfig` file
2. Navigate to:
   - **macOS 15 (Sequoia) and later**: System Settings → General → Device Management
   - **macOS 14 (Sonoma) and earlier**: System Settings → Privacy & Security → Profiles
3. Click "Install..." and authenticate
4. Wait 1-2 minutes for the system to apply changes

### Step 3: Generate Fresh Logs

The profile only affects **new** log entries. Existing `<private>` entries remain redacted forever.

### Step 4: Remove After Debugging

This profile is intended for developer machines during debugging sessions. Remember to remove it when you're done debugging by going back to the Profiles/Device Management section and clicking the minus (-) button.

## The Code-Level Solution

For production apps, mark specific non-sensitive values as public:

```swift
// This will always be visible
logger.info("Session: \(sessionId, privacy: .public)")

// This remains private by default
logger.info("Token: \(apiToken)")
```

This is the safest approach as you explicitly control what's exposed.

## Automating with Claude Code

Instead of manually editing the profile XML, just give Claude Code this blog post URL and ask it to create a customized profile for your app. [Living in the future](/posts/2025/claude-code-is-my-computer/) means your documentation can be both human-readable and agent-executable.

## Summary

Apple's log privacy is well-intentioned but can be frustrating during development. The configuration profile approach is your best bet for debugging, but remember:

1. Privacy redaction happens at write time
2. sudo can't recover what was never stored
3. Simple strings might not be redacted (but don't rely on this)
4. Always remove debugging profiles when done

For more details on this topic, check out Howard Oakley's excellent post: [Removing privacy censorship from the log](https://eclecticlight.co/2023/03/08/removing-privacy-censorship-from-the-log/).

Happy debugging, and may your logs be forever unredacted (but only when you need them to be)!