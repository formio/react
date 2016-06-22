
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
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
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
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015']
        }
      }
    ],
    resolve: {
      extensions: ['', '.js', '.jsx'],
      alias: {
        requirejs$:  "./dist/build/"
      },
    },
    noParse: [
      /node_modules\/formiojs\//,
    ],
  }
};