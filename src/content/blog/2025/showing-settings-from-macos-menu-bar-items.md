---
title: "Showing Settings from macOS Menu Bar Items: A 5-Hour Journey"
description: "Why something as simple as showing a settings dialog from a macOS menu bar app took me 5 hours to figure out, and requires 50 lines of code for what should be a one-liner."
pubDatetime: 2025-06-17T02:00:00.000+01:00
heroImage: /assets/img/2025/showing-settings-from-macos-menu-bar-items/hero.png
heroImageAlt: "macOS Settings window appearing from a menu bar app"
tags:
  - macOS
  - SwiftUI
  - MenuBarExtra
  - Settings
draft: false
---

Opening a settings window from a macOS menu bar app should be trivial. It's not. After spending 5 hours debugging this seemingly simple task, I'm documenting the gotchas to save you the same frustration.

## The Problem

SwiftUI provides [`SettingsLink`](https://developer.apple.com/documentation/swiftui/settingslink) for opening settings:

```swift
MenuBarExtra("Test", systemImage: "star.fill") {
    SettingsLink { 
        Text("Open settings") 
    }
}
```

Simple, right? Except it doesn't work reliably in [`MenuBarExtra`](https://developer.apple.com/documentation/swiftui/menubarextra). The documentation doesn't mention this limitation.

According to Apple's documentation, `SettingsLink` should "open the app's settings scene when activated." However, this assumes your app is already active and has proper window management context - assumptions that don't hold for menu bar apps.

## Why It Fails

Menu bar apps operate differently from regular macOS apps:
- **No dock icon by default** - They use [`NSApplication.ActivationPolicy.accessory`](https://developer.apple.com/documentation/appkit/nsapplication/activationpolicy/accessory)
- **Not "active" in the traditional sense** - They don't appear in the app switcher
- **Windows may appear behind other apps** - Without proper activation, windows lack focus
- **No keyboard focus without activation** - The system doesn't automatically activate menu bar apps when you interact with their UI

The root issue is that [`NSApplication`](https://developer.apple.com/documentation/appkit/nsapplication) treats menu bar apps as background utilities, not foreground applications. This affects how windows are ordered and receive events.

## The Evolution of Workarounds

### Pre-Sonoma (The Old Way)

```swift
if #available(macOS 13, *) {
    NSApp.sendAction(Selector(("showSettingsWindow:")), to: nil, from: nil)
} else {
    NSApp.sendAction(Selector(("showPreferencesWindow:")), to: nil, from: nil)
}
```

This stopped working in Sonoma with the error: "Please use SettingsLink for opening the Settings scene." Apple deprecated these selectors in favor of SwiftUI's scene-based approach, but didn't account for the unique challenges of menu bar apps.

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

The key insight: **You MUST call [`NSApp.activate(ignoringOtherApps: true)`](https://developer.apple.com/documentation/appkit/nsapplication/1428468-activate) first.**

This method "activates the receiver app, brings its windows to the front, and makes it the key app." The `ignoringOtherApps` parameter ensures activation happens even if another app is currently active - crucial for menu bar apps that need to steal focus.

### The Sequoia Complication

In macOS Sequoia, even this isn't enough. The system requires a window context, leading to this workaround:

1. **Create a hidden window** - Provides the necessary window context for `openSettings` to function
2. **Temporarily show the dock icon** - Switch from `.accessory` to `.regular` activation policy
3. **Activate the app** - Make it the frontmost application
4. **Open settings** - Now with proper context and activation
5. **Handle timing delays** - AppKit needs time to process each state change

This is necessary because the [`openSettings` action](https://developer.apple.com/documentation/swiftui/opensettingsaction) expects to be called from within a window context. Without a window, it silently fails.

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
            .keyboardShortcut(",", modifiers: .command)
        }
        
        // Required Settings scene
        Settings {
            SettingsView()
        }
        
        // Hidden window for context
        Window("Hidden", id: "HiddenWindow") {
            HiddenWindowView()
        }
        .windowResizability(.contentSize)
        .defaultSize(width: 1, height: 1)
    }
}

extension Notification.Name {
    static let openSettingsRequest = Notification.Name("openSettingsRequest")
}
```

The [`NotificationCenter`](https://developer.apple.com/documentation/foundation/notificationcenter) approach decouples the menu action from the window context, allowing the hidden window to handle the actual settings opening.

For a production-ready implementation with all edge cases handled, see [VibeTunnel's SettingsOpener.swift](https://github.com/amantus-ai/vibetunnel/blob/main/VibeTunnel/Utilities/SettingsOpener.swift).

## Understanding the Workaround

The hidden window serves multiple purposes:
- Provides a valid window context for the `openSettings` environment action
- Allows us to temporarily switch activation policies without visual disruption
- Gives us a place to handle the complex timing orchestration

The dock icon manipulation (switching between [`.accessory`](https://developer.apple.com/documentation/appkit/nsapplication/activationpolicy/accessory) and [`.regular`](https://developer.apple.com/documentation/appkit/nsapplication/activationpolicy/regular)) is necessary because macOS only brings windows to the front reliably for apps with dock icons.

## Key Takeaways

1. **Always activate your app first** with `NSApp.activate(ignoringOtherApps: true)`
2. **Don't trust SettingsLink** in menu bar apps
3. **Test across macOS versions** - behavior changes between releases
4. **Consider the dock icon state** - it affects window focus behavior

What should be a one-liner in other frameworks requires careful orchestration in SwiftUI. The combination of [`MenuBarExtra`](https://developer.apple.com/documentation/swiftui/menubarextra), [`Settings`](https://developer.apple.com/documentation/swiftui/settings) scenes, and [`openSettings`](https://developer.apple.com/documentation/swiftui/opensettingsaction) wasn't designed with the unique constraints of menu bar apps in mind.

If you're experiencing similar issues, I've filed feedback with Apple (FB10184971). Consider filing your own to help prioritize a fix. Until then, this workaround will get your settings window to appear reliably.