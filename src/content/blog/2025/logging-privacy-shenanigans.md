---
title: "Logging Privacy Shenanigans"
pubDatetime: 2025-07-29T09:00:00.000+02:00
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

> **TL;DR** – Apple logs hide the juicy debugging bits as `<private>`. Drop plist files into `/Library/Preferences/Logging/Subsystems/` for a simpler solution, or install a configuration profile as an alternative.

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

## The Plist Solution (Preferred Method)

Thanks to [Rasmus Sten](https://micro.blog/pajp/70072065) for pointing out this elegant solution! You don't need to use `.mobileconfig` files – you can simply drop plist files directly into `/Library/Preferences/Logging/Subsystems/`. This is actually what happens when you install a configuration profile anyway.

### Step 1: Create a Plist File

Create a file named after your subsystem (e.g., `com.mycompany.myapp.plist`) with this content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>DEFAULT-OPTIONS</key>
    <dict>
        <key>Enable-Private-Data</key>
        <true/>
    </dict>
</dict>
</plist>
```

### Step 2: Install the Plist

```bash
# Create the directory if it doesn't exist
sudo mkdir -p /Library/Preferences/Logging/Subsystems/

# Copy your plist file
sudo cp com.mycompany.myapp.plist /Library/Preferences/Logging/Subsystems/

# Set proper permissions
sudo chmod 644 /Library/Preferences/Logging/Subsystems/com.mycompany.myapp.plist
```

> **Important Gotcha**: When writing these plist files programmatically, you **must write them atomically**. Write to a temporary file first, then use `mv` to move it into place. This ensures the logging subsystem sees a complete, valid plist file.

### Step 3: Generate Fresh Logs

The configuration only affects **new** log entries. Run your app to generate fresh logs.

### Step 4: Remove After Debugging

```bash
sudo rm /Library/Preferences/Logging/Subsystems/com.mycompany.myapp.plist
```

### Why This Method is Better

- **Scriptable**: Can be added/removed programmatically from shell scripts
- **No UI interaction**: No need to navigate System Settings
- **Granular control**: Enable/disable specific subsystems instantly
- **CI/CD friendly**: Perfect for automated testing environments

### Documentation

This approach is documented in:
- Apple's [`os_log(5)` man page](https://www.manpagez.com/man/5/os_log/) (run `man 5 os_log` in Terminal)
- [Apple Developer Forums](https://developer.apple.com/forums/thread/114166) confirming the `/Library/Preferences/Logging/Subsystems/` directory usage
- [Der Flounder's detailed analysis](https://derflounder.wordpress.com/2025/05/05/accessing-subsystem-logging-configurations-used-by-the-macos-unified-logging-on-macos-sequoia/) of macOS Sequoia's logging configuration

## The Configuration Profile Solution (Alternative Method)

If you prefer a GUI approach or need to deploy settings across multiple machines, you can still use configuration profiles:

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
            <string>com.yourapp.logging.EnablePrivateData</string>
            <key>PayloadType</key>
            <string>com.apple.system.logging</string>
            <key>PayloadUUID</key>
            <string>GENERATE-UUID-1</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>System</key>
            <dict>
                <key>Enable-Private-Data</key>
                <true/>
            </dict>
            <key>Subsystems</key>
            <dict>
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
    <string>This profile enables logging of private data for debugging.</string>
    <key>PayloadDisplayName</key>
    <string>Your App Private Data Logging</string>
    <key>PayloadIdentifier</key>
    <string>com.yourapp.PrivateDataLogging</string>
    <key>PayloadOrganization</key>
    <string>Your Organization</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>GENERATE-UUID-2</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>
```

</details>

<br>

<details>
<summary><strong>Customizing the Profile</strong></summary>

**Critical Components to Replace:**

1. **UUIDs**: Two unique identifiers are required:
   - Replace `GENERATE-UUID-1` and `GENERATE-UUID-2` with actual UUIDs
   - Generate with: `uuidgen` (run twice for two different UUIDs)

2. **Organization**: Replace `Your Organization` with your actual organization or app name

3. **Subsystems**: The most critical part! Replace `your.app.subsystem` with your actual logging subsystem(s):
   ```swift
   let logger = Logger(subsystem: "com.mycompany.myapp", category: "Network")
   ```
   In this example, `"com.mycompany.myapp"` is the subsystem you need to add.

4. **Multiple Subsystems**: To enable private data for multiple subsystems, duplicate the subsystem structure:
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

**Key Implementation Details:**

- **PayloadType values**: The top-level PayloadType must be `Configuration`, while the inner PayloadType (in PayloadContent) must be `com.apple.system.logging`
- **PayloadRemovalDisallowed**: Keep this as `false` so you can easily remove the profile after debugging
- **System section**: Enables private data for system-level logs
- **DEFAULT-OPTIONS**: Required wrapper for subsystem options

Save the customized file as `EnablePrivateLogging.mobileconfig`.

</details>

### Installing Configuration Profiles

1. Double-click the `.mobileconfig` file
2. Navigate to:
   - **macOS 15 (Sequoia) and later**: System Settings → General → Device Management
   - **macOS 14 (Sonoma) and earlier**: System Settings → Privacy & Security → Profiles
3. Click "Install..." and authenticate
4. Wait 1-2 minutes for the system to apply changes

### Removing Configuration Profiles

Go back to the Profiles/Device Management section and click the minus (-) button.

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

Instead of manually editing configuration files, just give Claude Code this blog post URL and ask it to create a customized plist or profile for your app. [Living in the future](/posts/2025/claude-code-is-my-computer/) means your documentation can be both human-readable and agent-executable.

## Summary

Apple's log privacy is well-intentioned but can be frustrating during development. The plist approach is your best bet for debugging:

1. Privacy redaction happens at write time
2. sudo can't recover what was never stored
3. Direct plist files are simpler than configuration profiles
4. Always remove debugging configurations when done

For more details on this topic, check out:
- [Apple's os_log(5) man page](https://www.manpagez.com/man/5/os_log/) – The authoritative source
- [Howard Oakley's excellent post](https://eclecticlight.co/2023/03/08/removing-privacy-censorship-from-the-log/) – Deep dive into log privacy
- [Der Flounder's Sequoia analysis](https://derflounder.wordpress.com/2025/05/05/accessing-subsystem-logging-configurations-used-by-the-macos-unified-logging-on-macos-sequoia/) – Latest macOS changes

Happy debugging, and may your logs be forever unredacted (but only when you need them to be)!