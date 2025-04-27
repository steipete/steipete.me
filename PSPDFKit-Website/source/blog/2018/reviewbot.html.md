---
title: "Reviewbot"
description: "Reviewbot posts GitHub pull requests that are ready to be reviewed into Slack. How does it know when a pull request is ready? We have a special label in our repositories, named `READY TO REVIEW`."
preview_image: /images/blog/2018/reviewbot/reviewbot-logo.png
section: blog
author:
  - Julian Grosshauser
author_url:
  - https://twitter.com/jgrosshauser
date: 2018-05-29 12:00 UTC
tags: Development, OpenSource
published: true
---

At PSPDFKit, we started something called “Experimental Fridays.” Similar to Google’s 20% time policy, all the engineers here get to use specific Fridays to work on what they deem most important. It’s up to the individual to decide what’s important, and it doesn’t have to be in the person’s area of expertise. People are free to experiment with whatever interests them, hence the name.

READMORE

One of the projects that came out of Experimental Fridays is a Slack bot called [Reviewbot](https://github.com/PSPDFKit-labs/reviewbot).

Reviewbot posts GitHub pull requests that are ready to be reviewed into Slack. How does it know when a pull request is ready? We have a special label in our repositories, aptly named `READY TO REVIEW` (all caps so it’s easier to spot). When a pull request is ready for review, the author adds this label to their PR to mark it as finished. Meanwhile, all pull requests without this label are seen as works in progress and shouldn’t be reviewed. Next, an engineer can pick from the `READY TO REVIEW` pull requests and start reviewing — all code changes at PSPDFKit get reviewed by at least one other person. After the review is done, the pull request author incorporates the feedback and merges the PR.

![Reviewbot in action](/images/blog/2018/reviewbot/reviewbot-in-action.gif)

Reviewbot needs to know a few things before it can show you reviewable pull requests. You need to set your GitHub username and the repositories you’re interested in. There’s also a setting for special labels: Because we’re using a [monorepo](/blog/2016/selective-pull-request-testing/) that [all of our platforms](/pdf-sdk/) share, we have to have individual labels for `iOS`, `Android`, `Core`, `UWP`, etc. So, for example, an engineer on the iOS team would set their labels to `iOS` in order to only get iOS pull requests. Reviewbot saves all of this information for every Slack user in a PostgreSQL database.

In addition to responding to individual users, Reviewbot also posts pull requests in need of a review in specific channels every morning, e.g. iOS pull requests in the #ios channel. This is done with [rake](https://github.com/ruby/rake) tasks and the [Heroku Scheduler](https://devcenter.heroku.com/articles/scheduler). By receiving a list of ready pull requests directly in Slack, it’s easy for engineers to start their day reviewing code.

![Reviewbot posts into channel](/images/blog/2018/reviewbot/reviewbot-posts-into-channel.png)

Reviewbot uses the Ruby Slack bot framework [`slack-ruby-bot`](https://github.com/slack-ruby/slack-ruby-bot). Basically all the heavy lifting is done by this gem, and the [documentation](https://github.com/slack-ruby/slack-ruby-bot/blob/master/README.md) and [examples](https://github.com/slack-ruby/slack-ruby-bot/tree/master/examples) are great. Reviewbot is based on the MVC example called [inventory](https://github.com/slack-ruby/slack-ruby-bot/tree/master/examples/inventory). Reviewbot also uses [Octokit](http://octokit.github.io/octokit.rb) to communicate with GitHub.

You can see the code for [Reviewbot on GitHub](https://github.com/PSPDFKit-labs/reviewbot).

We hope that you find Reviewbot helpful and that you can integrate it into your workflow. Feel free to submit an issue or pull request if you run into a bug or if something is too specific to our use case here at PSPDFKit.
