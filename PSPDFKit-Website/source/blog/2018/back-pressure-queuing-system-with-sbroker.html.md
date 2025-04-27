---
title: "How to Build a Back-Pressure Queuing System in Elixir with sbroker"
description: "Tutorial on how to set up a back-pressure queuing system in Elixir with sbroker."
preview_image: /images/blog/2018/back-pressure-queuing-system-with-sbroker/article-header.png
section: blog
author:
 - Maximilian Störchle
author_url:
 - https://twitter.com/max_hoyd
date: 2018-07-23 12:00 UTC
tags: Instant, Elixir, Development
published: true
---

At PSPDFKit, we build reliable and performant distributed systems with [Elixir][]. In such systems, we often have to call external services, and asynchronous messaging allows clients to make these calls and not have to wait for the response. Messages that can’t be handled right away will be queued up and handled later, but what happens when the queue gets overloaded? Since we don’t want our system to crash, we have to use a back-pressure mechanism, which prevents the queue from growing indefinitely. This blog post explains how you can apply a back-pressure mechanism to your Elixir application with the [sbroker][] library.

# Using the sbroker Erlang Library in an Elixir Application

The sbroker [Erlang] library provides building blocks for creating a pool and/or a load regulator. It uses the [broker pattern][], where the communication to the service worker is handled by a broker that is responsible for the coordination between workers and the calls to them.

# A Simple Example

Let’s look at a simple example of how to use the sbroker library in an Elixir application.

First we run the following command in the command line:

``` bash
mix new example
```

This will create an example project with the name “example” in the current directory. In the example, we will mock a call to external service in a worker and handle the communication by a broker. To do this, we edit the `example/mix.exs` file in order to add the sbroker library to our application:

``` elixir
defmodule Example.Mixfile do
  use Mix.Project

  def project do
    [
      app: :example,
      version: "0.1.0",
      elixir: "~> 1.5",
      start_permanent: Mix.env == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      applications: [:sbroker],
      extra_applications: [:logger],
      mod: {Example, []}
    ]
  end

  defp deps do
    [{:sbroker, "~> 1.0-beta"}]
  end
end
```

We added the sbroker library to our dependencies and applications above. We also referenced our application module on line 19 with `mod: {Example, []}`, which we will create later. Now we are ready to add a broker, so we create our broker module in `example/lib/example/broker.ex`:

``` elixir
defmodule Example.Broker do
  @behaviour :sbroker

  def start_link() do
    start_link(timeout: 10000)
  end

  def start_link(opts) do
    :sbroker.start_link({:local, __MODULE__}, __MODULE__, opts, [])
  end

  def init(opts) do
    # See `DBConnection.Sojourn.Broker`.

    # Make the "left" side of the broker a FIFO queue that drops the request after the timeout is reached.
    client_queue =
      {:sbroker_timeout_queue,
       %{
         out: :out,
         timeout: opts[:timeout],
         drop: :drop,
         min: 0,
         max: 128
       }}

    # Make the "right" side of the broker a FIFO queue that has no timeout.
    worker_queue =
      {:sbroker_drop_queue,
       %{
         out: :out_r,
         drop: :drop,
         timeout: :infinity
       }}

    {:ok, {client_queue, worker_queue, []}}
  end
end
```

The module above implements the sbroker behavior. We start the broker in line 9 and set the timeout in the options to 10 seconds. This means that calls get dropped when they stay in the queue for more than 10 seconds while waiting for a worker. In the `init\1` function, we define the client and the worker queue for the broker. After we define the broker module, we need to define the worker module — which is responsible for defining a worker — and ask the broker for jobs. We define the worker module in `example/lib/example/worker.ex`:

``` elixir
defmodule Example.Worker do
  use GenServer

  alias Example.{Broker}

  def start_link() do
    GenServer.start_link(__MODULE__, [])
  end

  #
  # GenServer callbacks
  #

  def init([]) do
    state =
      ask(%{
        tag: make_ref()
      })

    {:ok, state}
  end

  def handle_info({tag, {:go, ref, {pid, {:fetch, [params]}}, _, _}}, %{tag: tag} = s) do
    send(pid, {ref, fetch_from_external_resource(params)})
    {:noreply, ask(s)}
  end

  # When sbroker has found a match, it'll send us `{tag, {:go, ref, req, _, _}}`.
  defp ask(%{tag: tag} = s) do
    {:await, ^tag, _} = :sbroker.async_ask_r(Broker, self(), {self(), tag})
    s
  end

  defp fetch_from_external_resource(params) do
    # Pretend to do work
    Process.sleep(1000)
    {:ok, "External service called with #{inspect(params)}"}
  end
end
```

The `fetchfrom_external_resource/1` function is a simple mocking function that will make the process wait for one second and then return `{:ok, "External service called with #{inspect(params)}"}`. This function will be called when the worker GenServer receives the `{tag, {:go, ref, {pid, {:fetch, [params]}},_, _}}` message. The tag variable in this tuple is a unique identifier that is needed to identify the worker and is saved in the GenServer’s state.

After the worker has fetched the data, it asks for a new job from the broker. Because we have defined the broker and the worker module, we can now define a supervisor, which should start the broker and a pool of workers. The supervisor is defined in `example/lib/example/supervisor.ex`:

``` elixir
defmodule Example.Supervisor do
  use Supervisor

  alias Example.{Broker, Worker}

  def start_link() do
    Supervisor.start_link(__MODULE__, [])
  end

  def init(_args) do
    pool_size = 5
    broker = worker(Broker, [], id: :broker)

    workers =
      for id <- 1..pool_size do
        worker(Worker, [], id: id)
      end

    worker_sup_opts = [strategy: :one_for_one, max_restarts: pool_size]
    worker_sup = supervisor(Supervisor, [workers, worker_sup_opts], id: :workers)

    supervise([broker, worker_sup], strategy: :one_for_one)
  end
end
```

In this example, our worker pool consists of five workers. We are almost done with it, but we still need to create the application module in `example/lib/example.ex`:

``` elixir
defmodule Example do
  use Application
  alias Example.{Broker}

  def start(_type, _args) do
    Example.Supervisor.start_link()
  end

  def fetch_from_external_resource(params) do
    perform({:fetch, [params]})
    |> inspect()
    |> IO.puts()
  end

  defp perform({action, args} = params) do
    case :sbroker.ask(Broker, {self(), params}) do
      {:go, ref, worker, _, _queue_time} ->
        monitor = Process.monitor(worker)

        receive do
          {^ref, result} ->
            Process.demonitor(monitor, [:flush])
            result

          {:DOWN, ^monitor, _, _, reason} ->
            exit({reason, {__MODULE__, action, args}})
        end

      {:drop, _time} ->
        {:error, :overload}
    end
  end
end
```

This module starts the supervisor and has a function, `fetch_from_external_resource\1`, which will ask the broker for a worker and sends the `{:fetch, [params]}` message to the worker when the broker can assign a worker to our call. When the broker cannot assign a worker, the response will be `{:drop, time}`, and our private `perform\1` function will return `{:error, :overload}`. The `fetch_from_external_resource\1` function will also print either the response from the worker or `{:error, :overload}` if the broker dropped the request.

We can now test this example in `iex` by running this:

``` bash
iex -S mix run
```

Then we can fetch data from the external resource by running the following:

``` elixir
Example.fetch_from_external_resource("test")
```

This will print the following output to `iex` after one second:

```
{:ok, "External service called with \"test\""}
:ok
```


To simulate and test more calls, we can call `Example.fetch_from_external_resource("test")` multiple times in parallel by running this:

``` elixir
Enum.each(1..500, fn _ ->
    Task.start(fn ->
      Example.fetch_from_external_resource("test")
    end)
end)
```

This will print the same line and increase the count by five lines at a time, because our example worker pool consists of five workers. We will also get `{:error, :overload}` responses because the broker could not assign a worker and the task was waiting in the queue for too long. The `{:error, :overload}` responses are examples of back-pressure that has been applied to prevent an overload to the external service. Our system could now, for example, reply to the clients requesting the service with `HTTP/1.1 429 Too Many Requests`, and it would not crash because of overload.

# Conclusion

Using asynchronous processes with worker pools and queues is a great way to scale a system, but because we don’t want our system to crash, we should also think of ways to handle overload. One way is to apply a back-pressure mechanism to our application. In an Elixir application, this can be done easily using the sbroker library.

Are you interested in Elixir and other web technologies? Then make sure to check out our current [job offers](/careers/backend-engineer).

[sbroker]: https://github.com/fishcakez/sbroker
[broker pattern]: https://en.wikipedia.org/wiki/Broker_pattern
[Erlang]: http://www.erlang.org/
[Elixir]: https://elixir-lang.org/
