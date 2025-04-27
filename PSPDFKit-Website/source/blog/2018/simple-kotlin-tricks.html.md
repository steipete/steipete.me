---
title: "Simple Kotlin Tips for Beginners"
description: "Useful tricks for beginners to start writing better code with Kotlin."
preview_image: /images/blog/2018/simple-kotlin-tricks/article-header.png
section: blog
author:
  - Anastasiia Zhuravleva
date: 2018-01-15 12:00 UTC
tags: Android, Development, Kotlin 
published: true
---

When beginning to learn a new programming language, it’s important to have an overview of the fundamentals. That said, here are some useful tricks that will help ease you into learning Kotlin if you’re just starting out.

READMORE    

## Apply

A common use case for `apply` is to make additional configurations on a recently created object:

```kotlin
val turtle = Turtle().apply{
    Name = "Joe"
    Age = 50
}
```

Notice how when you use `apply`, it will return the object you modified back to you.

## With

A common use case for `with` is to call multiple methods on the same object. In that case, this:

```kotlin
file.load()
file.modify()
file.modifyMore()
file.save()
```

will become this:

```kotlin
with(file){
    load()
    modify()
    modifyMore()
    save()
}
```

Keep in mind that the above returns the result of the last expression.

## Method Returns Using `=`

If you have a method that contains only a single return statement, you can omit the return type, return keyword, and braces, and replace them all with `=`. In that case, this:

```kotlin
fun sum(val a: Int, val b: Int): Int {
    return a+b
}
```

becomes this:

```kotlin
fun sum(val a: Int, val b: Int) = a + b
```

## Ranges

Ranges are useful for cycle conditions, as shown here:

```kotlin
for (i in 1..5) print(i) // results in "12345"
```

However, this doesn’t work in reverse:

```kotlin
for (i in 5..1) print(i) // prints nothing
```

Instead, here is the proper backward iteration:

```kotlin
for (i in 5 downTo 1) print(i) // results in "54321"
```

You can also use `until`, like so:

```kotlin
for (i in 0 until 5) { // results in "01234"
     println(i)
}
```

This is frequently used to iterate through collections:

```kotlin
for(i in 0 until list.size()){
    println(i)
}
```

## When

`When` is a more powerful version of Java’s `switch`, and it combines nicely with ranges, as shown here:

```kotlin
when (x) {
    in 0 until 5 -> println("x is in range")
    is 10 -> println("the special case, when x is 10")
    else -> println("none of the above")
}
```

It can be also used as a return statement, but you need to either specify all possible cases (make it exhaustive) or include `else`:

```kotlin
enum class Theme {
    DEFAULT,
    DARK,
    XMAS
}

fun getThemeLogo() = when (theme) {
    DEFAULT -> getDefaultLogo()
    DARK -> getDarkLogo()
    XMAS -> getXmasLogo()
}

fun getThemeLogoExcludingPromos() = when (theme) {
    DEFAULT -> getDefaultLogo()
    DARK -> getDarkLogo()
    else -> getDefaultLogo()
}
```

Additionally, you can use `when` as an expression, but it doesn’t need to be exhaustive in this case:

```kotlin
fun showAnimations() {
    when (theme) {
        DEFAULT -> showAnimation()
        XMAS -> showXmasAnimation()
    }
}
```

Finally, `when` can be used along with smart casts:

```kotlin
when(file) {
    is Directory -> processDirectory()
    is Document -> processDocument()
}
```

## Data Classes

Data classes are classes that have the specific purpose of holding data:

```kotlin
data class Turtle(val name: String, val age: Int)
```

The data class will have the following function out of the box:

`toString` of the form `"Turtle(name=Joe, age=50)"`
`equals()` and `hashCode()`
`copy()`

It will also become a subject for destructuring declarations:

``` kotlin
val turtleJoe = Turtle("Joe", 50)
val (name, age) = turtleJoe
println(name)
println(age)
```

## Static Fields and Constants

Static fields are commonly used in Java, but they are a bit tricky in Kotlin. The closest thing to the concept of static fields in Kotlin is a companion object declared inside the class.

Here is how you can declare a static constant:

```kotlin
class Theme {
    companion object { const val THEME_KEY = "a_theme_key" }
}
```

## Null Safety

Kotlin provides tools to help you prevent the most common type of runtime exceptions: `NullPointerException`s (NPEs).

To do this, you first need to explicitly specify that you want some field/variable to hold `null`:

```
var text: String // can't hold null
text = null // compilation error

var textOrNull: String? // can hold null (specified by adding ?)
textOrNull = null // compiles just fine
```

If you use the second version, Kotlin will expect a null handling logic, and there are tools to simplify that as well.

Safe calls `?.` to perform an action on a nullable object:

```kotlin
var textOrNull: String?
textOrNull?.length // will return length or null
```

The Elvis operator `?:` specifies actions to take in case of a `null`:

```kotlin
textOrNull?.length ?: 0 // will return length or 0 in case of a null
```

There is also the `let` operator, which can be used if you need a code block to execute only when something isn’t null:

```kotlin
currentTheme?.let {
    applyTheme(theme)// we are certain it is not null here
    sendAnalyticsThemeEvent(theme)
}
```

Finally, there is `!!`, which converts any value to a non-null type and throws an exception if the value is `null`. This operator may look like an easy escape for null handling chores, but it should be avoided at all costs since Kotlin does so much to help to get rid of NPEs.

There is much more to Kotlin, but for the sake of simplicity, this is a good starting point. Hopefully, it will be a useful guide about frequently used Kotlin practices to help get you up and running.
