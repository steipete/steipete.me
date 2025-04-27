---
title: "Failable Methods with Djinni"
description: "In this article, we have look at using result types to model failable computations in the Djinni IDL."
preview_image: /images/blog/2018/failable-methods-with-djinni/article-header.png
section: blog
author:
  - Daniel Demiss
date: 2018-03-29 12:00 UTC
tags: Development, iOS, Android, Djinni, C++, Objective-C, NDK
published: true
---

Different platforms have different error handling conventions. At PSPDFKit, we use a tool called Djinni to bind our shared C++ code to the platform-native development languages. Djinni, however, cannot differentiate between C++ exceptions and it does not support custom generic types.

In this post, we offer a workaround for these limitations using a convention and a C++ template to generate the implementation of various result types.

## What Is Djinni and Why Do We Use It

[Djinni](https://github.com/dropbox/djinni) is a project created by Dropbox that generates bridging code between different programming languages. It consists of an interface definition language (IDL), a code generator, and a small support library. At PSPDFKit, we use this tool to call into the C++ core we share across all the platforms our product supports: [iOS](/pdf-sdk/ios/), [Android](/pdf-sdk/android/), [macOS](/pdf-sdk/macos/), and — the newest addition to the family — [Windows](/pdf-sdk/windows/). You can read our post on “[A Pragmatic Approach to Cross-Platform](/blog/2016/a-pragmatic-approach-to-cross-platform/)” to learn more about the methods used.

While Objective-C has exquisite support for calling into C++, primitive data passed into C++ functions still needs to be bridged, a process that is tedious and prone to error when done manually. But it’s still great compared to Java, where you also have to use the [Java Native Interface (JNI)](https://docs.oracle.com/javase/7/docs/technotes/guides/jni/spec/jniTOC.html) to declare every function you may want to call. And if that’s not enough, you still need to marry your garbage-collected language to C++, which has manual memory management.

Now I’m not saying you cannot write this sort of bridging code manually, but for any bigger API, you really don’t want to if you can avoid it. Luckily, computers are quite good at performing menial tasks, and this is where Djinni comes in.

Use the IDL to declare the function calls of your API and the types that make up the signature of those calls — including documentation/implementation comments. Feed those IDL files to the code generator, telling it what languages you need, and Djinni will generate all the glue code for you.

Alongside various built-in types for fixed-size (signed and unsigned) integers, blobs, strings, sets, and arrays, Djinni supports three different kinds of custom types for you to declare:

- algebraic types —  aka enums, declared using their more common moniker, `enum`
- product types — values comprised of any number of fields, declared using the `record` keyword
- reference types — objects that have methods, declared using the `interface` keyword

For Djinni, `enum` and `record` declarations are _concrete_: Once you’ve added the generated files to your project, you can use these types straight away from your platform of choice. Any `record` that consists only of other concrete types can even have equality tests generated.

The interesting bits are, however, the `interface` declarations. They are _abstract_, and their declarations specify the language(s) in which the concrete type(s) will actually be implemented. Again, Djinni generates the necessary translations/bridging code for you, along with the declarations for your platform languages. These are:

- Objective-C header files containing the `@protocol` and `@interface` declarations, as well as Objective-C++ files containing the bridging code
- Java `interface` declarations, C++ files containing the JNI bridging functions, and (abstract) Java classes that bind to those bridging functions
- C++ header files containing purely `virtual` C++ `class` declarations, and more glue code as necessary

If this is the first time you’ve read something about Djinni, the above is likely a lot to process at once, so let’s look at an example that uses all of these parts.

Assume that you are a bank. Your app should show actual currency conversions, and in addition to the base conversion rate, there are a variety of fees involved depending on both the amount of money your customers want to convert, and between which currencies they want to do this conversion.

As a bank, you do not care which platforms your customers use to initiate a transaction. And in effect, the rules that determine the cost of the transaction are identical on all your supported platforms — so why not share the implementation?

For now, let’s ignore how to create a new currency converter object with the current rules/rates. Your Djinni file for this scenario would then look somewhat like the following:


```
# The currency converter converts monetary amounts from its currency to any other supported currency.
# We’ll implement it in C++
CurrencyConverter = interface +c {
    # Converts the amount to the specified currency.
    # Does not change the internal state of the converter, and always succeeds
    const convert(amount: Amount, to_currency: Currency): Amount;
}
# Models a monetary amount
# In contrast to the interface above, which we need to implement manually, Djinni will turn the following into fully usable code.
Amount = record {
    # value in the currency’s least significant unit — e.g cents for EUR, USD, …
    units: i64;
    # the currency this amount is in — defines how many fraction digits are needed for conversion, display, etc.
    currency: Currency;
}
# List of supported currencies
# Field names are ISO currency codes
# Just as it did with the record above, Djinni will turn the following into fully usable code.
Currency = enum {
    EUR;
    USD;
    IRP;
    …
}
```

When we save the above as `CurrencyConverter.djinni` and feed that file into the Djinni command line tool with a bunch of options, we end up with the following Objective-C types:

```objc
/**
 * The currency converter converts monetary amounts from their currency to any other supported currency.
 * We’ll implement it in C++
 */
@interface CurrencyConverter : NSObject

/**
 * Converts the amount to the specified currency.
 * Does not change the internal state of the converter and always succeeds
 */
- (nonnull Amount)convert:(nonnull Amount *)amount toCurrency:(Currency)currency;

@end

/**
 * Models a monetary amount
 * In contrast to the interface above, which we need to implement manually, Djinni will turn the following into fully usable code.
 */
@interface Amount : NSObject

- (nonnull instancetype)initWithUnits:(int64_t)units currency:(Currency)currency;

+ (nonnull instancetype)amountWithUnits:(int64_t)units currency:(Currency)currency;

/** value in the currency’s least significant unit — e.g cents for EUR, USD, … */
@property (nonatomic, readonly) int64_t units;

/** the currency this amount is in — defines how many fraction digits are needed for conversion, display, etc. */
@property (nonatomic, readonly) Currency currency;

@end

/**
 * List of supported currencies
 * Field names are ISO currency codes
 * Just as it did with the record above, Djinni will turn the following into fully usable code.
 */
typedef NS_ENUM(Currency, NSInteger) {
    CurrencyEUR,
    CurrencyUSD,
    CurrencyIRP,
    …
}
```

As you see, the comments are preserved and we have two classes — one for the `record`, and one for the `interface` that Djinni generated for us. Objective-C has no complex value types, so an immutable class is the thing that most closely resembles value semantics. Just make a new object when you need to change something. And because the `CurrencyConverter` uses our C++ code under the hood, this class could be generated too.

Java isn’t my strong suit, but I shouldn’t hide those results from you either. Comments are preserved in the generated `.java` files, but for the sake of brevity, I’ll omit them here (along with the implementations and other non-`public` details):

```java

package something.something.jni;

public enum NativeCurrency {
    EUR,
    USD,
    IRP,
    …
}

public final class NativeAmount {
    public NativeAmount(long units, NativeCurrency currency);
    public long getUnits();
    public NativeCurrency getCurrency();
    @Override
    public String toString();
}

public abstract class NativeCurrencyConverter {
    @NonNull
    public abstract NativeAmount convert(
        @NonNull NativeAmount amount,
        NativeCurrency currency);
}
```

This is all fine and dandy, but there are a couple of problems with this API:

1. Setup of the currency converter requires either a type for the conversion table or two-phase initialization.
1. Every change to the conversion table requires touching Djinni and recompiling.
1. If we use a type for the conversion table, parsing the data that populates the conversion table needs to be duplicated on each platform.
1. If we use two-phase initialization, the second initialization phase can be forgotten.

This isn’t a real problem for initial use: Crashing at a programmer error is kind of acceptable and would be caught in testing. But it’s not absurd to call this setup method again when newer data is available — then we’ll have an intact yet _stale_ table. And that could lead to more subtle bugs.

Let’s try to use Djinni’s `optional` feature to solve this. Instead of glossing over initialization, we use a factory method that takes the data necessary to build the conversion table and returns an `optional<CurrencyConverter>`. That way, we don’t have to duplicate the parsing code on each platform — we can do that all in C++ — _sweet_!

And while we’re at it, let’s replace our `enum` with the ISO currency code as a `string`! That way, supporting a new currency or removing one is as easy as loading a new conversion table from our server and making a new instance of our `CurrencyConverter`. Our new `.djinni` file (minus comments) would look like this:

```
CurrencyConverter = interface +c {
    static create(conversion_table: data): optional<CurrencyConverter>;
    const convert(amount: Amount, to_currency_code: string): optional<Amount>;
}
Amount = record {
    units: i64;
    currency_code: string;
}
```

This solves the parsing duplication, but it creates new problems. Conversion can fail for various reasons now. Maybe the amount we passed in used an invalid currency code, or maybe the currency code we should convert to is invalid. After all, this will most likely be data that the user put in, and that need not be [valid, or benign](https://www.xkcd.com/327/). And then there’s the case where all the inputs are, in fact, valid, but the current conversion table just doesn’t contain an entry for this conversion.

All of these cases _should_ somehow be communicated to the user.  However, `optional` doesn’t convey these reasons at all!

## Handling Errors on Different Platforms

Different platforms have different conventions to signal errors, and one platform can even have several different conventions, depending on the codebase you are working on.

Perhaps the clearest situation is in Objective-C: If your method or function can fail, you have an `NSError **` parameter. In case of an error, this pointer is populated with an object that tells you what went wrong. Swift calls this idiom `throws` and treats it _slightly_ differently, but under the hood, Swift compiles calls to throwing functions to pretty much the same processor instructions.

In Java, errors are commonly signaled by throwing an exception — where the type of the exception tells you a lot about what went wrong, and the exact subtype of exception can define arbitrary additional data. But if you are using something like RxJava, errors can also be signaled using some generic kind of `Result` type that holds either a value or an error.

In C++, things are a bit more complex. There are various norms out there in the wild. But exceptions are definitely an option that could be used with Djinni — at least theoretically.

## How Djinni Handles C++ Exceptions in the Objective-C Bridge

So far I have glossed over how Djinni bridges calls from one language to another. This is where we have to get into the gory details and inspect the generated bridging code. Since I am an iOS developer, I do not know the innate details of JNI, and since Objective-C has the easiest time calling into C++, let‘s dive into the generated `CurrencyConverter+Private.mm`, which is where the magic happens:

```objcpp
@implementation CurrencyConverter {
    /* gory C++ type declaration */ _cppRefHandle;
}

+ (nullable CurrencyConverter *)create:(nonnull NSData *)conversionTable {
    try {
        auto objcpp_result_ = ::CurrencyConverter::create(::djinni::Data::toCpp(conversionTable));
        return ::djinni_generated::CurrencyConverter::fromCpp(objcpp_result_);
    } DJINNI_TRANSLATE_EXCEPTIONS()
}

- (nullable Amount *)convert:(nonnull Amount *)amount toCurrency:(nonnull NSString *)to_currency {
    try {
        auto objcpp_result = _cppRefHandle.get()->convert(::djinni_generated::Amount::toCpp(amount), ::djinni::String::toCpp(to_currency));
        return ::djinni_generated::Amount::fromCppOpt(objcpp_result_);
    } DJINNI_TRANSLATE_EXCEPTIONS()
}

@end
```

If you are not that much into C++, this may be somewhat off-putting. The key aspects are:

- Each Objective-C object has a handle to the C++ class it adapts.
- There are C++ functions to convert between the types used for C++ and Objective-C.
- Every call into the C++ code is wrapped in a `try`-block, followed by an ominous macro invocation.

If we look into the definition of this macro and the function it uses, we find the following code:

```cpp
#define DJINNI_TRANSLATE_EXCEPTIONS \
    catch (__unused const std::exception & e) { \
        ::djinni::throwNSExceptionFromCurrent(__PRETTY_FUNCTION__); \
    }

namespace djinni {
[[noreturn]] __attribute__((weak)) void throwNSExceptionFromCurrent(const char *) {
    try {
        throw;
    } catch (const std::exception & e) {
        NSString *message = [NSString stringWithCString:e.what() encoding:NSUTF8StringEncoding];
        [NSException raise:message format:@"%@", message];
        __builtin_unreachable();
    }
}
}
```

Translated into English:

When Djinni encounters an uncaught `std::exception` (or an instance of any subtype) during a call into C++, it catches the exception and turns it into an `NSException`. Any specificity that may have been there is lost! The situation in Java is essentially the same, so this doesn’t help us either.

## How about a Result Type?

Result types are a great tool! Typically, they rely on generics — which Djinni doesn’t generally support. And unfortunately, Djinni cannot fake them by just combining names either.

But nothing can keep us from declaring a new type in Djinni — so let’s add a `record` that has an optional `amount` and an optional `error`. All of a sudden, we have two invalid invariants that a static analyzer might warn about.

OK, let’s try the following:

```
AmountResult = interface +c {
    const is_error(): bool;
    const value(): Amount;
    const error(): Error;
}
```

This would work! As long as we have just this simple API, it’s also not that much to do. But if we had a more complex application, this would get tedious and require a lot of boilerplate — or would it?

## C++ Templates to the Rescue!

C++ templates are — in certain aspects — more like preprocessor macros: they are _very_ flexible. Taken to the extreme, you can end up with code that is hard to read and nigh impossible to debug.

We’re not going to be this extreme, but we’ll (ab?)use the fact that — in contrast to how generics work in other languages — a C++ template parameter can be used as the superclass of a generic type. Now, this is code you probably shouldn’t write _regularly_; if you use the template incorrectly, you’ll be facing the “funniest” compiler errors.  

But if your Djinni interfaces for result types follow the same conventions as the `AmountResult`, a template makes implementing them a breeze. These conventions are:

1. There is a Djinni type that conveys what went wrong in case of an error, which is the non-optional return type of the `error()` getter.
2. There is a Djinni type for the value in case of success, which is the non-optional return type of the `value()` getter. (Failable `void` methods can be implemented more succinctly by returning an optional error.)
3. There is a getter that lets you check which of the two getters above should be called.

So without further ado, here’s a C++ template that implements all of these types for you:

```cpp
template<typename V, typename E, typename DjinniInterface>
class Wrapper : DjinniInterface {
public:
    using ValueType = V;
    using ErrorType = E;
    /// Preferred way of wrapping an error for returning it from failable Djinni method
    static wrap(ErrorType error) {
        return nn_make_shared<Wrapper>(error);
    }

    /// Preferred way of wrapping a value for returning it from failable Djinni method
    static wrap(ValueType value) {
        return nn_make_shared<Wrapper>(value);
    }

    Wrapper() = delete; /// Empty constructor mustn’t be available
    Wrapper(ValueType value) : mValue{value}, mError{std::experimental::nullopt} {}
    Wrapper(ErrorType error) : mValue{std::experimental::nullopt}, mError{error} {}

    bool isError() override const { return !!mError; }
    ValueType value() override const { return *mValue; }
    ErrorType error() override const { return *mError; }

private:
    const std::experimental::optional<ErrorType> mError;
    const std::experimental::optional<ValueType> mValue;
};
```

When implementing the `convert(amount: Amount, to_currency_code: string)` method from our example above, the result can be packaged as follows:

```cpp
nn_shared_ptr<AmountResult> CurrencyConverterImpl::convert(const nn_shared_ptr<Amount>& amount, const std::string& to_currency_code) const {
    using Impl = Wrapper<Amount, Error, AmountResult>;
    auto maybeConverter = getConverterForCurrency(amount->currencyCode);
    if (!maybeConverter) {
        return Impl::wrap(unsupportedSourceCurrency(amount->currencyCode));
    } else if (!maybeConverter->canConvertTo(to_currency_code)) {
        return Impl::wrap(unsupportedDestinationCurrency(to_currency_code));
    }

    try {
        return Impl::wrap(Amount{maybeConverter->convert(amount->units, to_currency_code)});
    } catch (const std::overflow_error& e) {
        return Impl::wrap(conversionOverflows(amount, to_currency_code));
    }
}
```

## Conclusion

Even conceptually simple systems, such as our currency converter example, cannot guarantee that _all_ the operations they offer will succeed _all the time_. Therefore, sharing business logic across different platforms and programming languages typically needs a way to pass identifiable errors across the platform/language boundary. While Djinni takes away the pain of manually bridging calls at the interface between C++ and Objective-C or Java, it does not offer a built-in mechanism for immediate computations that can fail. (An asynchronous API does not suffer from this problem; it can use separate callbacks to distinguish between a success case and an error case.)

In this article, we have taken a closer look at result types to model failable computations in the Djinni IDL. We have also presented a strong convention to mitigate the limitations of Djinni’s support for generics in this use case without sacrificing type-safety. Lastly, we have provided a C++ template to implement _all_ possible result types that follow this convention.
