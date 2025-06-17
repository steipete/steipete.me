---
title: "Showing Settings from macOS Menu Bar Items: A 5-Hour Journey Through Hell"
description: "Why something as simple as showing a settings dialog from a macOS menu bar app took me 5 hours to figure out, and requires 50 lines of code for what should be a one-liner."
pubDatetime: 2025-06-16T02:00:00.000+01:00
tags:
  - macOS
  - SwiftUI
  - MenuBarExtra
  - Settings
  - Frustration
  - Sequoia
  - Bug
draft: false
---

You're probably wondering why I'm writing a blog post on how to show the settings dialog from macOS. After all, this is trivial, right? This should be extremely simple.

Let me tell you, after spending probably 5 hours on this and getting extremely frustrated, it is NOT simple. There are actually a lot of gotchas that are badly documented, and it took me a lot of time to figure out what's wrong.

## The SwiftUI Promise vs Reality

First things first, I assume in 2025 most of you will use SwiftUI to show settings. When you use SwiftUI, you can't use the old way of showing settings anymore. SwiftUI has something called `SettingsLink`. The code looks deceptively simple:

```swift
MenuBarExtra("Test", systemImage: "star.fill") {
    SettingsLink { 
        Text("Open settings") 
    }
}
```

That's it! That should work, right? Apple's documentation makes it seem so simple. Just drop in a `SettingsLink` and you're done.

## The Problems Nobody Tells You About

Here's where the 5-hour journey begins:

### Problem 1: SettingsLink Doesn't Work in MenuBarExtra

The first gotcha: `SettingsLink` straight up doesn't work properly in `MenuBarExtra`. Click it, and... nothing happens. Or worse, it works sometimes but not others. The documentation doesn't mention this at all.

### Problem 2: App Activation Hell

Menu bar apps run in a special mode. They don't have a dock icon, they're not "active" in the traditional sense. When you try to show a settings window, it might:
- Appear behind other windows
- Not get keyboard focus
- Show up on the wrong desktop space
- Just... not appear at all

### Problem 3: The Settings Scene Dance

SwiftUI requires you to define a Settings scene in your App struct:

```swift
@main
struct MyApp: App {
    var body: some Scene {
        MenuBarExtra("Test", systemImage: "star.fill") {
            // Your menu content
        }
        
        Settings {
            SettingsView()
        }
    }
}
```

But even with this, `SettingsLink` might still not work reliably.

### Problem 4: The Documentation Lies

Apple's documentation makes it seem like `SettingsLink` is all you need. It's not. There are undocumented behaviors, edge cases, and platform quirks that you'll only discover through painful trial and error.

### Problem 5: Breaking Changes in Sonoma

Just when you think you have a working solution using the old `showSettingsWindow:` selector, Apple breaks it in macOS Sonoma. Now you get an error telling you to use SettingsLink instead. But SettingsLink doesn't work properly in MenuBarExtra! It's a Catch-22.

## All Right, Confusing Enough? It Gets Deeper.

### The macOS Sequoia Bug

Now, in macOS Sequoia, there's yet another bug. We're using this environment `openSettings` trick, but it doesn't work if it's an empty view. The system somehow needs a window, but if we want to invoke settings from a menu item, we do not have a window. 

So the current solution, as horrible as it sounds, is to create a hidden window, and then the settings would show up.

### But Wait, There's More!

I had all these workarounds in place, and settings would show up but it would show up **in the background**. No matter how much I tried to put the window in the foreground, it simply wouldn't work. (Most of the time)

I say "most of the time" because in my application (VibeTunnel), we have a setting option that can toggle the dock icon on/off. In most cases, for a menu bar app, you don't want the dock icon because it is a menu bar application. However, if there is no dock icon, then the system apparently has no way to actually bring the window to the front.

### The Real Solution (50 Lines of Code for a One-Liner)

The real solution is:
1. Before you invoke settings, you show the dock icon
2. You create a hidden window
3. You open the settings
4. Everything has to be a little bit delayed because you have to wait until the dock updates itself and shows the icon
5. Then you show the settings
6. Then you wait some more until AppKit actually creates the settings window
7. Then you put the window to the foreground

Here you go, something that should be a one-liner and is a one-liner in other systems (like Electron) actually requires around 50 lines of code in SwiftUI.

## What Actually Works

After hours of frustration, here's what I discovered actually works reliably:

### Solution 1: The Old Way (Pre-Sonoma)

Before macOS Sonoma, you could manually trigger the settings window like this:

```swift
if #available(macOS 13, *) {
    NSApp.sendAction(Selector(("showSettingsWindow:")), to: nil, from: nil)
} else {
    NSApp.sendAction(Selector(("showPreferencesWindow:")), to: nil, from: nil)
}
```

However, **on macOS Sonoma+, this no longer works!** You'll get an error: "Please use SettingsLink for opening the Settings scene." 

Apple broke backward compatibility here, forcing you to use their SwiftUI-based approach. Which would be fine, except SettingsLink doesn't work properly in MenuBarExtra!

### Solution 2: The openSettings Environment Action

Now, `SettingsLink` is used for any action where the user presses on a button. But what about the case where you have some other action where you cannot invoke a SwiftUI button with an action and you still want to show the settings dialog? 

For that, Apple introduced yet another API: the [`openSettings` environment action](https://developer.apple.com/documentation/swiftui/opensettingsaction):

```swift
struct MyView: View {
    @Environment(\.openSettings) private var openSettings

    var body: some View {
        Button("Open Settings") {
            NSApp.activate(ignoringOtherApps: true)  // STILL NEED THIS!
            openSettings()
        }
    }
}
```

This is particularly useful when you need to open settings programmatically - for example, from a keyboard shortcut handler, after an error occurs, or from deep within your app logic where you don't have a button.

But again, you MUST activate the app first. This is the critical piece that's missing from all the documentation.

### Solution 3: The Nuclear Option - Hidden Window + Dock Icon

Here's a minimal version of the workaround that actually works on macOS Sequoia:

```swift
struct HiddenWindowView: View {
    @Environment(\.openSettings) private var openSettings
    
    var body: some View {
        Color.clear
            .frame(width: 1, height: 1)
            .onReceive(NotificationCenter.default.publisher(for: .openSettingsRequest)) { _ in
                Task { @MainActor in
                    // Show dock icon temporarily (required for window focus)
                    NSApp.setActivationPolicy(.regular)
                    
                    // Wait for dock to update
                    try? await Task.sleep(for: .milliseconds(100))
                    
                    // Activate and open settings
                    NSApp.activate(ignoringOtherApps: true)
                    openSettings()
                    
                    // Force window to front after delay
                    try? await Task.sleep(for: .milliseconds(150))
                    if let window = NSApp.windows.first(where: { 
                        $0.identifier?.rawValue.contains("Settings") ?? false 
                    }) {
                        window.makeKeyAndOrderFront(nil)
                    }
                    
                    // Hide dock icon again
                    Task {
                        try? await Task.sleep(for: .seconds(1))
                        NSApp.setActivationPolicy(.accessory)
                    }
                }
            }
    }
}
```

For the full battle-tested implementation with all edge cases handled, check out [VibeTunnel's SettingsOpener.swift](https://github.com/amantus-ai/vibetunnel/blob/main/VibeTunnel/Utilities/SettingsOpener.swift). Everything's open source!

And you need to add this hidden window to your app:

```swift
@main
struct MenuBarApp: App {
    var body: some Scene {
        MenuBarExtra("My App", systemImage: "star.fill") {
            MenuView()
        }
        
        Settings {
            SettingsView()
        }
        
        // The magic hidden window
        Window("Hidden", id: "HiddenWindow") {
            HiddenWindowView()
        }
        .windowResizability(.contentSize)
        .defaultPosition(.topLeading)
    }
}
```

## The Key Lesson

The critical insight that took me 5 hours to figure out: **You MUST call `NSApp.activate(ignoringOtherApps: true)` before trying to show any window from a menu bar app.**

This single line of code is the difference between a settings window that:
- Actually appears
- Gets keyboard focus
- Shows up on the right desktop space
- Behaves like users expect

And one that drives you to write angry blog posts at 2 AM.

## Why Is This So Hard?

The root cause is that menu bar apps exist in a weird liminal space in macOS:

1. They're not "real" apps in the traditional sense
2. They don't have dock icons
3. They're not part of the normal app switching flow
4. The system doesn't automatically activate them when you interact with their UI

SwiftUI's `SettingsLink` was designed for normal apps, not menu bar apps. It assumes your app is already active, which is almost never true for menu bar apps.

## Best Practices

After this journey, here's what I recommend:

1. **Always use `NSApp.activate(ignoringOtherApps: true)`** - Make it muscle memory
2. **Test on multiple desktop spaces** - Menu bar apps behave differently across spaces
3. **Don't trust SettingsLink** - It's not reliable for menu bar apps
4. **Use the openSettings environment action** - It's more reliable than SettingsLink
5. **Have a fallback** - Sometimes you need to get creative with window management

## The Complete Solution

After countless hours of debugging across multiple macOS versions, here's the battle-tested code that actually works:

```swift
@main
struct MenuBarApp: App {
    var body: some Scene {
        MenuBarExtra("My App", systemImage: "star.fill") {
            MenuView()
        }
        
        Settings {
            SettingsView()
        }
        
        // Required for macOS Sequoia
        Window("Hidden", id: "HiddenWindow") {
            HiddenWindowView()
        }
        .windowResizability(.contentSize)
        .defaultPosition(.topLeading)
    }
}

struct MenuView: View {
    var body: some View {
        Button("Settings...") {
            // Post notification to hidden window
            NotificationCenter.default.post(name: .openSettingsRequest, object: nil)
        }
        .keyboardShortcut(",", modifiers: .command)
        
        Divider()
        
        Button("Quit") {
            NSApp.terminate(nil)
        }
        .keyboardShortcut("q", modifiers: .command)
    }
}

extension Notification.Name {
    static let openSettingsRequest = Notification.Name("openSettingsRequest")
}
```

This ridiculous workaround handles:
- The need for a window to exist (hidden window)
- The need for app activation
- The need for a dock icon to bring windows to front
- The timing issues with AppKit
- The various macOS version quirks

## Conclusion

What should have been a 5-minute task turned into a 5-hour debugging session. The documentation doesn't mention any of these issues. Stack Overflow is full of half-solutions that don't quite work. 

But now you know the secret: `NSApp.activate(ignoringOtherApps: true)`. Use it. Love it. Never forget it.

And if you're on macOS Sequoia and need the full nuclear option, check out the complete implementation in [VibeTunnel](https://github.com/amantus-ai/vibetunnel/blob/main/VibeTunnel/Utilities/SettingsOpener.swift).

Apple, if you're reading this: Please update your documentation. A single note about menu bar apps needing manual activation would save countless developer hours. Also, maybe make `SettingsLink` actually work in `MenuBarExtra`? Just a thought.

Good luck with your settings window!