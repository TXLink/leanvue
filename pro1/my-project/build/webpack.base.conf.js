'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
    // vue-loader.conf配置文件是用来解决各种css文件的，定义了诸如css,less,sass之类的和样式有关的loader
const vueLoaderConfig = require('./vue-loader.conf')
    // 此函数是用来返回当前目录的平行目录的路径，
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        app: './src/main.js' // 入口
    },
    output: {　　 // 路径是config目录下的index.js中的build配置中的assetsRoot，也就是dist目录
        path: config.build.assetsRoot,
        filename: '[name].js',
        　 // 上线地址，也就是真正的文件引用路径，如果是production生产环境，其实这里都是 '/'
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    //resolve是webpack的内置选项，顾名思义，决定要做的事情，也就是说当使用 import "jquery"，
    //该如何去执行这件事情，就是resolve配置项要做的，
    //import jQuery from "./additional/dist/js/jquery" 这样会很麻烦，可以起个别名简化操作
    resolve: {
        // 省略扩展名，比方说import index form '../js/index', 会默认去找index文件，然后找index.js,.vue,.josn.
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            // 使用上面的resolve函数，意思是用@代替src的绝对路径
            '@': resolve('src'),
        }
    },
    // 不同的模块使用不同的loader
    module: {
        rules: [{　
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src'), resolve('test')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            { // 对vue文件，使用vue-loader解析
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            { // babel-loader把es6解析成es5
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                // url-loader将文件大小低于下面option中limit的图片，转化为一个64位的DataURL，
                //这样会省去很多请求，大于limit的，按[name].[hash:7].[ext]的命名方式放到了static/img下面，
                //方便做cache
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {　　 // 音频和视频文件处理，同上
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {　 // 字体处理，同上
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    }
}