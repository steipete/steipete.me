---
title: "Understanding Images in PDF"
description: "We take a look at how images are stored in a PDF and discuss some important things to know about them."
preview_image: /images/blog/2018/understanding-images-in-pdf/understanding-images-in-pdf-header.png
section: blog
author:
  - Patrik Weiskircher
author_url:
  - https://twitter.com/pweisk
date: 2018-12-10 8:00 UTC
tags: Development
published: true
secret: false
---

Images are everywhere. We use them to exchange happy moments with friends and to scan important documents we receive. PDF documents have support for several different image formats, but as always, there are a few surprises.

This blog post will go into several, but not all, image formats supported by PDF.

# What Is Image Compression?

[Image compression][] is a technique for efficiently compressing pixel data. If we were to store pixels as they are, it would take up quite a lot of space. For example, storing a 1024x768 image without compression would result in around 2.3 MB of data. This is lot for such a small image. As a result, people came up with various compression algorithms to make this amount smaller.

There must always be a balance between decompression speed, size, and artifacts. For example, there are lossy formats (like [JPEG][]), which do not retain 100 percent of the information but work great for pictures, and there are lossless formats (like [PNG][]) that retain all the information but don’t compress nearly as well as a JPEG image.

Depending on what you’re sharing, either format might be appropriate. For screenshots, for example, PNG is usually used, as it does not introduce any artifacts into the text.

PDF supports some, but not all of the common image formats. Below I’ll outline some of them.

# JPEG

PDF supports JPEG compression. This is great, because it really does compress down quite a bit and saves you a lot of size in the file. As mentioned above, the negative part about JPEG is that it is lossless, so it isn’t ideal for anything that includes text, like a screenshot or a photo of a receipt.

# Flate

Flate is a compression algorithm that basically works like [TIFF][] and [PNG][]. Outside of PDF, this is usually known as [LZW][] compression. It allows you to losslessly compress images and retain all the information of the image. The downside is that the image size is going to be much bigger.

# JPEG 2000

Since PDF version 1.4, [JPEG 2000][] images have also been supported. They are not widely used but offer many advantages over both JPEG and PNG. For example, JPEG 2000 images can be lossless or lossy and achieve great compression rates in both modes. This format never caught on with consumers, but it might still make sense to recompress the images in your PDF to JPEG 2000, as it does make the file smaller.

One problem is that many JPEG 2000 decoders are not as optimized as others, which means that the images might decompress slower, especially on mobile platforms.

# Fax

Yes! PDF has native support for including [fax][] data. This is strictly for black and white images, but it’s highly efficient if you need to include a fax in a PDF.

# Transparency in Images

Sometimes, you have images that include transparency. For example, if you include a logo of your company, you want it to look good on whatever background you put it on. Image formats themselves don’t support transparency in a PDF, but the PDF format defines alpha masks that you can include with your image.

This is something that is handled automatically by your favorite PDF viewer when you add an image with transparency, so you don’t really have to worry about it.

Basically, the PDF includes the full image without any alpha channel and then includes a second image that defines which areas are transparent and by how much.

# Conclusion

Images are important, and they are used often in PDFs. After reading this, you should have a little bit of an idea of how PDF stores and handles images. PDF is a pretty old format that has evolved a lot over the years, but it still shows some of its quirks. Who would have thought you could easily include fax data?

Luckily, you shouldn’t need to know too much about how it all works under the hood, as our [frameworks][] try to make the best decisions about what format to use at all times.

[image compression]: https://en.wikipedia.org/wiki/Image_compression
[jpeg]: https://en.wikipedia.org/wiki/JPEG
[png]: https://en.wikipedia.org/wiki/Portable_Network_Graphics
[lzw]: https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Welch
[tiff]: https://en.wikipedia.org/wiki/TIFF
[jpeg 2000]: https://en.wikipedia.org/wiki/JPEG_2000
[fax]: https://en.wikipedia.org/wiki/Fax
[frameworks]: https://pspdfkit.com/pdf-sdk/
