const buble = require('rollup-plugin-buble');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');

const version = require('./package.json').version;

const banner =
    '/*!\n' +
    ' * PromiseRsvp v' + version + '\n' +
    ' * (c) 2014-' + new Date().getFullYear() + ' xuxihai\n' +
    ' * Released under the MIT License.\n' +
    ' */';

var config = {
  input: 'src/index.js',
  output: {
    name: 'PromiseRsvp',
    file: 'lib/promise.rsvp.js',
    banner: banner,
    format: 'umd',
  },
  plugins: [
    resolve(),
    commonjs(),
    buble(),
  ],
};
var minifyConfig = {};
minifyConfig.input=config.input;
minifyConfig.plugins=config.plugins;
minifyConfig.output = Object.assign({}, config.output);
minifyConfig.output.file = minifyConfig.output.file.replace(/\.js/, '.min.js');

module.exports = [config, minifyConfig];
