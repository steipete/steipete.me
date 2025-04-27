```xaml
<Page
    x:Class="BasicExample.MainPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="using:BasicExample"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:ui="using:PSPDFKit.UI"
    mc:Ignorable="d"
    Background="{ThemeResource ApplicationPageBackgroundThemeBrush}">

    <Page.Resources>
        <x:String x:Key="license">YOUR LICENSE GOES HERE</x:String>
    </Page.Resources>

    <Grid Background="{ThemeResource ApplicationPageBackgroundThemeBrush}">
        <Grid.RowDefinitions>
            <RowDefinition Height="*"/>
            <RowDefinition Height="52"/>
        </Grid.RowDefinitions>
        <ui:PdfView Grid.Row="0" Name="PdfView" License="{StaticResource license}" InitializationCompletedHandler="PdfViewInitializationCompletedHandler"/>
        <Button Content="Open PDF" HorizontalAlignment="Left" Margin="10" Grid.Row="1" Name="Button_OpenPDF" Click="Button_OpenPDF_Click"/>
    </Grid>
</Page>
```

<p class="py-3"></p>

[==

```csharp
// This loads a PDF from `Assets` as soon as the PdfView is ready
private async void PdfViewInitializationCompletedHandler(PdfView sender, Document args)
{
    try
    {
        var file = await StorageFile.GetFileFromApplicationUriAsync(new Uri("ms-appx:///Assets/document.pdf"));
        if (file == null) return;

        await sender.OpenStorageFileAsync(file);
    }
    catch (Exception e)
    {
        var messageDialog = new MessageDialog(e.Message);
        await messageDialog.ShowAsync();
    }
}

// This loads a PDF from a file picked by the user in the UI.
private async void Button_OpenPDF_Click(object sender, RoutedEventArgs e)
{
    // Open a Picker so the user can choose a PDF
    var picker = new FileOpenPicker
    {
        ViewMode = PickerViewMode.Thumbnail,
        SuggestedStartLocation = PickerLocationId.DocumentsLibrary
    };
    picker.FileTypeFilter.Add(".pdf");

    var file = await picker.PickSingleFileAsync();
    if (file == null) return;

    // Open and display it in the PSPDFKit PdfView
    var documentSource = DocumentSource.CreateFromStorageFile(file);
    await PdfView.Controller.ShowDocumentAsync(documentSource);
}
```

```vb
Imports Windows.Storage
Imports Windows.Storage.Pickers
Imports PSPDFKit.Document
Imports PSPDFKit.Pdf
Imports PSPDFKit.UI

Public NotInheritable Class MainPage
    Inherits Page

    Private Async Sub PdfViewInitializationCompletedHandler(sender As PdfView, args As Document)
        Dim file As StorageFile
        file = Await StorageFile.GetFileFromApplicationUriAsync(New Uri("ms-appx:///Assets/document.pdf"))

        If file IsNot Nothing Then
            Await sender.OpenStorageFileAsync(file)
        End If
    End Sub

    Private Async Sub Button_OpenPDF_Click(sender As Object, e As RoutedEventArgs)
        Dim picker As New FileOpenPicker
        picker.FileTypeFilter.Add(".pdf")

        Dim file = Await picker.PickSingleFileAsync
        If file IsNot Nothing Then
            Dim documentSource As DocumentSource
            documentSource = DocumentSource.CreateFromStorageFile(file)
            Await PdfView.Controller.ShowDocumentAsync(documentSource)
        End If
    End Sub
End Class
```

```cpp
// This loads a PDF from `Assets` as soon as the PdfView is ready
void MainPage::PdfViewInitializationCompletedHandler(UI::PdfView^ sender, Pdf::Document^ args)
{
    const auto path = ref new Uri("ms-appx:///Assets/document.pdf");

    create_task(StorageFile::GetFileFromApplicationUriAsync(path))
        .then([this](StorageFile^ file)
        {
            if (file == nullptr) return;

            PdfView->OpenStorageFileAsync(file);
        });
}

// This loads a PDF from a file picked by the user in the UI.
void MainPage::Button_OpenPDF_Click(Platform::Object^ sender, RoutedEventArgs^ e)
{
    // Open a Picker so the user can choose a PDF
    FileOpenPicker^ openPicker = ref new FileOpenPicker();
    openPicker->ViewMode = PickerViewMode::Thumbnail;
    openPicker->SuggestedStartLocation = PickerLocationId::PicturesLibrary;
    openPicker->FileTypeFilter->Append(".pdf");

    create_task(openPicker->PickSingleFileAsync())
        .then([this](StorageFile^ file)
        {
            if (file == nullptr) return;

            // Open and display it in the PSPDFKit PdfView
            const auto documentSource = DocumentSource::CreateFromStorageFile(file);
            PdfView->Controller->ShowDocumentAsync(documentSource);
        });
}
```

==]
