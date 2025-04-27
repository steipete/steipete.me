---
title: "How to Parse XML Documents in Elixir"
description: "A tutorial on how to parse XML documents in Elixir."
preview_image: /images/blog/2018/how-to-parse-xml-documents-in-elixir/article-header.png
section: blog
author: 
 - Maximilian Störchle
author_url: 
 - https://twitter.com/max_hoyd
date: 2018-08-27 15:15 UTC
tags: Elixir, XML
published: true
secret: false
---

As software engineers, we often have to deal with different document formats. One example of such a document format is [XML][]. This blog post will be a short introduction on how to parse [XML][] documents with [Elixir][], and it includes an example of how it’s done.

## Example

First, we need to create the example. For this, run the following command to create a new [Elixir][] project called `xml_example`, and navigate into the project’s directory:

```bash
mix new xml_example
cd xml_example
```

We also need an example [XML][] file to parse. We create an [XML][] document in the root of our example directory with the following content and name it `example.xml`:

```xml
<todos>
  <todo id="1">
    <body>This is the body of to-do item #1</body>
    <priority>3</priority>
  </todo>
  <todo id="2">
    <body>This is the body of to-do item #2</body>
    <priority>1</priority>
  </todo>
  <todo id="3">
    <body>This is the body of to-do item #3</body>
    <priority>3</priority>
  </todo>
</todos>
```

This [XML][] document consists of a root node, `todos`, which should model a to-do list. Each `todo` item has the item `id` as an attribute and the priority of that to-do as a subnode.

After creating this example document, we can start [Elixir’s][elixir] [interactive shell][iex] so that we can play around with the example document:

```bash
iex -S mix
```

The first thing we have to do in order to parse the file is to open it:

```elixir
{:ok, xmldoc} = File.read(Path.expand("./example.xml"))
```

## xmerl

[Xmerl][xmerl] is a library for parsing [XML][] documents in [Erlang][], and since [Elixir][] is built on top of [Erlang][], we can use it for our example. But because [xmerl][] is an [Erlang][] library, we need to take care of a few things, such as parsing the input to a [charlist][]. To parse the [XML][] document with [xmerl][], run the following expression in the [interactive shell][iex]:

```elixir
{doc, []} = xmldoc |> :binary.bin_to_list() |> :xmerl_scan.string()
```

This will convert the content of the document we previously read to a [charlist][] with `:binary.bin_to_list\1` and then parse it with `:xmerl_scan.string\1`. This function will return a tuple, where the first element is the parsed content represented in [xmerl][] records ([Erlang records][] defined in `xmerl/include/xmerl.hrl`). The second element will be a [charlist][] of the rest of the input [charlist][] that could not be parsed. In our case, `:xmerl_scan.string\1` should be able to parse the entire input; that’s why we match an empty list to the second element in the returned tuple. This is how the return value of this function will appear:

```elixir
{{:xmlElement, :todos, :todos, [], {:xmlNamespace, [], []}, [], 1, [],
  [
    {:xmlText, [todos: 1], 1, [], '\n  ', :text},
    {:xmlElement, :todo, :todo, [], {:xmlNamespace, [], []}, [todos: 1], 2,
     [{:xmlAttribute, :id, [], [], [], [todo: 2, todos: 1], 1, [], '1', false}],
     [
       {:xmlText, [todo: 2, todos: 1], 1, [], '\n    ', :text},
       {:xmlElement, :body, :body, [], {:xmlNamespace, [], []},
        [todo: 2, todos: 1], 2, [],
        [
          {:xmlText, [body: 2, todo: 2, todos: 1], 1, [],
           'This is the body of todo item #1', :text}
        ], [], '/Users/max/Documents/pspdfkit/xml_example', :undeclared},
       {:xmlText, [todo: 2, todos: 1], 3, [], '\n    ', :text},
       {:xmlElement, :priority, :priority, [], {:xmlNamespace, [], []},
        [todo: 2, todos: 1], 4, [],
        [{:xmlText, [priority: 4, todo: 2, todos: 1], 1, [], '3', :text}], [],
        '/Users/max/Documents/pspdfkit/xml_example', :undeclared},
       {:xmlText, [todo: 2, todos: 1], 5, [], '\n  ', :text}
     ], [], '/Users/max/Documents/pspdfkit/xml_example', :undeclared},
     ...
```

### Manually Parse xmerl Records

Because the returned data structure consists of [Erlang records][], which are defined in `xmerl/include/xmerl.hrl`, we have to convert them to [Elixir records][] to be able to use them efficiently in [Elixir][]. For this, we’ll use the [`defrecord` macro][defrecord], which we have to put into a module. We call this module `XML`, and we also define a few helper functions for parsing the XML file:

```elixir
defmodule XML do
  import Record
  defrecord(:xmlElement, extract(:xmlElement, from_lib: "xmerl/include/xmerl.hrl"))
  defrecord(:xmlAttribute, extract(:xmlAttribute, from_lib: "xmerl/include/xmerl.hrl"))
  defrecord(:xmlText, extract(:xmlText, from_lib: "xmerl/include/xmerl.hrl"))

  def get_child_elements(element) do
    Enum.filter(XML.xmlElement(element, :content), fn child ->
      Record.is_record(child, :xmlElement)
    end)
  end

  def find_child(children, name) do
    Enum.find(children, fn child -> XML.xmlElement(child, :name) == name end)
  end

  def get_text(element) do
    Enum.find(XML.xmlElement(element, :content), fn child ->
      Record.is_record(child, :xmlText)
    end)
    |> XML.xmlText(:value)
  end
end

require XML
```

This enables us to get the data we want out of the [XML][] document. For example, we can get a list of all to-do bodies, like this:

```elixir
doc |> XML.get_child_elements() |> Enum.map(fn todo -> XML.get_child_elements(todo) |> XML.find_child(:body) |> XML.get_text() end)

# Returns:
['This is the body of to-do item #1',
 'This is the body of to-do item #2',
 'This is the body of to-do item #3']
```

Although it is possible to get the data we want out of the document using the above, this looks like a lot of code. There must be a more convenient way to query data out of [xmerl][]’s data structure.

### XPath

[XPath][] is a query language for selecting nodes in an XML document. [Xmerl][xmerl] supports querying an [XML][] document with [XPath][]. Using this query language, we can rewrite our code to query the text of all to-do bodies:

```elixir
:xmerl_xpath.string('/todos/todo/body/text()', doc) |> Enum.map(&XML.xmlText(&1, :value))
```

We can also get rid of all the helper functions we defined in our `XML` module, as we won’t need them. This is because we can query the XML document with [XPath][] instead of manually parsing the document.

Using [XPath][], we’re also able to choose nodes based on more complex queries, like selecting nodes based on attributes or on matching child nodes — for example, when we want to get the body text of all to-dos where the ID attribute is `1`:

```elixir
:xmerl_xpath.string('/todos/todo[@id=\"1\"]/body/text()', doc) |> Enum.map(&XML.xmlText(&1, :value))

# Returns
['This is the body of to-do item #1']
```

Another example of where we want to get the body text of all to-dos is where a child node “priority” with the value `3` exists:

```elixir
:xmerl_xpath.string('/todos/todo[priority=\"3\"]/body/text()', doc) |> Enum.map(&XML.xmlText(&1, :value))

# Returns
['This is the body of to-do item #1', 'This is the body of to-do item #3']
```

## SweetXML

Another option for parsing [XML][] documents with [Elixir][] is using the [SweetXML][] library, which is a small wrapper around [xmerl][] that reduces the boilerplate code we have to write for converting the input to a [charlist][] or converting the [xmerl][] records.

In order to use the [SweetXML][] library, we have to quit our [interactive shell][iex] session and add [SweetXML][] to the dependencies list in `mix.exs`. Then we run `mix deps.get` in the project’s root directory to download the dependencies:

```elixir
defp deps do
  [
    {:sweet_xml, "~> 0.6.5"}
  ]
end
```

After we have downloaded the dependencies, we can run `iex -S mix` to start another [interactive shell][iex] session.

Now we can run the same queries, like in our previous example, but with even less code:

```elixir
import SweetXml
{:ok, xmldoc} = File.read(Path.expand("./example.xml"))

# get body text of all to-dos where the ID attribute is `1` as a list:
xmldoc |> xpath(~x"/todos/todo[@id=\"1\"]/body/text()"l)

# Returns
['This is the body of todo item #1']

# get the body text of all to-dos where a child node "priority" with the value `3` exists as a list:
xmldoc |> xpath(~x"/todos/todo[priority=\"3\"]/body/text()"l)

# Returns
['This is the body of to-do item #1', 'This is the body of to-do item #3']
```

[SweetXML][] defines a custom `~x` [Sigil][], which also lets you define the return values in addition to the [XPath][] query. The syntax for the custom [Sigil][] looks like this, `~x"/some/xpath/query"l`, where the last character (`l` in our example) represents the return value. `l` stands for list, but you can also choose other return values like `i` for integer, `s` for strings, and more. Take a look at the [SweetXML documentation][] to see all available options.

## Conclusion

Although [xmerl][] can be used directly from [Elixir][], I would recommend [SweetXML][] for parsing [XML][] documents, because it’s easier to use. The custom [Sigil][] to define the return value is also a nice feature. All in all, it’s nice to have such a mature ecosystem provided by [Erlang][].

[elixir records]: https://hexdocs.pm/elixir/Record.html
[elixir]: https://elixir-lang.org/
[erlang records]: http://erlang.org/doc/reference_manual/records.html
[erlang]: http://www.erlang.org/
[defrecord]: https://hexdocs.pm/elixir/Record.html#defrecord/3
[sweetxml documentation]: https://github.com/kbrw/sweet_xml#the-x-sigil
[sweetxml]: https://github.com/kbrw/sweet_xml
[xml]: https://en.wikipedia.org/wiki/XML
[xpath]: https://en.wikipedia.org/wiki/XPath
[charlist]: https://elixir-lang.org/getting-started/binaries-strings-and-char-lists.html#charlists
[iex]: https://hexdocs.pm/iex/IEx.html
[sigil]: https://elixir-lang.org/getting-started/sigils.html
[xmerl]: http://erlang.org/doc/man/xmerl.html
