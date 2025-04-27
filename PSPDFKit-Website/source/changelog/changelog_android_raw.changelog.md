## Newest Release

### 6.2.0 - 20 Feb 2020

_See the [announcement post](https://pspdfkit.com/blog/2020/pspdfkit-android-6-2/)._

* Updates the Android Gradle Plugin to 3.5.3. (#23079)

#### UI

* Deprecates `setPdfView()`, `performApplyConfiguration()`, `getPdfParameters()` and `getHostingActivity()` in `PdfActivity` and `PdfUiFragment`. These symbols were never meant for public usage and will be removed with the next major version. (#22933)
* Moves internal `PdfUiImpl` from public package `com.pspdfkit.ui` to obfuscated internal package as it was never meant for public usage. If you were using it, please contact our support with your specific use case. (#22999)
    * Deprecates `PSPDFKitViews#getFragment()`, use `getPdfFragment()` defined on either `PdfActivity` or `PdfUiFragment`.
* Adds UI indication if the current font of a freetext annotation is not supported on the current device. (#22155)
    * `Font#getDefaultTypeface()` is now nullable. A `null` value indicates that this font isn't supported on the current device.
* Adds localized strings for British English (`en-rGB` locale). (#23092)
* Adds support for undoing the removal of annotations after using the "Clear All" button inside the annotation list. (#20310)
    * Adds `PdfOutlineView#setUndoManager()` to configure the undo manager that is used for tracking annotation removals.
* Improves animations when scrolling to search results in inline search. (#22921)
* Improves document loading and UI performance. (#23166)
    * Improves performance when zooming pages with multiple ink or stamp annotations.
    * Improves document loading times for larger documents when the license supports digital signatures.
    * Adds `PdfDocument#getDocumentSignatureInfoAsync()` to retrieve the signature info in a non-blocking manner. `PdfDocument#getDocumentSignatureInfo()` should no longer be called on the main thread.
* Improves document loading performance when having the redaction UI disabled using the `PdfActivityConfiguration.Builder#setRedactionUiEnabled()`. (#22927)
* Improves page rendering performance. (#22298)
    * Increases priority for rendering visible pages. 
    * Optimizes time to prepare annotation overlay.
    * Delays display of page loading view. This improves feeling when switching to pages that are rendered fast or have cached rendering.
* Improves property inspector behavior. (#22072)
    * `PropertyInspectorCoordinatorLayout` now internally uses bottom sheet implementation from the material components library.
    * Fixes property inspector in immersive mode.
    * Deprecates `setResizable()` and `isResizable()` in `PropertyInspector`. Property inspector does not support resizing anymore.
* Improves share dialog by automatically sanitizing the initial document name. (#23240)
* Changes the type of dates shown inside the annotation list from annotation creation dates to annotation last modified dates. This change is done to align behavior with PSPDFKit for iOS and PSPDFKit for Web. (#22373)
* Multiple annotation defaults were changed to be consistent with PSPDFKit for other platforms (Web and iOS). This includes default line thickness, text size, cloudy border intensity and eraser thickness defaults. (#22611)
* Sound annotations recording is now disabled when microphone is not available on the device. (#23215)
* Updates the icon for creating note annotations. (#23052)
* Updates tooltips and accessibility labels in the annotation creation toolbar. (#22839)
    * "Highlight" is now called "Text Highlight"
    * "Strike Out" is now called "Strikethrough"
    * "Text: Callout" is now called "Callout"
    * "Ink: Pen" is now called "Drawing"
    * "Ink: Highlighter" is now called "Freeform Highlight"
    * "Ink: Magic" is now called "Magic Ink"
    * "Line: Arrow" is now called "Arrow"
* Fixes a crash that could occur when using the navigation buttons after removing pages from a document using the document editor and saving it in place. (#22969)
* Fixes a possible `IllegalArgumentException` that could have been thrown when saving document info when page binding was unknown. (#23273)
* Fixes an issue where JavaScript function `buttonImportIcon` did not scale imported images correctly. (#22967)
* Fixes an issue where annotations that were being created were rendered behind already added annotations instead of on top of them. (#22619)
* Fixes an issue where callout annotations would be rendered incorrectly after rotating the page using the document editor. (#22911)
    * Fixes an issue where editing rotated callout annotations would break their layout.
* Fixes an issue where long-pressing a page which was not readily loaded would sometimes cause a crash. (#22973)
* Fixes an issue where making changes in the document info view and saving them in a document provided by a non writable data provider would lead to a crash. (#23205)
    * The editing button is now hidden in the document info view when we detect that the current document is not writable.
* Fixes an issue where opening a tab that has the inline search view open would also open the keyboard again. (#23088)
* Fixes an issue where some strings were not translated correctly if the locale was not supported on the device. (#23271)
* Fixes an issue where text in multiline free-text annotations could be cut-off until selected. (#22982)
* Fixes an issue where the thumbnail grid performance would degrade when it was loaded alongside other views. (#23098)
* Fixes an issue where touching the screen with a second finger while annotating would remove the current drawing. (#23283)
* Fixes a possible `IllegalStateException` that could be thrown in `PdfThumbnailGrid` after enabling user interface. (#23373)

#### Model

* API: Moves private PSPDFKit API's from package `com.pspdfkit.framework` to package `com.pspdfkit.internal`, as well as from `com.pspdfkit.instant.framework` to `com.pspdfkit.instant.internal` respectively. (#22985)
* Adds custom lint check to ensure that `android:configChanges` is not configured for `PdfActivity` classes. (#22543)
* Adds support for HTML-to-PDF conversion. (#22660)
    * Adds `HtmlToPdfConverter` as an entry point for this API.
    * This feature requires HTML to PDF Conversion enabled in your license.
* Adds stricter validation to digital signature containers created externally. (#23011)
* Adds support for incrementally saving encrypted documents. (#22722)
* Adds support for the JavaScript function 'doc.gotoNamedDest'. (#18957)
* Adds support for validating digital signatures created by DocuSign. (#22191)
* Improves license check error messages to be more user friendly. (#12904)
* Improves performance of JPEG decoding by enabling SIMD instructions. (#22797)
* Improve compatibility with macOS 10.15 Preview for annotation notes in the sidebar. (#22791)
* Fixes PDF Javascript when scripts are encoded in UTF-16. (#23044)
* Fixes a problem where encrypted documents could not be digitally signed correctly. (#22722)
* Fixes a problem where some PDF pages may not be rendered correctly. (#22767)
* Fixes a rare problem where the application may terminate unexpectedly after loading a document or setting a form field value. (#22924)
* Fixes an issue that caused a blank page after flattening annotations on a certain document. (#22279)
* Fixes an issue where `PdfDocument#wasModified()` incorrectly returned `false` after Document JSON import. (#19378)
* Fixes an issue where characters weren't escaped correctly when exporting XFDF. (#22844)
* Fixes an issue where low-res rendering got triggered after the page has been recycled, leading to the crash. (#22972)
* Fixes an issue where opening a certain document with form fields caused a crash. (#23001)
* Fixes an issue where popup annotations were positioned incorrectly. (#22730)
* Fixes an issue where some PDF JavaScript calculations did not work correctly. (#23043)
* Fixes an issue where text on form fields was occasionally rendered with incorrect rotation on rotated pages. (#22854)
* Fixes an issue where the file size optimization algorithm didn't run. (#22809)
* Fixes an issue where multiple JavaScript functions (for example `mailDoc`) did not parse their arguments correctly. (#23257)
* Fixes an issue with creating a Submit Form action from JSON without action flags. (#22784)
* Fixes empty text form fields not rendering their background color. (#23263)
* Fixes an issue where document checkpointing would not work when the UID of the document contained symbols that are not allowed in paths. (#12893)

#### Examples

* Adds catalog example that shows how to create a filterable thumbnail grid by combining the custom view logic with PDF processor. (#23192)
* Fixes an issue with the `AesDataProvider` when reopening a document right after saving it. (#23190)
* Fixes the `VerticalScrollbarExample` not working correctly with larger documents. (#22952)
* Fixes the Instant example not working on API 28 and up because `android:usesCleartextTraffic` was set to `false`. (#22908)

## Previous Releases

### 6.1.1 - 15 Jan 2020

#### UI

* Improves clipping behavior of free text annotations with overflowing content. (#22218)
* Improves thumbnail size calculation when the `pspdf__usePageAspectRatio` theme attribute in the tab bar style is `true` by allowing every thumbnail to be a different size. (#22378)
* Fixes a `MissingWebViewPackageException` that could be thrown when invoking `PdfMediaDialog` when the system WebKit package was not installed. (#22712)
* Fixes a possible `NullPointerException` that could be thrown when invoking `UriAction` for Youtube links without the Youtube Android Player library. (#22686)
* Fixes an issue where an unhandled `IndexOutOfBoundException` could have been thrown when clicking on a drop down form field that was containing only a single item. (#22863)
* Fixes an issue where pages would not be restored when `android:configChanges` was configured on the `PdfActivity`. (#22684)

#### Model

* Improves `InputStreamDataProvider` by making sure it is thread safe. (#22568)
* Improves complex script text rendering. (#22573)
* Improves the error message that is produced when a failure occurs while restoring the last viewed page of a document. (#22428)
* Fixes a possible crash when using document with huge number of annotations (10 thousands). (#19761)
* Fixes an issue where a form field element appearance stream was regenerated accidentally. (#21618)
* Fixes an issue where text is not displayed in small freetext annotations. (#22514)
* Fixes an issue where the application could crash if loading password protected documents in quick succession. (#22662)
* Fixes an issue with form calculations if one of the form fields contained multiple form elements. (#22675)
* Fixes the `LicenseFeature` enum being obfuscated. (#22850)

#### Instant

* Disables annotation rotation when using Instant since it is not yet fully supported by Instant nor Web. (#22606)
* Fixes a deadlock that could occur when changes were accumulated while a sync was already in progress. (#22703)

### 6.1.0 - 16 Dec 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-android-6-1/)._

* PSPDFKit is now built with Gradle 5.6.4. (#22566)
* Updates the Android Gradle Plugin to 3.5.2. (#22565)
* Updates the AppCompat library to version 1.1.0. (#22143)
* Updates the target SDK version from `28` to `29`. (#21645)

#### Private APIs

This release adds a linter check that will warn developers when using PSPDFKit's private APIs, i.e. classes, methods or fields which are parts of the `com.pspdfkit.framework` Java package. Usage of private APIs is unsupported and will break starting with PSPDFKit 6.2 for Android in early 2020. If you are receiving linter warnings about private API usage after updating to 6.1, or if you are not sure whether your app is using private APIs, please reach out to our customer support team at https://pspdfkit.com/support/request/.

For more information on private API usage, see our [Unsupported Private APIs](https://pspdfkit.com/guides/android/current/announcements/unsupported-internal-symbols/) online guide.

#### UI

* Deprecates `DefaultEmbeddedFileSharingController`, use `DefaultDocumentSharingController` instead. (#22382)
* Deprecates multiple methods inside `DocumentSharingIntentHelper`. (#22379)
    * Deprecates `DocumentSharingIntentHelper.createChooser()` since its functionality regressed on devices running Android 10. Use `Intent#createChooser()` together with an implicit `Intent` instead.
    * Deprecates `DocumentSharingIntentHelper.queryMailToActivities()`. Use `DocumentSharingIntentHelper#queryIntentActivities()` using an `Intent` having `Intent#ACTION_SENDTO` and a `mailto:` URI.
* Adds UI for changing the eraser tool thickness. (#15695)
    * The size of the eraser tool is no longer scaled when changing the zoom level of the page. This makes erasing at higher zoom levels more precise than before.
    * Adds new `pspdf__eraserOutlineColor` style attribute to configure the outline of the eraser tool while erasing.
* Adds `OverlayViewProvider` which can be used to overlay views on a page. (#9176) 
    * Adds `PdfFragment#addOverlayViewProvider()` and `PdfFragment#removeOverlayViewProvider()` to add and remove custom `OverlayViewProvider`.
    * Adds `OverlayLayoutParams` to control positioning of overlaid views on the page.
* Adds `AnnotationOverlayRenderStrategy` for controlling how annotations are rendered when displayed in annotation overlay mode. (#19540)
    * Adds `PdfFragment#setAnnotationOverlayRenderStrategy()` for setting the current render strategy.
    * Adds `Strategy#PLATFORM_RENDERING` which tells PSPDFKit to render an annotation using a custom view. This is the default and used for most annotation types out of the box.
    * Adds `Strategy#AP_STREAM_RENDERING` which tells PSPDFKit to display an annotation by rendering its AP stream. While this is slower than platform rendering, it can be used when precise PDF rendering is required.
    * Updates `AnnotationOverlayExample` with an ability to control overlay render strategy.
* Adds support for custom document outlines. (#22058)
    * Adds `PdfOutlineView#setDocumentOutlineProvider()` for setting a `DocumentOutlineProvider`.
    * Adds `OutlineElement#Builder` for creating `OutlineElement` instances programmatically.
* Adds support for Google TalkBacks forward and backward navigational gestures. (#22109)
* Adds support for fill color property when creating and editing ink annotations. (#22203)
* Adds `requirePdfFragment()` to `PdfActivity` and `PdfUiFragment` as `@NonNull` variant of the `getPdfFragment()` method. This method always returns instance of the `PdfFragment` or throws an exception if it is not yet initialized. (#21765)
* Adds `onPrepareFormElementSelection()` to `OnFormElementSelectedListener` that can be used to prevent form element selection by returning `false` from this method. (#22062)
* Adds support for multi-line bookmark titles. (#20712)
* Adds `onSignatureUiDataCollected()` method to the `SignaturePickerFragment.OnSignaturePickedListener`. You can use it to retrieve the raw drawing data for the created signature. Data is inside the `SignaturePickerFragment.SignatureUiData` object and contains pressure list, point sequences, touch radii, etc. (#22176)
* Improves performance when quickly scrolling through document pages. (#22067)
* Improves scrolling behaviour when in paginated mode by making it harder to accidentally change pages. (#21809)
* The file picker which is used when saving a document after redaction now pre-fills the default file name. (#22254)
    * Adds overload for `FilePicker#getDestinationUri()` that gives control over the default file name that is used by the system file picker.
    * Fixes an issue where the document title returned by `ContentResolvedDataProvider` would be the file name including the file extension.
* Fixes an issue where annotations that were being created were rendered behind already added annotations instead of on top of them. (#22619)
* Fixes a crash that would happen when adding and removing annotation replies. (#22456)
* Fixes a possible `NullPointerException` that could be thrown when creating annotation eraser preview in annotation inspector. (#22441)
* Fixes a possible exception caused by accessing  `getAnnotationPreferences()` or `getAnnotationConfiguration()` in `PdfFragment` before views were created. (#22485)
* Fixes a possible unhandled `NullPointerException` when accessing `NavigationBackStack` while initializing `PdfActivity`. (#22430)
* Fixes an issue where the Android share sheet was truncated on API 29. (#22360)
* Fixes an issue where the transparency of a stamp annotation loaded from a PNG image would be discarded upon sharing. (#22381)
* Fixes an issue where changing an activity configuration via `setConfiguration()` while the document was still loading could lead to showing an empty view instead of resuming the document loading. (#22524)
* Fixes an issue where coordinate conversions on `ViewProjection` did not consider the document view scroll positions. (#22297)
* Fixes an issue where custom title set via `DocumentDescriptor#setTitle()` was not displayed in the document title view. (#22460)
* Fixes an issue where the text size of free text annotations would shrink when rotating the device. (#22115)
* Fixes an issue where image stamps could get distorted when resized immediately after rotating. (#21870)
* Fixes an issue where page rendering could get stuck if the page contained small annotations. (#21590)
* Fixes an issue where the title of a tab could falsely change after rotating the device. (#22163)
* Fixes an issue where text in auto-sized free text annotations would be cut off when changing the border thickness to small values. (#22455)
* Fixes an issue where the modular search would not restore search results after changing the device orientation. (#21914)
* Fixes an issue where toolbar items would appear black on API 19. (#22544)
* Fixes an `ArrayIndexOutOfBoundsException` which would happen in apps targeting API 29 when saving edited document inside the document editor. (#22594)
* Fixes class loading issue that could happen during a configuration change. (#22326)

#### Model

* API: Hides the default constructor of the `DocumentJsonFormatter` class which only exposes static methods. (#22308)
* Adds `Annotation#getUuid()` to access the UUID which is auto-generated for each annotation. (#21899)
* Adds custom linter rule to warn when using experimental APIs. (#22016)
* Adds support for Image Documents with transparency. (#18907)
* Adds support for redaction annotations to Instant JSON. (#21389)
* Improves font selection to prefer fonts which are already part of the document in more cases. (#22530)
* Improves memory usage while searching documents containing many annotations. (#22367)
* Improves performance of the Redaction component so that big documents are redacted quicker. (#22102)
* Updates Duktape to version 2.5.0. (#22476)
* Updates HarfBuzz to version 2.6.2. (#21686)
* Fixes ISO8601 timezone support in instant json. (#21148)
* Fixes a crash related to multi-threading and font loading. (#22387)
* Fixes a possible `ExceptionInInitializerError` that could be thrown when loading system fonts. (#22447)
    * Adds `Font` constructor for creation directly from default typeface.
    * Marks result of `Font#getDefaultFontFile()` as `@Nullable`. Fonts created directly from default typeface do not have any font files.
    * Hides font picker in annotation inspector in unlikely case where fonts could not be loaded from the system.
* Fixes a rare situation where setting form field flags may cause a deadlock. (#19942)
* Fixes an issue where annotation additional actions may not be deserialized correctly. (#21983)
* Fixes an issue where certain high resolution images weren't rendered. (#22322)
* Fixes an issue where certificates with multivalue RDNs may not be parsed correctly. (#22221)
* Fixes an issue where deleting or moving of pages in a PDF did not update the document outline. (#21620, #22048)
* Fixes an issue where signature graphics created from transparent PNG lost alpha information. (#22386)
* Fixes an issue where some filled form fields would not show their content correctly. (#22100)
* Fixes an issue where text entered in certain form fields was rendered incorrectly. (#21700)
* Fixes an issue where the redaction tool would not work correctly when selecting text in specific document. (#22486)
* Fixes stability issues related to color space management. (#21529)
* Fixes widget annotation rotation property persistence when coming from instant JSON. (#21552, #21621)

#### Instant

* Reduces network traffic when loading additional layers of the same document. (#21787)
* Updates OkHttp dependency to 4.2.1. (#21881)

#### Examples

* Cleans up simple example app. (#22400)
* Fixes an issue where `DownloadedFilesObserverService` in catalog could open documents after saving. (#22266)

### 6.0.3 - 7 Nov 2019

#### UI

* Adds `PersistentTabsExample` that shows how to persist opened tabs of a `PdfActivity` inside the user's shared preferences. (#22080)
* Adds `getCustomTitle()` method to `DocumentDescriptor`. Use this method to retrieve custom document title set via `setTitle()`. (#22103)
* Improves annotation inspector reveal animation when keyboard is visible. (#20117)
* Enables setting the default signer certificate that will be used in the signature dialog. You can set it via `#defaultSigner(String)` in `PdfActivityConfiguration.Builder` and `PdfConfiguration.Builder` by providing the signer string identifier. (#21855)
* Updates the annotation creation menu item icon so it better fits with the material design. (#21997)
* Fixes an issue where `ImageDocumentUtils#isImageUri()` returned `false` for file-based `Uri`s that had an image extension. (#22081)
* Fixes an issue where custom fonts provided when initializing PSPDFKit were not handled correctly. (#22041)
    * Fixes an issue where custom fonts were not rendered inside FreeTextAnnotations.
    * Custom fonts are now included in font picker inside annotation inspector.
* Fixes an issue where highlighted page in thumbnail bar was set to 0 after rotating page. (#21076)
* Fixes an issue where the `PdfActivity` did not properly save the view state when using `PdfActivity#setConfiguration()`. (#21536)

#### Model

* Adds `hasBorder()` method to `BorderStylePreset` that returns `true` if the preset represents visible border. (#22205)
* Increases image size limits. (#22029)
* `StampAnnotation#toInstantJSON()` now checks whether annotation has contents and throws an exception when it does not, i.e. when annotation title, stamp type and bitmap are `null` or empty. (#21581)
* Fixes `PdfUiFragment` not implementing `PdfActivityComponentsApi` and missing those methods in its API. (#22036)
* Fixes an issue if a TrueType font collection has more than 32 fonts. (#22148)
* Fixes an issue where form repairs were done too eagerly. (#20786)
* Fixes an issue where some properties of a widget annotation were not persisted when the document was saved. (#21546)
* Fixes an issue where using a big size for the digital signature container may abort the digital signing process. (#22130)

#### Instant

* Fixes an issue where text could disappear after changing to unsupported font on other Instant clients (Web, Windows or iOS). (#22054)

### 6.0.2 - 16 Oct 2019

* PSPDFKit is now built with Gradle `5.6.2`. (#21072)
* Updates the Android Gradle Plugin to 3.5.1. (#21782)

#### UI

* Improves `PdfActivity` by adding support for selecting annotations and form elements using only the keyboard. (#21312)
* Fixes an issue where it wasn't possible to enter certain symbols into form fields with date format. Input type for form elements with `DATE` or `TIME` as `TextInputFormat` has been changed from `InputType#TYPE_CLASS_DATETIME` to `InputType#TYPE_CLASS_TEXT`. We did this change because we can't guarantee that date-time input type will allow entering all symbols that are required by certain JavaScript date-time formats. (#21812)
* Fixes an issue where screen timeout set via UI or `setScreenTimeout` was reset when changing activity configuration. (#20122)

#### Model

* Adds support for printing array structures from JavaScript code inside a PDF. (#19063)
* Fixes a crash when using the processor on certain documents with very deep object hierarchies. (#21674)
* Fixes a performance regression when rendering with an ICC based color space. (#21776)
* Fixes a rare deadlock when rendering certain documents. (#21856)
* Fixes a regression that caused certain link annotations to not work. (#21709)
* Fixes a rendering error where the font `ArialMT` wasn't selected correctly. (#21744)
* Fixes an issue where a digital signature applied to a certain kind of document may not show correctly in third party PDF readers. (#18943)
* Fixes an issue where page click causes a crash due to the missing page state. (#21548)
* Fixes issues with transparent image stamp annotations created from PNG files. (#11996)

#### Instant

* Fixes a possible crash when loading annotations failed in certain Instant documents. (#21617, Z#15606)
* Fixes an issue where free-text annotations synced via Instant could have their bounding boxes clipped. (#21396)

### 6.0.1 - 04 Oct 2019

#### UI

* Improves signature validation messages for signatures with expired certificates. (#21335)
* Prevents scrolling when tapping the edge on a zoomed page to improve user experience. (#21663)
* Fixes a crash that could happen when the state of the `PageLayout` was accessed after it was recycled. (#21645)
* Fixes a possible `NullPointerException` when accessing context in `LinkAnnotationHighlighter`. (#21610)
* Fixes a visual glitch in outline tabs icons after changing page binding. (#21438)
* Fixes an issue where compound hide action lead to glitchy transition for affected annotations. (#21570)
* Fixes an issue where free-text callout line end was displayed incorrectly. (#21672)
* Fixes an issue where the `ANNOTATION_NOTE` was ignored for freetext annotations. (#21090)
* Fixes an issue where the redaction button was not hidden when redacting to a new file. (#21517)

#### Model

* Fixes an issue when using multi-threaded rendering. (#18582)
* Fixes an issue where documents using certain kind of fonts may cause the app to be terminated unexpectedly. (#21626)
* Fixes an issue where the z-index wasn't preserved when flattening annotations. (#21385)

### 6.0.0 - 20 Sep 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-android-6/)._

* Update Kotlin to 1.3.50. (#21380)
* Updates Botan to version 2.11.0. (#20549)
* Updates Duktape to version 2.4.0. (#20954)
* Updates the Android Gradle Plugin to 3.5.0. (#21070)

#### UI

* Adds `PdfUiFragment` which provides the same UI and API as the `PdfActivity` but as a fragment that can be included as part of another activity. The `PdfUiFragment` is considered experimental and the API may change or be removed in future framework releases. (#20981)
    * Adds `PdfUiFragmentBuilder` to create new `PdfUiFragment` instances.
    * Adds `PdfUi`, an interface containing methods that are shared by both the `PdfActivity` as well as the `PdfUiFragment`.
    * Removes `PdfActivityApi`, this was replaced by `PdfUi`.
* Adds support for free text annotations to automatically scale based on the content that is entered. By default they automatically scale both horizontally as well as vertically. (#20614)
    * Adds `AnnotationTextResizingConfiguration` to control in which direction free text annotations can scale automatically.
* Adds UI for annotation z-index reordering. (#21264)
    * Adds reordering annotations in the annotation outline view.
    * Adds buttons for reordering annotations to the inspector. When the reordering happens, the position of the annotation on the page is briefly shown.
    * Adds `PdfActivityConfiguration.Builder#setAnnotationListReorderingEnabled(boolean)` to set whether reordering annotations in the annotation list is enabled.
    * Adds `AnnotationConfiguration.Builder#setZIndexEditingEnabled()` so you can enable/disable z-index editing for the particular annotation type.
* Adds support for rotating stamps with custom appearance stream generators. (#20871)
    * Adds `isRotationEnabled()` and `setRotationEnabled()` method to `AnnotationSelectionController` to control whether the rotation handle should be displayed.
* Adds default interface methods for the `DocumentListener` interface. (#21189)
* API: Adds new methods for converting between normalized PDF coordinates and raw PDF coordinates. (#20945)
    * Adds `PdfDocument#getPdfProjection()` to retrieve an instance of `PdfProjection`.
    * Adds `PdfProjection#toRawPoint(PointF, int)` to map a normalized PDF point to a raw PDF point.
    * Adds `PdfProjection#toNormalizedPoint(PointF, int)` to map a raw PDF point to a normalized PDF point.
    * Adds `PdfProjection#toRawRect(RectF, int)` to map a normalized PDF rect to a raw PDF rect.
    * Adds `PdfProjection#toPdfRect(Rect, int)` to map a raw PDF rect to a normalized PDF rect.
    * Adds `PdfProjection#getNormalizedToRawTransformation(int)` to return a transformation matrix for converting normalized page coordinates to raw page coordinates.
    * Adds `PdfProjection#getRawToNormalizedTransformation(int)` to return a transformation matrix for converting raw page coordinates to normalized page coordinates.
    * Adds `PdfFragment#getViewProjection()` to retrieve an instance of `ViewProjection`.
    * Adds `ViewProjection#toPdfPoint(PointF, int)` to convert a point in view coordinate space to a point in normalized PDF coordinate space.
    * Adds `ViewProjection#toViewPoint(PointF, int)` to convert a point in normalized PDF coordinate space to a point in view coordinate space.
    * Adds `ViewProjection#toPdfRect(RectF, int)` to convert a rect in view coordinate space to a rect in normalized PDF coordinate space.
    * Adds `ViewProjection#toViewRect(RectF, int)` to convert a rect in normalized PDF coordinate space to a rect in view coordinate space.
    * Adds `ViewProjection#getPageToViewTransformation(int, Matrix)` to return a transformation matrix for converting normalized page coordinates to view coordinates.
    * Adds `ViewProjection#getViewToPageTransformation(int, Matrix)` to return a transformation matrix for converting view coordinates to normalized page coordinates.
    * Deprecates `PdfFragment#getPageToViewTransformation(int, Matrix, boolean)`. Use `ViewProjection#getPageToViewTransformation(int, Matrix)` instead.
    * Deprecates `PdfFragment#getPageToViewTransformation(int, Matrix)`. Use `ViewProjection#getPageToViewTransformation(int, Matrix)` instead.
    * Deprecates `PdfFragment#convertViewPointToPdfPoint(PointF, int)`. Use `ViewProjection#toPdfPoint(PointF, int)` instead.
    * Deprecates `PdfFragment#convertPdfPointToViewPoint(PointF, int, boolean)`. Use `ViewProjection#toViewPoint(PointF, int)` instead.
    * Deprecates `PdfFragment#convertPdfPointToViewPoint(PointF, int)`. Use `ViewProjection#toViewPoint(PointF, int)` instead.
    * Deprecates `PdfFragment#convertViewRectToPdfRect(RectF, int)`. Use `ViewProjection#toPdfRect(RectF, int)` instead.
    * Deprecates `PdfFragment#convertPdfRectToViewRect(RectF, int)`. Use `ViewProjection#toViewRect(RectF, int)` instead.
* Adds new theme attributes to configure tab bar appearance. (#16644)
    * Adds new theme attribute `pspdf__tabBarStyle` to configure the tab bar style.
    * Adds new style attribute `pspdf__tabColor` to control the color of the tab items.
    * Adds new style attribute `pspdf__tabIndicatorColor` to control the color of the selected tab indicator.
    * Adds new style attribute `pspdf__tabTextColorSelected` to control the color of the selected tab text.
    * Adds new style attribute `pspdf__tabTextColor` to control the color of the tab text when not selected.
    * Adds new style attribute `pspdf__tabIconColorSelected` to control the color of the selected tab icon.
    * Adds new style attribute `pspdf__tabIconColor` to control the color of the tab icon when not selected.
    * Adds new style attribute `pspdf__tabBarHeight` to control the height of the tab bar.
    * Adds new style attribute `pspdf__tabBarMinimumWidth` to control the minimum width of a single tab item.
    * Adds new style attribute `pspdf__tabBarMaximumWidth` to control the maximum width of a single tab item.
    * Adds new style attribute `pspdf__tabBarTextSize` to control the text size of the tab items.
* Improves annotation editing coordination when annotation overlay is disabled. (#21377)
* Improves audio view appearance by putting it into a 'floating' container. (#20890)
* Improves performance by making password and document loading error views lazy. (#21274)
* Fixes a visual glitch in outline tabs icons after changing page binding. (#21438)
* Fixes an issue where accessing the internal state of a recycled page view lead to a crash. (#21386)
* Fixes an issue where `PdfFragment` could not load documents after it was recreated inside a `ViewPager`. (#21421)
* Fixes an issue where created annotations disappeared in certain cases when immersive mode was active. (#21252)
* Fixes an issue where form elements would not be fillable if their corresponding widget annotation would have the `AnnotationFlags#READONLY` flag set. (#21051)
* Fixes an issue where no error message was displayed when clicking on a link annotation having an invalid URI. (#20840)
* Fixes an issue where opening and closing the keyboard in immersive mode applies the wrong inset to `PdfFragment`. (#20959)
* Fixes an issue where resizing free text annotations could result in unhandled `NullPointerException`s to be thrown. (#20980)
* Fixes an issue where text form elements that were configured as not scrolling would not automatically update their text size. (#20720)
* Fixes possible incorrect thumbnail bar padding when using the immersive mode. (#20873)
* Fixes a possible crash that could occur when changing pages while having annotations selected. (#21468)
* Fixes an issue on API 19 device, where low-resolution renderings of pages were not refreshed on recycled page views. (#21485)
* Fixes an issue where closing a document immediately after changing the page could result in a `NullPointerException`. (#21443)
* Fixes an issue where the `animate` parameter of `ToolbarCoordinatorLayout#displayContextualToolbar()` and `ToolbarCoordinatorLayout#removeContextualToolbar()` was ignored and the animation was always shown. (#21075)

#### Model

* API: Removes all previously deprecated symbols. (#20504)
    * Removes `PdfFragment#getAnnotationDefaults()`. Use `PdfFragment#getAnnotationConfiguration()` instead.
    * Removes `PdfFragment#setAnnotationDefaultsProvider()`. Use `AnnotationConfigurationRegistry#put()` instead.
    * Removes `PSPDFKit#setLoggingEnabled()`. To disable logging, remove all loggers via `PdfLog#removeAllLoggers()`. Alternatively implement custom logging policy by setting multiple custom `Logger`s via `PdfLog#setLoggers(Logger...)`.
    * Removes `AnnotationDefaultsManager`. Replaced by the `AnnotationConfigurationRegistry`.
    * Removes `AnnotationDefaultsProvider`. Replaced by `AnnotationConfiguration`.
    * Removes `com.pspdfkit.annotations.defaults.AnnotationProperty`. Use `com.pspdfkit.annotations.configuration.AnnotationProperty` instead.
    * Removes `AnnotationAggregationStrategyDefaultsProvider`. Use `AnnotationAggregationStrategyConfiguration` instead.
    * Removes `AnnotationDefaultsAlphaProvider`. Use `AnnotationAlphaConfiguration` instead.
    * Removes `AnnotationDefaultsBorderStyleProvider`. Use `AnnotationBorderStyleConfiguration` instead.
    * Removes `AnnotationDefaultsColorProvider`. Use `AnnotationColorConfiguration` instead.
    * Removes `AnnotationDefaultsFillColorProvider`. Use `AnnotationFillColorConfiguration` instead.
    * Removes `AnnotationDefaultsFontProvider`. Use `AnnotationFontConfiguration` instead.
    * Removes `AnnotationDefaultsLineEndTypeProvider`. Use `AnnotationLineEndsConfiguration` instead.
    * Removes `AnnotationDefaultsNoteIconProvider`. Use `AnnotationNoteIconConfiguration` instead.
    * Removes `AnnotationDefaultsOutlineColorProvider`. Use `AnnotationOutlineColorConfiguration` instead.
    * Removes `AnnotationDefaultsOverlayTextProvider`. Use `AnnotationOverlayTextConfiguration` instead.
    * Removes `AnnotationDefaultsPreviewProvider`. Use `AnnotationDefaultsProvider` instead.
    * Removes `AnnotationDefaultsRepeatOverlayTextProvider`. Use `AnnotationOverlayTextConfiguration` instead.
    * Removes `AnnotationDefaultsTextSizeProvider`. Use `AnnotationTextSizeConfiguration` instead.
    * Removes `AnnotationDefaultsThicknessProvider`. Use `AnnotationThicknessConfiguration` instead.
    * Removes `AnnotationDefaultsStampProvider`. Use `StampAnnotationConfiguration.Builder` instead.
    * Removes `EraserDefaultsProvider`. Use `EraserToolConfiguration.Builder` instead.
    * Removes `FileAnnotationDefaultsProvider`. Use `FileAnnotationConfiguration.Builder` instead.
    * Removes `FreeTextAnnotationDefaultsProvider`. Use `FreeTextAnnotationConfiguration.Builder` instead.
    * Removes `InkAnnotationDefaultsProvider`. Use `InkAnnotationConfiguration.Builder` instead.
    * Removes `LineAnnotationDefaultsProvider`. Use `LineAnnotationConfiguration.Builder` instead.
    * Removes `MarkupAnnotationDefaultsProvider`. Use `MarkupAnnotationConfiguration.Builder` instead.
    * Removes `NoteAnnotationDefaultsProvider`. Use `NoteAnnotationConfiguration.Builder` instead.
    * Removes `RedactionAnnotationDefaultsProvider`. Use `RedactionAnnotationConfiguration.Builder` instead.
    * Removes `ShapeAnnotationDefaultsProvider`. Use `ShapeAnnotationConfiguration.Builder` instead.
    * Removes `StampAnnotationDefaultsProvider`. Use `StampAnnotationConfiguration.Builder` instead.
    * Removes `AnnotationPreferencesManager#getBorderStyle()`. Use `BorderStylePreset#getBorderStyle()` on border style preset returned via `AnnotationPreferencesManager#getBorderStylePreset()`.
    * Removes `AnnotationPreferencesManager#setBorderStyle()`. Use `BorderStylePreset` set via `AnnotationPreferencesManager#setBorderStylePreset()`.
    * Removes `AnnotationPreferencesManager#getBorderDashArray()`. Use `BorderStylePreset#getDashArray()` on border style preset returned via `AnnotationPreferencesManager#getBorderStylePreset()`.
    * Removes `AnnotationPreferencesManager#setBorderDashArray()`. Use `BorderStylePreset` set via `AnnotationPreferencesManager#setBorderStylePreset()`.
    * Removes `PdfConfiguration.Builder#textSharingEnabled()`. Use `PdfConfiguration.Builder#setEnabledShareFeatures()` with `ShareFeatures#TEXT_SELECTION_SHARING`, `ShareFeatures.NOTE_ANNOTATION_SHARING` and `ShareFeatures.FREE_TEXT_ANNOTATION_SHARING` instead.
    * Removes `PdfConfiguration.Builder#embeddedFileSharingEnabled()`. Use `PdfConfiguration.Builder#setEnabledShareFeatures()` with `ShareFeatures#EMBEDDED_FILE_SHARING` instead.
    * Removes `PdfConfiguration.Builder#sharingNoteEditorContentEnabled()`. Use `PdfConfiguration.Builder#setEnabledShareFeatures()` with `ShareFeatures#NOTE_EDITOR_CONTENT_SHARING` instead.
    * Removes `PdfConfiguration.Builder#setSignatureSavingEnabled()`. Use `PdfConfiguration.Builder#signatureSavingStrategy()` instead.
    * Removes `PdfConfiguration.Builder#setCustomerSignatureFeatureEnabled()`. Use `PdfConfiguration.Builder#signatureSavingStrategy()` instead.
    * Removes `PdfConfiguration#isTextSharingEnabled()`. Use `PdfConfiguration#getEnabledShareFeatures()` and check if `ShareFeatures#TEXT_SELECTION_SHARING` is enabled.
    * Removes `PdfConfiguration#isEmbeddedFilesSharingEnabled()`. Use `PdfConfiguration#getEnabledShareFeatures()` and check if `ShareFeatures#EMBEDDED_FILE_SHARING` is enabled.
    * Removes `PdfConfiguration#isSharingNoteEditorContentEnabled()`. Use `PdfConfiguration#getEnabledShareFeatures()` and check if `ShareFeatures#NOTE_EDITOR_CONTENT_SHARING` is enabled.
    * Removes `PdfConfiguration#isSignatureSavingEnabled()`. Use `PdfConfiguration#getSignatureSavingStrategy()` instead.
    * Removes `PdfConfiguration#isCustomerSignatureFeatureEnabled()`. Use `PdfConfiguration#getSignatureSavingStrategy()` instead.
    * Removes `PdfActivityConfiguration.Builder#sharingNoteEditorContentEnabled()`. Use `PdfActivityConfiguration.Builder#enabledShareFeatures()` with `ShareFeatures#NOTE_EDITOR_CONTENT_SHARING` instead.
    * Removes `PdfActivityConfiguration.Builder#enableShare()`. Use `PdfActivityConfiguration.Builder#enabledShareFeatures()` with `ShareFeatures.all()` instead.
    * Removes `PdfActivityConfiguration.Builder#disableShare()`. Use `PdfActivityConfiguration.Builder#enabledShareFeatures()` with `ShareFeatures.none()` instead.
    * Removes `PdfActivityConfiguration.Builder#setSignatureSavingEnabled()`. Use `PdfActivityConfiguration.Builder#signatureSavingStrategy()` instead.
    * Removes `PdfActivityConfiguration.Builder#setCustomerSignatureFeatureEnabled()`. Use `PdfActivityConfiguration.Builder#signatureSavingStrategy()` instead.
    * Removes `PdfActivityConfiguration#isShareEnabled()`. Use `PdfActivityConfiguration#getEnabledShareFeatures()` instead.
    * Removes `ThumbnailBarMode#THUMBNAIL_BAR_MODE_DEFAULT`. Use `ThumbnailBarMode#THUMBNAIL_BAR_MODE_FLOATING` instead.
    * Removes `PdfProcessorTask#addPdfToPage()`. Use `PdfProcessorTask#mergePage()` instead.
    * Removes `SearchOptions.Builder(Context)`. Use no parameter constructor instead.
    * Removes `TextSearch(Context, PdfDocument, PdfConfiguration)`. Use `TextSearch(PdfDocument, PdfConfiguration)` instead.
    * Removes `Signer#OnSigningCompleteCallback`.
    * Removes `Signer#signFormField(SignatureFormField, BiometricSignatureData, OutputStream, OnSigningCompleteCallback)`. Use `Signer#signFormField(SignerOptions)` instead.
    * Removes `Signer#signFormField(SignerOptions, OnSigningCompleteCallback)`. Use `Signer#signFormField(SignerOptions)` instead.
    * Removes `Signer#signFormFieldAsync(SignatureFormField, BiometricSignatureData, OutputStream)`. Use `Signer#signFormFieldAsync(SignerOptions)` instead.
    * Removes `SignaturePickerFragment#setSignaturePickerOrientation()`. Pass in the desired `SignatureOptions` to `SignaturePickerFragment#show()` instead.
    * Removes `SignaturePickerFragment#showSignaturePicker()`. Use `SignaturePickerFragment#show()` instead.
    * Removes `AnnotationCreationController#getBorderStyle()`. Use border style via `BorderStylePreset#getBorderStyle()` returned by `AnnotationCreationController#getBorderStylePreset()`.
    * Removes `AnnotationCreationController#setBorderStyle()`. Set in a border preset via `AnnotationCreationController#setBorderStylePreset(BorderStylePreset)`.
    * Removes `AnnotationCreationController#getBorderDashArray()`. Use dash array via `BorderStylePreset#getDashArray()` returned by `AnnotationCreationController#getBorderStylePreset()`.
    * Removes `AnnotationCreationController#setBorderDashArray()`. Set in a border preset via `AnnotationCreationController#setBorderStylePreset(BorderStylePreset)`.
* Adds `ContainedSignaturesSigner` that simplifies usage of contained digital signatures. (#21309)
* Adds support for extracting and attaching binary Instant JSON attachments. (#15851)
    * Adds `Annotation#hasBinaryInstantJsonAttachment()` to check whether the annotation has an attachment.
    * Adds `Annotation#fetchBinaryInstantJsonAttachment()` to get an existing attachment.
    * Adds `Annotation#attachBinaryInstantJsonAttachment()` to create a new attachment.
* Adds support for redaction annotations to Instant JSON. (#21389)
* Adds support for rendering Emojis in FreeText annotation and forms. (#20629)
* Adds support for reordering annotations based on the z-index. (#21235)
    * Adds `AnnotationProvider#moveAnnotation[Async](int pageIndex, int fromZIndex, int toZIndex)`.
    * Adds `AnnotationProvider#moveAnnotation[Async](@NonNull Annotation annotation, int zIndex)`.
    * Adds `AnnotationProvider#moveAnnotation[Async](@NonNull Annotation annotation, @NonNull AnnotationZIndexMove zIndexMove)``, where `AnnotationZIndexMove` can be one of the following actions: `MOVE_TO_FRONT`, `MOVE_FORWARD`, `MOVE_BACKWARD`, `MOVE_TO_BACK`.
    * Adds `AnnotationProvider#getZIndex(@NonNull Annotation annotation)`.
    * Adds `OnAnnotationUpdatedListener#onAnnotationZOrderChanged(int pageIndex, @NonNull List<Annotation> oldOrder, @NonNull List<Annotation> newOrder)` that you can use to catch the annotation z-index changes.
* Improves JPEG2000 with transparency support. (#20483)
* Improves consumer Proguard configuration for use with R8. (#20745)
* Improves font rendering and fixes several edge cases. (#20930)
* Improves handling and documentation of custom digital signature sizes. Now cases where the signature size exceeds the reserved size in a document will be informed correctly. (#21304)
* Improves memory usage on complex documents. (#20970)
* Improves the stability of some PDF form operations. (#21032)
* Improves the validation of Instant JSON payloads so that case differences in properties are tolerated. (#21145)
* Improves handling of broken AcroForm dictionaries. (#21121)
* Changes `AnnotationProvider#getAllAnnotationsOfType()` to be a blocking call instead of async. (#20525)
* Strengthens the validation of Instant JSON format in some corner cases. (#20748)
* Fixes an issue where text after signing had incorrect characters after looking at it in another viewer. (#20930)
* Fixes a bug in redaction rendering where the font size wasn't consistent. (#21088)
* Fixes a bug where measuring annotation selection layout could lead to a crash. (#20961)
* Fixes a problem where some dates may be incorrectly formatted as Sunday. (#20363)
* Fixes an issue when importing XFDF files in specific documents. (#21271)
* Fixes an issue where a document with too many annotations would cause a crash by exceeding the global JNI reference count. (#20977)
* Fixes an issue where images with the lighten blend mode didn't get rendered correctly. (#20642)
* Fixes an issue where loading a document would fail if it contained JPEG2000 images not specifying a color space. (#21311)
* Fixes pasted rotated vector stamps being double rotated which resulted in clipping. (#20916)
* Fixes some stability issues when fonts are loaded from a document. (#21042)
* Fixes some use cases where PDFs with JavaScript validation scripts may not work as expected. (#21291)
* Fixes page indices being incorrect after the first data provider when exporting Instant JSON from a document with multiple data providers. (#20343)
* Fixes a possible `NullPointerException` that could occur when changing pages while having free-text annotation selected. (#21459)

#### Instant

* Instant library has been merged with PSPDFKit for Android. (#20364)
    * Removes `com.pspdfkit:pspdfkit-instant` artefact from the PSPDFKit's maven repo and `pspdfkit-instant.aar` from the distribution package. 
    * Removes `PSPDFKitInstant` and `PSPDFKitInstantInitializationProvider`. Instant is now initialized together with `PSPDFKit`.
    * `InstantClient` now checks for OkHttp dependency and throws an error if it is missing. If you wish to use Instant add `implementation "com.squareup.okhttp3:okhttp:3.11.0"` to dependencies block of your build file.
* Fixes an issue where `InstantAnnotationProvider` has been obfuscated in release builds. (#20997)
* Fixes an issue with transparent strokeColor in Instant JSON. (#21391)

#### Examples

* Adds `DownloadedFilesObserverService` to catalog app to speed-up opening custom files when running on Android emulator. If you wish to open a file, just drop it on the Android emulator with the catalog running. (#20846)
* Fixes an issue where direct launching of Catalog examples could lead to initialization errors. (#21188)

### 5.5.1 - 8 Aug 2019

#### UI

* Fixes an issue where clicking on signed signature form fields would not display the signature info dialog if the form field was marked as read only. (#20766)
* Fixes an issue where document saving callbacks were not called after `PdfFragment` was destroyed. (#20774)
* Fixes an issue where redactions were not correctly displayed in the annotation list. (#20738)
* Fixes an issue where thumbnails in thumbnail bar were too wide if the first page was wider than the others. (#20740)

#### Model

* Deprecates `OnSigningCompleteCallback` and `signFormField()` method that used it in `Signer`. (#20815)
* Adds support for contained digital signatures. (#20493)
    * Adds `prepareFormFieldForSigningAsync()` to `Signer`. Use this method to reserve space in a signature form field so that it can be signed later.
    * Adds `embedSignatureInFormFieldAsync()` to `Signer`. Use this method to embed a digital signature in a document that has been already prepared for signing.
    * Adds `SignatureContents` interface. `SignerOptions` now has `signatureContents` property that represents raw content that should be embedded as a digital signature in the document.
    * Adds `PKCS7` that implements PKCS7 cryptographic container and `PKCS7SignatureContents` that wraps the PKCS7 container as a signature contents.
    * Adds `getHashForDocumentRange()` to `PdfDocument` to hash part of the document indicated by the byte range of the prepared signature.
    * Adds `ContainedSignaturesExample` that shows how to build custom `Signer` for signing a document using the `PKCS7` cryptographic container.
* Adds new `DocumentSaveOptions#setRewriteAndOptimizeFileSize()` method to enable additional file size optimizations when saving documents. (#20831)
* Improves performance when parsing documents with many links. (#20786)
* Fixes an issue that may prevent that a document with some restrictions is digitally signed. (#20741)
* Fixes an issue where PSPDFKit always changed the PDF version to 1.7. (#20596)
* Fixes an issue where rotating pages using the document editor would always reset the page binding setting to left edge. (#20732)

### 5.5.0 - 26 Jul 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-android-5-5/)._

PSPDFKit is now built with Android Gradle Plugin `3.4.2` and Gradle `5.5.1`.

#### UI

* Adds `enableMagnifier()` to `PdfConfiguration.Builder` to control whether the magnifier should be shown when the text selection handles are touched. (#20246)
* Adds form elements to the annotation outline view. (#19989)
    * The "Clear All" button will now also clear data entered into form elements.
    * Adds new `pspdf__form_type_text_field`, `pspdf__form_type_button`, `pspdf__form_type_choice_field`, and `pspdf__form_type_signature_field` string resources.
* Adds support for navigating between pages by tapping the edges of the page. (#16500)
    * Adds `Pdf[Activity]Configuration.Builder#scrollOnEdgeTapEnabled()` to control whether navigating by tapping the page edges is enabled.
    * Adds `Pdf[Activity]Configuration.Builder#animateScrollOnEdgeTaps()` to control whether these navigation events are animated.
    * Adds `Pdf[Activity]Configuration.Builder#scrollOnEdgeTapMargin()` to control how big the area that accepts touches on the page edge is.
* Adds support for the UI to display documents with a right edge binding from right to left. (#20327)
    * Adds page binding setting to document info view.
    * Adds support for the `PdfActivity` to automatically update when the page binding of the current document changes.
* Adds the floating thumbnail bar - a new thumbnail bar layout that is not pinned to the bottom but displayed as a floating card. (#19999)
    * Adds `ThumbnailBarMode#THUMBNAIL_BAR_MODE_FLOATING` used to select floating thumbnail bar via `PdfActivityConfiguration.Builder#setThumbnailBarMode()`.
    * Adds `ThumbnailBarMode#THUMBNAIL_BAR_MODE_PINNED` used to select pinned (old) thumbnail bar via `PdfActivityConfiguration.Builder#setThumbnailBarMode()`.
    * Deprecates `ThumbnailBarMode#THUMBNAIL_BAR_MODE_DEFAULT`. The `ThumbnailBarMode#THUMBNAIL_BAR_MODE_FLOATING` is now used as a default value.
    * Adds `PdfThumbnailBar#setThumbnailBarMode()` to set the mode dynamically on the `ThumbnailBar`.
    * Adds `PdfStaticThumbnailBar.LayoutStyle` enum that defines two possible layout styles for the static thumbnail bar (`FLOATING` and `PINNED`). Also adds `setLayoutStyle()` and `getLayoutStyle()` respectively.
    * Static and pinned thumbnail bars won't interfere anymore with the new Android Q gestural navigation as there's room left on the bottom when gestural navigation is enabled.
* Improves `PdfActivity` and `PdfFragment` startup performance by initializing all views lazily on their first use. (#20001)
* Improves animations speed of fling gesture. (#20674)
* Improves configuration resolving for annotation tool variants inside `AnnotationConfigurationRegistry`. (#20623)
    * Pen variant now defaults to default ink variant configuration.
* Improves text selection magnification by keeping the magnifier view entirely inside the screen. (#20221)
* Removes transparent fill color from annotation inspector for redaction annotations. (#20321)
* Updates localized strings and adds Welsh language localization. (#20713)
* `PdfOutlineView` now loads its content lazily when displayed for the first time. (#20234)
* Fixes an issue where bottom audio view got stuck after switching tabs. (#20340)
* Fixes an issue where annotation list showed duplicate entries and did not hide loading indicator after annotation loading has finished. (#20698)
* Fixes an issue where page previews were not correctly invalidated when applying redactions to the current document. (#20322)
* Fixes an issue where sound annotation recording button had wrong grouping on small devices. (#20354)
* Fixes an issue where thumbnail bar was not being shown on some phones in landscape mode, when Android Q gestural navigation was enabled. (#20700)
* Fixes an issue where undo/redo did not work correctly in some cases for sound annotations and image stamps. (#20439)
* Fixes an issue where undoing changes made to annotation replies was not working correctly. (#20327)
* Fixes multiple activity leaks inside `PdfFragment`. (#20517)
* Fixes stuttering animation when showing inspector for listbox and combobox form fields. (#20338)

#### Model

* Deprecates `AnnotationProvider#getAllAnnotationsOfType()` in favor of `AnnotationProvider#getAllAnnotationsOfTypeAsync()`. (#20525)
    * `AnnotationProvider#getAllAnnotationsOfType()` will be made into a blocking call in PSPDFKit for Android 6.0.
* Adds `PdfDocument#setPageBinding()` to configure the page binding of the document. (#20327)
    * Adds `PageBinding` enum with all possible page bindings.
* Adds support for exporting and importing callout freetext annotations using JSON. (#18202)
* Adds support for preserving the Instant JSON id in the PDF. (#20572)
* Adds support for rotating image stamps. (#19643)
* Adds support for serializing and deserializing border properties of link annotations. (#20359)
* Adds suppot for vertical alignment in single-line form fields when exporting or printing PDF files. (#19882)
* Improves rendering of non ASCII text. (#20189)
* Improves rendering of text in appearance streams. (#19877)
* Improves consumer Proguard configuration for use with R8. (#20745)
* PSPDFKit now preserves the appearance stream when a stamp annotation is rotated to avoid distorting it. (#15898)
* Fixes a problem where overriding the digital signature reserved size may corrupt the signature appearance. (#20496)
* Fixes an assertion when importing annotations outside the page range using XFDF. (#20424)
* Fixes an issue reading media boxes. (#20592)
* Fixes an issue where `DocumentListener` set on `PdfFragment` or `PdfActivity` was not called when calling `PdfDocument#save()` on the document directly. (#20470)
* Fixes an issue where form fields with calculation order may not be flattened correctly by the processor. (#20434)
* Fixes an issue where some documents with dropdown fields may show an arrow when the document is flattened. (#9539)
* Fixes very occasional text rendering problems. (#20155)
* Updates NDK to version 20.0.5594570. (#20429)
* Updates Expat to version 2.2.7. (#20545)
* Updates libpng to version 1.6.37. (#19851)
* Updates openjpeg to version 2.3.1. (#20647)

#### Instant

* Fixes a crash that would occur after applying an InstantJSON update to a document where the changes contained form field updates. (#20152)
* Fixes an issue where annotations could not be removed after syncing updates from Instant. (#20684)

## Previous Releases

### 5.4.2 - 26 Jun 2019

#### UI

* Adds new `pspdf__usePageAspectRatio` attribute to thumbnail bar style. (#20245)
    * When enabled this will use the `pspdf__thumbnailHeight` and aspect ratio of your document to determine the `pspdf__thumbnailWidth`.
* Fixes an issue inside `PdfThumbnailGrid` where deleting all pages and adding a new one may cause a crash. (#20333)
* Fixes an issue where calling `PdfFragment#enterAnnotationCreationMode()` multiple times may cause visualization issues of the contextual toolbars. (#20172)
* Fixes an issue where document insets were calculated wrong when form editing bar was displayed. (#20149)
* Fixes an issue where it was possible to edit form element while its associated `WidgetAnnotation` was not editable (i.e. having flags `READONLY`, `LOCKED` or `LOCKEDCONTENTS`). (#20238)
* Fixes an issue where it wasn't possible to undo sound annotations deletion. (#20308)
* Fixes an issue where annotation inspector could grow taller than the screen size rendering it unusable. (#20309)
* Fixes an issue where some `PropertyInspectorView`s were restored twice reporting wrong values in the UI. (#20305)
    * Adds `PropertyInspectorView#isViewStateRestorationEnabled()` to determine whether to save the state by calling the `View#saveHierarchyState` and `View#restoreHierarchyState` to restore it. Defaults to `false`.
* Fixes an issue where switching pages would cause the selected annotation tool variant to be lost. (#20371)
* Fixes an issue where text form fields were not scrolled into view when displaying soft keyboard in immersive mode. (#20251)
* Fixes an issue where the redaction UI would reappear after clearing all redactions. (#20323)
* Fixes an issue where the tab bar was cut off in immersive mode. (#20341)
* Fixes an issue where the text selection popup performance degraded while using it. (#20326)
* Fixes an issue where using the "Clear All" option in the annotation list would not update the page thumbnails. (#20330)
* Fixes an issue where exporting pages from Document Editor may cause a crash when the page index is not the first. (#20331)

#### Model

* Improves loading performance for documents with complex outlines. (#20279)
* Improves the deletion behavior for note annotations with associated popup annotations. The latter used to become "orphaned". (#19853)
* Improves the document loading performance by parsing outline asynchronously. (#20171)
    * Improves `PdfDocument#getOutline()` that now parses outline on first use. This operation could take a while and should not be executed on the main thread.
    * Adds `PdfDocument#getOutlineAsync()` for parsing outline asynchronously.
    * Adds `PdfDocument#hasOutline()` that is resolved while loading document. Use this method to check whether outline is present in the document without parsing the whole outline.
* Improves the performance when loading documents with many link annotations and form fields. (#20171)
* Improves automatic repair of AcroForms when loading documents with a large number of annotations. (#19990)
* Fixes an issue where `AnnotationConfiguration#builder()` had no implementation for sound annotation configuration. (#20292)
* Fixes an issue where exiting annotation editing mode via toolbar, would call `OnAnnotationEditingModeChangeListener#onExitAnnotationEditingMode()` twice. (#20172)
* Fixes an issue where proguard consumer file was missing some rules that might cause a crash on release builds. (#20286)
* Fixes an issue where some documents signed with invisible signatures could not be validated correctly. (#20277)

#### Instant

* Fixes an issue where "Save as" share action did not work with Instant documents. (#20140)
* Fixes an issue where annotations could not be removed in Instant documents. (#20337)

#### Examples

* Fixes an infinite recursion when requesting external storage permission in Document Tabs Example in Catalog app. (#20339)
* Fixes an issue in Annotation Creation example of Catalog app where the annotation creator was always overridden even if already set. (#20253)

## Previous Releases

### 5.4.1 - 30 May 2019

#### UI

* Adds error handling for XFDF parsing in `XfdfExample`. (#20049)
* Updates the default color palettes provided when creating and editing annotations. (#19843)
* `XfdfExample` now shows how to export all annotations in the document. (#20050)
* Fixes an issue in `CustomAnnotationInspectorExample` where custom annotation color picker indicated incorrect selected color. (#20069)
* Fixes an issue where background color and border color were not displayed correctly for free text annotations while in night mode. (#20037)
* Fixes an issue where in some cases `FreeTextAnnotation` preferences were not saved correctly. (#20032)
* Fixes an issue where slider picker text values were not applied after leaving inspector. (#20043)
* Fixes an issue where text form fields could cause a `NullPointerException`. (#20084)
* Fixes an issue where some simple signatures were distorted before adding them to the document. (#20090)
* Fixes an issue with the contextual toolbars where clicking on the close button multiple times might cause a potential crash. (#20048)

#### Model

* Adds support to use LeakCanary 2 with PSPDFKit. (#20020)
* Fixes an issue that lead to the `Custom Stamp Annotations` example crashing when started. (#20044)
* Fixes an issue where JavaScript API `doc.getField()` could get into a state where it wasn't possible to retrieve newly created form fields. (#20027)
* Fixes an issue where closing the `Image Document` example might lead to crashes. (#20041)
* Fixes an issue where displaying the `PopupToolbar` close to the edge of the screen lead to animation artifacts when opening and closing the overflow menu. (#20033)
* Fixes an issue where the `AesDataProvider` provided with the Catalog sample app was not compatible with multithreaded rendering. (#19994)

#### Instant

* Fixes `NoClassDefFoundError` that occurred while creating `InstantClient`. (#20031)

### 5.4.0 - 23 May 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-android-5-4/)._

PSPDFKit is now built with Android Gradle Plugin `3.4.1` and Gradle `5.4.1`. This release adds a new transitive dependency to `androidx.palette:palette:1.0.0`.

#### UI

* API: Existing API for controlling annotation editing defaults and preferences has been replaced. (#19252)
    * All interfaces and classes in package `com.pspdfkit.annotations.defaults` have been deprecated in favor of new annotation configuration API in `com.pspdfkit.annotations.configuration`.
    * Adds `AnnotationConfigurationRegistry` which manages a list of `AnnotationConfiguration`s for each annotation type or tool. Can be retrieved via `PdfFragment#getAnnotationConfiguration()`.
    * Adds `<AnnotationType>Configuration` for each annotation type (or multiple similar types in case of `MarkupAnnotationConfiguration` and `ShapeAnnotationConfiguration`) that extends annotation configuration interfaces supported by that annotation type.
    * Adds static interface method `builder()` to all of these annotation type configuration interfaces that return builders for each configuration type. This makes configuration less verbose compared to manual implementations of annotation configurations.
    * Adds `AnnotationConfigurationExample` showing how to use this new API.
    * **Note:** If you wish to access static configuration builder methods (`<AnnotationType>Configuration#builder()`) from your Kotlin code, your Kotlin compiler must target Java 8. Please refer to our [guide](https://pspdfkit.com/guides/android/current/faq/java-8/#kotlin-and-java-8) for more details.
* Adds a new UI for picking colors allowing users to specify custom colors. (#7333)
    * Adds `androidx.palette:palette:1.0.0` as a new dependency.
    * Adds `customColorPickerEnabled()` configuration to `AnnotationColorConfiguration`, `AnnotationFillColorConfiguration`, and `AnnotationOutlineColorConfiguration`.
    * Adds `setCustomColorPickerEnabled()` to `AnnotationColorConfiguration.Builder`, `AnnotationFillColorConfiguration.Builder`, and `AnnotationOutlineColorConfiguration.Builder`.
    * Adds `getRecentlyUsedColors()` and `setRecentlyUsedColors()` to `PSPDFKitPreferences`.
    * Adds `CustomColorPickerInspectorDetailView` which provides a UI for the user to select predefined colors as well as entering their own.
    * Removes `ColorPickerInspectorDetailView.ColorPickerListener` use `ColorPickerInspectorView.ColorPickerListener` instead.
* Adds a new improved UI for displaying bookmarks to make it easier to associate a given bookmark with a page. (#19109)
    * Adds `onBookmarkAdded()´ method to `BookmarkProvider.BookmarkListener`.
* Adds magnifier widget when selecting text to make text selection more precise by unobscuring the area covered by the finger. Uses system magnifier on API 28+ and a custom magnifier implementation on older versions of Android. (#19273)
* Adds options to clear all annotations and delete single annotations to annotations outline view. (#19568)
    * Adds `PdfOutlineView#setAnnotationEditingEnabled()` to control whether this new feature is enabled.
    * Adds style attributes `pspdf__annotationsBarBackgroundColor`, `pspdf__annotationsBarIconColor`, `pspdf__annotationsDeleteIcon`, `pspdf__annotationsDeleteIconColor`, `pspdf__annotationsEditIcon`, and `pspdf__annotationsDoneIcon` to control how the new bottom bar in the annotation outline view is displayed.
* Adds options to create underline and strike out annotations to text selection popup on larger devices. (#19963)
* Adds cloudy border effects for square, circle and polygon annotations. (#9684)
    * Adds `setBorderEffect()` and `setBorderEffectIntensity()` to `Annotation`. Use these to set cloudy effect as well as its intensity programmatically.
    * Adds overrides to `BorderStylePreset` constructors that accept border effect and its intensity as parameters. Default preset and available presets in annotation inspector can be configured via `AnnotationBorderStyleConfiguration`.
    * Deprecates border style and border dash array properties from `AnnotationPreferences` and `AnnotationCreationController`. Use border style preset properties defined on both of these interfaces instead.
* Adds support for sound annotations. (#11587)
    * Adds `SoundAnnotation` model class.
    * Adds full UI support for playing and recording audio annotations, presented as an `AudioView` displayed above thumbnail bar.
    * Adds `AudioModeManager`, available via `PdfFragment#getAudioModeManager()`, for controlling sound annotation playback and recording.
    * Adds `SoundAnnotationConfiguration` that provides control over audio recording parameters.
    * Adds `AudioExtractor` for extracting audio tracks from media files.
* Adds annotation tool variants. (#10227)
    * Adds `AnnotationToolVariant` class which you can use to define the annotation tool variants. 
    * Adds `PdfFragment#enterAnnotationCreationMode()` overload that has a `AnnotationToolVariant` as parameter. This can be used to start annotation creation mode with the specified annotation tool and annotation tool variant. 
    * Adds a circular style indicator icon that displays the color and thickness defaults of the tool if to be selected.
    * Adds `AnnotationCreationToolbar.ItemToAnnotationToolMapper` class that you can register on `AnnotationCreationToolbar` via `setItemToAnnotationToolMapper()`. 
    * Adds `CustomAnnotationCreationToolbarExample` to the Catalog showcasing how to implement custom tool variants to the annotation creation toolbar properly.
    * Adds `PdfFragment#getActiveAnnotationTool()` and `PdfFragment#getActiveAnnotationToolVariant()` that will return currently active annotation tool and variant.
    * API: Ink item has been replaced with pen and highlighter variations, thus `R.id.pspdf__annotation_creation_toolbar_item_ink` has been removed from the framework, and `pspdf__annotation_creation_toolbar_item_ink_pen` and `pspdf__annotation_creation_toolbar_item_ink_highlighter` have been added.
    * API: Style attributes are updated to match new styles. Also, the one that controls ink icon has been removed (`pspdf__inkIcon`).
* Improves document scrolling performance. (#19600)
* Improves text hit detection making selecting small text easier. (#12254)
* Fixes an issue where TTS was not properly cancelled upon leaving the `PdfActivity`. (#19873)
* Fixes an issue where UI chrome covered document when using `UserInterfaceViewMode#USER_INTERFACE_VIEW_MODE_VISIBLE`. (#19939)
* Fixes an issue where media annotations with autoplay flag started playing whenever any annotation on their page changed. (#19978)
* Fixes an issue where text markup annotations could be dragged after selected via long-press gesture. (#19919)
* Fixes an issue where the `PdfTextSelectionPopupToolbar` was flickering while changing text selection. (#19962)
* Fixes an issue where exiting the annotation editing mode would discard changes from calling `setContents()` on an edited `FreeTextAnnotation` while in editing mode. (#19231)

#### Model

* Updates the Android Gradle Plugin to `3.4.1`. (#19789)
    * Updates to Gradle 5.4.1.
    * Updates all example sources to Android Gradle Plugin `3.4.1`.
    * Replaced Proguard with R8 for code optimization and minification.
* Adds `PdfConfiguration#allowMultipleBookmarksPerPage()` to allow you to configure whether users can add multiple bookmarks for a single page or not. (#19447)
* Adds `SignatureAppearance#Builder#setSignatureWatermark()` to allow you set a custom watermark for a signature appearance. (#19438)
* Adds support for the `Doc.documentFileName` JavaScript API. (#18775)
* Improves exception message that is thrown when creating form fields with non-unique fully qualified names. (#20010)
* Improves performance of pages which hold lots of objects. (#19396)
* Improves performance when executing JavaScript actions on form fields with complex interdependent validation logic. (#19661)
* Improves results from `PdfLibrary` when the exact phrase matches are requested, and a tokenizer other than the default porter tokenizer is used. (#19685)
* Improves the performance of some JavaScript calculation scripts. (#19234)
* Embedded goto actions will go to the specified page instead of going to the first page of the embedded target document. (#10963)
* Improved automatic repair of AcroForms to support more document errors. (#19834)
* Update libjpeg-turbo to 2.0.2. (#18973)
* Updates the Botan library version to 2.10.0. (#19767)
* Fixes a potential crash when processing large documents under low-memory conditions. (#19768)
* Fixes an issue creating form fields where some fields could not be retrieved later by their original keys. (#19945)
* Fixes an issue in the redaction of documents with monochrome inline images. (#19579)
* Fixes an issue when sharing a document that resulted in blank pages. (#19267)
* Fixes an issue where “No document set” was displayed in certain circumstances when resuming destroyed `PdfActivity` without a redaction license. (#19777)
* Fixes an issue where QuadPoints of link annotations were saved to the PDF incorrectly. (#19427)
* Fixes an issue where `DocumentListener#onPageUpdated()` was not called in certain circumstances. (#19781)
* Fixes an issue where annotations created by Apple Preview may not be copied and pasted correctly. (#19154)
* Fixes an issue where configuration changes while signing a document could lead to a crash. (#19281)
* Fixes an issue where image annotations were not added when the permission dialog was shown before. (#19589)
* Fixes an issue where in rare circumstances pasting content from Microsoft Word would throw an unhandled exception. (#19842)
* Fixes an issue where link annotations may not work correctly after a document is exported. (#19222)
* Fixes an issue where malformed widget annotations weren't correctly attached to the form. (#19581)
* Fixes an issue where read-only checkboxes may not be rendered correctly. (#19506)
* Fixes an issue where some JPX images may not render correctly. (#18648)
* Fixes an issue where text edited in form fields was incorrectly set in other form fields as well. (#19236)
* Fixes an issue where the `fillColor` property was ignored in Instant JSON for polyline annotations. (#19443)
* Fixes an issue where the redaction text may not be correctly added in some scenarios. (#19703)
* Fixes an issue with text markup alignment on accented characters. (#18214)

#### Instant

* Fixes an issue where multiple authentication requests for the same layer could be running concurrently. Under certain circumstances, this could cause multiple concurrent sync requests for the same layer, too. (#18698)

#### Examples

* Adds new `MergeDocumentsExample` showing how to use the document processor to merge documents. (#19300)
* Fixes a broken link in the Instant Catalog example. (#19822)

## Previous Releases

### 5.3.1 - 11 Apr 2019

#### UI

* Adds `showPageTemplatesLast` setting to `NewPageDialog#show`, `NewPageDialog#restore`, and `DialogNewPageFactory()` which, if set to `true`, diplays custom page templates after page patterns provided by default. (#19433)
* Adds style attribute `pspdf__itemRippleBackgroundColor` to the `pspdf__ThumbnailGrid` styleable, to change the ripple color for the `ThumbnailGrid` item selection. (#19111)
* Improves performance when editing line, polyline and polygon annotations. (#19483)
* Size of created ink signatures is now relative to page size. (#19497)
* Fixes an issue where `DocumentListener#onPageUpdated` was not being called after creating ink signatures. (#19512)
* Fixes an issue where `OnAnnotationUpdatedListener#onAnnotationUpdated` was called repeatedly when modifying line, polyline and polygon annotations. (#19384)
* Fixes an issue where changes made to callout lines could not be properly undone. (#19091)
* Fixes an issue where ink annotations would not be visible if leaving the page before exiting the annotation creation mode. (#19509)
* Fixes an issue where malformed URIs were not properly managed and were leading to a crash when opening image documents. (#19432)
* Fixes an issue where minimal size of free-text annotations with thick border and/or large text size was too small. (#19294, #19297)
* Fixes an issue where stamps and free text annotations added to rotated pages were not working properly. (#19327)

#### Model

* Adds `NewPage#hasPdfPageSource` and `NewPage#hasPatternSource` to help determine the source of the new page created using `NewPageDialog`. (#19510)
* Improves the performance of documents with JavaScript interactivity in many common scenarios. (#19119)
* Optimizes storage size of magic ink template file. (#19453)
* Reverts AndroidX Recycler View to a stable version `1.0.0`. (#19455)
* Fixes a problem where a form field that is made visible by a JavaScript script may not show its formatted appearance. (#19119)
* Fixes a rare issue when parsing outlines. (#19469)
* Fixes an issue where border width and border dash array of free-text annotations were not serialized properly to Instant JSON. (#19409)
* Fixes an issue where entering text after a PDF document script has executed may not work correctly. (#19119)
* Fixes an issue where free-text annotation with border was always rendered with non-transparent color. (#19097)
* Fixes an issue where stamps with custom ap streams were added with the wrong rotation on rotated PDF pages. (#19351)

### 5.3.0 - 26 Mar 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-android-5-3/)._

#### UI

* Deprecates `PdfFragment#setAnnotationDefaultsProvider()`. Use methods defined on `AnnotationDefaultsManager` that can be retrieved via `PdfFragment#getAnnotationDefaults()`. (#19124)
* Adds a new Magic Ink tool that recognizes drawn shapes and converts them to shape annotations. (#18925)
* Adds support for configuring the preview shown by video annotations using `coverMode` and `coverImage` options. (#18206)
* Ink drawing is now automatically split into ink annotations based on strokes timing and distance between drawn points. (#13019)
    * Adds new defaults provider `AnnotationAggregationStrategyDefaultsProvider` that can be implemented for ink annotations to control ink splitting strategy.
* Improves `PdfActivity` startup time by optimizing `PdfOutlineView` creation and configuration. (#19121)
* Improves annotation hit detection by using the actual shape of annotations instead of their bounding boxes to check if they have been selected. (#8782)
* Improves zooming behavior of stamp annotations with `NOZOOM` flag by moving their zoom anchor point to the annotation center. (#18983)
* Fixes an issue where adding a new signature to the signature form field followed by the device rotation, would not invoke `OnAnnotationUpdatedListener#onAnnotationCreated()` callback. (#18948)
* Fixes an issue where note editor for stamp annotations had transparent color. (#19094)
* Fixes an issue where stamp annotations with `NOZOOM` flag were rendered incorrectly at high zoom levels. (#19166)
* Fixes the top and bottom paddings for the settings view picker mode view. (#19257)

#### Model

* API: Adds methods for converting `Signature` into `JSONObject` and vice-versa: (#18794)
    * Adds static creator `Signature#fromJson()` (with or without a specified id) that parses the provided `JSONObject` and creates a respective `Signature`.
    * Adds `Signature#toJson()` method that converts the given `Signature` to the `JSONObject`.
* Adds `FontStyle` to Instant JSON widget annotations. (#18083)
* Adds `OnSignaturePickedListener#onSignatureCreated()` to allow you to get notified when a new signature was created. (#19001)
* Adds a `customData` property to `Annotation`. This property can be used to store user-specified data related to Annotations. (#18927)
* Adds async method `executeDocumentLevelScriptsAsync()` to `JavaScriptProvider`. (#18892)
* Adds support for modifying form fields and annotation widgets to Instant Document JSON. (#18771)
* Improves startup performance of PSPDFKit. (#19138)
* Improves the performance of documents with JavaScript interactivity in many common scenarios. (#19119)
* Loading PDF actions is now more reliable. (#18843)
* Update ICU to version 63.1. (#18974)
* Update libpng to 1.6.36. (#18972)
* Update zlib to 1.2.11. (#18975)
* Updates AndroidX Recycler View to 1.1.0-alpha02. (#19100)
* Updates build system dependencies. (#18912)
    * Updates Gradle to 5.2.1.
    * Updates the Android Gradle Plugin to 3.3.1.
* Fixes an issue where form fields that were made visible using JavaScript would not show their formatted appearance. (#19119)
* Fixes an issue exporting Instant shape annotations with transparent stroke colors. (#19120)
* Fixes an issue when drawing a path using a pattern with alpha transparency. (#19148)
* Fixes an issue when rendering text with an overlay blend mode. (#19151)
* Fixes an issue when setting transparent colors in annotations. (#19120)
* Fixes an issue where adding pages with forms using the `PdfProcessor` resulted in no AcroForms dictionary being added to the resulting document. (#18517)
* Fixes an issue where asynchronous layout callbacks were sometimes executed after `onStop` causing a crash. (#19206)
* Fixes an issue where documents could get opened with outdated changes after saving. (#18845)
* Fixes an issue where entering text after a PDF document script has executed didn't work correctly. (#19119)
* Fixes an issue where some layers were hidden incorrectly. (#14439)
* Fixes an issue where some memory may be leaked after running a script. (#19016)
* Fixes an issue where using `PdfDocument#save(path)` would result in corrupt digital signatures in the output document. (#18689)
* Fixes an issue with instant ink annotation not being sent to clients. (#19325)
* Fixes rendering of free text annotations with vertical alignment. (#19145)

#### Examples

* Improves Catalog app example list. (#19193)
    * Catalog app now uses `RecyclerView` instead of `ListView`.
    * Adds sticky headers for section titles.
    * Displays a toast with the class name when an example is long pressed.
* Improves Catalog app startup performance and adds splash screen. (#19162)

### 5.2.1 - 28 Feb 2019

#### UI

* Fixes AutoCAD SHX Text comments being displayed. (#15690)
* Fixes a potential usage of a recycled bitmap in `PdfThumbnailBar`. (#18885)
* Fixes an issue where `ImageDocumentExample` in the Catalog was stuck on loading screen when opened multiple times. (#18844)
* Fixes an issue where `FormsJavaScriptExample` in the Catalog app launched multiple instances of `FormsJavaScriptActivity` at the same time. (#18883)
* Fixes an issue where contextual toolbars were not updating their internal state when receiving calls to `ContextualToolbar#setDraggable(boolean)`. (#18800)
* Fixes an issue where deleting annotation notes would trigger unhandled exceptions when using licenses without Replies feature. (#18955)
* Fixes an issue where filling text form fields wasn't possible while JavaScript was disabled. (#19008)
* Fixes an issue where redactions created using the redaction tool did not remove text from the page. (#18841)
* Fixes an issue where rotating the device while adding an image stamp prevented the stamp from being added. (#18802)
* Fixes an issue where the current selection of pages in the document editor was not restored after orientation changes. (#16730)
* Fixes an issue where items in contextual toolbars did not have a selection feedback after the toolbar had been repositioned. (#19065)
* Fixes an issue where the item representing 'More items' in the contextual toolbar was not styled with the correct colors by `R.attr#pspdf__contextualToolbarStyle`. (#18661)
* Fixes an issue with `SignaturePickerOrientation.AUTOMATIC` and `SignaturePickerOrientation.LOCKED_LANDSCAPE` where `SignaturePickerDialog` was shown rotated even when the device was already in landscape mode. (#18801)
* Fixes an issue with highlight annotations where the opacity was not updated correctly when modified and the highlighted text was aggregated into another annotation. (#18895)
* Fixes volume rocker navigation not working properly in double page mode. (#18827)

#### Model

* Fixes an issue where a form field with custom formatting was not formatted correctly after it was exported and re-imported as XFDF. (#18791)
* Fixes an issue where hiding form field via JavaScript did not work. (#18882)
* Fixes an issue where removing default menu items from the `PdfActivity` in `onGenerateMenuItemIds` or `onCreateOptionsMenu` caused the application to crash. (#18837)
* Fixes an issue where the image of a push button may be displaced in some cases. (#18932)

#### Instant

* Fixes an issue where changing annotation properties inside note editor could change unrelated annotations. (#18954)

### 5.2.0 - 06 Feb 2019

_See the [announcement post](/blog/2019/pspdfkit-android-5-2/)._

#### UI

* Improves handling custom menu items in the main menu toolbar of `PdfActivity`. (#6056)
    * API: Removes `PdfActivityMenuManager` class.
    * API: Removes `PdfActivity#getActivityMenuManager()` method.
    * Adds `onGenerateMenuItemIds()` method to the `PdfActivity` that you can override to provide a custom menu item order.
    * Updates the `CustomActionsActivity` example in the catalog with a new way to handle custom menu items.
    * `onPrepareOptionsMenu()` no longer clears menu items added in `onCreateOptionsMenu()`. You should use `onCreateOptionsMenu()` to create your custom menu items and use `onPrepareOptionsMenu()` only to modify state of these items when the menu gets shown.
* Adds support for defining custom signature storages. (#18144)
    * Adds `SignatureStorage` interface which you can implement to create your own signature storage.
    * Adds `DatabaseSignatureStorage` which is our default signature storage implementation that uses SQLite.
    * Adds `PdfFragment#[set/get]SignatureStorage` for setting and retrieving the default signature storage. It is the signature storage that will be used when the signature picker is displayed.
* Adds `PdfFragment#setDocumentInteractionEnabled()` and `PdfActivity#setDocumentInteractionEnabled()` to control whether the document view will accept inputs or not. (#18135)
* Adds `PdfFragment#setUserInterfaceEnabled()` and `PdfActivity#setUserInterfaceEnabled()` to control whether the UI will accept inputs or not. (#16791)
* Adds `PdfLibrary.get(path, tokenizer)` to specify the tokenizer to use for full text search. (#18054)
    * Adds `PORTER_TOKENIZER` and `UNICODE_TOKENIZER` constants to specify the tokenizer.
* Adds `isFormElementClickable()` to `OnFormElementClickedListener` that can be used to prevent clicks on form elements. (#16305)
    * Extends `CustomInkSignatureExample` with an example of how to disable click handling for signature fields.
* Adds support for customizing tab bar titles when showing multiple documents by using `DocumentDescriptor#setTitle(String)`. Includes example in Catalog app `Tabbed Documents` showing how to customize a tab bar title. (#18593)
* Improves automatic font size calculation for text widgets. (#18095)
* Improves copy and paste by making sure pasted annotations have a unique name. (#18525)
* Improves tab bar items by fully displaying the title and adopting ellipsis only when text length goes over `480dp`. (#18677)
* Annotation replies are now created with `HIDDEN` flag set. This fixes an issue where they were incorrectly rendered in thumbnails. (#17349)
* Sets minimum size for resizable catalog activities. See `<layout>` tag of the `MainActivity` declaration in `AndroidManifest.xml` of the catalog app. (#18406)
* Fixes an issue where annotation note icon did not move together with annotations. (#16976)
* Fixes an issue where delete button in annotation replies editor did not delete annotation replies for non-note annotations. (#16977)
* Fixes an issue where it wasn't possible to input comma as decimal separator into form fields. (#17605)
* Fixes an issue where redo was prevented when undoing text while editing free-text annotation. (#18478)
* Fixes an issue where scaling down and the scaling up ink annotations causes the line width to get thicker. (#18645)
* Fixes an issue where scrollable thumbnail bar was not changing page when a thumbnail was tapped. (#18511)
* Fixes an issue where squiggly, underline and strikeout annotations could get displayed with opaque white background in annotation overlay. (#18737)
* Fixes an issue where stamps could not be rotated correctly. (#18488)
* Fixes an issue where text form fields with automatic text size did not fit to field width while editing. (#18594)
* Fixes an issue where text selection highlight color had low contrast on inverted pages. (#18742)
* Fixes an issue where view focus inside the reply editor was not handled properly on OnePlus devices running Oxygen OS. (#18480)

#### Model

* API: Adds control over PSPDFKit's logging. (#16502)
    * Adds `PdfLog` as an entry point for the new logging API.
    * You can now achieve custom logging behavior by implementing `PdfLog.Logger` interface and registering this logger using `addLogger()` or `setLoggers()` methods in `PdfLog`.
    * Deprecates `PSPDFKit#setLoggingEnabled()`. Use `PdfLog#removeAllLoggers()` or custom `Logger` that ignores all messages.
    * PSPDFKit now logs all messages with priority higher than info (info, warn, error and assert) to LogCat by default. You can prevent this changed behavior by disabling logging or by stripping all calls to `PdfLog` logging methods with proguard.
* Adds support for multithreaded rendering. Multithreaded rendering takes full advantage of multiple CPUs available on the device. This improves page rendering performance in most cases. (#18209, #18274)
    * Adds `setMultithreadedRenderingEnabled()` to `PdfConfiguration.Builder` and `PdfActivityConfiguration.Builder` to control whether multithreaded rendering should be enabled for loaded documents.
    * Adds `multithreadedRenderingEnabled` parameters to open methods in `PdfDocumentLoader` to control whether multithreaded rendering should be enabled for loaded document.
* Adds `SignatureAppearance` to configure how digital signatures look. (#18438)
    * Adds `SignatureGraphic` to embed a custom graphic into the digital signature.
    * Adds overloads to `Signer#signFormField[Async]()` that take a `SignatureAppearance`.
    * Adds `Pdf[Activity]Configuration#signatureAppearance()` to configure the appearance for every signature added.
* Adds `SignatureMetadata` for attaching additional metadata to digital signatures. (#18733)
    * Adds `PdfFragment#setSignatureMetadata()` for setting the metadata to use when signing via the provided UI.
    * Adds `SignatureSignerDialog.Builder#signatureMetadata()` for setting the metadata to use when signing.
    * Adds `SignerOptions` for use with `Signer#signFormField[Async]()`.
    * Deprecates overloads of `Signer#signFormField[Async]()` that don't take `SignerOptions`, use the new overloads using `SignerOptions` instead.
* Adds `Annotation#getCopy()` method to allow creating copies of annotations programatically. (#18193)
* Adds support for cloudy borders in shape annotations and free text annotations via Instant JSON. (#18547)
* Adds support for the `doc.removeField` JavaScript API. (#18621)
* Improves initial text parsing performance. (#18534)
* Improves performance when looking up fonts. (#17981)
* Fix an issue in full-text search that could cause a deadlock during indexing. (#18750)
* Update SQLite to 3.26.0. (#18462)
* Updates Kotlin to 1.3.20. (#18668)
* Updates the Botan library to version 2.9.0. (#18271)
* Starts using app name in JavaScript alerts. (#18529)
* Fixes a bug where annotations parsed from XFDF would be displayed incorrectly on a rotated page. (#17603)
* Fixes a potential `NullPointerException` caused by invoking a method on an internal copy/paste handler. (#18446)
* Fixes a problem importing/exporting color values. This could lead to unnecessary appearance stream regeneration. (#18428)
* Fixes an issue where calling `DocumentJSONFormatter#importDocumentJson(PdfDocument, DataProvider)` and its asynchronous companion would seemingly succeed when the JSON to be applied was (partially) invalid. (#18630)
* Fixes an issue where fragment transaction would be committed after the parent component saves its state, causing an app to be in an illegal state. (#18420)
* Fixes an issue where listeners set on `SignaturePickerFragment` were replaced by the framework under certain circumstances. (#18625)
* Fixes an issue where sharing documents with digital signatures causes the signatures to get corrupted. (#18250)
* Fixes an issue with Image Documents when images have an orientation. (#17791)
* Fixes an issue with Image Documents when saving back to an already rotated image. (#18483)
* Fixes text markup annotations being created incorrectly on rotated pages with text that appears the right way up. (#18219, Z#11941)

### 5.1.2 - 17 Jan 2019

#### UI

* Hides annotation inspector button in the annotation creation toolbar when creating note annotations. (#18269)
* Fixes an issue where annotation creation mode is exited when changing pages. (#18252)
* Fixes an issue where note annotation editor buttons were not working properly after activity was stopped. (#18247)
* Fixes an issue where note annotation editor background color did not reflect annotation color. (#18246)
* Fixes an issue where the text selection toolbar overlaps the selected text when immersive mode is enabled. (#18258)
* Fixes an issue where `PdfActivity` wasn't correctly restoring its state during activity recreation. (#18425)

#### Model

* Fixes an issue that could lead to errors when loading image documents from files with corrupted XMP data. (#18110)
* Fixes an issue where redaction of a monochrome image could unexpectedly change its color. (#18176)
* Fixes an issue where searching and navigating specific documents could lead to high memory use. (#18118)

#### Instant

* Fixes an exception that could be thrown when loading Instant documents in multi-window mode. (#18484)

#### Examples

* Fixes a crash inside the "Custom Inline Search" Catalog example. (#18486)

### 5.1.1 - 20 Dec 2018

#### UI

* Disables the rotation handle for stamp annotations with custom appearance stream generators since rotation is not supported yet. (#18013)
* Fixes an issue where `PdfFragment#scrollTo()` would also zoom out the page instead of just scrolling to the specified location. (#17816)
* Fixes an issue where the digital certificate selection was erroneously shown when adding ink signatures outside of a form field. (#18014)
* Fixes an issue where the signing dialog is not rotated to landscape when ´SignatureSavingStrategy.NEVER_SAVE` is set. (#18020)
* Fixes asymmetric vertical padding on the settings mode picker which resulted in UI glitches when hiding specific settings. (#13497)
* Fixes a possible `NullPointerException` that could occur when switching out of signature creation mode. (#18153)
* Fixes an issue where copying a `PdfActivityConfiguration` using its `Builder`'s copy constructor would alter fields in the resulting copy. (#18158)

#### Model

* API: `BookmarkProvider#[add/remove]Bookmark[Async]()` now throws an exception if there was an error while modifying the bookmark list. (#17710)
    * Changes `BookmarkProvider#addBookmark()` to return a boolean indicating if the bookmark was added.
* Adds `PdfFragment#getImageDocument()` for retrieving a loaded `ImageDocument` instance. (#18131)
* Fixes an issue where redacting certain kinds of vector graphics may incorrectly redact part of the background. (#18071)
* Fixes an issue where the JavaScript method Doc.print may not work correctly. (#18111)
* Fixes an issue which could cause broken path renderings in specific edge-case scenarios. (#18145)
* Fixes some visualization issues with markup annotations, specially on rotated pages. (#12927, #16794, #17889, #18002, #18024)

#### Instant

* Fixes an issue where Proguard would fail when applied on an app integrating Instant. (#18100)

### 5.1.0 - 13 Dec 2018

#### UI

* Adds free-form redaction support to the existing redaction tool for redacting images and annotations from a page. (#17413)
* Adds `PdfThumbnailGrid.OnDocumentSavedListener` that gets notified whenever the document gets saved inside the document editor. (#17401)
    * Adds `setOnDocumentSavedListener()` to `PdfThumbnailGrid` for setting the listener.
* Adds unified configuration for all supported sharing features. (#16544)
    * Adds `setEnabledShareFeatures()` to `PdfActivityConfiguration.Builder` and `PdfConfiguration.Builder`. 
    * Deprecates `isShareEnabled()` in `PdfActivityConfiguration`. Use `PdfConfiguration#getEnabledShareFeatures()` instead.
    * Deprecates `enableShare()` and `disableShare()` in `PdfActivityConfiguration.Builder`. Use `PdfActivityConfiguration.Builder#setEnabledShareFeatures()` instead.
    * Deprecates `isTextSharingEnabled()`, `isEmbeddedFilesSharingEnabled` and `isSharingNoteEditorContentEnabled()` in `PdfConfiguration`. Use `PdfConfiguration#getEnabledShareFeatures()` instead.
    * Deprecates `textSharingEnabled()`, `embeddedFileSharingEnabled()` and `sharingNoteEditorContentEnabled` in `PdfConfiguration.Builder`. Use `PdfConfiguration.Builder#setEnabledShareFeatures()` instead.
* Adds getter to return redaction button width. (#17697)
    * Fixes an issue where redaction button was overlapping forward history button.
    * Improves redaction button alignment in portrait and landscape.
    * Implements `OnRedactionButtonVisibilityChangedListener` for receiving calls when redaction collapses or expands.
* Adds message that is shown when using the document editor with redactions in the document. (#17559)
* API: Improves signing dialog by adding options that control the visibility of 'Store signature' checkbox and a signer chip (used to select the signer when digitally signing the document). (#15544)
    * Adds `SignatureSavingStrategy` enum that declares the strategy when saving the signature. The 'Store Signature' checkbox is shown only if `SignatureSavingStrategy.SAVE_IF_SELECTED` is set.
    * Adds `SignatureCertificateSelectionMode` enum that controls how adding the certificate is presenter in the UI. It can show the certificate selection dropdown always, never or only when certificates are available.
    * `SignatureSavingStrategy` is set via `signatureSavingStrategy()` in `PdfConfiguration.Builder` and `PdfActivityConfiguration.Builder`.
    * `SignatureCertificateSelectionMode` is set via `signatureCertificateSelectionMode()` in `PdfConfiguration.Builder` and `PdfActivityConfiguration.Builder`.
    * Deprecates `setSignatureSavingEnabled()` in `PdfConfiguration.Builder` and `PdfActivityConfiguration.Builder`.
    * Deprecates `setCustomerSignatureFeatureEnabled()` in `PdfConfiguration.Builder` and `PdfActivityConfiguration.Builder`.
* API: Updates the `SignaturePickerFragment` API to reflect new changes implemented in #15544, which adds new parameters to the signature UI, as whether to show 'Store signature' button or not, etc. (#18079)
    * Adds `SignatureOptions` that define stuff like signature saving strategy, signature picker orientation etc. Use `SignatureOptions.Builder` to build it.
    * Adds additional `SignaturePickerFragment#show()` method that takes in the `SignatureOptions` object, through which you can configure the signing UI.
    * Adds `SignaturePickerFragment#dismiss()` method which you can use to hide the `SignaturePickerFragment`.
    * Deprecates `SignaturePickerFragment#showSignaturePicker()`. The picker fragment should not be added manually with the tag anymore. You should just use `SignaturePickerFragment#show()` to show the picker and `SignaturePickerFragment#restore()` to restore it. The framework would take care of the actual fragment retrieval.
    * Deprecates `SignaturePickerFragment#setSignaturePickerOrientation()`, use `SignatureOptions` for that.
* Improves `PdfActivity` by allowing it to be started without loading a document. (#16601)
    * Adds `PdfActivityIntentBuilder.emptyActivity()` to start a `PdfActivity` with no document loaded.
    * API: `PdfActivity#getFragment()` and `PSPDFKitViews#getFragment()` are now `@Nullable` since no `PdfFragment` is created when starting the activity without an document.
* Improves `PdfFragment` by allowing editing existing annotations without setting an author name first. (#17972)
* Improves document opening performance by making loading of `PdfDrawables` asynchronous. (#17648)
* Removes color name from the color and icon picker in the note editor. (#17701)
* Fixes a potential `NullPointerException` in `PdfScrollableThumbnailBar`. (#17828)
* Fixes a potential `NullPointerException` on pages with video content. (#17861)
* Fixes a potential `UnsatisfiedLinkError` that could be thrown when accessing `StampType` class. (#17702)
* Fixes a potential crash that could occur when undoing rotated annotations. (#17862)
* Fixes an issue where `PdfProcessorTask` with large number of operations could cause a `StackOverflowError`. (#17847)
* Fixes an issue where annotation defaults for `AnnotationTool.NOTE` were not applied to the new note editor UI. (#17669)
* Fixes an issue where current state of the viewed document (page, zoom level etc.) has been lost after reloading the document when saving document editor changes. (#17368)
* Fixes an issue where deselecting annotations by clicking on non-editable annotations was not working properly. (#18034)
* Fixes an issue where dynamically added videos with autoplay enabled were not playing after opening the page. (#17875)
* Fixes an issue where exif metadata was sometimes not correctly loaded when adding image stamps, causing them to be rotated the wrong way around. (#11750)
* Fixes an issue where rotations could not be perfomed on stamp annotations after saving. (#17768)
* Fixes an issue where the toolbar shown when longpressing the page could randomly flicker. (#18010)

#### Model

* Adds support for text search compare options. (#13736, #13729)
    * Adds `compareOptions()` method to `SearchOptions.Builder` for configuring compare options.
    * Adds `CompareOptions` enum with all supported compare options.
      * `CASE_INSENSITIVE` enables case insensitive search.
      * `DIACRITICS_INSENSITIVE` enables diacritics insensitive search.
      * `SMART_SEARCH` enables smart search that ignores white-spaces, hyphens and resolves typographic quotes or apostrophes.
      * `REGULAR_EXPRESSION` enables regular expression search.
* API: Changes `XfdfFormatter#writeXfdf[Async]()` to throw an exception when annotations that are not attached to the document are passed in. (#17786)
* API: Deprecates constructors of `TextSearch` and `SearchOptions.Builder` accepting `Context`. Use overloaded constructors without this parameter. (#17646)
* Adds `OutputStreamAdapter` which allows you to use any `WritableDataProvider` in place of an `OutputStream`. (#16532)
    * Adds `DirectWritingStrategy` for use with `OutputStreamAdapter`.
    * Adds `TempFileWritingStrategy` for use with `OutputStreamAdapter`.
* Adds compatibility of PSPDFKit and Instant Javadoc .jar files with Android Studio 3.2.1 and newer. (#17850)
* Adds support for page bookmarks in compound documents. (#11008)
* Adds support for stamp and free text annotation rotation in Instant JSON. (#18019)
* Improves compatibility with forms on malformed PDFs. (#17707)
* Improves handling of malformed documents when parsing the extended graphics state. (#18057)
* Improves the `PdfActivityConfiguration` returned by `ImageDocumentLoader#getDefaultImageDocumentActivityConfiguration()` by disabling annotations tools that do not work for image documents. (#17775)
* Replaces support libraries with AndroidX. (#17830)
* The redaction feature now deletes annotations and form fields that intersect with a redact annotation. (#17390)
* Updates Kotlin to `1.3.0`. (#17784)
* Updates RxJava to 2.2.4. (#17902)
* Fixes `PdfActivity#isImageDocument()` returning `false` for image documents in certain cases when switching tabs. (#17524)
* Fixes a crash parsing text on a very small number of documents. (#18032)
* Fixes a potential exception that could occur when resolving system fonts on some devices. (#17647)
* Fixes a problem where some text in a PDF document may be redacted incorrectly. (#17699)
* Fixes an issue applying redactions on encrypted documents. (#17722)
* Fixes an issue opening certain documents with invalid IRT fields. (#17797)
* Fixes an issue that may happen after copying a page using the document editor. (#17825)
* Fixes an issue when opening a rotated Image Document. (#17791)
* Fixes an issue where XMP metadata was corrupted when saving password protected documents. This enables saving bookmarks into password protected documents. (#17238)
* Fixes an issue where `PdfLibrary` would return incorrect results when searching within documents that contained Unicode surrogate pairs (like Emoji) in their text. (#3292)
* Fixes an issue where changing the button caption property of a button from JavaScript code may not change the button appearance. (#17719)
* Fixes an issue where it wasn't possible to reset annotation rotation to 0 which as causing issues when undoing stamp rotations. (#17867)
* Fixes an issue where squiggly annotations may not be created correctly on rotated pages. (#17950)
* Fixes an issue where text could not be selected in certain documents. (#17759)
* Fixes an issue where the Javascript VM init sequence prevented errors from bubbling up to the user. (#17745)
* Fixes an issue where the overlay text of a redaction may not be in the correct place in some cases. (#17695)
* Fixes an issue where the signature overlay may show incorrect text in non-Western languages. (#17918)
* Fixes an issue where underline annotations may not work correctly on rotated pages. (#14252)
* Fixes an occasional issue when rendering text. (#17747)
* Fixes issue where digitally signing a document would save changes to original document even when auto save was disabled. (#17696)
* Fixes issues when importing annotations on rotated pages using InstantJSON. (#17814)
* Fixes some issues creating highlight annotations on documents with rotated pages. (#18006)

#### Instant

* Adds support for image stamp annotations. (#17691)

#### Examples

* Bumps Android Gradle Plugin version of all example apps to 3.2.1. (#17818)

### 5.0.2 - 29 Nov 2018

#### UI

* Improves redaction button placement. (#17697)
    * Fixes an issue where redaction button was overlapping forward history button.
    * Improves redaction button alignment in portrait and landscape.
    * Implements `OnRedactionButtonVisibilityChangedListener` for receiving calls when redaction collapses or expands.
* Improves document opening performance by making loading of `PdfDrawables` asynchronous. (#17648)
* Fixes a potential `UnsatisfiedLinkError` that could be thrown when accessing `StampType` class. (#17702)
* Fixes an issue where rotations could not be perfomed on stamp annotations after saving. (#17768)
* Fixes a potential `NullPointerException` in `PdfScrollableThumbnailBar`. (#17828)
* Fixes an issue where `PdfProcessorTask` with large number of operations could cause a `StackOverflowError`. (#17847)
* Fixes a potential `NullPointerException` on pages with video content. (#17861)
* Fixes a potential crash that could occur when undoing rotated annotations. (#17862)
* Fixes an issue where dynamically added videos with autoplay enabled were not playing after opening the page. (#17875)

#### Model

* Adds compatibility of PSPDFKit and Instant Javadoc .jar files with Android Studio 3.2.1 and newer. (#17850)
* Fixes an issue where underline annotations may not work correctly on rotated pages. (#14252)
* Fixes `PdfActivity#isImageDocument()` returning `false` for image documents in certain cases when switching tabs. (#17524)
* Fixes a potential exception that could occur when resolving system fonts on some devices. (#17647)
* Fixes an issue applying redactions on encrypted documents. (#17722)
* Fixes a potential issue when rendering images. (#17737)
* Fixes an occasional issue when rendering text. (#17747)
* Fixes an issue where text could not be selected in certain documents. (#17759)
* Fixes an issue where it wasn't possible to reset annotation rotation to 0. (#17867)
    * This caused an issue with undoing stamps rotation.
* Fixes issue where digitally signing a document would save changes to original document even when auto save was disabled. (#17696)

### 5.0.1 - 14 Nov 2018

#### UI

* Adds missing public theme attribute `pspdf__redactionIcon` for styling the icon of the redaction view. (#17585)
* Adds support for video and gallery playback from the local device file system. (#17433)
* Adds support for adding signatures inside the `PdfFragment` in hosting activities that are configured to handle orientation changes themself (e.g. using `android:configChanges="orientation"` inside the manifest). (#17152)
* Improves performance while entering text using a non-latin font into form fields. (#17593)
* Fixes an exception that occured when using `PdfThumbnailGrid` from within `Fragment`. (#17396)
* Fixes an issue inserting Emoji, Arabic or East Asian text in form fields. (#17574)
* Fixes an issue where locked, hidden, or read-only ink annotations could be erased with the eraser tool. (#17367)
* Fixes an issue where wrong recycling of bitmaps could in some situations lead to unhandled `NullPonterExceptions`. (#17556)

#### Model

* Fixes a crash that could happen when trying to generate the appearance stream of a push button. (#17627)
* Fixes an issue where memory was leaked in certain situations. (#17610)
* Fixes crash that could happen when changing text in multiline form field. (#17649)

#### Examples

* Adds `DynamicMultimediaAnnotationsExample` showing how to dynamically add videos and galleries to PDF documents. (#17433)

### 5.0.0 - 7 Nov 2018

This release features two new components - [Redaction](/pdf-sdk/redaction/#android) and [Comparison](/pdf-sdk/comparison/#android). If you would like to add either to your license, [ping our sales team](https://pspdfkit.com/support/request/) to receive a quote.

Below is a summary of the API changes in this release. For a full list, with our suggested migration strategy for each API that has been changed or removed, please see the [migration guide](/guides/android/current/migration-guides/pspdfkit-5-migration-guide/).

#### UI

* API: PSPDFKit now ships with `public.txt` that contains all Android resources that are considered part of its public API. If lint starts emitting warnings in your code, you should stop using (#3809)
    these resources immediately because they could be removed in future versions.
* Extends `PdfActivityIntentBuilder` with an ability to open multiple tabs in a single `PdfActivity`. (#17151)
    * Adds `fromDocumentDescriptor()` factory method for creating intent builder with multiple documents that should be displayed as tabs.
    * Adds `visibleDocument()` that can be used to control which document should be visible when `PdfActivity` starts.
    * `contentSignatures()` and `passwords()` now throw `IllegalStateException` when used with image documents or when using document descriptors via the factory method mentioned above.
* Adds `pspdf__popupToolbarStyle` style attribute for styling the popup toolbars (text selection, pasting text, etc.), the supported attributes are: (#17440)
    * `pspdf__backgroundColor` for setting the background color of the popup toolbar
    * `pspdf__itemTint` for setting the tint (icon and/or text color) of the toolbar items when they're enabled
    * `pspdf__itemTintDisabled` for setting the tint (icon and/or text color) of the toolbar items when they're disabled
* Adds document import feature to Document Editor. (#14868)
    * Adds support for `Intent#ACTION_OPEN_DOCUMENT` and `Intent#ACTION_CREATE_DOCUMENT` to `DefaultFilePicker#getDestinationUri(String)`.
* Improves default themes and styles. (#16089)
    * Dark theme now uses white text instead of colored accent for easier readability.
    * Styles for PSPDFKit views now pick `android:colorBackground` and `android:colorForeground` from your theme as defaults for background and foreground colors.
    * Adds `MainToolbar` that uses `pspdf__MainToolbarStyle` from your theme for easy toolbar theming. Take a look at `pspdf__MainToolbar` styleable for all supported attributes.
    * Removes theme attributes `pspdf__mainToolbarTextColor`, `pspdf__mainToolbarTheme` and `pspdf__mainToolbarPopupTheme`. Use `pspdf__textColor`, `pspdf__toolbarTheme` and `pspdf__tolbarPopupTheme` in the `pspdf__mainToolbarStyle` instead.
    * Adds `pspdf__contextualToolbarStyle` to theme for contextual toolbars styling. Take a look at `pspdf__ContextualToolbar` styleable for all supported attributes.
    * Removes theme attributes `pspdf__contextualToolbarBackground` and `pspdf__contextualToolbarSubmenuBackground`. Use `pspdf__backgroundColor` and `pspdf__submenuBackgroundColor` in the `pspdf__ContextualToolbarStyle` instead.
    * Icon colors of all contextual toolbars now default to `pspdf__iconColor` and `pspdf__iconColorActivated` that can be set in the `pspdf__ContextualToolbarStyle`.
* Improves document scrolling performance by delaying the high-res page rendering until the scrolling has stopped. (#17031)
* Improves signature handling by preventing overlapping signatures on signature form fields. (#16827)
* Improves the rendering support of push buttons. (#16507)
* Improves user experience while filling form fields that did not specify font size. (#17037)
* Cleans up naming scheme of styles that are part of default themes. (#14958)
    * Renames all styles with the name scheme `pspdf__styleName` defined in `styles.xml` to `PSPDFKit.StyleName`.
    * Renames all styles with the name scheme `PSPDFKit.Theme.Dark.StyleName` defined in `dark_theme.xml` to `PSPDFKit.StyleName.Dark`.
* Moves `NavigationBackStack` to `com.pspdfkit.ui.navigation`. (#16851)
* Removes `EventBus` and all events and commands defined in `Events` and `Commands`. (#9274)
    * Removes `Events.OnZoomScaleFactorChanged`, use `DocumentListener#onDocumentZoomed()` instead.
    * Removes `Events.OnPageChanged`, use `DocumentListener#onPageChanged()` instead.
    * Removes `Commands.ClearSelectedAnnotations`, use `PdfFragment#clearSelectedAnnotations()` instead.
    * Removes `Commands.SelectAnnotation`, use `PdfFragment#setSelectedAnnotation()` instead.
    * Removes `Commands.ToggleActionBarIconsVisibility`.
    * Removes `Commands.ExecuteAction`, use `PdfFragment#executeAction()` instead.
    * Removes `Commands.ShowPage` use `PdfFragment#setPageIndex()` instead.
    * Removes `Commands.ToggleSystemBars`, use `PdfActivity#setUserInterfaceVisible()` instead.
    * Removes `Commands.SearchSelectedText`, requests for searching selected text are now handled by `OnSearchSelectedTextListener` that can be set via `TextSelectionController#setOnSearchSelectedTextListener`.
    * Removes `Commands.ShowAnnotationEditor`, use `showAnnotationEditor()` defined in `AnnotationCreationController` and `AnnotationEditingController` instead.
* Removes `PSPDFKit#updateInternalUIContext()`. (#17039)
* Fixes an issue where `PdfFragment#isImageDocument()` returned `false` for image documents loaded from non-parcelable sources. (#17524)
* Fixes an issue where annotation overlay mode was enabled even when annotation editing was disabled by configuration or license. (#16941)
* Fixes an issue where annotation views added to overlay during initialization state weren't measured correctly. (#17099)
* Fixes an issue where clicks outside of the page triggered both `DocumentListener#onDocumentClick()` and `DocumentListener#onPageClick()` instead of just triggering `onDocumentClick()`. (#16892)
* Fixes an issue where creation of ink signature in portrait mode could result in `IllegalStateException`. (#16819)
* Fixes an issue where edited form value could disappear for a while after leaving form editing mode. (#17024)
* Fixes an issue where form elements were not extracted to annotation overlay when annotation editing was disabled. (#17518)
* Fixes an issue where it wasn't possible to enter text into non-scrollable, multiline form fields. (#17471)
* Fixes an issue where markup submenu in annotation creation toolbar did not remember last selected annotation tool. (#17378)
* Fixes an issue where note editor did not handle annotation flags correctly. (#16693)
* Fixes an issue where pages with invalid annotations on them were not rendered. (#16990)
* Fixes an issue where returning `false` from `DocumentListener#onDocumentClick()` did not consume the event. (#16890)
* Fixes an issue where state restoration inside `PdfThumbnailGrid` would throw an exception when having `targetSdkVersion` set to `28`. (#16983)
* Fixes an issue which could keep annotation views from properly being measured when continuous scrolling was configured while annotation overlay mode was active. (#17295)
* Fixes an unhandled `NullPointerException` that was thrown by the note editor when editing annotations without creation date. (#17391)

#### Model

* API: All method parameters annotated with `@NonNull` now throw an `IllegalArgumentException` when receiving a null as argument. (#14266)
* API: Converts `BookmarkProvider` from a class into an interface. To retrieve an implementation use `PdfDocument#getBookmarkProvider()`. (#16868)
    * Renames `BookmarkProvider#isDirty()` to `BookmarkProvider#hasUnsavedChanges()`.
    * Removes `BookmarkProvider#prepareToSave()`, this is handled automatically by the framework.
* API: Converts `DocumentPdfMetadata` and `DocumentXmpMetadata` from a class to an interface. To retrieve an implementation use `PdfDocument#getPdfMetadata()` and `PdfDocument#getXmpMetadata()`. (#16936)
    * Removes `DocumentPdfMetadata#clearDirty()` and `DocumentXmpMetadata#clearDirty()`, this is handled automatically by the framework.
    * Renames `DocumentPdfMetadata#isDirty()` and `DocumentXmpMetadata#isDirty()` to `hasUnsavedChanges()`.
* API: Converts `FormProvider` from a class to an interface. To retrieve an implementation use `PdfDocument#getFormProvider()`. (#16847)
    * Renames `FormProvider#isDirty()` to `FormProvider#hasUnsavedChanges()`.
* API: Converts `PdfDocument` from a class into an interface. Use `PdfDocumentLoader#openDocument()` and associated methods to retrieve an implementation. (#14261)
    * Renames `PdfDocument#getPDFVersion()` to `getPdfVersion()`.
    * Adds `PdfDocumentLoader` class which contains methods to obtain `PdfDocument`s.
    * Removes `PdfDocument#openDocument()` and associated methods.
* API: Removes `DocumentDataStore` from the public API to improve the framework security. (#17248)
* API: `Annotation#setSubject()` no longer has an effect on the appearance of `StampAnnotation`s, use the new `setStampType()` and `setTitle()` methods instead. (#15895)
    * Adds `getStampType()` and `setStampType()` to `StampAnnotation`.
    * Adds `getTitle()` and `setTitle()` to `StampAnnotation`.
    * Changes `com.pspdfkit.annotations.StampType` from an enum to a class found at `com.pspdfkit.annotations.stamps.StampType`.
    * Renames `StampType.fromSubject()` to `fromName()`.
    * Renames `StampType#getSubject()` to `getName()`.
    * Adds `StampType#isStandard()`.
    * Renames `StampAnnotation#getSubtext()` and `StampAnnotation#setSubtext()` to `getSubtitle()` and `setSubtitle()`.
    * Adds `StampPickerItem.fromStampType()`.
    * Renames `StampPickerItem.fromSubject()` to `fromTitle()`.
    * Renames `StampPickerItem.Builder.withLocalizedSubject()` to `withTitle()`.
    * Renames `StampPickerItem.Builder.withSubtext()` to `withSubtitle()`.
    * Renames `StampPickerItem.Builder.withDateTimeSubtext()` to `withDateTimeSubtitle()`.
    * Renames `StampPickerItem#getSubject()` to `getStampType()` and changes return type to `StampType`.
    * Renames `StampPickerItem#getLocalizedSubject()` to `getTitle()`.
    * Renames `StampPickerItem#getSubtext()` to `getSubtitle()`.
    * Renames `PredefinedStampType.fromSubject()` to `fromName()`.
    * Renames `PredefinedStampType#getSubject()` to `getName()`.
    * Adds `PredefinedStampType#getStampType()`.
* Deprecates `PdfProcessorTask#addPdfToPage()`, use new method `mergePage()` instead. (#17150)
* Adds `Font#getDefaultTypeface()` to retrieve the `Typeface` without causing additional disk I/O. (#16932)
    * Ensures that `Font`s can only be created from background threads, throwing an `IllegalStateException` if created from the main thread.
* API: Removes all previously deprecated symbols. (#16895)
    * Removes `com.pspdfkit.annotations.xfdf.XfdfFormatter` use `com.pspdfkit.document.formatters.XfdfFormatter` instead.
    * Removes `InstantPdfFragment.newInstance(String, String, String, PdfConfiguration)` use `newInstance(String, String, PdfConfiguration)` instead.
    * Removes `InstantPdfActivityIntentBuilder.fromInstantDocument(Context, String, String, String)` use `fromInstantDocument(Context, String, String)` instead.
    * Removes `InstantPdfActivity.showInstantDocument(Context, String, String, String, PdfActivityConfiguration)` use `showInstantDocument(Context, String, String, PdfActivityConfiguration)` instead.
    * Removes `InstantDocumentDescriptor#getAuthenticationToken()` use `getJwt()` instead.
    * Removes `InstantClient#openDocument(String, String)` use `openDocument(String)` instead.
    * Removes `InstantClient#openDocumentAsync(String, String)` use `openDocumentAsync(String)` instead.
    * Removes `InstantClient#getInstantDocumentDescriptor(String)` use `getInstantDocumentDescriptorForJwt(String)` instead.
    * Removes `InstantPdfDocument#updateAuthenticationToken(String)` use `reauthenticateWithJwt(String)` instead.
    * Removes `InstantPdfDocument#updateAuthenticationTokenAsync(String)` use `reauthenticateWithJwtAsync(String)` instead.
    * Removes `InstantPdfDocument#setAutomaticSyncEnabled(boolean)` use `setListenToServerChanges(boolean)` and `setDelayForSyncingLocalChanges(long)` instead.
    * Removes `AnnotationSyncCoordinator#setAutomaticSyncEnabled(boolean)` use `setListenToServerChanges(boolean)` and `setDelayForSyncingLocalChanges(long)` instead.
    * Removes `AnnotationManager.OnAnnotationUpdatedListener` use `AnnotationProvider.OnAnnotationUpdatedListener` instead.
    * Removes `SignatureSignerDialog.show(FragmentManager, PdfDocument, SignatureFormField, Signer, DocumentSigningListener)` use `show(FragmentManager, Options, DocumentSigningListener)` instead.
    * Removes `SignatureSignerDialog.show(FragmentManager, PdfDocument, SignatureFormField, Signer, BiometricSignatureData, DocumentSigningListener)` use `show(FragmentManager, Options, DocumentSigningListener)` instead.
    * Removes `ComboBoxFormConfiguration.Builder#setSelectedIndexes(List)` use `setSelectedIndex(Integer)` instead.
    * Removes `DocumentSharingProcessor` use `DocumentSharingProviderProcessor#prepareDocumentForSharing(Context, PdfDocument, PdfProcessorTask, String)` instead.
    * Removes `DocumentSharingProvider#deleteTemporaryFile(Context, Uri)` use `deleteFile(Context, Uri)` instead.
    * Removes `PdfProcessorTask(PdfDocument)` use `PdfProcessorTask.fromDocument(PdfDocument)` instead.
    * Removes `PdfProcessorTask(NewPage)` use `PdfProcessorTask.newPage(NewPage)` instead.
    * Removes `Signer#signFormFieldAsync(SignatureFormField, KeyStore.PrivateKeyEntry, OutputStream)` use `signFormFieldAsync(SignatureFormField, BiometricSignatureData, OutputStream)` instead.
    * Removes `Signer#signFormFieldAsync(SignatureFormField, KeyStore.PrivateKeyEntry, BiometricSignatureData, OutputStream)` use `signFormFieldAsync(SignatureFormField, BiometricSignatureData, OutputStream)` instead.
    * Removes `Signer#signFormField(SignatureFormField, KeyStore.PrivateKeyEntry, OutputStream)` use `signFormField(SignatureFormField, BiometricSignatureData, OutputStream, OnSigningCompleteCallback)` instead.
    * Removes `Signer#signFormField(SignatureFormField, KeyStore.PrivateKeyEntry, BiometricSignatureData, OutputStream)` use `signFormField(SignatureFormField, BiometricSignatureData, OutputStream, OnSigningCompleteCallback)` instead.
    * Removes `MemorySigner#signFormFieldAsync(SignatureFormField, OutputStream)` use `signFormFieldAsync(SignatureFormField, BiometricSignatureData, OutputStream)` instead.
    * Removes `MemorySigner#signFormField(SignatureFormField, OutputStream)` use `signFormField(SignatureFormField, BiometricSignatureData, OutputStream, OnSigningCompleteCallback)` instead.
    * Removes `MemorySigner#getSigningKeyPair()`.
    * Removes `PdfFragment.PARAM_DOCUMENT_PATHS`, `PdfFragment.PARAM_IMAGE_DOCUMENT_PATH`, `PdfFragment.PARAM_PASSWORDS`, and `PdfFragment.PARAM_CONTENT_SIGNATURES`.
    * Removes `PdfFragment#setCustomPdfSource(DataProvider, String)` use `setCustomPdfSource(DocumentSource)` instead.
    * Removes `PdfFragment#setCustomPdfSources(List, List)` use `setCustomPdfSources(List)`.
    * Removes `PdfFragment#[register/unregister]DrawableProvider()` use `PdfFragment#[add/remove]DrawableProvider()` instead.
    * Removes `PdfThumbnailGrid#[add/remove]OnDocumentEditingModeChangeListener()` use `DocumentEditingManager#[add/remove]OnDocumentEditingModeChangeListener()` instead.
    * Removes `PdfThumbnailGrid#[add/remove]OnDocumentEditingPageSelectionChangeListener()` use `DocumentEditingManager#[add/remove]OnDocumentEditingPageSelectionChangeListener()` instead.
    * Removes `AnnotationProvider#prepareForSave()` this call is no longer necessary.
    * Removes `AnnotationProvider#clearDirty()` this call is no longer necessary.
    * Removes `AnnotationProvider#isDirty()` use `hasUnsavedChanges()` instead.
    * Removes `PdfConfiguration#annotationReplyFeatureEnabled(boolean)` use `annotationReplyFeatures(AnnotationReplyFeatures)` instead.
    * Removes `PdfConfiguration#isAnnotationReplyFeatureEnabled()` use `getAnnotationReplyFeatures()` instead.
    * Removes `PdfActivityConfiguration#annotationReplyFeatureEnabled(boolean)` use `annotationReplyFeatures(AnnotationReplyFeatures)` instead.
    * Removes `RichMediaExecuteAction#getScreenAnnotationPageIndex()`.
    * Removes `RichMediaExecuteAction#getScreenAnnotationObjectNumber()` use `getRichMediaAnnotationObjectNumber()`.
    * Removes `RenditionAction#getScreenAnnotationPageIndex()`.
* Adds new Redaction component. (#16922)
    * Adds `RedactionAnnotation` to mark parts of the document that should be redacted.
    * Adds new tool to mark text in the document for redaction.
    * Adds `PdfProcessorTask#applyRedactions()` to apply all created `RedactionAnnotations`.
    * Adds `DocumentSaveOptions#setApplyRedactions()` to allow applying redactions as part of the regular document saving.
* Adds PDF Comparison component for visual comparison of pages of different documents. (#16598)
    * Adds `PdfProcessorTask#changeStrokeColorOnPage()` for adjusting color of all strokes on a page.
    * Adds `PdfProcessorTask#mergePage()` that supports `BlendMode` for merging 2 colored pages. This method can be used to produce comparison page by blending 2 pages that have strokes colored with different colors.
    * Adds `LicenseFeatures#COMPARISON` that can be retrieved via `PSPDFKit#getLicenseFeatures()`.
    * Adds `DocumentComparisonExample` that shows how to compare documents using this new API.
* Adds better support for annotations with custom appearance streams. (#15658)
* Adds new initializer option to add additional font directories. (#13991)
* Adds support for `util.scand`, a JavaScript API that can be used from PDF documents to parse dates from strings. (#17480)
* Improves the performance of documents with a lot of JavaScript calculations. (#11925, #16490)
* Allows creation of `PagePdf` from already loaded `PdfDocument` instances. (#17150)
* Changes the format of the `InstantJSON` bookmark format. The id is now saved in `pdfBookmarkId` and `skippedBookmarkIds` has been renamed to `skippedPdfBookmarkIds`. (#17400)
* Fixed an issue where the wrong encoding was used for the `Symbol` font. (#17245)
* Upgrades Java source and target versions to 1.8. (#17007, #17149)
* Fixes occasional rendering issues on OnePlus devices. (#16541)
* Fixes `ContentResolverDataProvider` not reporting the correct title for documents. (#17417)
* Fixes a crash that may happen when you add form fields with certain kinds of JavaScript scripts. (#17472)
* Fixes a possible `NullPointerException` when passing `null` to `PredefinedStampType#fromSubject()`. Parameter is now marked as `@Nullable` and properly checked for `null`. (#17046)
* Fixes an issue in Document Editor where importing documents without storage permissions was failing silently. (#17032)
* Fixes an issue looking up destinations in a names tree. This could lead to unresolvable link/outline destination. (#17206)
* Fixes an issue that caused problems saving new annotations in particular documents. (#16717)
* Fixes an issue where Document JSON skipped object numbers for created annotations. This could lead to problems where unrelated annotations could get ignored after importing the JSON file. (#17425)
* Fixes an issue where JavaScript dependent calculations may not be executed after a syntax error. (#17025)
* Fixes an issue where JavaScript form field validation erroneously used the previous value. (#16462)
* Fixes an issue where calling `StampAnnotation#getBitmap()` on newly created image stamp annotations would return an empty bitmap. (#17455)
* Fixes an issue where documents with a large number of form fields failed to display editing options. (#16911)
* Fixes an issue where on some devices running Android API 27, saving documents using Downloads content provider was throwing an exception. (#17087)
* Fixes an issue where some PDF pages could not be inserted as attachments for images. (#16729)
* Fixes an issue where the wrong message is return when a certificate is expired. (#16727)
* Fixes an issue with JPEG2000 images. (#14850)
* Fixes an issue with document checkpointing after saving fails. (#16600)
* Fixes rendering of image stamps when applied to rotated pages. (#17380)
* Fixes stamp annotation rotation, free text annotation rotation, and free text annotation text insets being transformed on pages that have a rotation set in the PDF. (#15890)

#### Instant

* API: Converts `InstantPdfDocument`from a class into an interface. Use `InstantClient#openDocument()` and associated methods to retrieve an implementation. (#14261)
    * Renames `InstantPdfDocument#getPDFVersion()` to `getPdfVersion()`.
* Adds support for shape annotations and ink signatures. (#17270)
* Fixes a bug that deleted all local layers of a document instead of just the layer backing a document descriptor. (#17264)
* Fixes a deadlock that could occur when deleting a layer or all loaded data. (#17257)
* Fixes an issue that could cause open file descriptors to be leaked when deleting the local data for a layer, document, or the entire Instant client. (#17303)

#### Examples

* Adds JavaScript calculator example to Catalog app. This example showcases a calculator application implemented completely inside a PDF using JavaScript. (#17512)
* Adds QR code scanning option to connect to Instant Demo. (#16624)
* Adds a new `custom-fonts` example application that shows how to bundle custom fonts for rendering within an application. (#17057)
* Adds the new PSPDFKit 5 for Android Quickstart guide to the Catalog app. (#17405)
* Fixes an issue related to multidex configuration that could cause Catalog app startup issues. (#17069)

### 4.8.1 - 27 Sep 2018

#### UI

* Enhances calculation of free text callouts when changing font face. (#16733)
* The signature picker dialog will now restore the activity's original orientation after being dismissed. (#15556)
* Reverse portrait orientation is now properly restored when returning from full-screen video view. (#16756)
* Fixes `DocumentListener#onPageClick()` not reporting the correct annotation when multiple annotations overlap. (#16770)
* Fixes an issue where Document Editor was erroneously instantiated multiple times leading to wrong page operation results. (#16784)
* Fixes an issue where `pspdf__backgroundColor` theme attribute was lost after changing configuration with retained `PdfFragment`. (#16914)
* Fixes an issue where annotation or form selection is restored while the fragment is being destroyed, causing a crash. (#16480)
* Fixes an issue where clicking on paste button in text selection popup toolbar could result in `IllegalStateException`. (#16764)
* Fixes an issue where documents that were saved to a `ContentResolverDataProvider` could return stale data after being reloaded. (#16753)
* Fixes an issue where forms in rotated documents are rendered rotated the wrong way. (#15549)
* Fixes an issue where it was possible to paste annotations from another document even when cross document copy/pasting was disabled in configuration. (#16748)
* Fixes an issue where it wasn't possible to input decimal separators to form fields with number format. (#16825)
* Fixes an issue where items in annotation creation toolbar with custom grouping rule (`CustomAnnotationCreationToolbarGroupingRule`) in our catalog app were not selectable. (#16793)
* Fixes an issue where signing documents with existing digital signatures made previous signatures invalid. (#16852)
* Fixes an issue where stamp background disappeared after returning back from annotation note editor. (#15989)
* Fixes an issue where the undo/redo buttons of the document editor were not enabled in some cases. (#16757)
* Fixes an issue with resizing free text callouts in corners. (#16734)

#### Model

* Fixes a possible `ConcurrentModificationException` thrown while initializing PSPDFKit. (#16831)
* Fixes an issue when extracting link annotations. (#16854)
* Fixes an issue where JavaScript scripts that hold a strong local reference to event.target would not work correctly. (#16507)
* Fixes an issue where document JSON wasn't imported correctly on rotated PDF pages. (#16534)
* Fixes an issue where image documents could not be opened from URIs without read permission for the filesystem. (#16686)
* Fixes an issue where not all form fields were listable immediately after opening a document. (#16479)
* Fixes an issue where programmatic annotation content changes would not be reflected in rendered free text annotation. (#16487)
* Fixes an issue where some document outlines were not be persisted correctly after using the document processor. (#16688)
* Fixes an issue where some documents with JavaScript would become unresponsive for a great amount of time. (#16886)

### 4.8.0 - 5 Sep 2018

**Important:** PSPDFKit now ships with x86_64 native libraries. This considerably increases its size. Please follow [the framework size guide article](https://pspdfkit.com/guides/android/current/faq/framework-size/#reducing-the-size-of-your-app) for more information on how to reduce size of your apps by filtering native libraries for certain ABIs. (#6086)

#### UI

* Adds support for document tabs. (#9399)
    * Adds `PdfDocumentCoordinator` that manages multiple documents in `PdfActivity` and coordinates switching between these documents. It can be retrieved via `PdfActivity#getDocumentCoordinator()`.
    * Adds `DocumentDescriptor` for describing loaded documents in `PdfDocumentCoordinator` together with their state.
    * Adds `PdfTabBar` that displays tabs for documents managed by `PdfDocumentCoordinator`.
    * Adds `setTabBarHidingMode()` to `PdfActivityConfiguration.Builder` for controlling when to display tabs bar or to disable it altogether.
    * Adds `DocumentTabsExample` that showcases how to use `PdfDocumentCoordinator` in `PdfActivity` to display tabs.
    * Adapts `DocumentSwitcherExample` to use the `PdfDocumentCoordinator` API for faster document switching compared to previous solution.
    * Deprecates `EventBus` parameter in `PSPDFKitViews#setDocument()`.
    * Deprecates `setCustomPdfSource()` and `setCustomPdfSources()` accepting `DataProvider` in `PdfFragment`, use newly provided methods with the same name that accept `DocumentSource` instead.
* Adds `FreeTextAnnotation#setFontName()` and `getFontName()` to get and set the font used for the annotation. (#16217)
    Adds new inspector control to select the font of free text annotations.
* Adds `setPageLoadingDrawable()` to `PdfFragment`. This method sets loading drawable that will be displayed until document is loaded and all visible pages are rendered. (#16330)
* Adds navigation between pages using volume buttons. Option can be enabled with `PdfActivityConfiguration.Builder#volumeButtonsNavigationEnabled(true)`. (#15406)
* Adds support for drawing behind notch on Android P. (#16565)
* Adds support for rendering widget annotations in overlay mode. (#14463)
* Fixed an issue where parts of the document view hierarchy were illegally retained when replacing the displayed document inside of `PdfFragment`. (#16614)
* Fixes an issue where clicking on undo/redo button in annotation editing toolbar did not trigger undo. (#16694)
* Fixes an issue where document title overlay was not updated after changing title in the document info view. (#16653)
* Fixes an issue where free text annotations could not be scaled correctly when annotation rotation was disabled. (#16567)
* Fixes an issue where ink signatures overlapping form fields could not be selected. (#16273)
* Fixes an issue where stamp annotations sometimes didn't get rendered in overlay mode after scrolling to page. (#16147)
* Fixes markup annotations not being rendered behind all other annotations while overlay mode is active. (#15845)
* Fixes an issue where disabling the document info view wasn't retained when creating new `PdfActivityConfiguration` from already existing configuration. (#16651)

#### Model

* Adds `PSPDFKit.getLicenseFeatures()` to allow you to check the currently enabled license features. (#15725)
* Adds `SignatureFormField#removeSignature()` to remove the attached digital signature. (#16294)
* Adds `isImageDocument` for `PdfFragment` and `PdfActivity` to indicate whether the displayed document is an image or not. (#16661)
* Adds missing nullability annotations to `FormElementConfiguration` and its subclasses. (#16205)
* Adds new Document Editor API. (#15877)
    * Adds `PdfDocumentEditor` interface the public editor API.
        * Adds `#saveDocument(Context, DocumentSaveOptions)` for saving a document in place.
        * Adds `#saveDocument(Context, OutputStream, DocumentSaveOptions)` for saving a document to a given output stream.
        * Adds `#exportPages(Context, OutputStream, Set<Integer>, DocumentSaveOptions)` for exporting a set of pages to a given output stream.
        * Adds `#addPage(int, NewPage)` for adding a new page to a given index.
        * Adds `#removePages(Set<Integer>)` for removing a set of pages from the document.
        * Adds `#rotatePages(Set<Integer>, int)` for rotating a set of pages of a given angle.
        * Adds `#duplicatePages(Set<Integer>)` for duplicating a given set of pages.
        * Adds `#movePages(Set<Integer>, int)` for moving a set of pages to a given destination index.
        * Adds `#importDocument(Context, DocumentSource, int)` for importing a document source to a given index.
        * Adds `#canUndo` for checking if undo operation is possible.
        * Adds `#canRedo()` for checking if redo operation is possible.
        * Adds `#getRotatedPageSize(int)` to return the page size of a given page already rotated.
        * Adds `#renderPageToBitmap(int, Bitmap, PageRenderConfiguration)` for rendering a given page into a `Bitmap`buffer.
        * Adds `#setPageLabel(int, String)` for setting a new page label for a specific page.
        * Adds `#beginTransaction()` to begin a new batch of document editor operations.
        * Adds `#isTransactionActive()` to check if there is currently an active document editor transaction.
        * Adds `#discardTransaction()` to discard the current batch of document editor operations.
        * Adds `#commitTransaction()` to end a bach of document editor operations and commit them immediately.
    * Adds `PdfDocumentEditorFactory` for creating document editor instances.
    * Adds `EditingChange` to represent a change that happened because of an operation performed by the document editor that can be undone/redone.
    * Adds `EditingOperation` to specify the kind of change done by the editing operation.
    * Adds `PdfThumbnailGrid#getDocumentEditor` to return thumbnail grid document editor.
    * Adds `PdfThumbnailGrid#isDocumentEditorEnabled()` to check if document editor is enabled.
    * Adds `PdfDocumentEditorFactory.createForDocument(PdfDocument)` to create a new instance of Document Editor.
    * Adds `FilePicker` to retrieve a destination Uri when required for saving and exporting operations.
    * Adds `PdfThumbnailGrid#getFilePicker()` to obtain current file picker, if not specified default Android SAF picker is provided.
    * Adds `PdfThumbnailGrid#setFilePicker(FilePicker)` to set a file picker to use during a saving process.
    * Removes `DefaultDocumentEditorListener` and  `PdfDocumentEditorListener` use a custom file picker instead.
    * Removes `DocumentEditor` interface. All Document Editor API placed in `PdfDocumentEditor` interface.
    * Removes `PSPDFKitView#setPdfDocumentEditorListener(PdfDocumentEditorListener)`
    * Removes `PdfThumbanilGrid#setPdfDocumentEditorListener`
    * Removes `PdfThumbnailGrid#onFileChooserResult` this is now managed by default file picker.
    * Deprecates `PdfThumbnailGrid#addOnDocumentEditingModeChangeListener(OnDocumentEditingModeChangeListener)` use `DocumentEditingManager#addOnDocumentEditingModeChangeListener(OnDocumentEditingModeChangeListener)` instead.
    * Deprecates `PdfThumbnailGrid#removeOnDocumentEditingModeChangeListener(OnDocumentEditingModeChangeListener)` use `DocumentEditingManager#removeOnDocumentEditingModeChangeListener(OnDocumentEditingModeChangeListener)` instead.
    * Deprecates `PdfThumbnailGrid#addOnDocumentEditingPageSelectionChangeListener(OnDocumentEditingModeChangeListener)` use `DocumentEditingManager#addOnDocumentEditingPageSelectionChangeListener(OnDocumentEditingModeChangeListener)` instead.
    * Deprecates `PdfThumbnailGrid#removeOnDocumentEditingPageSelectionChangeListener(OnDocumentEditingModeChangeListener)` use `DocumentEditingManager#removeOnDocumentEditingPageSelectionChangeListener(OnDocumentEditingModeChangeListener)` instead.
* Adds popup toolbar for text selection and pasting. (#8520)
    * Adds `PopupToolbar` class which represents a generic popup toolbar similar to the Android framework text selection bar.
    * Adds `TextSelectionPopupToolbar` which is a `PopupToolbar` implementation for the text selection process. Handled inside the document view.
    * Adds `PdfActivityConfiguration.Builder#textSelectionPopupToolbarEnabled(true|false)` for controlling whether the text selection popup toolbar is enabled or not. If enabled, `PdfActivity` won't show the old text selection toolbar. If disabled, `PdfActivity` will show a contextual text selection toolbar whereas the fragment won't display a popup toolbar.
    * Adds `OnPreparePopupToolbarListener` that you can register on the fragment via `PdfFragment#setOnPreparePopupToolbarListener()` to get a callback before each of the toolbars is displayed. Use this to change menu items before the toolbar becomes visible.
    * Adds `PopupToolbarMenuItem` which represents a single popup toolbar menu item. The menu item specifies an ID, title and whether it's enabled or not.
* Adds support for setting supported form flags on created form fields. (#15543)
    * Adds `setReadOnly()` and `setRequired()` to `FormElementConfiguration` builders.
    * Adds `setSpellCheckEnabled()` and `setMultiSelectionEnabled()` to `ComboBoxFormConfiguration` builder.
    * Adds `setMultiLine()`, `setPassword()`, `setSpellCheckEnabled()`, `setScrollEnabled()` and `setMaxLength()` to `TextFormConfiguration` builder.
* Improves document password support and compatibility with third-party readers. (#15951)
* Ensures that the processor always encrypt documents using the 128-bit AES algorithm if the user didn't change the defaults. (#15946)
* Moves the document info view from its separate dialog to the outline view (`PdfOutlineView`) and adds new navigation view used to navigate between outline view components. (#15986)
    * Adds `PdfOutlineView#[add/remove]OnDocumentInfoViewModeChangeListener()` for adding/removing the listener for document info mode changes.
    * Adds `PdfOutlineView#[add/remove]OnDocumentInfoViewSaveListener()` for adding/removing the listener for document info value changes being saved to the document.
    * Adds theming via XML for the document info view, using the outline view styleable (`pspdf__OutlineView`):
    * Adds attributes for styling new navigation view:
    * Adds `pspdf__navigationTabOutlineIcon` for setting the tab icon for outline view.
    * Adds `pspdf__navigationTabBookmarksIcon` for setting the tab icon for bookmarks view.
    * Adds `pspdf__navigationTabAnnotationsIcon` for setting the tab icon for annotation list view.
    * Adds `pspdf__navigationTabDocumentInfoIcon` for setting the tab icon for document info view.
    * Adds `pspdf__navigationTabIconsColor` for setting the color for tab icons in the navigation bar.
    * Adds `pspdf__navigationTabIconsColorSelected` for setting the color for the selected tab icon in the navigation bar.
    * Adds `pspdf__navigationTabBackgroundColor` for setting the background color of the whole navigation view.
    * Adds attributes for styling document info view:
    * Adds `pspdf__documentInfoGroupTitleTextColor` for setting the text color for the document info group title.
    * Adds `pspdf__documentInfoItemTitleTextColor` for setting the text color for the document info item title.
    * Adds `pspdf__documentInfoItemValueTextColor` for setting the text color for the document info item value.
    * Adds `pspdf__documentInfoItemValueHintTextColor` for setting the text color for the document info value hint.
    * Adds `pspdf__documentInfoGroupIconColor` for setting the icon color for the document info group icons.
    * Adds `pspdf__documentInfoContentIcon` for setting the icon for the 'Content' group in document info view.
    * Adds `pspdf__documentInfoChangesIcon` for setting the icon for the 'Changes' group in document info view.
    * Adds `pspdf__documentInfoSizeIcon` for setting the icon for the 'Size' group in document info view.
    * Adds `pspdf__documentInfoFabBackgroundColor` for setting the background color for the document info FAB.
    * Adds `pspdf__documentInfoFabIconColor` for setting the icon color for the document info FAB.
    * Adds `pspdf__documentInfoFabEditIcon` for setting the 'Edit' icon for the document info FAB.
    * Adds `pspdf__documentInfoFabDoneIcon` for setting the 'Done' icon for the document info FAB.
    * API: Removes `PdfOutlineView` styling setters and getters. The UI should be changed exclusively through XML themes:
    * API: Removes `[set/get]BackgroundColor()`.
    * API: Removes `[set/get]ListSelector()`.
    * API: Removes `[set/get]DefaultTextColor()`.
    * API: Removes `[set/get]BookmarksBarIconColor()`.
    * API: Removes `[set/get]BookmarksBarBackgroundColor()`.
    * API: Removes `[set/get]BookmarksAddIcon()`.
    * API: Removes `[set/get]BookmarksEditIcon()`.
    * API: Removes `[set/get]BookmarksDoneIcon()`.
    * API: Removes `[set/get]GroupIndicatorIconColor()`.
    * API: Removes `[set/get]BookmarksDeleteIcon()`.
    * API: Removes `[set/get]BookmarksDeleteIconColor()`.
    * API: Removes `[set/get]BookmarksDeleteBackgroundColor()`.
* Updates `clipRect()` usage to be compliant with the new restrictions on Android P. (#16592)
* Fixes a problem where calling `InkAnnotation#isSignature()` on annotations created from signatures returned `false`. (#15907)
* Fixes a problem where creating a new page with fractional size caused problems when drawing on it using the `PageCanvas` API. (#16030)
* Fixes a problem where some XFA forms with JavaScript may show an alert message when the document is open. (#16000)
* Fixes a race condition when opening compound documents made up of a large amount of documents. (#16274)
* Fixes an issue exporting document pages with a rare outline configuration. (#15923)
* Fixes an issue where `DocumentInfoView` was trying to calculate document size using wrong document source. (#16443)
* Fixes an issue where calling `save()` methods on a `PdfDocument` backed by an image document would not trigger saving of metadata to the original image file. (#16077)
* Fixes an issue where the blend mode of ink annotations may not be persisted correctly. (#16376)
* Fixes an issue where the digital signature validation UI may incorrectly inform about an expired certificate. (#16605)
* Fixes a performance problem with documents that contain large clipping paths. (#16481)
* Fixes a problem rendering documents with particular fonts. (#16361)
* Fixes a problem with XFDF on rotated pages. (#16560)
* Fixes an issue when entering text with non-latin characters. (#16626)
* Fixes an issue when loading checkpoint files. (#16277)

#### Instant

* Adds support for bookmarks to Instant Document JSON. (#16165)

#### Examples

* Hitting enter or submitting the search inside the Catalog app examples will now focus the first example inside the results. (#16604)

### 4.7.2 - 9 Aug 2018

#### UI

* Fixes an issue where `FreeTextAnnotation`s stopped being editable when overlay mode is deactivated. (#16375)
* Fixes an issue where `FreeTextAnnotation`s were rendered with a white background despite no background being set. (#16392)
* Fixes an issue where rotation handle visible outside of page bounds did not respond to touches. (#15726)
* Fixes an issue where visible page rectangle was not restored correctly after changing configuration in `PdfActivity`. (#16426)
* Fixes an issue where annotations were not added in the correct order when adding them in quick succession. (#16208)

#### Model

* Fixes an issue where `OnFormElementClickedListener#onFormElementClicked` wasn't called when clicking on signature form fields. (#16289)
* Fixes an issue where deleting note annotations from the editor could crash when the license did not have annotation replies enabled. (#15891)
* Fixes an issue where not all form fields were immediately listable after opening certain documents. (#16279)
* Fixes an issue where created form elements could not be retrieved from `FormProvider`. (#15930)
* Fixes an issue where the framework would occasionally crash when application was paused while searching. (#16248)
* Fixes an issue where border style and blend mode set on annotation could not be reset to their default values. (#16440)

#### Example

* Adds `ManualSigningExample` to catalog app showing how to manually sign documents without signature picker UI. (#16295)

### 4.7.1 - 25 Jul 2018

#### UI

* Adds handling for `NamedActionType#INFO` to `PdfActivity`, showing document info dialog when executed. (#15983)
* Fixes an issue where changes made to image file loaded as `ImageDocument` in `PdfActivity` or `PdfFragment` were not propagated to other image apps in the system. (#15943)
    * Adds `ImageDocumentUtils#refreshMediaStore()` to request Android's media scanner to rescan an image file in the media database. Use this method after saving file-backed `ImageDocument` to make sure that other image apps will pick up the changes.
    * Adds `ImageDocumentUtils#isImageUri()` that can be used to check whether the content returned by resolving an `Uri` has an image MIME type.
* Fixes an issue where configuration options set on `PdfConfiguration` were ignored when wrapping activity configuration via `ImageDocumentLoader#getDefaultImageDocumentActivityConfiguration()`. (#15963)
    * Adds `getDefaultImageDocumentConfiguration(PdfConfiguration)` to `ImageDocumentLoader` to create configuration for image documents from existing `PdfConfiguration`.
    * Return values of `getDefaultImageDocumentConfiguration()` and `getDefaultImageDocumentActivityConfiguration()` in `ImageDocumentLoader` are now marked as `@NonNull`.
* Fixes an issue where form validation error message displayed in form editing bar had incorrect height in immersive mode. (#16103)
* Fixes an issue where it wasn't possible to re-select between form elements and annotations. (#15962)
* Fixes an issue where shape annotations with `BlendMode.MULTIPLY` would not render properly if `PdfConfiguration#invertColors()` was used. Now instead, shape annotations will use `BlendMode.SCREEN` for inverted colors. (#15990)

#### Model

* Adds support for `RichMediaExecuteActionType`. (#15648)
* Adds support for calling `PdfActivity#setConfiguration` before `onCreate` is called to set configuration without causing an activity restart. (#15926)
* Adds support for creating `NamedAction`, `GoToEmbeddedFileAction`, `HideAction`, `ResetFormAction` and `SubmitFormAction`. (#15235)
    * Adds `getFieldNames()` to `ResetFormAction` and `SubmitFormAction` that returns list of form field names that should be targeted by the action.
    * Adds `shouldExcludeFormFields()` to `ResetFormAction` and `SubmitFormAction` that indicates whether form fields targeted by the action should be included or excluded from the action execution.
* Fixes an issue where annotations that were parsed from XFDF were not saved to the document after adding them. (#15953)
* Fixes an issue where calling JavaScript function `AFSpecial_Keystroke` with certain arguments could cause an infinite loop on some devices. (#16126)
* Fixes an issue where setting and retrieval of lines on an `InkAnnotation` would fail for detached annotations when not using `ArrayList`. (#16015)

#### Example

* Adds `XfdfExample` to Catalog app that shows how to import/export annotations to/from XFDF file format. (#15954)
* Extends `ExternalDocumentExample` in the Catalog app to allow opening both PDF and image files. (#16053)

## Previous Releases

### 4.7.0 - 9 Jul 2018

#### UI

* Adds document info view for displaying information about the document that's being viewed: (#15850)
    * Adds document info view enabling and disabling, see `enableDocumentInfoView()` and `disableDocumentInfoView()` in `PdfActivityConfiguration.Builder`
    * Adds document info icon to the toolbar and `PdfActivity#showDocumentInfoDialog()` for programmatic invocation.
    * Adds `OnDocumentInfoViewModeChangeListener` listener for entering and exiting editing mode in document info view.
    * Adds `PdfActivity#setOnDocumentInfoViewModeChangeListener()` that lets you set the aforementioned listener.
    * Adds `PdfDocumentInfoView` class that is a pure document info view without the toolbar that you can embed in your custom components.
    * Adds `PdfDocumentInfoDialog` which contains `PdfDocumentInfoView` connected with a toolbar for switching editing modes.
* Adds `PdfThumbnailGrid` customization options for editing FAB icon color. (#15809)
    * Fixes `ThumbnailGridItemView` not using `pspdf__selectionCheckBackgroundColor`
* Adds bookmark drag handle icon and color as customizable theme parameters for `pspdf__OutlineView`. (#15869)
* Adds new annotation tool for creating `FreeTextAnnotation`s setup as call outs. (#15840)

#### Model

* Adds support for document JavaScript execution. (#15245)
    * Adds `JavaScriptProvider` that handles all JavaScript related operations. It can be retrieved via `PdfDocument#getJavaScriptProvider()`.
    * Adds support for creation and execution of `JavaScriptAction`.
    * Adds `setJavaScriptEnabled()` to `PdfConfiguration.Builder` and `PdfActivityConfiguration.Builder`. Use this method to control whether JavaScript execution should be enabled in `PdfFragment` or `PdfActivity`.
    * Adds `JavaScriptActionsExample`, `JavaScriptFormFillingExample` and `FormsJavaScriptExample` to catalog app that demonstrates basic usage of JavaScript.
* Adds support for additional actions for widget annotations and form fields. Additional actions are executed for predefined trigger events like clicking on the annotation, selecting/deselecting annotations, calculating, formatting or validating form fields. (#15841)
    * Adds `setAdditionalAction()`, `getAdditionalAction()` and `getAdditionalActions()` for setting and getting additional actions for `WidgetAnnotation`.
    * Adds `setAdditionalAction()` to `FormElementConfiguration.Builder` to configure additional actions for created form elements.
* Adds consumer Proguard rules needed for RxJava to properly function on API 19. (#15829)
* Adds localized strings for unnamed image document title. (#15515)
* Adds support for automatically resizing `FreeTextAnnotation`s based on their text using `FreeTextAnnotationUtils#resizeToFitText`. (#12998)
* Adds support for setting text justification, and callouts to `FreeTextAnnotation`s. (#9609)
    * Adds `setIntent`, `setTextInsets`, `setCallOutPoints`, `setLineEnd`, and `setTextJustification` to `FreeTextAnnotation`.
* Improves image document saving performance. (#15540)
* Added the ability to print image documents. (#15375)
* Fixes a rare issue adding page references with the document editor. (#14705)
* Fixes an issue where a new digital signature could not be created in some documents. (#15683, #15702)
* Fixes an issue where bookmarks may not be saved correctly in certain documents. (#15826)
* Fixes background being rendered incorrectly for rotated `FreeTextAnnotation`s. (#15639)

### 4.6.1 - 14 Jun 2018

#### UI

* Adds `enableAnnotationRotation` and `disableAnnotationRotation` configuration options to allow changing visibility of rotation functionality. (#15510)
* Adds configuration parameters for enabling/disabling sharing action in the note editor. (#15620)
    * Adds `PdfConfiguration.Builder#sharingNoteEditorContentEnabled(boolean)`
    * Adds `PdfActivityConfiguration.Builder#sharingNoteEditorContentEnabled(boolean)`
* Adds `AnnotationReplyFeatures` to provide more granular control of the annotation reply UI. (#14883)
    * Deprecates `PdfConfiguration#isAnnotationReplyFeatureEnabled` and `PdfConfiguration.Builder#annotationReplyFeatureEnabled`, use `PdfConfiguration#getAnnotationReplyFeatures` and `PdfConfiguration.Builder#annotationReplyFeatures` instead.
* Allows opening embedded PDF files if the application integrating PSPDFKit defines view PDF action. (#15611)
* Fixes a potential crash that could occur after rotating device while a video was playing. (#14789)
* Fixes an issue where annotations were not visible when being created inside `onDocumentLoaded()`. (#13255)
* Fixes an issue where long-pressing on the annotation selection handle triggered document long-press event. (#15341)
* Fixes retention of `PdfActivity` inside `PdfDocument` which could lead to memory leakage and OOMs. (#15518)

#### Model

* API: Change return type of `Signature#toInkAnnotation()` overrides from `Annotation` to `InkAnnotation`. (#15509)
* Adds `getExportValue()` to `RadioButtonFormElement`. (#15535)
* Improves `SignaturePickerDialog` APIs. (#15513)
    * Adds method `SignaturePickerDialog.restore()` for passing over a callback to the dialog after a configuration change happened.
    * Adds `SignaturePickerDialogIntegrationExample` and `SignaturePickerDialogIntegrationKotlinExample` to Catalog app which show how to manually integrate the `SignaturePickerDialog` into an activity.
    * API: `SignaturePickerDialog.show()` will now throw an `IllegalArgumentException` if `null` is passed as argument for `@NonNull` parameters.
* Image quality for JPEG now used in Image Documents. (#15499)
* Improves `PdfDocument` Javadoc for saving methods with `DocumentSaveOptions` parameter. (#15514)
* Fixes an issue where closing documents with smart form tab orders could cause a crash. (#15580)
* Fixes an issue where a form field could be rendered more times than necessary. (#15528)
* Fixes an issue with `ImageDocumentExample` where recent changes to the image document were not properly loaded when reopening the example. (#15507)
* Fixes an issue with image documents where annotation changes in certain conditions were not properly saved. (#15604)
* Fixes growing of image document file size after save. (#15479)

#### Instant

* Adds support for annotation notes. (#15573)

### 4.6.0 - 31 May 2018

#### UI

* Adds support 360° rotation of stamps and free text annotations. (#15325)
    * Adds `setRotation`, `getRotation`, and `adjustBoundsForRotation` to `FreeTextAnnotation` and `StampAnnotation`.
    * Adds rotation handle to selected annotations.
* Adds `PdfDocument#setRotationOffset` to allow the user to temporarily set a custom rotation for the page. (#9400)
    * Adds `RotatePageExample` to the Catalog app.
* Adds an ability to share image annotations. (#15115)
    * Adds `DocumentSharingManager#shareBitmap()` as helper for sharing `Bitmaps` using the Android sharing framework.
    * Adds "Share" action to the annotation editing toolbar of image annotations.
* Adds integration of image stamp annotations with system clipboard. (#14875)
    * Bitmaps in system clipboard can now be pasted as image stamp annotations.
    * Puts the bitmap of copied image stamp annotation into system clipboard for pasting them to other apps.
* Adds `SignaturePickerOrientation` to allow users to choose the screen orientation `SignaturePickerFragment` should use. (#13896)
* Adds `setEnableNoteAnnotationNoZoomHandling()` to `PdfActivityConfiguration.Builder` and `PdfConfiguration.Builder` that can be used to disable displaying note annotations as if they had no-zoom flag enabled. (#13131)
* Fixes a `StackOverflowError` caused when displaying a `UnitSelectionEditText` having the default value larger than the maximum allowed value. (#15082)
* Fixes a potential crash that could occur when activity handled its orientation changes. (#15164)
* Fixes an issue where annotation rendering was not updated after calling `PdfFragment#notifyAnnotationHasChanged()` when annotation overlay was enabled. (#15047)
* Fixes an issue where annotations could disappear when switching to eraser. (#15157)
* Fixes an issue where creation of markup annotations stopped working after undo. (#15172)
* Fixes an issue where selected annotation was reselected when calling `PdfFragment#setSelectedAnnotation()`. (#15291)

#### Model

* API: The `Annotation#getName()` property is now automatically initialized with a unique type 4 UUID for each newly created annotation. (#15419)
* Adds support for embedded files and file annotations. (#9613)
    * Adds `EmbeddedFile` that represents a single embedded file.
    * Adds `FileAnnotation` that represents an annotation holding an embedded file.
    * Adds `EmbeddedFilesProvider` for managing embedded files of a document. It can be retrieved by calling `PSPDFDocument#getEmbeddedFilesProvider()`.
    * Adds UI support for adding notes to file annotations and for sharing their file contents.
* Adds support for image document loading. (#14270)
    * Adds `ImageDocument` interface.
    * Adds `ImageDocumentLoader` helper class for loading an `ImageDocument` from a `DocumentSource`.
    * Adds `PdfActivity#showImage()` for opening a `PdfActivity` for a passed image document.
    * Adds `PdfFragment#newImageInstance(Uri, PdfConfiguration)` and `PdfFragment#newImageInstance(DataProvider, PdfConfiguration)` for creating a new fragment that displays an image document.
    * Adds `ImageDocumentExample` in the catalog app that shows how to open an image document from the assets folder.
* Adds `PageTemplate` which can be used with `NewPageDialog` to provide additional templates when adding new pages to documents. (#9842)
* Adds ability to define custom page patterns. Changes `PagePattern` from enum to final class. (#14974)
* Adds canvas support to `PdfProcessor`. (#14664)
    * Adds `NewPage#fromCanvas()` for creating new pages with content drawn via canvas API.
    * Adds `NewPage.Builder.withPageItem(PageCanvas)` for drawing content on pages.
    * Adds `PdfProcessorTask#addCanvasDrawingToPage()` that can be used to merge canvas drawing with existing pages.
    * Adds new Catalog app example `DocumentFromCanvasExample`.
* Adds support for annotation blending modes. These can be set using `Annotation#setBlendMode()` (#15416)
* Adds `DefaultBookmarkAdapter` and `DefaultOutlineViewListener` to make integration of `PdfOutlineView` with `PdfFragment` easier. (#14370)
* Adds `SharingOptionsProvider` which can be set using `PdfActivity#setSharingOptionsProvider`. This allows you to provide `ShareOptions` without displaying a `DocumentSharingDialog`. (#12699)
* Adds `PdfOutlineView` integration with `PdfFragment` example to `CustomFragmentActivity`. (#15360)
* Adds `pageIndex` parameter to `PagePdf` constructors allowing creation of `PagePdf` objects referencing any page in the document instead of the first page. (#15266)
* Adds async version of `AnnotationProvider#createAnnotationFromInstantJson()`. (#15163)
* Adds factory methods `fromDocument()`, `newPage()` and `empty()` to `PdfProcessorTask` and deprecates its constructors. (#14986)
* Adds support for `GoToEmbeddedAction` that allows jumping to PDF file that is embedded in the document. (#14596)
* Adds `CopyToClipboardActivity` to catalog that shows how to implement "Copy to clipboard" share action for shared images. (#15109)
* Adds `DocumentSharingProviderProcessor` that provides methods for preparing complex data for sharing via `DocumentSharingProvider`. (#15019)
    * Add methods for preparing `EmbeddedFile`, `Bitmap` and `DataProvider` data for sharing.
    * Deprecates `DocumentSharingProcessor`, use `DocumentSharingProviderProcessor#prepareDocumentForSharing()` instead.
    * Deprecates `DocumentSharingProvider#deleteTemporaryFile()`, use `DocumentSharingProvider#deleteFile()` instead.
* Adds `getHighlightedTextBlocks()` to text markup annotations that returns list of `TextBlock` for markup annotations. (#12989)
* Adds annotation `name` to Instant JSON. Also renames `pspdfkit/file` `name` to `filename` to prevent collisions. (#14856)
* Adds better detection for standard stamp subjects for Instant JSON. (#14919)
* Improves XFDF output by omiting `opacity` if set to the default (1.0). (#15354)
* Improves compatibility of note annotations with certain 3rd-party viewers such as Apple Preview. (#14953)
* Improves consumer Proguard rules. (#14652)
* Fixes a bug where annotation replies are not removed from cache when the base annotation is being deleted. (#14923)
* Fixes a problem where the text in unsigned form field overlays may be cut off. (#14922)
* Fixes an issue where `setInReplyTo()` did not work when the target annotation was not attached to a document. (#14863)
* Fixes an issue where annotation returned from `AnnotationProvider#createAnnotationFromInstantJson()` was not attached to page. (#15154)
* Fixes an issue where some action destinations may not work properly. (#14901)
* Fixes an issue where using `FormElementConfiguration` children while integrating in Kotlin led to `IllegalAccessError`. Adds `FormCreationKotlinExample` to showcase form creation using Kotlin. (#15470)
* Fixes security vulnerability CVE-2018-9127 in Botan, where wildcard certificates could be accepted for invalid hostnames. (#15374)
* Fixes the grouped menu items being selectable in annotation editing, document editing and text selection toolbars. (#14853)
* Fixes an issue where glyph frames were larger than expected due to unexpected values in their fonts. (#14169)
* Fixes incorrect calculation of glyph frames when the page matrix is not identity. (#13668)

#### Instant

* Adds support for Instant Layers. (#14007)
    * Deprecates `InstantClient#openDocument/Async(documentId, authToken)`, use `InstantClient#openDocument/Async(jwt)` instead.
    * Deprecates `InstantClient#getInstantDocumentDescriptor()`, use `InstantClient#getInstantDocumentDescriptorForJwt()` instead.
    * Deprecates `InstantDocumentDescriptor#getAuthenticationToken()`, use `InstantDocumentDescriptor#getJwt()` instead.
    * Deprecates `InstantPdfDocument#updateAuthenticationToken/Async()`, use `InstantPdfDocument#reauthenticateWithJwt/Async()` instead.
    * Deprecates `InstantPdfActivityIntentBuilder#fromInstantDocument()`, `InstantPdfActivity#showInstantDocument()` and `InstantPdfFragment#newInstance()` with `documentId` parameter, use overloaded methods without this parameter.
    * Adds `InstantPdfActivity#setDocument()` that allows loading of different Instant document in an existing activity.
    * Adds `InstantClient#getLocalDocumentDescriptors()` for retrieving all locally cached document descriptors.
    * Adds `InstantClient#removeLocalStorageForDocument()` for removing local storage for all document layers.
    * Public methods in Instant API now throw an exception when required parameters are `null`.
* Fixes an issue where the annotations of a document would seem to be missing until the first sync. (#15338)

## Previous Releases

### 4.5.1 - 26 Apr 2018

#### UI

* Adds `pspdf__mainToolbarTextColor` theme attribute that can be used to configure text color of the main toolbar. (#14569)
* Improves `NoteEditorFragment` changing the status bar color to the annotation color when UI is fullscreen. (#14880)
* Note editor dialog size is increased on tablets. (#14866)
* Fixes an issue where overlaid annotations were not displayed together with page rendering. (#14912)
* Fixes signature list selection color and document editor page selection icon not being customizable using themes. (#14968)
* Fixes an issue where replies editor was losing focus after rotations and keeping soft-keyboard visible. (#14873)

### 4.5.0 - 5 Apr 2018

#### UI

* Adds new note editor UI. (#14505)
    * Adds support for adding/editing annotation replies.
    * Adds support for setting the review state on annotation note content.
* Adds annotation opacity slider to annotation property inspector. (#13870)
* Fixes a potential crash that could occur when editing annotations on pages having a large number of annotations. (#14366)
* Fixes an issue where free-text annotations were marked modified after being selected. (#14159)
* Fixes an issue with fit to screen mode always rounding down when calculating page size. (#14653)
* Fixes the grouped menu items being selectable in annotation editing, document editing and text selection toolbars. (#14853)

#### Model

* Adds support for annotation replies. (#13309)
    * Adds `AnnotationProvider#getFlattenedAnnotationReplies[Async]()` for getting replies to a given annotation (nested replies are added to the list).
    * Adds `AnnotationProvider#getAnnotationReplies[Async]()` for getting replies to a given annotation (only contains first-level replies).
    * Adds `AuthorState` class, representing a state that can be set on the annotation content and replies.
    * Adds `AnnotationStateChange` that holds the data of the state change performed on the annotation.
    * Adds `AnnotationReviewSummary` that carries the summary of currently set states and authors that have set each of them.
    * Adds `AnnotationProvider#getReviewHistory[Async]()` for retrieving the history of reviews statuses as they were changed.
    * Adds `AnnotationProvider#getReviewSummary[Async]()` for retrieving the summary of currently set states and authors that have set each of them.
    * Adds `AnnotationProvider#appendAnnotationState[Async]()` that allows you to record new author state changes on the document.
    * Adds `annotationReplyFeatureEnabled()` to `PdfConfiguration` and `PdfActivityConfiguration` for enabling/disabling annotation replies in UI.
    * Adds `Annotation#setInReplyTo(Annotation annotation)` and `Annotation#getInReplyTo()` for making annotation a reply.
* Adds `FormElement#setPreviousElement()` and `FormElement#setNextElement()` for setting previous and next form element. (#14523)
    * Adds `FormProvider#addFormElementToPageAsync()` and `FormProvider#addFormElementsToPageAsync()` that programmatically create and insert a form field into the document, asynchronously.
* Adds support for canceling in progress page renders. (#14217)
* Filters out invalid characters from a page's text. (#14516)
* Fixes `PSPDFKit#initialize` resetting the `ApplicationPolicy` on each call. (#14229)
* Fixes a crash when trying to paste text into a document without having the annotation feature licensed. (#14709)
* Fixes a potential crash when saving a document. (#14082)
* Fixes a potential issue when removing annotations. (#14381)
* Fixes an issue where a flattened document shows a blank page in Preview. (#13708)
* Fixes an issue where image data wasn't properly removed after rewriting the PDF. (#14708)
* Fixes an issue where where `OnAnnotationUpdatedListener#onAnnotationUpdated()` was being called multiple times even when annotation was changed only once. (#14133)
* Fixes faulty recycling of framework internal objects that could lead to memory issues. (#14790)
* Fixes forms on rotated pages not being rendered correctly. (#14422)
* Fixes framework being obfuscated twice when using consumer Proguard rules. (#14601)
* Fixes potential deadlocks when opening a lot of documents. (#14503)
* Fixes an issue where author name was not set on created image annotations. (#14743)

#### Instant

* Enable multidex support in PSPDFKit Instant example. (#14757)

### 4.4.1 - 16 Mar 2018

#### UI

* Annotations overlay is now enabled by default on high-end devices. (#13653)
    * If you wish to disable this behavior, pass an empty set to `PdfFragment#setOverlaidAnnotationTypes()`.
* Adds `PdfFragment#getOverlaidAnnotationTypes()` and `PdfFragment#getOverlaidAnnotations` to retrieve set of annotation types or annotations that are enabled for overlay mode rendering. (#14457)
* Fixes a bug that could cause a ANR when quickly detaching a `PdfFragment` after attaching it to an activity. (#14472)
* Fixes status bar covering the screen when dragging toolbar in immersive mode. (#14399)

#### Model

* `PdfDocument#openDocument()` methods will now throw wrapped exceptions of `DataProvider` to make error debugging simpler. (#14493)
* Fixes an issue where opening large documents with marked content used very large amounts of memory. (#14415)
* Fixes `PdfDocument#invalidateCacheForPage` doing nothing. (#14211)
* Fixes an issue where `OnAnnotationUpdatedListener#onAnnotationUpdated()` was being called 2 times after undoing annotation changes. (#14533)
* Fixes an issue where annotation returned to page after undoing its deletion had changed object number. (#14532)
* Fixes an issue where custom text for `ComboBoxFormElement` was not shown when set. (#14461)
    * Adds support for selecting multiple options for `ListBoxFormElement` and exposing convenient configuration method `Builder.ListBoxFormConfiguration#setMultiSelectionEnabled`
    * API: Renames `Builder.ComboBoxFormConfiguration#setSelectedIndexes` to `Builder.ComboBoxFormConfiguration#setSelectedIndexes` because `ComboBoxFormElement` supports only single-selection.
    * Adds `ComboBoxFormConfiguration` and `ListBoxConfiguration` examples to `FormCreationExample` in Catalog app.
* Fixes issue where `pdfId` was required when importing a Instant JSON document. (#14494)

### 4.4.0 - 9 Mar 2018

#### UI

* Adds support for rendering annotations in overlay mode. (#11835)
    * Adds `PdfFragment#setOverlaidAnnotationTypes()` to configure set of annotation types that should be extracted to annotation overlay.
    * Adds `PdfFragment#setOverlaidAnnotations()` to configure annotations that should be extracted to annotation overlay.
* Fixes a potential crash that occurred when selecting large annotations when page was zoomed. (#14062)
* Fixes an issue where Annotations that were added using AnnotationProvider#createAnnotationFromInstantJson() were not editable. (#14340)
    * API: AnnotationProvider#createAnnotationFromInstantJson() will now throw when license does not support annotation editing.
    * AnnotationProvider#createAnnotationFromInstantJson() is now marked @NonNull instead of @Nullable.
    * AnnotationProvider#createAnnotationFromInstantJson() will now call OnAnnotationUpdatedListener#onAnnotationCreated()
* Fixes an issue where dropdown arrow on combo boxes are not seen when box has a small width. (#14326)
* Fixes an issue where dropdown arrows are still seen on combo boxes when document is flattened. (#9539)
* Fixes an issue where toolbar was left with an empty space after hiding menu item. (#13180)
* Fixes a potential crash that could occur when changing text of selected free-text annotation from background thread. (#14441)
* Fixes an issue where annotation editing toolbar was missing grouping rule for custom button used in the `AnnotationFlagsActivity`. (#14139)

#### Model

* API: Cleans up nullability annotations on our Annotation API. (#13956)
    * Annotation methods marked with `@NotNull` will no longer ignore illegally passed `null` values but will instead throw an `IllegalArgumentException`.
    * `InkAnnotation#getLines()` and `InkAnnotation#setLines()` are now marked as `@NonNull`.
    * `PolygonAnnotation#getPoints()` and `PolylineAnnotation#getPoints()` now return non-null values.
    * `TextMarkupAnnotation#setRects()` and `TextMarkupAnnotation#getRects()` are now marked as `@NonNull`.
* API: Rects in `TextBlock` and `TextSelection` now represent the font size more closely. (#13803)
* API: `PdfProcessor` now throws an exception when the output file points to the original input file. (#13876)
* API: `StampAnnotation#setBitmap` now sets bitmap when used on standard stamps and `StampAnnotation#setSubject` now sets subject on bitmap stamps. These methods previously logged error and returned without performing requested action. (#13920)
* Adds support for programmatically creating forms using `FormProvider#addFormElementToPage`. (#13777)
    * Adds `CheckBoxFormConfiguration` and `CheckBoxFormConfiguration.Builder` for creation and configuration of `CheckBoxFormElement`.
    * Adds `ComboBoxFormConfiguration` and `ComboBoxFormConfiguration.Builder` for creation and configuration of `ComboBoxFormElement`.
    * Adds `ListBoxFormConfiguration` and `ListBoxFormConfiguration.Builder` for creation and configuration of `ListBoxFormElement`.
    * Adds `PushButtonFormConfiguration` and `PushButtonFormConfiguration.Builder` for creation and configuration of `PushButtonFormElement`.
    * Adds `RadioButtonFormConfiguration` and `RadioButtonFormConfiguration.Builder` for creation and configuration of `RadioButtonFormElement`.
    * Adds `SignatureFormConfiguration` and `SignatureFormConfiguration.Builder` for creation and configuration of `SignatureFormElement`.
    * Adds `TextFormConfiguration` and `TextFormConfiguration.Builder` for creation and configuration of `TextFormElement`.
* Adds `SearchOptions#priorityPages(ArrayList<Range> priorityPages, Boolean searchOnlyInPriorityPages)`, which allows you to restrict the search to a particular page range by setting `searchOnlyInPriorityPages` to true. (#12772)
* Adds more specific Proguard rules to keep API related code and examples from obfuscation. (#14360)
* Adds support for automatically updating the last modified date when changing annotations. (#14000)
* Improves digital signing APIs to support external signature providers (such as HSMs). (#13932)
    * Adds `SignatureProvider` interface for implementing custom signature providers.
    * Adds `PrivateKeySignatureProvider` implementation for signing PDF data using a `PrivateKeyEntry`.
    * Adds abstract method `Signer#prepareSigningParameters()` which has to be implemented by subclasses to return a `SignatureProvider` instance.
    * Adds `EncryptionAlgorithm` enum and `HashAlgorithm` enum of various encryption and hash algorithms respectively that are supported when signing PDFs.
    * Adds `InteractiveSigner` interface, which can be implemented by a `Signer` to allow digital signing flows that require to retrieve a password from the user.
    * Adds the abstract `PrivateKeySigner` which is a base class for any signer that can sign PDFs using a `PrivateKeyEntry`.
    * API: `Signer#getDisplayName()` is now final. Use the constructor to provide a display name for the signer instead.
    * Deprecates `Signer#signFormFieldAsync()` and `Signer#signFormField()` methods taking a `PrivateKeyEntry` as argument. Check out the 4.4 migration guide for alternative APIs.
    * Deprecates `MemorySigner#signFormField()` and `MemorySigner#signFormFieldAsync()`. Use the equivalent methods on the `Signer` base class.
* Methods in `PSPDFKit` now throw an exception when required parameters are `null`. (#14080)
* Fixes FTS5 search on SQLite versions >= 3.20.0. (#14036)
* Fixes an issue where parts of `com.pspdfkit.undo` were obfuscated. (#14464)
* Fixes an issue saving a document with invalid PDF syntax (empty dictionary key). (#14009)
* Fixes an issue where `null` values set to `@Nullable` Annotation properties did not clear the property value in the document. (#13900)
* Fixes an issue where action destinations would not be found if sorted incorrectly. (#14412)
* Fixes an issue where some form fields with custom FQNs may not be signed correctly. (#14309)
* Fixes crashes on document unload when FormTabOrderCalculator is being processed. (#13976)
* Fixes document corruption bug that could happen when documents with header were incrementally saved. (#14249)
* Fixes potential crash when saving files with irregular outlines. (#14116)
* Fixes document corruption issue when document has a header and is incrementally saved. (#14249)

#### Example

* Adds the new example `FormCreationExample` to Catalog app that demonstrates form creation starting from an empty PDF document. (#14428)

#### Instant

* Adds `createdAt`, `updatedAt` and `creatorName` to Instant JSON. (#14443)

### 4.3.1 - 1 Feb 2018

* **Updated dependencies:**
    * Kotlin 1.2.21 / `org.jetbrains.kotlin:kotlin-stdlib:1.2.21`
* Adds a Catalog example on how to use form editing bar and inspector when using `PdfFragment` with custom activity. (#13750)
* Improves undo/redo by adding support for undoing changes made to Polyline and Polygon annotations. (#13963)
* Annotations with `HIDDEN` or `NO_VIEW` flag are now displayed in the annotation list by default. (#13619)
* Update Kotlin to 1.2.21. (#13995)
    * Adds Kotlin extensions to Catalog app. See `PSPDFKitKotlin.kt`.
* Updates localized strings, fixing some minor issues. (#13155)
* Fixes a crash caused by `NullPointerException` in the internal `AnnotationClipboard` class. (#14037)
* Fixes an assertion when a non-specified named action was deserialized via Instant JSON. (#13804)
* Fixes an issue in dropdown list forms where searching for an element was allowing newlines. (#13986)
* Fixes an issue on Android API 21+ were `ContextualToolbar` instances inside the `PdfActivity` would sometimes use a wrong elevation, resulting in them being hidden behind the primary toolbar. (#13764)
* Fixes an issue where `PdfDocument#saveIfModified` did not clear dirty state of bookmark provider. (#14026)
* Fixes an issue where certain free-text annotations were drawn as empty after selection. (#13994)
* Fixes an issue where drawn ink annotations disappeared after leaving the annotation creation mode. (#14035)
* Fixes an issue where saving a document to path cleared the dirty state from document metadata and form provider. (#13751)
* Fixes an issue where stamp annotations with custom AP streams lost transparency and subject after copying. (#13847)
* Fixes an issue where the next form element after a drop-down list was selected. (#13806)
    Adds new configuration options `PdfConfiguration.Builder#enableAutoSelectNextFormElement()` and `PdfConfiguration.Builder#disableAutoSelectNextFormElement()`
* Fixes an issue where transparent color was not properly exported to XFDF. (#13016)
* Fixes a crash caused by device not having the activity to handle the storage access when trying to save the document. (#14039)
* Fixes a crash invoked by pressing `RETURN` when adding custom form option. (#14001)

### Instant

* Fixes an issue where `InstantAnnotationProvider#hasUnsavedChanges()` reported wrong state. This method now returns `true` when there are unsynced annotations changes. (#13988)
* Fixes an issue where thumbnail bar wasn't refreshed after syncing annotations with Instant. (#13988)

### 4.3.0 - 24 Jan 2018

* **Updated dependencies:**
    * Kotlin 1.2.20 / `org.jetbrains.kotlin:kotlin-stdlib:1.2.20`
    * Device Year Class 2.0.0 / `com.facebook.device.yearclass:yearclass:2.0.0`
* Adds support for annotation undo and redo. (#5626)
    * Adds `UndoManager` that manages a stack of edits on a `PdfFragment` and provides methods for navigating back and forth in the edit history.
    * Adds `PdfFragment#getUndoManager()` for retrieving the undo manager of the fragment.
    * Adds `OnUndoHistoryChangeListener` for listening to changes to the edit history of an undo manager.
    * Adds `undoEnabled()` and `redoEnabled()` to `PdfConfiguration` for selectively configuring whether undo and redo should be available to the user.
    * Adds style attributes `pspdf__undoIcon` and `pspdf__redoIcon` to the `pspdf__AnnotationCreationToolbarIcons` styleable, to change the look of the undo and redo buttons.
* Adds support for copying and pasting annotations. (#5556)
    * Adds `enableCopyPaste()` and `disableCopyPaste()` to `PdfConfiguration`.
    * Adds `setEnabledCopyPasteFeatures()` to `PdfConfiguration`, this allows more granular control over how copy/paste works.
    * Adds system clipboard integration for copying text from any app into a PDF document and for extracting text from annotations.
    * Adds `ANNOTATION_COPY_PASTE_SYSTEM_INTEGRATION` application policy to allow controlling the system clipboard integration.
    * Adds handling for common shortcut keys Ctrl+C, Ctrl+X, and Ctrl+V for copying, cutting, and pasting annotations using a keyboard.
    * Adds copy and cut actions to the `AnnotationEditingToolbar`. To change the icons you can set the `pspdf__copyIcon` and `pspdf__cutIcon` attributes on the `pspdf__AnnotationEditingToolbarIcons` of your theme.
    * Adds long-press gesture to pages, which will now paste an annotation that was previously copied to the clipboard.
* Adds support for visual annotation contents hint. (#12550)
    * Adds class `AnnotationNoteHinter` that extends `PdfDrawableProvider` for drawing visual hints for supported annotation types.
    * Adds `setAnnotationNoteHintingEnabled()` to `PdfActivityConfiguration.Builder` to control whether annotation contents hints are enabled.
    * Adds new `CustomAnnotationNoteHinterProviderExample` in catalog with an example on how to implement a custom annotation note hinter drawable provider.
* Adds alpha rendering support for annotations. A call to `Annotation#setAlpha()` will now produce the expected transparency effects for rendered annotations. (#9618)
* Adds a smart low resolution render strategy using the [Device Year Class library](https://github.com/facebook/device-year-class). (#13355)
    * Adds `PdfConfiguration.Builder#setFixedLowResRenderPixelCount()` and `PdfConfiguration#getFixedLowResRenderPixelCount()` to set and retrieve fixed low resolution render pixel count without using an optimized value.
* Adds `AnnotationProperty#ANNOTATION_NOTE` for controlling whether annotation notes are enabled for specific annotation types. If `AnnotationDefaultsProvider#getSupportedProperties()` for a given annotation type includes `ANNOTATION_NOTE`, annotation notes are enabled for the type.(#13560)
* Adds `getOverlappingInkSignature()` to `SignatureFormElement` that can be used to retrieve `InkAnnotation`s that are overlapping signature fields. (#10675)
* Adds `Annotation#setSubject()` to set the subject property of an annotation. (#13766)
    * Calling `setSubject()` on `StampAnnotation` instances with custom bitmaps is not supported, and will throw an exception.
* Adds `AnnotationProvider#hasUnsavedChanges()` to check if there are changes to annotations that need to be saved to disk. (#13322)
    * Deprecates `AnnotationProvider#isDirty()`, `AnnotationProvider#clearDirty()`, and `AnnotationProvider#prepareForSave()`.
* Adds form field values to Instant JSON. (#13335)
* Adds support for PEM-encoded certificates in PKCS#7 files. (#13698)
* Adds support for creating empty `FreeTextAnnotations`. (#13781)
* Adds Kotlin as transitive dependency. (#5638)
    * Adds a new `KotlinExample` which showcases how to use PSPDFKit with the Kotlin programming language.
* Improves the customizability of the navigation buttons declaring `pspdf__navigationHistoryIconColor` styleable. These allow you to change the chevrons color in the navigation buttons. (#13717)
* "Sign here" badge is now hidden once an ink signature is drawn on top of the signature field. (#13456)
* `SignatureSignerDialog` can now sign documents without saving them first. This can be used to sign documents from read-only sources. (#13213)
    * Adds `SignatureSignerDialog.Options` which allows you to specify the parameters for the `SignatureSignerDialog`.
    * Deprecates `SignatureSignerDialog#show(FragmentManager, PdfDocument, SignatureFormField, Signer, BiometricSignatureData, DocumentSigningListener)`. Use `SignatureSignerDialog#show(FragmentManager, Options, DocumentSigningListener)}` instead.
* Improves minimum size calculation of annotations. (#13313)
    * The new default minimum size is 16x16pt with a few exceptions.
    * The minimum size of `PolygonAnnotation`, `PolylineAnnotation` and `LineAnnotation` remain unchanged.
    * The minimum size of callout annotations was changed from 48x32pt to 24x16pt.
* Improves the detection of digital signatures in third-party PDF readers. (#13593)
* Improves the accuracy of the information about the digital signature validation process by demoting some non-critical errors to warnings. (#13570)
* Improves the stability of the digital signing process with some certificate authorities with missing fields. (#13694)
* API: Fixes wrong `from` bound of `@IntRange` annotation on `PdfActivity#getSiblingPageIndex()` from `-1` to `0`. (#13713)
* API: `InstantClient#create()` now throws an `InstantException` instead of crashing when the client cannot be created. (#13365)
* API: `InstantClient#getInstantDocumentDescriptor`, `InstantClient#openDocument`, and `InstantClient#openDocumentAsync` now throw an `InstantException` instead of crashing when the document data on disk cannot be accessed. (#13365)
* API: Improves the customizability of the inline search view. (#13517)
    * Adds `pspdf__inputFieldTextAppearance` and `pspdf__resultTextAppearance` to `pspdf__SearchViewInline` styleable. These allow you to change the text appearance of the input field and the result count view respectively.
    * Adds `pspdf__throbberColor` to `pspdf__SearchViewInline` styleable. This allows you to change the color of the loading throbber.
    * Removes `pspdf__textColor`, `pspdf__hintTextColor`, and `pspdf__navigationTextColor` from `pspdf__SearchViewInline` styleable. These are replaced by setting the text appearance.
* API: Hide several undocumented methods on `Annotation` which were meant for framework internal use only. (#13805)
* Fixes polygon fill and stroke overlap when drawing with alpha. (#13868)
* Fixes displaying multiple annotations instead of one for eraser mode. (#13867)
* Fixes missed search terms which span over a newline without a hyphen. (#11862)
* Fixes form highlights, required field border, list box selection colors when in grayscale mode (#12996)
* Fixes an issue where default color for highlight annotations were not rendered properly. (#12938)
* Fixes an issue where filtered types were being added to the annotation list on the first document opening. (#13378)
* Fixes an issue where `getPageText()` and `getPageTextRects()` on `PdfDocument` would not work properly for vertical or rotated text. (#13423)
* Fixes an issue with stamp annotations not being rendered when using XFDF. (#13330)
* Fixes specific issue where previous xref has the same object number as a newly created object. (#13183)
* Fixes an issue where some texts in signature form fields may not be translated. (#13441)
* Fixes an issue where annotations could not be resized after being stretched to the maximum height of the page. (#9977)
* Fixed an issue where eraser was not applied when affecting multiple annotations. (#12946)
* Fixes an issue where the `SignatureSignerDialog` wasn't restored on configuration change. (#13213)
* Fixes an issue where image stamp annotations appeared scaled up. (#13703)
* Fixes an issue where new page dialog used incorrect text color in the dark theme. (#13590)
* Fixes an issue where note editor crashed on certain devices due to missing resource. (#13585)
* Fixes an issue where a signed document may show a warning if inspected with a PDF lint tool. (#13719)
* Fixes an issue where `OnContextualToolbarLifecycleListener#onPrepareContextualToolbar()` was not called when changing active annotation creation/editing mode - i.e. when changing selected tool in annotation creation mode and when reselecting annotations in annotation editing mode. (#13558)
    * Adds protected method  `notifyToolbarChanged()` to `ContextualToolbar` that should called by specific toolbar implementation when toolbar contents are changed.
    * Adds `onContextualToolbarChanged()` to `ToolbarCoordinatorLayoutController`, that is called when toolbar menu items have changed.
* Fixes opening of unsupported documents with page labels (#13509)
* Fixes an issue where some list boxes do not display all the possible options. (#13454)
* Fixes highlight markups on some specficic documents (#13768)
* Fixes an issue where empty free-text annotations were not rendered properly. (#13782)
* Fixes an issue where checkbox values were not updated correctly. (#13843)
* Fixes an unhandled `NullPointerException` thrown while erasing ink annotations. (#13715)
* Fixes an issue where tapping the page quickly after removing an annotation could lead to a crash. (#13885)
* Fixes an issue where annotations were not rendered properly when global AP stream generator was set. (#13872)

#### Instant

* Adds a catalog example that uses Instant to load documents from our public preview server and demonstrates real-time annotation synchronization. (#13411)
* Adds `InstantDocumentState` describing the possible states that a `InstantPdfDocument` can be in. (#11324)
    * Adds `onDocumentStateChanged()` to `InstantDocumentListener`, that is called whenever document state changes.
* Adds `isListeningToServerChanges()` and `getDelayForSyncingLocalChanges()` to `InstantPdfDocument`. (#13247)
* API: Removes list of updated annotations from `InstantDocumentListener#onSyncFinished()`. (#13532)
* API: Methods annotated with `@NotNull` will no longer ignore illegaly passed `null` vaues but will instead throw an `IllegalArgumentException`. (#13571)
* Fixes an issue where annotations created with default properties were not synced with Instant server. (#13348)
* Fixes a memory leak related to sync requests. (#13540)
* Fixes a dangling pointer issue when parsing invalid server responses. (#13557)
* Fixes an issue where syncing created new annotations instead of updating old ones. (#13407)
* Fixes an issue where Proguard would fail when applied on an app integrating Instant. (#13620)

### 4.2.1 - 30 Nov 2017

* Improves scrollable thumbnail bar state restoration after configuration changes. (#10459)
* Fixes an issue where dismissing `DownloadProgressFragment` would cause an exception from detaching after `onSaveInstanceState()` was called. (#13222)
* Fixes an issue where a configuration change while showing the `DownloadProgressFragment` would freeze the app. (#13241)
* Fixes an issue where all items inside the annotation list had the same color. (#13082)
* Fixes an issue where documents with links would not point to the correct destination after being exported. (#13341)
* Fixes an issue where dark styles were not applied correctly in the catalog app when in night mode. (#13285)

#### Instant

* Fixes an issue where annotations would be positioned wrongly when created on a page with a transform. (#12492)

### 4.2.0 - 23 Nov 2017

* Adds `DocumentJsonFormatter` for exporting and importing Instant Document JSON to `PdfDocument` instances. (#11674)
    * Adds new package `com.pspdfkit.document.formatters` for document serialization related classes.
    * Deprecates `com.pspdfkit.annotations.xfdf.XfdfFormatter`. Use `com.pspdfkit.document.formatters.XfdfFormatter` instead.
* Fixes form highlights, required field border, list box selection colors when in grayscale mode (#12996)
* Fixes newly added signatures not being selected after rotating from landscape to portrait. (#12941)
* Fixes an issue where default `OnDocumentLongPressListener` overrides the one set by the user, if that happened before the fragment creates views. (#13091)
* Fixes an issue where a `BookmarkListener` attached to `BookmarkProvider` would not be notified of changes to a single bookmark item or to the list's sort order. (#9496)
* Fixes an issue where newly created `Annotation` instances would internally hold the wrong alpha value, which could lead to problems while serializing/deserializing data or when comparing annotations using `equals()`. (#13249)
* Fixes a crash that could happen when rendering the preview for stamp picker items with custom appearance streams. (#13196)

#### Instant

**Important:** This release requires [PSPDFKit Server 2017.8](https://pspdfkit.com/changelog/server/#2017.8) for syncing. If you try to connect to an older version of the server, syncing will fail. For further information, please refer to the migration guides for [PSPDFKit Server](https://pspdfkit.com/guides/server/current/migration-guides/2017-8-migration-guide/) and [PSPDFKit Web](https://pspdfkit.com/guides/web/current/migration-guides/2017-8-migration-guide/).

* API: `#getAnnotationProvider` in `InstantPdfDocument` now returns  `InstantAnnotationProvider` that extends `AnnotationProvider` with Instant related functionality. (#11682)
* Adds `#getIdentifierForAnnotation()` and `#getAnnotationForIdentifier()` to `InstantAnnotationProvider`. These APIs provide a stable, unique identifier for annotations managed by Instant. These identifiers are well suited to, for example, associate arbitrary data from external sources with an annotation. (#11682)

### 4.1.0 - 15 Nov 2017

* Adds support for biometric signatures. (#12865)
    * Adds class `BiometricSignatureData` that can be written to a digital signature.
    * Adds overloads to `Signer#signFormField()` and `Signer#signFormFieldAsync()` that take a `BiometricSignatureData` and will save it to the document while digitally signing it.
    * Adds `getBiometricData()` to the existing `Signature` class which will return biometric data for a signature.
    * Signatures created with the `SignaturePickerFragment` will now contain biometric data if Digital Signatures are enabled in the used licence.
* Adds support for custom appearance streams for annotations. (#12217)
    * Adds `AppearanceStreamGenerator` interface that supplies `DataProvider` for PDF document that should be used as a custom appearance stream for annotations.
    * Adds `Annotation#setAppearanceStreamGenerator()` to configure appearance stream generator for annotation and `Annotation#getAppearanceStreamGenerator()` to retrieve it.
    * Adds `Annotation#generateAppearanceStream()` and `Annotation#generateAppearanceStreamAsync()` to regenerate annotation's appearance stream.
    * Adds `AnnotationProvider#addAppearanceStreamGenerator()` to register global appearance stream generator that should be used for all annotations in the document before falling back to annotation's own `AppearanceStreamGenerator`. Adds `AnnotationProvider#removeAppearanceStreamGenerator()` to unregister appearance stream generator.
    * Adds `AssetAppearanceStreamGenerator` and `ContentResolverAppearanceStreamGenerator` for generating appearance streams from documents stored in application assets or provided by content providers.
    * Adds support for defining `StampPickerItem` with custom appearance stream generator.
    * Extends `AnnotationCreationExample` in catalog with an example on how to programatically create stamp annotations with custom appearance.
    * Extends `CustomStampAnnotationsExample` in catalog with an example on how to define stamp type with custom appearance stream generator. This can be used to create vector based stamps with transparent background.
* Widens Drawable API support. Now available for `PdfThumbnailBar`,`PdfThumbnailGrid` and as a part of `PageRenderConfiguration`. (#7121)
    * Adds `pdfDrawables()` call to `PageRenderConfiguration` constructor.
    * Adds `addDrawableProvider(PdfDrawableProvider)` and `removeDrawableProvider(PdfDrawableProvider)` to `PdfThumbnailBar` and `PdfThumbnailGrid` for managing drawable providers.
    * Adds `setDrawableProviders(List<PdfDrawableProvider>)` to `ThumbnailAdapter`, `PdfThumbnailBarController` and its implementations `PdfThumbnailGrid` and `PdfStaticThumbnailBar`.
* Adds support for searching through the options of form list and combo boxes. (#12760)
* Adds support for transferring document level JavaScript when processing a document. (#12769)
* Adds overloads for `Annotation#renderToBitmap` and `Annotation#renderToBitmapAsync` accepting  `AnnotationRenderConfiguration` that can be used to control advanced annotation rendering options. (#12916)
* Adds the utility method for calculating bounding box from lines - `PdfUtils#boundingBoxFromLines()`. (#12846)
* Improves usage of quantity strings (plurals). (#13039)
* Improves detection of RichMedia elements and always prefers to show controls for audio-only tracks. (#12986)
* Improves displayed annotation contents for annotation list in `PdfOutlineView`. (#12553)
* Improves the switch animation from indeterminate circular progress bar to determinate horizontal progress bar when opening documents that have a provided progress. (#11878)
* Improves `SignaturePickerFragment` on tablets by disabling touch dismissing it while the user is entering a signature. (#8505)
* API: Deprecates `registerDrawableProvider(PdfDrawableProvider)` and `unregisterDrawableProvider(PdfDrawableProvider)` in `PdfFragment`. Use `addDrawableProvider(PdfDrawableProvider)` and `removeDrawableProvider(PdfDrawableProvider)` instead. (#7121)
* Fixes an issue where color for selected item in listbox form fields fell back to transparent when it wasn't defined in theme. (#12991)
* Fixes an issue when saving a document that has been restored from a checkpoint. (#12890)
* Fixes an issue with incorrect tab order in forms. (#12902)
* Fixes an issue where some flattened documents may not show correctly in third party readers. (#12901)
* Fixes the positioning of the underline on text when no ascending characters are present on the line. (#11489)
* Fixes an issue where some ink annotations may not be rendered correctly by third party readers. (#12900)
* Fixes missing document link action when destination is not defined. (#12917)
* Fixes an issue when exporting XFDF with non-ascii characters. (#12892)
* Fixes an issue where adding a signature with only a single point in it caused forms to no longer work. (#12976)
* Fixes an issue where the loading throbber wasn't hidden when the document failed to load. (#12804)
* Fixes `GoToRemoteAction` object having `GOTO` action type set to it, instead of `GOTO_REMOTE`. (#13071)
* Fixes a problem where some PDF documents may not show every form field element. (#12998)
* Fixes issue where text in form fields are always black. (#12449)
* Fixes a display problem were previously stored signatures were clipped when displayed in the `SignaturePickerFragment`. (#13057)
* Fixes dangling symbols names in catalog app descriptions and Javadoc. (#13043)
* Fixes an issue when trying to interact with a form whilst a PdfProcessorTask is in progress. (#12973)

#### Instant

**Important:** This is the last release of Instant compatible with PSPDFKit Server 2017.7 and earlier. The next release will require 2017.8. For further information, please refer to the [migration guide](https://pspdfkit.com/guides/web/current/migration-guides/2017-8-migration-guide/).

* Adds error codes to `InstantErrorCode` for the cases where the client and server have incompatible versions: `OLD_CLIENT` and `OLD_SERVER`. (#12720)
* Adds a Proguard rule to consumer file to prevent a warning related to AutoValue. (#12888)
* `InstantPdfFragment` now shows error dialog when encountering `OLD_CLIENT` error and disables automatic sync when encountering either `OLD_CLIENT` or `OLD_SERVER` error codes. This is enabled by default and can be disabled via `InstantPdfFragment#setHandleCriticalInstantErrors()` (#12870)
* API: Adds callbacks for authentication with Instant server to `InstantDocumentListener`: `onAuthenticationFailed` called when authentication fails with an error and `onAuthenticationFinished` when authentication finishes successfully. (#13136)

### 4.0.2 - 27 Oct 2017

* API: Adds two missing methods `#addOnFormTabOrderUpdatedListener()` and `#removeOnFormTabOrderUpdatedListener()` to `FormProvider` which allow management of the already existing `OnFormTabOrderUpdatedListener` interface. (#12847)
* API: Listener removal methods will no longer silently ignore illegally passed `null` values but will instead throw an `IllegalArgumentException`. Affected methods: (#12849)
    * `ActionMenu#removeActionMenuListener()`
    * `AnnotationProvider#removeOnAnnotationUpdatedListener()`
    * `BookmarkProvider#removeBookmarkListener()`
    * `FormEditingBar#removeOnFormEditingBarLifecycleListener()`
    * `FormProvider#removeOnButtonFormFieldUpdatedListener()`
    * `FormProvider#removeOnChoiceFormFieldUpdatedListener()`
    * `FormProvider#removeOnFormFieldUpdatedListener()`
    * `FormProvider#removeOnFormTabOrderUpdatedListener()`
    * `FormProvider#removeOnTextFormFieldUpdatedListener()`
    * `OnVisibilityChangedListenerManager#removeOnVisibilityChangedListener()`
    * `PdfFragment#removeUserInterfaceListener()`
    * `PropertyInspectorCoordinatorLayout#removePropertyInspectorLifecycleListener()`
* API: Adds eager `null` checks to `FormProvider` methods with `@NonNull` parameters. (#12849)
    * `FormProvider#getFormFieldWithFullyQualifiedNameAsync()` and `FormProvider#getFormFieldWithFullyQualifiedName()`
    * `FormProvider#getFormElementForAnnotationAsync()` and `FormProvider#getFormElementForAnnotation()`
    * `FormProvider#getFormElementWithNameAsync()` and `FormProvider#getFormElementWithName()`
* API: Changes type of exceptions thrown by some existing listener management methods. Methods that previously threw a `NullPointerException` when called with a `null` value will now throw an `IllegalArgumentException`. Affected methods: (#12849)
    * `PdfFragment#addDocumentListener()` and `PdfFragment#removeDocumentListener()`
    * `PdfFragment#addDocumentScrollListener()` and `PdfFragment#removeDocumentScrollListener()`
* Improves UI design of signature dialog. (#12646)
    * Removes `pspdf__colorIconsBorderColor` from `pspdf__SignatureLayout` styleable. The signature dialog's color picker is now using a FAB which doesn't have a border.
    * Adds `pspdf__clearSignatureCanvasIconBackgroundColor` to `pspdf__SignatureLayout` which enables you to set the background color of the button for clearing the signature. The default color used is Android's `Color.GRAY`.
* Improves performance when toggling checkboxes. (#12706)
* Improves reliability when saving documents with broken cross-reference tables. (#12212)
* Fixes an issue where ink annotations were drawn incorrectly after finishing touch gestures on high resolution devices. (#12908)
* Fixes wrong toolbar offset calculations in `ToolbarCoordinatorLayout` caused by dynamic window insets on some devices (like the Samsung Galaxy S8). (#12587)
* Fixes an issue where data restored from a checkpoint would not be saved to the file when using incremental saving mode. (#12890)
* Fixes an issue with incorrect tab order in forms. (#12902)
* Fixes an issue where some flattened documents weren't correctly displayed in third party readers. (#12901)

#### Instant

* API: When passing `null` to `InstantPdfFragment#removeInstantDocumentListener()` and `InstantPdfFragment#addInstantDocumentListener()` the methods will now throw an `IllegalArgumentException` instead of the previously thrown `NullPointerException`. (#12849)

### 4.0.1 - 19 Oct 2017

* Adds new catalog app launcher icon for all devices and adaptive launcher icon for Android 8.0 Oreo and newer. (#12220)
* Improves Javadoc for `SharingMenu` and `ActionMenu`. (#12688)
* Calling `PdfFragment#setDocumentSigningListener()` without having Digital Signatures licensed will now throw an `InvalidPSPDFKitLicenseException`. (#12761)
* Fixes a crash that happened when tapping a `SignatureFormElement` without having Digital Signatures or Annotation Editing features licensed. (#12705)
* Fixes several issues with the `AnnotationProvider`. (#12761)
    * Annotates return type of `AnnotationProvider.getAnnotations(int)` as `@NonNull`.
    * Fixes a bug where `annotationProvider.removeAnnotation(...)` would not properly remove annotation instances that were retained across activity configuration changes.
* Fixes issues with font selection for non latin languages. (#12297, #11639)
* Fixes annotations moving on rotated pages when flattening. (#8242)
* Fixes the `SignatureSignerDialog` not being restored on orientation change. (#12615)
    * API: Adds `SignatureSignerDialog#setListener()` to allow you to set the listener of an already displayed dialog.
* Fixes issues with corrupted documents when restoring data from checkpoints. (#12669)
* Fixes an issue where text in form fields could be cut off. (#12494)
* Fixes an issue where the UI wasn't properly reset when setting a new document on a `PdfActivity`. (#12636)
* Fixes an issue with rendering text while zoomed into specific documents. (#12392)
* Fixes an issue on Chromebook devices where share dialog was only partially visible. (#12683)
* Fixes an issue where underline annotations and text extraction did not work correctly for some documents. (#12070)

#### Instant

* Fixes lock inversions that could cause live- or deadlocks when syncing finished while the document was still being parsed. (#11739)
* Fixes an issue where note annotation positions and renderings were not updated after syncing with Instant. (#12641)

### 4.0.0 - 12 Oct 2017

Below is a summary of the API changes in this release. For a full list, with our suggested migration strategy for each API that has been changed or removed, please see the [migration guide](https://pspdfkit.com/guides/android/current/migration-guides/pspdfkit-4-migration-guide/)

* **The minimum required version is now Android 4.4 (API Level 19).**
* **Updates dependency** - Support libraries to `26.0.2`, RxJava to `2.1.3`.
* API: Adds `PdfFragment#newInstance(PdfFragment fragment, PdfConfiguration configuration)` that copies the state of the given `PdfFragment` to the new instance.
* Adds support for AES encryption when saving or processing a document. (#4420)
* API: Adds API to save and restore checkpoint files for PDF documents that support checkpointing. (#11970, #12387)
    * API: Adds `PdfDocumentCheckpointer` to handle saving and cleaning of document checkpoints using a configurable saving strategy.
    * API: Adds `PdfDocument#getCheckpointer()` which returns the document's checkpointer instance.
* API: Adds callbacks for annotation creation and removal. (#10865)
    * Annotation creation, updates and removal are now notified via separate methods of `AnnotationProvider.OnAnnotationUpdatedListener`.
    * Deprecates `AnnotationManager.OnAnnotationUpdatedListener`, use `AnnotationProvider.OnAnnotationUpdatedListener` instead. You can register annotation updated listener via `PdfFragment#addOnAnnotationUpdatedListener` and remove it via `PdfFragment#removeOnAnnotationUpdatedListener`.
* API: Adds `DocumentListener#onPageUpdated` that is called when contents of a page have changed. (#12544)
* Adds a new icon set for all toolbar items, as well as replacing the note icons with vector versions. (#12257)
* Adds `consumerProguardFiles`, which specifies all needed rules for ProGuard to work with. This means that all ProGuard rules introduced with PSPDFKit setup can be removed now. (#10402)
* Adds ink eraser tool. (#9612)
    * Adds eraser button to the annotation creation toolbar (id: `pspdf__annotation_creation_toolbar_item_eraser`).
    * API: Adds `AnnotationTool#ERASER`, eraser is enabled only when ink annotations are editable and eraser tool is in the list of enabled annotation tools.
    * API: Adds `EraserDefaultsProvider` for controlling eraser thickness.
* API: Adds support for digital signatures. (#11225)
    * API: Adds `SignatureManager` to manage trusted CA certificates and registered signers.
    * API: Adds `SignatureFormElement` and `SignatureFormField` to represent signature forms in the PDF document.
    * API: Adds `DigitalSignatureInfo` and `DocumentSignatureInfo` to access all signing related information on a document.
    * API: Adds `DigitalSignatureValidator` to provide validation for `DigitalSignatureInfo`. The validation result is returned as `DigitalSignatureValidationResult`.
    * API: Adds `SignatureInfoDialog` for showing the result of a signature verification.
    * API: Adds `getDocumentSignatureInfo()` call to `PdfDocument` to easily check for signature information and validity in a PDF document.
    * API: Adds abstract `Signer` class that is used to digitally sign a `SignatureFormField`.
    * API: Adds `MemorySigner` for signing documents using a pre-loaded `PrivateKeyEntry`.
    * API: Adds `Pkcs12Signer` for signing documents using a PKCS#12 file.
    * API: Adds `SigningFailedException` for signalizing a failure during signing.
    * API: Adds `SigningStatus` to express the result of a signing operation during a failure.
    * API: Adds `SignatureSignerDialog` for signing a single signature form field using a `Signer`.
    * API: Adds `DocumentSigningListener` to listen to signing events on the `SignatureSignerDialog`.
    * API: Adds `PdfFragment#setDocumentSigningListener()` to override the default signing listener used by the fragment.
    * API: Adds `Signature#getSignerIdentifier()` to return the unique identifier of an associated `Signer`.
    * API: Adds `Signature#toInkAnnotation(com.pspdfkit.document.PdfDocument, int, android.graphics.RectF)` for creating an `InkAnnotation` whose bounding box fixes the given `RectF`.
    * API: Moves `Signature` class from `com.pspdfkit.annotations.signatures` to `com.pspdfkit.signatures`.
    * API: Moves `SignaturePickerFragment` class from `com.pspdfkit.annotations.signatures` to `com.pspdfkit.signatures`.
    * The `SignaturePickerFragment` provides a new, cleaner UI flow, allowing users to pick signatures from a list, and store them to a database.
* API: Adds `DocumentListener#onDocumentSaveCancelled` that is being called when document saving is skipped. (#11950)
* API: Adds API and UI for creating link annotations from selected text. (#11296, #12092)
    * API: Adds 'Create link' button to the text selection toolbar (id: `pspdf__text_selection_toolbar_item_link`) for creating links on top of the selected text (fires up a dialog).
    * API: Adds `TextSelectionController#createLinkAboveSelectedText()` method for creating links above selected text (fires up a dialog).
    * API: Adds `LinkAnnotation` constructor method for creating link annotations.
    * API: Adds `UriAction` constructor for creating URI actions with specified URL string.
    * API: Adds `GoToAction` constructor for creating GoTo actions with specified target page index.
    * API: Adds `setAction()` method on `LinkAnnotation` class for setting an `Action` to be triggered when link annotation is clicked.
    * API: Adds `LinkAnnotationHighlighter` which highlightes newly created link annotations.
* API: Adds API for controlling defaults for annotation tools. This extends existing annotation defaults API. (#12100)
    * API: Adds API to set annotation defaults provider for `AnnotationTool` in `AnnotationDefaultsManager`. Setting annotation defaults provider for `AnnotationTool` overrides defaults defined for underlying `AnnotationType` when creating annotations.
    * API: Replaces `AnnotationType` with `AnnotationTool` in `AnnotationPreferencesManager` methods.
* API: Adds `USER_INTERFACE_VIEW_MODE_MANUAL` providing total control over user interface visibility. (#11791)
* API: Unifies and improves naming for listeners. (#9447)
    * API: Renames `DownloadDocumentTask.DownloadedFileCallback` to `DownloadDocumentTask.OnFileDownloadedListener`.
    * API: Renames `ExtractAssetTask.OnDocumentExtractedCallback` to `ExtractAssetTask.OnDocumentExtractedListener`.
    * API: Renames `InstantPdfDocument#registerInstantDocumentListener` to `InstantPdfDocument#addInstantDocumentListener`.
    * API: Renames `InstantPdfDocument#unregisterInstantDocumentListener` to `InstantPdfDocument#removeInstantDocumentListener`.
    * API: Renames `InstantPdfFragment#registerInstantDocumentListener` to `InstantPdfFragment#addInstantDocumentListener`.
    * API: Renames `InstantPdfFragment#unregisterInstantDocumentListener` to `InstantPdfFragment#removeInstantDocumentListener`.
    * API: Renames `OnAnnotationProviderUpdatedListener#onAnnotationDeleted` to `OnAnnotationProviderUpdatedListener#onAnnotationRemoved`.
    * API: Renames `AnnotationProvider.OnAnnotationProviderUpdatedListener` to `AnnotationProvider.OnAnnotationUpdatedListener`.
    * API: Renames `AnnotationProvider#registerOnAnnotationProviderUpdatedListener` to `AnnotationProvider#addOnAnnotationUpdatedListener`.
    * API: Renames `AnnotationProvider#unregisterOnAnnotationProviderUpdatedListener` to `AnnotationProvider#removeOnAnnotationUpdatedListener`.
    * API: Renames `ActionResolver#registerDocumentActionListener` to `ActionResolver#addDocumentActionListener`.
    * API: Renames `ActionResolver#unregisterDocumentActionListener` to `ActionResolver#removeDocumentActionListener`.
    * API: Renames `NewPageFactory.OnNewPageReadyCallback` to `NewPageFactory.OnNewPageReadyListener`.
    * API: Renames `PdfLibrary#registerLibraryIndexingListener` to `PdfLibrary#addLibraryIndexingListener`.
    * API: Renames `PdfLibrary#unregisterLibraryIndexingListener` to `PdfLibrary#removeLibraryIndexingListener`.
    * API: Renames `FormProvider#registerOnFormFieldUpdatedListener` to `FormProvider#addOnFormFieldUpdatedListener`.
    * API: Renames `FormProvider#unregisterOnFormFieldUpdatedListener` to `FormProvider#removeOnFormFieldUpdatedListener`.
    * API: Renames `FormProvider#registerOnFormTabOrderUpdatedListener` to `FormProvider#addOnFormTabOrderUpdatedListener`.
    * API: Renames `FormProvider#unregisterOnFormTabOrderUpdatedListener` to `FormProvider#removeOnFormTabOrderUpdatedListener`.
    * API: Renames `FormProvider#registerOnTextFormFieldUpdatedListener` to `FormProvider#addOnTextFormFieldUpdatedListener`.
    * API: Renames `FormProvider#unregisterOnTextFormFieldUpdatedListener` to `FormProvider#removeOnTextFormFieldUpdatedListener`.
    * API: Renames `FormProvider#registerOnButtonFormFieldUpdatedListener` to `FormProvider#addOnButtonFormFieldUpdatedListener`.
    * API: Renames `FormProvider#unregisterOnButtonFormFieldUpdatedListener` to `FormProvider#removeOnButtonFormFieldUpdatedListener`.
    * API: Renames `FormProvider#registerOnChoiceFormFieldUpdatedListener` to `FormProvider#addOnChoiceFormFieldUpdatedListener`.
    * API: Renames `FormProvider#unregisterOnChoiceFormFieldUpdatedListener` to `FormProvider#removeOnChoiceFormFieldUpdatedListener`.
    * API: Renames `DefaultDocumentEditorListener.UriValidationCallback` to `DefaultDocumentEditorListener.UriValidationListener`.
    * API: Renames `PdfDocumentEditorListenerCallback` to `OnFileWriteCompleteListener`.
    * API: Renames `PSPDFKitViews#setDocumentEditorListener` to `PSPDFKitViews#setPdfDocumentEditorListener`.
    * API: Renames `PdfFragment#registerDocumentListener` to `PdfFragment#addDocumentListener`.
    * API: Renames `PdfFragment#unregisterDocumentListener` to `PdfFragment#removeDocumentListener`.
    * API: Renames `PdfFragment#registerDocumentScrollListener` to `PdfFragment#addDocumentScrollListener`.
    * API: Renames `PdfFragment#unregisterDocumentScrollListener` to `PdfFragment#removeDocumentScrollListener`.
    * API: Renames `PdfOutlineView.OnAnnotationTappedListener` to `PdfOutlineView.OnAnnotationTapListener` and its `onAnnotationTapped` method to `onAnnotationTap`.
    * API: Renames `PdfOutlineView.OnOutlineElementTappedListener` to `PdfOutlineView.OnOutlineElementTapListener` and its `onOutlineElementTapped` method to `onOutlineElementTap`.
    * API: Renames `PdfOutlineView#setOnAnnotationTappedListener` to `PdfOutlineView#setOnAnnotationTapListener`.
    * API: Renames `PdfOutlineView#setOnOutlineElementTappedListener` to `PdfOutlineView#setOnOutlineElementTapListener`.
    * API: Renames `PdfThumbnailGrid#setDocumentEditorListener` to `PdfThumbnailGrid#setPdfDocumentEditorListener`.
    * API: Renames `PdfThumbnailGrid#registerDocumentEditingModeChangeListener` to `PdfThumbnailGrid#addOnDocumentEditingModeChangeListener`.
    * API: Renames `PdfThumbnailGrid#unregisterDocumentEditingModeChangeListener` to `PdfThumbnailGrid#removeOnDocumentEditingModeChangeListener`.
    * API: Renames `PdfThumbnailGrid#registerDocumentEditingPageSelectionChangeListener` to `PdfThumbnailGrid#addOnDocumentEditingPageSelectionChangeListener`.
    * API: Renames `PdfThumbnailGrid#unregisterDocumentEditingPageSelectionChangeListener` to `PdfThumbnailGrid#removeOnDocumentEditingPageSelectionChangeListener`.
    * API: Renames `ActionMenu#registerActionMenuListener` to `ActionMenu#addActionMenuListener`.
    * API: Renames `ActionMenu#unregisterActionMenuListener` to `ActionMenu#removeActionMenuListener`.
    * API: Renames `FormEditingBar#registerFormEditingBarLifecycleListener` to `FormEditingBar#addOnFormEditingBarLifecycleListener`.
    * API: Renames `FormEditingBar#unregisterFormEditingBarLifecycleListener` to `FormEditingBar#removeOnFormEditingBarLifecycleListener`.
    * API: Renames `PropertyInspectorCoordinatorLayoutController#registerPropertyInspectorLifecycleListener` to `PropertyInspectorCoordinatorLayoutController#addPropertyInspectorLifecycleListener`.
    * API: Renames `PropertyInspectorCoordinatorLayoutController#unregisterPropertyInspectorLifecycleListener` to `PropertyInspectorCoordinatorLayoutController#removePropertyInspectorLifecycleListener`.
    * API: Renames `BookmarkViewAdapter#registerBookmarkChangeListener` to `BookmarkViewAdapter#addBookmarkListener`.
    * API: Renames `BookmarkViewAdapter#unregisterBookmarkChangeLister` to `BookmarkViewAdapter#removeBookmarkListener`.
    * API: Renames `OnModeChangedListener#OnPageTransitionChanged` to `OnModeChangedListener#OnScrollModeChange`.
    * API: Renames `OnModeChangedListener#OnScrollDirectionChanged` to `OnModeChangedListener#OnScrollDirectionChange`.
    * API: Renames `OnModeChangedListener#OnPageLayoutChanged` to `OnModeChangedListener#OnPageLayoutChange`.
    * API: Renames `OnModeChangedListener#OnThemeChanged` to `OnModeChangedListener#OnThemeChange`.
    * API: Renames `OnModeChangedListener#OnScreenTimeoutChanged` to `OnModeChangedListener#OnScreenTimeoutChange`.
    * API: Renames `AnnotationManager#registerAnnotationSelectedListener` to `AnnotationManager#addOnAnnotationSelectedListener`.
    * API: Renames `AnnotationManager#unregisterAnnotationSelectedListener` to `AnnotationManager#removeOnAnnotationSelectedListener`.
    * API: Renames `AnnotationManager#registerAnnotationDeselectedListener` to `AnnotationManager#addOnAnnotationDeselectedListener`.
    * API: Renames `AnnotationManager#unregisterAnnotationDeselectedListener` to `AnnotationManager#removeOnAnnotationDeselectedListener`.
    * API: Renames `AnnotationManager#registerAnnotationUpdatedListener` to `AnnotationManager#addOnAnnotationUpdatedListener`.
    * API: Renames `AnnotationManager#unregisterAnnotationUpdatedListener` to `AnnotationManager#removeOnAnnotationUpdatedListener`.
    * API: Renames `AnnotationManager#registerAnnotationCreationModeChangeListener` to `AnnotationManager#addOnAnnotationCreationModeChangeListener`.
    * API: Renames `AnnotationManager#unregisterAnnotationCreationModeChangeListener` to `AnnotationManager#removeOnAnnotationCreationModeChangeListener`.
    * API: Renames `AnnotationManager#registerAnnotationCreationModeSettingsChangeListener` to `AnnotationManager#addOnAnnotationCreationModeSettingsChangeListener`.
    * API: Renames `AnnotationManager#unregisterAnnotationCreationModeSettingsChangeListener` to `AnnotationManager#removeOnAnnotationCreationModeSettingsChangeListener`.
    * API: Renames `AnnotationManager#registerAnnotationEditingModeChangeListener` to `AnnotationManager#addOnAnnotationEditingModeChangeListener`.
    * API: Renames `AnnotationManager#unregisterAnnotationEditingModeChangeListener` to `AnnotationManager#removeOnAnnotationEditingModeChangeListener`.
    * API: Renames `DocumentEditingManager#registerDocumentEditingModeChangeListener` to `DocumentEditingManager#addOnDocumentEditingModeChangeListener`.
    * API: Renames `DocumentEditingManager#unregisterDocumentEditingModeChangeListener` to `DocumentEditingManager#removeOnDocumentEditingModeChangeListener`.
    * API: Renames `DocumentEditingManager#registerDocumentEditingPageSelectionChangeListener` to `DocumentEditingManager#addOnDocumentEditingPageSelectionChangeListener`.
    * API: Renames `DocumentEditingManager#unregisterDocumentEditingPageSelectionChangeListener` to `DocumentEditingManager#removeOnDocumentEditingPageSelectionChangeListener`.
    * API: Renames `FormManager#registerFormElementSelectedListener` to `FormManager#addOnFormElementSelectedListener`.
    * API: Renames `FormManager#unregisterFormElementSelectedListener` to `FormManager#removeOnFormElementSelectedListener`.
    * API: Renames `FormManager#registerFormElementDeselectedListener` to `FormManager#addOnFormElementDeselectedListener`.
    * API: Renames `FormManager#unregisterFormElementDeselectedListener` to `FormManager#removeOnFormElementDeselectedListener`.
    * API: Renames `FormManager#registerFormElementUpdatedListener` to `FormManager#addOnFormElementUpdatedListener`.
    * API: Renames `FormManager#unregisterFormElementUpdatedListener` to `FormManager#removeOnFormElementUpdatedListener`.
    * API: Renames `FormManager#registerFormElementEditingModeChangeListener` to `FormManager#addOnFormElementEditingModeChangeListener`.
    * API: Renames `FormManager#unregisterFormElementEditingModeChangeListener` to `FormManager#removeOnFormElementEditingModeChangeListener`.
    * API: Renames `FormManager#registerFormElementClickedListener` to `FormManager#addOnFormElementClickedListener`.
    * API: Renames `FormManager#unregisterFormElementClickedListener` to `FormManager#removeOnFormElementClickedListener`.
    * API: Renames `TextSelectionManager#registerTextSelectionModeChangeListener` to `TextSelectionManager#addOnTextSelectionModeChangeListener`.
    * API: Renames `TextSelectionManager#unregisterTextSelectionModeChangeListener` to `TextSelectionManager#removeOnTextSelectionModeChangeListener`.
    * API: Renames `TextSelectionManager#registerTextSelectionChangeListener` to `TextSelectionManager#addOnTextSelectionChangeListener`.
    * API: Renames `TextSelectionManager#unregisterTextSelectionChangeListener` to `TextSelectionManager#removeOnTextSelectionChangeListener`.
    * API: Changes `ContextualToolbar#setToolbarCoordinatorController` to accept `@Nullable ToolbarCoordinatorLayoutController`, so you can clear it by passing `null`.
    * API: Removes `ContextualToolbar#removeToolbarCoordinatorController`, use `ContextualToolbar#setToolbarCoordinatorController(null)` instead.
    * API: Changes `ContextualToolbar#setOnMenuItemClickListener` to accept `@Nullable OnMenuItemClickListener`, so you can clear it by passing `null`.
    * API: Removes `ContextualToolbar#removeOnMenuItemClickListener`, use `ContextualToolbar#setOnMenuItemClickListener(null)` instead.
    * API: Changes `ContextualToolbar#setOnMenuItemLongClickListener` to accept `@Nullable OnMenuItemLongClickListener`, so you can clear it by passing `null`.
    * API: Removes `ContextualToolbar#removeOnMenuItemClickListener`, use `ContextualToolbar#setOnMenuItemLongClickListener(null)` instead.
* Increases touch target size of next and previous search result buttons. (#11454)
* Improves `OutlineListView` loading time when opening large documents providing fast and smooth UI and removing from the main thread any heavy computation. (#11839)
* Improves performance of `PdfDocument` methods `getPageSize()`, `getPageRotation()`, and `getPageLabel()`. (#12186)
* Improves shape annotations selection performance. (#12032)
    * Fixes a possible OOM exception that was occurring on some devices when using large zoom scale while having shape annotation selected.
    * Updates to selected ink annotations are now redrawn much faster.
* Improves exact phrase matching in `PdfLibrary`. (#12261)
* Improves `FloatingHintEditText.EditTextListener#onErrorDismissed` flow, so it is not called on each text change event.
* Better memory handling for big documents. (#12045)
* API: Replaces framework's `Optional` with RxJava2 `Maybe`. (#10691)
    * API: Return type changes for `AnnotationProvider#getAnnotationAsync(int, int)` from `Observable<Optional<Annotation>>` to `Maybe<Annotation>`.
    * API: Return type changes for `AnnotationProvider#getAnnotation(int, int)` from `Optional<Annotation>` to `@Nullable Annotation`.
    * API: Return type changes for `FormProvider#getFormElementForAnnotationAsync()` from `Observable<Optional<FormElement>>` to `Maybe<FormElement>`.
    * API: Return type changes for `FormProvider#getFormElementForAnnotation()` from `Optional<FormElement>` to `@Nullable FormElement`.
    * API: Return type changes for `FormProvider#getFormFieldWithFullyQualifiedNameAsync()` from `Observable<Optional<FormElement>>` to `Maybe<FormElement>`.
    * API: Return type changes for `FormProvider#getFormFieldWithFullyQualifiedName()` from `Optional<FormElement>` to `@Nullable FormElement`.
    * API: Return type changes for `FormProvider#getFormElementWithNameAsync()` from `Observable<Optional<FormElement>>` to `Maybe<FormElement>`.
    * API: Return type changes for `FormProvider#getFormElementWithName()` from `Optional<FormElement>` to `@Nullable FormElement`.
    * API: Return type changes for `WidgetAnnotation#getFormElementAsync()` from `Observable<Optional<FormElement>>` to `Maybe<FormElement>`.
    * API: Return type changes for `WidgetAnnotation#getFormElement()` from `Optional<FormElement>` to `@Nullable FormElement`.
* API: Renames `Annotation.OBJECT_NUMBER_NOT_ATTACHED_TO_PAGE` to `Anntoation.OBJECT_NUMBER_NOT_SET`. (#11339)
* API: Renames HUD terminology to User Interface. (#12003)
    * API: Renames `HudViewMode` enum to `UserInterfaceViewMode` and all its values are starting with `USER_INTERFACE` now.
    * API: Renames `getHudViewMode()` to `getUserInterfaceViewMode()` on `PdfActivityConfiguration`, `PdfActivity` and `PdfActivityApi`. Its new return type is now `UserInterfaceViewMode`.
    * API: Renames `setHudViewMode(HudViewMode)` to `setUserInterfaceViewMode(UserInterfaceViewMode)` on `PdfActivityConfiguration`, `PdfActivity` and `PdfActivityApi`.
    * API: Renames `HudViewMode` to `UserInterfaceViewMode` on `PdfActivityConfiguration.Builder`.
* API: Changes type of thickness property of `AnnotationCreationController` from `int` to `float`. (#12291)
* API: Drops deprecated fields and methods. (#11896)
    * API: Removes `PdfActivityConfiguration.Builder#diskCacheSize()`, `PdfConfiguration.Builder#diskCacheSize()` - disk cache is not supported.
    * API: Removes `PdfDocument#getUri()` and `PdfDocument#getUriList()`.
    * API: Removes `PdfYouTubeActivity#ARG_YOUTUBE_URL`, use `#ARG_MEDIA_URI` for passing `MediaUri` objects through intent.
    * API: Removes `PdfMediaDialog#ARG_URI`, use `#ARG_MEDIA_URI` for passing `MediaUri` objects through intent.
    * API: Removes `PrintOptions(PdfProcessorTask.AnnotationProcessingMode, ..)` constructors, use `PrintOptions(boolean, ..)` instead.
    * API: Removed `PdfFragment#enterAnnotationCreationMode(AnnotationType)`, use `enterAnnotationCreationMode(AnnotationTool)` instead.
    * API: Removed `PdfFragment#clearTextSelection()`, use `exitCurrentlyActiveMode()` instead.
    * API: Removed `PdfFragment#setTextSelection()`, use `enterTextSelectionMode()` instead.
    * API: Removed `DocumentSharingManager#generateDocumentName()`, use `getTitle()` instead.
* Fixes a layout issue when entering long passwords. (#11792)
* Fixes not scrolling to entire page when going through search results using a continuous layout manager. (#11454)
* Fixes an issue when rendering decomposed UTF-8 strings (#11985)
* Fixes the navigation buttons not being restored after an orientation change. (#12211)
* Fixes form fields being rendered when the license doesn't have PDF forms enabled. (#12537)
* Fixes a crash that could happen when moving files to the device's download folder on Android 8.0 Oreo or newer. (#12549)
* Fixes resizing ink annotations in Instant documents being slow. (#12422)
* Fixes `PdfPasswordView` being broken, while entering text on devices with a small screen. (#12210)
* Fixes an issue where adding annotation after opening annotation list view is blocked in large documents. (#12010)
* Fixes an issue where invalid value (-1) was being passed to setPage() in PdfFragment on document recreation. (#11888)
* Fixes extra space after non-latin characters in form fields. (#11874)
* Fixes an issue where document loading progress was not restored after rotation. (#11840)
* Fixes an issue saving an original document after signing it. (#11911)
* Fixes an issue where document saving blocked the main thread. (#11802)
* Fixes an issue where horizontal resize guide was drawn incorrectly. (#12065)
* Fixes an issue where `NewPageDialog` was not displaying correctly in RTL mode. (#10039)
* Fixes an issue where navigation buttons were still clickable after `PdfActivityConfiguration.hideNavigationButtons()`. (#12023)
* Fixes an issue where current page is not properly restored after configuration changes, in double page mode. (#12146)
* Fixes an issue where flattening a document may generate warnings when it is open in third party readers. (#12066)
* Fixes an issue where it wasn't possible to unset excluded annotations from renderer. (#12418)
* Fixes an issue where taps on small form elements (such as checkboxes) were inaccurate. (#12545)
* Improves highlight annotations by adding additional padding to them. (#12548)
    * API: Adds `applyPadding` parameter to `PDFDocument#getPageTextRects()` to make the return value better suited for being displayed.
* Fixes an issue where adding image annotations to page failed randomly. (#12603)

#### Instant

* Adds more granular control over automatic document syncing. (#12292)
    * Adds `setListenToServerChanges` to `InstantPdfDocument` to control whether to listen to server changes.
    * Adds `setDelayForSyncingLocalChanges` to `InstantPdfDocument` to control delay of automatic syncing of local changes or to disable automatic syncing of local changes altogether.
    * Deprecates `setAutomaticSyncEnabled` in `InstantPdfDocument`. Use `setListenToServerUpdates` and `setDelayForSyncingLocalChanges` instead.
    * Adds `setListenToServerChangesWhenVisible` to `InstantPdfFragment` to control whether to listen to server changes when fragment is visible. It's enabled by default.
* Adds `consumerProguardFiles`, which specifies all needed rules for ProGuard to work with. This means that all ProGuard rules introduced with PSPDFKit Instant setup can be removed now.
* Fixes an issue where an incorrect values could be persisted as PDF object IDs. (#11689)
* Fixes an issue where annotation updates caused by server changes were not notified via `OnAnnotationProviderUpdated`. (#12420)

### 3.3.3 - 01 Sep 2017

* Improves annotation selection border and annotation selection handle colors of the default dark theme to have a higher contrast. (#11830)
* Increases touch target size of next and previous search result buttons of the `PdfSearchViewInline`. (#11454)
* Fixes scrolling to pages in continuous scroll mode when navigating to search results. (#11454)
* Fixes an issue where PDFs could end up locked after saving. (#11731)
* Fixes an issue where document loading progress was not restored after rotation. (#11840)
* Fixes a crash that could happen when trying to save malformed PDF documents. (#11885)
* Fixes padding on framework toolbars so they comply with the material design guidelines. (#11695)
    * Increases size of the back button in contextual toolbars.

#### Instant

* Enables note annotations. (#11704)
* Fixes an issue where Instant examples would deadlock after loading the document. (#11891)

### 3.3.2 - 17 Aug 2017

* API: Adds `PdfFragment#getVisiblePdfRect(Rect rect, int pageIndex)` that sets given rect to the visible portion of the given page. (#11601)
* API: Adds listener to allow custom handling of long clicks. (#11662)
    * API: Adds `setOnDocumentLongPressListener(OnDocumentLongPressListener)` call to `PdfFragment` class.
* Improves form text rendering with non-latin characters. (#10996)
* Fixes an issue where extracted annotations were not rendered properly in grayscale and inverted color mode. (#9621)
* Fixes an issue where property inspector width was calculated incorrectly. (#11676)
* Fixes an issue where the use of transparent colors in property inspector was not prevented. (#11010)
* Fixes an issue in `Hud View Modes Example` of the example catalog app where navigation buttons were not properly hidden. (#11744)
* Fixes an issue where a password protected documents was not reopened with previously entered password after restoring `PdfFragment`. (#11774)
* Fixes an unhandled `NullPointerException` thrown while restoring navigation history in non-retained `PdfFragment`. (#11775)
* Fixes an issue where a password protected document could get corrupted when saved multiple times. (#11667)
* Fixes an issue where state was not restored correctly when using activities that handle orientation changes themselves. (#11734)
* Fixes an issue where PDF renderer used recycled bitmap. (#11640)
* Fixes an issue where clicking on link annotations did not provide any visual feedback. (#11794)

#### Instant

* Adds `onDocumentInvalidated` and `onDocumentCorrupted` to `InstantDocumentListener`. (#11449)
    * `onDocumentInvalidated` is called when the document has been invalidated due to being garbage collected or its data being removed.
    * `onDocumentCorrupted` is called when Instant has detected corruption in the locally stored document data.
* Adds logout button to Instant example. (#11405)
* Fixes an incorrect log message format. (#11634)
* Fixes deletion of multiple annotations at once. (#11651)
* Fixes a failed assertion due to an improper format string. (#11747)

### 3.3.1 - 26 Jul 2017

* Fixes an issue where the downloaded Instant document could not be opened while offline. (#11560)
* Fixes an unhandled `NullPointerException` thrown while displaying the contextual toolbar. (#11448)
* Fixes a possible crash due to initialization race condition. (#11516)
* Fixes a synchronization issue where thumbnail bar was not scrolling correctly to a selected page. (#10458)
* Fixes a possible crash where framework was required before its initialization completed by the content provider. (#11537)
* Fixes a bug where a link pointing to local data was recognized as media although it's not a media file. (#11530)
* Fixes an issue where download job continued even after download progress dialog was dismissed. (#10237)

#### Instant

* Optimizes battery usage while syncing annotations with Instant. (#11533)
* Fixes incorrect handling/reporting of an authentication error during sync. (#11386)

### 3.3.0 - 20 Jul 2017

* Adds Instant: an easy-to-integrate solution to connect your app to your PSPDFKit Server to download documents and synchronize annotations between users. Everything’s synced in an instant!
* API: Adds support for writing and parsing XFDF files, see `XfdfFormatter` class with `parseXfdf[Async]()` and `writeXfdf[Async]()` methods. (#5575)
* API: Adds `ProgressDataProvider` which can optionally be implemented by any `DataProvider` to support displaying the loading progress of not yet available documents. (#11032)
* API: `DownloadProgressFragment` is now extensible. Check out the `CustomDocumentDownloadExample` in the example catalog app for an example implementation. (#11214)
* API: Adds `PdfProcessorTask.changeFormsOfType` to configure how form elements should be processed. (#11096)
* API: Adds `TextMarkupAnnotation#getHighlightedText()` to easily retrieve highlighted text for a markup annotation. (#11288)
* Adds support for annotation notes. (#9611)
* Adds `OnAnnotationProviderUpdatedListener` for listening to annotation creation, update and deletion events on `AnnotationProvider`. (#11149)
* Improves RTL language support. (#11013, #9883)
* Improves memory management when rendering forms. (#11176)
* Video playback is now enabled by default if device is deemed secure, meaning it's running at least Android Marshmallow (API 23+) with security patch dating Feb 1st, 2016 or newer. (#11345)
* Fixes very rare issue on saving files repeatedly. (#9477)
* Fixes the crash that occurs when trying to display document navigation while the document is not ready. (#11129)
* Fixes the crash that occurs when trying to zoom an inline video being played in the document. (#11357)
* Fixes an issue where custom styles were not applied correctly. (#11139)
* Fixes the crash occurring when navigation buttons are not present in the custom layout despite being disabled by the configuration. (#11273)
* Fixes the annotation creation toolbar being dismissed on configuration change. (#10990)
* Fixes minor accessibility issues where close button description was missing and color contrast when editing notes was unfriendly. (#11292)
* Fixes minor accessibility issues where close button description was missing and color contrast was too low when editing notes. (#11292)
* Fixes an issue where note icons selection was not properly updated. (#11450)

### 3.2.1 - 21 Jun 2017

* **Updates dependency** - RxJava was updated to `2.1.1`.
* Fixes missing dependency issue when adding SDK to application. (#11031)
* Fixes a possible crash due to initialization race condition. (#10745)

### 3.2.0 - 15 Jun 2017

* API: Adds `PdfConfiguration.Builder#setAutomaticLinkGenerationEnabled` and `PdfDocument#setAutomaticLinkGenerationEnabled` to enable automatic detection of web links in the document. (#9865)
* API: Adds `PdfDocument#setWatermarkTextFilteringEnabled` to exclude watermark text from selection and text extraction methods. (#10832)
* API: Adds `PdfConfiguration.Builder#automaticallyGenerateLinks` to enable automatic detection of web links in the document.
* API: Adds `ImagePicker#wasStarted` which returns a boolean whether an image picker request was already started and is running or not. (#10756)
* API: `ImagePicker` class is now `final`. (#10947)
* Adds settings menu item for page transition, page layout, scroll direction and screen timeout: (#10345)
    * Adds `PdfActivityConfiguration.Builder#[show/hide]SettingsMenu` to show and hide setting menu icon.
    * Adds `PdfActivityConfiguration.Builder#setSettingsMenuItems(EnumSet<SettingsMenuItemType>)` to select which items to show.
    * Adds `PdfActivityConfiguration#getDarkTheme` to retrieve theme resource used to override dark theme of the launched activity.
    * Adds `PdfActivityConfiguration#isSettingsItemEnabled` to check whether the settings menu is shown or not.
    * Adds `PdfActivityConfiguration#getSettingsMenuItemShown` to check which items are shown in the settings menu.
    * Adds `PdfActivityConfiguration#Builder(PdfActivityConfiguration, int themeRes, int themeDarkRes)` to create a new builder from existing configuration with new default and new dark theme.
    * Adds `PdfActivityConfiguration.Builder#themeDark(int)` to set a new dark theme used to override predefined dark activity theme.
    * Adds `PdfActivityConfiguration.Builder#themeMode(ThemeMode)` to set the used theme mode.
* Adds basic support for playing media annotations in documents: (#10769)
    * Adds `PdfConfiguration.Builder#playingMultipleMediaInstancesEnabled()` providing control over whether the multiple media files can be played at the same time.
    * Adds `RichMediaAnnotation` class representing RichMedia annotations.
    * Adds `ScreenAnnotation` class representing Screen annotations.
    * Link annotations pointing to local media files, now play embedded on the page as well.
* Allows navigation between search results while search is still in progress (in case of inline search). (#10561)
* Fixes an issue with saving files that did not conform completely to the PDF format. (#10712)
* Fixes a leak when rendering bitmaps. (#10777, #10847)
* Fixes an issue with saving link annotations. (#10355)
* Fixes a crash on Android versions lower than 5.0. (#10822)
* Fixes issue while saving PDF files. (#10849)
* Fixes issue that sometimes prevented edited documents from saving via `Save As...` option on document editor. (#10771)
* Fixes page tiles not being fully refreshed upon configuration change. (#10772)
* Fixes TTS text reading by removing pauses between text lines in the document. (#10889)
* Fixes a possible crash when retrieving active annotation editing tool before all views are properly instantiated. (#10939)

### 3.1.1 - 25 May 2017

* API: Adds `ImagePicker` class. (#9287)
    * API: Removes `ImagePickerFragment`, create `ImagePicker` instance and then use `#startImageCapture()` or `#startImageGallery()` to start picking/capturing image.
    * API: `ImagePickerFragment.OnImagePickedListener` is now `ImagePicker.OnImagePickedListener` class.
        * API: `onImagePickerError(int resultCode, @Nullable Intent data)` is now `onImagePickerUnknownError()`.
        * API: Adds `onCameraPermissionDeclined(boolean permanent)` for warning about missing camera permissions.
    * API: Empty `OnImagePickedListener` implementation called `OnImagePickedListenerAdapter` is now `SimpleOnImagePickerListener`.
    * See `DocumentProcessingExampleActivity` in catalog for new image picker API usage.
* Adds listener to allow custom handling of PDF actions. (#9964)
    * API: Adds `DocumentActionListener` class which allows custom handling of PDF actions in `onActionExecuted()` class.
    * API: Adds `registerDocumentActionListener()` and `unregisterDocumentActionListener()` calls to `PdfFragment` class.
    * API: Adds classes for new action types - `GoToRemoteAction`, `GoToEmbeddedAction`, `JavaScriptAction`, `LaunchAction` and `ImportDataAction`.
* Adds the ability to customize selected item colors in forms. (#10331).
    * Adds `pspdf__itemHighlightColor` theme attribute to `pspdf_FormSelection` style.
    * API: Adds `formItemHighlightColor()` call to `PageRenderConfiguration` constructor.
* Adds handling for new named actions - `OUTLINE`, `PRINT`, `FIND`, `SEARCH` and `SAVEAS`. (#10586)
* Removes deprecated `MemoryDataProvider` and `PdfActivityConfiguration#showThumbnailBar()/#hideThumbnailBar()` (use `setThumbnailBarMode()` instead).
* Changes default selection in sharing and printing dialog from `Single Page - current` to `All pages`. (#10563)
* Improves saving behavior around encrypted files. (#9088)
* Improves performance when reading page labels (#10575)
* Improves performance around reading PDF files. (#10565)
* Fixes annotations with the `NoView` and `Print` flags not being rendered. (#10549)
* Fixes a crash when parsing invalid metadata. (#10611)
* Fixes an issue where radio buttons were rendered incorrectly (#10631)
* Fixes issues in `PdfActivityConfiguration` and `PdfConfiguration`. (#10649)
    * Fixes infinite recursion inside `PdfActivityConfiguration.Builder#setCustomerSignatureFeatureEnabled()`.
    * Fixes `PdfConfiguration` copy constructor which was not copying property `isCustomerSignatureFeatureEnabled()`.
* Fixes an issue where `BaseFileProvider` would return paths to the internal app directory. (#10636)
* Fixes an issue where `FormProvider` leaked memory. (#10693)
* Fixes an issue where page position wasn't properly restored in some rare cases. (#10708, #10700)

### 3.1.0 - 11 May 2017

* API: Adds support for scrollable thumbnail bar. (#7376)
    * API: Adds `PdfActivityConfiguration.Builder#setThumbnailBarMode(ThumbnailBarMode)` for selecting thumbnail bar mode.
    * API: Deprecates `PdfActivityConfiguration.Builder#showThumbnailBar` and `PdfActivityConfiguration.Builder#hideThumbnailBar`. Use above method instead.
    * API: Deprecates `PdfActivityConfiguration.Builder#isThumbnailBarEnabled`. Use `PdfActivityConfiguration.Builder#getThumbnailBarMode()` to get the thumbnail bar mode set on the activity.
* API: Removes theme configuration classes. Themes should be applied through Android's XML theme support or by directly accessing UI elements. (#7092)
    * API: `PdfConfiguration.Builder()` constructors do not need the `Context` to be provided as a parameter anymore.
    * API: `PdfActivityConfiguration.Builder()` secondary constructors do not need the `Context` to be provided as a parameter anymore.
    * API: Adds `PdfActivity#getActivityMenuManager` that exposes `PdfActivityMenuManager` object, which you can use to control activity menu icons and colors programmatically (theme equivalent is using attributes declared in `pspdf__ActionBarIcons` and setting it through `pspdf__actionBarIconsStyle`):
        * API: Adds `PdfActivityMenuManager#[set/get]ToolbarIconsColor()`, also controlled by `pspdf__iconsColor`.
        * API: Adds `PdfActivityMenuManager#[set/get]ToolbarIconsColorActivated()`, also controlled by `pspdf__iconsColorActivated`.
        * API: Adds `PdfActivityMenuManager#[set/get]OutlineIcon()`, also controlled by `pspdf__outlineIcon`.
        * API: Adds `PdfActivityMenuManager#[set/get]OutlineIconActivated()`, also controlled by `pspdf__outlineIconActivated`.
        * API: Adds `PdfActivityMenuManager#[set/get]SearchIcon()`, also controlled by `pspdf__searchIcon`.
        * API: Adds `PdfActivityMenuManager#[set/get]SearchIconActivated()`, also controlled by `pspdf__searchIconActivated`.
        * API: Adds `PdfActivityMenuManager#[set/get]ThumbnailGridIcon()`, also controlled by `pspdf__gridIcon`.
        * API: Adds `PdfActivityMenuManager#[set/get]ThumbnailGridIconActivated()`, also controlled by `pspdf__gridIconActivated`.
        * API: Adds `PdfActivityMenuManager#[set/get]EditAnnotationsIcon()`, also controlled by `pspdf__editAnnotationsIcon`.
        * API: Adds `PdfActivityMenuManager#[set/get]EditAnnotationsIconActivated()`, also controlled by `pspdf__editAnnotationsIconActivated`.
        * API: Adds `PdfActivityMenuManager#[set/get]ShareIcon()`, also controlled by `pspdf__shareIcon`.
        * API: Adds `PdfActivityMenuManager#[set/get]PrintIcon()`, also controlled by `pspdf__printIcon`.
    * API: Removes `DocumentThemeConfiguration`, uses attributes from `pspdf__SearchResultHighlighter` attribute set (specified by theme attribute `pspdf__searchResultHighlighterStyle`) along with added methods:
        * API: Adds `SearchResultHighlighter#[set/get]SearchResultBackgroundColor()`, also controlled by `pspdf__searchResultBackgroundColor`.
        * API: Adds `SearchResultHighlighter#[set/get]SearchResultBorderColor()`, also controlled by `pspdf__searchResultBorderColor`.
        * API: Adds `SearchResultHighlighter#[set/get]SearchResultBorderWidth()`, also controlled by `pspdf__searchResultBorderWidth`.
        * API: Adds `SearchResultHighlighter#[set/get]SearchResultPadding()`, also controlled by `pspdf__searchResultPadding`.
        * API: Adds `SearchResultHighlighter#[set/get]SearchResultAnnotationPadding()`, also controlled by `pspdf__searchResultAnnotationPadding`.
        * API: Adds `SearchResultHighlighter#[set/get]SearchResultAnimationPadding()`, also controlled by `pspdf__searchResultAnimationPadding`.
        * API: Adds `SearchResultHighlighter#[set/get]SearchResultCornerRadiusToHeightRatio()`, also controlled by `pspdf__searchResultCornerRadiusToHeightRatio`.
        * API: Adds `SearchResultHighlighter#[set/get]SearchResultCornerRadiusMin()`, also controlled by `pspdf__searchResultCornerRadiusMin`.
        * API: Adds `SearchResultHighlighter#[set/get]SearchResultCornerRadiusMax()`, also controlled by `pspdf__searchResultCornerRadiusMax`.
    * API: Removes `ThumbnailBarThemeConfiguration`:
        * API: For default static thumbnail bar, uses attributes from `pspdf__ThumbnailBar` attribute set (specified by theme attribute `pspdf__thumbnailBarStyle`).
        * API: For scrollable thumbnail bar, uses attributes from `pspdf__ScrollableThumbnailBar` attribute set (specified by theme attribute `pspdf__scrollableThumbnailBarStyle`).
        * API: Adds `PdfThumbnailBar#[set/get]BackgroundColor()`.
        * API: Adds `PdfThumbnailBar#[set/get]ThumbnailWidth()`.
        * API: Adds `PdfThumbnailBar#[set/get]ThumbnailHeight()`.
        * API: Adds `PdfThumbnailBar#[set/get]ThumbnailBorderColor()`.
        * API: Adds `PdfThumbnailBar#[set/get]SelectedThumbnailBorderColor()`.
    * API: Adds `PdfFragment#[set/get]BackgroundColor()` for setting a background color on the fragment (extracted from `DocumentThemeConfiguration`), also configurable in the theme under the `pspdf__backgroundColor` attribute.
    * API: Adds `PdfFragment#setPasswordView(PdfPasswordView)` and `PdfFragment#getPasswordView()` methods for controlling `PdfPasswordView` set on the fragment.
    * API: Removes `PasswordViewThemeConfiguration`, uses attributes from `pspdf__PasswordView` attribute set (specified by theme attribute `pspdf__passwordViewStyle`) along with added methods:
        * API: Adds `PdfPasswordView#[set/get]Color()`, also controlled by `pspdf__color`.
        * API: Adds `PdfPasswordView#[set/get]HintColor()`, also controlled by `pspdf__hintColor`.
        * API: Adds `PdfPasswordView#[set/get]ErrorColor()`, also controlled by `pspdf__errorColor`.
        * API: Adds `PdfPasswordView#[set/get]FloatingHintColor()`, also controlled by `pspdf__floatingHintColor`.
        * API: Adds `PdfPasswordView#[set/get]IconResourceId()`, also controlled by `pspdf__icon`.
        * API: Adds `PdfPasswordView#[set/is]IconTintingEnabled()`, also controlled by `pspdf__iconTintingEnabled`.
    * API: Removes `InlineSearchThemeConfiguration`, uses attributes from `pspdf__SearchViewInline` attribute set (specified by theme attribute `pspdf__inlineSearchStyle`) along with added methods:
        * API: Adds `PdfSearchViewInline#[set/get]TextColor()`, also controlled by `pspdf__textColor`.
        * API: Adds `PdfSearchViewInline#[set/get]HintTextColor()`, also controlled by `pspdf__hintTextColor`.
        * API: Adds `PdfSearchViewInline#[set/get]NavigationTextColor()`, also controlled by `pspdf__navigationTextColor`.
        * API: Adds `PdfSearchViewInline#[set/get]PrevIconColorTint()`, also controlled by `pspdf__prevIconColorTint`.
        * API: Adds `PdfSearchViewInline#[set/get]NextIconColorTint()`, also controlled by `pspdf__nextIconColorTint`.
        * API: Adds `PdfSearchViewInline#[set/get]BackIconColorTint()`, also controlled by `pspdf__backIconColorTint`.
        * API: Adds `PdfSearchViewInline#[set/get]PrevIcon()`, also controlled by `pspdf__prevIconDrawable`.
        * API: Adds `PdfSearchViewInline#[set/get]NextIcon()`, also controlled by `pspdf__nextIconDrawable`.
    * API: Removes `ModularSearchThemeConfiguration`, uses attributes from `pspdf__SearchViewModular` attribute set (specified by theme attribute `pspdf__modularSearchStyle`) along with added methods:
        * API: Adds `PdfSearchViewModular#[set/get]BackgroundColor()`, also controlled by `pspdf__backgroundColor`.
        * API: Adds `PdfSearchViewModular#[set/get]InputFieldTextColor()`, also controlled by `pspdf__inputFieldTextColor`.
        * API: Adds `PdfSearchViewModular#[set/get]InputFieldHintColor()`, also controlled by `pspdf__inputFieldHintColor`.
        * API: Adds `PdfSearchViewModular#[set/get]SeparatorColor()`, also controlled by `pspdf__separatorColor`.
        * API: Adds `PdfSearchViewModular#[set/get]ListItemBackgroundColor()`, also controlled by `pspdf__listItemBackgroundColor`.
        * API: Adds `PdfSearchViewModular#[set/get]ListItemTitleColor()`, also controlled by `pspdf__listItemTitleColor`.
        * API: Adds `PdfSearchViewModular#[set/get]ListItemSubtitleColor()`, also controlled by `pspdf__listItemSubtitleColor`.
        * API: Adds `PdfSearchViewModular#[set/get]ListSelector()`, also controlled by `pspdf__listItemSelector`.
        * API: Adds `PdfSearchViewModular#[set/get]HighlightBackgroundColor()`, also controlled by `pspdf__highlightBackgroundColor`.
        * API: Adds `PdfSearchViewModular#[set/get]HighlightBorderColor()`, also controlled by `pspdf__highlightBorderColor`.
        * API: Adds `PdfSearchViewModular#[set/get]HighlightTextColor()`, also controlled by `pspdf__highlightTextColor`.
    * API: Removes `OutlineViewThemeConfiguration`, uses attributes from `pspdf__OutlineView` attribute set (specified by theme attribute `pspdf__outlineViewStyle`) along with added methods:
        * API: Adds `PdfOutlineView#[set/get]BackgroundColor()`, also controlled by `pspdf__backgroundColor`.
        * API: Adds `PdfOutlineView#[set/get]ListSelector()`, also controlled by `pspdf__listItemSelector`.
        * API: Adds `PdfOutlineView#[set/get]DefaultTextColor()`, also controlled by `pspdf__defaultTextColor`.
        * API: Adds `PdfOutlineView#[set/get]BookmarksBarBackgroundColor()`, also controlled by `pspdf__bookmarksBarBackgroundColor`.
        * API: Adds `PdfOutlineView#[set/get]BookmarksBarIconColor()`, also controlled by `pspdf__bookmarksBarIconColor`.
        * API: Adds `PdfOutlineView#[set/get]BookmarksAddIcon()`, also controlled by `pspdf__bookmarksAddIcon`.
        * API: Adds `PdfOutlineView#[set/get]BookmarksEditIcon()`, also controlled by `pspdf__bookmarksEditIcon`.
        * API: Adds `PdfOutlineView#[set/get]BookmarksDoneIcon()`, also controlled by `pspdf__bookmarksDoneIcon`.
        * API: Adds `PdfOutlineView#[set/get]GroupIndicatorIconColor()`, also controlled by `pspdf__bookmarksGroupIndicatorIconColor`.
        * API: Adds `PdfOutlineView#[set/get]TabIndicatorColor()`, also controlled by `pspdf__tabIndicatorColor`.
        * API: Adds `PdfOutlineView#[set/get]BookmarksDeleteIcon()`, also controlled by `pspdf__bookmarksDeleteIcon`.
        * API: Adds `PdfOutlineView#[set/get]BookmarksDeleteIconColor()`, also controlled by `pspdf__bookmarksDeleteIconColor`.
        * API: Adds `PdfOutlineView#[set/get]BookmarksDeleteBackgroundColor()`, also controlled by `pspdf__bookmarksDeleteBackgroundColor`.
    * API: Removes `ThumbnailGridThemeConfiguration`, uses attributes from `pspdf__ThumbnailGrid` attribute set (specified by theme attribute `pspdf__thumbnailGridStyle`) along with added methods:
        * API: Adds `PdfThumbnailGrid#[set/get]BackgroundColor()`, also controlled by `pspdf__backgroundColor`.
        * API: Adds `PdfThumbnailGrid#[set/get]ItemLabelTextStyle()`, also controlled by `pspdf__itemLabelTextStyle`.
        * API: Adds `PdfThumbnailGrid#[set/get]ItemLabelBackground()`, also controlled by `pspdf__itemLabelBackground`.
    * API: Adds setters and getters for UI properties on `FormEditingBar`, uses attributes from `pspdf__FormEditingBar` attribute set (specified by theme attribute `pspdf__formEditingBarStyle`) along with added methods:
        * API: Adds `FormEditingBar#[set/get]IconsColor`, also controlled by `pspdf__iconsColor`.
        * API: Adds `FormEditingBar#[set/get]BackgroundColor`, also controlled by `pspdf__backgroundColor`.
        * API: Adds `FormEditingBar#[set/get]TextColor`, also controlled by `pspdf__textColor`.
        * API: Adds `FormEditingBar#[set/get]PrevIcon`, also controlled by `pspdf__prevIconDrawable`.
        * API: Adds `FormEditingBar#[set/get]NextIcon`, also controlled by `pspdf__nextIconDrawable`.
    * API: Removes `FormEditingConfiguration`, use attributes from `pspdf__FormSelection` attribute set (specified by theme attribute `pspdf__formSelectionStyle`) to configure UI:
        * API: Adds `enableFormEditing()` and `disableFormEditing()` to the `PdfConfiguration` and `PdfActivityConfiguration` builders (pulled out of `FormEditingConfiguration`)
    * API: Removes `AnnotationEditingConfiguration`, use attributes from `pspdf__AnnotationSelection` attribute set (specified by theme attribute `pspdf__annotationSelectionStyle`) to configure UI. Other methods are extracted to `PdfConfiguration.Builder()` and `PdfActivityConfiguration.Builder()`:
        * API: Adds `Pdf[Activity]Configuration.Builder#disableAnnotationEditing()`.
        * API: Adds `Pdf[Activity]Configuration.Builder#enableAnnotationEditing()`.
        * API: Adds `Pdf[Activity]Configuration.Builder#editableAnnotationTypes()`.
        * API: Adds `Pdf[Activity]Configuration.Builder#enabledAnnotationTools()`.
        * API: Adds `Pdf[Activity]Configuration.Builder#setSelectedAnnotationResizeEnabled()`.
        * API: Adds `Pdf[Activity]Configuration.Builder#setSelectedAnnotationResizeGuidesEnabled()`.
        * API: Adds `Pdf[Activity]Configuration.Builder#setResizeGuideSnapAllowance()`.
        * API: Adds `Pdf[Activity]Configuration.Builder#setResizeGuideLineIntervals()`.
        * API: Adds `Pdf[Activity]Configuration.Builder#setAnnotationInspectorEnabled()`.
        * API: Adds `Pdf[Activity]Configuration.Builder#setSignatureSavingEnabled()`.
        * API: Adds `Pdf[Activity]Configuration.Builder#setCustomerSignatureFeatureEnabled()`.
    * API: Removes deprecated `defaultAnnotationCreator()` method from `AnnotationEditingConfiguration#Builder`, use `PSPDFKitPreferences#setAnnotationCreator(String)` to set annotation creator name.
    * API: Removes `AnnotationRenderConfiguration`, use attributes from `pspdf__Annotation` attribute set (specified by theme attribute `pspdf__annotationStyle`) to configure UI. Other methods are extracted to `PdfConfiguration.Builder()` and `PdfActivityConfiguration.Builder()`:
        * API: Adds `Pdf[Activity]Configuration.Builder#excludedAnnotationTypes()`.
* Adds annotation indexing capabilities to `PdfLibrary`. (#9235)
    * API: Adds `IndexingOptions` and `PdfLibrary#enqueueDocuments(documents, indexingOptions)` overloads which allow to disable annotation or document text indexing.
    * API: Adds `QueryOptions.Builder#ignoreAnnotations()` and `QueryOptions.Builder#ignoreDocumentText()`
    * API: Renames `QueryOptions` methods: `isMatchExactPhrases` to `shouldMatchExactPhrases`, `isMatchExactWords` to `shouldMatchExactWords`, and `generateTextPreviews` to `shouldGenerateTextPreviews`.
    * Updates `IndexedFullTextSearchExample` in the catalog app, to showcase new query options.
    * Adds `enqueueDocumentSources` and `enqueueDocumentSourcesWithMetadata` to `PdfLibrary` to allow indexing documents without opening them first. This fixes OOM issues when indexing large amount of PDF documents.
* Adds support for the `NeedAppearances` form flag. (#10288)
* Adds the ability to modify document PDF and XMP metadata. (#10494)
    * API: Adds `set()`, `get()`, `setInXmp()` and `getInXmp()` methods to `DocumentMetadata` class.
    * `DocumentMetadata` object isn't parcelable anymore.
    * `PdfProcessorTask#withMetadata()` now accepts `HashMap<String,String>` instead of `DocumentMetadata` class.
* Adds `AesDataProvider` and `AesEncryptedFileExample` to catalog app. (#10230)
* Deprecates `MemoryDataProvider`. (#10451)
* Improves reliability of reading from data providers. (#10382)
* Fixes missing `PdfActivity` documentation. (#10300)
* Fixes page not being properly settled on startup until the first touch. (#10155)
* Fixes wrong view state being restored in double page mode and single page document. (#10157)
* Fixes an issue where red border was rendered around required form fields even when form editing was disabled. (#10331)
* Fixes failed manifest verification if `DocumentSharingProvider` class was renamed. (#10174)
* Fixes a unhandled `NullPointerException` thrown while initializing documents forms. (#10418)
* Fixes a runtime failure occurring due to framework initialization process not being properly synced. (#10309)
* Fixes an issue where circle and square annotations grown in size when drawing while zoomed in. (#10347)
* Fixes an issue that could result in a very long running loop when rendering PDF documents with broken dashed lines. (#9764)

### 3.0.0 - 12 Apr 2017

* API: Update RxJava to `2.0.8` and RxAndroid to `2.0.1`. (#9254)
    * All public facing methods are now using the new RxJava 2 types `Observable`, `Flowable`, `Single`, `Completable`.
    * For a comprehensive overview of the changes in RxJava 2, please have a look at the [official RxJava 2 documentation](https://github.com/ReactiveX/RxJava/wiki/What's-different-in-2.0).
* API: Removes license from the configuration files, the framework is now implicitly initialized using `<meta-data>` tag in your `AndroidManifest.xml`. More information in the guides. (#9791)
    * API: Adds `PSPDFKit#setApplicationPolicy()` which is now a preferred way of changing application policy instead of re-initializing the whole framework.
    * API: Removes deprecated `PSPDFActivityConfiguration.Builder#activity()`. Target activity is now set through `PdfActivityIntentBuilder#activityClass()` with extras being added to the intent created with `PdfActivityIntentBuilder#build()`.
* API: Adds support for programmatic forms filling. (#9656)
    * API: Adds `FormsProvider` class for handling all forms related operations. It can be retrieved by calling `PSPDFDocument#getFormsProvider()`.
    * API: Adds `FormField` class representing the single field in an interactive form.
    * API: Adds `FormElement` class representing visible form control. Each `FormElement` has exactly one parent `FormField`. Each `FormField` can have multiple child `FormElement` (for example radio button group is a `FormField`, while each radio button in a group is a `FormElement`).
* API: Moves `PSPDFKit#openDocument`, `PSPDFKit#openDocuments` and `PSPDFKit#openDocumentAsync` calls to `PdfDocument` class. (#5330)
    * Drops several of more complex overloads in favor of passing document information with `DocumentSource` parameter.
* API: Moves and renames `PSPDFKit#invalidateDocumentCache` to `PdfDocument#invalidateCache` and `PSPDFKit#invalidatePageCache` to `PdfDocument#invalidateCacheForPage`. (#5330)
* API: `PSPDFActivity` renamed to `PdfActivity`. (#9680)
    * API: Replaces `PSPDFActivity.IntentBuilder()` with `PdfActivityIntentBuilder` that is used creating an intent for starting `PdfActivity` instance.
    * API: Removes `PSPDFActivity#showDocument()` for creating documents from multiple sources and just keeps the simpler ones, use `PdfActivityIntentBuilder` for full control over the document opening process.
    * API: Removes deprecated PSPDFActivity#onToggleActionbarVisibility().
    * API: `PSPDFActivity#setDocument()` methods have been renamed to specific ones depending on the parameters, so `setDocumentFromUri()`, `setDocumentFromUris()`, `setDocumentFromDataSource()`, `setDocumentFromDataSources()`.
    * API: Removes methods for explicitly removing single listeners from `PdfActivity`, use `setXYListener(null)`.
* API: Drops `PSPDF` prefix for several classes: (#6520)
    * `PSPDFActivity` to `PdfActivity`.
    * `PSPDFDocument` to `PdfDocument`, `PSPDFDocumentMetadata` to `DocumentMetadata`, `PDFVersion` to `PdfVersion`.
    * `PSPDFFragment` to `PdfFragment`.
    * `PSPDFPreferences` to `PSPDFKitPreferences.`
    * `PSPDFTextBlock` to `TextBlock`.
    * `PSPDFLibrary` to `PdfLibrary`.
    * `PSPDFAnnotationManager` to `AnnotationManager`.
    * `PSPDFProcessor` to `PdfProcessor`, `PSPDFProcessorTask` to `PdfProcessorTask`, `PSPDFProcesorException` to `PdfProcessorException`.
    * `PSPDFSearchOptions` to `SearchOptions`, `PSPDFSearchResult` to `SearchResult`, `PSPDFTextSearch` to `TextSearch`.
    * `PSPDFException` to `PSDPDFKitException`.
    * `PSPDFNotInitializedException` to `PSPDFKitNotInitializedException`, `PSPDFInitializationFailedException` to `InitializationFailedException`.
    * `PSPDFInvalidLayoutException` to `InvalidLayoutException`, `PSPDFInvalidLayoutException` to `InvalidLayoutException`, `PSPDFInvalidPasswordException` to `InvalidPasswordException`.
    * `PSPDFInvalidSignatureException` to `InvalidSignatureException`, `PSPDFMissingDependencyException` to `MissingDependencyException`.
    * `PSPDFYouTubeActivity` to `PdfYouTubeActivity`.
    * `PSPDFDrawableManager` to `PdfDrawableManager`, `PSPDFDrawableProvider` to `PdfDrawableProvider`, `PSPDFDrawable` to `PdfDrawable`.
    * `PSPDFOutlineView` to `PdfOutlineView`, `PSPDFThumbnailBar` to `PdfThumbnailBar`, `PSPDFThumbnailGrid` to `PdfThumbnailGrid`.
    * `PSPDFSearchView` to `PdfSearchView`.
    * `PSPDFViews` to `PSPDFKitViews` and `PdfActivity#getPSPDFViews()` to `PdfActivity#getPSPDFKitViews()`.
* API: `PSPDFActivityConfiguration` renamed to `PdfActivityConfiguration` (#10131)
* API: `PSPDFConfiguration` renamed to `PdfConfiguration` (#10131)
* API: Changes how colors are modeled on free text annotations to be consistent with how these properties are shown in the inspector.
    * Removes `FreeTextAnnotation#getTextColor()` and `FreeTextAnnotation#setTextColor()`.
    * Changes `FreeTextAnnotation#getColor()` and `FreeTextAnnotation#setColor()` to get and set the text color instead of the fill color.
    * Changes `FreeTextAnnotation#getFillColor()` and `FreeTextAnnotation#setFillColor()` to get and set the fill color instead of doing nothing.
* API: Removes deprecated method `PSPDFActivityConfiguration.Builder#printingEnabled()`, use `PdfActivityConfiguration#enablePrinting()` and `PdfActivityConfiguration#disablePrinting()` instead.
* API: Adds `StampAnnotation#setBitmap()` for re-setting an image on `StampAnnotation`. (#9803)
* API: Adds `setFormMappingNameMappings()` and `setFormFieldNameMappings()` call to `PSPDFProcessorTask` to allow renaming of form fields.
* API: Camel case syntax refactorings ():
    * API: `PDFUtils` to `PdfUtils` along with method `createPDFRectUnion()` to `createPdfRectUnion()`.
    * API: `PagePDF` to `PagePdf`.
    * API: `PDFBox` to `PdfBox`.
    * API: `URIAction` to `UriAction`.
    * API: `HUDViewMode` to `HudViewMode`.
    * API: `PSPDFDocumentEditor` to `PdfDocumentEditor`.
    * API: `PSPDFDocumentEditorListener` to `PdfDocumentEditorListener`.
    * API: `PSPDFDocumentEditorListenerCallbacks` to `PdfDocumentEditorListenerCallbacks`.
    * API: In `PdfFragment`:
        * API: `convertViewRectToPDFRect()` to `convertViewRectToPdfRect()`
        * API: `convertPDFRectToViewRect()` to `convertPdfRectToViewRect()`
        * API: `convertViewPointToPDFPoint()` to `convertViewPointToPdfPoint()`
        * API: `convertPDFPointToViewPoint()` to `convertPdfPointToViewPoint()`
        * API: `getVisiblePDFRect()` to `getVisiblePdfRect()`
* Adds support for interactive forms. (#2939)
    * API: Adds `PSPDFFragment#registerFormElementSelectedListener` for listening to form element selection.
    * API: Adds `PSPDFFragment#registerFormElementDeselectedListener` for listening to form element deselection.
    * API: Adds `PSPDFFragment#registerFormElementUpdatedListener` for listening to form element updates.
    * API: Adds `PSPDFFragment#setSelectedFormElement` for selecting form element and `PSPDFFragment#getSelectedFormElement` for getting selected form element.
    * API: Adds `FormEditingConfiguration` that can be used to control form editing configuration.
* Adds support for filling text form fields. (#8984)
* Adds support for filling list and combo box fields. (#8986)
* Adds support for keyboard shortcuts when editing forms. (#8987)
* Adds `FormEditingBar` that helps with form filling. (#9978)
* Adds support for changing configuration at runtime. (#2966)
    * Adds `setConfiguration` to `PdfActivity` to change `PdfActivityConfiguration` at runtime.
    * Allow creation of `PdfActivityConfiguration.Builder` and `PdfConfiguration.Builder` from existing configuration.
    * Adds `DynamicConfigurationExample` showcasing how to modify `PdfActivity` configuration at runtime.
    * Adds `CustomFragmentDynamicConfigurationExample` showcasing how to modify `PSPDFFragment` configuration at runtime when used with custom activity.
* Adds support for `HideAction` and `ResetFormAction`. (#9971)
* Adds `getState` and `setState` methods to `PdfFragment` for saving and restoring fragment state. (#9605)
* Adds a feature for saving internal UI Context when possible. (#7260)
* Improves stream handling in `DocumentDownloadExample`. (#10161)
* Improves `PdfLibrary` search when using FTS5. (#10018)
* Improves memory usage. (#10082)
* Improves stability in low memory situations. (#10086)
* Fixes symbol characters being used for rendering text in certain situations. (#9878)
* Fixes an issue where autocorrection didn't work for edited free text annotations. (#9887)
* Fixes an issue with error handling when enqueuing a print job was not successful. (#9913)
* Fixes full text search results returning incorrect results when an unmatched quote character is included in the search string. (#9831)
* Fixes an issue where view state could not be restored correctly in some cases when using continuous scrolling mode. (#9682)
* Fixes an issue where the page is not settled after the keyboard is dismissed or the screen size changes. (#9793)
* Fixes an issue where incorrect page is restored in double page mode. (#9683)
* Fixes memory leak when form field is selected. (#10124)

### 2.9.4 - 22 Mar 2017

* **Updates dependencies** - RxJava to `1.2.7` and support libraries to `25.3.0`.
* API: Introduces `PSPDFPreferences` to read and write global framework preferences. (#7300)
    * API: Deprecates `AnnotationEditingConfiguration.defaultAnnotationCreator`. Use `PSPDFPreferences.setAnnotationCreator` to configure the annotation creator name.
* API: Introduces `AnnotationPreferences` to access and change the annotation creator name. (#7300)
    * Adds `AnnotationEditingConfiguration.annotationCreator` to set the default creator name or override the stored one.
    * Deprecates `AnnotationEditingConfiguration.defaultAnnotationCreator`. Use above method instead.
* API: `DocumentListener#onDocumentSaveFailed(Throwable)` is now changed to `onDocumentSaveFailed(PSPDFDocument, Throwable)` providing the document for which the saving failed. (#9817)
* Adds helpers for changing screen timeout through `PSPDFActivity#setScreenTimeout(long)`. (#8527)
* Fixes an issue where failing to save the document would not clear the cache thus keeping the incorrect document cached.
* Fixes an issue where document pages had incorrect height when using vertical paginated scrolling. (#9671)
* Fixes an issue where click events on link annotation where not properly handled. (#9772)
* Fixes an issue where dragging an annotation using the long-press gesture would not work if another annotation was currently selected. (#9786)
* Fixes incorrect continuous mode scrolling to the rect that's on the different page than the current one. (#9664)
* Fixes an issue where document saving would fail when only permissions were protected by a document password. (#9623)
* Fixes an issue where thumbnail bar wasn't hidden when showing soft keyboard after the document has been edited. (#9806)
* Fixes an issue where `NewPageDialog` wasn't calling the `onDialogCancelled` listener when being dismissed via back button or touch event. (#9820)
* Fixes an issue where thumbnails in the thumbnail grid would be stuck, when quickly starting to scroll after the grid became visible. (#9821)
* Fixes an issue where clicking on the annotation would not invoke `DocumentListener#onPageClick()` listener. (#9815)
* Fixes an issue where document editing from unsupported sources was not consistent. (#7656)
* Fixes incorrect animations in outline list when expanding or collapsing an outline on Android API 17 and lower. (#9899)
* Fixes a issue on incrementally saving using a data provider. (#9410)

### 2.9.3 - 28 Feb 2017

* Adds keyboard navigation using left/right keys. (#9370)
* Changes the note annotation creation flow. (#9645)
    * It is now possible to create empty note annotation using the note annotation editor.
    * Newly created note annotations are now automatically selected.
* Fixes an issue where navigation bar got transparent when returning from multi-window mode. (#9530)
* Fixes an issue where toolbar layout could get broken because it was incorrectly allowed to be vertical on certain screen sizes. (#9488)
* Fixes an issue where document title view could get hidden behind action bar when switching to multi-window mode. (#9545)
* Fixes an issue where deselecting an annotation tapping on the document background was hiding the user interface. (#9550)
* Fixes incorrect animation in annotation inspector when showing soft keyboard. (#9527)
* Fixes possible `NullPointerException` in the catalog example. (#9561)
* Fixes an issue where setting double page mode in combination with continuous scroll doesn't properly fall back to single page layout mode in the thumbnail bar. (#9567)
* Fixes an issue where `PSPDFActivity` would hide the thumbnail bar on devices with high density screens. (#9597)
* Fixes double page mode scrolling being broken in some cases (inline search results navigation, state restoration, etc.) (#9626)
* Fixes an issue where using the soft keyboard in password view in immersive mode would result in wrongly rendered UI below translucent navigation bar. (#9658)

### 2.9.2 - 14 Feb 2017

* **Updates dependencies** - Support libraries to `25.1.1`, RxJava to `1.2.6`.
* Adds support for annotation flags in `Annotation` class and user interface. (#6939)
    * Adds support for `HIDDEN` flag. If set, do not display or print the annotation and prevent annotation editing.
    * Adds support for `PRINT` flag. Annotation is printed only when this flag is set.
    * Adds support for `NOVIEW` flag. If set, do not display the annotation and prevent annotation editing. However, printing is still allowed when `PRINT` flag is set.
    * Adds support for `READONLY` flag. If set, prevent annotation editing.
    * Adds support for `LOCKED` flag. If set, annotation can't be deleted, dragged or resized.
    * Adds support for `LOCKEDCONTENTS` flag. If set, annotation contents can't be changed.
* Adds an API to manipulate user interface visibility in `PSPDFActivity`. (#8348)
    * Adds `showUserInterface` to show user interface controls.
    * Adds `hideUserInterface` to hide user interface controls.
    * Adds `toggleUserInterface` to toggle user interface visibility.
    * Adds `setUserInterfaceVisible` to force show/hide user interface with or without animation.
    * Adds `isUserInterfaceVisible` to query user interface visibility.
    * Adds `PSPDFActivity.onUserInterfaceVisibilityChanged` to listen to user interface visibility changes.
    * Deprecates `Commands.ToggleSystemBars`. Use above methods instead.
    * Deprecates `PSPDFActivity.onToggleActionbarVisibility`.
* Adds `ToolbarCoordinatorLayout.OnContextualToolbarPositionListener ` that listens for toolbar position within the `ToolbarCoordinatorLayout`, set through `PSPDFActivity#setOnContextualToolbarPositionListener(listener)`. (#9212)
* Adds `ContextualToolbar#isDraggable` to query whether contextual toolbar is currently draggable. (#9212)
* Improves search highlighter and search navigation. (#8327)
* Hides HUD when creating annotations and annotation toolbar is in vertical position. (#9212)
    * Adds `hideHudWhenCreatingAnnotations` to `PSPDFActivityConfiguration` to control this behavior.
* Disables immersive mode when running in multi-window mode. (#9491)
* Fixes an issue where it wasn't possible to draw annotations under system bars. (#9220)
* Fixes an issue causing the thumbnail grid to crash certain devices when opened in landscape orientation. (#9433)
* Fixes a possible resource leak that caused warnings in strict mode during library initialization. (#9405)
* Fixes an issue where tapping while scrolling in paginated mode makes scrolling stuck between pages. (#7971)
* Fixes an issue where scrolling gets stuck after snapping back from zoom-out action. (#9380)
* Fixes an issue where wrong document insets were calculated when showing keyboard in multi-window mode. (#9487)
* Fixes an issue where `PSPDFThumbnailBar` would throw an exception when switching from double-page mode back to single-page mode. (#9490)
* Fixes a crash in `PSPDFThumbnailBar` when number of pages drops under 2. (#9352)
* Fixes an UI bug where drag button doesn't reappear on the toolbar once the keyboard is hidden and there's enough room for it to move. (#9322)

### 2.9.1 - 31 Jan 2017

* Adds a feature to search the outline, showing also parent sections. (#9101, #9215)
* Fixes a crash when opening single-paged documents in double page mode. (#9269)
* Fixes an issue where `DocumentListener` save callbacks sometimes weren't called after `PSPDFFragment` was detached. (#9319)
* Fixes an issue where FTS 5 PSPDFLibrary searches with only whitespace failed to execute. (#9271)
* Fixes an issue where `ImagePickerFragment` was not asking for camera permission when required. (#9231)
* Fixes an issue where it was possible to enter emojis in custom stamps text. (#9227)
* Fixes an issue where FAB was not hidden when `CustomStampCreatorLayout` was loaded for the first time. (#9229)
* Fixes an UI bug where annotation toolbar submenu overflows the main toolbar. (#8970)
* Fixes an issue where `PSPDFDocument#wasModified` returned `false` if only bookmarks were modified. (#9320)
* Fixes an issue where search button in catalog app could be lost after searching. (#9344)
* Fixes an issue where `PSPDFActivity` was using wrong insets when running immersively in multi-window mode. (#9321)

### 2.9.0 - 25 Jan 2017

* Fixes a [security issue](/guides/android/current/announcements/path-traversal-vulnerability/) where `DocumentSharingProvider` could expose other private application files. (#9136)
* Adds paginated double page layout for browsing documents. (#5670)
    * Adds `PageLayoutMode` which is set through `PSPDFConfiguration` and has values `AUTO`, `SINGLE`, `DOUBLE`. `AUTO` mode will display double page layout on larger devices in landscape, and single page layout on all other.
    * Adds `firstPageAlwaysSingle` property to the `PSPDFConfiguration` that controls whether to keep first page as a cover and display it as a single, or include it in double page mode.
    * Adds `showGapBetweenPages` property to the `PSPDFConfiguration` that controls whether there should be gap between sibling pages or if they should be touching each other.
* Adds support for styling modal dialogs used across the framework. (#7970)
    * Make sure that `AlertDialog`s use theme specified in `alertDialogTheme` theme attribute.
    * Adds `pspdf__modalDialogStyle` theme attribute for styling common properties of custom modal dialogs - share/print options dialog, Annotation inspector, Action menus, Stamp and Signature pickers, New page dialog.
    * Adds `pspdf__sharingdialogStyle` theme attribute for styling share/print options dialog.
    * Adds `pspdf__newPageDialogStyle` theme attribute for styling new page dialog in document editor.
    * Adds `pspdf__stampPickerStyle` theme attribute for styling stamp picker.
    * Adds `pspdf__actionMenuStyle` theme attribute for styling action menus.
* Adds `LocalizationListener` interface used to override built-in UI strings programatically. (#5187)
* Adds an API for using existing signature picker in custom UI. (#9081)
    * Adds `Signature` representing single signature.
    * Adds `SignaturePickerFragment` encapsulating signature picker flow and signature storage handling.
    * Adds `CustomInkSignatureExample` to catalog app showcasing how to use this API to integrate signature picker in custom activity that is using `PSPDFFragment`.
* Adds `PSPDFFragment#addAnnotationToPage()` which simplifies adding annotations to page. (#9081)
* Adds support for free-text annotations fill color. (#9020)
* Adds `getHudViewMode()` method to `PSPDFActivity` for querying currently used HUD view mode. (#9100)
* Adds `setRotation` and `getRotation` properties to `PageImage` object to allow rotation of images when using the `PSPDFProcessor`. (#9096)
* Adds a usage example of `PSPDFThumbnailGrid` to the `CustomFragmentActivity` of the `FragmentExample` inside the catalog app. (#9133)
* Adds `size` and `getIndexedUIDs` method calls to `PSPDFLibrary`. (#9192)
* Adds `LibraryIndexingListener` and `registerLibraryIndexingListener`/`unregisterLibraryIndexingListener` to `PSPDFLibrary`. (#9192)
* Adds support for FTS5 to `PSPDFLibrary`, when available. Note that this upgrade will require all documents to be reindexed. (#9026)
* Adds `enabledAnnotationTools` to `AnnotationEditingConfiguration.Builder` for controlling which annotation tools are enabled when creating annotations. (#8201)
* Adds a new `PSPDFFragment#newInstance` method which accepts an already opened `PSPDFDocument` as a parameter. (#8199)
* Adds setting to prevent copying of selected text, see `CustomApplicationPolicyExample` from the catalog app. (#8728)
* Renames `AnnotationCreationMode` enum to `AnnotationTool`. (#9119)
  * Renames `getActiveAnnotationCreationMode` in `AnnotationCreationController` to `getActiveAnnotationTool`.
  * Removes deprecated methods `getCurrentlyEditedAnnotationType` and `changeAnnotationCreationMode` in `AnnotationCreationController`.
  * Changes `Analytics.Data#ANNOTATION_CREATION_MODE` constant to `ANNOTATION_TOOL`.
* Changes default search result limit of library searches to `500`. Use `maximumSearchResultsTotal()` and `maximumPreviewResultsTotal()` methods in `QueryOptions` to change this. (#9131)
* Improves custom stamps creation API. (#8571, Z#4917)
    * Adds `fromBitmap`, `fromPredefinedType` and `fromSubject` to `StampPickerItem` to access builders for creating custom stamps.
    * Removes `create*` methods from `StampPickerItem` and `StampAnnotationDefaultsProvider`.
    * Moves `StampPickerItem` and `PredefinedStampType` to `com.pspdfkit.annotations.stamps` package.
* `DownloadJob` now executes `ProgressListener` callbacks on the main thread. (#9162)
* `DocumentPrintManager` is now a singleton and not a static class anymore. Retrieve the instance with the `get()` method. (#9179)
* Improves performance of library indexing and preview snippet generation. (#9131)
* Fixes an issue where it wasn't possible to scroll to parts of the document that were hidden under system bars when using `HUD_VIEW_MODE_VISIBLE` in `PSPDFActivity`. (#9078)
* Fixes an issue when adding JPEG images to pages with `PSPDFProcessor` would load them all into memory and cause OutOfMemory exceptions. (#9096)
* Fixes an issue where ink thickness was not recalculated when resizing. (#4808)
* Fixes an issue where note annotation text was not being processed during searching immediately after creating note annotations. (#8889)
* Fixes an issue where an outline element which referenced an invalid page index would cause an exception. (#8855)
* Fixes an issue where back button wasn't visible when showing custom stamp layout on tablets (#8962)
* Fixes a crash when using custom versions of SQLite 3.11 or higher. (#8967)
* Fixes an issue where document editor has been closed after a configuration change. (#5979)
* Fixes an issue where new page dialog stopped working after a configuration change. (#8989)
* Fixes an issue where document editing toolbar wasn't hidden after leaving document editor. (#8982)
* Fixes an issue where tapping on document background didn't toggle the HUD. (#8965)
* Fixes an issue where note annotation editor remained in broken state after restoring application's state. (#9100)
* Fixes an issue where active text selection was lost after configuration change. (#7366)
* Fixes an issue where application state could not be restored properly in some cases. (#9099)
* Fixes an issue where `PSPDFThumbnailGrid` failed to render images if not properly laid out. (#9134)
* Fixes an issue where `PSPDFThumbnailGrid` could not be shown immediately after being hidden. (#9151)
* Fixes an issue where touch gesture could get handled after the document has been reloaded which could cause a crash. (#9145)
* Fixes an issue where last letter of a sentence couldn't be highlighted in some cases. (#8751)
* Fixes an issue where repeatedly highlighting same sentence would make the highlight darker and underlines overlap. (#4913)
* Fixes an issue where it was possible to create empty custom stamps. (#8969)
* Fixes an issue where annotation list items were missing icons for certain annotations. (#9206)

### 2.8.1 - 13 Dec 2016

* Adds `NewPageDialog`. (#8759)
    * Adds `NewPageFactory` interface and `PSPDFThumbnailGrid#setNewPageFactory`. The factory returns `NewPage` instances that are used by the document editor when adding a page.
    * Adds `DialogNewPageFactory` for creating new pages using the `NewPageDialog`. This is the default factory.
    * Adds `ValueNewPageFactory` that allows programmatically specifying a single `NewPage` instances that is used by the document editor.
* Adds divider after annotation preview as a visual cue that annotation preview is clipped. (#8827)
* Adds support for `PropertyInspector#ItemDecoration` that can be used to implement custom dividers between inspector views. (#8849)
* Adds Slovak language localization. (#8928)
* Adds the ability to disable annotations from rendering via `PSPDFActivityConfiguration#annotationRenderConfiguration(AnnotationRenderConfiguration)`, see `AnnotationRenderingExample` from the catalog app. (#7571)
* Improves grouping of icons in `AnnotationCreationToolbar`. (#8863)
    * Items are now grouped more by the context and not just extracted if enough space (which was leading to strange structures).
    * Groups are predefined and can be found in `AnnotationCreationToolbarItemPresets`.
    * Grouping is being done by `AnnotationCreationToolbarGroupingRule` instead of being directly passed to `setMenuItems()` - flat list of items is passed now.
* Improves `DocumentEditingToolbar` by making it draggable and introducing pre-defined item groupings same as for `AnnotationCreationToolbar`. (#8898)
    * Groups are predefined and can be found in `DocumentEditingToolbarItemPresets`.
    * Grouping is being done by `DocumentEditingToolbarGroupingRule` instead of being directly passed to `setMenuItems()` - flat list of items is passed now.
    * Drag position is saved and the toolbar's default position on the tablet is on the left side.
* Fixes an issue where `AnnotationCreationToolbar` single menu items cannot be deselected. (#8852)
* Fixes an issue with loading invalid annotations. (#8869)
* Fixes an issue where an invalid page index read from the document store could cause an exception. (#8858)
* Fixes an issue while garbage collecting PDF objects on saving non-incrementally. (#8901)
* Fixes an issue where opening note annotation dialog twice at the same time broke UI. (#8854)
* Fixes thumbnail bar flickering when changing pages. (#4894)
* Fixes an issue where edit annotation menu item is not selected once the annotation creation mode is activated. (#7513)
    * Adds `pspdf__editAnnotationsIconActivated` for specifying custom icon when annotation creation mode is active. This is contained in `pspdf__ActionBarIcons` style.
    * Selected icon color is controlled by `pspdf__ActionBarIcons_pspdf__iconsColorActivated` style parameter.
* Lets `com.pspdfkit.utils.Size` implement `Parcelable`. (#8765)
* Fixes an exception in `UnitSelectionEditText` for Arabic devices. (#8738)
* Fixes an issue where leaving annotation creation mode could lead to an exception. (#8860)
* Fixes an issue causing an `IndexOutOfBoundsException` when selecting text on a page. (#8922)
* Fixes an issue where sharing with WhatsApp triggered an exception. (#8424)

### 2.8.0 - 1 Dec 2016

* **Updates dependencies** - Support libraries to `25.0.1`, RxJava to `1.2.3`.
* Adds automated saving and restoration of the last viewed page in a document (#8744)
    * Adds `PSPDFConfiguration#isLastViewedPageRestorationEnabled` and respective setters `PSPDFConfiguration.Builder#restoreLastViewedPage` and `PSPDFActivityConfiguration.Builder#restoreLastViewedPage`.
    * Adds constant `PSPDFFragment#DOCUMENTSTORE_KEY_LAST_VIEWED_PAGE_INDEX` that is used by the fragment as key for storing the last viewed page index inside the `DocumentDataStore` of the loaded document.
    * Adds catalog app setting "Restore last viewed page".
* Adds feature to reveal the URL stored inside a link annotation when long-pressing the annotation. (#5558)
* Adds support for square and circle annotations. (#8548)
    * Adds `SquareAnnotation` and `CircleAnnotation` classes.
    * Adds UI to add and edit square and circle annotations on the page.
    * Adds `ShapeAnnotationDefaultsProvider`providing defaults for creating and editing square and circle annotations.
* Adds support for polygon and polyline annotations. (#8625)
    * Adds `PolygonAnnotation` and `PolylineAnnotation` classes.
    * Adds UI to add and edit polygon and polyline annotations on the page.
    * Defaults for polygon annotations are provided by `ShapeAnnotationDefaultsProvider`.
    * Defaults for polyline annotations are provided by `LineAnnotationDefaultsProvider`.
* Adds support for storing persistent per-document preferences. (#8638, #8703).
    * Adds `DocumentDataStore` public class to access the document preferences.
* Adds support for line annotations with filled line ends. (#8455)
* Adds support for editing annotation points for line, polygon and polyline annotations. (#8456)
* Adds missing `setAlpha` setter to `Annotation` class. (#8398)
* Improves the `ContextualToolbar` so that items are dynamically re-grouped once the size of the toolbar changes. (#8173)
    * Adds `DefaultMenuItemGroupingRule` which is an implementation of `MenuItemGroupingRule` interface. You can use these two to implement your custom grouping of menu items. The `DefaultMenuItemGroupingRule` is generic and somewhat complex. It's set by calling `ContextualToolbar#setMenuItemGroupingRule()`.
* Improves the positioning of the items in the `AnnotationCreationToolbar`: annotation menu items are on the left side (top when vertical) and control buttons (close, open color picker and drag) are on the right side (bottom when vertical). (#8615)
* Improves memory handling in low-memory situations and with many open documents. (#8352, #8447)
* Improves performance of decoding JPEG images. (#8712, #8673)
* Improves bookmark handling in Processor and DocumentEditor. (#8091)
* Improves annotation deletion speed. (#8788)
* Improves loading time of large documents lazily loading page sizes, labels and rotations. (#7842)
* Disables resize guides for line annotations. (#8696)
* Fixes an issue where line annotation ends were being clipped by annotation's bounding box. (#8357)
* Fixes pixelated ink paths when drawing on zoomed page. (#8696)
* Fixes an issue where ink/lines could dissappear while drawing in Android 4.1. (#8811)
* Fixes an issue where annotation selection didn't reflect annotation bounding box changes. (#8696)
* Fixes an issue where white and transparent colors could not be distinguished from background in annotation inspector. (#8548)
* Fixes an issue where a page would not be properly refreshed when adding certain annotation types. (#8577)
* Fixes an issue with opening a PDF with bookmarks in Preview.app. (#8591)
* Fixes an issue where it wasn't possible to resize image stamps with large aspect ratios. (#8570)
* Fixes an issue where `PSPDFPasswordView` would still apply color filters if tinting was deactivated via `PasswordViewThemeConfiguration#isIconTintingEnabled`. (#8607)
* Fixes an issue where the toolbar was clipped when animating its visibility in immersive viewing mode. (#8681)
* Fixes label backgrounds in page grid when the page has a long page label. (#8745)
* Fixes an issue where markup annotation wasn't updated when changing its color. (#8749)
* Fixes unnecessary page render when creating annotations. (#8700)
* Fixes an issue where parceled `DataProvider` instances were not correctly loaded by `PSPDFFragment`. (#8743)

### 2.7.0 - 7 Nov 2016

* **Updates dependencies** - Support libraries to `25.0.0`, RxJava to `1.2.2`.
* **Updates target to 25** - Android Nougat 7.1.
* Adds full support for Android Nougat multi-window mode.
* Adds support for signatures. (#6582)
    * Adds UI for adding, selecting and deleting signatures, which are then added to the page as ink annotations.
    * Adds two modes for handling signature annotations: "My Signature" (stores added signatures) and "Customer Signature" (one time signature).
    * Adds `setCustomerSignatureFeatureEnabled(boolean)` and `setSignatureSavingEnabled(boolean)` to `AnnotationEditingConfiguration.Builder` for configuring previously mentioned modes.
    * Adds `pspdf__signatureLayoutStyle` attribute for styling the signature dialog.
* Adds support for line annotations. (#8339)
    * Adds `LineAnnotation` class.
    * Adds UI to add and edit line annotations on the page.
    * Adds `LineAnnotationDefaultsProvider` providing defaults for creating and editing line annotations.
* Adds `setBorderColor`, `setBorderWidth`, `setBorderStyle` and `setBorderDashArray` (and getters) to `Annotation` class. (#8301)
* Adds support for stamps with images captured from camera. (#8218)
* Adds ready to use API for picking images from gallery or capturing images via camera. (#8190)
    * Adds `ImagePickerFragment` that encapsulates whole picker lifecycle.
    * Adds `BitmapUtils` class for decoding `Bitmap` from `Uri`s retrieved via `ImagePickerFragment#OnImagePickedListener`.
    * Adds an example to catalog app showcasing how to use this API to create new pages with images captured by camera.
* Adds `#toString` methods to `DownloadRequest` and `URLDownloadSource`. (#8264)
* Adds `PasswordViewThemeConfiguration.Builder#iconTintingEnabled` which allows turning off tinting of the password view drawable. (#8403)
* Adds close button to annotation property inspector. (#8262)
* Adds scrollbars and document scrolling API. (#8388)
    * Enables default Android scrollbars on the `PSPDFFragment`. You can disable them using `#scrollbarsEnabled` on the `PSPDFConfiguration.Builder` or `PSPDFActivityConfiguration.Builder`.
    * Adds styleable attribute `pspdf__documentViewStyle` that accepts a style defining `View` attributes for modifying the appearance of scrollbars. If not overridden by the active theme, this attribute is set to the `pspdf__DocumentView` style.
    * Adds scrollbar theming example to the existing `DarkThemeExample`.
    * Adds `DocumentScrollListener` interface for observing scrollbar movement of the current document.
    * Adds `PSPDFFragment#registerDocumentScrollListener` and `PSPDFFragment#unregisterDocumentScrollListener`
    * Adds `VerticalScrollBar` widget, a customizable scrollbar with draggable indicator (for quick page browsing).
    * Adds `VerticalScrollBarExample` to showcase scrollbar usage inside a custom activity.
* Adds the ability to disable bookmark renaming with `PSPDFOutlineView#setBookmarkRenamingEnabled`. (#8118)
* Adds `PSPDFKit#setLoggingEnabled` method for enabling or disabling PSPDFKit debug output in logcat. (#8515)
* Adds an API for dynamic modification of certain properties of the active annotation selection. (#8150)
    * Adds new method `onPrepareAnnotationSelection` to `PSPDFAnnotationManager.OnAnnotationSelectedListener`.
    * Adds `AnnotationSelectionController` exposing multiple properties for controlling active annotation selection.
    * Adds `AnnotationSelectionCustomizationExample` showcasing this new API.
    * Adds `OnAnnotationSelectedListenerAdapter` which is an empty implementation of the `PSPDFAnnotationManager.OnAnnotationSelectedListener` interface.
* Removes `PSPDFConfiguration#isLoggingEnabled` and corresponding builder methods. (#8515)
* Improves large memory usage handling of `PSPDFProcessor`. (#8291, #8352)
* Fixes an exception thrown by a `DownloadJob` if the parent folder of the output file did not exist. The `DownloadJob` will now try to create the folder itself, or throw an exception if not able to do so. (#8265)
* Fixes an unlikely crash in annotation parsing. (#8295)
* Fixes an issue causing a `NullPointerException` when exiting text selection mode while a highlight annotation is being created. (#8299)
* Fixes a rare issue in the Document Editor. (#8370)
* Fixes typo in class name: `FloatingHitEditText` is now called `FloatingHintEditText`. (#8404)
* Fixes an issue where bookmark name edit dialog could not be confirmed with enter key. (#8328)
* Fixes an issue where annotations could be rendered with a wrong image. (#8493)
* Fixes an issue where document wasn't resized correctly after hiding keyboard in immersive mode. (#8494)
* Fixes an issue where grid view was always showing page labels even if disabled. (#8046)

### 2.6.1 - 17 Oct 2016

* Adds support for custom stamps. (#8062)
* Adds progress dialog when sharing file without processing. (#8156)
* Adds web download capabilities to `DownloadJob`. (#8160)
  * `DownloadJob` will now use a temporary file for writing while downloading. This prevents corrupted files when downloads are interrupted. To not use a temporary file set `DownloadRequest.Builder#useTemporaryOutputFile` to `false`
  * Adds `DownloadProgressFragment#setDialogOnCancelListener` for setting a listener that will be notified of when the progress dialog was cancelled by the user.
  * Adds `URLDownloadSource` that can download PDF documents from a `URL` object.
  * Adds detection of `http` and `https` URIs using `DownloadRequest.Builder#uri`.
  * Removes `@Nullable` annotation from `DownloadProgressFragment#getJob`.
* Adds `ActionResolver` for executing PDF actions from the `com.pspdfkit.annotations.actions` package. `PSPDFFragment` implements this interface, allowing to execute PDF actions on the document. (#8205)
* Adds missing `BookmarkViewAdapter` interface which can be set by `PSPDFOutlineView#setBookmarkViewAdapter`. (#8117)
* Automatically uses [ReLinker](https://github.com/KeepSafe/ReLinker) to load native library if available. This fixes `UnsatisfiedLinkError` exceptions on some older devices. For more information on ReLinker usage and configuration see our guide article: https://pspdfkit.com/guides/android/current/miscellaneous/relinker/ (#8197)
* Change occurrences of `pageNumber`, `page`, etc. to `pageIndex`. (#8115)
    * Renames `PSPDFSearchResult#pageNumber` to `PSPDFSearchResult#pageIndex`.
    * Renames `GoToAction#getPage` to `#getPageIndex`.
    * Renames `QueryPreviewResult#getPage` to `#getPageIndex`.
    * Renames `StampPickerDialog#setPageNumber` and `#getPageNumber` to `#setPageIndex` and `#getPageIndex` respectively.
    * Renames `Bookmark#getPage` to `#getPageIndex`.
    * Renames `TextSelection#page` to `#pageIndex`.
    * Renames `OnZoomFactorChangedEvent#page` to `#pageIndex`.
* Fixes an issue where swiping through a large PDF could cause a crash. (#8141)
* Fixes an issue that caused crashes on some documents when dragging selection handles. (#8186)
* Fixes an issue where document insets were not applied when creating free-text annotations. (#8185)
* Fixes inconsistent peek height of the bottom sheet `ActionMenu`. (#8071)
* Fixes an issue where contextual toolbars weren't updating toolbar icons correctly. (#8193)
* Fixes an issue where share button stopped working after reloading the document. (#8198)
* Fixes an issue that caused duplicated text rendering when creating free-text annotation. (#8243)
* Fixes an issue where document editor persisted edited state across editing sessions even when editing had been cancelled. (#8241)
* Fixes an issue where `DownloadProgressFragment` would always switch to indeterminate progress bar style after a configuration change. (#8166)
* Fixes an issue where images captured by device camera had wrong orientation when used as stamp image or `PageImage`. (#8221)
* Fixes an issue where image annotations weren't rotated correctly on rotated PDF pages. (#8135)
* Fixes an issue where an invalid modification or creation date inside the PDFs metadata would cause a crash. (#8236)

### 2.6.0 - 3 Oct 2016

* Adds support for image and stamp annotations. (#5628)
    * Adds `StampAnnotation` object representing both image and stamp annotations.
    * Adds UI to add and edit stamp annotations on the page.
    * Adds UI to add pictures from device library to the pages.
* Adds a new bottom sheet sharing dialog that replaces the share/print menu. (#7598)
    * Adds `ActionMenu` for displaying list of `ActionMenuItem` inside grid list bottom sheet.
    * Adds `SharingMenu` which extends `ActionMenu` to display list of sharing targets.
    * Adds `DefaultSharingMenu` which extends `SharingMenu` to display print and view actions.
    * Adds `PSPDFActivity#setSharingMenuListener(listener)` for listening to default sharing menu lifecycle and click events.
* Adds download API for saving PDF documents to the local filesystem. (#7553)
    * Adds `DownloadRequest` and `DownloadJob` for configuring and performing a download.
    * Adds `DownloadSource` interface for defining different types of remote PDF document sources.
    * Adds `AssetDownloadSource` for copying a PDF document from the app's assets.
    * Adds `ContentResolverDownloadSource` for saving a PDF document from a content provider.
* Adds sub-menus to the `ContextualToolbar` instead of displaying a new set of items. Sub-menus are activated with long-pressing the items with sub-menu indicators. (#7116)
    * Adds `pspdf__contextualToolbarSubmenuBackground` for controlling the background of sub-menus, alongside the already existing `pspdf__contextualToolbarBackground` which is now applied to the main menu bar.
    * Adds `ContextualToolbarMenuBar` class which represents a single bar inside the `ContextualToolbar` serving as a `ViewGroup`.
* Adds `CustomSharingMenuExample` to catalog app showcasing how to add custom share actions to sharing menu. (#7564)
* Adds set of new methods to `DocumentSharingManager` accepting `ShareTarget` for sharing documents to single share target. (#7604).
* Adds async versions for methods in `DocumentSharingIntentHelper` that could potentially block UI thread. (#7822)
* Adds methods `PSPDFKit#invalidateDocumentCache` and `PSPDFKit#invalidatePageCache` for clearing the render cache of a document or page respectively. (#7739)
* Adds new document processing examples inside the `DocumentProcessorExample` of the catalog app. (#7594, #7797)
    * Adds example on how to rotate pages.
    * Adds example on how to add new pages to a document.
* Adds better support for preserving passwords from the original document when saving or processing. (#6665)
* Adds `PSPDFKit#openDocument(context, DocumentSource)` and `PSPDFKit#openDocuments(context, List<DocumentSources>)` methods. A `DocumentSource` object describes the source of a document which can be either a `Uri` or a `DataProvider`. (#7994)
    * Removes `PSPDFKit#openDocuments(List<Uri>)`. It had to be removed instead of deprecated due to Java generics type erasure. It has been replaced with `PSPDFKit#openDocuments(List<DocumentSource>)`.
    * Adds `PSPDFDocument#getDocumentSource()` and `PSPDFDocument#getDocumentSources()` methods for retrieving the source of document PDF data.
    * Deprecates all `PSPDFKit#open` methods which accepted a `DataProvider` or list of document `Uri`s. The new methods accepting `DocumentSource` objects should be used instead.
    * Deprecates `PSPDFDocument#getUri()`, `PSPDFDocument#getUriList()`. The new `getDocumentSource()` and `getDocumentSources()` methods should be used instead.
* Adds position independent executable flag (-fpie) for further security hardening of the native code. (#7731)
* Adds keyboard shortcuts. (#7750)
    * Adds Ctrl+P for opening the printer dialog.
    * Selected annotations can now be deleted by pressing backspace or delete.
* Adds `AnnotationCreationMode` enum that is used instead of `AnnotationType` to control active annotation tool in annotation creation mode. (#7883)
    * Deprecates `PSPDFFragment#enterAnnotationCreationMode(AnnotationType)`. Use `#enterAnnotationCreationMode(AnnotationCreationMode)` instead.
    * Deprecates `AnnotationCreationController#getCurrentlyEditedAnnotationType`. Use `#getActiveAnnotationCreationMode` instead.
    * Deprecates `AnnotationCreationController#changeAnnotationCreationMode(AnnotationType)`. Use `#changeAnnotationCreationMode(AnnotationCreationMode)` instead.
* Adds analytics API allowing developers to collect framework data. (#7836)
    * Adds `AnalyticsClient` interface. This can be implemented to receive various analytics events and data from the framework.
    * Adds `Analytics.Event` and `Analytics.Data` classes defining all existing analytics events and their carried data.
    * Adds `PSPDFKit#addAnalyticsClient` and `PSPDFKit#removeAnalyticsClient` for adding and removing `AnalyticsClient` instances respectively.
* Adds an option to limit the maximum number of search results. See `SearchConfiguration.Builder#maxSearchResults(int)`. (#7512)
* Significantly improves rendering performance by partially rendering zoomed pages. (#7531)
    * Fixes fuzzy text while scrolling around the page.
    * Significantly reduces memory usage of the application.
* Default position of the `AnnotationCreationToolbar` is now `Position.LEFT` on tablet devices with `sw600dp`. (#7517)
* Clicking on annotation editing button now toggles annotation creation mode. (#8069)
* Improves rendering of annotations on rotated documents. (#6312, #7185, #7792)
* Improves memory usage when searching in a large document. (#7958)
* Improves font size picker in `SliderPickerInspectorView`. (#8014)
* `PSPDFKit.open*Async` methods now return a `Single<PSPDFDocument>` instead of `Observable<PSPDFDocument>`. (#7994)
* Renames controller binding methods in `ContextualToolbar` implementations: (#7908)
    * `AnnotationCreationToolbar#bindAnnotationCreationController()`, `DocumentEditingToolbar#bindDocumentEditingController()` and `TextSelectionToolbar#bindTextSelectionController()` are all renamed to `bindController()`.
    * `AnnotationCreationToolbar#unbindAnnotationCreationController()`, `DocumentEditingToolbar#unbindDocumentEditingController()` and `TextSelectionToolbar#unbindTextSelectionController()` are all renamed to `unbindController()`.
* Fixes toolbar icon when sharing is disabled - the icon will now show a printer to accurately reflect the remaining action. (#8045)
* Fixes an issue where a highlight annotation was rendered with a border. (#7618)
* Fixes an issue where some documents couldn't be exported or printed. (#7585)
* Fixes an incorrect bitmap recycling when the `PSPDFActivity` is finishing, possibly causing out-of-memory errors when quickly being restarted. (#7659)
* Fixes a build tools issue causing resource resolution errors at runtime. (#7672)
* Fixes a crash originating inside the `ContentResolverDataProvider` if the used content provider was not supporting append operations. (#7716)
* Fixes an issue where the text selection offsets were wrong in certain documents, causing highlight annotations to be misaligned. (#7271)
* Fixes an issue where text selection mode was exited when dragging both handles to the same text index. (#7652)
* Fixes an issue where document editor didn't re-render changed pages. (#7690)
* Fixes an issue where document didn't refresh when creating highlight annotation from selected text. (#7729)
* Fixes an issue where markup annotation color wasn't applied before leaving annotation inspector. (#7786)
* Fixes clipped background of selected toolbar icons on some density configurations. (#7741)
* Fixes `DocumentListener` callbacks `onPageChanged(PSPDFDocument, int)` and `onDocumentZoomed(PSPDFDocument, int, float)` inconsistent with paginated scrolling. (#6727)
* Fixes bookmark list view losing changed sort order when a bookmark is deleted. (#7977)
* Fixes wrong tint of bookmark edit button. (#8001)
* Fixes autocorrect not working for free text annotations. (#7857)
* Fixes markup annotations sometimes being rendered on top of other annotations. (#8029)
* Fixes rendering of compound documents with annotations. (#8048)
* Fixes an issue where thumbnail bar is being kept on top of the keyboard, thus reducing the available space on the screen. (#7999)

### 2.5.1 - 29 Aug 2016

* Adds preview of free-text and ink annotations to annotation inspector when creating annotations. (#7330)
* Adds example on how to add custom share actions to the `CustomActionsExample` of the catalog app. (#7564)
* Adds example on how to rotate pages using the `PSPDFProcessor` to the `DocumentProcessingExample` of the catalog app. (#7594)
* Renames `PropertyInspectorView#bindToController()` to `PropertyInspectorView#bindController()`. (#7540)
* Catalog app now asks for external storage read/write permissions when opening files from implicit intents on Android M and higher. (#7150)
* Allows re-selecting text via long press gesture when text is already selected. (#7566)
* Fixes an issue where `windowSoftInputMode` set on `PSPDFActivity` was overwritten with `SOFT_INPUT_ADJUST_NOTHING` when opening password protected documents. (#7431)
* Fixes crash when deselecting FreeText annotations with `null` contents. (#7584)
* Fixes an issue where ink annotations that were created with smaller bounding box than the minimum bounding box size could not be resized to their original size. (#7438)
* Fixes an issue with single dot ink annotation disappearing when moved around the page. (#7436)
* Fixes an issue where HUD disappeared when tapping menu item while HUD was hiding. (#7502)
* Fixes an issue where annotation creation mode was left after creating note annotation on single page documents. (#7516)
* Fixes an issue that could lead to inconsistent UI when clicking on HUD buttons while selecting annotations. (#7520)
* Fixes an issue where ink annotations resized to their maximum size were rendered without alpha. (#7534)
* Fixes an issue where creating multiple free-text annotations would exit annotation creation mode. (#7591)

### 2.5.0 - 15 Aug 2016

* **Updates dependencies** - support libraries have been reverted to `23.4.0` until release of Android Nougat. RxJava was updated to version `1.1.9`.
* Adds bookmark support to the UI and APIs. Bookmarks are stored inside the PDF document itself in a portable manner. (#5787)
    * Adds Bookmarks tab to the outline view with controls to add and delete bookmarks.
    * Adds `BookmarkProvider` class handling all `Bookmark` related operations. It can be retrieved by calling `PSPDFDocument#getBookmarkProvider()`.
    * Adds `BookmarkListView` as a view to display bookmark list inside a document.
* Adds annotation property inspector replacing old color and thickness picker dialog. (#3594)
    * *IMPORTANT:* The property inspector coordinator needs to be present in activity layout for annotation inspector to work correctly. If you are using custom view in `PSPDFActivity`, add `com.pspdfkit.ui.inspector.PropertyInspectorCoordinatorLayout` with id `R.id.pspdf__inspector_coordinator` (for example, see `custom_pdf_activity.xml` from the catalog app).
    * Adds `PropertyInspectorView` interface with implementations `ColorPickerInspectorView` and `SliderPickerInspectorView` for picking colors and thickness/text size.
    * Adds `PropertyInspector` used as a container for `PropertyInspectorView`s.
    * Adds `PropertyInspectorCoordinatorLayout` used for displaying instances of `PropertyInspector` and handling animations and interactions between them.
    * Updates `AnnotationToolbarFragmentExample` from the catalog app to show how to incorporate `PropertyInspectorCoordinatorLayout` with working annotation inspector in `PSPDFFragment` within the custom activity.
    * Adds `CustomAnnotationInspectorExample` showing how to add views to existing annotation inspector and how to create custom annotation inspector UI from scratch.
* Adds `PSPDFActivity.IntentBuilder` that builds an Intent to display a PDF document. This allows customization of Intent flags and extras before starting the activity. (#7158)
* Adds an API for controlling annotation inspector when creating or editing annotations.
    * Adds `AnnotationInspectorController` through which the annotation inspector can be fully customised.
    * Adds `bindAnnotationInspectorController` and `unbindAnnotationInspectorController` to `AnnotationCreationController` and `AnnotationEditingController`.
    * Adds `AnnotationCreationInspectorController` and `AnnotationEditingInspectorController` managing annotation inspector in annotation creation and editing modes.
* Adds an API for controlling annotation editing defaults and preferences.
    * Adds `AnnotationDefaultsManager` handling defaults and allowed values for annotation properties.
    * Adds set of `AnnotationDefaults*Provider` interfaces for supported annotation properties and `FreeTextAnnotationDefaultsProvider`, `InkAnnotationDefaultsProvider`, `MarkupAnnotationDefaultsProvider` and `NoteAnnotationDefaultsProvider` providing annotation defaults for supported annotation types.
    * Adds `AnnotationPreferencesManager` handling annotation editing preferences.
    * Adds `PSPDFFragment#getAnnotationDefaults()` and `PSPDFFragment#getAnnotationPreferences` to access `AnnotationDefaultsManager` and `AnnotationPreferencesManager`.
    * Adds `AnnotationDefaultsExample` showing how to use the new annotation defaults API.
* Improves configuring search and adds more options to the search API. (#7246)
    * Adds `SearchConfiguration` to `PSPDFActivityConfiguration` containing properties for searching the document.
    * Adds `SearchView#setSearchConfiguration()` for setting the `SearchConfiguration` to the `SearchView` implementation.
    * Adds an option to start search on the current page in the search views. See `SearchConfiguration.Builder#setStartSearchOnCurrentPage()`.
    * Adds getters and setters for `SearchConfiguration` properties applied to `PSPDFSearchViewInline` and `PSPDFSearchViewModular`.
    * Adds setting up priority pages when performing a search. Those pages will be the first ones to search, before the other ones. See `PSPDFSearchOptions#priorityPages()`.
    * Removes `setSnippetLength()` and `setStartSearchChars()` (along with its XML counterparts) from `ModularSearchThemeConfiguration` since those don't really belong to the theme, moved to `SearchConfiguration`.
    * Removes `setStartSearchChars()` (along with its XML counterparts) from `InlineSearchThemeConfiguration` since that doesn't really belong to the theme, moved to `SearchConfiguration`.
* Adds `PropertyInspectorCoordinatorLayout.PropertyInspectorLifecycleListener` that listens for property inspector lifecycle within the `PropertyInspectorCoordinatorLayout` (preparing, displaying, removing), set through `PSPDFActivity#setPropertyInspectorLifecycleListener(listener)` and removed through `PSPDFActivity#removePropertyInspectorLifecycleListener()`.
* Adds support for annotation resizing guides. (#5555)
* Adds theme attributes for `ToolbarCoordinatorLayout` set through: `<item name="pspdf__toolbarCoordinatorLayoutStyle"/>` with `dragTargetColor` attribute for setting a color of the target area when dragging the toolbars. It can also be set programmatically through `ToolbarCoordinatorLayout#setDragTargetColor`. (#7165)
* Adds `ToolbarCoordinatorLayout.LayoutParams` to be used for positioning `ContextualToolbar` within `ToolbarCoordinatorLayout`. (#7161)
    * Adds `allowedPositions` property as part of the `ToolbarCoordinatorLayout.LayoutParams` that allows selecting which toolbar positions are allowed.
    * Improves toolbar position changes: when forcefully pinned to the top due to the lack of space, the toolbar will restore it's original position once there's enough space again.
    * Removes `ContextualToolbar#setPosition()` and `ContextualToolbar#getPosition()` calls. Set position parameter through `ToolbarCoordinatorLayout.LayoutParams`, set on the `ContextualToolbar`.
* Adds `DocumentSharingProvider` automatically to the manifest through manifest merging (no need to set them manually). (#7287)
* Adds `android:largeHeap="true"` to the `AndroidManifest.xml` using manifest merging. (#7287)
* Renames `Annotation#getPageNumber()` to `Annotation#getPageIndex()` to avoid confusion about zero indexing. (#7340)
* Renames `MediaAssetsContentProvider` to `AssetsContentProvider`. It's authority is changed to `{$applicationId}.pdf.assets` and it is not added automatically to the app's manifest. (#7391)
* Improves compatibility when flattening documents with non-standard headers. (#7212)
* Improves logic around copying forms via the processor when the source document has invalid form entries. (#7273)
* Improves JPEG2000 decoding performance. (#7307)
* Deprecates `PSPDFActivityConfiguration#printingEnabled()` and replaces it with `enablePrinting()` / `disablePrinting()` methods for consistency. (#7476)
* Fixes all documents using the same thread pool causing severe performance issues when trying to do background operations like thumbnail generation. (#7240)
* Fixes an issue where note annotation wasn't created with last used color and icon. (#7107)
* Fixes several issues found when editing annotation in compound documents. (#7192)
* Fixes improper toolbar height on pre-Lollipop devices. (#7334)
* Fixes incorrect `InvalidThemeException` being thrown when the context provided to the theme configuration builders is not using some `NoActionBar` theme. (#7463)
* Fixes an issue where annotation could not be resized when scale handle moved outside of a page. (#7367)
* Fixes an issue where annotation could not be resized when scale handles moved outside of a page. (#4814)
* Fixes an issue that could result in infinite search when performing inline search. (#7410)
* Fixes false positive warnings when detecting missing `android:largeHeap` flag. (#7262)
* Fixes an issue when inline search query is not cleared up when exiting the search bar. (#7453)
* Fixes an issue where annotation resizing couldn't be disabled via `AnnotationEditingConfiguration.Builder#setSelectionResizeEnabled`. (#7488)

### 2.4.3 - 6 Jul 2016

* Adds `pspdf__tabIndicatorColor` attribute to the `pspdf__OutlineView` styleable. The attribute defaults to `?colorPrimary`. (#7091)
* Marks exception parameters in `DocumentListener#onDocumentLoadFailed` and `DocumentListener#onDocumentSaveFailed` as `@NonNull`. (#7122)
* `DocumentSharingProvider` will now return the `android.provider.OpenableColumns` when queried for a shared file. (#7131)
* Fixes an issue where PSPDFKit thought it runs in debug mode. (#7129)
* Fixes an issue where the soft keyboard was not closed after exiting search on some Samsung devices. (#7145)

### 2.4.2 - 28 Jun 2016

* **Updates dependencies** - Support libraries (`support-v4`, `appcompat-v7`, `recyclerview-v7`, `cardview-v7` and `design`) have been updated to version `24.0.0`. RxJava was updated to `1.1.6` and RxAndroid to `1.2.1`.
* Adds `ToolbarsInFragmentExample` instead of `AnnotationToolbarFragmentExample` in the catalog app, incorporating all new toolbars instead of just annotation creation toolbar. (#6914)
* Adds a lot of the documentation with the matched styling across the framework. (#6406, #6404)
* Adds `InvalidThemeException` that may be thrown if an invalid theme is used. (#6942, #6943)
* Adds theme validation to `PSPDFActivity#onCreate` which will throw an exception if the used theme is incompatible with the activity. (#6942)
* `ThumbnailBarThemeConfiguration#getBackgroundColor` now defaults to the theme's `?colorPrimary` attribute. (#6943)
* Adds a default icon to the PDF password screen. To disable the icon set `pspdf__icon` of your theme's `pspdf__passwordViewStyle` to `@null`. (#6943)
* Improves rendering performance in certain situations. (#6944)
* Improves thumbnail grid to render thumbnails in page order. (#5307)
* Changes the toolbar drag being activated with a long press on the drag button. Now it starts as soon as the drag button is touched. (#6927)
* Fixes an issue where rotated pages were not rendered correctly in print preview. (#6892)
* Fixes an issue with print dialog being canceled when changing orientation. (#6755)
* Fixes an issue where overriding menu item clicks in `ContextualToolbar` through `ContextualToolbar.OnMenuItemClickListener` was not correctly applied and the default action was executed alongside the custom one. (#6995)
* Fixes a native crash caused when passing `null` as license to `PSPDFKit#initialize`. The method will now throw a `PSPDFInvalidLicenseException` if called with a `null` license. (#7055)
* Fixes keyboard not closing after exiting search in some cases. (#7070)

### 2.4.1 - 10 Jun 2016

* Theme attribute `actionModeBackground` is no longer used for setting default color for all contextual toolbars. Please use `pspdf__contextualToolbarBackground` instead. (#6912)
* Removes the no longer used `TextSelectionListener` interface. Please use the newer [`OnTextSelectionChangedListener`](https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/special_mode/manager/TextSelectionManager.OnTextSelectionChangeListener.html) instead. (#6896)
* Fixes an issue causing a license error when initializing the `PSPDFThumbnailGrid`. (#6910)
* Fixes an issue where text in note annotation editor had low contrast when using certain background colors. (#6819)
* Fixes an issue where annotation color picker didn't show correct color when editing annotations. (#6875)
* Fixes crash in `ContextualToolbar` that occurred when theme didn't define the `actionModeBackground` attribute. (#6906)
* Fixes `PSPDFFragment#onSaveInstanceState` blocking the main thread when being called while the fragment was on the fragment back stack without being displayed. (#6971)
* Fixes an issue with print dialog being canceled when changing orientation. (#6755)

### 2.4.0 - 7 Jun 2016

PSPDFKit 2.4 for Android is one of our largest releases so far. A new annotation toolbar, printing and many smaller improvements to almost all parts of the SDK make this a worthy upgrade.

* *IMPORTANT:* `PSPDFActivity` now uses `android.support.v7.widget.Toolbar` as action bar instead of the default one (#6036). These are the necessary migration changes:
    * If using custom view in `PSPDFActivity`, add `android.support.v7.widget.Toolbar` with id `R.id.pspdf__toolbar_main` contained within the `com.pspdfkit.ui.toolbar.ToolbarCoordinatorLayout` with id `R.id.pspdf__toolbar_coordinator`. The toolbar coordinator needs to contain main toolbar as a child so the new toolbars can be displayed and animated properly (for example, see `custom_pdf_activity.xml` from the catalog app).
    * The theme applied to the activity should have `Theme.AppCompat.Light.NoActionBar` as a parent, with these attributes: `<item name="windowActionBar">false</item>`, `<item name="windowNoTitle">true</item>` and `<item name="windowActionModeOverlay">true</item>`. The default color for all the contextual toolbars is set through `<item name="actionModeBackground">`.
* Adds support for printing documents in Android 4.4 (API level 19) and higher. (#2936)
    * Adds `PrintAdapter` class to manually handle PDF processing for printing.
    * Adds `DocumentPrintDialog` to display a dialog with printing options.
* Adds an API for controlling the annotation creation mode:
    * Adds method to start the annotation creation: `PSPDFFragment#enterAnnotationCreationMode(AnnotationType annotationType)`.
    * Adds listeners for mode changes: `PSPDFAnnotationManager.OnAnnotationCreationModeChangeListener` and `PSPDFAnnotationManager.OnAnnotationCreationModeSettingsChangeListener`.
    * Adds methods for registering those listeners in `PSPDFFragment`: `registerAnnotationCreationModeChangeListener()` and `registerAnnotationCreationModeSettingsChangeListener()` along with `unregister*` calls.
    * Adds `AnnotationCreationController` provided by listener callbacks through which the annotation creation mode can be controlled programmatically.
* Adds an API for controlling the annotation editing mode:
    * Adds method to start the annotation editing: `PSPDFFragment#enterAnnotationEditingMode(Annotation annotation)`.
    * Adds listener for mode changes: `PSPDFAnnotationManager.OnAnnotationEditingModeChangeListener`.
    * Adds methods for registering that listener in `PSPDFFragment`: `registerAnnotationEditingModeChangeListener()` along with `unregister*` call.
    * Adds `AnnotationEditingController` provided by listener callbacks through which the annotation editing mode can be controlled programmatically.
* Adds an API for controlling the text selection mode:
    * Adds method to start the text selection mode: `PSPDFFragment#enterTextSelectionMode(int pageNumber, Range textRange)`.
    * Adds listeners for mode changes: `TextSelectionManager.OnTextSelectionModeChangeListener` and `TextSelection.OnTextSelectionChangeListener`.
    * Adds methods for registering those listeners in `PSPDFFragment`: `registerTextSelectionModeChangeListener()` and `registerTextSelectionChangeListener()` along with `unregister*` calls.
    * Adds `TextSelectionController` provided by listener callbacks through which the text selection mode can be controlled programmatically.
    * Deprecates `PSPDFFragment#setTextSelection()` (use `PSPDFFragment#enterTextSelectionMode()`) and `PSPDFFragment#clearTextSelection()` (use `PSPDFFragment#exitCurrentlyActiveMode()`).
* Adds `PSPDFFragment#exitCurrentlyActiveMode()` for exiting any currently active mode such as text selection, annotation creation and annotation editing.
* Adds an API for controlling the document editing mode:
    * Adds methods to start and exit document editing mode: `PSPDFThumbnailGrid#enterDocumentEditingMode()` and `PSPDFThumbnailGrid#exitDocumentEditingMode()`.
    * Adds listeners for mode changes: `PSPDFThumbnailGrid.OnDocumentEditingModeChangeListener` and `PSPDFThumbnailGrid.OnDocumentEditingPageSelectionChangeListener`.
    * Adds methods for registering those listeners in `PSPDFThumbnailGrid`: `registerDocumentEditingModeChangeListener()` and `registerDocumentEditingPageSelectionChangeListener()` along with `unregister*` calls.
    * Adds `DocumentEditingController` provided by listener callbacks through which the document editing mode can be controlled programmatically.
* Adds toolbars for special modes (all extend `ContextualToolbar`): `AnnotationCreationToolbar`, `AnnotationEditingToolbar`, `DocumentEditingToolbar` and `TextSelectionToolbar`.
* Adds `ToolbarCoordinatorLayout` used for animating views and handling animations and interactions between them. Toolbars can now be dragged to the sides of the screen (if enough room).
* Adds `ToolbarCoordinatorLayout#displayContextualToolbar(ContextualToolbar toolbar, boolean animate)` and `ToolbarCoordinatorLayout#removeContextualToolbar(boolean animate)` methods for displaying/removing contextual toolbars from the coordinator.
* Adds `ToolbarCoordinatorLayout.OnContextualToolbarLifecycleListener` that listens for toolbar lifecycle within the `ToolbarCoordinatorLayout` (preparing, displaying, removing), set through `PSPDFActivity#setOnContextualToolbarLifecycleListener(listener)` and removed through `PSPDFActivity#removeOnContextualToolbarLifecycleListener()`.
* Adds `ToolbarCoordinatorLayout.OnContextualToolbarMovementListener` that listens for toolbar movements within the `ToolbarCoordinatorLayout`, set through `PSPDFActivity#setOnContextualToolbarMovementListener(listener)` and removed through `PSPDFActivity#removeOnContextualToolbarMovementListener()`.
* Adds theme attributes for new toolbar views icons, set through: `<item name="pspdf__annotationCreationToolbarIconsStyle"/>`, `<item name="pspdf__annotationEditingToolbarIconsStyle"/>`, `<item name="pspdf__textSelectionToolbarIconsStyle"/>` and `<item name="pspdf__documentEditingToolbarIconsStyle"/>`.
* Adds `ContextualToolbarMenuItem` class which represents a single item in the `ContextualToolbar`.
* Adds `AnnotationToolbarFragmentExample` to the catalog app. It shows how to incorporate `ToolbarCoordinatorLayout` in `PSPDFFragment` within the custom activity to get toolbar animations.
* Adds support for Now-On-Tap feature introduced in Android Marshmallow. (#5294)
* Adds fullscreen version of Document Editor page creator dialog for small devices. (#5984)
* Adds `ScreenReaderExample` which showcases how to build a screen reader using PSPDFKit. (#6489)
* Adds highlighting of the currently active page to `PSPDFThumbnailGrid`. (#6601)
* Adds new `ThumbnailGridThemeConfiguration` styleable fields: `pspdf__itemLabelTextStyle` and `pspdf__itemLabelBackground`. (#6445)
* Adds a new option to control video playback via `PSPDFActivityConfiguration.Builder#videoPlaybackEnabled`. This is useful for environments with increased security requirements or to work around old Android devices that might be affected by the Stagefright vulnerability. (#6455)
* Adds `PSPDFProcessorTask(NewPage)` constructor for creating a new single-page document. (#6643)
* Adds `PSPDFProcessor#processDocumentAsync` override accepting `OutputStream` as processor output. (#6666)
* Adds an updated `Guide.pdf` to the catalog app. (#6483)
* Adds support for scrolling the page while performing a pinch-zoom gesture. (#4797)
* Adds ability to modify page media and crop box to `PSPDFProcessor` with `PSPDFProcessorTask#setPageBox` method. (#6746)
* Adds `getBox` to `PSPDFDocument` to allow retrieval of page media box and crop box. (#6775)
* Adds `PSPDFProcessorTask#scalePage` for scaling document pages. (#6655)
* Removes `AnnotationToolbarIconsConfiguration`.
* Removes `PSPDFFragment#clearAnnotationListeners()` and `PSPDFFragment#clearDrawableProviders()`. Each of the registered listeners or drawable providers should be removed using unregister calls. (#6571)
* Removes `#notifyAnnotationSelected`, `#notifyAnnotationDeselected`, and `#notifyAnnotationUpdated` from `PSPDFFragment`.
  If your code was using those methods, use `#setSelectedAnntaton`, `#clearSelectedAnnotations`, and `#notifyAnnotationHasChanged` respectively. (#6419)
* Refinements of the drawable provider API.
    * Increases visibility of `PSPDFDrawableProvider#notifyDrawablesChanged()` and `PSPDFDrawableProvider#notifyDrawablesChanged(int)` from `protected` to `public`.
    * Changes `PSPDFDrawableProvider#getDrawablesForPage` and `PSPDFDrawableProvider#getDrawablesForPageAsync` to use the upperbounded wildcard `? extends PSPDFDrawable`.
* `PSPDFThumbnailGrid` will now automatically scroll to the currently active page when being opened. (#5578)
* `PSPDFFragment` now correctly restores visible viewport and zoom scale after rotating the device. (#6531)
* Deprecates `Intent` extras `PSPDFYouTubeActivity#ARG_YOUTUBE_URL` and `PSPDFMediaDialog#ARG_URI`. Instead use `PSPDFYouTubeActivity#ARG_MEDIA_URI` and `PSPDFMediaDialog#ARG_MEDIA_URI` with `MediaUri` values. (#6621)
* Improves rendering performance for some complex documents. (#6686)
* Improves security in various critical areas of the framework via using checked memory functions.
* Correctly cancels document processing after unsubscribing from `Observable` returned by `PSPDFProcessor#processDocumentAsync`. (#6666)
* Fixes `ConcurrentModificationException` being thrown when registering/unregistering `DocumentListener`s in `PSPDFFragment`. (#6744)
* Fixes `ConcurrentModificationException` being thrown when registering/unregistering `OnVisibilityChangedListener`s in `OnVisibilityChangeListenerManager`. (#6866)
* Fixes possible multiple registrations of `OnVisibilityChangedListener` instances inside `OnVisibilityChangeListenerManager`. (#6800)
* Fixes crash in `PSPDFThumbnailBar` that appeared when opening certain documents. (#6830)
* Fixes an issue where sharing was canceled when rotating device. (#6062)
* Fixes a race condition that could cause a `NullPointerException` when calling methods on the `PSPDFFragment`. (#6644, #6650)
* Fixes an issue causing a `NullPointerException` when injecting a key event before the document has been loaded. (#6680)
* Fixes an issue where the scrolling is blocked when performed on a page while another page is in text selection mode. (#6807)
* Fixes issues while parsing many annotations on page and lifts limit of 500 annotations per page. (#6629)
* Fixes an issue where "light" weight font was selected in font substitution process instead of the missing "regular" weight font. (#6487)
* Fixes an issue where note annotations were not probably displayed when consecutively added within a short timeframe. (#6585)
* Fixes an issue where annotation wasn't deselected when tapping on document background or on a different page. (#5991)
* Fixes an issue where `PSPDFFragment#clearSelectedAnnotations` and `PSPDFFragment#getSelectedAnnotations` worked only on annotations on the current page. (#6592)

### 2.3.3 - 10 May 2016

* **Updates dependencies** - RxJava to `1.1.5`, RxAndroid to `1.2.0`.
* Adds new `PSPDFThumbnailGrid` UI.  (#6437)
* Adds improved support for Accessibility services and screen readers (#6495)
* Adds improved support for hardware keyboard shortcuts.
* Adds `keepPages` helper method to `PSPDFProcessorTask`.
* Adds factory method `DocumentSaveOptions#createDefaultsFromDocument` for creating default save options when processing documents with `PSPDFProcessor`. (#6412)
* Adds support for XML vector drawables on Android devices back to API 16. (#6207)
* Adds `PSPDFFragment#setInsets` and `PSPDFFragment#addInsets` that makes document insets configurable. (#6299)
* Removes `DocumentEditorThemeConfiguration`.  (#6437)
* Changes `DocumentSharingProvider` authority - in `AndroidManifest.xml` the provider authority must be `<application package>.pdf.share` not `com.pspdfkit.share`. (#6460)
* `PSPDFThumbnailGrid` page click listener is now registered via `PSPDFThumbnailGrid#setOnPageClickListener`.
* Changes `PSPDFThumbnailGrid` default background color to light gray.  (#6437)
* Improves exception message when calling `PSPDFFragment#setSelectedAnnotation` or `PSPDFFragment#setSelectedAnnotations` from a thread other than the main-thread. (#6339)
* Marks `PSPDFFragment#getSelectedAnnotations` return type as `@NonNull`. The method will now return an empty list if no annotations were selected. (#6339)
* `PSPDFFragment#setSelectedAnnotation` will no longer automatically change the current page, but rather a separate call to `PSPDFFragment#setPage` is now required. (#6339)
* Free text annotation is now brought to view when user starts typing. (#5347)
* Fixes possible crash when checking provider configuration if application contained no providers. (#6527)
* Fixes appearance of duplicate letters on some devices when editing Free Text annotations. (#6308)
* Fixes sharing issues on Samsung devices. Note that `DocumentSharingProvider` now MUST be exported. For security reasons, files may only be shared from an isolated directory. (#6462)
* Fixes an issue where fragment transactions were possibly not committed before the activity was destroyed, resulting in a missing fragment while activity recreation. (#6326)
* Fixes `DocumentEditor` visibility. (#6437)
* Fixes an issue where `PSPDFProcessor` would incorrectly throw a `PSPDFInvalidLicenseException` when processing certain documents. (#6409)
* Fixes an issue where search results could get hidden behind HUD. (#4190)
* Fixes an issue where document sharing dialog didn't use activity title as default document name when explicitly set in `PSPDFActivityConfiguration`. (#6426, Z#3575)
* Fixes an issue where text markup annotations couldn't be selected via `PSPDFFragment#setSelectedAnnotation`. (#6378)
* Fixes an issue where annotation couldn't be reselected from a previously selected note annotation. (#6476)
* Fixes a `NullPointerException` that was generated when launching a `PSPDFActivity` with an invalid license. (#6499)

### 2.3.2 - 26 Apr 2016

* Text search now also searches over annotation contents. (#5790)
* Adds support for search result highlighting customization. (#6206)
* `PSPDFThumbnailBar` now implements `DocumentListener` and has to be registered via `fragment.registerDocumentListener(thumbnailBar)`. (#6171)
* Adds `boolean` return type to `PSPDFDocument#saveIfModified` methods returning `true` if there were any changes to save. (#6317)
* `PSPDFKit#initialize` will now log a warning message if `android:largeHeap="true"` was not declared inside the app's `AndroidManifest.xml`. (#6157, #6321)
* Shows soft keyboard when opening annotation creator name dialog. (#6306)
* Deprecates methods `setBackgroundColor`, `setSearchResultBorderColor` and `setSearchResultBackgroundColor` in `DocumentThemeConfiguration#Builder`. Use `backgroundColor`, `searchResultBorderColor` and `searchResultBackgroundColor` instead. (#6206)
* `PSPDFThumbnailBar` now implements `OnAnnotationUpdatedListener` and has to be registered via `fragment.registerAnnotationUpdatedListener(thumbnailBar)`. (#6205)
* Adds `PSPDFThumbnailGrid.OnPageTappedListener` and `#setOnPageTappedListener(OnPageTappedListener)`. (#6172)
* Adds `PSPDFThumbnailBar.OnPageChangedListener` and `#setOnPageChangedListener(OnPageChangedListener)`. (#6171)
* Drops `EventBus` events `Events#OnAnnotationUpdated`, `Events#OnAnnotationSelected` and `Events#OnAnnotationDeselected`. (#6205)
    * Adds `PSPDFFragment#registerAnnotationSelectedListener` for listening to annotation selection.
    * Adds `PSPDFFragment#registerAnnotationDeselectedListener` for listening to annotation deselection.
    * Adds `PSPDFFragment#registerAnnotationUpdatedListener` for listening to annotation updates.
* Fixes an issue in certain documents where text selection contained more text that was actually selected. (#6213, Z#3424)
* Fixes an issue where selecting a note annotation on a recycled page would create an exception. (#6183, Z#3403)
* Fixes an issue where markup annotations couldn't be deselected by tapping on empty document area. (#6228)
* Fixes an issue where saving an ink annotation would throw a `NullPointerException` on older devices. (#6276, #6300)
* Fixes an issue where newly created note annotations where not correctly added to the document after a configuration change. (#6301)
* Fixes an issue where flattening and removing annotations at the same time caused problems. (#6344)

### 2.3.1 - 8 Apr 2016

* Adds support for exporting selected pages with the Document Editor. (#5987)
* Adds sharing support. (#5633)
    * Allows sharing selected text.
    * Allows sharing free-text and note annotation contents.
    * Allows sharing documents.
    * Adds `DocumentSharingProvider` which provides access to shared files for other applications.
* Adds `com.pspdfkit.utils.PDFUtils#createPDFRectUnion` for calculating the union of a list of PDF rects. (#6117)
* Adds catalog examples `CustomInlineSearchExample` and `CustomSearchUiExample`. (#6037, #6106)
* Adds option to set custom password, pdf version and permissions when saving documents. (#6014)
    * Adds `DocumentSavingOptions` parameter to `onSaveDocument()` call in `DocumentListener` for customization.
    * Adds `DocumentSavingOptions` parameter to `save` methods in `PSPDFDocument`.
    * Adds `getDefaultDocumentSavingOptions()` method to `PSPDFDocument` to retrieve document options representing the current document parameters.
    * Adds option to disable incremental saving via `DocumentSavingOptions`.
* Adds `maximumPreviewResultsPerDocument` and `maximumPreviewResultsTotal` to QueryOptions to allow limitation of preview results in full-text search. (#6047, #6017)
* Marks the return values of various `PSPDFKit#openDocument*` methods as `@NonNull`. (#6133)
* Fixes possible OutOfMemory exceptions when resizing `PSPDFThumbnailBar`. (#6083, Z#3358)
* Fixes a misleading build error message shown when dependency `com.android.support:cardview-v7` is missing. (#6073)
* Fixes a possible activity leak. (#6111, Z#3380)

### 2.3.0 - 31 Mar 2016

This release features the new Document Editor. This component allows users to access a whole host of page editing features, including new page creation, page duplication, reordering, rotation or deletion, as well as creating a new document from pages selected across multiple existing documents. If you like to add the Document Editor to your license, ping our sales team to receive a quote.

* Adds Document Editor. (#5719)
* Adds handling for document permission flags. (#5151)
* **Updates dependencies** - `com.android.support:recyclerview-v7:23.2.1`, `com.android.support:cardview-v7:23.2.1` and `com.android.support:design:23.2.1` have been added, updates RxJava to 1.1.1, RxAndroid to 1.1.0 and support library to `23.2.1`.
* New page drawable API. (#5766)
    * Adds `PSPDFDrawable` to draw arbitrary content on top of rendered pages.
    * Adds `PSPDFDrawableProvider` which can serve one or multiple drawables for a page.
    * Adds `PSPDFFragment#registerDrawableProvider`, `PSPDFFragment#unregisterDrawableProvider`, and `PSPDFFragment#clearDrawableProviders` for managing drawable providers.
* New text search API allowing to manually search a document and build custom search implementations. (#5463)
    * Adds `PSPDFTextSearch` for searching a document. Searching a document will return a list of `PSPDFSearchResult` objects.
    * Adds `PSPDFSearchResultHighlighter` for visually highlighting one or multiple search results using the new drawable API.
    * Search views (`PSPDFSearchViewInline` and `PSPDFSearchViewModular`) are now inside package `com.pspdfkit.ui.search`. This package also contains all other search UI related classes.
* Adds `PSPDFFragment#scrollTo` for scrolling to rects on a page. (#5597)
* Adds `PSPDFKitActivityConfiguration#setHudViewMode(int)` that makes showing/hiding HUD and system bars configurable. (#5566)
* Adds `PSPDFActivity#setHudViewMode(HudViewMode)` that makes showing/hiding HUD and system bars configurable at runtime. (#5566)
* Contextual action modes now behave more consistently. (#5414)
* Inline search now scrolls to search results even when they are outside of the current viewport. (#5560)
* `Annotation#getBoundingBox` now returns a copy of the internal rectangle to prevent inconsistent API behavior. (#5122)
* `PSPDFDocument#getPermissions` now returns a copy of the internal permissions set. (#5722)
* Adds a warning if text-to-speech service is unavailable. (#5552)
* Disables entering emojis into free text annotation. (#5840)
* Fixes an issue where ink paths got lost after zooming while drawing on multiple pages. (#5604)
* Fixes an issue where it was possible to create empty free text annotations. (#5468)
* Fixes an issue where selected annotation wasn't unselected after selecting text markup annotation. (#5523)
* Fixes an issue where scrolling while having text selected would crash the app. (#5653, Z#3160)
* Fixes an issue where scrolling by touching some tappable area causes it to highlight for a split second. (#5698)
* Fixes an issue where drawing dots with ink is not shown on the screen. (#5614)
* Fixes an issue where reading note annotations is not possible if annotation editing is disabled. (#5665)
* Fixes ink annotation drawing performance regression. (#5557)
* Fixes saving to files with non-ASCII filenames. (#5839)
* Fixes an issue where the page 2 places to the left of the last page would disappear when the last page becomes the current one. (#5694)
* Fixes an issue in the continuous scroll mode where setting the specific page would align left edge of the screen with the one of the page, instead of the middles. (#5745)
* Fixes an issue where annotation was displayed twice when moving or disappeared when unselected. (#5727)
* Fixes an issue when using `PSPDFThumbnailBar` in custom layouts. (#5763)
* Fixes an issue where `PSPDFActivity` wouldn't listen to events after loading new document. (#5785)
* Fixes an issue appearing randomly when changing orientation after highlighting text selection. (#5798)
* Fixes an issue where changing text size of a free text annotation to 1pt didn't work. (#5799)
* Fixes an issue where note annotation wasn't deselected after being deleted in note editor. (#5791)
* Fixes an issue when soft keyboard is not dismissed after quitting free text annotation editing. (#5843)
* Fixes an issue where it wasn't possible to pick grey color in note annotation editor. (#5794)
* Fixes an issue with leaking the activity context when initializing in short-lived activities. (#5879)
* Fixes an issue where documents where loaded multiple times when using a `DataProvider` as source. (#5869)
* Fixes an issue where editing annotations would produce flickering. (#5931)
* Fixes several out-of-memory errors caused by intensive bitmap allocations. (#5724)
* Fixes non-natural fling gestures after pinch-zooming into the document. (#4798)

### 2.2.1 - 26 Feb 2016

* Improves text highlighting by using a smart paragraph selection and not just the selected rect. (#5032)
* Adds support for reading documents from a `ContentProvider` serving data through a pipe (i.e. via `ParcelFileDescriptor.createPipe()`).
* Adds `com.pspdfkit.listeners.SimpleDocumentListener` which is an empty implementation of the `DocumentListener` interface. (#5512)
* Inline search now shows results starting from the current page. (#5579)
* Minor cosmetic tweaks in annotation list. (#5559)
* Fixes an issue with duplicated search results when searching from text selection. (#5553)
* Fixes an issue when selecting "Testcase_No_Annotations.pdf" example in PSPDFKit catalog's "Document switcher example" would crash the app.
* Fixes an issue where edge pages are never marked as current in continuous scroll mode because they never reach the middle of the screen. (#4964)
* Fixes an issue where certain characters (like parenthesis, brackets, etc.) could not be searched. (#5596, Z#3117)
* Fixes performance regression when editing large annotations. (#5618)

### 2.2.0 - 19 Feb 2016

* Enables annotation editing on multiple pages, as well as switching pages while editing. (#5346, #5289)
* Adds search menu option for selected text in the document. (#5298)
* Adds `PSPDFKit#openDocumentFromSource`. (Z#2985)
* Keeps parameter names of public API methods. (#5019)
* Displays page number indicator overlay after system bars are shown. (#5299)
* Note annotation editor can now be opened by double-tapping a selected annotation. (#5290)
* Free text annotation editor now differentiates between editing and writing modes. (#5296)
* `PSPDFFragment` can now be nested as a child fragment. (#5476)
* Allows scrolling while in drawing mode. (#5252, Z#2861)
* Fixes an issue where saving to ContentProviders which don't support appending would fail.
* Fixes an issue in the free text annotation editor where the soft-keyboard wasn't hidden after selection ended.
* Fixes an issue in the free text annotation editor where the soft-keyboard wasn't automatically opened in the landscape screen orientation. (#5503)
* Fixes an issue where text couldn't be pasted into the free text annotation editor. (#5123)
* Removes wrong `@Nullable` annotation from `PageRenderConfiguration.Builder#build`.
* Clicking text markup annotations won't start edit mode if annotation editing is disabled. (#5434)
* Fixes an issue where `AssetDataProvider` would return an invalid `Uri` via `#getUri`. (#5420)
* Fixes `IllegalStateException` crash appearing randomly in paginated layout. (#5361)
* Fixes animation transition from selected text to ActionMode. (#5378)
* Fixes an issue that could cause a crash when opening documents with large number of annotations in a page. (#5455)
* Fixes an issue where highlight annotations created from text selection action bar had undefined author field. (#5343)
* Fixes an issue where outline button was disabled even when annotation list was available. (#5287)
* Fixes an issue where `Bitmap` objects returned by `PSPDFDocument#renderPageToBitmap` would not have premultiplied alpha values. (#5412)
* Fixes an issue where immersive mode wasn't handled correctly while contextual action mode was active.
* Fixes `MediaController` displacement. (#5314)
* Fixes a non-fatal exception on Samsung devices failing to unparcel framework classes. (#5456)
* Fixes an issue where annotation editing button was clickable even when disabled visually. (#5288, #5464, Z#3035)
* Fixes an issue where drawing ink annotations outside of the page makes it larger than the page itself. (#5498)
* Fixes an issue that would cause exceptions when accessing `AnnotationProvider#getAnnotations` concurrently. (#5500)
* Fixes an issue when adding multiple annotations at the same time programmatically would cause `MissingBackpressureException` to be thrown. (#5233)

### 2.1.1 - 2 Feb 2016

* Added `PSPDFKit#openDocumentsFromSources`, `PSPDFActivity#showDocumentsFromSources` and `PSPDFFragment#newInstanceFromSources` to allow opening of compound PDF documents from multiple `DataProvider`s.
* Fixes preserving page sharpness when performing zoom actions on already zoomed page (#5302)
* Fixes an issue where a subscription license would stop working once expired. (#5327)
* Outline and search view are now dismissed when entering annotation editing mode. (#5326)
* Preserving page sharpness when performing zoom actions on already zoomed page (#5302).
* In `PSPDFSearchViewInline`, methods `getPrevIconColorFilter` and  `getNextIconColorFilter` are renamed to `getPrevIconColorTint` and `getNextIconColorTint` respectively.
* Adds closing back arrow to inline search. (#5291)

### 2.1.0 - 28 Jan 2016

* **IMPORTANT**: PSPDFActivity is now always based on `AppCompatActivity` and `PSPDFAppCompatActivity` class has been removed.
  This change has been made because new annotation editing UI elements need `support-v7` and `appcompat-v7` dependency.

* Indexed full text search is now supported via the `PSPDFLibrary` class.
  This feature needs to be enabled for your license. See https://pspdfkit.com/guides/android/current/features/indexed-full-text-search/ for details.
* Adds `PSPDFProcessor` to split/merge/flatten PDF documents.
* Adds support for incremental PDF saving:
   * Files will now be appended to instead of being fully rewritten on each save.
   * Added `ContentResolverDataProvider` incremental saving support for files opened via SAF or other content providers.
   * Added  `supportsAppending` method to `WritableDataProvider`. It should return `true` if the `DataProvider` supports appending to PDF file and then handle writing with `WrideMode.APPEND_TO_FILE` mode.
   * Due to encryption, password protected files cannot be incrementally written. They will always be fully rewritten and encrypted.
* `getUid()` method added to `PSPDFDocument`. UID represents a unique ID for a document and is derived from `getUid` call in `DataProvider` if one is used.
* Adds the list of annotations under the outline menu. (#5039)
* `getAllAnnotationsOfType` added to `AnnotationProvider` for easy retrieval of all annotations of certain types from the document.
* Adds `PSPDFActivity#showDocument(Context, DataProvider, PSPDFActivityConfiguration)` method overload (without `password` parameter).
* Adds `PSPDFActivity#getDocument` method which returns the currently loaded document. (#5260)
* Adds `PSPDFActivity#getPSPDFFragment()` which is a shorthand getter to retrieve the activities fragment.
* Adds `PSPDFFragment#getVisiblePDFRect(int page)` and `PSPDFFragment#getVisiblePages()` for accessing current visible rect on the page and fetching a list of visible pages. (#4086)
* Adds `PSPDFFragment#setScrollingEnabled(boolean enabled)` and `PSPDFFragment#setZoomingEnabled(boolean enabled)` that can disable zooming/scrolling in the document view. (#4931)
* Adds `DocumentListener#onDocumentZoomed(PSPDFDocument document, int pageNumber, float scaleFactor)` callback method for receiving page zoom changes. (#5017)
* Adds `PSPDFDocument#getUri` and `PSPDFDocument#getUriList` (for compound documents). (#5015)
* New text selection API (#5020)
   - Added typed `TextSelection` class which holds page number, text and rects of the current selection.
   - Current selection can be retrieved by calling `PSPDFFragment#getTextSelection`.
   - Selection can be set using `PSPDFFragment#setTextSelection`.
   - A simpler `TextSelectionListener` interface allows you to intercept all selection events (selection, changes, deselection), and to cancel them.
* Adds `PSPDFConfiguration#pagePadding` for customizing the padding between pages. (#5136)
* Replaces "Loading.." text while the page is being loaded with the progress bar (throbber). (#3640)
* In `PSPDFAppCompatActivity` and `PSPDFActivity`, the method `getPSPDFKitViews()` is renamed to `getPSPDFViews()`. (#5134)
* Copying selected text to clipboard displays a toast message as a feedback (#5253).
* Fixes transfer of document permissions and password to saved documents.
* Fixes a performance regression that caused jank while scrolling large documents. (#5071)
* Fixes an issue on certain devices when accessing external cache directory. (#5103)
* Fixes an issue caused by switching the active annotation editing tool for annotations not attached to a document. (#5061)
* Fixes setting of creation date on newly created annotations. (#5124)
* Fixes link annotation touch feedback being cleared on long-press. (#4891)

### 2.0.1 - 16 Dec 2015

* Greatly improved high-resolution detail rendering performance. (#4886, #4546)
* Fixes an issue where highlight annotations were getting darker each time a new one was added. (#4886)
* Improves browsing performance - UI more responsive during the rendering. (#4914, #4674)
* PDF parsing/rendering improvements for older, non-compliant versions. (#4903)
* Proper handling of orientation changes when having `android:configChanges="orientation|screenSize"` declared in manifest. (#4955)
* Fixes an issue where annotation is deselected if annotation editor was opened. (#4902)
* Fixes an issue where thumbnail bar was dismissed when dragging a finger over it. (#4896)
* Fixes transition into the highlighted search result while in zoom mode. (#4893)
* Fixes an issue where certain unicode (emoji) characters in the PDF could be converted into invalid UTF-8. (#4946)
* Don't deselect annotation immediately as page starts scrolling. (#4880)
* Fixes a crash where some theme items weren't resolved on API < 15. (#4941)
* `WriteableDataProvider` renamed to `WritableDataProvider`.
* Fixes search highlighting issues. (#4947)

### 2.0.0 - 7 Dec 2015

PSPDFKit 2 for Android is a major new release, adding support for creating/editing annotations. [See the announcement article for details](https://pspdfkit.com/blog/2015/pspdfkit-android-2-0/). The new minimum API level is 16 (Android 4.1 Jelly Bean).

* `PSPDFDocument` now has `getAnnotationProvider()` call which returns `AnnotationProvider` object that handles all Annotation related operations.
* `getPageAnnotations` call from `PSPDFDocument` has been moved to `AnnotationProvider` class.
* Implemented public constructors, getters and setters for newly supported annotation classes. Those are:
  * `HighlightAnnotation`
  * `StrikeOutAnnotation`
  * `SquigglyAnnotation`
  * `UnderlineAnnotation`
  * `InkAnnotation`
  * `FreeTextAnnotation`
  * `NoteAnnotation`
* Added Annotation editing user interface. Configuration is controlled by several classes in `PSPDFConfiguration`:
  * `AnnotationEditingConfiguration` can be used to enable/disable editing per annotation type or altogether.
  * `AnnotationToolbarThemeConfiguration` and connected theme classes can be used to customize editing toolbar icons.
* Added ability to disable editing for some annotation types. Currently supported editable annotation types are: `HIGHLIGHT`, `STRIKEOUT`, `SQUIGGLY`, `UNDERLINE`, `FREETEXT`, `INK` and `NOTE`.
* PSPDFKit can now display contents of Note annotations and allows editing of color, contents and icon.
* Added `WriteableDataProvider` which extends existing `DataProvider` and allows writing of edited PDF documents.
* `PSPDFDocument` now has `save` and `saveIfModified` methods for saving in synchronous and asynchronous way.
* Removed previously deprecated `setDisplayedPage` in `PSPDFFragment`. Use `setPage` instead. (#4210)
* Changed behaviour of `TextSelectionListener` - if `false` is returned in `onTextSelectionStarted`, `onTextSelectionEnded` will be called immediately after it.
* Previously deprecated `PSPDFFragment#getPageToScreenTransformation` now removed. Use `PSPDFFragment#getPageToViewTransformation` instead.
* In `PSPDFFragment`, renamed `convertPage[Rect/Point]ToView[Rect/Point]` to `convertPDF[Rect/Point]ToView[Rect/Point]`, `convertView[Rect/Point]ToPage[Rect/Point]` to `convertView[Rect/Point]ToPDF[Rect/Point]`
* `getModDate()` in `PSPDFDocumentMetadata` class was renamed to `getModificationDate()`.

### 1.5.0 - 28 Oct 2015

* Added `loadingProgressDrawable` PSPDFKitConfiguration option that enables configuration of the document loading throbber. Setting it to null will disable the throbber. (#4259)
* Removed `PSPDFThumbnailBar#setCurrentPage`. The thumbnail bar is now automatically tied to the document view using the internal event bus. (#4291)
* Stop spoken text when text selection ends. (#4391)
* Updated support library dependencies to version `23.1.0`.
* Fixed an issue which prevented to open documents with an empty set of PDF permissions. (#4336)
* Fixed an issue where improper text extraction was causing wrong search results. (#4187, #4189)
* Fixed an issue where `InputStreamDataProvider` would fail reading data from intermittent input streams. (#4275)
* Fixed an issue where link annotations and search results would be drawn as black blocks on some pre-Jellybean devices. (#4396)

### 1.4.1 - 5 Oct 2015

* Added `getTitle()` call to `DataProvider` interface that lets implementor specify a fallback title of the document if none is available in metdata.
* Significantly improved performance of loading documents from a `DataProvider`. (#4143)
* Fixed page rendering bug where wrong page could be momentarily rendered on some Android 5.x devices. (#4148)
* Fixed improper page transitions controlled by `boolean animate` argument in `setPage(int page, boolean animate)`. (#4112)
* Fixed locked first swipe after a zoom-out in `PER_PAGE` mode.
* Fixed an issue where main thread document access could cause jank when opening a document.

### 1.4.0 - 24 Sep 2015

* New catalog examples: `DocumentSwitcherExample`, `SplitDocumentExample`, `RandomDocumentReplacementExample`,
  `MemoryDataProviderExample`, and `CustomDataProviderExample`. (#3869)
* New `PSPDFActivity#getConfiguration` and `PSPDFAppCompatActivity#getConfiguration` allow to easily access the
  configuration object which was passed while launching the activity.
* Converted `DataProvider` to an interface for more flexibility. Previously, it was an abstract class.
* Moved `DataProvider` to `com.pspdfkit.document.providers` package.
* Added `MemoryDataProvider` to load documents directly from byte arrays.
* Added constants `DataProvider#NO_DATA_AVAILABLE` which has to be returned by a `DataProvider` if it fails to read
data inside `DataProvider#read`. (#3952)
* Added constant `DataProvider#FILE_SIZE_UNKNOWN` which has to be returned by the `DataProvider` if it fails to retrieve
  the correct data size.
* Changed search input field and password field to material design. `pspdf__backgroundColor`, `pspdf__borderColor` and `pspdf__borderWidth` properties have been removed. (#3693)
* Greatly improved data provider Javadoc documentation. (#3952)
* Updated dependencies: RxJava 1.0.14, Support libraries 23.0.1, RxAndroid 1.0.1.
* Fixed a problem where `DocumentListener` objects were removed when calling `PSPDFActivity#setDocument` or
  `PSPDFAppCompatActivity#setDocument`.
* Fixed a bug where padding of `PSPDFThumbnailGrid` was applied multiple times.
* Fixed obfuscation problems in the data provider API. (#3952)
* Updated dependencies - RxJava - `1.0.14`, Support libraries - `23.0.1`, RxAndroid - `1.0.1`.
* Added zoom calls to `PSPDFFragment` for zooming to a specified rect or to a specified zoom scale (`zoomTo()`). Also, the document can now be scaled by a given scale factor with `zoomBy()`. (#3704)
* Three new properties added to a configuration - `startZoomScale` that enables starting the document at a specified scale, `maxZoomScale` which controls the document zoom limit, and `zoomOutBounce` defining should the page have that bounce effect when zoomed out or not.
* `onDocumentLoaded()` callback is now invoked when both document is loaded and layout displaying the document is ready
* Fixed invoking multiple `onPageChanged()` calls. (#3845)
* Enabled hiding page labels and showing the page number instead, both while scrolling pages and in outline view. (#3927)
* Disabled bounce effect on pages in per-page mode, causing some unintuitive behavior. (#3691)
* Improved file opening performance when accessing DocumentProvider files.
* Fixed issues with opening files from SD Card on Android 6.0.

### 1.3.1 - 1 Sep 2015

* Page labels are now displayed in page number popup, outline view and grid view if applicable.
* Enabled retrieval of page labels via `getPageLabel()` and `getPageIndexForPageLabel()` methods on `PSPDFDocument` class.
* Added `getPermissions()` call on `PSPDFDocument` class to retrieve PDF document permissions.
* Replaced `PSPDFFragment#setDocumentListener` by `PSPDFFragment#registerDocumentListener` and `PSPDFFragment#unregisterDocumentListener`.
* `PSPDFActivity` and `PSPDFAppCompatActivity` now implement the `DocumentListener` interface and allow access to listener methods by overriding.
* `show()` and `hide()` calls on PSPDF views now properly update state of menu items in the Activity.
* `setOnVisibilityChangedListener` in PSPDF views has been replaced with `addOnVisibilityChangedListener` and `removeOnVisibilityChangedListener` calls.
* Fixed a possible memory leak when closing `PSPDFFragment` before document is loaded.
* Prevent crash when invalid start page is passed in `PSPDFActivityConfiguration`.
* Fixed some annotations sticking around on wrong pages after orientation change.
* Fixed issues with link annotation tap highlights.
* Multiple UI fixes and improvements for immersive mode.
* Improved fling on the pages while zoomed.
* Faster settle after a zoom-out.
* Fixed diagonal scroll invoking incorrect page fling in `FIT_TO_WIDTH` mode.
* Rendering high-resolution image at default zoom scale with insignificant performance hit (#2972).
* Fixed detail view clipping in paginated mode (#3696).
* Fixed slow vertical fling (#3692).
* Moving page opposite of the scroll direction in `CONTINUOUS` scroll mode is now limited by the border.

### 1.3.0 - 19 Aug 2015

* **IMPORTANT** Classes prefixed with `PSPDFKit` have been renamed to `PSPDF` for consistency and future-proofness (e.g. `PSPDFKitActivity` is now `PSPDFActivity`)
* PSPDFKit can now open content provider URIs directly without copying files to internal cache. `isOpenableUri` will now return `true` for all such URIs that can be opened.
* PSPDFCatalog example has been updated to demonstrate opening documents from document provider.
* Activities derived from `PSPDFKitActivity` or `PSPDFKitAppCompatActivity` can now load another PDF document using `setDocument` parent call.
* `Bookmark` class has been renamed to `OutlineElement` to better reflect it's function. `PSPDFDocument.getBookmarks()` was also renamed to `PSPDFDocument.getOutline()`.
* An error graphic will now appear in `PSPDFKitFragment` / `PSPDFKitActivity` / `PSPDFKitAppCompatActivity` when attempting to open an invalid file.
* `AssetDataProvider` was added to allow opening of PDF documents from APK assets directly. Use it with `open` methods that accept a `DataProvider` source.
* `ContentResolverDataProvider` was added to open arbitrary content provider URIs. It will be used automatically in all open methods.
* Add `PSPDFDocument#getCharIndexAt` to retrieve the index of a character on a page at the given page coordinates.
* Improved log messages when encountering incompatible device ABIs.
* Fixed a problem where the catalog app would restart itself after closing it when being launched using an external intent.
* Fixed a crash when using `PSPDFKitThumbnailBar` in custom activities. (#3420)
* Fixed a crash due to inconsistent state in `PSPDFKitSearchView` (#1695)
* Various performance and stability improvements to the PDF rendering backend.
* Added Finnish, Slovenian, Czech and Greek localization.
* `Loading...` text display colors are now properly inverted when `invertColors` configuration parameter is set.
* Added new annotation type classes: `FreeTextAnnotation`, `UnderlineAnnotation`, `SquigglyAnnotation`, `StrikeoutAnnotation`, `HighlightAnnotation` and `InkAnnotation`
* Disabled disk cache by default - for simple text document this means a significant performance boost.

### 1.2.3 - 6 Jul 2015

* Fixed corrupt PDFs crashing the library.
* Fixed a crash bug caused by swiping before the document was fully initialized.
* Added `NoteAnnotation` class to represent note annotations in the document.
* `Annotation` object now exposes contents and rich text contents of each annotation.
* Documents now expose `getAnnotations(page)` call which returns annotations on the page.
    * Unknown annotations will be returned as `UnknownAnnotation` object with proper type.
* Added LeakCanary support. (#3241)
* Expose `com.pspdfkit.ui.PSPDFKitFragment.getPageToScreenTransformation`. (#3195)
* Fixed bug causing stack overflow when exiting text selection mode. (#3284)
* In-memory caching of rendered pages is now noticeably faster
* Added `FragmentExample` and `CustomFragmentActivity`. (#3338)

### 1.2.2 - 23 Jun 2015

* Added support for `Named` action type in link annotations.
* Added `PSPDFKitActivityConfiguration#layout(int)`. (#3075)
* Added `CustomLayoutExample` to catalog app. (#3075)
* Exposed menu action ids for action bar menu customization:
   * `com.pspdfkit.ui.PSPDFKitActivity#MENU_OPTION_THUMBNAIL_GRID`
   * `com.pspdfkit.ui.PSPDFKitActivity#MENU_OPTION_SEARCH`
   * `com.pspdfkit.ui.PSPDFKitActivity#MENU_OPTION_OUTLINE`
* Fixed page not switching properly on small scroll in `PER_PAGE` scroll mode. (#2905)
* Fixed multi-line search. (#2993)
* Exposed `startSearch()` calls in `PSPDFKitSearchViewModular` and `PSPDFKitSearchViewInline`. (#2971)
* Quick switching between menu items now works correctly. (#3157)
* Modular search improved - selected result animated and border coloring added.
* Optimized performance on ARMv7 devices.

### 1.2.1 - 6 Jun 2015

* Add a new advanced catalog example showing customization and other features.
* Notify users for missing dependencies. (#3047)
* Automatically hide keyboard when browsing through the list of search results. (#2978)
* Exposed custom intent data to be added when launching activities. (#3073)

### 1.2.0 - 1 Jun 2015

* Theming support - all PSPDFKit views are now customized via themes. Existing appearance configuration in `PSPDFKitActivityConfiguration` and related have been moved to theme attributes. See `CUSTOMIZATION.html` for more information.
* Text selection is now implemented and allows users to copy and listen to selected text.
* Text selection listeners are now implemented.
* Media framework with PSPDFKit extensions for Gallery, offline videos and Youtube videos is now implemented.
* Implemented scroll direction lock for easier reading of content in columns.
* Fixed memory caching issues which could lead to a OOM crash.
* Added inline search (search as action view) option.
* `getPageTextRect` has been changed into `getPageTextRects` that returns multiple rects if the range requires them.
* Added more than 20 new localizations.
* Added `getPage` and `setPage(int)` calls to `PSPDFKitActivity`, `PSPDFKitAppCompatActivity` and `PSPDFKitFragment`.
* `setDisplayedPage(int)` deprecated, use `setPage(int)` instead.
* Added page numbers to table of contents.
* A bucket full of bug fixes.

### 1.1.1 - 17 Apr 2015

* Custom Activity extended from either `PSPDFKitActivity` or `PSPDFKitAppCompatActivity` can now be used by setting classname with `activityClass()` in `PSPDFKitActivityConfiguration` for easier customization.
* `getPSPDFKitViews()` method was added to Activity classes to make access to PSPDFKit views easier when extending the activity.
* Added `getBookmarks()` call to `PSPDFDocument` which retrieves PDF bookmarks. (Table of Contents)
* Fixed `PSPDFKitFragment` wrongly expecting a `Parcelable` `DataSource`.
* Improvements to fit to width and zooming code.
* Improved look of page grid display on smaller devices.
* Fixed an issue where `setDisplayedPage` call on `PSPDFFragment` didn't work before layout.
* Fixed severe performance degradation on some high-resolution devices like Samsung Note 4.
* Fixed accidentally obfuscated listener interfaces.

### 1.1.0 - 3 Apr 2015

* Page view may now be fit to width by using `fitMode` setting in `PSPDFKitConfiguration`.
* PDF documents can now be loaded from a custom source with `DataProvider` class.
* Added `DocumentListener` which allows handling page loading events and page tap events.
* Flinging pages in `PER_PAGE` scrolling mode now always flings a single page.
* Fixed issue where entered password was lost when changing orientation.
* Fixed issue where current page was being changed when changing orientation while using a Fragment.
* Zoomed view rendering is now significantly faster.
* RxJava and support library dependency versions updated to `1.0.8` and `22.0.0` respectively.

### 1.0.4 - 11 Mar 2015

*  Fixed an issue where zoomed view was larger than maximum allowed texture size on some devices.

### 1.0.3 - 9 Mar 2015

* Added password parameter to openDocument Activity API to allow for opening password protected documents.
* Added user password prompt when attempting to open password-protected PDF without passed password.
* Minor bugfixes.

### 1.0.2 - 4 Mar 2015

* Minor documentation and bug fixes.

### 1.0.1 - 3 Mar 2015

* Minor documentation and bug fixes.

### 1.0.0 - 27 Feb 2015

* Fast and responsive PDF viewer.
* Annotation display.
* Support for PDF links.
* Display document outline.
* Display thumbnail bar and thumbnail grid.
* Support for document search.
* Support for rendering into bitmaps.
