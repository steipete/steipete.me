---
title: "The curious case of Android premultiplied alpha"
section: blog

author: Jernej Virag
author_url: https://twitter.com/jernejv
date: 2016-02-12 12:00 UTC
tags: Android, Development
published: true
---

Having been designed for comparatively slow mobile devices, both iOS and Android expose highly optimized development APIs. In some cases this can lead to confusing behaviour, especially if optimized behaviour isn't clearly documented. This is a story of debugging one of such cases on Android.
READMORE

## The curious case of transparent page artifacts

PSPDFKit is a framework that solves viewing PDFs and editing/creating annotations. Since we target mobile devices, things need to be really fast, and we have products for both iOS and Android. Our PDF parser/renderer is highly optimized C++ shared across these platforms. Building that in Java would be too slow and hard to maintain. However, bridging with native code has it's own challenges. Some time ago we found a case of a really curious behaviour - PDF pages rendered to a `Bitmap` with transparent background showed strange artifacts around text.

![Problematic artifacts](/images/blog/2016/android-alpha/artifacts.jpg)

The artifacts changed in form as `Bitmap` resolution changed until they completely dissapeared at high resolutions.

First we suspected that there's a problem with alpha channel values in the rendered bitmap - that would cause the non-transparent areas around rendred text. So we modified the rendering engine to output alpha channel values as separate colors to have an easy visualization of alpha. If the bug would be caused by wrong alpha channel values, we'd see the artifacts on this image as well.

![Colorized alpha](/images/blog/2016/android-alpha/alpha-channel.jpg)

*Fully transparent pixels (alpha 0) are colorized yellow, fully solid pixels (alpha 255) are blue, semitransparent pixels are red.*

Surprisingly, no artifacts were visible on the alpha channel image. Alpha values were fully transparent in places of the artifacts which meant that Android isn't listening to the alpha value of those pixels at all. Looking at the rendered transparent page bitmap in Android Studio also showed no artifacts which further confirmed the theory that there's something strange going on when Android blends the bitmap with the background. We suspected that our C++/NDK rendering code wasn't complying to an assumption made by Android compositor. After some intensive documentation reading we found [Chet Haases Google+ post](https://plus.google.com/+ChetHaase/posts/ef6Deey6xKA) talking about premultiplied pixels in Android bitmaps.

## Premultiplied pixels in Android bitmaps

To understand what premultiplying pixels means, we first have to take a look on how different transparent bitmaps are combined into a single bitmap.

When blending a transparent bitmap on top of another bitmap in **ARGB_8888** configuration we need to run the following set of calculations for each pixel:

```
destination.R = ((destination.R * (256 - source.A)) + (source.R * source.A));
destination.G = ((destination.G * (256 - source.A)) + (source.G * source.A));
destination.B = ((destination.B * (256 - source.A)) + (source.B * source.A));
```

where `destination` is the pixel of the background bitmap and `source` is the pixel of the bitmap being blended on top.

This is a set of calculations that Android has to do a lot - everytime a semi-transparent view is being drawn over another view. To keep UI responsive and animations smooth these operations have to be as fast as possible.

Looking at the set of equations we can quickly see that `(source.R * source.A)` will never change for a source image no matter what background we're drawing it to. If we run this multiplication ahead of time on a bitmap we can avoid three expensive multiplications for each pixel when compositing images. So if we *premultiply* pixel values the equations change into

```
destination.R = ((destination.R * (256 - source.A)) + source.premultiplied_R;
destination.G = ((destination.G * (256 - source.A)) + source.premultiplied_G;
destination.B = ((destination.B * (256 - source.A)) + source.premultiplied_B;
```

Premultiplication is done by normalizing alpha value to interval of `[0.0 .. 1.0]`, multiplying the channel value with the normalized alpha and then clamping the result back to `[0 .. 255]` integer range. In one line:

```
bitmap.premultiplied_R = min((bitmap.A / 255.0) * bitmap.R, 255)
bitmap.premultiplied_G = min((bitmap.A / 255.0) * bitmap.G, 255)
bitmap.premultiplied_B = min((bitmap.A / 255.0) * bitmap.B, 255)
```

On Android, all images in `Bitmap` objects are stored in this premultiplied form. When using `BitmapFactory` or Android resource system to load or store bitmaps the premultiplication will be done automatically. Same goes for other Java methods like `setPixel()`. That means that if you load a PNG image which has background of `(A: 128, R: 255, G: 255, B: 128)` the actual `Bitmap` buffer stored values will be `(A: 128, R: 128, G: 128, B: 64)`.

The only cases where an Android developer has to be aware of premultiplication is when pixel values are accessed outside Android framework - NDK or OpenGL.

## The solution

As it turned out the bug was caused by the fact that our native NDK renderer did not premultiply pixels after rendering. As shown in the equations above, after premultiplication the source alpha isn't taken into account anymore when blending. This caused the artifacts in pixels around text where font anti-aliasing algorithm touched the values. This also explains why the issue disappeared in Android Studio debugger - Android Studios bitmap renderer properly listened to the alpha channel values.

The final fix was rather easy - when page background is transparent, we run a multiplication phase in the NDK code:

```
/**
* Multiplies a single channel value with passed alpha. Values are already shifted
* and can be directly ORed back into uint32_t structure.
* /
uint32_t premultiply_channel_value(const uint32_t pixel, const uint8_t offset, const float normalizedAlpha) {
	auto multipliedValue = ((pixel >> offset) & 0xFF) * normalizedAlpha;
	return ((uint32_t)std::min(multipliedValue, 255.0f)) << offset;
}

/**
*   This premultiplies alpha value in the bitmap. Android expects its bitmaps to have alpha premultiplied for optimization -
*   this means that instead of ARGB values of (128, 255, 255, 255) the bitmap needs to store (128, 128, 128, 128). Color channels
*   are multiplied with alpha value (0.0 .. 1.0).
*/
void premultiply_bitmap_alpha(const uint32_t bitmapHeight, const uint32_t bitmapWidth, const uint32_t bitmapStride, uint32_t* bitmapBuffer) {
	const uint32_t pixels = bitmapHeight * (bitmapStride / 4);
	for (uint32_t i = 0; i < pixels; i++) {
		const uint8_t alpha = (uint8_t)((bitmapBuffer[i] >> 24) & 0xFF);
		const float normalizedAlpha = alpha / 255.0f;
		bitmapBuffer[i] = (bitmapBuffer[i] & 0xFF000000)  |
							 premultiply_channel_value(bitmapBuffer[i], 16, normalizedAlpha) |
							 premultiply_channel_value(bitmapBuffer[i], 8, normalizedAlpha) |
							 premultiply_channel_value(bitmapBuffer[i], 0, normalizedAlpha);

	}
}
```

After deploying this code the transparent page bitmaps now render correctly:

![Correct render](/images/blog/2016/android-alpha/correct-render.jpg)

Since rendering transparent background is a rare case, we run premultiplication only in those few cases to save on battery and CPU time on user devices. That's just one of the edge cases and challenges we have every day here. If you're interested in working on hard problems and knowing that your code will run in Box, Dropbox, HipChat, Evernote and countless enterprise solutions, [drop us an email](https://pspdfkit.com/careers/).
