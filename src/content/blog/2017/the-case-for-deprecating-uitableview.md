---
title: The Case for Deprecating UITableView
pubDatetime: 2017-01-19T12:10:00.000Z
description: "Argues why UITableView should be deprecated in favor of UICollectionView for better flexibility and modern iOS development."
tags:
  - iOS
  - Development
source: pspdfkit.com
AIDescription: true
---

`UITableView` is a cornerstone of classical iOS development and one of the oldest classes. It's used in pretty much all iOS apps and has been around since iPhone OS 2.0. So why would we propose deprecating one of the most used classes?

Simple: `UICollectionView`. Added in [iOS 6 (2012)](https://en.wikipedia.org/wiki/IOS_6), it's almost a perfect superset of `UITableView`, yet it can do so much more.

Consider the UI in our free app, [PDF Viewer](https://pdfviewer.io/), which uses `UICollectionView` yet includes a layout similar to a table view:

[![Toggle Between List and Grid View](/assets/img/2017/the-case-for-deprecating-uitableview/toggle-list-grid-view.gif)](https://pdfviewer.io/)

We're not the first ones [to call for its retirement](https://twitter.com/b3ll/status/508745702776659970) and even Apple has figured this out. All one has to do is take a look at some of the new internal classes that appeared in iOS 10: (h/t [@BunuelCuboSoto's tweet](https://twitter.com/BunuelCuboSoto/status/818169193073934337))

- [UICollectionViewTableLayout.h](https://github.com/JaviSoto/iOS10-Runtime-Headers/blob/master/Frameworks/UIKit.framework/UICollectionViewTableLayout.h)
- [UICollectionViewTableLayoutAttributes.h](https://github.com/JaviSoto/iOS10-Runtime-Headers/blob/master/Frameworks/UIKit.framework/UICollectionViewTableLayoutAttributes.h)
- [UICollectionViewTableLayoutInvalidationContext.h](https://github.com/JaviSoto/iOS10-Runtime-Headers/blob/master/Frameworks/UIKit.framework/UICollectionViewTableLayoutInvalidationContext.h)
- [UICollectionViewTableLayoutSwipeAction.h](https://github.com/JaviSoto/iOS10-Runtime-Headers/blob/master/Frameworks/UIKit.framework/UICollectionViewTableLayoutSwipeAction.h)
- [UICollectionViewTableLayoutSwipeActionButton.h](https://github.com/JaviSoto/iOS10-Runtime-Headers/blob/master/Frameworks/UIKit.framework/UICollectionViewTableLayoutSwipeActionButton.h)
- [UICollectionViewTableLayoutSwipeActionPullView.h](https://github.com/JaviSoto/iOS10-Runtime-Headers/blob/master/Frameworks/UIKit.framework/UICollectionViewTableLayoutSwipeActionPullView.h)
- [UICollectionViewTableCell.h](https://github.com/JaviSoto/iOS10-Runtime-Headers/blob/master/Frameworks/UIKit.framework/UICollectionViewTableCell.h)
- [UICollectionViewTableHeaderFooterView.h](https://github.com/JaviSoto/iOS10-Runtime-Headers/blob/master/Frameworks/UIKit.framework/UICollectionViewTableHeaderFooterView.h)
- [UICollectionViewTableSeparatorView.h](https://github.com/JaviSoto/iOS10-Runtime-Headers/blob/master/Frameworks/UIKit.framework/UICollectionViewTableSeparatorView.h)
- [UICollectionViewDelegateTableLayout.h](https://github.com/JaviSoto/iOS10-Runtime-Headers/blob/master/protocols/UICollectionViewDelegateTableLayout.h)

The API even has public and private parts (methods that start with an `_`), so it seems that the UIKit team at one point considered offering this API but it didn't make the cut. When you take a closer look, you'll see that `UICollectionViewTableCell` still uses [`UITableViewCell`][] internally for some features (swipe to delete in this case) so some shortcuts have been made that likely are a reason why this API isn't public yet. Let's hope that this changes with iOS 11. Please duplicate [rdar://30098111](http://openradar.appspot.com/30098111) to vote for this. Even better if you write [your own bug report - see our article for some tips](https://pspdfkit.com/blog/2016/writing-good-bug-reports/).

Parts of that transition already happened. Consider the (sorry) crime that was [`UISearchDisplayController`][] and how it was replaced with sane API ([`UISearchController`][]) in iOS 8. The new API is UI-agnostic and no longer directly ties to a table view, so it can be used with collection views or any custom class as well. (If you still have legacy code [this article](http://useyourloaf.com/blog/updating-to-the-ios-8-search-controller/) is a great resource to understand both API variants and shows how to upgrade your code.)

[`UICollectionView`][] is a masterpiece of flexibility and great API design. Back at WWDC 2012 when Apple previewed iOS 6, we did a rewrite and it took quite some time to even implement a subset of all the features (without animations) - some might remember [`PSTCollectionView`][]. It helped people to adopt collection views faster as it supported back to iOS 4.3 and was very easy to switch to the "real" class by using some [crazy runtime hackery](https://github.com/steipete/PSTCollectionView/blob/master/PSTCollectionView/PSTCollectionView.m#L2210-L2276).

## History

There's a great [episode of the Debug podcast](http://www.imore.com/debug-41-nitin-ganatra-episode-iii-iphone-ipad) where Nitin Ganatra shares a lot about the history of [`UITable`](https://github.com/nst/iOS-Runtime-Headers/blob/c4615346706089e3acbeb1caa51708f575dc9bed/Frameworks/UIKit.framework/UITable.h), [`UIScroller`](https://github.com/nst/iOS-Runtime-Headers/blob/c4615346706089e3acbeb1caa51708f575dc9bed/Frameworks/UIKit.framework/UIScroller.h) and the road from iPhone to iPad. (Link includes a transcript if you prefer to read).

In short, iPhone OS 1.0 was very chaotic and while there were shared frameworks, each team built a lot on their own. Eventually, a table class was centralized as [`UITable`](https://github.com/nst/iOS-Runtime-Headers/blob/c4615346706089e3acbeb1caa51708f575dc9bed/Frameworks/UIKit.framework/UITable.h) and it lived in iOS until it was finally removed in iOS 6 - [the runtime header history](https://github.com/nst/iOS-Runtime-Headers/commits/5766c608eca76222e2d34fe6d37aa1cf91a2246b/Frameworks/UIKit.framework/UITable.h) shows this pretty well.

iPhone OS 2 was a huge cleanup and out of that came [`UITableView`][] - a class that has been [tweaked](https://github.com/nst/iOS-Runtime-Headers/commits/master/Frameworks/UIKit.framework/UITableView.h) in basically every update of iOS, especially with [the grand redesign of iOS 7](http://www.theverge.com/2011/12/13/2612736/ios-history-iphone-ipad).

## API Warts

`UITableView` is old and most of it was written before we had blocks or Auto Layout. It shows. This is how you update a section in `UITableView`:

[==

```swift
tableView.beginUpdates()
tableView.reloadSections(IndexSet(integer: sectionIndex), with: UITableViewRowAnimation.none)
tableView.endUpdates()
```

```objc
[tableView beginUpdates];
[tableView reloadSections:[NSIndexSet indexSetWithIndex:sectionIndex] withRowAnimation:UITableViewRowAnimationNone];
[tableView endUpdates];
```

==]

And this is the same operation but in `UICollectionView`:

[==

```swift
collectionView.performBatchUpdates({
    collectionView.reloadSections(IndexSet(integer: sectionIndex))
}, completion: nil)
```

```objc
[collectionView performBatchUpdates:^{
	[collectionView reloadSections:[NSIndexSet indexSetWithIndex:sectionIndex]];
} completion:nil];
```

==]

This may not look like much, but it is very easy to mess up balancing calls to `beginUpdates` and `endUpdates` in more complex setups, whereas this is impossible with `UICollectionView`'s API. Since this class is so old, there's also a lot of deprecated API that still has to be supported. The Swift view doesn't show header entries that are long deprecated, but if you switch to Objective-C, you'll see the full extend of what's in this cell:

```objc
@interface UITableViewCell (UIDeprecated)

// Frame is ignored.  The size will be specified by the table view width and row height.
- (id)initWithFrame:(CGRect)frame reuseIdentifier:(nullable NSString *)reuseIdentifier NS_DEPRECATED_IOS(2_0, 3_0) __TVOS_PROHIBITED;

// Content properties.  These properties were deprecated in iPhone OS 3.0.  The textLabel and imageView properties above should be used instead.
// For selected attributes, set the highlighted attributes on the textLabel and imageView.
@property (nonatomic, copy, nullable)   NSString *text NS_DEPRECATED_IOS(2_0, 3_0) __TVOS_PROHIBITED;                        // default is nil
@property (nonatomic, strong, nullable) UIFont   *font NS_DEPRECATED_IOS(2_0, 3_0) __TVOS_PROHIBITED;                        // default is nil (Use default font)
@property (nonatomic) NSTextAlignment   textAlignment NS_DEPRECATED_IOS(2_0, 3_0) __TVOS_PROHIBITED;               // default is UITextAlignmentLeft
@property (nonatomic) NSLineBreakMode   lineBreakMode NS_DEPRECATED_IOS(2_0, 3_0) __TVOS_PROHIBITED;               // default is UILineBreakModeTailTruncation
@property (nonatomic, strong, nullable) UIColor  *textColor NS_DEPRECATED_IOS(2_0, 3_0) __TVOS_PROHIBITED;                   // default is nil (text draws black)
@property (nonatomic, strong, nullable) UIColor  *selectedTextColor NS_DEPRECATED_IOS(2_0, 3_0) __TVOS_PROHIBITED;           // default is nil (text draws white)

@property (nonatomic, strong, nullable) UIImage  *image NS_DEPRECATED_IOS(2_0, 3_0) __TVOS_PROHIBITED;                       // default is nil. appears on left next to title.
@property (nonatomic, strong, nullable) UIImage  *selectedImage NS_DEPRECATED_IOS(2_0, 3_0) __TVOS_PROHIBITED;               // default is nil

// Use the new editingAccessoryType and editingAccessoryView instead
@property (nonatomic) BOOL              hidesAccessoryWhenEditing NS_DEPRECATED_IOS(2_0, 3_0) __TVOS_PROHIBITED;   // default is YES

// Use the table view data source method -tableView:commitEditingStyle:forRowAtIndexPath: or the table view delegate method -tableView:accessoryButtonTappedForRowWithIndexPath: instead
@property (nonatomic, assign, nullable) id        target NS_DEPRECATED_IOS(2_0, 3_0) __TVOS_PROHIBITED;                      // target for insert/delete/accessory clicks. default is nil (i.e. go up responder chain). weak reference
@property (nonatomic, nullable) SEL               editAction NS_DEPRECATED_IOS(2_0, 3_0) __TVOS_PROHIBITED;                  // action to call on insert/delete call. set by UITableView
@property (nonatomic, nullable) SEL               accessoryAction NS_DEPRECATED_IOS(2_0, 3_0) __TVOS_PROHIBITED;             // action to call on accessory view clicked. set by UITableView

@end
```

### Auto Layout

Auto Layout is relatively new compared to the existence of `UITableView`. No wonder they don’t work very well together. Apple has done a good job with auto-sizing table view cells and after the first iteration they work pretty well. However, there are still cases where you run into strange layout issues or where things feel a bit off.

One example of this is that you can't use the default table view cell styles in a way that support multiline labels. Before Auto Layout, it wasn't possible to, for example, set the `textLabel`'s `numberOfLines` to `0` and support multi line labels because you weren't able to calculate the correct height of the cell anyway, as you had no knowledge about where the cell would place these labels. Now with Auto Layout and self sizing table view cells, Apple essentially made this process automatic. So it is very tempting to set the `numberOfLines` to `0` and just let the table view calculate the height the cell needs for any given text. This works fine in many cases, however you will eventually run into layout issues as soon as your table view cell is using more than just the `textLabel` and the `detailTextLabel`. Asking Apple engineers why this does not work as we expected in WWDC’16, we got a very simple answer: [`UITableViewCell`][] dates back way before Auto Layout and it simply was never built to work that way. In fact they told us, you shouldn't touch anything on the cell's internal views other than the `text` property of the labels and the `image` property of the image view. This means that you need to subclass [`UITableViewCell`][] for any customization and add your own labels anyway.

Another issue that can happen easily with Auto Layout in table view cells is that you will see messages like `UIViewAlertForUnsatisfiableConstraints` popping up in your console. If you aren't careful when crafting your layout, you may create a cell whose height is off by 0.5pt on retina devices, which is exactly the height of the separator. Usually this happens if you use Auto Layout but calculate the height of the cell yourself. The table view cell tries to make room for one or two separator views (depending on the index path of the cell and the style of the table view) by shrinking its content view. If you are too strict with your layout and don't make it flexible enough to deal with these different heights, the cell can not satisfy all your constraints and ends up with a content view that doesn't work with your layout.

### UITableViewCell does way too much

From what we discussed above, it may already be clear that [`UITableViewCell`][] simply does too much. However, there's more!

A `UITableViewCell` is initialized with a style. Let's take a look what we can set there:

[==

```swift
public enum UITableViewCellStyle : Int {
    case `default` // Simple cell with text label and optional image view (behavior of UITableViewCell in iPhoneOS 2.x)
    case value1 // Left aligned label on left and right aligned label on right with blue text (Used in Settings)
    case value2 // Right aligned label on left with blue text and left aligned label on right (Used in Phone/Contacts)
    case subtitle // Left aligned label on top and left aligned label on bottom with gray text (Used in iPod).
}
```

```objc
typedef NS_ENUM(NSInteger, UITableViewCellStyle) {
    UITableViewCellStyleDefault,	// Simple cell with text label and optional image view (behavior of UITableViewCell in iPhoneOS 2.x)
    UITableViewCellStyleValue1,		// Left aligned label on left and right aligned label on right with blue text (Used in Settings)
    UITableViewCellStyleValue2,		// Right aligned label on left with blue text and left aligned label on right (Used in Phone/Contacts)
    UITableViewCellStyleSubtitle	// Left aligned label on top and left aligned label on bottom with gray text (Used in iPod).
};
```

==]

The labels and image views that are configured by these styles are an all or nothing approach. For example, if you try to use the `textLabel` of [`UITableViewCell`][] but then add a second label on your own, you will most likely run into layout issues. So when subclassing a table view cell you carry these default API around even though you don't use them. Your cell might have its own labels. So when looking at the API, you will see the table view cell's built in labels as well as your own. Which one should you use? This can be confusing.

`UITableViewCellStyle` also doesn't work well with `registerClass:forCellReuseIdentifier:`, which has been around since iOS 6. If you register a standard [`UITableViewCell`][] class with this, the table view will always initialize it with the default style. You can work around this by creating a subclass that overrides `initWithStyle:reuseIdentifier:` in a way that it ignores the passed in style and always passes the style you actually want. But this again is a workaround and feels odd.

And what happens if I set a subtitle with the default style? The reality is that there's too much old logic and if you use [`UITableViewCell`][], your best bet is to add your own views to the `contentView` so you don't need to work around 10 years' worth of custom layout logic.

### Display Sizes and Size Classes

`UITableView` comes from a time where there was exactly one screen size and class of device: The iPhone. But times have changed. If you are building a universal app and want to fit in on all the supported devices, chances are that your table views don't fit very well on the large screen of an iPad.

Lists that only contain a small amount of text so that they are readable on an iPhone feel out of place on an iPad. You see a couple of words on the screen and the rest is just empty, wasted space. While it's true that you probably shouldn't try to get the same information density on a large screen than on a small screen, you still can put a little bit more on a screen of this size than on an iPhone display. Therefore, it often is a good practice to display two, three, or maybe even more columns on an iPad.

This is exactly what `UICollectionView` does. So instead of building a collection view for the iPad and a `UITableView` for the iPhone, it would make much more sense to have the same collection view look like a table view on small devices and show multiple columns on devices with larger screens.

This is exactly what Apple did with the iTunes Connect app and they talked about it at [WWDC’14 Session 232 - Advanced User Interfaces with Collection Views](https://developer.apple.com/videos/play/wwdc2014/232/). They did exactly what we are proposing here: Dropped `UITableView` and replaced it with a `UICollectionViewLayout` subclass that looks like a table view. The best thing about this is: They moved a big part of the layout into the sample code, so this might be a good starting point if you want to move your table views over to collection views.

### Data Sources

As we already discovered, there are many cases where you want the look of a table view on devices with a compact horizontal size class but the look of a multi-column collection view on devices with a regular horizontal size class. If you want to do this with today's API, this also means that you need two implementations of the data source and two implementations of the delegate. One of each for [`UITableView`][] and [`UICollectionView`][].

One workaround is to write an adapter for one or maybe even both of them, but it would be much easier if there was a system-wide layout available for `UICollectionView` that makes it look like a table view. You would no longer need to duplicate your code or write adapters to make your app feel at home on both size classes.

## Over there in Android-Land

The situation on Android is very similar. Since its first version, the Android framework contained [ListView](https://developer.android.com/guide/topics/ui/layout/listview) for showing items similar to `UITableView`. With the 2014 release of [Android 5.0 Lollipop](https://en.wikipedia.org/wiki/Android_Lollipop) Google published a successor, the [RecyclerView](https://developer.android.com/reference/android/support/v7/widget/RecyclerView.html). `RecyclerView` ships in the [Android Support Library](https://developer.android.com/topic/libraries/support-library/index.html), which means it can be used on all Android versions back to Android 2.1 Eclair (2010). `RecyclerView` also replaces other adapter based views, like [GridView](https://developer.android.com/guide/topics/ui/layout/gridview.html) and allows other layouts too (for example staggered grid, etc).

Google is more explicit about soft-deprecating `ListView`; just read the first sentence in their documentation:

> The RecyclerView widget is a more advanced and flexible version of ListView.

While for some legacy features there is no default implementation, which requires developers [to write more boilerplate code](http://stackoverflow.com/questions/24618829/how-to-add-dividers-and-spaces-between-items-in-recyclerview) to migrate their old code, in general `RecyclerView` provides much better performance and flexibility, and is thus the way to go.

## Conclusion

There's no need to manically replace all your table views with collection views, but it's time for Apple to offer API to allow collection views to be used like table views, so we all can make better apps with less code that are more flexible in this multi-size screen world. At [PSPDFKit](https://pspdfkit.com) we try hard to structure our API just like Apple would, so we'll keep most of our table views for now, but we'd be the first to adopt the new layout once it becomes available. Please vote by [writing a Radar](https://pspdfkit.com/blog/2016/writing-good-bug-reports/)) if you feel that unifying this is a good idea. [Ping us on Twitter](https://twitter.com/steipete) if you have further ideas or want to start an open source project to build this yourself.

[`UITableView`]: https://developer.apple.com/reference/uikit/uitableview
[`UITableViewCell`]: https://developer.apple.com/reference/uikit/uitableviewcell
[`UICollectionView`]: https://developer.apple.com/reference/uikit/uicollectionview
[`PSTCollectionView`]: https://github.com/steipete/PSTCollectionView
[`UISearchDisplayController`]: https://developer.apple.com/reference/uikit/uisearchdisplaycontroller
[`UISearchController`]: https://developer.apple.com/reference/uikit/uisearchcontroller
