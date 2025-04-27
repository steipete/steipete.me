---
title: "Linting and Code Formatting at PSPDFKit"
description: How we do code formatting in C++/Objective-C/Java/JavaScript
preview_image: /images/blog/2017/linting-and-code-formatting-at-pspdfkit/linting-and-code-formatting-at-pspdfkit.png
section: blog
author:
  - Daniel Martín
author_url:
  - https://twitter.com/dmartincy
date: 2017-05-31 12:00 UTC
tags: Development, C++, Objective-C, Java, JavaScript
published: true
---

At PSPDFKit, we work on a huge codebase written in many different languages, including C++, Objective-C, Java, JavaScript, Swift, and Kotlin. As we’ve been evolving our product for more than seven years, it is important that we regularly do a small amount of refactoring to keep it in the best possible condition so that new features can be added easily.

# Code Style Guides

Having a written code style guide for each language that your team uses is important. Consistency outweighs any writing choices or rules, and they need to go beyond stylistic matters, like restricting the usage of certain language features to avoid bugs and maintenance problems. In our case, we developed wiki pages internally for each language that document the rules with examples of things to do and things not to do.

The main problem with a code style guide is the actual execution. It’s not realistic that every team member memorizes the style guide to the letter. We think that, for certain rules, like those that involve code formatting, a computer works better than a human and almost never produces wrong code. Therefore, the task requires no user intervention and leaves pull requests to be the place to discuss code correctness, architecture and performance, and not where to put curly braces.

# How We Do Code Formatting in C++

There are several tools available that automatically format C++ source code according to a set of rules. When choosing a formatting tool, it needs to be independent of a particular C++ IDE or text editor for us. We use many IDEs at PSPDFKit, and the default indentation engine in Xcode was causing us some problems by indenting nested namespaces like this:

```cpp
namespace First {
    namespace Second {
        ...
    }
}
```

When we prefer this:

```cpp
namespace First {
namespace Second {
    ...
}
}
```

We found clang-format to be the best tool for our purposes. Clang-format is a tool that is part of the Clang project and that automatically formats C++/Objective-C and JavaScript source code. If you want to know how it works, we recommend [this talk by Daniel Jasper](https://www.youtube.com/watch?v=s7JmdCfI__c). You can install clang-format for macOS from Homebrew:

```sh
brew install clang-format
```

After that, add a `.clang-format` YAML file to the root of your project with the list of key-value pairs that represent the style you want to enforce. For example:

```yaml
Language: Cpp
AccessModifierOffset: -2
AlignAfterOpenBracket: Align
AlignConsecutiveAssignments: false
AlignConsecutiveDeclarations: false
AlignEscapedNewlinesLeft: true
AlignOperands: true
```

The full documentation of every style option is available [at the Clang website](https://clang.llvm.org/docs/ClangFormatStyleOptions.html). If your project has folders that you don’t want to format, add a `.clang-format` file with the following content: `BasedOnStyle: None`. We use this approach for our third party dependencies.

As the team set on a particular style file that produced results everybody agreed with the most, we had to decide how to begin using the tool. There were two options:

- Format only the newly written code
- Format the entire project, in one go

We decided to do the latter. As mentioned before, consistency is crucial when reading code. We didn’t want to be reading a lot of files with a _mixed_ code format in the future. To help ourselves in this Herculean task (our codebase is gigantic!) we created a script that formats our entire repository using several processes in parallel. Then, we agreed on a date to do the "big cleanup." We communicated with the rest of the company in advance, so as few pull requests as possible were left open to minimize potential conflicts.

# How We Use Clang-Format with Objective-C

Given the success of formatting our entire C++ codebase, we planned to do the same with our Objective-C and Objective-C++ code. When experimenting with clang-format we found out the results were not pretty in some situations, and in other scenarios the resulting code did not compile, at all. For example, we used some macros to mark the visibility of the classes inside our framework (similar to `__attribute__((visibility("default")))`):

```objc
PSPDF_CLASS_AVAILABLE @interface PSPDFSample : NSObject
@end
```

After formatting this, the macro was put in its own line. Fortunately, clang-format lets you ignore regions of code by adding `// clang-format off` to the beginning of the region and `// clang-format on` to the end. However, for our Objective-C code, this would imply a lot of ignoring and polluting the codebase.

We decided to fork clang-format and add some new styles: `MacroInterfaceAnnotation`, which supports a regular expression that defines the macro annotations in our codebase (and thus should not be in their own line), and `ObjCAvoidBreaksForInlineBlocks` which decides whether to put line breaks in Objective-C block parameters. Our fork is available at [PSPDFKit-labs repository](https://github.com/PSPDFKit-labs/clang/tree/pspdfkit/format-stable). We plan to prepare those patches and integrate them into the main Clang project so that the whole iOS community can benefit from them.

# Integration with Xcode

Clang-format can be used as a standalone tool or integrated into the IDE. For Xcode, there are many integrations available, such as [this one](https://github.com/mapbox/XcodeClangFormat) from Mapbox.

# Java and Kotlin

For Android development (Java and Kotlin), there’s standard and supported IDEs from Google, so we use the formatter provided by the Kotlin and Java IntelliJ plugins.

# *Prettier* JavaScript

PSPDFKit for Web is a modern JavaScript application built with ES2015+ React, Flow, Redux, and Immutable.js among other technologies. Because of its young age, the codebase is still quite clean and well organized and has been kept in good and consistent shape.

We strongly believe in tools that can lint and format our code as they help us focus on solving engineering problems and offering robust solutions to our customers, which is what we strive for the most. We use [ESLint](http://eslint.org/) and [Stylelint](https://stylelint.io/user-guide/configuration/) to lint our files, while [Prettier](https://prettier.io/) to live-format our code via editor plugins. All these have served us well so far.

# Conclusion

Code linting and formatting is usually a low-hanging fruit that can significantly benefit a software team by reducing the time spent on making sure the code looks homogeneous. It’s one of the main steps we take to ensure that our PSPDFKit codebase – a crucial component to many of our customers’ businesses – stays maintainable today and in many years to come.
