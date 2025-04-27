---
title: "Design Toolchain: A Quick Overview of What We Use"
description: The software and services PSPDFKit uses for design work
section: blog
author: 
  - Samo Korošec
author_url:
  - https://twitter.com/smoofles
date: 2017-02-07 12:00 UTC
tags: Company, Design
published: true
secret: true
---

--------
--------

William’s feedback:

 I think the "Design Repository" section could be made more clear.

Suggestion:

---

Design Repository:

Projects:

We use projects such as `Interface Design` or `Graphic Design` to logically group related tasks. To track progress on each project we use the more-or-less-standard set of columns: Urgent, Inbox, In Progress, On Hold, and Ready.

Issues:

These get created by adding notes to one of the Project’s columns. The issue itself uses a title format of Product Name: Topic and simply holds a link to the actual Issue (in a Product Repository) in its description text, which is where the actual discussion happens. Shuffling these around the columns communicates their progress and urgency.

Wiki:

We’ve recently started to document more of the internal non-development processes, and one of the areas impacting most of our team is communicating design needs and making sure they don’t get forgotten. We’re currently adding everything from short guides on how to request icons, how to go about producing documentation diagrams, to articles on where to find assets (like Keynote templates) to the Wiki.

--------
--------

#### The Design Repository and Our Current GitHub Workflow  

A recent change we made was to introduce a Design repository for managing Design-related tasks. With multiple products in development in parallel, it’s hard to keep track of what works needs doing, how urgent it is and which teams need help with design. Here’s how the new repository ties in with our existing process:

- **Product Repositories**: Design tasks related to a specific product are tracked inside that product’s main repository. It’s where the product’s team spends most of their time and it doesn't make sense for them to track issues elsewhere.  

- **Design Repository**: The Design repository holds various Projects, such as `Interface Design` or `Graphic Design`, which are logical groups for the type of tasks that need doing (since not all are of the UI kind).  

  - **Design Repository’s Projects**: The Project columns placeholder Issues that link out to other repositories, where the actual discussion happens. To make it easier for team leads to track progress, we use the more-or-less-standard set of columns: `Urgent`, `Inbox`, `In Progress`, `On Hold`, and `Ready`.

  - **Design Repository’s Issues**: These get created after adding notes to one of the Project’s columns. The issue itself uses a title format of `Product Name: Topic` and simply holds a link to the actual Issue (in a Product Repository) in its description text. Shuffling these around the columns communicates their progress and urgency.  

  - **Design Repository’s Wiki**: We’ve recently started to document more of the internal non-development processes, and one of the areas impacting most of our team is communicating design needs and making sure they don’t get forgotten. We’re currently adding everything from short guides on how to request icons, how to go about producing documentation diagrams, to articles on where to find assets (like Keynote templates) to the Wiki.

The step to a dedicated Design repository came about as a consequence of an increasing number of products—and thus repositories—that were hard to coordinate and keep track of. We’re still early in the process, but so far the above approach looks promising.  
