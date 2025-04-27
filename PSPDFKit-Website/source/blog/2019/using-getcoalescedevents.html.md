---
title: "Smoother Interactions on the Web: getCoalescedEvents()"
description: "How to use the getCoalescedEvents() method of the PointerEvent API to improve the precision of drawing apps or of any web application."
preview_image: /images/blog/2019/using-getcoalescedevents/article-header.png
section: blog
author:
  - Miguel Calderon
author_url:
  - https://github.com/miguelcalderon
date: 2019-07-31 8:00 UTC
tags: Web, Development, How-To
published: true
secret: false
---

In PSPDFKit for Web, you can create ink annotations programmatically or using the UI. In the latter case, we do our best to generate a path as close as possible to what the user has drawn. However, we’re always limited by the information provided by the browser. Moreover, this information can come from devices with different frequencies and precision, including the mouse, trackpad, touchscreen, or pen.

In order to get the best results, we need to gather as much information as possible about the input. This means getting all the `pointermove` (or `mousemove`, or `touchmove`) events that the browser can deliver, each with its event coordinates. Input pressure and the event timestamp are also important pieces of input information, but they’re beyond the scope of this article.

## History

Pointer events used to be dispatched at the browser’s will, and the frequency could vary from one device to another. Moreover, the current CPU load could affect how often the events were dispatched. However, receiving move events at a rate higher than the maximum frame rate (usually 60&nbsp;Hz) is hardly useful if the DOM needs to react to such events: The updates will be queued until the next repaint anyway.

This is one of the reasons many developers started to use the [`requestAnimationFrame`][] (rAF) API to perform such updates. This approach uses `pointermove` listeners only to store the data in a convenient shared array which can be later traversed in the rAF callback, just in time for all the DOM updates to be performed in the next repaint. As an additional benefit, using the rAF API prevented blocking the UI, as long as the rAF callback code took less time to execute than the timeframe slot did (about 16&nbsp;ms).

However, in some scenarios, more precision was still lacking. One paradigmatic example is that of drawing applications, where the scarcity of `pointermove` points is sometimes mitigated by the use of smoothing techniques that conceal the roughness of the drawing and improve the final result.

## PointerEvent Extensions: getCoalescedEvents()

In order to address this need, two changes have been introduced in the last two years — first in Chrome, then in Firefox, and hopefully soon in every modern browser:

- `pointermove` events are [now aligned with the frame rate][] ⁠— they will only be dispatched once every frame.
- A new [`PointerEvent.getCoalescedEvents()`][] method has been added in order to retrieve any `pointermove` events that occurred before the one that is being dispatched and after the previous `pointermove` event. Such accumulated (or “coalesced”) events are called [`pointerrawmove`][] events, since they are not strictly `pointermove` event instances, as they lack some of this instance’s properties. Check out [the specification details][] for more information.

What this means is that our listener can update the DOM without worrying about event frequency. Also, this means it will receive intermediate events registered before the current one, thereby enhancing the precision of the drawing (in the case of drawing apps).

This is an overview of the current support for this feature in popular browsers:

| Browser                            | PointerEvent | getCoalescedEvents |
| ---------------------------------- | :----------: | :----------------: |
| Chrome 74                          |      ✅      |         ✅         |
| Chrome 74 mobile                   |      ✅      |         ✅         |
| Firefox 67                         |      ✅      |         ✅         |
| Firefox 67 mobile                  |      ✅      |         🚫         |
| Safari 12 macOS                    |      🚫      |         🚫         |
| Safari 12 macOS                    |      🚫      |         🚫         |
| Safari 13 (Technology Preview) iOS |      ✅      |         🚫         |
| Edge 44                            |      ✅      |         🚫         |
| IE 11                              |      ✅      |         🚫         |

The new rAF-aligned `pointermove` event does not free us from using rAF when dealing with `pointermove` events, as many browsers have not followed suit yet, so handling DOM updates in the rAF callback is still recommended.

However, our callback can now benefit from the enhanced precision facilitated by `getCoalescedEvents()`. We just need to check that the new API is supported and iterate the `pointerrawmove` events array to process its coordinates.

I’ve put together a small demo showing the differences between dispatched and coalesced events in [this snippet][]. See it [in action here][].

<iframe src="https://codesandbox.io/embed/pointermove-drawing-omwnk?fontsize=14" title="Smoother interactions on the Web: getCoalescedEvents()" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe><br>

This example is just a barebones drawing pad. Using your device pointer (mouse, touch, or trackpad), you can press and move the cursor over the canvas. Each `pointermove` event dispatched and received will show its coordinates as a red dot, while the associated coalesced `pointerrawmove` events will be represented by blue dots.

Above the canvas, the coalesced/dispatched events ratio for the current drawing will be shown. Depending on the current CPU load, you will get 1.5, 2, 4, or more coalesced events per dispatched event — or even just 1 if your browser is idle enough to dispatch them all.

Let’s go through the most important parts of the snippet. For the sake of clarity, the code has been stripped of any parts unrelated to event handling.

It starts detecting features that will help us avoid unnecessary errors in browsers that do not support the API, and if a browser doesn’t support the API, it shows a warning:

```js
const supportsPointerEvents =
  typeof document.defaultView.PointerEvent !== "undefined";

const supportsCoalescedEvents = supportsPointerEvents
  ? document.defaultView.PointerEvent.prototype.getCoalescedEvents
  : undefined;
```

A helper function is added to return the coordinates. Depending on the pointer type (touch or other), a different property is used:

```js
const eventPos = event => {
  return typeof event.clientX !== "undefined"
    ? { x: event.clientX, y: event.clientY }
    : { x: event.touches[0].clientX, y: event.touches[0].clientY };
};
```

Event listeners are initialized here. Note that `touchmove` is also initialized here to work around an old iOS bug that makes dynamically added event listeners (i.e. events added in an event listener handle) non-cancelable; we need to cancel the event to prevent the default scrolling behavior in touch devices:

```js
canvas.addEventListener("pointerdown", startDrawing);
canvas.addEventListener("pointerup", stopDrawing);

if (!supportsPointerEvents) {
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("touchstart", startDrawing);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("touchend", stopDrawing);
  // Needs to be added here or `event.preventDefault()` won't work in iOS Safari.
  // https://bugs.webkit.org/show_bug.cgi?id=184250
  canvas.addEventListener("touchmove", savePoints, {
    passive: false
  });
  canvas.addEventListener("mousemove", savePoints);
}
```

In the `pointerdown` event handler, the point’s arrays are reset, the `pointermove` event listener is added, and the rAF callback is queued:

```js
let rAF;
let uniquePoints = [];
let coalescedPoints = [];
let totalUniquePoints = 0;
let totalCoalescedPoints = 0;
let rect;

let drawing = false;
function startDrawing(event) {
  drawing = true;
  totalUniquePoints = 0;
  totalCoalescedPoints = 0;
  rect = canvas.getBoundingClientRect();
  uniquePoints.push([
    eventPos(event).x - rect.left,
    eventPos(event).y - rect.top
  ]);
  coalescedPoints.push([
    eventPos(event).x - rect.left,
    eventPos(event).y - rect.top
  ]);
  canvas.addEventListener(events.move, savePoints);
  rAF = requestAnimationFrame(drawPoints);
}
```

The `pointermove` event listener will keep track of every `pointermove` and `pointerrawmove` event coordinate, saving them in their corresponding arrays. This intermediate step is unnecessary in browsers with rAF-aligned event dispatching, but it’s still useful for the rest of browsers that can potentially dispatch several events per frame:

```js
function savePoints(event) {
  if (drawing) {
    event.preventDefault();
    if (typeof event.getCoalescedEvents === "function") {
      const events = event.getCoalescedEvents();
      for (const event of events) {
        coalescedPoints.push([
          eventPos(event).x - rect.left,
          eventPos(event).y - rect.top
        ]);
      }
    }
    uniquePoints.push([
      eventPos(event).x - rect.left,
      eventPos(event).y - rect.top
    ]);
  }
}
```

The rAF callback is in charge of updating the DOM with the data gathered in the `pointermove` callback. Any coordinates included in the `uniquePoints` and `coalescedPoints` arrays are translated to points in the canvas, and then the arrays are reset, ready for the next dispatched `pointermove` event:

```js
function drawPoints() {
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#0000ff";

  coalescedPoints.forEach(point => {
    ctx.beginPath();
    ctx.arc(point[0], point[1], 2, 0, Math.PI * 2, true);
    ctx.fill();
  });

  coalescedPoints = [];

  ctx.fillStyle = "#ff0000";

  uniquePoints.forEach(point => {
    ctx.beginPath();
    ctx.arc(point[0], point[1], 3, 0, Math.PI * 2, true);
    ctx.fill();
  });

  uniquePoints = [];

  if (rAF) {
    rAF = requestAnimationFrame(drawPoints);
  }
}
```

Once the pointer is released, it’s time for cleaning up: The `pointermove` event listener is removed, any pending rAF callbacks are canceled, and the drawing function is called in case there are any pending coordinates to draw:

```js
function stopDrawing() {
  drawing = false;
  canvas.removeEventListener(events.move, savePoints);
  cancelAnimationFrame(rAF);
  rAF = null;
  drawPoints();
}
```

## Conclusion

As you can see, the `PointerEvent.getCoalescedEvents()` method provides a very useful way to improve the precision of drawing apps or of any web application that can profit from the smaller granularity of `pointermove` events.

PSPDFKit for Web uses the `PointerEvent.getCoalescedEvents()` method to provide the best possible drawn result from user-created ink annotations. If you want to see how this works, you can play around with ink annotations in [our live demo][]. And if you want to try our SDK, you can [get a trial download here][trial].

[this snippet]: https://codesandbox.io/s/pointermove-drawing-omwnk?from-embed
[in action here]: https://omwnk.codesandbox.io/
[`pointerevent.getcoalescedevents()`]: https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/getCoalescedEvents
[`requestanimationframe`]: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
[our live demo]: https://web-examples.pspdfkit.com
[trial]: http://pspdfkit.com/try
[now aligned with the frame rate]: https://groups.google.com/a/chromium.org/forum/#!msg/blink-dev/Y9BrlDeS3x4/Q5pzV3R1CgAJ
[the specification details]: https://w3c.github.io/pointerevents/extension.html
[`pointerrawmove`]: https://w3c.github.io/pointerevents/extension.html#the-pointerrawupdate-event
