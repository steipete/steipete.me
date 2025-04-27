---
title: "How to Test REST API Clients in Android Apps"
description: "This article shows how we built simple and flexible integration tests for PSPDFKit Instant that are using a custom abstraction layer on top of an OkHttp mocked web server."
preview_image: /images/blog/2019/how-to-test-rest-api-clients-in-android-apps/article-header.png
section: blog
author:
  - Tomas Surin
author_url:
  - https://twitter.com/tomassurin
date: 2019-02-13 8:00 UTC
tags: Android, Development
published: true
secret: false
---

[PSPDFKit Instant][] is a library built on top of PSPDFKit that provides real-time collaboration features, allowing users to seamlessly share, edit, and annotate PDF documents across multiple platforms. For the most part, this library stands as a client for the [REST][] API provided by [PSPDFKit Server][].

Each quality piece of software needs extensive text coverage, so while developing our Instant client for Android, we provided unit tests as a result of using [TDD][]. This ensured that our code units worked as expected. To add an additional layer of reliability to our production code, we decided to provide a set of integration tests for the library. The goal for these tests was to ensure the correct client behavior when communicating with a previously specified server API. For that, we used a local mock server that implemented our real server API and behavior.

## MockWebServer

The PSPDFKit Instant client library uses [OkHttp][] for handling all HTTP calls. OkHttp provides a ready-to-use [MockWebServer][] that allows scripting HTTP servers in tests so we can run our client code against it and verify that it behaves correctly.

MockWebServer is an additional dependency that needs be added to the `build.gradle` file:

```build.gradle
...
dependencies {
    // Dependency for unit/Robolectric tests.
    testImplementation "com.squareup.okhttp3:mockwebserver:3.11.0"

    // Dependency for Android instrumentation tests.
    androidTestImplementation "com.squareup.okhttp3:mockwebserver:3.11.0"
}
```

MockWebServer usage is similar to the usage of mocking frameworks like Mockito. First prepare the server with responses that should be returned, then run the application code, and finally verify responses received by the mock server.

### A Real Example

We’ll illustrate usage of MockWebServer on a simple test that downloads a PDF document through Instant.

This requires two separate requests:

1. An authentication request made with a [JSON Web Token][] (JWT). A JWT encapsulates all data required for identifying the document on the server and for authenticating access to this document. For the sake of this example, we’ll just use `TestInstantJwtFactory`, which already generates the correct tokens.

**Note:** _`TestInstantJwtFactory` is built around the JWT generation library [JJWT][]. Its implementation is not interesting in the context of this example. Just think about it as a simple black box that generates authentication tokens usable in our Instant client integration tests._

2. A request for downloading the data of the PDF document.

As a first step, we’ll enqueue mocked responses in the mock server for these two requests:

```kotlin
val server = MockWebServer()

// Schedule the authentication response.
server.enqueue(MockResponse().apply {
    addHeader("Content-Type", "application/json")
    // Generate the authentication response body.
    body = getAuthorizationResponseJson().toString()
})
// Schedule the response for the document download.
server.enqueue(MockResponse().apply {
    addHeader("Content-Type", "application/pdf")
    // Serve PDF document data from a local file.
    body = Buffer().readFrom(File(testDocumentPath).inputStream())
})
```

Then we’ll start the mocked server and create `InstantClient` with its URL:

```kotlin
// Start the server.
server.start()

// Build a URL for the mock web server.
val serverUrl = server.url("/").toString()

// Create the Instant client.
val instantClient = InstantClient.create(context, serverUrl)
```

Now we can open the document using the `InstantClient` API:

```kotlin
// Each document on the Instant server is identified by its ID.
// The document ID doesn't matter for this test case as long as the token format is correct.
val jwt = TestInstantJwtFactory.generateJwt("document_id")

// Open the document from the mocked server.
val document = instantClient.openDocument(jwt)
assertNotNull(document)
```

Finally, we can verify that the mocked server received the correct requests:

```kotlin
val authRequest = server.takeRequest()
assertEquals("/i/d/document_id/auth", authRequest.getPath())
assertEquals(jwt, authRequest.getHeader("x-pspdfkit-token"))

val pdfDownloadRequest = server.takeRequest()
assertEquals("/i/d/document_id/pdf", pdfDownloadRequest.getPath())
```

## Introducing Abstractions

We could follow the same approach as above for serving responses for all of our test cases. We could even copy and paste all HTTP responses from our real web server and replay them in our tests. This is the simplest way of approaching REST client integration tests. As you can see, this requires a fair amount of work and duplicated code, and as such is not very scalable.

Tests should be treated like first-class citizens, and we should spend time properly designing their architecture. Providing proper architecture for tests results in more reliable, easier to write, and generally more understandable tests. Thus we decided to introduce proper abstractions over the low-level [PSPDFKit Server API][] to work with high-level objects instead.

### Encapsulating the Mocked Instant Server

The first step is to encapsulate low-level objects with a domain-specific API object. For this very reason, we introduced the `InstantMockServer` class, which provides a high-level API on top of `MockWebServer`:

```InstantMockServer.kt
class MockInstantServer(val context: Context) {

    private val mockWebServer = MockWebServer()
    private var isStarted: Boolean = false

    fun start(): String {
        if (!isStarted) {
            mockWebServer.start()
            isStarted = true
        }
        return url()
    }

    fun stop() {
        if (isStarted) {
            mockWebServer.shutdown()
            isStarted = false
        }
    }

    fun url(): String {
        return mockWebServer.url("/").toString()
    }
}
```

### Intercepting Requests

`MockWebServer` uses a queue of mocked responses by default. We need some way to intercept requests and to respond in a meaningful way to achieve higher flexibility when writing our tests. `MockWebServer` allows the use of custom `Dispatcher`s for handling responses at the time requests are received:

```InstantMockServer.kt
class MockInstantServer(val context: Context) : Dispatcher() {
    ...

    init {
        // Register this class as a custom dispatcher.
        mockWebServer.setDispatcher(this)
    }

    override fun dispatch(request: RecordedRequest): MockResponse {
        // Parse the request's path. Example: `/i/d/document_id/endpoint_name`
        val path = Uri.parse(request.path)
        val pathSegments = path.pathSegments
        if (pathSegments.size < 4 || pathSegments[0] != "i" || pathSegments[1] != "d") {
            return MockResponse().setResponseCode(404)
        }
        val documentId = pathSegments[2] ?: return MockResponse().setResponseCode(404)
        val endpointName = pathSegments[3]

        if (endpointName == "auth") {
            // Handle the authentication request.
            return MockResponse().apply {
                addHeader("Content-Type", "application/json")
                body = getAuthorizationResponseJson().toString()
            }
        } else if (endpointName == "pdf") {
            // Handle the PDF download request.
            return MockResponse().apply {
               addHeader("Content-Type", "application/pdf")
               body = Buffer().readFrom(File(testDocumentPath).inputStream())
            }
        }
        return MockResponse().setResponseCode(404)
    }
}
```

### Mocking Server Documents

We achieved the biggest step in expressiveness of our tests by mocking documents on the Instant server instead of mocking all responses. We introduced `MockedServerDocument`, which encapsulates all the data required for the Instant server to mimic the real PSPDFKit Server:

```MockedServerDocument.kt
class MockedServerDocument(val documentPath: String, var jwt: String) {

    // Parse the documentId from the JWT.
    val documentId = InstnatJwt.parse(jwt)

    // Example of properties used internally to construct responses in Instant's communication protocol.

    // Token used in all requests after authentication.
    val authenticatedToken = generateAuthenticationToken()
    // Current revision of the document on the server.
    var recordRevision = 0

    fun incrementRecordRevision(): Int {
        return ++recordRevision
    }

    ...
}
```

`InstantMockServer` keeps a registry of all mocked documents:

```InstantMockServer.kt
private val mockedDocuments: MutableMap<String, MockedServerDocument> = HashMap()

fun addDocument(documentPath: String): MockedServerDocument {
    val documentId = UUID.randomUUID().toString()
    val jwt = InstantJwtFactory.generateJwt(documentId)
    mockedDocuments[jwt] = MockedServerDocument(documentPath, jwt)
}
```

### API Endpoints

Finally, we separated handling for our API endpoints into different classes, all of which implement the interface:

```ServerEndpointHandler.kt
interface ServerEndpointHandler {
    fun handleRequest(request: RecordedRequest, document: MockedServerDocument): MockResponse
}
```

`InstantMockServer` keeps a registry of endpoint handlers together with default implementations of all basic endpoints:

```InstantMockServer.kt
companion object {
    const val ENDPOINT_AUTH = "auth"
    const val ENDPOINT_PDF = "pdf"
    const val ENDPOINT_SYNC = "sync"
}

private val endpoints: MutableMap<String, ServerEndpointHandler> = HashMap()
private val defaultEndpoints: MutableMap<String, ServerEndpointHandler> = HashMap()

init {
    defaultEndpoints[ENDPOINT_AUTH] = AuthEndpointHandler(this)
    defaultEndpoints[ENDPOINT_PDF] = PdfEndpointHandler(this)
    defaultEndpoints[ENDPOINT_SYNC] = SyncEndpointHandler(this)
}

fun registerEndpoint(endpointName: String, endpointHandler: ServerEndpointHandler) {
    endpoints[endpointName.toLowerCase()] = endpointHandler
}

fun unregisterEndpoint(endpointName: String) {
    endpoints.remove(endpointName.toLowerCase())
}

fun getEndpoint(endpointName: String): ServerEndpointHandler? {
    return when {
        // First try the registered endpoint.
        endpoints.containsKey(endpointName) -> endpoints[endpointName]
        // Fall back to the default endpoint.
        defaultEndpoints.containsKey(endpointName) -> defaultEndpoints[endpointName]
        else -> null
    }
}

override fun dispatch(request: RecordedRequest): MockResponse {
    ...
    return getEndpoint(endpointName)?.handleRequest(serverRequest, mockedServerDocument)
        ?: MockResponse().setResponseCode(404)
}
```

Endpoint handler implementation is fairly simple, and for the most part, just consists of validating inputs and composing a mocked response. For example, this is the handler for our authentication endpoint:

```AuthEndpointHandler.kt
open class AuthEndpointHandler(val serverContext: MockInstantServer) : ServerEndpointHandler {

    override fun handleRequest(request: RecordedRequest, document: MockedServerDocument): MockResponse {
        // Validate the JWT in the request against the JWT of the mocked document.
        val requestJson = request.bodyJson()
        if (!requestJson.has("jwt") || document.jwt != requestJson.get("jwt")) {
            return MockResponse().setResponseCode(400).setBody("Invalid signature")
        }

        return MockResponse().apply {
            mockResponse.addHeader("content-type", "application/json")
            mockResponse.setBody(getAuthorizationResponseJson(document).toString())
        }
    }

    protected fun getAuthorizationResponseJson(document: MockedServerDocument): JSONObject {
        ...
    }
}
```

We can even implement rather complex use cases by registering a custom endpoint handler in `InstantMockServer`. For example, we can achieve blocking behavior of our endpoints by wrapping them in a simple decorator:

```BlockingEndpointHandler.kt
open class BlockingEndpointHandler(val delegate: ServerEndpointHandler) : ServerEndpointHandler {

    private var blockingLatch = CountDownLatch(1)

    override fun handleRequest(request: MockedServerRequest, document: MockedServerDocument): MockResponse {
        // Blocks dispatcher thread until the `unblock()` method is called.
        blockingLatch.await()
        return delegate.handleRequest(request, document)
    }

    fun unblock() {
        blockingLatch.countDown()
    }
}
```

## Using Our Abstractions

We can now rewrite our test from before in a more concise way:

```kotlin
val server = InstantMockServer()

// Add a document to the server.
val mockedDocument = server.addDocument(testDocumentPath)

// Start the server.
val serverUrl = server.start

// Create an Instant client.
val instantClient = InstantClient.create(context, serverUrl)

// We'll use the correct JWT for the document generated by InstantMockServer.
val jwt = mockedDocument.jwt

// Open the document from the mocked server.
val document = instantClient.openDocument(jwt)
assertNotNull(document)
```

Notice that we no longer need to verify received requests because we are already verifying them in `InstantMockServer`’s custom `Dispatcher` implementation and endpoint handlers. More complex endpoints can also provide specific assertions for the received requests.

## Summary

In addition to unit tests, your REST clients should be properly tested with integration tests too. You can use the [MockWebServer][] library to mock your real server. Time pressure while developing usually makes you cut corners in your tests because they are not part of the production code. This leads to bad test design, which then leads to unmaintainable tests. This article showed how to build domain-specific vocabulary in your tests instead of relying on the low-level primitives of your chosen test framework.

[okhttp]: http://square.github.io/okhttp/
[mockwebserver]: https://github.com/square/okhttp/tree/master/mockwebserver
[pspdfkit instant]: https://pspdfkit.com/guides/android/current/pspdfkit-instant/overview/
[pspdfkit server]: https://pspdfkit.com/guides/server/current/pspdfkit-server/overview/
[pspdfkit server api]: https://pspdfkit.com/guides/server/current/api/overview/
[rest]: https://en.wikipedia.org/wiki/Representational_state_transfer
[tdd]: https://en.wikipedia.org/wiki/Test-driven_development
[json web token]: https://pspdfkit.com/guides/server/current/pspdfkit-server/client-authentication/
[jjwt]: https://github.com/jwtk/jjwt
