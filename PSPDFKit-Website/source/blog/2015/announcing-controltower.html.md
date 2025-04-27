---
title: "Announcing Control Tower - A Powerful &amp; Robust License Manager"
section: blog

author: Jonathan Rhyne
author_url: https://twitter.com/jdrhyne
date: 2015-06-18 2:45 UTC
tags: Products
published: true
---

As a bootstrap startup, it is important to reinvest in our company and even more important to choose wisely where we reinvest. After many requests and inquiries from friends into how we solve managing our licenses, builds, invoices, payments, etc., we decided it was time to let everyone in on the secret. We're excited to announce the launch of our newest product, [Control Tower - A Powerful &amp; Robust License Manager] (http://ctrltower.io) that's in and been in development for the past two years.
READMORE

![Control Tower logo](/images/blog/2015/control-tower/ct_logo.png)

Back in 2013, after Peter searched around for an adequate solution and could not find one to the license manager problem, we decided to build our own license manager. Martin got to work and at first it was a very simple solution. As we started to use it more, Martin built out more and more features. First, we needed to be able to produce secure license keys for our customers and provide links to various builds whether a demo, production or unstable build. Later, we needed the ability to keep track of our customers and answer questions like what features did they purchase in their license, when do their licenses come up for renewal, and give them the ability to interface with us. We built out our Customer Portal that would allow customers to login and handle things such as seeing when their licenses expire, what builds they have available to download, and request beta IDs. Next, we started to think how we could use the tool to optimize our sales process to make things easier for our customers. We added the ability to auto generate invoices and formal offers with customized fields, track specific customer information that can be prepopulated into those invoices, and send out customizable emails before their license expired. After using Fastspring for awhile and paying larger processing fees, we decided we needed to offer our own payment system so customers could pay via Credit Card and us be charged less in fees. Once the payment system was set up, the logical next step was Metrics to be able to track invoices outstanding and paid.

![Control Tower Highlights](/images/blog/2015/control-tower/control_tower_highlights.png)

As you can tell, as a need has arisen, we answered the call and invested heavily into building a very powerful license management tool. This is only the beginning as we have more and more things to build onto Control Tower. Our GitHub repository is full of feature requests but now, for the first time, you can benefit from the above experience and investment by demoing and purchasing the same internal tool for your company. If you'd like to try a demo - contact us at sales@ctrltower.io

## Sales Improvement

I can't even begin to explain how much of a difference maker Control Tower has been to improving our sales process. For a small or large team, having Control Tower can be a real competitive advantage.

"Try it Now" - Adding a "Request Trial" button to your webpage is critical for customers to test the capabilities of your product. With a little information, potential customers can receive an automatically generated time-limited license key and download link sent all via email. Control Tower will even automatically add the customer lead's email to your newsletter using an external newsletter service such as Campaign Monitor, Mailchimp or other services.

No longer is there the need to keep track of when licenses are about to expire and make sure renewal emails are sent out in time. Now automatically send customizable email reminders to customers when their licenses are about to expire. Control Tower comes with fully customizable template emails for all the various license types supported.

![Invoices](/images/blog/2015/control-tower/invoice_example.png)

Take control over your invoices. Generate and send out an invoice with a personal payment link for customers to pay directly via credit card (Stripe and Paymill integration supported). Customizable emails go out with every invoice allowing or restricting a customer access to the license before or after payment is made. Further, Control Tower contains metrics allowing you to track invoices still outstanding or paid along with a clean monthly breakdown so you know how sales are going.

## License Keys

We've built a secure and easy to use license system. We provide Android and iOS license verification code as source for you to plug directly into your SDK. We offer secure encryption with our license key scheme working via public-key asymmetric cryptography, so without access to the private-key none of the license keys can be generated. We make sure that all the necessary information is contained in the license key. What features are enabled, the expiration date, which bundle ID or package name is authorized to use the license is all contained in one key. Finally, we've even worked on an easy to use API for your customers to assign and activate their bundle ID or package name.

![Header Image](/images/blog/2015/control-tower/header_screenshot.png)

## Customer Portal

Every experience your customers have when they interact with your company should be delightful. With our Customer Portal, we focused on making it as simple and easy for customers to track their products, assign and request beta keys according to their licenses, and download the latest version of your product including older builds. Customers can see open payments and pay directly via Credit Card. A detailed activity log of all actions by customers and administrators is available, including all automatically triggered actions such as reminder emails.

![Credit Card Payment](/images/blog/2015/control-tower/creditcard_payment.png)

We are constantly improving Control Tower and can't wait to share this powerful tool with others. If you'd like to try a demo - contact us at sales@ctrltower.io or find out more at http://ctrltower.io
