let { join } = require('path');
const webpack = require('webpack');
const base = require('./base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const publicPath = '/assets/';
const extractProd = new ExtractTextPlugin('[hash].prod.css');

let config = Object.assign({}, base, {
  entry: join(__dirname, '../client/index'),
  devtool: 'cheap-module-source-map',
  output: {
    path: join(__dirname, '../build/assets'),
    filename: '[hash].prod.js',
    chunkFilename: '[hash].[id].prod.js',
    publicPath: publicPath
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true,
      minimize: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    extractProd,
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: 'client/index.html',
      filename: '../index.html'
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
});

config.module.rules.push({
  test: /\.css$/,
  loader: extractProd.extract({
    fallback: 'style-loader',
    use: ['css-loader',
      'postcss-loader']
  })
});
config.module.rules.push({
  test: /\.scss$/,
  loader: extractProd.extract({
    fallback: 'style-loader',
    use: ['css-loader',
      'resolve-url-loader',
      'sass-loader?sourceMap',
      'postcss-loader']
  })
});

module.exports = config;
