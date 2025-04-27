[==

```es
import PSPDFKit from "pspdfkit";

const toolbarItems = PSPDFKit.defaultToolbarItems;
toolbarItems.reverse();
toolbarItems.push({
  type: "custom",
  id: "cat",
  icon: "https://example.com/icons/cat.svg",
  mediaQueries: ["(min-width: 480px)"],
  onPress: () => alert("meow")
});

PSPDFKit.load({
  // ...
  toolbarItems
});
```

```js
var PSPDFKit = require("pspdfkit");

var toolbarItems = PSPDFKit.defaultToolbarItems;
toolbarItems.reverse();
toolbarItems.push({
  type: "custom",
  id: "cat",
  icon: "https://example.com/icons/cat.svg",
  mediaQueries: ["(min-width: 480px)"],
  onPress: function() {
    alert("meow");
  }
});

PSPDFKit.load({
  // ...
  toolbarItems: toolbarItems
});
```

==]
