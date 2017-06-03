/*eslint no-console:0 */
'use strict';
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.config');
new WebpackDevServer(webpack(config), config.devServer)
  .listen(3000, 'localhost', (err) => {
    if (err) {
      console.log(err);
    }
    console.log('Listening: ');
  });
