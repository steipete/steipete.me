---
title: "Naming Is Hard — Difficulties of Naming Variables"
description: "Is naming a variable so hard? According to Martin Fowler, it is. In this blog post, I'll try to shed some light on what naming entails and why it's a challenge."
preview_image: /images/blog/2018/naming-is-hard/preview.png
section: blog
author:
  - Simone Arpe
author_url:
  - https://twitter.com/simonarpe
date: 2018-09-12 10:00 UTC
tags: Development, iOS, Android, Tips
published: true
secret: false
---

[Martin Fowler][] is one of the main authorities in the field of object-oriented analysis and design, and he is author of many books about the topic, including *Refactoring: Improving the Design of Existing Code*. Back in July 1992, he stated on his [website][website] that one of his favorite sayings is:
> There are only two hard things in Computer Science: cache invalidation and naming things.

But is naming a variable really so difficult? In this blog post, I’ll try to shed some light on what naming entails and why it’s a challenge.

# Good Code vs. Bad Code: What’s the Difference?

Let’s begin by saying that there’s not a universal definition of “good code.” However, many respected sources have expressed themselves on the subject.

One of my favorites is the definition given by Grady Brooch, author of *Object-Oriented Analysis and Design with Application*:

> Clean code is simple and direct. Clean code reads like well-written prose. Clean code never obscures the designer’s intent but rather is full of crisp abstractions and straightforward lines of control.

Brooch clearly puts the main focus on the readability, and I couldn’t agree more. Highly readable code will be:  

- Easy to understand  
- Easy to maintain  
- More expressive  
- Easily taken over by other developers  
- Easier to fix in case of bugs  
- Very pleasant to work with (an aspect that must not be underestimated)  

Now, for the sake of argument, let’s imagine code that’s difficult to read and rewrite the list we had before:

- Hard to understand  
- Hard to maintain  
- Less (or not) expressive  
- Not easily taken over by other developers
- Not easier to fix in case of bugs
- Very unpleasant to work with  

Compare the two lists, and you’ll see we have just turned something good into a developer’s worst nightmare.

All of this is directly related to readability, which I find mindblowing.

That said, another question naturally emerges: What affects readability?  

Well, there are many answers to this, but a big one is — you guessed it — naming.

# Object-Oriented Programming Concepts

Because there are multiple factors to consider when naming something (e.g. a variable), it’s not so simple to do. So let’s take a closer look at what affects naming and what the risks are and how to avoid them.

## Object-Oriented Principles

Object-oriented programming requires expedients, and they don’t come for free. There are four main principles to obey, and they become easier to follow the more you use them, as you become familiar with specific patterns and architectural conventions. Check out the code at the end for a real example.

## Design Patterns

Professionals use design patterns, which are well-established approaches to solving known problems. It’s always a good idea to apply a naming convention when a design pattern is applied, although this may further affect the naming.

## Refactoring

This is one of the most powerful weapons of a developer. Performing rounds of refactoring is a mandatory step on every team, but sometimes the clarity of naming can be lost in the process.

## Transfer of Knowledge

People do change projects! Or teams. Or jobs. What may be crystal clear for you might not be for whoever comes after you. That’s why renaming symbols is something that should be done very wisely.

## Different Cultures, Different Standards

Never leave anything to chance. Again, what might sound obvious to you might be odd for someone with a different background or coming from a different culture. Even things as small as different spelling can produce unexpected results.

# How to Approach the Bad Naming Effect

Here at PSPDFKit, we love crafting a solid and clear API for our framework, so naming is obviously an important piece of the puzzle for us.

Here is an example of bad naming:
![Object-oriented world](/images/blog/2018/naming-is-hard/oo-world.png)

It illustrates my point perfectly. My personal favorite is `MultiButtSupporter`.

But what can be done to reduce this “bad naming effect?” Every team needs to find its balance, which takes time and is a joint effort. But as a starting point, below I’ve included a list of what we do.

- **Code reviews**: We really believe in code reviews! I’m not going to spend time discussing how useful they are, but one of the benefits of code reviews is they may just help you avoid bad naming.

- **Pair programming**: This is another great exercise to improve coordination between team members and reduce any bad naming.

- **Write good documentation**: This is very important for us, because part of our documentation is public. When a method or a class is well-documented, it is generally harder to come up with bad naming, as the concepts and the code flow are well understood.

- **Thread discussion on Slack**: We have a great blog post on [how we use Slack][]. When in doubt, share code with your team, and they’ll be glad to help improve things and offer suggestions.

- **Avoid meaningless or vague words**: If there’s not a real need for them, avoid using these words, which often add no value:
	- Coordinator
	- Builder
    - Writer
	- Reader
	- Handler
	- Container
	- Protocol
	- Target
	- Converter
	- Controller
	- Factory
	- Entity
	- Bucket

# Conclusion

Naming things is something that comes with time and experience, but as a general rule of thumb, try to always choose the right name, be specific, and don’t overgeneralize if you don’t want to fall in the trap of [cargo cult programming][].

Good naming will not only reward you in the long run, but it will also force you to have a clear, deep understanding of a problem.

I’ll conclude the article with an example from the great [Kevlin Henney at Coding Tech][]:

```cpp
class ConditionChecker
{
public:
	virtual bool CheckCondition() const = 0;
	...
};
```

The above perfectly illustrates how a class and a method can be badly named, even when backed with the best of intentions.

A more meaningful and clearer version becomes:

```cpp
class Condition
{
public:
	virtual bool IsTrue() const = 0;
	...
};
```

Remember, practice makes perfect. If you made it this far, you are already on the right track. 😎  
And if you want to delve more into the topic, have a look at Anastasiia’s article [Naming Classes — Why It Matters, and How to Do It Well][].

[martin fowler]: https://en.wikipedia.org/wiki/Martin_Fowler
[website]: https://martinfowler.com/bliki/TwoHardThings.html
[how we use slack]: https://pspdfkit.com/blog/2018/how-to-use-slack-and-not-go-crazy
[cargo cult programming]: https://en.wikipedia.org/wiki/Cargo_cult_programming
[kevlin henney at coding tech]: https://www.youtube.com/watch?v=dC9vdQkU-xI
[naming classes — why it matters, and how to do it well]: https://pspdfkit.com/blog/2018/naming-classes-why-it-matters-how-to-do-it-well/
