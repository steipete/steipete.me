---
title: "Useful Tools to Share & Organize Work Between Developers and Designers"
description: The software and services PSPDFKit uses for design work
preview_image: /images/blog/2017/design-and-development-tools/design-apps.png
section: blog
author:
  - Samo Korošec
author_url:
  - https://twitter.com/smoofles
date: 2017-03-02 12:00 UTC
tags: Design
published: true
---

In the [previous article](/blog/2017/everybody-designs), we talked about how we implement the agile design process. Since tools are integral to a streamlined work process, let’s also take a quick look at some of the tools and services we use to collaborate across teams. Keep in mind that our requirements may be different than development of most consumer apps. Developing a PDF SDK means most of the work done is not visible to users, so we can work with a much smaller design team.

![The Design Apps Uset at PSPDFKit](/images/blog/2017/design-and-development-tools/design-apps.png)

## Visual Design and Prototypes

While we kick it old school with [Adobe’s](http://www.adobe.com/) Creative Cloud apps. There are also two other more affordable tools that have made in-roads in the industry in the last few years, [Affinity Designer](https://affinity.serif.com/en-us/ui-design-software/) and [Sketch](https://www.sketchapp.com). We’re constantly evaluating both to see how much of our work could be covered by them.

### Adobe Creative Cloud

Adobe tools are not cheap, but they work and consistently meet expectations. When iterations need to happen fast, there’s simply no time to fight bugs or weird selecting methods or even to learn new tools. Although, Illustrator, Photoshop, InDesign and After Effects are not considered the most innovative kids on the block, they’re stable and reliable. More importantly, almost every designer knows how to use them.

### Affinity Designer

At a glance, Affinity Designer looks great for interface design work and documentation graphics. From our initial tryout, it has proven to be a mature and predictable design tool, which is especially impressive considering it's currently only at version 1.5. It certainly seems like a promising candidate as an "everyone-to-use" tool for design work that needs to bounce back and forth between designers and developers. We are also looking to use it for web design soon.

### Sketch

Some of our developers use Sketch and are fairly happy with it when doing UI mockups. Sketch’s [Extension Library](https://www.sketchapp.com/extensions/) contains an impressive amount of useful plugins, too. The amount of work put into it is quite a testament to how desperately the design industry wants good layout and UI design tools. (Adobe seems to have only noticed that fact after Sketch took off — so hats off to them!)

However, to be honest, my personal experience with Sketch, and other tools by the same developer, was not entirely positive. So I would still evaluate Affinity Designer as a go-to design app for the whole team.

And since the desired output formats for images are mostly PNGs or PDFs, it’s quite easy to consider different tools across the teams.

![Prototypes are an Xcode Thing](/images/blog/2017/design-and-development-tools/xcode-for-prototypes.png)

### UI Prototyping Tools: David, Douglas, Matej, … 😛

Here’s where we might differ greatly from a team with a more evenly split, and more rigid, responsibilities between developers and designers. At PSPDFKit, we are able to deliver fast UI prototyping because it's often implemented by the same person who also builds the product version. All thanks to our excellent developers!

Our design process usually goes like this: functionality is briefly discussed via GitHub Issues or a Slack call, then implementation starts and the design is refined as the UI develops. This saves _plenty_ of time from going back and forth, as I’ve mentioned in the [previous article](/blog/2017/everybody-designs).

In some rare cases (like trying out live prototypes), it makes sense to simply check out the appropriate branch on GitHub and compile the app for the local device. Although this may not be applicable for every design team, it helps tremendously if everyone knows their way around the development environments, such as Xcode and Android Studio.

## Organizing & Sharing Work

Working on a PDF SDK means our team is primarily composed of developers. We briefly tried using [Trello](https://trello.com) and [InVision](https://www.invisionapp.com) for design discussions, but ended up back on [GitHub](https://github.com) always. Although the former may work for distributed, design-only teams, for us they were just more services to keep up with.

### GitHub

Widely used as a tool to organize development projects, Github offers functions such as projects, issue tracking, code reviews and many other tools in addition to the actual code repositories. These functions make organizing development projects in a single environment fairly straight-forward. From our experience, when all of the development processes happen in one place, it makes little sense to try and force people into using a separate tool just because it’s prettier or that it allows images annotations.

Less context switching = happier productive developers.

### Slack

We rely on [Slack](https://slack.com) for team communication. With Slack’s file sharing support, dropping a new icon or asset into a team channel or a direct message conversation, we could skip the whole commit/push/pull cycle—and the developer only needs to check the channel where the request was made. Slack is also useful for quick video calls or minor iterations, which is perfect for not polluting GitHub Issues, e.g. when not everyone on the issues needs to be involved in the iteration of a small detail.

![Quick Back and Forths in Slack](/images/blog/2017/design-and-development-tools/slack-discussions.png)
Here’s what an iteration process discussed in Slack looks like; in this specific case, it was graphics for our documentation pages, with Martin making sure they’re technically correct. You can see a file list on the right, showing the last couple of revisions posted to the #design channel.

## Lessons learned

The greatest challenge when introducing new tools is convincing the entire team to use them. The features of the tools will not even matter if everyone on the team is not on board. Although, you may experience some inconveniences here and there with the main tools that you use, oftentimes it's still not worth the trouble to track your work using two or even three services. For us, the pragmatic approach was for the designer to adopt developer tools and learn to use them well, therefore avoiding running into too many problems on the way.

To sum up:

* Evaluating tools based on work efficiency, first and foremost
* The less tools people need to switch to get a job done, the happier they are
* Video calls are faster than long discussions on design tracking web services
* For us, GitHub & Slack work fine for tracking design work progress
* Being conservative with your design tools will help when the schedule is tight
* Keep evaluating new tools, just in case
