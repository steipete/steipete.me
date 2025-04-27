---
title: "Native View Controllers and React Native - It Just Works™"
section: blog
preview_image: /images/blog/2017/native-view-controllers-and-react-native/embedded_pspdfkit.jpg
bodyclass: blog
author:
  - Ben Kraus
author_url:
  - https://twitter.com/kraustifer
date: 2017-08-30 12:00 UTC
tags: iOS, Development
published: true
---

_This week, we welcome [Ben Kraus](https://twitter.com/kraustifer) as a guest author on Inside PSPDFKit, explaining the process of integrating our PDF SDK into [Canvas Teacher](https://www.canvaslms.com/)._

Sometimes, React Native just doesn't cut it. Building an app in React Native that has strict design requirements can be rather interesting. In our case, we needed to show a third party library in our app's UI somewhere where you would traditionally be using `UIViewController` instances _and child view controller containment_. It may be an uncommon approach to do this with third party libraries, but you may sometimes need to embed a view controller inside a component. We use PSPDFKit to handle PDFs in our app, and this is the technique we've used successfully when handling other view controllers such as `AVPlayerViewController`s. It wasn't enough just to show the `PSPDFViewController` as a modal, it had to be inline with other components. [PSPDFKit is awesome and has some support for React Native](/blog/2016/react-native-module/), but we needed to extend that further.

READMORE

Here's how our UI looks in this case:

<img title="Embedded PSPDFKit" src="/images/blog/2017/native-view-controllers-and-react-native/embedded_pspdfkit.jpg">

As you can see, there's essentially a header, and then the content view which is an embedded `PSPDFViewController`, with a swipeable drawer that can be expanded up even more _or_ dismissed downwards. The drawer is done in React Native, as is the header. So, we needed to figure out how to embed a view controller inside another view controller ([I mentioned in a prior blog post we stuck with true native navigation](http://debugginghell.com/posts/native-navigation-in-react-native/)) all the while having the sizing and whatnot controlled by React Native. What's nice about the sizing being controlled by React Native is that if you wanted, you could set the width and height through flexbox, and it should Just Work.™

This is how we did it:

First, we need to define a component that we can use in other components:

```javascript
// @flow

import React, { Component, PropTypes } from 'react'
import { requireNativeComponent } from 'react-native'

type Props = {
  config: { documentURL: string },
  style?: Object
}

export default class PDFView extends Component<any, Props, any> {
  render() {
    return <PSPDFView style={this.props.style} {...this.props} />
  }
}

PDFView.propTypes = {
  config: PropTypes.shape({ documentURL: PropTypes.string }).isRequired
}

const PSPDFView = requireNativeComponent('PSPDFView', PDFView)
```

This is pretty bare bones. The takeaway from this is that we defined a `PDFView` component that wraps a native component which is defined elsewhere as a `PSPDFView`, and pass along the props. For now the props will only be a simple map with a `documentURL` property. You can take this much further if you want, but this is really all you need to get documents showing.

Now let's hop over to the native side of things, where the real stuff happens.

First, we need to handle the bridging by creating an Objective-C .m file with the following:

```objc
#import <UIKit/UIKit.h>
#import <React/RCTUIManager.h>

@interface PSPDFViewManager : RCTViewManager
@end

@implementation PSPDFViewManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    return [PSPDFView new];
}

RCT_EXPORT_VIEW_PROPERTY(config, NSDictionary *)

@end
```

This too is rather simple. First, we create a subclass of `RCTViewManager` and inside the implementation of the class, call the macro `RCT_EXPORT_MODULE()`. This allows for React to see this class as something that can be imported. We also call the macro `RCT_EXPORT_VIEW_PROPERTY` with two parameters: the name of the property on the actual view that we will be rendering, and it's type. The actual view that we render is returned from the `-[RCTViewManager view]` method which we override - where we simply return an instance of a `PSPDFView` class.

Next, we need to define our `PSPDFView` class. Perhaps we shouldn't use the same prefix the vendor themselves use, but this is for demo purposes. 😛

```swift
class PSPDFView: UIView {
    override init(frame: CGRect) {
        super.init(frame: frame)
    }
    required init?(coder aDecoder: NSCoder) { fatalError("nope") }
}
```

And then, we need to add on a couple of properties as well as a computed property to make our lives easier:

```swift
weak var pdfViewController: PSPDFViewController?

var config: NSDictionary = [:] {
    didSet {
        setNeedsLayout()
    }
}

var documentURL: URL? {
    if let url = config["documentURL"] as? String {
        return URL(fileURLWithPath: url)
    }
    return nil
}
```

React will be responsible for controlling the sizing of the component and it's backing view, and will somewhat do so on it's own terms. So, to get in where we need, we override `-[UIView layoutSubviews]`:

```swift
override func layoutSubviews() {
    super.layoutSubviews()

    if pdfViewController == nil {
        embed()
    } else {
        pdfViewController?.view.frame = bounds
    }
}
```

It may or may not be the correct thing to handle the embed purely off the non-existence of `pdfViewController` _in layoutSubviews_, but `init` was too soon and this was what we got working. ¯\\\_(ツ)\_/¯ Anyways, here's what `embed` looks like:

```swift
private func embed() {
    guard
        let parentVC = parentViewController,
        let documentURL = documentURL else {
        return
    }

    let doc = PSPDFDocument(url: documentURL)
    let vc = PSPDFViewController(document: doc)
    parentVC.addChild(vc)
    addSubview(vc.view)
    vc.view.frame = bounds
    vc.didMove(toParentViewController: parentVC)
    self.pdfViewController = vc
}
```

Here we grab this view's `parentViewController` (which I'll explain in a bit), and make sure we have a url to a document that we want to show. Then, we create our `PSPDFViewController` instance, and use view controller containment to embed the view controller. That is all.

Finding the `parentViewController` of a `UIView` is somewhat interesting:

```swift
extension UIView {
    var parentViewController: UIViewController? {
        var parentResponder: UIResponder? = self
        while parentResponder != nil {
            parentResponder = parentResponder!.next
            if let viewController = parentResponder as? UIViewController {
                return viewController
            }
        }
        return nil
    }
}
```

There we traverse the responder chain looking for the view controller, and bail when we find it. This was compliments of something we discovered on [StackOverflow](https://stackoverflow.com/a/24590678).

All together our `PSPDFView` class looks like this:

```swift
class PSPDFView: UIView {

    weak var pdfViewController: PSPDFViewController?

    var config: NSDictionary = [:] {
        didSet {
            setNeedsLayout()
        }
    }

    var documentURL: URL? {
        if let url = config["documentURL"] as? String {
            return URL(fileURLWithPath: url)
        }
        return nil
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
    }
    required init?(coder aDecoder: NSCoder) { fatalError("nope") }

    override func layoutSubviews() {
        super.layoutSubviews()

        if pdfViewController == nil {
            embed()
        } else {
            pdfViewController?.view.frame = bounds
        }
    }

    private func embed() {
        guard
            let parentVC = parentViewController,
            let documentURL = documentURL else {
            return
        }

        let doc = PSPDFDocument(url: documentURL)
        let vc = PSPDFViewController(document: doc)
        parentVC.addChild(vc)
        addSubview(vc.view)
        vc.view.frame = bounds
        vc.didMove(toParentViewController: parentVC)
        self.pdfViewController = vc
    }
}
```

```swift
extension UIView {
    var parentViewController: UIViewController? {
        var parentResponder: UIResponder? = self
        while parentResponder != nil {
            parentResponder = parentResponder!.next
            if let viewController = parentResponder as? UIViewController {
                return viewController
            }
        }
        return nil
    }
}
```

Well, that's the gist of it. I'll probably wrap this all up into a nice pull request for PSPDFKit's React Native [wrapper](https://github.com/PSPDFKit/react-native), unless of course the awesome guys at PSPDFKit see this, and get 'er done before I do. [Editor: We're already on it!] Again, this technique can be used for more than just displaying `PSPDFViewController`s inside a component - we also use the same technique to display `AVPlayerViewController`s that are wrapped in React components as well. You can do so with any type of `UIViewController` that needs to be embeded in a component _as long as you are using a native navigation approach._ It's a useful trick that can come in handy sometimes. Have at it.

## About Canvas Teacher by Instructure

[Canvas Teacher](https://www.canvaslms.com/) is an app that allows teachers using the Canvas platform to facilitate their courses on the go, both inside and outside the classroom. Canvas Teacher is a purpose-built, role-specific mobile app that dramatically increases the ease of interactions with Canvas. It provides quick access to grading, communicating, and updating course content — three of the most frequent course facilitation tasks for teachers through Announcements, Assignments, Discussions, and Quizzes. One core component of grading assignment submissions from students is viewing and annotating upon files submitted by students - something that is handled by PSPDFKit.
