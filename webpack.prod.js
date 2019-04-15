require('dotenv').config({path: __dirname + '/.env.production'});

const path = require('path');
const plugins = require('./webpack.plugins').prodPlugins;
const optimization = require('./webpack.optimization').prodOptimization;
const rules = require('./webpack.rules');

module.exports = {
  entry: {
    main: path.join(__dirname, 'src/index.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  mode: 'production',
  module: {
    rules
  },
  plugins,
  optimization,
  resolve: {
    extensions: ['.js', '.json', 'jsx']
  },
};
