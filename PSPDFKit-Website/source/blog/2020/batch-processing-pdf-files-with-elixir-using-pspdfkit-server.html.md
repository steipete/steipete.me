---
title: "Batch Processing PDF Files with Elixir Using PSPDFKit Server"
description: "See how Elixir and PSPDFKit Server are a perfect match for processing a large number of PDF files."
preview_image: /images/blog/2020/batch-processing-pdf-files-with-elixir-using-pspdfkit-server/article-header.png
section: blog
author:
  - Arek Gil
author_url:
  - https://twitter.com/\_arkgil
date: 2020-01-31 8:00 UTC
tags: Development, How-To, Elixir, Server
published: true
secret: true
---

Processing PDF files is no easy task, and we provide a whole range of products to help you deal with doing this on a variety of platforms. However, this work quickly becomes tedious when you have hundreds of files to process and you’re potentially modifying them in the same, repetitive way. In this post, we’ll look at how we can leverage Elixir to build a PDF batch processing pipeline with the help of [PSPDFKit Server][].

## The Tech Stack

You might be wondering: Why use Elixir for this task? The BEAM virtual machine that Elixir runs on isn’t the best in class when it comes to processing large amounts of data, as, by default, it copies every object stored in memory on modification. But it has another property that makes it appealing as a base for our solution: fantastic concurrency primitives. With Elixir, we can easily process multiple files at the same time, and we can even place bounds on the work in progress in order to not use too many resources.

However, we still can’t use it to modify PDFs themselves.

This is where PSPDFKit Server comes into play. PSPDFKit Server is shipped as a Docker container that you can install essentially anywhere. It exposes a range of HTTP APIs for uploading, processing, and reading back PDF documents. With concurrency control provided by Elixir and PDF-processing power offered by PSPDFKit Server, we are well equipped to take on this task!

## The Solution

Even with all the great tools we have, building a batch processing pipeline sounds like a daunting task! So in order to make things easier to comprehend, we’ll divide the problem into subproblems and deal with them one at a time:

- Uploading a PDF document
- Applying a watermark to the document
- Downloading the resulting PDF file
- Adding concurrency control

> **ℹ️ Note:** If you want to follow along, you need to have PSPDFKit Server up and running — just follow the steps on [this page][server setup] to sign up for the trial license and install it.

Let’s get started!

### Uploading a Document

In order to upload a document, we can use PSPDFKit Server’s document upload API. We just need to add a PDF file to the `/api/documents` endpoint using an HTTP `POST` request:

```elixir
defmodule Watermark do
  def upload_document(path, server_url, token) do
    url = server_url <> "/api/documents"

    headers = [
      {"Content-Type", "application/pdf"},
      {"Authorization", "Token token=\"#{token}\""}
    ]

    case :hackney.post(url, headers, {:file, path}, with_body: true) do
      {:ok, 200, _, response} ->
        %{"data" => %{"document_id" => document_id}} = Jason.decode!(response)
        {:ok, document_id}

      {:ok, status, _, body} ->
        {:error, {status, body}}

      {:error, _} = err ->
        err
    end
  end
end
```

The `upload_document/1` function takes a path to a PDF file and uploads it to a server. `server_url` is the base URL of the server, and `token` is the `API_AUTH_TOKEN` configuration option you have set for the server instance.

We use [`:hackney`][] library to send requests to the server. By passing a `{:file, path}` tuple as a request body, we’re telling it to stream the file at the path to the server. If we receive a successful response, we decode the body using [`Jason`][], and we return the document ID — it will come in handy later on when we perform other operations on the document.

Now if you open the `iex` console and pass the correct parameters to the function, you should see the following result:

```elixir
iex> {:ok, document_id} = Watermark.upload_document("./document.pdf", "http://...", "...")
{:ok, "7KPT1S5GPBPPYTBPPZXEH7X3BM"}
```

You can check that the document was indeed uploaded by opening the PSPDFKit Server dashboard and clicking on the document with the ID — you should see the contents of the file you just uploaded!

### Applying a Watermark

A watermark is a semi-transparent piece of text or a shape which is part of a document’s background. With PSPDFKit Server, we can represent a watermark as a PDF annotation.

We can apply annotations to documents in two ways — either by using [annotation APIs][], or by using [document operations][]. While both solutions allow us to achieve our goal, document operations are more appropriate for a batch processing scenario. This is because they allow you to describe how the document is going to be transformed in a declarative way — once submitted to the server, the operations are executed one-by-one and the result is persisted. This means that you can process documents in a variety of ways by using only a single HTTP request.

There are many [kinds of operations][], but for the task at hand, we only need one of them: the `applyInstantJson` operation. Instant JSON is a file format representing a set of changes that will be applied to a PDF file. In our case, the only change we need is that of adding an annotation. More specifically, we’re going to add a predefined “Draft” [stamp annotation][] to act as a watermark:

```json
{
  "format": "https://pspdfkit.com/instant-json/v1",
  "annotations": [
    {
      "v": 1,
      "type": "pspdfkit/stamp",
      "bbox": [150, 150, 300, 100],
      "stampType": "Draft",
      "createdAt": "2020-01-31T08:45:51.006252",
      "opacity": 0.15,
      "pageIndex": 0,
      "rotation": 0,
      "updatedAt": "2020-01-31T08:45:51.006252"
    }
  ]
}
```

Let’s now extend the `Watermark` module by adding the ability to apply the watermark:

```elixir
def apply_watermark(document_id, server_url, token) do
  url = server_url <> "/api/documents/#{document_id}/apply_operations"

  headers = [
    {"Authorization", "Token token=\"#{token}\""}
  ]

  operations_part =
    {"operations",
     %{
       operations: [
         %{
           type: "applyInstantJson",
           dataFilePath: "fb0df4d4-55d9-4ee9-9b27-4ad662cc1d93"
         }
       ]
     }
     |> Jason.encode!(), [{"Content-Type", "application/json"}]}

  instant_json_part =
    {:file, "./instant.json", "fb0df4d4-55d9-4ee9-9b27-4ad662cc1d93",
     [{"Content-Type", "application/json"}]}

  body =
    {:multipart,
     [
       operations_part,
       instant_json_part
     ]}

  case :hackney.post(url, headers, body, with_body: true) do
    {:ok, 200, _, _} ->
      :ok

    {:ok, status, _, body} ->
      {:error, {status, body}}

    {:error, _} = err ->
      err
  end
end
```

In order to use the `applyInstantJson` operation, we need to send a multipart HTTP request. The first part, `operations_part`, defines the document operations that we want to apply to the document. The `instant_json_part` is a file attachment with the Instant JSON content from above (here we assume that it’s stored in the `instant.json` file in the current directory). Note that the `dataFilePath` property of the operation has the same value as the name of the file attachment, which in this case is a random UUID.

You can invoke this new function in the `iex` console, passing the ID of the uploaded document:

```elixir
iex> Watermark.apply_watermark(document_id, "http://...", "...")
:ok
```

Now when you go to the Server dashboard and open the document again, you should see that the watermark has been added to the file!

### Downloading the File

We leveraged document operations to modify the existing document, so now it’s time for the final piece of the pipeline: downloading the file.

However, a regular file download is not enough here. You probably noticed in the dashboard that you could grab the stamp annotation, move it around, or even delete it completely. What’s the use of a watermark that can be removed from a document?

To circumvent this, we need to embed the watermark in the PDF file’s content. This process is known as flattening. Luckily, PSPDFKit Server provides a convenient API for downloading a document while flattening it at the same time:

```elixir
def download_pdf(path, document_id, server_url, token) do
  url = server_url <> "/api/documents/#{document_id}/pdf?flatten=true"

  headers = [
    {"Authorization", "Token token=\"#{token}\""}
  ]

  case :hackney.get(url, headers) do
    {:ok, 200, _, conn} ->
      file = File.open!(path, [:write])
      :ok = write_body_to_file(conn, file)

    {:ok, status, _, _} ->
      {:error, status}

    {:error, _} = err ->
      err
  end
end

defp write_body_to_file(conn, file) do
  with {:ok, part} <- :hackney.stream_body(conn),
       :ok <- IO.binwrite(file, part) do
    write_body_to_file(conn, file)
  else
    :done ->
      File.close(file)
      :ok

    {:error, _} = err ->
      err
  end
end
```

`download_pdf` takes a path to the output file and makes a request to get the document’s PDF. Then it saves the PDF’s content to the file in a streaming fashion, which usually prevents the memory from ballooning if the file is big (otherwise downloading a 1&nbsp;GB file would load all that data into memory before saving it to the disk).

Now you can call this function in `iex`:

```
iex> Watermark.download_pdf("./watermarked.pdf", document_id, "http://...", "...")
:ok
```

And when you open the `watermarked.pdf` file, you should be able to see the final result: the original document with a watermark embedded in the background.

### Piecing It Together and Adding Concurrency Control

Now that we have all the building blocks for the pipeline, we can create a single function that takes care of the first three steps sequentially.

But what about concurrency?

We mentioned that Elixir is a perfect fit for the task, but we haven’t used any of its capabilities directly yet.

Let’s start with the sequential processing of a directory of PDF files:

```elixir
  def run(in_dir, out_dir, server_url, token) do
    in_dir
    |> File.ls!()
    |> Enum.map(fn filename ->
      in_file = Path.join(in_dir, filename)
      out_file = Path.join(out_dir, filename)
      {in_file, out_file}
    end)
    |> Enum.each(fn {in_file, out_file} ->
      process_document(in_file, out_file, server_url, token)
    end)
  end

  defp process_document(in_file, out_file, server_url, token) do
    with {:ok, document_id} <- upload_document(in_file, server_url, token),
         :ok <- apply_watermark(document_id, server_url, token) do
      download_pdf(out_file, document_id, server_url, token)
    end
  end
```

This allows us to annotate files in a directory using watermarks and save the results in a target directory, but it does so one PDF file after another.

On my machine, processing a directory of 100 PDF files takes around 16.5&nbsp;seconds. To measure it yourself, you can run the following snippet in `iex`:

```
iex> {microseconds, _} = :timer.tc(Watermark, :run, ["./in-dir", "./out-dir", "https://...", "..."])
iex> IO.puts("Sequential processing took: #{microseconds / 1_000_000}")
```

The result is not bad, but we can do much better. Fortunately, moving from sequential to parallel execution is a matter of changing two lines of code:

```diff
  def run_concurrent(in_dir, out_dir, server_url, token) do
    in_dir
    |> File.ls!()
    |> Enum.map(fn filename ->
      in_file = Path.join(in_dir, filename)
      out_file = Path.join(out_dir, filename)
      {in_file, out_file}
    end)
-   |> Enum.each(fn {in_file, out_file} ->
+   |> Task.async_stream(fn {in_file, out_file} ->
      process_document(in_file, out_file, server_url, token)
    end)
+   |> Stream.run()
  end

```

```
iex> {microseconds, _} = :timer.tc(Watermark, :run_concurrent, ["./in-dir", "./out-dir", "https://...", "..."])
iex> IO.puts("Concurrent processing took: #{microseconds / 1_000_000}")
```

In testing the same set of files, processing the entire batch of PDF files now took around 3&nbsp;seconds. That’s a huge improvement! [`Task.async_stream/3`][] takes care of spreading the work between all the available CPU cores so that none of them stay idle. It also puts an upper bound on the number of tasks running at any given time (see the `max_concurrency` option). That way, processing the documents takes much less time overall.

## Conclusion

Elixir comes with powerful utilities for parallelizing work in a simple way. And in this post, we’ve seen how a small modification decreased the time it took to process PDF files.

Where the language wasn’t sufficient enough to solve certain parts of the problem, we used PSPDFKit Server. It’s built with Elixir and our Core C++ SDK, and it provides a rich set of APIs for annotating, editing, signing, and commenting on PDF files.

Make sure to take a look at [our guides][] to see all of its capabilities!

[pspdfkit server]: https://pspdfkit.com/guides/server/current/pspdfkit-server/overview/
[http apis]: https://pspdfkit.com/guides/server/current/server-api/overview/
[`:hackney`]: https://hexdocs.pm/hackney/hackney.html
[`jason`]: https://hexdocs.pm/jason/Jason.html
[`task.async_stream/3`]: https://hexdocs.pm/elixir/Task.html#async_stream/3
[server setup]: ../../guides/web/current/server-backed/setting-up-pspdfkit-server/
[annotation apis]: ../../guides/server/current/server-api/annotations/
[document operations]: ../../guides/server/current/server-api/documents/#editing-a-document-s-pdf-and-persisting-the-resulting-file
[kinds of operations]: ../../guides/server/current/server-api/json-format/#document-operations
[stamp annotation]: ../../guides/server/current/server-api/json-format/#pspdfkit-stamp
[our guides]: ../../guides/server/current/pspdfkit-server/overview
