---
title: "Forms in PDF"
description: "Forms provide a simple yet flexible way to gather data from users."
preview_image: /images/blog/2018/forms-in-pdf/article-header.png
section: blog
author:
  - Nick Winder
author_url:
  - http://www.nickwinder.com
date: 2018-03-19 12:00 UTC
tags: Development, PDF, Forms
published: true
---

This post will discuss how forms can be used in a PDF document, exploring what types of information can be utilized and stored. Additionally, it will outline the possibilities of distribution, which are a major advantage to the electronic format.

### What Are Forms?

The concept of forms in PDF is very similar to a form in the physical world. Forms allow a user to enter unique information into a preformatted page. As it’s an electronic format, PDF offers certain advantages to users — for example, the ability to edit entered information at a later date. Document creators also gain advantages, such as the ability to distribute the form data in a custom way and limit the user input to a standardized input format that best represents the data being collected.

![formExample](/images/blog/2018/forms-in-pdf/form-example.png)

Above is an example of a form. Each highlighted area is called a field, and it’s where the user can enter their information. This page could be paired with buttons that perform given actions, such as resetting or submitting. Reset will set the form fields back to their default values, and submit can have a custom action related to it (this will be discussed later in the post).

#### Form Field Types

As with physical forms, sometimes we have to add context to help users fill out forms. The PDF specification has a concept of different types that can help in this situation. Most of these actions will be familiar to a user who has encountered a form on the web, and they range from standard text fields to signature fields.

Below is a list of all possible form field types.

|              |                                          |
| ------------ | ---------------------------------------- |
| Text field   | Alphanumeric text                        |
| Checkbox     | On/off state                             |
| Radio button | Selection of choices                     |
| Combo box    | A drop-down list of choices              |
| List box     | A scrollable list of choices             |
| Signature    | A unique [digital signature][signatures] |
| Button       | Assignable actions                       |

### How to Distribute Gathered Information

Distributing gathered information is one of the great advantages of the PDF specification: It allows the document creator to define ahead of time where the information will be sent. The information can be sent in a variety of formats, which helps present the data to the recipient in a context they understand.

#### Distribution locations

It is possible to set up a form button with an action to send the user-input information to different places. Below is a list of possible communication formats.

|            |                                                                                                                                                                                                          |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local file | The user can decide what to do with this information or maybe edit it at a later date.                                                                                                                   |
| Email      | This will launch the native email client with the data attached. The send-to address can be prefilled, allowing the user to simply click send.                                                           |
| HTTP       | This will send the information to a specified URL via a `GET` or `POST` command. This is useful when a REST API is available, as it will present the data in a format that can be parsed by web servers. |
| FTP        | It is also possible to upload the data via an FTP command for storing on an external server.                                                                                                             |

### Data Formats

In addition to being able to send this information to many places, it is also possible to define the format in which the data is sent. This helps provide context to the recipient and reduces the external workload needed when parsing. Below is a list of possible data formats.

|      |                                                                                                                                                                        |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PDF  | Saves the whole PDF along with the user information. This is useful when it is necessary to keep the context with the data.                                            |
| FDF  | Saves the user information only. This helps when data size needs to be considered — for example, when sending the information as an attachment or sending to a server. |
| XFDF | Similar to FDF, but saves in an XML format. This is useful when extra parsing will be done by an external program.                                                     |
| HTML | Usually pairs with the HTTP request to send to a REST API. This will convert the data into a context that web servers will be able to parse.                           |

## Conclusion

Forms in PDF documents offer many advantages over other methods of collecting data. I’ve addressed some of these benefits in this article, but there are more aspects which have not been discussed. For example, the portability and flexibility of PDFs allow document creators to publish documents that can be supported on many different platforms and still behave in the same way. Features such as these give document creators confidence in the fact that the data produced by the form will be in a standard format no matter where the PDF has been populated.

[signatures]: /guides/ios/current/features/digital-signatures/
