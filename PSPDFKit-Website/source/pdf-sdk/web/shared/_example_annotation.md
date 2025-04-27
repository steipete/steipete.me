[==

```es
import PSPDFKit from "pspdfkit";

const { List, Rect } = PSPDFKit.Immutable;
const { DrawingPoint } = PSPDFKit.Geometry;
const { InkAnnotation } = PSPDFKit.Annotations;

PSPDFKit.load(configuration).then(async instance => {
  var annotation = new InkAnnotation({
    pageIndex: 0,
    boundingBox: new Rect({ width: 100, height: 100 }),
    lines: List([
      List([
        new DrawingPoint({ x: 0, y: 0 }),
        new DrawingPoint({ x: 100, y: 100 })
      ])
    ])
  });

  const createdAnnotation = await instance.createAnnotation(annotation);
  console.log(createdAnnotation.id); // => "01BS964AM5Z01J9MKBK64F22BQ"
});
```

```js
var PSPDFKit = require("pspdfkit");

PSPDFKit.load(configuration).then(function(instance) {
  var annotation = new PSPDFKit.Annotations.InkAnnotation({
    pageIndex: 0,
    boundingBox: new PSPDFKit.Geometry.Rect({ width: 100, height: 100 }),
    lines: PSPDFKit.Immutable.List([
      PSPDFKit.Immutable.List([
        new PSPDFKit.Geometry.DrawingPoint({ x: 0, y: 0 }),
        new PSPDFKit.Geometry.DrawingPoint({ x: 100, y: 100 })
      ])
    ])
  });

  instance.createAnnotation(annotation).then(function(createdAnnotation) {
    console.log(createdAnnotation.id); // => "01BS964AM5Z01J9MKBK64F22BQ"
  });
});
```

==]
