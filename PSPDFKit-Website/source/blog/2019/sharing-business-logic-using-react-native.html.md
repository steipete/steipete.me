---
title: "Sharing Business Logic Using React Native"
description: "Not only can React Native be used to provide the UI for your application, but it is also a convenient way to share business logic."
preview_image: /images/blog/2019/sharing-business-logic-using-react-native/article-header.png
section: blog
author:
  - Reinhard Hafenscher
date: 2019-02-20 7:00 UTC
tags: Android, Development, React Native
published: true
secret: false
---

Some parts of your application’s UI will always need to be implemented using native code, but that doesn’t prevent you from sharing your business logic.READMORE Not only can React Native be used to provide your application’s UI, but you can also use it to provide the business logic driving your application while keeping your UI native. To give you an example of this, we will set up a React Native application that receives an event from within the Android UI, processes it inside our shared business logic, and passes the result back to the UI.

## Setting Up Your Android Application

By default, React Native won’t create the React Context until the first React Application is started. In order to use React Native anywhere in your app, including in background services, we need to make sure it is created immediately. So let’s take a look at the changes needed in your `Application`:

```MyApplication.kt
override fun onCreate() {
    super.onCreate()
    val reactInstanceManager = ReactInstanceManager.builder()
        .setApplication(context)
        .setBundleAssetName("index.android.bundle")
        .setJSMainModulePath("index")
        .addPackage(MainReactPackage())
        // Our React package that will contain the business logic.
        .addPackage(MyReactPackage())
        .setUseDeveloperSupport(BuildConfig.DEBUG)
        // This is important to ensure that a React Application starts.
        .setInitialLifecycleState(LifecycleState.BEFORE_CREATE)
        .build()
    // This will initialize React Native so it can be used.
    reactInstanceManager.createReactContextInBackground()
}
```

What we did here is create the regular `ReactInstanceManager`, but we called `createReactContextInBackground()` directly afterward to make sure React Native was ready to receive our events. We also added our `MyReactPackage`, which will contain our `RequestsModule` that we’ll use to interact with React from our native UI.

## Setting Up Your React Application

Next up, we’ll look at the setup required on the React Native side to actually provide some code for our native UI to call:

```index.js
import { startHandlingRequests } from "./src/native/RequestsModule";

// This will register listeners for events sent by the native code.
startHandlingRequests();
```

We just put this code inside the `index.js` so it is loaded as soon as `createReactContextInBackground()` is called. Now let’s have a look at the actual code handling things:

```RequestsModule.js
import { NativeModules, DeviceEventEmitter } from "react-native";

const { RequestsModule } = NativeModules;

export function startHandlingRequests() {
  DeviceEventEmitter.addListener(RequestsModule.PERFORM_ACTION, event => {
    // This is called whenever we receive a `PERFORM_ACTION` event from native code.
  });
}
```

We’ll get back to that in a moment, but for now, let’s look at what needs to be done on the Android side of things.

## Creating the Native Module

First let’s create our `RequestsModule`. We’ll go through it step by step. We’ll begin by exposing the constants we’re going to need:

```RequestsModule.kt
class RequestsModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    // We need to expose the constants for our events.
    override fun hasConstants(): Boolean = true

    override fun getConstants(): MutableMap<String, Any> {
        val constants = mutableMapOf<String, Any>()
        constants[PERFORM_ACTION_EVENT_KEY] = PERFORM_ACTION_EVENT
        return constants
    }

    companion object {
        private const val PERFORM_ACTION_EVENT_KEY = "PERFORM_ACTION"
        private const val PERFORM_ACTION_EVENT = "performAction"
    }
}
```

There’s not much to see here, so next up, let’s add some code to actually talk to React Native:

```RequestsModule.kt
/** The requests currently waiting on data from `react-native`. */
private val pendingRequests = mutableMapOf<Int, SingleEmitter<ReadableMap>>()

// This will be called by your `Activity` or `Service` to execute some JavaScript code.
fun performAction(data: String): Single<String> = Single.create<ReadableMap> {
    val map = getMapWithRequestId(it)
    map.putString(EVENT_KEY_DATA, data)
    sendEvent(PERFORM_ACTION_EVENT, map)
}.map {
    // We receive a map of data back from React Native and convert it to something useful here.
    it.getString("data")
}

// This handles keeping track of running requests.
private fun getMapWithRequestId(emitter: SingleEmitter<ReadableMap>): WritableMap {
    // We store the emitter so we can call it when we get our results back from `react-native`.
    val requestId = getNextRequestId()
    synchronized(pendingRequests) {
        pendingRequests[requestId] = emitter
    }
    val map = Arguments.createMap()
    map.putInt(EVENT_KEY_REQUEST_ID, requestId)
    return map
}

// This sends our request down to React Native to be handled.
private fun sendEvent(eventName: String,
                      params: WritableMap) {
    reactApplicationContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(eventName, params)
}

companion object {

    // The keys we use to send data to React Native.
    private const val EVENT_KEY_REQUEST_ID = "requestId"
    private const val EVENT_KEY_DATA = "data"

    // Each request sent to React Native gets a unique ID so that we can keep track of its progress.
    private var REQUEST_ID = 0

    /** This returns a unique ID for every request we route through `react-native`. */
    private fun getNextRequestId(): Int {
        synchronized(this) {
            return REQUEST_ID++
        }
    }
}
```

There’s quite a lot going on here, so let’s break it down. We added the `performAction`, which is what our native code will actually use to communicate with React Native. This sends the `PERFORM_ACTION_EVENT` to our React Native code. Furthermore, we map the `ReadableMap` we receive from React Native to something more useful before returning the result to our subscriber. Let’s continue by adding the methods React Native will call to let us know when the request is done:

```RequestsModule.kt
// This method will be called by React Native once the result is ready.
@ReactMethod
fun finishedRequest(requestId: Int, result: ReadableMap) {
    synchronized(pendingRequests) {
        pendingRequests[requestId]?.onSuccess(result)
        pendingRequests.remove(requestId)
    }
}

// This method will be called by React Native if there was an error performing the action.
@ReactMethod
fun failedRequest(requestId: Int, errorMessage: String) {
    synchronized(pendingRequests) {
        pendingRequests[requestId]?.onError(RuntimeException("Error thrown in JS: $errorMessage"))
        pendingRequests.remove(requestId)
    }
}
```

This is pretty straightforward; once React Native is done with its part, it will call either `finishedRequest` or `failedRequest` to let us know about the result. This uses the `SingleEmitter<ReadableMap>` we stored before to notify us about the result, while the helpful `map` call we added to `performAction` earlier makes sure that we don’t leak the implementation detail that we’re using React Native.

## Adding the React Business Logic

Let’s go back to our React Native code and make the necessary adjustments there:

```RequestsModule.js
import { NativeModules, DeviceEventEmitter } from "react-native";

const { RequestsModule } = NativeModules;

export function startHandlingRequests() {
  DeviceEventEmitter.addListener(RequestsModule.PERFORM_ACTION, event => {
    // Extract the parameters.
    const { requestId, data } = event;
    // Compute our result.
    const result = "Hello, " + data;
    // Return our result to the native code.
    RequestsModule.finishedRequest(requestId, { data: result });

    // If something throws an error, we can report it like this.
    // RequestsModule.failedRequest(requestId, e.message)
  });
}
```

We just filled in the `startHandlingRequests()` method here. All we’re doing is performing some arbitrary action and reporting the result back to native code. And with that, we’re almost ready to use our new business logic wherever we like in our native code.

## Final Touches

Now that everything is set up, let’s have a look at how to use our new shared business logic. First of all, we actually need to provide a way to access our `RequestsModule` from the `MyReactPackage`. To achieve that, we add some code to our `MyReactPackage` that will return the `RequestsModule`:

```MyReactPackage.kt
class MyReactPackage : ReactPackage {

    private val requestsModuleSubject = BehaviorSubject.create<RequestsModule>()

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val requestsModule = RequestsModule(reactContext)
        requestsModuleSubject.onNext(requestsModule)
        return listOf(requestsModule)
    }

    fun getRequestsModule(): Single<RequestsModule> = requestsModuleSubject.firstOrError()
}
```

This allows us to grab the `RequestsModule` as long as we have access to the `MyReactPackage`. We use a `BehaviorSubject` here since the Native Modules might be recreated when the `ReactApplicationContext` changes. We’ll just make a quick adjustment to our `Application` and then we’re good to go:

```MyApplication.kt
// We add this public property so we can access it throughout the application.
val myReactPackage = MyReactPackage()

override fun onCreate() {
    super.onCreate()
    val reactInstanceManager = ReactInstanceManager.builder()
        .setApplication(context)
        .setBundleAssetName("index.android.bundle")
        .setJSMainModulePath("index")
        .addPackage(MainReactPackage())
        // Our React package that will contain the business logic.
        .addPackage(myReactPackage)
        .setUseDeveloperSupport(BuildConfig.DEBUG)
        // This is important to ensure that a React application starts.
        .setInitialLifecycleState(LifecycleState.BEFORE_CREATE)
        .build()
    // This will initialize React Native so it can be used.
    reactInstanceManager.createReactContextInBackground()
}
```

## Using It

Now it’s finally time to use our new setup, and it couldn’t be any simpler:

```ExampleActivity.kt
override fun onCreate() {
    // Grab the React package.
    val myReactPackage = (application as MyApplication).myReactPackage
    // We first need to get the `RequestsModule`.
    myReactPackage.getRequestsModule()
        .flatMap {
            // Then we can perform our action.
            it.performAction("World")
        }
        .subscribeOn(Schedulers.io())
        .observeOn(AndroidSchedulers.mainThread())
        .subscribe {
            // Will display "Hello, World."
            Toast.makeText(this, it, Toast.LENGTH_SHORT).show()
        }
}
```

## Conclusion

We just had a look at using React Native to share business logic when your application runs on multiple platforms, and while this blog post only talked about the Android implementation, the iOS and Windows integrations look very similar. Sharing your business logic across multiple platforms can reduce development time, along with the amount of code that could contain bugs. That said, one of the biggest advantages of using React Native is that you have access to the entire ecosystem of JavaScript libraries.
