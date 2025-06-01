---
title: "UIAppearance for Custom Views"
pubDatetime: 2013-02-12T14:31:00.000Z
description: "Learn how to properly implement UIAppearance in custom views, including important gotchas about setter tracking and initialization patterns."
tags:
  - iOS
  - UIKit
  - styling
  - UIAppearance
source: petersteinberger.com
AIDescription: true
---

UIAppearance is hardly a new technology, since it was first introduced at WWDC 2011, but it still doesn't have the adoption it deserves (guilty as charged here as well). Since most apps are IOS 5 only now, there's no excuse anymore to not adopt it. Also, chances are quite high that at least some properties of your classes already support UIAppearance implicitly, since the preprocessor macro to 'enable' UIAppearance is actually defined to be empty:

{% blockquote %}
#define UI_APPEARANCE_SELECTOR
{% endblockquote %}

In the simplest case, add UI_APPEARANCE_SELECTOR to your properties to _inform others_ that this property can be set via an UIAppearance proxy. There are, however, some gotchas that are not clearly mentioned in the documentation, and it's always interesting how something like this works behind the scenes. (This is not a tutorial -- go ahead and read [Apple's documentation on UIAppearance](http://developer.apple.com/library/ios/#documentation/uikit/reference/UIAppearance_Protocol/Reference/Reference.html) if you've never used it before.)

From looking at the debugger, UIAppearance is quite smart and only applies properties before the view is added to a window:

{% img /images/posts/UIAppearance-setter.png %}

UIAppearance is mostly for UIView subclasses, with some exceptions like UIBarItem (and UIBarButtonItem), which internally handle their respective views. For those classes, Apple implemented [a custom appearance proxy (\_UIBarItemAppearance)](https://github.com/nst/iOS-Runtime-Headers/blob/master/Frameworks/UIKit.framework/_UIBarItemAppearance.h).

When a custom appearance is set, [\_UIAppearanceRecorder](https://github.com/nst/iOS-Runtime-Headers/blob/master/Frameworks/UIKit.framework/_UIAppearanceRecorder.h) will track the customizations. There are also certain optimized appearance storage classes like [(\_UISegmentedControlAppearanceStorage)](https://github.com/nst/iOS-Runtime-Headers/blob/master/Frameworks/UIKit.framework/_UISegmentedControlAppearanceStorage.h) for UISegmentedControl or [\_UINavigationBarAppearanceStorage](https://github.com/nst/iOS-Runtime-Headers/blob/master/Frameworks/UIKit.framework/_UINavigationBarAppearanceStorage.h) for UINavigationBar.

Let's start with a simple example, converting this class [(taken from my iOS PDF SDK)](http://pspdfkit.com/) to work with UIAppearance:

```objective-c
/// Simple rounded label.
@interface PSPDFRoundedLabel : UILabel
/// Corner radius. Defaults to 10.
@property (nonatomic, assign) CGFloat cornerRadius;
/// Label background. Defaults to [UIColor colorWithWhite:0.f alpha:0.6f]
@property (nonatomic, strong) UIColor *rectColor;
@end

@implementation PSPDFRoundedLabel
- (id)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.rectColor = [UIColor colorWithWhite:0.f alpha:0.6f];
        self.cornerRadius = 10.f;
    }
    return self;
}
- (void)setBackgroundColor:(UIColor *)color {
    [super setBackgroundColor:[UIColor clearColor]];
    self.rectColor = color;
}
// drawRect is trivial
@end
```

Simply adding UI_APPEARANCE_SELECTOR will not work here. One gotcha is that UIAppearance swizzles all setters that have a default apperance, and tracks when they get changed, so that UIAppearance doesn't override your customizations. This is a problem here, since we use setters in the initializer, and for UIAppearance it now looks as though we already customized the class ourselves.
**Lesson: Only use direct ivar access in the initializer for properties that comply to UI_APPEARANCE_SELECTOR**:

```objective-c
/// Simple rounded label.
@interface PSPDFRoundedLabel : UILabel
/// Corner radius. Defaults to 10.
@property (nonatomic, assign) CGFloat cornerRadius UI_APPEARANCE_SELECTOR;
/// Label background. Defaults to [UIColor colorWithWhite:0.f alpha:0.6f]
@property (nonatomic, strong) UIColor *rectColor UI_APPEARANCE_SELECTOR;
@end

@implementation PSPDFRoundedLabel {
    BOOL _isInitializing;
}
- (id)initWithFrame:(CGRect)frame {
    _isInitializing = YES;
    if (self = [super initWithFrame:frame]) {
        _rectColor = [UIColor colorWithWhite:0.f alpha:0.6f];
        _cornerRadius = 10.f;
    }
    _isInitializing = NO;
    return self;
}
- (void)setBackgroundColor:(UIColor *)color {
    [super setBackgroundColor:[UIColor clearColor]];
    // Check needed for UIAppearance to work (since UILabel uses setters in init)
    if (!_isInitializing) self.rectColor = color;
}
// drawRect is trivial
@end
```

This class now fully works with UIAppearance. Notice that we had to do some ugly state checking (\_isInitializing), because UILabel internally calls self.backgroundColor = [UIColor whiteColor] in the init, which then calls the setRectColor, which would already could as "changed" for UIAppearance. Notice the **TaggingApperanceGeneralSetterIMP** that Apple uses to track any change to the setter:

{% img /images/posts/UIAppearance-TaggingApperanceGeneralSetterIMP.png %}

I'm using the following code to test the customizations:

{% blockquote %}
[[PSPDFRoundedLabel appearanceWhenContainedIn:[PSCThumbnailGridViewCell class], nil] setRectColor:[UIColor colorWithRed:0.165 green:0.226 blue:0.650 alpha:0.800]];
[[PSPDFRoundedLabel appearanceWhenContainedIn:[PSCThumbnailGridViewCell class], nil] setCornerRadius:2];
{% endblockquote %}

We can also use the runtime at any point to query what appearance settings there are for any given class. This is only meant to be used within the debugger, since it uses private API to query [\_UIAppearance](https://github.com/nst/iOS-Runtime-Headers/blob/2d1452d163050ef211efed237de1ea132823fc8c/Frameworks/UIKit.framework/_UIAppearance.h):

{% blockquote %}
po [[NSClassFromString(@"_UIAppearance") _appearanceForClass:[PSPDFRoundedLabel class] withContainerList:@[[PSCThumbnailGridViewCell class]]] valueForKey:@"\_appearanceInvocations"]
$0 = 0x0bd08cc0 <\_\_NSArrayM 0xbd08cc0>(
&lt;NSInvocation: 0xbd08a60&gt;
return value: {v} void
target: {@} 0x0
selector: {:} \_UIAppearance_setRectColor:
argument 2: {@} 0xbd08210
,
&lt;NSInvocation: 0xbd09100&gt;
return value: {v} void
target: {@} 0x0
selector: {:} \_UIAppearance_setCornerRadius:
argument 2: {f} 0.000000
)
{% endblockquote %}

That's it! The class is fully compatible with UIAppearance. When using this inside a framework, you should write custom UIAppearance rules instead of manually setting the property, to allow to override those rules from the outside (remember, manually setting a property will disable it for apperance usage). +load is a good time for that. There are some more gotchas on UIAppearance, like BOOL not being supported (use NSInteger instead), and some honorable exceptions that do support appearance selectors, like [DACircularProgress](https://github.com/danielamitay/DACircularProgress/commit/f5fbf993b432eeedd3d8110f346361b33cf6482f).

Update: As of iOS 8, BOOL is now supported for UIAppearance.
