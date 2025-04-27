---
title: "How to Generate PDFs with Elixir"
description: "In this blog post, we'll look at an example of how to generate PDFs with Elixir."
preview_image: /images/blog/2018/how-to-generate-pdfs-with-elixir/article-header.png
section: blog
author:
  - Maximilian Störchle
author_url:
  - https://twitter.com/max_hoyd
date: 2018-12-03 8:00 UTC
tags: Development, Elixir, PDF
published: true
secret: false
---

Software developers often find themselves in a position where they have to dynamically generate a PDF file out of data. This is often the case when producing bills or reports. Since Elixir is a functional programming language and provides lots of functions for working with data, this blog post will be a short introduction on how to generate PDFs with [Elixir][].

There are a few libraries for [Elixir][] that can generate PDFs. [Gutenex][] is an interesting example. Like many [Elixir][] libraries, it started as a wrapper for an [Erlang][] PDF generation library called [erlguten][], but later it was rewritten in [Elixir][]. The problem with this library is that there is no active development happening, and it hasn’t received updates in more than two years.

Another library for generating PDFs with [Elixir][] — and the one we’ll use in this post — is [elixir-pdf-generator][]. This library uses [wkhtmltopdf][], which is an open source command line tool for rendering HTML pages into PDF. In order to generate a PDF with [elixir-pdf-generator][], you first generate an HTML page, which then gets rendered to a PDF with [wkhtmltopdf][].

# Example

Let’s take a look at an example where we want to generate a shopping list as a PDF file with [Elixir][] using the [elixir-pdf-generator][] library. The function to generate the PDF should receive a list of items and render a PDF with the shopping list.

## Creating the Project

To create our example project and navigate into the project’s directory, we run the following commands:

```bash
mix new pdf_example
cd pdf_example
```

## Adding Dependencies to the Project

Because [elixir-pdf-generator][] uses [wkhtmltopdf][], we have to install [wkhtmltopdf][]. This can be done by running the following command in macOS:

```bash
brew install Caskroom/cask/wkhtmltopdf
```

To install it on other platforms, take a look at the [wkhtmltopdf][] website, where you can find installation instructions for all supported platforms.

We could write the HTML that we pass to the [elixir-pdf-generator][] library as a single string that contains the HTML text, but a more flexible approach is to generate the HTML from [Elixir][] data structures, because [Elixir][] provides a lot of functions to work with and manipulate these data structures. So instead, we will be using the [Sneeze][] library.

In order to add the libraries to our example application, we have to edit the `mix.exs` file in the root directory and include the libraries in the dependencies list:

```elixir
defmodule PdfExample.MixProject do
  use Mix.Project

  def project do
    [
      app: :pdf_example,
      version: "0.1.0",
      elixir: "~> 1.6",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:pdf_generator, ">=0.4.0"},
      {:sneeze, "~> 1.1"}
    ]
  end
end
```

After the libraries are added to the dependencies list, they can be fetched by running `mix deps.get`.

## Implementation

To make the `PdfExample` module, we create the `pdf_example.ex` file in the `lib` directory:

```elixir
defmodule PdfExample do
  @blue "#267ad3"
  @foreground "#3c3c3c"

  def generate_pdf(items) do
    html =
      Sneeze.render([
        :html,
        [
          :body,
          %{
            style:
              style(%{
                "font-family" => "Helvetica",
                "font-size" => "20pt",
                "color" => @foreground
              })
          },
          render_header(),
          render_list(items)
        ]
      ])

    {:ok, filename} = PdfGenerator.generate(html, page_size: "A4", shell_params: ["--dpi", "300"])

    File.rename(filename, "./shopping-list.pdf")
  end

  defp style(style_map) do
    style_map
    |> Enum.map(fn {key, value} ->
      "#{key}: #{value}"
    end)
    |> Enum.join(";")
  end

  defp render_header() do
    image_path =
      'example-image.png'
      |> Path.relative()
      |> Path.absname()

    date = DateTime.utc_now()
    date_string = "#{date.year}/#{date.month}/#{date.day}"

    [
      :div,
      %{
        style:
          style(%{
            "display" => "flex",
            "flex-direction" => "column",
            "align-items" => "flex-start",
            "margin-bottom" => "40pt"
          })
      },
      [
        :img,
        %{
          src: "file:///#{image_path}",
          style:
            style(%{
              "display" => "inline-block",
              "width" => "90pt;"
            })
        }
      ],
      [
        :div,
        %{
          style:
            style(%{
              "display" => "inline-block",
              "position" => "absolute",
              "padding-left" => "20pt",
              "margin-top" => "10pt"
            })
        },
        [
          :h1,
          %{
            style:
              style(%{
                "font-size" => "35pt",
                "color" => @blue,
                "margin-top" => "0pt",
                "padding-top" => "0pt"
              })
          },
          "Shopping List"
        ],
        [
          :h3,
          %{
            style:
              style(%{
                "font-size" => "20pt",
                "margin-top" => "-20pt"
              })
          },
          date_string
        ]
      ]
    ]
  end

  defp render_list(items) do
    list = [:ul, %{style: style(%{"list-style" => "none"})}]
    list_items = Enum.map(items, &render_item/1)
    list ++ list_items
  end

  defp render_item(item) do
    [
      :li,
      [
        :span,
        %{
          style:
            style(%{
              "display" => "inline-block",
              "border" => "solid 2pt ",
              "width" => "10pt",
              "height" => "10pt",
              "border-radius" => "2pt",
              "margin-right" => "15pt"
            })
        }
      ],
      item,
      [:hr]
    ]
  end
end
```

Most of the code is about styling, so we created a helper function, `style/1`, which receives a map and returns the style attribute as a string. This makes it easier for us to create styles, because we can use maps and we don’t have to write long strings. The `render_item/1` function renders a single item, and the `render_list/1` function maps over all items and calls the `render_item/1` function for each item.

The `render_header/0` function renders the header of the page and inserts the current date. To create a shopping list PDF out of a list of strings, we call the `generate_pdf/1` function with a list of strings representing the items on the shopping list. It creates the HTML with the `Sneeze.render/1` function, which is then passed to `PdfGenerator.generate/3` to generate the PDF. Because the output is very small, we use the `"--dpi 300"` parameter of the [wkhtmltopdf][] command line program to control the size of the output. After the PDF file is created, we rename it to `shopping-list.pdf`.

To execute `generate_pdf/1`, we start `iex` with `iex -S mix` and call it with a list:

```elixir
PdfExample.generate_pdf(["Bananas", "Apples", "Yogurt", "Beans", "Potatos"])
```

This will generate the `shopping-list.pdf` PDF file in our project’s root directory. It looks like this:

![Generated PDF](/images/blog/2018/how-to-generate-pdfs-with-elixir/shopping-list.png)

# Conclusion

The [elixir-pdf-generator][] library is an effective tool for generating PDFs from [Elixir][]. With [Sneeze][], we were able to produce a PDF from [Elixir][] data structures by first creating HTML and then converting the HTML page into a PDF with [elixir-pdf-generator][].

[erlang]: http://www.erlang.org/
[elixir]: https://elixir-lang.org/
[wkhtmltopdf]: https://wkhtmltopdf.org/index.html
[elixir-pdf-generator]: https://github.com/gutschilla/elixir-pdf-generator
[gutenex]: https://github.com/SenecaSystems/gutenex
[erlguten]: https://github.com/ztmr/erlguten
[sneeze]: https://github.com/ShaneKilkelly/sneeze
