---
title: "How Spaced Repetition Helps You Learn New Things"
description: "We present spaced repetition as a learning technique that can help you be more efficient at work."
preview_image: /images/blog/2019/how-spaced-repetition-helps-you-learn-new-things/article-header.png
section: blog
author:
  - Daniel Martín
author_url:
  - https://twitter.com/dmartincy
date: 2019-02-26 8:00 UTC
tags: Development, Productivity
published: true
secret: false
---

Human beings are always learning new things. But we stand on the shoulders of giants, and our understanding of the world has improved over time because we rely on things that have already been discovered. This also means that the amount of knowledge and skills required by the professional industry today can be overwhelming, particularly in some industries that change rapidly, like the software industry.

How can we cope with all these knowledge requirements? In this article, I’m going to present a technique that is helpful in this regard — spaced repetition — and how I use it to continually learn at work.

## What Is Spaced Repetition?

The concept of spaced repetition is based on the fact that you learn things better if you spread out your studying over time. There’s a lot of ongoing research about this theory, but it is not particularly new; one of the first books that introduced the concept is [_The Psychology of Study_ by C. A. Mace in 1932][psychology of study].

Outside of the academic world, I’m sure you have had the experience of cramming for an exam, passing the exam (even with good grades), and forgetting about the material you studied soon afterward. This is one kind of ineffective learning that the spaced repetition technique tries to improve.

If we accept that studying a topic only once and over a short period of time is not the best way to learn or commit things to long-term memory, the alternative is to revisit the material regularly, just like the saying “practice makes perfect” suggests. However, with spaced repetition, the moment when the practice occurs matters a lot: Having the initial study or subsequent review of the material spaced out over time leads to better learning than having the repetition occur in close temporal succession.

## Spaced Repetition Using Flashcards

There are several applications of the spaced repetition principle, but the most popular one is the [Leitner system][], a method proposed by German journalist Sebastian Leitner in the 1970s. It’s based on the efficient use of flashcards — these cards have information on either or both sides (typically a question on one side and the answer on the other side). The Leitner system groups flashcards in boxes, and they are sorted depending on how well you know the material in them, with the first box being the one that contains the material you don’t know as well. Imagine that you have three boxes that contain flashcards. If you review some material from the second box and realize you forgot about it, you move it to the first box; if you knew the material very well, you can move it to the third box instead. Material from the first box should be reviewed more often than material from the second box, and so on.

![Spaced repetition using flashcards](/images/blog/2019/how-spaced-repetition-helps-you-learn-new-things/spaced-repetition-using-flashcards.png)

The most popular software for simulating the Leitner system on a computer is [Anki][], and I want to use it as an example to demonstrate how this works. So let’s open the program and create a new deck by clicking on the Create Deck button.

![Create a new deck in Anki](/images/blog/2019/how-spaced-repetition-helps-you-learn-new-things/CreateDeck.png)

Let’s name the new deck PDF Specification. After that, you can add a new flashcard to the deck by clicking on Add. For example, below is a simple card I’ve added. It has a question on the front and an answer on the back.

![Preview a new deck in Anki](/images/blog/2019/how-spaced-repetition-helps-you-learn-new-things/PreviewDeck.png)

You can also create more interesting flashcards. For example, you can create one with two blanks that you need to fill in, as shown below.

![Deck with multiple blanks](/images/blog/2019/how-spaced-repetition-helps-you-learn-new-things/DeckMultipleSlots.png)

Once you have created the flashcards, you’re ready to study them. If you click on the Study Now button, you will be presented with the following screen.

![Study of a deck of cards in Anki](/images/blog/2019/how-spaced-repetition-helps-you-learn-new-things/DeckStudy.png)

Press Show Answer when you think you know the answer to the question and check the results. You can give feedback about how easy or hard was for you to answer the question. This is important, because a hard question will be shown to you again in less time than an easy question. As stated earlier, this is one of the principles of spaced repetition.

It’s worth mentioning that there are also mobile app versions of Anki, in case you want to study your flashcards on the go (while you are commuting to work, for example).

### As a Developer, What Things Should You Put on an Anki Flashcard?

Now that you know how to create a simple deck of flashcards in Anki with the concepts you want to learn, naturally you might be wondering “Which concepts should I learn using flashcards?” My recommendation is to use them mainly in three cases:

- For things that you use regularly — for example, the common parts of a software development API that you use in your project.
- For things that don’t change much — for example, the most important parts of the PDF specification (if you work on PDF software), common computer science concepts (they are used more often than you’d think during development), or the important parts of the domain that your program is implementing (if it’s a complex domain, like banking).
- For things that you want to commit to long-term memory — for example, common computer science or software engineering concepts.

[AnkiWeb][] is a website where people from the Anki community share their flashcards. There are already many topics there, so it is a good idea to browse the website before planning to create your own deck from scratch in case someone has already shared a deck with information similar to what you want to learn.

## Conclusion

In this article, I have explored what spaced repetition is and explained how you can learn by using it. I have been using this technique to learn about the PDF specification more efficiently, but it can be applied to other domains as well. For software developers, spaced repetition can be very useful when learning a new language or a new API, and software like Anki helps you review topics by creating virtual flashcards that synchronize automatically on every device you use.

[psychology of study]: https://en.wikipedia.org/wiki/Spaced_repetition#cite_note-2
[leitner system]: https://en.wikipedia.org/wiki/Leitner_system
[anki]: https://apps.ankiweb.net
[ankiweb]: https://ankiweb.net/shared/decks/
