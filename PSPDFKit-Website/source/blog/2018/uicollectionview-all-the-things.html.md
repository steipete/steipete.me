---
title: "UICollectionView All the Things!"
description: "`UICollectionView` is now at the heart of every document. This blog post talks about why and how we rewrote our view hierarchy."
preview_image: /images/blog/2018/uicollectionview-all-the-things/article-header.png
section: blog
author:
  - Michael Ochs
author_url:
  - https://twitter.com/_mochs
date: 2018-03-13 12:00 UTC
tags: iOS, Development
published: true
---

One of the highlight features of [PSPDFKit 7.0 for iOS](/blog/2017/pspdfkit-ios-7-0/) is the grand overhaul of its view hierarchy. Almost everything related to displaying pages is new, and `UICollectionView` is now at the heart of every document displayed onscreen. In this blog post, I want to talk about why and how we rewrote our view hierarchy.

READMORE

## Where We Are Coming From

The view hierarchy for displaying the pages of a document onscreen, swiping through the pages, and zooming into them is one of the oldest components of our framework. Over time, it has been expanded with new features and scroll modes, and it now boasts three main ways to browse a document: paginated scrolling, continuous scrolling, and a book-like page curl. These three page modes were implemented in three mostly distinct view hierarchies in versions 6 and below. There were a couple of shared components, but for the most part, they had very little in common. In fact, even the shared code had different paths of ownership, as shown below.

<img src="/images/blog/2018/uicollectionview-all-the-things/old-view-hierarchy.svg" alt="Illustration of the view hierarchy before PSPDFKit 7.0 for iOS" width="100%"></img>

While the page modes used to work as they should have, we wanted to make improvements in performance and user experience. Most of these plans entailed integrating every new feature into three different hierarchies, which presented unique challenges. So, in order to implement new features and make maintaining the view hierarchy easier, a solid refactoring was needed.

## The Goals

The wide range of customers we have at PSPDFKit presents us with some challenges. One that is always relevant is scalability. Documents can become quite large, and we have customers who use our framework to display documents with more than 15,000 pages. Ideally, a page from these documents would be rendered as fast as a single-page document. But for performance and memory reasons, there is simply no way we could render or even lay out that many pages all at once, nor does it make sense.

As such, we need to make sure to only lay out and render the pages around the currently visible area. Laying out a range of pages without knowing about the position of the other pages — especially the ones in front of the current ones — has its own challenges, but that is a topic for another blog post. (Ping me on Twitter if you want to read about that in the future.)

In addition to the above constraint, we wanted to build a modular, customizable hierarchy that we could easily extend later on. As the code covers many areas that could be further optimized — such as view creation and configuration and the layout calculation functions — some parts of it shouldn’t be available through a public API, as not exposing it to users allows us to make bigger changes later on.

Additionally, the view hierarchy needed to be identical in all view modes. This is because customers should not need to refactor their code just to use another page mode — and the same goes for us when implementing features for multiple page modes.

## Finding a Solution

With the above goals in mind, I spent some time thinking about an optimal solution. When doing this, I tend to approach things from an entirely fresh perspective; I look not for an easy way to make what we have a little better, but rather I look for a way to accomplish something from the approach of starting from scratch. This ensures the new code is not limited by any constraints from the old code and does not follow any restrictions that might no longer be necessary or applicable. Meanwhile, reusing as much old code as possible is a challenge for later.

In general, there are two ways of doing things: either do them yourself, or leverage the frameworks at your disposal. In looking over the above goals and thinking about which features could have been solved by what Apple offers, one thing really stuck out: the idea of laying out only what is around the currently visible area. The old view hierarchy managed adding and removing views all by itself depending on their visibility, which is a pattern that is used a lot in iOS to improve performance. But UIKit provides us with `UITableView` and `UICollectionView` to fulfill this task. As our layouts expand horizontally and vertically, I decided to focus on using `UICollectionView`. More specifically, I wondered if it could help us in achieving our goals, or if instead it hindered our progress. We wanted a modular architecture, mostly to customize the layout, which is something that `UICollectionView` does very well: It decouples the layout calculations from laying out and rendering actual views on screen. Even more, it offers great support for customizing layouts through subclassing.

I knew from previous experience that there are some limitations in `UICollectionViewFlowLayout`, especially when it comes to cells that are as large as or even larger than the collection view itself. Furthermore, the flow layout needs to do a lot of complex math because a cell’s position is calculated based on the previous cell’s position. For our layout, however, we were able to make a couple of assumptions. One of them is that views in the layout are all either placed in a single row or in a single column. This simplifies the math a lot, and as a result, improves performance of the layout.

# Designing the API

Exposing a collection view in a framework is quite a challenge. It has a ton of properties, and supporting all of them in every constellation, together with what we build around it, is simply impossible. For example, we couldn’t use a flow layout for several reasons. However, if our customers were able to access the collection view directly, they would be able to set a flow layout on it, which would not work properly with our code. Therefore, I decided to keep the collection view itself private and wrap it in a document view controller. This means we exposed our layout class for our customers to subclass and customize, but it also gave us the freedom to configure the collection view the way we needed it.

<img src="/images/blog/2018/uicollectionview-all-the-things/view-hierarchy.svg" alt="Illustration of the new view hierarchy as of PSPDFKit 7.0 for iOS" width="100%"></img>

The above image represents the classes accessible to you. While the collection view we talked about earlier is currently between the two scroll views in this diagram, this might change in a future release. The first scroll view currently isn’t a `UIScrollView`, but rather a subclass of it that controls the collection view it contains. By only exposing a `UIScrollView` instead of the actual subclass that is used, we have the freedom to change the subclass to something else — even the collection view itself.

In the future, we might get rid of the scroll view subclass and return the collection view itself. With the above shown public API, this does not require a breaking change. Furthermore, the API doesn’t even guarantee that the first and second scroll views are different, and in some layouts, they actually are not. If you are using a continuous scrolling layout, you can zoom the whole document at once. This means the scroll view that is responsible for scrolling is the same one responsible for zooming. So we hand out the same scroll view for the scroll and the zoom view. However, when you are in a page per spread layout, you can zoom each spread individually, so you will get one scroll view and a different zoom view for each spread.

# Zooming

Another issue I faced was that our content should be zoomable. While `UICollectionView` is a `UIScrollView` and therefore should have the capability to zoom its content, in order to do this, it requires a single view to apply its transforms on. However, a collection view does not offer a single view that contains all cells; there is no view you could return in the scroll view’s delegate method, `viewForZoomingInScrollView:` ([rdar://33675923](http://openradar.appspot.com/33675923)). To address this, there were two possible solutions we discussed.

One meant we would implement zooming by modifying each cell’s scale and position, making it appear zoomed. But this would increase the complexity of the layout, and as we wanted our customers to be able to subclass and change our layout as easily as possible, we discarded this idea.

The other option was to embed the collection view inside a scroll view, which is exactly what we did. But there were a couple of caveats here. For one, you cannot make your collection view the size of the scroll view. This would make the collection view lay out all of its content at once because it uses its bounds to determine which part of its content to lay out. Apparently, Apple seems to be doing the same thing in some cases; there is a private API on `UICollectionView` to make it derive its visible bounds from a containing scroll view. I filed an enhancement request to make this API public so that others can benefit from it ([rdar://33316167](http://openradar.appspot.com/33316167)). Please duplicate it if you think this feature would be useful.

Because using private APIs isn’t an option, we went and implemented the above ourselves. The collection view derives its visible area from its `bounds`. There is a great [post over at objc.io about how scroll views work](https://www.objc.io/issues/3-views/scroll-view/), what `bounds` actually are, and what they do to the view. Check it out if you are not familiar with the differences of frames vs. bounds or if you want to learn how scroll views function internally.

For our problem, we needed to figure out a way to configure the collection view’s `bounds` to what they usually would be if the surrounding scroll view weren’t there. Luckily, there is a pretty easy way to do this: The containing scroll view’s `bounds` are exactly the bounds the collection view would use if the scroll view wasn’t there. So inside the scroll view’s `layoutSubviews`, we simply set the collection view’s `frame` and `bounds` to the scroll view’s `bounds`. This makes the collection view move along inside the scroll view, only showing the currently visible part.

<video src="/images/blog/2018/uicollectionview-all-the-things/containing-scroll-view-animation.m4v" width="100%" playsinline loop muted data-controller="video" data-video-autoplay="true"></video>

# Flexibility

By basing the new view hierarchy on `UICollectionView`, we got a lot of flexibility. Our layout is completely decoupled from the actual view hierarchy, which makes changing it as easy as assigning a new layout to the `layout` property on our `PSPDFDocumentViewController`. Our customers can now subclass one of our layouts (`PSPDFScrollPerSpreadLayout` or `PSPDFContinuousScrollingLayout`) or start from scratch with `PSPDFStackViewLayout`. And if this is not flexible enough, we also have `PSPDFDocumentViewLayout`, which is a completely empty base layout that can be used to make the design look any way you want.

In the new layout, we offer hooks into the scroll views without making them completely public. There are delegate methods on the document view controller’s delegate protocol that will inform its delegate about when a scroll view is configured so that everyone can add their set of options while keeping the hierarchy itself hidden away. This enables us to further improve the internals of the new view hierarchy and make changes without breaking any public API. In [PSPDFKit 7.0 for iOS](/blog/2017/pspdfkit-ios-7-0/), we already increased the layout performance of the continuous scrolling layout and we have many more ideas for future improvements and new features that will come in later releases.
