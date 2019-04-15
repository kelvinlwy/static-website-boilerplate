require('dotenv').config({path: __dirname + '/.env.development'});

const path = require('path');
const plugins = require('./webpack.plugins').devPlugins;
const optimization = require('./webpack.optimization').devOptimization;
const rules = require('./webpack.rules');

module.exports = {
  entry: [
    path.join(__dirname, 'src/index.js'),
    path.join(__dirname, 'src/styles/styles.scss'),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  module: {
    rules
  },
  plugins,
  optimization,
  stats: {
    colors: true
  },
  resolve: {
    extensions: ['.js', '.json', 'jsx']
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    port: process.env.PORT || 9000,
    host: process.env.HOST || 'localhost',
    hot: true,
    writeToDisk: false,
    open: true
  }
};
