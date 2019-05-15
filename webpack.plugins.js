const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const SitemapPlugin = require('sitemap-webpack-plugin').default;
const RobotstxtPlugin = require('robotstxt-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const devMode = process.env.NODE_ENV === "development";

/**
 * This creates global constants which are configured at compile time.
 */
const define = new webpack.DefinePlugin({
  BASE_URL: JSON.stringify(process.env.BASE_URL)
});

/**
 * All files inside webpack's output.path directory will be removed once, but the
 * directory itself will not be. If using webpack 4+'s default configuration,
 * everything under <PROJECT_DIR>/dist/ will be removed.
 * Use cleanOnceBeforeBuildPatterns to override this behavior.
 *
 * During rebuilds, all webpack assets that are not used anymore
 * will be removed automatically.
 **/
const clean = new CleanWebpackPlugin();

/**
 * Hot module replacement is for development ONLY
 */
const hmr = new webpack.HotModuleReplacementPlugin();

// Get your website relative paths which are based on html file names in views folder
const _paths = glob.sync('./src/**/[!_]*.html').map(dir => path.basename(dir));

/**
 * Generate a sitemap for your website
 * First parameter is your rool URL of your site
 * Second paramter is the array of relatives on your site
 * For more information, please see https://github.com/schneidmaster/sitemap-webpack-plugin
 **/
const sitemap = new SitemapPlugin(process.env.BASE_URL, _paths, {skipGzip: true});

/**
 * Generate robots.txt
 */
const robots = new RobotstxtPlugin({
  sitemap: `${process.env.BASE_URL}/sitemap.xml`,
  host: process.env.BASE_URL,
});

/**
 * Stylelint
 */
const stylelint = new StyleLintPlugin();

/**
 * MiniCssExtractPlugin is to extract CSS into separate files.
 * It supports async loading and avoid duplicate compilation, but specific to CSS only
 */
const miniCss = new MiniCssExtractPlugin({
  // Options similar to the same options in webpackOptions.output
  // both options are optional
  filename: devMode ? '[name].css' : '[name].[hash].css',
  chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
});

/**
 * The HtmlWebpackPlugin will generate an HTML5 pages
 */
const htmlPages = () => glob.sync('./src/**/[!_]*.html').map(
  dir => {
    return new HtmlWebpackPlugin({
      template: dir, // Input
      filename: path.basename(dir), // Output
      inject: true,
      minify: process.env.NODE_ENV === "production",
      templateParameters: {
        page: path.basename(dir, '.html')
      }
    })
  }
);

// Create the ga script with provided ga ID
const _gaID = process.env.GOOGLE_ANALYTICS_UA || '';
const _gaScript = `<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create',${_gaID},'auto');ga('send','pageview');</script>`;

/**
 * This plugin is to create and analytics.js to your site
 */
class GoogleAnalyticsPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('GoogleAnalyticsPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'GoogleAnalyticsPlugin',
        (data, cb) => {
          data.html = data.html.replace('</head>', `</head>${_gaScript}`);
          cb(null, data);
        },
      );
    });
  }
}

const ga = new GoogleAnalyticsPlugin();

/**
 * Use CopyWebpackPlugin to copy img directory from src to dist
 */
const copyFiles = new CopyWebpackPlugin([
  {from: './src/img/', to: './img/'},
]);

/**
 * Use WebappWebpackPlugin to generate your favicon
 */
const favicon = new WebappWebpackPlugin({
  // Your source logo (required)
  logo: './src/img/favicon.svg',
  // Enable caching and optionally specify the path to store cached data
  // Note: disabling caching may increase build times considerably
  cache: true,
  // Inject html links/metadata (requires html-webpack-plugin).
  inject: true,
});

const prodPlugins = [
  define,
  clean,
  sitemap,
  robots,
  stylelint,
  miniCss,
  ga,
  copyFiles,
  ...htmlPages(),
  favicon
].filter(Boolean);

const devPlugins = [
  define,
  clean,
  hmr,
  stylelint,
  miniCss,
  ...htmlPages(),
  favicon
].filter(Boolean);

module.exports = {
  prodPlugins: prodPlugins,
  devPlugins: devPlugins
};
