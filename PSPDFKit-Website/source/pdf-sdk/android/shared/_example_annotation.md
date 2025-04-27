[==

```kotlin
// Open the document.
val documentUri = // PDF document URI from a writable location.
val document = PdfDocumentLoader.openDocument(context, documentUri)

// Create a custom stamp annotation on the first page.
val stampAnnotation = StampAnnotation(0, RectF(180f, 150f, 444f, 500f), "Vector stamp")
// Set PDF from assets containing vector logo as annotation's appearance stream generator.
stampAnnotation.appearanceStreamGenerator = AssetAppearanceStreamGenerator("images/PSPDFKit_Logo.pdf")

// Add the annotation to the document.
document.getAnnotationProvider().addAnnotationToPage(stampAnnotation)

// Save the document.
document.saveIfModified()
```

```java
// Open the document.
final Uri documentUri = // PDF document URI from a writable location.
PdfDocument document = PdfDocumentLoader.openDocument(context, documentUri);

// Create a custom stamp annotation on the first page.
StampAnnotation stampAnnotation = new StampAnnotation(0, new RectF(180f, 150f, 444f, 500f), "Vector stamp");
// Set PDF from assets containing vector logo as annotation's appearance stream generator.
stampAnnotation.setAppearanceStreamGenerator(new AssetAppearanceStreamGenerator("images/PSPDFKit_Logo.pdf"));

// Add the annotation to the document.
document.getAnnotationProvider().addAnnotationToPage(stampAnnotation);

// Save the document.
document.saveIfModified();
```

==]
