[==

```kotlin
// We are opening a document from application assets.
val documentUri = Uri.parse("file:///android_asset/getting-started-guide.pdf")

// Use the configuration to set main PSPDFKit options.
val configuration = PdfActivityConfiguration.Builder(context)
    // Switch to continuous vertical scrolling.
    .scrollMode(PageScrollMode.CONTINUOUS)
    .scrollDirection(PageScrollDirection.VERTICAL)
    // Disable the thumbnail bar.
    .setThumbnailBarMode(ThumbnailBarMode.THUMBNAIL_BAR_MODE_NONE)
    // etc.
    // Finally build the configuration.
    .build()

// Build the Intent for launching PdfActivity.
val intent = PdfActivityIntentBuilder.fromUri(context, documentUri)
    // Pass the configuration here.
    .configuration(configuration)
    .build()

// Start the PdfActivity.
context.startActivity(intent)
```

```java
// We are opening a document from application assets.
Uri documentUri = Uri.parse("file:///android_asset/getting-started-guide.pdf");

// Use the configuration to set main PSPDFKit options.
PdfActivityConfiguration configuration = new PdfActivityConfiguration.Builder(context)
    // Switch to continuous vertical scrolling.
    .scrollMode(PageScrollMode.CONTINUOUS)
    .scrollDirection(PageScrollDirection.VERTICAL)
    // Disable the thumbnail bar.
    .setThumbnailBarMode(ThumbnailBarMode.THUMBNAIL_BAR_MODE_NONE)
    // etc.
    // Finally build the configuration.
    .build();

// Build the Intent for launching PdfActivity.
Intent intent = PdfActivityIntentBuilder.fromUri(context, documentUri)
    // Pass the configuration here.
    .configuration(configuration)
    .build();

// Start the PdfActivity.
context.startActivity(intent);
```

==]
