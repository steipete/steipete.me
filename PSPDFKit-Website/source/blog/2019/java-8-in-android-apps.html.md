---
title: "Java 8 in Android Apps"
description: "This article explains how to enable Java 8 features in an Android app and gives an overview of the available Java 8 features."
preview_image: /images/blog/2019/java-8-in-android-apps/article-header.png
section: blog
author:
  - Tomas Surin
author_url:
  - https://twitter.com/tomassurin
date: 2019-04-03 8:00 UTC
tags: Android, Development, Java 8
published: true
secret: false
---

Android Studio 3.0 introduced support for a subset of Java 8 language features and APIs for Android apps. This article gives an overview of the available Java 8 language features and describes how to enable them in your Android apps. READMORE

## How It Works

Java 8 has been supported natively since Android SDK 26. If you wish to use Java 8 language features and your minimal SDK version is lower than 26, `.class` files produced by the `javac` compiler need to be converted to bytecode that is supported by these SDK versions. This conversion process is called desugaring. Desugaring must be enabled for all [modules][] that use Java 8. Moreover, it must be enabled even when some of a module’s transitive dependencies use Java 8.

Desugaring does not support all Java 8 features on all Android versions. Generally speaking, new language features — such as lambda expressions and method references — are available on all SDK versions, whereas the new Java 8 APIs — such as [Streams][] — are available only on Android versions that support them natively.

## Enabling Java 8

Java 8 has been supported since Android Studio 3.0 and Android Gradle plugin version 3.0.0. To enable Java 8 in your apps, you’ll need to update your Android Studio and Android Gradle plugin to meet these minimal version requirements:

```build.gradle
buildscript {
    repositories {
        google()
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.3.0'
    }
}
```

Then update the Source and Target Compatibility to 1.8 for each module that will use Java 8:

```build.gradle
android {
  ...
  compileOptions {
    sourceCompatibility JavaVersion.VERSION_1_8
    targetCompatibility JavaVersion.VERSION_1_8
  }
}
```

**ℹ️ Note:** You’ll need to enable Java 8 even for modules where Java 8 is used only by the modules’ transitive dependencies. Otherwise, when compiling their code, you’ll get exceptions similar to what’s shown below.

```
D8: Invoke-customs are only supported starting with Android O (--min-api 26)
Caused by: com.android.builder.dexing.DexArchiveBuilderException: Error while dexing.
The dependency contains Java 8 bytecode. Please enable desugaring by adding the following to build.gradle
android {
    compileOptions {
        sourceCompatibility 1.8
        targetCompatibility 1.8
    }
}
See https://developer.android.com/studio/write/java8-support.html for details. Alternatively, increase the minSdkVersion to 26 or above.
```

### Migrating from Other Toolchains

If you are currently using another toolchain — such as [Retrolambda][] — that supports some of the Java 8 features, Gradle and Android Studio will fall back to Java 8 support provided by these tools. Additionally, if you are using the Jack toolchain that already has support for most Java 8 features, you should [migrate][migrate to java 8] to the default toolchain because Jack has been deprecated and will no longer be updated.

## Lambda Expressions

One of the most useful Java 8 language features is that of [lambda expressions][]. When you look at typical Java code, you’ll immediately notice a number of anonymous classes that implement interfaces containing only a single method. The syntax for these classes is just boilerplate that does not provide any additional information for the reader. Button click listeners are a good example of this:

```java
button.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View view) {
        // Handle button clicks.
        ...
    }
});
```

Lambda expressions let you replace these anonymous classes in a more compact and readable manner:

```java
button.setOnClickListener(view -> {
    // Handle button clicks.
    ...
});
```

Lambda expressions are also a great way to improve the readability of code that uses higher-order functions such as `map` or `filter`:

```java
// You can define functions with lambdas and pass them as parameters to higher-order functions.
Predicate<Integer> isPositive = value -> value > 0;
Function<Integer, Integer> square = value -> value * value;

Single<List<Integer>> listSingle = observable
        .filter(isPositive)
        .map(square)
        // Continue with the RxJava chain.
        ...
```

Android Studio provides handy inspections for converting existing anonymous classes to lambdas. Simply press Alt + Enter inside an anonymous class declaration and choose Replace with lambda, as shown below.

![Replace with lambda](/images/blog/2019/java-8-in-android-apps/replace-with-lambda-inspection.png)

### Syntax

A lambda expression starts with a comma-separated list of parameters enclosed in parentheses. If there is only one parameter, parentheses are not required:

```java
// Parameters are enclosed in parentheses.
(parameter1, parameter2) -> {
    // Lambda body
}

// Parentheses can be omitted if there is only one parameter.
parameter -> {
    // Lambda body
}
```

Parameters are followed by the arrow token (`->`) and a body. The body of the lambda consists of a single expression or code block enclosed in curly braces. In case of a single expression, the Java runtime evaluates the expression and returns its value:

```java
// The body as a code block.
value -> {
    Log.d(LOG_TAG, "Filter usage for value %s", value);
    return value > 0;
}

// The body can also be written as a single expression.
p -> value > 0;
```

### Capturing Local Variables of the Enclosing Scope

Similar to anonymous classes, lambda expressions capture variables from the scope. However, only final or effectively final variables can be accessed:

```java
void function(int x) {
  Predicate<Integer> predicate = (value) -> {
      // The following statement would result in an error because the local
      // variable x referenced in lambda is no longer effectively final:
      //
      // x = 10;

      // Unlike with anonymous classes, it is not possible to shadow variables
      // from an enclosing scope in a lambda expression. For example, the following
      // also produces an error:
      //
      // int x = 10;

      return x > 0;
  }
}
```

## Method References

A lambda expression sometimes just calls an existing method. [Method references][], as their name suggests, enable you to reference these methods by name instead of by using lambdas.

Consider the following method:

```java
public class MathFilters {
  public static boolean isPositive(int x) {
      return x > 0;
  }
}
```

We can use this method in a lambda expression:

```java
observable.filter(value -> MathFilters.isPositive(value));
```

However, using the method reference is cleaner and more readable:

```java
observable.filter(MathFilters::isPositive);
```

## Default and Static Interface Methods

Since Java 8, interfaces can define [default implementations][default methods] for their methods, and they can even define static methods. The former is handy when introducing new methods to an existing interface without modifying any of the classes that implement this interface. The latter allows you to introduce helper methods into your interfaces instead of introducing separate classes.

For example, consider the following interface for custom loggers:

```java
public interface Logger {
    void log(int priority, String tag, String message, Throwable throwable);
}
```

We want to add a new method to filter logs before they are logged:

```java
public interface Logger {
    boolean isLogged(int priority, String tag);
    void log(int priority, String tag, String message, Throwable throwable);
}
```

However, this would mean that all classes that are already implementing this interface need to provide implementation of this method. We can solve this by providing the default implementation for the `isLogged()` method:

```java
public interface Logger {
    default boolean isLogged(int priority, String tag) {
        // Accept all logs by default.
        return true;
    }

    void log(int priority, String tag, String message, Throwable throwable);
}
```

Now let’s see an example of the static method in an interface. Consider the following helper class that provides static factory methods for various loggers:

```java
public class Loggers {
    public static Logger createLogCatLogger() {
        return new LogCatLogger();
    }
    ...
}
```

These methods can be moved to the `Logger` interface when using Java 8:

```java
public interface Logger {
    ...

    static Logger createLogCatLogger() {
        return new LogCatLogger();
    }
}
```

## Annotation Improvements

Java 8 also brings with it some improvements on the annotation front, namely that annotations can now be applied to [any type use][type annotations]:

```java
// Object creation.
new @Internal MyObject();

// Type casts.
nonNullString = (@NonNull String) str;

// Class implements clauses.
class ImmutableList<T> implements @Readonly List<@Readonly T> { ... }

// Throws declaration.
void function() throws @Critical Exception { ... }
```

Another nice addition is that it is now possible to use [multiple annotations][repeatable annotations] at the same time:

```java
@Author(name = "John Appleseed")
@Author(name = "John Doe")
class Foo { ... }
```

## New Java 8 Language APIs

The language features discussed earlier in this post are supported on all Android versions thanks to the desugaring process. Java 8 is not only about language features though; it also brings some new APIs to the table. However, these are not useful to most apps, as they require API level 24 or higher.

The new APIs mostly complement the new features. For example, the introduction of lambda expressions brought with it an API that allows functional-style operations ([streams][] and [functional interfaces][]). And annotation improvements and default interface methods introduced new reflection APIs for working with the language features.

## Conclusion

The support for Java 8 that was introduced in Android Studio 3.0 means a lot to developers like us here at PSPDFKit, as we can’t fully switch to Kotlin just yet. We introduced [Java 8][java8faq] to our codebase in version 5.0, just a few months ago, and we can already see how the new features (especially lambdas) improve our day-to-day coding experience and make the code easier to read and understand.

Since the Java 8 source compatibility is mandatory for all modules with dependencies that are using Java 8, now is the right time to consider enabling it in your codebase before you are forced to do so because some of your important dependencies start using Java 8.

[retrolambda]: https://github.com/luontola/retrolambda
[future of java 8]: https://android-developers.googleblog.com/2017/03/future-of-java-8-language-feature.html
[migrate to java 8]: https://developer.android.com/studio/write/java8-support#migrate
[modules]: https://developer.android.com/studio/projects/#ApplicationModules
[lambda expressions]: https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html
[method references]: https://docs.oracle.com/javase/tutorial/java/javaOO/methodreferences.html
[default methods]: https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html
[type annotations]: https://docs.oracle.com/javase/tutorial/java/annotations/type_annotations.html
[repeatable annotations]: https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html
[streams]: https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html
[functional interfaces]: https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html
[java8faq]: https://pspdfkit.com/guides/android/current/faq/java-8/
