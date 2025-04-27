---
title: "Making C++ Talk to Other Languages with SWIG"
description: "Using SWIG to generate interfaces to talk to a C++ backend."
preview_image: /images/blog/2019/making-cpp-talk-to-other-languages-with-swig/article-header.png
section: blog
author:
  - Nick Winder
author_url:
  - http://www.nickwinder.com
date: 2019-11-12 8:00 UTC
tags: C++, SWIG
published: true
secret: false
---

Programming in C++ has many advantages: It’s fast, it compiles pretty much anywhere, and it’s a language that has stood the test of time. But this doesn’t mean that C++ is good for every situation. Sometimes throwing together a procedure in a simple scripting language is all that’s required, or maybe you need to use a language that lends itself to frontend work. In situations such as these, wouldn’t it be great if we could just use C++ for the core of our designs and then specialize with other languages where the situation fits?

Creating an interface in C++ that many languages can use has long been an issue. It’s possible to talk to other languages, such as Java with [JNI][jni], and Python by extending [CPython][cpython], but these are not all-in-one solutions and they often require extra boilerplate for anything to work. And nobody likes writing boilerplate.

Today I’m going to introduce a tool named SWIG (Simplified Wrapper and Interface Generator), which attempts to adapt C++ and make it relevant to many languages. SWIG first came on the scene in 1995 due to the exact reasons mentioned above (the need to make projects much easier to script, and for creating UIs). Because of its age, many believe it’s a bit of a dinosaur, but with the recent 4.0 update, it shows that development is still current. Not only that, but in addition to the updates, there is still no viable alternative to SWIG when it comes to multi-language targeting.

## Example

### Code

To explain how SWIG works, it’s best to see an example:

```
class Parent {
public:
 void addChild(Child child);
 std::vector<Child> getChildren() const;

private:
 std::vector<Child> m_children;
};

class Child {
public:
 Child() = default;
 explicit Child(float sizeOfHead);
 uint8_t getNumberOfLegs() const;
 float getSizeOfHead() const;
 void setSizeOfHead(float sizeOfHead);
private:
 float m_sizeOfHead;
};
```

The sample classes above will be the simple interface we want to create with SWIG. The classes make use of object ownership, along with some C++ Standard Template Library (STL) features that are interesting to explore.

Ownership is often something that is complex when crossing boundaries, so the classes show how `Child` can be owned by the Parent class in C++ and the parent can only manipulate this ownership with the accessors `addChild` and `getChildren`. Meanwhile, `Parent` will be owned and instantiated by the target language. The classes also make use of the STL with `std::vector`, which will be translated into the target language by SWIG. These features start to show the advantages that SWIG can provide.

To create the interface, we first need to write an extra file to instruct SWIG what to export and what to ignore:

```
%module family
%{
#include "source/Parent.hpp"
#include "source/Child.hpp"
%}

// Import standard types.
%include "std_vector.i"
%include "stdint.i"

%include "source/Parent.hpp"
%include "source/Child.hpp"

namespace std {
   %template(vector_child) vector<Child>;
};
```

From this file, a C++ to C wrapper file will be created. This will then be compiled into a library at a later date. Let’s step through this interface file:

```
%module family
```

First we define the name of the module we’d like to create. This name will be used in some languages as the package name.

**ℹ️ Note:** You can optionally override the module name on the command line.

```
%{
#include "source/Parent.hpp"
#include "source/Child.hpp"
%}
```

Because the C++ code we write is going to be converted into C wrapper code, we often need to supply some extra code to be copied into this file. In most instances, this is just a list of header files, but it could be anything that’s required. The block surrounded by `%{ … %}` will be directly copied into the wrapper source:

```
%include "std_vector.i"
%include "stdint.i"

namespace std {
   %template(vector_child) vector<Child>;
};
```

Some STL features are supported by SWIG, but this is dependent upon which language you are targeting. Types like `std::vector` and integer types are supported by importing modules that are supplied as part of the SWIG library. Modern C++17 features, like [nested namespaces][nested-namespaces], are supported, but there are some areas, like `std::optional` support, where SWIG is lacking. Check out the [SWIG C++ library][swig-c++-library] documentation and [standard library changes][swig-std-library-changes] for more information.

The extra template information instructs SWIG to generate some extra wrapper code for the appropriate target language and is required for container definitions like the above. Otherwise, a compilation error will be seen:

```
%include "source/Parent.hpp"
%include "source/Child.hpp"
```

Lastly, we define the interface for SWIG. This could be done by hand with C++-like syntax, but if your header files are simple enough for SWIG to parse, it’s possible to include them directly. If any part of your header is not SWIG compliant, it’s also possible to disable the parsing of a block with [preprocessor conditional directives][]:

```
#ifndef SWIG
   // Non-compliant block of code.
#endif
```

### Target Code Generation

Now that we have our code all fully defined and ready to go, we need to generate the C++ wrapper source file and any target language files required. For this, we need the SWIG command-line tool. On macOS, you can install this with `brew`, but it’s also possible to pull down the source and compile the tool yourself using [SWIG source][swig-source].

Once you have installed SWIG and it is in your path, you can generate the code with the next command.

**ℹ️ Note:** The following commands are based on macOS 10.14. Please adjust the Python paths and includes for your target system.

```
swig -python -I. -c++ -outdir . -o familyPYTHON_wrap.cxx family.i
```

The above command will instruct SWIG to generate output for the Python file `family.py` and a C++ wrapper source file of `familyPYTHON_wrap.cxx` from the interface file `family.i`. There are more options which can be found by executing `swig --help`.

Great! We now have our Python source we can call. The Python file will try and load a library named `_family`, so now we have to compile this:

```
c++ -fPIC -std=c++17 -c source/Child.cpp source/Parent.cpp familyPYTHON_wrap.cxx -isystem /usr/local/Cellar/python/3.7.3/Frameworks/Python.framework/Versions/3.7/include/python3.7m
```

We generate the object files by compiling the interface source and the wrapper code:

```
c++ -dynamiclib Child.o Parent.o familyPYTHON_wrap.o /usr/local/opt/python/Frameworks/Python.framework/Versions/3.7/lib/libpython3.7m.dylib -o _family.so
```

Then we link the object files to produce `_family.so`.

Now our package is ready to be used!

```
$ python3
>>> import family
>>> parent = family.Parent()
>>> child = family.Child(10)
>>> parent.addChild(child)
>>> children = parent.getChildren()
>>> print(children.size())
1
>>> print(children[0].getSizeOfHead())
10.0
>>> print(child.getNumberOfLegs())
2
```

### Simpler Build System

CMake supports the building of SWIG modules out of the box. I’d advise using the SWIG package to handle the nuances of each target platform. More information can be found in the [SWIG build documentation][swig-build-documentation] and in the [CMake documentation][cmake-documentation].

The source and build files for the above can be found at [PSPDFKit-labs SWIG example][supporting-repo], which also uses the CMake SWIG system.

## Conclusion

This concludes a simple example of how to use SWIG to generate a Python interface. To target other languages like C# and Java, it is nearly as easy as defining `-csharp` or `-java` when calling the `swig` executable. However, there are a few library and namespace considerations to take into account. For more information on other supported languages, I’d suggest heading over to the [SWIG documentation][swig-documentation].

[jni]: https://docs.oracle.com/javase/8/docs/technotes/guides/jni/
[cpython]: https://github.com/python/cpython
[swig-c++-library]: http://www.swig.org/Doc4.0/Library.html#Library_stl_cpp_library
[swig-std-library-changes]: http://www.swig.org/Doc4.0/CPlusPlus11.html#CPlusPlus11_standard_library_changes
[preprocessor conditional directives]: http://www.cplusplus.com/doc/tutorial/preprocessor/
[swig-source]: https://github.com/swig/swig
[swig-build-documentation]: http://www.swig.org/Doc4.0/Introduction.html#Introduction_build_system
[cmake-documentation]: https://cmake.org/cmake/help/latest/module/UseSWIG.html
[swig-documentation]: http://www.swig.org/Doc4.0/Sections.html#Sections
[nested-namespaces]: https://en.cppreference.com/w/cpp/language/namespace
[supporting-repo]: https://github.com/PSPDFKit-labs/swig-cpp-blog-example
