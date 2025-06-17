---
title: "Showing Settings from macOS Menu Bar Items: A 5-Hour Journey"
description: "Why something as simple as showing a settings dialog from a macOS menu bar app took me 5 hours to figure out, and requires 50 lines of code for what should be a one-liner."
pubDatetime: 2025-06-17T02:00:00.000+01:00
tags:
  - macOS
  - SwiftUI
  - MenuBarExtra
  - Settings
draft: false
---

Opening a settings window from a macOS menu bar app should be trivial. It's not. After spending 5 hours debugging this seemingly simple task, I'm documenting the gotchas to save you the same frustration.

## The Problem

SwiftUI provides `SettingsLink` for opening settings:

```swift
MenuBarExtra("Test", systemImage: "star.fill") {
    SettingsLink { 
        Text("Open settings") 
    }
}
```

Simple, right? Except it doesn't work reliably in `MenuBarExtra`. The documentation doesn't mention this limitation.

## Why It Fails

Menu bar apps operate differently from regular macOS apps:
- No dock icon by default
- Not "active" in the traditional sense
- Windows may appear behind other apps
- No keyboard focus without activation

## The Evolution of Workarounds

### Pre-Sonoma (The Old Way)

```swift
if #available(macOS 13, *) {
    NSApp.sendAction(Selector(("showSettingsWindow:")), to: nil, from: nil)
} else {
    NSApp.sendAction(Selector(("showPreferencesWindow:")), to: nil, from: nil)
}
```

This stopped working in Sonoma with the error: "Please use SettingsLink for opening the Settings scene."

### The openSettings Environment Action

Apple provides an [`openSettings` environment action](https://developer.apple.com/documentation/swiftui/opensettingsaction) for programmatic access:

```swift
struct MyView: View {
    @Environment(\.openSettings) private var openSettings

    var body: some View {
        Button("Open Settings") {
            NSApp.activate(ignoringOtherApps: true)  // Critical!
            openSettings()
        }
    }
}
```

The key insight: **You MUST call `NSApp.activate(ignoringOtherApps: true)` first.**

### The Sequoia Complication

In macOS Sequoia, even this isn't enough. The system requires a window context, leading to this workaround:

1. Create a hidden window
2. Temporarily show the dock icon
3. Activate the app
4. Open settings
5. Handle timing delays for each step

## The Working Solution

Here's the minimal implementation that works across macOS versions:

```swift
// Hidden window to provide context
struct HiddenWindowView: View {
    @Environment(\.openSettings) private var openSettings
    
    var body: some View {
        Color.clear
            .frame(width: 1, height: 1)
            .onReceive(NotificationCenter.default.publisher(for: .openSettingsRequest)) { _ in
                Task { @MainActor in
                    // Show dock icon for window focus
                    NSApp.setActivationPolicy(.regular)
                    try? await Task.sleep(for: .milliseconds(100))
                    
                    // Activate and open
                    NSApp.activate(ignoringOtherApps: true)
                    openSettings()
                    
                    // Restore menu bar app state
                    Task {
                        try? await Task.sleep(for: .seconds(1))
                        NSApp.setActivationPolicy(.accessory)
                    }
                }
            }
    }
}

// App structure
@main
struct MenuBarApp: App {
    var body: some Scene {
        MenuBarExtra("My App", systemImage: "star.fill") {
            Button("Settings...") {
                NotificationCenter.default.post(name: .openSettingsRequest, object: nil)
            }
        }
        
        Settings {
            SettingsView()
        }
        
        Window("Hidden", id: "HiddenWindow") {
            HiddenWindowView()
        }
        .windowResizability(.contentSize)
    }
}
```

For a production-ready implementation with all edge cases handled, see [VibeTunnel's SettingsOpener.swift](https://github.com/amantus-ai/vibetunnel/blob/main/VibeTunnel/Utilities/SettingsOpener.swift).

## Key Takeaways

1. **Always activate your app first** with `NSApp.activate(ignoringOtherApps: true)`
2. **Don't trust SettingsLink** in menu bar apps
3. **Test across macOS versions** - behavior changes between releases
4. **Consider the dock icon state** - it affects window focus behavior

What should be a one-liner in other frameworks requires careful orchestration in SwiftUI. Hopefully, Apple will address these issues in future updates. Until then, this workaround will get your settings window to appear reliably.