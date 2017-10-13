'use strict'
// Template version: 1.1.1
// see http://vuejs-templates.github.io/webpack for documentation.

// node自带路径工具.
const path = require('path')
    // 分为两种环境，dev和production
module.exports = {
    build: {
        env: require('./prod.env'), // 使用config/prod.env.js中定义的编译环境
        index: path.resolve(__dirname, '../dist/index.html'), // 编译输入的index.html文件。node.js中，在任何模块文件内部，可以使用__filename变量获取当前模块文件的带有完整绝对路径的文件名,
        assetsRoot: path.resolve(__dirname, '../dist'), // 编译输出的静态资源路径
        assetsSubDirectory: 'static', // 编译输出的二级目录
        assetsPublicPath: '/', // 编译发布的根目录，可配置为资源服务器或者cdn域名
        productionSourceMap: true, //是否开启cssSourceMap
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false, // 是否开启gzip
        productionGzipExtensions: ['js', 'css'], // 需要用gzip压缩的文件扩展名
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require('./dev.env'),
        port: process.env.PORT || 8080, // 起服务的端口
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {}, // 需要代理的接口，可以跨域
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}