---
title: "Immutable.js and Lazy Evaluation"
description: "A short introduction to Immutable.js and how lazy operations improve performance and readability of your code."
preview_image: /images/blog/2018/immutablejs-and-lazy-evaluation/article-header.png
section: blog
author:
  - Maximilian Störchle
author_url:
  - https://twitter.com/max_hoyd
date: 2018-08-13 12:00 UTC
tags: Development, Web
published: true
---

At PSPDFKit, we have a strong bias toward functional programming, which emphasizes immutability. Using immutable data structures has a lot of benefits in regard to the readability of your code, and it also makes it easier to reason about it. In this blog post, I will point out a few of these benefits and explain lazy operations that will also improve the performance of your code based on a simple example.

# Immutable Data Structures

Immutable persistent data structures are data structures that can’t be mutated after they are initiated and therefore will always hold the same value after one is set. Operations on these data structures will not change them but will instead return new values. For example, when an operation is evaluated over an immutable list, the operation will return a new list instead of changing the original list. This may sound like a big performance hit, because a lot of copying takes place when you save the return values of an operation to another immutable data structure, but [hash map tries][] and [vector tries][] enable structural sharing, which minimizes the need to actually copy the data and save it in a memory-efficient way.

[Immutable.js][] is one of the JavaScript libraries we use at PSPDFKit, and it implements many persistent immutable data structures. In addition to the advantages of using immutable data structures described above, we also benefit from them in terms of performance. The reason for this is that we use [React][] to build our user interfaces. Immutable data structures provide a fast way of comparing data, because you don’t need to do a deep comparison in nested data structures, and [React][] often needs such comparisons for deciding if a component should update.

# A Simple Example

To illustrate how immutable data structures can improve the readability of your code and how lazy operations work on persistent immutable data structures, let’s look a simple example where we have a list of people and want to calculate the average height for everyone older than 20. The list only contains each person’s birth year and their height in inches. The output should be the average height in centimeters for all people older than 20.

When looking at such an example, we can easily find the operations we need to apply to our data structure to get to the desired result:

- Calculate the age for every person.
- Filter every person by age.
- Convert the height of everyone older than 20 to centimeters.
- Sum up the heights and divide by the total amount of people.

Now, let’s look at the example input data:

[==

```es
const persons = [
  { bornIn: 1988, height: 78 },
  { bornIn: 1983, height: 72 },
  { bornIn: 2001, height: 66 },
  { bornIn: 1995, height: 68 },
  { bornIn: 1999, height: 70 },
  { bornIn: 2007, height: 58 },
  { bornIn: 1973, height: 69 },
  { bornIn: 1992, height: 71 },
  { bornIn: 1995, height: 50 },
  { bornIn: 1996, height: 75 },
  { bornIn: 1998, height: 63 }
];
```

```js
var persons = [
  { bornIn: 1988, height: 78 },
  { bornIn: 1983, height: 72 },
  { bornIn: 2001, height: 66 },
  { bornIn: 1995, height: 68 },
  { bornIn: 1999, height: 70 },
  { bornIn: 2007, height: 58 },
  { bornIn: 1973, height: 69 },
  { bornIn: 1992, height: 71 },
  { bornIn: 1995, height: 50 },
  { bornIn: 1996, height: 75 },
  { bornIn: 1998, height: 63 }
];
```

==]

The first thing we’ll do with this JavaScript array is convert it to an [Immutable.js][] list of maps. This can be done with the `Immutable.fromJS` function:

[==

```es
Immutable.fromJS(persons)
```

```js
Immutable.fromJS(persons)
```

==]

Now it’s time to implement the functions needed for the first three points on our list:

[==

```es
const currentYear = 2018;
const calculateAge = bornIn => currentYear - bornIn;

const inchInCentimeters = 2.54;
const convertToCentimeters = heightInInches => heightInInches * inchInCentimeters;

const addAge = person => person.set('age', calculateAge(person.get('bornIn')));
const convertHeight = person => person.update('height', convertToCentimeters);

const olderThan20 = person => person.get('age') > 20; // Returns true if the person is older than 20.
```

```js
var currentYear = 2018;
var calculateAge = function(bornIn) {
  return currentYear - bornIn;
}

var inchInCentimeters = 2.54;
var convertToCentimeters = function(heightInInches) {
  return heightInInches * inchInCentimeters;
}

var addAge = function(person) {
  return person.set('age', calculateAge(person.get('bornIn')));
}
var convertHeight = function(person) {
  return person.update('height', convertToCentimeters);
}

var olderThan20 = function(person) {
  return person.get('age') > 20; // Returns true if the person is older than 20.
}
```

==]

After defining the functions, we can chain them together to get a list of all people older than 20 with their calculated ages and their respective heights in centimeters:

[==

```es
const selectedPeople = Immutable.fromJS(persons)
  .map(addAge)
  .filter(olderThan20)
  .map(convertHeight);
```

```js
var selectedPeople = Immutable.fromJS(persons)
  .map(addAge)
  .filter(olderThan20)
  .map(convertHeight);
```

==]

With the list of the selected people (all people, older than 20) and their converted heights, we’re now able to calculate the average height for them and print the resulting value to the console:

[==

```es
const avgHeight = persons => {
  [sum, count] = persons.reduce(([sum, count], person) => [sum + person.get('height'), count + 1], [0, 0]);
  return sum / count;
}

console.log(avgHeight(selectedPeople)); // Output: "175.26000000000002"
```

```js
var avgHeight = function(persons) {
  var sumAndCount = persons.reduce(function (accumulator, person) {
      var sum = accumulator[0];
      var count = accumulator[1];
      return [sum + person.get('height'), count + 1]
    },
    [0, 0]
  );
  var sum = sumAndCount[0];
  var count = sumAndCount[1];
  return sum / count;
}

console.log(avgHeight(selectedPeople)); // Output: "175.26000000000002"
```

==]

The use of simple and small functions chained together makes this code easy to understand, but there’s a problem with this declarative approach: We have to iterate multiple times over our dataset, which could cause performance problems when dealing with a lot of data. This means that the complexity of these operations is `k O(n)` but can be easily improved to a complexity of `O(n)`. A simple solution to this problem is to only iterate over the dataset once by combining all functions in one `reduce` call:

[==

```es
const calculateAvgForPeopleOlderThan20 = persons => {
  const [sum, count] = Immutable.fromJS(persons).reduce(
    ([sum, count], person) =>
      calculateAge(person.get('bornIn')) > 20
        ? [sum + convertToCentimeters(person.get('height')), count + 1]
        : [sum, count],
    [0, 0]
  );
  return sum / count;
};

console.log(calculateAvgForPeopleOlderThan20(persons)); // Output: "175.26000000000002"
```

```js
var calculateAvgForPeopleOlderThan20 = function(persons) {
  var sumAndCount = Immutable.fromJS(persons).reduce(
    function (accumulator, person) {
      var sum = accumulator[0];
      var count = accumulator[1];
      return calculateAge(person.get('bornIn')) > 20
        ? [sum + convertToCentimeters(person.get('height')), count + 1]
        : [sum, count]
    },
    [0, 0]
  );
  var sum = sumAndCount[0];
  var count = sumAndCount[1];
  return sum / count;
};

console.log(calculateAvgForPeopleOlderThan20(persons)); // Output: "175.26000000000002"
```

==]

Although we accomplished what we aimed for with the above, we also sacrificed the readability of our code, which makes it harder for other developers to reason about the code and to maintain and understand it. This is one example where [lazy evaluation][] will fit in nicely and provide you the best of both worlds: the declarative and composable way of programming of our first implementation, and the performance optimization of our second implementation.

# Lazy Evaluation

Lazy evaluation delays the evaluation of an expression until the value is needed, and it also avoids repeated evaluations. [Immutable.js][] provides lazy evaluations through the `Seq` data structure. We can modify our first implementation to work on a `Seq` instead of iterating over the list multiple times:

[==

```es
const selectedPeople = Immutable.fromJS(persons)
  .toSeq()
  .map(addAge)
  .filter(olderThan20)
  .map(convertHeight);

console.log(avgHeight(selectedPeople)); // Output: "175.26000000000002"
```

```js
var selectedPeople = Immutable.fromJS(persons)
  .toSeq()
  .map(addAge)
  .filter(olderThan20)
  .map(convertHeight);

console.log(avgHeight(selectedPeople)); // Output: "175.26000000000002"
```

==]

The only thing we had to do here was insert `.toSeq()` after we converted the JavaScript array to the [Immutable.js][] list. Now, instead of iterating over the dataset multiple times when being executed, the evaluation will happen lazily. Because only the expressions that are really needed get evaluated when using lazy evaluation, it’s also possible to call higher-order collection methods on infinite collections. For example, we could get the first 10 even numbers by evaluating the following code:

[==

```es
const isEven = x =>  Math.abs(x % 2) == 0
console.log(Immutable.Range(0, Infinity).filter(isEven).take(10).toArray())
// Output: "[0, 2, 4, 6, 8, 10, 12, 14, 16, 18]"
```

```js
var isEven = function(x) { return Math.abs(x % 2) == 0 }
console.log(Immutable.Range(0, Infinity).filter(isEven).take(10).toArray())
// Output: "[0, 2, 4, 6, 8, 10, 12, 14, 16, 18]"
```

==]

# Conclusion

Immutable persistent data structures provide declarative, compositional, and — through structural sharing and lazy evaluation — efficient ways to code, which makes it easier to understand and maintain your code. For this reason, [the entire state](https://pspdfkit.com/api/web/PSPDFKit.Immutable.html) for [PSPDFKit for Web] is stored in [Immutable.js][] objects.

[Immutable.js]: https://facebook.github.io/immutable-js/
[hash map tries]: https://en.wikipedia.org/wiki/Hash_array_mapped_trie
[vector tries]: https://hypirion.com/musings/understanding-persistent-vector-pt-1
[React]: https://reactjs.org/
[lazy evaluation]: https://en.wikipedia.org/wiki/Lazy_evaluation
[PSPDFKit for Web]: https://pspdfkit.com/pdf-sdk/web/
