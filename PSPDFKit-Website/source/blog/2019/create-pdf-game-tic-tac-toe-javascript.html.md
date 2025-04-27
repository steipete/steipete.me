---
title: "How to Create a Game with PDF and JavaScript"
description: "This blog post explains how to extend the link creation API in PSPDFKit to create JavaScript actions and build a simple tic-tac-toe PDF game."
preview_image: /images/blog/2019/create-game-pspdfkit-javascript/article-header.png
section: blog
author:
  - Daniel Martín
author_url:
  - https://twitter.com/dmartincy
date: 2019-07-17 8:00 UTC
tags: iOS, Development, JavaScript
cta: viewer
published: true
secret: false
---

PDF is a file format that supports lots of interactivity. In a PDF, buttons can be linked to actions that can do many things, like navigate to a different page, reset a form, or execute a JavaScript script. In [PSPDFKit 8.3 for iOS][], we introduced a new UI for easily creating PDF actions. By default, it includes support for adding links that navigate to specific document pages or to an external website. In this post, I’ll describe how you can extend this feature to create JavaScript actions. The goal is to be able to build a simple game that could be played in a PDF using PSPDFKit and JavaScript.

TL;DR: [Download TicTacToe.pdf][finalgame] and open it in [PDF Viewer][] for iOS or Android (Mac coming soon).

## Compatibility Warning

⚠️ While this PDF is valid and complies with ISO 32000-2, it will not work with most PDF viewers. For example, while both PSPDFKit and Google Chrome are based on the [open source PDFium rendering engine][], Chrome can’t correctly run this PDF.

We tested the existing JavaScript support in PDFium and found it to be insufficient, so we rewrote the engine from scratch to both be faster and have better support for the PDF specification. Since our JavaScript engine is so different to PDFium’s approach, this is not something we will be able to contribute back — [we do, however, contribute other rendering fixes][contributing to pdfium] when we can, in order to make the entire ecosystem better.

Many [advanced PDF forms][] include JavaScript for validation and interactivity, so having great support for JavaScript is a requirement to render these forms correctly.

## Adding JavaScript Actions

The abstract view controller that supports creating and editing links in annotations in PSPDFKit is `PSPDFLinkAnnotationEditingViewController`. We’ll use it to create a subclass specialized in JavaScript actions:

```objc
/**
  A view controller for creating and editing JavaScript code that can be included as
  an annotation action.
*/
@interface PSPDFJavaScriptLinkAnnotationEditingViewController : PSPDFLinkAnnotationEditingViewController @end
```

The view controller constructor simply sets the view controller title:

```objc
- (instancetype)initWithDocument:(PSPDFDocument *)document existingAction:(nullable PSPDFAction *)action {
  if ((self = [super initWithDocument:document existingAction:action])) {
    self.title = @"JavaScript";
  }
  return self;
}
```

The view controller’s `loadView`’s implementation will create a specialized `UIView` with a custom UI tailored to add a JavaScript action:

```objc
- (void)loadView {
  self.view = [PSPDFJavaScriptLinkAnnotationEditingView new];
}
```

We won’t show the details here, but you can, for example, make `PSPDFJavaScriptLinkAnnotationEditingView` a view that presents a custom code editor.

The important parts that must be implemented by our subclass are the `linkType` and `linkAction` properties. We’ll implement them as computed properties that return a custom link annotation type and a JavaScript action whose contents are the contents from the code editor, respectively:

```objc
- (PSPDFLinkAnnotationType)linkType {
  return PSPDFLinkAnnotationCustom;
}

- (nullable PSPDFAction *)linkAction {
  let scriptContents = self.editorView.text;
  if (scriptContents == nil) {
    return nil;
  }
  return [[PSPDFJavaScriptAction alloc] initWithScript:scriptContents];
}
```

In the code above, `self.editorView` is a reference to the custom code editor view you may implement as part of the `PSPDFJavaScriptLinkAnnotationEditingView` layout.

## Using JavaScript to Create the Game

Once we have implemented and registered our custom `PSPDFLinkAnnotationEditingViewController`, we can start adding JavaScript actions to implement the game functionality. Let’s start with a PDF designed like a tic-tac-toe game board.

![Screenshot showing the initial state of the tic-tac-toe game in a PDF](/images/blog/2019/create-game-pspdfkit-javascript/TicTacToeInitialState.png "How a tic-tac-toe game looks in a PDF.")

You can download the PDF from [here][initialgame].

Next, we’ll create a JavaScript action linked to the Start Game button that will initialize the game logic and provide some global functions and data that the rest of the game will use. The way to do this is pretty simple: Open the annotation toolbar and click on the link button.

![Screenshot showing the link button](/images/blog/2019/create-game-pspdfkit-javascript/ScreenshotLinkButton.png)

Now drag around the Start Game button, and the link creation modal view controller will show up. You’ll see a third tab for creating JavaScript code actions, and clicking on that will switch to your `PSPDFJavaScriptLinkAnnotationEditingViewController`, where you can enter JavaScript code for the action.

![Screenshot showing the JavaScript link creation tab](/images/blog/2019/create-game-pspdfkit-javascript/ScreenshotJSCodeEditor.png)

The JavaScript code for the Start Game button should be:

```js
if (inGame == undefined || !inGame) {
  // Current count of movements.
  var counter = 0;
  // Player X is 0, Y is 1.
  var whoisX = 0;
  // X starts playing.
  var whoisFirst = 0;
  // Signals if the game is over and there's a winner.
  var isThereWinner = 0;
  // Lists of used X and Y squares.
  var usedX = [];
  var usedY = [];

  function AlertWinner(t) {
    app.alert("Player " + t + " Wins!");
  }

  function checkWhoWon(row, col) {
    // Returns 1 if there's a winner, 0 if there's a draw.
    var i;
    var j;
    var square;
    var turn = counter % 2 == 0 ? whoisFirst : 1 - whoisFirst;

    // Now that we know which play is active, we need to know if
    // the player is X ("Off") or O ("On").
    var offOnValue = turn == whoisX ? "Off" : "On";

    // Check rows.
    for (j = 1, tot = 0; j <= 3; j++) {
      square = this.getField("SQUARE" + row + j);
      if (!square.hidden && square.value == offOnValue) {
        tot += 1;
      }
    }

    // Three squares? Yay! We have a winner!
    if (tot == 3) {
      AlertWinner(turn);
      return 1;
    }

    // Check columns.
    for (i = 1, tot = 0; i <= 3; i++) {
      square = this.getField("SQUARE" + i + col);
      if (!square.hidden && square.value == offOnValue) {
        tot += 1;
      }
    }

    // Three squares? Yay! We have a winner!
    if (tot == 3) {
      AlertWinner(turn);
      return 1;
    }

    // Now check diagonals.

    // Main diagonal.
    if (row == col) {
      for (i = 1, tot = 0; i <= 3; i++) {
        square = this.getField("SQUARE" + i + i);
        if (!square.hidden && square.value == offOnValue) {
          tot += 1;
        }
      }
      // Three squares? Winner!
      if (tot == 3) {
        AlertWinner(turn);
        return 1;
      }
    }

    // Cross diagonal.
    if (row + col == 4) {
      for (i = 1, tot = 0, j = 3; i <= 3; i++, j = 4 - i) {
        square = this.getField("SQUARE" + i + j);
        if (!square.hidden && square.value == offOnValue) {
          tot += 1;
        }
      }
      if (tot == 3) {
        AlertWinner(turn);
        return 1;
      }
    }
    return 0; // If we haven't returned early, that's a draw, return 0.
  }

  function process(row, col) {
    var i;
    for (i = 0; i < usedX.length; i++) {
      if (usedX[i] == col && usedY[i] == row) {
        return;
      }
    }

    if (isThereWinner == 1) {
      app.alert("Game Over!");
      return 1;
    }

    var xoSq = this.getField("SQUARE" + row + col);

    if (counter % 2 == (whoisX + (1 - whoisFirst)) % 2) {
      xoSq.value = "On";
    } else {
      xoSq.value = "Off";
    }
    xoSq.hidden = false;
    xoSq.readonly = true;
    isThereWinner = checkWhoWon(row, col);
    counter += 1;
    usedX.push(col);
    usedY.push(row);
    if (isThereWinner == 0 && counter == 9) {
      app.alert("This is a draw!");
    }
    return 1;
  }

  app.alert("Let's play!");
  // Hide the Start Play button while we're in a game.
  var startPlayBtn = getField("Button3");
  startPlayBtn.hidden = true;
  var inGame = true;
}
```

Let’s explain a bit about how the code works. The function `process(row, col)` is responsible for updating the board state when a player selects a square. After the play, an auxiliary function, `checkWhoWon`, checks if any player has won the game, and if so, it shows an alert using the `AlertWinner` function.

The script that should be associated with each link action is:

```js
process(row, column);
```

That is, if you are adding the link action to the square in the third column of the first row, the script should be:

```js
process(1, 3);
```

After you’ve added the final JavaScript link action, just press the Start button to start playing a tic-tac-toe game inside PSPDFKit!

You can download the final PDF from [here][finalgame].

**ℹ️ Note:** Not every PDF viewer can support the JavaScript features that PSPDFKit supports, so it’s possible that the game does not work in some third-party PDF viewers.

## Conclusion

This post explained how PSPDFKit can easily be extended to add interesting interactivity with JavaScript actions. We used these actions to create a simple tic-tac-toe game inside PSPDFKit by utilizing an intuitive drag interface to add the game logic step by step. We hope you learned something along the way. Have fun playing!

⭐️ Eager for more? Check out [Calculator.pdf][] — a calculator in a PDF.

[pspdfkit 8.3 for ios]: /blog/2019/pspdfkit-ios-8-3/
[finalgame]: /images/blog/2019/create-game-pspdfkit-javascript/FinalTicTacToe.pdf
[open source pdfium rendering engine]: https://pdfium.googlesource.com/pdfium/
[pdf viewer]: https://pdfviewer.io/
[contributing to pdfium]: /blog/2019/contributing-to-pdfium/
[advanced pdf forms]: /blog/2018/forms-in-pdf/
[initialgame]: /images/blog/2019/create-game-pspdfkit-javascript/TicTacToeNoFunctionality.pdf
[calculator.pdf]: /blog/2018/how-to-program-a-calculator-pdf/
