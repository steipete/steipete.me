---
title: "Introduction to SwiftUI for React Developers (Part 2)"
description: "A discussion about the basic concepts of SwiftUI from the point of view of a React developer"
preview_image: /images/blog/2020/intro-to-swiftui-for-react-developers-part-2/article-header.png
section: blog
author:
  - Guillermo Peralta
author_url:
  - https://twitter.com/voluntadpear
date: 2020-02-12 8:00 UTC
tags: iOS, Web, Development, Swift, React
published: true
secret: false
---

This is the second and final part of our Introduction to SwiftUI for React Developers series. Before continuing, we recommend you read the [first part][] if you haven’t yet.

In this post, we will continue improving upon our sample application by adding a smooth transition when switching between the welcome message and the PDF viewer. Then, we will show how to change the currently open document and introduce a concept called environment objects.

Without further ado, let’s get started with the changes! Please make sure to have our [sample project][link-to-sample-project-initial] open and include the modifications introduced in the previous post. If you would like to have the final version as a reference, you can download it [from here][link-to-sample-project-final].

## Styling and Animations

The current transition between views is really abrupt. It would be nice to add animated transitions between them to give our users an enhanced switching experience. Unlike what we are used to coming from the Web platform, adding transitions to a SwiftUI view consists mainly of attaching additional modifiers to the views we are declaring.

Here is how a basic transition between the views might look:

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
            .onAppear {
                print("Displaying the welcome message")
            }
        }
    }.padding()
}
```

<video src="/images/blog/2020/intro-to-swiftui-for-react-developers-part-2/slide.mp4" width="33%" loop muted playsinline data-controller="video" data-video-autoplay="true" style="margin-left:auto;margin-right:auto;"></video>

Notice that now the `isOn` argument passed to `Toggle` has an `.animation()` modifier appended to it. We are using it to tell SwiftUI that we intend to perform animations once the state is updated. The kind of transition is specified with the `.transition()` modifier that accepts a member of the `AnyTransition` structure. To easily transition all the views related to the welcome message, we wrapped them on a `VStack` and added the `transition()` modifier to them.

There are many default transitions we can use. In this case, we are using the `AnyTransition.slide` transition. We can go a step beyond and add our custom transitions as well! Swift has a cool feature called [extensions][], and it allow us to add new functionality to existing types. If we make an extension for the `AnyTransition` struct, we can create our own transition. For our case, let’s combine moving and fading at the same time. For this, we add the following code at the end of our `ContentView.swift` file:

```swift
// ContentView.swift

extension AnyTransition {
    static var moveAndFade: AnyTransition {
        return AnyTransition.move(edge: .trailing)
            .combined(with: .opacity)
    }
}
```

As you can see, the extension is composed of other basic transitions: in this case, `move` and `opacity`. In order to use it, we just need to go ahead and replace our `transition(.slide)` references to `transition(.moveAndFade)`. Run the preview again and see how the animation changes.

<video src="/images/blog/2020/intro-to-swiftui-for-react-developers-part-2/move-and-fade.mp4" width="33%" loop muted playsinline data-controller="video" data-video-autoplay="true" style="margin-left:auto;margin-right:auto;"></video>

But what if we wanted to make it a little bit faster? We can modify the kind of animation applied to the transition by using the `animation()` modifier. For this, let’s add a [computed property][] to our `ContentView` with a specification of how we want the transition to be handled. Then we’ll add the `animation()` modifier next to our `transition(.moveAndFade)` references:

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

<video src="/images/blog/2020/intro-to-swiftui-for-react-developers-part-2/move-and-fade-final.mp4" width="33%" loop muted playsinline data-controller="video" data-video-autoplay="true" style="margin-left:auto;margin-right:auto;"></video>

In this case, we are using a `spring` animation with a specific speed and a minor delay for a more graceful switch between views. Play with the example a little bit and observe the difference between adding the `animation()` modifier and removing it. You can also change the `animation` [computed property][] definition to see the different options available in SwiftUI. For this, the autocompletion that Xcode offers is your friend. For instance, remove the `Animation.spring(dampingFraction: 0.5)`. Then type `Animation.`, wait a second, and Xcode should list the options available for you to try.

## Environment Object

For certain use cases, it can be really handy to declare state that should be shared across multiple views of our app, sort of like what [context][react context] provides to us on React. Meanwhile, SwiftUI gives us `@EnvironmentObject`, which we can use to define part of the state on a container that later can be easily attached from multiple SwiftUI views so that they can read the latest value or update it accordingly.

For our example, let’s add a new feature to our app. We are going to allow users to toggle between PDF files containing information about two of our products: [PSPDFKit for iOS][] and [PSPDFKit for Web][]. In addition to the `PSPDFKit for iOS 9 Quickstart Guide.pdf` file, there is a `PSPDFKit for Web.pdf` file that we aren’t currently using. Types that conform to the `ObservableObject` protocol that’s part of the `Combine` framework can be observed for changes and automatically notify views when a change occurs. In our implementation, we will keep an array with the available files and an `Int` variable that will contain the index that represents the file that is currently loaded. Create a new `PDFState.swift` file:

```swift
// PDFState.swift

import Combine
import SwiftUI

final class PDFState: ObservableObject {
    let pdfDocuments = ["PSPDFKit 9 QuickStart Guide", "PSPDFKit for Web"]
    @Published var currentPDFIndex = 0
}
```

The main difference to a regular class that we can distinguish is the use of the `@Published` property wrapper. With it, we declare that the property is observable and will automatically notify relevant listeners across the app when changes occur. However, we only need it for `currentPDFIndex`, since `pdfDocuments` is a constant.

Now we should go back to our `ContentView` and add references to this observable state. I’ll go ahead and show the final version of the file and mention the relevant changes:

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

We added a reference to our shared state by using the `@EnvironmentObject` property wrapper on the `pdfState` variable declaration. Next, we changed the declaration of the `documentURL` variable to a computed property that will derive its value on `pdfState.currentPDFIndex`.

To switch between the documents, we added a `Picker` view that will update the selected PDF thanks to its `$pdfState.currentPDFIndex` binding. Notice that we also have a `Text` as a label and that both the `Picker` and the `Text` are contained by an `HStack` in order to make them appear in the same row.

Another interesting aspect is the `ForEach` view as the child of `Picker`. It allows us to iterate over a range and return multiple instances of the same subview. In our case, the subview we need to render is just a `Text` with the title of each PDF file.

A final interesting detail that this example shows us is the usage of predefined appearances for the picker. We have the `pickerStyle()` modifier in place, which is used here to apply the `SegmentedPickerStyle` to the picker.

We also updated our `ContentView_Previews` struct, which is where we added the `environmentObject()` modifier with a new instance of `PDFState`. This will allow our preview view to work with a clean copy of our global state. Similarly, we need to go to `SceneDelegate.swift` and update the instantiation of our `ContentView` to add the same modifier to attach our state to it. To do this, we need to find the declaration of the `contentView` variable and update it to this:

```swift
// SceneDelegate.swift

let contentView = ContentView().environmentObject(PDFState())
```

If you try to run the example as it is right now, you’ll notice that the file being displayed doesn’t actually change when you select a different file. That’s because even though the bindings are in place and the SwiftUI views are reactively updated, `PSPDFKitView` is not a native SwiftUI view. So even though one of the props that it receives changed, it doesn’t know how to react to those changes. In order to make this work, we need to go back to our “bridge” representation struct and change the implementation of the `updateUIView` method on it. This method is called whenever one of the properties of the view changes, and it allows us to perform the adjustments we need to update the underlying UI.

Go to `PSPDFKitView.swift` and update the `updateUIView` method of `PDFViewController` like this:

```swift
// PSPDFKitView.swift

func updateUIViewController(_ uiViewController: UINavigationController, context: UIViewControllerRepresentableContext<PDFViewController>) {
        let pdfController = uiViewController.viewControllers.first! as! PSPDFViewController
        pdfController.document = PSPDFDocument(url: url)
=}
```

Now you can go ahead and try our example app again, and in doing so, you will see how changing the document that is displayed actually updates the viewer.

<video src="/images/blog/2020/intro-to-swiftui-for-react-developers-part-2/final-version.mp4" width="33%" loop muted playsinline data-controller="video" data-video-autoplay="true" style="margin-left:auto;margin-right:auto;"></video>

## Conclusion

Thank you for reading this two-part series about SwiftUI. As a web developer who works with the DOM and React daily, it’s been a really interesting ride exploring a technology for an entirely different platform while still feeling comfortable because of the familiarity of the underlying concepts. I hope you have enjoyed this introduction and that you feel comfortable working on new projects using SwiftUI.

[first part]: /blog/2020/intro-to-swiftui-for-react-developers-part-1
[pspdfkit for ios]: https://pspdfkit.com/pdf-sdk/ios/
[pspdfkit for web]: https://pspdfkit.com/pdf-sdk/web/
[extensions]: https://docs.swift.org/swift-book/LanguageGuide/Extensions.html
[computed property]: https://docs.swift.org/swift-book/LanguageGuide/Properties.html
[react context]: https://reactjs.org/docs/context.html
[link-to-sample-project-final]: https://github.com/PSPDFKit-labs/pspdfkit-swiftui-react-devs
[link-to-sample-project-initial]: https://github.com/PSPDFKit-labs/pspdfkit-swiftui-react-devs/tree/initial
[customer portal]: https://customers.pspdfkit.com/
[trial]: https://pspdfkit.com/try/
