const { join } = require('path');
const args = require('minimist')(process.argv.slice(2));

const srcPath = join(__dirname, '../client');
const publicPath = '/assets/';
// List of allowed environments
const allowedEnvs = ['dev', 'prod'];

let env = 'dev';

if (args.env && allowedEnvs.indexOf(args.env) !== -1) {
  env = args.env;
}

module.exports = {
  cache: false,
  devServer: {
    contentBase: env === 'prod' ? './build/' : './client/',
    compress: true,
    clientLogLevel: 'error',
    hot: true,
    publicPath: publicPath,
    historyApiFallback: true,
    stats: {
      chunks: false,
      modules: false,
      colors: true,
      children: false,
      errorDetails: true
    }
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      actions: `${srcPath}/actions`,
      reducers: `${srcPath}/reducers`,
      components: `${srcPath}/components`,
      sources: `${srcPath}/sources`,
      stores: `${srcPath}/stores`,
      styles: `${srcPath}/styles`,
      config: `${srcPath}/config/` + env
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        include: [].concat([srcPath]),
        options: {
          failOnWarning: true,
          failOnError: true,
          emitErrors: true,
        }
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [].concat([srcPath])
      },
      {
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
    ]
  }
};
