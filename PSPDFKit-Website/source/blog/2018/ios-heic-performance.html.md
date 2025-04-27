---
title: "iOS HEIC Performance"
description: "We evaluate the encoding and decoding performance of HEIC."
preview_image: /images/blog/2018/ios-heic-performance/article-header.png
section: blog
author:
  - Aditya Krishnadevan
author_url:
  - https://twitter.com/caughtinflux
date: 2018-11-14 8:00 UTC
tags: iOS, Development
published: true
secret: false
---

[High Efficiency Image File Format (HEIF)][heif wikipedia] is a file format for storing multiple types of image data developed by the Moving Picture Experts Group (MPEG). In introducing it with iOS 11 (and macOS 10.13), Apple claims that bitmaps stored as HEIF files are of a higher quality than a JPEG that occupies more space on disk. At [PSPDFKit][fw link], we cache rendered PDF pages on disk using JPEG. For us, the cached image needs to be as accurate as possible while also not occupying too much space. Additionally, it should be decoded and encoded quickly on a mobile device. While we’re confident about the compression and quality attributes of HEIF, the coding performance surprised us, in that it was significantly slower than when using JPEG.

READMORE

In this post, we’re going to be looking at the performance of HEIF when used to store a single image. According to Apple, the file extension for single-image HEIF files is HEIC. We’ll use these terms interchangeably throughout the post.

With HEIF, in addition to storing simple single images, one can also store “derivations” of the original. These are images stored with a set of instructions in the file that dictate how to apply edits to said file in software. It is also possible to store auxiliary information like an alpha channel, a thumbnail, or a depth map. With iOS 11, Apple switched to using HEIF by default for storing the photos captured by the camera. It isn’t hard to see why, after knowing the benefits it offers. MPEG claims that HEIF images can be up to [50 percent smaller than an equivalent JPEG][compression performance table]. This allows for additional metadata to be attached to an image (which perhaps Apple now uses for its superior depth maps) and still be smaller than a JPEG _without_ the metadata, while also maintaining superior quality.

## Caching

As mentioned above, we need to cache the result of a page render: Rendering each time the page is requested is extremely harsh on the CPU, and it degrades the battery life. It also makes the user have to wait longer to see an image they may have just scrolled by. Our framework encodes images as JPEG files and stores them on disk for retrieving later. While we didn’t have any issues with using JPEG, a reduction in storage required meant we could potentially save our users some space or even cache more pages. By default, we also lose a little bit of quality when using JPEG to cache images, due to the compression that the format specifies. Since HEIF promises an increase in quality _and_ a decrease in size, we started looking into switching our cache to use HEIF to store images.

## File Size

We started by testing for ourselves if what we’d been hearing from multiple sources was correct: HEIF occupies less space. With a simple switch to our [disk cache][pspdfdiskcache link]’s file format, we were able to confirm this. A HEIF image needs only about 90 percent of the space that the same image needs as a JPEG when the quality is at 100 percent. When the quality is 90 percent, it needs only 80 percent of the space of a JPEG. In theory, we could store higher quality images in our cache without seeing an increase in the disk usage.

However, a HEIF image at 100 percent is still larger than a JPEG at 90 percent quality, so it would not be possible to switch to it without a significant increase in disk space.

![Image Size Comparison](/images/blog/2018/ios-heic-performance/image_size_comparison.png)

## Decoding Performance

Next up, we needed to check how quickly a HEIF image could be decompressed for display. We couldn’t afford to lose too much time, as the images need to be displayed as quickly as possible. To test, it is not enough to simply initialize a `UIImage` with the appropriate image, as `UIImage`s don’t decode (decompress) the image data until it’s actually requested. So we drew it into a temporary image context to ensure decoding occurred:

[==

```objc
- (void)testJPEGDecodingWithQuality:(CGFloat)quality {
    NSString *jpegImagePath = [self generateImageWithType:kUTTypeJPEG fileName:@"image.jpg" quality:quality];
    for (int i = 0; i < 100; i++) {
        @autoreleasepool {
            UIImage *image = [UIImage imageWithContentsOfFile:jpegImagePath];
            UIGraphicsBeginImageContextWithOptions(image.size, NO, 1.0);
            [image drawAtPoint:CGPointZero];
            (void)UIGraphicsGetImageFromCurrentImageContext();
            UIGraphicsEndImageContext();
        }
    }
}

- (void)testHEIFDecodingWithQuality:(CGFloat)quality {
    NSString *heicImagePath = [self generateImageWithType:(__bridge CFStringRef)AVFileTypeHEIC fileName:@"image.heic" quality:quality];
    for (int i = 0; i < 100; i++) {
        @autoreleasepool {
            UIImage *image = [UIImage imageWithContentsOfFile:heicImagePath];
            UIGraphicsBeginImageContextWithOptions(image.size, NO, 1.0);
            [image drawAtPoint:CGPointZero];
            (void)UIGraphicsGetImageFromCurrentImageContext();
            UIGraphicsEndImageContext();
        }
    }
}
```

==]

We started a time profiler run and compared the performance of the two. `testJPEGDecoding` ran for 1.82 seconds when quality was 1.0, while `testHEIFDecoding` ran for 3.95 seconds. Decoding the newer file format took a whopping 2.1 times longer, which meant we definitely could not switch to this by default. This seems surprising, given that this process should be hardware accelerated on any device with an A9 chip or newer. These tests were run on a 10.5-inch iPad Pro, which has the A10X chip. We saw similar results when reducing the quality to 0.9: The JPEG run finished in 1.7 seconds, while HEIF needed 3.69 seconds. We also ran our benchmarks on a newer 11-inch iPad Pro and an iPhone XS Max. The results were unexpected: For any HEIC workload, the newer iPad Pro with the A12 X Bionic chip was consistently slower than both the iPhone XS Max and the iPad Pro from 2017.

![Decoding Speed Comparison](/images/blog/2018/ios-heic-performance/decoding_speed_comparison.png)

## Encoding Performance

For the sake of thoroughness, we went ahead and measured the encoding performance as well:

[==

```objc
- (void)testJPEGEncodingWithQuality:(CGFloat)quality {
    UIImage *image = self.preloadedTestImage;
    for (int i = 0; i < 100; i++) {
        @autoreleasepool {
            NSMutableData *mutableImageData = [NSMutableData new];

            CGImageDestinationRef destination = CGImageDestinationCreateWithData((__bridge CFMutableDataRef)mutableImageData, kUTTypeJPEG, 1, NULL);
            CGImageDestinationAddImage(destination, image.CGImage, (__bridge CFDictionaryRef)@{(__bridge NSString *)kCGImageDestinationLossyCompressionQuality: @(quality)});
            CGImageDestinationFinalize(destination);
        }
    }
}

- (void)testHEIFEncodingWithQuality:(CGFloat)quality {
    UIImage *image = self.preloadedTestImage;
    for (int i = 0; i < 100; i++) {
        @autoreleasepool {
            NSMutableData *mutableImageData = [NSMutableData new];

            CGImageDestinationRef destination = CGImageDestinationCreateWithData((__bridge CFMutableDataRef)mutableImageData, (__bridge CFStringRef)AVFileTypeHEIC, 1, NULL);
            CGImageDestinationAddImage(destination, image.CGImage, (__bridge CFDictionaryRef)@{(__bridge NSString *)kCGImageDestinationLossyCompressionQuality: @(quality)});
            CGImageDestinationFinalize(destination);
        }
    }
}
```

==]

The `testJPEGEncoding` method took 9.4 seconds to complete with a quality of 1.0, while `testHEIFEncoding` took 8.07 seconds. This was a bit of a surprise: Encoding a HEIF image at a quality of 1.0 was 15 percent faster than encoding a JPEG with the quality set at 1.0. However, we weren’t looking to store images with the quality set so high due to the increase in disk space required, as mentioned above.

When the quality was set to 0.9, JPEG took the lead again, completing execution in 4.97 seconds, compared to HEIF’s 7.7 seconds. In other words, it was 1.5 times quicker.

![Encoding Speed Comparison](/images/blog/2018/ios-heic-performance/encoding_speed_comparison.png)

## Conclusions

While HEIF turns out to be much more efficient as a storage medium, converting that stored data into a bitmap (and vice versa) is a process that’s much slower than using a JPEG. Therefore, we decided not to switch to HEIF in the cache for the time being and to reevaluate on future OSes and hardware. For other use cases, like storage of camera captures, network transmissions, or any other such instance where the size needs to be as small as possible, HEIF is indeed a great option. We hope that with improved hardware in the future, HEIF will become a viable option for our use case as well.

We also set up a small GitHub repository for an iOS app that runs these tests and logs the time taken. If you’re interested take a look at the [HEIC Benchmark][heic benchmark repo].

[heif wikipedia]: https://en.wikipedia.org/wiki/High_Efficiency_Image_File_Format
[fw link]: https://pspdfkit.com/pdf-sdk/ios/
[compression performance table]: https://nokiatech.github.io/heif/technical.html#table-4
[pspdfdiskcache link]: https://pspdfkit.com/api/ios/Classes/PSPDFDiskCache.html
[heic benchmark repo]: https://github.com/PSPDFKit-labs/HEIC-Benchmark
