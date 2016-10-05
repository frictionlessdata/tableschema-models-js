'use strict'

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: { library: 'JSONTableSchemaModels', libraryTarget: 'umd' },
  node: {
    fs: "empty"
  }
}
