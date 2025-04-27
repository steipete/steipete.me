---
title: "50 Shaders of Android: Drawing on Canvas"
description: Low-level drawing and animation on Android using Canvas and powerful Shader classes.
preview_image: /images/blog/2017/50-shaders-of-android-drawing-on-canvas/50-shaders-of-android-drawing-on-canvas.png
section: blog
author:
  - Simone Arpe
author_url:
  - https://twitter.com/simonarpe
date: 2017-05-18 12:00 UTC
tags: Android, Development, UI, Canvas
published: true
---

Canvas and Shaders, if used wisely, can simplify your life and help you achieve wonderful UI effects and animations.

READMORE

## Canvas, Hi Stranger!

Android views represent the basic building blocks for user interface components; they occupy a rectangular area on the screen and are responsible for drawing and event handling.

To implement a custom view, we can start with overriding the [`onDraw(android.graphic.Canvas)`] method. Android documentation is deliberately vague here: `Implement this to do your drawing.`

But first of all: what is a canvas in Android? According to the [official Android documentation][canvas doc]:

> The Canvas class holds the "draw" calls. To draw something, you need 4 basic components: A Bitmap to hold the pixels, a Canvas to host the draw calls (writing into the bitmap), a drawing primitive (e.g. Rect, Path, text, Bitmap), and a paint (to describe the colors and styles for the drawing).

## The Canonical Way

We can start with something easy. Let’s imagine we have to show a png and need to add a border to it.

<img src="/images/blog/2017/50-shaders-of-android-drawing-on-canvas/simple-border.png" alt="Simple border" width="50%">

A very simple solution for a static layout might be introducing an `XML` shape as a background. Consider this very basic layout implementation:

```xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <ImageView
        android:id="@+id/imageView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:background="@drawable/rounded_rectangle"
        app:srcCompat="@drawable/pspdfkit_icon"/>
</FrameLayout>
```

Our `drawable/rounded_rectangle.xml` would be implemented like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
       android:id="@+id/listview_background_shape">
    <stroke
        android:width="6dp"
        android:color="#ff207d94"/>
    <padding
        android:bottom="6dp"
        android:left="6dp"
        android:right="6dp"
        android:top="6dp"/>
    <corners android:radius="5dp"/>
</shape>
```

## Dynamic Variation

Here at PSPDFKit, we care greatly about performance and are always pushing the limits of Android for providing the best possible experience. In [PSPDFKit 3.1 for Android] introduced a scrollable thumbnail bar, used to navigate a document in a more visual way.
This new feature also offers an easy way for our framework clients to customize many details, such as thumbnail size, border width, color, spacing, and more.

Recycling the views is one of the practical ways to provide a smooth UI when dealing with long lists. And remember: bitmaps can be recycled as well!

<video src="/images/blog/2017/50-shaders-of-android-drawing-on-canvas/scrollable-thumbnail-bar.mp4" width="50%" style="display: block; margin:1em auto 2em auto !important;" playsinline loop muted data-controller="video" data-video-autoplay="true"></video>

A simple `BorderedImageView` example that includes the use of a png image, border width, and color, can be seen below.

```java
public class BorderedImageView extends ImageView {
  private static final int STROKE_WIDTH_DP = 6;
  private Paint paintBorder;
  private Bitmap bitmap;
  private int strokeWidthPx;
  private RectF rectF;

  /** Simple constructor. */
  public BorderedImageView(Context context) {
    super(context);
    init();
  }

  private void init() {
    // The resource is embedded, but it can be easily moved in the constructor.
    bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.pspdfkit_icon);

    // The same goes for the stroke width in dp.
    strokeWidthPx = (int) (STROKE_WIDTH_DP * getResources().getDisplayMetrics().density);
    int halfStrokeWidthPx = strokeWidthPx / 2;

    paintBorder = new Paint();
    paintBorder.setStyle(Paint.Style.STROKE);
    // Stroke width is in pixels.
    paintBorder.setStrokeWidth(strokeWidthPx);
    // Our color for the border.
    paintBorder.setColor(Color.BLUE);

    int totalWidth = bitmap.getWidth() + strokeWidthPx * 2;
    int totalHeight = bitmap.getHeight()  + strokeWidthPx * 2;

    // An empty bitmap with the same size of our resource to display, increased of the desired border width.
    setImageBitmap(Bitmap.createBitmap(totalWidth, totalHeight, Bitmap.Config.ARGB_8888));

    // The rectangle that will be used for drawing the colored border.
    rectF = new RectF(halfStrokeWidthPx, halfStrokeWidthPx, totalWidth - halfStrokeWidthPx, totalHeight - halfStrokeWidthPx);
  }

  @Override
  protected void onDraw(Canvas canvas) {
    super.onDraw(canvas);
    // A rounded rect will be printed.
    canvas.drawRoundRect(rectF, 40, 40, paintBorder);
    // The bitmap for the resource R.drawable.pspdfkit_icon.
    // Note the Paint for the bitmap is null, we'll talk about this in a moment...
    canvas.drawBitmap(bitmap,strokeWidthPx, strokeWidthPx, null);
  }
}
```

With the above, we can easily make all the details customizable programmatically.

![Wow Meme](/images/blog/2017/50-shaders-of-android-drawing-on-canvas/wow-meme.jpg)


The `Paint` parameter for drawing the bitmap was left `null` on purpose. This is perfectly fine for drawing the bitmap as it is, but it opens a window to a lot of nifty improvements.
Do you want a taste?

Instead of using a `null` value, provide a `Paint` like this:

```java
@Override
protected void onDraw(Canvas canvas) {
  super.onDraw(canvas);
  ....
  Paint paint = new Paint();
  paint.setShadowLayer(30, 30, 30, 0xFF555555);
  canvas.drawBitmap(bitmap,strokeWidthPx, strokeWidthPx, paint);
}
```

<img src="/images/blog/2017/50-shaders-of-android-drawing-on-canvas/shadow-layer.png" alt="Shadow layer" width="50%">

How cool is that?

**Note:** remember to remove any object initialization from your `onDraw` call.

## Down The Rabbit Hole.

Basic image manipulation of your `ImageView` instances is often required, and [Matrix] manipulations and [Shader] effects are here to help.

![Down in the rabbit hole](/images/blog/2017/50-shaders-of-android-drawing-on-canvas/down-in-the-rabbit-hole.png)

A very common one use case is rotations: you want to keep your code properly encapsulated implementing your `RotatingImageView` that extends `ImageView` and you don't want to rely on something like [`RotateAnimation`] at the layout level.

This can be easily achieved by [`canvas.rotate(float degrees)`] with one line of code! 😃

```java
public class RotatingImageView extends ImageView {

  // Initial position.
  private int rotationDegrees = 0;

  public RotatingImageView(Context context) {
    super(context);
    init();
  }

  public RotatingImageView(Context context, @Nullable AttributeSet attrs) {
    super(context, attrs);
    init();
  }

  public RotatingImageView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
    super(context, attrs, defStyleAttr);
    init();
  }


  private void init() {
    Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.pspdfkit_icon);
    setImageBitmap(bitmap);
  }

  @Override
  protected void onDraw(Canvas canvas) {
    // Translate rotation axe to the center.
    canvas.translate(canvas.getWidth()/2, canvas.getHeight()/2);
    // Rotate!
    canvas.rotate(rotation(3));
    // Put back to its original place.
    canvas.translate(-canvas.getWidth()/2, -canvas.getHeight()/2);
    // Invalidate the view.
    postInvalidateOnAnimation();
    super.onDraw(canvas);
  }

  private int rotation(int delta) {
    rotationDegrees = (rotationDegrees + delta) % 360;
    return rotationDegrees;
  }
}
```

<video src="/images/blog/2017/50-shaders-of-android-drawing-on-canvas/rotate-logo.mp4" width="50%" style="display: block; margin:1em auto 2em auto !important;" playsinline loop muted data-controller="video" data-video-autoplay="true"></video>

And what if you want to add more effects to the party?

Easy! Let's look at an example using [`canvas.scale(float, float)`]:

```java
public class RotatingImageView extends ImageView {

  private int rotationDegrees = 0;
  private float scale;
  private int directionScale;

  ...

  private void init() {
    Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.pspdfkit_icon);
    setImageBitmap(bitmap);
  }

  @Override
  protected void onDraw(Canvas canvas) {
    canvas.translate(canvas.getWidth()/2, canvas.getHeight()/2);
    canvas.rotate(rotation(3));
    float scaleFactor = scale(0.01f);
    canvas.scale(scaleFactor, scaleFactor);
    canvas.translate(-canvas.getWidth()/2, -canvas.getHeight()/2);
    postInvalidateOnAnimation();
    super.onDraw(canvas);
  }

  private float scale(float delta) {
    scale = (scale + delta * directionScale);
    if (scale <= 0) {
      directionScale = 1;
      scale = 0;
    } else if (scale >= 1) {
      directionScale = -1;
      scale = 1;
    }
    return scale;
  }

  private int rotation(int delta) {
    rotationDegrees = (rotationDegrees + delta) % 360;
    return rotationDegrees;
  }
}
```

<video src="/images/blog/2017/50-shaders-of-android-drawing-on-canvas/rotate-scale-logo.mp4" width="50%" style="display: block; margin:1em auto 2em auto !important;" playsinline loop muted data-controller="video" data-video-autoplay="true"></video>

## Shaders Shaders Shaders

As stated in the [official Android documentation][shader doc]
> Shader is the based class for objects that return horizontal spans of colors during drawing. A subclass of Shader is installed in a Paint calling paint.setShader(shader). After that any object (other than a bitmap) that is drawn with that paint will get its color(s) from the shader.

Among its subclasses we can find [`BitmapShader`], [`ComposeShader`], [`LinearGradient`], [`RadialGradient`], [`SweepGradient`]. These can be used to obtain stunning effects.  
[`LinearGradient`] is probably one of the most well-known, we'll set this aside for now as there are tons of tutorial available around. [`RadialGradient`] has a lot of potential for creating astonishing effects with minimal effort. Unfortunately, the documentation doesn't provide much information about the outcome.

Let's see how we can introduce it to one of the previous examples:

```java
public class RadialFxImageView extends ImageView {
  private static final int STROKE_WIDTH_DP = 6;
  private Paint paintBorder;
  private Bitmap bitmap;
  private int strokeWidthPx;
  private RectF rectF;
  private RadialGradient radialGradient;

  public RadialFxImageView(Context context) {
    super(context);
    init();
  }

  ...

  private void init() {
    bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.pspdfkit_icon);
    strokeWidthPx = (int) (STROKE_WIDTH_DP * getResources().getDisplayMetrics().density);
    int halfStrokeWidthPx = strokeWidthPx / 2;

    paintBorder = new Paint();
    paintBorder.setStyle(Paint.Style.FILL);

    int totalWidth = bitmap.getWidth() + strokeWidthPx * 2;
    int totalHeight = bitmap.getHeight() + strokeWidthPx * 2;
    radialGradient = new RadialGradient(totalWidth /2, totalHeight /2, totalWidth /2, new int[] {Color.BLACK, Color.GREEN}, null, Shader.TileMode.MIRROR);
    paintBorder.setShader(radialGradient);
    setImageBitmap(Bitmap.createBitmap(totalWidth, totalHeight, Bitmap.Config.ARGB_8888));

    rectF = new RectF(halfStrokeWidthPx, halfStrokeWidthPx, totalWidth - halfStrokeWidthPx, totalHeight - halfStrokeWidthPx);
  }

  @Override
  protected void onDraw(Canvas canvas) {
    super.onDraw(canvas);
    canvas.drawRoundRect(rectF, 40, 40, paintBorder);
    canvas.drawBitmap(bitmap,strokeWidthPx, strokeWidthPx, null);
  }
}
```

<img src="/images/blog/2017/50-shaders-of-android-drawing-on-canvas/radial-gradient.png" alt="Radial gradient" width="50%">

We can also animate the radial effect by introducing some minor modifications:

```java
public class RadialFxImageView extends ImageView {
  private static final int STROKE_WIDTH_DP = 6;
  private Paint paintBorder;
  private Bitmap bitmap;
  private int strokeWidthPx;
  private RectF rectF;
  private RadialGradient radialGradient;

  private float radialScaleDirection;
  private Matrix matrix;
  private float radialScale;
  private int totalWidth;
  private int totalHeight;

  public RadialFxImageView(Context context) {
    super(context);
    init();
  }

  public RadialFxImageView(Context context, @Nullable AttributeSet attrs) {
    super(context, attrs);
    init();
  }

  public RadialFxImageView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
    super(context, attrs, defStyleAttr);
    init();
  }

  private void init() {
    bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.pspdfkit_icon);

    strokeWidthPx = (int) (STROKE_WIDTH_DP * getResources().getDisplayMetrics().density);
    int halfStrokeWidthPx = strokeWidthPx / 2;

    paintBorder = new Paint();
    paintBorder.setStyle(Paint.Style.FILL);

    totalWidth = bitmap.getWidth() + strokeWidthPx * 2;
    totalHeight = bitmap.getHeight() + strokeWidthPx * 2;
    radialGradient = new RadialGradient(totalWidth /2, totalHeight /2, totalWidth /2, new int[] {Color.BLACK, Color.GREEN}, null, Shader.TileMode.MIRROR);
    paintBorder.setShader(radialGradient);
    matrix = new Matrix();
    setImageBitmap(Bitmap.createBitmap(totalWidth, totalHeight, Bitmap.Config.ARGB_8888));

    rectF = new RectF(halfStrokeWidthPx, halfStrokeWidthPx, totalWidth - halfStrokeWidthPx, totalHeight - halfStrokeWidthPx);
  }

  @Override
  protected void onDraw(Canvas canvas) {
    super.onDraw(canvas);

    float scale = incScale(0.01f);
    matrix.setScale(scale, scale, totalWidth/2, totalHeight/2);
    radialGradient.setLocalMatrix(matrix);

    canvas.drawRoundRect(rectF, 40, 40, paintBorder);
    canvas.drawBitmap(bitmap,strokeWidthPx, strokeWidthPx, null);
    postInvalidateOnAnimation();
  }

  private float incScale(float delta) {
    radialScale = (radialScale + delta * radialScaleDirection);
    if (radialScale <= 0.2f) {
      radialScaleDirection = 1;
      radialScale = 0.2f;
    } else if (radialScale >= 1) {
      radialScaleDirection = -1;
      radialScale = 1;
    }

    return radialScale;
  }
}
```

<video src="/images/blog/2017/50-shaders-of-android-drawing-on-canvas/radial-gradient-animation.mp4" width="50%" style="display: block; margin:1em auto 2em auto !important;" playsinline loop muted data-controller="video" data-video-autoplay="true"></video>

## Conclusion

Android Shaders and low-level Canvas calls may come helpful to enrich the UX and create eye-catching effects under some constraints, without performance degradation. Nevertheless, when complex manipulations are required, stick to the [KISS principle] without reinventing the wheel is the way to go. Android provides extensive [APIs using scenes and transitions] that you can also take a look! 😎

<!-- References -->

[`onDraw(android.graphic.Canvas)`]: https://developer.android.com/reference/android/view/View.html#onDraw(android.graphics.Canvas)
[canvas doc]: https://developer.android.com/reference/android/graphics/Canvas.html
[`canvas.rotate(float degrees)`]: https://developer.android.com/reference/android/graphics/Canvas.html#rotate(float)
[shader doc]: https://developer.android.com/reference/android/graphics/Shader.html
[`BitmapShader`]: https://developer.android.com/reference/android/graphics/BitmapShader.html
[`ComposeShader`]: https://developer.android.com/reference/android/graphics/ComposeShader.html
[`LinearGradient`]: https://developer.android.com/reference/android/graphics/LinearGradient.html
[`RadialGradient`]: https://developer.android.com/reference/android/graphics/RadialGradient.html
[`SweepGradient`]: https://developer.android.com/reference/android/graphics/SweepGradient.html
[PSPDFKit 3.1 for Android]: https://pspdfkit.com/blog/2017/pspdfkit-android-3-1/
[Matrix]: https://developer.android.com/reference/android/graphics/Matrix.html
[Shader]: https://developer.android.com/reference/android/graphics/Shader.html
[`RotateAnimation`]: https://developer.android.com/reference/android/view/animation/RotateAnimation.html
[`canvas.scale(float, float)`]: https://developer.android.com/reference/android/graphics/Canvas.html#scale(float,%20float)
[KISS principle]: https://en.wikipedia.org/wiki/KISS_principle
[APIs using scenes and transitions]: https://developer.android.com/training/transitions/index.html
