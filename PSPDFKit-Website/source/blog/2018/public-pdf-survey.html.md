---
title: "Leverage Instant Layers and Forms to Do a Public Survey"
description: "We discuss a simple approach for doing a public survey."
preview_image: /images/blog/2018/public-pdf-survey/article-header.png
section: blog
author:
  - Silvio Doblhofer
author_url:
  - https://twitter.com/sido378
date: 2018-02-05 12:00 UTC
tags: Instant, Development, Web, How-To, PSPDFKit Server
published: true
---

With the release of PSPDFKit for Web 2017.9, we added support for forms and our new Instant layers feature to PSPDFKit for Web and PSPDFKit Server. This means your users can now fill out forms via our web framework, while you are able to granularly manage access to your documents. For more information about our new features, check out our [release blog post for version 2017.9](https://pspdfkit.com/blog/2017/pspdfkit-web-2017-9/). Meanwhile, keep reading to see a short example of how you can use Instant layers in combination with the new forms support to conduct a public survey.

## Leverage Instant Layers and Forms to Do a Public Survey

In this example, we‘ll make a simple web application to collect survey data via a PDF. Similarly, you could set up PSPDFKit for Web to collect support requests from customers or collect feedback from your users. To implement these, you’ll need a running PSPDFKit Server instance, a simple web server that serves PSPDFKit for Web and generates a JSON Web Token (JWT), and, of course, a PDF with an embedded form.

First, follow our [Getting Started guide](https://pspdfkit.com/guides/server/current/deployment/getting-started/) to set up your PSPDFKit Docker container. Then you’ll be able to visit `localhost:5000/dashboard` and upload the form PDF.

The next step is to set up a server and serve a simple page embedding PSPDFKit for Web and generating JWTs for visiting users. We’ll accomplish this via a simple Node.js server using the [Express](https://expressjs.com/) web framework, an [EJS template](http://ejs.co/), and the [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) library. See our [Integration guide](https://pspdfkit.com/guides/web/current/server-backed/integration/) for more details on how to set up PSPDFKit for Web.

To demonstrate the above, I‘ve included three code snippets as implementation examples.

The first is the `Express` route handler that renders our template. We need a `userToken` to identify users, which will in turn be used to generate our JWT.  We also save the `userToken` as a cookie so our users do not lose their progress when reloading or reopening the page:

[==

```es
app.get("/", (req, res) => {
  const documentId = 1;
  const userToken = req.cookies.userToken || uuid();
  const pspdfkitToken = generateJWT(documentId, userToken);

  res.cookie("userToken", userToken, { maxAge: 900000, httpOnly: true });

  res.render("show", {
    pspdfkitExternalUrl: "http://localhost:5000",
    jwt: pspdfkitToken,
    instant: false,
    documentId
  });
});
```

```js
app.get("/", function (req, res) {
  var documentId = 1;
  var userToken = req.cookies.userToken || uuid();
  var pspdfkitToken = generateJWT(documentId, userToken);

  res.cookie("userToken", userToken, { maxAge: 900000, httpOnly: true });

  res.render("show", {
    pspdfkitExternalUrl: "http://localhost:5000",
    jwt: pspdfkitToken,
    instant: false,
    documentId
  });
});
```

==]

The second code snippet is the function generating the JWT used in the previous snippet:

[==

```es
// Note: The following code is identical for JavaScript and ES2015+
function generateJWT(document_id, userToken) {
  return jwt.sign(
    {
      document_id: document_id,
      permissions: ["read-document", "edit-annotations", "download"],
      layer: userToken
    },
    fs.readFileSync("./jwt.pem"),
    {
      algorithm: "RS256",
      expiresIn: 10 * 365 * 24 * 60 * 60 // 10yrs
    }
  );
}
```

```js
// Note: The following code is identical for JavaScript and ES2015+
function generateJWT(document_id, userToken) {
  return jwt.sign(
    {
      document_id: document_id,
      permissions: ["read-document", "edit-annotations", "download"],
      layer: userToken
    },
    fs.readFileSync("./jwt.pem"),
    {
      algorithm: "RS256",
      expiresIn: 10 * 365 * 24 * 60 * 60 // 10yrs
    }
  );
}
```

==]

Note that we use the generated `userToken` as the value for our `layer` property. This tells the server to persist all changes our users make to the layer with the specified name — in this case, a randomly generated `UUID`. We also need to present a private key to sign our JWT.

The last part is the EJS template that embeds PSPDFKit for Web:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>PSPDFKit Web Example</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="/stylesheets/app.css" />
    <script src="<%= pspdfkitExternalUrl %>/pspdfkit.js"></script>
  </head>
  <body>
    <header class="navbar">
      <div class="navbar-center">
        <h1>Public Survey</h1>
      </div>
    </header>
    <main class="document">
      <div id="doc-viewer" class="viewer"></div>
      <script>
        var configuration = {
          authPayload: { jwt: "<%= jwt %>" },
          container: "#doc-viewer",
          documentId: "<%= documentId %>",
          instant: <%= instant %>
        };
        PSPDFKit.load(configuration).catch(function(error) {
          console.log(error);
        });
      </script>
    </main>
  </body>
</html>
```

This should now be enough to render your form and let users fill it out.

After users have filled out your form, there are two more steps involved to read out the results of your survey. The first one is getting the list of layers via the server‘s [Instant layers API](https://pspdfkit.com/guides/server/current/api/instant-layers/#fetching-document-layers), which will result in the following response:

```json
{
    "data": [
        "83f6486d-af09-4b93-b4c4-fb9593d89149",
        "ffc99a86-d64a-4d3f-9325-f1db34fee8c0"
    ]
}
```

If we now [fetch the form field values](https://pspdfkit.com/guides/server/current/api/instant-layers/#fetching-document-form-field-values) for one of the returned layers, we’ll get the results for our survey:

```json
{
    "data": {
        "formFieldValues": [
            {
                "createdBy": null,
                "name": "First Name",
                "updatedBy": null,
                "value": "Foo"
            },
            {
                "createdBy": null,
                "name": "Last Name",
                "updatedBy": null,
                "value": "Bar"
            },
            {
                "createdBy": null,
                "name": "Email Adress",
                "updatedBy": null,
                "value": "foo@bar.com"
            },
            ...
        ]
    }
}
```

If you don’t care about the values in JSON but want the PDF with the filled-in values, you can use the [/pdf endpoint](https://pspdfkit.com/guides/server/current/api/documents/#fetching-document-s-pdf-file) with the `layer` parameter to download the resulting PDF.

This example demonstrated a simple way to leverage Instant layers to let users fill out a form without having to copy a document for every user. Additionally, it made it so you can easily get the results in the form of JSON objects or generated PDFs.
