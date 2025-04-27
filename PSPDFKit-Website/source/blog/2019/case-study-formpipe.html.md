---
title: "Case Study: How Formpipe Uses PSPDFKit to Power Its Meetings Plus App"
description: "How Formpipe uses PSPDFKit to power its Meetings Plus app"
preview_image: /images/blog/2019/case-study-formpipe/article-header.jpg
section: blog
author:
  - Natalye Childress
author_url:
  - https://twitter.com/deutschbitte
date: 2019-12-03 7:00 UTC
tags: Company, Customers, Case Study
published: true
secret: false
---

[Formpipe][] is an international company with headquarters in Stockholm that, among other things, develops Enterprise Content Management (ECM) software. The company is primarily concerned with capturing, structuring, streamlining, and distributing information flows.

Out of the dozen products Formpipe provides, three of them — Acadre, Platina, and W3D3 — have an available add-on known as Meetings Plus. Meetings Plus publishes and distributes documentation from public meetings transparently and securely, which allows users to manage documents, meeting information, summonses, agendas, protocols, and more.

Since 2014, Formpipe has used PSPDFKit in its app as a way of providing users with the ability to:

- Access information that’s relevant to meetings (either upcoming or past)
- Take notes in the form of annotations for sharing, collaborating, and preparing for meetings
- Save time and money associated with printing and mailing paperwork
- Keep confidential information from falling into the wrong hands

---

> “PSPDFKit has all the features we need to offer our customers an app that helps them manage their workflow for meetings efficiently and securely.”<br><small style="display:block;text-align:right;opacity:0.5;">— Marte Sandvik, Product Manager, Formpipe
> </small>

---

## The Challenge

The Swedish government operates under _Offentlighetsprincipen_, which deals with the availability of public information (similar to [sunshine laws][] or the [FOIA][]). What this means is that all citizens and journalists are allowed to request access to information about what takes place during meetings, and, so long as it’s not considered confidential, it must be provided to them. Meetings Plus is one such vehicle through which that information is distributed.

Prior to using PSPDFKit, Formpipe faced the challenge of distributing this information in a way that meets the following three criteria:

- Public information must be published on the internet for anyone to access.
- Public and private information must be published to a specific site that politicians can access with mobile devices.
- The two systems of sharing information shouldn’t be mixed, lest classified information falls into the hands of public citizens.

![Screenshot of Meetings Plus App](/images/blog/2019/case-study-formpipe/meetings-plus-app.png)

Due to the difficulty of balancing the above concerns, Formpipe began exploring how to build an app and incorporate an SDK that could display pertinent information to the people who needed it.

---

> “There are certain rules and regulations in place to ensure that the correct information is available to the right people. This logic is crucial because it reduces the risk of exposing the wrong information.”<br><small style="display:block;text-align:right;opacity:0.5;">— Marte Sandvik, Product Manager, Formpipe</small>

---

## The Solution

Central to the app Formpipe wanted to create was the ability to view PDF files. Additionally, the viewer used would need to allow users to make use of the following functionalities:

- Easily read documents in single or split views
- Create a wide variety annotations, including notes, text markups, and free drawing
- Instant search results when trying to find a specific document or annotation
- Sharing and collaborating on documents with other users
- Digital signatures for signing off on important paperwork

![App Color Picker](/images/blog/2019/case-study-formpipe/meetings-plus-colors.png)

Once Formpipe outlined what was needed, the next step was determining which features were most important for the solution they would choose. They identified the following:

- A well-documented API
- A functionality relevant to the user’s needs
- Priceworthiness compared to its competitors

With all these factors combined, Formpipe started searching, and that search led them to PSPDFKit.

---

> “It was important to us that the solution we picked was well established and had the resources available to help us if we needed assistance or improvements, whether in the form of thorough documentation or personalized technical support. We wanted a product whose engineers communicated clearly and responded to our requests. This is necessary since we use the viewer pretty extensively and it’s a critical part of our app that shouldn’t be affected by challenges with new versions, etc.”<br><small style="display:block;text-align:right;opacity:0.5;">— Marte Sandvik, Product Manager, Formpipe</small>

---

## The Results

The developers at Formpipe were able to integrate PSPDFKit into Meetings Plus and get the app up and running ahead of schedule. Now, approximately 50 municipalities in Sweden use the app. The largest of these customers often has as many as 150 items on its meeting agendas, each with between 1 and 10 attachments. With PSPDFKit’s SDK powering Meetings Plus, large amounts of data can be viewed, searched, shared, manipulated, and saved quickly and efficiently. What’s more is government employees can easily manage paperwork in an environmentally friendly way, making it available to the appropriate people, all while knowing they are keeping information safe and secure.

---

> “The sales team at PSPDFKit responds quickly and is friendly and helpful. The SDK contains the functionality we need, e.g. support for both Android and iOS, annotation and digital signature components, and an API we can easily integrate with. Not only that, but our developers praise the extensive good documentation. And as a bonus, the development of the app took much less time than expected, allowing us to release it much earlier than planned.”<br><small style="display:block;text-align:right;opacity:0.5;">— Marte Sandvik, Product Manager, Formpipe</small>

---

[formpipe]: https://www.formpipe.com/
[sunshine laws]: https://www.investopedia.com/terms/s/sunshinelaws.asp
[foia]: https://www.foia.gov/
