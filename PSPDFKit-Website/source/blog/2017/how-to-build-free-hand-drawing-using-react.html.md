---
title: "How to Build Free-Hand Drawing Using React"
description: We implement a simple vector based free-hand drawing with React using SVG.
section: blog
author:
  - Philipp Spiess
author_url:
  - https://twitter.com/philippspiess
date: 2017-03-16 12:00 UTC
tags: Web, Development, React
preview_image: /images/blog/2017/how-to-build-free-hand-drawing-using-react/pspdfkit-loves-react.png
published: true
---

At [PSPDFKit], we make the most advanced PDF SDKs for mobile and desktop. We released [PSPDFKit for Web] in December and are working hard to bring you all the beloved [PSPDFKit] features from iOS and Android to the browser.

We'd like to give you some insights into how we built these features. For this blog post, we'll look at how we implemented one of the annotation features: free-hand drawing.

## High-Level Goal

The high-level goal we sought to achieve was to develop a useful technique when implementing a feature that's difficult to estimate. The user must be able to draw multiple lines inside an HTML element by using his mouse. Lines should be connected until the mouse button is released again. Here's how it could look:

<center>
<img title="Drawing Example" width="300px" src="/images/blog/2017/how-to-build-free-hand-drawing-using-react/love-react.gif">
</center>

We want to encapsulate the whole feature inside a React component so we can reuse the code whenever we need it again.

## Investigating `<canvas>`

When we thought about freehand drawing on the web and did some research, we quickly discovered the `<canvas>` element. The `<canvas>` element is a drawing canvas that can be controlled via JavaScript. That seemed pretty good for our use case! Here's a quick example of the API:

```js
let canvas = document.getElementById("canvas");
let ctx = c.getContext("2d");
ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();
```

The canvas API is pretty straightforward. We created a drawable context using the `getContext()` method and used low-level drawing instructions to make lines. In the example above, we moved the cursor to the point `0 0` (starting from the top, left) and draw a line to `200 100`.

While this seems like a perfect fit, there are two downsides to using canvas in our example:

 1. The API requires an HTML element, something that is possible in React using `refs`, but we need to think carefully about how this will interact with [React's lifecycle methods]. When the `render()` method is called, remember that React only generates a _representation_ of the DOM. We need to defer the drawing instructions until the element is actually created (i.e. on `componentDidMount()` / `componentDidUpdate()`).

 2. The canvas element is a bitmap and thus will be rasterized before being rendered on screen. That means that drawing is done pixel-wise with the exact coordinates that you supply. When we apply a transformation to the canvas and scale it after the drawing, it will appear blurry. If only there were a vector graphic format for the web...

## Meet SVG

SVG is an XML-based vector image format, with easy-to-use primitives for all basic shapes: lines, circles, rectangles, etc. It is embedded into HTML by just placing it into an `<svg>` tag, like this:

```html
<div>
  <svg>
    <path stroke="black" d="M 0 0 L 200 100" />
  </svg>
</div>
```

This example also renders a line from `0 0` to `200 100`. The information is encoded inside the `d` property of the `<path>` (we will talk about this special property later). Setting the stroke color can be done either as an element property or by using CSS.

Because of its XML-based format, it is handled by React the same way we handle HTML. We can declaratively render the elements inside our `render()` methods and let React take care of applying the changes to the DOM efficiently.

## Component and Data Structure

Before we begin, we need to think about the component structure for a second. We already discussed that we want to encapsulate the complete feature inside a single React component. We will call this component `DrawArea`. Its main purpose is to handle mouse events. Inside the `DrawArea`, we will place a `Drawing` to abstract the SVG logic away. It will receive the points to draw as `props`. Finally, the `Drawing` will, for every line, render the individual lines using `DrawingLine`. Since `Drawing` and `DrawingLine` will not have their own state, we will use [functional components][1] for them.

<center>
<img title="Drawing Example" width="480px" src="/images/blog/2017/how-to-build-free-hand-drawing-using-react/components.png">
</center>

The state of our `DrawArea` will contain a boolean `isDrawing` that we will set to true when we start drawing. The `lines` property will be a list of lines, where a line contains, again, a list of points. We will use a map with `x` and `y` keys to represent a point.

We will use [Immutable.js] to handle the complex `lines` structure. While this is not a requirement for this task, we've found [Immutable.js] extremely useful in handling more complex state objects since it comes with helpers that allow you to apply deep persistent changes.

## DrawArea

We will start by initializing the state within the constructor of this component by setting lines to an empty list (thus, having no lines when we start) and `isDrawing` to false:

```js
class DrawArea extends React.Component {
  constructor() {
    super();
    this.state = {
      isDrawing: false,
      lines: Immutable.List(),
    };
  }
}
```

We follow this by implementing the `render()` method and adding event handlers for `onMouseDown`. We will need a reference to the DOM element later, so let's also add a `ref` attribute here.

```jsx
render() {
  return (
    <div ref="drawArea" onMouseDown={this.handleMouseDown} />
  );
}
```

Next up, we implement the `handleMouseDown` method. It receives a `MouseEvent` as the parameter which we can use to query the `x` and `y` coordinates. Since those coordinates start on the top/left of the browser and not our DrawArea, we will subtract the `top` and `left` position of it to receive relative coordinates. We also have the option to use either `MouseEvent.clientX` or `MouseEvent.screenX`. The latter will reference the current window as the starting anchor and will change when you scroll on that window. The client coordinates, however, will be inside the client space and thus will stay the same if you scroll. We will use `clientX` since this is the value we need when subtracting the `boundingClientRect`.

When we receive a mouse down event (and the left mouse button is clicked), we want to create a new line by pushing a new list with the current point to the line. We will update the state using the updater function approach: When we pass a function to `setState()`, React will call it with the current state and expect it to return the new state. The `setState()` happens atomically, so no updates are lost.

```js
handleMouseDown(mouseEvent) {
  if (mouseEvent.button != 0) {
    return;
  }

  const point = this.relativeCoordinatesForEvent(mouseEvent);

  this.setState(prevState => {
    return {
      lines: prevState.lines.push(Immutable.List([point])),
      isDrawing: true,
    };
  });
}

relativeCoordinatesForEvent(mouseEvent) {
  const boundingRect = this.refs.drawArea.getBoundingClientRect();
  return new Immutable.Map({
    x: mouseEvent.clientX - boundingRect.left,
    y: mouseEvent.clientY - boundingRect.top,
  });
}
```

When we're currently drawing and receive a mouse move event within the container, we want to push those points to the latest line. We implement this the same way as we implement mouse down: We add an event listener to the `<div>` and implement a `handleMouseMove` method. The state transition here uses a deep persistence change helper (`updateIn()`) from Immutable.js. The array is a path to the property we want to change, in our case, it's the latest line. For that element, it will invoke a callback function which we use to push the point into that segment.

```js
handleMouseMove(mouseEvent) {
  if (!this.state.isDrawing) {
    return;
  }

  const point = this.relativeCoordinatesForEvent(mouseEvent);

  this.setState(prevState => {
    return {
      lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point)),
    };
  });
}
```

To stop drawing, we need to do the same thing for the mouse up event. However, since it is possible to start drawing inside the element, move outside and release the mouse button outside as well, we need a way to track the mouse up events from all possible places. Luckily, we can simply add our custom event listeners to the `document`. They will fire even when the mouse up occurs outside the browser window. (Always keep in mind that you should not use custom event listeners if you don't have to since they will escape React's event system, which can cause subtle problems when you try to stop propagation. We don't use that for this feature so we can ignore that for now.)

```js
componentDidMount() {
  document.addEventListener("mouseup", this.handleMouseUp);
}
componentWillUnmount() {
  document.removeEventListener("mouseup", this.handleMouseUp);
}
handleMouseUp() {
  this.setState({ isDrawing: false });
}
```

This is enough to record the free hand drawings! All that's left to do is implement the actual rendering of the drawing. As we discussed earlier, we want to use SVG to make this happen.

## Drawing and DrawingLine

We start out with the `Drawing` component. It will render the `<svg>` and a `DrawingLine` for every line.

```jsx
function Drawing({ lines }) {
  return (
    <svg>
      {lines.map((line, index) => (
        <DrawingLine key={index} line={line} />
      ))}
    </svg>
  );
}
```

That was pretty straightforward! We just map over the lines and create a new `DrawingLine` for each. We also add a [`key` attribute][2] here which is required by React for identifying which DOM nodes have changed.

As a final step, the only thing that is missing is the actual line. We've already seen how SVG can render lines using the `<path>` element with a `d` property. Inside this property, the [path data][5], we can instrument the path. We're using two commands in our example:

1. `M x y` Moves the cursor to a coordinate.
2. `L x y` Draws a line from the current cursor to the new coordinate. The cursor will be set to the new coordinate.

Both of these commands require absolute points within the SVG (the `x` and `y` parts refer to the `x` and `y` coordinate in pixel). Those instructions will then be joined into a string which we pass as the `d` property.

So what's left for us to do is build this `d` property based on the list of points in a line. We will use a combination of `.map()` and `.join()` to achieve this, where `.map()` brings every point inside the required SVG format, and `.join()` combines those points to a string by using a glue string:

```jsx
function DrawingLine({ line }) {
  const pathData = "M " +
    line
      .map(p => p.get('x') + ' ' + p.get('y'))
      .join(" L ");

  return <path d={pathData} />;
}
```

This is already enough to display the lines! Whenever we draw now, the state from `DrawArea` will update which will cause the underlying `Drawing` to rerender. The browser is fast enough that this happens at 60fps.

## Conclusion

We managed to set up a freehand drawing prototype in React with three components and a simple data structure by hooking into three mouse events. The complete state is handled by a single component and drawing is split between the other two. [Check out the complete example in this codepen.][3]

This is exactly how we started with freehand annotations for PSPDFKit for Web. I recommend you try out the [latest preview of PSPDFKit for Web][4] and see what other functionality we've built into line drawing like resizing, dragging, line simplification and even a custom cursor that increases it's size when you increase the stroke width! 😎

[PSPDFKit]: https://pspdfkit.com/
[PSPDFKit for Web]: https://pspdfkit.com/web/
[React's lifecycle methods]: https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle
[Immutable.js]: https://facebook.github.io/immutable-js/
[1]: https://facebook.github.io/react/docs/components-and-props.html#functional-and-class-components
[2]: https://facebook.github.io/react/docs/lists-and-keys.html#keys
[3]: https://codepen.io/philipp-spiess/pen/WpQpGr
[4]: https://web-preview.pspdfkit.com
[5]: https://developer.mozilla.org/en/docs/Web/SVG/Tutorial/Paths#Line_commands
