const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// To void duplicated dependencies across them and optimize them
const splitChunks = {
  chunks: 'all',  // all chunks will be optimized and can be shared between async and non-async chunks.
  minSize: 30000, // minimum 30kb, for a chunk to be generated
  maxSize: 0,
  minChunks: 1,
  maxAsyncRequests: 5,
  maxInitialRequests: 3,
  automaticNameDelimiter: '~',
  name: true,     // split chunk name will be generated based on chunks and cache group key
  cacheGroups: {
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10
    },
    default: {
      minChunks: 2,
      priority: -20,
      reuseExistingChunk: true
    }
  }
};

/**
 * This plugin is to minify JS
 */
const uglify = new UglifyJsPlugin();

/**
 * This plugin is to minimize CSS assets.
 */
const optimizeCss = new OptimizeCssAssetsPlugin();

const prodOptimization = {
  splitChunks,
  minimizer: [
    uglify,
    optimizeCss
  ]
};

const devOptimization = {
  splitChunks
};

module.exports = {
  devOptimization: devOptimization,
  prodOptimization: prodOptimization
};
