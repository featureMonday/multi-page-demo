'use strict';
const MODE = process.env.NODE_ENV || 'development';
const path = require("path");
const apiMocker = require('webpack-api-mocker');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取单独打包css文件

const fs = require('fs');
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}
const historyApiFallbackList = [];
// 读取src/page下的所有页
const pages = fs.readdirSync(resolve('src/page'));
pages.forEach((page) => {
  var stat = fs.lstatSync(`src/page/${page}`);
  if (stat.isDirectory()) {

    historyApiFallbackList.push({
      from: new RegExp("^\/"+ page +"\/"),
      to: `/${page}${config.dev.assetsPublicPath}index.html`,
    });
  }
});

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: MODE, // 设定环境
  devtool: config.dev.devtool,
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups:{ // 这里开始设置缓存的 chunks
        commons: { // key 为entry中定义的 入口名称
          test: /src/,
          chunks: "initial", // 必须三选一： "initial" | "all" | "async"(默认就是async)
          name: "commons", // 要缓存的 分隔出来的 chunk 名称
          minSize: 0,
          minChunks: 2,
          maxInitialRequests: 5,
          reuseExistingChunk: true, // 可设置是否重用该chunk
        }
      }
    },
    runtimeChunk: {
      name: 'manifest',
    },
  },
  plugins: [
    //配置环境变量
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(MODE),
      },
    }),
    // css 提取
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
      sourceMap: true,
    }),
    new webpack.SourceMapDevToolPlugin(), // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/29
    // 启用模块热替换(HMR)
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [
          `Your application is running here: http://${config.dev.host}:${
            config.dev.port
          }`,
        ],
      },
    }),
  ],
});

module.exports = devWebpackConfig;
