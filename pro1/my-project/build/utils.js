'use strict'
const path = require('path')
const config = require('../config')
    // extract-text-webpack-plugin该插件的主要是为了抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
const ExtractTextPlugin = require('extract-text-webpack-plugin')
    // 返回资源文件路径，path.posix以posix兼容的方式交互，是跨平台的，如果是path.win32的话，只能在win上
exports.assetsPath = function(_path) {
        const assetsSubDirectory = process.env.NODE_ENV === 'production' ?
            config.build.assetsSubDirectory :
            config.dev.assetsSubDirectory
        return path.posix.join(assetsSubDirectory, _path)
    }
    // 通过判断是否是生产环境，配置不同的样式语言的loader配置
exports.cssLoaders = function(options) {
        options = options || {}

        const cssLoader = {
                loader: 'css-loader',
                options: {
                    minimize: process.env.NODE_ENV === 'production',
                    sourceMap: options.sourceMap
                }
            }
            // 生成各种loader配置，通过传入不同的loader和option，将不同样式文件语言的loader拼好，push到loader配置中。
            // generate loader string to be used with extract text plugin
        function generateLoaders(loader, loaderOptions) {
            const loaders = [cssLoader]
            if (loader) {
                loaders.push({
                    loader: loader + '-loader',
                    options: Object.assign({}, loaderOptions, {
                        sourceMap: options.sourceMap
                    })
                })
            }
            // extract-text-webpack-plugin有三个参数，use指需要用什么loader去编译文件；fallback指编译后用什么loader去提取文件；还有一个publicfile用来覆盖项目路径
            // Extract CSS when that option is specified
            // (which is the case during production build)
            if (options.extract) {
                return ExtractTextPlugin.extract({
                    use: loaders,
                    fallback: 'vue-style-loader'
                })
            } else {
                return ['vue-style-loader'].concat(loaders)
            }
        }
        // 对不同的样式语言，返回相应的loader
        // https://vue-loader.vuejs.org/en/configurations/extract-css.html
        return {
            css: generateLoaders(),
            postcss: generateLoaders(),
            less: generateLoaders('less'),
            sass: generateLoaders('sass', { indentedSyntax: true }),
            scss: generateLoaders('sass'),
            stylus: generateLoaders('stylus'),
            styl: generateLoaders('stylus')
        }
    }
    // 生成处理不同的样式文件处理规则
    // Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
    const output = []
    const loaders = exports.cssLoaders(options)
    for (const extension in loaders) {
        const loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }
    return output
}