---
title: "Automatic Observation Tracking in UIKit and AppKit: The Feature Apple Forgot to Mention"
pubDatetime: 2025-06-11T10:00:00+01:00
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

Remember when SwiftUI came out and we all marveled at how views automatically updated when `@Published` properties changed? Well, Apple has been quietly working on bringing that same magic to UIKit and AppKit. The best part? It shipped in iOS 18/macOS 15, but hardly anyone knows about it. You don't even need Xcode 26, it's just one simple plist entry away.

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

Forgot to call `updateUI()`? Enjoy your stale UI. Called it too often? Hello, performance issues. It's tedious and error-prone.

## Enter Automatic Observation Tracking

With the new observation framework, this entire pattern becomes obsolete. Here's the same code with automatic tracking:

```swift
import Observation

@Observable
class User {
    var name: String = ""
    var avatar: UIImage?
    var unreadCount = 0
    
    var hasUnread: Bool {
        unreadCount > 0
    }
}

class ProfileViewController: UIViewController {
    let user = User()
    
    override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        // UIKit tracks these property accesses automatically!
        nameLabel.text = user.name
        avatarImageView.image = user.avatar
        badgeView.isHidden = !user.hasUnread
    }
}
```

That's it. Change `user.name` anywhere in your app, and the label updates. No manual calls, no forgotten updates, no performance overhead from unnecessary refreshes. It just works.

## Where Observation Tracking Works

The automatic observation tracking is supported in a variety of UIKit and AppKit methods. For most cases, `viewWillLayoutSubviews()` in UIKit view controllers, `layoutSubviews()` in UIKit views, and their AppKit equivalents (`viewWillLayout()` and `layout()`) are the go-to choices.

<details>
<summary><strong>View the complete list of supported methods</strong></summary>

### UIView
- [`updateProperties()`](https://developer.apple.com/documentation/uikit/automatic-trait-tracking) (iOS 26+)
- [`layoutSubviews()`](https://developer.apple.com/documentation/uikit/uiview/1622482-layoutsubviews)
- [`updateConstraints()`](https://developer.apple.com/documentation/uikit/uiview/1622512-updateconstraints)
- [`draw(_:)`](https://developer.apple.com/documentation/uikit/uiview/1622529-draw)

### UIViewController
- [`updateProperties()`](https://developer.apple.com/documentation/uikit/automatic-trait-tracking) (iOS 26+)
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

</details>

## Enabling the Magic

Here's where it gets interesting. This feature isn't enabled by default (yet). You need to add a key to your Info.plist:

### For UIKit (iOS 18+)
```xml
<key>UIObservationTrackingEnabled</key><true/>
```

### For AppKit (macOS 15+)
```xml
<key>NSObservationTrackingEnabled</key><true/>
```

This plist key enables observation tracking in iOS 18 and macOS 15. Starting with their 26 releases, this is on by default and the key will simply be ignored.

## iOS 26 and Beyond

iOS 26 (already in beta!) brings improvements. The new `updateProperties()` method on both `UIView` and `UIViewController` provides an even better place for observable property access. For a comprehensive overview of all iOS 26 UIKit additions, check out [Jordan Morgan's excellent writeup](https://www.swiftjectivec.com/ios-26-notable-uikit-additions/).

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

This method is specifically designed for property updates and runs before `layoutSubviews`, allowing for more efficient updates and clearer separation of concerns. 

Just like the layout system has `setNeedsLayout()` and `layoutIfNeeded()`, the property update system provides [`setNeedsUpdateProperties()`](https://developer.apple.com/documentation/uikit/uiview/setNeedsUpdateProperties) and [`updatePropertiesIfNeeded()`](https://developer.apple.com/documentation/uikit/uiview/updatePropertiesIfNeeded). You can call `setNeedsUpdateProperties()` to schedule a property update on the next update cycle, or use `updatePropertiesIfNeeded()` to force an immediate update if one is pending. This gives you fine-grained control over when property updates occur, which is especially useful for optimizing performance in complex view hierarchies.

Apple's [automatic trait tracking documentation](https://developer.apple.com/documentation/uikit/automatic-trait-tracking) provides detailed guidance on using these new APIs. Plus, automatic observation tracking is enabled by default in iOS 26, so you won't even need the plist key anymore.

## The Gotchas

Of course, it's not all roses. Here are a few things to watch out for:

- **Observation happens in specific methods**: Only properties accessed in the supported methods (see list above) are tracked
- **Timing matters**: If you're doing expensive computations, consider caching results since these methods can be called frequently
- **Memory considerations**: Observable objects are retained while being observed, so be mindful of retain cycles
- **Thread safety**: While `@Observable` is thread-safe, mutations from different threads could lead to inconsistent UI representations. Keep all mutations on the main thread to avoid surprises

## A Pattern to Avoid

You might be tempted to create a method that pre-accesses all observable properties:

```swift
// ❌ Don't do this
override func trackObservableProperties() {
    // Accessing all properties upfront
    _ = model.backgroundColor
    _ = model.cornerRadius
    _ = model.title
    // ... etc
}
```

This is an anti-pattern for two reasons:

1. **Inefficiency**: It establishes observation dependencies for ALL properties, even those not used in the current UI state. The beauty of automatic observation is that it only tracks properties actually accessed during updates.

2. **Fragility**: You're maintaining a duplicate list of properties that can easily fall out of sync with your actual UI code.

Instead, access properties directly where they're used:

```swift
// ✅ Do this
override func layoutSubviews() {
    super.layoutSubviews()
    // Only accessed properties create dependencies
    if model.isOptionEnabled {
        view.foo = model.bar  // Only bar is observed
    } else {
        view.foo = model.baz  // Only baz is observed
    }
}
```

This way, only the properties actually affecting your UI get observation dependencies, making your code both more efficient and maintainable.

## Performance Considerations

You might be wondering about performance. The beauty of this system is that it only tracks dependencies when views are actually laying out. If a view isn't visible, it's not tracking. The observation framework uses a sophisticated dependency graph that ensures minimal overhead.

## Complete Example Project

Automatic observation tracking is one of those features that makes you wonder how you lived without it. It brings the best parts of SwiftUI's reactive programming model to UIKit and AppKit, without requiring a complete rewrite of your app.

All the code snippets in this post come from a fully working example project. Check it out on GitHub: [ObservationTrackingExample](https://github.com/steipete/ObservationTrackingExample)

## The Missing Piece: Custom Traits

If you've used SwiftUI, you know the joy of `@EnvironmentObject` - drop an object at the root, access it anywhere. UIKit developers have been jealous of this pattern for years. Well, jealous no more. (Mac devs miss out tho - there's no equivalent on AppKit yet)

Since iOS 17, UIKit has quietly introduced custom traits - a way to attach arbitrary values to the trait collection that flows through your view hierarchy. These aren't just for dark mode and size classes anymore. Keith Harrison has an [excellent deep dive into custom traits](https://useyourloaf.com/blog/custom-traits-and-swiftui/) if you want the full story.

The magic happens when you combine custom traits with observable objects. You get automatic propagation AND automatic updates. It's like having your cake and eating it too.

<details>
<summary><strong>View the complete Example</strong></summary>

Let's build an app-wide state container that any view can access and observe:

```swift
import UIKit
import Observation

@Observable 
class AppModel {
    var currentUser: User?
    var theme: Theme = .light
    var isOnline = true
    
    // Add more app-wide state as needed
}

// Define a custom trait for your app model
struct AppModelTrait: UITraitDefinition {
    static let defaultValue: AppModel? = nil
}

// Add convenient accessors
extension UITraitCollection {
    var appModel: AppModel? {
        self[AppModelTrait.self]
    }
}

extension UIMutableTraits {
    var appModel: AppModel? {
        get { self[AppModelTrait.self] }
        set { self[AppModelTrait.self] = newValue }
    }
}
```

## Injecting the Model

At your app's root (usually in your scene delegate or root view controller), inject the model:

```swift
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?
    let appModel = AppModel()
    
    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        
        window = UIWindow(windowScene: windowScene)
        let rootViewController = MainTabBarController()
        
        // Inject the app model into the trait system
        rootViewController.traitOverrides.appModel = appModel
        
        window?.rootViewController = rootViewController
        window?.makeKeyAndVisible()
    }
}
```

## Observing Changes Anywhere

Now the magic part - any view controller in your hierarchy can access and observe the model:

```swift
class ProfileViewController: UIViewController {
    let nameLabel = UILabel()
    let statusIndicator = UIView()
    
    override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        
        guard let model = traitCollection.appModel else { return }
        
        // These automatically update when model properties change!
        nameLabel.text = model.currentUser?.name ?? "Guest"
        statusIndicator.backgroundColor = model.isOnline ? .systemGreen : .systemRed
        
        // Theme updates
        view.backgroundColor = model.theme.backgroundColor
        nameLabel.textColor = model.theme.textColor
    }
}
```
No delegates. No notifications. No manual updates. Change `appModel.currentUser` anywhere in your app, and every view observing it updates automatically.
</details>

## Resources

- [Apple's Observation Framework Documentation](https://developer.apple.com/documentation/observation)
- [WWDC 2023: Discover Observation in Swift](https://developer.apple.com/videos/play/wwdc2023/10149/) (covers the foundation)
- [Example Project on GitHub](https://github.com/steipete/ObservationTrackingExample)
- [Swift Forums Discussion on Observation Tracking](https://forums.swift.org/t/observation-tracking-in-uikit)
- [Custom Traits and SwiftUI](https://useyourloaf.com/blog/custom-traits-and-swiftui/) by Keith Harrison
    
