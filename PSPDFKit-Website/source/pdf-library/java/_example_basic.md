```java
// Initialize PSPDFKit with your activation key.
PSPDFKit.initialize("YOUR_LICENSE_KEY_GOES_HERE");

// Open a document to work on.
File file = new File("assets/default.pdf");
PdfDocument document = new PdfDocument(new FileDataProvider(file));

// Add a new stamp annotation.
JSONObject jsonObject = new JSONObject();
jsonObject.put("bbox", new float[]{0, 0, 100, 50});
jsonObject.put("pageIndex", 0);
jsonObject.put("type", "pspdfkit/stamp");
jsonObject.put("stampType", "Approved");
jsonObject.put("opacity", 1);
jsonObject.put("v", 1);
document.getAnnotationProvider().addAnnotationJson(jsonObject);

// Export the changes to Instant Document JSON.
File jsonFile = new File("out/instantOutput.json");
if (jsonFile.createNewFile()) {
    document.exportDocumentJson(new FileDataProvider(jsonFile));
}

// Render the first page and save to a PNG.
BufferedImage image = document.getPage(0).renderPage();
File pngfile = new File("out/test.png");
boolean success = ImageIO.write(image, "png", pngfile);
```
