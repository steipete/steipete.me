---
title: "Serving PDFs with Express.js"
description: "We cover some of the different ways to serve PDFs with Express.js"
preview_image: /images/blog/2020/serving-pdfs-with-expressjs/article-header.png
section: blog
author:
  - William Meleyal
author_url:
  - https://meleyal.com
date: 2020-01-07 8:00 UTC
tags: Web, Development, Express
published: true
secret: false
---

In this article we’ll cover how to serve PDF files with [Express.js][], the de facto web framework for Node.js. We’ll show three different ways we can serve the files and explain how to use the `Content-Disposition` header to tell the browser how to handle the file on the client side.

## Getting Started

First, let’s scaffold out a simple Express app:

```sh
$ mkdir pdf-express
$ cd pdf-express
$ npm init -y
$ touch app.js
$ sed -i '' 's/index/app/g' package.json
$ mkdir public views
$ npm install express ejs --save
```

Next, we’ll update `app.js` with some basic boilerplate:

```js
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));
app.set("view engine", "ejs");

app.listen(port, () => console.log(`app listening on port ${port}`));
```

Finally, we’ll add a `"start"` script to `package.json`:

```diff
  "scripts": {
+   "start": "node app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

And then we’ll test that our app runs successfully:

```sh
npm start & open http://localhost:3000
```

If all goes well, we should see our “Hello World!” message shown in the browser.

## Opening PDFs

Our initial goal is to render a list of PDFs and provide links for opening them using the browser’s default PDF handler.

### Example Files

First, we’ll need some PDFs to work with. The following command will download a few example files and place them in the `public/pdfs` folder in our project:

```sh
curl https://pspdfkit.com/images/blog/2020/serving-pdfs-with-expressjs/pdfs.zip | tar -xz - -C ./public
```

### Index Route

At the index (`/`) route of our app, we’ll read the files from `public/pdfs` and show a list of them using a template. Then we’ll update `app.js` as follows:

```js
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

const app = express();
const dirPath = path.join(__dirname, "public/pdfs");
const port = 3000;

const files = fs.readdirSync(dirPath).map(name => {
  return {
    name: path.basename(name, ".pdf"),
    url: `/pdfs/${name}`
  };
});

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { files });
});

app.listen(port, () => console.log(`app listening on port ${port}`));
```

### Index Template

Now it’s time to create the file `views/index.ejs` and update it as follows (you can [grab the logo file here][logo file]):

```ejs
<html>
  <head>
    <title>PDF Express</title>
    <style>
      body { margin: 30px; background: Aquamarine; font: 30px/1.5 "Futura"; display: flex; }
      header { margin-right: 80px; }
      ul { list-style: none; padding-left: 0; }
    </style>
  </head>
  <body>
    <header>
      <h1>
        <img src="/img/logo.svg" width="200">
      </h1>
      <ul>
        <% files.map(file => { %>
          <li>
            <a href="<%= file.url %>"><%= file.name %></a>
          </li>
        <% }) %>
      </ul>
    </header>
  </body>
</html>
```

### Result

Our files should now be listed on the page:

![index](/images/blog/2020/serving-pdfs-with-expressjs/index.png)

Clicking any of the links will open the file using your browser’s default PDF handler:

![open](/images/blog/2020/serving-pdfs-with-expressjs/open.png)

## Downloading PDFs

That’s all good, but what if our requirements change and we want to download the PDF when clicking the link, rather than opening it?

### Content-Disposition: attachment

We can instruct the browser to download the file using the [`Content-Disposition`][] HTTP header. Its default value is `inline`, indicating the file “can be displayed inside the Web page, or as the Web page.” Setting it to `attachment` instead tells the browser to download the file.

### res.attachment()

Express provides a shortcut for setting the `Content-Disposition` header with the [`res.attachment()`][] method.

Note that we can change the name of the file when it’s downloaded by passing in the new file name to `res.attachment()`. This is useful if our file names are opaque (e.g. a digest) and we want to make them more meaningful to the user. (It’s worth mentioning that this can also be achieved on the client side with the [`download` attribute][] of the `<a>` element.)

```js
app.use(
  express.static("public", {
    setHeaders: (res, filepath) =>
      res.attachment(`pdf-express-${path.basename(filepath)}`)
  })
);
```

### Setting the Header Manually

`res.attachment()` is just shorthand for setting the header manually. The code below achieves the same result:

```js
app.use(
  express.static("public", {
    setHeaders: (res, filepath) =>
      res.set(
        "Content-Disposition",
        `attachment; filename="pdf-express-${path.basename(filepath)}"`
      );
  })
);
```

### Result

With our header in place, clicking any of the links will download the file:

![download](/images/blog/2020/serving-pdfs-with-expressjs/download.png)

## Viewing PDFs

Predictably, our requirements have changed again. This time we’re tasked with showing the PDF inline on our page.

### Show Route

Let’s start off by adding a new `show` route in `app.js` that will first find the file from our list using the `:file` parameter in the URL, and then pass it to our template as the `file` variable:

```js
app.get("/:file", (req, res) => {
  const file = files.find(f => f.name === req.params.file);
  res.render("index", { files, file });
});
```

We also need to revert our changes to the `Content-Disposition` header. You can change the value from `attachment` to `inline`, or simply remove the header-related code and the response will default back to `inline`.

### Index Template

For this simple example, we’ll just reuse the `views/index.ejs` template and add a conditional check to render the file if it’s present. Typically, you’d want to move this to a dedicated `show` template and move the shared content to a layout.

We can use a really neat trick combining `Content-Disposition: inline` with the `<embed>` tag to prompt the browser to show the file inside the `<embed>` tag:

```diff
     <ul>
       <% files.map(file => { %>
         <li>
-          <a href="<%= file.url %>"><%= file.name %></a>
+          <a href="<%= file.name %>"><%= file.name %></a>
         </li>
       <% }) %>
     </ul>
     </header>
+    <section>
+      <% if((typeof(file) !== 'undefined')) { %>
+        <embed src="<%= file.url %>" width="500" height="646">
+      <% } %>
+    </section>
   </body>
```

### Result

With that, our PDF is rendered using the browser’s PDF handler, but right inside our page!

![show](/images/blog/2020/serving-pdfs-with-expressjs/show.png)

## Conclusion

We’ve looked at three different ways to provide PDF files via Express:

1. Serving the file and letting the browser decide how to show it.
2. Instructing the browser to download the file with the `Content-Disposition: attachment` header.
3. Combining `Content-Disposition: inline` with the `<embed>` tag to show the file inline on our page.

All three methods can come in handy, depending on your use case. If you want to offer functionality that’s more advanced than simply downloading or showing PDFs, I’d be remiss if I didn’t mention our awesome PDF SDK, [PSPDFKit for Web][].

[express.js]: https://expressjs.com/
[logo file]: /images/blog/2020/serving-pdfs-with-expressjs/logo.svg
[`content-disposition`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition
[`res.attachment()`]: https://expressjs.com/en/4x/api.html#res.attachment
[`download` attribute]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download
[pspdfkit for web]: /web/
