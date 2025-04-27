---
title: Naming Classes — Why It Matters, and How to Do It Well
description: Tips for choosing good class names.
preview_image: /images/blog/2018/android-naming/preview.png
section: blog
author:
  - Anastasiia Zhuravleva
date: 2018-09-10 12:00 UTC
tags: Development
published: true
---

Let’s talk about naming things when coding, why it matters, and how to get better at it. For the sake of simplicity, I will use the word “class” throughout this post to describe naming targets, but this doesn’t mean I’m excluding other entities like interfaces, enums, etc.

READMORE

### Why Naming Matters

Here are some of the benefits of proper class naming and naming conventions:

- You know what to expect from a certain class without looking at code or documentation, even if you aren’t the person who created it or if it was written a long time ago.
- It’s easy to search and navigate a codebase.
- It’s easier to talk to your team when discussing problems/improvements.
- It makes onboarding newcomers easier, quicker, and less confusing.

A properly used MVP with an established naming convention is usually a good example of working naming expectations. If the class is named `UseCase/Interactor`, you’d expect it to contain business logic. But let’s say that we have a convention to use `UseCase` for a single piece of logic and `Interactor` to put in similar `UseCase`s.

Let’s also pretend we have a catalog application about all different kinds of monsters. You can have your own collection of monsters you have encountered, add them to favorites, and keep track of limited edition monsters. By combining those two knowledge aspects (MVP + the monster app), you can tell, without even checking inside that:

`GetAllMonstersUseCase` — returns a collection of all monsters.
`GetMonsterByIdUseCase` — requires that you pass an ID to get a `Monster`.

And if you find `MonsterFilteringInteractor`, you shouldn’t be surprised to find methods such as `getMonstersForArea(area)` or `getMonstersLargerThen(size)` inside of it.

Now imagine you are looking for a method, which, for example, returns all carnivorous monsters. To do this, check in the filtering interactor, and if this method doesn’t exist, you will at least have a nice idea about where the proper place to add it is.

Enough explanation for now; let’s get to the naming itself, along with some important tips to keep in mind.

### If It Makes No Sense, Remove It

This is the general rule of thumb. If a word is ambiguous, doesn’t add any meaning to a name, and is not the part of established naming convention, then just delete this word.

Let’s look at a simple example.

`SpecialMonsterView` — What is so special about this view or these `Monster`s? We aren’t even sure to which noun this special word belongs. Delete the `Special` part and you will be left with `MonsterView`, which gives us an idea that this view will show monsters in some way, but it is still a vague naming. Now let’s check inside, because the way this view was named before forces us to do so. Ask yourself what this view shows and what the word special might have referred to. Some options could be:

- Favorite monsters for users — `FavoriteMonsterView`.
- Recommendations for the user to check on these monsters because of the difficulty scaling — `RecommendedMonsterView`.
- Monsters that will appear only for a short time or during some event — `EventMonsterView`.

And so on. You get the idea.

### Ask What/How/Where?

Asking yourself these three questions will also help you come up with a good name. For example:

- What exactly does this class do?
- How exactly does it perform a certain task?
- Is there something specific about its location?

Here is an example:

Let’s say we have a `MonsterRepository` interface, which should provide us with some basic operations for monsters, such as creating new monsters, getting all monsters, and getting monsters by ID.

In such a case, here are your possible naming examples for implementations, along with a description of what they are used for:

- `InMemoryMonsterRepository` — contains a hardcoded collection of monsters to retrieve and add to. This is useful for testing or when the implementation details aren’t decided yet but you can already start developing the rest using the “dummy” monster data.
- `NetworkMonsterRepository` — tells you that this repository needs a network connection and works with the data from the server.
- `CachedNetworkMonsterRepository` — this is not just using the networking, but it also performs some sort of caching, and you can expect that it is capable of retrieving at least some monster data when offline if it had a chance to cache it earlier.
-  `DBFlowMonsterRepository`, `RoomMonsterRepository`, `SQLiteMonsterRepository` or `RealmMonsterRepository` — tell us that a repository was implemented using a specific library.

### Conventions Are Important

Naming conventions are important, and following them precisely is important as well.

If you have a greenfield project, you should think about the architecture you want to try out, and then come up with the initial naming structure. Jot down some ideas and present them to your team. Or, if you are working alone, take a good look at what you came up with and check the internet for more ideas. You might even want to put the results of your brainstorming on Stack Exchange to get some advice.

If you are joining an already existing project, ask the following questions:

- What are already existing conventions?
- How well were they followed?
- Are there some places that are still following some outdated conventions or no convention at all (and ideally need to be refactored)?

If you decide to change the naming convention, check to see how hard it will be to convert the old code to it as well. If it just affects the naming, most modern IDEs offer an easy rename option. But if the naming convention change involves architecture changes as well, think about how hard it will be to migrate old classes in order for them to fit in the new convention. Then, if you can, refactor. If not, you should at least write comments about your thoughts on the needed refactoring.

### What If You Don’t Know the Function/Purpose Yet?

If you only have a vague idea about what a class is going to be doing when you start to work on it and have a hard time coming up with any name, just call it something ridiculous to remind yourself later that the name needs to be changed. And by ridiculous I don’t mean some vague name like `Manager` or `Handler`; just call it `Dolphin` or `Penguin` or `Fairy` or whatever weird and unrelated name that comes into your mind. It should be strange enough for you to not be tempted to keep it. Later on, when that class is written, it will be easier to give it a proper name.

### It Is Easy to Name If You Have a Class That Does One Thing

If, while asking yourself what/how/where questions, you came up with too many `and`s in your answer, that probably means that a class is doing too much and you should refactor it into smaller classes until you reach the point where you will be able to properly name each of them.

Here is an example:

This class will provide you with special edition (SE) monsters _and_ allow you to purchase those SE bundles _and_ tell you if the promotion video should be shown when you attempt to buy _and_ check for an internet connection because we need to make sure that this SE content is still active _and_ allow you to submit a suggestion for the concept of the next SE monster _and_ give you an option to leave a feedback about the recent SE.

Now let’s take a look at this class and cram in as much logic as possible:

```java
/**
 * It is also called Manager because it does too much and everybody is calling these kinds of classes managers.
 */
class SpecialEditionManager() {

  /**
   * Checks that the bundle isn't purchased yet and attempts the purchase.
   * Shows the "thanks for purchase" message after the successful purchase or error.
   */
  fun purchase(){
    // A lot of code.
    ...
  }

  /**
   * Checks for internet connection and possibly things like the type of the network
   * (mobile/Wi-Fi) or the servers to ensure the SE content is working // and so on.
   */
  fun checkConnection() : Boolean {
      // Also a lot of code.
      ...
  }

  /**
   * Code that requests monsters from the servers and parses it to our
   * monster models and does sorting or some other processing.
   */
  fun getMonsters() : List<Monster>{
    // You get the idea about a lot of code.
    ...
  }

  /**
   * Checks that the submitted monster has all properties set correctly and that said monster
   * doesn't already exist, and then converts this monster to what's required by the server format
   * and sends it out.
   */
  fun submitMonster(monster: Monster){
    ...
  }

  /**
   * Checks if it is the first two weeks of a SE, requests the current promo video, and creates the
   * view to show the promo.
   */
  fun showPromo(){
    ...
  }

  /**
   * Checks that the user is logged in, all contact information is correct, the internet
   * connection is available, and there is a server available to receive this feedback.
   */
  fun sendFeedback(feedback: Feedback){
    ...
  }
}
```

Just imagine how big this class will end up with all of this logic and how hard it is going to be to debug, test, expand, and try to fix something while not breaking the other functionality. Obviously, you will have a hard time naming something like this.

In general, the refactoring will require all of the functionalities described above to be extracted to smaller classes with proper names.

In the end, our `SpecialEditionManager` becomes the following:

- The class that checks on connectivity. Name variants are: `Connectivity`, `ConnectionChecker`, `ConnectivityProvider`.
- `FeedbackSender` will verify and send feedback and will have the `Connectivity` dependency to get networking info.
- The entire monster showing and submitting part can be split into some sort of architectural decision, and for an MVP example, it can become `SpecialEditionInteractor` or a use case combo such as `GetSpecialEditionMonstersUseCase` and `SubmitSpecialEditionMonsterUseCase` followed by `SpecialEditionPresenter` and the multiple views `SpecialEditionMonstersCollectionView`, `SpecialEditionPromoView`, `SpecialEditionMonsterSubmissionView`, and `SpecialEditionFeedbackView`. Notice that the words `UseCase`, `Interactor`, `View`, and `Presenter` will be subjects of the team naming convention described before. Even though these words can still be considered vague, they should have a conventional weight behind them.
- `SpecialEditionBilling` will perform the entire purchase part and provide info on already purchased bundles.

As a result, you will end up with at least six smaller classes after such a refactoring, which will do less, contain scoped logic, and be much easier to name.

### More Words != Better Naming

Using more words to name a single class might sound like a good way to describe what it does, especially after I mentioned `GetSpecialEditionMonstersUseCase`, but more words don’t always make more sense.

For example, consider `SpecialViewingCaseMonsterManagerEventsHandlerActivitySingleton`. It has eight words in its name, but the only words that convey any meaning are:

- `Monster` — since it is one of the models.

- `Singleton` (with the `Activity` scope?) — since it tells us that either it is written that way so you can have only one instance of it at a time, or that the author of this class wanted to convey that intent, but there is nothing preventing you from creating another instance of it.

Notice how the rest of words provide us only with general abstractions, like `Viewing` or `Special`, and the rest of words tell us nothing at all (I’m looking at you, `ManagerListener`).

After checking on what is inside (because again, the naming forced us to do this), we find:

- `SpecialViewingCaseMonster` — shows us the connection to the `SpecialMonsterView` from before.
- `EventsHandler` — after checking what events it handles, it turns out it is about responding to view click events.
- `Manager` — it turns out that the class does a job of presenter and combines/provides the state for our `FavoriteMonsterView`.
- `ActivitySingleton` — the codebase utilizes some sort of dependency injection and the author wanted to make sure this class will be an activity scoped singleton.

Let’s refactor the name to a proper one:

- `SpecialViewingCaseMonster` — Let’s say that it was all about favorite monsters and convert that part to `FavoriteMonster`.
- `EventsHandler` and `Manager` — These two names are talking about the presenter’s job, but most likely in a non-conventional way. After talking with the team, you discover this class was written when they just started to try the MVP out and now they call them presenters, so let’s change it to `Presenter`.
- `ActivitySingleton` — This was added because the team had started introducing dependency injection and it was “the new thing to try out,” but the convention hadn’t been formed yet, thereby leading to this naming addition. Once everybody is comfortable with dependency injection, this part can simply be removed, or you can add it to documentation for this class.

Now `SpecialViewingCaseMonsterManagerEventsHandlerActivitySingleton` becomes `FavoriteMonsterPresenter`, and thanks to naming conventions inside the team, you know what this class is all about.

### Talk to Your Team about Naming

If you’ve considered all the previous sections but are still unable to pick the right name, just discuss it with your team. If you have few names that you think are maybe OK but you are still not sure, add them to the discussion as well. And don’t forget to mention why you think a certain entity should be named a particular way. The feedback and input from someone else is helpful in deciding on a new name.

### Use Documentation to Describe Small Details

If you still want to add more details to help other people understand what the purpose of a particular class is, use comments/documentation. Treat the class documentation as a second source of information that wasn’t important enough to end up in the class name. This can include:

- Dependency injection details — The `ActivitySingleton` naming part from the previous section should end up in class documentation if you still think it’s worth mentioning.
- Refactoring plans — If you have done some refactoring research on the old class but didn’t manage to perform the refactoring, just leave the information as a starting point for a future coder.
- Hidden dependencies — Some older classes might have hidden dependencies leading to unexpected results. Those hidden dependencies are better off being refactored as well, but for now, you can at least describe them in comments.
- Any other details you can think of that would be nice to mention but are too long to put in a class name.

### What Is Wrong with `Manager` Though?

The short answer is nothing. The long answer is nothing is wrong with the word itself, and you can use it if you have a proper convention, since it is still a vague word. But you must know what to expect from a class named `Manager` without looking at its contents — not just that it “manages” something. You can use this word to replace the term “presenter” in MVP if you like. The problem is how overused and smelly this word has become in the coding world because it is used to name classes that are doing too much stuff and usually consist of more than 1,000 lines of code.

### Conclusion

Picking names of classes is not always easy, but hopefully these tips have given you a good starting point. For more on this topic, you might want to read Simone’s article, [Naming Is Hard — Difficulties of Naming Variables][].

[naming is hard — difficulties of naming variables]: https://pspdfkit.com/blog/2018/naming-is-hard/
