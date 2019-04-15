const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV === "development";
const sourceMap = process.env.NODE_ENV === "development";
const hmr = process.env.NODE_ENV === "development";
const neat = require('bourbon-neat').includePaths;

// JS rules
const js = {
  test: /\.js(x)$/,
  exclude: /(node_modules|bower_components)/,
  use: ["babel-loader", "eslint-loader"]
};

// File rules
const file = {
  test: /\.(png|jpe?g|gif|svg|ico)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]',
      },
    },
    {
      loader: 'url-loader',
      options: {
        name: '[path][name].[ext]',
        limit: 10000
      }
    }
  ],
};

// CSS rules
const css = {
  test: /\.css$/,
  exclude: /(node_modules|bower_components)/,
  use: [
    !devMode && {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr
      },
    },
    devMode && {
      loader: 'style-loader',
      options: {
        sourceMap,
        hmr
      },
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap
      },
    },
    'extract-loader',
    'resolve-url-loader'
  ].filter(Boolean)
};

// SASS rules
const sass = {
  test: /\.s[c|a]ss$/,
  exclude: /(node_modules|bower_components)/,
  use: [
    !devMode && {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr
      },
    },
    devMode && {
      loader: 'style-loader',
      options: {
        sourceMap,
        hmr
      },
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap,
      },
    },
    'resolve-url-loader',
    {
      loader: 'sass-loader',
      options: {
        sourceMap,
        includePaths: [neat]
      },
    }
  ].filter(Boolean),
};

// Font rules
const fonts = {
  test: /\.(woff|woff2|eot|ttf|otf)$/,
  use: [
    {
      loader: 'file-loader',
      query: {
        name: '[name].[ext]',
        outputPath: 'assets/fonts/',
      }
    }
  ]
};

module.exports = [
  js,
  file,
  css,
  sass,
  fonts
];
