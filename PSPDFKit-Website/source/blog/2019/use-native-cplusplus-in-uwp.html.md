---
title: "How to Use Native C++ in UWP"
description: "How to include native C++ in your UWP app and call into it from C#."
preview_image: /images/blog/2019/use-native-cplusplus-in-uwp/article-header.png
section: blog
author:
  - James Swift
author_url:
  - https://twitter.com/_jamesswift
date: 2019-05-15 8:00 UTC
tags: Windows, UWP, Development, How-To
published: true
secret: false
---

Developing for UWP can be done in C++, C#, Microsoft Visual Basic, and JavaScript. The version of C++ used for UWP development is either C++/CX or C++/WinRT. C++/CX is standard C++ with additional language extensions in order to work with managed memory. C++/WinRT is a newer attempt by Microsoft to allow UWP development in standard C++ without the non-standard language extensions of C++/CX.

C++/WinRT is fast becoming the standard way to write C++ for UWP. However, it is only available from Windows 10 version 1803 onward, and as such, it isn’t yet the best choice if you need to deploy on older, still supported versions of Windows 10.

Due to the relative ease of learning the language and superior tooling available, most developers choose to write apps for UWP in C#. But what do you do when you want to reuse a library written in native C++ in your UWP app alongside another UWP language instead of rewriting it? By leveraging our powerful, fast, and mature cross-platform C++ codebase, [PSPDFKit for Windows][] does exactly that. In this article, I will describe one strategy to allow you to do this.

## Compiling

Imagine the following super-duper complex library expertly written in C++ is used in your other projects for doubling integers and you want to reuse it in your new UWP killer app. The code might look something like the following.

**Header:**

```cpp
#pragma once

class CppDoubler {
public:
    int32_t doubleInput(int32_t in);
}
```

**Implementation:**

```cpp
#include "cppdoubler.h"

int32_t CppDoubler::doubleInput(int32_t in) {
    return in * 2;
}
```

It’s possible to produce dynamic-link libraries (DLLs) from your code, but it’s simpler and less error-prone to compile your library to a [`static library`][static-lib]. You will need to link against the [Multi-threaded Debug DLL runtime library][md-runtime] and produce a debug and release build of your library for every target architecture you wish to support, (which could include Windows x86, x64, ARM, ARM64, or any combination of these).

[UWP’s security model][uwp-description] forbids the use of a subset of the Win32 API. In order to ensure your code will run in a UWP app, you must compile your code with the [`/ZW` compiler flag][zw-flag]. Any code that uses forbidden API calls will result in a compiler error. For almost every call, there is usually a new one you can substitute for the old call or work around in a variety of ways.

You may wish to only use the new calls when compiling for UWP. In this example code, I use a preprocessor definition, `COMPILING_FOR_UWP`, to control which call is used:

```cpp
#if defined(COMPILING_FOR_UWP)
     return ::VirtualAllocFromApp(nullptr, length, MEM_RESERVE | MEM_COMMIT, PAGE_READWRITE);
#else
     return ::VirtualAlloc(nullptr, length, MEM_RESERVE | MEM_COMMIT, PAGE_READWRITE);
#endif
```

## Wrapping

Now that you have a set of libs compiled for debug and release for all the architectures you’re targeting, the next step is to wrap them with a [WinRT component][winrt].

In Visual Studio, create a C++ Windows Runtime Component project. Rename the generated WinRT namespace and component class to something more suitable for your project. This class is written in [`C++/CX`][cpp-cx].

![Creating a C++ Windows Component project](/images/blog/2019/use-native-cplusplus-in-uwp/winrt-project.png)

Following your imagined C++ library above, add a member function named `DoubleInput` to the class that will be exposed on that WinRT component:

```cpp
#pragma once

namespace DoublerComponent
{
    public ref class Doubler sealed
    {
    public:
        Doubler();

        int DoubleInput(int input);
    };
}
```

Then, in the implementation file, include the C++ library header and call out to that function:

```cpp
#include "pch.h"
#include "Doubler.h"

// Include the header of the native C++ library.
#include "cppdoubler.h"

// Link the C++ library.
#pragma comment(lib, "cppdoubler.lib")

using namespace DoublerComponent;
using namespace Platform;

Doubler::Doubler()
{
}

int Doubler::DoubleInput(int input)
{
    // Here in C++/CX, we can use standard C++.
    CppDoubler doubler;
    return doubler.doubleInput(input);
}
```

Note that, in this example, I’m using a `#pragma` to specify a library to link. In [real-world code][lib-example], you would set up library include paths for each architecture and configuration you are building for.

You can now reference this Windows Runtime Component in any UWP code.

## Consuming

Finally, add a reference to the component in a UWP app and use it in any of the supported languages:

```csharp
using DoublerComponent;

namespace DeepThoughtApp
{
    public sealed class Thinking
    {
        public int TheAnswerToLifeTheUniverseAndEverything()
        {
            var doublerWinRT = new Doubler();
            var complexCalculationResult = doublerWinRT.DoubleInput(20);
            var moreThinking = doublerWinRT.DoubleInput(1);

            return complexCalculationResult + moreThinking;
        }
    }
}
```

## Conclusion

As you can see, it isn’t too hard to bring existing C++ library code into your UWP development process. One thing to be aware of is that, in UWP apps, you shouldn’t call long-running code from the UI thread or Windows may kill your application. To avoid that issue, you may want to execute the calls in the WinRT wrapper on a background thread and await their completion. [See here for more details][resposive-ui-thread].

And finally, if you don’t need to target all currently supported versions of Windows, you should take a look at C++/WinRT instead of using C++/CX. However, with C++/WinRT, the solution above would remain essentially the same.

[resposive-ui-thread]: https://docs.microsoft.com/en-us/windows/uwp/debug-test-perf/keep-the-ui-thread-responsive
[cpp-cx]: https://docs.microsoft.com/en-us/cpp/cppcx/visual-c-language-reference-c-cx
[winrt]: https://docs.microsoft.com/en-us/windows/uwp/winrt-components/
[zw-flag]: https://docs.microsoft.com/en-us/cpp/build/reference/zw-windows-runtime-compilation
[md-runtime]: https://docs.microsoft.com/en-us/cpp/build/reference/md-mt-ld-use-run-time-library
[uwp-description]: https://docs.microsoft.com/en-us/windows/uwp/get-started/universal-application-platform-guide
[static-lib]: https://docs.microsoft.com/en-us/cpp/windows/walkthrough-creating-and-using-a-static-library-cpp
[pspdfkit for windows]: https://pspdfkit.com/windows
[lib-example]: https://github.com/Microsoft/microsoft-r-open/blob/master/vendor/curl-7.49.1/projects/Windows/VC10/src/curl.vcxproj#L937
