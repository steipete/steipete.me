---
title: "Advanced Techniques for React Native UI Components"
description: "An outline of some of the more advanced techniques you can apply to React Native UI components on Android."
preview_image: /images/blog/2018/advanced-techniques-for-react-native-ui-components/article-header.png
preview_video: /images/blog/2018/advanced-techniques-for-react-native-ui-components/article-video.mp4
section: blog
author:
  - Reinhard Hafenscher
date: 2018-08-29 12:00 UTC
tags: Android, Development, React Native
published: true
secret: false
---

While React Native can do a lot of things just by itself, where it really shines is in its ability to be expanded using native code.
READMORE
This blog post will outline some of the more advanced techniques you can apply to React Native UI components — particularly ones that aren’t that well documented.

For the purpose of this post, we’ll assume you’ve already read the [official documentation] and have set up your UI component. We’ll also use our own [React Native wrapper] for the examples, so if you want to see the complete code, you can just look it up. So let’s get started.

> ℹ️ **Note:** If you’re looking for information about working with React Native on iOS, have a look at our [How to Extend React Native APIs][how to extend react native apis] blog post, which looks at the iOS side of React Native development.

## Calling Methods from React

Looking at the official documentation, it’s pretty clear how to send events to React components and how you’d pass props back to your native code. But what if you have some method on your native view that you’d like to trigger from your React code?

Here’s our basic starting point:

```javascript
class PSPDFKitView extends React.Component {
  render() {
    return <RCTPSPDFKitView {...this.props} />;
  }
}

PSPDFKitView.propTypes = {
  /**
   * Path to the PDF file that should be displayed.
   */
  document: PropTypes.string
};

var RCTPSPDFKitView = requireNativeComponent(
  "RCTPSPDFKitView",
  PSPDFKitView
);

modules.exports = PSPDFKitView;
```

Now let’s allow the user to manually save the current document by adding a `saveCurrentDocument` method that will save the user’s changes.

First, let’s make our `RCTPSPDFKitView` accessible by adding a `ref` to it:

```javascript
<RCTPSPDFKitView ref="pdfView" {...this.props} />
```

Now, we can add our `saveCurrentDocument` method:

```javascript
import { UIManager, findNodeHandle } from "react-native";
/**
 * Saves the currently open document.
 */
saveCurrentDocument = function() {
  UIManager.dispatchViewManagerCommand(
    findNodeHandle(this.refs.pdfView),
    UIManager.RCTPSPDFKitView.Commands.saveCurrentDocument,
    []
  );
};
```

So how does this work? The `dispatchViewManagerCommand` takes three parameters: the node handle of the component you want to send a command to, the ID of the command you want to perform, and the parameters you want to pass in. In our case, we use `findNodeHandle(this.refs.pdfView)` to send the command to our current component. `UIManager.RCTPSPDFKitView.Commands.saveCurrentDocument` is a command we’ll export in our `ReactPdfViewManager` in just a second, and `[]` is an array that could contain any parameters we might want to pass to our native code.

Next, let’s take a look at what needs to be done on the Java side:

```java
public class ReactPdfViewManager extends ViewGroupManager<PdfView> {
  // You need to define a constant for each command you want to call
  // from react-native.
  public static final int COMMAND_SAVE_CURRENT_DOCUMENT = 3;
  ...
  @Nullable
  @Override
  public Map<String, Integer> getCommandsMap() {
    // You need to implement this method and return a map with the readable
    // name and constant for each of your commands. The name you specify
    // here is what you'll later use to access it in react-native.
    return MapBuilder.of(
      "saveCurrentDocument",
      COMMAND_SAVE_CURRENT_DOCUMENT
    );
  }
  ...
  @Override
  public void receiveCommand(final PdfView root, int commandId, @Nullable ReadableArray args) {
    // This will be called whenever a command is sent from react-native.
    switch (commandId) {
      case COMMAND_SAVE_CURRENT_DOCUMENT:
        root.saveCurrentDocument();
        break;
    }
  }
}
```

The process is actually pretty straightforward. We expose our `COMMAND_SAVE_CURRENT_DOCUMENT` constant for React to use by implementing `getCommandsMap`, and then we handle any commands called from React by implementing `receiveCommand`.

The above works great for something like `saveCurrentDocument`, which doesn’t return any data, but what if you have something like `getAnnotations`, which does?

## Calling Methods with Return Values

The easiest way would probably be to just expose your `getAnnotations` and then send an `onAnnotationsLoaded` event, but this will disconnect the result from actually calling the method on it, which doesn’t make for a great API.

If you’ve ever implemented a [native module], you know that React makes it really easy to add methods that asynchronously resolve a `Promise` with their result. Since this doesn’t exist for native UI components, we need to get a little bit creative to achieve the same thing.

Our idea is that we want our `PSPDFKitView` component to have a `getAnnotations` method our users can call that will return a `Promise`. This promise should be either resolved with the annotations or rejected if there was an issue grabbing them.

So let’s start by updating our React code. First we’ll add some new properties for bookkeeping:

```javascript
// PSPDFKitView.js
// We need to keep track of all running requests, so we store a counter.
_nextRequestId = 1;
// We also need to keep track of all the promises we created so we can
// resolve them later.
_requestMap = new Map();
```

We’ll use these properties to keep track of all open requests. Next we’ll add a new callback to our `RCTPSPDFKitView`:

```javascript
render() {
  <RCTPSPDFKitView
    ref="pdfView"
    {...this.props}
    onDataReturned={this._onDataReturned} />
}

_onDataReturned = (event) => {
  // We grab the relevant data out of our event.
  let { requestId, result, error } = event.nativeEvent
  // Then we get the promise we saved earlier for the given request ID.
  let promise = this._requestMap[requestId]
  if (result) {
    // If it was successful, we resolve the promise.
    promise.resolve(result)
  } else {
    // Otherwise, we reject it.
    promise.reject(error)
  }
  // Finally, we clean up our request map.
  this._requestMap.delete(requestId)
}
```

This gets called from Java whenever a request is done. Using the `requestId`, we `resolve` or `reject` the corresponding `Promise`, and to finish it off, let’s add our `getAnnotations` method:

```javascript
/**
 * Gets all annotations of the given type from the page.
 *
 * @param pageIndex The page to get the annotations for.
 * @param type The type of annotations to get (See here for types
 *        https://pspdfkit.com/guides/server/current/api/json-format/) or
 *        null to get all annotations.
 *
 * @returns A promise resolving an array with the following structure:
 *          [ instantJson ]
 */
function getAnnotations(pageIndex, type) {
  // Grab a new request id and our request map.
  let requestId = this._nextRequestId++;
  let requestMap = this._requestMap;

  // We create a promise here that will be resolved once _onRequestDone is
  // called.
  let promise = new Promise(function(resolve, reject) {
    requestMap[requestId] = { resolve: resolve, reject: reject };
  });

  // Now just dispatch the command as before, adding the request ID to the
  // parameters.
  UIManager.dispatchViewManagerCommand(
    findNodeHandle(this.refs.pdfView),
    UIManager.RCTPSPDFKitView.Commands.getAnnotations,
    [requestId, pageIndex, type]
  );

  return promise;
}
```

This just creates a `Promise` and puts it in our `requestMap` for later.

Finally, let’s look at the Java side of things. First things first, let’s create our new event:

```java
public class PdfViewDataReturnedEvent extends Event<PdfViewDataReturnedEvent> {

  public static final String EVENT_NAME = "pdfViewDataReturned";

  private final WritableMap payload;

  public MyCustomViewRequestDoneEvent(@IdRes int viewId, int requestId, @NonNull List<Annotation> annotations) {
    super(viewId);

    payload = Arguments.createMap();
    payload.putInt("requestId", requestId);
    // Put our annotations into the payload.
    payload.putString("result", SerializationUtils.serializeAnnotations(annotations));
  }

  @Override
  public String getEventName() {
    return EVENT_NAME;
  }

  @Override
  public void dispatch(RCTEventEmitter rctEventEmitter) {
    rctEventEmitter.receiveEvent(getViewTag(), getEventName(), payload);
  }
}
```

We’re using an event that’s different from what’s in the [official documentation][event documentation], but it’s functionally the same. Next, we’ll register it with our `ViewManager`:

```java
// ReactPdfViewManager.java

@Nullable
@Override
public Map getExportedCustomDirectEventTypeConstants() {
  return MapBuilder.of(PdfViewDataReturnedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDataReturned"));
}
```

Finally, let’s add our `getAnnotations` method to dispatch the new event:

```java
// ReactPdfViewManager.java

public static final int COMMAND_GET_ANNOTATIONS = 4;
...
@Override
protected PdfView createViewInstance(ThemedReactContext reactContext) {
  ...
  // You need to make sure you have access to the EventDispatcher when your command is called.
  pdfView.inject(fragmentActivity.getSupportFragmentManager(),
    reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher());
  ...
}
...

@Override
public void receiveCommand(final PdfView root, int commandId, @Nullable ReadableArray args) {
  switch (commandId) {
    ...
    case COMMAND_SAVE_CURRENT_DOCUMENT:
      if (args != null) {
        final int requestId = args.getInt(0);
        // Perform our listing operation.
        root.getAnnotations(args.getInt(1), args.getString(2))
          .subscribeOn(Schedulers.io())
          .observeOn(AndroidSchedulers.mainThread())
          .subscribe(new Consumer<List<Annotation>>() {
            @Override
            public void accept(List<Annotation> annotations) {
              // This will send the event to our React component.
              root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, annotations));
            }
          });
      }
      break;
  }
}
```

And with that, we’re done. Even though React Native doesn’t support `Promises` for native UI components, we created a `getAnnotations` method that behaves just like one would expect. And while we had to do some stuff behind the scenes to get it to work, the users of our UI component can enjoy a sensible API.

## Conclusion

While the React Native documentation is pretty good for the most part, some more advanced topics aren’t discussed in there. Hopefully this blog post helped you out with tips and tricks for communicating between React Native and Java.

[official documentation]: https://facebook.github.io/react-native/docs/native-components-android
[event documentation]: https://facebook.github.io/react-native/docs/native-components-android#events
[native module]: https://facebook.github.io/react-native/docs/native-modules-android
[react native wrapper]: https://github.com/PSPDFKit/react-native
[how to extend react native apis]: /blog/2018/how-to-extend-react-native-api/
