---
title: Selective Pull Request Testing
section: blog

author: Julian Grosshauser
author_url: https://twitter.com/jgrosshauser
date: 2016-05-20 12:00 UTC
tags: Development, Testing, CI
published: true
---

PSPDFKit used to be an iOS-only framework and testing pull requests was easy. The Jenkins plugin [ghprb](https://wiki.jenkins-ci.org/display/JENKINS/GitHub+pull+request+builder+plugin) (short for “GitHub Pull Request Builder”) started the iOS testing jobs on every PR commit.
However, since then we’ve come a long way: We now offer an [Android version of PSPDFKit](https://pspdfkit.com/features/) and the core of our framework runs on a lot of other operating systems, for example Linux and Windows. We're also working on bringing our framework to the [web](https://pspdfkit.com/web/).
To increase code sharing we decided to move all of our code to a single [monorepo](https://developer.atlassian.com/blog/2015/10/monorepos-in-git/). Everything was great, except the time it took to run tests on a PR.

We had to run all our tests (Core, iOS & Android) with ghprb, no matter which files actually changed, because there wasn’t a way to filter jobs based on changed files.
Do a small change in the Android subdirectory and you would trigger all iOS and core tests. Same thing for the iOS subdirectory.
This really wasn’t an effective use of our Jenkins workers. This all changed when we found the [“Add support to restrict pull requests to defined paths”](https://github.com/jenkinsci/ghprb-plugin/pull/293) PR in the [ghprb repo](https://github.com/jenkinsci/ghprb-plugin).

## Features

[Timothy Lusk](https://github.com/tlusk)’s PR adds a way to filter jobs based on file paths - everything we wished for 🎉  
This feature adds two new text fields to ghprb’s configuration: “Included regions” and “Excluded regions”:

![File Regions](/images/blog/2016/selective-pull-request-testing/file-regions.png)

Both text fields should contain regular expressions, separated by newlines. A build will start only if a file is inside the included regions.
If only files from the excluded regions were committed a build won’t occur. Exclusions take precedence over inclusions, if there is an overlap between the regions.

Here’s how we’re using the text fields: Our iOS jobs are configured to be using `^android\/.+` as an excluded region. The included regions are left empty, which means everything is included.
This means we always trigger the iOS tests, except when only Android files have changed. As you can imagine our Android jobs are using `^iOS\/.+` as excluded region.
Having the excluded regions configured like this means we always trigger all tests when changing Core files (which reside in the `core` subdirectory), which is exactly what we want - Core changes could introduce bugs on iOS & Android and should be tested on both platforms.

A lot of other types of files can be excluded:

* README and other documentation changes shouldn’t trigger tests.
* Most examples don’t have tests so we can exclude them.
* Dotfile changes usually don’t need testing.

Say your project contains both Swift and Objective-C code. Now you want to use [`SwiftLint`](https://github.com/realm/SwiftLint) in a Jenkins job to enforce your Swift style guide.
Good idea, but running `SwiftLint` on every commit doesn't always make sense because it's possible that only Objective-C files have changed.
Included regions to the rescue! Adding `.+\.swift$` to the included regions of your `SwiftLint` job will ensure that it only runs if Swift files have changed.

## Build Instructions

Now that we know why file filters are a handy thing we just need to find out how to build the custom Jenkins plugin. It’s actually quite simple:

1. Make sure you have [`Maven`](https://maven.apache.org) installed. On OS X you can install it with [homebrew](http://brew.sh):  
`$ brew install maven`
2. Clone [`tlusk`](https://github.com/tlusk)’s [fork](https://github.com/tlusk/ghprb-plugin) of the ghprb plugin.
3. Check out the [`trigger-regions` branch](https://github.com/tlusk/ghprb-plugin/tree/trigger-regions).
4. Run `$ mvn package` inside the `ghprb-plugin` directory.
5. You will find the built plugin in `ghprb-plugin/target/ghprb.hpi`.

To install the built plugin go to your Jenkins homepage and click on `Manage Jenkins -> Manage Plugins -> Advanced tab`.
You will find an “Upload plugin” section where you can upload your `ghprb.hpi` file:

![Upload Plugin](/images/blog/2016/selective-pull-request-testing/upload-plugin.png)

After Jenkins has restarted you can configure your jobs to use included and excluded file regions.

## Thanks

A huge thank you from all of PSPDFKit to [Timothy Lusk](https://github.com/tlusk), whose work is the reason we can efficiently test our codebase again.
So far we only had positive feedback from our engineers. If you also think that his PR should be merged, please add a reaction or leave a comment here: [jenkinsci/ghprb-plugin#293](https://github.com/jenkinsci/ghprb-plugin/pull/293)
