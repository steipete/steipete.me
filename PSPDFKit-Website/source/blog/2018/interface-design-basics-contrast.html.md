---
title: "Interface Design Basics: Contrast"
description: "We’re looking into why contrast is an important aspect of interface design and how it helps users recognize and understand interface elements."
preview_image: /images/blog/2018/interface-design-basics-contrast/article-header.png
section: blog
author:
  - Samo Korošec
author_url:
  - https://twitter.com/smoofles
date: 2018-02-02 12:00 UTC
tags: Design, User Interface Design, Tips
published: true
secret: true
---

Designing a user interface is always a balancing act of various requirements, the most prominent usually being: providing a distinct design; creating a great user experience; sticking to existing platform conventions; and, for most companies, recognizing what is achievable with the resources at hand. When working on a software library — which is the majority of design work done at PSPDFKit — the designs also have to work for third-party developers. The last requirement means that design decisions are all pretty conservative. Components that are overstyled would clash too easily with the third-party apps, and interactions that are too innovative would confuse a large number of users.

This isn’t to say that design work is not interesting — far from it! It just means we need to get the basics right, so the basics are what we’re starting with today.

One of the core characteristics of any user interface concept is contrast, yet it’s also one of the aspects that can most often conflict with what we perceive as elegant or pleasant design. In this article, we’ll look at why contrast is important and how to influence perceived contrast when creating visual interfaces. The concepts presented are somewhat simplified to make for an easier read, and you can find a list of useful tools and Wikipedia articles at the end. 

## Defining Contrast

Type “define contrast” into Google and you’ll get the following: 

> **Contrast**, _noun_  
> the state of being strikingly different from something else in juxtaposition or close association. 

In other words, contrast is the difference between objects. _Strong_ contrast means the difference is big and obvious, while _low_ contrast means the difference is small and difficult to perceive. You’ve probably seen the term used in the context of colors and brightness, but it really applies in every situation where a difference can be perceived or measured.

### Why Contrast Matters

In order to understand the world around us, our brains do an impressive amount of processing work in an incredibly short amount of time. However, in order to not overwhelm our conscious selves with information, there’s also a great deal of filtering being applied to the processed information. The brain recognizes patterns, forms abstract concepts, and presents what our senses perceive as ideas and thoughts, which seem much simpler than the sum of their parts would suggest.  

While this is all very interesting on its own, the part that’s relevant for this article, the visual input, lies at the very beginning of the whole process. Looking at a scene first, getting impressions of various shapes and their characteristics, and then deciding which of them are separate entities all occurs before actual object recognition starts.

If an object is in stark contrast to its surroundings, it’s easier to recognize as distinct, meaning cognitive categorization can start sooner. The default assumption for objects that look very similar is that they’re of the same type or that they, at the very least, share a number of traits. Only a closer look reveals the differences, and that closer look taxes our attention — this cognitive load is something we need to avoid when designing user interfaces. 

---

## Types of Contrast

We’ll briefly look at three types of contrast: brightness, color, and shape. 

**Note**: Color contrast can be quite complex, but for the sake of simplicity, we’re dumbing it down to simply “brightness” and “color” for now. 

### Brightness

Adjusting the relative color brightness of elements is the simplest way to contrast otherwise identical elements. Let’s have a look at an example of adjusting brightness to affect contrast in a scene. We’ll start with seven identical elements, all which appear in strong contrast to their background. 

![Uniformly strong contrast in all seven elements](/images/blog/2018/interface-design-basics-contrast/contrast-brightness-1.png)

By increasing the brightness of five of them, we create two distinct types of circles: brighter ones and darker ones.

![Five elements with lower contrast, and two elements with the same strong contrast as before](/images/blog/2018/interface-design-basics-contrast/contrast-brightness-2.png)

Notice that the two circles with _strong_ contrast, relative to the background color, are the ones that call for our attention first. Now, let’s lower the contrast of two more circles.  

![Contrast is lowered some more for two elements, yet not enough to signal a distinct type of element](/images/blog/2018/interface-design-basics-contrast/contrast-brightness-3.png)

The change to the last two circles isn’t as dramatic, as we only increased the brightness by a small amount. And while these two circles are now the brightest of the seven, the change isn’t strong enough to immediately set them apart as distinct elements. 

### Color

We can use color as a contrasting aspect either in addition to brightness or on its own. Color can be a fairly complex topic — its perception being a combination of physics and biology — and is worthy of an article of its own. For now, we’ll just look at a few examples.

![Using an accent color helps emphasize elements](/images/blog/2018/interface-design-basics-contrast/contrast-color-1.png)

The simplest example is using a base color that contrasts strongly with the background and adds a single accent color for a second element type. 

![Using variations of the same color communicates similarity](/images/blog/2018/interface-design-basics-contrast/contrast-color-2.png)

As seen above, adding minimal brightness and saturation variations of the same hue into the mix will not impact overall contrast significantly, and the accented elements will be seen as related.

![Using different colors suggests the elements are not related](/images/blog/2018/interface-design-basics-contrast/contrast-color-3.png)

Using distinct colors, on the other hand, suggests the elements are not related in functionality or importance.  

### Shape and Size

Contrasting shapes and sizes are not as widely used in interface design, as the medium (a computer screen) is often constrained in physical size and resolution. But for the sake of completeness, let’s see how shapes and sizes contrast.

![Separating objects by size](/images/blog/2018/interface-design-basics-contrast/contrast-size-1.png)

Size is fairly straightforward. The bigger the size difference, the easier it is to tell even identical shapes apart. 

![Separating objects by shape](/images/blog/2018/interface-design-basics-contrast/contrast-shape-1.png)

Simple shapes — circles, triangles, rectangles, crosses, etc. — are easy to tell apart too. But while a five-pointed star is still distinct, differentiating between an eight- and a nine-pointed star, for example, is already much more challenging. 

One area where shape contrast can be used to good effect is when designing icons. Especially on systems that eschew color in iconography, sticking to distinct overall shapes can help users recognize icons much more quickly. 

---

## Increasing Contrast in Existing Designs

In this section, we’ll look at some simple ways of increasing the contrast of user interface elements, and by applying some of the small changes discussed below, we can greatly improve the usability of an interface. 

### Tweaking Colors

When it comes to corporate design guidelines and predefined color sets, color changes can be tricky. You might be able to improve the interface with barely perceptible changes, though, so it’s worth a try. The first thing to try is adjusting the color brightness of either foreground or background elements.

![Tweaking the brightness contrast](/images/blog/2018/interface-design-basics-contrast/tweaking-colors-1.png)

With the example above, the contrast between the button’s background color and its text label is too low, making the wording difficult to read. Tweaking either the brightness of the text (left), or the button background (right), allows us to arrive at a contrast that offers improved legibility. 

The second option is to try and shift the color hue to one that is either brighter (yellows and greens) or darker (reds and blues).

![Tweaking the color hue values only](/images/blog/2018/interface-design-basics-contrast/tweaking-colors-2.png)

The above yellow buttons are extreme, of course, and should serve to show how tweaking the hue value (`H` in the `HSB` color space) can affect perceived brightness. 

A more practical example would be one where we’d need to visually prioritize buttons, so instead of three equal buttons...

![Three identical buttons](/images/blog/2018/interface-design-basics-contrast/tweaking-colors-3a.png)

we would make it clear which button triggers the primary action...

![Accenting the main action](/images/blog/2018/interface-design-basics-contrast/tweaking-colors-3b.png)

and de-emphasize the button we deem least important.

![De-emphasizing the abort action](/images/blog/2018/interface-design-basics-contrast/tweaking-colors-3c.png)

Much better!

With that behind us, we’ll turn our attention to the universally loved, hated, despised, and adored drop shadows! Finally. 

### Adding Drop Shadows

Drop shadows are often talked about in terms of style or personal preference, which ignores the fact that they serve a very specific purpose: they increase the contrast between an element’s edge and its background. This helps separate an element and its background, but it can also introduce visual noise and make it more difficult to recognize elements. 

#### Adding Drop Shadows to Components

![A simple card design, with not-quite-creative content](/images/blog/2018/interface-design-basics-contrast/drop-shadow-cards-1.png)

We’re starting off with a simple card design (yes, the text used is me being lazy), where we want to put white cards on a bright background, which makes the card shape hard to see.

![Adding a drop shadow to the card](/images/blog/2018/interface-design-basics-contrast/drop-shadow-cards-2.png) 

Adding a drop shadow (using `4pt` offset, `4pt` blur, `100%` alpha) helps the card’s definition a great deal. However, as the shadow is quite strong, visually, the shadow outline is turned into a visual element of its own. 

![Softening the drop shadow slightly](/images/blog/2018/interface-design-basics-contrast/drop-shadow-cards-3.png) 

We can soften the effect by using different drop shadow values (using `8pt` offset, `8pt` blur, `66%` alpha), making the card (including its contents) more prominent again.  

![A simple card design, with not-quite-creative content](/images/blog/2018/interface-design-basics-contrast/drop-shadow-cards-4.png) 

By softening the shadow even more (this time using `12pt` offset, `24pt` blur, `33%` alpha), we get to a point where the shadow itself becomes very fuzzy visually, and it is almost impossible to pinpoint where it starts. The card’s outline, however, retains its sharp shape.

If the shadow offset and blur need to stay fixed, to keep the same perception of distance between an element and its background, simply making the shadow more transparent can have the same softening effect.

![A simple card design, with not-quite-creative content](/images/blog/2018/interface-design-basics-contrast/drop-shadow-cards-5.png)

The above setup of `2pt` offset, `2pt` blur, and `66%` alpha can be softened by just changing the drop shadow effect’s alpha to `20%`. In doing so, it will still retain a good enough definition of the card’s shape. 

![A simple card design, with not-quite-creative content](/images/blog/2018/interface-design-basics-contrast/drop-shadow-cards-6.png)

#### Adding Drop Shadows to Text

Another scenario where drop shadows can be used is to increase contrast for text elements. However, as we’ll see below, it doesn’t always work out. Titles and single lines of text can benefit from drop shadows, while text paragraphs — even as short as two lines — can get trickier. 

![A thin font title with low contrast](/images/blog/2018/interface-design-basics-contrast/drop-shadow-thin-font-1.png)

A thin font, already low contrast in itself, can easily blend into the background when color contrast cannot be guaranteed to be high enough. 

![A thin font title with a soft shadow](/images/blog/2018/interface-design-basics-contrast/drop-shadow-thin-font-2.png) 

In our example, a wide and soft shadow creates a uniform background color for the text, as the shadow spreads underneath the whole word. If we were to use a sharper shadow — something that worked well for the cards — we would only emphasize the single characters. This makes it harder to recognize the word as a whole, thereby increasing the cognitive load.

![A thin font title with a sharpish shadow](/images/blog/2018/interface-design-basics-contrast/drop-shadow-thin-font-3.png)

For titles, using a thicker font can help establish a stronger base contrast, as the thicker characters take up more visual space, making them stand out more. 

![A thick font](/images/blog/2018/interface-design-basics-contrast/drop-shadow-thick-font-1.png) 

Consequently, a bold font won’t have the same issues with a sharper drop shadow as a thinner font would, as its shadow doesn’t interfere with the character shapes as much. 

![A thick font with a sharpish shadow](/images/blog/2018/interface-design-basics-contrast/drop-shadow-thick-font-2.png) 

The font sizes used for paragraphs or image captions produce weaker shapes, too, which also means that drop shadows don’t work as well. They can still be used for single lines of text, where legibility is not of huge concern. Let’s have a quick look at how different drop shadow types work with paragraphs.
 
![A low-contrast card we’ll try to fix by applying drop shadows to the text](/images/blog/2018/interface-design-basics-contrast/drop-shadow-text-1.png) 

Let’s have a look at how a few different drop shadow settings might look: 

![La-di-dah, drop shadow all the things!](/images/blog/2018/interface-design-basics-contrast/drop-shadow-text-2.png) 
 
Welp, that definitely could have gone better...

If you find yourself tweaking a text element’s shadow for too long without feeling like the legibility is improving much, you should consider tweaking the background colors and style instead. Legibility can be greatly improved when text is placed above a background with uniform contrast, and that’s easier to control than drop shadow settings for each additional font weight or size used. 

### Adding Border Outlines

Similar to drop shadows, adding a border outline can help increase the contrast of visual elements by making the border between an element and its background stand out more. Like with what we’ve seen when applying drop shadows to text, the effect already works with subtle changes in color values.

![Adding a darker border to an element to emphasize its shape](/images/blog/2018/interface-design-basics-contrast/border-outlines-1.png) 

![Adding a brighter border to an element to emphasize its shape](/images/blog/2018/interface-design-basics-contrast/border-outlines-2.png) 

The outline doesn’t have to be strictly part of the element we want to emphasize, either — it can just as well serve to normalize the immediate background, as can be seen with the dark window in the next example.

![Adding a darker border to an element to emphasize its shape](/images/blog/2018/interface-design-basics-contrast/border-outlines-3.png) 

Speaking of which, let’s have a look at the most common approaches we can take to normalize an element’s background (since drop shadows obviously have their limits, awesome as they may be).

### Normalizing Backgrounds

When placing elements on top of each other, we’re sooner or later faced with a situation where a custom visual element provided by a user is integrated with our existing interface elements. The lack of control means that whatever setup we pick for elements placed above the custom content might, at some point, result in contrast so low it negatively impacts the usability.

![Fancy gradient background on a card](/images/blog/2018/interface-design-basics-contrast/normalizing-bg-gradient-1.png) 

We’re starting off with a colored card holding some text. The first, fairly easy thing we can do is add a background color to the text area. If we make it black and slightly transparent and multiply it with the background, our text area will adapt to the background used.  

![Adding a dark, semi-transparent background behind the text](/images/blog/2018/interface-design-basics-contrast/normalizing-bg-gradient-2.png) 

We could also use a gradient to introduce a softer edge. Here, the first line of text (“Contrast”) is visually bigger and thicker than the text below, and it doesn’t need as opaque a background. 

![Adding a dark gradient behind the text](/images/blog/2018/interface-design-basics-contrast/normalizing-bg-gradient-3.png)

We can also just brute-force the background color without using any transparency — this gives us total control over how legible the text is.

![Brute-forcing the text contrast for fun and profit](/images/blog/2018/interface-design-basics-contrast/normalizing-bg-gradient-4.png) 

The whole scenario gets harder to deal with if we introduce images (photos, patterns, etc.), as these can consist of all colors, from bright to dark, and vary pixel by pixel. 

![Fancy pattern background on a card](/images/blog/2018/interface-design-basics-contrast/normalizing-bg-pattern-1.png) 

If we want to fix this by using a dark background, we’ll need to make the background much less transparent — and even so, the image’s patterns interfere with the text somewhat.

![Fancy pattern with a dark background behind the text](/images/blog/2018/interface-design-basics-contrast/normalizing-bg-pattern-2.png) 

The gradient approach is even worse. While the bottom line — with an almost-black background — looks OK, the title is barely readable.

![Fancy pattern with a gradient behind the text](/images/blog/2018/interface-design-basics-contrast/normalizing-bg-pattern-3.png) 

The easiest opaque color fill is what works best here, even if it’s somewhat less interesting, visually, than showing more of the image would be.  

![Fancy pattern cut off without mercy](/images/blog/2018/interface-design-basics-contrast/normalizing-bg-pattern-4.png)
 
### Adaptive Interfaces

Depending on your resources, you could also talk to your developers to see if the elements used in your user interface could be dynamically adapted to the content they work with. The resulting look is often perceived as more pleasant to the eye — since the contrast between the various elements is less extreme — while still keeping within the limits defined by the developer and/or designer. 

![Using an app’s content to generate additional element styles](/images/blog/2018/interface-design-basics-contrast/adaptive-interfaces-1.png)

Starting with the same colored card, we could, for example, pick a color sample from the background and use it for the text’s background color.  

![Using an app’s content to generate additional element styles](/images/blog/2018/interface-design-basics-contrast/adaptive-interfaces-2.png) 

The sample color could then be made darker (look into using a color space like `HSB` to make this easier).

![Using an app’s content to generate additional element styles](/images/blog/2018/interface-design-basics-contrast/adaptive-interfaces-3.png)

The darker background multiplied over the background color gives us a text area that changes based on the main element’s content.

![Using an app’s content to generate additional element styles](/images/blog/2018/interface-design-basics-contrast/adaptive-interfaces-4.png) 

In terms of the final result, this approach would give us the same issues with photos and patterns that we had before. An approach popularized by iOS (as `Vibrancy`), and adapted by Windows later (as `Acrylic`), is to use the background bitmap as a source, and then to use a strong blur effect, desaturate it, and brighten or darken the result. 

![Using an app’s content to generate additional element styles](/images/blog/2018/interface-design-basics-contrast/adaptive-interfaces-5.png) 

This approach allows some of the background to leak into the text area while keeping the overall texture smooth enough to not interfere with text. 

![Using an app’s content to generate additional element styles](/images/blog/2018/interface-design-basics-contrast/adaptive-interfaces-6.png) 

---

## Things to Keep in Mind

Contrast as a differentiating factor works best when not overused. Using one accent color is easy to understand: “This one is special.”

![Changing contrast between elements can help the user orient themself](/images/blog/2018/interface-design-basics-contrast/dont-overdo-it-1.png) 

A small number of “special” elements will still be relatively easy to grasp, even though the user now needs to differentiate between different kinds of special. 

![There is a limit of how many contrasting items a user can keep tabs on](/images/blog/2018/interface-design-basics-contrast/dont-overdo-it-2.png) 

However, assigning every element a special status will simply turn the whole group into visual noise, and noise is something our brains will either learn to filter out or be irritated by. 

![Differentiating between elements too often will make the interface hard to grasp](/images/blog/2018/interface-design-basics-contrast/dont-overdo-it-3.png) 

In the last image, a circle having a different color is no longer a differentiator. Ideally, you should limit yourself to _three_ levels of a specific differentiating factor, in order to keep things clear and simple.

The other point worth making is that high contrast is jarring. By definition, elements that contrast greatly with their surroundings look more alien and out of place. 

![We like design with low contrasts as it looks less jarring](/images/blog/2018/interface-design-basics-contrast/contrast-is-not-pleasant-1.png) 

As designers, the hard part of our job is to find a balance between a fancy, modern UI design we would be proud to show off, and a design that meets the usability criteria of our target audience.

![Optimizing for good contrast can easily start looking boring](/images/blog/2018/interface-design-basics-contrast/contrast-is-not-pleasant-2.png) 

Yeah, er, don’t do that ☝️, please. 🤓


## Conclusion

When designing interfaces, your main goal should be clarity, followed by efficiency. Clarity starts with the user’s ability to recognize visual elements and their ability to differentiate between the many types of visual elements. We can help the user’s understanding of which element is important and which is less so, which is interactive and which isn’t, by making sure the different types of elements stand in contrast to each other and that our approach to the contrasts we use is consistent.

---

##### Useful Tools and Further Reading

- Contrast articles, human vision brightness perception article
- Contrast checking tools, web tools, Material Design color tools
