---
title: "Refactoring Large Codebases: Tips and Tricks"
description: "If you're going to fall down a rabbit hole anyway, you might as well enjoy it!"
preview_image: /images/blog/2018/refactoring-large-codebases-tips/article-header.png
section: blog
author:
  - Oscar Swanros
author_url:
  - https://twitter.com/swanros
date: 2018-10-23 8:00 UTC
tags: Development, API Design, Refactoring
published: true
secret: false
---

As developers, we’re constantly working with APIs, whether we actively notice it or not; APIs are more than just talking to a web server somewhere. READMORE

You could be trying to set up a new computer and running a custom set of scripts, or you could be trying to integrate the new hotness in iOS 12 into your application.

At PSPDFKit, we’re constantly thinking about how we can make _dealing_ with our extensive set of APIs easier, as our goal is to take care of as much as we can ourselves so that you can focus on building your application or product. We just want to get out of the way and let you work your magic, and providing a good API is a major part of that.

However, there are times that we notice some _ergonomic_ flaws in our APIs (e.g. maybe we could provide more context or add specific type annotations), and when we try to fix them, we discover that a change that looked simple on the surface is actually the beginning of an entire redesign process of the architecture of a component or entire subsystem of the SDK.

During my time at PSPDFKit, I’ve run into a bunch of these situations. In fact, I think almost all of my assignments have led to what we internally call 🐰🕳s, and so I’ve started to notice a pattern of how I get through issues where a “simple cosmetic change” leads to a major refactoring of some component of the SDK.

In this blog post, I’d like to share the steps that I take when I need to go about changing stuff in a large codebase, such as [PSPDFKit for iOS](https://pspdfkit.com/api/ios/), and what I’ve learned works best for me, personally.

Please note that your mileage may vary, and that what I share in this blog post is, well, what works for *me*.

This blog post is written with the assumption that a decision to make an update has been made — how to decide if a change is required is up to you and your specific business concerns.

### Know Your Domain

You may _feel_ like _something_ can be improved, though often times the _what_ is not clear from the beginning, so you have to start digging to get a better idea of what it is that is bugging you.

Reading the code and following all the execution branches can be a really time-consuming task, especially for large codebases (like PSPDFKit), and even more so if you’re not familiar with a particular portion of the application, so it’s probably not the best use of your time.

The first step I take in these situations is to explore a feature as it is and play around with it. You’ve got to be careful here that you cover as much ground as you can and take notes of the details that make the feature useful — especially the ones that can be easily missed. Look for them.

For instance, when refactoring the sharing infrastructure that shipped with [PSPDFKit 8 for iOS](https://pspdfkit.com/blog/2018/pspdfkit-ios-8-0/), not only did I look at _how_ the view layer of that feature behaved (different modal presentation styles and contexts), but I also looked at what customization options were available programmatically.

This exercise helps you in getting a bigger picture of what a feature is trying to achieve, and ultimately, it will give you better context for the reasons behind the current state of the feature design.

There’s not really a way to know for sure when you’ve recognized everything that’s related to the feature or subsystem that you’re trying to refactor, though. You have to **always keep looking** for ways that a module can influence other parts of the general system. For instance, a lot of how PSPDFKit behaves can be configured via `PSPDFConfiguration` objects, so chances are that I’ll need to be wary of that specific class even though I may be working on something that seems completely unrelated on the surface.

That said, there’s always a “this is good enough” moment that’s achieved during this process, where you don’t really need to think about what will happen if you push this button or pull on that lever; when that aha moment comes, you’re ready for the next step: breaking stuff.

### See What Breaks

This step is best described by the following GIF:

<iframe src="https://giphy.com/embed/JIX9t2j0ZTN9S" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>

After you have a better understanding of the general objective and behavior of the module you’re trying to update the API of, you can start poking around and see what breaks — both on the API and the interaction level.

If it’s a form you’re dealing with, try submitting empty fields. If the API accepts a string, pass one and then update it from outside the method (remember to use `copy` for `NSString`!).

In this part of the process, you should be looking at how the current state of the module handles certain situations.

- What happens when you provide the wrong input?
- Does it offer defaults?

If you notice something that doesn’t seem right (it does not check for wrong input, for instance), make a note so that you can address it when you update the API.

This step is probably one of the most important ones in this process, because it will provide more context about what the next iteration of the API should address.

### Define an Action Plan

After you’ve identified _areas of opportunity_ in the current state of affairs, then you can start thinking about what to change to improve a situation. Start by ranking the components that would need to be updated or removed by their “might break a lot of stuff” factor — from lowest to greatest risk.

Here’s where all that knowledge you gathered in the previous steps comes into play. If you identified a class that’s isolated enough and it doesn’t offer a lot of functionality, it is probably a better candidate to be a starting point than that huge 10,000-line view controller holding the entire state of the application.

If you come up with, say, 10 steps to achieve your refactoring goal, think carefully and spend some time doing dry runs of the first 4 steps on that list. If you’re in a position where you can actually invest some time on it, branch off from your code and start experimenting.

Why do a dry run? Those initial 10 steps you came up with were set at a time when you hadn’t actually begun ripping stuff apart. By doing a dry run of the first 4 steps, you can validate your plan early and discover potential roadblocks that could lead to major setbacks.

Just as it happens in life, the original plan will probably need to be adjusted by the discoveries you make along the way, so don’t sweat it if you end up doing (much) more than you originally thought. If at step 6 you discover that there are actually 15 extra steps required to achieve the goal (making it a total of 21 steps instead of 10), remember that now you’re 6 steps wiser than you were when you came up with the original 10 steps.

Onward!

### Start Changing, Bit by Bit

By now you should have a clear understanding of what needs to be changed, how you plan on doing this, and which critical parts of the system are going to be affected. There’s nothing much left to do other than the actual work. So take a deep breath, pour a cup of your favorite beverage, and start executing.

There’s not much to say in this section, because how you proceed depends on your specific situation, but I do follow a small set of rules:

- Stick to the plan as much as possible; it’s not worth spending time upgrading the project’s dependencies before a class name change.
- Make sure I’m catching my own mistakes, for example by adding assertions on critical sections of my code so that if I miss some kind of configuration, I’ll definitely notice it when testing it.

Overall, I think the key is to not be too ambitious and try to change an entire class at once — start small and grow steadily. The main goal is to always be looking for stuff that can be improved upon, and then gradually doing so.

### Know When You’re Done

You identified what needed improvements, then set a goal and a path forward, and now you’re in “updating all the things” mode. But it’s important that, every step of the way, you know when you’ve hit your goal.

Remember this: *There will always be something that can be improved upon.*

If you’re not checking against your original goal often, you can then end up changing parts of the codebase that didn’t need changing at all. This can be dangerous, so always be wary of how deep you’re digging yourself into the rabbit hole.

### Conclusion

Working with a large codebase can be a daunting experience, and the thought of changing stuff in it can be a really hard thing to overcome. However, after having done it a bunch of times, you’ll start noticing patterns of the approach that works best for you.

By taking notice of what works (and what doesn’t), you can start being more and more efficient. The next time that big task is assigned to you, you’ll see it as an adventure!

I hope this blog post provided ideas and/or guidance for the next time you need to tackle a big API change in your project.
