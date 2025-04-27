---
layout: post
title: "Top-Level Menu Visibility in SwiftUI for macOS"
date: 2021-04-09 18:00:00 +0200
tags: iOS SwiftUI development
image: /assets/img/2021/top-level-menu-visibility-swiftui/flow-statement.png
description: "SwiftUI's new app lifecycles makes it extremely simple to create menus on-demand. Modifying a top-level menu however is surprisingly hard.."
---

<style type="text/css">
div.post-content > img:first-child { display:none; }
</style>

Pretty much all Mac apps have a semi-hidden Debug menu that can be triggered via a user defaults entry or via settings. Naturally I wanted to add the same in my latest project. I'm building a new "universal" app (meaning iOS *and* macOS), supporting only the latest OSes, so I can using the new SwiftUI app lifecycle.

SwiftUI is really a lot of fun to work with. Sure, [there are bugs, warts](/posts/state-of-swiftui/) and parts that simply aren't finished yet, especially on the Mac, but overall what Apple built here is really great, and it's so much faster to build apps with it. SwiftUI makes the hard things simple, and sometimes it makes the simple things hard. 

## Menus in SwiftUI App Lifecycle

Let's look at a typical menu definition in the new Big Sur/iOS 14 SwiftUI App Lifecycle. The syntax is straightforward and fits right into the concepts of SwiftUI. Bingings work as well and menus change on-demand as state changes.

```swift
@main
struct SampleApp: App {
    var body: some Scene {
        WindowGroup {
            MainAppView()
        }
        .commands {
            CommandGroup(replacing: CommandGroupPlacement.newItem) {
                Button("Import Archive") {
                    activeSheet = .importer
                }
                .keyboardShortcut(KeyEquivalent("i"), modifiers: .command)
            }
    }
}
```

There's a superb guide over at [TrozWare about SwifUI Mac Menus](https://troz.net/post/2021/swiftui_mac_menus/) that explains everything in detail - including a way how to move the menu logic into a separate file. Highly recommended. Let's move on to the interesting bits.

## Showing Menus Conditionally

Within `CommandMenu` it's easy to use `if`/`else` to conditionally show menu entries. SwiftUI uses `@ViewBuilder` as resultbuilder and conditionals are correctly implemented.

```swift
CommandMenu("Animals") {
    if user.likesCats {
        Button("Show Cat Picture") { }        
    } else {
        Button("Show Dog Picture") { }        
    }
```

However if we try the same at the top level, we get an error: `"Closure containing control flow statement cannot be used with result builder 'CommandsBuilder'"`gs. The SwiftUI-team didn't implement any branching logic into the `@CommandsBuilder`.

![Closure containing control flow statement cannot be used with result builder 'CommandsBuilder'](/assets/img/2021/top-level-menu-visibility-swiftui/flow-statement.png)

After [a discussion on Twitter](https://twitter.com/steipete/status/1380518850073092096?s=21), there really doesn't seem a SwiftUI-way to trigger the visibility of top-level menus. @LeoNatan suggested to [drop back into AppKit](https://twitter.com/leonatan/status/1380545179157925888?s=21), and that's what I ended up doing:

```swift
static func triggerDebugMenuVisibilityHack() {
    if let mainMenu = NSApp.mainMenu {
        DispatchQueue.main.async {
            if !Features.shared.isDebugModeEnabled,
               let debugMenu = mainMenu.items.first(where: { $0.title == "Debug" }) {
                mainMenu.removeItem(debugMenu)
            }
        }
    }
}
```

Make sure to trigger this both on app start and whenever the debug value changes:

```swift
.onAppear {
    DebugMenuCommands.triggerDebugMenuVisibilityHack()
}
.onChange(of: features.isDebugModeEnabled) { _ in
    DebugMenuCommands.triggerDebugMenuVisibilityHack()
}
```

And that's it. Toggling the menu works just as expected. In our update method we have to skip a runloop so the SwiftUI glue has time to set up the menu, however this gets called so early in the app startup lifecycle that it's not visible. So while not the most elegant solution, this works perfectly fine.

## Conclusion

This is a good reminder that even when writing a "Pure SwiftUI" application, the underlying frameworks are there and can help you whenever you run into a limitation of SwiftUI. Since this feels like an omission, I've opened a radar (FB9074334) for the SwiftUI team.
