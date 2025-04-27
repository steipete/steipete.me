```jsx
return (
  <View style={{ flex: 1 }}>
    <PSPDFKitView
      ref="pdfView"
      document="Document.pdf"
      style={{ flex: 1 }}
    />
    <View style={{ height: 60 }}>
      <Button
        onPress={() => {
          // Add an "Approved" stamp in the corner of the first page
          const stampAnnotation = {
            type: "pspdfkit/stamp",
            stampType: "Approved",
            bbox: [100, 100, 200, 200],
            pageIndex: 0
          };
          this.refs.pdfView.addAnnotation(stampAnnotation);
        }}
        title="Approve Document"
      />
    </View>
  </View>
)
```
