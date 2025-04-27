---
title: "How to Effectively Measure the Performance of Your Code"
description: "This blog post explains why software that performs well is important and how we measure code performance at PSPDFKit."
preview_image: /images/blog/2020/how-to-effectively-measure-performance-code/article-header.png
section: blog
author:
  - Daniel Martín
author_url:
  - https://twitter.com/dmartincy
date: 2020-01-01 8:00 UTC
tags: Development, C++
published: true
secret: true
---

We all love software that is fast. But even though computing devices get faster every year, in order to provide a good experience for our users, we should measure the performance of our code to ensure it uses computing resources efficiently.

READMORE

This article will explain what the “performance” of code is and why it is important, and it will share some tools and practices we use at PSPDFKit to measure code performance.

## What Is the Performance of Code?

[Wiktionary says][performance definition] that performance is “the amount of useful work accomplished estimated in terms of time needed, resources used, etc.” In the context of this article, the time needed directly depends on how the code uses the CPU, and the resources used refer to the computer memory. For the rest of the article, we will focus on CPU usage, as memory deserves its own article.

## Why Is Code Performance Important?

Code performance is important because it limits the amount of data a program can handle. Imagine you are working on an application that lets users access web forums organized by topic, with the ability to read and post from a smartphone. If you let people use the app without an internet connection, the app may need to store some data on the smartphone. It’s difficult to estimate the amount of data that will be stored, but you can predict that if the user loves the app, you will need to store a lot of forum posts. Here we have an example function that searches the forums for a specific post:

```cpp
Post search_post(int post_id) {
  for (const auto& forum: web_forums) {
    for (const auto& post: forum) {
      // Check if the post is what you are looking for, and if so, return it.
    }
  }
}
```

If you always test `search_post` with small amounts of data, you may not notice any significant slowness when searching for posts. However, when a user who loves the app stores a lot of posts, the function suddenly does not perform so well and you will likely get support complaints about the app taking a long time to search for information.

Why does this happen? This is an example of a function whose CPU execution time grows proportional to the number of web forums and posts per forum. When the data gets really big, the function might get so slow that it makes the app unusable.

But all of this is theory (if you are curious, this is formally called “[asymptotic computational complexity][asymptotic-computational-complexity]”). And before you try to improve the performance of any application, you should _always_ check things in practice. Things like the computer architecture, compiler optimizations, and the amount and shape of the input data all have a great impact on the real performance of an algorithm.

Now, in the next section, I’ll explain one way we measure performance at PSPDFKit.

## How We Measure Code Performance at PSPDFKit

At PSPDFKit, we have several products, and the way we measure code performance is different depending on the product, so I’ll focus on our core engine in this article. The main aspects we want to measure in our core engine are:

- Rendering performance
- Annotation load performance
- Text parsing performance
- PDF table of contents parsing performance
- PDF JavaScript performance (yes, [PDFs can contain JavaScript code][pdf-javascript]!)
- Library indexing performance

For each of these areas, we write specialized tests called benchmark tests. In C++, we use the [Google Benchmark][google-benchmarks] library, which has a syntax similar to the one in the library we use for unit testing code, [Google Test][google-test]. This is a simplified version of a Google Benchmark test that is currently in our codebase:

```cpp
BENCHMARK_F(TextParsing, GetText)(benchmark::State& state) {
    benchmarkSegment(state, [&]() {
        for (int i = 0; i < PAGES_IN_DOCUMENT; i++) {
            document->getTextParserForPage(i)->text();
        }
    });
}
```

For performance-critical functions like the one above, which extracts text from a PDF page, a very focused benchmark usually accompanies the unit tests for it. But what are the best metrics for benchmarks? We think that mean execution time (execution time divided by the number of benchmark iterations) and its standard deviation are good initial metrics. And [least squares regression][least-squares] adds more stability to the mean value to avoid some measurement noise.

All of the above seems easy, but the main difficulty of benchmarking code is that benchmarks need to provide stable results. If benchmark results vary greatly from run to run, developers will spend a lot of time investigating if the code is slow or if the actual test is the problem. Measurements are only as good as the environment in which they’re gathered, so we suggest two things to minimize the impact of the environment on your benchmark results:

- Use a dedicated machine to run benchmarks. Background processes can affect the results, so we have a dedicated machine in our continuous integration system that only runs benchmarks.
- Run the benchmark test a few times before actually measuring time. This is called a warmup step and will prepare the operating system caches, etc. so that results are more stable.

How you write benchmark tests is also important. In our experience, the main causes of flaky unit tests are similar to the main causes of flaky benchmark tests. To mitigate flakiness, disk or network access should be stubbed out in the tests if possible. Benchmark tests, as well as unit tests, should test small functions. If you benchmark a large amount of code, a slowdown will be much more difficult to diagnose.

Even if best practices are followed, anomalies in benchmark results are inevitable, and our goal is to identify and remove them. Bogus results will show as clear outliers in the test results, and they can be discarded if the focus is not on individual benchmark results, but rather on an aggregated set of results over a period of time (for example, a week).

## Conclusion

Code performance is important, and measuring it effectively is a problem for many software teams. There are several external factors that affect the running time of a program, so the goal of any team introducing benchmarks to its codebase should be to reduce those external factors to the minimum.

We found that interpreting the output of flaky benchmarks (benchmarks whose running time varies abruptly even if the underlying code that is tested does not change) is time consuming, and just like flaky tests in general, they should be marked, isolated, and addressed promptly to avoid introducing performance regressions to a codebase.

[performance definition]: https://en.wiktionary.org/wiki/performance
[asymptotic-computational-complexity]: https://en.wikipedia.org/wiki/Asymptotic_computational_complexity
[google-benchmarks]: https://github.com/google/benchmark
[google-test]: https://github.com/google/googletest
[least-squares]: https://en.wikipedia.org/wiki/Least_squares
[pdf-javascript]: https://pspdfkit.com/blog/2018/how-to-program-a-calculator-pdf/
