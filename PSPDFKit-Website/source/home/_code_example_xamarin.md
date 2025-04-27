```csharp
var document = new PSPDFDocument (NSUrl.FromFilename ("Pdf/PSPDFKit QuickStart Guide.pdf"));
var pdfViewer = new PSPDFViewController (document);
// Create a custom button for the toolbar
var addStampButton = new UIBarButtonItem("Add Stamp", UIBarButtonItemStyle.Plain, null);

addStampButton.Clicked += (sender, args) => {
    var annotationsList = new List<PSPDFAnnotation>();

   // Stamp annotation sample
   var approvedStamp = new PSPDFStampAnnotation
   {
       StampType = PSPDFStampType.Approved,
       BoundingBox = new CGRect(150, 120, 100, 50),
       // Adds the annotation to the currently viewed page
       PageIndex = pdfViewer.PageIndex
   };
   annotationsList.Add(approvedStamp);

   PSPDFAnnotation[] annotationsArray;
   annotationsArray = annotationsList.ToArray();
   pdfViewer.Document.AddAnnotations(annotationsArray, options: null);
};

pdfViewer.NavigationItem.RightBarButtonItems = new UIBarButtonItem[] { addStampButton };
NavigationController.PushViewController (pdfViewer, true);
```
