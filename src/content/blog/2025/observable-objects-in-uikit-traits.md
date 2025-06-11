---
title: "Observable Objects in UIKit Traits: SwiftUI's Environment Pattern for UIKit"
pubDatetime: 2025-06-10T17:00:00+01:00
description: "Learn how to combine UIKit's custom traits with Observable objects to create a powerful environment pattern for app-wide state management, bringing SwiftUI-like data flow to UIKit."
tags:
  - iOS
  - Swift
  - UIKit
  - Observation
  - Architecture
---

**TL;DR**: Combine UIKit's custom traits with `@Observable` objects to create SwiftUI-like environment values that automatically update your UI. No more passing model objects through view controller hierarchies!

## The Missing Piece

In my previous post about [automatic observation tracking in UIKit and AppKit](/posts/automatic-observation-tracking-uikit-appkit/), I showed how iOS 18's hidden feature brings reactive UI updates to UIKit and AppKit. But there was one thing still missing: how do you elegantly pass observable objects through your view hierarchy?

If you've used SwiftUI, you know the joy of `@EnvironmentObject` - drop an object at the root, access it anywhere. UIKit developers have been jealous of this pattern for years. Well, jealous no more.

## Enter Custom Traits

Since iOS 17, UIKit has quietly introduced custom traits - a way to attach arbitrary values to the trait collection that flows through your view hierarchy. These aren't just for dark mode and size classes anymore. Keith Harrison has an [excellent deep dive into custom traits](https://useyourloaf.com/blog/custom-traits-and-swiftui/) if you want the full story.

The magic happens when you combine custom traits with observable objects. You get automatic propagation AND automatic updates. It's like having your cake and eating it too.

## Building the Pattern

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

## Real-World Example: Theme Switching

Here's a practical example - implementing app-wide theme switching:

```swift
enum Theme {
    case light, dark, system
    
    var backgroundColor: UIColor {
        switch self {
        case .light: return .systemBackground
        case .dark: return .black
        case .system: return .systemBackground
        }
    }
    
    var textColor: UIColor {
        switch self {
        case .light: return .label
        case .dark: return .white  
        case .system: return .label
        }
    }
}

class SettingsViewController: UIViewController {
    let themeSegmentedControl = UISegmentedControl(items: ["Light", "Dark", "System"])
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        
        guard let model = traitCollection.appModel else { return }
        
        // Update UI based on current theme
        view.backgroundColor = model.theme.backgroundColor
        navigationController?.navigationBar.barStyle = model.theme == .dark ? .black : .default
        
        // Update control to match current theme
        switch model.theme {
        case .light: themeSegmentedControl.selectedSegmentIndex = 0
        case .dark: themeSegmentedControl.selectedSegmentIndex = 1
        case .system: themeSegmentedControl.selectedSegmentIndex = 2
        }
    }
    
    @objc private func themeChanged(_ sender: UISegmentedControl) {
        guard let model = traitCollection.appModel else { return }
        
        // Just update the model - UI updates automatically everywhere!
        switch sender.selectedSegmentIndex {
        case 0: model.theme = .light
        case 1: model.theme = .dark
        case 2: model.theme = .system
        default: break
        }
    }
}
```

## Advanced Patterns

### Nested View Controllers

The trait system automatically propagates to child view controllers:

```swift
class ContainerViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let childVC = DetailViewController()
        addChild(childVC)
        view.addSubview(childVC.view)
        childVC.didMove(toParent: self)
        
        // childVC automatically inherits the appModel trait!
    }
}
```

### Modal Presentations

For modals, you need to explicitly pass the trait:

```swift
@objc private func presentSettings() {
    let settingsVC = SettingsViewController()
    let navController = UINavigationController(rootViewController: settingsVC)
    
    // Pass the app model to the modal
    navController.traitOverrides.appModel = traitCollection.appModel
    
    present(navController, animated: true)
}
```

### Different Contexts with Split Views

One of the most powerful aspects of the trait system is providing different contexts to different parts of your UI. This is especially useful with split view controllers:

```swift
class MainSplitViewController: UISplitViewController {
    let masterModel = MasterPaneModel()
    let detailModel = DetailPaneModel()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let masterVC = MasterViewController()
        let detailVC = DetailViewController()
        
        // Each pane gets its own model through traits
        masterVC.traitOverrides.paneModel = masterModel
        detailVC.traitOverrides.paneModel = detailModel
        
        // But both still have access to the app-wide model
        // (inherited from the split view controller)
        
        setViewController(masterVC, for: .primary)
        setViewController(detailVC, for: .secondary)
    }
}

// Define separate traits for different contexts
struct PaneModelTrait: UITraitDefinition {
    static let defaultValue: PaneModel? = nil
}

@Observable
class MasterPaneModel: PaneModel {
    var selectedItem: Item?
    var isSearching = false
}

@Observable 
class DetailPaneModel: PaneModel {
    var currentDocument: Document?
    var editMode = false
}
```

This approach gives you incredible flexibility - each part of your interface can have its own observable context while still sharing app-wide state. It's like having scoped dependency injection that automatically updates your UI!

### Testing

This pattern makes testing a breeze:

```swift
class ProfileViewControllerTests: XCTestCase {
    func testUserNameDisplay() {
        let model = AppModel()
        model.currentUser = User(name: "Test User")
        
        let vc = ProfileViewController()
        vc.traitOverrides.appModel = model
        
        // Force layout to trigger observation
        vc.loadViewIfNeeded()
        vc.view.layoutIfNeeded()
        
        XCTAssertEqual(vc.nameLabel.text, "Test User")
    }
}
```

## Performance Considerations

The combination of traits and observation is surprisingly efficient:

1. **Traits are lazy**: The trait system only computes values when accessed
2. **Observation is targeted**: Only views currently laying out track dependencies
3. **Updates are batched**: Multiple model changes in the same run loop coalesce

In practice, this pattern performs as well as (or better than) traditional delegation or notification patterns.

## Gotchas and Best Practices

### Thread Safety

While `@Observable` is thread-safe, UI updates must happen on the main thread:

```swift
// ❌ Don't do this
DispatchQueue.global().async {
    self.appModel.currentUser = newUser  // UI might update from background thread!
}

// ✅ Do this instead
DispatchQueue.global().async {
    let newUser = fetchUser()
    DispatchQueue.main.async {
        self.appModel.currentUser = newUser
    }
}
```

### Memory Management

The trait system holds strong references. For temporary overrides, remember to clean up:

```swift
override func viewDidDisappear(_ animated: Bool) {
    super.viewDidDisappear(animated)
    // Clear any temporary trait overrides if needed
    traitOverrides.appModel = nil
}
```

### Trait Propagation Timing

Traits propagate during the trait collection change cycle. If you need immediate access:

```swift
viewController.traitOverrides.appModel = model
viewController.loadViewIfNeeded()  // Force trait propagation
```

## Migration Strategy

If you're currently using singletons or passing models through initializers:

1. **Start with new features**: Use this pattern for new view controllers
2. **Gradual migration**: Replace singleton access with trait access one screen at a time
3. **Remove coupling**: Delete those model properties from view controller initializers

## Complete Example

I've created a full working example demonstrating these patterns in the [AutomaticObservationDemo](https://github.com/steipete/AutomaticObservationDemo) project on GitHub. The project includes:

- Complete app model with user, theme, and network state
- Multiple view controllers demonstrating the pattern
- Modal presentation with trait passing
- Unit tests showing how to test with traits

## Wrapping Up

Combining custom traits with observable objects gives UIKit developers a powerful pattern that rivals SwiftUI's environment values. You get the benefits of reactive UI updates with the flexibility and control of UIKit.

This pattern has become my go-to approach for app-wide state in UIKit apps. It's clean, it's testable, and it makes your view controllers beautifully decoupled.

Want to learn more about automatic observation tracking? Check out my [previous post](/posts/automatic-observation-tracking-uikit-appkit/) that covers the basics. Together, these two features transform how we write UIKit apps.

Have you tried this pattern? I'd love to hear your experiences. Find me on [Twitter](https://twitter.com/steipete) or [Mastodon](https://mastodon.social/@steipete) and let's discuss!

## Resources

- [Automatic Observation Tracking in UIKit and AppKit](/posts/automatic-observation-tracking-uikit-appkit/) (my previous post)
- [Custom Traits and SwiftUI](https://useyourloaf.com/blog/custom-traits-and-swiftui/) by Keith Harrison
- [Example Project on GitHub](https://github.com/steipete/AutomaticObservationDemo)
- [Apple's Observation Framework Documentation](https://developer.apple.com/documentation/observation)