---
title: "How to Expose Native iOS APIs to Cordova"
description: "A tutorial about how to expose native iOS APIs to Cordova."
preview_image: /images/blog/2019/how-to-expose-ios-api-to-cordova/article-header.png
section: blog
author:
  - Rad Azzouz
author_url:
  - https://twitter.com/radazzouz
date: 2019-09-04 8:00 UTC
tags: iOS, Cordova, Development
published: true
secret: false
---

We recently updated our Cordova plugin to add the [annotation manipulation API][how to manipulate annotations programmatically in cordova], and today we are excited to announce that we have further extended the APIs of our Cordova plugin to add the [document processing API][cordova document processing api].

In our native SDKs, we expose a lot of APIs for full customization, but we only use a subset of those APIs in our [Cordova plugin][pspdfkit-cordova repo]. In this article, we will show you how to bring native iOS APIs to Cordova, which makes it easier for everyone to contribute to our [open source repository][pspdfkit-cordova repo] or to expose native iOS code to Cordova in general.

In this tutorial, we’ll go through how we implemented the recently added `processAnnotations` API that allows you to export documents with embedded, flattened, or removed annotations.

So let’s get started!

## Declaring the Cordova JavaScript API

First, we declare the JavaScript API in [`pspdfkit.js`][] to make it available to Cordova.

We can achieve this by using the `cordova.exec` command, like so:

```js
// Document Processing
exports.processAnnotations = function(
  annotationChange,
  processedDocumentPath,
  callback,
  annotationType
) {
  if (platform === "ios") {
    executeAction(callback, "processAnnotations", [
      annotationChange,
      processedDocumentPath,
      annotationType
    ]);
  } else {
    console.log("Not implemented on " + platform + ".");
  }
};
```

For more details, please take a look at the [official Cordova JavaScript Interface guide][cordova javascript interface guide].

## Implementing the Objective-C Logic

Now that we’ve declared the JavaScript API in Cordova, we need to implement the functionality in Objective-C in [`PSPDFKitPlugin.m`][]:

```objc
- (void)processAnnotations:(CDVInvokedUrlCommand *)command {
    PSPDFAnnotationChange change = (PSPDFAnnotationChange)[self optionsValueForKeys:@[[command argumentAtIndex:0]] ofType:@"PSPDFAnnotationChange" withDefault:PSPDFAnnotationChangeEmbed];
    NSURL *processedDocumentURL = [self writableFileURLWithPath:[command argumentAtIndex:1] override:YES copyIfNeeded:NO];

    // The annotation type is optional. We default to `All` if it's not specified.
    NSString *typeString = [command argumentAtIndex:2] ?: [command argumentAtIndex:3];
    PSPDFAnnotationType type = PSPDFAnnotationTypeAll;
    if (typeString.length > 0) {
        type = (PSPDFAnnotationType) [self optionsValueForKeys:@[typeString] ofType:@"PSPDFAnnotationType" withDefault:PSPDFAnnotationTypeAll];
    }

    PSPDFDocument *document = self.pdfController.document;
    VALIDATE_DOCUMENT(document)

    // Create a processor configuration with the current document.
    PSPDFProcessorConfiguration *configuration = [[PSPDFProcessorConfiguration alloc] initWithDocument:document];

    // Modify annotations.
    [configuration modifyAnnotationsOfTypes:type change:change];

    // Create the PDF processor and write the processed file.
    PSPDFProcessor *processor = [[PSPDFProcessor alloc] initWithConfiguration:configuration securityOptions:nil];
    NSError *error;
    BOOL success = [processor writeToFileURL:processedDocumentURL error:&error];
    if (success) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:success] callbackId:command.callbackId];
    }
    else {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                      messageAsDictionary:@{@"localizedDescription": error.localizedDescription, @"domain": error.domain}];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}
```

## Using the API in Cordova JavaScript Code

Now that we’ve exposed the API to process annotations to our Cordova plugin, here’s how we can use it in our app’s JavaScript code:

```js
// Flatten ink annotations from the current document.
PSPDFKit.processAnnotations(
  "flatten",
  "pdf/processed.pdf",
  function(success, error) {
    if (success) {
      console.log("Successfully processed annotation");
    } else {
      console.log("An error has occurred: " + error);
    }
  },
  "Ink"
);
```

That’s all!

## Pull Request Contributions and Forking

If you come across any missing APIs that you think would be useful to have, feel free to submit [pull requests][cordova plugin pull request] to help improve our wrapper.

However, if your use case is very specific, and if making native APIs available in our official Cordova wrapper doesn’t make sense, you can fork the repository and implement the new API in your fork.

> **💡 Tip:** PSPDFKit for iOS comes with several sample projects, like [PSPDFCatalog][], which is a great source of Objective-C code that you can use to bridge to Cordova.

## Conclusion

We hope that this article will help you improve Cordova wrappers, be it the PSPDFKit one or other ones.

[how to manipulate annotations programmatically in cordova]: /blog/2019/how-to-manipulate-annotations-programmatically-in-cordova/
[pspdfkit-cordova repo]: https://github.com/PSPDFKit/PSPDFKit-Cordova
[cordova document processing api]: https://github.com/PSPDFKit/PSPDFKit-Cordova/blob/00e0ea4c59745203f2cffecf4ec03628d3794a03/www/PSPDFKit.js#L960
[`pspdfkit.js`]: https://github.com/PSPDFKit/PSPDFKit-Cordova/blob/master/www/PSPDFKit.js
[cordova javascript interface guide]: https://cordova.apache.org/docs/en/latest/guide/hybrid/plugins/#the-javascript-interface
[`pspdfkitplugin.m`]: https://github.com/PSPDFKit/PSPDFKit-Cordova/blob/master/src/ios/PSPDFKitPlugin.m
[pspdfcatalog]: https://pspdfkit.com/guides/ios/current/getting-started/example-projects/#pspdfcatalog
[cordova plugin pull request]: https://github.com/PSPDFKit/PSPDFKit-Cordova/pulls
