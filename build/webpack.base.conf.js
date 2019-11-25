'use strict';
const webpack = require('webpack');
const config = require('../config');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const depsPlugin = require('extract-dependency-manifest-plugin');
const WriteJsonPlugin = require('write-json-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取单独打包css文件
const path = require('path');
const fs = require('fs');
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === "development";

console.log('Building on *---' + process.env.NODE_ENV + '---* MODE');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

var entries = {};
var plugins = [];
// 读取src/page下的所有页
const pages = fs.readdirSync(resolve('src/page'));
pages.forEach((page) => {
  var stat = fs.lstatSync(`src/page/${page}`);
  if (stat.isDirectory()) {
    entries[page] = `./src/page/${page}/entry.js`;
    var options = {
      inject: true,
      chunks: [page],
      filename: `${page}/index.html`,
      //optional: 用于指定manifest.json的文件的路径 extract-dependency-manifest-plugin
      manifestpath:`${page}/`, 
      template: 'index.html'
    }

    if (isProduction) {
      options.minify = {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      };
    }
    plugins.push(new HtmlWebpackPlugin(options))
  }
});

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: entries,
  output: {
    path: resolve('dist'),
    filename:
      isProduction
        ? "js/[name].[contenthash:7].js"
        : "js/[name].js",
    chunkFilename:
      isProduction
        ? "js/[name].[contenthash:7].js"
        : "js/[name].js",
    publicPath: isProduction
      ? config.build.assetsPublicPath
      : isDevelopment
        ? config.dev.assetsPublicPath
        : config.local.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.scss'],
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
  },
  module: {
    rules: [
    // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.(le|c)ss$/,
        use: [
          { // 使用 MiniCssExtractPlugin 控件 需要 css-hot-loader 做热替换插件
            loader: 'css-hot-loader',
            options: {
              sourceMap: true,
            },
          },
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.(vue|js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        include: resolve('src'),
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        include: resolve('src'),
      },
      {
        test: /\.js$/,
        use: isProduction
          ? [
              {
                loader: 'cache-loader',
                options: {
                  cacheDirectory: resolve('cache-loader'),
                },
              },
              'babel-loader',
            ]
          : ['babel-loader'],
        exclude: /node_modules/,
        include: resolve('src'),
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]',
        },
      },
      {
        test: /.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')],
        options: {
          limit: 10000,
          name: 'img/[name].[hash:4].[ext]',
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:4].[ext]',
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:4].[ext]',
        },
      },
    ],
  },
  plugins: plugins.concat ([
    //keep module.id stable when vendor modules does not change
    new depsPlugin(JSON.stringify(require("../package.json").version)),
    new WriteJsonPlugin({
      object: {
        version: require('../package.json').version,
      },
      filename: 'version.json',
      pretty: true, // makes file human-readable (default false)
    }),
    new webpack.HashedModuleIdsPlugin(),
    new VueLoaderPlugin(), // vue loader 15 必须添加plugin
  ]),
};
