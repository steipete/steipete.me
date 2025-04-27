---
title: "Rendering PDF Previews"
description: "An overview of how to render PDF previews."
preview_image: /images/blog/2018/rendering-pdf-previews/article-header.png
section: blog
author:
  - Reinhard Hafenscher
date: 2018-05-16 12:00 UTC
tags: Android, Development
published: true
---

When working with PDFs, you will most likely hit a point where you need to render previews for a lot of files.

The truth is, rendering a single page from a PDF couldn’t be simpler. In fact, if you are already using PSPDFKit, we have a great [guide article][] about exactly this topic. But when it comes to rendering previews for a large number of PDFs, there are additional challenges you might not have considered. This blog post will touch on some of them and share the solution we use.  

## Rendering Pages from PDFs

First let’s look at how to render a single page using PSPDFKit:

[==

```kotlin
val document : PdfDocument

// Use this Uri format to access files inside your app's assets.
val documentUri = Uri.parse("file:///android_asset/shopping-center-plan.pdf")

// This synchronously opens the document. To keep your app UI responsive, you should do this call
// on a background thread or use the asynchronous version of this method instead.
document = PdfDocument.openDocument(context, documentUri)

val pageIndex = 0
// Page size is in PDF points (not pixels).
val pageSize : Size = document.getPageSize(pageIndex)
// We define a target width for the resulting bitmap and use it to calculate the final height.
val width = 2048
val height = (pageSize.height * (width / pageSize.width)).toInt()

// This will render the first page uniformly into a bitmap with a width of 2048 pixels.
val pageBitmap : Bitmap = document.renderPageToBitmap(context, pageIndex, width, height)
```

```java
final PdfDocument document;

// Use this Uri format to access files inside your app's assets.
final Uri documentUri = Uri.parse("file:///android_asset/shopping-center-plan.pdf");

// This synchronously opens the document. To keep your app UI responsive, you should do this call
// on a background thread or use the asynchronous version of this method instead.
document = PdfDocument.openDocument(context, documentUri);

final int pageIndex = 0;
// Page size is in PDF points (not pixels).
final Size pageSize = document.getPageSize(pageIndex);
// We define a target width for the resulting bitmap and use it to calculate the final height.
final int width = 2048;
final int height = (int) (pageSize.height * (width / pageSize.width));

// This will render the first page uniformly into a bitmap with a width of 2048 pixels.
final Bitmap pageBitmap = document.renderPageToBitmap(context, pageIndex, width, height);
```

==]

Now if you aren’t yet using PSPDFKit, or if your use case only requires simple PDF rendering, the [`PdfRenderer`] that ships with Android 5.0/API 21 works just fine. Here’s a quick example of how to use it:

[==

```kotlin
// Create a new PdfRenderer for your document.
val pdfRenderer = PdfRenderer(ParcelFileDescriptor.open(documentFile, ParcelFileDescriptor.MODE_READ_ONLY))

// Open the first page of the document.
val page = pdfRenderer.openPage(0)

// Define a target width for the resulting bitmap and use it to calculate the final height.
val width = 2048
val height = (page.height * (width / page.width)).toInt()

// Create the bitmap to render the page to.
val pageBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)

// Render the page to the bitmap.
page.render(pageBitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
```

```java
// Create a new PdfRenderer for your document.
PdfRenderer pdfRenderer = new PdfRenderer(ParcelFileDescriptor.open(documentFile, ParcelFileDescriptor.MODE_READ_ONLY));

// Open the first page of the document.
PdfRenderer.Page page = pdfRenderer.openPage(0);

// Define a target width for the resulting bitmap and use it to calculate the final height.
int width = 2048;
int height = (page.getHeight() * (width / page.getWidth()));

// Create the bitmap to render the page to.
Bitmap pageBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);

// Render the page to the bitmap.
page.render(pageBitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);
```

==]

With that out of the way, there are a few additional things you need to consider. Loading and rendering PDFs is quite expensive, so it makes sense to perform these operations on a background thread. Furthermore, since PDFs stay the same for the most part, caching the resulting rendering makes a lot of sense. For [PDF Viewer][], we solved these issues by using something most people only use for loading remote images: [Glide].

## Writing a Custom Glide `ModelLoader`

Since Glide already takes care of scheduling your image loading on a background thread and provides solid caching, all you need to worry about is actually providing the image. The examples below will show how to do it using PSPDFKit, but it will work just the same if you use the [`PdfRenderer`].

Glide actually provides a [great tutorial][] on how to write custom `ModelLoader`s, but for our purposes, we can make it even simpler.

First we need to create a `DataFetcher` that can render the first page of the PDF file that is provided to an `InputStream`:

[==

```kotlin
class PdfFileDataFetcher(val context: Context,
                         val file: JFile,
                         val width: Int,
                         val height: Int) : com.bumptech.glide.load.data.DataFetcher<InputStream> {

    var inputStream: InputStream? = null

    override fun loadData(priority: Priority?): InputStream {
        // Load the document.
        val document = PdfDocument.openDocument(context, DocumentSource(Uri.fromFile(file)))

        // Calculate the size required for the page to fit into the provided size.
        val pageSize = document.getPageSize(0)
        val ratio = Math.min(width / pageSize.width, height / pageSize.height)
        val targetSize= Size(pageSize.width * ratio, pageSize.height * ratio)

        // Render the preview image to a bitmap.
        val renderedPage = document.renderPageToBitmap(context, 0, targetSize.width.toInt(), targetSize.height.toInt())
        val outputStream = ByteArrayOutputStream()
        renderedPage.compress(Bitmap.CompressFormat.PNG, 0, outputStream)

        // Then return it as a stream.
        val stream = ByteArrayInputStream(outputStream.toByteArray())
        inputStream = stream
        return stream
    }

    override fun cleanup() {
        inputStream?.close()
    }

    override fun cancel() {
        // We don't stop the rendering since we can put the rendered page in the cache for later.
    }

    // This id is used to identify the rendered page in the cache by including the last modified date
    // we make sure it is rerendered when the file changes.
    override fun getId(): String = "${file.absolutePath}-${file.lastModified()}-${file.length()}"
}
```

```java
class PdfFileDataFetcher implements DataFetcher<InputStream> {
    private final Context context;
    private final File file;
    private final int width;
    private final int height;

    private InputStream inputStream;

    public PdfFileDataFetcher(Context context, File file, int width, int height) {
        this.context = context;
        this.file = file;
        this.width = width;
        this.height = height;
    }

    @Override
    public InputStream loadData(Priority priority) throws Exception {
        // Load the document.
        PdfDocument document = PdfDocument.openDocument(context, new DocumentSource(Uri.fromFile(file)));

        // Calculate the size required for the page to fit into the provided size.
        Size pageSize = document.getPageSize(0);
        float ratio = Math.min(width / pageSize.width, height / pageSize.height);
        Size targetSize = new Size(pageSize.width * ratio, pageSize.height * ratio);

        // Render the preview image to a bitmap.
        Bitmap renderedPage = document.renderPageToBitmap(context, 0, (int) targetSize.width, (int) targetSize.height);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        renderedPage.compress(Bitmap.CompressFormat.PNG, 0, outputStream);

        // Then return it as a stream.
        ByteArrayInputStream stream = new ByteArrayInputStream(outputStream.toByteArray());
        inputStream = stream;
        return stream;
    }

    @Override
    public void cleanup() {
        if (inputStream != null) {
            try {
                inputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void cancel() {
        // We might as well cache the response.
    }

    @Override
    public String getId() {
    	// This id is used to identify the rendered page in the cache by including the last modified date
    	// we make sure it is rerendered when the file changes.
        return file.getAbsolutePath() + "-" + file.lastModified() + "-" + file.length();
    }
}
```

==]

With our `DataFetcher` up and running, we just need a `ModelLoader` so that we can actually use `PdfFileDataFetcher`. This is pretty straightforward; `ModelLoader` will simply instantiate a new `PdfFileDataFetcher` whenever needed:

[==

```kotlin
class PdfFileCoverLoader(val context: Context) : StreamModelLoader<File> {
    override fun getResourceFetcher(model: File, width: Int, height: Int): DataFetcher<InputStream> =
        PdfFileDataFetcher(context, model, width, height)
}
```

```java
public class PdfFileCoverLoader implements StreamModelLoader<File> {
    private final Context context;

    public PdfFileCoverLoader(Context context) {
        this.context = context;
    }

    @Override
    public DataFetcher<InputStream> getResourceFetcher(File model, int width, int height) {
        return new PdfFileDataFetcher(context, model, width, height);
    }
}
```

==]

Finally, all that’s left is to actually use our new `PdfFileCoverLoader`. Glide allows us to globally register `ModelLoader`s, but since we specified `File` as our data model and we still want to be able to load images from files, we manually specify our `PdfFileCoverLoader` wherever we want to render PDFs:

[==

```kotlin
// Inside your onBindViewHolder method
Glide.with(context)
	// Make sure to specify that our PdfFileCoverLoader should be used.
	.using(PdfFileCoverLoader(context))
	.load(item.pdfFile)
	.fitCenter()
	.into(holder.coverImage)
```

```java
// Inside your onBindViewHolder method
Glide.with(context)
	// Make sure to specify that our PdfFileCoverLoader should be used.
	.using(new PdfFileCoverLoader(context))
	.load(item.getPdfFile())
	.fitCenter()
	.into(holder.getCoverImage());
```

==]

So there you have it! Regardless of if you are using PSPDFKit or the [`PdfRenderer`], you can quickly and efficiently render multiple PDF previews with the help of [Glide].

[guide article]: https://pspdfkit.com/guides/android/current/getting-started/rendering-pdf-pages
[`PdfRenderer`]: https://developer.android.com/reference/android/graphics/pdf/PdfRenderer.html
[PDF Viewer]: https://pdfviewer.io/
[Glide]: https://github.com/bumptech/glide
[great tutorial]: https://bumptech.github.io/glide/tut/custom-modelloader.html
