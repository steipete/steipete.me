---
title: "Visual Studio Code for C++"
description: "How to use Visual Studio Code for C++ development."
preview_image: /images/blog/2019/visual-studio-code-for-cpp/article-header.png
section: blog
author:
  - Patrik Weiskircher
author_url:
  - https://twitter.com/pweisk
date: 2019-01-16 8:00 UTC
tags: Development, Visual Studio Code, C++
published: true
secret: false
---

Many developers are on a neverending search for a better development environment. It makes sense: it’s the tool that helps you accomplish what you set out to do. When it’s slow, it slows you down. When it helps you accomplish a task quicker, well, you’re done quicker and can focus on other things!

I mostly do C++ development for our shared code here at PSPDFKit. I’ve been using Xcode, and lately I’ve also been looking into CLion. There’s a lot to like in both of them, but one Experimental Friday I wondered if I couldn’t make my default editor, Visual Studio Code, into a better C++ environment. And wouldn’t you know, it went pretty well!

READMORE

## Visual Studio Code

[Visual Studio Code][visual studio code link] is a pretty great source code editor. It runs using Electron, which might turn some people off, but I never found that a problem. It also seems to be very actively developed and has gained a big fanbase, especially in the web development world.

There are tons of extensions and guides on the internet about making Visual Studio Code work great for whatever you’re doing, but I couldn’t find a lot of information about using it for C++ development. So I rolled up my sleeves, took a deep breath, and started installing extensions like mad!

## Useful C++ Extensions

We use CMake as our build system for our C++ code. I figured the first thing I needed to do to get the ball rolling was to make use of that. When you type `cmake` in the Extensions search, quite a few things pop up, but after playing around a little bit I focused on two.

### [CMake Tools][]

`CMake Tools` allows you to configure and build a CMake project. It looks for a `CMakeLists.txt` in the directory you opened, and after calling `> CMake Configure`, it lets you select the target you want to build. It also offers helpful variable expansions so you can write a [launch.json][launch json description] that always starts the currently set CMake target. For example:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "lldb",
      "request": "launch",
      "name": "Debug CMake Target",
      "program": "${command:cmake.launchTargetPath}"
    }
  ]
}
```

The extension also makes sure the binary is built before it gets executed. I ran into [one problem][vscode problem], but the extension author helped me debug the problem and find a workaround. Basically, when I tried to launch the debug session, it told me that no executable target was found to launch. The workaround was to call `> CMake: Select a target to debug`, and after that, everything worked wonderfully.

![Selecting a target](/images/blog/2019/visual-studio-code-for-cpp/cmake-tools-select-target.png)

### [CMake][cmake extension]

This extension helps you write `CMakeLists.txt` files. It offers syntax highlighting and auto-completion support. I don’t think I ever had the convenience of my editor telling me how to write CMake commands, so I very much appreciated this!

![CMakeLists.txt auto-completion](/images/blog/2019/visual-studio-code-for-cpp/cmake-auto-completion.png)

These two CMake extensions allowed me to conveniently build my project, but I also wanted to edit and debug the code. For this, I made use of two other extensions.

### [CodeLLDB][]

I wanted to be able to use a debugger, because while `printf` is nice, it just doesn’t quite cut it anymore. 😉

You might have noticed that in the above `launch.json` snippet, I used `"type": "lldb"`. This referenced CodeLLDB, and it worked perfectly! I can now start a target that has been configured using the `CMakeTools` and simply use the `Visual Studio Code` debugger interface. I can set breakpoints in the source files and I can look at variables.

I honestly was quite astonished that this simply just worked.

![LLDB extensions hitting a breakpoint](/images/blog/2019/visual-studio-code-for-cpp/lldb.png)

### [cquery][cquery extension]

Next up: auto-completion support and inline syntax errors. While these aren’t strictly necessary, if you’re working on a big codebase and you’re used to this from other development environments, I couldn’t imagine working without them.

I tried using [Microsoft’s C/C++][microsoft c++] extension, which provides Intellisense, before, but I never had a good experience with it. It seemed slow, and I could never quite get it configured correctly. To be fair, it also still has the `Preview` tag.

One of my co-workers, [Daniel Martín][dmartin twitter], suggested looking into [cquery][cquery github] because one of its goals is to support big codebases. And it works great!

![cquery showing a syntax error](/images/blog/2019/visual-studio-code-for-cpp/cquery.png)

The only setup I had to do was to link the [`compile_commands.json`][compile commands] that the `CMakeTools` extensions automatically generated into the root directory of the project I was working on:

```bash
MySource $ ln -sf build/compile_commands.json compile_commands.json
```

I did run into the problem that the `cquery` shipped with [Homebrew][homebrew link] crashed on our codebase, but I simply cloned the `cquery` [GitHub repository][cquery github] and used the `cquery.launch.command` setting to direct the extension to use the new binary:

```json
"cquery.launch.command": "/Users/pat/Work/cquery/build/release/bin/cquery",
```

## Workspaces

At PSPDFKit, we decided a long time ago to go the monorepo route. This means we have multiple projects in our source code repository. The way most of these extensions work, they expect all the relevant files to be in the directory you open in Visual Studio Code. This caused a problem because my `CMakeLists.txt` was not in the root of the repository, but rather in a subfolder. But after playing around a bit with extensions settings, I discovered that Visual Studio Code supports workspaces!

This made things pretty easy. I simply added a `core.code-workspace` to the subfolder and then added folders for our shared resources:

```json
{
  "folders": [
    {
      "name": "Core",
      "path": "."
    },
    {
      "name": "Assets",
      "path": "../assets"
    }
  ]
}
```

When I open this workspace, the `CMake` and `cquery` extensions have their `CMakeLists.txt` at their preferred location, but I can still use the editor to access files outside of that directory.

Another nice thing about workspaces is that you can add extension recommendations, so our file also includes this little code block:

```json
  "extensions": {
    "recommendations": [
      "twxs.cmake",
      "vector-of-bool.cmake-tools",
      "vadimcn.vscode-lldb",
      "cquery-project.cquery"
    ]
  }
```

This makes it easy to share relevant extensions with your team members and get everyone working quickly!

## Conclusion

In the end, I’m quite happy with what can be achieved using Visual Studio Code. There are still a couple of features I miss (for example, being able to just start a [Google Test][gtest link] case without editing the `launch.json` file), but in the meantime, this is a very valid, useable alternative to other C++ environments.

[cmake tools]: https://marketplace.visualstudio.com/items?itemName=vector-of-bool.cmake-tools
[vscode problem]: https://github.com/vector-of-bool/vscode-cmake-tools/issues/461
[launch json description]: https://code.visualstudio.com/docs/editor/debugging#_launch-configurations
[cmake extension]: https://marketplace.visualstudio.com/items?itemName=twxs.cmake
[codelldb]: https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb
[cquery extension]: https://marketplace.visualstudio.com/items?itemName=cquery-project.cquery
[microsoft c++]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools
[dmartin twitter]: https://twitter.com/dmartincy
[cquery github]: https://github.com/cquery-project/cquery
[compile commands]: https://clang.llvm.org/docs/JSONCompilationDatabase.html
[homebrew link]: https://brew.sh/
[gtest link]: https://github.com/google/googletest
[visual studio code link]: https://code.visualstudio.com/
