---
title: "Open a PDF on the Universal Windows Platform"
description: "How to display a PDF in your UWP app."
preview_image: /images/blog/2019/open-pdf-in-uwp/header.png
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2019-02-27 8:00 UTC
tags: Windows, UWP, Development, How-To
published: true
secret: false
---

Often times, app developers need to quickly display a PDF document within their application. In this blog post, I’m going to show you how to quickly and easily open a PDF and display it in a UWP app using the [UWP PDF framework][uwp-pdf].

## Getting Started

To start, create a Visual C# Windows Universal blank application in Visual Studio.

![Screenshot of a New Project window in Visual Studio](/images/blog/2019/open-pdf-in-uwp/new-project.png)

You’ll need an `Image` control on the main page and a button to open a file dialog to choose the PDF you want to render.

Open `MainPage.xaml` and change the content of the `<Grid>` element to add the above controls in two rows:

```xml
<Grid>
    <Grid.RowDefinitions>
        <RowDefinition Height="*"></RowDefinition>
        <RowDefinition Height="50"></RowDefinition>
    </Grid.RowDefinitions>
    <Image Name="PdfImage" Grid.Row="0" Margin="10"></Image>
    <Button Grid.Row="1" Margin="10,0,0,0" >Open</Button>
</Grid>
```

Your XAML should look like the following in the designer.

![Main Page XAML](/images/blog/2019/open-pdf-in-uwp/main-page-xaml.png)

Next, add a click event handler for the button to the XAML:

```xml
<Button Grid.Row="1" Margin="10,0,0,0" Click="Button_Click_Open_PDF">Open</Button>
```

The following method in the `MainPage` class handles the click, which will open a file picker dialog. Note that the method must be `async`:

```csharp
private async void Button_Click_Open_PDF(object sender, RoutedEventArgs e)
{
    var picker = new FileOpenPicker
    {
        ViewMode = PickerViewMode.Thumbnail,
        SuggestedStartLocation = PickerLocationId.DocumentsLibrary
    };
    picker.FileTypeFilter.Add(".pdf");

    var file = await picker.PickSingleFileAsync();

    if (file == null) return;

    // Open and display the PDF.
}
```

## Rendering a PDF

To render the PDF file first, you need to open it. Add the following property and method to the `MainPage` class:

```csharp
private PdfDocument _myDocument { get; set; }

private async Task OpenPDFAsync(StorageFile file)
{
    if (file == null) throw new ArgumentNullException();

    _myDocument = await PdfDocument.LoadFromFileAsync(file);
}
```

Then add the call to `OpenPDFAsync` to `Button_Click_Open_PDF`:

```csharp
    // Open and display the PDF.
    await OpenPDFAsync(file);
}
```

Now add a method for rendering a page of an open document to the `Image` control:

```csharp
private async Task DisplayPage(uint pageIndex)
{
    if (_myDocument == null)
    {
        throw new Exception("No document open.");
    }

    if (pageIndex >= _myDocument.PageCount)
    {
        throw new ArgumentOutOfRangeException($"Document has only {_myDocument.PageCount} pages.");
    }

    // Get the page you want to render.
    var page = _myDocument.GetPage(pageIndex);

    // Create an image to render into.
    var image = new BitmapImage();

    using (var stream = new InMemoryRandomAccessStream())
    {
        await page.RenderToStreamAsync(stream);
        await image.SetSourceAsync(stream);

        // Set the XAML `Image` control to display the rendered image.
        PdfImage.Source = image;
    }
}
```

Add a call to `DisplayPage` to `Button_Click_Open_PDF`:

```csharp
// Open and display the PDF.
await OpenPDFAsync(file);
await DisplayPage(0);
```

Now build and run the app, and once it’s running, click on the Open button.

![Open File](/images/blog/2019/open-pdf-in-uwp/open-file.png)

Choose a PDF, click Open, and you should see something like the following.

![Display File](/images/blog/2019/open-pdf-in-uwp/display-file.png)

As you can see, adding buttons to change pages is straightforward. Zooming, printing, and rotating require more work, but they are all possible with the standard UWP framework.

## Conclusion

With very little effort, you can start displaying PDFs in your app in minutes.

If you’re looking for a solution that includes a fully responsive and customizable user interface, support for editing various annotation types, interactive forms and signatures, mobile support, persistence management, and many more features, look no further.

<video src="/images/blog/2019/open-pdf-in-uwp/inkarrow.mp4" width="100%" loop muted playsinline data-controller="video" data-video-autoplay="true"></video>

We at PSPDFKit offer an enterprise-ready PDF solution for UWP and other platforms, along with industry-leading first-class support included with every plan. Click [here][pspdfkit for windows] to learn more and get a trial of PSPDFKit for Windows.

[uwp-pdf]: https://docs.microsoft.com/en-us/uwp/api/windows.data.pdf
[pspdfkit for windows]: https://pspdfkit.com/windows
