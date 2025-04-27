---
title: "The C++ Lifetime Profile: How It Plans to Make C++ Code Safer"
description: "This blog post explains what the C++ Lifetime Profile is and how it intends to make the language safer and help avoid memory management problems."
preview_image: /images/blog/2020/the-cpp-lifetime-profile/article-header.png
section: blog
author:
  - Daniel Martín
author_url:
  - https://twitter.com/dmartincy
date: 2020-01-22 8:00 UTC
tags: Development, C++
published: true
secret: false
---

High amounts of low-level systems are written in C++. Memory access in C++ is virtually unrestricted, which means that bugs in C++ programs can corrupt it and cause crashes or security problems. For this reason, we call C++ a memory-unsafe programming language — in contrast to memory-safe languages like Java, Rust, and Swift.

READMORE

In this blog post, I’ll talk about the C++ Lifetime Profile, explaining what it is, how it intends to reduce the problems typically caused by the memory-unsafe characteristics of C++, what the status of the current implementation of the Lifetime Profile is, and what the current limitations are.

## An Overview of the C++ Lifetime Profile

The C++ Lifetime Profile was written by Herb Sutter in [the C++ Core Guidelines][cpp-core-guidelines-lifetime], and it is a document that proposes a method to detect object lifetime issues that cause memory corruption in C++. The main benefits of the C++ Lifetime Profile are:

- Error detection happens at compile time, not at runtime. This means that problems are detected sooner (when the code is compiled), and it removes the need to write a test that runs the problematic code.
- It’s a “de facto” standard and not a “de jure” standard. The C++ Lifetime Profile is not part of the C++ standard yet, but Sutter wants every major compiler to provide these diagnostics by default.
- Following modern C++ principles and practices, such as avoiding the use of raw pointers and using Resource Acquisition Is Initialization (RAII), there is an emphasis on lowering the number of false positives and [heisenbugs][] that can occur in your code.

How does the Lifetime Profile detect memory corruption issues caused by incorrect object lifetime handling? By tracking what is a pointer type and what is an owner type.

## Pointers and Owners

Pointers in C++ are the types that refer to a resource but are not responsible for managing the resource lifetime — that is, they don’t dispose of the resource when they are no longer using it. Examples of pointer types in C++ are the raw pointers `*`, `std::string_view`, `gsl::span`, and `std::vector<T>::iterator`. In C++, it’s crucial that the “pointed to” resource outlives the pointer variable. Otherwise, it results a dangling pointer that will cause undefined behavior in the program.

How does the Lifetime Profile identify pointer types in your code at compile time? There are several ways to identify them:

- If the type is annotated with `[[gsl::Pointer(T)]]`.
- If the type satisfies the C++ iterator requirements.
- If the type is trivially copyable, copy constructible, copy assignable, and can be dereferenced.
- If the type is a closure type of a lambda that captures its arguments by reference or captures a pointer by value.
- If the type derives from a pointer type.

In contrast, owners in C++ are types that are responsible for managing resource lifetimes. Examples of owner types in C++ are `std::string`, `std::unique_ptr`, `std::shared_ptr`, and `std::vector`.

How does the Lifetime Profile identify owner types in your code? Again, there are several ways to identify them:

- If the type is annotated with `[[gsl::Owner(T)]]`.
- If the type satisfies the C++ container requirements and has a user-provided destructor.
- If the type provides a unary `*` and has a user-provided destructor.
- If the type derives from an owner type.

## How Does the Lifetime Profile Track Lifetime?

Lifetime analysis tracks what a pointer points to at any time. There are several cases, outlined below.

- The pointer is constructed from an owner. For example:

```cpp
auto mySpan = std::span(Container&);
```

- The pointer is returned from an owner. For example:

```cpp
const char* = myString.c_str();
```

- The pointer is constructed from another pointer. For example:

```cpp
auto string = string_view(const char*);
```

For each local variable, the analysis tracks the set of things that it points to. For example, when a pointer is initialized like what’s shown below, the “points-to” set contains a single element, `{nullptr}`:

```cpp
int* pointer = nullptr;
```

Later in the code, if we modify `pointer` so that it points to another thing (as shown below), the compiler tracks that change and the “points-to” set of `pointer` is now `{value}`:

```cpp
int value = 0;
pointer = &value;
```

When `value` goes out of scope and it’s destroyed, all the “points-to” sets that contain `value` are replaced with `invalid`. Thus, the “points-to” set of `pointer` will be `{invalid}`. This means that whenever `pointer` is dereferenced, the compiler will emit a diagnostic because it contains `invalid` in its “points-to” set; that is, the pointer has dangled.

In practice, the implemented diagnostics will cover situations like:

- Initializing a pointer from a temporary owner.
- Returning a pointer to a local or temporary owner.

## Current Implementations: Clang and Visual Studio

### Clang

The implementation of lifetime analysis in Clang is experimental as of the beginning of 2020. [There’s a fork of the LLVM repository][llvm-lifetime] where Gábor Horváth and Matthias Gehre are developing this feature. As mentioned on the GitHub project page, you can test the feature either in [Compiler Explorer][compiler-explorer] or by compiling this version of Clang locally:

```sh
mkdir build
cd build
cmake ../llvm -DCMAKE_BUILD_TYPE=Release -DLLVM_TARGETS_TO_BUILD="X86" -DLLVM_ENABLE_PROJECTS=clang
make
```

If you have an existing codebase that you want to test, you can use [this Python script][lifetime-python-script], which gets every project source file and its compilation commands and compiles them using Clang with lifetime analysis. This project is still unstable, so to help with improvements, the script will prepare a test case that can be reported to the project owners if the compiler crashes.

### Visual Studio

Support for Lifetime Profile checks started with [Visual Studio 2019][visual-studio-2019].

## Conclusion

The Lifetime Profile is an interesting set of guidelines and compiler implementations that will help C++ developers create safer and more stable code. Here at PSPDFKit, we will continue to monitor how this feature is evolving, and we will start using it in production as soon as we deem it stable enough, because catching object lifetime problems early means that our customers will enjoy safer and more stable software.

[llvm-lifetime]: https://github.com/mgehre/llvm-project
[compiler-explorer]: https://godbolt.org/z/z-x3Jj
[visual-studio-2019]: https://devblogs.microsoft.com/cppblog/lifetime-profile-update-in-visual-studio-2019-preview-2/
[lifetime-python-script]: https://gist.github.com/mgehre/4d1720580d0ad2bf8cafa876f737cfec
[cpp-core-guidelines-lifetime]: https://github.com/isocpp/CppCoreGuidelines/blob/master/docs/Lifetime.pdf
[heisenbugs]: https://en.wikipedia.org/wiki/Heisenbug
