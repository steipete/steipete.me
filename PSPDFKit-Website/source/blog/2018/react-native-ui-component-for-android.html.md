---
title: "React Native UI Component for Android"
description: "Introducing Android support for our native UI component for showing PDFs in a React Native app with PSPDFKit."
preview_image: /images/blog/2018/react-native-ui-component-for-android/article-header.png
section: blog
author:
  - Reinhard Hafenscher
date: 2018-03-06 12:00 UTC
tags: Android, Development, React Native
published: true
---

Last week we announced that our PSPDFKit [React Native wrapper] now comes with a [native UI component] for iOS. Today we are happy to share that we now support this on Android as well. READMORE We already talked about how our new component works in our [original announcement blog post], so here we will focus on some of the Android-specific challenges we faced.

## The Default `ReactActivity`

The very first issue we ran into was that, by default, your React Native app will use a `ReactActivity` to host your application. This posed a problem when trying to integrate our `PdfFragment`, since it requires the hosting activity to extend from `FragmentActivity`. As a workaround, we provide a `ReactFragmentActivity`, which works as a drop-in replacement for the `ReactActivity`. If your app is using [`react-native-navigation`], everything will simply work, since `react-native-navigation` comes with `Activity` subclasses that extend from `AppCompatActivity`.

## Integrating a Fragment into the View Hierarchy

With that out of the way, it was time to actually integrate the `PdfFragment`, which, as it turns out, is simpler than we thought. Our `PdfView` uses the `FragmentManager` provided by the hosting `Activity` to add a `PdfFragment`, thereby attaching the view to itself.

The only issue we ran into here was that when the configuration changes, the entire view hierarchy is recreated. This causes a crash, because the `FragmentManager` will try to reattach the `Fragment` to a view with the ID we used when adding it. But it can’t do this, because React Native will not have created those views yet. The way we solved this is by **requiring** you to specify a unique `fragmentTag` when adding a `PSPDFKitView` to your React component.

Our `PdfView` also contains many supplemental views — such as our `PdfThumbnailBar` — that aren’t contained in the `PdfFragment`. With all the views correctly attached, we ran into our next issue.

## The React Native Layout System

React Native provides its own layout engine. In order for this to work, the `ReactRootView` actually swallows all layout events that are dispatched by the Android system. This works perfectly as long as all your layouts are created using React Native. However, where this breaks down is when your native UI component contains subviews that require their own layout.

![viewHierarchy](/images/blog/2018/react-native-ui-component-for-android/view-hierarchy.png)

As you can see above, there are quite a few subviews in our `PdfView` that need the layout events dispatched by Android. There is already an [issue][react native issue] for this in the React Native repo, but since we don’t know when a proper fix may be ready, we decided to ship this with our own makeshift workaround inside our `PdfView`. What our workaround does — regardless of if it’s necessary or not — is re-layout all children of the `PdfView` on every frame. That looks something like this:

```java
Choreographer.getInstance().postFrameCallback(new Choreographer.FrameCallback() {
    @Override
    public void doFrame(long frameTimeNanos) {
        for (int i = 0; i < getChildCount(); i++) {
            View child = getChildAt(i);
            child.measure(MeasureSpec.makeMeasureSpec(getMeasuredWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getMeasuredHeight(), MeasureSpec.EXACTLY));
            child.layout(0, 0, child.getMeasuredWidth(), child.getMeasuredHeight());
        }
        getViewTreeObserver().dispatchOnGlobalLayout();
    }
    Choreographer.getInstance().postFrameCallback(this);
});
```
**ℹ️ Note:** This may cause your app to misbehave or performance to degrade, so use it at your own risk.

## PSPDFKit

The final issue we encountered was the way our own framework is structured internally. Our native module’s `present` method uses a `PdfActivity` to present your PDFs. The `PdfActivity` contains a `PdfFragment` responsible for rendering the document, as well as a bunch of supplemental views that provide access to different features such as the table of contents.

What this means is that our native UI component would actually need to reimplement all of the features our `PdfActivity` already provides. Since that isn’t feasible at this time, we decided to expose a minimal API required to access the basic functionality of our `PdfFragment` — namely displaying and annotating documents.

Since our `PSPDFKitView` component doesn’t provide its own UI, we expose an `enterAnnotationCreationMode` function that allows you to start the annotation creation mode from your React UI. Here’s an example of how to use this:

```javascript
<PSPDFKitView
  ref="pdfView"
  document="file:///android_asset/Annual Report.pdf"
  pageIndex={4}
  fragmentTag="PDF1"
  onStateChanged={event => {
    this.setState({
      currentPageIndex: event.currentPageIndex,
      pageCount: event.pageCount,
      annotationCreationActive: event.annotationCreationActive,
    });
  }}
  style={{ flex: 1}}
/>
<Button
  onPress={() => {
    if (this.state.annotationCreationActive) {
      this.refs.pdfView.exitCurrentlyActiveMode();
    } else {
      this.refs.pdfView.enterAnnotationCreationMode();
    }
  }}
  title={this.state.annotationCreationActive ? "Exit" : "Create Annotations"}
/>
```
**ℹ️ Note:** You can find all provided methods in the [documentation for `PSPDFKitView`][PSPDFKitView source code].

You can find example usages of this and all the other things we talked about in our [Catalog][React Native Catalog].

## Conclusion

While there is still a lot of work to do on our native UI component, we now have a basic version you can start using today. If you come across anything missing from the UI component that you think would be useful to have, feel free to [contact us][Support] or [open an issue][RN wrapper issues] in the PSPDFKit React Native repository. You are also very welcome to submit [pull requests][RN wrapper Pull Request] to help improve our wrapper, as all of it is open source.

[original announcement blog post]: https://pspdfkit.com/blog/2018/react-native-ui-component-for-ios/
[how to use the `PSPDFKitView`]: https://pspdfkit.com/blog/2018/react-native-ui-component-for-ios/#usage
[React Native wrapper]: https://github.com/PSPDFKit/react-native
[native module]: https://facebook.github.io/react-native/docs/native-modules-android.html
[native UI component]: https://facebook.github.io/react-native/docs/native-components-android.html
[PSPDFKitView source code]: https://github.com/PSPDFKit/react-native/blob/master/index.js
[React Native Catalog]: https://github.com/PSPDFKit/react-native/blob/master/samples/Catalog/Catalog.android.js
[`react-native-navigation`]: https://github.com/wix/react-native-navigation
[Support]: /support/request
[RN wrapper issues]: https://github.com/PSPDFKit/react-native/issues
[RN wrapper Pull Request]: https://github.com/PSPDFKit/react-native/pulls
[`ViewManager`]: https://github.com/facebook/react-native/blob/master/ReactAndroid/src/main/java/com/facebook/react/uimanager/ViewManager.java
[react native issue]: https://github.com/facebook/react-native/issues/17968
