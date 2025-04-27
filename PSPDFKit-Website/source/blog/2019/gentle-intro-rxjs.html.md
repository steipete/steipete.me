---
title: "A Gentle Introduction to RxJS"
description: "A short introduction to RxJS, highlighting the differences between traditional event-based JavaScript and the use of Observables."
preview_image: /images/blog/2019/gentle-intro-rxjs/article-header.png
section: blog
author:
  - William Meleyal
author_url:
  - https://meleyal.com
date: 2019-06-19 8:00 UTC
tags: Web, Development, RxJS, How-To
published: true
secret: false
---

This article is a short introduction to [RxJS][], and it focuses on highlighting the differences between traditional event-based JavaScript and the use of Observables.

## What Is RxJS?

RxJS is “a reactive programming library for JavaScript.” More specifically, it’s the JavaScript implementation of [ReactiveX][], which is “an API for asynchronous programming with observable streams.”

This sounds a bit grandiose, so let’s break it down.

The core idea of RxJS is the `Observable`, which is something that generates a sequence (or stream) of values that we can then observe and “react” to.

Observables themselves are an amalgamation of the [Observer pattern][] and the [Iterator pattern][].

### Observer Pattern

If you’ve used `addEventListener` or jQuery’s `$(element).on()`, you’re already familiar with the idea of the Observer pattern. A _Subject_ keeps a list of _Listeners_ subscribed to it. Whenever the state of the _Subject_ changes, it notifies all of its _Listeners_ (in traditional implementations, by calling a Listeners `update()` function).

A naive implementation of the Observer pattern might look as follows:

```js
const Subject = () => {
  let listeners = [];
  let tick = 0;

  setInterval(() => {
    tick += 1;
    listeners.forEach(listener => listener(tick));
  }, 1000);

  return {
    subscribe: listener => listeners.push(listener)
  };
};

const subject = Subject();

subject.subscribe(tick => {
  console.log(`Listener observed tick #${tick}`);
});
```

### Iterator Pattern

The Iterator pattern’s role is to abstract away the details of iterating over a collection of items by wrapping collections in a consistent interface. An _Iterator_ contains (or generates) a sequence of values. The next value in a sequence can be accessed via the _next()_ method, and the _hasNext()_ method indicates whether there are any more values in the sequence.

Since the introduction of [iterators][] in ES6, the Iterator pattern has been baked into JavaScript. JavaScript iterators don’t have a `hasNext()` method. Instead, they return an object with two properties: `value`, the next value in the sequence; and `done`, which is `true` if the last value in the sequence has been reached.

A naive implementation of the Iterator pattern might look as follows:

```js
const Iterator = seq => {
  let index = -1;
  const lastIndex = seq.length - 1;

  return {
    next: () => {
      const value = seq[Math.min((index += 1), lastIndex)];
      const done = value === seq[lastIndex];

      return { value, done };
    }
  };
};

const iterator = Iterator([1, 2, 3]);

iterator.next(); // => { value: 1, done: false }
iterator.next(); // => { value: 2, done: false }
iterator.next(); // => { value: 3, done: true }
```

### Observable Pattern

The Observable pattern combines the two above approaches. An _Observable_ keeps a list of _Observers_ subscribed to it, and it returns a _subscribe()_ function for adding observers. An _Observer_ is an object with `next()`, `error()`, and `complete()` methods.

When an Observable produces a value, it notifies each of its observers by calling their respective methods: `next()` on success, `error()` on error, and `complete()` if the Observable has no more values.

A naive implementation of the Observable pattern might look as follows:

```js
const Observable = () => {
  let observers = [];
  let tick = 0;

  let interval = setInterval(() => {
    if (tick === 5) {
      clearInterval(interval);
      observers.forEach(observer => observer.complete());
    } else {
      tick += 1;
      observers.forEach(observer => observer.next(tick));
    }
  }, 1000);

  return {
    subscribe: observer => observers.push(observer)
  };
};

const observer = {
  next: tick => console.log(`Observer observed tick #${tick}`),
  error: err => console.log(`Observer errored with #${err}`),
  complete: () => console.log(`Observer complete`)
};

const observable = Observable();

observable.subscribe(observer);
```

## Observables vs. Event Listeners

Now that we understand what Observables are, a good way to understand what they offer is to compare them with the way we’d traditionally “observe” events in JavaScript.

Take, for example, a humble `"click"` handler:

```js
const btn = document.getElementById("btn");

btn.addEventListener("click", event => console.log(event));
```

Here’s how we’d write this with RxJS:

```js
const { fromEvent } = rxjs;

const btn = document.getElementById("btn");

// The `$` suffix is an RxJS convention denoting that something is an Observable.
const clicks$ = fromEvent(btn, "click");

clicks$.subscribe(event => console.log(event));
```

These two examples don’t seem that dissimilar, but there’s a fundamental difference that becomes apparent with a more complicated example.

## Fizz Buzz

Let’s say we want to prove our coding chops by implementing [Fizz Buzz][]. Here’s how we might do that in vanilla JavaScript:

```js
const btn = document.getElementById("btn");

// Notice the external state we depend on here.
let clicks = 0;

btn.addEventListener("click", event => {
  clicks += 1;

  if (clicks % 3 === 0 && clicks % 5 === 0) {
    console.log("FizzBuzz");
  } else if (clicks % 3 === 0) {
    console.log("Fizz");
  } else if (clicks % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(clicks);
  }
});
```

Now let’s see how we might write this with RxJS using the [`map`][], [`scan`][], and [`zip`][] functions (or “operators” in RxJS lingo):

```js
// Adapted from https://stackblitz.com/edit/rxjs-fizzbuzz

const { fromEvent, zip } = rxjs;
const { scan, map } = rxjs.operators;

const btn = document.getElementById("btn");

const clicks$ = fromEvent(btn, "click").pipe(
  map(event => 1),
  scan((count, n) => count + n)
);

const fizz$ = clicks$.pipe(map(i => (i % 3 === 0 ? "Fizz" : "")));

const buzz$ = clicks$.pipe(map(i => (i % 5 === 0 ? "Buzz" : "")));

const fizzBuzz$ = zip(clicks$, fizz$, buzz$).pipe(
  map(([n, fizz, buzz]) => fizz + buzz || n)
);

fizzBuzz$.subscribe(i => console.log(i));
```

There are obviously more moving parts here, but the two important points to note are:

- Our `click` events are now a stream of values (`clicks$`) that we can
  query and manipulate to form new streams (`fizz$` and `buzz$`).
- We’ve eliminated the external state, and now everything is contained inside our
  `clicks$` stream.

### Marble Diagrams

Marble diagrams are a helpful way to visualize what’s happening to our event streams as they pass through each stage of our “pipeline.” Below is a diagram showing our Fizz Buzz implementation. The horizontal arrows represent time, circles represent our events, and grouped circles represent arrays of events.

![Fizz Buzz marble diagram](/images/blog/2019/gentle-intro-rxjs/marble.png)

The shift here is away from thinking about events as unique occurrences we need to “handle” individually, and toward thinking about them as sequences of things we can react to if they match a given set of rules.

In a way similar to how we might query a database, with Observables, we can define any number of filters, joins, transforms, thresholds, etc. upfront and react if the resulting event or set of events is something we’re interested in.

## Lodash for Events

RxJS has been described as “[Lodash][] for events.” In the same way that Lodash enables us to work with disparate collections of known values, Observables give us the same power to work with collections of asynchronous events.

Like Lodash, the [API surface is large][rxjs api], and it includes many of the same type of functions. However, once you understand the core principle of Observers, the API seems less daunting. There’s a predefined operator for almost any type of transformation you can imagine, all working with Observables as the core primitive.

The following table shows where Observables fill the gap in terms of working with asynchronous collections of data:

| &nbsp;     | Sync     | Async                    |
| ---------- | -------- | ------------------------ |
| Single     | Variable | Promise (or async/await) |
| Collection | Array    | Observable               |

<small class="text-muted">
Credit: <i><a href="https://pragprog.com/book/rkrxjs/build-reactive-websites-with-rxjs">Build Reactive Websites with RxJS</a></i>
</small>

## Not Just for DOM Events

It’s worth noting that Observables are not only useful for working with DOM events. Anything you can conceive of that returns a value or series of values can be modeled as an Observable:

```js
const { from } = rxjs;

from([1, 2, 3]).subscribe(x => console.log(x));

// Logs:
// 1
// 2
// 3
```

```js
const { ajax } = rxjs;

ajax("/api/example.json").subscribe(data => console.log(data.response));

// Logs:
// { "hello": "world" }
```

In the [Learn RxJS guide][], there are many more interesting use cases to get you thinking in terms of Observables.

## Conclusion

Observables can take a little time to wrap your head around, but it’s worth persevering, as when you do, you’ll start to see uses for them everywhere. There’s a [TC39 proposal][] to add them to a future version of JavaScript, and as the most popular implementation is RxJS, that’s what they’re likely to resemble.

We only briefly touched on RxJS here, but there are implementations of Rx for [a range of languages][rxjs-languages], meaning everything you learn can be transferred to other platforms. Indeed, we use RxJava right here at PSPDFKit in [PSPDFKit for Android][].

[rxjs]: https://rxjs.dev/
[reactivex]: http://reactivex.io/
[observer pattern]: https://en.wikipedia.org/wiki/Observer_pattern
[iterator pattern]: https://en.wikipedia.org/wiki/Iterator_pattern
[iterators]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Iterators
[fizz buzz]: http://wiki.c2.com/?FizzBuzzTest
[`map`]: https://rxjs.dev/api/operators/map
[`scan`]: https://rxjs.dev/api/operators/scan
[`zip`]: https://rxjs.dev/api/index/function/zip
[lodash]: https://lodash.com/
[rxjs api]: https://rxjs.dev/api
[learn rxjs guide]: https://www.learnrxjs.io/
[tc39 proposal]: https://github.com/tc39/proposal-observable
[rxjs-languages]: http://reactivex.io/languages.html
[pspdfkit for android]: https://pspdfkit.com/pdf-sdk/android/
