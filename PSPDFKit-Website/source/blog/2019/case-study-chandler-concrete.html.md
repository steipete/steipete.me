---
title: "Case Study: How Chandler Concrete Uses PSPDFKit to Optimize and Digitize Its Employees' Document Workflow in the Field"
description: "How Chandler Concrete uses PSPDFKit to optimize and digitize its employees' document workflow in the field."
preview_image: /images/blog/2019/case-study-chandler-concrete/article-header.png
section: blog
author:
  - Natalye Childress
author_url:
  - https://twitter.com/deutschbitte
date: 2019-10-15 7:00 UTC
tags: Company, Customers, Case Study
cta: sales
published: true
secret: false
---

[Chandler Concrete][] is a family-owned and -run company located throughout the southeastern United States, with more than 40 locations across North Carolina, Virginia, and Tennessee. As the name suggests, Chandler Concrete specializes in ready-mixed concrete, but it also manufactures hardscape and masonry products.

Since 2018, Chandler has used PSPDFKit in its Android app to:

- View and fill out PDF forms
- Add annotations and sign documents
- Send documents to a server for storage and sharing

---

> “Our industry is a mature, somewhat-slow-to-adopt-new-technology industry. We wanted to be leaders in our field and give customers a state-of-the-art solution.”<br><small style="display:block;text-align:right;opacity:0.5;">— Rich Gabrielli, IT Manager, Chandler Concrete</small>

---

## The Challenge

Prior to implementing PSPDFKit’s solution, Chandler Concrete was using a three-part paper form for jobs in the field. This meant a driver had to get the correct ticket and take the appropriate forms to a job site, fill out the ticket with specific information about the job, including any special notes, and have the customer sign the ticket. It was then returned to the office, where copies were made. Then, the ticket had to be sent to the billing department, where the ticket was processed and filed away.

![Chandler Employee](/images/blog/2019/case-study-chandler-concrete/chandler-employee.png)

The complexity involved in obtaining and sharing all this information in paper form resulted in Chandler Concrete making the decision to see how it could convert everything to an electronic format. Chandler also saw an opportunity for innovation by implementing an efficient, standardized cost-saving mechanism that put them out in front of their competitors.

---

> “The initial proof of concept was up and running in a few days. Within two weeks, we were testing the application, getting feedback from drivers and customers, and making refinements.”<br><small style="display:block;text-align:right;opacity:0.5;">— Rich Gabrielli, IT Manager, Chandler Concrete</small>

---

## The Solution

Chandler Concrete contacted PSPDFKit after a suggestion from another developer in an Android Slack channel. The company built an app, ChandlerDispatch, using the Viewer, Annotations, and Forms components supported by PSPDFKit for Android. The app provides critical functionality specific to Chandler's needs, which includes the ability to:

- Retrieve data and fill in a PDF form with all the relevant ticket information
- Save copies of the ticket locally so that the ticket is accessible even when a device doesn’t have service
- Add custom ticket information and notes about a job site
- Let the customer sign the ticket digitally
- Flatten and save the ticket before emailing copies to the customer and to Chandler Concrete

“ChandlerDispatch pulls data from our distribution application that has all the ticket information that is sent to the plant. I wrote an API that feeds the ticket data to the application and fills in all the prefilled-in fields on the ticket,” Gabrielli explained. “When the driver gets to the job site and finishes the pour, they fill in some custom ticket information and any notes, and then the customer signs the ticket. At this point, the ticket is flattened and saved to AWS, and an email is sent to the customer and to us as the completed ticket.”

![App Screenshot](/images/blog/2019/case-study-chandler-concrete/app-screenshot-1.png#img-no-shadow)

![App Screenshot](/images/blog/2019/case-study-chandler-concrete/app-screenshot-2.png#img-no-shadow)

Because of how easy it was to set up and configure PSPDFKit, Chandler Concrete was able to provide its employees and customers with a quick and convenient service. Instead of spending time and resources on confusing tech and a prolonged development schedule, Chandler’s use of PSPDFKit allowed it to rapidly implement a reliable app solution and get back to focusing its energy on its core business.

---

> “Before, I was trying to process PDFs without any external libraries and to recreate all the functionality that PSPDFKit includes out of the box. It would have been impossible for me to do this. I needed to provide a solution to a business problem, not write a PDF-processing piece of software.”<br><small style="display:block;text-align:right;opacity:0.5;">— Rich Gabrielli, IT Manager, Chandler Concrete</small>

---

## The Results

ChandlerDispatch has enabled Chandler Concrete to eliminate physical paperwork in the field, thereby cutting down on costs and waste. More importantly, Chandler’s key processes occur much more quickly, with the customers, billing department, and technical service department all receiving the signed ticket in real time.

---

> “With the paper copy, the driver would have to get back to the plant, and then a courier would have to pick up the tickets from the plant in the following days and deliver them to the billing department. Now, everyone has access to the ticket as soon as it is signed.”<br><small style="display:block;text-align:right;opacity:0.5;">— Rich Gabrielli, IT Manager, Chandler Concrete</small>

---

[chandler concrete]: https://www.chandlerconcrete.com/index.php
