---
title: "Investigating the Performance Overhead of C++ Exceptions"
description: "C++ exceptions have their place, but using an alternative is recommended for general program flow control."
preview_image: /images/blog/2020/performance-overhead-of-exceptions-in-cpp/article-header.png
section: blog
author:
  - Amit Nayar
author_url:
  - https://twitter.com/amitnayar_
date: 2020-02-11 8:00 UTC
tags: Development, C++
published: true
secret: false
---

Runtime error handling is hugely important for many common operations we encounter in software development — from responding to user input, to dealing with a malformed network packet. An application shouldn’t crash because a user has loaded a PNG instead of a PDF, or if they disconnect the network cable while it’s fetching the latest version of [PSPDFKit for Android][]. Users expect a program to gracefully handle errors, either quietly in the background, or with an actionable and user-friendly message.

Dealing with exceptions can be messy, complicated, and — crucially, for many C++ developers — slow. But as with so many things in software development, there is more than one way to cook an egg. In this blog post, we will be taking a closer look at C++ exceptions, what their downsides are, how they might affect the performance of your application, and what alternatives we have at our disposal to lessen their use.

The purpose of this post is not to deter us from using exceptions entirely; exceptions have their use, and in many cases, they are unavoidable. (Consider an error detected inside a constructor. How do we report that error?) Rather, this post is focused on using exceptions for general flow control, and it provides us with an alternative to help develop robust and easy-to-follow applications.

## A Quick Benchmark Test

How much slower are exceptions in C++ compared to simpler flow control mechanisms?

Exceptions are much more complicated than a simple `break` or `return`, but just how much extra work does the processor have to do? Let’s put it to the test!

In the code below, we have a simple function that generates a random number and checks for a certain number before producing an error. The random number check ensures the computer has some work to do at runtime so that the compiler cannot simply optimize away our tests. Here are our test cases:

1. Exit by throwing an `int`. Although not especially practical, this is the simplest exception we can do in C++, and it is useful for stripping out as much complication as possible for this particular test.
2. Exit by throwing an `std::runtime_error`, which can contain a string message. This is much more practical than the `int` example. We’ll see if there’s much overhead in addition to the added complexity.
3. Exit with a `void return`.
4. Exit with a C-style `int` error code.

The test is run using Google’s lightweight [benchmark library][google benchmark], which runs many cycles of each test. Eager readers may want to skip straight to the [results](#the-results).

### The Code

Our super complex random number generator:

```cpp
const int randomRange = 2;  // Give me a number between 0 and 2.
const int errorInt = 0;     // Stop every time the number is 0.
int getRandom() {
    return random() % randomRange;
}
```

And the test functions:

```cpp
// 1.
void exitWithBasicException() {
    if (getRandom() == errorInt) {
        throw -2;
    }
}
// 2.
void exitWithMessageException() {
    if (getRandom() == errorInt) {
        throw std::runtime_error("Halt! Who goes there?");
    }
}
// 3.
void exitWithReturn() {
    if (getRandom() == errorInt) {
        return;
    }
}
// 4.
int exitWithErrorCode() {
    if (getRandom() == errorInt) {
        return -1;
    }
    return 0;
}
```

Finally, we can integrate our tests with the [Google benchmark][] library:

```cpp
// 1.
void BM_exitWithBasicException(benchmark::State& state) {
    for (auto _ : state) {
        try {
            exitWithBasicException();
        } catch (int ex) {
            // Caught! Carry on next iteration.
        }
    }
}
// 2.
void BM_exitWithMessageException(benchmark::State& state) {
    for (auto _ : state) {
        try {
            exitWithMessageException();
        } catch (const std::runtime_error &ex) {
            // Caught! Carry on next iteration.
        }
    }
}
// 3.
void BM_exitWithReturn(benchmark::State& state) {
    for (auto _ : state) {
        exitWithReturn();
    }
}
// 4.
void BM_exitWithErrorCode(benchmark::State& state) {
    for (auto _ : state) {
        auto err = exitWithErrorCode();
        if (err < 0) {
            // `handle_error()` ...
        }
    }
}

// Add the tests.
BENCHMARK(BM_exitWithBasicException);
BENCHMARK(BM_exitWithMessageException);
BENCHMARK(BM_exitWithReturn);
BENCHMARK(BM_exitWithErrorCode);

// Run the tests!
BENCHMARK_MAIN();
```

For readers who wish to try it out for themselves, the full test code can be found [here][github test code].

### The Results

Below we have the output from the benchmark — first without any compiler optimizations, and then with `-O2`.

#### Debug -O0:

```console
------------------------------------------------------------------
Benchmark                        Time             CPU   Iterations
------------------------------------------------------------------
BM_exitWithBasicException     1407 ns         1407 ns       491232
BM_exitWithMessageException   1605 ns         1605 ns       431393
BM_exitWithReturn              142 ns          142 ns      5172121
BM_exitWithErrorCode           144 ns          143 ns      5069378
```

#### Release -O2:

```console
------------------------------------------------------------------
Benchmark                        Time             CPU   Iterations
------------------------------------------------------------------
BM_exitWithBasicException     1092 ns         1092 ns       630165
BM_exitWithMessageException   1261 ns         1261 ns       547761
BM_exitWithReturn             10.7 ns         10.7 ns     64519697
BM_exitWithErrorCode          11.5 ns         11.5 ns     62180216
```

_(Run on 2015 MacBook Pro 2.5GHz i7)_

The results are pretty staggering! We can see a huge gap in time taken to run the exception code vs. the basic return or error code approach. With compiler optimizations, there is an even greater difference.

This is by no means a perfect test. The complier can probably do a lot of optimization with the code we have supplied in tests 3 and 4. Caveats aside, the differences are huge and the test demonstrates how much overhead we can expect to see with exceptions.

Thanks to the zero-cost exception model used in most C++ implementations (see [section 5.4 of TR18015][tr18015]), the code in a `try` block runs without any overhead. However, a `catch` block is orders of magnitude slower. In our simple example, we can see how slow throwing and catching an exception can be, even in a tiny call stack! Speed will decrease linearly with the depth of the call stack, which is why it’s always best to `catch` an exception as close to the `throw` point as possible.

So if exceptions are so slow, why do we use them?

## Why Use Exceptions?

The benefits to exceptions are explained nice and succinctly in the [Technical Report on C++ Performance (section 5.4)][tr18015]:

> The use of exceptions isolates the error handling code from the normal flow of program execution, and unlike the error code approach, it cannot be ignored or forgotten. Also, automatic destruction of stack objects when an exception is thrown renders a program less likely to leak memory or other resources. With exceptions, once a problem is identified, it cannot be ignored – failure to catch and handle an exception results in program termination.

The key takeaway here is that an exception cannot be ignored or forgotten; if we have an exception, it must be dealt with. This makes exceptions extremely powerful built-in tools in C++, and something that no simple C-style error code can replace. Exceptions are useful for situations that are out of the program’s control, e.g. the hard disk is full, or a mouse has chewed through your network cable. In such rare situations, an exception is an ideal and perfectly performant tool for the task.

But what about all those errors inside the program’s control? If a function can produce an error, we want a mechanism where it is semantically obvious to the programmer that they need to check for an error, while also providing useful information about the error, if it occurs, in the form of a message or some other data (much like an exception).

## Expected

We know that exceptions are really slow, and if you’re programming in C++, you generally don’t want slow — especially for general flow control error handling. Exceptions are also hopelessly serial, meaning they must be dealt with immediately, and they do not allow for storing of an error to be handled at a later time.

With the upsides and downsides in mind, what alternatives do we have at our disposal? Here at PSPDFKit, we use a class called `Expected<T>` which is an idea originally proposed by Dr. Andrei Alexandrescu. His talk on [Systematic Error Handling in C++][] is excellent, and it’s well worth a watch to help you understand the full power of this strategy.

The following pseudocode gives an idea of how `Expected<T>` can look. `Expected<T>` allows for either a `T` to be created or the exception that prevents `T` to be created. Simply put, it is a wrapper for a union of an expected return value and an error:

```cpp
template <class T>
class Expected {
private:
    // Our union of value and error. Only one of these can exist in any `Expected` object created.
    union {
        T value;
        Exception exception;
    };

public:
    // Instantiate the `Expected` object with the successfully created value.
    Expected(const T& value) ...

    // Instantiate the `Expected` object with an exception.
    Expected(const Exception& ex) ...

    // Was there an error?
    bool hasError() ...

    // Access the value.
    T value() ...

    // Access the exception.
    Exception error() ...
};
```

The real-world implementation is a bit more complex that this; the talk mentioned above will fill in all the nitty-gritty implementation details.

So the basic idea behind `Expected` is that a function that can produce an error has an expected return value of a certain type (an `int`, a class, void, and so on). If the function call succeeds, the return value is stored in an `Expected` instance and retrieved with the `value()` accessor. If something goes wrong, the error is stored in the same instance of `Expected` and retrieved with the `error()` accessor. Once the function has been called, it is simple to check whether we have the value or an error. If there is an error, there’s no need for a slow and “must-be-handled-immediately” `catch` block; instead, we can check for `hasError()` and get the error message whenever it’s suitable.

### Speed Test!

Let’s plug our `Expected` class into the test functions [described above](#the-code) and see how it can be used:

```cpp
// 5. Expected! Testcase 5 function.
Expected<int> exitWithExpected() {
    if (getRandom() == errorInt) {
        return std::runtime_error("Halt! If you want...");  //  Return; don't throw!
    }
    return 0;
}

// Benchmark function with example usage.
void BM_exitWithExpected(benchmark::State& state) {
    for (auto _ : state) {
        auto expected = exitWithExpected();

        if (expected.hasError()){
            // Handle in our own time.
        }
        // Or we can use the value...
        // else {
        //     doSomethingInteresting(expected.value());
        // }
    }
}

// Add the test.
BENCHMARK(BM_exitWithExpected);

// Run the test...
BENCHMARK_MAIN();
```

Drumroll please...

#### Debug -O0:

```console
------------------------------------------------------------------
Benchmark                        Time             CPU   Iterations
------------------------------------------------------------------
BM_exitWithExpected            147 ns          147 ns      4685942
```

#### Release -O2:

```console
------------------------------------------------------------------
Benchmark                        Time             CPU   Iterations
------------------------------------------------------------------
BM_exitWithExpected           57.5 ns         57.5 ns     11873261
```

Not bad! We’ve managed to take our no-optimizations `std::runtime_error` result from 1605 ns to a mere 147 ns. The results are even more impressive with optimizations: 1261 ns to 57.5 ns. That’s more than 10 times faster with `-O0` and well more than 20 times faster in with `-O2`!

So there we have it: `Expected` gives us a much faster and more versatile control flow error-handling mechanism than exceptions do. It is also semantically clear, and we don’t need to compromise on error messages.

At PSPDFKit, we use this technique to speed up our code while [failing quickly][fail fast] and gracefully when required — all the while retaining the ability to show our users descriptive and useful error messages from our APIs.

## Conclusion

Exceptions aren’t all bad. In fact, they are extremely performant at what they are designed for: exceptional circumstances! We only start running into problems when we use them for general control flow, where much more efficient solutions are already available.

The benchmark tests, albeit rather crude, showed us the huge gains in performance we can achieve by avoiding catching exceptions when a return will suffice.

In this post, we also took a brief glimpse at the `Expected<T>` class and how we can use this design to speed up our error handling. `Expected` allows us to be more flexible with when to handle errors, while also keeping the code flow easy to follow and retaining our descriptive messages for our users and programmers.

[pspdfkit for android]: https://pspdfkit.com/pdf-sdk/android/
[tr18015]: http://www.open-std.org/jtc1/sc22/wg21/docs/TR18015.pdf
[github test code]: https://github.com/PSPDFKit-labs/cpp-exceptions-testing
[google benchmark]: https://github.com/google/benchmark
[fail fast]: https://en.wikipedia.org/wiki/Fail-fast
[systematic error handling in c++]: https://channel9.msdn.com/Shows/Going+Deep/C-and-Beyond-2012-Andrei-Alexandrescu-Systematic-Error-Handling-in-C
