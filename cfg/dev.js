let { resolve } = require('path');
const webpack = require('webpack');
const base = require('./base');
let srcPath = resolve(__dirname, '../client');

module.exports = Object.assign({}, base, {
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './index.js'
  ],
  resolve: {
    extensions: ['.js'],
    alias: {
      actions: `${srcPath}/actions`,
      reducers: `${srcPath}/reducers`,
      components: `${srcPath}/components`,
      sources: `${srcPath}/sources`,
      stores: `${srcPath}/stores`,
      styles: `${srcPath}/styles`,
      routes: `${srcPath}/routes`,
      utils: `${srcPath}/utils`,
      img: `${srcPath}/img`,
      config: `${srcPath}/config/local`
    }
  },
  output: {
    filename: 'app.js',
    path: resolve(__dirname, '../build'),
    publicPath: '/'
  },

  context: resolve(__dirname, '../client'),

  devtool: 'inline-source-map',

  devServer: {
    hot: true,
    contentBase: resolve(__dirname, '../client'),
    publicPath: '/',
    historyApiFallback: true,
    stats: {
      chunks: false,
      modules: false,
      colors: true,
      children: false,
      errorDetails: true
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          'babel-loader'
        ],
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        use: [{loader: 'style-loader'},
          {loader: 'css-loader'},
          {loader: 'postcss-loader'}]
      }, {
        test: /\.scss$/,
        use: ['style-loader',
          'css-loader',
          'resolve-url-loader',
          {loader:'sass-loader', options: {sourceMap: true}},
          'postcss-loader']
      }, {
        test: /\.(png|jpg|gif)$/,
        use: [
          'file-loader?hash=sha512&digest=hex&name=images/[hash].[ext]',
          'image-webpack-loader'
        ]
      },
      {
        test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader : 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(mp4|ogg)$/,
        loader: 'file-loader'
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
});
