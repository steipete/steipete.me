---
title: "Tips for Creating a Maintainable and Fast PDF Form"
description: "This article offers some tips for creating a PDF form so that the document is maintainable and performs well in PDF viewers."
preview_image: /images/blog/2019/tips-create-maintainable-fast-pdf-form/article-header.png
section: blog
author:
  - Daniel Martín
author_url:
  - https://twitter.com/dmartincy
date: 2019-04-09 8:15 UTC
tags: Development, PDF, Forms
published: true
secret: false
---

Interactive forms are one of the most important features of PDFs. Since PDF 1.2, a PDF document may contain any number of fields for collecting information and processing it later, sending it by email, or printing it. For example, a university may send a student a PDF form document with the information required to enroll in a course so that it can be electronically filled in and sent back.

But, as with every digital system that relies on data, there is a problem of scale. More specifically, what happens if the PDF form has hundreds of fields? The fact that you may have a high number of fields in a document may be a problem for two reasons: future maintainability by the form author or authors, and not having the best possible performance when the PDF is viewed in PDF viewers. This article will explain both problems and offer suggestions for mitigating them.

## How to Create a Form Document

There are many ways to create a PDF form document. You can begin by working from an existing document, or you can start from scratch. For example, this is how you would add a push button form field to a document with PSPDFKit:

```swift
// Open a sample document.
let document = PSPDFDocument(url: URL(fileURLWithPath: "Sample.pdf"))
// Create a push button form element.
let pushButtonFormElement = PSPDFButtonFormElement()
pushButtonFormElement.boundingBox = CGRect(x: 20, y: 200, width: 100, height: 83)
pushButtonFormElement.pageIndex = 0
// Now insert it into the document.
PSPDFButtonFormField.insertedButtonField(with: .pushButton, fullyQualifiedName: "PushButton", documentProvider: document.documentProviders.first!, formElements: [pushButtonFormElement], buttonValues: ["Sample value"])
```

## How to Keep a Form Document Maintainable

The process of creating a form document that was presented in the previous section can be repetitive if you need to add a lot of fields. Also, there is a chance that not every form field should be independent of the others. For instance, you may want some form fields to always have the same value, or you may want to create groups of related form fields that you can manipulate as a single unit. The following tips will help you maintain your form document in the future, thereby reducing the time to extend it or understand how it is organized.

### Automatically Synchronize the Values of Form Fields

One property of PDF form fields is that fields that share a name also share a value. For example, if you create two fields with the name Phone, you could place them on different pages, and then when you enter a phone number in one of them, the same phone number will automatically be entered in the other field. This is a special kind of “PDF magic,” and you don’t have to do anything to achieve it other than naming the two form fields the same.

### Create Groups of Form Fields

It’s probable that in your document there’s some kind of relationship between some of its form fields. For example, a PDF contract may require the signer to enter personal information such as their name, country of residence, city of residence, and address. We can group that information together with a name like “Personal Information” so that, as we will see later, we can modify properties of that field group more easily.

The way to create hierarchies of form fields in a PDF is by naming them using dot (.) notation. For example, to create the hierarchy of fields related to the personal information we described before, we would name the first form field Personal Information.Name and the second one Personal Information.Address. Don’t worry about the space between Personal and Information; PDF form fields support spaces, so be sure to use them to create a name that is readable and easy to understand. Note that Personal Information is also a form field, but it acts only as a container of form fields. Technically, Personal Information is a non-terminal form field, and Personal Information.Name and Personal Information.Address are terminal form fields — that is, they are actually displayed on the PDF document.

#### How to Manipulate Groups of Form Fields

Once you have a group of form fields, you can manipulate them as a single entity. For example, if you want to change the text color of every single form field from the Personal Information group to red, you can use this simple JavaScript script that you execute using [PSPDFKit’s native JavaScript capabilities][]:

```js
this.getField("Personal Information").fillColor = color.red;
```

Once you do that, the text color of the name and address will be red.

## How to Group Form Fields for Improved Performance

Grouping form fields is not only beneficial for better maintainability; it can also have an impact on the performance of PDF viewers. To understand why, let me briefly explain how PDF form fields are laid out in a PDF file.

When you add a new form field to a PDF document, it’s added to a structure known as the fields array. Despite the word array in the term, fields can have children. Every child must have, at most, one parent, so PDF form fields are modeled as tree data structures. One of the good things about using a tree data structure is that queries can be faster than if you were working with a plain list, because when information is structured as a tree, you can skip groups of elements during a search. For example, imagine adding the form fields Name, Address, and Phone to a PDF document. As you are not using dot notation, they will be considered independent form fields and laid out internally as a list, like this (details omitted):

```
Fields
|_ Name
|_ Address
|_ Phone
```

However, if you add the form fields with the names Personal Information.Name, Personal Information.Address, and
Personal Information.Phone, the result will be like the following tree:

```
Fields
|_ Personal Information
   |_ Name
   |_ Address
   |_ Phone
```

This means that a PDF viewer will generally access fewer elements when it needs to search for a particular one (three top-level form fields when elements are organized as a list vs. one top-level form field when elements are organized as a tree).

## Conclusion

Forms are an important feature of interactive PDF documents. However, the way you name them using PSPDFKit or any other PDF authoring tool is important for various reasons:

- Having two or more form fields with the same name automatically synchronizes their values. You don’t have to write logic to do that yourself.
- Having descriptive names for form fields reduces the time it takes for a new person to understand what the PDF form does.
- Creating groups of form fields using dot notation lets you manipulate them as a single entity without referring to them individually. Also, this helps with performance when the PDF form is viewed later, because a group of form fields forms a tree, and computers like trees very much.

I hope these tips help you create better PDF forms. The next time you are exporting a document to a form PDF, consider renaming the generated form fields to have better names so that manipulating the document is a nice experience.

[pspdfkit’s native javascript capabilities]: https://pspdfkit.com/guides/ios/current/features/javascript/
