'use strict';
const MODE = process.env.NODE_ENV || 'local';
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
      to: `/${page}${config.local.assetsPublicPath}index.html`,
    });
  }
});

const localWebpackConfig = merge.smartStrategy({
  'module.rules.use': 'prepend',
})(baseWebpackConfig, {
  mode: 'development', // 设定环境
  devtool: config.local.devtool,
  devServer: {
    before(app) {
      if (process.env.MOCK) {
        apiMocker(app, path.resolve('mock/api.js'));
      }
    },
    // 当使用内联模式(inline mode)时，控制台(console)将显示消息，可能的值有 none, error, warning 或者 info（默认值）。
    clientLogLevel: 'none',
    //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    historyApiFallback: {
      rewrites: historyApiFallbackList,
    },
    // 启用 webpack 的模块热替换特性
    hot: true,
    // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要。我们这里直接禁用掉
    contentBase: false,
    // 一切服务都启用gzip 压缩：
    compress: true,
    // 指定使用一个 host。默认是 localhost
    host: config.local.host,
    // 指定要监听请求的端口号
    port: config.local.port,
    open: config.local.autoOpenBrowser,
    // dev服务器自动打开浏览器。
    //open: config.dev.autoOpenBrowser,
    // 当出现编译器错误或警告时，在浏览器中显示全屏遮罩层。默认情况下禁用。
    overlay: config.local.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    // 浏览器中访问的相对路径
    publicPath: config.local.assetsPublicPath,
    // 代理配置
    proxy: config.local.proxyTable,
    // 除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
    // 我们配置 FriendlyErrorsPlugin 来显示错误信息到控制台
    quiet: true,
    // webpack 使用文件系统(file system)获取文件改动的通知。监视文件
    watchOptions: {
      poll: config.local.poll,
    },
    disableHostCheck: config.local.disableHostCheck,
  },
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
          `Your application is running here: http://${config.local.host}:${
            config.local.port
          }`,
        ],
      },
    }),
  ],
});

module.exports = localWebpackConfig;
