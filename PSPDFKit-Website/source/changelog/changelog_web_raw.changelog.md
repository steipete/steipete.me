## Newest Release

### 2020.1.2 – 24 Feb 2020

No web-specific changes in this version.

## Previous Releases

### 2020.1.1 – 13 Feb 2020

#### UI

- Fixes an issue where the viewport didn't center horizontally if the user deleted all the comments/root annotations. (#4181)
- Fixes an issue where the click on markup comment icon didn't work if a thread was already selected. (#4190)
- Fixes an issue with note annotations creation where the annotation marker would appear on every page upon dropping. (#4189)

#### Model

- API: Adds new `PSPDFKit.ScrollMode.DISABLED` option to disable changing pages via the UI. (#4172)
- Fixes an issue with ahead of time compilation tools breaking when accessing the deprecated `PSPDFKit.I18n.localeData` API. (#4201)
- Fixes an issue where text on form fields is occasionally rendered with incorrect rotation on rotated pages. (#C22854)
- Fixes an issue where some PDF JavaScript calculations may not work correctly. (#C23043)

### 2020.1 – 31 Jan 2020

_See the [announcement post](https://pspdfkit.com/blog/2020/pspdfkit-web-2020-1/)._

#### UI

- Adds the ability to add comments to a PDF document through a text highlight or the newly introduced comment marker annotation. (#3615)
- Adds support for digitally sign documents and obtain the validation status of digital signatures present on it. (#3614)
- Adds support for fitting text annotations to the text by double clicking the right, bottom right, or bottom resize anchors. (#3781)
- Adds a small delay before showing a loading indicator. (#3574)
- Adds translations for "Marquee Zoom". (#3669)
- Adds support for `en-GB` locale. (#4080)
- Changes the annotation toolbar icon to better separate it from the document editor icon. (#3804)
- Changes the location of a new note annotation to be at the center of the click. (#3776)
- Changes the note annotation icon in the main toolbar. (#4163)
- Improves UI consistency and readability by increasing the `font-size` throughout the entire app. (#3438)
- Fixes an issue where CSS fallbacks for browsers not supporting CSS variables would fail to be applied. (#3734)
- Fixes an issue where rectangle and ellipse annotations' cloudy border would be cropped when its `strokeWidth` was increased using the UI. (#3906, #C22349)
- Fixes an issue where the sidebar was not closing clicking on an element in fullscreen mode in big screens. (#3861)
- Fixes an issue where forms were being rendered even when `disableForms` was set to `true`. (#3987)
- Fixes an issue where the `subtitle` property would be ignored in "Custom" stamp annotation templates. (#3983)
- Fixes an edge case where a memory leak was produced when a new instance is immediately loaded after unloading a previously one that just started loading. (#4047)
- Fixes an issue where resizing a text widget annotation with the UI would result in poor UI responsiveness. (#4090)
- Fixes an issue in IE11 where nodes appended using annotation's `PSPDFKit.Configuration#customRenderers` disappeared. (#3916)
- Fixes an issue where the UI could initialize when the stylesheets were not yet loaded. (#4009)
- Fixes an issue where small free text annotations would not be visible. (#3925, #C22514)
- Fixes an issue where text annotations with callout with a `null` cap property would not be recognized. (#4156)
- Fixes annotation render order. (#3039, #3678)

#### Model

- API: Adds `Configuration#minDefaultZoomLevel` and `Configuration#maxDefaultZoomLevel` to allow changing the default limits on minimum and maximum zoom levels. (#3696)
- API: Adds new `PSPDFKit.Geometry.Inset` data type. (#3668)
- API: Adds `Configuration#trustedCAsCallback` to specify which certificates to validate digital signatures against. (#3614)
- API: Adds `Instance#signDocument` to digitally sign a document. (#3614)
- API: Adds `Instance#getSignaturesInfo` to retrieve the information of the digital signatures present on the document. (#3614)
- API: Adds `PSPDFKit.ViewState#showSignatureValidationStatus` to determine if and when the digital signatures validation status bar should be displayed. (#3614)
- API: Adds `PSPDFKit.SignaturesInfo` and `PSPDFKit.SignatureInfo` data types. (#3614)
- API: Adds `PSPDFKit.ShowSignatureValidationStatusMode`, `PSPDFKit.DocumentValidationStatus`and related digital signatures enums. (#3614)
- API: Adds public CSS classes for the digital signatures validation status bar. (#3614)
- API: Adds `CommentAvatar` support to `Configuration#customRenderers` (#3615)
- API: Adds `Configuration#isEditableComment` and `Instance#setIsEditableComment` to selectively allow/disable editing certain comments. (#3615)
- API: Adds `PSPDFKit.ViewState#showComments` to toggle rendering comments in the UI. (#3615)
- API: Adds `PSPDFKit.Comment` and `PSPDFKit.Annotations.CommentMarkerAnnotation` data types. (#3615)
- API: Adds `Instance#hasUnsavedComments` to determine if there are unsaved comments. (#4162)
- API: Adds `Instance#saveComments` to manually save comments in case you have manually set `autoSaveMode` to something other than `PSPDFKit.AutoSaveMode.IMMEDIATE`. (#4162)
- API: Adds public CSS classes for comments-related UI. (#3615)
- API: Replaces rectangle and ellipse annotation's `cloudyBorderInsetRect` property with `cloudyBorderInset`, which uses the new `PSPDFKit.Geometry.Inset` type. (#3668)
- API: Fixes an issue in Standalone mode where `PSPDFKit.Instance#getAnnotations()` would resolve before widget annotations were available. (#3718)
- API: Fixes an issue in Standalone mode where form fields included in `PSPDFKit.Configuration#instantJSON` were not being created. (#3713)
- API: Fixes an issue where calling `preloadWorker()` on Electron would not match the Electron app ID to the license. (#4019)
- Adds `Bookmark.toSerializableObject` and `Bookmark.fromSerializableObject` to serialize/deserialize bookmark objects. (#3655)
- Adds support for the JavaScript function `doc.gotoNamedDest`. (#C18957)
- Adds support for saving encrypted documents incrementally. (#C22722)
- Improves handling of enqueued modifications to annotations, bookmarks and form fields. (#3626)
- Improves license check error message to provide more information. (#C12904)
- Improves automatic font detection - prefer fonts already in the document when possible. (#C22530)
- Improves complex script text rendering. (#C22573)
- Improves annotation notes exporting for better compatibility with macOS 10.15 Preview's sidebar. (#C22791)
- Improves logging to the console when opening a document with form fields without a forms license. (#C23119)
- Updates `react-intl` version, which improves locale data handling by making use of the standard `Intl` API. (#3671)
- Fixes an issue where global touch event listeners would not be removed when the instance was unloaded. (#3963)
- Fixes an issue in Standalone mode where modifications to widget annotations would not be rendered, printed or exported if its form field had not been modified. (#4077)
- Fixes an issue where the value returned by `viewState.viewportPadding` had the horizontal and vertical values switched. (#3934)
- Fixes an issue in Standalone mode where sometimes exporting the PDF would error if annotations had been deleted, but not updated nor created. (#4109)
- Fixes an issue in Server mode where image and stamp annotations would be removed after applying document operations. (#4098)
- Fixes an issue where a form field element appearance stream was regenerated accidentally when not needed. (#C21618)
- Fixes an issue that caused a blank page after flattening annotations on certain documents. (#C22279)
- Fixes an issue with form calculations when one of the form fields contains multiple form elements. (#C22675)
- Fixes an issue with encrypted documents not being digitally signed correctly. (#C22722)
- Fixes an issue where creating a submit form action from JSON without action flags would not work. (#C22784)
- Fixes an issue with the file size optimization algorithm not running on save. (#C22809)
- Fixes characters escaping when exporting to XFDF. (#C22844)
- Fixes PDF Javascript when scripts are encoded in UTF16. (#C23044)

#### Examples

- Adds a new catalog example to showcase adding comments via the PSPDFKit UI. (#3615)
- Adds a new catalog example for the new Digital Signatures feature. (#3343)
- Adds an example to show PSPDFKit for Web's integration with Svelte. (#3732)
- Adds an example to show PSPDFKit for Web's integration with Next.js. (#3727)
- Adds new catalog example that demonstrates how to build an annotations inspector. (#3607)
- Adds an example to show PSPDFKit for Web's integration with GatsbyJS. (#3803)
- Updates Form Designer catalog example to demonstrate a potential UI that allows two signers to fill in a contract.
- Updates electron dependency to v7.x in Electron example. (#3992)
- Fixes an issue in the catalog app that prevented switching between Server and Standalone modes in IE11. (#3758)

#### Documentation

- API docs now have a "See also" section with related properties and methods from other namespaces. (#4062)
- Removed wrongly documented `event.formField` from `PSPDFKit.AnnotationsFocusEvent` and `PSPDFKit.AnnotationsBlurEvent`. (#3793)

### 2019.5.4 – 5 Dec 2019

#### UI

- Fixes an issue where unloading an instance while it hadn't finished loading lead to a memory leak. (#3866)
- Fixes an issue where the text of the right page on double page layout got blurry under certain conditions. (#3706)
- Fixes an issue where clicking on an annotation or the edges of a document in `PER_SPREAD` scroll mode went to the next or previous page. (#3907)
- Fixes an issue where typed letters on text form fields would appear very slowly on some browsers. (#3665)
- Fixes an issue where the UI would initialize if the stylesheets are not loaded yet. (#3739)
- Fixes an issue on Firefox and Safari where the pan mode tool would be stuck after clicking on an internal document link. (#3814)
- Fixes an issue where the Document Outline sidebar would not load when enabled in the initial view state. (#3470)

#### Model

- Fixes an issue where `annotations.focus` and `annotations.blur` events would not be dispatched at the intended times. (#3513, #3579)
- Fixes an issue where `annotations.focus` and `annotations.blur` event handler callbacks would receive the annotation object as `nativeEvent` event property instead of the original event object, only for note annotations. (#3653)
- Fixes an issue where the interface would break when deleting multiple annotations programmatically. (#3869)

#### Core

- Improves memory usage while searching document with a lot of annotations. (#C22367)
- Updates Duktape to version 2.5.0. (#C22476)
- Fixes ISO8601 timezone support in instant json. (#C21148)
- Fixes an issue where certain high resolution images weren't rendered. (#C22322)
- Fixes a crash related to multi-threading and font loading. (#C22387)

### 2019.5.3 – 5 Nov 2019

#### UI

- Fixes drawing with pen devices. (#3629)
- Fixes an issue where `additionalActions` on `WidgetAnnotations` were not working. (#3761)

#### Model

- API: Fixes an issue in Standalone mode where `PSPDFKit.Instance#exportXFDF()` would throw an error. (#3788)
- Improves the rendering of annotations with dashed borders. (#C10216)
- Increases image size limits. (#C22029)
- Fixes an issue where text entered in certain form fields was rendered garbled. (#C21700)
- Fixes an issue where some filled form fields may not show their content correctly. (#C22100)
- Fixes an issue where form repairs were done too eagerly. (#C20786)
- Fixes an issue where some properties of a widget annotation were not persisted when the document was saved. (#C21546)
- Fixes an issue where deleting or moving pages from a PDF did not update the outline. (#C21620, #C22048)
- Fixes an issue where annotation additional actions may not be deserialized correctly. (#C21983)

#### Core

- Updates Duktape to version 2.4.0. (#C20954)
- Fixes an issue if a TrueType font collection has more than 32 fonts. (#C22148)

### 2019.5.2 – 16 Oct 2019

#### UI

- Adds pinch to zoom support on Edge, Chrome, and Firefox when using touch screens. (#759)
- Adds double tap to zoom support on Edge, Chrome, and Firefox when using touch screens. (#1384)
- Adds support for navigating pages by tapping the left and right parts of the background in PER_SPREAD scroll mode. (#3658)
- Adds support for rotation to widget annotations. (#3114)
- Improves tiling experience by avoiding temporary blurriness when zooming in and out. (#3654)
- Improves pinch zooming behavior by capping the maximum and minimum zoom levels for pinching. (#3656)
- Adds the ability to move annotations by using the arrow keys. (#3611)
- Fixes an issue where a custom DOM node used as annotation tooltip wouldn't be positioned correctly under certain cases. (#3657)
- Fixes an issue in Safari where the text annotation content would appear cropped once editing was done. (#3637)
- Fixes an issue in Chrome where a text annotation could be stuck in dragging mode under certain edge cases. (#3495)
- Fixes issues that broke dragging annotations or drawing lines when a second finger was used on touch devices. (#3664)
- Fixes crashes under certain cases when deleting pages from a document. (#3666)
- Fixes an issue where updating an annotation, form field or bookmark that was being updated would fail and hide the annotation, form field or bookmark in the UI until reload. (#3675)
- Fixes an issue in Standalone mode where the bookmarks sidebar would keep showing a spinner instead of loading the bookmarks. (#3710)
- Fixes an issue where hovering over a note annotation would render the tooltip of a different, currently selected annotation. (#3697)
- Fixes an issue where selecting text would not emit `textSelection.change` events when markup annotations were not editable. (#3729)

#### Model

- Adds page filtering to the `importDocument` operation using `importedPageIndexes` in the DocumentEditor API. (#C21231, #C21387)
- Adds support for printing array structures from JavaScript code inside a PDF. (#C19063)
- Fixes an issue where widget annotations would not be created and exported correctly. (#3672)
- Fixes a rendering error where the font `ArialMT` wasn't selected correctly. (#C21744)
- Fixes a rare deadlock when rendering certain documents. (#C21856)
- Fixes a performance regression when rendering with an ICC based color space. (#C21776)
- Fixes a regression that caused certain link annotations to not work. (#C21709)
- Fixes a possible crash when loading annotations failed in certain Instant documents. (#C21617, #Z15606)
- Fixes a crash when using the processor on certain documents with very deep object hierarchies. (#C21674)
- Fixes widget annotation rotation property persistence when coming from instant JSON. (#C21552, #C21621)
- Fixes an issue where documents using certain kind of fonts may cause the app to be terminated unexpectedly. (#C21626)
- Fixes a rare situation where setting form field flags may cause a deadlock. (#C19942)
- Fixes some stability issues related to color space management. (#C21529)
- Fixes a problem where some PDF images may be missing in some documents. (#C21353)
- Fixes an issue with transparent `strokeColor` in Instant JSON. (#C21391)
- Fixes an issue when importing XFDF files in specific documents. (#C21271)
- Fixes an issue where loading a document would fail if it contained JPEG2000 images not specifying a color space. (#C21311)
- Fixes an issue where images with the lighten blend mode didn't get rendered correctly. (#C20642)

#### Core

- Updates HarfBuzz to version 2.6.2. (#C21686)

### 2019.5.1 – 19 Sep 2019

#### UI

- Adds new toolbar item type `marquee-zoom` to enable Marquee Zoom mode. This toolbar button is disabled by default. (#3608)
- Improves text field rendering and auto font size calculations. (#3581)
- Fixes an issue where typing was prevented in very small text widgets. (#3572)
- Adds the ability to move annotations by using the arrow keys. (#3611)
- Improve text field rendering and auto font size calculations. (#3581)
- Fixes an issue where moving rectangle and ellipse annotations was causing annotations in the generated PDF to be rendered incorrectly. (#3593)
- Fixes an issue where text widgets with the doNotScroll property and a right text align would not accept input on Chrome. (#3601)
- Fixes an issue where small stamp annotation templates would appear blurry in the stamp template picker dialog. (#3550)
- Fixes an issue where the Document Editor button would appear in read only mode. (#3604)
- Fixes an issue where drawing ink signatures on touch devices would be momentarily blocked when starting to draw. (#3618)

#### Model

- API: Adds `Instance#jumpAndZoomToRect()` to bring a specific rectangle into the viewport and adjust the zoom level so it's always visible to the best way possible. (#1750)
- Adds `Configuration#toolbarPlacement` to make the toolbar position configurable. (#3609)
- Improves CRUD operations with annotations, form fields, form field values and bookmarks by ensuring changes are persisted when the corresponding API methods resolve. (#3577)
- Fixes an issue where the deletion callback for annotations, bookmarks, and form fields was fired before the change was internally processed so that the save methods had no effect. (#3582)

### 2019.5 – 9 Sep 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-web-2019-5/)._

#### UI

- Adds support for rendering form field's `required` flag as new `PSPDFKit-Annotation-Widget-Required` public CSS class and HTML `required` attribute for `TextFormField`, `ComboBoxFormField` and `ListBoxFormField`. (#3477)
- Adds support for rendering widget annotations' `borderWidth` and `borderStyle` properties. (#3496)
- Adds document editor translations for "Move before", "Move after" and "Document will be merged here". (#3489)
- Adds support for iOS 13. (#3510)
- Improves annotation insertion on rotated pages. (#2853)
- Improves support for iPadOS. (#3436)
- Improves performance on pages with many annotations. (#3465)
- Fixes an issue where selected annotations would not emit the `annotations.press` event. (#3431)
- Fixes an issue with dropdown menus being cut-off when there is not enough vertical space available. (#3442)
- Fixes an issue that prevented creating image annotations with the UI in REST mode. (#3499)
- Fixes an issue where some keyboard shortcuts would be triggered when used in an external scope. (#3508)
- Fixes an issue where thumbnail images would not update after applying operations with the thumbnails sidebar open. (#3488)
- Fixes an issue where an horizontal scrollbar would appear in the ink signature picker dialog. (#3551)
- Fixes an issue where the password prompt dialog text would use a low contrast color in dark mode. (#3471)

#### Model

- API: Adds methods to add, update and remove form fields and widget annotations in the current document. Requires form designer license feature and Instant or standalone mode. (#3452)
- API: Adds `PSPDFKit.Instance#setCustomRenderers` to change the current custom renderer callbacks and update custom rendered content. (#3491)
- Adds support for JavaScript in PDF documents to Standalone and the `PSPDFKit.Options.PDF_JAVASCRIPT` configuration option to enable the feature (disabled by default). (#3084)
- Strengthens the validation of InstantJSON format in some corner cases. (#C20748)
- Improves transparency support for images and stamps. (#2612, #C20483)
- Improves performance when parsing many links. (#C20786)
- Improves memory usage on complex documents. (#C20970)
- Improves the stability of some PDF form operations. (#C21032)
- Improves font rendering and fixes several edge cases. (#C20930)
- Improves the validation of Instant JSON payloads so that case differences in properties are tolerated. (#C21145)
- Updates Botan to version 2.11.0. (#C20549)
- Fixes an issue that caused freeform rotated images and stamps to not display correctly. (#3445)
- Fixes an issue where transparent images in annotations had a white background. (#C20841)
- Fixes some stability issues when fonts are loaded from a document. (#C21042)
- Fixes a possible crash in certain documents due to a null dereference in `PDFC::Forms::FormCorePDFBackend::isLinkedInAcroForms`. (#C21121)
- Fixes an issue where standalone Web caused license pings when it shouldn't have. (#Z15302)

#### Example

- Improves PWA example with drag and drop, more consistent UI, and a more obvious update flow. (#3430)

### 2019.4.1 – 2 Aug 2019

#### Model

- Fixes an issue where the absence of the forms feature in the license would not be properly detected on load. (#3433)

### 2019.4 – 31 Jul 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-web-2019-4/)._

#### UI

- Adds the new Document Editor view to allow adding/removing pages, merging documents, and more. (#3062)
- Adds support for the `cy` locale. (#20471)
- Adds support for inline SVGs as text for ToolbarItem#icon and ToolItem#icon. (#3299)
- Adds `PSPDFKit.Configuration#theme` and `PSPDFKit.Theme` enums to configure the theme. (#3300)
- Changes icon theme. (#3123)
- Changes toolbar height from 48px to 44px. (#3123)
- Changes the thumbnail layout and styles. (#3286)
- Improves render quality when using Standalone. (#2951)
- Fixes an issue where the bookmarks and annotations sidebars wouldn't show page labels. (#3137)
- Fixes an issue that sometimes prevented text selection after a document is loaded, unloaded, and loaded again. (#3269)
- Fixes an issue where multiple highlight annotations would be created for a single selection. (#3182)
- Fixes an issue where scrolling prevented text form field changes from being propagated. (#3210)
- Fixes an issue where scrolling inside note annotations would cause the page to jump in PER_SPREAD scroll mode. (#3312)
- Fixes an issue where EXIF orientation of JPEG image annotations were not properly applied. (#3318)
- Fixes an issue where the text selection cursor was visible when the pan mode was enabled. (#3325)
- Fixes an issue where the viewport would scroll while moving an annotation in `PSPDFKit.InteractionMode.PAN` mode. (#3215)
- Fixes an issue where the text of note annotations would be cleared after zooming. (#3183)
- Fixes an issue where the text of note annotations would sometimes be cleared if the note icon was hovered. (#3365)
- Fixes an issue with the password prompt that caused the success animation to not be displayed. (#3355)
- Fixes an issue where hovering annotations would move the viewport if zoomed out and not scrollable anymore (#3368).
- Fixes an issue where a hovered note annotation would keep showing after navigating to a different page with the keyboard. (#3359)
- Fixes an issue where text annotations without `fontSize` set would not be rendered. (#3386)
- Fixes an issue where pressing a non-selectable toolbar item would clear the selected state of an annotation tool. (#3191)
- Fixes an issue where creating a new note annotation could cause it to be placed at an unexpected point. (#3059)
- Fixes an issue where extra new lines would be added to a text annotation in Firefox. (#3323)

#### Model

- API: Adds `PSPDFKit.Instance#applyOperations()` and `PSPDFKit.Instance#exportPDFWithOperations()` methods to modify the current document or export it with modifications. Requires document editing license feature. (#3062)
- Adds a content hash to the WebAssembly and asm.js artifacts so that they can use a long-term caching strategy. (#3255)
- Adds support for `isBold` and `isItalic` properties in widget annotations. These properties are currently not supported for printing or exporting. (#2940)
- Adds support for `verticalAlign` property in text and button form fields. When printing and exporting, the property is only supported for multiline text widgets. (#2895)
- Adds support for setting the default eraser cursor width before load using `PSPDFKit.Options.DEFAULT_INK_ERASER_CURSOR_WIDTH`. (#3334)
- Adds support for vertical alignment in single-line form fields when exporting or printing PDF files. (#C19882)
- Adds support for serializing and deserializing border properties of link annotations. (#C20359)
- Adds support for preserving the InstantJSON id in the PDF. (#C20572)
- Changes naming scheme of chunked data. This allows for smarter preloading and caching in service worker. (#3071)
- Improves automatic repair of AcroForms on loading documents with a large number of annotations. (#C19947)
- Improves rendering of non ASCII text. (#C20189)
- Improves loading performance for documents with complex outlines. (#C20279)
- Updates libpng to version 1.6.37. (#C19851)
- Updates Expat to version 2.2.6. (#C19868)
- Updates libWebP to 1.0.2. (#C20040)
- Updates Expat to version 2.2.7. (#C20545)
- Updates openjpeg to version 2.3.1. (#C20647)
- Fixes asynchronous APIs to always reject instead of throwing synchronously. (#2306)
- Fixes an issue reading media boxes. (#C20592)
- Fixes an issue where some documents with dropdown fields may show an arrow when the document is flattened. (#C9539)
- Fixes very occasional text rendering problems. (#C20155)
- Fixes an assertion when importing annotations outside the page range using XFDF. (#C20424)
- Fixes an issue where form fields with calculation order may not be flattened correctly. (#C20434)

#### Example

- Adds new catalog example for the Document Editor. (#3343)
- Adds new catalog example that demonstrates the new dark mode. (#3330)
- Fixes an issue where custom documents did not have the same toolbar items as example documents in the examples catalog. (#3347)

#### Instant

- Adds support for notifying connected clients when the document changed. (#3062)

### 2019.3.1 – 19 Jun 2019

#### UI

- API: Adds support for receiving `annotations.press` events from widget annotations. (#2845)
- API: Fixes an issue where `PSPDFKit.ViewState#readOnly` could not be set to `false` in read-only documents even when `PSPDFKit.Options.IGNORE_DOCUMENT_PERMISSIONS` was `true`. (#3245)
- Fixes an issue where multiline text widget annotations would not be editable because of excessive padding. (#3161)
- Fixes an issue where the tools for note annotations were rendered in an additional tooltip instead of inside the existing note tooltip. (#3214)
- Fixes an issue where clicking in an annotation tooltip would deselect the annotation. (#3236)

#### Model

- Adds support for making individual widget annotations read only with `PSPDFKit.Configuration.isEditableAnnotation`. (#2845)
- Fixes a merging issue in Instant that caused enqueued changes to resolve incorrectly and generate a server error. (#3225)

### 2019.3 – 29 May 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-web-2019-3/)._

#### UI

- Adds support for streaming search results, resulting in faster initial results. (#3058)
- Adds a toolbar for modifying the `text-highlighter` preset properties while on `TEXT_HIGHLIGHTER` interaction mode. (#3041)
- Adds an eraser tool to remove ink annotations points with the pointer. (#3057)
- Adds support for the `fr-CA` locale. (#3176)
- API: Adds `PSPDFKit.AnnotationPresets.toSerializableObject` and `PSPDFKit.AnnotationPresets.fromSerializableObject` to convert annotation presets to and from serializable objects. (#3155)
- API: Adds `PSPDFKit.SearchState#minSearchQueryLength` to retrieve the minimum search query length. (#3197)
- API: Adds a minimum search query length check to `PSPDFKit.Instance#search` and `PSPDFKit.Instance#startUISearch`. (#3197)
- Improves ink annotation creation by splitting new, distant lines into new annotations. (#1462)
- Changes the minimum annotation size for ink and shape annotations from `128` to `16`. (#3070)
- Fixes an issue where new lines would be duplicated in Chrome when editing a text annotation. (#3101)
- Fixes an issue where the default viewer styles would override the widget annotation styles on focus. (#3151)
- Fixes an issue where the ink annotation toolbar would not use user-provided line width presets. (#3150)
- Fixes an issue with read only note annotations being deletable via keyboard. (#3149)
- Fixes an issue with note annotations not being selectable via keyboard when read only. (#3149)
- Fixes an issue where the pointer cursor would change when hovering some non-editable annotations. (#3157)
- Fixes an issue with popover being positioned in the middle of the page even when they fit in around their reference element. (#3160)
- Fixes an issue with annotations being immediately deselected after selection. (#3189)

#### Model

- Adds support for passing page start and end indexes to `Instance#search()`. (#3058)
- Adds support for the `hidden` flag to all the supported annotation types. (#3172)
- Improved automatic repair of AcroForms to support more document errors. (#C19834)
- Fixes a potential crash when processing large documents under low-memory conditions. (#C19768)
- Fixes an issue where broken link annotations where sent to the backend. (#C19090)

#### Example

- Fixes an issue where duplicated line annotations were clipped in the tooltips catalog example. (#3140)

### 2019.2.4 – 13 May 2019

#### UI

- Fixes an issue where image and stamp annotations where rendered behind widget annotations. (#3124)

#### Model

- Improves error handling when creating, updating, and deleting form fields. (#3111)
- Allow creating annotation with a user-defined `createdAt` or `updatedAt` field. (#3110)
- Updates the Botan library version to 2.10.0. (#C19767)
- Fixes printing and exporting PDF files containing form field values with CJK glyphs and missing font information when using PSPDFKit Server. (#3097, #2974)
- Fixes an issue where Standalone on IE11 was causing some tiles to not render correctly. (#3117, #3092)
- Fixes a potential crash when processing large documents under low-memory conditions. (#C19768)
- Fixes an issue where broken link annotations where sent to the backend. (#C19090)

### 2019.2.3 – 29 Apr 2019

#### UI

- Adds support for custom page labels in the page indicator. (#3022)

#### Model

- Adds support for creating annotations and form fields with a user-defined ID. (#3087)
- Improves error handling when creating, updating, and deleting annotations and bookmarks. (#3090)

#### Example

- Adds a new Catalog example that adds two special annotations that can be used to obscure the document. (#3023, #3024)
- Adds a new Catalog example about keeping ink signatures across page refreshes. (#2834)

### 2019.2.2 – 25 Apr 2019

#### UI

- Fixes an issue where changing the locale did not update the `<body lang>` property. (#3069)
- Fixes an issue where text annotations `fontColor` could be set to transparent (`null`). (#2865)
- Fixes an issue where the `strokeDashArray` property of an annotation preset would be incorrectly updated. (#3080)
- Fixes an issue where the thumbnails sidebar didn't have top and bottom spacing. (#1708)

#### Model

- Improves server error handling. (#2807)
- Fixes an issue where XFDF was not being validated correctly. (#3074)

### 2019.2.1 – 19 Apr 2019

No web-specific changes in this version.

### 2019.2 – 18 Apr 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-web-2019-2/)._

#### UI

- API: Adds `Instance#currentAnnotationPreset` and `Instance#setCurrentAnnotationPreset()` to get and set the current active annotation preset. (#2919)
- API: Adds `Instance#setEditingAnnotation()` to select an annotation and enter edit mode. (#2902)
- API: Allow to disable the Ink Signature modal dialog by preventing the `annotations.onPress` event for `WidgetAnnotation`. (#2930)
- API: Renames `*.onPress` events to `*.press`. (#2984):
  - API: Renames `annotations.onPress` to `annotations.press`.
  - API: Renames `textLine.onPress` to `textLine.press`.
  - API: Renames `page.onPress` to `page.press`.
- Adds `PSPDFKit.Options.DISABLE_KEYBOARD_SHORTCUTS` to disable the viewer keyboard shortcuts. (#2909)
- Adds `PSPDFKit.Configuration#customRenderers` to allow adding rendering custom content along with annotations. (#2896)
- Adds keyboard navigation for annotations for better a11y. (#2963)
- Adds `figcaption` to images and stamp annotations that define a `description` property (screen readers only). (#2963)
- Adds `annotations.focus` and `annotations.blur` instance events. (#2982)
- Adds an optimization that reduces the number of points an ink annotation creates while drawing. (#2849)
- Improves performance of large documents when using the continuous page view. (#1542)
- Improves shape annotations scaling behavior by keeping its stroke width when resizing. (#3002)
- Fixes an issue where annotations would move when resized to very small sizes. (#2910)
- Fixes an issue when `PSPDFKit.load()` was interrupted by `PSPDFKit.unload()` before the promise has resolved. (#2334)
- Fixes an issue where text widget annotations `isFitting` property would not be correctly calculated. (#2939)
- Fixes a race condition when `PSPDFKit.load()`, `PSPDFKit.unload()`, and `PSPDFKit.load()` was called synchronously. (#2947)
- Fixes an issue when the same search term was searched twice consecutively. (#2994)
- Fixes an issue where an error message was logged when placing a new text annotation while having the thumbnail toolbar open on Standalone. (#2952)
- Fixes an issue where the default minimum stamp annotation size, `PSPDFKit.Options.MIN_STAMP_ANNOTATION_SIZE`, was so small the stamp text wouldn't fit. (#2977)
- Fixes an issue that caused previously reported `minimumZoomLevel` and `maximumZoomLevel` to no longer be valid if the viewport was resized. (#2907)
- Fixes an issue that prevented certain annotation tools for a document that does not allow changing but enables commenting. (#2663)
- Fixes an issue where multi line text widgets did no longer accept text when do not scroll was enabled. (#3036)
- Fixes an issue where annotations and form fields were not visible in Standalone mode when rotating the document on Chrome Windows. (#3037)
- Fixes an issue where ink annotations with a blend mode value different than `normal` would lose the blend mode when selected in a rotated page. (#3053)
- Fixes an issue where `viewState` events would be emitted again if an API function in the event listener caused the view state to change. (#3064)

#### Model

- API: Adds `Instance#getTextFromRects` to extract the text intersecting a list of rects. (#3040)
- Adds support for storing custom data on annotations. (#2862)
- Adds support for optionally preloading the WASM worker. (#2886)
- Adds `PSPDFKit.Options.TEXT_ANNOTATION_AUTOFIT_BOUNDING_BOX_ON_EDIT` to control whether PSPDFKit should adjust the text annotations' bounding box to fit the text in the annotation when editing it. (#2894)
- Adds `FontStyle` to Instant JSON widget annotations. (#C18083)
- Improves error handling when additional artifacts cannot be accessed. (#2811)
- Changes accessing `instance.connectedClients` to log a warning instead of throwing an error if PSPDFKit Instant is not enabled. (#2886)
- Loading PDF actions is now more reliable. (#C18843)
- Update libpng to 1.6.36. (#C18972)
- Update libjpeg-turbo to 2.0.2. (#C18973)
- Update ICU to version 63.1. (#C18974)
- Update zlib to 1.2.11. (#C18975)
- Fixes an issue where an annotation would be created even if it was invalid. (#2862)
- Fixes an issue where ink and shape annotations with transparent `strokeColor` were not being saved nor updated. (#2806)
- Fixes an issue where `strokeDashArray` was being serialized and deserialized even when its value was `null`. (#2924)
- Fixes an issue where form field values could not be saved when using `PSPDFKit.AutoSaveMode.DISABLED`. (#2934)
- Fixes an issue where `annotationSelection.change` would be emitted again if an API function was called from the `annotationSelection.change` event listener. (#2904)
- Fixes an issue where PSPDFKit Server may not identify form fields correctly. (#C18464)
- Fixes an issue where form field values may not be rendered correctly. (#C18465)
- Fixes an issue where some JPX images may not render correctly. (#C18648)
- Fixes issue with printing transparent ink strokes. (#C19102)
- Fixes an issue exporting instant shape annotations with transparent stroke colors. (#C19120)
- Fixes an issue when setting transparent colors in annotations. (#C19120)
- Fixes rendering of free text annotations with vertical alignment. (#C19145)
- Fixes an issue where edited text wasn't visible after saving the PDF. (#C19146)
- Fixes an issue when drawing a path using a pattern with alpha transparency. (#C19148)
- Fixes an issue when rendering text with an overlay blend mode. (#C19151)
- Fixes an issue where link annotations may not work correctly after a document is exported. (#C19222)
- Fixes an issue where text edited in form fields was incorrectly set in other form fields as well. (#C19236)
- Fixes an issue where QuadPoints of link annotations were saved to the PDF incorrectly. (#C19427)
- Fixes an issue where the `fillColor` property was ignored in Instant JSON for polyline annotations. (#C19443)
- Fixes a rare issue when parsing outlines. (#C19469)
- Fixes an issue where malformed widget annotations weren't correctly attached to the form. (#C19581)

#### Example

- Adds a new Catalog Example that sets up a flipbook (page curl) effect. (#2867)
- Adds a new Catalog Example about using different print modes. (#2870)
- Adds a new Catalog Example about customizing the PDF search feature. (#2859)
- Adds a new Catalog Example showcasing customization of annotation's rendered content. (#2720)

#### Instant

- Fixes an issue where updates and deletions shortly after creations were not properly propagated. (#2890)

### 2019.1.4 – 4 Apr 2019

#### UI

- Fixes an issue where text widget annotations height would not be editable when height was too small. (#2903)

#### Model

- Adds support for the cloudy border inset property (`RD`), transformed to a `cloudyBorderInsetRect` property in ellipse and rectangle annotations. (#2820)
- Fixes an issue where `instance.createAnnotation` would override the provided annotation properties with the current annotation preset properties. (#2931)
- Fixes an issue where annotations with a cloudy border may not be exported correctly. (#2831)

#### Instant

- Adds support for `cloudyBorderInset` property (`RD`) in ellipse and rectangle annotations. (#2820)

### 2019.1.3 – 27 Mar 2019

#### UI

- API: Adds public CSS classes for annotation resize anchor handlers and outline rect: `PSPDFKit-Resize-Anchor`, `PSPDFKit-Resize-Anchor-{position}` and `PSPDFKit-Selection-Outline-Rect`. (#2888)
- API: Adds public CSS classes for customizing tooltips. (#2917)
- API: Adds `Instance#setEditingAnnotation()` to select an annotation and enter edit mode. (#2893)
- Adds `PSPDFKit.Options.TEXT_ANNOTATION_AUTOFIT_TEXT_ON_EXPORT` to control whether PSPDFKit should adjust the font size to fit the text in the annotation bounding box when exporting the annotation. (#2881)
- Improves annotation tooltips position adjustment relative to selected annotations padding. (#2885)
- Fixes an issue where the instance could not be unloaded after the container node was detached from the DOM. (#2906)
- Fixes an issue where selected text markup annotations could not be deleted using the `Backspace` or `Delete` keys. (#2861)
- Fixes an issue with the latest versions of Chrome where wheel events are now passive by default and cause the host web page to be zoomed when pinching. (#2942)

#### Model

- Adds `horizontalAlign` property to `WidgetAnnotation` for aligning text horizontally. (#2935)
- Fixes an issue where form field values could not be saved when using `PSPDFKit.AutoSaveMode.DISABLED`. (#2934)
- Fixes an issue where some layers were hidden incorrectly. (#C14439)

#### Example

- Adds download buttons to the PWA and Catalog examples. (#2863)
- Fixes an issue with the iOS iPad full screen demo in the magazine catalog example. (#2750)
- Upgrade React example to latest versions. (#2926)

### 2019.1.2 – 28 Feb 2019

#### UI

- Adds `SELECTION_OUTLINE_PADDING` and `RESIZE_ANCHOR_RADIUS` callbacks and `SELECTION_STROKE_WIDTH` to the configurable `PSPDFKit.Options` object. (#2793)
- Fixes an issue where `ToolItem` in annotation tooltip would break the viewer due to a runtime error. (#2833)
- Fixes `PrintMode.EXPORT_PDF` in Safari by not opening the PDF to print in a new window. (#2835)

#### Model

- Do not check for installed Acrobat when trying to print in `EXPORT_PDF` print mode on IE11. (#2826)
- Fixes an issue where `PSPDFKit.FormFields#SignatureFormField` was not exposed despite being in the public documentation. (#2823)
- Fixes an issue with the random number generator for Standalone on IE11 and Edge. (#2802)

### 2019.1.1 – 14 Feb 2019

#### UI

- Fixes an issue where image and stamp annotations were rendered in front of widget annotations. (#2776)
- Fixes an issue where the sidebar was having the incorrect height. (#2775)
- Fixes an issue that prevent bookmarks from properly being saved when using `AutoSaveMode.INTELLIGENT`. (#2778)

#### Model

- Improves support for large documents when using PSPDFKit for Web Standalone. (#2792)

### 2019.1 – 7 Feb 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-web-2019-1/)._

#### UI

- API: Adds `ViewState#sidebarPlacement` to control the direction of the sidebar. (#2691)
- API: Adds transformation APIs to transform between PDF page space and the client space. (#2546)
- API: Adds an API to calculate a fitting bounding box for text annotations. (#2679)
- API: Adds `setEditableAnnotationTypes` and `isEditableAnnotation` to granularly define permissions for annotations. (#1756)
- Adds a cloudy border tool to polygon, rectangle and ellipse annotation toolbars. (#2528)
- Adds pinch zoom support on desktop devices with trackpad, or mouse on Chrome, Firefox and Safari. (#1263)
- Adds swipe support for per spread view on desktop devices with touch on Chrome, Firefox and Safari. (#2765)
- Improves ink annotation creation on the UI by splitting the annotation if its properties change. (#2683)
- Changes the default font families of the viewer to include more system fonts. (#2710)
- Fixes an issue where `PSPDFKit.defaultStampAnnotationTemplates` would need to be copied in order to modify it. (#2725)
- Fixes an issue where text form fields font auto sizing feature was not accounting for field padding. (#2685)
- Fixes an issue where checkbox fields checkmarks would overflow the field's bounds. (#2689)
- Fixes an issue by changing the default text highlighter and highlighter tool to match text selection highlight creation. (#2694)
- Fixes a bug when initializing a sidebar with the `initialViewState` API. (#2216)
- Fixes an issue where the dragging of the sidebar was delayed and could cause the dragging to continue although the pointer was released. (#2686)
- Fixes the default padding of annotation tooltip items. (#2709)
- Fixes an issue with note annotations permissions when annotationAndForms is set as document permission. (#2663)
- Fixes layout config drop down menu would not close when click outside. (#2708)

#### Model

- Adds a cloudy border intensity field to polygon, rectangle and ellipse annotation models. (#2528)
- Adds annotations models default values to `PSPDFKit.defaultAnnotationPresets`. (#2718)
- Adds `PSPDFKit.Options.IGNORE_DOCUMENT_PERMISSIONS` to ignore the document permissions and enable all the features. (#2470)
- Adds support for cloudy borders in shape annotations and free text annotations via Instant JSON. (#C18547)
- Improves initial text parsing performance. (#C18534)
- Fixes an issue where creating an ink signature in combination with an event handler could trigger an error. (#2695)
- Fixes an issue where form field's `doNotSpellCheck` was mistyped as `doNotSpellcheck`. (#2729)
- Fixes an issue where instances of the core PDF engine deamon failed to close. (#C18551)
- Fixes an issue with importing/exporting color values which could lead to unnecessary appearance stream regeneration in the core engine. (#C18428)
- Fixes an issue where some image annotations may be rendered incorrectly. (#C18731)

#### Example

- Adds a new Catalog Example showcasing drag and drop and other advanced customization options. (#2679)

### 2018.7.1 – 15 Jan 2019

#### UI

- API: Adds public CSS classes for annotation toolbars toolboxes. (#2392)
- Adds persistence of properties to ink signatures. (#2479)
- Adds locked aspect ratio resize by keeping `Shift` pressed while resizing an annotation with the UI. (#2531)
- Adds automatic font size calculation for combo box widgets. (#2644)
- Adds configurable ink signatures save mode. (#2593)
- Adds `PSPDFKit-Icon-<IconType>` public CSS classes to style individual icons. (#2664)
- Adds 4pt, 6pt, 8pt, and 200pt to the list of possible font sizes for text annotations. (#C18485)
- Fixes an issue in Edge where the annotation toolbar layout would break when changing the font size. (#2225)
- Fixes an issue where rotating the page could eventually trigger a JavaScript TypeError. (#2622)
- Fixes an issue where markup annotations changes were not being persisted in the annotation preset. (#2621)
- Fixes an issue where the blend modes toolbox button would show the wrong title and aria-label, or no title nor aria-label. (#2614)
- Fixes an issue where ink signatures were created at the current page index instead of the related signature form field. (#2642)
- Fixes wrong computed document height when opening a sidebar. (#2652)
- Fixes an issue where the `minimumZoomLevel` and `maximumZoomLevel` where wrong on landscape documents. (#2661)
- Fixes an issue with custom `ToolbarItem` where the `selected` property was ignored. (#2662)
- Fixes an issue where the selected item was not shown in the list of font sizes for text annotations. (#2672)
- Fixes an issue when inferring the `baseUrl` threw errors when importing PSPDFKit. (#2666)
- Fixes an issue where some overflown text fields would not adjust the font size. (#2677)
- Fixes an issue while highlighting where the current highlight annotation would disappear if clicked. (#2675)

#### Model

- API: Expose `WidgetAnnotation` interface. (#2640)
- Adds automatic fallback to non-streaming WASM compilation when the wasm file mime-type is not set to `application/wasm`. (#2624)
- Fixes an issue with license code verification on Electron. (#2668)
- Fixes a problem importing/exporting color values. This could lead to unnecessary appearance stream regeneration. (#C18428)

#### Example

- Upgrades the Electron example app to use Electron 4.0. (#2668)

### 2018.7 – 18 Dec 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-web-2018-7/)._

#### UI

- API: Adds public CSS class for active Dropdown Buttons. (#2466)
- API: Adds missing public CSS classes for shape Toolbar Buttons. (#2532)
- API: Adds public CSS class for Text Highlighter Buttons. (#2532)
- API: Adds `ToolbarItem#node` to render custom DOM nodes in the main toolbar. (#2520)
- API: Adds `Configuration#annotationTooltipCallback` to configure a tooltip with tools for each annotation type. (#2540)
- API: Adds `ViewState#enableAnnotationToolbar` to enable or disable the annotation toolbar on select. (#2540)
- Adds optional smooth line rendering for ink annotations and ink signatures. (#1588)
- Adds new stroke color icon to avoid confusion for non closed shapes (ink, lines, polylines). (#2508)
- Adds a text highlighter tool. (#2468)
- Adds support for deleting selected annotations with Backspace and Delete keys. (#1405)
- Improves contrast of annotation toolbar icons. (#2508)
- Fixes the mixup between the border color and the fill color icons. (#2508)
- Fixes an issue where the last point of an ink annotation line being created was lost when releasing the pointer. (#2518)
- Fixes an issue where stamps UI would break when editing text. (#2445)
- Fixes an issue where some standard stamp annotations were being rendered as `Custom`. (#2467)
- Fixes an issue where stamp annotations were rendered rotated when viewing rotated documents. (#2486)
- Fixes bookmarks sidebar translations to be more accessible and self explanatory. (#2478)
- Fixes an issue in Firefox 60+ where the first text line of newly created note annotations would be deleted when pressing space. (#2482)
- Fixes an issue with `SidebarMode.BOOKMARKS` not being activatable via public API. (#2500)
- Fixes an issue where note annotations content new lines were not being rendered. (#2487)
- Fixes an issue where annotations could be deleted even though read only mode is enabled. (#2505)
- Fixes an issue where certain annotation toolbar items did not share the same height. (#2508)
- Fixes an issue where annotations hit test area was too wide. (#2127)
- Fixes an issue where setting className and icon for the layout-config got ignored. (#2536)
- Fixes an issue where the annotation toolbar for note annotations was shown when in read only mode. (#2461)
- Fixes an issue where text selection using the touch mode in Edge was not properly working. (#2407)
- Fixes an issue where annotations with the `noView` flag set were selectable, and were being rendered if selected. (#2476)
- Fixes an issue where stamp annotations added to rotated PDF pages were not rendered correctly. (#2521)
- Fixes an issue in IE11 where rendered squiggle annotations would spill out of its bounding box when zoomed. (#2553)
- Fixes an issue where the `styleSheets` array passed to `PSPDFKit.load()` was cleared after the first use. (#2561)
- Fixes an issue where the wrong `onPress` handler for multiple items in a dropdown group was triggered. (#2565)
- Fixes an issue where rendered squiggle annotations would shrink when the viewport was zoomed out. (#2555)
- Fixes an issue where `startUISearch()` did not emit the same events as a user-driven UI search. (#2573)
- Fixes an issue where the loading indicator for stamp and image annotations would be incorrectly positioned in IE11. (#2594)
- Fixes an issue where the stamp picker would have an excessive height in iOS devices. (#2597)

#### Model

- API: Adds `PSPDFKit.Options` to modify default configurations. (#2171)
- Adds a new `rotation` property to `TextAnnotation`, `ImageAnnotation`, and `StampAnnotation`. (#2521)
- Adds `ToolItem` interface which `ToolbarItem` now extends. (#2540)
- Improves automatic font size calculation for text widgets. (#C18095)
- Improves handling of malformed documents when parsing the extended graphics state. (#C18057)
- Fixes an issue where custom stamps were not being correctly validated. (#2477)
- Fixes an issue where our previous change to force asm.js on Safari 11 was not working on some versions of Safari. (#2498)
- Fixes an issue where the `Parent` object was not checked when putting widgets into form fields. (#C17796)
- Fixes an issue where attachments provided via InstantJSON were not created upon initialization. (#2530)
- Fixes an issue when importing an annotation from XFDF when the bounding box is too large. (#C17901)
- Fixes issues when importing annotations on rotated pages using InstantJSON. (#C17814)
- Fixes some visualization issues with markup annotations, specially on rotated pages. (#C17889, #C18002, #C18024)
- Fixes an issue where squiggly annotations may not be created correctly on rotated pages. (#C17950)
- Fixes text parsing issue noticed on a very limited number of documents. (#C18032)

### 2018.6.1 – 16 Nov 2018

#### UI

- Fixes broken PDF text parsing in Firefox, Edge, and IE 11. (#2473)

### 2018.6 – 13 Nov 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-web-2018-6/)._

#### UI

- API: Adds `viewStateFromOpenParameters()` to apply open parameters to a `ViewState`. (#1161)
- API: Adds `Configuration#disableOpenParameters` to disable PDF Open Parameters support. (#1161)
- API: Adds `Configuration#renderPageCallback` to draw arbitrary objects onto the page layer. (#1281)
- API: Adds `Instance#getSelectedRectsPerPage()` to get a list of all selected text rects in PDF page coordinates. (#2252)
- API: Adds a new toolbar item `sidebar-bookmarks`. (#2388)
- API: Adds public CSS class `PSPDFKit-Stamp-Annotation` for stamp annotations. (#2332)
- API: Adds public CSS class `PSPDFKit-Toolbar-Button-Stamp-Annotation` to the new stamp toolbar button. (#2432)
- API: Adds public CSS class `PSPDFKit-Toolbar-Button-Icon` for toolbar button icons. (#2435)
- API: Adds a new update events for ink signatures: `inkSignatures.update`. It will fire whenever a signature is either created, updated, or deleted. (#2363)
- Adds support for stamp annotations. (#2332)
- Adds support for viewing and creating bookmarks. (#2278)
- Adds support for comb of characters text input fields. (#2111)
- Adds translations for colors, highlighter and pen. (#2311)
- Adds support for preventing text from being copied. (#2274)
- Adds support for some [PDF Open Parameters](https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/PDFOpenParameters.pdf). (#1161)
- Improves accessibility of modal dialogs. (#2291)
- Improves the word breaking behavior for text annotations. (#2261)
- Increases the maximum resolution of render page APIs. (#2419)
- Removes smooth scrolling in toolbar due to a known iOS Safari issue. (#2427)
- Fixes a bug where an initial page index was not properly applied. (#2317)
- Fixes an issue with `PSPDFKit.I18n.messages` exposing messages as ES6 modules. (#2295)
- Fixes an issue where keyboard page navigation would not work in IE 11. (#2299)
- Fixes an issue where a dropdown group with a single item would still show as a dropdown group. (#2284)
- Fixes an issue where it was not possible to opt-out an item from a dropdown group. (#2283)
- Fixes an issue where the pager toolbar item would disappear on MSEdge. (#2320)
- Fixes an issue when creating text markup annotations spanning across multiple pages. (#2337)
- Fixes an issue where some entries of a combo box input where not properly rendered. (#2322)
- Fixes crashes when using the DOM print mode on mobile devices and IE 11 by disabling high resolution printing. (#1882, #2089)
- Fixes a double update issue when changing attributes of text annotations. (#2261)
- Fixes an issue where a not supported font would not be shown as selected. (#2261)
- Fixes an issue where empty pages where appended on some browsers when using DOM printing. (#1521)
- Fixes an issue where image annotation rendering was sometimes failing when using a standalone deployment. (#2390)
- Fixes an issue where annotations with a `NoView` flag set were not printed. (#2350)
- Fixes an issue where text selection was not properly cleared when the pan tool was enabled. (#2391)
- Fixes an issue where toolbar items with data URL icons appear shifted to the left. (#2273)
- Fixes an issue where image annotations had the opacity applied twice. (#2436)
- Fixes an issue where annotations with `strokeWidth` equal to `0` and no fill color would be rendered. (#2454)
- Fixes an issue in IE11 and Edge where opacity settings would not be applied to image annotations. (#2409)

#### Model

- API: Changed annotation APIs to not throw synchronously but reject with an Error instead. (#2305)
- API: Adds `Configuration#overrideMemoryLimit` to allow overriding the default memory limit for PSPDFKit for Web Standalone. (#1743)
- API: Adds `Bookmark` and instance methods for managing bookmarks. (#2388)
- Fixes an issue where the background of ink annotations was not printed. (#2041)
- Fixes an issue where annotations with `strokeWidth` equal to `0` would have it set to `5` (#2454)

#### Core

- API: Adds `Annotations.StampAnnotation` for stamp annotations. (#2332)
- Forces asm.js on Safari 11. (#2361)
- Fixes form flattening with no fonts available leads to exported PDFs with empty fields. (#C17538)

#### Example

- Adds Typescript example. (#2394)
- Updates PSPDFKit for Electron example to Electron 3. (#2098)
- Fixes a layout issue in the PWA example. (#2351)

#### Instant

- Adds support for stamp annotations Instant. (#2332)
- Adds support for stamp annotations to Instant JSON. (#2332)
- Adds support for bookmarks Instant. (#2278)
- Adds support for bookmarks to Instant JSON. (#2278)

#### Documentation

- Adds search to our API documentation. (#2294)
- Removes `new` to construct `Immutable.List` types. (#2300)

### 2018.5.2 – 16 Nov 2018

#### UI

- Fixes broken PDF text parsing in Firefox, Edge, and IE 11. (#2473)

### 2018.5.1 – 10 Sep 2018

#### UI

- Adds public CSS class `PSPDFKit-Image-Annotation` for image annotations. (#2264)
- Improves usability for invalid image annotations. (#2266)
- Fixes a bug that allowed the use of PDFs for image annotations via the toolbar button. (#2262)
- Fixes an issue where the loading indicator for image annotations was shown in a wrong position. (#2260)
- Fixes an issue in Safari where blend modes were not applied to ink annotations while drawing them or changing their blend mode. (#2251)

#### Model

- Improves error messages for invalid image attachments. (#2259)
- Fixes an issue where some PDF pages could not be inserted as attachments for images. (#C16729)

### 2018.5 – 5 Sep 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-web-2018-5/)._

#### UI

- API: Adds new methods to control annotation presets: `Instance#annotationPresets`, `Instance#setAnnotationPresets`, and `PSPDFKit#defaultAnnotationPresets`. (#2077)
- API: Adds `Configuration#annotationPresets` and the `annotationPresets.update` event to make it possible to persist annotation presets. (#2077)
- API: Adds `ToolbarItem#preset` to create annotations with different presets. (#2077)
- API: Adds `Configuration#enableServiceWorkerSupport` to not bypass service workers when loading stylesheets. (#1963)
- API: Removes `InteractionMode.LAYOUT_CONFIGURATION`. (#1653)
- Adds support for image annotations. (#1202)
- Adds the document outline sidebar. (#2137)
- Adds the document annotations sidebar. (#2145)
- Adds new highlighter and arrow tool. (#2129)
- Adds support for vertical alignment of text annotations. (#1608)
- Adds persistence to user changes in the annotation toolbars by modifying its associated preset. (#2077)
- Adds public CSS classes for each button in the layout configuration option. (#2146)
- Adds `.PSPDFKit-Text-Markup-Annotation-selected` to match selected text markup annotations. (#2109)
- Improves performance of zooming and scrolling. (#2083)
- Fixes an issue where all squiggle annotations would inherit the same color of the last one created. (#2077)
- Fixes an issue where styles were not applied to widgets. (#1831)
- Fixes an issue where line caps were not being hidden in short lines. (#2147)
- Fixes an issue where some shape annotations were printed cropped. (#2149)
- Fixes an issue where relative URLs in CSS did not resolve correctly. (#1963)
- Fixes an issue where grouped toolbar buttons could not be disabled. (#2123)
- Fixes overflowing toolbar items are not visible. Now the toolbar can scroll horizontally. (#2189)

#### Model

- API: Adds `Annotations.ImageAnnotation` for image annotations. (#1202)
- API: Adds `OutlineElement` and `Instance#getDocumentOutline` to expose the document outline. (#2137)
- API: Adds `Instance#createAttachment` and `Instance#getAttachment` to create attachments that can be used for image annotations. (#2152)
- API: Adds `Annotations.InkAnnotation#isSignature` to indicate when an ink annotation was created as signature. (#2112)
- Fixes an issue where form fields imported via XFDF where not showing up Instant JSON. (#C16463)

#### Example

- Adds PWA (progressive web app) example. (#1996)
- Adds Vue.js example. (#2072)
- Updates dependencies of Webpack example. (#2099)

#### Instant

- Adds support for image annotations and attachments to Instant. (#1202)
- Adds support for image annotations and attachments to Instant JSON. (#1202)

### 2018.4.3 – 16 Nov 2018

#### UI

- Fixes broken PDF text parsing in Firefox, Edge, and IE 11. (#2473)

### 2018.4.2 – 24 Aug 2018

#### Model

- Fixes an issue with XFDF on rotated pages. (#2158)

### 2018.4.1 – 31 Jul 2018

#### UI

- Adds option to specify the number of password retries. (#2067)
- Adds `PSPDFKit-Annotation-Widget-read-only` as public CSS class. (#1646)
- Improves text selection behavior when there is padding between the individual text lines. (#2090)
- Changes `PSPDFKit.unload()` to be idempotent if a DOM element is passed without PSPDFKit for Web being mounted. (#2076)
- Fixes an issue where pinching zoomed the whole viewport. (#2070)
- Fixes an issue where locale does not attempt to fallback. (#2078)
- Fixes an issue with clipping annotations to the page. (#2075)
- Fixes an issue where the viewport was too large when zoomed in. (#2086)
- Fixes an issue where the text was not updated when changing the locale. (#2031)
- Fixes an issue with custom CSS on Firefox. (#2104)
- Fixes an issue with a missing translation. (#2092)
- Fixes an issue with unnecessary custom overlay items re-rendering. (#2107)

### Core

- Improves setup experience by adding better error messages. (#2085)

### 2018.4 – 12 Jul 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-web-2018-4/)._

#### UI

- Adds support for blend modes on Ink and Markup Annotations. (#1878)
- Adds support for shape annotations: line, rectangle, ellipse, polyline and polygon. (#1203)
- Adds public CSS classes for the Layout Config toolbar item and dropdown for easy styling. (#2064)
- Improves style of disabled buttons. (#1920)
- Changes the order of `PSPDFKit.defaultToolbarItems`. (#2039)
- Fixes a rendering issue that resulted into blurry pages at certain zoom levels. (#1824)
- Fixes an issue with IE 11 when editing text annotations. (#1958)
- Fixes an issue with IE 11 where pasted text got duplicated. (#1850)
- Fixes a bug where annotations where immediately draggable when using the `setSelectedAnnotation` API method. (#1969)
- Fixes a regression where form fields were read-only when the document permissions didn't permit modification. (#1976)
- Fixes an issue where setting the ViewState threw an Error when in read-only mode. (#1952)
- Fixes an issue where forms were not enabled when document permissions didn't permit modifying annotations and forms. (#1999)
- Fixes an issue when changing the properties of an ink annotation before drawing the first line when Instant is disabled. (#2004)
- Fixes an issue where annotation toolbars and some toolbar buttons included `undefined` as class name. (#2013)
- Fixes an issue with long text overflowing in the layout configuration dropdown. (#2023)
- Fixes an issue where the delete icon in the annotation toolbar was visible although the annotation was not created yet. (#2043)
- Fixes an issue where the text-align icon was not correct. (#2042)
- Fixes an issue with forms not rendering in standalone when rotating pages. (#2057)
- Fixes an issue which prevented scrolling modals on mobile. (#2046)

#### Model

- API: Removes deprecated `Instance#renderCover`. (#1431)
- Fixes an issue where the default `Annotation#name` was sometimes out of sync with `Annotation#id`. (#1980)
- Fixes an issue where annotation changes made via the API where not automatically saved to the server when Instant is disabled. (#2005)
- Fixes an issue where invalid annotations crash the application. (#2004)
- Fixes an issue where the Instant Document JSON returned a permanent but no changing PDF ID. (#1847)

#### Example

- Fixes a bug in the Rails example, where restarting the example container did not work. (#1971)

#### Instant

- Fixes an issue where the annotation payload for Instant was including unnecessary information. (#1980)

### 2018.3.3 – 16 Nov 2018

#### UI

- Fixes broken PDF text parsing in Firefox, Edge, and IE 11. (#2473)

### 2018.3.2 – 20 Jun 2018

#### UI

- Fixes a regression where readOnly form fields where not properly disabled. (#1921)
- Fixes an issue with selection grippers not working on Windows touch devices. (#1925)
- Fixes an issue with contextual menus overlap the text markup annotation popover on some touch devices. (#1925)
- Fixes an issue where creating an ink annotation with a background color caused the page content to disappear. (#1916)
- Fixes an issue with stylesheets not being cached by a user defined service worker. (#1928)

#### Model

- Fixes an issue with the newly introduced `isFitting` property for text annotations. (#C15597)
- Fixes an issue where search did not work in IE 11 when using standalone. (#1883)
- Fixes an issue with all the custom overlay items for a page being removed in bulk. (#1942)

### 2018.3.1 – 4 Jun 2018

#### UI

- API: Adds `Configuration#disableIndexedDBCaching` to force disable caching of the WASM module when IndexedDB is supported. (#1905)
- API: Adds `Configuration#disableWebAssemblyStreaming` to force disable WebAssembly streaming instantiation. (#1907)
- API: Adds `Configuration#standaloneInstancesPoolSize` to configure the number of disposed instances to keep in memory for fast reuse. (#1908)
- Fixes an issue where forms were not rendered as read only when the server's `write` permission was not set. (#1870)

#### Model

- Fixes a crash when setting the `interactionMode` and enabling `readOnly` mode at the same time. (#1901)

#### Instant

- Adds annotation `note` to Instant JSON. (#C15404)

### 2018.3 – 31 May 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-web-2018-3/)._

#### UI

- API: Adds `PSPDFKit.Annotations.toSerializableObject` and `PSPDFKit.Annotations.fromSerializableObject` to convert annotations to and from serializable objects which adhere to the InstantJSON format. (#1704)
- Adds support for touch events on desktop browsers. (#1459)
- Adds support for ink signatures. (#1704)
  - API: Adds `Instance#getInkSignatures` to retrieve the list of ink signatures.
  - API: Adds `Instance#setInkSignatures` to set or update the list of ink signatures.
  - API: Adds `Configuration#populateInkSignatures` to load the initial list of ink signatures.
- Adds public CSS classes to Link Annotations for easy styling. (#1860)
- Improves the file size of the required style sheet. (#1795)
- Improves rendering performance when resizing the sidebar and when switching between page modes. (#1859)
- Fixes an with responsive toolbar groups including items from other groups. (#1784)
- Fixes responsive behavior of the text annotation toolbar. (#1800)
- Fixes a regression when copying text on IE 11. (#1454)
- Fixes an issue where multi line text widgets that have an automatic text size had a font size that was too big. (#1844)
- Fixes opacity of Text Annotations in editable mode. (#1799)
- Fixes an issue where opacity was being doubled on editing mode text annotations. (#1799)

#### Model

- Adds a new annotation event: `annotations.load` that is triggered whenever annotations are loaded from the underlying data source. This was previously firing `annotations.create`. (#1690)
- Adds support for `fontSize` property on widget annotations. (#1747)
- Adds `Annotation#name` to all annotation records. This will default to the annotation identifier to mimic the behavior of our other platforms. (#C14856)
- Adds support for dynamic code loading to reduce bundle size. (#1755)
- Adds new instance events for ink signatures: `inkSignatures.create`, `inkSignatures.update`, `inkSignatures.delete`. (#1704)
- Adds support for password protected PDFs. (#1632)
- Fixes an issue where the loading of the initial annotations would not cause an event to be triggered when using Instant. (#1690)
- Fixes an issue with the `ViewState` API which allowed to change `InteractionMode` when the document was in read only mode. (#1838)
- Fixes an issue where the text of a TextAnnotation in the generated PDF was cut off. (#1275)
- Fixes a race condition when trying to use `Instange#getAnnotations` for a page that is loading its annotations. (#1871)

#### Instant

- Adds annotation `name` to Instant JSON. Also renamed `pspdfkit/file` `name` to `filename` to prevent collisions. (#C14856)
- Adds `isFitting` to text annotations in Instant JSON. This property is used to correctly display the annotation in environments where the annotation's font is not available. (#977)

#### Example

- Adds support for simple layer authentication to the Node.js example app. (#1817)
- Improves experience for Windows users for all example applications. (#1857)
- Update React and Webpack example apps to work with the new `pspdfkit-lib` asset directory. (#1826)
- Fixes an issue with the wrong mime types in the React example app. (#1825)

### 2018.2.2 – 16 Nov 2018

#### UI

- Fixes broken PDF text parsing in Firefox, Edge, and IE 11. (#2473)

### 2018.2.1 – 2 May 2018

#### UI

- Fixes an issue with responsive toolbar groups including items from other groups. (#1784)
- Fixes missing translation in search UI. (#1791)

#### Model

- Fixes an issue where forms where not properly loaded when starting in read only mode. (#1794)

### 2018.2 – 28 Mar 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-web-2018-2/)._

#### UI

- API: Adds `Configuration#disableTextSelection` to disable text selection and `Configuration#disableHighQualityPrinting` to disable high quality printing. (#1424)
- API: Adds `Instance#getTextSelection()` and a new event `textSelection.change` to access the text selection state. (#1724)
- API: Adds `page.onPress` and `textLine.onPress` events to control clicks in the document. (#1724)
- API: Adds `Instance#jumpToRect()` to make sure a specific rect (in PDF page coordinates) is brought into the viewport. (#1750)
- API: Adds ability to create and add custom overlay items to the document. (#1709)
  - API: Adds `Instance#setCustomOverlayItem()` to create and update a custom overlay item.
  - API: Adds `Instance#removeCustomOverlayItem()` to remove a custom overlay item.
  - API: Adds `PSPDFKit.CustomOverlayItem` - a record to create custom overlay items.
- API: Adds I18n (internationalization) support. (#1732)
  - API: Adds `PSPDFKit.I18n` to access and modify internationalization data. (#1732)
  - API: Adds `Instance#locale` and `Instance#setLocale` to manage the application locale. (#1732)
- API: Adds support for customizing the search behavior. (#1739)
  - API: Adds `Instance#searchState`, `Instance#setSearchState()`, and `PSPDFKit.SearchState` to control the state of the search UI.
  - API: Adds `Instance#startUISearch()` as a shortcut to show the search box, type in a search term, and start the default search behavior.
  - API: Adds new search events: `search.stateChange` will be fired whenever `PSPDFKit.SearchState` updates, `search.termChange` will be fired whenever the user changes the search term.
- API: Adds `Instance#getSelectedAnnotation()`, `Instance#setSelectedAnnotation()`, and the event `annotationSelection.change` to interact with the currently selected annotation. (#1562)
- Adds PSPDFKit for Electron. (#1758)
- Adds I18n (internationalization) support. (#1732)
- Adds a customizable confirm dialog instead of using `confirm()`. (#1670)
- Adds support for iOS 11.3. (#1746)
- Improves rendering performance on low resolution and mobile devices. (#1727)
- Changes the breakpoint for showing note annotation contents in full screen. (#1783)
- Fixes ToolbarItems with not unique IDs render multiple times on resize. (#1728)
- Fixes an issue with an invalid cursor for the pan tool on Internet Explorer 11. (#1777)
- Fixes an issue where the wrong toolbar items where shown quickly after closing the native print dialog. (#1734)
- Fixes an issue with the layout of slider inputs on Microsoft Edge and Internet Explorer 11. (#1775)
- Fixes a rendering issue when using standalone deployments and rotated pages on WebKit. (#1778)

#### Model

- Adds support for parsing `GoToEmbeddedAction`, `GoToRemoteAction`, `HideAction`, `JavaScriptAction`, `LaunchAction`, and `NamedAction`. (#1736)
- Adds `Instance#setAnnotationCreatorName()` to set the annotation creator name and `Annotation#creatorName` , `Annotation#createdAt`, and `Annotation#updatedAt` to an annotation. (#1714)
- Adds `Instance#search()` to find occurrences of a text string in the raw PDF. (#1739)
- Adds `PSPDFKit.SearchResult` to describe a search result. (#1739)
- Adds `Instance#renderPageAsArrayBuffer` to render a page as an `ArrayBuffer`. (#1431)
- Adds `Instance#renderPageAsImageURL` to render a page and get a URL to it. (#1431)
- Adds `Instance#getMarkupAnnotationText` to extract the text from markup annotations. (#1705)
- Adds validation for annotations created and/or updated via public API. (#1731)
- Improves `Instance#getAnnotations` to throw an error, when called with invalid arguments. (#1781)
- Fixes an issue in our WASM regression detection for iOS 11.2.6. (#1745)
- Fixes an issue with `exportXFDF` not preserving the document state. (#1768)
- Deprecates `Instance#renderCover`. (#1431)

#### Example

- Adds the new PSPDFKit for Electron example. (#1758)

#### Instant

- Adds createdAt, updatedAt and creatorName to Instant JSON. (#C14443)

### 2018.1.5 – 16 Nov 2018

- Fixes broken PDF text parsing in Firefox, Edge, and IE 11. (#2473)

### 2018.1.4 – 15 Mar 2018

No web-specific changes in this version.

### 2018.1.3 – 8 Mar 2018

- Fixes an issue where the wrong toolbar items where shown quickly after closing the native print dialog. (#1734)
- Fixes an issue in our WASM regression detection for iOS 11.2.6. (#1745)

### 2018.1.2 – 28 Feb 2018

- Adds support for automatically extracting links from text. (#C13944)
- Significantly reduces the memory usage for Standalone deployments. (#1453)
- Fixes clients presence connections failures that were not handled. (#1723)

### 2018.1.1 – 14 Feb 2018

- Fixes sidebar button not selected when the sidebar is open. (#1712)

### 2018.1 – 8 Feb 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-web-2018-1/)._

- API: Adds support for rotating pages in the current view. (#1621)
  - API: Adds `ViewState#pagesRotation` to set the currently applied rotation.
  - API: Adds `ViewState#rotateLeft()` and `ViewState#rotateRight()` to rotate the current view by 90° clockwise or counterclockwise.
- API: Adds a new toolbar item `sidebar-thumbnails`. (#1614)
- API: Adds `ViewState#sidebarMode` to control the sidebar. (#1614)
- Adds support for rotating pages. (#1621)
- Adds support for importing and exporting XFDF. (#1651)
- Adds support for exporting Instant JSON on server setups. (#1662)
- Adds support for grouped checkbox form fields. (#1689)
- Adds WASM streaming initialization and caching for supported browsers. (#1644)
- Adds more runtime type checks to the `ViewState` API. (#1655)
- Adds sidebar for page thumbnails previews. (#1614)
- Adds keyboard shortcuts to change page using the left and right arrow keys. (#1666)
- Adds support for the `NoView` flag for all supported annotations. (#1683)
- Fixes a WASM regression on iOS 11.2.2 and 11.2.5 by disabling WASM support on these particular versions. (#1650)
- Fixes a bug where opening the `layout-config` menu will hide new ink drawings. (#1652)
- Fixes an issue where unchecked checkboxes were not properly exported. (#1673)
- Fixes a bug where pages were briefly rendered in the browser while printing. (#1678)
- Fixes keyboard shortcuts work in combination with `shift` key. (#1696)

### 2017.9.4 – 24 Jan 2018

No web-specific changes in this version.

### 2017.9.3 – 17 Jan 2018

- Fixes an issue when opening a PDF using the RESTProvider and a license without forms. (#1612)
- Fixes an issue when deleting an annotation using the RESTProvider. (#1635)
- Fixes a bug preventing client presences to be updated. (#1618)
- Fixes full screen keyboard shortcut instead open search. (#1609)
- Fixes incorrect text lines in some documents. (#C13148)
- Fixes an assertion when a non-specified named action was deserialized via Instant JSON. (#C13804)
- Fixes `PrintMode.EXPORT_PDF` not working in Edge and IE 11 for Standalone deployments. (#1640)

### 2017.9.2 – 20 Dec 2017

- Fixes permission compatibility with server. (#1601)
- Fixes `setFormFieldValue` sending malformed payload to the server. (#1599)

### 2017.9.1 – 15 Dec 2017

- Fixes an issue where trial licenses did not have the form license flag set. (#C13553)

### 2017.9 – 14 Dec 2017

_See the [announcement post](https://pspdfkit.com/blog/2017/pspdfkit-web-2017-9/)._

- API: Adds support for programmatic form filling. (#936)
  - API: Adds `Instance#getFormFields()` to access form fields.
  - API: Adds `Instance#getFormFieldsValues()` and `Instance#setFormFieldsValues()` to easily access the current form field values.
  - API: Adds `WidgetAnnotation` to the annotation API. This annotation can never be modified and is used to render form fields.
  - API: Adds `SubmitFormAction` and `ResetFormAction`. The submit action will also fire `forms.willSubmit` and `forms.didSubmit`, respectively.
- API: Adds a new toolbar item type, `responsive-group`. This can be used to create groups of toolbar items for smaller screens. (#1412)
- Adds support for interactive forms. (#936)
- Adds support for filling forms via Instant. (#936)
- Adds a responsive mode to the toolbar. Annotation tools are now by default grouped under an “Annotate” option on small screens. (#1412)
- Adds headless mode to run PSPDFKit for Web without a user interface. (#1534)
- Fixes an error in Instant when two clients edit text annotations simultaneously. (#1522)
- Fixes flickering of the note annotation popover when a note annotation is selected. (#1363)
- Fixes an issue where default colors for highlight annotations were not rendered properly. (#C12938)

### 2017.8.1 – 6 Dec 2017

No web-specific changes in this version.

### 2017.8 – 22 Nov 2017

- Changes annotation IDs from numerical to client-side generated string IDs. (#1303)
- Fixes a bug that prevented text selection starting from non-text nodes. (#1492)
- Fixes impossible to deselect text. (#1492)
- Fixes canceled text lines requests in standalone resolve anyway. (#1506)
- Fixes an issue with Instant on documents without the `edit-annotations` permission. (#1451)

### 2017.7.1 – 15 Nov 2017

- Improved memory management for standalone deployments. (#1453)
- Fixes `getBaseUrl` removes part of the url in IE. (#1456)
- Fixes copied text includes new lines in Firefox and IE. (#1463)

### 2017.7 – 25 Oct 2017

_See the [announcement post](https://pspdfkit.com/blog/2017/pspdfkit-web-2017-7/)._

- API: Adds `PSPDFKit.unload` to terminate running and loading instances in favor of the now deprecated `Instance#destroy`. (#1389)
- API: Adds new CSS classes to select annotations. (#1414)
- API: Adds new CSS class to select text. (#1406)
- API: Adds option to specify a `pageIndex` to the `Instance#renderCover` standalone API. (#1404)
- API: Adds option to disable WebAssembly when using standalone deployments. (#1416)
- API: Adds new `contentWindow` and `contentDocument` getters to the `Instance` to quickly access the content of the PSPDFKit viewer. (#1439)
- API: Adds API for printing and introduces printing modes. (#1319)
- API: Fixes the casing in CSS class names of specific note annotation icons to be more consistent. (#1414)
- Adds new printing mode `DOM`. This method will render all pages of the PDF document in advance before it sends the results to the printer. (#1319)
- Adds a new icon set for all toolbar items. (#1413)
- Adds pinching for touch devices in `PER_SPREAD` scroll mode. (#1315)
- Improved support for Apple Pencil. (#1415)
- Improved WebAssembly/asm.js loading time of subsequent initializations. (#1390)
- Fixes an issue where an Instant sync conflict was causing an invalid state. (#1347)
- Fixes an issue with the transition of note annotation popovers. (#1388)
- Fixes an issue that sometimes prevented the text caret to be drawn in IE 11 and Edge. (#1395)
- Fixes the position of the initial text caret on Safari. (#1396)
- Fixes a rendering issue that resulted into a blurry pages when using standalone deployments. (#1261)
- Fixes the spacing of color picker items in responsive mode. (#1414)
- Fixes an issue that emitted the wrong payload with the `annotations.delete` event. (#1423)
- Fixes an issue that caused a crash when the page index of an annotation was out of bounds. (#1397)
- Fixes an issue that prevent toolbar items from being disabled via the API. (#1432)

### 2017.6.1 – 2 Oct 2017

- Adds support for Internet Explorer 11 when using standalone deployments. (#C11782)
- Improves read-only mode for note annotations. (#1360)
- Improves error messages when invalid JWT token is supplied. (#1379)
- Changes the default breakpoint for the `layout-config` toolbar item. (#1364)

### 2017.6 – 18 Sept 2017

_See the [announcement post](https://pspdfkit.com/blog/2017/pspdfkit-web-2017-6/)._

- API: `ViewState#pageSpacing` is now used for the spacing between pages in `LayoutMode.DOUBLE`. For the previous behavior, please use `ViewState#spreadSpacing` instead.
- API: Deprecates `ViewState#viewMode` and adds `ViewState#layoutMode` and `ViewState#scrollMode`. (#1272)
- API: Renames `ZoomMode.PAGE_FIT` and `ZoomMode.PAGE_WIDTH` to `ZoomMode.FIT_TO_VIEWPORT` and `ZoomMode.FIT_TO_WIDTH`. (#1277)
- API: Adds `ViewState#keepFirstSpreadAsSinglePage` to start with a single page in `LayoutMode.DOUBLE`. (#737)
- API: Adds `Instance#textLinesForPageIndex` to extract text content of a page. (#1302)
- Adds double page mode for both scroll modes. (#737)
- Adds support for zooming and scrolling in `PER_SPREAD` scroll mode. (#1285)
- Adds pagination by using the mouse scroll wheel in `PER_SPREAD` scroll mode. (#1285)
- Adds support for Note annotations. (#1235)
- Improves error messages for some APIs. (#1304)
- Improves performance when opening a big PDF with many annotations. (#1304)
- Improves user experience while rendering pages. (#1301)
- Fixes an issue where annotations imported via Instant JSON could no longer be updated or deleted. (#1312)
- Fixes an issue where the zoom level was not properly recalculated, when the viewport dimensions changed. (#1310)
- Fixes an issue with printing still working after being disabled via API. (#1324)
- Fixes an issue where an error was logged when refreshing the browser. (#1329)
- Fixes errors that ocurred when the root element was removed from the DOM, before the viewer finished loading. (#1328)
- Fixes a race condition that could occur when syncing annotations. (#1343)

### 2017.5.4 – 31 Aug 2017

No web-specific changes in this version.

### 2017.5.3 – 17 Aug 2017

- Fixes an issue with Chrome that prevented the document from rendering in certain environments. (#1293)

### 2017.5.2 – 9 Aug 2017

- Improves backoff behavior of Instant endpoint when an error occurs. (#1249)
- Fixes an issue where zooming in or out when text is selected caused a wrong popover position. (#1269)
- Fixes Safari/IE 11 not including request headers for tiles request. (#1283)
- Fixes `exportPDF` flattens by default converting annotations to non-editable content. We made it configurable. (#1276)
- Fixes an issue where a floating point font size for a text annotation causes two options with the same value in the dropdown list. (#1284)

### 2017.5.1 – 24 Jul 2017

- Improves standalone rendering speed. (#1243)
- Improves error logging in some cases. (#1251)
- Fixes the default save mode when using standalone deployments. (#1257)
- Fixes an issue with Edge when using standalone deployments. (#1250)

### 2017.5 – 20 Jul 2017

_See the [announcement post](https://pspdfkit.com/blog/2017/pspdfkit-web-2017-5/)._

- API: Adds `Configuration#pdf` to load a PDF for client side rendering via an `URI` or an `ArrayBuffer`. (#966)
- API: Adds ability to create, read, update, and delete annotations as well as an API to observe annotation changes. (#937)
- API: Adds event before and after the annotations are saved. (#1150)
- API: Expose annotation interfaces (`Annotation`, `HighlightAnnotation`, `InkAnnotation`, `LinkAnnotation`, `SquiggleAnnotation`, `StrikeOutAnnotation`, `TextAnnotation`, `MarkupAnnotation` `UnderlineAnnotation`, `UnknownAnnotation`). (#1049)
- API: Exposes new primitives types (`Immutable.List`, `Geometry.Point`, `Geometry.DrawingPoint`, `Geometry.Rect`, `Geometry.Size` and `Color`). (#1031)
- API: Exposes PDF action types (`Actions.GoToAction`, `Actions.URIAction`). (#1037)
- API: Supports different save modes and adds ability to save annotations manually. (#964)
- API: Renames `viewstatechanged`, `currentpageindexchanged`, `zoomchanged` and `connectedclientschanged` events. (#1151)
- API: Adds `Instance#hasUnsavedAnnotations` to find out if unsaved annotations are present. (#1152)
- API: Adds `Instance#exportPDF` to access the raw PDF binary data as `ArrayBuffer`. (#1163)
- API: Adds `Instance#exportInstantJSON` and `Configuration#instantJSON` to serialize and deserialize the document state including all annotations using Instant JSON when no server is present. (#1158)
- API: Adds `Instance#renderCover` to render the first page as a thumbnail for client side rendering. (#1178)
- API: Allow to override onPress handlers for annotations. (#1175)
- API: Allow to overwrite the inferred base url for the Server in case the JavaScript is loaded from a different host. (#1185)
- Adds support for client side rendering using WebAssembly (wasm) or asm.js. Please visit our guides for more information. (#966)
- Adds support for bundling PSPDFKit for Web using an npm package. (#1098)
- Improves pinching performance on mobile devices. (#1085)
- Improves performance of tile rendering. (#1125)
- Fixes zoom buttons should only be hidden for touch devices. (#1077)
- Fixes error in the Custom Toolbar when `mediaQueries` is set to `undefined`. (#1080)
- Fixes cleanup of event listeners when drawing ink annotations. (#1061)
- Fixes a bug that caused Safari on iOS to trigger the default zoom behavior on double tap. (#859)
- Fixes an issue with `babel-polyfill`. (#1108)
- Fixes issue when quickly jumping through search results. (#1078)
- Fixes prevent text annotation to increase page size when created at the edge. (#1130)
- Fixes sliders' thumb position for Edge. (#1136)
- Fixes sliders' vertical alignment in IE 11. (#1136)
- Fixes an issue where the initial viewport size was wrong. (#1240)
- Fixes link annotations not clickable when in read-only mode. (#1242)

### 2017.4 – 16 May 2017

_See the [announcement post](https://pspdfkit.com/blog/2017/pspdfkit-web-2017-4/)._

- API: Adds ability to customize and add new items to the main toolbar. (#1048)
- API: Adds new option `interactionMode` to `ViewState` to enable ink, text, search and pan mode. (#1003)
- API: Adds `version` to `PSPDFKit` to get the current version of PSPDFKit for Web. (#1047)
- Adds support for interacting with all annotation types (ink, text, highlight, squiggle, underline, strike-through, and link) on mobile devices. (#906)
- Adds a special annotation toolbar that appears when text is selected to allow the creation of markup annotations on mobile devices. (#1060)
- Adds pan tool to allow users to navigate on a desktop browser using mouse dragging. (#887)
- Improves the scrolling performance in Chrome browsers when an ink annotation is inside the viewport. (#616)
- Improves tiling by avoiding unnecessary calculations. (#1000)
- Improves ink annotation creation on different pages. (#985)
- Improves logging and descriptiveness of messages for errors in HTTP APIs. (#S1078, #S1110)
- Fixes issues with empty text annotations. (#821)
- Fixes an issue with text annotations that get dragged while they're changed. (#980)
- Fixes a bug that prevented the focus of the text annotation after clicking on it. (#1013)
- Fixes a bug that caused a wrong initial text selection within a text annotation. (#929)
- Fixes a bug that caused an exception when destroying the PSPDFKit for Web instance on IE 11. (#1034)
- Fixes the centering of the content inside the viewport. (#998)
- Fixes a bug where delete annotation can delete pdf assets. (#S1117)

### 2017.3.2 – 19 Apr 2017

- Adds CSS class for unsupported annotations and hides them by default. (#991)
- Fixes a bug where the `user_id` of the user performing a change was not always persisted. (#S1083)

### 2017.3.1 – 12 Apr 2017

- Adds a new license information page to the dashboard. (#S1074)
- Adds `cmd+g` and `cmd+shift+g` keyboard shortcuts to jump to the next/previous search result (macOS only). (#961)
- `load()` will now throw if the `container` element has children. (#957)
- Fixes buggy behavior in Firefox where the user needs to press backspace twice to start to delete from the end of a text annotation. (#974)
- Fixes a bug in Firefox where a NO-BREAK SPACE was inserted after the first line break. (#976)
- Fixes a bug when switching annotation modes. (#818)

### 2017.3 – 29 Mar 2017

_See the [announcement post](https://pspdfkit.com/blog/2017/pspdfkit-web-2017-3/)._

- API: Adds option to enable read only mode. (#886)
- API: Adds option to hide annotations. (#886)
- API: Custom style sheets must now be set through the JavaScript API. (#630)
- API: Adds option to hide the print icon to `ViewState`. (#845)
- API: Adds many new public CSS classes. (#733)
- API: Adds documentation for `load()`. (#839)
- Adds support for printing documents. (#845)
- Adds new AUTO zoom mode for a better default experience. (#741)
- Adds support for flattening annotations into the PDF before it is downloaded. (#S1026)
- Adds support for permissions to selectively enable/disable viewing and editing features. These replace the old access control based on the `access` and `user_id` fields. (#S1031)
- Prevents CSS conflicts by encapsulating the viewer. (#630)
- Enforces `document_id` to be type of `string` in the JWT. (#824)
- Updates the format of the JWT used for authentication. (#S1031, #S1043)
- Removes border of link annotations. (#882)
- Fixes an error for Chrome >= 56 that was caused by Chrome making event handlers passive per default. (#792)
- Fixes z-index ordering for some annotations to prioritize newer ones. (#746)
- Fixes an issue that prevented dragging annotations in IE 11. (#870)
- Fixes an issue with editing a text annotation after reloading. (#852)

### 2017.2 – 17 Feb 2017

_See the [announcement post](https://pspdfkit.com/blog/2017/pspdfkit-web-2017-2/)._

- API: The server will now always return and expect string document IDs. (#808)
- Adds HTTP API for working with annotations.
- Adds a debug mode to track down issues during development. (#760)
- Adds shortcuts to zoom in, out and back to page-fit.
- Shows toolbar when starting to create an ink or text annotation. (#801)
- Improves read-only mode. (#761)
- Improves the contrast of resize anchors. (#751)
- Improves the Dashboard experience.
- Search now also appears via CMD-G on macOS. (#758)
- Fixes an issue that sends an invalid search request. (#756)
- Fixes an issue where parts of the annotation toolbar disappeared. (#647)
- Fixes an issue with hidden toolbar buttons. (#794)

### 2017.1 – 25 Jan 2017

_See the [announcement post](https://pspdfkit.com/blog/2017/pspdfkit-web-2017-1/)._

- Adds search. (#722)
- Adds custom dropdown to preview fonts. (#413)
- Optimizes ink annotations. (#590)

### 2016.3 – 21 Dec 2016

_See the [announcement post](https://pspdfkit.com/blog/2016/pspdfkit-web-2016-3/)._

- Adds a dashboard for easy control over the server.
- Shows a font's name in the dropdown even if the font is not available. (#665)

### 2016.2.1 – 12 Dec 2016

- Fixes an issue with external events. (#699)

### 2016.2 – 8 Dec 2016

- Adds support for Internet Explorer 11. (#676)
- Removes white space after the last page on Firefox for Android. (#651, #652)
- Fixes an issue with text annotation clipping on Edge. (#644)
- Fixes an issue with PDF documents that have fractional page dimensions. (#660)
- Fixes an issue with the AnnotationToolbar position. (#661)

### 2016.1 – 1 Dec 2016

_See the [announcement post](https://pspdfkit.com/blog/2016/pspdfkit-for-web/)._

- First public release.
