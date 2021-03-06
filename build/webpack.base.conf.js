var path = require('path')
var webpack = require('webpack')

var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
const vuxLoader = require('vux-loader')

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
        // exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
        include: [resolve('src'), resolve('node_modules/vue-echarts')]
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
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[ext]')
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
  plugins: [
    new webpack.ProvidePlugin({
      'window.Quill': 'quill/dist/quill.min.js'
    })
  ]
}

module.exports = vuxLoader.merge(webpackConfig, {
  plugins: ['vux-ui', 'progress-bar', 'duplicate-style']
})
