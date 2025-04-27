---
title: "The Functional Side of std::optional with C++20"
description: "std::optional is already really useful, and it's about to get better with C++20."
preview_image: /images/blog/2019/the-functional-side-of-optional/article-header.png
section: blog
author:
  - Nick Winder
author_url:
  - http://www.nickwinder.com
date: 2019-12-18 4:00 UTC
tags: Development, C++
published: true
secret: false
---

In this blog post, we’re going to explore `std::optional`, which is a class template added in C++17 standard that has become a big part of the PSPDFKit codebase. We, along with many other developers, were actually using an `optional` type of our own before C++17, so if you cannot adopt newer standards yet, [do not despair][pre-17-optional].

The purpose of the post is to look to the future and review the proposed additions to `std::optional` that will make it into C++20. We will see how it’ll make our lives easier and our code cleaner, which are two things we all want.

## Why Optional?

There are many cases for an optional type. The most obvious use case is where a value is returned from a function based on some condition. When the condition is not satisfied, then what do we return?

```cpp
Value getMeAValue() {
  if(yeahSure) {
    return {0,0};
  } else {
    return what?; // We have no value to return.
  }
}
```

In the past, we used to get around this by returning a pointer to the value, where `nullptr` would indicate the value was not obtainable. If we were not using smart pointers, we could have caused obvious major issues. But that aside, the code is not very expressive for what we are trying to achieve:

```cpp
std::unique_ptr<Value> getMeAValue() {
  if(yeahSure) {
    return std::make_unique<Value>();
  } else {
    return nullptr;
  }
}
```

Another implementation was to return a `std::pair<bool, Value>`, where the `first` type indicates whether or not the `Value` is populated with relevant data. This means that `Value` would have to be constructable by default, and again, the code is not very expressive:

```cpp
std::pair<bool, Value> getMeAValue() {
  if(yeahSure) {
    return {true, {1,2}};
  } else {
    return {false, {1,2}};
  }
}
```

Then there was `optional`, a type that contains an optional value. You can query the type to determine if there is a value to read. It was easier to read, easier to write, and an all-around solid addition:

```cpp
std::optional<Value> getMeAValue() {
  if(yeahSure) {
    return Value{0,0};
  } else {
    return std::nullopt;
  }
}
```

## What Are the Drawbacks of std::optional?

However, there are drawbacks to using `std::optional`. When many values become optional, the conditional virus starts spreading, which results in bloated code and large function bodies:

```cpp
const auto value1 = getMeAValue();
if(!value1) {
  throw std::runtime_error("Failed to get a value");
}

const auto value2 = getMeASecondValue();
if(!value1) {
  throw std::runtime_error("Failed to get a second value");
}

const auto value3 = getMeAThirdValue();
if(!value1) {
  throw std::runtime_error("Failed to get a third value");
}

const auto value4 = getMeAFourthValue();
if(!value1) {
  throw std::runtime_error("Failed to get a fourth value");
}

return {*value1, *value2, *value3, *value4}
```

The code block above shows many values that need to be collated together to produce a result. But if any of these values are not obtainable, we should throw an exception. What this means is that at every point, we had to check if the value was available, and doing so would result in verbose and messy code.

We had this experience numerous times and attempted to fix it with a simple macro (don’t judge us, it worked):

```cpp
#define THROW_IF_EMPTY(extractedValue, optional)                \
      const auto maybe_##extractedValue = (optional);           \
      if (!maybe_##extractedValue) {                            \
        throw std::runtime_error(std::string{"Failed to get a value for "} +  #extractedValue); \
      }                                                         \
      const auto extractedValue = *maybe_##extractedValue

...

THROW_IF_EMPTY(value1, getMeAValue());
THROW_IF_EMPTY(value2, getMeASecondValue());
THROW_IF_EMPTY(value3, getMeAThirdValue());
THROW_IF_EMPTY(value4, getMeAFourthValue());

return {value1, value2, value3, value4}
```

The macro shown above checks that the value is available, and if it’s not, it throws. Adding this cleaned up our codebase drastically, but we were still using a convoluted macro.

## Looking to the Future (C++20)

The proposal [P0798R0][c++20-optional-extension], which has been accepted as part of C++20, introduces some new operations to help with a little code cleanup. The functional programmers out there are likely celebrating, as they’ll be able to complete monadic operations with the use of `map`, `and_then`, and `or_else`.

Let’s take a closer look at these three member functions.

### map

From the proposal:

> `map` applies a function to the value stored in the optional and returns the result wrapped in an optional. If there is no stored value, then it returns an empty optional.

What we see here is the possibility of transforming the type held by the optional into something else. In the following example, we show a class that has a method, `getFloat`, which returns a `float` from some given logic in `Value`. Without `map`, we would have to insert conditions to check whether the value returned from `getMeAValue` contains a value, and only if this is true can we return assign a `float` to `floatValue`:

```cpp
float Value::getFloat() {
    return 4.f;
}

std::optional<Value> getMeAValue() {
    ...
    return Value{};
}

std::optional<float> floatValue;
if(const auto value = getMeAValue()) {
  floatValue = value->getFloat();
}
```

But with `map`, we’d be able to simply transform that type on one line:

```cpp
std::optional<float> floatValue = getMeAValue().map(&Value::getFloat)
```

The operation would handle the fact that there may be no stored value, in which case the empty optional will be returned as expected.

This is cool, and we’ll see later how powerful it can be.

### and_then

Many functional programmers will know this as the monadic bind. It’s fairly similar to the `map` operation, the difference being that, with `and_then`, the operation performed on the optional can also transform the results into an empty optional:

```cpp
...

std::optional<int> Value::getOptionalInt(int value) {
  if(value < 5) {
    return std::nullopt;
  } else {
    return value;
  }
}

...

std::optional<int> intValue = getMeAValue().and_then(&Value::getOptionalInt)
```

### or_else

The `or_else` operation is essentially the opposite of `map`, in that this operation is performed only if the optional is empty. It could be useful for a few different reasons, but it’s especially useful for logging, or in our case, for throwing an exception.

Now we can loop back to and finally get rid of that pesky `THROW_IF_EMPTY` macro.

The proposal directly lays out this use case with the following code block:

```cpp
void opt_throw(std::string_view msg) {
     return [=] { throw std::runtime_error(msg); };
}

get_opt().or_else(opt_throw("get_opt failed"));
```

We can plant this in the body of our function and be happy that we no longer need a macro. Now the adjusted code from our previous example can be rewritten as the following:

```cpp
const auto value1 = getMeAValue().or_else(opt_throw("get value1 failed"));
const auto value2 = getMeASecondValue().or_else(opt_throw("get value2 failed"));
const auto value3 = getMeAThirdValue().or_else(opt_throw("get value3 failed"));
const auto value4 = getMeAFourthValue().or_else(opt_throw("get value4 failed"));
```

### Chaining Operations

The new extensions become even more useful when thinking about chaining operations together. Because each of the operations returns an `std::optional` of some type, we can just continue operating on the return value.

From the proposal:

```cpp
std::optional<int> i = opt_string
                       .and_then(stoi)
                       .or_else(opt_throw("stoi failed"))
                       .map([](auto i) { return i * 2; });
```

As you can imagine, the code from before would have taken dozens of lines to express the same functionality. So with chaining, we are able to cut down the lines of code, be more expressive, and make small blocks of code more readable.

## Conclusion

If you’ve been using C++17 ([or even if not][pre-17-optional]), then you’ve probably found the optional template pretty useful. Now, looking forward to C++20, we can expect more goodies to help us clean up our conditional mess, making the code we write more readable and more functional. 😱

If you want to find out more about the changes proposed, have a look at the [proposal][c++20-optional-extension] and check out an [implementation on GitHub][pre-17-optional].

[pre-17-optional]: https://github.com/TartanLlama/optional
[c++20-optional-extension]: http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2017/p0798r0.html
