---
title: "Using Clang-Tidy and Integrating It in Jenkins"
description: "The benefits of using clang-tidy and how to get started setting it up in Jenkins."
preview_image: /images/blog/2018/using-clang-tidy-and-integrating-it-in-jenkins/article-header.png
section: blog
author:
  - Patrik Weiskircher
author_url:
  - https://twitter.com/pweisk
date: 2018-10-24 8:00 UTC
tags: Development, Clag-Tidy, Jenkins
published: true
secret: false
---

We at PSPDFKit take code quality very seriously. And there’s nothing better than having someone automatically yell at you if your code might not be optimal. This is why we started looking into [clang-tidy][clang tidy link].

clang-tidy is a linter, which means it can go through your code and find style violations. And if that isn’t useful enough already, it also acts as a static analysis tool and can report easy-to-miss bugs. It comes with a [long list of checks][clang tidy checks link], and while we haven’t yet had the need to write our own checks, it should be [pretty easy to do][clang tidy write your own check].

We use most of the checks that clang-tidy offers to prevent easy mistakes from slipping through. We do have an extensive test suite, and no code gets merged without a proper code review, but having another automated tool looking out for us just makes sense.

## The Power of Clang-Tidy

As you can see in the link above, there are a whole lot of checks. I want to highlight a few to showcase the power of clang-tidy.

### [`bugprone-assert-side-effect`][bugprone-assert-side-effect]

[Heisenbugs][heisenbug]! This is one of the most annoying kinds of bugs. Everything works in a debug build, but as soon as you try the release build, things go awry. With this check, clang-tidy tries to detect if any statement in an assert could cause an unwanted side effect and then warns you about it.

### [`bugprone-inaccurate-erase`][bugprone-inaccurate-erase]

[`std::remove`][cpp-remove] and [`std::remove_if`][cpp-remove] can be very useful. But let’s be honest, how often did you forget to also call [`std::vector::erase`][vector-erase]? For me, the answer is: basically every time, until hopefully my unit tests yell at me for forgetting it once again. Using this check, there’s another safety net to make sure this wasn’t forgotten.

### [`performance-move-const-arg`][performance-move-const-arg]

[`std::move`][std-move] can be very useful for getting optimal performance. It’s also very easy to get wrong. The compiler doesn’t warn you if you call `std::move` but the object isn’t actually movable. You just _indicate_ to the compiler that it _may_ be moved. But this check warns you if you’re trying to move something that isn’t movable.

## Jenkins Integration

We looked for information on how other people are using clang-tidy in Jenkins, but we didn’t come up with a whole lot. However, this has never stopped us before! The first thing we needed to find out was how to run clang-tidy on our source files. We have a big codebase, and getting the compiler flags correct is not exactly trivial.

### Make It Run

clang-tidy supports [`compile_commands.json`][compile-commands-json] to configure its flags. This made it pretty easy for us to get the correct compile flags to clang-tidy, as [CMake][cmake] has out-of-the-box support for `compile_commands.json`. All we had to do was add `-DCMAKE_EXPORT_COMPILE_COMMANDS=1` to our CMake generation command and we were good to go!

### Make It Quick

clang-tidy isn’t very quick. It runs through many checks on each source file you want checked. As such, we had to come up with a solution to not slow our CI down too much. We decided there are two easy wins here:

- Only run it on files that were modified.

  ```bash
  # Find the merge base compared to master.
  base=$(git merge-base refs/remotes/origin/master HEAD)
  # Create an empty array that will contain all the filepaths of files modified.
  modified_filepaths=()

  # To properly handle file names with spaces, we have to do some bash magic.
  # We set the Internal Field Separator to nothing and read line by line.
  while IFS='' read -r line
  do
    # For each line of the git output, we call `realpath` to get the absolute path of the file.
    absolute_filepath=$(realpath "$line")

    # Append the absolute filepath.
    modified_filepaths+=("$absolute_filepath")

  # `git diff-tree` outputs all the files that differ between the different commits.
  # By specifying `--diff-filter=d`, it doesn't report deleted files.
  done < <(git diff-tree --no-commit-id --diff-filter=d --name-only -r "$base" HEAD)
  ```

  `$modified_filepaths` now contains a list of all the files modified in this PR.

- Use [GNU Parallel][gnu-parallel] to run it on multiple files at the same time.

  If things are slow, parallelize them! We found the easiest way to do this is simply by using `parallel`.

  ```bash
  # -m specifies that `parallel` should distribute the arguments evenly across the executing jobs.
  # -p Tells clang-tidy where to find the `compile_commands.json`.
  # `{}` specifies where `parallel` adds the command-line arguments.
  # `:::` separates the command `parallel` should execute from the arguments it should pass to the commands.
  # `| tee` specifies that we would like the output of clang-tidy to go to `stdout` and also to capture it in
  # `$build_dir/clang-tidy-output` for later processing.
  parallel -m clang-tidy -p $build_dir {} ::: "${modified_filepaths[@]}" | tee "$build_dir/clang-tidy-output"
  ```

We integrate all these things into a bash script that we call from Jenkins. It runs on all of our PRs that modify C++ code, and it usually only takes a minute or two to finish!

### Reporting the Results

All we have right now is the raw output. After searching around for a while, I couldn’t find any appropriate tool to report the results, so I figured I’d make one myself. All we have to do is parse the raw compiler warning output and make it into something Jenkins can understand. Simple, right?!

The easiest way to get some kind of useful output on Jenkins is to try to get a [JUnit XML][junit-xml] file. While JUnit files are typically used to report unit test results, with a bit of imagination we can use them for compiler warnings too. So off I went getting my trusty [`python`][python] and putting it to work.

The result is a script you can pipe clang-tidy output into, resulting in a JUnit XML file Jenkins can display. You can find it here: [clang-tidy-to-junit][clang-tidy-to-junit].

```bash
cat "$build_dir/clang-tidy-output" | ./clang-tidy-to-junit.py /srv/Jenkins/source-root-directory >"$build_dir/junit.xml"
```

After that, you only have to configure Jenkins to use the given JUnit file as a `Test Report XMLs` in a `Publish JUnit test result report` post-build action.

![Screenshot of Jenkins configuration](/images/blog/2018/using-clang-tidy-and-integrating-it-in-jenkins/jenkins-configuration.png)

## Example

Whenever clang-tidy finds an issue, we produce failures for Jenkins that look like this:

![Screenshot of how the error output looks](/images/blog/2018/using-clang-tidy-and-integrating-it-in-jenkins/jenkins-overview.png)

And even better, after you click on them, you get the entire error message and even the problematic code!

![](/images/blog/2018/using-clang-tidy-and-integrating-it-in-jenkins/inaccurate-erase-example.png)

## Conclusion

clang-tidy is a very good tool for making sure your code does what you intended it to do. Integrating it into Jenkins isn’t very difficult, and doing so gives you the peace of mind in knowing that your code is always as good as it can be!

[clang tidy link]: http://clang.llvm.org/extra/clang-tidy/
[clang tidy checks link]: https://clang.llvm.org/extra/clang-tidy/checks/list.html
[clang tidy write your own check]: http://clang.llvm.org/extra/clang-tidy/#writing-a-clang-tidy-check
[bugprone-assert-side-effect]: https://clang.llvm.org/extra/clang-tidy/checks/bugprone-assert-side-effect.html
[bugprone-inaccurate-erase]: https://clang.llvm.org/extra/clang-tidy/checks/bugprone-inaccurate-erase.html
[performance-move-const-arg]: https://clang.llvm.org/extra/clang-tidy/checks/performance-move-const-arg.html
[heisenbug]: https://en.wikipedia.org/wiki/Heisenbug
[cpp-remove]: https://en.cppreference.com/w/cpp/algorithm/remove
[vector-erase]: https://en.cppreference.com/w/cpp/container/vector/erase
[std-move]: https://en.cppreference.com/w/cpp/utility/move
[compile-commands-json]: https://clang.llvm.org/docs/JSONCompilationDatabase.html
[cmake]: https://cmake.org/
[gnu-parallel]: https://www.gnu.org/software/parallel/
[junit-xml]: https://www.ibm.com/support/knowledgecenter/en/SSQ2R2_9.1.1/com.ibm.rsar.analysis.codereview.cobol.doc/topics/cac_useresults_junit.html
[python]: http://python.org
[clang-tidy-to-junit]: https://github.com/PSPDFKit-labs/clang-tidy-to-junit
