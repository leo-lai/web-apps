var path = require('path')
var webpack = require('webpack')
var glob = require('glob')

var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

// 获得入口js文件
var entries = utils.getMultiEntry('./src/'+ config.moduleName +'/*/main.js') 
var chunks = Object.keys(entries)

var projectRoot = path.resolve(__dirname, '../')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

var webpackConfig = {
  entry: entries,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('images/[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      },

    ]
  },
  plugins: []
}

module.exports = webpackConfig

// const vuxLoader = require('vux-loader')
// module.exports = vuxLoader.merge(webpackConfig, {
//   options: {

//   },
//   plugins: ['vux-ui', 'progress-bar', 'duplicate-style']
// })