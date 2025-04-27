---
title: "Testing HTTP APIs in Elixir"
section: blog

author:
  - Alexei Sholik
author_url:
  - https://twitter.com/true_droid
date: 2016-06-01 14:34 UTC
tags: Instant, Elixir, Development, Testing
published: true
---

Here at PSPDFKit, we love testing. With the growing diversity of products on our roadmap, there's no shortage in the variety of testing approaches we employ in order to verify every component in any one of our products is working correctly.

One of our upcoming products [PSPDF Instant](https://pspdfkit.com/instant/) is a complete package for enabling real-time collaboration between users. Roughly speaking, it is comprised of two components, the backend that runs in the cloud and the iOS framework that integrates into the end-user application. We're using Elixir as the principal technology for our backend. In this post, I will show you how we approach testing HTTP APIs in Elixir using our open-source [Bypass](https://hex.pm/packages/bypass) library.

READMORE

## Overview

Before we begin, we need a test subject. Let's imagine that we have the following system, shown as a conceptual diagram in Figure 1.

![Figure 1. A conceptual diagram of the system we'll be testing](/images/blog/2016/testing-http-apis-in-elixir/figure_1.png)

*Figure 1. A conceptual diagram of the system we'll be testing*

Figure 1 is a simplified version of the actual authentication system we're using. A client can be a mobile device or a web browser that establishes a WebSocket connection to our _Instant server_. Within the server, each client is backed by an Elixir process (shown as a circle with the `WS` label on the diagram above). Each client has to authenticate itself once it is connected, which is carried out with the help of an external service that we'll call _Auth server_. The rationale behind this design is simple: Instant is a middleware product that an organization will want to integrate with its existing user accounts. Therefore, it should be possible for the organization to set up Instant in such a way that it will pass incoming authentication requests through this external Auth server.

The flow of data during the authentication process of a single client looks as shown in Figure 2 below.

![Figure 2. Visualization of the data flow between the client and the Auth server](/images/blog/2016/testing-http-apis-in-elixir/figure_2.png)

*Figure 2. Visualization of the data flow between the client and the Auth server*

The _Upstream component_ of the Instant server may itself consist of a pool of workers allowing for multiple clients to authenticate concurrently, but such details are not relevant for our purpose here. What is important is that eventually an HTTP request is sent from an `Upstream.Worker` process to the Auth server and the latter returns a response back. The protocol that is used for communicating with the Auth server is what we're going to test.

## Our Goals

We want to verify two things:

  1. The Upstream component issues correct requests to the Auth server.
  2. The Upstream component can handle all the possible responses from the Auth server.

If you take into account the possibility of connection drops, timeouts or even errors related to the internal state of the Auth server (e.g. HTTP status 500), the range of responses from the Auth server can be huge. We are not going to look at all of them though, as we are primarily interested in making sure that our part of the contract established between the two endpoints is correctly implemented.

## Choosing The Testing Approach

With the goals established, we need to decide on the approach that we're going to use for achieving them. As with anything, there's a number of ways to go about it:

  * Mock the HTTP client that Upstream is relying upon in order to not use the network stack at all and return prebaked server responses.

  * Create an intermediate layer between the Upstream component and the HTTP stack and then test only that layer. This approach assumes that the subsequent encoding to/decoding from HTTP does not have any bugs (or it could be tested separately).

  * Build a mock Auth server that will do nothing more but to check the correctness of incoming requests and simulate the responses that we're expecting the real Auth server to return.

The first approach is generally discouraged. It leads to brittle tests that tend to depend too much on the implementation details. José Valim has covered this topic very well in his post [Mocks and explicit contracts](http://blog.plataformatec.com.br/2015/10/mocks-and-explicit-contracts).

The second approach has its merits, however it also comes with an overhead of having to build an intermediate layer just for the purpose of testing it. This approach may be necessary sometimes, such as when there is a requirement to support other protocols than HTTP for communications with an external service. But for the specific case of testing an HTTP API, the approach is not that attractive since HTTP already works as an intermediate layer between the components.

We find the third approach to be the most effective because it requires minimum to no changes in the application code and is very flexible when using it as part of a testing framework such as ExUnit. By using Bypass, we can replace the external Auth server with a mock in every single test case, tweak a configuration parameter and voila – the Upstream component will now send requests to the mock server instead of looking for an external service.

The key point here is that we're testing the communications protocol between Instant and Auth. The implementation details of either of them will not affect our tests even if they change. For example, if we decide to use a different HTTP client library in Instant at some point in the future, there won't be any need to touch our auth tests. By working at the HTTP layer, our tests exercise exactly the same code paths that will be used in a production environment. Building tests like this makes them that much more valuable and gives us more confidence that the system as a whole will work as expected.

## Using Bypass

As is widely done, we're going to use ExUnit as our testing framework. The basic setup for Bypass is described in the [Readme](https://github.com/pspdfkit-labs/bypass#bypass). For an audio-visual introduction, I recommend watching our very own Martin Schürrer's [3-minute talk](https://www.youtube.com/watch?v=Kh6m4EQBb0k) about getting started with Bypass that he presented at the last ElixirConfEU.

The setup is really simple. Just add Bypass to the list of project dependencies under the `:test` environment and start it manually before running the tests. This ensures that Bypass' OTP application is only started during the testing phase and is not used at all in the other environments. Its code won't even be included in a release of the host application.

After adding the `:bypass` dependency, we modify `test/test_helper.exs` to look as follows

    ExUnit.start
    {:ok, _} = Application.ensure_all_started(:bypass)

From now on, any test case that wants to use a mock HTTP endpoint needs to call `Bypass.open` and use the port that it allocates when connecting.

Let's see an example of such a test case.

    @prebaked_auth_response %{client_id: "a", user_id: "b"}
    @prebaked_auth_response_json JSX.encode!(%{"data" => @prebaked_auth_response})

    test "authenticate/4 performs POST to /authenticate" do
      # Prepare the HTTP endpoint
      bypass = Bypass.open
      upstream = start_upstream(url: "http://localhost:#{bypass.port}")

      # Set up our expectation for this test case
      Bypass.expect bypass, fn conn ->
        assert "/authenticate" == conn.request_path
        assert "POST" == conn.method
        Plug.Conn.resp(conn, 200, @prebaked_auth_response_json)
      end

      # Verify that our Upstream component has sent the correct request and has
      # correctly processed the response
      assert {:ok, @prebaked_auth_response}
          == Upstream.authenticate(upstream, "", @user_agent, @client_info)
    end

    # A helper function for starting the Upstream component in a test case
    defp start_upstream(options) do
      upstream = Upstream.start_link(options)
      on_exit fn -> Upstream.stop(upstream) end
      upstream
    end

The first thing we do is set up our expectation for the HTTP request being exercised in this particular test case. The variable `conn` that is passed to the anonymous function is exactly the same kind of `conn` you get in a route handler in a Plug application. It contains all the information associated with the request and can be used to send a response back to the client.

Notice that we can freely use ExUnit's macros to verify things inside the request handler. If any of the assertions fail, we'll get a standard ExUnit failure message with a stacktrace pointing at the exact line where the failure happened.

Once the expectation has been set up, we use our Upstream component to send an authentication request and verify the return value.

Let's take a look at another test case.

    test "authenticate/4 handles failure and returns unauthorized" do
      bypass = Bypass.open
      upstream = start_upstream(url: "http://localhost:#{bypass.port}")

      Bypass.expect bypass, fn conn ->
        {:ok, body, conn} = Plug.Conn.read_body(conn)
        assert %{"authentication_payload" => "foo"} = JSX.decode!(body)
        Plug.Conn.resp(conn, 200, JSX.encode!(%{error: %{reason: "unauthorized"}}))
      end

      assert {:error, :unauthorized}
          == Upstream.authenticate(upstream, "foo", @user_agent, @client_info)
    end

Here we're verifying that passing an invalid authentication payload results in an `unauthorized` response being returned to the Upstream component which then turns it into the `{:error, :unauthorized}` tuple.

Some things to take note of:

  * As long as you open a new Bypass endpoint in each test case, it will be isolated from the rest of the tests. This will let you start ExUnit with `async: true` and enjoy running tests at ludicrous speeds. Further, there's no need to worry about shutting the endpoint down, as it is taken care of for you.

  * Bypass doesn't impose any restrictions on what you can do in your Bypass handlers, it is completely up to you. If you need to test a much larger HTTP API, you could issue HTTP requests to the real external service, store its responses, and use those afterwards in your Bypass handlers.

  * As I mentioned earlier, no changes were made to the application code. The Upstream component expects the endpoint URL to be passed to it as a configuration parameter and thanks to that fact, we can pass it a custom endpoint obtained from Bypass.

## Bypass.down and Bypass.up

Another aspect of working with HTTP APIs is that the network itself may be a source of additional error conditions. For a solid product, it is recommended to handle such cases. Bypass offers a way to close its listening socket temporarily and then bring it back up, on command. Such a simple mechanism allows for testing a graceful recovery from connectivity problems.

Let's look at an example.

    @upstream_conn_count 4

    test "workers become available when the server comes online after they started" do
      bypass = Bypass.open
      upstream = start_upstream(url: "http://localhost:#{bypass.port}")

      Bypass.down(bypass)

      # First check that no worker is available
      assert {:error, :noconnect} = Upstream.perform(upstream, :ping)

      Bypass.up(bypass)
      wait_for_queue_len(@upstream_conn_count)

      # Verify that a worker is now available
      assert :ok = Upstream.perform(upstream, :ping)
    end

Here, we're testing the ability of our Upstream component to handle network failure conditions. When the external server is not available, we get a `:noconnect` error from Upstream. As soon as it comes back up, we expect Upstream to get back to its normal state in which it maintains a pool of workers connected to the external server. The `wait_for_queue_len()` function implements a loop that sleeps for a while and checks if the length of the `Upstream.Worker` queue has reached a given value.

We could just as easily test a worker that blocked until the external server came back online. All we would need to do would be to schedule a call to `Bypass.up(bypass)` to happen in another process after some delay and verify that the call to `Upstream.perform` returns soon afterwards.

## Parting Words

I hope you've found the explanations and examples in this post useful. Some developer teams out there are already adopting Bypass. For example, check out this [blog post](https://www.inverse.com/article/10674-here-s-how-inverse-tests-external-apis-in-elixir-with-bypass) by Inverse on how they test their implementation of Facebook's Graph API.

Of course, we've only covered a few aspects of the larger topic of HTTP API testing. Here are just a few of the additional questions to consider:

  * What kinds of responses should I expect?

  * Do I need to account for errors caused by connectivity problems?

  * What if the external service takes too long to process a request?

  * What are the chances that the HTTP API being tested will change in the future? How will that affect my tests?

It is also useful to consider application-level failures such as using invalid credentials for authenticating with an external service, hitting a rate limit for API calls, and so on. I could go on for a while but I'm going to leave it at that for now.
