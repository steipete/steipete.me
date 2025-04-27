[==

```es
import PSPDFKit from "pspdfkit";

const instance = await PSPDFKit.load({
  container: "#pspdfkit",
  pdf: "<pdf-file-path>",
  licenseKey: "YOUR_LICENSE_KEY_GOES_HERE"
});

console.log("PSPDFKit for Web is ready!");
console.log(instance);
```

```js
var PSPDFKit = require("pspdfkit");

PSPDFKit.load({
  container: "#pspdfkit",
  pdf: "<pdf-file-path>",
  licenseKey: "YOUR_LICENSE_KEY_GOES_HERE"
})
  .then(function(instance) {
    console.log("PSPDFKit for Web loaded", instance);
  })
  .catch(function(error) {
    console.error(error.message);
  });
```

==]
