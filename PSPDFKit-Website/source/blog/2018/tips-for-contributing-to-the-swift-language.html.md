---
title: "Tips and Tricks for Contributing to the Swift Language"
description: "This post describes the process for contributing code to the Swift programming language, including how to propose changes to the language, write a pull request, address feedback, and make your code part of the next version of the language."
preview_image: /images/blog/2018/tips-for-contributing-to-the-swift-language/article-header.png
section: blog
author:
  - Daniel Martín
author_url:
  - https://twitter.com/dmartincy
date: 2018-11-28 8:00 UTC
tags: Development, Swift, iOS, C++
published: true
secret: false
---

At PSPDFKit we use many different programming languages for the development of our [iOS, Android, Web, and Windows SDKs][pspdfkit sdks]. One of those languages is Swift, a general-purpose language introduced by Apple in 2014. Although we still cannot use Swift in our iOS SDK because of [lack of ABI stability][] (at least, [until Swift 5][swift 5]), we use it extensively in [PDF Viewer for iOS][], in all our sample projects, and in unit tests.

As Swift syntax can change between versions, developers may want their code to work with multiple versions of the language. A feature called conditional compilation, shown in the following example, helps with this:

```swift
#if swift(>=2.2)
   print("This is printed in Swift versions greater than or equal to 2.2.")
#else
   This branch is not even compiled in versions less than 2.2!!
#endif
```

However, up until now, you could only use the greater than or equal to operator, which means the following code was not valid:

```swift
#if swift(<2.2)
   print("This is printed in Swift versions less than 2.2.")
#else
   This branch is not even compiled in versions greater than or equal to 2.2!!
#endif
```

We wanted to change that, so in one of our Experimental Fridays, which are days when our employees explore new ideas, [we proposed an implementation for this change in the programming language][swift contribution]. Continue reading for more information about how to do this yourself.

## How to Propose a Change to the Swift Programming Language

The first step in the process of proposing a change to Swift always involves pitching your idea [in the Swift forums][swift forums]. In these forums, members of the Swift core team, along with the rest of the community, will give you feedback on your idea and help you assess if it could fit into the language. After you gauge the interest in your idea, you can proceed by formalizing your pitch in the form of a full proposal.

Swift proposals are managed in their own separate repository, [swift-evolution][]. There is a proposal template for changes in Swift, and it contains all the important parts that should not be missed during review: explaining the motivation for the change, including a detailed design, compatibility with previous versions of the language, and the effect on ABI stability (if applicable). For complex changes, I recommend you spend your time writing a well-thought-out proposal, as it will increase your chances that the change will be accepted.

## Start Writing the Code

The Swift programming language uses GitHub to manage all the code contributions. First, fork Apple’s Swift repository to your own GitHub account. Once you’ve done that, I recommend setting two different git remotes — `origin`, which points to your fork of the repository; and `upstream`, which points to Apple’s repository — like this:

```sh
git remote add origin git@github.com:danielmartin/swift.git
git remote add upstream git@github.com:apple/swift.git
```

### Download the Repository

Now you can clone a local copy of the repository:

```sh
git clone origin master
```

*Note*: It’s very important that you have at least 10 GB of free disk space for both the source code and the binary files that will be created after compilation.

### Configure the Development Environment

If you use a Mac, you need to install the latest beta version of Xcode, which will include most of the development tools you’ll need to compile the project. Along with Xcode, you’ll also need [CMake][], a tool to generate build system files, and [Ninja][], a fast build system. You can install both of these from Homebrew:

```sh
brew install cmake ninja
```

Once you have downloaded the source code to your local machine, I recommend doing a full build to check that everything works as expected. In order to not spend excessive time compiling, if you are planning to contribute to the Swift language itself (and not the standard library, for example), you can compile Swift without optimizations and the rest of the codebase with optimizations and debug information (to facilitate debugging). You can do that by running the following command:

```sh
./utils/build-script --release-debuginfo --debug-swift
```

Wait until the project is compiled (it may take a few hours, depending on your machine), and you’ll have Swift compiled at `build/Ninja-RelWithDebInfoAssert+swift-DebugAssert/swift-macosx-x86_64`. Inside the `bin` directory, you can find the Swift compiler itself, along with some interesting tools — like `swift-ide-test` or `swift-refactor` — that are not part of an official toolchain. Most of these binaries are used by integration tests to test some parts of the codebase.

### Test-Driven Development Workflow

The first thing you’ll need to decide at this point is which tool you want to use to write the code. You can use a plain text editor or an IDE, which in the case of a Mac environment, will typically be Xcode. Here are some important things to consider:

- A simple text editor can be faster than an IDE. Or maybe you have already invested a lot of time learning how to use your favorite text editor and you don’t want to start learning another tool from scratch.
- An IDE offers out-of-the-box autocompletion and code navigation. However, you can get the same features in a simple text editor, as we’ll see next.

#### Develop with Xcode

You can generate an Xcode project to work on the Swift project by appending the `--xcode` flag to the `build-script` command, like so:

```sh
./utils/build-script --release-debuginfo --debug-swift --xcode
```

This will generate a typical Xcode project that you can use to write code easily.

#### Develop with a Plain Editor

I personally use [Emacs][] to develop for the Swift open source project. The project is already configured with some basic settings for Emacs users (see the `.dir-locals.el` file in the root of the repository), but I usually complement those with some key shortcuts to compile the project and run the tests.

If you want, you can add IDE-like capabilities to your text editor. I use [ccls][], an
open source project based on Microsoft’s LSP protocol, and it works very well for large C/C++ and Objective-C projects. After configuring ccls and waiting for it to index the codebase, you will have autocompletion, go to declaration/definition, and other things — such as showing the inheritance chain of a particular class — that are not provided by many IDEs yet. Instead of a language server like ccls, you could also use an application external to the text editor, such as [Sourcetrail][].

#### Run tests

If you want to contribute a small change or bug fix to Swift, it may be a good idea to start with a test case that reproduces the issue or the feature you plan to develop. Many of the tests in the Swift project are integration tests where there is a `.swift` file that gets compiled and has some assertions inline. For example, for our change in the conditional compilation syntax, [we added the following test case][conditional compilation syntax change] to `test/Parse/ConditionalCompilation/language_version.swift` (for brevity’s sake, only a snippet is shown below):

```swift
// RUN: %target-typecheck-verify-swift

#if swift(<1.0)
   // This shouldn't emit any diagnostics.
   asdf asdf asdf asdf
#endif
```

This tests that the `<` operator is parsed correctly and does what we expect, which is to not generate any compiler diagnostics. To run tests, we can use the `lit.py` tool like this:

```sh
<Path_to_Swift>/llvm/utils/lit/lit.py -sv --param swift_site_config=<Path_to_Swift>/build/Ninja-RelWithDebInfoAssert+swift-DebugAssert/swift-macosx-x86_64/test-macosx-x86_64/lit.site.cfg <Path_to_Swift>/swift/test/Parse/
```

This will only run the test cases inside the `test/Parse` directory. You’ll see that the test case you’ve just added in `language_version.swift` fails. I recommend creating a shell alias or text editor shortcut for this command, as it’s very long.

After you modify the source code to make this test pass, you don’t need to run `/utils/build-script` again; it’s quicker to just use Ninja to recompile the swift target:

```sh
cd <Path_to_Swift>/build/Ninja-RelWithDebInfoAssert+swift-DebugAssert/swift-macosx-x86_64
ninja swift
```

After that, run the lit tests again to check if they now pass.

## Open an Implementation PR and a Proposal PR and Manage Feedback

Once you have the code implemented and tests pass, congratulations! You can now open an implementation pull request against the Swift repository and a proposal pull request against the swift-evolution repository. Your swift-evolution proposal will eventually be assigned a review manager, who will be a person from the Swift team. The discussion will then move to the Swift forums again, where the review manager will create a forum thread and guide the discussion to decide whether or not your proposal is accepted. If the proposal is accepted, your implementation pull request will be reviewed. Chances are that if this is your first contribution to Swift, you will receive a lot of feedback. Don’t let all the comments overwhelm you — you’ll get better as you learn more about the code style and general architecture of the codebase. I recommend running [git clang-format][] against your patch to ensure that only the lines you have modified are formatted according to the LLVM’s C++ style, which is the style that is also used in the Swift open source project. This is useful because you don’t want to make the review more difficult by including unrelated formatting changes for parts of the code that you didn’t edit in your pull request.

## Conclusion

At PSPDFKit we embrace open source, and we always try to contribute to the projects we use to make them even better. In this article, I have shared some tips and tricks on how to contribute to a large open source project, the Swift programming language. This information is based on my experience contributing a small language change on one of my Experimental Fridays at PSPDFKit.

Contributing code to a large open source project can be overwhelming for newcomers. If you are new to the Swift codebase, I recommend you approach the tasks labeled as [Starter Bugs in Jira][]. They are usually bugs or small tasks that are easy enough to be addressed by people not very familiar with the project. But don’t get discouraged if you are stuck. Feel free to ask questions in the forums, and the community will help you right away in contributing to your favorite programming language.

## Do You Want to Learn More?

If you want to learn more about how to contribute to Swift, take a look at the [Swift.org project website][], [the project’s internal documentation][swift internal documentation], or
this [blog post][getting started with swift development] by Brian Gesiak.

[pspdfkit sdks]: https://pspdfkit.com/pdf-sdk/
[lack of abi stability]: https://pspdfkit.com/blog/2018/binary-frameworks-swift/
[swift 5]: https://swift.org/abi-stability
[pdf viewer for ios]: https://pdfviewer.io
[swift contribution]: https://github.com/apple/swift/pull/17960
[swift forums]: https://forums.swift.org/c/evolution/pitches
[swift-evolution]: https://github.com/apple/swift-evolution
[cmake]: https://cmake.org
[ninja]: https://ninja-build.org
[emacs]: https://www.gnu.org/software/emacs/
[ccls]: https://github.com/MaskRay/ccls
[sourcetrail]: https://www.sourcetrail.com
[conditional compilation syntax change]: https://github.com/apple/swift/blob/e66095b10a8caa8ab568efc36223835120a1f7fc/test/Parse/ConditionalCompilation/language_version.swift
[git clang-format]: https://llvm.org/svn/llvm-project/cfe/trunk/tools/clang-format/git-clang-format
[starter bugs in jira]: https://bugs.swift.org/browse/SR-8908?jql=labels%20%3D%20StarterBug
[swift.org project website]: https://swift.org
[swift internal documentation]: https://github.com/apple/swift/tree/master/docs
[getting started with swift development]: https://modocache.io/getting-started-with-swift-development
