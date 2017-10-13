'use strict'
const utils = require('./utils') // 工具类
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge') // 使用webpack配置合并插件
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 这个插件自动生成HTML，并注入到.html文件中
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// 将hot-reload相对路径添加到webpack.base.conf的对应的entry前面
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
        baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
    })
    // webpack.dev.conf.js与webpack.base.conf.js中的配置合并
module.exports = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    // webpack-devtool有7种模式，cheap-module-eval-source-map模式是比较快的开发模式
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        // 你可以理解为，通过配置了DefinePlugin，那么这里面的标识就相当于全局变量，你的业务代码可以直接使用配置的标识。
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        // hotModule插件让页面变动时，只重绘对应的模块，不会重绘整个HTML文件
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        // 将生成的HTML代码注入index.html文件
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        // friendly-errors-webpack-plugin用于更友好地输出webpack的警告、错误等信息
        new FriendlyErrorsPlugin()
    ]
})