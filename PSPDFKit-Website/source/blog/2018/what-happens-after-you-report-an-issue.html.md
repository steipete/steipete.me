---
title: "What Happens After You Report an Issue?"
description: "In this article, we discuss our internal process for how we handle bugs that you report."
preview_image: /images/blog/2018/what-happens-after-you-report-an-issue/article-header.png
section: blog
author:
  - Rad Azzouz
author_url:
  - https://twitter.com/radazzouz
date: 2018-04-24 10:00 UTC
tags: Company, Development, Culture
published: true
---

At PSPDFKit, we offer SDKs for Android, iOS, macOS, Electron, and Web that deal with everything related to PDF. We expose a lot of APIs in our SDKs so that many aspects can be customized. Sometimes the learning curve can be overwhelming for newcomers, and as with any other software, more code means more room for bugs to sneak in.

We categorize support requests into questions and bug reports. In this article, we discuss our internal process for how we handle bugs that you report.

### Open a Support Request

It all starts with you submitting a [support request][Submit a request]. Filing a support request is easy. Filing a **good** support request is also easy; you just have to follow a few extra steps, as outlined below.

Before you open a support request, make sure you are using the latest version of PSPDFKit, and make sure you read our [documentation guides][iOS Guides] and our [API][iOS API]. The answer may already be in there.

It is crucial for us to reproduce the issue. If you’re experiencing a bug, please send us the steps to reproduce it and any other useful piece of information. Make sure you include relevant data such as a sample project, code snippets, [symbolicated crash reports][Advanced Crash Report Symbolication], PDF files, screenshots, and videos.

Additionally, please see our blog post on how to [write good bug reports][Write Good Bug Reports blogpost] and our guide article on how to [report a bug][Bug Reporting Guide Article].

We reply to every support request. Our goal is to get you unblocked and to give you a solution as quickly as possible.

The first thing we do is try to reproduce the issue and determine if it’s a bug on our end or if it’s an API misunderstanding. In either case, it needs to be addressed.

### The Internal Issue

We file internal issues for bug reports, feature requests, and API and documentation improvements.

Every issue we file has to have the following information:

* A clear description of the problem with the steps to reproduce.
* The “Acceptance Criteria” section, aka the expected solution. It’s a section that states what needs to be done to resolve the issue.

We also attach other relevant information such as your contact information, PDF documents, sample code, etc. When possible, we include a failing test; this is very helpful for increasing our code coverage of our SDK and often uncovers the problem and reveals the fix.

### Closing the Circle

As soon as we fix the issue, we make sure it goes through our QA process. Afterward, we merge the pull request. We then contact you to let you know we fixed the issue and that it will be part of our next release.

### Help Us Improve PSPDFKit

Your support requests help us improve our SDKs. Whether you are asking for clarification about a specific API, experiencing a crash, or requesting features, please [reach out to us][Submit a request]; we’re happy to help!

By the way, [we are now hiring][support engineer job post]! 😀

[Submit a request]: https://support.pspdfkit.com/hc/en-us/requests/new
[iOS Guides]: https://pspdfkit.com/guides/ios/current/
[iOS API]: https://pspdfkit.com/api/ios/
[Advanced Crash Report Symbolication]: https://pspdfkit.com/guides/ios/current/troubleshooting/advanced-symbolication/
[Bug Reporting Guide Article]: https://pspdfkit.com/guides/ios/current/troubleshooting/bug-reporting/
[Write Good Bug Reports blogpost]: https://pspdfkit.com/blog/2016/writing-good-bug-reports/
[support engineer job post]: ../../../careers/support-engineer/
