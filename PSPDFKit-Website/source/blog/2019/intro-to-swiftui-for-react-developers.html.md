---
title: "Introduction to SwiftUI for React Developers"
description: "A discussion about the basic concepts of SwiftUI from the point of view of a React developer"
section: blog
author:
  - Guillermo Peralta
author_url:
  - https://twitter.com/voluntadpear
date: 2019-11-09 8:00 UTC
tags: iOS, Web, Development, Swift, React
published: false
secret: true
---

Building user interfaces declaratively is something that the Web community has widely adopted thanks to frameworks like React, and nowadays large applications are built following those principles. React Native brought the same fundamental mental model for native mobile apps development and seems to be inspiring rethinking the underlying core technologies of each platform. Google recently launched the developer preview of [Jetpack Compose][] and Apple announced [SwiftUI][] at [WWDC19][] with an immensely positive reception from developers.

Here at PSPDFKit, we are always excited by new advancements of development technologies and quickly after the initial announcement, were able to integrate [PSPDFKit for iOS][] on a SwiftUI app and [blogged about it][swiftui blog post].

In this article, we'll explain some basic concepts behind SwiftUI in a way that hopefully will result familiar to React developers, even those that never worked on an iOS app before.

First of all, make sure to have the latest version of Xcode installed on your Mac. You can get it [from here][xcode]. Xcode is the IDE developed by Apple for developing software for its platforms (including macOS, iOS and watchOS). We will be using it for developing our SwiftUI app and take advantage of its previewing features. 

## Prerequisites

- macOS Catalina
- Xcode 11
- iOS device running iOS 13 or the iOS Simulator
- PSPDFKit for iOS

## Getting Started

- Download the sample project [here][link-to-sample-project-initial] (if you would like to see the final result directly download [this][link-to-sample-project-final] instead).
- If you’re an existing customer, download PSPDFKit for iOS from the [customer portal][] . Otherwise, if you don’t already have PSPDFKit, [sign up for our 60-day trial][trial] and you will receive an email with the instructions for getting started.
- Copy `PSPDFKit.xcframework` and `PSPDFKitUI.xcframework` into `PSPDFKitSwiftUI/PSPDFKit` in the sample project directory.
- Open `PSPDFKitSwiftUI.xcodeproj` in Xcode 11 and run it.

## Basic Concepts

Modern iOS development is done using the Swift programming langauge. If you are used to JavaScript and don't have experience with it, I'll recommend you to follow the official [Swift tour][] for getting familiar with the basic constructs that you'll observe in this post. Besides that, the underlying declarative model should soon look familiar from what you find on a React application. Don't get discouraged by the strange syntax, hopefully it will make sense after a while.

Open the `ContentView.swift` file in Xcode. This is the root view of our SwiftUI application. Each view from SwiftUI is equivalent to a component in React.

After the initial comments, we can find the `import` declaration for the different modules that we need for this view:

```swift
import SwiftUI
import PSPDFKit
import PSPDFKitUI
```

The example opens a PDF document using PSPDFKit for iOS. Hence, why we need to have the corresponding imports for it.

We create custom views by declaring types that conform to the `View` protocol. We can define properties on these views that we can think as props of a React component. The equivalent of our `render` method on a classic React class component is adding a `body` computed property to the view we are defining. All of the previous constructs can be observed in our `PSPDFKitView` custom view:

```swift
// PSPDFKitView.swift

import SwiftUI
import PSPDFKitUI

struct PSPDFKitView: View {
    var url: URL
    var configuration: PSPDFConfiguration?
    
    var body: some View {
        PDFViewController(url, configuration: configuration)
    }
}
```

`url` and `configuration` are properties that will be specified as arguments when declaring instances of the `PSPDFKitView` struct. Just like passing props to a React component. This simple wrapper view will just return a new instance of `PDFViewController` as its `body`.

`PDFViewController` is a `struct` that conforms to the [`UIViewControllerRepresentable`][] protocol. This is used for bridging between UIKit (traditional UI framework) to SwiftUI. It allows us to use PSPDFKit for iOS from SwiftUI. Right now, we have implemented the `makeUIViewController` method, where we initialize our [`PSPDFViewController`][] specifying the document to open and the [`PSPDFConfiguration`] to use. You can think about it as wrapping a jQuery plugin in a React component to abstract the underlying imperative logic.

Unlike most modern web development flows where a server listens for changes and live reloads almost instantly with the updated result, building an iOS app and refresh it with the latest changes usually takes more time and slows down design and development iteration. SwiftUI includes a solution for this in the form of a design canvas, where code changes are almost instantly previewed and any changes performed to the preview are immediately applied to the code.

The preview shown on the design canvas is defined by adding a type that conforms to the [`PreviewProvider`][] protocol. It's usual to find those along views on a SwiftUI app.

e.g.:

```swift
// PSPDFKitView.swift

struct PSPDFKitView_Preview: PreviewProvider {
    static var previews: some View {
        PSPDFKitView(url: Bundle.main.bundleURL.appendingPathComponent("PSPDFKit 9 QuickStart Guide.pdf"), configuration: PSPDFConfiguration { $0.pageTransition = .scrollPerSpread })
    }
}
```

Before introducing [Fragments][], a React component was limited to return a single element, which in turn, could potentially contain multiple children. SwiftUI's views are limited to return a single view as its `body`. So, to stack multiple children, views like `HStack`, `VStack` and `ZStack` exist.

* `HStack` arranges its children in a horizontal line, similarly to [Flexbox][] with `flex-direction: row`.
* `VStack` arranges its children in a vertical line, similarly to Flexbox with `flex-direction: column`.
* `ZStack` stacks its children overlapping each one on top of the other. Similarly to arranging DOM elements changing their `z-index` property.

To observe how a SwiftUI view looks and how we can layout different view elements we should head up to the `ContentView.swift` file:

```swift
// ContentView.swift

struct ContentView: View {
    // ...

    var body: some View {
        VStack(alignment: .leading) {
            PSPDFKitView(url: documentURL, configuration: configuration)
        }
    }
}
```

Right now our `body` is quite simple. It consists of a `VStack` with an horizontal alignment of `center` that contains a `Text` (that we can think of as a regular label to render text) and our `PSPDFKitView` to which we pass the `url` and `configuration` props that we show earlier accordingly.

## State

Let's adjust our application so that we can switch between displaying a PDF document using `PSPDFKit` and displaying a welcome message to the user. Let's integrate it on our main `ContentView` by adding a state variable that will indicate if we should display the PDF or not and adding the views for our welcome message.

```swift
struct ContentView: View {
    // ...

    @State var showViewer = false

    var body: some View {
        VStack(alignment: .leading) {
            Toggle(isOn: $showViewer) {
                Text("Display PDF")
            }
            if showViewer {
                PSPDFKitView(url: documentURL, configuration: configuration)
            } else {
                Spacer()
                Text("Welcome!")
                .font(.title)
                .padding(.bottom)
                Text("Ready to display the PDF")
                Spacer()
            }
        }.padding()
    }
}
```

On SwiftUI we declare state variables by adding the `@State` property wrapper. In this case we added a boolean to toggle between rendering `PSPDFKitView` and otherwise our welcome text. Notice how SwiftUI, like React, allow us to model the view as a function and the state. We just need to declare with an `if` statement that if the `showViewer` variable is `true` we will use `PSPDFKitView` and if it's `false`, the other UI should be used instead. SwiftUI will take care of updating the view whenever the state changes. To update the state, we added a `Toggle` view where we pass a binding reference to our state using `$showViewer`.

Let's examine the welcome message UI a bit closer. The main elements are two `Text` views, which have the simple duty of rendering text content. Our "Welcome!" title has two modifier methods that are used to adjust the font size and the padding. This is the general pattern followed on SwfitUI for styling the UI. Additionally, we have two `Spacer` views before and after our `Text` instances. `Spacer` is used for adding a flexible space that expands across the containing stack, filling the gap between the `Toggle` and the `Text`, and between the last `Text` and the bottom of the screen. Furthermore, we also added a `padding()` modifier to the wrapper `VStack` to improve the layout of the elements. That's it! Go ahead and try toggling a few times and see how the view alternates between the two PDF viewers.

## Lifecycle Events

SwiftUI gives us the option to respond to the view lifecyle events with the `onAppear()` and `onDisappear()` modifiers. We can attach any code we want to these. Let's see a basic example by printing messages to the console when we switch between showing and hiding the PDF viewer:

```swift
if showViewer {
    PSPDFKitView(url: documentURL, configuration: configuration)
    .onAppear {
        print("Displaying the PDF")
    }
} else {
    Spacer()
    Text("Welcome!")
    .font(.title)
    .padding(.bottom)
    Text("Ready to display the PDF")
    Spacer()
    .onAppear {
        print("Displaying the welcome message")
    }
}
```

## Styling and Animations

The current transition between views is really abrupt. It would be nice to add animated transitions between them to give our users an enhanced switching experience. Unlike what we are used coming from the Web platform, adding transitions to a SwiftUI view consists mainly of attaching additional modifiers to the views we are declaring. 

Here is how a basic transition between the viewers can look like:

```swift
// ContentView.swift

var body: some View {
    VStack(alignment: .center) {
        Toggle(isOn: $showViewer.animation()) {
            Text("Display PDF")
        }
        if showViewer {
            PSPDFKitView(url: documentURL, configuration: configuration)
            .transition(.slide) // Transition to use when this VStack appears. 
            .onAppear {
                print("Displaying the PDF")
            }
        } else {
            VStack(alignment: .leading) {
                Spacer()
                Text("Welcome!")
                    .font(.title)
                    .padding(.bottom)
                Text("Ready to display the PDF")
                Spacer()
            }
            .transition(.slide)
            .animation(animation)
            .onAppear {
                print("Displaying the welcome message")
            }
        }
    }.padding()
}
```

Notice that now the `isOn` argument passed to `Toggle` has a `.animation()` modifier appended to it. With that, we are telling SwiftUI that we intend to perform animations once the state is updated. The kind of transition is specified with the `.transition()` modifier that accepts a member of the `AnyTransition` structure. To easily transition all the views related to the welcome message, we wrapped them on a `VStack` and added the `transition()` modifier to them.

There are many defaults transitions that we can use. In this case we are using the `AnyTransition.slide` transition. We can go a step beyond and add our custom transitions as well! Swift has a cool feature call [extensions][] that allow us to add new functionality to existing types. If we make an extension to the `AnyTransition` struct, we can create our own transition. For our case, let's combine moving and fading at the same time. For this, add this code at the end of our `ContentView.swift` file:

```swift
// ContentView.swift

extension AnyTransition {
    static var moveAndFade: AnyTransition {
        return AnyTransition.move(edge: .trailing)
            .combined(with: .opacity)
    }
}
```

As you can see it is composed of other basic transitions. In this case, `move` and `opacity`. In order to use it, we just need to go ahead and replace our `transition(.slide)` references to `transition(.moveAndFade)`. Run the preview again and see how the animation changes. But what if we would want to make it a little bit faster? We can modify the kind of animation applied to the transition by using the `animation()` modifier. For this, let's add a [computed property][] to our `ContentView` with an specification of how we want the transition to be handled and add the `animation()` modifier next to our `transition(.moveAndFade)` references.

```swift
struct ContentView: View {
    // ...

    var animation: Animation {
        Animation.spring(dampingFraction: 0.5)
            .speed(2)
            .delay(0.1)
    }

    var body: some View {
        VStack(alignment: .center) {
            Toggle(isOn: $showViewer.animation()) {
                Text("Display PDF")
            }
            if showViewer {
                PSPDFKitView(url: documentURL, configuration: configuration)
                .transition(.moveAndFade)
                .animation(animation)
                .onAppear {
                    print("Displaying the PDF")
                }
            } else {
                VStack(alignment: .leading) {
                    Spacer()
                    Text("Welcome!")
                        .font(.title)
                        .padding(.bottom)
                    Text("Ready to display the PDF")
                    Spacer()
                }
                .transition(.moveAndFade)
                .animation(animation)
                .onAppear {
                    print("Displaying the welcome message")
                }
            }
        }.padding()
    }
}
```

In this case, we are using a `spring` animation with certain speed and a minor delay for a more impactful switch between viewers. Play a little bit with the example and observe the difference between adding the `animation()` modifier and removing it. You can also change the `animation` computed property definition to see the different options available in SwiftUI. For this, the autocompletion that Xcode offers is your friend. Try for instance removing the `Animation.spring(dampingFraction: 0.5)` and type `Animation.`, wait a second and Xcode should list the options available for you to try.

## Environment Object

For certain use cases it can be really handy to declare state that should be shared across multiple views of our app, sort of like what [Context][react context] provides to us on React. SwiftUI gives us `@EnvironmentObject`. With it, we can define part of the state on a container that later can be easily attached from multiple SwiftUI views, so that they can read the latest value or update it accordingly.

For our example, let's add a new feature to our app. We are going to allow users to toggle between PDF files containing information about two of our products: [PSPDFKit for iOS][] and [PSPDFKit for Web][]. Notice that besides the `"PSPDFkit for iOS 9 Quickstart Guide.pdf"` there is a `"PSPDFKit for Web.pdf"` file that we aren't currently using. Types that conform to the `ObservableObject` protocol that's part of the `Combine` framework can be observed for changes and automatically notify views when a change occurs. In our implementation, we will keep an array with the available files and a `Int` variable that will contain the index that represents the file that is currently loaded. Create a new `PDFState.swift` file:

```swift
// PDFState.swift

import Combine
import SwiftUI

final class PDFState: ObservableObject {
    let pdfDocuments = ["PSPDFKit 9 QuickStart Guide", "PSPDFKit for Web"]
    @Published var currentPDFIndex = 0
}
```

The main difference from a regular class that we can distinguish is the usage of the `@Published` property wrapper. With it, we declare that the property is observable and will automatically notify when changes occur. Notice that we only need it for `currentPDFIndex`, since `pdfDocuments` is a constant.

Now, we should go back to our `ContentView` and add references to this observable state. I'll go ahead and show the final version of the file and mention the relevant changes:

```swift
// ContentView.swift

struct ContentView: View {
    @EnvironmentObject private var pdfState: PDFState

    var documentURL:URL {
        return Bundle.main.url(forResource: 
          pdfState.pdfDocuments[pdfState.currentPDFIndex],
          withExtension: "pdf")!
    }

    @State var showViewer = true

    // ...

    var body: some View {
        VStack(alignment: .leading) {
            Toggle(isOn: $showViewer.animation()) {
                Text("Display PDF")
            }
            HStack(alignment: .center) {
                Text("PDF")
                Picker(selection: $pdfState.currentPDFIndex, label: Text("PDF")) {
                    ForEach(0 ..< pdfState.pdfDocuments.count) {
                        Text(self.pdfState.pdfDocuments[$0])
                    }
                }.pickerStyle(SegmentedPickerStyle())
            }
            if showViewer {
                PSPDFKitView(url: documentURL, configuration: configuration)
                .transition(.moveAndFade)
                .animation(animation)
                .onAppear {
                    print("Displaying the PDF")
                }
            } else {
                VStack(alignment: .leading) {
                    Spacer()
                    Text("Welcome!")
                        .font(.title)
                        .padding(.bottom)
                    Text("Ready to display \"\(self.pdfState.pdfDocuments[self.pdfState.currentPDFIndex])\"")
                    Spacer()
                }
                .transition(.moveAndFade)
                .animation(animation)
                .onAppear {
                    print("Displaying the welcome message")
                }
            }
        }.padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
        .environmentObject(PDFState())
    }
}
```

We added a reference to our shared state by using the `@EnvironmentObject` property wrapper on the `pdfState` variable declaration. Next, we changed the declaration of the `documentURL` variable as a computed property that will derive its value on `pdfState.currentPDFIndex`.

To switch between the documents, we added a `Picker` view that will update the selected PDF thanks to its `$pdfState.currentPDFIndex` binding. Notice that we also have a `Text` as a label and that they are contained by a `HStack` for making them appear in the same row. Another interesting aspect is the `ForEach` view as the child of `Picker`. It allows us to iterate over a range and return multiple instances of the same subview. In our case, the subview we need to render is just a `Text` with the title of each PDF file. A final interesting detail that this example shows us is the usage of predefined appearances for the picker. We have the `pickerStyle()` modifier in action, that is used here to apply the `SegmentedPickerStyle` to the picker.

Notice that we also updated our `ContentView_Previews` struct, where we added the `environmentObject()` modifier with a new instance of `PDFState`. This will allow our preview view to work with a clean copy of our global state. In a similar fashion, we need to go to `SceneDelegate.swift` and update the instantiation of our `ContentView` there to add the same modifier to attach our state to it. For this find the declaration of the `contentView` variable and update it to this:

```swift
// SceneDelegate.swift

let contentView = ContentView().environmentObject(PDFState())
```

If you try to run the example as it is right now you'll notice that the file being displayed doesn't actually changed when you select a different file. That's because even though the bindings are in place and the SwiftUI views are reactively updated, `PSPDFKitView` is not a native SwiftUI view. So even though one of the props that it receives changed, it doesn't know how to react to those changes. In order to make this work we need to go back to our "bridge" representation struct and change the implementation of the `updateUIView` method on it. This method is called whenever one of the properties of the view changes and it allows us to perform the adjustments we need to update the underlying UI.

Go to `PSPDFKitView.swift` and update the `updateUIView` method of `PDFViewController` like this:

```swift
// PSPDFKitView.swift

func updateUIViewController(_ uiViewController: UINavigationController, context: UIViewControllerRepresentableContext<PDFViewController>) {
        let pdfController = uiViewController.viewControllers.first! as! PSPDFViewController
        pdfController.document = PSPDFDocument(url: url)
=}
```

Now you can go ahead and try our example app again, you will see how changing the document to display actually updates the viewer.

## Conclusion

Even though starting with iOS development is a entirely different world for a web developer. SwiftUI allows you to think in terms of state and model the view as a function of it, just like one could be used to with web frameworks like React, Vue or Svelte. The main challenge relies on learning the Swift programming language and getting to know what the native UI controls are, how styling and layout work, and how idiomatic code looks like in this context. I hope this post sparks your curiosity and keep exploring how SwiftUI works and the different ways you can model your app with it.


[jetpack compose]: https://developer.android.com/jetpack/composeu
[swiftui]: https://developer.apple.com/xcode/swiftui/
[wwdc19]: https://developer.apple.com/wwdc19/
[pspdfkit for ios]: https://pspdfkit.com/pdf-sdk/ios/
[pspdfkit for web]: https://pspdfkit.com/pdf-sdk/web/
[swiftui blog post]: https://pspdfkit.com/blog/2019/how-to-show-a-pdf-in-swiftui/
[`uiviewcontrollerrepresentable`]: https://developer.apple.com/documentation/swiftui/uiviewcontrollerrepresentable
[`previewprovider`]: https://developer.apple.com/documentation/swiftui/previewprovider
[fragments]: https://reactjs.org/docs/fragments.html
[flexbox]: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
[extensions]: https://docs.swift.org/swift-book/LanguageGuide/Extensions.html
[computed property]: https://docs.swift.org/swift-book/LanguageGuide/Properties.html
[react context]: https://reactjs.org/docs/context.html
[swift tour]: https://docs.swift.org/swift-book/GuidedTour/GuidedTour.html
[link-to-sample-project-final]: /images/blog/2019/intro-to-swiftui-for-react-developers/PSPDFKitSwiftUIReactDevs-Final.zip
[link-to-sample-project-initial]: /images/blog/2019/intro-to-swiftui-for-react-developers/PSPDFKitSwiftUIReactDevs-Initial.zip
[customer portal]: https://customers.pspdfkit.com/
[trial]: https://pspdfkit.com/try/
[`pspdfviewcontroller`]: https://pspdfkit.com/api/ios/Classes/PSPDFViewController.html
[`pspdfconfiguration`]: https://pspdfkit.com/api/ios/Classes/PSPDFConfiguration.html
[xcode]: http://itunes.apple.com/us/app/xcode/id497799835?ls=1&mt=12
