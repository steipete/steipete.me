---
title: "Writing and Maintaining Good Code Documentation"
description: "Tips, tricks, and techniques for documenting your code the correct way."
preview_image: /images/blog/2019/writing-and-maintaining-good-code-documentation/article-header.png
section: blog
author:
  - Oscar Swanros
author_url:
  - https://twitter.com/Swanros
date: 2019-02-04 8:00 UTC
tags: iOS, macOS, Apple, Documentation
published: true
secret: false
---

Writing documentation is a practice that everyone working with code should strive to comply with. Since we ship an SDK here at PSPDFKit, providing good and clear documentation to our customers is as important to us as building the SDK itself.

In this post, I want to outline how we handle documentation for our iOS products and show how you can leverage the same techniques we’re using to make your life easier.

I’ll go over the basic building blocks of good documentation for iOS, discuss documenting API changes, tell you how you can publish your documentation to the public, and finally, talk about writing self-documenting code, all while sharing tips, tricks, and techniques along the way.

## Documentation for Apple’s Platforms

Xcode offers some nice syntax to document Swift or Objective-C code. Here’s a quick example of how it can be used in Objective-C:

```objc
/**
 General description of what this class does. This can be multiple paragraphs,
 and you can even include code samples to demonstrate how the API that this type encapsulates can be used.

 @code
 PSPDFGenericClass *object = [PSPDFGenericClass new];

 [object commitWithConfiguration:configuration];
 @endcode
 */
@class PSPDFGenericClass : NSObject

/// Documentation that requires only one line can be added with three forward slashes.
@property (nonatomic, readonly) NSString *identifier;

/**
 Documenting methods is especially great since there are other documentation
 attributes we can take advantage of.

 @param identifier	Describe what the first parameter represents, along with possible variations.
 @param	error		Keep your descriptions left aligned!

 @return @c BOOL indicating whether or not the process succeeded.
 */
- (BOOL)invokeWithIdentifier:(PSPDFIdentifier)identifier error:(NSError **)error;

@end
```

As you can see, the difference between the comments and the documentation block’s syntax is small (one extra `*` for multiline blocks, and one extra `/` for one-line documentation blocks). This should be a hint to you that there’s minimal extra effort with huge benefits when writing documentation.

Additionally, documenting the code this way not only makes Objective-C’s headers or Swift’s generated interfaces look really nice and professional, but it also augments your Xcode experience.

For example, have you tried Option-clicking a symbol in Xcode? You may have seen a little dialog that pops out with information related to the symbol you clicked on. If you use the above syntax, this contextual menu will now work with your own types as well.

In addition to the above, here are a couple more quick tips:

- Starting any documentation line with the `@brief` command in your documentation block will make that line appear at the top of the symbol documentation dialog.
- For Objective-C documentation, lines between `@code` and `@endcode` will be rendered as code blocks inside the Xcode documentation dialog. For Swift documentation, you can use backticks to achieve the same result.

If you have a Swift interface you want to document, the syntax varies only a little bit:

```swift
/**
 General description of what this class does. This can be multiple paragraphs,
 and you can even include code samples to demonstrate how the API that this type encapsulates can be used.

 ``​`
 let instance = PSPDFGenericClass(identifier: "Some Identifier")
 try? instance.invoke(with: "Another Identifier")
 ``​`
 */
class PSPDFGenericClass: NSObject {
    /// Documentation that requires only one line can be added with three forward slashes.
    private(set) var identifier: String

    /**
     Documenting methods is especially great since there are other documentation
     attributes we can take advantage of.

     - parameter identifier: Describe what the first parameter represents, along with possible variations.
     */
    func invoke(with identifier: String) throws {

    }
}
```

## Documenting API Changes

A good documentation resource also helps the user navigate through updating the code they may have interacted with previously.

When it comes to APIs, deleting or changing certain functionality without any notice is not good practice, and it can result in customer turnover. Offering a deprecation window before removing code our customers rely on is super important to us. And because the development of our SDK is so fast, we’re constantly deprecating API.

When a customer upgrades from an old version of PSPDFKit, they may see something like this:

![Deprecation Notice](/images/blog/2019/writing-and-maintaining-good-code-documentation/deprecation-notice.png)

You can achieve the same result for your own Objective-C API by using the following Clang attribute:

```objc
__attribute__((deprecated("Deprecated in v2 of the SDK. Please use PSPDFNewClass instead.")))
```

At PSPDFKit, we’ve defined a macro that makes things a little bit easier:

```objc
#define PSPDF_DEPRECATED(iOSVersion, macOSVersion, msg) __attribute__((deprecated("Deprecated in PSPDFKit " #iOSVersion " for iOS. " msg)))
```

Then, when we’re deprecating an API, we can just append the macro to our method declarations:

```objc
+ (PSPDFDocument *)generatePDFWithError:(NSError **)error PSPDF_DEPRECATED(7.6, 7.6, "Please use the new instance method-based API.")
```

Now, when the SDK is upgraded and the customer recompiles their project, they’ll see a nice compile-time warning that reads “Deprecated in PSPDFKit 7.6 for iOS. Please use the new instance method-based API.”

Things are a little bit different when you want to deprecate the Swift API, since Swift has availability attributes you can use to achieve the same goal:

```swift
@available(*, deprecated, message: "Deprecated in PSPDFKit 7.6 for iOS. Please use the new instance method-based API.")
class func generatePDF() throws -> PSPDFDocument
```

Using the `@available` attribute with the arguments above will have the same effect as the Clang attribute we used in the Objective-C example.

However, `@available` has some tricks up its sleeve. For instance:

- `@available(*, deprecated, renamed: "newMethodName")`
- `@available(*, deprecated: 7.1, obsoleted: 8, "This API is deprecated and will be removed in v8. Please move to the new API.")`

Keep in mind that the `@available` attribute is intended to work hand-in-hand with platform and language versions, and it is not platform-agnostic like the Clang attribute is.

You can learn more about the `@available` attribute (and others) in the official [Swift documentation][]. By using these attributes, you can accomplish a lot.

## Making Your Docs Public

At PSPDFKit, we use [jazzy][] to automatically export the documentation we write on our code to a familiar, Apple-like documentation page our customers can refer to at any time. We’ve also gone a step further to [add live search][] to our docs.

You can go to jazzy’s GitHub page to learn more about it, but in a nutshell, it is a handy tool that you can install with the following command:

```bash
[sudo] gem install jazzy
```

Then you can run `jazzy` from your project’s root folder to generate the documentation directory.

Jazzy has a bunch of configuration options to customize the generation of your documentation pages, and it is even smart enough to generate cross-referenced links to symbols within our own documentation.

From jazzy’s documentation:

- `MyClass` — a link to documentation for `MyClass`.
- `MyClass.method(param1:)` — a link to documentation for the given method.
- `MyClass.method(...)` — a shortcut syntax for the same thing.
- `method(...)` — a shortcut syntax to link to a method from the documentation of another method or property in the same class.
- `[MyClass method1]` — a link to an Objective-C method.
- `-[MyClass method2:param1]` — a link to another Objective-C method.

Jazzy will generate a folder with a bunch of HTML files that you can then upload to any static site host, even GitHub pages, and voilà, you’ve got yourself online documentation for your API.

## Writing Self-Documenting Code

Self-documenting code is something some languages aim for. The basic idea is that the code you write explains itself when you read it.

At first glance, a lot of people despise Objective-C because it feels overly verbose and complicated, and that turns off a lot of people who want to learn the language. While Swift mostly solves this through a more refined syntax, I think the verbosity of Objective-C is something to appreciate rather than look down on.

It could be easier (and totally acceptable, depending upon whom you ask) to write Objective-C as follows:

```objc
PSPDFObj *o = [[PSPDFObj alloc] init:@"Identifier" er:&er];

[o write:url];
```

However, I think we can all agree that it would be super stressful to work in a codebase that was as lazy as that.

In our case, when writing code for Apple platforms, ecosystem conventions push us to write expressive code that can truly communicate intent just by being read:

```objc
PSPDFObject *newObject = [[PSPDFObject alloc] initWithIdentifier:@"Identifier" error:&error];

[newObject writeDataToURL:url];
```

This is a quick example of how following platform standards can have (sometimes underappreciated) benefits that we only notice when we’re looking for them.

However, make no mistake: Writing expressive code that communicates intent is not a don’t-write-actual-documentation free pass.

If you’d like to explore self-documenting code best practices, I can refer you to this excellent article by John Sundell on [Writing self-documenting Swift code][].

## Conclusion

At PSPDFKit, we’ve learned the value of documenting everything as much as we can. This is really important for us since we:

- Ship an SDK.
- Have 30+ people working on the same codebase.
- Strive to move fast without breaking stuff.

However, we think documenting code shouldn’t just happen when an API is publicly accessible. We also document our private interfaces, and everyone working here is encouraged to add as many details as possible when writing new code, especially on those code paths that go around bugs or have special complicated considerations.

And of course, it’s always a good idea if comments include links to radars or discussions on Slack/GitHub about how an implementation decision was reached.

Finally, here are some quick points to take into consideration when thinking about documentation:

- Documentation and comments are cheap to add, and they have an extremely positive ROI for you and your team.
- Comment, explain, and cross-reference everything as much as you can.
- When explaining complicated topics, don’t hesitate to use tools like [Monodraw][] to augment your comments by adding ASCII art that can help you make your point more clearly and quickly. (We use this extensively for our internal documentation and, let me tell you, apart from being super useful, it’s also super fun.)
- Remember that code is read an order of magnitude more times than it is written.

[swift documentation]: https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/Attributes.html
[jazzy]: https://github.com/realm/jazzy
[add live search]: https://pspdfkit.com/blog/2016/adding-live-search-to-jazzy/
[writing self-documenting swift code]: https://www.swiftbysundell.com/posts/writing-self-documenting-swift-code
[monodraw]: https://monodraw.helftone.com
