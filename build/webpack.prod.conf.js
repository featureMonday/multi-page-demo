'use strict';
const MODE = process.env.NODE_ENV || 'production'; //命令行传入用于设置webpack mode + process.env.node_env
const webpack = require('webpack');
const merge = require('webpack-merge'); // webpack merge 工具包
const baseWebpackConfig = require('./webpack.base.conf'); // 基础配置引入
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // js压缩优化配置
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取单独打包css文件
const path = require('path');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const config = require('../config');

const prodWebpackConfig = merge(baseWebpackConfig, {
  mode: MODE, // 设定环境
  optimization: {
    // webpack4.0 新加优化策略
    minimizer: [
      new UglifyJsPlugin({
        parallel: true, // 开启并行压缩，充分利用cpu
        extractComments: false, // 移除注释
        sourceMap: true,
        cache: true,
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(MODE),
      },
    }),
    new cleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../'),
      verbose: true /**是否打印日志**/,
      dry: false /**测试用，true时不会真正删除文件**/,
    }),
    // css 提取
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:7].css',
      chunkFilename: 'css/[id].[contenthash:7].css',
      sourceMap: true,
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      append: `\n//# sourceMappingURL=${config.build.sourcePath}[url]`,
    }),
  ],
});

module.exports = prodWebpackConfig;
