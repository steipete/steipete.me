const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");

module.exports = {
  bail: true,
  entry: {
    application: [
      "./assets/javascripts/index.js",
      "./assets/stylesheets/index.scss"
    ],
    guides: ["./assets/javascripts/guides.js"],
    fonts: ["./assets/stylesheets/fonts.scss"]
  },
  output: {
    filename: "assets/javascripts/[name].js",
    path: path.resolve(__dirname, ".tmp/dist")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: function() {
                return [
                  require("autoprefixer"),
                  require("postcss-flexbugs-fixes")
                ];
              }
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.woff2?$/,
        use: ["url-loader"]
      }
    ]
  },
  resolve: {
    alias: {
      zoom: path.resolve(
        __dirname,
        "node_modules/zoom-vanilla.js/dist/zoom-vanilla.min.js"
      )
    }
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: "assets/stylesheets/[name].css"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      Popper: ["popper.js", "default"]
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
};
