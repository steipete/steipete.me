```js
import PSPDFKit from "pspdfkit";

// Add an approve button to the toolbar
const approveButton = {
  type: "custom",
  title: "Approve Document",
  onPress() { placeApprovedStamp(); }
};

const instance = await PSPDFKit.load({
  container: "#pspdfkit",
  pdf: "/contract.pdf",
  toolbarItems: [...PSPDFKit.defaultToolbarItems, approveButton]
});

function placeApprovedStamp() {
  instance.createAnnotation(new PSPDFKit.Annotations.StampAnnotation({
    pageIndex: 0,
    stampType: "Approved",
    boundingBox: new PSPDFKit.Geometry.Rect({width: 150, height: 40})
  }));
}
```
