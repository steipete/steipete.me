---
title: "Adding live search to Jazzy docs"
section: blog

author: Esad Hajdarevic
author_url: https://twitter.com/esad
date: 2016-04-18 12:00 UTC
tags: iOS, Development
published: true
---

At PSPDFKit, we use [Jazzy](https://github.com/realm/jazzy) to generate our great-looking iOS [API docs](/api/ios/). Jazzy is an Objective-C/Swift documentation generator built by the team at [Realm](https://realm.io). Jazzy uses Clang and SourceKit instead of implementing its own parser to extract the documentation from source files. This is the same parser that powers the syntax highlighting in Xcode and features like ⌘+clicking a token to navigate to its definition.

Having access to the syntax tree while generating documentation comes in handy. For example, just couple of weeks ago, we [extended Jazzy](https://github.com/realm/jazzy/pull/466) so that documentation for Objective-C categories appear under the documentation of the extended class. This week, we added live client-side search to our documentation. We had previous success with [lunr.js](http://lunrjs.com) for adding live search to our [Guides](https://pspdfkit.com/guides/ios/current/), so we decided to see if it would work for searching the source declarations (spoiler: it does):

![Jazzy search in action](/images/blog/2016/jazzy-search.gif)

Lunr.js is a simple, 15 KB-minified, JS library for implementing full-text search in the browser. You pass it a number of JSON objects, it optionally performs some operations on the fields (like stemming, in which related words are reduced down to their stem, so that non-exact search terms still match relevant documents) and then it stores the tokenized fields in the [trie](https://en.wikipedia.org/wiki/Trie)-like structure that you can query.

Due to our iOS codebase being rather large (around 300 classes with 1500 method declarations), I initially fell into the premature optimization trap of thinking that building an index for this amount of documents is costly and therefore has to be done at the time the docs are generated. Once this costly index generation is performed, it could be loaded into lunr.js, immediately ready to be queried.

After generating a list of declarations from Jazzy and passing it to a node script that uses lunr.js to build and then output the serialized index, I ended up with a ~15 MB index file. Keeping in mind that this file has to be fully downloaded before the first search can be performed, this was not really acceptable. Turning off stemmer in the lunr.js processing pipeline (which for simple declaration lookup isn't necessary) reduced the index to ~7 MB, but this was still too big for the live search use-case.

At this point, to get an idea of how much the index overhead was I decided to simply dump all declarations found by Jazzy into a JSON file. This is a "raw" dump of all declarations, their parent declarations, documentation abstract and the URL the search result should point to:

![Excerpt from search.json](/images/blog/2016/jazzy-search-json.png)

The resulting file was only ~1 MB. However, I expected the indexing to take a long time, but it only took <200ms on my MacBook Pro. So here it was, the solution to the problem - we can have Jazzy generate the list of declarations, and index it on the client.

Finally, we put together a small [typeahead.js](https://twitter.github.io/typeahead.js/) wrapper around the search box, had it query the lunr.js and voilà - we have working search.

We're going to work a bit more on it - adding tweaks like method/property categorization images and then look into how we can contribute this back to the open source Jazzy project. You can follow the progress in our [fork](https://github.com/PSPDFKit-labs/jazzy/tree/search).
