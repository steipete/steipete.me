---
layout: post
title: "Calling Super at Runtime in Swift"
date: 2020-06-10 17:00:00 +0200
tags: highlights
image: /assets/img/2020/calling-super/Xcode-debug.png
---

While working on [InterposeKit](https://interposekit.com/), I had a rather specific need: Create an implementation that simply calls `super`, but at runtime instead of at compile time. Doesn’t sound so hard, does it? Well, here we go again.

## How Does Super Work?

Let’s say you have an empty `UIViewController` subclass and override `viewDidLoad` like this:

```swift
override func viewDidLoad() {
     super.viewDidLoad()
}
```

Simple enough! What the compiler creates for you is something along these lines:

```swift
 - (void)viewDidLoad {
     struct objc_super _super = {
         .receiver = self,
         .super_class = object_getClass(obj);
     };
     objc_msgSendSuper2(&_super, _cmd);
 }
 ```

In compiled code, there’s a lookup table so that `object_getClass` doesn’t need to be called, but you see the principle. A struct is created, and `objc_msgSendSuper2` is called with it. The method is automatically dynamic, since UIKit is written in Objective-C, so the Swift compiler knows it needs to use dynamic dispatch.

## objc_msgSendSuper vs. objc_msgSendSuper2

There are two versions of the `super` call, and the difference is minor but important: `objc_msgSendSuper` starts looking for an implementation of the selector at the current class, which would cause an endless loop in the above code, while `objc_msgSendSuper2` looks for the superclass.

With `objc_msgSendSuper` it is possible to skip multiple overridden implementations and directly target what you want to call. `objc_msgSendSuper2` is better tailored for a dynamic lookup, as it always fetches the superclass at runtime, so this even calls the correct `super` implementation if the class hierarchy is changed at runtime.

I’ve seen the compiler only emit `objc_msgSendSuper2`, but both need to be there forever, as they are both ABI.

## Being the Compiler

Calling `super` seems fairly straightforward! Fill the struct, call the method, done — right? There are however a few problems with that.

For one, while `objc_msgSendSuper` is in the `objc/message.h` header, the -2 version is not included in the public headers of the runtime. It is not private API, since Clang creates these calls. The runtime is also [open source](https://opensource.apple.com/source/objc4/objc4-493.9/runtime/objc-abi.h), so we can copy the header and call it:

```objc
// https://opensource.apple.com/source/objc4/objc4-493.9/runtime/objc-abi.h
OBJC_EXPORT id objc_msgSendSuper2(struct objc_super *super, SEL op, ...);
class_addMethod(clazz, selector, imp_implementationWithBlock(^(__unsafe_unretained id self, va_list argp) {
        struct objc_super super = {
            .receiver = self,
            .super_class = class_getSuperclass(clazz)
        };
        return ((id(*)(struct objc_super *, SEL, va_list))objc_msgSendSuper2)(&super, selector, argp);
    }), types);
```

This works, and [we’ve been shipping code](https://pspdfkit.com/blog/2019/swizzling-in-swift/) like this for a while. For InterposeKit, I wanted to write the same in Swift.

**Update:** Marcel correctly pointed out that I am mixing up `va_arg` and `va_list`, which are absolutely not the same. 

Compare the two definitions of `printf`:

```
int printf(const char * restrict format, …);
int vprintf(const char * restrict format, va_list ap);
```

It is possible to convert the first version into the second (via `va_start`), but not vice versa. So this code as-is works by pure luck.

## Super in Swift

An additional goal was to be “pure” Swift, not because I’m a purist, but because SwiftPM doesn’t yet support mixed language projects.[^4] We can’t write a C header to import `objc_msgSendSuper2`, but we sure can look it up at runtime:

[^4]: SwiftPM supports [multiple modules](https://medium.com/@joesusnick/swift-package-manager-with-a-mixed-swift-and-objective-c-project-part-2-2-e71dad234e6), so things can be split up. There are also plans to lift this limitation eventually.

```swift
let handle = dlopen(nil, RTLD_LAZY);
let sendSuper2 = dlsym(handle, "objc_msgSendSuper2");
```

This works, and it’s a [common trick](https://gist.github.com/neonichu/dcf49b26a2742404d8f1) to avoid C headers — it’s slightly slower, but as long as you cache the result, it should be hardly measurable:

```swift
let block: @convention(block) (AnyObject, va_list) -> AnyObject = { obj, vaList in
    let raw = Unmanaged<AnyObject>.passUnretained(obj)
    // https://bugs.swift.org/browse/SR-12945
    let superStruct = objc_super.self(receiver: raw, super_class: subclass)
    return withUnsafePointer(to: superStruct) { superStructPointer -> AnyObject in
        return unsafeBitCast(sendSuper2, to: (@convention(c) (UnsafePointer<objc_super>, Selector, va_list) -> AnyObject).self)(superStructPointer, self.selector, vaList)
    }
    // Equivalent in C:
    // return ((id(*)(struct objc_super *, SEL, va_list))objc_msgSendSuper2)(&super, selector, argp);
}
```

But this doesn’t compile. The Swift compiler crashes in various flavors, which I reported with examples. Since InterposeKit is small, they should be useful to reproduce:

- [SR-12945: Abort Trap 6 when creating objc_super struct](https://bugs.swift.org/projects/SR/issues/SR-12945)
- [SR-12944: Segmentation fault: 11 when parsing KVO](https://bugs.swift.org/projects/SR/issues/SR-12944)
- [SR-12950: Compiler crash while merging swiftmodule in DeclSerializer, Illegal instruction: 4](https://bugs.swift.org/projects/SR/issues/SR-12950)

I found a [cursed workaround](https://github.com/steipete/InterposeKit/pull/15/commits/e8a63b89247e2e09e5659e9f83b02d0bc5300605#diff-badbaddeef03b9400d4aedb5a90403d3R105-R109), and indeed the `super` call logic works. However, someone on the internet quickly told me that I’m wrong.

{% twitter https://twitter.com/gparker/status/1269694143543955456 %}

Greg worked on the Objective-C runtime for many years, so if he tells you something is only working by “blind luck,” it’s not something you should ship. He also has a [really interesting blog called Hamster Emporium](http://www.sealiesoftware.com/blog/), if you’re into understanding low-level things.

## Casting Objective-C Message Sends

The thing I got wrong is something many folks struggled with: The function looks like it takes a `va_list`, but it really doesn’t. This problem caused enough issues that Apple changed[^1] the method signature of both `objc_msgSend` and `objc_msgSendSuper` with the release of Xcode 11:

[^1]: `OBJC_OLD_DISPATCH_PROTOTYPES` has been an option for many years, but Apple only recently changed the default.

```c
#if !OBJC_OLD_DISPATCH_PROTOTYPES
OBJC_EXPORT void objc_msgSend(void /* id self, SEL op, ... */ )
OBJC_EXPORT void objc_msgSendSuper(void /* struct objc_super *super, SEL op, ... */ )
#else
OBJC_EXPORT id _Nullable objc_msgSend(id _Nullable self, SEL _Nonnull op, ...)
OBJC_EXPORT id _Nullable objc_msgSendSuper(struct objc_super * _Nonnull super, SEL _Nonnull op, ...)
#endif
```

Previously, it was declared as a function that took `id`, `SEL`, and variadic arguments, returning `id` — now it takes and returns `void`. Why the change? 

The short version is that there is no guarantee that the ABI for variadic function matches the ABI for a function with a mixed number of arguments. In the ARM64 ABI, [variadic arguments are passed on the stack](https://blog.nelhage.com/2010/10/amd64-and-va_arg/). However, Apple changed the way message sending works in ARM64 to not use the variadic ABI anymore, instead using the regular function-calling ABI. 

Without casting, even a trivial use of `objc_msgSend` will result in a crash. There is an interesting article about this by Mike Ash entitled [objc_msgSend’s New Prototype](https://www.mikeash.com/pyblog/objc_msgsends-new-prototype.html). Mike’s blog is brilliant, and I’m extremely happy that he still writes new posts from time to time, despite now working at Apple.

## Accepting Assembly

The root problem is that `objc_msgSend` cannot be implemented in C, not at any speed.[^7] We cannot build dynamic parameter lists. Usually the compiler takes care of casting `objc_msgSendSuper` for us, but this isn’t something it can do when we try to do this at runtime. The only way to call this correctly without getting lucky is if we write the call in assembly.

[^7]: The old GNU runtime used `objc_lookup(receiver-class, SEL)(receiver, SEL, …)`, a different approach altogether.

First of all, [assembly is hard](https://twitter.com/steipete/status/1270035179424399360?s=21), but it’s a useful skill that will make you better at debugging, so I’ve approached this entire thing as a “fun“ challenge. The most important part to know is what each register does. To keep things simple, we focus on ARM64 in this article, and we’re using the AT&T[^8] syntax.

[^8]: Yes, there are [two concurring syntax branches](https://en.wikipedia.org/wiki/X86_assembly_language#Syntax). Intel syntax is popular in the DOS and Windows world, and AT&T syntax is for Unix. AT&T is source before destination, while Intel is destination before source.

![Me trying to make sense of this via drawing](/assets/img/2020/calling-super/arm64-registers.jpg) 

**Caller-saved registers** (“clobbered”) are registers you can freely work with and use as temporary variables. It’s normal that a call writes temporary values into these registers. Some of them (specifically `x0-x7`) are used to transport parameters when calling other functions.

**Callee-saved registers** (“call-preserved”) are registers that are expected to stay the same after your function returns. The best idea is to simply not touch them.[^3]

[^3]: There’s no need to deal with this register type for our code here, but compilers sure use these. There’s a good [answer on Stack Overflow](https://stackoverflow.com/questions/9268586/what-are-callee-and-caller-saved-registers) that explains this in more detail.

There are some other special registers, such as the **`fp` frame pointer** (usually an offset of the stack pointer), the **`lp` link register** (holds the address to return to when a function completes), and the **`sp` stack pointer** (holds the address of the stack buffer).

There are also floating-point registers (`q0`–`q7`), but we don’t need them for our task here.

## Assembly and Swift

[Unlike Rust](https://twitter.com/josh_triplett/status/1270104436552024065?s=21), Swift doesn’t yet have a way to add inline assembly. Both have the approach to be a system language, and there are [hacks to get inline assembly](https://twitter.com/aalonso128/status/1080985173515214849?s=21) working, but I haven’t seen an evolution proposal so far.

Adding inline assembly is a niche feature, but it has valid use cases; even Chris Lattner [is hoping that](https://forums.swift.org/t/a-proposal-for-inline-assembly/4643/4) a future version of Swift will include it. For now, we can use C and the Swift/Obj-C interop to write assembly.

## Perfectly Forwarding Arguments 

Back to calling `super`: The goal is to perfectly forward all arguments from the caller to `objc_msgSendSuper2`, while also changing the first argument from `self` to `struct objc_super`, and potentially also filling this struct. Sounds easy enough!

My first inspiration was [SGVSuperMessagingProxy](https://github.com/sanekgusev/SGVSuperMessagingProxy/blob/master/Pod/Sources/Common/TrampolineMacros.h). This uses an extremely clever trick of creating a proxy at runtime with exactly one ivar, which is the prefilled `super` struct. So the trampoline boils down to this:

```c
__attribute__((__naked__)) \
void trampolineFunction(void) { \
asm volatile ("add " #selfLocation ", " #selfLocation ", #" #offset "\n\t" \
"b " #msgSendSuperFunction "\n\t" \
: : : "x0", "x1"); \
}
```

## Class Variable Layout

What this code here so cleverly does is that it simply adds eight bytes to the location of `self`. The layout of classes looks like this:

Class Memory Layout: [[ISA] \[IVARs]]

Remember, in ARM64, the caller arguments are in `x0` to `x7`. `x0` here is the pointer to `self`, the class object, which is where the isa pointer is located. isa means “is a.” Every Objective-C object (including every class) has an isa pointer as first variable.[^2] If we increment by 64-bits = 8 bytes, we get to the next storage location, which is where the object variables (ivars) are stored.

[^2]: Swift uses the same concept, but it has a second variable in there, so the offset would be 16. SGVSuperMessagingProxy works with any function marked as dynamic, not just Objective-C. Pretty amazing to see how new things still map to old concepts!

This is what the assembly looks like without calling boilerplate:

```
add x0, x0, 8
b objc_msgSendSuper2
```

This is *beautiful*, since it’s very simple, and it doesn’t touch any of our calling registers — with the exception of the one that needs to be changed. This doesn’t work in my case though — the goal was to create a `super` call in an existing class hierarchy, not via creating a new proxy where we have exact control of the memory layout. 

## Trampolines Explained

In other architectures, we would just generate the assembly on the fly, changing the offset as needed. Having memory pages that are both writable (`PROT_WRITE`) and executable (`PROT_EXEC`) requires a dynamic-codesigning entitlement from Apple, which is something only very few system processes, such as JavaScriptCore, get — certainly not a third-party app. And while [there are ways around this](https://saagarjha.com/blog/2020/02/23/jailed-just-in-time-compilation-on-ios/), jailbreaking or attaching a debugger aren’t realistic if we want to ship this.

Another solution is that of trampolines. The basic principle is that you have two pages next to each other with a fixed offset and a large number of entry points for your implementation:

```
               ┌───────────────────┐
            ┌──┤Trampoline Entry 1 │ 0x1000 Read, Execute
            │  ├───────────────────┤
            │  │Trampoline Entry 2 │ 0x2000 Read, Execute
 base + 0x3000 ├───────────────────┤
  (fix offset) │Trampoline Entry 3 │ 0x3000 Read, Execute
            │  ├───────────────────┤
            └─▶│Trampoline Data #1 │ 0x4000 Read, Write
               ├───────────────────┤
               │Trampoline Data #2 │ 0x5000 Read, Write
               ├───────────────────┤
               │Trampoline Data #3 │ 0x6000 Read, Write
               └───────────────────┘               
```

With a fixed offset, we can reach the corresponding data from the entry, and we can read variables as needed. This is how `imp_implementationWithBlock` works, and luckily it’s also [open source](https://github.com/0xxd0/objc4/blob/master/objc4/runtime/objc-block-trampolines.mm) — but there be [dragons](https://twitter.com/steipete/status/1269912889097363457?s=21). Landon Fuller [reimplemented this](https://landonf.org/code/objc/imp_implementationWithBlock.20110413.html) back when it was introduced in iOS 4.3, and he explains the principles really well.

## Tail Calling

There’s a lot of logic required to correctly manage tables, and things need locking to make the code thread-safe. I decided that this is gonna be the backup plan and tried a more direct approach to just fetch everything at runtime.

The principle: We save the registers that we might spill, fill the struct at runtime, restore the registers, and then perform the tail call. This sounds simple now that I write it up, but it caused serious headaches at first. 

Specifically, I tried to use the stack to generate the struct, which breaks stack-based parameter passing. I tried calling `malloc` in `asm`, but since that requires calling `free`, I couldn’t do the tail call optimization anymore. And I encountered oh so many crashes because I didn’t really understand what it means to align the stack pointer on 16 bytes.

Let’s start by saving registers:

```
// push {x0-x8, lr} (call params are: x0-x7)
"stp x8, lr, [sp, #-16]!\n" // lr = link register
"stp x6, x7, [sp, #-16]!\n"
"stp x4, x5, [sp, #-16]!\n"
"stp x2, x3, [sp, #-16]!\n" // push x3, then x2
"stp x0, x1, [sp, #-16]!\n" // push x1, then x0
```

`stp` saves a pair of registers (2*8=16 bytes) on the stack, and it also automatically decrements the stack pointer. The stack on most architectures grows downward from max to 0, so via decrementing, we reserve memory:

```
// fetch filled struct objc_super, call with self + _cmd
"bl _ITKReturnThreadSuper \n"
```

`bl` means “branch with link,” and it calls a function — in this case, a C function. The same call arguments exist here, so the first parameter will be `self`, and the second will be `_cmd`. `bl` and `b` are [similar](http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.dui0068b/CIHFDDAF.html); however, `bl` stores the address of the next instruction into the `lr` register, and therefore the called function can jump back via `ret`.

## C Helpers

```c
// One thread local per thread should be enough.
_Thread_local struct objc_super _threadSuperStorage;

struct objc_super *ITKReturnThreadSuper(__unsafe_unretained id obj) {
    struct objc_super *_super = &_threadSuperStorage;
    _super->receiver = obj;
    _super->super_class = object_getClass(obj);
    return _super;
}
```

The C helper `ITKReturnThreadSuper` is fairly trivial; it fills the `objc_super` struct and returns it. In early versions, I simply called `malloc()` and used a `dispatch_async` to later free it — a pretty horrible first hack, but it worked. This version uses a thread-local storage. `_Thread_local` was added in C11 and only works on global variables, but for our use case, this should work just fine — even if we use `objc_super` multiple times in a call stack.

It’s important to not go wild here: We did not save floating-point registers — only the bare minimum — so don’t call random functions in here. This is more dangerous than you think! Even [a simple memcpy](https://twitter.com/gparker/status/1270894792101117952?s=21) could override floating-point parameters.

Also see that `object_getClass`, and not the class method, is used here. While the latter can be overridden so a class “lies” about its type, this always returns the correct type. This is important since Apple uses this trick for key-value observing, which creates a subclass at runtime but also overrides `class` to hide this fact.

This also implies that the solution here is NOT a general `super` call, but will only work on the outermost object level. If you subclass again, this will no longer work correctly:

```
// first param is now struct objc_super (x0)
// protect returned new value when we restore the pairs
"mov x9, x0\n"
```

Once we return, in ARM64, the return value is in `x0`.[^6] We temporarily store this in the “scratch space” register set; `x9`-`x15` are free to use. Another word for this is caller-saved or clobbered. Why do we do that when `x0` is already exactly what we want? Because on ARM64, we can only operate on the stack in 16 bytes, so we always restore pairs of registers:

[^6]: This is true for our simple C function — large structs might use an indirect return (`x8`).

```
// pop {x0-x8, lr}
"ldp x0, x1, [sp], #16\n"
"ldp x2, x3, [sp], #16\n"
"ldp x4, x5, [sp], #16\n"
"ldp x6, x7, [sp], #16\n"
"ldp x8, lr, [sp], #16\n"
```

While there are ways around this, they are less elegant and require even more assembly. After restoring the registers, we’re now almost ready for the `super` call:

```
// get new return (adr of the objc_super class)
"mov x0, x9\n"
// tail call
"b _objc_msgSendSuper2 \n"
```

We copy `x9` back to `x0` and then call `objc_msgSendSuper2` with `b`, not saving the link registry and thus performing a tail call. 

## Assembly Notes

That’s it. You can [see the result for both architectures](https://github.com/steipete/InterposeKit/blob/10c4aa44d6d5f44d23c057f6d7e4cbf128df5a70/Sources/ITKAddSuperMethod/ITKAddSuperMethod.m#L113-L243) and also the `objc_msgSendSuper2_stret` variant for struct returns on GitHub.

Luckily, we currently only need x86_64 and arm64, and one day we might even be able to [drop Intel altogether](https://www.bloomberg.com/news/articles/2020-06-09/apple-plans-to-announce-move-to-its-own-mac-chips-at-wwdc). Apple removed support for armv7 (32-bit arm) in iOS 11 and i386 with macOS Catalina, so I didn’t write variants, although it wouldn’t be so hard, as the principles are the same.

After being almost done with this, Joe Groff [pointed out](https://twitter.com/jckarter/status/1270115008454684673?s=21) that there’s another (although less efficient) way to not need assembly for my specific case — but having a generic `super` logic has many other useful possibilities, and it was a great learning experience.

Now I’d [love to hear from you](https://twitter.com/steipete). Is what I do here correct? Does this make sense? Is there a better way?

## Bonus Content: Using Your New Assembly Superpowers

Now that you understand assembly, we can look at what the compiler really generates with a `super` call:

```
// Stack preservation
sub	sp, sp, #48             ; =48
stp	x29, x30, [sp, #32]     ; 16-byte Folded Spill
add	x29, sp, #32            ; =32
// Fetch data
adrp	 x8, _OBJC_SELECTOR_REFERENCES_@PAGE
add	x8, x8, _OBJC_SELECTOR_REFERENCES_@PAGEOFF
adrp	 x9, _OBJC_CLASSLIST_SUP_REFS_$_@PAGE
add	x9, x9, _OBJC_CLASSLIST_SUP_REFS_$_@PAGEOFF

// build objc_super struct on the stack
stur 	x0, [x29, #-8]
str	x1, [sp, #16]
ldur x10, [x29, #-8]
str	x10, [sp]
ldr	x9, [x9]
str	x9, [sp, #8]
ldr	x1, [x8]
mov	x0, sp

// regular call
bl	 _objc_msgSendSuper2
ldp	x29, x30, [sp, #32]     ; 16-byte Folded Reload
add	sp, sp, #48             ; =48
ret
```

You can debug this via Debug > Debug Workflow > Always Show Disassembly. Step through commands via `ni` and `is`. 

![Xcode Assembly Debugger](/assets/img/2020/calling-super/Xcode-debug.png) 

Right before the call to `_objc_msgSendSuper2`, we can inspect the `objc_super` struct:

```
(lldb) po *(id *)$x0
<ViewController: 0x102607ca0>

(lldb) po *(id *)($x0+8)
ViewController
```

## Further Resources

Thanks to everyone helping me with this post, especially [@badlogicgames](https://twitter.com/badlogicgames),  [@DavidJGoldman](https://twitter.com/DavidJGoldman), and [@mpweiher](https://twitter.com/mpweiher).

I used these resources to learn:

- [Apple ARM64 Function Calling Conventions](https://developer.apple.com/library/ios/documentation/Xcode/Conceptual/iPhoneOSABIReference/Articles/ARM64FunctionCallingConventions.html)
- [ARM Assembly Basics by Azeria](https://azeria-labs.com/writing-arm-assembly-part-1/)
- [InspectiveC: objc_msgSend hook for debugging/inspection purposes](https://github.com/DavidGoldman/InspectiveC)
- [amd64 and va_arg](https://blog.nelhage.com/2010/10/amd64-and-va_arg/)
- [Stack frame layout on x86-64](https://eli.thegreenplace.net/2011/09/06/stack-frame-layout-on-x86-64)
- [Local Variables on the Stack](https://bob.cs.sonoma.edu/IntroCompOrg-RPi/sec-varstack.html)
- [Wikipedia: Calling convention](https://en.wikipedia.org/wiki/Calling_convention#x86_(32-bit))
- [Using the Stack in AArch64: Implementing Push and Pop](https://community.arm.com/developer/ip-products/processors/b/processors-ip-blog/posts/using-the-stack-in-aarch64-implementing-push-and-pop)
- [x86 Assembly Guide](https://www.cs.yale.edu/flint/cs421/papers/x86-asm/asm.html)
- [ARM Compiler Documentation](http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.dui0801a/BABBDBAD.html) 
- [Notes on x86-64 programming](https://www.lri.fr/~filliatr/ens/compil/x86-64.pdf)
- [How x86_64 addresses memory](https://blog.yossarian.net/2020/06/13/How-x86_64-addresses-memory)
