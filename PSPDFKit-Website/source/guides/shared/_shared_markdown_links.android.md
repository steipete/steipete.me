[`PSPDFKit`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/PSPDFKit.html

[`PdfDocument`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/PdfDocument.html
[`PdfDocumentLoader`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/PdfDocumentLoader.html
[`PdfDocument#getAnnotationProvider()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/PdfDocument.html#getAnnotationProvider()
[`PdfDocument#getUid()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/PdfDocument.html#getUid()

[`PdfLibrary`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/library/PdfLibrary.html

[`PdfFragment`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfFragment.html
[`PdfUiFragment`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfUiFragment.html

[`PdfDrawableProvider`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/drawable/PdfDrawableProvider.html
[`PdfFragment#addDrawableProvider()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfFragment.html#addDrawableProvider(com.pspdfkit.ui.drawable.PdfDrawableProvider)

[`PdfActivity`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/PdfActivity.html

[`PdfConfiguration`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/PdfConfiguration.Builder.html
[`PdfConfiguration.Builder`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/PdfConfiguration.Builder.html

[`PdfActivityConfiguration`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.html
[`PdfActivityConfiguration.Builder`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/activity/PdfActivityConfiguration.Builder.html

[`DocumentSource`]: /api/android/reference/com/pspdfkit/document/DocumentSource.html

[`DataProvider`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/providers/DataProvider.html
[`DataProvider#getUid()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/providers/DataProvider.html#getUid()

[`DocumentJsonFormatter`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/formatters/DocumentJsonFormatter.html
[`DocumentJsonFormatter#exportDocumentJson()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/formatters/DocumentJsonFormatter.html#exportDocumentJson(com.pspdfkit.document.PdfDocument,%20java.io.OutputStream)
[`DocumentJsonFormatter#exportDocumentJsonAsync()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/formatters/DocumentJsonFormatter.html#exportDocumentJsonAsync(com.pspdfkit.document.PdfDocument,%20java.io.OutputStream)
[`DocumentJsonFormatter#importDocumentJson()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/formatters/DocumentJsonFormatter.html#importDocumentJson(com.pspdfkit.document.PdfDocument,%20com.pspdfkit.document.providers.DataProvider)
[`DocumentJsonFormatter#importDocumentJsonAsync()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/document/formatters/DocumentJsonFormatter.html#importDocumentJsonAsync(com.pspdfkit.document.PdfDocument,%20com.pspdfkit.document.providers.DataProvider)



[`AnnotationProvider`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/AnnotationProvider.html
[`AnnotationProvider#ALL_ANNOTATION_TYPES`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/AnnotationProvider.html#ALL_ANNOTATION_TYPES
[`AnnotationProvider#getAllAnnotationsOfType()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/AnnotationProvider.html#getAllAnnotationsOfType(java.util.EnumSet<com.pspdfkit.annotations.AnnotationType>)
[`AnnotationProvider#createAnnotationFromInstantJson()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/AnnotationProvider.html#createAnnotationFromInstantJson(java.lang.String)

[`Annotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/Annotation.html
[`Annotation#setContents()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/Annotation.html#setContents(java.lang.String)
[`Annotation#getBoundingBox()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/Annotation.html#getBoundingBox()
[`Annotation#renderToBitmap()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/Annotation.html#renderToBitmap(android.graphics.Bitmap)
[`Annotation#renderToBitmapAsync()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/Annotation.html#renderToBitmapAsync(android.graphics.Bitmap)
[`Annotation#toInstantJson()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/Annotation.html#toInstantJson()
[`Annotation#setFlags()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/Annotation.html#setFlags(java.util.EnumSet<com.pspdfkit.annotations.AnnotationFlags>)
[`Annotation#getFlags()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/Annotation.html#getFlags()

[`AnnotationNoteHinter`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/note/AnnotationNoteHinter.html

[`AnnotationRenderConfiguration`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/rendering/AnnotationRenderConfiguration.html
[`AnnotationRenderConfiguration.Builder`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/rendering/AnnotationRenderConfiguration.Builder.html

[`AnnotationRenderConfiguration.Builder#invertColors()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/rendering/AnnotationRenderConfiguration.Builder.html#invertColors(boolean)
[`AnnotationRenderConfiguration.Builder#toGrayscale()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/rendering/AnnotationRenderConfiguration.Builder.html#toGrayscale(boolean)
[`AnnotationRenderConfiguration.Builder#formHighlightColor()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/rendering/AnnotationRenderConfiguration.Builder.html#formHighlightColor(java.lang.Integer)
[`AnnotationRenderConfiguration.Builder#formItemHighlightColor()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/rendering/AnnotationRenderConfiguration.Builder.html#formItemHighlightColor(java.lang.Integer)
[`AnnotationRenderConfiguration.Builder#formRequiredFieldBorderColor()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/configuration/rendering/AnnotationRenderConfiguration.Builder.html#formRequiredFieldBorderColor(java.lang.Integer)

[`FreeTextAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/FreeTextAnnotation.html
[`InkAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/InkAnnotation.html
[`LinkAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/LinkAnnotation.html
[`NoteAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/NoteAnnotation.html
[`ShapeAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/ShapeAnnotation.html
[`StampAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/StampAnnotation.html
[`TextMarkupAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/TextMarkupAnnotation.html
[`HighlightAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/HighlightAnnotation.html
[`SquigglyAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/SquigglyAnnotation.html
[`StrikeOutAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/StrikeOutAnnotation.html
[`UnderlineAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/UnderlineAnnotation.html
[`AssetAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/AssetAnnotation.html
[`BaseLineAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/BaseLineAnnotation.html
[`CircleAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/CircleAnnotation.html
[`LineAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/LineAnnotation.html
[`MediaAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/MediaAnnotation.html
[`RichMediaAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/RichMediaAnnotation.html
[`ScreenAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/ScreenAnnotation.html
[`SquareAnnotation`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/SquareAnnotation.html

[`BiometricSignatureData`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/signatures/BiometricSignatureData.html
[`BiometricSignatureData.Builder`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/signatures/BiometricSignatureData.Builder.html
[`BiometricSignatureData.InputMethod`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/signatures/BiometricSignatureData.InputMethod.html

[`Signature`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/signatures/Signature.html
[`Signature#getBiometricData()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/signatures/Signature.html#getBiometricData()
[`SignaturePickerFragment`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/ui/signatures/SignaturePickerFragment.html
[`SignatureManager.addSigner()`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/signatures/SignatureManager.html#addSigner(java.lang.String,%20com.pspdfkit.signatures.signers.Signer)

[`AppearanceStreamGenerator`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/annotations/appearance/AppearanceStreamGenerator.html

[`InstantPdfDocument`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/instant/document/InstantPdfDocument.html
[`InstantClient`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/instant/client/InstantClient.html
[`InstantPdfFragment`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/instant/ui/InstantPdfFragment.html
[`InstantPdfActivity`]: https://pspdfkit.com/api/android/reference/com/pspdfkit/instant/ui/InstantPdfActivity.html

[`Bitmap`]: http://developer.android.com/reference/android/graphics/Bitmap.html
[`Bitmap.createBitmap()`]: https://developer.android.com/reference/android/graphics/Bitmap.html#createBitmap(int,%20int,%20android.graphics.Bitmap.Config)
[`Bitmap.Config.ARGB_8888`]: https://developer.android.com/reference/android/graphics/Bitmap.Config.html#ARGB_8888
[`ContentProvider`]: https://developer.android.com/reference/android/content/ContentProvider.html
[`FrameLayout`]: https://developer.android.com/reference/android/widget/FrameLayout.html
[`Intent`]: https://developer.android.com/reference/android/content/Intent
[`OutputStream`]: https://developer.android.com/reference/java/io/OutputStream.html
[`Parcelable`]: https://developer.android.com/reference/android/os/Parcelable.html
[`RectF`]: https://developer.android.com/reference/android/graphics/RectF.html
[`RectF#height()`]: https://developer.android.com/reference/android/graphics/RectF.html#height()
[`Uri`]: http://developer.android.com/reference/android/net/Uri.html
[`View`]: https://developer.android.com/reference/android/view/View.html
[`ViewGroup`]: https://developer.android.com/reference/android/view/ViewGroup.html

[`Disposable`]: http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/disposables/Disposable.html
[`Disposable#dispose()`]: http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/disposables/Disposable.html#dispose--
[`Flowable`]: http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/Flowable.html
[`Single`]: http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/Single.html
[`Single#subscribe()`]: http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/Single.html#subscribe--