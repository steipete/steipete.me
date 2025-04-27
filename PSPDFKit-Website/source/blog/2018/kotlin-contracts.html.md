---
title: What Are Kotlin Contracts and How Are They Useful?
description: An overview of the experimental Kotlin Contracts API.
preview_image: /images/blog/2018/kotlin-contracts/article-header.png
section: blog
author:
  - Anastasiia Zhuravleva
date: 2018-11-06 8:10 UTC
tags: Android, Development, Kotlin
published: true
secret: false
---

Kotlin Contracts are a new experimental feature introduced in [Kotlin 1.3][kotlin 1.3]. The main purpose of contracts is to help the Kotlin compiler with complicated code analysis in cases where the developer knows more details about the code than the compiler can see.

*Disclaimer:* As mentioned already, Kotlin Contracts are an experimental feature. This feature will most likely go through revisions and syntax changes before it’s officially released, and there’s even the possibility that it will be canceled and only used internally. As such, we advise you to exercise caution before adopting contracts.

### The Original Problem

One thing the Kotlin compiler does is perform complicated code analysis to check for the correctness of code and to make it better. But sometimes the compiler might be too strict or fall short — for example, when working with functions or lambdas. The main purpose of Kotlin Contracts is to facilitate cooperation with the compiler by telling it not only that you know more than it does, but also that it should take your word for it.

Let’s take a look at a few examples where the Kotlin compiler has trouble resolving code and see how contracts attempt to solve these issues.

### Initializing in Lambdas

The following code does not compile:

```kotlin
fun calledOneTimeOnly(run: () -> Unit) {
  // do something
}

fun initValue() {
  val intValue: Int
  calledOneTimeOnly {
    // Does not compile:
    // Captured values initialization is forbidden due to possible reassignment.
      intValue = 1
  }
}
```

The main reason the compiler complains is because it has no way to discern that the lambda is only invoked once and that the `val` is not reassigned as a result. The other reason is that the compiler also has no way of determining if this lambda will be invoked at all, which leads to `val` being left unassigned as well.

Using contracts, we can fix this by telling the compiler that we’ll take care of this `val` assignment ourselves:

```kotlin
@ExperimentalContracts
fun calledOneTimeOnly(run: ()-> Unit) {
    contract {
        callsInPlace(run, InvocationKind.EXACTLY_ONCE)
    }
    run()
}

@ExperimentalContracts
fun initValue() {
    val intValue: Int
    calledOneTimeOnly {
        // Compiles.
        intValue = 1
    }
}
```

Above was a contract for lambda invocation.

And here are all the possible invocation kinds:

* `UNKNOWN` — default for the compiler
* `AT_MOST_ONCE` — zero or one invocation(s)
* `EXACTLY_ONCE` — guaranteed one-time invocation
* `AT_LEAST_ONCE` — one or more invocations

### Nullability Checks and Casting

Here is another example of something not compiling:

```kotlin
fun Any?.isValidString(): Boolean {
    return this != null && this is String && this.length > 0
}

fun getString() : String? {
    // Somehow get the string, which might be null.
}

fun testString() {
    val test = getString()

    if (test.isValidString()) {
        // Does not compile:
        // Type mismatch. Required: String. Found: String?.
        val result: String = test
    }
}
```

The problem again is that the compiler doesn’t know that we performed the nullability and cast checks inside the `isValidString()` function. Here’s how to fix this with a contract:

```kotlin
@ExperimentalContracts
fun Any?.isValidString(): Boolean {
    contract {
        returns(true) implies (this@isValidString is String)
    }
    return this != null && this is String && this.length > 0
}


fun getString() : String? {
    return null
}

@ExperimentalContracts
fun testString() {
    val test = getString()

    if (test.isValidString()) {
        // Compiles.
        val result: String = test
    }
}
```
Above was a contract for the return value.

And here are the available return implementations:

* `returns()` — implied if the method returns at all.
* `returns(value: true/false/null)` — implied if the method returns the specific value.
* `returnsNotNull()` — implied if the method returns a non-null value.

`implies()` has its own restrictions as well: It only supports nullability and type checks (`!= null`, `== null`, `is`, and `!is`).

### Another Casting Example

Here is another example that will lead us to a more complex contract to help with smart casting. Any attempts to use any of the following three parameters (`nameOrId`, `ageOrName`, or `registeredOrAge`) fail with compiler errors:

```kotlin
fun newTurtle(name: Any?, age: Any?, registered: Any?): Boolean {
    return name is String && age is Int && registered is Boolean
}

fun registeredTurtle(id: Any?, name: Any?, age: Any?): Boolean {
    return id is Long && name is String && age is Int
}

fun printTurtle(nameOrId: Any?, ageOrName: Any?, registeredOrAge: Any?) {
    if (newTurtle(nameOrId, ageOrName, registeredOrAge)) {
        val capitalizedName = nameOrId.capitalize() // attempt to use as String
        val ageIsPositive = ageOrName > 0 // attempt to use as Int
        if (!registeredOrAge) { // attempt to use as Boolean
            println("Turtle isn't registered. Name: $capitalizedName; age is positive: $ageIsPositive")
        } else {
            println("Turtle is registered. Name: $capitalizedName; age is positive: $ageIsPositive")
        }
    } else if (registeredTurtle(nameOrId, ageOrName, registeredOrAge)) {
        val capitalizedName = ageOrName.capitalize() // attempt to use as String
        val ageIsPositive = registeredOrAge > 0 // attempt to use as Int
        println("Turtle with given id $nameOrId. Name: $capitalizedName; age is positive: $ageIsPositive")
    } else {
      println("Unknown turtle type. nameOrId = $nameOrId ageOrName = $ageOrName registeredOrAge = $registeredOrAge")
    }
}
```

Here is the fixed version using contracts:

```kotlin
@ExperimentalContracts
fun newTurtle(name: Any?, age: Any?, registered: Any?): Boolean {
    contract {
        returns(true) implies (
                name != null && name is String &&
                        age != null && age is Int &&
                        registered != null && registered is Boolean
                )
    }
    return name is String && age is Int && registered is Boolean
}

@ExperimentalContracts
fun registeredTurtle(id: Any?, name: Any?, age: Any?): Boolean {
    contract {
        returns(true) implies (
                id != null && id is Long &&
                        name != null && name is String &&
                        age != null && age is Int
                )
    }
    return id is Long && name is String && age is Int
}

@ExperimentalContracts
fun printTurtle(nameOrId: Any?, ageOrName: Any?, registeredOrAge: Any?) {
    if (newTurtle(nameOrId, ageOrName, registeredOrAge)) {
        // Treated as name: String and not id: Long
        val capitalizedName = nameOrId.capitalize()
        // Treated as age: Int and not name: String
        val ageIsPositive = ageOrName > 0 // age
        // Treated as registered: Boolean and not age: Int
        if (!registeredOrAge) {
            println("Turtle isn't registered. Name: $capitalizedName; age is positive: $ageIsPositive")
        } else {
            println("Turtle is registered. Name: $capitalizedName; age is positive: $ageIsPositive")
        }
    } else if (registeredTurtle(nameOrId, ageOrName, registeredOrAge)) {
         // Treated as name: String and not age: Int
        val capitalizedName = ageOrName.capitalize()
        // Treated as age: Int and not registered: Boolean
        val ageIsPositive = registeredOrAge > 0
        // nameOrId is treated as id: Long
        println("Turtle with given id $nameOrId. Name: $capitalizedName; age is positive: $ageIsPositive")
    } else {
      println("Unknown turtle type. nameOrId = $nameOrId ageOrName = $ageOrName registeredOrAge = $registeredOrAge")
    }
}
```

### The Main Problem

You’ve likely noticed how often you need to use @ExperimentalContracts before a method or class. This is to remind you that the feature is in the early stages of development. The main problem with contracts is that they are not verified in any way (yet?) at the declaration site, so it’s your responsibility to provide accurate information there.

Check out the modification of our very first contract below, and keep in mind that it has no problems according to the compiler:

```kotlin
@ExperimentalContracts
fun Any?.isValidString(): Boolean {
    contract {
        returns(true) implies (this@isValidString is String)
    }
    // Removed nullability check.
    return this is String && this.length > 0
}
```

The following return statements will not produce any compiler errors either:

`return this != null`, `return this is Int`, `return true`.

Needless to say, you will get a `NullPointerException` if you try and use the resulting string, which will pass the `isValidString()` check without an issue.

So, what is going on here? Currently, using contracts is basically telling the compiler to not look at the code at all. This means that if you end up using contracts for things beyond experiments, you might end up with bugs that slip past code review and possibly past tests. As such, it’s important to pay close attention to what is written inside the contracts — especially considering that fact that contract code can quickly grow in size when used in a real codebase, which increases the chance of buggy behavior.

Using contracts allows us to give the compiler more clues, though this comes at the cost of possible hidden bugs. Maybe in the future, Kotlin Contracts will acquire proper syntax checks and become a full feature free of the experimental tag. But in the end, it’s still your decision on whether you want to use contracts at all, how often you use them, and how complicated they are allowed to be.

[kotlin 1.3]: https://kotlinlang.org/docs/reference/whatsnew13.html
