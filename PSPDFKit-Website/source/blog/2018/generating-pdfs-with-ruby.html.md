---
title: "Generating PDFs with Ruby: 2018 Edition"
description: "This post surveys the Ruby landscape in 2018 to evaluate the current state-of-the-art of generating PDFs with Ruby."
preview_image: /images/blog/2018/generating-pdfs-with-ruby/generating-pdfs-with-ruby-header.png
section: blog
author:
  - William Meleyal
author_url:
  - http://meleyal.com
date: 2018-12-18 8:00 UTC
tags: Web, Development, Ruby
published: true
secret: false
---

Generating PDFs with Ruby can be a tricky business. This post surveys the Ruby landscape in 2018 to evaluate the current state-of-the-art of generating PDFs with Ruby.

READMORE

## wkhtmltopdf

If you’ve done any [server-side PDF generation][generate pdfs with elixir], you’re probably familiar with [wkhtmltopdf][], a command-line tool that uses the Qt WebKit rendering engine to render HTML to PDF.

A “Hello, World!” example using wkhtmltopdf might look as follows:

```ruby
require 'tempfile'

Tempfile.create(['hello', '.html']) do |html_file|
  html_file.write '<h1 style="font: bold 10em Helvetica;">Hello World!</h1>'
  html_file.close
  pdf_file = Tempfile.new(['hello', '.pdf'])
  system('wkhtmltopdf', html_file.path, pdf_file.path)
  system('open', pdf_file.path)
end
```

The obvious win here is that there’s nothing new to learn, you can write your PDFs in HTML and CSS, and you can even reuse your existing views and partials (e.g. in Rails via `render_to_string`). In addition, gems such as [Wicked PDF][] and [PDFKit][] (no relation 🤭) provide a friendly Ruby wrapper around wkhtmltopdf to simplify usage and integration with Rails.

The downside of this approach is that PDF is not the DOM, so rendering issues do occur. These can be difficult to debug without resorting to good old trial and error.

There are [other issues with wkhtmltopdf][wkhtmltopdf-considered-harmful] you might want to consider. In my own experience, a major drawback was high memory usage, even when rendering relatively modest multi-page documents. This would very often result in timeouts if not using a background job.

## Prawn

[Prawn][] clearly states that it is not an HTML to PDF generator. Instead, it can be thought of as a builder-like DSL for creating and manipulating PDFs, similar to what [Jbuilder][] is to JSON.

Our “Hello, World!” example using Prawn couldn’t be much simpler:

```ruby
require 'prawn'

Prawn::Document.generate('hello.pdf') do
  text 'Hello World!'
end
```

Prawn gives you access to the nuts and bolts of PDF documents, from text rendering and drawing, to pages and navigation, with the ability to drop down to work directly with the PDF object tree if needed.

As you’d expect with this level of control, the API is rather large, making for a steeper learning curve. However, the documentation is excellent, with [examples covering many common use cases][prawn docs].

Prawn also proves to be [significantly faster and less memory-intensive][wkhtmltopdf vs prawn] than wkhtmltopdf.

## HexaPDF

[HexaPDF][] is a relative newcomer and it has a more procedural-style syntax that will be familiar to anyone who’s worked with 2D drawing APIs such as the HTML `canvas` element or Processing.

The “Hello, World!” example demonstrates this:

```ruby
require 'hexapdf'

doc = HexaPDF::Document.new
canvas = doc.pages.add.canvas
canvas.font('Helvetica', size: 100)
canvas.text('Hello World!', at: [20, 400])
doc.write('hello.pdf', optimize: true)
```

Reviewing the [API documentation][hexapdf docs], it’s clear that HexaPDF delves deep to handle some of the more arcane aspects of working with PDFs. Similar to wkhtmltopdf, it also ships with a CLI that’s handy for batch processing documents.

HexaPDF is open source (AGPL), but it requires a license for commercial use.

## Other Languages

If you’re willing to look further afield, there are many non-Ruby options, two of which we’ll highlight here.

For fans of microservices, a modern take on the wkhtmltopdf approach is [pdf-bot][], a Node library for generating PDFs from HTML using headless Chrome. Where we might have shelled out to a CLI, we can instead post to an API endpoint. pdf-bot manages a job queue and sends a webhook to notify us when our PDF is ready. [This post documents rolling your own similar solution][puppeteer] using Puppeteer to control headless Chrome.

If you have access to the JVM (e.g. via JRuby), another solid option for HTML to PDF rendering is [Flying Saucer][]. While it only supports CSS 2, with 10 years of development behind it, you can be fairly sure it handles all the edge cases. As a generic HTML/CSS renderer, it can also output other formats.

## Third-Party APIs

There is an increasing number of web services that will handle your PDF (and other document) creation and processing needs for a price. Two of the leading ones for PDFs that also have Ruby libraries are [DocRaptor][] and [BreezyPDF][]. These services take all the headache out of the process, but, as with all third-party services, you’ll need to consider data security and uptime requirements.

## Conclusion

So which option is best? The answer is, of course, that it depends!

If PDF in your app is just another format, such as a downloadable invoice or some printable data tables, and if you’re willing to compromise on pixel perfection, then HTML to PDF generation via wkhtmltopdf (or a more modern alternative) is hard to beat in terms of simplicity (OK, except maybe File > Print > Save as PDF 🤓).

If, on the other hand, you need more control, want to create more detailed and feature-rich documents, and generally use PDF to its [full potential][pdf breakout], then the steeper learning curve of Prawn or HexaPDF may be worth your time.

[generate pdfs with elixir]: https://pspdfkit.com/blog/2018/how-to-generate-pdfs-with-elixir
[wkhtmltopdf]: https://wkhtmltopdf.org/
[wicked pdf]: https://github.com/mileszs/wicked_pdf
[pdfkit]: https://github.com/pdfkit/pdfkit
[wkhtmltopdf-considered-harmful]: https://blog.rebased.pl/2018/07/12/wkhtmltopdf-considered-harmful.html
[prawn]: https://github.com/prawnpdf/prawn
[jbuilder]: https://github.com/rails/jbuilder
[prawn docs]: http://prawnpdf.org/manual.pdf
[wkhtmltopdf vs prawn]: http://nts.strzibny.name/comparing-wkhtmltopdf-to-prawn-for-generating-pdf-in-terms-of-speed-memory-and-usability/
[hexapdf]: https://hexapdf.gettalong.org/
[hexapdf docs]: https://hexapdf.gettalong.org/api/HexaPDF/index.html
[pdf-bot]: https://github.com/esbenp/pdf-bot
[puppeteer]: https://www.forsbergplustwo.com/blogs/news/pdf-generation-with-chrome-headless-in-ruby-using-puppeteer-on-heroku
[flying saucer]: https://github.com/flyingsaucerproject/flyingsaucer
[docraptor]: https://docraptor.com/
[breezypdf]: https://breezypdf.com/
[pdf breakout]: https://rawgit.com/osnr/horrifying-pdf-experiments/master/breakout.pdf
