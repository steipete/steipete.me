---
title: "How to Extend React Native APIs"
description: "A tutorial about how to expose native iOS APIs to React Native."
preview_image: /images/blog/2018/how-to-extend-react-native-api/article-header.png
preview_video: /images/blog/2018/how-to-extend-react-native-api/article-video.mp4
section: blog
author:
  - Rad Azzouz
author_url:
  - https://twitter.com/radazzouz
date: 2018-08-28 12:00 UTC
tags: iOS, Development, React Native
published: true
secret: false
---

We recently introduced the [React Native UI Component for iOS][react native ui component for ios blog post], along with one for [Android][react native ui component for android blog post], and today we are excited to announce that we have further extended the APIs of our React Native wrapper and added new [Catalog examples][react native catalog]. In [version 1.20.0][react native changelog] of our React Native wrapper, we added many new features like manual saving, the ability to programmatically manipulate annotations and forms, and so much more! The building blocks of these [newly added features][react native changelog] are React Native [props][react native props], [events][react native events], and functions.

<video src="/images/blog/2018/how-to-extend-react-native-api/programmatic-form-filling-example.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

In our native SDKs, we expose a lot of APIs for full customization, but we only use a subset of those APIs in our [React Native wrapper]. In this article, we will show you how to bring native iOS APIs to React Native, in order to make it easier for everyone to contribute to our [open source repository][react native wrapper] or to expose native iOS code to React Native in general.

So let’s get started!

ℹ️ **Note:** If you’re looking into extending our Android SDK API to React Native, please take a look at our [Advanced Techniques for React Native UI Components][advanced techniques for react native ui components blog post] blog post.

### Props

[Props][react native props] are parameters that allow you to customize your UI components. In the example below, we’ve added the `disableAutomaticSaving` prop, which allows you disable automatic saving for the presented document.

First, we define the prop in `index.js`, which is where `PSPDFKitView`, our React Native UI component, is defined:

```javascript
// index.js
class PSPDFKitView extends React.Component {
  render() {
    return <RCTPSPDFKitView ref="pdfView" {...this.props} />;
  }
}

PSPDFKitView.propTypes = {
  /**
   * Controls whether or not the document will be automatically saved.
   * Defaults to automatically saving (false).
   *
   * @platform ios
   */
  disableAutomaticSaving: PropTypes.bool
};
```

We then expose the prop as an Objective-C Boolean property, like so:

```objc
// RCTPSPDFKitView.h
@interface RCTPSPDFKitView: UIView

@property (nonatomic) BOOL disableAutomaticSaving;

@end
```

Then, we use it in our Objective-C logic. In this case, we use it in [`pdfViewController:shouldSaveDocument:withOptions:`][], which is a delegate method that should return `true` when autosave is enabled and `false` when it is not:

```objc
// RCTPSPDFKitView.m
@implementation RCTPSPDFKitView

#pragma mark - PSPDFViewControllerDelegate

- (BOOL)pdfViewController:(PSPDFViewController *)pdfController shouldSaveDocument:(nonnull PSPDFDocument *)document withOptions:(NSDictionary<PSPDFDocumentSaveOption,id> *__autoreleasing  _Nonnull * _Nonnull)options {
  return !self.disableAutomaticSaving;
}
@end
```

To expose the Objective-C property to React Native (make it available in JavaScript), we use the `RCT_EXPORT_VIEW_PROPERTY` macro, like this:

```objc
// RCTPSPDFKitViewManager.m
@implementation RCTPSPDFKitViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(disableAutomaticSaving, BOOL)

@end
```

Once you’ve completed the above, this is how to use the newly added prop in your JavaScript code:

```javascript
// Catalog.ios.js

class ManualSave extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <PSPDFKitView
          ref="pdfView"
          document="PDFs/Annual Report.pdf"
          disableAutomaticSaving={true}
        />
      </View>
    );
  }
}
```

**Note:** For details, take a look at the official [React Native properties][] documentation.

## Events

Events, or callbacks, allow you to get notified in JavaScript when something occurs in native Objective-C code. Take a look at the [official documentation][react native events] for more information about [React Native events][].

Events should be prefixed with “on,” so in our case, we’ve implemented `onDocumentSaved`, which is called when the document is saved. In PSPDFKit for iOS, we have [`pdfDocumentDidSave:`][], which is a delegate called every time the document is saved.

Since we want to be notified in JavaScript when a PDF is saved, we define the new event in `index.js` similarly to how we did it with the prop before, like so:

```javascript
// index.js
class PSPDFKitView extends React.Component {
  render() {
    return (
      <RCTPSPDFKitView
        ref="pdfView"
        {...this.props}
        onDocumentSaved={this._onDocumentSaved}
      />
    );
  }

  _onDocumentSaved = event => {
    if (this.props.onDocumentSaved) {
      this.props.onDocumentSaved(event.nativeEvent);
    }
  };
}
```

In Objective-C, in `RCTPSPDFKitView.h` and `RCTPSPDFKitViewManager.m`, we expose the event as a view property (`RCT_EXPORT_VIEW_PROPERTY`) of type `RCTBubblingEventBlock`:

```objc
// RCTPSPDFKitView.h
@interface RCTPSPDFKitView: UIView

@property (nonatomic, copy) RCTBubblingEventBlock onDocumentSaved;

@end
```

```objc
// RCTPSPDFKitViewManager.m
@implementation RCTPSPDFKitViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(onDocumentSaved, RCTBubblingEventBlock)

@end
```

Then we set the document’s delegate when the new document is created:

```objc
// RCTPSPDFKitViewManager.m
@implementation RCTPSPDFKitViewManager

RCT_EXPORT_MODULE()

RCT_CUSTOM_VIEW_PROPERTY(document, pdfController.document, RCTPSPDFKitView) {
  if (json) {
    view.pdfController.document = [RCTConvert PSPDFDocument:json];
    // Set the delegate of the newly created document.
    view.pdfController.document.delegate = (id<PSPDFDocumentDelegate>)view;

    //...
}

@end
```

Now, in `RCTPSPDFKitView.m`, we implement [`pdfDocumentDidSave:`][] by invoking `self.onDocumentSaved(@{})` with its return payload. In this case, the event will return an empty dictionary:

```objc
// RCTPSPDFKitView.m
@implementation RCTPSPDFKitView

#pragma mark - PSPDFDocumentDelegate

- (void)pdfDocumentDidSave:(nonnull PSPDFDocument *)document {
  if (self.onDocumentSaved) {
    self.onDocumentSaved(@{});
  }
}

@end
```

This is how the event is used in React Native JavaScript code:

```javascript
// Catalog.ios.js

class EventListeners extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <PSPDFKitView
          document={"PDFs/Annual Report.pdf"}
          onDocumentSaved={event => {
            alert("Document Saved!");
          }}
        />
      </View>
    );
  }
}
```

## Methods

The official React Native documentation covers props and events very well, but there is not much mentioned about how to call a native method from React Native. We spent quite a bit of time trying to figure this one out; we went through some trial and error, and we looked at how other popular UI components are implemented.

### Calling a Method

Unlike with props and events, you can’t use `this.prop.doSomething()`. Rather, you need to use the native module in order to access `PSPDFKitViewManager` to ultimately call its method.

Here’s how we implemented `saveCurrentDocument`, a method that allows you to manually save a document:

```javascript
// index.js
class PSPDFKitView extends React.Component {
  render() {
    return <RCTPSPDFKitView ref="pdfView" {...this.props} />;
  }

  /**
   * Saves the currently opened document.
   */
  saveCurrentDocument = function() {
    NativeModules.PSPDFKitViewManager.saveCurrentDocument(
      findNodeHandle(this.refs.pdfView)
    );
  };
}
```

From here on, the implementation of `saveCurrentDocument` looks very similar to the implementation of props and events:

```objc
// RCTPSPDFKitView.h
@interface RCTPSPDFKitView: UIView

- (void)saveCurrentDocument;

@end
```

```objc
// RCTPSPDFKitView.m
@implementation RCTPSPDFKitView

- (void)saveCurrentDocument {
  [self.pdfController.document saveWithOptions:nil error:NULL];
}

@end
```

```objc
// RCTPSPDFKitViewManager.m
@implementation RCTPSPDFKitViewManager

RCT_EXPORT_METHOD(saveCurrentDocument:(nonnull NSNumber *)reactTag) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    [component saveCurrentDocument];
  });
}

@end
```

This is how we call `saveCurrentDocument` from React Native when pressing on a “Save” button:

```javascript
// Catalog.ios.js

<View>
  <Button
    onPress={() => {
      // Manual Save
      this.refs.pdfView.saveCurrentDocument();
    }}
    title="Save"
  />
</View>
```

### Calling a Method with Parameters and a Return Value

Calling a method with a return value is very similar to calling a method. You just need to make sure you call `return` when invoking the native module method, as seen below:

```javascript
// index.js
class PSPDFKitView extends React.Component {
  render() {
    return <RCTPSPDFKitView ref="pdfView" {...this.props} />;
  }

  /**
   * Gets all annotations of the given type from the page.
   *
   * @param pageIndex The page to get the annotations for.
   * @param type The type of annotations to get (See here for types https://pspdfkit.com/guides/server/current/api/json-format/) or null to
   *        get all annotations.
   *
   * Returns a promise resolving an array with the following structure:
   * {"annotations": [instantJSON]}
   */
  getAnnotations = function(pageIndex, type) {
    return NativeModules.PSPDFKitViewManager.getAnnotations(
      pageIndex,
      type,
      findNodeHandle(this.refs.pdfView)
    );
  };
}
```

You also need to make sure your native methods have return values:

```objc
// RCTPSPDFKitView.h
@interface RCTPSPDFKitView: UIView

- (NSDictionary *)getAnnotations:(PSPDFPageIndex)pageIndex type:(PSPDFAnnotationType)type;

@end
```

```objc
// RCTPSPDFKitView.m
@implementation RCTPSPDFKitView

- (NSDictionary *)getAnnotations:(PSPDFPageIndex)pageIndex type:(PSPDFAnnotationType)type {
  NSArray <PSPDFAnnotation *>* annotations = [self.pdfController.document annotationsForPageAtIndex:pageIndex type:type];
  NSArray <NSDictionary *> *annotationsJSON = [RCTConvert instantJSONAnnotationsFromPSPDFAnnotationArray:annotations];
  return @{@"annotations" : annotationsJSON};
}

@end
```

In this example, we return all annotations at the given page index. This is how we implement the method in `RCTPSPDFKitViewManager.m`:

```objc
// RCTPSPDFKitViewManager.m
@implementation RCTPSPDFKitViewManager

RCT_REMAP_METHOD(getAnnotations, getAnnotations:(nonnull NSNumber *)pageIndex type:(NSString *)type reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSDictionary *annotations = [component getAnnotations:(PSPDFPageIndex)pageIndex.integerValue type:[RCTConvert instantJSONAnnotationType:type]];
    if (annotations) {
      resolve(annotations);
    } else {
      reject(@"error", @"Failed to get annotations", nil);
    }
  });
}

@end
```

Note that we used the `RCTPromiseResolveBlock` and `RCTPromiseRejectBlock` promise blocks. The `resolve` block returns the annotations, while the `reject` block fails if an error occurs.

In the example below, we show an alert with the payload from `getAnnotations()` in JavaScript:

```javascript
// Catalog.ios.js

<View>
  <Button
    onPress={async () => {
      // Get ink annotations from the current page.
      const annotations = await this.refs.pdfView.getAnnotations(
        this.state.currentPageIndex,
        "pspdfkit/ink"
      );
      alert(JSON.stringify(annotations));
    }}
    title="getAnnotations"
  />
</View>
```

## Customizing the UI Using Native Code

Sometimes, making native APIs available to React Native doesn’t really make sense for a specific use case — for example, when exposing the annotation toolbar buttons. This is technically feasible, but there’s more to it than just exposing the button. One needs to expose the native button object and its properties, along with all the related callbacks and delegates.

If you have such a use case, we recommend doing it directly in Objective-C, as this is simply a lot easier. Sometimes it’s just a matter of reusing (aka copying and pasting) existing code from our examples in our [Catalog sample project][pspdfcatalog] and slightly modifying the code to fit your specific needs. In this example, we are adding a “Clear All” annotations button to the annotation toolbar and reusing the same code from `PSCCustomizeAnnotationToolbarExample.m` from [PSPDFCatalog][] in [`RCTPSPDFKitView.m`][`rctpspdfkitview.m` customize-the-toolbar-in-native-code] and [`RCTPSPDFKitViewManager.m`][`rctpspdfkitviewmanager.m` customize-the-toolbar-in-native-code]. To see it in action, please check out the [customize-the-toolbar-in-native-code branch][] and run the Catalog example on your device.

<video src="/images/blog/2018/how-to-extend-react-native-api/customize-the-toolbar-in-native-code.mp4" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

## Conclusion

If you come across any missing APIs that you think would be useful to have, feel free to [contact us][support] or [open an issue][rn wrapper issues] on the [PSPDFKit React Native repository][react native wrapper]. You are also very welcome to submit [pull requests][rn wrapper pull request] to help improve our wrapper, as all of it is open source.

[react native ui component for ios blog post]: /blog/2018/react-native-ui-component-for-ios/
[react native ui component for android blog post]: /blog/2018/react-native-ui-component-for-android/
[react native wrapper]: https://github.com/PSPDFKit/react-native
[react native changelog]: https://github.com/PSPDFKit/react-native/releases/tag/1.20.0
[react native catalog]: https://github.com/PSPDFKit/react-native/tree/master/samples/Catalog
[pspdfkit react native introduction blog post]: /blog/2016/react-native-module/
[advanced techniques for react native ui components blog post]: /blog/2018/advanced-techniques-for-react-native-ui-components/
[react native props]: https://facebook.github.io/react-native/docs/props.html
[react native events]: https://facebook.github.io/react-native/docs/native-components-ios#events
[react native callbacks]: https://facebook.github.io/react-native/docs/native-modules-ios#callbacks
[`pdfviewcontroller:shouldsavedocument:withoptions:`]: https://pspdfkit.com/api/ios/Protocols/PSPDFViewControllerDelegate.html#/c:objc(pl)PSPDFViewControllerDelegate(im)pdfViewController:shouldSaveDocument:withOptions:
[`pdfdocumentdidsave:`]: https://pspdfkit.com/api/ios/Protocols/PSPDFDocumentDelegate.html#/c:objc(pl)PSPDFDocumentDelegate(im)pdfDocumentDidSave:
[react native properties]: https://facebook.github.io/react-native/docs/native-components-ios#properties
[react native events]: https://facebook.github.io/react-native/docs/native-components-ios#events
[pspdfkitview source code]: https://github.com/PSPDFKit/react-native/blob/master/index.js
[pspdfcatalog]: https://pspdfkit.com/guides/ios/current/getting-started/example-projects/#pspdfcatalog
[`rctpspdfkitview.m` customize-the-toolbar-in-native-code]: https://github.com/PSPDFKit/react-native/blob/customize-the-toolbar-in-native-code/ios/RCTPSPDFKit/RCTPSPDFKitView.m
[`rctpspdfkitviewmanager.m` customize-the-toolbar-in-native-code]: https://github.com/PSPDFKit/react-native/blob/customize-the-toolbar-in-native-code/ios/RCTPSPDFKit/RCTPSPDFKitViewManager.m
[customize-the-toolbar-in-native-code branch]: https://github.com/PSPDFKit/react-native/tree/customize-the-toolbar-in-native-code
[support]: /support/request
[rn wrapper issues]: https://github.com/PSPDFKit/react-native/issues
[rn wrapper pull request]: https://github.com/PSPDFKit/react-native/pulls
