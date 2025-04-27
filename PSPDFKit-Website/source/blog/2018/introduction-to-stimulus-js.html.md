---
title: "An Introduction to Stimulus.js"
description: "In this article, we'll look at the Stimulus JavaScript framework and how it can help bring some order to a website's frontend codebase."
preview_image: /images/blog/2018/introduction-to-stimulus-js/article-header.png
section: blog
author:
  - William Meleyal
author_url:
  - http://meleyal.com
date: 2018-07-18 12:00 UTC
tags: Web, Development, JavaScript
published: true
---

In this article, we’ll look at the [Stimulus][stimulusjs.org] JavaScript framework and how it can help bring some order to a website’s frontend codebase. We’ll cover how you might have added JS behavior before and how to translate this to Stimulus, along with the pros and cons of doing so.

READMORE

## What Is Stimulus?

Stimulus is described as _"A modest JavaScript framework for the HTML you already have."_ More specifically, it’s a way to add JavaScript behavior to HTML in a structured and consistent way:

> It doesn’t seek to take over your entire front-end—in fact, it’s not concerned with rendering HTML at all. Instead, it’s designed to augment your HTML with just enough behavior to make it shine.
> <small>[stimulusjs.org]</small>

In an article introducing Stimulus, DHH outlines the motivation for creating it:

> Below the grade of a full page change lies all the fine-grained fidelity within a single page. The behavior that shows and hides elements, copies content to a clipboard, adds a new todo to a list, and all the other interactions we associate with a modern web application. ...
Prior to Stimulus, Basecamp used a smattering of different styles and patterns to apply these sprinkles. ... While it was easy to add new code like this, it wasn’t a comprehensive solution, and we had too many in-house styles and patterns coexisting. That made it hard to reuse code, and it made it hard for new developers to learn a consistent approach.
> <br><small>[Stimulus 1.0: A modest JavaScript framework for the HTML you already have][SVN]</small>

In the article, Stimulus, along with [Turbolinks], is proposed as a simpler alternative to the Single-Page Application (SPA) architecture that’s currently in vogue. For the purposes of this article, we can safely ignore that debate and focus on the benefits Stimulus can bring to a modest website.

At PSPDFKit, our websites comprise some mission-critical aspects of our business — such as our product trial, sales, and licensing — and as such, they include relatively complex behaviors. How can we apply Stimulus to manage this complexity?

## Vanilla Sprinkles

Let’s say our goal is to add some AJAX behavior to a form. Our code should:

1. Submit the form via AJAX.
2. Disable the submit button while loading.
2. Redirect to a given page when the form is successfully submitted.

Typically, when adding such a feature, the following might be a reasonable approach:

1. Add a data attribute that describes our behavior to the HTML in question, with optional configuration via additional attributes:

    ```html
    <form action="/action" method="post"
          data-behavior="form-remote"
          data-success-url="/thanks">
      ...
      <button type="submit">Send</button>
    </form>
    ```

2. Create `form-remote.js`, perhaps in a `behaviors` subfolder so that we can easily include the entire tree:

    ```
    assets/
    ├── javascripts
    │   ├── application.js
    │   └── behaviors
    │       └── form-remote.js
    ```


3. Implement the code that hooks on to our `<form>` element and "sprinkles" on the behavior. The exact implementation depends on your tools of choice. My preference would be something like the following:

    ```js
    // Delay execution until required using event delegation:
    $(document).on('submit', '[data-behavior="form-remote"]', handleSubmit)

    function handleSubmit(e) {
      e.preventDefault()

      var $form = $(e.currentTarget)
      var url = $form.attr('action')
      var data = $form.serialize()

      $.ajax({
        url: url,
        data: data,
        type: 'post',
        beforeSend: function() {
          handleBeforeSend($form)
        },
        success: function() {
          handleSuccess($form)
        }
      })
    }

    function handleBeforeSend($form) {
      // Query a child element of the form and alter its state:
      var $btn = $form.find('[type="submit"]')
      $btn.text('Loading...').attr('disabled', true)
    }

    function handleSuccess($form) {
      // Read the `data-success-url` configuration from the DOM:
      //
      // Ideally, you'd read the success url from the returned `Location`
      // header, but for demonstration purposes, let's say this is a
      // third-party form endpoint you don't control.
      window.location = $form.data('success-url')
    }
    ```

This should look fairly familiar if you’ve used [Bootstrap] or [jquery-ujs]. The general pattern is the same:

1. Add a defined data attribute to an element to give it the behavior.
2. Add additional data attributes to configure the behavior.
3. Query the DOM for child elements the behavior requires.
4. Add event listeners to activate the behavior.

Beyond this, the structure is up to you. You could opt for a bunch of functions (as I have), create a jQuery plugin that encapsulates the behavior, or wrap the functions in a class and instantiate new instances on page load.

## Stimulus Sprinkles

Stimulus builds on the general pattern outlined above, introducing a well-defined API and some nice conveniences to help us organize our code.

So, how might we rewrite the above example using Stimulus?

1. As before, we start with our HTML:

    ```html
    <!-- Stimulus introduces the concept of 'controllers' for adding
         behavior, specified with `data-controller`,

         Configuration values use the controller name as a prefix
         e.g. `data-form-remote-success-url`

         Events and handlers are declared with `data-action` -->
    <form action="/action" method="post"
         data-controller="form-remote"
         data-form-remote-success-url="/thanks"         
         data-action="submit->form-remote#submit">
      ...  
     <!-- Elements to query are declared with `data-target` -->
     <button type="submit" data-target="form-remote.submit">Send</button>
    </form>
    ```

2. Next, we create `form-remote-controller.js`, this time in a `controllers` subfolder. By following these conventions (and with some [webpack magic]), our controller files are automatically required for us:

    ```
    assets/
    ├── javascripts
    │   ├── application.js
    │   └── controllers
    │       └── form-remote-controller.js
    ```

3. Finally, we migrate our JavaScript over to a `Controller` class:

    ```js
    import { Controller } from 'stimulus'

    export default class extends Controller {
      static targets = ['submit']

      submit(event) {
        event.preventDefault()

        let $form = $(this.element)
        let url = $form.attr('action')
        let data = $form.serialize()

        $.ajax({
          url: url,
          type: 'post',
          data: data,
          beforeSend: () => this._beforeSend(),
          success: () => this._success()
        })
      }

      // private

      _beforeSend() {
        $(this.submitTarget)
          .text('Loading...')
          .attr('disabled', true)
      }

      _success() {
        window.location = this.data.get('success-url')
      }
    }
    ```

Reading through the above code, notice how the data attributes declared earlier in our HTML correspond to the properties and method of the class. Even in this simple example, I’d argue this already feels much clearer and more approachable.

## Under the Hood

An interesting aspect of Stimulus works is how instances of our controller classes are created.

Traditionally, there’s some glue code to write to query the DOM for elements that have our custom data attribute (usually on `$(document).ready()` or similar) and then apply our code to each of the matched elements. Alternatively, as in our example above, we might utilize event delegation to wait for a certain event to trigger calling our function or creating our class instance.

In contrast, Stimulus uses the [MutationObserver API]. Rather than querying the DOM, this enables a listener to be notified when a relevant element is created. It also has the advantage that it works for elements inserted dynamically that would not be caught by an initial page load/ready event.

For us, this means there’s no glue code to write. Simply adding the data attribute and corresponding class creates an instance automatically. By following the conventions, everything “just works.” The end result feels very much like the autoload magic that will be familiar to Rails developers.

## Conclusion

Overall, I think Stimulus provides the right balance of features, structure, and conventions to be useful. While getting the most out of it probably means [adding a build step][using-without-a-build-system] to your project, and while the API is less elegant than similar frameworks (e.g. [Backbone]), the wins in productivity, code clarity, and testability make it well worth the shallow learning curve.

[Turbolinks]: https://github.com/turbolinks/turbolinks
[stimulusjs.org]: https://stimulusjs.org/
[SVN]: https://m.signalvnoise.com/stimulus-1-0-a-modest-javascript-framework-for-the-html-you-already-have-f04307009130
[Bootstrap]: http://getbootstrap.com/docs/4.0/getting-started/javascript/
[jquery-ujs]: https://github.com/rails/jquery-ujs
[webpack magic]: https://stimulusjs.org/handbook/installing#using-webpack
[MutationObserver API]: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
[using-without-a-build-system]: https://stimulusjs.org/handbook/installing#using-without-a-build-system
[Backbone]: http://backbonejs.org/#View
