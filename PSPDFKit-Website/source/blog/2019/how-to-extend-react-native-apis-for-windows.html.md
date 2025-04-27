---
title: "How to Extend React Native APIs for Windows"
description: "A tutorial about how to expose native PSPDFKit for Windows APIs to React Native."
preview_image: /images/blog/2019/how-to-extend-react-native-apis-for-windows/article-header.png
preview_video: /images/blog/2019/how-to-extend-react-native-apis-for-windows/article-video.mp4
section: blog
author:
  - Nick Winder
author_url:
  - http://www.nickwinder.com
date: 2019-04-29 9:00 UTC
tags: Windows, Development, React Native
published: true
secret: false
---

React Native can be a great option when wanting to start a cross-platform project, which is why at PSPDFKit, we wanted to ensure that our PDF framework supports React Native with little fuss. You may know that React Native can be used to develop for [Android][react-native-pspdfkit-android] and [iOS][react-native-pspdfkit-ios], but did you know that it also supports [Windows][react-native-windows]? As a result, naturally we decided to extend [PSPDFKit for React Native][react-native-pspdfkit] to also support Windows!

In our native SDKs, we expose a lot of APIs for full customization, but we only use a subset of those APIs in our React Native wrapper. In this article, we will show you how to bring native Windows APIs to React Native, in order to make it easier for everyone to contribute to our open source repository or to expose native Windows code to React Native in general.

**ℹ️ Note:** If you’re looking into extending our iOS or Android SDK APIs to React Native, please take a look at our [How to Extend React Native APIs for iOS][how-to-extend-for-ios] and [Advanced Techniques for React Native UI Components for Android][how-to-extend-for-android] blog posts.

## Native UI Components

When extending PSPDFKit for React Native, you will mostly be extending the UI component of `PDFView`. The `PDFView` will be responsible for showing a PDF and general tools to manipulate the PDF.

### Props

Props are parameters that allow you to customize your UI components. The following example shows how to extend the wrapper to open a document on a specific page index.

#### JavaScript Implementation

First, we define the prop in `index.windows.js`, which is where `PSPDFKitView`, our React Native UI component, is defined:

```javascript
class PSPDFKitView extends React.Component {
  _nextRequestId = 1;
  _requestMap = new Map();

  render() {
    return <RCTPSPDFKitView ref="pdfView" {...this.props} />;
  }
}

PSPDFKitView.propTypes = {
  /**
   * Page index of the document that will be shown.
   */
  pageIndex: PropTypes.number
};
```

#### Native C# Implementation

We then expose a method in [`PSPDFKitViewManager`][pspdfkit-view-manager] to handle the defined prop. Within the method, we can reference both the view that is being manipulated (`PDFViewPage`) and the prop that is being passed in. We also have to ensure that the prop type matches the parameter type. For example, `PropTypes.number` is an `int`:

```csharp
[ReactProp("pageIndex")]
public async void SetPageIndexAsync(PDFViewPage view, int pageIndex)
{
    await view.SetPageIndexAsync(pageIndex);
}
```

#### Usage of the Exposed Prop

Once you’ve completed the above, this is how to use the newly added prop in your JavaScript code:

```javascript
class ManualSave extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <PSPDFKitView
          ref="pdfView"
          style={styles.pdfView}
          document="ms-appx:///Assets/pdf/annualReport.pdf"
          pageIndex="1"
        />
      </View>
    );
  }
}
```

### Methods

It’s possible to add a method directly to the `PSPDFKitView`, which will allow us to call directly through to C#. On top of this, we can also set up a system that handles a [`Promise`][promise] in JavaScript to make an intuitive interface in React Native. Implementing a `Promise` is advisable in most cases, as doing so provides the writer with both an indication of whether or not the operation was successful and a more native way of handling errors in JavaScript.

#### Native C# Implementation

There are two steps to implementing the native side of a method call to the view.

First we want to create a mapping in which the JavaScript `index.windows.js` can call. This is done by overriding the `ViewCommandsMap` of the [`PSPDFKitViewManager`][pspdfkit-view-manager]:

```csharp
private const int COMMAND_ENTER_ANNOTATION_CREATION_MODE = 1;
public override JObject ViewCommandsMap => new JObject
{
    {
        "enterAnnotationCreationMode", COMMAND_ENTER_ANNOTATION_CREATION_MODE
    }
};
```

Now when we call `enterAnnotationCreationMode`, this will map to a `const int`, which we can use next.

Then we need to use the mapping created above to decide which code path to take. When the JavaScript calls, it will call through to a single location, `ReceiveCommand`, which we need to override in [`PSPDFKitViewManager`][pspdfkit-view-manager]. Within this, we switch based upon the unique integer passed in where the mapping was created above:

```csharp
public override async void ReceiveCommand(PDFViewPage view, int commandId, JArray args)
{
    switch (commandId)
    {
        case COMMAND_ENTER_ANNOTATION_CREATION_MODE:
            var requestId = args[0].Value<int>();
            try
                {
                    await Pdfview.Controller.SetInteractionModeAsync(InteractionMode.Note);

                    this.GetReactContext().GetNativeModule<UIManagerModule>()
                        .EventDispatcher
                        .DispatchEvent(
                            new PdfViewOperationResult(this.GetTag(), requestId)
                        );
            }
            catch (Exception e)
            {
                this.GetReactContext().GetNativeModule<UIManagerModule>()
                    .EventDispatcher
                    .DispatchEvent(
                        new PdfViewOperationResult(this.GetTag(), requestId, e.Message)
                    );
            }
            break;
    }
}
```

Arguments are passed as a JSON array which can be parsed and used if necessary. The first argument in the example above is an integer that provides the mapping back to a `Promise` in JavaScript. We use this ID to send an event to handle the `Promise`. Please see the [Events and Callbacks section][events and callbacks] below for more information.

#### JavaScript Implementation

We then need to create a method for the `PSPDFKitView` class held in `index.windows.js`. This method will call through to the native code with the exposed command from the previous step:

```javascript
enterAnnotationCreationMode() {
let requestId = this._nextRequestId++;
let requestMap = this._requestMap;

// We create a `Promise` here that will be resolved once `onDataReturned` is called.
let promise = new Promise((resolve, reject) => {
  requestMap[requestId] = {resolve: resolve, reject: reject};
});

// This calls through to C# with the command exposed as `enterAnnotationCreationMode`.
UIManager.dispatchViewManagerCommand(
  findNodeHandle(this.refs.pdfView),
  UIManager.RCTPSPDFKitView.Commands.enterAnnotationCreationMode,
  [requestId]
);

return promise;
}
```

In the example above, you can see that we are setting up a `Promise` to return. Within `index.windows.js`, we are keeping a mapping to ensure the correct `Promise` is called from C# in the previous step. The ID for this `Promise` is passed in as `requestId`.

#### Usage of Exposed Method

```javascript
class AnnotationMode extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <PSPDFKitView
          ref="pdfView"
          style={styles.pdfView}
          document="ms-appx:///Assets/pdf/annualReport.pdf"/>
      </View>
      <Button
        onPress={() => {
          this.refs.pdfView.enterAnnotationCreationMode().then(() => {
            alert("successful");
          }).catch(error => {
            alert(error);
          });
        }}
        title="Create Annotation"
      />
    );
  }
}
```

## Events and Callbacks

Events, or callbacks, allow you to be notified in JavaScript when something occurs in native C# code. Take a look at the [official documentation][events-documentation] for more information and the [React Native Windows documentation][rnw-events-documentation] for Windows-specific implementations.

Events should be prefixed with “on,” so in our case, we’ve implemented `onAnnotationsChanged`, which is called when annotations change. In PSPDFKit for Windows, we have `AnnotationsCreated`, `AnnotationsUpdated`, and `AnnotationsDeleted`, all of which we can use for mapping to JavaScript.

Again, we’ll start in `index.windows.js` and define the events in JavaScript:

```javascript
class PSPDFKitView extends React.Component {
  render() {
    return (
      <RCTPSPDFKitView
        ref="pdfView"
        {...this.props}
        onAnnotationsChanged={this._onAnnotationsChanged}
      />
    );
  }

  _onAnnotationsChanged = event => {
    if (this.props.onAnnotationsChanged) {
      this.props.onAnnotationsChanged(event.nativeEvent);
    }
  };
}
```

Now we need to create a mapping to code. Similar to methods called from the `PSPDFKitView`, we also have a mapping to events:

```csharp
public override JObject CustomDirectEventTypeConstants =>
    new JObject
    {
        {
            PdfViewAnnotationChangedEvent.EVENT_NAME,
            new JObject
            {
                {"registrationName", "onAnnotationsChanged"},
            }
        }
    };
```

As you can see, there is a new class here named `PdfViewAnnotationChangedEvent`, which is extended from `ReactNative.UIManager.Event` and describes the event in JSON:

```csharp
class PdfViewAnnotationChangedEvent : Event
{
    public const string EVENT_NAME = "pdfViewAnnotationChanged";
    public const string EVENT_TYPE_CHANGED = "changed";
    public const string EVENT_TYPE_ADDED = "added";
    public const string EVENT_TYPE_REMOVED = "removed";

    private readonly string _eventType;
    private readonly IAnnotation _annotation;

    public PdfViewAnnotationChangedEvent(int viewId, string eventType, IAnnotation annotation) : base(viewId)
    {
        this._eventType = eventType;
        this._annotation = annotation;
    }

    public override string EventName => EVENT_NAME;

    public override void Dispatch(RCTEventEmitter rctEventEmitter)
    {
        var eventData = new JObject
        {
            { "change", _eventType },
            { "annotations", JObject.Parse(_annotation.ToJson().Stringify()) }
        };

        rctEventEmitter.receiveEvent(ViewTag, EventName, eventData);
    }
}
```

We can then use PSPDFKit for Windows events to drive React events:

```csharp
PDFView.OnDocumentOpened += (pdfView, document) =>
{
    document.AnnotationsCreated += DocumentOnAnnotationsCreated;
    document.AnnotationsUpdated += DocumentOnAnnotationsUpdated;
    document.AnnotationsDeleted += DocumentOnAnnotationsDeleted;
};
```

```csharp
private void DocumentOnAnnotationsCreated(object sender, IList<IAnnotation> annotationList)
{
    foreach (var annotation in annotationList)
    {
        this.GetReactContext().GetNativeModule<UIManagerModule>().EventDispatcher.DispatchEvent(
            new PdfViewAnnotationChangedEvent(this.GetTag(),
                PdfViewAnnotationChangedEvent.EVENT_TYPE_ADDED, annotation)
        );
    }
}
```

#### Usage of Exposed Events

Now that we have everything set up, we can use the event in JavaScript:

```javascript
class PdfViewListeners extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <PSPDFKitView
          document="ms-appx:///Assets/pdf/annualReport.pdf"
          onAnnotationsChanged={change => {
            alert("Annotations changed\n" + JSON.stringify(change));
          }}
        />
      </View>
    );
  }
}
```

### Native Modules

Native modules are often used when you want to interact with native code that is not related to a view. A great example of this in the PSPDFKit React Native wrapper is library search. We can set up a library and perform a search over assets or a user-defined folder, all without having a view.

This post will not go into native modules, but feel free to read up on the [React Native Windows documentation][native-module-doc] and refer to our [Library example][library-example].

## Customizing the UI Using Native Code

Sometimes, making native APIs available to React Native doesn’t really make sense for a specific use case — for example, rather than just setting the simple colors of the `PdfView`, maybe you want to implement complex [CSS customization][customize-ui-windows]. In such a case, it could be a great idea to have a static CSS file you set on your native `PdfView`, thereby reducing development time for a simple non-dynamic code change.

The change would be a simple case of adding a CSS asset and then referencing it in the [`PdfViewPage`][rnw-pdf-view-page]:

```xaml
<ui:PdfView
    License="{StaticResource PSPDFKitLicense}"
    Name="PDFView"
    InitializationCompletedHandler="PDFView_InitializationCompletedHandlerAsync"
    Css="ms-appx-web:///Assets/css/my-pspdfkit.css"/>
```

## Conclusion

In this blog post, you learned how to expose native PSPDFKit for Windows APIs to React Native. Exposing native APIs in this way will create a very powerful yet simple React Native plugin for many of your PDF needs. If you come across any missing APIs that you think would be useful to have, feel free to contact us or open an issue on the [PSPDFKit React Native repository][react-native-pspdfkit]. You are also very welcome to submit pull requests to help improve our wrapper, as all of it is open source.

[react-native-pspdfkit-android]: https://github.com/PSPDFKit/react-native#android
[react-native-pspdfkit-ios]: https://github.com/PSPDFKit/react-native#ios
[how-to-extend-for-ios]: https://pspdfkit.com/blog/2018/how-to-extend-react-native-api/
[how-to-extend-for-android]: https://pspdfkit.com/blog/2018/advanced-techniques-for-react-native-ui-components/
[react-native-windows]: https://github.com/PSPDFKit/react-native#windows
[react-native-pspdfkit]: https://github.com/PSPDFKit/react-native
[customize-ui-windows]: https://pspdfkit.com/guides/windows/current/customizing-the-interface/css-customization/
[pspdfkit-view-manager]: https://github.com/PSPDFKit/react-native/blob/master/windows/ReactNativePSPDFKit/ReactNativePSPDFKit/PSPDFKitViewManager.cs
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[events and callbacks]: #events-and-callbacks
[events-documentation]: https://facebook.github.io/react-native/docs/native-components-ios#events
[rnw-events-documentation]: https://github.com/Microsoft/react-native-windows/blob/master/RNWCS/docs/NativeModulesWindows.md#sending-events-to-javascript
[native-module-doc]: https://github.com/Microsoft/react-native-windows/blob/master/RNWCS/docs/NativeModulesWindows.md
[library-example]: https://github.com/PSPDFKit/react-native/blob/5dea4dd4ec4e268627b39c355631c64d0c84747f/samples/Catalog/Catalog.windows.js#L24
[rnw-pdf-view-page]: https://github.com/PSPDFKit/react-native/blob/master/windows/ReactNativePSPDFKit/ReactNativePSPDFKit/PDFViewPage.xaml
