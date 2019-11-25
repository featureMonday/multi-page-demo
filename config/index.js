'use strict';

const path = require('path');
const version = require('../package').version;
// 一些常规配置化管理
const host = '0.0.0.0';
const port = '8000';

module.exports = {
    local: {
    // Paths
    assetsSubDirectory: "static",
    assetsPublicPath: "/multi-page-demo/", // 相对文件路径
    proxyTable: {
      "/dev-api": {
        target: `http://0.0.0.0:8000/mock`,
        changeOrigin: true,
        pathRewrite: {
          "^/dev-api": ""
        }
      }
    },
    host: "0.0.0.0", // 为了方便别人访问，请设置0.0.0.0
    port: "8000", // 端口号
    autoOpenBrowser: true, // 是否自动打开浏览器
    errorOverlay: true, // 浏览器错误提示遮罩层
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    devtool: "eval-source-map", // Source Maps
    disableHostCheck: false // 当设置为true时，该选项绕过主机检查。不建议这样做，因为不检查主机的应用程序容易受到DNS重新绑定攻击。
  },
  dev: {
    assetsSubDirectory: 'static', // 静态文件目录
    assetsPublicPath: `http://test.fsp-cdn.vortex.zj.chinamobile.com:8000/multi-page-demo/${version}/`, // 相对文件路径
    proxyTable: {},
    host,
    port,
    autoOpenBrowser: true, // 是否自动打开浏览器
    errorOverlay: true, // 浏览器错误提示遮罩层
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    devtool: 'eval-source-map', // Source Maps
    disableHostCheck: false, // 当设置为true时，该选项绕过主机检查。不建议这样做，因为不检查主机的应用程序容易受到DNS重新绑定攻击。
  },
  build: {
    // html模板
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath:`http://fsp-cdn.vortex.zj.chinamobile.com/multi-page-demo/${version}/`, // 相对文件路径
    // 生产环境的souce map
    // https://webpack.js.org/configuration/devtool/#production
    // 生产环境下source map devtool 不做配置
    devtool: 'source-map',
    // 生产环境下souce map的内网位置，private sourceMap
    sourcePath: '',
    // 开启静态文件的Gzip压缩
    // 如果是true 的话  需要 npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // 打包完成显示包大小的状态分析
    // `npm run build --report`
    bundleAnalyzerReport: process.env.npm_config_report,
  },
};
