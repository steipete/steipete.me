---
title: "How to Program a Calculator in a PDF"
description: "PDF supports JavaScript, and you can use this functionality to program small applications inside a document."
preview_image: /images/blog/2018/how-to-program-a-calculator/article-header.png
preview_video: /images/blog/2018/how-to-program-a-calculator/article-header.mp4
section: blog
author:
  - Daniel Martín
author_url:
  - https://twitter.com/dmartincy
date: 2018-10-31 8:00 UTC
tags: iOS, Development, PDF, JavaScript
published: true
cta: viewer
---

At PSPDFKit, we have Experimental Fridays, which are days when everyone in the company works on special interest projects or things that are different than the day-to-day work. On one of those days, I experimented with creating a calculator inside a PDF. The iPad, for example, [doesn’t provide a stock calculator app][ipad stock calculator app], so could we have one inside PSPDFKit, which works beautifully on iPad?

**[Download Calculator.pdf.][calculatorpdf]**<br>
Works in [PDF Viewer for iOS][pdfviewerios]/[Android][pdfviewerandroid] and Google Chrome.

### Creating the Calculator Design

To emulate the design of the iOS calculator, I used a screenshot of it as the PDF background. For each calculator button, I created a [circle annotation][circle annotation] and then flattened it to embed its appearance into the PDF page.

### Writing Some Functionality

As we need to use some JavaScript functions from different parts of the PDF document, we declare the functions inside a document-level script. For example, this is the function that clears the calculator display:

```js
function ClearDisplay() {
   var display = getField('Display');
   display.value = "";
}
```

And this is the function that appends digits:

```js
function DigitClicked(digitValue) {
   var display = getField('Display');
   if (digitValue == 0 && display.value == "0") {
      return;
   }
   if (waitingForOperand) {
      ClearDisplay();
      waitingForOperand = false;
   }
   display.value = "" + display.value + digitValue;
}
```

First we avoid displaying several consecutive zeroes. Then, if we are waiting for an operand, we clear the calculator display and enter the new number. If we are not waiting for an operand, we simply concatenate the new digit.

Now we need to call these functions when the calculator buttons are pressed. For this, we are going to use the field mouseup JavaScript event. For example, the field mouseup script that will be associated with the 9 number button is the following:

```js
DigitClicked(9);
```

Adding events in PSPDFKit is very easy. Here’s how we would add the script to the 9 button:

```objc
PSPDFButtonFormElement *button = [document.formParser findAnnotationWithFieldName:@"9_button"];
button.additionalActions = @{ @(PSPDFAnnotationTriggerEventMouseUp): [[PSPDFJavaScriptAction alloc] initWithScript:@"DigitClicked(9);"] };
```

First we get a reference to the button, identified by its name: 9_button. Then we set its `additionalActions` property to a dictionary where the key is the JavaScript event (in this case, mouseup) and the value is the corresponding [`PSPDFJavaScriptAction`][document actions] that will be executed when the event happens.

This way of programming is similar to how you would create a simple event-driven application in other programming environments like Cocoa, Qt, or Java Swing. You can find out more information about our JavaScript support in our [user guides][].

### Result

Below is a video showing the final appearance of our calculator after we add every script and load the PDF on the iPad using [PDF Viewer for iOS][pdfviewerios] by PSPDFKit.

<video src="/images/blog/2018/how-to-program-a-calculator/calculator-example-ios.mp4" width="100%" autoplay playsinline loop muted></video>

Or if you’re an Android user, here’s what it looks like on [PDF Viewer for Android][pdfviewerandroid].

<video src="/images/blog/2018/how-to-program-a-calculator/calculator-example-android.mp4" width="100%" autoplay playsinline loop muted></video>

Now we can start doing some calculations without leaving PSPDFKit!

## JavaScript Events in PDF

PDF documents support many features that allow users to interact with a document using the mouse or a tap on the screen. Annotations, for example, are pieces of text, images, sounds, etc. that enrich a document. Navigation facilities let you move through a document in many ways — for example, from a page to a particular section, even if that section is on a page that is in another document.

One relatively unknown interactive feature of PDF is that it supports writing small scripts in JavaScript that target a PDF JavaScript API. These scripts are executed when some interesting things, or events, happen on a PDF document.

All JavaScript scripts in a PDF are executed in response to a particular event (for example, a tap on a button). There are many different events that can trigger the execution of JavaScript, but the most important ones are:

- **Document-level scripts** — Scripts that will be executed when the document is open. They are typically used to define “global” functions that will be used in the entire PDF, as we will see later.
- **Field mousedown** — Scripts that will be executed when a form field is clicked or tapped.
- **Field calculate** — After the contents of a form field change, it’s possible to associate scripts that will perform calculations with dependents in a particular order (similar to how a spreadsheet works).
- **Field validate** — Validates that the information entered in a form field is correct (for example, that some value is a valid email address).
- **Field keystroke** — Validates that the keystrokes entered in a form field are valid (for example, we can restrict a form field to always contain numeric values).
- **Field format** — Formats a form field value in a particular way (for example, after entering a phone number, it may format it automatically as a U.S. phone number).

## What You Can Do with JavaScript

Having support for JavaScript is great, and now that we know about the events where JavaScript code can be executed, let’s explore what we can do with JavaScript in a PDF.

The official JavaScript API for PDF is an [overwhelming specification][javascript api for pdf] divided into several classes. For example, the `Doc` class contains methods and properties that target the currently open PDF document, and `Field` is an object that contains operations you can perform on a form field.

Let’s say you have a PDF with a check box element with the name "MyCheckBox". You can check it programmatically by writing the following JavaScript code snippet:

```js
var checkBox = this.getField("MyCheckBox");
checkBox.checkThisBox(0, true);
```

The first argument of `checkThisBox`, `0`, is the index of the particular widget of the check box form field that will be checked. The second argument, `true`, means “check this checkbox”; `false` means “uncheck this checkbox.”

## PSPDFKit JavaScript Architecture

The JavaScript execution environment of PSPDFKit is a cross-platform set of components:

- **The JavaScript virtual machine** — This is the component responsible for executing JavaScript code.  We engineered this component to support the concept of “load path,” i.e. a path that contains JavaScript scripts that will be executed when the virtual machine is initialized. This gives us the flexibility to write parts of the JavaScript API either in native code, or in JavaScript when we deem that performance is not critical.
- **The JavaScript bridge** — This is the “glue” between JavaScript code and native code. There are lots of challenges in this component, like how to deal with the different memory management in JavaScript and C++ (the former uses garbage collection, while the latter uses reference-counted memory management).
- **The JavaScript bindings** — This is the implementation of the PDF JavaScript API. This component uses the JavaScript bridge to convert between JavaScript objects and native objects and vice versa, and to perform the operations on the native objects.

One interesting point about the JavaScript bindings is that we wanted users to be able to know if they were using the PDF JavaScript API incorrectly — for example, if you wrote this line of code:

```js
checkBox.checkThisBox(0, 3);
```

We wanted to log why this call is wrong (the second argument should be a Boolean and it’s a number). To achieve this, we developed a declarative way to create new JavaScript bindings. When we want to add a new JavaScript binding to PSPDFKit, we simply have a call like the following pseudocode:

```cpp
registerAPIMethod(&Module::CheckThisBoxImpl, "checkThisBox",
                          {"nWidget", true, isValidNumber(),
                           "bCheckIt", false, isValidBoolean()});
```

The first argument is a reference to the native implementation of this binding, the second argument is the name of the method that will be exposed to JavaScript, and the third argument is a declarative way to express the API parameters. The first element is the parameter name, the second element says if the parameter is required or not, and the third element is a function that validates that the parameter is of the correct type.

With this approach, we can automatically have parameter validation and show the following kinds of descriptive error messages without much effort:

```sh
Error executing script: Error Domain=PSPDFJavascriptErrorDomain Code=101
Error evaluating JavaScript mouse/cursor action for form field Button4.
Error: Argument name 'bCheckIt' has wrong type. Argument has type number,
but expected boolean.
```

## Conclusion

PDF interactivity using JavaScript opens up a new world of opportunities for PDF creators. You can compute formulas over form fields, format text, show alert messages, and more. In this article, we not only walked through the steps of how you can be creative and build a PDF document that emulates a desk calculator, but we also explored the general architecture of the cross-platform JavaScript engine inside PSPDFKit. Isn’t it cool?

[ipad stock calculator app]: https://www.cultofmac.com/421893/why-the-ipad-has-never-shipped-with-a-calculator-app
[javascript api for pdf]: https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/js_api_reference.pdf
[user guides]: /guides/ios/current/features/javascript/
[document actions]: /guides/ios/current/annotations/pdf-actions
[circle annotation]: https://pspdfkit.com/api/ios/Classes/PSPDFCircleAnnotation.html
[pdfviewerios]: https://pdfviewer.io/#ios
[pdfviewerandroid]: https://pdfviewer.io/#android
[calculatorpdf]:/images/blog/2018/how-to-program-a-calculator/calculator.pdf
