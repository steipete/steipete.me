---
title: "Opening a PDF in Flutter"
description: "A tutorial on how to open a PDF in Flutter."
preview_image: /images/blog/2019/opening-a-pdf-in-flutter/article-header.png
section: blog
author:
  - Reinhard Hafenscher
date: 2019-06-04 8:00 UTC
tags: Development, Flutter, How-To
published: true
secret: false
---

[Flutter][] lets you create mobile apps in Dart. It’s developed by Google, and it allows you to create Android and iOS apps from a single shared codebase. In this post, we’re going to use Flutter to build an app that opens a PDF with the press of a button. First we’ll use an open source Dart package to present the PDF. Then we’ll see how easy it is to integrate PSPDFKit to add even more PDF features to your app.

Below you’ll see the steps for how to open a PDF in Flutter with [`flutter_full_pdf_viewer`][]. We’ll assume that you already followed the [installation instructions][] to set up the Flutter command-line tools on your machine.

## Step 1: Creating a New Flutter App

We can use the `flutter` command to create a new Flutter app from the command line (we chose the name opening_a_pdf for our app):

```
flutter create opening_a_pdf
```

For the rest of the tutorial, we’re going to work in opening_a_pdf:

```
cd opening_a_pdf
```

## Step 2: Setting Up Dependencies

We’re going to use [`flutter_full_pdf_viewer`][], which can be used to display PDFs. We’ll also need [`path_provider`][]. First add them to your `pubspec.yaml`:

```yaml
dependencies:
  flutter_full_pdf_viewer: ^1.0.4
  path_provider: ^0.4.1
```

We’ll also add a PDF to our assets. To do that, we need to declare an assets folder:

```yaml
flutter:
  assets:
    - PDFs/
```

Then we’ll create a `PDFs` folder next to our `pubspec.yaml` and put a PDF to test with in it.

Finally, we’ll install the packages from the command line using the following:

```
flutter packages get
```

## Step 3: Writing the App

Now we can start writing our app. First we’re going to replace the current contents of `main.dart` with a more stripped-down example displaying a single button:

```dart
import 'dart:io';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_full_pdf_viewer/full_pdf_viewer_scaffold.dart';
import 'package:path_provider/path_provider.dart';

// Change this to fit the PDF file you are using to test.
const String _documentPath = 'PDFs/Guide-v4.pdf';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Opening a PDF',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key}) : super(key: key);

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  // This moves the PDF file from the assets to a place accessible by our PDF viewer.
  Future<String> prepareTestPdf() async {
    final ByteData bytes =
        await DefaultAssetBundle.of(context).load(_documentPath);
    final Uint8List list = bytes.buffer.asUint8List();

    final tempDir = await getTemporaryDirectory();
    final tempDocumentPath = '${tempDir.path}/$_documentPath';

    final file = await File(tempDocumentPath).create(recursive: true);
    file.writeAsBytesSync(list);
    return tempDocumentPath;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Opening a PDF"),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            RaisedButton(
              onPressed: () {},
              child: const Text('Open PDF with full_pdf_viewer'),
            ),
          ],
        ),
      ),
    );
  }
}
```

Next we’ll add some code to open the PDF using [`flutter_full_pdf_viewer`][]. First, below `_MyHomePageState´, we’ll add the`FullPdfViewerScreen` class:

```dart
class FullPdfViewerScreen extends StatelessWidget {
  final String pdfPath;

  FullPdfViewerScreen(this.pdfPath);

  @override
  Widget build(BuildContext context) {
    return PDFViewerScaffold(
        appBar: AppBar(
          title: Text("Document"),
        ),
        path: pdfPath);
  }
}
```

This will use the provided `PDFViewerScaffold` to display the PDF included in the assets. Then we’ll hook up our button to display the `FullPdfViewerScreen`. Let’s also replace the `RaisedButton` we have:

```dart
RaisedButton(
  onPressed: () => {
        // We need to prepare the test PDF, and then we can display the PDF.
        prepareTestPdf().then((path) {
          Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => FullPdfViewerScreen(path)),
          );
        })
      },
  child: const Text('Open PDF with full_pdf_viewer'),
),
```

Now the `onPressed` callback will push the `FullPdfViewerScreen` onto the navigation stack after preparing the test PDF. The image below shows how it looks on Android.

![A simple Flutter-based PDF view on Android](/images/blog/2019/opening-a-pdf-in-flutter/full-pdf-viewer.png)

After these steps, we can now tap on a button and scroll through a PDF document. However, we can’t do anything else; there are no annotations. We only have the scrolling view mode.

But this is where [PSPDFKit][] comes in: It includes all of the features you need (and more!) without you having to configure anything.

## Opening a PDF with PSPDFKit

First, [download a demo version of PSPDFKit][]. Then follow the integration guides for [iOS][ios-integration] and [Android][android-integration]. You also need to remove [`flutter_full_pdf_viewer`][] due to dependency conflicts.

Once this is done, we’ll replace the button in `_MyHomePageState` so it opens the PDF with PSPDFKit instead:

```dart
RaisedButton(
  onPressed: () => {
        // We need to prepare the test PDF, and then we can display the PDF.
        prepareTestPdf().then((path) {
          Pspdfkit.present(path);
        })
      },
  child: const Text('Open PDF with PSPDFKit'),
),
```

For this to work, we also need to add a new import:

```dart
import 'package:pspdfkit_flutter/pspdfkit.dart';
```

Finally, we also need to initialize PSPDFKit by adding the following to `_MyHomePageState`:

```dart
@override
initState() {
  super.initState();
  // Replace.
  Pspdfkit.setLicenseKey("YOUR_LICENSE_KEY_GOES_HERE");
}
```

And now we can view a PDF document in PSPDFKit! Not only that, but we can also create annotations, look at the document’s outline, fill out forms, and lots of other things. This is how it looks now:

![PSPDFKit on Android](/images/blog/2019/opening-a-pdf-in-flutter/pspdfkit-viewer.png)

## Conclusion

As you saw, adding PDF support to your app using [`flutter_full_pdf_viewer`][] isn’t difficult, but in doing so, you’re missing out on a lot of functionality. Meanwhile, PSPDFKit ships with [many features][] out of the box, providing your users with a better user experience. PSPDFKit also comes with great customer support, so please [reach out to us][] if you have any questions about our Flutter integration.

[flutter]: https://pspdfkit.com/blog/categories/flutter/
[`flutter_full_pdf_viewer`]: https://github.com/albo1337/flutter_full_pdf_viewer
[installation instructions]: https://flutter.dev/docs/get-started/install
[`path_provider`]: https://pub.dartlang.org/packages/path_provider
[pspdfkit]: https://pspdfkit.com
[download a demo version of pspdfkit]: https://pspdfkit.com/try/
[ios-integration]: https://github.com/PSPDFKit/pspdfkit-flutter#ios
[android-integration]: https://github.com/PSPDFKit/pspdfkit-flutter#android
[many features]: https://pspdfkit.com/pdf-sdk
[reach out to us]: https://support.pspdfkit.com/hc/en-us/requests/new
