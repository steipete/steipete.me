---
title: "Writing Concise Code with Kotlin and RxJava"
description: Tips and tricks how to write readable, concise, and beautiful code using the Kotlin language and RxJava.
section: blog
author:
  - David Schreiber-Ranner
author_url:
  - https://twitter.com/flashmasterdash
date: 2017-03-22 12:00 UTC
tags: Android, Development, Kotlin, RxJava
preview_image: /images/blog/2017/writing-concise-code-with-kotlin-and-rxjava/kotlin-and-rxjava.png
published: true
---

One of the reasons I _love_ [Kotlin](https://kotlinlang.org/) is its expressiveness compared to Java. In Kotlin, you can implement much more logic with fewer characters, making Java look something like a "boilerplate language." It is particularly visible when dealing with [RxJava](https://github.com/ReactiveX/RxJava) which makes heavy use of [single-method interfaces](https://dzone.com/articles/java-8-functional-interfaces-sam), which, in Java 7, are implemented using anonymous classes. (And conciseness isn't exactly the strength of those classes.)

READMORE

> Lambda expressions, supportive type inference, optional function arguments, omitted semicolons – _Kotlin gets rid of code verbosity_

To show the power of Kotlin, we start off with a small Java example: A fictitious GitHub client for accessing the data of a Git repository.

## A Simple GitHub API

The tools and techniques presented in this article can be applied to any application using RxJava and Kotlin. Since I assume you know GitHub, this example uses a small API for accessing repositories on GitHub and implements the logic for retrieving the top contributor of a repository (that's the user with the most commits pushed to the repo).

Our `GitHubApi` example is quite straightforward:

```java
public interface GitHubApi {
    /** Fetches a repository using its name (e.g. PSPDFKit-labs/QuickDemo). */
    Single<Repository> getRepository(String repositoryName);
}

public interface Repository {
    /** Returns the name of the GitHub repository. */
    String getName();
    /** Fetches a list of all GitHub users that contributed to this repository. */
    Single<List<Contributor>> getContributors();
}

public interface Contributor {
    /** Returns the username of the contributor. */
    String getLoginName();
    /** Returns the total number of commits pushed to this repository. */
    int getNumberOfCommits();
}
```

`GitHubApi` has a single method `getRepository(String repositoryName)` which performs an asynchronous operation and returns its result via a RxJava [`Single`].

> [`Single`] is an asynchronously retrieved _one-shot value_. This stands in contrast to the [`Observable`] and [`Flowable`] which represent _streams of data_. While it would be possible to build the same API using streams, a [`Single`] makes our code much simpler and easier to use.

## The Verbosity of Java

Here's how our Java application can retrieve the top contributor for a single repository. Pull yourself together! If you can't read this, just skip to the next section and see how it reads in Kotlin.

```java
public void printTopContributor(GitHubApi gitHubApi, final String repoName) {
    // 1. Fetch the repository.
    gitHubApi.getRepository(repoName)
        // 2. Fetch a list of all contributors.
        .flatMap(new Function<Repository, SingleSource<? extends List<Contributor>>>() {
            @Override
            public SingleSource<? extends List<Contributor>> apply(Repository repository) throws Exception {
                return repository.getContributors();
            }
        })
        // 3. Convert the list to an Observable emitting contributors on after another.
        .flatMapObservable(new Function<List<Contributor>, ObservableSource<? extends Contributor>>() {
            @Override
            public ObservableSource<? extends Contributor> apply(List<Contributor> contributors) throws Exception {
                return Observable.fromIterable(contributors);
            }
        })
        // 4. Sort emitted values.
        .sorted(new Comparator<Contributor>() {
            @Override
            public int compare(Contributor o1, Contributor o2) {
                return o2.getNumberOfCommits() - o1.getNumberOfCommits();
            }
        })
        // 5. Take the first contributor and convert the result to a Single.
        .firstOrError()
        // 6. Print the top contributor's name.
        .subscribe(new Consumer<Contributor>() {
            @Override
            public void accept(Contributor contributor) throws Exception {
                print(contributor.getLoginName());
            }
        }, new Consumer<Throwable>() {
            @Override
            public void accept(Throwable throwable) throws Exception {
                logError(throwable, "Error while trying to find the top contributor.");
            }
        });
}
```

<img src="/images/blog/2017/writing-concise-code-with-kotlin-and-rxjava/get_to_the_chopper.jpg" title="Get to the chopper" width="300" />

Okay... it's not _that_ bad. But also not easy to read. Let's look at how this method looks like after we translate it to Kotlin.

## The Simplicity of Kotlin

```kotlin
fun printTopContributor(gitHubApi: GitHubApi, repoName: String) {
    gitHubApi.getRepository(repoName)
        .flatMap { repository -> repository.contributors }
        .flatMapObservable { contributors -> Observable.fromIterable(contributors) }
        .sorted { o1, o2 -> o2.numberOfCommits - o1.numberOfCommits }
        .firstOrError()
        .subscribe(
            { contributor -> print(contributor.loginName) },
            { throwable -> logError(throwable, "Error while trying to find the top contributor.") }
        )
}
```

This Kotlin code uses the same `GitHubApi` its Java cousin used, however, the code that is required to use the API is reduced to a bare minimum. While the benefit of Kotlin should already be clearly visible, let's further enhance this using Kotlin's **extension functions**.

### Getting Rid of Repetitive RxJava Ceremonies

There are a bunch of common code patterns that developers need to use when working with RxJava. These patterns include:

* Converting a `List` result to an observable stream using [`flatMap()`] and [`fromIterable()`].
* Converting [`Single`] instances to [`Observable`] instances and vice versa.
* Continuing an asynchronous call chain, by triggering another asynchronous operation on the result of a previous one (usually also using [`flatMap()`]).

These operations are repetitive, and their only purpose is to tame the asynchronous nature of RxJava. Using Kotlin's [extension functions](https://kotlinlang.org/docs/reference/extensions.html#extension-functions) it is possible to extract these common patterns.

In our Kotlin example on line 3, we use the [`flatMap()`] operator to transform the `Single<Repository>` into a `Single<List<Contributor>>` by calling `repository.getContributors()` on the result. Furthermore, in lines 4 and 5 we transform the `Single<List<Contributor>>` into an `Observable<Contributor>` and sort all emitted contributor objects by comparing their commit count. Using extension functions, we can entirely extract the present RxJava boilerplate logic from our function, making the code even more expressive.

```kotlin
/** Get the contributors of the repository. */
fun Single<out Repository>.getContributors(): Single<out List<Contributor>>
    = flatMap { repository -> repository.contributors }

/** Sort the contributors and return them as an observable. */
fun Single<out List<Contributor>>.sortByNumberOfCommits(): Observable<out Contributor>
    = flatMapObservable { contributors -> Observable.fromIterable(contributors) }
        .sorted { o1, o2 -> o2.numberOfCommits - o1.numberOfCommits }
```

The resulting `printTopContributor()` method just became a bit more readable.

```kotlin
private fun printTopContributor(gitHubApi: GitHubApi, repoName: String) {
    gitHubApi.getRepository(repoName)
        .getContributors()
        .sortByNumberOfCommits()
        .firstOrError()
        .subscribe(
            { contributor -> print(contributor.loginName) },
            { throwable -> logError(throwable, "Error while trying to find the top contributor.") }
        )
}
```

RxJava and Kotlin are definitely a perfect match when it comes to combining the power of reactive programming and the expressiveness of modern languages. The techniques shown in this article should serve as a nudge into the right direction for any developers striving to make their code more readable and, thus, more robust.

At PSPDFKit, we know the importance of keeping code readable, and thus make active use of these techniques. (For example in our [PDF Viewer for Android](https://pdfviewer.io/) which is written entirely in Kotlin.)

Keep coding!
David

[`Single`]: http://reactivex.io/RxJava/javadoc/io/reactivex/Single.html
[`Observable`]: http://reactivex.io/RxJava/javadoc/io/reactivex/Observable.html
[`Flowable`]: http://reactivex.io/RxJava/javadoc/io/reactivex/Flowable.html
[`flatMap()`]: http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/Observable.html#flatMap(io.reactivex.functions.Function)
[`fromIterable()`]: http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/Observable.html#fromIterable(java.lang.Iterable)
