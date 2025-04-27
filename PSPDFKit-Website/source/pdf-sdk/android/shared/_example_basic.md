[==

```kotlin
// We are opening a document from application assets.
val documentUri = Uri.parse("file:///android_asset/document.pdf")
// Build the Intent for launching the PdfActivity.
val intent = PdfActivityIntentBuilder.fromUri(context, documentUri).build()
// Launch the activity.
context.startActivity(intent)
```

```java
// We are opening a document from application assets.
Uri documentUri = Uri.parse("file:///android_asset/document.pdf");
// Build the Intent for launching the PdfActivity.
Intent intent = PdfActivityIntentBuilder.fromUri(context, documentUri).build();
// Launch the activity.
context.startActivity(intent);
```

==]
