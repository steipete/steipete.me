---
title: "Effective Header Management in C++"
description: "How we can reduce build times and clean up our header dependencies with effective header management."
preview_image: /images/blog/2020/effective-header-management-in-cpp/article-header.png
section: blog
author:
  - Amit Nayar
author_url:
  - https://twitter.com/amitnayar_
date: 2020-01-13 8:00 UTC
tags: Development, C++
published: true
secret: true
---

Long build times can be frustrating. You make one tiny, innocuous change in a header file, and 200 files have to rebuild before you can continue your work. What do you do? Make another coffee? Sit and wait? Have a [sword fight][xkcd comic]?

READMORE

What’s more is the [time][] wasted compiling is not the only problem. Having to wait breaks up flow, and this can tempt us into finding distractions, ultimately slowing down overall development time and reducing our effectiveness as developers. So in order to help avoid these kinds of issues, in this post, we will take a look at ways of effectively managing header files and header dependencies in order to make our build times quicker and our code cleaner.

## Modularity

Compilers have to keep everything they require to build your code in memory, so if everything is interconnected, then the compiler requires that _everything_ be built. As developers, we should strive for modularity, which means the compiler should spend less time building parts of code that are not required.

At PSPDFKit we have a large codebase, and one component can consist of thousands of interconnected source and header files. As such, reducing the interdependencies can be tricky. Thankfully, there are some basic techniques we can use to make our code build faster and our use of time more effective.

### Direct Includes

Direct includes are the header files included that use the `#include` preprocessor directive. They are used to pull in code from another file, which we can then use, which in turn allows us to split our code up into logical parts.

However, there are some pitfalls to overusing direct includes. It can be easy to get into the habit of copying a huge list of header files from the last file you were looking at and dumping them in a new file so you don’t have to think about what is actually being used. Along with making it less clear what is being used, this practice, when done over a long period of time, can cause build times to increase massively. So, if `class X` only has an `A` and a `B`, only `A.h` and `B.h` should be included!

Fortunately, there are static analysis tools that can help find unnecessary includes in your code. One such example is [include-what-you-use][iwyu], which analyzes includes in your source files and offers suggestions of unnecessary includes to remove and forward declarations that can take their places (more on this below). However, as a fundamental best practice of software development and engineering in general, it is important to take the time to consider which components are required _before_ relying on automatic tools.

### Indirect Includes

Indirect includes are header files that have been included within another header file. These can cause issues with modularity, as files can quickly become interconnected and interdependent. A technique for reducing this is to use forward declarations.

Forward declarations are an extremely useful feature of C++ and should be the default approach when writing a header file. Why? Because every time you include a header file in your header file, you run the risk of including more header files that you don’t require. And what if someone else needs to include this header file? Well, they are also getting the extra baggage of includes that may not be required. And so forth and so on. You can see how this can quickly become a tangled mess of header files within header files, all while slowing down build times.

With forward declarations, we are introducing a name to our compiler. In certain cases, a name is all that is required — the compiler only needs to know that a specific identifier exists somewhere in the code. Details about the identifier, such as how much memory it requires or what methods it has, are generally not relevant until the identifier is actually used in the implementation. To a compiler, a pointer or reference is always the same size and can always have the same operations performed on it, no matter to which identifier it is pointing or referring. Our goal is to give the compiler only what it needs to compile a file. Consider a class that contains a member that points to another class. In this case, all the compiler needs to know at this time is the fact that it is a pointer and that this identifier name exists.

Now let’s take a look at an example of `Elephant.h` to see how we can use a forward declaration to reduce the number of header files we need:

```cpp
// `Elephant.h`

// `Trunk.h` is required because `Elephant` has a direct instance of a `Trunk` object.
#include "Trunk.h"

class Elephant
{
public:
    // `m_trunk` can be configured on `Elephant`'s construction by passing a custom `Trunk` reference.
    Elephant(const Trunk& trunk);

    // .. Lots of `Elephant`-related actions.

private:
    // Trunk object
    Trunk m_trunk;

    // .. Other things an `Elephant` might have.
}
```

We can change how the [elephant gets its trunk][] by using a forward declaration, which allows us to remove the header dependency:

```cpp
// `Elephant.h`

// No `Trunk.h` is required because the compiler already knows everything about a pointer.

// However, the compiler needs to know that something called a `Trunk` does indeed exist.
class Trunk;  // Forward Declaration.

class Elephant
{
public:
    // We are only using a reference here, so the compiler still does not need to know the details of `Trunk`.
    Elephant(const Trunk& trunk);

    // .. Lots of `Elephant`-related actions.

private:
    // Pointer to a `Trunk` object, so no specifics are required.
    Trunk* m_trunk = nullptr;

    // .. Other things an `Elephant` might have.
}
```

Great! We have removed the header dependency with a forward declaration, so the header file only needs to be included in the source file. To continue with this, let’s say another class, `SafariPark`, holds a container of `Elephant`s and needs to include `Elephant.h`. In our first example, if we had to change the `Elephant` class, the compiler would also need to process `Trunk.h`, thereby increasing the build time, when in fact, a `SafariPark` should not need to know the details of an elephant’s trunk in order to work. Of course, in this case, `Elephant` can also be forward declared inside `SafariPark.h` if `SafariPark` holds a container of `Elephant` pointers.

### Single Responsibility

Paradoxically, creating more header files can often reduce build times as we further reduce interdependency and increase modularity. The goal is to split header files so they are only responsible for one thing, thereby reducing the effect of having to recompile multiple files when only one thing changes.

Say our elephant had to know about which continent it comes from in order to be made:

```cpp
// `Elephant.h`

// Forward declarations.
class Trunk;

// Enum describing the types of `Continent`s.
enum class Continent
{
    Africa,
    Antarctica,
    Asia,
    Australia,
    Europe,
    NorthAmerica,
    SouthAmerica,
}

class Elephant
{
public:
    // `Elephant` needs to know which continent it is created in to determine various continent-specific elephant properties.
    Elephant(const Trunk& trunk, Continent continent);

private:
    Trunk* m_trunk = nullptr;
    Continent m_continent;
}
```

Maybe we have a few more classes that also have to know about `Continent`, such as `Camel` and `Bear`. Our `Elephant` class is likely to change much more regularly than our `Continent` enum, and every time `Elephant.h` changes, `Camel` and `Bear` also need to recompile, which — you guessed it — slows down incremental build times.

The solution is simple — split out `Continent` to its own header file so `Camel` and `Bear` no longer have to include `Elephant`:

```cpp
// `Continent.h`

// There's nothing wrong with having a header file with just a single enum inside!
enum class Continent
{
    Africa,
    Antarctica,
    Asia,
    Australia,
    Europe,
    NorthAmerica,
    SouthAmerica,
}
```

```cpp
// `Elephant.h`

// Sometimes having more header files is beneficial — especially for small things that do not change much.
#include "Continent.h"

class Trunk;
class Elephant
{
public:
    Elephant(const Trunk& trunk, Continent continent);

    // Lots of things in `Elephant` that might change regularly.
    // The less other header files depend on this one, the better.
}
```

We also need to replace the `Elephant.h` include in the other header files with the much smaller `Continent.h`.

Now there’s no reason for `Camel` or `Bear` to recompile whenever `Elephant` changes!

Small changes like this can make a huge difference in the overall complexity and development time in the long run.

## Conclusion

In this blog post, we looked at some simple but powerful habits that can reduce compilation times and make cleaner, modular, more maintainable code. We looked at three techniques, and here are the takeaways:

1. Removing unused header files using static analysis checks and taking some time to consider which header files are required can be a straightforward initial attempt at reducing the number of header file dependencies.

2. Forward declarations can be used to reduce the amount of header files within header files.

3. Increasing the number of header files by splitting information into smaller, singularly responsible files can reduce the amount of recompiling we have to do when making changes.

Here at PSPDFKit, we use these simple techniques to speed up our development process while making our code easily extendable, which ultimately allows us to get our products shipped in a timely manner.

[xkcd comic]: https://xkcd.com/303
[time]: https://pspdfkit.com/blog/2018/time-management/
[iwyu]: https://include-what-you-use.org
[elephant gets its trunk]: https://blog.rhinoafrica.com/2017/08/31/just-stories-how-elephant-trunk/
