---
title: "How to Show a PDF in SwiftUI"
description: "How to show a PDF using SwiftUI, Apple's PDFKit, and PSPDFKit for iOS."
preview_image: /images/blog/2019/how-to-show-a-pdf-in-swiftui/article-header.png
section: blog
author:
  - Rad Azzouz
author_url:
  - https://twitter.com/radazzouz
date: 2019-06-10 8:00 UTC
tags: iOS, Development, Swift, PDF
published: true
secret: false
---

Apple announced SwiftUI at [WWDC19][] last week, and we are very excited about it. SwiftUI is Apple’s declarative framework for quickly creating user interfaces in Swift on all Apple platforms.

We immediately got started with [Apple SwiftUI tutorials][swiftui-tutorial], we bridged [Apple’s PDFKit PDFView][pdfkit-pdfview-api] and [`PSPDFViewController` from PSPDFKit][`pspdfviewcontroller`] to SwiftUI, and we saw great results within the hour! 🤯
READMORE

In this article, we’ll discuss how to show a PDF document using SwiftUI, [Apple’s PDFKit][apple-pdfkit], and [PSPDFKit for iOS][] in a few simple steps.

![pspdfkit-swiftui](/images/blog/2019/how-to-show-a-pdf-in-swiftui/pspdfkit-swiftui.png)

## Prerequisites

- Xcode 11
- iOS device running iOS 13 or the iOS Simulator
- PSPDFKit for iOS

## Getting Started

- Download the [sample project here][link-to-sample-project].
- If you’re an existing customer, download PSPDFKit for iOS from the [customer portal][] . Otherwise, if you don’t already have PSPDFKit, [sign up for our 60-day trial][trial] and you will receive an email with the instructions for getting started.
- Copy `PSPDFKit.xcframework` and `PSPDFKitUI.xcframework` into `PSPDFKitSwiftUI/PSPDFKit` in the sample project directory.
- Open `PSPDFKitSwiftUI.xcodeproj` in Xcode 11 and run it.

The rest of this post will walk you through the steps we went through to create the sample project.

## Showing a PDF Using Apple’s PDFKit

Let’s first discuss how to show a PDF in SwiftUI using [Apple’s PDFKit][apple-pdfkit].

### Bridging PDFView to SwiftUI

We begin by declaring the `PDFKitRepresentedView` struct, which conforms to the [`UIViewRepresentable`][] protocol, so that we can bridge from UIKit to SwiftUI. After that, we add a property of type `URL` and implement the protocols as seen below:

```swift

struct PDFKitRepresentedView: UIViewRepresentable {
    let url: URL

    init(_ url: URL) {
        self.url = url
    }

    func makeUIView(context: UIViewRepresentableContext<PDFKitRepresentedView>) -> PDFKitRepresentedView.UIViewType {
        // Create a `PDFView` and set its `PDFDocument`.
        let pdfView = PDFView()
        pdfView.document = PDFDocument(url: self.url)
        return pdfView
    }

    func updateUIView(_ uiView: UIView, context: UIViewRepresentableContext<PDFKitRepresentedView>) {
        // Update the view.
    }
}

```

### Creating the SwiftUI View

As the next step, we declare `PDFKitView` (the SwiftUI view) with the URL property, like so:

```swift
struct PDFKitView: View {
    var url: URL

    var body: some View {
        PDFKitRepresentedView(url)
    }
}
```

### Using PDFKitView in SwiftUI

We can now use `PDFKitView` in our SwiftUI content view:

```swift
struct ContentView: View {
	let documentURL = Bundle.main.url(forResource: "PSPDFKit 9 QuickStart Guide", withExtension: "pdf")!
	var body: some View {
		VStack(alignment: .leading) {
			Text("PSPDFKit SwiftUI")
				.font(.largeTitle)
			HStack(alignment: .top) {
				Text("Made with ❤ at WWDC19")
					.font(.title)
			}
			PDFKitView(url: documentURL)
		}
	}
}
```

## Showing a PDF Using PSPDFKit for iOS

Apple’s PDFKit provides a great starting point for integrating PDF support into your iOS app. PSPDFKit, on the other hand, is a cross-platform PDF framework with more advanced features, fine-grained control over various aspects of PDF handling, and plenty of customization options. Please take a look at our [detailed feature breakdown guide][] for more details.

Let’s now talk about how to show a PDF in SwiftUI using [PSPDFKit for iOS][].

### Bridging PSPDFViewController to SwiftUI

First, declare the `PDFViewController` struct, which conforms to the [`UIViewControllerRepresentable`][] protocol, so that you can bridge from UIKit to SwiftUI. After that, add a property of type `PSPDFConfiguration` and implement the protocols as seen below:

```swift

struct PDFViewController: UIViewControllerRepresentable {
    let url: URL
    let configuration: PSPDFConfiguration?

    init(_ url: URL, configuration: PSPDFConfiguration?) {
        self.url = url
        self.configuration = configuration
    }

    func makeUIViewController(context: UIViewControllerRepresentableContext<PDFViewController>) -> UINavigationController {
        // Create a `PSPDFDocument`.
        let document = PSPDFDocument(url: url)

        // Create the `PSPDFViewController`.
        let pdfController = PSPDFViewController(document: document, configuration: configuration)
        return UINavigationController(rootViewController: pdfController)
    }

    func updateUIViewController(_ uiViewController: UINavigationController, context: UIViewControllerRepresentableContext<PDFViewController>) {
        // Update the view controller.
    }
}

```

### Creating the SwiftUI View

In the following step, declare `PDFView` (the SwiftUI view) with the URL and the optional [`PSPDFConfiguration`][pspdfconfiguration-api] properties, like so:

```swift
struct PSPDFKitView: View {
    var url: URL
    var configuration: PSPDFConfiguration?

    var body: some View {
        PDFViewController(url, configuration: configuration)
    }
}
```

### Using PSPDFKitView in SwiftUI

And finally, use `PSPDFKitView` in your SwiftUI content view:

```swift
struct ContentView: View {
    let documentURL = Bundle.main.url(forResource: "PSPDFKit 9 QuickStart Guide", withExtension: "pdf")!
    let configuration = PSPDFConfiguration {
        $0.pageTransition = .scrollContinuous
        $0.pageMode = .single
        $0.scrollDirection = .vertical
        $0.backgroundColor = .white
    }
    var body: some View {
		VStack(alignment: .leading) {
			Text("PSPDFKit SwiftUI")
				.font(.largeTitle)
			HStack(alignment: .top) {
				Text("Made with ❤ at WWDC19")
					.font(.title)
			}
			PSPDFKitView(url: documentURL, configuration: configuration)
		}
	}
}
```

That’s all! Here it is in action:

<video src="/images/blog/2019/how-to-show-a-pdf-in-swiftui/swiftui-video.mp4" poster="/images/blog/2019/how-to-show-a-pdf-in-swiftui/swiftui-video.mp4" width="100%" data-controller="video" data-video-autoplay="true" controls playsinline loop muted></video>

## Conclusion

We were very impressed with how quickly we could implement user interfaces with SwiftUI. We plan to officially support SwiftUI in PSPDFKit in the fall.

[wwdc19]: https://developer.apple.com/wwdc19/
[apple-pdfkit]: https://developer.apple.com/documentation/pdfkit
[pspdfkit for ios]: https://pspdfkit.com/pdf-sdk/ios/
[swiftui-tutorial]: https://developer.apple.com/tutorials/swiftui
[customer portal]: https://customers.pspdfkit.com/
[trial]: https://pspdfkit.com/try/
[pdfkit-pdfview-api]: https://developer.apple.com/documentation/pdfkit/pdfview
[`pspdfviewcontroller`]: https://pspdfkit.com/api/ios/Classes/PSPDFViewController.html
[link-to-sample-project]: /images/blog/2019/how-to-show-a-pdf-in-swiftui/PSPDFKitSwiftUI.zip
[`uiviewrepresentable`]: https://developer.apple.com/documentation/swiftui/uiviewrepresentable
[detailed feature breakdown guide]: /guides/ios/current/features/detailed-list/
[`uiviewcontrollerrepresentable`]: https://developer.apple.com/documentation/swiftui/uiviewcontrollerrepresentable
[`view`]: https://developer.apple.com/documentation/swiftui/view
[pspdfconfiguration-api]: https://pspdfkit.com/api/ios/Classes/PSPDFConfiguration.html
