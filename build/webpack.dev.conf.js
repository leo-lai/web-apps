var webpack = require('webpack')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

var utils = require('./utils')
var config = require('../config')
var baseWebpackConfig = require('./webpack.base.conf')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    /*  
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),*/
    new FriendlyErrorsPlugin()
  ]
})


var pages =  utils.getMultiEntry('./src/'+config.moduleName+'/*/template.html')
for (var pathname in pages) {
  var conf = {
    template: pages[pathname],                  // 模板路径
    filename: pathname + '.html',               // 输出路径
    chunks: [pathname],                         // 每个html引用的js模块
    inject: true,                               // js插入位置
    minify: { // more options:https://github.com/kangax/html-minifier#options-quick-reference
      // minifyCSS: true,
      // minifyJS: true,
      removeComments: true,
      // collapseWhitespace: true,
      removeAttributeQuotes: false
    },
    favicon: ''
  }

  if(pathname === 'default'){
    conf.filename = 'index.html'
  }else{
    conf.filename = pathname + '/index.html'
  }
  
  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  module.exports.plugins.push(new HtmlWebpackPlugin(conf))
}
