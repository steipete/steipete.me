---
title: "Handling Nullability in Your Code"
description: "A brief excursion into the Java type system, nullability, and remedies for the billion-dollar mistake."
preview_image: /images/blog/2019/handling-nullability-in-your-code/article-header.png
section: blog
author:
  - David Schreiber-Ranner
date: 2019-03-27 8:00 UTC
tags: Android, Development, Kotlin
published: true
secret: false
---

Before Kotlin gained momentum in the Android community and spread like a wildfire, Java was the primary programming language for developing Android apps. Java has many great features for writing robust apps, but it has a flawed type system due to the missing nullability support. This blog post provides a brief introduction to the topic of nullability, and it discusses several best practices for handling nullability in your Java apps.READMORE

## The Java Type System

When using any programming language to write software, you automatically use the type system that is built into the language. Besides the syntax of a language (which is very apparent), the type system is one of the most distinctive features of every language.

Java was the first programming language for developing Android apps, and it is still the dominant language inside apps on Google Play (however, its primary contender, [Kotlin, is quickly gaining ground][kotlin stats]). Java’s type system is “static,” which means that the correct use of types throughout your application is verified and enforced at compile time (in contrast to “dynamic” type systems, where types are checked at runtime). The following is an example of Java’s static type checker:

```java
// This won't compile, since you can't assign an integer to a string variable.
String name = 10;

// This is perfectly fine and compiles.
String name = "David";
```

While Java’s static type system helps prevent many programming mistakes, it has one trait that allows for many bugs and crashes: its missing support for non-nullable types.

## The Billion-Dollar Mistake

> In the sixties, Tony Hoare, one of the creators of the [ALGOL programming language][], introduced `null` references in the ALGOL type system. He did this “simply because it was so easy to implement.” In 2009, he called this decision his “billion-dollar mistake” due to the amount of money wasted every year by developers all over the world who have to fix crashes caused by incorrect handling of `null` references.

In order for us to understand the issue of nullability in Java, let’s briefly revisit the basics of Java’s type system. Java knows two different kinds of types: primitive types and reference types. While variables of primitive types can only hold primitive type values, reference type variables can hold object references as well as `null` values. Here’s an example of a variable of type `String` (which is a reference type):

```java
// A `String` variable can hold a string reference...
String name = "David";

// ...but it can also hold `null`.
name = null;
```

The type `String` of the variable `name` is called a nullable type, since it can also take `null` as its value.

The Java type system doesn’t know non-nullable reference types. All non-primitive variables in Java are implicitly nullable and thus can hold `null` values. This directly impacts how Java applications have to be written. Let’s look at this simple example of a method taking a `String` argument:

```java
public String makePositive(String message) {
    return message.replace("no", "yes");
}
```

> The responsibility of handling `null` values is moved from the compiler to the developer.

If a string is passed to this method, it will return successfully. However, the type system does not prevent passing `null` as an argument either, in which case, the method would throw a `NullPointerException` (i.e. an error) at runtime. The lack of non-nullable references inside Java’s type system essentially moves the responsibility of handling `null` values away from the compiler and over to the application (and ultimately to the developer of the application).

Here’s an example of the same method, this time with proper handling of `null` argument values:

```java
public String makePositive(String message) {
    if (message == null) return null;
    return message.replace("no", "yes");
}
```

The given example is very simple, and it’s exactly this simplicity that hides another problem: “_Anything that can go wrong will go wrong._”

Developers don’t deem it necessary to guard their code against nullability misuse. They trust themselves to not pass `null` values to methods that aren’t intended to receive them — not considering the longevity of code. And [Murphy’s law][].

> In order to keep code expressive, robust, and maintainable, it is necessary to have a type system that knows non-nullable types.

## Augmenting the Type System

In order to remedy the nullability issues in the Java type system, multiple approaches exist. The one that Android (and several other frameworks and libraries) took is to retrofit the missing nullability type information using Java annotations.

Annotations are a versatile Java language feature for enriching application code with additional “static information.” This information can be evaluated either at compile time or at runtime. Annotations have many different use cases, including controlling code execution, configuring code generators, and defining rules for external tools.

Android uses two different nullability annotations:

- `@NonNull` specifies that the annotated type should be treated as non-nullable. Any variable of this type should not contain `null` values.
- `@Nullable` defines the annotated type to be nullable. The possibility of an object being `null` is the default in Java, but adding `@Nullable` makes it more explicit.

Here’s the example from before, but this time with Android’s nullability annotations that prohibit passing `null` values:

```java
@NonNull
public String makePositive(@NonNull String message) {
    return message.replace("no", "yes");
}
```

There’s only one problem with this code: The Java compiler itself does not know nullability annotations. While you can compile your code with them, the compiler won’t understand their relevance to the type system.

## Using the Right Tools™️

Even with nullability annotations in your code, the Java compiler won’t prevent you from illegally dereferencing `null` values. That’s because Adding `@NonNull` and `@Nullable` to your code is only useful in combination with the right tools. Let’s have a look at a few of them:

1. The IDE (that is, Android Studio) is capable of deducing nullability information from analyzed code. It can assist developers and show coding-time errors whenever any of the defined nullability rules are violated.
2. The Android linter (implemented by your project’s `:lint` Gradle task) will use the same annotations to find nullability problems inside the code. These can also be shown inside IDEs, or they can be evaluated and logged inside continuous integration systems.
3. Other static analysis tools (like [PMD][], [FindBugs][], and [Error Prone][]) use nullability annotations to perform additional code analysis and reporting.
4. Code generators (such as [AutoValue][], [Dagger 2][], and [Butter Knife][]) evaluate nullability annotations to generate Java sources that properly handle nullability at runtime.
5. Other compilers or language plugins can use the nullability information — for example, the Kotlin IDE plugin and the compiler, both of which automatically generate the correct Kotlin types based on annotated Java types.

This is in no way an extensive list, but it should provide a good overview of the different use cases of nullability annotations throughout the library ecosystem.

## Summary

In this article, we discussed the shortcoming of Java’s type system around `null` values. We also covered the importance of augmenting the type system and presented the most common way of doing this — by using nullability annotations. We hope that this article inspires readers to think more about nullability handling in any software, independent of the programming language, and we will soon follow up with another in-depth look at pitfalls developers might encounter when using nullability annotations in their software. Stay tuned, and...

Keep coding!

[kotlin stats]: https://www.appbrain.com/stats/libraries/details/kotlin/kotlin
[algol programming language]: https://en.wikipedia.org/wiki/ALGOL
[murphy’s law]: https://en.wikipedia.org/wiki/Murphy%27s_law
[pmd]: https://pmd.github.io/
[findbugs]: http://findbugs.sourceforge.net/
[error prone]: https://errorprone.info/
[autovalue]: https://github.com/google/auto/
[dagger 2]: https://google.github.io/dagger
[butter knife]: http://jakewharton.github.io/butterknife/
