```csharp
// Initialize PSPDFKit with your activation key.
PSPDFKit.Sdk.Initialize("YOUR_LICENSE_KEY_GOES_HERE");

// Open a document to work on.
var document = new Document(new FileDataProvider("assets/default.pdf"));

// Add a new stamp annotation.
var jsonObject = new JObject
{
    {
        "bbox",
        new JArray
        {
            0, 0, 100, 50
        }
    },
    {"pageIndex", 0},
    {"type", "pspdfkit/stamp"},
    {"stampType", "Approved"},
    {"opacity", 1},
    {"v", 1}
};
document.GetAnnotationProvider().AddAnnotationJson(jsonObject);

// Export the changes to Instant Document JSON.
document.ExportJson(new FileDataProvider("out/instantOutput.json"));

// Render the first page and save to a PNG.
var image = document.GetPage(0).RenderPage();
image.Save("out/render.png", ImageFormat.Png);
```
