```csharp
<ui:PdfView Name="PdfView" License="{StaticResource license}"/>

private async void AddApprovedStampAsync(StorageFile pdfFile)
{
    await PdfView.OpenStorageFileAsync(file);

    var currentPage = await PdfView.Controller.GetCurrentPageIndexAsync();
    var pageSize = await PdfView.Document.GetPageSizeAsync(currentPage);

    var stamp = new Stamp
    {
        // Place it in the center of the page.
        BoundingBox = new Rect((pageSize.Width/2)-50, (pageSize.Height/2)-25, 100, 50),
        StampType = StampType.Approved,
        PageIndex = currentPage,
    };

    // Add it to the document.
    await PdfView.Document.CreateAnnotationAsync(stamp);
}
```
