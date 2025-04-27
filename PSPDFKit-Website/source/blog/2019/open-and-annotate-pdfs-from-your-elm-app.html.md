---
title: "Open and Annotate PDFs from Your Elm App"
description: "A tutorial on how to add advanced PDF features to your Elm app using PSPDFKit for Web"
preview_image: /images/blog/2019/open-and-annotate-pdfs-from-your-elm-app/article-header.png
section: blog
author:
  - William Meleyal
author_url:
  - https://meleyal.com
date: 2019-06-05 8:00 UTC
tags: Web, Development, Elm, How-To
published: true
secret: false
---

In this article, we’ll explore how to add advanced PDF features to your Elm app using [PSPDFKit for Web][]. It builds upon our [Open a PDF in Elm][] blog post, so be sure to check that out first.

To get started, we’ll need a free [PSPDFKit for Web demo license][try]. Follow the trial signup steps, and then make a note of your `NPM_KEY` and `LICENSE_KEY`, which we’ll need shortly.

**ℹ️ Note:** If you don’t want to follow along, you can see the finished code in our [PSPDFKit for Web Elm example project][elm project], along with [examples for several other popular languages and frameworks][example projects].

## Setup

To set up our project, let’s first create the initial structure for our app:

```shell
mkdir pspdfkit-web-example-elm
cd pspdfkit-web-example-elm
mkdir src assets
touch src/index.js src/Main.elm
```

Then we’ll install our dependencies:

```shell
npm init -y
npm install -D elm elm-webpack-loader html-webpack-plugin webpack webpack-dev-server
npm install -D https://customers.pspdfkit.com/npm/YOUR_NPM_KEY_GOES_HERE/latest.tar.gz
```

Note that we’re using [webpack][] to automate some of the grunt work, along with [elm-webpack-loader][] to tell webpack how to handle Elm files. The webpack setup is not that relevant here, so we’ll skip over the details, but you can [see the full webpack configuration in the finished example project][webpack config].

## First Iteration: Rendering

As in the previous article, our initial goal is simply to render a PDF in the browser. [Here’s an example PDF][example pdf] to use if you don’t have one handy. Be sure to place it in the `assets` folder we created previously.

On the Elm side (in `src/Main.elm`), we’ll start simple and just create a `div` with an `id` of `PSPDFKitContainer` to contain our `PSPDFKit` instance:

```elm
module Main exposing (init, main, update, view)

import Browser
import Html exposing (div)
import Html.Attributes exposing (id, style)



-- MODEL


init =
    {}



-- UPDATE


update msg model =
    model



-- VIEW


view model =
    div [ id "PSPDFKitContainer", style "height" "100vh" ] []



-- PROGRAM


main =
    Browser.sandbox { init = init, update = update, view = view }
```

On the JavaScript side (in `src/index.js`), we just need to tell `PSPDFKit` to render into the `PSPDFKitContainer` `div` created by Elm and pass in both the license key we obtained earlier and the path to our PDF document:

```js
import { Elm } from "./Main";
import PSPDFKit from "pspdfkit";

Elm.Main.init({ node: document.body });

PSPDFKit.load({
  pdf: "example.pdf",
  container: "#PSPDFKitContainer",
  licenseKey: YOUR_LICENSE_KEY_GOES_HERE
});
```

With that, our PDF is now shown in the browser:

![1st Iteration PDF Rendering](/images/blog/2019/open-and-annotate-pdfs-from-your-elm-app/v1.png#img-width-75)

## Second Iteration: Configuration

PSPDFKit for Web has a [rich set of configuration options][pspdfkit for web configuration]. In this second iteration, our aim is to specify these in Elm and pass them over to JS using [`Ports`][].

On the Elm side, we create a `configure` port which we can use to send our data to JS. We also define some data types that tell Elm the shape and format of our configuration object.

Finally, in the `init` function, we send the desired configuration to the `configure` port. Here we’re specifying that we want to jump straight to page 2 of the document and show thumbnails of the document pages in the sidebar.

**ℹ️ Note:** In a production app, rather than `sidebarMode : String`, you’d instead define a [custom type][] (i.e. `type SidebarMode = Thumbnails | Annotations | ...`) and [encode][] it before passing it to the `port`.

```elm
port module Main exposing (..)

import Browser
import Html exposing (div)
import Html.Attributes exposing (id, style)



-- MODEL


type alias Model =
    { pdf : String
    , container : String
    , licenseKey : String
    , viewState : ViewState
    }


type alias ViewState =
    { currentPageIndex : Int
    , sidebarMode : String
    }


type alias Flags =
    { licenseKey : String }


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        model =
            { pdf = "example.pdf"
            , container = "#PSPDFKitContainer"
            , licenseKey = flags.licenseKey
            , annotations = []
            , viewState =
                { currentPageIndex = 1
                , sidebarMode = "THUMBNAILS"
                }
            }
    in
    ( model, configure model )



-- UPDATE


type Msg
    = Model


update msg model =
    ( model, load model )



-- PORT


port configure : Model -> Cmd msg



-- VIEW


view model =
    div [ id "PSPDFKitContainer", style "height" "100vh" ] []



-- PROGRAM


main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }
```

On the JS side, we subscribe to the `configure` port, which receives the configuration object and uses it to initialize `PSPDFKit`:

```js
const app = Elm.Main.init({
  node: document.body,
  flags: {
    licenseKey: YOUR_LICENSE_KEY_GOES_HERE
  }
});

app.ports.configure.subscribe(data => {
  const initialViewState = new PSPDFKit.ViewState(data.viewState);
  const config = { ...data, initialViewState };

  PSPDFKit.load(config);
});
```

Here’s how our second iteration looks in the browser:

![2nd Iteration PDF Configuration](/images/blog/2019/open-and-annotate-pdfs-from-your-elm-app/v2.png#img-width-75)

## Third Iteration: Interaction

For our third and final iteration, our aim is to be able to add annotations to the document using Elm.

To do this, we’ll add a button with an `onClick` handler that calls our `update` function. If it receives the `CreateAnnotation` message, our update function creates a new `Annotation` and updates our `Model`. Finally, it dispatches our updated model to a new `annotate` port:

```elm
port module Main exposing (..)

import Browser
import Html exposing (Html, button, div, footer, text)
import Html.Attributes exposing (id, style)
import Html.Events exposing (onClick)



-- MODEL


type alias Model =
    { pdf : String
    , container : String
    , licenseKey : String
    , viewState : ViewState
    , annotations : List Annotation
    }


type alias ViewState =
    { currentPageIndex : Int
    , sidebarMode : String
    }


type alias Annotation =
    { pageIndex : Int
    , text : String
    , fontSize : Int
    , isBold : Bool
    , fontColor : String
    , backgroundColor : String
    , horizontalAlign : String
    , verticalAlign : String
    , boundingBox : Rect
    }


type alias Rect =
    { left : Int
    , top : Int
    , width : Int
    , height : Int
    }


type alias Flags =
    { licenseKey : String }


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        model =
            { pdf = "example.pdf"
            , container = "#PSPDFKitContainer"
            , licenseKey = flags.licenseKey
            , annotations = []
            , viewState =
                { currentPageIndex = 1
                , sidebarMode = "THUMBNAILS"
                }
            }
    in
    ( model, configure model )



-- UPDATE


type Msg
    = SetConfig
    | CreateAnnotation


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SetConfig ->
            ( model, configure model )

        CreateAnnotation ->
            let
                annotation =
                    { pageIndex = 1
                    , text = "Hello from Elm 🌳"
                    , fontSize = 50
                    , isBold = True
                    , fontColor = "WHITE"
                    , backgroundColor = "GREEN"
                    , horizontalAlign = "center"
                    , verticalAlign = "center"
                    , boundingBox =
                        { left = 100
                        , top = 100
                        , width = 500
                        , height = 200
                        }
                    }
            in
            ( model, annotate { model | annotations = [ annotation ] } )



-- PORT


port configure : Model -> Cmd msg


port annotate : Model -> Cmd msg



-- VIEW


view model =
    div
        []
        [ div [ id "PSPDFKitContainer", style "height" "90vh" ] []
        , footer [ style "text-align" "center", style "line-height" "10vh" ]
            [ button [ onClick CreateAnnotation ] [ text "Create Annotation" ]
            ]
        ]



-- PROGRAM


main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }
```

The only significant change on the JS side is that we now need to subscribe to the `annotate` port to receive the updated model. There we simply loop through the annotations and coerce their attributes into the types that `PSPDFKit` is expecting:

```js
import { Elm } from "./Main";
import PSPDFKit from "pspdfkit";

let instance;

const app = Elm.Main.init({
  node: document.body,
  flags: {
    licenseKey: YOUR_LICENSE_KEY_GOES_HERE
  }
});

app.ports.configure.subscribe(data => {
  const initialViewState = new PSPDFKit.ViewState(data.viewState);
  const config = { ...data, initialViewState };

  PSPDFKit.load(config).then(async pspdfkit => {
    instance = pspdfkit;
  });
});

app.ports.annotate.subscribe(data => {
  data.annotations.forEach(a => {
    const annotation = new PSPDFKit.Annotations.TextAnnotation({
      ...a,
      fontColor: new PSPDFKit.Color(PSPDFKit.Color[a.fontColor]),
      backgroundColor: new PSPDFKit.Color(PSPDFKit.Color[a.backgroundColor]),
      boundingBox: new PSPDFKit.Geometry.Rect(a.boundingBox)
    });

    instance.createAnnotation(annotation);
  });
});
```

Here’s how our third iteration looks in the browser:

![3rd Iteration PDF Interaction](/images/blog/2019/open-and-annotate-pdfs-from-your-elm-app/v3.png#img-width-75)

## Conclusion

I hope this post has given you further insight into how JS interop works in Elm. These principles can be applied to working with any JavaScript library, and the basic pattern is the same: We define explicitly what and how data flows between Elm and the browser via `ports`, which gives us access to the things we need from JS while allowing us to keep the core of our application logic in Elm.

This might seem like a lot of overhead, but in many ways, it is not that different from talking to an API or delegating to some native code, and the beauty of the Elm language, [architecture][elm architecture], and compiler really make it worth exploring.

[pspdfkit for web]: https://pspdfkit.com/web/
[pspdfkit for web configuration]: https://pspdfkit.com/api/web/PSPDFKit.Configuration.html
[open a pdf in elm]: /blog/2019/open-pdf-in-elm/
[try]: /try
[example pdf]: /images/blog/2019/open-and-annotate-pdfs-from-your-elm-app/example.pdf
[elm project]: https://github.com/PSPDFKit/pspdfkit-web-example-elm
[example projects]: https://github.com/PSPDFKit?q=web-example
[webpack]: https://webpack.js.org/
[elm-webpack-loader]: https://github.com/elm-community/elm-webpack-loader
[webpack config]: https://github.com/PSPDFKit/pspdfkit-web-example-elm/blob/master/config/webpack.js
[`ports`]: https://guide.elm-lang.org/interop/ports.html
[elm architecture]: https://guide.elm-lang.org/architecture/
[custom type]: https://guide.elm-lang.org/types/custom_types.html
[encode]: https://package.elm-lang.org/packages/elm-lang/core/latest/Json-Encode
