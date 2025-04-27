---
title: "When C++ Doesn't Move"
description: "Move semantics in C++ make your code more efficient, but sometimes a move is not performed. In this blog post, we explore why."
preview_image: /images/blog/2019/when-cpp-doesnt-move/article-header.png
section: blog
author:
  - Nick Winder
author_url:
  - http://www.nickwinder.com
date: 2019-07-10 14:00 UTC
tags: Development, C++
published: true
secret: false
---

Move semantics were introduced in C++11 with the hope of adding more performance to an already performant language. In most cases, move semantics were successful in achieving efficiency, but there are some equally confusing and important situations where a move will not be performed, and as a C++ developer, it’s beneficial to understand when these situations could occur.

If you don’t already know about move semantics, I’d suggest first reading up on [r-value references and move semantics][rvalue-references-and-move-semantics] and then heading back over here to uncover the pitfalls of a potentially simple performance gain.

## When a Move Is Not Performed

Sometimes the compiler cannot call the move constructor and it defaults back to the copy constructor or another operation — _even_ when [`std::move`][std-move] is called. From the compiler output, you have no way of knowing when this happens, and in most instances, you’ll be losing performance without even realizing it (or at least throwing away that slight performance increase you could benefit from).

For here on out, I’ll be using a class that will print the information from each constructor or assignment. It will highlight the constructors and assignments that are called, in addition to sharing at which point during the execution of the following examples they are called:

```cpp
class Lifetime {
public:
  Lifetime() { std::cout << "Constructor" << std::endl; }
  Lifetime(const Lifetime &other) {
    std::cout << "Copy Constructor" << std::endl;
  }
  Lifetime(Lifetime &&other) noexcept {
    std::cout << "Move Constructor" << std::endl;
  }
  Lifetime &operator=(const Lifetime &other) {
    std::cout << "Copy Assignment" << std::endl;
    return *this = Lifetime(other);
  }
  Lifetime &operator=(Lifetime &&other) noexcept {
    std::cout << "Move Assignment" << std::endl;
    return *this;
  }
};
```

## The Move Is Implicitly Deleted

The compiler will refuse to implicitly declare the move constructor/assignment in some cases. We can understand this better when reading [N3225][n3225] section 12.8/10:

> If the definition of a class X does not explicitly declare a move constructor, one will be implicitly declared as defaulted if and only if
>
> - X does not have a user-declared copy constructor,
> - X does not have a user-declared copy assignment operator,
> - X does not have a user-declared move assignment operator,
> - X does not have a user-declared destructor, and
> - the move constructor would not be implicitly defined as deleted.

The [rule of zero][rule-of-zero] advises us not to declare any default operations, and this advice holds true if we want to use move semantics. When any of the copy semantics or the destructor are explicitly defined and move semantics are not explicitly defined, the compiler will not implicitly define any move semantics. What this means is the class is not movable and it will revert to a copy:

```cpp
class Lifetime {
public:
  Lifetime() { std::cout << "Constructor" << std::endl; }
  Lifetime(const Lifetime &other) {
    std::cout << "Copy Constructor" << std::endl;
  }
};

int main() {
  Lifetime temp;
  Lifetime x = std::move(temp);
  return 0;
}
```

Output:

```text
Constructor
Copy Constructor
```

We can see this when we only define the copy constructor in the `Lifetime` class and attempt a move: The output will show a copy is actually made. The explanation of this lies within the C++ standard passage seen above, with the relevant line repeated below, where X is `Lifetime`:

> X does not have a user-declared copy constructor

If we use the original `Lifetime` class declared at the top of the post, we will see a move operation:

```text
Constructor
Move Constructor
```

## Moving a const Value

`Const`ness will often disable move operations, and you can see this from the definition of the move constructor: It takes in a non-`const` r-value reference. When a `const` value is passed to `std::move`, the compiler will revert to a copy:

```cpp
int main() {
  const Lifetime temp;
  Lifetime x = std::move(temp);
  return 0;
}
```

```text
Constructor
Copy Constructor
```

However, if you have some mutable data in your `const` object, it can make sense to define a `const` move constructor:

```cpp
class Lifetime {
public:

 ...

  Lifetime(const Lifetime &&other) noexcept : value(other.value) {
    std::cout << "Const Move Constructor" << std::endl;
    other.value = 0;
  }

  mutable int value;
};
```

Now the `const` move constructor will be called.

Strictly speaking, in order to fulfill the requirements of a move, no mutable members should be defined. However, because we have been explicit in defining `value` as mutable, it theoretically makes sense to allow a `const` move constructor. That said, I have not found any reason for this as of yet, so it is good to know that `const` data will not be moved:

```text
Constructor
Const Move Constructor
```

## Move Operations and the STL (Standard Template Library)

If your code is making use of the STL (which it should), it’s a good idea to make sure your classes will play nicely.

Because the STL can still be used with C++ exceptions disabled, it’s important to notify the compiler when a move constructor or move assignment will not throw, i.e. when it is `noexcept`. When we forget to do this, some operations of the STL will fail to use move semantics — for example, the [`resize`][vector-resize] method of [`vector`][].

If we remove `noexcept` from our `Lifetime` move constructor:

```cpp
Lifetime(Lifetime &&other) {
  std::cout << "Move Constructor" << std::endl;
}
```

And then attempt a resize of a [`vector`][] of `Lifetime`s, then we will see the copy constructor is called:

```cpp
int main() {
  std::vector<Lifetime> temp;
  temp.emplace_back();
  temp.emplace_back();

  temp.resize(1);
  return 0;
}
```

Output:

```text
Constructor
Constructor
Copy Constructor
```

To avoid this, we always want to ensure we declare `noexcept` when we are sure the move constructor or assignment will not throw.

## RVO Has Been Used

Now, this is a good one. [RVO][rvo], or return value optimization, is an optimization the compiler is allowed to use to merge the copy or move. It will construct the object in the place of the assigned value. RVO is the one time where we don’t want to see a move operation, as it is more efficient than a move operation:

```cpp
Lifetime getLifetime() {
  Lifetime lifetime;
  return lifetime;
}

int main() {
  const auto localLifetime = getLifetime();
  return 0;
}
```

Output:

```text
Constructor
```

Now, if we ignored RVO, in the example above we’d expect to see both a constructor being called and a move or copy constructor placing the value into `localLifetime`. But RVO can perform its optimizations and construct a `Lifetime` object into `localLifetime` directly.

It’s important to note that this is not always the case, as RVO is up to the discretion of the compiler. However, most modern compilers will ensure RVO is used.

## Conclusion

In this post, we learned that move semantics may be deleted, `const`ness will prohibit move operations, `noexpect` is required for move semantics when using the STL, and RVO may be used instead of moving. It’s important to keep these points in mind when assuming that a move will be performed, as `std::move` doesn’t always mean a move will be performed.

Here at PSPDFKit, we’ve implemented [clang tidy][clang-tidy] as one of our many CI jobs, and it has many [checks][clang-tidy-checks] to ensure you are using move semantics correctly or optimizing when possible. It’s a great tool to pick up the slack when you forget rules at odd times.

[rvalue-references-and-move-semantics]: https://www.internalpointers.com/post/c-rvalue-references-and-move-semantics-beginners
[n3225]: http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2010/n3225.pdf
[rule-of-zero]: http://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-zero
[vector-resize]: http://www.cplusplus.com/reference/vector/vector/resize/
[`vector`]: http://www.cplusplus.com/reference/vector/vector/
[rvo]: https://en.wikipedia.org/wiki/Copy_elision#Return_value_optimization
[clang-tidy]: https://pspdfkit.com/blog/2018/using-clang-tidy-and-integrating-it-in-jenkins/
[std-move]: https://en.cppreference.com/w/cpp/utility/move
[clang-tidy-checks]: https://clang.llvm.org/extra/clang-tidy/checks/list.html
