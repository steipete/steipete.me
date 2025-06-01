---
title: Hardcore Debugging - Heavy Weapons for Hard Bugs
pubDatetime: 2018-03-07T12:00:00.000Z
description: "Advanced debugging techniques for tracking memory management issues, retain/release cycles, and hard-to-find bugs in iOS development."
tags:
  - Web
  - Development
  - WebAssembly
source: pspdfkit.com
AIDescription: true
---

## Tracking Retain/Release

The other day, while refactoring, our tests suddenly crashed with the message every experienced developer fears:
`*** -[PSPDFDocument release]: message sent to deallocated instance 0x617000007780`

![Zombie in an unnamed queue](/assets/img/2018/hardcore-debugging/autorelease-pool-pop.png)

In the default background queue. Without any further context nor any information in the stack trace. The state on other threads was not relevant and changed on every run.
This is pretty much one of the worst bugs.

Now people who worked on the Mac platform long enough to remember manual retain release will surely know these kind of issues. However, ARC normally does a really great job at making sure over-releases are no longer an issue. Still, here I was, with this impossible crash, at midnight, desparate to find a solution.

This only happened when Zombies are enabled, so our CI was still green, and it also only happened on our UI KIF tests. This caused quite a lot of frustation. Instruments is pretty good at tracking retain/release, however this only works for regular targets, not for test targets.

And I need to step back a little bit here, because there are actually quite a few things we do to make these kind of issues very rare:

1. We give our background queues explicit names. I consider it bad practice to throw tasks in the global queue without creating a named serial subqueue. GCD queues are cheap, and it's incredibly helpful to name all our background operations. We wrote a wrapper class around GCD in Objective-C that makes this really easy:

```objc
// release resources as we no longer need them - but don't block the calling thread for this!
weakify(self);
[[PSPDFDispatchQueue.backgroundQueue namedQueue:@"cache.deallocation"] async:^{
    strongify_or_return(self);

    @synchronized(self) {
        self->_document = nil;
        self->_imageRenderingCompletionBlock = nil;
    }
}];
```

I'm sorry for all the Objective-C here. Our framework is heavily built around C++ and Objective-C, as we cannot use Swift yet, as it's not yet binary compatible. (Blog Post)
Notice how this creates a one-time use queue to deallocate things in the background - this makes background tasks much simpler to follow, and debugging much easier.

In addition to that, when our code is compiled in `DEBUG` mode, we track all created queues weakly, so we can break at any point and call `[PSPDFDispatchQueue _listAllQueues]` to get a list of all active queues.

```objc
static NSHashTable<PSPDFDispatchQueue *> *_activeQeues;

static dispatch_block_t PSPDFDebugTrackedBlock(PSPDFDispatchQueue *queue, dispatch_block_t block) {
    PSPDFCAssertBlock(block);
    PSPDFCAssertClass(queue, PSPDFDispatchQueue);
    PSPDFCAssertClass(_activeQeues, NSHashTable);

    return ^{
        @synchronized(_activeQeues) {
            [_activeQeues addObject:queue];
        }
        block();
        @synchronized(_activeQeues) {
            [_activeQeues removeObject:queue];
        }
    };
}

// Wrap working block:
#if GCD_DEBUG_ENABLED
    workItem = PSPDFDebugTrackedBlock(self, workItem);
#endif

+ (void)_listAllQueues {
    let activeQueues = _activeQeues.allObjects.copy;
    NSLog(@"Active Queues: \n");
    foreach (queue, activeQueues) {
        NSLog(@"%@\n", queue);
    }
}
```

In the case of this bug, it didn't help a bit. My next step was using malloc stack logging. You set `MallocStackLoggingNoCompact=YES` as environment variable, and lldb should be able to print object generation.

```
script import lldb.macosx.heap
malloc_info --stack-history
```

However, this didn't work at all, and it's unclear to me if that still works at all or just failed in the particular case.

![Enable all debugging](/assets/img/2018/hardcore-debugging/xcode-debug-settings.png)

Next, I went and enabled ASAN, UbSAN and the Main Thread Checker. Zombie Objects was already enabled. This creates a lengthy recompile, but didn't help a bit in my case.

The root cause here is that some code has to call `autorelease` on the `PSPDFDocument`. So let's set a breakpoint. BUT - that doesn't work anymore with ARC, since ARC doesn't use message passing anymore for performance reasons, instead the compiler emits `objc_retain`, `objc_release` and `objc_autorelease`, which is quite a bit harder to break on, and debugging becomes impossibly slow if you try to break on _every_ `objc_autorelease`, even using conditional rules is to slow. ARC does work work classes that implement custom retain/release logic, so there's a runtime check to test if a document implements such a method - so there's still hope. So, let's implement `autorelease` in our class, which forces ARC to go the slow path:

![Trying to implement autorelease under ARC](/assets/img/2018/hardcore-debugging/autorelease-ARC.png)

The naive way of just overriding NSObject's autorelease does not work with ARC either. Now, I can't casually convert a 2000 line class to MRR just for debugging (chances are, I'd introduce 10 new bugs while even trying to convert this, if I don't go insane before that). So that doesn't work either. The good thing is that this isn't the first time we needed something like that, and we have a class which helps with that. We used it in a different context, but it'll do:

```objc
/**
 Helps to track down problems related to "The Deallocation Problem".
 http://developer.apple.com/library/ios/#technotes/tn2109/_index.html%23//apple_ref/doc/uid/DTS40010274-CH1-SUBSECTION11
 */
@interface PSPDFRetainTracker : NSObject
@end

@implementation PSPDFRetainTracker

- (BOOL)shouldPrintRetainRelease {
    return YES;
    // return !NSThread.isMainThread;
}

- (const char *)queueName {
    PSPDF_DEPRECATED_NOWARN(return dispatch_queue_get_label(dispatch_get_current_queue());)
}
- (id)retain {
    if ([self shouldPrintRetainRelease]) {
        printf("RETAIN %p %s (queue:%s) -> %s", (void *)self, NSThread.currentThread.name.UTF8String, [self queueName], [NSThread callStackSymbols].description.UTF8String);
    }
    return [super retain];
}

- (id)autorelease {
    if ([self shouldPrintRetainRelease]) {
        printf("AUTORELEASE %p %s (queue:%s) -> %s", (void *)self, NSThread.currentThread.name.UTF8String, [self queueName], [NSThread callStackSymbols].description.UTF8String);
    }
    return [super autorelease];
}

- (oneway void)release {
    if ([self shouldPrintRetainRelease]) {
        printf("RELEASE %p %s (queue:%s) -> %s", (void *)self, NSThread.currentThread.name.UTF8String, [self queueName], [NSThread callStackSymbols].description.UTF8String);
    }
    [super release];
}
@end
```

Now, `PSPDFDocument` is basically our core model, and it's used everywhere. I tried to just change the superclass from `NSObject` to `PSPDFRetainTracker`, however that caused header module errors. The helper class lives in a file called `PSPDFDebugHelper.h` which isn't part of the framework, and it'd be painful to restructure the headers to include that. Copying the code over also doesn't work, since `PSPDFDebugHelper.m` needs to be compiled with ARC disabled.

Objective-C Runtime to the rescue. Let's just swap classes at runtime!

```objc
+ (void)initialize {
    let thisClass = PSPDFDocument.class;
    if (self == thisClass) {
        return;
    }

    class_setSuperclass(PSPDFDocument.class, (Class)NSClassFromString(@"PSPDFRetainTracker"));
}
```

I'll simply get the instance from runtime here so I don't need to fiddle with further imports, and we use `PSPDFDocument`'s `initialize` to take care of that early on.
Now, if you've never ever heard about `class_setSuperclass`, there's a good reason for that. DO NOT USE IT IN PRODUCTION. Just check out the header file. Apple is pretty blunt about that and writes "warning You should not use this function." and "not recommended". But alright, we're debugging here, and we need the heavy weaponry!

```objc
/**
 * Sets the superclass of a given class.
 *
 * @param cls The class whose superclass you want to set.
 * @param newSuper The new superclass for cls.
 *
 * @return The old superclass for cls.
 *
 * @warning You should not use this function.
 */
OBJC_EXPORT Class _Nonnull
class_setSuperclass(Class _Nonnull cls, Class _Nonnull newSuper)
    __OSX_DEPRECATED(10.5, 10.5, "not recommended")
    __IOS_DEPRECATED(2.0, 2.0, "not recommended")
    __TVOS_DEPRECATED(9.0, 9.0, "not recommended")
    __WATCHOS_DEPRECATED(1.0, 1.0, "not recommended")
    __BRIDGEOS_DEPRECATED(2.0, 2.0, "not recommended");
```

To my surprise, this actually works! Running the test gets really really slow, as it spits out a ton of stack traces for every single retain/release and autorelease. And compiler optimizations are not enabled here since we want to debug, which makes ARC really really dumb - there's no optimization at all, and it emits a ton of calls. However, eventually, things crash again. Now copy out that huge log output, use your text editor of choice (Ideally not Atom or VS Code but one that can deal with A LOT of text, such as Sublime). And we just search for `AUTORELEASE 0x617000007780  (queue:com.apple.root.background-qos)` because that's what we want to know. And here we are:

```
)AUTORELEASE 0x617000007780  (queue:com.apple.root.background-qos) -> (
	0   PSPDFKit                            0x000000012ed5818b -[PSPDFRetainTracker autorelease] + 747
	1   PSPDFKit                            0x0000000129fbce4c _ZN5PSPDF2asI13PSPDFDocumentEEPT_P11objc_object + 652
	2   PSPDFKit                            0x0000000129fb83e3 _ZN5PSPDF11as_force_nnI13PSPDFDocumentEEPT_P8NSObject + 2563
	3   PSPDFKit                            0x0000000129fb8b02 -[PSPDFCacheDocumentHashManager willCloseDocument:] + 514
	4   CoreFoundation                      0x000000010feb2b8c __CFNOTIFICATIONCENTER_IS_CALLING_OUT_TO_AN_OBSERVER__ + 12
	5   CoreFoundation                      0x000000010feb2a65 _CFXRegistrationPost + 453
	6   CoreFoundation                      0x000000010feb27a1 ___CFXNotificationPost_block_invoke + 225
	7   CoreFoundation                      0x000000010fe74422 -[_CFXNotificationRegistrar find:object:observer:enumerator:] + 1826
	8   CoreFoundation                      0x000000010fe735a1 _CFXNotificationPost + 609
	9   Foundation                          0x000000010eef2e57 -[NSNotificationCenter postNotificationName:object:userInfo:] + 66
	10  PSPDFKit                            0x000000012a073e05 -[PSPDFDocument destroyDocumentProviders] + 917
	11  PSPDFKit                            0x000000012a0533d7 -[PSPDFDocument dealloc] + 375
	12  Foundation                          0x000000010ef574e8 NSKVODeallocate + 158
	13  libobjc.A.dylib                     0x000000010f525a6e _ZN11objc_object17sidetable_releaseEb + 202
	14  PSPDFKit                            0x000000012ed587dd -[PSPDFRetainTracker release] + 1117
	15  PSPDFKit                            0x000000012a2a37f6 -[PSPDFRenderRequest .cxx_destruct] + 182
	16  libobjc.A.dylib                     0x000000010f50f920 _ZL27object_cxxDestructFromClassP11objc_objectP10objc_class + 127
	17  libobjc.A.dylib                     0x000000010f51b502 objc_destructInstance + 124
	18  CoreFoundation                      0x000000010ff98936 -[NSObject(NSObject) __dealloc_zombie] + 150
	19  libobjc.A.dylib                     0x000000010f525a6e _ZN11objc_object17sidetable_releaseEb + 202
	20  PSPDFKit                            0x000000012a02a208 -[PSPDFRenderTask .cxx_destruct] + 152
	21  libobjc.A.dylib                     0x000000010f50f920 _ZL27object_cxxDestructFromClassP11objc_objectP10objc_class + 127
	22  libobjc.A.dylib                     0x000000010f51b502 objc_destructInstance + 124
	23  CoreFoundation                      0x000000010ff98936 -[NSObject(NSObject) __dealloc_zombie] + 150
	24  PSPDFKit                            0x000000012a0204e9 -[PSPDFRenderTask dealloc] + 409
	25  libobjc.A.dylib                     0x000000010f525a6e _ZN11objc_object17sidetable_releaseEb + 202
	26  CoreFoundation                      0x000000010fe938bd -[__NSSetM dealloc] + 157
	27  libobjc.A.dylib                     0x000000010f525a6e _ZN11objc_object17sidetable_releaseEb + 202
	28  PSPDFKit                            0x000000012a1161fe -[PSPDFRenderJob .cxx_destruct] + 126
	29  libobjc.A.dylib                     0x000000010f50f920 _ZL27object_cxxDestructFromClassP11objc_objectP10objc_class + 127
	30  libobjc.A.dylib                     0x000000010f51b502 objc_destructInstance + 124
	31  CoreFoundation                      0x000000010ff98936 -[NSObject(NSObject) __dealloc_zombie] + 150
	32  PSPDFKit                            0x000000012a10ce39 -[PSPDFRenderJob dealloc] + 409
	33  libobjc.A.dylib                     0x000000010f525a6e _ZN11objc_object17sidetable_releaseEb + 202
	34  PSPDFKit                            0x000000012a115fcd __destroy_helper_block_.127 + 29
	35  libsystem_blocks.dylib              0x000000011414d98a _Block_release + 111
	36  PSPDFKit                            0x000000012ec8334b __destroy_helper_block_.216 + 59
	37  libsystem_blocks.dylib              0x000000011414d98a _Block_release + 111
	38  libobjc.A.dylib                     0x000000010f5261b2 _ZN12_GLOBAL__N_119AutoreleasePoolPage3popEPv + 860
	39  libdispatch.dylib                   0x0000000114066762 _dispatch_last_resort_autorelease_pool_pop + 27
	40  libdispatch.dylib                   0x0000000114070fc1 _dispatch_root_queue_drain + 1186
	41  libdispatch.dylib                   0x0000000114070ac1 _dispatch_worker_thread3 + 119
	42  libsystem_pthread.dylib             0x00000001145881ca _pthread_wqthread + 1387
	43  libsystem_pthread.dylib             0x0000000114587c4d start_wqthread + 13
)
```

During deallocation of one of our render tasks, the document is deallocated. Inside dealloc we clean up some things and also update the hash manager, which listens to the close event and runs following code:

```objc
- (void)willCloseDocument:(NSNotification *)aNotification {
    let document = PSPDF::as_force_nn<PSPDFDocument>(aNotification.object);
    if (document.hasUnsavedChanges || document.hasDirtyAnnotations) { return; }
    [self updateHashesForDocument:document];
}
```

This used to work, because in earlier versions of it, we just did a manual cast of the notification object to the document class. It can only be a document in the object. Years of writing code made me a grumpy old suspicious developer however, so we add checks even if we are sure what we get. Because crashing early is good. In that case we use a cast-helper in C++, which basically is a check that the object is not null and that it matches the class we say we want (`PSPDFDocument`!) via an `isKindOfClass:` check. This helper is quite optimized and cheap, but in debug, ARC emits `autorelease` in one of the inlined helpers. Calling `autorelease` within `dealloc` is not a good idea, and will give us exactly that crash.

Let's look at the generated assembly to understand where this autorelease is really coming from:

![Generated Assembly](/assets/img/2018/hardcore-debugging/assembly.png)

So we see that our cast is converted to a `__ZN5PSPDF11as_force_nnI13PSPDFDocumentEEPT_P8NSObject` and ARC is using `_objc_retainAutoreleasedReturnValue` to retain the value here. The naming here is C++ mangled, but still readable.

The fix was to add an explicit `__attribute__((always_inline))` to the inline helper, which forces inlining and thus keeps ARC from doing dumb things.

```objc
/// as? Casts nullable object to type T. Return nil if wrong type.
template <class T> inline __attribute__((always_inline)) T *_Nullable as(id _Nullable o) noexcept {
    if ([o isKindOfClass:[T class]]) {
        return (T * _Nullable)o;
    }
    return nil;
}
```

And that's the fix. One word.
