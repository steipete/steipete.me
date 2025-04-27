---
title: "Android Studio Shortcuts: How to Boost Your Productivity"
description: "The best shortcuts for Android Studio. The most famous and the most underrated."
preview_image: /images/blog/2018/android-studio-shortcuts/article-header.png
section: blog
author:
  - Simone Arpe
author_url:
  - https://twitter.com/simonarpe
date: 2018-01-31 12:00 UTC
tags: Android, Development, Android Studio, Productivity, Tips
published: true
---

Using the proper shortcuts when programming and refactoring can not only make a difference in terms of time, but also drastically increase your productivity. [IntelliJ IDEA](https://www.jetbrains.com/idea/) is a great IDE (bye bye Eclipse) and offers a set of shortcuts that help streamline debugging and development operations. [Android Studio](https://developer.android.com/studio/index.html) is the official IDE for Android and is based on IntelliJ IDEA.

## The Most Famous

Let’s start with some of the most well-known and regularly used shortcuts for some common operations in Android Studio. I expect every Android developer uses these on a daily basis, so I won’t go into too much detail.

The following shortcuts are set by default on Mac using the keymap option `Mac OS X 10.5+`. The keymap option can be changed in `Android` → `Preferences` → `Keymap`. You can also hit `SHIFT` twice and type `keymap` to change the option (I’ll talk more about this later).

<put pic of the keymap option>

Reformat code → `CMD` + `ALT` + `L`  
Optimize imports → `CTRL` + `ALT` + `O`  
Rename → `SHIFT` + `F6`  
Find usages → `ALT` + `F7`  
Find in path → `CMD` + `SHIFT` + `F`  
Run → `CTRL` + `R`  

## The Most Underrated

Let’s continue with something more interesting.  

### Selection Tool

Android Studio (so IntelliJ) has a very smart selection tool. It can be activated pressing `ALT` + `UP`, and the selection tool will automatically select the whole statement/expression/line you’re looking at.  

If the selection needs to be expanded, just press `ALT` + `UP` again until the desired selection is reached. Did you select too much? Don’t worry; pressing `ALT` + `DOWN` will revert the selection tool to the previous state.

<Insert demo video>

### Bookmarks and Favorites

For large projects, bookmarks and favorites are a lifesaver, as they offer the ability to mark specific classes or specific lines of code and easily access them later.

By default, bookmarks and favorites are located in the favorites menu in the tool buttons on the left.

The `Favorites` menu can also be accessed via shortcut by using `CMD` + `2`.

### Favorites

To add a class to the favorites, use `ALT` + `SHIFT` + `F`.
To add a class to a new favorites list, use `ALT` + `SHIFT` + `F`, and then `2`, and a pop-up will ask for the new list name.

### Bookmarks

To bookmark a specific line of code, use `F3`. There’s no limit to the number of bookmarks that can be added.

Using `CMD` + `F3` will open another view showing all the bookmarks available on the left and the ability to navigate the code on the right.

<picture of the bookmark view>

If a bookmark needs some notes, a small description can be added by pressing `CMD` + `RETURN`.

#### Mnemonic Bookmarks

Mnemonic bookmarks are like ordinary bookmarks, but they allow for even quicker access.

To set a mnemonic bookmark, simply go to the line of code you want to bookmark and press `ALT` + `F3`. A small window showing the available quick access keys will pop up. Once the quick access key has been chosen (e.g. `1`), it’s easy to navigate to that bookmark by using `CTRL` + key (e.g. `CTRL` + `1`).

<put short video demo>

### Surround With

An invaluable shortcut during refactor operations is `ALT` + `CMD` + `T`. It will surround the selected text with something, e.g. `try/catch`, an `if` statement, or simple brackets. A small menu will then present some options to choose from, and they can be clicked or selected via keyboard.

For instance, to surround a piece of text with curly braces, select the text and press `ALT` + `CMD` + `T`, followed by `A`.

If the text needs to be surrounded with something more complex, a live template can always be set.

<short demo video>


## Key Promoter Plugin

For those who decide to carry on with the rocky road of mastering Android Studio shortcuts, [Key Promoter](https://plugins.jetbrains.com/plugin/4455-key-promoter) is a plugin that will “help” you learn a shortcut every time an operation has been selected using the mouse.  

The plugin does this by displaying big pop-ups showing the missed shortcut and the number of times the operation has been called without using the keyboard shortcut.
On the tool buttons on the right, Key Promoter offers a small menu that will show the number of missed shortcuts in order of importance.

<put picture>

## The Hidden Power of Double Shift

Another way to learn a shortcut is by searching for it. Hitting `SHIFT` twice will open the general search bar, which can be used to look up classes, files, symbols, and any other action with a shortcut.

<demo video>

General search can be also used to navigate the tool windows of Android Studio. For instance, to open Layout Inspector, simply hit `SHIFT` twice and type `layout inspector`.

<demo video>

## Conclusion

Learning to navigate an environment and its shortcuts is never easy, but hopefully this primer on Android Studio shortcuts is a good starting point that will lead to increased productivity.

<put funny gif of productive developer>

For a comprehensive list of shortcuts, JetBrains has a PDF available for download [here](https://resources.jetbrains.com/storage/products/intellij-idea/docs/IntelliJIDEA_ReferenceCard.pdf).
