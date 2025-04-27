---
title: "Add a Watermark to a PDF in UWP"
description: "How to add a watermark to a PDF on UWP."
preview_image: /images/blog/2019/add-watermark-pdf-uwp/article-header.png
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2019-08-12 7:00 UTC
tags: Windows, UWP, Development, How-To
published: true
secret: false
---

Say you want to add a watermark to your PDF document, maybe before printing it out, and you don’t want to modify pages by hand or persist the watermark in the document itself.

Well, we’ve got you covered. In this blog post, you’ll learn how to add a watermark to every page of a PDF document with [PSPDFKit for Windows][pspdfkit-for-windows].

## Viewport Watermark

To render and add a watermark to a document, we will use [PSPDFKit for Windows][pspdfkit-for-windows], a feature-rich PDF viewer and SDK for Windows.

In this example, we’re adding text that reads Confidential in the middle of each page of the document.

First, we register an event handler for the SDK to be able to request the watermark once it’s needed. We do that in the constructor of our page. The event handler method then creates a `Watermark` class and sets it on the UI `Controller`. Finally, we call `Complete` on the `Deferral` in order to allow the SDK to continue with rendering:

```csharp
public MyAppPAge()
{
  InitializeComponent();

  // Add a callback event handler to provide the watermark to the `PdfView` when needed.
  PDFView.OnWatermarkRequested += PDFViewOnWatermarkRequested;
}

private async void PDFViewOnWatermarkRequested(Controller controller, Deferral deferral)
{
  // The framework will request a watermark once the PDF is loaded.
  using (SoftwareBitmap image = await AssetLoader.GetWatermarkBitmapAsync())
  {
    // Set the watermark on the UI `Controller`.
    controller.ViewWatermark = new Watermark(image)
    {
      // We can place the watermark in a variety of places.
      HorizontalAlignment = HorizontalAlignment.Center,
      VerticalAlignment = VerticalAlignment.Center,
      SizeOnPage = new Size(200, 200)
    };
  }

  deferral.Complete();
}
```

The above code results in the watermark being added to every page, as shown below.

![Screenshot of a watermarked PDF in the viewport](/images/blog/2019/add-watermark-pdf-uwp/watermark-viewport-center.png)

In addition to being able to place the watermark in a variety of positions via the `HorizontalAlignment` and `VerticalAlignment` properties, you can also stretch it to fill the page horizontally, vertically, or both. Stretching can be useful if you want to avoid having to get the size of a page first.

As an example, changing the above to stretch in both directions would look like this:

```csharp
// Set the watermark on the UI `Controller`.
controller.ViewWatermark = new Watermark(image)
{
  // Stretch the watermark across the entire page.
  HorizontalAlignment = HorizontalAlignment.Stretch,
  VerticalAlignment = VerticalAlignment.Stretch,
  SizeOnPage = new Size(200, 200)
};
```

![Screenshot of a stretched watermarked PDF in the viewport](/images/blog/2019/add-watermark-pdf-uwp/watermark-viewport-stretch.png)

## Print Watermark

Often you will need a different watermark for printing than what’s needed for displaying in the viewport. To achieve this, we tell the [`PrintHelper`][print-helper] what the watermark should look like. This example also shows you how to open a PDF and print it without a [`PdfView`][pdfview]:

```csharp
// Find a PDF file somewhere.
var file = await GetStorageFileForPDFAsync();
var documentSource = DocumentSource.CreateFromStorageFile(file);

// Create a `PrintHelper`. UWP requires a `UIElement` in the view tree to attach to for rendering.
// In this case, you could have it hidden on a page like this: <Canvas Name="PrintCanvas" Opacity="0"/>
var printHelper = await PrintHelper.CreatePrintHelperFromSourceAsync(documentSource, this, "PrintCanvas", "PrintWithoutUI");

// For printing, we set a watermark here.
using (var image = await AssetLoader.GetWatermarkBitmapAsync())
{
  printHelper.Watermark = new Watermark(image)
  {
    HorizontalAlignment = HorizontalAlignment.Bottom,
    VerticalAlignment = VerticalAlignment.Right,
    SizeOnPage = new Size(200, 200)
  };
}

await printHelper.ShowPrintUIAsync();
```

As noted in the code comment above, you need a named hidden `Canvas` element in your XAML, as the print helper needs access to the visual tree. Microsoft has indicated this requirement may be relaxed in the future but has shared no timeline for this.

```xml
<Page>
    <Grid>
        <!-- Used by the PrintHelper to print a preview -->
        <Canvas Name="PrintCanvas" Grid.Row="0" Opacity="0"/>
    </Grid>
</Page>
```

Here we’re adding the PSPDFKit logo surrounded by a red box to the bottom right of each page. You can see the result below.

![Screenshot of a watermarked PDF in the print dialog](/images/blog/2019/add-watermark-pdf-uwp/watermark-print.png)

## Conclusion

Adding a watermark to a PDF for the purpose of printing or displaying is very straightforward with [PSPDFKit for Windows][pspdfkit-for-windows].

With powerful and easy-to-use APIs, [PSPDFKit for Windows][pspdfkit-for-windows] can be the right solution if you need to integrate or work with PDFs in your applications.

[pspdfkit-for-windows]: https://pspdfkit.com/pdf-sdk/windows/
[print-helper]: https://pspdfkit.com/api/windows/PSPDFKit/PSPDFKit.PrintHelper.html
[pdfview]: https://pspdfkit.com/api/windows/PSPDFKit/PSPDFKit.UI.PdfView.html
