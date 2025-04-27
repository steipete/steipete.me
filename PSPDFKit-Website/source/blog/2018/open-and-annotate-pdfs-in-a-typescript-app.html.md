---
title: "Open and Annotate PDFs in a TypeScript App"
description: "How to add a PDF viewer and annotator to your TypeScript app by embedding PSPDFKit for Web."
preview_image: /images/blog/2018/open-and-annotate-pdfs-in-a-typescript-app/article-header.png
section: blog
author:
  - Miguel Calderón
author_url:
  - https://twitter.com/miguelca
date: 2018-12-17 8:00 UTC
tags: Web, Development, JavaScript, TypeScript
published: true
secret: false
---

Among the growing galaxy of frameworks, transpilers, linters, and other development tools that have populated the web frontend toolset in recent years, [TypeScript][] has consistently stood out, largely due to its growing popularity. TypeScript is backed by Microsoft, and the use of this compiler keeps spreading as new versions with increased robustness and support are released.

Dynamic typing (the ability to change a variable’s data type at will) and loose typing (where a handful of data types account for very different values), have been regarded as both strengths and weaknesses of JavaScript, but it depends on your use case. Meanwhile TypeScript, as its name implies, emphasizes type enforcement: Whenever you use a variable, you must specify its type as exactly as possible. Once this type is set and known, you cannot change it afterward.

Regardless of whether or not you like TypeScript, it’s hardly contestable that enforcing typing helps not only with writing more predictable and testable code, but also with avoiding runtime errors that can be caught by a compiler when using types. On the whole, type enforcement contributes to an enhanced developer experience, and it mitigates the pain of scaling and maintaining large applications.

With TypeScript (and also with [Flow][], a type-checking tool), a variable keeps the same nature as it’s moved around your application.

TypeScript comes with a lot more features out of the box, like ES6+ syntax, which simplifies the development workflow by removing the need for commonly used plugins and loaders for writing modern JavaScript.

Here at PSPDFKit, we’re type checking fans, so it was only a matter of time before [we addressed TypeScript][], which can be used to integrate our SDK without too much hassle.

## Setting Things Up

In the following example, we’ll embed our SDK in a TypeScript application. We will follow the process step by step, in addition to providing the entire code — available from a fully functional repository — for you to experiment with and use in your next PDF-powered TypeScript application.

First things first: Get yourself a demo license [here][]. Make sure you tick the Web checkbox, and then open the confirmation email, which contains the link that will give you access to your trial license. Simply follow the PSPDFKit for Web link and choose Standalone > Client only (to get your npm key and download the SDK) and then Standalone > Integration (to get your license key for use with the SDK). Keep both keys at hand, as you’ll need them later.

Open your favorite development folder and create a subfolder for our example — something like `pspdfkit-web-example-typescript`. `cd` to it, and then run the following:

[==

```yarn
yarn init
```

```npm
npm init
```

==]

You’ll be prompted for some initialization data. Usually the default values will be good enough, so you can even skip the prompts using `npm init -y` or `yarn init -y`.

TypeScript can compile `.ts` files with its own `tsc` compiler without needing any external tool. Nevertheless, we’ll use `webpack` to help us automate handling assets and building the app, bringing us closer to a real-world scenario where we usually need to deal with files other than JavaScript or TypeScript:

[==

```yarn
yarn add -D copy-webpack-plugin cross-env eslint html-webpack-plugin prettier ts-loader typescript webpack webpack-cli webpack-dev-server ncp
```

```npm
npm install -D copy-webpack-plugin cross-env eslint html-webpack-plugin prettier ts-loader typescript webpack webpack-cli webpack-dev-server ncp
```

==]

Now it’s time to download (and install) the PSPDFKit for Web library:

[==

```yarn
yarn add -D https://customers.pspdfkit.com/npm/[NPM_KEY_HERE]/latest.tar.gz
```

```npm
npm install -D https://customers.pspdfkit.com/npm/[NPM_KEY_HERE]/latest.tar.gz
```

==]

We’ll be loading the library from the browser, so we need to copy it somewhere where it will be accessible. Let’s copy these files to the `src` folder so that TypeScript can find them:

```bash
mkdir src
cp ./node_modules/pspdfkit/dist/pspdfkit.js src/pspdfkit.js
cp -R ./node_modules/pspdfkit/dist/pspdfkit-lib src/pspdfkit-lib
```

Now let’s start creating the actual example:

```bash
mkdir src
touch src/index.ts
```

Notice the extension of the file: `.ts`. That’s the extension TypeScript will recognize by default, and `index.ts` is the file where our typing journey will begin.

In order to make our example work, we’ll need some help for the boring, more bureaucratic tasks: compiling, bundling assets, copying files, etc. We’ll let TypeScript and webpack handle all those for us using the settings provided in [the example files][example github repo], and instead we’ll focus on the coding part.

The challenge is not as hard as it might seem: We just need to import the PSPDFKit for Web library into our module and call `PSPDFKit.load()` with a PDF document URL and a DOM selector to render the PDF in.

Sounds straightforward? Too easy? That’s because it _is_:

```js
import * as PSPDFKit from "./pspdfkit"

PSPDFKit.load({
  pdf: "example.pdf",
  container: ".container",
  licenseKey: process.env.PSPDFKIT_LICENSE_KEY,
})
  .then(instance => {
    instance.addEventListener(
      "annotations.change",
      () => {console.log(`${pdf} loaded!`)}
    );
  })
  .catch(console.error);
```

This module will launch PSPDFKit for Web and load and render `example.pdf` in an HTML file such as this:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>PSPDFKit for Web - TypeScript example</title>
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <div class="container"></div>
  <script src="app.js"></script>
</body>
</html>
```

The CSS file referenced by the HTML above can be as thin as this:

```css
.container {
  height: 100vh;
}
```

In any case, we need to specify some height for the container. Otherwise, it won’t be possible to render the PDF and the interface in it.

Now you might be thinking: _“Wait a minute... That’s just plain ES6+ JavaScript! After all that wordiness about type checking — and what a _great_ idea it was to teach JavaScript to recognize each variable’s nature — where are the types? I want my types!”_

Or maybe you’re just reading on, patiently waiting for this example to grow into something meaningful. Wise you. We’re getting there.

If you run the above code through the TypeScript compiler, it’ll do its job and spit out an `app.js` file without any complaint. That’s because TypeScript is a superset of JavaScript — which in fact means that the TypeScript compiler understands JavaScript (but not necessarily the other way around).

But we want the compiler to complain at our type looseness. We want it to point to our functions, arguments, and objects and ask for proper typing. However, by default, the TypeScript compiler will not do nothing of the sort.

That’s because we need to tell it about our preferences. We need to set a flag in `tsconfig.json`, which is, you guessed it, the configuration file for the TypeScript compiler. This should do it:

```json
{
  "compilerOptions": {
    "noImplicitAny": true
  },
}
```

There are more options to be set in that file, but we won’t deal with them in this article. You can check them out in the provided example `tsconfig.json` file and in the [TypeScript][] documentation.

Once that flag is set and the compiler is launched again, the whining party begins. This is the first complaint `tsc` will yell at our naked JavaScript code:

```bash
Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i @types/node`.
```

Some would say it’s still being too kind with us. It even suggests a definitive solution to our data typing problems!

But we do as we’re told and:

[==

```yarn
yarn add --dev @types/node
```

```npm
npm i -d @types/node
```

==]

Those are type definitions for Node: We were trying to use `process.env`, which was of an unknown type. By providing the necessary information in our `devDependencies`, we can now move on to the next step.

Running the compiler again will show more errors (did you expect otherwise?):

```bash
Could not find a declaration file for module './pspdfkit'. './src/pspdfkit.js' implicitly has an 'any' type.
Parameter 'instance' implicitly has an 'any' type.
```

Once the `noImplicitAny` flag has been set in `tsconfig.json`, TypeScript won’t put up with any code, internal or external, that isn’t properly labeled with its type: what it is, what it takes, what it returns. Now suddenly it wants to know everything!

The problem here is that, to date, we don’t have a type definition file for PSPDFKit for Web, which is something we want to address sooner rather than later.

But we don’t want to give up just because of this little problem, so we’ll create our own definition file for the `pspdfkit` module! Well, I will. Here you go:

```js
export as namespace PSPDFKit;

export function load({
  pdf,
  container,
  licenseKey,
}: {
  pdf: string;
  container: string;
  licenseKey: string;
}): Promise<Instance>;

export function unload(container: string): void;

export type Instance = {
  addEventListener: (event: string, callback: Function) => void
};
```

It’s named `pspdfkit.d.ts`: Module type definition files must have the extension `.d.ts` with the module name as a base name in order for TypeScript to recognize them automatically.

Notice that this file only exports the type definitions for a small subset of the PSPDFKit for Web SDK API — just the methods and objects we’ll be using in our example, which is what TypeScript will ask for.

It’s time to run the compiler again and... _voilà_! The PDF is up and rendering in all its glory.

It wasn’t that hard, was it? I’m sure we can go further with little effort, now that we’ve tamed the TypeScript compiler beast with just a small bunch of type definitions.

So let’s do it! Let’s add a file browser to our little app so we can open just about any file we want from our local file system instead of rendering the same PDF over and over again.

It should be easy. We’ll edit the `<body />` content in `index.html`, like so:

```html
<body>
  <div>
    <input type="file" class="chooseFile" accept="application/pdf" />
  </div>
  <br />
  <div class="container"></div>
</body>
```

And, in `index.ts`, we’ll wrap our loading code in a reusable function to be called when the app is opened and whenever we choose a new file:

```js
function load(pdf) {
  console.log(`Loading ${pdf}...`);
  PSPDFKit.load({
    pdf: pdf,
    container: ".container",
    licenseKey: process.env.PSPDFKIT_LICENSE_KEY,
  })
    .then(instance => {
      instance.addEventListener(
        "annotations.change",
        () => {console.log(`${pdf} loaded!`)}
      );
    })
    .catch(console.error);
}

document.addEventListener("change", function(event) {
  if (event.target && event.target.className === "chooseFile" && event.target.files instanceof FileList) {
    PSPDFKit.unload(".container");
    load(URL.createObjectURL(event.target.files[0]));
  }
});

load("example.pdf");
```

This will result in the following:

```bash
Parameter 'pdf' implicitly has an 'any' type.
```

Duh! Let’s type our function:

```js
function load(pdf: string) {
```

But then also:

```bash
Property 'className' does not exist on type 'EventTarget'.
Property 'files' does not exist on type 'EventTarget'.
```

One would think that TypeScript should be _aware_ that the `target` property (which it correctly identifies implicitly as of the `EventTarget` type, without us needing to do it) does have the `className` and `files` properties, as it can only reference the `input[type="file]` element we’ve added to `index.html`.

The truth is that it can’t infer the type from the information it has, and there can be cases where `EventTarget` doesn’t have `className` (like when it’s the document itself), and obviously there are cases where it doesn’t include `files`. How do we make TypeScript aware of this?

One way to solve this problem is to create an interface definition for our event that includes the HTML element type information we expect to receive in our event handler:

```js
interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

document.addEventListener("change", function(event: HTMLInputEvent) {
  if (event.target && event.target.className === "chooseFile" && event.target.files instanceof FileList) {
    PSPDFKit.unload(".container");
    load(URL.createObjectURL(event.target.files[0]));
  }
});
```

With this information, TypeScript can correctly identify the event as having all the types needed by our event handler.

Does this work now? Of course! Below is the final result of our typing efforts, which may give you an idea of how easy it is to integrate PSPDFKit for Web in any TypeScript project.

![Article Header](/images/blog/2018/open-and-annotate-pdfs-in-a-typescript-app/typescript-example-screenshot.png)

I hope you found this example useful. Don’t hesitate to contact [support][] if you need any help with it or with your [PSPDFKit for Web][] installation.

You can also follow the link to the [example GitHub repo][] and play with it or modify it to suit your own implementation.

[example github repo]: https://github.com/PSPDFKit/pspdfkit-web-example-typescript
[here]: https://pspdfkit.com/try/
[flow]: https://flow.org/
[pspdfkit for web]: https://pspdfkit.com/pdf-sdk/web/
[typescript]: https://www.typescriptlang.org/
[wasm blog post]: https://pspdfkit.com/blog/2018/a-real-world-webassembly-benchmark/
[node.js]: https://nodejs.org
[yarn]: https://yarnpkg.com/
[trial]: https://pspdfkit.com/try/
[adding to your project]: https://pspdfkit.com/guides/web/current/standalone/adding-to-your-project/
[integration]: https://pspdfkit.com/guides/web/current/standalone/integration/
[support]: https://support.pspdfkit.com/hc/en-us/requests/new
[immutability of data]: https://pspdfkit.com/blog/2018/immutablejs-and-lazy-evaluation/
[we addressed typescript]: https://pspdfkit.com/guides/web/current/other-languages/typescript/
