---
title: "Customizing Segmented Controls in PSPDFKit"
description: "We show how to customize the segmented controls in the document info coordinator."
preview_image: /images/blog/2019/customize-segmented-controls/article-header.png
section: blog
author:
  - Christoph Mantler
author_url:
date: 2019-07-30 7:00 UTC
tags: iOS, Objective-C, Swift, Development
published: true
secret: false
---

The PSPDFKit SDK is known to allow a lot of customization to be applied by its users, and the segmented controls in our document info coordinator are no exception! People’s preferences vary a lot: some prefer to use images in their app, some prefer text, and some want to add their own touch and customize the images and text. In this blog post, we’ll talk about all of these topics and explain how to easily make use of the relevant customization options.

## Deciding Between Image and Text

By default, PSPDFKit is set to display images in the segmented controls, as they use less space and they generally look cleaner in an app. However, it’s very easy to change this to display text instead. The `PSPDFContainerViewControllerDelegate` protocol provides a method, [`-containerViewController:shouldUseTitleForViewController:`][], which by default returns `false`. By subclassing the [`PSPDFDocumentInfoCoordinator`][], you can implement the dedicated delegate method and return `true`:

[==

```swift
class CustomDocumentInfoCoordinator: PSPDFDocumentInfoCoordinator, PSPDFContainerViewControllerDelegate {
    func containerViewController(_ controller: PSPDFContainerViewController, shouldUseTitleFor viewController: UIViewController) -> Bool {
        return true
    }
}
```

```objc
@interface PSCCustomDocumentInfoCoordinator: PSPDFDocumentInfoCoordinator <PSPDFContainerViewControllerDelegate>
@end

@implementation PSCCustomDocumentInfoCoordinator
- (BOOL)containerViewController:(PSPDFContainerViewController *)controller shouldUseTitleForViewController:(UIViewController *)viewController {
    return YES;
}
@end
```

==]

Then you will also want to override the original class with your custom class so that you can actually use the code above. You can learn more about overriding classes in the corresponding [guide article][overriding classes]. Below you can see how both options will look in the end. Decide for yourself which one is more fitting for your app!

<div id="image-table">
    <table>
        <tr>
            <td>
                <img src="/images/blog/2019/customize-segmented-controls/table-text.png">
            </td>
            <td>
                <img src="/images/blog/2019/customize-segmented-controls/table-image.png">
            </td>
        </tr>
    </table>
</div>

## Customizing Images

You can customize images with the [`PSPDFSegmentImageProviding`][] protocol by overriding the [`segmentImage`][] object and returning your own image. An example for the `PSPDFAnnotationTableViewController` would look like this:

[==

```swift
class CustomAnnotationTableViewController: PSPDFAnnotationTableViewController {
    override var segmentImage: UIImage? {
        get {
            return PSPDFKit.imageNamed("x")
        }
        set {
            // We ignore future changes for the image.
        }
    }
}
```

```objc
@interface PSCCustomAnnotationTableViewController: PSPDFAnnotationTableViewController
@end

@implementation PSCCustomAnnotationTableViewController
- (nullable UIImage *)segmentImage {
    return [PSPDFKit imageNamed:@"x"];
}
@end
```

==]

## Customizing Text

To customize the text of one of the segmented controls, you need to subclass the table view controller of the desired control and override the `title` of that controller. If you want to do this for the annotation table view, you need to subclass [`PSPDFAnnotationTableViewController`][] and set a custom title there. This is shown in the following example:

[==

```swift
class CustomAnnotationTableViewController: PSPDFAnnotationTableViewController {
    override var title: String? {
        get {
            return "CustomTitle"
        }
        set {
            // We ignore future changes for the title.
        }
    }
}
```

```objc
@interface PSCCustomAnnotationTableViewController: PSPDFAnnotationTableViewController
@end

@implementation PSCCustomAnnotationTableViewController
- (NSString *)title {
    return @"CustomTitle";
}
@end
```

==]

## Customizing the Available Document Information

You can choose which document-related information you want to display by customizing the [`availableControllerOptions`][] property of your custom `PSPDFDocumentInfoCoordinator` object associated with your `PSPDFViewController` instance. For example, if you only want to show the outline and the annotation tabs, your code will look like this:

[==

```swift
pdfController.documentInfoCoordinator.availableControllerOptions = [.outline, .annotations]
```

```objc
pdfController.documentInfoCoordinator.availableControllerOptions = @[PSPDFDocumentInfoOptionOutline, PSPDFDocumentInfoOptionAnnotations];
```

==]

The result will look like this in the app:

<img src="/images/blog/2019/customize-segmented-controls/table-outline-annotations.png" width="50%">

To learn more about customizing the available document info, you can take a look at our [Customizing the Available Document Information][customize available document info guide] guide.

[`pspdfsegmentimageproviding`]: https://pspdfkit.com/api/ios/Protocols/PSPDFSegmentImageProviding.html
[`segmentimage`]: https://pspdfkit.com/api/ios/Protocols/PSPDFSegmentImageProviding.html#/c:objc(pl)PSPDFSegmentImageProviding(py)segmentImage
[overriding classes]: https://pspdfkit.com/guides/ios/current/getting-started/overriding-classes/
[`availablecontrolleroptions`]: https://pspdfkit.com/api/ios/Classes/PSPDFDocumentInfoCoordinator.html#/c:objc(cs)PSPDFDocumentInfoCoordinator(py)availableControllerOptions
[customize available document info guide]: https://pspdfkit.com/guides/ios/current/customizing-the-interface/customizing-the-available-document-information/
[`-containerviewcontroller:shouldusetitleforviewcontroller:`]: https://pspdfkit.com/api/ios/Protocols/PSPDFContainerViewControllerDelegate.html#/c:objc(pl)PSPDFContainerViewControllerDelegate(im)containerViewController:shouldUseTitleForViewController:
[`pspdfdocumentinfocoordinator`]: https://pspdfkit.com/api/ios/Classes/PSPDFDocumentInfoCoordinator.html
[`pspdfannotationtableviewcontroller`]: https://pspdfkit.com/api/ios/Classes/PSPDFAnnotationTableViewController.html
