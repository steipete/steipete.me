---
title: "How to Bridge Native iOS Code to React Native"
description: "A video tutorial about how to bridge native iOS code to React Native."
preview_image: /images/blog/2020/how-to-bridge-native-ios-code-to-react-native/article-header.png
section: blog
author:
  - Rad Azzouz
author_url:
  - https://twitter.com/radazzouz
date: 2020-01-29 9:00 UTC
tags: iOS, Development, React Native, Objective-C
published: true
secret: false
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/wxSjapPfhnw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Our [React Native plugin][react native repo] exposes a lot of JavaScript APIs, making the implementation of most use cases for PSPDFKit a breeze. However, sometimes there are certain iOS APIs that are difficult to port to React Native, mainly because of the design pattern, paradigm, and philosophy differences between iOS and React Native development.

In this tutorial, we’ll discuss how to implement a complex use case in a React Native project by bridging native Objective-C code.
READMORE

## Why Bridge Native Code?

In our [React Native wrapper][react native repo], we expose the [`PSPDFKitView`][] object, which is the main native UI component and which uses an iOS view controller under the hood. In [`PSPDFKitView`][], we abstract away a lot of the internal functionality and APIs of the underlying [`PSPDFViewController`][] to offer a better React Native JavaScript API.

Where some use cases are concerned, it is a lot easier and more efficient to just implement them directly in Objective-C rather than exposing them as new JavaScript APIs. If you wish to learn more about how to extend React Native APIs, please take a look at our [blog post here][how-to-extend-for-ios blog post].

## Prerequisites

I’ll be assuming that you are familiar with React Native and that you already have [integrated PSPDFKit into your app][getting-started guide]. Otherwise, you can use our [Catalog sample project][rn catalog app] from our React Native plugin open source repository.

## The Use Case

In this tutorial, we will be adding a custom button to the annotation toolbar, and this button will remove all annotations from the current document. In the video below, you can see it in action.

<video src="/images/blog/2020/how-to-bridge-native-ios-code-to-react-native/custom-toolbar.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

So let’s get started!

## Step 1: Get the Objective-C Sample Code

The native [PSPDFCatalog][pspdfcatalog] app comes with a lot of runnable Objective-C examples. Our Catalog sample project can be found in the `Examples` directory of the PSPDFKit DMG download, which is where you will find the Objective-C sample code from `PSCAnnotationToolbarButtonsExample.m` that we will bridge over to our React Native app.

![find-objc-catalog-example-xcode](/images/blog/2020/how-to-bridge-native-ios-code-to-react-native/find-objc-catalog-example-xcode.png)

If you’re an existing customer, download PSPDFKit for iOS from the [customer portal][]. Otherwise, if you don’t already have PSPDFKit, [sign up for our 60-day trial][trial] and you will receive an email with the download instructions.

## Step 2: Modify the Objective-C Code in the React Native Plugin

For our use case, we will only modify the [`RCTPSPDFKitView.m`][rctpspdfkitview.m master] class, which is the Objective-C representation of our React Native UI component, [`PSPDFKitView`][].

![find-objc-catalog-example-xcode](/images/blog/2020/how-to-bridge-native-ios-code-to-react-native/find-rn-pspdfkit-view-xcode.png)

First, we copy the custom annotation toolbar’s interface at the top of [`RCTPSPDFKitView.m`][rctpspdfkitview.m master]:

```objc
// Custom annotation toolbar subclass that adds a Clear button that removes all visible annotations.
@interface CustomButtonAnnotationToolbar : PSPDFAnnotationToolbar

@property (nonatomic) PSPDFToolbarButton *clearAnnotationsButton;

@end
```

Then, we copy the custom annotation toolbar’s implementation at the bottom of [`RCTPSPDFKitView.m`][rctpspdfkitview.m master]:

```objc
@implementation CustomButtonAnnotationToolbar

///////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Lifecycle

- (instancetype)initWithAnnotationStateManager:(PSPDFAnnotationStateManager *)annotationStateManager {
  if ((self = [super initWithAnnotationStateManager:annotationStateManager])) {
    // The biggest challenge here isn't the Clear button, but rather correctly updating the Clear button's states.
    NSNotificationCenter *dnc = NSNotificationCenter.defaultCenter;
    [dnc addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationChangedNotification object:nil];
    [dnc addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationsAddedNotification object:nil];
    [dnc addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationsRemovedNotification object:nil];

    // We could also use the delegate, but this is cleaner.
    [dnc addObserver:self selector:@selector(willShowSpreadViewNotification:) name:PSPDFDocumentViewControllerWillBeginDisplayingSpreadViewNotification object:nil];

    // Add Clear button.
    UIImage *clearImage = [[PSPDFKitGlobal imageNamed:@"trash"] imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
    _clearAnnotationsButton = [PSPDFToolbarButton new];
    _clearAnnotationsButton.accessibilityLabel = @"Clear";
    [_clearAnnotationsButton setImage:clearImage];
    [_clearAnnotationsButton addTarget:self action:@selector(clearButtonPressed:) forControlEvents:UIControlEventTouchUpInside];

    [self updateClearAnnotationButton];
    self.additionalButtons = @[_clearAnnotationsButton];

    // Hide the callout and the signature buttons from the annotation toolbar.
    NSMutableArray <PSPDFAnnotationToolbarConfiguration *> *toolbarConfigurations = [NSMutableArray<PSPDFAnnotationToolbarConfiguration *> new];;
    for(PSPDFAnnotationToolbarConfiguration *toolbarConfiguration in self.configurations) {
      NSMutableArray<PSPDFAnnotationGroup *> *filteredGroups = [NSMutableArray<PSPDFAnnotationGroup *> new];
      for (PSPDFAnnotationGroup *group in toolbarConfiguration.annotationGroups) {
        NSMutableArray<PSPDFAnnotationGroupItem *> *filteredItems = [NSMutableArray<PSPDFAnnotationGroupItem *> new];
        for(PSPDFAnnotationGroupItem *item in group.items) {
          BOOL isCallout = [item.variant isEqualToString:PSPDFAnnotationVariantStringFreeTextCallout];
          BOOL isSignature = [item.type isEqualToString:PSPDFAnnotationStringSignature];
          if (!isCallout && !isSignature) {
            [filteredItems addObject:item];
          }
        }
        if (filteredItems.count) {
          [filteredGroups addObject:[PSPDFAnnotationGroup groupWithItems:filteredItems]];
        }
      }
      [toolbarConfigurations addObject:[[PSPDFAnnotationToolbarConfiguration alloc] initWithAnnotationGroups:filteredGroups]];
    }

    self.configurations = [toolbarConfigurations copy];
  }
  return self;
}

- (void)dealloc {
  [NSNotificationCenter.defaultCenter removeObserver:self];
}

///////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Clear Button Action

- (void)clearButtonPressed:(id)sender {
  // Iterate over all visible pages and remove everything but links and widgets (forms).
  PSPDFViewController *pdfController = self.annotationStateManager.pdfController;
  PSPDFDocument *document = pdfController.document;
  for (PSPDFPageView *pageView in pdfController.visiblePageViews) {
    NSArray<PSPDFAnnotation *> *annotations = [document annotationsForPageAtIndex:pageView.pageIndex type:PSPDFAnnotationTypeAll & ~(PSPDFAnnotationTypeLink | PSPDFAnnotationTypeWidget)];
    [document removeAnnotations:annotations options:nil];

    // Remove any annotation on the page as well (updates views).
    // Alternatively, you can call `reloadData` on the `pdfController` as well.
    for (PSPDFAnnotation *annotation in annotations) {
      [pageView removeAnnotation:annotation options:nil animated:YES];
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Notifications

// If we detect annotation changes, schedule a reload.
- (void)annotationChangedNotification:(NSNotification *)notification {
  // Reevaluate toolbar button
  if (self.window) {
    [self updateClearAnnotationButton];
  }
}

- (void)willShowSpreadViewNotification:(NSNotification *)notification {
  [self updateClearAnnotationButton];
}

///////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - PSPDFAnnotationStateManagerDelegate

- (void)annotationStateManager:(PSPDFAnnotationStateManager *)manager didChangeUndoState:(BOOL)undoEnabled redoState:(BOOL)redoEnabled {
  [super annotationStateManager:manager didChangeUndoState:undoEnabled redoState:redoEnabled];
  [self updateClearAnnotationButton];
}

///////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Private

- (void)updateClearAnnotationButton {
  __block BOOL annotationsFound = NO;
  PSPDFViewController *pdfController = self.annotationStateManager.pdfController;
  [pdfController.visiblePageIndexes enumerateIndexesUsingBlock:^(NSUInteger pageIndex, BOOL *stop) {
    NSArray<PSPDFAnnotation *> *annotations = [pdfController.document annotationsForPageAtIndex:pageIndex type:PSPDFAnnotationTypeAll & ~(PSPDFAnnotationTypeLink | PSPDFAnnotationTypeWidget)];
    if (annotations.count > 0) {
      annotationsFound = YES;
      *stop = YES;
    }
  }];
  self.clearAnnotationsButton.enabled = annotationsFound;
}

@end
```

And finally, we override the annotation toolbar’s class. This is the step where we tell PSPDFKit to use our custom annotation toolbar instead of the default one by updating [`PSPDFViewController`][]’s configuration:

```objc
- (instancetype)initWithFrame:(CGRect)frame {
  if ((self = [super initWithFrame:frame])) {
    // Set configuration to use the custom annotation toolbar when initializing the `PSPDFViewController`.
    // For more details, see `PSCCustomizeAnnotationToolbarExample.m` from PSPDFCatalog and our documentation here: https://pspdfkit.com/guides/ios/current/customizing-the-interface/customize-the-annotation-toolbar/
    _pdfController = [[PSPDFViewController alloc] initWithDocument:nil configuration:[PSPDFConfiguration configurationWithBuilder:^(PSPDFConfigurationBuilder *builder) {
      [builder overrideClass:PSPDFAnnotationToolbar.class withClass:CustomButtonAnnotationToolbar.class];
    }]];

    _pdfController.delegate = self;
    _pdfController.annotationToolbarController.delegate = self;
    _closeButton = [[UIBarButtonItem alloc] initWithImage:[PSPDFKitGlobal imageNamed:@"x"] style:UIBarButtonItemStylePlain target:self action:@selector(closeButtonPressed:)];

    [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationChangedNotification object:nil];
    [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationsAddedNotification object:nil];
    [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationsRemovedNotification object:nil];
  }

  return self;
}
```

That’s all! The custom delete button is now part of the annotation toolbar of our React Native app!

<video src="/images/blog/2020/how-to-bridge-native-ios-code-to-react-native/custom-toolbar-in-native-code.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

You can find the modified version of [`RCTPSPDFKitView.m` here][rctpspdfkitview.m customize-the-toolbar-in-native-code] and you can also check out the [customize-the-toolbar-in-native-code branch][] and run the Catalog example on your device.

## Conclusion

This post covered how to bridge native iOS code to React Native. I hope that this tutorial will help you bridge Objective-C code to React Native so you can implement more complex use cases in your app.

[react native repo]: https://github.com/PSPDFKit/react-native
[`pspdfkitview`]: https://github.com/PSPDFKit/react-native/blob/05b137e2875c5916154163c10b02b39c1adf3593/index.js#L19
[`pspdfviewcontroller`]: https://pspdfkit.com/api/ios/Classes/PSPDFViewController.html
[how-to-extend-for-ios blog post]: https://pspdfkit.com/blog/2018/how-to-extend-react-native-api/
[getting-started guide]: https://github.com/PSPDFKit/react-native#getting-started
[rn catalog app]: https://github.com/PSPDFKit/react-native#running-catalog-project
[pspdfcatalog]: /guides/ios/current/getting-started/example-projects/#pspdfcatalog
[customer portal]: https://customers.pspdfkit.com/
[trial]: https://pspdfkit.com/try/
[rctpspdfkitview.m master]: https://github.com/PSPDFKit/react-native/blob/master/ios/RCTPSPDFKit/RCTPSPDFKitView.m
[rctpspdfkitview.m customize-the-toolbar-in-native-code]: https://github.com/PSPDFKit/react-native/blob/customize-the-toolbar-in-native-code/ios/RCTPSPDFKit/RCTPSPDFKitView.m
[customize-the-toolbar-in-native-code branch]: https://github.com/PSPDFKit/react-native/tree/customize-the-toolbar-in-native-code
