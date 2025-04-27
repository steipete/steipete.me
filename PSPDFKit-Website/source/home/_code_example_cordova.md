```js
// Show PDF
PSPDFKit.present("Document.pdf", {
  scrollDirection: "horizontal",
  backgroundColor: "white"
});
// Add a button to the nav bar that searches the document for a specific string
var searchButton = {
  title: "Search",
  action: function() {
    PSPDFKit.search("Report", true, true);
  }
};
PSPDFKit.setRightBarButtonItems([
  searchButton,
  "annotation",
  "thumbnails"
]);
```
