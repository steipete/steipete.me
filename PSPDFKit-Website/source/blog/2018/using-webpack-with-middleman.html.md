---
title: "Using webpack with Middleman"
description: "We explain how to integrate Middleman and webpack to boost your frontend productivity."
preview_image: /images/blog/2018/using-webpack-with-middleman/article-header.png
section: blog
author:
  - William Meleyal
author_url:
  - http://meleyal.com
date: 2018-03-26 12:00 UTC
tags: Development, Infrastructure
published: true
---

[Middleman][] is the static site generator we use for building all of our websites here at PSPDFKit. It enables us to build sites, both large and small, using Ruby, while generating static output that’s easy to deploy.

For a long time, Middleman has relied on the [Rails Asset Pipeline][] (aka [sprockets][]) for compiling and bundling frontend assets (CSS, JavaScript, etc.) However, as the frontend ecosystem has evolved, some of what sprockets provides is now native to the web platform (e.g. JavaScript’s module system), while other aspects (compilation, bundling) are better served by newer tools that take advantage of JavaScript’s latest features.

## Middleman v4 and `:external_pipeline`

Middleman v4 embraces this ecosystem with its new [`:external_pipeline`][] feature, which, according to its website:

> “allows Middleman to run multiple subprocesses which output content to temporary folders which are then merged into the Middleman sitemap.”

In other words, we can run Middleman side by side with whatever build tool we choose and it will take care of combining the results into a final file tree.

We chose to use [webpack][] — a module bundler that can handle all types of frontend assets and compile the result into a bundle for serving to the browser — as our build tool because we already use it successfully in [PSPDFKit for Web][]. This article will discuss webpack in more detail, but the approach should be similar for other build tools such as [Broccoli][] or [gulp][].

## Create a `package.json`

For the purposes of this article, we’ll presume you already have a Middleman project you want to migrate to use `:external_pipeline`. (If not, see the [Middleman Documentation][] for help setting one up.)

First we’ll need to install webpack. Similar to how we use `bundler` to manage Gems in Ruby, we’ll use [`npm`][] to manage our frontend packages. `npm` has a setup command that will run you through creating a `package.json` file:

```shell
npm init
```

Check the contents of `package.json`, and you’ll see it’s fairly bare bones and just includes the information you entered during setup. This file is equivalent to bundler’s `Gemfile` and will list all of our frontend dependencies.

## Install webpack

Let’s add webpack as a dependency:

```shell
npm install --save-dev webpack
```

Check the contents of `package.json` again and you’ll notice that webpack is now listed under `devDependencies`:

```json
"devDependencies": {
  "webpack": "^3.10.0"
}
```

While we’re here, let’s install some additional webpack-related tools we’ll be needing later:

```shell
npm install --save-dev css-loader extract-text-webpack-plugin node-sass postcss-flexbugs-fixes postcss-loader sass-loader
```

Also notice that a `node_modules` directory was created in your project. This is where all our installed packages live. As we have already specified them in our `package.json`, there’s no need to commit them, so we’ll ignore them from Git:

```shell
echo node_modules >> .gitignore
```

## Install Bootstrap

For demonstration purposes, let’s say we want to use [Bootstrap][] in our project. Previously, we might have used the [`bootstrap-sass`][] gem or static files from the Bootstrap distribution. We can now use `npm`:

```shell
npm install --save bootstrap@4.0.0 jquery popper.js
```

Here we specified the `4.0.0` version of Bootstrap, along with its JavaScript dependencies, jQuery and Popper.js.

Checking the contents of `package.json`, we see our new packages listed under `dependencies`:

```json
"dependencies": {
  "bootstrap": "^4.0.0",
  "jquery": "^3.2.1",
  "popper.js": "^1.12.9"
}
```

_(For an explanation of the difference between `dependencies` and `devDependencies`, see the [npm docs][].)_

## Configure webpack

webpack is very much a blank slate and needs to be configured to our needs. By default, it looks for a `webpack.config.js` file in our project directory, so let’s create that now with the following contents (loosely based on [the example webpack configuration from the Bootstrap docs][]):

```js
// webpack.config.js

var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    site: ['./assets/javascripts/index.js', './assets/stylesheets/index.scss']
  },
  output: {
    filename: 'assets/javascripts/[name].js',
    path: path.resolve(__dirname, '.tmp/dist')
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: function() {
                  return [
                    require('autoprefixer'),
                    require('postcss-flexbugs-fixes')
                  ]
                }
              }
            },
            'sass-loader'
          ]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'assets/stylesheets/[name].css'
    })
  ]
}
```

An explanation of the entire configuration is beyond the scope of this article, but the first relevant lines to note are:

```js
entry: {
  application: [
    './assets/javascripts/index.js',
    './assets/stylesheets/index.scss'
  ]
},
```

Coming from the Rails Asset Pipeline, we can think of this as telling webpack that these are our “manifest” files.

Let’s create those two files now with the following contents:

```js
// assets/javascripts/index.js

import 'jquery'
import 'popper.js'
import 'bootstrap'
```

```scss
// assets/stylesheets/index.scss

@import '~bootstrap/scss/bootstrap.scss';
```

Notice that these files live in their own `assets` directory at the top level of the project and are not in the `source` directory as usual. This will be important in the next step.

The final line of note from `webpack.config.js` is:

```js
output: {
  ...
  path: path.resolve(__dirname, '.tmp/dist')
},
```

This instructs webpack to place its build output in `.tmp/dist` in our current project. Again, this will be important in the next step, but for now we should ignore these temporary files from version control:

```shell
echo .tmp >> .gitignore
```

## Configure Middleman

If we run our Middleman site now, we might be rather disappointed to discover that not much happens. That’s because the final piece of the puzzle is to configure Middleman to talk to webpack.

We add the following lines to our `package.json`:

```json
"scripts": {
  "start": "webpack --watch --progress --color",
  "build": "webpack --bail -p"
},
```

This defines a couple of npm shortcuts for `start`ing the project in development and `build`ing the project for production. It’s a common npm convention and will help keep our Middleman configuration clean and easy to read.

Now we add the following to our `config.rb`:

```ruby
activate :external_pipeline,
   name: :webpack,
   command: build? ? 'npm run build' : 'npm run start',
   source: '.tmp/dist',
   latency: 1

config[:js_dir] = 'assets/javascripts'
config[:css_dir] = 'assets/stylesheets'
```

Notice that we’re telling Middleman both to use the npm scripts we defined earlier, and where to find the webpack build output (`.tmp/dist`).

Also note that we’re overriding the default `:js_dir` and `:css_dir` configuration. Even when using the `:external_pipeline`, Middleman will attempt to process files in `source/assets/*` (e.g. uglify them), so we neatly sidestepped that issue without the need for complex ignore rules.

Now if we run our site and view the logs, we should see webpack booting up alongside Middleman. If we open the site in the browser, we should also see that both the Bootstrap CSS and JavaScript are being loaded correctly! 🤗

## Conclusion

This might seem like a lot of effort for not much benefit. If everything goes according to plan, there’s no perceivable difference between the resulting build output and that of sprockets.

However, we have access to the entire npm ecosystem. We can piece together our own build system that includes all the goodies that make us more productive and happy, from using [`ES2015+`][] features or [CSS variables][] today, to [adding type support to JavaScript][flow] or developing in a [completely different language][elm webpack loader] altogether.

I hope this article has shown how easy it is to integrate an external build tool with Middleman thanks to `:external_pipeline`, in addition to giving you a taste of the opportunities this opens up.

[middleman]: https://middlemanapp.com/
[rails asset pipeline]: http://guides.rubyonrails.org/asset_pipeline.html
[sprockets]: https://github.com/rails/sprockets
[`:external_pipeline`]: https://middlemanapp.com/advanced/external-pipeline
[webpack]: https://webpack.js.org/
[pspdfkit for web]: https://pspdfkit.com/pdf-sdk/web/
[broccoli]: https://github.com/broccolijs/broccoli
[gulp]: https://gulpjs.com/
[middleman documentation]: https://middlemanapp.com/basics/start-new-site/
[`npm`]: https://www.npmjs.com/
[bootstrap]: http://getbootstrap.com/
[`bootstrap-sass`]: https://rubygems.org/gems/bootstrap-sass/
[npm docs]: https://docs.npmjs.com/getting-started/using-a-package.json#specifying-dependencies
[the example webpack configuration from the bootstrap docs]: http://getbootstrap.com/docs/4.0/getting-started/webpack/
[`es2015+`]: https://babeljs.io/
[css variables]: https://github.com/postcss/postcss
[flow]: https://flow.org/
[elm webpack loader]: https://github.com/elm-community/elm-webpack-loader
