---
title: "How to Extend LLDB to Provide a Better Debugging Experience"
description: "Explore the extensibility capabilities of LLDB, a debugger for Swift, C, C++, and Objective-C code."
preview_image: /images/blog/2018/how-to-extend-lldb-to-provide-a-better-debugging-experience/article-header.png
section: blog
author:
  - Daniel Martín
author_url:
  - https://twitter.com/dmartincy
date: 2018-10-09 8:10 UTC
tags: Development, iOS, LLDB, How To
published: true
secret: false
---

Software debugging is a process in which programmers remove errors from programs with the help of specialized tools that are able to run a program instruction by instruction and inspect its state. However, big programs can be complex, and even after applying some techniques to reduce their complexity (like functional programming), programmers often have difficulties completely understanding their flow. Inspecting the contents of variables and executing a program step by step is sometimes not enough; there’s certainly a need to improve this typical debugging experience to help visualize the flow of complex programs so that changes can be made with more confidence.

At PSPDFKit, we develop [our products](https://pspdfkit.com/pdf-sdk/) using several languages, including Swift, Objective-C, C++, Java, JavaScript, and Kotlin. In this article, I will focus on the debugger we use for Swift, Objective-C, and C++: LLDB.

# What Is LLDB?

LLDB is the debugger that is installed by default with the Xcode IDE. It supports C, C++, Objective-C, and Swift, and is architected on top of [LLVM](https://llvm.org), a set of reusable and decoupled libraries that offer functionality like an expression parser or a code disassembler. If you need general information about how to use LLDB, you can [access a cheat sheet summarizing the most important commands](https://www.nesono.com/sites/default/files/lldb%20cheat%20sheet.pdf). Meanwhile, the rest of this post will focus on how to extend the functionality of LLDB.

# How to Extend LLDB

The `lldb` command-line tool is a relatively simple client of the public LLDB C++ API, which, in macOS, is placed in `/Applications/Xcode.app/Contents/SharedFrameworks/LLDB.framework`. You don’t need to know C++ in order to extend LLDB, as the entire API is exposed through Python script bindings.

There are many things that can be extended in LLDB, but for now we’ll focus on commands and data formatters.

## Commands

An LLDB command abstracts a set of operations you can do with the debugger, and it is a concept similar to a function or a procedure in a programming language. To create your first command in LLDB that will output "Hello, world," create a Python source file named `MyModule.py`, place it in your `~/lldb` directory (create it if it does not exist), and paste in the following content:

```python
import lldb

def __lldb_init_module(debugger, internal_dict):
    debugger.HandleCommand('command script add -f MyModule.helloWorld hello')

def helloWorld(debugger, command, result, internal_dict):
    print('Hello, world!')
```

The first line will import the LLDB module so that it is accessible from this script. `__lldb_init_module` is a hook function that will be called each time your script module is loaded by the debugger. Within it, we use the `HandleCommand` method of `debugger` (an instance of the [SBDebugger](https://lldb.llvm.org/python_reference/lldb.SBDebugger-class.html) class) to run the command `command script add -f MyModule.helloWorld hello`. This command adds a new command with the name `hello`, implemented by the function `helloWorld` in the `MyModule` module.

To load this new command every time you start a debugging session, open or create the file `.lldbinit` in your home directory and paste the following code:

```python
command script import ~/lldb/MyModule.py
```

From now on, when you pause an application in LLDB, you can run this new command:

```sh
(lldb) hello
Hello, world!
```

Congratulations, you have created your first LLDB command.

## Data Formatters

Another important extensibility point in LLDB is the creation of custom data formatters. Applications usually have their own data structures, and displaying them in the debugger is sometimes challenging. To address this, LLDB provides two types of data formatters: type summaries and synthetic children.

### Type Summaries

A type summary extracts information from classes, structs, etc. and arranges it in a user-defined format. For example, let’s take this Swift structure:

```swift
struct MyRect {
    let top: Float
    let bottom: Float
    let left: Float
    let right: Float
}
```

We can create a type summary that displays the width and height of this structure as a convenience. Create a `MyRectScript.py` Python file with the following content:

```python
def MyRectSummary(value, internal_dict):
    top = value.GetChildMemberWithName("top").GetValueAsSigned()
    bottom = value.GetChildMemberWithName("bottom").GetValueAsSigned()
    left = value.GetChildMemberWithName("left").GetValueAsSigned()
    right = value.GetChildMemberWithName("right").GetValueAsSigned()
    width = right - left
    height = top - bottom
    return "(width = {0}, height = {1})".format(width, height)

def __lldb_init_module(debugger, internal_dict):
    debugger.HandleCommand("type summary add -F " + __name__ + ".MyRectSummary MyModule.MyRect -w swift")
```

Load this code by adding a line, `command script import /path/to/MyRectScript.py`, to your `~/.lldbinit` and restart Xcode. Now try to debug the following code:

```swift
let myRect = MyRect(top: 150.0, bottom: 145.0, left: 10.0, right: 190.5)
```

Running `fr v myRect` now prints the following summary with the rect’s width and height:

```sh
(lldb) fr v myRect
(MyModule.MyRect) myRect = (width = 180, height = 5)
```

Note that, for displaying local variables, `frame variable myVar` (abbreviated `fr v myVar`) can be more efficient than `po myVar`. The reason is that the `print object` command in LLDB has to run code to parse an expression. `frame variable`, on the other hand, doesn’t run any code; it only needs to read the portions of stack memory where the variable is allocated.

### Synthetic Children Providers

Synthetic children providers generate a set of child elements for a particular data structure. For example, if you inspect the contents of an array in Xcode, you can see a simple list of elements that are inside the array, as shown below.

![ArrayExample](/images/blog/2018/how-to-extend-lldb-to-provide-a-better-debugging-experience/XcodeDisplayingArray.png)

However, arrays are organized internally in a completely different way. Xcode abstracts the internal representation of arrays and shows you this simple tree visualization because it is using an LLDB synthetic children provider under the hood (for performance reasons, it is not implemented in Python, but rather directly in C++). You can read the sources [in the official Swift-lldb GitHub repository](https://github.com/apple/swift-lldb/tree/stable/source/Plugins/Language/Swift).

To create a synthetic children provider, all you need to do is write a Python class that conforms to this interface:

```python
class MySyntheticChildrenProvider:
    def __init__(self, valobj, internal_dict):
        # Initialize the Python object using valobj as the variable to provide synthetic children.
    def num_children(self):
        # Return the number of children you want your object to have.
    def get_child_index(self,name):
        # Return the index of the synthetic child whose name is given as argument.
    def get_child_at_index(self,index):
        # Return a new LLDB SBValue object representing the child at the index given as argument.
    def update(self):
        # Update the internal state of this Python object whenever the state of the variables in LLDB changes.
    def has_children(self):
        # Return True if this object might have children and False if this object can be guaranteed to not have children.
    def get_value(self):
        # Return an SBValue to be presented as the value of the synthetic value under consideration.
```

To load this particular synthetic children provider class into LLDB, you need to add the following code to your `.lldbinit` file:

```python
command script import ~/MyModule.py
type synthetic add Foo --python-class MyModule.MySyntheticChildrenProvider
```

One of the simplest examples of how to create a synthetic children provider is in the [LLDB examples repository](https://llvm.org/svn/llvm-project/lldb/trunk/examples/synthetic/bitfield/).

I recommend taking a look at the official [LLDB Python API][] reference for the complete list of modules and classes. Unfortunately, for some parts of the API, the documentation is not very complete, so you’ll need to experiment a lot or read test cases from LLDB’s code repository.

# Advanced Logging in LLDB

LLDB also has a powerful logging functionality, where there are several channels that can be enabled or disabled depending on the category of events you are interested in. This can be useful if you’re developing your own extension or if you simply need more information about an existing one. Run the following LLDB command to see a list of all channels:

```sh
(lldb)log list
```

# Conclusion

I’ve only just touched upon the surface of possibilities of extending LLDB, and there are many more things you can do with it. At PSPDFKit, we have created scripts to improve the visualization of our common data structures, place breakpoints automatically, render PDF pages while debugging, and much more.

[LLDB Python API]: https://lldb.llvm.org/python_reference/index.html
