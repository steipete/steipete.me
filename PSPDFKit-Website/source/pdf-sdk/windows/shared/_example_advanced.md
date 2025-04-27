```xaml
<Page
    x:Class="AdvancedExample.MainPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="using:AdvancedExample"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d"
    Background="{ThemeResource ApplicationPageBackgroundThemeBrush}">

    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="*"/>
            <RowDefinition Height="52"/>
        </Grid.RowDefinitions>
        <WebView Margin="10"
                 Name="MainWebView"
                 NavigationStarting="MainWebView_NavigationStarting"
                 NavigationCompleted="MainWebView_NavigationCompleted"
                 Source="ms-appx-web:///Assets/pspdfkit/index.html"/>
        <Button Content="Open PDF" HorizontalAlignment="Left" Margin="10" Grid.Row="1" Click="Button_OpenPDF_Click"/>
    </Grid>
</Page>
```

<p class="py-3"></p>

```csharp
public sealed partial class MainPage : Page
{
    private const string CssLocation = "ms-appx-web:///Assets/pspdfkit/windows.css";
    private Controller _controller;

    public MainPage()
    {
        InitializeComponent();

        // Get your license...
        var pspdfkitLicense = "YOUR LICENSE GOES HERE";
        // And initialize the SDK with it.
        Sdk.Initialize(pspdfkitLicense);
    }

    // Once the WebView is ready create an instance of the API and initialize it with the WebView
    private void MainWebView_NavigationStarting(WebView sender, WebViewNavigationStartingEventArgs args)
    {
        // This is the location of the standard CSS for Windows
        // You may provide your own CSS. See The CSS section here https://pspdfkit.com/api/web/css-General.html

        // We need to attach a Controller to the WebView
        _controller = new Controller(sender, new Uri(CssLocation));
    }

    private async void MainWebView_NavigationCompleted(WebView sender, WebViewNavigationCompletedEventArgs args)
    {
        // The WebView has loaded the UI so we can display a PDF now.
        try
        {
            var file = await StorageFile.GetFileFromApplicationUriAsync(new Uri("ms-appx:///Assets/document.pdf"));
            if (file == null) return;

            await _controller.ShowDocumentAsync(DocumentSource.CreateFromStorageFile(file));
        }
        catch (Exception e)
        {
            var messageDialog = new MessageDialog(e.Message);
            await messageDialog.ShowAsync();
        }
    }

    private async Task<StorageFile> PickPDF()
    {
        var picker = new FileOpenPicker
        {
            ViewMode = PickerViewMode.Thumbnail,
            SuggestedStartLocation = PickerLocationId.DocumentsLibrary
        };
        picker.FileTypeFilter.Add(".pdf");

        return await picker.PickSingleFileAsync();
    }

    private async void Button_OpenPDF_Click(object sender, RoutedEventArgs e)
    {
        var file = await PickPDF();
        if (file == null) return;

        // Open and display it in the PSPDFKit PDFView
        await _controller.ShowDocumentAsync(DocumentSource.CreateFromStorageFile(file));
    }
}
```
