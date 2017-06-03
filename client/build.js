/*eslint no-console:0 */
'use strict';
const webpack = require('webpack');
const argv = require('yargs').argv;

let profile = argv.env || 'dev';
const config = require('../cfg/' + profile);

webpack(config, function(err, stats) {
  console.log(stats.toString({
    chunks: false,
    colors: true,
    children: false,
    errorDetails: true
  }));
});
