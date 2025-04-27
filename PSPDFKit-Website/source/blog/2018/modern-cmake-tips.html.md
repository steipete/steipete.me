---
title: "Modern CMake Tips"
description: "There are better ways to write CMake scripts."
preview_image: /images/blog/2018/modern-cmake-tips/article-header.png
section: blog
author:
 - Nick Winder
author_url:
  - http://www.nickwinder.com
date: 2018-08-07 12:00 UTC
tags: Development
published: true
---

CMake is used in a vast majority of projects nowadays, and regardless of whether you love it or hate it, your goal should be to write the best CMake possible. Unfortunately, CMake tends to suffer from a bit of a legacy issue, and as a result, many references on the web will work, but are both prone to errors and a bit more verbose than they need to be.

That said, this article will provide an overview of some of the points to keep in mind when using CMake to help you avoid errors, reduce CMake scripts, and create a maintainable solution.

## Always Use `target_*`

In many examples on the web, you will see scripts like the following:

	cmake_minimum_required(VERSION 2.8)
	project(MyProject)

	include_directories(includes)
	set(SRC main.cpp)
	add_definitions(-DSYSTEM_LINUX)

	set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS}  -Wall")

	add_subdirectory(lib)

	add_executable(myProject ${SRC})

	link_libraries(myProject lib)

This will work perfectly fine, but that doesn’t mean this solution is the best. Additionally, something like this has a lot of potential for errors.

Moving forward, it’s advisable to use `target_*` commands, which allow you to specify the target the command is applied to, like so:

	target_compile_definitions
	target_compile_features
	target_compile_options
	target_include_directories
	target_link_libraries
	target_sources

In the following sections, I’ll discuss why we should be using targets.

### Leaking Issues

In this sample, we’re going to focus on `include_directories`. We have defined `includes` as an include directory for the `myProject` executable, which is the desired outcome. However, as `add_subdirectory` precedes the `include_directories` command, the `includes` directory will also be included in any libraries or executables defined in the lib. This is due to the inherited nature of `include_directories`. Executables in `lib` may then use the wrong include files, which can cause multiple compilation issues.

To mitigate the leaking issue, we could simply move `include_directories` below `add_subdirectory`, but this is not a very robust solution. Instead, here is where `target_include_directories` should be used. With this command, we target the specific executable or library the command refers to:

	...
		target_include_directories(myProject "includes")
		add_executable(myProject ${SRC})
	...

Regardless of where `target_include_directories` is defined, it will always target `myProject` and not leak these included files anywhere else.

This leaking situation is also true of `add_definitions`, `add_compile_options`, variables, and much more, so the hard and fast rule is to always default to using the `target_*` command. To illustrate this, here is an amended sample CMake file:

	cmake_minimum_required(VERSION 3.1)
	project(myProject)

	add_subdirectory(lib)

	add_executable(${CMAKE_PROJECT_NAME} main.cpp)

	target_include_directories(myProject  "includes")
	target_compile_definitions(myProject  SYSTEM_LINUX)
	target_compile_options(myProject "-Wall")
	target_link_libraries(myProject lib)

### Transitivity of Targets

The transitivity of targets refers to the inheritance of generation commands from the parent CMake file. For this, we need to look at `lib` directory. The CMake for this may be defined as follows:

	cmake_minimum_required(VERSION 2.8)
	project(lib)

	include_directories(includes)
	set(SRC lib.cpp)

	set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS}  -Wall")

	add_library(lib ${SRC})

	link_libraries(lib someOtherLibrary)

Again, this will work fine, but there are some advantages to using target commands.

For example, target commands are transitive, and any libraries, definitions, includes, options, and features are passed on to the importing project. This means that less maintenance is required, so if a new library is included in a dependency, it will automatically be added to all projects importing from said library.

In the sample above, we have to ensure that when we link against `lib`, we also link against `someOtherLibrary`, as this is a dependency of `lib`. We can get around this extra piece of information by using the transitive nature of `target_link_libraries`:

	...
		add_library(lib ${SRC})
		target_link_libraries(lib PUBLIC someOtherLibrary)
	...

Doing the above informs CMake that any project that links against `lib` should also link against `someOtherLibrary`. It is also possible to use the `PRIVATE` keyword to tell CMake that the library is only used within the context of the current project, so that it will inform the dependent target to link against `someOtherLibrary`. Finally, there is `INTERFACE`. This keyword lets CMake know that the current project is not required to link against the library, but that dependents should link against it.

Before, if we wanted to link against `lib`, the following would be defined:

	...
		add_executable(myProject ${SRC})
		link_libraries(myProject lib someOtherLibrary)
	...

Now, we can just define this:

	...
		add_executable(myProject ${SRC})
		link_libraries(myProject lib)
	...

All in all, target commands can be a very useful tool for mandating that certain features or definitions are kept when linked against a library.

## Use Generator Expressions

Generator expressions are inline conditionals that are determined at the last possible instance of the CMake procedure. This is important, as some decisions cannot be made at the initial configuration time, which can lead to unexpected results.

### IDE Support

One main advantage of using generator expressions is the correct generation of projects targeted at certain IDEs. As IDEs are usually in control of specific parameters, such as build types and build flavors, all these possibilities have to be accounted for when generating.

A great example of this is the `CMAKE_BUILD_TYPE` variable. Normally when producing Makefiles, we would set this on the command line, which means it is defined ahead of the configuration stage. Therefore, conditionals like the following would work absolutely fine:

	if(CMAKE_BUILD_TYPE MATCHES DEBUG)
		target_compile_definition(myProject PUBLIC DEFINE_ME=1)
	endif()

But in a situation that entails generating a project for an IDE, we do not know the build type, as the IDE will select this at a later date (normally in a local menu). Therefore, this CMake is flawed and is not portable. This is where generator expressions are needed. We can reinterpret the code block above into the following and still support more than one build type for all IDEs:

	target_compile_definition(myProject PUBLIC  $<$<CONFIG:DEBUG>:DEFINE_ME=1>)

This will now only define `DEFINE_ME` when the `DEBUG` build type is selected in the IDE.

### Less Verbose

Using generator expressions can also minimize the usage of variables and unnecessarily long conditionals, resulting in ease of reading. But you should be selective in choosing when to use expressions, as they can quickly grow to be large and unreadable. There are many expressions for creating optional compiler flags for certain languages, such as checking the system name. Many more can be found in the [CMake Documentation][].

The following example shows three lines:

	if (${CMAKE_SYSTEM_NAME} STREQUAL "Linux")
		target_compile_definitions(myProject PRIVATE LINUX=1)
	endif()

These lines can be reduced to one line and can also be declared inline with other compiler definitions:

	target_compile_definitions(myProject PRIVATE $<$<CMAKE_SYSTEM_NAME:LINUX>:LINUX=1>)

This is very useful when condensing all given options into a single list for `target_compile_definitions`, and it results in a single location where `target_compile_definitions` are defined, making the CMake easier to read. This also becomes helpful when defining custom source files for each supported platform.

## Minimize the Use of Variables

The option to use variables in CMake comes in handy, as it allows us to pass around information in a largely simplified fashion. But there are downfalls when using variables. Variables are not and cannot be made immutable in CMake, so it’s easy to see how their use can produce issues — especially when paired with the leaking issues covered earlier in this article. This is not where it stops; CMake will not throw any errors or warnings when used variables are not defined:

	add_executable(myProject ${SRC})

If `SRC` is not defined, CMake won’t complain; it will just create a executable without any source. This could cause huge headaches when trying to track down bugs. Using a similar example, if you misspell the variable name, it will not error; it will simply replace the variable with an empty string.

The last issue to be aware of is that if a variable is used, we forgo our possibility of checking if the types we are passing to the command are correct. For example, if we pass `SRC` to `add_executable` as per our last example, we will not know whether or not the given source is present until compilation time. But if this were to be repurposed to not use a variable, we would get an error at configuration time when CMake attempts to find the file in the given location. When using this in a big project, the time benefits can be huge:

	add_executable(myProject main.cpp)

## Conclusion

This blog post has discussed some of the potential issues and fixes that can be applied with modern CMake. It will be hugely beneficial to incorporate these simple tips into your CMake files as soon as possible. These changes may also open up the possibility of new platforms and tools that aren’t being used in your current project, resulting in increased flexibility. It will also guard against regressions when multiple people are working within the same project with multiple edits of the same CMake files.

[CMake Documentation]: https://cmake.org/cmake/help/v3.3/manual/cmake-generator-expressions.7.html
