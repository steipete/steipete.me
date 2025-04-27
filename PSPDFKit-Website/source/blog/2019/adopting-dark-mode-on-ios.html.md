---
title: "Adopting Dark Mode on iOS and Ensuring Backward Compatibility"
description: "A comprehensive overview of adopting Dark Mode in an iOS app, along with a few tips to make the process of development easier."
preview_image: /images/blog/2019/adopting-dark-mode-on-ios/article-header.png
section: blog
author:
  - Nishant Desai
author_url:
  - https://twitter.com/nish_desai
date: 2019-11-20 8:00 UTC
tags: iOS, Development, Swift
published: true
secret: false
---

Dark Mode was one of the most anticipated features for iOS users in 2019, arriving on the scene a year after it was introduced for macOS with Mojave (macOS 10.14). Naturally, as developers, we want our applications and SDKs to support all the latest iOS features, so we at PSPDFKit quickly got to work implementing Dark Mode.

Of course, for many people, Dark Mode simply looks cool, whereas some users have vision conditions that Dark Mode helps mitigate. But from a tech perspective, one major benefit of supporting Dark Mode is that it consumes less energy, which impacts battery life in a positive way. The reason for this is that, in OLED displays (which were introduced to the Apple line when iPhone X came out), pixels can be turned off completely, and the black color is achieved by doing exactly that, effectively making a display use less power.

Since we knew our users would want to have the option for Dark Mode as soon as iOS 13 came out, we made certain it was a part of [PSPDFKit 9 for iOS][].

## The Implementation

The APIs to implement Dark Mode are straightforward, and they rely mainly on the use of dynamic colors and interface environment traits. In a nutshell, Dark Mode updates a view’s colors and images based on the interface environment traits (which we’ll cover next), but it’s of course much more complicated and involved under the hood.

### Interface Environment Traits

Each iOS interface has different environment traits, such as the display scale or the horizontal and vertical size class. Grouped together, these traits are known as **interface environment traits**, or trait collections. Interface environment traits can be accessed using the [`traitCollection`][] property of the class (the [`UITraitCollection`][] class) that adopts the [`UITraitEnvironment`][] protocol.

A few new interface environment traits were added to iOS 13. Below are these traits and their uses:

- [`UIUserInterfaceStyle`][] — The style associated with the user interface. Values are `.light` and `.dark`. Changed in the Display & Brightness menu in `Settings.app`
- [`UIAccessibilityContrast`][] — The contrast level between foreground and background content. Values are `.normal` and `.high`. Changed in the Accessibility menu in `Settings.app`.
- [`UIUserInterfaceLevel`][] — The visual level of content. Values are `.base` and `.elevated`. The level of content is elevated if it is displayed above the window’s main content.
- [`UILegibilityWeight`][] — The font weight. Values are `.regular` and `.bold`. Changed in the Display & Brightness menu in `Settings.app`.

In addition to the above mentioned values for each of the traits, there is another value, `.unspecified`, which applies to all of the traits. When this value is specified and applied to a trait, it states that that particular trait should follow the default system trait.

All the view elements inherit these trait collections from their parent view, and whenever any value in the trait collection changes for an object, the [`traitCollectionDidChange(_:)`][] method is called. This method receives the previous trait collection of the view as a method parameter, which can then be compared with the current trait collection (accessed using `self.traitCollection`). The view is then updated accordingly.

Of all the traits listed above, the `UIUserInterfaceStyle` type trait is the most important when it comes to adopting Dark Mode, as the value of it changes when the user toggles the Dark Mode. More specifically, a change in value for the `UIUserInterfaceStyle` is made, and a call to `traitCollectionDidChange(_:)` is also made to enable us to update our views.

Whenever a new view is created, its user interface style (along with other traits) is predicted, as it does not have a parent view at that point. The prediction is done by UIKit based on where it expects the newly created view will end up.

A call to `traitCollectionDidChange(_:)` is also made either if the predicted user interface style of the view turns out to be incorrect after it’s added to the view hierarchy, or whenever a user changes the user interface style of the system or it is changed by us programmatically.

iOS 13 has a new method, [`hasDifferentColorAppearance(comparedTo:)`][], which can be used to check if there are any changes in traits that affect dynamic color. If there are any changes, this method should be used in the overridden implementation of `traitCollectionDidChange(_:)` to update the views with respect to colors.

All these environment traits are honored by UIKit for Mac (Mac Catalyst) apps.

#### Enforcing the User Interface Style

You can enforce a particular user interface style (light/dark mode) across an app by setting `UIUserInterfaceStyle` in `Info.plist` on the app level. You can also set the user interface style using `overrideUserInterfaceStyle` on any view controller or view, as it cascades, much like the `tintColor` property. Additionally, you can set this on windows, but be careful, as they update their `rootViewController`, making all controllers — including the presented view controllers inside the window — follow that user interface style.

### Dynamic Colors

Dynamic colors are plain old `UIColor` objects that return a static color based on the combination of the current interface environment traits. Dynamic colors can be created in two ways: using the asset catalog or using the dynamic provider initializer.

#### Using the Asset Catalog

The asset catalog has supported adding colors to it since iOS 11. Color can be added to the asset catalog in the same way as we add images to it. It allows you to assign different colors for each user interface style and contrast mode.

<img src="/images/blog/2019/adopting-dark-mode-on-ios/asset-catalog.png"
alt="Asset Catalog Color" />

The color set for the _Any_ section is used as the default fallback color for older iOS versions, so the color set above coupled with the [named initializer][] of `UIColor` can be used in your project:

[==

```swift
let demoColor = UIColor(named: "demoColor")
```

```objc
UIColor *demoColor = [UIColor colorNamed:@"demoColor"];
```

==]

#### Using the Dynamic Provider Initializer

Dynamic color can also be created in code using the [dynamic provider initializer][]. It takes a closure as an argument, the closure has a `UITraitCollection` object passed to it, and the traits from that object need to be utilized to return an appropriate `UIColor` object:

[==

```swift
let dynamicColor = UIColor { traitCollection -> UIColor in
    let isDarkMode = traitCollection.userInterfaceStyle == .dark
    let isHighContrast = traitCollection.accessibilityContrast == .high

    if isDarkMode && !isHighContrast {
        return darkModeColor
    } else if isDarkMode && isHighContrast {
        return highContrastDarkModeColor
    } else if !isDarkMode && isHighContrast {
        return highContrastLightModeColor
    } else {
        return lightModeColor
    }
}
```

```objc
UIColor *dynamicColor = [UIColor colorWithDynamicProvider:^UIColor *(UITraitCollection *traitCollection) {
    BOOL isDarkMode = traitCollection.userInterfaceStyle == UIUserInterfaceStyleDark;
    BOOL isHighContrast = traitCollection.accessibilityContrast == UIAccessibilityContrastHigh;

    if (isDarkMode && !isHighContrast) {
        return darkModeColor;
    } else if (isDarkMode && isHighContrast) {
        return highContrastDarkModeColor;
    } else if (!isDarkMode && isHighContrast) {
        return highContrastLightModeColor;
    } else {
        return lightModeColor;
    }
}];
```

==]

#### UI Element (Semantic) Colors

UIKit added a new set of dynamic colors which are known as [element colors][]. These are recommended for use as colors for background, text, fill, etc. The background colors have three variants ranging from primary to tertiary, while the foreground colors are used for text, and the fill colors have four variants.

The system background colors have two levels — base and elevated — and the `UIUserInterfaceLevel` trait from the trait collection is used to determine this level. The base level is used for views covered edge to edge, while views added in a separate level above base level are considered to be on an elevated level. Foreground colors do not have different levels.

While using these colors, please make sure that you go through the [Human Interface Guidelines section on color][] and the documentation of [element colors][] to gain a better understanding of how they are supposed to be used.

Please note that if you have the Mac (Catalyst) target enabled for your iOS app, these colors might be different in a few places on the macOS app than they are on iOS, as the color system doesn’t have one-to-one correspondence.

#### Resolving Dynamic Colors

Lower-level Core Graphics APIs use `CGColor`, which does not support dynamic colors since dynamic colors are only supported by UIKit APIs.

When the `CGColor` property is accessed on a color, iOS uses [`UITraitCollection.current`][] to return a static color. There are certain methods (outlined below), outside of which UIKit doesn’t guarantee that `UITraitCollection.current` will be set appropriately. When using a low-level API outside these methods in initializations or lazy initializations, it’s necessary to ask the color object to give us the color for the traits by supplying it with the appropriate trait collection object. This is called resolving dynamic colors. Apple’s recommended best practice is to wait until the views have been laid out before reading the trait collection.

Below are the methods where we do not have to worry about setting `UITraitCollection.current`, as UIKit does it for us and the appropriate color is automatically picked:

|          `UIView`          |     `UIViewController`     |    `UIPresentationController`     |
| :------------------------: | :------------------------: | :-------------------------------: |
|           `draw`           |  `viewWillLayoutSubviews`  | `containerViewWillLayoutSubviews` |
|      `layoutSubviews`      |  `viewDidLayoutSubviews`   | `containerViewDidLayoutSubviews`  |
| `traitCollectionDidChange` | `traitCollectionDidChange` |    `traitCollectionDidChange`     |
|    `tintColorDidChange`    |                            |                                   |

We have to resolve the dynamic color outside of the above methods, and there are three ways to do so in code:

[==

```swift
// Option A
// Temporarily set `UITraitCollection.currentTraitCollection` with the appropriate trait collection.
let currentTraits = UITraitCollection.current
UITraitCollection.current = appropriateTraitCollection
layer.borderColor = dynamicColor.cgColor
UITraitCollection.current = currentTraits

// Option B
// Use the `performAsCurrent` method on the appropriate trait collection.
appropriateTraitCollection.performAsCurrent {
    layer.borderColor = dynamicColor.cgColor
}

// Option C
// Use `UIColor.resolvedColor(with:)`.
layer.borderColor = dynamicColor.resolvedColor(with: appropriateTraitCollection).cgColor
```

```objc
// Option A
// Temporarily set `UITraitCollection.currentTraitCollection` with the appropriate trait collection.
UITraitCollection *currentTraits = UITraitCollection.currentTraitCollection;
UITraitCollection.currentTraitCollection = appropriateTraitCollection;
layer.borderColor = dynamicColor.CGColor;
UITraitCollection.currentTraitCollection = currentTraits;

// Option B
// Use the `performAsCurrentTraitCollection:` method on the appropriate trait collection.
[appropriateTraitCollection performAsCurrentTraitCollection:^{
    layer.borderColor = dynamicColor.CGColor;
}];

// Option C
// Use `-[UIColor resolvedColorWithTraitCollection:]`.
layer.borderColor = [dynamicColor resolvedColorWithTraitCollection: appropriateTraitCollection].CGColor;
```

==]

Now we have static colors, so if the user interface style changes again, we have to update the places where these static colors are used. This is where the call to `traitCollectionDidChange(_:)` comes into play again. We can override this function in our views that need to be updated for a user interface style change and add our code to update the colors there.

There’s also a launch argument flag, `UITraitCollectionChangeLoggingEnabled`, that can come in handy while debugging. When the flag is enabled, it logs all the details of the `traitCollectionDidChange(_:)` call. An example of a debugger log is shown here:

```
2019-11-18 17:56:25.209407+0530 PSPDFCatalog[66666:442180] [TraitCollectionChange] Sending -traitCollectionDidChange: to <_UIButtonBarButton: 0x7f97e5c20c60; frame = (0 3; 93.5 44); tintColor = <UIDynamicProviderColor: 0x600001013fc0; provider = <__NSGlobalBlock__: 0x10a3b55a0>>; layer = <CALayer: 0x6000010dd7e0>>
	► trait changes: { UserInterfaceStyle: Light → Dark }
	► previous: <UITraitCollection: 0x6000025646c0; UserInterfaceIdiom = Pad, DisplayScale = 2, DisplayGamut = P3, HorizontalSizeClass = Regular, VerticalSizeClass = Regular, UserInterfaceStyle = Light, UserInterfaceLayoutDirection = LTR, ForceTouchCapability = Unavailable, PreferredContentSizeCategory = L, AccessibilityContrast = Normal, UserInterfaceLevel = Base>
	► current: <UITraitCollection: 0x600002564c00; UserInterfaceIdiom = Pad, DisplayScale = 2, DisplayGamut = P3, HorizontalSizeClass = Regular, VerticalSizeClass = Regular, UserInterfaceStyle = Dark, UserInterfaceLayoutDirection = LTR, ForceTouchCapability = Unavailable, PreferredContentSizeCategory = L, AccessibilityContrast = Normal, UserInterfaceLevel = Base>
```

An important thing to keep in mind is that traits can be overridden for a particular view. Say a view in a controller needs to be displayed only in a particular user interface style. While assigning a color to it, make sure to consider the same view’s traits and not the traits of the view controller’s view.

## Backward Compatibility

Almost all of these APIs are available only for iOS 13 and above. Using dynamic colors, especially element colors, is recommended for supporting Dark Mode in an app, but not all of these colors are backward compatible. It gets tedious to add iOS version checks wherever these new APIs are being used, so to counter this, we created a bunch of helper methods and added them in categories of `UIView`, `UIViewController`, and `UIColor`.

For element colors, we created a new category that has all the element colors we use as class properties. These colors return the appropriate dynamic color for iOS 13 and a default static color for earlier versions:

[==

```swift
extension UIColor {
    static let pspdf_systemBackgroundColor: UIColor = {
        if #available(iOS 13, *) {
            return .systemBackground
        } else {
            return .white
        }
    }()

    func pspdf_resolvedColor(with traitCollection: UITraitCollection) -> UIColor {
        if #available(iOS 13, *) {
            return self.resolvedColor(with: traitCollection)
        } else {
            return self
        }
    }
}
```

```objc

@interface UIColor (PSPDFCompatible) @end

#define PSPDFCompatibleColor(dynamicColor, staticColor) \
static UIColor *color; \
static dispatch_once_t onceToken; \
dispatch_once(&onceToken, ^{ \
    if (@available(iOS 13, *)) { \
        color = dynamicColor; \
    } else { \
        color = staticColor; \
    } \
}); \
return color; \

@implementation UIColor (PSPDFCompatible)

+ (UIColor *)pspdf_systemBackgroundColor {
    PSPDFCompatibleColor(UIColor.systemBackgroundColor, UIColor.whiteColor)
}

- (UIColor *)pspdf_resolvedColorWithTraitCollection:(UITraitCollection *)traitcollection {
    if (@available(iOS 13, *)) {
        return [self resolvedColorWithTraitCollection:traitcollection];
    } else {
        return self;
    }
}
```

==]

We came across several places where we had to use static colors in batches, so we ended up adding another method to the `UIView` category. This method takes a block and runs it using the view’s trait collection set as the current trait collection on iOS 13. For iOS 12, the block of code is executed directly.

For cases where colors had to be resolved on trait collection changes in `traitCollectionDidChange(_:)`, if and only if the appearance changed with respect to colors, we added helpers to our Objective-C category on `UIView` and `UIViewController`. (The code snippet of our category for Objective-C and its Swift counterpart can be found below.) The method takes the previous trait collection supplied by `traitCollectionDidChange(_:)` and compares it with the current trait collection. It also takes a block that contains the code for performing the view updates. This block is performed only if there are any color appearance changes on iOS 13, whereas it does nothing at all on iOS 12:

[==

```swift
extension UIView {
    func pspdf_performBlockIfAppearanceChanged(from previousTraits: UITraitCollection?, block: () -> Void) {
        if #available(iOS 13, *) {
            if self.traitCollection.hasDifferentColorAppearance(comparedTo: previousTraits) {
                block()
            }
        }
    }

    func pspdf_performBlockUsingViewTraitCollection(_ block: () -> Void) {
        if #available(iOS 13, *) {
            // Execute the block directly if the traits are the same.
            if (self.traitCollection.containsTraits(in: .current)) {
                block()
            } else {
                self.traitCollection.performAsCurrent {
                    block()
                }
            }
        } else {
            block();
        }
    }
}
```

```objc
@interface UIView (PSPDFAdditions)

- (void)pspdf_performBlockIfAppearanceChangedFrom:(nullable UITraitCollection *)previousTraitCollection block:(NS_NOESCAPE void(^)(void))block;
- (void)pspdf_performBlockUsingViewTraitCollection:(NS_NOESCAPE void(^)(void))block;

@end

@implementation UIView (PSPDFAdditions)

- (void)pspdf_performBlockUsingViewTraitCollection:(NS_NOESCAPE void(^)(void))block {
    if (@available(iOS 13, *)) {
        UITraitCollection *current = UITraitCollection.currentTraitCollection;
        // Execute the block directly if the traits are the same.
        if ([self.traitCollection containsTraitsInCollection:current]) {
            block();
        } else {
            [self.traitCollection performAsCurrentTraitCollection:^{
                block();
            }];
        }
    } else {
        block();
    }
}

- (void)pspdf_performBlockIfAppearanceChangedFrom:(nullable UITraitCollection *)previousTraitCollection block:(NS_NOESCAPE void(^)(void))block {
    if (@available(iOS 13, *)) {
        if ([self.traitCollection hasDifferentColorAppearanceComparedToTraitCollection:previousTraitCollection]) {
            block();
        }
    }
}

@end
```

==]

To make things even easier, you can add a code snippet to Xcode that implements `traitCollectionDidChange(_:)` along with the above helper method:

[==

```swift
override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
    super.traitCollectionDidChange(previousTraitCollection)

    self.pspdf_performBlockIfAppearanceChanged(from: previousTraitCollection) {
        <#statements#>
    }
}
```

```objc
- (void)traitCollectionDidChange:(nullable UITraitCollection *)previousTraitCollection {
    [super traitCollectionDidChange:previousTraitCollection];

    [self pspdf_performBlockIfAppearanceChangedFrom:previousTraitCollection block:^{
        <#statements#>
    }];
}
```

==]

## Conclusion

The APIs for adding support for Dark Mode are convenient and not very difficult to implement. However, it is easy to make mistakes — like forgetting to resolve colors while dealing with the use of static colors — when dealing with low-level APIs. While adopting Dark Mode support for the PSPDFKit for iOS SDK, we ensured that we made use of dynamic colors for all elements so that our SDK played well with all the user customizations and the apps it is bundled with. It was a long process, but it also helped us do away with the views we were no longer using.

[pspdfkit 9 for ios]: https://pspdfkit.com/blog/2019/pspdfkit-ios-9/
[`uiuserinterfacestyle`]: https://developer.apple.com/documentation/uikit/uiuserinterfacestyle
[`uiaccessibilitycontrast`]: https://developer.apple.com/documentation/uikit/uiaccessibilitycontrast
[`uiuserinterfacelevel`]: https://developer.apple.com/documentation/uikit/uiuserinterfacelevel
[`uilegibilityweight`]: https://developer.apple.com/documentation/uikit/uilegibilityweight
[`userinterfacestyle`]: https://developer.apple.com/documentation/uikit/uitraitcollection/1651063-userinterfacestyle
[`uitraitcollection`]: https://developer.apple.com/documentation/uikit/uitraitcollection
[`hasdifferentcolorappearance(comparedto:)`]: https://developer.apple.com/documentation/uikit/uitraitcollection/3238081-hasdifferentcolorappearancecompa
[`currenttraitcollection`]: https://developer.apple.com/documentation/uikit/uitraitcollection/3238080-currenttraitcollection
[element colors]: https://developer.apple.com/documentation/uikit/uicolor/ui_element_colors
[human interface guidelines section on color]: https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/color/
[dynamic provider initializer]: https://developer.apple.com/documentation/uikit/uicolor/3238041-init
[`traitcollectiondidchange(_:)`]: https://developer.apple.com/documentation/uikit/uitraitenvironment/1623516-traitcollectiondidchange
[`uitraitcollection.current`]: https://developer.apple.com/documentation/uikit/uitraitcollection/3238080-current
[named initializer]: https://developer.apple.com/documentation/uikit/uicolor/2877380-init
[`uitraitenvironment`]: https://developer.apple.com/documentation/uikit/UITraitEnvironment
[`traitcollection`]: https://developer.apple.com/documentation/uikit/uitraitenvironment/1623514-traitcollection
