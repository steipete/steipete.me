---
title: "Automatic Observation Tracking in UIKit: The Feature Apple Forgot to Mention"
pubDatetime: 2025-06-10T14:00:00+01:00
description: "Discover how iOS 18's hidden automatic observation tracking brings SwiftUI-like reactive programming to UIKit and AppKit, making your UI code cleaner and more maintainable."
tags:
  - iOS
  - Swift
  - UIKit
  - AppKit
  - Observation
---

**TL;DR**: iOS 18 and macOS 15 secretly ship with automatic observation tracking for UIKit/AppKit. Enable it with a plist key, and your views magically update when your `@Observable` models change. No more manual `setNeedsDisplay()` calls!

## The Hidden Gem in iOS 18

Remember when SwiftUI came out and we all marveled at how views automatically updated when `@Published` properties changed? Well, Apple has been quietly working on bringing that same magic to UIKit and AppKit. The best part? It shipped in iOS 18/macOS 15, but hardly anyone knows about it.

I stumbled upon this while digging through the iOS 18 release notes (yes, I'm that person who reads ALL the release notes). Buried deep in the documentation was a mention of "observation tracking" for UIKit. No fanfare, no WWDC session, just a quiet revolution in how we can write UI code.

## The Problem We've All Faced

Let's be honest - keeping your UI in sync with your data model in UIKit has always been a chore. Here's the dance we've all done:

```swift
class ProfileViewController: UIViewController {
    var user: User? {
        didSet {
            updateUI()
        }
    }
    
    func updateUI() {
        nameLabel.text = user?.name
        avatarImageView.image = user?.avatar
        // ... 20 more lines of manual updates
        setNeedsLayout()
    }
}
```

Forgot to call `updateUI()`? Enjoy your stale UI. Called it too often? Hello, performance issues. It's like walking a tightrope while juggling flaming torches.

## Enter Automatic Observation Tracking

With the new observation framework, this entire pattern becomes obsolete. Here's the same code with automatic tracking:

```swift
import Observation

@Observable
class User {
    var name: String = ""
    var avatar: UIImage?
}

class ProfileViewController: UIViewController {
    let user = User()
    
    override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        // UIKit tracks these property accesses automatically!
        nameLabel.text = user.name
        avatarImageView.image = user.avatar
    }
}
```

That's it. Change `user.name` anywhere in your app, and the label updates. No manual calls, no forgotten updates, no performance overhead from unnecessary refreshes. It just works.

## Where Observation Tracking Works

The automatic observation tracking is supported in a variety of UIKit methods. Here's the complete list:

### UIView
- `updateProperties()` (iOS 26 beta+)
- [`layoutSubviews()`](https://developer.apple.com/documentation/uikit/uiview/1622482-layoutsubviews)
- [`updateConstraints()`](https://developer.apple.com/documentation/uikit/uiview/1622512-updateconstraints)
- [`draw(_:)`](https://developer.apple.com/documentation/uikit/uiview/1622529-draw)

### UIViewController
- `updateProperties()` (iOS 26 beta+)
- [`viewWillLayoutSubviews()`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621437-viewwilllayoutsubviews)
- [`viewDidLayoutSubviews()`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621398-viewdidlayoutsubviews)
- [`updateViewConstraints()`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621379-updateviewconstraints)
- [`updateContentUnavailableConfiguration(using:)`](https://developer.apple.com/documentation/uikit/uiviewcontroller/4195484-updatecontentunavailableconfigur)

### UIPresentationController
- [`containerViewWillLayoutSubviews()`](https://developer.apple.com/documentation/uikit/uipresentationcontroller/1618335-containerviewwilllayoutsubviews)
- [`containerViewDidLayoutSubviews()`](https://developer.apple.com/documentation/uikit/uipresentationcontroller/1618329-containerviewdidlayoutsubviews)

### UIButton
- [`updateConfiguration()`](https://developer.apple.com/documentation/uikit/uibutton/3750773-updateconfiguration)
- When executing the [`configurationUpdateHandler`](https://developer.apple.com/documentation/uikit/uibutton/3750772-configurationupdatehandler)

### UICollectionViewCell, UITableViewCell, UITableViewHeaderFooterView
- [`updateConfiguration(using:)`](https://developer.apple.com/documentation/uikit/uicollectionviewcell/3600950-updateconfiguration) (UICollectionViewCell)
- [`updateConfiguration(using:)`](https://developer.apple.com/documentation/uikit/uitableviewcell/3601058-updateconfiguration) (UITableViewCell)
- [`updateConfiguration(using:)`](https://developer.apple.com/documentation/uikit/uitableviewheaderfooterview/3601061-updateconfiguration) (UITableViewHeaderFooterView)
- When executing the `configurationUpdateHandler`

### NSView (AppKit)
- [`updateConstraints()`](https://developer.apple.com/documentation/appkit/nsview/1526891-updateconstraints)
- [`layout()`](https://developer.apple.com/documentation/appkit/nsview/1526146-layout)
- [`draw(_:)`](https://developer.apple.com/documentation/appkit/nsview/1483686-draw)
- [`updateLayer()`](https://developer.apple.com/documentation/appkit/nsview/1526068-updatelayer)

### NSViewController (AppKit)
- [`updateViewConstraints()`](https://developer.apple.com/documentation/appkit/nsviewcontroller/1434401-updateviewconstraints)
- [`viewWillLayout()`](https://developer.apple.com/documentation/appkit/nsviewcontroller/1434481-viewwilllayout)
- [`viewDidLayout()`](https://developer.apple.com/documentation/appkit/nsviewcontroller/1434491-viewdidlayout)

This gives you plenty of options for where to place your observable property access. For most cases, `viewWillLayoutSubviews()` in UIKit view controllers, `layoutSubviews()` in UIKit views, and their AppKit equivalents (`viewWillLayout()` and `layout()`) are the go-to choices.

## Enabling the Magic

Here's where it gets interesting. This feature isn't enabled by default (yet). You need to add a key to your Info.plist:

### For UIKit (iOS 18+)
```xml
<key>UIObservationTrackingEnabled</key>
<true/>
```

### For AppKit (macOS 15+)
```xml
<key>NSObservationTrackingEnabled</key>
<true/>
```

Apple has enabled this by default in iOS 26 (already available in beta!). For iOS 18 and macOS 15, you'll need to enable it manually with the plist key.

## Real-World Example: A Message Counter

Let's build something practical - a message counter that updates automatically:

```swift
@Observable
class MessageStore {
    var unreadCount = 0
    var totalCount = 0
    
    var hasUnread: Bool {
        unreadCount > 0
    }
}

class MessagesViewController: UIViewController {
    let messageStore = MessageStore()
    
    override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        
        // These views automatically update when the store changes!
        unreadLabel.text = "Unread: \(messageStore.unreadCount)"
        totalLabel.text = "Total: \(messageStore.totalCount)"
        badgeView.isHidden = !messageStore.hasUnread
        badgeView.backgroundColor = messageStore.unreadCount > 5 ? .red : .blue
    }
}
```

Every time the message counts change, all UI elements update automatically. The badge appears/disappears, changes color, and the labels show the latest counts. Zero manual intervention required.

For the complete working example with proper view setup and a message simulation timer, check out the [example project on GitHub](https://github.com/steipete/AutomaticObservationDemo).

## Beyond the Basics

This is just the beginning. In my follow-up post, I show how to combine observable objects with UIKit's custom traits to create SwiftUI-like environment values that flow through your view hierarchy. Check out [Observable Objects in UIKit Traits](/posts/observable-objects-in-uikit-traits/) to learn this powerful pattern.

## Performance Considerations

You might be wondering about performance. The beauty of this system is that it only tracks dependencies when views are actually laying out. If a view isn't visible, it's not tracking. The observation framework uses a sophisticated dependency graph that ensures minimal overhead.

In my testing with a complex view hierarchy (100+ views, multiple observable objects), the performance impact was negligible. The automatic tracking actually performed better than my manual update code because it eliminated redundant updates. Check out the [performance comparison demo](https://github.com/steipete/AutomaticObservationDemo) to see the benchmarks in action.

## iOS 26 and Beyond

iOS 26 (already in beta!) brings improvements. The new `updateProperties()` method on both `UIView` and `UIViewController` provides an even better place for observable property access:

```swift
class MyView: UIView {
    let model: MyModel
    
    override func updateProperties() {
        super.updateProperties()
        // This runs before layoutSubviews for even better performance
        backgroundColor = model.backgroundColor
        layer.cornerRadius = model.cornerRadius
    }
}
```

This method is specifically designed for property updates and runs before `layoutSubviews`, allowing for more efficient updates and clearer separation of concerns. Plus, automatic observation tracking is enabled by default in iOS 26, so you won't even need the plist key anymore.

## Migration Strategy

If you're maintaining an existing UIKit app, here's my recommended migration approach:

1. **Start with new views**: Enable observation tracking and use it for all new view controllers
2. **Identify hot spots**: Find views with complex manual update logic
3. **Convert incrementally**: Move one view controller at a time to the new pattern
4. **Remove the old cruft**: Delete all those `updateUI()` methods with satisfaction

## The Gotchas

Of course, it's not all roses. Here are a few things to watch out for:

- **Observation happens in specific methods**: Only properties accessed in the supported methods (see list above) are tracked
- **Timing matters**: If you're doing expensive computations, consider caching results since these methods can be called frequently
- **Memory considerations**: Observable objects are retained while being observed, so be mindful of retain cycles
- **Thread safety**: While `@Observable` is thread-safe, mutations from different threads could lead to inconsistent UI representations. Keep all mutations on the main thread to avoid surprises

## Complete Example Project

All the code snippets in this post come from a fully working example project. Check it out on GitHub: [AutomaticObservationDemo](https://github.com/steipete/AutomaticObservationDemo)

The project includes:
- ✅ Basic property observation with message counter
- ✅ Complex nested observable objects  
- ✅ Performance benchmarks comparing manual vs automatic updates
- ✅ Migration patterns from traditional UIKit code
- ✅ Advanced trait propagation system
- ✅ Info.plist configuration for iOS 18+

## Wrapping Up

Automatic observation tracking is one of those features that makes you wonder how you lived without it. It brings the best parts of SwiftUI's reactive programming model to UIKit and AppKit, without requiring a complete rewrite of your app.

The fact that Apple shipped this so quietly suggests they're still refining the API, but in my experience, it's already rock-solid for production use. Enable those plist keys, start using `@Observable`, and enjoy writing cleaner, more maintainable UI code.

Have you tried automatic observation tracking in your apps? I'd love to hear about your experiences. Find me on [Twitter](https://twitter.com/steipete) or [Mastodon](https://mastodon.social/@steipete) and let's discuss!

## Resources

- [Apple's Observation Framework Documentation](https://developer.apple.com/documentation/observation)
- [WWDC 2023: Discover Observation in Swift](https://developer.apple.com/videos/play/wwdc2023/10149/) (covers the foundation)
- [Example Project on GitHub](https://github.com/steipete/AutomaticObservationDemo)
- [Swift Forums Discussion on Observation Tracking](https://forums.swift.org/t/observation-tracking-in-uikit)