## Newest Release

### 9.2.2 - 18 Feb 2020

#### PSPDFKitUI

* Fixes an issue where the scrollable thumbnail bar didn't update a page image when annotations were added, changed, or deleted on a page. (#23146)
* Fixes an issue where we could assert in `[PSPDFDocumentViewTouchHandler presentationContext]` when the view controller is dismissed while a tap is handled in the same runloop. (#23183)

#### PSPDFKit

* Fixes an issue where Helvetica-Bold wasn't displayed correctly. (#22664)
* Fixes an issue where form field elements would not be fillable even if their backing form field was not readonly. (#21061)
* Fixes an issue where some PDF JavaScript calculations may not work correctly. (#23043)
* Fixes an issue where the mailDoc and similar JavaScript functions may not parse their arguments correctly. (#23257)
* Fixes empty text form fields not rendering their background color. (#23263)

#### Examples

* Adds a PSPDFCatalog example illustrating how to disable digital signatures modification and only allow adding ink signatures. (#23165)

## Previous Releases

### 9.2.1 - 29 Jan 2020

#### PSPDFKitUI

* API: The `PSPDFOutlineCell` subclassing hook has been renamed from `outlineIntentLeftOffset` to `outlineIndentLeftOffset`. (#23085)
* Adds accessibility labels for the back and forward buttons, used for the action stack navigation stack. (#23047)
* Improves performance for displaying the outline view controller as popover. (#23085)
* Implicit animations in the `PSPDFOutlineViewController` are now suppressed for initializing cells. (#23085)
* Works around an issue where a popover shown in an input accessory view might have a wrong arrow position on devices with a bottom safe area inset. (#21803)
* Fixes a crash that could occur when applying view state with the curl page transition. (#23068)
* Fixes an issue that could trigger an assertion if the annotation list controller was dismissed before annotations fully load. (#23109)
* Fixes an issue where automatic page mode would incorrectly default to double page mode when used in split screen on an iPad in landscape. (#21706)
* Fixes an issue where bookmark icon on scrollable thumbnail bar was rendered semi-transparent on iOS 13. (#22947, Z#16992)
* Fixes an issue where the cropped image from the image editor was not the same size as the size that was displayed due to a rounding error. (#23022)
* Fixes an issue where the image editor didn't show the up-to-date size of the resulting image in the title after changing the size. (#23022)
* Fixes an issue where user interface was allowed hide after a tabbed bar started dragging, causing an irrecoverable 'No Document Set' screen without a navigation bar. (#21707)
* Fixes an issue with the image cropping interface which caused the cropped area to be slightly offset than intended. (#23004)
* Fixes the custom stamp preview not being visible. (#23061)

#### PSPDFKit

* Fixes `-[PSPDFAnnotationSet initWithAnnotations:copyAnnotations:]` not normalizing bounding boxes like its deprecated variant did. (#23061)

### 9.2.0 - 21 Jan 2020

_See the [announcement post](https://pspdfkit.com/blog/2020/pspdfkit-ios-9-2/) and [migration guide](https://pspdfkit.com/guides/ios/current/migration-guides/pspdfkit-92-migration-guide/) for this release._

#### PSPDFKitUI

* API: The `color` property of `PSPDFColorButton` is now correctly marked as optional/nullable. (#22695)
* API: Removes support for 3rd-party styluses. (#22628)
* Deprecates `PSPDFImageQualityHigh`, replacing it with `PSPDFImageQualityBest`. (#22763)
* Adds Dark Mode support to the notes and comments screen (`PSPDFNoteAnnotationViewController`). (#21333)
* Adds a high quality option to the image picker (`PSPDFImageQualityHigher`). (#22763)
* Adds support for Page Up / Page Down keys to go to the previous/next page. (#22415)
* Adds support for the Select All menu command on Mac Catalyst. (#22685)
* Improves `PSPDFAnnotationGridViewController` so it shows more annotations when the view is larger (wider than 700 points). (#21423)
* Improves logic around the image picker to no longer require the `NSPhotoLibraryUsageDescription` permission in your app's `Info.plist`. (#21778)
* Improves performance and smoothness of animations in `PSPDFAnnotationTableViewController` when annotation updates occur. (#22831)
* Improves some error alert titles. (#22757)
* Improves the ordering of the key commands exposed by `PSPDFNavigationController` so their order in the discoverability overlay matches the reading order of the bar buttons on screen. (#22635)
* Improves the page selection logic to pick the most recently interacted page when switching from landscape to portrait in page curl mode. (#20452)
* Improves the stamp annotation creation process by reducing the copying of annotations when creating them via the saved annotations picker or the stamps picker user interface. (#22666)
* Improves the styling of the accessory view used in the `PSPDFChoiceFormEditorViewController`. (#19936)
* Changes the approximate image size for `PSPDFImageQualityMedium` from 1024 × 768 to 1600 × 1200 because the previous size was very close to `PSPDFImageQualityLow`. (#22763)
* Changes the behavior of the popover presenting `PSPDFChoiceFormEditorViewController` to allow dismissing the controller on tapping outside of it. (#22852)
* Changes the hardware keyboard command to select the top/bottom item in a list from command up/down arrow to option up/down arrow in order to match standard Mac behavior. (#22683)
* Floating keyboards now no longer trigger keyboard avoidance actions on `PSPDFAvoidingScrollView` subclasses apart from free-text annotation avoidance. (#22436)
* Improve contrast, especially in Dark Mode, of some tinted UI elements such as text in the outline and icons in the annotation list. (#22197)
* Makes the background in the image editor use a translucent color, to see the cut off part of the image. (#22914)
* Synchronizes the default `borderEffectIntensity` for cloudy borders with other PSPDFKit platforms. The default intensity when switching to cloudy borders via the PSPDFKit UI is now `2` instead of `3`. (#22611)
* The image quality picker of `PSPDFImagePickerController` is now enabled by default. Set its `allowedImageQualities` to `PSPDFImageQualityBest` to disable this. (#22763)
* The thumbnail grid now reloads in a more efficient way when bookmarks are changed while it is displayed. (#22687)
* Using the keyboard shortcut to select all text or annotations on Mac Catalyst no longer shows the selection menu automatically. (#22651)
* `PSPDFBrightnessManager` has a new mode to disable the idle timer completely. (#22802)
* Fixes an issue where `-[PSPDFPageView annotationViewForAnnotation:]` might have returned the wrong value, and improves the documentation of this method. (#22578)
* Fixes an issue where `PSPDFNavigationController` would pass the wrong item in the delegate callback `navigationBar:shouldPopItem:` when going back using a hardware keyboard. (#22635)
* Fixes an issue where changing pages would not work on the first and last pages on documents with a right page binding in the curl transition. (#22668)
* Fixes an issue where ink annotations drawn using Apple Pencil would create a temporary copy when moved while still in edit mode. (#21833)
* Fixes an issue where ink annotations with customized blend mode would flicker when drawing, erasing or zooming. (#21187, Z#16604)
* Fixes an issue where the `PSPDFTabbedBar`'s add document and overview buttons could have clear backgrounds. (#21725)
* Fixes an issue where the image in the image editor might be shown partially behind the navigation bar. It is now centered inside the safe area without being occluded. (#22914)
* Fixes an issue where the popover presented in the `PSPDFTabbedViewController` with list of open documents was not dismissed when the button presenting it was hidden. (#22799)
* Fixes an issue where the scrubber bar would have the wrong page marker set when reacting to a new document being set on the `PSPDFViewController`. (#22739)
* Fixes the annotation list not updating when annotations change while the list is visible. (#22789)

#### PSPDFKit

* API: Changes the localized string key `Redact` to be for the redaction annotation type instead of the word “Redact”, which is no longer translated by PSPDFKit. In other words, the key `Redact` was removed and then the key `Redaction` was changed to `Redact` to match the PDF specification. The best way to get this localized string key is to use the constant `PSPDFAnnotationStringRedaction`. (#21243)
* API: Changes the localized string key for the file annotation type from `File` to `FileAttachment` to match the PDF specification. The best way to get this localized string key is to use the constant `PSPDFAnnotationStringFile`. (#21243)
* API: Changes the localized string key for the free text annotation type to only `FreeText`. The duplicate entry with the key `Text` is now used for note annotations to match the PDF specification. The best way to get this localized string key is to use the constant `PSPDFAnnotationStringFreeText`. (#21243)
* API: Changes the localized string key for the note annotation type from `Note` to `Text` to match the PDF specification. The best way to get this localized string key is to use the constant `PSPDFAnnotationStringNote`. (#21243)
* API: Changes the parameter type of the `PSPDFDefaultAnnotationStyleManager` methods `defaultColorPresetsForKey:` and `defaultBorderPresetsForKey:` from `String`/`NSString` to `AnnotationStateVariantID`/`PSPDFAnnotationStateVariantID`. (#22769)
* Adds support for incrementally saving encrypted documents. (#22722)
* Adds support for the JavaScript function 'doc.gotoNamedDest'. (#18957)
* Improves complex script text rendering. (#22573)
* Improves error handling for `-[PSPDFFileAnnotationProvider saveAnnotationsWithOptions:error:]`. (#14335)
* Improves image stamp quality and reduces PDF size growth by avoiding unnecessary image re-encoding. (#22828, #20325)
* Improves license check error message to be more user friendly. (#12904)
* Improves user-facing descriptions of the types of annotations by considering variants. (#21243)
* Improve compatibility with macOS 10.15 Preview for annotation notes in the sidebar. (#22791)
* Removes the localized strings entry with the key `Squiggle`, which was not used. The localized text for the squiggly annotation type has changed to ‘Squiggle’ using the key `Squiggly` as before. The best way to get this localized string key is to use the constant `PSPDFAnnotationStringSquiggly`. (#22861)
* Uses modern `NSFontDescriptor` enums on macOS for better Swift bindings. (#22678)
* Fixes a problem where encrypted documents could not be digitally signed correctly. (#22722)
* Fixes a problem where some PDF pages may not be rendered correctly. (#22767)
* Fixes an issue that caused a blank page after flattening annotations on a certain document. (#22279)
* Fixes an issue where characters weren't escaped correctly when exporting XFDF. (#22844)
* Fixes an issue where free-text annotations were not rendered properly on selection when rendered with filter render options. (#20512)
* Fixes an issue where multiple form elements that are related to the same form field could not be targeted as a group in JavaScript actions, as described by the PDF Reference. The form elements can still be addressed individually by appending `.x` to the (fully qualified) name of the form field, where x is the index of the form element in the `annotations` property of the `PSPDFFormField`. (#22755)
* Fixes an issue where popup annotations were positioned incorrectly. (#22730)
* Fixes an issue where text is not displayed in small free-text annotations. (#22514)
* Fixes an issue where the file size optimization algorithm didn't run. (#22809)
* Fixes an issue where the outline was overridden if set, before property was accessed. (#22678)
* Fixes an issue where toggling eraser on a page with temporary rotation rendered ink annotations in a regressed state. (#22434)
* Fixes an issue which led to bookmarks not getting updated when importing InstantJSON. (#22198)
* Fixes an issue with creating a Submit Form action from JSON without action flags. (#22784)
* Fixes an issue with form calculations if one of the form fields contained multiple form elements. (#22675)

#### Instant

* Improves the responsiveness of moving and scaling image annotations by avoiding unnecessary work. (#22578)
* Fixes a deadlock that could occur when changes were accumulated while a sync was already in progress. (#22703)
* Fixes an issue where stamps created on the iOS device would immediately vanish when deselected, and never synced. (#19742)
* Fixes an issue where shape annotations would grow temporarily when another shape annotation was drawn immediately afterwards. (#20236)

#### Examples

* Renamed `PSCAddingButtonExample.m` to PSCAddingCustomViewsExample.m and improved the example which now demonstrates how to add overlay views that stay aligned with PDF content. (#21704)
* Fixes the close button in the document view not always working in the Split View Controller Sidebar example. (#21278)

### 9.1.1 - 12 Dec 2019

PSPDFKit now requires and is built with Xcode 11.3 (11C29).

#### PSPDFKitUI

* Right clicking on Mac Catalyst now selects text or images automatically. (#22626)
* The image selection context menu now offers a Save option for Mac Catalyst. (#22626)
* Fixes a crash that would occur on some iPad devices when the app was backgrounded while the annotation tool inspector popover was visible. (#22472)
* Fixes an issue where the image selection was not always visible. (#22626)
* Fixes an issue where the keyboard shortcut items for free text annotations were not correctly updated when toggling the accessory view. (#22512)

#### PSPDFKit

* Improves font selection and prefers fonts already in the document in more cases. (#22530)
* Fixes a race condition in `PSPDFAESCryptoDataProvider` that could result in app termination when Multithreaded Rendering was enabled. (#20011)
* Fixes an issue where a form field element appearance stream was regenerated accidentally. (#21618)
* Fixes an issue where flattened note annotations at the borders of pages would not be rendered correctly. (#22353)
* Fixes an issue where symlinks where not properly resolved for the `documentsDirectoryURL` in `-[PSPDFLibraryFileSystemDataSource -initWithLibrary:documentsDirectoryURL:documentHandler:]`. (#22518)

#### Examples

* Adds a Catalog example that shows how to customize the buttons that appear on the free text accessory view. (#22506)
* Adds the ability to load Instant documents from servers protected with HTTP Basic Authentication. (#18960)
* Improves the list of examples in the Catalog app by making titles and descriptions multi-line. (#22621)

### 9.1.0 - 3 Dec 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-ios-9-1/)._

#### PSPDFKitUI

* API: Adds `-[PSPDFConfiguration allowWindowTitleChange]` to control window title changes in Mac Catalyst. (#22167)
* API: `-[PSPDFPageView showMenuForAnnotations:targetRect:allowPopovers:animated:]` has been deprecated in favor of `showMenuForAnnotations:targetRect:contextMenuOption:animated:`. (#22303)
* API: `-[PSPDFPageView showMenuIfSelectedAnimated:allowPopovers:]` has been deprecated in favor of `showMenuWithOption:animated:`. (#22303)
* API: Changes the type of the `standardAppearance` and `compactAppearance` properties on `PSPDFScrubberBar` from `UIBarAppearance` to `UIToolbarAppearance` to be more consistent and specific. (#22479)
* Adds support for selecting ranges of pages in the Document Editor UI by dragging with two fingers. This can be disabled by subclassing `PSPDFDocumentEditorViewController` and overriding `collectionView:shouldBeginMultipleSelectionInteractionAtIndexPath:` to return false. (#22536)
* Adds a new keyboard shortcut (Command + option + G) to jump to a page. (#22291)
* Adds a subclassing hook to customize document saving when the app is saved for the various autosave reason (backgrounding, terminating, ...). (#22077)
* Improves conflict resolution handling after file deletion by automatically removing deleted documents from built-in view controllers when the documents don't have any unsaved changes and are not currently being displayed. (#22025)
* Improves page rendering when a zoomed window is resized. (#21836)
* Improves smart thumbnail size calculation to show more thumbnails on larger screens. This is especially beneficial with Mac Catalyst. (#21424)
* Improves the layout of the color presets in the annotation inspector on larger devices. (#21777)
* Note annotations can now be moved faster on iPad and Mac Catalyst. The detail view animation is now instant. (#22303)
* The delegate methods on `PSPDFSpeechController` are now always called on the main thread. (#22301)
* The security part of the document info view is now shown as a separate item in the segmented control. See `PSPDFDocumentInfoOptionSecurity` to add or remove this new item. (#21462)
* When context menus are enabled, selecting a note annotation will now present the `PSPDFNoteAnnotationViewController`. (#22303)
* Fixes an issue that could prevent the annotation list to be dismissed while searching. (#21895)
* Fixes an issue where `-[PSPDFResizableView outerKnobOfType:]` would return nil for the last knob type. (#22302)
* Fixes an issue where deleting selected annotations with the delete key didn't work. (#22099)
* Fixes an issue where the keyboard shortcut items for free text annotations were not correctly updated when toggling the accessory view. (#22512)

#### PSPDFKit

* API: Changed `PSPDFFreeTextAnnotationView` `textViewForEditing` from a property to a method, which changes Swift usage. (#21989)
* API: Deprecates `-attachBinaryInstantJSONAttachmentFromDataProvider:mimeType:error:` and replaces it with `-attachBinaryInstantJSONAttachmentFromDataProvider:error:`, omitting the `mimeType`. (#17813)
* API: `-[PSPDFCache imageForRequest:imageSizeMatching:]` now has an error parameter. (#21836)
* API: `-[PSPDFCacheInfo cacheInfoForRequest:]` now has an error parameter. (#21836)
* API: `-[PSPDFRenderTask initWithRequest:]` now has an error parameter. (#21836)
* API: Deprecates the `PSPDFAnnotationProviderRefreshing` protocol. `PSPDFContainerAnnotationProvider` now conforms to this protocol, which means that PSPDFKit handles refreshing internally. If you are implementing the refreshing protocol, please contact us to discuss your requirements. (#21885)
* Adds support for Image Documents with transparency. (#18907)
* Adds support for copying ink signatures to the clipboard. (#21608)
* Adds support for input file lists (`.xcfilelist`) to `strip-framework.sh` to simplify adding the dSYMs. (#22151)
* Adds support for redaction annotations to Instant JSON. (#21389)
* Adds support for setting temporary rotations using `setRotationOffset` when using custom annotation providers that are subclasses of `PSPDFContainerAnnotationProvider`. (#21885)
* Adds the ability to initialize `PSPDFImageDocument` with any data provider. (#21140)
* Improves NSSecureCoding support for various classes. (#20696)
* Improves handling when other apps installed on the system declare new types (UTIs) for standard filename extensions like `.pdf` and `.jpg`. (#22418)
* Improves memory usage while searching document with a lot of annotations. (#22367)
* Improves the performance of the redaction component so that big documents are redacted quicker. (#22102)
* Improves the rendering of annotations with dashed borders. (#10216)
* PSPDFKit for Mac Catalyst no longer uses a separate AppKit bundle, fixing issues with App Store Connect. (#21606)
* Rendering complex annotation appearance streams no longer blocks accessing the annotation object on a different thread. (#21836)
* State restoration for `PSPDFViewController` and related classes now support secure coding. (#22125)
* Updates HarfBuzz to version 2.6.2. (#21686)
* Fixes ISO8601 timezone support in Instant JSON. (#21148)
* Fixes a crash related to multi-threading and font loading. (#22387)
* Fixes a rare situation where setting form field flags may cause a deadlock. (#19942)
* Fixes a regression that caused certain link annotations to not work. (#21709)
* Fixes an issue where a deadlock could occur after executing a PDF action or JavaScript. (#22201)
* Fixes an issue where annotation additional actions may not be deserialized correctly. (#21983)
* Fixes an issue where annotations were updated too often after executing a PDF action or JavaScript. (#22201)
* Fixes an issue where deleting or moving pages from a PDF did not update the outline. (#21620, #22048)
* Fixes an issue where some filled form fields may not show their content correctly. (#22100)
* Fixes an issue where symlinks where not properly resolved for the `documentsDirectoryURL` in `-[PSPDFLibraryFileSystemDataSource -initWithLibrary:documentsDirectoryURL:documentHandler:]`. (#22518)
* Fixes an issue where text after signing had incorrect characters after looking at it in another viewer. (#20930)
* Fixes an issue where text entered in certain form fields was rendered garbled. (#21700)
* Fixes an issue where the redaction tool may not work correctly in some cases when selecting text. (#22486)
* Fixes widget annotation rotation property persistence when coming from Instant JSON. (#21552, #21621)

#### Instant

* Reduces network traffic when loading additional layers of the same document. (#21787)
* Fixes an issue where purging the local storage of a `PSPDFInstantClient` instance would have it hang on to its existing document descriptors in an unusable state. (#21935)

#### Examples

* Adds Catalog example that shows how to add copyright notices to documents when sharing. (#21693)
* Adds a PSPDFCatalog example that combines a custom annotation provider with setting temporary page rotations. (#21885)
* Adds a PSPDFCatalog example that shows how to customize the buttons that appear on the free text accessory view. (#22506)
* Improves structure of the Catalog project by grouping examples by category and sorting them alphabetically. (#22392)
* Fixes the document not being presented automatically after scanning a QR code in the PSPDFKit Instant example in PSPDFCatalog. (#21979)

### 9.0.3 - 14 Nov 2019

PSPDFKit now requires and is built with Xcode 11.2.1 (11B500).

#### PSPDFKitUI

* API: The scrubber bar now uses gestures for tap detection to block system gestures such as dismissing a modal presentation with a swipe. This lead to the removal of the `-[PSPDFScrubberBar processTouch:]` subclassing hook, which was not being called even before this change. (#22336)
* Adds new API to `PSPDFProgressLabelView` to customize the colors of the text and progress indicator. (#21717)
* Adds support for system highlight colors for text selection on Mac Catalyst. (#21994)
* Improves error handling when a document is selected in the redaction view controller. (#22169)
* Changes the color of the placeholder text and progress view in `PSPDFThumbnailViewController` to use a `secondaryLabelColor` on iOS 13 and `grayColor` for older versions. (#21717)
* Scrolling via Space/Shift-Space keyboard now correctly scrolls the active viewport on continuous scrolling, and advances pages for per-page scrolling or page curl transition. (#22118)
* The inspector is now enabled when multiple annotations of the same type are selected. (#22195)
* Fixes an issue where VoiceOver would still read out the search progression `PSPDFSearchViewController` even after searching the document did complete. (Z#15979)
* Fixes an issue where `PSPDFNoteAnnotationViewController` didn't correctly set the appearance of its navigation bar and toolbar. (#22000)
* Fixes an issue where annotation toolbar and inspector didn't support certain appearance customizations. (#22113)
* Fixes an issue where documents wouldn't be shared correctly on Mac Catalyst. (#21821)
* Fixes an issue where note annotations could not be deleted on Mac Catalyst. (#22083)
* Fixes an issue where rotating the device in page curl mode could lead to an assertion failure. (Z#16000)
* Fixes an issue where tapping on a search result would not necessarily scroll the search result on screen in continuous scrolling mode. (#22011)
* Fixes an issue where not all available options on a given `PSPDFChoiceFormEditorViewController` would be selectable when being presented as a popover on iOS 13. (#22247)

#### PSPDFKit

* Increases image size limits. (#22029)
* Fixes an issue if a TrueType font collection has more than 32 fonts. (#22148)
* Fixes an issue where an annotation copied from another document was rendered blurry. (#20070)
* Fixes an issue where certain high resolution images weren't rendered. (#22322)
* Fixes an issue where creating an annotation using `+[PSPDFAnnotation annotationFromInstantJSON:documentProvider:error:]` would lead to a crash if the destination document had multiple document providers. (#22207)
* Fixes an issue where form repairs were done too eagerly. (#20786)
* Fixes an issue where pages would be rendered with incorrect background colors when setting `PSPDFRenderOptions.backgroundFill` for any render type. (#21800)
* Fixes an issue where selecting the Open In option when sharing pages out of a document would not work. (#22209)
* Fixes an issue where temporarily rotated annotations were saved incorrectly in `PSPDFAnnotationSaveModeEmbeddedWithExternalFileAsFallback` mode. (#22188)
* Fixes an issue where using a big size for the digital signature container may abort the digital signing process. (#22130)
* Fixes a crash that would occur while rendering a thumbnail for a page which does not have a valid size. (#22365)
* Fixes an issue where certificates with multi-value RDNs may not be parsed correctly. (#22221)

#### Examples

* Updates `CustomImagePickerControllerExample.swift` illustrating how to customize the `PSPDFImagePickerController`'s `allowedImageQualities`. (#22002)

### 9.0.2 - 21 Oct 2019

#### PSPDFKitUI

* Improves the annotation popover placement algorithm. (#21851)
* Sets the highlight text color of the labels in the search result cell to white to improve legibility. (#21964)
* Fixes an issue where changing the `compactAppearance` property of `PSPDFScrubberBar` had no effect. (#21927)
* Fixes an issue where customizing `UINavigationBar` via `UIAppearance` API had no effect in iOS 13. (#21837)
* Fixes an issue where saved annotations wouldn't be displayed on `PSPDFSavedAnnotationsViewController`. (#21761)

#### PSPDFKit

* Adds support for printing array structures from JavaScript code inside a PDF. (#19063)
* Fixes a rare deadlock when rendering certain documents. (#21856)
* Fixes a rendering error where the font `ArialMT` wasn't selected correctly. (#21744)
* Fixes an issue where `PSPDFKit.bundle`'s version number was incorrect on Mac Catalyst. (#21737)
* Fixes an issue where multiple simultaneous conflict resolution prompts could potentially trigger an internal assertion. (#21694)
* Fixes an issue where some Swift API, like `PSPDFKitGlobal.setLogHandler()`, were not accessible when using the CocoaPods integration. (#21846)
* Fixes a performance regression when rendering with an ICC based color space. (#21776)
* Fixes an issue where some properties of a widget annotation were not persisted when the document was saved. (#21546)

#### Instant

* Fixes a regression that would lead to excessive sync activity. (#21847)
* Fixes an issue where deleting the local storage for a layer could result in an assertion failure. The situation now fails gracefully. (#21880)
* Fixes an issue with the image cache where two layers of the same document would be displayed such that they appear to have identical annotations until after the first annotation update. (#21666)

#### Examples

* Adds a Catalog example illustrating how to customize the appearance of the navigation bar and annotation toolbar. (#21961)
* Adds a PSPDFCatalog example illustrating how to restore a document to its previously opened reading position. (#21904)
* Adds required entitlements to the Catalog example when running on macOS. (#21999)
* Fixes a crash that would occur when opening PSPDFCatalog on macOS. (#21738)

### 9.0.1 - 10 Oct 2019

PSPDFKit now requires and is built with Xcode 11.1 (11A1027).

#### PSPDFKitUI

* Adds new API `standardAppearance` and `compactAppearance` to style the `PSPDFToolbar` on iOS 13. (#21665)
* Adds `allowReorderingDocuments` on `PSPDFTabbedViewController` to support disabling reordering documents in the tabbed bar. (Z#15717)
* Fixes an issue on iOS 13 where menus would flicker and disappear if they were nested one level deep. This happened for changing properties of text markup annotations. (#21735)
* Fixes a crash when using the tab key on a hardware keyboard to navigate form fields on iOS 13. (#21613)
* Fixes an issue where sharing a document multiple times with custom page ranges would produce invalid documents. (#21080)
* Fixes an issue where the `PSPDFFlexibleToolbar` did not match the appearance of the given navigation bar or a toolbar on iOS 13. (#21665)
* Fixes an issue where the status HUD was not positioned correctly when a keyboard was visible. (#21636)
* Fixes an issue where the thumbnails border color was incorrect in Dark Mode in scrollable thumbnail mode. (#21642)
* Fixes a possible crash that would occur when exporting documents as images with flattened annotations. (#21739)
* Fixes an issue with certain configurations where documents may initially appear zoomed in. (#21625)

#### PSPDFKit

* Fixes an issue where documents using certain kind fonts (especially Chinese, Japanese, and Korean) would cause the app to crash. (#21626)
* Fixes secure coding of `PSPDFRenderOptions`. Before all properties would be encoded as nil or zero, which could lead to rendering pages with black backgrounds. (#21708)
* Fixes an issue where the z-index wasn't preserved when flattening annotations. (#21385)
* Fixes an issue where a digital signature applied to a certain kind of document may not show correctly in third party PDF readers. (#18943)
* Fixes an issue when using multi-threaded rendering. (#18582)
* Fixes a crash when using the processor on certain documents with very deep object hierarchies. (#21674)

#### Instant

* Fixes a possible crash when loading annotations failed in certain Instant documents. (#21617, Z#15606)
* Fixes an issue where removing the local storage for a document descriptor briefly after loading it could lead to a deadlock. (#21766)

### 9.0.0 - 19 Sep 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-ios-9/)._

PSPDFKit now requires and is built with Xcode 11.0.

This release features support for a new platform - Mac Catalyst. Be sure to check out our [Introducing PSPDFKit for Mac Catalyst](https://pspdfkit.com/blog/2019/pspdfkit-for-mac-catalyst/) blog post for more information.

Below is a summary of the API changes in this release. For a full list, with our suggested migration strategy for each API that has been changed or removed, please see the [migration guide](https://pspdfkit.com/guides/ios/current/migration-guides/pspdfkit-9-migration-guide/). The guide also provides migration steps for `xcframework` integration and the removal of `PSPDFKitSwift`.

* Removes all previously deprecated API. Please see our PSPDFKit 9 for iOS migration guide to learn about the appropriate migration strategy. (#20904)

#### PSPDFKitUI

* API: Changes `PSPDFStatusHUD` class methods and `PSPDFStatusHUDItem` push methods to take a window as parameter, as there now might be multiple status HUDs due to multi-window support on iOS 13. (#21429)
* API: `PSPDFFlexibleToolbarController` methods for showing/hiding toolbar now include an optional completion block. (#19807)
* API: Renames the `PSPDFConfiguration` properties `scrollOnTapPageEndEnabled`, `scrollOnTapPageEndAnimationEnabled`, and `scrollOnTapPageEndMargin` to `scrollOnEdgeTapEnabled`, `animateScrollOnEdgeTaps`, and `scrollOnEdgeTapMargin`. (#20923)
* API: The designated initializer for `PSPDFViewState` has been replaced in favor of `-[PSPDFViewState initWithPageIndex:viewPort:selectionState:selectedAnnotationNames:]`. (#20655)
* API: `PSPDFUsernameHelperWillDismissAlertNotification` has been replaced with `PSPDFUsernameHelperDidDismissViewNotification`. This is posted after the dismissal ends rather than before to work better with sheets on iOS 13 that can be dismissed by swiping down. (#20978)
* Removes `PSPDFPresentationShouldPopoverDismissBlockKey` because API provided by UIKit should be sufficient. (#20978)
* Removes `brightnessManager` property from `PSPDFBrightnessViewController` since brightness is now directly handled on the `UIScreen` instance. (#21495)
* Removes brightness related properties from `PSPDFBrightnessManager`. (#21495)
* Removes `interactiveReorderingGestureRecognizer` from `PSPDFTabbedBar` since the tabbed bar uses drag and drop for reordering now. (#20431)
* Removes support for using `UIWebView` in `PSPDFWebViewController`. (#19807)
* Adds `PSPDFDocumentInfoCoordinator.documentInfoViewController` to enable showing the document info UI in custom ways. (#19807)
* Adds `PSPDFPageView` methods for showing contextual menus: `showMenuForPoint:animated:` and `showAnnotationMenuAtPoint:animated:`. (#19807)
* Adds precise immediate text selection handling on Mac Catalyst. (#21012)
* Adds support for attaching a user activity to a tab dragged from the tabbed bar, to allow the system opening a new window scene on iOS 13. (#20431)
* Adds support for context menus to the annotation toolbar on iOS 13. (#21205)
* Adds support for dragging and dropping tabs across different `PSPDFTabbedViewController` instances. This can be enabled via `allowDraggingTabsToExternalTabbedBar` and `allowDroppingTabsFromExternalTabbedBar`. (#20431)
* Adds support for iOS 13 Dark Mode. (#20403)
* Adds support for the new Cut/Copy/Paste gestures from iOS 13. (#21293)
* Adds an option for rounded corners to the flexible toolbar and refines the default toolbar design. (#21206)
* Improves compatibility with iOS 13 sheet presentations, which can be dismissed by swiping downwards. (#20978)
* Improves logic to place the share activity view controller on the page when sharing an image. (#19807)
* Improves the annotation line-end selection UI in the annotation style controller. (#21535, #21542)
* Improves the annotation toolbar and document editor icon designs, so it's easier to distinguish them. (#21078)
* Improves toolbar selection and orientation transition animations. (#21206)
* Changes `PSPDFSignatureViewController` to always use a consistent aspect ratio for the signing area. Previously this was only the case on iPad. (#20978)
* Changes moving tabs in the tabbed bar to use drag and drop instead of interactive reordering. (#20431)
* Changes some view controllers to always use a form sheet presentation style by default: the signature view, the link annotation editing view, and the privacy access denied view shown from the new page view. (#20978)
* Changes the `PSPDFNewPageViewController` presented from the document editor to uses a standard form sheet rather than our custom half modal style (in compact widths). (#20978)
* Changes the minimum value of the brightness slider to 0.0 instead of 0.1 to match the range of `UIScreen.brightness`. (#21495)
* File Annotations can now be deleted via the default annotation menu. (#21293)
* Improved keyboard support: Command-Arrow Up/Down navigates to first/last page. (#20869)
* PSPDFUndoController canUndo/canRedo now always updates correctly, even if invoked via the undo manager directly. (#19807)
* Updates default values for text selection properties `textSelectionMode` and `shouldShowSelectionHandles` on Mac Catalyst and extends the documentation for `textSelectionShouldSnapToWord`. (#21012)
* Fixes an iOS 13 specific unsatisfiable constraint warning on `PSPDFAnnotationStyleViewController`. (#21196)
* Fixes an issue that caused the search UI to be misplaced when using the search button item action with a custom button. (#21409)
* Fixes an issue where selection of a page did not persist on reordering using drag and drop interaction in the Document Editor. (#21474)
* Fixes an issue where the accessibility label of a page was incorrect after reordering the page in the Document Editor. (#21474)
* Fixes editing free text annotations not always showing the keyboard when using multiple windows. (#21341)
* Fixes the `PSPDFDocumentSharingViewController` showing incorrect sharing options if the selected destination was set before the controller being presented. (#21410)

#### PSPDFKit

* API: `-[PSPDFDataProviding replaceWithDataSink:]` has been extended to include an error parameter `-[PSPDFDataProviding replaceWithDataSink:error:]`. (#14338)
* API: Renames the `PSPDFKit` global singleton to `PSPDFKitGlobal` to avoid conflicts with the `PSPDFKit` module name in Swift. (#21292)
* API: Swift-incompatible methods on `PSPDFProcessor` and delegate-based error and completion handling on `PSPDFProcessorDelegate` have been removed. (#21233, Z#15373)
* API: The `PSPDFProcessor` PDF generation API has been converted to class methods to better isolate it from the PDF processing operations. (#21000)
* API: The `PSPDFRenderOption` enumeration has been replaced with the `PSPDFRenderOptions` class that now properly supports `NSSecureCoding`. (#17342)
* API: The `shouldDeleteAnnotation` property on `PSPDFAnnotation` has been replaced with `isDeletable`. (#21293)
* API: `PSPDFAnnotationStyleManager` now uses `PSPDFStylePreset`, a new protocol, rather than `__kindof PSPDFModel*` to expose preset instances. (#21362)
* API: `PSPDFLineAnnotation.init(point1:point2:)` is no longer a failable initializer that produces an implicitly unwrapped optional. (#21194)
* API: The class property `isDeletable` on `PSPDFAnnotation` has been converted to a per-object property to include object flags. (#21293)
* Removes the rendering option to disable text anti-aliasing when using the non-native text rending option. (#21204)
* Removes the class property `isWritable` on `PSPDFAnnotation`. All implemented subclassed annotation and form types are writable. (#21293)
* Adds `NSSecureCoding` support to `PSPDFAnnotation` and its subclasses. (#12026)
* Adds `NSSecureCoding` support to `PSPDFColorPreset` and `PSPDFBorderStylePreset`. (#21362)
* Adds support for setting a user activity on `PSPDFDocument`. (#20431)
* Improves JPEG2000 with transparency support. (#20483)
* Improves filesystem checking to better handle external storage and file server support on iOS 13. (#21159)
* Improves font rendering and fixes several edge cases. (#20930)
* Improves handling and documentation of custom digital signature sizes. Now cases where the signature size exceeds the reserved size in a document will be informed correctly. (#21304)
* Improves the validation of Instant JSON payloads so that case differences in properties are tolerated. (#21145)
* Disables generating PDFs from URLs and HTML strings on Mac Catalyst. (#21000)
* Updates Botan to version 2.11.0. (#20549)
* Updates Duktape to version 2.4.0. (#20954)
* Fixes a bug in redaction rendering where the font size wasn't consistent. (#21088)
* Fixes an issue with transparent `strokeColor` in Instant JSON. (#21391)
* Fixes an issue when importing XFDF files in specific documents. (#21271)
* Fixes an issue where images with the lighten blend mode didn't get rendered correctly. (#20642)
* Fixes an issue where loading a document would fail if it contained JPEG2000 images not specifying a color space. (#21311)
* Fixes an issue where text after signing had incorrect characters after looking at it in another viewer. (#20930)
* Fixes an issue where the error object was not set in case of a failure in `-[PSPDFDataProviding replaceWithDataSink:error:]`. (#21116)
* Fixes an issue where using the document editor to merge a document with many pages would lead to an out-of-memory crash. (Z#15277)
* Fixes issues with transparent image stamp annotations. (#7646)
* Fixes issues with transparent images in XFDF. (#9221)
* Fixes some stability issues related to color space management. (#21529)
* Fixes some stability issues when fonts are loaded from a document. (#21042)
* Fixes some use cases where PDFs with JavaScript validation scripts may not work as expected. (#21291)

#### Examples

* Adds a PSPDFCatalog example illustrating how to show a `PSPDFViewController` in SwiftUI. (#20381)
* Adds an example illustrating how to always show dark user interface style on the annotation toolbar. (#20403)
* Adds multi-window support to PSPDFCatalog on iOS 13. (#20431)
* Adds support to drag and drop tabs in TabbedBarExample. (#20431)
* Changes the default appearance of the Catalog app to match Apple recommended styling. (#20211)
* Fixes an issue in the catalog `PSCDrawAnnotationsAsOverlayExample` where annotation were not overlaid appropriately. (#21276)

### 8.5.2 - 6 Sep 2019

#### PSPDFKitUI

* Adds a new property on `PSPDFConfiguration` called `allowRemovingDigitalSignatures` to control whether a digital signature can be removed or not. See `DisableRemovingDigitalSignatureExample` in PSPDFCatalog for more details. (#20586)
* Changes the designated initializer of `PSPDFSignedFormElementViewController` to the new added initializer `initWithSignatureFormElement:allowRemovingSignature:`. (#20686)
* Fixes an issue where a sharing action would be executed automatically if the first sharing configuration available has no options to pick from. (#20964)
* Fixes an issue where the existing configuration was not preserved while showing a new digitally signed document in a new controller. (#20686)

#### PSPDFKit

* Improves error reporting in `+[PSPDFAnnotation annotationFromInstantJSON:documentProvider:error:]` when the document was misconfigured. (#21177)
* Improves memory usage with complex documents. (#20970)
* Improves the stability of some PDF form operations. (#21032)
* Improves the validation of InstantJSON in some corner cases. (#20748)
* Fixes a problem where some dates may be incorrectly formatted as Sunday. (#20363)
* Fixes an issue with annotation hit testing that could result in taps being received by a link annotation that was underneath another link annotation. (#21055)
* Fixes an issue where link annotations with a nil border color and a valid dash array were not being rendered. (#20749)
* Fixes annotations being misplaced when reopening a document that loads annotations from an external file after `setRotationOffset:forPageAtIndex:` had been used to apply a temporary rotation when that document was saved. (#20976)
* Fixes annotations sometimes being blurry when reopening a document that loads annotations from an external file after `setRotationOffset:forPageAtIndex:` had been called before that document was saved. (#20976)
* Fixes annotations sometimes not being saved to an external file after only annotation updates happened and `setRotationOffset:forPageAtIndex:` was called before saving. (#20976)
* Fixes pasted rotated vector stamps being double rotated which resulted in clipping. (#20916)
* Fixes `-[PSPDFProcessorConfiguration drawOnAllCurrentPages:]` producing offset drawing when the page has a MediaBox with a non-zero origin. (#20797)
* Fixes the `drawingBlock` of `PSPDFFileAppearanceStreamGenerator` not automatically handling page rotation. (#20983)
* Fixes a possible crash in certain documents due to a null dereference in `isLinkedInAcroForms`. (#21121)

#### Instant

* Adds a migration to populate the `isFitting` flag for all pre-existing free text annotations when appropriate, preventing the clipping of text on other platforms. This is an extension of the earlier fix which only populated this flag when an annotation was changed again. (#20727)
* The `isFitting` property of free text annotations now properly reflects whether the text did fit on iOS. The text of such annotations will no longer be clipped in documents exported from PSPDFKit Server or in PSPDFKit for Web. (#20727)

#### Examples

* Fixes a crash that would occur when opening the Kiosk Grid example on iOS 13. (#20861)

### 8.5.1 - 8 Aug 2019

#### PSPDFKitUI

* Adds `-[PSPDFDocumentSharingViewController initWithDocuments:sharingConfigurations:]` and makes it the designated initializer. (#20842)
* Fixes an issue where annotations could not be moved in the annotation list when not all annotations were shown (typically when there were links). (#20822)
* Fixes an assertion when presenting certain table view controllers on iOS 13. (#20833)
* Fixes an assertion when using a custom variant for free text annotations. (#20823)
* Fixes the initially selected segment in `PSPDFDocumentSharingViewController` being ‘Share’ instead of the first one when custom configurations are used. (#20842)

#### PSPDFKit

* Adds `PSPDFDocumentSaveStrategyRewriteAndOptimizeFileSize` to enable file size optimizations when saving documents. (#20826)
* Improves performance when opening documents with many links. (#20786)
* Fixes an issue where rotating pages using the document editor would always reset the page binding setting to the left edge. (#20732)

#### Instant

* Prevents text clipping on other platforms when a free text annotation was created or updated on iOS such that all text is visible. (#20727)

#### Examples

* Fixes `PSCFormFillingExample` to properly respect specific input formats and validations of the form fields. (#20606)

### 8.5.0 - 31 Jul 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-ios-8-5/)._

PSPDFKit now requires and is built with Xcode 10.3 (10G8).

* Adds an optional JSON Podspec (`podspec.json`) that you can use by appending `.json` to your podspec link. Learn more in our [CocoaPods guide](https://pspdfkit.com/guides/ios/current/getting-started/using-cocoapods#use-json-podspec). (#20335)

#### PSPDFKitUI

* API: The `PSPDFDocumentInfoCoordinator`'s delegate property is now of type `PSPDFDocumentInfoCoordinatorDelegate`, which is a newly introduced protocol. (#20469)
* Deprecates `PSPDFSignatureViewController`’s `lines` property in favor of its `drawView.pointSequences`. (#20450)
* Adds the ability for users to change the order in which annotations are stacked on the page (the z-index) from either the annotation inspector or the annotation list. (#100)
* Adds the ability for users to change the document’s page binding in `PSPDFDocumentInfoViewController`. (#10603)
* Adds a unified color palette. This replaces the rainbow, modern, vintage, and monochrome color palettes in the default color set provided when creating and editing annotations. (#20212)
* Adds a `halfModalStyle` property to `PSPDFConfiguration` to allow the use of the annotation inspector without the card design introduced in PSPDFKit 8.4 for iOS. (#19944)
* Adds a `PSPDFDocumentInfoViewControllerDelegate` protocol to respond to changes from `PSPDFDocumentInfoViewController`. (#20510)
* Changes links to open in Safari by default, because we believe this provides a better user experience. This can be changed back to `SFSafariViewController` (the in-app browser) by setting `PSPDFConfiguration.linkAction` to `PSPDFLinkActionInlineBrowser`. (#20692)
* Disables natural drawing for ink annotations by default because it can sometimes produce artifacts at line ends. This can be changed back using `PSPDFConfiguration.naturalDrawingAnnotationEnabled`. (Z#14856)
* Reduces the minimum line width for ink annotations from 0.5 to 0.1 in the annotation inspector. (#20654)
* Fixes an issue that caused certain pages to fade from black on iOS 13 when they were moved on-screen. (#20513)
* Fixes an issue where the back button of a navigation controller did not work on iOS 13. (#20533)
* Fixes an issue where annotations could appear duplicated and flipped after the app goes into the background. (#18695)
* Fixes an issue where you could delete a non-editable note annotation. (#20419)
* Fixes an issue where text wouldn't be spoken if a device was in silent mode. (#20392)
* Fixes a floating scrubber bar layout issue by correctly ignoring the unsupported `scrubberBarType` values. (#20258)
* Fixes `PSPDFNavigationController`’s back external keyboard command taking precedence over text input. (Z#14834)
* Fixes navigating through forms using the tab key on external keyboards not working for multi-line text fields. (#20218)
* Fixes a rare issue where bookmark manager initialization could be triggered recursively and assert. (#20566)

#### PSPDFKit

* Adds API to change the order in which annotations are stacked on the page (the z-index). (#100)
* Adds support for rotating image stamp annotations. (#19692)
* Adds support for rotating vector stamp annotations. (#20345)
* Adds support for rendering emojis in free text annotations and forms. (#20629)
* Adds a `PSPDFObjectsTestIntersectionFractionKey` option for the document object finder, which can be used to filter out objects based on the fraction of their area intersecting with the target rectangle. (#20643)
* Adds support for preserving the Instant JSON id in the PDF. (#20572)
* Adds support for serializing and deserializing border properties of link annotations. (#20359)
* Add support for vertical alignment in single-line form fields when exporting or printing PDF files. (#19882)
* The `pageBinding` property setter of `PSPDFDocument` now saves the page binding into the document instead of just keeping it in memory. (#20327)
* Improves automatic repair of AcroForms when loading documents with a large number of annotations. (#19947)
* Updates Expat to version 2.2.7. (#20545)
* Updates libpng to version 1.6.37. (#19851)
* Updates openjpeg to version 2.3.1. (#20647)
* Fixes an issue reading media boxes. (#20592)
* Fixes a deadlock that could occur when performing concurrent equality checks on annotation objects. (#20688)
* Fixes calling `sizeToFit` on a free text annotation resizing the annotation incorrectly. (#20302, Z#14464)
* Fixes an issue where annotations could become rotated and distorted in certain documents. (#20267)
* Fixes the appearance stream of stamp annotations sometimes not being preserved when the annotation is rotated, which is needed to avoid distorting it. (#15898)
* Fixes an assertion when importing annotations outside the page range using XFDF. (#20424)
* Fixes page indices being incorrect after the first data provider when exporting Instant JSON from a document with multiple data providers. (#20343)
* Fixes a crash that would occur after applying an Instant JSON update to a document where the changes contained form field updates. (#20152)
* Fixes an issue where form fields with calculation order may not be flattened correctly by the processor. (#20434)
* Fixes an issue where some documents with dropdown fields may show an arrow when the document is flattened. (#9539)
* Fixes a problem where overriding the digital signature reserved size may corrupt the signature appearance. (#20496)
* Fixes an issue that may prevent documents with certain restrictions from being digitally signed. (#20741)
* Fixes an issue where a custom `dataSource` set on a `PSPDFSigner` object was overridden sometimes. (#20487)
* Fixes an issue where some documents signed with invisible signatures could not be validated correctly. (#20277)

#### Examples

* Adds a Swift counterpart to the example `PSCSaveAsPDFExample.m` called `SaveAsPDFExample.swift`. (#20672)

### 8.4.2 - 5 Jul 2019

#### PSPDFKitUI

* Adds the ability to cut or copy pages from the `PSPDFDocumentEditorViewController` and paste them into other applications. Pasting PDFs copied from other applications is now also supported. (#19960)
* Improves the documentation for sharing options related to printing and preset `PSPDFViewController` bar button items. (#18987)
* Fixes internal document references not being retained when cutting and pasting pages in `PSPDFDocumentEditorViewController`. These are now preserved so PDF GoTo Actions still work after saving. (#19470)
* Fixes an issue where annotation property changes from the inspector were not preserved when killing the app before exiting the annotation state. (#20232)
* Fixes images having a low resolution after being attached to form elements using the `buttonImportIcon` JavaScript API. Images will now be added at full resolution. (Z#14555)
* Fixes incorrect group spacing and cell layout issues on the sharing UI. (#18987)
* Fixes links and text field form elements showing a black border instead of no border when no color was set on the annotation and a non-zero border thickness was set. (#20449)

#### PSPDFKit

* Adds `-[PSPDFDocumentEditor rotationForPageAtIndex:]` to get the current rotation for a page of the document being edited. (#19960)
* Adds a property on `PSPDFBookmarkManager` to access the associated `PSPDFDocument` instance. (#20226)
* Improves the loading performance for complex documents with lots of link annotations. (#19399)
* `PSPDFBookmarksChangedNotification` is no longer posted when loading a document. (#18638)
* Fixes very occasional text rendering problems. (#20155)

#### Instant

* Fixes markup annotations not syncing reliably. (#20235)
* Fixes certain annotation types appearing rotated and distorted on rotated pages. (#20291)

#### Examples

* Adds a PSPDFCatalog example illustrating how to add a square annotation with cloudy borders button to the annotation toolbar. (#20400)
* Fixes Swift and Objective-C language detection of the examples on iOS 11. (#19953, Z#13392)

### 8.4.1 - 20 Jun 2019

#### PSPDFKitUI

* Showing the annotation toolbar programmatically is now blocked by default when saving is not possible. (#16816)
* Fixes an issue where top-level entries in `PSPDFOutlineViewController` couldn’t be searched. (#20004)
* Fixes an issue where pages could go blank if an element on them had first responder status while they were moved offscreen. (#19638)
* Fixes an issue where `PSPDFTabbedViewController`’s tabbed bar would not appear when the view controller was embedded in a container controller. (#19414, #19826, Z#13332)
* Fixes an issue where setting the `barTintColor` on `PSPDFScrubberBar` did not have any effect. (#20169)
* Fixes an issue where setting the `tintColor` of the page grabber did not have any effect. (#20081)
* Fixes an issue where a shape annotation with a large line thickness could disappear when resized to small sizes. (#20022)
* Fixes an issue where the document could be modified during saving in the document editor. (#19830)
* Fixes an issue where the user could open the inspector of a non-editable annotation by selecting an editable one first. (#20283)
* Fixes the undo behavior for free text annotation rotation and resizing so that the annotation does not get distorted. (#20133)
* Fixes an issue that caused the document view to be loaded prematurely during `PSPDFViewController` initialization. (#20255)
* Fixes an issue with the annotation inspector where a `UITableView` separator was incorrectly shown under the last item. (#20109)

#### PSPDFKit

* Adds support for importing and exporting free text callout annotations using JSON. (#18202)
* Improves loading performance for documents with complex outlines. (#20279)
* Improves rendering of text with non-Latin characters. (#20189)
* Fixes an issue where image stamp annotations rotated by third-party software may lose their appearance. (#20165)
* Fixes video metadata lookup for YouTube videos. (#20180)

#### Examples

* Adds a PSPDFCatalog example illustrating how to persist `PSPDFSettingsViewController` settings in `NSUserDefaults`. (#20210)
* Improves `DrawOnPagesExample.swift` to show how to draw multiple watermarks with different attributes. (#18922)

### 8.4.0 - 30 May 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-ios-8-4/)._

#### PSPDFKitUI

* API: Deprecates `-[PSPDFDigitalSignatureCoordinator presentSignedDocument:showingPageIndex:]` in favor of `presentSignedDocument:showingPageIndex:withPresentationContext:` to make presenting the signed document easier. (Z#13752)
* Deprecates `PSPDFUserInterfaceView.thumbnailBarInsets`, which did not do anything. (#19771)
* Removes the `optionsView` property from `PSPDFNoteAnnotationViewController(SubclassingHooks)` because returning any other value would lead to a crash. (#19841)
* Removes the declarations of `-configureZoomView:forSpreadIndex:`, and `-configureScrollView:` from `PSPDFDocumentViewLayout(Subclassing)`. These methods were unimplemented, and not used internally. Calling them would have lead to an “unrecognized selector” crash. (#19841)
* Removes the unimplemented `PSPDFPageLabelView(SubclassingHooks)` category. (#19841)
* Removes the unimplemented subclassing hooks `-cancelDrawingAnimated:` and `-doneDrawingAnimated:` from `PSPDFAnnotationStateManager`. (#19841)
* Removes the unimplemented category `PSPDFSavedAnnotationsViewController(SubclassingHooks)`. Calling the method it declared would have lead to an “unrecognized selector” crash. (#19841)
* Adds a new look and feel for the scrubber bar, which now appears to be floating in the user interface. To revert to the old design, set `thumbnailBarMode` to `PSPDFThumbnailBarModeDockedScrubberBar` in `PSPDFConfiguration`. (#16110)
* Adds an improved, modern visual design for the annotation inspector. (#19053)
* Adds support for rotating free text annotations to any angle. (#15900)
* Adds the ability to customize the eraser thickness in the UI which can be changed in the Annotation Inspector invoked from the Annotation Toolbar. (#18918)
* Adds the ability to apply redactions in a new file, to not overwrite the current document, from the UI. (#19247)
* Adds support for showing a blend mode menu item to the markup annotations selection menu. (#19985)
* Adds a subclassing hook, `-[PSPDFUserInterfaceView updatePageLabelFrameAnimated:]`, for changing the page label position. (#19217)
* Adds `<PSPDFCommonWebView>`. This protocol documents the API requirements for the object returned by the `webView` property of `PSPDFWebViewController`. It acts as an abstraction of the common API of `UIWebView` and `WKWebView`, as used by our view controller. (#19841)
* Adds biometric properties on `PSPDFDrawView`: `pointSequences`, `pressureList`, `timePoints`, `touchRadii` and `inputMethod`. Calling `clear` on `PSPDFDrawView` now also clears any currently collected biometric data. (#19800)
* Marks the inherited initializer `-[PSPDFMenuItem initWithTitle:action:]` as unavailable because it cannot be used with this class. (#19841)
* Moves `PSPDFGalleryItem(Protected)` into a separate header file, and turned it into a class continuation. For subclassing `PSPDFGalleryItem`, please use `#import <PSPDFKitUI/PSPDFGalleryItem+Subclassing.h>` now. (#19841)
* Promotes the declaration of `-updatePageLabel` in `PSPDFThumbnailGridViewCell(SubclassingHooks)` up the class hierarchy to `PSPDFPageCell`. (#19841)
* Single-page documents now have the thumbnail bar hidden by default. A new property in `PSPDFConfiguration` (`hideThumbnailBarForSinglePageDocuments`) lets you configure this behavior. (#16110)
* Fixes a crash that could occur in `-[PSPDFThumbnailFlowLayout ensureLayoutAttributesForItemsUpTo:]` when viewing page thumbnails in double page mode. (#19984)
* Fixes a regression introduced in PSPDFKit 8.3.2 where the header in the thumbnail layout would be misplaced after rotation, and the sticky header would not stick. (Z#13392)
* Fixes an issue where an annotation’s `fillColor` returned `UIColor.clearColor` instead of `nil` for a clear color. (#19896)
* Fixes an issue where annotations drawn in dark mode had a black fill color instead of a clear fill color. (#19831)
* Fixes an issue where erasing or undoing an ink annotation changed the alpha of the remainder of the drawn ink annotation on page. (#19900)

#### PSPDFKit

* API: Replaces the `rotation` property setter of `PSPDFFreeTextAnnotation` with `setRotation:updateBoundingBox:`, which is declared in the `PSPDFRotatable` protocol. (#19983)
* Adds Welsh localization. (#19923)
* Adds a new `PSPDFPKCS7` class for representing a digital signature PKCS7 container. (#19916)
* Adds a way to construct an instance of a `PSPDFPrivateKey` from `NSData` that represents a valid private key in either PKCS1 or PKCS8 encoding format. (#19916)
* Adds embedSignatureInFormElement: API to the `PSPDFSigner`, an API that embeds a digital signature in a document already prepared to contain a digital signature. (#19479)
* Adds `hashDocumentProviderRange:` API to the `PSPDFDocumentProvider`, an API that returns a hashed part of a document provider, indicated by a particular byte range. Useful for creating digital signatures. (#19479)
* Adds `prepareFormElementToBeSigned:` API to the `PSPDFSigner`, an API that reserves space in a signature form field so that it can be signed later. (#19479)
* Adds the ability to set a custom signature watermark. (#19438)
* Adds support for the `Doc.documentFileName` JavaScript API. (#18775)
* Makes enums use `NS_CLOSED_ENUM` so Swift callers don’t need to handle unknown cases. (#18679)
* Improves rendering of text in appearance streams. (#19877)
* Improves the performance of some JavaScript calculation scripts. (#19234)
* Embedded goto actions will go to the specified page instead of going to the first page of the embedded target document. (#10963)
* Improves automatic repair of AcroForms to support more document errors. (#19834)
* Renames `PSPDFSignatureInputMethod` enum to `PSPDFDrawInputMethod`. The previous values have been deprecated. (#19800)
* Updates Expat to version 2.2.6. (#19868)
* Updates the Botan library version to 2.10.0. (#19767)
* Fixes a bug which caused the font picker to scroll to the selected item with a jerky animation. (#19108)
* Fixes an issue creating form fields where some fields could not be retrieved later by their original keys. (#19945)
* Fixes an issue where JavaScript API `doc.getField()` could get into a state where it wasn’t possible to retrieve newly created form fields. (#20027)
* Fixes an issue where rotating a page after deleting a note annotation could lead to an assertion failure. (#19853)
* Fixes an issue where the line start and end of a polyline annotation didn’t honor a clear fill color. (#20097)

#### Examples

* Adds a PSPDFCatalog example illustrating how to add a Blend Mode menu item to the highlight annotation selection menu. (#19985)
* Adds a PSPDFCatalog example illustrating how to customize the annotation inspector to set blend mode for vector stamp annotations. (#19979)
* Adds a PSPDFCatalog example illustrating how to access the biometric data of an ink signature from a `-[PSPDFSignatureViewController drawView]`. (#19800)
* Adds a PSPDFCatalog example illustrating how to access the biometric properties after digitally signing a document. (#19800)
* Adds an Objective-C version of the “Document progress” example where a PDF file is downloaded and displayed using the `PSPDFViewController`. (#19897)
* `PSCCustomAnnotationProviderExample` now properly uses the `PSPDFContainerAnnotationProvider`. (#20024)

### 8.3.2 - 15 May 2019

#### PSPDFKitUI

* Adds `PSPDFTextSelectionMenuActionCopy`, `PSPDFTextSelectionMenuActionMarkup`, `PSPDFTextSelectionMenuActionRedact`, `PSPDFTextSelectionMenuActionCreateLink`, and `PSPDFTextSelectionMenuActionAnnotationCreation` to `PSPDFTextSelectionMenuAction` to allow for easier customization of allowed menu actions via `PSPDFConfiguration.allowedMenuActions`. (#19817)
* Fixes a crash within `PSPDFDocumentEditorViewController` that would happen when calling `-[PSPDFViewController reloadData]` after setting a new document with a lower page count than the current one. (#19839)
* Fixes an issue where the annotation state of the `PSPDFAnnotationStateManager` was set to an empty string when no annotation tool was selected. (#19911)
* Fixes an issue where the thumbnails view would automatically scroll for certain documents when the `stickyHeaderEnabled` property of `PSPDFThumbnailFlowLayout` was set to `YES`. (#19437)
* Fixes the alignment of the indexing status cell in `PSPDFDocumentPickerController`. (#19673)

#### PSPDFKit

* Adds undo support for link annotations. (#19702)
* Adds a `variant` property on `PSPDFAnnotation`. (#19903)
* Fixes an issue where the redaction text may not be correctly added in some scenarios. (#19703)
* Fixes an issue with file conflict resolution which caused incorrect handling of cases where an opened document is renamed, moved, or deleted when the app is backgrounded. (#19782)

### 8.3.1 - 2 May 2019

#### PSPDFKitUI

* Fixes an issue where the comments indicator icon was misplaced for rotated stamp annotations. (#19652)
* Fixes an issue where the flexible toolbar shadow was misplaced during the animation when moving the toolbar to a new position. (#19709)
* Fixes an issue where the username alert's done button would remain disabled when programmatically presenting the alert with an empty suggested name. (#19695)
* Fixes an issue with button alignment on the scrubber bar toolbar on devices with bottom safe area insets. (#16254)
* Fixes an issue with the page mode not updating when rotating the device while editing a free text annotation. (#19160)

#### PSPDFKit

* Improves performance when attempting to load custom fonts on demand. (#19662, #19661)
* Improves performance when executing JavaScript actions on form fields with complex interdependent validation logic. (#19661)
* Improves results from `PSPDFLibrary` when the `PSPDFLibraryMatchExactPhrasesOnly` option is specified, and a tokenizer other than the default porter tokenizer is used. (#19685)
* Prevents a potential multithreading violation when the sqlite backend is accessed while a low memory notification is broadcasted. (#19750)
* Fixes an issue where the `PSPDFRenderDrawBlock` set using `-[PSPDFProcessorConfiguration drawOnAllCurrentPages:]` was overridden by the `PSPDFRenderDrawBlock` of a `PSPDFDocument`'s render options. (#19541)
* Fixes an issue where an annotation would not be up-to-date when using the processor while using the external file annotation save mode. (#19498)
* Fixes an issue where readonly checkboxes may not be rendered correctly. (#19506)
* Fixes a crash that could occur when deleting annotations using the menu interface. (#18061)
* Fixes a potential crash when processing large documents under low-memory conditions. (#19768)

#### Examples

* Updates `PSCPredefinedEmailBodyExample` to use the new Document Sharing API. (#19725)
* Fixes a crash on the Custom Sharing Options example in Catalog. (#19711)

### 8.3.0 - 23 Apr 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/pspdfkit-ios-8-3/)._

PSPDFKit now requires and is built with Xcode 10.2.1 (10E1001).

#### PSPDFKitUI

* API: Changes the methods on `PSPDFSaveViewControllerDelegate` to better handle saving files, especially for supporting showing the system file picker. Replaces `-saveViewControllerDidEnd:shouldSave:` with `-saveViewController:saveFileToURL:completionHandler:`, `-saveViewController:didFinishWithURL:`, and `-saveViewControllerDidCancel:`; and replaces `-saveViewControllerShouldSave:toPath:error:` with `-saveViewController:saveFileToURL:completionHandler:`. (#16997)
* API: Deprecates the document editor specific API (`initWithDocumentEditorConfiguration:` and `documentEditorConfiguration`) and removes `PSPDFDocumentEditorConfigurationConfigurable` conformance on `PSPDFSaveViewController`. (#16997)
* API: Makes the `searchString` parameter in `-[PSPDFDocumentPickerControllerDelegate documentPickerController:didSelectDocument:pageIndex:searchString:]` correctly declared as nullable. (#19040)
* API: Removes `-[PSPDFViewModePresenter updateInsetsForTopOverlapHeight:]` with dropping support for iOS 10. (#19445)
* Deprecates `-[PSPDFAnnotationPresenting didShowPageView:]` in favor of `-[PSPDFAnnotationPresenting willShowPageView:]` to better communicate the timing of this method call. (#19333)
* Deprecates `-[PSPDFSignatureViewController keepLandscapeAspectRatio]`, since showing the signature drawing area in a landscape format is the default. (#18772)
* Deprecates the `PSPDFPresentationPersistentCloseButtonKey` presentation option and `PSPDFNavigationController`’s `persistentCloseButtonMode` and `persistentCloseButton` properties. Persistent close buttons are no longer used by PSPDFKit itself and support for them will be removed in a future release. (#18867)
* Adds new UI for link annotation creation and editing via `PSPDFLinkAnnotationEditingContainerViewController`, `PSPDFPageLinkAnnotationEditingViewController`, and `PSPDFWebsiteLinkAnnotationEditingViewController`. (#18909)
* Adds the link annotation tool to the default Annotation Toolbar configurations. (#18909)
* Adds support for showing link annotations with multiple `rects`, which happens if the link spans multiple lines. (#18909)
* Adds a rotation knob to `PSPDFResizableView` that can be used to change the angle of standard stamps and custom text stamps. Its appearance and position can be customized using the new `rotationKnob` property and `centerPointForRotationKnobInFrame:` method on `PSPDFResizableView`, and the `PSPDFKnobTypeRotation` enum value. (#15901)
* Adds external keyboard commands to navigate lists (table views) using arrow keys. (#7824)
* Adds external keyboard commands for navigation bar and toolbar buttons when using `PSPDFNavigationController`. (#7824)
* Adds external keyboard commands to switch tab in the document info view. (#7824)
* Adds a configuration option to enable adding multiple bookmarks to the same page in the UI. (#16371)
* Adds `shouldResetAppearanceModeWhenViewDisappears` property on `PSPDFViewController`, which allows you to disable the appearance mode reset on `-[PSPDFViewController viewWillDisappear:]`. (#19562)
* Improves Digital Signature signing experience by presenting the Annotation Toolbar only when it is required. (#18192)
* Improves signature drawing area sizing to make sure no drawings are cut off when rotating the device or resizing the app. (#18772)
* Improves the behavior of form fields with autosizing fonts. (#19303)
* Improves the internal annotation username state handling which caused issues when programmatically dismissing the annotation username alert. (#18905)
* Improves the performance and reliability of the Document Editor. (#19349)
* Changes how `editableAnnotationTypes` are set on `PSPDFAnnotationTableViewController` when presented by PSPDFKit. Links will be filtered out by default. (#18909)
* Changing the type of markup annotations now sets the style of the changed annotation to the last used style for the new type. (#19255)
* Enables link annotation editing by default, by adding them to `PSPDFConfiguration.editableAnnotationTypes`. (#18909)
* Improve the logic to properly inset the Annotation Toolbar when the page grabber is used. (#18685)
* The timing of `-[PSPDFDocumentViewControllerDelegate willBeginDisplayingSpreadView:forSpreadAtIndex:]` as well as `PSPDFDocumentViewControllerWillBeginDisplayingNotification` have been changed to be called _before_ displaying the spread, as expected from their names. (#19333)
* `PSPDFDocumentPickerController` now handles sandbox restrictions on the Simulator more accurately when trying to delete documents. (#19040)
* Fixes a memory leak when interacting with sound annotations. (#19295)
* Fixes an issue that could result in blank pages after scrolling or device rotation. (#18848, #18682)
* Fixes an issue where `PSPDFThumbnailViewController` and `PSPDFDocumentEditorViewController` would hold outdated references for documents when calling `-[PSPDFViewController reloadData]`, resulting in inconsistencies. (#19363)
* Fixes an issue where `PSPDFViewController` was not completely reloading after changing the document’s `pageBinding` property. (#19199)
* Fixes an issue where a document could not be deleted in `PSPDFDocumentPickerController`. (#19458)
* Fixes an issue where changing the appearance mode would not be reflected on the currently visible pages in page curl mode unless the page was changed. (#18869, Z#12698)
* Fixes an issue where editing permissions was not allowed if the document was opened with user (open) password. (#19188)
* Fixes an issue where keyboard was not dismissed in favor of a form field popover. (#6523)
* Fixes an issue where the activity indicator on a page was still visible even after the completion of the rendering. (#19529)
* Fixes an issue where the Annotation Toolbar was not correctly placed when using the page grabber and the app was resized. (#19334)
* Fixes an issue where the wrong preset would be selected in the Annotation Inspector if multiple presets with the same color combination where present. (#19623)
* Fixes an issue which caused the line annotation’s start and end color to not persist correctly. (#19535)
* Fixes memory leaks when using `PSPDFDocumentSharingViewController`. (#14468)
* Fixes page change keyboard shortcuts in right-to-left layouts. (#19385)
* Fixes the half modal inspector scroll position sometimes jumping after showing the font picker or going back. (#19050, #19052)
* Fixes the half modal drag indicator appearing above the font picker search field where it didn’t fit well. (#18881)

#### PSPDFKit

* API: Replaces the `rotation` property setter of `PSPDFStampAnnotation` with `setRotation:updateBoundingBox:`, which is declared in the `PSPDFRotatable` protocol. (#15888)
* Deprecates `-[PSPDFBookmarkManager removeBookmarkForPageAtIndex:]` in favor of the new `removeBookmarksForPageAtIndex:`, which more accurately describes the handling of multiple bookmarks per page. (#16371)
* Adds support for rotating stamp annotations to any angle and ensures the visual size is retained when the rotation is changed. (#15899)
* Adds a `customData` property to `PSPDFAnnotation`. The contents of this property are saved to the corresponding annotation provider. (#18889)
* Adds `PSPDFDirectory.documentPickerDirectory` as a way to show the system file picker for directory selection. (#16997)
* Adds a `drawingBlock` property to `PSPDFFileAppearanceStreamGenerator` to allow additional custom drawing. See `AppearanceStreamGeneratorWithCustomDrawingExample` in PSPDFCatalog. (#19277)
* Adds French (Canadian) localization. (#19686)
* Adds `showWatermark` to `PSPDFSignatureAppearance`. This allows hiding the watermark from digital signatures. (#19438)
* Adds support for signing PDF documents using P12 keystores that contain CA certificates. (#19448)
* Adds support for modifying form fields and annotation widgets to Instant Document JSON. (#18771)
* Adds `FontStyle` to Instant JSON for widget annotations. (#18083)
* Improves JavaScript error validation and error reporting. (#18899)
* Improves performance of pages which hold lots of objects. (#19396)
* Improves the performance of documents with JavaScript interactivity in many common scenarios. (#19119)
* Automatically triggers a `clearCache` when the data directory is set. (#18898)
* Changes the default `PSPDFDocumentEditorConfiguration.saveDirectories` to `PSPDFDirectory.documentPickerDirectory`, to use the system file picker for choosing a save location. (#16997)
* Increases the default levels of undo actions from 40 to 100 to store more history. (#18756)
* Loading PDF actions is now more reliable. (#18843)
* Optimizes storage size of Magic Ink template files. (#19453)
* Suppresses parsing and potential display of unsupported annotation types, such as widget annotations. (#19415)
* Updates ICU to version 63.1. (#18974)
* Updates libjpeg-turbo to 2.0.2. (#18973)
* Updates libpng to 1.6.36. (#18972)
* Updates zlib to 1.2.11. (#18975)
* Fixes a problem where a form field that is made visible by a JavaScript script may not show its formatted appearance. (#19119)
* Fixes a rare issue when parsing outlines. (#19469)
* Fixes a very occasional crash on editing form elements. (#19595)
* Fixes an assertion that could occur when applying certain rotation values in Instant JSON in certain documents. (#19391)
* Fixes an issue exporting Instant JSON shape annotations with transparent stroke colors. (#19120)
* Fixes an issue when redacting documents with monochrome inline images. (#19579)
* Fixes an issue when drawing a path using a pattern with alpha transparency. (#19148)
* Fixes an issue when rendering text with an overlay blend mode. (#19151)
* Fixes an issue when setting transparent colors in annotations. (#19120)
* Fixes an issue when sharing a document that resulted in blank pages. (#19267)
* Fixes an issue where the `QuadPoints` of link annotations were saved to the PDF incorrectly. (#19427)
* Fixes an issue where `-[PSPDFDocument+DataDetection objectsAtPDFRect:pageIndex:options:]` could return a nil annotations array. (#18846)
* Fixes an issue where a page would sometimes fail to render when scrolling through a document quickly. (#18571)
* Fixes an issue where annotations created by Apple Preview may not be copied and pasted correctly. (#19154)
* Fixes an issue where border width and border dash array of free-text annotations were not serialized properly to Instant JSON. (#19481)
* Fixes an issue where entering text after a PDF document script has executed may not work correctly. (#19119)
* Fixes an issue where form field input may not be correctly validated while the user is typing if some form field flags are set. (#19448)
* Fixes an issue where link annotations may not work correctly after a document is exported. (#19222)
* Fixes an issue where malformed widget annotations weren’t correctly attached to the form. (#19581)
* Fixes an issue where opening a document with annotations written by a version of PSPDFKit prior to 8.0 could lead to a deadlock. (#19007)
* Fixes an issue where some JPX images may not render correctly. (#18648)
* Fixes an issue where some memory may be leaked after running a script. (#19016)
* Fixes an issue where stamps with custom AP streams were added with the wrong rotation on rotated PDF pages. (#19351)
* Fixes an issue where text edited in form fields was incorrectly set in other form fields as well. (#19236)
* Fixes an issue where the `fillColor` property was ignored in Instant JSON for polyline annotations. (#19443)
* Fixes an issue with instant ink annotation not being sent to clients. (#19325)
* Fixes an issue with text markup alignment on accented characters. (#18214)
* Fixes some characters being missing from search preview. (#19361)

#### Instant

* Demotes an assertion about an unexpected state of the database to a recoverable error when applying changes from the server. (#18698)
* Fixes an issue where multiple authentication requests for the same layer could be running concurrently. Under certain circumstances, this could cause multiple concurrent sync requests for the same layer too. (#18698)

#### Examples

* All Swift examples have been updated to Swift 5. (#19405)
* Adds a PSPDFCatalog example illustrating how to customize the tab title of a `PSPDFTabbedViewController`. (#19590)
* Adds a PSPDFCatalog example illustrating how to customize the table view cell for a `PSPDFSearchViewController`. (#19572)
* Adds an example in Swift to customize the buttons in the Annotation Toolbar. (#19232)
* Fixes an issue where the close button was not visible in Custom Sharing Options example. (#19345)
* Fixes an issue with the navigation bar’s appearance and visibility in the example catalog. (#19348)

### 8.2.3 - 21 Mar 2019

#### PSPDFKitUI

* Fixes an issue where `-[PSPDFTabbedViewControllerDelegate tabbedPDFController:didChangeVisibleDocument:]` was not getting called when closing the visible tab. (#19298)
* Fixes an issue where tall form fields with auto-sizing fonts would behave incorrectly. (#19303)
* Fixes scrubber bar flickering when manipulating annotation properties. (#19200, #19210)

#### PSPDFKit

* Updates scripts embedded in `PSPDFKit.framework`, so Xcode does not try to sign them for specific setups. All embedded scripts need to be called with bash from now on, e.g. `bash PSPDFKit.framework/strip-bitcode.sh`. You can manually delete the `#!/bin/sh` line from the script for older versions if you encounter ERROR ITMS-90035: "Invalid Signature. Code object is not signed at all." pointing to a script embedded in PSPDFKit.framework. (#19190)
* Fixes an issue where the caps key may be incorrectly enabled on some form fields. (#19246)
* Fixes an issue where ink drawings created in macOS Preview and represented as vector stamps could in some cases be incorrectly displayed as a default stamp. (#19157)

#### Examples

* Fixes Swift language detection in the PSPDFKit Catalog on beta versions of Xcode. (#19095)

### 8.2.2 - 11 Mar 2019

#### PSPDFKitUI

* Improves behavior when trying to share invalid documents. (#19102)
* Improves the behavior for multiline form fields that have autosizing fonts. (#18999)
* Improves the behavior when interacting with form fields when the page is zoomed in. (#18417)
* Reduces the number of registered undo actions when dragging an ink annotations, which might have caused main thread freezes previously. (#19169)
* Fixes an issue that prevented the `shouldHideUserInterfaceOnPageChange` flag from being correctly honored when using tap to scroll navigation. (#16362)
* Fixes an issue where document metadata was ignored when sharing through `UIActivityViewController`. (#19056)
* Fixes an issue where sound annotations could not be played back if they did not have a note attached to it. (#19038)
* Fixes an issue where the "Copy" option is shown for annotations that do not support copying. (#15854)
* Fixes an issue where undoing free text callout annotation changes did not work properly. (#18197)

#### PSPDFKit

* Reduces the numbers of undo actions recorded when modifying the points of free text callout, line, polyline, and polygon annotations. (#18197)
* Removes the `PSPDFFormElementFlag` enumeration, which was unused. The supported flags can be set through the `readOnly`, `required`, and `noExport` properties on `PSPDFFormField`. (#19101)
* Fixes a potential crash when resolving additional downloadable fonts. (#18981)
* Fixes a rare deadlock when using undo/redo while a document is being deallocated. (#18977)
* Fixes an issue that could result in missing annotation note indicators for notes added in third party editors. (#19039)
* Fixes an issue where a form field with custom formatting may not be formatted correctly when its exported XFDF data is imported again. (#18791)
* Fixes an issue where annotation note indicators could be clipped when positioned on the edge of the annotation bounding box. (#19039)
* Fixes an issue where changes to the `fileURL` property of objects in a document’s `dataProviders` array were not reflected in the `fileURLs`, or `fileURL` property of that document. `PSPDFDocument` now uses KVO to reflect changes to the `fileURL` property of its `dataProviders` that conform to `PSPDFFileDataProviding` in its own `fileURLs`, and `fileURL` properties. (#18835)
* Fixes an issue where some JavaScript keystroke handling scripts may not work as intended. (#19070)
* Fixes an issue where the image of a push button may be displaced in some cases. (#18932)
* Fixes some issues where certain properties changed by a JavaScript script may not reflect correctly in the UI. (#18125)
* Fixes an issue where some layers were hidden incorrectly. (#14439)

### 8.2.1 - 18 Feb 2019

#### PSPDFKitUI

* Improves the internal annotation username state handling which caused issues when programmatically dismissing the annotation username alert. (#18905)
* Improve the logic to properly inset the annotation toolbar when the page grabber is used. (#18685)
* Fixes an issue that could result in blank pages after scrolling or device rotation. (#18848, #18682)
* Fixes an issue where changing the appearance mode would not be reflected on the currently visible pages in page curl mode unless the page was changed. (#18869, Z#12698)
* Fixes an issue where keyboard was not dismissed in favor of a form field popover. (#6523)
* Fixes the half modal drag indicator appearing above the font picker search field where it didn’t fit well. (#18881)

#### PSPDFKit

* Improves JavaScript error validation and error reporting. (#18899)
* Automatically triggers a clearCache when the data directory is set. (#18898)
* Fixes an issue where `-[PSPDFDocument+DataDetection objectsAtPDFRect:pageIndex:options:]` could return a nil annotations array. (#18846)
* Fixes an issues where a page would sometimes fail to render when scrolling through a document quickly. (#18571)

### 8.2.0 - 7 Feb 2019

_See the [announcement post](/blog/2019/pspdfkit-ios-8-2/)._ **PSPDFKit 8.2 for iOS is the last minor version to support iOS 10.** PSPDFKit 8.3 for iOS will raise the deployment target to iOS 11, allowing us to concentrate our development and support efforts.

#### PSPDFKitUI

* Deprecates `-[PSPDFDocumentEditorToolbarController toggleSaveActionSheet:presentationOptions:completionHandler:]` in favor of `-[PSPDFDocumentEditorToolbarController toggleSavingConfirmationViewController:presentationOptions:completionHandler:]`. (#17589)
* Deprecates `-[PSPDFDocumentSharingViewControllerDelegate documentSharingViewController:willShareFiles:]` and adds a new delegate method to set a custom filename for the generated files when sharing documents. (#18781)
* Deprecates `PSPDFFlexibleToolbarContainerView.flickToCloseEnabled` which allowed to close the toolbar by flicking down on it while dragging. (#17893)
* Deprecates `bookmarkString` on `PSPDFBookmarkCell`, since the cell now displays multiple labels. (#10916)
* Adds additional bookmark UI features and improves the overall bookmark cell design. (#10916)
* Adds a smoother and more delightful annotation inspector on iPhone that works as a proper sliding panel to better align with modern iOS design. (#17963)
* Adds `shouldStartEditingBookmarkNameWhenAdding` on `PSPDFBookmarkViewController` to disable the new behavior where an added bookmarks' name is automatically made editable. (#10916)
* Adds `-[PSPDFConfiguration redactionUsageHintEnabled]` to determine if the redaction usage hint should be shown the first time the redaction tool is selected. (#18437)
* Adds `textSelectionMenuItemForCreatingAnnotationWithType:` to get a text selection annotation creation menu item, to make it easier to customize the text selection menu. (#17635)
* Adds a new default annotation toolbar configuration, to make the toolbar show an appropriate amount of items, in more cases. (#17322)
* Adds a subclassing hook for customizing the alert controller shown when the document editor is going to be dismissed. (#17589)
* Adds view state restoration support for the document editor toolbar. (#18467)
* Improves automatic font size calculation for text widgets. (#18095)
* Improves bounding box calculation used for creating text markup and redaction annotations in the UI to more closely reflect the actual text frames, and to not accidentally mark up adjacent characters. (#17675, #16629)
* Improves conflict resolution handling while the view controller is not visible. (#18159)
* Improves memory usage when scrolling through pages quickly in a large document. (#18460)
* Improves the interaction for form fields that contain both the DoNotScroll and auto-sizing font flags. (#18254)
* Improves the way default page templates are handled on `PSPDFNewPageViewController`. (#18239)
* Changes the condition for determining if all text selection markup creation menu items should be displayed, from checking if the current device is an iPad, to checking if the view is shown in a regular horizontal size class. (#18117)
* Changes the condition for determining if the markup style menu items should be shown in a submenu, from checking if the current device is an iPad, to checking if the view is shown in a regular horizontal size class. (#18117)
* Imposes support for setting the flexible toolbar position via the `toolbarPosition` property. The set value is now prioritized over any preserved user state. (#18467)
* Padding for text selection is no longer applied on the model level for glyphs, but instead only on the UI level for the text selection view. (#18036)
* The minimum font size is now 4px, the maximum is 200px. (#18485)
* Fixes a potential assertion when a HUD toggle is scheduled but the view is removed during that time. (#18670)
* Fixes an issue in Document Permissions screen which allowed the user to save modified permissions without setting a Document Owner password. Previously, the permissions were not getting actually updated, however the UI might have led the user to believe so. (#18496)
* Fixes an issue in Document Permissions screen which allowed the user to set the same Document Open and Document Owner password. They can't be the same. For more details, please see https://pspdfkit.com/blog/2018/protecting-pdf-documents/. (#18495)
* Fixes an issue where a modally presented `PSPDFViewController` could be dismissed after tapping on an annotation from the annotations list. (#18643)
* Fixes an issue where a warning was needlessly logged when the license did not include the Annotation Editing component. (#18448)
* Fixes an issue where backward and forward buttons were not updated correctly. (#18523)
* Fixes an issue where drawing in the signature UI was not following the touch location. (#18522)
* Fixes an issue where drawing or creating text markups didn't work when scrolling to the next or previous page after activating the tool. (#18715)
* Fixes an issue where form fields that were marked as multiline but had the `doNotScroll` flag set and are really short would fail to accept input. (#16965)
* Fixes an issue where highlighting text using markup annotations did not work reliably after changing page using the thumbnail scrubber bar. (#18613)
* Fixes an issue where image stamp annotations could be inserted in the wrong spread in double page mode. (#18654)
* Fixes an issue where merging markup annotations or converting a markup to a different type caused the bounding box to change unexpectedly. (#18092)
* Fixes an issue where selected text and annotations were shown on an external screen while screen mirroring, which caused some UI glitches. (#18570)
* Fixes an issue where the `UIMenuController` for selected annotations was not positioned correctly. (#18186)
* Fixes an issue where the `delegate` of `PSPDFSignatureSelectorViewController` was overriden, when set before the view appeared. (#18431)
* Fixes an issue where the annotation inspector popover was not positioned correctly if the annotation was partially off screen. (#18453)
* Fixes an issue where the document on an external screen got stuck while screen mirroring when re-connecting a display while a document was visible. (#18570)
* Fixes an issue where the rect of newly added stamp annotations in double page mode was incorrect. (#18654)
* Fixes an issue where the user interface view could get stuck in a visible or hidden state, when switching pages while editing a free text annotation. (#18541)
* Fixes an issue where unsaved ink annotations were rendered incorrectly after rotating the page. (#18230)
* Fixes customization of the subject when sharing documents via email using the system share sheet. (#18099)
* Fixes support for dynamic document editor toolbar button layouts by correctly invoking and honoring the `-[PSPDFDocumentEditorToolbar buttonsForWidth:]` subclassing hook. (#18669)

#### PSPDFKit

* API: Changes the return type of `-[PSPDFBookmarkManager addBookmarkForPageAtIndex:]` from `void` to `PSPDFBookmark *`. (#10916)
* API: Deprecates `PSPDFDocumentSaveOptionForceRewrite` in favor of newly added `PSPDFDocumentSaveOptionForceSaving` and `PSPDFDocumentSaveOptionStrategy`. (#18142)
* Deprecates `-[PSPDFDocument applyInstantJSONFromDataProvider:toDocumentProvider:error:]` in favor of a version that adds a `lenient` parameter, that controls the behavior when the JSON is (partially) invalid. (#18630)
* Adds `PSPDFOriginalFontNameAttributeName` to improve handling of fonts in free text annotations where the font is not readily available. In addition, setting an annotation’s `fontName` now preserves the `fontSize`. (#18421)
* Adds `localizedActionType` to `PSPDFAction`, and changes some of the strings returned from `localizedDescriptionWithDocumentProvider:`. (#10916)
* Adds support for cloudy borders in shape annotations and free text annotations via Instant JSON. (#18547)
* Adds support for multi-threaded rendering. (#18199)
* Adds support for stamp and free text annotation rotation in Instant JSON. (#18019)
* Adds support for the doc.removeField JavaScript API. (#18621)
* Improves compatibility with 3rd-party SDKs that use Aspects to hook into message passing. (#18793)
* Improves handling of a document’s `documentProviders` being recreated, which happens when calling `clearCache` and in low-memory situations. (Z#12006)
* Improves handling of failures to add annotations to a given annotation provider. Annotations that could not be attached to the document are now not included in the return value of an annotation provider's `-addAnnotations:options:` method. (#16326)
* Improves initial text parsing performance. (#18534)
* Improves performance when looking up fonts. (#17981)
* Improves the locking mechanism for password-protected documents so that calling `-[PSPDFViewController reloadData]` won't reload an explicitly-locked document. (#18561)
* Improves the performance of documents which apply masks to text objects. (#15497)
* Allow the use of `-[PSPDFDocumentProvider setRotationOffset:forPageAtIndex:]` on providers with custom annotation providers like XFDF or PSPDFKit Instant. (#17603)
* Exposes `-[PSPDFAnnotation blendMode]`. See https://pspdfkit.com/guides/ios/current/annotations/annotation-blend-modes/. (#18410)
* Fix an issue in full-text search that could cause a deadlock during indexing. (#18750)
* Padding for glyph frames is no longer applied in `PSPDFBoundingBoxFromGlyphs` and `PSPDFRectsFromGlyphs`. `PSPDFDefaultTextPaddingFactor` has been removed as well. (#18036)
* The `documentProvider` property on `PSPDFAnnotation` is now readonly. (#18578)
* Updates the Botan library to version 2.9.0. (#18271)
* Use app name in JavaScript alerts. (#18529)
* Fixes a bug where annotations parsed from XFDF would be displayed incorrectly on a rotated page. (#17603)
* Fixes a problem importing/exporting color values. This could lead to unnecessary appearance stream regeneration. (#18428)
* Fixes a rare deadlock when using ink annotations from multiple threads. (#18674)
* Fixes an issue when opening a rotated Image Document. (#17791)
* Fixes an issue where creating text markup annotations via `+textOverlayAnnotationWithRects:boundingBox:pageIndex:` ignored the bounding box parameter and used the union of the rects as bounding box instead. (#18092)
* Fixes an issue where rendering a page with lot of annotations on a large zoom scale would cause memory usage to spike. (#18224)
* Fixes an issue with Image Documents when images have an orientation. (#17791)
* Fixes an issue with Image Documents when saving back to an already rotated image. (#18483)
* Fixes an issue with accessing the document metadata after receiving a low memory warning. (#18769)
* Fixes an issue with render cancellation when using a document that contains multiple data providers. (#18563)
* Fixes delegates not being correctly called for `PSPDFDocumentEditorDelegate` for some editor actions. (#18531)
* Fixes text markup annotations being created incorrectly on rotated pages with text that appears the right way up. (#18219, Z#11941)

#### Instant

* Improves the display of and interaction with image annotations that have not been loaded yet. (#17004)
* Enables support for creating and modifying stamp annotations. (#18773)
* Hide Sharing action in `PSPDFInstantViewController`. Instant document cannot be shared. (V#1883)
* Fixes an issue where stamp annotations would lead to a failed assertion. (#17911)
* Fixes an issue where underline annotations would not sync properly. (#18030)

#### Examples

* Adds a PSPDFCatalog example illustrating how to disable bouncing for the document scroll and zoom views. (#18765)
* Adds an example in Swift for using the Apple Maps widget in a PDF page. (#18067)
* Updates Catalog example to better illustrate how to customize the file names of documents being shared. (#18574)

### 8.1.3 - 15 Jan 2019

#### PSPDFKitUI

* Adds a new subclassing hook to `PSPDFDocumentSharingViewController` to customize the mail compose view controller when sharing to the Email destination. (#17955)
* Improves change tracking to prevent `presentedItemDidChange` loops that could prevent saves with certain system file provider extensions. (#18409)
* Publicly declares `PSPDFFlexibleToolbarContainerDelegate` conformance in `PSPDFDocumentEditorViewController`. (#18451)
* Fixes an issue in the Security/Permissions screen where the toolbar buttons changed prematurely. (#18261)
* Fixes an issue in the document editor where adding a new page after reordering pages would undo the reordering. (#18492)
* Fixes an issue that prevented tapping buttons on the document editor toolbar after long-pressing the thumbnail of a single page document. (#18181)
* Fixes an issue where the size of the generated image for sharing changed according to the scale of the device screen. (#18217)
* Fixes an issue where the swipe to delete action in the annotations list only worked for the first entry. (#18207)
* Fixes an issue where unsaved Free Text annotations did not render correctly after rotation of a page. (#18179)
* Fixes an issue that prevented the UI for sharing documents from being presented. (#18039)
* Fixes a potential exception when dismissing the document info popover. (#18215)
* Fixes an exception when calculating the tab bar index with a width of zero. (#18227)

#### PSPDFKit

* Adds a unique identifier `uuid` to `PSPDFAnnotation`. (#17635)
* Improves error reporting when creating an image for a page of a document fails. (#18212)
* Fixes an issue when invalid Image Documents are read back. (#18110)
* Fixes an issue where the redaction of a monochrome image may change its color unexpectedly. (#18176)
* Fixes an issue with some documents using large amounts of memory when searching and navigating. (#18118)

### 8.1.2 - 20 Dec 2018

#### PSPDFKitUI

* Adds `-[PSPDFDocumentSharingViewControllerDelegate documentSharingViewController:shouldShareFiles:toDestination:]` to be able to halt the sharing process in case you want to handle the generated files yourself. (#17957)
* Fixes a rare exception when doing programmatic scrolling on iOS 10. (#18048)
* Fixes an assertion when the page view is about to be reused, but tries to finalize displaying the multimedia gallery. (#18060)
* Fixes an exception when trying to invoke share in the web view controller, when no URL is set. (#18026)
* Fixes an issue where `PSPDFDrawView` could not be subclassed and overridden. (#18157)
* Fixes an issue where drawing strokes might have been offset when resizing the app or rotating the device. (#17320)
* Fixes an issue where drawings could be offset from the actual touch location on very tall or wide pages. (#17769)
* Fixes an issue where the values for `overlayText` and `repeatOverlayText` were not persisted in the Redaction Annotation Inspector. (#17694)
* Fixes an issue where video preview generation could cause the main thread to stutter. (#17802)
* Fixes an issue with closing a tab via the close button and a keyboard shortcut at the same time. (#18104)
* Fixes an issue with image cropping when the image is invalid. (#18103)

#### PSPDFKit

* Improves file asset handling for invalid PDF documents. (#18102)
* Improves handling of invalid documents when enqueueing them in `PSPDFLibrary`. (#18106)
* Improves handling of malformed documents when parsing the extended graphics state. (#18057)
* Improves the API documentation for `PSPDFUsernameHelper` and `PSPDFDocument.defaultAnnotationUsername`. (#18031)
* Improves thread handling and exiting when an app termination event is detected. (#18044)
* Improve app termination handling when background library indexing operations are in flight. (#18056)
* Fixes a crash parsing text on a very small number of documents. (#18032)
* Fixes an assertion that might be triggered on document deallocation when the undo controller hasn't been cleaned up yet. (#18062)
* Fixes an issue where `PSPDFLibrary` would return incorrect results when searching within documents that contained Unicode surrogate pairs (like Emoji) in their text. (#3292)
* Fixes an issue where redacting certain kinds of vector graphics may incorrectly redact part of the background. (#18071)
* Fixes an issue where redacting certain kinds of vector graphics may result in a lot of memory consumption. (#18065)
* Fixes an issue where the JavaScript method Doc.print may not work correctly. (#18111)
* Fixes an issue where the signature overlay may show incorrect text in non-Western languages. (#17918)
* Fixes an issue with file change tracking that could trigger to multiple conflict resolution messages or a document reload loop. (#18090, #18133)
* Fixes some visualization issues with markup annotations, specially on rotated pages. (#12927, #13162, #17713, #17889, #18002, #18024)

### 8.1.1 - 7 Dec 2018

#### PSPDFKitUI

* Adds support for unlocking an encrypted document when screen mirroring, as soon as the document is unlocked on the device. (#17990)
* Makes the draw gesture recognizer resilient against an unexpected number of touches. (#18005)
* Fixes a crash that could occur after deleting pages in the document editor. (#17987)
* Fixes a potential exception when restoring view state for the document editor, before it is loaded. (#17984)
* Fixes an exception that might occur when the document editor loads images in the background while the user removes pages from the document. (#17985)
* Fixes an incorrect license check assertion that could be triggered when transitioning between the document and thumbnail view modes. (#17994)
* Fixes an issue causing an infinite recursion when unlocking an encrypted document with screen mirroring enabled. (#17990)

#### PSPDFKit

* Improves strikeout annotation rendering, by making the line a little bit thicker and the baseline a little bit below the vertical center. (#17889)
* Fixes a rare exception when deallocating undoable objects in multiple threads. (#17983)

### 8.1.0 - 6 Dec 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-ios-8-1/)._

#### PSPDFKitUI

* API: Deprecates the `PSPDFPageView` methods `convertViewPointToPDFPoint:`, `convertPDFPointToViewPoint:`, `convertViewRectToPDFRect:`, and `convertPDFRectToViewRect:` in favor of the clearer and more versatile `pdfCoordinateSpace` property. (#12053)
* API: Deprecates `PSPDFAnnotationStateManager.drawingInputMode`. Set the `state` to `PSPDFAnnotationStringEraser` instead. (#17458)
* Adds `-scrollsToPageAtIndex:document:animated` to the `PSPDFViewModePresenter` protocol. (#15136)
* Adds `allowEditing`, `rightActionButtonItems`, `leftActionButtonItems` to `PSPDFDocumentInfoViewController` and `PSPDFDocumentSecurityViewController` to allow customizing the interface. (#16429)
* Adds `visiblePageIndexes` property to `PSPDFViewModePresenter`. (#15136)
* Adds a Cancel button to discard changes in `PSPDFDocumentInfoViewController` and `PSPDFDocumentSecurityViewController`. (#16790)
* Adds a `PSPDFConfiguration` option, `shouldAdjustDocumentInsetsByIncludingHomeIndicatorSafeAreaInsets`, to enable the document view to ignore the home indicator when calculating safe area insets. (#17849)
* Adds a `pdfCoordinateSpace` property on `PSPDFPageView` as the new preferred way to convert between PDF page and view coordinates. (#12053)
* Adds a default conflict resolution UI to `PSPDFViewController`, `PSPDFMultiDocumentViewController` and `PSPDFTabbedViewController` via a new `PSPDFConflictResolutionManager` class. (#13367)
* Adds support for all three possible double-tap actions from the second-generation Apple Pencil (`UIPencilInteraction`). (#17458)
* Adds support for redacting more elements, like images, paths, annotations and forms. (#17002)
* Adds the ability to share multiple pages of a document as images. (#17020)
* Adds a `pencilInteraction` property and `annotationStateManagerDidRequestShowingColorPalette:` delegate method on `PSPDFAnnotationStateManager` to customize Apple Pencil double-tap actions. (#17458)
* Improves flexible toolbar behavior, by disabling user interaction on its `contentView` while dragging it, to not cause UI glitches in case a button tap would present UI. (#17714)
* Improves performance when scrolling in the thumbnail list, especially for complex documents. (#17337)
* Improves the Document Editor experience on iPhones. (#17613)
* Improves the descriptions for errors that happen when sharing documents. (#17774)
* Improves the experience on the Document Editor when reordering pages. (#17838)
* Improves the page selection experience when sharing multiple documents at once. (#17138)
* Improves the screen mirroring experience and now properly syncs the configuration between the original and the mirrored view controller. (#17484)
* Improves the sharing experience for documents that don't have annotations. (#17220)
* Prevents the annotation toolbar from being visible if the document is invalid after calling `-[PSPDFViewController reloadData]`. (#17624)
* Removing a page on `PSPDFDocumentEditorViewController` no longer briefly displays a random number as the page number. (#17727)
* Switching between the Thumbnails view and the Document Editor now preserves the position of the current page instead of scrolling to the first page. (#15136)
* `PSPDFDocumentSharingViewController` now correctly calls `-[PSPDFViewControllerDelegate pdfViewController:shouldSaveDocument:withOptions:]` when sharing a document. (#16488)
* Fixes a potential exception when calculating collection view scroll offsets on iOS 10. (#17962)
* Fixes an issue when deleting pages in some documents on `PSPDFDocumentEditorViewController`. (#17762)
* Fixes an issue when sharing PDF documents as images. (#17686)
* Fixes an issue when sharing single-page documents using certain sharing configurations. (#17705)
* Fixes an issue where text markup and redaction selection could mark up whole images. (#17360)
* Fixes an issue where the document info and security UI disabled editing for encrypted documents. (#17271)
* Fixes an issue where the multi-annotation selection tool started recognizing the pan gesture only after a long swipe when zoomed into the page a lot. (#17565)

#### PSPDFKit

* API: The distinction between standard stamps and custom text stamps has been clarified with the following deprecations and replacements. If you previously used the stamp `subject` consider whether you want a standard or custom text stamp. For standard stamps, `subject` has been deprecated in favor of `stampType` and the value of this property should usually be one of the values defined by the new `PSPDFStampType` string enum. PSPDFKit will provide the localized title for standard stamps. `localizedSubject` has been deprecated in favor of `title`. Set the `title` instead of `stampType` for custom text stamps, where you provide a title that has already been localized or user-generated. `subtext` has been deprecated in favor of `subtitle`. (#15895)
* API: `-[PSPDFAnnotationSummarizer temporaryPDFFileURLForPages:completionBlock:]` is now only available on iOS. (#17109)
* Adds a custom tokenizer (`PSPDFLibraryUnicodeTokenizerName`) that performs full Unicode case folding on the input text. (#16219)
* Adds better support for annotations with custom appearance streams. (#15658)
* Adds progress reporting and cancellation support to `PSPDFAnnotationSummarizer`. (#17749)
* Adds support for conflict resolution options to `PSPDFCoordinatedFileDataProvider` and `PSPDFDocument`. This is achieved by levering APFS to create a lightweight file copy used for safe reading and potential later restoration. (#13367)
* Adds support for page bookmarks in compound documents. (#11008)
* Improves compatibility with forms on malformed PDFs. (#17707)
* Improves document features to reflect the current state of the document, by automatically updating them once an encrypted document has been unlocked. (#17271)
* Improves error handling when saving a document fails. (#17685)
* Improves performance on initializing a data provider. (#17897)
* Improves tracking of external file changes. (#17946)
* Changes the type of the keys of `PSPDFDocumentPDFMetadata` to `PSPDFMetadataName`. (#16790)
* Log message sent from our render core can now be intercepted with the log handler. (#17732)
* `PSPDFDocumentXMPMetadata` and `PSPDFDocumentPDFMetadata` now have failable document initializers and simply return nil if a document is not valid. (#17736)
* `PSPDFUndoController` now checks if an undo/redo operation can be performed and fails gracefully, instead of throwing an exception when undo/redo is called on an empty stack. (#17921)
* Removes zooming in on search results on iPads. (#17260)
* The disk cache is now invalidated when a device locale change is detected. (#17919)
* The redaction feature now deletes annotations and form fields that intersect with a redaction annotation. (#17390)
* `PSPDFAnnotationSummarizer` no longer returns a nullable on its initializer. (#17109)
* Fixes a potential race condition when changing annotation properties from multiple threads at the same time. (#17690)
* Fixes a problem where some text in a PDF document may be redacted incorrectly. (#17699)
* Fixes an issue applying redactions on encrypted documents. (#17722)
* Fixes an issue looking up destinations in a names tree. This could lead to unresolvable link/outline destination. (#17206)
* Fixes an issue opening certain documents with invalid IRT fields. (#17797)
* Fixes an issue that may happen after copying a page using the document editor. (#17825)
* Fixes an issue when using `PSPDFAppearanceCharacteristics` without an image. (Z#11409)
* Fixes an issue where XMP metadata was corrupted when saving password protected documents. This enables saving bookmarks into password protected documents. (#17238)
* Fixes an issue where changing the button caption property of a button from JavaScript code may not change the button appearance. (#17719)
* Fixes an issue where editing a form field in the middle may incorrectly move the cursor to the end. (#17926)
* Fixes an issue where keystroke range replacements were not caught by Javascript correctly. (#17106)
* Fixes an issue where some PDF documents may show an indefinite spinner and not render correctly. (#17446)
* Fixes an issue where the Javascript VM init sequence prevented errors from bubbling up to the user. (#17745)
* Fixes an issue where the overlay text of a redaction may not be in the correct place in some cases. (#17695)
* Fixes an issue where the wrong message is return when a certificate is expired. (#16727)
* Fixes an issue with importing/exporting vector stamps with InstantJSON. (#16690)
* Fixes issues when importing annotations on rotated pages using InstantJSON. (#17814)

#### Instant

* Adds support for the Magic Ink tool. (#17362)

#### Examples

* Adds a PSPDFCatalog example illustrating how to search and redact text. (#17755)
* Adds a PSPDFCatalog example illustrating how to write and attach Instant JSON binary data. (#17778)
* Adds an example on how to create a custom UI to enter a name for a bookmark when adding one. (#17886)

### 8.0.4 - 28 Nov 2018

#### PSPDFKitUI

* Improves handling of annotations with invalid bounding boxes. (#17731)
* Fixes an issue with presenting annotation filtering progress during concurrent annotation edits. (#17730)
* Fixes an issue with the annotation toolbar and sub menus. (#17716)

#### PSPDFKit

* Improves error handling in the text parser for corrupted PDF documents. (#17735)
* Improves handling of embedded assets in annotations. (#17717)
* Background library index tasks are now correctly stopped when an application will terminate event is sent. (#17733)
* Improve NSCoder error handling support for `PSPDFDataContainerProvider`. (#17734)
* Fixes a potential issue when rendering images. (#17737)
* Fixes an issue where `PSPDFImageDocument`'s data provider would reference invalid memory. (#17763)
* Fixes an issue where text could not be selected in certain documents. (#17759)
* Fixes an issue where text for highlighted annotations sometimes didn't include newline character. (#17595)
* Fixes an occasional issue when rendering text. (#17747)
* Fixes the `PSPDFAnnotation` API `hasBinaryInstantJSONAttachment` and `writeBinaryInstantJSONAttachmentToDataSink:error:` returning incorrect values in certain situations. (Z#11192)
* Fixes an issue where underline annotations may not work correctly on rotated pages. (#14252)

#### Instant

* Fixes an issue where attempting to sync an invalid document could lead to an assertion failure. (#17817)
* Fixes an issue where image attachments with a more specific MIME-type were rejected as invalid server data. (#17790)
* Fixes an issue where incomplete image transfers would lead to missing images and possibly a flood of sync requests. (#17788)
* Fixes an issue where the concurrently finishing downloads of image attachments could have lead to a crash or data loss. (#17807)

### 8.0.3 - 15 Nov 2018

#### PSPDFKitUI

* Improves handling of cell layout when parent frame has a size of zero. (#17622)
* Improves text selection handle behavior in documents with vertical or rotated text. (#14252)
* Fixes an issue when switching the annotation tool while selecting text with a markup annotation tool. (#17623)
* Fixes an issue where undo could remove an annotation from a previous document. (#17620)
* Fixes an issue with selecting a polyline or polygon annotation with the finger, while currently being created with an Apple Pencil. (#17625)

#### PSPDFKit

* Improves text selection for documents with rotated pages. (#14252)
* Fixes a crash that may happen when trying to generate the appearance stream of a push button. (#17627)
* Fixes a potential issue when converting magic ink annotations. (#17618)
* Fixes a potential issue when rendering certain PDF documents with note annotations. (#17617)
* Fixes an issue in handling documents with partially invalid pages. (#17621)
* Fixes an issue with unexpected state when clearing the annotation selection for specific configurations. (#17619)

### 8.0.2 - 9 Nov 2018

#### PSPDFKitUI

* Adds support for the new iPad Pros. (#17522)
* Adds `allowEditing`, `rightActionButtonItems`, `leftActionButtonItems` to `PSPDFBookmarkViewController` to allow customize the interface. (#16429)
* Improves annotation deselection behavior when creating new annotations or navigating between pages. (V#1832)
* Improves annotations list styling while editing. (#17434)
* Improves customization options of `PSPDFDocumentInfoCoordinator`. (#16429)
* Fixes an animation glitch with the toolbar in the document info and document security UI. (#17437)
* Fixes missing search on annotations list view controller. (#17482)

#### PSPDFKit

* Adds support for `util.scand`, a JavaScript API that can be used from PDF documents to parse dates from strings. (#17480)
* Improves performance while entering text using a non-latin font into form fields. (#17593)
* Adjust default values of `PSPDFLibrary` cooldown timer for iOS 12.0 and higher. (#17441)
* Changes the format of the `InstantJSON` bookmark format. The id is now saved in `pdfBookmarkId` and `skippedBookmarkIds` has been renamed to `skippedPdfBookmarkIds`. (#17400)
* Fixed an issue where the wrong encoding was used for the `Symbol` font. (#17245)
* Fixes a crash that could occur if an annotation is deleted while a checkpoint is being saved. (#17408)
* Fixes a crash that may happen when you add form fields with certain kinds of JavaScript scripts. (#17472)
* Fixes an issue where JavaScript dependent calculations may not be executed after a syntax error. (#17025)
* Fixes an issue where JavaScript form field validation erroneously used the previous value. (#16462)
* Fixes an issue where redacting content in some documents may show validation issues in third party readers. (#17486)
* Fixes an issue where rotating a page after adding a note annotation would crash without saving the document prior to rotation. (#17473)
* Fixes duplicate annotations when using `PSPDFXFDFAnnotationProvider` together with `PSPDFFileAnnotationProvider`. (#17526)
* Fixes an issue inserting Emoji, Arabic or East Asian text in form fields. (#17574)

#### Instant

* Fixes an issue where incoming changes in the middle of editing the text of a freetext annotation would lead to an assertion failure. (#17377)

#### Examples

* Adds a PSPDFCatalog example illustrating how to convert HTML to PDF with Swift. (#17536)
* Adds a PSPDFCatalog example illustrating how to programmatically create a push button form field with a custom image. (#17569)
* Adds the Calculator.pdf JavaScript demo to the Catalog. This example showcases a calculator application implemented completely inside a PDF using JavaScript. (#17547)

### 8.0.1 - 25 Oct 2018

#### PSPDFKitUI

* Improves presentation experience by changing pages without animation when external keyboard is used. (#17346)
* Improves scrolling performance for very complex documents when zoomed in. (#16655)
* Changes the fill color set for redaction annotation which now does not include the unsupported clear color option. (#17261)
* Magic Ink tool now does not convert the detected shape to its corresponding shape annotation if the creation of the detected shape annotation type is not added to the `edtableAnnotationTypes` property of the `PSPDFConfiguration` object. (#17241)
* Fixes a crash when using page curl transition and automatic page mode, during resizing the app in Split View. (#17323)
* Fixes a potential crash when having a filter selected in `PSPDFThumbnailViewController`. (#17325)
* Fixes an issue where tapping on undo while drawing a polygon shape or line annotation lead to a crash. (#17296)
* Fixes an issue where the `PSPDFScrubberBar` displayed the wrong thumbnail if the document hadn't completed rendering and also when replacing the document. (#9387, #17135)
* Fixes an issue where the page rendering indicator was not animated and positioned properly. (#8524)
* Fixes creation of overlapping markup annotations. (#17316)
* Fixes height of the search view controller to show all available results when possible. (#17254)
* Fixes height of the search view controller when no matches are found. (#17254)

#### PSPDFKit

* Adds -[PSPDFNamedAction initWithNamedActionType:] as alternative initializer. (#17311)
* Improves a free text annotation compatibility with Adobe Acrobat and other PDF readers. (#15095)
* Improves support for `NSSecureCoding` in `PSPDFDocument`. (#17273)
* Improve magic ink's detection of lines and arrows. (#17339)
* Fixes an issue rendering certain documents with complex clip paths. (#16683, #17267)

#### Instant

* Adds support for shape annotations. (#17239, #17263, Z#10922)
* Fixes a bug that deleted all local layers of a document instead of just the layer backing a document descriptor. (#17264)
* Fixes a deadlock that could occur when deleting a layer or all loaded data. (#17257)
* Fixes an issue that could cause open file descriptors to be leaked when deleting the local data for a layer, document, or the entire Instant client. (#17303)
* Fixes an issue where remote deletion of the last annotation on a page would not correctly update the display. (#17062)

### 8.0.0 - 17 Oct 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-ios-8-0/)._

This release features two new components - [Redaction](https://pspdfkit.com/pdf-sdk/ios/redaction/) and [Comparison](https://pspdfkit.com/pdf-sdk/ios/comparison/). If you would like to add either to your license, [ping our sales team](https://pspdfkit.com/support/request/) to receive a quote.

Below is a summary of the API changes in this release. For a full list, with our suggested migration strategy for each API that has been changed or removed, please see the [migration guide](https://pspdfkit.com/guides/ios/current/migration-guides/pspdfkit-80-migration-guide/).

* API: Removes all deprecated API. For a full list with suggested migration paths, see the migration guide. (#16157)

#### PSPDFKitUI

* API: The flow for sharing documents has been revamped to allow the user to first decide what options to apply to the sharing documents and then sharing to a given destination; this change normalizes the sharing experience across PSPDFKit. Please refer the migration guide if you did anything related to sharing, such as overriding `PSPDFDocumentSharingViewController`, or using `PSPDFDocumentSharingCoordinator` or it's subclasses. (#16453)
* API: Changes the return type of `PSPDFPageView`’s `showNoteControllerForAnnotation:animated:` from `PSPDFNoteAnnotationViewController` to `void` to make it clearer this can show custom UI. If you need the view controller being presented, use `pdfViewController:didShowController:options:animated:`. (Z#10488)
* API: Removes incorrect usage of `UI_APPEARANCE_SELECTOR` on `PSPDFLinkAnnotationView` and improves the documentation for that class. (#16689)
* API: Resolves incorrect type usage and improves type safety on `PSPDFConfiguration.propertiesForAnnotations` and related APIs, with the introduction of a new extensible enum - `PSPDFAnnotationStyleKey`. (#16501)
* API: Removes `PSPDFScrubberBar.isSmallToolbar` since the scrubber bar can have multiple sizes now. Override `scrubberBarHeight` to change its size. (#16017)
* API: Removes `PSPDFFlexibleToolbarHeight`, `PSPDFFlexibleToolbarHeightCompact`, and `PSPDFFlexibleToolbarTopAttachedExtensionHeight` since the flexible toolbar can now have different sizes. (#16017)
* API: Renames `PSPDFAnnotationStringRedact` to `PSPDFAnnotationStringRedaction`, and `PSPDFAnnotationTypeRedact` to `PSPDFAnnotationTypeRedaction`. (#2127)
* API: Renames `PSPDFBackButtonStyle` to `PSPDFButtonStyle`. (#2127)
* API: Changes `PSPDFDocumentPermissionsLevel`, `PSPDFFormFieldType`, and `PSPDFSubmitFormActionFormat` from `NS_OPTIONS` to `NS_ENUM`. (#16863)
* API: Renames `PSPDFSignatureBiometricPropertiesOptionPressue` to `PSPDFSignatureBiometricPropertiesOptionPressure`. (#16863)
* Adds `PSPDFConfiguration.documentViewLayoutDirectionalLock` so that the scrolling direction can be locked on the document view. (#16687)
* Adds `magicInkReplacementThreshold` to `PSPDFConfiguration`. Adjust this property to change the shape detection strictness. (#16839)
* Adds `redactionInfoButton` to the user interface view, that is shown when there are uncommitted redaction annotations in the document. This button can be disabled via `PSPDFConfiguration.shouldShowRedactionInfoButton`. (#2127)
* Adds a new 'Spread Fitting' setting to `PSPDFSettingsViewController`. (#15724)
* Adds a new Magic Ink tool that recognizes drawn shapes and converts them to shape annotations. This tool is defined as a new variant of the Ink tool: `PSPDFAnnotationVariantStringInkMagic`. (#3923)
* Adds a new `ink_highlighter` image for use with the Highlighter variant of the Ink tool. (#16839)
* Adds a section separator to the settings UI. (#16261)
* Adds accessibility labels to the note annotation style view. (#11808)
* Adds support for creating redaction annotations from the annotation toolbar and from the text selection menu. (#2127)
* Adds support for the `CMD-W` command to close a document tab on `PSPDFTabbedViewController`. (#16088)
* Improves how the document configuration applies to the visible document by avoiding unnecessary reload. (#16486)
* Improves state restoration after rotation on `PSPDFThumbnailViewController`. (#16973)
* Improves support for Dynamic Type and self-sizing cells in table views. (#16024)
* Improves support for following readable width for various table views and cells. (#16013)
* Improves the playback experience of sound annotations while interacting with documents. (#16422)
* Improves the rendering support of push buttons. (#16507)
* Improves the undoing experience for items dropped into `PSPDFDocumentEditorViewController` from other applications via Drag and Drop. (#16048)
* Changes how the presets cell title is displayed in the annotation inspector. (#16674)
* Changes the flexible toolbar width to 50 points on iPads on iOS 12, to match the system behavior. (#16017)
* Image Documents now offer smarter defaults for the settings controller. (#16135)
* Introduces `PSPDFStyleButton`, that is used for the back/forward and redaction info button in the user interface view. (#2127)
* Prevents the menu controller from being displayed when a markup annotation is created using a markup tool. (#16650)
* Readonly form fields are now tappable and execute actions/additionalActions. (#16865)
* Shows an alert with a usage description the first time the redaction feature is used. (#2127)
* The left/right edge tap navigation (`scrollOnTapPageEndEnabled`) now no longer applies in vertical scrolling configurations. (#16530)
* The menu for selected text and selected images now features a Share item. The 'Save to Camera Roll' menu on images has been removed, as Share includes this as potential action. We added `PSPDFTextSelectionMenuActionShare` to control this. (#16141)
* Fixes a crash that could occur when quickly changing the document presentation options. (#16659)
* Fixes a logic issue that prevented the highlight annotation type menu from being displayed on some configurations. (#16884)
* Fixes a potential UI access on the main thread from `PSPDFDrawView`. (#16414)
* Fixes a hang of the main thread when certain progress views were updated in an unforeseen manner. (#17147)
* Fixes an infinite loop when adjusting the document size after a device rotation. (#16579)
* Fixes an issue that could prevent the annotation toolbar from showing, if it was invoked when the user interface was hidden. (Z#10094)
* Fixes an issue that could result in an incorrect jump to page behavior in documents with varying page sizes viewed in continuous scrolling mode. (#16627)
* Fixes an issue where custom render options using `PSPDFAppearanceModeManager` were not applied when `PSPDFViewController` is initialized with a document. (#16728)
* Fixes displayed page not updating when changing tabs in page curl mode. (#16788)
* Fixes an issue where drawn layers disappeared if the app is backgrounded. (#16795)
* Fixes an issue where hidden annotations could temporary become visible during erasing. (#16750)
* Fixes an issue where rotating the device while `PSPDFThumbnailViewController` was visible, could have resulted in thumbnails disappearing. (#15527, #16678)
* Fixes an issue where section footers were sometimes sized incorrectly. (#16146)
* Fixes an issue where the close button would disappear when changing segment in the document outline after changing from regular to compact width. (#15910)
* Fixes an issue where the color change animation for note annotations on iOS 10 didn't sync properly. (#16752)
* Fixes an issue where the selected text overlay would be misplaced on rotation. (#17139)
* Fixes an issue where zooming to a page index might display that page partially off-screen when using continuous page transition. (#16967)
* Fixes an where deleting all annotations in list animated the cells to the top right corner. (#16696)
* Fixes changes to `PSPDFNoteAnnotationViewController`’s `showColorAndIconOptions` property not being applied immediately while the view is visible. (Z#10487)
* Fixes page view size when tab bar is visible. (#16474)
* Fixes secure unarchiving of `PSPDFViewState` not working. (#16850)

#### PSPDFKit

* API: PSPDFKit now uses a standardized coordinate system where the page origin is always in the lower-left corner as the page appears on screen. The simplifies interaction with pages that have a rotation or cropbox set in the PDF. Please see the migration guide if you did anything in PDF coordinates or page coordinates, such as reading or writing annotation or glyph positions, or using `PSPDFViewState`. (#15890)
* API: Instant JSON binary attachment APIs now take and return a `mime-type`. (#16039)
* API: Removes `PSPDFPageInfo`’s `rect`, `rotatedRect`, and `rotationTransform`. They have been replaced by `size` and `transform`. (#15890)
* API: Separates `PSPDFPageInfo`’s `rotation` property into `savedRotation` and `rotationOffset`. (#15890)
* API: Removes the `externalSignatureDelegate` property of `PSPDFSigner`. Use the `delegate` property instead, as it's intended to be more flexible. (#15853)
* API: Removes the synchronous signing methods in `PSPDFSigner`. It's more preferred to use the ones that are based on setting a custom `dataSource` or `delegate`, as they offer more flexibility. (#15853)
* API: Changes the parameters of the conversion functions between view and PDF coordinate spaces. (#15890)
* Adds API support for resetting form fields to the `PSPDFFormParser`. (#16808)
* Adds API to `PSPDFProcessorConfiguration` to apply redaction annotations. (#2127)
* Adds Comparison features. Adds `changeStrokeColorOnPageAtIndex:toColor:`, and `mergePageFromDocument:password:sourcePageIndex:destinationPageIndex:transform:blendMode:` to `PSPDFProcessorConfiguration`. (#16396)
* Adds `PSPDFAdditionalFontDirectories` option to configure additional font directories. (#13991)
* Adds `PSPDFDocumentSaveOptionApplyRedactions` to apply redactions when saving the document. (#2127)
* Adds `PSPDFSignerDataSource` and `PSPDFSignerDelegate` to be able to add digital signatures to documents asynchronously. (#15853)
* Adds `maximumContiguousIndexingTime` and `automaticPauseDuration` to `PSPDFLibrary` to configure the automatic pause. (#17026)
* Adds `outlineColor` to `PSPDFAnnotationStateManager`, and `PSPDFAnnotationStyleKeyOutlineColor` as a new annotation style key, to allow setting the outline color of redaction annotations. (#2127)
* Adds a configurable `privateKey` property to `PSPDFSigner`. For convenience, this property is already set for you if you use the most common `PSPDFSigner` subclass, `PSPDFPKCS12Signer`, as soon as you unlock the .p12 bundle. (#15853)
* Adds a new render option, `PSPDFRenderOptionDrawRedactionsAsRedacted`, to draw redactions in their redacted state. (#2127)
* Adds model-level support for redaction annotations via the new `PSPDFRedactionAnnotation` class. (#2127)
* Adds the ability to compare document pages via `PSPDFProcessorConfiguration`. Requires the PDF Comparison feature to be enabled in your license. (#16396)
* Adds support for bookmarks to Instant Document JSON. (#16165)
* Improves the performance of documents with a lot of JavaScript calculations. (#11925, #16490)
* Renames `PSPDFMarkupAnnotation` to `PSPDFTextMarkupAnnotation`, and its `highlightedString` property to `markedUpString`. (#16652)
* Fixes a bug where the reason or location of a digital signature may not be persisted in the document correctly. (#15853)
* Fixes a potential deadlock during document (re-)initialization. (#15005)
* Fixes a race condition that could result in an incorrect page count when using documentByAppendingDataProviders:. (#16994)
* Fixes a render rounding issue that may happen in PDF documents with a displaced cropbox. (#15169)
* Fixes an issue that caused problems saving new annotations in particular documents. (#16717)
* Fixes an issue when extracting link annotations. (#16854)
* Fixes an issue where JavaScript scripts that hold a strong local reference to event.target may not work correctly. (#16507)
* Fixes an issue where documents with a large number of form fields failed to display editing options. (#16911)
* Fixes an issue where form elements were not correctly updated. (#16408)
* Fixes an issue where importing images in push buttons via JavaScript may add an annotation in some cases. (#16751)
* Fixes an issue where not all form fields were listable immediately after opening a document. (#16479)
* Fixes an issue where some PDF pages could not be inserted as attachments for images. (#16729)
* Fixes an issue where some document outlines may not be persisted correctly after using the document processor. (#16688)
* Fixes an issue where some documents with JavaScript may be unresponsive for a great amount of time. (#16886)
* Fixes an issue where the blend mode of ink annotations may not be persisted correctly. (#16376)
* Fixes an issue where the system sound recorder could invoke messages on already deallocated delegates after recording a sound annotation. (#16743)
* Fixes an issue with JPEG2000 images. (#14850)
* Fixes an issue with document checkpointing after saving fails. (#16600)
* Fixes an issue with free text annotations reducing render quality after moving them around many times. (#16329)
* Fixes an locking issue that could result in a deadlock while saving document editor changes. (#16980)
* Fixes annotations created from Instant JSON being offset from their correct position in documents with non-uniform page sizes. (#16802, Z#10493)
* Fixes a performance problem with documents that contain large clipping paths. (#16481)
* Fixes a problem applying Instant Document JSON. (#16004)
* Fixes a problem rendering documents with particular fonts. (#16361)
* Fixes an issue where the selection indices may not be set correctly during JavaScript keystroke validation. (#17199)

#### Instant

* Adds support for image annotations. (#11957)
* Adds the ability edit link annotations in `PSPDFInstantViewController` via `editableAnnotationTypes`. (#16665)
* Add handling of `editableAnnotationTypes` in `PSPDFInstantViewController`. (#16139, Z#9855)

#### Examples

* Adds PSPDFCatalog example illustrating how to blur specific pages in a document. (#16702)
* Adds a PSPDFCatalog example illustrating how to disable auto saving and ask for permission for saving the document while exiting. (#16456)
* Adds an example showcasing how to enforce a fixed style for link annotations. (#16689)
* Adds support for opening files in place to the Catalog example. (#16497)
* Adds a PSPDFCatalog example showing show to replace `PSPDFNoteAnnotationViewController` with custom UI. (Z#10488)
* Changes the page rotation examples' title and description for better distinction. `PSCRotatePageExample.m` changes the orientation of the pages and saves it to the PDF making them permanent while `RotatePageExample.swift` rotates the pages of the document temporarily only for that opened instance. (#16996)
* Fixes an issue where documents did not open properly in the "Open In" example. (#16616)

### 7.7.2 - 23 Aug 2018

#### PSPDFKitUI

* Fixes an issue where iOS 12 could throw an exception inside `-[UIAccessibilityInformationLoader _loadAccessibilityInformationOnMainThread:]`. (#16489)
* Fixes an issue where a reused outline cell could have a custom text color set. (#16355)
* Fixes an issue where newly created annotations could have an incorrect fill color assigned in rare cases. (#16562)

#### Examples

* Adds a PSPDFCatalog example illustrating how create free text annotations continuously. (#15825)

### 7.7.1 - 9 Aug 2018

#### PSPDFKitUI

* Adds the selection tool to the default image configuration options. (#16109)
* Adds a new `markupAnnotationMergeBehavior` configuration option. (#16425)
* Improves form element behavior when the form field has scrolling disabled. (#13239)
* Improves top content inset calculations to cover more presentation scenarios. (#16020)
* Ensures text selection gestures are handled by a single page at a time. (#16374)
* Form submission actions that have a mailto URL now display the system mail composer with the form in the requested format attached. (#16072)
* Tapping a search result that changes to a different page now offers a back action to return to the previous page. (#16343)
* Fixes `PSPDFDocumentSharingViewController.selectedOptions` not being respected if set before the view controller is presented. (#15832)
* Fixes Drag and Drop support for `PSPDFDocumentEditorViewController` so that pages are always exported in the correct format if the destination application accepts PDF files. (#16230)
* Fixes a crash in the inline search manager through better sanitization. (#16226, Z#9937)
* Fixes an issue that caused newly added annotations to flicker when switching between drawing tools. (#16128)
* Fixes an issue where `PSPDFFontPickerViewController` subclasses did not honor the passed `fontFamilyDescriptors` completely. (#16306)
* Fixes an issue where `selectedPages` was not reset in `PSPDFDocumentEditorToolbarController` when setting a new `documentEditor` and caused `selectedPages` to be in an outdated state. (#16213)
* Fixes an issue where markup annotations were incorrectly created when tapping on an empty space. (#16189)
* Fixes an issue where newly created annotations could be inserted into the wrong document when switching tabs. (#16166)
* Fixes an issue where the search view controller would sometimes be displayed full-screen without a cancel button instead of being displayed as a popover. (#16378)
* Fixes an issue with using the tab bar controller when the document editor component was not licensed. (#16331)
* Fixes search results sometimes not being highlighted on page when tapping on a search result that is not on the current page. (#15236)

#### PSPDFKit

* Adds `-library:didFinishIndexingDocumentWithUID:success:` to `PSPDFLibraryDataSource`. (#16185)
* Adds `-library:didRemoveDocumentWithUID:` to `PSPDFLibraryDataSource`. (#16185)
* Adds `PSPDFRotatable` protocol that enables annotations to be rotated. (#16183)
* Annotations that are hidden or have the NoView flag set are no longer part of interactions. (#16344)
* Clarify requirements for custom `UID` values on `PSPDFDocument`. (Z#9936)
* Ensures `PSPDFDocument.title` is updated when the document is unlocked. (V#1599)
* Ensures that `PSPDFLibrary` stops indexing when the application is terminating. (#16212)
* Image documents now correctly report that bookmarks are not supported. (#16138)
* Fixes an issue where an assertion is raised when adding an annotation while the underlying file for a `PSPDFDocument` is being changed. (#16276)
* Fixes `PSPDFDocument.title` not being updated when the title is changed by an instance of `PSPDFDocumentPDFMetadata`. (#16193)
* Fixes a crash that would occur when trying to edit a document after having duplicated pages. (#16360)
* Fixes a race condition during undo registration that could result in a bad memory access. (#16216)
* Fixes an issue where `PSPDFLibraryFileSystemDataSource` would remove previously indexed documents when adding a document in explicit mode. (#16185)
* Fixes an issue where calling JavaScript function AFSpecial_Keystroke with certain arguments may cause an infinite loop in some devices. (#16126)
* Fixes an issue where form elements were not detected by `PSPDFDocument` (when using `PSPDFFileAnnotationProvider`). (#16161)
* Fixes an issue where radio buttons could be unselected. (#16233)
* Fixes drawing annotations on rotated pages. (#16183)
* Fixes an issue when loading checkpoint files. (#16277)

#### Examples

* Adds a PSPDFCatalog example illustrating how to disable bookmark editing. (#16416)
* Adds a PSPDFCatalog example illustrating how to use a custom bookmark cell to disable renaming of bookmarks. (#16358)

### 7.7.0 - 19 Jul 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-ios-7-7/)._

#### PSPDFKitUI

* API: `PSPDFTextMenu` is now an extensible enum string. This changes how Swift imports the strings. (#15789)
* Deprecates `-[PSPDFViewControllerDelegate pdfViewControllerDidChangeControllerState:]` in favor of `-[PSPDFViewControllerDelegate pdfViewController:didChangeControllerState:error:]`. (#9087)
* Deprecates `-[PSPDFPageView showSignatureControllerAtRect:withTitle:options:animated:]`. Use `showSignatureControllerAtRect:signatureFormElement:options:animated:` instead. (#15788)
* Deprecates `insertAnnotations:` and `insertAnnotations:forPageAtIndex:inDocument:` on `PSPDFPageView`. To know when annotations are inserted, listen for `PSPDFAnnotationCreateActionDidInsertNotification` instead. To add annotations, use `addAnnotations:options:` on `PSPDFDocument`. Set the `pageIndex` on an annotation before adding it to define the page. (#15788)
* Deprecates the filtering API on `PSPDFThumbnailViewController` in favor of a new, more flexible asynchronous API. (#14572)
* Deprecates `showNoteControllerForAnnotation:showKeyboard:animated:` on `PSPDFPageView`. Use `showNoteControllerForAnnotation:animated:` instead. (#15788)
* Adds Document Info view controller: `PSPDFDocumentInfoViewController`. (#12227)
* Adds Document Info view to the outline and annotation list. (#12227)
* Adds Document Security view controller. `PSPDFDocumentSecurityViewController`. (#12227)
* Adds Safari Reading List, Copy and Share to the menu shown when long pressing on web links. (#13798)
* Adds `PSPDFAnnotationCreateActionDidInsertNotification` and `PSPDFAnnotationCreateActionInsertedAnnotationsKey` to get better timing for newly inserted annotations. (#15788)
* Adds `PSPDFDocumentSharingOptionImageWithMetadata` to `PSPDFDocumentSharingOptions`, and adds it to the default sharing configurations. This only takes effect when sharing `PSPDFImageDocument`s. (#15432)
* Adds `PSPDFSegmentImageProviding` protocol implemented by controllers used in `PSPDFDocumentInfoCoordinator`, to provide image in place of title. (#13677)
* Adds a way to add multiple pages to a document using a specified configuration, via API and user interface. (#13937)
* Adds support for the Info action on documents, which now displays the new document metadata view controller. (#15987)
* Adds the ability to insert new pages at specific indexes with `PSPDFNewPageViewController`. (#13880)
* Adds the ability to cut and paste pages when editing a document. (#15754)
* Improves export flow for image documents. (#15432)
* Improves page curl to better adapt to documents that don't match device screen ratio. (#15786)
* Improves performance during drawing by avoiding unnecessary page re-rendering. (#16032)
* Improve performance when scrolling page content when zoomed in. (#16029)
* Pages now use predictive rendering while scroll deceleration is active to improve render performance. (#15542)
* Replaces title texts with icons in the document info UI. (#13677)
* Solves flickering on the annotation list for PDF forms. (#14881)
* The digital signature verification popover now uses a better sizing logic. (#15942)
* The note editor is now displayed with form presentation mode on an iPhone Plus. (#4488)
* `PSPDFDocumentEditorViewController` now supports importing and exporting images and PDFs from other applications via Drag & Drop in iOS 11 and above. (#15812)
* Fixes `PSPDFConfiguration.editableAnnotationTypes` not being respected for note annotations. (#15779)
* Fixes a crash that occurred when rotating in page curl mode. (#15765)
* Fixes a crash when using custom page templates on `PSPDFNewPageViewController`. (#15857)
* Fixes an issue where `PSPDFResizableViewDelegate` methods were not called for custom `PSPDFResizableView` subclasses. (#15762)
* Fixes an issue where `PSPDFViewController` would not fully reload when appearing in some uncommon cases. (V#1309, V#1609)
* Fixes an issue where a page image from a document previously used with `PSPDFViewController` might be shown instead of the page of the current document. (#15932)
* Fixes an issue where annotations could be displayed mirrored or more than once after drawing. (#15770)
* Fixes an issue where changing `PSPDFConfiguration.isFirstPageAlwaysSingle` was not honored after being changed. (#15819)
* Fixes an issue where newly added image annotations did not respond to touches. (#15667)
* Fixes an issue where using buttonImport on forms via JavaScript could break the default image annotation insertion feature. (#15731)
* Fixes misalignment of text in `PSPDFNewPageViewController` when presented as full screen. (#15471)
* Fixes reference cycles in `PSPDFDownloadManager` and `PSPDFGalleryViewController`. (#16018)
* Fixes the "Open In" activity not working when sharing documents using `PSPDFDocumentSharingOptionImage`. (#16028)
* Fixes the timing for `-[PSPDFDocumentViewControllerDelegate documentViewController:didCleanupSpreadView:forSpreadAtIndex:]` and `PSPDFDocumentViewControllerDidCleanupSpreadViewNotification`. They are now correctly dispatched during spread cleanup (reuse) and not when the spreads go offscreen. (#16032)

#### PSPDFKit

* API: Adds `isUnlockedWithFullAccess` property to `PSPDFDocument`. (#12227)
* API: Improves type safety of `PSPDFDocumentPDFMetadata` keyed subscript access. (#12227)
* API: Introduces dedicated types for annotation variants (`PSPDFAnnotationVariantString`) and state-variant identifiers (`PSPDFAnnotationStateVariantID`), and updates all related APIs to correctly consume and vend the new types. (#14238)
* Deprecates `PSPDFDiskCache`’s `jpegCompression` in favor of `compression`. (#14075)
* Deprecates `PSPDFProcessorSkipPDFCreationKey` since it no longer does anything. (#15894)
* Deprecates the rotation property on `PSPDFAnnotation` and adds the same property on the subclasses `PSPDFFreeTextAnnotation` and `PSPDFStampAnnotation`. (#15894)
* Adds `isEncryptedWithUserPassword`, `isUnlockedWithFullAccess`, `isUnlockedWithUserPassword` properties to `PSPDFDocumentProvider`. (#12227)
* Adds `permissionsLevel` property to `PSPDFDocumentProvider` to indicate access level of opened document. (#12227)
* Adds support for JavaScript do not disturb mode. In that mode, if code tries to show an alert message, it will be automatically translated into a console log instead. This is useful in the batch processing of form fields that may have validation scripts attached. You can configure this mode via the `javaScriptStatus` property of `PSPDFDocument`. (#15498)
* Adds support for extracting and attaching binary Instant JSON attachments. (#15834)
* Adds support for rendering borders and border colors in link annotations. (#15566)
* Adds image attachments to Instant Document JSON. (#15748)
* Improves document password support and compatibility with third-party readers. (#15951)
* Improves the performance of the document searcher, specially in devices with low memory. (#15916)
* Improves hash call performance for lazily evaluated actions. (#13917)
* Ensures that the processor always encrypt documents using the 128-bit AES algorithm if the user didn't change the defaults. (#15946)
* Removes incorrect `PSPDF_CLASS_AVAILABLE` annotation from `PSPDFDocumentEditorConfiguration`. Subclassing this class is not supported, and has now been marked with `PSPDF_CLASS_AVAILABLE_SUBCLASSING_RESTRICTED`. (#15147)
* `PSPDFDocumentEditor` now returns `NSProgress` when calling `importPagesTo:fromDocument:withCompletionBlock:queue:` for better status tracking. (#15918)
* Fixes `PSPDFFile.fileURL` returning an empty `NSURL` when initialized with a `nil` `fileURL`. (#16120)
* Fixes a crash that could occur after adding an annotation deserialized from Instant JSON. (#14815, Z#9340)
* Fixes a problem where a form field may not be automatically formatted in some cases. (#15567)
* Fixes a problem where entering text in some form fields with JavaScript validation may not be possible. (#15864)
* Fixes a problem where some XFA forms with JavaScript may show an alert message when the document is open. (#16000)
* Fixes a race condition that could lead to an assertion failure through improved locking. (#15548)
* Fixes a rare issue adding page references with the document editor. (#14705)
* Fixes an issue exporting document pages with a rare outline configuration. (#15923)
* Fixes an issue where a new digital signature could not be created in some documents. (#15683, #15702)
* Fixes an issue where bookmarks may not be saved correctly in certain documents. (#15826)
* Fixes an issue where rendering was being incorrectly canceled. (#15685)
* Fixes an issue where the library tokenizer was nil after creating the library with `+[PSPDFLibrary libraryWithPath:tokenizer:error:]`. (#15991)
* Fixes memory leaks that occurred when using `PSPDFProcessor`. (#15767)
* Fixes serialization and deserialization of the `PSPDFURLAction.unmodifiedURL` URL property. (#13990)

#### Instant

* Add support for notes on annotations that support them. (#15511)

### 7.6.2 - 28 Jun 2018

#### PSPDFKitUI

* Fixes `PSPDFConfiguration.editableAnnotationTypes` not being respected for note annotations. (#15779)
* Fixes a crash that occurred when rotating in page curl mode. (#15765)
* Fixes an issue where newly added image annotations did not respond to touches. (#15667)
* Fixes an issue where using buttonImport on forms via JavaScript could break the default image annotation insertion feature. (#15731)

#### PSPDFKit

* Fixes a crash that could occur after adding an annotation deserialized from Instant JSON. (#14815, Z#9340)
* Fixes an issue where a new digital signature could not be created in some documents. (#15683, #15702)

### 7.6.1 - 14 Jun 2018

#### PSPDFKitUI

* Fixes an issue that could cause blank pages in per page and continuous page modes. (#15504)
* Fixes an issue with `PSPDFImagePickerController` where `allowedImageQualities` was ignored if the image editor was disabled. (#15599)

#### PSPDFKit

* Improves image document saving performance. (#15540)
* Adds the ability to print image documents. (#15375)
* Image quality for JPEG now used in Image Documents. (#15499)
* Validation errors generated by JavaScript code are now localized in every language that is currently supported. (#14577)
* Fixes mistaken API rename for -[PSPDFDocument fileURLs]. (#15660)
* Fixes an issue with vector stamp annotations becoming grey when moving or resizing them. (#15345)
* Fixes an issue when closing documents with smart form tab orders. (#15580)
* Fixes an issue where a form field may be rendered more times than necessary. (#15528)
* Fixes an issue where annotation additional actions may not be preserved after a document is saved. (#2185)
* Fixes growing image document after save. (#15479)

### 7.6.0 - 30 May 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-ios-7-6/)._

In preparation for iOS 12, this version of PSPDFKit now drops support for iOS 9. It also requires and is built with Xcode 9.4 (9F1027a).
The new Image Documents component, which enables you to keep `PSPDFImageDocument`s editable even after saving, requires an updated license.

We prepared a [migration guide](https://pspdfkit.com/guides/ios/current/migration-guides/pspdfkit-76-migration-guide) to help you with some of the API changes in this version.

#### PSPDFKitUI

* Deprecates `PSPDFDrawLayer` related public APIs on `PSPDFDrawView`. (#14921)
* Adds `-pdfViewController:shouldSaveDocument:withOptions:` and `-pdfViewController:didSaveDocument:error` to `PSPDFViewControllerDelegate`. (#14910)
* Adds blend modes to the annotation inspector. The ink highlighter by default now uses a multiply blend mode for clear, black text. (#15080)
* Adds customization options for `PSPDFNoteAnnotationViewController`. (#15305)
* Improves comment author display in `PSPDFCommentCell` to accommodate longer author names. (#15065)
* Improves layout of the buttons on `PSPDFSignatureViewController` by making them respect the safe area and dynamic type. (#15063)
* Improves state restoration to restore and persist selected annotations. (#14935)
* Improves support for Dynamic Type, particularly for larger accessibility sizes. (#14788)
* Improves the layout of the stamps grid, to always look reasonably dense, while keeping the stamps big enough to read. (#13675)
* Changes the default state of the Store Signature checkbox to be disabled to not store the created signature without users explicitly checking it. (#15250)
* Makes selection experience more consistent across platforms. (#14729)
* Makes the custom stamp option in the stamps UI more apparent. (#1824)
* Moves 'Saved Annotations' to its own annotation toolbar item, as opposed to being a tab on the stamps UI. (#1824)
* Setting the `doNotScroll` property on a form text field now works correctly. (#14926)
* Sharing with `UIActivityViewController` now only includes the document, not the title as well. This fixes a Text File being created alongside the PDF when exporting files. (#12782)
* The `userInterfaceViewMode` setting now defaults to `.automaticNoFirstLastPage`. (#15077)
* The behavior of `scrollOnTapPageEndEnabled` has been changed to be enabled by default again and reacting immediately, without waiting for a potential double tap gesture. The edge span where taps are accepted `scrollOnTapPageEndMargin` has been reduced to 44 pixels. The default for `scrollOnTapPageEndAnimationEnabled` has been changed to NO. This allows fast tapping through a document. (#13098)
* The home indicator on iPhone X is now automatically hidden when the HUD is not visible. (#15006)
* `-[PSPDFTextSelectionView sortedGlyphs:]` now sorts the passed in glyphs in their reading order. (#15400)
* `PSPDFConfiguration`'s `scrollOnTapPageEndMargin` and `scrollOnTapPageEndAnimationEnabled` is now honored when using `PSPDFPageTransitionCurl`. (#15333)
* Fixes `-[PSPDFConfiguration shadowOpacity]` not being honored for configurations where the page transition was set to `PSPDFPageTransitionScrollPerSpread`. (#15369)
* Fixes a crash in that could occur when selecting text if the initial selection did not contain any valid characters. (#15445)
* Fixes a document's table of contents' colors not being shown correctly. (#15295)
* Fixes a rare issue that could lead to a crash in `PSPDFResizableView` layout when rotating rapidly. (#15410)
* Fixes an issue where comments would not scroll out from underneath the keyboard or toolbar on iOS 10 in `PSPDFNoteAnnotationViewController`. (#15415)
* Fixes an issue where drawing a signature area was not possible when digitally signing a document via the `PSPDFPageView` signature API. (#14765)
* Fixes an issue where embedded videos with autoplay enabled would start playing before their page was visible. (#14662)
* Fixes an issue where the font size for a form element was calculated wrong. (#15274)
* Fixes an issue where the printing UI wouldn't prevent interactions with the rest of the application, breaking the printing flow. (#10480)
* Fixes issues with pages not being displayed in page curl mode. (#15280)
* Fixes layout of saved annotations and stamps UI on iPhone X. (#1824)
* Fixes text alignment for text field cells. (#15304)
* Fixes the text insertion point not always staying in the visible area while writing comments on annotations. (#14201)

#### PSPDFKit

* The minimum deployment target is now iOS 10. Support for iOS 9 has been removed. (#14398)
* API: The configuration builder blocks in `PSPDFBaseConfiguration` are now noescape for better Swift compatibility. (#15077)
* API: The constants in `PSPDFAnnotationStyleManager` have been renamed and now better map to Swift. (#15077)
* API: `PSPDFDocument.annotationsForPageAtIndex:type:` is now guaranteed to never return nil. (#15077)
* Deprecates `PSPDFFileAnnotation`’s `appearanceName` in favor of `iconName`. (#15319)
* Deprecates class-level methods on `PSPDFProcessor` and introduces new new instance-based API that allows for cancellation. (#10480)
* Adds the ability to keep annotations on `PSPDFImageDocument`s editable even after saving. Requires the Image Documents feature to be enabled in your license. See https://pspdfkit.com/blog/2018/image-documents/ for more information. (#14894)
* Adds an external file source option when adding new pages to a document with the document editor. (V##248)
* Adds blend modes to Annotations. This improves rendering for appearance steams with different blend modes. (#15080)
* Adds the ability to define arbitrary patterns for new pages when editing a document. (#14951)
* Adds the ability to embed files to `PSPDFFileAnnotation` using `-[PSPDFEmbeddedFile initWithFileURL:fileDescription:]`. See the new `AddFileAnnotationProgrammaticallyExample` and `AddFileAnnotationWithEmbeddedFile` in PSPDFCatalog. (#15210)
* Improves JavaScript support, including form formatting, calculation, and validation. (#9501)
* Improves XFDF output by omiting `opacity` if set to the default (1.0). (#15354)
* Improves rendering behavior for stamp annotations. Stamps are keeping their aspect ratio on resizing now. Stamps created with PSPDFKit now always use the same rendering, no matter if they were just created or after being saved in the document. The subject of stamps is now always rendered in uppercase characters. Custom stamps are now sized-to-fit before adding them to the document. (#1824)
* Adds annotation `name` to Instant JSON. Also renamed `pspdfkit/file` `name` to `filename` to prevent collisions. (#14856)
* Adds better detection for standard stamp subjects for Instant JSON. (#14919)
* Cancelling a `PSPDFRenderTask` now reduces further CPU usage more effectively. (#14218)
* `PSPDFPageRenderer` is now deprecated and will be removed in a later update. (#15189)
* Fixes a crash which occurred when manually searching a protected document. (#15177)
* Fixes a potential deadlock situation during document cache invalidation. (#15259)
* Fixes an issue where glyph frames were larger than expected due to unexpected values in their fonts. (#14169)
* Fixes an issue where newly created note annotations would require two taps for deselection. (#15221)
* Fixes security vulnerability CVE-2018-9127 in Botan, where wildcard certificates could be accepted for invalid hostnames. (#15374)
* Fixes an issue where some action destinations may not work properly. (#14901)
* Fixes a problem where editing some numeric form fields didn't show a completely numeric keyboard. (#15484)

#### Instant

* Adds support for Instant Layers: https://pspdfkit.com/blog/2018/instant-layers/ (#13834)
* Adds support for exporting and importing stamp annotations with images for Instant JSON. (#15296)
* Improves error reporting regarding invalid JWTs. (Z#8755)
* Deprecates all methods in `PSPDFInstantClientDelegate` in favor of renamed methods to improve API clarity and consistency. (#13834, #15464)
* Deprecates `PSPDFInstantDocumentDescriptor`’s `updateAuthenticationToken:` and `downloadDocumentUsingAuthenticationToken:error:` in favor of the more specific `reauthenticateWithJWT:` and `downloadUsingJWT:error:`. (#13834)
* Deprecates the notifications `PSPDFInstantDidUpdateAuthenticationTokenNotification`, `PSPDFInstantDidFailUpdatingAuthenticationTokenNotification`, and related `PSPDFInstantAuthenticationTokenKey` in favor of the notifications `PSPDFInstantDidReauthenticateNotification`, `PSPDFInstantDidFailReauthenticationNotification`, and the related `PSPDFInstantJWTKey`. (#13834)

#### Examples

* Adds a PSPDFCatalog example illustrating how to use a custom bookmark provider. (#15105)
* Improves the Catalog's listing of examples. The Catalog now lists all the examples in the selected language. If an example is not available in the particular language selected, then the example in the other language is listed. (#15100)

### 7.5.2 - 4 May 2018

#### PSPDFKitUI

* Fixes an issue where selection would work incorrectly if a page was cropped or rotated. (#15042)
* Fixes the spread zoom not always being reset when scrolling back to a spread in the `.scrollPerSpread` `pageMode`. (#14825)

#### PSPDFKit

* Fixes an issue where glyph frames were incorrectly calculated when the page matrix is not identity. (#13668)

### 7.5.1 - 25 Apr 2018

#### PSPDFKitUI

* Adds a `signer` subclassing hook to `PSPDFSignatureViewController`, enabling setting the certificate used for digital signing programmatically. This makes it possible to only allow the user to create a digital signature, instead of an ink signature. (#14846)
* Fixes an issue where a crash could occur if `PSPDFNoteAnnotationViewController` changed size while it was presenting an action sheet. (#14742)
* Fixes a keyboard avoidance offset issue during interactive keyboard dismissal. (Z#8690)
* Fixes document pages not being selected when the thumbnail was tapped on the bottom half. (#14764)

#### PSPDFKit

* Improves compatibility of note annotations with certain 3rd-party viewers such as Apple Preview. (#14953)
* Improves performance when annotations are loaded. (#14983)
* Improves the logic when note icon indicators should be rendered. (#14961)
* Saving image documents now keeps any additional extended attributes. (#14905)
* Fixes a problem where the text in unsigned form field overlays may be cut off. (#14922)
* Fixes an issue where images could be encoded in the PDF without optimization. (#14916)
* Fixes an issue where recording couldn’t be started for an existing sound annotation. (#15010)

### 7.5.0 - 11 Apr 2018

#### PSPDFKitUI

* API: Adds a `textView` parameter to `-[PSPDFNoteAnnotationViewController updateTextView]`. Customize the object passed to `updateTextView:` instead of using the `textView` property. (#5721)
* API: Deprecates `PSPDFNoteAnnotationViewController`’s `allowEditing`, `beginEditing`, `showCopyButton`, `deleteAnnotationActionTitle`, `deleteAnnotation:`, `deleteOrClearAnnotationWithoutConfirmation`, `textView`, and `borderColor`. (#5721)
* API: Groups `PSPDFKitThumbnailViewFilter*` constants as extensible string enum. (#14571)
* API: Removes the `tapGesture` property on `PSPDFNoteAnnotationViewController` and the class no longer conforms to `UIGestureRecognizerDelegate`. (#5721)
* API: `PSPDFPageView` is no longer guaranteed to conform to `PSPDFNoteAnnotationViewControllerDelegate`. (#5721)
* API: Deprecates `shouldBeginEditModeWhenPresented` on `PSPDFNoteAnnotationViewController`, and `showNoteControllerForAnnotation:showKeyboard:animated:` in favor of `showNoteControllerForAnnotation:animated:` on `PSPDFPageView`, as choosing to show the keyboard is now decided based on heuristics, if the user might want to start editing. (#14205)
* Adds UI to `PSPDFNoteAnnotationViewController` that enables the user to see existing reviews for a comment, add their own review status, or change their review status. (#14421)
* Adds document type attribute to document load analytics event. (#14732)
* Adds showing and adding annotation replies in `PSPDFNoteAnnotationViewController`. Replies will no longer be shown on the page. (#5721)
* Adds support for `-[PSPDFConfiguration scrollOnTapPageEndEnabled]` in page curl layouts. (#13302)
* Improves `PSPDFPageModeAutomatic` behavior in connection with `PSPDFPageTransitionScrollContinuous`. This now always prefers single pages to take better use of the available screen real estate. (#14822)
* Improves the layout of the search view controller on devices with bottom safe area insets. (#12969)
* Improves type safety by removing the `__kindof` type annotation from `-[PSPDFDrawView annotations]`, `-[PSPDFPageView passthroughViewsForPopoverController]`, and `-[PSPDFPageView selectedAnnotations]`. This only affects Objective-C. (#14490)
* Changing page by tapping on page edges is now disabled by default. To enable this, change `PSPDFConfiguration.scrollOnTapPageEndEnabled` to `YES`. (#14418)
* Ensures that `PSPDFAnalyticsEventNameAnnotationCreationModeExit` is always logged. (#14839)
* Ensures that the optional analytics provider tracks log deletion for all cases. (#14817)
* Removes ellipses in menu items (`UIMenuItem`) because there is no standard convention for this on iOS and space can be scarce. For example ‘Inspector…’ is now ‘Inspector’. (#14235)
* Fixes an issue that could result in a crash when the size class changes while in a page curl layout. (#14555)
* Fixes an issue that makes the page curl left or right align pages even though it is in single page mode. (#14555)
* Fixes an issue that triggered a page change animation in page curl in some cases even though the page was already visible. (#14528)
* Fixes an issue where `PSPDFPageView` would display a wrong page in rare occasions. (#14442)
* Fixes an issue where annotations with the Invisible, Hidden, or NoView flags set could be tappable. (#14772)
* Fixes an issue where pages were not animating into place when showing or hiding the inspector. (#13627)
* Fixes an issue where paginated layouts would drift by a fraction of a point with every page if `PSPDFViewController` is set to a non-integer size in the direction of scrolling. (#14543)
* Fixes annotations shown as overlays (notes) not respecting the Invisible, Hidden, and NoView flags. (#5721)

#### PSPDFKit

* API: Deprecates `PSPDFAnnotationOptionUserCreatedKey`. (#14669)
* API: Renames `PSPDFSignatureHashAlgorithmSHA386` to `PSPDFSignatureHashAlgorithmSHA384` which is actually the correct name. (#13932)
* API: `tryLoadAnnotationsFromFileWithError:` has been removed from `PSPDFFileAnnotationProvider`. Use `loadAnnotationsWithError:` instead to customize annotation loading. (#14570)
* API: Deprecates `PSPDFTextBlock.glyphs`, `PSPDFWord.glyphs`, and `PSPDFSelectionState.selectedGlyphs` in favor of `NSRange`-based APIs. (#14606)
* API: Adds `isGenerated` to `PSPDFGlyph` to check if the glyph is an autogenerated filler. (#14606)
* API: `PSPDFGlyph.indexOnPage` is not `-1` to indicate that it is a generated filler. Use `PSPDFGlyph.isGenerated` instead. `indexOnPage` can now be used to uniquely identify a glyph on a page, and is the index of the glyph in the `PSPDFTextParser.glyphs` array. (#14606)
* Adds `createdAt`, `updatedAt` and `creatorName` to Instant JSON. (#14443)
* Adds `isReply` and `inReplyToAnnotation` properties on `PSPDFAnnotation`. (#5721)
* Adds properties for author-specific state on `PSPDFNoteAnnotation`. (#5721)
* Improves cleaning up resources in `PSPDFDocument`'s `dealloc`. (#14586)
* Improves performance when examining document permission features. (#14747)
* Improves text selection performance in documents with a lot of text. (#14516)
* Filters out invalid characters from a page's text. (#14516)
* Performance improvements for documents with many data sources. (#14651)
* Removing an annotation with `removeAnnotations:options:` on `PSPDFAnnotationManager` or `PSPDFDocument` now also removes replies to that annotation. (#14385)
* The relationship between `PSPDFXFDFAnnotationProvider` and `PSPDFFileAnnotationProvider` is now more explicit. If you use XFDF for form filling, you now need to keep around both providers. Furthermore, the annotation manager now only saves into the first annotation provider implementing the save method. Previously all were called, which could have led to incorrect results. (#14323)
* Fixes a crash that could happen during application termination. (#14483)
* Fixes a lock inversion when setting up the document providers. (#14525)
* Fixes a potential crash when saving a document. (#14082)
* Fixes a potential issue when removing annotations. (#14381)
* Fixes an issue that prevented correct caching of rendered pages. (#14390)
* Fixes an issue where `-[PSPDFTextParser textWithGlyphs:]` would exclude the last glyph. (#14636)
* Fixes an issue where a flattened document shows a blank page in Preview. (#13708)
* Fixes an issue where action destinations would not be found if sorted incorrectly. (#14412)
* Fixes an issue where document checkpoints were not loaded for decoded document instances. (#14624)
* Fixes an issue where image data wasn't properly removed after rewriting the PDF. (#14708)
* Fixes an issue where searching for text in a document would return results with empty text blocks. (#14516)
* Fixes an issue where some `PSPDFDocumentSecurityOptions` initializers would sometimes return nil. (#14646)
* Fixes an issue where the documents `features` sometimes returned an incorrect value when called right after creating a `PSPDFDocument`. (#14574)
* Fixes an issue where using a custom bookmark provider with readonly documents disabled adding and editing bookmarks. (#14574)
* Fixes animated GIF images support in the gallery. (#13897)
* Fixes document corruption issue when document has a header and is incrementally saved. (#14249)
* Fixes pages not being centered when zooming is disabled in landscape. (#14091)

#### Instant

* Improves type safety by removing the `__kindof` type annotation from `-[PSPDFInstantDocumentDescriptor annotationWithIdentifier:forDocument:error:]`. This only affects Objective-C. (#14490)

#### Examples

* Adds PSPDFCatalog example illustrating how to rotate pages in 90 degree steps. (#14445)
* Adds a PSPDFCatalog example illustrating how to add a custom filter by subclassing `PSPDFThumbnailViewController`. (#14380)
* Fixes Catalog "XFDF Annotation Provider, Encrypted" example. (#13912)
* Fixes an issue where the Document Editor icon was not visible in `NewPageFromDocumentExample.swift` and `ProgrammaticDocumentEditingExample.swift`. (#14641)

### 7.4.1 - 19 Mar 2018

#### PSPDFKitUI

* Fixes an issue where enabling link annotation editing would not work. (#14477)
* Fixes an issue where pages had a gap between them in page curl layout. (#13329)

#### PSPDFKit

* Adds `PSPDFAESCryptoDataSink`. (#13912)
* Fixes an issue where the deletion of an annotation could not be undone properly. **Important:** Calling `removeAnnotations:options:` on a `PSPDFFileAnnotationProvider` no longer posts `PSPDFAnnotationChangedNotification`! Deleted annotations are still being returned from `dirtyAnnotations` until the next save — like before. They are, however, not returned from `annotationsForPageAtIndex:` anymore. This behavior is also far less surprising. (#14305)
* Fixes a document corruption bug when the document has a header and is incrementally saved. (#14249)
* Fixes Catalog "XFDF Annotation Provider, Encrypted" example. (#13912)
* Fixes an animation glitch when rearrange pages with the document editor. (#14367)
* Fixes an issue where `PSPDFTextParser.glyphs` could be incorrect for certain documents. (#10844)
* Fixes an issue where dropdown arrow on combo boxes are not seen when box has a small width. (#14326)
* Fixes an issue where dropdown arrows are still seen on combo boxes when document is flattened. (#9539)
* Fixes issue where `pdfId` was required when importing a Instant JSON document. (#14494)
* Fixes potential deadlocks during annotation rendering. (#14534)
* Fixes an issue where opening large documents with marked content used very large amounts of memory. (#14415)
* Fixes potential deadlocks when opening a lot of documents. (#14503)
* Fixes an issue where `PSPDFFile.fileData` did not lazily memory map the file data when being called from user code. (#14539)

### 7.4.0 - 2 Mar 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-ios-7-4/)._

#### PSPDFKitUI

* API: Replaces `firstLineRect`, `lastLineRect`, and `innerRect` properties of `PSPDFTextSelectionView` with `rectForFirstBlock`, `rectForLastBlock`, and `selectionRects`. (#9677)
* Adds a PSPDFCatalog example illustrating how to create a form programmatically. (#14215)
* Adds a PSPDFCatalog example illustrating how to use the Instant JSON Annotation and Document APIs. (#14087)
* Adds an overlay message shown when digitally signing a document without a form field. (#13583)
* Adds support for selecting vertical text. (#322)
* Improves compatibility with the React Native view component. (#14222)
* Improves performance by only creating the text selection view's text parser when required. (#14291)
* Improves performance when sharing file-based documents via the Open In activity. (#14011)
* Improves visualization of thumbnails, especially when filtering for bookmarked or annotated pages. (#12512)
* Improves text selection using `PSPDFTextSelectionView` by selecting text in distinct blocks. (#322, #9677)
* Improves performance when editing free text annotations. (#13971)
* Improves scrolling and zooming performance. (#13971)
* Changes the inspector to use the annotation type as the title instead of Style. (#14057)
* Tapping to select an annotation in multi-select mode now works again. (#11432)
* Fixes a crash that happened when adding stamp annotations with 3rd party stylus support enabled. (#14086)
* Fixes an issue where annotation notes were not editable on iPhone with iOS 9. (#14323)
* Fixes an issue where bookmarks could be created but not saved into a document. (#9107)
* Fixes an issue where content insets were not respected in searchable choice form elements while searching. (#13987)
* Fixes an issue where switching between documents with different page bindings didn't update the scroll direction correctly. (#13849)

#### PSPDFKit

* API: `-[PSPDFContainerAnnotationProvider clearNeedsSaveFlag]` now **asserts that it is called inside a write block**! For more details, please refer to the documentation of `PSPDFContainerAnnotationProvider(SubclassingHooks)`. (#14181)
* API: Certain types in Swift have been renamed to improve interoperability. (#10491)
* API: Deprecates `encryptionAlgorithm` in `PSPDFPrivateKey`, in favor of `signatureEncryptionAlgorithm`, which is enum-typed. (#13940)
* API: `PSPDFDocumentSecurityOptions` initializers may return error instead of assert. (#10491)
* Adds `PSPDFDocumentFeatures` as a central place for checking the availability of various features. (#9107)
* Adds a PSPDFCatalog example illustrating how to generate a PDF document on a mobile device without any server use. (#13776)
* Adds a new protocol, PSPDFExternalSignature, that can be used to provide a digital signature for a document externally. (#13940)
* Adds an example `UpdateConfigurationWhenRotatingExample.swift` for changing the configuration when rotating the device. (#13820)
* Adds support for automatic access tracking for security scoped URLs. (#13863)
* Adds the `shouldTrackDeletions` class property to `PSPDFContainerAnnotationProvider` to customize the effect of `removeAnnotations:options:` on `dirtyAnnotations`. See `PSPDFContainerAnnotationProvider.h` for more information. (#8839)
* Adjusts the gap between two pages in continuous scroll mode. (#13877)
* Changes the localized description of empty note annotations from Text to Note (localized). (#14057)
* Improve error messages when digitally signing a document failed. (#13741)
* Shows an error message when digitally signing failed instead of throwing an exception in some cases. (#13741)
* PSPDFTextParser now respects reading order of text blocks defined in the PDF using Marked Content. (#9677, #322)
* Fixes FTS5 search on SQLite versions >= 3.20.0. (#14036)
* Fixes a deadlock when calling `removeAllAnnotationsWithOptions:` on an instance of `PSPDFContainerViewController` or a subclass and clarifies locking requirements. (#14178)
* Fixes an assertion when a non-specified named action was deserialized via Instant JSON. (#13804)
* Fixes an issue saving a document with invalid PDF syntax (empty dictionary key). (#14009)
* Fixes an issue where `-[PSPDFAnnotation annotationFromInstantJSON:documentProvider:error:]` attached the annotation to the document. (#14140)
* Fixes an issue where some annotations in a custom annotation provider were not rendered properly. (#12762)
* Fixes an issue where some form fields with custom FQNs may not be signed correctly. (#14309)
* Fixes an issue where the hash of two equal PSPDFAnnotation objects could be different. (#13852)
* Fixes an issue where the wrong font was selected. (#14027)
* Fixes crashes on document unload when FormTabOrderCalculator is being processed. (#13976)
* Fixes issue with text selection in certain cases. (#13803)
* Fixes potential crash when saving files with irregular outlines. (#14116)
* Fixes the issue where `PSPDFDocument.hasDirtyAnnotations` would return `NO` after removing an annotation from a custom annotation provider. (#8839, Z#5114)

#### Instant

* Adds `PSPDFInstantErrorInvalidURL` and stricter validation of the server URL to PSPDFInstantClient’s initializer. (#14158)
* Improves recovery from network failures during sync by monitoring reachability of the Instant server. (#11901, Z#7385)

### 7.3.1 - 26 Jan 2018

#### PSPDFKitUI

* Adds the ability to undo clear actions while editing free text annotations. (#13828)
* Improves touch handling for the scrollable thumbnail bar mode for documents with only a few pages. (#13861)
* Fixes a crash that occur if shake to undo is invoked during free text editing. (#13829)
* Fixes an issue where presented annotations toolbar was not updated after changing controller's `PSPDFConfiguration`. (#13858)
* Fixes an issue where tapping a free text annotation while selected doesn't start editing on 3D Touch compatible devices, or when using Apple Pencil. (#11424)
* Fixes an issue where the displayed page labels were incorrect when switching layouts right after initialization. (#13824)
* Fixes an issue which switching to the correct page when rotating from a double to a single page mode. (#13887)
* Fixes an issue with restoring the view state when rotating while in a page curl layout. (#13823)
* Fixes missing search bar in the outline and annotation list on iOS 11, if the corresponding view controllers were presented without being wrapped in a navigation controller. (Z#7994)
* Fixes the last stroke drawn in an ink annotation with opacity below 100% appearing too dark until the annotation is deselected. (#13895)
* Fixes `overrideClass:withClass:` in the configuration not working with `PSPDFPageView`. (#13881)
* Removes the `PSCUpdateConfigurationWithoutReloadingExample` example, which was using outdated API. (#13801)

#### PSPDFKit

* Adds a `allowedPathExtensions` property to `PSPDFLibraryFileSystemDataSource` to configure the types of files it returns for indexing. (#13967)
* Fixes an issue where checkbox values were not updated correctly. (#13843)
* Fixes an issue where digitally signing a document multiple times may invalidate previous signatures. (#13582)

#### Instant

* Improves the Instant Catalog example to support 7 letter codes. (#13858)

### 7.3.0 - 12 Jan 2018

_See the [announcement post](https://pspdfkit.com/blog/2018/pspdfkit-ios-7-3/)._

#### PSPDFKitUI

*  API: Introduces `-[PSPDFDocumentEditorDelegate documentEditorRequestsFullReload:]`, which requests a full document editor UI reload. (#13168)
*  API: Replaces policy event strings on `PSPDFApplicationPolicy` with an extensible enum. (#13722)
*  API: Adds `+[PSPDFImagePickerController availableImagePickerSourceTypes]` to allow specifying the source types of a `PSPDFImagePickerController` subclass. See `CustomImagePickerControllerExample` in PSPDFCatalog for details. (#13724)
*  Adds a PSPDFCatalog example illustrating how to go to a specific outline programmatically. (#13166)
*  Adds a PSPDFCatalog example illustrating how to customize page labels. (#13343)
*  Adds a PSPDFCatalog example of how to monitor for touch events. (#13706)
*  Adds a new `signatureIntegrityStatus` to `PSPDFSignatureStatus`, which shows if the document has been modified in a way that has broken a digital signature. (#13570)
*  Adds a `PSPDFConfiguration` preset for easy configuration of PDF controllers showing image documents. (#13538)
*  Improves detection of the page focused by the user when rotating. (#12558)
*  Improves text selection behavior. It's now possible to start selecting and marking up text in one direction and then switch to the opposite direction in a single gesture. (#11415)
*  Improves the `PSPDFDocumentPickerController` documentation. (#8417)
*  Improves support for document editing inside the tabbed view controller. (#13168)
*  Improves performance of the annotation list view controller. (#13546)
*  Improves saving when the application is backgrounded or terminated. (#13586)
*  Improves support when embedding multiple `PSPDFViewController` instances into a `UIPageViewController` instance. (#13702)
*  Improves text markup selection behavior when starting a selection outside of text and moving over text afterwards. (#11937)
*  Improves the coloring of the filter segmented control at the top of the thumbnails view. It now has higher contrast against light backgrounds and uses the tint color if it provides sufficient contrast. (V#1369)
*  Improves the accuracy of the information about the digital signature validation process by demoting some non-critical errors to warnings. (#13570)
*  Improves the page grabber layout in various configurations. (#13465)
*  Improves the annotation toolbar layout when using the page grabber or a vertical scrubber bar. (#13465)
*  Improves the sound annotation player layout when using a vertical scrubber bar on iPhone X. (#13465)
*  Improves language detection for text to speech. (#8939)
*  Hide the annotation section in `PSPDFDocumentSharingViewController` for documents which do not have annotations. (#13179)
*  The `showsScrollIndicator` properties on `PSPDFDocumentView` and `PSPDFDocumentViewController` now default to `NO` in scroll per spread mode. (#13506)
*  Fixes an issue where the scrubber bar was unable to switch to the first or last page in some documents. (#13258)
*  Fixes an issue where an assert could be triggered when replacing a file while it is being displayed. (#13362)
*  Fixes an issue with the page view label formatter where the custom formatter was not used. (#13343)
*  Fixes an issue where rotating from double to single page spreads leads to the wrong page when editing a note annotation. (#9524)
*  Fixes an issue with transparent background on list of open documents. (V#1345)
*  Fixes an issue where draw annotation tools were not properly reselected after changing layouts or rotating the device. (#12907)
*  Fixes an issue where read-only signed digital signatures may not be tappable. (#13573)
*  Fixes unnecessary document saves triggered by loading certain annotation types. (#13734)
*  Fixes an issue where embedded file preview was missing the close button when `useParentNavigationBar` was set to `YES`. (#13699)
*  Fixes a potential crash which could occur when setting a custom `PSPDFApplicationPolicy` in `+[PSPDFKit setLicenseKey: options:]`. (#13725)
*  Fixes an issue where PDFs with corrupted pages where not rendered at all in certain layout configurations. (#13720)
*  Fixes an issue where pages with different sizes were positioned incorrectly in thumbnail mode on devices with 3x screens. (#13693)
*  Fixes an issue where some list boxes do not display all the possible options. (#13454)
*  Fixes an issue where in some view hierarchies the page size was only using the visible screen space instead of the size of the view. (#13579)
*  Fixes an issue where the content is offset when scrolling backwards. (#13551)
*  Fixes an issue with continuous scrolling layouts that have `fillAlongsideTransverseAxis` disabled. (#13688)

#### PSPDFKit

*  API: Deprecates the `baseURL` property from `PSPDFFileDataProvider`. (#12525)
*  API: Deprecates `baseURL`-based `PSPDFFileDataProvider` initializers. (#12525)
*  Adds `PSPDFImageDocument` for simple annotating of image files using PSPDFKit. (#13538)
*  Adds form field values to Instant JSON. (#13335)
*  Adds a new log level (`PSPDFLogLevelCritical`), that is enabled by default. (#13212)
*  Adds support for PEM-encoded certificates in PKCS#7 files. (#13698)
*  Improves file coordination update notifications, by ignoring cases that do not represent content changes. (#13394)
*  Improves the detection of digital signatures in third-party PDF readers. (#13593)
*  Improves the stability of the digital signing process with some certificate authorities with missing fields. (#13694)
*  Improves locking during document cache reset. (#10984)
*  Fixes an issue where zooming in on large free text annotations, stamps, or form fields could use a lot of memory, which could result in crashing. (#13685, #13686)
*  Fixes missed search terms which span over a newline without a hyphen. (#11862)
*  Fixes an issue with stamp annotations not being rendered when using XFDF. (#13330)
*  Fixes an issue with sound annotations losing sound data when using XFDF. (#13324)
*  Fixes specific issue where previous xref has the same object number as a newly created object. (#13183)
*  Fixes an issue where `PSPDFGalleryManifest` could override a link annotation's url in some cases. (V#1084)
*  Fixes an issue where image stamp annotations appeared scaled up. (#13703)
*  Fixes a problem where signed documents loaded using a data provider may incorrectly warn about changes when validated. (#13549)
*  Fixes file coordination issues that could occur while the application is backgrounded. (#13652)
*  Fixes an issue where a signed document may show a warning if inspected with a PDF lint tool. (#13719)
*  Fixes an issue where `PSPDFFile` could in some cases return stale data for a file. (#13614)
*  Fixes an issue where the opacity was not applied to the callout of a `PSPDFFreeTextAnnotation`. (#13576)
*  Fixes an issue where some annotation widgets' appearance streams were not updated properly when the underlying form field's value changed. (#13344)
*  Fixes highlight markups on some specficic documents (#13768)

#### Instant

*  API: Deprecates `-[PSPDFInstantClient initWithServerURL:]` which crashes when data cannot be read from or written to disk. This is a breaking change if you use Swift. (#13365)
*  Adds `-[PSPDFInstantClient initWithServerURL:error:]` as the designated initializer. This allows failing gracefully when data cannot be read from/written to disk. (#13365)
*  Adds `PSPDFInstantDocumentState` describing the possible states that a `PSPDFInstantDocumentDescriptor` can be in. Notifications are posted for relevant state transitions, providing significantly better feedback about a document’s sync cycle. (#11324)
*  Adds API to stop a running sync cycle and improves discoverability and accuracy of documentation. (#13247)
*  Fixes an issue where some annotations created with default properties were not synced. (#13348)
*  Fixes a memory leak related to sync requests. (#13540)
*  Fixes a dangling pointer issue when parsing invalid server responses. (#13557)

### 7.2.1 - 14 Dec 2017

PSPDFKit now requires and is built with Xcode 9.2 (9C40b).

#### PSPDFKitUI

*  Update the sound annotation playback toolbar view while scrolling is active. (#13274)
*  Improves positioning of form elements during editing. (#13208)
*  Fixes a problem where some text in form fields may be cut off. (#13242)
*  Fixes an issue where draw and selection views where not recreated when changing the page or the page transition. (#12907)
*  Fixes an issue where the scrubber bar didn't lay out correctly when switching documents. (#13215)
*  Fixes an issue where an assert could be triggered while zooming. (#13403)
*  Fixes a potential crash during scroll view observing. (Z#7695)
*  Fixes a memory leak in the signature view controller. (#13463)
*  Fixes ink, shape, and line annotations not being rendered correctly if they were selected while the view changes size. (#13520)
*  Fixes an issue where an assert could be triggered while setting an empty viewport to a document view layout. (Z#7763)

#### PSPDFKit

*  Improves performance when fetching document level JavaScript objects. (#13281)
*  Fixes an issue where an ink annotation's background (fill color) was incorrectly ignored. (#13216)
*  Fixes an issue where documents with links may not point to the correct destination after being exported. (#13341)
*  Fixes missed search terms which span over a newline without a hyphen. (#11862)
*  Fixes an issue with stamp annotations not being rendered when using XFDF. (#13330)
*  Fixes an issue with sound annotations losing sound data when using XFDF. (#13324)
*  Fixes incorrect glyph frames being returned from `PSPDFTextParser` for documents with vertical or rotated text. (#13423)
*  Fixes some crashes when undoing and redoing operations. (#12358)
*  Fixes a crash in `PSPDFFileAnnotationProvider` when the document has not been initialized properly. (#12358)
*  Fixes some crashes in `PDFResourceProvider` caused by a race condition. (#13413)
*  Fixes potential crashes when some classes are deallocating. (#13421)

#### Instant

*  Adds a PSPDFCatalog example that uses Instant to load documents from our public preview server and demonstrates real-time annotation synchronization. (#11968)
*  Fixes annotation positioning when created on a page with a transform. (#12492)

### 7.2.0 - 23 Nov 2017

#### PSPDFKitUI

*  Improves page grabber user experience when scrolling documents with various sized pages. (#11642)
*  No longer shows status HUD while opening a document in another app since this is usually fast. (#13209)
*  Fixes an issue where the page grabber was not able to scroll all the way to the top or the bottom of a document in some view configurations. (#11642)
*  Fixes an issue that could lead to a crash when switching between documents with different page numbers in a tabbed bar view controller. (#12513)
*  Fixes a crash when snapshotting a page view in a page curl layout before the view was rendered for the first time. (V#1282)
*  Fixes a crash when scrolling and zooming to a page when already zoomed in. (#13225)

#### PSPDFKit

*  API: Deprecates `PSPDFJSONSerializing` in favor of Instant JSON (See `PSPDFAnnotation+Instant.h`). (#10516)
*  Adds Instant JSON support to `PSPDFDocument` and `PSPDFAnnotation`. (#10516)
*  Fixes a rare text extraction issue where some space characters are not correctly extracted. (#6273)
*  Fixes an issue where stamp annotations get blurry. (#12981)

#### Instant

**Important:**
This release requires [PSPDFKit Server 2017.8](https://pspdfkit.com/changelog/server/#2017.8) for syncing. If you try to connect to an older version of the server, syncing will fail. For further information, please refer to the [migration guide](https://pspdfkit.com/guides/web/current/migration-guides/2017-8-migration-guide/).

*  Adds `identifierForAnnotation:error:` and `annotationWithIdentifier:forDocument:error` to `PSPDFInstantDocumentDescriptor`. These APIs provide a stable, unique identifier for annotations managed by Instant. The identifiers are well suited to, for example, associate arbitrary data from external sources with an annotation. (#11682)

### 7.1.0 - 17 Nov 2017

_See the [announcement post](https://pspdfkit.com/blog/2017/pspdfkit-ios-7-1/)._

#### PSPDFKitUI

*  API: Replaces `PSPDFAnnotationIgnoreNoteIndicatorIconKey` in favor of `PSPDFAnnotation.shouldDrawNoteIconIfNeeded`. (#12687)
*  API: Adopts `NS_ERROR_ENUM` for error codes. This is source compatible for Objective-C but might require small adjustments in Swift code. (#13023)
*  API: The delegate of the scroll views returned in `documentViewController:configureScrollView:` and `documentViewController:configureZoomView:forSpreadAtIndex:` can now be set. (#13013)
*  API: Adds an `NSError` parameter to the completion handler of `-[PSPDFPageCellImageLoading requestImageForPageAtIndex:availableSize:completionHandler:]`. (#11499)
*  Adds UI controls and model level APIs for copy and paste operations on the document editor. (#11972)
*  Adds PSPDFCatalog example illustrating how to switch between double and single page mode without reloading. (#12880)
*  Adds `PSPDFDrawCreateModeAutomatic` as the new default `drawCreateMode` used by `PSPDFDrawView`. This intelligently splits drawing into multiple ink annotations. This is especially beneficial when using Apple Pencil. (#9222)
*  Adds value `PSPDFSignatureInputMethodMouse` to `PSPDFSignatureInputMethod` enum which is used when the digital signature was created with a mouse. (#12865)
*  Adds PSPDFCatalog example illustrating how to programmatically add transparent stamp annotations. (#13075)
*  Adds finer grained scrolling API, applicable for continuous scrolling mode. See `-[PSPDFDocumentViewController scrollToSpreadAtIndex:scrollPosition:animated:]` for details. (#12586)
*  Adds `labelFormatter` property to `PSPDFPageLabelView` to customize page label. (#13003)
*  Adds `useDiskCache` to `PSPDFDataProviding` and `PSPDFDocument` to configure using the disk cache on a per-document level. (#11815)
*  Adds PSPDFCatalog examples illustrating how to add vector stamp annotations. (#13075, #13076, #13080)
*  Improves performance of drawing ink annotations, which is especially noticeable when using Apple Pencil. (#9222)
*  Improves handling of rendering errors in the thumbnails view. (#11499)
*  Improves displaying of the icon for annotations that have a note attached. (#12555)
*  Improves content insets and prevents the user from zooming into the areas outside a spread. (#12268)
*  Improves scroll indicator insets on iPhone X. (#12755)
*  Improves document layout on iPhone X. (#12753)
*  Improves system edge gestures handling with visible annotation toolbar. (#12837)
*  Improves usage of quantity strings (plurals). (#13039)
*  Improves scroll behavior in continuous scroll mode when zoomed in. (#13084)
*  Improves initial positioning in vertical continuous mode. (#12777)
*  Improves content offset behavior during user interface fadein in vertical continuous mode. (#12777)
*  Improves default color presets, so they better fill the space on iPhone X and 12.9" iPad. (#13117)
*  Newly added pages via the Document Editor will be added at the end of the document. (#12533)
*  Setting `scrollEnabled`, `alwaysBounce`, or `showsScrollIndicator` on `PSPDFDocumentViewController` doesn't reload the view hierarchy anymore. (#13089)
*  Link highlights are no longer shown for full page annotations. (#13163)
*  Fixes issue with the invisible filters in document editor on iOS 11. (#12730)
*  Fixes issue with annotation toolbar not being able to attach to the top in nested navigation controllers setup. (#12821)
*  Fixes the thumbnails view not updating on annotation changes when a filter is applied. (#11637)
*  Fixes issues where the content insets for document views were not properly calculated. (#12808)
*  Fixes issue where text in form fields are always black. (#12449)
*  Fixes a crash when rotating from double page spreads in landscape to single page spreads in portrait. (#12983)
*  Fixes a crash when using `additionalScrollViewFrameInsets` in continuous scrolling layouts. (#13079)
*  Fixes a regression that caused pages to be slightly zoomed in after rotation. (#12825)
*  Fixes issue where the navigation bar did not fade out with the user interface on iOS 10. (#12912)
*  Fixes it not being possible to scroll to the bottom of the color presets in some view sizes such as on a 4" iPhone in landscape. (#13096)
*  Fixes an issue where scrolling when zoomed in continuous scroll mode would be jumpy. (#12454)
*  Fixes an issue where spreads larger than the viewport size would start in the center. (#12852)
*  Fixes an issue where scrolling with the page grabber could cause the page to shift when zoomed in. (#12985)
*  Fixes actions not being executed for full page annotations. (#13163)
*  Fixes an issue where the annotation toolbar could show only a subset of buttons after inserting a signature on iPhone. (#13106)
*  Fixes an issue where the status bar was incorrectly shown or hidden on iPhone, when a PDF controller was re-shown in a different orientation. (#13077)
*  Fixes an issue where a spread view could not be found when restoring view states which led to an assertion. (V#1261)
*  Fixes a rare crash that could occur during rotation in page curl mode. (#12877)
*  Fixes an issue when applying additional scroll view frame insets to a scroll per spread layout. (#12734)

#### PSPDFKit

*  API: Deprecates `PSPDFAnnotationTriggerEventLooseFocus` in favor of `PSPDFAnnotationTriggerEventLoseFocus`. (#13078)
*  Improves detection of RichMedia elements and always prefers to show controls for audio-only tracks. (#12986)
*  Improves the performance of document outline parsing when the document is very big. (#11854)
*  Fixes the positioning of the underline on text when no ascending characters are present on the line. (#11489)
*  Fixes a problem where some PDF documents may not show every form field element. (#12998)
*  Fixes an rare crash in `PSPDFLibraryFileSystemDataSource` due to mutation of a set while enumerating it. (#12987)
*  Fixes a potential issue when trying to interact with a form whilst a `PSPDFProcessor` is in progress. (#12973)
*  Fixes an issue where some highlight annotations were rendered incorrectly in specific PDFs. (#12937)
*  Fixes missing document link action when destination is not defined. (#12917)
*  Fixes a potential issue when trying to interact with a form whilst a `PSPDFProcessor` is in progress (#12973)

#### Instant

**Important:** This is the last release of Instant compatible with PSPDFKit Server 2017.7 and earlier. The next release will require 2017.8. This release adds showing an alert informing users that they need to update your app if the server version is too new. You should update your app with this version of Instant as soon as possible so once you update the server to 2017.8 users are informed of why document downloading and syncing does not work and how to fix it. For further information, please refer to the [migration guide](https://pspdfkit.com/guides/web/current/migration-guides/2017-8-migration-guide/).

*  Adds showing the user an alert if the Instant framework version is too old to connect to the server. This can be disabled with the new `shouldShowCriticalErrors` property on `PSPDFInstantViewController`. (#12870)
*  Adds error codes for the cases where the client and server have incompatible versions: `PSPDFInstantErrorOldClient` and `PSPDFInstantErrorOldServer`. (#12720)
*  Fixes `PSPDFInstantSyncingLocalChangesDisabled` symbol not being exported. (Z#7443)
*  Fixes an issue that could lead to a failed assertion when adding annotations while there were unsynced changes. (#13122, Z#7442)

### 7.0.3 - 26 Oct 2017

*  Adds CocoaPods dSYM support for all frameworks to improve crash report symbolication. (#11666)

#### PSPDFKitUI

*  Improves note view controller insets on iPhone X. (#12816)
*  Improves thumbnail sizing in the document editor on iPhone X. (#12815)
*  Improves the search controller layout on iPhone X. (Z#7121)
*  Fixes issues with the fullscreen gallery layout on iPhone X. (#12731)
*  Fixes a regression that prevented searching for fonts in `PSPDFFontPickerViewController`. (#12831)
*  Fixes an issue with the annotation toolbar not respecting the safe area in the top position. (#12833)
*  Fixes the sound annotation player layout if a bottom toolbar is shown. (Z#7266)
*  Fixes an issue where modally presented `PSPDFTabbedViewController` wasn't displaying the close button. (#12811)
*  Fixes a crash that could occur in continuous mode, if scrolling was still ongoing while the PDF controller was being dismissed. (V#1250)
*  Fixes an issue that scrolled to the wrong offset when calling `setContinuousSpreadIndex:` on a zoomed in document with layout that has `spreadBasedZooming` disabled. (#12788, V#1253)
*  Fixes it not being possible to create some annotation types after changing pages while the tool is being used, typically while using Apple Pencil. (#12744)
*  Fixes 'Open In' not correctly working on iOS 10 and 9. (#12829)
*  Fixes the color picker layout on iPhone X. (#12854)
*  Fixes zooming to a search result making it fill the entire screen. (#12441)
*  Fixes `PSPDFConfiguration.searchResultZoomScale` not being respected. Changes default to specify automatic zoom scale. (#12675)
*  Fixes the thumbnails view sometimes not scrolling or not showing some pages if the document’s first page has a different aspect ratio to other pages. (V#1219)
*  Fixes blurry text fields when zoomed into a form. (#12661)
*  Fixes an issue when PSPDFKit is used in projects that do not use ARC. (#12892)

#### PSPDFKit

*  Adds support for transferring document level JavaScript when processing a document (#12769)
*  Fixes an issue with file size when flattening annotations. (#12749)
*  Fixes an issue in the bookkeeping of spread views which resulted in an assertion when looking for a specific page view. (#12654)
*  Fixes an issue where `PSPDFProcessor` didn't export some annotations in particular documents. (#11795)
*  Fixes an issue when saving a document that has been restored from a checkpoint. (#12890)
*  Fixes an issue with incorrect tab order in forms. (#12902)
*  Fixes an issue where some flattened documents may not show correctly in third party readers. (#12901)
*  Fixes an issue where actions weren't properly persisted. (#12884)
*  Fixes an issue when exporting XFDF with non-ascii characters. (#12892)
*  Fixes an issue when the appearance stream of form elements was not correctly reset when applying XFDF values. (#12892)

### 7.0.2 - 20 Oct 2017

#### PSPDFKitUI

*  API: Deprecates externalScreensDisableScreenDimming of PSPDFScreenController, in favor of PSPDFBrightnessManager.idleTimerManagement. (#12601)
*  Adds the ability to override the file name when using `PSPDFOpenInCoordinator`. See `CustomSharingFileNamesExample` for details. (#12289)
*  Adds `-[PSPDFViewController documentViewControllerDidLoad]` as a hook to customize the appearance of a `PSPDFDocumentViewController`. (#12645)
*  Adds options for smart management of the idle timer to `PSPDFBrightnessManager`. (#12601)
*  Adds `additionalScrollViewFrameInsets` and `additionalContentInsets` to `PSPDFConfiguration` to easily adjust what used to be `margin` and `padding` in v6. (#12736)
*  Moves  `PSPDFBrightnessManager` to the `PSPDFKit` singleton. (#12601)
*  The `PSPDFScreenController` is now more flexible and offers an additional delegate call to configure the mirroring view controller. Also see the new `ScreenMirroringExample` in PSPDFCatalog. (#12778)
*  Improves the page grabber design. (#11079)
*  Improves the thumbnail bar layout on iPhone X. (#12702, #12703)
*  Improves the flexible toolbar (annotation and document editor toolbar) layout on iPhone X. (#12727)
*  Improves screen mirroring when inner scroll view offset is changed. (#12791)
*  Improves the page grabber layout on iPhone X. (#12729)
*  Improves the thumbnail view layout on iPhone X. (#12728)
*  Improves content and scroll indicator inset behavior in vertical continuous mode. (#12575, #12739)
*  Improves the layout of the note annotation view controller on iPhone X. (#12789)
*  Improves support for modifying `PSPDFViewController.view`'s frame. (#12743)
*  Form button touch down events no longer require a minimum tap time. (#12709)
*  Fixes a regression on iOS 11 where the inline search mode didn't accept touches. (#12671)
*  Fixes an issue where the page view was black for a split second when dismissing a modal view controller in front of it. (#12345)
*  Fixes an issue where a keychain warning was logged in invalid cases. (#12658)
*  Fixes an issue where the next page did not become visible in `PSPDFScrollPerSpreadLayout` based view hierarchies while bouncing a zoomed in spread. (#12269)
*  Fixes a crash when clearing widget annotations in `PSPDFAnnotationTableViewController`. (#12797)
*  Fixes content not being centered when zooming out. (#12365)
*  Fixes an issue where the view state was not restored properly on rotation. (#12673)
*  Fixes an issue where the frame of annotations and selected text was not updated correctly when zooming on a page. (#12514)
*  Fixes an issue where scrolling to a page via the scrubber bar didn't work in some cases. (#12473)
*  Fixes an issue when restoring the state with an invalid document in place. (V#1238)
*  Fixes an issue when restoring state when zoomed into a document. (V#1243)
*  Fixes an issue where `PSPDFTextFieldCell` used a too narrow inset on iOS 11. (#12737)
*  Fixes an issue where annotation inspector couldn't be presented in vertical scrolling mode. (#12718)
*  Fixes an issue with content insets when the keyboard showed up. (#12652)
*  Fixes layout of table view cells including a slider. (#12754)
*  Fixes the flexible toolbar not supporting the top position on iPhone X. (#12784)

#### PSPDFKit

*  Adds support for proper removal of `PSPDFFormElements` when calling `removeAnnotations:`. (#12797)
*  Improves correctness for JavaScript `util.printf` call. (#12759)
*  Improves reliability when saving documents with broken cross-reference tables. (#12212)
*  Fixes issues with font selection for non latin languages. (#12297, #11639)
*  Fixes issues when restoring from checkpoints. (#12669)
*  Fixes an issue where text in some form fields may be cut. (#12494 and #11287)
*  Fixes an issue rendering text while zoomed in specific documents. (#12392)
*  Fixes an issue where underline annotations and text extraction may not work correctly for some documents. (#12070)

#### Instant

*  Adds `+[PSPDFInstantClient dataDirectory]` to access the path where Instant stores documents and annotations, which may be used to set a custom data protection class for Instant. (#12710)
*  Fixes lock inversions that could cause live- or deadlocks when syncing finished while the document was still being parsed. (#11739)

### 7.0.1 - 12 Oct 2017

#### PSPDFKitUI

*  Adds `PSPDFDragAndDropConfiguration` to customize how and where Drag and Drop should work. (#12538)
*  Before storing images, PSPDFKit now checks for `NSPhotoLibraryAddUsageDescription` and warns if not set. (#12528)
*  Improves the bottom sound annotation player layout on iPhone X. (#12536)
*  Improves behavior when tapping the edge of the page to scroll. (#12445)
*  Fixes an issue where the content offset was wrong when opening single page documents when a `PSPDFContinuousScrollingLayout` was used. (#12500)
*  Fixes an issue where toolbar icons could be displayed smaller than they should if the toolbar was updated too early in some cases. (#12472)
*  Fixes the last double page spread in the thumbnails view being shown separated. (#12506)
*  Fixes several issues related to the continuous spread index by making the continuous spread index being derived from the center. (#12366, #12416, #12264, #12502, #12483)
*  Fixes an issue with the document label overlapping the status bar in case no navigation bar is shown. (#12401)
*  Fixes an image resource which was referenced invalid in the free text annotation accessory keyboard toolbar. (#12511)
*  Fixes an issue where the image editor couldn't be dismissed. (#12530)
*  Fixes an issue where class overrides originating from `PSPDFPageView` were not used. (#12540)
*  Fixes an issue with the sound annotation player not hiding when deleting the corresponding sound annotation. (#12529)
*  Fixes an issue where spread views removed from view hierarchy could be kept as visible which could cause assertion failures. (V#1213)
*  Fixes an issue with annotation changes not being saved before digitally signing a document. (#12195)
*  Fixes an issue where under certain view configurations, creating a new signature on an iPhone could fail. (#12570)
*  Fixes an issue where user interactions were ignored during showing and hiding of the user interface. (#12414)
*  Fixes an issue where rotating from portrait single-page mode to landscape double-page mode would cause the viewport to be zoomed in on the first page. (#12474)
*  Fixes an issue where the annotation list would become unresponsive when a large number of annotations were updated at a time. (#11539)

#### PSPDFKit

*  Fixes an issue where the leading zero was not displayed when formatting a number. (#12565)
*  Fixes an issue where some annotations may not be shown even when they are present in a document. (#12295)

#### Instant

*  Updates the example app to Swift 4. (#12504)
*  Fixes creating an annotation also creating an additional empty annotation that was only stored locally. (#12542)

### 7.0.0 - 4 Oct 2017

_See the [announcement post](https://pspdfkit.com/blog/2017/pspdfkit-ios-7-0/)._

PSPDFKit 7 is a major new release. PSPDFKit has been split into two frameworks: `PSPDFKit.framework` for model and parser classes, and `PSPDFKitUI.framework` for UI functionality including view controllers.

Below is a summary of the API changes in this release. For a full list, with our suggested migration strategy for each API that has been changed or removed, please see the [migration guide](https://pspdfkit.com/guides/ios/current/migration-guides/pspdfkit-70-migration-guide/), which will also help with the framework split.

*  API: Removes all deprecated API. For a full list with suggested migration paths, see the migration guide. (#11669)

#### PSPDFKitUI

*  API: Overhauls the view hierarchy for displaying documents. This involves many API changes. See the View Hierarchy section in the migration guide for much more detail. (#9773)
*  API: Replaces various API around signature saving with a more versatile `PSPDFSignatureSavingStrategy` used by `PSPDFSignatureViewController` and `PSPDFConfiguration` for managing saving signatures. See the Signatures section in the migration guide for a full list of changes. (#9471)
*  API: Changes the stored ink signature type of `PSPDFSignatureStore` from `PSPDFInkAnnotation` to `PSPDFSignatureContainer`. `PSPDFInkAnnotation` objects will be migrated automatically to the new `PSPDFSignatureContainer`. (#11841)
*  API: Renames `PSPDFUnsignedFormElementViewController` to `PSPDFCertificatePickerViewController` including the related delegate and methods. (#11841)
*  API: Removes the document signing logic of `PSPDFCertificatePickerViewController` and removes `unsignedFormElementViewController:signedDocument:error:`. This is now handled via `PSPDFDigitalSignatureCoordinator`. (#11841)
*  API: Removes ink annotation selection from `PSPDFCertificatePickerViewController`. This is now handled via `PSPDFDigitalSignatureCoordinator`. (#11841)
*  API: Renames `PSPDFHUDView` to `PSPDFUserInterfaceView` with corresponding changes to related API. See the migration guide for a full list. (#9462)
*  API: Renames `PSPDFAnnotationViewProtocol` to `PSPDFAnnotationPresenting` and `PSPDFStatefulViewControllerProtocol` to `PSPDFStatefulViewControlling`. (#11237)
*  API: Renames `-[PSPDFTextSelectionView selectionRect]` to `innerRect`. (#11870)
*  API: Renames `updatepageIndex:animated:` to `reloadPageAtIndex:animated:` on `PSPDFViewController`. (#11764)
*  API: Renames `PSPDFLinkActionInlineBrowserLegacy` to `PSPDFLinkActionInlineWebViewController`. (#12424)
*  API: Replaces document info option strings on `PSPDFDocumentInfoCoordinator` with an extensible enum. (#11735)
*  API: Replaces `-[PSPDFToolbarButton setImage:]` with a similarly named property `PSPDFToolbarButton.image`. (#11975)
*  Adds support for changing the page mode when in a vertical scroll direction and in continuous page transition. (#12304)
*  Adds `PSPDFDigitalSignatureCoordinator`, used for customizing the path for storing a digital signed document and document presentation. (#11841)
*  Adds support for selecting a digital signature certificate from the ink signature creation dialog. (#11841)
*  Adds support for digitally signing a document without an existing signature form element, by letting the user draw a new signature form element before signing. (#12083)
*  Adds support for adding biometric data to digital signatures created via the UI. (#980)
*  Adds a new sound annotation player that is shown on the bottom. Configurable via `soundAnnotationPlayerStyle`. (#11464)
*  Adds `PSPDFDocumentInfoController` protocol implemented by controllers used in `PSPDFDocumentInfoCoordinator`, to improve removal of invalid controllers. (#11458)
*  Adds `-[PSPDFSelectionView panGestureRecognizer]` and converts `PSPDFSelectionView` to be purely gesture recognizer based. (#12310)
*  Adds new vector based icons. (#11975)
*  Improves the signature experience on Plus-sized iPhones. (#8857)
*  Improves haptic feedback when moving the flexible toolbar. (#9093)
*  Improves translations for various languages (#12191)
*  Improves support for smaller images on the compact landscape phone bars. (#11975)
*  Improves navigation bar animations and layout guide handling during user interface visibility transitions. (#12229)
*  Improves default size calculation logic for various view controllers. (#12375)
*  Uses a dark keyboard and keyboard accessory appearance when in night mode. (#11510)
*  Introduces a new catalog example theme. (#12384)
*  Works around an issue with iOS 11 Smart Punctuation that inserts a null character after a triple dash-tap. (rdar://34651564, #12280)
*  Fixes the long press to reset color preset feature on the annotation style inspector. (Z#6873)
*  Fixes a memory leak in continuous scroll mode. (#11971, #11134)
*  Fixes the default `overlayViewController`'s view jumping down after appearing. (#11645)
*  Fixes a rare assertion when animating draw view bounds changes. (#12209)
*  Fixes annotation toolbar layout issues on iOS 11. (#11975)
*  Fixes animation issues occurring during the thumbnail view transition. (#12267)
*  Fixes scrubber bar flicker during the user interface fadein animation. (#12324)

#### PSPDFKit

*  API: Removes most `PSPDFDocument` initializers and all class factory methods, in favor of just the flexible `initWithDataProviders:` and the convenient `initWithURL:`. A full list of migration strategies for each method can be found in the migration guide. (#12087)
*  API: Removes the `baseURL` and `files` properties from `PSPDFDocument`. (#12087)
*  API: Adds an options parameter to the `PSPDFDocument` save methods, which means the `alwaysRewriteOnSave` property has been replaced by `PSPDFDocumentSaveOptionForceRewrite`. See the Document Save Options section in the migration guide for more details. (#8297)
*  API: Renames `PSPDFProcessorSaveOptions` to `PSPDFDocumentSecurityOptions` and renames related API. See the Document Save Options section in the migration guide for a full list of API changes. (#8297)
*  API: Removes disk cache strategy and page index parameters from `PSPDFCache` caching methods. (#11669)
*  API: Renames the `PSPDFDataProvider` protocol to `PSPDFDataProviding` and adds more specialized protocols for file-backed data providers. Custom data providers can cooperate with PSPDFKit to support file coordination. (#11199)
*  API: The parameters of the `PSPDFFileCoordinationDelegate` methods now conform to `PSPDFCoordinatedFileDataProviding` instead of `NSFilePresenter`. (#11199)
*  API: `PSPDFXFDFParser` and `PSPDFXFDFWriter` now use `PSPDFDataProviding` and `PSPDFDataSink` instead of a `NSInputStream` and `NSOutputStream`. (#11693)
*  API: Prefix changes: Renames `isAnnotationsEnabled` to `areAnnotationsEnabled`, `isBookmarksEnabled` to `areBookmarksEnabled`, `isPageLabelsEnabled` to `arePageLabelsEnabled` and `isFormsEnabled` to `areFormsEnabled` on `PSPDFDocument`. (#9742)
*  API: Renames `PSPDFUndoProtocol` to `PSPDFUndoSupport`. (#11237)
*  API: Renames `-[PSPDFDocument documentByAppendingObjects:]` to `documentByAppendingDataProviders:` and this array can no longer contain instances of `NSString`, `NSURL`, or `NSData`. (#12087)
*  API: Renames the `dataProviderArray` property on `PSPDFDocument` to `dataProviders`. (#12087)
*  API: Removes the `contentSignatures` property from `PSPDFDocument` and adds a `signature` property to the `PSPDFDataProviding` protocol. (#12087)
*  API: `PSPDFRenderTask` can now fail. There is a new delegate method `renderTask:didFailWithError:`, and the `completionHandler` is now passed either an image or an error. (#11500)
*  API: Renames the class `PSPDFAbstractTextOverlayAnnotations` to `PSPDFMarkupAnnotation`. (#10182)
*  API: Removes `-[PSPDFAnnotation isFixedSize]`. (#12007)
*  API: Renames `PSPDFileCoordinationDelegate` to `PSPDFFileCoordinationDelegate`. (#11765)
*  API: Removes `-[PSPDFSignatureFormElement drawArrowWithText:andColor:inContext:]` subclassing hook. (#12083)
*  API: Removes document unrelated callback methods from `PSPDFDocumentDelegate`: `pdfDocument:didRenderPageAtIndex:inContext:withSize:clippedToRect:annotations:options:`, `pdfDocument:provider:shouldSaveAnnotations:`, `pdfDocument:didSaveAnnotations:`, `pdfDocument:failedToSaveAnnotations:error:`, `pdfDocument:underlyingFileDidChange:`. (#12178)
*  API: Replaces `-[PSPDFLibrary updateIndex]` with `-[PSPDFLibrary updateIndexWithCompletionHandler:]`. (#11509)
*  API: Removes metadata handling from `PSPDFLibrary`. (#12261)
*  API: Replaces `annotationsByDetectingLinkTypes:forPagesInRange:options:progress:error:` with `annotationsByDetectingLinkTypes:forPagesAtIndexes:options:progress:error:`. (#11502)
*  Adds Document Checkpointing to recover changes to documents that may not have been saved. (#8471)
*  Adds new `PSPDFSignatureAppearance` class, which allows you to configure the appearance of digital signatures in a document. (#980)
*  Adds a `PSPDFSignatureBiometricProperties` class, which allows you to store and recover encrypted biometric information about a handwritten digital signature. (#980)
*  Adds `signFormElement:withCertificate:writeToDataSink:withAppearance:completionBlock:` to `PSPDFSigner` to allow signing documents to a generic `PSPDFDataSink`. (#8879 and #11267)
*  Adds creation methods for `PSPDFFormField` subclasses allowing you to create new form fields. (#12056)
*  Adds `removeFormElements:error:` and `removeFormFields:error:` to `PSPDFFormParser`. This allows removing of either form elements or form fields. (#11928)
*  Adds support for changing many `PSPDFFormField` properties that were read-only before. (#12157)
*  Adds support for setting any PDF as an appearance stream on an annotation using the `PSPDFAppearanceStreamGenerator` protocol. (#11428)
*  Adds `PSPDFAnnotationProviderDelegate` for callback methods related to annotation saving. (#12178)
*  Adds `outline` property to `PSPDFDocument`, used for getting the documents' outline. (#11801)
*  Adds support for AES encryption when saving or processing a document. (#4420)
*  Improves how `PSPDFLibrary` deals with long running indexing tasks. See `PSPDFLibrary.automaticallyPauseLongRunningTasks`. (#12158)
*  Improves progress handling by automatically canceling active document progress when all data provider progresses are canceled. (V#916)
*  Improves library updates by making them completely asynchronous. (#11509)
*  Improves exact phrase matching in `PSPDFLibrary`. (#12261)
*  Improves XFDF performance and compliance. (#11693)
*  Changes `-[PSPDFDocument addAnnotations:options:]` and `-[PSPDFDocument removeAnnotations:options:]` to accept options dictionaries with keys of type `NSString`. (#12008)
*  Implements `setMaxLength:` for `PSPDFFormElement`. (#11834)
*  The `minimumSize` property of `PSPDFAnnotation` has been changed from 32 to 16. (#11871)
*  Fixes an issue saving an original document after signing it. (#11911)
*  Fixes potential file coordinator races. (#11938, #11206)
*  Fixes an issue when rendering decomposed UTF-8 strings (#11985)
*  Fixes an issue in our KVO helper that could cause a recursive locking abort. This only was discovered with custom code and doesn't affect default usage. (rdar://34307466, #11990)
*  Fixes an issue that prevented modifications to `compareOptions` for manual text searching (#12047).
*  Fixes an issue where a digital signature field could not be properly deleted (#12082).
*  Fixes an issue where indexing wasn't stopped when the application gets terminated. (#12215)
*  Fixes a cosmetic issue where an ink signature field may show as unsigned (#12127).
*  Fixes an issue where flattening a document may generate warnings when it is open in third party readers. (#12066)

#### Instant

*  API: Renames the `PSPDFInstantDocumentDescriptor` methods `startListeningForServerUpdates` and `stopListeningForServerUpdates` to `startListeningForServerChanges` and `stopListeningForServerChanges`, and the `PSPDFInstantViewController` property `shouldListenForChangesWhenVisible` to `shouldListenForServerChangesWhenVisible`. (#12393)
*  Adds support for showing download progress using PSPDFKit. `PSPDFDocument`s can now be obtained from document descriptors before the document has been downloaded. The document may be obtained immediately and set on a `PSPDFInstantViewController` which will show a download progress bar. (#11199)
*  Adds an `autoSyncDelay` property to `PSPDFInstantDocumentDescriptor` which can be used to disable automatic syncing, giving you full control over when Instant syncs with the server. (#11681)
*  Fixes an issue where an incorrect values could be persisted as PDF object IDs. (#11689)

### 6.9.3 - 1 Sep 2017

This will be one of the last releases in the PSPDFKit for iOS version 6 branch, while we're busy working on version 7.
It includes a fix for using it with Xcode 9, however we still recommend Xcode 8 for compiling and testing.

PSPDFKit 7 for iOS will require Xcode 9 and keep compatibility for iOS 9 until the end of the year to ease the transition.
Read more about our version support here: https://pspdfkit.com/guides/ios/current/announcements/version-support/

*  Improves performance for hit-testing ink annotations. (#11858)
*  Improves apperance stream generation to not have extra space after non-latin characters in form fields. (#11874)
*  Works around a crash in the bookmark view controller due to UIKit bug. (rdar://32485481, #11850)
*  Fixes a NaN calculation issue when linking with Xcode 9/Base SDK 11. (#11886)
*  Fixes an issue with recreating `AVPlayer` and `AVPlayerItem` when it was in an error state. (#11864)
*  Fixes an issue with view state restoration in `PSPDFMultiDocumentViewController`. (#11856)
*  Fixes memory leaks in `PSPDFDocument` and `PSPDFViewController`. (#11883)
*  Fixes an infinite recursion when describing certain `NSValueTransformer` instances. (#11881)
*  Fixes an issue where the keyboard was dismissed when typing a custom form value on iPad. (#11892)
*  Fixes a rare crash when saving. (#11861)

#### Instant

*  Adds support for note annotations. (#11704)
*  Fixes two lock-inversions that could cause live-lock or dead-lock when a document received changes while initially reading its annotations. (#11586)
*  Fixes a crash that could occur when a document was deleted while pages were still being rendered. (#11586)

### 6.9.2 - 16 Aug 2017

*  Improves performance for loading and interacting with complex forms. (#11389)
*  Improves the eraser radius calculations. (#11803)
*  Fixes a stamp annotation quality degradation issue for images after moving/resizing. (#11625)
*  Fixes a font selection issue with documents using the `Courier` font. (#11228)
*  Fixes an issue where the `selected` property of annotation views was not set correctly. (#11687)
*  Fixes a layout issue when moving knobs of callout annotation that could happen in rare cases. (#9750)
*  Fixes an issue where link annotations marked as readonly were not tap-able. (#11715)
*  Fixes an issue where documents could sometimes end up locked after saving when an owner-password is set. (V#1121)
*  Fixes an issue where the document cache was not properly invalidated when saving manually via `PSPDFDocumentEditor`. (#11767)
*  Fixes `PSPDFMediaPlayerController` not behaving correctly in some cases when a subclass exists. (#11671)
*  Fixes an issue in the sample catalog that made the subclassing category not show up. (#11707)
*  Fixes note annotation text not being editable after showing the icon and color options on iPhone on iOS 11 when building with the iOS 11 SDK. (#11789)
*  Fixes the icon and color buttons not being tappable when editing a note annotation on iOS 11 when building with the iOS 11 SDK. (#11789)

#### Instant

*  Fixes an issue where the Instant document descriptor was released too soon. (#11721)
*  Fixes a failed assertion due to an improper format string in an error condition. (#11747)

### 6.9.1 - 3 Aug 2017

*  API: Changes the object of `PSPDFMediaPlayerControllerPlayback*` notifications from `PSPDFGalleryVideoItem` to `PSPDFMediaPlayerController`. (#11549)
*  Adds support for external named destinations in `PSPDFRemoteGoToAction`. (#11320)
*  Allows backwards selection of text when creating markup annotations. (#11583)
*  Improves handling of galleries and videos during screen mirroring. (#11549)
*  Improves drawing and the erasure tool when using the Apple Pencil. (#11527)
*  Improves the rendering of polygon annotations. (#11620)
*  Improves form text rendering with non-latin characters. (#10996)
*  Fixes an issue where videos were shown fullscreen when screen mirroring was enabled. (#11549)
*  Fixes a color management issue for file annotations. (#11488)
*  Fixes an issue where annotation assets might have gotten overwritten in some cases. (#11581)
*  Fixes incorrect default resizing behavior for freetext and callout annotations. (#11630)
*  Fixes a leaking color space when encoding images. (#11512)
*  Fixes an issue where an image annotation with a note could lose the image data. (#11652)

#### Instant

*  API: Renames `PSPDFInstantClient`’s `signOut` to `removeLocalStorage`, which makes more sense because there is no explicit signing in. (#11619)
*  Adds automatically recovering from connection errors when automatic sync is active. (#11506)
*  Adds the annotation selection tool to the default annotation toolbar. (#11565)
*  Adds error codes for cases that were previously reported as “unknown”. (#11522)
*  Fixes continuing to listen for updates if the app keeps running in the background. Listening now resumes when the app comes back to the foreground. (#11542)
*  Fixes incorrect handling/reporting of an authentication error during sync. (#11386)
*  Fixes an incorrect log message format that could lead to a failed assertion. (#11634)
*  Fixes deletion of multiple annotations at once. (#11651)

### 6.9.0 - 20 Jul 2017

_See the [announcement post](https://pspdfkit.com/blog/2017/pspdfkit-ios-6-9/)._

*  Adds Instant: an easy-to-integrate solution to connect your app to your PSPDFKit Server to download documents and synchronize annotations between users. Everything’s synced in an instant!
*  API: Adds option to configure flattening or embedding of form elements to `PSPDFProcessorConfiguration`. (#11096)
*  API: Introduces failable `annotationsByDetectingLinkTypes:forPagesInRange:options:progress:error:` instead of `annotationsFromDetectingLinkTypes:pagesInRange:options:progress:error:`. (#11125)
*  API: Changes `isFixedSize` and `fixedSize` to be instance properties on `PSPDFAnnotation`. (#10931)
*  API: Moves `allowedImageQualities` to `PSPDFImagePickerController` from `PSPDFAnnotationStateManager`. (#11172)
*  API: Audit and update several nullability declarations for correctness. (#11183)
*  API: The method `extractImageFromAppearanceStreamWithTransform:error:` on `PSPDFAnnotation` has been removed. Use the equivalent `loadImageWithTransform:error:` method on `PSPDFStampAnnotation`. The call was not useful for other annotation types. (#11185)
*  API: `PSPDFDocument`'s `undoController` is now declared as `nullable` and set to `nil` when `undoEnabled` is disabled shortly after document initialization. (#11476)
*  API: Deprecates the `undoEnabled` property on `PSPDFUndoController`. (#11476)
*  API: Adds `pdfViewController:didDeselectAnnotations:onPageView:` as a new `PSPDFViewControllerDelegate` callback. (#11485)
*  Adds improved markup annotation behavior to select blocks of text. This makes certain selections easier to create. (#10482, #9768)
*  Adds support for flattening signature annotations. (#11096)
*  Adds language-based filtering options to the PSPDFKit Catalog example. (#5436)
*  Adds Adobe root CA by default when using `PSPDFSignatureManager`, so that documents can be more easily verified the same way as on desktop readers. (#11240)
*  Adds support for `Instant.framework` to `strip-framework.sh`. (#11362)
*  Works around a content inset layout issue of the search bar in the outline and annotation list, when the navigation bar has a background image set. (#10878, rdar://32980288)
*  The global SQLite message logger now filters out irrelevant common known logs from iOS like cfurl_cache_response. (#10890)
*  `PSPDFBookmarkViewController` now automatically scrolls to inserted bookmarks. (#11029)
*  Improves certificate validation for digital signatures. (#11128)
*  Improves support for more types of certificates in digital signatures. (#11083)
*  Improves RTL language support in forms. (#11013)
*  Improves automatic layout during callout annotation knob dragging. (#9750)
*  Improves memory management when rendering forms. (#11176)
*  Improves support for file presenter based document deletion notifications in multi data provider documents. (#10362)
*  Improves interaction while drawing annotations by introducing a draw gesture recognizer on `PSPDFDrawView`. (#7655)
*  Fixes a crash related to bookmarks when viewing multiple documents. (#11020)
*  Fixes very rare issue on saving files repeatedly. (#9477)
*  Fixes an access to the view’s bounds on a background thread when laying out the thumbnails view. (#11084)
*  Fixes an issue where in some configurations a scroll view, that was out of our control, was modified. (#10981)
*  Fixes an issue where selecting an annotation in the outline view would not navigate to the correct page in multi-provider documents. (#11136)
*  Fixes a problem while importing some kind of certificates for digital signatures. (#11120)
*  Fixes an issue where UI code was called on a background thread. (#11408)
*  Fixes an issue where disabling screen mirroring didn't work in some cases. (#11171)
*  Fixes an issue where one `PSPDFSignerError` had an invalid error code. (#11186)
*  Fixes an issue occurring after searching in `PSPDFOutlineViewController`. (#11268)
*  Fixes issues with language selection in the Catalog example on iOS 11. (#11342)
*  Fixes some crashes when signing a particular type of PDF documents. (#11285)
*  Fixes an issue where the close buttons in the tabbed bar were not correctly shown when using `PSPDFTabbedViewControllerCloseModeSizeDependent` in some cases. (V#590)
*  Fixes an issue where signatures could show the certificate issuer name instead of the certificate subject name. (#11368)
*  Fixes a rare race condition in the render queue that could occur when using any kind of drawing based annotation with the eraser tool while a page rendering completes. (#11326)
*  Fixes an issue where some digital signatures couldn't be open in Adobe Acrobat. (#11390)
*  Fixes a retain cycle in the document info UI. (11260)
*  Fixes a layout issue when a document with partially broken pages is loaded. (#11481)
*  Fixes an issue where no annotations were shown in `PSPDFAnnotationTableViewController`, when `editableAnnotationTypes` was empty. (#11391)
*  Fixes an issue with encoding preloaded monochrom images. (#10985)
*  Fixes a rare deadlock related to undo operations. (#11479)
*  Fixes a data race in `PSPDFRenderQueue`. (#11494)
*  Deprecates `annotationsFromDetectingLinkTypes:pagesInRange:options:progress:error:`. (#11125)
*  Deprecates `allowedImageQualities` on `PSPDFAnnotationStateManager`. (#11172)
*  Deprecates `isHighlightAnnotationState:` in favor of `isMarkupAnnotationState:`. (#10482, #9768)
*  Deprecates fixed size class methods on `PSPDFAnnotation` in favor of instance properties. (#10931)
*  Deprecates `allowedTouchTypes` on `PSPDFDrawView` and introduces it on `PSPDFDrawGestureRecognizer`. (#7655)
*  Deprecates the `undoEnabled` property on `PSPDFUndoController`. (#11476)

### 6.8.0 - 22 Jun 2017

_See the [announcement post](https://pspdfkit.com/blog/2017/pspdfkit-ios-6-8/)._

This release removes the embedded OpenSSL. This results in a smaller binary and faster link times.

*  Adds new digital signature implementation that no longer relies on OpenSSL. (#10864)
*  Adds support for filtering watermarks (enabled by default). See `PSPDFDocument.isWatermarkFilterEnabled` (#8144, #10874)
*  Adds support for opening the Settings app from the privacy access denied controller. (#10526)
*  Uses the app name instead of "This app" in the privacy access denied controller. (#10528)
*  Makes the disclosure button of `PSPDFOutlineCell` tintable. (#10818)
*  Works around an issue where `UISearchController` would load its view during `dealloc`. (#10936)
*  Various refinements around nullability that have been discovered with Xcode 9's Undefined Behavior Sanitizer. (#10876)
*  Preserves the previous state of the `expanded` value for outline elements after searching in `PSPDFOutlineViewController`. (#10862)
*  Improves action resolving in multi-provider documents. (#10782)
*  Improves the popover sizing of the choice form editor view controller. (#10621)
*  Improves style manager support for color presets and fixes various smaller issues. (#10930)
*  Improves rotation on iPads when using automatic page transition, i.e. rotating from landscape to portrait shows the last interacted page. (#11033)
*  Improves support for form filling via JavaScript. (#10979)
*  Improves documentation of the digital signatures feature. (#11027)
*  Fixes an issue when tapping a search result in some documents. (#10844)
*  Fixes issue while saving PDF files. (#10849)
*  Fixes a leak when rendering a bitmap. (#10847)
*  Fixes an issue where the "Open In" activity was not shown for non-URL backed documents. (#10854)
*  Fixes an issue where documents with incorrectly created annotations could cause infinite loops. (#10640)
*  Fixes rare file coordination related crashes and deadlocks. (#10935)
*  Fixes an issue where the bookmark migration could deadlock in some configurations. (#10857)
*  Fixes an issue where the page grabber could cause a crash on 32bit devices when switching from a multi page document to a single page document in a visible view controller instance. (V#929)
*  Fixes an issue with digital signatures where a name and date was required. (#7892)
*  Fixes an issue where the page wasn't preserved in automatic page mode when rotating from portrait to landscape and back to portrait. (#10988)
*  Fixes an issue where embedded files with very long names might fail to be extracted correctly. (#11028)
*  Fixes an issue with digital signatures where some valid signatures are not recognized by Adobe Reader. (#9565)
*  Fixes an issue where the cache is not properly invalidated if saving a document fails. (#11022)

### 6.7.2 - 31 May 2017

*  Update OpenSSL to 1.0.2l. (#10820)
*  API: Adds option to configure background indexing queue priority in `PSPDFLibrary`. (#10619)
*  Adds file coordination support to `PSPDFDocumentEditor`. (#10595)
*  Moves Bookmarks in front of Annotations in the document info view controller tab order. (#10666)
*  `PSPDFAnnotationTableViewController` now has smarter defaults when neither `visible`- nor `editableAnnotationTypes` are set. (#10788)
*  Improves `PSPDFDocument` and `PSPDFFileDataProvider` documentation, clarifying the expected behavior with symlinks and alias files. (#10750)
*  Improves error handling for saves that fall back to external file saving due to an unwritable document. (#10805)
*  Fixes an issue where editing a bookmark could result in a crash. (#10607, #10723)
*  Fixes an issue with document render options when mirroring the screen. (#10676)
*  Fixes an issue where annotations were drawn in the wrong size if `fitToWidth` was set to `PSPDFAdaptiveConditionalAdaptive` and the adaptive style would have been mapped to a disabled fit to width behavior. (#9754)
*  Fixes an issue where bookmarks lost their custom sort order when migrating from PSPDFKit 5 for iOS. (#10705)
*  Fixes issue with free text annotations ending editing mode on rotation in continuous page transition mode. (#10671)
*  Fixes an issue where the outline controller was shown when there was no outline in a document. (#6902)
*  Fixes an issue where custom bookmark providers did not receive a save call if the annotation save mode was set to `PSPDFAnnotationSaveModeExternalFile` or `PSPDFAnnotationSaveModeDisabled`. (#10665)
*  Fixes `PSPDFDocumentPickerController` not persisting the FTS index. (#10704)
*  Fixes smaller document editor glitches caused by file presenter updates. (#10595)
*  Fixes an issue with saving files that did not conform completely to the PDF format. (#10712)
*  Fixes an issue with Digital Signatures. (#10762)
*  Fixes an issue where the text selection loupe magnification could break after moving it to a different page. (#10589)
*  Fixes an issue with saving link annotations. (#10355)
*  Fixes a potential deadlock that could occur when performing synchronous saves of encrypted documents on the main thread. (#10789)
*  Fixes an issue where saving an unwritable document using `PSPDFAnnotationSaveModeEmbeddedWithExternalFileAsFallback` would fail. (#10805)
*  Fixes a leak when rendering a bitmap. (#10777)

### 6.7.1 - 22 May 2017

*  API: Adds a new global configuration option that allows you to opt out of `PSPDFDocument` file coordination if needed. By setting `PSPDFFileCoordinationEnabledKey` to `@NO`, `PSPDFDocument` no longer implicitly creates `PSPDFCoordinatedFileDataProvider` instances when initialized with an URL. Instead the non-coordinated `PSPDFFileDataProvider` is used. (#10608)
*  API: Adds annotation indexing capabilities to `PSPDFLibrary`. (#9235)
*  API: Adds `PSPDFRenderManagerRenderResultDidChangeNotification` which is posted when a document's data changes so that a rendering of its pages would look different. (#10489)
*  API: Adds `PSPDFRenderOptionTextRenderingUseCoreGraphicsKey` and `PSPDFRenderOptionTextRenderingClearTypeEnabledKey` as advanced rendering options. (#10231)
*  Adds support for mirroring a `PSPDFViewController` via `PSPDFScreenController` to an external screen. (#2527)
*  Using `setRenderOptions:type:` with type `PSPDFRenderTypeAll` now works as expected. (#10231)
*  The FTS indexer scans faster and is limited to one thread with a low priority. (#10618)
*  Improves file data provider behavior during progress indication by blocking file access while the file might not yet be completely written. (V#880)
*  Improves the customization options for the page grabber. (#10538)
*  Improves saving behavior around encrypted files. (V#879, #9088)
*  Improves performance around reading PDF files. (V#879, #10554)
*  Improves performance when reading page labels (V#879, #10575)
*  Improves reliability of Spotlight indexed `PSPDFLibrary` documents being found. (#10658)
*  Improves `PSPDFLibrary`'s handling of queued documents when `updateIndex` is called, ensuring no stale data is indexed. (#10662)
*  Fixes an issue that could prevent PSPDFDocument deserialization using `initWithCoder:`. (V#880)
*  Fixes handling of annotations with the `NoView` and `Print` flags set, and now renders them in documents generated for printing. (#9725, #10459)
*  Fixes an issue when migrating from old bookmark data. (#10560)
*  Fixes an issue with the empty state of the outline controller. (Z#6161)
*  Fixes an issue with the page range selection not showing up for some sharing options. (Z#6155)
*  Fixes an issue where the page grabber might not be visible when the document starts in its loading state and then becomes available. (#10604)
*  Fixes a crash related to embedded files when the asset name is invalid. (10601)
*  Fixes a crash when parsing invalid metadata. (#10611)
*  Fixes a very rare crash when using the page grabber. (V#929)
*  Fixes an issue where coordinated file access could end up in a deadlock. (#10622)
*  Fixes an issue where radio buttons were rendered incorrectly (#10631)
*  Fixes `PSPDFLibrary` indexing completed notifications not including the `PSPDFLibraryNotificationSuccessKey` in the `userInfo`. (#10662)
*  Fixes an issue with the outline popover sizing on some devices. (#10594)
*  Deprecates `pdfViewController:didRenderPageView:` and replaces it with more accurate delegate calls. (#9577)
*  Deprecates a few properties in `PSPDFSignaturePropBuildEntry`. (#10448)

### 6.7.0 - 10 May 2017

_See the [announcement post](https://pspdfkit.com/blog/2017/pspdfkit-ios-6-7/)._

*  API: Adds `PSPDFDefaultScale()` which returns the main screen scale on iOS and 1.0 on macOS. (#10438)
*  API: All `fileURL` based `PSPDFDocument`s are now backed by `PSPDFCoordinatedFileDataProvider` instances. The initialization flow for file data providers and the behavior of some `fileURL` related methods on `PSPDFDocument` have slightly changed to accommodate file coordination. (#1859)
*  API: Simplified API of `PSPDFModel`, removes several methods which should not be required to be called or subclassed. (#10221)
*  API: `PSPDFBookmark` is now fully immutable. If you want to change a bookmark, create a mutable copy, change it, and add it to the bookmark manager again. (#9308)
*  API: Add notifications for gallery video playback state changes to `PSPDFMediaPlayerController`. (#9758)
*  API: `PSPDFStatefulTableViewController` conforms to the newly added `PSPDFStatefulViewControllerProtocol` protocol. (V#775)
*  API: Rename enum `PSPDFStatefulTableViewState` to `PSPDFStatefulViewState`. (V#775)
*  API: `PSPDFNoteAnnotationViewController` now declares that it implements `UITextViewDelegate`. (#10407)
*  API: Renames `-[PSPDFRenderQueue cancelAllJobs]` to `cancelAllTasks`. (#10417)
*  API: Deprecates `-[PSPDFRenderQueue concurrentRunningRenderRequests]`. (#10417)
*  Adds the option to specify the image scale in a `PSPDFRenderRequest`. (#10413)
*  Adds support for coordinated file operations to `PSPDFDocument` and implements the `NSFilePresenter` protocol. (#1859)
*  Adds `PSPDFPageGrabberController` and `PSPDFPageGrabber` to provide UI to quickly scroll through a document. (#76)
*  Adds support for `PSPDFDocument` progress indication via the `PSPDFFileProvider` API. Check out `DocumentProgressExample.swift` for more information. (#10410)
*  Adds an error handling delegate method to `PSPDFTextSearchDelegate` to better notify of errors during text search. (#10276)
*  Adds support for `PSPDFAnnotationTriggerEventLooseFocus` JavaScript events. (#10295)
*  Adds support for the `NeedAppearances` form flag. (#10288)
*  Adds support for automatically closing deleted documents to `PSPDFViewController` and `PSPDFTabbedViewController`. (V#790)
*  Adds support for respecting `minimumSize` of `PSPDFAnnotation` during creation as well. (#10435)
*  Adds a `contentsLocked` property to `PSPDFAnnotation` that checks the `PSPDFAnnotationFlagLockedContents` flag. We now do not allowing editing contents for annotations with this flag. (#9552)
*  Adds support for searching choice form options. (#10306)
*  Adds the form navigation bar to the top of choice form options when in half modal presentation. (#10307)
*  Improves naming for the ink annotation fill color inspector option. (#10088)
*  Improves `PSPDFTextSearch` handling of invalid or locked documents. (#10276)
*  Improves support for custom bookmark provider. (#9649)
*  Improves the user experience when the user denied access to the camera or the photo library. (#9752)
*  Improves performance around complex PDF documents. (#10290, #10295)
*  Improves cache invalidation when files change while the document is not opened or the app is not running. (#10212)
*  Improves `NSCoding` support for `PSPDFFileDataProvider`, by ensuring its URL is preserved in application path independent way. (V#817)
*  Improves sqlite3 linking. (#10089)
*  Improves reliability of reading from data providers. (#10382)
*  Improves documentation of `PSPDFX509`'s memory model for the encapsulated `OPENSSL_X509` object. (#10225)
*  Improves documentation of some annotation flags which were incorrectly said to have been ignored. (#9552)
*  Choice form options now are automatically scrolling to the selected index when shown. (#10295)
*  `PSPDFTabbedViewController` no longer automatically emits taptic feedback when selecting tabs. (#10371)
*  Fixes an issue where the `cachePolicy` of a render request could be ignored in some cases. (#10428)
*  Fixes highlight annotations rendering incorrectly in documents created by PowerPoint and some other PDF creators. (#9677)
*  Fixes `PSPDFFontSizeName` not being public despite being referenced in the documentation. (#10223)
*  Fixes an issue when setting `pageIndex` before `PSPDFViewController` was shown. (#10079)
*  Fixes an issue where bookmarks were not being saved for viewer only licenses. (#10025)
*  Fixes the Clear Field button not being enabled at the correct times when editing form fields. (#10254)
*  Fixes a retain cycle in `PSPDFOutlineElement`. (#10287)
*  Fixes an issue with scrolling in the outline list. (#10251)
*  Fixes rendering issues with `Arial Narrow`. (#10244)
*  Fixes an issue where annotations were rendered in an outdated state when modifying annotations while rendering was in progress. (#9991)
*  Fixes an issue with collapsing outline elements when searching (#10409)
*  Fixes a locking issue related to UID generation. (#10453)
*  Fixes an issue where the document editor cell layout could remain out of date after a collection view bounds size change. (#9511)
*  Fixes an issue that could result in a very long running loop when rendering PDF documents with broken dashed lines. (#9764)

### 6.6.1 - 13 Apr 2017

*  API: Adds `soundAnnotationRecordingOptions` to `PSPDFConfiguration` to configure recording parameters when creating a new sound annotation. (#10120)
*  API: `PSPDFDocumentPickerCell` now uses custom image view and labels to improve the layout. (#10108)
*  API: Deprecates cache pausing and resuming as this is no longer necessary with the improved render engine. (#10166)
*  Improves the view state restoration logic when a view controller is presented with/without the toolbar. (V#723)
*  Improves stability in low memory situations. (#10086)
*  Improves error reporting in `PSPDFPKCS12` when unlocking fails. Also fix premature unloading of OpenSSL digests/algorithms from memory.  (#10021, #10022)
*  Improves support for adaptive user interfaces in `PSCCustomToolbarExample`. (#9578)
*  Improves some warning log messages for better clarification. (#10168)
*  Freshens up the visual design of `PSPDFDocumentPickerController`. (#10108)
*  Moves error codes reported by `PSPDFPKCS12` into the `PSPDFErrorCode` enum to be more consistent with the rest of the framework. (#10022)
*  Default sample rate for sound annotation recordings has been lowered to 22,050 samples per second to comply with the PDF specification and to decrease the file size. (#10120)
*  Fixes an issue when using the image picker on form elements in double page mode. (#10069)
*  Fixes an issue with loading XFDF annotations. (#10096)
*  Fixes text color in form fields not rendering correctly and not being compatible with other PDF readers. (#10090)
*  Fixes the processor call to `setFormMappingNameMappings:`. (#10102)
*  Fixes an issue with invisible form fields if their bounding box wasn't normalized. (#10035)
*  Fixes an issue with flattening form fields appearing upside down. (#10036)
*  Fixes status bar related HUD issues. (#9975)
*  Fixes an issue where the freetext annotation intent conversion option was shown in the annotation inspector during annotation creation. (#9109)
*  Fixes an issue where certain bar button items would remain selectable when disabled. (#9130)
*  Fixes annotation toolbar drag & drop for certain container view controller arrangements. (#9746)
*  Fixes a layout issue in `PSPDFDocumentPickerController` (#9743)
*  Fixes an issue with displaying the empty state of the outline list. (#10151)
*  Fixes an issue where wrong values were rendered in forms. (#10007)
*  Fixes an issue while saving with a `PSPDFXFDFAnnotationProvider`. (#10187)
*  Fixes an issue that could cause very low priority render tasks to never be executed. (#10166)
*  Fixes an issue with infinite loop galleries when presented modally. (#9941)
*  Fixes an issue with using `-[PSPDFDocument setPageBinding:]`. (#10186)

### 6.6.0 - 6 Apr 2017

_See the [announcement post](https://pspdfkit.com/blog/2017/pspdfkit-ios-6-6/)._

PSPDFKit now requires and is built with Xcode 8.3 (8E162).

*  API: Various methods have been converted to properties where appropriate. This is source compatible for Objective-C but might require small adjustments in Swift code. (#9854)
*  API: Adds `PSPDFDocumentPDFMetadata`. This class allows you to retrieve and set metadata in a PDF. This deprecates `-[PSPDFDocument metadata]`.
*  API: Adds `PSPDFDocumentXMPMetadata`. This class allows you to retrieve and modify data in the XMP stream inside a PDF document.
*  API: Adds `clearRegisteredSigners` to `PSPDFSignatureManager` to remove all registered signers. (#9908)
*  API: `PSPDFOutlineCell` now uses a custom `nameLabel` property instead of `UITableViewCell`s `textLabel` for displaying the outline name. (#9930)
*  API: Adds `formFieldNameMappings` and `formMappingNameMappings` to `PSPDFProcessorConfiguration` for changing the name of form fields. (#9868)
*  API: Adds `shouldShowImageEditor` to `PSPDFImagePickerController`, which configures showing the image editor. (#10058)
*  Adds support for right to left page bindings and automatically changes the page order for the main page view, the scrubber bar, the thumbnail bar and the thumbnail view mode. (#1973)
*  Adds more callbacks to `PSPDFImagePickerControllerDelegate` to get the selected and edited images from the image picker. (#9510)
*  Adds the ability to keep the outline hiearchy intact and to collapse and expand elements while searching. (#9930)
*  Changes the line thickness slider in the inspector (`PSPDFAnnotationStyleViewController`) to be more precise for smaller values and reduces the minimum thickness from 1 to 0.5 points. (#9464)
*  Changes the inspector’s opacity and line thickness value labels to use monospaced numbers so they change more smoothly when using the slider. (#9891)
*  Improves support for "buttonImportIcon" JS functionality in forms to be more in line with Adobe. (#9730).
*  Improves creation and rendering of small cloud annotations. (#9830)
*  Improves form loading performance for some documents. (#9382)
*  Improves `PSPDFLibrary` search when using FTS5. (#10018)
*  Improves support for RTL text selection. (#9688)
*  Improves JavaScript calculation support. (#10024)
*  Improves status bar management reliability. (#9975)
*  Improves memory usage. (#10082)
*  Fixes an issue where line and arrow annotations were always previewed as a dashed line. (#9024)
*  Fixes an issue where the user could select a cloudy line style for arrow annotations. Cloudy line styles are not available for arrow annotations. (#9024)
*  Fixes an issue where circle annotations that have a cloudy border style pass NaN values to CoreGraphics in some cases. (#9834)
*  Fixes the JavaScript Form API by providing `setItems`, `clearItems`, `deleteItemAt` and `insertItemAt` again. (#9868)
*  Fixes symbol characters being used for rendering text in certain situations. (#9878)
*  Fixes an issue where JavaScript wasn't executed when a choice form element was selected. (#9894)
*  Fixes the half modal view controller close button animation timing during dragging. (#9895)
*  Fixes a race condition crash in `PSPDFCoreFormProvider`. (#9744)
*  Fixes an issue where the presented `SFSafariViewController` was blank while a popover was visible. (#9149)
*  Fixes an issue with flattening annotations using custom `PSPDFFileAnnotationProvider` subclasses. (#9914)
*  Fixes the JavaScript action triggers `MouseUp` and `MouseDown` and the JavaScript `display` property. (#9932)
*  Fixes an issue with unselectable form checkboxes in certain documents. (#9960)
*  Fixes full text search results returning incorrect results when an unmatched quote character is included in the search string. (#9831)
*  Fixes YouTube cover image parsing. (#10003)
*  Fixes text field form rendering when text properties are changed. (#9956)
*  Fixes an issue with exporting choice form elements to JSON. (#9420)
*  Fixes an issue where the export value instead of the label was rendered in a `PSPDFChoiceFormElement`. (#9953)
*  Fixes an issue where some video preview thumbnails may be upside down. (#9992)
*  Fixes an issue with a missing red border around required form fields. (#9983)
*  Fixes a view state restoration issue in continuous scroll mode that could trigger an internal assertion. (#9936)
*  Fixes an issue with sharing `PSPDFDocument` including multiple files. (Z#5864)
*  Fixes an issue with making form elements non-editable. (#10009)
*  Fixes an issue where the document editor may show page thumbnails with an incorrect orientation. (#9974)
*  Fixes an issue with selecting a entry in a `PSPDFChoiceFormElement`. (#10056)
*  Fixes free text annotation colors not being compatible with Adobe Acrobat and other PDF readers, and not being read properly in some situations. (#8941)
*  Fixes a layout issue in the outline list. (#9516)
*  Fixes an issue that prevented the document editor cells from loading the correct thumbnail image. (#10083)
*  Deprecates `+[PSPDFOutlineCell heightForCellWithOutlineElement:documentProvider:constrainedToSize:outlineIntentLeftOffset:outlineIntentMultiplier:showPageLabel]` in favor of a self-sizing table view cell. (#9930)

### 6.5.1 - 15 Mar 2017

*  API: Introduces `-[PSPDFDocumentProvider fileId]` and `-[PSPDFDocument documentId]`. A permanent identifier (if available) based on the contents of the file at the time it was originally created. (V#602)
*  API: Adds `PSPDFApplePencilDetectedChangedNotification`. Use this instead of `PSPDFApplePencilDetectedNotification` to avoid unnecessary work when there is no change in detection state. (#9766)
*  API: Adds `shouldExpandCollapseOnRowSelection` subclassing hook to modify the expand/collapse behavior in `PSPDFOutlineViewController`. (#9691)
*  `PSPDFApplePencilDetectedNotification` is no longer posted when `detected` is set to `NO` to better clarify its purpose. (#9766)
*  Improves the bookmark view controller reload behavior by implementing incremental updates. (#9580)
*  Calling `description` on the document no longer tries to parse the document. (#9556)
*  Polygon annotations now correctly require at least 3 points before it is possible to commit them. (#9800)
*  Improves the drawing order of watermarks and annotations. (#9258)
*  Improves formatting of text related annotations in the annotation list view. (#9740)
*  Improves creation of dashed and cloudy annotations. (#9738)
*  Fixes a condition where bold font would be incorrectly used for text that is not to be highlighted in `PSPDFSearchViewController`. (#608)
*  Fixes a crash on iOS 9.0.x. (#9789)
*  Fixes ghost images when selecting form elements. (#9482)
*  Fixes an issue on incrementally saving using a data provider. (#9410)
*  Fixes a crash that could occur when drawing polygon annotations with the cloudy line style. (#9800)

### 6.5.0 - 9 Mar 2017

_See the [announcement post](https://pspdfkit.com/blog/2017/pspdfkit-ios-6-5/)._

*  API: Stylus support has been modified to better support Apple Pencil. If you integrated a third-party stylus SDK with PSPDFKit as demonstrated in `PSCStylusSupportExample`, you’ll need to revise this. We recommend adding `PSPDFApplePencilDriver` in `availableDriverClasses`, and `annotationToolbar.additionalButtons = @[annotationStateManager.stylusStatusButton]` must be replaced with `annotationToolbar.showingStylusButton = YES`. The [stylus support guide](https://pspdfkit.com/guides/ios/current/features/stylus-support/) and `PSCStylusSupportExample` have been updated to reflect this. (#6525)
*  API: Changes `fitToWidthEnabled` type to `PSPDFAdaptiveConditional` and adjusts its behavior. (V#527)
*  API: Makes `PSPDFAnnotationString*` and some constants for stylus drivers nicer to use from Swift. (#9543, #9672)
*  API: Introduces `-[PSPDFRenderQueue scheduleTasks:]` to schedule multiple tasks at once. (#9416)
*  API: Introduces `-[PSPDFRenderTask groupTasks:completionHandler:]` to group multiple render tasks together and get a single completion handler call once all of them complete. (#9416)
*  API: A new sharing option has been introduced to improve document export for print. `PSPDFDocumentSharingOptionFlattenAnnotationsForPrint` should be used instead of `PSPDFDocumentSharingOptionFlattenAnnotations` when printing. This is set by default in `PSPDFConfiguration.printSharingOptions`. (#9295)
*  API: Introduces `PSPDFPrintConfiguration` to customize the print flow or set a default printer. (#9650)
*  Adds first-class Apple Pencil support. Users can now annotate documents with the Pencil while scrolling and tapping with a finger. This is built into `PSPDFStylusManager`, `PSPDFAnnotationStateManager` and `PSPDFAnnotationToolbar` and enabled by default. It is also possible to set the Apple Pencil to always create a particular annotation type, such as ink or highlight, without showing any UI. Learn more in the new [Apple Pencil guide](https://pspdfkit.com/guides/ios/current/annotations/apple-pencil/). (#6525)
*  Adds 3D Touch preview support in `PSPDFThumbnailViewController`, `PSPDFAnnotationTableViewController`, `PSPDFOutlineViewController` and `PSPDFBookmarkViewController`. (#9195)
*  Adds support for non-printable annotations via the new `PSPDFDocumentSharingOptionFlattenAnnotationsForPrint` option. (#9295)
*  Adds an option to close all tabs except one. Accessible by selecting `Close All Other Tabs` after long pressing a close button in `PSPDFTabbedViewController`. (#9393)
*  Adds an option to set cloudy borders on geometric annotations in the annotation inspector. (#9675)
*  Improves settings controller by preventing user from selecting unsupported configurations. (#8321)
*  Improves the annotation view controller reload behavior by implementing incremental updates. (#9520)
*  Improves the animation in the kiosk grid example. (#9225)
*  Improves text to speech language detection for some documents. (#9371)
*  Improves haptic feedback when scrubbing to first and last page. (#9193)
*  Improves the transition to and from the fullscreen gallery view mode. (#9460, #9467)
*  Improves compatibility with embedded videos to allow playing even more format variations. (#9484)
*  Improves JavaScript support for formatting dates in form fields. (#9481)
*  Improves disk usage and reuses temporary paths for asset annotations. (#9396)
*  Improves page navigation with keyboard shortcuts. (#9234)
*  Improves font size while editing a text form element. (#9419, #9436)
*  Improves support for certain types of link annotations. (#9201)
*  Updates OpenSSL to 1.0.2k. (#9364)
*  Changing the tab in `PSPDFTabbedViewController` now creates haptic feedback. (#9415)
*  The example stylus drivers have now been tested with the Adonit SDK 3.3 and Wacom SDK 2.1.0. (#9672)
*  The annotation state manger’s `state` is no longer set to `nil` when changing selected annotations, saving a document, or changing `PSPDFViewController`’s document. This was necessary to create a great experience with Apple Pencil. (#6525)
*  Status HUD notifications are no longer shown when the connected stylus changes. These can be turned back on with `PSPDFStylusManager`’s new `showsStatusHUDForConnectionStatusChanges` property. (#6525)
*  Fixes an issue where checking for a cached image falsely resulted in a cache miss when checking for smaller images in some size constellations. (#9440)
*  Fixes an issue with the thumbnail view mode layout. (#9456)
*  Fixes an issue with generating a document from a local file. (Z#5470)
*  Fixes an issue with half modal view controller avoidance. (#9314)
*  Fixes an issue with `-[PSPDFLibraryFileSystemDataSource indexItemDescriptorForDocumentWithUID:]` returning `nil` before `PSPDFLibrary.updateIndex` is called. (#9392)
*  Fixes an issue where pages were disappearing when laying out `PSPDFViewController` multiple times in a very short time frame. (#9402)
*  Fixes positioning of free text annotations when pasting text. (#9299)
*  Fixes a rare deadlock encountered with background saving. (#8689)
*  Fixes relative path for documents stored in an iCloud container. (V#599)
*  Fixes an issue where exporting a document with forms didn't always automatically invoke save. (#9457)
*  Fixes hard to read text in small choice form elements. (#9450)
*  Fixes an issue where search may not return every match for some documents. (#9173)
*  Fixes an issue that cancelled ongoing animations when the HUD was animating in or out. (#8410)
*  Fixes the `PSPDFAnnotationStyleViewController` (inspector) shown from the annotation toolbar not showing the annotation preview on iPhone in landscape. (#9512)
*  Fixes an issue with layout invalidation when in thumbnail view mode and rotating the device while the app is in the background. (#9523)
*  Fixes `PSPDFLibrary`'s usage of background tasks when indexing. (#9674)
*  Fixes an issue in the renderer that produced an endless loop with invalid values in certain locations of a PDF. (#9595)
*  Fixes an issue where some annotations with dashed border was incorrectly rendered. (#9435)
*  Fixes a text layout issue in `PSPDFOutlineViewController`. (#9516)
*  Removes `PSPDFStylusDriverDelegateKey` which was not used. (#9672)

### 6.4.0 - 31 Jan 2017

_See the [announcement post](https://pspdfkit.com/blog/2017/pspdfkit-ios-6-4/)._

*  API: Adjusts `PSPDFDocument` initializers for better Swift support. `initWithContent:signatures:` is now marked as the designated initializer for this class. (#9143)
*  API: New helper `searchableItemAttributeSetWithThumbnail:` on `PSPDFDocument` for easier Handoff/NSUserActivity/Spotlight integration. (#9218)
*  API: The `doublePageModeOnFirstPage` property in `PSPDFConfiguration` has been renamed to `firstPageAlwaysSingle`. (#9277)
*  API: Makes `PSPDFMetadata*` keys nicer to use from Swift. (#9218)
*  API: Adds `-[PSPDFLibraryFileSystemDataSource indexItemDescriptorForDocumentWithUID:]` to retrieve document metadata without having to read the document from disk. (#9317)
*  API: Adds `PSPDFLibraryFileSystemDataSource.documentProvider` to allow for custom-prepared (encrypted) documents to be used. (#9307)
*  API: Adds `pdfViewController:didExecuteAction:` method to `PSPDFViewControllerDelegate` which is called after an action has been executed. (#9297)
*  Adds support for FTS5 (full-text search) to `PSPDFLibrary`, when available. This updates the internal format and will require a re-indexing. See https://sqlite.org/fts5.html for more details on FTS5. (#9026)
*  Adds support for right-to-left user interface. (#5635)
*  Adds translations for Arabic.
*  Adds a photo editor to crop, rotate and zoom images, when adding a new page or an image annotation. (#969)
*  Adds a search UI to the annotations table view controller. (#8906)
*  Adds a `placeholderImage` to `<PSPDFPageCellImageRequestToken>` for smoother transitions to the thumbnail view mode. (#9197)
*  Improves performance when zooming and scrolling in certain cases. (#9288)
*  Improves behavior of close-all-tabs option in `PSPDFTabbedBarController`. (#9050)
*  Improves power consumption in low power mode. (#5595)
*  Improves external keyboard support when navigating through form fields. (#8503)
*  Improves the highlight icon for the annotation toolbar. (#9187)
*  Improves automatic page mode threshold to use double page mode more often. (#9161)
*  Improves performance of library indexing and preview snippet generation. (#9131)
*  Improves behavior of annotations in night mode. (#9207)
*  Improves `PSPDFLibraryFileSystemDataSource`'s checking of its source documents URL to ensure it is a directory. (#9216)
*  Improves display of indexed documents in Spotlight. (#9219)
*  Improves localizations in Norwegian and renames `Save To Camera Roll` to `Save to Photo Library`. (#9353)
*  Improves the padding around responders that are scrolled to become visible when the keyboard is shown. (#9316)
*  Improves the layout of the empty state in thumbnail view mode when filtered for annotations or bookmarks. (#9315)
*  Changes default number of search results and preview snippets in library queries to 500. Can be modified via `options` dictionary. (#9131)
*  Form annotations now honor the `hidden` flag just like other annotation types. (#9200)
*  Fixes an issue where the _Current Page_ option was presented in pages range picker even when there're no visible page indexes set. (#9350)
*  Fixes a crash that could happen while rotating in some scenarios. (V#530, V#532)
*  Fixes a rare crash in `PSPDFTabbedBarController`. (V#539)
*  Fixes issues with selected annotations on rotated pages. (#9083)
*  Fixes a layout issue when switching to thumbnail mode in some cases. (#9128)
*  Fixes an issue with entering edit mode of free text annotations when long pressing. (#9148)
*  Fixes an issue with free text annotations in night mode. (Z#5365)
*  Fixes an issue where the document editor could get into an invalid state while interactive movement of pages. (#9198)
*  Fixes an issue where annotations were not rendered in night mode color while annotation mode was enabled. (#9168)
*  Fixes an issue where the scrubber bar sometimes requested the wrong image size. (#8998)
*  Fixes selecting items in the annotation toolbar not working properly in some configurations with restricted `editableAnnotationTypes`. (#9226)
*  Fixes an issue where borders weren't dashed properly. (#9260)
*  Fixes an issue where menu controller stayed visible after deselecting an image annotation. (#9286)
*  Fixes an issue where the annotation user name controller could dismiss its parent controller as well. (#9296)
*  Fixes an issue where the annotation's search results don't select the annotation when tapped. (#9313)
*  Fixes a rare issue where inline image objects were not released properly. (#9241)

### 6.3.1 - 9 Jan 2017

*  API: Removes unused `onlyReturnIfVisible` parameter from `PSPDFChildViewControllerForClass`. (#9072)
*  Improves haptic feedback from annotation toolbar and thumbnail scrubber. (#9065)
*  Fixes the shadow position for sound annotation appearance streams. (#9037)
*  Fixes `PSPDFLibraryFileSystemDataSource` becoming inconsistent with the document library. (#9043)
*  Fixes `PSPDFLibraryFileSystemDataSource` ignoring encrypted but not locked documents. (#9047)
*  Fixes height of the search view controller when the search results are cleared. (#9028)
*  Fixes the author name view never being shown if the annotation button is tapped while a popover is visible. (#9058)
*  Fixes the half modal presentations such as the annotation inspector not being dismissed if the user cancels an interactive pop gesture then attempts to go back a second time. (#9058)
*  Fixes the annotation toolbar not being hidden when popping the `PSPDFViewController` from a navigation stack while there is a half modal presentation. (#9058)
*  Fixes it being possible to show the annotation toolbar underneath a half modal presentation. (#9058)

### 6.3.0 - 21 Dec 2016

_See the [announcement post](https://pspdfkit.com/blog/2016/pspdfkit-ios-6-3/)._

PSPDFKit now requires and is built with Xcode 8.2.1 (8C1002).

*  API: Adds `-[PSPDFLibrary indexedDocumentWithUID:]` method to easily retrieve documents from FTS search results. (#8884)
*  API: Adds an "explicit mode" to `PSPDFLibraryFileSystemDataSource`, to improve handling of cases where the documents directory's contents would change rapidly. (#8894)
*  Adds option to close all tabs by long pressing a close button in `PSPDFTabbedViewController`. (#8662)
*  Adds Norwegian and Slovak language and improves the translations overall. (#8975)
*  Improves updating of cells in `PSPDFDocumentPickerController` when a document title changed. (#8874)
*  Improves the flexible toolbar drag & drop handle. (#8883)
*  Improves website conversion support in `PSPDFProcessor`. The changes make it less likely for pages to be converted in a partially rendered state. (#8830)
*  Improves the cache eviction algorithm. (#8876)
*  Improves the eraser for natural drawing ink annotations. (#7532)
*  Improves button selection across different annotation toolbar configurations by prioritizing recently picked tools on all toolbar configurations. (#8610)
*  Improves automatic reloading of `PSPDFAnnotationTableViewController` when changing properties. (#8966)
*  Improves settings UI with new icons representing scrolling directions. (#8590)
*  Improves callout annotation resizing and auto sizing behaviors. (#8692)
*  Key classes are now better protected against misuse to show potential bugs early. (#8892)
*  Fixes an issue where `PSPDFLibrary` would send duplicate notifications when spotlight indexing is disabled. (#8833)
*  Fixes loss of selection when the app is backgrounded. (#8458)
*  Fixes an issue where XFDF fields are incorrectly filled. (#8925)
*  Fixes an issue where the scrubber bar could take a lot of CPU time to layout. (#8876)
*  Fixes an issue with loading invalid annotations. (#8869)
*  Fixes an issue with view state restoration when using specific scroll and transition modes. (#8801)
*  Fixes an issue while garbage collecting PDF objects on saving non-incrementally. (#8901)
*  Fixes documentation of `-[PSPDFLibrary updateIndex]` which incorrectly stated that the method would return immediately and was asynchronous. (#8893)
*  Fixes an issue with parsing invalid sound annotations. (#8814)
*  Fixes an issue where search result cells showed the wrong search result when tapping it in some cases. (#8931)
*  Fixes an issue where the frame of note annotations was incorrectly displayed on the page. (#8865)
*  Fixes a crash when trying to save a photo and `NSPhotoLibraryUsageDescription` is not set in your Info.plist. The menu item is no longer shown unless a usage description is found. You should add a usage description to your Info.plist to re-enable this feature. (#8992)
*  Fixes a crash when using custom versions of SQLite 3.11 or higher. (#8967)

### 6.2.1 - 30 Nov 2016

*  API: Adds `indexedUIDCount` and `indexedUIDs` properties to `PSPDFLibrary`. (#8757)
*  Enables integration with [PSPDFKit Instant](https://pspdfkit.com/instant).
*  Improves the UI when asking for an author name the first time the user wants to add an annotation. (#6160)
*  Adds key commands to allow up/down arrow keys on a physical keyboard to change pages. (#8395)
*  Fixes a missing deprecation statement on `-[PSPDFDocument diskCacheStrategy]`. Disk cache strategy is deprecated since PSPDFKit 6.1. (#8783)

### 6.2.0 - 28 Nov 2016

_See the [announcement post](https://pspdfkit.com/blog/2016/pspdfkit-ios-6-2/)._

*  API: Changes `PSPDFDocumentSharingCoordinatorDelegate` selector from `documentSharingCoordinator:didFailWithError:` to `documentSharingCoordinator:didFinishWithError`. New call is more general and is called on success and on failure. (#8568)
*  API: Changes `-[PSPDFDocumentSharingViewController initWithDocument:]` (and for subclasses) to `-[PSPDFDocumentSharingViewController initWithDocuments:]`. Update property `document` to `documents` in `PSPDFDocumentActionExecutor`. (#8595)
*  API: Adds new options to customize the appearance of `PSPDFSearchViewController`. (#8679)
*  API: Adds `closeMode` property to `PSPDFTabbedViewController`, which may be used to show the close button in all tabs, or in all tabs but only in regular width size classes. The Boolean `allowsClosingDocuments` is deprecated. If you previously set this property to `NO`, use `PSPDFTabbedViewControllerCloseModeDisabled` instead. The default behavior has not changed. (#8595)
*  Adds support for rendering annotations in their corresponding color in (color correct) night mode. (#8582)
*  Adds support for annotation flags `PSPDFAnnotationFlagReadOnly` and `PSPDFAnnotationFlagLocked`. (#1182)
*  The default allowed disk cache size has been decreased and the set allowed cache size is now treated as a hint. The actual maximum cache size might be smaller depending on several conditions. (#8648)
*  Improvements to the render engine for performance and correctness. (#8310)
*  Improves memory handling in low-memory situations and with many open documents. (#8352, #8447)
*  Improves document sharing by adding support for handling multiple documents. (#8715)
*  Improves user experience when adding a new page via the Document Editor. (#8450)
*  Improves performance of decoding JPEG images. (#8712, #8673)
*  Improves disk cache. It is now smarter which leads to smaller cache size in many cases. (#8648)
*  Improves compatibility with Swift. (#7990, Z#5063)
*  Improves software dimming so it no longer affects the navigation bar style. (#8663)
*  Improves handling of camera access being denied when using UIImagePickerController. (#8546)
*  Improves bookmark handling in Processor and DocumentEditor. (#8091)
*  Improves scrubber thumbnail shadow rendering in double page mode. (#8669)
*  Improves text when no search results are found. (#8769)
*  Improves translations. (#8698)
*  Improves `PSPDFLibrary`'s handling of documents that are to be removed from the index.
*  Works around a UIKit issue that disables user interaction on custom bar button items in some scenarios. (V#407, rdar://problem/18906964)
*  Fixes an issue where `pdfViewController:didShowController:options:animated:` could pass `nil` as the `controller` parameter in rare cases. (#8641)
*  Fixes an issue where form elements where partly parsed if they were not part of the license. (#8567)
*  Fixes memory issues in the document sharing controllers. (#8568)
*  Fixes an issue where `PSPDFLibraryFileSystemDataSource` incorrectly handled removal of a document from the search index (#8642).
*  Fixes an issue where the PDF file was modified even if `PSPDFAnnotationSaveModeExternalFile` was specified. (#8667)
*  Fixes an issue with flattened form annotations. (#8151)
*  Fixes an issue where the "Open In" option didn't export a document if it wasn't file based. (#8683)
*  Fixes an issue where annotations could be printed when the "Print without annotations" option was selected. (#8650)
*  Fixes an issue where text selection was broken after the app came back from background. (#8660)
*  Fixes the tabbed bar not scrolling to show all of the selected tab if the tapped tab is already selected. (#8687)
*  Fixes an issue that caused annotations to flicker when deselecting while a render view was present. (#8661)
*  Fixes an issue requesting text from glyphs on certain documents. (#8657)
*  Fixes an issue where the text selection is lost when switching apps. Tapping the selection brings back the menu now. (#8458)
*  Fixes an issue where text was rendered incorrectly. (#8102)
*  Fixes an issue where the `pdfDocumentDidSave:` delegate callback was invoked despite the document not being modified by the save operation. (#8722)
*  Fixes a crash that could occur when the device was rotated while the content offset was animated in continuous scroll mode. (#8710)
*  Fixes an issue where arrow annotation default style changes were leaking over to line annotations. (#8691)
*  Fixes an issue where scrubber thumbnail shadow was applied multiple times. (#8669)

### 6.1.0 - 15 Nov 2016

_See the [announcement post](https://pspdfkit.com/blog/2016/pspdfkit-ios-6-1/)._

PSPDFKit now requires and is built with Xcode 8.1 (8B62).

*  API: Adds new Analytics API. (#8224)
*  API: Adds document saving callbacks to `PSPDFDocumentDelegate`. (#8234)
*  Adds CoreSpotlight indexing to `PSPDFLibrary` which adds entire PDFs (with full text) to native search. (#6966, #8421)
*  Adds `PSPDFMemoryCache` and `PSPDFDiskCache` to give more control over the behavior of the cache. (#7964)
*  Adds translations for user-facing strings in the settings for the languages da, el, fi, id, it, ko, ms, nl, pl, pt-BR, pt-PT, sv, th, and tr. (#8413)
*  Adds translations for using-facing strings in all supported languages (#8613)
*  Adds option to add a new page in the Document Editor using an image. (#8219)
*  Adds support for custom CIFilter when rendering. (#8332)
*  Improves visibility of disabled toolbar buttons. (#8319)
*  Improves page index restoration when rotating from double page mode to single page mode. (#8272)
*  Improves view state restoration when scrolling between pages. (#8373)
*  Improves memory usage handling of `PSPDFProcessor`. (#8352)
*  Improves digital signature permissions. (#8391)
*  Improves handling of bookmarks for nonexistent pages. (#8466)
*  Improves document editor page rendering by showing annotations. (#8467)
*  Improves layout in thumbnail mode in some edge cases. (#8466)
*  Improves memory cache efficiency when using the scrubber bar in large documents. (#8470)
*  Improves the default value for the page range when exporting a document. (#8532)
*  Improves document caching behavior when using the document editor. (#8537)
*  Improves view state restoration when returning from background. (#8307)
*  Improves the look of the search results. (#8490)
*  Fixes a race condition where `PSPDFDocumentUnderlyingFileChangedNotification` and `pdfDocument:underlyingFileDidChange:` were triggered even though the save originated from the document itself. (#8525)
*  Fixes a race condition in the Document Editor. (#8370)
*  Fixes a few rare crashes that we discovered in the SDK after shipping PDF Viewer. (#8367)
*  Fixes an issue where annotations didn't update when dragging resizing knobs unless their bounding box changed. (#8354)
*  Fixes an issue that could occur during app termination under rare conditions. (#8366)
*  Fixes an issue due key-value observing of `title` in specific situations. (#8376)
*  Fixes an issue where images from the camera weren't compressed according to `PSPDFDefaultImageCompressionKey`. (#8154)
*  Fixes an issue in the Document Editor when selecting all pages could cause collection view crash. (#8402)
*  Fixes an issue on adding annotations to a document with a `DocMDP` signature. (#8391)
*  Fixes an issue that made the close button reappear after setting it to nil. (#8383)
*  Fixes an issue with sound annotations being distorted or rendered incorrectly. (#8386, #8429)
*  Fixes an issue that leads to excessive CPU usage when opening invalid documents. (#8427)
*  Fixes an issue where the caret in a note's text view was missing when editing. (#8381)
*  Fixes an issue where adding a custom stamp did not always exit the stamp mode automatically. (#8462)
*  Fixes an issue where line annotations were saved in a wrong format. (#8396)
*  Fixes an issue where some annotations flickered when selecting them. (#8469)
*  Fixes an issue where background updates via document JavaScript might cause property changes on the wrong thread. (#8468)
*  Fixes an issue where annotations could be rendered with a wrong image. (#8493)
*  Fixes an issue where the border of a page in the thumbnail view wasn't rendered correctly in rare cases. (#8380)
*  Fixes an issue where text annotation was always scrolled to the top of the keyboard when continuous scrolling was used. (#8355)
*  Fixes an issue where tabbedPDFController:shouldChangeVisibleDocument: and tabbedPDFController:didChangeVisibleDocument: could be called without the document actually changing. (#8530, #8525)
*  Fixes an issue where language auto-detection for text-to-speech could fail in rare cases. (#8593)
*  Fixes an issue with opening a PDF with bookmarks in Preview.app. (#8591)
*  Fixes an issue where stamp annotations could disappear. (#8597)
*  Fixes an issue where modifying the document page count using the document editor could trigger an assertion in continuous scroll mode. (#8604)
*  Fixes incorrect declaration of PSPDFLogLevelMask. It's now correctly marked as an NS_OPTIONS bitmask. (#8628)
*  Fixes an issue where the first page could not be selected in the scrubber bar in some cases. (#8623)
*  Fixes an issue with the document editor's page sizes when adding new pages. (V#381)

### 6.0.3 - 24 Oct 2016

*  Improves customization of close button by making `-[PSPDFNavigationItem closeBarButtonItem]` nullable. (#8206)
*  Improves updating bar button items that are not currently added to PSPDFViewController's navigation item. (#8086)
*  Improves large memory usage handling of `PSPDFProcessor`. (#8291)
*  Improves render performance in cases where a large image is already available in the cache. (#8334)
*  Update notes font to match current iOS look and feel. (#8267)
*  Adds translations for user-facing strings in the settings for the languages de, en, es, fr, ja, ru, zh-Hans and zh-Hant. (#8286)
*  Adds option `alwaysRewriteOnSave` to `PSPDFDocument` to allow rewriting the whole document on demand. (#8290)
*  Fixes an issue that produced a large number of cache misses in the disk cache. (#8334)
*  Fixes an issue where annotations could be added even though annotations were disabled. (#8123)
*  Fixes an issue where the action executor could assert when no document was set. (#8232)
*  Fixes an issue where in very rare cases, vertical numbers could be reversed. (#5203)
*  Fixes issues when saving to the current file in the document editor. (#8259, #8233)
*  Fixes an issue where the default tint color was not applied for knob views. (#7940)
*  Fixes an issue where stamps with a missing subject caused rendering issues. (#8296)
*  Fixes an unlikely crash in annotation parsing. (#8295)
*  Fixes an issue with embedding new sound annotations. (#8207)
*  Fixes an issue where the menu controller was unexpectedly hidden. (#8169)

### 6.0.2 - 10 Oct 2016

*  `PSPDFViewController`, `PSPDFMultiDocumentViewController` and `PSPDFTabbedViewController` now update the UI when document titles change. (#8120)
*  Performance and stability improvements to the PDF render engine. (#7890)
*  Improves flattening logic for PDFs with extensive use of `ExtGStates` dictionaries. (#7484)
*  Improves image caching for annotations. (#8114)
*  Relaxes licensing logic to be more forgiving when the license key is set at a later stage. (#7984)
*  If `document.canSaveAnnotations` is false, the annotation view is configured to not be editable by default. (#8116)
*  Fixes an issue where the annotation menu was not updated correctly for certain edge cases. (#8036)
*  Fixes an issue where disabling annotations caused the document to render incorrectly. (#7992)
*  Fixes an issue where moved files were not detected correctly. (FS#50)
*  Fixes an issue where swiping through a large PDF could cause a crash. (#8141)
*  Fixes issues with flattening annotations on certain documents. (#7484,  #7486)
*  Fixes an issue where the menu controller was not correctly hidden when some annotation types were deselected. (#7986)

### 6.0.1 - 3 Oct 2016

*  Updates OpenSSL to 1.0.2j. (#7989)
*  API: Make `setRotation:forPageAtIndex:` on `PSPDFDocumentProvider` public again. (Z#4618)
*  The `PSPDFBookmarkViewController` no longer calls `save:` automatically when dismissed. (#8033)
*  Improves thumbnail rendering related to the night mode settings. (#7913)
*  Improves memory usage when searching in a large document. (#7958)
*  Improves annotation handling in environments that do not allow saving annotations. (#7595)
*  Improves delegate behavior for `pdfViewController:didRenderPageView:` which is now also called in case of a cache hit. (#8020)
*  Improves handling search results for deleted or changed annotations. (#8030)
*  Fixes an issue where images in a too low resolution could be cached. (#8057)
*  Fixes an issue with night mode and the tabbed view controller. (#7913)
*  Fixes an issue where PSPDFViewController wrongly displayed a close button in certain scenarios. (#7993)
*  Fixes an issue where annotations could be edited but not saved. (#8002)
*  Fixes an issue where annotations were not positioned correctly if the page was rotated and cropped. (#7922)
*  Fixes an issue where an annotation could disappear when other annotation was selected. (#8035)
*  Fixes an issue where circle annotation's border was not rendered. (#7982)

### 6.0.0 - 23 Sep 2016

_See the [announcement post](https://pspdfkit.com/blog/2016/pspdfkit-ios-6-0/)._

[PSPDFKit 6 is a major new release.](/blog/2016/pspdfkit-ios-6-0/) It's fully optimized for Xcode 8 and iOS 10, comes with improved API for Swift 3, faster rendering, various fixes and a visual refresh. These updates make it our best release so far. As usual, our versioning scheme supports the current and the previous iOS version. We fully support iOS 9, while also focusing on many new features that iOS 10 offers.

*  API: Many getters/setters named `page` or `pageNumber` have been renamed to `pageIndex`. (#7451)
*  API: The `combineInk` property on `PSPDFDrawView` has been renamed to `drawCreateMode` and exposed to `PSPDFConfiguration`. (#7344)
*  API: `PSPDFPlugin` has been removed. Use `PSPDFStylusManager.availableDriverClasses` to configure drivers. (#7266)
*  API: Initialization methods of `PSPDFProcessorSaveOptions` has been changed to be cleaner and convenience initialization has been deprecated. (#7422)
*  API: `settingsOptions` configuration property is set to `All` by default, but `settingsButtonItem` has to be explicitly added to navigation item. (#7310)
*  API: Removes the legacy `PSPDFLinkAnnotationView.overscan` property. (#7521)
*  API: Replaces `NSSet<NSNumber *>` with `NSIndexSet` in the document editor classes. (#7676)
*  Updates OpenSSL to 1.0.2i. (#7944)
*  Adds an option to set the line width of the eraser tool using `PSPDFAnnotationStyleManager`. (#7748)
*  Adds a page mode control to `PSPDFSettingsViewController`. (#7708)
*  Adds a configurable bookmark indicator button to each page of the PDF. (#7224)
*  Adds haptic feedback on the iPhone 7 and 7 Plus using the `UIFeedbackGenerator` API. (#7906)
*  Adds new keyboard shortcuts for iPad hardware keyboards. (#7707)
*  The link annotation borders are now hidden by default. (#7521)
*  The `useParentNavigationBar` configuration option now forwards the `prompt`, `backBarButtonItem` and `hidesBackButton` properties to the parent’s navigation item. (#7577)
*  The page labels are now automatically dimmed in night mode. (#7562)
*  The `PSPDFNavigationItem` now has API to manage the close button in case the view controller is presented in a modal context. (#7509)
*  Makes `PSPDFDefaultFileManager` use background tasks when performing coordinated file access. (#7603)
*  Make zoom out behaviour consistent -- double tapping when zoomed in now always zooms out. (#7394)
*  Makes all annotation line endings solid, irrespective of the line's style. (#7715)
*  Calling `reloadData` on `PSPDFViewController` now automatically preserves the current view state. (#7418)
*  Logging now uses the constants from `os_log`. (#7493)
*  Improves the performance and memory situation of the thumbnail view mode and the document view mode. (#7915)
*  Improves the API for rendering and caching document. (#6881, #7645)
*  Improves toolbar drag gesture by prioritizing it over the interactive pop gesture. (#7369)
*  Improves audio annotation UI. (#7404)
*  Improves text selection UI in several edge case scenarios. (#7399, #7400)
*  Improves how the tabbed view controller handles files and saves. (V#83, V#92)
*  Improves `PSPDFDefaultFileManager` to use background tasks when performing coordinated file access. (#7603)
*  Improves stamp annotation inspector, which now opens with the last recently selected tab. (#7446)
*  Improves annotation button handling when annotation saving is disabled. (#7590)
*  Improves resource usage when indexing a large amount of documents. (#7397)
*  Improves notification based APIs with Swift friendly `NSNotificationName` type. (#7825)
*  Improves performance of loading annotations in certain situations dramatically. (#7873)
*  Removes workaround for keeping status bar view controller unchanged on iOS 9 when using the half modal presentation style. This has been fixed in iOS 10. (#7544)
*  Fixes an issue where batch updates where not posted when interactively picking a color. (#6900)
*  Fixes an issue where ink annotations were not rendered with the proper line thickness in some cases. (#7437)
*  Fixes an issue where ink annotations were not unarchived properly from old `NSKeyedArchiver` files. (#7629)
*  Fixes an issue that caused two different versions of the same document kept in memory when using the tabbed view controller in some situations. (V#80)
*  Fixes changing the documents of the tabbed view controller before the view was loaded resulting in loading the view and possibly crashing. (#7563)
*  Fixes the tabbed view controller not scrolling to show newly inserted documents. (#7561)
*  Fixes navigation item updates not being animated in some cases. (#7577)
*  Fixes an issue where the text selection offsets were wrong in certain documents. (#7271)
*  Fixes an issue where the tabbed bar could be incorrectly positioned after interface rotation. (#7179)
*  Fixes an issue where shared document might not have recent changes. (#7717)

### 5.5.5 - 22 Sep 2016

*  Rename a method called `finished:` in PSPDFKit to work around a bug in Apple's App Store review process. (rdar://28252227)

### 5.5.4 - 20 Sep 2016

*  Improves handling of document titles with specific characters. (#7787)
*  Fixes an issue where the menu controller blur background was larger than the actual popover by working around an UIKit bug. (rdar://28275291, #6162)
*  Renames some methods to work around a radar. (rdar://28252227)

### 5.5.3 - 12 Sep 2016

PSPDFKit 5.5.3 has been tested with the latest stable Xcode 7.3.1 and iOS 10 GM.

PSPDFKit 6 for iOS, which is compatible with Xcode 8 and works with iOS 9 and 10, is coming later this month. See [our article about version support](https://pspdfkit.com/guides/ios/current/announcements/version-support) for more details.

* Changes some internal API to prevent triggering of Apple's private API checks. (#7751)
* Fixes an issue where the page index was not shown in certain cases in thumbnail mode. (#7740)
* Fixes an issue with changing the appearance mode in `PSPDFTabbedViewController`. (#7658)
* Improvements to the rendering engine and speed enhancements. (#7760)

### 5.5.2 - 5 Sep 2016

*  Adds option to change the color for the thumbnail button in page label. (#7696)
*  Fixes an issue where auto page mode with curl transition could cause the document to be presented in single page mode instead of double page mode. (#7586)
*  Fixes the eraser overlay when using an Adonit stylus. (#7535)
*  Fixes an issue where a highlight annotation was rendered with a border. (#7618)
*  Fixes issues where clearing of text field form elements was not working correctly. (#7623)
*  Fixes an issue where some documents couldn't be exported or printed. (#7585)
*  The page label is now displayed instead of the page index in the thumbnail view, when available. (#7671)

### 5.5.1 - 23 Aug 2016

*  API: `PSPDFActivityViewController` is now public. (#7529)
*  Checks for the `NSMicrophoneUsageDescription`, `NSCameraUsageDescription` and `NSPhotoLibraryUsageDescription` keys in the app Info.plist. Will warn if missing and stop the functionality on iOS 10 if linked with SDK 10. Learn more at https://pspdfkit.com/guides/ios/current/getting-started/permissions/ (#7407)
*  Checks the linked SDK with the expected value and warns if there is a mismatch. (#7407)
*  Improves the view state restoration logic when a view controller is presented/dismissed above the `PSPDFViewController`. (#7450)
*  Fixes an issue where the playback duration of a sound annotation was wrong in some cases. (#7401)
*  Fixes an issue where files were no longer monitored for file changes after they have been saved once. (#7319)
*  Fixes an issue where file handlers where not properly closed in some cases. (#7319)
*  Fixes an issue where invoking a cached `PSPDFSearchViewController` without changing search terms could lead to missing highlights. (#7445)
*  Fixes an issue where thumbnail generation could crash if the size of the first page couldn't be read. (#7443)
*  Fixes an issue where a popover might be incorrectly re-positioned after keyboard presentation. (#7456)
*  Fixes an issue where `PSPDFLibrary.saveReversedPageText` couldn't be disabled. (#7519)
*  Fixes an issue where frequent rendering passes could cause a crash. (#7570)

### 5.5.0 - 28 Jul 2016

*  Adds new helpers methods to get and set the default annotation username. (#7265)
*  Renders appearance stream for Square and Circle annotations if one is set. (#7327)
*  Improves performance around rendering JPEG 2000 and annotation parsing.
*  Improves content search within annotations to no longer search generated text like "Ink Annotation". (#7270)
*  Improves compatibility when flattening documents with non-standard headers. (#7212)
*  Improves annotation change updates. (#6196)
*  Improves search popover placement logic when the toolbar is not at the top of the screen. (#7233)
*  Improves logic around copying forms via the processor when the source document has invalid form entries. (#7273)
*  Improves scrolling performance of the thumbnail view. (#6503)
*  Improves alert presentation in popovers. (#7277)
*  Improves JPEG2000 decoding performance. (#7307)
*  Improves Wikipedia language resolving and popover presentation. (#7322)
*  Fixes an issue while processing documents with unsaved annotations. (#7135)
*  Fixes possible logging about unsatisfiable constraints when the view is not full screen. (Z#3346)
*  Fixes the placeholder for when there is no document sometimes being displayed too low when the view is not full screen. (#7239)
*  Fixes an issue with custom thumbnail layouts that are not based on `PSPDFThumbnailFlowLayout`. (#7249)
*  Fixes an issue where plugin ordering was reversed. Make sure to check if plugins are still called after this update. (#7268)
*  Fixes an issue where Swift-based plugin subclasses were not always automatically detected if they were based on an existing plugin class. (#7268)
*  Fixes an issue where incorrect annotation search results could be returned. (#7343)

### 5.4.1 - 8 Jul 2016

*  API: `activityViewControllerWithSender:` on `PSPDFViewController` now enables getting a preconfigured activity view controller instance. (#7147)
*  API: Exposes `application` on the PSPDFKit singleton to customize URL opening behavior. (e.g. you can now override `canOpenURL:`)
*  Improves exporting of images that are mirrored in the PDF document. (#7089)
*  Improves color generation for knobs. (#6852)
*  Improves annotation cell layout in edit mode. (#4158)
*  Fixes a regression in iOS 10 where `UIActivityController` would crash on presentation. (rdar://27261367, #7181)
*  Fixes an issue while processing documents with unsaved annotations. (#7135)
*  Fixes an issue with extracting embedded files. (#7154)
*  Fixes an issue with propagating `isEncrypted` properly. (#7153)

### 5.4.0 - 1 Jul 2016

_See the [announcement post](https://pspdfkit.com/blog/2016/pspdfkit-ios-5-4/)._

*  API: `renderOptions` now has an associated type. The property has been deprecated in favor of `setRenderOptions:type:` and `getRenderOptionsForType:context:` where context depends on the type. This also removes the previous subclassing hook `renderOptionsForPage:`. Subclass `getRenderOptionsForType:context:` directly instead if you need this kind of advanced behavior.
*  Improves document parsing to be both faster and cover more edge cases with non-standard-compliant documents. (#6820)
*  Removes workaround for rdar://23285766 (Swift over-optimization) as this has been fixed in Swift 2.2. (#6880)
*  Adds sqlite3 compile option checks for `THREADSAFE`, `ENABLE_FTS3`, `ENABLE_FTS3_PARENTHESIS`. (#6950)
*  Adds support for creating a temporary data provider to `PSPDFFileManager`. This enables the `PSPDFProcessor` to use a secure temporary file, if wanted. (#7056)
*  Improves `UIAppearance` support on `PSPDFLabelView` and `PSPDFBackForwardButton` and freshens up the default design. (#7073)
*  Improves annotation editing behavior for protected documents. (#6885)
*  Improves the layout of segmented controls when space is limited. (#6889)
*  Improves loading of asset annotations. (#6879)
*  Improves handling of outline view. (#6902)
*  Improves `PSPDFProcessor` API to allow processing into a `id<PSPDFDataSink>`. (#7042)
*  Improves rendering performance in certain situations. (#6944)
*  Improves accessibility around cells with sliders. (#7046)
*  Improves handling of corrupt cross reference tables in PDFs. (#6838)
*  Improves precision when writing highlight annotations, leading to better `highlightedString` results. (#6652)
*  Improves height calculation logic for the page range selection view controller. (#7104)
*  Improves `containsAnnotations` no longer counts already (soft) deleted annotations. (#6956)
*  Improves reliability of aspect-locked resizing with `PSPDFGuideSnapAllowanceAlways`. (#7088)
*  Improves rotation animations in continuous scrolling mode. (#7077)
*  Improves text markup annotations rendering for rotated page. (#6477)
*  Improves zoom behavior when searching for annotations. (#6890)
*  Silences a missing license feature warning when toggling the HUD. (#7018)
*  Fixes subclassing of text overlay annotations. (#6954)
*  Fixes a visual glitch during `PSPDFBackForwardButton` fadeout animation. (#7103)
*  Fixes an issue where statically linked sqlicipher library conflicted with OS version dynamically linked in PSPDFKit.framework. (#6929)
*  Fixes an issue where a document couldn't be unlocked due to a overflowing integer in the document. (#6919)
*  Fixes an issue with `sqlite3_errstr` not being available before iOS 8.2. (#6970)
*  Fixes an issue where setting `PSPDFDocumentSharingOptionPageRange` could trigger an assertion while printing. (#6953)
*  Fixes an issue where schemes where interpreted case sensitive when creating URL actions on iOS 9. (#6960)
*  Fixes an issue where the add bookmark button was not presented in the bookmarks popover. (#7011)
*  Fixes an issue where incorrect bookmark name was displayed on the list right after adding new bookmark. (#7026)
*  Fixes an issue where a free text annotation couldn't be embedded in a document that contains invisible text. (#7008)
*  Fixes an issue where a page couldn't be properly rotated to 0. (#7044)
*  Fixes an issue where setting the document on controller during presentation transition could result in broken page navigation. (#7054)
*  Fixes an issue where `NSData` backed files with dots in their title where not exported correctly when sharing. (#6904)
*  Fixes an issue on trying to strip empty pages. (#7015)

### 5.3.8 - 6 Jun 2016

*  Adds `PSPDFRenderInteractiveFormFillColorKey` as a render option to make the form element color override customizable. (#6529)
*  Adds a better log message if a document is encrypted and annotations can't be embedded. (#6765)
*  Adds `cropBox` and `mediaBox` to `PSPDFPageInfo`. (#6745)
*  API: The `vertices` property of `PSPDFImageInfo` is now boxed instead of a raw pointer array. (#6831)
*  API: The public constructor for `PSPDFImageInfo` has been removed - this class should never be manually constructed. Instead, get it from `PSPDFTextParser`. (#6831)
*  Improves rendering performance for some complex documents. (#6686)
*  Improves the position of the filter UI element in the thumbnail view mode. (#6651)
*  Improves security in various critical areas of the framework via a code audit. (#6774)
*  Fixes a regression that raised an exception when changing the font or resizing a free text annotation. (#6709)
*  Fixes an issue where UI was clipped in a scrollable thumbnail bar in rare cases. (#6695)
*  Fixes an issue where multiple embedded files would not be correctly displayed. (#6784)
*  Fixes an issue related to JavaScript and forms that could lead to a type mismatch for the `contents` property. (#6781)
*  Fixes an issue where bar button items would not always correctly update when using `PSPDFTabbedViewController`. (#6789)
*  Fixes an issue where content would be inset to account for the tabbed bar even when the tabbed bar was hidden. (#6787)
*  Fixes an issue where during annotation resize the wrong coordinates where used in rare conditions. Replaces `-[PSPDFResizableView centerPointForOuterKnob:]` with `-[PSPDFResizableView centerPointForOuterKnob:inFrame:]`. (#6828)
*  Fixes an issue where some Free Text Annotations disappeared while editing. (#6826)

### 5.3.7 - 27 May 2016

*  Adds API to customize the color pickers. (#4502)
*  Adds API `titleForDocumentAtIndex:` as subclassing hook on `PSPDFMultiDocumentViewController`. This can be used to customize tab bar titles. (#6693)
*  Adds support for scaling a page in `PSPDFProcessor`.
*  Adds support for changing the CropBox or MediaBox in `PSPDFProcessor`.
*  Improves the `PSPDFKit` shared instance to no longer automatically load, which can slightly improve startup performance. (#6682)
*  Fixes a regression that could prevent the 'more' menu from appearing in the document editor. (#6619)
*  Fixes an issue where note annotations rendered as a black icon when embedded into a document. (#6411)
*  Fixes an issue where saved values in the text fields being hidden in other PDF readers. (#6589, #6593)
*  Fixes an issue where text form fields (rotated) were using a huge font size for the content. (#6595)

### 5.3.6 - 18 May 2016

*  Updates OpenSSL to 1.0.2h.
*  Adds a delegate method (`documentSharingViewController:willShareFiles:`) that enables access to files/file names before they are shared. (#6597)
*  Adds a `pageMargins` setter on `PSPDFNewPageConfigurationBuilder`. (#6566)
*  Improves the `PSPDFProcessorConfiguration` initializer for creating a completely new document. (#6566)
*  Improves the handling of annotations when the delegate does not return them via `pdfViewController:shouldSelectAnnotations:onPageView:`. (#6143)
*  Improves touch handling logic for forms that are readonly. (#6143)
*  Improves link handling inside an web or text view within sheet presentation of modal view controllers by working around an UIKit bug. (rdar://26295020,  #6580)
*  Improves performance, placement and aspect ratio handling of annotations during resizing. (#6556)
*  Improves keyboard handling for form elements. (#6551)
*  Fixes a regression that could cause issues with searching via `PSPDFSearchViewController`. (#6605)
*  Fixes an issue where resizing multiple annotations could lead to an assertion. (#6528)
*  Fixes an issue where page layout could be offset too much after rotating in continuous scroll mode. (#6563)
*  Fixes an issue where flattened annotations were misplaced/rotated in a particular non-compliant document. (#6510, #6600)

### 5.3.5 - 13 May 2016

*  API: `PSPDFProcessorConfiguration` is now a failable initializer if the document is not valid. Previously this did throw an exception. (#6557)
*  API: The render manager has been streamlined and the renderer accessor has been made readonly and deprecated. (#6498)
*  Adds the option to share images of the current page via `PSPDFDocumentSharingOptionImage`. (#2793)
*  Adds an option to choose the last line alignment of thumbnail layouts. (#6502)
*  Adds configurable `PSPDFSettingsViewController` that can be used to change some UX aspects of `PSPDFViewController`. (#6082)
*  Adds `PSPDFBrightnessManager` that controls screen brightness. (#6082)
*  Improves the way how speech synthesis detects the voice it uses. (#6481)
*  Improves gesture detection in the color picker. (#5669)
*  Fixes an issue where the text to speech voice sounded very robotic (#6481)
*  Fixes an issue where selecting an annotation which had no color set could lead to an assertion. (#6496)
*  Fixes an issue where the processor didn't rotate the document correctly. (#6493)
*  Fixes an issue where flattened annotations were misplaced. (#6510)
*  Fixes an issue where the document provider rotation wasn't taken into account on exporting with the processor. (#6516)
*  Fixes an issue where the rotation animation did not look right. (#6131)
*  Fixes an issue that could lead to presented view controllers being mistakenly dismissed. (#6512)
*  Fixes an issue that could lead to crashes when calling `description` on some model objects. (#6524)
*  Fixes an issue with "light" weight font was selected in font substitution process instead of the missing "regular" weight font. (#6487)
*  Deprecates configuration methods on `PSPDFBrightnessViewController`. Use `PSPDFBrightnessManager` instead. (#6082)

### 5.3.4 - 4 May 2016

This version has been compiled with Xcode 7.3.1.

*  Adds a convenient way to enforce aspect ratio preserving annotation resizing. See `AspectRatioConservingResizingExample.swift` and the new `PSPDFGuideSnapAllowanceAlways` constant. (#6373)
*  Adds logic to automatically stop recording sound annotations. The default is 5 minutes. This can be changed through `-[PSPDFConfiguration soundAnnotationTimeLimit]`. (#4920)
*  Adds a file watcher: `PSPDFDocument` now notifies the delegate when underlying files are updated by another source. (#6399)
*  Set correct class visibility for `PSPDFNewPageConfigurationBuilder`.
*  Improves the way search results are displayed. (#6231, #6011)
*  Improve performance when opening the Thumbnail view. (#5874, #6148)
*  Improves error handling for digital signatures verification. (#6253)
*  Improves the `PSPDFProcessor` API and clarifies the save options. (#6463)
*  Fixes an issue that caused a crash during search. (#6425)
*  Fixes an issue that caused extensive CPU usage when no document was set on a `PSPDFViewController`. (#6418)
*  Fixes an issue where the annotation browser was rendering text annotations without whitespaces in some cases. (#6273)
*  Fixes an issue where the page label could incorrectly capture certain touches. (#6360)
*  Fixes an issue where the minimum annotation size would not be correctly enforced after interface rotation (#6382).
*  Fixes an issue where note annotations weren't correctly embedded while processing. (#6411)
*  Fixes an issue where the duration could be displayed as indeterminate in rare cases for m3u8 playlists. (#6450)

### 5.3.3 - 22 Apr 2016

*  The document editor API now supports new document creation. (#6262)
*  `PSPDFViewController` now honors the initial page setting, even for password protected documents. (#6146)
*  Improves page movement UI in the document editor. (#6159)
*  Localization updates and fixes.
*  Improves margin handling in certain view modes and adds a new example - `DynamicMarginsExample`. (#6294)
*  Fixes an issue where annotations were not always copied correctly in the document editor when the page already exists. (#6216)
*  Fixes an issue where screen brightness slider had wrong initial value. (#6245)
*  Fixes an issue where sound and video gallery items did not stop playing when changing view modes. (#5997)
*  Fixes an issue where umlauts where stripped after saving a choice annotations. (#6285, #6323)
*  Fixes an issue where the wrong value was saved when selecting an option from a choice annotation. (#6285)
*  Fixes an issue where a presented JavaScript alert could be automatically dismissed after presentation. (#5996)
*  Fixes an issue in certain documents where text selection contained more text that was actually selected. (#6213)
*  Fixes an issue with watermarking multiple (50+) pages using the PSPDFProcessor. (#6031)
*  Fixes an issue where a gallery displayed in a popover would not switch into fullscreen on double-tap. (#6296)
*  Fixes an issue that stopped audio playback from other apps during framework initialization. (#6330)
*  Fixes an issue where landscape pages didn't rotate correctly. (#6265)
*  Fixes an issue where a deprecated syntax variant of the JavaScript `mailDoc` function was handled incorrectly. (#6331)
*  Fixes an issue where flattening and removing annotations at the same time caused problems. (#6344)

### 5.3.2 - 14 Apr 2016

*  Adds an API to customize the controller state UI added in 5.3.0. (#6106)
*  API: The undo methods in `PSPDFAnnotationStateManager` are now deprecated, use `PSPDFUndoController` on `PSPDFDocument` instead. (#6177)
*  If annotations are changed programmatically, they are now correctly updated even if they have just been created via the annotation toolbar. (#6195)
*  Annotation preset properties for disabled properties are no longer applied. (e.g. disabling fill color will no longer set fill color when choosing a preset) (#6233)
*  The processor now supports copying forms from source and any external document to the generated document. (#5975)
*  Fixes incorrect assertions on some document editor controllers on iOS 8. (#6188)
*  Fixes an issue where delayed document setting could result in missing updates on the scrubber bar. (#6210)
*  Fixes an issue that resulted in a crash in the page range selection on iOS 8. (Z#3370)
*  Fixes an issue when checking for a default password upon annotation saving.
*  Fixes an issue that prevented `PSPDFUndoControllerRemovedUndoActionNotification` from being sent out. (#6177)
*  Fixes an issue where thumbnail cells had a wrong image position. (#6174)
*  Fixes selection and menu placement for non-editable note annotations. (#6215)
*  Fixes an issue where software dimming view wasn't correctly positioned. (#6203)

### 5.3.1 - 8 Apr 2016

*  API: The variant that returns `NSData` on `PSPDFProcessor.generatePDFFromConfiguration` now correctly maps into Swift with a `throws`. (#6051)
*  `PSPDFDocument` has a new helper `containsAnnotations` which scans the document if it contains any relevant annotations (excluding links and widgets/forms). (#6099)
*  Pages are now positioned between fixed bars in page curl mode, ensuring no scrolling is needed if HUD elements or system bars do not auto-hide. (#6040)
*  The Document Editor now preserves as much as possible from an existing outline. (#5993)
*  Adds new document editing examples to PSPDFCatalog. (#6075, #6055)
*  Improves various status HUD symbols. They are now more in line with the modern iOS design and even subtly animate when being displayed. (#5829)
*  Improves toolbar button spacing and layout in compact sizes. (#5862)
*  Changes the unit for line thickness to pt. (#4694)
*  Filtering empty pages no longer filters the last white page preventing the creation of an invalid document. (Z#3384)
*  Various smaller performance improvements to the rendering engine.
*  Fixes an issue where `-[PSPDFDocument saveAnnotationsWithCompletionBlock:]` called the completion handler on an internal background queue when saving annotations. (#6033)
*  Fixes an issue where the new page range feature would not work correctly with a license that did not include the document editor feature. (Z#3354)
*  Fixes an issue where in rare cases page rendering was incorrect after rotating the screen. (#5527)
*  Fixes an issue that resulted in auto layout complaining about unsatisfiable constraints. (Z#3346)
*  Fixes an issue that resulted in the creation of page views even though the document was `nil`. (#6008)
*  Fixes an issue related to floating point calculations in the color picker when choosing a fill color on ARMv7 devices. (#6054)
*  Fixes an issue that could prevent the appearance mode from being completely restored when switching back from night mode. (#6080)
*  Fixes an issue resulting in bar button items missing or appearing late in rare cases. (#6072)
*  Fixes an issue that could make pages look blurry when using search under high memory pressure. (#6092)
*  Fixes an issue when trying to save annotations into a document that only has a owner password set. (#6090)
*  Fixes an issue when using a JavaScript action that invoked `this.pageNum`. (#6077)
*  Fixes an issue where the rotation set on the `PSPDFDocumentProvider` wasn't honored in the `PSPDFProcessor`. (#6115)
*  Fixes an issue where the flexible toolbar shadow does not animate together with the toolbar. (#6120)
*  Fixes an issue where text selection stopped working in certain situations. (#6118)
*  Fixes an issue where the share sheet did not respect annotation options. (#6125)
*  Fixes an issue where the annotation toolbar button count could in some cases be incorrectly determined when first displaying the annotation toolbar. (#6130)

### 5.3.0 - 31 Mar 2016

This release features the new Document Editor. This component allows users to access a whole host of page editing features, including new page creation, page duplication, reordering, rotation or deletion, as well as creating a new document from pages selected across multiple existing documents. If you would like to add the Document Editor to your license, ping our sales team to receive a quote.

*  Compiled with and requires Xcode 7.3.
*  API: `PSPDFProcessor` is now more powerful, but has breaking changes. See `PSPDFProcessorConfiguration` for details. (#5742)
*  Adds a complete new UI in case that the `PSPDFViewController` is unable to load a document or is empty. (#5510)
*  Improves the look of the password entry screen for locked PDF files. (#5510)
*  Bar button items can now be configured on a custom `navigationItem`. `PSPDFViewController`’s `leftBarButtonItems` and `rightBarButtonItems` properties have been deprecated. When moving from the old API, the order of the right bar button items will need to be reversed to match the UIKit convention. (#5830)
*  When tapping on a search result we now zoom to show the result in the document. This can be adjusted via `-[PSPDFConfiguration searchResultZoomScale]`. (#5758)
*  Replaces the `smartZoomEnabled` property of `PSPDFConfiguration` with a `doubleTapAction` property to be more flexible. (#4998)
*  The logic that finds custom search buttons is now smarter and will correctly anchor the search popover in more cases. (Z#3154)
*  The user can now select a range of pages to be exported when `PSPDFDocumentSharingOptionPageRange` is an allowed option. (#4573)
*  The user can now choose to only export annotated pages when `PSPDFDocumentSharingOptionAnnotatedPages` is an allowed option. (#4397)
*  The current search popover is now cached for faster access and to maintain the scroll position. (#5734)
*  Increase memory limit for images to allow rendering more complex documents. (#5677)
*  Uses the Photos framework instead of the Assets Library framework.
*  `PSPDFDocument` now implements `UIActivityItemSource` in a way that is compatible with Facebook, Twitter, Sina Weibo and Tencent Weibo. (#2739)
*  Adds a new `PSPDFLinkActionInlineBrowserLegacy` that forces the use of `PSPDFWebViewController` even on iOS 9 where the new Safari View Controller is available. This might be desirable in environments that need custom hooks on URLs which as of iOS 9 is not possible in `SFSafariViewController`. (#5744)
*  Better error handling when switching tokenizers in `PSPDFLibrary`. (#5771)
*  Searching now works better across new lines. (#5751)
*  The loupe now resets initial magnification after the line loupe mode has been used. (#5789)
*  Optimizes the size of thumbnails in the scrubber bar for very wide page layouts. (#4180)
*  Form choice fields with long labels are now fully displayed and switch to multi-line cells automatically. (#5796)
*  Improves interface performance when selecting annotations that are backed by complex appearance streams. (#5912, #5913)
*  Annotation hit testing extension area has been decreased to allow more precise input. (#5846)
*  Improves annotation toolbar autosizing. (#5854)
*  Fixes an issue where the “Dictionary” popover could be incorrectly placed in landscape. (Z#3167)
*  Fixes an issue where we would try to open Safari View Controller for file URLs, which are not supported. (#5837)
*  Fixes an issue where sound annotations would play without making any sound if the Ring/Silent switch is set to silent. (#5672)
*  Fixes an assertion that could be triggered when displaying a document at a size that would only allow for a single thumbnail to be displayed in the scrubber bar. When this condition is met, we now log a warning instead. (#5686)
*  Fixes an issue where a `PSPDFStatusHUDView` progress could start flickering in rare cases. (#5703)
*  Fixes layout issues with the search bar in the Kiosk example while rotating. (#2350)
*  Fixes an issue where the wrong page could be restored when switching the page mode with page curl transition while margins are set. (#5717)
*  Fixes an issue with a wrong zooming behavior in certain special cases around search results. (#5699)
*  Fixes an issue related to page labels and Korean localization. (Z#3176)
*  Fixes an issue where the outline view did not refresh its size properly. (#5737)
*  Fixes a regression where applying a `PSPDFViewState` in `viewWillAppear:` fails to restore the viewport in page–scroll–mode. (Z#3202)
*  Fixes a regression where manually overriding the `rotation` of the `PSPDFPageInfo` object via `setRotation:forPage:` did not work in all cases. (#5659)
*  Fixes an issue where under certain rare cases around updating configuration while rotation is active we didn't show link borders when they should be visible. (#5818)
*  Works around an issue in Xcode 7.3 that broke the Visual Debugger. (rdar://25311044)
*  Works around a bug in `GLKView` on iOS 9 that could cause a crash under certain rare setups. (Z#3251)
*  Deprecates the `viewState` property and `setViewState:animated:` method on `PSPDFViewController` in favor of two new instance methods: `captureCurrentViewState` and `applyViewState:animateIfPossible:`, which are more explicit about how to use them and what to expect when doing so.

### 5.2.1 - 26 Feb 2016

*  `PSPDFLibrary` now allows setting a custom tokenizer. (#5443)
*  Improved search results for `PSPDFLibraryMatchExactPhrasesOnlyKey` and `PSPDFLibraryMatchExactWordsOnlyKey`. (#5443)
*  Images that are too large for menu items are now automatically resized to fit. (#5586)
*  Scrolling to a search result now tries to center the result on the page, instead of just making it visible. (#5542)
*  Be more selective about what annotation manager states we need to commit before a save event. (Z#3006)
*  Sound annotation control buttons now have a larger hit target. (Z#2984)
*  The new property `originalFile` on `PSPDFDocument` allows you to specify a source file if the PDF is the result of a conversion, so for actions such as Open In or Send via Email the original file can be selected. (#5531)
*  Empty input is now accepted on form fields with number formatting. (#4934)
*  Adds support for animated GIFs that have a variable frame rate. (#893)
*  Fixes an issue where zooming to a rect misses the target when the view controller is set to continuous vertical scrolling. (#5509)
*  Fixes an issue where plugin classes were not correctly detected, if they inherited from a `PSPDFPlugin` adopting class. (#5592)
*  Fixes an issue where setting the page could fail when set within `viewDidAppear:` for page curl mode on landscape. (#5535)

### 5.2.0 - 15 Feb 2016

_See the [announcement post](https://pspdfkit.com/blog/2016/pspdfkit-ios-5-2/)._

*  The SDK is now only requires app-extension-safe API and automatically detects if in extension mode. (#2954)
*  Text and annotation selection now use `tintColor`, enabling easier theming by inheriting color from superviews. Selection color can be customized individually by setting `tintColor` on `PSPDFTextSelectionView`, `PSPDFSelectionView` and `PSPDFResizableView`.
*  The annotation selection knobs have been redesigned so they are more easily visible on various backgrounds. (#5139)
*  The framework now shows guides while drawing ovals and rectangles, making it easier to draw circles and squares. (#5376)
*  Color presets can now be reset back to their default value by long pressing on the preset button. (#2891)
*  `PSPDFProcessor` now ignores annotations that aren't in the specified page ranges. (Z#2873)
*  Simply reselecting an annotation will no longer generate a change notification for the bounding box. (#5444)
*  Improves object selection prioritization to objects that are not yet saved. This improves the experience when creating new annotations. (#5305)
*  Improves settings controller bridge of the Adonit Stylus SDK. (Z#2960)
*  Improves shape stability during drawing on certain modern devices. (#5429)
*  Improves logic when saving is invoked while a undo change notification is processed. (#5451)
*  Improves the snap to aspect ratio behavior during resizing. (#5161)
*  Fixes an issue where executing JavaScript could result in retaining parts of the model longer than necessary. (#5470)
*  Fixes an issue where the inline search incorrectly highlighted search terms on rotated documents. (#5402)
*  Fixes minor color selection inconsistency on the color picker. (#5268)
*  Fixes minor inconsistencies regarding the sequence of `PSPDFAnnotationStyleViewControllerDelegate` calls. (#5380)
*  Fixes memory issues on the annotation inspector. (#5399)
*  Fixes an issue related to `PSPDFThumbnailBarModeScrubberBar` and a particular unusual use of the tabbed controller. (#2873)
*  Fixes an issue related to zooming while night-mode is enabled. (#5410)
*  Fixes an iOS 8 code signing issue in `strip-framework.sh`. (Z#2903)
*  Fixes an issue when a document that is not part of the tab bar is removed from the tab bar programmatically. (#5452)

### 5.1.5 - 1 Feb 2016

*  The color name part of the menu identifier item is no longer localized. (Z#2916)
*  Fixes an issue where a signature couldn't be validated if no `PSPDFSigner` was configured. (Z#2911)
*  Fixes an issue where a subscription license would stop working once expired. (#5327)

### 5.1.4 - 28 Jan 2016

*  Smaller binary size. See https://pspdfkit.com/guides/ios/current/faq/framework-size/ and the bitcode section for more details. (#5225)
*  Improves performance and reliability of full-text search previews. (#5172, #5211)
*  Pasting annotations will now set a new UUID on the `name` field. (Z#2854)
*  The text parser now filters text outside of page bounds.
*  Sepia and night mode can now be properly disabled. (#5263)
*  Better handling of extremely large images that exceed the device capabilities to decompress. (#5243)
*  Fixes a few rendering edge cases. (#5227)

### 5.1.3 - 22 Jan 2016

*  Various internal optimizations to improve performance and decrease binary file size. (#5157)
*  Improves note annotation positioning in certain cases. (#3685)
*  Improves memory usage on using external TTC fonts in a PDF. (#5197)
*  Searching a document with annotations now works more reliably and correct, especially in regards to special characters like `.`. (#5143)
*  The ink eraser now sends out change notifications when existing ink annotations are modified (`PSPDFAnnotationChangedNotification`). (#5170)
*  JavaScript format actions are now triggered when a signature is created on a form signature element. (#5184)
*  A long-press no longer calls `pdfViewController:didTapOnAnnotation:...` - only a regular tap does. (Z#2844)
*  After saving an annotation, the controller now automatically scrolls to the bottom. (#643)
*  When using `PSPDFPageTransitionScrollContinuous`, the view states that can be obtained from `PSPDFViewController` will now contain a viewport even when fully zoomed out. This preserves the scrolling position during rotation and makes it easier for you to capture and subsequently restore the exact reader’s location in a document. (#5052)
*  Fixes a potential race condition when rendering pages and calling methods from `PSPDFProcessor` at the same time while using a data provider. (Z#2768)
*  Fixes an rare issue when invalid points are sent via `touchesMoved:` to our draw view. (Z#2780)
*  Fixes an issue where the text alignment was not correctly preserved when serializing to JSON. (#5138)

### 5.1.2 - 15 Jan 2016

*  We improved page layout and HUD handling in various configuration modes and fixed a number of subtle issues that were found in some less common combinations. (#3689, #3229, #5043, #5063)
*  `strip-framework.sh` now also copies debug symbols. This works around an issue with the `COPY_PHASE_STRIP` build setting set to `YES` and using a "Copy Files" build phase to copy debug symbols. See step 3) of [Integrating PSPDFKit - Dynamic Framework](https://pspdfkit.com/guides/ios/5.1/getting-started/integrating-pspdfkit/#toc_dynamic-framework) for updated integration instructions.
*  Improved reliability of `PSPDFProcessorStripEmptyPagesKey` and eliminated need for `PSPDFWhitespaceTrimmerPerformRenderComparison` option.
*  Fixes an issue where the view state restoration page boundary check was insufficient in certain cases. (#5018)
*  Various PDF rendering correctness and performance updates. (#5024)
*  Remove deprecated method `PSPDFSetLicenseKey` for setting the license key. Use `+[PSPDFKit setLicenseKey:]` instead.
*  Images from stamp annotations are now included in JSON via a base64-encoded PNG. (#5060)
*  Improved performance of the PDF renderer and further improves compatibility with non-standard documents. (#5025)
*  The PSPDFKit singleton now offers a hook to register your own logging handler - see the `logHandler` property.(#5093)
*  The `ExtraVerbose` logging level is now `Verbose` and `Verbose` is now `Debug`. (#5093)
*  The `pdfViewController:didEndPageDragging:willDecelerate:withVelocity:targetContentOffset:` delegate now also reports changes to `pagedScrollView` in paged mode. (#4924)
*  The `pdfViewController:shouldScrollToPage:` delegate is no longer called during `reloadData`. This was unexpected and could cause issues if `NO` was returned in this specific case. (#4923)
*  Reduces memory pressure for the disk cache when using the SDK in combination with Appcelerator Titanium. (#5133)
*  Fixes for highlight annotation selecting too much text at the end of a paragraph. (#5053)
*  Fixes an issue when using the `PSPDFLibrary` with an empty search string. (#5058)
*  Fixes an issue where importing annotation JSON could restore actions to a different type. (#5060)
*  Fixes an issue where white lines appeared in a document. (#5095, #5026)
*  Fixes an issue when parsing certain documents with embedded forms that contain JavaScript. (#5077)
*  Fixes an issue about returning the wrong UID in the results of the `PSPDFLibrary`. (#5082)
*  Fixes an issue where importing annotation JSON could restore actions to a different type. (5060)
*  Fixes an issue with flattening annotations and the text not showing up. (#5109)
*  Fixes an issue where a change notification for an annotation could be sent before it was added to the document. (#5098)
*  Fixes view controller setup and adaptivity issues with the split screen example. (#4766)
*  Fixes an issue where a change notification for an annotation could be sent before it was added to the document.
   This didn't cause any bugs but might affected 3rd-party annotation provider implementations. (#5098)
*  Fixes an issue where the color picker might show an incorrect color when first being presented. (#5142)

### 5.1.1 - 21 Dec 2015

*  Various blocks have been declared with `@noescape` for even better Swift compatibility. (#4996)
*  API: Hide properties for visibility of document and page label on `PSPDFHUDView`, as they need to be controlled in `PSPDFConfiguration`. (#4989)
*  API: The `shouldAutomaticallyAdjustScrollViewInsets` configuration option has been extended with an additional mode and renamed to `scrollViewInsetAdjustment`. (#4461)
*  Improved rendering quality for small pages (thumbnails). (#4478)
*  Improved support for longer messages in `PSPDFStatusHUD`. (#4990)
*  Works around a compatibility problem with RubyMotion.
*  Fixes an issue where the `pageLabelEnabled` configuration could be ignored in some cases. (#4989)
*  Fixes an issue where the image stamp content could disappear after moving or resizing the annotation. (#4984)
*  Fixes a potential crash when extracting file streams from file annotations. (#4978)
*  Fixes an issue where subclasses of `PSPDFBookmark` were not used in all cases.
*  Fixes a small issue where `scrollToPage:document:animated` in the thumbnail controller advertised `document` as nullable but was declared as nonnull.
*  Fixes potential page layout issues in vertical paged mode with fit to width enabled. (#4765)
*  Fixes an issue where a certain font could be mapped to a different one on device, causing slightly offset rendering. (#4968)

### 5.1.0 - 16 Dec 2015

_See the [announcement post](https://pspdfkit.com/blog/2015/pspdfkit-ios-5-1/)._

PSPDFKit 5.1 focusses on improving the drawing experience, easier integration, better iOS 9 adaptivity and features a greatly improved night mode.

*  PSPDFKit is now compiled and requires Xcode 7.2.
*  We streamlined our manual integration process - take a look at our [new integration guide](https://pspdfkit.com/guides/ios/current/getting-started/integrating-pspdfkit) for details. We also provide a `v5.0` to `v5.1` integration steps [migration guide](https://pspdfkit.com/guides/ios/current/getting-started/integrating-pspdfkit/#toc_pspdfkit-v5-0-to-v5-1-migration).
    * `PSPDFKit.framework` now includes its app symbols. This enables you to receive symbolicated crash logs from Apple after uploading your app to the App Store.
    * We now also ship SDK symbols to allow better crash identification. (Only available for license holders, see `PSPDFKit.framework.dSYM`).
*  We added pressure sensitivity to drawing and erasing. Natural lines can use pressure data from the Apple Pencil, 3D touch displays and some other supported styluses. The ink eraser radius can be adjusted based on the finger surface area or Apple Pencil altitude angle. (#4070, #1797)
    * Note: We now use a custom data structure to represent annotation points for certain annotation types. If you are accessing `pointArray`, `pointSequences`, `lines` or similar annotation properties, be sure to update your code to use `PSPDFDrawingPoint` from now on.
*  PSPDFKit now comes with a few built in appearance modes, that include an extended night mode. The modes can be set and customized via `PSPDFAppearanceModeManager`. `PSPDFBrightnessViewController` has also been extended with additional UI for this feature. (#3000, #4794)
*  API: Various smaller updates around toggling view controllers in `PSPDFAnnotationStateManager`. (#4642)
*  API: `editableAnnotationTypes` has been moved from `PSPDFDocument` to `PSPDFConfiguration` and is now a simple `NSSet`. (#4642)
*  API: Creating text overlay annotations requires `pageRotation` instead of `rotationTransform` now. (#4748)
*  Bookmarks are now sorted based on page order. This can be controlled via the new `bookmarkSortOrder` property in `PSPDFConfiguration`. (#4503)
*  The annotation toolbar now has a new "Arrow" tool which is a variation of line with a predefined arrow head. (#4479)
*  Manually rotating pages is now possible again. See `PSCRotatePageExample`. (#4715)
*  The document view is now adaptive, even in situations where the keyboard is visible from another app in a multi-tasking environment. (#4714)
*  The document view now correctly adapts to keyboard frame size changes, mostly from 3rd-party keyboards. (#4714)
*  We added new items to the free text annotation `inputAssistantItem`, enabling you to toggle the free text accessory view visibility and adjust the font size even while the free text accessory view is hidden. (#4025)
*  The undo and redo buttons now get compacted into one button when the annotation toolbar space is limited. (#3994)
*  Various classes that should not be subclasses now declare this explicitly to prevent usage mistakes. (#4781)
*  Styluses without touch classification, e.g. Adonit styluses, are now using the eraser correctly. (#4658)
*  PSPDFCatalog samples have been reorganized and a few new ones have been added. See `PSCConfirmDeletionExample`. (#4786)
*  The font picker now uses a custom sorting and moves the most commonly used fonts on top. See `highlightedFontFamilyDescriptors`. (#1100)
*  The stylus selection popover now resizes itself automatically. (#4729)
*  Improves popover resizing for the font picker. (#4554)
*  Improves error reporting in case email is not configured on the device. (#4555)
*  Improves undo registration when using the free text tool. (#4686)
*  Improvements to text-selection and text-extraction on rotated documents. (#4748)
*  The modal search view controller now automatically focusses the search bar to ensure the keyboard is visible.
*  PDF parsing/rendering improvements for older, non-compliant versions. (#4903)
*  Form buttons that are neither choice nor radio button styles are no longer highlighted to match Adobe Acrobat behavior. (#4929)
*  Improves hit testing for small geometric annotations (Square, Circle) (#4937)
*  Reduced memory usage and better low memory handling (#4911)
*  Works around a regression in iOS 9 where section backgrounds on table views could be incorrectly styled. (rdar://23904182, #1100)
*  The annotation toolbar now correctly avoids the tabbed bar during layout. (#4448)
*  Fixes nullability warnings created by certain stylus drivers. (#4670)
*  Fixes an issue with glyph positioning for documents with a non-null origin. (#4657)
*  Fixes an issue where the link annotation editor would not create a correct link annotation under some situations. (#4750)
*  Fixes an issue where certain unicode (emoji) characters in the PDF could be converted into invalid UTF-8. (#4946)
*  Fixes an issue where the annotation inspector could be presented at a slightly smaller size and than jump to the correct size (#4965).
*  Fixes an issue where certain unicode (e.g. emoji) characters in the PDF could be converted into invalid UTF-8. (#4946)
*  Fixes an issue where copy/pasting free text annotations could lead to an issue with rendering until the copy was modified. (#4973)
*  Adds Croatian localization. (#4956)

### 5.0.3 - 20 Nov 2015

*  API: `PSPDFSearchViewController` has a new property to control restoring the last search result: `restoreLastSearchResult`. (Z#2411)
*  Improve text extraction for certain documents which produces too many newlines. (#4409)
*  Adjusted gallery Vimeo video playback for Vimeo API changes. (#4530)
*  Improved performance and accuracy when exporting PDF documents with embed annotations. (#4536)
*  Improves document metadata conversion: The creation and modification date are automatically translated to an NSDate object. (#4617)
*  Stylus buttons can now be mapped to different and even custom actions. (#4588)
*  Hex3 JaJa stylus driver is no longer available. (#4616)
*  Fixes an issue where the appearance stream of digital signatures could have a wrong object number. (#4462)
*  Fixes an issue in iOS 9 where sound annotation views didn't correctly clean up their OpenGL session. (#4602)
*  Fixes an issue with rendering incorrect or empty PDF with contents in Chinese. (#4482)
*  Fixes an issue where the ink annotation bounding box could be slightly off when copying the annotation or re-reading it from the PDF. (#4609, #4613)
*  Fixes an issue where link and highlight annotations were at the wrong location (#4630)
*  Fixes an issue where the `PSPDFRenderDrawBlockKey` key in `renderOptions` was not always evaluated. (#4601)

### 5.0.2 - 10 Nov 2015

PSPDFKit is now compiled with Xcode 7.1.1. (7B1005)

*  API: The `propertiesForAnnotations` setting from `PSPDFAnnotationStyleViewController` has been moved to `PSPDFConfiguration` and it now also affects the free-text accessory view. (#4466)
*  API: Remove `isAESCryptoDataProvider:` helper. Use `[dataProvider isKindOfClass:PSPDFAESCryptoDataProvider.class]` instead to check. (Z#2323)
*  Improves a condition where an ink annotation has a fill color set which overlapped the foreground color. (#3842)
*  The `outline` property of `PSPDFOutlineParser` is now writable to allow setting a custom outline. (#4467)
*  Ensures the HUD is visible when certain HUD actions are invoked. (#4272)
*  Works around a UIKit issue that decreases the scroll view precision, which could have lead to incorrectly centered content. (#3864, rdar://23255528)
*  JavaScript execution can now be disabled on a document-level via the `javaScriptEnabled` property. (#4491)
*  Improves form navigation using keyboard and also with prev/next UI buttons. (#4398, #4427)
*  `didChangeAnnotation:keyPaths:options:` is now called during drawing to allow more fine-grained updates. (Z#2315)
*  Various improvements for the upcoming iPad Pro, including an annotation toolbar configuration set that better utilizes the additional space. (#4519)
*  Updates our stylus drivers to the latest version. (only available for license holders, #4515, #4516)
*  Sharing features that require annotation features are no longer displayed for licenses that don't include annotation features. (Z#2319, #4524)
*  Fixes an issue where line endings were not correctly exported in XFDF if they are set to none. (#3715)
*  Fixes an issue when documents with invalid or missing files are initialized. (#4455)
*  Fixes an issue where a document with > 1000 individual files could use too much memory. (#4455)
*  Fixes an issue where some presented views were missing a close button on iOS 8.2 and earlier. (#4492)
*  Fixes a crash when processing a document with a certain set of JavaScript. (#4483)
*  Fixes an issue where UIKit handled popovers + alert controllers in a way that could cut off the buttons. (#4537)
*  Fixes an issue where the document view was not always correctly reloaded when the `PSPDFViewController` was displayed within a popover. (#4538)
*  Fixes a potential assert on iOS 8 when using the text loupe with text glyphs that have a height of zero. (#4458)
*  Fixes an issue where glyph frames could be incorrectly calculated for documents with a non-null origin and rotation. (#4504, #4047)
*  Fixes an issue with fullscreen media playback. (#4429)
*  Slightly reduced framework size.

### 5.0.1 - 28 Oct 2015

*  Due to a recent change in the iTunes Submission Process we've slightly altered our version scheme. (from ios-5.x.x to just 5.x.x)
*  The content opacity render option (`PSPDFRenderContentOpacityKey`) has been removed. This option is no longer supported. (#4337)
*  Freehand drawing performance improvements and fixes for devices supporting touch prediction. (#4404)
*  In case two page labels are active on a double-paged page, both are now correctly displayed. (#4342)
*  Improves behavior when parsing partly corrupt documents. (Z#2199)
*  The selection knobs now animate when running iOS 9 to better match system behavior.
*  Add workaround for a Swift compiler issue when using `PSPDFAESCryptoDataProvider` with a string-based data provider. (Z#2223, rdar://23285766)
*  Fixes an issue with editable annotation types on the annotation toolbar. (#4407)
*  Improves layout of the thumbnail overview controller.
*  Improves text selection and highlight annotation creation.
*  Improves font picker search bar appearance. (#4100)
*  Various updates to the new render engine.

### 5.0.0 - 23 Oct 2015

_See the [announcement post](https://pspdfkit.com/blog/2015/pspdfkit-ios-5-0/)._

PSPDFKit 5 is a major new version, introducing our own renderer and focusing on improving performance. It requires Xcode 7.1 and is compatible with iOS 8.0 - 9.1. This release is a huge usability improvement with Swift but also Objective-C, as we annotated all headers with generics. This release now shares our new core with our Android SDK to further improve quality and performance.

*  PSPDFKit now uses its own PDF renderer and no longer uses Apple's Core Graphics renderer, which means better performance, stability and quality. (#3737)
*  Undo and redo now remember individual lines drawn instead of the previous behavior where undo removed the whole annotation, once committed. (#2825)
*  The tabbed bar has been completely redesigned and now supports animations and reordering, not to mention it being much prettier. (#665)
*  View controllers are now presented using `UIPresentationController` and are much easier to handle and dismiss. (#3519)
	*  We removed the `popoverController` and `halfModalController` properties, as these are now custom presentation styles.
*  Popovers are no longer dismissed on rotation. (#3519)
*  iOS 8 adaptivity is fully supported: view controllers swap between being popovers, half modal or full screen depending on context. (#3743)
	*  A new presentation option has been added to prevent view controllers from adapting their presentation style: `PSPDFPresentationNonAdaptiveKey`.
*  The default presentation style has changed for `presentViewController:options:animated:sender:completion:` from `PSPDFViewController` and `PSPDFPresentationActions`. The default is now to use the presented view controller’s `modalPresentationStyle`, similar to the old `PSPDFPresentationStyleForceModal` style, which has been removed.
	*  To restore the equivalent of PSPDFKit’s previous default behavior (using either a popover or full screen, depending on the space available), set the presented view controller’s `modalPresentationStyle` to `UIModalPresentationPopover`.
*  The annotation toolbar now automatically adapts its items depending on the available screen real estate. This change comes with a new API that allows setting multiple toolbar configurations amongst which the toolbar picks the optimal layout. (#3950)
*  The free text input accessory view has been updated to show popover pickers whenever possible, with a fallback to the half modal inspector, if vertical space is tight. (#3987)
    * Note: We noticed some input accessory view resizing issues on iPad Air 2 Simulator. We could not reproduce the same problems on actual devices.
*  We’re using `UIAlertController` and `UISearchController` everywhere, replacing the older deprecated API for further view controller unification. (#3381)
*  Automatic double page mode is smarter, comparing the aspect ratios of the view and the document and only showing two pages if they fit without too much shrinking. Automatic mode is now the default on iPhone too, but since two pages are only shown in large views the behavior will be similar.
*  By default, page thumbnails are now sized adaptively to comfortably fill the available space.
*  Instead of `CGPDFDataProvider` we now have a new `PSPDFDataProvider` protocol, which finally allows writing as well. (#3690)
	*  `PSPDFAESCryptoDataProvider` has been updated to allow writing annotations back into the secure storage.
*  Safari view controller is used instead of `PSPDFWebViewController` on iOS 9.
*  `PSPDFScrobbleBar` has been renamed to `PSPDFScrubberBar` to better express its purpose.
*  Querying for the annotation author name has been moved to before the annotation toolbar is displayed. (#3544)
*  Annotation creation can now be prevented on select PDF pages by adding a boolean key to the page dictionary (see `allowAnnotationCreation` on `PSPDFPageInfo`). (#4308)
*  `PSPDFAnnotationStateManager` now supports multiple delegates and the delegate protocol gained some new methods. (#3607)
*  The color menu is now represented visually, and uses the style manager color presets. (#2802, #2890)
*  Switching between regular and callout styles for text annotations now produces better results and has been made easier with a redesigned UI. (#3664 and #3859)
*  The annotation stream now gets properly reset when an annotation is modified, preventing stale content from being rendered on screen. (#3817)
*  `PSPDFDocumentActionExecutor`’s `presentationController` has been renamed to `sourceViewController` to better describe its purpose and avoid confusion with `UIPresentationController`.
*  The `prefersStatusBarHidden` property in the `PSPDFStyleable` protocol has been renamed to `forcesStatusBarHidden` to be distinct from the closely related `UIViewController` method of the same name.
*  It is now possible to show color presents on `PSPDFAnnotationStyleViewController`, even if color and opacity settings are disabled. Color presets can still be hidden by adjusting `typesShowingColorPresets`. (#4108)
*  Accessibility and voice over support has been improved on some of our key UI elements. (#3834)
*  The author username is now requested earlier and managed via the new `PSPDFUsernameHelper` class.
*  The border radius of `PSPDFSearchHighlightView` is now dynamically calculated based on the current zoom level and can be configured via `cornerRadiusProportion`.
*  `PSPDFImageInfo` is now much more reliable and detects more image formats.
*  `PSPDFAction`s `nextAction` is now an array to correctly reflect the PDF spec, and the whole tree is iterated as required upon execution.
*  `PSPDFRenditionAction` now also exposes optional attached javascripts.
*  The hooks for `markedContentStack` and `shouldParseCharacter:` in the `PSPDFTextParser` have been removed since they were very rarely used but caused a noticeable slowdown for all text extraction. If there's demand, we'll look into ways to reintroduce a similar feature with less performance impact.
*  `prefersStatusBarHidden` in `PSPDFStyleable` has been renamed to `forcesStatusBarHidden` to not confuse this with properties that UIKit recently introduced.
*  Several annotation classes have new parent types to unify certain features, such as `PSPDFAssetAnnotation` and `PSPDFAbstractShapeAnnotation`.
*  Small UI updates across the board. (For example, dark colors are easier to see in menus.)
*  Various lesser-used API has been redesigned or removed for better clarity.

### 4.4.18 - 28 Oct 2015

*  Due to a recent change in the iTunes Submission Process we've slightly altered our version scheme. (from ios-4.x.x to just 4.x.x)

### 4.4.17 - 15 Oct 2015

*  Fixes an issue where the first thumbnail in scrollable thumbnail mode could be skipped under iOS 9. (#4270)
*  Removes our LZ4 dependency since Apple sometimes wrongly flagged that as private API. (Z#2097)
   If you're using `PSPDFLibrary` with glyph position saving, make sure to delete the cache files before updating.

### 4.4.16 - 6 Oct 2015

*  Fixes an issue where some documents couldn't be parsed correctly to write annotations back in. (#4182)
*  Fixes an issue where document content was cut off with the toolbar enabled. (#4152)
*  Improves symbol visibility in new dynamic framework. (Z#1966)

### 4.4.15 - 25 Sep 2015

*  Fixes an issue where the `PSPDFDocumentPickerController` wasn't correctly updated when a document was deleted. (Z#1882)
*  Prevents an exception from getting thrown while writing ink annotations into XFDF. (Z#1889)
*  Fixes an issue where executed JavaScript from forms could trigger an assertion. (#3872)

### 4.4.14 - 11 Sep 2015

This release will be one of our last v4 releases, while v5 for iOS 9/8 is steadily nearing completion with a huge list of updates/improvements.
We backported the new bezier path calculation code, so ink annotations are quite a bit faster now. There's a lot more coming soon!

*  When invoking search, we now prioritize the current visible pages before searching the rest. Search results will show up significantly faster on complex documents. (Z#1829)
*  Fixes an issue where resetting choice form elements didn't always reset all properties. (Z#1813)
*  Fixes an issue when applying a `PSPDFRenderFiltersKey` on rotated documents. (#3892)
*  Fixes a rare floating point precision issue that could cause pages to show up distorted. (#3882)
*  Fixes an issue where rotation caused ill–positioned pages when switching from single–page to two–page layout. (#3878)

### 4.4.13 - 28 Aug 2015

*  Improves rendering during annotation selection, decreasing the possibility of stale content. (#3488)
*  Improves behavior for the go to page dialog when invalid numbers are entered. (#3662)
*  Performance improvements for complex bezier path calculation, speeding up ink annotations. (#3778)
*  Fixes a rare exception when the page curl controller is used in unusual view controller configurations. (#3624)
*  Fixes a regression that was affecting performance in continuous scroll mode. (Z#1748)
*  Fixes a potential issue with rendering the color picker. (#3729)
*  Fixes an issue where `PSPDFViewState` could end up being nil for certain points between two pages. (#3782)
*  `-[PSPDFViewController setViewState:animated:]` supports animation for continuous scrolling and per–page scrolling again. Page curl mode has limited support: regardless of animation restoring the viewport is unsupported. (#3777)

### 4.4.12 - 10 Aug 2015

*  Adds Slovenian translation.
*  Improves compatibility exporting file attachment in XFDF with certain less standard compliant readers. (Z#1610)
*  Fixes an issue when exporting XFDF polyline annotations with border style set to cloudy. (#3608)
*  Fixes a regression related to StrikeOut annotations. (Z#1642)
*  Fixes a crash when a file attachment annotation references a missing file which then is exported via XFDF. (#3620)

### 4.4.11 - 31 Jul 2015

*  Adds Czech, Greek and Finnish translations and updates various other localization details.
*  API: The `rotationLock` has been removed. Subclass `PSPDFViewController` and override the rotation methods and/or implement `supportedInterfaceOrientationsForWindow:` to lock rotation. Since PSPDFKit doesn't own the application, yet this requires hooks to your app delegate, the previous implementation was flawed and subsequently removed.
*  Allow rendering the page to larger sizes when aspect ratio is preserved. (#3528)
*  Fixes an issue where links that also have QuadPoints defined might be offset. (#3331)
*  Fixes an issue related to bundle path resolution on relative linked files. (#3539)
*  Fixes an issue where `PSPDFCryptor` would report an error for files with a size that is dividable by 4096. (#3547)
*  Fixes a compatibility issue with the XFDF API version. (Z#1610)
*  Fixes an issue where the annotation toolbar's position couldn't always be set before it was initialized. (#3575)
*  Fixes an issue where the continuous scroll mode could result in a NaN exception under high load in split screen mode. (#3577)
*  Fixes a tiny memory leak when exporting XFDF files.

### 4.4.10 - 24 Jul 2015

*  Improves document parsing for certain documents that are invalid according to the PDF 1.7 specification, yet work with Adobe Acrobat. (Z#1534)
*  Improves text placing logic for callout free text annotations. (#3476)
*  Improves compression for embedded images in stamps if they don't contain alpha data. (#3494)
*  Fixes an issue where the keyboard would not hide in all cases after dismissing the modal search controller. (#3449)
*  Fixes a race condition that could lead to a deadlock when forms are parsed and JavaScript processed concurrently. (Z#1546)
*  Fixes a rare assertion when the scrobble bar bins pages in landscape. (#3504)

### 4.4.9 - 17 Jul 2015

*  Update OpenSSL to 1.0.2d.
*  API: Expose `PSPDFPageScrollViewController` and `PSPDFPagingScrollView`. (Z#1489)
*  Feature: Text selection is smarter on selecting words and better filters out commas or quotation marks. (#1954)
*  Performance: Greatly improved document parsing speed with a large set of annotations that need named destination resolving. (>10.000) (Z#1339)
*  Performance: Improvements for parsing forms on complex documents with more than 1000 pages. (Z#1422)
*  Improves parsing accuracy when page arrays contain invalid entries. (Z#1477)
*  Improves the UI/inspector flow when inserting free text annotations. (#3335)
*  Ensures that the inspector updates in all cases on alpha updates. (#3336)
*  Improves the HUD layout logic when changes are happening while the `PSPDFViewController` is off-screen. (#3361)
*  Improves calculation of the selection border for non-editable note annotations when zoomed in. (#3155)
*  Fixes issues with page centering while zooming. (#3340, #3419)
*  Fixes an issue with XFDF serialization of forms with parent/child relationships. (#3138)

### 4.4.8 - 6 Jul 2015

*  Now using and requires Xcode 6.4 to build.
   Xcode 6.3.2 is unsupported but still works fine - however this might change in future updates. It's always a good idea to use the latest available tools.
*  Various performance improvements when parsing documents with a large amount of complex, nested form elements. (Z#1339)
*  Improves the thumbnail transition when multiple transitions are being executed concurrently. (#3248)
*  `PSPDFModel` can be serialized via `NSCoder` again. (Z#1394)
*  Ensures that highlight annotations don't have a border by default. (#3277)
*  Improves text field formatting to be more consistent with the way Acrobat handles formatting. (#2548)
*  Improves the combination of long press & `PSPDFLinkActionAlertView`. (#3289)
*  Improves `PSPDFHUDViewAnimationSlide` under iOS 8. (#2951)
*  Improves automatic thumbnail size calculation for certain edge cases in iOS 8. (#3045)
*  Decreases memory usage when trying to parse corrupted documents to ensure we are below certain memory limitations. (#3314)
*  Fixes an issue where customizable choice form elements sometimes didn't retain the correct selection. (#2919)
*  Fixes an issue where certain font styles in annotations could be lost when converting documents via `PSPDFProcessor`. (#3147)
*  Fixes an issue where invoking the image picker via javascript immediately dismissed the picker. (#3274)
*  Fixes a potential crash when `autodetectLinkTypes` is enabled and a phone number that is overlaid with custom annotations is detected. (Z#1402)
*  Fixes a potential crash related to a change in `NSDictionary` on iOS 9.0b2.
*  Fixes an issue where the email sheet sometimes is not presented if options are preselected. (#3137)

### 4.4.7 - 24 Jun 2015

WWDC week! We're hard at work to make sure PSPDFKit is a good citizen on iOS 9 and also grilled the UIKit engineers in San Francisco. This release features various first updates for the iOS 9.0b1 and Xcode 7. As usual, our strategy is to keep a stable PSPDFKit 4.4.x that works with SDK 8 (Xcode 6.3.2), supporting iOS 7, 8 and 9 (with some exceptions, like multitasking) - while at the same time we are also working on PSPDFKit 5, made for Xcode 7 and iOS 8+9. Expect PSPDFKit 5 some time in September before the iOS 9 GM.

*  Updates OpenSSL to 1.0.2c. (None of the security updates affects PSPDFKit, but it's a good habit to keep things up-to-date)
*  API: `pathShadowForView:` now returns an `UIBezierPath` object instead of a `CGPathRef` object.
*  API: `showsScrollIndicators` has been split into `showsHorizontalScrollIndicator` and `showsVerticalScrollIndicator` for a more fine-grained control. (#3191)
*  Improve custom font attribute support for outline. (#3111)
*  Exporting XFDF now writes the 'f' file tag. (Z#1335)
*  Serializing documents via `NSKeyedArchiver` now stores relative paths, so that objects can be properly restored even after app updates on iOS 8/9. (#2651)
*  Fixes issues with certain passwords with non-ascii characters and PDF 1.7 files. (#3166)
*  If annotation rendering is disabled, we hide these options from the share menu. (print/mail/open in) (#3202)
*  Text handling for zoomed in pages is now a lot better, thanks to an unnamed UIKit engineer in the labs. (#2763)
*  Ensures that popup annotations don’t get a default border. (#3214)
*  Improves search performance and layout related to UI updating when using the popover/modal view. (#3190, #3212)
*  Improves animation for gesture-based view controller dismissal and the HUD. (#3109)
*  Various performance improvements related to multiple gallery items when zooming/mirroring. (Z#938)
*  Improves child view controller usage detection and `contentInset` calculation for certain edge cases. (#2998)
*  Hiding the annotation toolbar no longer automatically dismisses any visible popover. (Z#1366)
*  Resizing annotation as a set (multiselect) now better handles free text annotations. (#1982)
*  Improves the logic that positions signatures and better deals with edge cases like incorrect PDF coordinates. (#3113)
*  Ensures that upon `PSPDFViewController` dismissal, the HUD is always visible. (#3227)
*  Works around an UIKit bug that causes the backdrop blur to produce incorrect results under certain conditions. (#3162)
*  Works around an UIKit issue related to nested scroll views that could make text view scrolling flaky when zoomed in. (rdar://21180283, #2830)
*  Fixes an issue where cut/copy was enabled for readonly text fields. (#3156)
*  Fixes issues related to printing and popover management. (#3186, #3187)
*  Fixes a few edge cases found with Xcode 7 related to nullability.
*  Fixes a potential null pointer dereference when a document with a corrupt page array is being parsed. (#3235)
*  Various updates to improve compatibility with iOS 9.0b1.

### 4.4.6 - 5 Jun 2015

*  Improves performance with re-building the scrobble bar; noticeable when the frame is changed with animation. (#3007)
*  Adds a workaround for an UIKit issue where `viewWillLayoutSubviews` would not always be sent when the `PSPDFViewController` is set as the `rootViewController` under iOS 8. (#3031)
*  Improves the way we position the document label to cover more corner cases. (#3049)
*  Improves annotation toolbar placement in certain edge cases. (#3044)
*  Improves free text placement when resizing via anchoring to the bottom left. (#2177)
*  If a document contains multiple files, a RemoteGoTo action will be rewritten to a regular GoTo action if the target file is part of the multi-file-document. (Z#1018)
*  Improves the flow when changing the free-text annotation results in a different bounding box. (#2246)
*  Improves thumbnail rendering logic to ensure newly created annotations are always rendered. (#3054)
*  `UIModalPresentationPageSheet` is now used instead of the FormSheet presentations style to work around an issue with the mail controller. (Z#1176, Z#1270)
*  Improves half modal view logic to automatically dismiss a visible controller before a new one is presented. (Z#1271)
*  Fixes an encoding issue with certain chinese characters. (#3100)
*  Improves the HUD/page placement logic for certain edge cases (#3103, Z#1254)
*  Fixes an issue where UIKit could send tap events in the wrong order, resulting in a timer not being invalidated on font size changes. (#3009)
*  Fixes a rare race condition that could result in pages not being rendered in full resolution when a note annotation is selected programmatically. (#2621)
*  Fixes an issue where widget annotation actions could be parsed incorrectly in multi-document setups. (#2803)
*  Fixes a rare mutation issue when selecting a free text annotations while another one is selected in continuous scrolling mode on an iPhone. (Z#1214)
*  Adds a workaround for an issue in Xamarin iOS 8.10 (https://bugzilla.xamarin.com/show_bug.cgi?id=30766)

### 4.4.5 - 31 May 2015

*  Improves annotation border support. Add support for the legacy /Border definition, improves dash array writing and more. (#2953, #2964, #2982, #2987)
*  Improves menu positioning for line annotations, reduce likelihood of menu covering the resize knobs. (#2732)
*  Improves back animation when the thumbnail filter view is visible while the view controller is popped, working around an issue with UIKit's `topLayoutGuide`. (#2948)
*  Resizing of free text annotations with saved appearance streams now triggers a re-render. (#2895)
*  Better handles situations where the `PSPDFViewController` has an empty frame. (#2986)
*  Works around an iOS 7 UIKit issue where the `contentInset` was not always correctly set in the outline view controller. (#2717)
*  Improves error handling around image extraction. (Z#1215)
*  Update simple font picker example and ensures the designated initializer for `PSPDFFontPickerViewController` is always called. (Z#1201)
*  Using `PSPDFProcessor` with the same input and output URL is documented as an unsupported operation. PSPDFKit will now detect this and return an error instead of potentially corrupting the output file. (#2985)
*  Workaround for an UIKit issue where `UIPrintInteractionController` could call into an released object. (rdar://20963891)
*  Files with multiple data sources can now also use the fallback annotation store. (#2804)
*  Fixes a rare crash when using the color picker from the half modal controller. (Z#1220)
*  Fixes an issue where the `UIActivityViewController` would not close automatically under iOS 7. (#2999)
*  Fixes an issue where font styles were not always correctly saved when changed via the popover inspector. (#3004)
*  Fixes an issue where certain line endings were not rendered correctly. (Z#1192)
*  Fixes an issue where re-creating documents via `PSPDFProcessor` with embedded annotations that contain appearance streams could result in incomplete AP streams. (#2985)

### 4.4.4 - 26 May 2015

We're now using Xcode 6.3.2 to build PSPDFKit.

*  Greatly improves view state handling and view port stability, especially when rotating the device. (#2808, #2871, #2873)
*  Improves search bar handling for the outline view controller. (Z#1075)
*  Improves form tab order parsing and better deals with broken PDFs that have cyclic references. (#2903, #2817)
*  Adds a workaround for a tabbar gap issue on the half modal controller. (#2883, rdar://21036145 and rdar://21036226)
*  Improves color preset handling for highlight ink drawings by saving additional metadata into the PDF. (#2726)
*  The HUD no longer hides when page is programmatically changed with pageCurl transition mode. (#2898)
*  The HUD can now be hidden, even when the annotation toolbar is visible. (#2789)
*  `UIModalPresentationPageSheet` is now used instead of the FormSheet presentations style to work around an issue with the mail controller. (Z#1176)
*  Improves color preset detection for annotations that are saved/loaded from the PDF directly. (#2915)
*  No longer creates highlight annotations with empty rects when using the highlight annotation tool without selecting text. (Z#1178)
*  Improves font size calculation in multi-line text fields. (#2921)
*  The `pdfViewController:didSelectAnnotations:onPageView:` delegate is now called after the `annotationSelectionView` has been configured. (Z#1166)
*  The Catalog contains new examples how to lock specific annotations (PSCLockedAnnotationsExample.m) and how to add new pages (PSCAddBlankPageExample.m)
*  Preserves custom protocol strings when unlocking a document with a password and improves documentation around this case. (#2652)
*  Fixes an issue with granting recording rights for sound annotations. (Z#1190)
*  Fixes a race condition when multiple `PSPDFDocument` objects saved to the same external data file. (#2904)
*  Fixes an issue where documents that mix relative and absolute file paths render incomplete on devices. (Z#1177)
*  Fixes an issue where radio button form elements were not always correctly highlighted. (#2833)
*  Fixes an issue with the bottom content inset when the search view controller is displayed modally. (#868)
*  Fixes an issue when the thumbnail animation is cancelled externally. (#2893)

### 4.4.3 - 15 May 2015

We're now using Xcode 6.3.2(gm seed) to build PSPDFKit.

*  API: `PSPDFTextSearch` has a new `cancelOperations:` parameter to control if previous operations should be cancelled.
Since the previous behavior might be unexpected for some, we choose to not have a deprecated call.
*  API: Some refinements on calls in `PSPDFAnnotationStateManager`, removing a redundant "From:" from various methods.
*  Improve compatibility when the `PSPDFViewController` is embedded inside an `UITabBarController` with transparent bottom bar. (#2794)
*  Make sure using setAnnotations: doesn’t trigger registering undo actions. (Z#1092)
*  Ensures the HUD stays visible when pages are changed via HUD controls in page curl mode. (Z#1077)
*  Declares `fieldName` nullable since some PDFs incorrectly don't declare this name. (Z#1097)
*  Improves text view management for free text annotations and forms when zoomed into a page (#2763)
*  Improves integration of the print controller. (Z#1102)
*  Implements writing of PDF actions of type PSPDFActionTypeGoTo. (#2682)
*  Adds a workaround for an issue where UIPrintInteractionController could access a deallocated object. (rdar://20963891, #2828)
*  Improves status description text when search is finished. (#2826)
*  Improves keyboard navigation and handling for forms. (#2818, #2819)
*  Further improvements to zoom/scroll behavior for zoomed in text fields. (#2758)
*  Fixes an issue where `shouldAutomaticallyAdjustScrollViewInsets` in `PSPDFConfiguration` might change to NO for certain configurations. (#2800)
*  Fixes an issue where creating annotations on the right side in double page mode could end up inserting them on the left side instead. (Z#1076)
*  Fixes an issue where annotation background could turn black instead of transparent when the inspector is used. (#2813)

### 4.4.2 - 7 May 2015

*  Improves default placement of annotation toolbar icons for the iPhone 6 Plus. (#1653)
*  Ensures all dangling "special" popovers (like `UIInteractionViewController`) are dismissed before the `PSPDFViewController` is dismissed.  (Z#1022)
*  Improves status bar handling when the annotation toolbar is visible. (#2745)
*  Improves performance in the text parser for certain deep cyclic XObject references. (#2786)
*  Reduces memory usage when parsing deep PDF XObject hierarchies. (#2786)
*  Improves logic that updates the "Clear" button for form fields. (#2815)
*  Various localization updates and corrections.
*  Fixes an issue where a pan gesture recognizer on a split view controller could end up staying disabled. (#2683)
*  Fixes a rounding error on the iPhone 6 Plus that resulted in a non-exact sized HUD overlay. (#2788)
*  Fixes an issue where the HUD could end up in a state that requires two taps to show, if configured in a particular, non-standard way. (#2765)
*  Fixes an regression that resulted in no action when using `PSPDFPKCS12SignerViewController`. (#2774)
*  Fixes an issue where "Bundle" path resolution would resolve to the dynamic framework. (#2767)
*  Fixes an issue with the Open In... feature on iPhone under iOS 8 when options are displayed prior. (Z#1022)
*  Fixes an issue with popovers displaying as form sheets on the iPhone 6 Plus since iOS 8.3.

### 4.4.1 - 1 May 2015

*  API: `logLevel` is now a property on the `PSPDFKit` shared object.
*  Showing the inspector on iPhone now hides optional HUD components for a clearer editing focus.
*  Improves scrolling behavior for text field forms when zoom position is larger than the element itself. (#2677)
*  Fixes a regression that would modify the scroll view port imperfectly when using the inspector on iPhone.
*  Fixes an issue with the embedded version information being blank.

### 4.4.0 - 29 Apr 2015

_See the [announcement post](https://pspdfkit.com/blog/2015/pspdfkit-ios-4-4/)._

PSPDFKit is now fully compatible with iOS 8.3 and requires Xcode 6.3. We've annotated all public headers with the new nullability declarations, which is especially convenient if you use PSPDFKit with Swift.
We also now ship a dynamic framework for iOS 8. This is the better choice if you've already dropped iOS 7.

*  API: `PSPDFDocumentPickerController`'s `numberOfSearchPreviewLines` has been renamed to `maximumNumberOfSearchPreviewLines` to better indicate what it does - we also improved cell height calculation and layout.
*  API: We did a large header audit and removed various headers that should not be required. If you have any issues, contact us at https://pspdfkit.com/support/request.
*  The `PSPDFScrobbleBar` now supports vertical modes. (see `scrobbleBarType = PSPDFScrobbleBarTypeVerticalRight`) (#2613)
*  Introduces UI for line dash styles and enables customization options for these presets. (#2612)
*  Color preset support for additional annotation types. (see `typesShowingColorPresets`) (#2604)
*  Matches the flexible toolbar landscape height to the system bar height on iPhone 6+. (#2629)
*  Color picker: Improves color checkmark display for clear colors. (#2628)
*  Improves cleanup code for `PSPDFDrawView` to make it easier to use as standalone class. (Z#747)
*  Ensures no PDF rect box is larger than the media box. (Z#792)
*  When using the tabbed view controller, the back/forward stack is cleared when switching documents. (#2615)
*  Using hide actions to trigger annotation visibility no longer marks the annotation as dirty. (#2637)
*  Adds a new `addBookmark:` method to add a custom named bookmark object next to `addBookmarkForPage:`. (#2577)
*  Works around a potential 3rd-party compatibility issue with the AirWatch SDK. (Z#872)
*  Adds support for transparent line end fills (#2690)
*  Improves the activity title for the bookmark action. (#2718)
*  Various accessibility improvements around the annotation inspector. (#2668)
*  Improves thumbnail <-> page view animation when triggered while the animation is already running. (#2699)
*  The page/document label views and the back/forward buttons now have a `blurEffectStyle` property to customize this via UIAppearance. (#2707)
*  Ensures that, while using the inline search bar, the text field keeps focus when selecting form elements. (#2734)
*  Exposes a `PSPDFCollectionReusableFilterViewCenterPriority` to make it easier to customize the segmented control filter via AutoLayout. (#2714)
*  Undo/Redo is now enabled by default on iPad 2. (Z#957)
*  Fixes an issue where a view controller was not dismissed correctly on iPhone when a UISearchController was displayed on top. (#2729)
*  Fixes a potential race condition in combination with custom annotation providers. (#2708)
*  Fixes an issue where computed form fields could stop working after a save. (#2676)
*  Fixes an issue where sometimes lines could disappear while drawing really fast due to issues with touch handling on iOS. (#2703)
*  Fixes an issue when showing the outline controller via a document activity (#2700)
*  Fixes an issue when pressing undo while editing free text annotations. (#2660)
*  Fixes an issue where after manually invoked saving the undo button state wasn't always correctly updated. (#2644)
*  Fixes an issue when the `PSPDFThumbnailBar` was used in a certain configuration without a document set. (#2638)
*  Fixes an issue where lines created programmatically with `lineWidth = 1.f` didn't always trigger bounding box calculation. (#2620)
*  Fixes an issue when a JavaScript action is invoked on a field which has an invalid/missing fileName. (Z#970)
*  Fixes a configuration issue where a popover would not be anchored to a bar button item in some cases on iOS 8. (#2611)
*  Fixes a potential crash when flattening documents in low-memory situations. (Z#784)

### 4.3.5 - 28 Mar 2015

*  Update nullability declarations to more classes and changed syntax to be compatible with Xcode 6.3 Beta 4.
*  Improves status bar handling in iOS 8 when search is invoked in landscape mode on iPhone. (#2531)
*  Link preview popovers are now correctly placed in double-page-mode. (Z#742)
*  Hide actions now reset invisible and noview flags to match Adobe Acrobat’s behavior, next to toggling the hide flag. (#2588)
*  Adds various safeguards for class overriding to detect API usage issues early. (#2553)
*  Adds a workaround for a memory retainment regression based on rdar://20272376. (Z#722)
*  Adds a workaround for an issue where rotation sometimes stopped working on iPhone under iOS 7 when using activities. (#2578)
*  Improves handling of erasing annotations that are manually set to overlay = YES. (#2582)
*  Improves picker placement when a picture is added via iPad on iOS 8. (Z#775)
*  Fixes an issue where under certain conditions using bookmarks would not switch the page on iPhone. (#2589)
*  Fixes an issue when an outline entry doesn't define any action element and then is tapped.  (Z#776)

### 4.3.4 - 23 Mar 2015

*  Update to OpenSSL 1.0.2a.
*  Adds a second invert color mode that creates color correct images. (#2128)
*  The document sharing view controller has a new delegate method for custom status reporting. (Z#684)
*  When using search and highlighting, we automatically scroll to the page area where the result is highlighted. (#2209)
*  Further classes gained nullability declarations.
*  Improvements for Russian localization. (#2550)
*  Improves rendering for annotations when they are in selected state.
*  Improves hit testing for ink annotations when `minDiameter` is set. (#2570)
*  Works around an issue where custom stamps sometime would not serialize the image because of a NSCoding-related bug in UIKit. (rdar://20256585, #2539)
*  Fixes an issue where `setPage:` would jump to an incorrect page in certain rare configuration combinations. (#2547)
*  Fixes a rare crash where UIKit was expecting accessibility categories on a proxy object. (Z#689)
*  Fixes an issue where using additional actions in annotations didn't always execute such action.
*  Fixes an issue where the outline view controller was not in all cases overridable.
*  Fixes a regression where the scrollable thumbnail bar was not always correctly hidden when switching to the thumbnail controller. (#707)

### 4.3.3 - 15 Mar 2015

*  Various performance improvements, especially for cases where multiple `PSPDFViewController` instances are on screen at the same time. (#2527)
*  Hit testing for line annotations is now purely path-based, which makes working with lines a lot simpler.  (#2481)
*  The default username alert now disables the save button when there is no text entered.
*  Fixes an issue where editing checkboxes could set other checkboxes from the group disabled in 3rd-party readers. (#2514)
*  Fixes an regression where modal presentation would not always invoke save. (#2523)

### 4.3.2 - 12 Mar 2015

*  Security: `allowCopying` on `PSPDFDocument` is now readonly.
*  Adjusts selection to whole words only if needed. (#2505)
*  Dashed lines now correctly render the dash line pattern while they are being selected. (#2480)
*  Ensures that annotations saved to an external file are also marked as saved in the `isDirty` flag. (#2408)
*  Fixes a regression that could prevent documents from being set if the `PSPDFViewControllerDelegate` method isn't implemented.
*  Fixes a race condition on old iOS devices related to image resizing in the cache. This also removes `allowImageResize` in `PSPDFCache`. (Z#625)

### 4.3.1 - 10 Mar 2015

*  Updated for Xcode 6.2 and iOS 8.2.
*  Annotate further class headers for nullability.
*  Fixes an issue that could cause an invalid memory access on certain malformed PDF documents (Z#608)
*  Fixes an issue where custom `UIActivity` subclasses couldn't be set in `PSPDFConfiguration`. (Z#562)
*  Fixed an out of bounds exception in cases where the entire annotation group is filtered out due to editable annotation types. (#2485)

### 4.3.0 - 6 Mar 2015

_See the [announcement post](https://pspdfkit.com/blog/2015/pspdfkit-ios-4-3/)._

In PSPDFKit 4.3 we focussed on improving our headers with additional documentation and nullability declarations and added many detail improvements touching all parts of the framework. On the feature side, we added a new global back/forward list that greatly improves navigation, especially for large documents.  It is a highly recommended update.

*  We've started to annotate classes with Xcode 6.3's new `nullable` attributes, for better interoperability with Swift and more compile-time warnings in ObjC.
   This is still a work-in-progress and the API might change, as Xcode 6.3 is still in beta, however we also see it as a great improvement to documentation.
*  With `PSPDFBackForwardActionList` there is now a view controller-global back/forward list that allows a more efficient navigation in PDFs. (#744)
*  Examples: We added a separate Swift example for Swift 1.2 which is included in Xcode 6.3b2.
*  `PSPDFGalleryConfiguration` now includes a `allowPlayingMultipleInstances` property to control playback of multiple audio/video files at once. (#2386)
*  The play button in the gallery `PSPDFMediaPlayerCoverView` can now be customized via UIAppearance. (#2411)
*  The gallery now uses appearance stream images from Screen/RichMedia annotations if set. (#2400)
*  The `coverImage` parameter for multimedia elements now resolves URLs with custom blocks. (#2409)
*  When a video is presented on an external screen, fullscreen is disabled for the gallery item. (#2390)
*  Automatically set background to clear for certain gallery types. #(2381)
*  Improves the way the gallery handles looping; disables looping for <= 2 items. (#939, #2319)
*  Improvements to `PSPDFViewState` to allow a more accurate state restoration (#101).
*  Documents with an invalid internal structure that can't be correctly rendered no longer throw an exception. (#2294)
*  Custom stamp annotations no longer enforce the all-caps rule. (Z#453)
*  While the inline search bar is visible, the HUD visibility can no longer be changed. (#2341)
*  File names can now be customized via subclassing `PSPDFMailCoordinator`. See PSPDFCatalog for an example. (#2416)
*  If Widget is not in `editableAnnotationTypes`, don’t make a form editable. (#2431)
*  Using the `autodetectTextLinkTypes` data detectors is now much faster for most documents.
*  Action objects in many cases now offer an improved description. (#2465)
*  Adds support for right/center-aligned text field form elements. (#2473)
*  The `PSPDFAnnotationTableViewController` now changes pages via an implicit created `PSPDFGoToAction` so it's easy interceptable. (#2463)
*  `PSPDFWebViewController` now lazily creates the bar button items, so they can be accessed before the view is loaded. (#2467)
*  Improved the render status indicator to act like a table header, staying visible during zooming. (#2334)
*  Improves scrolling in continuous scroll so that a single page doesn't scroll out of the centered area when manually calling `setPage:`. (#2295)
*  Improves logic where to place the HUD, to make sure it doesn't overlap with the document. (#2353)
*  Improves HUD handling for edge cases where the navigation bar doesn't match up with the status bar. (#2455)
*  Improves keyboard handling for `PSPDFNoteAnnotationViewController` when using delete and for rotation events. (#2365)
*  Improves text extraction engine to deal with more cases of unusual XObject placement. (#2254)
*  Improves view controller animations when page curl mode is enabled. (#2336)
*  Improves the signing process and compatibility with Adobe Acrobat when a document is signed multiple times. (#2055)
*  Improves Form JavaScript validation error message handling. (#2442)
*  Improves text parsing speed, especially for documents with deep XObject hierarchies. (#2399)
*  Works around an UIKit regression in iOS 8 where rotation callbacks could be send twice when embedded in a split view controller. (rdar://problem/19810773)
*  API: We moved several class methods/initializers that should not be called by users into private headers to simplify the exposed API.
*  Fixes an issue where checkboxes end up not editable after saving. (#2451)
*  Fixes an issue where the `PSPDFBookmarkActivity` did not always correctly update the bookmark status. (#2327)
*  Fixes a potential assertion while building the page info cache if `pageRange` was modified right after triggering caching. (#2424)
*  Fixes an issue where the scrobble bar sometimes didn't correctly re-bin. (#2425)
*  Fixes an issue where the `applicationActivities` setting was ignored. (#2401)
*  Fixes a regression related to printing. (#2404)
*  Fixes a regression where changing points in a line annotation would not properly capture state when performing undo. (#2378)
*  Fixes an issue where pushing `PSPDFViewController` onto navigation stack could show the 'X' button instead of the native back one. #(2367)
*  Fixes an issue where the scrollable thumbnail bar would sometimes not re-appear after hiding the HUD. (#2361)
*  Fixes an issue where non-committed annotations don't get resized/moved correctly when frame changes. (#2068)
*  Fixes a regression in iOS 8 that could cause the render-thread to freeze for certain documents. (Z#452, rdar://problem/19865091)
*  Fixes an issue where setting `showColorAndIconOptions` late in `PSPDFNoteAnnotationViewController` could be ignored under iOS 7.
*  Fixes an issue where a checkbox did not toggle like a radio button when configured that way. (#2227)
*  Fixes an issue where the item toolbar button is not correctly positioned in landscape. (#2322)
*  Fixes a potential nullpointer dereference when using the gallery and multiple `PSPDFViewController` instances. (Z#261)

### 4.2.2 - 11 Feb 2015

*  Improves binning behavior in the scrobble bar for large documents.
*  Fixes an issue where the `PSPDFViewController` could be leaked when view controller containment was called with an incomplete call order.
*  Fixes a timing-related issue where searching via selected text could leave search results not highlighted initially.
*  Fixes an issue where embedded files were not always correctly previewed.
*  Fixes an issue related to document sharing.

### 4.2.1 - 10 Feb 2015

*  Improves the way we store search text in `PSPDFDocumentPickerController`.
*  Improves tiling for the continuous scrolling mode.
*  Improves writing custom appearance streams for form fields when the value is encoded as UTF-16BE.
*  Improves the animation when adding/removing highlight annotations.
*  Improves audio session management; the code is now smarter when switching sessions is required to minimize background music stops.
*  Improves HUD showing/hiding logic when `scrollMode` is set to page curl.
*  Improves selection behavior for callout free text annotations.
*  API: Changes the options settings in `PSPDFDocumentInfoCoordinator` to strings to make them simpler to customize.
*  Fixes an issue that could cause some thumbnails to not load in the scrobble bar until the view was rotated under certain rare conditions.
*  Fixes an issue with missing symbols in the OpenSSL-free build.
*  Fixes an issue where some URL actions would not open the inline browser.
*  Fixes an issue where the `UIMenuController` would ignore taps when the menu was displayed and then `reloadData` called manually.
*  Works around an issue where the framework could trigger `objc_trap()` in rare occasions. (rdar://problem/19029811)

### 4.2.0 - 5 Feb 2015

_See the [announcement post](https://pspdfkit.com/blog/2015/pspdfkit-ios-4-2/)._

We're proud to release [PSPDFKit 4.2](/blog/2015/pspdfkit-ios-4-2/), which is the result of more than 2 months of hard work. Highlights are the new text editing toolbars, support for secure libraries via SQLCipher and a resizable inspector on iPhone. The gallery learned how to deal with web content and we now use the modern `WKWebView` internally whenever possible and is a lot faster for pages with many multimedia views.

*  Greatly improved handling for free text annotations with a new editing toolbar for both iPhone and iPad.
*  The half modal inspector on iPhone is now resizable and automatically adapts to the required content size.
*  Adds support for SQLCipher to have optionally encrypted search indexes with `PSPDFLibrary`.
*  The gallery can now deal with web content, replacing the `PSPDFWebAnnotationView`.
*  The gallery subsystem is now a lot more efficient, especially noticeable in cases where pages have > 10 different video/audio views (minor API changes due to the performance improvements)
*  `PSPDFWebViewController` now uses `WKWebView` by default, increasing browsing performance and scrolling speed.
*  The completion block for popover dismissal is now invoked after the popover is completely dismissed when animated is set to YES.
*  Security: Password protected documents now automatically disable the disk cache.
*  Natural drawings can now be exported/imported via XFDF.
*  Various improvements to annotation resizing.
*  Text field form elements that are configured as multi-line elements with auto-sized font are now better handled.
*  The Edit/Clear All buttons in the `PSPDFAnnotationTableViewController` are now hidden if there are no types set in `editableAnnotationTypes.
*  Sound annotations are now paused when the page is changed.
*  Sound annotations are now rendered into the thumbnail view.
*  The animation to toggle between thumbnails and the full page view now smoothly fades content and no longer blocks the UI while animating.
*  Performance improvements for documents with complex or deep form annotation trees.
*  Improves search preview to deal with content that has many newlines.
*  The editor for choice form fields no longer shows the form element title.
*  The `PSPDFOutlineViewController` now better deals with long page labels and will correctly calculate the height to show them completely.
*  Adds XFDF serialization/deserialization support for `PSPDFEmbeddedGoToAction`.
*  Updates the JotTouchSDK driver to 2.6.4 and fixes an issue with flipped touch points.
*  Ignore annotation types in the long tap menu that are set in `createAnnotationMenuGroups` but are not set in `editableAnnotationTypes`.
*  Various improvements and enhanced support for JavaScript actions and events.
*  Improves "Sign" arrow rendering for very small form elements.
*  Improves scrobble bar touch handling for certain cases when in double page mode.
*  Various cleanups and modernization for the `PSPDFCache` subsystem.
*  Rotating while drawing now correctly animates unsaved shapes as well.
*  Improved behavior of the "sticky header" thumbnail layout mode and greatly improves performance for large documents.
*  Closing a tab in `PSPDFTabbedViewController` now autosaves the document. (if the autosave configuration is enabled)
*  Exposes a new `updateAnnotationSelectionView` subclassing hook in PSPDFPageView to customize the innerEdgeInsets of the annotation selection view.
*  Various improvements in how the HUD handles the showing/hiding animation of the `UINavigationBar`.
*  Images embedded in PDFs now have a slightly higher default JPG compression to reduce file size.
*  Selecting stamp annotations now requires less memory and is more performant, especially on high zoom scales.
*  API: All `PSPDFBarButtonItem` classes have been replaced by plain bar buttons. There is a new `PSPDFDocumentActionExecutor` and various coordinators (e.g. `PSPDFMailCoordinator`) which better replace this functionality + allow you to call such actions without a `PSPDFViewController` around. Settings (`applicationActivities`, `printSharingOptions`, ...) have been moved to `PSPDFConfiguration`.
*  API: Removed `PSPDFMinimumSearchLength`. The default is now always one character to provide instant feedback and better support CJK languages.
*  API: `PSPDFHUDView` now exposes new insets for child views: `pageLabelInsets`, `documentLabelInsets`, `thumbnailBarInsets` and `scrobbleBarInsets`.
   This supersedes and replaces the more inflexible `pageLabelDistance` and `documentLabelDistance`.
*  API: Renamed `PSPDFSecurityAuditor` to `PSPDFApplicationPolicy`.
*  API: Moves `centerRenderStatusView` from `PSPDFPageView` to `renderStatusViewPosition` in `PSPDFConfiguration`.
*  API: `PSPDFFormSubmissionDelegate` now returns the `PSPDFFormSubmissionController` as first parameter instead of the PSPDFViewController.
*  API: `PSPDFThumbnailViewFilter` has been changed from an enum to strings, to make it both simpler to configure and easier to extend with custom filters.
*  API: `PSPDFThumbnailViewController` has been modernized; properties have been moved to either `PSPDFConfiguration` or simply edit the layout directly.
*  API: Exposes various new subclassing hooks.
*  Works around an UIKit issue where accessing `popoverPresentationController` could lead to a retain cycle. (rdar://problem/19167124)
*  Works around an UIKit regression in iOS 8 related to the status bar and presenting UIImagePickerController in a popover. (rdar://problem/19079532)
*  Works around an UIKit regression in iOS 8 where `preferredInterfaceOrientationForPresentation` was not honored under certain conditions. (rdar://problem/19096083)
*  Works around an UIKit regression in iOS 8 where the autocorrect selection didn't properly update when scrolling (rdar://problem/19564341)
*  Works around an UIKit regression in iOS 8 where a particular combination of popovers and table view cells could lead to a layout loop (rdar://problem/19556505)
*  Works around an UIKit regression in iOS 8 where setting `preferredContentSize` doesn't always correctly update the size if `navigationBarHidden` changes. (rdar://problem/19175472)
*  Works around an UIKit regression in iOS 8 where rotation settings are not always recognized with multiple windows. (rdar://problem/19592583)
*  Works around an UIKit issue related to non-integral contentInset that led to gesture recognizer failures on the iPhone 6+.
*  Fixes a potential race condition when creating annotations that could lead to an object over-release in custom annotation providers.
*  Fixes an issue where inline search would find text within a note and open the popover, but not close it when jumping to the next result.
*  Fixes an issue where search highlights sometimes did not animate correctly in iOS 8.
*  Fixes an issue where the (annotation) menu was not displayed when a popover was visible in iOS 8.
*  Fixes an issue where calling search with a nil string would cause an exception.
*  Fixes an issue related to overriding `firstObject` via a category and our detection/repair attempt. This now works when symbols are stripped as well.
*  Fixes an issue where a malformed PDF date string could cause an assertion while parsing.
*  Fixes an issue where `shadowOpacity` in `PSPDFConfiguration` could be ignored in some cases.
*  Fixes an issue where parsing extended text style attributes didn't work with font names with spaces.
*  Fixes an issue that prevented entering Japanese or using the auto correct feature within the free text annotation text view.
*  Fixes a rare issue that could save sound annotations in a way not compatible with Adobe Acrobat.
*  Fixes an issue where choosing erase mode, then switching pages could result in a different draw color than what was selected.
*  Fixes an issue where the first digital signature was rendered invalid by Adobe Acrobat when the document was signed a second time.

### 4.1.2 - 23 Nov 2014

*  Improves performance for documents with a large number of annotations by moving more work to background threads.
*  Introduces a new `textSelectionMode` and an optional `textSelectionShouldSnapToWords` to better customize the text selection behavior.
*  Improves various edge cases on type image preview in the annotation view controller.
*  Exposes the stylus manager in the `PSPDFKit` shared object.
*  Hook up all significant places that access network for the new `PSPDFNetworkActivityIndicatorManager`.
*  Improves drawing view transform handling for certain edge cases.
*  Improves zooming performance when annotations are selected.
*  Various improvements to the natural drawing path generation and bounding box algorithm.
*  Improves the animation when the view controller is popped but the annotation toolbar is still visible.
*  Improves tab bar placement in `PSPDFTabbedViewController` when the navigation bar has a custom image set via UIAppearance.
*  Works around a runtime issue when using weakly referenced objects during dealloc. (rdar://problem/19029811)
*  Works around an UIKit issue with presenting an `UIAlertController` while a popover is dismissed. (rdar://problem/19045528)
*  Works around an UIKit regression where `automaticallyAdjustsScrollViewInsets` doesn’t always work on iOS 8. (rdar://problem/19053416)
*  Works around an UIKit regression where dismissing a popover with a double-tap could also dismiss the modal parent on iOS 8. (rdar://problem/19067761)
*  Fixes an edge case where the gallery could display wrong content during paging.
*  Fixes an issue with changing choice form elements values on iPhone.
*  Fixes an issue where indexing single-page documents could have reported an invalid status.
*  Fixes an issue where changing the filter on the thumbnails with sticky header enabled would not reset the view port on iOS 8.
*  Fixes an issue where a selected annotation could end up slightly blurry when zoomed in due to an incorrectly set contentScale.
*  Fixes an issue where annotations loaded from XFDF could trigger an assertion.

### 4.1.1 - 11 Nov 2014

*  API: Removes `PSPDFAlertView` and `PSPDFActionSheet`. If you used them, get a local copy here: https://github.com/steipete/PSAlertView
   We're now using a new wrapper to unify these and UIAlertController, and also made it open source! https://github.com/steipete/PSTAlertController
*  API: Various smaller updates and refinements, including a new network activity manager.
*  Improves ink signature handling and saving, especially when natural drawing is enabled or pages are rotated.
*  Improves bundle image loading code to better deal with situations where the bundle is in unusual places; improves compatibility with Extensions.
*  The `loop` setting in the gallery is now also propagated if the gallery is already loaded.
*  Annotations and Form Elements can now be found and read using UIAccessibility.
*  Better detection for invalid 3rd-party code that overrides Apple methods with different behavior.
*  Improves aspect ratio correct resizing when an additional margin for annotations is configured.
*  Slightly updates the note icons to better match with the rest of the annotation icon set.
*  Signatures in the keychain store now are strongly validated and empty signatures are thrown away on load.
*  Works around an UIKit regression in iOS 8.1 where a new window incorrectly rotated. This affected the fullscreen view of the gallery. (rdar://problem/18906964)
*  Works around an UIKit bug where an action sheet would not show up in iOS 8, instead showing constraint errors. (rdar://problem/18921595)
*  Works around a problem where the Swift compiler can't parse headers with strongly retained dispatch objects. (radar pending)
*  Fixes an issue where Open In... could take very long or completely get stuck when form elements were saved.
*  Fixes an assertion (`UID` nil) when the last tab in the tabbed controller was removed.
*  Fixes a potential crash when using accessibility to read the contents of the PDF.

### 4.1.0 - 5 Nov 2014

_See the [announcement post](https://pspdfkit.com/blog/2014/pspdfkit-ios-4-1/)._

PSPDFKit now requires Xcode 6.1 with SDK 8.1. (iOS 7.0 is still supported)

If you use HockeyApp, Crashlytics or a similar crash reporting tool, we would love to hear from you.
We're working hard to further reduce our already very low issue rate and appreciate your feedback. (support+crashreports@pspdfkit.com)

PSPDFKit will now assert if you change annotation properties on threads other than the main thread.
This behavior was unsupported before and was a cause for issues that were very hard to track down.
Read more about the annotation object model at https://github.com/PSPDFKit/PSPDFKit-Demo/wiki/The-annotation-object-model.

*  Natural Drawing! You'll love this new default. Your drawings will look much more realistic, and are still fully backwards compatible to 3rd-party apps.
*  Various optimizations and improvements for iOS 8.1
*  API: `PSPDFSpeechSynthesizer` has been renamed to `PSPDFSpeechController`.
*  API: `PSPDFActivityBarButtonItem` now forwards the iOS 8-style completionHandler.
*  API: `wantsSelectionBorder` is now an instance method to customize this per object.
*  API: The `PSPDFPresentationStylePopover` has been removed in favor of the iOS 8 variant `UIModalPresentationPopover`.
*  API: The interface around `PSPDFStream` and `PSPDFStampAnnotation` has been modernized.
*  API: The `PSPDFSignatureStore` is now a protocol with a default implementation that can be changed via configuring `PSPDFConfiguration`.
*  API: Various annotation classes have gained a convenience initializer.
*  API: The gallery is now configurable via `PSPDFGalleryConfiguration` in `PSPDFConfiguration`.
*  API: Various annotation enum values now have appropriate transformer objects for better JSON export.
   (`PSPDFBorderStyleTransformerName`, `PSPDFBorderEffectTransformerName`, `PSPDFFreeTextAnnotationIntentTransformerName`)
*  API: Many singletons have been moved to the global `PSPDFKit` object and various smaller class refinements.
*  Writing documents now uses `NSFileCoordinator` for better compatibility with iCloud Drive and Extensions.
*  If the size class on iOS 8 is `UIUserInterfaceSizeClassCompact`, the status bar will now be hidden.
*  The inline search manager now automatically focuses the first search result.
*  The inline search manager now shows the current search status with a slight delay to be more visually pleasing.
*  Absolute paths, while discouraged, are now properly detected in the gallery on iOS 8.
*  The gallery now automatically resolves URL endpoints that have no pre-set type. (video/image/etc)
*  Makes sure the `PSPDFViewController` always correctly reloads, even when the document is changed while the controller is off-screen.
*  Various stylus drivers have been updated to be compatible with their API changes.
*  Search previews generated via `PSPDFLibrary` now also support text containing diacritics.
*  Adds support for bended arrows created in Yosemite's Preview.app.
*  Public C functions are now wrapped so they don't get name mangled if ObjC++ is used.
*  The annotation user name is now requested as soon as a annotation style mode is entered, not when the annotation is committed.
*  The interactive pop gesture is now disabled when the HUD is hidden to not accidentally invoke it during scrolling.
*  Improves robustness when `PSPDFLibrary` is called from multiple threads.
*  Improves reliability of sound annotations, especially on iOS 8 and 64 bit.
*  Improves code paths around setting a default line width when a border is set.
*  Improves compatibility with a certain set of annotations with appearance streams that uses custom transforms.
*  Improves reported frame when calling the shouldShowMenuItems: delegate in annotation sub-menus. (e.g. Highlight->Color)
*  Improves menu placement for annotations that can't be resized or moved.
*  Improves gallery error handling while the manifest is loaded.
*  Various improvements and better error detection/logging for the digital signing process.
*  Reduces memory pressure for older devices such as the iPad 2, the iPhone 4S and older iPod Touch devices.
*  The `creationDate` is now set for new user-created annotations and `lastModified` is updated on every change.
*  The text editing for bookmark names is now committed before a cell reorder is started, to ensure the changed text gets saved to the correct item.
*  When the device switches to single/double page mode due to rotation, we now will restore the last page instead of the left page from the double page mode.
*  Ensures all popover dismissal code paths go through the workaround for rdar://problem/18500786 on iOS 8.
*  Complex ink annotations are now processed much faster.
*  The move button no longer overlaps the signature display in the `PSPDFSignatureSelectorViewController`.
*  Ensures the signature creation buttons in `PSPDFSignatureViewController` are pixel-aligned.
*  Various improvements to digital signature handling. `PSPDFPKCS12Signer` now exposes `signFormElement` for non-interactive signing.
*  Various functional and performance improvements when parsing forms with JavaScript.
*  PSPDFKit now uses various iOS 8 QoS classes where appropriate to better deal with important/background related tasks.
*  Updates OpenSSL to 1.0.1j and SQLite to 3.8.7.1 (optional)
*  Works around a potential deadlock in the Apple PDF renderer when called during the application did load event. (rdar://problem/18778790)
*  Works around an issue where `UIDocumentInteractionController` sometimes would print extremely long log statements (rdar://problem/18568591)
*  Fixes an issue with certain missing headers in the OpenSSL-free build.
*  Fixes an issue where drawings created during one operation in multiple pages could be collected to a single page on commit.
*  Fixes a small UI issue where on iOS 8 the current page of the color inspector could be wrong.
*  Fixes a set of crashes that could happen on more complex views when they were laid out with a `CGRectNull`.
*  Fixes an issue when the `activeFilter of the `PSPDFThumbnailViewController` is set manually.
*  Fixes a potential deadlock when `PSPDFPerformBlockWithoutUndo` was used manually in a large-scale way.
*  Fixes an issue related to the `pageRange` feature and HUD scrollable thumbnail updating.
*  Fixes a potential stack overflow if extremely complex PDF forms were saved using `NSCoder`.
*  Fixes an issue where tapping the annotation button quickly could result in an incorrect selection.
*  Many of the more obscure bugs and crashes have been squashed.
*  Various localization updates and improvements. PSPDFKit now uses the [stringsdict file format](https://developer.apple.com/library/ios/documentation/MacOSX/Conceptual/BPInternational/StringsdictFileFormat/StringsdictFileFormat.html) to define language plural rules.

### 4.0.3 - 3 Oct 2014

*  Add API on `PSPDFViewController` to check if a search is running `isSearchActive` and to cancel a running search `cancelSearchAnimated:`.
*  Improves various animation effects under iOS 8.
*  Updates the optional SQLite library to 3.8.6.
*  Reduced the default speak rate in `PSPDFSpeechSynthesizer` from fast to normal.
*  Enables many new warnings to improve code quality and keeps our headers warning free in -Weverything environments.
*  Adds support for loading the PSPDFKit.bundle from unusual locations which improves compatibility with dynamic frameworks.
*  Improves annotation moving/resizing logic to be more pixel accurate.
*  The `PSPDFInlineSearchManager` instance is now exposed inside the `PSPDFViewController`, when used.
*  The `PSPDFViewController` now shows page labels if set for search results cells.
*  The play button in the gallery component will no longer zoom in but always stay at the optimal size.
*  PSPDFKit now emits a log warning if `UIViewControllerBasedStatusBarAppearance` is set to NO.
*  PSPDFKit will now assert if the license is set on a background thread. This is a very fast operation and needs to be done on the main thread.
*  `PSPDFEraseOverlayLayer` has been refactored to `PSPDFEraseOverlay` to allow property customization via `UIAppearance`.
*  The navigation bar will no longer be modified if PSPDFKit is embedded via child view controller containment and `useParentNavigationBar` is set to NO.
*  Free text annotations are now always rendered aspect ratio correct.
*  Various improvements to the undo/redo feature.
*  Trying to show the print or open in sheet now no longer throws a popover exception if the `PSPDFViewController` is not visible.
*  Works around a regression in iOS 8.1b1 related to UIAppearance with  (rdar://problem/18501844)
*  Works around a regression in iOS 8 where dismissing a popover controller could result in accessing a deallocated object on iOS 8. (rdar://problem/18500786)
*  Works around a regression in iOS 8 where dismissing a popover could dismiss the parent modal controller. (rdar://problem/18512973)
*  Works around an issue where UIKit throws an unexpected exception when accessing the image in the general pasteboard. (rdar://problem/18537933)
*  Works around an issue where UIKit forwards `_UIPhysicalButton` objects when we expect `UITouch` objects. (rdar://problem/18537814)
*  Fixes an issue with a non-standard-conforming PDF not defining "Subtype" in the font dictionary.
*  Fixes an issue where the `PSPDFPopoverController` could be presented rotated on landscape under iOS 8.
*  Fixes an issue that would indicate "No page text" on the whole document after a search if the last document page contained no text.
*  Fixes an issue where in some cases RichMedia/Screen annotation video content was cached but not re-fetched if the cache was deleted by the system.

### 4.0.2 - 26 Sep 2014

*  The UID generation in `PSPDFDocument` now works better with new app container locations in iOS 8. (See https://developer.apple.com/library/ios/technotes/tn2406/_index.html)
*  Improves video scrubbing behavior and the animation when the gallery is displayed in fullscreen.
*  FreeText Callout annotations now support dashed borders and better deal with different border/text colors.
*  Various smaller improvements related to the HUD visibility and thumbnail grid on the iPhone 6 Plus.
*  License is now validated later to allow setting the `PSPDFViewController` via Storyboards.
*  Improvements to the search animation in `PSPDFOutlineViewController`.
*  Digital Signatures now support up to 10k of payload data.
*  Works around an issue with extremely large image tiling on 64-bit devices.
*  API: Rename `searchStyle` to `searchMode` to keep it consistent with the enum name.
*  API: `searchForString:options:animated:` in `PSPDFViewController` now has an additional `sender` parameter to control popover placement.
*  Fixes an issue where `fitToWidth` didn't work as expected.
*  Fixes an issue where the software brightness dimming would not fill the whole screen on iOS 8 in landscape.
*  Fixes an issue where the stylus selection controller would hide other stylus options after one stylus has been chosen.
*  Fixes a small issue with calculating the content scroll view offset.
*  Fixes an issue where reordering apps in the “Open In” menu did not work. (iOS 8 only)
*  Fixes an issue where the actions in the `moreBarButtonItem` sometimes wouldn’t invoke under iOS 8 because they were committed while the action sheet was still dismissing.
*  Fixes an array overflow issue when a certain (corrupt) PDF was parsed.

### 4.0.1 - 23 Sep 2014

*  Various improvements to the PSPDFCatalog examples.
*  The `PSPDFSearchViewController` now always remembers the last used search string.
*  Fixes a minor rendering artifact on the iPhone 6 Plus.
*  Fixes an issue in the gallery image tiler that is specific to the iPhone 6.
*  Fixes an issue with detecting gallery URLs that are scaled (@2x, @3x)
*  Fixes an issue with link annotation options that contain an URL parsed from an XFDF.

### 4.0.0 - 22 Sep 2014

_See the [announcement post](https://pspdfkit.com/blog/2014/pspdfkit-ios-4-0/)._

PSPDFKit 4 is a major new release. Please study the migration guide:
https://github.com/PSPDFKit/PSPDFKit-Demo/wiki/PSPDFKit-4.0-Migration-Guide

Important: For your own security, invalid licenses now abort the app immediately, instead of silently showing a watermark.
PSPDFKit now requires a demo license for evaluation in your own app. Download it from the website and we'll automatically deliver the demo key via email.

Core Viewer:

*  PSPDFKit 4 is now fully compatible with iOS 8 and requires Xcode 6 with SDK 8.
*  Resources and loading support for @3x resources required for the iPhone 6 Plus have been added and various image resources have been refreshed for iOS 8.
*  The binary ships with armv7, arm64, i386 and x86_64. Following Apple's new defaults, we removed the slice for armv7s (which brought little benefits anyway).
*  All headers have been updated to use Modules for faster compile times.
*  Several properties that were no longer in line with iOS 7 have been removed: `tintColor`, `shouldTintPopovers` and `minLeft/RightToolbarWidth`. Use `UIAppearance` to customize colors and tint throughout PSPDFKit instead.
*  Adds a new `shouldHideStatusBar` property to globally control the status bar setting from the `PSPDFViewController`.
*  We no longer support the legacy `UIViewControllerBasedStatusBarAppearance` setting. Use view controller based status bar appearance.
*  The `PSPDFViewController` is now configured via an immutable `PSPDFConfiguration` object. See the migration guide for details.
*  Clear the web view state between `PSPDFWebAnnotationView` reuse.
*  Many classes, including `PSPDFTabBarButton` and `PSPDFScrobbleBar` have been enabled for `UIAppearance`.
*  Greatly improved and faster JavaScript Form support, using `JavaScriptCore` instead of `UIWebView`.
*  The embedded `PSPDFWebViewController` now uses the faster `WKWebView` when available on iOS 8.
*  Various improvements to the caching and rendering infrastructure. The limitation for super long/wide PDFs has been removed. PSPDFKit can now render documents no matter how long they are - we tested documents up to 5000px long/500px wide.
*  The thumbnail bar and the thumbnail controller now support a new layout that will group pages together for double-page layouts. (see `thumbnailGrouping`)
*  Many improvements to the multimedia gallery (`PSPDFGallery`), including better fullscreen-support and error handling.
*  `PSPDFAESDecryptor` now checks the HMAC for additional security.
*  The `PSPDFAESCryptoDataProvider` now returns an autoreleased object when accessing `dataProvider`.
*  Open/Close page triggers are now supported (see `PSPDFPageInfo`).
*  The new `PSPDFMessageBarButtonItem` allows sharing content via iMessage/SMS.
*  Various UI widgets now better deal with keyboards that change the frame after being displayed (especially relevant for iOS 8)
*  Annotation action URL parsing is now smarter and will trim the string and replaces inline spaces with %20, instead of just filtering them all.
*  Adds various view optimizations that lead to faster page display and less internal reloads.
*  Color/Text attributes for outlines are now supported and parsed in `PSPDFOutline` and properly displayed in `PSPDFOutlineViewController`.
*  Form text is now always auto-sized to match Adobe Acrobat's behavior.
*  Thew new, faster `UIVisualEffectsView` is used for blur whenever available on iOS 8.
*  OpenSSL has been updated to OpenSSL 1.0.1i.
*  API: Various keys for `PSPDFObjects*` have been renamed and are now better organized.
*  API: Pushing view controllers via `presentModalOrInPopover:embeddedInNavigationController:withCloseButton:animated:sender:options:` has been improved and renamed. The new method is called `presentViewController:options:animated:sender:completion:`.
*  API: `PSPDFImageInfo` is now immutable and works correctly when the `PSPDFDocument` contains multiple `PSPDFDocumentProvider` objects.
*  API: `PSPDFAction` now resolves named destinations and page labels via `localizedDescriptionWithDocumentProvider:`.
*  API: `PSPDFLabelParser` interface has been simplified and this object can now be created with a predefined set of labels.
*  Fixes an issue where the modal search controller could place itself above the status bar on iPhone.

Indexed Full-Text-Search:

*  `PSPDFLibrary` can now preview text based on the FTS index.
*  Fixes a potential threading issue when indexes were added/removed quickly from the `PSPDFLibrary`.

Annotations and Digital Signatures:

*  Annotation hit testing now works on paths directly, which allows better selection in cases where multiple annotations are overlaid.
*  The first time an annotation is created by the user, we now ask for the user name and also offer a sensible default based on the device name.
*  The drawing eraser has been completely redesigned. Erasing and drawing is now a lot faster and features such as the eraser top of the FiftyThree Pencil are fully supported without exiting draw mode.
*  The old `PSPDFAnnotationToolbar` has been fully replaced by the `PSPDFFlexibleAnnotationToolbar` introduced in 3.6, and thus renamed back to `PSPDFAnnotationToolbar`.
*  Cloud annotation borders are now fully supported.
*  Callout FreeText annotations can be parsed and edited.
*  Rich Media and Screen annotations are now lazily evaluated, improving general parsing speed.
*  Add support for various Rich Media Activation Context settings. (autostart)
*  `PSPDFURLConnection` has been replaced in favor of vanilla `NSURLSession` objects, which the additional benefit that remote content supporting SPDY will now load faster on iOS 8.
*  When fetching annotations via the document object finder, we now optionally support annotation grouping via the `PSPDFObjectsAnnotationIncludedGroupedKey` key.
*  Improved the signing architecture to allow signing using PKI hardware and remove signatures.
*  Annotation selection handling has been greatly improved and now uses a customizable margin for easier handling.
*  Annotations now have a common `fontAttributes` property that allows any key/value pair that `NSAttributedString` understands - so free text and forms can be customized even further. (Note: Not all values can be exported)
*  Free Text annotation handling now understands more PDF-based properties and will render more accurate.
*  Many improvements to stylus management and driver handling, especially for FiftyThree's Pencil.
*  PSPDFKit's model objects now mostly comply to `NSSecureCoding`.
*  The inspector has been modernized and offers a better display for poly/line and free text annotations.
*  Appearance stream parsing support has been improved.
*  The password view has been completely redesigned to fit into iOS 7 and 8.
*  The `PSPDFSignatureViewController` has been completely redesigned and now supports color selection during signing.
*  `PSPDFViewController` now fully respects `isAutosaveEnabled` and will no longer save the document on view did appear when this is set to NO.
*  `PSPDFFontDescriptor` has been removed in favor of the new `UIFontDescriptor` introduced in iOS 7.
*  Various code is now faster thanks to the toll-free-bridging of `UIFont` and `CTFontRef`.
*  Support for the old, legacy PSPDFKit 2 annotation save format has been removed.
*  Image annotations now have better support for EXIF rotations when clipped via the internal editor.
*  Fixes an issue where the inspector could re-use the wrong cells and mixing up sliders or other control items.
*  Fixes an issue that would sometimes not allow to draw at the very borders of the screen on iPhone.
*  Fixes an issue where the annotation menu would not show up after scrolling the page.
*  Fixes an issue with very large animated gifs.
*  Includes all bug fixes and improvements made in the PSPDFKit 3.7.x branch.
*  Fixes an issue related to search highlighting and annotation moving. The highlights are now cleared before objects can be moved.
*  Fixes an issue where the popover wasn't correctly moved when a new `PSPDFNoteAnnotation` is created via the `PSPDFNoteAnnotationViewController`.

### 3.7.14 - 16 Sep 2014

PSPDFKit 4.0 will be released on Monday, September 22, 2014 with full support for Xcode 6 with iOS 8 while also supporting iOS 7.
The PSPDFKit 3.7.x branch will remain compatible with Xcode 5.1.1 and iOS 6+.

*  Fixes an issue where the Camera/Image Picker UI sometimes wouldn’t show up on iPad/iOS 8.

### 3.7.13 - 11 Sep 2014

*  Works around a rare PDF rendering crash in iOS 8.
*  Using `fillColor` on `PSPDFButtonFormElement` now respects the `alpha` property.
*  Fixes an issue in the text extraction logic when converting the contents of glyphs from unknown/not loadable fonts.
*  Fixes an issue where entering erase mode could hide the annotation toolbar.
*  Fixes an issue where the progress HUD would sometimes not correctly reposition when the keyboard appears in landscape.
*  Fixes an issue where the note annotation popover could become visible when deleting multiple annotations (including a note) at the same time.
*  Fixes an issue where the signature view controller failed to display on iPhone/iOS 8.

### 3.7.12 - 1 Sep 2014

*  The predefined stamps now use the system locale instead of `en_US`.
*  Fixes an issue where the scrollable thumbnail bar could get into a state where it is not correctly displayed.
*  Fixes an issue with creating custom stamp annotations on iPad.
*  Fixes an issue with writing annotations into files that have unusual and non-standard compliant object headers.
*  Fixes a caching issue with extremely long file names.

### 3.7.11 - 20 Aug 2014

*  Improves user name guessing for the annotation creation user.
*  Fixes an issue where saving notes multiple times within the same session could cause a duplication.
*  Fixes an issue with handling umlauts during a save in certain text field form elements.
*  Fixes a minor logging issue where in rare cases `NSScanner` could complain about nil string arguments.

### 3.7.10 - 17 Aug 2014

*  Rendering the audio annotation preview no longer pauses background music.
*  Makes sure the signature image in the signature view controller is the same regardless of the device orientation.
*  Fixes an issue with rendering right-aligned free text annotations in too small bounding boxes.
*  Fixes a few minor issues when exporting/importing from/to XFDF for stamp and ink annotations.
*  Fixes an issue where alert view actions could be executed twice under iOS 8.

### 3.7.9 - 6 Aug 2014

*  Fixes handling of nested form check boxes that are used as radio boxes.
*  Fixes an issue that could truncate text from a choice form element.
*  Fixes a rare UI issue with duplicated ink elements during erasing.
*  Fixes an issue where in landscape the keyboard could appear unexpectedly when using radio button form elements.
*  Fixes an issue where the page indicator in the scrobble bar sometimes was not correctly updated.
*  Fixes an issue on iOS 6 when showing the signature selector view controller.

### 3.7.8 - 1 Aug 2014

*  Popup annotations, when written, now by default have the same bounding box as the parent annotation.
*  Improves handling of link annotations with an empty URL.
*  Continuous scroll mode now chooses the current pages based on the largest visible page, not the first visible page.
*  Path resolving now also resolves "Caches" instead of just "Cache".
*  Improves protection against manually calling `commonInitWithDocument:`.
*  Improves placement of free text annotations that are close to the right page border.
*  API: The interface for the `PSPDFXFDFAnnotationProvider` changed to reflect the possibility of stream recreation.
   Instead of setting the `inputStream` and `outputStream` directly, use `createInputStreamBlock` and `createOutputStreamBlock`.
*  Fixes a UI issue where the separators for the signature chooser could end up not visible on iOS 7.
*  Fixes an issue where cropping images could end up in black bars on parts of the image.
*  Fixes an issue where the text selection knobs could be slightly offset after a device rotation.
*  Fixes an issue with the fullscreen gallery transition on an iPhone.
*  Fixes a rare condition where a selected annotation would not hide the un-selected one, leaving two copies on the screen until the page changed.
*  Fixes a race condition that could result in rendering issues for form objects with auto-resizing text.
*  Fixes an issue where PSPDFKit would print a warning for KVO'ing weak properties that was not actually declared as weak.
*  Fixes an issue where the scrobble bar would not properly update itself after a rotation change.

### 3.7.7 - 21 Jul 2014

*  Videos in the gallery are now reset if they are played till the end and the page changes.
*  The 'hidden' flag for annotation objects is now also honored for the gallery. (including audio)
*  Fixes an issue when the device is being rotated while in erase mode.
*  Fixes an issue where the pen tool can't draw up to the edge for certain configurations on an iPhone.
*  Fixes an issue where quickly destroying/recreating libraries for indexed search could result in partial indexes.
*  Fixes an issue in `PSPDFResizableView` related to unusual view controller configurations where the view could overlap the parent view and subsequently no longer correctly responding to touch events.
*  Fixes an issue related to rotation when the gallery is moved to fullscreen from within a popover.
*  Fixes an issue where missing fields in the digital signature validation code could result in a (null) output.
*  Fixes an issue related to multiple saving via the same XFDF annotation provider.
*  Fixes an issue related to early-reloading of the thumbnail bar that could result in missing bar button items for special configurations.
*  Fixes an issue where the navigation bar could disappear after the annotation toolbar has been moved to a different position.

### 3.7.6 - 4 Jul 2014

*  Simplifies usage of `PSPDFMediaPlayerCoverModeClear` in the gallery.
*  Updates the Vimeo integration to use the new API endpoint.
*  Improves efficiency and memory usage for parsing large outlines with invalid named destination tables.
*  When using the text selection tool, we want to make sure no annotation is selected anymore.
*  The state of the `PSPDFWebAnnotationView` is now cleared upon reuse to prevent flashes of previous used content.
*  Fixes an issue related to the scrobble bar and `PSPDFThumbnailBarModeScrollable` on iOS 6.
*  Fixes a potential issue where the HUD layout code could loop.
*  Fixes a potential crash related to the Wacom stylus driver.

### 3.7.5 - 16 Jun 2014

*  New Localizations: Indonesian, Malaysian, Polish, Chinese Traditional, Thai, Turkish and Ukrainian.
*  Updates the WACOM stylus driver to no longer eagerly initialize, which could present a bluetooth disabled alert view.
*  Annotations added to a `PSPDFDocument` programmatically now always get the `isDirty` flag set to ensure that they are being saved.
*  `PSPDFResizableView` now correctly deals with `UIAppearance` and makes it easier to customize individual knobs. See `PSCCustomSelectionKnobsExample` for details.
*  Adds resilience / asserts form missing views in unusual (child view controller) configurations for the annotation toolbar.
*  Improved JavaScript-calculation-support, adds `AFMakeNumber` to the list of supported JS functions and improves hide action annotation resolving.
*  Improves compatibility to parse image stamps from 3rd-party software.
*  Outlines where the page reference is missing are now displayed to be consistent with Adobe Acrobat.
*  `PSPDFLibrary` learned exact sentence matching via the `PSPDFLibraryMatchExactPhrasesOnlyKey` option.
*  Improves support for named hide actions that are bound to form elements.
*  Allow to hook into `PSPDFMenuItem` action for analytics.
*  Scrolling or zooming will no longer re-show the note popover. Moving the annotation while the popover being open will still re-show the popover. This behavior change does not effect other annotations that use a `UIMenuController` or note on iPhone.
*  The annotation toolbar will now be hidden automatically if the last tab on the tabbed view controller is closed.
*  The font picker blacklist now uses regular expressions for matching, to allow more special cases like blocking “Courier” but still allowing “Courier New”. The old behavior was a simple prefix check.
*  The tables in `PSPDFLibrary` is now lazily created on first use, improving speed and delaying the unicode61 tokenizer check until the library is actually used.
*  API: Removes the `thumbnailSize` property on `PSPDFCache`. This should be set in the `PSPDFViewController` instead.
*  API: Hide `thumbnailCellClass` in `PSPDFThumbnailBar`. Use the standard class override mechanism instead.
*  API: Removes the `skipMenuForNoteAnnotationsOnIPad` property on `PSPDFViewController`. Use the new `shouldInvokeAutomatically` on `PSPDFMenuItem` instead. (See `PSCOpenNoteOnPhoneWithSingleTapExample`)
*  Fixes an issue related to copying sound annotations.
*  Fixes an issue where `UIImagePickerController` would sometimes not cancel correctly on iOS 7.0.
*  Fixes an crash related to accessibility support and page reading.
*  Fixes an issue where a picked image was added after pressing “Cancel” on the size popover.
*  Fixes an issue where the thumbnail bar wouldn’t update correctly the first time it is displayed when it was hidden initially.
*  Fixes an issue related to annotation fetching when the `pageRange` feature is enabled.
*  Fixes a potential issue related to cancelling index requests in `PSPDFLibrary`.
*  Fixes a potential issue in the vector separation code of the ink eraser.
*  Fixes an incompatibility with the NewRelic framework.

### 3.7.4 - 26 May 2014

Note: With WWDC imminent and the upcoming release of iOS 8, we plan to finally drop support for iOS 6. Let us know your thoughts about this change: support@pspdfkit.com.

*  Clip drawings to bounds. Improves experience when drawing in double page mode.
*  The `metadata` dictionary of `PSPDFDocument` now also contains PDF Portfolio data, if detected.
*  Add new option to the `PSPDFAnnotationTableViewController` to show/hide the clear all button. `showDeleteAllOption`.
*  Allow initialization of sound annotations from custom URL.
*  Don’t allow to copy the contents of text markup annotations if the document disallows copying.
*  Document parser: Add support for direct AcroForm dictionaries.
*  Improves compatibility with certain rich text formats for free text annotations in 3rd-party XFDF files.
*  Extremely complex ink annotations will now render much faster with only minimal reduced quality.
*  We no longer manually draw a border if the free text annotation is backed by an AP stream.
*  Adds support for the `mailDoc` and `launchURL` JS functions to invoke the email/browser controller via JavaScript.
*  `PSPDFProcessor`: `PSPDFProcessorStripEmptyPages` now also works for regular document rendering and performs a more sophisticated page analysis.
*  API: The `PSPDFPageRenderer` can now be replaced at runtime, there's a new `setSharedPageRenderer:` instead of the class setter.
*  Various localization improvements.
*  Fixes an issue where certain JavaScript calculations could end up as NaN's.
*  Fixes an issue where the “Reset Form” feature would sometimes not clear all form elements.
*  Fixes an issue where the `pageRange` property could be calculated incorrectly for password protected files.
*  Fixes an issue where adding/removing the same overlay annotations within the same runloop could lead to an incorrect view representation.
*  Fixes an issue where the bookmark indicator was not always correctly displayed when pages are filtered using the pageRange feature.
*  Fixes an issue where persisting choice form elements that were split in child/parent relationships could sometimes result in only the initial index value being set.

### 3.7.3 - 12 May 2014

*  The search preview text is now stripped of control characters like carriage return or newlines, which improves preview for various documents.
*  Improves error handling for inline PDF videos that can't be played. (most likely because they are in .flv flash video format)
*  The cover image capture time for the video now defaults to second 2 instead of 0 to give a more meaningful default, and is also configurable via JSON.
*  `PSPDFStampViewController`: Adds `dateStampsEnabled` property to control if date stamps are added or not.
*  Improves handling around flexible toolbar dragging and the half modal sheet on the iPhone.
*  Improves compatibility when the 'Spark Inspector' framework is linked with PSPDFKit.
*  Add `selectedOptions` to `PSPDFDocumentSharingViewController` to allow easier changing of the defaults.
*  Changes the selected default for the print sheet to `print with annotations` if this is allowed.
*  Add new option to `PSPDFAnnotationStateManager` to allow setting the allowed image qualities `allowedImageQualities` for image annotations. Fixes #989.
*  API: Make `PSPDFOutlineElement` immutable. Use the initializer to create.
*  Various localization improvements.
*  Fixes a potential issue with manually creating `PSPDFLineAnnotation` objects without properly initializing the points array.
*  Fixes a potential formatting issue when writing sound annotations into the PDF.

### 3.7.2 - 6 May 2014

*  Add support for actions that are invoked on entering/exiting annotation focus.
*  Add support for GoToE embedded actions. This allows linking to PDFs that are saved inside the PDF.
*  Add support for relatively linked files without file handler. Will open QuickLook for such files.
*  `PSPDFDocument` now automatically detects and converts PDF-Date-Strings (D:...) to NSDate objects when accessing the `metadata` property.
*  Note annotations will now always get the correct style applied. (which includes alpha, if set)
*  The method `updatePage:animated:` now also discards any current selection to make sure everything is updated.
*  `PSPDFWebViewController`: add new property `shouldUpdateTitleFromWebContent` to control if the title should be updated dynamically.
*  Improved security handling based on Veracode static analyzer feedback.
*  An embedded file with the 'pdf' filetype will now be previewed using a new `PSPDFViewController` instead of the generic QuickLook. QuickLook will still be used for all other file types.
*  Various improvements to Form-JavaScript validation, actions and handling.
*  Various smaller improvements to the flexible annotation toolbar related to `tintColor` handling.
*  A new render option named `PSPDFRenderDrawBlockKey` now provides a global drawing handler above the page renderer.
*  Improves performance of the internal download manager with moving some Apple-API that is potentially slow to a background thread.
*  The `allowBackgroundSaving` property of the `PSPDFViewController` now defaults to YES. Make sure you can deal with async saving or revert this to NO.
*  Single-page documents no longer allow bouncing, unless `alwaysBouncePages` is enabled.
*  API: The watermark drawing block has been changed and now includes more types. See `PSPDFRenderDrawBlock` for the new type.
*  API: The X-Callback-URL registration is now handled by the PSPDFKit global configuration object.
*  API: Removes the `mailComposeViewControllerCustomizationBlock`. Use the `pdfViewController:shouldShowController:embeddedInController:options:` delegate.
*  API: executePDFAction:inTargetRect:forPage:actionContainer now has an additional animated: property.
*  API: Some logic from `PSPDFSoundAnnotation` has been extracted into `PSPDFSoundAnnotationController`.
*  Fixes a regression when adding images via the annotation toolbar on an iPad.
*  Fixes a regression that could reduce ink annotation width to 1.
*  Fixes an issue where PSPDFStatusHUD would not always correctly update when a new title was set while it was already visible.
*  Fixes an issue where sound annotation data was sometimes not correctly loaded and wasn't properly exported as JSON.
*  Fixes a very rare potential for a deadlock when the JavaScript runtime is being initialized from a background thread.

### 3.7.1 - 25 Apr 2014

*  Adds Dutch translation.
*  The `PSPDFGallery` now supports parsing and embedding Vimeo URLs, next to YouTube.
*  Improvements for the flexible annotation toolbar on the iPhone.
*  Calling undo/redo will now scroll to the page where the annotation is being changed.
*  Small visual tweaks for the ink preview icon in the flexible annotation toolbar.
*  Allow to subclass `PSPDFFreeTextAccessoryView`, `PSPDFFormInputAccessoryView` and expose the bar button items.
*  Additional improvements and checks to better guard against low-memory situations and to improve the Veracode score.
*  Performance improvements when a large amount of updates are being processed for undo/redo.
*  The document label is no longer displayed on iPhone when the document doesn't has a label.
*  The `PSPDFDrawView` is now reused when possible and state aware. (improves drawing polylines/polygons)
*  The XFDF parser now correctly parses the `lastModified` property of annotations.
*  Improve palm detection when using a stylus.
*  Fixes an issue when converting line annotations to JSON.
*  Fixes various issues when using updateAnnotations:animated: from the `PSPDFAnnotationManager`.
*  Fixes an issue related to search in the font picker controller.
*  Fixes an issue when using the streaming encryption/decryption with empty XFDF files.

### 3.7.0 - 19 Apr 2014

_See the [announcement post](https://pspdfkit.com/blog/2014/pspdfkit-ios-3-7/)._

PSPDFKit now requires Xcode 5.1.1 or higher to compile if you're using the source code variant. (we still support all iOS versions down to 6.0)

*  Stylus support for ink annotation drawing with drivers for Adonit, Pogo, HEX3 and Wacom. The framework is designed in a way where new drivers can be added easily. To enable this, see the "Stylus" example in the PSPDFCatalog. (The SDKs need to be downloaded separately. Drivers are currently only available for customers with a license.)
*  The annotation toolbar now has a second drawing style (thick, yellow, transparent) and improved color defaults for the other tools.
*  Search now detects if the document has no content and shows a different "no page text" message.
*  We now have a command line tool that works on Mac, Windows and Linux/Unix that can encrypt/decrypt files to be used with the `PSPDFAESCryptoDataProvider` (see `Extras` folder)
*  PSPDFKit now has support for transparent reading/writing with encrypted streams in the `PSPDFXFDFAnnotationProvider` with the new `PSPDFAESCryptoOutputStream` and `PSPDFAESCryptoInputStream`. This allows secure storage of annotations.
*  The gallery has improved handling for fullscreen transition and properly tears down when the `PSPDFViewController` is popped while it is in full screen mode.
*  The gallery learned different cover modes, including a transparent one: https://github.com/PSPDFKit/PSPDFKit-Demo/wiki/adding-a-gallery-to-your-document
*  Multimedia links can now be activated via button and the gallery can be displayed as popover or modally: https://github.com/PSPDFKit/PSPDFKit-Demo/wiki/adding-a-gallery-to-your-document
*  The gallery will now correctly scale @2x images from remote servers.
*  The gallery now automatically pauses other instances when play is pressed.
*  The gallery now allows UIAppearance for blur and background colors.
*  The blur algorithm used for the gallery are now over 4x faster and also support live fullscreen blur.
*  The speech synthesizer (`PSPDFSpeechSynthesizer`) now auto-detects the best language by parsing the current document page.
*  Greatly improved AcroForm JavaScript validation support.
*  Improves support for custom controllers that don't define a preferred content size when used with `PSPDFContainerViewController`.
*  Empty ink signatures are no longer saved.
*  Add confirmation sheet for the "Clear All" button in the annotation table view controller.
*  It's now possible to correctly override `PSPDFAnnotationCell` from `PSPDFAnnotationTableViewController`.
*  The `PSPDFAnnotationTableViewController` now automatically reloads the content if the `visibleAnnotationTypes` property has been changed.
*  The `PSPDFLibrary` now optionally allows exact word matching with supplying the `PSPDFLibraryMatchExactWordsOnlyKey` parameter.
*  The XSigner attribute is now parsed and displayed as the signer name if no other name is defined in the digital signature. (PSPDFKit Complete feature)
*  Adds support for orphaned form elements that are not referenced in the AcroForm dictionary.
*  Reloading a document while the keyboard is up will no longer lead to the page animating back to center.
*  Add some additional safeguards/asserts and developer warnings that help to detect wrong use of certain methods.
*  Improve support for custom `PSPDFFlexibleAnnotationToolbar` configuration or when used manually without an `UINavigationController`.
*  PSPDFKit has been tested with Veracode (http://www.veracode.com/) and we've improved and hardened several code paths.
*  Add `PSPDFThumbnailFilterSegmentedControl` to enable UIAppearance rules on the thumbnail overview filter segment.
*  Add basic support for URL actions that are actually JavaScript actions.
*  Support loading images from asset catalogs via the pspdfkit:// image loading system.
*  The flexible annotation toolbar now better adapts to status bar changes on iOS 7.
*  Allow to manually force-load all annotations from the `PSPDFXFDFAnnotationProvider`.
*  Add support for embedded CMap streams for the text parsing engine.
*  API: The `PSPDFAction` objects and the `PSPDFPageInfo` objects are now immutable.
*  API: The toolbar now longer auto-hides when invoked via the context menu. This also removes the `hideAfterDrawingDidFinish` property.
*  API: Removed `setTextViewCustomizationBlock:` as it is inconsistent with what we do everywhere else in the framework. Use `overrideClass:withClass:` or the `pdfViewController:shouldShowController:embeddedInController:options:animated` delegate instead. To change the font, instead of `textViewFont`, simply change it in `updateTextView`.
*  API: The `bookmarkQueue` is now exposed via a property and not via an ivar in `PSPDFBookmarkParser`.
*  API: A few methods in the digital signature code have been renamed to be more clear about their intent.
*  API: Adds a new `pageTextFound` parameter to `didFinishSearch:` and now shows "Document has no content" if a document without text content is being searched.
*  API: `setGlobalBorderColor` on `PSPDFLinkAnnotationView` has been removed. The recommended API is to use `UIAppearance` on `borderColor` instead.
*  API: Remove explicit close button management inside `PSPDFContainerViewController` as the `PSPDFViewController` (via `PSPDFPresentationManager`) already provides this feature.
*  Fixes an issue where certain pre-encoded URLs with non-ascii characters could end up being encoded twice.
*  Fixes a potential stability issue in the accessibility support for line-based page reading.
*  Fixes an issue that could add overlay-based annotations to the wrong page when a redo action is invoked with soft-deleted annotations.
*  Fixes an issue related to text extraction font caching with different widths.
*  Fixes various rare issues when analyzing the document or writing annotations with partial UTF16-LE encoding, invalid document IDs or missing object references.
*  Fixes a rare crash issue related to missing languages and the `PSPDFSpeechSynthesizer`.

### 3.6.5 - 31 Mar 2014

*  Some internal improvements to prepare for the upcoming stylus support.
*  Improves section styling of the annotation inspector under iOS 7.

### 3.6.4 - 30 Mar 2014

*  The flexible annotation toolbar now automatically consolidates buttons if space becomes too short.
*  The image/video gallery now loops content by default, unless it's just a single item. (This is controllable by the new `loopEnabled` flag)
*  Improve documentation around gallery-usage and proper removal from full-screen.
*  The percent driven back animation of the inspector now animates the current selected cell out or restores it based on the animation progress.
*  Changes the HMAC format for the PSPDFCryptor from SHA1 to SHA256 to be more consistent with the RNCryptor data format.
*  The `moreBarButtonItem` action sheet is now dismissed when tapped on the button while it being open (instead of showing it again).
*  Enables the addition of global processor options via a new delegate to `PSPDFDocumentSharingViewController`.
*  `PSPDFProcessor` now has a new drawing hook (`PSPDFProcessorDrawRectBlock`) which can be used to watermark documents on exporting.
*  Fixes an issue that could prevent showing some search highlights if there are multiple on the same page.
*  Fixes a regression where sometimes the original view port wasn't correctly restored when the keyboard is dismissed after free text editing.

### 3.6.3 - 26 Mar 2014

*  Improves placement precision of draft ink annotations when the device is rotated while in drawing mode.
*  Improves popover placement for the flexible annotation toolbar in vertical mode.
*  Multiple performance and memory improvements, especially for searching and scrolling large documents, and for usage on an iPhone 4.
*  Various cosmetic updates (improved thumbnail scroll bar, better support for iPhone 4 which doesn't support live-blur)
*  Improves search highlighting accuracy for certain document types.
*  Fixes an issue that could move the scroll view for keyboard events that were not inside the scroll view.
*  Small localization updates.

### 3.6.2 - 21 Mar 2014

*  Improves appearance customization options for the new `PSPDFFlexibleAnnotationToolbar`.
*  The new `PSPDFFlexibleAnnotationToolbar` is easier to customize and also has an `additionalButtons` property to add custom actions.
*  Makes sure the `PSPDFFlexibleAnnotationToolbar` is always removed from the view hierarchy as the `PSPDFViewController` disappears.
*  The `PSPDFGallery` now better deals with custom quality properties for YouTube videos.
*  Ensures that the status bar doesn't change on iOS 7 with view controller based status bar appearance enabled when the `PSPDFStatusHUD` is displayed.
*  Improves the XFDF writer/parser to deal with more action types (`PSPDFRenditionAction`, `PSPDFRichMediaExecuteAction`, `PSPDFSubmitFormAction`, `PSPDFResetFormAction`, `PSPDFHideAction`).
*  Improves popover positioning logic, especially for the search popover.
*  Improves stability when using the new container annotation provider class.
*  API: Removes `aspectRatioEqual` and `aspectRatioVariance` from `PSPDFDocument`. Other performance improvements made this option no longer useful.
*  API: Clarifies usage of the `PSPDFGalleryViewController` by renaming the `allowFullscreen` property to `displayModeUserInteractionEnabled`.
*  Fixes a potential issue with an over-release of NSError when printing a single page with PSPDFKit Viewer.
*  Fixes a stability issue when serializing annotations for certain PDF AcroForm buttons with icons in the appearance characteristics dictionary.
*  Fixes an issue where changing the page via the annotation table view controller could end up on a page that wasn't correctly centered.
*  Fixes a small selection issue with handling multiple equal grouped annotations on the same page.

### 3.6.1 - 17 Mar 2014

*  Before a document is saved, we now set the annotation state mode to nil, which commits any open annotations like inks.
*  Reverted the use of @import with modules. Apple's module feature seems to have issues with projects that also use C++.
*  Fixes an issue with saving annotations in certain PDFs with corrupted page IDs.

### 3.6.0 - 16 Mar 2014

_See the [announcement post](https://pspdfkit.com/blog/2014/pspdfkit-ios-3-6/)._

We're proud to ship the next milestone of PSPDFKit. Version 3.6 features a completely new annotation toolbar, search within annotation text, note annotations that show up in the thumbnails and countless other improvements.
This release has been fully tested with Xcode 5.1 and iOS 7.1. We now require at least Xcode 5.0.2 and SDK 7 to compile and have dropped support for Xcode 4.6 (Apple no longer accepts apps built with SDK 6/Xcode 4.6)
Applications built with PSPDFKit will still run and work great under iOS 6.

*  Fully compatible and tested with iOS 7.1 and Xcode 5.1.
*  God dag! We've added Swedish to the list of presupplied localization files.
*  All-new flexible annotation toolbar (`PSPDFFlexibleAnnotationToolbar`) that can be dragged to be vertical or horizontal.
   See `PSPDFAnnotationToolbarType` in the `PSPDFAnnotationBarButtonItem` to optionally keep using the old annotation toolbar.
*  PSPDFKit Complete can now create digital signatures. This feature is still in beta - we need more documents to test all possible conditions.
   If you're having issues with this, please contact us so we can further increase the test coverage.
*  Text selection now supports text-to-speech on iOS 7+. See `PSPDFSpeechSynthesizer` for details and options to customize the language.
*  Forms on iPhone/iOS 7 now have an automatic zoom feature that makes it a lot easier to enter text.
*  Search now also includes annotation and form element contents. This is especially useful for note annotations and forms. (PSPDFKit Basic/Complete)
*  Search results are now hidden on page tap (unless that tap finds an action like selecting an annotation.)
*  Note annotations are now always rendered at the same size and also visible in the thumbnails.
*  PDF annotation writing will now be faster and produce a more compact trailer, reducing target file size.
*  Adds support for mailto: links with multiple email addresses (also for CC and BCC).
*  Saving will now use the correct z-index for annotations and forms in the same ordering as they are added. Saving changed objects will no longer change the z-ordering.
*  Simple JavaScript actions like printing, alert boxes or adding form values now work. If you have a use case for that, please contact us at support@pspdfkit.com.
*  The XFDF parser now parses basic rich text strings as used in Acrobat and keeps color and font informations.
*  Increases contrast for the selection color on form choice list-boxes.
*  `PSPDFTextSelectionView` now allows UIAppearance to customize `selectionColor` and `selectionAlpha`.
*  The `PSPDFActivityViewController` now checks if printing is allowed for the document before even showing the print option.
*  No longer ends the text view edit mode when zooming on iOS 7 (flat mode) and above.
*  File annotations are now evaluated lazily, which improves startup performance for documents with many such annotations.
*  Note annotations now also create popup annotation on PDF saving. These are optional but increase compatibility with certain less standard-compliant 3rd-party software.
*  The behavior of the pdfViewController:didTapOnPage:View:atPoint: has been updated when no `PSPDFPageView` was hit to return nil here, and coordinates relative to the current PSPDFViewController.
*  The `PSPDFThumbnailBar` has a new parameter to optionally enable the page labels: `showPageLabels` (defaults to NO).
*  Many improvements related to PDF AcroForm handling and input validation.
*  Calls to `didHidePageView:` and `didShowPageView:` of views with the `PSPDFAnnotationViewProtocol` are now properly balanced.
*  The text parser now has a more sophisticated text shadow/overlay detection, which improves search results by removing duplicated glyphs.
*  The gallery has a new mode that enables live-blur behind the content (see `blurEnabled` on `PSPDFGalleryViewController`).
*  Fixes an issue where the popover might open at an unexpected location when using the inline multimedia system with the popover:true parameter.
*  Font annotations are now rendered with their AP stream for greater document accuracy.
*  Annotations now support the additional action mouse up event.
*  Greatly improves speed for the XFDF image deserialization process.
*  API: PSPDFKit now requires the Accelerate.framework. If you're using the PSPDFKit.xcconfig file, you don't need to change anything.
*  API: Search related methods are now in the new `searchHighlightViewManager` property of `PSPDFViewController.`
*  API: The HUD and related views have been reorganized. You might have to update some calls (some views are now within `HUDView`)
*  API: `PSPDFProgressHUD` has been replaced with the all-new `PSPDFStatusHUD`, which features a modern iOS 7 design and an improved API.
*  API: `PSPDFDocument` should be treated as an immutable object (apart from settings). Thus, the `files` and `fileURL` properties have been made readonly, and `appendFile:` has been removed. Create a new document with the new files/data objects instead. Use the new helper `documentByAppendingObjects:` to create a modified document with a new file or data objects.
*  API: The `PSPDFAnnotationManager` now supports various protocol strings, thus the property `protocolString` has been renamed to `protocolStrings` and is now an NSArray that takes NSStrings. We've added `embed://` as a second, neutral protocol format.
*  API: The `textSearch` class has been moved from PSPDFDocument to PSPDFViewController.
*  API: `PSPDFNoteAnnotationViewFixedSize` has been removed. Notes are now drawn with a fixed size, however you can define the bounding box to whatever you like. We recommend using 32px, but this value is being ignored by both PSPDFKit and Adobe Acrobat. Other, less capable renderers like Apple Preview.app might use the value, so 32px is a good value - but also depends how large or small your document is.
*  API: The `PSPDFSignatureViewController` no longer dismisses itself. Dismiss the controller in the delegate callbacks.
*  API: Code and subclassing hooks that could be used to change the `PSPDFScrobbleBar` frame have been moved to `PSPDFHUDView`.
*  API: Removes various deprecated code.
*  Fixes an issue related to YouTube video parsing - now compatible with even more video subtypes.
*  Fixes a weird scrolling behavior for some form elements.
*  Fixes an issue where the free text tool wouldn't work if highlighting was selected before that.
*  Fixes an issue where PDF form values could become corrupted because of insufficient escaping in some PDF files.
*  Fixes an issue where drawings could be created on multiple pages if the page is changed while in drawing mode.
*  Fixes multiple issues related to forms on rotated pages.
*  Fixes an issue related to annotation fetching and the `pageRange` feature of `PSPDFDocument`.
*  Fixes multiple issues related to the ink eraser.

### 3.5.2 - 21 Feb 2014

*  `PSPDFYouTubeAnnotationView` has been removed in favor of the newer `PSPDFGallery`. Te gallery is a much better user experience for embedding YouTube videos.
*  Adds a workaround to prevent unwanted `UIPopoverController` animations that might appear under certain conditions on iOS 7.0.
*  New property `highlightColor` on `PSPDFPageView` to control the color used for link/form touch feedback.
*  Improves reload behavior with an external animation block.
*  The play button for the `PSPDFGallery` is now always white and configurable via `UIAppearance`.
*  Improves fade animation of the page label under iOS 7, especially for the new blur-page label setting on iOS 7.
*  The `PSPDFDocumentPickerController` now uses a dynamic size when displayed as a popover.
*  Various smaller improvements related to the new sidebar example in PSPDFCatalog.
*  `defaultColorOptionsForAnnotationType` now returns an NSArray of string, color tuples.
*  Adds UIAppearance support for the default search view highlight color.
*  The note popover now will be dismissed on tap if the annotation state manager is used for highlight mode, just as it does when using the annotation toolbar.
*  The `allowsCopying` property in `PSPDFDocument` no longer controls if the "Copy" option for annotations is displayed. This property only controls text.
*  Makes sure that the ink width while drawing and rotating is always the correct one.
*  API: `padding` of `PSPDFViewController` is now of type `UIEdgeInsets` and also works with `PSPDFPageTransitionScrollContinuous`.
*  Stamps now more closely resemble the look of Adobe Acrobat.
*  Improves content type detection in the gallery.
*  Various localization improvements.
*  The XFDF parser can now write images within appearance streams to Adobe Acrobat.
*  Fixes an issue where the text rect could be CGRectZero if the `shouldSelectText:` delegate was not set.
*  Fixes an positioning issue related to custom scopes in `PSPDFSearchViewController`.
*  Fixes an issue where the `PSPDFMultiDocumentViewController` would not work as expected if the delegate was not set.
*  Fixes an issue where the `PSPDFMultiDocumentViewController` would only show the thumbnails for the first document.
*  Fixes a stability issue related to the "Clear All" feature and the XFDF annotation provider.

### 3.5.1 - 15 Feb 2014

*  New property in the `PSPDFStyleManager` to control if changes to annotations should be saved as the new defaults: `shouldUpdateDefaultsForAnnotationChanges`.
*  Expose `cornerRadius` in `PSPDFResizableView` to customize the border appearance.
*  Behavior Change: Setting the `annotationSaveMode` to `PSPDFAnnotationSaveModeDisabled` will no longer disable annotation editing features. To disable annotation editing, set the `editableAnnotationTypes` property of the `PSPDFDocument` to nil instead.
*  Adds a new delegate "pdfDocument:provider:shouldSaveAnnotations:" to allow a more fine-grained control over the saving process.
*  No longer removes unknown views from `PSPDFPageView`. Use `prepareForReuse` to manually clean up if you subclass `PSPDFPageView`.
*  Improves compatibility with embedded PDF files.
*  Ensures that document metadata is preserved after writing annotations or forms.
*  Improves compatibility with annotation or form writing for certain less commonly used PDF subformats.
*  Improves several UI details for iOS 7 legacy mode. (`UIUseLegacyUI` or compiled with SDK 6. This mode is not recommended, but will work.)
*  The `PSPDFGallery` can now display YouTube videos. This will most likely replace `PSPDFYouTubeAnnotationView` in future versions.
*  The XFDF parser can now load images within appearance streams from Adobe Acrobat.
*  Fixes an issue on iOS 6 where the gradient background for the page position label could be too small.
*  Fixes a stability issue on iOS 6 related to `PSPDFBarButtonItem` tint color updating.
*  Fixes an issue that prevented to hide the thumbnail bar in `PSPDFThumbnailBarModeScrollable` unless `PSPDFHUDViewAnimationSlide` was also set.
*  Fixes some tiny memory leaks on error situations.
*  Fixes an issue related to re-using `PSPDFSearchViewController`. Thus only happened in custom code, as PSPDFKit recreates this controller as needed.
*  Fixes an issue where subclasses of `PSPDFFileAnnotationProvider` could encounter immutable objects where mutable objects were expected.
*  Fixes a stability issue related to autodetecting link types.
*  Fixes an issue related to exporting appearance streams via XFDF.
*  Fixes an issue where image stamp annotations in rotated documents could have an incorrect transform applied when saved via `PSPDFProcessor`.

### 3.5.0 - 10 Feb 2014

_See the [announcement post](https://pspdfkit.com/blog/2014/pspdfkit-ios-3-5/)._

*  API: The `PSPDFAnnotationToolbar` has been modularized and all state related code is now in `PSPDFAnnotationStateManager`, which is a property of `PSPDFViewController`.
   You might have to update your subclasses to reflect these changes. `PSPDFAnnotationStateManager` should now be used instead of a headless `PSPDFAnnotationToolbar` if you have your own toolbar.
*  New unified setBoundingBox:transform: method on `PSPDFAnnotation`. Adds a helper that transforms the font size on resizing.
*  The Inspector is now sticky and will update itself for the new annotation if one is tapped while the inspector is visible. This simplifies editing and saves some taps.
*  Various smaller animation tweaks.
*  The `PSPDFGallery` now shows the already fetched parts of a video in the progress bar.
*  Bookmarks now use the pageLabel, if one exists, instead of the logical page number.
*  Embedding YouTube objects now support parameters in the URLs.
*  Better handling of exporting annotations into rotated PDF pages via `PSPDFProcessor`.
*  Improves several cases where phone numbers were not correctly detected before. (`PSPDFTextCheckingTypePhoneNumber`)
*  Correctly displays border for forms that define the border color in the MK dictionary.
*  Adds initial support for text field form validation. (Currently, `AFNumber_Format` is supported.)
*  Adds limited support for drawing rich (formatted) free text annotations on iOS 7. Editing will convert them into plain text annotations.
*  Greatly improves XFDF support for complex PDF Forms, now better matches the output of Acrobat.
*  Fixes an issue that could reset the ink annotation width to 1.
*  Fixes a crash when processing certain sound annotations using PSPDFProcessor.
*  Fixes an issue where tapping into the page when the half modal controller on iPhone was visible could result in a different selected annotation than tapped.
*  Fixes an issue that didn't correctly update the thumbnails when bookmarks were added/removed while displaying the grid.
*  Fixes an issue that could show the signature selector controller when adding the first signature on iPhone only.
*  Fixes an issue where the document label could be visible even though documentLabelEnabled was set to NO.

### 3.4.6 - 1 Feb 2014

This patch release includes various form related improvements, especially hardware keyboard support and performance tweaks for very complex forms.

*  Tap-to-zoom now starts rendering the page instantly; this improves render performance quite a bit.
*  Visual improvements for the form choice view controller.
*  Multiline Form Text Fields are now vertically aligned to the top.
*  Editable choice form elements now show touch down feedback and keep the keyboard for easier switching on iPad.
*  Long-Pressing on form elements will no longer cancel the tap action.
*  Form elements can now be navigated with a hardware keyboard via the arrow keys and escape/space/enter. (iOS 7 only)
*  Form navigation with prev/next now includes choice form elements, and the value can be toggle with the space bar.
*  Ensures that stamps never draw text outside their boundaries.
*  Render/Update performance for pages with many annotations has been greatly improved.
*  When using the `PSPDFAnnotationTableViewController`, form elements are not only selected but also brought into edit mode.
*  Improves support for file:// links if linkAction is not set to PSPDFLinkActionInlineBrowser.
*  Tweaks link type autodetection to work better on certain types of documents.
*  Expose the completion handler for `UIActivityViewController` inside `PSPDFActivityBarButtonItem`.
*  API: Remove long press support for bar button items. This was only used for the bookmark button and already defaulted to NO.
*  `PSPDFPageView` now sends a `PSPDFPageViewSelectedAnnotationsDidChangeNotification` notification each time the `selectedAnnotations` property changes.
*  Erasing is now faster with custom annotation providers, as change notifications are now queued and sent on touch end events only.
*  Fixes an issue that could hide the outline bar button in cases where annotations were in the document but no outline.
*  Fixes a potential use-after-free when a form with a editable choice field was edited on iPhone and then dismissed via the input accessory view on iOS 7.
*  Fixes an issue where certain form checkboxes were not checked if appearance streams were missing from the PDF.
*  Fixes an issue where form buttons with named actions sometimes failed to change the page.
*  Fixes an issue where saving certain form objects could hide these form objects in Acrobat.
*  Fixes an issue where manual bookmark reordering wasn't saved in some situations.
*  Fixes a rare recursion issue on iOS 6 when using the old toggle-style for the viewMode bar button item.
*  Fixes an issue where the bookmark bar button not always reflected the actual bookmark state.
*  Fixes a potential over-release with certain rarely used CMaps definitions that include other CMaps.

### 3.4.5 - 24 Jan 2014

*  Better handles resizing for rotated stamps.
*  The Open In... activity is now displayed for NSData-based documents.
*  Improve availability filtering for the `PSPDFOutlineBarButtonItem`, no longer presents an empty controller if no content is available.
*  Small localization updates.
*  Improve XFDF action writing for non-standard types like GoToR.
*  Improvements to word/new line detection in the text parser for certain documents.
*  Improves rendering performance, especially for more complex PDF forms.
*  Form updates are now more snappy and no longer animate.
*  Various smaller improvements for the inline web view. (`PSPDFWebAnnotationView`)
*  Fixes an issue where annotations could end up at a different location when rotated documents were re-saved using `PSPDFProcessor`.
*  Fixes an issue where `viewControllers` of the `PSPDFContainerViewController` could return nil.
*  Fixes an issue where annotations saved via `PSPDFProcessor` could end up on a different page.
*  Fixes an issue where the target page of a document/page action sometimes wasn't correctly saved when using the XFDF format.

### 3.4.4 - 22 Jan 2014

*  Add support for Embedded PDF Files (see http://blogs.adobe.com/insidepdf/2010/11/pdf-file-attachments.html)
*  The `PSPDFGallery` now shows an AirPlay button if AirPlay sources are available.
*  Stamp annotations no longer have distorted text.
*  Update OpenSSL to OpenSSL 1.0.1f.
*  Forms: Checkboxes with the same name and parent form a mutually exclusive group.
*  `zoomToRect:page:animated:` now honors the `animated` option and compensates for the x/y origin depending on the scroll direction for `PSPDFPageTransitionScrollContinuous`.
*  Fixes an regression in the annotation toolbar related to tap handling.
*  Fixes an issue where the `PSPDFOutlineViewController` could display stale data if the outline is complex and documents are switched before the outline parsing operation was done. This basically only happened if the controller was displayed as a side-bar, not when in a popover or modal.

### 3.4.3 - 21 Jan 2014

*  Code updated to be warning-free with iOS 7.1b4 and Xcode 5.1b4.
*  Extracted all possible `PSPDFMenuItem` identifiers to `PSPDFPageView`.
*  `PSPDFProcessor`'s `generatePDFFromURL:` and `generatePDFFromHTMLString:` methods now support embedding annotations if set via the options dictionary.
*  `PSPDFMultiDocumentViewController` no longer tries to persist NSData- or CGDataProviderRef-based documents. Only file-based documents are persisted between sessions.
*  Improves search animation for the `PSPDFOutlineViewController`.
*  Various small localization updates.
*  API: `PSPDFProcessor`'s generatePDFFromHTMLString: methods have gained a new error parameter.
*  API: `PSPDFAESDecryptor`'s init methods have gained a new error parameter.
*  Fixes a regression where two-finger-scrolling in highlight mode no longer worked.
*  Fixes a rare timing issue where a mutation error could be thrown if reloadData is called within page loading delegate methods.
*  Fixes an issue where exported annotation via the share sheet could end up on different pages if a document with multiple provider sources is used.

### 3.4.2 - 19 Jan 2014

*  Improved defaults for the status bar and the activity controller.
*  The document and page label now use blur on iOS 7.
*  Full-page-ads with links now no longer highlight the whole page.
*  The bookmark activity now shows the current bookmarked state.
*  The thumbnail cells use the active tintColor on iOS 7 as their selection border color.
*  New property to control if the HUD should be visible on viewWillAppear. (`shouldShowHUDOnViewWillAppear:`)
*  Slightly darker default background for the `PSPDFViewController` on iOS 7.
*  Fixes an regression with the loupe view and UIInterfaceOrientationLandscapeLeft.
*  Fixes an issue where annotations could be missing when exporting single pages that are backed by XFDF via email.
*  Fixes an issue where the internal web browser wasn't correctly dismissed when an App Store link was detected.
*  Fixes an issue where the contentInset could become too large when using the `PSPDFStampViewController`.

### 3.4.1 - 18 Jan 2014

*  Fixes an issue with UIActivityViewController on iOS 7.1b3.

### 3.4.0 - 18 Jan 2014

_See the [announcement post](https://pspdfkit.com/blog/2014/pspdfkit-ios-3-4/)._

*  The `PSPDFVideoAnnotationView` has been completely removed as the new `PSPDFGallery` takes over all of this functionality.
   PSPDFKit finally supports playback of multiple videos and/or audio tracks at the same time. (The total number of concurrent video streams is hardware dependent and is usually 4)
*  Ink annotations can now be merged via the multiselect tool. This will discard all different styles and use the style of the first object if used.
*  Various annotation changes and page updates are now animated (most visible when using undo/redo).
*  Various improvements and fixes for PDF Forms.
*  Improves the activity bar button item, actions will forward to the bar button items if possible.
*  The annotation toolbar will now attempt to merge highlights if they overlay each other and have the same color.
*  Improves hit testing for smaller annotation types like note annotations.
*  The `PSPDFPrintBarButtonItem` now uses the `PSPDFDocumentSharingViewController` to make it consistent with the Email and Open In action and thus has also new option parameters. (API-Change). This now allows printing the annotation summary.
*  The annotation summary now generates an attributed string when printing or sending via email.
*  Add `PSPDFAnnotationIgnoreNoteIndicatorIconKey` to optionally disable the note indicator rendering.
*  Improves support for links to different documents via URI action type.
*  Adding a signature will now make it smaller and more appropriate for large documents.
*  The `PSPDFSignatureSelectorViewController` is now stateful, has a minimum size and will show "No Signatures" if the last signature was deleted while being open.
*  The use of the outline in the search preview is now configurable via `useOutlineForPageNames` in the `PSPDFSearchViewController`. It defaults to YES.
*  New iPhone popover controller that better fits into iOS 7.
*  The annotation type image in the annotation table view is now colored in the same color as the annotation itself.
*  Adds a workaround for an issue where iOS would change the status bar when showing an UIAlertView without setting it back to the previous setting.
*  Exposes `filteredPagesForType:` to customize what the thumbnail controller displays, and increases the touch target of the thumbnail filter.
*  Fixes an issue when certain annotation types were manually overridden to be displayed as overlay, they could be initially visible until moved on page load.
*  Fixes an UI regression where the `PSPDFProgressHUD` would be rotated wrongly on device rotation.
*  Fixes an issue where YouTube videos were no longer being paused automatically in iOS 7 when in thumbnail mode.
*  Fixes a timing issue when multiple galleries were loaded at a page on the same time.
*  Fixes an issue in `PSPDFTabbedViewController` that could move pages off center when using iOS 7 when the HUD fades out.
*  Fixes an issue with embedding forms into documents with a invalid trailer ID.
*  Fixes an issue where dismissing the half-modal form choice picker could dismiss the current view controller on the iPhone.
*  Fixes an issue with extracting font glyph rect data, especially for CJK documents that use 'usecmap' to link to other CMaps.
*  Fixes a potential assertion in the text parser with certain malformed PDF documents that have invalid font descriptors.
   PSPDFKit will now try to extract as much as possible and not assert, even if the document is partly broken or contains invalid descriptors or font references.

### 3.3.5 - 9 Jan 2014

*  The gallery now supports more options like autostart, cover views or control customizations.
*  Improved the `highlightedString` feature by narrowing down the target rect. Reduces the chance to extract text above/below the marked text.
*  The render activity view now has a slight delay and animates in and out, making it less disruptive.
*  Extends support for iOS 7 dynamic type to more controls and cells.
*  Localization has been streamlined and requires less entries. If you rely in a specific `identifier` for `PSPDFMenuItem` checks, remove the "..." from the strings.
*  The option view in `PSPDFNoteAnnotationViewController` now uses blur on iOS 7 instead of plain transparency.
*  Adds further workarounds for issues in `UITextView` on iOS 7 which improves caret scrolling and visibility when using external keyboards.
*  The "Clear All" action on `PSPDFAnnotationTableViewController` is now a single undo step instead of one per annotation.
*  Fixes an issue where the redo action of the `PSPDFAnnotationToolbar` would always prefer drawing redos, potentially preferring the wrong actions first.
*  Fixes an issue that blocked moving annotations if they are above a form field.
*  Fixes an issue that could select the wrong annotations when sending a single extracted page from a document via email.

### 3.3.4 - 7 Jan 2014

*  The annotation table view has been redesigned and also shows the creation user and the last modification date, if available.
*  New property: `skipMenuForNoteAnnotationsOnIPad` to control how the note controller is displayed.
*  Update selection style for the saved annotation cells to better match the iOS 7 design.
*  Improves logic for popover resizing of the container controller.
*  Various tweaks to the stamp controller and the text stamp controller. Now adds default date stamps, automatically shows keyboard once the `PSPDFTextStampViewController` appears and more.
*  Various localization updates, including localization for stamps.
*  The `localizedDescription` for PDF Form Fields is now smarter and won't create strings like Button: Button.
*  The `PSPDFAnnotationToolbar` has a new `backButtonItem` hook to replace the default "Done" back button.
*  Some more icon tweaks: delete now better fits into the iOS 7 `UIMenuController` and sound now is a microphone instead of a note.
*  Fixes an issue with saving custom pspdfkit:// prefixed links via the XFDF provider.

### 3.3.3 - 6 Jan 2014

*  Re-enables the Clear button in the new `PSPDFFreeTextAccessoryView` after text has been changed.
*  Don't show the ".pdf" file ending in the `PSPDFDocumentPickerController`.
*  The inspector now repositions itself if the annotation changes the `boundingBox`.
*  Saving annotations into the PDF has been optimized and creates a smaller PDF.
*  Form objects no longer are deletable when using the `PSPDFAnnotationTableViewController` but will be cleared instead.
*  API: Removed PSPDFInitialAnnotationLoadDelay. This is no longer a performance problem and has thus been removed and optimized.
*  Improves styling in `PSPDFWebViewController` for iOS 6 when the navigation bar style is dark.
*  The activity button in `PSPDFWebViewController` is now always enabled, not only after the page finished loading.
*  `PSPDFWebViewController` now offers to load the page in Google Chrome, if installed.
*  Fixes an UI issue where the document title label could be offset under iOS 7/iPhone if the HUD was hidden when a modal VC is invoked.
*  Fixes an issue that prevented forms from saving correctly when saved via the Send via Email/Open In feature from a readonly source.
*  Fixes multiple issues with building/preserving the appearance string for certain PDF form elements.

### 3.3.2 - 4 Jan 2014

*  Adds new accessory view for free text annotations to quickly access the inspector.
*  The font size in `PSPDFNoteAnnotationViewController` now adapts to iOS 7 content size.
*  The gradient calculation used in `PSPDFNoteAnnotationViewController` now simply returns a default yellow if the base is white.
*  The delete note icon in `PSPDFNoteAnnotationViewController` is now dynamically enabled/disabled depending if there's text in the `UITextView`.
*  Improves the animation and various design details in `PSPDFSearchViewController`, especially on iOS 7.
*  Improves the annotation summary to now repeat type and description if that's the same. (Ink, Ink)
*  Various smaller design updates for the annotation inspector.
*  API Update: `generatePDFFromDocument:` now accepts `pageRanges` as NSArray, which enables easy re-ordering of document pages (compared to a single NSIndexSet)
*  Fixes an UI issue where the text view wouldn't properly adapt in `PSPDFNoteAnnotationViewController` on iPhone.
*  Fixes an UI issue where the "No Bookmarks" label could be not exactly centered on first load.
*  Fixes an issue where the annotation bar button item would be disabled with `PSPDFAnnotationSaveModeExternalFile`.
*  Fixes an issue where the document sharing controller would sometimes not extract pages out of the PDF if only a subset of the pages are selected.
*  Fixes an issue where wrong options could end up being used if `PSPDFDocumentSharingViewController` was preconfigured so it is invoked without showing the UI.

### 3.3.1 - 2 Jan 2014

*  PSPDFKit now displays note indicators for annotations with note content.
*  Annotations that can't be erased are no longer hidden while in erase mode.
*  The view controller order in `PSPDFOutlineBarButtonItem` and in `PSPDFThumbnailViewController` has been changed - bookmark is now the last entry.
*  PSPDFSearchViewController now has support for custom scopes with a new optional delegate method.
*  On iOS 7 we now support `shouldAutomaticallyAdjustScrollViewInsets` with `PSPDFPageTransitionScrollContinuous` & `PSPDFScrollDirectionVertical`.
*  The scroll-to-top feature when the status bar is tapped no longer breaks when showing/hiding the thumbnail controller.
*  Fixes an issue with glyph position calculation for certain rotated documents that had a non-nil origin.
*  Fixes an issue that prevented linking the precompiled PSPDFKit.framework with Xcode 4.6.
*  Fixes a timing issue where the annotation menu wasn't always displayed wen selecting an annotation via the `PSPDFAnnotationTableViewController` on iPhone.
*  Fixes a small issue where the `PSPDFNoteAnnotationViewController` could fail to show the keyboard when presented manually with a certain timing.
*  Fixes an issue that could have kept a total 1-2 instances of `PSPDFPageView` around, even when the `PSPDFViewController` was deallocated.
*  Fixes a potential retain cycle in the `PSPDFDocumentSharingViewController` on iOS 7.

### 3.3.0 - 29 Dec 2013

_See the [announcement post](https://pspdfkit.com/blog/2013/pspdfkit-ios-3-3/)._

Happy holidays!

PSPDFKit now requires iOS 6+ and Xcode 5. Keep using PSPDFKit 3.2.x if you're still building with Xcode 4.6 or need to support iOS 5.
Apple will enforce usage of Xcode 5 starting February 1st. (https://developer.apple.com/news/index.php?id=12172013a)
Removing iOS 5 resulted in deleting almost 10.000 lines of code - which will give you a smaller, faster and more efficient binary.

The binary is now again fully universal including armv7, armv7s, arm64, i386 and x86_64.
The separate iOS 7 only (64 bit) library variant has been removed.

PSPDFKit Complete now supports PDF form signature validation and thus links with OpenSSL.
There is an optional build without OpenSSL that disables these cryptographic signature checks.

*  Localization! PSPDFKit now ships with English, Chinese, Korean, Japanese, French, Spanish, Russian, Italian, Danish, German, Portuguese and Brazilian Portuguese.
*  Adds preliminary compatibility with Xcode 5.1 and iOS 7.1b2.
*  Refreshed visuals for both iOS 6 and iOS 7. The icons are now much more polished and can be better customized.
   The remaining icons that were drawn in code are now all inside the PSPDFKit.bundle.
*  PSPDFKit Complete/Enterprise can now validate cryptographic signatures (unless you use the build without OpenSSL)
*  `PSPDFAESCryptoDataProvider` now supports the popular RNCryptor data format: https://github.com/rnapier/RNCryptor/wiki/Data-Format (It autodetects the legacy format and supports that as well)
*  Finally fully supports the new `UIViewControllerBasedStatusBarAppearance`. (we now support both modes in iOS 7)
*  The `PSPDFAnnotationToolbar` now displays the style picker for text markup annotations (highlights).
*  The `PSPDFGalleryViewController` now supports local/remote video and audio files next to images.
*  The internal `PSPDFWebViewController` now shows a progress bar, much like Safari on iOS 7.
*  Improves automatic font resizing for single line text field form entries.
*  Improved support for `additionalActions` and `nextAction` to add actions to all annotation types.
*  API Change: `PSPDFTextSelectionMenuActionWikipediaAsFallback` has been renamed to `PSPDFTextSelectionMenuActionWikipedia`. Since checking for a word in `UIReferenceLibraryViewController` can be unpredictably slow as of iOS 7.0.3, we had to remove this feature. `Define` will now always be displayed and you can optionally enable Wikipedia as well. The new default will omit Wikipedia by default.
*  Don't show the `PSPDFWebViewController` bottom toolbar on iPhone if there are no `availableActions` defined.
*  Allow detection for a PSPDFKit signature and blocks the "Copy" feature if detected. Will also be saved into the PDF as proprietary extension.
*  If there's no signature saved and customer signature is disabled, we'll show the new signature controller instantly.
*  Adds a new property: `shouldCacheThumbnails` to suppress thumbnail cache generation.
*  Adds a new property: `shouldHideHUDOnPageChange` to fine-tine when the HUD is hidden.
*  Highlight etc is no longer offered on text selection if the document can't be saved.
*  Improves Form Element description in the annotation table view.
*  Allow "Clear Field" for Choice Form Elements with editable text.
*  Improve support for hidden form elements or choices that are neither editable nor have options.
*  Add hitTestRectForPoint: on `PSPDFPageView` to allow customization of the rect that is used for tap hit testing to select annotations.
*  Make document parsing more robust to allow dealing with files that have incorrect XRef tables.
*  The text selection handles now have the proper hit test size when zoomed in - improves your ability to interact with other content.
*  YouTube: Add support for http://youtu.be short-form URLs for embedding.
*  The note icon name is now properly serialized when using the XFDF annotation provider.
*  The XFDF provider now only saves if an annotation is changed. Deserialized annotations are set to be not dirty by default now.
*  Annotation and outline classes have been optimized to require less memory and reuse more objects internally.
*  Lots of code cleaning, improved documentation and some reorganization. The binary is now smaller and compiles faster.
*  Moves document parsing to a background thread, improves initial startup time for complex, large documents.
*  GoToR actions with target named destinations are now supported.
*  FreeText annotations are now correctly rendered and displayed even when their bounding box is too small for the text.
*  Audio recordings can now be time limited and the default encoding/bitrate can be customized in `PSPDFAudioHelper`.
*  The default set of stamps is now localizable and localized by default.
*  The Edit button in the annotation table view controller and the bookmark controller is now only enabled if there is content, and edit mode is automatically disabled when there's no more content.
*  Improved touch handling when resizing/moving annotations.
*  Fixes an UX issue that wouldn't deselect the current toolbar state if a saved signature is added via the annotation toolbar while `customerSignatureFeatureEnabled` is disabled in the signature store.
*  Page scroll animations are reduced to allow faster navigation.
*  Annotation overlay views are now loaded and added to the view hierarchy as soon as the page is set up, removing the previous delay that was especially noticeable with note annotations.
*  No longer shows the bounding box when selecting/resizing line annotations.
*  The undo/redo stack is now consolidated - no more difference or disabled undo while in drawing mode.
*  Properly coordinate print controller popover to close when other popovers are activated.
*  Use blurry background for UIPopoverController in the stamp section.
*  The annotation creation menu now only shows the most important annotation types; customize via `createAnnotationMenuTypes` in the `PSPDFViewController`.
*  Removes the IDNSDK to get a smaller binary.
*  When saving text form elements, the AP stream is now included in the PDF. This fixes issues with Acrobat where the content would only be visible when the text field is active.
*  Fixes a rare crash in (poly)line point calculation if the points are on top of each other.
*  Fixes an edge case where the text field would loose focus after the note annotation controller has been dismissed because of tapping into another text field.
*  Fixes a regression where the selected annotation for multiple potentials was reversed.
*  Fixes an issue where annotations with appearance stream could be rendered at the wrong position and/or size.
*  Fixes an issue where annotations could be returned from the last page when forms are in the document, even if a different page was requested.
*  Fixes an issue with the label parser when encountering offset pages.
*  Fixes an issue where when trying to copy a webpage link in the internal web browser, the system could throw a `NSInvalidArgumentException` if the link was nil.

### 3.2.3 - 28 Nov 2013

*  Improves custom text stamp creation layout and fixes an issue where the text wasn't always displayed within the table view.
*  Form text fields are now no longer clipped when the zoom scale is very low.
*  Border on a form is now only rendered when defined so in the dictionary for widget/form annotations.
*  Signatures now use `PSPDFAnnotationStringSignature` as style key, instead of the `PSPDFAnnotationStringInk` that was used before.
*  Improves support with Microsoft Outlook by making sure we always send the .pdf file ending when sharing via email.
*  Any open menus will now be dismissed before PSPDFKit is presenting a popover. This fixes a behavior change in iOS 7 where `UIMenuController` sometimes stayed visible.
*  Choice form elements now have a click-through-able popover and are highlighted when active.
*  Next/Prev now works across multiple pages and also includes choice form elements.
*  The form highlightColor is now a property on PSPDFFormElement and thus configurable.
*  Works around a bug in iOS 7 where the UITextView wouldn't properly scroll to a new line when entering text in a PDF Form.
*  The `PSPDFOutlineViewController` now shows the empty state if the document has no outline set but the controller is still displayed.
*  Improves compatibility with parsing invalid URLs in link actions - will correct more variants.
*  Fixes an issue where certain form choice elements with partial dictionaries could be incorrectly parsed/rendered.
*  Fixes an issue that could prevent form choice elements from being saved correctly back into the PDF.
*  Fixes a rare collection mutation regression when erase mode was active while annotation changes for visible inks were processed.
*  Fixes an issue where `allAnnotationsOfType:` sometimes could miss certain annotations when an internal save file was used.
*  Fixes an regression where `hasDirtyAnnotations` could report YES when we really don't have any unsaved changes.
*  Fixes some localization issues with line endings in the Inspector.

### 3.2.2 - 24 Nov 2013

*  The gallery now allows image zooming when in full screen and requires less memory when loading remote images.
*  The gallery is now more customizable, allows custom background colors and recognizes @2x images when they are local.
*  The `PSPDFDocumentSharingViewController` will now use a temporary directory to save annotations into the PDF if it's in a non-writable location.
*  The password view now automatically shows the keyboard.
*  If annotations can't be embedded, the new annotation menu will not be displayed anymore (to be consistent with the `PSPDFAnnotationBarButtonItem`)
*  The runtime now better deals with multiple annotation subclasses that both change the behavior of a parent class. Use `overrideClass:withClass:` on `PSPDFDocument` to register such subclasses.
*  Set the default ink line width to 3, unless a default is already set.
*  Using undo/redo while in eraser mode will now also allow adding/removing of ink annotations.
*  The undo system will now commit expired actions that are coalesced. This fixes an issue where certain actions would appear undo-able quite late (e.g. first erase action)
*  If the named destination of a link can't be resolved we will ignore the action and no longer scroll to page 0.
*  Improve selection contrast in the `PSPDFAnnotationToolbar`.
*  The `PSPDFSearchResult` class is now immutable and has a new initializer for creation.
*  `PSPDFSearchViewController` now supports iOS 7 dynamic font size and allows a multi-line text preview. The new default are two lines instead of one.
*  Various warning/error messages are now printed with the code location instead of a generic PSPDFError trace.
*  Annotation management now uses equality checks instead of memory-based checks, this makes the code more robust when objects are recreated in the annotation providers.
*  Text field form elements now resize as we are typing and better render multi-lined text.
*  PDF Signature Form elements are now tappable and will offer to add a ink annotation as signature.
*  API change: Renamed `showNewSignatureMenuAtPoint:animated:` with `showNewSignatureMenuAtRect:animated:`. Use a rect with size zero to get the previous behavior.
*  API: Some subclassing hooks that have been declared but weren't called have been properly removed.
*  Undo/Redo is disabled by default on old devices to improve performance. (Notably, the iPad 1 with iOS 5.)
*  Improves error handling for corrupt or missing PDFs.
*  Using the HSV color picker while brightness is set all the way to 0% (black) will do the smart thing to switch to the pure color with 100% brightness.
*  Fixes an issue where ink annotations could change position for PDF documents with non-nil origin points.
*  Fixes an issue where some text in form elements could render incorrectly when the page was rotated.
*  Fixes a potential recursion when parsing malformed documents.
*  Fixes an issue where `annotationsFromDetectingLinkTypes:` could throw an exception if a page returns nil as body text. (e.g. corrupt or password protected files)
*  Fixes an issue where the gallery component could throw an `UIViewControllerHierarchyInconsistency` when used in combination with `PSPDFPageTransitionCurl`.
*  Fixes an issue where we incorrectly detected a regular password protection as custom encryption filter.

### 3.2.1 - 13 Nov 2013

*  Improved a few cases where the `PSPDFDocumentSharingViewController` was displayed with practically no options to choose.
*  Improves the thumbnail <-> page(s) animation so it even looks great when the thumbnail button is toggled really fast.
*  The `PSPDFNoteAnnotationViewController` no longer shows the 'copy' button by default, the toolbar looked too cramped.
*  Fixes an issue with UID generation when the document isn't inside the app bundle.
*  Fixes an issue where larger XFDF ink annotations could degrade when being parsed.
*  Fixes an issue where the initial call for `annotationsForPage:` in the `PSPDFXFDFAnnotationProvider` could return an empty array.
*  Fixes an issue with UIKit legacy mode and the `PSPDFAnnoationToolbar` in certain setups.
*  Fixes an issue where 'Finish Recording' on sound annotations wouldn't work if the recording was still active but currently paused.
*  Fixes an rare issue with writing annotations if inline UTF-16 (the special Adobe flavor) is used within the `/Pages` root object.
*  Titanium: Exposes `printOptions`, `sendOptions` and `openInOptions` from the corresponding `PSPDF*BarButtonItems`.

### 3.2.0 - 10 Nov 2013

*  Lots of improvements around sound annotations! Serialization, better selection, context menus, customization.
*  `PSPDFAnnotationTableViewController`: Dynamically calculate cell height and show multiple lines of description per cell.
*  YouTube and Web views now automatically reload themselves when a reachability change is detected.
*  Long-Pressing on text markup will now allow text selection and not select the markup (highlight) annotation. This enables sub-selection of text that is already selected in another way.
*  Greatly improves handling of (rotated) FreeText annotations and rotated pages.
*  The search bar is now attached to the top on iPhone, to better match iOS 7 style.
*  Rendered images are now more more likely to be cached to disk, resulting in less work overall.
*  Improves thumbnail scroll performance, especially on the iPad 1.
*  Improvements to the text parser, now can parse another category of documents that use Font Programs to define their glyphs.
*  Form Check Box Elements now render the AP stream by default and fall back to internal rendering if no stream was found.
*  Form background colors are now dynamically parsed and displayed instead of the default light blue.
*  Improves support for various Forms that define the form element across multiple objects.
*  Improves the touch-down-highlight for form elements.
*  Allows overriding of `PSPDFTextSelectionView`.
*  Improves text extraction for highlight annotations when there are multiple overlapping rects.
*  Fixes an issue where the text selection wasn't properly updated on rotation.
*  Fixes a potential deadlock when async saving was called manually while the view controller was popped from the screen which also invokes a save.
*  Fixes an issue where the tab controls of `PSPDFTabbedViewController` wouldn't respect the `minTabWidth` property.
*  Fixes an issue with rendering annotations with overlapping fill-areas in UIKit legacy mode.
*  Fixes an issue where certain `UIActionSheets` on iOS 6 could be mis-placed.
*  Fixes an issue with getting images for iOS 6 when the PSPDFKit.bundle is in a non-standard location.
*  Fixes a potential exception when a PDF contained an annotation with a malformed bounding box.
*  Fixes a potential exception when a free text annotation of size zero was created and subsequently edited.
*  Fixes an issue with saving annotation in certain documents that previously produced warnings.
*  Fixes a potential crash when loading annotations from the disk store while a save filter is active.
*  Fixes an issue where under rare conditions flattened notes could be rendered mirrored.
*  Fixes a rare condition where the cache could get into a state where it no longer pre-renders document pages.
*  Titanium: The plugin is now simply named `com.pspdfkit` (from `com.pspdfkit.source`)
*  Titanium: editableAnnotationTypes can now be set in `documentOptions`.

### 3.1.4 - 3 Nov 2013

*  Improves rendering of line endings in the selected state.
*  Don't show an "external application" dialog if our own app responds to the URL scheme in question.
*  The PSPDFGallery can now better deal with a single image and will auto-generate the appropriate manifest if a PSPDFLinkAnnotation points to the image.
*  Allows overriding of PSPDFColorSelectionViewController from within the inspector.
*  Allows fine-tuning of the dictionary lookup via PSPDFTextSelectionView's new dictionaryHasDefinitionForTerm: method.
*  Enabling/Disabling the eraser feature no longer flickers the ink annotations.
*  The eraser now respects alpha settings of the ink annotations.
*  While erasing, Undo/Redo now work as expected.
*  Special-cased clearColor for the `fillColor` annotation property when using PSPDFStyleManager. (fill can't have alpha; so previously this would give you a black fill - now it's transparent)
*  Allow parsing for less common color definitions in appearance strings (k and g)
*  Forms: Don't draw background when we have an AP stream for form buttons.
*  Forms: Buttons that define an AP-Stream no longer also have a blue background.
*  Forms: Buttons(Check boxes, radio buttons) now show a touch-down state when tapping them.
*  Forms: No longer flickers when the element is deselected.
*  Fixes a potential crash in the selection view when we select a free text annotation with zero width.
*  Fixes an infinite loop when searching certain characters.

### 3.1.3 - 24 Oct 2013

*  PSPDFKit now requires the CoreTelephony.framework (this will be added automatically if you use the PSPDFKit.xcconfig file)
*  The `autodetectTextLinkTypes` feature is now faster and will detect more types of phone numbers and URLs, including those that contain spaces/newlines between them.
*  Pressing the delete icon in the note annotation controller will only clear the note, except for note annotations where it will delete the whole annotation.
*  Adds a versioning system for PSPDFKit.bundle. Make sure you always use the bundle we ship with PSPDFKit.
*  Adds a boxRect:forPage:error: method to PSPDFDocument to easily get a different box rect for the defined page.
*  Gallery now supports animated GIFs and downloads images even when the app is in background.
*  Improves default header color for the mail view controller.
*  Fixes an issue where the bounding box for FreeText annotation could be too long when they are edited while zoomed in on iOS 7.
*  Fixes an issue where "Inspector..." was displayed for non-editable annotation types.
*  Fixes an issue where "Clear All" deleted all annotations, even those not displayed in the annotation table view.
*  Fixes an issue where flattened note annotations would sometimes be drawn rotated on rotated documents.
*  Fixes an issue where Free Text annotations added from the toolbar could end up being rotated on rotated documents.
*  Fixes a very rare over-release of a PSPDFPageView object when lots of PSPDFViewControllers are rapidly created/destroyed. (you should always reuse this heavyweight object)

### 3.1.2 - 21 Oct 2013

*  Faster scrolling, new default page rendering strategy: `PSPDFPageRenderingModeThumbnailIfInMemoryThenFullPage`
*  Improves text selection drawing and text selection menu placing. The few cases where the menu could overlap the selection have been fixed.
*  Add more sophisticated warnings if the PSPDFKit.bundle is missing.
*  PSPDFViewController will now auto-save annotations when the view is dismissed while contained in a child view controller.
*  Add `verticalTextAlignment` to `PSPDFFreeTextAnnotation`. This is not defined in the PDF spec; so it will be a code-only option for now. PSPDFKit will save this into the PDF as a proprietary extension.
*  Fixes an issue with single page documents, forced two-page-mode and pageCurl.
*  Fixes an issue where under certain conditions the navigationBar was not displayed initially.

### 3.1.1 - 19 Oct 2013

*  Restores compatibility when compiling with Xcode 4.6.
*  Various smaller improvements to the new image gallery.
*  Various smaller performance improvements, moved some more work off the main thread.
*  API cleanup for PSPDFDocumentProvider.
*  No longer blocks the UI when annotations are still loading during a touchDown event.
*  Fixes an UX issue where dismissing the activity popover in the web view controller via a touch on the dimming view sometimes required a second touch on the action button to re-show.
*  Fixes an issue when adding annotation views for invalid rects.

### 3.1.0 - 18 Oct 2013

*  Brand-new image gallery (define a region in the pdf to be covered by a smooth gallery). Allows configuration via inline-pdf or external JSON.
*  Use menu-based annotation manipulation for text markup annotations.
*  The way how the document UID is generated has been changed. Previously, for files it used the full app path. However since the app UID could change after an upgrade, we had to change this behavior. This is only important if you used bookmarks or allowed annotations saving into the internal storage - not for embedded annotation data. Set the global variable `PSPDFUseLegacyUIDGenerationMethod` to YES to continue using the old path. Those files are in Library/PrivateDocuments. You might want to write a custom migration step to rename the custom data paths from the old UID to the new UID system. The `PSPDFUseLegacyUIDGenerationMethod` can be changed at any time to switch between old and new UID (generate a new PSPDFDocument instance to force UID regeneration).
*  The file-based annotation backing store by default no longer saves link annotations but instead merges the saved annotations and the links from the file. This improves performance for PDFs that have lots of internal links (our current way of saving starts to get slow once there are more than 10.000 objects). In most cases, you don't need to care and your save file will be migrated automatically. If you rely on custom link annotations being saved/deleted, you need to set the new `saveableTypes` property of the fileAnnotationProvider back to the old default `PSPDFAnnotationTypeAll`.
*  The undo/redo buttons are now updated immediately after adding annotations.
*  The interactivePopGesture (new on iOS 7) is now disabled while we're drawing to prevent accidental usage.
*  The PSPDFViewController will now properly clean up state from the annotation creation when dropped from user code while the toolbar is in drawing mode.
*  The outline controller now properly shows page destinations above page 10.000.
*  Hides a harmless log warning when PSPDFKit tried to render an annotation with an empty width/height.
*  When undo is disabled, the undo/redo buttons are now properly hidden when leaving the drawing mode.
*  No longer draws the arrow when flattening choice form elements.
*  Restores sound annotations that were added via the pspdfkit:// protocol.
*  Improves compatibility with UIViewControllerBasedStatusBarAppearance. (ongoing project, still not recommended.)
*  Greatly improves scrolling performance with large outline tables.
*  Fixes placement of the search bar in the outline controller.
*  Fixes a crash when pressing undo while adding free text annotations.
*  Fixes a call to a not implemented method in the file annotation provider when manually replacing annotations.
*  Fixes a crash in arm64 when parsing certain malformed PDF documents.
*  Fixes an issue where the password view wasn't correctly updated when the document was changed while it was displayed.
*  Fixes an issue where one could get stuck in the eraser mode when choosing it from the toolbar when that one was displayed via the long-press annotation menu.
*  Fixes a timing issue where the text parsing could crash in rare cases.
*  Fixes an off-by-one error that could cut off long lists of ink points when parsing XFDF files.

### 3.0.11 - 10 Oct 2013

*  Fixes another issue related to UISearchDisplayController and iOS 6/7.

### 3.0.10 - 10 Oct 2013

*  The search controller header is now sticky on iPhone (especially improves display on iOS 7)
*  Greatly improves text selection performance when a large number of glyphs is selected.
*  Improves eraser mode - faster, and no longer changes the view port when enabling/disabling.
*  Adds a new convenience method (sortedGlyphs:) when glyphs are manually selected in PSPDFTextSelectionView.
*  Improve various details in the XFDF writer.
*  Allow pspdfkit:// URLs within the PSPDFXFDFAnnotationProvider.
*  Remove confusing search controller animation when it's first presented on iOS 7.
*  Improves outline searching on iOS 7 / iPhone.
*  Various other smaller tweaks related to iOS 7.
*  Don't show the PSPDFDocumentSharingViewController if there are no options available.
*  Ensure the annotation style picker closes when the annotation mode changes.
*  Improves type detection when pspdfkit:// links are used within URLs that have query parameters.
*  Adds a workaround for documents with invalid /Pages structure which previously prevented annotation saving.
*  Add missing localization for "Choose Fill Color".
*  The text selection end handle is now prioritized, makes it easier to extend selection for small text.
*  Fixes an issue where changing the position of a note annotation could fail on the first try.
*  Fixes an issue with calling the didCreateDocumentProviderBlock for multiple files.
*  Fixes a 20-pixel offset in the annotation inspector on iPhone/iOS 7.
*  Fixes updating the thumbnail button state.
*  Fixes an issue when showing the annotation toolbar from the bottom.
*  Fixes an issue where popovers could have a width/height of 0 when presented from a bottom toolbar on iOS 7.
*  Fixes a crash on iOS 5 related to the font picker, rotation and early dismissal.

### 3.0.9 - 4 Oct 2013

*  Greatly improves compatibility with text extraction/search, especially for Chinese/Japanese/Korean fonts.
*  The autosave feature of the PSPDFViewController can now be controller via the 'autosaveEnabled' property. Defaults to YES.
*  Improves the transition between stamps and saved annotations for iOS 7 legacy mode.
*  Hide the downloadable fonts section if there are no fonts to download.
*  Disables an unwanted implicit animation in the annotation style inspector for iOS 7 legacy mode.
*  The "Paste" menu is now more clever and will check if creating the new annotations is allowed before it's displayed instead of failing silently.
*  Re-enables search for the outline controller on iOS 7.
*  Fixes an issue in the PSPDFMultiDocumentViewController when the array of documents was set to nil.
*  Fixes a potential crash when parsing invalid PDFs with AcroForm data.

### 3.0.8 - 2 Oct 2013

*  Use a background task to save annotations when the application enters the background to make sure it finishes before the app gets killed.
*  Thumbnail page label is now re-enabled by default. (Control this via subclassing PSPDFThumbnailGridViewCell and setting the pageLabelEnabled property.)
*  Ensure the status bar is visible if it was originally visible when showing the note view controller on iPhone.
*  Improves various details for the note controller, bookmark controller, annotation controller and outline controller related to iOS 7 tinting.
*  Fixes an issue where saved note annotations sometimes were not correctly removed from the page view until the page was changed.
*  Fixes an issue where ink annotations could end up on the wrong page when using multiple document providers.
*  Fixes an issue that could prevent the grouping menu from appear in the annotation toolbar.
*  Updated some graphics in the PSPDFKit.bundle.

### 3.0.7 - 1 Oct 2013

*  Improves compatibility with resolving named actions.
*  Ensures that the PDF outline is hidden if no page action targets could be resolved.
*  Reenable undo/redo by default.
*  Fixes a tiny memory leak.

### 3.0.6 - 1 Oct 2013

*  Always updates bar button items on a document change. Fixes conditions where a button could be in an disabled state if not used in the main toolbar.
*  The status bar state captured at viewWillAppear is now only restored when the PSPDFVC is popped from the stack, not on every disappear.
*  Makes it easier to disable undo/redo. (new undoEnabled property on PSPDFDocument)
*  Improves error return code when saving annotations.
*  Fixes an issue where unsaved annotations could be lost during an low memory event when using the tabbed view controller.
*  Fixes a potential non-main-thread call while preparing for saving.
*  Fixes an issue with saving certain documents.

### 3.0.5 - 30 Sep 2013

*  Font picker now is searchable and shows downloadable fonts.
*  The eraser UI properties can now be changed via UIAppearance proxies.
*  The form text field update logic is now more clever and won't change form objects if they are only tapped.
*  Improves styling of the mail sharing view controller on iOS 7.
*  Improves interoperability with Objective-C++.
*  Improves support for a white global tintColor on iOS 7. (check boxes are no longer white)
*  Improves spacing for the half-modal annotation style inspector on iPhone/iOS 7.
*  The annotation manager now continues to look into other providers if the previous one returns nil.
*  Prevent a case where the HUD could be hidden while we're in the thumbnail transition.
*  Changes 'basePath' to 'baseURL' to fix an API inconsistency in PSPDFDocument.
*  Creating a large set of PSPDFDocument objects is now much faster (e.g. while using PSPDFDocumentPickerController)
*  Fixes an issue that could prevent saving annotations into certain documents.
*  Fixes an issue where rotating the signature controller would increase the line thickness.
*  Fixes an issue that prevented committing the rename action in the PSPDFBookmarkViewController.
*  Fixes a potential crash related to the annotation selection view.

### 3.0.4 - 25 Sep 2013

*  Further tweaks and changes how tintColor is handled on iOS 7.
*  Improve detection code for checked state of radio/checkboxes in the AcroForm parser.
*  Improve search controller animation.
*  Improve status bar face/slide animations for iOS 7.
*  Better protect the undo controller against mis-use.
*  Add a new option to PSPDFProcessor: PSPDFProcessorStripEmptyPages. This will post-process the HTML-to-PDF result to remove any blank pages there might be.
*  The 'contentView' of the PSPDFViewController is now always above the PDF content and below the HUD.
*  Fixes an issue where the scrollable thumbnail bar could sometimes disappear.
*  Fixes an issue where the changes of a open note annotation where not saved when tapping on the note again while the popover was already visible.
*  Fixes various smaller potential crashes for malformed PDF documents.
*  Removes support for the optional alertViewTintColor (was iOS 5/6 only)

### 3.0.3 - 22 Sep 2013

*  The default PSPDFKit binary is now again compatible with iOS 5. We added a new 64-bit enabled binary for apps that are already iOS 7 exclusive.
*  Greatly improve tintColor handling on iOS 7.
*  Support FDF, XFDF and PDF Form submission methods (next to the existing HTTP)
*  Improves speed for the memory image cache internals.
*  Increase the allowed handle size for the text selection knobs on iOS 7 to make it easier to change the selection.
*  Improves the placement for the page label view on iPhone.
*  Ensure toolbar is set for the PSPDFSavedAnnotationViewController when used standalone.
*  Adds missing localization in various places.
*  Improve animation when a popover resizes on iOS 7.
*  No longer draws the form field background when forms are flattened.
*  Optimized handling of documents that take a huge amount of memory to render.
*  Parsing performance for annotation saving is now up to 3x faster for certain complex documents.
*  Improve `localizedDescription` for form elements.
*  Fixes an issue where the color picker in the half-modal controller on iOS 7 could be sized too small.
*  Fixes an issue where adding annotations could hide the page contents when annotations were added directly to the page dictionary.
*  Fixes an issue where partial label matching was too eager and sometimes picked non-optimal matches.
*  Fixes various rare crashes.

### 3.0.2 - 14 Sep 2013

*  Exposes some additional helpers in PSPDFDocument.
*  Improves the document sharing controller UI for legacy UIKit mode.
*  Improves support for RichMedia extraction of PDF documents created with Adobe XI 11.0.04.
*  Fixes an issue with rotation when annotations are selected.

### 3.0.1 - 13 Sep 2013

*  Fixes an issue with the demo.

### 3.0.0 - 12 Sep 2013

PSPDFKit 3 is a major new milestone with several new features and countless improvements.

Some of the highlights are:

*  Full support for iOS 7, Xcode 5 including new icons and default styles to fully match the new iOS 7 appearance, while also maintaining full backwards compatibility for iOS 5/6.
*  The prebuilt binary is now ready for 64 bit and includes 5 architecture slices: armv7, armv7s, arm64, i386 and x86_64.
*  Support for filling out Adobe AcroForm PDF forms. (PSPDFKit Complete/Enterprise only)
*  Full-Text-Indexed-Search across all available PSPDFDocuments via PSPDFLibrary. (PSPDFKit Complete/Enterprise only)
*  New PSPDFDocumentPickerController for easy selection and search within your documents.
*  Support of the XFDF (XML Forms Data Format) Adobe standard for saving/loading/sharing annotations and forms.
*  Completely redesigned annotation toolbar that groups common annotation types together.
*  New annotation inspector for faster and more convenient annotation editing.
*  Global Undo/Redo for annotation creation/editing.
*  Drawing no longer locks the view, you can scroll and zoom with two fingers without any drawing delay.
*  New PSPDFDocumentSharingViewController to unify annotation flattening from email and open in feature and allow a better page selection.
*  Record and play back sounds from sound annotations (fully compatible with Adobe Acrobat)
*  FreeText annotations autoresize as you type.
*  Squiggly text highlighting.
*  Draw and edit Polygon/Polyline annotations.
*  Stamp annotations are now added aspect ratio correct.
*  Improved PDF generation support in PSPDFProcessor (website/office conversion)
*  Improves handling for very small annotations.
*  Support for non-default locations for PSPDFKit.bundle.
*  The delays for adding/removing annotations has been removed.
*  Link/Widget annotations can now be tapped instantly.
*  The logic for the keyboard avoidance code has been greatly improved.
*  Additional Actions and Action Chains are now properly supported.
*  Supports various new touch actions like Hide, Submit Form, Reset Form and adds support for more Named Actions.
*  Countless performance improvements and bug fixes across the whole framework.

Important! Currently PSPDFKit 3 requires that you set the key UIViewControllerBasedStatusBarAppearance to false in your project Info.plist file. We're working on supporting view controller based status bar appearance in a future update.

Note: Several methods and constants have been updated and renamed to make the API cleaner.
Read the [PSPDFKit 3.0 Migration Guide](https://github.com/PSPDFKit/PSPDFKit-Demo/wiki/PSPDFKit-3.0-Migration-Guide) if you're updating from version 2.

Important: PSPDFKit 3 requires a serial number and will run in demo-mode by default.
Visit https://customers.pspdfkit.com to register your app bundle ID and get the serial.
If you are a PSPDFKit 2 customer with a license that includes a free PSPDFKit 3 update, please contact support@pspdfkit.com with your PET* purchase number to get an invite.

PSPDFKit 3 still supports iOS5, however we plan to drop support for it later this year.
We already see less than 5% usage and expect this number to drop further in the future.

With the release of PSPDFKit 3 we will focus development on this version and won't be able to offer support for version 2 anymore.
Most customers who bought PSPDFKit after January 14th are eligible for a free update,
if your update window is still open (6 months for Binary/Viewer, 12 months for Source/Enterprise)
Contact us with your PET* purchase number (or invoice ID) for details on your status.

### 2.14.22 - 1 Oct 2013

*  Fixes a crash when parsing certain documents with invalid font references.

### 2.14.21 - 12 Sep 2013

*  Adds a workaround for a bug where thumbnail icons could disappear in iOS 7 legacy mode.
*  Ensures we always have a document UID set. Fixes an assert for conditions where this was missing.
*  Fixes a rare crash related to an over-release in certain high-load conditions.
*  Fixes the logic that checks and filters glyphs that are outside of the visible page area.

### 2.14.20 - 29 Aug 2013

Note: This will likely be the last update of PSPDFKit 2. We're very close to release version 3: our next major version.
Try the demo here: http://customers.pspdfkit.com/demo.

*  Fixes an issue where scroll to page doesn't work for zoom levels < 1 in continuous scrolling mode.
*  Fixes an initializer issue in PSPDFOrderedDictionary.
*  Fixes a very rare crash on enqueuing render jobs.

### 2.14.19 - 6 Aug 2013

*  Ensure didShowPageView is called on the initial display of the controller.
*  Ensure we don't create multiple PSPDFMoreBarButtonItems while creating the toolbar.
*  Ensure 'fileName' only ever uses the last path component. Fixes an issue where the full path would be used in the email send feature.
*  Fixes an issue when using the bookmark filter in the thumbnail controller with a `pageRange` filter set.

### 2.14.18 - 28 Jul 2013

*  Fixes an issue with setting certain status bar styles.
*  Fixes a regression that could result in a crash "cannot form weak reference" on iOS5.

### 2.14.17 - 26 Jul 2013

*  Improves memory handling and search performance for very large documents. (> 10.000 pages)
*  Improve URL encoding handling for link annotations, fixing various encoding issues.
*  Fixes an issue where the scrollable thumbnail bar wouldn't properly update when a new document was set.
*  Fixes an exception when the tabs of the container view controller change after being presented (e.g. outline parser detects that there's no outline to show)
*  Fixes a rare crash in PSPDFHighlightAnnotation's highlightedString.

### 2.14.16 - 19 Jul 2013

*  Further improves text extraction performance (faster searching).
*  Enables to subclass PSPDFAnnotationCell in the PSPDFAnnotationTableViewController.
*  Fixes an issue where logging the PSPDFDocumentProvider within dealloc could lead to resurrection.
*  Fixes an issue with managing certain PDF caches.

### 2.14.15 - 12 Jul 2013

*  Allow PSPDFMoreBarButtonItem to be subclassable.
*  Improve text parser compatibility with PDFs that have deeply nested XObject structures.
*  Fixes an issue where font metrics could be too small/too large within XObjects when the font key had the same name between global resources and XObject resources.
*  Fixes an issue where the word boundaries could be off-by-one due to manually inserted spaces at the wrong index.
*  Fixes an issue where annotation views were not properly cached when a different view was returned via the annotationView: delegate.

### 2.14.14 - 2 Jul 2013

*  Improve compatibility of the PSPDFMenuItem image support on iOS7.
*  Fixes a compile issue when the Dropbox SDK is linked in combination with PSPDFKit.
*  Fixes an assert when a link action is long-pressed and no action is set.
*  Fixes an issue when the internal webview receives a NSURLErrorCancelled from an async operation.
*  Fixes an issue when annotation notifications are generated from threads other than main.
*  Fixes a crash in the Titanium proxy for certain link annotation actions.

### 2.14.13 - 27 Jun 2013

*  Fixes an issue where the tab bar views could be placed inside the navigation bar in PSPDFTabbedViewController when rotated without the HUD being visible.
*  Fixes an issue where the thumbnail bar could show stale information when the document changes.
*  Fixes an assertion when an empty action is evaluated through a long-press.
*  Fixes an issue where under certain conditions the note annotation controller could show redundant toolbar buttons.
*  Fixes a potential crash for documents with weird glyph indexes when moving the text selection handles.
*  Fixes a potential recursion crash while supportedInterfaceOrientations is evaluated.
*  Fixes a potential empty context log warning for iOS7.

### 2.14.12 - 24 Jun 2013

*  Improves thumbnail animations on device rotation.
*  Improves the efficiency of the memory cache.
*  When adding an image and the size picker is dismissed on iPad, we now use high quality instead of throwing away the image.
*  Be more conservative about memory when kPSPDFLowMemoryMode is enabled. (Enable this if you have complex PDFs and/or memory related issues)
*  Fixes a potential recursive call problem when editing link annotations.
*  Fixes an issue where certain glyph frames could be calculated too small if the PDF is encoded incorrectly.
*  Fixes an issue with generating JSON from stamp annotations.
*  Fixes an issue where images could be rendered upside down/incorrectly when they have certain EXIF rotation settings.
*  Fixes an UI issue when annotations couldn't be fully restored from the Copy/Paste action and created an zero-sized object.

### 2.14.11 - 19 Jun 2013

*  Allow subclassing of the UIImagePickerController used within PSPDFKit for special use (e.g. to block portrait display for landscape-only apps). Use overrideClass:withClass: for that.
*  Ensure the outline page label frame is properly update in landscape mode.
*  Fixes an issue where the annotation table view controller didn't check the editableAnnotationTypes array before offering a delete.
*  Fixes an issue where highlightedString on PSPDFHighlightAnnotation could return incorrect results.
*  Fixes an issue with text extraction.

### 2.14.10 - 13 Jun 2013

*  Fixes an issue where the outline controller could hang in the "Loading..." state on older devices.
*  Fixes an issue where in rare cases the stamp annotation text could be larger than the stamp itself.
*  Fixes an issue where search could throw an out of range exception for specific PDF encodings.

### 2.14.9 - 11 Jun 2013

*  Various smaller fixes for iOS7. The source code now again compiles without any warnings.
*  API: change `delegate` to `annotationToolbarDelegate` for the PSPDFAnnotationToolbar because UIKit now added a delegate property on the toolbar.
*  API: The setDefaultStampAnnotations method in PSPDFStampViewController is now a class method.
*  Fixes an issue where the thumbnail controller could mis-place the filter header after a frame resize.
*  Fixes a potential crash when the search view controller was both scrolled and the search keyword changed at the same time.

### 2.14.8 - 3 Jun 2013

*  Improves glyph word space detection.
*  Fixes a potential crash on a yet unreleased future version of iOS.

### 2.14.7 - 31 May 2013

*  Improved memory management for older devices like iPad1 or when kPSPDFLowMemoryEnabled is set. This helps against possible memory exhaustion on very complex documents.
*  Fixes an issue where the play button of an embedded video sometimes would not change to its actual state (playing) when pressed.
*  Fixes an issue with draw mode restoration after showing a modal view controller while in draw mode when using pageCurl transition.
*  Further tweaks to the text extraction engine.

### 2.14.6 - 29 May 2013

*  It's now easier than ever to change the link border color: [PSPDFLinkAnnotationView setGlobalBorderColor:[UIColor greenColor]].
*  Thumbnail loading in the scrobble bar is now higher prioritized, loads faster.
*  The bounding box calculation for line annotation now correctly calculates the size for line endings. Line ending size has also been increased to better match Adobe Acrobat. (Thanks Tony Tomc!)
*  The PSPDFRenderStatusView is now a public class which can be used to customize the loading spinner displayed while rendering a PDF page.
*  Annotation resizing when zoomed in deeply has been greatly improved.
*  Further improves text parsing speed and word boundary detection.
*  Fixes an issue where in some cases annotation resizing could fail when changed via the menubar directly before the resize action.
*  Fixes a potential one-pixel rendering bug that could result in thumbnails for certain aspect ratio combinations having white lines at one end of the image.
*  Fixes an issue that would sometimes mark certain PDF links to localhost as "webview" when they in fact only are regular links.

### 2.14.5 - 27 May 2013

*  PSPDFWebViewController will now use UIActivityViewController on iOS6 by default.
*  Support new "loop" option for video annotations.
*  Use images for the text alignment setting.
*  Improve HSV color picker brightness style.
*  Improve word detection for PDF types that already have spaces added and also improves word-break-behavior for ligatures.
*  PSPDFKit will now attempt to render even unknown annotation as long as they define an appearance stream.
*  Improve search and glyph extraction performance.
*  Fixes an issue that could result in the HUD being in a hidden state after adding line/ellipse annotations from the annotation menu while the annotation toolbar is visible.
*  Fixes a potential crash when the PSPDFDocument was deallocated early.
*  Fixes a rare crash with a malformed PDF in the text extractor.

### 2.14.4 - 23 May 2013

*  The annotation resize control now shows guides for aspect ratio and square resizing.
*  The outline controller now shows the target page and properly highlights the outline button.
*  Improves rendering of rotated stamps/images on rotated pages.
*  Allow class overriding for PSPDFSearchResultCell and PSPDFSearchStatusCell.
*  The grid control now loads faster for huge documents on iOS5.
*  Adds some additional safeguards that will now warn if methods of UIViewController/PSPDFViewController are overridden without calling super.
*  Removes legacy PSPDFResolvePathNamesEnableLegacyBehavior.
*  Fixes a small memory leak related to stamp annotations.
*  Fixes an issue where the search controller could get into an "empty" state without showing the search bar.

### 2.14.3 - 21 May 2013

*  Allow to override PSPDFOutlineCell via overrideClass:withClass:.
*  Fixes a nasty issue with one-pixel white thumbnail borders on certain page aspect rations.
*  Fixes an edge case where the menu could appear while the PSPDFViewController is being popped from the navigation stack.
*  Fixes an issue with multiple calls to overrideClass:withClass:
*  Fixes a parsing bug with remote GoToR actions that have a page destination set. The page destination is now evaluated correctly.

### 2.14.2 - 19 May 2013

*  PSPDFViewController now unloads its views when not visible on a memory warning even on iOS6. This saves memory especially when multiple stacks of viewControllers are used in a navigationController.
*  Improves the thumbnail quality.
*  Polyline/Polygon how shows boundingBox resize knobs + knobs for each line end point. Inner points are green.
*  When no fillColor is defined, color will be used instead of black. This is not defined in the PDF Reference, but more closely matches Apple's Preview.app and looks better.
*  Glyph ligature breaks (e.g. ffi) now no longer are marked as WordBreaker.
*  Improves default boundingBox calculation for new annotations on rotated PDF documents.
*  PSPDFPageRenderer can now be subclassed/changed.
*  Improves bounding box calculation for small FreeText annotations.
*  Stamps are now properly rendered on rotated pages.
*  If a stamp annotation is an appearance stream, PSPDFKit now tries to extract the image when using Copy/Paste.
*  Font variant picker now shows font in title and filters name for better display, e.g. 'Helvetivca-Bold' becomes just 'Bold'.
*  Several improvements to the PSPDFMultiDocumentController.
*  The thumbnail selection background now properly sizes itself based on the negative edgeInsets of the thumbnail cell (= looks better for non-portrait documents)
*  Dashed border now factors in lineWidth.
*  Improves parsing of certain GoToR Actions.
*  Made the color preview in UITableViewCell pixel perfect.
*  Improves title detection to filter out white space, now correctly handles cases where the title is missing but ' ' is set instead.
*  PSPDFKit is now compiled with -O3 (instead of -Os) and and uses link-time optimization to further improve performance.
*  Fixes placement of the image and signature picker for rotated documents.
*  Fixes a rare issue where a annotation could stuck in an invisible state because of a bug in the trackedView when selecting + scrolling happened at the same time.
*  Fixes a regression where thumbnail images could become sized wrongly in their aspect ratio under certain conditions for non-uniformly sized documents.
*  Fixes an offset by one error when resolving named destinations for a specific outline action destination type when there are > 500 outline entries.
*  Fixes a potential crash related to the color picker.
*  Fixes a crash related to parsing invalid outline elements.

### 2.14.1 - 15 May 2013

*  Add write support for Polygon/Polyline annotations. (In the API, there's no UI for creating yet, but editing the points works)
*  Add new PSPDFThumbnailBar to display scrollable thumbnails as an alternative to the scrobbleBar. The thumbnail bar is a preview and might change API/Featureset in the next releases. We have some big plans for this but couldn't wait to get it out of the door!
*  The PSPDFOutlineViewController now no longer shows a title on iPad if no modes are set. As a detail, its search bar now is named as "Search Outline" instead of just "Search".
*  FreeText annotation is now correctly rotated on rotated PDF pages and also respects the annotation rotation setting (0, 90, 180, 270).
*  Fix password view state positioning when the keyboard is up and the parent resizes itself.
*  Fixes a potential regression/assertion when the PSPDFViewController was used without a navigationController.
*  Fixes an regression where words with ligatures (like the ffi liagure glyph) would be split into two words with certain encodings.
*  Fixes a race condition that could lead to a warning named '<NSRecursiveLock> deallocated while still in use'.
*  Fixes a line annotation serialization issue where line endings would only be serialized if both are set.
*  Fixes an issue for Copy/Paste where preexisting annotations could disappear after they have been copied and edited.
*  Fixes an exception in the PDF parser if a PDF with a corrupt stream object is analyzed.

### 2.14.0 - 12 May 2013

*  Add support to Copy/Paste annotations. This creates a global UIPasteboard and will work for all apps that use the PSPDFKit framework with 2.14 and up. Alternatively a JSON object is created as well, so that other applications can add support to parse and support PSPDFKit-style-annotations as well.
*  Paste also supports general pasteboard types like Text, URL or Image and will create the appropriate annotations (if this is allowed)

*  New global PSPDFStyleManager that saves various annotation properties and applies them to new annotations. For example, if you change the color of a highlight to red, all future annotations are created red until you change the color back. This already worked in the PSPDFAnnotationToolbar before but is now unified and applied globally (will also save properties like fillColor or fontName). You can disable this with nilling out the styleKeys property of PSPDFStyleManager.

*  The PSPDFFreeTextAnnotationView is now always sharp, even when zoomed in. Because we have to work around the broken contentsScale property, the API has changed a bit. If you previously had textView overridden, you now need to subclass PSPDFFreeTextAnnotationView and change the textViewForEditing method to apply your custom textView.
*  PSPDFStampViewController is now more flexible and will evaluate the new PSPDFStampAnnotationSuggestedSizeKey key for the default annotations. Images in default annotations are now supported as well and the checkmark and X annotation are now added with the correct aspect ratio size. With the new setDefaultStampAnnotations: a different set of default annotations can be set.
*  Various smaller UX fixes inside the  PSPDFNoteViewController.
*  Improves memory usage with very large documents (1000 pages and up)
*  Various smaller performance improvements in the cache.
*  Tinting has been improved for various view controllers.
*  The global "Text..." option has been renamed to "Note..." to make its function more clear.
*  The global "Appearance..." has ben renamed to "Style..." because this is more concise and better fits the iPhone.
*  Fixes an issue where unless controls:YES was set the wrong default was used for web links in the internal browser.
*  Fixes an edge case where the PSPDFPasswordView would not adapt itself correctly if the keyboard was already up before the controller has been pushed.
*  Fixes an issue with opening external URLs via dialog where the preview of the URL could fail.

### 2.13.2 - 10 May 2013

*  The text selection delegate pdfViewController:didSelectText:withGlyphs:atRect:onPageView: is now also called for deselection.
*  Fixes an issue where PSPDFProcessor would flatten AND add annotations if kPSPDFProcessorAnnotationAsDictionary was used.
*  Fixes an issue with annotation drawing on iPhone on iOS5 where views could be reloaded after a memory warning and then the current drawing was missing.
*  Fixes a small memory leak.

### 2.13.1 - 9 May 2013

*  Adds read support for Polygon/Polyline annotations, including support for all line ending types.
*  The tinted UIPopoverController subclasses now look much better and now very closely resemble the original including gradients and alpha value.
*  PSPDFTextParser now fully complies to NSCoding, so search results can be persisted and cached. (Thanks to ForeFlight!)
*  Fixes an unbalanced locking call when a page was requested that couldn't be rendered.

### 2.13.0 - 7 May 2013

PSPDFKit now requires QuickLook.framework, AudioToolbox.framework and sqlite3. Please update your framework dependencies accordingly.

*  Initial support for 'Widget' annotations, supports action and rendering. (not yet writable)
*  Support for 'File' annotations. Will offer QuickLook support on touch.
*  Basic read support for 'Sound' annotations.
*  Add support for 'Rendition' and 'RichMediaExecute' actions that can control Screen/RichMedia annotations. (video/audio. JavaScript is not supported.)
*  Ink/Circle/Ellipse/Line now each save their last used color independently.
*  FreeText and other annotation types inside the annotation toolbar now remember the last used color.
*  Add missing translation for "%d Annotations" and added special case for "%d Annotation" (singular).
*  Add missing "No Annotations" and "Loading..." state text for the PSPDFAnnotationTableViewController.
*  For text selection, the text knob is now prioritized over near annotations.
*  API: `cacheDirectory` in PSPDFDocument has been renamed to `dataDirectory`, so that won't be confused with the cache directory setting of PSPDFCache.
*  Improves text parser to properly detect word boundaries for documents that use invalid characters for word separation.
*  For pspdfkit:// based videos controls are now enabled by default if the option is not set.
*  PSPDFProgressHUD now checks if the keyWindow is visible before restoring, fixes an edge case with multiple windows that have rootViewControllers attached.
*  PSPDFSearchViewController now has a protocol to communicate with PSPDFViewController instead of owning that object directly.
*  PSPDFViewController no longer will change the viewMode to document when the view will disappear.
*  Fixes a rare crash when moving the text selection handle.
*  Fixes an issue with writing the page annotation object on malformed PDFs which could lead to annotations being written but not being displayed.
*  Fixes an issue with where sometimes fillColor was set on FreeText annotations even though there shouldn't be one set.

### 2.12.12 - 4 May 2013

*  The note view controller now will detect links.
*  pdfViewController:shouldSelectAnnotation: is now also honored for long press actions.
*  Fixes an issue where annotations sometimes were not parsed correctly with password protected PDFs.
*  Fixes an issue related to checking the annotation cache receipt.
*  Fixes an encoding issue with annotation links that contained spaces.
*  Fixes a potential crash with an PSPDFActionURL with an nil URL.

### 2.12.11 - 30 Apr 2013

*  Add new styles for HUD showing/hiding: PSPDFHUDViewAnimationSlide (in addition to the default fade)
*  Tapping in the previous/next range on first/last page will now toggle the HUD instead of force-showing it.
*  Fixes a UI issue where the document label view could be slightly offset under certain conditions on iPhone after a rotation from portrait to landscape with hidden HUD.
*  Fixes an issue with text extraction for certain PDF encodings.

### 2.12.10 - 30 Apr 2013

*  Improves the Loading... state when there's already content in PSPDFTableAnnotationViewController.
*  Fixes an issue with adding/removing bookmarks.
*  Fixes an issue where fixedVerticalPositionForFitToWidthEnabledMode could lead to off-centered pages.
*  Fixes an issue with search and certain PDF encodings that only happened on release builds.
*  PSPDFCatalog: Fixes the map view example with a map:// annotation link.

### 2.12.9 - 28 Apr 2013

*  Fixes an issue with text selection handle dragging.

### 2.12.8 - 28 Apr 2013

*  Huge performance and memory improvements for text extraction/search.
*  Performance improvements at serializing annotations.
*  Memory improvements, especially for large documents. (>5000 pages)
*  API: useApplicationAudioSession in PSPDFVideoAnnotationView has been removed, since the underlying property is deprecated by Apple. Subclass and change this on the MPMoviePlayerController directly if you rely on the old behavior, but note that this might be gone as of iOS7.
*  New brightnessControllerCustomizationBlock in PSPDFBrightnessBarButtonItem.
*  Fixes an issue that could lead to a crash on deallocating certain objects when OS_OBJECT_USE_OBJC was enabled. (Sourcecode, iSO6 only ARC builds)
*  Fixes an issue where PSPDFKit was sometimes too slow freeing up memory with lots of background task running on low memory situations.

### 2.12.7 - 24 Apr 2013

*  Major performance improvements on annotation parsing.
*  Outline and annotation parsing has been moved to a thread, the controller has now a loading state until parsing is complete.
*  The bookmark controller now supports the pageRange feature, hiding bookmarks that are not accessible.
*  Bookmark cells now allow copy.
*  Bookmark now also uses the PSPDFAction system to execute actions. (allows links, etc)
*  Improves the text parser to better deal with malformed PDF font encodings.
*  Improves accessibility localization in the thumbnail grid view cell. (thanks to Dropbox for providing this patch!)
*  Adds missing localization for text alignment property of free text annotations.
*  Fixes a regression where search table view updates with rapid cancellation could lead to an exception.

### 2.12.6 - 22 Apr 2013

*  FreeText annotations now have a text alignment property (compatible with both Preview.app and Adobe Acrobat)
*  Ink annotations now allow setting a fill color (this is an extension to the PDF spec but works fine because we emit an appearance stream)
*  Allows subclassing of PSPDFStampViewController.
*  Expose the drawView of the PSPDFSignatureController.
*  FreeText annotations: Improve parsing of style strings.
*  Don't do expensive (xpc) dictionary lookups on older devices. (iPad1)
*  Fixes an issue where the outline controller could show menu items from the text selection view on iPad.
*  Fixes a crash with a missing selector (didReceiveMemoryWarning) on PSPDFDrawView.
*  Fixes a rare crash with parsing certain malformed PDF documents.

### 2.12.5 - 21 Apr 2013

*  FreeText annotations now support fill color (Note: This is only partially implemented in Apple's Preview.app but works fine in Adobe Acrobat)
*  FillColor settings now includes transparent (useful for shapes, free text, lines)
*  Improves color parsing for FreeText annotations.
*  Add basic support for Caret annotations.
*  Improves rendering of rotated stamps.

### 2.12.4 - 19 Apr 2013

*  Performance improvements for page scrolling.
*  Improves support for UIAppearance (e.g. navigation bar images)
*  Bookmark and annotation controller now fully respect the tintColor property.
*  API: PSPDFDocument convenience constructors have been renamed from PDFDocumentWith... to simply documentWith....
*  Improves compatibility with certain GoToR PDF actions that don't define a target page.
*  Fixes an issue where pausing a video without controls could fail on iOS5.
*  Fixes an issue where showing multiple videos with autostart enabled could lead to a crash on iOS5.
*  Fixes a small memory leak when drawing stamp annotations.

### 2.12.3 - 19 Apr 2013

*  The setDidCreateDocumentProviderBlock and the didCreateDocumentProvider method will now be called after the documentProviders are fully created, fixing recursion issues if methods are called that require the documentProvider from within that block.
*  Setting a different annotationPath in the PSPDFFileAnnotationProvider will remove all current annotations and try to load new annotations from that path.
*  Fixes an issue where in PSPDFTextSearch didFinishSearch: was always called, even when the search was cancelled (instead of didCancelSearch:)
*  Fixes an issue where changing the note icon could result in restoring the previously set note text.
*  Titanium: Fixes a bug where under certain conditions `useParentNavigationBar` would not work on the first push of the view controller.
*  Titanium: Add setAllowedMenuActions (document setting)

### 2.12.2 - 18 Apr 2013

*  PSPDFTabbedViewController learned `openDocumentActionInNewTab`, opens a document in a new tab if set to YES (new default)
*  pdfViewController:documentForRelativePath: now gets the *original* path from the PDF action for resolvement.
*  Respect alpha for fillColor for FreeText annotations.
*  Disable iOS "Speak Selection" menu entries since this does not work. A DTS for this feature is ongoing.
*  Fixes rendering of textAlignment for FreeText annotations.
*  Fixes an issue when pageRange is set with multiple documents and retain documents are completely blocked through it.
*  Fixes PDF generation for different-sized PDFs.
*  Fixes missing update when "Clear All" is used.
*  Fixes a rare race condition on freeing document providers.
*  Fixes a rare issue that could lead to an empty view on loading a document.

### 2.12.1 - 12 Apr 2013

*  Uses a sensible default for allowedMenuActions in PSPDFDocument.
*  Fixes an issue with Appcelerator.

### 2.12.0 - 11 Apr 2013

*  New class cluster: PSPDFAction. This unifies action between PSPDFOutlineElement, PSPDFBookmark and PSPDFLinkAnnotation. Now you can create outline elements and bookmark that have the same flexibility as links in PSPDFLinkAnnotation, supporting pspdfkit:// style URLs. The parsing code has been unified as well with the best of both worlds (e.g. the 'Launch' action is now supported universally). This improvement required deprecating certain methods - update your code if you used one of those classes directly)
*  Add support for GoBack/GoForward named annotations.
*  Add basic support for JavaScript actions that link to another page.
*  PSPDFNoteAnnotationController now honors the allowEditing state also for the textView and blocks editing if set to NO.
*  New helper to better override classes: overrideClass:withClass: in both PSPDFViewController and PSPDFDocument.
*  Annotation types in the annotation table view are now localized.
*  New delegates in PSPDFViewControllerDelegate to get notified on page dragging and zooming.
*  PSPDFViewState no longer saves the HUD status (this should be handled separately and was confusing for the tabbed controller)
*  Removed legacy coder support for data models that were serialized before 2.7.0.
*  Removes deprecated API support in PSPDFTextSearch and PSPDFAnnotationParser.
*  Fixes an issue in the label parser where page label prefixes were defined without style.
*  Fixes an issue where hiding the progress HUD could make the wrong window keyWindow (if at that time there is more than one visible), thus leading to keyboard problems.
*  Fixes an issue in the document parser that could lead to a recursion for cyclic XRef references for certain PDF documents.
*  Fixes a situation where touch handling could become sluggish when a crazy amount of link annotation is on a page (>500!)
*  Fixes a annotation text encoding issue that could result in breaking serialization of certain character combinations like 小森.
*  Fixes a UI issue where invoking the draw action from the menu while at the same time having the annotation toolbar visible could lead to a hidden toolbar if that one is transparent.
*  Fixes an issue with the text extraction engine for certain PDF files.
*  Appcelerator: Allow setting size properties like thumbnailSize: [300,300]
*  Appcelerator: Add support to set outline controller filter options (outlineControllerFilterOptions = ["Outline"])

### 2.11.2 - 4 Apr 2013

*  Drawing annotations is now always sharp, even when the document is zoomed in. (This required changes to the public API of PSPDFDrawView, check your code if you use that class directly)
*  Annotation flattening now shows a circular progress indicator instead of the default spinning indicator.
*  PSPDFProcessor now has a new progressBlock property that calls back on each processed page.
*  New delegates: pdfViewControllerWillDismiss: and pdfViewControllerDidDismiss: to detect controller dismissal.
*  Add allowedMenuActions property to PSPDFDocument to allow easy disabling of Wikipedia, Search, Define text selection menu entries.
*  Internal locking of PSPDFDocument and PSPDFRenderQueue has been improved and is now faster in many situations.
*  Getting all annotations of a document is now faster in some situations.
*  Titanium: setEditableAnnotations: is now exposed (PSPDFKit Basic upwards)
*  Fixes an issue with line annotation selection where sometimes a selection knob was not visible.

### 2.11.1 - 3 Apr 2013

*  Add switch to globally enable/disable bookmarks (`bookmarksEnabled` in PSPDFDocument)
*  `annotationsEnabled` in PSPDFDocument now also enabled/disables the annotation menus.
*  The thumbnail view now listens for annotation changes/bookmark changes and updates accordingly.
*  Fixes an issue where the toolbar in the new PSPDFContainerViewController was sometimes not displayed initially.
*  Fixes an issue where the delegate didLoadPageView: was called multiple times with the pageCurl transition.

### 2.11.0 - 1 Apr 2013

*  Enables creation of Rectangle, Ellipse and Line annotations.
*  Line thickness can now be chosen from the drawing toolbar.
*  Improvements to line annotation drawing.
*  Line annotation endings can now be customized (Square, Circle, Diamond, Arrow, ...)
*  Drawing is now instantly smoothened.
*  New annotation list controller (PSPDFAnnotationListViewController) to quickly see all annotations, zoom onto them or delete them.
*  Renamed Table of Contents to Outline.
*  OutlineBarButton now can show both the new annotation list and the bookmarks. Both are enabled by default.
*  The outline is now searchable.
*  Several menu items have been reorganized to both fit better on iPad and iPhone.
*  The long-press to show the bookmark view controller is now disabled by default.
*  The PSPDFKit folder has been restructured.
*  The `pageRange` feature if PSPDFDocument now works across multiple data sources. (This allows more flexibility for PSPDFProcessor and faster document creation)
*  It's now easier to disable the PDF page label feature with the new property `pageLabelsEnabled` in PSPDFDocument. (enabled by default, disable if you see 'weird' page labels)
*  API: PSPDFAnnotationView has been deprecated and renamed into PSPDFAnnotationViewProtocol.
*  Fixes an issue where small text on free text annotations was not rendered at all when the boundingBox was too small for it.
*  Fixes a potential crash on iOS5.

### 2.10.2 - 27 Mar 2013

*  PSPDFCache is even smarter and faster when using PDF documents that are very slow to render.
*  PSPDFCache no longer deadlocks if you remove the delegate while the delegate is being called.
*  If a new PSPDFViewController is created based on a PDF action that links to a new document modally, all important settings are copied over to the new controller.
*  PSPDFKit will no longer create empty highlight annotations when using the annotation toolbar and tapping on a point without text.
*  No longer retains the view controller while the document background cache is being build (less memory pressure)
*  Adds some more safeguards against abuse of certain methods.
*  The render queue now retains the document while rendering. This fixes cases where image requests never returned because the document disappeared before.
*  Fixes a regression from 2.10 where through an event optimization sometimes the text of a note annotation was not properly saved. PSPDFDocument now sends out a PSPDFDocumentWillSaveNotification before a save will be made to give all open editors a chance to persist it's last state in time.
*  Fixes an issue where the contentRect was calculated wrong for uncommon view embedding use cases.
*  Fixes an issue where the thumbnail filter values were hardcoded.
*  Fixes a potential timing-related crash on iOS5 when the search controller was shown too fast.
*  Titanium: Add thumbnailFilterOptions property.

### 2.10.1 - 26 Mar 2013

*  Shape annotations border and fill color can now be customized.
*  Clearing the memory cache will now also clear any open document references.
*  Add white color to common color picker colors (except for highlights, replacing purple)
*  PSPDFRenderQueue now has a cancelAllJobs to clear any running requests.
*  The render queue now better prioritizes between cache requests and user requests (zooms) to allow even faster rendering.
*  FreeText annotations can now no longer be created outside boundaries.
*  Add support for text alignment for FreeText annotations. (It seems that Adobe Acrobat has a bug here and ignores this property - other Applications are compliant to the PDF spec and do display this, e.g. Apple's Preview.app)
*  Edit mode now directly hides the HUDView.
*  API change: The color picker now has a context: flag to allow state storage. Update your delegates if you use this class directly.
*  Fixes some minor issues with the new cache.
*  Fixes a UI weirdness where the scrollview had a slow scroll-back animation when text was edited at the very top.
*  Titanium: Add new linkAnnotationHighlightColor property.

### 2.10.0 - 22 Mar 2013

PSPDFKit 2.10 is another major milestone. The cache has been rewritten from the ground up to be both faster and more reliable. Annotations are now cached, they are no longer an "afterthought" and will show up in the thumbnails and even the scrobble bar. The disk cache now limits itself to 500MB (this is customizable) and cleans up the least recently used files. The memory cache is now also smarter and better limits itself to a fixed number of pixels (~50MB of modern devices in the default setting). Loading images from the cache is now more logical and highly customizable with PSPDFCacheOptions. The two render code paths have been unified, PSPDFRenderQueue now does all rendering and can now render multiple requests at the same time and also prioritizes between low priority cache requests and high priority user zoom requests. In this process some very old code has been completely reworked (PSPDFGlobalLock) and is now much more solid.
Several methods have been renamed, upgrading will require a little bit of effort to adapt to the new method names. It's definitely worth it. If you find any regressions or missing features for your particular use case, contact me at peter@pspdfkit.com.

*  Completely rewritten cache that now renders all screen sizes and shows annotations.
*  PSPDFThumbnailViewController now has a new filter to only show annotated/bookmarked pages. See filterOptions for details. http://twitter.com/PSPDFKit/status/314333301664006144/photo/1
*  PSPDFViewController has a new setting: `showAnnotationMenuAfterCreation` to automatically show the menu after an annotation has been created. (disabled by default)
*  Text loupe no longer fades zoomed content. (looks better for text scope loupe)
*  Prevent too fast tableView updates (and thus flickering) in PSPDFSearchViewController.
*  Increases loupe magnification on iPhone to 1.6 and make kPSPDFLoupeDefaultMagnification customizable at runtime.
*  A UISplitViewController in the hierarchy is automatically detected and the pan gesture will be blocked while the PSPDFViewController is in drawing mode (else this would interfere with drawing).
*  The note annotation controller now no longer generates change events per typed key, but will wait for a viewWillDisappear/app background event to sync the changed text back into the annotation object.
*  Expose availableLineWidths and availableFontSizes in PSPDFPageView to customize menu options.
*  On iPhone, scrolling down the search results will now automatically hide the keyboard.
*  Improves performance for overlay annotation rendering.
*  Improves annotation selection, especially drawings are now pretty much pixel perfect.
*  Disables the long press gesture (and the new annotation menu) when a toolbar annotation mode is active.
*  Use PSPDFAnnotationBorderStyleNone instead of PSPDFAnnotationBorderStyleSolid when the border style is undefined (to match Adobe Acrobat)
*  The annotation selection border is now independent of the zoomScale.
*  FreeText annotations no longer "jitter" when resizing.
*  The stamp controller now dismisses the keyboard when changing switches or pressing return on the keyboard.
*  Allow note annotations outside the page area (to match Adobe Acrobat behavior).
*  Allow overrideClassNames for PSPDFDocument when it's created from within PSPDFViewController (e.g. when an external annotation link target is touched)
*  Add workaround against rdar://13446855 (UIMenuController doesn't properly reset state for multi-page menu)
*  The selectionBackgroundColor of PSPDFSearchHighlightView can be updated after it's displayed now.
*  PSPDFTabBarView of PSPDFTabbedViewController can now be overridden with the overrideClassNames dictionary.
*  API change: The renderBackgroundColor, renderInvertEnabled, renderContentOpacity methods have been removed from PSPDFViewController. Please instead update the dictionary in PSPDFDocument to set these effects. (e.g. document.renderOptions = @{kPSPDFInvertRendering : @YES}).
*  API change: PSPDFViewController's renderAnnotationTypes has been deprecated and will update the renderOptions in PSPDFDocument instead.
*  API change: renderPage: and renderImageForPage: will now automatically fetch annotations if the annotations array is nil. To render a page without annotations, supply an empty array as the annotations array (as soon as an array is set, auto-fetching will be disabled).
*  API change: PSPDFCacheStrategy is now PSPDFDiskCacheStrategy, the enum options have been updated as well.
*  Fixes some minor problems and deprecation warnings when compiling PSPDFKit with iOS6 as minimum deployment target and autoretained GCD objects.
*  Fixes an issue where some annotations got set to overlay and were not properly restored.
*  Fixes an issue with centering after returning from thumbnails in continuous scrolling mode.
*  Fixes an issue where a thumbnail could be animated that was not visible.
*  Fixes an UIAccessibility mistake where Undo was labeled Redo in the drawing toolbar.
*  Fixes encoding issues with localization files.
*  Fixes some potential crashes when parsing certain PDF documents.
*  Fixes several non-critical log warnings when opening continuous scrolling with an invalid document.
*  Fixes various potential crashes around screen annotations and stream extraction.

### 2.9.0 - 9 Mar 2013

*  The loupe has been improved, it's now fast in every zoom level and now 100% matches UIKit's look. Developers can now easily update the magnification level.
*  Greatly improved UIAccessibility support. Reading mode is now line-based and reading column-based layouts works much better.
*  New feature: PSPDFScrobbleBar can control tap behavior outside the page area with allowTapsOutsidePageArea.
*  Improved PDF rendering speed for pageCurl mode.
*  RichMediaAnnotations (directly embedded video) now support autoplay set directly via Adobe Acrobat (Both page visibility modes will enable autoplay)
*  Removes deprecated methods from PSPDFViewController and PSPDFPageView.
*  NSNull entries are now properly filtered out from the PDF metadata.
*  Greatly improves outline parsing speed. In some cases parsing of extremely complex outlines went down from 120 seconds to 2 seconds (in a ~5000 pages document)
*  Add progress while data is transferring when using the "Open In…" feature.
*  PSPDFAnnotation model version is now at 1, boundingBox is now serialized as string and no longer as NSValue (fixes JSON serialization)
*  Improves animation when adding/removing bookmarks while the popover controller is resizing at the same time.
*  Add support for long-press toolbar button detection when useBorderedToolbarStyle is enabled.
*  useBorderedToolbarStyle is now also evaluated in PSPDFAnnotationToolbar.
*  PSPDFOpenInBarButtonItem now has the option to directly add the 'print' action into the list of applications. Disabled by default. See 'showPrintAction'.
*  UIMenuController is now smarter and no longer places the menu above the toolbar when there's space underneath as well.
*  'allowTwoFingerScrollPanDuringLock' in PSPDFAnnotationToolbar now defaults to NO, since this delays drawing.
*  API change: Refactored the thumbnail view out of PSPDFViewController into it's own controller: PSPDFThumbnailViewController. If your code relied on modifying the collection view delegates within PSPDFViewController, you must update your code to override PSPDFThumbnailViewController instead. PSPDFViewController' gridView has been deprecated. Use thumbnailController.collectionView instead.
*  API change: Removed iPhoneThumbnailSizeReductionFactor. item size is now set conditionally during initialization. The best way to set this is in PSPDFCache.sharedCache.thumbnailSize.
*  API change: The delegate didRenderPage:didRenderPage:inContext:withSize:clippedToRect:withAnnotations:options: has been moved over to PSPDFDocumentDelegate.
*  Drawing Ink annotations now closely matches the line width when zoomed in.
*  Fixes a possible scrolling "freezing" issue when pageCurl is enabled.
*  Fixes a potential crash with extracting the page title of the PDF.
*  Fixes a potential crash when the Open In... action was invoked multiple times too quickly. (Thanks to Evernote for this fix)
*  Fixes a bug that could change the cursor position in the note annotation controller.
*  Fixes various potential crashes when parsing invalid PDF data.
*  Fixes an issue where thumbnails could not properly be selected with VoiceOver enabled.
*  Fixes an issue with image selection on rotated documents.
*  Fixes an issue with annotationViewClassForAnnotation: and the call ordering of defaultAnnotationViewClassForAnnotation.

### 2.8.7 - 22 Feb 2013

*  Improved scrollview centering. Now enables pan while bounce-zoomed out.
*  PSPDFMultiDocumentController now can advance to next/prev document with tapping at the last page of the current one.
*  Slightly increases the smart zoom border on iPad.
*  New helper in PSPDFNoteAnnotationController to allow easy customization: setTextViewCustomizationBlock.
*  New property in PSPDFViewController: scrollOnTapPageEndAnimationEnabled.
*  New property in PSPDFViewController: shouldRestoreNavigationBarStyle (via Dropbox request)
*  Fixes a rare scroll view locking issues that was triggered by an UIKit bug.
*  Fixes an off-by-one error in PSPDFOutlineParser's resolveDestinationNameForOutlineElement.

### 2.8.6 - 20 Feb 2013

*  PSPDFShapeAnnotation now creates appearance stream data. This is needed to work around a bug in Adobe Acrobat for iOS. This behavior can be disabled with setting kPSPDFGenerateAPForShape to @NO in renderingOptions of PSPDFDocument. As a side effect, this also improves display of transparent shapes with Apple's Preview.app
*  Improvements to smart zoom - text block choose method is now smarter.
*  viewLock no longer locks the HUD (just the view state)
*  Improves animation for the Table of Contents controller cells.
*  Setting the pageRange now automatically invalidates the current document.
*  PSPDFTabbedViewController has become more modular with the new superclass PSPDFMultiDocumentViewController.
*  Fixes a rare crash when using the drawing tool very quickly with only one resulting draw point.
*  Fixes a rendering issue with images added from the camera in pageCurl mode.
*  Fixes an issue where the scrobble bar could be displayed even though it's disabled.
*  Fixes a regression in the appearance stream generator.
*  Fixes a regression with updating the bookmark bar button status when the toolbar is transparent.
*  Titanium: Fixes toolbar detection for annotation toolbar.

### 2.8.5 - 16 Feb 2013

*  Fixes a text glyph frame calculation bug when a font contains both a unicode map and an encoding array.
*  Improves glyph shadow detection to be more accurate, less false positives.

### 2.8.4 - 16 Feb 2013

*  Improves text block detection speed.
*  Fixes certain crashes when parsing malformed PDFs.
*  Fixes an issue where outline elements linked to the same named destination would not all be correctly resolved.

### 2.8.3 - 15 Feb 2013

*  Allow UIAppearance for PSPDFRoundedLabel.
*  Added a mailComposeViewControllerCustomizationBlock in PSPDFEmailBarButtonItem to easily change the default email body text.
*  New property: thumbnailMargin in PSPDFViewController.
*  Thumbnail view now dynamically updates the sectionInset if the HUD is hidden during thumbnail view.
*  API change: Renamed siteLabel to pageLabel in PSPDFThumbnailGridViewCell.
*  Replaces PSPDFAddLocalizationFileForLocale with the more flexible PSPDFSetLocalizationBlock.
*  Add double-tap to fullscreen for YouTube views.
*  Add fallback to use associated objects for annotation views that don't comply to PSPDFAnnotationView. (Fixes duplicate view adding)
*  Disables the yellow block highlighting on a double-tap zoom.
*  The Save To Camera Roll is now faster and no longer blocks the main thread during JPG compression.
*  Certain smaller tweaks/improvements for the HUD.
*  Fixes a regression where on a long press the annotation menu would reappear then disappear for highlight annotations.
*  Fixes a regression that broke re-positioning of search highlights on a frame change.
*  Fixes an issue where the pdfController could be dismissed when using the "send via email" feature.
*  Fixes a rare condition in which the progressView (PSPDFProgressHUD) could get stuck.
*  Fixes an issue where videos that were set to autostart=NO could still autostart on iOS5.
*  Fixes an issue where CMYK encoded JPGs would be extracted inverted upon saving.
*  Fixes an issue where ink annotations could be added in the wrong size when the device directly rotates after finishing a drawing
*  Fixes a rounding error that made certain pages scroll-able in pageCurl mode.
*  Fixes a page blurriness issue because of rounding errors when zooming out/zooming in a lot.
*  Removed deprecated options from PSPDFEmailBarButtonItem.

### 2.8.2 - 10 Feb 2013

*  HUD visibility/transparency can now be set more fine-grained with the new properties transparentHUD, shouldHideNavigationBarWithHUD, shouldHideStatusBarWithHUD and statusBarStyle. Check your code and let me know if this breaks something. Setting statusBarStyleSetting will update all those properties.
*  Resize view now snaps to aspect ratio on resizing. Middle knobs are hidden if space is low.
*  Document link annotations now resolve symbolic links.
*  After editing annotation properties (e.g. color) the menu will re-appear.
*  Annotation menu is re-displayed after a rotation.
*  Finishing a drawing no longer disappears/reappears because of the page rendering process.
*  Search view controller cells now animate better and have better sized margins.
*  PSPDFBarButtonItem's pdfController property is now weak. Update your code to use notifications if you previously relied on KVO.
*  NavigationBar/ScrobbleBar are now rasterized before a fade out/fade in, which improves the fade animation (no more bleed-through)
*  Annotation Toolbar now in all cases correctly adapts to statusbar frame size changes (calling, personal hotspot, ...)
*  Improves compatibility with writing PDF trailer data with certain corrupt PDF files.
*  Adds new helper: PSPDFAddLocalizationFileForLocale, parses a localization text file.
*  Fixes an UX issue where the annotation tool could be deselected when using the two-finger scroll while the annotation toolbar is active and a tool (e.g. highlight is selected).
*  Fixes a touch inconsistency where a annotation deselection could be done without marking the touch as processed.
*  Fixes several entries in the localization table.
*  Fixes a regression introduced in 2.8.1, a potential crash when using the highlight annotation tool outside of a glyph.
*  Fixes a potential crash in the search view controller due to invalid state handling.
*  Fixes an issue where part of the drawing state was lost when opening a modal controller while in drawing mode. (e.g. iPhone/color picker)
*  Various typos fixed, and some very minor API changes due to spelling corrections (thanks to Tony Tomc).

### 2.8.1 - 6 Feb 2013

*  The highlight tool now matches full words. A single touch will highlight the complete word instead of just one character.
*  A new syntax for link annotations to control UI. For now pspdfkit://control:outline is supported to open the TOC directly from the document.
*  The signature controller now uses "Signatures" as title instead of "Choose Signature" on iPhone, since later was too long and got cut off.
*  Fixes an issue where setFileURL: could generate a new UID if one was already set.
*  Fixes an UI issue when resizing an annotation purely horizontally would result in no redraw.
*  Fixes an UI issue where the thumbnail indicator could move behind the thumbnail image in some cases.
*  Fixes an UI issue in PSPDFFixNavigationBarForNavigationControllerAnimated() that could potentially shift down the navigationBar for unusual view controller setups.
*  Fixes an UX issue where a second tap was sometimes required after using certain modes in the annotation toolbar.
*  Fixes an issue where an external PSPDFBarButtonItem would not update on iPhone.
*  Fixes an issue where videos played in a popover continued to play even after the popover was dismissed.
*  Fixes an issue where thumbnailSize could not be changed after the PSPDFViewController has been displayed.
*  Fixes an issue with incorrect view controller locking after switching from highlight to draw mode in the annotation toolbar.

### 2.8.0 - 5 Feb 2013

*  Image annotations. PSPDFKit can now add images from the camera and the photo library and embed them as stamp annotations.
*  Search / Text extraction is now more than twice as fast and reports the current page.
*  The whole AP stream generation system has been improved and performance optimized to allow bigger streams like images.
*  PSPDFKit will now require Xcode 4.6/SDK 6.1 to compile. (4.5 should still work fine, but we follow Apple's best practice with always compiling with the latest SDK available.)
*  API change: editableAnnotationTypes is now an *ordered* set. Using a regular set to change this property will work for the time being, but please update your code. The order now will change the ordering of the buttons in the annotation toolbar and the new annotation menu.
*  Add experimental phone/link detection: detectLinkTypes:forPagesInRange: in PSPDFDocument. This will create annotations for phone numbers and links found in the document, if they are not linked already. This is the same that Preview/Mac and Adobe Acrobat do - they allow to click URLs even if they don't have any link set on them.
*  Search now displays the current processed page.
*  Further tweaks to PSPDFHighlightAnnotation highlightedString.
*  Add setting to enable/disable the "Customer Signature" feature. (customerSignatureFeatureEnabled in PSPDFSignatureStore)
*  The signature controller has now landscape as preferred rotation under iOS6. (but still supports portrait)
*  Controllers presented via the PSPDFViewController helper now use a custom PSPDFNavigationController that queries the iOS6 rotation methods of the topmost view controller. This makes it easier to customize rotation for PSPDF* controllers without hacks.
*  Performance improvement: deleted annotations now are no longer serialized if the external annotation format is used.
*  The "hide small links" feature now works better on iPhone.
*  FreeText annotations now parse even more font definition styles.
*  Improvements to the heuristic in PSPDFHighlightAnnotation highlightedString.
*  Annotations added via a modal view (e.g. Signatures on iPhone) are now also selected. (annotation selection is preserved during reloadData)
*  Smart zoom now uses less border when zooming into a text block, which looks better. (other columns usually are no longer visible)
*  Taps that dismiss an annotation editing popover no longer modify the HUD state.
*  The scrobble bar thumbnail size has been tweaked to be a little bigger. This now can also be fine-tuned, see PSPDFScrobbleBar.h.
*  The font selector now selects the currently chosen font.
*  Various performance improvements. (esp. search and the color picker)
*  Thumbnails are now sharper and always aligned to pixel grid (fixes a bug in UICollectionViewFlowLayout)
*  Text selection knobs are now pixel aligned as well.
*  When thumbnails are loaded from scratch, they are loaded in order. (PSPDFCache's numberOfConcurrentCacheOperations has been set to 1)
*  Fixes an UX issue where PSPDFKit could end up displaying something like '1 (1 of 2)' for page labels.
*  Fixes an UX issue where a tap wasn't set to being processed when the delegate delegateDidTapOnAnnotation:annotationPoint:... was being used.
*  Fixes an UIKit bug that in some cases froze the UIScrollView when we zoomed out programmatically (e.g. a double tap after already zoomed in)
*  Fixes a potential crash when saving NSData-based PDFs with a corrupt XRef table.
*  Fixes a rendering issue where some landscape documents were incorrectly scaled when using renderImageForPage:withSize in PSPDFDocument.
*  Fixes a regression that stopped the [popover:YES] option form working properly. (A formsheet was presented instead)
*  Fixes a regression in the 2.7.x branch that caused movies loaded in the PSPDFWebViewController to fail with the error "Plugin handled load".
*  Fixes an issue when using Storyboard and setting the viewState to thumbnails initially.
*  Fixes an issue where the signature selector controller dismissed the whole pdfController under certain conditions.
*  Fixes an issue with annotations moving to other pages on a document with multiple document providers.
*  Fixes an issue where the note view controller would hide the close button on iPhone if edit was set to NO.
*  Fixes an issue with frame displacement under certain conditions on embedded UINavigationControllers.
*  Fixes an issue with zooming when in text edit mode and page centering.
*  Fixes an issue with searching for certain characters that are reserved regex characters (like []()*+).
*  Fixes an encoding issue with annotation content and certain Chinese characters.

### 2.7.5 - 25 Jan 2013

*  Signatures are now securely saved in the Keychain and a list of signatures is presented. To disable this feature, set PSPDFSignatureStore.sharedSignatureStore.signatureSavingEnabled = NO in your appDelegate.
*  While annotation mode is active (highlight, drawing, etc) scrolling is now enabled with using two fingers. The old behavior can be restored with setting allowTwoFingerScrollPanDuringLock in PSPDFAnnotationToolbar to NO.
*  PSPDFKit now requires Security.framework.
*  Fixes an issue that could cause an initial "white page" when the controller is first loaded, even when there's cache data available.
*  Fixes an UX issue where, with creating a new note, the menu could be displayed on iPhone, stealing the keyboard from the newly created note controller.
*  Fixes a regression of 2.7.4 that broke some remote videos/audios.
*  Fixes a potential issue when reordering bookmarks.
*  Fixes an issue where the last letter was cut off when using PSPDFHighlightAnnotation highlightedString.

### 2.7.4 - 24 Jan 2013

*  Line annotations are now writeable.
*  A second tap now enables the edit mode in a free text annotation.
*  Annotation selection is now properly pixel aligned, resulting in sharper border, drag points and content - especially on the iPad Mini.
*  The drawing toolbar no longer forces the HUD to show before displaying itself.
*  If enableKeyboardAvoidance is set to NO, the firstResponder won't be tampered with anymore.
*  New property: allowToolbarTitleChange on PSPDFViewController, controls it title is set or not.
*  PSPDFOutlineParser now lazily evaluates named destinations if an outline has more than a specified threshold. (This is currently set to 500). This greatly improves loading times for documents with complex outlines.
*  Allow audio file types for RichMedia/Screen annotations.
*  Add more audio file formats to the support list. (aiff, cif, ...)
*  Ensure that addAnnotation:animated: in PSPDFPageView sets the page and documentProvider.
*  Better workaround for MPMoviePlayer's problem with multiple audio/video views on the same window. (A play button is now displayed in those cases)
*  Normalizes extracted text, allow searching within text that contains non-normalized ligatures.
*  Opacity menu now draws a checked white background instead of using the menu background (now it's more like Photoshop, looks better)
*  Add spanish translation (thanks to Tony Tomc!)
*  The maximum software dimming value is less dark.
*  Fixes a problem in PSPDFProcessor with NSData-based documents and adding annotation trailers.
*  Fixes a bug where the scrollview would update it's position when a UIAlertView with a TextField was visible.
*  Fixes a bug in the outline parser that resulted in the loop for (invalid) cyclid PDF referenced objects.
*  Fixes an issue where parsing certain PDF dates failed.
*  Fixes an issue with view state restoration and continuous scrolling.
*  Fixes a rare issue where the bookmark thumbnail view indicator could be behind the thumbnail image.
*  Fixes an issue with inline editing and the split screen keyboard.

### 2.7.3 - 20 Jan 2013

*  FreeText annotations are now editable inline.
*  Improves stamp and signature rect placement (no longer places the rect outside of page boundaries)
*  Drawing overlay is now transparent. You can restore this behavior with subclassing PSPDFDrawView and setting the backgroundColor to [UIColor colorWithWhite:1.0 alpha:0.5].
*  When changing the thickness of a drawing, the selection border will now automatically adapt itself to fit the new bounds.
*  Renamed "Colors..." menu entry to "Color...".
*  Fixes a potential issue with annotation rotation handling.
*  Fixes a potential crash on stamp creation on iPhone.
*  Fixes an issue where the drawing toolbar was added behind the HUD toolbar.
*  Fixes an issue where PSPDFKit could end up displaying something like 'Page 2-3 of 2'.
*  Fixes an issue where certain pages could be skipped with scroll to prev/nextPage in double page mode (via touching the borders).
*  Fixes some typos and spelling mistakes.

### 2.7.2 - 18 Jan 2013

*  PSPDFScrollView will now move up if a keyboard is displayed.
*  Free Text annotation now have sensible defaults when created in code. (Helvetica, font-size 20)
*  Several tweaks for PSPDFProcessor PDF from web/office files generation.
*  Fixes a potential crash in the iPhone popover controller.
*  Fixes in the annotation selection handling logic.
*  Fixes a minor UX issue where Open In... could result in a second tap needed to activate.

### 2.7.1 - 17 Jan 2013

*  Note annotation flattening.
*  Text selection is now always prioritized over image selection.
*  For the continuous scrolling page transition, all visible pages are now animated when showing/hiding the thumbnail view.
*  Improve PDF serialization of custom stamp annotations.
*  Fixes an animation issue with continuous scrolling.
*  Fixes an UI issue where under certain conditions a second tap was required on a toolbar button to hide the active popover.
*  Fixes an UI issue with creating note annotations.
*  Fixes an issue where annotation resizing was disabled when textSelectionEnabled was set to NO.
*  Fixes a rounding bug in continuous scrolling that could lead to a x AND y scrolling on zoomScale 1.0
*  Fixes several issues with certain RichMedia embedded video annotations.

### 2.7.0 - 16 Jan 2013

*  PSPDFKit model classes now have a common base model class 'PSPDFModel' - enables serialization/deserialization via JSON easily using externalRepresentationInFormat:.
   To get the JSON dictionary, use annotation externalRepresentationInFormat:PSPDFModelJSONFormat.
   (The old annotation serialization format is still supported for the time being)
*  PSPDFKit now requires AssetsLibrary.framework - if you're using PSPDFKit.xcproj or the source distribution, this is already been taken cared of. If you added the frameworks manually and get a linker error, make sure you are linking sAssetsLibrary.framework.
*  PSPDFMenuItem learned to show images in UIMenuController - this beautifies many of the annotation menus, images are now used for annotation types/colors where appropriate.
*  PSPDFKit has learned to write appearance streams. Currently they are emitted for Stamp and Ink annotations. This will help to further improve annotation compatibility with some apps that behave less standard compliant (like Adobe Acrobat/iOS, last tested version is 10.4.4, which doesn't show Ink annotations if they do not have an attached AP stream, even if this is invalid behavior according to the PDF spec. (GoodReader/Preview.app/Adobe Reader on the Mac don't require an AP stream and work in compliance to the spec.))
*  Annotation menus have been cleaned up a little, Opacity... has been moved into a submenu of Color for highlight annotations.
*  PSPDFProcessor has learned to write annotations as dictionary, not only flatten. This will be used e.g. for Open In... when the original PDF is not writeable and thus annotations are saved in an external file.
*  Open In... will now create a new file if there are annotations and the source PDF is not writeable itself.
*  Stamp annotations now have limited support for appearance streams.
*  Stamp annotations can now be added via the new PSPDFStampViewController.
*  Add experimental pageRange feature in PSPDFDocument to allow showing of a subset of the pages.
*  Highlight annotation hit testing is now more accurate, checking the specific rects of the highlights, not the outer boundingBox.
*  Annotation rendering now checks if the annotation will be visible at all and only then renders the annotation. This speeds up zooming on complex documents with many annotations.
*  Improves search by ignoring certain whitespace characters like no-break-spaces.
*  Enables creation of password protected PDFs with PSPDFProcessor up to AES-128 (and mix other CGPDFContext properties like kCGPDFContextAllowsPrinting or kCGPDFContextAllowsCopying)
*  Improves word detection with splitting words between a line of thought and adding special logic for non-default whitespace characters.
to use the old behavior.
*  Improves french translation.
*  zIndex of annotation images is now below zIndex of links, so that links are always displayed before annotation images.
*  Email sending using PSPDFEmailSendMergedFilesIfNeeded will not perform a merge if there is only one source document.
*  Links are now handled even if they are overlapped or hidden underneath other views.
*  Hides the page label and the scrobble bar if the document is password protected and not yet unlocked.
*  PSPDFAnnotation now shows if an appearanceStream is attached.
*  PSPDFAnnotation now as a userInfo dictionary to add any custom data.
*  Annotations now have a creationDate.
*  When note annotations are tapped, don't fade-animate the former annotation out.
*  Page label will not be displayed if the page label is simply the real page number. (Prevent titles like 2 (2 of 10))
*  The internal web browser will now display an error within the HTML, much like Safari on iOS: https://twitter.com/steipete/status/287272056524001280
*  Selected images now have a (default iOS light blue) selection state, matching the selection behavior of glyphs.
*  Brightness control now has indicator images for less/more brightness and a better icon.
*  Improves performance for pages with many links by dynamically disabling the rounded corners in that case.
*  External PDF links can now be opened modally in a new controller, use [modal:YES] in the option field, e.g. pspdfkit://[modal:YES]localhost/two.pdf#page=4.
*  Video extension with a cover now no longer has a dark background and is transparent. If you set cover:YES it will simply show the play button without any background.
*  API change: Words are now detected if they are completely within the rect specified. Use kPSPDFObjectsTestIntersection
*  API change: OutlineElement.page is now 0-based, not 1-based.
*  API change: Several PSPDFProcessor methods now have an additional error part.
*  API change: PSPDFInkAnnotation has been simplified, will automatically recalculate bounding box and paths on line change.
*  API change: Setting the annotation color will now also set the alpha value, if one is set in color.
*  API change: objectsAtPoint: now automatically does an intersection test unless specified otherwise, but objectsAtRect will not, so you need to specify that. Also, in previous version the rect check was done incorrectly to check if the test rect is within the object, now we check if the object is within the test rect OR intersects with it, if intersection is set to YES.
*  API change: Links to external files now reference the page, not page+1. (pspdfkit://localhost/two.pdf#page=4 will move to page 4, before it was page 5)
*  Add support for older PDF standard of defining Dest arrays for page links (for example those produced by LaTeX with PDF version 1.3)
*  Annotation option parsing is now more robust and will tolerate whitespace.
*  Annotation text (and thus the annotation menu) is now even displayed if editableAnnotationType is set to NO.
*  Adds a workaround for certain PDFs with large embedded videos that previously couldn't be parsed.
*  PSPDFKit now uses OS_OBJECT_USE_OBJC instead of OS version checking to check of GCD objects are collected via ARC or not (This is iOS6 only and the new default, can be disabled by the compiler)
*  Text in the password view is now viewable on iPhone in landscape.
*  Fixes an issue with font caching on search and certain documents.
*  Fixes an off-by-one error on writing link annotations that link to internal pages.
*  Fixes an issue with the "Save To Camera Roll" feature and iOS6 - the required rights are now checked fore before writing the image, and an error dialog is displayed for the user in case image saving failed.
*  Fixes an issue where PDF images in CMYK format could not be saved to the Camera Roll.
*  Fixes an issue where PSPDFTabbedViewController failed to show the tab bar if restoreState wasn't called and thus the documents array was nil.
*  Fixes an issue with opening internal html links on PDF link annotations on the device (worked fine on the Simulator)
*  Fixes an issue where the cancel button of the search controller was disabled sometimes (iPhone only)
*  Fixes an issue where under certain conditions link annotations were marked as dirty right after reading them from the PDF which could result in some slowdown when hiding the PSPDFViewController.
*  Fixes a crash with LifeScribe PDF documents when there's an embedded video annotation.
*  Fixes a weird potential crashing issue where setting the controlStyle of the MPMoviePlayerController could throw an exception (which is not documented and should not happen according to the MPMoviePlayer documentation).
*  Fixes a bug that prevented setting of the defaultColorPickerStyles.
*  Fixes an issue where the cover view of movie annotations showed outdated content in some cases.
*  Fixes a potential stack overflow when a PDF that had recursive XObjects with font informations was parsed.
*  Fixes an UIKit bug where the statusbar sometimes was placed above the navigationBar on certain occasions.
*  Fixes issue where certain isOverlay=YES annotations became unmovable after a save until the page had been changed.
*  Fixes issue where a highlight annotation was re-added to the backing store after a color change.
*  Fixes an issue where encryptImage:fromDocument: wasn't actually using the encrypted data.
*  Fixes an issue in the text extractor with parsing certain special formatted CMaps wit bfranges. This should especially help for text extraction errors in languages like turkish or chinese.
*  Fixes a missing setter for PSPDFLineAnnotation.
*  Fixes a retain cycle with PSPDFAnnotationToolbar because the delegate was retained.
*  Fixes a issue with AES-128 encrypted documents that failed to open with a "failed to create default crypt filter." error.
*  Fixes the delegate in the PSCAnnotationTestController (thanks to Peter Li)
*  Titanium: Fixes several issues and adding compatibility for Titanium 3, also added new searchForString(string, animated) and setAnnotationSaveMode(1) functions.

### 2.6.4 - 21 Dec 2012

*  Note annotations now adapt itself to the zoomScale and are no longer scaled when zooming in.
*  Note annotation dragging has been unified with all other annotation types (Notes are now selectable as well)
*  Text/Note annotation popover is now less modal and allows one-touch clickthrough to other annotations and UI.
*  New annotationContainerView container in PSPDFPageView makes it easier to coordinate the zIndex of annotation views with your own custom views.
*  Add encryption/decryption block helper for PSPDFCache. (PSPDFKit Annotate feature)
*  Moved MFMailComposeViewControllerDelegate to PSPDFViewController (from PSPDFEmailBarButtonItem)
*  Annotations now have a new isResizable that controls if they can be resized or not.
*  With + (void)setDefaultColorPickerStyles: in PSPDFColorSelectionViewController the default color pickers can be configured easily. (e.g. disable the new HSV Picker)
*  Better support for annotation borders.
*  Improves performance for text extraction engine with cyclic XObjects.
*  No longer breaks between a word after a font ligature.
*  Properly sets the cropBox for each page in PSPDFProcessor.
*  Adds a fallback for weird URI encodings on link annotations.
*  No longer sets the title for the internal web browser if that is nil (show URL instead)
*  Fixes a bug on toolbar building with correctly adding the moreBarButtonItem when the first button is filtered.
*  Fixes an issue where the signature jumped to a different page when added to the right page in landscape mode.
*  Fixes an issue with the initialization of the continuous scroll mode (especially when using it within a childViewController)
*  Fixes an issue with text extraction on fonts that don't define any base encoding.
*  Fixes an issue where custom bookmark names were not correctly saved.
*  Fixes an issue with video rotation and iOS 5 - current page state is now preserved in all states.
*  Fixes a potential crash when annotations were written back that do not define any color information.
*  Titanium: Fixes issue with the didTapOnAnnotation callback and event.

### 2.6.3 - 17 Dec 2012

*  New font picker for FreeText annotations.
*  Allow changing the text color of the free text annotation.
*  FreeText annotations will now persist the color state.
*  Supports more formats for textColor and fontName in free text annotation.
*  Selected annotations are now rendered in full resolution and no longer appear blurry when zoomed in.
*  Don't block double tap for selected annotations that are not movable (like text highlights)
*  After creating a note or a freetext annotation, the toolbar will be set to none. (to match iPad behavior)
*  Fixes color picker placement for annotations when zoomed all the way in.
*  Fixes various minor issues with annotation menu showing/placement.
*  Fixes a UI issue where the Open In... menu didn't disappear on tapping the button a second time.

### 2.6.2 - 16 Dec 2012

*  New HSV color picker.
*  Color picker now selects the page where the color is selected, or the generic picker if none of the palette colors matches.
*  Brightness control is now properly displayed within a custom popover on iPhone.
*  Highlight selection control now selects using the natural text flow, not just the selected rect. (Preview: https://twitter.com/PSPDFKit/status/279636900590006272)
*  Further improve document shadow for non-equal sized documents.
*  Undo/Redo buttons now have icons instead of text. (Annotation drawing toolbar)
*  Open In... now asks for flattening.
*  Print now optionally allows annotation printing.
*  Ensure documentProvider is always added when annotations are added.
*  Add support for annotation links like tel://4343434 and generally improves handling of external URLs.
*  Add support for PDF labels that have a offset and are plain numbered labels.
*  Fixed a rare condition where menus within UIMenuController could fail to execute their block target.
*  Fixes an issue where PSPDFNoteAnnotation sometimes used the wrong overrideClassNames dict for lookup.
*  Fixes a situation where pdfViewController:didDisplayDocument: wasn't called correctly.
*  Fixes issue where in pageCurl mode after selecting a new color on iPhone the drawing overlay vanished.
*  Fixes crash when trying to change highlight annotation type on long-tap.
*  Adds a workaround for an UIKit bug that only appears on iOS 5 with videos that are playing inline and have a incorrect frame after exit from fullscreen.

### 2.6.1 - 10 Dec 2012

*  Video annotations can now have a specified offset. (e.g. offset=10) in seconds. Optional parameter.
*  PSPDFResizableView can now optionally be set in a way that it only allows moving, not resizing.
*  New toolbar style option in PSPDFViewController: useBorderedToolbarStyle. Will add regular bordered toolbar buttons. Optional.
*  tintColor can now be changed after the PSPDFViewController has been displayed.
*  Fixes an issue where video was autostarted even if autostart was set to NO.
*  Fixes an issue where the last toolbar item on the right toolbar could vanish if the style is bordered.
*  Fixes some issues regarding the textParser. More documents are now supported (especially with multiple nested XObject streams)
*  Fixes an issue where PSPDFStatusBarDisable could sometimes trigger statusbar showing/hiding.

### 2.6.0 - 9 Dec 2012

*  New feature: Add signature. It's enabled by default. If you don't need it, set the editableAnnotationTypes on PSPDFDocument.
*  New Opacity... menu item for Ink and Highlight annotations. This can be disabled via the menu delegates (PSPDFViewControllerDelegate)
*  New Create Annotations menu after a long-tap on a space without text or image. This is now enabled by default. See createAnnotationMenuEnabled on PSPDFViewController.
*  Improved text block detection (this also improves smart zoom)
*  New convenience method defaultAnnotationUsername in PSPDFDocument. You should set this to the user name if you're using annotations.
*  DualPage display will now center pages vertically if they don't have the same aspect ratio, and will draw a nicer shadow spanning exactly both page rects.
*  PSPDFProgressHUD now has support to show a circular progress status. (Try the new Dropbox upload sample)
*  Exposes applicationActivities and excludedActivities in PSPDFActivityBarButtonItem.
*  Adds support for Web/Email URLs in the PDF Outline.
*  Adds a workaround for an UIKit bug that could result in an partly unresponsive scrollView when zooming out programmatically all the way to zoomLevel 1.0 (e.g. after tapping an already zoomed in text block, only affected the default pageTransition, only on device)
*  If only Highlighting is allowed (and not Underscore or Strikeout), the Type... menu option will be hidden (since there is no point one could change it to)
*  PSPDFScrobbleBar now has left/rightBorderMargin properties. (e.g. to make space to a custom button at one end)
*  Allows subclassing of PSPDFThumbnailGridViewCell via overrideClassNames.
*  Uses the shared alpha property for fillColor, to be compliant to the PDF standard. (mostly affects shape annotations)
*  Ensure annotation selection is cleared before a pageCurl transition starts.
*  Simplifies toolbar code by removing the copiedToolbar subclasses. (This should not affect your code at all, simply found a better way to trigger UIKit to refresh the image property)
*  Fixes a rare crash for parsing certain MMType1 PDF fonts.
*  Fixes an issue where the annotation toolbar could be overlaid by the underlying toolbar buttons when the toolbar (not navigationBar) was updated afterwards.
*  Fixes an issue where the search highlighting was incorrectly applied on certain rotated documents.
*  Fixes a bug where under certain conditions the initial page set on the PSPDFViewController was ignored.
*  Fixes an issue where not rendered annotations where still selectable.
*  Fixes a situation where the PDF annotation user wasn't written unless contents was set.
*  Fixes an issue where the page offset for document providers sometimes was calculated incorrectly, this showing the wrong page labels.
*  Fixes a crash on iOS6 when viewMode was set to PSPDFViewModeThumbnails before the controller was actually displayed.
*  Fixes an issue where a late view frame change could result in an incorrectly rendered PDF view (black borders, could happen under certain conditions with Storyboarding)
*  Fixes a bug with using brightnessBarButtonItem on iPhone.
*  Fixes a situation where one could initiate a pageCurl during adding an annotation.
*  Titanium: Fixes an issue where setLinkAnnotationBorderColor would not work on the first page. Also adds support for "clear" color.

### 2.5.4 - 26 Nov 2012

*  Makes PSPDFLinkAnnotation writeable and adds a new targetString method to customize the preview URL that is displayed on a long press annotation.
*  PDF link annotations are now editable. This is not added by default. Enable this by adding PSPDFAnnotationTypeStringLink to the editableAnnotationTypes of PSPDFDocument.
*  PSPDFAnnotation now parses and write the name (NM) property. (Optional, used to uniquely identify PDF annotations)
*  Exposes some new methods in PSPDFNoteViewController.
*  Expose PSPDFPageView's showLinkPreviewActionSheetForAnnotation:fromRect:animated to allow customization of the link preview sheet (invoked on long press)
*  Ensures that the minimum size of annotations is not smaller than the current size (to prevent weird resizing)
*  Fixes a potential wrong private API detection issue where "visibleBounds" was incorrectly flagged.
*  Fixes an issue where the search controller was sometimes misplaced when search was directly invoked from the selected text.
*  Fixes an issue where scrolling was disabled when setting a document delayed in scrollperpage mode after no document was set before.
*  Fixes an UI glitch where the page label background was blurry for certain conditions.
*  Fixes a rare issue where the background color of a link annotation could get stuck when using inter-document links.

### 2.5.3 - 24 Nov 2012

*  Enables rendering of certain annotations as always overlay and still preserve movement features.
*  Fixes for text selection handling, especially for -90/270 degree rotated documents.
*  Fixes image selection rects for rotated documents.
*  Fixes a crash with searching certain arabic documents.
*  Fixes a one-pixel-bleedthrough in between the pages in dualPage / pageCurl mode.

### 2.5.2 - 22 Nov 2012

*  New convenience helper: setUpdateSettingsForRotationBlock in PSPDFViewController. (e.g. to switch between pageCurl and scrolling on rotation)
*  Moves the logic that returns the default classes for supported annotations out of PSPDFFileAnnotationProvider into PSPDFAnnotationProvider - so if the annotationProvider is customized to use only custom annotation providers, annotations will still work.
*  Handles corrupt PDF more gracefully, failing faster (esp. important if you're using a custom CGDataProvider)
*  Search no longer searches between words (but between lines)
*  API: Renamed fixedVerticalPositionForfitToWidthEnabledMode to fixedVerticalPositionForFitToWidthEnabledMode.
*  Turned on a lot more warnings (like missing newlines.) PSPDFKit is now warning free even under pedantic settings.
*  Fixes a UX issue where sometimes a second tap was needed to show the bookmark view controller.
*  Fixes a crash when deleting bookmarks that has a custom name.
*  Fixes the delegate call pdfViewController:annotationView:forAnnotation:onPageView: (wasn't called before due to a typo in the selector check)
*  Fixes an issue with generating link annotations in code using the initWithType initializer.
*  Fixes an issue where overrideClass wasn't checked for PSPDFWebViewController in one case.
*  Fixes an issue that could result in a non-rendered PSPDFPageView if the scrollView contentOffset was set manually without animation.
*  Fixes an issue where the text block detection could take a very long time on some documents.
*  Fixes an issue where a log warning was displayed when a highlight annotation was loaded from disk.
*  Fixes an issue where a low memory warning while editing annotation could lead to a non-scrollable document and/or a not saved annotation.
*  Fixes an issue where the keyboard was no longer displayed automatically for new text annotations on iPhone.
*  Fixes an issue where note/text annotations could be mis-placed when a document has a non-nil origin and a non-nil rotation value.

### 2.5.1 - 19 Nov 2012

*  Dismisses the search bar keyboard at the same time the popover fades out, not afterwards.
*  Exposes some more methods on PSPDFAnnotationToolbar.
*  Fixes an issue with text selection being offset/invalid for certain documents (this change fixes A LOT of documents that previously had problems)
*  Fixes an issue with text encoding on some PDFs.

### 2.5.0 - 17 Nov 2012

*  Images can now be selected and copied to the clipboard or saved to the camera roll. There's a new delegate to customize this.
*  A long-press on an annotation will switch over to edit-mode. Either moving if allowed, or showing the menu and cancelling the gesture if not.
*  Changes the default PDF Box back to kCGPDFCropBox. You can customize this with using the "PDFBox" property on PSPDFDocument.
*  Annotations can now be moved and resized, and the selection view is much sexier now (matches popular iOS apps like Pages)
*  Words are highlighted as they are being highlighted using the annotation toolbar.
*  Update color picker to include more colors and for better use space on iPhone 5 and iPad.
*  Default drawing color is now blue.
*  Highlight annotation color menu will now no longer show the currently used color and has a new option "Custom..." that will show the default color picker.
*  The options in PSPDFEmailBarButtonItem have been changed to a bit field, it's more flexible now. The flattenedAnnotations parameter is gone and is is now a subset of the bit field.
*  Annotation toolbar has now properties exposed for easy drawing color/width change.
*  Add initial implementation for stamp annotations (text and images are supported, no complex AP streams)
*  Support for "Named" PDF link annotations. (like NextPage/PrevPage/FirstPage/LastPage)
*  Add "Key" image for note annotations.
*  Add support for dashed borders on various annotation types.
*  PSPDFPageLabelView how shows a custom label for double page mode that displays all visible pages, not only the first. (2-3 of 42) instead of (2 of 42).
*  Refactoring of the search subsystem. Some methods have been renamed/deprecated. The interface is now much cleaner.
*  Search now search pages in the natural order, no longer visible pages first. You can revert this behavior change with setting searchVisiblePagesFirst to YES in PSPDFSearchViewController.
*  Search now also finds words that are split up via newline and/or a hyphenations character. This is enabled by default. See PSPDFTextSearch.compareOptions.
*  PSPDFSearchResult now has a PSPDFTextBlock as selection type (because it might have words on multiple lines). PSPDFSearchHighlightView now supports highlighting of multiple words.
*  Search now is more tolerant on single/double quotation marks.
*  Improves annotation toolbar animation for iPhone/landscape.
*  PSPDFHighlightAnnotation has a new helper "highlightedString" to get the string value of the highlighted area. Here, the document content is evaluated, since the annotation just contains CGRect values.
*  The annotation toolbar now remembers all last used colors per annotation type IF they are changed while the annotation toolbar is visible. (e.g. create yellow highlights, change annotation color to red, make new highlights -> red. But if you change color at a point where the annotation toolbar is closed, the color will not be remembered.)
*  PSPDFGlyph/PSPDFWord/PSPDFTextBlock frame now needs to be converted using the convertViewRectToGlyphRect/convertGlyphRectToViewRect to get the correct results.
*  New helper: PSPDFBezierPathGetPoints to convert UIBezierPaths into the representation needed in PSPDFInkAnnotation.
*  Adds some missing annotation change events.
*  A visible annotation toolbar will be removed when the viewController disappears.
*  Improved the performance of outline parsing and animation.
*  New HUD mode: PSPDFHUDViewAutomaticNoFirstLastPage - similar to PSPDFHUDViewAutomatic but doesn't show the HUD on the first/last page automatically.
*  Delegate didRenderPage:inContext: is now only called for current rendering. (not manual calls or cache)
*  PSPDFAnnotationToolbar now exposes cancelDrawingAnimated/doneDrawingAnimated to manually cancel/confirm a open drawing.
*  PSPDFSearchBarButtonItem, PSPDFOutlineBarButtonItem, PSPDFViewModeBarButtonItem can now also be overridden using overrideClassNames.
*  PSPDFOutlineParsers's isOutlineAvailable now parses the outline and always returns the correct value.
*  If the keyboard was displayed on a PDF password prompt, that is now hidden again after the viewController is removed from the view.
*  A single paged document is now displayed centered on pageCurl transition mode (instead of right-aligned)
*  Adds the iPod touch (4G) to the list of old devices, because that one has Retina but only 256MB RAM.
*  Allows click-through selection of annotations that are on different pages. (before, you needed sometimes one extra-touch to hide the current selection)
*  PSPDFGlyph, PSPDFWord, PSPDFTextLine and PSPDFTextBlock can now be properly compared using isEqual.
*  The text selection is now hidden before the callout menu hides, not afterwards (to match default iOS behavior)
*  On the Thickness... menu, the option that is currently active is hidden.
*  The link selection touch-down gray is now less dark to better match Apple's default look.
*  The tinted popover background is now retina optimized and no longer draws an arrow outside of the rounded corner area.
*  Fixes a potential stack overflow when parsing really large PDF outlines (>3000 items).
*  Fixes an UI issue where the annotation toolbar active mode overlay wasn't updated on an annotation frame change.
*  Fixes an UI bug where note annotations could show with an outdated view (e.g. no color change visible on page change)
*  Fixes a rare crash when searching certain documents.
*  Fixes a rare crash regarding ink annotation saving.
*  Fixes an issue where tapping on an empty HUD space would sometimes wrongly zoom out the view.
*  Fixes some minor issues with video cover.
*  Fixes some settings where didLoadPageView: was not called anymore.
*  Fixes a rare UIKit crash in UIPageViewController by adding a workaround.
*  Fixes a potential crash when hot-swapping the document from/to a 1-page document while using UIPageViewController in dual page mode.
*  Fixes an issue where the text selection menu sometimes wasn't correctly displayed on the right site of a zoomed in page in pageCurl mode.
*  Fixes a potential crash when a document was hot-swapped during a render operation.
*  Fixes a rare rendering issue with certain PDF documents that have weird rotation values.
*  Fixes an issue with the CMap parser where the second part of font ligatures was ignored. (See http://en.wikipedia.org/wiki/Typographic_ligature for details)
*  Fixes PSPDFProcessor's output of generatePDFFromDocument on rotated PDFs (documents had white border).
*  Fixes a issue where parsed text coordinates were offset on some non-standard PDFs that had both rotation and a non-null CropBox origin.
*  Makes custom implementations of `isEqual:` commutative when called with an instance of the superclass as the argument. (#7893)

KNOWN ISSUE: Annotations can't yet be moved *between* pages. This feature is on our roadmap.

### 2.4.0 - 2 Nov 2012

PSPDFKit now requires iOS 5.0+ and Xcode 4.5+ (iOS SDK 6.0) to compile. (Support for iOS 4.3/Xcode 4.4 has been removed, support for iOS 6.1 and Xcode 4.6b1 has been added.)

2.4 is a big release and a great new milestone of PSPDFKit. If you upgrade, make sure to read through the full header diffs to make sure methods you were calling/overriding still exist and are not moved.
Common methods like pageScrolling will always get a compatibility method for the time being. Methods/Properties are are deeper within the framework won't get a compatibility method, but it's usually pretty easy to figure out what the property was named before. I am planning on working on PSPDFKit for a long time, and as the API evolves, it's sometimes necessary to clean up and rename things so that the API stays clean and logical.

*  Huge refactoring of PSPDFAnnotationParser. It's now much easier to add custom annotation providers (see PSPDFAnnotationProvider). If you have subclassed saving/loading or other parts of PSPDFAnnotationParser, you most likely need to change this over to the new PSPDFFileAnnotationProvider.
*  Page scrolling is now even smoother. And finally removes the slight stuttering when pushing the PSPDFViewController - now animates like butter.
*  PSPDFShapeAnnotation can now be saved into the PDF.
*  Ink drawings can now customize the Thickness. Select an annotation and use the new "Thickness..." menu item.
*  Ink drawings and shape annotations can now also contain comment text.
*  Annotations now support the title/user "T" flag. Change the default user name by changing the property in PSPDFFileAnnotationProvider.
*  Add support for embedded and external RichMedia and Screen (Video) annotations of any size.
*  PSPDFBarButtonItem now has longPress-support. Long-Press on the bookmarkBarButtonItem to see the new PSPDFBookmarkViewController. Bookmarks can now also be renamed/reordered.
*  If there's no searchButton visible, the search invoked from the text selection menu now will originate from the selection rect.
*  The Open In... action now also works on multi-file documents and/or data/cgdocumentprovider based documents (will merge the document on-the-fly, shows a progress window if it'll take some time)
*  PSPDFBarButtonItem now also accepts a generic UIView as sender on presentAnimated:sender:. (makes it easier to manually call menu items from custom code)
*  Better support when barButtonItems are added to custom UIToolbars.
*  The internal used BarButtonItem subclasses are now exposed, so that they can be overridden and their icon changed.
*  New activityBarButtonItem to share pages to Facebook/Twitter on iOS6.
*  Double-Tapping on a video now enables full-screen (instead of zooming the page. This does not apply to YouTube movies)
*  Greatly improves handling of multiple video views on one page/screen.
*  Annotation views now have a optional xIndex. Video has a high index by default, so link annotations won't overlap a video anymore.
*  No longer allowing text selection above video annotations.
*  PSPDFDocument now has a new property 'PDFBox' to customize the used PDF box (ClipRect/MediaRect/etc).
*  PSPDFPositionView has been renamed to PSPDFPageLabelView. PSPDFPageLabelView and PSPDFDocumentLabelView are now easier skinable with the common superclass PSPDFLabelView.
*  PSPDFLabelView has now a second predefined style (PSPDFLabelStyleBordered)
*  PSPDFPageLabelView can now show a toolbar item. Check out the "Settings for a magazine" example how to enable this.
*  PSPDFLinkAnnotationView and the other multimedia annotation views can now be subclassed via overrideClassNames.
*  The Edit button for the text editor on note annotations can now be hidden. (showColorAndIconOptions)
*  UI: Moved the Edit button of the PSPDFNoteAnnotationController to the left side. (only visible for PSPDFNoteAnnotation)
*  Improves annotation parsing speed.
*  Shape/Circle annotations now correctly display their fillColor.
*  Improved color parsing for PSPDFFreeTextAnnotation (now honoring the default style string setting)
*  The icons in the viewModeBarButtonItem now have the same shadow as the toolbar icons (iPhone for now).
*  No longer displays annotation menus when they can't be saved (PSPDFKit Basic)
*  Expose outlineIntentLeftOffset and outlineIndentMultiplicator as properties on PSPDFOutlineViewController and PSPDFOutlineCell.
*  Exposes firstLineRect, lastLineRect and selectionRect on PSPDFTextSelectionView.
*  The text loupe now fades our correctly when in drag-handle-mode.
*  Improved caching of external resources like annotations/text glyphs on page init. Caching now won't overflow the dispatch queues anymore if A LOT of pages are loaded at the same time.
*  PSPDFWord now has a lineBreaker property to detect line changes.
*  PSPDFPageInfo now regenerates the pageRotationTransform when the pageRotation is changed manually.
*  PSPDFKit now checks if a URL can be handled by the system and weird/nonrecognizable URLS no longer open the "Leave Application" alert.
*  The PSPDFAnnotationBarButtonItem is now smart enough to choose the right animation depending if the toolbar is at the top/bottom (slide in/out from top/bottom)
*  Setting the UIPopoverController no longer removes preexisting passthroughViews.
*  The renderQueue now no longer renders the requested image if the delegate has been released in the mean time. (The delegate is now weak instead of strong)
*  UI: Undo/Redo buttons on the drawing toolbar are better placed on iPhone.
*  UI: The color selection button is now smaller on iPhone/Landscape.
*  API: PSPDFPageInfo is not calculated in PSPDFDocumentProvider. If you've overridden methods that affect PSPDFPageInfo in PSPDFDocument, you should move that code to a PSPDFDocumentProvider subclass.
*  API: "realPage" has been renamed to "page" and is now set-able. The old "page" has been renamed to "screenPage". This finally cleans up the confusion that has been around page and realPage. In 99% of all cases, you're just interested in page and can ignore screenPage. Please update your bindings accordingly. If you formerly did KVO on realPage, change this to page too. (There's a deprecated compatibility property for realPage, but not for the KVO event)
*  API: additionalRightBarButtonItems has been renamed to additionalBarButtonItems.
*  API: pageScrolling has been renamed to scrollDirection. A deprecated compatibility call has been added.
*  API: handleTouchUpForAnnotationIgnoredByDelegate has been moved to PSPDFAnnotationController.
*  API: pdfViewController has been renamed to pdfController on PSPDFTabbedViewController.
*  API: Warning! If you've used pspdf_dispatch_sync_reentrant in your own code, you now absolutely must create your dispatch queues with pspdf_dispatch_queue_create. Apple has deprecated dispatch_get_current_queue(), so we're now using a different solution. This will most likely affect you if you're using the "Kiosk" sample code of PSPDFCatalog.
*  Titanium: The pdfView now has a hidePopover(true) method so PSPDF popovers can better be coordinated with appcelerator code popovers.
*  Fixes the lag introduced in 2.3.x when tapping on the screen and the textParser hasn't been finished yet.
*  Fixes a potential crash when the view was removed on PSPDFKit Basic Titanium.
*  Fixes a potential crash when parsing the text of malformed PDFs.
*  Fixes a race condition during PSPDFFreeTextAnnotation drawing that could lead to a crash.
*  Fixes some issues with PSPDFPageScrollContinuousTransition when the document is invalid or view size is nil.
*  Fixes an issue where the background color of link annotations could get stuck.
*  Fixes an issue where PSPDFTabbedViewController did not properly align the tab bars in fullscreen mode.
*  Fixes an issue with creating PSPDFShapeAnnotation in code.
*  Fixes an issue where the isEditable flag on a PSPDFAnnotation was not honored when dragging note annotations.
*  Fixes an issue where the page could disappear on strong scrolling in pageCurl mode under iOS6.
*  Fixes an issue where scrolling on the tab bar (PSPDFTabbedViewController) sometimes didn't work.
*  Fixes an issue where the color picker was not properly displayed on bottom UIToolbars.
*  Fixes an UI issue where the selection and drawing of annotations on rotated pages was handled incorrectly.
*  Fixes an UI issue where the tabbed controller tabs could be mis-placed when rotating without visible HUD.
*  Fixes an UI issue where the thumbnails could slightly overlap the toolbar if the statusbar is transparent/auto-hiding.
*  Fixes several conditions where the PSPDFViewController could be deallocated on a background thread.
*  Fixes new warnings that popped up with Xcode 4.6. (pretty much all false positives)

### 2.3.4 - 18 Oct 2012

*  Fixes a rare race condition that could lead to a deadlock on initializing PSPDFDocumentProvider and PSPDFAnnotationParser.

### 2.3.3 - 18 Oct 2012

Note: This will be the last release that supports iOS 4.3*. The next version will be iOS 5+ only and will require Xcode 4.5+ (iOS SDK 6.0) If you're having any comments on this, I would love to hear from you: pspdfkit@petersteinberger.com
The binary variant is already links with SDK 6.0 and will not link with 5.1 anymore. (It still works down to iOS 4.3 though)

(*) There is no device that supports iOS 4.3 and can't be upgraded to iOS5, and PSPDFKit already dropped iOS4.2 and with it armv6 in 2.0.

*  PSPDFShapeAnnotation and PSPDFLineAnnotation can now be created programmatically.
*  New flag: kPSPDFLowMemoryMode that combines a lot of settings to ease memory pressure for complex apps.
*  Annotations now have a new flag: controls:false to hide browser/movie controls. If videos have controls disabled, they can be controlled via gestures. (tap=pause, pinch=full screen)
*  Text loupe now also moves if it's not anchored on a PSPDFPageView. (fixes stuck loupe issue)
*  Fixes a regression on view point restoration that could restore the view point at a different position.
*  Fixes an issue where the annotation toolbar could lock up rotation even after being dismissed.
*  Fixes an issue where bookmarks were checked for pages that were not visible.
*  Fixes the needless log statement "Password couldn't be converted to ASCII: (null)".
*  Fixes a text loupe regression where the loupe was not rotated on modal controllers.
*  Fixes a issue where in rare cases the document label (default displayed on iPhone only) was offset by a few pixels.

### 2.3.2 - 17 Oct 2012

*  The text loupe is now displayed above all other contents (navigation bar, status bar, …)
*  New status bar style: PSPDFStatusBarSmartBlackHideOnIpad, which now is also the new default (changed from PSPDFStatusBarSmartBlack). Will hide the HUD AND the statusbar on tap now both on iPhone and on iPad.
*  Improves Website->PDF conversion. Now supports Websites, Pages, Keynote, Excel, Word, RTF, TXT, JPG, etc... (see PSPDFProcessor. This is a PSPDFKit Annotate feature)
*  PSPDFKit now uses the MediaBox everywhere. Previously the CropBox was used for rendering, which can display areas that are only intended for printing. See http://www.prepressure.com/pdf/basics/page_boxes.
*  New additionalActionsButtonItem allowing the selection of the additional actions menu placement position. (Default is left next to the last rightBarButtonItem)
*  New initializer in PSPDFDocument that makes handling with single-file multiple-page documents much easier. (PDFDocumentWithBaseURL:fileTemplate:startPage:endPage:)
*  Add support for GoToR link annotations.
*  Add method to search for a specific page label. See PSCGoToPageButtonItem in PSPDFCatalog for an example how to use it. (DevelopersGuide.pdf has labels)
*  The page popover now shows the page label if one is set in the PDF (e.g. to replace numbers with roman numbering)
*  Links to the external applications (e.g. AppStore, Mail) are now detected and a alert view is displayed asking to open the application or not.
*  Add workaround for a UIKit issue in iOS5.x that would sometimes dismiss the keyboard when removing characters from the search view controller. (Issues has been fixed in iOS6)
*  Fixes a UI issue in search results. If a search result was found more than one time in a string, the first occurrence was marked bold. Now the actual result is marked bold.
   (This was mostly noticeable when searching for very small words)
*  Fixes a issue where too fast drawing could result in some lines now being displayed.
*  Fixes isLastPage/isFirstPage methods for landscape mode.
*  Fixes a issue where sometimes overrideClassNames for annotation was ignored.
*  Fixes a issue where the cache could return a wrong image in some rare cases.

### 2.3.1 - 11 Oct 2012

*  Fixes a potential memory corruption with PSPDFAESCryptoDataProvider.

### 2.3.0 - 11 Oct 2012

*  Experimental features: Add support to create PDF documents from html string or even a website.
*  Annotations now can be flattened before the document is sent via email. PSPDFEmailBarButtonItem has new options, and there is a new class PSPDFProcessor to generate new PDFs.
*  Outline elements that have no target page now no longer redirect to page 1 and will expand/collapse a section if there are child outline elements.
*  Add minimumZoomScale and setZoomScale:animated: to PSPDFViewController.
*  Glyphs that are outside of the page rect are now not displayed in the extracted text per default. You can restore the old behavior with setting PSPDFDocument's textParserHideGlyphsOutsidePageRect to YES.
*  Further tweaks for the iOS5 YouTube plugin version, ensure it's always correctly resized.
*  viewLockEnabled now also disables zooming with double tapping.
*  Don't show outline on search result if it's just one entry (most likely just the PDF name)
*  The keyboard of the note annotation controller now moves out at the same time as the popover dismisses (before keyboard animated out AFTER the popover animation)
*  Software dimming view now also covers the status bar.
*  Adding/Removing bookmarks now correctly hides any open popovers.
*  PSPDFCatalog: can now receive PDF documents from other apps.
*  PSPDFCatalog: added basic full-text-search feature across multiple documents.
*  Removed kPSPDFKitDebugMemory and kPSPDFDebugScrollViews.
*  API: renamed PSPDFSearchDelegate -> PSPDFTextSearchDelegate and added the PSPDFTextSearch class as parameter.
*  API: removes certain deprecated methods.
*  API: renamed kPSPDFKitPDFAnimationDuration to kPSPDFAnimationDuration.
*  Fixes possible inconsistency between displayed and used drawing color.
*  Fixes a race conditions when using appendFile: in PSPDFDocument and cacheDocument:startAtPage:size:.
*  Fixes a rotation issue when the annotation toolbar is displayed.
*  Fixes a issue where the popover of a ink annotation wasn't correctly sized.
*  Fixes a issue where the outline button was displayed when the document was invalid (instead of being hidden as expected)

### 2.2.2 - 5 Oct 2012

*  Properly restore the PSPDFLinkAnnotationView backgroundColor.

### 2.2.1 - 4 Oct 2012

*  The original backgroundColor of a PSPDFLinkAnnotationView is now preserved.
*  YouTube embedding now supported on iOS6.
*  Video embeddings with a cover image now don't show the cover if play has already been pressed after a page change.
*  Annotations now are cached much like UITableViewCells. (faster; preserve video state, etc)
*  Fixes a "sticky" scrolling issue that was introduced in 2.2.

### 2.2.0 - 4 Oct 2012

*  New scrolling mode: PSPDFPageScrollContinuousTransition (similar to UIWebView's default mode)
*  Support text selection on rotated PDF documents.
*  UIPopoverController is now styleable with a tintColor. This is enabled by default if tintColor is set. Use .shouldTintPopovers to disable this.
   As long as you use presentViewControllerModalOrPopover:embeddedInNavigationController:withCloseButton:animated:sender:options: your custom popovers will be styled the same way.
*  Adds support for adding annotations for double page mode on the right page. (Note: drawing still isn't perfect)
*  Add new property renderAnnotationTypes to PSPDFViewController to allow control about the types of annotations that should be rendered.
*  Add support for PDF Link Launch annotations (link to a different PDF within a PDF, see https://pspdfkit.com/guides/ios/current/annotations/link-annotations/)
*  Annotation selection is now smarter and selects the annotation that's most likely chosen (e.g. a small note annotation now is clickable even if it's behind a big ink drawing annotation)
*  It's now possible to properly select an annotation while in highlight mode.
*  Allow changing the drawing color using the menu. (invokes the color picker)
*  Add a isEditable property to be able to lock certain annotations against future edits.
*  Add printing support for small CGDataProviderRef-based PSPDFDocuments.
*  Improve OpenIn… feature, annotations are auto-saved before opening in another app and a log warning will be displayed for incompatible document compositions.
*  The password in PSPDFDocument is now saved and will be relayed to any added file (e.g. when using appendFile)
*  Improved performance for outline and annotation parsing (up to 400% faster, especially for large complex documents with huge outlines)
*  Massively improved performance for search, especially for documents with many fonts.
*  Text loupe is faster; less delays on the main thread when waiting for a textParser (more fine-grained locking)
*  PSPDFViewController now saves any unsaved annotation data when app moves to background.
*  Add PSPDFBrightnessBarButtonItem and optional software-dimming to darken the screen all the way down to black.
*  PSPDFDocuments objectsAtPDFRect:page:options: now can also search for annotations and text blocks.
*  Smart Zoom is now even smarter and picks the most likely tapped text block if the detection shows multiple overlaying blocks.
*  Adds Italian translation.
*  Restores PDF page label feature from version 1.
*  removeCacheForDocument:deleteDocument:error: now also removes any document metadata files (bookmarks, annotations [if they were saved externally])
*  The cancel button in PSPDFSearchViewController can now be localized.
*  PSPDFKit now uses UICollectionView on iOS6, and PSTCollectionView on iOS4/5.
*  When annotations are deserialized from disk, the proper annotation subclasses set in document.overrideClassNames will be used.
*  Ensure annotation toolbar is closed when view controller pops.
*  Thumbnails no longer are laid out behind the tab bar if PSPDFTabbedViewController is used. (they now correctly align beneath the bar)
*  Add workaround for a UIKit problem where a UIPopoverController could be resized to zero on iPad/landscape when it's just above the keyboard.
*  Greatly reduced the black hair line that was visible in double page modes between the pages. Should now be invisible in most cases.
*  The last used drawing color is now saved in the user defaults.
*  The bookmark image is now saved proportionally to the thumbnail image.
*  Ensures that for PSPDFTabbedViewController, tabs always have a title.
*  The close button added when using the presentModal: api of PSPDFViewController now uses the Done-button style.
*  API: bookmark save/load now exposes NSError object. Also new; clearAllBookmarks.
*  API: willStartSearchOperation:forString:isFullSearch: in PSPDFSearchOperationDelegate is now optional.
*  API: PSPDFDocument now implements PSPDFDocumentProviderDelegate and also is set as the default delegate.
*  API: PSPDFDocumentDelegate now has methods for didSaveAnnotations and failedToSaveAnnotations.
*  API: removeCacheForDocument:deleteDocument:waitUntilDone: is now removeCacheForDocument:deleteDocument:error: -
*  Fixes a rotation issue when the annotation toolbar is displayed use dispatch_async to make the call async..
*  API: tabbedPDFController:willChangeVisibleDocument: has been renamed to tabbedPDFController:shouldChangeVisibleDocument:
*  Fixes a bug where annotations were not saved correctly on multi-file documents when saving into external file was used. You need to delete the annotations.pspdfkit file in /Library/PrivateDocuments/UID to update to the new saving version (PSPDFKit still first tries to read that file to be backwards compatible)
*  Fixes freezing if there are A LOT of search results. They are not limited to 600 by default. This can be changed in PSPDFSearchViewController, see maximumNumberOfSearchResultsDisplayed.
*  Fixes a issue where similar PDF documents could create a equal UID when initialized via NSData.
*  Fixes "jumping" of the annotation toolbar when the default toolbar style was used.
*  Fixes calling the shouldChangeDocuments delegate in PSPDFTabbedViewController.
*  Fixes issue with rotation handling under iOS6.
*  Fixes a bug that prevented selecting annotations for documents with multiple files on all but the first file
*  Fixes a bug where the text editor sometimes could have a transparent background.
*  Fixes a toolbar bug when using UIStoryboard and modal transitions to PSPDFViewController.
*  Fixes a rare placement bug with the document title label overlay on iPhone.
*  Fixes a regression of 2.1 where search on iPhone sometimes didn't jump to the correct page.
*  Fixes issue with certain unselectable words.
*  Fixes always-spinning activity indicator when internal WebBrowser was closed while page was still loading. ActivityIndicator management now also can be customized and/or disabled.
*  Fixes a page displacement issue with pageCurl and the app starting up in landscape, directly showing a PSPDFViewController. (workaround for a UIKit issue; has been fixed in iOS6)
*  Fixes invalid page coordinates sent to didTapOnPageView:atPoint: delegate on right page in landscape mode.
*  Fixes a race condition where annotations could be missing on display after repeated saving until the document has been reloaded.
*  Fixes issue with word detection where sometimes words were split apart after the first letter on the beginning of a line.
*  Fixes viewState generation. (Was always using page instead of realPage which lead to errors when using landscape mode)
*  Fixes missing background drawing for shape annotations.
*  Fixes a issue where certain link-annotations did not work when using the long-press and then tap on the sheet-button way.
*  Fixes a rare bug where pages could been missing when reloading the view of the PSPDFPerPageScrollTransition in a certain way.
*  Fixes issue where viewLockEnabled was ignored after calling reloadData.

Known Issues:
*  Dragging note annotations from one page to another doesn't yet work.
*  Drawing across multiple pages doesn't yet work.

### 2.1.0 - 17 Sep 2012

*  New: PSPDFAESCryptoDataProvider. Allows fast, secure on-the-fly decryption of AES256-secured PDF documents. (PSPDFKit Annotate feature)
   Unlike NSData-based solutions, the PDF never is *fully* decrypted, and this even works with very large (> 100MB) documents.
   Uses 50.000 PBKDF iterations and a custom IV vector for maximum security.
   Includes the AESCryptor helper Mac app to properly encrypt your PDF documents.
*  Allow to customize caching strategy per document with the new cacheStrategy property.
   This is automatically set to PSPDFCacheNothing when using PSPDFAESCryptoDataProvider.
*  Annotations now have a blue selection view when they are selected.
*  Add Black and Red to general annotation color options.
*  Font name/size for FreeText annotations is now parsed.
*  Added write support for FreeText annotations.
*  Allow to show/edit the associated text of highlight annotations.
*  Improves extensibility of the annotation system with adding a isOverlay method to PSPDFAnnotation.
   (Instead of hard-coding this to Link and Note annotations)
*  Moves the clipsToBounds call in PSPDFPageView so that delegate can change this (of UIView <PSPDFAnnotationView>).
*  Adds static helper [PSPDFTextSelectionView isTextSelectionFeatureAvailable] to make runtime checks between PSPDFKit and PSPDFKit Annotate.
*  Adds new isWriteable static method to PSPDFAnnotation subclasses to determine what classes can be written back to PDF.
*  Add kPSPDFAllowAntiAliasing as optional render option.
*  PSPDFOpenInBarButtonItem no longer performs a check for compatible apps. Checking this is pretty slow. An info alert will be displayed to the user if no compatible apps are installed (which is highly unlikely for PDF). You can restore the original behavior with setting kPSPDFCheckIfCompatibleAppsAreInstalled to YES.
*  The viewState is now preserved when another controller is displayed/dismissed modally. This mostly happened with showing/hiding the inline browser or the note text controller on an iPhone. After that the zoom rate was reset; this is now properly preserved.
*  The annotation toolbar now flashes if the user tries to hide the HUD while the bar is still active (and blocking that)
*  Various performance optimizations; especially scrolling and initial controller creation.
*  Removes sporadic vertical transition of the navigationController's navigationBar when HUD faded out.
*  Fixes "Persistent Text Loupe" when moving over a link annotation while selecting.
*  Fixes a memory leak when CGDataProviderRef is used to initialize a PSPDFDocument.
*  Fixes a issue where the UI could sometimes freeze for a while waiting for background tasks in low-memory situations.
*  Fixes a issue where the popover page display wasn't hidden after a rotation.
*  Fixes a issue where sometimes the page was not correctly restored after rotation (was +1).
*  Fixes a issue where, if email wasn't configured on the device, the internal web browser would be launched with a mailto: link. Now a alert is displayed.
*  Fixes a issue where a page could, under certain rare conditions, escape the page tracking and be "sticky" behind the new managed page views.
*  Titanium: Add saveAnnotation method to manually save annotations (needed for createView, automatically called in showPDFAnimated).
*  Titanium: Limit usage of useParentNavigationBar to iOS5 and above.
*  Titanium: fixes a rare condition where using document.password to unlock sometimes resulted in an incorrect value for isLocked.

### 2.0.3 - 14 Sep 2012

*  Add a new "renderOptions" property to PSPDFDocument to fine-tune documents (e.g. fixes gray border lines in mostly-black documents)
*  Reduces file size of PSPDFKit.bundle by about 50%; improves speed of certain helper plists parsing.
*  Fixes potential category clashing
*  Fixes a bug that sneaked in because PSPDFKit is now compiled with Xcode 4.5. This release now also works with 4.4 for binary.

### 2.0.2 - 13 Sep 2012

*  Support for iPhone 5, Xcode 4.5, armv7s and the new screen resolution.
*  Supports a new cover property to have a custom cover screen for videos (big play button; custom preview-images)
*  Don't show browse popover/actionsheet for multimedia extensions during a long press.
*  Don't allow long-press over a UIControl. (e.g. a UIButton)
*  Fixes a issue where sometimes multimedia annotations would be added multiple times to the document.
*  Fixes a issue where sometimes you get blank space instead of a page when PSPDFPageRenderingModeFullPageBlocking and PSPDFPageScrollPerPageTransition was combined and the scrobble bar used heavily. This is a workaround for a UIKit bug.
*  Removes libJPGTurbo; Apple's own implementation has gotten faster (especially in iOS6)

### 2.0.1 - 12 Sep 2012

*  Faster search (document pattern detection if delayed until needed, outline results get cached)
*  Improved reaction time for complex PDF documents (e.g. annotations are only evaluated if they're already loaded; but won't lock the main thread due to lazy parsing)
*  Add additional checks so that even incorrectly converted NSURL-paths (where description instead of path has been called) work.
*  Fixes a issue where annotations were not saved with multiple-file documents on all but the first file.
*  Fixes problems where link annotations lost their page/link target after saving annotations into a file.
*  Fixes a problem where fittingWidth was always overridden when run on the iPhone.
*  Fixes a race condition in the new render stack that could lead to an assert in debug mode (non-critical)
*  Fixes the toolbar overlapping text issue in the PSPDFCatalog Kiosk Example; added comments how to work around that UIKit bug.
*  Made the pageRotation property of PSPDFPageInfo writeable; useful for manually rotation PDF documents.
*  Fixes some issues with the Titanium module; adds support for NavigationGroups.
*  Improved memory usage, especially on iPad1.

### 2.0.0 - 8 Sep 2012

PSPDFKit 2 is a major updates with lots of changes and a streamlined API.
There are some API deprecations and some breaking changes; but those are fairly straightforward and well documented.

You need at least Xcode 4.4.1 to compile. (Xcode 4.4/4.5 both run fine on Lion, Mountain Lion is not needed but recommended)
PSPDFKit 2 is compatible with iOS 4.3 upwards. (armv7, i386 - thus dropping iOS 4.2/armv6 from version 1)

The installation has been simplified. You now just drop the "PSPDFKit.embeddedframework" container into your project.
Next, enable the PSPDFKit.xcconfig project configuration. Here's a screenshot: http://cl.ly/image/1e1I2Z2e1D3F
(Select your project (top left), select project again in the PROJECT/TARGETS tree, select Info, then change in "Based on Configuration file" from None to PSPDFKit.)

If you have the sources and embed PSPDFKit as a subproject, don't forget to also add PSPDFKit.bundle.

MAJOR NEW FEATURES:
*  Text selection! (PSPDFKit Annotate) (Includes Copy, Dictionary, Wikipedia support)
*  Annotations! (PSPDFKit Annotate) Highlight, Underscore, Strikeout, Note, Draw etc. Annotations also will be written back into the PDF.
   There is a new annotationBarButtonItem that shows the new annotation toolbar.
*  Smart Zoom (Text blocks are detected and zoomed onto on a double-tap; much like Safari)
   The PDF is now also dynamically re-rendered at *every* zoom level for maximal sharpness and quality.
*  Customizable render modes (enable/disable use of upscaled thumbnails). PSPDFPageRenderingModeFullPageBlocking is great for magazines.
*  Greatly improved Search. Faster, parses more font styles, compatible with international characters (chinese, turkish, arabic, ...)
*  Site Bookmarks (see bookmarksBarButtonItem and PSPDFBookmarkParser)
*  Support for VoiceOver accessibility (yes, even within the PDF!)

Further, PSPDFKit has been improved in virtually every area and a lot of details have been tweaked.

*  Inline password view. (Before, just a empty screen was shown when document wasn't unlocked.)
*  Adobe DRM detection (They are just marked as not viewable, instead of showing garbage)
*  PDF rendering indicator. (see pdfController.renderAnimationEnabled)
*  Even better view reuse. PSPDFPageView is now reused, scrolling is even smoother.
*  PSPDFDocument can now be initialized with a CGDataProviderRef or a dataArray.
*  The search/outline controllers now dynamically update their size based on the content height.
*  The Table of Contents/Outline controller now shows titles in multiple lines if too long (this is customizable)
*  Support for Table Of Contents (Outline) linking to external PDF documents.
*  Page Content/Background Color/Inversion can now be changed to modify rendering.
*  On the iPhone, a new documentLabel shows the title. (the navigationBar is too small for this)
*  PSPDFScrobbleBar now uses the small height style on iPhone/Landscape.
*  PSPDFViewController can now programmatically invoke a search via searchForString:animated:.
*  PSPDFViewController now has a margin and a padding property to add custom margin/padding on the pdf view.
*  PSPDFViewController now has a HUDViewMode property to fine-tune the HUD.
*  PSPDFTabbedViewController now has a minTabWidth property (defaults to 100)
*  It's now possible to pre-supply even fully-rendered page images. PSPDFDocument's thumbnailPathForPage has been replaced with cachedImageURLForPage:andSize:.
*  PSPDFDocument now has a overrideClassNames dictionary, much like PSPDFViewController.
*  PSPDFDocument now has objectsAtPDFPoint/objectsAtPDFRect to return found glyphs and words.
*  PSPDFDocument now has convenience methods to render PDF content. (renderImageForPage:withSize:.../renderPage:inContext:...)
*  PSPDFDocument now exposes some more common metadata keys for the PDF metadata.
*  PSPDFDocument now has convenience methods to add and get annotations (addAnnotations:forPage:)
*  PSPDFDocument now has a property called annotationSaveMode to switch between PDF annotation embedding or an external file.
*  Support for documents with multiple sources(files/dataArray/documentProvider) is now greatly improved due to the new PSPDFDocument/PSPDFDocumentProvider structure.
*  PSPDFPageView now has convenience methods to calculate between PDF and screen coordinate space (convertViewPointToPDFPoint/convertPDFPointToViewPoint/etc)
*  PSPDFPageView no longer uses CATiledLayer; this has been replaced by a much faster and better custom solution.
*  PSPDFScrollView no longer accepts a tripple-tap for zooming out; this was a rarely-used feature in iOS and it increased the reaction time for the much more used double tap.
   Zooming in/out is now smarter (smart zoom) and does the right thing depending on the zoom position.
*  PSPDFWebViewController now supports printing.
*  A long-press on a PDF link annotation now shows the URL/Document/Page target in a popover.
*  When switching between DEMO/FULL; the change is automatically detected and the cache cleared. (No more watermark problems)
*  The image annotation view now properly displays and animates animated GIFs.
*  GMGridView has been replaced by the new and better PSCollectionView, which is a API compatible copy of UICollectionView.
*  Internal modernization; literals, subscripting, NS_ENUM, NS_OPTIONS.
*  Better internal error handling; more functions have error parameters.

Fixes/API changes:

*  The navigationBar title is no longer set on every page change.
*  PSPDFDocument's PDFDocumentWithUrl has been renamed to PDFDocumentWithURL.
*  Delegates are now called correctly (only once instead of multiple times) in pageCurl mode.
*  pdfViewController:willShowController:embeddedInController:animated: has been changed to (BOOL)pdfViewController:*SHOULD*ShowController:embeddedInController:animated:
*  tabbedPDFController:willChangeDocuments has been renamed to tabbedPDFController:shouldChangeDocuments.
*  New delegate: - (void)pdfViewController:(PSPDFViewController *)pdfController didEndPageDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate withVelocity:(CGPoint)velocity targetContentOffset:(inout CGPoint *)targetContentOffset -> completes dragging delegates; zooming delegates were already available in PSPDFKit 1.
*  Changed willShowController... delegate to shouldShowController... that returns a BOOL.
*  Fixes a problem in the annotation parser where some named page links failed to resolve properly.
*  Fixes a problem where the Cancel button of the additionalBarButtonItem menu wasn't fully touch-able on iPhone.
*  Fixes a problem with PSPDFBarButtonItem image updating.
*  Lots of other minor and major changes.

### 1.10.5 - 1 Aug 2012

*  Add a workaround for unusable back button in a certain unreleased version of iOS. (This is most likely a temporal iOS bug)
*  Improve PSPDFCloseBarButtonItem to be context-aware if we should close a modal view or pop from the navigation stack.
*  Fixes a issue where zooming was difficult on pages with lots of PDF link annotations.
*  Fixes two harmless warnings with Xcode 4.4.
*  Fixes the delete all tabs action sheet in the TabbedExample on iPhone.
*  Fixes a certain issue with embedding PSPDFViewController.
*  Fixes a rare memory leak when image decompression fails.

### 1.10.4 - 12 Jul 2012

*  New delegates: shouldScrollToPage, resolveCustomAnnotationPathToken.
*  If annotation is set to a file and this file doesn't exist, annotation type will be set to undefined.
*  Improve tap change speed and touch area of PSPDFTabbedViewController.
*  Another possible bugfix for UIPageViewController rotation changes.
*  Don't change navigationController if embedded into a parentViewController on default. (See useParentNavigationBar).
*  Allow to subclass PSPDFPageView via the overrideClassNames property in PSPDFViewController.
*  Allow parsing of PDF outlines with party invalid information.
*  Removed preloadedPagesPerSide. Changing this turned out to not bring any noticeable performance benefits.
*  Fixes a case where some link annotations were not correctly parsed.

### 1.10.3 - 22 Jun 2012

*  New property in PSPDFCache: downscaleInterpolationQuality (to control the thumbnail quality)
*  Add some improvements to caching algorithm, adds cacheThumbnailsForDocument to preload a document.
*  Ensures that email attachments will end with ".pdf".
*  Clear annotation cache in low memory situations. Helps for documents with lots of embedded videos.
*  Fixes a UI issue where the transition between content and thumbnails was sometimes incorrect on zoomed-in content.
*  Fixes a bug where the the pageIndex on thumbnails are off-by-one.
*  Fixes a bug where annotationEnabled wasn't correctly restored when using NSCoding on PSPDFDocument.
*  Fixed a problem where delegates where called too often for the initial reloadData event.
*  Fixes a potential crash on low-memory situations.
*  Fixes a potential crash with pageCurl mode and device rotations.
*  Fixes a crash when using a NSData-provided PSPDFDocument with no metadata title and using the sendViaEmail feature.
*  Fixes a issue with MPMoviePlayer disappearing during fullscreen-animation.

### 1.10.2 - 5 Jun 2012

*  New controller delegates: willShowViewController:animated: and didShowViewController:animated:.
*  New HUD visibility delegates: shouldShowHUD/shouldHideHUD/willShowHUD:/didShowHUD:/willHideHUD:/didHideHUD:
*  PageLabel on thumbnails is now width-limited to the maximal image size.
*  The default linkAction is now PSPDFLinkActionInlineBrowser (changed from PSPDFLinkActionAlertView).
*  The openIn action is now displayed in the iOS Simulator, but a UIAlertView shows that this feature only works on a real device.
*  PSPDFOutlineElement now implements NSCopying and NSCoding.
*  Page labels now work with documents containing multiple files.
*  Removed the searchClassName property in PSPDFSearchViewController. Use the overrideClassNames in PSPDFViewController to change this.
*  Renamed showCancel to showsCancelButton in PSPDFSearchViewController.
*  searchBar in PSPDFSearchViewController is now created in init, not viewDidLoad (so you can easily customize it)
*  Added new API items for PSPDFTabbedViewController and changed the API to initialize the controller. (You can also just use init)
*  On PSPDFDocument.title, the ".pdf" ending is now automatically removed.
*  New property in PSPDFViewController: loadThumbnailsOnMainThread. (Moved from PSPDFPageView, new default is YES)
*  Fixes a short black gap when loading the document under certain conditions w/o pageCurl-mode.
*  Fixes a bug where the new pdf path resolving function sometimes returned invalid strings.
*  Fixes a bug where changing left/rightBarButtonItems needed an additional call to updateToolbar to work. This is now implicit.
*  Fixes a bug where nilling out left/rightBarButtonItems after the controller has been displayed didm't correctly update the navigationBar.
*  Fixes a bug where the position of the initial page view could be smaller than the view in landscape mode.
*  Fixes a bug where the the titleView wasn't used to calculate the toolbarWidths.
*  Fixes a bug where the TabbedViewController's selected tab wasn't correctly updated when setting visibleDocument.
 * Fixes a bug where the TabbedViewController-preference enableAutomaticStatePersistance wasn't always honored.

### 1.10.1 - 29 May 2012

*  Improvement: Better handle toolbar buttons when a too long title is set. (now exposing minLeftToolbarWidth, minRightToolbarWidth)
*  Improvement: sometimes the NavigationBar was restored even if it wasn't needed.
*  Improvement: Don't reload frame if we're in the middle of view disappearing.
*  Improvement: Use default white statusBar with inline browser on iPhone.
*  Improves the document<->thumbnail transition with certain non-uniformed sized documents and pageCurl mode.
*  Fixes a case where the PSPDFPositionView wasn't correctly laid out.
*  Fixes a problem where the close button was disabled when no document was set.
*  Fixes a regression regarding pageCurl mode and activated isFittingWidth.
*  Fixes a regression regarding the viewModeButtonItem not being displayed correctly on appcelerator.
*  Fixes a problem where under certain conditions a landscape->portrait rotation
   in pageCurl mode on the last page performed a scroll to the first page.
*  Fixes a leak in PSPDFActionSheet.

### 1.10.0 - 25 May 2012

This will probably be the last major release in the 1.x branch.
Work on 2.x is already underway, with a focus on text selection and annotations.

This release has some API-breaking changes:

* New toolbar handling (breaking API change)
  The properties searchEnabled, outlineEnabled, printEnabled, openInEnabled, viewModeControlVisible
  have been replaced by a much more flexible system based on the PSPDFBarButtonItem class.

  For example, to add those features under the "action" icon as a menu, use this:
  self.additionalRightBarButtonItems = [NSArray arrayWithObjects:self.printButtonItem, self.openInButtonItem, self.emailButtonItem, nil];
  If you're looking to e.g. remove the search feature, set a new rightBarButtonItems array that excludes the searchButtonItem.

  Likewise, the functions additionalLeftToolbarButtons, magazineButton and toolbarBackButton have been unified to self.leftBarButtonItems.
  If you want to replace the default closeButton with your own, just create your own UIBarButtonItem
  and set it to self.leftBarButtonItems = [NSArray arrayWithObject:customCloseBarButtonItem];

* Resolving pdf link paths has changed. (breaking API change)
  Previously, if no marker like "Documents" or "Bundle" was found, we resolved to the bundle.
  This version changes resolving the link to the actual position of the pdf file.
  If you need the old behavior, you can set PSPDFResolvePathNamesEnableLegacyBehavior to YES or use a custom subclass of the PSPDFAnnotationParser.

*  New class PSPDFTabbedViewController, to show multiple PSPDFDocuments with a top tab bar. iOS5 only. (includes new TabbedExample)
*  New feature: PDF page labels are parsed. (e.g. roman letters or custom names; displayed in the PSPDFPositionView and the thumbnail label)
*  New feature: send via Email: allows sending the pdf as an attachment. (see emailButtonItem in PSPDFViewController)
*  New feature: PSPDFViewState allows persisting/restoring of a certain document position (including page, position, zoom level).
   See documentViewState and restoreDocumentViewState:animated: in PSPDFViewController.
*  Add support for puny code characters in pdf URLs (like http://➡.ws/鞰齒). This uses the IDNSDK.
*  New property: useParentNavigationBar, if you embed the PSPDFViewController using iOS5 containment and still want to populate the navigationBar.
*  New property: pageCurlDirectionLeftToRight to allow a backwards pagination. (for LTR oriented documents)
*  New delegate: delegateDidEndZooming:atScale to detect user/animated zooming.
*  UI Improvement: Show URL in embedded browser title bar, until page is loaded with the real title.
*  General: Add french localization in PSPDFKit.bundle.
*  Core: PSPDFDocument now implements NSCopying and NSCoding protocols.
*  Fixes a problem where links with hash bangs (like https://twitter.com/#!/) where incorrectly escaped.
*  Fixes opening certain password protected files.
*  Fixes unlockWithPassword always returning YES, even with an incorrect password.
*  Fixes a crash regarding pageCurl and UpsideDown orientation on the iPhone.
*  Fixes a problem where the search delegates where called after canceling the operation.
*  Fixes a problem where the page wasn't re-rendered if it was changed while zoom was active.
*  Fixes a problem where the tile wasn't updated after setting document to nil.
*  Fixes a problem where under rare conditions a spinlock wasn't released in PSPDFGlobalLock.
*  Adds support for Xcode 4.4 DP4. Due to an already acknowledged Apple linker bug. Xcode 4.4 DP5 is currently broken. (Xcode 4.3.2 is still recommended)
*  Titanium: New min SDK is 2.0.1.GA2.

### 1.9.15 - 20 Apr 2012

*  New delegate: pdfViewController:didEndPageScrollingAnimation: to detect if a scroll animation has been finished.
   This will only be called if scrollToPage:animated: is used with animated:YES. (not for manual user scrolling)
*  Additional safeguards have been put in place so that videos don't start playing in the background while scrolling quickly.

### 1.9.14 - 20 Apr 2012

*  Adds support for Xcode 4.4 DP3.
*  Show document back button even if PSPDFViewController is embedded in a childViewController.
*  Doesn't try to restore the navigation bar if we're the only view on the navigation stack.
*  Allow PSPDFSearchHighlightView to be compatible with overrideClassNames-subclassing.
*  Works around some broken annotations that don't have "http" as protocol listed (just www.google.com)
*  PSPDFPageView now has convertViewPointToPDFPoint / convertPDFPointToViewPoint for easier annotation calculation.
*  There are also some new PSPDFConvert* methods in PSPDFKitGlobal that replace the PSPDFTiledView+ categories. (API change)
*  YouTube embeds finally support the autostart option. (Note: This might be flaky on very slow connections)
*  Fixes a big where some documents would "shiver" due to a 1-pixel rounding bug.
*  Fixes a regression with KVO-observing viewMode.
*  Fixes a UI glitch with animated pageScrolling on pageCurl if invoked very early in the view build hierarchy.
*  Fixes a problem where video was playing while in thumbnail mode.

### 1.9.13 - 7 Apr 2012

*  Zooming out (triple tap) doesn't scroll down the document anymore, only moves the zoom level to 1.0.
*  Better handling of light/dark tintColors.
*  ScrobbleBar is now colored like the navigationBar. (check for HUD changes/regressions in your app!)
*  The status bar now moves to the default color on the iPhone for ToC/Search views.
*  Fixes an alignment problem with the thumbnail animation.
*  Disable user interaction for very small links, that are not shown anyway.
*  YouTube videos now rotate and resize correctly.

### 1.9.12 - 2 Apr 2012

*  Thumbnails now smoothy animate to fullscreen and back. (new setViewMode animation instead of the classic fade)
*  Fullscreen video is now properly supported with pageCurl. (with the exception of YouTube)
*  Annotation views are now reused -> better performance.
*  The outline controller now remembers the last position and doesn't scroll back to top on re-opening.
*  Hide HUD when switching to fullscreen-mode with videos.
*  Don't allow touching multiple links at the same time.
*  Transition between view modes are now less expensive and don't need view reloading. Also, zoom value is kept.
*  The pageInfo view now animates. (Page x of y)
*  The grid now properly honors minEdgeInsets on scrolling.
*  Thumbnail page info is now a nice rounded label.
*  Fixes partly missing search highlighting on the iPhone.
*  Fixes a few calculation errors regarding didTapOnPageView & the PSPDFPageCoordinates variable.
*  Fixes a problem where caching sometimes was suspended and got stuck on old devices.
*  Free more memory if PSPDFViewController is not visible.

### 1.9.11 - 28 Mar 2012

*  Add more control for pageCurl, allows disabling the page clipping. (better for variable sized documents)
*  New method on PSPDFDocument: aspectRatioVariance. Allows easy checks if the document is uniformly sized or not (might be a mixture of portrait/landscape pages)
   There is example code in PSPDFExampleViewController.m that shows how this can be combined for dynamic view adaption.
*  Support for Storyboarding! You can create a segway to a PSPDFViewController and even pre-set the document within Interface Builder.
   There now is a new example called "StoryboardExample" that shows how this can be used. (iOS5 only)
*  Note: if you use IB to create the document, you just use a String. Supported path expansions are Documents, Cache, Bundle. Leave blank for Bundle.
*  Changes to navigationBar property restoration - now animates and also restores alpha/hidden/tintColor. Let me know if this breaks something in your app!
*  Fixes a potential crash with a controller deallocation on a background thread.
*  Fixes a potential crash when searching the last page in double page mode.
*  Fixes a regression introduced in 1.9.10 regarding a KVO deallocation warning.

### 1.9.10 - 26 Mar 2012

*  Greatly improved performance on zooming with the new iPad (and the iPhone4).
*  Add support for printing! It's disabled by default. Use printEnabled in PSPDFViewController. (thanks to Cédric Luthi)
*  Add support for Open In...! It's disabled by default. Use openInEnabled in PSPDFViewController.
*  Improved, collapsable outline view. (Minor API changes for PSPDFOutlineParser)
*  Improved speed with using libjpeg-turbo. Enabled by default.
*  PSPDFStatusBarIgnore is now a flag, so the status bar style (which infers the navigation bar style) can now been set and then marked as ignore.
*  New property viewModeControlVisible, that shows/hides the toolbar view toggle.
*  Removes the UIView+Sizes category, that was not prefixed.
*  Remove custom PNG compression, performance wasn't good enough.
*  Internal GMGridView is now prefixed.
*  Disable implicit shadow animation when grid cell size changes.
*  Fixes a bug regarding slow rotation on the new iPad.
*  Fixes a bug where sometimes a pdf document wasn't unlocked correctly.
*  Fixes a potential problem where search/table of contents doesn't actually change the page on the iPhone.
*  Fixes some problems with Type2 Fonts on search.
*  Fixes a rare crash when rotating while a video is being displayed.

### 1.9.9 - 15 Mar 2012

*  Icons! (changed outline icon, and replaced "Page" and "Grid" with icons)
*  Outline controller now has a title on the iPad.
*  Fixes a regression where the toolbar color was not correctly restored on the iPhone when modal controller were used.

### 1.9.8 - 14 Mar 2012

*  Fixed a minor regression regarding scrobble bar updating.
*  Fixed issue where frame could be non-centered in pageCurl mode with some landscape documents when the app starts up in landscape mode.

### 1.9.7 - 14 Mar 2012

*  PSPDFKit is now compiled with Xcode 4.3.1 and iOS SDK 5.1. Please upgrade. (It is still backwards compatible down to iOS 4.0.)
*  Allow adding the same file multiple times to PSPDFDocument.
*  Links are now blue and have a higher alpha factor. (old color was yellow and more obtrusive)
*  The animation duration of annotations is now customizable. See annotationAnimationDuration property in PSPDFViewController.
*  Link elements are not shown with exact metrics, and touches are tested for over-span area. Also, over-span area is now 15pixel per default. (old was 5)
*  Link elements now don't interfere with double/triple taps and only fire if those gestures failed.
*  Link elements no longer use an internal UIButton. (they are now handled by a global UITapGestureRecognizer)
*  Annotations are not size-limited to the actual document, no more "bleeding-out" of links.
*  Minimum size for embedded browser is now 200x200. (fixes missing Done button)
*  Inline browser can now also be displayed within a popover, using pspdfkit://[popover:YES,size:500x500]apple.com
*  Text highlighting is still disabled by default, but can be enabled with the new property createTextHighlightAnnotations in PSPDFAnnotationParser.
*  Fixes an issue where the navigation bar was restored too soon. Let me know if this change breaks behavior on your app.
   (The navigationBar is now restored in viewDidDisappear instead of viewWillDisappear, and also will be set in viewWillAppear)
*  Support tintColor property for inline browser.
*  Better support for invalid documents (that have no pages.) HUD can't be hidden while a document is invalid. UI buttons are disabled.
*  Fixes problem where link taps were not recognized on the site edges, advancing to the next/prev page instead in pageCurl mode.
*  Fixes issue where scrollOnTapPageEndEnabled setting was not honored in pageCurl mode.
*  Fixes a problem where the embedded mail sheet sometimes couldn't be closed.
*  Fixes a problem where touch coordinates on annotations where always in the frame center instead of the actual tap position.
*  Fixes a problem where adding items to the cache would sometimes spawn too much threads.
*  Fixes a potential crash in the inline browser.
*  Fixes a potential crash with accessing invalid memory on pageCurl deallocation.
*  Fixes a issue where certain URLs within pdf annotations were not correctly escaped.
*  Fixes a situation where the thumbnail grid could become invisible when rapidly switched while scrolling.
*  Fixes an issue where the HUD was hidden after a page rotate (which should not be the case)
*  Fixes weird animation with the navigationController toolbar when opening the inline browser modally.

### 1.9.6 - 6 Mar 2012

*  New Inline Browser: PSPDFWebViewController. Annotations can be styled like pspdfkit://[modal:YES,size:500x500]apple.com or pspdfkit://[modal:YES]https://gmail.com.
*  New property in PSPDFViewController: linkAction. Decides the default action for PDF links (alert, safari, inline browser)
*  Add PSPDFStatusBarIgnore to completely disable any changes to the status bar.
*  Automatically close the Table of Contents controller when the user tapped on a cell.
*  Fixes sometimes missing data in the pageView didShowPage-delegate when using pageCurl mode.
*  Fixes (another) issue where status bar style was not restored after dismissing while in landscape orientation.
*  Fixes a severe memory leak with pageCurl mode.

### 1.9.5 - 5 Mar 2012

*  Further tweaks on the scrobbleBar, improves handler in landscape mode. (thanks to @0xced)
*  Fixes a problem with pageCurl and the animation on the first page (thanks to Randy Becker)
*  Fixes an issue where double-tapping would zoom beyond maximum zoom scale. (thanks to Randy Becker)
*  Fixes issue where status bar style was not restored after dismissing while in landscape orientation. (thanks to Randy Becker)
*  Fixes some remote image display issues in the PSPDFKit Kiosk Example.
*  Fixes a regression with opening password protected pdf's.

### 1.9.4 - 4 Mar 2012

*  Fixes a regression from 1.9.3 on single page documents.

### 1.9.3 - 1 Mar 2012

*  Improves precision and stepping of the scrobbleBar. Now it's guaranteed that the first&last page are shown, and the matching between finger and page position is better.
*  Fixes a problem where sometimes page 1 should be displayed, but isn't in pageCurl mode.
*  Hide warnings for rotation overflow that UIPageViewController sometimes emits.

### 1.9.2 - 1 Mar 2012

*  pageCurl can now be invoked from the edge of the device, even if the file is smaller. Previously, the gesture was not recognized when it wasn't started within the page view.
*  The incomplete support for text highlighting has been disabled.
*  removeCacheForDocument now has an additional parameter waitUntilDone. The previous behavior was NO,
   so just set NO if you use this and upgrade from an earlier release.
*  Fixes a potential cache-loop, where the device would constantly try to load new images.
*  Adds a sanity check for loading images, fixes a rare issue with images not showing up.

### 1.9.1 - 17 Feb 2012

*  Allow scrolling to a specific rect and zooming:
   see scrollRectToVisible:(CGRect)rect animated:(BOOL)animated and (void)zoomToRect:(CGRect)rect animated:(BOOL)animated;
*  PSPDFAnnotationParser now allows setting custom annotations. (to complement or override pdf annotations)
*  New annotation type: Image. (jpg, png, tiff and all other formats supported by UIImage)
*  Better handling of situations with nil documents or documents where the actual file is missing.
*  Better alignment of the scrobble bar position image.
*  Add "mp4" as supported audio filetype.
*  Fixes ignored scrollingEnabled on PSPDFPageViewController.
*  Fixes event delegation in the Titanium module.
*  Fixes the method isFirstPage (checked for page = 1, but we start at page 0).
*  Renamed kPSPDFKitDebugLogLevel -> kPSPDFLogLevel.

### 1.9.0 - 13 Feb 2012

*  PageCurl mode. Enable via setting "pageCurlEnabled" to YES. iOS5 only, falls back to scrolling on iOS4.
*  It's now possible to create a PSPDFDocument with initWithData! (thanks to @0xced)
*  Add support for pdf passwords! (Thanks to Steven Woolgar, Avatron Software)
*  Adds support for setting a custom tintColor on the toolbars.
*  Fixes a problem with PSPDFPageModeAutomatic and portrait/landscape page combinations.
*  Fixes various problems with __weak when the development target is set to iOS5 only.
*  Adds additional error checking when a context can't be created due to low memory.
*  Fixes flaky animations on the Simulator on the grid view.
*  Improves usage of PSPDFViewController within a SplitViewController (thanks to @0xced).
*  Removes a leftover NSLog.
*  Fixes a UID clashing problem with equal file names. Warning! Clear your cache, items will be re-generated in 1.9 (cache directories changed)
*  Fixes a bug with replacing local directory path with Documents/Cache/Bundle. (thanks to Peter)
*  Fixes a retain cycle in PSPDFAnnotationParser (thanks to @0xced).
*  Fixes a retain cycle on UINavigationController (thanks to Chan Kruse).
*  Fixes a problem where the scrobble bar tracking images were sometimes not updated.
*  Fixes a rare race condition where rendering could get stuck.
*  Improves handling of improper PSPDFDocument's that don't have a uid set.
*  Allow adding of UIButtons to gridview cells.
*  Added "Cancel" and "Open" to the localization bundle. (mailto: links)
*  Setting the files array is now possible in PSPDFDocument.
*  The cache now uses MD5 to avoid conflicts with files of the same name. (or multiple concatenated files)
*  Better handling of rendering errors (error objects are returned)
*  Search controller is now auto-dismissed when tapped on a search result.
*  PSPDFPositionView more closely resembles iBooks. (thanks to Chan)
*  PDF cache generation is no no longer stopped in the viewWillDisappear event (only on dealloc, or when document is changed)
*  Titanium: Add ability to hide the close button.

Note: For pageCurl, Apple's UIPageViewController is used. This class is pretty new and still buggy.
I had to apply some private API fixes to make it work. Those calls are obfuscated and AppStore-safe.

If you have any reasons to absolutely don't use those workarounds, you can add
_PSPDFKIT_DONT_USE_OBFUSCATED_PRIVATE_API_ in the preprocessor defines.  (only in the source code variant)
This will also disable the pageCurl feature as the controller will crash pretty fast when my patches are not applied.

Don't worry about this, I have several apps in the store that use such workarounds where needed, it never was a problem.
Also, I reported those bugs to Apple and will keep track of the fixes,
and remove my workarounds for newer iOS versions if they fix the problem.

### 1.8.4 - 27 Dec 2011

*  Fixes a problem where search highlights were not displayed.
*  Updated git version scripts to better work with branches. (git rev-list instead of git log)

### 1.8.3 - 26 Dec 2011

*  Update internally used TTTAttributedString to PSPDFAttributedString; prevent naming conflicts.
*  Fallback to pdf filename if pdf title is set but empty.
*  pageMode can now be set while willAnimateRotationToInterfaceOrientation to customize single/double side switching.
*  Fixes a problem with the document disappearing in certain low memory situations.

### 1.8.2 - 25 Dec 2011

*  Uses better image pre-caching code; now optimizes for RGB screen alignment; smoother scrolling!
*  Fixes a regression with scrobble bar hiding after animation.
*  Fixes wrong toolbar offset calculation on iPad in landscape mode.
*  Various performance optimizations regarding CGPDFDocument, HUD updates, thumbnails, cache creation.
*  Lazy loading of thumbnails.

### 1.8.1 - 23 Dec 2011

*  UINavigationBar style is now restored when PSPDFViewController is popped back.
*  Annotation page cache is reset when protocol is changed.
*  Fixes Xcode Archive problem because of public header files in PSPDFKit-lib.xcodeproj
*  Fixes a regression with the Web-AlertView-action not working.

### 1.8.0 - 21 Dec 2011

*  Search Highlighting! This feature is still in BETA, but already works with many documents. If it doesn't work for you, you can disable it with changing the searchMode-property in PSPDFDocumentSearcher. We're working hard to improve this, it just will take some more time until it works on every document. As a bonus, search is now fully async and no longer blocks the main thread.

*  ARC! PSPDFKit now internally uses ARC, which gives a nice performance boost and makes the codebase a lot cleaner. PSPDFKit is still fully compatible with iOS4 upwards. You need to manually include libarclite.so if you are not using ARC and need compatibility with iOS4. Check the MinimalExample.xcodeproj to see how it's done. (You can drag the two libarclite-libraries directly in your project). If you use the PSPDFKit-lib.xcodeproj as a submodule, you don't have to think about this, Xcode is clever enough to not expose this bug here. See more about this at https://pspdfkit.com/guides/.

*  New default shadow for pages. More square, iBooks-like. The previous shadow is available when changing shadowStyle in PSPDFScrollView. The shadow override function has been renamed to pathShadowForView.
*  New: PSPDFDocument now uses the title set in the pdf as default. Use setTitle to set your own title. Title is now also thread-safe.
*  New Thumbnail-Framework (removed AQGridView). Faster, better animations, allows more options. Thumbnails are now centered. You can override this behavior with subclassing gridView in PSPDFViewController.
*  New: HUD-elements are now within hudView, hudView is now a PSPDFHUDView, lazily created.
*  New: Page position is now displayed like in iBooks at the bottom page (title is now just title)
*  Changed: Videos don't auto play per default. Change the url to pspdfkit[autoplay:true]://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8 to restore the old behavior (or use delegates).
*  Changed: viewMode does not longer animate per default. Use the new setViewMode:animated: to change it with animation.
*  Changed: the left section of the toolbar now uses iOS5-style leftToolBarButtons if available; falls back to custom UIToolBar in iOS4.
*  Shortly pressed link targets are now highlighted with a minimum duration.
*  Alert is no longer displayed for URLs that can't be opened by the system.
*  Support detection of "m4v" as video annotation.
*  Improves performance when caching very large documents.
*  Expose the borderColor of PSPDFLinkAnnotationView; set in one of the delegates.
*  Removes a lot of glue code and switches to KVO for many view-related classes (Scrobble Bar)
*  Add methods to check if PSPDFPageInfo is already available, improves thumbnail speed.
*  Add generic support to override classes. See the property "overrideClassNames" for details. This replaces "scrollViewClass" and "scrobbleBarClass" and is much more flexible. Just use a key/value pair of NSStrings with default/new class names and your custom subclass will be loaded.
*  setScrobbleBarEnabled is now animatable.
*  The protocolString for the multimedia link annotation additions can now be set in PSPDFAnnotationParser (defaults to pspdfkit://).
*  didTapOnPage is now didTapOnPageView, the former is deprecated.
*  PSPDFPageCoordinates now show a nice description when printed.
*  Many deprecated delegate calls have been removed. Check your calls.
*  Version number is now directly written from the git repository. (PSPDFVersionString() is now more accurate)
*  When a link annotation is tapped, the HUD no longer shows/hides itself.
*  HUD show/hide is now instant, as soon as scrolling is started. No more delays.
*  Scrollbar is now only changed if controller is displayed in full-screen (non-embedded).
*  Fixes a issue where PSPDFKit would never release an object if annotations were disabled.
*  Fixes a bug where the outline was calculated too often.
*  Fixes an issue where the title was re-set when changing the file of a pdf.
*  Fixes problems with syntax highlighting of some files. Xcode 4.3 works even better; use the beta if you can.
*  Fixes a bug with video player when auto play is not enabled.
*  Fixes encoding for mailto: URL handler (%20 spaces and other encoded characters are now properly decoded)
*  Fixes potential crash with recursive calls to scrollViewDidScroll.
*  Fixes a rare crash when delegates are changed while being enumerated.
*  Lots of other small improvements.

### 1.7.5 - 1 Dec 2011

*  Fixes calling the deprecated delegate didShowPage when didShowPageView is not implemented. (thanks Albin)

### 1.7.4 - 29 Nov 2011

*  Custom lookup for parent viewcontroller - allows more setups of embedded views.
*  Fixes a crash related to parsing table of contents.

### 1.7.3 - 29 Nov 2011

*  Add a log warning that the movie/audio example can crash in the Simulator. Known Apple bug. Doesn't happen on the device.
*  PSPDFCache can now be subclassed. Use kPSPDFCacheClassName to set the name of your custom subclass.
*  Fixes a bug where scrollingEnabled was re-enabled after a zoom operation.

### 1.7.2 - 29 Nov 2011

*  Changes delegates to return PSPDFView instead of the page: didShowPageView, didRenderPageView.
*  Improve zoom sharpness. (kPSPDFKitZoomLevels is now set to 5 per default from 4; set back if you experience any memory problems on really big documents.)
*  Increase tiling size on iPad1/older devices to render faster.
*  Reduce loading of unneeded pages. Previously happened sometimes after fast scrolling. This also helps when working with delegates.
*  Fixes a locking race condition when using PSPDFDocument.twoStepRenderingEnabled.

### 1.7.1 - 29 Nov 2011

*  Fixes a rare crash when encountering non-standardized elements while parsing the Table of Contents.

### 1.7.0 - 28 Nov 2011

*  PSPDFKit now needs at least Xcode 4.2/Clang 3.0 to compile.
*  Following new frameworks are required: libz.dylib, ImageIO.framework, CoreMedia.framework, MediaPlayer.framework, AVFoundation.framework.
*  Images are now compressed with JPG. (which is usually faster) If you upgrade, add an initial call to [[PSPDFCache sharedPSPDFCache] clearCache] to remove the png cache. You can control this new behavior or switch back to PNGs with PSPDFCache's useJPGFormat property.
*  Optionally, when using PNG as cache format, crushing can be enabled, which is slower at writing, but faster at reading later on. (usually a good idea!)

*  New multimedia features! Video can now be easily embedded with a custom pspdfkit:// url in link annotations. Those can be created with Mac Preview.app or Adobe Acrobat. Try for example "pspdfkit://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8" to get the HTTP Live streaming test video.

*  Link annotations are now UIButtons. This allows more interactivity (feedback on touch down), and also changes the default implementation of PSPDFDocument's drawAnnotations function to be empty. Clear the cache after updating, or else you get two borders. You can also return to the old behavior if you return NO on shouldDisplayAnnotation (PSPDFViewControllerDelegate) anytime an annotation of type PSPDFAnnotationTypeLink is sent.

*  Localization is now handled via the PSPDFKit.bundle. You can either change this, or use PSPDFSetLocalizationDictionary to add custom localization.

*  PSPDFLinkAnnotation is renamed to PSPDFAnnotation and adds a new helper function to get the annotation rect.
*  PSPDFPage is refactored to PSPDFPageView and is now the per-page container for a document page. The delegate methods have been changed to return the corresponding PSPDFPageView. Within PSPDFPageView, you can get the parent scrollview PSPDFScrollView.
*  PSPDFPageModeAutomatic is now more intelligent and only uses dual page mode if it actually improves reading (e.g. no more dual pages on a landscape-oriented document)
*  PSPDFKitExample: fixes delete-image positioning in long scroll lists.
*  new: use PSPDFPageInfo everywhere to allow custom rotation override. (- (PSPDFPageInfo *)pageInfoForPage:(NSUInteger)page pageRef:(CGPDFPageRef)pageRef)
*  new delegate options to allow dynamic annotation creation.
*  Better size calculation for the toolbar, allows changing titles to longer/shorter words and resizing automatically.
*  PSPDFDocument now uses the title of the pdf document (if available). You can override this with manually setting a title.
*  New option "scrollingEnabled" to be able to lock scrolling. (e.g. when remote controlling the pdf)
*  Improves speed on image pre-caching.
*  Improves documentation.
*  Fixes a rotation problem with the last magazine page.
*  Fixes a bug where scrollPage w/o animation didn't show the page until the user scrolled.
*  Fixes a potential crash when view was deallocated while popover was opened.
*  Fixes a deadlock with clearCache.

### 1.6.20 - 18 Nov 2011

*  fixes possible cache-reload loop with page-preload if non-odd values are chosen.
*  fixes a memory leak (regression in 1.6.18)

### 1.6.19 - 16 Nov 2011

*  further small rotation improvement.

### 1.6.18 - 16 Nov 2011

*  New: Much, much improved rotation. Now smooth as butter. Enjoy!

### 1.6.17 - 12 Nov 2011

*  In search results, "Site" was renamed to "Page" to be consistent with the toolbar. If you use custom localization, you have to rename the entry "Site %d" to "Page %d".
*  add API call to allow basic text extraction from the search module (magazine.documentSearcher)

### 1.6.16 - 12 Nov 2011

*  fixes a bug with invalid caching entries when a deleted document is re-downloaded in the same application session (pages suddenly went black)
*  add a custom lib-project for PSPDFKit; it's now easier than ever to integrate it. Note: you really should use that one - I'll switch over to ARC soon, so a library makes things easier.

### 1.6.15 - 5 Nov 2011

*  thumbnails are now displayed under the transparent bar, not overlapping
*  only enable outline if it's enabled and there actually is an outline (no more empty popovers)
*  mail links are now presented in a form sheet on the iPad
*  allow show/hide of navigation bar even when zoomed in

### 1.6.14 - 22 Oct 2011

*  fixes bug where delete method of PSPDFCache (removeCacheForDocument) was deleting the whole directory of the pdf instead of just the related files

### 1.6.13 - 22 Oct 2011

*  removed the zeroing weak reference helper. If you use custom delegates for PSPDFCache, you now need to manually deregister them. Upside: better management of delegates.

### 1.6.12 - 19 Oct 2011

*  changed: turns out, when compiling with Xcode 4.2/Clang, you'll loose binary compatibility with objects linked from 4.1. Thus, the framework crashed with EXC_ILLEGAL_INSTRUCTION when compiled within an older Xcode. I will use 4.1 some more time to give everyone the change to upgrade, but due to some *great* improvements in Clang 3.0 compiler that ships with Xcode 4.2 (e.g. nilling out of structs accessed from a nil object) it's highly advised that you use Xcode 4.2. If you use the source code directly, this is not an issue at all.

### 1.6.11 - 14 Oct 2011

*  new: PSPDFKit is now compiled with Xcode 4.2/iOS Base SDK 5.0 (still works with 4.x)
*  improves compatibility for outline parser; now able to handle rare array/dict destination variants (fixes all destinations = page 1 error)
*  fixes a rare stack overflow when re-using zoomed scrollviews while scrolling.
*  fixes a compile problem on older Xcode versions. (It's not officially supported though - use Xcode 4.2 for the best experience!)
*  fixes a memory problem where iPad1 rarely tries to repaint a page forever

### 1.6.10 - 25 Sep 2011

*  aspectRatioEqual now defaults to NO. Many customers oversee this and then send me (false) bug reports. Set this to YES for maximum speed if your document has one single aspect ratio (like most magazines should).
*  scroll to active page in grid view
*  fixes small offset-error in the scrobble bar

### 1.6.9 - 22 Sep 2011

*  add option do debug memory usage (Instruments isn't always great)
*  improves memory efficiency on tile drawing, animations
*  improves performance, lazily creates gridView when first accessed
*  improves scrobble bar update performance
*  fixes memory problems on older devices like iPad 1, iPhone 3GS
*  fixes a problem with unicode files
*  fixes auto-switch to fitWidth on iPhone when location is default view

### 1.6.8 - 15 Sep 2011

*  update thumbnail grid when document is changed via property

### 1.6.7 - 15 Sep 2011

*  improves outline parser, now handles even more pdf variants

### 1.6.6 - 15 Sep 2011

*  potential bug fix for concurrent disk operations (NSFileManager is not thread safe!)
*  fixes positioning problem using the (unsupported) combination of PSPDFScrollingVertical and fitWidth

### 1.6.5 - 15 Sep 2011

*  fixes a bug where scroll position was remembered between pages when using fitWidth

### 1.6.4 - 15 Sep 2011

*  new: didRenderPage-delegate
*  fixes: crash bug with NaN when started in landscape

### 1.6.3 - 14 Sep 2011

*  new: maximumZoomScale-property is exposed in PSPDFViewController
*  changed: *realPage* is now remembered, not the page used in the UIScrollView. This fixes some problems with wrong page numbers.
*  fixes situation where page was changed to wrong value after view disappeared, rotated, and reappeared.
*  fixes option button in example is now touchable again
*  fixes a bug where HUD was never displayed again when rotating while a popover controller was visible
*  fixes potential crash where frame get calculated to NaN, leading to a crash on view rotation
*  fixes problems when compiling with GCC. You really should use LLVM/Clang though.

### 1.6.2 - 13 Sep 2011

*  fixed: HUD is now black again on disabled status bar

### 1.6.1 - 13 Sep 2011

*  new: open email sheet per default when detecting mailto: annotation links. (You now need the MessageUI.framework!)
*  new: fileUrl property in PSPDFDocument
*  improve toolbar behavior when setting status bar to default
*  fixes memory related crash on older devices
*  fixes crash when toolbarBackButton is nil
*  greatly improved KioskExample

### 1.6.0 - 12 Sep 2011

*  changed: willShowPage is now deprecated, use didShowPage. Both now change page when page is 51% visible. Former behavior was leftIndex
*  changed: pageCount is now only calculated once. If it's 0, you need to call clearCacheForced:YES to reset internal state of PSPDFDocument
*  changed: iPhone no longer uses dualPage display in landscape, now zooms current page to fullWidth
*  new: property fitWidth in PSPDFViewController lets you enable document fitting to width instead of largest element (usually height). Only works with horizontal scrolling
*  new: thumbnails in Grid, ScrobbleBar, KioskExample are now faded in
*  new: pdf view fades in. Duration is changeable in global var kPSPDFKitPDFAnimationDuration.
*  new: new property preloadedPagesPerSide in PSPDFViewController, controls pre-caching of pages
*  new: add delegates for page creation (willLoadPage/didLoadPage/willUnloadPage/didUnloadPage) with access to PSPDFScrollView
*  new: pdf cache handle is cleared on view controller destruction
*  new: exposes pagingScrollView in PSPDFViewController
*  new: HUD transparency is now a setting (see PSPDFKitGlobal)
*  new: scrobble bar class can be overridden and set in PSPDFViewController
*  new: directionalLock is enabled for PSPDFScrollView. This is to better match iBooks and aid scrolling
*  new: kPSPDFKitZoomLevels is now a global setting. It's set to a sensible default, so editing is not advised.
*  new: thumbnailSize is now changeable in PSPDFViewController
*  improve: faster locking in PSPDFCache, no longer freezes main thread on first access of pageCount
*  improve: split view example code now correctly relays view events
*  improve: cache writes are now atomically
*  improve: no more log warnings when initializing PSPDFViewController w/o document (e.g. when using Storyboard)
*  improve: faster speed for documents with high page count (better caching within PSPDFDocument)
*  improve: keyboard on searchController popover is now hidden within the same animation as popover alpha disappear
*  improve: grid/site animation no longer blocks interface
*  fixes touch handling to previous/next page for zoomed pages
*  fixes rasterizationScale for retina display (thumbnails)
*  fixes non-localizable text (Document-Name Page)
*  fixes inefficiency creating the pagedScrollView multiple times on controller startup/rotation events
*  fixes search text alignment, now synced to textLabel
*  fixes issue where documents may be scrollable on initial zoomRatio due to wrong rounding
*  fixes issue where caching was not stopped sometimes due to running background threads
*  fixes bug where alpha of navigationBar was set even if toolbarEnabled was set to NO
*  fixes bug where initial page delegation event was not sent when switching documents
*  fixes crash related to too high memory pressure on older devices

### 1.5.3 - 23 Aug 2011

*  add correct aspect ratio for thumbnails
*  improve thumbnail switch animation
*  improve memory use during thumbnail display
*  improve thumbnail scrolling speed

### 1.5.2 - 23 Aug 2011

*  add basic compatibility with GCC (LLVM is advised)
*  renamed button "Single" to "Page"
*  fixes page navigation for search/outline view
*  fixes a rare deadlock on PSPDFViewController initialization
*  fixes a race condition when changing documents while annotations are still parsed
*  fixes a crash when removing the view while a scrolling action is still active
*  possible bug fix for a "no autorelease pool in place"

### 1.5.1 - 23 Aug 2011

*  fixes setting of back button when view is pushed non-modally

### 1.5.0 - 23 Aug 2011

*  add advanced page preload - fully preloads pages in memory for even faster display
*  API change: PSPDFDocument now has a displayingPdfController attached if displayed. isDisplayed is removed.
*  improves animation between thumbnails and page view
*  improves scrolling performance
*  fixes crash when caching pages on iOS 4.0/iPhone
*  fixes crashes related to fast allocating/deallocating PSPDFViewControllers.
*  fixes issue where tap at rightmost border would not be translated to a next page event
*  fixes assertion when viewDidDisappear was not called

### 1.4.3 - 22 Aug 2011

*  enables page bouncing (allow zooming < 1, bounces back)
*  add setting for status bar management (leave alone, black, etc)
*  fixes issue where page index was incremented on first page after multiple rotations
*  fixes issue where pdf text is rendered slightly blurry on initial zoom level
*  fixes issue where status bar was not taken into account on cache creation
*  fixes issue where pages were sometimes misaligned by 0.5-1 pixel
*  fixes issue where page shadow was not animated on zoomIn/zoomOut

### 1.4.2 - 17 Aug 2011

*  remove queued cache requests when document cache stop is requested
*  fixes an assertion "main thread" when rapidly allocating/deallocating PSPDFViewController. Tip: Use the .document property to change documents instead if creating new controllers, it's much less expensive.
*  fixes incorrect tile setting in scrobble bar

### 1.4.1 - 13 Aug 2011

*  add optional two-step rendering for more quality
*  improve scrobble bar marker
*  fixes annotation handling on first page
*  fixes page orientation loading on landscape & iPhone

### 1.4.0 - 13 Aug 2011

*  greatly improves PDF rendering speed!
*  improves responsiveness of page scrolling while rendering
*  improves cache timings
*  improves full page cache
*  improve scrobble bar default thumb size
*  API change: PSPDFDocument.aspectRatioEqual now defaults to YES.
*  fixes rounding errors, resulting in a small border around the pages
*  fixes a potential deadlock while parsing page annotations
*  fixes bug where right thumbnail in scrobble bar is not always loaded
*  other minor bugfixes and improvements

### 1.3.2 - 11 Aug 2011

*  Add example to append/replace a document
*  allow changing the document
*  improve clearCache

### 1.3.1 - 9 Aug 2011

*  Add optional vertical scrolling (pageScrolling property)
*  Adds animation for iOS Simulator
*  improve thumbnail loading speed
*  fixes memory pressure when using big preprocessed external thumbnails
*  fixes a regression with zoomScale introduced in 1.3

### 1.3 - 8 Aug 2011

*  Major Update!
*  add support for pdf link annotations (site links and external links)
*  add delegate when viewMode is changed
*  add reloadData to PSPDFViewController
*  add scrollOnTapPageEndEnabled property to control prev/next tap
*  add animations for page change
*  improve kiosk example to show download progress
*  improve scrobblebar; now has correct aspect ratio + double page mode
*  improve scrollbar page changing
*  improve outline parsing speed
*  improve support for rotated PDFs
*  improve thumbnail display
*  fixes some analyzer warnings
*  fixes a timing problem when PSPDFCache was accessed from a background thread
*  fixes various other potential crashes
*  fixes a rare deadlock

### 1.2.3 - 5 Aug 2011

*  properly rotate pdfs if they have the /rotated property set
*  add option to disable outline in document
*  outline will be cached for faster access
*  outline element has now a level property
*  fixes a bug with single-page pdfs
*  fixes a bug with caching and invalid page numbers

### 1.2.2 - 5 Aug 2011

*  fixes a crash with < iOS 4.3

### 1.2.1 - 4 Aug 2011

*  detect rotation changes when offscreen

### 1.2 - 4 Aug 2011

*  add EmbeddedExample
*  allow embedding PSPDFViewController inside other viewControllers
*  add property to control toolbar settings
*  made delegate protocol @optional
*  fixes potential crash on rotate

### 1.1 - 3 Aug 2011

*  add PDF outline parser. If it doesn't work for you, please send me the pdf.
*  add verbose log level
*  improve search animation
*  fixes a warning log message when no external thumbs are used
*  fixes some potential crashes in PSPDFCache

### 1.0 - 1 Aug 2011

*  First public release
