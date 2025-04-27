---
title: "Rendering Tests Using Robolectric"
description: "Rendering tests using Robolectric with a custom bitmap shadow."
preview_image: /images/blog/2018/rendering-tests-using-robolectric/article-header.png
section: blog
author:
  - Tomas Surin
author_url:
  - https://twitter.com/tomassurin
date: 2018-11-13 9:00 UTC
tags: Android, Development, Testing
published: true
secret: false
---

This article outlines how we managed to rewrite our instrumentation PDF rendering tests as unit tests using the [Robolectric][] framework. We’ll show how we built a custom [`Bitmap`][] shadow with proper support for image decoding and encoding. This article can be also used as an introduction to building custom Robolectric shadows.

**💡 Note:** The reader is expected to have prior knowledge of Android testing and Robolectric.

# Motivation

To make sure we don’t include any regressions in PSPDFKit’s PDF rendering, we’ve built an extensive test suite for our renderer. The major part of these tests is implemented in C++ to test rendering logic in our native library. However, we also have a fair bit of rendering tests specific to Android which are designed to catch integration issues with our native library early. These tests are implemented as instrumentation tests running on the emulator.

We are not entirely happy with our instrumentation rendering tests. The biggest problem is that the page rendering is dependent on the device we are testing on (i.e. the emulator version), meaning our tests are reliable only on a single emulator configuration. Another issue with instrumentation tests is that they are painfully slow, which takes a large toll on our CI. To work around these issues, we decided to rewrite our rendering tests as unit tests running inside the Java virtual machine (JVM) on our development workstations.

# Our Approach

This is the basic structure of the simplest rendering test we have in our test suite:

```TestClass.kt
@Test
fun testPageRenderingRegression() {
    // Open test file from the local file system.
    val savedDocument = PdfDocumentLoader.openDocument(context, getTestAssetAsFileUri("Test_file.pdf"))

    // Render the page to bitmap.
    val firstPageSize = document.getPageSize(0)
    val renderedBitmap = savedDocument.renderPageToBitmap(context, 0, firstPageSize.width.toInt(), firstPageSize.height.toInt())

    // Compare the rendered bitmap to correct rendering (manually created when writing the test).
    assertThat<Bitmap>(renderedBitmap, matchesTestAsset("Android-Test-Reference/Test_file_page0.png"))
}
```

1. First we open the tested PDF document from test assets (line 4). This is really simple; we just need to open the required file from the local file system.
2. Then we ask PSPDFKit to render the first document page to bitmap (lines 7–8).
3. Finally, we match the rendered bitmap with the reference bitmap stored in the test assets (line 11). The bitmap matcher decodes the reference bitmap and matches all its pixels against the rendered bitmap. The test succeeds if both bitmaps match. If they do not, the test fails and we dump the rendered bitmap so we can debug the failed test later.

Now I’m going to explain how we made all of this possible in unit tests.

## How PSPDFKit Rendering Works

PSPDFKit’s rendering pipeline is fairly simple. We use Android’s [`Bitmap`][] in both our public API and our internal implementation. Whenever we need to render an annotation or page, we instantiate the [`Bitmap`][] object with the required size and pass it to our native library (via JNI Bridge). Native code adapts Android-specific bitmap data to a generic bitmap representation. You can imagine this as a direct block of memory with bitmap pixels, i.e. a byte array where every four bytes represent a single pixel. This bitmap is then passed to a PDF renderer for rendering. The native bitmap adapter commits the rendered pixels into the [`Bitmap`][] data after rendering is done.

## Robolectric to the Rescue

The [`Bitmap`][] class is part of the Android SDK. To make it available in our unit tests, we decided to use Robolectric, as we are already using it in our unit tests. At first, everything seemed straightforward, as Robolectric already provides [`ShadowBitmap`][] and [`ShadowBitmapFactory`][]. However, we quickly found out that these do not provide all the operations we need in our tests. More specifically:

* PSPDFKit’s native library needs access to raw bitmap data as a target for rendering.
* The bitmap matcher needs support for decoding reference bitmaps and for encoding rendered bitmaps when they do not match reference bitmaps. Robolectric, however, does not support image encoding and decoding out of the box.

We decided to implement our own shadows to meet both of these requirements.

# What Is a Shadow?

[Robolectric documentation][] states why the creators of Robolectric choose the name “Shadow”:

> Why “Shadow?” Shadow objects are not quite Proxies, not quite Fakes, not quite Mocks or Stubs. Shadows are sometimes hidden, sometimes seen, and can lead you to the real object. At least we didn’t call them “sheep”, which we were considering.

All jokes aside, shadows are a fairly simple concept used by Robolectric for classes that extend the behavior of Android SDK classes. When a class from an Android SDK is instantiated, Robolectric will create and associate a corresponding shadow class with it. Methods in this shadow class override the default behavior of Android SDK classes. This is necessary for Robolectric magic to work properly, because Android SDK on development machines contains only stubs for all its methods — enough to let you build your project. The implementation of these methods is provided to your app when it’s running on the Android device. Robolectric ships with shadows for all important Android classes, so you can test code that depends on the Android SDK without mocking the SDK classes.

# Custom Bitmap Shadow

Each shadow class must be annotated with the `@Implements` annotation that declares a shadowed class, and each shadowed method must be annotated with the `@Implementation` annotation:

```PSPDFShadowBitmap.kt
@Implements(Bitmap::class)
public class PSPDFShadowBitmap {
    ...
    @Implementation
    fun setPixel(x: Int, y: Int, colorArgb: Int) {
        ...
    }
}
```

[`Bitmap`][] does not have a public constructor. It exposes a set of static `createBitmap()` factory methods instead. For the sake of simplicity, we’re including the implementation of a single variant of these methods here, but the same core idea can be reused while implementing other variants of these `createBitmap()` methods:

```PSPDFShadowBitmap.kt
@Implementation
@JvmStatic
fun createBitmap(width: Int, height: Int, config: Bitmap.Config, hasAlpha: Boolean): Bitmap {
    // Check if the parameters are valid.
    if (width <= 0 || height <= 0) {
        throw IllegalArgumentException("width and height must be > 0")
    }
    checkConfig(config)
    ...

    // Construct a shadowed class. In this case, we use the default constructor of Bitmap via reflection. Robolectric
    // will create our shadow (using the default constructor) and associate it with the created Bitmap object.
    val bitmap = ReflectionHelpers.callConstructor(Bitmap::class.java)
    // Retrieve the shadow Robolectric created.
    val shadowBitmap = Shadow.extract<PSPDFShadowBitmap>(bitmap)

    // Set required properties on the shadow.
    shadowBitmap.width = width
    shadowBitmap.height = height
    shadowBitmap.config = config
    shadowBitmap.hasAlpha = hasAlpha
    shadowBitmap.setMutable(true)
    ...

    // Return the real bitmap.
    return bitmap
}
```

**💡 Note:** Kotlin supports static methods only when defined in the companion object. The method above must be defined in the `companion object` block inside `PSPDFShadowBitmap` and the `@JvmStatic` annotation must be included to inform the Kotlin compiler that it should generate the static method in the compiled byte code.

## Bitmap Representation

We need to store our bitmap data in a byte array. We decided to use [`ByteBuffer`][] to store our bitmap data together with the [`IntBuffer`][] view of this buffer. This makes it much easier to work with specific pixel colors in comparison to using raw `byte[]`:

```PSPDFShadowBitmap.kt
private val width: Int
private val height: Int

/** Stores bitmap data.  */
private var buffer: ByteBuffer? = null
/** Int array view of [.buffer]. Contains bitmap colors. */
private var colors: IntBuffer? = null

@Implementation
fun getPixel(x: Int, y: Int): Int {
    return if (colors != null) {
        colors.get(y * width + x)
    } else {
        0
    }
}

@Implementation
fun setPixel(x: Int, y: Int, colorArgb: Int) {
    if (colors == null) {
        createBuffer()
    }
    colors.put(y * width + x, colorArgb)
}

private fun createBuffer() {
    buffer = ByteBuffer.allocate(height * width * BYTES_PER_PIXEL)
    colors = buffer.asIntBuffer()
}
```

## Bitmap Encoding/Decoding

We have our basic bitmap shadow implementation in place, and now we need to provide the ability to both encode bitmaps into PNG/JPEG files and decode bitmaps from existing PNG/JPEG test assets. We are going to use the [Java Image I/O API][] for this task.

Bitmaps can be encoded via the [`Bitmap#compress()`][] method. We implemented the shadow for this method in our `PSPDFShadowBitmap`:

```PSPDFShadowBitmap.kt
@Implementation
fun compress(format: Bitmap.CompressFormat, quality: Int, stream: OutputStream): Boolean {
    if (format != Bitmap.CompressFormat.JPEG && format != Bitmap.CompressFormat.PNG) {
        throw IllegalArgumentException("PSPDFShadowBitmap currently supports only JPEG and PNG compression.")
    }
    checkRecycled("Can't call compress() on a recycled bitmap")

    // Create a buffered image and write it to the output stream.
    // We use the 3BYTE_BGR format that supports jpeg encoding in ImageIO.
    val bufferedImage = BufferedImage(getWidth(), getHeight(), BufferedImage.TYPE_3BYTE_BGR)

    val bgr = ByteArray(3)
    val writableTile = bufferedImage.getWritableTile(0, 0)
    for (i in 0 until getWidth()) {
        for (j in 0 until getHeight()) {
            // The pixel is in ARGB format. Convert it to an RGB array.
            val pixel = getPixel(i, j)
            bgr[0] = (pixel shr 16 and 0xff).toByte() // red
            bgr[1] = (pixel shr 8 and 0xff).toByte() // green
            bgr[2] = (pixel and 0xff).toByte() // blue
            writableTile.setDataElements(i, j, bgr)
        }
    }
    bufferedImage.releaseWritableTile(0, 0)

    try {
        if (format == Bitmap.CompressFormat.JPEG) {
            val jpegParams = JPEGImageWriteParam(null)
            jpegParams.compressionMode = ImageWriteParam.MODE_EXPLICIT
            jpegParams.compressionQuality = quality / 100.0f

            val writer = ImageIO.getImageWritersByFormatName("jpeg").next()
            writer.output = MemoryCacheImageOutputStream(stream)
            writer.write(null, IIOImage(bufferedImage, null, null), jpegParams)
        } else {
            ImageIO.write(bufferedImage, "png", stream)
        }
    } catch (e: IOException) {
        throw RuntimeException(e)
    }

    return true
}
```

Bitmaps are decoded via static methods in [`BitmapFactory`][]. We are going to provide another shadow for this class (`PSPDFShadowBitmapFactory`) that implements image decoding via Image I/O:

```PSPDFShadowBitmapFactory.kt
@Implementation
@JvmStatic
fun decodeStream(inputStream: InputStream, outPadding: Rect?, opts: BitmapFactory.Options?): Bitmap {
    val bitmapImage: BufferedImage
    try {
        bitmapImage = ImageIO.read(inputStream)
    } catch (e: IOException) {
        throw RuntimeException(e)
    }
    // Premultiply color values with alpha — Android does this by default, and our native library expects this.
    bitmapImage.coerceData(true)

    val width = bitmapImage.width
    val height = bitmapImage.height
    val pixels = IntArray(width * height)
    bitmapImage.getRGB(0, 0, width, height, pixels, 0, width)

    outPadding?.set(-1, -1, -1, -1)

    return PSPDFShadowBitmap.createBitmap(pixels, width, height, Bitmap.Config.ARGB_8888)
}
```

As with the other static methods, this method must be placed in the `companion object` block of our shadow class.

**💡 Note:** Code completion for Java Image I/O in Android test projects does not work out of the box. We declared the JDK runtime jar as a provided dependency for our tests to make code completion possible.

```build.gradle
testProvided files("<your_jdk_dir>/jre/lib/rt.jar")
```

## Wiring Up with Our Native Library

**💡 Note:** Integrating our custom bitmap shadow with our native renderer requires some modifications to PSPDFKit’s native library. You can skip this section if you only wish to use bitmap shadows to test your Dalvik/ART code.

As we stated before, our native library accesses [`Bitmap`][] directly via [`bitmap.h`][] from NDK. We shimmed this native interface in test versions of our native library. For this to work, we had to provide implementations for two methods:

* `AndroidBitmap_lockPixels`, which locks [`Bitmap`][] pixels and exposes them as a contiguous block of memory (byte array).
* `AndroidBitmap_unlockPixels`, which commits changes made to locked memory back to the [`Bitmap`][] object.

```bitmap.cpp
// We keep a mapping of jbitmap objects and their locked pixel buffers in this list.
std::vector<std::pair<jobject, jbyte*>> buffers_list;
std::mutex buffers_mutex;

int AndroidBitmap_lockPixels(JNIEnv* env, jobject jbitmap, void** addrPtr) {
    std::lock_guard<std::mutex> lock(buffers_mutex);
    AndroidBitmapInfo info;
    if (AndroidBitmap_getInfo(env, jbitmap, &info) != ANDROID_BITMAP_RESULT_SUCCESS) {
        return ANDROID_BITMAP_RESULT_JNI_EXCEPTION;
    }

    jbyteArray jbuffer = GetBitmapBuffer(env, jbitmap);
    if (jbuffer == nullptr) return ANDROID_BITMAP_RESULT_JNI_EXCEPTION;

    jbyte* buffer = env->GetByteArrayElements(jbuffer, 0);
    buffers_list.push_back(std::make_pair(jbitmap, buffer));
    (*addrPtr) = buffer;
    return ANDROID_BITMAP_RESULT_SUCCESS;
}

int AndroidBitmap_unlockPixels(JNIEnv* env, jobject jbitmap) {
    std::lock_guard<std::mutex> lock(buffers_mutex);

    for (auto iter = buffers_list.begin(); iter != buffers_list.end(); ++iter) {
        if (env->IsSameObject((*iter).first, jbitmap)) {
            jbyteArray jbuffer = GetBitmapBuffer(env, jbitmap);
            if (jbuffer == nullptr) continue;
            env->ReleaseByteArrayElements(jbuffer, (*iter).second, JNI_COMMIT);
            buffers_list.erase(iter);
            return ANDROID_BITMAP_RESULT_SUCCESS;
        }
    }

    return ANDROID_BITMAP_RESULT_JNI_EXCEPTION;
}
```

The function `GetBitmapBuffer()` calls `PSPDFShadowBitmap#getBuffer()` via reflection and returns the [`ByteBuffer`][] we use to represent bitmap shadow data. Similarly, `AndroidBitmap_getInfo()` accesses methods of our bitmap shadow to populate the `AndroidBitmapInfo` structure — this includes the bitmap dimensions and format.

## Using Custom Shadows

We are finished with our `PSPDFShadowBitmap` and `PSPDFShadowBitmapFactory` implementation. Before we can use them in our rendering tests, however, we need to configure Robolectric to use them. After this is done, Robolectric will take care of any calls to [`Bitmap`][] or [`BitmapFactory`][] and delegate them to our shadows.

The simplest way to use custom shadows is to specify the required shadows in the [`@Config`][] annotation of the test class in question:

```TestClass.kt
@RunWith(RobolectricTestRunner::class)
@Config(shadows=[PSPDFShadowBitmap::class, PSPDFShadowBitmapFactory::class])
class TestClass {
    ...
}
```

A slightly better solution is to extend [`RobolectricTestRunner`][] and define custom shadows in the subclass:

```PSPDFRobolectricTestRunner.kt
class PSPDFRobolectricTestRunner(testClass: Class<Any>) : RobolectricTestRunner(testClass) {

    override fun createShadowMap(): ShadowMap {
        return super.createShadowMap().newBuilder()
                .addShadowClass(PSPDFShadowBitmap::class.java)
                .addShadowClass(PSPDFShadowBitmapFactory::class.java)
                .build()
    }
}
```

The previous test definition now becomes the following:

```TestClass.kt
@RunWith(PSPDFRobolectricTestRunner::class)
class TestClass {
    ...
}
```

## Debugger Previews for a Shadowed Bitmap

Our initial approach is working fine, but image previews in the Android Studio debugger suddenly stopped working. After some trial and error, we overcame this problem with a fast (and hacky) workaround:

```PSPDFShadowBitmap.kt
@SuppressWarnings("UnusedDeclaration")
@Implements(Bitmap::class)
public class PSPDFShadowBitmap {
    ...

    // Robolectric will set realBitmap to the actual instance of the Bitmap when constructing this shadow.
    @RealObject
    private val realBitmap: Bitmap? = null

    /**
     * Initiates an internal bitmap buffer by wrapping the provided buffer with bitmap data.
     */
    private fun createBuffer(buffer: ByteArray) {
        this.buffer = ByteBuffer.wrap(buffer)
        this.colors = this.buffer.asIntBuffer()
        updateRealClassFields()
    }

    /** This method updates [.realBitmap] fields with bitmap data so that the bitmap preview works in the AS debugger.  */
    private fun updateRealClassFields() {
        setRealBitmapField("mBuffer", buffer.array())
        setRealBitmapField("mWidth", width)
        setRealBitmapField("mHeight", height)
        setRealBitmapField("mDensity", density)
    }

    private fun setRealBitmapField(@NonNull fieldName: String, value: Any) {
        try {
            val mBufferField = Bitmap::class.java.getDeclaredField(fieldName)
            if (mBufferField != null) {
                mBufferField.isAccessible = true
                mBufferField.set(realBitmap, value)
            }
        } catch (ignored: Exception) { }
    }
}
```

Here we requested Robolectric to set the real bitmap object to `realBitmap` property when constructing our shadow. We then updated the real bitmap’s fields (those that Android Studio expects to be present) with the properties of our shadow via reflection.

# Conclusion

I hope I’ve shed some light on Robolectric shadows. As you can see, implementing custom shadows can be a chore. But it’s certainly not magic, and the entire mechanism is really simple to understand once all the pieces are in place.

Finally, I would like to note that having an ability to shadow everything in your Robolectric tests does not mean you should use this as a prevalent testing strategy. As a general rule, it’s not advisable to test complex things like rendering and bitmap manipulation in your unit tests. We knew what we were getting into and what would be the benefit for us. However, you can’t just generalize our approach and apply it to all cases and everyone’s testing needs. Before trying to implement any custom shadows, ask yourself if it is the correct route and if it isn’t much better to write true unit tests with all Android SDK dependencies mocked instead of using Robolectric. This could improve your app’s design and make your tests more useful, even if this means you’ll need to spend more time properly mocking your Android dependencies.

[`Bitmap`]: https://developer.android.com/reference/android/graphics/Bitmap
[`Bitmap#compress()`]: https://developer.android.com/reference/android/graphics/Bitmap.html#compress(android.graphics.Bitmap.CompressFormat,%20int,%20java.io.OutputStream)
[`BitmapFactory`]: https://developer.android.com/reference/android/graphics/BitmapFactory
[`bitmap.h`]: https://android.googlesource.com/platform/frameworks/native/+/master/include/android/bitmap.h

[Robolectric]: http://robolectric.org/
[Java Image I/O API]:https://docs.oracle.com/javase/8/docs/api/javax/imageio/package-summary.html
[Robolectric documentation]: http://robolectric.org/extending/

[`ShadowBitmap`]: http://robolectric.org/javadoc/3.8/org/robolectric/shadows/ShadowBitmap.html
[`ShadowBitmapFactory`]: http://robolectric.org/javadoc/3.8/org/robolectric/shadows/ShadowBitmapFactory.html
[`Shadow.extract()`]: http://robolectric.org/javadoc/3.8/org/robolectric/shadow/api/Shadow.html#extract-java.lang.Object-
[`@Config`]: http://robolectric.org/javadoc/3.8/org/robolectric/annotation/Config.html
[`RobolectricTestRunner`]: http://robolectric.org/javadoc/3.8/org/robolectric/RobolectricTestRunner.html

[`ByteBuffer`]: https://docs.oracle.com/javase/8/docs/api/java/nio/ByteBuffer.html
[`IntBuffer`]: https://docs.oracle.com/javase/8/docs/api/java/nio/IntBuffer.html
[`ImageIO`]: https://docs.oracle.com/javase/8/docs/api/javax/imageio/ImageIO.html
