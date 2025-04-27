---
title: "Opening a PDF in Swift"
section: blog

author:
 - Julian Grosshauser
 - Jen Hoverstad
author_url:
 - https://twitter.com/jgrosshauser
 - https://twitter.com/jenhoverstad
date: 2016-07-27 12:00 UTC
tags: iOS, Development, Tutorials 
published: true
---

It's easy to overlook some of our most basic developer actions, because we do them so frequently. However, with the continuous development and increase in the popularity of [Swift](https://swift.org/), we want to revisit a fundamental function that's important to us and hopefully to you, too: opening a PDF.

Here's how it's done (you can find all of the project's files on [GitHub](https://github.com/PSPDFKit/Tutorials/tree/master/iOS/Opening-a-PDF-in-Swift)):

### Step 1: Creating the Project

Xcode - File → New → Project…, choose "Single View Application":

![Single View Application](/images/blog/2016/opening-a-pdf-in-swift/single-view-application.png)

Enter the product and organization names and choose Swift as the language:

![New project options](/images/blog/2016/opening-a-pdf-in-swift/new-project-options.png)

Choose the destination and create the project.

### Step 2: Adding a PDF to the Project

Drag and drop a document into the newly created project. Choose to add it to your app's target:

![Add PDF to target](/images/blog/2016/opening-a-pdf-in-swift/add-pdf-to-target.png)

The document will show up in the file list on the left and in the "Copy Bundle Resources" build phase of your app's target:

![Document in Copy Bundle Resources](/images/blog/2016/opening-a-pdf-in-swift/document-in-copy-bundle-resources.png)

### Step 3: Adding Buttons that Present PDFs

We're going to create our layout in code, so the first thing we do is getting rid of the storyboard file. To complete the removal we also have to reset the main interface:

![Storyboard removal](/images/blog/2016/opening-a-pdf-in-swift/storyboard-removal.png)

Then, we can set up our window and root view controller in `AppDelegate.swift`:

```swift
import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    // Initialize the window.
    var window: UIWindow? = {
        let window = UIWindow(frame: UIScreen.mainScreen().bounds)
        window.backgroundColor = .whiteColor()
        return window
    }()

    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        // Set up the root view controller.
        let viewController = ViewController()
        viewController.title = "PDF Viewer"
        let navigationController = UINavigationController(rootViewController: viewController)

        window?.rootViewController = navigationController
        window?.makeKeyAndVisible()
        return true
    }
}
```

Next, add two buttons to `ViewController.swift`:

```swift
import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // To keep things DRY we're going to define our button attributes in an array
        // and loop over it to create our buttons.
        let buttonAttributes = [(title: "Open Document in Web View", selector: #selector(openDocumentInWebView(_:)), yOffset: CGFloat(-100)),
                                (title: "Open Document in PSPDFKit", selector: #selector(openDocumentInPSPDFKit(_:)), yOffset: CGFloat(100))]

        for buttonAttribute in buttonAttributes {
            let button = UIButton()
            button.translatesAutoresizingMaskIntoConstraints = false
            button.setTitle(buttonAttribute.title, forState: .Normal)
            button.setTitleColor(.blueColor(), forState: .Normal)
            button.sizeToFit()
            button.addTarget(self, action: buttonAttribute.selector, forControlEvents: .TouchUpInside)
            view.addSubview(button)

            // We're using a bit of Auto Layout to keep our buttons centered.
            NSLayoutConstraint(item: button, attribute: .CenterX, relatedBy: .Equal, toItem: view, attribute: .CenterX, multiplier: 1, constant: 0).active = true
            NSLayoutConstraint(item: button, attribute: .CenterY, relatedBy: .Equal, toItem: view, attribute: .CenterY, multiplier: 1, constant: buttonAttribute.yOffset).active = true
        }
    }

    // We'll implement these button actions later.
    @objc
    private func openDocumentInWebView(sender: UIButton) {

    }

    @objc
    private func openDocumentInPSPDFKit(sender: UIButton) {

    }
}
```

Be sure to mark the button actions `@objc` to make the `private` methods callable from Objective-C.

### Step 4: Opening a PDF Inside of a Web View

Xcode - File → New → File…, choose "Swift File":

![Swift file](/images/blog/2016/opening-a-pdf-in-swift/swift-file.png)

Name the file `WebViewController`.

Inside of the new file, we're creating a new class `WebViewController` that contains a web view:

```swift
import UIKit

class WebViewController: UIViewController {

    // We're going to show a PDF with the help of this web view.
    let webView = UIWebView()

    override func viewDidLoad() {
        super.viewDidLoad()
        // Make sure the web view is shown fullscreen.
        webView.frame = view.frame
        view.addSubview(webView)
    }
}
```

Next, we can implement `openDocumentInWebView` in `ViewController.swift`:

```swift
@objc
private func openDocumentInWebView(sender: UIButton) {
    // Get URL of PDF document.
    guard let documentURL = NSBundle.mainBundle().resourceURL?.URLByAppendingPathComponent("Document.pdf") else { return }
    let urlRequest = NSURLRequest(URL: documentURL)

    // Create web view controller.
    let webViewController = WebViewController()
    webViewController.webView.loadRequest(urlRequest)

    let navigationController = UINavigationController(rootViewController: webViewController)
    // Add a close button that dismisses the web view controller.
    webViewController.navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Close", style: .Plain, target: self, action: #selector(dismissController(_:)))
    // Present the document.
    presentViewController(navigationController, animated: true, completion: nil)
}

@objc
private func dismissController(sender: UIBarButtonItem) {
    dismissViewControllerAnimated(true, completion: nil)
}
```

After only these few steps we're able to tap on the button and scroll through a PDF document, but nothing else.
No zooming, no annotations, only the one scrolling view mode and no other functionality.

Here's where [PSPDFKit](https://pspdfkit.com) comes in.

### Opening a PDF with PSPDFKit

You can download a demo version of PSPDFKit by going to [pspdfkit.com](https://pspdfkit.com) and clicking on the "Try Now" button. 
All you have to do is drag & drop `PSPDFKit.framework` from the .dmg you just downloaded into the "Embedded Binaries" section of your app's target:

![Embedded Binaries section of your app's target](/images/blog/2016/opening-a-pdf-in-swift/embedded-binaries.png)

`PSPDFKit.framework` will also show up in "Linked Frameworks and Libraries".  
Take a look at our [documentation](https://pspdfkit.com/guides/ios/current/getting-started/integrating-pspdfkit/) to get more information about integrating PSPDFKit.

We start using PSPDFKit by importing the module and implementing `openDocumentInPSPDFKit` in `ViewController.swift`:

```swift
// First we need to import the PSPDFKit module.
import PSPDFKit

@objc
private func openDocumentInPSPDFKit(sender: UIButton) {
    // Get URL of PDF document.
    guard let documentURL = NSBundle.mainBundle().resourceURL?.URLByAppendingPathComponent("Document.pdf") else { return }

    // Create PSPDFDocument and PSPDFViewController.
    let document = PSPDFDocument(URL: documentURL)
    let pdfController = PSPDFViewController(document: document)

    // Present document.
    let navigationController = UINavigationController(rootViewController: pdfController)
    presentViewController(navigationController, animated: true, completion: nil)
}
```

Now we can view PDF documents in PSPDFKit. But not only that: We can zoom, create annotations, take a look at the document's outline and lots of other things. All this with just these few lines of code. If we want to customize our PDF viewer further, we just need to [pass](https://pspdfkit.com/api/ios/Classes/PSPDFViewController.html#/c:objc(cs)PSPDFViewController(im)initWithDocument:configuration:) a [`PSPDFConfiguration`](https://pspdfkit.com/api/ios/Classes/PSPDFConfiguration.html) object to [`PSPDFViewController`](https://pspdfkit.com/api/ios/Classes/PSPDFViewController.html).

Notice how we didn't even need to implement a close button. Why? Because PSPDFKit automatically detects that `PSPDFViewController` is presented modally and adds the close button to the navigation bar. Our main goal is to help developers with their jobs, and one of the ways we help them is by creating less things to implement.

### Finished Implementation

When we put it all together, here's what the final `ViewController.swift` implementation will look like:

```swift
import UIKit
import PSPDFKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // To keep things DRY we're going to define our button attributes in an array
        // and loop over it to create our buttons.
        let buttonAttributes = [(title: "Open Document in Web View", selector: #selector(openDocumentInWebView(_:)), yOffset: CGFloat(-100)),
                                (title: "Open Document in PSPDFKit", selector: #selector(openDocumentInPSPDFKit(_:)), yOffset: CGFloat(100))]

        for buttonAttribute in buttonAttributes {
            let button = UIButton()
            button.translatesAutoresizingMaskIntoConstraints = false
            button.setTitle(buttonAttribute.title, forState: .Normal)
            button.setTitleColor(.blueColor(), forState: .Normal)
            button.sizeToFit()
            button.addTarget(self, action: buttonAttribute.selector, forControlEvents: .TouchUpInside)
            view.addSubview(button)

            // We're using a bit of Auto Layout to keep our buttons centered.
            NSLayoutConstraint(item: button, attribute: .CenterX, relatedBy: .Equal, toItem: view, attribute: .CenterX, multiplier: 1, constant: 0).active = true
            NSLayoutConstraint(item: button, attribute: .CenterY, relatedBy: .Equal, toItem: view, attribute: .CenterY, multiplier: 1, constant: buttonAttribute.yOffset).active = true
        }
    }

    @objc
    private func openDocumentInWebView(sender: UIButton) {
        // Get URL of PDF document.
        guard let documentURL = NSBundle.mainBundle().resourceURL?.URLByAppendingPathComponent("Document.pdf") else { return }
        let urlRequest = NSURLRequest(URL: documentURL)

        // Create web view controller.
        let webViewController = WebViewController()
        webViewController.webView.loadRequest(urlRequest)

        // Present the document.
        let navigationController = UINavigationController(rootViewController: webViewController)
        webViewController.navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Close", style: .Plain, target: self, action: #selector(dismissController(_:)))
        presentViewController(navigationController, animated: true, completion: nil)
    }

    @objc
    private func openDocumentInPSPDFKit(sender: UIButton) {
        // Get URL of PDF document.
        guard let documentURL = NSBundle.mainBundle().resourceURL?.URLByAppendingPathComponent("Document.pdf") else { return }

        // Create PSPDFDocument and PSPDFViewController.
        let document = PSPDFDocument(URL: documentURL)
        let pdfController = PSPDFViewController(document: document)

        // Present document.
        let navigationController = UINavigationController(rootViewController: pdfController)
        presentViewController(navigationController, animated: true, completion: nil)
    }

    @objc
    private func dismissController(sender: UIBarButtonItem) {
        dismissViewControllerAnimated(true, completion: nil)
    }
}
```
