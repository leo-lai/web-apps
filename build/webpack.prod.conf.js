var webpack = require('webpack')
var merge = require('webpack-merge')
var path = require('path')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var PrerenderSpaPlugin = require('prerender-spa-plugin')

var utils = require('./utils')
var config = require('../config')
var baseWebpackConfig = require('./webpack.base.conf')

// 获得入口js文件
var entries = utils.getMultiEntry('./src/' + config.moduleName + '/**/**/*.js') 
var chunks = Object.keys(entries)

var env = process.env.NODE_ENV === 'testing' ? require('../config/test.env') : config.build.env

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  //devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[hash].js'),
    chunkFilename: utils.assetsPath('js/[id].[hash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[hash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin(),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    /* new HtmlWebpackPlugin({
       filename: process.env.NODE_ENV === 'testing'
         ? 'index.html'
         : config.build.index,
       template: 'index.html',
       inject: true,
       minify: {
         removeComments: true,
         collapseWhitespace: true,
         removeAttributeQuotes: true
         // more options:
         // https://github.com/kangax/html-minifier#options-quick-reference
       },
       // necessary to consistently work with multiple chunks via CommonsChunkPlugin
       chunksSortMode: 'dependency'
     }),*/
    // split vendor js into its own file
    /*new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),*/
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // 提取公共模块
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',                 // 公共模块的名称
      chunks: chunks,                 // chunks是需要提取的模块
      // 公共模块被使用的最小次数。比如配置为3，也就是同一个模块只有被3个以外的页面同时引用时才会被提取出来作为common chunks
      minChunks: chunks.length
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   chunks: ['vendor']
    // }),
    /*
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),*/
    // new PrerenderSpaPlugin(
    //   // Absolute path to compiled SPA
    //   path.join(__dirname, '../dist'),
    //   // List of routes to prerender
    //   ['/']
    // )
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp( '\\.(' + config.build.productionGzipExtensions.join('|') + ')$' ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

//构建生成多页面的HtmlWebpackPlugin配置，主要是循环生成
var pages =  utils.getMultiEntry('./src/'+config.moduleName+'/*/template.html')
for (var pathname in pages) {
  var conf = {
    template: pages[pathname],                              // 模板路径
    filename: pathname + '/index.html',                     // 输出路径
    chunks: ['vendor', pathname],                           // 每个html引用的js模块
    inject: true,                                           // js插入位置
    minify: { // more options:https://github.com/kangax/html-minifier#options-quick-reference
      minifyCSS: true,
      // minifyJS: true,
      removeComments: true,
      // collapseWhitespace: true,
      removeAttributeQuotes: false
    },
    favicon: ''
  }

  webpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
}



module.exports = webpackConfig