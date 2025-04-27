---
title: "Persisting the Tabs State on Android"
description: "A blog post describing how to persist the tabs state inside PdfActivity."
preview_image: /images/blog/2019/android-persistent-tabs/article-header.png
section: blog
author:
  - Tomas Surin
author_url:
  - https://twitter.com/tomassurin
date: 2019-11-27 8:00 UTC
tags: Android, Development, Kotlin
published: true
secret: false
---

One of the most requested use cases regarding tabs is the ability to persist the tabs state between activity instances. And [recently][release-with-persistent-tabs-example], PSPDFKit for Android shipped `PersistentTabsExample` as part of the Catalog app. In this blog post, I’ll walk you through the steps that were necessary to build this example.

READMORE

## Introduction

PSPDFKit supports [opening multiple documents][] inside a single activity. Doing so results in the appearance of a material design tab strip for switching between these opened documents. PSPDFKit provides a full API for manipulating document tabs programmatically but does not complicate things with business-specific use cases such as restoring the state of previously opened tabs when restarting an activity. So, I am going to provide step-by-step instructions on how to build a state manager that does this.

This post is split into multiple parts:

- The [Tabs Primer](#tabs-primer) section explains the basics of how multiple documents can be opened inside [`PdfActivity`][].
- The [Model Layer](#model-layer) section describes how to persist opened documents in shared preferences.
- The [State Management](#state-management) section describes how to save a list of opened documents in a custom [`PdfActivity`][] and start the activity with the same documents restored.

## Tabs Primer

Let’s first look at how PSPDFKit models opened documents inside [`PdfActivity`][] and how the tabs UI interacts with this model.

Each document loaded inside [`PdfActivity`][] is represented by a [`DocumentDescriptor`][] class, which encapsulates the document sources and the UI state associated with the document.

Document sources make up the list of parcelable [`DocumentSource`][] instances. A document is loaded by merging all documents opened from these sources in their list order. Parcelable sources are required in order to allow transferring document descriptors when launching an activity via [`Intent`][] or when saving its state in the saved state [`Bundle`][].

The UI state stored inside [`DocumentDescriptor`][] is a simple [`Bundle`][], and the entire handling of the document state is managed by the [`PdfActivity`][] itself: The state is set when switching to a different document and restored when returning back to the old document that already has the saved state.

Document descriptors are managed by [`DocumentCoordinator`][], which is owned by the [`PdfActivity`][]. To obtain an instance, use [`PdfActivity#getDocumentCoordinator()`][]. You can use this coordinator to modify a list of opened documents, change which document is visible, and more:

```kotlin
// Retrieve the document coordinator owned by the `PdfActivity`.
val documentCoordinator = activity.documentCoordinator

// Add a new document.
documentCoordinator.addDocument(documentDescriptor)

// Display the newly added document.
documentCoordinator.setVisibleDocument(documentDescriptor)

// Remove some other document.
documentCoordinator.removeDocument(otherDocumentDescriptor)

// Retrieve all documents.
val documents = documentCoordinator.documents

// Retrieve the visible document.
val visibleDocument = documentCoordinator.visibleDocument
```

Note that [`PdfActivity`][]’s default tabs UI, [`PdfTabBar`][], is decoupled from the `DocumentCoordinator`. Whenever the user clicks on a tab, the [`DocumentCoordinator#setVisibleDocument()`][] is called with the document descriptor for that tab. In addition, the tab bar responds to changes to the documents list inside [`DocumentCoordinator`][] and updates the tabs UI accordingly. You can do the same in your own custom document-switching UI:

```kotlin
documentCoordinator.addOnDocumentVisibleListener { documentDescriptor ->
   // Called when the document is made visible.
}

documentCoordinator.addOnDocumentsChangedListener(object: DocumentCoordinator.OnDocumentsChangedListener {
    override fun onDocumentAdded(documentDescriptor: DocumentDescriptor) {
        // Called after the document has been added to the opened documents list.
    }

    override fun onDocumentRemoved(documentDescriptor: DocumentDescriptor) {
        // Called after the document has been removed from the opened documents list.
    }

    override fun onDocumentMoved(documentDescriptor: DocumentDescriptor, targetIndex: Int) {
        // Called after the document has been moved inside the opened documents list.
    }

    override fun onDocumentReplaced(oldDocument: DocumentDescriptor, newDocument: DocumentDescriptor) {
        // Called when the document has been replaced with a different document inside the opened documents list.
    }

    override fun onDocumentUpdated(documentDescriptor: DocumentDescriptor) {
        // Called after the document has been updated — for example, when its title has changed.
    }
})
```

## Model Layer

This section describes how to build a model layer for persisting [`DocumentDescriptor`][]s that are opened in [`PdfActivity`][] to [shared preferences][shared-preferences].

### What We Are Dealing With

Shared preferences allow storing just a few simple data types — `int`, `long`, `float`, `Boolean`, `String` and an unordered set of `String`. Let’s look at the data we need to persist before we decide on the data model inside shared preferences.

[`DocumentDescriptor`][] is [`Parcelable`][], but parcelables are not well suited for persistent storage. What we really need to save is just the [`DocumentSource`][] and a custom title that could have been set on the document descriptor.

_**ℹ️ Note:** We won’t store the UI state, as it does not make sense to restore the UI state for documents that were not recently opened. Similar to persisting parcelables, it’s also unfeasible to store the UI state [`Bundle`][] in shared preferences. We would need to store only the data that is interesting to us — for example, the currently visible page, the selected annotation, or the text._

PSPDFKit supports a file Uri or a [`DataProvider`][] as a [`DocumentSource`][]. We’ll simplify this example by only dealing with file Uri document sources. If you wish to use a source for a custom [`DataProvider`][], you’ll need to store additional information in order to be able to restore [`DataProvider`][] with the data required for opening the document when the list of opened documents is restored.

Another requirement we have is that we need to store an ordered list of opened document descriptors to make sure they are restored in the correct order.

### Data Format

We will use a simple JSON as the format for storing a list of opened document descriptors in our preferences file. This list is going to be represented by a JSON array, with each element in a simple format:

```json
{
  "uri": " <document_uri>",
  "title": "<document_title>"
}
```

We can easily serialize these JSONs as strings in our shared preferences.

### Accessing Preferences

To access the shared preferences with our tabs state, we first create a separate class:

```TabsPreferences.kt
class TabsPreferences(context: Context) {

    companion object {
        const val PREFERENCES_NAME = "PSPDFKit.PersistentTabsExample"

        const val JSON_DESCRIPTOR_URI = "uri"
        const val JSON_DESCRIPTOR_TITLE = "title"

        const val PREF_DOCUMENT_DESCRIPTORS_JSON = "document_descriptors"
        const val PREF_VISIBLE_DOCUMENT_INDEX = "visible_document_index"
    }

    private val preferences = context.getSharedPreferences(PREFERENCES_NAME, Context.MODE_PRIVATE)

    /**
     * Stores the list of open document descriptors in preferences.
     */
    fun setDocumentDescriptors(descriptors: List<DocumentDescriptor>)

    /**
     * Returns the list of document descriptors stored in the shared preferences.
     */
    fun getDocumentDescriptors(context: Context): List<DocumentDescriptor>?

    /**
     * Sets the index of the currently visible document in the list of stored document descriptors.
     */
    fun setVisibleDocumentIndex(visibleDocumentIndex: Int)

    /**
     * Returns the index of the currently visible document in the list of stored document descriptors.
     */
    fun getVisibleDocumentIndex(): Int
}
```

Let’s look at the document descriptors serialization code:

```TabsPreferences.kt
fun setDocumentDescriptors(descriptors: List<DocumentDescriptor>) {
    // Our JSON will consist of a top-level array of document descriptors.
    val descriptorsArray = JSONArray()

    // Iterate through all descriptors to save and add them to the JSON array.
    for (descriptor in descriptors) {
        val descriptorJson = JSONObject()
        // Save the document source Uri. We expect all document sources
        // to be Uri-based for the sake of simplicity, as discussed above.
        descriptorJson.put(JSON_DESCRIPTOR_URI, descriptor.documentSource.fileUri)
        // Save the custom title set on the document descriptor.
        descriptorJson.put(JSON_DESCRIPTOR_TITLE, descriptor.customTitle)

        // Put the document descriptor JSON into the JSON array.
        descriptorsArray.put(descriptorJson)
    }

    // Put the created JSON into the shared preferences as a string.
    preferences.edit().putString(PREF_DOCUMENT_DESCRIPTORS_JSON, descriptorsArray.toString()).apply()
}
```

Parsing document descriptors is straightforward. However, one complication is that we need to distinguish between image documents and standard documents when creating document descriptors. We could do so by storing the `isImageDocument` Boolean in the descriptor’s JSON or, as we present here, by using PSPDFKit’s [`ImageDocumentUtils#isImageUri()`][] utility method, which resolves the document Uri and checks whether it’s an image type:

```TabsPreferences.kt
fun getDocumentDescriptors(context: Context): List<DocumentDescriptor>? {
    // Retrieve the descriptors JSON from preferences. Return immediately if
    // it's not set — this method returns `null` when there is no state saved.
    val descriptorsJson = preferences.getString(PREF_DOCUMENT_DESCRIPTORS_JSON, null)
        ?: return null

    // Parse the JSON string.
    val descriptorsArray = JSONArray(descriptorsJson)

    // Iterate through all elements in the array and extract document descriptors out of it.
    val documentDescriptors = mutableListOf<DocumentDescriptor>()
    for (i in 0 until descriptorsArray.length()) {
        val descriptorJson = descriptorsArray[i] as JSONObject

        // Extract the document file Uri or skip the entry if it's not available.
        val uri = descriptorJson.getString(JSON_DESCRIPTOR_URI) ?: continue
        // Extract optional title if available, we don't store `null` values in our JSON.
        val title = if (descriptorJson.has(JSON_DESCRIPTOR_TITLE)) descriptorJson.getString(JSON_DESCRIPTOR_TITLE) else null

        // Parse the file Uri.
        val fileUri = Uri.parse(uri)
        val documentDescriptor = if (ImageDocumentUtils.isImageUri(context, fileUri)) {
            // Create the image document descriptor for image Uris.
            DocumentDescriptor.imageDocumentFromUri(fileUri)
        } else {
            // Create the standard document descriptor for other Uris.
            DocumentDescriptor.fromUri(fileUri)
        }

        // Set the custom title as stored in preferences.
        if (title != null) {
            documentDescriptor.setTitle(title)
        }

        documentDescriptors.add(documentDescriptor)
    }
    return documentDescriptors
}
```

The remaining two methods are pretty basic since we are only storing the integer value in the shared preferences:

```TabsPreferences.kt
fun setVisibleDocumentIndex(visibleDocumentIndex: Int) {
    preferences.edit().putInt(PREF_VISIBLE_DOCUMENT_INDEX, visibleDocumentIndex).apply()
}

fun getVisibleDocumentIndex(): Int {
    return preferences.getInt(PREF_VISIBLE_DOCUMENT_INDEX, 0)
}
```

## State Management

Now we have our preferences data model in place, so let’s put it to use.

### Saving the Tabs State

We create a new activity that extends [`PdfActivity`][] in order to make it possible to add functionality to PSPDFKit’s default activity:

```PersistentTabsActivity.kt
class PersistentTabsActivity : PdfActivity() {
}
```

We want to store the currently opened documents when leaving the activity. The recommended place to do this is in `onStop()`, which is executed when the activity goes to the background:

```PersistentTabsActivity.kt
override fun onStop() {
    // Save the opened document descriptors and the currently visible document index to preferences.
    val tabsPreferences = TabsPreferences(this)

    // Retrieve the document descriptors for opened documents.
    val documents = documentCoordinator.documents

    // Save them to preferences.
    tabsPreferences.setDocumentDescriptors(documents)

    // Calculate the index of the visible document in opened documents.
    val visibleDocumentIndex = documents.indexOf(documentCoordinator.visibleDocument)
    tabsPreferences.setVisibleDocumentIndex(if (visibleDocumentIndex >= 0) visibleDocumentIndex else 0)

    // Don't forget to call `super.onStop()` to handle `onStop` correctly by the `PdfActivity`.
    super.onStop()
}
```

### Restoring the Tabs State

To restore tabs, we’ll retrieve the saved document descriptors from the preferences in our app’s main activity. If there is no saved state, we’ll proceed with opening the `PersistentTabsActivity` with the default documents loaded:

```MainActivity.kt
val tabsPreferences = TabsPreferences(context)

// Retrieve the document descriptors saved in the shared preferences.
val restoredDocumentDescriptors = tabsPreferences.getDocumentDescriptors(context)

if (restoredDocumentDescriptors == null) {
    // No state is saved. Proceed with opening `PdfActivity` with the default documents.
    ...
} else {
    // Retrieve the visible document index.
    val visibleDocumentIndex = tabsPreferences.getVisibleDocumentIndex()
    launchActivityWithDocuments(context, documentDescriptors, visibleDocumentIndex)
}
```

If there is a saved state, we’ll build the activity’s intent from these document descriptors and launch it:

```MainActivity.kt
fun launchActivityWithDocuments(context: Context, documentDescriptors: List<DocumentDescriptor>, visibleDocumentIndex: Int) {
    val intentBuilder = if (documentDescriptors.isEmpty()) {
        // There is a separate factory method for creating an empty activity. This is
        a special state that displays an empty activity message instead of the document.
        PdfActivityIntentBuilder.emptyActivity(context)
    } else {
        // Passing the restored document descriptors here will result in opening these documents in tabs.
        PdfActivityIntentBuilder.fromDocumentDescriptor(context, *documentDescriptors.toTypedArray())
    }
    // Set the visible document we restored from preferences.
    intentBuilder.visibleDocument(visibleDocumentIndex)
        // You can also provide the required activity configuration here.
        .configuration(configuration.build())
        // Don't forget to set the activity class to our custom activity.
        .activityClass(PersistentTabsActivity::class.java)

    context.startActivity(intentBuilder.build())
}
```

## Conclusion

In this blog post, I guided you through building your own persistent store for document tabs. If you want to learn more about PSPDFKit’s multi-document support, please refer to our [guides][multi-document-guide]. You can also check out the full example inside our [Catalog][example-apps] — just search for the Persistent Tabs example.

[opening multiple documents]: https://pspdfkit.com/guides/android/current/getting-started/working-with-multiple-documents/
[release-with-persistent-tabs-example]: https://pspdfkit.com/changelog/android/#6.0.3
[`pdfactivity`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html
[`pdfactivity#getdocumentcoordinator()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfUi.html#getDocumentCoordinator()
[`pdftabbar`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/tabs/PdfTabBar.html
[`documentdescriptor`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/DocumentDescriptor.html
[`documentcoordinator`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/DocumentCoordinator.html
[`documentcoordinator#setvisibledocument()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/DocumentCoordinator.html#setVisibleDocument(com.pspdfkit.ui.DocumentDescriptor)
[`documentsource`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/DocumentSource.html
[`dataprovider`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/providers/DataProvider.html
[`intent`]: https://developer.android.com/reference/android/content/Intent
[`bundle`]: https://developer.android.com/reference/android/os/Bundle
[`parcelable`]: https://developer.android.com/reference/android/os/Parcelable
[shared-preferences]: https://developer.android.com/reference/android/content/SharedPreferences
[`imagedocumentutils#isimageuri()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/ImageDocumentUtils.html#isImageUri(android.content.Context,%20android.net.Uri)
[example-apps]: https://pspdfkit.com/guides/android/current/getting-started/example-projects/#catalog-app
[multi-document-guide]: https://pspdfkit.com/guides/android/current/getting-started/working-with-multiple-documents/
