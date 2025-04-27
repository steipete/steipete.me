---
title: "How to build a screen reader"
section: blog

author:
  - David Schreiber‑Ranner
author_url:
  - https://twitter.com/Flashmasterdash
date: 2016-07-12 12:00 UTC
tags: Android, Features, Development
published: true
---

With our [PSPDFKit 2.4 for Android release](/blog/2016/pspdfkit-android-2-4/) we improved accessibility of our framework and also shipped a `ScreenReaderExample` as part of our updated catalog app. In this blog post, I walk through the steps that were necessary to build this example app.READMORE If you have an Android device, I really recommend that you first [download the catalog app](https://rink.hockeyapp.net/apps/179eff4167cec6d9093d9e8be723f2ec) and try out the "Screen reader" example to see it in action. Otherwise, you can also <a href="/try">build the sources yourself</a>.

Here's how the screenreader _looks_ in action. At the end of the post there is also a video with audio ;-)

![Screen reader in action](/images/blog/2016/how-to-build-a-screenreader/screenreader.gif)

_**Please note:** Code in this blog post uses [RxJava](https://github.com/ReactiveX/RxJava). If you don't know about `rx.Observable` and its basic usage, I recommend making a detour and reading [this](http://blog.danlew.net/2014/09/15/grokking-rxjava-part-1/),  [this](http://www.oreilly.com/programming/free/files/rxjava-for-android-app-development.pdf) or [this](https://github.com/ReactiveX/RxJava/wiki/How-To-Use-RxJava)._

I've split the post up into three parts:

* **Part 1: Text-to-speech (TTS)** describes how to setup and use Android's text synthesis engine to read text from a PDF.
* **Part 2: Highlighting text** shows how to draw text highlights on top of the document.
* **Part 3: Hammer time!** combines the efforts of the first two parts and synchronizes TTS and highlighting.

## Setting up the app

<strike>Every beginning is hard.</strike> ← turns out to be untrue in this situation :-P

We create a blank activity class and let it extend [`PSPDFActivity`]. Taking this approach [is always a good starting point](/guides/android/current/getting-started/using-activity/) for adding higher-level PDF functions to PSPDFKit.

```java
public class ScreenReaderActivity extends PSPDFActivity {

}
```

Note that it's not necessary to override the `onCreate()` method to set a layout. This is already done by `PSPDFActivity`, which provides its own layout for displaying PDF documents and other useful views (toolbars, grids, search, etc.).

It's always a good idea to separate activities from the data model of your app. Thus, here we create a separate class for our screen reader.

```java
public class ScreenReader {
}
```

Next up: the heavy lifting.

## Part 1: Text-to-speech (TTS)

Making an Android phone speak text does not really require a master’s degree in engineering. Google did a great job in providing a robust and flexible text-to-speech API that can be used by any app back to Android Donut – and that means TTS was introduced [one version after the soft keyboard was added](https://developer.android.com/about/versions/android-1.5-highlights.html). That’s quite some time ago!

Text synthesis is done by [`android.speech.tts.TextToSpeech`] that when created, requires a `Context` and a callback for receiving initialization errors. Since TTS is the basis of our screen reader, we can eagerly initialize it inside the `ScreenReader()` constructor. Also, because we can't meaningfully recover from a TTS initialization failure, we just pass errors along to the activity which will (hopefully) handle them.

```java
public class ScreenReader {
    public interface OnInitListener {
        void onInitializationSucceeded();
        void onInitializationFailed();
    }

    @NonNull private final TextToSpeech textToSpeech;
    private boolean initialized = false;

    public ScreenReader(@NonNull final Context context,
                        @NonNull final OnInitListener onInitListener) {
        this.textToSpeech = new TextToSpeech(context.getApplicationContext(),
                                             new TextToSpeech.OnInitListener() {
            @Override public void onInit(int status) {
                if (status == TextToSpeech.ERROR) {
                    initialized = false;
                    onInitListener.onInitializationFailed();
                } else {
                    initialized = true;
                    onInitListener.onInitializationSucceeded();
                }
            }
        });
    }

    public boolean isInitialized() {
        return initialized;
    }

    public void shutdown() {
        initialized = false;
        textToSpeech.shutdown();
        spokenUnits = null;
    }
}
```

`ScreenReader.OnInitListener` is our initialization callback for success and error scenarios. The `isInitialized()` method will be used later by the activity and the `shutdown()` method is responsible for releasing all resources to prevent leaks.

After `textToSpeech` was successfully initialized, we can start reading some text.

```java
textToSpeech.speak("You can't touch this! Hammer time!", some, more, args);
```

But let's not get ahead of ourselves! We can now decorate our `ScreenReaderActivity` with an instance of our fresh `ScreenReader` class.

```java
public class ScreenReaderActivity extends PSPDFActivity {

    private ScreenReader screenReader;

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        screenReader = new ScreenReader(this, new ScreenReader.OnInitListener() {

            @Override public void onInitializationSucceeded() {

            }

            @Override public void onInitializationFailed() {
                new AlertDialog.Builder(ScreenReaderActivity.this)
                    .setTitle("Error")
                    .setMessage("Could not initiate text-to-speech engine. " +
                                "This may happen if your device does not have a local TTS " +   
                                "engine installed and is not connected to the internet.")
                    .setCancelable(false)
                    .setNeutralButton("Leave example", new DialogInterface.OnClickListener() {
                        @Override public void onClick(DialogInterface dialog, int which) {
                            finish();
                        }
                    })
                    .show();
            }
        });
    }

    @Override protected void onDestroy() {
        super.onDestroy();
        screenReader.shutdown();
        screenReader = null;
    }
}
```

### Reading a PDF document

Loading a PDF document is easy with [`PSPDFActivity`]. There are many different ways this can be accomplished with a couple lines of code. For example, to display a PDF document that ships with your app's APK, you can copy the PDF file into the `assets/` folder and load it using [`AssetDataProvider`].

```java
// This is inside your launching activity (e.g. MainActivity)
final PSPDFActivityConfiguration config = new PSPDFActivityConfiguration.Builder(context, license)
    .activity(ScreenReaderActivity.class)
    .build();

PSPDFActivity.showDocument(context, new AssetDataProvider("hammer-time.pdf"), config);
```

The activity will load and parse the document automatically on a background thread and will return a [`PSPDFDocument`] instance inside the activity's [`#onDocumentLoaded`][`PSPDFActivity#onDocumentLoaded`] method as soon as loading is finished.

```java
// This is inside your ScreenReaderActivity.java
@Override public void onDocumentLoaded(@NonNull PSPDFDocument document) {
    if (screenReader.isInitialized()) {
        screenReader.readSentencesOnPage(document, getPage());
    }
}
```

Let's look at what is happening here:

1. The call to `screenReader.isInitialized()` checks that `ScreenReader` has finished its initialization. If that's not the case, we don't need to try using it (pro tip: it wouldn't work).

2. If `screenReader` is ready, we call `screenReader.readSentencesOnPage(...)` passing in the already loaded `document` and the current page number.

A call to [`PSPDFActivity#getPage`] will always return the 0-based index of the page that is currently viewed. If you were to launch the example on the 5th page (you can do so via the [`PSPDFActivityConfiguration#page`] property) this would automatically start reading that page.

Now we jump into the `ScreenReader#readSentencesOnPage` method. The intention is probably clear from the name but lets take a look at its implementation.

```java
@Nullable private Subscription parsingSubscription;

public void readSentencesOnPage(@NonNull final PSPDFDocument document,
                                @IntRange(from = 0) final int pageNumber) {
    stopReading();

    parsingSubscription = parseSentences(document, pageNumber)
        .subscribeOn(Schedulers.computation())
        .toList()
        .subscribe(new Action1<List<ScreenReader.Unit>>() {
            @Override public void call(List<ScreenReader.Unit> sentences) {
                readUnits(sentences);
            }
        });
}

public void stopReading() { ... }
```

1. First, it calls `stopReading()`. This ensures that there is only a single screen reading process running at a time. If we would not explicitly stop TTS, we would end up queuing more and more TTS tasks with every call to `readSentencesOnPage()`.

2. Next, comes a bit of [RxJava](https://github.com/ReactiveX/RxJava): We call the method `parseSentences(document, pageNumber)`, which returns an `rx.Observable<ScreenReader.Unit>`. A `ScreenReader.Unit` is a class (we will later define) that represents _anything_ that can be read: A sentence, a word, a text passage, your favorite song's lyric...you get the idea. The PDF file format does not define such units, so we have to parse those ourselves.

The call to `subscribeOn(Schedulers.computation())` will tell the observable that the actual text extraction and parsing of the sentences have to be done on a computational background thread (away, away, from the main thread).

### Extracting sentences of a text

The `TextToSpeech` synthesis works best if applied to whole sentences. While it would also work to read text word by word: It. May. Sound. Disturbing. And. Unnatural. _(wheeze 💦)_ It would also work to read the whole page text at once, but we need to split it up for the actual on-screen highlighting.

Consider the following sentence:

> "Mr. Fox can send a message, e.g. a handwritten letter, to Dr. Dr. MC Hammer. P.S.: Hammer time!"

A parser capable of splitting this text into sentences needs fundamental understanding of the language in use and the punctuation rules involved. Since all languages have a unique set of grammar rules, writing such a parser is no trivial task and would be outside the scope of this post.

Fortunately, Java provides the [`BreakIterator`] class that knows how to parse and split up human language. Everything the break iterator requires to extract sentences is some text and its [`Locale`]. You create the iterator using `BreakIterator.getSentenceInstance(locale)`, provide the text using `iterator.setText(text)` and keep reading sentences using `breakIterator.next()` until the method returns `BreakIterator.DONE`.

Enough chit-chat! Here is the implementation of `parseSentences()` (_/me throws you into the deep water_):

```java
@NonNull private Observable<Unit> parseSentences(@NonNull final PSPDFDocument document,
                                                 @IntRange(from = 0) final int pageNumber) {
    return Observable.create(new Observable.OnSubscribe<Unit>() {
        @Override public void call(Subscriber<? super Unit> subscriber) {
            final BreakIterator iterator = BreakIterator.getSentenceInstance(Locale.US);
            iterator.setText(document.getPageText(pageNumber));

            int start = iterator.first();
            for (int end = iterator.next();
                 end != BreakIterator.DONE && !subscriber.isUnsubscribed();
                 start = end, end = iterator.next()) {

                final PSPDFTextBlock sentence = PSPDFTextBlock.create(
                    document, pageNumber, new Range(start, end - start)
                );

                subscriber.onNext(new Unit(sentence, highlightPadding));
            }

            if (!subscriber.isUnsubscribed()) {
                subscriber.onCompleted();
            }
        }
    });
}
```

Text extraction and parsing is done asynchronously and thus wrapped in an observable using `Observable.create(...)`. Here's how it happens:

1. Indices returned by the `BreakIterator` mark the `start` and `end` of sentences.
2. We call `PSPDFTextBlock.create(...)` that will return a `PSPDFTextBlock` containing the sentence as `String`, the start and end indices as well as the PDF coordinates of the sentences on the page. We will use the coordinates later to visually highlight the text on the screen.
3. Lastly, we create a new `Unit` holding the `sentence` and return it to the `subscriber`.

### What is a `Unit`?

If you have read this far and are still following, here's your cookie: 🍪

As of now we've initialized text-to-speech and parsed our text into sentences. Let's make some noise and feed those sentences to our `readUnits(...)` method.

```java
@Nullable private List<Unit> spokenUnits;

private void readUnits(@NonNull final List<Unit> units) {
    this.spokenUnits = units;

    for (final Unit unit : units) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            textToSpeech.speak(unit.textBlock.text, TextToSpeech.QUEUE_ADD, null, unit.uid);
        } else {
            //noinspection deprecation
            textToSpeech.speak(
                unit.textBlock.text,
                TextToSpeech.QUEUE_ADD,
                new HashMap<>(Collections.singletonMap(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, unit.uid))
            );
        }
    }
}
```

The method is iterating over all extracted units and asks the TTS service to speak them by calling `textToSpeech.speak(...)`. There are actually two overloads of this method, one being deprecated with Android API 21 due to a confusing method signature. The `TextToSpeech.QUEUE_ADD` option will ensure that our TTS requests are queued, so that they are spoken after one another instead of replacing each other. The `unit.uid` field uniquely identifies the TTS request inside the service. Later in the blog post, we will require that identifier to synchronize TTS and on-screen drawing.

But wait! You may have noticed that we wrapped the extracted sentence inside a `Unit` earlier, and now just take the text and feed it to the TTS service. What's with that `Unit`?

## Part 2: Highlighting text

What's so special about the `Unit` is that it extends [`PSPDFDrawable`], the main class of the [PSPDFKit drawable API](/guides/android/current/features/drawable-api/). This class also extends Android's [`android.graphics.drawable.Drawable`][`Drawable`] and behaves pretty much the same, but adds methods for drawing using PDF coordinates (rather then window pixels). Here's the basic outline of the `Unit` class.

```java
private static class Unit extends PSPDFDrawable {
    private Unit(PSPDFTextBlock textBlock, int highlightPadding) { ... }
    private void setHighlighted(boolean highlighted) { ... }

    @Override public void updatePDFToViewTransformation(Matrix matrix) { ... }

    @Override public void draw(Canvas canvas) { ... }
    @Override public void setAlpha(int alpha) { ... }
    @Override public void setColorFilter(ColorFilter colorFilter) { ... }
    @Override public int getOpacity() { ... }
}
```

The methods `draw(Canvas)`, `setAlpha(int)`, `setColorFilter(ColorFilter)` and `getOpacity()` are methods of the original [`Drawable`] class. The method `updatePDFToViewTransformation(Matrix)` was added by [`PSPDFDrawable`]. `setHighligted(boolean)` is a method of our `Unit` class itself. Let's walk through them one after another, starting with the constructor.

```java
@NonNull private final Paint paint;
@NonNull private final List<RectF> screenRects;

@NonNull private final PSPDFTextBlock textBlock;
@NonNull private final String uid;

private int alpha;
private final int highlightPadding;

private Unit(@NonNull PSPDFTextBlock textBlock, final int highlightPadding) {
   this.textBlock = textBlock;
   this.highlightPadding = highlightPadding;
   uid = Integer.toHexString(textBlock.hashCode());

   final List<RectF> screenRects = new ArrayList<>(textBlock.pageRects.size());
   for (int i = 0; i < textBlock.pageRects.size(); i++) screenRects.add(new RectF());
   screenRects = Collections.unmodifiableList(screenRects);

   paint = new Paint();
   paint.setColor(Color.parseColor("#FDF4B9"));
   paint.setStyle(Paint.Style.FILL);
   paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.MULTIPLY));

   alpha = 0;
   paint.setAlpha(0);
}
```

The constructor takes [`PSPDFTextBlock`] and `highlightPadding` and stores them in fields. The padding will be used later on for adding some extra space to the highlight, so that it does not look too cramped around the text. We're preparing a list of `RectF` instances for every rectangle of the text. For example, if the sentence spans across two lines there will be one rectangle `screenRects.get(0)` and a second one `screenRects.get(1)` holding the on-screen coordinates. Next, we prepare [`Paint`] for drawing the highlight with some hard-coded yellowish color value. Since we want to transparently blend the highlight and the actual text, we set the drawing transfer mode to `PorterDuff.Mode.MULTIPLY`.

Initially, we're setting `alpha` to `0` (completely transparent) so that the `Unit` is not drawn at all. We want to highlight only the single `Unit` that is spoken by TTS. For enabling and disabling highlighting of a unit, there's the `setHighlighted(boolean)` method.

```java
@UiThread private void setHighlighted(final boolean highlighted) {
    setAlpha(highlighted ? 255 : 0);
}

@UiThread
@Override public void setAlpha(int alpha) {
    this.alpha = alpha;
    paint.setAlpha(alpha);
    invalidateSelf();
}
```

The interesting line of code here is the call to `invalidateSelf()`. This will start another drawing pass of `Unit` on screen whenever its highlight status has been changed. The `draw(Canvas)` method is pretty simple as well.

```
@Override public void draw(Canvas canvas) {
   if (alpha == 0) return;
   for (RectF rect : screenRects) {
       canvas.drawRect(rect, paint);
   }
}
```

The method will skip drawing entirely if the `alpha` is zero and the unit is completely hidden. The drawing routine will simply iterate over all pre-calculated screen rects and paint them on the `Canvas`.

### Calculating highlight rects

The rects stored inside the `Unit#textBlock` are in PDF coordinates. PSPDFKit makes conversion between [PDF and screen coordinates](/guides/android/current/faq/coordinate-spaces/) simple, by providing the required transformations. The calculation of our `Unit#screenRects` is performed inside `updatePDFToViewTransformation(Matrix)`.

```java
@Override public void updatePDFToViewTransformation(@NonNull Matrix matrix) {
    super.updatePDFToViewTransformation(matrix);
    for (int i = 0; i < textBlock.pageRects.size(); i++) {
        final RectF rect = screenRects.get(i);

        // This transforms the PDF coordinates of the text block (inside PSPDFTextBlock#pageRects)
        // to screen coordinates and stores them into another RectF.
        matrix.mapRect(rect, textBlock.pageRects.get(i));

        // We slightly inflate the highlighted rectangle above the text for a better look.
        rect.inset(-highlightPadding, -highlightPadding);

        // The drawable defines its boundaries (the area where it will draw).
        // We're rounding "outside" so that content of the drawable is not accidentally clipped.
        final int l = (int) rect.left;
        final int t = (int) rect.top;
        final int r = (int) Math.ceil(rect.right);
        final int b = (int) Math.ceil(rect.bottom);
        final Rect bounds = getBounds();
        if (i == 0) bounds.set(l, t, r, b);
        else bounds.union(l, t, r, b);
        setBounds(bounds);
    }
}
```

The method receives a transformation `matrix` which is used to transform every `textBlock.pageRects.get(i)` from PDF coordinates to screen coordinates. The resulting screen rect will be inflated by calling `rect.inset()` so that the highlight rect is a bit bigger, and friendlier looking. The calculated bounds are required for optimized and performant on-screen drawing, as they will allow partial screen updates of damaged regions and clipped drawing operations. The bounds of our `Unit` are the union of all drawn `screenRects`.

### Rendering drawables onto the PDF

To draw a [`PSPDFDrawable`] - our `Unit` - on top of a PDF document it needs to be registered on the [`PSPDFFragment`]. The fragment is the main UI component of PSPDFKit and responsible for rendering and showing the PDF.

Registration of drawables is done via the [`PSPDFDrawableProvider`], which acts similar to `BaseAdapter` for list views. The drawable provider has a single method `getDrawablesForPage()` that is called when PSPDFKit requests all drawables for a specific page number. Our screen reader can simply return all `Unit` instances that are currently spoken. Like when using `BaseAdapter`, we need to call `drawableProvider.notifyDrawablesChanged()` whenever the data backing the provider has been altered.

```java
@NonNull private final PSPDFDrawableProvider drawableProvider = new PSPDFDrawableProvider() {
    @Nullable
    @Override public List<? extends PSPDFDrawable> getDrawablesForPage(@NonNull Context context,
                                                                       @NonNull PSPDFDocument document,
                                                                       @IntRange(from = 0) int pageNumber) {
        final List<Unit> availableDrawables = spokenUnits;
        if (availableDrawables == null) return null;
        final List<PSPDFDrawable> drawablesForPage = new ArrayList<>();
        for (Unit unit : availableDrawables) {
            if (unit.textBlock.pageNumber == pageNumber) {
                drawablesForPage.add(unit);
            }
        }
        return drawablesForPage;
    }
};

@NonNull public PSPDFDrawableProvider getDrawableProvider() {
    return drawableProvider;
}

private void readUnits(@NonNull final List<Unit> units) {
    spokenUnits = units;

    // This will tell any listener of the provider that the list of drawables needs a refresh.
    drawableProvider.notifyDrawablesChanged();
    ...
}
```

`ScreenReaderActivity` can now call this method to register the drawable provider. To prevent any possible leaks, it's always good practice to cleanly unregister drawable providers when they are no longer required.

```java
@Override protected void onCreate(Bundle savedInstanceState) {
   super.onCreate(savedInstanceState);
   screenReader = new ScreenReader(...);

   getPSPDFFragment().registerDrawableProvider(screenReader.getDrawableProvider());
}

@Override protected void onDestroy() {
   super.onDestroy();
   getPSPDFFragment().unregisterDrawableProvider(screenReader.getDrawableProvider());
   ...
}
```

That's it! Whenever we call `unit.setHighlighted(true)` the text of the unit will automatically be highlighted on screen.

![Highlighted text on a document](/images/blog/2016/how-to-build-a-screenreader/highlighted-blocks.jpg)

## Part 3: Hammer time!

We've already implemented the TTS component (via the `TextToSpeech` service) and created a `Unit` for highlighting text on the screen. The last step for completing the screen reader is to hook up those two components synchronously. Since the currently spoken `Unit` is dictated by the speed at which TTS is performed, we will hook into the so called _utterance progress_ and trigger visibility of our units alongside that.

To do so, we extend our previously implemented `speakUnit()` method and register an `UtteranceProgressListener` on our `textToSpeech` instance.

```java
private void readUnits(@NonNull final List<Unit> units) {
    ...
    this.textToSpeech.setOnUtteranceProgressListener(textToSpeechProgressListener);

    for (final Unit sentence : units) {
        ...
        textToSpeech.speak(sentence.textBlock.text, TextToSpeech.QUEUE_ADD, null, sentence.uid);
    }
}

private UtteranceProgressListener textToSpeechProgressListener = new UtteranceProgressListener() {

    @Override public void onStart(String utteranceId) {
        setSpokenUnitHighlighted(utteranceId, true);
    }

    @Override public void onDone(String utteranceId) {
        setSpokenUnitHighlighted(utteranceId, false);
    }

    @Override public void onError(String utteranceId) {
        setSpokenUnitHighlighted(utteranceId, false);
    }

    private void setSpokenUnitHighlighted(@NonNull final String utteranceId, final boolean highlighted) {
        findUnitByUid(spokenUnits, utteranceId)
            // Changing the drawable (and thus invalidating it) is only allowed from the main thread.
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(new Action1<Unit>() {
                @Override public void call(Unit unit) {
                    unit.setHighlighted(highlighted);
                }
            });
    }
};

@Nullable private Observable<Unit> findUnitByUid(@Nullable final List<Unit> units, @NonNull final String uid) {
    return Observable.defer(new Func0<Observable<Unit>>() {
        @Override public Observable<Unit> call() {
            if (units != null) {
                for (Unit unit : units) {
                    if (uid.equals(unit.uid)) return Observable.just(unit);
                }
            }

            return Observable.empty();
        }
    });
}
```

You can see that the TTS service provides the `utteranceId` of the currently processed spoken `Unit`. This identifier is the same that was provided when queueing the TTS request inside the `readUnits()` method. Since we store current units inside the `spokenUnits` field of our class, we can simply do a lookup for the currently processed `Unit` and set its visibility accordingly.

And that's it! <span style="background: rgba(255,222,84,0.5); box-shadow: 5px 0 0 rgba(255,222,84,0.5), -5px 0 0 rgba(255,222,84,0.5); margin-left: 10px; margin-right: 10px; padding: 5px 0;">We can now finally highlight some text!</span> The following video demonstrates the final result.

<p><video data-src="/images/blog/2016/how-to-build-a-screenreader/screenreader.mp4" width="50%" height="50%" style="width:50%; height:50%;"></video></p>

P.S.: You may have noticed that this blog post left out the implementation details of some methods (e.g. the `stopReading()` method, or the intialization callback inside the `ScreenReaderActivity`). This was done intentionally to simplify the reading experience by directing your focus on the relevant code parts. You can always [download the whole catalog](#trynow) and look at all the details (+ a lot of code comments).

Thanks for reading!

[`PSPDFFragment`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfFragment.html
[`PSPDFActivity`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html
[`PSPDFActivity#getPage`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html#getPageIndex()
[`PSPDFActivity#onDocumentLoaded`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html#onDocumentLoaded(com.pspdfkit.document.PdfDocument)
[`PSPDFActivityConfiguration`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.html
[`PSPDFActivityConfiguration#page`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.html#page()
[`AssetDataProvider`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/providers/AssetDataProvider.html
[`PSPDFDocument`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/PdfDocument.html
[`PSPDFDrawable`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/drawable/PdfDrawable.html
[`PSPDFTextBlock`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/datastructures/TextBlock.html
[`PSPDFDrawableProvider`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/drawable/PdfDrawableProvider.html

[`BreakIterator`]: https://developer.android.com/reference/java/text/BreakIterator.html
[`android.speech.tts.TextToSpeech`]: https://developer.android.com/reference/android/speech/tts/TextToSpeech.html
[`Locale`]: https://developer.android.com/reference/java/util/Locale.html
[`Drawable`]: https://developer.android.com/reference/android/graphics/drawable/Drawable.html
[`Paint`]: https://developer.android.com/reference/android/graphics/Paint.html
