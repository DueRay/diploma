'use strict';

const path = require('path');
const args = require('minimist')(process.argv.slice(2));

// List of allowed environments
const allowedEnvs = ['dev', 'prod'];

let env = 'dev';

if (args.env && allowedEnvs.indexOf(args.env) !== -1) {
  env = args.env;
}

let config = require(path.join(__dirname, 'cfg/' + env));

module.exports = config;
