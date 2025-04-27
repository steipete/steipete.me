---
title: "First-Class Swift API for Objective-C Frameworks"
description: "Objective-C and Swift interoperability with PSPDFKitSwift"
preview_image: /images/blog/2018/swifty-pspdfkit/article-header.png
section: blog
author:
  - Marcin Krzyżanowski
author_url:
  - https://twitter.com/krzyzanowskim
date: 2018-03-02 14:00 UTC
tags: Development, iOS, Swift, Tips
cta: ios
published: true
---

At [PSPDFKit](https://pspdfkit.com), we use Swift in almost all our projects. Our main SDK is written in Objective-C, but we can’t yet switch our SDK to Swift, both because we still have many customers using Objective-C, and because [Swift does not yet have a stable ABI](https://pspdfkit.com/blog/2018/binary-frameworks-swift/). While interoperability between Objective-C and Swift is already good, we decided to put in extra effort to make using our SDK from Swift a first-class experience, matching what Apple provides with its frameworks.

Today we’re introducing [PSPDFKitSwift](https://github.com/PSPDFKit/PSPDFKitSwift), a collection of wrappers to and extensions for the regular `PSPDFKit.framework`. This is an optional Swift extension that may be used on top of the binary framework we distribute.

### Swift’s Clang Importer

The [Objective-C](https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html) API in the [Swift](https://swift.org) world can feel a bit awkward. But Swift has a tremendous Objective-C importer, [ClangImporter](https://github.com/apple/swift/tree/master/lib/ClangImporter), which is used to import Objective-C (and C) code into Swift automatically. The tool is platform agnostic, yet there are plenty of [UIKit](https://developer.apple.com/documentation/uikit)/[AppKit](https://developer.apple.com/documentation/appkit)-specific rules based on the [Coding Guidelines for Cocoa](https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/CodingGuidelines/CodingGuidelines.html) naming conventions.

All the rules are described in a great e-book by Apple, [_Using Swift with Cocoa and Objective-C_](https://itunes.apple.com/us/book/using-swift-with-cocoa-and-objective-c-swift-4-0-3/id888894773?mt=11). In the book, you’ll find all the necessary tools to make the coexistence of Objective-C and Swift code a good experience.

In the following sections, let’s have a quick overview of what we use.

## Enums

We use `NS_ENUM` macro in Objective-C code, and this construction is automatically recognized by Swift, so it imports with the Swift enum type. For example, this:

```objc
typedef NS_ENUM(NSUInteger, PSPDFTabbedBarStyle) {
    PSPDFTabbedBarStyleLight,
    PSPDFTabbedBarStyleDark,
};
```

becomes this first-class Swift enum type:

```swift
enum PSPDFTabbedBarStyle : UInt {
    case light
    case dark
}
```

## Extensible Enums

A regular `enum` type is not an extensible type (in the sense that once it is defined, it cannot be extended with new options). In Swift, for example, we cannot extend enums with new cases — the same is true for enums in C, C++, and Objective-C. To provide a list of possible values, we often use constants.

Let’s take a look at this sample of possible PDF annotation types:

```objc
/// Available annotation types. Set in `editableAnnotationTypes` of `PSPDFConfiguration`.
typedef NSString *PSPDFAnnotationString NS_TYPED_EXTENSIBLE_ENUM;

/// Links and PSPDFKit multimedia extensions.
extern PSPDFAnnotationString const PSPDFAnnotationStringLink;
/// Highlight annotation. Can be used to highlight text.
extern PSPDFAnnotationString const PSPDFAnnotationStringHighlight;
/// Strikeout annotation. Can be used to strike through text.
extern PSPDFAnnotationString const PSPDFAnnotationStringStrikeOut;
```

In Swift, we’d instead use a `struct` with static properties. The struct type can be extended so that we can add more possible values when needed. Thankfully, we don’t have to use `PSPDFAnnotationStringLink` or `PSPDFAnnotationStringStrikeOut` constants from the Swift side. It’s enough to use `NS_TYPED_EXTENSIBLE_ENUM` (as shown in the example above) and Swift will recognize the pattern and import it as a Swift `struct` value type and use it like this:

```swift
  func useAnnotation(type: PSPDFAnnotationString) {
    /* ... */
  }

  useAnnotation(type: .caret)
```

## Blocks vs. Closures

In general, the Swift closure and Objective-C (or C) blocks are interchangeable, and Objective-C blocks are automatically imported as Swift closures with Objective-C calling conventions (attribute `@convention(block)`). But sometimes this isn’t enough.

In Objective-C, it’s possible to store a block as an `id` type, e.g. in a collection like `NSDictionary<String *, id>`. However, [that’s a trap](https://www.youtube.com/watch?v=4F4qzPbcFiA). If we store a Swift closure in the imported dictionary type, it will crash at the time we access the value.

According to [SR-6873](https://bugs.swift.org/browse/SR-6873?focusedCommentId=32128&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-32128):

> It’s an unfortunate limitation of id-as-Any that we can’t dynamically bridge ObjC blocks back and forth between closures if we don’t statically know that the elements are closures at compile time.

There is a workaround, but it has to be done on the Swift side. Declare the closure type with the `@convention(block)` and use it as a type:

```swift
// Replaces original Objective-C `PSPDFRenderDrawBlock`. See https://bugs.swift.org/browse/SR-6873
public typealias PSPDFRenderDrawBlock = @convention(block) (_ context: CGContext, _ page: UInt, _ cropBox: CGRect, _ rotation: UInt, _ options: [String: Any]?) -> Void
```

To cast an Objective-C block to the Swift world, simply unsafely bitcast the `AnyObject` Objective-C block to a Swifty Objective-C block:

```
let block: PSPDFRenderDrawBlock = unsafeBitCast(value, to: PSPDFRenderDrawBlock.self)
```

It’s as “easy” as that. Now you can store a `block` as an `Any` type for the Objective-C part of the codebase.

### Under the Hood

Under the hood, `NS_TYPED_EXTENSIBLE_ENUM` is a [Clang](https://clang.llvm.org/) attribute that instructs the compiler to use the `struct` (`swift_wrapper(struct)` attribute), while with the `NS_TYPED_ENUM`, the compiler is instructed to use the `enum` (`swift_wrapper(enum)` attribute). Regardless of their values, both are imported as Swift structs. Why? The attributes were designed on the Clang side, but then developers took a second look at the Swift side and realized that **enum** wouldn’t behave the way they wanted. Despite the fact that both are structs, code that takes an `NS_TYPED_ENUM` will crash if we use it with a *raw* value not defined for the *struct*, but `NS_EXTENSIBLE_TYPED_ENUM` will handle that scenario. That said, `NS_TYPED_ENUM` immutability is not compiler-enforced.

## Errors

We use enums for errors, and Swift 3 introduced the `NS_ERROR_ENUM` macro for that exact purpose. This can be used to declare an enum for the purposes of error handling:

```objc
export NSString *const PSPDFSignerErrorDomain;

typedef NS_ERROR_ENUM(PSPDFSignerErrorDomain, PSPDFSignerError) {
    PSPDFSignerErrorNone = noErr,
    PSPDFSignerErrorNoFormElementSet = 0x1,
    PSPDFSignerErrorCannotNotCreatePKCS7 = 0x100,
}
```

The use of errors imported from the `NS_ERROR_ENUM` macro may be not very intuitive at first glance, because the generated enum type does not conform to the standard [Swift.Error](https://developer.apple.com/documentation/swift/error) protocol. Instead, it conforms to the private `_ErrorCodeProtocol` protocol.

Here’s an example of how we use the custom type from Swift. Notice how the function throws an error. We initialize the `PSPDFSignerError` instance with the given error code and throw it, and then we catch it at the caller side:

```swift
func failableOperation() throws {
    throw PSPDFSignerError(.cannotNotCreatePKCS7)
}

func test() {
    do {
        try failableOperation()
    } catch PSPDFSignerError.cannotNotCreatePKCS7 {
        // handle error
    } catch {
        fatalError(error.localizedDescription)
    }
}
```

## Object Subscripting

Objective-C [object subscripting](https://clang.llvm.org/docs/ObjectiveCLiterals.html#object-subscripting) is a language feature that has been available since Xcode 4.4. We use it to build better APIs. Custom-keyed subscripting is added to your class by declaring and implementing these methods:

```objc
- (id)objectForKeyedSubscript:(id)key; // subscript getter
- (void)setObject:(id)obj forKeyedSubscript:(id)key; // subscript setter
```

Swift recognizes these methods and provides proper `subscript` methods for the class:

```swift
  class Dog {
    subscript(key: Any) -> Any?
  }
```

There is one caveat: To properly import getter and setter as subscripts, the types and nullability have to match. If the `key` argument declaration from `objectForKeyedSubscript:` doesn’t match the `key` argument declaration from `setObject:forKeyedSubscript:`, these methods won’t be imported as expected. The same applies to the `obj` argument, and this was exactly our case: The key was `id<NSCopying>` in the getter method and `id` in the setter method, which resulted in an unexpected translation.

## Refining for Swift

When adding type annotations alone is not enough to customize Objective-C APIs, we need stronger drugs: `NS_SWIFT_NAME` and `NS_REFINED_FOR_SWIFT` macros.

### Annotate with `NS_SWIFT_NAME`

The `NS_SWIFT_NAME` macro customizes how the declaration is imported.

Let’s consider the following declaration in Objective-C:

```objc
- (nullable NSString *)fileNameForPageAtIndex:(NSUInteger)pageIndex NS_SWIFT_NAME(fileName(forPageAtIndex:));
```

Before manual refinements, the function is imported as very generic and is hard to reason about:

```swift
func fileName(for: UInt) -> String?
```

By specifying the `NS_SWIFT_NAME` macro, we can add some verbosity to make the function clear so that it becomes the following:

```swift
func fileName(forPageAtIndex pageIndex: UInt) -> String?
```

### Annotate with `NS_REFINED_FOR_SWIFT`

The `NS_REFINED_FOR_SWIFT` macro modifies the declaration (makes it effectively private), so you can wrap it in a new function and call the private declaration from inside.

Let’s discuss another declaration from the PSPDFKit framework, `-[PSPDFDocument saveWithOptions:error]`:

```objc
- (BOOL)saveWithOptions:(nullable NSDictionary<PSPDFDocumentSaveOption, id> *)options error:(NSError *_Nullable *)error;
```

The method is automatically imported as a throwable function with dictionary-based options, where the dictionary value is an `Any` type:

```swift
open func save(options: [PSPDFDocumentSaveOption : Any]? = nil) throws
```

So far, we’ve leveraged documentation to describe possible option values. However, this doesn’t feel right in Swift. With the goal of making the API more Swifty, we can rewrite the saving method to make it type-safe. To do that, first we have to hide the current declaration (not implementation) with `NS_REFINED_FOR_SWIFT` by annotating the method declaration in the header file:

```objc
- (BOOL)saveWithOptions:(nullable NSDictionary<PSPDFDocumentSaveOption, id> *)options error:(NSError *_Nullable *)error NS_REFINED_FOR_SWIFT;
```

From now on, Swift’s Clang Importer will do some extra work and import the method as private, prepended with double underscore characters `__` — for example:

```swift
func __save(options: [PSPDFDocumentSaveOption : Any]? = nil) throws
```

This looks the same as an original import, except for the added prefix.

### Create a Method Wapper

On the Swift side, we can implement our wrapper and privately call the wrapper method:

```swift
extension PSPDFDocument {
    func save(options: [SaveOption]) throws {
        try __save(options: SaveOption.mapToDictionary(options: options))
    }
}
```

As you may notice, the wrapper uses slightly different arguments. We replaced dictionary-based options with the Swift `enum` type value that is mapped to the internal dictionary-based representation:

```swift
typealias SecurityOptions = PSPDFDocumentSecurityOptions

enum SaveOption {
    case security(SecurityOptions)
    case forceRewrite
}
```

The result of this is an API that is both verbose and compile-time verified:

```swift
let securityOptions = try PDFDocument.SecurityOptions(ownerPassword: "0123456789012345678901234567890123456789", userPassword: "0123456789012345678901234567890123456789", keyLength: 40, permissions: [.extract, .fillForms], encryptionAlgorithm: .AES)

try document.save(options: [.security(securityOptions), .forceRewrite])
```

## Integration Issues

In contrast to many other iOS frameworks you can find on GitHub, [the PSPDFKit SDK](https://pspdfkit.com) isn’t open source. Instead, we distribute it prebuilt in binary form. This does have some downsides, one of them being that our customers can’t affect the build product by changing compile-time settings or compiler flags.

This limitation affects the Swift integration as well. The helper macros used to refine the import declarations are built as custom [Clang attributes](https://clang.llvm.org/docs/AttributeReference.html), which means that changing helper macros only affects a new compile.

To change the Swift name from, say, `NS_SWIFT_NAME(fileName(forPageAtIndex:))` to `NS_SWIFT_NAME(pageIndexFileName(for:))`, the framework needs to be rebuilt. In our case, this means we need to release a new version of the library.

Things get even more complicated for `NS_REFINED_FOR_SWIFT`, which hides the declaration.

Let’s assume we deploy the Objective-C framework and our customers start using it in their Swift codebase. Later, after some time, we decide to provide a better Swift API. To do that, we start annotating the Objective-C declarations and add specialized wrappers. For the sake of backward compatibility, we can’t just hide the declaration of crucial methods, e.g. the `-[PSPDFDocument saveWithOptions:error]` call mentioned earlier. First of all, that’d be a breaking API change. Second of all, we just removed the possibility of saving documents.

We have to choose between one of two ways to address the problem.

- Either we have two frameworks and two builds — one with just the Objective-C API automatically imported by Swift without customization and refinements, and another one with just the Swift adjustments. That introduces a complication for us (our CI servers are already busy building a single release for few hours), and for our customers (What should I use? Why do I have two frameworks? What about updates?).
- Or, we just figure out how to annotate Objective-C declarations without the need for dealing with all the hassle.

After some investigation, we applied the latter approach. To see how we did it, read the [API Notes](#APInotes) section below.

Now’s the time to get a cup of tea before you read the next chapter. Enjoy!

## `NSUInteger` vs. `Int` and `typedef`

The [Swift documentation](https://developer.apple.com/library/content/documentation/Swift/Conceptual/BuildingCocoaApps/WorkingWithCocoaDataTypes.html) says the following:

> Objective-C platform-adaptive integer types, such as `NSUInteger` and `NSInteger`, are bridged to `Int`.

This is a case for system frameworks only. The non-system framework Objective-C `NSUInteger` is imported as `UInt`. That’s not very consistent with the Swift concept of having an `Int` as the ultimate integer type. The conversation about if `NSUInteger` should be automatically imported as an `Int` is [already older than a year](https://lists.swift.org/pipermail/swift-evolution/Week-of-Mon-20170130/031327.html), and we’re still looking for a better solution in this area.

It’s a bit worse if we combine this inconsistency with the [C `typedef`](https://en.wikipedia.org/wiki/Typedef) keyword, which is used to create an alias name for another type. For example:

```objc
typedef NSUInteger PSPDFPageIndex NS_SWIFT_NAME(PageIndex);
```

This is later used as a parameter type — for example, this:

```objc
- (nullable NSURL *)pathForPageAtIndex:(PageIndex)pageIndex;
```

is automatically imported to Swift as this:

```swift
func pathForPage(at pageIndex: UInt) -> URL?
```

Here’s what happened:

- `NSUInteger` is imported as `UInt`, not as `Int`
- `PSPDFPageIndex` is imported as `UInt`, not as `PageIndex`

The `PageIndex` could add the verbosity to the arguments, but unfortunately, it’s not working this way.

What can we do about it, aside from [one](https://bugs.swift.org/browse/SR-583) or [two bug reports](https://bugs.swift.org/browse/SR-6958)? We can **try** to mimick the `NSUInteger` type on the Objective-C side and create an alias:

```objc
#if __LP64__ || (TARGET_OS_EMBEDDED && !TARGET_OS_IPHONE) || TARGET_OS_WIN32 || NS_BUILD_32_LIKE_64
typedef unsigned long PSPDFPageIndex NS_SWIFT_NAME(PageIndex);
#else
typedef unsigned int PSPDFPageIndex NS_SWIFT_NAME(PageIndex);
#endif
```

It’s not the prettiest workaround, but it looks like it’s the closest to the problem of aliasing `NSUInteger` types.

Another issue is that although we [mimick the NSUInteger type](https://opensource.apple.com/source/objc4/objc4-706/runtime/NSObjCRuntime.h.auto.html), it’s recognized by the Swift compiler as a `UInt32` on a 32-bit platform rather than `UInt`. This may be another source of confusion.

Despite the fact that the generated interface is a proper `UInt`:

```swift
public typealias PageIndex = UInt
```

the error suggests it’s more like `UInt32`:

```
Cannot convert value of type 'UInt' to expected argument type 'PageIndex' (aka 'UInt32')
```

I’d like to add ¯\\_(ツ)_/¯ at this point as a comment, but I’m afraid it may be not be professional enough for this blog post 😅.

## API Notes

Swift API Notes is one of the barely documented (and no longer correctly documented) features you might never have heard of before. [As explained in the README](https://github.com/apple/swift/tree/master/apinotes):

> API notes provide a mechanism by which Objective-C APIs can be annotated with additional semantic information not present within the original Objective-C headers. This semantic information can then be used by the Swift compiler when importing the corresponding Objective-C module to provide a better mapping of Objective-C APIs into Swift.

We decided to give API Notes a shot to build our PSPDFKit Swift extensions.

API Notes is a textual file with a set of metadata interpreted by Swift’s Clang Importer without the need to rebuild the binary. In other words, it’s exactly the tool we need.

Here’s the plan:

- Create `.apinotes` metadata file.
- Inject it into the `PSPDFKit.framework` bundle.
- Write API refinements.
- Use `PSPDFKitSwift` linked with the `PSPDFKit.framework`
- Profit!

The file has to have the name of the [Clang module](https://clang.llvm.org/docs/Modules.html). This is the name used in the `.modulemap` file. Usually, it’s in the path:

```
Name.framework/Modules/module.modulemap
```

Create a text file named `PSPDFKit.apinotes` with the editor of your choice.

#### Inject API Notes

The next step is to put `PSPDFKit.apinotes` next to the framework’s headers directory, `PSPDFKit.framework/Headers`:

```
$ cp PSPDFKit.apinotes PSPDFKit.framework/Headers
```

That’s it. The API Notes file is properly installed.

#### Use API Notes

`PSPDFKit.apinotes` is a text file organized in [YAML](http://yaml.org/) format, like the sample below:

```yaml
---
Name: PSPDFKit
Classes:
- Name: PSPDFDocument
  Methods:
  - Selector: "saveWithOptions:error:"
    MethodKind: "Instance"
    SwiftPrivate: true
```

The above definition instructs Swift’s Clang Importer to mark a selector, `saveWithOptions:error:`, from the class `PSPDFDocument` as private. This is (more or less) an equivalent of `NS_REFINED_FOR_SWIFT` discussed earlier. And, it has the same effect, except for one minor thing: the private call with the `__` prefix won’t be available for Xcode auto-completion, nor will it be visible in the generated Swift interface header. The method is there, but it’s just not visible.

The most up-to-date documentation of the API Notes format can be found in [APINotesYAMLCompiler.cpp](https://github.com/apple/swift-clang/blob/ab7472e733a4081d672e2ef9a8e2011d941d1347/lib/APINotes/APINotesYAMLCompiler.cpp#L27), which describes how the format looks in general. However, it doesn’t cover all possible keys and values. Those can only be found by reading the C++ sources in the same file, e.g. `SwiftPrivate`, which we use in the example, is not documented in the source file. The `SwiftPrivate` option works like the previously mentioned `NS_REFINED_FOR_SWIFT`, in that it hides the selector.

There are more options that can be set in API Notes. We can find the trace of some in the Swift sources (or Swift tests), but the purpose and expected value are not clear for each key type. As such, I believe there is a need here for the proper documentation of the feature by Swift’s developers.

## Transient Module

The last feature I want to mention here is that of [module overlays](https://github.com/apple/swift/blob/master/docs/Modules.rst#module-overlays). Although the Swift documentation says that “This feature has mostly been removed from Swift,” don’t blindly trust everything you read in there. According to [Doug Gregor‏](https://twitter.com/dgregor79/status/957350852498374656):

> All of the magic used to bridge Objective-C classes to Swift value types is in that not-really-supported-but-unlikely-to-change-much grey area.

The module overlay is when your newly created framework **A** has **the same name** as the [Clang Module](https://clang.llvm.org/docs/Modules.html) **B** and your Swift source file imports and re-exports the module outside the module.

In source code, it looks like this:

```swift
@_exported import PSPDFKit
@_exported import class PSPDFKit.PSPDFKit
```

**`@_exported`** will make an imported module re-exported as if the imported symbols were part of the intermediate module. The intermediate module is logically placed between two other modules, which is why it’s called an overlay framework: It overlays the `@_exported` modules.

![ModuleA -> ModuleA(@_exported ModuleA) -> ModuleA(Final)](/images/blog/2018/swifty-pspdfkit/overlay-module.png)

Now you have to link your application with the overlay framework, and the re-exported module is automatically available. Why is this useful? It makes the extensions transparent. According to Dave DeLong, who recently demonstrated one use of overlay modules in the blog post [“Simplifying Swift framework development”](https://davedelong.com/blog/2018/01/19/simplifying-swift-framework-development):

> `@_exported` will make an `import`-ed module visible to the entire module into which its been imported. This means you don’t have to `import Dependency` in every file you need it. You just `@_exported` that dependency once, and you’re good to go in any file in that module.

## Conclusion

Building an SDK still means using Objective-C. If you can’t modify the dependent Objective-C framework source but you want to make the API more appealing for Swift, API Notes and module overlays seem like an interesting option. It’s not encouraged to modify system frameworks though. We shouldn’t interfere in the way that Clang Importer applies the [Objective-C to Swift migration](https://developer.apple.com/library/content/documentation/Swift/Conceptual/BuildingCocoaApps/Migration.html) rules.

No animals were harmed in the making of this post, but we had to fill out a few bug reports:

- [SR-6873](https://bugs.swift.org/browse/SR-6873) Can’t use Swift closure as ObjC block type (Any type)
- [SR-6958](https://bugs.swift.org/browse/SR-6958) ClangImporter ignore aliased Objective-C type name
- [SR-6935](https://bugs.swift.org/browse/SR-6935) Can’t call Objective-C generic class method from protocol extension.
- [SR-6705](https://bugs.swift.org/browse/SR-6705) Symbol with the name of the module overrides module namespace
- [SR-6731](https://bugs.swift.org/browse/SR-6731) PropertyListDecoder unable to decode `__NSCFType`
