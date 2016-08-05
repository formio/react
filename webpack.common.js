var webpack = require('webpack');

module.exports = {
  entry: "./src/Formio.jsx",
  output: {
    filename: "Formio.js",
    path: "./dist",
    libraryTarget: "umd",
    library: "Formio"
  },
  externals: [
    "react",
    "react-dom"
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      requirejs$:  "./dist/build/",

    },
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: "eslint",
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /require\.js$/,
        loader: "exports?requirejs!script"
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015']
        }
      }
    ],
    plugins: [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        output: {
          comments: false
        },
        sourceMap: false
      }),
    ],
    noParse: [
      /node_modules\/formiojs\//,
    ],
  }
};