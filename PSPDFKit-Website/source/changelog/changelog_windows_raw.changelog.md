## Newest Release

### 2.6.0 - 20 Feb 2020

_See the [announcement post](https://pspdfkit.com/blog/2020/pspdfkit-windows-2-6/)._

* Adds support for digital signatures. (#23069)
* Adds support for regular expression search option. (#22935)
* Adds property to PrintHelper for defining the default media size. (#23012)
* Adds fullscreen example to Toolbar in example Catalog app. (#23020)
* Fixes an issue where CompareOptions combinations failed to match. (#22935)
* Fixes an issue with loading PDFs from URIs. (#22731)
* Fixes issue where calculating glyphs could except with certain PDFs. (#23051)

#### Model

* Adds support for incrementally saving encrypted documents. (#22722)
* Improves license check error message to be more user friendly. (#12904)
* Fixes a problem where some PDF pages may not be rendered correctly. (#22767)
* Fixes a rare problem where the application may terminate unexpectedly after loading a document or setting a form field value. (#22924)
* Fixes an issue that caused a blank page after flattening annotations on a certain document. (#22279)
* Fixes an issue where characters weren't escaped correctly when exporting XFDF. (#22844)
* Fixes an issue where opening a certain document with form fields caused a crash. (#23001)
* Fixes an issue where popup annotations were positioned incorrectly. (#22730)
* Fixes an issue where some PDF JavaScript calculations may not work correctly. (#23043)
* Fixes an issue where text on form fields is occasionally rendered with incorrect rotation on rotated pages. (#22854)
* Fixes an issue where the file size optimization algorithm didn't run. (#22809)
* Fixes an issue where the mailDoc and similar JavaScript functions may not parse their arguments correctly. (#23257)
* Fixes an issue with creating a Submit Form action from JSON without action flags. (#22784)
* Fixes an issue with form calculations if one of the form fields contained multiple form elements. (#22675)
* Fixes empty text form fields not rendering their background color. (#23263)

### 2.5.4 - 17 Feb 2020

* Updated Catalog demo license. (#23355)

### 2.5.2 - 17 Dec 2019

* Adds option to trim punctuation when generating words from glyphs. (#22489)
* Fixes an issue where bookmark deletion event was not fired. (#22564)
* Fixes an issue with Document.Modified not being reset after export. (#22603)
* Fixes an issue with some memory intensive documents and the Document Editor. (#22494)

#### Model

* Improves complex script text rendering. (#22573)
* Improves font selection and prefers fonts already in the document in more cases. (#22530)
* Improves the performance of the redaction component so that big documents are redacted quicker. (#22102)
* Updates Duktape to version 2.5.0. (#22476)
* Fixes an issue where a form field element appearance stream was regenerated accidentally. (#21618)
* Fixes an issue where text is not displayed in small freetext annotations. (#22514)

### 2.5.0 - 22 Nov 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-windows-2-5/)._

* Added ability to control if individual annotations are editable. (#15714)
* Added ability to limit the set of editable annotation types. (#20673)
* Added method for calculating Words from Glyphs. (#22307)
* Fixes an issue where flattening should override incremental save. (#22094)
* Fixes an issue where resetting a PdfView would fail. (#16037)
* Fixes an issue with freeform rotated annotation rendering. (#22342)
* Fixes issue with IntelliSense documentation. (#22393)

#### Model

* Improves memory usage while searching document with a lot of annotations. (#22367)
* Improves the rendering of annotations with dashed borders. (#10216)
* Increases image size limits. (#22029)
* Fixes ISO8601 timezone support in instant json. (#21148)
* Fixes a crash related to multi-threading and font loading. (#22387)
* Fixes an issue if a TrueType font collection has more than 32 fonts. (#22148)
* Fixes an issue where annotation additional actions may not be deserialized correctly. (#21983)
* Fixes an issue where certain high resolution images weren't rendered. (#22322)
* Fixes an issue where deleting or moving pages from a PDF did not update the outline. (#21620, #22048)
* Fixes an issue where form repairs were done too eagerly. (#20786)
* Fixes an issue where some filled form fields may not show their content correctly. (#22100)
* Fixes an issue where some properties of a widget annotation were not persisted when the document was saved. (#21546)
* Fixes an issue where text entered in certain form fields was rendered garbled. (#21700)

### 2.4.2 - 24 Oct 2019

* Implements offical workaround from Microsoft for their Store issues. (#22042)
* Fixes an issue with setting passwords and DataProviders. (#22034)

### 2.4.1 - 22 Oct 2019

* Fixes an issue with some licenses and forms. (#21985)

### 2.4.0 - 17 Oct 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-windows-2-4/)._

* Adds support for pinch-to-zoom gestures on touch screens. (#15426)
* Adds support for navigating pages by tapping the left and right parts of the background in PER_SPREAD scroll mode. (#3658)
* Adds double tap to zoom support when using touch screens. (#1384)
* Adds support for JavaScript in PDF documents to the PdfView (disabled by default). (#21227)
* Adds CloudyBorderInset property to Rectangle, Ellipse and Polygon annotations. (#21896)
* Adds AES encryption example to the Catalog app. (#21286)
* Adds Pivot example to example Catalog app. (#21223)
* Adds ability to Ink.SetBoundingBoxAndResizeLines to maintaining aspect ratio. (#21906)
* Adds bitmap format and alpha mode options to rendering methods. (#21183)
* Adds support for rotation to widget annotations. (#3114)
* Improved exception message for when PdfView is not finished initializing. (#21158)
* Improved exception messages for uninitialized SDK. (#21407)
* Improves tiling experience by avoiding temporary blurriness when zooming in and out. (#3654)
* Rotation class moved into PSPDFKitFoundation namespace. (#21641)
* Fixes an issue when saving some newly created annotations. (#21490)
* Fixes an issue with escaped characters. (#21255)
* Fixes an issue with password changes when flattening. (#21634)
* Fixes a possible crash when loading annotations failed in certain Instant documents. (#21617, Z#15606)
* Fixes an issue getting outline element by GoTo page. (#21623)
* Fixes an issue with transparent strokeColor in Instant JSON. (#21391)
* Fixes issue with occasional invisible selection handles. (#19413)
* Fixes support for Hololens. (#21676)
* Fixes an issue where hovering over a note annotation would render the tooltip of a different, currently selected annotation. (#3697)

#### Model

* Improves font rendering and fixes several edge cases. (#20930)
* Improves memory usage on complex documents. (#20970)
* Improves the stability of some PDF form operations. (#21032)
* Strengthens the validation of InstantJSON format in some corner cases. (#20748)
* Updates Botan to version 2.11.0. (#20549)
* Updates Duktape to version 2.4.0. (#20954)
* Updates HarfBuzz to version 2.6.2. (#21686)
* Fixes a crash when using the processor on certain documents with very deep object hierarchies. (#21674)
* Fixes a performance regression when rendering with an ICC based color space. (#21776)
* Fixes a possible crash in certain documents due to a null dereference in `PDFC::Forms::FormCorePDFBackend::isLinkedInAcroForms`. (#21121)
* Fixes a problem where some PDF images may be missing in some documents. (#21353)
* Fixes a rare deadlock when rendering certain documents. (#21856)
* Fixes a rare situation where setting form field flags may cause a deadlock. (#19942)
* Fixes a regression that caused certain link annotations to not work. (#21709)
* Fixes a rendering error where the font `ArialMT` wasn't selected correctly. (#21744)
* Fixes an issue when importing XFDF files in specific documents. (#21271)
* Fixes an issue where a digital signature applied to a certain kind of document may not show correctly in third party PDF readers. (#18943)
* Fixes an issue where documents using certain kind of fonts may cause the app to be terminated unexpectedly. (#21626)
* Fixes an issue where images with the lighten blend mode didn't get rendered correctly. (#20642)
* Fixes an issue where loading a document would fail if it contained JPEG2000 images not specifying a color space. (#21311)
* Fixes an issue where text after signing had incorrect characters after looking at it in another viewer. (#20930)
* Fixes some stability issues related to color space management. (#21529)
* Fixes some stability issues when fonts are loaded from a document. (#21042)
* Fixes widget annotation rotation property persistence when coming from instant JSON. (#21552, #21621)

### 2.3.2 - 17 Sep 2019

* Fixed an issue when saving some newly created annotations. (#21490)

### 2.3.1 - 26 Aug 2019

* Fixed an issue with older versions of Windows App Cert Kit. (#21120)

### 2.3.0 - 20 Aug 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-windows-2-3/)._

* Added Visual Document Editor. (#20710)
* Added model only support to Document. (#20520)
* Added API to render a page or tile on any calling thread. (#20499)
* Added Modified property and ModifiedAt event to Document. (#20706)
* Added Welsh localization support. (#20471)
* Added ability to set zoom level and scroll bar positions. (#20671)
* Added an event handler to PdfView for ViewState changes. (#20671)
* Added a method to the TextParser for getting text from page regions. (#20646)
* Added ability to add user and/or owner passwords and remove passwords. (#20619)
* Added ability to get outline element by page index. (#20782)
* Added method for setting ViewState to Controller. (#20409)
* Reduced memory usage. (#20921)
* Refreshed UI icons and color scheme. (#20965)
* Fixed an issue with the line width slider. (#20543)
* Fixed an issue reading media boxes. (#20592)
* Fixed an issue that would occur after applying an InstantJSON update to a document where the changes contained form field updates. (#20152)
* Fixed an issue with ViewState page index being ignored. (#20582)
* Fixed an issue with reporting Auto-Saving errors. (#20693)
* Fixed an issue with strokeColor. (#20666)

#### Model

* Adds support for preserving the InstantJSON id in the PDF. (#20572)
* Improves JPEG2000 with transparency support. (#20483)
* Improves performance when parsing many links. (#20786)
* Updates Expat to version 2.2.7. (#20545)
* Updates libpng to version 1.6.37. (#19851)
* Updates openjpeg to version 2.3.1. (#20647)
* Fixes an assertion when importing annotations outside the page range using XFDF. (#20424)
* Fixes an issue where form fields with calculation order may not be flattened correctly by the processor. (#20434)
* Fixes an issue where some documents with dropdown fields may show an arrow when the document is flattened. (#9539)
* Fixes very occasional text rendering problems. (#20155)

### 2.2.0 - 27 Jun 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-windows-2-2/)._

* Adds multithreaded rendering. (#18706)
* Adds a set bounding box method to Ink Annotation which will resize the points and line width automatically. (#20201)
* Adds methods to Controller for getting and setting the Scroll Mode. (#20284)
* Adds custom logging example to Catalog app. (#20299)
* Adds method for setting ViewState to Controller. (#20409)
* Added a Catalog example demonstrating signature storing and application. (#19997)
* Changed the default Arabic font to Arial. (#20320)
* Improved default font selection for Arabic. (#20320)
* Improved print service error logging. (#16218)
* Improved watermark placement and enhanced the Catalog example. (#19382)
* Fixes an issue with Note annotation and touch. (#18702)
* Fixes an issue with blinking annotation tools. (#18700)

#### Model

* Improves loading performance for documents with complex outlines. (#20279)
* Improves rendering of non-ASCII text. (#20189)
* Improved automatic repair of AcroForms on loading documents with a large number of annotations. (#19947)
* Support vertical alignment in single-line form fields when exporting or printing PDF files. (#19882)

### 2.1.0 - 5 Jun 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-windows-2-1/)._

* Improves font rendering. (#19910)
* Fixes an issue with Windows 10 1709. (#20079)
* Adds a Catalog example to show how to save and load signatures to file. (#19997)

#### Model

* Updates Expat to version 2.2.6. (#19868)

### 2.0.0 - 21 May 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-windows-2-0/)._

* Adds support for ARM64. (#19760)
* Adds CustomData property to IAnnotation for storing user defined data. (#18961)
* Adds ability to obtain glyph information. (#18813)
* Adds example code to the Catalog demonstrating prevention of text copying. (#19754)
* Adds support for mailto links. (#19532)
* Adds the ability to rotate pages with the document editor. (#18816)
* Added tile rendering API. (#18815)
* Changed the minimum supported Windows 10 version to 1709 Fall Creators Update. (#19760)
* Deprecated ExportFlattened methods. (#19755)
* Deprecated TextForPageIndexAsync method. (#19755)
* Fixes an issue when recalling an annotation preset which is invalid. (#19713)
* Fixes an issue with quotes in annotation content. (#19928)

#### Model

* Adds `FontStyle` to Instant JSON widget annotations. (#18083)
* Improves results from `Search.Library` when `Search.LibraryQuery.MatchExactPhrases` is set to `true`. (#19685)
* Update ICU to use OS provided library. (#18974)
* Update libjpeg-turbo to 2.0.2. (#18973)
* Update libpng to 1.6.36. (#18972)
* Update zlib to 1.2.11. (#18975)
* Updates the Botan library version to 2.10.0. (#19767)
* Fixes a potential crash when processing large documents under low-memory conditions. (#19768)
* Fixes an issue where malformed widget annotations weren't correctly attached to the form. (#19581)
* Fixes an issue where readonly checkboxes may not be rendered correctly. (#19506)

### 1.12.0 - 16 Apr 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-windows-1-12/)._

* Adds model-only Document Editor. (#19320)
* Adds ability to obtain glyph information. (#18813)
* Adds support for passwords in Library indexing. (#18584)
* Adds support for cloudy border styles. (#19237)
* Load Windows system fonts for rendering. (#19530)
* Fixes an issue where restricted document permissions incorrectly prevented annotating. (#19029)
* Fixes an issue with flattening Note annotations. (#19286)
* Fixes an issue with full-text-search cleanup. (#19533)
* Fixes an issue with rendering of imported json of ink annotations. (#19364)

#### Model

* Fixes a rare issue when parsing outlines. (#19469)
* Fixes an issue when drawing a path using a pattern with alpha transparency. (#19148)
* Fixes an issue when rendering text with an overlay blend mode. (#19151)
* Fixes an issue when sharing a document that resulted in blank pages. (#19267)
* Fixes an issue where QuadPoints of link annotations were saved to the PDF incorrectly. (#19427)
* Fixes an issue where annotations created by Apple Preview may not be copied and pasted correctly. (#19154)
* Fixes an issue where link annotations may not work correctly after a document is exported. (#19222)
* Fixes an issue where some JPX images may not render correctly. (#18648)
* Fixes an issue where text edited in form fields was incorrectly set in other form fields as well. (#19236)
* Fixes an issue where the `fillColor` property was ignored in Instant JSON for polyline annotations. (#19443)
* Fixes rendering of free text annotations with vertical alignment. (#19145)

### 1.11.0 - 14 Mar 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-windows-1-11/)._

* API: Adds the ability to get the document outline programmatically. (#18814)
* API: Adds form field support. (#18543)
* API: Ability to highlight search results via API. (#18694)
* API: Added a method to get cropbox and mediabox. (#18810)
* API: Added a method to get page rotation. (#18810)
* API: Added method to retrieve document title. (#18580)
* Added ability to place sidebar on left or right side. (#19025)
* Added support for PdfView and printing watermarks. (#17029)
* Significant performance improvments for large documents. (#19143)
* Improved user experience with image annotations. (#19230)
* Better error message and exception for license errors. (#18167)
* Prebuilt Catalog app package supplied with SDK. (#18916)
* Catalog app builds out of the box. (#18734)
* Changed Catalog example app to use bundled NuGet package. (#18461)
* Fixes an issue when setting annotation colors to transparent. (#18978)

#### Model

* Adds support for modifying form fields and annotation widgets to Instant Document JSON. (#18771)
* Fix an issue in full-text search that could cause a deadlock during indexing. (#18750)
* Loading PDF actions is now more reliable. (#18843)
* Fixes a bug where annotations parsed from XFDF would be displayed incorrectly on a rotated page. (#17603)
* Fixes an issue where some layers were hidden incorrectly. (#14439)

### 1.10.1 - 14 Feb 2019

* Improves performance when reading and writing to file. (#18897)
* Fixes an issue with reporting the incorrect toolbar items. (#18730)

### 1.10.0 - 31 Jan 2019

* Adds support for opening PDFs and retrieving info without a PdfView. (#17841)
* Adds support for PdfView and printing watermarks. (#17029)
* Adds the ability to customize dropdown groups for toolbar items. (#17438)
* Adds annotation rotation to image, stamp and text annotations. (#18634)
* Adds the text highlighter default toolbar item. (#18666)
* Adds more PdfView property reset options. (#18238)
* Adds public CSS classes for annotation toolbars toolboxes. (#2392)
* Adds `PSPDFKit-Icon-<IconType>` public CSS classes to style individual icons. (#2664)
* Adds persistence of properties to ink signatures. (#2479)
* Adds automatic font size calculation for combo box widgets. (#2644)
* Adds 4pt, 6pt, 8pt, and 200pt to the list of possible font sizes for text annotations. (#C18485)
* Improves performance of annotation selection. (#18459)
* Correct access for SpacerToolbarItem. (#18538)
* Fixes an issue with annotation preset updates reporting incorrect values. (#18585)
* Fixes an issue with line cap selection. (#18418)
* Fixes an issue where the annotation toolbar layout would break when changing the font size. (#2225)
* Fixes an issue where rotating the page could eventually trigger an exception. (#2622)
* Fixes an issue where markup annotations changes were not being persisted in the annotation preset. (#2621)
* Fixes an issue where ink signatures were created at the current page index instead of the related signature form field. (#2642)
* Fixes wrong computed document height when opening a sidebar. (#2652)
* Fixes an issue where the `minimumZoomLevel` and `maximumZoomLevel` where wrong on landscape documents. (#2661)
* Fixes an issue with custom `ToolbarItem` where the `selected` property was ignored. (#2662)
* Fixes an issue where the selected item was not shown in the list of font sizes for text annotations. (#2672)
* Fixes an issue where some overflown text fields would not adjust the font size. (#2677)
* Fixes an issue while highlighting where the current highlight annotation would disappear if clicked. (#2675)

#### Model

* Adds support for cloudy borders in shape annotations and free text annotations via Instant JSON. (#18547)
* Improves initial text parsing performance. (#18534)
* Improves performance when looking up fonts. (#17981)
* Updates the Botan library to version 2.9.0. (#18271)
* Use app name in JavaScript alerts. (#18529)
* Fixes a problem importing/exporting color values. This could lead to unnecessary appearance stream regeneration. (#18428)

### 1.9.1 - 7 Jan 2019

* Fixes an issue with the Nuget package. (#18242)

### 1.9.0 - 20 Dec 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-windows-1-9/)._

* Improvements to API documentation. (#18016)

#### UI

* Adds smooth line rendering for ink annotations and ink signatures. (#1588)
* Adds ability to prevent text copying. (#17965)
* Fixes an issues where PdfView mode can be stuck. (#18127)

#### Model

* Adds CreatedAt and UpdatedAt to IAnnotation. (#17977)
* Adds CreatorName to IAnnotation. (#17976)
* Adds NoView property to IAnnotation. (#18017)
* Adds the ability to import and export via XFDF. (#17843)
* Added Name property to IAnnotation. (#17944)
* Added ability to use custom data providers and sinks. (#17842)
* Improves handling of malformed documents when parsing the extended graphics state. (#18057)
* Fixes a crash parsing text on a very small number of documents. (#18032)
* Fixes an issue where `Search.Library` would return incorrect results when searching within documents that contained Unicode surrogate pairs (like Emoji) in their text. (#3292)
* Fixes issue with future access list if file is no longer available. (#17884)
* Fixes an issue importing text annotation styles from Instant JSON. (#17949)
* Fixes an issue with file access in app assets. (#17876)
* Fixes an issues where OnDocumentOpened event not always fired. (#18126)

#### PSPDFKit for Web 2018.7

* API: Adds public CSS class for active Dropdown Buttons. (#2466)
* Adds new stroke color icon to avoid confusion for non closed shapes (ink, lines, polylines). (#2508)
* Adds support for deleting selected annotations with Backspace and Delete keys. (#1405)
* Improves contrast of annotation toolbar icons. (#2508)
* Fixes an issue where the annotation toolbar layout would break when changing the font size. (#2225)
* Fixes the mixup between the border color and the fill color icons. (#2508)
* Fixes an issue where the last point of an ink annotation line being created was lost when releasing the pointer. (#2518)
* Fixes an issue where stamps UI would break when editing text. (#2445)
* Fixes an issue where some standard stamp annotations were being rendered as `Custom`. (#2467)
* Fixes an issue where stamp annotations were rendered rotated when viewing rotated documents. (#2486)
* Fixes bookmarks sidebar translations to be more accessible and self explanatory. (#2478)
* Fixes an issue with `SidebarMode.BOOKMARKS` not being activatable via public API. (#2500)
* Fixes an issue where note annotations content new lines were not being rendered. (#2487)
* Fixes an issue where annotations could be deleted even though read only mode is enabled. (#2505)
* Fixes an issue where certain annotation toolbar items did not share the same height. (#2508)
* Fixes an issue where annotations hit test area was too wide. (#2127)
* Fixes an issue where setting className and icon for the layout-config got ignored. (#2536)
* Fixes an issue where the annotation toolbar for note annotations was shown when in read only mode. (#2461)
* Fixes an issue where text selection using the touch mode was not properly working. (#2407)
* Fixes an issue where stamp annotations added to rotated PDF pages were not rendered correctly. (#2521)
* Fixes an issue where rendered squiggle annotations would shrink when the viewport was zoomed out. (#2555)
* Improves automatic font size calculation for text widgets. (#C18095)
* Fixes an issue where custom stamps were not being correctly validated. (#2477)
* Fixes an issue where attachments provided via InstantJSON were not created upon initialization. (#2530)
* Fixes issues when importing annotations on rotated pages using InstantJSON. (#C17814)
* Fixes some visualization issues with markup annotations, especially on rotated pages. (#C17889, #C18002, #C18024)
* Fixes an issue where squiggly annotations may not be created correctly on rotated pages. (#C17950)
* Fixes text parsing issue noticed on a very limited number of documents. (#C18032)

### 1.8.0 - 29 Nov 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-windows-1-8/)._

* Adds bookmarks support. (#17028)
* Adds support for stamp annotations. (#17027)
* Adds a helper method for getting all annotations. (#17452)
* Adds a toggleable toolbar item. (#16632)
* Interaction mode changes now set focus on the WebView. (#17439)
* API: Breaking changes made to ToolbarItem to allow richer button support. (#17481)
* Fixes an issue with annotation borders drawn too thick. (#17599)
* Fixes an issue where annotation setting were not remembered. (#17341)
* Fixes an issue with Image annotation properties. (#17597)
* Fixes an issue with file access in app assets. (#17876)
* Fixes an issue with text preset positions. (#17447)
* Fixes issue with future access list if file is no longer available. (#17884)

### 1.7.1 - 29 Oct 2018

* Fixes an issue with unresponsive toolbar buttons. (#17371)
* Fixes an issue where preset updates could not be disabled. (#17388)

### 1.7.0 - 23 Oct 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-windows-1-7/)._

* Added incremental saving and made it the default mode. (#17079)
* Added Auto-Saving to the PdfView. (#14399)
* Added the ability to provide a custom logger. (#17268)
* Added the ability to set the sidebar mode programmatically. (#16947)
* Fixes an issue where documents with a large number of form fields failed to display editing options. (#16911)
* Fixes an issue with ink signature persistence. (#17201)

### 1.6.1 - 26 Sep 2018

* Added annotation preset update event. (#16778)
* Fixes an issue where the print dialog does not receive a source. (#16796)
* Fixes an issue with Rects in markup annotations. (#16806)
* Fixes an issue where the pager toolbar item would disappear. (#2320)

#### Model

* Fixes an issue where not all form fields were listable immediately after opening a document. (#16479)

### 1.6.0 - 6 Sep 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-windows-1-6/)._

* Adds support for image annotations. (#16682)
* Adds Outline and Annotation Sidebars. (#16660)
* Adds localization support. (#15629)
* Adds Annotation Presets. (#16660)
* Adds Importing and Exporting of Instant Document Json. (#16557)
* Adds IsSignature property to Ink annotation. (#16251)
* Adds method for serializing partial, incomplete annotations to JSON. (#16660)
* Fixes an issue with NuGet and x64 architecture. (#16431)
* Fixes exception reporting with creation. (#16718)
* Fixes toolbar manipulation in PdfView.Loaded. (#16476)

### 1.5.4 - 13 Aug 2018

* Fixes an issue with some licenses unable to display documents. (#16428)

### 1.5.3 - 7 Aug 2018

* API: Removed InteractionMode.LayoutConfig. (#16312)
* Add flattening example to Catalog example app. (#16275)
* Fixes an issue when saving populated forms. (#16336)

### 1.5.2 - 01 Aug 2018

* Adds NuGet package to SDK. (#16200)
* Adds layout-config item to toolbar item types. (#15999)
* Adds the ability to set the toolbar early. (#15903)
* Improves print dialog exception handling (#16218)
* Fixes an issue with toolbar colors. (#16094)

#### PSPDFKit for Web 2018.4.1

- Improves text selection behavior when there is padding between the individual text lines. (#2090)
- Fixes an issue where the viewport was too large when zoomed in. (#2086)

### 1.5.1 - 19 Jul 2018

- Fixes an issue where certain licenses failed. (#16116)

### 1.5.0 - 17 Jul 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-windows-1-5/)._

* Adds support for shape annotations. (#15807)
* Adds support for password protected PDFs. (#15467)
* Adds ability to flatten PDFs. (#16062)
* Adds an event handler OnSuspendUnloading to PdfView. (#15892)
* Adds export example code to Catalog app. (#15913)
* Fixes an issue where exporting to the currently open file failed. (#15994)

#### Model

* Allows printing without a PdfView. (#15225)
* Fixes issue with setting toolbar hiding in xaml. (#15904)

#### PSPDFKit for Web 2018.4

- Adds support for shape annotations: line, rectangle, ellipse, polyline and polygon. (#1203)
- Adds public CSS classes for the Layout Config toolbar item and dropdown for easy styling. (#2064)
- Improves style of disabled buttons. (#1920)
- Changes the order of `PSPDFKit.defaultToolbarItems`. (#2039)
- Fixes a rendering issue that resulted into blurry pages at certain zoom levels. (#1824)
- Fixes a regression where form fields were read-only when the document permissions didn't permit modification. (#1976)
- Fixes an issue where forms were not enabled when document permissions didn't permit modifying annotations and forms. (#1999)
- Fixes an issue where annotation toolbars and some toolbar buttons included `undefined` as class name. (#2013)
- Fixes an issue with long text overflowing in the layout configuration dropdown. (#2023)
- Fixes an issue where the delete icon in the annotation toolbar was visible although the annotation was not created yet. (#2043)
- Fixes an issue where the text-align icon was not correct. (#2042)
- Fixes an issue with forms not rendering in standalone when rotating pages. (#2057)
- Fixes an issue where invalid annotations crash the application. (#2004)

### 1.4.1 - 28 Jun 2018

* Fixes an issue with selection handles. (#15836)

### 1.4.0 — 21 Jun 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-windows-1-4/)._

* Adds ARM Support. (#15185)
* Adds a code example for custom CSS to the Catalog app. (#151635)
* Adds a code example to demonstrate multiple `PdfView`s on page. (#15739)
* Adds the ability to print a range or selection from document. (#15207)
* Improves `PdfView` CSS property URI validation and error reporting. (#151664)
* Fixes an issue when resizing the print window. (#15687)

#### PSPDFKit for Web 2018.3.2

* Fixes a regression where readOnly form fields were not properly disabled. (#1921)
* Fixes an issue with selection grippers not working on Windows touch devices. (#1925)
* Fixes an issue with contextual menus overlap the text markup annotation popover on some touch devices. (#1925)

### 1.3.0 - 30 May 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-windows-1-3/)._

* Adds the ability to add custom toolbar items. (#14193)
* Adds the ability to change the toolbar item order. (#14193)
* Adds the ability to get and set ink signatures. (#15370)
* Adds utility methods for converting InstantJSON coords to PDF coords. (#15376)
* Improved performance of file access and memory usage. (#15151)
* Prevent pinch-zoom from zooming the toolbar. (#15425)

#### PSPDFKit for Web 2018.3

* Adds support for ink signatures. (#1704)
* Improves rendering performance when resizing the sidebar and when switching between page modes. (#1859)

### 1.2.1 - 14 May 2018

* Fixes an issue with CompareOptions flags. (#15220)

### 1.2.0 - 3 May 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-windows-1-2/)._

* Adds indexed full text search feature. (#14830)
* Adds ability to get page sizes. (#14992)

#### Model

* Improves compatibility of note annotations with certain 3rd-party viewers such as Apple Preview. (#14953)
* Added annotation `name` to Instant JSON. Also renamed `pspdfkit/file` `name` to `filename` to prevent collisions. (#14856)
* Added better detection for standard stamp subjects for Instant JSON. (#14919)

### 1.1.0 - 9 Apr 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-windows-1-1/)._

* Extensive refactor of SDK. (#14515)
* API: Adds support for getting the text behind a markup annotation. (#14793)
* API: Adds support for getting, setting and responding to selected annotation changes. (#14779)
* Adds `createdAt`, `updatedAt` and `creatorName` to Instant JSON. (#14443)
* Update to PSPDFKit for Web 2018.2. (#14761)
* Fixes an issue where CR and LF characters were not accepted in annotation content. (#14459)
* Fixes an issue where newline characters were not accepted in annotation content. (#14459)
* Fixes an issue with Middle Vertical Alignment of Annotations. (#14687)
* Fixes an issue with permissions when exporting to a StorageFile. (#14620)

#### PSPDFKit for Web 2018.2

* Adds support for parsing `GoToEmbeddedAction`, `GoToRemoteAction`, `HideAction`, `JavaScriptAction`, `LaunchAction`, and `NamedAction`. (#1736)
* Improves rendering performance on low resolution and mobile devices. (#1727)
* Fixes an issue with the layout of slider inputs on Microsoft Edge and Internet Explorer 11. (#1775)

### 1.0.1 - 5 Mar 2018

* Adds an event handler `OnOnCurrentPageChangedEvent` which occurs when the currently visible page changes. Example code is provided in the Catalog app. (#14279)
* Adds a parameter to `PrintHelper` for describing the print job in the system print dialog. (#14362)
* Improves performance while debugging. (#14346)

#### PSPDFKit for Web 2018.1.2

* Adds support for automatically extracting links from text. (#C13944)

## Previous Releases

### 1.0.0 - 15 Feb 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/introducing-pspdfkit-windows/)._

* Initial Release
