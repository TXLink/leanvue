'use strict'
///build主要的工作是：检测node和npm版本，删除dist包，webpack构建打包，
///在终端输出构建信息并结束，如果报错，则输出报错信息。

require('./check-versions')()

process.env.NODE_ENV = 'production'
    // 在终端显示的旋转器插件
const ora = require('ora')
const rm = require('rimraf') // 用于删除文件夹
const path = require('path')
const chalk = require('chalk') // 终端文字颜色插件
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()
    // 删除dist文件夹，之后webpack打包
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err
    webpack(webpackConfig, function(err, stats) {
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
            process.exit(1)
        }

        console.log(chalk.cyan('  Build complete.\n'))
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ))
    })
})