---
title: "Generate Invoices with PDFKit on Node.js"
description: "Learn how to use the PDFKit JavaScript SDK to generate invoices for your web app."
preview_image: /images/blog/2019/generate-invoices-pdfkit-node/article-header.png
section: blog
author:
  - Philipp Spiess
author_url:
  - https://twitter.com/PhilippSpiess
date: 2019-04-23 8:00 UTC
tags: Web, Development, PDF, Node.js
published: true
secret: false
---

A lot of Node.js web applications require dynamic PDF generation. When researching possible solutions, developers often stumble upon [PDFKit][], a JavaScript PDF generation library for Node and the browser.

Today we’ll take a closer look at PDFKit and learn how it can be used to dynamically generate invoices. If you want to skip directly to the solution, you can take a look at the [complete example on GitHub][invoice example].

## Getting Started

Before we begin, we start a new npm package and pull in the dependencies we’ll need for the project:

```sh
mkdir pdfkit-invoice-node
cd pdfkit-invoice-node
npm init -y
npm install --save pdfkit
```

With that set up, we’re ready to start creating our first invoice.

## Data Model

In order to make our invoice generator reusable, we design a simple data model in the form of a JavaScript object. This model will hold all the information we need to generate the invoice. Here’s an example of how such an invoice object might look:

```es
const invoice = {
  shipping: {
    name: "John Doe",
    address: "1234 Main Street",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postal_code: 94111
  },
  items: [
    {
      item: "TC 100",
      description: "Toner Cartridge",
      quantity: 2,
      amount: 6000
    },
    {
      item: "USB_EXT",
      description: "USB Cable Extender",
      quantity: 1,
      amount: 2000
    }
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 1234
};
```

In the above object, we have a `shipping` key that contains all shipping information that should be printed on the invoice. The `items` key contains an array of all items we want to be printed on the invoice (the `amount` is the sum for all pieces of this item in cents). The `subtotal` key contains the sum of all items in cents, and the `paid` field allows you to specify how much was already paid for this invoice. `invoice_nr` is used to identify the invoice.

## Generating the Invoice

With this data model, we’re now ready to generate a PDF file. We start by creating a function, `createInvoice(invoice, path)`, which uses the `invoice` object to create a valid PDF invoice and then saves it to a file located at `path`.

Our invoice will consist of four visual parts:

1. A header that contains information about our company, including our company’s logo.
2. The address of the customer.
3. A table of all ordered items.
4. A generic footer to wrap up the invoice.

To create an empty PDF document, we use the `PDFDocument` constructor of `pdfkit`. We also create stub methods for the four sections above:

```es
const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}
```

The code above will create an empty PDF document and store it at `path`.

## Adding Static Data to the PDF

Now that we have an empty PDF page, it’s time to fill it with more information. Let’s start with the two static sections, `Header` and `InvoiceTable`.

The API of `pdfjs` requires us to chain all drawing commands on the `PDFDocument` instance. Images can be loaded using the `.image()` method:

```es
function generateHeader(doc) {
  doc
    .image("logo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("ACME Inc.", 110, 57)
    .fontSize(10)
    .text("123 Main Street", 200, 65, { align: "right" })
    .text("New York, NY, 10025", 200, 80, { align: "right" })
    .moveDown();
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
}
```

The `.image()` and `.text()` methods take `x` and `y` as the second and third argument, respectively. We use those coordinates to lay out the text however we want.

![Screenshot of a PDF invoice in the PSPDFKit for Web reader. The PDF contains only a header and a footer.](/images/blog/2019/generate-invoices-pdfkit-node/screenshot-static.png)

If we run our Node.js script, it will generate the above PDF. But now we need to add dynamic data to it!

## Adding Dynamic Data to the PDF

To add the dynamics bits to our PDF, we rely on the data model outlined earlier. Let’s start with the customer information section. Here we want to print the address of our customer. We can do this by concatenating the dynamic values to the PDF rendering commands:

```es
function generateCustomerInformation(doc, invoice) {
  const shipping = invoice.shipping;

  doc
    .text(`Invoice Number: ${invoice.invoice_nr}`, 50, 200)
    .text(`Invoice Date: ${new Date()}`, 50, 215)
    .text(`Balance Due: ${invoice.subtotal - invoice.paid}`, 50, 130)

    .text(shipping.name, 300, 200)
    .text(shipping.address, 300, 215)
    .text(`${shipping.city}, ${shipping.state}, ${shipping.country}`, 300, 130)
    .moveDown();
}
```

The above code block uses a simplified layout. For a complete example, check out the [example code on GitHub][invoice example].

For the table, we’ll be using a helper function that draws one row of the column. We can later loop over all the items in our invoice model and create table rows for them. To make sure the helper renders everything in one row, we are setting the `y` coordinate as an argument to the function. Every row will have five columns, `c1` to `c5`:

```es
function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
  doc
    .fontSize(10)
    .text(c1, 50, y)
    .text(c2, 150, y)
    .text(c3, 280, y, { width: 90, align: "right" })
    .text(c4, 370, y, { width: 90, align: "right" })
    .text(c5, 0, y, { align: "right" });
}
```

We can use this helper function to render one row for every line item:

```es
function generateInvoiceTable(doc, invoice) {
  let i,
    invoiceTableTop = 330;

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      item.amount / item.quantity,
      item.quantity,
      item.amount
    );
  }
}
```

To keep the code examples in this post concise, I’ve stripped out table headers and footers, along with some utility functions for formatting currency and dates. You can take a look at the complete [example code on GitHub][invoice example].

In any case, once we add the table headers and footers, we’ll have a full invoice generated on demand using `pdfkit` on Node.js.

![Screenshot of a PDF invoice in the PSPDFKit for Web reader.](/images/blog/2019/generate-invoices-pdfkit-node/screenshot.png)

## Conclusion

[PDFKit][] allows us to generate PDF documents in Node.js and the browser. It is ideally suited for tasks like dynamically generating invoices for your web server.

In the example above, we learned about PDFKit and used it to dynamically generate an invoice from a simple object-based data model. You can check out the [source code on GitHub][invoice example].

If you want to display the PDF in a powerful PDF viewer in your browser, we recommend you give [PSPDFKit for Web][] a try.

[pdfkit]: http://pdfkit.org/
[invoice example]: https://github.com/PSPDFKit-labs/pdfkit-invoice
[pspdfkit for web]: https://pspdfkit.com/pdf-sdk/web/
