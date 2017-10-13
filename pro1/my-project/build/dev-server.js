'use strict'
// 首先检查node和npm的版本
require('./check-versions')()

// 获取配置文件中默认的配置
const config = require('../config')
    // 如果node无法判断当前是开发环境还是生产环境，则使用config.dev.env.NODE_ENV作为当前的环境
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn') // 用来在起来服务之后，打开浏览器并跳转指定URL
const path = require('path') // node自带文件路径工具
const express = require('express') // node框架express（本地开发的核心，起服务）
const webpack = require('webpack') // webpack,压缩打包
const proxyMiddleware = require('http-proxy-middleware') // 中间件
const webpackConfig = (process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'production') ?
    require('./webpack.prod.conf') :
    require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port
    // automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser
    // Define HTTP proxies to your custom API backend
    // https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const app = express() // 起服务
const compiler = webpack(webpackConfig) // webpack进行编译

// webpack-dev-middleware将编译的文件放在内存中，后续注入
const devMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        quiet: true
    })
    // 热加载
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
        log: false,
        heartbeat: 2000
    })
    // force page reload when html-webpack-plugin template changes
    // currently disabled until this is resolved:
    // https://github.com/jantimon/html-webpack-plugin/issues/680
    // compiler.plugin('compilation', function (compilation) {
    //   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    //     hotMiddleware.publish({ action: 'reload' })
    //     cb()
    //   })
    // })

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// proxy api requests
// proxyTable中的配置挂载到express中
// proxy api requests
Object.keys(proxyTable).forEach(function(context) {
    const options = proxyTable[context]
    if (typeof options === 'string') {
        options = { target: options }
    }
    app.use(proxyMiddleware(options.filter || context, options))
})

// 处理后退的时候匹配资源
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// 暂存在内存的webpack编译后的文件挂载到express上
// serve webpack bundle output
app.use(devMiddleware)

// 拼static静态资源文件路径
// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
    //express为静态资源提供服务
app.use(staticPath, express.static('./static'))

const uri = 'http://localhost:' + port

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
})

var server
var portfinder = require('portfinder')
portfinder.basePort = port

// 通过配置的端口，自动打开浏览器，并跳转拼好的URL，至此，发开环境已经跑起来了
console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
    portfinder.getPort((err, port) => {
        if (err) {
            _reject(err)
        }
        process.env.PORT = port
        var uri = 'http://localhost:' + port
        console.log('> Listening at ' + uri + '\n')
            // when env is testing, don't need open it
        if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
            opn(uri)
        }
        server = app.listen(port)
        _resolve()
    })
})

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close()
    }
}