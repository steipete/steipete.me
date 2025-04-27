---
title: "Effective Remote Communication"
description: "Communication is hard — especially for remote companies. Here's how we organize communication at PSPDFKit."
preview_image: /images/blog/2018/effective-remote-communication/header.png
section: blog
author:
  - Peter Steinberger
author_url:
  - https://twitter.com/steipete
date: 2018-08-08 04:00 UTC
tags: Company, Culture
cta: jobs
published: true
---

In the first part of our series on communication, [How to Use Slack and Not Go Crazy](/blog/2018/how-to-use-slack-and-not-go-crazy), we talked about the pros and cons of using Slack for communicating. However, Slack is only one of the tools we use. In this second part, you’ll learn how we organize meetings, how we structure internal documentation, and what we do as a remote team to be effective — from one-on-ones to retreats.

## Monday Meetings and Demos

Every Monday we have a company-wide meeting where one person (usually me) presents updates across all projects for the week, along with an outlook for the week to come. This is the place where we share new projects, like our PDFKit compatibility layer, PDFXKit, or changes to the roadmap. Sometimes we focus on an update such as how our apps our doing. Monday is also used to demo new features, so everyone from the team gets a chance to show what they’ve been working on. We limit demos to one or two each Monday in order to keep the entire meeting under 40 minutes. Monday is also the day when each team has an internal meeting to discuss what to work on next, along with problems or anything else that requires the whole team. The advantage of the Monday meetings is we start off the week on the right foot by bringing everyone up to date and being able to reflect on the previous week after having the weekend off.

![](/images/blog/2018/how-to-use-slack-and-not-go-crazy/meeting.png)

## Playbook

Since we’re a distributed team, timezones are something we have to think about. Some people might start their days as others are finishing, and getting pings at 2am with questions is neither fun nor effective. But that doesn’t change the fact that there are countless questions people might have: How do I get the password for X? What do I do if an angry customer pings us on support? How can I access the company calendar? For teams sharing an office, you can just turn around, ask a question, and the problem is solved. But when working in a remote setting, you first need to think about who to ask, then check if they are online, and work your way up — or else hope someone will read it in a channel.

But effective communication also means minimizing disruptions. And we realized at some point that many questions are similar, so we started documenting everything, from how to handle support, to detailed information about employee onboarding, to hiring email templates. We write these things down in our Playbook, which is something like an internal start page. In reality, it’s just a Google Doc with lots of headlines and links to other documents explaining things. So if someone want to know how to handle code contributions or needs to know what the blog post process is, it’s all there.

The Playbook also lists the people you can ping in case a question isn’t answered in full, and everybody can propose edits. It isn’t something people need on a daily basis, but it’s incredibly useful for new hires and still gets use by older employees as well.

## Documentation

In addition to our internal documentation, public-facing documentation is another important part of communication. One reason why we are so active on our blog is because we know that writing good documentation is hard, and if we spend so much time writing things up for ourselves, why not share it with the community? For example, our internal [ccache](/blog/2015/ccache-for-fun-and-profit/) and [distcc guides](/blog/2017/crazy-fast-builds-using-distcc/) are just a few sentences long with IP addresses and a link to the blog posts, because that’s our main documentation. We also ask new hires to read the last two years’ worth of our blog posts, especially the product update posts. What better way to learn what PSPDFKit can do than to read about it?

The same is true for our documentation: I regularly open the [guide for advanced crash symbolication](/guides/ios/current/troubleshooting/advanced-symbolication/), as it’s simply one of the most detailed guides on how to use Atos and how these UUIDs work. This helps our customers, us, and everyone else in the community.

## Public Roadmaps

Our roadmaps are shared in Google Drive with the entire company. Every project has a document, and we also have documents for high-level goals and ideas for the futures. Things change fast at PSPDFKit, but we try to maintain a fairly clear roadmap for the current year and at least a general outlook for the following one.

## Issues and Bug Tracking

Just like with code, issues are written once and read many times.

We noticed that issues were sometimes underspecified, which led to miscommunication between the issue author and assignee. This resulted in people sometimes working in the wrong direction, causing duplicate work and frustration on both sides. Often someone writes a new ticket that consists of a couple sentences, and they’re certain it’s enough because it just seems obvious. Then other things take priority and six months later, when this issue is revisited, the person reading it (and sometimes even the author) has no idea what it was about.

Only very recently did we solve this problem. We now have internal issue guidelines to ensure issues have a common format. (What and Why, Details, Acceptance Criteria). We use GitHub Issues, but the actual tool doesn’t matter much, as this process works equally well if you use JIRA or another bug tracking system.

Before someone can pick an issue, it needs to go on our project board. To get there, it needs to adhere to the standards laid out in the guideline document. If, for whatever reason, the ticket isn’t there yet, then we update it to adhere to the spec. This is sometimes annoying and feels like overkill, but given the “written once, read many times” aspect, this process pays off.

### Release Calendar

Every team is responsible for having the next three releases added to the release calendar. We follow a loose release train, as external events (such as the iOS 12 release) or important customers require a flexible schedule. If your business allows a strict, predictable release schedule, go for it.

## Know Your Company

One email we get is from Know your Company. It is a really simple concept: It sends questions via email every week and people respond. It’s a nice touch and helps the team connect. Sometimes the questions are as banal as “What’s your favorite ice cream flavor?”, but other times they’re difficult ones like “Where are we lacking compared to other companies?” There are also great icebreaker questions for introducing new employees. KYC allows everyone on the team to suggest questions, and we often use it to get feedback on our own processes — for example, like when we recently added the Out for Today Slack message.

![](/images/blog/2018/how-to-use-slack-and-not-go-crazy/knowyourcompany.png)

## One-on-Ones

Caring about people shouldn’t stop after hiring, and it’s important to us to give people space for feedback apart from the regular work day pressure. When everyone works in an office, these things can happen naturally — for example, you go for a drink after work. But if you’re in a remote setting, you have to schedule this time.

Obviously, things don’t scale — I can’t have one-on-ones with everyone in the company, but we have a hierarchy and I regularly have FaceTime calls with the team leads. Keep a document with notes about the people you talk to so you can follow up on previous calls and see if problems are fixed. Use this for feedback when something annoys you — instead of blowing up in Slack or asking for a video call, I just make a note in my one-on-one file and then discuss this after some time away from it. Usually I find the issue wasn’t as big of a deal or the person didn’t realize or didn’t mean something the way it was perceived. And the fact alone that you make a note will calm you down, as it’s not forgotten, just delayed.

## Retreats

Video calls are great, but sometimes you just want to hang out in person. [At PSPDFKit, we have retreats twice a year.](/blog/2017/4-steps-to-a-successful-company-retreat/) This isn’t that much. Last year we all gathered in Italy, and it feels like forever since we last met in Vienna in February. Greece is coming up next!

Every company is different and every retreat is different — the common factor is that they are fun, they bring the team together, and it really feels like being among friends. Retreats are also where we talk a lot about problems and the general company direction. It’s a great way to catch up with people, get to know new faces, and try new flavors of gin :)

![Here’s us being in awesome Italy and having a blast!](/images/blog/2018/how-to-use-slack-and-not-go-crazy/italy-retreat.jpg)

## Talk at NSSpain

**This is the second part of our series about communication. Don’t miss the first part: [How to Use Slack and Not Go Crazy](/blog/2018/how-to-use-slack-and-not-go-crazy).**

If you’d like to learn more about this topic, watch [my talk from NSSpain](https://github.com/steipete/speaking), where I discussed Effective Remote Communication and our experience here at PSPDFKit.

<iframe src="https://player.vimeo.com/video/235530912" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
<p><a href="https://vimeo.com/235530912">Effective Remote Communication - Peter Steinberger</a> from <a href="https://vimeo.com/nsspain">NSSpain</a> on <a href="https://vimeo.com">Vimeo</a>.</p>
