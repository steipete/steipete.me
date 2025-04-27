---
title: "End–to–End Testing: What, Why, and How?"
section: blog

author: Daniel Demiss
date: 2016-06-08 10:00 UTC
tags: Instant, Development, Testing
published: true
---

Silently corrupting user data is commonly regarded as The Worst Thing You Can Do™ (TWTYCD).
Following my personal mantra, “schlimmer geht’s immer” (loosely translates to “there’s always room to do worse”), we can easily up the ante by throwing in sync.
So in this post I hope to shed some light on our use of end–to–end tests and the role they play to prevent data corruption in [PSPDF Instant](https://pspdfkit.com/instant/) — our upcoming framework [for collaborating on PDFs in realtime.](/blog/2016/real-time-collaboration/)
READMORE

![End To End](/images/blog/2016/e2e-testing/walkway.jpg)

While most users take it for granted, adding automatic sync to your application is the easiest way to increase the potential damage of data corruption.
Once a file has been corrupted the corruption will be synced to all the user’s devices so the severity is increasing by the number of devices per user.
Since we’re assessing risk here, we want to cover _at least_ 90–95% of our user base, so with our back of the envelope calculations, let’s assume 10 devices for now.
That’s one order of magnitude worse than TWTYCD™.

To guard against the straightforward non–concurrent cases, where such data corruption could happen, you write unit tests.
Most of the time these tests will probably be fine for the original TWTYCD™.
However, since these tests do not, by definition, exercise your app or framework as a whole there is a very good chance that there are subtle race conditions you did not consider, or deemed impossible to trigger that will come into play when you’re interacting with the host OS under load.

This is where integration tests come into play, as they allow you to cut through all the layers of your ~~cake~~ code.

If your product is an app or UI–heavy framework, many of these tests will take the form of [(hopefully automated) UI tests](/blog/2016/running-ui-tests-with-ludicrous-speed/).
UI test allow you to verify, for example, that your app does not hang or crash when a user accidentally pastes the entire text of “War and Peace,” where you expected a recipient’s bank account number.
To kick it up a notch, you’ll want to combine known valid interactions with somewhat vile behavior, like hitting the “Submit” button for a EUR 20,000.00 wire transfer to a car dealer _twice_ in quick succession.
Apart from not crashing the app, you’ll want to verify that said transaction is attempted exactly once and depending on how you’re conducting these tests, such verification can be surprisingly difficult!

If your product does not have any UI but instead is more of a foundational framework, verification of the expected results gets **far** easier.
Writing the tests will likely be harder though, as preparing all the necessary state you need for your test scenario will require more work.
It probably does not help that the You–in–18-Months still needs to make sense of such preparation, when these preconditions change while your product evolves.
(Before you suggest to make a “stateless system”, remember that “state” is shorthand for [“the thing that makes your app useful”](https://twitter.com/alloy/status/736155410147774464).)

Even once you’ve found your way with writing integration tests and verifying their results, they are still kind of tricky.
They will merrily report to you that there _is_ a problem yet in contrast to your unit tests that are fine grained, the error reporting from these kinds of tests will be fairly coarse.
You could throw a bunch of logging at _that_ problem, but then you will suppress _some_ of the subtle races because **generating log messages takes time**.
You can also be lucky, and the additional logging unearths other races.
But that’s optimist thinking and I’m German 😁.

Bottom line:
Writing and maintaining integration tests can get rather messy, as can interpreting their results.
So you have to discount the cost of writing and maintaining them against the potential cost of data corruption, and can arrive at the conclusion that they aren’t worth it.

However, adding sync changes the equation.
The potential cost of data corruption is now tenfold, so you have to suck it up and start writing those tests to stress your full app or framework.
Once you’re done, you pat yourself on the back, with the feeling of having covered everything.

But wait a second.
At this moment, you’re no longer testing the system as a whole.
You’re merely testing the local component of it.
The entire system now consists of your app or framework **and** the server side of things **and** the other devices of your users, where your app or framework is running.

This is one of the key reasons why friends don’t let friends build their own sync solution.
By leveraging a proven component to handle the sync part of the equation, you can focus on making sure that none of your client code corrupts data.
So you should still be fine without writing tests that include running a server, and more than one client.
Writing, maintaining, and troubleshooting such end–to–end tests is a bit of a pain in the behind, so if you _can_ leverage an existing sync component, you owe it to yourself to do so!

> But Daniel, you said “schlimmer geht’s immer”!
> Can’t we add another order of magnitude to the severity of data-corruption events?

Sure thing!

So far, we’ve only considered a single user.
However, PSPDF Instant is a realtime collaboration tool, and collaboration is all about _several users_ working on the same data.
10 people is common to encounter here and even several dozen is a number you have to consider.

Because of the realtime collaboration aspect, pretty much none of the existing sync solutions were an option for us to use.
So we bit the bullet, implemented our own sync solution and wrote the necessary end–to–end tests to go along with it!

If you consider end–to–end tests, be aware that they require infrastructure.
And since such infrastructure is not very likely to directly benefit your actual, shipping product, you want to keep it to an absolute minimum.

The absolute bare minimum are these 3 things:
1. Something that makes your server code available, and starts your server in a well defined state.
2. Something that makes your client code available, and builds it.
3. Something that fires up as many clients as necessary, tells them and the server what to do, and gathers the results.

For the majority of the first two items, you can just repurpose the build scripts you already have for your continuous integration system.
We decided to spend a little more time on the third one to allow us to filter the gathered results (aka. log messages) by the part that generated it (i.e. server, client1, client2, …), and by _scenario_ (more on that later).

To keep compile times and thus friction low, we decided early on to develop sync as a separate library.
This decision gave us the opportunity to depend on _just_ Foundation, not UIKit, which means the library can be used on OS X as well and allows us to build a command line client that we can start as many times as we like.
(Note that this means we’re cheating a bit:
while we’re still testing the system as a whole, we’ve re–defined what the system _is_.
For our end–to–end tests, “the system as a whole” is sync and that brings the sync engine of PSPDF Instant back into the territory of “using a proven sync solution”.)

## The Test Client
This is a very small CLI tool that links against our sync library.
It drives an `NSRunLoop` on the main thread, establishes two connections to the _test driver_, and (eventually) runs a specific _scenario_ on a background queue.
The first connection is a websocket that we use to exchange control events with the test driver.
The second connection is a raw socket that allows us to siphon everything that goes to `STDOUT` and `STDERR` without having to build any major contraptions.
POSIX makes that quite easy, so the entire part is just this:

```objc
/// Use as selector for `[NSThread detachNewThreadSelector:toTarget:withObject:]`
- (void)redirectLoggingToAddress:(NSString *)address {
    NSArray<NSString *> *hostAndService = [address componentsSeparatedByString:@":"];
    const struct addrinfo hints = {
        .ai_family = AF_UNSPEC, // IPv4 or IPv6
        .ai_socktype = SOCK_STREAM, // TCP
        .ai_flags = AI_NUMERICSERV, // getaddrinfo's service arg has to be a port number, not a service name (e.g. http)
    };
    struct addrinfo *endpoint;
    const int status = getaddrinfo([hostAndService[0] UTF8String], [hostAndService[1] UTF8String], &hints , &endpoint);
    NSAssert(status == 0, @"Couldn’t resolve log endpoint: %s", gai_strerror(status));

    #define AssertSuccess(expression) NSAssert((expression) != -1, @"Failed to `" #expression "`: %s", strerror(errno))
    int originalOut;
    AssertSuccess(originalOut = dup(STDOUT_FILENO));

    int detour[2];
    AssertSuccess(pipe(detour));
    const int drain = detour[1]; // writing end of the pipe
    const int source = detour[0]; // reading end of the pipe
    AssertSuccess(dup2(drain, STDOUT_FILENO));
    AssertSuccess(dup2(drain, STDERR_FILENO));

    int loggerSocket;
    AssertSuccess(loggerSocket = socket(endpoint->ai_family, endpoint->ai_socktype, endpoint->ai_protocol));
    AssertSuccess((connect(loggerSocket, endpoint->ai_addr, endpoint->ai_addrlen));
    #undef AssertSuccess

    size_t availableBytes;
    char buffer[512];
    while ((availableBytes = (size_t)read(source, buffer, sizeof(buffer) / sizeof(buffer[0]))) > 0) {
        write(originalOut, buffer, availableBytes);
        write(loggerSocket, buffer, availableBytes);
    }
}
```

Our CLI tool takes a runner-ID and the URL for the websocket endpoint as parameters, and understands just 3 control commands:

- `hello` is sent just after the connection has been established, and is only sent once over the lifetime of the client.
This command tells us what socket to duplicate `STDOUT`/`STDERR` to, and what scenario to run under which configuration.
- When running a scenario, there are several occasions where all the clients have to wait for the others to catch up.
For this, we use the `barrier` command, which informs the client that all other clients have reached this point in the scenario as well.
In a typical scenario, each client will receive this command multiple times, as you’ll see later…
- The third command is only issued if something went wrong: `failed` makes the client call the `exit` function with a status code of `EXIT_SUCCESS`.
(This client clearly did nothing wrong, so that’s the only code that makes sense here.)

## The Scenarios
These are our test plans, and live in the client code.
They define how many clients should be started, define what these clients should do, and what they should expect to see at various times while they are running.
For us, the easiest way to accomplish that was writing a base class in our client app that provides some primitives for messaging and synchronization, as well as two macros for assertions, and failing unconditionally.
Thus, creating a new scenario for some feature or aspect is very low friction.
You create a new Objective–C++ file in the `Scenarios` directory in which you subclass `ETEScenario`, put in a special comment, override the `-run` method, and that’s it.

Here’s a trivial example of how such a scenario flows:

```objc
// @File ETESillyScenario.mm
#import "ETEScenario.h"

@interface ETESillyScenario : ETEScenario @end

// required clients: 42
// ^ that’s the special comment
@implementation ETESillyScenario

- (void)run {
    [super run];

    // The barriers are our synchronization primitives, and correspond to `barrier` messages mentioned above.
    auto const level1 = [ETEBarrier barrierWithID:1 name:@"What do you mean by “Your princess is in another castle”?"];
    auto const level42 = [ETEBarrier barrierWithID:2 name:@"Still no princess, but at least it has Mark King."];

    // `first` is the same as `self` for the client with runner ID 1, and `nil` otherwise.
    // `do:` unconditionally executes the block, and is used for scoping.
    // And because messaging `nil` is totally fine in Objective–C, no yaks were harmed for this to work.
    [self.first do:^{
        // Whenever something has happened that other clients need to wait for, we send a `barrier` command to the test driver
        [self passBarrier:level1];
    }];

    // For stuff that needs to happen on the main thread, `do:` has a sibling.
    [self.notFirst onMain:^{
		    NSLog(@"%@, speaking: Nothing to see here, move along…", self);
    }];
    // And because this is needed a lot, we have a convenience for “any other” runner as well.
    [self.notFirst passBarrier:level1];

    // For synchronization to occur, passing a barrier needs to be matched with waiting.
    // Therefore, this method blocks execution until we receive the appropriate `barrier` command.
    // Should we fail to receive this command in reasonable time, we send a `failure` command to the test driver.
    [self waitForBarrier:level1];

    // There are also macros for verifying conditions…
    [self.first do:^{
        ETEAssert(self.configuration.runnerID == 1, @"We’re only executing this code on the first runner, yet we found a different runner ID?!");
        // …or failing unconditionally:
        [self.notFirst do:{
            ETEFlunk(@"Found Schrödinger’s runner: it’s the first and not the first one at the same time!");
        }];
    }];

    // You’re probably not surprised we _don’t_ have a convenience for the 42nd runner.
    // We _could_ have added `-runner:do:` and `runner:onMain:`, or add a subscriptable `runner` property, or …
    // But we didn’t need such a thing often enough, and we can still do it as soon as there’s a real benefit.
    if (self.configuration.runnerID == 42) {
        [self passBarrier:level42];
    }
    // Here, our test would fail:
    // Only the runner with ID 42 will ever arrive at this barrier, so the others would time out waiting.
    [self waitForBarrier:level42];
}

@end
```

As you can see, what we are using is not a generic solution.
In fact, it is the exact opposite, but it fits _our_ needs, and solves _our_ problems.
So some aspects will not be applicable to _your_ situation.

## The Test Driver
While the client and the scenarios are pretty mundane (except maybe for additionally piping `STDERR` and `STDOUT` through a socket), the test driver is more complex:

- It has to act as a websocket server.
- It has to provide raw sockets to gather the log messages from the clients.
- It has to prepare the server to run scenarios, and gather its log messages as well.

Considering that our goal is to keep infrastructure minimal, this doesn’t sound like we’re close to that.

But…
It turns out that we already have what it needs to accept websocket connections, and provide HTTP endpoints: our sync server.
So the test driver is “just” a small extension of the server that provides a handful of endpoints for the client control websockets, status monitoring, and log retrieval.
In addition, there is one HTTP endpoint we can `POST` to in order to tell the server to prepare for a certain scenario, and expect a certain number of clients to connect.

We perform this `POST` request via a ruby script that:

- builds the client at a specific location,
- enumerates over all the Objective-C++ files in the `Scenarios` directory,
- looks for the `required clients:` comment,
- `POST`s the name of the scenario, and number of clients to the HTTP endpoint,
- then fires up the clients passing them their runner ID and the websocket endpoint they should connect to,
- waits until all the clients have exited, and
- eventually polls the status endpoint to see if the server is idle.

An end to end test is successful if all the scenarios have completed successfully, which means that all of the clients exited with state `EXIT_SUCCESS`, and the server entered the idle state.

## Putting it All Together
So right now we have a couple of components that need to be integrated:
- the build script for the server,
- the build script for the client,
- the ruby script that starts the scenarios, and evaluates whether or not they have completed successfully.

For my local development this is sufficient.
I have the server checked out somewhere, so I fire up the server and start working on the library (read: client) code, which is checked out somewhere else.
I run the unit tests for the library.
Before making a commit, I invoke the ruby script via `./script/e2etest run-all`, and refresh the browser tab that lists the results of my end–to–end test runs to verify they have all succeeded.

Running on CI, however, requires a little bit more help.
Server and library/client code live in two separate repositories and we want to run our end–to–end tests whenever we modify either one.
We’re currently using Jenkins as our CI tool, so we _could_ have made the Jenkins jobs clone both repositories.
We _could_ also have cooked up a way that makes pull requests specify when they need a another branch of their counterpart than `master`.

But that would have come at the cost of, for example, no longer having everything we need for a build under version control.
So we decided against that, and wrote another script instead.
Or rather two slightly different shell scripts that complement each other:
One that lives in server repo; and one that lives in the repo for the library/client.

They are both called `ci-e2e` and are very similar in structure:

1. There’s a `clone_${THE_OTHER_THING}` function that — you wouldn’t believe — clones the counterpart at some location.
Usually, this uses the master branch, but while a pull request is being worked on that introduces a new feature, it may use another branch.
2. There’s a `ready_${THIS_THING}` function.
`ready_client` just builds the test client.
`ready_server` does a little bit more, in that it ensures that we have the correct version of [Elixir](http://elixir-lang.org/) available before building, and eventually starts the server.
3. There’s a `cleanup_${THIS_THING}` function.
`cleanup_client` moves the log files of the runs somewhere where Jenkins can actually archive them, while `cleanup_server` kills the `beam` process that hosts the server.
4. At last, there are these two identical parts:

```sh
# Run on exit or INT/TERM
cleanup() {
  cleanup_client
  cleanup_server
}

# Check if this script is being sourced by the other `script/ci-e2e`
if [[ "$0" = "$BASH_SOURCE" ]]; then
  trap cleanup INT TERM EXIT
  clone_server
  . "${PATH_TO_THE_OTHER_THING}"/script/ci-e2e
  ready_server
  ready_client
  run_all
fi
```

The above excerpt already tells you that there is one additional function, `run_all` that sits in the library/client’s scripts, and looks like this:

```sh
run_all() {
  pushd "${CLIENT_ROOT}" >/dev/null
  BUILD_PATH="$CLIENT_BUILD_PATH" ./script/e2etest run-all --skip-build
  popd >/dev/null
}
```

Remember: `ready_client` has already built the client, so there’s no need to repeat that.

## Conclusion
As discussed in the beginning, adding automatic sync to your software significantly increases the amount of damage that (silent) data corruption can cause.
Under these circumstances, unit tests alone are no longer sufficient.
Although, writing and maintaining integration tests is no fun, the pain associated with it pales in comparison to the potential cost of _not_ having them!

The problem with regular integration tests in this context is that they only test the local part of your system.
However, when your sync functionality is based on a proven component, local integration tests in combination with the unit tests for the bridge to that component have you covered.
This is just one of the several reasons why you shouldn’t build your own sync engine.

If, however, you _really_ have to build a sync engine, not testing the ensemble of clients and server(s) would be ludicrous, and this is what end–to–end tests are for!

**The good** thing about end–to–end tests is that once they are written, you typically will not have to touch them a lot.
Since they are operating at a very high level, the APIs they use and the contracts of those APIs are unlikely to change a lot.

**The bad** thing about them is that they require custom infrastructure for running, and result–processing so that you can run them as part of your CI.
This requires you to spend time you’d like to invest more directly in your product.

**The ugly** is trouble–shooting failures or regressions that your end–to–end tests uncover, as there are at the very least two processes to inspect, if you ever really have to fire up the debugger.
However, the better your result–processing, the less often you will _need_ to fire up the debugger to diagnose an issue, and the less severe this point will be.
Cutting corners while building your infrastructure, on the other hand, will hurt you every time these tests fail!
So choose wisely how you allot your time.

I’ve shown you how we approached this topic for our upcoming realtime collaboration framework PSPDF Instant.
Although, I didn’t dive deeply into this, you should also have a general idea of how end–to–end tests fit in our overall test–strategy for that product.
In addition, I shared some details about the parts that you are most likely to have in one way or another, when _you_ need to build end–to–end tests for your own product.

While I hope this post will allow you to not have to start entirely from scratch, do not see this as ‘The One and Only True Solution’.
See it more as inspiration with maybe some practical hints!
If it gives you good reasons to build something radically different, or you can use some of this in a another context, I’d find that even cooler!
