## Newest Release

### 1.1.0 - 04 Feb 2020

* Adds a new `RedactionProcessor` to automate the permanent removal of data from a document. (#22813)
* Adds a `SaveAs` method for `Document` allowing for saving to a specified destination. (#22620)
* Adds a POM file to aide dependency management with maven repositories. (#22663)
* API: Removed public `PdfDocument` constructor. Please use static method `PdfDocument.open(DataProvider)` to open a document. (#22787)
* Fixes initialization error output to advise on fixes. (#22901)
* Adds explicit null checking on API parameters to provide better exception messages. (#22812)

### 1.0.1 - 09 Dec 2019

* Fixes an issue where flattening was not performed when a custom DataProvider was used. (#22624)
* Fixes Windows runtime dependencies causing "Can't find dependent libraries" message. (#22592)

### 1.0.0 - 31 Oct 2019

_See the [announcement post](https://pspdfkit.com/blog/2019/introducing-the-pspdfkit-libraries)._

* Initial release
